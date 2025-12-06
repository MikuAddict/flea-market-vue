/**
 * 毕业设计跳蚤市场 - API服务
 * 基于axios的简化API服务
 */

import apiClient from '../ApiClient.js';

/**
 * 默认API服务类
 * 提供所有业务相关的API接口
 */
class DefaultApi {
    /**
     * 用户登录
     * @param {Object} loginRequest 登录请求数据
     * @returns {Promise} Promise对象
     */
    userLogin(loginRequest) {
        return apiClient.post('/user/login', loginRequest);
    }

    /**
     * 用户注册
     * @param {Object} registerRequest 注册请求数据
     * @returns {Promise} Promise对象
     */
    userRegister(registerRequest) {
        return apiClient.post('/user/register', registerRequest);
    }

    /**
     * 获取当前用户信息
     * @returns {Promise} Promise对象
     */
    getCurrentUser() {
        return apiClient.get('/user/current');
    }

    /**
     * 更新用户信息
     * @param {Object} updateRequest 更新请求数据
     * @returns {Promise} Promise对象
     */
    updateUser(updateRequest) {
        return apiClient.put('/user/update', updateRequest);
    }

    /**
     * 获取商品列表
     * @param {Object} params 查询参数
     * @returns {Promise} Promise对象
     */
    getProducts(params = {}) {
        return apiClient.get('/product/list', params);
    }

    /**
     * 获取商品详情
     * @param {Number} productId 商品ID
     * @returns {Promise} Promise对象
     */
    getProductDetail(productId) {
        return apiClient.get(`/product/${productId}`);
    }

    /**
     * 发布商品
     * @param {Object} productRequest 商品请求数据
     * @returns {Promise} Promise对象
     */
    addProduct(productRequest) {
        return apiClient.post('/product/add', productRequest);
    }

    /**
     * 更新商品信息
     * @param {Number} productId 商品ID
     * @param {Object} updateRequest 更新请求数据
     * @returns {Promise} Promise对象
     */
    updateProduct(productId, updateRequest) {
        return apiClient.put(`/product/${productId}`, updateRequest);
    }

    /**
     * 删除商品
     * @param {Number} productId 商品ID
     * @returns {Promise} Promise对象
     */
    deleteProduct(productId) {
        return apiClient.delete(`/product/${productId}`);
    }

    /**
     * 获取订单列表
     * @param {Object} params 查询参数
     * @returns {Promise} Promise对象
     */
    getOrders(params = {}) {
        return apiClient.get('/order/list', params);
    }

    /**
     * 创建订单
     * @param {Object} orderRequest 订单请求数据
     * @returns {Promise} Promise对象
     */
    createOrder(orderRequest) {
        return apiClient.post('/order/create', orderRequest);
    }

    /**
     * 确认订单
     * @param {Number} orderId 订单ID
     * @param {Object} confirmRequest 确认请求数据
     * @returns {Promise} Promise对象
     */
    confirmOrder(orderId, confirmRequest) {
        return apiClient.post(`/order/${orderId}/confirm`, confirmRequest);
    }

    /**
     * 取消订单
     * @param {Number} orderId 订单ID
     * @returns {Promise} Promise对象
     */
    cancelOrder(orderId) {
        return apiClient.post(`/order/${orderId}/cancel`);
    }

    /**
     * 获取分类列表
     * @returns {Promise} Promise对象
     */
    getCategories() {
        return apiClient.get('/category/list');
    }

    /**
     * 搜索商品
     * @param {String} keyword 搜索关键词
     * @param {Object} params 其他查询参数
     * @returns {Promise} Promise对象
     */
    searchProducts(keyword, params = {}) {
        return apiClient.get('/product/search', { keyword, ...params });
    }

    /**
     * 获取热门商品
     * @returns {Promise} Promise对象
     */
    getHotProducts() {
        return apiClient.get('/product/hot');
    }

    /**
     * 获取最新动态
     * @returns {Promise} Promise对象
     */
    getNews() {
        return apiClient.get('/news/list');
    }

    /**
     * 获取统计信息
     * @returns {Promise} Promise对象
     */
    getStatistics() {
        return apiClient.get('/statistics');
    }
}

// 创建默认的API服务实例
const defaultApi = new DefaultApi();

// 导出默认实例和类
export default defaultApi;
export { DefaultApi };