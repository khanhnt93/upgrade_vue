<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="p-4">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <button
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              @click="back">
              Quay lại
            </button>
          </div>
          <div class="text-right">
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="save"
              :disabled="saving">
              Lưu
            </button>
          </div>
        </div>

        <div class="text-center mb-4">
          <h4 class="text-xl font-semibold mt-2">Khách hàng</h4>
        </div>
        <hr class="mb-4"/>

        <!-- Loading -->
        <div v-show="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Loại khách hàng</label>
            </div>
            <div class="md:col-span-9">
              <div class="flex items-center space-x-6">
                <div class="flex items-center">
                  <input
                    type="radio"
                    v-model="inputs.type_id"
                    name="type"
                    value="personal"
                    class="mr-2">
                  <label>Cá nhân</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="radio"
                    v-model="inputs.type_id"
                    name="type"
                    value="company"
                    class="mr-2">
                  <label>Công ty</label>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Tên <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="name"
                type="text"
                :class="['form-control w-full', errorName ? 'border-red-500' : '']"
                v-model="inputs.name"
                autocomplete="new-password"
                maxlength="75">
              <div v-if="errorName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Số Điện Thoại <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="phone"
                type="text"
                :class="['form-control w-full', errorPhone ? 'border-red-500' : '']"
                v-model="inputs.phone_number"
                @keyup="integerOnly($event.target)"
                autocomplete="new-password"
                maxlength="20"
                @change="checkPhoneNumberFormat($event.target.value)">
              <div v-if="errorPhone" class="text-red-500 text-sm mt-1">
                Số điện thoại không đúng
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>EMail</label>
            </div>
            <div class="md:col-span-9">
              <input
                id="email"
                type="text"
                class="form-control w-full"
                v-model="inputs.email"
                autocomplete="new-password"
                maxlength="75">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Giới Tính <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <select
                :class="['form-control w-full', errorGender ? 'border-red-500' : '']"
                v-model="inputs.gender">
                <option v-for="option in optionsGender" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <div v-if="errorGender" class="text-red-500 text-sm mt-1">
                Vui lòng chọn giới tính
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Ngày Tháng Năm Sinh <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="birthday"
                v-model="inputs.birthday"
                type="text"
                placeholder="dd-mm-yyyy"
                autocomplete="new-password"
                :class="['form-control w-full', (errorBirthday || !birthdayCheckFlag) ? 'border-red-500' : '']"
                @change="checkBirthdayFormat($event.target)">
              <div v-if="errorBirthday" class="text-red-500 text-sm mt-1">
                Vui lòng nhập ngày sinh
              </div>
              <div v-if="!birthdayCheckFlag" class="text-red-500 text-sm mt-1">
                Ngày sinh không đúng
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Tỉnh/ Thành Phố <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <select
                id="city_id"
                :class="['form-control w-full', errorCity ? 'border-red-500' : '']"
                v-model="inputs.city_id"
                @change="changeCity()">
                <option v-for="option in optionsCity" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <div v-if="errorCity" class="text-red-500 text-sm mt-1">
                Vui lòng chọn thành phố
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Quận/ Huyện <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <select
                id="district_id"
                :class="['form-control w-full', errorDistrict ? 'border-red-500' : '']"
                v-model="inputs.district_id"
                :disabled="!inputs.city_id">
                <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <div v-if="errorDistrict" class="text-red-500 text-sm mt-1">
                Vui lòng nhập quận
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Địa chỉ</label>
            </div>
            <div class="md:col-span-9">
              <input
                id="address"
                type="text"
                class="form-control w-full"
                v-model="inputs.address"
                autocomplete="new-password"
                maxlength="255">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Mô tả</label>
            </div>
            <div class="md:col-span-9">
              <textarea
                id="description"
                class="form-control w-full"
                rows="3"
                v-model="inputs.description">
              </textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Hết Hạn Vào <span class="text-red-500">*</span></label>
            </div>
            <div class="md:col-span-9">
              <input
                id="expriedDate"
                type="text"
                :class="['form-control w-full', errorExpiredAt ? 'border-red-500' : '']"
                v-model="inputs.expired_at"
                @keyup="inputDateOnly($event.target)"
                @change="changeExpiredDate">
              <div v-if="errorExpiredAt" class="text-red-500 text-sm mt-1">
                Vui lòng nhập ngày hết hạn
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3">
              <label>Hình ảnh</label>
            </div>
            <div class="md:col-span-9">
              <div class="flex">
                <input
                  v-model="inputs.image"
                  class="form-control flex-1"
                  readonly>
                <button
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded-r hover:bg-gray-400"
                  @click="$refs.file.click()">
                  Browse
                </button>
              </div>
              <input
                class="hidden"
                type="file"
                id="file"
                ref="file"
                accept="image/*"
                @change="handleFileUpload"/>
            </div>
          </div>

          <div v-if="inputs.image_preview" class="grid grid-cols-1">
            <div class="text-center" :style="{height: computedWidth, width: '100%'}">
              <vue-cropper
                ref="cropper"
                :guides="true"
                :view-mode="2"
                :center="true"
                drag-mode="crop"
                :auto-crop-area="1"
                :background="true"
                :rotatable="true"
                :src="inputs.image_preview"
                :initialAspectRatio="1/1"
                :aspectRatio="1/1"
                alt="Source Image"
                :style="computedImg"
                :crop="cropImage">
              </vue-cropper>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import customerApi from '@/api/customer'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'

export default {
  components: {
    VueCropper
  },
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
  data () {
    return {
      inputs: {
        "name": null,
        "phone_number": null,
        "gender": null,
        "birthday": null,
        "city_id": null,
        "district_id": null,
        "address": null,
        "description": null,
        "expired_at": null ,
        "email" : null,
        "type_id" : null,
        "image": null,
        image_preview: null
      },
      optionsGender: [
        {value: '1', text: 'Nam'},
        {value: '2', text: 'Nữ'},
        {value: '3', text: 'Khác'}
      ],
      optionsCity: [],
      optionsDistrict: [],
      click: false,
      phoneNumberCheckFlag: true,
      birthdayCheckFlag: true,
      saving: false,
      loading: false,
      file: null,
      height: '100px',
      styleImg: {},
    }
  },
  mounted() {
    this.getCustomerDetail()
    this.getOptionCity()
    this.getDefaultDate()
  },
  computed: {
    computedWidth() {
      return this.height
    },
    computedImg() {
      return this.styleImg
    },
    errorName () {
      return this.checkInfo(this.inputs.name)
    },
    errorPhone () {
      return this.checkPhoneNumber(this.inputs.phone_number)
    },
    errorGender () {
      return this.checkInfo(this.inputs.gender)
    },
    errorBirthday () {
      return this.checkInfo(this.inputs.birthday)
    },
    errorCity () {
      return this.checkInfo(this.inputs.city_id)
    },
    errorDistrict () {
      return this.checkInfo(this.inputs.district_id)
    },
    errorExpiredAt: function () {
      return this.checkInfo(this.inputs.expired_at)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkPhoneNumber (info) {
      return (this.click && (info == null || info.length <= 0 || !this.checkPhoneNumberFormat(info)))
    },
    checkValidate () {
      return !(this.errorName || this.errorPhone || this.errorGender || this.errorBirthday
        || this.errorCity || this.errorDistrict || !this.birthdayCheckFlag || !this.phoneNumberCheckFlag || !this.errorExpiredAt)
    },

    /**
     * Check phone number
     */
    checkPhoneNumberFormat(item) {
      let valueInput = item
      if (valueInput != null && valueInput != "") {
        if (!commonFunc.phoneNumberCheck(valueInput)) {
          return false
        }
      }
      return true
    },

    /**
     * Get city options
     */
    getOptionCity() {
      MasterApi.getCityOptions().then(res => {
        this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
        this.changeCity()
      })
    },

    /**
     *  Get detail
     */
    getCustomerDetail() {
      let cusId = this.route.params.id
      if(cusId) {
        customerApi.getCustomerDetailByStore(cusId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.inputs = res.data.data
            this.getOptionCity()
          }
        }).catch(err => {
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    /**
     *  Save
     */
    save () {
      this.click = true

      let checkValidate = this.checkValidate()
      if(!checkValidate) {
        return
      }

      this.saving = true

      let customerId = this.route.params.id
      let params = JSON.parse(JSON.stringify(this.inputs))
      params.id = customerId
      params.phone = this.inputs.phone_number
      params.birthday = this.formatDate(this.inputs.birthday)

      if(customerId){
        // Edit
        customerApi.updateCustomerByStore(params).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            if (res.data.status == 200) {
              this.toast.success('Cập nhật khách hàng thành công!!! ')
            }
          }
        }).catch(err => {
          this.saving = false
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      } else {
        // Add
        customerApi.addCustomerByStore(params).then(res => {
          this.saving = false
          if(res != null && res.data != null){
            if (res.data.status == 200) {
              this.router.push("/customer/list")
            }
          }
        }).catch(err => {
          this.saving = false
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    /**
     * Format date
     */
    formatBirthday() {
      let birthday = this.inputs.birthday
      let temp = birthday.split("-")
      if(temp.length == 1) {
        temp = birthday.split("/")
      }
      this.inputs.birthday = temp[2] + "-" + temp[1] + "-" + temp[0]
    },

    /**
     * Format date
     */
    formatDate(dateInput) {
      let result = dateInput
      if(dateInput) {
        let temp = dateInput.split("-")
        if(temp.length == 1) {
          temp = dateInput.split("/")
        }
        result = temp[2] + "-" + temp[1] + "-" + temp[0]
      }
      return result
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
     * Get district by city
     */
    changeCity() {
      let cityId = this.inputs.city_id
      if(cityId != "" && cityId != undefined) {
        MasterApi.getDistrictOptions(cityId).then(res => {
          this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
        })
      } else {
        this.inputs.district_id = ""
      }
    },

    /**
     * Check phone number
     */
    checkBirthdayFormat(item) {
      let valueInput = item.value
      if (valueInput != null && valueInput != "") {
        if (commonFunc.dateFormatCheck(valueInput)) {
          this.birthdayCheckFlag = true
        } else {
          this.birthdayCheckFlag = false
        }
      } else {
        this.birthdayCheckFlag = true
      }
    },

    /**
     * Back to list
     */
    back() {
      this.router.push("/customer/list")
    },

    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    /**
     * Change expired date
     */
    changeExpiredDate() {
      if(commonFunc.dateFormatCheck(this.inputs.expired_at)) {
        this.getTimeLive()
      }
    },

    /**
     * Get time live
     */
    getTimeLive() {
      let dateNow = new Date()
      let dayInMonth = new Date(dateNow.getFullYear(), (dateNow.getMonth() + 1), 0).getDate()

      let year = dateNow.getFullYear()
      let month = dateNow.getMonth() + 1
      let day = dateNow.getDate()

      let expiredDate = this.inputs.expired_at.split("-")
      let eYear = parseInt(expiredDate[2])
      let eMonth = parseInt(expiredDate[1])
      let eDay = parseInt(expiredDate[0])

      let minYear = parseInt(eYear) - parseInt(year)
      let minMon = eMonth - month
      if(minMon < 0) {
        minMon = 12 - parseInt(month) + parseInt(eMonth)
        minYear = minYear - 1
      }
      let minDay = eDay - day
      if(minDay < 0) {
        minDay = parseInt(dayInMonth) - parseInt(day) + parseInt(eDay)
        minMon = minMon - 1
      }
      this.timeLive = minYear + " năm " + minMon + " tháng " + minDay + " ngày"
    },

    /**
     * Handle upload file
     */
    handleFileUpload () {
      this.inputs.image_preview = null
      this.file = this.$refs.file.files[0]
      this.inputs.image = this.file.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        this.inputs.image_preview = reader.result
      }.bind(this), false)
      if( this.file ){
        reader.readAsDataURL( this.file )
        this.height = '300px'
        this.styleImg = {'max-width': '100%', 'max-height': '100%'}
      }
    },

    /**
     * Event crop image
     */
    cropImage() {
      // Use to check reupload image when edit
    },

    /**
     * Get default date
     */
    getDefaultDate() {
      if(!this.route.params.id) {
        let dateNow = new Date()
        let oneMonth = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
        this.inputs.expired_at = commonFunc.formatDate(oneMonth.toJSON().slice(0,10))

        this.getTimeLive()
      }
    },
  }
}
</script>
