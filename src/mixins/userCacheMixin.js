import { refreshUserInfo } from '@/utils/userCache'

/**
 * 用户信息缓存混入
 * 提供用户信息缓存相关的通用方法和逻辑
 */
export default {
  methods: {
    /**
     * 刷新当前用户信息
     * @param {boolean} force - 是否强制从服务器获取
     */
    async refreshUser(force = false) {
      try {
        const result = await refreshUserInfo(force)
        return result
      } catch (error) {
        console.error('刷新用户信息失败:', error)
        throw error
      }
    },

    /**
     * 在执行可能影响用户信息的操作后，刷新用户信息
     * 例如：发布商品、更新个人信息等
     */
    async refreshAfterUserAction() {
      try {
        await this.refreshUser(true)
      } catch (error) {
        console.error('用户操作后刷新用户信息失败:', error)
      }
    }
  },

  /**
   * 在组件挂载时检查用户信息缓存
   */
  async mounted() {
    // 如果组件需要用户信息，可以在这里检查和刷新
    if (this.requiresAuth && this.$store.getters.isLoggedIn) {
      try {
        await this.refreshUser()
      } catch (error) {
        console.error('挂载时刷新用户信息失败:', error)
      }
    }
  }
}