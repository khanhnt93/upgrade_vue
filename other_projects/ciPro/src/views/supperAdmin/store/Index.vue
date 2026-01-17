<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header -->
        <h4 class="text-2xl font-semibold text-center mb-4">Store</h4>
        <hr class="my-4 border-gray-200">

        <!-- Form Fields -->
        <div class="space-y-4">
          <!-- Name -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">
              Tên <span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="store.name"
                type="text"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }"
              >
              <p v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên</p>
            </div>
          </div>

          <!-- Brand -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">Thương hiệu</label>
            <div class="md:col-span-9">
              <select
                v-model="store.brand_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="option in optionsBrand" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <!-- City -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">
              Tỉnh/ Thành Phố <span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <select
                v-model="store.city_id"
                @change="changeCity"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorCiti }"
              >
                <option v-for="option in optionsCity" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <p v-if="errorCiti" class="text-red-500 text-sm mt-1">Vui lòng nhập tỉnh/thành phố</p>
            </div>
          </div>

          <!-- District -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">
              Quận <span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <select
                v-model="store.district_id"
                :disabled="store.city_id === ''"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                :class="{ 'border-red-500': errorDistrict }"
              >
                <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <p v-if="errorDistrict" class="text-red-500 text-sm mt-1">Vui lòng nhập quận</p>
            </div>
          </div>

          <!-- Address -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">
              Địa Chỉ <span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="store.address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorAddress }"
              >
              <p v-if="errorAddress" class="text-red-500 text-sm mt-1">Vui lòng nhập địa chỉ</p>
            </div>
          </div>

          <!-- Phone Number -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">
              Số điện thoại <span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="store.phone_number"
                type="text"
                maxlength="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorPhoneNumber }"
              >
              <p v-if="errorPhoneNumber" class="text-red-500 text-sm mt-1">Vui lòng nhập số điện thoại</p>
            </div>
          </div>

          <!-- Tax Code -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">Mã số thuế</label>
            <div class="md:col-span-9">
              <input
                v-model="store.tax_code"
                type="text"
                maxlength="20"
                @keyup="integerOnly($event.target)"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <!-- Expired Date -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">
              Hết Hạn Vào <span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="store.expired_at"
                type="text"
                @keyup="inputDateOnly($event.target)"
                @change="changeExpiredDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorExpiredAt }"
              >
              <p v-if="errorExpiredAt" class="text-red-500 text-sm mt-1">Vui lòng nhập ngày hết hạn</p>
            </div>
          </div>

          <!-- Time Live -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">Thời hạn</label>
            <div class="md:col-span-9">
              <p class="pt-2 text-gray-700">{{ timeLive }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <button
              @click="back"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Quay lại
            </button>
          </div>
          <div>
            <button
              @click="save"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import superAdminAPI from '@/api/superAdmin'
import commonFunc from '@/common/commonFunc'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { popToast } = useToast()

// Reactive state
const optionsBrand = ref([])
const optionsCity = ref([])
const optionsDistrict = ref([])
const store = reactive({
  name: '',
  brand_id: null,
  address: '',
  tax_code: '',
  phone_number: '',
  city_id: '',
  district_id: '',
  expired_at: ''
})
const saving = ref(false)
const timeLive = ref(0)

// Computed properties
const errorName = computed(() => checkInfo(store.name))
const errorCiti = computed(() => checkInfo(store.city_id))
const errorDistrict = computed(() => checkInfo(store.district_id))
const errorAddress = computed(() => checkInfo(store.address))
const errorPhoneNumber = computed(() => checkInfo(store.phone_number))
const errorExpiredAt = computed(() => checkInfo(store.expired_at))

// Methods
const checkInfo = (info) => {
  return saving.value && (info == null || info.length <= 0)
}

const checkValidate = () => {
  return !(errorName.value || errorCiti.value || errorDistrict.value || errorAddress.value || errorPhoneNumber.value || errorExpiredAt.value)
}

const getTimeLive = () => {
  const dateNow = new Date()
  const dayInMonth = new Date(dateNow.getFullYear(), (dateNow.getMonth() + 1), 0).getDate()

  const year = dateNow.getFullYear()
  const month = dateNow.getMonth() + 1
  const day = dateNow.getDate()

  const expiredDate = store.expired_at.split('-')
  const eYear = parseInt(expiredDate[2])
  const eMonth = parseInt(expiredDate[1])
  const eDay = parseInt(expiredDate[0])

  let minYear = parseInt(eYear) - parseInt(year)
  let minMon = eMonth - month
  if (minMon < 0) {
    minMon = 12 - parseInt(month) + parseInt(eMonth)
    minYear = minYear - 1
  }
  let minDay = eDay - day
  if (minDay < 0) {
    minDay = parseInt(dayInMonth) - parseInt(day) + parseInt(eDay)
    minMon = minMon - 1
  }
  timeLive.value = minYear + ' năm ' + minMon + ' tháng ' + minDay + ' ngày'
}

const getDefaultDate = () => {
  if (!route.params.id) {
    const dateNow = new Date()
    const oneMonth = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
    store.expired_at = commonFunc.formatDate(oneMonth.toJSON().slice(0, 10))
    getTimeLive()
  }
}

const getStoreDetail = () => {
  const storeId = route.params.id
  if (storeId) {
    superAdminAPI.getStoreDetail(storeId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        Object.assign(store, res.data.data)
        getOptionCity()
      }
    }).catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    getOptionCity()
  }
}

const save = () => {
  const result = checkValidate()
  if (result) {
    saving.value = true

    const storeData = JSON.parse(JSON.stringify(store))
    storeData.expired_at = commonFunc.convertDDMMYYYYToYYYYMMDD(store.expired_at)

    const storeId = route.params.id
    if (storeId) {
      storeData.id = storeId
      superAdminAPI.editStore(storeData).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            alert('Cập nhật thành công')
            router.push('/store/list')
          }
        }
      }).catch(err => {
        saving.value = false
        let message = ''
        if (err.response.data.status == 422) {
          message = err.response.data.mess
        } else {
          message = 'Lỗi hệ thống'
        }
        alert(message)
      })
    } else {
      superAdminAPI.addStore(storeData).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            alert('Thêm thành công')
            router.push('/store/list')
          }
        }
      }).catch(err => {
        saving.value = false
        let message = ''
        if (err.response.data.status == 422) {
          message = err.response.data.mess
        } else {
          message = 'Lỗi hệ thống'
        }
        alert(message)
      })
    }
  }
}

const inputDateOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

const getOptionBrand = () => {
  superAdminAPI.getBrandOption().then(res => {
    optionsBrand.value = [{ value: null, text: '' }]
    if (res && res.data && res.data.data) {
      const brands = res.data.data
      for (const index in brands) {
        const brand = {
          value: brands[index].value,
          text: brands[index].text
        }
        optionsBrand.value.push(brand)
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getOptionCity = () => {
  MasterApi.getCityOptions().then(res => {
    optionsCity.value = MasterMapper.mapCityModelToDto(res.data.data)
    changeCity()
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const changeCity = () => {
  const cityId = store.city_id
  if (cityId !== '' && cityId !== undefined) {
    MasterApi.getDistrictOptions(cityId).then(res => {
      optionsDistrict.value = MasterMapper.mapCityModelToDto(res.data.data)
    })
  } else {
    store.district_id = ''
  }
}

const changeExpiredDate = () => {
  if (commonFunc.dateFormatCheck(store.expired_at)) {
    getTimeLive()
  }
}

const back = () => {
  router.push('/store/list')
}

const integerOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

// Lifecycle hooks
onMounted(() => {
  getOptionBrand()
  getDefaultDate()
  getStoreDetail()
})
</script>
