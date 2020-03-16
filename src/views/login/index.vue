<template>
  <div class="container">
    <!-- 导航  go(-1) 回到上一个历史记录 -->
    <van-nav-bar title="登录" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
    <!-- 该容器组件提供外边框 -->
    <van-cell-group>
      <!-- 手机号 -->
      <van-field label="手机号" placeholder="请输入手机号"></van-field>
      <van-field label="验证码" placeholder="请输入验证码">
        <!-- 组件的扩展-slot 插槽来自定义内容
        slot的值有4个，label，left-icon，icon，button-->
        <van-button slot="button" round size="small" type="info">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- round为圆角  block属性可以将按钮的元素类型设置为块级元素-->
    <div class="login-box">
      <van-button type="info" size="small" block round>登录</van-button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.login-box {
  padding: 20px;
}
</style>
