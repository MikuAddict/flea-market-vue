import { createStore } from 'vuex'
import { userApi, categoryApi, productApi, newsApi } from '../api/api-client'
import { handleReactiveBigInt } from '../utils/bigIntHandler'

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
    latestNews: null,
    
    // 用户信息缓存时间戳
    userCacheTime: null
  },
  
  getters: {
    isLoggedIn: state => !!state.token && !!state.user,
    isAdmin: state => state.user && state.user.userRole === 'admin',
    user: state => state.user,
    categories: state => state.categories,
    latestProducts: state => state.latestProducts,
    latestNews: state => state.latestNews,
    isLoading: state => state.loading
  },
  
  mutations: {
    SET_USER(state, user) {
      // 使用大整数处理工具处理用户数据
      state.user = user ? handleReactiveBigInt(user) : null
      // 更新用户信息缓存时间戳
      state.userCacheTime = new Date().getTime()
      // 将用户信息持久化到localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify({
          data: state.user,
          timestamp: state.userCacheTime
        }))
      } else {
        localStorage.removeItem('user')
      }
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
      state.categories = handleReactiveBigInt(categories)
    },
    
    SET_LATEST_PRODUCTS(state, products) {
      state.latestProducts = handleReactiveBigInt(products)
    },
    
    SET_LATEST_NEWS(state, news) {
      state.latestNews = news
    },
    
    CLEAR_USER(state) {
      state.user = null
      state.token = null
      state.userCacheTime = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  
  actions: {
    // 登录
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      try {
        const response = await userApi.login(credentials)
        const res = response.data
        
        // 检查登录是否成功
        if (res && res.code === 200) {
          // 从响应中获取用户数据
          const userData = res.data
          if (userData) {
            // 确保token存在并且正确设置
            // 根据响应结构，token可能在多个位置
            const token = res.token || res.hashMap?.token || userData.token || res.data?.token || (res.data?.data?.token);
            if (token) {
              commit('SET_TOKEN', token)
              commit('SET_USER', userData)
              return { success: true, data: userData, message: res.message }
            } else {
              console.error('登录响应中未找到token:', res);
              return { 
                success: false, 
                message: '登录失败：Token缺失'
              }
            }
          } else {
            return { 
              success: false, 
              message: '登录失败：未获取到用户数据'
            }
          }
        } else {
          return { 
            success: false, 
            message: res?.message || '登录失败，请检查用户名和密码'
          }
        }
      } catch (error) {
        console.error('登录错误详情:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || error.message || '登录失败，请稍后再试'
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
    async getCurrentUser({ commit, state }, { forceRefresh = false } = {}) {
      // 如果没有token，直接返回
      if (!state.token) {
        // 检查localStorage中是否有token
        const localToken = localStorage.getItem('token');
        if (localToken) {
          commit('SET_TOKEN', localToken);
        } else {
          return { success: false, message: '未登录' };
        }
      }
      
      // 检查缓存中的用户信息
      if (!forceRefresh && state.user) {
        return { success: true, data: state.user };
      }
      
      // 尝试从localStorage恢复缓存的用户信息
      if (!forceRefresh && !state.user) {
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          try {
            const { data, timestamp } = JSON.parse(cachedUser);
            // 检查缓存是否有效（30分钟内）
            const now = new Date().getTime();
            const CACHE_EXPIRY_TIME = 30 * 60 * 1000; // 30分钟
            
            if (timestamp && (now - timestamp) < CACHE_EXPIRY_TIME) {
              commit('SET_USER', data);
              state.userCacheTime = timestamp;
              console.log('从缓存恢复用户信息');
              return { success: true, data };
            } else {
              // 缓存过期，清除
              localStorage.removeItem('user');
            }
          } catch (error) {
            console.error('解析缓存的用户信息失败:', error);
            localStorage.removeItem('user');
          }
        }
      }

      commit('SET_LOADING', true)
      try {
        const response = await userApi.getCurrentUser()
        const { data } = response.data
        commit('SET_USER', data)
        return { success: true, data }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果token无效，清除登录状态
        if (error.response && error.response.status === 401) {
          // 检查是否真的没有token
          const currentToken = this.state.token || localStorage.getItem('token');
          if (currentToken) {
            commit('CLEAR_USER')
          }
        }
        return { success: false, message: error.message }
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
        const response = await userApi.updateMyUser(userData)
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
    
    // 获取二手物品分类
    async fetchCategories({ commit, state }, { forceRefresh = false } = {}) {
      // 如果已有分类数据且不强制刷新，避免重复请求
      if (!forceRefresh && state.categories.length > 0) {
        console.log('[Store] 分类数据已存在，无需重复获取');
        return
      }
      
      try {
        console.log('[Store] 开始获取分类数据', forceRefresh ? '(强制刷新)' : '');
        const response = await categoryApi.getCategoryList()
        const { data } = response.data
        
        console.log('[Store] 分类数据获取成功:', data);
        
        // 处理大整数ID，确保精度不丢失
        const processedCategories = data.map(category => ({
          ...category,
          id: typeof category.id === 'number' && category.id > Number.MAX_SAFE_INTEGER 
               ? category.id.toString() 
               : category.id
        }))
        
        commit('SET_CATEGORIES', processedCategories)
      } catch (error) {
        console.error('[Store] 获取分类失败:', error)
      }
    },
    
    // 获取最新二手物品
    async fetchLatestProducts({ commit, state }, { forceRefresh = false } = {}) {
      // 如果已有最新商品数据且不强制刷新，避免重复请求
      if (!forceRefresh && state.latestProducts.length > 0) return
      
      try {
        console.log('[Store] 获取最新二手物品', forceRefresh ? '(强制刷新)' : '');
        const response = await productApi.getLatestProducts()
        const { data } = response.data
        commit('SET_LATEST_PRODUCTS', data)
      } catch (error) {
        console.error('获取最新二手物品失败:', error)
      }
    },
    
    // 获取最新新闻
    async fetchLatestNews({ commit, state }, { forceRefresh = false } = {}) {
      // 如果已有最新新闻数据且不强制刷新，避免重复请求
      if (!forceRefresh && state.latestNews) return
      
      try {
        console.log('[Store] 获取最新新闻', forceRefresh ? '(强制刷新)' : '');
        const response = await newsApi.getLatestNews()
        const { data } = response.data
        commit('SET_LATEST_NEWS', data)
      } catch (error) {
        console.error('获取最新新闻失败:', error)
      }
    }
  }
})