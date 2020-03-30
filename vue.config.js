module.exports = {
  // 更改less中变量的配置
  css: {
    // css相关
    loaderOptions: {
    //   关于样式loader相关的选项
      less: {
        modifyVars: {
          // 直接覆盖变量，变量名不用加@
          blue: '#3296fa'
        }
      }
    }
  },
  configureWebpack: (config) => {
    // config参数 当前vue-cli项目所有的webpack配置
    // 判断当前打包环境是生产环境还是开发环境
    if (process.env.NODE_ENV === 'production') {
      // 将所有的console删除再打包，但不会影响源代码的console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './'
}
