'use strict';

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = path.join(__dirname, '..', '..', 'cache');
const CHECKSUM_DIR = path.join(__dirname, '..', '..', 'checksums');

/**
 * Fetches raw content from a GitHub file
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} filePath - Path to file in repository
 * @param {string} branch - Branch name
 * @returns {Promise<string>} - File content
 */
async function getRawFileContent(owner, repo, filePath, branch) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  
  const headers = {};
  
  // Add authorization header if GitHub token is available
  if (process.env.GH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GH_TOKEN}`;
  }
  
  return fetch(url, { headers })
    .then(res => {
      if (res.status !== 200) {
        throw new Error(`Failed to fetch ${url}: ${res.status}`);
      }
      return res.text();
    });
}

/**
 * Calculate SHA-256 checksum for content
 * @param {string} content - Content to hash
 * @returns {string} - Hex-encoded hash
 */
function calculateChecksum(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Saves content to cache
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} filePath - Path in repository
 * @param {string} content - Content to save
 * @returns {Promise<string>} - Path to saved file
 */
async function saveToCache(owner, repo, filePath, content) {
  const fileName = `${owner}_${repo}_${filePath.replace(/\//g, '_')}`;
  const fileCachePath = path.join(CACHE_DIR, fileName);
  await fs.writeFile(fileCachePath, content);
  return fileCachePath;
}

/**
 * Saves checksum for change detection
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} filePath - Path in repository
 * @param {string} checksum - Calculated checksum
 * @returns {Promise<string>} - Path to saved checksum
 */
async function saveChecksum(owner, repo, filePath, checksum) {
  const fileName = `${owner}_${repo}_${filePath.replace(/\//g, '_')}.checksum`;
  const checksumPath = path.join(CHECKSUM_DIR, fileName);
  await fs.writeFile(checksumPath, checksum);
  return checksumPath;
}

/**
 * Gets previously saved checksum if exists
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} filePath - Path in repository
 * @returns {Promise<string|null>} - Previous checksum or null
 */
async function getPreviousChecksum(owner, repo, filePath) {
  const fileName = `${owner}_${repo}_${filePath.replace(/\//g, '_')}.checksum`;
  const checksumPath = path.join(CHECKSUM_DIR, fileName);
  
  try {
    return await fs.readFile(checksumPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // No previous checksum exists
    }
    throw error;
  }
}

/**
 * Check if a repository has a SECURITY.md file
 * @param {Object} repo - Repository configuration
 * @returns {Promise<Object>} - Result with existence and content
 */
async function hasSecurityFile(repo) {
  try {
    const content = await getRawFileContent(
      repo.owner, 
      repo.repo, 
      repo.securityFilePath, 
      repo.branch
    );
    return { exists: true, content };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

/**
 * Monitor a repository's security file for changes
 * @param {Object} repo - Repository configuration
 * @returns {Promise<Object>} - Monitoring results
 */
async function check(repo) {
  try {
    // Check if SECURITY.md exists
    const securityFileResult = await hasSecurityFile(repo);

    if (!securityFileResult.exists) {
      console.log(`${repo.name} does not have a ${repo.securityFilePath} file!`);
      return;
    }

    const content = securityFileResult.content;
    const checksum = calculateChecksum(content);

    const previousChecksum = await getPreviousChecksum(repo.owner, repo.repo, repo.securityFilePath);

    await saveToCache(repo.owner, repo.repo, repo.securityFilePath, content);
    await saveChecksum(repo.owner, repo.repo, repo.securityFilePath, checksum);

    const hasChanged = previousChecksum !== null && previousChecksum !== checksum;

    if (hasChanged) {
      console.log(`🔄 ${repo.name}'s ${repo.securityFilePath} has changed!`);
    } else if (previousChecksum === null) {
      console.log(`✅ ${repo.name}'s ${repo.securityFilePath} initial snapshot taken.`);
    } else {
      console.log(`✅ ${repo.name}'s ${repo.securityFilePath} has not changed.`);
    }
  } catch (error) {
    console.error(`❌ Error monitoring ${repo.name}:`, error);
  }
}

module.exports = {
  check
};
