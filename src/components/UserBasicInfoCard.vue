<template>
  <el-card class="unified-card profile-card fade-in">
    <template #header>
      <div class="unified-flex unified-flex-between">
        <h3 class="unified-title-base">个人信息</h3>
        <slot name="actions"></slot>
      </div>
    </template>
    
    <div class="profile-content">
      <div class="avatar-section unified-flex unified-flex-center">
        <div class="unified-relative">
          <el-avatar :size="100" :src="user.userAvatar" class="unified-avatar">
            <span class="unified-avatar-text">{{ user.userName?.charAt(0) }}</span>
          </el-avatar>
          <slot name="avatar-overlay"></slot>
        </div>
      </div>
      
      <div v-if="showUploadedTip && avatarFile" class="unified-text-success unified-flex unified-flex-center avatar-uploaded-tip">
        <el-icon><Check /></el-icon>
        <span class="unified-ml-xs">新头像已选择</span>
      </div>
      
      <slot name="edit-form" :user="user" v-if="editMode"></slot>
      
      <div v-else class="profile-info unified-flex unified-flex-col">
        <div class="user-details unified-flex unified-flex-center">
          <div class="user-info unified-flex unified-flex-col">
            <h2 class="user-name unified-title-base">{{ user.userName }}</h2>
            <div class="unified-tag unified-tag-primary user-role">
              {{ formatUserRole(user.userRole) }}
            </div>
          </div>
        </div>
        
        <div class="unified-stats">
          <div class="unified-stat-item">
            <span class="unified-stat-value">{{ user.point}}</span>
            <span class="unified-stat-label">积分</span>
          </div>
          <div class="unified-stat-divider"></div>
          <div class="unified-stat-item">
            <span class="unified-stat-value">{{ productsCount }}</span>
            <span class="unified-stat-label">物品</span>
          </div>
          <div v-if="ordersCount !== undefined" class="unified-stat-divider"></div>
          <div v-if="ordersCount !== undefined" class="unified-stat-item">
            <span class="unified-stat-value">{{ ordersCount }}</span>
            <span class="unified-stat-label">订单</span>
          </div>
        </div>
        
        <el-divider />
        
        <div class="info-details">
          <div class="detail-item">
            <span class="detail-label unified-text-secondary">{{ accountIdLabel }}</span>
            <span class="detail-value">{{ user.userAccount }}</span>
          </div>
          <div class="detail-item" v-if="user.userPhone">
            <span class="detail-label unified-text-secondary">手机号</span>
            <span class="detail-value">{{ user.userPhone}}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label unified-text-secondary">注册时间</span>
            <span class="detail-value">{{ formatDate(user.createTime || user.registerTime, dateFormat) }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Check } from '@element-plus/icons-vue'
import { formatUserRole, formatDate } from '@/utils/format'

export default {
  name: 'UserBasicInfoCard',
  components: {
    Check
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    },
    avatarFile: {
      type: Object,
      default: null
    },
    productsCount: {
      type: Number,
      default: 0
    },
    ordersCount: {
      type: Number,
      default: undefined
    },
    accountIdLabel: {
      type: String,
      default: '账号'
    },
    dateFormat: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    showUploadedTip: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      formatUserRole,
      formatDate
    }
  }
}
</script>

<style scoped>
/* 用户信息卡片样式 */
.profile-card {
  margin-bottom: var(--spacing-xl);
}

/* 头像部分样式 */
.avatar-section {
  margin-bottom: var(--spacing-lg);
}

.avatar-container {
  position: relative;
}

.user-avatar {
  border: 3px solid var(--border-lighter);
  box-shadow: var(--shadow-light);
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
}

.avatar-text {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: white;
}

/* 新增的已上传头像提示样式 */
.avatar-uploaded-tip {
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

/* 用户信息详情样式 */
.profile-info {
  text-align: center;
}

.user-details {
  margin-bottom: var(--spacing-lg);
}

.user-info {
  align-items: center;
}

.user-name {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.user-role {
  margin-top: var(--spacing-xs);
}

/* 详细信息样式 */
.info-details {
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-base);
}

.detail-label {
  font-weight: 500;
}

.detail-value {
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .unified-stats {
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .unified-stat-divider {
    width: 100%;
    height: 1px;
  }
}
</style>