import { request } from './api-client'

export default {
  // 创建订单
  createOrder(data) {
    return request({
      url: '/order/create',
      method: 'post',
      data
    })
  },

  // 支付订单
  payOrder(orderId) {
    return request({
      url: `/order/pay/${orderId}`,
      method: 'post'
    })
  },

  // 取消订单
  cancelOrder(orderId) {
    return request({
      url: `/order/cancel/${orderId}`,
      method: 'post'
    })
  },

  // 完成订单
  completeOrder(orderId) {
    return request({
      url: `/order/complete/${orderId}`,
      method: 'post'
    })
  },

  // 获取订单详情
  getOrderById(orderId) {
    return request({
      url: `/order/get/${orderId}`,
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

  // 根据状态获取买家订单列表
  getBuyerOrderListByStatus(status, params) {
    return request({
      url: `/order/list/buyer/status/${status}`,
      method: 'get',
      params
    })
  },

  // 根据状态获取卖家订单列表
  getSellerOrderListByStatus(status, params) {
    return request({
      url: `/order/list/seller/status/${status}`,
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
      url: '/order/submit/proof',
      method: 'post',
      data
    })
  },

  // 确认订单（买家确认收货）
  confirmOrder(orderId) {
    return request({
      url: '/order/confirm',
      method: 'post',
      data: { orderId }
    })
  },

  // 模拟微信支付
  wechatPay(orderId) {
    return request({
      url: `/order/pay/wechat/${orderId}`,
      method: 'post'
    })
  },

  // 积分兑换商品
  pointsPay(orderId) {
    return request({
      url: `/order/pay/points/${orderId}`,
      method: 'post'
    })
  },

  // 申请物品交换
  applyExchange(orderId) {
    return request({
      url: `/order/exchange/apply/${orderId}`,
      method: 'post'
    })
  },

  // 确认物品交换
  confirmExchange(orderId) {
    return request({
      url: `/order/exchange/confirm/${orderId}`,
      method: 'post'
    })
  }
}