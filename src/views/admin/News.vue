<template>
  <Layout>
    <div class="admin-news unified-page-container fade-in">
      <!-- 页面标题和操作区域 -->
      <div class="page-header unified-flex unified-flex-between unified-mb-xl">
        <div>
          <h1 class="unified-title-xl">新闻管理</h1>
          <p class="unified-text-secondary">管理系统中的所有新闻公告</p>
        </div>
        <el-button 
          type="primary" 
          class="unified-button unified-button-primary"
          @click="showAddNewsDialog"
        >
          <el-icon><Plus /></el-icon>
          发布新闻
        </el-button>
      </div>
      
      
      <!-- 新闻列表 -->
      <el-card class="unified-card news-list-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">新闻列表</h3>
            <div class="batch-actions unified-flex unified-flex-center">
              <el-button
                v-if="selectedNews.length > 0"
                type="danger"
                size="small"
                class="unified-button"
                @click="batchDeleteNews"
              >
                批量删除
              </el-button>
            </div>
          </div>
        </template>
        
        <div class="unified-list-container">
          <el-table
            v-loading="loading"
            :data="newsList"
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" align="center" />
            
            <el-table-column label="新闻信息" min-width="200" align="center">
              <template #default="scope">
                <div class="unified-list-item">
                  <div class="unified-list-item-info">
                    <div class="unified-list-item-name">{{ scope.row.title }}</div>
                    <div class="unified-list-item-desc">{{ scope.row.content?.substring(0, 50) }}...</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="authorName" label="作者" width="120" align="center" />
            
            <el-table-column prop="createTime" label="发布时间" width="160" align="center">
              <template #default="scope">
                {{ formatDate(scope.row.createTime) }}
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="200" fixed="right" align="center">
              <template #default="scope">
                <div class="action-buttons unified-flex unified-flex-center">
                  <el-button
                    size="small"
                    type="primary"
                    plain
                    @click="viewNews(scope.row)"
                    class="action-btn-edit"
                  >
                    查看
                  </el-button>
                  
                  <el-button
                    size="small"
                    type="primary"
                    plain
                    @click="showEditNewsDialog(scope.row)"
                    class="action-btn-edit"
                  >
                    编辑
                  </el-button>
                  
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="handleNewsAction('delete', scope.row)"
                    class="action-btn-delete"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="unified-pagination-container unified-flex unified-flex-center">
            <el-pagination
              v-model:current-page="pagination.current"
              v-model:page-size="pagination.size"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              background
            />
          </div>
        </div>
      </el-card>
      
      <!-- 添加/编辑新闻对话框 -->
      <el-dialog
        v-model="newsDialogVisible"
        :title="dialogMode === 'add' ? '发布新闻' : '编辑新闻'"
        width="800px"
        append-to-body
        class="news-form-dialog"
      >
        <el-form :model="newsForm" :rules="newsFormRules" ref="newsFormRef" label-width="100px">
          <el-form-item label="新闻标题" prop="title">
            <el-input v-model="newsForm.title" placeholder="请输入新闻标题" size="large" />
          </el-form-item>
          
          <el-form-item label="新闻内容" prop="content">
            <el-input
              v-model="newsForm.content"
              type="textarea"
              :rows="10"
              placeholder="请输入新闻内容"
              resize="none"
            />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <div class="dialog-footer unified-flex unified-flex-end">
            <el-button @click="newsDialogVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              :loading="newsFormSubmitting"
              @click="submitNewsForm"
            >
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Search, 
  Edit, 
  Delete, 
  ArrowDown
} from '@element-plus/icons-vue'
import { formatDate } from '@/utils/format'
import { adminApi } from '@/api'
import Layout from '@/components/Layout.vue'
import { processIdsInArray, formatIdForApi } from '@/utils/numberPrecision'

export default {
  name: 'AdminNews',
  components: {
    Layout
  },
  setup() {
    const router = useRouter()
    
    // 表单引用
    const newsFormRef = ref(null)
    
    // 响应式数据
    const loading = ref(false)
    const newsList = ref([])
    const selectedNews = ref([])
    const newsDialogVisible = ref(false)
    const dialogMode = ref('add')
    const newsFormSubmitting = ref(false)
    
    // 分页信息
    const pagination = reactive({
      current: 1,
      size: 10,
      total: 0
    })
    
    // 筛选条件
    const filters = reactive({
      keyword: '',
      status: '',
      dateRange: null
    })
    
    // 新闻统计数据
    const newsStats = computed(() => [
      {
        title: '总新闻数',
        value: newsList.value.length,
        icon: 'Document',
        type: 'primary'
      }
    ])
    
    // 新闻表单
    const newsForm = reactive({
      id: '',
      title: '',
      content: '',
      status: 'draft'
    })
    
    // 新闻表单验证规则
    const newsFormRules = {
      title: [
        { required: true, message: '请输入新闻标题', trigger: 'blur' },
        { min: 5, max: 100, message: '新闻标题长度在5到100个字符', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请输入新闻内容', trigger: 'blur' },
        { min: 10, max: 2000, message: '新闻内容长度在10到2000个字符', trigger: 'blur' }
      ],
      status: [
        { required: true, message: '请选择发布状态', trigger: 'change' }
      ]
    }
    
    // 获取新闻列表
    const fetchNews = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.current,
          pageSize: pagination.size,
          keyword: filters.keyword,
          status: filters.status
        }
        
        // 处理日期范围
        if (filters.dateRange && filters.dateRange.length === 2) {
          params.startDate = filters.dateRange[0]
          params.endDate = filters.dateRange[1]
        }
        
        const response = await adminApi.news.getNewsList(params)
        if (response.data && response.data.code === 200) {
          // 处理新闻列表中的大数字ID，确保精度不丢失
          newsList.value = processIdsInArray(response.data.data || [])
          pagination.total = response.data.total || 0
        } else {
          ElMessage.error('获取新闻列表失败')
        }
      } catch (error) {
        console.error('获取新闻列表失败:', error)
        ElMessage.error('获取新闻列表失败')
      } finally {
        loading.value = false
      }
    }
    
    // 重置筛选条件
    const resetFilters = () => {
      Object.keys(filters).forEach(key => {
        if (key === 'dateRange') {
          filters[key] = null
        } else {
          filters[key] = ''
        }
      })
      pagination.current = 1
      fetchNews()
    }
    
    // 处理表格选择变化
    const handleSelectionChange = (selection) => {
      selectedNews.value = selection
    }
    
    // 处理分页大小变化
    const handleSizeChange = (size) => {
      pagination.size = size
      pagination.current = 1
      fetchNews()
    }
    
    // 处理当前页变化
    const handleCurrentChange = (current) => {
      pagination.current = current
      fetchNews()
    }
    
    // 查看新闻详情
    const viewNews = (news) => {
      router.push(`/news/${news.id}`)
    }
    
    // 显示添加新闻对话框
    const showAddNewsDialog = () => {
      dialogMode.value = 'add'
      resetNewsForm()
      newsDialogVisible.value = true
    }
    
    // 显示编辑新闻对话框
    const showEditNewsDialog = (news) => {
      dialogMode.value = 'edit'
      Object.assign(newsForm, {
        id: news.id,
        title: news.title,
        content: news.content,
        status: news.status
      })
      newsDialogVisible.value = true
    }
    
    // 重置新闻表单
    const resetNewsForm = () => {
      Object.assign(newsForm, {
        id: '',
        title: '',
        content: '',
        status: 'draft'
      })
      if (newsFormRef.value) {
        newsFormRef.value.resetFields()
      }
    }
    
    // 提交新闻表单
    const submitNewsForm = async () => {
      if (!newsFormRef.value) return
      
      try {
        await newsFormRef.value.validate()
        newsFormSubmitting.value = true
        
        let result
        if (dialogMode.value === 'add') {
          result = await adminApi.news.addNews({
            title: newsForm.title,
            content: newsForm.content,
            status: newsForm.status
          })
          ElMessage.success('新闻添加成功')
        }
        
        newsDialogVisible.value = false
        fetchNews()
      } catch (error) {
        console.error('新闻操作失败:', error)
        ElMessage.error('操作失败')
      } finally {
        newsFormSubmitting.value = false
      }
    }
    
    // 批量删除新闻
    const batchDeleteNews = async () => {
      try {
        await ElMessageBox.confirm(`确定要删除选中的 ${selectedNews.value.length} 条新闻吗？此操作不可恢复。`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        
        const promises = selectedNews.value.map(news => 
          adminApi.news.deleteNews(formatIdForApi(news.id))
        )
        
        await Promise.all(promises)
        ElMessage.success('批量删除成功')
        fetchNews()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('批量删除失败')
        }
      }
    }

    // 处理新闻操作
    const handleNewsAction = async (action, news) => {
      try {
        if (action === 'delete') {
          await ElMessageBox.confirm('确定要删除这条新闻吗？此操作不可恢复。', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          })
          
          await adminApi.news.deleteNews(formatIdForApi(news.id))
          ElMessage.success('删除成功')
          fetchNews()
        }
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('操作失败')
        }
      }
    }
    
    onMounted(() => {
      fetchNews()
    })
    
    return {
      loading,
      newsList,
      selectedNews,
      pagination,
      filters,
      newsStats,
      newsDialogVisible,
      dialogMode,
      newsForm,
      newsFormRef,
      newsFormRules,
      newsFormSubmitting,
      fetchNews,
      resetFilters,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      viewNews,
      showAddNewsDialog,
      showEditNewsDialog,
      resetNewsForm,
      submitNewsForm,
      handleNewsAction,
      batchDeleteNews,
      formatDate
    }
  }
}
</script>

<style scoped>
/* 页面头部样式 */
.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  margin-bottom: var(--spacing-xs);
}

/* 统计卡片样式 */
.stats-cards {
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  height: 100%;
}

.stat-item {
  height: 120px;
  padding: var(--spacing-lg);
}

.stat-content {
  height: 100%;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: var(--spacing-base);
}

.stat-item-primary .stat-icon {
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

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}

.stat-title {
  color: var(--text-secondary);
  margin: 0;
}

/* 筛选区域样式 */
.filter-card {
  margin-bottom: var(--spacing-xl);
}

.card-header {
  margin-bottom: var(--spacing-base);
}

.reset-btn {
  color: var(--text-secondary);
}

.filter-select {
  width: 150px;
}

/* 新闻列表样式 */
.news-list-card {
  margin-bottom: var(--spacing-xl);
}

/* 对话框样式 */
.dialog-footer {
  gap: var(--spacing-sm);
}

/* 新闻表单对话框样式 */
.news-form-dialog .el-dialog__body {
  padding: 20px;
}

.news-form-dialog .el-form-item {
  margin-bottom: 20px;
}

.news-form-dialog .el-input__inner,
.news-form-dialog .el-textarea__inner {
  border-radius: var(--border-radius-base);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .news-info {
    flex-direction: column;
  }
  
  .news-image {
    width: 100%;
    height: 160px;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>