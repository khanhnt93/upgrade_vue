import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get product group detail
   */
   getAllIncomeGroup() {
    return session.get(RootAPI + 'income-group/list')
   },
 
  /**
   * Get product group detail
   */
   getIncomeGroupDetail(income_group_id) {
    return session.get(RootAPI + 'income-group/detail/' + income_group_id)
   },

  /**
   * Add new product group
   */
   addIncomeGroup(params) {
    return session.post(RootAPI + 'income-group/add', params)
   },

   /**
   * Update product group
   */
   updateIncomeGroup(params) {
    return session.post(RootAPI + 'income-group/update', params)
   },

   /**
   * Delete product group
   */
   deleteIncomeGroup(income_group_id) {
    return session.get(RootAPI + 'income-group/delete/' + income_group_id)
   },
}
