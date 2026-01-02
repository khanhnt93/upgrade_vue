import session from './session'
import { RootAPI } from './index'

export default {
   /**
   * Get overview: today report
   */
   getOverView() {
    return session.get(RootAPI + 'report/get-overview')
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
   * Get bill report
   */
  getBillReport(params) {
    return session.post(RootAPI + 'report/get-report-bill', params)
  },

}
