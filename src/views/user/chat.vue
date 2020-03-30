<template>
  <!-- 小智同学 -->
   <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref='myList'>
      <!-- 循环渲染消息列表 -->
      <div class="chat-item " :class="{left:item.name==='xz',right:item.name!=='xz'}" v-for='(item,index) in list' :key="index">
        <van-image fit="cover" round :src="xzImg" v-if="item.name==='xz'"/>
        <div class="chat-pao">{{item.msg}}</div>
           <van-image  fit="cover" round :src="photo"  v-if="item.name!=='xz'" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>

      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import io from 'socket.io-client' // 引入socket.io的客户端
import { mapState } from 'vuex' // 从vuex中用户头像
import xzImg from '@/assets/1.jpg' // 引入头像地址
export default {
  data () {
    return {
      value: '',
      loading: false, // 控制发送按钮的状态
      xzImg,
      list: []// 用于存聊天记录
    }
  },
  beforeDestroy () {
    // 实例销毁之前
    this.socket.close()// 关闭连接
  },
  methods: {
    // 将内容滚动到底部 scrollTop（滚动条距顶部的距离）=scrollHeight(滚动条实际高度)
    scrollBottom () {
      // 数据异步更新之后再执行
      // 上一次的数据更新结果完成渲染时执行
      // this.$nextTick(() => {
      //   this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      // })
      // 方法二
      Vue.nextTick(() => {
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      })
    },
    async   send () {
      // 发送消息方法
      // 调用webSocket发出消息
      if (!this.value) return false // 字符串为空不发送消息
      this.loading = true// 可避免重复提交
      await this.$sleep(500)// 强制休眠500毫秒
      // this.socket.emit(消息类型，消息内容)
      const obj = {
        msg: this.value, // 消息内容
        timestamp: Date.now() // 传递时间戳
      }
      this.socket.emit('message', obj)
      this.list.push(obj)// 加入到聊天列表
      this.value = ''// 清空消息框
      this.loading = false
      this.scrollBottom()
    }
  },
  computed: {
    // 在计算属性中引入photo
    ...mapState(['photo', 'user'])
  },
  created () {
    // 初始化钩子函数
    // 建立与服务器的连接
    this.socket = io('http://ttapi.research.itcast.cn', {
      // 固定写法 它会拼接到 url地址上 ?后面
      query: {
        token: this.user.token // vuex中的 token
      }
    })
    // connect是固定的写法，表示当前已经建立连接
    this.socket.on('connect', () => {
      // 监听回复的消息

    })
    this.socket.on('message', data => {
      // data为回复的消息
      this.list.push({ ...data, name: 'xz' })
      this.scrollBottom()
    })
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
