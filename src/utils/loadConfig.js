const loadFile = require('./loadFile')
const merge = require('lodash/merge')

const getDefaultConfig = (pkg) => {
  return {
    input: 'src/index.js',
    output: {
      directory: 'dist',
      name: /\//.test(pkg.name) ? pkg.name.match(/\/(.+)/)[1] : pkg.name,
      format: ['umd', 'es', 'cjs'],
    },
    external: [],
  }
}

module.exports = (pkg = {}) => {
  const defaultConfig = getDefaultConfig(pkg)
  let config = loadFile('joy.config.js')
  if (config) {
    if (typeof config === 'function') config = config()
  } else if (pkg.joy) {
    config = pkg.joy
  } else {
    config = {}
  }
  return merge(defaultConfig, config)
}
