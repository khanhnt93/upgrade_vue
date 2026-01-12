<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h4 class="text-center text-xl font-semibold mb-4">THỐNG KÊ</h4>

        <div class="grid grid-cols-12 gap-4 items-end mb-4">
          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2"> Từ ngày </label>
            <input
              id="fromDate"
              type="text"
              autocomplete="new-password"
              :class="['w-full border rounded px-3 py-2', errorFromDate ? 'border-red-500' : 'border-gray-300']"
              v-model="inputs.fromDate"
              maxlength="10"
              @keyup="inputDateOnly($event.target)">
            <div v-if="errorFromDate" class="text-red-500 text-sm mt-1">
              Mục từ ngày không đúng
            </div>
          </div>

          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2"> Đến ngày </label>
            <input
              id="toDate"
              type="text"
              autocomplete="new-password"
              :class="['w-full border rounded px-3 py-2', errorToDate ? 'border-red-500' : 'border-gray-300']"
              v-model="inputs.toDate"
              maxlength="10"
              @keyup="inputDateOnly($event.target)">
            <div v-if="errorToDate" class="text-red-500 text-sm mt-1">
              Mục đến ngày không đúng
            </div>
          </div>

          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2"> Sắp xếp theo </label>
            <select
              id="status"
              type="text"
              autocomplete="new-password"
              class="w-full border border-gray-300 rounded px-3 py-2"
              v-model="inputs.orderBy">
              <option v-for="option in orderByOption" :key="option.value" :value="option.value">
                {{option.text}}
              </option>
            </select>
          </div>

          <div class="col-span-12 md:col-span-3">
            <label class="block mb-2 text-white">
              Xem
            </label>
            <button
              class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              :disabled="onSearch"
              @click.prevent="search"
              style="min-width: 120px"
            >
              Thống kê
            </button>
          </div>
        </div>

        <!-- Loading -->
        <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

        <div v-show="items.length > 0">
          <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-4">
              Số kết quả: {{items.length}}
            </div>
            <div class="col-span-12 md:col-span-8 text-right">
              <button
                @click="handleExportExcel"
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 inline-block font-semibold">
                Xuất Excel
              </button>
            </div>
          </div>
        </div>

        <div class="mt-4 mb-4 overflow-x-auto" v-show="click == true">
          <table v-show="items.length > 0" class="min-w-full border-collapse">
            <thead>
              <tr>
                <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-center">STT</th>
                <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-left">Phòng</th>
                <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-center">Số lượng đặt phòng</th>
                <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-center">% Số lượng</th>
                <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-right">Doanh thu</th>
                <th class="border border-gray-300 px-4 py-3 bg-blue-100 text-center">% Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.stt">
                <td class="border border-gray-300 px-4 py-2 text-center">{{item.stt}}</td>
                <td class="border border-gray-300 px-4 py-2">{{item.name}}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{item.quantity}}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{item.percent_quantity}}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">{{formatCurrency(item.amount)}}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{item.percent_amount}}</td>
              </tr>
            </tbody>
          </table>

          <p v-show="firstSearch == false && items.length <= 0" class="text-center">Không có kết quả nào</p>
        </div>

      </div>
    </div>

  </div>
</template>


<script>
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useExcelExport } from '@/composables/useExcelExport'


export default {
  setup() {
    const toast = useToast()
    const { formatCurrency } = useFormatters()
    const { exportToExcel } = useExcelExport()

    return {
      toast,
      formatCurrency,
      exportToExcel
    }
  },
  data () {
    return {
      inputs: {
        "fromDate": null,
        "toDate": null,
        "orderBy": "quantityAsc"
      },
      onSearch: false,
      click: false,
      orderByOption: [
        {value: 'quantityAsc', text: ''},
        {value: 'quantityAsc', text: 'Số lượng tăng dần'},
        {value: 'quantityDesc', text: 'Số lượng giảm dần'},
        {value: 'amountAsc', text: 'Doanh thu tăng dần'},
        {value: 'amountDesc', text: 'Doanh thu giảm dần'}
      ],
      items: [],
      loading: false,
      excel_statistic_fields: {
        'STT': 'stt',
        'Tên': 'name',
        'Số lượng đặt phòng' : 'quantity',
        '% Số lượng' : 'percent_quantity',
        'Doanh thu' : 'amount',
        '% Doanh thu' : 'percent_amount'
      },
      firstSearch: true,
    }
  },
  mounted() {
    // Get default date
    let dateNow = new Date().toJSON().slice(0,10)
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(dateNow)

    this.search()
  },
  computed: {
    errorFromDate: function () {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate: function () {
      return this.checkDate(this.inputs.toDate)
    },
  },
  methods: {
    checkDate (dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkValidate () {
      return !(this.errorFromDate || this.errorToDate)
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
     * Only input integer
     */
    intergerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {

      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

      if(fromDate > toDate) {
        this.toast.error("Từ ngày không thể lớn hơn đến ngày")
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        this.toast.error("Thời gian không quá 62 ngày")
        return false
      }

      return true
    },

    /**
     * Search
     */
    search() {
      if (this.loading) { return }
      this.click = true

      // Check validate
      if(!this.checkValidate()) {
        this.items = []
        return
      }
      if(!this.checkFromDateAndToDate()) {
        this.items = []
        return
      }
      this.loading = true
      this.onSearch = true

      let params = {
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "orderBy": this.inputs.orderBy,
      }

      // Search
      adminAPI.getStatistic(params).then(res => {
        if(res && res.data && res.data.data) {
          const responseData = res.data.data;
          this.items= responseData.map((element,index) => {
            return {stt:index+1,...element}
          })
        }

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      })
    },

    handleExportExcel() {
      this.exportToExcel(
        this.items,
        this.excel_statistic_fields,
        'Thống kê',
        'thong_ke.xls'
      )
    }
  }
}
</script>

<style lang="css" scoped>
</style>
