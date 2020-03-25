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

// 关注用户
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
// 取消关注用户
export function cancelfollowUser (autid) {
  return request({
    url: `/user/followsings/${autid}`,
    method: 'delete'
  })
}

// 获取用户资料
export function getUserInfo () {
  return request({
    url: '/user'
  })
}

/****
 * 获取用户个人资料
 * *****/
export function getUserProfile () {
  return request({
    url: '/user/profile' // 获取用户个人资料的接口地址
  })
}

/****
 * 修改用户头像
 * *****/
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}

// 保存用户信息
export function savaUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null }// 直接将photo设置为空  photo 通过修改头像更改
  })
}
