<template>
  <AuthForm
    :form="loginForm"
    :rules="loginRules"
    :loading="loading"
    submit-button-text="登录"
    footer-text="还没有账号？"
    footer-link-text="立即注册"
    footer-link-path="/register"
    @submit="handleLogin"
    @footer-click="navigateTo"
  >
    <template #form-fields>
      <el-form-item label="账号" prop="userAccount">
        <el-input
          v-model="loginForm.userAccount"
          placeholder="请输入您的账号"
          prefix-icon="User"
          size="large"
        />
      </el-form-item>
      
      <el-form-item label="密码" prop="userPassword">
        <el-input
          v-model="loginForm.userPassword"
          type="password"
          placeholder="请输入您的密码"
          prefix-icon="Lock"
          size="large"
          show-password
        />
      </el-form-item>
    </template>
  </AuthForm>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import AuthForm from '@/components/AuthForm.vue'

export default {
  name: 'Login',
  components: {
    AuthForm
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const loading = ref(false)
    
    const loginForm = reactive({
      userAccount: '',
      userPassword: ''
    })
    
    const loginRules = {
      userAccount: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 4, max: 20, message: '账号长度应在 4 到 20 个字符', trigger: 'blur' }
      ],
      userPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应在 6 到 20 个字符', trigger: 'blur' }
      ]
    }
    
    const handleLogin = async () => {
      loading.value = true
      try {
        await store.dispatch('login', loginForm)
        ElMessage.success('登录成功')
        
        // 获取重定向路径
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
    
    const navigateTo = (path) => {
      router.push(path)
    }
    
    return {
      loginForm,
      loginRules,
      loading,
      handleLogin,
      navigateTo
    }
  }
}
</script>