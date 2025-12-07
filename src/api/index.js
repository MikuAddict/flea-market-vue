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
    
    const res = response.data
    
    // 检查是否有code字段，如果有且不为200，则处理为错误
    if (res && typeof res.code !== 'undefined' && res.code !== 200) {
      // 特殊处理未授权状态 (根据状态码规范文档)
      if (res.code === 40100) {
        store.commit('CLEAR_USER')
        window.location.href = '/login'
        ElMessage.error('请先登录')
      }
      // 对于其他业务错误，不在这里显示消息，由具体业务逻辑处理
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    // 如果没有code字段或者code为200，则返回正常响应
    // 注意：这里不显示成功消息，由具体业务逻辑处理
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

// 导出request实例
export { request }

// 导入各个API模块
import userApi from './user'
import productApi from './product'
import categoryApi from './category'
import orderApi from './order'
import newsApi from './news'
import reviewApi from './review'
import statisticsApi from './statistics'

// 导出所有API模块
export {
  userApi,
  productApi,
  categoryApi,
  orderApi,
  newsApi,
  reviewApi,
  statisticsApi
}

export default {
  userApi,
  productApi,
  categoryApi,
  orderApi,
  newsApi,
  reviewApi,
  statisticsApi
}