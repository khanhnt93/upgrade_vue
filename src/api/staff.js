import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * get info of staff
   */
  logIn (data) {
    return session.post(RootAPI + 'staff/login', data)
  },
  
  /**
   * Reset pass
   */
  resetPass (params) {
    return session.post(RootAPI + 'staff/reset-pass', params)
  },

  getMenuBar(id) {
    return session.get(RootAPI + 'staff/get-menu-bar/' + id)
  },

}
