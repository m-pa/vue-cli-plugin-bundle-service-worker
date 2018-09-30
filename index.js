const path = require('path')
const buildSW = require('./src/build-sw')
const BundleServiceWorkerPlugin = require('./src/BundleServiceWorkerPlugin')

module.exports = (api, { pwa, outputDir, pluginOptions }) => {
  if (!pwa || !pwa.workboxOptions) {
    throw new Error('pwa.workboxOptions is missing')
  }

  if (pwa.workboxPluginMode !== 'InjectManifest') {
    throw new Error('Only pwa.workboxPluginMode "InjectManifest" is supported')
  }

  // defer to pwa plugin's config
  const swSrc = api.resolve(pwa.workboxOptions.swSrc)

  // default to filename of swSrc, ala workbox plugin
  const swDest = pwa.workboxOptions.swDest || path.basename(swSrc)
  const targetDir = api.resolve(outputDir)

  const buildOptions = {
    swSrc,
    swDest,
    targetDir,
  }

  api.registerCommand('build:sw', {
    description: 'Builds service worker',
    usage: 'vue-cli-service build:sw',
  }, async (args) => {
    await buildSW(Object.assign({}, args, buildOptions))
  })

  api.chainWebpack(webpackConfig => {
    const target = process.env.VUE_CLI_BUILD_TARGET
    if (target && target !== 'app') {
      return
    }

    webpackConfig
      .when(process.env.NODE_ENV === 'production', config => {
        config
          .plugin('bundle-service-worker')
          .use(BundleServiceWorkerPlugin, [{ buildOptions }])
          .before('workbox')

        config
          .plugin('workbox')
          .tap(args => {
            // Inject manifest into built service worker (modify in place)
            args[0].swSrc = path.resolve(targetDir, swDest)

            return args
          })
      })
  })
}

module.exports.defaultModes = {
  'build:sw': 'production'
}
