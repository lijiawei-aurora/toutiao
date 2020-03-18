import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/permission'
// 引入vant移动端组件库 完全导入 后期优化可使用哪个引入哪个
import Vant from 'vant'
// import 'vant/lib/index.css' // 引入vant组件样式
import 'vant/lib/index.less' // 想修改某些变量 所以引入less
import 'amfe-flexible' // 修改rem基准值的js插件
import '@/styles/index.less' // 引入自定义全局样式 用于覆盖vant 的某些样式
Vue.use(Vant) // 全局注册 相当于调用了vant的install方法

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
