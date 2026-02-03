<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md">
        <div class="p-4">
          <div class="grid grid-cols-1 gap-4">
            <div class="col-span-1">
              <h4 class="mt-2 text-center text-orange-500">{{ $route.params.id ? 'Sửa Khách Sạn' : 'Thêm Khách Sạn' }}</h4>
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
                v-model="hotel.name"
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
                v-model="hotel.brand_id">
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
                v-model="hotel.city_id"
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
                v-model="hotel.district_id">
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
                v-model="hotel.address"
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
                v-model="hotel.phone_number"
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
                v-model="hotel.expired_at"
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

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Email</label>
            </div>
            <div class="md:col-span-9">
              <input
                id="email"
                type="email"
                class="form-control"
                v-model="hotel.email"
                maxlength="100" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Loại</label>
            </div>
            <div class="md:col-span-9">
              <select
                id="type_id"
                class="form-control"
                v-model="hotel.type_id">
                <option v-for="type in optionsType" :key="type.value" :value="type.value">
                  {{ type.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Mô tả</label>
            </div>
            <div class="md:col-span-9">
              <textarea
                id="description"
                class="form-control"
                v-model="hotel.description"
                rows="3"
                maxlength="500"></textarea>
            </div>
          </div>

          <!-- Image upload section -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3 flex items-center">
              <label>Ảnh</label>
            </div>
            <div class="md:col-span-9">
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  class="form-control"
                  v-model="hotel.image"
                  readonly
                  placeholder="Chọn ảnh..." />
                <input
                  type="file"
                  ref="file"
                  style="display: none"
                  accept="image/*"
                  @change="handleFileUpload()" />
                <button
                  type="button"
                  class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                  @click="$refs.file.click()">
                  Browse
                </button>
              </div>
            </div>
          </div>

          <!-- VueCropper preview -->
          <div v-if="hotel.image_preview" class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
            <div class="md:col-span-3"></div>
            <div class="md:col-span-9">
              <div :style="{ height: height }">
                <vue-cropper
                  ref="cropper"
                  :center="true"
                  drag-mode="crop"
                  :auto-crop-area="1"
                  :background="true"
                  :rotatable="true"
                  :src="hotel.image_preview"
                  :initialAspectRatio="1/1"
                  :aspectRatio="1/1"
                  alt="Source Image"
                  :style="computedImg"
                  :crop="cropImage">
                </vue-cropper>
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
import VueCropper from "vue-cropperjs"
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'

export default {
  components: {
    VueCropper
  },
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
      optionsType: [],
      optionsCity: [],
      optionsDistrict: [],
      hotel: {
        name: '',
        brand_id: null,
        address: '',
        phone_number: '',
        city_id: '',
        district_id: '',
        expired_at: '',
        email: null,
        type_id: null,
        image: null,
        description: null,
        image_preview: null
      },
      saving: false,
      timeLive: '',
      file: null,
      height: '100px',
      styleImg: {},
      click: false
    }
  },
  mounted() {
    this.getOptionBrand()
    this.getOptionType()
    this.getDefaultDate()
    this.getHotelDetail()
  },
  computed: {
    computedWidth() {
      return this.height
    },
    computedImg() {
      return this.styleImg
    },
    errorName() {
      return this.checkInfo(this.hotel.name)
    },
    errorCiti() {
      return this.checkInfo(this.hotel.city_id)
    },
    errorDistrict() {
      return this.checkInfo(this.hotel.district_id)
    },
    errorAddress() {
      return this.checkInfo(this.hotel.address)
    },
    errorPhoneNumber() {
      return this.checkInfo(this.hotel.phone_number)
    },
    errorExpiredAt() {
      return this.checkInfo(this.hotel.expired_at)
    }
  },
  methods: {
    checkInfo(info) {
      return this.click && (info == null || info.length <= 0)
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

      let expiredDate = this.hotel.expired_at.split("-")
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
        this.hotel.expired_at = commonFunc.formatDate(oneMonth.toJSON().slice(0, 10))
        this.getTimeLive()
      }
    },

    getHotelDetail() {
      let hotelId = this.route.params.id
      if (hotelId) {
        this.loading = true
        superAdminAPI.getHotelDetail(hotelId).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.hotel = res.data.data
            this.hotel.expired_at = commonFunc.formatDate(res.data.data.expired_at)
            this.file = this.hotel.image_preview
            this.height = '300px'
            this.styleImg = { 'max-width': '100%', 'max-height': '100%' }
            this.getTimeLive()
            this.getOptionCity()
          }
          this.loading = false
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
      this.click = true
      let result = this.checkValidate()
      if (!result) {
        this.saving = false
        return
      }

      if (this.hotel.image_preview) {
        this.$refs.cropper
          .getCroppedCanvas({
            width: 300,
            height: 300
          })
          .toBlob(blob => {
            const formData = new FormData()
            formData.append("name", this.hotel.name)
            formData.append("file", blob, this.hotel.image)
            formData.append("brand_id", this.hotel.brand_id)
            formData.append("district_id", this.hotel.district_id)
            formData.append("address", this.hotel.address)
            formData.append("phone_number", this.hotel.phone_number)
            formData.append("city_id", this.hotel.city_id)
            formData.append("expired_at", commonFunc.convertDDMMYYYYToYYYYMMDD(this.hotel.expired_at))
            formData.append("email", this.hotel.email)
            formData.append("type_id", this.hotel.type_id)
            formData.append("description", this.hotel.description)
            this.doSave(formData)
          })
      } else {
        const formData = new FormData()
        formData.append("file", null)
        formData.append("name", this.hotel.name)
        formData.append("district_id", this.hotel.district_id)
        formData.append("brand_id", this.hotel.brand_id)
        formData.append("address", this.hotel.address)
        formData.append("phone_number", this.hotel.phone_number)
        formData.append("city_id", this.hotel.city_id)
        formData.append("expired_at", commonFunc.convertDDMMYYYYToYYYYMMDD(this.hotel.expired_at))
        formData.append("email", this.hotel.email)
        formData.append("type_id", this.hotel.type_id)
        formData.append("description", this.hotel.description)
        this.doSave(formData)
      }
    },

    doSave(formData) {
      this.saving = true
      let hotelId = this.route.params.id
      if (hotelId) {
        // Edit
        formData.append("id", hotelId)
        superAdminAPI.editHotel(formData).then(res => {
          this.saving = false
          if (res != null && res.data != null) {
            this.toast.success('Lưu menu thành công!!!')
          } else {
            this.toast.error('Lưu thất bại!!!')
          }
        }).catch(err => {
          this.saving = false
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      } else {
        // Add
        superAdminAPI.addHotel(formData).then(res => {
          this.saving = false
          if (res != null && res.data != null) {
            this.router.push("/hotel/list")
          } else {
            this.toast.error('Lưu thất bại!!!')
          }
        }).catch(err => {
          this.saving = false
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
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

    getOptionType() {
      superAdminAPI.getOptionType().then(res => {
        this.optionsType = [{ value: null, text: "" }]
        if (res && res.data && res.data.data) {
          let types = res.data.data
          for (var index in types) {
            let type = {
              value: types[index].value,
              text: types[index].text
            }
            this.optionsType.push(type)
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
      let cityId = this.hotel.city_id
      if (cityId != "" && cityId != undefined) {
        MasterApi.getDistrictOptions(cityId).then(res => {
          this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
        })
      } else {
        this.hotel.district_id = ""
      }
    },

    changeExpiredDate() {
      if (commonFunc.dateFormatCheck(this.hotel.expired_at)) {
        this.getTimeLive()
      }
    },

    handleFileUpload() {
      this.hotel.image_preview = null
      this.file = this.$refs.file.files[0]
      this.hotel.image = this.file.name

      let reader = new FileReader()
      reader.addEventListener("load", function () {
        this.hotel.image_preview = reader.result
      }.bind(this), false)

      if (this.file) {
        reader.readAsDataURL(this.file)
        this.height = '300px'
        this.styleImg = { 'max-width': '100%', 'max-height': '100%' }
      }
    },

    cropImage() {
      // Use to check reupload image when edit
    },

    back() {
      this.router.push("/hotel/list")
    }
  }
}
</script>
