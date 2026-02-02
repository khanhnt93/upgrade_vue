<template>
  <div class="container-fluid">

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">

        <div class="bg-white rounded-lg shadow-md p-4">

            <div class="grid grid-cols-12 gap-4 mb-2">
              <div class="col-span-full">
                <h4 class="text-center text-header text-xl font-bold"><b>Hôm Nay</b></h4>
              </div>
            </div>

          <div class="grid grid-cols-12 gap-4">
              <div class="col-span-4">
                <div class="bg-white rounded-lg shadow-md p-4" border-variant="primary"
                  align="center"
                  style="background-color: rgb(229 249 255)"
                >
                  <h5 class="text-lg font-bold">Số hóa đơn</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-clipboard" style="font-size:55px;color:#78B7D0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(toDayBillNumber)}}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-4">
                <div class="bg-white rounded-lg shadow-md p-4" border-variant="primary"
                  align="center"
                  style="background-color: rgb(255 237 229)"
                >
                  <h5 class="text-lg font-bold">Doanh thu</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-shopping-cart" style="font-size:60px;color:#FFDBB5;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(toDayRevenue)}}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-4">
                <div class="bg-white rounded-lg shadow-md p-4" border-variant="primary"
                  align="center"
                  style="background-color: rgb(234 229 255)"
                >
                  <h5 class="text-lg font-bold">Chi phí</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-check" style="font-size:60px;color:#C8A1E0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(toDayFee)}}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        </div>


        <div class="bg-white rounded-lg shadow-md p-4">
            <h4 class="text-center text-header text-xl font-bold"><b>Doanh thu</b></h4>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <GChart
                  type="ColumnChart"
                  :data="chartDayData"
                  :options="chartOptions"
                />
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full text-center">
                <a href="/chart-profit-revenue">Xem nhiều hơn</a>
              </div>
            </div>

        </div>

        <div class="bg-white rounded-lg shadow-md p-4">
            <h4 class="text-center text-header text-xl font-bold"><b>Bán chạy</b></h4>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <p><b class="text-header">Nhóm mặt hàng bán chạy(7 ngày qua)</b></p>
                <p><a href="/statistic">Xem nhiều hơn</a></p>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
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

              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <p><b class="text-header">Mặt hàng bán chạy(7 ngày qua)</b></p>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-full">
                    <input type="radio" name="menu" @click="showMenuAmount = true" checked><label class="pl-2">Doanh thu</label>
                    <input type="radio" name="menu" @click="showMenuAmount = false"><label class="pl-2">Số lượng</label>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-full">
                    <input type="radio" name="topMenu" @click="handleShowTop5Menu" checked><label class="pl-2">Top 5</label>
                    <input type="radio" name="topMenu" @click="handleShowTop10Menu"><label class="pl-2">Top 10</label>
                  </div>
                </div>

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

              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full text-center">
                <p><a href="/statistic">Xem nhiều hơn</a></p>
              </div>
            </div>

        </div>

        <div class="bg-white rounded-lg shadow-md p-4 text-center"  >
          <div class="card-body p-4 text-center"  >
            <h4 class="text-center text-header text-xl font-bold"><b>Kho Hàng</b></h4>

            <div class="grid grid-cols-12 gap-4 text-center  justify-content-center">
              <div class="col-span-6">
                <div class="bg-white border rounded shadow-sm border-danger">
                  <div class="px-4 py-3 border-b border-red-200 font-bold bg-red-50 text-danger rounded-t text-center">Tình trạng kho</div>
                  <div class="p-4 card-text">
                    <h5 class="text-center text-warning">Số sản phẩm sắp hết hàng: {{currencyFormat(out_over)}}</h5>
                    <h5 class="text-center text-danger">Số sản phẩm đã hết hàng: {{currencyFormat(running_out)}}</h5>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-full text-center">
                    <a href="/resource/list">Xem nhiều hơn</a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- <div class="bg-white rounded-lg shadow-md p-4">
            <h4 class="text-center text-header"><b>Kho hàng</b></h4>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-6">
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-full">
                    <p><b class="text-header">Sản phẩm đã hết: </b> <b>{{out_over}}</b></p>
                    <p v-for="item in resource_out_over" :key="item.resource_name">
                      {{' - ' + item.resource_name + ': ' + item.quantity + '/' + item.min_quantity + '(' + item.unit_name + ')'}}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-span-6">
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-full">
                    <p><b class="text-header">Sản phẩm sắp hết: </b> <b>{{running_out}}</b></p>
                    <p v-for="item in resource_running_out" :key="item.resource_name">
                      {{' - ' + item.resource_name + ': ' + item.quantity + '/' + item.min_quantity + '(' + item.unit_name + ')'}}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          <p class="text-center"><a href="/resource/list">Xem nhiều hơn</a></p>

        </div> -->


      </div>
    </div>

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
        ["Tên dv", "Doanh thu"],
        ["Dv 1", 0]
      ],
      chartMenuDataQuantity: [
        ["Tên Dv", "Số lượng"],
        ["Dv 1", 0]
      ],
      fromDay: null,
      toDay: null,
      out_over: 0,
      resource_out_over: [],
      running_out: 0,
      resource_running_out: [],
      showGMenuAmount: true,
      showMenuAmount: true,
      store_service_report_amount: [],
      store_service_report_quantity: [],
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
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
    },

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

          this.store_service_report_amount = res.data.data.data_menu.service_report_amount
          this.getTopMenuAmount(6)
          this.store_service_report_quantity = res.data.data.data_menu.service_report_quantity
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
      if(this.store_service_report_amount.length < index) {
        length = this.store_service_report_amount.length
      }
      let result = []
      for (let i = 0; i <= length -1 ; i++) {
        result.push(this.store_service_report_amount[i])
      }
      this.chartMenuDataAmount = result
    },

    /**
     * Get top menu quantity
     */
    getTopMenuQuantity(index) {
      let length = index
      if(this.store_service_report_quantity.length < index) {
        length = this.store_service_report_quantity.length
      }
      let result = []
      for (let i = 0; i <= length -1 ; i++) {
        result.push(this.store_service_report_quantity[i])
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

