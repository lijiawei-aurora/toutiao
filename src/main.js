import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入vant移动端组件库 完全导入 后期优化可使用哪个引入哪个
import Vant from 'vant'
import 'vant/lib/index.css' // 引入vant组件样式
Vue.use(Vant) // 全局注册 相当于调用了vant的install方法

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
