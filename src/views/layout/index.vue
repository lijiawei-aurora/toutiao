<template>
  <div class="container">
    <!-- 导航组件  fixed为是否固定在顶部 路径为/user 时不显示顶部-->
    <van-nav-bar @click-right="$router.push('/search')" title="头条" fixed  right-text="搜索" v-if='$route.path!=="/user"?true:false'></van-nav-bar>
    <!-- 二级路由容器  路径为/user 就应用 noTop样式-->
    <div class="my-wrapper" :class="{noTop:$route.path==='/user'}">
     <keep-alive>
       <!-- 被包裹的路由容器里的组件不会被销毁 -->
      <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 标签栏组件 route 为开启路由模式 van-tabbar-item可作为router-link使用 -->
    <van-tabbar route>
      <van-tabbar-item icon='wap-home-o'  to='/'>首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to='/question'>问答</van-tabbar-item>
      <van-tabbar-item icon="tv-o" to='/video'>视频</van-tabbar-item>
      <van-tabbar-item icon="user-circle-o" to='/user'>我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  // 控制二级路由容器的宽高
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
