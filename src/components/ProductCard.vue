<template>
  <el-card class="unified-card product-card" @click="goToDetail">
    <div class="product-image-container">
      <div class="product-image">
        <img v-if="getProductImage(product)" :src="getProductImage(product)" :alt="product.productName" />
        <div v-else class="image-placeholder">
          <el-icon><Picture /></el-icon>
        </div>
      </div>
      <div class="product-overlay">
        <el-button type="primary" class="view-detail-btn" size="small">查看详情</el-button>
      </div>
    </div>
    
    <div class="product-content">
      <div class="product-header">
        <h3 class="product-name">{{ product.productName }}</h3>
        <div class="product-price">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ formatPrice(product.price) }}</span>
        </div>
      </div>
      
      <div class="product-meta unified-flex unified-flex-wrap">
        <div class="unified-tag unified-tag-success">
          {{ formatPaymentMethod(product.paymentMethod) }}
        </div>
        <div v-if="product.category" class="unified-tag unified-tag-warning">
          {{ product.category.name }}
        </div>
        <div v-if="product.status !== undefined" class="unified-tag" :class="getProductStatusType(product.status)">
          {{ formatProductStatus(product.status) }}
        </div>
      </div>
      
      <div class="product-footer" v-if="showUser && product.user">
        <div class="unified-flex unified-flex-center">
          <el-avatar :size="24" :src="product.user.userAvatar">{{ product.user.userName?.charAt(0) }}</el-avatar>
          <span class="user-name">{{ product.user.userName }}</span>
        </div>
      </div>
      
      <!-- 操作按钮（仅在是我的商品页面显示） -->
      <div v-if="showActions" class="product-actions">
        <el-button 
          v-if="product.status === 0 || product.status === 1"
          size="small" 
          type="primary" 
          plain
          @click.stop="editProduct"
        >
          编辑
        </el-button>
        <el-button 
          v-if="product.status === 0 || product.status === 1"
          size="small" 
          type="danger" 
          plain
          :disabled="product.status === 2"
          @click.stop="deleteProduct"
        >
          删除
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Picture } from '@element-plus/icons-vue'
import { formatPrice, formatPaymentMethod, formatProductStatus, getProductStatusType } from '@/utils/format'

export default {
  name: 'ProductCard',
  components: {
    Picture
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    showUser: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete', 'status-change'],
  setup(props, { emit }) {
    const router = useRouter()
    
    const goToDetail = () => {
      router.push(`/products/${props.product.id}`)
    }
    
    // 获取产品图片，处理相对路径
    const getProductImage = (product) => {
      // 优先使用主图
      if (product.mainImageUrl) {
        // 处理相对路径，通过API代理访问
        if (product.mainImageUrl.startsWith('/')) {
          // 确保路径以/api开头，这样会被代理到后端服务
          return product.mainImageUrl.startsWith('/api') ? product.mainImageUrl : '/api' + product.mainImageUrl
        }
        return product.mainImageUrl
      }
      
      // 其次使用imageUrl
      if (product.imageUrl) {
        // 处理相对路径，通过API代理访问
        if (product.imageUrl.startsWith('/')) {
          // 确保路径以/api开头，这样会被代理到后端服务
          return product.imageUrl.startsWith('/api') ? product.imageUrl : '/api' + product.imageUrl
        }
        return product.imageUrl
      }
      
      return null
    }
    
    // 编辑商品
    const editProduct = () => {
      emit('edit', props.product)
    }
    
    // 删除商品
    const deleteProduct = () => {
      emit('delete', props.product)
    }
    
    // 切换商品状态
    const toggleStatus = (status) => {
      emit('status-change', { product: props.product, status })
    }
    
    return {
      goToDetail,
      formatPrice,
      formatPaymentMethod,
      formatProductStatus,
      getProductStatusType,
      getProductImage,
      editProduct,
      deleteProduct,
      toggleStatus
    }
  }
}
</script>

<style scoped>
/* 产品卡片整体样式 */
.product-card {
  margin-bottom: var(--spacing-base);
  border-radius: var(--border-radius-base);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

/* 产品图片容器 */
.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: var(--border-radius-base) var(--border-radius-base) 0 0;
}

.product-image {
  width: 100%;
  height: 100%;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--bg-light);
  color: var(--text-secondary);
  font-size: 40px;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.view-detail-btn {
  border-radius: var(--border-radius-round);
  font-weight: 500;
  transform: translateY(20px);
  transition: transform var(--transition-base);
}

.product-card:hover .view-detail-btn {
  transform: translateY(0);
}

/* 产品内容区域 */
.product-content {
  padding: var(--spacing-base);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-header {
  margin-bottom: var(--spacing-base);
}

.product-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  min-height: 44px;
}

.product-price {
  display: flex;
  align-items: baseline;
  margin: 0;
  color: var(--danger-color);
}

.price-symbol {
  font-size: var(--font-size-sm);
  margin-right: 2px;
}

.price-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.product-meta {
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-base);
}

.product-footer {
  margin-top: auto;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-light);
}

.user-name {
  margin-left: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

/* 操作按钮区域 */
.product-actions {
  margin-top: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.product-actions .el-button {
  flex: 1;
  min-width: 60px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-image-container {
    height: 180px;
  }
  
  .product-name {
    font-size: var(--font-size-sm);
    -webkit-line-clamp: 1;
  }
  
  .price-value {
    font-size: var(--font-size-lg);
  }
  
  .product-content {
    padding: var(--spacing-sm);
  }
}
</style>