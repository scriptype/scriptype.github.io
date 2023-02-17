const { join } = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const Handlebars = require('handlebars')

const rootDir = join(__dirname, '..')
const inputFile = join(rootDir, 'index.hbs')
const outputFile = join(rootDir, 'index.html')

const html = fs.readFileSync(inputFile, 'utf-8')
const template = Handlebars.compile(html)

const templateData = {
  lastCommitHash: execSync('git rev-parse --short HEAD').toString().trim(),
  lastBuildTime: new Date().toUTCString()
}

const output = template(templateData)

fs.writeFileSync(outputFile, output)
