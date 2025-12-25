import session from './session'
import { RootAPI } from './index'

export default {
  /**
  * ----------
  * Expend
  * ----------
  */
  
  /**
   * Import from excel
   */
  searchExpend(params) {
    return session.post(RootAPI + 'expend/search', params)
  },

   /**
   * Delete Expend
   */
   deleteExpend(expend_id) {
    return session.get(RootAPI + 'expend/delete/' + expend_id)
   },

   /**
   * Get Expend detail
   */
   getExpendDetail(expend_id) {
    return session.get(RootAPI + 'expend/detail/' + expend_id)
   },
    
    /**
   * Get Expend detail
   */
   getExpendDetailFull(expend_id) {
    return session.get(RootAPI + 'expend/detail-full/' + expend_id)
   },

  /**
   * Add new Expend
   */
   addExpend(params) {
    return session.post(RootAPI + 'expend/add', params)
   },

   /**
   * Update Expend
   */
   updateExpend(params) {
    return session.post(RootAPI + 'expend/update', params)
   },

    /**
   * Import from excel
   */
  getOptionRelatedExpend(params) {
    return session.post(RootAPI + 'expend/get-option-related', params)
  },
    
    /**
   * Import from excel
   */
    approveExpend(expend_id) {
    return session.get(RootAPI + 'expend/approve/' + expend_id)
   },
}
