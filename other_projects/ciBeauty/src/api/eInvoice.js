import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get danh sách Bill
   */
  getListBill(params) {
    return session.post(RootAPI + 'e-invoice/get-list-bill', params)
  },

  /**
   * Get chi tiết Bill
   */
  getBillDetail(id) {
    return session.get(RootAPI + 'e-invoice/get-bill-detail/' + id)
  },

  /**
   * Get chi tiết invoice
   */
  getInvoiceDetail(id) {
    return session.get(RootAPI + 'e-invoice/get-invoice-detail/' + id)
  },

  /**
   * Xác nhận xuất hoá đơn điện tử
   */
  createSingleInvoice(params) {
    return session.post(RootAPI + 'e-invoice/create-single-invoice', params)
  },

  /**
   * Xác nhận bỏ qua liên kết bill với HDDT
   */
  confirmCancelInvoice(id) {
    return session.get(RootAPI + 'e-invoice/cancel-link-einvoice/' + id)
  },

  /**
   * Get danh sách e-invoice
   */
  getListEInvoice(params) {
    return session.post(RootAPI + 'e-invoice/get-list-invoice', params)
  },

}
