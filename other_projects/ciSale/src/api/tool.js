import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Cafe: tính toán số lượng dựa trên % tạp và độ ấm
   */
  calQuantityByImpuritiesAndMoisture(params) {
    return session.post(RootAPI + 'tool/cafe-cal-by-impurities-and-moisture', params)
  },

}
