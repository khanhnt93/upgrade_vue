<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">{{title_prefix}} Tạm Ứng</h4>
              </b-col>
            </b-row>
            <hr/>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Nhân viên<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <div class="input-group">
                  <multiselect
                    v-model="staffSelect"
                    :options="staffOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn nhân viên--"
                    label="text"
                    track-by="text">
                  </multiselect>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorStaff">
                    Vui lòng chọn nhân viên
                  </b-form-invalid-feedback>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày mượn<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <datepicker v-model="inputs.borrowed_date" format="yyyy-MM-dd"
                  placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorBorrowedDate">
                  Vui lòng chọn ngày mượn
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày hẹn trả<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <datepicker v-model="inputs.due_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorDueDate">
                  Vui lòng chọn ngày hẹn trả
                </b-form-invalid-feedback>
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
                  @change="changeAmount()"
                  maxlength="14">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorAmount">
                  Vui lòng nhập số tiền
                </b-form-invalid-feedback>
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
                    v-model="inputs.bank_account_id"
                    :disabled="inputs.money_type==0"
                    placeholder="--Chọn sổ khoản chi--"
                  >
                  </b-form-select>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Lý do tạm ứng</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-textarea
                    id="advance_reason"
                    rows="3"
                    v-model="inputs.advance_reason"
                  ></b-form-textarea>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button variant="outline-primary" class="pull-right btn-width-200" @click="save(true)">
                  Lưu nháp
                </b-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12" class="text-center">
                <b-button variant="outline-secondary" class="pull-left btn-width-120 mt-2" @click="back">
                  Huỷ
                </b-button>

                <b-button  v-show="!saving" variant="outline-success" class="pull-right btn-width-120 mt-2"
                           @click="save(false)" :disabled="saving">
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
      title_prefix: 'Thêm Mới',
      inputs: {
        "id": null,
        "staff_id": null,
        "staff_name": null,
        "staff_phone": null,
        "borrowed_date": null,
        "due_date": null,
        "amount": 0,
        "money_type": 1,
        "bank_account_id": null,
        "advance_reason": null
      },
      periodOptions: [
        {value: 'day', text: 'Ngày'},
        {value: 'month', text: 'Tháng'},
        {value: 'year', text: 'Năm'}
      ],
      bankAccountOptions: [],
      loadingOptions: false,
      staffSelect: {},
      staffOptions: [],
      saving: false,
      click: false
    }
  },
  computed: {
    errorStaff: function () {
      return this.checkInfo(this.staffSelect.value)
    },
    errorBorrowedDate: function () {
      return this.checkInfo(this.inputs.borrowed_date)
    },
    errorDueDate: function () {
      return this.checkInfo(this.inputs.due_date)
    },
    errorAmount: function () {
      return this.checkInfo(this.inputs.amount)
    },
  },
  mounted() {
    let dateNow = new Date()
    this.inputs.borrowed_date = dateNow.toJSON().slice(0,10)
    let dueDate = new Date(dateNow.setMonth(dateNow.getMonth() + 3))
    this.inputs.due_date = dueDate.toJSON().slice(0,10)

    // Get options related fund
    this.getOptionRelated()

    this.getLoanDetail()
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorStaff || this.errorBorrowedDate || this.errorDueDate || this.errorAmount)
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
     *  Get detail
     */
    getLoanDetail() {
      let loanId = this.$route.params.id
      if(loanId) {
        this.title_prefix = 'Cập Nhật'
        loanApi.getLoanDetail(loanId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.inputs = res.data.data
            if(this.inputs.staff_id) {
              this.getStaffById(this.inputs.staff_id)
            }
            this.inputs.amount = this.currencyFormat(this.inputs.amount)
          }
        }).catch(err => {
          // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
        })
      } else {
        this.title_prefix = 'Thêm Mới'
      }
    },

    getStaffById(staffId) {
        for(let staff of this.staffOptions) {
            if(staff.value == staffId) {
                this.staffSelect = staff
                break
            }
        }
        return {}
    },

    /**
     * Get options related fund
     */
    getOptionRelated() {
      this.loadingOptions = true

      let params = {
        loan_type: 1,
        staffs: true,
        bank_accounts: true
      }

      loanApi.getOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.staffOptions = options.staffs
          if(this.inputs.staff_id) {
            this.getStaffById(this.inputs.staff_id)
          }

          this.bankAccountOptions = options.bank_accounts
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
    save (is_draft) {
      this.click = true

      let checkValidate = this.checkValidate()
      if(!checkValidate) {
        return
      }

      this.inputs.staff_id = this.staffSelect.value
      let name_phone = this.staffSelect.text
      let name_phones = name_phone.split(" - ")
      this.inputs.staff_name = name_phones[0]
      this.inputs.staff_phone = name_phones[1]

      this.inputs.amount = (this.inputs.amount + "").replaceAll(",", "")
      if(parseInt(this.inputs.amount) <= 0) {
        this.popToast('danger', 'Vui lòng nhập số tiền')
        return
      }

      this.inputs.is_draft = false
      if(is_draft) {
        this.inputs.is_draft = true
      } else {
        if(this.inputs.money_type == 1 && !this.inputs.bank_account_id) {
          this.popToast('danger', 'Vui lòng chọn sổ khoản chi')
          return
        }
      }

      // Add
      this.saving = true
      if(this.inputs.id) {
        loanApi.updateAdvance(this.inputs).then(res => {
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
      } else {
        loanApi.addAdvance(this.inputs).then(res => {
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
      }
    },

    changeAmount() {
        let amount = (this.inputs.amount + "").replaceAll(",", "")
        this.inputs.amount = this.currencyFormat(amount)
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
      this.$router.push("/advance")
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

  }
}
</script>
