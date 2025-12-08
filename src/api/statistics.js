import { request } from './api-client'

export default {
  // 获取用户交易统计
  getUserTradeStatistics(userId) {
    return request({
      url: `/statistics/user/${userId}`,
      method: 'get'
    })
  },

  // 获取二手物品交易统计
  getProductTradeStatistics(productId) {
    return request({
      url: `/statistics/product/${productId}`,
      method: 'get'
    })
  },

  // 获取月度统计数据
  getMonthlyStatistics(month, year) {
    return request({
      url: '/statistics/monthly',
      method: 'get',
      params: { month, year }
    })
  },

  // 获取月度交易二手物品排行
  getMonthlyTopSellingProducts(month, year, limit) {
    return request({
      url: '/statistics/monthly-products',
      method: 'get',
      params: { month, year, limit }
    })
  },

  // 获取闲置量大二手物品排行
  getHighInventoryProducts(limit) {
    return request({
      url: '/statistics/high-inventory-products',
      method: 'get',
      params: { limit }
    })
  },

  // 获取需求量大二手物品排行
  getHighDemandProducts(limit) {
    return request({
      url: '/statistics/high-demand-products',
      method: 'get',
      params: { limit }
    })
  },

  // 获取综合统计信息
  getComprehensiveStatistics(startDate, endDate) {
    return request({
      url: '/statistics/comprehensive',
      method: 'get',
      params: { startDate, endDate }
    })
  },

  // 获取活跃用户排行
  getActiveUsersRanking(limit, startDate, endDate) {
    return request({
      url: '/statistics/active-users',
      method: 'get',
      params: { limit, startDate, endDate }
    })
  }
}