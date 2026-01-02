import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get danh sách DV theo group 
   */
  getProductByGroup() {
    return session.get(RootAPI + 'bill/get-list-product')
  },

  /**
   * Lưu nháp hóa đơn
   */
  saveDraftBill(params) {
    return session.post(RootAPI + 'bill/save-draft', params)
  },

  /**
   * Xác nhận hóa đơn
   */
  confirmPayment(params) {
    return session.post(RootAPI + 'bill/payment', params)
  },

  /**
   * Get thông tin liên quan bill: customer, promotion, staff
   */
  getInfoRelatedBill() {
    return session.get(RootAPI + 'bill/get-info-related-bill')
  },

  /**
   * Search customer
   */
  searchCustomer(params) {
    return session.post(RootAPI + 'bill/search-customer', params)
  },

  /**
   * Thêm customer
   */
  addCustomer(params) {
    return session.post(RootAPI + 'bill/add-customer', params)
  },

  /**
   * Search customer
   */
  searchBill(params) {
    return session.post(RootAPI + 'bill/search-bill', params)
  },

  /**
   * Get bill detail
   */
  getBillDetail(id) {
    return session.get(RootAPI + 'bill/get-bill-detail/' + id)
  },

  /**
   * Delete bill
   */
  deleteBill(id) {
    return session.get(RootAPI + 'bill/delete-bill/' + id)
  },

  /**
   * Delete bill
   */
  updateBillCustomer(params) {
    return session.post(RootAPI + 'bill/add-update-payment-customer', params)
  },

}
