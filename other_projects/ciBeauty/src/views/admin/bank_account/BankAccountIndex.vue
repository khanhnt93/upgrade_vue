<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >

              <div class="grid grid-cols-12 gap-4">
              <div class="col-span-6">
                <button class="btn btn-outline-secondary pull-left btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="col-span-6">
                <button class="btn btn-outline-success float-right btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>

              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12">
                  <h4 class="mt-2 text-center text-header">{{prefix_title}} Tài Khoản Ngân Hàng</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Ngân hàng <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9 mt-2">
                  <select class="form-control" v-model="bankAccount.bank_id">
                    <option v-for="option in optionsBank" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <div class="invalid-feedback invalid-feedback"   :state="!errorBankName">
                    Vui lòng chọn ngân hàng
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 row form-row">
                <div class="col-span-3 mt-2">
                  <label> Loại tài khoản <span class="error-sybol"></span></label>
                </div>
                <div class="col-span-9 mt-2">
                  <select class="form-control" v-model="bankAccount.type">
                    <option v-for="option in optionsType" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <div class="invalid-feedback invalid-feedback"   :state="!errorType">
                    Vui lòng chọn loại tài khoản
                  </div>
                </div>
              </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-3 mt-2">
                <label> Tên tài khoản <span class="error-sybol"></span></label>
              </div>
              <div class="col-span-9 mt-2">
                <input
                  id="account_name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="bankAccount.account_name">
                <div class="invalid-feedback invalid-feedback"   :state="!errorAccountName">
                  Vui lòng nhập tên tài khoản
                </div>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-3 mt-2">
                <label> Số tài khoản <span class="error-sybol"></span></label>
              </div>
              <div class="col-span-9 mt-2">
                <input
                  id="account_number"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="bankAccount.account_number">
                <div class="invalid-feedback invalid-feedback"   :state="!errorAccountNumber">
                  Vui lòng nhập số tài khoản
                </div>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-3 mt-2">
                <label>Là tài khoản mặc định</label>
              </div>
              <div class="col-span-9 mt-2">
                <div class="input-group">
                  <input type="radio" v-model="bankAccount.is_default" name="is_default" :value="true" class="mt-2">
                  <label class="ml-4 mt-1">Có</label>
                  <input type="radio" v-model="bankAccount.is_default" name="is_default" :value="false" class="ml-5 mt-2">
                  <label class="ml-4 mt-1">Không</label>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
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
        "bank_id": null,
        "is_default": false
      },
      optionsType: [
        {value: 0, text: 'Cá nhân'},
        {value: 1, text: 'Cty'}
      ],
      optionsBank: [
        {value: 1, text: 'Agribank'},
        {value: 2, text: 'DongA Bank (Đông Á)'},
        {value: 3, text: 'Techcombank (Kỹ Thương)'},
        {value: 4, text: 'GPBank (Dầu Khí Toàn Cầu)'},
        {value: 5, text: 'Bắc Á Bank'},
        {value: 6, text: 'Standard Chartered VN'},
        {value: 7, text: 'Sacombank'},
        {value: 8, text: 'Saigonbank'},
        {value: 9, text: 'PVcomBank (Đại Chúng)'},
        {value: 10, text: 'OceanBank (Đại Dương)'},
        {value: 11, text: 'VietinBank'},
        {value: 12, text: 'ACB (Á Châu)'},
        {value: 13, text: 'BIDV'},
        {value: 14, text: 'Vietcombank (Ngoại thương)'},
        {value: 15, text: 'MB (Quân đội)'},
        {value: 16, text: 'TPBank (Tiên Phong)'},
        {value: 17, text: 'Shinhan Bank VN'},
        {value: 18, text: 'ABBank (An Bình)'},
        {value: 19, text: 'MSB (Hàng Hải)'},
        {value: 20, text: 'VietABank (Việt Á)'},
        {value: 21, text: 'Nam A Bank'},
        {value: 22, text: 'SCB (Sài Gòn)'},
        {value: 23, text: 'PGBank (Xăng dầu Petrolimex)'},
        {value: 24, text: 'Eximbank (Xuất nhập khẩu)'},
        {value: 25, text: 'VPBank (Thịnh Vượng)'}
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

    this.getBankOptions()

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
      return this.checkInfo(this.bankAccount.bank_id)
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
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
    },

    getBankOptions() {
      bankAccountAPI.getBankOptions().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.optionsBank = res.data.data
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
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
