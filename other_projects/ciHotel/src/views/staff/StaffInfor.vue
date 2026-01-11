<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <form @submit.prevent>
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            <div class="md:col-span-8">
              <h4 class="text-xl font-semibold">Thông Tin Cá Nhân</h4>
            </div>
            <div class="md:col-span-4">
              <button
                v-if="onEdit"
                type="button"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition float-right"
                @click="save"
              >
                Save
              </button>
              <button
                v-else
                type="button"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition float-right"
                @click="edit"
              >
                Edit
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tên<span class="text-red-500 ml-1">*</span>
            </label>
            <input
              id="name"
              v-model="inputs.name"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorName }"
              maxlength="100"
              :disabled="!onEdit"
            />
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập tên
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Số Điện Thoại<span class="text-red-500 ml-1">*</span>
            </label>
            <input
              id="phone"
              v-model="inputs.phone_number"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': !phoneNumberCheckFlag || errorPhone }"
              maxlength="15"
              :disabled="!onEdit"
              @keyup="integerOnly($event.target)"
              @change="checkPhoneNumberFormat($event.target)"
            />
            <div v-if="errorPhone && !phoneNumberCheckFlag" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số điện thoại
            </div>
            <div v-else-if="!phoneNumberCheckFlag" class="text-red-500 text-sm mt-1">
              Số điện thoại không đúng
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Quyền<span class="text-red-500 ml-1">*</span>
            </label>
            <input
              id="role"
              v-model="inputs.role_name"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              maxlength="15"
              readonly
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerAPI from '@/api/customer'
import StaffAPI from '@/api/admin'
import Mapper from '@/mapper/staff'
import commonFunc from '@/common/commonFunc'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Register',
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  data() {
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
      return this.checkInfo(this.inputs.phone_number)
    },
  },
  mounted() {
    this.getStaffInfo()
  },
  methods: {
    checkInfo(info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate() {
      return !(this.errorName || this.errorPhone || !this.phoneNumberCheckFlag)
    },

    /**
     * Get staff information
     */
    getStaffInfo() {
      let staffId = this.authStore.user?.id
      StaffAPI.getStaffDetail(staffId).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.inputs = Mapper.mapStaffDetailModelToDto(res.data.data)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleCusError(err)
        this.$toast.error(errorMess)
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
        CustomerAPI.updateInfo(this.inputs).then(res => {
          if(res != null && res.data != null) {
            if (res.data.status == 200) {
              // show popup success
              this.$toast.success('Cập nhật thông tin thành công!!!')
              this.onEdit = false
            }
          }
        }).catch(err => {
          let message = ""
          if(err.response.data.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          this.$toast.error(message)
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
