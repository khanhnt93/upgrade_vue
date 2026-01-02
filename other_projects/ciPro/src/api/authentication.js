/* eslint-disable */
import session from './session'
import { RootAPI } from './index'

export default {
  logIn (req) {
    return session.post(RootAPI + 'staff/login', req)
  },

  register (req) {
    return session.post(RootAPI + 'customer/register', req)
  },

  // getUserInfo () {
  //   return session.post(RootAPI + 'staff/info')
  // }

  /**
   * Gets current logged in user info
   */
  getUserInfo (param) {
    return session.get(RootAPI + 'staff/' + param)
  },

  /**
   * Staff update password
   */
  staffUpdatePass (req) {
    return session.post(RootAPI + 'staff/update-pass', req)
  },

  /**
   * Staff change password
   */
  staffChangePass (req) {
    return session.post(RootAPI + 'staff/change-pass', req)
  },

  /**
   * Customer update password
   */
  CustomerChangePass (req) {
    return session.post(RootAPI + 'customer/change-pass', req)
  },

  /**
   * Customer forget password
   */
  CustomerForgetPass (req) {
    return session.post(RootAPI + 'customer/update-pass', req)
  },

  /**
   * Customer active password
   */
  CustomerActivePass (req) {
    return session.post(RootAPI + 'customer/active-pass', req)
  },

  /**
   * Customer active password when forget pass
   */
  CustomerActiveForgetPass (req) {
    return session.post(RootAPI + 'customer/active-forget-pass', req)
  },

  /**
   * Confirm code to update password
   */
  staffActivePass (req) {
    return session.post(RootAPI + 'staff/active-pass', req)
  },

  /**
   * Confirm code to active account
   */
  activeAccount (req) {
    return session.post(RootAPI + 'customer/active', req)
  }
};
