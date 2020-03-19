// 专门提供小函数以及vue 中常用的过滤器函数
export default {
  install (Vue) { // 该方法会在vue.use时调用
    // 给vue的原型属性赋值一个函数(自定义)
    Vue.prototype.$notified = (params) => Vue.prototype.$notify({
      duration: 800, ...params
    })
    Vue.prototype.$sleep = sleep
  }
}
// 休眠函数
// 若不传参数就使用500
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
