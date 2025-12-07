import { createStore } from 'vuex'
import { userApi, categoryApi, productApi, newsApi } from '@/api'

export default createStore({
  state: {
    // 用户状态
    user: null,
    token: localStorage.getItem('token') || null,
    
    // 全局状态
    loading: false,
    
    // 数据缓存
    categories: [],
    latestProducts: [],
    latestNews: null
  },
  
  getters: {
    isLoggedIn: state => !!state.token,
    isAdmin: state => state.user && state.user.userRole === 'admin',
    user: state => state.user,
    categories: state => state.categories,
    latestProducts: state => state.latestProducts,
    latestNews: state => state.latestNews,
    isLoading: state => state.loading
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    },
    
    SET_LATEST_PRODUCTS(state, products) {
      state.latestProducts = products
    },
    
    SET_LATEST_NEWS(state, news) {
      state.latestNews = news
    },
    
    CLEAR_USER(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    }
  },
  
  actions: {
    // 登录
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      try {
        const response = await userApi.login(credentials)
        const { data } = response.data
        
        commit('SET_TOKEN', 'dummy_token') // 实际项目中应使用服务器返回的token
        commit('SET_USER', data)
        
        return { success: true, data }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message
        }
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // 注册
    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      try {
        const response = await userApi.register(userData)
        const res = response.data
        
        // 检查是否有code字段，如果有且为200表示成功
        if (res && typeof res.code !== 'undefined') {
          if (res.code === 200) {
            return { success: true, data: res.data, message: res.message }
          } else {
            return { 
              success: false, 
              message: res.message || '注册失败，请稍后再试'
            }
          }
        }
        
        // 如果没有code字段，直接返回响应数据
        return { success: true, data: res }
      } catch (error) {
        console.error('注册错误详情:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || error.message || '注册失败，请稍后再试'
        }
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // 获取当前用户信息
    async getCurrentUser({ commit, state }) {
      if (!state.token) return
      
      commit('SET_LOADING', true)
      try {
        const response = await userApi.getCurrentUser()
        const { data } = response.data
        commit('SET_USER', data)
        return { success: true, data }
      } catch (error) {
        // 如果token无效，清除登录状态
        if (error.response && error.response.status === 401) {
          commit('CLEAR_USER')
        }
        return { success: false }
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // 登出
    async logout({ commit }) {
      try {
        await userApi.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        commit('CLEAR_USER')
      }
    },
    
    // 更新用户信息
    async updateProfile({ commit }, userData) {
      commit('SET_LOADING', true)
      try {
        const response = await userApi.updateProfile(userData)
        const { data } = response.data
        
        if (data) {
          // 更新本地用户信息
          const currentUser = JSON.parse(JSON.stringify(this.state.user))
          const updatedUser = { ...currentUser, ...userData }
          commit('SET_USER', updatedUser)
        }
        
        return { success: true, data }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || '更新个人信息失败'
        }
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // 获取商品分类
    async fetchCategories({ commit }) {
      if (this.state.categories.length > 0) return
      
      try {
        const response = await categoryApi.getCategories()
        const { data } = response.data
        commit('SET_CATEGORIES', data)
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    },
    
    // 获取最新商品
    async fetchLatestProducts({ commit }) {
      if (this.state.latestProducts.length > 0) return
      
      try {
        const response = await productApi.getLatestProducts()
        const { data } = response.data
        commit('SET_LATEST_PRODUCTS', data)
      } catch (error) {
        console.error('获取最新商品失败:', error)
      }
    },
    
    // 获取最新新闻
    async fetchLatestNews({ commit }) {
      if (this.state.latestNews) return
      
      try {
        const response = await newsApi.getLatestNews()
        const { data } = response.data
        commit('SET_LATEST_NEWS', data)
      } catch (error) {
        console.error('获取最新新闻失败:', error)
      }
    }
  }
})