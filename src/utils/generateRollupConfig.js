const resolve = require('@rollup/plugin-node-resolve').default
const commonjs = require('@rollup/plugin-commonjs')
const babel = require('@rollup/plugin-babel').default
const json = require('@rollup/plugin-json')
const typescript = require('rollup-plugin-typescript')
const url = require('@rollup/plugin-url')
const postcss = require('rollup-plugin-postcss')
const vue = require('rollup-plugin-vue')
const autoprefixer = require('autoprefixer')

const formatMapping = {
  es: '.esm',
  cjs: '.common',
  umd: '',
}

const basePluginConfig = {
  plugins: [
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json', '.vue', '.ts'],
    }),
    commonjs(),
    json(),
    url(),
    typescript(),
    vue({
      defaultLang: {
        style: 'scss',
      },
      template: {
        // 强制生产模式
        isProduction: true,
      },
      style: {
        postcssPlugins: [autoprefixer],
      },
    }),
    postcss({
      extensions: ['.css', '.styl', '.sass', '.scss']
    }),
    babel({
      extensions: ['.mjs', '.js', '.jsx', '.vue', '.ts'],
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
      plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]]
    }),
  ]
}

module.exports = (joyConfig) => {
  return joyConfig.output.format.reduce((configArr, format) => {
    console.log(format)
    const config = {
      ...joyConfig,
      ...basePluginConfig,
      output: {
        ...joyConfig.output,
        file: `${joyConfig.output.directory}/${joyConfig.output.name}${formatMapping[format] ? `${formatMapping[format]}` : ''}`,
        format
      }
    }
    delete config.output.directory
    return [...configArr, config]
  }, [])
}
