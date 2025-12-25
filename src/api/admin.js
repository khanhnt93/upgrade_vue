import session from './session'
import { RootAPI } from './index'
import upload from './uploadFile'

export default {

  /**
   * Get list resource option
   */
  getListResourceOption () {
    return session.get(RootAPI + 'resource/list-option')
  },

  /**
   * Search staff
   */
  searchStaff(req) {
    return session.post(RootAPI + 'staff/search/',  req)
  },

  /**
   * Add staff
   */
  addStaff(req) {
    return session.post(RootAPI + 'staff/add', req)
  },

  /**
   * Edit staff
   */
  editStaff(req) {
    return session.post(RootAPI + 'staff/update', req)
  },

  /**
   * Get staff detail
   */
  getStaffDetail(staffId) {
    return session.get(RootAPI + 'staff/' + staffId)
  },

  /**
   * Get role options
   */
  getRoleOption() {
    return session.get(RootAPI + 'role/get-role-option')
  },

  /**
   * Delete staff
   */
  deleteStaff(staffId) {
    return session.get(RootAPI + 'staff/delete/' + staffId)
  },


  /**
   * Get system config
   */
  getSystemConfig() {
    return session.get(RootAPI + 'sys-config/detail')
  },

  /**
   * Save system config
   */
  saveSystemConfig(req) {
    return session.post(RootAPI + 'sys-config/add-update', req)
  },

  /**
   * Get report by staff
   */
  getReportByStaff(params) {
    return session.post(RootAPI + 'report/get-report-staff', params)
  },

  /**
   * Get report edit price
   */
  getReportEditPrice(params) {
    return session.post(RootAPI + 'report/get-report-edit-price', params)
  },

  /**
   * Search delete bill
   */
  searchDeleteBill(params) {
    return session.post(RootAPI + 'report/get-report-delete-bill', params)
  },

  /**
   * Get promotion report
   */
  getPromotionReport(params) {
    return session.post(RootAPI + 'report/get-promotion-report', params)
  },

  /**
   * Search brand bill
   */
  searchBrandBill(params) {
    return session.post(RootAPI + 'report/get-brand-report-bill', params)
  },

  /**
   * Get statistic
   */
  getStatistic(params) {
    return session.post(RootAPI + 'report/get-statistic', params)
  },

  /**
   * Get edit old bill report
   */
  getEditOldBillReport(params) {
    return session.post(RootAPI + 'report/get-report-edit-old-bill', params)
  },

  /**
   * Get brand statistic
   */
  getBrandStatistic(params) {
    return session.post(RootAPI + 'report/get-brand-statistic', params)
  },

  /**
   * Get chart profit and revenue
   */
  getChartProfitAndRevenue(params) {
    return session.post(RootAPI + 'report/get-chart-revenue', params)
  },

  /**
   * Get brand revenue
   */
  getBrandRevenue(params) {
    return session.post(RootAPI + 'report/get-brand-revenue', params)
  },

  /**
   * Get profit report
   */
  getProfitReport(params) {
    return session.post(RootAPI + 'report/get-profit-report', params)
  },

  /**
   * Get profit report by brand
   */
  getBrandProfitReport(params) {
    return session.post(RootAPI + 'report/get-brand-profit-report', params)
  },

  /**
   * Get report today
   */
  getReportToday() {
    return session.get(RootAPI + 'report/get-today-report')
  },

  /**
   * Get bill for today report
   */
  getBillForTodayReport() {
    return session.get(RootAPI + 'report/get-report-bill-today')
  },

  /**
   * Get list role
   */
   getListRole() {
    return session.get(RootAPI + 'role/list')
  },

  /**
   * Add brand
   */
  addBrand(params) {
    return session.post(RootAPI + 'brand/add', params)
  },

  /**
   * Get brand detail
   */
  getBrandDetail(id) {
    return session.get(RootAPI + 'brand/' +  id)
  },

  /**
   * Admin edit role
   */
  editRole(params) {
    return session.post(RootAPI + 'role/update', params)
  },

  /**
   * Admin add role
   */
  addRole(params) {
    return session.post(RootAPI + 'role/add', params)
  },

  /**
   * Update brand
   */
  updateBrand(params) {
    return session.post(RootAPI + 'brand/update', params)
  },

  /**
   * Admin delete role
   */
   deleteRole(id) {
    return session.post(RootAPI + 'role/delete/' + id)
  },

  /**
   * Get role detail
   */
   getRoleDetail(id) {
    return session.get(RootAPI + 'role/' + id)
  },

  /**
   * Get master screen
   */
   getMasterScreen() {
    return session.get(RootAPI + 'role/get-master-screen')
  },


  /**
   * Search resource
   */
  searchResource (params) {
    return session.post(RootAPI + 'resource/search', params)
  },

  /**
   * Search resource history
   */
  searchResourceHistory (params) {
    return session.post(RootAPI + 'resource/search-history', params)
  },

  /**
   * Get resource detail
   */
  getResourceDetail(id) {
    return session.get(RootAPI + 'resource/' + id)
  },

  /**
   * Delete resource
   */
  deleteResource(resourceId) {
    return session.get(RootAPI + 'resource/delete/' + resourceId)
  },

  /**
   * Edit resource
   */
  editResource(req) {
    return session.post(RootAPI + 'resource/update', req)
  },

  /**
   * Add resource
   */
  addResource(req) {
    return session.post(RootAPI + 'resource/add', req)
  },

  /**
   * Bonus quantity resource
   */
  bonusQuantityResource(params) {
    return session.post(RootAPI + 'resource/update-quantity', params)
  },

  /**
   * Get over view by brand
   */
  getOverViewByBrand() {
    return session.post(RootAPI + 'report/get-over-view-by-brand')
  },

  /**
   * Get store options by brand
   */
  getStoreOption() {
    return session.get(RootAPI + 'store/get-store-option-by-brand')
  },

}
