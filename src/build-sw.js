const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')


module.exports = async ({ silent, targetDir, swSrc, swDest, swWebpackConfig = {} }) => {
  const webpackConfig = merge({
    mode: process.env.NODE_ENV,
    entry: swSrc,
    output: {
      path: targetDir,
      filename: swDest,
    },
  }, swWebpackConfig)

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        return reject(err)
      }

      if (stats.hasErrors()) {
        return reject(`Service worker build failed with errors.`)
      }

      if (!silent) {
        console.log(stats.toString({
          // Add console colors
          colors: true
        }))
      }

      resolve()
    })
  })
}
