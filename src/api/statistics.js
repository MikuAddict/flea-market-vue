import request from './index'

export default {
  // 获取月度交易商品排行
  getMonthlyProductRanking(params) {
    return request({
      url: '/statistics/monthly-products',
      method: 'get',
      params
    })
  },

  // 获取活跃用户排行
  getActiveUserRanking(params) {
    return request({
      url: '/statistics/active-users',
      method: 'get',
      params
    })
  },

  // 获取需求量大商品排行
  getHighDemandProducts(params) {
    return request({
      url: '/statistics/high-demand-products',
      method: 'get',
      params
    })
  },

  // 获取闲置量大商品排行
  getHighInventoryProducts(params) {
    return request({
      url: '/statistics/high-inventory-products',
      method: 'get',
      params
    })
  },

  // 获取综合统计信息
  getComprehensiveStatistics(params) {
    return request({
      url: '/statistics/comprehensive',
      method: 'get',
      params
    })
  },

  // 获取月度统计数据
  getMonthlyStatistics(params) {
    return request({
      url: '/statistics/monthly',
      method: 'get',
      params
    })
  },

  // 获取用户交易统计
  getUserStatistics(userId) {
    return request({
      url: `/statistics/user/${userId}`,
      method: 'get'
    })
  },

  // 获取商品交易统计
  getProductStatistics(productId) {
    return request({
      url: `/statistics/product/${productId}`,
      method: 'get'
    })
  }
}