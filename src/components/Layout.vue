<template>
  <el-container>
    <el-header>
      <div class="header-content">
        <div class="logo">
          <router-link to="/">校园跳蚤市场</router-link>
        </div>
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品"
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch" icon="Search" />
            </template>
          </el-input>
        </div>
        <div class="nav-menu">
          <el-menu mode="horizontal" :router="true" :default-active="$route.path">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/products">商品列表</el-menu-item>
            <el-menu-item index="/news">新闻公告</el-menu-item>
          </el-menu>
        </div>
        <div class="user-actions">
          <template v-if="isLoggedIn">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="32" :src="user?.userAvatar" v-if="user?.userAvatar" />
                <el-avatar :size="32" v-else>{{ user?.userName?.charAt(0) || '?' }}</el-avatar>
                <span class="username">{{ user?.userName || '加载中...' }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="my-products">我的商品</el-dropdown-item>
                  <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                  <el-dropdown-item command="publish">发布商品</el-dropdown-item>
                  <el-dropdown-item v-if="isAdmin" command="admin">管理后台</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="$router.push('/login')">登录</el-button>
            <el-button @click="$router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="page-container">
        <slot />
      </div>
    </el-main>
    <el-footer>
      <div class="footer-content">
        <p>© 2025 校园跳蚤市场</p>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ArrowDown, Search } from '@element-plus/icons-vue'

export default {
  name: 'Layout',
  components: {
    ArrowDown,
    Search
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

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
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
  margin-right: 30px;
}

.logo a {
  color: #409EFF;
  text-decoration: none;
}

.search-bar {
  flex: 1;
  max-width: 400px;
  margin-right: 30px;
}

.nav-menu {
  margin-right: 20px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px;
}

.el-main {
  background-color: #f5f7fa;
  padding: 0;
}

.el-footer {
  background-color: #f5f7fa;
  padding: 20px 0;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>