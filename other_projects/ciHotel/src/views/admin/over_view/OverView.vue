<template>
  <div class="container-fluid">

    <b-row>
      <b-col>

        <b-card>

          <b-row class="mb-2">
            <b-col>
              <h4 class="text-center text-header"><b>Hôm Nay</b></h4>
            </b-col>
          </b-row>

          <b-row>
              <b-col md="4">
                <b-card
                  border-variant="primary"
                  align="center"
                  style="background-color: rgb(229 249 255)"
                >
                  <h5>Số bill</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-clipboard" style="font-size:55px;color:#78B7D0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(todayBillNumber)}}</b>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
              <b-col md="4">
                <b-card
                  border-variant="primary"
                  align="center"
                  style="background-color: rgb(255 237 229)"
                >
                  <h5>Doanh thu</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-plus" style="font-size:60px;color:#FFDBB5;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(todayRevenue)}}</b>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
              <b-col md="4">
                <b-card
                  border-variant="primary"
                  align="center"
                  style="background-color: rgb(234 229 255)"
                >
                  <h5>Số phòng được đặt</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-check" style="font-size:60px;color:#C8A1E0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(todayBookingNumber)}}</b>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
            </b-row>

        </b-card>


        <b-card>
            <h4 class="text-center text-header"><b>Doanh Thu</b></h4>

            <b-row>
              <b-col>
                <GChart
                  type="ColumnChart"
                  :data="chartDayData"
                  :options="chartOptions"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col class="text-center">
                <a href="/chart-profit-revenue">Xem nhiều hơn</a>
              </b-col>
            </b-row>
        </b-card>

        <b-card>
            <h4 class="text-center text-header"><b>Loại Phòng Đặt Nhiều Nhất</b></h4>

            <b-row>
              <b-col>
                <p><b class="text-header">Phòng đặt nhiều nhất (7 ngày qua)</b></p>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <input type="radio" name="room" @click="showRoomAmount = true" checked><label class="pl-2">Doanh thu</label>
                <input type="radio" name="room" @click="showRoomAmount = false"><label class="pl-2">Số lượng</label>

                <GChart
                  v-if="showRoomAmount"
                  type="PieChart"
                  :data="chartRoomDataAmount"
                  :options="chartOptions"
                />

                <GChart
                  v-if="!showRoomAmount"
                  type="PieChart"
                  :data="chartRoomDataQuantity"
                  :options="chartOptions"
                />

              </b-col>
            </b-row>

          <b-row>
            <b-col class="text-center">
              <p><a href="/statistic">Xem nhiều hơn</a></p>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'
import Cookies from 'js-cookie'
import {Constant} from '@/common/constant'
import moment from 'moment';

export default {
  components: {
    GChart
  },
  data () {
    return {
      chartDayData: [
        ["Thời gian", "Doanh thu"],
        ["Hôm qua ", 0],
        ["Hôm nay", 0],
      ],
      chartOptions: {
        chart: {
          title: 'Biểu đồ doanh thu',
          subtitle: 'Biểu đồ doanh thu',
        },
        responsive: false,
        maintainAspectRatio: true
      },
      chartRoomDataAmount: [
        ["Tên phòng", "Doanh thu"],
        ["Phòng đơn", 0],
      ],
      chartRoomDataQuantity: [
        ["Tên phòng", "Số lượng"],
        ["Phòng đơn", 0]
      ],
      // chartMenuDataAmount: [
      //   ["Tên món", "Doanh thu"],
      //   ["Món 1", 0]
      // ],
      // chartMenuDataQuantity: [
      //   ["Tên món", "Số lượng"],
      //   ["Món 1", 0]
      // ],
      fromDay: null,
      toDay: null,
      out_over: 0,
      running_out: 0,
      showRoomAmount: true,
      //showMenuAmount: true,
      // store_food_report_amount: [],
      // store_food_report_quantity: [],
      todayBillNumber: 0,
      todayRevenue: 0,
      todayBookingNumber: 0
    }
  },
  mounted() {
    // Define socket
    // this.defineSocketForNotification()

    this.getOverView()
  },
  methods: {

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

    // /**
    //  * Define socket
    //  */
    // defineSocketForNotification() {
    //   let userTemp= Cookies.get(Constant.APP_USR)
    //
    //   if(userTemp && userTemp != undefined) {
    //     userTemp = JSON.parse(userTemp)
    //
    //     let storeId = userTemp.storeId
    //     let socketObject = null
    //     if(userTemp.role == Constant.ROLE_ADMIN) {
    //       // var socket = new WebSocket("wss://" + Constant.ROOT_API + "/join-group/admin-" + storeId) // Local
    //       // socketObject = new WebSocket("ws://127.0.0.1:8000/join-group/admin_noti-" + storeId) // Test
    //       socketObject = new WebSocket("wss://" + Constant.ROOT_API + "/join-group/admin_noti-" + storeId)
    //     }
    //     if(socketObject) {
    //       socketObject.onopen = event => {
    //         console.log('connected noti')
    //         this.connected = true
    //         socketObject.send({})
    //       }
    //
    //       // socket.close()
    //
    //       socketObject.onmessage = event => {
    //         document.getElementById("btnPlayNotify").click()
    //       }
    //
    //       socketObject.onclose = event => {
    //         this.connected = false
    //       }
    //     }
    //   }
    // },

    /**
     * Define input
     */
    defineInput() {
      let dateNow = new Date()

      // Day
      this.toDay = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
      let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
      this.fromDay = commonFunc.formatDate(fromDate.toJSON().slice(0,10))

    },

    /**
     * Get list day
     */
    getListDay() {
      let result = []

      for (let i = 6; i >= 0; i--) {
        let dateNow = new Date()
        let dateTemp = new Date(dateNow.setDate(dateNow.getDate() - i))
        dateTemp = commonFunc.formatDate(dateTemp.toJSON().slice(0,10)).substring(0, 5)
        result.push(dateTemp)
      }
      return result
    },

    /**
     * Handle day date
     */
    handleDayData(data) {
      let chartDayData = [
        ["Time", "Doanh thu"]
      ]
      let listDay = this.getListDay()
      for (let i in listDay) {
        let item = [listDay[i], 0]
        for (let j in data) {
          if(listDay[i] == data[j].time) {
            item[1] = data[j].profit
            break
          }
        }

        chartDayData.push(item)
      }
      this.chartDayData = chartDayData
    },

    /**
     * Get today report
     */
    getOverView() {
      // Search
      adminAPI.getOverView().then(res => {
        if(res && res.data && res.data.data) {
          let data = res.data.data
          this.todayBillNumber = data.bill_number
          this.todayRevenue = data.reveneu
          this.todayBookingNumber = data.booking_number
        }


        // Get other report
        this.getData()

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Search
     */
    getData() {
      this.defineInput()
      let params = {
        "from_day": commonFunc.convertDDMMYYYYToYYYYMMDD(this.fromDay),
        "to_day": commonFunc.convertDDMMYYYYToYYYYMMDD(this.toDay)
      }

      // Search
      adminAPI.getTodayReport(params).then(res => {
        if(res && res.data && res.data.data) {
          this.handleDayData(res.data.data.data_day)
          this.chartRoomDataAmount = res.data.data.data_menu.group_report_amount
          this.chartRoomDataQuantity = res.data.data.data_menu.group_report_quantity
          // this.out_over = res.data.data.data_resource_out_over
          // this.running_out = res.data.data.date_resource_running_out
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = null

      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      } else {
        if(num == 0) {
          return 0
        }
      }
      return result
    },

  }
}
</script>


<style lang="scss">
  .content-circle {
    width: 32%;
    float: left;
    text-align: center;
  }

  .circle-without-text {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    background-color: #003399;
    position: relative;
    margin: auto;
  }

  .text-inside-circle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

</style>

