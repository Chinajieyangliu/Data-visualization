const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    port: 9090,
    open: true
  }
}

module.exports = {
  lintOnSave: false
}
