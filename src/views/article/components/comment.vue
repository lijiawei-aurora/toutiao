<template>
  <div class="comment">
    <!-- 列表组件 上拉加载 -->
    <van-list v-model="loading" @load="onLoad" :finished="finished" finished-text="我也是有底线的哦">
      <!-- 评论列表 -->
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="comment in comments"
        :key="comment.com_id.toString()"
      >
        <!-- 用户头像 -->
        <van-image round width="1rem" height="1rem" fit="fill" :src="comment.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{comment.like_count}}</span>
            </span>
          </p>
          <p>{{comment.content}}</p>
          <p>
            <span class="time">{{comment.pubdate|relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(comment.com_id.toString())">{{comment.reply_count}}回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 评论输入框 -->
    <div class="reply-container van-hairline--top">
      <!-- 对文章评论或对评论回复使用的都是该输入框 -->
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" @click="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 评论的回复 showReply控制是否显示  关闭面板时将评论id置为空-->
    <van-action-sheet
      @closed="reply.commentId=null"
      v-model="showReply"
      :round="false"
      class="reply_dialog"
      title="回复评论"
    >
      <!-- 列表组件 -->
      <van-list
        :immediate-check="false"
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="我也是有底线的哦"
      >
        <div
          class="item van-hairline--bottom van-hairline--top"
          v-for="comment in reply.list"
          :key="comment.com_id.toString()"
        >
          <van-image round width="1rem" height="1rem" fit="fill" :src="comment.aut_photo" />
          <div class="info">
            <p>
              <span class="name">{{comment.aut_name}}</span>
            </p>
            <p>{{comment.content}}</p>
            <p>
              <span class="time">{{comment.pubdate|relTime}}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>
import { getComments, commentOrReply } from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的评论内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 存放评论或回复数据
      offset: null, // 请求评论位置的数据
      showReply: false, // 评论的回复 showReply控制是否显示
      // 评论的回复
      reply: {
        loading: false,
        finished: false,
        offset: null,
        list: [],
        commentId: null // 用来存放 当前点击的评论Id
      }
    }
  },
  methods: {
    async submit () {
      // 提交评论
      //  判断是否登录，没有登录跳转到登录页面
      if (this.$store.state.user.token) {
        // 输入的评论内容  value,
        if (!this.value) return false
        //  若有内容
        this.submiting = true // 提交按钮不可点击 为提交状态
        await this.$sleep(800) // 强制休眠 避免用户频繁刷屏
        try {
          const data = await commentOrReply({
            // 根据当前的评论是否有值来判断是传评论id 还是文章id
            target: this.reply.commentId
              ? this.reply.commentId
              : this.$route.query.artId, // 评论的目标id  文章或评论id
            content: this.value, // 评论内容
            art_id: this.reply.commentId ? this.$route.query.artId : null // 若评论的是文章需省略此参数
          })
          // 对评论回复
          if (this.reply.commentId) {
            this.reply.list.unshift(data.new_obj) // 将数据加到 队首评论的评论
            const comment = this.comments.find(
              item => item.com_id.toString() === this.reply.commentId.toString()
            )
            comment && comment.reply_count++ // 如果找到了 就对回复数据加1
          } else {
            this.comments.unshift(data.new_obj)
          }
          this.value = '' // 将评论框内容清空
        } catch (error) {
          this.$notified({
            type: 'danger', message: '评论失败'
          })
        }
        this.submiting = false // 状态关闭
      } else {
        // 用户决定是否去登录
        await this.$dialog.confirm({
          message: '如果您要评论，请先去登录'
        })
        this.$router.push({
          path: '/login/',
          query: {
            redirectUrl: this.$route.fullPath // 当前页面的地址，用户登录成功后跳转到该页面
          }
        })
      }
    },
    openReply (commentId) {
      this.showReply = true
      this.reply.commentId = commentId
      // 弹出回复面板时重置数据
      this.reply.list = [] // 清空之前的回复
      this.reply.offset = null
      this.reply.finished = false
      this.reply.loading = true
      // 弹出回复层时自动调用获取评论回复
      this.getReply()
    },
    // 获取评论的回复
    async getReply () {
      const data = await getComments({
        type: 'c',
        source: this.reply.commentId,
        offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      this.reply.loading = false // 关闭正在上拉加载的状态
      // 此时需要判断是否还有下一页 (当前页最后一条评论id和所有评论最后一条id的值是否相等)
      this.reply.finished = data.end_id === data.last_id
      if (!this.reply.finished) {
        this.reply.offset = data.last_id // 当前页的最后一个id
      }
    },
    // 滚动条距离底部距离超过一定距离自动触发
    async onLoad () {
      const { artId } = this.$route.query
      const data = await getComments({
        type: 'a', // a为文章评论 c表示回复（评论的评论）
        source: artId, // 查询的评论或文章的id
        offset: this.offset // 赋值当前页评论的最后一条
      })

      this.comments.push(...data.results) // 将评论数据追加到评论尾部
      this.loading = false // 关闭正在上拉加载的状态
      // 此时需要判断是否还有下一页 (当前页最后一条评论id和所有评论最后一条id的值是否相等)
      this.finished = data.end_id === data.last_id
      if (!this.finished) {
        this.offset = data.last_id // 当前页的最后一个id
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
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
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
