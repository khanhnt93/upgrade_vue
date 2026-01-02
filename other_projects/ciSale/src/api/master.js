import session from './session'
import { RootAPI } from './index'

export default {
    /**
   * Get city options
   */
  getCityOptions () {
    return session.post(RootAPI + 'master/city')
  },

  /**
   * Get district options
   */
  getDistrictOptions (cityId) {
    return session.post(RootAPI + 'master/city/' + cityId + '/district')
  },
}
