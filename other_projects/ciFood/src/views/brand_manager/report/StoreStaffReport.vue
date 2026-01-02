<template>
  <div class="container-fluid">

    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
              <h4 class="mt-2 text-center text-header">Báo Cáo Theo Nhân Viên</h4>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="4">
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

            <b-col md="4">
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

            <b-col md="4">
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
          </b-row>

          <b-row class="mt-2">
            <b-col md="12">
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

          <b-row v-show="firstSearch == false && items.length > 0">
            <b-col>
              <b-row>
                <b-col md="4">
                  Số kết quả: {{items.length}}
                </b-col>
                <b-col md="8" class="text-right">
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "items"
                    :fields = "excel_bill_fields"
                    worksheet = "Báo Cáo Theo Nhân Viên"
                    name    = "bao_cao_theo_nhan_vien.xls">
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
                        <th>Nhân viên</th>
                        <th>Quyền</th>
                        <th>Số lần gọi món</th>
                        <th>Doanh số gọi món</th>
                        <th>Số lần tính tiền</th>
                        <th>Doanh số tính tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="3" class="text-center text-header">Tổng</td>
                        <td class="text-right text-header">{{currencyFormat(sum_quantity_order)}}</td>
                        <td class="text-right text-header">{{currencyFormat(sum_total_order)}}</td>
                        <td class="text-right text-header">{{currencyFormat(sum_quantity_payment)}}</td>
                        <td class="text-right text-header">{{currencyFormat(sum_total_payment)}}</td>
                      </tr>

                      <tr v-for="(item, index) in items">
                        <td>{{index + 1}}</td>
                        <td>{{item.staff_name}}</td>
                        <td>{{item.role_name}}</td>
                        <td class="text-right">{{currencyFormat(item.quantity_order)}}</td>
                        <td class="text-right">{{currencyFormat(item.total_order)}}</td>
                        <td class="text-right">{{currencyFormat(item.quantity_payment)}}</td>
                        <td class="text-right">{{currencyFormat(item.total_payment)}}</td>
                      </tr>
                    </tbody>
                  </table>

                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-row v-show="firstSearch == false && items.length == 0">
            <b-col class="text-center">
              Không tìm thấy kết quả nào
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
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)


export default {
  components: {
  },
  data () {
    return {
      optionsStore: [],
      orderByOption: [
        {value: 'total_payment asc', text: 'Doanh số tính tiền tăng dần'},
        {value: 'total_payment desc', text: 'Doanh số tính tiền giảm dần'},
        {value: 'quantity_payment asc', text: 'Số lần thực hiện tính tiền tăng dần'},
        {value: 'quantity_payment desc', text: 'Số lần thực hiện tính tiền giảm dần'},
        {value: 'total_order asc', text: 'Doanh số gọi món tăng dần'},
        {value: 'total_order desc', text: 'Doanh số gọi món giảm dần'},
        {value: 'quantity_order asc', text: 'Số lần thực hiện gọi món tăng dần'},
        {value: 'quantity_order desc', text: 'Số lần thực hiện gọi món giảm dần'},
      ],
      inputs: {
        store_id: null,
        reportBy: "payment",
        fromDate: null,
        toDate: null,
        orderBy: 'total_payment asc',
      },
      onSearch: false,
      items: [],
      firstSearch: true,
      excel_bill_data: null,
      excel_bill_fields: {
        'Nhân viên': 'staff_name',
        'Quyền': 'role_name',
        'Số lần gọi món' : 'quantity_order',
        'Doanh số gọi món' : 'total_order',
        'Số lần thanh toán' : 'quantity_payment',
        'Doanh số thanh toán' : 'total_payment',
      },
      loading: false,
      sum_quantity_order: 0,
      sum_total_order: 0,
      sum_quantity_payment: 0,
      sum_total_payment: 0,
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
        this.items = []
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
      adminAPI.getBrandReportByStaff(params).then(res => {
        if(res && res.data && res.data.data) {
          let datas = res.data.data
          // Handle data
            this.sum_quantity_order = 0
            this.sum_total_order = 0
            this.sum_quantity_payment = 0
            this.sum_total_payment = 0
          for (let index in datas) {
            if(datas[index].is_root && datas[index].role_name == 'ADMIN') {
              datas[index].role_name = 'Chủ nhà hàng'
            }
            if(!datas[index].is_root && datas[index].role_name == 'ADMIN') {
              datas[index].role_name = 'Quản lý'
            }
            if(!datas[index].is_root && datas[index].role_name == 'CASHIER') {
              datas[index].role_name = 'Thu ngân'
            }
            if(!datas[index].is_root && datas[index].role_name == 'KITCHEN') {
              datas[index].role_name = 'Bếp'
            }
            if(!datas[index].is_root && datas[index].role_name == 'STAFF') {
              datas[index].role_name = 'Phục vụ'
            }

            this.sum_quantity_order += parseInt(datas[index].quantity_order)
              this.sum_total_order += parseInt(datas[index].total_order)
              this.sum_quantity_payment += parseInt(datas[index].quantity_payment)
              this.sum_total_payment += parseInt(datas[index].total_payment)
          }
          this.items = datas
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
      let result = num
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
