<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <b-row>
              <b-col cols="6">
                <b-button variant="secondary" class="pull-left px-4" @click="back">
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <b-button variant="outline-success" class="pull-right btn-width-140"  @click="save" :disabled="saving">
                  Đặt phòng
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">ĐẶT PHÒNG - {{room.name}}</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
            <b-row>
              <b-col md="6">

                <b-row class="form-row">
                  <b-col md="12">
                    <span> Đoàn </span>
                    <div class="input-group">
                      <b-form-select
                        id="group_customer"
                        v-model="booking.customer_group_id"
                        :options="customerGroups"
                      ></b-form-select>
                    </div>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12">
                    <span> Tên người đăt phòng </span><span class="error-sybol"></span>
                    <div class="input-group">
                      <input
                          id="customer_name"
                          type="text"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="booking.customer_name">
                      <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                        Đây là mục bắt buộc nhập
                      </b-form-invalid-feedback>
                    </div>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12">
                    <span> Số điện thoại </span><span class="error-sybol"></span>
                    <div class="input-group">
                      <input
                        id="phone"
                        type="text"
                        class="form-control"
                        v-model="booking.phone_number"
                        @keyup="integerOnly($event.target)"
                        autocomplete="new-password"
                        maxlength="20"
                        v-on:change="checkPhoneNumberFormat($event.target.value)">
                      <b-form-invalid-feedback class="invalid-feedback" :state="!errorPhone">
                        Đây là mục bắt buộc nhập
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback class="invalid-feedback" :state="phoneNumberCheckFlag">
                        Số điện thoại không đúng
                      </b-form-invalid-feedback>
                    </div>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" >
                    <span> Thời gian đặt phòng theo </span>
                    <b-form-select
                      :options="bookingTime"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="booking.booking_time"
                      @change="changeBookingTime">
                    </b-form-select>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12">
                    <span> Thời gian nhận phòng </span><span class="error-sybol"></span>
                    <div id="check_in">
                      <Datepicker
                        ref="checkInRef"
                        v-model="booking.check_in"
                        format="YYYY-MM-DD H:i:s"
                        @input="changeCheckIn()"
                      />
                    </div>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCheckIn">
                      Đây là mục bắt buộc nhập
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!validateCheckInCheckOut">
                      Thời gian nhận phòng không hợp lệ
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>
                <b-row class="form-row">
                  <b-col md="12">
                    <span> Thời gian trả phòng </span><span class="error-sybol"></span>
                    <div id="check_out">
                      <Datepicker
                        ref="checkOutRef"
                        v-model="booking.check_out"
                        format="YYYY-MM-DD H:i:s" width="100%"
                        @input="changeCheckOut()"
                      />
                    </div>
                  </b-col>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCheckOut">
                    Đây là mục bắt buộc nhập
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!validateCheckInCheckOut">
                    Thời gian trả phòng không hợp lệ
                  </b-form-invalid-feedback>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" >
                    <span> Người lớn </span><span class="error-sybol"></span>
                    <input
                      id="adult"
                      type="number"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="booking.adult"
                    >
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorAdult">
                      Đây là mục bắt buộc nhập
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="12" >
                    <span> Trẻ em </span>
                    <input
                      id="children"
                      type="number"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="booking.children"
                    >
                  </b-col>
                </b-row>

              </b-col>

            <b-col md="6">
              <b-row class="form-row">
                <b-col md="12" >
                  <span> Phòng: {{room.name}} </span>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="12">
                  <span> Loại phòng: {{room.room_type_name}} </span>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="12" >
                  <span> Giá </span>
                  <p  v-for="price in room.price" :key="price.id" class="pl-2">{{"- " + price.name + ": " + currencyFormat(price.room_price)}}vnđ</p>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="12">
                  <span> Ghi chú </span>
                  <b-form-textarea
                    id="description"
                    style="width:100%;"
                    rows="3"
                    v-model="booking.note"
                  ></b-form-textarea>
                </b-col>
              </b-row>

            </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
  import adminAPI from '@/api/admin'
  import customerManagerApi from "@/api/customerManager";
  import commonFunc from '@/common/commonFunc'
  import Datepicker from 'vuejs-datetimepicker'
  import moment from 'moment'

  export default {
    components: {
      Datepicker
    },
    data () {
      return {
        setting:null,
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
          "note": null,
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
        loading: false,
      }
    },
    mounted() {
        // Get list group customer
        this.getListGroupCustomer()

        // Get room detail
        this.getRoomDetail()

        // Get system config
        this.getSystemConfig()
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
      changeCheckIn () {
        this.changeCheckInCheckOut();
        if (this.booking.check_in && this.booking.booking_time != "h"){
          this.booking.check_in = `${moment(this.booking.check_in).format("YYYY-MM-DD")} ${this.setting.startDate.value}:00`
        }
      },
      changeCheckOut() {
        this.changeCheckInCheckOut();
        if (this.booking.check_out && this.booking.booking_time != "h"){
          this.booking.check_out = `${moment(this.booking.check_out).format("YYYY-MM-DD")} ${this.setting.endDate.value}:00`
        }
      },
      changeBookingTime(event){
          if (event == "h"){
            this.resetTimeInput()
          } else{
            this.changeCheckIn()
            this.changeCheckOut()
          }
      },
      getSystemConfig () {

        commonFunc.getTimeConfig().then(cfg =>{
            this.setting = cfg
        }).catch(err =>{
          console.log(err)
          this.loading = false
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      },
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
       * Make toast without title
       */
      popToast(variant, content) {
        this.$bvToast.toast(content, {
          toastClass: 'my-toast',
          noCloseButton: true,
          variant: variant,
          autoHideDelay: 3000
        })
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
          if(res != null && res.data != null){
            // Go to list
            this.$router.push('/booking/list-room')
          }else{
            // Show notify add fail
            this.popToast('danger', 'Lưu menu thất bại!!! ')
          }
        }).catch(err => {
          this.saving = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })

      },
      resetTimeInput(){
        this.$refs.checkInRef.clearDate()
        this.$refs.checkInRef.hideCal=true;
        this.$refs.checkInRef.setHour(moment().hour())
        this.$refs.checkInRef.setMinute(moment().minute())
        this.$refs.checkOutRef.clearDate()
        this.$refs.checkOutRef.hideCal=true;
        this.$refs.checkOutRef.setHour(moment().hour())
        this.$refs.checkOutRef.setMinute(moment().minute())
      },

      /**
       * Back to list
       */
      back() {
        // Go to list
        this.$router.push('/booking/list-room')
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
       * Get menu detail
       */
      getRoomDetail() {
        let room_id = this.$route.params.id
        if(room_id){
          this.booking.room_id = room_id
          adminAPI.getRoomDetail(room_id).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              this.room = res.data.data
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

  .width-33 {
    width: 31%;
    float: left;
  }
  #check_in, #check_out {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
