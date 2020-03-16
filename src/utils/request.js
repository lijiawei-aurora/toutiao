// 请求管理工具
import axios from 'axios'
import JSONBig from 'json-bigint'
import router from '@/router' //  this.$router只能在组件中使用 所以需引入router对象
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
}, async function (error) {
  // 若请求失败或其他错误，会进入响应拦截器的错误区域
  // 401为token失效
  // config 为错误请求的配置信息
  // request 为请求对象
  // response 响应对象status（状态码）
  if (error.response.status === 401) {
    const path = {
      path: '/login',
      query: {
        // 当前路由信息对象router.currentRoute  fullPath 为完整地址
        redirectUrl: router.currentRoute.fullPath // 登录成功后需要跳转的地址
      }
    }
    //   refresh_token可以获取新token
    if (store.state.user.refresh_token) {
      // 此时的头为refresh_token 所以不能用instance
      try {
        const result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          },
          method: 'put'
        })
        // await后面为promise执行成功的逻辑
        // 通过vuex中的mutations更新token  需要接收的载荷是一个user对象 里面有token和refresh_token
        store.commit('updateUser', {
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token
          }
        })
        return instance(error.config)// 继续执行之前出现401错误的请求
      } catch (error) {
        store.commit('delUser')// 删除token和refresh_token
        router.push(path)
      }
    } else {
      //   跳转到登录页面  登录后仍回到token失效时的页面
      // 把当前页面的地址传给登录页 登录页需判断是否有要跳转的页面
      router.push(path)
      store.commit('delUser')
    }
  }
  return Promise.reject(error) // 返回失败
})
export default instance // 导出实例
