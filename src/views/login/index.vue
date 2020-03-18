<template>
  <div class="container">
    <!-- 导航  go(-1) 回到上一个历史记录 -->
    <van-nav-bar title="登录" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
    <!-- 该容器组件提供外边框 -->
    <van-cell-group>
      <!-- 手机号 .trim去除空格-->
      <van-field @blur="checkCode" :error-message="errorMessage.mobile" label="手机号" v-model.trim="loginForm.mobile" placeholder="请输入手机号"></van-field>
      <van-field @blur="checkMobile" :error-message="errorMessage.code" label="验证码"  v-model.trim="loginForm.code" placeholder="请输入验证码">
        <!-- 组件的扩展-slot 插槽来自定义内容
        slot的值有4个，label，left-icon，icon，button-->
        <van-button slot="button" round size="small" type="info">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- round为圆角  block属性可以将按钮的元素类型设置为块级元素-->
    <div class="login-box">
      <van-button type="info" size="small" block round @click="login">登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单数据
      loginForm: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      errorMessage: {
        mobile: '', // 手机号的错误消息
        code: ''// 验证码的错误消息
      }
    }
  },
  methods: {
    checkMobile () {
      // 取反为true
      if (!this.loginForm.mobile.length) {
        this.errorMessage.mobile = '手机号不能为空'
        return false // 表示此轮校验没通过 通过则返回true
      }
      // 手机号格式不正确
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 表示校验成功 给错误消息置空
      this.errorMessage.mobile = ''
      return true
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      // 校验格式是否正确
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须为六位数字'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    login () { // 点击登录按钮进行校验 若两个方法均返回true 则表明验证通过
      if (this.checkMobile() && this.checkCode()) {
        console.log('通过校验')
      }
    }
  }
  // created () {
  //   this.checkMobile()
  //   this.checkCode()
  // }
}
</script>

<style>
.login-box {
  padding: 20px;
}
</style>
