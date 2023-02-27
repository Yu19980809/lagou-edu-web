module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        prependData: '@import "~@/styles/variables.scss";'
      }
    }
  }
}
