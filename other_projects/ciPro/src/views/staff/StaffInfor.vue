<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <form>
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div class="md:col-span-8">
              <h4 class="text-xl font-bold">Thông Tin Cá Nhân</h4>
            </div>
            <div class="md:col-span-4">
              <button
                v-if="onEdit"
                type="button"
                @click="save"
                class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 float-right">
                Save
              </button>
              <button
                v-else
                type="button"
                @click="edit"
                class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 float-right">
                Edit
              </button>
            </div>
          </div>

          <!-- Name -->
          <div class="mb-4">
            <label class="block mb-2">Tên<span class="error-sybol"></span></label>
            <input
              id="name"
              v-model="inputs.name"
              type="text"
              autocomplete="new-password"
              class="form-control w-full"
              maxlength="100"
              :disabled="!onEdit">
            <div v-if="errorName" class="text-red-600 text-sm mt-1">
              Vui lòng nhập tên
            </div>
          </div>

          <!-- Phone Number -->
          <div class="mb-4">
            <label class="block mb-2">Số Điện Thoại<span class="error-sybol"></span></label>
            <input
              id="phone"
              v-model="inputs.phone_number"
              type="text"
              autocomplete="new-password"
              class="form-control w-full"
              maxlength="15"
              @keyup="integerOnly($event.target)"
              :disabled="!onEdit"
              @change="checkPhoneNumberFormat($event.target)">
            <div v-if="!phoneNumberCheckFlag || errorPhone" class="text-red-600 text-sm mt-1">
              Vui lòng nhập số điện thoại
            </div>
            <div v-if="!phoneNumberCheckFlag" class="text-red-600 text-sm mt-1">
              Số điện thoại không đúng
            </div>
          </div>

          <!-- Role -->
          <div class="mb-4">
            <label class="block mb-2">Quyền<span class="error-sybol"></span></label>
            <input
              id="role"
              v-model="inputs.role_name"
              type="text"
              autocomplete="new-password"
              class="form-control w-full"
              maxlength="15"
              readonly>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import CustomerAPI from '@/api/customer'
import StaffAPI from '@/api/admin'
import Mapper from '@/mapper/staff'
import commonFunc from '@/common/commonFunc'

// Store
const authStore = useAuthStore()

// Toast
const { popToast } = useToast()

// Data
const inputs = ref({
  name: '',
  phone_number: '',
  role_name: ''
})

const click = ref(false)
const onEdit = ref(false)
const phoneNumberCheckFlag = ref(true)

// Computed
const errorName = computed(() => {
  return checkInfo(inputs.value.name)
})

const errorPhone = computed(() => {
  return checkInfo(inputs.value.phone)
})

// Methods
const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorName.value || errorPhone.value || !phoneNumberCheckFlag.value)
}

/**
 * Get staff information
 */
const getStaffInfo = () => {
  let staffId = authStore.user.id
  StaffAPI.getStaffDetail(staffId).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      inputs.value = Mapper.mapStaffDetailModelToDto(res.data.data)
    }
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleCusError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

/**
 * Event edit
 */
const edit = () => {
  onEdit.value = true
}

/**
 * Save infor
 */
const save = () => {
  click.value = true
  let result = checkValidate()
  if (result) {
    CustomerAPI.updateInfo(inputs.value).then(res => {
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          // show popup success
          popToast('success', 'Cập nhật thông tin thành công!!! ')
          onEdit.value = false
        }
      }
    }).catch(err => {
      let message = ""
      if (err.response.data.status == 422) {
        message = err.response.data.mess
      } else {
        message = "Lỗi hệ thống"
      }
      alert(message)
    })
  }
}

/**
 * Check phone number
 */
const checkPhoneNumberFormat = (item) => {
  let valueInput = item.value
  if (valueInput != null && valueInput != "") {
    if (commonFunc.phoneNumberCheck(valueInput)) {
      phoneNumberCheckFlag.value = true
    } else {
      phoneNumberCheckFlag.value = false
    }
  } else if (errorPhone.value) {
    phoneNumberCheckFlag.value = false
  } else {
    phoneNumberCheckFlag.value = true
  }
}

// Lifecycle
onMounted(() => {
  getStaffInfo()
})
</script>
