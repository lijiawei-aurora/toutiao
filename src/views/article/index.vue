<template>
  <div class="container">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <van-button :loading="followLoading" @click='follow' round size="small" type="info">{{ article.is_followed ? '已关注' : '+ 关注' }}</van-button>
      </div>
      <!-- 文章内容 -->
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <!-- 根据是否喜欢判断谁拥有active -->
        <van-button round size="small" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          round
          size="small"
          plain
          icon="delete"
          :class="{active:article.attitude===0}"
        >不喜欢</van-button>
      </div>
       <Comment></Comment>
    </div>

  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, cancelfollowUser } from '@/api/user'
import Comment from './components/comment'// 引入评论组件
export default {
  data () {
    return {
      article: {}, // 接收文章详情数据
      followLoading: false // 是否正在点击关注
    }
  },
  components: {
    Comment
  },
  methods: {
    // 获取文章详情数据
    async  getArticleInfo () {
      const { artId } = this.$route.query // 从当前的路径中获取文章id
      const data = await getArticleInfo(artId)
      this.article = data
    },
    async  follow () {
      this.followLoading = true
      try {
        if (this.article.is_followed) { // 根据isfollowed的值来判断操作
          await cancelfollowUser(this.article.aut_id)// 传入作者id
        } else {
          await followUser({
            target: this.article.aut_id
          })
        }
        this.article.is_followed = !this.article.is_followed
      } catch (error) {
        this.$notified({ message: '操作失败' })
      } finally { // 不论成功与否都执行
        this.followLoading = false
      }
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 46px;
    z-index:1;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
