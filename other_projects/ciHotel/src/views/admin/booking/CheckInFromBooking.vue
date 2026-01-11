<template>
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between mb-4">
        <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" @click="back">
          Quay lại
        </button>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="save"
          :disabled="saving">
          Nhận Phòng
        </button>
      </div>

      <h4 class="text-xl font-bold text-center text-[#F85F36] mb-4">Nhận phòng {{booking.room_name}}</h4>
      <hr class="my-4">

      <div v-show="loading" class="text-center my-4">
        <i class="fas fa-spinner fa-spin fa-3x text-blue-500"></i>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tên người nhận phòng <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="errorName ? 'border-red-500' : 'border-gray-300'"
              v-model="booking.customer_name">
            <p v-if="errorName" class="text-red-500 text-xs mt-1">Đây là mục bắt buộc nhập</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="errorPhone || !phoneNumberCheckFlag ? 'border-red-500' : 'border-gray-300'"
              v-model="booking.phone_number"
              @keyup="integerOnly($event.target)"
              autocomplete="new-password"
              maxlength="20"
              @change="checkPhoneNumberFormat($event.target.value)">
            <p v-if="errorPhone" class="text-red-500 text-xs mt-1">Đây là mục bắt buộc nhập</p>
            <p v-if="!phoneNumberCheckFlag" class="text-red-500 text-xs mt-1">Số điện thoại không đúng</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Thời gian đặt phòng theo</label>
            <select
              v-model="booking.booking_time"
              @change="changeBookingTime"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="option in bookingTime" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Thời gian nhận phòng <span class="text-red-500">*</span>
            </label>
            <Datepicker
              ref="checkInRef"
              v-model="booking.check_in"
              format="YYYY-MM-DD H:i:s"
              @input="changeCheckIn()"
              class="w-full"
            />
            <p v-if="errorCheckIn" class="text-red-500 text-xs mt-1">Đây là mục bắt buộc nhập</p>
            <p v-if="validateCheckInCheckOut" class="text-red-500 text-xs mt-1">Thời gian nhận phòng không hợp lệ</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Thời gian trả phòng <span class="text-red-500">*</span>
            </label>
            <Datepicker
              ref="checkOutRef"
              v-model="booking.check_out"
              format="YYYY-MM-DD H:i:s"
              @input="changeCheckOut()"
              class="w-full"
            />
            <p v-if="errorCheckOut" class="text-red-500 text-xs mt-1">Đây là mục bắt buộc nhập</p>
            <p v-if="validateCheckInCheckOut" class="text-red-500 text-xs mt-1">Thời gian trả phòng không hợp lệ</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Người lớn <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              autocomplete="new-password"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="errorAdult ? 'border-red-500' : 'border-gray-300'"
              v-model="booking.adult">
            <p v-if="errorAdult" class="text-red-500 text-xs mt-1">Đây là mục bắt buộc nhập</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trẻ em</label>
            <input
              type="number"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="booking.children">
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded">
            <p class="text-sm font-medium text-gray-700 mb-2">Phòng: <span class="font-bold">{{booking.room_name}}</span></p>
            <p class="text-sm font-medium text-gray-700 mb-2">Loại phòng: <span class="font-bold">{{booking.room_type_name}}</span></p>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Giá</label>
              <p v-for="price in booking.price" :key="price.id" class="pl-2 text-sm">
                {{"- " + price.name + ": " + formatCurrency(price.room_price)}}vnđ
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
            <textarea
              rows="3"
              v-model="booking.note"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">CCCD/CMND</label>
            <input
              type="text"
              @keyup="integerOnly($event.target)"
              autocomplete="new-password"
              maxlength="20"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Chứng minh nhân dân"
              v-model="booking.cmnd_number">

            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Mặt trước</label>
                <div
                  class="w-full px-3 py-2 border border-gray-300 rounded flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  @click="$refs.file_cmnd_image_front.click()">
                  <span class="text-sm text-gray-600 truncate">{{ booking.cmnd_image_front || 'Chọn file' }}</span>
                  <span class="text-xs bg-gray-200 px-2 py-1 rounded">Browse</span>
                </div>
                <input
                  class="hidden"
                  type="file"
                  ref="file_cmnd_image_front"
                  accept="image/*"
                  @change="handleCMNDImageFrontUpload"/>
                <div v-if="booking.cmnd_image_front_preview" class="mt-2">
                  <img :src="booking.cmnd_image_front_preview" class="w-full h-auto rounded">
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Mặt sau</label>
                <div
                  class="w-full px-3 py-2 border border-gray-300 rounded flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  @click="$refs.file_cmnd_image_back.click()">
                  <span class="text-sm text-gray-600 truncate">{{ booking.cmnd_image_back || 'Chọn file' }}</span>
                  <span class="text-xs bg-gray-200 px-2 py-1 rounded">Browse</span>
                </div>
                <input
                  class="hidden"
                  type="file"
                  ref="file_cmnd_image_back"
                  accept="image/*"
                  @change="handleCMNDImageBackUpload"/>
                <div v-if="booking.cmnd_image_back_preview" class="mt-2">
                  <img :src="booking.cmnd_image_back_preview" class="w-full h-auto rounded">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import moment from 'moment'

export default {
  components: {
    Datepicker
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()
    const { formatCurrency } = useFormatters()

    return {
      router,
      route,
      toast,
      formatCurrency
    }
  },
  data() {
    return {
      setting: null,
      booking: {
        "booking_id": null,
        "customer_name": null,
        "phone_number": null,
        "actual_check_in": null,
        "check_in": null,
        "check_out": null,
        "adult": null,
        "children": null,
        "room_id": null,
        "room_name": null,
        "booking_time": null,
        "note": null,
        "cmnd_number": null,
        "cmnd_image_front": null,
        "cmnd_image_front_preview": null,
        "cmnd_image_back": null,
        "cmnd_image_back_preview": null,
        "customer_history_id": null,
      },
      bookingTime: [
        {"value": null, "text": ""},
        {"value": "h", "text": "Theo giờ"},
        {"value": "d", "text": "Theo ngày"},
        {"value": "m", "text": "Theo tháng"}
      ],
      phoneNumberCheckFlag: true,
      validateCheckInCheckOut: false,
      file_cmnd_image_front: null,
      file_cmnd_image_back: null,
      saving: false,
      click: false,
      loading: false
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    errorName() {
      return this.checkInfo(this.booking.customer_name)
    },
    errorPhone() {
      return this.checkInfo(this.booking.phone_number)
    },
    errorCheckIn() {
      return this.checkInfo(this.booking.check_in)
    },
    errorCheckOut() {
      return this.checkInfo(this.booking.check_out)
    },
    errorAdult() {
      return this.checkInfo(this.booking.adult)
    }
  },
  mounted() {
    let dateNow = new Date()
    dateNow.setTime(dateNow.getTime() + (7*60*60*1000))
    this.booking.check_in = dateNow.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    dateNow.setMonth(12)
    this.booking.actual_check_in = dateNow.toISOString().replace(/T/, ' ').replace(/\..+/, '')

    this.getBookingDetail()
    this.getSystemConfig()
  },
  methods: {
    changeCheckIn() {
      this.changeCheckInCheckOut()
      if (!this.setting) return
      if (this.booking.check_in && this.booking.booking_time != "h") {
        this.booking.check_in = `${moment(this.booking.check_in).format("YYYY-MM-DD")} ${this.setting.startDate.value}:00`
      }
    },
    changeCheckOut() {
      this.changeCheckInCheckOut()
      if (!this.setting) return
      if (this.booking.check_out && this.booking.booking_time != "h") {
        this.booking.check_out = `${moment(this.booking.check_out).format("YYYY-MM-DD")} ${this.setting.endDate.value}:00`
      }
    },
    changeBookingTime(event) {
      if (event == "h") {
        this.resetTimeInput()
      } else {
        this.changeCheckIn()
        this.changeCheckOut()
      }
    },
    checkInfo(info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate() {
      return !(this.errorName || this.errorCheckIn || this.errorCheckOut ||
        this.errorAdult || !this.phoneNumberCheckFlag)
    },
    handleCMNDImageFrontUpload() {
      this.booking.cmnd_image_front_preview = null
      this.file_cmnd_image_front = this.$refs.file_cmnd_image_front.files[0]
      this.booking.cmnd_image_front = this.file_cmnd_image_front.name

      let reader = new FileReader()
      reader.addEventListener("load", function () {
        this.booking.cmnd_image_front_preview = reader.result
      }.bind(this), false)
      if(this.file_cmnd_image_front) {
        reader.readAsDataURL(this.file_cmnd_image_front)
      }
    },
    handleCMNDImageBackUpload() {
      this.booking.cmnd_image_back_preview = null
      this.file_cmnd_image_back = this.$refs.file_cmnd_image_back.files[0]
      this.booking.cmnd_image_back = this.file_cmnd_image_back.name

      let reader = new FileReader()
      reader.addEventListener("load", function () {
        this.booking.cmnd_image_back_preview = reader.result
      }.bind(this), false)
      if(this.file_cmnd_image_back) {
        reader.readAsDataURL(this.file_cmnd_image_back)
      }
    },
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
    save() {
      this.saving = true
      this.click = true
      let result = this.checkValidate()
      if(!result) {
        this.saving = false
        return
      }

      if(this.booking.check_in > this.booking.check_out) {
        this.validateCheckInCheckOut = true
        return
      }

      this.booking.actual_check_in = moment().format("YYYY-MM-DD HH:mm:ss")
      const formData = new FormData()
      formData.append("booking_id", this.booking.booking_id)
      formData.append("room_id", this.booking.room_id)
      formData.append("customer_name", this.booking.customer_name)
      formData.append("phone_number", this.booking.phone_number)
      formData.append("check_in", this.booking.check_in)
      formData.append("room_type_id", this.booking.room_type_id)
      formData.append("deposit", this.booking.deposit)
      formData.append("actual_check_in", this.booking.actual_check_in)
      formData.append("check_out", this.booking.check_out)
      formData.append("adult", this.booking.adult)
      formData.append("children", this.booking.children)
      formData.append("booking_time", this.booking.booking_time)
      formData.append("note", this.booking.note)
      formData.append("cmnd", this.booking.cmnd_number)
      formData.append("cmnd_image_front", this.file_cmnd_image_front)
      formData.append("cmnd_image_end", this.file_cmnd_image_back)
      formData.append("customer_history_id", this.booking.customer_history_id)
      this.doSave(formData)
    },
    doSave(formData) {
      this.saving = true
      adminAPI.checkIn(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null) {
          this.router.push('/booking/list-room')
        } else {
          this.toast.error('Lưu thông tin check in thất bại!!!')
        }
      }).catch(err => {
        this.saving = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },
    resetTimeInput() {
      this.$refs.checkInRef.clearDate()
      this.$refs.checkInRef.hideCal = true
      this.$refs.checkInRef.setHour(moment().hour())
      this.$refs.checkInRef.setMinute(moment().minute())
      this.$refs.checkOutRef.clearDate()
      this.$refs.checkOutRef.hideCal = true
      this.$refs.checkOutRef.setHour(moment().hour())
      this.$refs.checkOutRef.setMinute(moment().minute())
    },
    back() {
      this.router.push('/booking/list-room')
    },
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },
    getBookingDetail() {
      let booking_id = this.route.params.id
      if(booking_id) {
        adminAPI.getBookingDetail(booking_id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.booking = res.data.data
            this.booking.cmnd_image_front_preview = null
            this.booking.cmnd_image_front = null
            this.booking.cmnd_image_back_preview = null
            this.booking.cmnd_image_back = null
          }
        }).catch(err => {
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },
    getSystemConfig() {
      commonFunc.getTimeConfig().then(cfg => {
        this.setting = cfg
      }).catch(err => {
        console.log(err)
        this.loading = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },
    changeCheckInCheckOut() {
      if(this.booking.check_out) {
        this.booking.check_out = this.booking.check_out.substring(0, this.booking.check_out.length - 2) + "59"
      }
      if(this.booking.check_in && this.booking.check_out) {
        if(this.booking.check_in > this.booking.check_out) {
          this.validateCheckInCheckOut = true
        } else {
          this.validateCheckInCheckOut = false
        }
      }
    }
  }
}
</script>

<style lang="scss">
#check_in, #check_out {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
