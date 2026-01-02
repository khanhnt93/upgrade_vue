import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get promotion list
   */
  getPromoList(params) {
    return session.post(RootAPI + 'promotion/staff', params)
  },

  /**
   * Add promo
   */
  addPromo(params) {
    return session.post(RootAPI + 'promotion/add-pmt', params)
  },

  /**
   * Delete promotion
   */
  deletePromo(params) {
    return session.post(RootAPI + 'promotion/delete', params)
  },

    /**
   * Get list promotion type
   */
  getListPromotionType() {
    return session.get(RootAPI + 'promotion/get-promo-type')
  },

    /**
   * Get list free item
   */
  getListFreeItem() {
    return session.get(RootAPI + 'promotion/get-free-item')
  },

    /**
   * Get promotion detail
   */
  getPromoDetail(staffId) {
    return session.get(RootAPI + 'promotion/' + staffId + '/staff')
  },

    /**
   * Edit promo
   */
  editPromo(params) {
    return session.post(RootAPI + 'promotion/update-pmt', params)
  },
}
