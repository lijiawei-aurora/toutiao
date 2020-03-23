
<template>
  <div class="container">
    <!-- 导航  go(-1) back() 回到上一个历史记录 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 放置搜索结果列表 实现上拉加载 -->
    <van-list @load="onLoad" v-model="upLoading" :finished="finished" :finished-text="我也是有底线的哦">
      <van-cell-group>
        <van-cell v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <!-- 文章标题 -->
            <h3 class="van-ellipsis"> {{ item.title  }}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]"/>
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_coutn}}评论</span>
              <span>{{item.pubdate|relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticles } from '@/api/articles'
export default {
  data () {
    return {
      upLoading: false, // 上拉加载状态
      finished: false, // 表示当前的加载是否全部完成了 如果全部完成 应该将finished设置成true
      articles: [], // 放置搜索结果文章的
      page: {
        page: 1, // 当前第几页
        per_page: 10 // 每页的多少条
      }
    }
  },
  methods: {
    // 该方法在滚动条滚动到底部的时候执行
    async  onLoad () {
      const { q } = this.$route.query // 获取query参数
      const data = await searchArticles({
        // ...page 扩展
        ...this.page, q
      })
      this.articles.push(...data.results) // 将结果追加到articles后面
      this.upLoading = false // 关闭上拉加载状态
      if (data.results.length) { // 判断当前的查询结果是否有数据
        this.paga.page++ // 将页码切到下一页
      } else { this.finished = true }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
