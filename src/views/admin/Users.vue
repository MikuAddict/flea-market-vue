<template>
  <div class="admin-users">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
        </div>
      </template>
      
      <!-- 搜索和筛选 -->
      <div class="filter-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名或邮箱"
          style="width: 300px; margin-right: 10px"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="filterRole" placeholder="用户角色" clearable style="width: 120px; margin-right: 10px">
          <el-option label="普通用户" value="user" />
          <el-option label="管理员" value="admin" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <!-- 用户列表 -->
      <el-table :data="userList" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status === 'active' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
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

    <!-- 编辑用户对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑用户" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editForm.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="inactive">禁用</el-radio>
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
import { userApi } from '@/api'
import { formatDate } from '@/utils/format'

export default {
  name: 'AdminUsers',
  setup() {
    const loading = ref(false)
    const userList = ref([])
    const searchKeyword = ref('')
    const filterRole = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const editDialogVisible = ref(false)
    const editForm = ref({
      id: '',
      username: '',
      email: '',
      role: 'user',
      status: 'active'
    })

    // 获取用户列表
    const fetchUsers = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchKeyword.value,
          role: filterRole.value
        }
        const response = await userApi.getUserList(params)
        userList.value = response.data.users
        total.value = response.data.total
      } catch (error) {
        console.error('获取用户列表失败:', error)
        ElMessage.error('获取用户列表失败')
      } finally {
        loading.value = false
      }
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchUsers()
    }

    // 重置搜索
    const resetSearch = () => {
      searchKeyword.value = ''
      filterRole.value = ''
      currentPage.value = 1
      fetchUsers()
    }

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchUsers()
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchUsers()
    }

    // 编辑用户
    const handleEdit = (user) => {
      editForm.value = { ...user }
      editDialogVisible.value = true
    }

    // 提交编辑
    const handleEditSubmit = async () => {
      try {
        await userApi.updateUser(editForm.value.id, editForm.value)
        ElMessage.success('用户信息更新成功')
        editDialogVisible.value = false
        fetchUsers()
      } catch (error) {
        console.error('更新用户信息失败:', error)
        ElMessage.error('更新用户信息失败')
      }
    }

    // 切换用户状态
    const handleToggleStatus = async (user) => {
      try {
        await ElMessageBox.confirm(
          `确定要${user.status === 'active' ? '禁用' : '启用'}用户 "${user.username}" 吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        const newStatus = user.status === 'active' ? 'inactive' : 'active'
        await userApi.updateUser({ id: user.id, status: newStatus })
        ElMessage.success('用户状态更新成功')
        fetchUsers()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新用户状态失败:', error)
          ElMessage.error('更新用户状态失败')
        }
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      loading,
      userList,
      searchKeyword,
      filterRole,
      currentPage,
      pageSize,
      total,
      editDialogVisible,
      editForm,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      handleEdit,
      handleEditSubmit,
      handleToggleStatus,
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
  font-size: 18px;
  font-weight: bold;
}
</style>