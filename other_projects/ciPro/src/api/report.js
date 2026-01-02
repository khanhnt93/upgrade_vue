import session from './session'
import { RootAPI } from './index'

export default {
   /**
   * Get overview: today report
   */
   getOverView(params) {
    return session.post(RootAPI + 'report/get-overview', params)
   },

  /**
   * Get revenue
   */
  getRevenue(params) {
    return session.post(RootAPI + 'report/get-chart-revenue', params)
  },

  /**
   * Get repository
   */
  getRepositoryOverview() {
    return session.get(RootAPI + 'report/get-repository-overview')
  },

  /**
   * Get debt, public debt over view
   */
  getDebtAndPublicDebtOverview() {
    return session.get(RootAPI + 'report/get-debt-public-debt-overview')
  },

  /**
   * Get options related detail report
   */
  getOptionsRelatedDetailReport() {
    return session.get(RootAPI + 'report/get-option-related-detail-report')
  },

  /**
   * Get detail report
   */
  getDetailReport(params) {
    return session.post(RootAPI + 'report/get-detail-report', params)
  },

  /**
   * Get summary report
   */
  getSummaryReport(params) {
    return session.post(RootAPI + 'report/get-summary-report', params)
  },

  /**
   * Get options related detail report
   */
  getOptionsRelatedReport(params) {
    return session.post(RootAPI + 'report/get-option-related-report', params)
  },

  /**
   * Báo cáo hiệu quả kinh doanh: Lấy báo cáo khách hàng
   */
  getPerformanceCustomerReport(params) {
    return session.post(RootAPI + 'report/get-performance-customer-report', params)
  },

  /**
   * Báo cáo hiệu quả kinh doanh: Lấy báo cáo báo giá
   */
  getPerformanceQuotationReport(params) {
    return session.post(RootAPI + 'report/get-performance-quotation-report', params)
  },

  /**
   * Báo cáo hiệu quả kinh doanh: Lấy báo cáo báo giá chi tiết
   */
  getPerformanceQuotationDetailReport(params) {
    return session.post(RootAPI + 'report/get-performance-quotation-detail-report', params)
  },

  /**
   * Báo cáo hiệu quả kinh doanh: Lấy báo cáo chăm sóc báo giá
   */
  getPerformanceQuotationCareReport(params) {
    return session.post(RootAPI + 'report/get-performance-quotation-care-report', params)
  },

  /**
   * Báo cáo hiệu quả kinh doanh: Lấy báo cáo doanh thu, lợi nhuận, chi phi
   */
  getPerformanceRevenueProfitReport(params) {
    return session.post(RootAPI + 'report/get-performance-revenue-profit-report', params)
  },

  /**
   * Báo cáo khách hàng
   */
  getCustomerReport(params) {
    return session.post(RootAPI + 'report/get-customer-report', params)
  },

  /**
   * Báo cáo khách hàng: lấy ds đơn hàng bán
   */
  getOrderSellByCustomer(params) {
    return session.post(RootAPI + 'report/get-order-sell-by-customer', params)
  },

  /**
   * Báo cáo khách hàng: lấy ds đơn hàng bán
   */
  getQuotationByCustomer(params) {
    return session.post(RootAPI + 'report/get-quotation-by-customer', params)
  },

  /**
   * Báo cáo khách hàng: lấy ds đơn hàng bán
   */
  getDebtByCustomer(params) {
    return session.post(RootAPI + 'report/get-debt-by-customer', params)
  },

  /**
   * Báo cáo chi phí
   */
  getExpendReport(params) {
    return session.post(RootAPI + 'report/get-expend-report', params)
  },

}
