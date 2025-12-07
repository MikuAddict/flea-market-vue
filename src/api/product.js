import request from './index'

export default {
  // 添加商品
  addProduct(data) {
    return request({
      url: '/product/add',
      method: 'post',
      data
    })
  },

  // 更新商品信息
  updateProduct(data) {
    return request({
      url: '/product/update',
      method: 'put',
      data
    })
  },

  // 删除商品
  deleteProduct(id) {
    return request({
      url: '/product/delete',
      method: 'post',
      data: { id }
    })
  },

  // 获取商品详情
  getProductById(id) {
    return request({
      url: `/product/get/${id}`,
      method: 'get'
    })
  },

  // 分页获取商品列表
  getProductList(params) {
    return request({
      url: '/product/list/page',
      method: 'get',
      params
    })
  },

  // 根据分类获取商品列表
  getProductListByCategory(categoryId, params) {
    return request({
      url: `/product/list/category/${categoryId}`,
      method: 'get',
      params
    })
  },

  // 搜索商品
  searchProducts(params) {
    return request({
      url: '/product/search',
      method: 'get',
      params
    })
  },

  // 高级搜索商品
  advancedSearchProducts(params) {
    return request({
      url: '/product/advanced-search',
      method: 'get',
      params
    })
  },

  // 获取用户发布的商品列表
  getProductListByUser(userId, params) {
    return request({
      url: `/product/list/user/${userId}`,
      method: 'get',
      params
    })
  },

  // 获取当前用户发布的商品列表
  getMyProductList(params) {
    return request({
      url: '/product/list/my',
      method: 'get',
      params
    })
  },

  // 更新商品状态
  updateProductStatus(id, status) {
    return request({
      url: `/product/status/${id}`,
      method: 'put',
      data: { status }
    })
  },

  // 获取最新商品列表
  getLatestProducts(params) {
    return request({
      url: '/product/latest',
      method: 'get',
      params
    })
  },

  // 管理员审核商品
  reviewProduct(id, status) {
    return request({
      url: `/product/review/${id}`,
      method: 'put',
      data: { status }
    })
  },

  // 管理员获取所有商品列表
  adminGetProductList(params) {
    return request({
      url: '/product/admin/list',
      method: 'get',
      params
    })
  }
}