import commonFunc from '@/common/commonFunc'
export default {
  mapStaffModelToDto (staff) {
    return {
      id: staff.id,
      userName: staff.name,
      phoneNumber: staff.phone_number,
      roleId: staff.role_id,
      role: staff.role_name,
      storeId: staff.store_id,
      cityId: staff.city_id,
      isRoot: staff.is_root,
      isSuper: staff.is_super,
      userType: "staff",
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
