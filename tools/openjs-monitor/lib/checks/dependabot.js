'use strict';

/**
 * Check if repository has Dependabot enabled
 * @param {Object} repo - Repository configuration
 * @returns {Promise<boolean>} - Whether Dependabot is enabled
 */
async function checkDependabotEnabled(repo) {
  const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/.github/dependabot.yml`;

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
      const hasDependabot = res.status === 200;
      if (hasDependabot) {
        console.log(`✅ ${repo.name} has Dependabot configured`);
      } else if (res.status === 404) {
        console.log(`⚠️ ${repo.name} does not have Dependabot configuration`);
      } else {
        console.log(`⚠️ Error: ${res.status} when checking Dependabot for ${repo.name}`);
      }
      return hasDependabot;
    })
    .catch(error => {
      console.log(`⚠️ Could not determine if ${repo.name} uses Dependabot: ${error.message}`);
      return false;
    });
}

module.exports = checkDependabotEnabled;
