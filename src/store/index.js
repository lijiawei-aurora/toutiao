/**************
 * store 下的index.js专门处理vuex中的模块
 * ********** */
import Vue from 'vue'
import Vuex from 'vuex'
// 引入auth 的默认和平常对象
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser() // token信息的对象 应存{token refresh-token}

  },
  // 更改token
  mutations: {
    // 修改token  state为状态对象 payload为载荷，传参
    updateUser (state, payload) {
      state.user = payload.user
      auth.setUser(payload.user)// 修改本地缓存
    },
    // 删除token
    delUser (state) {
      state.user = {}// 将vuex中的token设置为空对象
      auth.delUser() // 删除本地缓存
    }
  },
  actions: {
  },
  modules: {
  }
})
