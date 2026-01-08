<template>
  <div class="container-fluid">

    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
              <h4 class="mt-2 text-center text-header">Báo Cáo Xóa Bill</h4>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="3">
              <label> Cửa hàng </label>
              <b-form-select
                :options="optionsStore"
                id="status"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.store_id"
                :disabled="onSearch">
              </b-form-select>
            </b-col>

            <b-col md="3">
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
            </b-col>

            <b-col md="3">
              <label>
                Sắp xếp theo:
              </label>
              <b-form-select
              :options="orderByOption"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.orderBy">
              </b-form-select>
            </b-col>

            <b-col md="3">
              <label class="label-width text-white">
                 Lọc
              </label>
              <b-button variant="primary" class="pull-right px-4 default-btn-bg btn-width-120" :disabled="onSearch" @click.prevent="search">
                Xem
              </b-button>
            </b-col>
          </b-row>
        </b-card>

      </b-col>
    </b-row>

    <b-row>
      <b-col>

        <b-card >
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <b-row>
            <b-col>
              <b-row>
                <b-col md="4">
                  Số kết quả: {{bills.length}}
                </b-col>
                <b-col md="8" class="text-right">
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "bills"
                    :fields = "excel_bill_fields"
                    worksheet = "Báo Cáo Xóa Bill"
                    name    = "bao_cao_xoa_bill.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Số Bill</th>
                        <th>Bàn</th>
                        <th>Tổng tiền món</th>
                        <th>Phí dv, phụ thu</th>
                        <th>Giảm Giá</th>
                        <th>Thuế</th>
                        <th>Thành Tiền</th>
                        <th>Tiền mặt</th>
                        <th>Chuyển khoản</th>
                        <th>Tiền điện tử</th>
                        <th>Người xóa</th>
                        <th>Thời gian xóa</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(bill, index) in bills">
                        <td>{{index + 1}}</td>
                        <td>{{bill.created_at}}</td>
                        <td>{{bill.bill_number}}</td>
                        <td>{{bill.table_name}}</td>
                        <td class="text-right">{{currencyFormat(bill.sub_total)}}</td>
                        <td class="text-right">{{currencyFormat(bill.service_amount)}}</td>
                        <td class="text-right">{{currencyFormat(bill.discount_amount)}}</td>
                        <td class="text-right">{{currencyFormat(bill.vat_value)}}</td>
                        <td class="text-right">{{currencyFormat(bill.total)}}</td>
                        <td class="text-right">{{currencyFormat(bill.cash)}}</td>
                        <td class="text-right">{{currencyFormat(bill.credit)}}</td>
                        <td class="text-right">{{currencyFormat(bill.e_money)}}</td>
                        <td>{{bill.delete_by}}</td>
                        <td>{{bill.delete_at}}</td>
                        <td>{{bill.note}}</td>
                      </tr>
                    </tbody>
                  </table>

                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>

      </b-col>
    </b-row>


  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import JsonExcel from 'vue-json-excel'


export default {
  components: {
    'downloadExcel': JsonExcel
  },
  data () {
    return {
      optionsStore: [],
      orderByOption: [
        {value: 'b.created_at asc', text: ''},
        {value: 'b.created_at asc', text: 'Thời gian tăng dần'},
        {value: 'b.created_at desc', text: 'Thời gian giảm dần'}
      ],
      inputs: {
        store_id: null,
        fromDate: null,
        toDate: null,
        orderBy: "b.created_at asc",
      },
      onSearch: false,
      bills: [],
      currentReportBy: "bill",
      excel_bill_data: null,
      excel_bill_fields: {
        'Ngày': 'created_at',
        'Số Bill': 'bill_number',
        'Bàn' : 'table_name',
        'Tổng tiền món' : 'sub_total',
        'Phí dv, phụ thu' : 'service_amount',
        'Giảm Giá' : 'discount_amount',
        'Số Tiền Thuế' : 'vat_value',
        'Thành Tiền' : 'total',
        'Người xóa' : 'delete_by',
        'Thời gian xóa' : 'delete_at',
          'Ghi chú' : 'note',
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
    let lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(lastMonth.getDate() + 1)
    lastMonth = lastMonth.toJSON().slice(0,10)
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(lastMonth)
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
      // Check store id
      if(!this.inputs.store_id) {
        this.popToast('danger', "Vui lòng chọn cửa hàng")
        return
      }

      // Check validate
      if(!this.checkFromDateAndToDate()) {
        this.bills = []
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
      adminAPI.searchBrandDeleteBill(params).then(res => {
        if(res && res.data && res.data.data) {
          this.bills = res.data.data
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
