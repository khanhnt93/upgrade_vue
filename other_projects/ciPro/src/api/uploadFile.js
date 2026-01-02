import axios from 'axios'
import Cookies from 'js-cookie'
import {Constant} from '../common/constant'

const TOKEN_NAME = Constant.TOKEN_NAME;
const CSRF_COOKIE_NAME = 'csrftoken';
const CSRF_HEADER_NAME = 'X-CSRFToken';

const upload = axios.create({
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_NAME,
  timeout: 50000
});

let token = Cookies.get(TOKEN_NAME)
if (token) {
  upload.defaults.headers['token'] = `${token}`
}
upload.defaults.headers['Content-Type'] = "multipart/form-data"
export default upload;
