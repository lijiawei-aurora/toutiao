<template>
  <div class="home">
    <!-- 放置tabs组件 -->
    <van-tabs>
      <!-- 内部放置若干个标签 -->
      <van-tab v-for="item in 10" :key="item" :title="`标签${item}`">
        <!-- 设置滚动条 -->
        <!-- <div class="scroll-wrapper">
          <van-cell-group>
            单元格
            <van-cell title="标题" value="内容"></van-cell>
          </van-cell-group>
        </div> -->
        <ArticleList></ArticleList>
      </van-tab>
      <span class="bar_btn">
      <van-icon name="wap-nav"></van-icon>
    </span>
    </van-tabs>

  </div>
</template>

<script>
import ArticleList from './components/article-list'
export default {
  name: 'Home',
  components: {
    ArticleList
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
 // 需要放置编辑频道图标的位置
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
