'use strict';

/**
 * Check if a repo has GitHub Security Policy enabled
 * @param {Object} repo - Repository configuration
 * @returns {Promise<boolean>} - Whether security policy is enabled
 */
async function checkGitHubSecurityPolicy(repo) {
  const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/security/advisories`;

  const headers = {
    'User-Agent': 'openjs-security-monitor'
  };
  
  // Add authorization header if GitHub token is available
  if (process.env.GH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GH_TOKEN}`;
  }
  
  const options = {
    method: 'GET',
    headers
  };

  return fetch(url, options)
    .then(res => {
      const hasSecurityPolicy = res.status === 200;
      if (hasSecurityPolicy) {
        console.log(`✅ ${repo.name} has GitHub Security Policy enabled`);
      } else if (res.status === 404) {
        console.log(`⚠️ ${repo.name} does not have GitHub Security Policy enabled`);
      } else {
        console.log(`⚠️ Error: ${res.status} when fetching ${repo.name} GitHub Security Policy`);
      }
      return hasSecurityPolicy;
    })
    .catch(error => {
      console.log(`❌ Error checking GitHub Security Policy for ${repo.name}: ${error.message}`);
      return false;
    });
}

module.exports = checkGitHubSecurityPolicy;
