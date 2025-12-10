<template>
  <el-container>
    <!-- 固定顶部导航栏 -->
    <el-header class="fixed-header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">校园跳蚤市场</router-link>
        </div>
        
        <!-- 产品分类导航 -->
        <div class="nav-menu">
          <el-menu mode="horizontal" :router="true" :default-active="$route.path" class="category-nav">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/products">二手物品</el-menu-item>
            <el-menu-item index="/cart" v-if="isLoggedIn">购物车</el-menu-item>
            <el-menu-item index="/news">新闻公告</el-menu-item>
            <el-menu-item index="/admin" v-if="isAdmin">管理后台</el-menu-item>
          </el-menu>
        </div>
        
        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索二手物品"
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch" icon="Search" />
            </template>
          </el-input>
        </div>
        
        <!-- 用户操作区 -->
        <div class="user-actions">
          <template v-if="isLoggedIn">
            <el-dropdown @command="handleCommand" class="user-dropdown">
              <span class="user-info">
                <el-avatar :size="32" :src="user?.userAvatar" v-if="user?.userAvatar" />
                <el-avatar :size="32" v-else>{{ user?.userName?.charAt(0) || '?' }}</el-avatar>
                <span class="username">{{ user?.userName || '未知用户' }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="my-products">我的二手物品</el-dropdown-item>
                  <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="$router.push('/login')" class="login-btn">登录</el-button>
            <el-button @click="$router.push('/register')" class="register-btn">注册</el-button>
          </template>
        </div>
      </div>
    </el-header>
    
    <!-- 主要内容区域 -->
    <el-main class="main-content">
      <div class="page-container">
        <slot />
      </div>
    </el-main>
    
    <!-- 页脚 -->
    <el-footer class="site-footer">
      <div class="footer-content">
        <p>© 2025 校园跳蚤市场 - 让闲置物品重新焕发价值</p>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ArrowDown, Search, Operation } from '@element-plus/icons-vue'

export default {
  name: 'Layout',
  components: {
    ArrowDown,
    Search,
    Operation
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const searchKeyword = ref('')
    
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    const user = computed(() => store.state.user)
    const isAdmin = computed(() => store.getters.isAdmin)
    
    const handleSearch = () => {
      if (searchKeyword.value.trim()) {
        router.push({
          name: 'ProductList',
          query: { keyword: searchKeyword.value.trim() }
        })
      }
    }
    
    const handleCommand = (command) => {
      switch (command) {
        case 'profile':
          router.push('/profile')
          break
        case 'my-products':
          router.push('/my-products')
          break
        case 'orders':
          router.push('/orders')
          break
        case 'publish':
          router.push('/publish-product')
          break
        case 'admin':
          router.push('/admin')
          break
        case 'logout':
          store.dispatch('logout')
          router.push('/')
          break
      }
    }
    
    return {
      searchKeyword,
      isLoggedIn,
      user,
      isAdmin,
      handleSearch,
      handleCommand
    }
  }
}
</script>

<style scoped>
.el-container {
  min-height: 100vh;
}

/* 固定顶部导航栏 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 60px;
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-right: 40px;
}

.logo a {
  color: #409EFF;
  text-decoration: none;
  transition: color 0.3s;
}

.logo a:hover {
  color: #337ecc;
}

/* 导航菜单样式 */
.nav-menu {
  flex: 1;
  margin-right: 30px;
}

.category-nav {
  border-bottom: none;
  background: transparent;
}

.category-nav .el-menu-item,
.category-nav .el-sub-menu__title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-regular);
  transition: color var(--transition-base);
}

.category-nav .el-menu-item:hover,
.category-nav .el-sub-menu__title:hover {
  color: var(--primary-color);
  background: transparent;
}

.category-nav .el-menu-item.is-active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}
/* 搜索栏样式 */
.search-bar {
  max-width: 300px;
  margin-right: var(--spacing-xl);
}

.search-input {
  border-radius: var(--border-radius-round);
}

/* 用户操作区样式 */
.user-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-round);
  transition: background-color var(--transition-base);
}

.user-info:hover {
  background-color: var(--bg-light);
}

.username {
  margin: 0 var(--spacing-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.login-btn,
.register-btn {
  border-radius: var(--border-radius-round);
  padding: var(--spacing-sm) var(--spacing-base);
  font-weight: 500;
}

/* 主要内容区域 */
.main-content {
  margin-top: 60px; /* 为固定导航栏留出空间 */
  background-color: var(--bg-light);
  padding: 0;
  min-height: calc(100vh - 120px);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* 页脚样式 */
.site-footer {
  background-color: var(--bg-white);
  padding: var(--spacing-xl) 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  border-top: 1px solid var(--border-lighter);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 15px;
    flex-wrap: wrap;
    height: auto;
    min-height: 60px;
  }
  
  .logo {
    font-size: 20px;
    margin-right: 20px;
    order: 1;
  }
  
  .nav-menu {
    order: 3;
    width: 100%;
    margin-right: 0;
    margin-top: 10px;
  }
  
  .search-bar {
    order: 2;
    max-width: 200px;
    margin-right: 15px;
    flex: 1;
  }
  
  .user-actions {
    order: 4;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e4e7ed;
  }
  
  .category-nav {
    justify-content: center;
  }
  
  .category-nav .el-menu-item,
  .category-nav .el-sub-menu__title {
    font-size: 14px;
    padding: 0 12px;
  }
  
  .main-content {
    margin-top: 100px; /* 移动端导航栏更高 */
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 10px;
  }
  
  .logo {
    font-size: 18px;
  }
  
  .search-bar {
    max-width: 150px;
  }
  
  .category-nav .el-menu-item,
  .category-nav .el-sub-menu__title {
    font-size: 12px;
    padding: 0 8px;
  }
  
  .login-btn,
  .register-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>

<style>
/* 分类下拉菜单样式 */
.category-popover {
  min-width: 160px;
}

.category-popover .el-menu-item {
  font-size: 14px;
  padding: 8px 20px;
}

.category-popover .el-menu-item:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}
</style>