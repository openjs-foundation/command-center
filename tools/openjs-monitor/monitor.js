#!/usr/bin/env node

'use strict';

const {
  CHECKS
} = require('./lib/checks');
const {
  CACHE_DIR,
  CHECKSUM_DIR
} = require('./cache');
const fs = require('node:fs')

function ensureDirectoriesExist() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.mkdirSync(CHECKSUM_DIR, { recursive: true });
}

const REPOSITORIES = [
  {
    name: 'Node.js',
    owner: 'nodejs',
    repo: 'node',
    securityFilePath: 'SECURITY.md',
    branch: 'main',
    npmPackage: 'node' // Note: actual Node.js runtime doesn't have an npm package, this is a placeholder
  },
  {
    name: 'Express',
    owner: 'expressjs',
    repo: 'express',
    securityFilePath: 'SECURITY.md',
    branch: 'master',
    npmPackage: 'express'
  },
  {
    name: 'webpack',
    owner: 'webpack',
    repo: 'webpack',
    securityFilePath: 'SECURITY.md',
    branch: 'main',
    npmPackage: 'webpack'
  },
  {
    name: 'Electron',
    owner: 'electron',
    repo: 'electron',
    securityFilePath: 'SECURITY.md',
    branch: 'main',
    npmPackage: 'electron'
  },
  {
    name: 'jQuery',
    owner: 'jquery',
    repo: 'jquery',
    securityFilePath: 'SECURITY.md',
    branch: 'main',
    npmPackage: 'jquery'
  },
  {
    name: 'Fastify',
    owner: 'fastify',
    repo: 'fastify',
    securityFilePath: 'SECURITY.md',
    branch: 'main',
    npmPackage: 'fastify'
  },
  {
    name: 'Node-RED',
    owner: 'node-red',
    repo: 'node-red',
    securityFilePath: 'SECURITY.md',
    branch: 'master',
    npmPackage: 'node-red'
  },
  {
    name: 'ESLint',
    owner: 'eslint',
    repo: 'eslint',
    securityFilePath: 'SECURITY.md',
    branch: 'main',
    npmPackage: 'eslint'
  },
  {
    name: 'Jest',
    owner: 'jestjs',
    repo: 'jest',
    securityFilePath: 'SECURITY.md',
    branch: 'main',
    npmPackage: 'jest'
  },
  {
    name: 'Mocha',
    owner: 'mochajs',
    repo: 'mocha',
    securityFilePath: 'SECURITY.md',
    branch: 'master',
    npmPackage: 'mocha'
  },
  {
    name: 'Lodash',
    owner: 'lodash',
    repo: 'lodash',
    securityFilePath: 'SECURITY.md',
    branch: 'main',
    npmPackage: 'lodash'
  },
  {
    name: 'WebdriverIO',
    owner: 'webdriverio',
    repo: 'webdriverio',
    securityFilePath: 'SECURITY.md',
    branch: 'main',
    npmPackage: 'webdriverio'
  }
];

/**
 * Run the monitoring process for all repositories
 */
async function main() {
  try {
    console.log(`OpenJS Security Monitor Starting...`);

    ensureDirectoriesExist();

    for (const repo of REPOSITORIES) {
      console.log(`\nProcessing ${repo.name}...`);
      for (const check of CHECKS) {
        await check(repo);
      }
    }
  } catch (error) {
    console.error(`\nError in main process: ${error.message}`);
    console.error(error);
  }
}

main();
