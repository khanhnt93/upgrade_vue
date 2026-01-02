import session from './session'
import { RootAPI } from './index'

export default {

  /**
   * Get repository output history
   */
  getRepositoryHis(params) {
    return session.post(RootAPI + 'repository/get-repo-history', params)
  },

  /**
   * Get repository info
   */
  getOptionsRelatedRepository(params) {
    return session.post(RootAPI + 'repository/get-options-related-repository', params)
  },

  /**
   * Get list product in repository
   */
  getListProductInRepository(params) {
    return session.post(RootAPI + 'repository/get-product-in-repo', params)
  },

  /**
   * Thêm mới phiếu nhập kho
   */
  addRepositoryInput(params) {
    return session.post(RootAPI + 'repository/add-repository-input', params)
  },

  /**
   * Thêm mới phiếu xuất kho
   */
  addRepositoryOutput(params) {
    return session.post(RootAPI + 'repository/add-repository-output', params)
  },

  /**
   * Get repository detail for print
   */
  getRepositoryDetailForPrint(id) {
    return session.get(RootAPI + 'repository/get-repo-history-detail-for-print/' + id)
  },

  /**
   * Giữ SP
   */
  keepProductOnRepo(params) {
    return session.post(RootAPI + 'repository/keep-product', params)
  },

  /**
   * Xoá phiếu
   */
  deleteRepoHis(id) {
    return session.get(RootAPI + 'repository/delete/' + id)
  },

  /**
   * Import from excel
   */
  importFromExcelFile(req) {
    return session.post(RootAPI + 'repository/import-from-excel', req)
  },

  /**
   * Lấy chi tiết đơn hàng bán cho xuất kho
   */
  getOrderSellDetailForRepoOutput(params) {
    return session.post(RootAPI + 'repository/get-order-sell-detail-for-repo-output', params)
  },

  /**
   * Lấy chi tiết đơn hàng nhập cho nhập kho
   */
  getOrderBuyDetailForRepoInput(id) {
    return session.get(RootAPI + 'repository/get-order-buy-detail-for-repo-input/' + id)
  },

  /**
   * Lấy danh sách giữ hàng
   */
  getListKeepProduct(product_id) {
    return session.get(RootAPI + 'repository/get-list-product-keep/' + product_id)
  },

  /**
   * Lấy chi tiết đơn hàng bán cho xuất kho
   */
  deleteKeepProduct(params) {
    return session.post(RootAPI + 'repository/delete-keep-product', params)
  },

  /**
   * Lấy danh sách giữ hàng
   */
  getStoreDetail() {
    return session.get(RootAPI + 'repository/get-store-info')
  },
}
