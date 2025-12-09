<template>
  <div class="tab-content">
    <div class="content-header">
      <h3 class="unified-title-base">{{ title }}</h3>
    </div>
    
    <div v-if="reviews.length === 0" class="empty-content unified-flex unified-flex-col unified-flex-center">
      <el-icon size="60" color="var(--text-placeholder)"><Star /></el-icon>
      <p class="empty-text">{{ emptyText }}</p>
    </div>
    
    <div v-else class="reviews-list">
      <div 
        class="review-item fade-in"
        v-for="(review, index) in reviews" 
        :key="review.id"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <el-card class="unified-card review-card">
          <div class="review-header unified-flex unified-flex-between">
            <div class="rating">
              <el-rate v-model="review.rating" disabled show-score />
            </div>
            <span class="review-time unified-text-secondary">{{ formatDate(review.createTime) }}</span>
          </div>
          
          <div class="review-content">
            <p class="review-text">{{ review.content }}</p>
          </div>
          
          <div class="review-product unified-flex unified-flex-center" v-if="showProductLink">
            <span class="unified-text-secondary">二手物品：</span>
            <el-link 
              type="primary" 
              @click="goToProduct(review.productId)"
              class="product-link"
            >
              {{ review.productName || '查看二手物品' }}
            </el-link>
          </div>
        </el-card>
      </div>
    </div>
    
    <div class="view-more-container unified-flex unified-flex-center" v-if="reviews.length > 0 && showViewMore">
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
import { Star } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/format'

export default {
  name: 'UserReviewsTab',
  components: {
    Star
  },
  props: {
    reviews: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '我的评价'
    },
    emptyText: {
      type: String,
      default: '暂无评价'
    },
    showProductLink: {
      type: Boolean,
      default: true
    },
    showViewMore: {
      type: Boolean,
      default: true
    }
  },
  emits: ['view-more', 'go-to-product'],
  setup(props, { emit }) {
    const viewMore = () => {
      emit('view-more')
    }
    
    const goToProduct = (productId) => {
      emit('go-to-product', productId)
    }
    
    return {
      formatDate,
      viewMore,
      goToProduct
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

/* 评论列表样式 */
.reviews-list {
  margin-bottom: var(--spacing-lg);
}

.review-item {
  margin-bottom: var(--spacing-base);
}

.review-card {
  border-left: 4px solid var(--primary-color);
}

.review-header {
  margin-bottom: var(--spacing-base);
}

.rating :deep(.el-rate__icon) {
  font-size: var(--font-size-md);
}

.review-content {
  margin-bottom: var(--spacing-base);
}

.review-text {
  margin: 0;
  line-height: 1.6;
  color: var(--text-primary);
}

.review-product {
  font-size: var(--font-size-sm);
}

.product-link {
  font-weight: 500;
}
</style>