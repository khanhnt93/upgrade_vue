import session from './session'
import { RootAPI } from './index'

export default {
   /**
   * Search order
   */
   searchOrder(params) {
    return session.post(RootAPI + 'order/search', params)
   },

    /**
   * Delete order
   */
    deleteOrder(id) {
    return session.get(RootAPI + 'order/delete/' + id)
  },

  /**
   * Get detail order
   */
  getDetailOrder(id) {
    return session.get(RootAPI + 'order/detail/' + id)
  },

    /**
   * Save draft order
   */
  saveDraft(params) {
    return session.post(RootAPI + 'order/add', params)
  },

  /**
   * Update draft order
   */
  updateDraft(params) {
    return session.post(RootAPI + 'order/update', params)
  },

  /**
   * Get tất cả các options liên quan
   */
  getAllOptionsRelated(params) {
    return session.post(RootAPI + 'order/get-all-options-related', params)
  },

  /**
   * Get pmt of store
   */
  getPmtOfStore() {
    return session.get(RootAPI + 'promotion/get-promo-by-store')
  },

  /**
   * Delete order
   */
  getProductNeedImport() {
    return session.get(RootAPI + 'order/get-product-need-import')
  },

}
