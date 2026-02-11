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
    token: Cookies.get(TOKEN_NAME) ? Cookies.get(TOKEN_NAME) : null,
    menu: localStorage.getItem(STAFF_MENU) ? JSON.parse(localStorage.getItem(STAFF_MENU)) : null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    userMenu: (state) => state.menu,
  },

  actions: {
    updateUser(user) {
      Cookies.set(APP_USR, JSON.stringify(user), { expires: 365 })
      this.user = user
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
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['menu'], // Only persist menu in localStorage
      },
    ],
  },
})
