<template>
  <div class="container mx-auto px-4">
    <div class="w-full">
      <div class="bg-white shadow-md rounded-lg">
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="flex justify-start">
              <button
                type="button"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                @click="back"
              >
                Quay lại
              </button>
            </div>
            <div class="flex justify-end">
              <button
                type="button"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                @click="save"
                :disabled="saving"
              >
                Sửa
              </button>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="mt-2 text-center text-xl font-semibold">Nhận phòng {{booking.room_name}}</h4>
          </div>
          <hr class="mb-4"/>

          <!-- Loading -->
          <div v-show="loading" class="flex justify-center items-center py-8">
            <icon name="loading" width="60" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>

              <div class="mb-4">
                <label for="group_customer" class="block mb-2"> Đoàn </label>
                <select
                  id="group_customer"
                  v-model="booking.customer_group_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="option in customerGroups" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label for="customer_name" class="block mb-2">
                  Tên người nhận phòng <span class="text-red-500">*</span>
                </label>
                <input
                  id="customer_name"
                  type="text"
                  autocomplete="new-password"
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="errorName ? 'border-red-500' : 'border-gray-300'"
                  v-model="booking.customer_name"
                >
                <p v-if="errorName" class="text-red-500 text-sm mt-1">
                  Đây là mục bắt buộc nhập
                </p>
              </div>

              <div class="mb-4">
                <label for="phone" class="block mb-2">
                  Số điện thoại <span class="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="text"
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="(errorPhone || !phoneNumberCheckFlag) ? 'border-red-500' : 'border-gray-300'"
                  v-model="booking.phone_number"
                  @keyup="integerOnly($event.target)"
                  autocomplete="new-password"
                  maxlength="20"
                  @change="checkPhoneNumberFormat($event.target.value)"
                >
                <p v-if="errorPhone" class="text-red-500 text-sm mt-1">
                  Đây là mục bắt buộc nhập
                </p>
                <p v-if="!phoneNumberCheckFlag" class="text-red-500 text-sm mt-1">
                  Số điện thoại không đúng
                </p>
              </div>

              <div class="mb-4">
                <label for="booking_time" class="block mb-2"> Thời gian đặt phòng theo </label>
                <select
                  id="booking_time"
                  v-model="booking.booking_time"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="option in bookingTime" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label for="check_in" class="block mb-2">
                  Thời gian nhận phòng <span class="text-red-500">*</span>
                </label>
                <div id="check_in">
                  <Datepicker
                    v-model="booking.check_in"
                    :enable-time-picker="true"
                    class="w-full"
                    @update:model-value="changeCheckInCheckOut()"
                  />
                </div>
                <p v-if="errorCheckIn" class="text-red-500 text-sm mt-1">
                  Đây là mục bắt buộc nhập
                </p>
                <p v-if="validateCheckInCheckOut" class="text-red-500 text-sm mt-1">
                  Thời gian nhận phòng không hợp lệ
                </p>
              </div>

              <div class="mb-4">
                <label for="check_out" class="block mb-2">
                  Thời gian trả phòng <span class="text-red-500">*</span>
                </label>
                <div id="check_out">
                  <Datepicker
                    v-model="booking.check_out"
                    :enable-time-picker="true"
                    class="w-full"
                    @update:model-value="changeCheckInCheckOut()"
                  />
                </div>
                <p v-if="errorCheckOut" class="text-red-500 text-sm mt-1">
                  Đây là mục bắt buộc nhập
                </p>
                <p v-if="validateCheckInCheckOut" class="text-red-500 text-sm mt-1">
                  Thời gian trả phòng không hợp lệ
                </p>
              </div>

              <div class="mb-4">
                <label for="adult" class="block mb-2">
                  Người lớn <span class="text-red-500">*</span>
                </label>
                <input
                  id="adult"
                  type="number"
                  autocomplete="new-password"
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="errorAdult ? 'border-red-500' : 'border-gray-300'"
                  v-model="booking.adult"
                >
                <p v-if="errorAdult" class="text-red-500 text-sm mt-1">
                  Đây là mục bắt buộc nhập
                </p>
              </div>

              <div class="mb-4">
                <label for="children" class="block mb-2"> Trẻ em </label>
                <input
                  id="children"
                  type="number"
                  autocomplete="new-password"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="booking.children"
                >
              </div>

            </div>

            <div>
              <div class="mb-4">
                <span class="font-medium"> Phòng: {{booking.room_name}} </span>
              </div>

              <div class="mb-4">
                <span class="font-medium"> Loại phòng: {{booking.room_type_name}} </span>
              </div>

              <div class="mb-4">
                <span class="font-medium block mb-2"> Giá </span>
                <p v-for="price in booking.price" :key="price.id" class="pl-2">
                  - {{ price.name }}: {{ currencyFormat(price.room_price) }}vnđ
                </p>
              </div>

              <div class="mb-4">
                <label for="description" class="block mb-2"> Ghi chú </label>
                <textarea
                  id="description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="booking.note"
                ></textarea>
              </div>

              <div class="mb-4">
                <label for="cmnd" class="block mb-2"> CCCD/CMND </label>
                <input
                  id="cmnd"
                  type="text"
                  @keyup="integerOnly($event.target)"
                  autocomplete="new-password"
                  maxlength="20"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Chứng minh nhân dân"
                  v-model="booking.cmnd_number"
                >

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block mb-2">Mặt trước</label>
                    <div
                      @click="$refs.file_cmnd_image_front.click()"
                      class="flex items-center border border-gray-300 rounded overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <input
                        type="text"
                        readonly
                        :value="booking.cmnd_image_front"
                        class="flex-1 px-3 py-2 bg-white cursor-pointer"
                        placeholder="Chọn file"
                      >
                      <span class="px-4 py-2 bg-gray-200 hover:bg-gray-300">Browse</span>
                    </div>
                    <input
                      class="hidden"
                      type="file"
                      id="file_cmnd_image_front"
                      ref="file_cmnd_image_front"
                      accept="image/*"
                      @change="handleCMNDImageFrontUpload"
                    />

                    <div v-if="booking.cmnd_image_front_preview" class="mt-2">
                      <img :src="booking.cmnd_image_front_preview" class="w-full h-auto rounded border">
                    </div>
                  </div>

                  <div>
                    <label class="block mb-2">Mặt sau</label>
                    <div
                      @click="$refs.file_cmnd_image_back.click()"
                      class="flex items-center border border-gray-300 rounded overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <input
                        type="text"
                        readonly
                        :value="booking.cmnd_image_back"
                        class="flex-1 px-3 py-2 bg-white cursor-pointer"
                        placeholder="Chọn file"
                      >
                      <span class="px-4 py-2 bg-gray-200 hover:bg-gray-300">Browse</span>
                    </div>
                    <input
                      class="hidden"
                      type="file"
                      id="file_cmnd_image_back"
                      ref="file_cmnd_image_back"
                      accept="image/*"
                      @change="handleCMNDImageBackUpload"
                    />

                    <div v-if="booking.cmnd_image_back_preview" class="mt-2">
                      <img :src="booking.cmnd_image_back_preview" class="w-full h-auto rounded border">
                    </div>
                  </div>
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
  import { useToast } from '@/composables/useToast'
  import adminAPI from '@/api/admin'
  import customerManagerApi from "@/api/customerManager"
  import VueCropper from 'vue-cropperjs'
  import 'cropperjs/dist/cropper.css'
  import commonFunc from '@/common/commonFunc'
  import Datepicker from 'vue3-datepicker'

  export default {
    components: {
      VueCropper,
      Datepicker
    },
    setup() {
      const router = useRouter()
      const route = useRoute()
      const { popToast } = useToast()

      return {
        router,
        route,
        popToast
      }
    },
    data () {
      return {
        booking: {
          "booking_id": null,
          "customer_group_id": null,
          "customer_name": null,
          "phone_number": null,
          "check_in": null,
          "actual_check_in": null,
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
        },
        bookingTime: [
            {"value": null, "text": ""},
            {"value": "h", "text": "Theo giờ"},
            {"value": "d", "text": "Theo ngày"},
            {"value": "m", "text": "Theo tháng"}
        ],
        customerGroups: [],
        phoneNumberCheckFlag: true,
        validateCheckInCheckOut: false,
        file_cmnd_image_front: null,
        file_cmnd_image_back: null,
        room: {"name": ""},
        saving: false,
        click: false,
        loading: false,
        disableVal: true,
        check_in_show: null
      }
    },
    mounted() {
      let dateNow = new Date()
      dateNow.setTime(dateNow.getTime() + (7*60*60*1000));
      this.booking.check_in = dateNow
      this.check_in_show = dateNow.toISOString().replace(/T/, ' ').replace(/\..+/, '')

      // Get list group customer
      this.getListGroupCustomer()

      // Get booking detail
      this.getBookingDetail()
    },
    computed: {
      errorName: function () {
        return this.checkInfo(this.booking.customer_name)
      },
      errorPhone: function () {
        return this.checkInfo(this.booking.phone_number)
      },
      errorCheckIn: function () {
        return this.checkInfo(this.booking.check_in)
      },
      errorCheckOut: function () {
        return this.checkInfo(this.booking.check_out)
      },
      errorAdult: function () {
        return this.checkInfo(this.booking.adult)
      },
    },
    methods: {
      checkInfo (info) {
        return (this.click && (info == null || info.length <= 0))
      },
      checkValidate () {
        return !(this.errorName || this.errorCheckIn || this.errorCheckOut ||
            this.errorAdult || !this.phoneNumberCheckFlag)
      },

        /**
         * Get list group customer
         */
        getListGroupCustomer() {
          customerManagerApi.getListCustomerGroup({}).then(res => {
            if (res != null && res.data != null && res.data.data != null) {
              this.customerGroups = res.data.data.map(item => ({text: item.name, value: item.id}));
              this.customerGroups.unshift({text: '', value: null})
            } else {
              this.customerGroups = [];
            }
          })
          .catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err);
            this.popToast("danger", errorMess);
          });
        },

    /**
     * Handle upload file cmnd front
     */
    handleCMNDImageFrontUpload () {
      this.booking.cmnd_image_front_preview = null
      this.file_cmnd_image_front = this.$refs.file_cmnd_image_front.files[0]
      this.booking.cmnd_image_front = this.file_cmnd_image_front.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        this.booking.cmnd_image_front_preview = reader.result
      }.bind(this), false)
      if( this.file_cmnd_image_front ){
        reader.readAsDataURL( this.file_cmnd_image_front )
      }
    },

    /**
     * Handle upload file cmnd back
     */
    handleCMNDImageBackUpload () {
      this.booking.cmnd_image_back_preview = null
      this.file_cmnd_image_back = this.$refs.file_cmnd_image_back.files[0]
      this.booking.cmnd_image_back = this.file_cmnd_image_back.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        this.booking.cmnd_image_back_preview = reader.result
      }.bind(this), false)
      if( this.file_cmnd_image_back ){
        reader.readAsDataURL( this.file_cmnd_image_back )
      }
    },

        /**
     * Check phone number
     */
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

      /**
       * Prepare info to save
       */
      save() {
        this.saving = true
        this.click = true
        let result = this.checkValidate()
        if(!result) {
          this.saving = false
          return
        }

        // Check time checkin checkout
        let checkInDate = this.booking.check_in instanceof Date ? this.booking.check_in : new Date(this.booking.check_in)
        let checkOutDate = this.booking.check_out instanceof Date ? this.booking.check_out : new Date(this.booking.check_out)

        if(checkInDate > checkOutDate) {
            this.validateCheckInCheckOut = true
            this.saving = false
            return
        }

        // Format dates to string format expected by API (YYYY-MM-DD HH:mm:ss)
        const formatDateTime = (date) => {
          if (!date) return null
          const d = date instanceof Date ? date : new Date(date)
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          const hours = String(d.getHours()).padStart(2, '0')
          const minutes = String(d.getMinutes()).padStart(2, '0')
          const seconds = String(d.getSeconds()).padStart(2, '0')
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }

        // Init data
        const formData = new FormData();
        formData.append("booking_id", this.booking.booking_id)
        formData.append("room_id", this.booking.room_id)
        formData.append("customer_group_id", this.booking.customer_group_id)
        formData.append("customer_name", this.booking.customer_name)
        formData.append("phone_number", this.booking.phone_number)
        formData.append("check_in", formatDateTime(this.booking.check_in))
        formData.append("room_type_id", this.booking.room_type_id)
        formData.append("deposit", this.booking.deposit)
        formData.append("actual_check_in", formatDateTime(this.booking.actual_check_in))
        formData.append("check_out", formatDateTime(this.booking.check_out))
        formData.append("adult", this.booking.adult)
        formData.append("children", this.booking.children)
        formData.append("booking_time", this.booking.booking_time)
        formData.append("note", this.booking.note)
        formData.append("cmnd", this.booking.cmnd_number)
        formData.append("cmnd_image_front", this.file_cmnd_image_front)
        formData.append("cmnd_image_end", this.file_cmnd_image_back)
        this.doSave(formData);

      },

      /**
       * Call api, save data
       * @param formData
       */
      doSave(formData) {
        this.saving = true
          adminAPI.updateCheckInInfo(formData).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              // Go to list
              this.router.push('/booking/search-check-in-info')
            } else{
              // Show notify add fail
              this.popToast('danger', 'Lưu thông tin check in thất bại!!! ')
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
      },

      /**
       * Back to list
       */
      back() {
        // Go to list
        this.router.push('/booking/search-check-in-info')
      },

      /**
       * Currency format
       */
      currencyFormat(num) {
        if(num) {
          let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          return result
        }
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
       * Get booking detail
       */
      getBookingDetail() {
        let booking_id = this.route.params.id
        if(booking_id){
          adminAPI.getBookingDetail(booking_id).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              this.booking = res.data.data

              // Convert date strings to Date objects for vue3-datepicker
              if(this.booking.check_in) {
                this.booking.check_in = new Date(this.booking.check_in)
              }
              if(this.booking.check_out) {
                this.booking.check_out = new Date(this.booking.check_out)
              }
              if(this.booking.actual_check_in) {
                this.booking.actual_check_in = new Date(this.booking.actual_check_in)
              }

              this.booking.cmnd_image_front_preview = null
              this.booking.cmnd_image_front = null
              this.booking.cmnd_image_back_preview = null
              this.booking.cmnd_image_back = null
            }
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      },

      /**
       * Event change check in check out
       */
      changeCheckInCheckOut() {
          if(this.booking.check_in && this.booking.check_out) {
              // Convert to dates for comparison if they are strings
              let checkInDate = this.booking.check_in instanceof Date ? this.booking.check_in : new Date(this.booking.check_in)
              let checkOutDate = this.booking.check_out instanceof Date ? this.booking.check_out : new Date(this.booking.check_out)

              if(checkInDate > checkOutDate) {
                  this.validateCheckInCheckOut = true
              } else {
                  this.validateCheckInCheckOut = false
              }
          }
      },
    }
  }
</script>

<style scoped>
  #check_in, #check_out {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
