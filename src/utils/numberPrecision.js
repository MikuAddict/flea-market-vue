/**
 * 大数字精度处理工具函数
 * 用于处理JavaScript中超过Number.MAX_SAFE_INTEGER的数字精度问题
 */

/**
 * 将字符串形式的数字转换为字符串，保持精度
 * @param {string|number} value - 需要处理的数字值
 * @returns {string} 精确的数字字符串
 */
export const safeIdToString = (value) => {
  if (value === null || value === undefined) {
    return ''
  }
  
  if (typeof value === 'string') {
    return value
  }
  
  // 如果是数字，转换为字符串以保持精度
  return String(value)
}

/**
 * 将ID值转换为字符串形式用于API请求
 * @param {string|number} id - ID值
 * @returns {string} 字符串形式的ID
 */
export const formatIdForApi = (id) => {
  return safeIdToString(id)
}

/**
 * 处理对象中的ID字段，确保精度不丢失
 * @param {Object} obj - 包含ID字段的对象
 * @param {Array<string>} idFields - ID字段名数组，默认为['id']
 * @returns {Object} 处理后的对象
 */
export const processIdsInObject = (obj, idFields = ['id']) => {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  
  const result = { ...obj }
  
  idFields.forEach(field => {
    if (result[field] !== undefined) {
      result[field] = safeIdToString(result[field])
    }
  })
  
  return result
}

/**
 * 处理数组中所有对象的ID字段，确保精度不丢失
 * @param {Array} arr - 包含对象的数组
 * @param {Array<string>} idFields - ID字段名数组，默认为['id']
 * @returns {Array} 处理后的数组
 */
export const processIdsInArray = (arr, idFields = ['id']) => {
  if (!Array.isArray(arr)) {
    return arr
  }
  
  return arr.map(item => processIdsInObject(item, idFields))
}