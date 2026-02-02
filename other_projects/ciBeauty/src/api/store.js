import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get spa info
   */
  getStoreInfo() {
    return session.get(RootAPI + 'store/get-store-info')
  },

  /**
   * Lưu nháp hóa đơn
   */
  saveStoreInfo(params) {
    return session.post(RootAPI + 'store/save-store-info', params)
  },

}
