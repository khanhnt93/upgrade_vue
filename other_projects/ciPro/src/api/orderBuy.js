import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Search báo giá
   */
  searchOrderBuy(params) {
    return session.post(RootAPI + 'order-buy/search', params)
  },

    /**
   * Cập nhật trạng thái báo giá
   */
  updateOrderBuyStatus(params) {
    return session.post(RootAPI + 'order-buy/change-status', params)
  },

  /**
   * Xóa báo giá
   */
  deleteOrderBuy(id) {
    return session.get(RootAPI + 'order-buy/delete/' + id)
  },

  /**
   * Get OrderBuy detail
   */
  getOrderBuyDetail(id) {
    return session.get(RootAPI + 'order-buy/get-order-buy-detail/' + id)
  },

  /**
   * Save draft OrderBuy
   */
  saveDraftOrderBuy(params) {
    return session.post(RootAPI + 'order-buy/save-draft', params)
  },

  /**
   * Update draft buy
   */
  updateDraftOrderBuy(params) {
    return session.post(RootAPI + 'order-buy/update-draft', params)
  },

  /**
   * Trade sell
   */
  saveOrderBuy(params) {
    return session.post(RootAPI + 'order-buy/save', params)
  },

  /**
   * Get order sell options
   */
  getOrderSellOptions() {
    return session.get(RootAPI + 'order-buy/get-order-sell-option')
  },

  /**
   * Trade sell
   */
  saveOrderBuyByGroup(params) {
    return session.post(RootAPI + 'order-buy/save-group', params)
  },

  /**
   * Get order sell options
   */
  getOrderSellDetail(id) {
    return session.get(RootAPI + 'order-sell/get-order-sell-detail-for-order-buy/' + id)
  },

  searchOrderSell(params) {
    return session.post(RootAPI + 'order-buy/search-order-sell', params)
  },

  updateOrderBuyNote(params) {
    return session.post(RootAPI + 'order-buy/update-note', params)
  },

  updateOrderBuyInvoiceNote(params) {
    return session.post(RootAPI + 'order-buy/update-invoice-note', params)
  },

  /**
   * Get OrderSell detail
   */
  confirmOrderBuyBack(params) {
    return session.post(RootAPI + 'order-buy/confirm-order-buy-back', params)
  },

    /**
   * Get order sell options
   */
  getListExpend(id) {
    return session.get(RootAPI + 'order-buy/get-list-expend/' + id)
  },
}
