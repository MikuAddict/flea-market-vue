<template>
  <AuthForm
    :form="registerForm"
    :rules="registerRules"
    :loading="loading"
    subtitle="创建账号，加入二手交易社区"
    submit-button-text="注册"
    footer-text="已有账号？"
    footer-link-text="立即登录"
    footer-link-path="/login"
    @submit="handleRegister"
    @footer-click="navigateTo"
  >
    <template #form-fields>
      <el-form-item label="账号" prop="userAccount">
        <el-input
          v-model="registerForm.userAccount"
          placeholder="请输入您的账号"
          prefix-icon="User"
          size="large"
        />
      </el-form-item>
      
      <el-form-item label="密码" prop="userPassword">
        <el-input
          v-model="registerForm.userPassword"
          type="password"
          placeholder="请输入您的密码"
          prefix-icon="Lock"
          size="large"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="请再次输入您的密码"
          prefix-icon="Lock"
          size="large"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="昵称" prop="userName">
        <el-input
          v-model="registerForm.userName"
          placeholder="请输入您的昵称"
          prefix-icon="UserFilled"
          size="large"
        />
      </el-form-item>
      
      <el-form-item label="手机号" prop="userPhone">
        <el-input
          v-model="registerForm.userPhone"
          placeholder="请输入您的手机号"
          prefix-icon="Phone"
          size="large"
        />
      </el-form-item>
    </template>
  </AuthForm>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AuthForm from '@/components/AuthForm.vue'

export default {
  name: 'Register',
  components: {
    AuthForm
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    
    const registerForm = reactive({
      userAccount: '',
      userPassword: '',
      confirmPassword: '',
      userName: '',
      userPhone: ''
    })
    
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== registerForm.userPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    
    const registerRules = {
      userAccount: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 4, max: 20, message: '账号长度应在 4 到 20 个字符', trigger: 'blur' }
      ],
      userPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应在 6 到 20 个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
      ],
      userName: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 20, message: '昵称长度应在 2 到 20 个字符', trigger: 'blur' }
      ],
      userPhone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    }
    
    const handleRegister = async () => {
      loading.value = true
      try {
        const { confirmPassword, ...registerData } = registerForm
        await store.dispatch('register', registerData)
        ElMessage.success('注册成功')
        router.push('/login')
      } catch (error) {
        ElMessage.error(error.message || '注册失败')
      } finally {
        loading.value = false
      }
    }
    
    const navigateTo = (path) => {
      router.push(path)
    }
    
    return {
      registerForm,
      registerRules,
      loading,
      handleRegister,
      navigateTo
    }
  }
}
</script>