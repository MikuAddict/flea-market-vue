import { request } from './api-client'

export default {
  // 添加二手物品
  addProduct(data) {
    return request({
      url: '/product/add',
      method: 'post',
      data
    })
  },

  // 更新二手物品信息
  updateProduct(data) {
    return request({
      url: '/product/update',
      method: 'put',
      data
    })
  },

  // 删除二手物品
  deleteProduct(id) {
    return request({
      url: '/product/delete',
      method: 'post',
      data: { id }
    })
  },

  // 获取二手物品详情
  getProductById(id) {
    return request({
      url: `/product/get/${id}`,
      method: 'get'
    })
  },

  // 分页获取二手物品列表
  getProductList(params) {
    return request({
      url: '/product/list/page',
      method: 'get',
      params
    })
  },

  // 根据分类获取二手物品列表
  getProductListByCategory(categoryId, params) {
    return request({
      url: `/product/list/category/${categoryId}`,
      method: 'get',
      params
    })
  },

  // 搜索二手物品
  searchProducts(params) {
    return request({
      url: '/product/search',
      method: 'get',
      params
    })
  },

  // 高级搜索二手物品
  advancedSearchProducts(params) {
    return request({
      url: '/product/advanced-search',
      method: 'get',
      params
    })
  },

  // 获取用户发布的二手物品列表
  getProductListByUser(userId, params) {
    return request({
      url: `/product/list/user/${userId}`,
      method: 'get',
      params
    })
  },

  // 获取当前用户发布的二手物品列表
  getMyProductList(params) {
    return request({
      url: '/product/list/my',
      method: 'get',
      params
    })
  },

  // 更新二手物品状态
  updateProductStatus(id, status) {
    return request({
      url: `/product/status/${id}`,
      method: 'put',
      data: { status }
    })
  },

  // 获取最新二手物品列表
  getLatestProducts(params) {
    return request({
      url: '/product/latest',
      method: 'get',
      params
    })
  },

  // 管理员审核二手物品
  reviewProduct(id, status) {
    return request({
      url: `/product/review/${id}`,
      method: 'put',
      data: { status }
    })
  },

  // 管理员获取所有二手物品列表
  adminGetProductList(params) {
    return request({
      url: '/product/admin/list',
      method: 'get',
      params
    })
  }
}