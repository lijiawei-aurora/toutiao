<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 搜索时触发search事件 -->
    <van-search  placeholder="请输入搜索关键词" v-model="q" shape="round" @search="onSearch()" />
    <!-- 联想功能  联想和历史记录功能只显示一个 -->
    <van-cell-group class="suggest-box" v-if="q"   >
      <van-cell @click="toSearchResult(item)" icon="search" v-for="(item,index) in suggestionList" :key="index">
        {{item}}
      </van-cell>
    </van-cell-group>
    <!-- 历史记录功能  若没有历史记录 应该隐藏起来-->
    <div class="history-box" v-else>
      <!-- 当历史记录列表有内容 才显示 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <!-- 清空历史记录 -->
        <van-icon name="delete" @click="clear"></van-icon>
       </div>
      <van-cell-group>
        <van-cell @click="toSearchResult" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <!-- 此时会事件冒泡  子组件执行click会触发父组件的click -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/articles'
const key = 'toutiao-history'// 本地缓存 存历史记录
export default {
  name: 'search',
  data () {
    return {
      q: '',
      historyList: [],
      suggestionList: [] //  联想的搜索建议
    }
  },
  watch: {
    q () {
      // q的值改变就触发事件
      // 防抖函数
      clearTimeout(this.timer)// 清除定时器
      this.timer = setTimeout(async () => {
        if (!this.q) { // 搜索框无内容
          this.suggestionList = [] // 将联想清空
          return // 不再向后执行
        }
        const data = await getSuggestion({ q: this.q })
        this.suggestionList = data.options
      }, 500)
    }

  },
  created () {
    // 接收搜索的历史记录 没有就存入空数组
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  },
  methods: {
    toSearchResult (text) { // 点击联想内容调跳到搜索页
      this.historyList.push(text)// 放到历史记录
      this.historyList = Array.from(new Set(this.historyList))
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 将添加了搜索内容的重新传入本地缓存
      this.$router.push({ path: '/search/result/', query: { q: text } })
    },
    delHistory (index) { // 删除历史记录
      alert(1)
      this.historyList.splice(index, 1) // 删除历史数据数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 将删除后的重新传入本地缓存
    },

    async clear () { // 清空历史记录
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要删除所有的历史记录吗'
        })
        // 将历史记录清空存入本地
        this.historyList = []
        localStorage.setItem(key, JSON.stringify(this.historyList)) // 将删除后的重新传入本地缓存
      } catch (error) {}
    },
    onSearch () {
    //  搜索事件触发时执行
      if (!this.q) return // 若搜索框内容为空，不往后执行
      this.historyList.push(this.q)
      this.historyList = Array.from(new Set(this.historyList))// 去除重复数据
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 将添加了搜索内容的重新传入本地缓存

      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
