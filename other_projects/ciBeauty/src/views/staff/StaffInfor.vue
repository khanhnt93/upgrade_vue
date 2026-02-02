<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-lg shadow-md p-4" no-body>
        <div class="card-body">
          <form>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-8">
                <h4>Thông Tin Cá Nhân</h4>
              </div>
              <div class="col-span-4">
                <button class="btn px-4 float-right" v-if="onEdit" variant="primary" @click="save">
                  Save
                </button>
                <button class="btn px-4 float-right" v-else variant="primary" @click="edit">
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
                class="form-control"
                maxlength="100"
                :disabled="!onEdit">
                <div class="invalid-feedback invalid-feedback"   :state="!errorName">
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
                class="form-control"
                maxlength="15"
                @keyup="integerOnly($event.target)"
                :disabled="!onEdit"
                v-on:change="checkPhoneNumberFormat($event.target)">
                <div class="invalid-feedback invalid-feedback" :state="!phoneNumberCheckFlag || !errorPhone">
                  Vui lòng nhập số điện thoại
                </div>
                <div class="invalid-feedback invalid-feedback" :state="phoneNumberCheckFlag">
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
                readonly
                >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerAPI from '@/api/customer'
import StaffAPI from '@/api/admin'
import Mapper from '@/mapper/staff'
import commonFunc from '@/common/commonFunc'
import 'vue2-datepicker/index.css'


export default {
  name: 'Register',
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
   * Make toast without title
   */
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    /**
     * Get staff information
     */
    getStaffInfo () {
      let staffId = this.$store.state.user.id
      StaffAPI.getStaffDetail(staffId).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.inputs = Mapper.mapStaffDetailModelToDto(res.data.data)
        }
      }).catch(err => {
        // Handle error
          let errorMess = commonFunc.handleCusError(err)
          this.popToast('danger', errorMess)
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
     * Save info
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
          if(err.response.data.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          this.popToast('danger', message)
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
