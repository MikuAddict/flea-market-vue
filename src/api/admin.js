import { request } from './api-client'

// 管理员专用API接口，基于OpenAPI规范
export default {
  // 用户管理
  user: {
    // 管理员创建用户
    addUser(data) {
      return request({
        url: '/user/add',
        method: 'post',
        data
      })
    },

    // 管理员删除用户
    deleteUser(id) {
      return request({
        url: `/user/${id}`,
        method: 'delete'
      })
    },

    // 管理员更新用户信息
    updateUser(data) {
      return request({
        url: `/user/${data.id}`,
        method: 'put',
        data
      })
    },

    // 管理员更新用户状态
    updateUserStatus(id, status) {
      return request({
        url: `/user/${id}/status`,
        method: 'put',
        params: { status }
      })
    },

    // 管理员重置用户密码
    resetUserPassword(id) {
      return request({
        url: `/user/${id}/reset-password`,
        method: 'post'
      })
    },

    // 根据ID获取用户
    getUserById(id) {
      return request({
        url: '/user/get',
        method: 'get',
        params: { id }
      })
    },

    // 根据ID获取用户视图
    getUserVOById(id) {
      return request({
        url: '/user/get/vo',
        method: 'get',
        params: { id }
      })
    },

    // 分页获取用户视图列表
    getUserVoList(params) {
      return request({
        url: '/user/list/page/vo',
        method: 'get',
        params
      })
    }
  },

  // 二手物品管理
  product: {
    // 管理员获取所有二手物品列表
    adminListProducts(params) {
      return request({
        url: '/product/admin/list',
        method: 'get',
        params
      })
    },

    // 管理员审核二手物品
    reviewProduct(id, status) {
      return request({
        url: `/product/${id}/review`,
        method: 'put',
        params: { status }
      })
    }
  },

  // 分类管理
  category: {
    // 添加二手物品分类
    addCategory(data) {
      return request({
        url: '/category/add',
        method: 'post',
        data
      })
    },

    // 更新二手物品分类
    updateCategory(data) {
      return request({
        url: `/category/${data.id}`,
        method: 'put',
        data
      })
    },

    // 删除二手物品分类
    deleteCategory(id) {
      return request({
        url: `/category/${id}`,
        method: 'delete'
      })
    },

    // 获取所有二手物品分类
    getCategoryList() {
      return request({
        url: '/category/list',
        method: 'get'
      })
    }
  },

  // 新闻管理
  news: {
    // 添加新闻
    addNews(data) {
      return request({
        url: '/news/add',
        method: 'post',
        data
      })
    },

    // 删除新闻
    deleteNews(id) {
      return request({
        url: `/news/${id}`,
        method: 'delete'
      })
    },

    // 分页获取新闻列表
    getNewsList(params) {
      return request({
        url: '/news/list',
        method: 'get',
        params
      })
    },

    // 获取新闻详情
    getNewsDetail(id) {
      return request({
        url: `/news/${id}`,
        method: 'get'
      })
    },

    // 获取最新新闻
    getLatestNews() {
      return request({
        url: '/news/latest',
        method: 'get'
      })
    }
  },

  // 图片管理
  image: {
    // 通用图片上传
    uploadImage(file, type) {
      const formData = new FormData()
      formData.append('file', file)
      return request({
        url: '/image',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: { type }
      })
    },

    // 上传新闻配图
    uploadNewsImage(file) {
      const formData = new FormData()
      formData.append('file', file)
      return request({
        url: '/image/news',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    // 删除图片
    deleteImage(imageUrl) {
      return request({
        url: '/image',
        method: 'delete',
        params: { imageUrl }
      })
    }
  },

  // 统计分析
  statistics: {
    // 获取月度交易二手物品排行
    getMonthlyTopSellingProducts(month, year, limit) {
      return request({
        url: '/statistics/monthly-products',
        method: 'get',
        params: { month, year, limit }
      })
    },

    // 获取活跃用户排行
    getActiveUsersRanking(limit, startDate, endDate) {
      return request({
        url: '/statistics/active-users',
        method: 'get',
        params: { limit, startDate, endDate }
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

    // 获取闲置量大二手物品排行
    getHighInventoryProducts(limit) {
      return request({
        url: '/statistics/high-inventory-products',
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
    }
  }
}