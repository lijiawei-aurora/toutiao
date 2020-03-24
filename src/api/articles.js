
/****
 * 处理文章模块的请求数据
 *
 * ***/
import request from '@/utils/request'

// 获取文章推荐数据
export function getArticles (params) {
  return request({
    //   这里必须用完整地址 与之前的baseURL不同
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    // with_top是否包含置顶  1为包含
    params: { with_top: 1, ...params } // 合并数据
  })
}

// 不感兴趣的文章接口
export function dislikeArticles (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}

// 举报文章接口
export function reportAtricles (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}

// 获取联想搜索建议
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}

// 搜索文章方法
export function searchArticles (params) {
  return request({
    url: '/search',
    params// 关键字及分页信息
  })
}

// 获取文章详情
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}

// 获取文章评论 或评论回复
// 传入 type（文章的评论还是评论的回复）
// source(文章或评论id) offset(访问第二页 传入第一页最后一个id 以此类推 查第一页offset为空)
export function getComments (params) {
  return request({
    url: '/comments',
    params
  })
}
