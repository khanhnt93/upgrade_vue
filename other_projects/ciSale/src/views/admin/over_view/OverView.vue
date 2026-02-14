<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto space-y-8">

        <!-- Today's Overview Section -->
        <div class="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <div class="text-center mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Hôm Nay</h2>
                <div class="w-24 h-1 bg-blue-500 mx-auto rounded"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div class="group hover:scale-105 transition-transform duration-300">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-2xl p-6 border border-blue-200 text-center relative overflow-hidden h-full flex flex-col justify-center min-h-[160px]">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full opacity-20 -mr-10 -mt-10"></div>
                  <h5 class="text-lg font-semibold text-blue-800 mb-4">Số bill</h5>
                  <div class="flex items-center justify-center space-x-4">
                    <div class="bg-blue-500 p-3 md:p-4 rounded-full">
                      <i class="fa fa-clipboard text-2xl md:text-3xl text-white"></i>
                    </div>
                    <div>
                      <span class="text-3xl md:text-4xl font-bold text-blue-700">{{formatCurrency(todayBillNumber)}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="group hover:scale-105 transition-transform duration-300">
                <div class="bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg rounded-2xl p-6 border border-orange-200 text-center relative overflow-hidden h-full flex flex-col justify-center min-h-[160px]">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full opacity-20 -mr-10 -mt-10"></div>
                  <h5 class="text-lg font-semibold text-orange-800 mb-4">Doanh thu</h5>
                  <div class="flex items-center justify-center space-x-4">
                    <div class="bg-orange-500 p-3 md:p-4 rounded-full">
                      <i class="fa fa-chart-line text-2xl md:text-3xl text-white"></i>
                    </div>
                    <div>
                      <span class="text-2xl md:text-4xl font-bold text-orange-700">{{formatCurrency(todayRevenue)}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="group hover:scale-105 transition-transform duration-300">
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg rounded-2xl p-6 border border-purple-200 text-center relative overflow-hidden h-full flex flex-col justify-center min-h-[160px]">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full opacity-20 -mr-10 -mt-10"></div>
                  <h5 class="text-lg font-semibold text-purple-800 mb-4">Lợi nhuận</h5>
                  <div class="flex items-center justify-center space-x-4">
                    <div class="bg-purple-500 p-3 md:p-4 rounded-full">
                      <i class="fa fa-dollar-sign text-2xl md:text-3xl text-white"></i>
                    </div>
                    <div>
                      <span class="text-2xl md:text-4xl font-bold text-purple-700">{{formatCurrency(todayProfit)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        <!-- Revenue Chart Section -->
        <div class="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <div class="text-center mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Biểu Đồ Doanh Thu</h2>
                <div class="w-24 h-1 bg-green-500 mx-auto rounded"></div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 md:p-6 mb-6">
                <div class="w-full overflow-x-auto">
                    <GChart
                      type="ColumnChart"
                      :data="chartRevenueData"
                      :options="chartOptions"
                      class="w-full min-h-[300px]"
                    />
                </div>
            </div>

            <div class="text-center">
                <a href="/chart-revenue" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg">
                  <i class="fa fa-chart-bar mr-2"></i>
                  Xem nhiều hơn
                </a>
            </div>
        </div>

        <!-- Inventory Section -->
        <div class="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <div class="text-center mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Kho Hàng</h2>
                <div class="w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="group hover:scale-105 transition-transform duration-300">
                <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg rounded-xl p-6 border border-indigo-200 text-center h-full flex flex-col justify-between min-h-[140px]">
                  <div class="flex items-center justify-center mb-4">
                    <div class="bg-indigo-500 p-3 rounded-full">
                      <i class="fa fa-box text-2xl text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-indigo-600 mb-2">Số Loại Sản Phẩm</div>
                    <h5 class="text-2xl font-bold text-indigo-800">{{formatCurrency(repo.number_of_product)}}</h5>
                  </div>
                </div>
              </div>

              <div class="group hover:scale-105 transition-transform duration-300">
                <div class="bg-gradient-to-br from-green-50 to-green-100 shadow-lg rounded-xl p-6 border border-green-200 text-center h-full flex flex-col justify-between min-h-[140px]">
                  <div class="flex items-center justify-center mb-4">
                    <div class="bg-green-500 p-3 rounded-full">
                      <i class="fa fa-shopping-cart text-2xl text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-green-600 mb-2">Tổng Tiền Mua</div>
                    <h5 class="text-xl lg:text-2xl font-bold text-green-800">{{formatCurrency(repo.total_price_buy)}}đ</h5>
                  </div>
                </div>
              </div>

              <div class="group hover:scale-105 transition-transform duration-300">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-xl p-6 border border-blue-200 text-center h-full flex flex-col justify-between min-h-[140px]">
                  <div class="flex items-center justify-center mb-4">
                    <div class="bg-blue-500 p-3 rounded-full">
                      <i class="fa fa-tag text-2xl text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-blue-600 mb-2">Tổng Tiền Bán (dự tính)</div>
                    <h5 class="text-xl lg:text-2xl font-bold text-blue-800">{{formatCurrency(repo.total_price_sell)}}đ</h5>
                  </div>
                </div>
              </div>

              <div class="group hover:scale-105 transition-transform duration-300">
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg rounded-xl p-6 border border-purple-200 text-center h-full flex flex-col justify-between min-h-[140px]">
                  <div class="flex items-center justify-center mb-4">
                    <div class="bg-purple-500 p-3 rounded-full">
                      <i class="fa fa-chart-line text-2xl text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-purple-600 mb-2">Lợi nhuận (dự tính)</div>
                    <h5 class="text-xl lg:text-2xl font-bold text-purple-800">{{formatCurrency(repo.total_price_sell - repo.total_price_buy)}}đ</h5>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center mt-8">
                <a href="/repo-report" class="inline-flex items-center px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors duration-200 shadow-md hover:shadow-lg">
                  <i class="fa fa-warehouse mr-2"></i>
                  Xem nhiều hơn
                </a>
            </div>
        </div>

        <!-- Debt Management Section -->
        <div class="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <div class="text-center mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Nợ công - Công nợ</h2>
                <div class="w-24 h-1 bg-red-500 mx-auto rounded"></div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div class="group hover:scale-105 transition-transform duration-300">
                <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg rounded-xl p-6 md:p-8 border border-emerald-200 h-full flex flex-col">
                  <div class="flex items-center mb-6">
                    <div class="bg-emerald-500 p-3 md:p-4 rounded-full mr-4">
                      <i class="fa fa-hand-holding-usd text-2xl md:text-3xl text-white"></i>
                    </div>
                    <h3 class="text-lg md:text-xl font-bold text-emerald-800">Công nợ (Nợ cần thu hồi)</h3>
                  </div>

                  <div class="space-y-4 flex-grow">
                    <div class="bg-emerald-600 text-white p-4 rounded-lg">
                      <p class="text-xl md:text-2xl font-bold">Tổng công nợ: {{formatCurrency(debt_total)}}đ</p>
                    </div>

                    <div class="bg-white p-4 rounded-lg border border-emerald-200 space-y-3">
                      <p class="text-emerald-700">
                        <i class="fa fa-clock mr-2"></i>
                        <span class="font-semibold">Số lượng công nợ sắp đến hạn thu hồi:</span>
                        <span class="font-bold ml-2">{{formatCurrency(debt_number)}}</span>
                      </p>
                      <p class="text-emerald-700">
                        <i class="fa fa-money-bill mr-2"></i>
                        <span class="font-semibold">Tổng tiền công nợ sắp đến hạn thu hồi:</span>
                      </p>
                      <p class="text-emerald-800 font-bold text-lg ml-6">
                        {{formatCurrency(debt_amount)}}đ
                      </p>
                    </div>
                  </div>

                  <div class="text-center mt-6">
                    <a href="/debt" class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-md hover:shadow-lg w-full justify-center sm:w-auto">
                      <i class="fa fa-eye mr-2"></i>
                      Xem nhiều hơn
                    </a>
                  </div>
                </div>
              </div>

              <div class="group hover:scale-105 transition-transform duration-300">
                <div class="bg-gradient-to-br from-red-50 to-red-100 shadow-lg rounded-xl p-6 md:p-8 border border-red-200 h-full flex flex-col">
                  <div class="flex items-center mb-6">
                    <div class="bg-red-500 p-3 md:p-4 rounded-full mr-4">
                      <i class="fa fa-credit-card text-2xl md:text-3xl text-white"></i>
                    </div>
                    <h3 class="text-lg md:text-xl font-bold text-red-800">Nợ công (Nợ phải trả)</h3>
                  </div>

                  <div class="space-y-4 flex-grow">
                    <div class="bg-red-600 text-white p-4 rounded-lg">
                      <p class="text-xl md:text-2xl font-bold">Tổng nợ công: {{formatCurrency(public_debt_total)}}đ</p>
                    </div>

                    <div class="bg-white p-4 rounded-lg border border-red-200 space-y-3">
                      <p class="text-red-700">
                        <i class="fa fa-clock mr-2"></i>
                        <span class="font-semibold">Số lượng nợ công sắp đến hạn trả:</span>
                        <span class="font-bold ml-2">{{formatCurrency(public_debt_number)}}</span>
                      </p>
                      <p class="text-red-700">
                        <i class="fa fa-money-bill mr-2"></i>
                        <span class="font-semibold">Tổng tiền nợ công sắp đến hạn trả:</span>
                      </p>
                      <p class="text-red-800 font-bold text-lg ml-6">
                        {{formatCurrency(public_debt_amount)}}đ
                      </p>
                    </div>
                  </div>

                  <div class="text-center mt-6">
                    <a href="/public-debt" class="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg w-full justify-center sm:w-auto">
                      <i class="fa fa-eye mr-2"></i>
                      Xem nhiều hơn
                    </a>
                  </div>
                </div>
              </div>
            </div>
        </div>

      </div>
    </div>
</template>


<script>
import reportAPI from '@/api/report'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

export default {
  components: {
    GChart
  },
  setup() {
    const { toast } = useToast()
    const { formatCurrency } = useFormatters()
    return { toast, formatCurrency }
  },
  data () {
    return {
      chartRevenueData: [
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
      fromDay: null,
      toDay: null,
      todayBillNumber: 0,
      todayRevenue: 0,
      todayProfit: 0,
      repo: {
          "number_of_product": 0,
          "total_price_buy": 0,
          "total_price_sell": 0
      },
      debt_total: 0,
      debt_number: 0,
      debt_amount: 0,
      public_debt_total: 0,
      public_debt_number: 0,
      public_debt_amount: 0
    }
  },
  mounted() {
    // Get over view
    this.getOverView()

    // Define default value for from data, to date
    this.defineInput()

    // Doanh thu
    this.getRevenue()

    // Lợi nhuận
    // this.getProfit()

    // Kho hàng
    this.getRepository()

    // CÔng nợ, nợ công
    this.getDebtAndPublicDebt()
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(content, variant) {
      this.toast(content, variant)
    },

    /**
     * Define input
     */
    defineInput() {
      let dateNow = new Date()

      // Day
      this.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
      let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
      this.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
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
    handleRevenueData(data) {
      let chartData = [
        ["Time", "Doanh thu"]
      ]
      let listDay = this.getListDay()
      for (let i in listDay) {
        let item = [listDay[i], 0]
        for (let j in data) {
          if(listDay[i] == data[j].time) {
            item[1] = data[j].revenue
            break
          }
        }

        chartData.push(item)
      }
      this.chartRevenueData = chartData
    },

    /**
     * Get today report
     */
    getOverView() {
      reportAPI.getOverView().then(res => {
        if(res && res.data && res.data.data) {
          let data = res.data.data
          this.todayBillNumber = data.bill_number
          this.todayRevenue = data.reveneu
          this.todayProfit = data.profit
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast(errorMess, 'error')
      })
    },

      /**
     * Get list date from date input
     */
    getListDateFromDateInput() {
      let result = []

      let fromDate = new Date(this.fromDate)
        let toDate = new Date(this.toDate)
        while(fromDate <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0,10)).substring(0, 5)
          result.push(dateTemp)
          fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
        }

      return result
    },

    /**
     * Get data revenue
     */
    getRevenue() {
      let params = {
        "chartBy" : "Day",
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.toDate),
        "fromMonth": "",
        "toMonth": "",
        "listDay": this.getListDay()
      }

      // Search
      reportAPI.getRevenue(params).then(res => {
        if(res && res.data && res.data.data) {
          this.handleRevenueData(res.data.data)
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast(errorMess, 'error')
      })
    },

    /**
     * Get data repository overview
     */
    getRepository() {
      reportAPI.getRepositoryOverview().then(res => {
        if(res && res.data && res.data.data) {
          this.repo = res.data.data
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast(errorMess, 'error')
      })
    },

    /**
     * Get data repository overview
     */
    getDebtAndPublicDebt() {
      reportAPI.getDebtAndPublicDebtOverview().then(res => {
        if(res && res.data && res.data.data) {
          let data = res.data.data
          this.debt_total = data.debt_total
          this.debt_number = data.debt_forewarning_number
          this.debt_amount = data.debt_forewarning_amount
          this.public_debt_total = data.public_debt_total
          this.public_debt_number = data.public_debt_forewarning_number
          this.public_debt_amount = data.public_debt_forewarning_amount
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast(errorMess, 'error')
      })
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

