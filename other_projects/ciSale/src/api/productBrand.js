import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get table unit
   */
  getListProductBrand() {
    return session.get(RootAPI + 'product-brand/')
  },

  /**
   * Get ProductBrand detail
   */
  getProductBrandDetail(id) {
    return session.get(RootAPI + 'product-brand/' + id)
  },

  /**
   * Edit ProductBrand
   */
  editProductBrand(req) {
    return session.post(RootAPI + 'product-brand/update', req)
  },

  /**
   * Add ProductBrand
   */
  addProductBrand(req) {
    return session.post(RootAPI + 'product-brand/add', req)
  },

  /**
   * Delete ProductBrand
   */
  deleteProductBrand(tableId) {
    return session.get(RootAPI + 'product-brand/delete/' + tableId)
  },

  /**
   * Get list ProductBrand option
   */
  getListProductBrandOption () {
    return session.get(RootAPI + 'product-brand/list-option')
  },
}
