// 专门提供小函数以及vue 中常用的过滤器函数
import dayjs from 'dayjs'// 引入dayjs插件 默认支持英文语言包
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间的插件
import 'dayjs/locale/zh-cn' // 引入中文语言包
dayjs.extend(relativeTime)// dayjs扩展相对时间的方法
export default {
  install (Vue) { // 该方法会在vue.use时调用
    // 给vue的原型属性赋值一个函数(自定义)
    Vue.prototype.$notified = (params) => Vue.prototype.$notify({
      duration: 800, ...params
    })
    Vue.prototype.$sleep = sleep
    // 注册全局过滤器 Vue.filter(名称，函数)
    Vue.filter('relTime', relTime)
  }
}
// 休眠函数
// 若不传参数就使用500
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
// 此函数用来将日期转化成相对时间 date 为传入的时间
function relTime (date) {
  // dayjs()为当前的时间 dayjs().from(date)表示当前时间距传来的时间相距多少时间
  // 对dayjs进行本地的语言包转化
  return dayjs().locale('zh-cn').from(date) // from中的值时日期或dayjs得到的日期
}
