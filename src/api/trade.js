import { request } from './api-client'

export default {
  // 获取交易记录详情
  getTradeRecordDetail(id) {
    return request({
      url: `/trade-record/${id}`,
      method: 'get'
    })
  },

  // 获取卖家的交易记录列表
  listSellerTradeRecords(params) {
    return request({
      url: '/trade-record/list/seller',
      method: 'get',
      params
    })
  },

  // 获取买家的交易记录列表
  listBuyerTradeRecords(params) {
    return request({
      url: '/trade-record/list/buyer',
      method: 'get',
      params
    })
  },

  // 管理员获取所有交易记录
  adminListTradeRecords(params) {
    return request({
      url: '/trade-record/admin/list',
      method: 'get',
      params
    })
  }
}