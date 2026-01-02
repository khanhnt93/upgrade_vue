<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row>
              <b-col>
                <h4 class="text-center text-header">KÉT TIỀN</h4>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                <b-button  variant="outline-primary" class="pull-right btn-width-160 mt-2 mr-2" @click="goToHistory">
                  Lịch sử két tiền
                </b-button>
                <b-button variant="outline-danger" class="pull-right btn-width-160 mt-2 mr-2" @click="closeDay">
                    Đóng ngày
                </b-button>
              </b-col>
            </b-row>

            <br>
            <b-row>
              <b-col md="3">
                <h5 class="text-center border-top">
                  Tổng tiền phòng
                </h5>
                <h3 class="text-center">
                  {{currencyFormat(detail.reveneu)}}
                </h3>
              </b-col>
              <b-col md="3">
                <h5 class="text-center border-top">
                  Tổng thu khác
                </h5>
                <h3 class="text-center">
                  {{currencyFormat(detail.reveneu + detail.total_ear_order)}}
                </h3>
              </b-col>
              <b-col md="3">
                <h5 class="text-center border-top">
                  Tổng chi
                </h5>
                <h3 class="text-center">
                  {{currencyFormat(detail.fee)}}
                </h3>
              </b-col>
              <b-col md="3">
                <h5 class="text-center border-top">
                  Lợi nhuận
                </h5>
                <h3 class="text-center">
                  {{currencyFormat(detail.reveneu + detail.total_ear_order - detail.fee)}}
                </h3>
              </b-col>

            </b-row>
            <br>
            <br>
            <b-row>

              <b-col md="3">
                <h5 class="text-center border-top">
                  Tiền vốn đầu ngày
                </h5>
                <h4 class="text-center">
                  {{currencyFormat(detail.fund)}}
                </h4>
              </b-col>
              <b-col md="3">
                <h5 class="text-center border-top">
                  Tiền mặt
                </h5>
                <h4 class="text-center">
                  {{currencyFormat(detail.cash)}}
                </h4>
              </b-col>
              <b-col md="3">
                <h5 class="text-center border-top">
                  Tài khoản thẻ
                </h5>
                <h4 class="text-center">
                  {{currencyFormat(detail.credit)}}
                </h4>
              </b-col>
              <b-col md="3">
                <h5 class="text-center border-top">
                  Tiền điện tử
                </h5>
                <h4 class="text-center">
                  {{currencyFormat(detail.e_money)}}
                </h4>
              </b-col>
            </b-row>
            <br>
            <br>
            <b-row>
              <b-col md="3">
                <h5 class="text-center border-top">
                  Số hóa đơn:
                </h5>
                <h4 class="text-center">
                  {{detail.bill_number}}
                </h4>
              </b-col>
              <b-col md="3">
                <button class="btn btn-primary pull-right px-4 default-btn-bg" @click="plusFundMoney">
                    Thêm vốn đầu ngày
                </button>
              </b-col>
              <b-col md="3">
                <button class="btn btn-primary pull-right px-4 default-btn-bg" @click="plusMoney">
                    Thêm tiền thu
                </button>
              </b-col>
              <b-col md="3">
                <button class="btn btn-primary pull-right px-4 default-btn-bg" @click="minusMoney">
                    Thêm tiền chi
                </button>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal plus/minus money-->
    <b-modal :title="modalTitle" centered hide-footer id="modal-change-money">
      <b-row>
        <b-col>
          <div class="form-group">
            <label>{{moneyNumber}}</label><span class="error-sybol"></span>
            <input
              v-model="inputs.moneyNumber"
              type="text"
              autocomplete="new-password"
              class="form-control"
              maxlength="11"
              @keyup="changeMoneyNumber($event.target)">
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorMoneyNumber">
              Vui lòng nhập số tiền
            </b-form-invalid-feedback>
          </div>
       </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="form-group">
            <label>{{moneyContent}}</label><span class="error-sybol"></span>
            <b-form-textarea
              :placeholder="moneyContentExample"
              rows="5"
              v-model="inputs.moneyContent">
            </b-form-textarea>
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorMoneyContent">
              Vui lòng nhập nội dung
            </b-form-invalid-feedback>
          </div>
       </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-tabs content-class="mt-3">
              <b-tab title="Tiền mặt" active>
                <input
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="11"
                  v-model="inputs.cash"
                  @keyup="intergerOnly($event.target)">
              </b-tab>

              <b-tab title="Chuyển khoản">
                <div>
                  <input
                  id="credit"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="11"
                  v-model="inputs.credit"
                  @keyup="intergerOnly($event.target)">
                </div>
              </b-tab>

              <b-tab title="Tiền điện tử">
                <input
                  id="e_money"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="11"
                  v-model="inputs.e_money"
                  @keyup="intergerOnly($event.target)">
              </b-tab>
          </b-tabs>
          <b-form-invalid-feedback class="invalid-feedback" :state="!errorMoney">
            Vui lòng nhập đúng số tiền
          </b-form-invalid-feedback>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="4" class="text-left mt-3">
          <button class="btn btn-danger px-4" @click="cancelChangeMoney">
            Hủy
          </button>
        </b-col>
        <b-col cols="8" class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="confirmChangeMoney" :disabled="saving">
            Xác nhận
          </button>
        </b-col>
      </b-row>

    </b-modal>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      detail: {
        "cash": 0,
        "credit": 0,
        "e_money": 0,
        "reveneu": 0,
        "fee": 0,
        "fund": 0,
        "total_ear_order": 0
      },
      modalTitle: "Thêm tiền thu",
      moneyNumber: "Số tiền",
      moneyContent: "Nội dung",
      moneyContentExample: "",
      inputs: {
        type: null,
        moneyNumber: null,
        moneyContent: null,
        cash: 0,
        credit: 0,
        e_money: 0
      },
      click: false,
      saving: false,
      loading: false
    }
  },
  mounted() {
    this.getMoneyBoxDetail()
  },
  computed: {
    errorMoneyNumber () {
      return this.checkInfo(this.inputs.moneyNumber)
    },
    errorMoneyContent () {
      return this.checkInfo(this.inputs.moneyContent)
    },
    errorMoney () {
      return this.checkMoney()
    },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkMoney () {
      return (this.click &&
        (parseInt(this.inputs.cash) + parseInt(this.inputs.credit) + parseInt(this.inputs.e_money) != this.inputs.moneyNumber)
      )
    },
    checkValidate () {
      return !(this.errorMoneyNumber || this.errorMoneyContent || this.errorMoney)
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
     * Get money box detail
     */
    getMoneyBoxDetail() {
      this.loading = true
      let dateNow = new Date()
      let dataPost = {
        "toDay": dateNow.toJSON().slice(0,10)
      }

      adminAPI.getMoneyBoxDetail(dataPost).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.detail = res.data.data
        }

        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })

    },

    /**
     * Plus money
     */
    plusMoney() {
      this.click = false
      this.modalTitle = "Thêm tiền thu"
      this.moneyNumber = "Số tiền thêm"
      this.moneyContent = "Nội dung thêm"
      this.moneyContentExample = "Tiền tip"

      this.inputs.type = "plus"
      this.$bvModal.show('modal-change-money')
    },

    /**
     * Plus fund money
     */
    plusFundMoney() {
      this.click = false
      this.modalTitle = "Thêm vốn đầu ngày"
      this.moneyNumber = "Số tiền vốn"
      this.moneyContent = "Nội dung thêm"
      this.moneyContentExample = "Tiền vốn đầu ngày"

      this.inputs.type = "fund"
      this.inputs.moneyContent = "Tiền vốn đầu ngày"
      this.$bvModal.show('modal-change-money')
    },

    /**
     * Minus money
     */
    minusMoney() {
      this.click = false
      this.modalTitle = "Thêm tiền chi"
      this.moneyNumber = "Số tiền chi"
      this.moneyContent = "Nội dung chi"
      this.moneyContentExample = "Trả tiền điện"

      this.inputs.type = "minus"
      this.$bvModal.show('modal-change-money')
    },

    /**
     * Cancel change money
     */
    cancelChangeMoney() {
      this.$bvModal.hide('modal-change-money')
    },

    /**
     * Reset modal
     */
    resetModal() {
      this.modalTitle = "Thêm tiền"
      this.moneyNumber = "Số tiền"
      this.moneyContent = "Nội dung"
      this.moneyContentExample = ""

      this.inputs.type = null
      this.inputs.moneyNumber = null
      this.inputs.moneyContent = null
      this.inputs.cash = 0
      this.inputs.credit = 0
      this.inputs.e_money = 0
      this.$bvModal.hide('modal-change-money')
    },

    /**
     * Close day
     */
    closeDay() {
      this.$bvModal.msgBoxConfirm("Bạn có chắc muốn đóng ca làm việc cuối ngày?", {
        title: false,
        buttonSize: 'sm',
        centered: true, size: 'sm',
        footerClass: 'p-2',
        okTitle: 'Có',
        cancelTitle: 'Không'
      }).then(res => {
        if (res) {
          adminAPI.closeDay().then(res => {
            this.detail.cash = 0
            this.detail.credit = 0
            this.detail.e_money = 0
            this.detail.reveneu = 0
            this.detail.fee = 0
            this.detail.total_ear_order = 0
            this.detail.fund = 0
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      })
    },

    /**
     * Confirm change money
     */
    confirmChangeMoney() {
      // Check validate
      this.click = true
      let result = this.checkValidate()
      if(result) {
        this.saving = true

        // Call api, update data
        let dateNow = new Date()
        this.inputs.toDay = dateNow.toJSON().slice(0,10)
        adminAPI.saveMoneyBox(this.inputs).then(res => {
          if (res != null && res.data != null) {
            this.popToast('success', "Thao tác thành công!")

            if(res.data.data != null) {
              this.detail = res.data.data
            }

            // Reset modal
            this.resetModal()
          }

          this.saving = false
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Go to money box history
     */
    goToHistory() {
      this.$router.push("/money-box-history")
    },

    /**
     * Only input integer
     */
     intergerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Event key up money number
     */
    changeMoneyNumber(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result

      this.inputs.cash = result
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
  }
}
</script>
