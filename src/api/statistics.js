import { request } from './api-client'

export default {
  // 获取月度统计数据
  getMonthlyStatistics(year, month) {
    return request({
      url: '/statistics/monthly',
      method: 'get',
      params: { year, month }
    })
  },

  // 获取每月物品分类已售量
  getMonthlyCategorySoldInventory(year, month) {
    return request({
      url: '/statistics/monthly/category-sold',
      method: 'get',
      params: { year, month }
    })
  },

  // 获取每月交易成功物品分类排行
  getMonthlyCategoryRanking(year, month) {
    return request({
      url: '/statistics/monthly/category-ranking',
      method: 'get',
      params: { year, month }
    })
  },

  // 获取每月物品分类在售量
  getMonthlyCategoryOnSaleInventory(year, month) {
    return request({
      url: '/statistics/monthly/category-on-sale',
      method: 'get',
      params: { year, month }
    })
  },

  // 获取每月活跃用户排行
  getMonthlyActiveUserRanking(year, month) {
    return request({
      url: '/statistics/monthly/active-user-ranking',
      method: 'get',
      params: { year, month }
    })
  }
}