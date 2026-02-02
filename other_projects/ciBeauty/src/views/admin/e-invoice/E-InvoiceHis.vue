<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Lịch Sử Xuất HĐĐT</h4>
            </div>
          </div>
          <hr>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
              <label>Thời gian</label>
              <select class="form-control" v-model="time_option">
                <option v-for="option in timeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-span-3">
              <label v-show="time_option != 5">
                {{time_option == 1 ? 'Từ ngày' : 'Năm' }}
              </label>
              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              <!--Thời gian năm-->
              <select class="form-control" v-show="time_option != 1 && time_option != 5" v-model="year_input">
                <option v-for="option in yearOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-span-3">
              <label v-show="time_option == 1 || time_option == 2 || time_option == 3">
                {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
              </label>

              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

              <!--Thời gian tháng -->
              <select class="form-control" v-show="time_option == 2" v-model="month_input">
                <option v-for="option in monthOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>

              <!--Thời gian quý -->
              <select class="form-control" v-show="time_option == 3" v-model="quarter_input">
                <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="col-span-3">
              <label>
                Số bill
              </label>

              <input
                  id="bill_number"
                  type="text"
                  class="form-control"
                  v-model="inputs.bill_number"
                  autocomplete="new-password"
                  maxlength="100">
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mt-2 mb-2">
            <div class="col-span-12">
              <button class="btn btn-outline-primary float-right px-4 btn-width-120" :disabled="onSearch"
              @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              Tổng số bill đã liên kết HĐĐT: {{totalRow}} <span>(Click "Tìm Kiếm" để cập nhật trạng thái hoá đơn mới nhất.)</span>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <table class="table table-bordered table-striped fixed_header table-responsive-stack">
                <thead>
                  <tr>
                    <th class="text-center">STT</th>
                    <th class="text-center">Ngày</th>
                    <th class="text-center">Số Bill</th>
                    <th class="text-center">Tên K.H</th>
                    <th class="text-center">Tổng tiền trước thuế</th>
                    <th class="text-center">Tổng tiền thuế</th>
                    <th class="text-center">Tổng tiền sau thuế</th>
                    <th class="text-center">Mã hóa đơn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(bill, index) in items">
                    <td class="text-center">{{index + 1}}</td>
                    <td class="text-center">{{bill.invoice_date}}</td>
                    <td class="text-center"><a :href="'/bill/edit/'+bill.payment_id" target="_blank">{{bill.bill_number}}</a></td>
                    <td>{{bill.customer_name}}</td>
                    <td class="text-right">{{currencyFormat(bill.total_before_tax)}}</td>
                    <td class="text-right">{{currencyFormat(bill.total_tax)}}</td>
                    <td class="text-right">{{currencyFormat(bill.total_after_tax)}}</td>
                    <td><a :href="'/e-invoice/detail/'+bill.id" target="_blank" v-if="bill.invoice_number">{{ bill.invoice_number }}</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </div>

      </div>
    </div>

  </div>
</template>


<script>
import eInvoiceApi from '@/api/eInvoice'
import commonFunc from '@/common/commonFunc'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: {
    VueDatePicker
  },
  data () {
    return {
      inputs: {
        from_date: '',
        to_date: '',
        bill_number: ''
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'payment_at',
          label: 'Ngày'
        },
        {
          key: 'bill_number',
          label: 'Số bill'
        },
        {
          key: 'customer_name',
          label: 'Tên k.H'
        },
        {
          key: 'total',
          label: 'Thành tiền'
        },
        {
          key: 'action',
          label: ''
        }
      ],
      items: [],
      pageLimit: 20,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0,
      timeOptions: [
        {"value": 1, "text": 'Ngày'},
        {"value": 2, "text": 'Tháng'},
        {"value": 3, "text": 'Quý'},
        {"value": 4, "text": 'Năm'},
        {"value": 5, "text": 'Tất cả'}
      ],
      yearOptions: [],
      quarterOptions: [
          {"value": 1, "text": 'Quý 1'},
          {"value": 2, "text": 'Quý 2'},
          {"value": 3, "text": 'Quý 3'},
          {"value": 4, "text": 'Quý 4'}
      ],
      monthOptions: [
          {"value": 1, "text": 'Tháng 1'},
          {"value": 2, "text": 'Tháng 2'},
          {"value": 3, "text": 'Tháng 3'},
          {"value": 4, "text": 'Tháng 4'},
          {"value": 5, "text": 'Tháng 5'},
          {"value": 6, "text": 'Tháng 6'},
          {"value": 7, "text": 'Tháng 7'},
          {"value": 8, "text": 'Tháng 8'},
          {"value": 9, "text": 'Tháng 9'},
          {"value": 10, "text": 'Tháng 10'},
          {"value": 11, "text": 'Tháng 11'},
          {"value": 12, "text": 'Tháng 12'}
      ],
      time_option: 1,
      year_input: 2025,
      quarter_input: 1,
      month_input: 1,
      loadingOptions: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Get default from date and to date
    this.prepareDateInput()

    // Load list when load page
    this.search()
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
     *  Processing on scroll: use for paging
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search ()
        }
      }
    },

    prepareDateInput() {
      let dateNow = new Date()
      this.inputs.to_date = dateNow.toJSON().slice(0,10)
      this.inputs.from_date = new Date(dateNow.setDate(dateNow.getDate() - 7)).toJSON().slice(0,10)
      this.year_input = dateNow.getFullYear()

      let currentYear = dateNow.getFullYear()
      this.yearOptions = []
      for (let i = currentYear; i > currentYear - 10; i--) {
          this.yearOptions.push({value: i, text: i})
      }

      this.month_input = dateNow.getMonth() + 1
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true

      this.search()
    },

    /**
     *  Search
     */
    search() {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true

      let fromDate = this.inputs.from_date
      let toDate = this.inputs.to_date

      // Handle fromDate, toDate
      if(this.time_option == 2) {
        fromDate = this.year_input + '-' + this.month_input + '-01'
        toDate = this.year_input + '-' + this.month_input + '-' + new Date(this.year_input, this.month_input, 0).getDate()
      }
      if(this.time_option == 3) {
          let quarter = commonFunc.getMonthByQuarter(this.quarter_input)
        fromDate = this.year_input + '-' + quarter + '-01'
        toDate = this.year_input + '-' + (quarter + 2) + '-' + new Date(this.year_input, (quarter + 2), 0).getDate()
      }
      if(this.time_option == 4) {
        fromDate = this.year_input + '-01-01'
        toDate = this.year_input + '-12-' + new Date(this.year_input, 12, 0).getDate()
      }
      if(this.time_option == 5) {
        toDate = new Date().toJSON().slice(0,10)
        fromDate = '2000-01-01'
      }

      let params = {
        "bill_number": this.inputs.bill_number,
        "from_date": fromDate,
        "to_date": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      eInvoiceApi.getListEInvoice(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let it = res.data.data.invoices
          this.totalRow = res.data.data.total_row

           // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          // Check has next
          if(this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }
        }else{
            this.items = []
        }
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearch = false
        this.loading = false
      })
    },

    /**
   * Currency format
   */
   currencyFormat(num) {
      let result = ""
      if(num == 0) {
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
