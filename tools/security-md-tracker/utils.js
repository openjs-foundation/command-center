const https = require('https')
const http = require('http')
const crypto = require('crypto')

/**
 * Creates a hash of the provided content
 * @param {string} content - The content to hash
 * @returns {string} - The SHA-256 hash of the content
 */
function hashContent (content) {
    return crypto.createHash('sha256').update(content).digest('hex')
  }
  
  /**
   * Fetches content from a URL
   * @param {string} url - The URL to fetch
   * @returns {Promise<string>} - The content of the URL
   */
  async function fetchContent (url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http
      
      protocol.get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Request failed with status code ${res.statusCode}`))
          return
        }
  
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        
        res.on('end', () => {
          resolve(data)
        })
      }).on('error', (err) => {
        reject(err)
      })
    })
  }

module.exports = {
    hashContent,
    fetchContent
}
