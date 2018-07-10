const path = require('path')

const root = path.join(__dirname, '..')

module.exports = {
  htmlInput: path.join(root, 'index.hbs'),
  htmlOutput: path.join(root, 'index.html')
}
