const fs = require('fs')
const path = require('path')

module.exports = (filename, cwd = process.cwd()) => {
  const pkgPath = path.resolve(cwd, filename)
  if (fs.existsSync(pkgPath)) {
    return require(pkgPath)
  } else {
    return undefined
  }
}
