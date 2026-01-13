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
    user: Cookies.get(APP_USR) ? JSON.parse(Cookies.get(APP_USR)) : null,
    token: Cookies.get(TOKEN_NAME) || null,
    menu: localStorage.getItem(STAFF_MENU) ? JSON.parse(localStorage.getItem(STAFF_MENU)) : null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getMenu: (state) => state.menu,
  },

  actions: {
    updateUser(user) {
      this.user = user
      Cookies.set(APP_USR, JSON.stringify(user), { expires: 365 })
    },

    updateToken(token) {
      this.token = token
      Cookies.set(TOKEN_NAME, token, { expires: 365 })
      session.defaults.headers['token'] = `${token}`
      upload.defaults.headers['token'] = `${token}`
    },

    updateMenu(menu) {
      this.menu = menu
      localStorage.setItem(STAFF_MENU, JSON.stringify(menu))
    },

    logout() {
      // Remove token
      this.token = null
      Cookies.remove(TOKEN_NAME)

      // Remove user
      this.user = null
      Cookies.remove(APP_USR)

      // Remove menu
      this.menu = null
      localStorage.removeItem(STAFF_MENU)
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
        paths: ['menu']
      }
    ]
  }
})
