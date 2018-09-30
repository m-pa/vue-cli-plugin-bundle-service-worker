const path = require('path')
const webpack = require('webpack')

module.exports = async ({ silent, targetDir, swSrc, swDest }) => {
  const webpackConfig = {
    mode: process.env.NODE_ENV,
    entry: swSrc,
    output: {
      path: targetDir,
      filename: swDest,
    },
  }

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
