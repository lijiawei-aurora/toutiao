<template>
  <div id="app">
    <!-- 一级路由容器 -->
    <!-- 缓存组件，根据meta中的isAlive判断 -->
    <!-- 只缓存 一级路由layout -->
    <keep-alive>
      <router-view v-if="this.$route.meta.isAlive"></router-view>
    </keep-alive>
    <router-view v-if="!this.$route.meta.isAlive"></router-view>
  </div>
</template>

<style lang="less">
</style>
