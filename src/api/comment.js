import { request } from './api-client'

export default {
  // 添加留言
  addComment(data) {
    return request({
      url: '/product-comment/add',
      method: 'post',
      data
    })
  },

  // 删除留言
  deleteComment(id) {
    return request({
      url: `/product-comment/${id}`,
      method: 'delete'
    })
  },

  // 获取留言树形结构
  getCommentTree(productId) {
    return request({
      url: '/product-comment/tree',
      method: 'get',
      params: { productId }
    })
  },

  // 分页获取留言列表
  getCommentsByPage(params) {
    return request({
      url: '/product-comment/page',
      method: 'get',
      params
    })
  }
}