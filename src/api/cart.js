import { request } from './api-client'

export default {
  // 获取用户购物车列表
  getUserCart() {
    return request({
      url: '/cart',
      method: 'get'
    })
  },

  // 添加商品到购物车
  addToCart(productId) {
    return request({
      url: '/cart',
      method: 'post',
      params: { productId }
    })
  },

  // 从购物车移除商品
  removeFromCart(cartId) {
    return request({
      url: `/cart/${cartId}`,
      method: 'delete'
    })
  },

  // 清空购物车
  clearCart() {
    return request({
      url: '/cart',
      method: 'delete'
    })
  },

  // 校验购物车商品状态
  validateCartItems() {
    return request({
      url: '/cart/validate',
      method: 'get'
    })
  },

  // 检查商品是否在购物车中
  checkProductInCart(productId) {
    return request({
      url: `/cart/check/${productId}`,
      method: 'get'
    })
  }
}