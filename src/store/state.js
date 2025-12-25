import Cookies from 'js-cookie';
import {Constant} from '../common/constant'

const TOKEN_NAME = Constant.TOKEN_NAME;
const APP_USR = Constant.APP_USR;
const STAFF_MENU = Constant.STAFF_MENU;

export default {
  user: Cookies.get(APP_USR) ? JSON.parse(Cookies.get(APP_USR)) : null,
  // user: localStorage.getItem(APP_USR) ? JSON.parse(localStorage.getItem(APP_USR)) : null,
  token: Cookies.get(TOKEN_NAME) ? Cookies.get(TOKEN_NAME) : null,
  // token: localStorage.getItem(TOKEN_NAME) ? localStorage.getItem(TOKEN_NAME) : null,
  // menu: Cookies.get(STAFF_MENU) ? JSON.parse(Cookies.get(STAFF_MENU)) : null,
  menu: localStorage.getItem(STAFF_MENU) ? JSON.parse(localStorage.getItem(STAFF_MENU)) : null,
}
