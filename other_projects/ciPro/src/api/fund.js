import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get fund info
   */
  getFundInfo() {
    return session.get(RootAPI + 'fund/get-fund-info')
  },

  /**
   * Get lịch sử quỹ
   */
  getFundHistory(params) {
    return session.post(RootAPI + 'fund/get-fund-history', params)
  },

  /**
   * Load list fund setting
   */
  getFundSetting() {
    return session.get(RootAPI + 'fund/get-fund-setting')
  },

  /**
   * Get group options
   */
  getGroupOptions() {
    return session.get(RootAPI + 'fund/get-group-options')
  },

  /**
   * Thêm mới fund setting
   */
  addFundSetting(params) {
    return session.post(RootAPI + 'fund/add-fund-setting', params)
  },

  /**
   * Cập nhật fund setting
   */
  updateFundSetting(params) {
    return session.post(RootAPI + 'fund/update-fund-setting', params)
  },

  /**
   * Xoá fund setting
   */
  deleteFundSetting(id) {
    return session.get(RootAPI + 'fund/delete-fund-setting/' + id)
  },

  /**
   * Get options liên quan tới quỹ
   */
  getOptionsRelatedFund(params) {
    return session.post(RootAPI + 'fund/get-options-related-fund', params)
  },

  searchOrderSell(params) {
    return session.post(RootAPI + 'order-buy/search-order-sell', params)
  },

  updateIncome(params) {
    return session.post(RootAPI + 'fund/update-income', params)
  },

  addIncome(params) {
    return session.post(RootAPI + 'fund/add-income', params)
  },

  addExpend(params) {
    return session.post(RootAPI + 'fund/add-expend', params)
  },

  updateExpend(params) {
    return session.post(RootAPI + 'fund/update-expend', params)
  },

  addAccountingSlip(params) {
    return session.post(RootAPI + 'fund/add-accounting-slip', params)
  },

  searchOrderBuy(params) {
    return session.post(RootAPI + 'fund/search-order-buy', params)
  },

  deleteFund(id) {
    return session.get(RootAPI + 'fund/delete-fund/' + id)
  },

  /**
   * Xoá fund setting
   */
  getFundDetail(id) {
    return session.get(RootAPI + 'fund/get-fund-detail/' + id)
  },

  /**
   * Xoá fund setting
   */
  getEditFundHis(params) {
    return session.post(RootAPI + 'fund/search-edit-fund-his', params)
  },

  /**
   * Xoá fund setting
   */
  getFundHisDetail(id) {
    return session.get(RootAPI + 'fund/get-fund-his-detail/' + id)
  },

  /**
   * Xoá fund setting
   */
  getDebtReliefHis(params) {
    return session.post(RootAPI + 'fund/search-debt-relief-his', params)
  },

}
