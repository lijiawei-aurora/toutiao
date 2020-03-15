// 用于读写token
const USER_TOKEN = 'toutiao-mobile' // 专门用于存储用户信息
export function setUser (user) { // 设置用户的token信息
  // 此时的user为对象
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}
export function getUser () { // 获取用户的token信息
  // 若有信息返回 没有返回空对象{ }
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
}
export function delUser () { // 删除用户的token信息
  localStorage.removeItem(USER_TOKEN)
}
