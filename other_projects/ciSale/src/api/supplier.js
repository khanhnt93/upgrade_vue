import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get table supplier
   */
  getListSupplier() {
    return session.get(RootAPI + 'supplier/')
  },

  /**
   * Get supplier detail
   */
  getSupplierDetail(id) {
    return session.get(RootAPI + 'supplier/' + id)
  },

  /**
   * Edit supplier
   */
  editSupplier(req) {
    return session.post(RootAPI + 'supplier/update', req)
  },

  /**
   * Add supplier
   */
  addSupplier(req) {
    return session.post(RootAPI + 'supplier/add', req)
  },

  /**
   * Delete supplier
   */
  deleteSupplier(tableId) {
    return session.get(RootAPI + 'supplier/delete/' + tableId)
  },

  /**
   * Get list supplier option
   */
  getListSupplierOption () {
    return session.get(RootAPI + 'supplier/list-option')
  },

  /**
   * Get list supplier history
   */
  getSupplierHistory(req) {
    return session.post(RootAPI + 'supplier/get-supplier-history', req)
  },
}
