b<template>
  <Layout>
    <div class="admin-page unified-page-container fade-in">
      <!-- 页面标题和操作区域 -->
      <div class="page-header unified-flex unified-flex-between">
        <div>
          <h1 class="unified-title-xl">{{ pageTitle }}</h1>
          <p class="unified-text-secondary">{{ pageSubtitle }}</p>
        </div>
        <el-button 
          v-if="primaryButtonText"
          type="primary" 
          class="unified-button unified-button-primary"
          @click="$emit('primary-button-click')"
        >
          <el-icon><Plus /></el-icon>
          {{ primaryButtonText }}
        </el-button>
      </div>
      
      <!-- 统计卡片区域 -->
      <div v-if="stats && stats.length > 0" class="stats-cards unified-grid unified-grid-4">
        <div class="stat-card fade-in" v-for="(stat, index) in stats" :key="stat.title" :style="{ animationDelay: `${index * 0.1}s` }">
          <el-card class="unified-card stat-item" :class="`stat-item-${stat.type}`">
            <div class="stat-content unified-flex unified-flex-center">
              <div class="stat-icon unified-flex unified-flex-center">
                <el-icon :size="24"><component :is="stat.icon" /></el-icon>
              </div>
              <div class="stat-info">
                <h3 class="stat-value">{{ stat.value }}</h3>
                <p class="stat-title">{{ stat.title }}</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      
      <!-- 筛选区域 -->
      <el-card v-if="showFilter" class="unified-card filter-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">筛选与搜索</h3>
            <el-button 
              type="text" 
              @click="$emit('reset-filters')"
              class="reset-btn"
            >
              重置
            </el-button>
          </div>
        </template>
        
        <slot name="filter-form"></slot>
      </el-card>
      
      <!-- 主内容区域 -->
      <el-card class="unified-card main-content-card fade-in">
        <template #header v-if="showHeader">
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">{{ contentTitle }}</h3>
            <div class="batch-actions unified-flex unified-flex-center">
              <slot name="header-actions"></slot>
            </div>
          </div>
        </template>
        
        <slot name="content"></slot>
      </el-card>
      
      <!-- 分页区域 -->
      <div v-if="showPagination && total > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="$emit('size-change', $event)"
          @current-change="$emit('current-change', $event)"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
import Layout from '@/components/Layout.vue'

export default {
  name: 'AdminPageLayout',
  components: {
    Plus,
    Layout
  },
  props: {
    pageTitle: {
      type: String,
      required: true
    },
    pageSubtitle: {
      type: String,
      default: ''
    },
    primaryButtonText: {
      type: String,
      default: ''
    },
    stats: {
      type: Array,
      default: () => []
    },
    showFilter: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    contentTitle: {
      type: String,
      default: '列表'
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  emits: [
    'primary-button-click',
    'reset-filters',
    'size-change',
    'current-change'
  ]
}
</script>

<style scoped>
.admin-page {
  padding: var(--spacing-xl);
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.stats-cards {
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-item {
  height: 100%;
  padding: var(--spacing-base);
  border-radius: var(--border-radius-base);
}

.stat-content {
  gap: var(--spacing-base);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.stat-item-success .stat-icon {
  background-color: rgba(103, 194, 58, 0.1);
  color: var(--success-color);
}

.stat-item-warning .stat-icon {
  background-color: rgba(230, 162, 60, 0.1);
  color: var(--warning-color);
}

.stat-item-danger .stat-icon {
  background-color: rgba(245, 108, 108, 0.1);
  color: var(--danger-color);
}

.stat-info h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.stat-info p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.filter-card {
  margin-bottom: var(--spacing-xl);
}

.card-header {
  width: 100%;
}

.main-content-card {
  margin-bottom: var(--spacing-xl);
}

.reset-btn:hover {
  color: var(--primary-color);
}

.batch-actions {
  gap: var(--spacing-sm);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: var(--border-radius-base);
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: var(--bg-lighter) !important;
  color: var(--text-regular) !important;
  font-weight: 600;
}

:deep(.el-table__empty-block) {
  padding: var(--spacing-xl);
}

:deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

:deep(.el-table td) {
  padding: var(--spacing-base) var(--spacing-sm);
}

/* 表单样式优化 */
:deep(.el-form-item) {
  margin-bottom: var(--spacing-base);
}

:deep(.el-input__wrapper) {
  border-radius: var(--border-radius-base);
}

:deep(.el-select .el-input__wrapper) {
  width: 100%;
}

.filter-select {
  width: 100%;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .admin-page {
    padding: var(--spacing-base);
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .unified-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .unified-grid-4 {
    grid-template-columns: 1fr;
  }
}
</style>