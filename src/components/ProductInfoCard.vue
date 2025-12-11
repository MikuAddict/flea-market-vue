<template>
  <el-card class="unified-card product-info-card" :class="{ 'compact-mode': compact }">
    <!-- 图片展示区域 -->
    <div class="product-gallery">
      <!-- 主图 -->
      <div class="main-image">
        <img
          v-if="currentImage"
          :src="currentImage"
          :alt="product.productName"
          @error="$emit('image-error')"
        />
        <div v-else class="unified-no-image">
          <el-icon size="50"><Picture /></el-icon>
          <p>暂无图片</p>
        </div>
      </div>
      
      <!-- 缩略图列表 -->
      <div v-if="productImages.length > 1" class="thumbnail-list">
        <div 
          v-for="(image, index) in productImages" 
          :key="index"
          class="thumbnail-item"
          :class="{ active: currentImageIndex === index }"
          @click="currentImageIndex = index"
        >
          <img :src="image" :alt="`图片${index + 1}`" />
        </div>
      </div>
    </div>
    
    <!-- 基本信息区域 -->
    <div class="product-basic-info">
      <h2 class="product-name">{{ product.productName }}</h2>
      
      <div class="product-price">
        <span class="price-label">价格</span>
        <span class="price-value">¥{{ formatPrice(product.price) }}</span>
      </div>
      
      <div class="unified-flex unified-flex-wrap unified-gap-sm">
        <div class="unified-tag unified-tag-info">
          {{ formatPaymentMethod(product.paymentMethod) }}
        </div>
        <div v-if="product.category" class="unified-tag unified-tag-success">
          {{ product.categoryName }}
        </div>
        <div v-if="showStatus && product.status" class="unified-tag" :class="getProductStatusType(product.status)">
          {{ formatProductStatus(product.status) }}
        </div>
      </div>
      
      <!-- 描述信息 -->
      <div class="product-description" v-if="showDescription">
        <h4>二手物品描述</h4>
        <p>{{ product.description || '暂无描述' }}</p>
      </div>
      
      <!-- 操作按钮 -->
      <div class="unified-flex unified-flex-wrap unified-gap-base" v-if="showActions">
        <slot name="actions">
          <!-- 购物车按钮 -->
          <el-button
            v-if="isLoggedIn && product.status === 1 && !isOwnProduct"
            :type="isInCart ? 'danger' : 'primary'"
            size="large"
            class="unified-w-auto"
            @click="handleCartAction"
          >
            {{ isInCart ? '移出购物车' : '加入购物车' }}
          </el-button>

          <!-- 立即购买按钮 -->
          <el-button
            v-if="isLoggedIn && product.status === 1 && !isOwnProduct && !isInCart"
            type="primary"
            size="large"
            class="unified-w-auto"
            :disabled="product.status !== 1"
            @click="$emit('action-click')"
          >
            {{ defaultActionText }}
          </el-button>

        </slot>
      </div>
      
      <!-- 登录提示 -->
      <div class="product-notice" v-if="showLoginNotice">
        <el-alert title="请先登录" type="info" show-icon :closable="false" />
      </div>
      
      <!-- 卖家信息 -->
      <div class="seller-info" v-if="showSellerInfo && product.user">
        <h4>卖家信息</h4>
        <div class="unified-flex unified-flex-center unified-gap-sm">
          <el-avatar 
            :size="sellerAvatarSize" 
            :src="product.userAvatar"
            class="clickable"
            @click="$emit('seller-click', product.id)"
          >
            {{product.userName.charAt(0)}}
          </el-avatar>
          <div class="seller-text">
            <p class="seller-name clickable" @click="$emit('seller-click', product.id)">
              {{ product.userName }}
            </p>
            <p class="seller-contact" v-if="showContact">
              联系方式: {{ product.userPhone}}
            </p>
            <slot name="seller-info"></slot>
          </div>
        </div>
      </div>
      
      <!-- 自定义插槽 -->
      <slot name="custom-content"></slot>
    </div>
  </el-card>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { 
  formatPrice, 
  formatPaymentMethod, 
  formatProductStatus,
  getProductStatusType 
} from '@/utils/format'
import { compareBigIntIds } from '@/utils/bigIntHandler'
import cartApi from '@/api/cart'

export default {
  name: 'ProductInfoCard',
  components: {
    Picture
  },
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({})
    },
    compact: {
      type: Boolean,
      default: false
    },
    showDescription: {
      type: Boolean,
      default: true
    },
    showActions: {
      type: Boolean,
      default: true
    },
    showSellerInfo: {
      type: Boolean,
      default: true
    },
    showContact: {
      type: Boolean,
      default: true
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    showLoginNotice: {
      type: Boolean,
      default: false
    },
    defaultAction: {
      type: Boolean,
      default: false
    },
    defaultActionText: {
      type: String,
      default: '立即购买'
    },
    sellerAvatarSize: {
      type: Number,
      default: 40
    }
  },
  emits: ['action-click', 'seller-click', 'image-error'],
  setup(props) {
    const router = useRouter()
    const store = useStore()
    const currentImageIndex = ref(0)
    
    // 状态
    const isInCart = ref(false)
    
    // 计算属性
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    const user = computed(() => store.state.user)
    const isOwnProduct = computed(() => {
      if (!user.value || !user.value.id || !props.product.user) return false
      return compareBigIntIds(user.value.id, props.product.user.id)
    })
    
    // 处理图片URL
    const processImageUrl = (url) => {
      if (!url) return null
      
      if (url.includes('localhost:7023')) {
        return url.replace('http://localhost:7023', '/api')
      }
      
      if (url.startsWith('images/') || url.includes('/images/')) {
        return `/api/${url.replace(/^\/?/, '')}`
      }
      
      if (url.startsWith('/api/')) {
        return url
      }
      
      return url
    }
    
    // 计算商品图片数组
    const productImages = computed(() => {
      if (props.product.imageUrls && typeof props.product.imageUrls === 'string') {
        return props.product.imageUrls.split(',').filter(url => url.trim()).map(processImageUrl)
      } else if (Array.isArray(props.product.imageUrls)) {
        return props.product.imageUrls.map(processImageUrl)
      } else {
        const mainImage = props.product.mainImageUrl || props.product.imageUrl
        return mainImage ? [processImageUrl(mainImage)] : []
      }
    })
    
    // 当前显示的图片
    const currentImage = computed(() => {
      if (productImages.value.length > 0) {
        return productImages.value[currentImageIndex.value]
      }
      return null
    })
    
    // 检查商品是否在购物车中
    const checkProductInCart = async () => {
      if (!isLoggedIn.value || !props.product.id) return
      
      try {
        const response = await cartApi.getUserCart()
        const cartItems = response.data.data || []
        const cartItem = cartItems.find(item => item.product && item.product.id === props.product.id)
        isInCart.value = !!cartItem
      } catch (error) {
        console.error('检查购物车状态失败:', error)
      }
    }
    
    // 处理购物车操作
    const handleCartAction = async () => {
      if (!isLoggedIn.value) {
        ElMessage.warning('请先登录')
        router.push('/login')
        return
      }
      
      try {
        if (isInCart.value) {
          // 先获取购物车列表，找到对应的购物车项ID
          const cartResponse = await cartApi.getUserCart()
          const cartItems = cartResponse.data.data || []
          const cartItem = cartItems.find(item => item.product && item.product.id === props.product.id)
          
          if (!cartItem) {
            ElMessage.error('购物车项不存在，请刷新页面重试')
            isInCart.value = false
            return
          }
          
          // 尝试通过购物车项ID移除
          try {
            const response = await cartApi.removeFromCart(cartItem.id)
            if (response.data.code === 200) {
              isInCart.value = false
              ElMessage.success('已移出购物车')
            } else {
              ElMessage.error(response.data.message || '移出购物车失败')
            }
          } catch (removeError) {
            // 如果通过购物车项ID移除失败，尝试通过商品ID移除
            console.log('通过购物车项ID移除失败，尝试通过商品ID移除:', removeError)
            try {
              const response = await cartApi.removeFromCartByProductId(props.product.id)
              if (response.data.code === 200) {
                isInCart.value = false
                ElMessage.success('已移出购物车')
              } else {
                ElMessage.error(response.data.message || '移出购物车失败')
              }
            } catch (productRemoveError) {
              ElMessage.error('移出购物车失败，请稍后重试')
              console.error('移出购物车失败:', productRemoveError)
            }
          }
        } else {
          // 加入购物车
          const response = await cartApi.addToCart(props.product.id)
          
          if (response.data.code === 200) {
            isInCart.value = true
            ElMessage.success('已加入购物车')
          } else {
            ElMessage.error(response.data.message || '加入购物车失败')
          }
        }
      } catch (error) {
        ElMessage.error(isInCart.value ? '移出购物车失败' : '加入购物车失败')
        console.error('购物车操作失败:', error)
      }
    }
    
    // 组件挂载时检查购物车状态
    onMounted(() => {
      checkProductInCart()
    })
    
    return {
      currentImageIndex,
      productImages,
      currentImage,
      formatPrice,
      formatPaymentMethod,
      formatProductStatus,
      getProductStatusType,
      isLoggedIn,
      user,
      isOwnProduct,
      isInCart,
      handleCartAction
    }
  }
}
</script>

<style scoped>
.product-info-card {
  height: auto;
  display: block;
}

.product-info-card.compact-mode {
  max-width: 400px;
}

.product-gallery {
  margin-bottom: var(--spacing-lg);
}

.main-image {
  text-align: center;
  background-color: var(--bg-light);
  border-radius: var(--border-radius-base);
  overflow: hidden;
  margin-bottom: var(--spacing-base);
}

.main-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.compact-mode .main-image img {
  max-height: 200px;
}

.thumbnail-list {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding: var(--spacing-sm) 0;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-base);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.thumbnail-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.thumbnail-item.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.2);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: var(--text-placeholder);
}

.compact-mode .image-placeholder {
  height: 200px;
}

.product-basic-info {
  padding: 0 var(--spacing-sm);
}

.product-name {
  margin: 0 0 var(--spacing-base) 0;
  font-size: var(--font-size-xxl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.compact-mode .product-name {
  font-size: var(--font-size-lg);
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-base);
}

.price-label {
  font-size: var(--font-size-base);
  color: var(--text-regular);
  margin-right: var(--spacing-sm);
}

.price-value {
  font-size: 28px;
  font-weight: var(--font-bold);
  color: var(--danger-color);
}

.compact-mode .price-value {
  font-size: var(--font-size-xl);
}

.product-description {
  margin-bottom: var(--spacing-lg);
}

.product-description h4 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-base);
}

.product-description p {
  margin: 0;
  color: var(--text-regular);
  line-height: var(--leading-relaxed);
  white-space: pre-wrap;
}

.product-notice {
  margin-bottom: var(--spacing-lg);
}

.seller-info {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

.seller-info h4 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.seller-text {
  flex: 1;
}

.seller-name {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.seller-contact {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .product-name {
    font-size: var(--font-size-xl);
  }
  
  .price-value {
    font-size: 24px;
  }
  
  .main-image img {
    max-height: 300px;
  }
  
  .thumbnail-item {
    width: 60px;
    height: 60px;
  }
}
</style>