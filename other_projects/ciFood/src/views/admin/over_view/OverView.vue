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
                  <h5>Số hóa đơn</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-clipboard" style="font-size:55px;color:#78B7D0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(toDayBillNumber)}}</b>
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
                        <b style="font-size:40px;">{{currencyFormat(toDayRevenue)}}</b>
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
                  <h5>Chi phí</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-minus" style="font-size:60px;color:#C8A1E0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(toDayFee)}}</b>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
            </b-row>

        </b-card>


        <b-card>
          <b-row class="mb-2">
            <b-col>
              <h4 class="text-center text-header"><b>Doanh Thu</b></h4>
            </b-col>
          </b-row>

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
            <h4 class="text-center text-header"><b>Bán Chạy</b></h4>

            <b-row>
              <b-col>
                <p><b class="text-header">Nhóm mặt hàng bán chạy(7 ngày qua)</b></p>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <input type="radio" name="groupGMenu" @click="showGMenuAmount = true" checked><label class="pl-2">Doanh thu</label>
                <input type="radio" name="groupGMenu" @click="showGMenuAmount = false"><label class="pl-2">Số lượng</label>

                <GChart
                  v-if="showGMenuAmount"
                  type="PieChart"
                  :data="chartGroupMenuDataAmount"
                  :options="chartOptions"
                />

                <GChart
                  v-if="!showGMenuAmount"
                  type="PieChart"
                  :data="chartGroupMenuDataQuantity"
                  :options="chartOptions"
                />

              </b-col>
            </b-row>

            <b-row>
              <b-col class="text-center">
                <p><a href="/statistic">Xem nhiều hơn</a></p>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <p><b class="text-header">Mặt hàng bán chạy(7 ngày qua)</b></p>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <b-row>
                  <b-col>
                    <input type="radio" name="menu" @click="showMenuAmount = true" checked><label class="pl-2">Doanh thu</label>
                    <input type="radio" name="menu" @click="showMenuAmount = false"><label class="pl-2">Số lượng</label>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col>
                    <input type="radio" name="topMenu" @click="handleShowTop5Menu" checked><label class="pl-2">Top 5</label>
                    <input type="radio" name="topMenu" @click="handleShowTop10Menu"><label class="pl-2">Top 10</label>
                  </b-col>
                </b-row>

                <GChart
                  v-if="showMenuAmount"
                  type="PieChart"
                  :data="chartMenuDataAmount"
                  :options="chartOptions"
                />
                <GChart
                  v-if="!showMenuAmount"
                  type="PieChart"
                  :data="chartMenuDataQuantity"
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

        <b-card>
            <h4 class="text-center text-header"><b>Kho Hàng</b></h4>

            <b-row>
              <b-col md="6">
                <b-card border-variant="danger"
                        header="Sản phẩm đã hết"
                        header-border-variant="danger"
                        header-text-variant="danger"
                        align="center">
                  <b-card-text>
                    <h5 class="text-center text-header">{{currencyFormat(out_over)}}</h5>
                    <p v-for="item in resource_out_over" :key="item.resource_name">
                      {{' - ' + item.resource_name + ': ' + item.quantity + '/' + item.min_quantity + '(' + item.unit_name + ')'}}
                    </p>
                  </b-card-text>
                </b-card>
              </b-col>
              <b-col md="6">
                <b-card border-variant="primary"
                        header="Sản phẩm sắp hết"
                        header-border-variant="primary"
                        header-text-variant="primary"
                        align="center">
                  <b-card-text>
                    <h5 class="text-center text-header">{{currencyFormat(running_out)}}</h5>
                    <p v-for="item in resource_running_out" :key="item.resource_name">
                      {{' - ' + item.resource_name + ': ' + item.quantity + '/' + item.min_quantity + '(' + item.unit_name + ')'}}
                    </p>
                  </b-card-text>
                </b-card>
              </b-col>
              
            </b-row>

            <p class="text-center"><a href="/resource/list">Xem nhiều hơn</a></p>

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


export default {
  components: {
    GChart
  },
  data () {
    return {
      chartDayData: [
        ["Time", "Doanh thu"],
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
      chartGroupMenuDataAmount: [
        ["Tên nhóm", "Doanh thu"],
        ["nhóm 1", 0]
      ],
      chartGroupMenuDataQuantity: [
        ["Tên nhóm", "Số lượng"],
        ["nhóm 1", 0]
      ],
      chartMenuDataAmount: [
        ["Tên món", "Doanh thu"],
        ["Món 1", 0]
      ],
      chartMenuDataQuantity: [
        ["Tên món", "Số lượng"],
        ["Món 1", 0]
      ],
      fromDay: null,
      toDay: null,
      out_over: 0,
      resource_out_over: [],
      running_out: 0,
      resource_running_out: [],
      showGMenuAmount: true,
      showMenuAmount: true,
      store_food_report_amount: [],
      store_food_report_quantity: [],
      toDayBillNumber: 0,
      toDayRevenue: 0,
      toDayFee: 0
    }
  },
  mounted() {
    // Define socket
    // this.defineSocketForNotification()

    this.getTodayReport()
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
    getTodayReport() {
      // Search
      adminAPI.getTodayReport().then(res => {
        if(res && res.data && res.data.data) {
          let data = res.data.data
          this.toDayBillNumber = data.bill_number
          this.toDayRevenue = data.reveneu
          this.toDayFee = data.fee
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
      adminAPI.getOverView(params).then(res => {
        if(res && res.data && res.data.data) {
          this.handleDayData(res.data.data.data_day)

          this.store_food_report_amount = res.data.data.data_menu.food_report_amount
          this.getTopMenuAmount(6)
          this.store_food_report_quantity = res.data.data.data_menu.food_report_quantity
          this.getTopMenuQuantity(6)
          this.chartGroupMenuDataAmount = res.data.data.data_menu.group_report_amount
          this.chartGroupMenuDataQuantity = res.data.data.data_menu.group_report_quantity

          this.out_over = res.data.data.data_resource_out_over
          this.running_out = res.data.data.date_resource_running_out
          this.resource_out_over = res.data.data.resource_out_over
          this.resource_running_out = res.data.data.resource_running_out
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get top menu amount
     */
    getTopMenuAmount(index) {
      let length = index
      if(this.store_food_report_amount.length < index) {
        length = this.store_food_report_amount.length
      }
      let result = []
      for (let i = 0; i <= length -1 ; i++) {
        result.push(this.store_food_report_amount[i])
      }
      this.chartMenuDataAmount = result
    },

    /**
     * Get top menu quantity
     */
    getTopMenuQuantity(index) {
      let length = index
      if(this.store_food_report_quantity.length < index) {
        length = this.store_food_report_quantity.length
      }
      let result = []
      for (let i = 0; i <= length -1 ; i++) {
        result.push(this.store_food_report_quantity[i])
      }
      this.chartMenuDataQuantity = result
    },

    /**
     * Handle show top menu
     */
    handleShowTop5Menu() {
      this.getTopMenuAmount(6)
      this.getTopMenuQuantity(6)
    },

    /**
     * Handle show top menu
     */
    handleShowTop10Menu() {
      this.getTopMenuAmount(11)
      this.getTopMenuQuantity(11)
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

