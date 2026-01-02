<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">Thanh Toán Khoản Tạm Ứng</h4>
              </b-col>
            </b-row>
            <hr/>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Khoản tạm ứng</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <p>Nhân viên: {{loan.staff_name + ' - ' + loan.staff_phone}}</p>
                <p>Ngày mượn: {{loan.borrowed_date}}</p>
                <p>Ngày hẹn trả: {{loan.due_date}}</p>
                <p>Số tiền vay: {{loan.amount | format_currency}}</p>
                <p>Còn lại: {{loan.remaining | format_currency}}</p>
              </b-col>
            </b-row>

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
                <label>Số tiền<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
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
                <label>Sổ khoản chi<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <input type="radio" v-model="inputs.money_type" name="money_type" :value="1" class="mt-2"
                         id="money_type_1">
                  <label class="ml-4 mt-1" for="money_type_1">Chuyển khoản</label>
                  <input type="radio" v-model="inputs.money_type" name="money_type" :value="0" class="ml-5 mt-2"
                         id="money_type_0">
                  <label class="ml-4 mt-1" for="money_type_0">Tiền mặt</label>
                </div>
                <div class="input-group">
                  <b-form-select
                    v-show="inputs.money_type==1"
                    :options="bankAccountOptions"
                    v-model="inputs.bank_account_id" :disabled="inputs.money_type==0">
                  </b-form-select>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Nhóm khoản chi<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select :options="expendGroupOptions"
                               v-model="inputs.expend_income_group_id"
                               @change="changeExpendGroup"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Loại khoản chi<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select :options="expendTypeOptions" v-model="inputs.expend_income_type_id"
                               :disabled="!inputs.expend_income_group_id" @change="updateDescription"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Diễn giải nội dung</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-textarea
                  id="description"
                  v-model="inputs.description"
                  style="width:100%;"
                  rows="2"></b-form-textarea>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12" class="text-center mt-2">
                <b-button variant="outline-secondary" class="btn-width-120" @click="back">
                  Huỷ
                </b-button>

                <b-button  v-show="!saving" variant="outline-success" class="pl-2 btn-width-120"
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


import loanApi from '@/api/loan'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      loan: {
        "id": null,
        "staff_id": null,
        "staff_name": null,
        "staff_phone": null,
        "borrowed_date": null,
        "due_date": null,
        "amount": 0,
        "interest_amount": 0,
        "remaining": 0
      },
      inputs: {
        "loan_id": null,
        "type": 0,
        "sub_type": 0,
        "date_input": null,
        "accounting_date": null,
        "object_other_name": null,
        "amount": 0,
        "money_type": 1,
        "bank_account_id": null,
        "expend_income_group_id": null,
        "expend_income_type_id": null,
        "description": null
      },
      loadingOptions: false,
      bankAccountOptions: [],
      expendGroupOptions: [],
      expendTypeOptions: [],
      expendTypeOptionStore: [],
      saving: false,
    }
  },
  mounted() {
    this.getLoanDetail()

    let dateNow = new Date()
    this.inputs.date_input = dateNow.toJSON().slice(0,10)
    this.inputs.accounting_date = dateNow.toJSON().slice(0,10)

    // Get options related
    this.getOptionRelated()
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
     *  Get detail
     */
    getLoanDetail() {
      let loanId = this.$route.params.id
      if(loanId) {
        loanApi.getLoanDetail(loanId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.loan = res.data.data
            let loanTemp = JSON.parse(JSON.stringify(this.loan))
            this.inputs.amount = this.currencyFormat(loanTemp.remaining)
            this.object_other_name = loanTemp.staff_name + " - " + loanTemp.staff_phone
            this.updateDescription()
          }
        }).catch(err => {
          // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Get options related fund
     */
    getOptionRelated() {
      this.loadingOptions = true

      let params = {
        bank_accounts: true,
        expend_income_groups: true,
        expend_income_types: true,
        type: 2
      }

      loanApi.getOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.bankAccountOptions = options.bank_accounts

          this.expendGroupOptions = []
          let expend_groups = options.expend_income_groups
          for(let item of expend_groups) {
            let option = {"value": item.id, "text": item.name}
            this.expendGroupOptions.push(option)
          }

          this.expendTypeOptions = []
          let expend_income_types = options.expend_income_types
          for(let item of expend_income_types) {
            let option = {"value": item.id, "text": item.name}
            this.expendTypeOptions.push(option)
          }
          this.expendTypeOptionStore = JSON.parse(JSON.stringify(options.expend_income_types))

          let expend_group_code = 'khoan_tam_ung'
          for(let item of expend_groups) {
            if(item.code == expend_group_code) {
              this.inputs.expend_income_group_id = item.id
              this.changeExpendGroup()
              break
            }
          }

        }
        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    updateDescription() {
        try {
            let description_str = ""

            if (this.inputs.expend_income_type_id && this.expendTypeOptions.length > 0) {
                description_str = commonFunc.getTextByValueOfSelectedBox(this.expendTypeOptions, this.inputs.expend_income_type_id)
            }

            if(!description_str) {
              description_str = "Thu tiền tạm ứng"
            }

            description_str += ": " + this.loan.staff_name + ' - ' + this.loan.staff_phone

            this.inputs.description = description_str
        } catch(err) {
          console.log(err)
        }
    },

    /**
     *  Save
     */
    save () {
      // Check validate
      if(this.inputs.money_type == 0 || this.inputs.money_type == 2) {
        this.inputs.bank_account_id = -1
      } else {
          if(!this.inputs.bank_account_id) {
            this.popToast('danger', "[Sổ khoản chi] là mục bắt buộc nhập")
            return;
          }
      }
      if(!this.inputs.expend_income_group_id) {
        this.popToast('danger', "[Nhóm khoản chi] là mục bắt buộc nhập")
        return;
      }
      if(!this.inputs.expend_income_type_id) {
        this.popToast('danger', "[Loại Khoản chi] là mục bắt buộc nhập")
        return;
      }

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
      this.inputs.loan_id = this.loan.id
      this.inputs.object_other_name = this.loan.staff_name + ' - ' + this.loan.staff_phone

      // Add
      this.saving = true
      loanApi.addAdvancePayment(this.inputs).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.$router.push("/advance")
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

      changeAmount() {
        let amount = (this.inputs.amount + "").replaceAll(",", "")
        this.inputs.amount = this.currencyFormat(amount)
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
     * Back to list
     */
    back() {
      this.$router.push("/advance")
    },

    changeExpendGroup() {
      if(this.inputs.expend_income_group_id) {
        this.expendTypeOptions = [{"value": null, "text": ""}]
        for(let item of this.expendTypeOptionStore) {
          if(item.group_id == this.inputs.expend_income_group_id) {
            let typeItem = {"value": item.id, "text": item.name}
            this.expendTypeOptions.push(typeItem)

            if(item.name == 'Hoàn ứng') {
              this.inputs.expend_income_type_id = item.id
              this.updateDescription()
            }
          }
        }
      } else {
        this.expendTypeOptions = []
      }
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
