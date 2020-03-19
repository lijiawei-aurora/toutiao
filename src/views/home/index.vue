<template>
  <div class="container">
    <!-- 放置tabs组件 -->
    <van-tabs>
      <!-- 内部放置若干个标签 -->
     <van-tab v-for="item in channels" :key="item.id" :title="item.name">
      <!--   <div class="scroll-wrapper">
          <van-cell-group>
            <van-cell v-for="item in 20" :key="item" :value="`nima${item}`"></van-cell>
          </van-cell-group>
        </div> -->
        <!-- props给子组件传值 -->
        <ArticleList :channel_id="item.id"></ArticleList>
      </van-tab>
      <!-- 编辑频道的图标 -->
      <span class="bar_btn">
        <van-icon name="wap-nav"></van-icon>
      </span>
    </van-tabs>
  </div>

</template>

<script>
// 引入getMychannels方法
import { getMyChannels } from '@/api/channels'
// 引入articleList组件
import ArticleList from './components/article-list'
export default {
  name: 'Home',
  components: {
    ArticleList
  },
  data () {
    return {
      channels: [] // 用于接收频道数据
    }
  },
  methods: {
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
