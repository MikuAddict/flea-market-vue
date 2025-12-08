import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入统一样式
import '@/assets/css/unified-styles.css'

// 应用初始化时尝试获取当前用户信息
// 检查是否有token（包括localStorage中的）
const token = store.state.token || localStorage.getItem('token');
if (token) {
  store.dispatch('getCurrentUser')
} else {
  // 确保用户状态被清除
  store.commit('CLEAR_USER')
}

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
app.use(router)
app.use(ElementPlus)

app.mount('#app')