<template>
  <div class="tab-content">
    <div class="content-header unified-flex unified-flex-between">
      <h3 class="unified-title-base">{{ title }}</h3>
      <slot name="header-actions"></slot>
    </div>
    
    <div v-if="products.length === 0" class="empty-content unified-flex unified-flex-col unified-flex-center">
      <el-icon size="60" color="var(--text-placeholder)"><Box /></el-icon>
      <p class="empty-text">{{ emptyText }}</p>
      <slot name="empty-actions"></slot>
    </div>
    
    <div v-else class="products-grid unified-grid unified-grid-3">
      <div 
        class="product-item fade-in"
        v-for="(product, index) in products" 
        :key="product.id"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <ProductCard :product="product" :show-user="showUserInProductCard" />
      </div>
    </div>
    
    <div class="view-more-container unified-flex unified-flex-center" v-if="products.length > 0 && showViewMore">
      <slot name="view-more">
        <el-button 
          type="primary" 
          class="unified-button unified-button-outline"
          @click="viewMore"
        >
          查看全部
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script>
import { Box } from '@element-plus/icons-vue'
import ProductCard from '@/components/ProductCard.vue'

export default {
  name: 'UserProductsTab',
  components: {
    ProductCard,
    Box
  },
  props: {
    products: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '我的二手物品'
    },
    emptyText: {
      type: String,
      default: '暂无发布的二手物品'
    },
    showUserInProductCard: {
      type: Boolean,
      default: false
    },
    showViewMore: {
      type: Boolean,
      default: true
    }
  },
  emits: ['view-more'],
  setup(props, { emit }) {
    const viewMore = () => {
      emit('view-more')
    }
    
    return {
      viewMore
    }
  }
}
</script>

<style scoped>
.content-header {
  margin-bottom: var(--spacing-lg);
}

/* 空状态样式 */
.empty-content {
  padding: var(--spacing-xxl) 0;
}

.empty-text {
  margin: var(--spacing-base) 0;
  color: var(--text-secondary);
}

/* 商品网格样式 */
.products-grid {
  margin-bottom: var(--spacing-lg);
}

.product-item {
  margin-bottom: var(--spacing-base);
}

/* 查看更多按钮容器 */
.view-more-container {
  margin-top: var(--spacing-lg);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>