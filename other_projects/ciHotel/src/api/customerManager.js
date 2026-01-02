import session from './session'
import { RootAPI } from './index'

export default {
    // for customer group
    getListCustomerGroup(params) {
        return session.get(RootAPI + 'customer-group/list', {params})
    },
    getCustomerGroupDetail(id) {
        return session.get(RootAPI + 'customer-group/detail/' + id)
    },
    addCustomerGroup(data) {
        return session.post(RootAPI + 'customer-group/add', data)
    },
    editCustomerGroup(data) {
        return session.put(RootAPI + 'customer-group/update', data)
    },
    deleteCustomerGroup(id) {
        return session.delete(RootAPI + 'customer-group/delete/'+ id)
    },
    // for customer api
    getListCustomer(params) {
        return session.get(RootAPI + 'customer-history/list', {params})
    },
    getCustomerDetail(id) {
        return session.get(RootAPI + 'customer-history/detail/' + id)
    },
    // addCustomer(data) {
    //     return session.post(RootAPI + 'customer-history/add', data)
    // },
    editCustomer(data) {
        return session.put(RootAPI + 'customer-history/update', data)
    },
    // deleteCustomer(id) {
    //     return session.delete(RootAPI + 'customer-history/delete/'+ id)
    // }
}