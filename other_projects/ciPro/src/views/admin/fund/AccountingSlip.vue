<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">Thêm Mới Phiếu Kế Toán</h4>
              </b-col>
            </b-row>
            <hr/>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày tạo<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <datepicker v-model="inputs.date_input" format="yyyy-MM-dd"
                  placeholder="yyyy-MM-dd"  input-class="datepicker-cus" @input="changeDateInput"></datepicker>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày hoạch toán<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <datepicker v-model="inputs.accounting_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Nhóm khoản thu<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select :options="incomeGroupOptions"
                               v-model="inputs.expend_income_group_id"
                               @change="changeIncomeGroup"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Loại khoản thu<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select :options="incomeTypeOptions" v-model="inputs.expend_income_type_id"
                               :disabled="!inputs.expend_income_group_id"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Đối tượng thu</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <input type="radio" v-model="inputs.object_type" name="object_type" :value="0" class="mt-2"
                         id="object_type_0">
                  <label class="ml-4 mt-1" for="object_type_0">Khách hàng</label>
                  <input type="radio" v-model="inputs.object_type" name="object_type" :value="1" class="ml-5 mt-2"
                         id="object_type_1">
                  <label class="ml-4 mt-1" for="object_type_1">Nhà cung cấp</label>
                  <input type="radio" v-model="inputs.object_type" name="object_type" :value="2" class="ml-5 mt-2"
                         id="object_type_2">
                  <label class="ml-4 mt-1" for="object_type_2">Nhân viên</label>
                  <input type="radio" v-model="inputs.object_type" name="object_type" :value="3" class="ml-5 mt-2"
                         id="object_type_3">
                  <label class="ml-4 mt-1" for="object_type_3">Khác</label>
                </div>
                <div class="input-group">
                  <!--Khách hàng-->
                  <multiselect
                    v-show="inputs.object_type==0"
                    v-model="customerSelect"
                    :options="customerOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn khách hàng--"
                    label="text"
                    track-by="text">
                  </multiselect>

                  <!--Nhà cung cấp-->
                  <multiselect
                    v-show="inputs.object_type==1"
                    v-model="supplierSelect"
                    :options="supplierOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn nhà cung cấp--"
                    label="name"
                    track-by="name">
                  </multiselect>

                  <!--Nhân viên-->
                  <multiselect
                    v-show="inputs.object_type==2"
                    v-model="staffSelect"
                    :options="staffOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn nhân viên--"
                    label="name"
                    track-by="name">
                  </multiselect>

                  <!--Đối tượng khác-->
                  <input
                    v-show="inputs.object_type==3"
                    v-model="inputs.object_other_name"
                    id="object_type_other"
                    type="text"
                    maxlength="255"
                    autocomplete="new-password"
                    class="form-control">
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Số tiền<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <input
                  id="amount"
                  type="text"
                  class="form-control"
                  v-model="inputs.amount"
                  autocomplete="new-password"
                  @keyup="integerPointAndCommaOnly($event.target)"
                  @change="changeAmount"
                  maxlength="14">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Sổ khoản thu</label>
              </b-col>
              <b-col md="9">
                <div class="input-group">
                  <b-form-select
                    :options="bankAccountOptions"
                    v-model="inputs.income_bank_account_id">
                  </b-form-select>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Sổ khoản chi</label>
              </b-col>
              <b-col md="9">
                <div class="input-group">
                  <b-form-select
                    :options="bankAccountOptions"
                    v-model="inputs.expend_bank_account_id">
                  </b-form-select>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Diễn giải nội dung<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <b-form-textarea
                  id="description"
                  v-model="inputs.description"
                  style="width:100%;"
                  rows="2"></b-form-textarea>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12" class="text-center">
                <b-button variant="outline-secondary" class="pull-left btn-width-120 mt-2" @click="back">
                  Huỷ
                </b-button>

                <b-button  v-show="!saving" variant="outline-success" class="pull-right btn-width-120 mt-2"
                           @click="save" :disabled="saving">
                  Xác nhận
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


import fundApi from '@/api/fund'
import bankAccountAPI from '@/api/bankAccount'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
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
  data () {
    return {
      inputs: {
        "type": 0,
        "object_type": null,
        "date_input": null,
        "accounting_date": null,
        "expend_income_group_id": null,
        "expend_income_type_id": null,
        "amount": 0,
        "income_bank_account_id": null,
        "expend_bank_account_id": null,
        "description": null
      },
      loadingOptions: false,
      customerSelect: {},
      customerOptions: [],
      supplierSelect: {},
      supplierOptions: [],
      staffSelect: {},
      staffOptions: [],
      bankAccountOptions: [],
      incomeGroupOptions: [],
      incomeTypeOptions: [],
      incomeTypeOptionStore: [],
      saving: false,
    }
  },
  mounted() {

    let dateNow = new Date()
    this.inputs.date_input = dateNow.toJSON().slice(0,10)
    this.inputs.accounting_date = dateNow.toJSON().slice(0,10)

    // Get options bank account
    this.getOptionRelatedFund()
  },
  methods: {



    changeIncomeGroup() {
      if(this.inputs.expend_income_group_id) {
        this.incomeTypeOptions = [{"value": null, "text": ""}]
        for(let item of this.incomeTypeOptionStore) {
          if(item.type == 2 && item.group_id == this.inputs.expend_income_group_id) {
            let typeItem = {"value": item.id, "text": item.name}
            this.incomeTypeOptions.push(typeItem)
          }
        }
      } else {
        this.incomeTypeOptions = []
      }
    },

    /**
     * Get options related fund
     */
    getOptionRelatedFund() {
      this.loadingOptions = true

      let params = {
        customers: true,
        suppliers: true,
        staffs: true,
        bank_accounts: true,
        type: 2,
        expend_income_groups: true,
        expend_income_types: true
      }

      fundApi.getOptionsRelatedFund(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.customerOptions = options.customers
          this.supplierOptions = options.suppliers
          this.staffOptions = options.staffs
          // this.bankAccountOptions = options.bank_accounts
          let bankAccounts = options.bank_accounts
          this.bankAccountOptions = [{value: null, text: ''}, {value: -1, text: 'Tiền mặt'}]
          if(bankAccounts) {
            for (let item of bankAccounts) {
              this.bankAccountOptions.push(item)
            }
          }

          this.incomeGroupOptions = []
          let income_groups = options.expend_income_groups
          for(let item of income_groups) {
            let option = {"value": item.id, "text": item.name}
            this.incomeGroupOptions.push(option)
          }

          this.incomeTypeOptions = options.expend_income_types
          this.incomeTypeOptionStore = options.expend_income_types
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
     *  Save
     */
    save () {
      switch(this.inputs.object_type) {
        case 0:
          if(this.customerSelect && this.customerSelect.value) {
            this.inputs.customer_id = this.customerSelect.value
          } else {
            this.inputs.customer_id = null
          }
          this.inputs.supplier_id = null
          this.inputs.staff_id = null
          this.inputs.object_other_name = null
          break;
        case 1:
          if(this.supplierSelect && this.supplierSelect.id) {
            this.inputs.supplier_id = this.supplierSelect.id
          } else {
            this.inputs.supplier_id = null
          }
          this.inputs.customer_id = null
          this.inputs.staff_id = null
          this.inputs.object_other_name = null
          break;
        case 2:
          if(this.staffSelect && this.staffSelect.id) {
            this.inputs.staff_id = this.staffSelect.id
          } else {
            this.inputs.staff_id = null
          }
          this.inputs.customer_id = null
          this.inputs.supplier_id = null
          this.inputs.object_other_name = null
          break;
        case 3:
          this.inputs.customer_id = null
          this.inputs.supplier_id = null
          this.inputs.staff_id = null
          break;
        default:
          this.inputs.customer_id = null
          this.inputs.supplier_id = null
          this.inputs.staff_id = null
          this.inputs.object_other_name = null
      }

      // Check validate
      let amount = (this.inputs.amount + "").replaceAll(",", "")
      if(amount == "") {
        this.popToast('danger', "Vui lòng nhập [Số tiền*]")
        return;
      }
      amount = parseInt(amount)
      if(amount < 0) {
        this.popToast('danger', "Không thể nhập [Số tiền*] âm")
        return;
      }
      this.inputs.amount = amount

      // Check ko chọn tài khoản
      if(!this.inputs.income_bank_account_id && !this.inputs.expend_bank_account_id) {
        this.popToast('danger', "Vui lòng chọn [Sổ khoản thu] hoặc [Sổ khoản chi]")
        return;
      }

      // Check trùng tài khoản qua lại
      if(this.inputs.income_bank_account_id == this.inputs.expend_bank_account_id) {
        this.popToast('danger', "Vui lòng chọn [Sổ khoản thu] khác [Sổ khoản chi]")
        return;
      }

      if(!this.inputs.expend_income_group_id) {
        this.popToast('danger', "[Nhóm phiếu] là mục bắt buộc nhập")
        return;
      }
      if(!this.inputs.expend_income_type_id) {
        this.popToast('danger', "[Loại phiếu] là mục bắt buộc nhập")
        return;
      }


      // Add
      this.saving = true
      fundApi.addAccountingSlip(this.inputs).then(res => {
        this.saving = false
        if(res != null && res.data != null){

          if (res.data.status == 200) {
            this.$router.push("/fund")
          }
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })

    },

    /**
     * Only input integer
     */
    integerPointAndCommaOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerPointAndCommaOnly(valueInput)
      item.value = result
    },

    /**
     * Back to list
     */
    back() {
      this.$router.push("/fund")
    },

    currencyFormat(num) {
      let result = ""
        if(num === 0) {
            return "0"
        }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

      changeAmount() {
        let amount = (this.inputs.amount + "").replaceAll(",", "")
        this.inputs.amount = this.currencyFormat(amount)
      },

    changeDateInput() {
      let dateNow = new Date()
      let today = dateNow.toJSON().slice(0,10)
      if(this.inputs.date_input != today && this.inputs.accounting_date == today) {
        this.inputs.accounting_date = JSON.parse(JSON.stringify(this.inputs.date_input))
      }
    }

  }
}
</script>
