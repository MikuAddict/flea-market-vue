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
      url: `/product/${data.id}`,
      method: 'put',
      data
    })
  },

  // 删除二手物品
  deleteProduct(id) {
    return request({
      url: `/product/${id}`,
      method: 'delete'
    })
  },

  // 获取二手物品详情
  getProductById(id) {
    return request({
      url: `/product/${id}`,
      method: 'get'
    })
  },

  // 高级搜索二手物品
  advancedSearchProducts(params) {
    console.log('[ProductAPI] 调用 advancedSearchProducts，参数:', params);
    console.log('[ProductAPI] request 函数:', request);
    const result = request({
      url: '/product/advanced-search',
      method: 'get',
      params
    });
    console.log('[ProductAPI] request 结果:', result);
    return result;
  },

  // 获取用户发布的二手物品列表
  getProductListByUser(userId, params) {
    return request({
      url: `/product/user/${userId}`,
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

  // 获取最新二手物品列表
  getLatestProducts(params) {
    return request({
      url: '/product/latest',
      method: 'get',
      params
    })
  },

  // 更新二手物品状态
  updateProductStatus(id, status) {
    return request({
      url: `/product/${id}/status`,
      method: 'put',
      params: { status }
    })
  },

  // 管理员审核二手物品
  reviewProduct(id, status) {
    return request({
      url: `/product/${id}/review`,
      method: 'put',
      params: { status }
    })
  },

  // 管理员获取所有二手物品列表
  adminListProducts(params) {
    return request({
      url: '/product/admin/list',
      method: 'get',
      params
    })
  }
}