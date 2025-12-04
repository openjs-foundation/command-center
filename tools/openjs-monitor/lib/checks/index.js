'use strict';

const checkGitHubSecurityPolicy = require('./security_policy');
const checkDependabotEnabled = require('./dependabot');
const checkCodeScanningEnabled = require('./code_scanning');
const checkSecurityAdvisories = require('./security_advisories');
const { check: checkSecurityMd } = require('./securitymd_check');

/**
 * List of all security practice checks to run
 */
const CHECKS = [
  checkGitHubSecurityPolicy,
  checkDependabotEnabled,
  checkCodeScanningEnabled,
  checkSecurityAdvisories,
  checkSecurityMd
];


module.exports = {
  CHECKS
};
