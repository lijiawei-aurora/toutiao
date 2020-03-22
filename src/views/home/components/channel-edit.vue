<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <!-- 编辑/完成按钮的显示，点击按钮后改变editing的状态 -->
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 布局组件 将页面分成等宽度的份数 -->
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <!-- 将当前点击的频道id传出去 点击哪个频道 跳转到哪个频道上 -->
          <!-- :class="{red:index===activeIndex}" 当前激活页签对应的频道的颜色为红色 -->
          <span :class="{red:index===activeIndex}" class="f12" @click="$emit('selectChannel',item.id)"  >{{item.name}}</span>
          <!-- 标题名称后面的叉号 ，进入编辑状态后再显示 -->
          <!-- 索引为0的推荐不论什么状态都不显示 叉号 -->
          <van-icon v-if="editing&&index!==0" class="btn" name="cross" @click="$emit('delChannel',item.id)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 当前用户自己的频道（登录和未登录） -->
    <div class="channel">
      <!-- 可选频道为 全部频道-我的频道 -->
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <!-- 点击加号触发 -->
          <van-icon  class="btn" name="plus" @click="$emit('addChannel',item)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false, // 编辑状态 控制是否显示编辑状态
      allChannels: [] // 接收全部的频道数据

    }
  },
  props: {
    channels: {
      required: true, // 必须传递
      type: Array // 数组类型

    },
    activeIndex: { // 当前激活索引
      type: Number
    }
  },
  // 计算属性 必须有return
  computed: {
    // 可选频道  全部频道 减去我的频道
    optionalChannels () {
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },

  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels // 直接将频道数据赋值给频道
    }
  },
  created () {
    this.getAllChannels()
  }
}

</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
