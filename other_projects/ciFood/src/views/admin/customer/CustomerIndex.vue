<template>
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Action Buttons -->
      <div class="flex justify-between mb-4">
        <button
          @click="back"
          class="px-6 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 transition-colors"
        >
          Quay lại
        </button>
        <button
          @click="save"
          :disabled="saving"
          class="px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lưu
        </button>
      </div>

      <!-- Title -->
      <h4 class="text-2xl font-semibold text-center mb-4">Khách Hàng</h4>
      <hr class="mb-6">

      <!-- Loading -->
      <div v-show="loading" class="text-center mb-4">
        <i class="fa fa-spinner fa-spin text-2xl text-blue-600"></i>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <!-- Customer Type -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label class="md:col-span-3 pt-2 text-sm font-medium">Loại khách hàng</label>
          <div class="md:col-span-9 flex items-center gap-8">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="inputs.type"
                name="type"
                value="personal"
                class="mr-2"
              >
              <span>Cá nhân</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="inputs.type"
                name="type"
                value="company"
                class="mr-2"
              >
              <span>Công ty</span>
            </label>
          </div>
        </div>

        <!-- Name -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label class="md:col-span-3 pt-2 text-sm font-medium">
            Tên <span class="text-red-500">*</span>
          </label>
          <div class="md:col-span-9">
            <input
              id="name"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errorName, 'border-gray-300': !errorName}"
              v-model="inputs.name"
              autocomplete="new-password"
              maxlength="75"
            >
            <p v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên</p>
          </div>
        </div>

        <!-- Phone Number -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label class="md:col-span-3 pt-2 text-sm font-medium">
            Số Điện Thoại <span class="text-red-500">*</span>
          </label>
          <div class="md:col-span-9">
            <input
              id="phone"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errorPhone, 'border-gray-300': !errorPhone}"
              v-model="inputs.phone_number"
              @keyup="integerOnly($event.target)"
              @change="checkPhoneNumberFormat($event.target.value)"
              autocomplete="new-password"
              maxlength="20"
            >
            <p v-if="errorPhone" class="text-red-500 text-sm mt-1">Số điện thoại không đúng</p>
          </div>
        </div>

        <!-- Gender -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label class="md:col-span-3 pt-2 text-sm font-medium">
            Giới Tính <span class="text-red-500">*</span>
          </label>
          <div class="md:col-span-9">
            <select
              v-model="inputs.gender"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errorGender, 'border-gray-300': !errorGender}"
            >
              <option value="" disabled>Chọn giới tính</option>
              <option v-for="option in optionsGender" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
            <p v-if="errorGender" class="text-red-500 text-sm mt-1">Vui lòng chọn giới tính</p>
          </div>
        </div>

        <!-- Birthday -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label class="md:col-span-3 pt-2 text-sm font-medium">
            Ngày Tháng Năm Sinh <span class="text-red-500">*</span>
          </label>
          <div class="md:col-span-9">
            <input
              id="birthday"
              v-model="inputs.birthday"
              type="text"
              placeholder="dd-mm-yyyy"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errorBirthday || !birthdayCheckFlag, 'border-gray-300': !errorBirthday && birthdayCheckFlag}"
              @change="checkBirthdayFormat($event.target)"
            >
            <p v-if="errorBirthday" class="text-red-500 text-sm mt-1">Vui lòng nhập ngày sinh</p>
            <p v-if="!birthdayCheckFlag" class="text-red-500 text-sm mt-1">Ngày sinh không đúng</p>
          </div>
        </div>

        <!-- City -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label class="md:col-span-3 pt-2 text-sm font-medium">
            Tỉnh/ Thành Phố <span class="text-red-500">*</span>
          </label>
          <div class="md:col-span-9">
            <select
              id="city_id"
              v-model="inputs.city_id"
              @change="changeCity()"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errorCity, 'border-gray-300': !errorCity}"
            >
              <option value="" disabled>Chọn tỉnh/thành phố</option>
              <option v-for="option in optionsCity" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
            <p v-if="errorCity" class="text-red-500 text-sm mt-1">Vui lòng chọn thành phố</p>
          </div>
        </div>

        <!-- District -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label class="md:col-span-3 pt-2 text-sm font-medium">
            Quận/ Huyện <span class="text-red-500">*</span>
          </label>
          <div class="md:col-span-9">
            <select
              id="district_id"
              v-model="inputs.district_id"
              :disabled="!inputs.city_id"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              :class="{'border-red-500': errorDistrict, 'border-gray-300': !errorDistrict}"
            >
              <option value="" disabled>Chọn quận/huyện</option>
              <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
            <p v-if="errorDistrict" class="text-red-500 text-sm mt-1">Vui lòng nhập quận</p>
          </div>
        </div>

        <!-- Address -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label class="md:col-span-3 pt-2 text-sm font-medium">Địa chỉ</label>
          <div class="md:col-span-9">
            <input
              id="address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.address"
              autocomplete="new-password"
              maxlength="255"
            >
          </div>
        </div>

        <!-- Tax Code -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <label class="md:col-span-3 pt-2 text-sm font-medium">Mã số thuế</label>
          <div class="md:col-span-9">
            <input
              id="mst"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="inputs.mst"
              @keyup="integerOnly($event.target)"
              autocomplete="new-password"
              maxlength="20"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import customerApi from '@/api/customer'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const route = useRoute()
const { popToast } = useToast()

const inputs = ref({
  type: null,
  name: null,
  phone_number: null,
  gender: null,
  birthday: null,
  city_id: null,
  district_id: null,
  address: null,
  mst: null,
})

const optionsGender = ref([
  {value: '1', text: 'Nam'},
  {value: '2', text: 'Nữ'},
  {value: '3', text: 'Khác'}
])

const optionsCity = ref([])
const optionsDistrict = ref([])
const click = ref(false)
const phoneNumberCheckFlag = ref(true)
const birthdayCheckFlag = ref(true)
const saving = ref(false)
const loading = ref(false)

const errorName = computed(() => checkInfo(inputs.value.name))
const errorPhone = computed(() => checkPhoneNumber(inputs.value.phone_number))
const errorGender = computed(() => checkInfo(inputs.value.gender))
const errorBirthday = computed(() => checkInfo(inputs.value.birthday))
const errorCity = computed(() => checkInfo(inputs.value.city_id))
const errorDistrict = computed(() => checkInfo(inputs.value.district_id))

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkPhoneNumber = (info) => {
  return (click.value && (info == null || info.length <= 0 || !checkPhoneNumberFormat(info)))
}

const checkValidate = () => {
  return !(errorName.value || errorPhone.value || errorGender.value || errorBirthday.value
    || errorCity.value || errorDistrict.value || !birthdayCheckFlag.value || !phoneNumberCheckFlag.value)
}

/**
 * Check phone number format
 */
const checkPhoneNumberFormat = (item) => {
  let valueInput = item
  if (valueInput != null && valueInput != "") {
    if (!commonFunc.phoneNumberCheck(valueInput)) {
      phoneNumberCheckFlag.value = false
      return false
    }
  }
  phoneNumberCheckFlag.value = true
  return true
}

/**
 * Get city options
 */
const getOptionCity = () => {
  MasterApi.getCityOptions().then(res => {
    optionsCity.value = MasterMapper.mapCityModelToDto(res.data.data)
    changeCity()
  })
}

/**
 * Get detail
 */
const getCustomerDetail = () => {
  let cusId = route.params.id
  if (cusId) {
    customerApi.getCustomerDetailByStore(cusId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        inputs.value = res.data.data
        getOptionCity()
      }
    }).catch(err => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

/**
 * Save
 */
const save = () => {
  click.value = true

  let checkValidateResult = checkValidate()
  if (!checkValidateResult) {
    return
  }

  saving.value = true

  let customerId = route.params.id
  let params = JSON.parse(JSON.stringify(inputs.value))
  params.id = customerId
  params.phone = inputs.value.phone_number
  params.birthday = formatDate(inputs.value.birthday)

  if (customerId) {
    // Edit
    customerApi.updateCustomerByStore(params).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast('success', 'Cập nhật khách hàng thành công!!!')
        }
      }
    }).catch(err => {
      saving.value = false
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    // Add
    customerApi.addCustomerByStore(params).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          router.push("/customer/list")
        }
      }
    }).catch(err => {
      saving.value = false
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

/**
 * Format date
 */
const formatDate = (dateInput) => {
  let result = dateInput
  if (dateInput) {
    let temp = dateInput.split("-")
    if (temp.length == 1) {
      temp = dateInput.split("/")
    }
    result = temp[2] + "-" + temp[1] + "-" + temp[0]
  }
  return result
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
 * Get district by city
 */
const changeCity = () => {
  let cityId = inputs.value.city_id
  if (cityId != "" && cityId != undefined) {
    MasterApi.getDistrictOptions(cityId).then(res => {
      optionsDistrict.value = MasterMapper.mapCityModelToDto(res.data.data)
    })
  } else {
    inputs.value.district_id = ""
  }
}

/**
 * Check birthday format
 */
const checkBirthdayFormat = (item) => {
  let valueInput = item.value
  if (valueInput != null && valueInput != "") {
    if (commonFunc.dateFormatCheck(valueInput)) {
      birthdayCheckFlag.value = true
    } else {
      birthdayCheckFlag.value = false
    }
  } else {
    birthdayCheckFlag.value = true
  }
}

/**
 * Back to list
 */
const back = () => {
  router.push("/customer/list")
}

onMounted(() => {
  getCustomerDetail()
  getOptionCity()
})
</script>
