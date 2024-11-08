const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        https: false
      }
    }
  },
  devServer: {
    allowedHosts: 'all',
    // Ngrok URL
    client: {
      // wss://<Ngrok URL>/ws
      webSocketURL: 'wss://96b2-2a09-bac1-27c0-48-00-214-47.ngrok-free.app/ws',
    }
    }
})
