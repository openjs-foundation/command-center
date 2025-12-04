const path = require('node:path');

const CACHE_DIR = path.join(__dirname, '..', 'cache');
const CHECKSUM_DIR = path.join(__dirname, '..', 'checksums');

module.exports = {
  CHECKSUM_DIR,
  CACHE_DIR,
};

