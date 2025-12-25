import session from './session'
import { RootAPI } from './index'

export default {
  /**
  * ----------
  * Income
  * ----------
  */
  
  /**
   * Import from excel
   */
  searchIncome(params) {
    return session.post(RootAPI + 'income/search', params)
  },

   /**
   * Delete Income
   */
   deleteIncome(income_id) {
    return session.get(RootAPI + 'income/delete/' + income_id)
   },

   /**
   * Get Income detail
   */
   getIncomeDetail(income_id) {
    return session.get(RootAPI + 'income/detail/' + income_id)
   },
    
    /**
   * Get Income detail
   */
   getIncomeDetailFull(income_id) {
    return session.get(RootAPI + 'income/detail-full/' + income_id)
   },

  /**
   * Add new income
   */
   addIncome(params) {
    return session.post(RootAPI + 'income/add', params)
   },

   /**
   * Update income
   */
   updateIncome(params) {
    return session.post(RootAPI + 'income/update', params)
   },

    /**
   * Import from excel
   */
  getOptionRelatedIncome(params) {
    return session.post(RootAPI + 'income/get-option-related', params)
  },
    
    /**
   * Import from excel
   */
    approveIncome(income_id) {
    return session.get(RootAPI + 'income/approve/' + income_id)
   },
}
