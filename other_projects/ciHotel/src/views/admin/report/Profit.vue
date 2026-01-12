<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h4 class="text-center text-2xl font-bold text-orange-600 mb-6">BÁO CÁO LỢI NHUẬN</h4>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <!-- Xem theo -->
        <div class="md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Xem theo</label>
          <select
            v-model="inputs.dataBy"
            @change="changeDataBy"
            :disabled="onSearch"
            class="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Day">Ngày</option>
            <option value="Week">Tuần</option>
            <option value="Month">Tháng</option>
          </select>
        </div>

        <!-- Day/Week filters -->
        <template v-if="inputs.dataBy != 'Month'">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="inputs.fromDate"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              :disabled="onSearch"
              :class="['w-full border rounded px-3 py-2', errorFromDate ? 'border-red-500' : 'border-gray-300']"
            />
            <div v-if="errorFromDate" class="text-red-500 text-sm mt-1">
              Mục từ ngày không đúng
            </div>
          </div>

          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="inputs.toDate"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              :disabled="onSearch"
              :class="['w-full border rounded px-3 py-2', errorToDate ? 'border-red-500' : 'border-gray-300']"
            />
            <div v-if="errorToDate" class="text-red-500 text-sm mt-1">
              Mục đến ngày không đúng
            </div>
          </div>
        </template>

        <!-- Month filters -->
        <template v-if="inputs.dataBy == 'Month'">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Từ tháng <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="inputs.fromMonth"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              :disabled="onSearch"
              :class="['w-full border rounded px-3 py-2', errorFromMonth ? 'border-red-500' : 'border-gray-300']"
            />
            <div v-if="errorFromMonth" class="text-red-500 text-sm mt-1">
              Mục từ tháng không đúng
            </div>
          </div>

          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Đến tháng <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="inputs.toMonth"
              maxlength="10"
              @keyup="inputDateOnly($event.target)"
              :disabled="onSearch"
              :class="['w-full border rounded px-3 py-2', errorToMonth ? 'border-red-500' : 'border-gray-300']"
            />
            <div v-if="errorToMonth" class="text-red-500 text-sm mt-1">
              Mục đến tháng không đúng
            </div>
          </div>
        </template>

        <!-- Search button -->
        <div class="md:col-span-3">
          <label class="block text-sm font-medium text-transparent mb-1">Xem</label>
          <button
            @click.prevent="search"
            :disabled="onSearch"
            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[120px]"
          >
            Xem
          </button>
        </div>
      </div>

      <!-- Loading -->
      <span class="flex justify-center items-center py-8" v-show="loading">
        <icon name="loading" width="60" />
      </span>

      <!-- Results -->
      <div v-show="click && datas.length > 0">
        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
          <div class="mb-2 md:mb-0">Số kết quả: {{ datas.length }}</div>
          <button
            @click="handleExportExcel"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-orange-600 font-bold rounded border border-gray-300"
          >
            <b>Xuất Excel</b>
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-blue-100">
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">STT</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Ngày</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Doanh thu bán hàng</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Doanh thu khác</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Chi phí</th>
                <th class="border border-gray-300 px-4 py-3 text-left uppercase">Lợi nhuận</th>
              </tr>
            </thead>
            <tbody>
              <!-- Total Row -->
              <tr style="color: #ed592a;">
                <td class="border border-gray-300 px-4 py-2 text-center font-bold" colspan="2">
                  Tổng
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(totalRevenue) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(totalRevenueOther) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(totalFee) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right font-bold whitespace-nowrap">
                  {{ formatCurrency(totalProfit) }}
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="(data, index) in datas" :key="index">
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ data.time }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(data.revenue) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(data.revenueOther) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(data.fee) }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-right whitespace-nowrap">
                  {{ formatCurrency(data.profit) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useExcelExport } from '@/composables/useExcelExport'
import { useToast } from '@/composables/useToast';
import { useFormatters } from '@/composables/useFormatters';

export default {
  setup() {
    const { toast } = useToast();
    const { formatCurrency } = useFormatters();
    const { exportToExcel } = useExcelExport();

    return {
      toast,
      formatCurrency,
      exportToExcel
    };
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
          this.toast.error("Từ ngày không thể lớn hớn đến ngày")
          return false
        }

        if(this.inputs.dataBy == "Day") {
          fromDate.setMonth(fromDate.getMonth() + 1)

          if(fromDate < toDate) {
            this.toast.error("Thời gian không được quá 1 tháng")
            return false
          }
        }

        if(this.inputs.dataBy == "Week") {
          fromDate.setMonth(fromDate.getMonth() + 6)

          if(fromDate < toDate) {
            this.toast.error("Thời gian không được quá 6 tháng")
            return false
          }
        }
      }

      if(this.inputs.dataBy == "Month") {
        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + this.inputs.fromMonth))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD("01-" + this.inputs.toMonth))

        if(fromDate > toDate) {
          this.toast.error("Từ tháng không thể lớn hớn đến tháng")
          return false
        }

        fromDate.setMonth(fromDate.getMonth() + 12)

        if(fromDate < toDate) {
          this.toast.error("Thời gian không được quá 12 tháng")
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

    /**
     * Search
     */
    search() {

      if (this.loading) { return }
      this.click = true

      // Check validate
      if(!this.checkValidate()) {
        return
      }
      if(!this.checkFromDateAndToDate()) {
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
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)

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

    handleExportExcel() {
      this.exportToExcel(
        this.datas,
        this.excel_bill_fields,
        'Báo Cáo Lợi Nhuận',
        'bao_cao_loi_nhuan.xls'
      )
    }
  }
}
</script>

<style lang="css" scoped>
/* Scoped styles if needed */
</style>
