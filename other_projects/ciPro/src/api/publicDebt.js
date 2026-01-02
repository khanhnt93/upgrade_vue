import session from './session'
import { RootAPI } from './index'

export default {

  searchPublicDebit(params) {
    return session.post(RootAPI + 'public-debt/search', params)
  },

  getOptionsRelatedPublicDebt(params) {
    return session.post(RootAPI + 'public-debt/get-option-related', params)
  },

  /**
   * Get public debt by supplier
   */
  getPublicDebtBySupplier(supplierId) {
    return session.get(RootAPI + 'public-debt/get-by-supplier/' + supplierId)
  },

  /**
   * Thanh toán nhanh nợ công
   */
  payPublicDebtFast(params) {
    return session.post(RootAPI + 'public-debt/pay-fast', params)
  },

  /**
   * Can tru cong no
   */
  payOverPayment(params) {
    return session.post(RootAPI + 'public-debt/pay-over-payment', params)
  },
}
