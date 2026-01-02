import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get table payment-method
   */
  getListPaymentMethod() {
    return session.get(RootAPI + 'payment-method/')
  },

  /**
   * Edit payment-method
   */
  editPaymentMethod(req) {
    return session.post(RootAPI + 'payment-method/update', req)
  },

  /**
   * Add payment-method
   */
  addPaymentMethod(req) {
    return session.post(RootAPI + 'payment-method/add', req)
  },

  /**
   * Delete payment-method
   */
  deletePaymentMethod(id) {
    return session.get(RootAPI + 'payment-method/delete/' + id)
  },
}
