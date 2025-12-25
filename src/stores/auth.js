import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import session from '../api/session'
import upload from '../api/uploadFile'
import { Constant } from '../common/constant'

const TOKEN_NAME = Constant.TOKEN_NAME
const APP_USR = Constant.APP_USR
const STAFF_MENU = Constant.STAFF_MENU

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: (() => {
      const userCookie = Cookies.get(APP_USR)
      if (!userCookie) return null
      try {
        return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie
      } catch (e) {
        console.warn('Failed to parse user cookie:', e)
        return null
      }
    })(),
    token: Cookies.get(TOKEN_NAME) || null,
    menu: (() => {
      const menuData = localStorage.getItem(STAFF_MENU)
      if (!menuData) return null
      try {
        return JSON.parse(menuData)
      } catch (e) {
        console.warn('Failed to parse menu data:', e)
        return null
      }
    })(),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getMenu: (state) => state.menu,
  },

  actions: {
    updateUser(user) {
      const userString = typeof user === 'string' ? user : JSON.stringify(user)
      Cookies.set(APP_USR, userString, { expires: 365 })
      this.user = typeof user === 'string' ? JSON.parse(user) : user
    },

    updateToken(token) {
      Cookies.set(TOKEN_NAME, token, { expires: 365 })
      session.defaults.headers['token'] = `${token}`
      upload.defaults.headers['token'] = `${token}`
      this.token = token
    },

    updateMenu(menu) {
      localStorage.setItem(STAFF_MENU, JSON.stringify(menu))
      this.menu = menu
    },

    removeToken() {
      // Removes token
      Cookies.remove(TOKEN_NAME)
      this.token = null

      // Removes user
      Cookies.remove(APP_USR)
      this.user = null

      // Remove menu
      localStorage.removeItem(STAFF_MENU)
      this.menu = null
    },

    logout() {
      this.removeToken()
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
        paths: ['user', 'token', 'menu']
      }
    ]
  }
})
