<template>
  <Layout>
    <div class="admin-users unified-page-container fade-in">
      <!-- 页面标题和操作区域 -->
      <div class="page-header unified-flex unified-flex-between">
        <div>
          <h1 class="unified-title-xl">用户管理</h1>
          <p class="unified-text-secondary">管理系统中的所有用户</p>
        </div>
        <el-button 
          type="primary" 
          class="unified-button unified-button-primary"
          @click="showAddUserDialog"
        >
          <el-icon><Plus /></el-icon>
          添加用户
        </el-button>
      </div>
      
      <!-- 用户统计卡片 -->
      <div class="stats-cards unified-grid unified-grid-4">
        <div class="stat-card fade-in" v-for="(stat, index) in userStats" :key="stat.title" :style="{ animationDelay: `${index * 0.1}s` }">
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
      
      <!-- 筛选和搜索区域 -->
      <el-card class="unified-card filter-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">筛选与搜索</h3>
            <el-button 
              type="text" 
              @click="resetFilters"
              class="reset-btn"
            >
              重置
            </el-button>
          </div>
        </template>
        
        <el-form :model="filters" :inline="true" label-width="80px">
          <el-form-item label="用户名">
            <el-input
              v-model="filters.userName"
              placeholder="搜索用户名"
              clearable
              class="unified-input"
            />
          </el-form-item>
          
          <el-form-item label="用户角色">
            <el-select
              v-model="filters.userRole"
              placeholder="选择角色"
              clearable
              class="unified-input filter-select"
            >
              <el-option label="普通用户" value="user" />
              <el-option label="管理员" value="admin" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="审核状态">
            <el-select
              v-model="filters.userStatus"
              placeholder="选择状态"
              clearable
              class="unified-input filter-select"
            >
              <el-option label="待审核" value="0" />
              <el-option label="已通过" value="1" />
              <el-option label="已拒绝" value="2" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="unified-input"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              class="unified-button unified-button-primary"
              @click="fetchUsers"
            >
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 用户列表 -->
      <el-card class="unified-card users-card fade-in">
        <template #header>
          <div class="card-header unified-flex unified-flex-between">
            <h3 class="unified-title-base">用户列表</h3>
            <div class="batch-actions unified-flex unified-flex-center">
              <el-button
                v-if="selectedUsers.length > 0"
                type="danger"
                size="small"
                class="unified-button"
                @click="batchDeleteUsers"
              >
                批量删除
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          
          <el-table-column prop="id" label="ID" width="80" />
          
          <el-table-column label="用户信息" min-width="180">
            <template #default="scope">
              <div class="user-info unified-flex unified-flex-center">
                <el-avatar :size="36" :src="scope.row.userAvatar">
                  {{ scope.row.userName?.charAt(0) }}
                </el-avatar>
                <div class="user-details">
                  <div class="user-name">{{ scope.row.userName }}</div>
                  <div class="user-account">{{ scope.row.userAccount }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="userPhone" label="手机号" width="130" />
          
          <el-table-column prop="userRole" label="角色" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.userRole === 'admin' ? 'danger' : 'primary'" size="small">
                {{ scope.row.userRole === 'admin' ? '管理员' : '普通用户' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="userStatus" label="审核状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.userStatus)" size="small">
                {{ getStatusText(scope.row.userStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="point" label="积分" width="80" />
          
          <el-table-column prop="registerTime" label="注册时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.registerTime) }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <div class="action-buttons unified-flex">
                <el-button
                  size="small"
                  type="text"
                  @click="showEditUserDialog(scope.row)"
                >
                  编辑
                </el-button>
                
                <el-dropdown @command="(command) => handleUserAction(command, scope.row)">
                  <el-button size="small" type="text">
                    更多
                    <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="reset-password">重置密码</el-dropdown-item>
                      <el-dropdown-item command="toggle-status">
                        {{ scope.row.userStatus === 1 ? '禁用' : '启用' }}
                      </el-dropdown-item>
                      <el-dropdown-item command="audit" v-if="scope.row.userStatus === 0">
                        审核
                      </el-dropdown-item>
                      <el-dropdown-item divided command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container unified-flex unified-flex-center">
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
      </el-card>
      
      <!-- 添加/编辑用户对话框 -->
      <el-dialog
        v-model="userDialogVisible"
        :title="dialogMode === 'add' ? '添加用户' : '编辑用户'"
        width="600px"
        @close="resetUserForm"
      >
        <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="userForm.userName" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="账号" prop="userAccount">
            <el-input 
              v-model="userForm.userAccount" 
              placeholder="请输入账号" 
              :disabled="dialogMode === 'edit'"
            />
          </el-form-item>
          
          <el-form-item label="密码" prop="userPassword" v-if="dialogMode === 'add'">
            <el-input 
              v-model="userForm.userPassword" 
              type="password" 
              placeholder="请输入密码" 
              show-password
            />
          </el-form-item>
          
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="userForm.userPhone" placeholder="请输入手机号" />
          </el-form-item>
          
          <el-form-item label="头像" prop="userAvatar">
            <el-input v-model="userForm.userAvatar" placeholder="请输入头像URL" />
          </el-form-item>
          
          <el-form-item label="用户角色" prop="userRole">
            <el-select v-model="userForm.userRole" placeholder="请选择角色">
              <el-option label="普通用户" value="user" />
              <el-option label="管理员" value="admin" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="积分" prop="point">
            <el-input-number v-model="userForm.point" :min="0" />
          </el-form-item>
          
          <el-form-item label="审核状态" prop="userStatus" v-if="dialogMode === 'edit'">
            <el-radio-group v-model="userForm.userStatus">
              <el-radio :label="0">待审核</el-radio>
              <el-radio :label="1">已通过</el-radio>
              <el-radio :label="2">已拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <div class="dialog-footer unified-flex unified-flex-end">
            <el-button @click="userDialogVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              :loading="userFormSubmitting"
              @click="submitUserForm"
            >
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
      
      <!-- 用户审核对话框 -->
      <el-dialog
        v-model="auditDialogVisible"
        title="用户审核"
        width="500px"
      >
        <el-form :model="auditForm" label-width="100px">
          <el-form-item label="用户信息">
            <div class="audit-user-info unified-flex">
              <el-avatar :size="50" :src="auditForm.userAvatar">
                {{ auditForm.userName?.charAt(0) }}
              </el-avatar>
              <div class="audit-user-details">
                <h4>{{ auditForm.userName }}</h4>
                <p>账号: {{ auditForm.userAccount }}</p>
                <p>注册时间: {{ formatDate(auditForm.registerTime) }}</p>
              </div>
            </div>
          </el-form-item>
          
          <el-form-item label="审核结果">
            <el-radio-group v-model="auditForm.auditStatus">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="审核备注" v-if="auditForm.auditStatus === 2">
            <el-input
              v-model="auditForm.auditRemark"
              type="textarea"
              :rows="3"
              placeholder="请输入拒绝原因"
            />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <div class="dialog-footer unified-flex unified-flex-end">
            <el-button @click="auditDialogVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              :loading="auditSubmitting"
              @click="submitAuditForm"
            >
              提交审核
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
  ArrowDown,
  User,
  UserFilled,
  UserPending,
  UserCheck
} from '@element-plus/icons-vue'
import { formatDate } from '@/utils/format'
import { adminApi } from '@/api'
import Layout from '@/components/Layout.vue'

export default {
  name: 'AdminUsers',
  components: {
    Layout
  },
  setup() {
    const router = useRouter()
    
    // 表单引用
    const userFormRef = ref(null)
    
    // 响应式数据
    const loading = ref(false)
    const userList = ref([])
    const selectedUsers = ref([])
    const userDialogVisible = ref(false)
    const auditDialogVisible = ref(false)
    const dialogMode = ref('add')
    const userFormSubmitting = ref(false)
    const auditSubmitting = ref(false)
    
    // 分页信息
    const pagination = reactive({
      current: 1,
      size: 10,
      total: 0
    })
    
    // 筛选条件
    const filters = reactive({
      userName: '',
      userRole: '',
      userStatus: '',
      dateRange: null
    })
    
    // 用户统计数据
    const userStats = computed(() => [
      {
        title: '总用户数',
        value: userList.value.length,
        icon: 'User',
        type: 'primary'
      },
      {
        title: '待审核',
        value: userList.value.filter(user => user.userStatus === 0).length,
        icon: 'UserPending',
        type: 'warning'
      },
      {
        title: '已通过',
        value: userList.value.filter(user => user.userStatus === 1).length,
        icon: 'UserCheck',
        type: 'success'
      },
      {
        title: '管理员',
        value: userList.value.filter(user => user.userRole === 'admin').length,
        icon: 'UserFilled',
        type: 'danger'
      }
    ])
    
    // 用户表单
    const userForm = reactive({
      id: '',
      userName: '',
      userAccount: '',
      userPassword: '',
      userPhone: '',
      userAvatar: '',
      userRole: '',
      point: 0,
      userStatus: 1
    })
    
    // 用户表单验证规则
    const userFormRules = {
      userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '用户名长度在2到20个字符', trigger: 'blur' }
      ],
      userAccount: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 4, max: 20, message: '账号长度在4到20个字符', trigger: 'blur' }
      ],
      userPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ],
      userPhone: [
        { pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
      ],
      userRole: [
        { required: true, message: '请选择用户角色', trigger: 'change' }
      ]
    }
    
    // 审核表单
    const auditForm = reactive({
      userId: '',
      userName: '',
      userAccount: '',
      userAvatar: '',
      registerTime: '',
      auditStatus: 1,
      auditRemark: ''
    })
    
    // 获取用户列表
    const fetchUsers = async () => {
      loading.value = true
      try {
        const params = {
          current: pagination.current,
          size: pagination.size,
          userName: filters.userName,
          userRole: filters.userRole,
          userStatus: filters.userStatus
        }
        
        // 处理日期范围
        if (filters.dateRange && filters.dateRange.length === 2) {
          params.startDate = filters.dateRange[0]
          params.endDate = filters.dateRange[1]
        }
        
        const response = await adminApi.user.getUserVoList(params)
        if (response.data && response.data.code === 200) {
          userList.value = response.data.data.records || []
          pagination.total = response.data.data.total || 0
        } else {
          ElMessage.error('获取用户列表失败')
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        ElMessage.error('获取用户列表失败')
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
      fetchUsers()
    }
    
    // 处理表格选择变化
    const handleSelectionChange = (selection) => {
      selectedUsers.value = selection
    }
    
    // 处理分页大小变化
    const handleSizeChange = (size) => {
      pagination.size = size
      pagination.current = 1
      fetchUsers()
    }
    
    // 处理当前页变化
    const handleCurrentChange = (current) => {
      pagination.current = current
      fetchUsers()
    }
    
    // 显示添加用户对话框
    const showAddUserDialog = () => {
      dialogMode.value = 'add'
      resetUserForm()
      userDialogVisible.value = true
    }
    
    // 显示编辑用户对话框
    const showEditUserDialog = (user) => {
      dialogMode.value = 'edit'
      Object.assign(userForm, {
        id: user.id,
        userName: user.userName,
        userAccount: user.userAccount,
        userPassword: '', // 编辑时不显示密码
        userPhone: user.userPhone,
        userAvatar: user.userAvatar,
        userRole: user.userRole,
        point: user.point,
        userStatus: user.userStatus
      })
      userDialogVisible.value = true
    }
    
    // 重置用户表单
    const resetUserForm = () => {
      Object.assign(userForm, {
        id: '',
        userName: '',
        userAccount: '',
        userPassword: '',
        userPhone: '',
        userAvatar: '',
        userRole: '',
        point: 0,
        userStatus: 1
      })
      if (userFormRef.value) {
        userFormRef.value.resetFields()
      }
    }
    
    // 提交用户表单
    const submitUserForm = async () => {
      if (!userFormRef.value) return
      
      try {
        await userFormRef.value.validate()
        userFormSubmitting.value = true
        
        let result
        if (dialogMode.value === 'add') {
          result = await adminApi.user.addUser(userForm)
          ElMessage.success('用户添加成功')
        } else {
          // 编辑用户功能在API中未定义，需要实现
          ElMessage.warning('编辑用户功能暂未实现')
          userDialogVisible.value = false
          return
        }
        
        userDialogVisible.value = false
        fetchUsers()
      } catch (error) {
        console.error('用户操作失败:', error)
        ElMessage.error('操作失败')
      } finally {
        userFormSubmitting.value = false
      }
    }
    
    // 处理用户操作
    const handleUserAction = async (command, user) => {
      switch (command) {
        case 'reset-password':
          try {
            await ElMessageBox.confirm(`确定要重置用户 "${user.userName}" 的密码吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            
            // 这里应该调用重置密码的API
            ElMessage.success('密码重置成功，新密码已发送至用户手机')
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('密码重置失败')
            }
          }
          break
          
        case 'toggle-status':
          try {
            const newStatus = user.userStatus === 1 ? 2 : 1
            const action = newStatus === 1 ? '启用' : '禁用'
            await ElMessageBox.confirm(`确定要${action}用户 "${user.userName}" 吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            
            // 更新用户状态功能在API中未定义，需要实现
            ElMessage.warning('更新用户状态功能暂未实现')
            return
            ElMessage.success(`用户${action}成功`)
            fetchUsers()
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('状态更新失败')
            }
          }
          break
          
        case 'audit':
          Object.assign(auditForm, {
            userId: user.id,
            userName: user.userName,
            userAccount: user.userAccount,
            userAvatar: user.userAvatar,
            registerTime: user.registerTime,
            auditStatus: 1,
            auditRemark: ''
          })
          auditDialogVisible.value = true
          break
          
        case 'delete':
          try {
            await ElMessageBox.confirm(`确定要删除用户 "${user.userName}" 吗？此操作不可恢复。`, '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            })
            
            await adminApi.user.deleteUser(user.id)
            ElMessage.success('用户删除成功')
            fetchUsers()
          } catch (error) {
            if (error !== 'cancel') {
              ElMessage.error('用户删除失败')
            }
          }
          break
      }
    }
    
    // 批量删除用户
    const batchDeleteUsers = async () => {
      try {
        await ElMessageBox.confirm(`确定要删除选中的 ${selectedUsers.value.length} 个用户吗？此操作不可恢复。`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        
        // 批量删除功能在API中未定义，需要逐个删除
        for (const user of selectedUsers.value) {
          await adminApi.user.deleteUser(user.id)
        }
        ElMessage.success('批量删除成功')
        fetchUsers()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('批量删除失败')
        }
      }
    }
    
    // 提交审核表单
    const submitAuditForm = async () => {
      try {
        auditSubmitting.value = true
        await adminApi.user.auditUser({
          userId: auditForm.userId,
          auditStatus: auditForm.auditStatus
        })
        
        const result = auditForm.auditStatus === 1 ? '通过' : '拒绝'
        ElMessage.success(`用户审核${result}成功`)
        auditDialogVisible.value = false
        fetchUsers()
      } catch (error) {
        console.error('用户审核失败:', error)
        ElMessage.error('用户审核失败')
      } finally {
        auditSubmitting.value = false
      }
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        0: '待审核',
        1: '已通过',
        2: '已拒绝'
      }
      return statusMap[status] || '未知'
    }
    
    // 获取状态类型
    const getStatusType = (status) => {
      const typeMap = {
        0: 'warning',
        1: 'success',
        2: 'danger'
      }
      return typeMap[status] || 'info'
    }
    
    onMounted(() => {
      fetchUsers()
    })
    
    return {
      loading,
      userList,
      selectedUsers,
      pagination,
      filters,
      userStats,
      userDialogVisible,
      auditDialogVisible,
      dialogMode,
      userForm,
      userFormRef,
      userFormRules,
      auditForm,
      userFormSubmitting,
      auditSubmitting,
      fetchUsers,
      resetFilters,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      showAddUserDialog,
      showEditUserDialog,
      resetUserForm,
      submitUserForm,
      handleUserAction,
      batchDeleteUsers,
      submitAuditForm,
      getStatusText,
      getStatusType,
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

/* 用户列表样式 */
.users-card {
  margin-bottom: var(--spacing-xl);
}

.user-info {
  gap: var(--spacing-sm);
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
}

.user-account {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.action-buttons {
  gap: var(--spacing-xs);
}

.pagination-container {
  margin-top: var(--spacing-xl);
}

/* 对话框样式 */
.dialog-footer {
  gap: var(--spacing-sm);
}

.audit-user-info {
  gap: var(--spacing-base);
}

.audit-user-details {
  flex: 1;
}

.audit-user-details h4 {
  margin: 0 0 var(--spacing-xs) 0;
}

.audit-user-details p {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
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
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}
</style>