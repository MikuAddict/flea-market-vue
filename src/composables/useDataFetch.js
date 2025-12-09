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

      console.log('[useDataFetch] 开始获取数据，参数:', params);
      console.log('[useDataFetch] API函数:', apiFunction);
      console.log('[useDataFetch] API函数类型:', typeof apiFunction);

      // 确保正确调用API函数
      const response = await apiFunction(params)
      
      console.log('[useDataFetch] API响应:', response);
      console.log('[useDataFetch] API响应类型:', typeof response);
      
      // 处理响应数据
      if (response && response.data && response.data.code === 200) {
        const resultData = response.data.data
        
        console.log('[useDataFetch] 响应数据:', resultData);
        
        if (Array.isArray(resultData)) {
          // 直接是数组
          data.value = processResult ? processResult(resultData) : resultData
          total.value = resultData.length
          console.log('[useDataFetch] 处理为数组数据，长度:', resultData.length);
        } else if (resultData && Array.isArray(resultData.records)) {
          // 分页数据结构
          data.value = processResult ? processResult(resultData.records, resultData) : resultData.records
          total.value = resultData.total || 0
          console.log('[useDataFetch] 处理为分页数据，记录数:', resultData.records.length, '总数:', resultData.total);
        } else {
          data.value = []
          total.value = 0
          console.log('[useDataFetch] 数据格式不符合预期，设置为空数组');
        }
      } else {
        console.error('[useDataFetch] API返回错误状态:', response && response.data);
        ElMessage.error(response && response.data && response.data.message || errorMessage)
      }
    } catch (error) {
      console.error('[useDataFetch] 获取数据异常:', errorMessage, error)
      console.error('[useDataFetch] 错误详情:', error.response || error.message || error);
      ElMessage.error(errorMessage)
      data.value = []
      total.value = 0
    } finally {
      loading.value = false
      console.log('[useDataFetch] 数据获取完成');
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
    processResult: (resultData, paginationData) => {
      // 如果结果是分页数据结构，处理records数组
      if (paginationData && Array.isArray(paginationData.records)) {
        console.log('[useDataFetchWithIdPrecision] 处理分页数据中的records数组');
        return processIdsInArray(paginationData.records, idFields)
      }
      // 否则直接处理整个数组
      console.log('[useDataFetchWithIdPrecision] 处理普通数组');
      return processIdsInArray(resultData, idFields)
    }
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
      
      if (response && response.data && response.data.code === 200) {
        data.value = response.data.data
      } else {
        ElMessage.error(response && response.data && response.data.message || errorMessage)
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