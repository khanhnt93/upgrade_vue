import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Search Debt
   */
  getListDebt() {
    return session.get(RootAPI + 'debt/get-all')
  },

  /**
   * Relief debt.
   */
  deleteDebt(id) {
    return session.get(RootAPI + 'debt/delete/' + id)
  },

  /**
   * Pay for debt
   */
  payDebt(params) {
    return session.post(RootAPI + 'debt/pay', params)
  },

  /**
   * get debt detail.
   */
  getDeptDetail(id) {
    return session.get(RootAPI + 'debt/' + id)
  },

  /**
   * Add debt
   */
  addDept(params) {
    return session.post(RootAPI + 'debt/add', params)
  },

  searchdebt(params) {
    return session.post(RootAPI + 'debt/search', params)
  },


  /**
   * Update debt
   */
  updateDept(params) {
    return session.post(RootAPI + 'debt/update-customer', params)
  },


  /**
   * Search Public Debt
   */
  getListPublicDebt() {
    return session.get(RootAPI + 'public-debt/get-all')
  },

  /**
   * Relief Public Debt.
   */
  reliefPublicDebt(id) {
    let params = {
      id: id
    }
    return session.post(RootAPI + 'public-debt/relief', params)
  },

  /**
   * Pay for Public Debt
   */
  payPublicDebt(params) {
    return session.post(RootAPI + 'public-debt/pay', params)
  },

  /**
   * get debt Public Debt.
   */
  getPublicDeptDetail(id) {
    return session.get(RootAPI + 'public-debt/' + id)
  },

  /**
   * Add Public Debt
   */
  addPublicDept(params) {
    return session.post(RootAPI + 'public-debt/add', params)
  },

  searchPublicDebit(params) {
    return session.post(RootAPI + 'public-debt/search', params)
  },


  /**
   * Update Public Debt
   */
  updatePublicDept(params) {
    return session.post(RootAPI + 'public-debt/update-customer', params)
  },
}