<template>
  <div class="auth-container fade-in">
    <div class="auth-background">
      <div class="auth-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
    
    <div class="auth-card-container">
      <el-card class="unified-card auth-card">
        <div class="auth-header unified-flex unified-flex-center">
          <div class="logo unified-flex unified-flex-center">
            <el-icon size="40" color="var(--primary-color)"><Shop /></el-icon>
            <h1 class="site-title">校园跳蚤市场</h1>
          </div>
          <p class="auth-subtitle unified-text-secondary">创建账号，加入二手交易社区</p>
        </div>
        
        <el-form
          :model="registerForm"
          :rules="registerRules"
          ref="registerFormRef"
          label-position="top"
          class="auth-form"
          @submit.prevent="handleRegister"
        >
          <el-form-item label="账号" prop="userAccount">
            <el-input
              v-model="registerForm.userAccount"
              placeholder="请输入您的账号"
              class="unified-input"
              prefix-icon="User"
              size="large"
            />
          </el-form-item>
          
          <el-form-item label="密码" prop="userPassword">
            <el-input
              v-model="registerForm.userPassword"
              type="password"
              placeholder="请输入您的密码"
              class="unified-input"
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
              class="unified-input"
              prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          
          <el-form-item label="昵称" prop="userName">
            <el-input
              v-model="registerForm.userName"
              placeholder="请输入您的昵称"
              class="unified-input"
              prefix-icon="UserFilled"
              size="large"
            />
          </el-form-item>
          
          <el-form-item label="手机号" prop="userPhone">
            <el-input
              v-model="registerForm.userPhone"
              placeholder="请输入您的手机号"
              class="unified-input"
              prefix-icon="Phone"
              size="large"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="unified-button unified-button-primary register-btn"
              size="large"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="auth-footer unified-flex unified-flex-center">
          <span class="unified-text-secondary">已有账号？</span>
          <el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
        </div>
        
        <div class="auth-divider">
          <el-divider>
            <span class="divider-text unified-text-secondary">其他注册方式</span>
          </el-divider>
        </div>
        
        <div class="social-login unified-flex unified-flex-center">
          <div class="social-icon unified-flex unified-flex-center">
            <el-icon><Phone /></el-icon>
          </div>
          <div class="social-icon unified-flex unified-flex-center">
            <el-icon><Message /></el-icon>
          </div>
          <div class="social-icon unified-flex unified-flex-center">
            <el-icon><ChatLineSquare /></el-icon>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Shop, Phone, Message, ChatLineSquare } from '@element-plus/icons-vue'

export default {
  name: 'Register',
  components: {
    Shop,
    Phone,
    Message,
    ChatLineSquare
  },
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
/* 认证页面容器 */
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--bg-light) 0%, var(--bg-white) 100%);
  z-index: -1;
}

.auth-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.shape-1 {
  top: 10%;
  left: 10%;
  width: 200px;
  height: 200px;
  background-color: var(--primary-color);
}

.shape-2 {
  top: 60%;
  right: 10%;
  width: 300px;
  height: 300px;
  background-color: var(--success-color);
}

.shape-3 {
  bottom: 10%;
  left: 30%;
  width: 150px;
  height: 150px;
  background-color: var(--warning-color);
}

/* 认证卡片容器 */
.auth-card-container {
  width: 100%;
  max-width: 450px;
  padding: var(--spacing-xl);
}

.auth-card {
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-hover);
  border-radius: var(--border-radius-base);
}

/* 认证头部 */
.auth-header {
  margin-bottom: var(--spacing-xl);
}

.logo {
  margin-bottom: var(--spacing-base);
}

.site-title {
  margin: 0 0 0 var(--spacing-sm);
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  font-weight: 600;
}

.auth-subtitle {
  margin: 0;
  font-size: var(--font-size-base);
}

/* 认证表单 */
.auth-form {
  margin-bottom: var(--spacing-lg);
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: var(--font-size-base);
  font-weight: 500;
  border-radius: var(--border-radius-round);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
}

/* 认证页脚 */
.auth-footer {
  margin-bottom: var(--spacing-lg);
}

/* 社交登录 */
.auth-divider {
  margin-bottom: var(--spacing-lg);
}

.divider-text {
  font-size: var(--font-size-sm);
}

.social-login {
  gap: var(--spacing-lg);
}

.social-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--bg-lighter);
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
}

.social-icon:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-base);
}

/* Element Plus 组件覆盖样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--text-regular);
  padding-bottom: var(--spacing-xs);
}

:deep(.el-input__wrapper) {
  border-radius: var(--border-radius-base);
  height: 48px;
  box-shadow: var(--shadow-light);
  transition: all var(--transition-base);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: var(--shadow-base);
}

:deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

:deep(.el-checkbox__label) {
  color: var(--text-regular);
  font-size: var(--font-size-sm);
}

:deep(.el-divider__text) {
  background-color: var(--bg-white);
  padding: 0 var(--spacing-base);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-card-container {
    padding: var(--spacing-base);
  }
  
  .auth-card {
    padding: var(--spacing-lg);
  }
  
  .shape-1 {
    width: 150px;
    height: 150px;
  }
  
  .shape-2 {
    width: 200px;
    height: 200px;
  }
  
  .shape-3 {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .auth-card-container {
    padding: var(--spacing-sm);
  }
  
  .auth-card {
    padding: var(--spacing-base);
  }
  
  .site-title {
    font-size: var(--font-size-lg);
  }
}
</style>