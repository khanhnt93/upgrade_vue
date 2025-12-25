import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get product group detail
   */
   getFundInfo() {
    return session.get(RootAPI + 'fund/get-fund-info')
   },
 
  /**
   * Get product group detail
   */
   getFundHistory(params) {
    return session.post(RootAPI + 'fund/get-fund-history', params)
   },
    
    /**
   * Get product group detail
   */
   transferMoney(params) {
    return session.post(RootAPI + 'fund/transfer-money', params)
   },

    /**
   * Get product group detail
   */
   getEIBookHistory(id) {
    return session.get(RootAPI + 'fund/get-ei-book-history/' + id)
   },
}
