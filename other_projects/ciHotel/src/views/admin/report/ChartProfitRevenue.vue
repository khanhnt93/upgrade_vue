<template>
  <div class="p-6">
    <!-- Chart Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h4 class="text-2xl font-bold text-center text-gray-800 mb-6">BIỂU ĐỒ DOANH THU</h4>
      
      <!-- Filters Section -->
      <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <!-- Chart By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Xem theo</label>
            <select
              v-model="inputs.chartBy"
              @change="changeChartBy"
              :disabled="onSearch"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="Day">Ngày</option>
              <option value="Week">Tuần</option>
              <option value="Month">Tháng</option>
            </select>
          </div>

          <!-- From Date (Day/Week) -->
          <div v-if="inputs.chartBy !== 'Month'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày <span class="text-red-500">*</span>
            </label>
            <input
              v-model="inputs.fromDate"
              type="text"
              placeholder="dd-mm-yyyy"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              :disabled="onSearch"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100',
                errorFromDate ? 'border-red-500' : 'border-gray-300'
              ]"
            />
            <p v-if="errorFromDate" class="text-red-500 text-xs mt-1">Mục từ ngày không đúng</p>
          </div>

          <!-- To Date (Day/Week) -->
          <div v-if="inputs.chartBy !== 'Month'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày <span class="text-red-500">*</span>
            </label>
            <input
              v-model="inputs.toDate"
              type="text"
              placeholder="dd-mm-yyyy"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              :disabled="onSearch"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100',
                errorToDate ? 'border-red-500' : 'border-gray-300'
              ]"
            />
            <p v-if="errorToDate" class="text-red-500 text-xs mt-1">Mục đến ngày không đúng</p>
          </div>

          <!-- From Month (Month mode) -->
          <div v-if="inputs.chartBy === 'Month'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Từ tháng <span class="text-red-500">*</span>
            </label>
            <input
              v-model="inputs.fromMonth"
              type="text"
              placeholder="mm-yyyy"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              :disabled="onSearch"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100',
                errorFromMonth ? 'border-red-500' : 'border-gray-300'
              ]"
            />
            <p v-if="errorFromMonth" class="text-red-500 text-xs mt-1">Mục từ tháng không đúng</p>
          </div>

          <!-- To Month (Month mode) -->
          <div v-if="inputs.chartBy === 'Month'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Đến tháng <span class="text-red-500">*</span>
            </label>
            <input
              v-model="inputs.toMonth"
              type="text"
              placeholder="mm-yyyy"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              :disabled="onSearch"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100',
                errorToMonth ? 'border-red-500' : 'border-gray-300'
              ]"
            />
            <p v-if="errorToMonth" class="text-red-500 text-xs mt-1">Mục đến tháng không đúng</p>
          </div>

          <!-- Search Button -->
          <div class="flex items-end">
            <button
              @click="search"
              :disabled="onSearch"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Xem
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        <p class="text-gray-600 mt-4">Đang tải dữ liệu...</p>
      </div>

      <!-- Chart Display -->
      <div v-else>
        <GChart
          v-if="click && chartData.length > 0"
          type="ColumnChart"
          :data="chartData"
          :options="chartOptions"
          class="w-full"
        />
        <p v-if="click && !firstSearch && chartData.length === 0" class="text-center text-gray-600 py-8">
          Không có dữ liệu để hiển thị
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'

export default {
  name: 'ChartProfitRevenue',
  components: {
    GChart
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      inputs: {
        fromDate: null,
        toDate: null,
        fromMonth: null,
        toMonth: null,
        chartBy: 'Day'
      },
      chartData: [],
      chartOptions: {
        chart: {
          title: 'Biểu đồ doanh thu và lợi nhuận',
          subtitle: 'Biểu đồ doanh thu và lợi nhuận',
        }
      },
      onSearch: false,
      click: false,
      loading: false,
      firstSearch: true
    }
  },
  computed: {
    errorFromDate() {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate() {
      return this.checkDate(this.inputs.toDate)
    },
    errorFromMonth() {
      return this.checkMonth(this.inputs.fromMonth)
    },
    errorToMonth() {
      return this.checkMonth(this.inputs.toMonth)
    }
  },
  mounted() {
    // Set default date range (last 7 days)
    const dateNow = new Date()
    this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
    const fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))

    this.search()
  },
  methods: {
    checkDate(dateInput) {
      return (this.click && this.inputs.chartBy !== 'Month' && (dateInput == '' || dateInput == null || commonFunc.dateFormatCheck(dateInput) === false))
    },
    checkMonth(monthInput) {
      return (this.click && this.inputs.chartBy === 'Month' && (monthInput == '' || monthInput == null || commonFunc.dateFormatCheck('01-' + monthInput) === false))
    },
    checkValidate() {
      return !(this.errorFromDate || this.errorToDate)
    },
    changeChartBy() {
      const dateNow = new Date()

      if (this.inputs.chartBy === 'Day') {
        // Get default date
        this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
        const fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
        this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
      }

      if (this.inputs.chartBy === 'Week') {
        // Get default week
        this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0, 10))
        const fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
        this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0, 10))
      }

      if (this.inputs.chartBy === 'Month') {
        // Get default month
        this.inputs.toMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
        dateNow.setMonth(dateNow.getMonth() - 11)
        this.inputs.fromMonth = commonFunc.formatDate(dateNow.toJSON().slice(0, 10)).substring(3, 10)
      }
    },
    checkFromDateAndToDate() {
      if (this.inputs.chartBy === 'Day' || this.inputs.chartBy === 'Week') {
        const fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

        if (fromDate > toDate) {
          this.toast.error('Từ ngày không thể lớn hơn đến ngày')
          return false
        }

        if (this.inputs.chartBy === 'Day') {
          fromDate.setMonth(fromDate.getMonth() + 1)

          if (fromDate < toDate) {
            this.toast.error('Thời gian không được quá 1 tháng')
            return false
          }
        }

        if (this.inputs.chartBy === 'Week') {
          fromDate.setMonth(fromDate.getMonth() + 6)

          if (fromDate < toDate) {
            this.toast.error('Thời gian không được quá 6 tháng')
            return false
          }
        }
      }

      if (this.inputs.chartBy === 'Month') {
        const fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD('01-' + this.inputs.fromMonth))
        const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD('01-' + this.inputs.toMonth))

        if (fromDate > toDate) {
          this.toast.error('Từ tháng không thể lớn hơn đến tháng')
          return false
        }

        fromDate.setMonth(fromDate.getMonth() + 12)

        if (fromDate < toDate) {
          this.toast.error('Thời gian không được quá 12 tháng')
          return false
        }
      }

      return true
    },
    getMonday(d) {
      d = new Date(d)
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
      return new Date(d.setDate(diff))
    },
    getDaysInMonth(month, year) {
      return new Date(year, month, 0).getDate()
    },
    getDayByMonthInput(monthInput) {
      if (monthInput) {
        const toMonths = monthInput.split('-')
        const daysOfMonth = this.getDaysInMonth(toMonths[0], toMonths[1])
        return daysOfMonth
      }
    },
    getListDateFromDateInput() {
      const result = []

      if (this.inputs.chartBy === 'Day') {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))
        while (fromDate <= toDate) {
          const dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10)).substring(0, 5)
          result.push(dateTemp)
          fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
        }
      }

      if (this.inputs.chartBy === 'Week') {
        const fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))
        let fromDateTemp = this.getMonday(fromDate)
        while (fromDateTemp <= toDate) {
          const dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0, 10)).substring(0, 5)
          result.push(dateTemp)
          fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
        }
      }

      if (this.inputs.chartBy === 'Month') {
        const daysOfMonth = this.getDayByMonthInput(this.inputs.toMonth)
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD('01-' + this.inputs.fromMonth))
        const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(daysOfMonth + '-' + this.inputs.toMonth))
        while (fromDate <= toDate) {
          const dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0, 10)).substring(3, 10)
          result.push(dateTemp)
          fromDate = new Date(fromDate.setMonth(fromDate.getMonth() + 1))
        }
      }

      return result
    },
    convertDbDataToChartData(datas) {
      const chartDayData = [
        ['Time', 'Doanh thu']
      ]
      const listDay = this.getListDateFromDateInput()
      for (const i in listDay) {
        const item = [listDay[i], 0]
        for (const j in datas) {
          if (listDay[i] === datas[j].time) {
            item[1] = datas[j].profit
            break
          }
        }
        chartDayData.push(item)
      }
      this.chartData = chartDayData
    },
    async search() {
      if (this.loading) { return }
      this.click = true

      // Check validate
      if (!this.checkValidate()) {
        this.chartData = []
        return
      }
      if (!this.checkFromDateAndToDate()) {
        this.chartData = []
        return
      }

      this.loading = true
      this.onSearch = true

      const params = {
        fromDate: commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        toDate: commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        chartBy: this.inputs.chartBy,
        fromMonth: commonFunc.convertDDMMYYYYToYYYYMMDD('01-' + this.inputs.fromMonth),
        toMonth: commonFunc.convertDDMMYYYYToYYYYMMDD(this.getDayByMonthInput(this.inputs.toMonth) + '-' + this.inputs.toMonth)
      }

      try {
        const response = await adminAPI.getChartProfitAndRevenue(params)
        if (response && response.data && response.data.data) {
          this.convertDbDataToChartData(response.data.data)
        }
        this.firstSearch = false
      } catch (error) {
        console.error('Error fetching chart data:', error)
        const errorMess = commonFunc.handleStaffError(error)
        this.toast.error(errorMess)
        this.chartData = []
        this.firstSearch = false
      } finally {
        this.onSearch = false
        this.loading = false
      }
    },
    inputDateOnly(item) {
      const valueInput = item.value
      const result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    }
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
