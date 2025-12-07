<template>
  <Layout>
    <div class="order-detail-container" v-if="!loading && order">
      <el-card class="order-card">
        <template #header>
          <div class="card-header">
            <span>订单详情</span>
            <el-tag :type="getOrderStatusType(order.status)" size="large">
              {{ formatOrderStatus(order.status) }}
            </el-tag>
          </div>
        </template>
        
        <div class="order-info">
          <el-descriptions title="订单信息" :column="2" border>
            <el-descriptions-item label="订单号">{{ order.id }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="getOrderStatusType(order.status)" size="small">
                {{ formatOrderStatus(order.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(order.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="完成时间" v-if="order.finishTime">
              {{ formatDate(order.finishTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="支付方式">
              {{ formatPaymentMethod(order.paymentMethod) }}
            </el-descriptions-item>
            <el-descriptions-item label="订单金额">¥{{ formatPrice(order.amount) }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <!-- 商品信息 -->
        <div class="product-section">
          <h3>商品信息</h3>
          <el-card shadow="never" v-if="order.product">
            <div class="product-content">
              <div class="product-image">
                <img
                  v-if="order.product.imageUrl"
                  :src="order.product.imageUrl"
                  :alt="order.product.productName"
                />
                <div v-else class="no-image">
                  <el-icon><Picture /></el-icon>
                </div>
              </div>
              <div class="product-info">
                <h4>{{ order.product.productName }}</h4>
                <p>{{ order.product.description || '暂无描述' }}</p>
                <div class="product-meta">
                  <span>分类: {{ order.product.category?.name }}</span>
                  <span>价格: ¥{{ formatPrice(order.product.price) }}</span>
                </div>
              </div>
            </div>
          </el-card>
          <el-empty v-else description="商品信息不存在" />
        </div>
        
        <!-- 交易双方信息 -->
        <div class="trading-parties">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>买家信息</span>
                </template>
                <div class="party-info" v-if="order.buyer">
                  <div class="party-avatar">
                    <el-avatar :size="60" :src="order.buyer.userAvatar">
                      {{ order.buyer.userName?.charAt(0) }}
                    </el-avatar>
                  </div>
                  <div class="party-details">
                    <h4>{{ order.buyer.userName }}</h4>
                    <p>账号: {{ order.buyer.userAccount }}</p>
                    <p>联系方式: {{ order.buyer.userPhone || '未设置' }}</p>
                    <el-tag :type="getUserStatusType(order.buyer.userStatus)" size="small">
                      {{ formatUserStatus(order.buyer.userStatus) }}
                    </el-tag>
                  </div>
                </div>
                <el-empty v-else description="买家信息不存在" />
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>卖家信息</span>
                </template>
                <div class="party-info" v-if="order.seller">
                  <div class="party-avatar">
                    <el-avatar :size="60" :src="order.seller.userAvatar">
                      {{ order.seller.userName?.charAt(0) }}
                    </el-avatar>
                  </div>
                  <div class="party-details">
                    <h4>{{ order.seller.userName }}</h4>
                    <p>账号: {{ order.seller.userAccount }}</p>
                    <p>联系方式: {{ order.seller.userPhone || '未设置' }}</p>
                    <el-tag :type="getUserStatusType(order.seller.userStatus)" size="small">
                      {{ formatUserStatus(order.seller.userStatus) }}
                    </el-tag>
                  </div>
                </div>
                <el-empty v-else description="卖家信息不存在" />
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 支付凭证 -->
        <div class="payment-proof" v-if="order.paymentProof || (order.status === 1 && order.paymentMethod === 0)">
          <el-card>
            <template #header>
              <span>支付凭证</span>
            </template>
            <div v-if="order.paymentProof" class="proof-image">
              <el-image
                :src="order.paymentProof"
                :preview-src-list="[order.paymentProof]"
                fit="contain"
                style="max-width: 300px; max-height: 300px;"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                    <p>图片加载失败</p>
                  </div>
                </template>
              </el-image>
            </div>
            <div v-else-if="order.status === 1 && order.paymentMethod === 0" class="no-proof">
              <p>支付凭证: {{ order.paymentProof || '待上传' }}</p>
              <el-button
                v-if="isBuyer"
                type="primary"
                size="small"
                @click="showProofDialog"
              >
                上传支付凭证
              </el-button>
            </div>
          </el-card>
        </div>
        
        <!-- 订单操作 -->
        <div class="order-actions">
          <el-button @click="$router.go(-1)">返回</el-button>
          
          <!-- 买家操作 -->
          <template v-if="isBuyer">
            <template v-if="order.status === 0">
              <el-button type="primary" @click="payOrder">支付</el-button>
              <el-button type="danger" @click="cancelOrder">取消订单</el-button>
            </template>
            <el-button
              v-if="order.status === 1"
              type="success"
              @click="confirmOrder"
            >
              确认收货
            </el-button>
          </template>
          
          <!-- 卖家操作 -->
          <template v-if="isSeller">
            <el-button
              v-if="order.status === 1 && !order.sellerConfirmed"
              type="success"
              @click="confirmShipment"
            >
              确认发货
            </el-button>
          </template>
        </div>
      </el-card>
    </div>
    
    <div v-else class="loading-container">
      <el-skeleton animated />
    </div>
    
    <!-- 支付凭证对话框 -->
    <el-dialog
      v-model="proofDialogVisible"
      title="上传支付凭证"
      width="500px"
    >
      <el-form :model="proofForm" label-width="80px">
        <el-form-item label="支付凭证">
          <el-input
            v-model="proofForm.paymentProof"
            placeholder="请输入支付凭证图片URL"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="proofDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProof">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'
import api from '@/api'
import {
  formatPrice,
  formatPaymentMethod,
  formatOrderStatus,
  formatUserStatus,
  formatDate,
  getOrderStatusType,
  getUserStatusType
} from '@/utils/format'

export default {
  name: 'OrderDetail',
  components: {
    Layout,
    Picture
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(true)
    const order = ref(null)
    const proofDialogVisible = ref(false)
    const proofForm = reactive({
      paymentProof: ''
    })
    
    // 计算属性
    const user = computed(() => store.state.user)
    const orderId = computed(() => parseInt(route.params.id))
    const isBuyer = computed(() => user.value.id === order.value?.buyer?.id)
    const isSeller = computed(() => user.value.id === order.value?.seller?.id)
    
    // 获取订单详情
    const fetchOrderDetail = async () => {
      try {
        loading.value = true
        const response = await api.order.getOrderById(orderId.value)
        order.value = response.data.data
      } catch (error) {
        console.error('获取订单详情失败:', error)
        ElMessage.error('订单不存在或已被删除')
        router.push('/orders')
      } finally {
        loading.value = false
      }
    }
    
    // 支付订单
    const payOrder = async () => {
      try {
        let result
        
        switch (order.value.paymentMethod) {
          case 0: // 现金支付
            showProofDialog()
            return
            
          case 1: // 微信支付
            result = await api.order.wechatPay(orderId.value)
            break
            
          case 2: // 积分兑换
            result = await api.order.pointsPay(orderId.value)
            break
            
          case 3: // 物品交换
            result = await api.order.applyExchange(orderId.value)
            break
            
          default:
            ElMessage.error('未知的支付方式')
            return
        }
        
        if (result.data.code === 0) {
          ElMessage.success('支付成功')
          fetchOrderDetail()
        }
      } catch (error) {
        console.error('支付失败:', error)
        ElMessage.error('支付失败')
      }
    }
    
    // 取消订单
    const cancelOrder = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要取消这个订单吗？',
          '取消确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await api.order.cancelOrder(orderId.value)
        ElMessage.success('订单已取消')
        fetchOrderDetail()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          ElMessage.error('取消订单失败')
        }
      }
    }
    
    // 确认收货
    const confirmOrder = async () => {
      try {
        await ElMessageBox.confirm(
          '确认已收到商品吗？确认后订单将完成。',
          '确认收货',
          {
            confirmButtonText: '确认收货',
            cancelButtonText: '取消',
            type: 'info'
          }
        )
        
        await api.order.confirmOrder(orderId.value)
        ElMessage.success('订单已完成')
        fetchOrderDetail()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('确认收货失败:', error)
          ElMessage.error('确认收货失败')
        }
      }
    }
    
    // 确认发货
    const confirmShipment = async () => {
      try {
        await ElMessageBox.confirm(
          '确认已发货吗？',
          '确认发货',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info'
          }
        )
        
        // 这里需要根据API调整，可能没有专门的确认发货接口
        // 可以是更新订单状态或者确认交易
        await api.order.completeOrder(orderId.value)
        ElMessage.success('已确认发货')
        fetchOrderDetail()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('确认发货失败:', error)
          ElMessage.error('确认发货失败')
        }
      }
    }
    
    // 显示支付凭证对话框
    const showProofDialog = () => {
      proofForm.paymentProof = order.value.paymentProof || ''
      proofDialogVisible.value = true
    }
    
    // 提交支付凭证
    const submitProof = async () => {
      try {
        await api.order.submitPaymentProof({
          orderId: orderId.value,
          paymentProof: proofForm.paymentProof
        })
        ElMessage.success('支付凭证已提交，请等待卖家确认')
        proofDialogVisible.value = false
        fetchOrderDetail()
      } catch (error) {
        console.error('提交支付凭证失败:', error)
        ElMessage.error('提交支付凭证失败')
      }
    }
    
    // 监听路由参数变化
    watch(() => route.params.id, () => {
      if (route.params.id) {
        fetchOrderDetail()
      }
    }, { immediate: true })
    
    return {
      loading,
      order,
      proofDialogVisible,
      proofForm,
      isBuyer,
      isSeller,
      formatPrice,
      formatPaymentMethod,
      formatOrderStatus,
      formatUserStatus,
      formatDate,
      getOrderStatusType,
      getUserStatusType,
      payOrder,
      cancelOrder,
      confirmOrder,
      confirmShipment,
      showProofDialog,
      submitProof
    }
  }
}
</script>

<style scoped>
.order-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info, .product-section, .trading-parties, .payment-proof {
  margin-top: 20px;
}

.order-info h3, .product-section h3 {
  margin-bottom: 15px;
}

.product-content {
  display: flex;
  gap: 15px;
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  color: #c0c4cc;
  font-size: 24px;
}

.product-info {
  flex: 1;
}

.product-info h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.product-info p {
  margin: 0 0 10px 0;
  color: #606266;
}

.product-meta {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #909399;
}

.party-info {
  display: flex;
  gap: 15px;
}

.party-details h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.party-details p {
  margin: 0 0 5px 0;
  color: #606266;
  font-size: 14px;
}

.proof-image {
  display: flex;
  justify-content: center;
}

.image-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #909399;
}

.no-proof {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-actions {
  margin-top: 20px;
  text-align: center;
}

.order-actions .el-button {
  margin: 0 10px 10px 0;
}

.loading-container {
  padding: 20px;
}
</style>