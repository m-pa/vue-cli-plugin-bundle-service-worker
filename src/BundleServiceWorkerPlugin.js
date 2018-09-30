const buildSW = require('./build-sw')

const ID = 'vue-cli:bundle-service-worker-plugin'

module.exports = class GenerateIconsPlugin {
  constructor ({ buildOptions }) {
    this.buildOptions = buildOptions
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise(ID, async (compilation) => {
      await buildSW(this.buildOptions)
    })
  }
}
