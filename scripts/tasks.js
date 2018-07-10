const { run } = require('salinger')

module.exports = {
  build() {
    run('handlebars')
      .then(() => run('commit'))
  }
}
