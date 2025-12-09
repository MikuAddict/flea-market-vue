import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { processIdsInArray } from '@/utils/numberPrecision'

/**
 * 通用的数据获取组合函数
 * @param {Object} options 配置选项
 * @returns {Object} 响应式数据和方法
 */
export function useDataFetch(options = {}) {
  const {
    apiFunction,           // API获取函数
    defaultFilters = {},    // 默认筛选条件
    defaultPagination = {   // 默认分页参数
      current: 1,
      size: 10
    },
    processResult = null,   // 结果处理函数
    errorMessage = '获取数据失败' // 错误消息
  } = options

  // 响应式数据
  const loading = ref(false)
  const data = ref([])
  const total = ref(0)
  const filters = reactive({ ...defaultFilters })
  const pagination = reactive({ ...defaultPagination })

  // 获取数据
  const fetchData = async (resetPage = false) => {
    loading.value = true
    try {
      if (resetPage) {
        pagination.current = 1
      }

      // 合并筛选条件和分页参数
      const params = {
        ...filters,
        current: pagination.current,
        size: pagination.size
      }

      const response = await apiFunction(params)
      
      // 处理响应数据
      if (response.data && response.data.code === 200) {
        const resultData = response.data.data
        
        if (Array.isArray(resultData)) {
          // 直接是数组
          data.value = processResult ? processResult(resultData) : resultData
          total.value = resultData.length
        } else if (resultData && Array.isArray(resultData.records)) {
          // 分页数据结构
          data.value = processResult ? processResult(resultData.records) : resultData.records
          total.value = resultData.total || 0
        } else {
          data.value = []
          total.value = 0
        }
      } else {
        ElMessage.error(response.data?.message || errorMessage)
      }
    } catch (error) {
      console.error(errorMessage, error)
      ElMessage.error(errorMessage)
      data.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  // 重置筛选条件
  const resetFilters = () => {
    Object.keys(filters).forEach(key => {
      if (Array.isArray(defaultFilters[key])) {
        filters[key] = [...defaultFilters[key]]
      } else if (typeof defaultFilters[key] === 'object' && defaultFilters[key] !== null) {
        filters[key] = { ...defaultFilters[key] }
      } else {
        filters[key] = defaultFilters[key]
      }
    })
    fetchData(true)
  }

  // 处理分页变化
  const handleCurrentChange = (current) => {
    pagination.current = current
    fetchData()
  }

  const handleSizeChange = (size) => {
    pagination.size = size
    pagination.current = 1
    fetchData()
  }

  // 返回响应式数据和方法
  return {
    loading,
    data,
    total,
    filters,
    pagination,
    fetchData,
    resetFilters,
    handleCurrentChange,
    handleSizeChange
  }
}

/**
 * 专门用于处理带ID精度的数据获取
 * @param {Object} options 配置选项
 * @returns {Object} 响应式数据和方法
 */
export function useDataFetchWithIdPrecision(options = {}) {
  const { 
    idFields = ['id'], 
    ...otherOptions 
  } = options

  return useDataFetch({
    ...otherOptions,
    processResult: (resultData) => processIdsInArray(resultData, idFields)
  })
}

/**
 * 专门用于获取单个数据项
 * @param {Object} options 配置选项
 * @returns {Object} 响应式数据和方法
 */
export function useSingleDataFetch(options = {}) {
  const {
    apiFunction,          // API获取函数
    errorMessage = '获取数据失败' // 错误消息
  } = options

  // 响应式数据
  const loading = ref(false)
  const data = ref(null)

  // 获取数据
  const fetchData = async (id) => {
    loading.value = true
    try {
      const response = await apiFunction(id)
      
      if (response.data && response.data.code === 200) {
        data.value = response.data.data
      } else {
        ElMessage.error(response.data?.message || errorMessage)
      }
    } catch (error) {
      console.error(errorMessage, error)
      ElMessage.error(errorMessage)
      data.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    data,
    fetchData
  }
}