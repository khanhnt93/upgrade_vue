<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <h4 class="text-center text-header">Két tiền</h4>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <button class="btn btn-outline-primary float-right btn-width-160 mt-2 mr-2" @click="goToHistory">
                  Lịch sử két tiền
                </button>
                <button class="btn btn-outline-danger float-right btn-width-160 mt-2 mr-2" @click="closeDay()">
                  Đóng ngày
                </button>
              </div>
            </div>

            <br>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3">
                <h5 class="text-center border-top">
                  Tổng tiền dv
                </h5>
                <h3 class="text-center">
                  {{currencyFormat(detail.reveneu)}}
                </h3>
              </div>
              <div class="col-span-3">
                <h5 class="text-center border-top">
                  Tổng thu khác
                </h5>
                <h3 class="text-center">
                  {{currencyFormat(detail.total_ear_order)}}
                </h3>
              </div>
              <div class="col-span-3">
                <h5 class="text-center border-top">
                  Tổng chi
                </h5>
                <h3 class="text-center">
                  {{currencyFormat(detail.fee)}}
                </h3>
              </div>
              <div class="col-span-3">
                <h5 class="text-center border-top">
                  Lợi nhuận
                </h5>
                <h3 class="text-center">
                  {{currencyFormat(detail.reveneu + detail.total_ear_order - detail.fee)}}
                </h3>
              </div>
            </div>
            <br>
            <br>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3">
                <h5 class="text-center border-top">
                  Tiền vốn đầu ngày
                </h5>
                <h4 class="text-center">
                  {{currencyFormat(detail.fund)}}
                </h4>
              </div>
              <div class="col-span-3">
                <h5 class="text-center border-top">
                  Tiền mặt
                </h5>
                <h4 class="text-center">
                  {{currencyFormat(detail.cash)}}
                </h4>
              </div>
              <div class="col-span-3">
                <h5 class="text-center border-top">
                  Tài khoản thẻ
                </h5>
                <h4 class="text-center">
                  {{currencyFormat(detail.credit)}}
                </h4>
              </div>
              <div class="col-span-3">
                <h5 class="text-center border-top">
                  Tiền điện tử
                </h5>
                <h4 class="text-center">
                  {{currencyFormat(detail.e_money)}}
                </h4>
              </div>
            </div>
            <br>
            <br>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3">
                <h5 class="text-center border-top">
                  Số hóa đơn:
                </h5>
                <h4 class="text-center">
                  {{detail.bill_number}}
                </h4>
              </div>
              <div class="col-span-3">
                <h5 class="border-top">
                  <button class="btn btn-outline-primary float-right btn-width-160 mt-2 mb-2" @click="plusFundMoney">
                    Thêm vốn đầu ngày
                  </button>
                </h5>

              </div>
              <div class="col-span-3">
                <h5 class="border-top">
                  <button class="btn btn-outline-primary float-right btn-width-160 mt-2 mb-2" @click="plusMoney">
                    Thêm tiền thu
                  </button>
                </h5>
              </div>
              <div class="col-span-3">
                <h5 class="border-top">
                  <button class="btn btn-outline-primary float-right btn-width-160 mt-2 mb-2" @click="minusMoney">
                    Thêm tiền chi
                  </button>
                </h5>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Modal plus/minus money-->
    <!-- Modal plus/minus money-->
    <div v-if="showChangeMoneyModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">{{ modalTitle }}</h5>
          <button @click="resetModal" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <div class="form-group">
                <label>{{moneyNumber}}</label><span class="error-sybol"></span>
                <input
                  v-model="inputs.moneyNumber"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="11"
                  @keyup="changeMoneyNumber($event.target)">
                <div class="invalid-feedback invalid-feedback" :state="!errorMoneyNumber">
                  Vui lòng nhập số tiền
                </div>
              </div>
           </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <div class="form-group">
                <label>{{moneyContent}}</label><span class="error-sybol"></span>
                <textarea class="form-control"
                  :placeholder="moneyContentExample"
                  rows="5"
                  v-model="inputs.moneyContent">
                </textarea>
                <div class="invalid-feedback invalid-feedback" :state="!errorMoneyContent">
                  Vui lòng nhập nội dung
                </div>
              </div>
           </div>
          </div>

          <!-- Tabs -->
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <div class="flex border-b mb-3">
                <button
                  class="py-2 px-4 focus:outline-none border-b-2 font-medium"
                  :class="activeTab === 'cash' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  @click="activeTab = 'cash'"
                >
                  Tiền mặt
                </button>
                <button
                  class="py-2 px-4 focus:outline-none border-b-2 font-medium"
                  :class="activeTab === 'transfer' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  @click="activeTab = 'transfer'"
                >
                  Chuyển khoản
                </button>
                <button
                  class="py-2 px-4 focus:outline-none border-b-2 font-medium"
                  :class="activeTab === 'emoney' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  @click="activeTab = 'emoney'"
                >
                  Tiền điện tử
                </button>
              </div>

              <!-- Tab Content -->
              <div v-if="activeTab === 'cash'">
                <input
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="11"
                  v-model="inputs.cash"
                  @keyup="intergerOnly($event.target)">
              </div>

              <div v-if="activeTab === 'transfer'">
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
              </div>

              <div v-if="activeTab === 'emoney'">
                <input
                  id="e_money"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="11"
                  v-model="inputs.e_money"
                  @keyup="intergerOnly($event.target)">
              </div>

              <div class="invalid-feedback invalid-feedback" :state="!errorMoney">
                Vui lòng nhập đúng số tiền
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 text-left mt-3">
              <button class="btn btn-outline-danger pull-left btn-width-120" @click="cancelChangeMoney()">
                Hủy
              </button>
            </div>
            <div class="col-span-8 text-right mt-3">
              <button class="btn btn-outline-success float-right btn-width-120" @click="confirmChangeMoney" :disabled="saving">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      loading: false,
      showChangeMoneyModal: false,
      activeTab: 'cash'
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
      this.showChangeMoneyModal = true;
      this.activeTab = 'cash';
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
      this.inputs.moneyContent = "Tiền vốn đầu ngày"
      this.showChangeMoneyModal = true;
      this.activeTab = 'cash';
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
      this.showChangeMoneyModal = true;
      this.activeTab = 'cash';
    },

    /**
     * Cancel change money
     */
    cancelChangeMoney() {
      this.showChangeMoneyModal = false;
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
      this.showChangeMoneyModal = false;
    },

    /**
     * Close day
     */
    closeDay() {
      if (confirm("Bạn có chắc muốn đóng ca làm việc cuối ngày?")) {
        adminAPI.closeDay().then(res => {
          this.detail.cash = 0
          this.detail.credit = 0
          this.detail.e_money = 0
          this.detail.reveneu = 0
          this.detail.fee = 0
          this.detail.total_ear_order = 0
          this.detail.fund = 0
          this.detail.bill_number = 0
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
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
