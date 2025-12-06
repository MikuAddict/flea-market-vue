<template>
  <div id="app">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-content">
          <div class="logo">
            <h1>跳蚤市场</h1>
          </div>
          <el-menu 
            mode="horizontal" 
            :default-active="activeIndex" 
            @select="handleSelect"
            class="nav-menu"
          >
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">商品</el-menu-item>
            <el-menu-item index="3">发布</el-menu-item>
            <el-menu-item index="4">我的</el-menu-item>
          </el-menu>
          <div class="user-info">
            <el-button v-if="!userInfo" type="primary" @click="showLoginDialog = true">登录</el-button>
            <div v-else class="user-panel">
              <el-dropdown>
                <span class="el-dropdown-link">
                  {{ userInfo.userName }}
                  <el-icon><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>

    <!-- 登录对话框 -->
    <el-dialog v-model="showLoginDialog" title="用户登录" width="400px">
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item label="用户名" prop="userAccount">
          <el-input v-model="loginForm.userAccount" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="loginForm.userPassword" type="password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showLoginDialog = false">取消</el-button>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from './stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeIndex = ref('1')
const showLoginDialog = ref(false)
const loginFormRef = ref()

const loginForm = ref({
  userAccount: '',
  userPassword: ''
})

const loginRules = {
  userAccount: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const userInfo = ref(null)

onMounted(() => {
  // 检查本地是否有用户信息
  const savedUser = localStorage.getItem('userInfo')
  if (savedUser) {
    userInfo.value = JSON.parse(savedUser)
    userStore.setUser(userInfo.value)
  }
})

const handleSelect = (key) => {
  const routes = {
    '1': '/',
    '2': '/products',
    '3': '/publish',
    '4': '/profile'
  }
  if (routes[key]) {
    router.push(routes[key])
  }
}

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    
    // 调用登录API
    const response = await userStore.login(loginForm.value)
    
    if (response.code === 200) {
      userInfo.value = response.data
      localStorage.setItem('userInfo', JSON.stringify(response.data))
      showLoginDialog.value = false
      ElMessage.success('登录成功')
    } else {
      ElMessage.error(response.message || '登录失败')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查用户名和密码')
  }
}

const logout = () => {
  userStore.logout()
  userInfo.value = null
  localStorage.removeItem('userInfo')
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.header {
  background-color: #409eff;
  color: white;
  padding: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
}

.logo h1 {
  margin: 0;
  color: white;
}

.nav-menu {
  background-color: transparent;
  border: none;
}

.nav-menu .el-menu-item {
  color: white !important;
}

.nav-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.nav-menu .el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-panel {
  color: white;
}

.el-dropdown-link {
  color: white;
  cursor: pointer;
}
</style>