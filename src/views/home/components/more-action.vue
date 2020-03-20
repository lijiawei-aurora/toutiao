
<template>
  <div class="more-action">
      <!-- v-if 和v-else  if不满足就执行else -->
      <!-- 单元格组件 -->
    <van-cell-group v-if="!isReport">
      <!-- click 事件是vant组件封装的 -->
      <van-cell @click="$emit('dislikeArticles')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
      <!-- 单元格组件  在点击反馈垃圾内容后显示 点击返回后隐藏显示v-if中的-->
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 举报文章的选项  item.value为举报的类型-->
      <van-cell @click="$emit('reportAtricles',item.value)" v-for='item in reports' :key="item.value">{{item.label}}</van-cell>

    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants'

export default {
  data () {
    return {
      isReport: false, // 是否举报
      reports // reports:reports es6简写方式  将引入的reports赋给该reports
    }
  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
