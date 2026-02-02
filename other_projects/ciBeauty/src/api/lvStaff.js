import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get danh sách DV theo group 
   */
  getListLvStaff() {
    return session.get(RootAPI + 'lv-staff/get-list')
  },

  /**
   * Add
   */
  addLvStaff(params) {
    return session.post(RootAPI + 'lv-staff/add', params)
  },

  /**
   * Update
   */
  updateLvStaff(params) {
    return session.post(RootAPI + 'lv-staff/update', params)
  },

  /**
   * delete
   */
  deleteLvStaff(id) {
    return session.get(RootAPI + 'lv-staff/delete/' + id)
  },

}
