import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Search báo giá
   */
  searchQuotationAll(params, role) {
    if(role == "admin") {
      return session.post(RootAPI + 'quotation/search-all', params)
    } else {
      return session.post(RootAPI + 'quotation/search-by-staff', params)
    }

  },

  /**
   * Search kết quả chăm sóc báo giá
   */
  searchQuotationCustomerCare(params, role) {
    if(role == "admin") {
      return session.post(RootAPI + 'quotation/get-quotation-customer-care-all', params)
    } else {
      return session.post(RootAPI + 'quotation/get-quotation-customer-care-by-staff', params)
    }

  },

    /**
   * Cập nhật trạng thái báo giá
   */
  updateQuotationStatus(params, role) {
    if(role == "admin") {
      return session.post(RootAPI + 'quotation/change-status', params)
    } else {
      return session.post(RootAPI + 'quotation/change-status-by-staff', params)
    }
  },

  /**
   * Cập nhật kết quả chăm sóc báo giá
   */
  updateQuotationCustomerCare(params, role) {
    if(role == "admin") {
      return session.post(RootAPI + 'quotation/change-care-note', params)
    } else {
      return session.post(RootAPI + 'quotation/change-care-note-by-staff', params)
    }
  },

    /**
   * Cập nhật kết quả chăm sóc báo giá
   */
  updateProductGroupNote(params, role) {
    if(role == "admin") {
      return session.post(RootAPI + 'quotation/change-product-group-note', params)
    } else {
      return session.post(RootAPI + 'quotation/change-product-group-note-by-staff', params)
    }
  },

    /**
   * Copy báo giá
   */
  copyQuotation(id) {
    return session.post(RootAPI + 'quotation/copy-quotation/' + id)
  },

  /**
   * Xóa báo giá
   */
  deleteQuotation(id, role) {
    if(role == "admin") {
      return session.get(RootAPI + 'quotation/delete/' + id)
    }
    // else {
    //   return session.get(RootAPI + 'quotation/delete-by-staff/' + id)
    // }

  },

  /**
   * Get quotation detail
   */
  getQuotationDetail(id, role) {
    if(role == "staff") {
      return session.get(RootAPI + 'quotation/get-quotation-detail-by-staff/' + id)
    } else {
      return session.get(RootAPI + 'quotation/get-quotation-detail/' + id)
    }
  },

  /**
   * Export excel
   */
  exportExcel(params) {
    return session.post(RootAPI + 'quotation/export-excel', params)
  },

  /**
   * Save draft Quotation
   */
  saveDraftQuotation(params) {
    return session.post(RootAPI + 'quotation/save-draft', params)
  },

  /**
   * Update draft buy
   */
  updateDraftQuotation(params) {
    return session.post(RootAPI + 'quotation/update-draft', params)
  },

  /**
   * Trade sell
   */
  saveQuotation(params) {
    return session.post(RootAPI + 'quotation/save', params)
  },

  /**
   * Trade sell
   */
  searchQuotationForOrderSell(params, role) {
    if(role == "staff") {
      return session.post(RootAPI + 'quotation/search-quotation-for-order-sell-by-staff', params)
    } else {
      return session.post(RootAPI + 'quotation/search-quotation-for-order-sell-all', params)
    }
  },

  /**
   * Get options liên quan báo giá
   */
  getOptionRelatedQuotation(params) {
    return session.post(RootAPI + 'quotation/get-options-related-quotation', params)
  },

  /**
   * Get options liên quan báo giá
   */
  getOptionRelatedQuotationList(params) {
    return session.post(RootAPI + 'quotation/get-options-related-quotation-list', params)
  },

  /**
   * Get options liên quan báo giá
   */
  getCustomerOptions(params) {
    return session.post(RootAPI + 'quotation/get-options-customer', params)
  },

  /**
   * Get options liên quan báo giá
   */
  getProductOptions() {
    return session.get(RootAPI + 'quotation/get-options-product')
  },

  /**
   * Get options liên quan báo giá
   */
  getCustomerDetail(id) {
    return session.get(RootAPI + 'quotation/get-customer-detail/' + id)
  },

  /**
   * Get options liên quan báo giá
   */
  getProjectDetail(id) {
    return session.get(RootAPI + 'quotation/get-project-detail/' + id)
  },

  /**
   * Get options liên quan báo giá
   */
  getProductDetail(id) {
    return session.get(RootAPI + 'quotation/get-product-detail/' + id)
  },
}
