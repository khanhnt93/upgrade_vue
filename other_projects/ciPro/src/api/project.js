import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get product group detail
   */
   getProjectList() {
    return session.get(RootAPI + 'project/list')
   },

  /**
   * Get product group detail
   */
   getProjectDetail(project_id) {
    return session.get(RootAPI + 'project/detail/' + project_id)
   },

  /**
   * Add new product group
   */
   addProject(params) {
    return session.post(RootAPI + 'project/add', params)
   },

   /**
   * Update product group
   */
   updateProject(params) {
    return session.post(RootAPI + 'project/update', params)
   },

   /**
   * Delete product group
   */
   deleteProject(project_id) {
    return session.get(RootAPI + 'project/delete/' + project_id)
   },

  /**
   * Get product options
   */
   getProductOptions() {
    return session.get(RootAPI + 'project/get-options-product')
   },
}
