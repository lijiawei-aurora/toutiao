// 用于处理频道数据
import request from '@/utils/request'

// 用于获取频道数据 没参数的匿名用户也可以获取 默认的频道列表
export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
}
