import session from './session'
import { RootAPI } from './index'

export default {
  searchdebt(params, role) {
    if(role == 'admin') {
      return session.post(RootAPI + 'debt/search', params)
    } else {
      return session.post(RootAPI + 'debt/search-by-staff', params)
    }

  },

  /**
   * Get debt by customer
   */
  getDebtByCustomer(customerId) {
    return session.get(RootAPI + 'debt/get-by-customer/' + customerId)
  },

  /**
   * Thanh toán nhanh nợ công
   */
  payDebtFast(params) {
    return session.post(RootAPI + 'debt/pay-fast', params)
  },

  getOptionsRelatedDebt(params, role) {
    if(role == 'admin') {
      return session.post(RootAPI + 'debt/get-option-related', params)
    } else {
      return session.post(RootAPI + 'debt/get-option-related-for-sale', params)
    }
  },

  /**
   * Can tru cong no
   */
  payOverPayment(params) {
    return session.post(RootAPI + 'debt/pay-over-payment', params)
  },
}
