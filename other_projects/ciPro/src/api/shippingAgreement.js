import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get table shipping-agreement
   */
  getListShippingAgreement() {
    return session.get(RootAPI + 'shipping-agreement/')
  },

  /**
   * Edit shipping-agreement
   */
  editShippingAgreement(req) {
    return session.post(RootAPI + 'shipping-agreement/update', req)
  },

  /**
   * Add shipping-agreement
   */
  addShippingAgreement(req) {
    return session.post(RootAPI + 'shipping-agreement/add', req)
  },

  /**
   * Delete shipping-agreement
   */
  deleteShippingAgreement(id) {
    return session.get(RootAPI + 'shipping-agreement/delete/' + id)
  },
}
