<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2 class="register-title">用户注册</h2>
      </template>
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerFormRef"
        label-width="80px"
        @submit.prevent="handleRegister"
      >
        <el-form-item label="账号" prop="userAccount">
          <el-input
            v-model="registerForm.userAccount"
            placeholder="请输入账号"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input
            v-model="registerForm.userPassword"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item label="昵称" prop="userName">
          <el-input
            v-model="registerForm.userName"
            placeholder="请输入昵称"
            prefix-icon="UserFilled"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input
            v-model="registerForm.userPhone"
            placeholder="请输入手机号"
            prefix-icon="Phone"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="register-footer">
        <span>已有账号？</span>
        <el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Register',
  setup() {
    const store = useStore()
    const router = useRouter()
    const registerFormRef = ref(null)
    const loading = ref(false)
    
    const registerForm = reactive({
      userAccount: '',
      userPassword: '',
      confirmPassword: '',
      userName: '',
      userPhone: ''
    })
    
    // 自定义验证规则：确认密码
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
        { min: 3, max: 20, message: '账号长度在3到20个字符', trigger: 'blur' }
      ],
      userPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
      ],
      userName: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 20, message: '昵称长度在2到20个字符', trigger: 'blur' }
      ],
      userPhone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
      ]
    }
    
    const handleRegister = async () => {
      if (!registerFormRef.value) return
      
      try {
        await registerFormRef.value.validate()
        loading.value = true
        
        // 移除确认密码字段
        const { confirmPassword, ...userData } = registerForm
        
        const result = await store.dispatch('register', userData)
        
        if (result.success) {
          ElMessage.success('注册成功，请登录')
          router.push('/login')
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        console.error('注册失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    return {
      registerForm,
      registerRules,
      registerFormRef,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 450px;
}

.register-title {
  text-align: center;
  margin: 0;
  color: #409EFF;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  color: #606266;
}
</style>