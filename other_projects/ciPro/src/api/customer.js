import session from './session'
import { RootAPI } from './index'

export default {

  /**
   * Get list customer by store
   */
  getCustomerByStore(params, role) {
    if(role == "staff") {
      return session.post(RootAPI + "customer/list-by-staff", params)
    } else {
      return session.post(RootAPI + "customer/list-by-store", params)
    }

  },

  /**
   * Customer login
   */
  importCustomerFromExcelFile(req) {
    return session.post(RootAPI + 'customer/import-from-excel', req)
  },

  /**
   * Get customer detail by store
   */
  getCustomerDetailByStore(id, role) {
    if(role == "staff") {
      return session.post(RootAPI + "customer/detail-by-staff/" + id)
    } else {
      return session.post(RootAPI + "customer/detail/" + id)
    }

  },
  //
  //   /**
  //  * Get customer detail by staff
  //  */
  // getCustomerDetailByStaff(id) {
  //   return session.post(RootAPI + "customer/detail-by-staff/" + id)
  // },

  /**
   * Update customer by store
   */
  updateCustomerByStore(params) {
    return session.post(RootAPI + "customer/update-by-store", params)
  },

  /**
   * Add customer by store
   */
  addCustomerByStore(params) {
    return session.post(RootAPI + "customer/add-by-store", params)
  },

  /**
   * Save member config
   */
  saveMemberConfig(req) {
    return session.post(RootAPI + 'sys-config/add-update-member-config', req)
  },

  /**
   * Get member config
   */
  getMemberConfig() {
    return session.get(RootAPI + 'sys-config/member-detail')
  },

  /**
   * Get customer history
   */
  getCustomerHistory(params) {
    return session.post(RootAPI + "customer/get-customer-history", params)
  },

    /**
   * Get customer history
   */
  getCustomerHistoryByStaff(params) {
    return session.post(RootAPI + "customer/get-customer-history-by-staff", params)
  },

  /**
   * Get customer option
   */
  getCustomerOption() {
    return session.get(RootAPI + 'customer/get-customer-option')
  },

  /**
   * Get all customer
   */
  getAllCustomer(role) {
    if(role == "staff") {
      return session.get(RootAPI + 'customer/get-all-customer-by-staff')
    } else {
      return session.get(RootAPI + 'customer/get-all-customer')
    }

  },

  /**
   * Get staff options
   */
  getStaffOptions() {
    return session.get(RootAPI + 'staff/staff-option')
  },

  //   /**
  //  * Get staff options full
  //  */
  // getStaffOptionsFull() {
  //   return session.get(RootAPI + 'staff/staff-option-full')
  // },

  deleteCustomer(id) {
    return session.get(RootAPI + 'customer/delete/' + id)
   },

  /**
   * Update customer by store
   */
  updateCustomerFromOrderSell(params) {
    return session.post(RootAPI + "customer/update-customer-from-order-sell", params)
  },

  /**
   * Update customer by store
   */
  updateCustomerFromQuotation(params) {
    return session.post(RootAPI + "customer/update-customer-from-quotation", params)
  },
}
