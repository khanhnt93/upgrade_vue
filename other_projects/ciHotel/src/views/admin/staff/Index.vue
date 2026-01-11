<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="flex justify-start">
            <button
              class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors min-w-[120px]"
              @click="back">
              Quay lại
            </button>
          </div>
          <div class="flex justify-end">
            <button
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors min-w-[120px]"
              @click="save"
              :disabled="saving">
              Lưu
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-12">
            <h4 class="mt-1 text-center text-xl font-semibold">NHÂN VIÊN</h4>
          </div>
        </div>
        <hr class="mb-4" />
        
        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <icon name="loading" width="60" />
        </div>

        <!-- Name Field -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-3 mt-2">
            <label>Tên <span class="text-red-500">*</span></label>
          </div>
          <div class="md:col-span-9">
            <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorName }"
              v-model="staff.name"
              maxlength="100">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập tên
            </div>
          </div>
        </div>

        <!-- Phone Field -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-3 mt-2">
            <label>Số Điện Thoại <span class="text-red-500">*</span></label>
          </div>
          <div class="md:col-span-9">
            <input
              id="phone"
              type="text"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorPhone || !phoneNumberCheckFlag }"
              v-model="staff.phone_number"
              @keyup="integerOnly($event.target)"
              autocomplete="new-password"
              maxlength="20"
              @change="checkPhoneNumberFormat($event.target.value)">
            <div v-if="errorPhone" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số điện thoại
            </div>
            <div v-if="!phoneNumberCheckFlag && !errorPhone" class="text-red-500 text-sm mt-1">
              Số điện thoại không đúng
            </div>
          </div>
        </div>

        <!-- Role Field -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-3 mt-2">
            <label>Quyền <span class="text-red-500">*</span></label>
          </div>
          <div class="md:col-span-9">
            <select
              id="permission"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorRole }"
              v-model="staff.role_id">
              <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
            <div v-if="errorRole" class="text-red-500 text-sm mt-1">
              Vui lòng nhập quyền
            </div>
          </div>
        </div>

        <!-- Password Field (only for Add) -->
        <div v-if="this.route.params.id == null" class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-3 mt-2">
            <label>Mật Khẩu <span class="text-red-500">*</span></label>
          </div>
          <div class="md:col-span-9">
            <input
              id="password"
              type="password"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorPassword || errorLengthPassword }"
              v-model="staff.password"
              autocomplete="new-password"
              maxlength="100">
            <div v-if="errorPassword" class="text-red-500 text-sm mt-1">
              Vui lòng nhập mật khẩu
            </div>
            <div v-if="errorLengthPassword" class="text-red-500 text-sm mt-1">
              Mật khẩu phải ít nhất 6 kí tự
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/staff'
import commonFunc from '@/common/commonFunc'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()

    return {
      router,
      route,
      toast
    }
  },
  data() {
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
      if (this.route.params.id != null) {
        return false
      }
      return this.checkInfo(this.staff.password)
    },
    errorLengthPassword() {
      if (!this.staff.password || this.errorPassword)
        return false
      if (!this.click)
        return false
      return (this.staff.password.length < 6)
    },
  },
  methods: {
    checkInfo(info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate() {
      return !(this.errorName || this.errorPhone || this.errorRole || this.errorPassword
        || this.errorLengthPassword || !this.phoneNumberCheckFlag)
    },

    /**
     *  Get role options
     */
    getRoleOption() {
      adminAPI.getRoleOption().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.roleOptions = [{ value: null, text: '' }]

          var roles = res.data.data
          if (roles) {
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
      let staffId = this.route.params.id
      if (staffId) {
        this.loading = true

        adminAPI.getStaffDetail(staffId).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.staff = Mapper.mapStaffDetailModelToDto(res.data.data)
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    /**
     *  Save
     */
    save() {
      this.click = true
      this.saving = true
      this.checkPhoneNumberFormat(this.staff.phone_number)
      let result = this.checkValidate()
      if (result) {
        let staffId = this.route.params.id
        let staff = this.staff
        staff.id = staffId
        if (staffId) {
          // Edit
          this.staff = staff
          adminAPI.editStaff(staff).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              if (res.data.status == 200) {
                // show popup success
                this.toast.success('Cập nhật nhân viên thành công!!!')
              }
            }
          }).catch(err => {
            this.saving = false
            // Show notify edit fail
            let message = ""
            if (err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            alert("Cập Nhật Nhân Viên\n\n" + message)
          })
        } else {
          // Add
          adminAPI.addStaff(this.staff).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              if (res.data.status == 200) {
                this.router.push("/staff/list")
              }
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if (err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            alert("Thêm Nhân Viên\n\n" + message)
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
      this.router.push("/staff/list")
    }
  }
}
</script>
