u/**
 * 样式指南工具函数
 * 用于确保项目中使用一致的样式和间距
 */

/**
 * 获取标准间距值
 * @param {string} size - 间距大小 (xs, sm, base, lg, xl, xxl)
 * @returns {string} CSS变量值
 */
export const getSpacing = (size = 'base') => {
  const sizes = {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    base: 'var(--spacing-base)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    xxl: 'var(--spacing-xxl)'
  }
  
  return sizes[size] || sizes.base
}

/**
 * 获取标准字体大小
 * @param {string} size - 字体大小 (xs, sm, base, lg, xl, xxl)
 * @returns {string} CSS变量值
 */
export const getFontSize = (size = 'base') => {
  const sizes = {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    xxl: 'var(--font-size-xxl)'
  }
  
  return sizes[size] || sizes.base
}

/**
 * 获取标准颜色
 * @param {string} name - 颜色名称 (primary, success, warning, danger, info)
 * @param {string} shade - 颜色深浅 (light, dark, base)
 * @returns {string} CSS变量值
 */
export const getColor = (name = 'primary', shade = 'base') => {
  const colors = {
    primary: {
      light: 'var(--primary-light)',
      base: 'var(--primary-color)',
      dark: 'var(--primary-dark)'
    },
    success: 'var(--success-color)',
    warning: 'var(--warning-color)',
    danger: 'var(--danger-color)',
    info: 'var(--info-color)',
    text: {
      primary: 'var(--text-primary)',
      regular: 'var(--text-regular)',
      secondary: 'var(--text-secondary)',
      placeholder: 'var(--text-placeholder)'
    },
    bg: {
      white: 'var(--bg-white)',
      light: 'var(--bg-light)',
      lighter: 'var(--bg-lighter)',
      dark: 'var(--bg-dark)'
    },
    border: {
      light: 'var(--border-light)',
      lighter: 'var(--border-lighter)',
      dark: 'var(--border-dark)'
    }
  }
  
  if (colors[name]) {
    if (typeof colors[name] === 'object' && colors[name][shade]) {
      return colors[name][shade]
    }
    if (typeof colors[name] === 'string') {
      return colors[name]
    }
  }
  
  return colors.primary.base
}

/**
 * 获取标准圆角值
 * @param {string} size - 圆角大小 (small, base, round)
 * @returns {string} CSS变量值
 */
export const getBorderRadius = (size = 'base') => {
  const sizes = {
    small: 'var(--border-radius-small)',
    base: 'var(--border-radius-base)',
    round: 'var(--border-radius-round)'
  }
  
  return sizes[size] || sizes.base
}

/**
 * 获取标准阴影值
 * @param {string} type - 阴影类型 (light, base, hover)
 * @returns {string} CSS变量值
 */
export const getShadow = (type = 'base') => {
  const types = {
    light: 'var(--shadow-light)',
    base: 'var(--shadow-base)',
    hover: 'var(--shadow-hover)'
  }
  
  return types[type] || types.base
}

/**
 * 获取标准过渡时间
 * @param {string} speed - 过渡速度 (fast, base, slow)
 * @returns {string} CSS变量值
 */
export const getTransition = (speed = 'base') => {
  const speeds = {
    fast: 'var(--transition-fast)',
    base: 'var(--transition-base)',
    slow: 'var(--transition-slow)'
  }
  
  return speeds[speed] || speeds.base
}

/**
 * 生成响应式断点媒体查询
 * @param {string} breakpoint - 断点名称 (xs, sm, md, lg, xl)
 * @returns {string} 媒体查询字符串
 */
export const getMediaQuery = (breakpoint) => {
  const breakpoints = {
    xs: '(max-width: 480px)',
    sm: '(max-width: 768px)',
    md: '(max-width: 992px)',
    lg: '(max-width: 1200px)',
    xl: '(min-width: 1200px)'
  }
  
  return breakpoints[breakpoint] || breakpoints.md
}

/**
 * 生成标准容器样式
 * @param {Object} options - 配置选项
 * @returns {Object} 样式对象
 */
export const getContainerStyles = (options = {}) => {
  const {
    maxWidth = '1200px',
    padding = 'xl',
    margin = '0 auto',
    borderRadius = 'base',
    backgroundColor = 'white',
    shadow = 'light'
  } = options
  
  return {
    maxWidth: maxWidth === 'none' ? 'none' : maxWidth,
    padding: getSpacing(padding),
    margin,
    borderRadius: getBorderRadius(borderRadius),
    backgroundColor: getColor('bg', backgroundColor),
    boxShadow: getShadow(shadow)
  }
}

/**
 * 生成标准卡片样式
 * @param {Object} options - 配置选项
 * @returns {Object} 样式对象
 */
export const getCardStyles = (options = {}) => {
  const {
    padding = 'base',
    borderRadius = 'base',
    backgroundColor = 'white',
    shadow = 'light',
    hoverEffect = true
  } = options
  
  const styles = {
    padding: getSpacing(padding),
    borderRadius: getBorderRadius(borderRadius),
    backgroundColor: getColor('bg', backgroundColor),
    boxShadow: getShadow(shadow),
    transition: `all ${getTransition('base')}`
  }
  
  if (hoverEffect) {
    styles.cursor = 'pointer'
  }
  
  return styles
}

/**
 * 生成标准按钮样式
 * @param {Object} options - 配置选项
 * @returns {Object} 样式对象
 */
export const getButtonStyles = (options = {}) => {
  const {
    type = 'primary',
    size = 'base',
    shape = 'round',
    block = false
  } = options
  
  const styles = {
    padding: `${getSpacing('sm')} ${getSpacing('lg')}`,
    borderRadius: getBorderRadius(shape),
    fontSize: getFontSize(size),
    fontWeight: '500',
    transition: `all ${getTransition('base')}`,
    cursor: 'pointer',
    border: '1px solid transparent',
    outline: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    display: block ? 'block' : 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: block ? '100%' : 'auto'
  }
  
  if (type === 'primary') {
    styles.backgroundColor = getColor('primary')
    styles.color = getColor('bg', 'white')
    styles.borderColor = getColor('primary')
  } else if (type === 'outline') {
    styles.backgroundColor = 'transparent'
    styles.color = getColor('primary')
    styles.borderColor = getColor('primary')
  }
  
  return styles
}