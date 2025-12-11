import store from '@/store/store'

/**
 * 刷新当前用户信息
 * @param {boolean} force - 是否强制从服务器获取
 * @returns {Promise} 返回获取用户信息的Promise
 */
export const refreshUserInfo = async (force = false) => {
  try {
    const result = await store.dispatch('getCurrentUser', { forceRefresh: force })
    return result
  } catch (error) {
    console.error('刷新用户信息失败:', error)
    throw error
  }
}

/**
 * 检查用户信息缓存是否有效
 * @returns {boolean} 缓存是否有效
 */
export const isUserCacheValid = () => {
  const state = store.state
  if (!state.user || !state.userCacheTime) {
    return false
  }
  
  // 检查缓存是否在30分钟内
  const now = new Date().getTime()
  const CACHE_EXPIRY_TIME = 30 * 60 * 1000 // 30分钟
  return (now - state.userCacheTime) < CACHE_EXPIRY_TIME
}

/**
 * 清除用户信息缓存
 */
export const clearUserCache = () => {
  store.commit('CLEAR_USER')
}

/**
 * 获取当前用户信息（如果可用）
 * @returns {Object|null} 用户信息或null
 */
export const getCurrentUser = () => {
  return store.state.user
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 用户是否已登录
 */
export const isLoggedIn = () => {
  return store.getters.isLoggedIn
}

/**
 * 检查用户是否为管理员
 * @returns {boolean} 用户是否为管理员
 */
export const isAdmin = () => {
  return store.getters.isAdmin
}