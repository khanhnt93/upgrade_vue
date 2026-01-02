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
   * Cập nhật tiền vào quỹ: thêm, bớt
   */
  updateMoney(params) {
    return session.post(RootAPI + 'fund/update-fund', params)
  },

}
