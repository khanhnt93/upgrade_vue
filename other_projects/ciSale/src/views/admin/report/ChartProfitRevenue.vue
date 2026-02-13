<template>
  <div class="w-full p-4">

    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg">
          <div class="p-6">
            <h4 class="text-center text-header">BIỂU ĐỒ DOANH THU</h4>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/4 px-2">
                <label> Xem theo </label>
                <select
                  id="status"
                  autocomplete="new-password"
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  v-model="inputs.chartBy"
                  @change="changeChartBy"
                  :disabled="onSearch">
                  <option v-for="option in chartByOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
              <div class="w-full h-10 md:w-1/4 px-2" v-show="inputs.chartBy != 'Month'">
                <label> Từ ngày </label><span class="error-sybol"></span>
                <datepicker v-model="inputs.fromDate" format="yyyy-MM-dd" :typeable="true"
                            placeholder="yyyy-MM-dd" input-class="w-full h-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" ></datepicker>
              </div>
              <div class="w-full md:w-1/4 px-2" v-show="inputs.chartBy != 'Month'">
                <label> Đến ngày </label><span class="error-sybol"></span>
                <datepicker v-model="inputs.toDate" format="yyyy-MM-dd" :typeable="true"
                            placeholder="yyyy-MM-dd" input-class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" ></datepicker>
              </div>

              <div class="w-full md:w-1/4 px-2" v-show="inputs.chartBy == 'Month'">
                <label> Từ tháng </label><span class="error-sybol"></span>
                <datepicker v-model="inputs.fromMonth" format="yyyy-MM" :typeable="true"
                            placeholder="yyyy-MM" input-class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" ></datepicker>
              </div>
              <div class="w-full md:w-1/4 px-2" v-show="inputs.chartBy == 'Month'">
                <label> Đến tháng </label><span class="error-sybol"></span>
                <datepicker v-model="inputs.toMonth" format="yyyy-MM" :typeable="true"
                            placeholder="yyyy-MM" input-class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" ></datepicker>
              </div>

              <div class="w-full md:w-1/4 px-2">
                <label class="label-width text-white">
                   Xem
                </label>
                <button class="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4 rounded float-right w-[120px]" :disabled="onSearch" @click.prevent="search">
                  Xem
                </button>
              </div>

            </div>

            <!-- Loading -->
            <span class="loading-more" v-show="loading">
              <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
            </span>

            <GChart
              type="ColumnChart"
              :data="chartData"
              :options="chartOptions"
              class="w-full"
              v-if="click && chartData.length > 0"
            />
            <p v-show="click && firstSearch == false && chartData.length == 0" class="text-center">Không có dữ liệu để hiển thị</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const { toast } = useToast()
    return { toast }
  },
  components: {
    GChart,
    Datepicker
  },
  data () {
    return {
      inputs: {
        "fromDate": null,
        "toDate": null,
        "fromMonth": null,
        "toMonth": null,
        "chartBy": "Day"
      },
      chartByOption: [
        {value: 'Day', text: 'Ngày'},
        {value: 'Week', text: 'Tuần'},
        {value: 'Month', text: 'Tháng'},
      ],
      chartData: [],
      chartOptions: {
        title: 'Biểu đồ doanh thu và lợi nhuận',
        subtitle: 'Biểu đồ doanh thu và lợi nhuận',
        height: 500,
        legend: { position: 'top' },
        colors: ['#3b82f6', '#10b981'], // blue, green
        chartArea: { width: '85%', height: '75%' }
      },
      onSearch: false,
      click: false,
      loading: false,
      firstSearch: true,
    }
  },
  mounted() {
    // Get default date
    let dateNow = new Date()
    this.inputs.toDate = dateNow
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    this.inputs.fromDate = fromDate

    this.search()
  },
  // computed: {
  //   // errorFromDate: function () {
  //   //   return this.checkDate(this.inputs.fromDate)
  //   // },
  //   // errorToDate: function () {
  //   //   return this.checkDate(this.inputs.toDate)
  //   // },
  //   // errorFromMonth: function () {
  //   //   return this.checkMonth(this.inputs.fromMonth)
  //   // },
  //   // errorToMonth: function () {
  //   //   return this.checkMonth(this.inputs.toMonth)
  //   // },
  // },
  methods: {
    // checkDate (dateInput) {
    //   return (this.click && this.inputs.chartBy != "Month" && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    // },
    // checkMonth (monthInput) {
    //   return (this.click && this.inputs.chartBy == "Month" && (monthInput == "" || monthInput == null || commonFunc.dateFormatCheck("01-" + monthInput) == false))
    // },
    // checkValidate () {
    //   return !(this.errorFromDate || this.errorToDate)
    // },



    /**
     * Event change chart by
     */
    changeChartBy() {
      let dateNow = new Date()

      if(this.inputs.chartBy == "Day") {
        // Get default date
        this.inputs.toDate = dateNow
        let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
        this.inputs.fromDate = fromDate
      }

      if(this.inputs.chartBy == "Week") {
        // Get default week
        this.inputs.toDate = dateNow
        let fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
        this.inputs.fromDate = fromDate
      }

      if(this.inputs.chartBy == "Month") {
        // Get default month
        this.inputs.toMonth = dateNow.toJSON().slice(0,10).substring(0, 7)
        dateNow.setMonth(dateNow.getMonth() - 11)
        this.inputs.fromMonth = dateNow.toJSON().slice(0,10).substring(0, 7)
      }
    },

    /**
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {

      if(this.inputs.chartBy == "Day" || this.inputs.chartBy == "Week") {
        let fromDate = new Date(this.inputs.fromDate)
        let toDate = new Date(this.inputs.toDate)

        if(fromDate > toDate) {
          this.toast("Từ ngày không thể lớn hớn đến ngày", 'error')
          return false
        }

        if(this.inputs.chartBy == "Day") {
          fromDate.setMonth(fromDate.getMonth() + 1)

          if(fromDate < toDate) {
            this.toast("Thời gian không được quá 1 tháng", 'error')
            return false
          }
        }

        if(this.inputs.chartBy == "Week") {
          fromDate.setMonth(fromDate.getMonth() + 6)

          if(fromDate < toDate) {
            this.toast("Thời gian không được quá 6 tháng", 'error')
            return false
          }
        }
      }

      if(this.inputs.chartBy == "Month") {
        let fromDate = new Date(this.inputs.fromMonth + "-01")
        let toDate = new Date(this.inputs.toMonth + "-01")

        if(fromDate > toDate) {
          this.toast("Từ tháng không thể lớn hớn đến tháng", 'error')
          return false
        }

        fromDate.setMonth(fromDate.getMonth() + 12)

        if(fromDate < toDate) {
          this.toast("Thời gian không được quá 12 tháng", 'error')
          return false
        }
      }

      return true
    },

    /**
     * Get monday
     */
    getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },

    /**
     * Get number of days in month
     */
    getDaysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    },

    /**
     * Get days by month input
     */
    getDayByMonthInput(monthInput) {
      if(monthInput) {
        let toMonths = monthInput.split("-")
        let daysOfMonth = this.getDaysInMonth(toMonths[1], toMonths[0])
        return daysOfMonth
      }
    },

    /**
     * Get list date from date input
     */
    getListDateFromDateInput() {
      let result = []

      if(this.inputs.chartBy == "Day") {
        let fromDate = new Date(this.inputs.fromDate)
        let toDate = new Date(this.inputs.toDate)
        while(fromDate <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0,10)).substring(0, 5)
          result.push(dateTemp)
          fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
        }
      }

      if(this.inputs.chartBy == "Week") {
        let fromDate = new Date(this.inputs.fromDate)
        let toDate = new Date(this.inputs.toDate)
        let fromDateTemp = this.getMonday(fromDate)
        while(fromDateTemp <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0,10)).substring(0, 5)
          result.push(dateTemp)
          fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
        }
      }

      if(this.inputs.chartBy == "Month") {
        let daysOfMonth = this.getDayByMonthInput(this.inputs.toMonth)
        let fromDate = new Date(this.inputs.fromMonth + "-01")
        let toDate = new Date(this.inputs.toMonth + "-" + daysOfMonth)
        while(fromDate <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0,10)).substring(3, 10)
          result.push(dateTemp)
          fromDate = new Date(fromDate.setMonth(fromDate.getMonth() + 1))
        }
      }

      return result
    },

    /**
     * Convert db data to chart data
     */
    convertDbDataToChartData(datas) {
      let chartDayData = [
        ["Time", "Doanh thu"]
      ]
      let listDay = this.getListDateFromDateInput()
      for (let i in listDay) {
        let item = [listDay[i], 0]
        for (let j in datas) {
          if(listDay[i] == datas[j].time) {
            item[1] = datas[j].revenue
            break
          }
        }
        chartDayData.push(item)
      }
      this.chartData = chartDayData
    },

    /**
     * Search
     */
    search() {
      if (this.loading) { return }
      this.click = true

      // // Check validate
      // if(!this.checkValidate()) {
      //   this.chartData = []
      //   return
      // }
      if(!this.checkFromDateAndToDate()) {
        this.chartData = []
        return
      }

      this.loading = true
      this.onSearch = true

      let params = {
        "fromDate": this.inputs.fromDate ? new Date(this.inputs.fromDate).toISOString().slice(0,10) : null,
        "toDate": this.inputs.toDate ? new Date(this.inputs.toDate).toISOString().slice(0,10) : null,
        "chartBy": this.inputs.chartBy,
          "fromMonth": this.inputs.fromMonth,
        "toMonth": this.inputs.toMonth,
        // "fromMonth": this.inputs.fromMonth + "-01",
        // "toMonth": this.inputs.toMonth + "-" + this.getDayByMonthInput(this.inputs.toMonth),
        "listDay": this.getListDateFromDateInput()
      }

      // Search
      adminAPI.getChartProfitAndRevenue(params).then(res => {
        if(res && res.data && res.data.data) {
          this.convertDbDataToChartData(res.data.data)
        }

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast(errorMess, 'error')

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      })
    },

    /**
     * Only input date
     */
     inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },
  }
}
</script>
