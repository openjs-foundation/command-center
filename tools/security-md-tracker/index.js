const fs = require('fs')
const path = require('path')
const { fetchContent, hashContent } = require('./utils')

const DATA_FILE = path.join(__dirname, 'data.json')
const data = require(DATA_FILE)


module.exports = async () => {
    console.log('-- Processing sources --')
    const sources = []
    for (const source of data.source) {
        console.log(`- ${source.project}: ${source.url}`)
        const content = await fetchContent(source.url)
        sources.push({
            ...source,
            hashedUrl: hashContent(source.url),
            hashedContent: hashContent(content)
        })
    }

    console.log("-- Starting comparison --")
    const changedUrls = sources.filter(source => {
        if(!data.records[source.hashedUrl]) {
            console.log(`New source: ${source.url}`)
            return false
        }
        if(source.hashedContent !== data.records[source.hashedUrl].hashedContent) {
            console.log(`Content changed for ${source.url}`)
            return true
        }
        return false
    })

    console.log("-- Comparison finished --")
    console.log(`Changed URLs: ${changedUrls.length}`)
    console.log(changedUrls.map(source => `- ${source.project}: ${source.url}`).join('\n'))

    console.log("-- Storing results --")
    sources.forEach(source => {
        data.records[source.hashedUrl] = {
            ...source
        }
    })
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    console.log("-- Results stored --")
    return changedUrls
}
