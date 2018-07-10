const fs = require('fs')
const Handlebars = require('handlebars')

const {
  htmlInput,
  htmlOutput,
  lastCommitHash
} = process.env

const html = fs.readFileSync(htmlInput, 'utf-8')
const template = Handlebars.compile(html)

const output = template({
  lastCommitHash,
  lastBuildTime: new Date().toUTCString()
})

fs.writeFileSync(htmlOutput, output)
