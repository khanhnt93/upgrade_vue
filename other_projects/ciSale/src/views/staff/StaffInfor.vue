<template>
  <div class="container-fluid">
    <div class="card">
      <div class="p-4">
        <form>
          <div class="flex flex-wrap items-center mb-4">
            <div class="w-2/3">
              <h4>Thông Tin Cá Nhân</h4>
            </div>
            <div class="w-1/3 text-right">
              <button
                v-if="onEdit"
                type="button"
                class="btn btn-primary px-4"
                @click="save">
                Save
              </button>
              <button
                v-else
                type="button"
                class="btn btn-primary px-4"
                @click="edit">
                Edit
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Tên</label><span class="error-sybol"></span>
            <input
              id="name"
              v-model="inputs.name"
              type="text"
              autocomplete="new-password"
              class="form-control { 'is-invalid': errorName }"
              :
              maxlength="100"
              :disabled="!onEdit">
            <div v-if="errorName" class="invalid-feedback" style="display: block;">
              Vui lòng nhập tên
            </div>
          </div>

          <div class="form-group">
            <label>Số Điện Thoại</label><span class="error-sybol"></span>
            <input
              id="phone"
              v-model="inputs.phone_number"
              type="text"
              autocomplete="new-password"
              class="form-control { 'is-invalid': (!phoneNumberCheckFlag || errorPhone) }"
              :
              maxlength="15"
              @keyup="integerOnly($event.target)"
              :disabled="!onEdit"
              v-on:change="checkPhoneNumberFormat($event.target)">
            <div v-if="!phoneNumberCheckFlag || errorPhone" class="invalid-feedback" style="display: block;">
              Vui lòng nhập số điện thoại
            </div>
            <div v-if="!phoneNumberCheckFlag" class="invalid-feedback" style="display: block;">
              Số điện thoại không đúng
            </div>
          </div>

          <div class="form-group">
            <label>Quyền</label><span class="error-sybol"></span>
            <input
              id="role"
              v-model="inputs.role_name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              maxlength="15"
              readonly>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'
import CustomerAPI from '@/api/customer'
import StaffAPI from '@/api/admin'
import Mapper from '@/mapper/staff'
import commonFunc from '@/common/commonFunc'
import 'vue2-datepicker/index.css'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Register',
  setup() {
    const authStore = useAuthStore()
    const { popToast } = useToast()

    return {
      authStore,
      popToast
    }
  },
  data () {
    return {
      inputs: {
        name: '',
        phone_number: '',
        role_name: ''
      },
      click: false,
      onEdit: false,
      phoneNumberCheckFlag: true,
    }
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.inputs.name)
    },
    errorPhone: function () {
      return this.checkInfo(this.inputs.phone)
    },
  },
  mounted () {
    this.getStaffInfo()
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorPhone || !this.phoneNumberCheckFlag)
    },

    /**
     * Get staff information
     */
    getStaffInfo () {
      let staffId = this.authStore.user.id
      StaffAPI.getStaffDetail(staffId).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.inputs = Mapper.mapStaffDetailModelToDto(res.data.data)
        }
      }).catch(err => {
        // Handle error
          let errorMess = commonFunc.handleCusError(err)
          this.popToast('error', errorMess)
      })
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
     * Event edit
     */
    edit() {
      this.onEdit = true
    },


    /**
     * Save infor
     */
    save() {
      this.click = true
      let result = this.checkValidate()
      if(result) {
        this.formatBirthday()
         CustomerAPI.updateInfo(this.inputs).then(res => {
           this.formatBirthday()
          if(res != null && res.data != null) {
            if (res.data.status == 200) {
              // show popup success
              this.popToast('success', 'Cập nhật thông tin thành công!!! ')
              this.onEdit = false
            }
          }
        }).catch(err => {
          this.formatBirthday()
          let message = ""
          if(err.response && err.response.data && err.response.data.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          this.popToast('error', message)
        })
      }
    },

    /**
     * Check phone number
     */
    checkPhoneNumberFormat(item) {
      let valueInput = item.value
      if (valueInput != null && valueInput != "") {
        if (commonFunc.phoneNumberCheck(valueInput)) {
          this.phoneNumberCheckFlag = true
        } else {
          this.phoneNumberCheckFlag = false
        }
      } else if(this.errorPhone) {
          this.phoneNumberCheckFlag = false
      } else {
        this.phoneNumberCheckFlag = true
      }
    },
  }
}
</script>
