<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="login-title">用户登录</h2>
      </template>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        label-width="80px"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="账号" prop="userAccount">
          <el-input
            v-model="loginForm.userAccount"
            placeholder="请输入账号"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input
            v-model="loginForm.userPassword"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <span>还没有账号？</span>
        <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const loginFormRef = ref(null)
    const loading = ref(false)
    
    const loginForm = reactive({
      userAccount: '',
      userPassword: ''
    })
    
    const loginRules = {
      userAccount: [
        { required: true, message: '请输入账号', trigger: 'blur' }
      ],
      userPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ]
    }
    
    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      try {
        await loginFormRef.value.validate()
        loading.value = true
        
        const result = await store.dispatch('login', loginForm)
        
        if (result.success) {
          ElMessage.success('登录成功')
          // 重定向到原本要访问的页面或首页
          const redirectPath = route.query.redirect || '/'
          router.push(redirectPath)
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    return {
      loginForm,
      loginRules,
      loginFormRef,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin: 0;
  color: #409EFF;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  color: #606266;
}
</style>