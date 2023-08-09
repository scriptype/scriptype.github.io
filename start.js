const { join } = require('path')
const chokidar = require('chokidar')
const compileIndex = require('./compile')

const Settings = {
  ignored: [
    '.git',
    'node_modules',
    'package.json',
    'package-lock.json',
    'index.html',
    'start.js'
  ]
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

if (process.argv[2] !== 'once') {
  watch()
}
