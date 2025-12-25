<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div class="w-full md:col-span-12">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="p-4">

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div class="w-full md:col-span-6">
                <button class="btn btn-outline-secondary pull-left btn-width-120 px-4 py-2" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="w-full md:col-span-6">
                <button class="btn btn-outline-success pull-right btn-width-120 px-4 py-2" @click="save" :disabled="saving">
                  Lưu
                </button>

              </div>
            </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-12">
                  <h4 class="mt-1 text-center text-header">Thành Viên</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="name"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="staff.name"
                  maxlength="100">
                  <div class="text-red-600 text-sm mt-1" v-if="errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Số Điện Thoại </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="staff.phone_number"
                  @keyup="integerOnly($event.target)"
                  autocomplete="new-password"
                  maxlength="10"
                  v-on:change="checkPhoneNumberFormat($event.target.value)">
                  <div class="text-red-600 text-sm mt-1" v-if="errorPhone">
                    Vui lòng nhập số điện thoại
                  </div>
                  <div class="text-red-600 text-sm mt-1" v-if="!phoneNumberCheckFlag">
                    Số điện thoại không đúng
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Quyền </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <select
                  id="permission"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="100"
                  v-model="staff.role_id">
                    <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <div class="text-red-600 text-sm mt-1" v-if="errorRole">
                    Vui lòng nhập quyền
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row" v-if="this.$route.params.id == null">
                <div class="w-full md:col-span-3 mt-2">
                  <label> Mật Khẩu </label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="password"
                  type="password"
                  class="form-control"
                  v-model="staff.password"
                  autocomplete="new-password"
                  maxlength="100">
                  <div class="text-red-600 text-sm mt-1" v-if="errorPassword">
                    Vui lòng nhập mật khẩu
                  </div>
                  <div class="text-red-600 text-sm mt-1" v-if="errorLengthPassword">
                    Mật khẩu phải ít nhất 6 kí tự
                  </div>
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
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      roleOptions: [],
      staff: {
        "name": null,
        "phone_number": null,
        "role_id": null,
        "password": null
      },
      click: false,
      phoneNumberCheckFlag: null,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    // Get role options
    this.getRoleOption()

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
      console.log(`Toast: [${variant}] ${content}`)
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
    getRoleOption() {
      adminAPI.getRoleOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.roleOptions = [{value: null, text: ''}]

          var roles = res.data.data
          if(roles) {
            for (let i in roles) {
              this.roleOptions.push(roles[i])
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
            alert(`Cập Nhật Nhân Viên\n\n${message}`)
          })
        } else {
          // Add
          adminAPI.addStaff(this.staff).then(res => {
            this.saving = false
            if(res != null && res.data != null){

              let message = ""
              if (res.data.status == 200) {
                this.$router.push("/member")
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
              alert(`Thêm Nhân Viên\n\n${message}`)
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
      let result = commonFunc.integerOnly(valueInput)
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
      this.$router.push("/member")
    }
  }
}
</script>
