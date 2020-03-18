/****
 * 专门处理用户相关的请求
 * *** */
import request from '@/utils/request' // 引入请求模块
// request 相当于axios的一个实例，与axios有相同方法和属性

// 登录方法  需要穿body参数
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    data
  })
}
