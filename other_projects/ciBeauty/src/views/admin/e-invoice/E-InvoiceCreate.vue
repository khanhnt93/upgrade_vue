<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Hoá Đơn Điện Tử</h4>
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
              Tổng số bill chưa liên kết HĐĐT: {{totalRow}}
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <table class="table table-bordered table-striped fixed_header">
                <thead>
                  <tr>
                    <th class="text-center">STT</th>
                    <th class="text-center">Ngày</th>
                    <th class="text-center">Số Bill</th>
                    <th class="text-center">Tên K.H</th>
                    <th class="text-center">Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(bill, index) in items">
                    <td>{{index + 1}}</td>
                    <td>{{bill.payment_at}}</td>
                    <td><a :href="'/bill/edit/'+bill.id" target="_blank">{{bill.bill_number}}</a></td>
                    <td>{{bill.customer_name}}</td>
                    <td class="text-right">{{currencyFormat(bill.total)}}</td>
                    <td class="text-center">
                      <div class="button-group" style="white-space: nowrap;">
                        <button class="btn btn-sm btn-danger ml-2" @click.prevent="showModalCancelInvoice(bill)">Bỏ qua HĐĐT</button>
                        <button class="btn btn-sm btn-primary" @click.prevent="showModalCreateInvoice(bill)">Liên kết HĐĐT</button>
                      </div>
                    </td>
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

    <!-- Modal confirm create invoice -->
    <div v-if="modalCreateInvoice" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4 my-6 overflow-hidden flex flex-col max-h-[95vh]">
          <div class="flex items-center justify-between p-4 border-b">
            <h5 class="text-xl font-bold">Xác nhận liên kết HĐĐT</h5>
            <button @click="modalCreateInvoice = false" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="p-0 overflow-y-auto flex-grow flex flex-col">
              <div class="text-center w-100">
                <span class="loading-more" v-show="loadingGetDetail"><icon name="loading" width="60" /></span>
              </div>
              <div class="d-flex flex-grow-1 h-full">
                <!-- Nửa trái: Mẫu in hóa đơn -->
                <div class="w-50 p-3 d-flex flex-column h-100 border-right overflow-y-auto">
                  <div class="receipt-container">
                    <div class="receipt-content">
                      <h4 style="font-size: 22px; text-align: center; margin-bottom: 0.3rem; margin-top: 0.3rem;">
                        <strong>BILL GỐC</strong>
                      </h4>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin: 0;">
                        <p>Số hóa đơn: {{ selectedBill.bill_number }}</p>
                        <p>Ngày: {{ getDateNow() }}</p>
                      </div>
                      <p v-if="selectedBill.customer_id" style="margin: 0;">Khách hàng: {{ selectedBill.customer_id + " - " + selectedBill.customer_name }}</p>
                      

                      <!-- Danh sách dịch vụ -->
                      <div style="font-size: 13px; margin-bottom: 0.5rem;">
                        <div style="display: flex; padding-top:5px; justify-content: space-between; font-size: 0.875rem; border-bottom: 1px solid #4d4d4d; border-top: 1px solid #4d4d4d;">
                          <div>Dịch vụ/Giá</div>
                          <div>Số lượng</div>
                          <div>Thành tiền</div>
                        </div>
                        <div v-for="(item, i) in selectedBill.services" :key="i" style="border-bottom: 1px solid #4d4d4d;">
                          <!-- Tên dịch vụ -->
                          <div>
                            {{ item.name }}
                          </div>
                          <!-- Giá / SL / Thành tiền -->
                          <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                            <div>{{ currencyFormat(item.price) }}</div>
                            <div>{{ currencyFormat(item.quantity) }}</div>
                            <div>{{ currencyFormat(item.price * item.quantity) }}</div>
                          </div>
                        </div>
                      </div>
                      <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <strong>Tổng cộng: </strong>
                        <span>{{ currencyFormat(selectedBill.sub_total) }}</span>
                      </p>
                      <p v-if="selectedBill.prepay_amount || selectedBill.card_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span>Đã thanh toán trước: </span>
                        <span>{{ currencyFormat(selectedBill.prepay_amount + selectedBill.card_amount) }}</span>
                      </p>
                      <p v-if="selectedBill.surcharge_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span>Phụ thu: </span>
                        <span>{{ currencyFormat(selectedBill.surcharge_amount) }}</span>
                      </p>
                      <p v-if="selectedBill.discount_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span>Giảm giá:</span>
                        <span>{{ currencyFormat(selectedBill.discount_amount) }}</span>
                      </p>
                      <p v-if="selectedBill.vat_value"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span>VAT:</span>
                        <span>{{ currencyFormat(selectedBill.vat_value) }}</span>
                      </p>
                      <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <strong>Thanh toán:</strong>
                        <strong>{{ currencyFormat(selectedBill.total) }}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Nửa phải: Vùng chỉnh sửa trước khi gửi lên HĐĐT  -->
                <div class="w-50 p-3 d-flex flex-column h-100 overflow-y-auto">
                  <div class="receipt-container">
                    <div class="receipt-content">
                      <h4 style="font-size: 22px; text-align: center; margin-bottom: 0.3rem; margin-top: 0.3rem;">
                        <strong>BILL HĐĐT</strong>
                      </h4>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin: 0;">
                        <p>Số hóa đơn: {{ selectedBill.bill_number }}</p>
                        <p>Ngày: {{ getDateNow() }}</p>
                      </div>
                      <p v-if="selectedBill.customer_id" style="margin: 0;">Khách hàng: {{ selectedBill.customer_id + " - " + selectedBill.customer_name }}</p>

                      <!-- Danh sách dịch vụ -->
                      <!-- TODO: load tên dv theo tên viết tắt, cho phép chỉnh sửa, bỏ bớt item -->
                      <div style="font-size: 13px; margin-bottom: 0.5rem;">
                        <div style="display: flex; padding-top:5px; justify-content: space-between; font-size: 0.875rem; border-bottom: 1px solid #4d4d4d; border-top: 1px solid #4d4d4d;">
                          <div>Dịch vụ/Giá</div>
                          <div>Số lượng</div>
                          <div>Thành tiền</div>
                        </div>
                        <div v-for="(item, index) in selectedBill.invoice_items" :key="index" style="border-bottom: 1px solid #4d4d4d;" class="mt-1">
                          <!-- Tên dịch vụ -->
                          <div class="mb-1">
                            <div class="d-flex align-items-center">
                              <button class="btn mr-2"
                                variant="outline-danger"
                                title="Bỏ dịch vụ"
                                @click="selectedBill.invoice_items.splice(index, 1)"
                              >
                                <i class="fa fa-minus" />
                              </button>
                              <input class="form-control"
                                type="text"
                                :value="item.name"
                                @input="updateName(index, $event)"
                              />
                            </div>
                          </div>
                          <!-- Giá / SL / Thành tiền -->
                          <div style="display: flex; justify-content: space-between; font-size: 0.875rem;" class="mb-1">
                            <div style="flex: 1;">
                              <div class="input-group input-group-sm" style="max-width: 150px;">
                                <div class="input-group-prepend">
                                  <span class="input-group-text">₫</span>
                                </div>
                                <input class="form-control"
                                  type="text"
                                  :value="item.price"
                                  @input="updatePrice(index, $event)"
                                  @blur="formatNumericInput(index, 'price')"
                                  @change="calculateInvoiceInfo();"
                                />
                              </div>
                            </div>
                            <div style="flex: 1;">
                              <input class="form-control"
                                  type="text"
                                  :value="item.quantity"
                                  @input="updateQuantity(index, $event)"
                                  @blur="formatNumericInput(index, 'quantity')"
                                  @change="calculateInvoiceInfo();"
                                />
                            </div>
                            <div style="flex: 1;" class="text-right">{{ currencyFormat(item.amount) }}</div>
                          </div>
                        </div>
                        <div style="border-bottom: 1px solid #4d4d4d;" class="mt-1 mb-1">
                          <button class="btn mr-2"
                            variant="outline-success"
                            title="Thêm dịch vụ"
                            @click="selectedBill.invoice_items.push({})"
                          >
                            <i class="fa fa-plus" />
                          </button>
                        </div>

                      </div>
                      <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <strong>Tổng tiền trước thuế: </strong>
                        <strong>{{ currencyFormat(selectedBill.invoice_sub_total) }}</strong>
                      </p>

                      <div style="display: flex; font-size: 0.875rem;" class="mt-1">
                        <div style="flex: 1;">Tổng tiền thuế:</div>

                        <div style="flex: 1;">
                          <input class="form-control"
                            style="width: 100%;"
                            type="text"
                            :value="selectedBill.invoice_vat_percent"
                            @input="updateVatPercent($event)"
                            @change="calculateInvoiceInfo();"
                          />
                        </div>

                        <div style="flex: 1; text-align: right;">
                          {{ currencyFormat(selectedBill.invoice_vat_value) }}
                        </div>
                      </div>

                      <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <strong>Tổng tiền sau thuế: </strong>
                        <strong>{{ currencyFormat(selectedBill.invoice_total) }}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div class="flex items-center justify-center p-4 border-t">
              <button class="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-sm"
                  @click="modalCreateInvoice = false">
                  ❌ Quay lại
                </button>

                <button class="btn rounded-pill px-4 py-2 shadow-sm ml-4" v-show="!loadingSubmitHDDT" variant="success"
                  @click="confirmCreateInvoice">
                  ✅ Xác nhận
                </button>
                <span class="loading-more" v-show="loadingSubmitHDDT"><icon name="loading" width="60" /></span>
        </div>
      </div>
    </div>

    <!-- Modal bỏ qua liên kết HĐĐT -->
    <!-- Modal bỏ qua liên kết HĐĐT -->
    <div v-if="modalCancelInvoice" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="text-center px-4 py-6">
          <!-- Custom title -->
          <h4 class="font-weight-bold mb-4 text-xl" style="color: #3b82f6;">Bỏ qua liên kết HĐĐT</h4>
          <hr>

          <p class="mb-4 font-bold text-lg">
            Bỏ qua liên kết bill [{{ selectedBill.bill_number }}] với HĐĐT. Bạn có chắc không?
          </p>

          <!-- Buttons -->
          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-sm"
              @click="modalCancelInvoice = false">
              ❌ Quay lại
            </button>

            <button class="btn btn-success rounded-pill px-4 py-2 shadow-sm"
              @click="confirmCancelInvoice(selectedBill.id)">
              ✅ Xác nhận
            </button>
          </div>
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
      modalCreateInvoice: false,
      modalCancelInvoice: false,
      selectedBill: {
        invoice_sub_total: 0,
        invoice_vat_value: 0,
        invoice_vat_percent: 0,
        invoice_total: 0,
      },
      loadingSubmitHDDT: false,
      loadingGetDetail: false,

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
      eInvoiceApi.getListBill(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let it = res.data.data.bills
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

      // Get bill detail
    getBillDetail(billId) {
      this.loadingGetDetail = true

      eInvoiceApi.getBillDetail(billId).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.selectedBill = res.data.data
          this.calculateInvoiceInfo()
        }
        this.loadingGetDetail = false
      }).catch(err => {
        this.loadingGetDetail = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // Xác nhận bỏ qua liên kết bill với HDĐT
    confirmCancelInvoice(billId) {
      eInvoiceApi.confirmCancelInvoice(billId).then(res => {
        if(res != null && res.data != null && res.data.status == 200){
          this.modalCancelInvoice = false
          this.prepareToSearch()
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // Xác nhận liên kết HDDT
    confirmCreateInvoice() {
      // Validate
      if(!this.selectedBill.invoice_items.length) {
        this.popToast('danger', "Vui lòng giữ tối thiểu 1 dịch vụ trên hoá đơn.")
        return
      }
      for(const item of this.selectedBill.invoice_items) {
        if(!item.name || item.price == "" || item.quantity == "") {
          this.popToast('danger', "Tên dịch vụ, giá, số lượng không thể trống.")
          return
        }
        if(!item.id) {
          item.id = -1
        }
        item.price = parseInt((item.price + '').replaceAll(",", ""))
        item.quantity = parseFloat((item.quantity + '').replaceAll(",", ""))
        item.amount = parseInt((item.amount + '').replaceAll(",", ""))
      }
      this.loadingSubmitHDDT = true
      eInvoiceApi.createSingleInvoice(this.selectedBill).then(res => {

        if(res != null && res.data != null && res.data.status == 200){
          this.popToast('success', "Tạo hóa đơn điện tử thành công! Bạn có thể theo dõi trạng thái hóa đơn ở màn hình [Lịch Sử Xuất HĐĐT]")
          this.modalCreateInvoice = false
          this.prepareToSearch()
        }
        this.loadingSubmitHDDT = false
      }).catch(err => {
        this.loadingSubmitHDDT = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    showModalCreateInvoice(bill) {
      this.selectedBill = bill
      this.getBillDetail(bill.id)
      this.modalCreateInvoice = true
    },

    showModalCancelInvoice(bill) {
      this.selectedBill = bill
      this.modalCancelInvoice = true
    },

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
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

    getDateNow() {
      let dateInput = this.selectedBill.order_at
      if(this.selectedBill.payment_at) {
        dateInput = this.selectedBill.payment_at
      }
      const date = new Date(dateInput)
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const mi = String(date.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
    },

    updateName(index, value) {
      this.selectedBill.invoice_items[index].name = value;
    },
    updateVatPercent(value) {
      const parsed = parseInt(value);
      if (!isNaN(parsed)) {
        this.selectedBill.invoice_vat_percent = parsed;
      }
    },
    updatePrice(index, value) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        this.selectedBill.invoice_items[index].price = parsed;
        const quantity = parseFloat((this.selectedBill.invoice_items[index].quantity + '').replaceAll(",",""))
        this.selectedBill.invoice_items[index].amount = parseInt(parsed * quantity)
      }
    },
    updateQuantity(index, value) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        this.selectedBill.invoice_items[index].quantity = parsed;
        const price = parseFloat((this.selectedBill.invoice_items[index].price + '').replaceAll(",",""))
        this.selectedBill.invoice_items[index].amount = parseInt(parsed * price)
      }
    },
    formatNumericInput(index, field) {
      let value = this.selectedBill.invoice_items[index][field];
      if(value) {
        value = this.currencyFormat((value + '').replaceAll(",", ""))
        this.selectedBill.invoice_items[index][field] = value;
      }
    },
    calculateInvoiceInfo() {
      try {
        const invoice_items = JSON.parse(JSON.stringify(this.selectedBill.invoice_items))
        for(const service of invoice_items) {
          service.price = parseInt((service.price + '').replaceAll(",", ""))
          service.quantity = parseInt((service.quantity + '').replaceAll(",", ""))
        }

        // sub_total
        const sub_total = invoice_items.reduce((total, item) => total + item.price * item.quantity, 0);
        this.selectedBill.invoice_sub_total = sub_total
        const vat_percent = parseInt((this.selectedBill.invoice_vat_percent + '').replaceAll(",", ""))
        let vat_value = 0
        if(vat_percent) {
          vat_value = parseInt(sub_total * vat_percent / 100)
        }
        console.log(vat_value)
        
        this.selectedBill.invoice_vat_percent = vat_percent
        this.selectedBill.invoice_vat_value = vat_value
        this.selectedBill.invoice_total = sub_total + vat_value
      } catch (e) {
        console.log("aaaaaaaaaaaaaaaaaaa")
        console.log(e)
        console.log("aaaaaaaaaaaaaaaaaaa")
      }
    },

  }
}
</script>
