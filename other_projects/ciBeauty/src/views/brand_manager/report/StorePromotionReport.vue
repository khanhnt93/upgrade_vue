<template>
  <div class="container-fluid">

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <h4 class="mt-2 text-center text-header">Báo Cáo Khuyến Mãi</h4>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <label> Chi nhánh </label>
              <select class="form-control form-control"
                :options="optionsStore"
                id="status"
                type="text"
                autocomplete="new-password"
                
                v-model="inputs.store_id"
                :disabled="loading">
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

            <div class="col-span-4">
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

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 mt-2">
              <button class="btn btn-outline-primary float-right px-4 btn-width-120" :disabled="onSearch" @click.prevent="search">
                Xem
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">

        <div class="bg-white rounded-lg shadow-md p-4">
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-4">
                  Số kết quả: {{orders.length}}
                </div>
                <div class="col-span-8 text-right">
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "excel_bill_data"
                    :fields = "excel_bill_fields"
                    worksheet = "Báo Cáo Khuyến Mãi"
                    name    = "bao_cao_khuyen_mai.xls">
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
                        <th>Tên khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Tổng tiền dv</th>
                        <th>Tổng giảm giá</th>
                        <th>Loại</th>
                        <th>Tên</th>
                        <th>Code</th>
                        <th>& giảm giá</th>
                        <th>Giảm giá tối đa</th>
                        <th>Trên tổng giá</th>
                        <th>Miễn phí dv</th>
                        <th>Giá trị voucher</th>
                      </tr>
                    </thead>
                    <tbody v-for="(promotions, index) in orders">
                        <tr v-for="promotion in promotions.promotions">
                          <td :rowspan="promotions.number_of_promotion" v-if="promotion.is_first">{{index + 1}}</td>
                          <td :rowspan="promotions.number_of_promotion" v-if="promotion.is_first">{{promotions.payment_at}}</td>
                          <td :rowspan="promotions.number_of_promotion" v-if="promotion.is_first">{{promotions.bill_number}}</td>
                          <td :rowspan="promotions.number_of_promotion" v-if="promotion.is_first">{{promotions.table_name}}</td>
                          <td :rowspan="promotions.number_of_promotion" v-if="promotion.is_first">{{promotions.customer_name}}</td>
                          <td :rowspan="promotions.number_of_promotion" v-if="promotion.is_first">{{promotions.customer_phone_number}}</td>
                          <td :rowspan="promotions.number_of_promotion" class="text-right" v-if="promotion.is_first">{{currencyFormat(promotions.sub_total)}}</td>
                          <td :rowspan="promotions.number_of_promotion" class="text-right" v-if="promotion.is_first">{{currencyFormat(promotions.discount_amount)}}</td>
                          <td>{{promotion.type_name}}</td>
                          <td>{{promotion.promotion_name}}</td>
                          <td>{{promotion.code}}</td>
                          <td>{{promotion.discount_percent}}</td>
                          <td>{{promotion.max_discount}}</td>
                          <td>{{promotion.discount_on_amount}}</td>
                          <td>{{promotion.service_name}}</td>
                          <td class="text-right">{{currencyFormat(promotion.value_of_voucher)}}</td>
                        </tr>

                    </tbody>
                  </table>

                </div>
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
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'



export default {
  components: {
  },
  data () {
    return {
      orderByOption: [
        {value: 't.payment_at asc', text: ''},
        {value: 't.payment_at asc', text: 'Thời gian tăng dần'},
        {value: 't.payment_at desc', text: 'Thời gian giảm dần'}
      ],
      optionsStore: [],
      inputs: {
        store_id: null,
        fromDate: null,
        toDate: null,
        orderBy: "t.payment_at asc",
      },
      onSearch: false,
      orders: [],
      currentReportBy: "bill",
      excel_bill_data: [],
      excel_bill_fields: {
        'Ngày': 'created_at',
        'Số Bill': 'bill_number',
        'Bàn' : 'table_name',
        'Tên khách hàng' : 'customer_name',
        'Số điện thoại' : 'customer_phone_number',
        'Tổng tiền dv' : 'sub_total',
        'Tổng giảm giá' : 'discount_amount',
        'Loại' : 'type_name',
        'Tên' : 'promotion_name',
        'Code' : 'code',
        'Phần trăm giảm giá' : 'discount_percent',
        'Giảm giá tối đa' : 'max_discount',
        'Trên tổng giá' : 'discount_on_amount',
        'Miễn phí dv' : 'service_name',
        'Giá trị voucher' : 'value_of_voucher'
      },
      loading: false,
    }
  },
  mounted() {
    let dateNow = new Date().toJSON().slice(0,10)
    let lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(lastMonth.getDate() + 1)
    lastMonth = lastMonth.toJSON().slice(0,10)
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(lastMonth)

    // Load store option
    this.getOptionStore()
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
     * Search
     */
    search() {

      // Check validate
      if(!this.checkFromDateAndToDate()) {
        this.orders = []
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
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "orderBy": this.inputs.orderBy,
      }

      // Search
      adminAPI.getBrandPromotionReport(params).then(res => {
        if(res && res.data && res.data.data) {
          this.orders = res.data.data

          this.handleExcelData()
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

      handleExcelData() {
        this.excel_bill_data = []
        for(let order of this.orders) {
            let promotions = order.promotions

            let index = 1
            for(let promotion of promotions) {
                let item = {
                  'payment_at': '',
                  'bill_number': '',
                  'table_name' : '',
                  'customer_name' : '',
                  'customer_phone_number' : '',
                  'sub_total' : '',
                  'discount_amount' : ''
                }
                if(index === 1) {
                    item = {
                    'payment_at': order.payment_at,
                    'bill_number': order.bill_number,
                    'table_name' : order.table_name,
                    'customer_name' : order.customer_name,
                    'customer_phone_number' : order.customer_phone_number,
                    'sub_total' : order.sub_total,
                    'discount_amount' : order.discount_amount
                  }
                }
                item.type_name = promotion.type_name
                item.promotion_name = promotion.promotion_name
                item.code = promotion.code
                item.discount_percent = promotion.discount_percent
                item.max_discount = promotion.max_discount
                item.discount_on_amount = promotion.discount_on_amount
                item.service_name = promotion.service_name
                item.value_of_voucher = promotion.value_of_voucher

                this.excel_bill_data.push(item)
                index += 1
            }

        }
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
