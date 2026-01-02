import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Customer login
   */
  importCustomerFromExcelFile(req) {
    return session.post(RootAPI + 'customer/import-from-excel', req)
  },

  /**
   * Customer login
   */
  customerLogin(req) {
    return session.post(RootAPI + 'customer/login', req)
  },

  /**
   * get info customer by id
   */
  getCustomerInfo (id) {
    return session.get(RootAPI + 'customer/' + id)
  },

  /**
   * customer list
   */
  getListCustomer (params) {
    return session.get(RootAPI + 'customer/search/?'+ params)
  },

  /**
   * get promotion of customer
   */
  getPromotionList (params) {
    return session.get(RootAPI + 'customer/' + params)
  },

  /**
   * Get selected option level for search guest screen
   */
  getOptionLevel () {
    return session.get(RootAPI + 'membershiptype/list')
  },

  /**
   * Customer send order
   */
  sendOrder (listOrder) {
    return session.post(RootAPI + 'customer/send-order', listOrder)
  },

  /**
   * Customer send request
   */
  sendRequest (request) {
    return session.post(RootAPI + 'customer/send-request', request)
  },

  /**
   * Get list menu
   */
  getMenu(storeId) {
    return session.get(RootAPI + 'menu/customer/' + storeId)
  },

  // /**
  //  * Get list promotion by store
  //  */
  // getPromotions(storeId) {
  //   return session.get(RootAPI + 'customer/pmt-owned/' + storeId)
  // },

  /**
   * get point list of customer
   */
  getPointList () {
    return session.get(RootAPI + 'customer/point')
  },

  /**
   * get point detail list of customer
   */
  getPointDetailList (store_id) {
    return session.get(RootAPI + 'customer/point-detail/' + store_id)
  },

  /**
   * get available promo customer
   */
  getAvailablePromo () {
    return session.get(RootAPI + 'customer/pmt/owned')
  },

  /**
   * get expired promo customer
   */
  getExpiredPromo () {
    return session.get(RootAPI + 'customer/pmt/expired')
  },

  /**
   * get used promo customer
   */
  getUsedPromo () {
    return session.get(RootAPI + 'customer/pmt/used')
  },

  /**
   * Load notification
   */
  getNotification(params) {
    return session.post(RootAPI + 'customer/notification', params)
  },

  /**
   * Count notification is not read
   */
  countNotificationNotRead() {
    return session.get(RootAPI + 'customer/count-noti')
  },

  /**
   * Update notification is read
   */
  updateNotificationIsRead() {
    return session.get(RootAPI + 'customer/update-noti-is-read')
  },

  /**
   * Update info customer
   */
  updateInfo(req) {
    return session.post(RootAPI + 'customer/update-info', req)
  },

  /**
   * Get store by city
   */
  getStoreByCity(cityId) {
    return session.get(RootAPI + 'store/get-by-city/' + cityId)
  },

  /**
   * Search pmt
   */
  searchPmt(inputs) {
    return session.post(RootAPI + 'customer/search-pmt',inputs)
  },

  /**
   * Check point to buy pmt
   */
  checkPoint(pmtId) {
    return session.get(RootAPI + 'customer/check-point/' + pmtId)
  },

  /**
   * Buy pmt
   */
  buyPmt(pmtId) {
    return session.get(RootAPI + 'customer/buy-pmt/' + pmtId)
  },

  // /**
  //  * Get topping
  //  */
  // getTopping(storeId) {
  //   return session.get(RootAPI + 'topping/store/' + storeId)
  // },

  /**
   * Get store name
   */
  getStoreNameTableName(inputs) {
    return session.post(RootAPI + 'store/get-name',inputs)
  },

  /**
   * Get promotion detail
   */
  getPromotionDetail(id) {
    return session.get(RootAPI + 'promotion/' + id + "/customer")
  },

  /**
   * Get store config: use to check require login when order
   */
  getStoreConfig(params) {
    return session.post(RootAPI + "customer/get-store-config", params)
  },

  /**
   * Get list customer by store
   */
  getCustomerByStore(params) {
    return session.post(RootAPI + "customer/list-by-store", params)
  },

  /**
   * Get customer history
   */
  getCustomerHistory(params) {
    return session.post(RootAPI + "customer/get-customer-history", params)
  },

  /**
   * Add customer by store
   */
  addCustomerByStore(params) {
    return session.post(RootAPI + "customer/add-by-store", params)
  },

  /**
   * Add customer by staff
   */
  addCustomerByStaff(params) {
    return session.post(RootAPI + "customer/add-by-staff", params)
  },

  /**
   * Get customer detail by store
   */
  getCustomerDetailByStore(id) {
    return session.post(RootAPI + "customer/detail/" + id)
  },

  /**
   * Update customer by store
   */
  updateCustomerByStore(params) {
    return session.post(RootAPI + "customer/update-by-store", params)
  },
}
