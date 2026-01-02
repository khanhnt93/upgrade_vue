import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get setting by group
   */
  getSettingByGroup(params) {
    return session.post(RootAPI + 'setting/get-setting-by-group', params)
  },

  /**
   * Update store setting
   */
  updateStoreSetting(params) {
    return session.post(RootAPI + 'setting/update-store-setting', params)
  },

}
