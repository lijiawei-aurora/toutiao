
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
