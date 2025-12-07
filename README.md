# 跳蚤市场 Vue 项目

这是一个基于 Vue 3 + Element Plus 开发的跳蚤市场平台前端项目，提供完整的二手物品交易功能。

## 项目特性

- 使用 Vue 3 + Vite 开发
- 采用 Element Plus 组件库
- 完整的用户认证系统
- 商品浏览、搜索、发布和管理功能
- 订单管理和交易系统
- 新闻公告模块
- 管理员后台
- 响应式设计，适配不同设备

## 技术栈

- Vue 3
- Vue Router 4
- Vuex 4
- Element Plus
- Axios
- Day.js

## 功能模块

### 用户模块
- 用户注册和登录
- 个人信息管理
- 用户状态管理

### 商品模块
- 商品浏览和搜索
- 商品发布和编辑
- 商品状态管理
- 商品分类

### 订单模块
- 订单创建和管理
- 支付方式支持
- 订单状态跟踪

### 新闻模块
- 新闻公告浏览
- 新闻详情查看

### 管理员模块
- 数据统计
- 用户管理
- 商品管理
- 订单管理
- 新闻管理

## 安装和运行

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 构建生产版本
```bash
npm run build
```

## API 接口

本项目对接后端 API 接口，基础 URL 为 `http://localhost:7023`，通过 Vite 代理配置实现跨域请求。

详细 API 文档请参考 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 项目结构

```
src/
├── api/            # API 请求模块
├── assets/         # 静态资源
├── components/     # 公共组件
├── router/         # 路由配置
├── store/          # Vuex 状态管理
├── utils/          # 工具函数
├── views/          # 页面组件
│   ├── admin/      # 管理员页面
│   └── ...
├── App.vue         # 根组件
└── main.js         # 入口文件
```

## 开发注意事项

1. 所有 API 请求都通过 `/api` 前缀，由 Vite 代理到后端服务器
2. 用户状态通过 Vuex 管理，包括登录状态和用户信息
3. 路由守卫实现了权限控制，需要登录和管理员权限的页面会进行拦截
4. 响应式设计使用 Element Plus 的栅格系统实现

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License