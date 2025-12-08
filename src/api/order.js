import { request } from './api-client'

export default {
  // 创建订单
  createOrder(productId) {
    return request({
      url: '/order',
      method: 'post',
      params: { productId }
    })
  },

  // 支付订单
  payOrder(orderId) {
    return request({
      url: `/order/${orderId}/pay`,
      method: 'put'
    })
  },

  // 取消订单
  cancelOrder(orderId) {
    return request({
      url: `/order/${orderId}/cancel`,
      method: 'put'
    })
  },

  // 完成订单
  completeOrder(orderId) {
    return request({
      url: `/order/${orderId}/complete`,
      method: 'put'
    })
  },

  // 获取订单详情
  getOrderById(orderId) {
    return request({
      url: `/order/${orderId}`,
      method: 'get'
    })
  },

  // 获取买家订单列表
  getBuyerOrderList(params) {
    return request({
      url: '/order/list/buyer',
      method: 'get',
      params
    })
  },

  // 获取卖家订单列表
  getSellerOrderList(params) {
    return request({
      url: '/order/list/seller',
      method: 'get',
      params
    })
  },

  // 获取订单统计信息
  getOrderStatistics() {
    return request({
      url: '/order/statistics',
      method: 'get'
    })
  },

  // 管理员获取所有订单列表
  adminGetOrderList(params) {
    return request({
      url: '/order/admin/list',
      method: 'get',
      params
    })
  },

  // 提交支付凭证
  submitPaymentProof(data) {
    return request({
      url: '/order/payment-proof',
      method: 'post',
      data
    })
  },

  // 确认订单（买家确认收货）
  confirmOrder(data) {
    return request({
      url: '/order/confirm',
      method: 'put',
      data
    })
  },

  // 模拟微信支付
  simulateWechatPay(orderId) {
    return request({
      url: `/order/${orderId}/pay/wechat`,
      method: 'put'
    })
  },

  // 积分兑换二手物品
  exchangeWithPoints(orderId) {
    return request({
      url: `/order/${orderId}/pay/points`,
      method: 'put'
    })
  },

  // 申请物品交换
  applyForExchange(orderId) {
    return request({
      url: `/order/${orderId}/exchange/apply`,
      method: 'post'
    })
  },

  // 确认物品交换
  confirmExchange(orderId) {
    return request({
      url: `/order/${orderId}/exchange/confirm`,
      method: 'put'
    })
  }
}