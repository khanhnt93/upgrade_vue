import session from './session'
import { RootAPI } from './index'

export default {
   /**
   * Get repository history
   */
   getRepositoryHis(params) {
    return session.post(RootAPI + 'repository/get-repo-history', params)
   },

  /**
   * Get repository info
   */
  getRepositoryInfo() {
    return session.get(RootAPI + 'repository/get-repo-info')
  },

  /**
   * Get list product in repository
   */
  getListProductInRepository(params) {
    return session.post(RootAPI + 'repository/get-product-in-repo', params)
  },

  /**
   * Import from excel
   */
  importFromExcelFile(req) {
    return session.post(RootAPI + 'repository/import-from-excel', req)
  },

}
