import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get product group detail
   */
   getOverViewInfo() {
    return session.get(RootAPI + 'overview/get-over-view-info')
   },
 
  /**
   * Get product group detail
   */
   getOverViewChart() {
    return session.get(RootAPI + 'overview/get-over-view-chart')
   },

   /**
   * Get statistic info
   */
   getStatisticInfo(params) {
    return session.post(RootAPI + 'overview/get-statistic-info', params)
   },
 
  /**
   * Get statistic chart
   */
   getStatisticChart(params) {
    return session.post(RootAPI + 'overview/get-statistic-chart', params)
   },
}
