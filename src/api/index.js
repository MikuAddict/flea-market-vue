import axios from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 显示加载状态
    store.commit('SET_LOADING', true)
    
    // 添加token到请求头
    const token = store.state.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    store.commit('SET_LOADING', false)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    store.commit('SET_LOADING', false)
    
    // API返回格式为 { code: 0, data: {...}, message: "ok" }
    const res = response.data
    
    // 如果不是成功状态，显示错误消息
    if (res.code !== 0) {
      ElMessage.error(res.message || '请求失败')
      
      // 特殊处理未授权状态
      if (res.code === 40100 || res.code === 40101) {
        store.commit('CLEAR_USER')
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return response
  },
  error => {
    store.commit('SET_LOADING', false)
    
    // 处理HTTP错误状态
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          store.commit('CLEAR_USER')
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查您的网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

// 导出所有API模块
export default {
  user: require('./user').default,
  product: require('./product').default,
  category: require('./category').default,
  order: require('./order').default,
  news: require('./news').default,
  review: require('./review').default,
  statistics: require('./statistics').default
}