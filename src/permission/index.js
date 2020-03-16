// 导航守卫功能
// 引入路由实例
import router from '@/router'
// 引入store对象
import store from '@/store'
// 前置守卫  路由变化就会执行
router.beforeEach(function (to, from, next) {
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login', // 要跳转的地址
      query: {
        redirectUrl: to.path // 没有成功访问的地址
      }
    })
  } else {
    next()
  }
})
