<template>
  <el-card class="product-card" shadow="hover" @click="goToDetail">
    <div class="product-image">
      <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.productName" />
      <el-image v-else>
        <template #error>
          <div class="image-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.productName }}</h3>
      <p class="product-price">¥{{ formatPrice(product.price) }}</p>
      <div class="product-meta">
        <el-tag :type="getProductStatusType(product.status)" size="small">
          {{ formatProductStatus(product.status) }}
        </el-tag>
        <el-tag type="info" size="small">
          {{ formatPaymentMethod(product.paymentMethod) }}
        </el-tag>
      </div>
      <div class="product-category" v-if="product.category">
        <el-tag type="success" size="small">{{ product.category.name }}</el-tag>
      </div>
      <div class="product-user" v-if="showUser && product.user">
        <span class="user-name">{{ product.user.userName }}</span>
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
    }
  },
  setup(props) {
    const router = useRouter()
    
    const goToDetail = () => {
      router.push(`/products/${props.product.id}`)
    }
    
    return {
      goToDetail,
      formatPrice,
      formatPaymentMethod,
      formatProductStatus,
      getProductStatusType
    }
  }
}
</script>

<style scoped>
.product-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 180px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 10px;
}

.product-image img {
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
  background-color: #f5f7fa;
  color: #c0c4cc;
  font-size: 30px;
}

.product-info {
  padding: 0 5px;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  margin: 0 0 8px 0;
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.product-meta {
  display: flex;
  gap: 5px;
  margin-bottom: 8px;
}

.product-category {
  margin-bottom: 8px;
}

.product-user {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 12px;
}

.user-name {
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>