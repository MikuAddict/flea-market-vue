/**
 * 大整数处理工具
 * 用于处理JavaScript中超出安全整数范围的大整数
 */

/**
 * 将大整数转换为字符串，避免JavaScript整数精度丢失
 * @param {string|number|bigint} value - 需要处理的值
 * @returns {string|number} - 处理后的值，大整数转换为字符串，其他返回原值
 */
export const handleBigInt = (value) => {
  if (typeof value === 'undefined' || value === null) {
    return value
  }
  
  // 如果已经是字符串，直接返回
  if (typeof value === 'string') {
    return value
  }
  
  // 如果是数字且超过安全整数范围，转换为字符串
  if (typeof value === 'number' && value > Number.MAX_SAFE_INTEGER) {
    return value.toString()
  }
  
  // 处理BigInt对象
  try {
    if (typeof value === 'bigint' || (typeof value === 'string' && /^[0-9]{15,}$/.test(value))) {
      const bigIntValue = typeof value === 'bigint' ? value : BigInt(value)
      // 如果大于最大安全整数，转换为字符串
      if (bigIntValue > BigInt(Number.MAX_SAFE_INTEGER)) {
        return bigIntValue.toString()
      }
    }
  } catch (e) {
    // 无法转换为BigInt，保持原样
  }
  
  return value
}

/**
 * 处理对象中所有的大整数字段
 * @param {Object} obj - 需要处理的对象
 * @param {Array<string>} [idFields=['id', 'userId', 'productId', 'categoryId', 'orderId', 'buyerId', 'sellerId']] - 需要处理的ID字段名
 * @returns {Object} - 处理后的对象
 */
export const handleObjectBigInts = (obj, idFields = ['id', 'userId', 'productId', 'categoryId', 'orderId', 'buyerId', 'sellerId']) => {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  
  const result = Array.isArray(obj) ? [...obj] : { ...obj }
  
  // 遍历对象的所有属性
  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      // 如果是ID字段，处理大整数
      if (idFields.some(idField => key.includes(idField))) {
        result[key] = handleBigInt(result[key])
      } 
      // 如果是嵌套对象，递归处理
      else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = handleObjectBigInts(result[key], idFields)
      }
    }
  }
  
  return result
}

/**
 * JSON解析器，处理大整数
 * @param {string} data - JSON字符串
 * @returns {any} - 解析后的对象
 */
export const bigIntJsonParser = (data) => {
  if (typeof data !== 'string') {
    return data
  }
  
  // 正则表达式匹配JSON中的大数字值，包括id和可能的大数字
  const bigIntRegex = /"([^"]+)":\s*([0-9]{15,})([,}\s])/g
  const processedData = data.replace(bigIntRegex, (match, key, numberStr, suffix) => {
    // 处理所有可能的大数字字段，不限于id字段
    try {
      const num = BigInt(numberStr)
      // 如果数字大于最大安全整数，转换为字符串
      if (num > BigInt(Number.MAX_SAFE_INTEGER)) {
        return `"${key}":"${numberStr}"${suffix}`
      }
    } catch (e) {
      // 无法转换为BigInt，保持原样
    }
    return match
  })
  
  // 特别处理可能包含大数字的数组
  const arrayRegex = /"([^"]+)":\s*\[([^\]]*)\]/g
  const finalData = processedData.replace(arrayRegex, (match, key, arrayContent) => {
    if (arrayContent && arrayContent.includes('"id":')) {
      // 处理数组中的对象ID字段
      const processedArrayContent = arrayContent.replace(
        /"id":\s*([0-9]{15,})([,}\s])/g, 
        '"id":"$1"$2'
      )
      return `"${key}": [${processedArrayContent}]`
    }
    return match
  })
  
  return JSON.parse(finalData)
}

/**
 * Vue响应式数据处理器，处理大整数
 * @param {any} data - 需要处理的数据
 * @returns {any} - 处理后的数据
 */
export const handleReactiveBigInt = (data) => {
  if (!data) return data
  
  // 如果是数组，处理每个元素
  if (Array.isArray(data)) {
    return data.map(item => handleObjectBigInts(item))
  }
  
  // 如果是对象，处理对象
  return handleObjectBigInts(data)
}

/**
 * 比较两个可能的大整数ID
 * @param {string|number} id1 - 第一个ID
 * @param {string|number} id2 - 第二个ID
 * @returns {boolean} - 是否相等
 */
export const compareBigIntIds = (id1, id2) => {
  // 转换为字符串进行比较
  const strId1 = id1 !== null && id1 !== undefined ? String(id1) : ''
  const strId2 = id2 !== null && id2 !== undefined ? String(id2) : ''
  
  return strId1 === strId2
}