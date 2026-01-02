<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row v-if="userRole == 'admin'">
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-250" @click="goToPay">
                Thêm phiếu thanh toán
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Nợ Phải Thu</h4>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <label>Tổng số tiền nợ phải thu: <b>{{sum_total | format_currency}}</b></label>
            </b-col>
            <b-col md="6">
              <label>Nợ phải thu chưa đến hạn:
                <b class="text-success">{{sum_total_not_out_of_date | format_currency}}</b>
              </label>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <label>Nợ phải thu quá hạn:
                <b class="text-danger">{{sum_total_out_of_date | format_currency}}</b>
              </label>
            </b-col>
            <b-col md="6">
              <label>Tiền khách trả dư:
                <b class="text-primary">{{sum_total_over_payment | format_currency}}</b>
              </label>
              <b-button variant="outline-primary" @click="showModalOverPayment">
                Cấn trừ công nợ
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col v-bind:md="userRole == 'admin' ? 4 : 6 ">
              <label>Khách hàng</label>
              <multiselect
                v-model="customerSelect"
                :options="customerOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn khách hàng--"
                label="text"
                track-by="text">
              </multiselect>
            </b-col>
            <b-col md="4" v-if="userRole == 'admin'">
              <label>NV phụ trách</label>
              <b-form-select
                  id="created_by"
                  :options="optionsStaff"
                  v-model="inputs.staff_in_charge"
                  type="text"
                  class="form-control"
                ></b-form-select>
            </b-col>
            <b-col v-bind:md="userRole == 'admin' ? 4 : 6 ">
              <label>Trạng thái</label>
              <b-form-select
                :options="status"
                id="status"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.status">
              </b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click="prepareToSearch">
                <!--<b-icon icon="search" aria-hidden="true"></b-icon>-->
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{totalRow}}</b></span></div>

              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "excel_items"
                :fields = "excel_fields"
                worksheet = "Danh sách nợ phải thu"
                name    = "Danh sách nợ phải thu">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <hr>

          <b-row>
            <b-col class="table-cus">
              <table class="table table-bordered table-striped fixed_header">
                  <tr>
                    <th style="width:4%" class="text-center">STT</th>
                    <th style="width:11%" class="text-center">Số ĐH bán</th>
                    <th style="width:11%" class="text-center">Tên K.H</th>
                    <th style="width:7%" class="text-center">Số ngày công nợ</th>
                    <th style="width:8%" class="text-center">Tổng giá trị ĐH (gồm VAT)</th>
                    <th style="width:8%" class="text-center">Số tiền còn nợ</th>
                    <th style="width:8%" class="text-center">Ngày giao hàng</th>
                    <th style="width:9%" class="text-center">Tình trạng giao hàng</th>
                    <th style="width:9%" class="text-center">Số HĐ VAT ra</th>
                    <th style="width:9%" class="text-center">Ngày thanh toán</th>
                    <th style="width:9%" class="text-center">NV phụ trách</th>
                    <th style="width:7%" class="text-center"></th>
                  </tr>
                  <tr v-for="(item, index) in items">
                    <td>{{index + 1}}</td>
                    <td>
                      <a :href="order_sell_detail_link + item.id" target='_blank' title='Chi tiết đơn hàng bán'>{{item.order_sell_number}}</a>
                      <span v-show="!item.order_sell_number.includes('V')">&nbsp;&nbsp;</span>
                      <b-button v-if="userRole == 'admin'" variant="outline-success" @click="goToPayByCustomerId(item.customer_id)" title="Tạo phiếu thu">
                        Thanh toán
                      </b-button>
                    </td>
                    <td>
                      <p>{{item.customer_name}}</p>
                    </td>
                    <td>{{item.debt_date_number}}</td>
                    <td class="text-right">{{item.total | format_currency}}</td>
                    <td class="text-right">{{item.total_remaining | format_currency}}</td>
                    <td>{{item.shipping_date}}</td>
                    <td>{{item.shipping_status_str}}</td>
                    <td>{{item.invoice_note}}</td>
                    <td>{{item.payment_date }}</td>
                    <td>{{item.staff_in_charge_name}}</td>
                    <td>
                      <b-button v-if="userRole == 'admin'" variant="outline-danger" @click="goToExpend(item.id)" title="Xoá nợ">
                        Xoá nợ
                      </b-button>
                    </td>
                  </tr>
              </table>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </b-card>
      </b-col>
    </b-row>

    <!--Cấn Trừ Công Nợ-->
    <b-modal centered hide-footer hide-header size="xl" id="modal-over-payment">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Cấn Trừ Công Nợ</h4>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col>
          <p>Khách hàng: <b>{{this.customerSelect.text}}</b></p>
          <p>Tổng tiền trả dư: <b>{{this.sum_total_over_payment | format_currency}}</b></p>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col class="table-cus">
          <table class="table table-bordered table-striped">
            <tr>
                <th style="width:10%" class="text-center">STT</th>
                <th style="width:20%" class="text-center">Số ĐH bán</th>
                <th style="width:20%" class="text-center">Số ngày công nợ</th>
                <th style="width:20%" class="text-center">Tổng giá trị ĐH (gồm VAT)</th>
                <th style="width:20%" class="text-center">Số tiền còn nợ</th>
                <th style="width:10%" class="text-center"></th>
              </tr>
            <tbody>
              <tr v-for="(item, index) in items">
                <td>{{index + 1}}</td>
                <td>{{item.order_sell_number}}</td>
                <td>{{item.debt_date_number}}</td>
                <td class="text-right">{{item.total | format_currency}}</td>
                <td class="text-right">{{item.total_remaining | format_currency}}</td>
                <td class="text-center">
                  <input type="checkbox" v-model="payForDebts" :value="item.id" />
                </td>
              </tr>

            </tbody>
          </table>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12" class="text-center">
          <b-button variant="outline-danger" class="btn-width-120"
                    @click.prevent="hideModalOverPayment">
            Đóng
          </b-button>
          <b-button v-show="!payingOverPayment" variant="outline-success" :disabled="payForDebts.length == 0"
                    @click="payOverPayment()" title="Cấn trừ công nợ"  class="btn-width-120">
            Cấn trừ
          </b-button>
          <span class="loading-more" v-show="payingOverPayment"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>


<script>
import debtApi from '@/api/debt'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Multiselect
  },
  data () {
    return {
      loadingOptions: false,
      customerSelect: {},
      customerOptions: [],
      optionsStaff: [],
      perPage: '10',
      currentPage: '1',
      totalRow: 0,
      status: [
        {value: null, text: ''},
        {value: '1', text: 'Nợ quá hạn'},
        {value: '2', text: 'Nợ chưa đến hạn'}
      ],
      inputs: {
        customer_id: null,
        staff_in_charge: null,
        status: null,
      },
      items: [],
      excel_fields: {
        'Số ĐH bán': 'order_sell_number',
        'Tên KH': 'customer_name',
        'Số ngày công nợ' : 'debt_date_number',
        'Tổng giá trị ĐH (gồm VAT)' : 'total',
        'Số tiền còn nợ': 'total_remaining',
        'Ngày giao hàng': 'shipping_date',
        'Tình trạng giao hàng': 'shipping_status_str',
        'Số HĐ VAT ra': 'invoice_note',
        'Ngày thanh toán': 'payment_date',
        'NV phụ trách': 'staff_in_charge_name'
      },
      excel_items: [],
      sum_total: 0,
      sum_total_not_out_of_date: 0,
      sum_total_out_of_date: 0,
      sum_total_over_payment: 0,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loading: false,
      userRole: 'admin',
      order_sell_detail_link: '/order-sell-all/detail/',
      currentCustomer: null,
      payingOverPayment: false,
      payForDebts: [],
    }
  },
  mounted() {
    // UI by staff
    let url = location.href
    if(url.includes("debt-sale")) {
      this.columnNumber = 6
      this.userRole = "staff"
      this.order_sell_detail_link = '/order-sell-staff/detail/'
    } else {
      this.columnNumber = 4
      this.userRole = "admin"
      this.order_sell_detail_link = '/order-sell-all/detail/'
    }

    window.addEventListener('scroll', this.onScroll)

    this.getOptions()

    // Load list when load page
    this.prepareToSearch()
  },
  methods: {
    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true
      this.isGetExcelItems = false

      this.search()
    },
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
     *  Processing on scroll: use for paging
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search ()
        }
      }
    },

      /**
     *  Get options
     */
    getOptions() {
      this.loadingOptions = true
      debtApi.getOptionsRelatedDebt({}, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          // Staff
          this.optionsStaff = [{value: null, text: ''}]

          let staffs = res.data.data.staffs
          if(staffs) {
            for (let i in staffs) {
              this.optionsStaff.push(staffs[i])
            }
          }

          // Customer
          this.customerOptions = res.data.data.customers
          let itemEmpty = {"value": null, "text": null}
          this.customerOptions.unshift(itemEmpty)
        }

        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Go to add
     */
    goToPay () {
      if(this.userRole == 'admin') {
        this.$router.push('/debt/pay')
      }
    },

    goToPayByCustomerId(customer_id) {
      if(this.userRole == 'admin') {
        this.$router.push({name: 'Thanh toán nợ phải thu', params: {id: customer_id}})
      }
    },

    goToExpend(id) {
      if(this.userRole == 'admin') {
        // this.$router.push({path: '/expend-from-order-sell/' + id, params: {money_type: 2}})
        // this.$router.push({name: 'Thêm khoản chi phí bán hàng', params: {id: id, money_type: 2}})
        window.open('/expend-from-order-sell/' + id + '?isDebtRelief=1', '_blank');
      }
    },

    /**
     *  Search
     */
    search() {
      if(this.onSearch) {
          return
      }
      this.loading = true
      this.onSearch = true
      // Define params
      let params = {
        "customer_id": this.customerSelect.value ? this.customerSelect.value : null,
        "staff_in_charge": this.inputs.staff_in_charge,
        "status": this.inputs.status,
        "limit": this.pageLimit,
        "offset": this.offset
      }
      this.currentCustomer = JSON.parse(JSON.stringify(params.customer_id))

      // Search
      debtApi.searchdebt(params, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let it = res.data.data;

          // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          if(!this.isGetExcelItems) {
            this.getExcelItem(params)
          } else {
              if(parseInt(this.offset) + parseInt(this.pageLimit) >= parseInt(this.totalRow)) {
                this.hasNext = false
              }
          }
        }
        this.loading = false
        this.onSearch = false
      }).catch(err => {
        this.loading = false
        this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    getExcelItem(params) {
      if(this.isGetExcelItems) {
        return;
      }

      this.excel_items = []

      // Define params
      params.limit = 999999

      // Search
      debtApi.searchdebt(params, this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let datas = res.data.data
          this.excel_items = datas

          // Check has next
          this.totalRow = res.data.data.length
          if(parseInt(this.offset) + parseInt(this.pageLimit) >= parseInt(this.totalRow)) {
            this.hasNext = false
          }

          // Calculate sum
          this.sum_total = 0
          this.sum_total_not_out_of_date = 0
          this.sum_total_out_of_date = 0
          this.sum_total_over_payment = 0
          let list_checked = []
          for(let data of datas) {
            this.sum_total += data.total_remaining
            if (data.total_over_payment && !list_checked.includes(data.customer_id)) {
              this.sum_total_over_payment += data.total_over_payment
              list_checked.push(data.customer_id)
            }
            if(data.payment_date) {
                if(new Date(data.payment_date) < new Date()) {
                    this.sum_total_out_of_date += data.total_remaining
                } else {
                    this.sum_total_not_out_of_date += data.total_remaining
                }
            }
          }

          this.isGetExcelItems = true
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    showModalOverPayment() {
      if(!this.currentCustomer) {
        this.popToast('danger', 'Vui lòng chọn [Khách hàng] cụ thể sau đó click "Tìm kiếm" để sử dụng chức năng "Cấn trừ công nợ"')
        return
      }
      if(this.currentCustomer != this.customerSelect.value) {
        this.popToast('danger', 'Vui lòng chọn [Khách hàng] cụ thể sau đó click "Tìm kiếm" để sử dụng chức năng "Cấn trừ công nợ"')
        return
      }
      if(this.sum_total_over_payment == 0) {
        this.popToast('danger', 'Không có dư nợ để cấn trừ')
        return
      }
      this.$bvModal.show('modal-over-payment')
    },

    hideModalOverPayment() {
      this.$bvModal.hide('modal-over-payment')
    },

    payOverPayment() {
      if(this.payForDebts.length == 0){
        this.popToast('danger', 'Vui lòng lựa chọn đơn hàng bạn muốn cấn trừ')
        return
      }

      this.payingOverPayment = true
      let debts = []
      for(let item of this.items) {
        if(this.payForDebts.includes(item.id)) {
          let debt = {
            order_sell_id: item.id,
            customer_id: item.customer_id,
            debt_total_remaining: item.total_remaining
          }
          debts.push(debt)
        }
      }
      let params = {
        debts: debts,
        sum_total_over_payment: this.sum_total_over_payment
      }

      // Search
      debtApi.payOverPayment(params).then(res => {
        if(res != null && res.data != null && res.data.status == 200) {
          this.isGetExcelItems = false
          this.hideModalOverPayment()
          this.search()

          this.payingOverPayment = false
        }
      }).catch(err => {
        this.payingOverPayment = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

  }
}
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }
</style>
