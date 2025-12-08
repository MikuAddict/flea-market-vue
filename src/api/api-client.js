import axios from 'axios'
import store from '../store/store'
import { ElMessage } from 'element-plus'

// 自定义JSON解析器，处理大整数
const bigIntJsonParser = (data) => {
  if (typeof data !== 'string') {
    return data
  }
  
  // 正则表达式匹配JSON中的大数字值
  const bigIntRegex = /"([^"]+)":\s*([0-9]{15,})([,}\s])/g
  const processedData = data.replace(bigIntRegex, (match, key, numberStr, suffix) => {
    // 如果数字大于最大安全整数，转换为字符串
    try {
      const num = BigInt(numberStr)
      if (num > BigInt(Number.MAX_SAFE_INTEGER)) {
        return `"${key}":"${numberStr}"${suffix}`
      }
    } catch (e) {
      // 无法转换为BigInt，保持原样
    }
    return match
  })
  
  return JSON.parse(processedData)
}

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  transformResponse: [
    function (data) {
      try {
        // 先使用自定义解析器处理大整数
        const parsedData = bigIntJsonParser(data)
        return parsedData
      } catch (error) {
        // 如果解析失败，尝试使用默认JSON解析
        try {
          return JSON.parse(data)
        } catch (e) {
          return data
        }
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 显示加载状态
    store.commit('SET_LOADING', true)
    
    // 添加token到请求头
    const token = store.state.token
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers.Authorization = `Bearer ${token}`
    } else {
      // 检查localStorage中是否有token
      const localToken = localStorage.getItem('token');
      if (localToken) {
        if (!config.headers) {
          config.headers = {}
        }
        config.headers.Authorization = `Bearer ${localToken}`
        // 同步token到store
        store.commit('SET_TOKEN', localToken)
      }
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
    
    let res = response.data
    
    // 检查是否有code字段，如果有且不为200，则处理为错误
    if (res && typeof res.code !== 'undefined' && res.code !== 200) {
      // 特殊处理未授权状态 (根据状态码规范文档)
      if (res.code === 40100) {
        store.commit('CLEAR_USER')
        // 只有在非登录页面才跳转
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
          ElMessage.error('请先登录')
        }
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
          // 检查是否真的没有token
          const currentToken = store.state.token || localStorage.getItem('token');
          if (!currentToken) {
            ElMessage.error('未授权，请重新登录')
            store.commit('CLEAR_USER')
            window.location.href = '/login'
          } else {
            // 如果有token但仍然收到401，可能是token过期或其他问题
            ElMessage.error(data?.message || '登录已过期，请重新登录')
            store.commit('CLEAR_USER')
            window.location.href = '/login'
          }
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
import imageApi from './image'
import adminApi from './admin'
import cartApi from './cart'
import tradeApi from './trade'

// 导出所有API模块
export {
  userApi,
  productApi,
  categoryApi,
  orderApi,
  newsApi,
  reviewApi,
  statisticsApi,
  imageApi,
  adminApi,
  cartApi,
  tradeApi
}

export default {
  userApi,
  productApi,
  categoryApi,
  orderApi,
  newsApi,
  reviewApi,
  statisticsApi,
  imageApi,
  adminApi,
  cartApi,
  tradeApi
}