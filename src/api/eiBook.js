import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get product group detail
   */
   getAllEIBook() {
    return session.get(RootAPI + 'ei-book/list')
   },
 
  /**
   * Get product group detail
   */
   getEIBookDetail(ei_book_id) {
    return session.get(RootAPI + 'ei-book/detail/' + ei_book_id)
   },

  /**
   * Add new product group
   */
   addEIBook(params) {
    return session.post(RootAPI + 'ei-book/add', params)
   },

   /**
   * Update product group
   */
   updateEIBook(params) {
    return session.post(RootAPI + 'ei-book/update', params)
   },

   /**
   * Delete product group
   */
   deleteEIBook(ei_book_id) {
    return session.get(RootAPI + 'ei-book/delete/' + ei_book_id)
   },
}
