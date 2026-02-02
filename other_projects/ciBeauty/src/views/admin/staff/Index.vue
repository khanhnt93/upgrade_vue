<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-6">
                <button class="btn btn-outline-secondary pull-left px-4 btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="col-span-6">
                <button class="btn btn-outline-success float-right px-4 btn-width-120" @click="save" :disabled="saving">
                  Lưu
                </button>
              </div>
            </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-12">
                  <h4 class="mt-2 text-center text-header">Nhân Viên</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="staff.name"
                  maxlength="100">
                  <div class="invalid-feedback invalid-feedback"   :state="!errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Số Điện Thoại </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="staff.phone_number"
                  @keyup="integerOnly($event.target)"
                  autocomplete="new-password"
                  maxlength="20"
                  v-on:change="checkPhoneNumberFormat($event.target.value)">
                  <div class="invalid-feedback invalid-feedback" :state="!errorPhone">
                    Vui lòng nhập số điện thoại
                  </div>
                  <div class="invalid-feedback invalid-feedback" :state="phoneNumberCheckFlag">
                    Số điện thoại không đúng
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Quyền </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <select class="form-control form-control"
                  id="permission"
                  type="text"
                  autocomplete="new-password"
                  maxlength="100"
                  v-model="staff.role_id">
                    <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <div class="invalid-feedback invalid-feedback"   :state="!errorRole">
                    Vui lòng nhập quyền
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row" v-if="this.$route.params.id == null">
                <div class="col-span-3 mt-2">
                  <label> Mật Khẩu </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="password"
                  type="password"
                  class="form-control"
                  v-model="staff.password"
                  autocomplete="new-password"
                  maxlength="100">
                  <div class="invalid-feedback invalid-feedback" :state="!errorPassword">
                    Vui lòng nhập mật khẩu
                  </div>
                  <div class="invalid-feedback invalid-feedback" :state="!errorLengthPassword">
                    Mật khẩu phải ít nhất 6 kí tự
                  </div>
                </div>
              </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-3 mt-2">
                <label> Kỹ thuật viên</label><span class="error-sybol"></span>
              </div>
              <div class="col-span-9 d-flex align-items-center">
                <input id="is_spa_staff" type="checkbox" v-model="staff.is_spa_staff">
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-3 mt-2">
                <label> Cấp bậc </label>
              </div>
              <div class="col-span-9">
                <select class="form-control form-control"
                id="level_id"
                type="text"
                autocomplete="new-password"
                maxlength="100"
                v-model="staff.level_id">
                  <option v-for="option in levelOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/staff'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      roleOptions: [],
      levelOptions: [],
      staff: {
        "name": null,
        "phone_number": null,
        "role_id": null,
        "password": null,
        "is_spa_staff":false,
        "level_id": null,
      },
      click: false,
      phoneNumberCheckFlag: null,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    // Get role options
    this.getOptionRelatedStaff()

    this.getStaffDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.staff.name)
    },
    errorPhone: function () {
      return this.checkInfo(this.staff.phone_number)
    },
    errorRole: function () {
      return this.checkInfo(this.staff.role_id)
    },
    errorPassword: function () {
      if(this.$route.params.id != null) {
        return false
      }
      return this.checkInfo(this.staff.password)
    },
    errorLengthPassword () {
      if(!this.staff.password || this.errorPassword)
        return false
      if(!this.click)
        return false
      return (this.staff.password.length < 6)
    },
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
    },

    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorPhone || this.errorRole || this.errorPassword
            || this.errorLengthPassword || !this.phoneNumberCheckFlag)
    },

    /**
     *  Get role options
     */
     getOptionRelatedStaff() {
      adminAPI.getOptionRelatedStaff().then(res => {
        if(res != null && res.data != null && res.data.data != null) {

          // Role
          const roles = res.data.data.roles
          this.roleOptions = [{value: null, text: ''}]
          if(roles) {
            for (const role of roles) {
              this.roleOptions.push(role)
            }
          }

          // Level
          const levels = res.data.data.levels
          this.levelOptions = [{value: null, text: ''}]
          if(levels) {
            for (const level of levels) {
              this.levelOptions.push(level)
            }
          }
        }
      })
    },

    /**
     *  Get detail
     */
    getStaffDetail() {
      let staffId = this.$route.params.id
      if(staffId){
        this.loading = true

        adminAPI.getStaffDetail(staffId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.staff = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     *  Save
     */
    save () {
      this.click = true
      this.saving = true
      this.checkPhoneNumberFormat(this.staff.phone_number)
      let result = this.checkValidate()
      if(result) {
        let staffId = this.$route.params.id
        let staff = this.staff
        staff.id = staffId
        if(staffId){
          // Edit
          this.staff = staff
          adminAPI.editStaff(staff).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              let message = ""
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật nhân viên thành công!!! ')
              }
            }
          }).catch(err => {
            this.saving = false
            // Show notify edit fail
            let message = ""
            if(err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            this.popToast('danger', message)
          })
        } else {
          // Add
          adminAPI.addStaff(this.staff).then(res => {
            this.saving = false
            if(res != null && res.data != null){

              let message = ""
              if (res.data.status == 200) {
                this.$router.push("/staff/list")
              }
            }
          }).catch(err => {
            this.saving = false
            let message = ""
              if(err.response.data.status == 422) {
                message = err.response.data.mess
              } else {
                message = "Lỗi hệ thống"
              }
              this.popToast('danger', message)
          })
        }
      } else {
        this.saving = false
      }

    },

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Check phone number
     */
    checkPhoneNumberFormat(item) {
      let valueInput = item
      if (valueInput != null && valueInput != "") {
        if (commonFunc.phoneNumberCheck(valueInput)) {
          this.phoneNumberCheckFlag = true
        } else {
          this.phoneNumberCheckFlag = false
        }
      } else {
        this.phoneNumberCheckFlag = true
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/staff/list")
    }
  }
}
</script>
