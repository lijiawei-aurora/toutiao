import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/article',
    component: () => import('@/views/article')
  },
  {
    path: '/article',
    component: () => import('@/views/article')
  },
  {
    path: '/article',
    component: () => import('@/views/article')
  },
  {
    path: '/article',
    component: () => import('@/views/article')
  },
  {
    path: '/article',
    component: () => import('@/views/article')
  }
]

const router = new VueRouter({
  routes
})

export default router
