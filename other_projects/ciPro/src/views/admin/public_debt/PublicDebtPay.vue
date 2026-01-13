<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">Thanh Toán Nợ Phải Trả</h4>
              </b-col>
            </b-row>
            <hr/>

            <b-row class="form-row mt-2">
              <b-col md="3">
                <label>Nhà cung cấp<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <div class="input-group">
                  <multiselect
                    v-model="supplierSelect"
                    :options="supplierOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn nhà cung cấp--"
                    label="name"
                    track-by="name"
                    @input="changeSupplier">
                  </multiselect>
                </div>

              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <!-- Loading -->
                <span class="loading-more" v-show="loading"><icon name="loading" width="60"/></span>
              </b-col>
            </b-row>

            <b-row class="mt-3" v-show="supplierSelect.id">
              <b-col md="12" class="bg-info bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin đơn hàng</span>
                </h5>
              </b-col>
            </b-row>

            <b-row v-show="supplierSelect.value">
              <b-col md="3" class="mt-2">
                <label>Ngày ghi nhận tiền<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <datepicker v-model="debt.date_input" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              </b-col>
            </b-row>

            <b-row class="mt-2" v-show="supplierSelect.id">
              <b-col class="table-cus">
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th class="text-center">STT</th>
                      <th class="text-center">Số ĐH nhập</th>
                      <th class="text-center">Tên nhà cung cấp</th>
                      <th class="text-center">Số tiền còn nợ</th>
                      <th class="text-center">Số tiền thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in debtList">
                      <td>{{index + 1}}</td>
                      <td>{{item.order_buy_number}}</td>
                      <td>{{item.supplier_name}}</td>
                      <td class="text-right">{{item.amount_remaining | format_currency}}</td>
                      <td>
                        <input
                        :id="'total_' + index"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        :value="item.total"
                        @keyup="integerPointAndCommaOnly($event.target)"
                        @change="changeTotal(index)">
                      </td>
                    </tr>
                  </tbody>
                </table>
              </b-col>
            </b-row>

            <b-row class="mt-3" v-show="supplierSelect.id">
              <b-col md="12" class="bg-success bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin thanh toán</span>
                </h5>
              </b-col>
            </b-row>

            <b-row v-show="supplierSelect.id">
              <b-col md="3" class="mt-2">
                <label>Ngày ghi nhận tiền<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <datepicker v-model="debt.date_input" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              </b-col>
            </b-row>

            <b-row v-show="supplierSelect.id">
              <b-col md="3" class="mt-2">
                <label>Số tiền thanh toán<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="amount_pay"
                  type="text"
                  class="form-control"
                  v-model="debt.amount_pay"
                  autocomplete="new-password"
                  maxlength="14"
                  @keyup="integerPointAndCommaOnly($event.target)"
                  @change="changeAmountPay">
              </b-col>
            </b-row>

            <b-row v-show="supplierSelect.id">
              <b-col md="3" class="mt-2">
                <label>Thanh toán vào</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select
                  id="created_by"
                  :options="bankAccountOptions"
                  v-model="debt.bank_account_id"
                  type="text"
                  class="form-control"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row v-show="supplierSelect.id">
              <b-col md="3" class="mt-2">
                <p>Số tiền còn lại</p>
              </b-col>
              <b-col md="9" class="mt-2">
                <p><b class="text-header">{{debt.remaining | format_currency}}đ</b></p>
              </b-col>
            </b-row>

            <b-row v-show="supplierSelect.id">
              <b-col md="3" class="mt-2">
                <label>Ghi chú</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-textarea
                  id="note"
                  v-model="debt.note"
                  style="width:100%;"
                  rows="3"></b-form-textarea>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button v-show="!saving" variant="outline-success" style="height: 50px; width: 240px" @click="confirmPayment"
                          :disabled="saving || debt.amount_pay <= 0">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

  </div>

</template>
<script>


import publicDebtApi from '@/api/publicDebt'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
  components: {
    Datepicker,
    Multiselect
  },
  data() {
    return {
      loadingOptions: false,
      supplierSelect: {},
      supplierOptions: [],
      bankAccountOptions: [],
      debt: {
        supplier_id: null,
        date_input: null,
        amount_pay: 0,
        bank_account_id: -1,
        remaining: 0,
        note: null
      },
      debtList: [],
      saving: false,
      loading: false,
      loadingPayment: false,

    }
  },
  mounted() {
    let dateNow = new Date()
    this.debt.date_input = dateNow.toJSON().slice(0,10)

    // Get list customer option
    this.getOptions()
  },
  methods: {



    /**
     *  Get options
     */
    getOptions() {
      this.loadingOptions = true
      publicDebtApi.getOptionsRelatedPublicDebt({'supplier-all': true}).then(res => {
        if(res != null && res.data != null && res.data.data != null) {

          // Customer
          this.supplierOptions = res.data.data.suppliers
          let itemEmpty = {"id": null, "name": null, "address": null}
          this.supplierOptions.unshift(itemEmpty)

            let supplier_id = this.$route.params.id
            if(supplier_id) {
                for (let supplier of this.supplierOptions) {
                    if(supplier.id == supplier_id) {
                        this.supplierSelect = supplier
                        break
                    }
                }
                this.debt.supplier_id = supplier_id
                // Get lại danh sách các khoản vay
                this.getListPublicDebtBySupplier()
            }

          this.bankAccountOptions = res.data.data.bank_accounts
          this.bankAccountOptions.unshift({value: -1, text: 'Tiền mặt'})
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
     * Event change customer
     */
    changeSupplier() {
      if(this.supplierSelect.id) {
        this.debt.supplier_id = this.supplierSelect.id
        // Get lại danh sách các khoản vay
          this.getListPublicDebtBySupplier()
      } else {
        this.debt.supplier_id = null
      }
    },

    /**
     * Xác nhận thanh toán
     */
    confirmPayment() {
        // Format data
      this.debt.amount_pay = (this.debt.amount_pay + '').replaceAll(",", "")
      if (parseInt(this.debt.amount_pay) <= 0) {
        this.popToast('danger', 'Số tiền trả phải lớn hơn 0')
        return;
      }

      let debt_list = []
      for(let item of this.debtList) {
          item.total = (item.total + '').replaceAll(",", "")
          if(parseInt(item.total) > 0) {
              debt_list.push(item)
          }
      }

      this.saving = true
      this.debt.debt_list = debt_list
      publicDebtApi.payPublicDebtFast(this.debt).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', "Thanh toán thành công")

          // Show modal báo, reset data
          this.supplierSelect = {}
          this.debtList = []
          this.debt = {
            supplier_id: null,
            amount_pay: 0,
            bank_account_id: -1,
            remaining: 0,
            note: null
          }
          let dateNow = new Date()
          this.debt.date_input = dateNow.toJSON().slice(0,10)
        }

        this.saving = false
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // calculate() {
    //   let amount_pay = 0
    //   for(let item of this.debtList) {
    //     let item_total = (item.total + '').replaceAll(",", "")
    //     amount_pay += parseInt(item_total)
    //   }
    //   this.debt.remaining = parseInt(this.sum_remaining) - amount_pay
    //   this.debt.amount_pay = JSON.parse(JSON.stringify(amount_pay))
    // },

    changeAmountPay() {
      let amount_pay_value = parseInt((this.debt.amount_pay + "").replaceAll(",",""))
      let amount_pay_remaining =  parseInt(JSON.parse(JSON.stringify(amount_pay_value)))
      for(let item of this.debtList) {
        if(amount_pay_remaining <= 0) {
            item.total = 0
        } else {
            // let item_total = parseInt(item.total_remaining.replaceAll(",",""))
            if(amount_pay_remaining >  parseInt(item.amount_remaining)) {
              item.total = this.currencyFormat(JSON.parse(JSON.stringify(item.amount_remaining)))
              amount_pay_remaining = amount_pay_remaining - parseInt(item.amount_remaining)
            } else {
              item.total = this.currencyFormat(amount_pay_remaining)
              amount_pay_remaining = 0
            }
        }
      }

      // Tính toán số tiền còn lại
      if (this.sum_remaining >= amount_pay_value) {
        this.debt.remaining = this.currencyFormat(parseInt(this.sum_remaining) - amount_pay_value)
      } else {
        this.debt.remaining = 0
      }

      this.debt.amount_pay = this.currencyFormat(amount_pay_value)
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
     * Only input float
     */
    integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },

    /**
     * Get list debt by customer id
     */
    getListPublicDebtBySupplier() {
      if (!this.debt.supplier_id) { return }
      if(this.loading) { return }

      this.loading = true
      publicDebtApi.getPublicDebtBySupplier(this.debt.supplier_id).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.debtList = res.data.data.debts
          this.sum_remaining = res.data.data.sum_remaining
          this.debt.remaining = 0
          this.debt.amount_pay = this.currencyFormat(res.data.data.sum_total)

            // // Format
            // let note = "Thanh toán cho các đơn hàng số: "
            // for(let debt of this.debtList) {
            //     debt.total = this.currencyFormat(debt.total)
            //     note += debt.order_buy_number + " - "
            // }
            // this.debt.note = note

          // Calculate
          // this.calculate()
        } else {
          this.debtList = []
          this.sum_remaining = 0
          this.debt.remaining = 0
          this.debt.amount_pay = 0

          // Calculate
          // this.calculate()
        }
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loading = false
      })
    },

      changeTotal(index) {
        let amount_pay = 0
        for(let item_index in this.debtList) {
          let item_total = document.getElementById("total_" + item_index).value
          item_total = (item_total + "").replaceAll(",", "")
          amount_pay += parseInt(item_total)
        }
        this.debt.remaining = parseInt(this.sum_remaining) - amount_pay
        this.debt.amount_pay = this.currencyFormat(amount_pay)

        let total = document.getElementById("total_" + index).value
        total = (total + "").replaceAll(",", "")
        total = this.currencyFormat(total)
        document.getElementById("total_" + index).value = total
        this.debtList[index].total = total
      },

      /**
     * Currency format
     */
    currencyFormat(num) {
      if(num == null || num == undefined) {
        return ""
      }
      let result = ""
      if(num == 0) {
        return "0"
      }
      num = (num + "").replaceAll(",", "")
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

      /**
     * Only input integer and point
     */
    integerPointAndCommaOnly(item) {
      let valueInput = item.value
        valueInput = valueInput.replaceAll(",", "")
      let result = commonFunc.integerPointAndCommaOnly(valueInput)

        result = this.currencyFormat(result)
      item.value = result
    },

      back() {
        this.$router.push('/public-debt')
      },
  }
}
</script>

