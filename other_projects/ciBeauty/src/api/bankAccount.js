import session from './session'
import { RootAPI } from './index'

export default {
  /**
   * Get Bank options
   */
  getBankOptions() {
    return session.get(RootAPI + 'bank-account/get-bank-options')
  },

  /**
   * Get table BankAccount
   */
  getListBankAccount() {
    return session.get(RootAPI + 'bank-account/')
  },

  /**
   * Get BankAccount detail
   */
  getBankAccountDetail(id) {
    return session.get(RootAPI + 'bank-account/' + id)
  },

  /**
   * Edit BankAccount
   */
  editBankAccount(req) {
    return session.post(RootAPI + 'bank-account/update', req)
  },

  /**
   * Add BankAccount
   */
  addBankAccount(req) {
    return session.post(RootAPI + 'bank-account/add', req)
  },

  /**
   * Delete BankAccount
   */
  deleteBankAccount(tableId) {
    return session.get(RootAPI + 'bank-account/delete/' + tableId)
  },

  // /**
  //  * Get list bank-account option
  //  */
  // getListBankAccountOption () {
  //   return session.get(RootAPI + 'bank-account/list-option')
  // },
}
