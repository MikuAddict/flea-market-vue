import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatIdForApi } from '@/utils/numberPrecision'

/**
 * 通用的删除处理函数
 * @param {Function} deleteApi 删除API函数
 * @param {Object} options 配置选项
 * @returns {Function} 删除处理函数
 */
export function useDeleteHandler(deleteApi, options = {}) {
  const {
    successMessage = '删除成功',
    confirmMessage = '确定要删除吗？此操作不可恢复。',
    successCallback = null,
    errorMessage = '删除失败'
  } = options

  const handleDelete = async (id) => {
    try {
      await ElMessageBox.confirm(confirmMessage, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      // 确保ID精度
      const formattedId = formatIdForApi(id)
      await deleteApi(formattedId)
      
      ElMessage.success(successMessage)
      if (successCallback) successCallback()
    } catch (error) {
      if (error !== 'cancel') {
        console.error(errorMessage, error)
        ElMessage.error(errorMessage)
      }
    }
  }

  return { handleDelete }
}

/**
 * 通用的批量删除处理函数
 * @param {Function} deleteApi 删除API函数
 * @param {Object} options 配置选项
 * @returns {Function} 批量删除处理函数
 */
export function useBatchDeleteHandler(deleteApi, options = {}) {
  const {
    successMessage = '批量删除成功',
    confirmMessage = (count) => `确定要删除选中的 ${count} 项吗？此操作不可恢复。`,
    successCallback = null,
    errorMessage = '批量删除失败'
  } = options

  const handleBatchDelete = async (selectedItems, idKey = 'id') => {
    try {
      const count = selectedItems.length
      const message = typeof confirmMessage === 'function' ? confirmMessage(count) : confirmMessage
      
      await ElMessageBox.confirm(message, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      // 批量删除
      const promises = selectedItems.map(item => {
        // 确保ID精度
        const id = formatIdForApi(item[idKey])
        return deleteApi(id)
      })
      
      await Promise.all(promises)
      ElMessage.success(successMessage)
      if (successCallback) successCallback()
    } catch (error) {
      if (error !== 'cancel') {
        console.error(errorMessage, error)
        ElMessage.error(errorMessage)
      }
    }
  }

  return { handleBatchDelete }
}

/**
 * 通用的状态更新处理函数
 * @param {Function} updateApi 更新API函数
 * @param {Object} options 配置选项
 * @returns {Function} 状态更新处理函数
 */
export function useStatusUpdateHandler(updateApi, options = {}) {
  const {
    successMessage = '状态更新成功',
    errorMessage = '状态更新失败',
    successCallback = null
  } = options

  const handleStatusUpdate = async (id, status) => {
    try {
      // 确保ID精度
      const formattedId = formatIdForApi(id)
      await updateApi(formattedId, status)
      
      ElMessage.success(successMessage)
      if (successCallback) successCallback()
    } catch (error) {
      console.error(errorMessage, error)
      ElMessage.error(errorMessage)
    }
  }

  return { handleStatusUpdate }
}

/**
 * 通用的导航处理函数
 * @param {Object} options 配置选项
 * @returns {Object} 导航相关方法
 */
export function useNavigation(options = {}) {
  const router = useRouter()
  const {
    basePath = '/',
    confirmNavigation = false,
    confirmMessage = '确定要离开吗？未保存的更改将丢失。'
  } = options

  const navigateTo = (path, params = {}) => {
    if (confirmNavigation) {
      // 可以在这里添加离开确认逻辑
      // 通常使用beforeRouteLeave守卫处理
    }
    
    if (params && Object.keys(params).length > 0) {
      const query = new URLSearchParams(params).toString()
      router.push(`${path}?${query}`)
    } else {
      router.push(path)
    }
  }

  const navigateToDetail = (id) => {
    // 确保ID精度
    const formattedId = formatIdForApi(id)
    router.push(`${basePath}${formattedId}`)
  }

  const navigateBack = () => {
    router.go(-1)
  }

  return {
    navigateTo,
    navigateToDetail,
    navigateBack
  }
}

/**
 * 通用的表单处理函数
 * @param {Object} options 配置选项
 * @returns {Object} 表单相关方法
 */
export function useFormHandler(options = {}) {
  const {
    submitApi,
    initialData = {},
    successMessage = '操作成功',
    errorMessage = '操作失败',
    successCallback = null,
    errorCallback = null,
    resetAfterSubmit = false
  } = options

  const form = ref({ ...initialData })
  const submitting = ref(false)
  const formRef = ref(null)

  const handleSubmit = async () => {
    if (formRef.value) {
      try {
        await formRef.value.validate()
      } catch (error) {
        console.error('表单验证失败:', error)
        return false
      }
    }

    submitting.value = true
    try {
      const formData = { ...form.value }
      
      // 确保表单中的ID精度
      Object.keys(formData).forEach(key => {
        if (key.includes('Id') || key.includes('id')) {
          formData[key] = formatIdForApi(formData[key])
        }
      })
      
      const response = await submitApi(formData)
      
      if (response.data && response.data.code === 200) {
        ElMessage.success(successMessage)
        if (successCallback) successCallback(response.data.data)
        if (resetAfterSubmit) resetForm()
      } else {
        ElMessage.error(response.data?.message || errorMessage)
      }
    } catch (error) {
      console.error(errorMessage, error)
      ElMessage.error(error.response?.data?.message || errorMessage)
      if (errorCallback) errorCallback(error)
    } finally {
      submitting.value = false
    }
  }

  const resetForm = () => {
    form.value = { ...initialData }
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  return {
    form,
    formRef,
    submitting,
    handleSubmit,
    resetForm
  }
}