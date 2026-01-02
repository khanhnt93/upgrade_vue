import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Search báo giá
   */
  searchOrderSell(params, role) {
    if(role == "admin") {
      return session.post(RootAPI + 'order-sell/search-all', params)
    } else {
      return session.post(RootAPI + 'order-sell/search-by-staff', params)
    }

  },

    /**
   * Cập nhật trạng thái báo giá
   */
  updateOrderSellStatus(params, role) {
    if(role == "admin") {
      return session.post(RootAPI + 'order-sell/change-status', params)
    } else {
      return session.post(RootAPI + 'order-sell/change-status-by-staff', params)
    }
  },

  /**
   * Cập nhật trạng thái hoá đơn
   */
  updateInvoiceStatus(params, role) {
    if(role == "admin") {
      return session.post(RootAPI + 'order-sell/change-invoice-status', params)
    } else {
      return session.post(RootAPI + 'order-sell/change-invoice-status-by-staff', params)
    }
  },

  /**
   * Cập nhật ghi chú kế toán
   */
  updateAccountingNote(params, role) {
    if(role == "admin") {
      return session.post(RootAPI + 'order-sell/change-accounting-note', params)
    } else {
      return session.post(RootAPI + 'order-sell/change-accounting-note-by-staff', params)
    }
  },

  /**
   * Xóa báo giá
   */
  deleteOrderSell(id, role) {
    if(role == "admin") {
      return session.get(RootAPI + 'order-sell/delete/' + id)
    } else {
      return session.get(RootAPI + 'order-sell/delete-by-staff/' + id)
    }
  },

  deleteOrderSellAfterCancel(id, role) {
    if(role == "admin") {
      return session.get(RootAPI + 'order-sell/delete-after-cancel/' + id)
    }
  },

  /**
   * Get OrderSell detail
   */
  getOrderSellDetail(id, role) {
    if(role == "staff") {
      return session.get(RootAPI + 'order-sell/get-order-sell-detail-by-staff/' + id)
    } else {
      return session.get(RootAPI + 'order-sell/get-order-sell-detail/' + id)
    }
  },

  /**
   * Get OrderSell detail
   */
  confirmOrderSellBack(params) {
    return session.post(RootAPI + 'order-sell/confirm-order-sell-back', params)
  },

  /**
   * Get báo giá option
   */
  getQuotationOption(role) {
    if(role == "staff") {
      return session.get(RootAPI + 'quotation/get-quotation-option-by-staff')
    } else {
      return session.get(RootAPI + 'quotation/get-quotation-option')
    }
  },

  /**
   * Save draft OrderSell
   */
  saveDraftOrderSell(params) {
    return session.post(RootAPI + 'order-sell/save-draft', params)
  },

  /**
   * Update draft buy
   */
  updateDraftOrderSell(params) {
    return session.post(RootAPI + 'order-sell/update-draft', params)
  },

  /**
   * Trade sell
   */
  saveOrderSell(params) {
    return session.post(RootAPI + 'order-sell/save', params)
  },

    /**
   * Trade sell
   */
  keepProductOnRepo(params) {
    return session.post(RootAPI + 'order-sell/keep-product', params)
  },

  /**
   * Kiểm tra danh sách sản phẩm có sản phẩm nào chưa có trong hệ thống không
   */
  checkProductManualInput(id) {
    return session.get(RootAPI + 'order-sell/check-product-manual-input/' + id)
  },

  /**
   * Lấy danh sách các option liên quan đến sản phẩm
   */
  getOptionRelatedProduct() {
    return session.get(RootAPI + 'order-sell/get-option-related-product')
  },

  /**
   * Lấy danh sách các option liên quan đến sản phẩm
   */
  getOptionRelated(params) {
    return session.post(RootAPI + 'order-sell/get-option-related', params)
  },

  /**
   * Trade sell
   */
  insertProductFromOrderSell(params) {
    return session.post(RootAPI + 'order-sell/insert-product', params)
  },

  /**
   * Lấy option liên quan đến màn hình ds order sell
   */
  getOptionForOrderSellList(params) {
    return session.post(RootAPI + 'order-sell/get-option-for-order-sell-list', params)
  },

  /**
   * Get options liên quan báo giá
   */
  getCustomerDetail(id) {
    return session.get(RootAPI + 'order-sell/get-customer-detail/' + id)
  },

  /**
   * Get options liên quan báo giá
   */
  getListIncome(id) {
    return session.get(RootAPI + 'order-sell/get-list-income/' + id)
  },

  /**
   * Get options liên quan báo giá
   */
  getListExpend(id) {
    return session.get(RootAPI + 'order-sell/get-list-expend/' + id)
  },
}
