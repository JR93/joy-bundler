const fs = require('fs')
const rollup = require('rollup')
const terser = require('terser')
const ora = require('ora')

const loadFile = require('./utils/loadFile')
const loadConfig = require('./utils/loadConfig')
const generateRollupConfig = require('./utils/generateRollupConfig')

module.exports = class Joy {
  constructor() {
    this.pkg = loadFile('package.json')
    this.config = loadConfig(this.pkg)
    this.rollupConfig = generateRollupConfig(this.config)
  }

  async run() {
    for (const config of this.rollupConfig) {
      const spinner = ora(`[${config.output.format}] ${this.config.input} → ${config.output.file}.js`).start()

      try {
        const bundle = await rollup.rollup(config)
        const { output: [{ code }] } = await bundle.generate(config.output)
        fs.writeFile(`${config.output.file}.js`, code, (err) => {
          if (err) console.error(err)
        })

        // minimize
        const minimizeCode = terser.minify(code, {
          toplevel: true,
          output: {
            ascii_only: true,
          },
          compress: {
            // pure_funcs: ['makeMap'],
          },
        }).code
        fs.writeFile(`${config.output.file}.min.js`, minimizeCode, (err) => {
          if (err) console.error(err)
        })
      } catch (e) {
        console.error('\n' + e)
        process.exit(1)
      }

      spinner.succeed()
    }
  }
}
