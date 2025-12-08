import { request } from './api-client'

export default {
  // 添加评价
  addReview(data) {
    return request({
      url: '/review',
      method: 'post',
      data
    })
  },

  // 删除评价
  deleteReview(id) {
    return request({
      url: `/review/${id}`,
      method: 'delete'
    })
  },

  // 获取评价详情
  getReviewById(id) {
    return request({
      url: `/review/${id}`,
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

  // 根据用户ID获取评价列表
  getReviewListByUser(userId, params) {
    return request({
      url: `/review/user/${userId}`,
      method: 'get',
      params
    })
  },

  // 根据订单ID获取评价
  getReviewByOrderId(orderId) {
    return request({
      url: `/review/order/${orderId}`,
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