import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 按需加载路由 这样写比较清晰
const Layout = () => import('@/views/layout')
const home = () => import('@/views/home')
const question = () => import('@/views/question')
const video = () => import('@/views/video')
const user = () => import('@/views/user')
const chat = () => import('@/views/user/chat')
const profile = () => import('@/views/user/profile')
const login = () => import('@/views/login')
const search = () => import('@/views/search')
const searchResult = () => import('@/views/search/result')
const article = () => import('@/views/article')

const routes = [
  {
    path: '/',
    component: Layout,
    // 二级路由
    children: [{
      path: '', // 二级路由默认组件
      component: home
    },
    {
      path: '/question', // 问答组件
      component: question

    }, {
      path: '/video', // 视频组件
      component: video

    }, {
      path: '/user', // 个人中心组件
      component: user

    }]
  },
  {
    path: '/user/chat', // 智能问答组件
    component: chat
  },
  {
    path: '/user/profile', // 编辑资料组件
    component: profile
  },

  {
    path: '/login', // 登录组件
    component: login
  },
  {
    path: '/search', // 搜索中心组件
    component: search
  },
  {
    path: '/search/result', // 搜索结果
    component: searchResult
  },

  {
    path: '/article', // 文章详情
    component: article
  }
]

const router = new VueRouter({
  routes
})

export default router
