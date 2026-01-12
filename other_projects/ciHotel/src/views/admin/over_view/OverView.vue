<template>
  <div class="container-fluid mx-auto px-4 py-6">
    <!-- Today's Stats Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="mb-4">
        <h4 class="text-2xl font-bold text-center text-gray-800">Hôm Nay</h4>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Bill Number Card -->
        <div class="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center">
          <h5 class="text-lg font-semibold mb-4">Số bill</h5>
          <div class="flex items-center justify-center">
            <i class="fa fa-clipboard text-6xl text-blue-400 mr-4"></i>
            <b class="text-4xl text-gray-800">{{ formatNumber(todayBillNumber) }}</b>
          </div>
        </div>

        <!-- Revenue Card -->
        <div class="bg-orange-50 border-2 border-orange-300 rounded-lg p-6 text-center">
          <h5 class="text-lg font-semibold mb-4">Doanh thu</h5>
          <div class="flex items-center justify-center">
            <i class="fa fa-plus text-6xl text-orange-300 mr-4"></i>
            <b class="text-4xl text-gray-800">{{ formatCurrency(todayRevenue) }}</b>
          </div>
        </div>

        <!-- Booking Number Card -->
        <div class="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 text-center">
          <h5 class="text-lg font-semibold mb-4">Số phòng được đặt</h5>
          <div class="flex items-center justify-center">
            <i class="fa fa-check text-6xl text-purple-400 mr-4"></i>
            <b class="text-4xl text-gray-800">{{ formatNumber(todayBookingNumber) }}</b>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue Chart Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-2xl font-bold text-center text-gray-800 mb-6">Doanh Thu</h4>

      <div class="mb-4">
        <GChart
          type="ColumnChart"
          :data="chartDayData"
          :options="chartOptions"
        />
      </div>

      <div class="text-center">
        <a href="/chart-profit-revenue" class="text-blue-600 hover:text-blue-800 underline">Xem nhiều hơn</a>
      </div>
    </div>

    <!-- Most Booked Room Type Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h4 class="text-2xl font-bold text-center text-gray-800 mb-6">Loại Phòng Đặt Nhiều Nhất</h4>

      <div class="mb-4">
        <p class="font-bold text-gray-700 mb-4">Phòng đặt nhiều nhất (7 ngày qua)</p>
      </div>

      <div class="mb-4">
        <div class="flex items-center gap-4 mb-4">
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="room"
              @click="showRoomAmount = true"
              checked
              class="mr-2">
            <span>Doanh thu</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="room"
              @click="showRoomAmount = false"
              class="mr-2">
            <span>Số lượng</span>
          </label>
        </div>

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
      </div>

      <div class="text-center">
        <p><a href="/statistic" class="text-blue-600 hover:text-blue-800 underline">Xem nhiều hơn</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

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
      fromDay: null,
      toDay: null,
      out_over: 0,
      running_out: 0,
      showRoomAmount: true,
      todayBillNumber: 0,
      todayRevenue: 0,
      todayBookingNumber: 0
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    }
  },
  mounted() {
    this.getOverView()
  },
  methods: {
    ...useFormatters(),

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
      const { error } = useToast()

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
        error(errorMess)
      })
    },

    /**
     * Search
     */
    getData() {
      const { error } = useToast()
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
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        error(errorMess)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  // No custom styles needed - all using Tailwind
</style>
