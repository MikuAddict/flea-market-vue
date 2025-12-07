import dayjs from 'dayjs'

/**
 * 格式化日期
 * @param {string|Date} date 日期
 * @param {string} format 格式化字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 格式化价格
 * @param {number} price 价格
 * @param {number} decimals 小数位数
 * @returns {string} 格式化后的价格
 */
export function formatPrice(price, decimals = 2) {
  if (price === null || price === undefined) return '0.00'
  return Number(price).toFixed(decimals)
}

/**
 * 格式化支付方式
 * @param {number} paymentMethod 支付方式 (0-现金支付, 1-微信支付, 2-积分兑换, 3-二手物品交换)
 * @returns {string} 支付方式名称
 */
export function formatPaymentMethod(paymentMethod) {
  const methods = {
    0: '现金支付',
    1: '微信支付',
    2: '积分兑换',
    3: '二手物品交换'
  }
  return methods[paymentMethod] || '未知'
}

/**
 * 格式化订单状态
 * @param {number} status 订单状态 (0-待支付, 1-已支付, 2-已完成, 3-已取消)
 * @returns {string} 订单状态名称
 */
export function formatOrderStatus(status) {
  const statuses = {
    0: '待支付',
    1: '已支付',
    2: '已完成',
    3: '已取消'
  }
  return statuses[status] || '未知'
}

/**
 * 格式化商品状态
 * @param {number} status 商品状态 (0-下架, 1-上架, 2-已售出)
 * @returns {string} 商品状态名称
 */
export function formatProductStatus(status) {
  const statuses = {
    0: '下架',
    1: '上架',
    2: '已售出'
  }
  return statuses[status] || '未知'
}

/**
 * 格式化用户角色
 * @param {string} role 用户角色
 * @returns {string} 用户角色名称
 */
export function formatUserRole(role) {
  const roles = {
    'user': '普通用户',
    'admin': '管理员'
  }
  return roles[role] || '未知'
}

/**
 * 格式化用户状态
 * @param {number} status 用户状态 (0-未审核, 1-已审核, 2-已拒绝)
 * @returns {string} 用户状态名称
 */
export function formatUserStatus(status) {
  const statuses = {
    0: '未审核',
    1: '已审核',
    2: '已拒绝'
  }
  return statuses[status] || '未知'
}

/**
 * 获取订单状态对应的标签类型
 * @param {number} status 订单状态
 * @returns {string} Element Plus 标签类型
 */
export function getOrderStatusType(status) {
  const types = {
    0: 'warning',
    1: 'primary',
    2: 'success',
    3: 'danger'
  }
  return types[status] || 'info'
}

/**
 * 获取商品状态对应的标签类型
 * @param {number} status 商品状态
 * @returns {string} Element Plus 标签类型
 */
export function getProductStatusType(status) {
  const types = {
    0: 'info',
    1: 'success',
    2: 'danger'
  }
  return types[status] || 'info'
}

/**
 * 获取用户状态对应的标签类型
 * @param {number} status 用户状态
 * @returns {string} Element Plus 标签类型
 */
export function getUserStatusType(status) {
  const types = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return types[status] || 'info'
}