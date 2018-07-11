const { run } = require('salinger')

module.exports = {
  dev() {
    run('handlebars')
  },
  build() {
    run('handlebars')
      .then(() => run('commit'))
  }
}
