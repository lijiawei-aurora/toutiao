// 请求管理工具
import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store' // 引入vuex中的store实例对象 相当于组件中的this.$store
// axios.create()相当于new了一个新的axios
const instance = axios.create({
// 创建一个axios新实例
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础的请求地址
  //   此函数是后台响应回来但还没有进入到axios的响应拦截器时执行
  // 数组中可写多个处理函数
  transformResponse: [function (data) {
    // data是后端响应回来的字符串
    return data ? JSONBig.parse(data) : {}
  }]
})
// token的注入 请求在请求拦截器之前
// 此时的instance就相当于axios 是新的axios实例
instance.interceptors.request.use(function (config) {
  // 成功时 读取配置信息，给配置信息中注入token
  // 将token统一注入到headers中
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config // 返回配置
}, function (error) {
  // 直接返回promise的错误
  return Promise.reject(error) // 会直接进入axios的catch中
})
// 用响应拦截器处理返回结果的数据  将多嵌套的结构解构出来
instance.interceptors.response.use(function (response) {
//  此时的response此时被axios包了一层数据，data才是我们之前处理的数据
  try {
    return response.data.data
  } catch (error) {
    //   若失败，表示response.data不存在
    return response.data
  }
}, function (error) {
  return Promise.reject(error)// 返回失败
})
export default instance // 导出实例
