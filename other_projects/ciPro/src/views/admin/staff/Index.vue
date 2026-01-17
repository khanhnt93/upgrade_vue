<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 btn-width-120" @click="back">
            Quay lại
          </button>
        </div>
        <div class="text-right">
          <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 btn-width-120" @click="save" :disabled="saving">
            Lưu
          </button>
        </div>
      </div>

      <div class="mb-4">
        <h4 class="mt-1 text-center text-header font-bold">{{prefix_text}}Nhân Viên</h4>
      </div>
      <hr class="my-4"/>
      
      <!-- Loading -->
      <span v-show="loading" class="loading-more"><icon name="loading" width="60" /></span>

      <!-- Name -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label>Tên<span class="error-sybol"></span></label>
        </div>
        <div class="md:col-span-9">
          <input id="name" v-model="staff.name" type="text" autocomplete="new-password" class="form-control w-full" maxlength="100">
          <div v-if="errorName" class="text-red-600 text-sm mt-1">Vui lòng nhập tên</div>
        </div>
      </div>

      <!-- Phone -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label>Số Điện Thoại<span class="error-sybol"></span></label>
        </div>
        <div class="md:col-span-9">
          <input id="phone" v-model="staff.phone_number" type="text" class="form-control w-full" @keyup="integerOnly($event.target)" autocomplete="new-password" maxlength="10" @change="checkPhoneNumberFormat($event.target.value)">
          <div v-if="errorPhone" class="text-red-600 text-sm mt-1">Vui lòng nhập số điện thoại</div>
          <div v-if="!phoneNumberCheckFlag" class="text-red-600 text-sm mt-1">Số điện thoại không đúng</div>
        </div>
      </div>

      <!-- Role -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label>Quyền<span class="error-sybol"></span></label>
        </div>
        <div class="md:col-span-9">
          <select id="permission" v-model="staff.role_id" class="form-control w-full" autocomplete="new-password">
            <option v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
          <div v-if="errorRole" class="text-red-600 text-sm mt-1">Vui lòng nhập quyền</div>
        </div>
      </div>

      <!-- Password (only for new staff) -->
      <div v-if="!$route.params.id" class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label>Mật Khẩu<span class="error-sybol"></span></label>
        </div>
        <div class="md:col-span-9">
          <input id="password" v-model="staff.password" type="password" class="form-control w-full" autocomplete="new-password" maxlength="100">
          <div v-if="errorPassword" class="text-red-600 text-sm mt-1">Vui lòng nhập mật khẩu</div>
          <div v-if="errorLengthPassword" class="text-red-600 text-sm mt-1">Mật khẩu phải ít nhất 6 kí tự</div>
        </div>
      </div>

      <!-- Position -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label>Chức danh</label>
        </div>
        <div class="md:col-span-9">
          <input id="position" v-model="staff.position" type="text" autocomplete="new-password" class="form-control w-full" maxlength="100">
        </div>
      </div>

      <!-- Email -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label>Email</label>
        </div>
        <div class="md:col-span-9">
          <input id="email" v-model="staff.email" type="text" autocomplete="new-password" class="form-control w-full" maxlength="100">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/staff'
import commonFunc from '@/common/commonFunc'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

const prefix_text = ref('')
const roleOptions = ref([])
const staff = ref({
  name: null,
  phone_number: null,
  role_id: null,
  password: null,
  position: null,
  email: null
})
const click = ref(false)
const phoneNumberCheckFlag = ref(null)
const saving = ref(false)
const loading = ref(false)

const errorName = computed(() => checkInfo(staff.value.name))
const errorPhone = computed(() => checkInfo(staff.value.phone_number))
const errorRole = computed(() => checkInfo(staff.value.role_id))
const errorPassword = computed(() => {
  if (route.params.id != null) return false
  return checkInfo(staff.value.password)
})
const errorLengthPassword = computed(() => {
  if (!staff.value.password || errorPassword.value) return false
  if (!click.value) return false
  return (staff.value.password.length < 6)
})

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorName.value || errorPhone.value || errorRole.value || errorPassword.value
    || errorLengthPassword.value || !phoneNumberCheckFlag.value)
}

const getRoleOption = () => {
  adminAPI.getRoleOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      roleOptions.value = [{ value: null, text: '' }]
      var roles = res.data.data
      if (roles) {
        for (let i in roles) {
          roleOptions.value.push(roles[i])
        }
      }
    }
  })
}

const getStaffDetail = () => {
  let staffId = route.params.id
  if (staffId) {
    loading.value = true
    adminAPI.getStaffDetail(staffId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        staff.value = res.data.data
      }
      loading.value = false
    }).catch(err => {
      loading.value = false
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const save = () => {
  click.value = true
  saving.value = true
  checkPhoneNumberFormat(staff.value.phone_number)
  let result = checkValidate()
  if (result) {
    let staffId = route.params.id
    let staffData = staff.value
    staffData.id = staffId
    if (staffId) {
      adminAPI.editStaff(staffData).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            popToast('success', 'Cập nhật nhân viên thành công!!! ')
          }
        }
      }).catch(err => {
        saving.value = false
        let message = err.response.data.status == 422 ? err.response.data.mess : "Lỗi hệ thống"
        alert(message)
      })
    } else {
      adminAPI.addStaff(staff.value).then(res => {
        saving.value = false
        if (res != null && res.data != null && res.data.status == 200) {
          router.push("/staff")
        }
      }).catch(err => {
        saving.value = false
        let message = err.response.data.status == 422 ? err.response.data.mess : "Lỗi hệ thống"
        alert(message)
      })
    }
  } else {
    saving.value = false
  }
}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const checkPhoneNumberFormat = (item) => {
  let valueInput = item
  if (valueInput != null && valueInput != "") {
    phoneNumberCheckFlag.value = commonFunc.phoneNumberCheck(valueInput)
  } else {
    phoneNumberCheckFlag.value = true
  }
}

const back = () => {
  router.push("/staff")
}

onMounted(() => {
  prefix_text.value = route.params.id ? "Cập Nhật " : "Thêm Mới "
  getRoleOption()
  getStaffDetail()
})
</script>
