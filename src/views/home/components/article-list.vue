<template>
  <!-- 文章列表组件 -->

  <!-- 滚动条  用于记录上次阅读停留的位置-->
  <div class="scroll-wrapper">
    <!-- 下拉刷新组件  下拉刷新时会触发 refresh 事件， :success-text刷新成功提示文字-->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <!-- van-list 距底部的距离大于offset（默认为300 ） 自动执行load事件 -->
      <!-- 当组件滚动到底部时，会触发load事件并将upLoading设置成true。此时可以发起异步操作并更新数据，
      数据更新完毕后，将loading设置成false即可 若数据已全部加载完毕，则直接将finished设置成true即可。-->
      <!-- loading表示是否在上拉加载  finished表示数据是否已经都加载完毕 为true则不触发load事件 -->

      <van-list finished-text="我也是有底线的哦" v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <!-- art_id为大数字 需转为字符串或数字 -->
          <!-- to 属性可以跳转到对应的地址 并传递文章id -->
          <van-cell :to='`/article?artId=${item.art_id.toString()}`'  v-for="item in articles" :key="item.art_id.toString()" :value="`nohao${item}`">
            <div class="article_item">
              <!-- 文章标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 图片 lazy-load表示图片组件会懒加载 -->
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 -->
              <div class="img_box" v-if="item.cover.type===3">
                <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}</span>
                <span>{{item.pubdate|relTime}}</span>
                <!-- 叉号 应根据登录状态来判断是否显示 -->
                <!-- $store.state.user.token vuex中的state中的变量 -->
                <!-- 子组件触发自定义事件 $emit("事件名"，要传递的参数) -->
                <span
                  class="close"
                  v-if="$store.state.user.token"
                  @click.stop="$emit('showMoreAction',item.art_id.toString())"
                >
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
// 引入获取文章的模块
import { getArticles } from '@/api/articles'
export default {
  created () {
    // 初始化函数
    // 监听事件的触发 所有的页签都会执行监听
    eventBus.$on('delArticles', (artId, channelId) => {
      // 判断传递的频道id是否为当前页签的频道id
      // 若相等就表明是对当前的频道中的文章不感兴趣

      if (channelId === this.channel_id) {
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) { // 大于-1 表明文章中有传来的id对应的文章
          // 删除一条
          this.articles.splice(index, 1)
        }
        if (this.articles.length === 0) { // 表示将文章删除完
          this.onLoad()// 手动触发onload 给页面请求文章
        }
      }
    })
  },
  // props可以跟对象形式  校验传入的数据
  props: {
    channel_id: {
      required: true, // 要求props属性必须传
      type: Number, // 传入的值的类型
      default: null // 若不传值 使用默认值 default不受type约束
    }
  },
  data () {
    return {
      upLoading: false, // 是否开启了上拉加载，默认值为false
      finished: false, // 是否已经完成所有数据的加载
      articles: [], // 文章列表
      downLoading: false, // 是否正在下拉刷新
      successText: '',
      timestamp: null // 存储历史时间戳
    }
  },
  methods: {
    // 下拉刷新 用最新的时间戳 读取最新的数据 添加到数据头部
    async onRefresh () {
      await this.$sleep() // 防止拉取数据频繁

      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now() // 最新的时间戳
      })
      this.downLoading = false
      if (data.results.length) {
        // 有返回数据替换articles
        this.articles = data.results
        // 判断历史时间戳是否为0
        if (data.pre_timestamp) {
          this.finished = false // 列表继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        this.successText = '当前已经是最新数据了'
      }
      // setTimeout(() => {
      //   const arr = Array.from(Array(2), (value, index) => '追加' + (index + 1))
      //   this.articles.unshift(...arr)
      //   this.downLoading = false // 关闭加载状态
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
    },
    // 一秒后停止加载
    // 滚动条与底部距离小于 offset 时触发load事件
    async onLoad () {
      await this.$sleep() // 防止拉取数据频繁
      const data = await getArticles({
        channel_id: this.channel_id,
        // 若有历史时间戳就使用， 没有就传入当前的时间戳
        timestamp: this.timestamp || Date.now()
      })
      // push只能一次添加一个
      this.articles.push(...data.results) // 将数据追加到队尾

      this.uploading = false // 添加完数据手动关闭加载
      // 将历史时间戳给timestamp 判断历史时间戳是否为0 为0表示无数据了
      if (data.pre_timestamp) {
        // 表示还有数据可以加载
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true
      }
      // if (this.articles.length > 50) {
      //   this.finished = true
      // } else {
      //   const arr = Array.from(Array(15), (value, index) => index + 1)
      //   // push只能一次添加一个
      //   this.articles.push(...arr)

      //   this.upLoading = false
      // }
      // setTimeout(() => {
      //   // this.finished = true
      // }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    // 图片样式
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
