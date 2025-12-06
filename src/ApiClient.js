/**
 * 毕业设计跳蚤市场 - API客户端
 * 基于axios的现代化API客户端
 */

import axios from "axios";

/**
 * API客户端类
 * 管理所有API请求的配置和发送
 */
class ApiClient {
    /**
     * 构造函数
     * @param {String} basePath 基础路径，默认为http://localhost:8080
     */
    constructor(basePath = '/api') {
        this.basePath = basePath.replace(/\/+$/, '');
        
        // 创建axios实例
        this.instance = axios.create({
            baseURL: this.basePath,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        // 请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                // 添加认证token
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response) => {
                return response.data;
            },
            (error) => {
                console.error('API请求错误:', error);
                return Promise.reject(error);
            }
        );
    }

    /**
     * 发送GET请求
     * @param {String} url 请求URL
     * @param {Object} params 查询参数
     * @returns {Promise} Promise对象
     */
    get(url, params = {}) {
        return this.instance.get(url, { params });
    }

    /**
     * 发送POST请求
     * @param {String} url 请求URL
     * @param {Object} data 请求数据
     * @returns {Promise} Promise对象
     */
    post(url, data = {}) {
        return this.instance.post(url, data);
    }

    /**
     * 发送PUT请求
     * @param {String} url 请求URL
     * @param {Object} data 请求数据
     * @returns {Promise} Promise对象
     */
    put(url, data = {}) {
        return this.instance.put(url, data);
    }

    /**
     * 发送DELETE请求
     * @param {String} url 请求URL
     * @returns {Promise} Promise对象
     */
    delete(url) {
        return this.instance.delete(url);
    }

    /**
     * 发送PATCH请求
     * @param {String} url 请求URL
     * @param {Object} data 请求数据
     * @returns {Promise} Promise对象
     */
    patch(url, data = {}) {
        return this.instance.patch(url, data);
    }

    /**
     * 设置认证token
     * @param {String} token 认证token
     */
    setAuthToken(token) {
        if (token) {
            this.instance.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
            delete this.instance.defaults.headers.Authorization;
        }
    }

    /**
     * 移除认证token
     */
    removeAuthToken() {
        delete this.instance.defaults.headers.Authorization;
    }
}

// 创建默认的API客户端实例
const apiClient = new ApiClient();

// 导出默认实例和类
export default apiClient;
export { ApiClient };