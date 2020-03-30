<template>
  <div class="container">
    <!-- 放置tabs组件 -->
    <!-- v-model 默认绑定当前激活的页签的索引 -->
    <van-tabs v-model='activeIndex' @change="changeTab">
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
      <span class="bar_btn" @click="showChannelEdit=true">
        <van-icon name="wap-nav"></van-icon>
      </span>
    </van-tabs>
    <!-- 弹层组件 -->
    <van-popup v-model="showMoreAction" style="width:80%">
      <!-- 放置反馈的组件 dislikeArticles不感兴趣 reportAtricles举报 $event为自定义事件传的第一个参数-->
    <moreAction  @dislikeArticles='reportOrDislikeAtricles("dislike")' @reportAtricles='reportOrDislikeAtricles("report",$event)'> </moreAction>
    </van-popup>
    <!-- 弹出面板组件 v-model控制是否显示round取消圆角 默认为true-->
    <van-action-sheet v-model='showChannelEdit' title="编辑频道" :round="false">
        <!-- 频道编辑组件 -->
        <!-- :channels="channels"将父组件的值传递给子组件 -->
        <!-- 监听selectChannel事件 -->
<ChannelEdit :activeIndex="activeIndex" :channels="channels" @addChannel="addChannel" @delChannel='delChannel' @selectChannel='selectChannel'></ChannelEdit>
    </van-action-sheet>
  </div>
</template>

<script>
import ChannelEdit from './components/channel-edit' // 引入编辑频道状态
// 引入eventBus
import eventBus from '@/utils/eventBus'
// 引入不感兴趣接口
import { dislikeArticles, reportAtricles } from '@/api/articles'
// 引入 弹层组件
import moreAction from './components/more-action'
// 引入getMychannels方法
import { getMyChannels, delChannels, addChannel } from '@/api/channels'
// 引入articleList组件
import ArticleList from './components/article-list'

export default {
  name: 'Home',
  components: {
    ArticleList,
    moreAction,
    ChannelEdit
  },
  data () {
    return {
      channels: [], // 用于接收频道数据
      showMoreAction: false, // 是否显示弹层
      articleId: null, // 点击的文章id
      activeIndex: 0, // 当前默认激活的页签
      showChannelEdit: false // 是否显示频道编辑组件
    }
  },
  methods: {
    // 切换页签事件
    changeTab () {
      eventBus.$emit(('changeTab'), this.channels[this.activeIndex].id)
    },
    // 添加频道的方法
    async addChannel (channel) {
      try {
        await addChannel(channel)
        this.channels.push(channel) // 频道的数据（页签显示的我的频道）
      } catch {}
    },
    // 子组件触发selectChannel时 触发该方法
    selectChannel (id) {
      // 方法二可以直接传递索引 就不需要该句了
      const index = this.channels.findIndex(item => item.id === id) // 获取当前点击（传过来的id）的频道的索引
      this.activeIndex = index // 将当前激活页签索引值更改为对应频道的索引
      this.showChannelEdit = false// 关闭弹层
    },
    // 删除频道的方法
    async delChannel (id) {
      try {
        await delChannels(id)
        const index = this.channels.findIndex(item => item.id === id)
        // 若删除的索引在当前激活索引之前或等于当前激活索引
        // 当前激活索引会改变， 若删除后面的不影响
        if (index <= this.activeIndex) {
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1)// 删除对应索引频道
      } catch (error) {
        this.$notified({ message: '删除频道失败' })
      }
    },
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
    this.getMychannels() // 获取我的频道
  }
}
</script>

<style lang="less" scoped>
// 弹出面板组件的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
