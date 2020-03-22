// 用于处理频道数据
import request from '@/utils/request'
import store from '@/store'
// 本地缓存 需要key
const CACHE_CHANNEL_T = 'toutiao-tourist' // 游客用户的key
const CACHE_CHANNEL_U = 'toutiao-user' // 登录用户的ke
// 用于获取频道数据 没参数的匿名用户也可以获取 默认的频道列表

export function getMyChannels () {
  return new Promise(function (resolve, reject) {
    // 支持本地化的缓存，要区分当前是登录用户还是游客用户 根据是否有token
    const key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    const str = localStorage.getItem(key)
    if (str) {
      // 本地缓存有数据  把本地数据返回
      resolve({
        channels: JSON.parse(str)// 和请求体中结构一致
      })
    } else {
      // 本地缓存没有数据 去线上拉取
      request({
        url: '/user/channels'
      }).then(result => {
        // 获取请求结果 存到本地
        localStorage.setItem(key, JSON.stringify(result.channels))
        resolve(result) // 成功执行了用户频道数据
      })
    }
  })
}

// 获取全部频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

// 删除频道 id 为删除频道的依据
export function delChannels (id) {
  return new Promise(function (resolve, reject) {
    // 有id 从缓存中删除对应id 的数据
    const key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key))
    //  直接用filter 删除  返回不等于id内容的新数组
    // channels = channels.filter(item => item.id !== id)
    // localStorage.setItem(key, JSON.stringify(channels))
    // 方法二
    const index = channels.findIndex(item => item.id === id) // 查找id与传入id相同的下标
    if (index > -1) {
      channels.splice(index, 1) // 找到了就删除
      localStorage.setItem(key, JSON.stringify(channels))// 重新写入缓存
      // resolve({ message: '删除成功' })// 表示执行成功 可不传参数
      resolve()
    } else {
      reject(new Error('没有找到对应的频道'))
    }
  })
}

// 添加频道的方法 需传入要添加的频道对象
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    // 根据当前的token判断使用哪个key
    const key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    // 获取缓存的数据
    const channels = JSON.parse(localStorage.getItem(key))
    channels.push(channel) // 将添加的频道数据添加到队尾
    localStorage.setItem(key, JSON.stringify(channels))// 重新写入缓存
    resolve()// 使用promise执行成功
  })
}
