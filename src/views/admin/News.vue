<template>
  <div class="admin-news">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>新闻管理</span>
          <el-button type="primary" @click="handleCreate">发布新闻</el-button>
        </div>
      </template>
      
      <!-- 搜索和筛选 -->
      <div class="filter-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索新闻标题或内容"
          style="width: 300px; margin-right: 10px"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="filterStatus" placeholder="发布状态" clearable style="width: 120px; margin-right: 10px">
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <!-- 新闻列表 -->
      <el-table :data="newsList" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="新闻标题" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览数" width="100" />
        <el-table-column prop="createdAt" label="发布时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status === 'published' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'published' ? '撤回' : '发布' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑/创建新闻对话框 -->
    <el-dialog 
      v-model="editDialogVisible" 
      :title="isEdit ? '编辑新闻' : '发布新闻'" 
      width="800px"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="新闻标题" required>
          <el-input v-model="editForm.title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-form-item label="新闻内容" required>
          <el-input
            v-model="editForm.content"
            type="textarea"
            :rows="10"
            placeholder="请输入新闻内容"
          />
        </el-form-item>
        <el-form-item label="发布状态">
          <el-radio-group v-model="editForm.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="published">立即发布</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { newsApi } from '@/api'
import { formatDate } from '@/utils/format'

export default {
  name: 'AdminNews',
  setup() {
    const loading = ref(false)
    const newsList = ref([])
    const searchKeyword = ref('')
    const filterStatus = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const editDialogVisible = ref(false)
    const isEdit = ref(false)
    const editForm = ref({
      id: '',
      title: '',
      content: '',
      status: 'draft'
    })

    // 获取新闻列表
    const fetchNews = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchKeyword.value,
          status: filterStatus.value
        }
        const response = await newsApi.getNews(params)
        newsList.value = response.data.news
        total.value = response.data.total
      } catch (error) {
        console.error('获取新闻列表失败:', error)
        ElMessage.error('获取新闻列表失败')
      } finally {
        loading.value = false
      }
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchNews()
    }

    // 重置搜索
    const resetSearch = () => {
      searchKeyword.value = ''
      filterStatus.value = ''
      currentPage.value = 1
      fetchNews()
    }

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchNews()
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchNews()
    }

    // 创建新闻
    const handleCreate = () => {
      isEdit.value = false
      editForm.value = {
        id: '',
        title: '',
        content: '',
        status: 'draft'
      }
      editDialogVisible.value = true
    }

    // 编辑新闻
    const handleEdit = (news) => {
      isEdit.value = true
      editForm.value = { ...news }
      editDialogVisible.value = true
    }

    // 提交编辑
    const handleEditSubmit = async () => {
      try {
        if (!editForm.value.title || !editForm.value.content) {
          ElMessage.warning('请填写标题和内容')
          return
        }

        if (isEdit.value) {
          await newsApi.updateNews(editForm.value.id, editForm.value)
          ElMessage.success('新闻更新成功')
        } else {
          await newsApi.createNews(editForm.value)
          ElMessage.success('新闻发布成功')
        }
        
        editDialogVisible.value = false
        fetchNews()
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      }
    }

    // 切换新闻状态
    const handleToggleStatus = async (news) => {
      try {
        await ElMessageBox.confirm(
          `确定要${news.status === 'published' ? '撤回' : '发布'}新闻 "${news.title}" 吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        const newStatus = news.status === 'published' ? 'draft' : 'published'
        await newsApi.updateNewsStatus(news.id, newStatus)
        ElMessage.success('新闻状态更新成功')
        fetchNews()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新新闻状态失败:', error)
          ElMessage.error('更新新闻状态失败')
        }
      }
    }

    // 删除新闻
    const handleDelete = async (news) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除新闻 "${news.title}" 吗？此操作不可恢复。`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }
        )
        
        await newsApi.deleteNews(news.id)
        ElMessage.success('新闻删除成功')
        fetchNews()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除新闻失败:', error)
          ElMessage.error('删除新闻失败')
        }
      }
    }

    onMounted(() => {
      fetchNews()
    })

    return {
      loading,
      newsList,
      searchKeyword,
      filterStatus,
      currentPage,
      pageSize,
      total,
      editDialogVisible,
      isEdit,
      editForm,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      handleCreate,
      handleEdit,
      handleEditSubmit,
      handleToggleStatus,
      handleDelete,
      formatDate
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
</style>