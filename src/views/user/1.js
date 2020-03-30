import { mapState } from 'vuex'
import imgXZ from '@/assets/1.jpg'
import io from 'socket.io-client' // 引入socket.io的客户端
export default {
  data () {
    return {
      value: '',
      loading: false,
      imgXZ, // 小智同学的头像
      list: [] // 用于存储聊天的内容
    }
  },
  methods: {
    async  send () {
      // 调用websocket发出一个消息
      if (!this.value) return false // 字符串为空不发送消息
      this.loading = true // 这个状态的目的是防止重复提交
      await this.sleep(500)// 强制休眠500毫秒
      // 使用websocket发送消息
      // socket.io
      // socket.emit(消息类型，消息内容)
      const obj = {
        msg: this.value,
        timestamp: Date.now()// 时间戳
      }
      this.socket.emit('message', obj) // 发送消息
      this.list.push(obj)// 将发出的消息加到消息列表
      this.value = ''// 清空输入框
      this.loading = false// 关闭加载状态
      this.scrollBottom()
    },
    // 设置滚动条的scrollTop（滚动条距底部的距离）
    scrollBottom () { // 将内容滚动到底部
      this.$nextTick(() => { // 上一次的数据更新结果完成渲染时执行
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      })
      // Vue.nextTick(() => {两种方法
      //   this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      // })
    }
  },
  computed: {
    ...mapState(['photo', 'user'])
  },
  created () {
  //   // 建立与服务端的连接 io(地址)
  //   // 初始化webSocket连接
  // 用this.socket接收 其他的方法也可以使用
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: {
        // 会拼接到url地址？后面
        token: this.user.token // vuex中的token
      }
    })
    // connect是固定的写法，表示当前已经建立连接
    this.socket.on('connect', () => {
      this.list.push({ msg: 'nihao ', name: 'xz' })
    })

  //   this.socket.on('connect', function () {
  //     // 此时执行connect事件，表示和服务器连接成功
  //     // this.list.push({msg:})
  //   })
  //   this.socket.on('message', data => { // 接收消息
  //     this.list.push({ ...data, name: 'xz' })
  //     this.scrollBottom()
  //   })
  }
}
