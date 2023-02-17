const { join } = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const Handlebars = require('handlebars')
const chokidar = require('chokidar')

const Settings = {
  inputPath: 'index.hbs',
  outputPath: 'index.html',
  ignored: [
    '.git',
    'node_modules',
    'package.json',
    'package-lock.json',
    'index.html',
    'start.js'
  ]
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

const watch = () => {
  chokidar.watch('.', {
    ignored: new RegExp(Settings.ignored.join('|')),
    ignoreInitial: true
  }).on('all', (event, path) => {
    console.log(path)
    compileIndex()
  })
}

compileIndex()
watch()
