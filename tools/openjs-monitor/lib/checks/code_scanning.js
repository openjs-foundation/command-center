'use strict';

/**
 * Check if repository has Code Scanning (CodeQL) enabled
 * @param {Object} repo - Repository configuration
 * @returns {Promise<boolean>} - Whether Code Scanning is enabled
 */
async function checkCodeScanningEnabled(repo) {
  const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/.github/workflows/codeql-analysis.yml`;

  const headers = {
    'User-Agent': 'openjs-security-monitor'
  };

  // Add authorization header if GitHub token is available
  if (process.env.GH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GH_TOKEN}`;
  }

  const options = {
    method: 'HEAD',
    headers
  };

  return fetch(url, options)
    .then(res => {
      const hasCodeScanning = res.status === 200;
      if (hasCodeScanning) {
        console.log(`✅ ${repo.name} has CodeQL Code Scanning configured`);
      } else if (res.status === 404) {
        console.log(`⚠️ ${repo.name} does not have CodeQL configuration`);
      } else {
        console.log(`⚠️ Error: ${res.status} when checking CodeQL for ${repo.name}`);
      }
      return hasCodeScanning;
    })
    .catch(error => {
      console.log(`⚠️ Could not determine if ${repo.name} uses Code Scanning: ${error.message}`);
      return false;
    });
}

module.exports = checkCodeScanningEnabled;
