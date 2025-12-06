import { defineStore } from 'pinia'
import defaultApi from '../api/DefaultApi'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: null
  }),

  actions: {
    async login(loginData) {
      try {
        const response = await defaultApi.userLogin(loginData)
        if (response.code === 200) {
          this.userInfo = response.data
          this.token = response.data.token
          return response
        }
        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async register(registerData) {
      try {
        const response = await defaultApi.userRegister(registerData)
        return response
      } catch (error) {
        console.error('Register error:', error)
        throw error
      }
    },

    logout() {
      this.userInfo = null
      this.token = null
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
    },

    setUser(userInfo) {
      this.userInfo = userInfo
      this.token = userInfo.token
    }
  }
})