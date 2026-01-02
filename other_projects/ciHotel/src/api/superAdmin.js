import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get brand List
   */
  getBrandList (params) {
    return session.post(RootAPI + 'brand/search', params)
  },

  /**
   * Get Store List
   */
  getStoreList (req, param) {
    return session.post(RootAPI + 'store/search/?limit=10&offset=' + param, req)
  },

  /**
   * Delete store
   */
  deleteStore(storeId) {
    return session.get(RootAPI + 'store/delete/' + storeId)
  },

  /**
   * Delete brand
   */
  deleteBrand(brandId) {
    return session.get(RootAPI + 'brand/delete/' + brandId)
  },

  /**
   * Get brand options
   */
  getBrandOption() {
    return session.get(RootAPI + 'brand/list-options')
  },
  /**
   * Get brand options
   */
  getOptionType() {
    return session.get(RootAPI + 'hotel-type/list-options')
  },

  /**
   * Get store detail
   */
  getStoreDetail(storeId) {
    return session.get(RootAPI + 'store/' + storeId)
  },

  /**
   * Edit store
   */
  editStore(req) {
    return session.post(RootAPI + 'store/update', req)
  },

  /**
   * Add store
   */
  addStore(req) {
    return session.post(RootAPI + 'store/add', req)
  },

  /**
   * Get Store List
   */
  getHotelList (req, param) {
    return session.post(RootAPI + 'hotel/search/?limit=10&offset=' + param, req)
  },

  /**
   * Get store detail
   */
  getHotelDetail(storeId) {
    return session.get(RootAPI + 'hotel/' + storeId)
  },

  /**
   * Add store hotel
   */
  addHotel(req) {
    return session.post(RootAPI + 'hotel/add', req)
  },
  /**
   * Edit store hotel
   */
  editHotel(req) {
    return session.post(RootAPI + 'hotel/update', req)
  },
  /**
   * Delete hotel
   */
  deleteHotel(storeId) {
    return session.get(RootAPI + 'hotel/delete/' + storeId)
  },
  /**
   * Delete admin store
   */
  deleteAdminStore(storeId) {
    return session.get(RootAPI + 'admin-store/delete/' + storeId)
  },

  /**
   * search admin store
   */
  searchAdminStore(req, param) {
    return session.post(RootAPI + 'admin-store/search/?limit=10&offset=' + param, req)
  },

    /**
   * Get admin store detail
   */
  getAdminStoreDetail(adminStoreId) {
    return session.get(RootAPI + 'admin-store/' + adminStoreId)
  },

  /**
   * Edit admin store
   */
  editAdminStore(req) {
    return session.post(RootAPI + 'admin-store/update', req)
  },

  /**
   * Add admin store
   */
  addAdminStore(req) {
    return session.post(RootAPI + 'admin-store/add', req)
  },

  /**
   * Get Store List DB
   */
  getStoreListDB () {
    return session.get(RootAPI + 'hotel/list')
  },

  /**
   * Reset pass
   */
  resetPass (params) {
    return session.post(RootAPI + 'admin-store/reset-pass', params)
  },
}
