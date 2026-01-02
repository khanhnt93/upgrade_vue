import commonFunc from '@/common/commonFunc'
export default {
  mapStaffModelToDto (staff) {
    return {
      id: staff.pk,
      userName: staff.fields.name,
      phoneNumber: staff.fields.phone_number,
      roleId: staff.fields.role_id,
      role: staff.fields.role_name,
      storeId: staff.fields.store_id,
      cityId: staff.fields.city_id,
      isRoot: staff.fields.is_root,
      isSuper: staff.fields.is_super,
      userType: "staff",
    }
  },
  mapStaffModelSearchToDto (staffs, offset) {
    let result = []

    var stt = offset
    for (var index in staffs) {
      stt = stt + 1

      let roleName = staffs[index].fields.role_name
      if(roleName == "ADMIN") {
        roleName = "Quản lý"
      }
      if(roleName == "CASHIER") {
        roleName = "Thu ngân"
      }
      if(roleName == "STAFF") {
        roleName = "Phục vụ"
      }
      if(roleName == "KITCHEN") {
        roleName = "Bếp"
      }

      let staffTemp = {
        stt: stt
        , name: staffs[index].fields.name
        , phone: staffs[index].fields.phone_number
        , permission: roleName
        , createDate: commonFunc.formatDate(staffs[index].fields.created_at)
        , id: staffs[index].pk
      }
      result.push(staffTemp)
    }
    return result
  },

  /**
   * Mapping admin store to dto
   */
  mapAdminStoreModelToDto(staff) {
    return {
      "id": staff.pk,
      "name": staff.fields.name,
      "phone_number": staff.fields.phone_number,
      "role_id": staff.fields.role_id,
    }
  },

   /**
   * Mapping admin store detail to dto
   */
  mapAdminStoreToDto (staffs, offset) {
    let result = []

    var stt = offset
    for (var index in staffs) {
      stt = stt + 1
      let staffTemp = {
        stt: stt
        , name: staffs[index].fields.name
        , phone: staffs[index].fields.phone_number
        , store: staffs[index].fields.store_name
        , permission: staffs[index].fields.role_name
        , createDate: commonFunc.formatDate(staffs[index].fields.created_at)
        , id: staffs[index].pk
      }
      result.push(staffTemp)
    }
    return result
  },
  /**
  * Mapping admin store detail to dto
  */
  mapAdminStoreDetailModelToDto(adminStore) {
    return {
      "name": adminStore.fields.name,
      "phone_number": adminStore.fields.phone_number,
      "password": adminStore.fields.password,
      "role_id": adminStore.fields.role_id,
      "store_id": adminStore.fields.store_id,
      "brand_id": adminStore.fields.brand_id
    }
  },

  /**
  * Mapping staff detail to dto
  */
  mapStaffDetailModelToDto(staff) {
    return {
      "name": staff.fields.name,
      "phone_number": staff.fields.phone_number,
      "password": '',
      "role_id": staff.fields.role_id,
      "role_name": staff.fields.role_name,
      "store_id": staff.fields.store_id
    }
  },
}
