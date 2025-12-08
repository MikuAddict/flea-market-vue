import { request } from './api-client'

export default {
  // 添加评价
  addReview(data) {
    return request({
      url: '/review/add',
      method: 'post',
      data
    })
  },

  // 更新评价信息
  updateReview(data) {
    return request({
      url: '/review/update',
      method: 'put',
      data
    })
  },

  // 删除评价
  deleteReview(id) {
    return request({
      url: '/review/delete',
      method: 'post',
      data: { id }
    })
  },

  // 获取评价详情
  getReviewById(id) {
    return request({
      url: `/review/get/${id}`,
      method: 'get'
    })
  },

  // 分页获取评价列表
  getReviewList(params) {
    return request({
      url: '/review/list/page',
      method: 'get',
      params
    })
  },

  // 根据二手物品ID获取评价列表
  getReviewListByProduct(productId, params) {
    return request({
      url: `/review/list/product/${productId}`,
      method: 'get',
      params
    })
  },

  // 根据用户ID获取评价列表
  getReviewListByUser(userId, params) {
    return request({
      url: `/review/list/user/${userId}`,
      method: 'get',
      params
    })
  },

  // 根据订单ID获取评价列表
  getReviewListByOrder(orderId, params) {
    return request({
      url: `/review/list/order/${orderId}`,
      method: 'get',
      params
    })
  },

  // 获取用户对二手物品的评价
  getUserReviewForProduct(userId, productId) {
    return request({
      url: `/review/get/user/${userId}/product/${productId}`,
      method: 'get'
    })
  },

  // 获取当前用户对二手物品的评价
  getMyReviewForProduct(productId) {
    return request({
      url: `/review/get/my/product/${productId}`,
      method: 'get'
    })
  },

  // 获取二手物品平均评分
  getAverageRating(productId) {
    return request({
      url: `/review/average/${productId}`,
      method: 'get'
    })
  },

  // 获取二手物品评价统计信息
  getReviewStatistics(productId) {
    return request({
      url: `/review/statistics/${productId}`,
      method: 'get'
    })
  },

  // 获取当前用户的评价列表
  getMyReviewList(params) {
    return request({
      url: '/review/list/my',
      method: 'get',
      params
    })
  },

  // 管理员获取所有评价列表
  adminGetReviewList(params) {
    return request({
      url: '/review/admin/list',
      method: 'get',
      params
    })
  }
}