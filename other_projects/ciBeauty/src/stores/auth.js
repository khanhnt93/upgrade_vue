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
        getUser: (state) => state.user,
        getToken: (state) => state.token,
        getMenu: (state) => state.menu,
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
        logout() {
            // Remove token
            Cookies.remove(TOKEN_NAME)
            this.token = null

            // Remove user
            Cookies.remove(APP_USR)
            this.user = null

            // Remove menu
            localStorage.removeItem(STAFF_MENU)
            this.menu = null
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