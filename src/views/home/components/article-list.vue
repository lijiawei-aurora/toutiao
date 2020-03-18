<template>
  <!-- 文章列表组件 -->
  <!-- 上拉加载 -->
  <!-- 滚动条 -->
  <div class="scrollwrapper">
      <!-- List 组件通过loading和finished两个变量控制加载状态，当组件滚动到底部时，会触发load事件并将loading设置成true。此时可以发起异步操作并更新数据，数据更新完毕后，将loading设置成false即可。若数据已全部加载完毕，则直接将finished设置成true即可。 -->
      <!-- 文章列表  loading表示是否在上拉加载
      finished表示数据是否已经都加载完毕-->
      <!-- van-list 初始化完毕后会自动检测距离底部的距离 -->
  <van-list v-model="loading" @load="onload" ></van-list>

  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false, // 是否开启了上拉加载，默认值为false
      finished: false // 是否已经完成所有数据的加载
    }
  },
  methods: {
    // 一秒后停止加载
    onload () {
      setTimeout(() => {
        this.finished = true
      }, 1000)
    }

  }

}
</script>

<style>

</style>
