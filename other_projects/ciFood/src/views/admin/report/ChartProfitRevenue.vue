<template>
  <div class="container-fluid">

    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center text-header">Biểu Đồ Doanh Thu</h4>
            <b-row>
              <b-col md="4">
                <label> Xem theo </label>
                <b-form-select
                  :options="chartByOption"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.chartBy"
                  @change="changeChartBy"
                  :disabled="onSearch">
                </b-form-select>
              </b-col>
              <b-col md="4" v-show="inputs.chartBy != 'Month'">
                <label> Từ ngày </label><span class="error-sybol"></span>
                <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  :disabled="onSearch">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorFromDate">
                  Mục từ ngày không đúng
                </b-form-invalid-feedback>
              </b-col>
              <b-col md="4" v-show="inputs.chartBy != 'Month'">
                <label> Đến ngày </label><span class="error-sybol"></span>
                <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  :disabled="onSearch">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorToDate">
                  Mục đến ngày không đúng
                </b-form-invalid-feedback>
              </b-col>

              <b-col md="4" v-show="inputs.chartBy == 'Month'">
                <label> Từ tháng </label><span class="error-sybol"></span>
                <input
                  id="fromMonth"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.fromMonth"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  :disabled="onSearch">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorFromMonth">
                  Mục từ tháng không đúng
                </b-form-invalid-feedback>
              </b-col>
              <b-col md="4" v-show="inputs.chartBy == 'Month'">
                <label> Đến tháng </label><span class="error-sybol"></span>
                <input
                  id="toMonth"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.toMonth"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)"
                  :disabled="onSearch">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorToMonth">
                  Mục đến tháng không đúng
                </b-form-invalid-feedback>
              </b-col>

            </b-row>

            <b-row class="mt-2 mb-2">
              <b-col md="12">
                <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click="search">
                  Xem
                </b-button>
              </b-col>
            </b-row>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <GChart
              type="ColumnChart"
              :data="chartData"
              :options="chartOptions"
              v-show="click && chartData.length > 0"
            />
            <p v-show="click && firstSearch == false && chartData.length == 0" class="text-center">Không có dữ liệu để hiển thị</p>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'


export default {
  components: {
    GChart
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
        {value: 'Day', text: ''},
        {value: 'Day', text: 'Ngày'},
        {value: 'Week', text: 'Tuần'},
        {value: 'Month', text: 'Tháng'},
      ],
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
      firstSearch: true,
    }
  },
  mounted() {
    // Get default date
    let dateNow = new Date()
    this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))

  },
  computed: {
    errorFromDate: function () {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate: function () {
      return this.checkDate(this.inputs.toDate)
    },
    errorFromMonth: function () {
      return this.checkMonth(this.inputs.fromMonth)
    },
    errorToMonth: function () {
      return this.checkMonth(this.inputs.toMonth)
    },
  },
  methods: {
    checkDate (dateInput) {
      return (this.click && this.inputs.chartBy != "Month" && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkMonth (monthInput) {
      return (this.click && this.inputs.chartBy == "Month" && (monthInput == "" || monthInput == null || commonFunc.dateFormatCheck("01-" + monthInput) == false))
    },
    checkValidate () {
      return !(this.errorFromDate || this.errorToDate)
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
     * Event change chart by
     */
    changeChartBy() {
      let dateNow = new Date()

      if(this.inputs.chartBy == "Day") {
        // Get default date
        this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
        let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
        this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
      }

      if(this.inputs.chartBy == "Week") {
        // Get default week
        this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
        let fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
        this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
      }

      if(this.inputs.chartBy == "Month") {
        // Get default month
        this.inputs.toMonth = commonFunc.formatDate(dateNow.toJSON().slice(0,10)).substring(3, 10)
        dateNow.setMonth(dateNow.getMonth() - 11)
        this.inputs.fromMonth = commonFunc.formatDate(dateNow.toJSON().slice(0,10)).substring(3, 10)
      }
    },

    /**
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {

      if(this.inputs.chartBy == "Day" || this.inputs.chartBy == "Week") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

        if(fromDate > toDate) {
          this.popToast('danger', "Từ ngày không thể lớn hớn đến ngày")
          return false
        }

        if(this.inputs.chartBy == "Day") {
          fromDate.setMonth(fromDate.getMonth() + 1)

          if(fromDate < toDate) {
            this.popToast('danger', "Thời gian không được quá 1 tháng")
            return false
          }
        }

        if(this.inputs.chartBy == "Week") {
          fromDate.setMonth(fromDate.getMonth() + 6)

          if(fromDate < toDate) {
            this.popToast('danger', "Thời gian không được quá 6 tháng")
            return false
          }
        }
      }

      if(this.inputs.chartBy == "Month") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + this.inputs.fromMonth))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + this.inputs.toMonth))

        if(fromDate > toDate) {
          this.popToast('danger', "Từ tháng không thể lớn hớn đến tháng")
          return false
        }

        fromDate.setMonth(fromDate.getMonth() + 12)

        if(fromDate < toDate) {
          this.popToast('danger', "Thời gian không được quá 12 tháng")
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
        let daysOfMonth = this.getDaysInMonth(toMonths[0], toMonths[1])
        return daysOfMonth
      }
    },

    /**
     * Get list date from date input
     */
    getListDateFromDateInput() {
      let result = []

      if(this.inputs.chartBy == "Day") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        fromDate = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate) + ' 23:00:00')
        toDate = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000))
        while(fromDate <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0,10)).substring(0, 5)
          result.push(dateTemp)
          fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
        }
      }

      if(this.inputs.chartBy == "Week") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        fromDate = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate) + ' 23:00:00')
        toDate = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000))
        let fromDateTemp = this.getMonday(fromDate)
        while(fromDateTemp <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0,10)).substring(0, 5)
          result.push(dateTemp)
          fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
        }
      }

      if(this.inputs.chartBy == "Month") {
        let daysOfMonth = this.getDayByMonthInput(this.inputs.toMonth)
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + this.inputs.fromMonth))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(daysOfMonth + "-" + this.inputs.toMonth))
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
            item[1] = datas[j].profit
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

      // Check validate
      if(!this.checkValidate()) {
        this.chartData = []
        return
      }
      if(!this.checkFromDateAndToDate()) {
        this.chartData = []
        return
      }

      this.loading = true
      this.onSearch = true

        let listDay = this.getListDateFromDateInput()
      let params = {
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "chartBy": this.inputs.chartBy,
        "fromMonth": commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + this.inputs.fromMonth),
        "toMonth": commonFunc.convertDDMMYYYYToYYYYMMDD(this.getDayByMonthInput(this.inputs.toMonth) + "-" + this.inputs.toMonth),
          "listDay": listDay
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
        this.popToast('danger', errorMess)

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
