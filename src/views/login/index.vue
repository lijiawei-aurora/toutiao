<template>

 <div class="container">
  <!-- 导航  go(-1) 回到上一个历史记录 -->
  <van-nav-bar title="登录" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
 <!-- 该容器组件提供外边框 -->
  <van-cell-group>
    <!-- 手机号 -->
    <van-filed label="手机号"></van-filed>

  </van-cell-group>
</div>
</template>

<script>
export default {

}
</script>

<style>

</style>
