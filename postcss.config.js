// 用于处理postcss插件
module.exports = {
  plugins: {
    // 自动给css样式加浏览器前缀的属性
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值 font-size：30/rootValue=rem
      propList: ['*']// 哪些文件需转成rem *表示所有文件
    }
  }
}
