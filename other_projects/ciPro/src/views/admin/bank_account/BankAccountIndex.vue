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
              <b-col cols="6">
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </b-button>
              </b-col>
            </b-row>

              <b-row>
                <b-col md='12'>
                  <h4 class="mt-2 text-center text-header">{{prefix_title}} Tài Khoản Ngân Hàng</h4>
                </b-col>
              </b-row>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Loại tài khoản <span class="error-sybol"></span></label>
                </b-col>
                <b-col md="9">
                  <b-form-select :options="optionsType" v-model="bankAccount.type"></b-form-select>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorType">
                    Vui lòng chọn loại tài khoản
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Tên tài khoản <span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <input
                  id="account_name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="bankAccount.account_name">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorAccountName">
                  Vui lòng nhập tên tài khoản
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Số tài khoản <span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <input
                  id="account_number"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="bankAccount.account_number">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorAccountNumber">
                  Vui lòng nhập số tài khoản
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label> Ngân hàng <span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <input
                  id="bank_name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="bankAccount.bank_name">
                <b-form-invalid-feedback  class="invalid-feedback" :state="!errorBankName">
                  Vui lòng nhập ngân hàng
                </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Là tài khoản mặc định</label>
              </b-col>
              <b-col md="9">
                <div class="input-group">
                  <input type="radio" v-model="bankAccount.is_default" name="is_default" :value="true" class="mt-2">
                  <label class="ml-4 mt-1">Có</label>
                  <input type="radio" v-model="bankAccount.is_default" name="is_default" :value="false" class="ml-5 mt-2">
                  <label class="ml-4 mt-1">Không</label>
                </div>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import bankAccountAPI from '@/api/bankAccount'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      prefix_title: "Thêm Mới",
      bankAccount: {
        "type": 1,
        "account_name": null,
        "account_number": null,
        "bank_name": null,
        "is_default": false
      },
      optionsType: [
        {value: 0, text: 'Cá nhân'},
        {value: 1, text: 'Cty'}
      ],
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    // Check prefix
    if(this.$route.params.id) {
      this.prefix_title = "Cập Nhật"
    } else {
      this.prefix_title = "Thêm Mới"
    }

    this.getBankAccountDetail()
  },
  computed: {
    errorType: function () {
      return this.checkInfo(this.bankAccount.type)
    },
    errorAccountName: function () {
      return this.checkInfo(this.bankAccount.account_name)
    },
    errorAccountNumber: function () {
      return this.checkInfo(this.bankAccount.account_number)
    },
    errorBankName: function () {
      return this.checkInfo(this.bankAccount.bank_name)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorType || this.errorAccountName || this.errorAccountNumber || this.errorBankName)
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
     * Get detail
     */
    getBankAccountDetail() {
      let bankAccountId = this.$route.params.id
      if(bankAccountId){
        this.loading = true

        bankAccountAPI.getBankAccountDetail(bankAccountId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.bankAccount = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push('/bank-account')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {
        let bankAccountId = this.$route.params.id
        if(bankAccountId){
          // Edit
          let bankAccount = this.bankAccount
          bankAccount.id = bankAccountId
          bankAccountAPI.editBankAccount(bankAccount).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật tài khoản ngân hàng thành công!!! ')
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        } else {
          // Add
          bankAccountAPI.addBankAccount(this.bankAccount).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.$router.push("/bank-account")
              }
            }
          }).catch(err => {
            this.saving = false
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      } else {
        this.saving = false
      }
    }
  }
}
</script>
