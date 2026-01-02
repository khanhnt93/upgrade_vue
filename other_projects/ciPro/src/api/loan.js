import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get table unit
   */
  getOptionsRelated(params) {
    return session.post(RootAPI + 'loan/get-options-related', params)
  },

  /**
   * Get unit detail
   */
  searchLoan(params) {
    return session.post(RootAPI + 'loan/search-loan', params)
  },

  /**
   * Get unit detail
   */
  searchAdvance(params) {
    return session.post(RootAPI + 'loan/search-advance', params)
  },

  /**
   * Add loan out
   */
  addLoanOut(params) {
    return session.post(RootAPI + 'loan/add-loan-out', params)
  },

  /**
   * Update loan out
   */
  updateLoanOut(params) {
    return session.post(RootAPI + 'loan/update-loan-out', params)
  },

  /**
   * Add loan out
   */
  addLoanIn(params) {
    return session.post(RootAPI + 'loan/add-loan-in', params)
  },

  /**
   * Update loan out
   */
  updateLoanIn(params) {
    return session.post(RootAPI + 'loan/update-loan-in', params)
  },

  /**
   * Add loan out
   */
  addAdvance(params) {
    return session.post(RootAPI + 'loan/add-advance', params)
  },

  /**
   * Update loan out
   */
  updateAdvance(params) {
    return session.post(RootAPI + 'loan/update-advance', params)
  },

  /**
   * Update loan out
   */
  getLoanDetail(id) {
    return session.get(RootAPI + 'loan/get-loan-detail/' + id)
  },

  /**
   * Update loan out
   */
  deleteLoan(id) {
    return session.get(RootAPI + 'loan/delete-loan/' + id)
  },

  /**
   * Add loan out payment
   */
  addLoanOutPayment(params) {
    return session.post(RootAPI + 'loan/add-loan-out-payment', params)
  },

  /**
   * Add loan out payment
   */
  addLoanInPayment(params) {
    return session.post(RootAPI + 'loan/add-loan-in-payment', params)
  },

  /**
   * Add loan out payment
   */
  addAdvancePayment(params) {
    return session.post(RootAPI + 'loan/add-advance-payment', params)
  },

  /**
   * Get options liên quan báo giá
   */
  getListPayment(params) {
    return session.post(RootAPI + 'loan/get-list-payment', params)
  },
}
