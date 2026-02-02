<template>
  <div class="container-fluid">

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <h4 class="mt-2 text-center text-header">Báo Cáo Bán Hàng</h4>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
                <label> Cửa hàng </label>
                <select class="form-control form-control"
                  :options="optionsStore"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  
                  v-model="inputs.store_id"
                  :disabled="onSearch">
                </select>
              </div>

            <div class="col-span-2">
              <label>
                Báo cáo theo:
              </label>
              <select class="form-control form-control"
              :options="reportByOption"
              id="status"
              type="text"
              autocomplete="new-password"
              
              v-model="inputs.reportBy"
              @change="changeReportBy">
              </select>
            </div>

            <div class="col-span-4">
              <label>
                Thời gian:
              </label>
              <div class="input-group">
                  <span class="input-group-addon pr-1">Từ</span>
                  <input
                  id="fromDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.fromDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                  <span class="input-group-addon pl-1 pr-1">Đến</span>
                  <input
                  id="toDate"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.toDate"
                  maxlength="10"
                  @keyup="inputDateOnly($event.target)">
                </div>
            </div>

            <div class="col-span-3">
              <label>
                Sắp xếp theo:
              </label>
              <select class="form-control form-control"
              :options="orderByOption"
              id="status"
              type="text"
              autocomplete="new-password"
              
              v-model="inputs.orderBy">
              </select>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mt-2">
            <div class="col-span-full">
              <button class="btn btn-outline-primary float-right px-4 btn-width-120" :disabled="onSearch" @click.prevent="search">
                Xem
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="grid grid-cols-12 gap-4" v-show="inputs.reportBy == 'bill'">
      <div class="col-span-full">

        <div class="bg-white rounded-lg shadow-md p-4">
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="grid grid-cols-12 gap-4" v-show="firstSearch == false && bills.length> 0">
            <div class="col-span-full">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-4">
                  Số kết quả: {{bills.length}}
                </div>
                <div class="col-span-8 text-right">
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "bills"
                    :fields = "excel_bill_fields"
                    worksheet = "Báo Cáo Theo Bill"
                    name    = "filename.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-full">
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Số Bill</th>
                        <th>Bàn</th>
                        <th>Tổng</th>
                        <th>Phí dịch vụ, phụ thu</th>
                        <th>Giảm Giá</th>
                        <th>% Thuế</th>
                        <th>Số Tiền Thuế</th>
                        <th>Thành Tiền</th>
                        <th>Nội dung dịch vụ, phụ thu</th>
                        <th>Nội dung Giảm Giá</th>
                        <th>Tiền mặt</th>
                        <th>Chuyển khoản</th>
                        <th>Tiền điện tử</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                          <td class="total text-center font-weight-bold" colspan="4">Tổng</td>
                          <td class="text-right total font-weight-bold">{{currencyFormat(totalPrice)}}</td>
                          <td class="text-right total font-weight-bold">{{currencyFormat(totalServicePrice)}}</td>
                          <td class="text-right total font-weight-bold">{{currencyFormat(totalDiscount)}}</td>
                          <td></td>
                          <td class="text-right total font-weight-bold">{{currencyFormat(totalVat)}}</td>
                          <td class="text-right total font-weight-bold">{{currencyFormat(totalAmount)}}</td>
                          <td></td>
                          <td></td>
                          <td class="text-right total font-weight-bold">{{currencyFormat(total_cash)}}</td>
                          <td class="text-right total font-weight-bold">{{currencyFormat(total_credit)}}</td>
                          <td class="text-right total font-weight-bold">{{currencyFormat(total_emoney)}}</td>
                      </tr>
                      <tr v-for="(bill, index) in bills">
                        <td>{{index + 1}}</td>
                        <td>{{bill.created_at}}</td>
                        <td>{{bill.bill_number}}</td>
                        <td>{{bill.table_name}}</td>
                        <td class="text-right">{{currencyFormat(bill.sub_total)}}</td>
                        <td class="text-right">{{currencyFormat(bill.service_price)}}</td>
                        <td class="text-right">{{currencyFormat(bill.discount_amount)}}</td>
                        <td class="text-right">{{bill.vat_percent}}</td>
                        <td class="text-right">{{currencyFormat(bill.vat_value)}}</td>
                        <td class="text-right">{{currencyFormat(bill.total)}}</td>
                        <td>{{bill.service_name}}</td>
                        <td>{{bill.content_discount}}</td>
                        <td class="text-right">{{currencyFormat(bill.cash)}}</td>
                        <td class="text-right">{{currencyFormat(bill.credit)}}</td>
                        <td class="text-right">{{currencyFormat(bill.e_money)}}</td>
                      </tr>


                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4" v-show="firstSearch == false && bills.length == 0">
            <div class="col-span-full text-center">
              Không tìm thấy kết quả nào
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="grid grid-cols-12 gap-4" v-show="inputs.reportBy == 'service'">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="grid grid-cols-12 gap-4" v-show="firstSearch == false && services.length> 0">
            <div class="col-span-full">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-4">
                  Số kết quả: {{services.length}}
                </div>
                <div class="col-span-8 text-right">
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "services"
                    :fields = "excel_service_fields"
                    worksheet = "Báo Cáo Theo Bill"
                    name    = "filename.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-full">
                  <table class="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Số Bill</th>
                        <th>Bàn</th>
                        <th>Tên DV</th>
                        <th>Đơn Giá</th>
                        <th>Số Lượng</th>
                        <th>Thành Tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(service, index) in services">
                        <td>{{index + 1}}</td>
                        <td>{{service.created_at}}</td>
                        <td>{{service.bill_number}}</td>
                        <td>{{service.table_name}}</td>
                        <td>{{service.service_name}}</td>
                        <td class="text-right">{{currencyFormat(service.price)}}</td>
                        <td class="text-right">{{service.quantity}}</td>
                        <td class="text-right">{{currencyFormat(service.amount)}}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold total text-center" colspan="6">Tổng</td>
                        <td class="text-right font-weight-bold total">{{currencyFormat(totalQuantity)}}</td>
                        <td class="text-right font-weight-bold total">{{currencyFormat(totalAmount)}}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold total text-center" colspan="6">Tổng phí dịch vụ, phụ thu</td>
                        <td class="text-right font-weight-bold total" colspan="2">{{currencyFormat(totalServicePrice)}}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold total text-center" colspan="6">Tổng giảm giá</td>
                        <td class="text-right font-weight-bold total" colspan="2">{{currencyFormat(totalDiscount)}}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold total text-center" colspan="6">Tổng thuế VAT: </td>
                        <td class="text-right font-weight-bold total" colspan="2">{{currencyFormat(totalVat)}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4" v-show="firstSearch == false && services.length == 0">
            <div class="col-span-full text-center">
              Không tìm thấy kết quả nào
            </div>
          </div>

        </div>

      </div>
    </div>


  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'



export default {
  components: {
  },
  data () {
    return {
      optionsStore: [],
      reportByOption: [
        {value: 'bill', text: ''},
        {value: 'bill', text: 'Bill'},
        {value: 'service', text: 'Dịch vụ'}
      ],
      orderByOption: [
        {value: 'payment_at asc', text: ''},
        {value: 'payment_at asc', text: 'Thời gian tăng dần'},
        {value: 'payment_at desc', text: 'Thời gian giảm dần'}
      ],
      inputs: {
        store_id: null,
        reportBy: "bill",
        fromDate: null,
        toDate: null,
        orderBy: "payment_at asc",
      },
      onSearch: false,
      bills: [],
      services: [],
      currentReportBy: "bill",
      firstSearch: true,
      widowHeight: 500,
      totalPrice: 0,
      totalServicePrice: 0,
      totalDiscount: 0,
      totalVat: 0,
      totalAmount: 0,
      totalQuantity: 0,
      total_cash: 0,
      total_credit: 0,
      total_emoney: 0,
      excel_bill_data: null,
      excel_bill_fields: {
        'Ngày': 'created_at',
        'Số Bill': 'bill_number',
        'Bàn' : 'table_name',
        'Tổng' : 'sub_total',
        'Phí dịch vụ, phụ thu' : 'service_price',
        'Giảm Giá' : 'discount_amount',
        '% Thuế' : 'vat_percent',
        'Số Tiền Thuế' : 'vat_value',
        'Thành Tiền' : 'total',
        'Nội dung dịch vụ, phụ thu' : 'service_name',
        'Nội dung Giảm Giá' : 'content_discount'
      },
      excel_service_fields: {
        'Ngày': 'created_at',
        'Số Bill': 'bill_number',
        'Bàn' : 'table_name',
        'Tên DV' : 'service_name',
        'Đơn Giá' : 'price',
        'Số Lượng' : 'quantity',
        'Thành Tiền' : 'amount',
      },
      loading: false,
    }
  },
  computed: {
  },
  mounted() {
    // Load store option
    this.getOptionStore()

    let dateNow = new Date().toJSON().slice(0,10)
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(dateNow)

    // Get window height
    this.widowHeight = window.innerHeight;
  },
  methods: {
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
     * Get store options
     */
    getOptionStore() {
      adminAPI.getStoreOption().then(res => {
        if(res && res.data && res.data.data) {
          this.optionsStore = res.data.data
        }
      }).catch(err => {
        // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },

    /**
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {
      if(this.inputs.fromDate == "" || this.inputs.fromDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.popToast('danger', "Mục từ ngày không đúng")
        return false
      }
      if(this.inputs.toDate == "" || this.inputs.toDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.popToast('danger', "Mục đến ngày không đúng")
        return false
      }
      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

      if(fromDate > toDate) {
        this.popToast('danger', "Từ ngày không thể lớn hớn đến ngày")
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        this.popToast('danger', "Thời gian không quá 62 ngày")
        return false
      }

      return true
    },

    /**
     * Search
     */
    search() {

      // Check validate
      if(!this.checkFromDateAndToDate()) {
        this.services = []
        this.bills = []
        return
      }

      // Check store id
      if(!this.inputs.store_id) {
        this.popToast('danger', "Vui lòng chọn cửa hàng")
        return
      }

      this.onSearch = true
      this.loading = true

      let params = {
        "store_id": this.inputs.store_id,
        "reportBy": this.inputs.reportBy,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "orderBy": this.inputs.orderBy,
      }

      // Search
      adminAPI.searchBrandBill(params).then(res => {
        if(res && res.data && res.data.data) {
          if(this.inputs.reportBy == "bill") {
            this.bills = res.data.data.data
            this.services = []
          }
          if(this.inputs.reportBy == "service") {
            this.services = res.data.data.data
            this.bills = []
          }
          this.totalPrice = res.data.data.total_price
          this.totalServicePrice = res.data.data.total_surcharge_price
          this.totalDiscount = res.data.data.total_discount
          this.totalVat = res.data.data.total_vat
          this.totalAmount = res.data.data.total_amount
          this.totalQuantity = res.data.data.total_quantity
          this.total_cash = res.data.data.total_cash
          this.total_credit = res.data.data.total_credit
          this.total_emoney = res.data.data.total_emoney
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
   * Currency format
   */
    currencyFormat(num) {
      let result = null
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
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
     * Event change report by
     */
    changeReportBy() {
      this.bills = []
      this.services = []
      this.firstSearch = true
    }

  }
}
</script>


<style lang="css" scoped>
  .label-width {
    width: 100%;
  }
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
