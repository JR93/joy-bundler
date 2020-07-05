#!/usr/bin/env node

const cac = require('cac')
const update = require('update-notifier')
const pkg = require('../package.json')
const JoyBundler = require('../src')

update({ pkg }).notify()

process.on('unhandledRejection', error => {
  console.error(error)
  process.exit(1)
})

const cli = cac('joy-bundler')

cli
  .command('build', '构建输出')
  .action(() => {
    try {
      const bundler = new JoyBundler()
      bundler.run()
    } catch (error) {
      console.error(error.message)
      process.exit(1)
    }
  })

cli.version(pkg.version)

cli.parse()
