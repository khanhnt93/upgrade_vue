<template>
  <div class="container-fluid">

    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="card-body p-4">
            <h4 class="text-center text-header">BÁO CÁO LỢI NHUẬN</h4>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/4 px-2">
                <label> Xem theo </label>
                <select
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.dataBy"
                  @change="changeDataBy"
                  :disabled="onSearch">
                  <option v-for="option in dataByOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
              <div class="w-full md:w-1/4 px-2" v-show="inputs.dataBy != 'Month'">
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
                <div v-if="errorFromDate" class="text-red-600 text-sm mt-1">
                  Mục từ ngày không đúng
                </div>
              </div>
              <div class="w-full md:w-1/4 px-2" v-show="inputs.dataBy != 'Month'">
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
                <div v-if="errorToDate" class="text-red-600 text-sm mt-1">
                  Mục đến ngày không đúng
                </div>
              </div>

              <div class="w-full md:w-1/4 px-2" v-show="inputs.dataBy == 'Month'">
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
                <div v-if="errorFromMonth" class="text-red-600 text-sm mt-1">
                  Mục từ tháng không đúng
                </div>
              </div>
              <div class="w-full md:w-1/4 px-2" v-show="inputs.dataBy == 'Month'">
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
                <div v-if="errorToMonth" class="text-red-600 text-sm mt-1">
                  Mục đến tháng không đúng
                </div>
              </div>

              <div class="w-full md:w-1/4 px-2">
                <label class="label-width text-white">
                   Xem
                </label>
                <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch" @click.prevent="search">
                  Xem
                </button>
              </div>

            </div>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <div class="flex flex-wrap -mx-2" v-show="click && datas.length > 0">
                <div class="w-full px-2">
                  <div class="flex flex-wrap -mx-2">
                    <div class="w-full md:w-1/3 px-2">
                      Số kết quả: {{datas.length}}
                    </div>
                    <div class="w-full md:w-2/3 px-2 text-right">
                      <button class="btn btn-default text-header" @click="exportToExcel(datas, excel_bill_fields, 'bao_cao_loi_nhuan.xls')">
                        <b>Xuất Excel</b>
                      </button>
                    </div>
                  </div>

                  <table class="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Doanh thu bán hàng</th>
                        <th>Doanh thu khác</th>
                        <th>Chi phí</th>
                        <th>Lợi nhuận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(data, index) in datas">
                        <td>{{index + 1}}</td>
                        <td>{{data.time}}</td>
                        <td class="text-right">{{currencyFormat(data.revenue)}}</td>
                        <td class="text-right">{{currencyFormat(data.revenueOther)}}</td>
                        <td class="text-right">{{currencyFormat(data.fee)}}</td>
                        <td class="text-right">{{currencyFormat(data.profit)}}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold total text-center" colspan="2">Tổng</td>
                        <td class="text-right font-weight-bold total">{{currencyFormat(totalRevenue)}}</td>
                        <td class="text-right font-weight-bold total">{{currencyFormat(totalRevenueOther)}}</td>
                        <td class="text-right font-weight-bold total">{{currencyFormat(totalFee)}}</td>
                        <td class="text-right font-weight-bold total">{{currencyFormat(totalProfit)}}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

            <!--<p v-show="click && firstSearch == false && datas.length == 0" class="text-center">Không có dữ liệu để hiển thị</p>-->
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const { toast } = useToast()
    const { exportToExcel } = useExcelExport()
    return { toast, exportToExcel }
  },
  data () {
    return {
      inputs: {
        "fromDate": null,
        "toDate": null,
        "fromMonth": null,
        "toMonth": null,
        "dataBy": "Day"
      },
      dataByOption: [
        {value: 'Day', text: ''},
        {value: 'Day', text: 'Ngày'},
        {value: 'Week', text: 'Tuần'},
        {value: 'Month', text: 'Tháng'},
      ],
      datas: [],
      totalRevenue: 0,
      totalRevenueOther: 0,
      totalFee: 0,
      totalProfit: 0,
      onSearch: false,
      click: false,
      loading: false,
      firstSearch: true,
      excel_bill_fields: {
        'Ngày': 'time',
        'Doanh thu bán hàng': 'revenue',
        'Doanh thu khác' : 'revenueOther',
        'Chi phí': 'fee',
        'Lợi nhuận' : 'profit'
      },
    }
  },
  mounted() {
    // Get default date
    let dateNow = new Date()
    this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))

      this.search()
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
      return (this.click && this.inputs.dataBy != "Month" && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkMonth (monthInput) {
      return (this.click && this.inputs.dataBy == "Month" && (monthInput == "" || monthInput == null || commonFunc.dateFormatCheck("01-" + monthInput) == false))
    },
    checkValidate () {
      return !(this.errorFromDate || this.errorToDate)
    },



    /**
     * Event change data by
     */
    changeDataBy() {
      let dateNow = new Date()

      if(this.inputs.dataBy == "Day") {
        // Get default date
        this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
        let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
        this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
      }

      if(this.inputs.dataBy == "Week") {
        // Get default week
        this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
        let fromDate = new Date(dateNow.setMonth(dateNow.getMonth() - 2))
        this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
      }

      if(this.inputs.dataBy == "Month") {
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

      if(this.inputs.dataBy == "Day" || this.inputs.dataBy == "Week") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

        if(fromDate > toDate) {
          this.toast("Từ ngày không thể lớn hớn đến ngày", 'error')
          return false
        }

        if(this.inputs.dataBy == "Day") {
          fromDate.setMonth(fromDate.getMonth() + 1)

          if(fromDate < toDate) {
            this.toast("Thời gian không được quá 1 tháng", 'error')
            return false
          }
        }

        if(this.inputs.dataBy == "Week") {
          fromDate.setMonth(fromDate.getMonth() + 6)

          if(fromDate < toDate) {
            this.toast("Thời gian không được quá 6 tháng", 'error')
            return false
          }
        }
      }

      if(this.inputs.dataBy == "Month") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + this.inputs.fromMonth))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + this.inputs.toMonth))

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
        let daysOfMonth = this.getDaysInMonth(toMonths[0], toMonths[1])
        return daysOfMonth
      }
    },

    /**
     * Get list date from date input
     */
    getListDateFromDateInput() {
      let result = []

      if(this.inputs.dataBy == "Day") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        fromDate = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate) + ' 23:00:00')
        toDate = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000))
        while(fromDate <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
          result.push(dateTemp)
          fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
        }
      }

      if(this.inputs.dataBy == "Week") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        fromDate = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate) + ' 23:00:00')
        toDate = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000))
        let fromDateTemp = this.getMonday(fromDate)
        while(fromDateTemp <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDateTemp.toJSON().slice(0,10))
          result.push(dateTemp)
          fromDateTemp = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 7))
        }
      }

      if(this.inputs.dataBy == "Month") {
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

    // /**
    //  * Convert db data to chart data
    //  */
    // convertDbDataToChartData(datas) {
    //   let data = []
    //   let listDay = this.getListDateFromDateInput()
    //   for (let i in listDay) {
    //     let item =  {
    //       "time": listDay[i],
    //       "revenue": 0,
    //       "fee": 0,
    //       "profit": 0
    //     }
    //     for (let j in datas) {
    //       if(listDay[i] == datas[j].time) {
    //         item = datas[j]
    //         break
    //       }
    //     }
    //     data.push(item)
    //   }
    //   this.datas = data
    // },

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
        "dataBy": this.inputs.dataBy,
        "fromMonth": commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + this.inputs.fromMonth),
        "toMonth": commonFunc.convertDDMMYYYYToYYYYMMDD(this.getDayByMonthInput(this.inputs.toMonth) + "-" + this.inputs.toMonth),
        "listDay": listDay
      }

      // Search
      adminAPI.getProfitReport(params).then(res => {
        if(res && res.data && res.data.data) {
          // this.convertDbDataToChartData(res.data.data)
          this.datas = res.data.data.data
          this.totalRevenue = res.data.data.total_revenue
          this.totalRevenueOther = res.data.data.total_revenue_other
          this.totalFee = res.data.data.total_fee
          this.totalProfit = res.data.data.total_profit
        }

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        console.log(err)
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

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = null

      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      } else {
        if(num === 0) {
          return 0
        }
      }
      return result
    },
  }
}
</script>

<style lang="css" scoped>
  .total {
    color: #ed592a;
  }

  table {
   margin: auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
  }

  td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  th {
    text-align: left;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  td {
    white-space: nowrap;
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  td:first-of-type, th:first-of-type {
    border-left: none;
  }

  td:last-of-type, th:last-of-type {
    border-right: none;
  }
</style>
