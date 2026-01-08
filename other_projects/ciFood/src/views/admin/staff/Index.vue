<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-between mb-4">
          <button 
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors min-w-[120px]"
            @click="back">
            Quay lại
          </button>
          <button 
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving" 
            @click="save">
            Lưu
          </button>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Nhân Viên</h4>
          </div>
        </div>
        <hr class="my-4"/>

        <!-- Loading Overlay -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <svg class="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else>
          <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-3">
              <label class="block mb-2 font-medium">Tên <span class="text-red-600"></span></label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorName ? 'border-red-500' : 'border-gray-300'"
                v-model="staff.name"
                maxlength="100">
              <p v-if="errorName" class="mt-1 text-sm text-red-600">Vui lòng nhập tên</p>
            </div>

            <div class="col-span-12 md:col-span-3">
              <label class="block mb-2 font-medium">Số Điện Thoại <span class="text-red-600"></span></label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorPhone || !phoneNumberCheckFlag ? 'border-red-500' : 'border-gray-300'"
                v-model="staff.phone_number"
                @keyup="integerOnly($event.target)"
                @change="checkPhoneNumberFormat($event.target.value)"
                maxlength="20">
              <p v-if="errorPhone" class="mt-1 text-sm text-red-600">Vui lòng nhập số điện thoại</p>
              <p v-if="!phoneNumberCheckFlag && staff.phone_number" class="mt-1 text-sm text-red-600">Số điện thoại không đúng</p>
            </div>

            <div class="col-span-12 md:col-span-3">
              <label class="block mb-2 font-medium">Quyền <span class="text-red-600"></span></label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <select
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorRole ? 'border-red-500' : 'border-gray-300'"
                v-model="staff.role_id">
                <option v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
              <p v-if="errorRole" class="mt-1 text-sm text-red-600">Vui lòng nhập quyền</p>
            </div>

            <template v-if="!route.params.id">
              <div class="col-span-12 md:col-span-3">
                <label class="block mb-2 font-medium">Mật Khẩu <span class="text-red-600"></span></label>
              </div>
              <div class="col-span-12 md:col-span-9">
                <input
                  type="password"
                  autocomplete="new-password"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="errorPassword || errorLengthPassword ? 'border-red-500' : 'border-gray-300'"
                  v-model="staff.password"
                  maxlength="100">
                <p v-if="errorPassword" class="mt-1 text-sm text-red-600">Vui lòng nhập mật khẩu</p>
                <p v-if="errorLengthPassword" class="mt-1 text-sm text-red-600">Mật khẩu phải ít nhất 6 kí tự</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/staff'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const roleOptions = ref([])
const staff = ref({
  name: null,
  phone_number: null,
  role_id: null,
  password: null
})

const click = ref(false)
const phoneNumberCheckFlag = ref(null)
const saving = ref(false)
const loading = ref(false)

const errorName = computed(() => click.value && (staff.value.name == null || staff.value.name.length <= 0))
const errorPhone = computed(() => click.value && (staff.value.phone_number == null || staff.value.phone_number.length <= 0))
const errorRole = computed(() => click.value && (staff.value.role_id == null || staff.value.role_id.length <= 0))
const errorPassword = computed(() => {
  if (route.params.id != null) {
    return false
  }
  return click.value && (staff.value.password == null || staff.value.password.length <= 0)
})
const errorLengthPassword = computed(() => {
  if (!staff.value.password || errorPassword.value)
    return false
  if (!click.value)
    return false
  return (staff.value.password.length < 6)
})

const checkValidate = () => {
  return !(errorName.value || errorPhone.value || errorRole.value || errorPassword.value || 
    errorLengthPassword.value || !phoneNumberCheckFlag.value)
}

const getRoleOption = async () => {
  try {
    const res = await adminAPI.getRoleOption()
    if (res != null && res.data != null && res.data.data != null) {
      roleOptions.value = [{value: null, text: ''}]
      
      const roles = res.data.data
      if (roles) {
        for (let i in roles) {
          roleOptions.value.push(roles[i])
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const getStaffDetail = async () => {
  const staffId = route.params.id
  if (staffId) {
    loading.value = true

    try {
      const res = await adminAPI.getStaffDetail(staffId)
      if (res != null && res.data != null && res.data.data != null) {
        staff.value = Mapper.mapStaffDetailModelToDto(res.data.data)
      }
      loading.value = false
    } catch (err) {
      loading.value = false
      const errorMess = commonFunc.handleStaffError(err)
      showToast(errorMess, 'danger')
    }
  }
}

const save = async () => {
  click.value = true
  saving.value = true
  checkPhoneNumberFormat(staff.value.phone_number)
  
  const result = checkValidate()
  if (result) {
    const staffId = route.params.id
    const staffData = staff.value
    staffData.id = staffId
    
    try {
      if (staffId) {
        // Edit
        staff.value = staffData
        const res = await adminAPI.editStaff(staffData)
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status === 200) {
            showToast('Cập nhật nhân viên thành công!!!', 'success')
          }
        }
      } else {
        // Add
        const res = await adminAPI.addStaff(staff.value)
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status === 200) {
            router.push("/staff/list")
          }
        }
      }
    } catch (err) {
      saving.value = false
      let message = ""
      if (err.response && err.response.data && err.response.data.status === 422) {
        message = err.response.data.mess
      } else {
        message = "Lỗi hệ thống"
      }
      alert((staffId ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên") + "\n\n" + message)
    }
  } else {
    saving.value = false
  }
}

const integerOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const checkPhoneNumberFormat = (item) => {
  const valueInput = item
  if (valueInput != null && valueInput !== "") {
    if (commonFunc.phoneNumberCheck(valueInput)) {
      phoneNumberCheckFlag.value = true
    } else {
      phoneNumberCheckFlag.value = false
    }
  } else {
    phoneNumberCheckFlag.value = true
  }
}

const back = () => {
  router.push("/staff/list")
}

onMounted(() => {
  getRoleOption()
  getStaffDetail()
})
</script>
