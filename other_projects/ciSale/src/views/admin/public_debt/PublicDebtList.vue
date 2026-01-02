<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd">
                Thêm
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Nợ Công</h4>
              <p class="text-center">(Nợ phải trả)</p>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="3">
              <label> Khách hàng </label>
              <multiselect
                v-model="customerSelect"
                :options="customerOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn khách hàng--"
                label="name"
                track-by="name"
                @input="changeCustomer">
              </multiselect>
            </b-col>
            <b-col md="3">
              <label> Tên </label>
              <input
                id="name"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_name"
                maxlength="75"
                :disabled="customerSelect.id">
            </b-col>
            <b-col md="3">
              <label> Số điện thoại </label>
              <input
                id="price"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_phone_number"
                maxlength="11"
                :disabled="customerSelect.id">
            </b-col>
            <b-col md="3">
              <label>
                Trạng thái
              </label>
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
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <div class="btn-width-120 pull-left">Số kết quả:
                <span class="text-header"><b>{{totalRow}}</b></span>
              </div>

              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "items"
                :fields = "excel_fields"
                worksheet = "Danh sách nợ phải trả"
                name    = "Danh sách nợ phải trả">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <hr>

          <b-row>
            <b-col>
              <table class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th class="text-center">STT</th>
                    <th class="text-center">Tên K.H</th>
                    <th class="text-center">Số điện thoại</th>
                    <th class="text-center">Địa chỉ</th>
                    <th class="text-center">Trạng thái</th>
                    <th class="text-center">Ngày mượn</th>
                    <th class="text-center">Ngày hẹn trả</th>
                    <th class="text-center">Tổng tiền</th>
                    <th class="text-center">Còn lại</th>
                    <th class="text-center">Lãi suất (%)</th>
                    <th class="text-center">Kỳ hạn lãi</th>
                    <th class="text-center">Thời gian tính lãi</th>
                    <th class="text-center">Số tiền lãi</th>
                    <th class="text-center">Tổng tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="total text-center font-weight-bold text-header" :colspan="7">Tổng</td>
                    <td class="text-right total font-weight-bold text-header">{{sum_total | format_currency}}đ</td>
                    <td class="text-right total font-weight-bold text-header">{{sum_remaining | format_currency}}đ</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-right total font-weight-bold text-header">{{sum_interest | format_currency}}</td>
                    <td class="text-right total font-weight-bold text-header">{{sum_amount | format_currency}}</td>
                    <td></td>
                  </tr>
                  <tr v-for="(item) in items">
                    <td>{{item.stt}}</td>
                    <td>{{item.customer_name}}</td>
                    <td>{{item.customer_phone_number}}</td>
                    <td>{{item.customer_address}}</td>
                    <td>{{item.status_str}}</td>
                    <td>{{item.created_at}}</td>
                    <td>{{item.appointment_date}}</td>
                    <td class="text-right">{{item.total | format_currency}}</td>
                    <td class="text-right">{{item.remaining | format_currency}}</td>
                    <td>{{item.interest_rate}}%</td>
                    <td>{{convertPeriodCodeToName(item.interest_period)}}</td>
                    <td>{{item.interest_period_real}}</td>
                    <td class="text-right">{{item.interest | format_currency}}</td>
                    <td class="text-right">{{item.amount | format_currency}}</td>

                    <td>
                      <b-list-group horizontal v-if="item.status === 0">
                        <b-list-group-item v-b-tooltip.hover title="Thanh toán" @click="openPayModal(item)">
                          <i class="fa fa-check-square-o text-danger" />
                        </b-list-group-item>
                        <b-list-group-item v-b-tooltip.hover title="Sửa" @click="edit(item.id)">
                          <i class="fa fa-edit" />
                        </b-list-group-item>
                        <b-list-group-item v-b-tooltip.hover title="Xoá nợ" @click="deleted(item.id, item.customer_name)">
                          <i class="fa fa-trash" />
                        </b-list-group-item>
                      </b-list-group>
                    </td>
                  </tr>

                </tbody>
              </table>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </b-card>
      </b-col>
    </b-row>


    <!--<b-modal centered hide-footer hide-header id="modal-pay">-->
      <!--<b-row>-->
        <!--<b-col>-->
          <!--<h5 class="text-center">Thanh toán</h5>-->
          <!--<hr>-->
        <!--</b-col>-->
      <!--</b-row>-->
      <!--<b-row>-->
          <!--<b-col md="12">-->
            <!--<label>-->
              <!--Số tiền còn lại-->
            <!--</label>-->
            <!--<input-->
              <!--id="remaining"-->
              <!--autocomplete="new-password"-->
              <!--class="form-control"-->
              <!--disabled-->
              <!--v-model="payData.remaining"-->
              <!--maxlength="14">-->
          <!--</b-col>-->
      <!--</b-row>-->

        <!--<b-row>-->
          <!--<b-col md="12">-->
            <!--<label>-->
              <!--Số tiền trả-->
            <!--</label>-->
            <!--<input-->
              <!--id="amount"-->
              <!--autocomplete="new-password"-->
              <!--class="form-control"-->
              <!--v-model="payData.amount"-->
              <!--@change="changeAmount()"-->
              <!--@keyup="integerOnly($event.target)"-->
              <!--maxlength="14">-->
          <!--</b-col>-->
      <!--</b-row>-->

      <!--<b-row class="form-row">-->
        <!--<b-col md="3" class="mt-2">-->
          <!--<label> Tiền mặt </label>-->
        <!--</b-col>-->
        <!--<b-col md="9">-->
          <!--<input-->
          <!--id="cash_input"-->
          <!--type="text"-->
          <!--class="form-control"-->
          <!--v-model="payData.cash"-->
          <!--autocomplete="new-password"-->
          <!--@keyup="integerOnly($event.target)"-->
          <!--@change="changeCash()"-->
          <!--maxlength="14">-->
        <!--</b-col>-->
      <!--</b-row>-->

      <!--<b-row class="form-row">-->
        <!--<b-col md="3" class="mt-2">-->
          <!--<label> Chuyển khoản </label>-->
        <!--</b-col>-->
        <!--<b-col md="9">-->
          <!--<input-->
          <!--id="credit_input"-->
          <!--type="text"-->
          <!--class="form-control"-->
          <!--v-model="payData.credit"-->
          <!--autocomplete="new-password"-->
          <!--@change="changeCredit()"-->
          <!--@keyup="integerOnly($event.target)"-->
          <!--maxlength="14">-->
        <!--</b-col>-->
      <!--</b-row>-->

      <!--<b-row class="form-row">-->
        <!--<b-col md="3" class="mt-2">-->
          <!--<label> Tiền điện tử </label>-->
        <!--</b-col>-->
        <!--<b-col md="9">-->
          <!--<input-->
          <!--id="e_money_input"-->
          <!--type="text"-->
          <!--class="form-control"-->
          <!--v-model="payData.e_money"-->
          <!--autocomplete="new-password"-->
          <!--@change="changeEMoney()"-->
          <!--@keyup="integerOnly($event.target)"-->
          <!--maxlength="14">-->
        <!--</b-col>-->
      <!--</b-row>-->

      <!--<b-row>-->
        <!--<b-col class="text-right mt-3">-->
          <!--<button class="btn btn-primary px-4 default-btn-bg" @click="pay()">-->
            <!--Thanh toán-->
          <!--</button>-->
        <!--</b-col>-->
      <!--</b-row>-->
    <!--</b-modal>-->

    <b-modal centered hide-footer hide-header id="modal-pay">
      <b-row>
        <b-col>
          <h5 class="text-center">Thanh toán</h5>
          <hr>
        </b-col>
      </b-row>
      <b-row>
          <b-col md="12">
            <label>
              Số tiền còn lại: <b>{{payData.remaining | format_currency}}đ</b>
            </label>
          </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <label>
            Lãi suất: {{payData.interest_rate}}%
          </label>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <label>
            Kỳ hạn: {{payData.interest_period}}
          </label>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <label>
            Thời gian tính lãi: {{payData.interest_period_real}}
          </label>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <label>
            Số tiền lãi: <b>{{payData.interest | format_currency}}đ</b>
          </label>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <label>
            Tổng tiền phải trả:
            <b class="text-header">{{payData.total_amount | format_currency}}đ</b>
          </label>
        </b-col>
      </b-row>
      <b-row>
          <b-col md="12">
            <label>
              Số tiền trả
            </label>
            <input
              id="amount"
              autocomplete="new-password"
              class="form-control"
              v-model="payData.amount"
              @keyup="integerOnly($event.target)"
              @change="changeAmount()"
              maxlength="14">
          </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label> Tiền mặt </label>
        </b-col>
        <b-col md="9">
          <input
          id="cash_input"
          type="text"
          class="form-control"
          v-model="payData.cash"
          autocomplete="new-password"
          @keyup="integerOnly($event.target)"
          @change="changeCash()"
          maxlength="14">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label> Chuyển khoản </label>
        </b-col>
        <b-col md="9">
          <input
          id="credit_input"
          type="text"
          class="form-control"
          v-model="payData.credit"
          autocomplete="new-password"
          @keyup="integerOnly($event.target)"
          @change="changeCredit()"
          maxlength="14">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label> Tiền điện tử </label>
        </b-col>
        <b-col md="9">
          <input
          id="e_money_input"
          type="text"
          class="form-control"
          v-model="payData.e_money"
          autocomplete="new-password"
          @keyup="integerOnly($event.target)"
          @change="changeEMoney()"
          maxlength="14">
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="pay()">
            Thanh toán
          </button>
        </b-col>
      </b-row>
    </b-modal>

  </div>
</template>
<script>
import debitAPI from '@/api/debt'
import tradeApi from '@/api/trade'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Multiselect
  },
  data () {
    return {
      loadingGetOptions: false,
      customerSelect: {},
      customerOptions: [],
      perPage: '10',
      currentPage: '1',
      totalRow: 0,
      status: [
        {value: '', text: ''},
        {value: '0', text: 'Đang nợ'},
        {value: '1', text: 'Đã thanh toán'}
      ],
      inputs: {
        customer_id: null,
        customer_name: null,
        customer_phone_number: null,
        status: 0,
      },
      items: [],
      sum_total: 0,
      sum_remaining: 0,
      sum_interest: 0,
      sum_amount: 0,
      excel_fields: {
        'Tên KH': 'customer_name',
        'Số Điện thoại' : 'customer_phone_number',
        'Địa chỉ' : 'customer_address',
        'Trạng thái': 'status_str',
        'Ngày hẹn trả': 'appointment_date',
        'Số tiền gốc': 'total',
        'Còn lại': 'remaining',
        'Lãi suất': 'interest_rate',
        'Kỳ hạn': 'interest_period',
        'Thời gian tính lãi': 'interest_period_real',
        'Số tiền lãi': 'interest',
        'Tổng tiền': 'amount',
        'Mô tả': 'description',
      },
      payData: {
        id: null,
        customer_id: null,
        customer_name: null,
        customer_phone_number: null,
        customer_address: null,
        amount: 0,
        remaining: 0,
        interest_rate: 0,
        interest_period: 'month',
        interest_period_real: null,
        interest: 0,
        total_amount: 0,
        cash: 0,
        credit: 0,
        e_money: 0
      },
      loading: false,
      onSearch: false,
    }
  },
  computed: {
  },
  mounted() {

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // Load list when load page
    this.prepareToSearch()
  },
  methods: {
    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.items = []

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
     * Make toast with title
     */
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: 3000
      })
    },

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated() {
      this.loadingGetOptions = true
      let params = {
        "customers": true
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // customers
          if(params.customers) {
            this.customerOptions = options.customers
            this.customerOptions.unshift({"id": null, "name": ''})
          }
        }
        this.loadingGetOptions = false
      }).catch(err => {
        this.loadingGetOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Event change customer
     */
    changeCustomer() {
      if(this.customerSelect && this.customerSelect.id) {
        this.inputs.customer_id = this.customerSelect.id
        this.inputs.customer_name = this.customerSelect.name
        this.inputs.customer_phone_number = this.customerSelect.phone_number
      } else {
        this.inputs.customer_name = null
        this.inputs.customer_phone_number = null
      }
    },

    /**
     *  Delete
     */
    deleted (id, name) {

      this.$bvModal.msgBoxConfirm('Xóa nợ [' + name + "]. Bạn có chắc không?", {
        title: false,
        buttonSize: 'sm',
        centered: true, size: 'sm',
        footerClass: 'p-2'
      }).then(res => {
        if(res){
          debitAPI.reliefPublicDebt(id).then(res => {
            if(res != null && res.data != null) {
              this.prepareToSearch()
              this.popToast('success', 'Xóa nợ thành công!!!')
            }

          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      })
    },

    /**
     *  Go to edit
     */
    edit (id) {
      this.$router.push('/public-debt/edit/' + id)
    },

    openPayModal(pay) {
      this.payData.id = pay.id;
      this.payData.customer_id = pay.customer_id;
      this.payData.customer_name = pay.customer_name;
      this.payData.customer_phone_number = pay.customer_phone_number;
      this.payData.customer_address = pay.customer_address;
      let payMoney = JSON.parse(JSON.stringify(this.currencyFormat(pay.remaining)))
      this.payData.remaining = payMoney
      this.payData.interest_rate = pay.interest_rate
      this.payData.interest_period = pay.interest_period
      this.payData.interest_period_real = pay.interest_period_real
      this.payData.interest = pay.interest
      this.payData.total_amount = pay.amount
      this.payData.amount = JSON.parse(JSON.stringify(this.currencyFormat(pay.amount)))
      this.payData.cash = JSON.parse(JSON.stringify(this.currencyFormat(pay.amount)))

      this.$bvModal.show('modal-pay')
    },

    /**
     * Thanh toán
     */
    pay() {
      if (this.payData.amount <= 0) {
        this.popToast('danger', 'Số tiền trả phải lớn hơn 0')
        return;
      }

      try {
        if(parseInt((this.payData.amount + '').replaceAll(",", ""))
            != parseInt((this.payData.cash + '').replaceAll(",", ""))
            + parseInt((this.payData.credit + '').replaceAll(",", ""))
            + parseInt((this.payData.e_money + '').replaceAll(",", ""))) {
          this.popToast('danger', "Tổng loại tiền phải bằng số tiền thanh toán")
          return
        }
      } catch(err) {
        this.popToast('danger', 'Vui lòng nhập loại tiền')
      }

      this.payData.remaining = (this.payData.remaining + '').replaceAll(",", "")
      this.payData.amount = (this.payData.amount + '').replaceAll(",", "")
        this.payData.remaining = (this.payData.remaining + '').replaceAll(",", "")
        this.payData.cash = (this.payData.cash + '').replaceAll(",", "")
        this.payData.credit = (this.payData.credit + '').replaceAll(",", "")
        this.payData.e_money = (this.payData.e_money + '').replaceAll(",", "")

      debitAPI.payPublicDebt(this.payData).then(res => {
        if(res != null && res.data != null) {
          this.prepareToSearch()
        }
        this.payData.id = null
        this.payData.customer_id = null
        this.payData.customer_name = null
        this.payData.customer_phone_number = null
        this.payData.customer_address = null
        this.payData.amount = 0
        this.payData.remaining = 0
        this.payData.credit = 0
        this.payData.cash = 0
        this.payData.e_money = 0
        this.$bvModal.hide('modal-pay')
        this.popToast('success', 'Đã thanh toán thành công!!')
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    convertPeriodCodeToName(code) {
      if (code == 'day') {
        return "Ngày"
      }
      if (code == 'year') {
        return "Năm"
      }
      return "Tháng"
    },

    /**
     *  Go to add
     */
    goToAdd () {
      this.$router.push('/public-debt/add')
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

      // Search
      debitAPI.searchPublicDebit(this.inputs).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data.public_debt;
          this.sum_total = res.data.data.sum_total;
          this.sum_remaining = res.data.data.sum_remaining;
          this.sum_interest = res.data.data.sum_interest;
          this.sum_amount = res.data.data.sum_amount;
          this.totalRow = this.items.length;
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

      /**
     *  Tính toán tổng tiền
     */
      calcTotal() {
          this.totalMoney = 0
          this.totalMoneyRemaining = 0
          if(this.items.length > 0) {
              for(let i in this.items) {
                  this.totalMoney += this.items[i].total
                  this.totalMoneyRemaining += this.items[i].remaining
              }
          }
      },

      changeAmount() {
         if(this.payData.amount) {
             let amount = this.payData.amount.replaceAll(",", "")
             this.payData.amount = this.currencyFormat(amount)

             this.payData.cash = this.currencyFormat(amount)
         }
      },

      changeCash() {
         if(this.payData.cash) {
             let cash = this.payData.cash.replaceAll(",", "")
             this.payData.cash = this.currencyFormat(cash)
         }
      },

      changeCredit() {
         if(this.payData.credit) {
             let credit = this.payData.credit.replaceAll(",", "")
             this.payData.credit = this.currencyFormat(credit)
         }
      },

      changeEMoney() {
         if(this.payData.e_money) {
             let e_money = this.payData.e_money.replaceAll(",", "")
             this.payData.e_money = this.currencyFormat(e_money)
         }
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

      /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

  }
}
</script>

<style lang="scss" scoped>
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
