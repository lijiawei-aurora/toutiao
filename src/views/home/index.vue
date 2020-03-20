<template>
  <div class="container">
    <!-- 放置tabs组件 -->
    <!-- v-model 默认绑定当前激活的页签的索引 -->
    <van-tabs v-model='activeIndex'>
      <!-- 内部放置若干个标签 -->
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!--   <div class="scroll-wrapper">
          <van-cell-group>
            <van-cell v-for="item in 20" :key="item" :value="`nima${item}`"></van-cell>
          </van-cell-group>
        </div>-->
        <!-- props给子组件传值 -->
        <ArticleList :channel_id="item.id" @showMoreAction="openAction"></ArticleList>
      </van-tab>
      <!-- 编辑频道的图标 -->
      <span class="bar_btn">
        <van-icon name="wap-nav"></van-icon>
      </span>
    </van-tabs>
    <!-- 弹层组件 -->
    <van-popup v-model="showMoreAction" style="width:80%">
      <!-- 放置反馈的组件 dislikeArticles不感兴趣 reportAtricles举报 $event为自定义事件传的第一个参数-->
    <moreAction  @dislikeArticles='reportOrDislikeAtricles("dislike")' @reportAtricles='reportOrDislikeAtricles("report",$event)'> </moreAction>
          </van-popup>
  </div>
</template>

<script>
// 引入eventBus
import eventBus from '@/utils/eventBus'
// 引入不感兴趣接口
import { dislikeArticles, reportAtricles } from '@/api/articles'
// 引入 弹层组件
import moreAction from './components/more-action'
// 引入getMychannels方法
import { getMyChannels } from '@/api/channels'
// 引入articleList组件
import ArticleList from './components/article-list'

export default {
  name: 'Home',
  components: {
    ArticleList,
    moreAction
  },
  data () {
    return {
      channels: [], // 用于接收频道数据
      showMoreAction: false, // 是否显示弹层
      articleId: null, // 点击的文章id
      activeIndex: 0 // 当前默认激活的页签
    }
  },
  methods: {
    // 将两个方法封装到一起 operateType判断时执行不感兴趣还是举报
    async reportOrDislikeAtricles (operateType, type) {
      try {
        if (operateType === 'report') {
          await reportAtricles({ target: this.articleId, type })
        } else {
          await dislikeArticles({ target: this.articleId })
        }
        this.$notified({
          type: 'success',
          message: '操作成功'
        })
        this.showMoreAction = false
        eventBus.$emit('delArticles', this.articleId, this.channels[this.activeIndex].id)
      } catch (error) {
        this.$notified({ message: '操作失败' })
      }
    },
    // 举报文章  type为举报类型
    // async reportAtricles (type) {
    //   try {
    //     await reportAtricles({ target: this.articleId, type })
    //     this.$notified({
    //       type: 'success',
    //       message: '举报成功'
    //     })
    //     this.showMoreAction = false
    //     eventBus.$emit('delArticles', this.articleId, this.channels[this.activeIndex].id)
    //   } catch (error) {
    //     this.$notified({ message: '操作失败' })
    //   }
    // },
    // 不感兴趣的文章
    // async dislikeArticles () {
    //   try {
    //     await dislikeArticles({ target: this.articleId })
    //     // notified是自己封装的
    //     this.$notified({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    // 关闭弹层
    //   this.showMoreAction = false
    //   // 利用事件广播的机制 通知对应的tab来删除对应的不感兴趣文章 不让他显示
    //   // eventBus.$emit('自定义事件名', 传参) 触发事件
    //   // this.channels[this.activeIndex].id 当前激活页签的频道的id
    //   eventBus.$emit('delArticles', this.articleId, this.channels[this.activeIndex].id)
    // } catch (error) {
    //   this.$notified({
    //     message: '操作失败'
    //   })
    // }

    // ArticleList组件中触发点击事件后触发  artId为文章id
    openAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },
    async getMychannels () {
      const data = await getMyChannels()
      // console.log(result)
      this.channels = data.channels // 将数据赋值给data中的数据
    }
  },
  created () {
    this.getMychannels()
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
