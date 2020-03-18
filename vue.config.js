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
  }
}
