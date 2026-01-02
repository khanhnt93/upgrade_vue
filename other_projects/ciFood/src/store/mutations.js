import Cookies from 'js-cookie';
import session from '../api/session';
import upload from '../api/uploadFile';
import {Constant} from '../common/constant'


const TOKEN_NAME = Constant.TOKEN_NAME
const APP_USR = Constant.APP_USR
// const STORE_ID = Constant.STORE_ID
// const TABLE_ID = Constant.TABLE_ID
const STAFF_MENU = Constant.STAFF_MENU

export default {
  updateUser(state, user) {
    Cookies.set(APP_USR, user, { expires: 365 });
    // localStorage.setItem(APP_USR, JSON.stringify(user));
    state.user = user;
  },

  updateToken(state, data) {
    const token = data
    Cookies.set(TOKEN_NAME, token, { expires: 365 })
    // localStorage.setItem(TOKEN_NAME, token);
    session.defaults.headers['token'] = `${token}`
    upload.defaults.headers['token'] = `${token}`
    state.token = token
  },

  updateMenu(state, menu) {
    // Cookies.set(STAFF_MENU, menu, { expires: 365 });
    localStorage.setItem(STAFF_MENU, JSON.stringify(menu));
    this.state.menu = menu
  },

  removeToken(state) {
    // Removes token
    Cookies.remove(TOKEN_NAME)
    // localStorage.removeItem(TOKEN_NAME);
    state.token = null;
    // Removes user
    Cookies.remove(APP_USR)
    // localStorage.removeItem(APP_USR);
    state.user = null;
    // Remove menu
    // Cookies.remove(STAFF_MENU)
    localStorage.removeItem(STAFF_MENU);
    state.menu = null;
  }
}
