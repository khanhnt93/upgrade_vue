import session from './session'
import { RootAPI } from './index'
import upload from './uploadFile'

export default {
  /**
   * Get General Information
   */
   getGeneralInfo (params) {
    return session.get(RootAPI + "general-info/" + params)
   },
  /**
   * Search menu
   */
  searchMenu (params) {
    return session.post(RootAPI + 'menu/search-by-staff/', params)
  },

  /**
   * Save price food by sale channel
   */
  savePriceFoodBySaleChannel (params) {
    return session.post(RootAPI + 'sale-channel/save-food-price', params)
  },

  /**
   * Get list group menu option
   */
  getListGroupMenuOption () {
    return session.get(RootAPI + 'group-menu/list-options')
  },

  /**
   * Get list resource option
   */
  getListResourceOption () {
    return session.get(RootAPI + 'resource/list-option')
  },

  /**
   * Get list sale channel option
   */
  getListSaleChannelOption () {
    return session.get(RootAPI + 'sale-channel/list-option')
  },

  /**
   * Get food by sale channel
   */
  getFoodBySaleChannel (id) {
    return session.get(RootAPI + 'sale-channel/get-food-by-sale-channel/' + id)
  },

  /**
   * Get menu detail
   */
  getMenuDetail(menuId) {
    return session.get(RootAPI + 'menu/' + menuId)
  },

  /**
   * Delete menu
   */
  deleteMenu(menuId) {
    return session.get(RootAPI + 'menu/delete/' + menuId)
  },

  /**
   * Add menu
   */
  addMenu (params) {
    // return session.post(RootAPI + 'menu/add', params)
    return upload.post(RootAPI + 'menu/add', params)
  },

  /**
   * Edit menu
   */
  editMenu (params) {
    // return session.post(RootAPI + 'menu/update', params)
    return upload.post(RootAPI + 'menu/update', params)
  },

  /**
   * Edit store info
   */
  updateStoreInfo (params) {
    return upload.post(RootAPI + 'store/update-store-info', params)
  },

  /**
   * Update order status to approved
   */
  updateOrderStatusToApproved(params) {
    return session.post(RootAPI + 'staff/update-order-status-to-approved', params)
  },

  /**
   * Update order status to approved
   */
  updateRequestStatusToFinish(params) {
    return session.post(RootAPI + 'staff/update-request-status-to-finish', params)
  },

  /**
   * Update order status to canceled
   */
  updateOrderStatusToCanceled(params) {
    return session.post(RootAPI + 'staff/update-order-status-to-canceled', params)
  },

  /**
   * Update order status to doing
   */
  updateOrderStatusToDoing(params) {
    return session.post(RootAPI + 'staff/update-order-status-to-doing', params)
  },

  /**
   * Update order status to done
   */
  updateOrderStatusToDone(params) {
    return session.post(RootAPI + 'staff/update-order-status-to-done', params)
  },

  /**
   * Update order status to finished
   */
  updateOrderStatusToFinish(params) {
    return session.post(RootAPI + 'staff/update-order-status-to-finished', params)
  },

  /**
   * Search staff
   */
  searchStaff(req, param) {
    return session.post(RootAPI + 'staff/search/?limit=10&offset=' + param,  req)
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
   * Get promotion list
   */
  getPromoList(params) {
    return session.post(RootAPI + 'promotion/staff', params)
  },

  /**
   * Delete promotion
   */
  deletePromo(params) {
    return session.post(RootAPI + 'promotion/delete', params)
  },

  /**
   * Get promotion detail
   */
  getPromoDetail(staffId) {
    return session.get(RootAPI + 'promotion/' + staffId + '/staff')
  },

  /**
   * Edit promo
   */
  editPromo(params) {
    return session.post(RootAPI + 'promotion/update-pmt', params)
  },

  /**
   * Add promo
   */
  addPromo(params) {
    return session.post(RootAPI + 'promotion/add-pmt', params)
  },

  /**
   * Get table list
   */
  getTableListOption() {
    return session.get(RootAPI + 'table/list')
  },

  /**
   * Get table list by counter
   */
  getTableListByCounter() {
    return session.get(RootAPI + 'table/list-by-counter')
  },

  /**
   * Get table list
   */
  getTableList() {
    return session.get(RootAPI + 'table/')
  },

  /**
   * Get table detail
   */
  getTableDetail(tableId) {
    return session.get(RootAPI + 'table/' + tableId)
  },

  /**
   * Edit table
   */
  editTable(req) {
    return session.post(RootAPI + 'table/update', req)
  },

  /**
   * Add table
   */
  addTable(req) {
    return session.post(RootAPI + 'table/add', req)
  },

  /**
   * Delete table
   */
  deleteTable(tableId) {
    return session.get(RootAPI + 'table/delete/' + tableId)
  },

  /**
   * Get system config
   */
  getSystemConfig() {
    return session.get(RootAPI + 'sys-config/detail')
  },

  /**
   * Get member config
   */
  getMemberConfig() {
    return session.get(RootAPI + 'sys-config/member-detail')
  },

  /**
   * Save system config
   */
  saveSystemConfig(req) {
    return session.post(RootAPI + 'sys-config/add-update', req)
  },

  /**
   * Save member config
   */
  saveMemberConfig(req) {
    return session.post(RootAPI + 'sys-config/add-update-member-config', req)
  },

  /**
   * Load order history
   */
  loadOrderHistory(data) {
    return session.post(RootAPI + 'staff/order-his', data)
  },

  /**
   * Load order history for kitchen
   */
  loadOrderHistoryForKitchen(data) {
    return session.post(RootAPI + 'staff/order-his-for-kitchen', data)
  },

  /**
   * Load order history for kitchen
   */
  loadOrderHistoryForStaff(data) {
    return session.post(RootAPI + 'staff/order-his-for-staff', data)
  },

  /**
   * Save notification
   */
  saveNotification(noti) {
    return session.post(RootAPI + 'staff/add-notification', noti)
  },

  /**
   * Search topping
   */
  searchTopping() {
    return session.get(RootAPI + 'topping/list')
  },

  /**
   * Search sale channel
   */
  getListSaleChannel() {
    return session.get(RootAPI + 'sale-channel/list')
  },

  /**
   * Add topping
   */
  addTopping(topping) {
    return session.post(RootAPI + 'topping/add', topping)
  },

  /**
   * Get topping detail
   */
  getToppingDetail(toppingId) {
    return session.get(RootAPI + 'topping/' + toppingId)
  },

  /**
   * Update topping
   */
  updateTopping(topping) {
    return session.post(RootAPI + 'topping/update', topping)
  },

  /**
   * Delete topping
   */
  deleteTopping(toppingId) {
    return session.get(RootAPI + 'topping/delete/' + toppingId)
  },

  /**
   * Delete sale channel
   */
  deleteSaleChannel(id) {
    return session.get(RootAPI + 'sale-channel/delete/' + id)
  },

  /**
   * Search order history
   */
  searchOrderHistory(order) {
    return session.post(RootAPI + 'staff/search-order-his', order)
  },

  /**
   * Search total order history
   */
  searchTotalOrderHistory(order) {
    return session.post(RootAPI + 'staff/search-total-order-his', order)
  },

  /**
   * Delete bill
   */
  deleteBill(billId) {
    return session.get(RootAPI + 'staff/delete-bill/' + billId)
  },

  /**
   * Get list promotion type
   */
  getListPromotionType() {
    return session.get(RootAPI + 'promotion/get-promo-type')
  },

  /**
   * Get list free item
   */
  getListFreeItem() {
    return session.get(RootAPI + 'menu/get-free-item')
  },

  /**
   * Search group menu
   */
  searchGroupMenu() {
    return session.get(RootAPI + 'group-menu/list')
  },

  /**
   * Get group menu detail
   */
  getGroupMenuDetail(groupMenuId) {
    return session.get(RootAPI + 'group-menu/detail/' + groupMenuId)
  },

  /**
   * Update group menu
   */
  updateGroupMenu(groupMenu) {
    return session.post(RootAPI + 'group-menu/update', groupMenu)
  },

  /**
   * Add group menu
   */
  addGroupMenu(groupMenu) {
    return session.post(RootAPI + 'group-menu/add', groupMenu)
  },

  /**
   * Delete group menu
   */
  deleteGroupMenu(id) {
    return session.get(RootAPI + 'group-menu/delete/' + id)
  },

  // /**
  //  * Get promotion owned by store
  //  */
  // getPmtOwnedByStore() {
  //   return session.get(RootAPI + 'promotion/get-promo-owned-by-store')
  // },

  /**
   * Staff change table
   */
  changeTable(table) {
    return session.post(RootAPI + 'staff/change-table', table)
  },

  /**
   * Staff merge table
   */
  mergeTable(table) {
    return session.post(RootAPI + 'staff/merge-table', table)
  },

  /**
   * Staff get payment info
   */
  getPaymentInfo(id) {
    return session.post(RootAPI + 'booking/get-payment-info/' + id)
  },

    /**
   * Staff get payment info for print
   */
  getPaymentInfoForPrint(id) {
    return session.post(RootAPI + 'booking/get-payment-info-for-print/' + id)
  },

  /**
   * Staff get payment info for edit bill
   */
  getPaymentInfoForEditBill(id) {
    return session.get(RootAPI + 'booking/get-payment-info-for-edit-bill/' + id)
  },

  /**
   * Staff search old bill
   */
  searchReportBill(params) {
    return session.post(RootAPI + 'report/search-report-bill',params)
  },

  /**
   * Staff delete old bill
   */
  deleteOldBill(params) {
    return session.post(RootAPI + 'report/delete-bill',params)
  },
  /**
   * Staff add edit bill history
   */
  addEditBillHistory(params) {
    return session.post(RootAPI + 'report/add-edit-bill-history',params)
  },





  /**
   * Check promotion
   */
  checkPromotion(payment) {
    return session.post(RootAPI + 'promotion/check-pmt', payment)
  },

  /**
   * Search customer
   */
  searchCustomer(params) {
    return session.post(RootAPI + 'staff/search-customer', params)
  },

  /**
   * Confirm payment
   */
  confirmPayment(params) {
    return session.post(RootAPI + 'staff/confirm-payment', params)
  },

  /**
   * Search bill
   */
  searchBill(params) {
    return session.post(RootAPI + 'report/get-repost-bill', params)
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
   * Get pmt of store
   */
  getPmtOfStore() {
    return session.get(RootAPI + 'promotion/get-promo-by-store')
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
    return session.post(RootAPI + 'report/get-chart-profit-revenue', params)
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
   * Staff get order info
   */
  getOrderInfo(payment) {
    return session.post(RootAPI + 'staff/get-order-info', payment)
  },

  /**
   * Staff send cancel food
   */
  sendCancelFood(orderInfo) {
    return session.post(RootAPI + 'staff/send-cancel-food', orderInfo)
  },

  /**
   * Staff send cancel order
   */
  sendCancelOrder(orderInfo) {
    return session.post(RootAPI + 'staff/send-cancel-order', orderInfo)
  },

  /**
   * Admin confirm cancel order
   */
  confirmCancelOrder(orderInfo) {
    return session.post(RootAPI + 'staff/confirm-cancel-order', orderInfo)
  },

  /**
   * Admin confirm cancel order
   */
  confirmCancelFood(orderInfo) {
    return session.post(RootAPI + 'staff/confirm-cancel-food', orderInfo)
  },

  /**
   * Staff send request clean table
   */
  cleanTbale(params) {
    return session.post(RootAPI + 'staff/clean-table', params)
  },

  /**
   * Admin search black list
   */
  searchBlackList(params) {
    return session.post(RootAPI + 'black-list/search', params)
  },

  /**
   * Get list role
   */
   getListRole() {
    return session.get(RootAPI + 'role/list')
  },

  /**
   * Admin add black list
   */
  addBlackList(params) {
    return session.post(RootAPI + 'black-list/add', params)
  },

  /**
   * Add brand
   */
  addBrand(params) {
    return session.post(RootAPI + 'brand/add', params)
  },

  /**
   * Admin add black list
   */
  getBlackListDetail(id) {
    return session.get(RootAPI + 'black-list/' +  id)
  },

  /**
   * Get brand detail
   */
  getBrandDetail(id) {
    return session.get(RootAPI + 'brand/' +  id)
  },

  /**
   * Admin edit black list
   */
  editBlackList(params) {
    return session.post(RootAPI + 'black-list/update', params)
  },

  /**
   * Admin edit role
   */
  editRole(params) {
    return session.post(RootAPI + 'role/update', params)
  },

  /**
   * Admin edit sale channel
   */
  editSaleChannel(params) {
    return session.post(RootAPI + 'sale-channel/update', params)
  },

  /**
   * Admin add role
   */
  addRole(params) {
    return session.post(RootAPI + 'role/add', params)
  },

  /**
   * Admin add sale channel
   */
  addSaleChannel(params) {
    return session.post(RootAPI + 'sale-channel/add', params)
  },

  /**
   * Update brand
   */
  updateBrand(params) {
    return session.post(RootAPI + 'brand/update', params)
  },

  /**
   * Admin delete black list
   */
  deleteBlackList(id) {
    return session.post(RootAPI + 'black-list/delete/' + id)
  },

  /**
   * Admin delete role
   */
   deleteRole(id) {
    return session.post(RootAPI + 'role/delete/' + id)
  },

  /**
   * Get topping
   */
  getTopping() {
    return session.get(RootAPI + 'topping/get-topping')
  },
  /**
   * Staff print bill
   */
  printBill(payment) {
    return session.post(RootAPI + 'staff/get-bill-info-for-print', payment)
  },

  /**
   * Update customer into order
   */
  updateCustomerIntoOrder(params) {
    return session.post(RootAPI + 'staff/update-cus-into-order', params)
  },

  /**
   * Get table unit
   */
  getListUnit() {
    return session.get(RootAPI + 'unit/')
  },

  /**
   * Get unit detail
   */
  getUnitDetail(id) {
    return session.get(RootAPI + 'unit/' + id)
  },

  /**
   * Get role detail
   */
   getRoleDetail(id) {
    return session.get(RootAPI + 'role/' + id)
  },

  /**
   * Get sale channel detail
   */
   getSaleChannelDetail(id) {
    return session.get(RootAPI + 'sale-channel/' + id)
  },

  /**
   * Get master screen
   */
   getMasterScreen() {
    return session.get(RootAPI + 'role/get-master-screen')
  },

  /**
   * Edit unit
   */
  editUnit(req) {
    return session.post(RootAPI + 'unit/update', req)
  },

  /**
   * Add unit
   */
  addUnit(req) {
    return session.post(RootAPI + 'unit/add', req)
  },

  /**
   * Delete unit
   */
  deleteUnit(tableId) {
    return session.get(RootAPI + 'unit/delete/' + tableId)
  },

  /**
   * Get list unit option
   */
  getListUnitOption () {
    return session.get(RootAPI + 'unit/list-option')
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
   * Get over view
   */
  getOverView() {
    return session.get(RootAPI + 'report/get-over-view-today-report')
  },

  /**
   * Get today report
   */
  getTodayReport(params) {
    return session.post(RootAPI + 'report/get-total-report', params)
  },

  /**
   * Get over view by brand
   */
  getOverViewByBrand() {
    return session.post(RootAPI + 'report/get-over-view-by-brand')
  },

  /**
   * Update order status to finished
   */
  confirmUpdateResource(params) {
    return session.post(RootAPI + 'resource/update-resource-when-cancel', params)
  },

  /**
   * Get printer info
   */
  getPrinterInfo() {
    return session.get(RootAPI + 'sys-config/detail-printer')
  },

  /**
   * Get store info
   */
  getStoreInfo() {
    return session.get(RootAPI + 'store/get-detail-store-info')
  },

  /**
   * Save printer info
   */
  savePrinterInfo(params) {
    return session.post(RootAPI + 'sys-config/add-update-printer', params)
  },

  /**
   * Upload image printer
   */
  uploadImagePrinter(params) {
    return session.post(RootAPI + 'sys-config/upload-image-print-template', params)
  },

  /**
   * Delete image printer
   */
  deleteImagePrinter(params) {
    return session.post(RootAPI + 'sys-config/delete-image-print-template', params)
  },

  /**
   * Save money box
   */
  saveMoneyBox(params) {
    return session.post(RootAPI + 'money-box/add', params)
  },

  /**
   * Get money box detail
   */
  getMoneyBoxDetail(params) {
    //return session.post(RootAPI + 'money-box/detail', params)
    return session.post(RootAPI + 'report/get-today-report', params)
  },

  /**
   * Search money box history
   */
  searchMoneyBoxHistory (params) {
    return session.post(RootAPI + 'money-box/search', params)
  },

  /**
   * Get staff option
   */
  getStaffOption (params) {
    return session.post(RootAPI + 'staff/staff-option', params)
  },

  /**
   * Close day
   */
  closeDay () {
    return session.get(RootAPI + 'money-box/close-day')
  },

  /**
   * Get store options by brand
   */
  getStoreOption() {
    return session.get(RootAPI + 'store/get-store-option-by-brand')
  },

  /**
   * Get kitchen area
   */
  getKitchenArea() {
    return session.get(RootAPI + 'kitchen-area/list')
  },

  /**
   * Get kitchen area detail
   */
  getKitchenAreaDetail(id) {
    return session.get(RootAPI + 'kitchen-area/detail/' + id)
  },

  /**
   * Add kitchen area
   */
  addKitchenArea(params) {
    return session.post(RootAPI + 'kitchen-area/add', params)
  },

  /**
   * Edit kitchen area
   */
  editKitchenArea(params) {
    return session.post(RootAPI + 'kitchen-area/update', params)
  },

  /**
   * Delete kitchen area
   */
  deleteKitchenArea(id) {
    return session.get(RootAPI + 'kitchen-area/delete/' + id)
  },

  /**
   * Get master language
   */
  getMasterLanguage() {
    return session.get(RootAPI + 'language/get-master-and-store-language')
  },

  /**
   * Save store language
   */
  saveStoreLanguage(langguages) {
    return session.post(RootAPI + 'language/save-store-language', langguages)
  },

  /**
   * Get store language
   */
  getStoreLanguage() {
    return session.get(RootAPI + 'language/get-store-language')
  },

  /**
   * Save store name multiple language
   */
  saveStoreNameMultipleLanguage(params) {
    return session.post(RootAPI + 'language/save-store-name-multiple-language', params)
  },

  /**
   * Save group menu multiple language
   */
  saveGroupMenuMultipleLanguage(params) {
    return session.post(RootAPI + 'language/save-group-menu-multiple-language', params)
  },

  /**
   * Save topping multiple language
   */
  saveToppingMultipleLanguage(params) {
    return session.post(RootAPI + 'language/save-topping-multiple-language', params)
  },

  /**
   * Save menu multiple language
   */
  saveMenuMultipleLanguage(params) {
    return session.post(RootAPI + 'language/save-menu-multiple-language', params)
  },

  /**
   * Get store name multiple language
   */
  getStoreNameMultipleLanguage() {
    return session.get(RootAPI + 'language/get-list-store-name-multiple-language')
  },

  /**
   * Get group menu multiple language
   */
  getGroupMenuMultipleLanguage() {
    return session.get(RootAPI + 'language/get-list-group-menu-multiple-language')
  },

  /**
   * Get topping multiple language
   */
  getToppingMultipleLanguage() {
    return session.get(RootAPI + 'language/get-list-topping-multiple-language')
  },

  /**
   * Get menu multiple language
   */
  getMenuMultipleLanguage() {
    return session.get(RootAPI + 'language/get-list-menu-multiple-language')
  },
  /**
   * Get Floor
   */
  getFloor() {
    return session.get(RootAPI + 'floor/list')
  },
  /**
   * Get Floor detail
   */
  getFloorDetail(id) {
    return session.get(RootAPI + 'floor/detail/' + id)
  },

  /**
   * Add Floor area
   */
  addFloor(params) {
    return session.post(RootAPI + 'floor/add', params)
  },

  /**
   * Edit Floor area
   */
  editFloor(params) {
    return session.post(RootAPI + 'floor/update', params)
  },

  /**
   * Delete Floor area
   */
  deleteFloor(id) {
    return session.get(RootAPI + 'floor/delete/' + id)
  },



  getRoomType() {
    return session.get(RootAPI + 'room-type/list')
  },
  /**
   * Get Floor detail
   */
  getRoomTypeDetail(id) {
    return session.get(RootAPI + 'room-type/detail/' + id)
  },

  /**
   * Add Floor area
   */
  addRoomType(params) {
    return session.post(RootAPI + 'room-type/add', params)
  },

  /**
   * Edit Floor area
   */
  editRoomType(params) {
    return session.post(RootAPI + 'room-type/update', params)
  },

  /**
   * Delete Floor area
   */
  deleteRoomType(id) {
    return session.get(RootAPI + 'room-type/delete/' + id)
  },


  getRoomStatus() {
    return session.get(RootAPI + 'room-status/list')
  },
  /**
   * Get Floor detail
   */
  getRoomStatusDetail(id) {
    return session.get(RootAPI + 'room-status/detail/' + id)
  },

  /**
   * Add Floor area
   */
  addRoomStatus(params) {
    return session.post(RootAPI + 'room-status/add', params)
  },

  /**
   * Edit Floor area
   */
  editRoomStatus(params) {
    return session.post(RootAPI + 'room-status/update', params)
  },

  /**
   * Delete Floor area
   */
  deleteRoomStatus(id) {
    return session.get(RootAPI + 'room-status/delete/' + id)
  },


  getRoomTypeInfo() {
    return session.get(RootAPI + 'room-type-info/list')
  },
  /**
   * Get Floor detail
   */
  getRoomTypeInfoDetail(id) {
    return session.get(RootAPI + 'room-type-info/detail/' + id)
  },

  /**
   * Add Floor area
   */
  addRoomTypeInfo(params) {
    return session.post(RootAPI + 'room-type-info/add', params)
  },

  /**
   * Edit Floor area
   */
  editRoomTypeInfo(params) {
    return session.post(RootAPI + 'room-type-info/update', params)
  },

  /**
   * Delete Floor area
   */
  deleteRoomTypeInfo(id) {
    return session.get(RootAPI + 'room-type-info/delete/' + id)
  },



  getRoomDevice() {
    return session.get(RootAPI + 'room-device/list')
  },
  /**
   * Get Floor detail
   */
  getRoomDeviceDetail(id) {
    return session.get(RootAPI + 'room-device/detail/' + id)
  },

  /**
   * Add Floor area
   */
  addRoomDevice(params) {
    return session.post(RootAPI + 'room-device/add', params)
  },

  /**
   * Edit Floor area
   */
  editRoomDevice(params) {
    return session.post(RootAPI + 'room-device/update', params)
  },

  /**
   * Delete Floor area
   */
  deleteRoomDevice(id) {
    return session.get(RootAPI + 'room-device/delete/' + id)
  },



  getRoomService() {
    return session.get(RootAPI + 'room-service/list')
  },
  /**
   * Get Floor detail
   */
  getRoomServiceDetail(id) {
    return session.get(RootAPI + 'room-service/detail/' + id)
  },

  /**
   * Add Floor area
   */
  addRoomService(params) {
    return session.post(RootAPI + 'room-service/add', params)
  },

  /**
   * Edit Floor area
   */
  editRoomService(params) {
    return session.post(RootAPI + 'room-service/update', params)
  },
  /**
  * Edit Floor area
  */
  deleteRoomService(params) {
    return session.get(RootAPI + 'room-service/delete/' + params)
 },

  /**
   * Update room state
   */
  updateRoomState(params) {
    return session.post(RootAPI + 'room/update-room-state', params)
  },

  getRoom(params) {
    return session.post(RootAPI + 'room/list', params)
  },
  getBooking(params) {
    return session.post(RootAPI + 'booking/list', params)
  },

    /**
     * Get total info
     */
  getTotalInfo() {
    return session.get(RootAPI + 'booking/get-total-info')
  },

  addBooking(params) {
    return session.post(RootAPI + 'booking/add', params)
  },

  // Edit booking info
  editBooking(params) {
    return session.post(RootAPI + 'booking/update-booking-info', params)
  },

  // Get list empty room
  getListEmptyRoom(roomId) {
    return session.get(RootAPI + 'booking/get-list-empty-room/' + roomId)
  },

  // Confirm change room
  confirmChangeRoom(params) {
    return session.post(RootAPI + 'booking/confirm-change-room', params)
  },

  // Check in
  checkIn(params) {
    return session.post(RootAPI + 'booking/check-in', params)
  },

  // Update check in info
  updateCheckInInfo(params) {
    return session.post(RootAPI + 'booking/update-check-in-info', params)
  },

  leaveBooking(params) {
    return session.post(RootAPI + 'booking/leave', params)
  },
  searchBooking(params) {
    return session.post(RootAPI + 'booking/search', params)
  },
  updatePaymentInfo(params) {
    return session.post(RootAPI + 'booking/update-payment-info', params)
  },
  updatePaymentInfoForEditBill(params) {
    return session.post(RootAPI + 'booking/update-payment-info-for-edit-bill', params)
  },

  getSearchBooking(params) {
    return session.post(RootAPI + 'booking/search-room-list', params)
  },
  getCreateBooking(params) {
    return session.post(RootAPI + 'booking/search-booking-list', params)
  },
  deleteBookingInfo(id) {
    return session.get(RootAPI + 'booking/delete-booking-info/' + id)
  },

    /**
     * Search check in info
     */
  searchCheckInInfo(params) {
    return session.post(RootAPI + 'booking/search-check-in-info', params)
  },

  /**
   * Save money refund
   */
  saveMoneyRefund(params) {
    return session.post(RootAPI + 'booking/save-money-refund', params)
  },

  updatePayingMoney(params) {
    return session.post(RootAPI + 'booking/update-paying-info', params)
  },
  confirmPaymentBooking(params) {
    return session.post(RootAPI + 'booking/confirm-payment', params)
  },

  /**
   * Get booking detail
   */
  getBookingDetail(id) {
    return session.get(RootAPI + 'booking/detail/' + id)
  },

  /**
   * Get Floor detail
   */
  getRoomDetail(id) {
    return session.get(RootAPI + 'room/detail/' + id)
  },

  /**
   * Add Floor area
   */
  addRoom(params) {
    return session.post(RootAPI + 'room/add', params)
  },

  /**
   * Edit Floor area
   */
  editRoom(params) {
    return session.post(RootAPI + 'room/update', params)
  },

  /**
   * Delete Floor area
   */
  deleteRoom(id) {
    return session.get(RootAPI + 'room/delete/' + id)
  },
  getListGroupRoomOption () {
    return session.get(RootAPI + 'room/list-options')
  },
  /**
   * Get list group menu option
   */
  getListGroupFloorOption () {
    return session.get(RootAPI + 'floor/list-options')
  },

  /**
   * Get options related room
   */
  getOptionRelatedRoom () {
    return session.get(RootAPI + 'room/get-option-related-room')
  },

  /**
   * Get list group menu option
   */
  getListGroupRoomStatusOption () {
    return session.get(RootAPI + 'room-status/list-options')
  },
  /**
   * Get list group menu option
   */
  getListGroupRoomTypeOption () {
    return session.get(RootAPI + 'room-type/list-options')
  },
  /**
   * Get list group menu option
   */
  getListGroupRoomInfoOption () {
    return session.get(RootAPI + 'room-type-info/list-options')
  },
  /**
   * Get list group menu option
   */
  getListGroupRoomDeviceOption () {
    return session.get(RootAPI + 'room-device/list-options')
  },
  /**
   * Get list group menu option
   */
  getListGroupServiceOption () {
    return session.get(RootAPI + 'room-service/list-options')
  },

  getListGroupMasterOption () {
    return session.get(RootAPI + 'master-time/list-options')
  },

  /**
   * Edit Floor area
   */
  updatePaymentNote(params) {
    return session.post(RootAPI + 'booking/update-payment-note', params)
  },
}
