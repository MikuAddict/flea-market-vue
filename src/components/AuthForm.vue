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
          <div class="unified-flex unified-flex-center unified-gap-sm">
            <el-icon size="40" color="var(--primary-color)"><Shop /></el-icon>
            <h1 class="site-title">校园跳蚤市场</h1>
          </div>
        </div>
        
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-position="top"
          class="unified-form auth-form"
          @submit.prevent="handleSubmit"
        >
          <slot name="form-fields"></slot>
          
          <el-form-item class="unified-form-item">
            <el-button
              type="primary"
              :loading="loading"
              class="unified-button unified-button-primary submit-btn unified-w-full"
              size="large"
              @click="handleSubmit"
            >
              {{ submitButtonText }}
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="unified-flex unified-flex-center unified-gap-sm auth-footer">
          <span class="unified-text-secondary">{{ footerText }}</span>
          <el-link type="primary" @click="handleFooterClick">{{ footerLinkText }}</el-link>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Shop } from '@element-plus/icons-vue'

export default {
  name: 'AuthForm',
  components: {
    Shop
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    rules: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    subtitle: {
      type: String,
      default: ''
    },
    submitButtonText: {
      type: String,
      required: true
    },
    footerText: {
      type: String,
      required: true
    },
    footerLinkText: {
      type: String,
      required: true
    },
    footerLinkPath: {
      type: String,
      required: true
    }
  },
  emits: ['submit', 'footer-click'],
  setup(props, { emit }) {
    const formRef = ref(null)
    
    const handleSubmit = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        emit('submit')
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
    
    const handleFooterClick = () => {
      emit('footer-click', props.footerLinkPath)
    }
    
    return {
      formRef,
      handleSubmit,
      handleFooterClick
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background-color: var(--primary-color);
  top: 10%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background-color: #67c23a;
  bottom: 15%;
  right: 15%;
  animation: float 8s ease-in-out infinite 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background-color: #e6a23c;
  top: 60%;
  left: 50%;
  animation: float 7s ease-in-out infinite 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.auth-card-container {
  width: 100%;
  max-width: 450px;
  padding: var(--spacing-base);
  z-index: 1;
}

.auth-card {
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-hover);
}

.auth-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.logo {
  margin-bottom: var(--spacing-base);
}

.logo h1 {
  margin: 0 0 0 var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.auth-subtitle {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.auth-form {
  margin-bottom: var(--spacing-lg);
}

.submit-btn {
  width: 100%;
  padding: var(--spacing-base) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-medium);
}

.auth-footer {
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-sm);
}

/* 表单字段间距调整 */
.auth-form :deep(.el-form-item) {
  margin-bottom: var(--spacing-lg);
}

.auth-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .auth-card-container {
    padding: var(--spacing-sm);
  }
  
  .auth-card {
    padding: var(--spacing-lg);
  }
  
  .shape-1 {
    width: 200px;
    height: 200px;
  }
  
  .shape-2 {
    width: 150px;
    height: 150px;
  }
  
  .shape-3 {
    width: 100px;
    height: 100px;
  }
}
</style>