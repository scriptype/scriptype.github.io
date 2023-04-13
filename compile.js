const fs = require('fs')
const { execSync } = require('child_process')
const Handlebars = require('handlebars')

const Settings = {
  inputPath: 'index.hbs',
  outputPath: 'index.html'
}

const getLastCommitHash = () => {
  return execSync('git rev-parse --short HEAD').toString().trim()
}

const compileIndex = () => {
  const data = {
    lastCommitHash: getLastCommitHash(),
    lastBuildTime: new Date().toUTCString()
  }

  const html = fs.readFileSync(Settings.inputPath, 'utf-8')
  const template = Handlebars.compile(html)
  fs.writeFileSync(Settings.outputPath, template(data))
}

module.exports = compileIndex
