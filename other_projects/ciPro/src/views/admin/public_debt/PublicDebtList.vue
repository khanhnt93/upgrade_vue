<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-250" @click="goToPay">
                Thêm phiếu thanh toán
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Nợ Phải Trả</h4>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <label>Tổng số tiền nợ phải trả: <b>{{sum_total | format_currency}}</b></label>
            </b-col>
            <b-col md="6">
              <label>Nợ phải trả quá hạn:
                <b class="text-danger">{{sum_total_out_of_date | format_currency}}</b>
              </label>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <label>Tổng số tiền nợ dự kiến:
                <b class="text-primary">{{sum_total_feature | format_currency}}</b>
              </label>
            </b-col>
            <b-col md="6">
              <label>Nợ phải trả chưa đến hạn:
                <b class="text-success">{{sum_total_not_out_of_date | format_currency}}</b>
              </label>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <label>Tiền nhà cung cấp trả dư:
                <b class="text-success">{{sum_total_over_payment | format_currency}}</b>
              </label>
              <b-button variant="outline-success" @click="showModalOverPayment">
                Cấn trừ công nợ
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="3">
              <label>Nhà cung cấp</label>
              <multiselect
                v-model="supplierSelect"
                :options="supplierOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn nhà cung cấp--"
                label="name"
                track-by="name">
              </multiselect>
            </b-col>
            <b-col md="3">
              <label>Tình trạng nợ</label>
              <b-form-select
                :options="payStatus"
                id="status"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.pay_status">
              </b-form-select>
            </b-col>
            <b-col md="3">
              <label>Tình trạng GH</label>
              <b-form-select
                :options="shippingStatus"
                id="status"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.shipping_status">
              </b-form-select>
            </b-col>
            <b-col md="3">
              <label>Số HĐ VAT vào</label>
              <input
              id="invoice_note"
              type="text"
              maxlength="20"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.invoice_note">
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
                worksheet = "Danh sách nợ phải trả"
                name    = "Danh sách nợ phải trả">
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
                    <th style="width:9%" class="text-center">Số ĐH mua</th>
                    <th style="width:18%" class="text-center">Tên NCC</th>
                    <th style="width:9%" class="text-center">Số ngày công nợ</th>
                    <th style="width:9%" class="text-center">Tổng tiền (gồm VAT)</th>
                    <th style="width:9%" class="text-center">Số tiền còn phải TT</th>
                    <th style="width:9%" class="text-center">Ngày nhập kho</th>
                    <th style="width:9%" class="text-center">Tình trạng hàng</th>
                    <th style="width:9%" class="text-center">Ngày thanh toán</th>
                    <th style="width:9%" class="text-center">Số HĐ VAT vào</th>
                    <th style="width:6%" class="text-center"></th>
                  </tr>
                  <tr v-for="(item, index) in items">
                    <td>{{index + 1}}</td>
                    <td>
                      <a :href="'/order-buy/detail/' + item.id" target='_blank' title='Chi tiết đơn hàng nhập'>
                        {{item.order_buy_number}}
                      </a>
                      <span v-show="!item.order_buy_number.includes('V')">&nbsp;&nbsp;</span>
                      <b-button variant="outline-success" @click="goToPayBySupplierId(item.supplier_id)" title="Tạo phiếu chi">
                        Thanh toán
                      </b-button>
                    </td>
                    <td>
                      <p>{{item.supplier_name}}</p>
                    </td>
                    <td>{{item.public_debt_date_number}}</td>
                    <td class="text-right">{{item.total | format_currency}}</td>
                    <td class="text-right">{{item.amount_remaining | format_currency}}</td>
                    <td>{{item.input_repo_date}}</td>
                    <td>{{item.status_str}}</td>
                    <td>{{item.payment_date }}</td>
                    <td>{{item.invoice_note}}</td>
                    <td>
                      <b-button variant="outline-danger" @click="goToIncome(item.id)" title="Xoá nợ">
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
          <p>Nhà cung cấp: <b>{{this.supplierSelect.name}}</b></p>
          <p>Tổng tiền trả dư: <b>{{this.sum_total_over_payment | format_currency}}</b></p>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col class="table-cus">
          <table class="table table-bordered table-striped">
            <tr>
                <th style="width:10%" class="text-center">STT</th>
                <th style="width:20%" class="text-center">Số ĐH mua</th>
                <th style="width:20%" class="text-center">Số ngày công nợ</th>
                <th style="width:20%" class="text-center">Tổng giá trị ĐH (gồm VAT)</th>
                <th style="width:20%" class="text-center">Số tiền còn nợ</th>
                <th style="width:10%" class="text-center"></th>
              </tr>
            <tbody>
              <tr v-for="(item, index) in items">
                <td>{{index + 1}}</td>
                <td>{{item.order_buy_number}}</td>
                <td>{{item.public_debt_date_number}}</td>
                <td class="text-right">{{item.total | format_currency}}</td>
                <td class="text-right">{{item.amount_remaining | format_currency}}</td>
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
                    @click="payOverPayment()" title="Cấn trừ công nợ" class="btn-width-120">
            Cấn trừ
          </b-button>
          <span class="loading-more" v-show="payingOverPayment"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>


<script>
import publicDebtApi from '@/api/publicDebt'
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
      supplierSelect: {},
      supplierOptions: [],
      perPage: '10',
      currentPage: '1',
      totalRow: 0,
      payStatus: [
        {value: null, text: ''},
        {value: '1', text: 'Nợ quá hạn'},
        {value: '2', text: 'Nợ chưa đến hạn'}
      ],
      shippingStatus: [
        {value: null, text: ''},
        {value: '1', text: 'Đã nhập đủ kho'},
        {value: '2', text: 'Đã nhập kho 1 phần'},
        {value: '0', text: 'Đã đặt chưa giao'},
      ],
      inputs: {
        supplier_id: null,
        pay_status: null,
        shipping_status: null,
        invoice_note: null
      },
      items: [],
      excel_fields: {
        'Số ĐH bán': 'order_buy_number',
        'Tên NCC': 'supplier_name',
        'Số ngày công nợ' : 'public_debt_date_number',
        'Tổng tiền (gồm VAT)' : 'total',
        'Số tiền còn phải TT': 'amount_remaining',
        'Ngày nhập kho': 'input_repo_date',
        'Tình trạng hàng': 'status_str',
        'Ngày thanh toán': 'payment_date',
        'Số HĐ VAT vào': 'invoice_note'
      },
      excel_items: [],
      sum_total: 0,
      sum_total_not_out_of_date: 0,
      sum_total_out_of_date: 0,
      sum_total_feature: 0,
      sum_total_over_payment: 0,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loading: false,
      currentSupplier: null,
      payingOverPayment: false,
      payForDebts: [],
    }
  },
  mounted() {
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
      publicDebtApi.getOptionsRelatedPublicDebt({}).then(res => {
        if(res != null && res.data != null && res.data.data != null) {

          // Customer
          this.supplierOptions = res.data.data.suppliers
          let itemEmpty = {"id": null, "name": null, "address": null}
          this.supplierOptions.unshift(itemEmpty)
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
      this.$router.push('/public-debt/pay')
    },

    // goToExpense(id) {
    //   window.open('/expend-from-order-buy/' + id, '_blank');
    // },

    goToPayBySupplierId(supplier_id) {
      this.$router.push({ name: 'Thanh toán nợ phải trả', params: { id: supplier_id }})
    },

    goToIncome(id) {
      // this.$router.push({url: '/income-from-order-buy/' + id, params: {money_type: 2}})
      // this.$router.push({name: 'Thêm khoản thu do xoá nợ', params: {id: id, money_type: 2}})
      window.open('/income-from-order-buy/' + id + '?isDebtRelief=1', '_blank');
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
        "supplier_id": this.supplierSelect.supplier_id ? this.supplierSelect.supplier_id : null,
        "pay_status": this.inputs.pay_status,
        "shipping_status": this.inputs.shipping_status,
        "invoice_note": this.inputs.invoice_note,
        "limit": this.pageLimit,
        "offset": this.offset
      }
      this.currentSupplier = JSON.parse(JSON.stringify(params.supplier_id))

      // Search
      publicDebtApi.searchPublicDebit(params).then(res => {
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
      publicDebtApi.searchPublicDebit(params).then(res => {
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
          this.sum_total_feature = 0
          this.sum_total_over_payment = 0
          let list_checked = []
          for(let data of datas) {
            if(data.status > 0) {
              this.sum_total += data.amount_remaining
              if (data.total_over_payment && !list_checked.includes(data.supplier_id)) {
                this.sum_total_over_payment += data.total_over_payment
                list_checked.push(data.supplier_id)
              }
              if(data.payment_date) {
                  if(new Date(data.payment_date) < new Date()) {
                      this.sum_total_out_of_date += data.amount_remaining
                  } else {
                      this.sum_total_not_out_of_date += data.amount_remaining
                  }
              }
            } else {
              this.sum_total_feature += data.amount_remaining
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
      if(!this.currentSupplier) {
        this.popToast('danger', 'Vui lòng chọn [Nhà cung cấp] cụ thể sau đó click "Tìm kiếm" để sử dụng chức năng "Cấn trừ công nợ"')
        return
      }
      if(this.currentSupplier != this.supplierSelect.supplier_id) {
        this.popToast('danger', 'Vui lòng chọn [Nhà cung cấp] cụ thể sau đó click "Tìm kiếm" để sử dụng chức năng "Cấn trừ công nợ"')
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

    payOverPayment(debt) {
      if(this.payForDebts.length == 0){
        this.popToast('danger', 'Vui lòng lựa chọn đơn hàng bạn muốn cấn trừ')
        return
      }
      this.payingOverPayment = true
      let debts = []
      for(let item of this.items) {
        if(this.payForDebts.includes(item.id)) {
          let debt = {
            order_buy_id: item.id,
            supplier_id: item.supplier_id,
            debt_total_remaining: item.amount_remaining
          }
          debts.push(debt)
        }
      }
      let params = {
        debts: debts,
        sum_total_over_payment: this.sum_total_over_payment,
      }

      // Search
      publicDebtApi.payOverPayment(params).then(res => {
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
