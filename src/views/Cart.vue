<template>
  <Layout>
    <div class="unified-page-container fade-in">
      <!-- 页面标题 -->
      <section class="unified-mb-xl">
        <h2 class="unified-title-xl">我的购物车</h2>
      </section>

      <!-- 购物车内容 -->
      <section>
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        
        <!-- 空购物车状态 -->
        <div v-else-if="cartItems.length === 0" class="unified-empty unified-flex unified-flex-center">
          <el-empty description="购物车是空的">
            <template #image>
              <el-icon size="60" color="var(--text-placeholder)"><ShoppingCart /></el-icon>
            </template>
            <el-button 
              type="primary" 
              class="unified-button unified-button-primary"
              @click="$router.push('/products')"
            >
              去逛逛二手物品
            </el-button>
          </el-empty>
        </div>
        
        <!-- 购物车列表 -->
        <div v-else>
          <!-- 购物车项目列表 -->
          <el-card class="cart-items-container">
            <div 
              v-for="item in cartItems" 
              :key="item.id"
              class="cart-item"
            >
              <div class="item-image" @click="goToProduct(item.product?.id)">
                <img 
                  v-if="getProductImage(item.product)" 
                  :src="getProductImage(item.product)" 
                  :alt="item.product?.productName || '商品图片'" 
                />
                <div v-else class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </div>
              
              <div class="item-info">
                <h3 class="item-name" @click="goToProduct(item.product?.id)">
                  {{ item.product?.productName || item.productName || '未知商品' }}
                </h3>
                <div class="item-meta unified-flex unified-flex-wrap">
                  <el-tag type="success" size="small">
                    {{ formatPaymentMethod(item.product?.paymentMethod !== undefined ? item.product?.paymentMethod : item.paymentMethod) }}
                  </el-tag>
                  <el-tag v-if="item.product?.category" type="warning" size="small">
                    {{ item.product.category.name }}
                  </el-tag>
                </div>
                <p class="item-seller">
                  卖家: <span 
                    class="seller-name" 
                    :class="{ 'clickable': !productsLoading[item.productId] && getSellerId(item) }"
                    @click="!productsLoading[item.productId] && goToUserProfile(getSellerId(item))"
                  >{{ 
                    productsLoading[item.productId] 
                      ? '加载中...' 
                      : (item.product?.user?.userName || item.sellerName || '未知卖家')
                  }}</span>
                </p>
              </div>
              
              <div class="item-price">
                <span class="price-value">¥{{ formatPrice(item.product?.price || item.price || 0) }}</span>
              </div>
              
              <div class="item-actions">
                <el-button 
                  type="primary" 
                  size="small"
                  @click="handleBuyNow(item)"
                >
                  立即购买
                </el-button>
                <el-button 
                  type="danger" 
                  size="small"
                  plain
                  @click="handleDeleteItem(item)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </el-card>
          
        </div>
      </section>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingCart, Picture } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import cartApi from '@/api/cart'
import orderApi from '@/api/order'
import { formatPrice, formatPaymentMethod } from '@/utils/format'

export default {
  name: 'Cart',
  components: {
    Layout,
    ShoppingCart,
    Picture
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    
    // 状态
    const loading = ref(false)
    const cartItems = ref([])
    const selectedItems = ref([])
    const productsLoading = ref({}) // 用于跟踪每个商品的加载状态
    
    // 计算属性
    const totalPrice = computed(() => {
      return cartItems.value
        .filter(item => selectedItems.value.includes(item.id))
        .reduce((sum, item) => sum + Number(item.product?.price || item.price || 0), 0)
    })
    
    // 获取购物车数据
    const fetchCartItems = async () => {
      loading.value = true
      try {
        const response = await cartApi.getUserCart()
        let cartData = response.data.data || []
        
        // 处理购物车数据，整合新字段
        const updatedCartItems = []
        for (const item of cartData) {
          // 构建基础product对象，优先使用购物车API提供的新字段
          item.product = {
            id: item.productId,
            productName: item.productName,
            price: item.price,
            mainImageUrl: item.mainImageUrl,
            description: item.description,
            paymentMethod: item.paymentMethod  // 新增字段
          }

          // 设置加载状态
          productsLoading.value[item.productId] = true
          
          // 总是从API获取完整的产品和卖家信息
          try {
            const productApi = (await import('@/api/product')).default
            const productResponse = await productApi.getProductById(item.productId)
            console.log('产品API返回数据:', {
              productId: item.productId,
              responseData: productResponse.data,
              dataField: productResponse.data.data,
              userField: productResponse.data.data?.user
            })
            
            if (productResponse.data.code === 200) {
              // 合并完整的产品信息
              item.product = { ...item.product, ...productResponse.data.data }
              
              // 确保有卖家信息
              if (productResponse.data.data.user) {
                item.product.user = productResponse.data.data.user
                // 更新sellerName为实际的卖家名称
                item.sellerName = productResponse.data.data.user.userName
                console.log('已设置卖家信息:', item.product.user)
              } else {
                console.warn('产品API返回的数据中没有用户信息，尝试单独获取用户信息')
                // 如果产品API没有返回用户信息，尝试单独获取
                if (productResponse.data.data.userId) {
                  try {
                    const userApi = (await import('@/api/user')).default
                    const userResponse = await userApi.getUserVOById(productResponse.data.data.userId)
                    if (userResponse.data.code === 200) {
                      item.product.user = userResponse.data.data
                      item.sellerName = userResponse.data.data.userName
                      console.log('通过单独API获取到卖家信息:', item.product.user)
                    }
                  } catch (userError) {
                    console.error('单独获取用户信息失败:', userError)
                  }
                }
              }
            }
          } catch (error) {
            console.warn('获取商品详细信息失败:', error)
          } finally {
            productsLoading.value[item.productId] = false
          }
          
          // 添加调试日志
          console.log('购物车项:', {
            itemId: item.id,
            productId: item.productId,
            userId: item.userId,
            userName: item.sellerName,
            productUserId: item.product?.user?.id,
            productUserName: item.product?.user?.userName
          })
          
          updatedCartItems.push(item)
        }
        
        cartItems.value = updatedCartItems
      } catch (error) {
        ElMessage.error('获取购物车数据失败')
        console.error('获取购物车数据失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    // 处理单个复选框变化
    const handleCheckboxChange = (itemId, checked) => {
      if (checked) {
        if (!selectedItems.value.includes(itemId)) {
          selectedItems.value.push(itemId)
        }
      } else {
        const index = selectedItems.value.indexOf(itemId)
        if (index > -1) {
          selectedItems.value.splice(index, 1)
        }
      }
    }
    
    // 删除单个商品
    const handleDeleteItem = async (item) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除"${item.product?.productName || item.productName || '该商品'}"吗？`,
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await cartApi.removeFromCart(item.id)
        ElMessage.success('删除成功')
        
        // 如果删除的商品是选中状态，从选中列表中移除
        const index = selectedItems.value.indexOf(item.id)
        if (index > -1) {
          selectedItems.value.splice(index, 1)
        }
        
        await fetchCartItems()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
          console.error('删除失败:', error)
        }
      }
    }
    
    // 立即购买单个商品
    const handleBuyNow = async (item) => {
      try {
        const response = await orderApi.createOrder(item.product?.id || item.productId)
        
        if (response.data.code === 200) {
          ElMessage.success('订单创建成功')
          
          // 获取订单ID - 检查不同可能的返回数据结构
          let orderId
          if (response.data.data && response.data.data.id) {
            orderId = response.data.data.id
          } else if (response.data.data) {
            // 如果data直接是订单ID
            orderId = response.data.data
          } else {
            // 如果没有返回订单ID，跳转到订单列表
            router.push('/orders')
            return
          }
          
          // 跳转到订单详情页面
          if (orderId) {
            router.push(`/orders/${orderId}`)
          } else {
            router.push('/orders')
          }
          
          // 从购物车中移除该商品
          await cartApi.removeFromCart(item.id)
          const index = selectedItems.value.indexOf(item.id)
          if (index > -1) {
            selectedItems.value.splice(index, 1)
          }
          await fetchCartItems()
        } else {
          ElMessage.error(response.data.message || '创建订单失败')
        }
      } catch (error) {
        ElMessage.error('创建订单失败')
        console.error('创建订单失败:', error)
        
        // 如果创建订单失败，仍然跳转到订单列表
        router.push('/orders')
      }
    }
    
    // 跳转到商品详情
    const goToProduct = (productId) => {
      router.push(`/products/${productId}`)
    }
    
    // 获取卖家ID的辅助函数
    const getSellerId = (item) => {
      // 使用product.user.id，这应该是在fetchCartItems中从API获取的真实卖家ID
      const sellerId = item.product?.user?.id
      console.log('获取卖家ID:', {
        sellerId,
        'item.product?.user?.id': item.product?.user?.id,
        'item.userId': item.userId,
        'item.sellerName': item.sellerName,
        'item.product.user.userName': item.product?.user?.userName
      })
      return sellerId
    }
    
    // 跳转到用户资料
    const goToUserProfile = async (userId) => {
      if (!userId) {
        console.warn('用户ID为空，无法跳转')
        return
      }
      console.log('跳转到用户主页，用户ID:', userId)
      router.push(`/user/${userId}`)
    }
    
    // 获取产品图片
    const getProductImage = (product) => {
      if (!product) return null
      
      if (product.mainImageUrl) {
        if (product.mainImageUrl.startsWith('/')) {
          return product.mainImageUrl.startsWith('/api') ? product.mainImageUrl : '/api' + product.mainImageUrl
        }
        return product.mainImageUrl
      }
      
      if (product.imageUrl) {
        if (product.imageUrl.startsWith('/')) {
          return product.imageUrl.startsWith('/api') ? product.imageUrl : '/api' + product.imageUrl
        }
        return product.imageUrl
      }
      
      return null
    }
    
    onMounted(() => {
      fetchCartItems()
    })
    
    return {
      loading,
      cartItems,
      selectedItems,
      productsLoading,
      totalPrice,
      handleDeleteItem,
      handleBuyNow,
      goToProduct,
      goToUserProfile,
      getSellerId,
      getProductImage,
      formatPrice,
      formatPaymentMethod
    }
  }
}
</script>

<style scoped>
/* 页面容器样式 */
.unified-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* 批量操作栏 */
.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-base);
  padding: var(--spacing-base);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-base);
}

/* 购物车容器 */
.cart-items-container {
  margin-bottom: var(--spacing-lg);
}

/* 购物车项目 */
.cart-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--border-lighter);
}

.cart-item:last-child {
  border-bottom: none;
}

/* 商品选择框 */
.item-checkbox {
  margin-right: var(--spacing-base);
}

/* 商品图片 */
.item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--border-radius-base);
  overflow: hidden;
  margin-right: var(--spacing-base);
  cursor: pointer;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* 商品信息 */
.item-info {
  flex: 1;
  margin-right: var(--spacing-base);
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  cursor: pointer;
  transition: color var(--transition-base);
}

.item-name:hover {
  color: var(--primary-color);
}

.item-meta {
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.item-seller {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.seller-name {
  color: var(--text-regular);
  font-weight: 500;
  cursor: pointer;
  transition: color var(--transition-base);
}

.seller-name:hover {
  color: var(--primary-color);
}

/* 商品价格 */
.item-price {
  width: 120px;
  text-align: center;
  margin-right: var(--spacing-base);
}

.price-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--danger-color);
}

/* 操作按钮 */
.item-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

/* 购物车底部 */
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-base);
}

.cart-summary {
  font-size: var(--font-size-base);
  color: var(--text-regular);
}

.cart-total {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
}

.total-price {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--danger-color);
}

/* 加载和空状态样式 */
.loading-container {
  padding: var(--spacing-xxl) 0;
}

.empty-container {
  min-height: 300px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .unified-page-container {
    padding: var(--spacing-base);
  }
  
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-checkbox {
    margin-bottom: var(--spacing-sm);
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }
  
  .item-info {
    width: 100%;
    margin-right: 0;
    margin-bottom: var(--spacing-sm);
  }
  
  .item-price {
    width: 100%;
    text-align: left;
    margin-right: 0;
    margin-bottom: var(--spacing-sm);
  }
  
  .item-actions {
    flex-direction: row;
    width: 100%;
  }
  
  .cart-footer {
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .cart-total {
    width: 100%;
    justify-content: space-between;
  }
}
</style>