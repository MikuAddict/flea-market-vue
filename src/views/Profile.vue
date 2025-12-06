<template>
  <div class="profile">
    <div class="profile-header">
      <h1>个人中心</h1>
    </div>

    <div class="profile-content">
      <!-- 用户信息卡片 -->
      <el-card class="user-info-card">
        <template #header>
          <div class="card-header">
            <el-icon><User /></el-icon>
            <span>基本信息</span>
          </div>
        </template>
        
        <div class="user-info">
          <div class="avatar-section">
            <el-avatar :size="80" :src="userInfo.avatar">{{ userInfo.userName?.charAt(0) }}</el-avatar>
          </div>
          <div class="info-section">
            <div class="info-item">
              <label>用户名：</label>
              <span>{{ userInfo.userName }}</span>
            </div>
            <div class="info-item">
              <label>邮箱：</label>
              <span>{{ userInfo.email || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>手机号：</label>
              <span>{{ userInfo.phone || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>注册时间：</label>
              <span>{{ formatTime(userInfo.createTime) }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 数据统计 -->
      <div class="stats-grid">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon sales">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.soldCount || 0 }}</div>
              <div class="stat-label">已售商品</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon products">
              <el-icon><Goods /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.productCount || 0 }}</div>
              <div class="stat-label">在售商品</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon orders">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.orderCount || 0 }}</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon revenue">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">¥{{ stats.totalRevenue || 0 }}</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 我的商品 -->
      <el-card class="my-products">
        <template #header>
          <div class="card-header">
            <el-icon><Goods /></el-icon>
            <span>我的商品</span>
            <el-button type="primary" size="small" @click="$router.push('/publish')" style="margin-left: auto;">
              发布商品
            </el-button>
          </div>
        </template>

        <el-table :data="myProducts" style="width: 100%">
          <el-table-column prop="name" label="商品名称" min-width="200">
            <template #default="{ row }">
              <div class="product-cell">
                <img :src="row.image || '/placeholder-image.png'" :alt="row.name" class="product-image" />
                <span class="product-name">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="100">
            <template #default="{ row }">
              ¥{{ row.price }}
            </template>
          </el-table-column>
          <el-table-column prop="sales" label="销量" width="80" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">
                {{ row.status === 1 ? '在售' : '已售出' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="120">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button link type="primary" @click="$router.push(`/product/${row.id}`)">查看</el-button>
              <el-button link type="danger" @click="handleDeleteProduct(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="myProducts.length === 0" class="empty-products">
          <el-empty description="暂无商品" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, ShoppingCart, Goods, Document, Money } from '@element-plus/icons-vue'
import defaultApi from '../api/DefaultApi'
import ApiClient from '../ApiClient'

const api = new DefaultApi(new ApiClient())

const userInfo = computed(() => {
  const saved = localStorage.getItem('userInfo')
  return saved ? JSON.parse(saved) : {}
})

const stats = ref({})
const myProducts = ref([])

onMounted(async () => {
  await loadUserStats()
  await loadMyProducts()
})

const loadUserStats = async () => {
  try {
    const userId = userInfo.value.id
    if (userId) {
      // 这里应该调用获取用户统计信息的API
      // 由于API可能没有专门的统计接口，这里模拟数据
      stats.value = {
        soldCount: 5,
        productCount: 3,
        orderCount: 8,
        totalRevenue: 1250.50
      }
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const loadMyProducts = async () => {
  try {
    const userId = userInfo.value.id
    if (userId) {
      const response = await api.listProductUsingGET({
        sellerId: userId,
        current: 1,
        size: 10
      })
      if (response.code === 200) {
        myProducts.value = response.data.records || []
      }
    }
  } catch (error) {
    console.error('加载我的商品失败:', error)
    ElMessage.error('加载我的商品失败')
  }
}

const handleDeleteProduct = async (productId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      type: 'warning'
    })

    const response = await api.deleteProductUsingPOST({ id: productId })
    if (response.code === 200) {
      ElMessage.success('删除成功')
      await loadMyProducts()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  return new Date(timeString).toLocaleDateString()
}
</script>

<style scoped>
.profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  margin-bottom: 30px;
}

.profile-header h1 {
  color: #303133;
  margin: 0;
}

.user-info-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.card-header .el-icon {
  margin-right: 8px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-section {
  margin-right: 30px;
}

.info-section {
  flex: 1;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
}

.info-item label {
  width: 80px;
  color: #909399;
  font-weight: 500;
}

.info-item span {
  color: #606266;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.stat-icon.sales {
  background: #67c23a;
}

.stat-icon.products {
  background: #409eff;
}

.stat-icon.orders {
  background: #e6a23c;
}

.stat-icon.revenue {
  background: #f56c6c;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.my-products {
  margin-bottom: 24px;
}

.product-cell {
  display: flex;
  align-items: center;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
}

.product-name {
  font-weight: 500;
}

.empty-products {
  padding: 40px 0;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-section {
    margin-right: 0;
    margin-bottom: 20px;
  }
}
</style>