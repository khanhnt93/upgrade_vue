<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="card-body p-4">
            <h4 class="text-center text-header">THỐNG KÊ</h4>
            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/4 px-2">
                <label> Từ ngày </label><span class="error-sybol"></span>
                <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <div v-if="errorFromDate" class="text-red-600 text-sm mt-1">
                  Mục từ ngày không đúng
                </div>
              </div>
              <div class="w-full md:w-1/4 px-2">
                <label> Đến ngày </label><span class="error-sybol"></span>
                <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                <div v-if="errorToDate" class="text-red-600 text-sm mt-1">
                  Mục đến ngày không đúng
                </div>
              </div>
              <div class="w-full md:w-1/4 px-2">
                <label> Sắp xếp theo </label>
                <select
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.orderBy">
                  <option v-for="option in orderByOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="w-full md:w-1/4 px-2">
                <label class="label-width text-white">
                   Xem
                </label>
                <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch" @click.prevent="search">
                  Thống kê
                </button>
              </div>
            </div>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <div class="flex flex-wrap -mx-2" v-show="items.length > 0">
              <div class="w-full md:w-1/3 px-2">
                Số kết quả: {{items.length}}
              </div>
              <div class="w-full md:w-2/3 px-2 text-right">
                <button class="btn btn-default text-header" @click="exportToExcel(items, excel_statistic_fields, 'thong_ke.xls')">
                  <b>Xuất Excel</b>
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-2 mb-2" v-show="click == true">
              <div class="w-full px-2">
                <table class="table table-bordered table-striped" v-show="items.length > 0">
                  <thead>
                    <tr>
                      <th class="text-center">STT</th>
                      <th>Phòng</th>
                      <th class="text-center">Số lượng đặt phòng</th>
                      <th class="text-center">% Số lượng</th>
                      <th class="text-right">Doanh thu</th>
                      <th class="text-center">% Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in items" :key="item.stt">
                      <td class="text-center">{{ item.stt }}</td>
                      <td>{{ item.name }}</td>
                      <td class="text-center">{{ item.quantity }}</td>
                      <td class="text-center">{{ item.percent_quantity }}</td>
                      <td class="text-right">{{ currencyFormat(item.amount) }}</td>
                      <td class="text-center">{{ item.percent_amount }}</td>
                    </tr>
                  </tbody>
                </table>

                <p v-show="firstSearch == false && items.length <= 0" class="text-center">Không có kết quả nào</p>
              </div>
            </div>

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
import { useExcelExport } from '@/composables/useExcelExport'

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
      fields: [
        {
          key: 'stt',
          label: 'STT',
          tdClass: 'text-center'
        },
        {
          key: 'name',
          label: 'Phòng'
        },
        {
          key: 'quantity',
          label: 'Số lượng đặt phòng',
          tdClass: 'text-center'
        },
        {
          key: 'percent_quantity',
          label: '% Số lượng',
          tdClass: 'text-center'
        },
        {
          key: 'amount',
          label: 'Doanh thu',
          tdClass: 'text-right'
        },
        {
          key: 'percent_amount',
          label: '% Doanh thu',
          tdClass: 'text-center'
        },
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
        this.toast("Từ ngày không thể lớn hớn đến ngày", 'error')
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        this.toast("Thời gian không quá 62 ngày", 'error')
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
        this.toast(errorMess, 'error')

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      })
    },

      /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
      if(num === 0) {
          return "0"
      }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
  }
}
</script>
