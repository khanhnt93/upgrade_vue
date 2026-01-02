import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get table unit
   */
  getListUnit() {
    return session.get(RootAPI + 'unit/')
  },

  /**
   * Get unit detail
   */
  getUnitDetail(id) {
    return session.get(RootAPI + 'unit/' + id)
  },

  /**
   * Edit unit
   */
  editUnit(req) {
    return session.post(RootAPI + 'unit/update', req)
  },

  /**
   * Add unit
   */
  addUnit(req) {
    return session.post(RootAPI + 'unit/add', req)
  },

  /**
   * Delete unit
   */
  deleteUnit(tableId) {
    return session.get(RootAPI + 'unit/delete/' + tableId)
  },

  /**
   * Get list unit option
   */
  getListUnitOption () {
    return session.get(RootAPI + 'unit/list-option')
  },
}
