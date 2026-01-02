import session from './session'
import { RootAPI } from './index'

export default {
   /**
   * Get trade history
   */
   getTradeSellHis(params) {
    return session.post(RootAPI + 'trade/get-trade-sell-his', params)
   },

    /**
   * Get trade history
   */
   getTradeBuyHis(params) {
    return session.post(RootAPI + 'trade/get-trade-buy-his', params)
   },

    /**
   * Get trade detail
   */
  getTradeDetail(id) {
    return session.get(RootAPI + 'trade/get-trade-buy-detail/' + id)
  },

  /**
   * Get order detail
   */
  getOrderDetail(id) {
    return session.get(RootAPI + 'order/detail/' + id)
  },

  /**
   * Trade buy
   */
  tradeBuy(params) {
    return session.post(RootAPI + 'trade/buy', params)
  },

    /**
   * Delete trade
   */
  deleteTrade(id) {
    return session.get(RootAPI + 'trade/delete-trade/' + id)
  },

  /**
   * Save draft buy
   */
  saveDraftBuy(params) {
    return session.post(RootAPI + 'trade/save-draft-buy', params)
  },

  /**
   * Update draft buy
   */
  updateDraftBuy(params) {
    return session.post(RootAPI + 'trade/update-draft-buy', params)
  },

    /**
   * Save draft sell
   */
  saveDraftSell(params) {
    return session.post(RootAPI + 'trade/save-draft-sell', params)
  },

  /**
   * Update draft buy
   */
  updateDraftSell(params) {
    return session.post(RootAPI + 'trade/update-draft-sell', params)
  },

  /**
   * Trade sell
   */
  tradeSell(params) {
    return session.post(RootAPI + 'trade/sell', params)
  },

  /**
   * Get tất cả các options liên quan
   */
  getAllOptionsRelated(params) {
    return session.post(RootAPI + 'trade/get-all-options-related', params)
  },

  /**
   * Get pmt of store
   */
  getPmtOfStore() {
    return session.get(RootAPI + 'promotion/get-promo-by-store')
  },

    /**
   * Get tất cả các options liên quan
   */
  searchProductWhenSell(params) {
    return session.post(RootAPI + 'trade/search-product-when-sell', params)
  },

}
