<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md">
        <div class="p-4">
          <div class="grid grid-cols-1 gap-4">
            <div class="col-span-1">
              <h4 class="mt-2 text-center text-orange-500">{{ $route.params.id ? 'Sửa Cửa Hàng' : 'Thêm Cửa Hàng' }}</h4>
            </div>
          </div>
          <hr />

          <!-- Form content -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Tên <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="name"
                type="text"
                :class="['form-control', { 'border-red-500': errorName }]"
                v-model="store.name"
                maxlength="100" />
              <div v-if="errorName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Thương hiệu</label>
            </div>
            <div class="md:col-span-9">
              <select
                id="brand_id"
                class="form-control"
                v-model="store.brand_id">
                <option v-for="brand in optionsBrand" :key="brand.value" :value="brand.value">
                  {{ brand.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Tỉnh / Thành Phố <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <select
                id="city_id"
                :class="['form-control', { 'border-red-500': errorCiti }]"
                v-model="store.city_id"
                @change="changeCity()">
                <option v-for="city in optionsCity" :key="city.value" :value="city.value">
                  {{ city.text }}
                </option>
              </select>
              <div v-if="errorCiti" class="text-red-500 text-sm mt-1">
                Vui lòng chọn tỉnh / thành phố
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Quận / Huyện <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <select
                id="district_id"
                :class="['form-control', { 'border-red-500': errorDistrict }]"
                v-model="store.district_id">
                <option v-for="district in optionsDistrict" :key="district.value" :value="district.value">
                  {{ district.text }}
                </option>
              </select>
              <div v-if="errorDistrict" class="text-red-500 text-sm mt-1">
                Vui lòng chọn quận / huyện
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Địa Chỉ <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="address"
                type="text"
                :class="['form-control', { 'border-red-500': errorAddress }]"
                v-model="store.address"
                maxlength="200" />
              <div v-if="errorAddress" class="text-red-500 text-sm mt-1">
                Vui lòng nhập địa chỉ
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Số Điện Thoại <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="phone_number"
                type="text"
                :class="['form-control', { 'border-red-500': errorPhoneNumber }]"
                v-model="store.phone_number"
                maxlength="20" />
              <div v-if="errorPhoneNumber" class="text-red-500 text-sm mt-1">
                Vui lòng nhập số điện thoại
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Ngày hết hạn <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="expired_at"
                type="text"
                :class="['form-control', { 'border-red-500': errorExpiredAt }]"
                v-model="store.expired_at"
                @input="inputDateOnly($event.target)"
                @blur="changeExpiredDate()"
                maxlength="10"
                placeholder="dd-mm-yyyy" />
              <div v-if="errorExpiredAt" class="text-red-500 text-sm mt-1">
                Vui lòng nhập ngày hết hạn (dd-mm-yyyy)
              </div>
              <div v-if="timeLive" class="text-gray-600 text-sm mt-1">
                Thời gian còn lại: {{ timeLive }}
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="flex justify-start">
              <button class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded" @click="back">
                Quay lại
              </button>
            </div>
            <div class="flex justify-start">
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                :disabled="saving"
                @click="save">
                {{ saving ? 'Đang lưu...' : 'Lưu' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import superAdminAPI from '@/api/superAdmin'
import Mapper from '@/mapper/store'
import commonFunc from '@/common/commonFunc'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const toast = useToast()
    const router = useRouter()
    const route = useRoute()

    return {
      toast,
      router,
      route
    }
  },
  data() {
    return {
      optionsBrand: [],
      optionsCity: [],
      optionsDistrict: [],
      store: {
        name: '',
        brand_id: null,
        address: '',
        phone_number: '',
        city_id: '',
        district_id: '',
        expired_at: ''
      },
      saving: false,
      timeLive: ''
    }
  },
  mounted() {
    this.getOptionBrand()
    this.getDefaultDate()
    this.getStoreDetail()
  },
  computed: {
    errorName() {
      return this.checkInfo(this.store.name)
    },
    errorCiti() {
      return this.checkInfo(this.store.city_id)
    },
    errorDistrict() {
      return this.checkInfo(this.store.district_id)
    },
    errorAddress() {
      return this.checkInfo(this.store.address)
    },
    errorPhoneNumber() {
      return this.checkInfo(this.store.phone_number)
    },
    errorExpiredAt() {
      return this.checkInfo(this.store.expired_at)
    }
  },
  methods: {
    checkInfo(info) {
      return this.saving && (info == null || info.length <= 0)
    },
    checkValidate() {
      return !(this.errorName || this.errorCiti || this.errorDistrict ||
               this.errorAddress || this.errorPhoneNumber || this.errorExpiredAt)
    },

    getTimeLive() {
      let dateNow = new Date()
      let dayInMonth = new Date(dateNow.getFullYear(), (dateNow.getMonth() + 1), 0).getDate()

      let year = dateNow.getFullYear()
      let month = dateNow.getMonth() + 1
      let day = dateNow.getDate()

      let expiredDate = this.store.expired_at.split("-")
      let eYear = parseInt(expiredDate[2])
      let eMonth = parseInt(expiredDate[1])
      let eDay = parseInt(expiredDate[0])

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
      this.timeLive = minYear + " năm " + minMon + " tháng " + minDay + " ngày"
    },

    getDefaultDate() {
      if (!this.route.params.id) {
        let dateNow = new Date()
        let oneMonth = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
        this.store.expired_at = commonFunc.formatDate(oneMonth.toJSON().slice(0, 10))
        this.getTimeLive()
      }
    },

    getStoreDetail() {
      let storeId = this.route.params.id
      if (storeId) {
        superAdminAPI.getStoreDetail(storeId).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.store = Mapper.mapStoreDetailModelToDto(res.data.data)
            this.getTimeLive()
            this.getOptionCity()
          }
        }).catch(err => {
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      } else {
        this.getOptionCity()
      }
    },

    save() {
      this.saving = true
      let result = this.checkValidate()
      if (result) {
        let store = JSON.parse(JSON.stringify(this.store))
        store.expired_at = commonFunc.convertDDMMYYYYToYYYYMMDD(this.store.expired_at)

        let storeId = this.route.params.id
        if (storeId) {
          // Edit
          store.id = storeId
          superAdminAPI.editStore(store).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              if (res.data.status == 200) {
                alert("Cập nhật thành công")
                this.router.push("/store/list")
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
            alert(message)
          })
        } else {
          // Add
          superAdminAPI.addStore(store).then(res => {
            this.saving = false
            if (res != null && res.data != null) {
              if (res.data.status == 200) {
                alert("Thêm thành công")
                this.router.push("/store/list")
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
            alert(message)
          })
        }
      } else {
        this.saving = false
      }
    },

    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    getOptionBrand() {
      superAdminAPI.getBrandOption().then(res => {
        this.optionsBrand = [{ value: null, text: "" }]
        if (res && res.data && res.data.data) {
          let brands = res.data.data
          for (var index in brands) {
            let brand = {
              value: brands[index].value,
              text: brands[index].text
            }
            this.optionsBrand.push(brand)
          }
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    getOptionCity() {
      MasterApi.getCityOptions().then(res => {
        this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
        this.changeCity()
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    changeCity() {
      let cityId = this.store.city_id
      if (cityId != "" && cityId != undefined) {
        MasterApi.getDistrictOptions(cityId).then(res => {
          this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
        })
      } else {
        this.store.district_id = ""
      }
    },

    changeExpiredDate() {
      if (commonFunc.dateFormatCheck(this.store.expired_at)) {
        this.getTimeLive()
      }
    },

    back() {
      this.router.push("/store/list")
    }
  }
}
</script>
