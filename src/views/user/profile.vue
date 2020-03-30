<template>
<!-- 编辑资料页面 -->
 <div class="container">
    <van-nav-bar left-arrow @click-right="saveUser" @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
     @click="showPhoto=true"   />
      </van-cell>
      <van-cell is-link title="名称" :value="user.name" @click="showName=true"/>
      <van-cell is-link title="性别" :value="user.gender===0?'男':'女'" @click="showGender=true"/>
      <van-cell is-link title="生日" :value="user.birthday" @click="showDay" />
    </van-cell-group>
    <!-- 头像弹层 -->
    <!-- 弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell is-link title="本地相册选择图片" @click="openDialog"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 昵称弹层 :close-on-click-overlay点击弹层外空白时关闭弹层-->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false" >
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field :error-message="nameMsg" type="textarea" rows="4" v-model.trim='user.name'></van-field>
      <!-- 关闭弹层的按钮 -->
      <van-button size="normal" type="info" block @click="btnName">确定</van-button>
    </van-popup>
    <!-- 性别弹层 :actions="actions"存放选项的数组-->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <!--    @cancel点击取消   @confirm确定-->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"

        @cancel="showBirthDay=false"
        @confirm='confirmDate'
      />
    </van-popup>
     <!-- 上传图片的标签 -->
    <input @change="upload" ref='myFile' type="file" style='display:none' name='' id='' >
  </div>
</template>

<script>

import { getUserProfile, updatePhoto, savaUserInfo } from '@/api/user'
import dayjs from 'dayjs'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {

      showPhoto: false, // 是否显示头像弹层
      showName: false, // 是否显示昵称弹层
      showGender: false, // 是否显示性别弹层
      showBirthDay: false, // 是否显示生日弹层
      actions: [{ name: '男' }, { name: '女' }],
      currentDate: new Date(), // 当前时间
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 当前时间
      nameMsg: '', // 昵称错误提示
      user: {
        // 放置个人资料信息
        name: '', // 用户昵称
        gender: 1, // 性别  0男1女
        birthday: '', // 生日
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    // 引入更新头像
    ...mapMutations(['updatePhoto']),
    async saveUser () {
      try {
        await savaUserInfo(this.user)
        this.$notified({ type: 'success', message: '修改成功' })
      } catch (error) {
        this.$notified({ message: '操作失败' })
      }
    },
    // 修改头像
    async upload (params) {
      // 头像上传
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0])
      const result = await updatePhoto(data)
      this.user.photo = result.photo
      this.updatePhoto = result.photo// 将最新的头像地址设置给vuex中
      this.showPhoto = false
    },
    openDialog () {
      // 打开选择文件的对话框
      this.$refs.myFile.click() // 触发input：file的click事件
    },
    async  getUserProfile () {
      this.user = await getUserProfile()
    },
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户昵称长度应为1-7位'
        return
      }
      this.nameMsg = ''// 清空提示信息
      this.showName = false
    },
    selectItem (item, index) {
      // index  0 表示男 为1 表示女
      this.user.gender = index
      this.showGender = false
    },

    showDay () {
      this.showBirthDay = true
      this.currentDate = new Date(this.user.birthday)
    },
    confirmDate () {
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD') // 将date类型转为字符串
      this.showBirthDay = false
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>

</style>
