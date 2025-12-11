<template>
  <div class="tab-content">
    <div class="content-header">
      <h3 class="unified-title-base">{{ title }}</h3>
    </div>
    
    <div v-if="reviews.length === 0" class="unified-empty unified-flex unified-flex-col unified-flex-center">
      <el-icon size="60" color="var(--text-placeholder)"><Star /></el-icon>
      <p class="unified-empty-text">{{ emptyText }}</p>
    </div>
    
    <div v-else class="unified-reviews-list">
      <div 
        class="unified-review-item fade-in"
        v-for="(review, index) in reviews" 
        :key="review.id"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <el-card class="unified-card review-card">
          <!-- 买家信息 -->
          <div class="unified-review-header unified-flex unified-flex-center unified-flex-between">
            <div class="buyer-details unified-flex unified-flex-center" @click="goToUserProfile(review.userId)">
              <el-avatar 
                :size="40" 
                :src="review.userAvatar" 
                class="buyer-avatar clickable"
              >
                {{ review.userName?.charAt(0)}}
              </el-avatar>
              <div class="buyer-text">
                <div class="buyer-name clickable">{{ review.userName}}</div>
              </div>
            </div>
            <span class="review-time unified-text-secondary">{{ formatDate(review.createTime) }}</span>
          </div>
          
          <!-- 评分展示 -->
          <div class="unified-review-rating" v-if="review.rating">
            <el-rate
              v-model="review.rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template=""
            />
          </div>
          
          <div class="unified-review-content">
            <p class="unified-review-text">{{ review.content }}</p>
          </div>
          
          <!-- 二手物品信息 -->
          <div class="product-info unified-flex unified-flex-center" @click="goToProduct(review.productId)">
            <div class="product-image-container">
              <img 
                :src="review.productImage || '/api/images/default-product.png'" 
                :alt="review.productName"
                class="product-image"
                @error="handleImageError"
              />
              <div v-if="!review.productImage" class="image-placeholder unified-flex unified-flex-center">
                <el-icon><Picture /></el-icon>
              </div>
            </div>
            <div class="product-details">
              <div class="product-name clickable">{{ review.productName || '二手物品' }}</div>
              <div class="product-price unified-text-secondary" v-if="review.productPrice">
                ¥{{ formatPrice(review.productPrice) }}
              </div>
            </div>
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
import { Star, Picture } from '@element-plus/icons-vue'
import { formatDate, formatPrice } from '@/utils/format'
import { useRouter } from 'vue-router'

export default {
  name: 'UserReviewsTab',
  components: {
    Star,
    Picture
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
  emits: ['view-more', 'go-to-product', 'go-to-user'],
  setup(props, { emit }) {
    const router = useRouter()
    
    const viewMore = () => {
      emit('view-more')
    }
    
    const goToProduct = (productId) => {
      emit('go-to-product', productId)
    }
    
    const goToUserProfile = (userId) => {
      emit('go-to-user', userId)
    }
    
    const handleImageError = (event) => {
      event.target.style.display = 'none'
      const placeholder = event.target.nextElementSibling
      if (placeholder) {
        placeholder.style.display = 'flex'
      }
    }
    
    return {
      formatDate,
      formatPrice,
      viewMore,
      goToProduct,
      goToUserProfile,
      handleImageError
    }
  }
}
</script>

<style scoped>
/* 内容头部样式 */
.content-header {
  margin-bottom: var(--spacing-lg);
}

/* 评论卡片样式 */
.review-card {
  border-left: 4px solid var(--primary-color);
}

/* 评分样式 */
.unified-review-rating {
  margin-bottom: var(--spacing-base);
}

.unified-review-rating :deep(.el-rate) {
  display: flex;
  align-items: center;
}

.unified-review-rating :deep(.el-rate__icon) {
  font-size: var(--font-size-md);
  margin-right: var(--spacing-xs);
}

.unified-review-rating :deep(.el-rate__text) {
  margin-left: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}

/* 买家信息样式 */
.buyer-info {
  margin-bottom: var(--spacing-base);
  padding-bottom: var(--spacing-base);
  border-bottom: 1px solid var(--border-color-light);
}

.buyer-details {
  gap: var(--spacing-base);
  cursor: pointer;
}

.buyer-avatar {
  flex-shrink: 0;
  text-decoration: none;
}

.buyer-text {
  flex: 1;
}

.buyer-name {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
  text-decoration: none;
}

.buyer-role {
  font-size: var(--font-size-sm);
}

.review-header {
  margin-bottom: var(--spacing-base);
}

.rating :deep(.el-rate__icon) {
  font-size: var(--font-size-md);
}

/* 二手物品信息样式 */
.product-info {
  padding: var(--spacing-base);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-base);
  gap: var(--spacing-base);
  cursor: pointer;
  transition: background-color var(--transition-base);
}

.product-info:hover {
  background-color: var(--bg-hover);
}

.product-image-container {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-small);
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--bg-placeholder);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  color: var(--text-placeholder);
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.3;
}

.product-price {
  font-size: var(--font-size-sm);
}

/* 点击效果 */
.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: #409eff;
  text-decoration: underline;
}

.product-link {
  font-weight: 500;
}

@media (max-width: 768px) {
  .buyer-details {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-xs);
  }
  
  .product-info {
    flex-direction: column;
    text-align: center;
  }
  
  .product-image-container {
    margin: 0 auto;
  }
}
</style>