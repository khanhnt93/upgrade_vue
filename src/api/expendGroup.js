import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get product group detail
   */
   getAllExpendGroup() {
    return session.get(RootAPI + 'expend-group/list')
   },
 
  /**
   * Get product group detail
   */
   getExpendGroupDetail(expend_group_id) {
    return session.get(RootAPI + 'expend-group/detail/' + expend_group_id)
   },

  /**
   * Add new product group
   */
   addExpendGroup(params) {
    return session.post(RootAPI + 'expend-group/add', params)
   },

   /**
   * Update product group
   */
   updateExpendGroup(params) {
    return session.post(RootAPI + 'expend-group/update', params)
   },

   /**
   * Delete product group
   */
   deleteExpendGroup(expend_group_id) {
    return session.get(RootAPI + 'expend-group/delete/' + expend_group_id)
   },
}
