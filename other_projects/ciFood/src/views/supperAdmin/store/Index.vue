<template>
  <div class="container-fluid px-4 py-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Title -->
        <h4 class="text-xl font-semibold text-center mb-4">Store</h4>
        <hr class="mb-4">

        <!-- Form -->
        <div class="space-y-4">
          <!-- Name -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Tên<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="store.name"
                type="text"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }">
              <p v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên</p>
            </div>
          </div>

          <!-- Brand -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">Thương hiệu</label>
            <div class="md:col-span-9">
              <select
                v-model="store.brand_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in optionsBrand" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
            </div>
          </div>

          <!-- City -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Tỉnh/ Thành Phố<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <select
                v-model="store.city_id"
                @change="changeCity"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorCiti }">
                <option v-for="option in optionsCity" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
              <p v-if="errorCiti" class="text-red-500 text-sm mt-1">Vui lòng nhập tỉnh/thành phố</p>
            </div>
          </div>

          <!-- District -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Quận<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <select
                v-model="store.district_id"
                :disabled="store.city_id === ''"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                :class="{ 'border-red-500': errorDistrict }">
                <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
              <p v-if="errorDistrict" class="text-red-500 text-sm mt-1">Vui lòng nhập quận</p>
            </div>
          </div>

          <!-- Address -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Địa Chỉ<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="store.address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorAddress }">
              <p v-if="errorAddress" class="text-red-500 text-sm mt-1">Vui lòng nhập địa chỉ</p>
            </div>
          </div>

          <!-- Phone Number -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Số điện thoại<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="store.phone_number"
                type="text"
                maxlength="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorPhoneNumber }">
              <p v-if="errorPhoneNumber" class="text-red-500 text-sm mt-1">Vui lòng nhập số điện thoại</p>
            </div>
          </div>

          <!-- Package -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Gói sử dụng<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <select
                v-model="store.package"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorPackage }">
                <option v-for="option in optionsPackage" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
              <p v-if="errorPackage" class="text-red-500 text-sm mt-1">Vui lòng chọn gói sử dụng</p>
            </div>
          </div>

          <!-- Expired Date -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Hết Hạn Vào<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="store.expired_at"
                type="text"
                placeholder="DD-MM-YYYY"
                @keyup="inputDateOnly($event.target)"
                @change="changeExpiredDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorExpiredAt }">
              <p v-if="errorExpiredAt" class="text-red-500 text-sm mt-1">Vui lòng nhập ngày hết hạn</p>
            </div>
          </div>

          <!-- Time Live -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">Thời hạn</label>
            <div class="md:col-span-9">
              <p class="pt-2">{{ timeLive }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between mt-6">
          <button
            @click="back"
            class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200">
            Quay lại
          </button>
          <button
            @click="save"
            :disabled="saving"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import superAdminAPI from '@/api/superAdmin'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

// Data
const optionsBrand = ref([])
const optionsCity = ref([])
const optionsDistrict = ref([])
const optionsPackage = ref([
  { "value": null, "text": "" },
  { "value": 'standard', "text": "Căn bản" },
  { "value": 'advanced', "text": "Nâng cao" }
])

const store = ref({
  name: '',
  brand_id: null,
  address: '',
  phone_number: '',
  city_id: '',
  district_id: '',
  package: null,
  expired_at: ''
})

const saving = ref(false)
const clicked = ref(false)
const timeLive = ref(0)

// Computed
const errorName = computed(() => checkInfo(store.value.name))
const errorCiti = computed(() => checkInfo(store.value.city_id))
const errorDistrict = computed(() => checkInfo(store.value.district_id))
const errorAddress = computed(() => checkInfo(store.value.address))
const errorPhoneNumber = computed(() => checkInfo(store.value.phone_number))
const errorPackage = computed(() => checkInfo(store.value.package))
const errorExpiredAt = computed(() => checkInfo(store.value.expired_at))

// Methods
const checkInfo = (info) => {
  return clicked.value && (info == null || info.length <= 0)
}

const checkValidate = () => {
  return !(errorName.value || errorCiti.value || errorDistrict.value || errorAddress.value || 
           errorPhoneNumber.value || errorPackage.value || errorExpiredAt.value)
}

const getTimeLive = () => {
  const dateNow = new Date()
  const dayInMonth = new Date(dateNow.getFullYear(), (dateNow.getMonth() + 1), 0).getDate()

  const year = dateNow.getFullYear()
  const month = dateNow.getMonth() + 1
  const day = dateNow.getDate()

  const expiredDate = store.value.expired_at.split("-")
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
  timeLive.value = minYear + " năm " + minMon + " tháng " + minDay + " ngày"
}

const getDefaultDate = () => {
  if (!route.params.id) {
    const dateNow = new Date()
    const oneMonth = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
    store.value.expired_at = commonFunc.formatDate(oneMonth.toJSON().slice(0, 10))
    getTimeLive()
  }
}

const getStoreDetail = () => {
  const storeId = route.params.id
  if (storeId) {
    superAdminAPI.getStoreDetail(storeId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        store.value = res.data.data
        store.value.expired_at = commonFunc.formatDate(store.value.expired_at)
        getTimeLive()
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
  clicked.value = true
  const result = checkValidate()
  if (result) {
    saving.value = true
    const storeData = JSON.parse(JSON.stringify(store.value))
    storeData.expired_at = commonFunc.convertDDMMYYYYToYYYYMMDD(store.value.expired_at)

    const storeId = route.params.id
    if (storeId) {
      // Edit
      storeData.id = storeId
      superAdminAPI.editStore(storeData).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            popToast('success', 'Cập nhật thành công')
            router.push("/store/list")
          }
        }
      }).catch(err => {
        saving.value = false
        let message = "Lỗi hệ thống"
        if (err.response?.data?.status == 422) {
          message = err.response.data.mess
        }
        popToast('danger', message)
      })
    } else {
      // Add
      superAdminAPI.addStore(storeData).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            popToast('success', 'Thêm thành công')
            router.push("/store/list")
          }
        }
      }).catch(err => {
        saving.value = false
        let message = "Lỗi hệ thống"
        if (err.response?.data?.status == 422) {
          message = err.response.data.mess
        }
        popToast('danger', message)
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
    optionsBrand.value = [{ "value": null, "text": "" }]
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
  const cityId = store.value.city_id
  if (cityId != "" && cityId != undefined) {
    MasterApi.getDistrictOptions(cityId).then(res => {
      optionsDistrict.value = MasterMapper.mapCityModelToDto(res.data.data)
    })
  } else {
    store.value.district_id = ""
  }
}

const changeExpiredDate = () => {
  if (commonFunc.dateFormatCheck(store.value.expired_at)) {
    getTimeLive()
  }
}

const back = () => {
  router.push("/store/list")
}

// Lifecycle
onMounted(() => {
  getOptionBrand()
  getDefaultDate()
  getStoreDetail()
})
</script>
