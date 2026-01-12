<template>
  <div class="container-fluid mx-auto p-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between mb-4">
        <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" @click="back">
          Quay lại
        </button>
        <button
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-36 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="save"
          :disabled="saving">
          Đặt phòng
        </button>
      </div>

      <h4 class="text-xl font-bold text-center text-[#F85F36] mb-4">ĐẶT PHÒNG - {{room.name}}</h4>
      <hr class="my-4">

      <!-- Loading -->
      <div v-show="loading" class="text-center my-4">
        <i class="fas fa-spinner fa-spin fa-3x text-blue-500"></i>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Đoàn</label>
            <select
              id="group_customer"
              v-model="booking.customer_group_id"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="option in customerGroups" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tên người đặt phòng <span class="text-red-500">*</span>
            </label>
            <input
              id="customer_name"
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
              id="phone"
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
            <div id="check_in">
              <Datepicker
                ref="checkInRef"
                v-model="booking.check_in"
                format="YYYY-MM-DD H:i:s"
                @input="changeCheckIn()"
                class="w-full"
              />
            </div>
            <p v-if="errorCheckIn" class="text-red-500 text-xs mt-1">Đây là mục bắt buộc nhập</p>
            <p v-if="validateCheckInCheckOut" class="text-red-500 text-xs mt-1">Thời gian nhận phòng không hợp lệ</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Thời gian trả phòng <span class="text-red-500">*</span>
            </label>
            <div id="check_out">
              <Datepicker
                ref="checkOutRef"
                v-model="booking.check_out"
                format="YYYY-MM-DD H:i:s"
                @input="changeCheckOut()"
                class="w-full"
              />
            </div>
            <p v-if="errorCheckOut" class="text-red-500 text-xs mt-1">Đây là mục bắt buộc nhập</p>
            <p v-if="validateCheckInCheckOut" class="text-red-500 text-xs mt-1">Thời gian trả phòng không hợp lệ</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Người lớn <span class="text-red-500">*</span>
            </label>
            <input
              id="adult"
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
              id="children"
              type="number"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="booking.children">
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded">
            <p class="text-sm font-medium text-gray-700 mb-2">Phòng: <span class="font-bold">{{room.name}}</span></p>
            <p class="text-sm font-medium text-gray-700 mb-2">Loại phòng: <span class="font-bold">{{room.room_type_name}}</span></p>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Giá</label>
              <p v-for="price in room.price" :key="price.id" class="pl-2 text-sm">
                {{"- " + price.name + ": " + formatCurrency(price.room_price)}}vnđ
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
            <textarea
              id="description"
              rows="3"
              v-model="booking.note"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
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
import customerManagerApi from "@/api/customerManager"
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
        "customer_group_id": null,
        "customer_name": null,
        "phone_number": null,
        "check_in": null,
        "check_out": null,
        "adult": 1,
        "children": 0,
        "room_id": null,
        "booking_time": null,
        "note": null
      },
      bookingTime: [
        {"value": null, "text": ""},
        {"value": "h", "text": "Theo giờ"},
        {"value": "d", "text": "Theo ngày"},
        {"value": "m", "text": "Theo tháng"}
      ],
      customerGroups: [],
      phoneNumberCheckFlag: null,
      validateCheckInCheckOut: false,
      room: {"name": ""},
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
    this.getListGroupCustomer()
    this.getRoomDetail()
    this.getSystemConfig()
  },
  methods: {
    changeCheckIn() {
      this.changeCheckInCheckOut()
      if (this.booking.check_in && this.booking.booking_time != "h") {
        this.booking.check_in = `${moment(this.booking.check_in).format("YYYY-MM-DD")} ${this.setting.startDate.value}:00`
      }
    },
    changeCheckOut() {
      this.changeCheckInCheckOut()
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
    checkInfo(info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate() {
      return !(this.errorName || this.errorCheckIn || this.errorCheckOut ||
        this.errorAdult || !this.phoneNumberCheckFlag)
    },
    getListGroupCustomer() {
      customerManagerApi.getListCustomerGroup({}).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.customerGroups = res.data.data.map(item => ({text: item.name, value: item.id}))
          this.customerGroups.unshift({text: '', value: null})
        } else {
          this.customerGroups = []
        }
      })
      .catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
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
      this.click = true
      let result = this.checkValidate()
      if(!result) {
        this.saving = false
        return
      }

      // Check time checkin checkout
      if(this.booking.check_in > this.booking.check_out) {
        this.validateCheckInCheckOut = true
        return
      }

      this.saving = true
      adminAPI.addBooking(this.booking).then(res => {
        this.saving = false
        if(res != null && res.data != null) {
          this.router.push('/booking/list-room')
        } else {
          this.toast.error('Lưu menu thất bại!!!')
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
    getRoomDetail() {
      let room_id = this.route.params.id
      if(room_id) {
        this.booking.room_id = room_id
        adminAPI.getRoomDetail(room_id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.room = res.data.data
          }
        }).catch(err => {
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },
    changeCheckInCheckOut() {
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
