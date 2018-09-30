const buildSW = require('./build-sw')

const ID = 'vue-cli:bundle-service-worker-plugin'

module.exports = class GenerateIconsPlugin {
  constructor({ buildOptions }) {
    this.buildOptions = buildOptions
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise(ID, async (compilation) => {
      if (process.env.VUE_CLI_MODERN_BUILD) {
        // avoid running twice (already run after the legacy build)
        return
      }

      await buildSW(this.buildOptions)
    })
  }
}
