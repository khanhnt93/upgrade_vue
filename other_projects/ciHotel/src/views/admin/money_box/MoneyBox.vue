<template>
  <div class="container-fluid mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Header -->
      <div class="mb-4">
        <h4 class="text-2xl font-bold text-center">KÉT TIỀN</h4>
      </div>

      <!-- Action Buttons -->
      <div class="mb-6 flex justify-end gap-2">
        <button
          @click="goToHistory"
          class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
          Lịch sử két tiền
        </button>
        <button
          @click="closeDay"
          class="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50">
          Đóng ngày
        </button>
      </div>

      <!-- First Row: Revenue Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center border-t pt-4">
          <h5 class="text-lg font-semibold mb-2">Tổng tiền phòng</h5>
          <h3 class="text-2xl font-bold">{{ formatCurrency(detail.reveneu) }}</h3>
        </div>
        <div class="text-center border-t pt-4">
          <h5 class="text-lg font-semibold mb-2">Tổng thu khác</h5>
          <h3 class="text-2xl font-bold">{{ formatCurrency(detail.reveneu + detail.total_ear_order) }}</h3>
        </div>
        <div class="text-center border-t pt-4">
          <h5 class="text-lg font-semibold mb-2">Tổng chi</h5>
          <h3 class="text-2xl font-bold">{{ formatCurrency(detail.fee) }}</h3>
        </div>
        <div class="text-center border-t pt-4">
          <h5 class="text-lg font-semibold mb-2">Lợi nhuận</h5>
          <h3 class="text-2xl font-bold">{{ formatCurrency(detail.reveneu + detail.total_ear_order - detail.fee) }}</h3>
        </div>
      </div>

      <!-- Second Row: Money Types -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center border-t pt-4">
          <h5 class="text-lg font-semibold mb-2">Tiền vốn đầu ngày</h5>
          <h4 class="text-xl font-bold">{{ formatCurrency(detail.fund) }}</h4>
        </div>
        <div class="text-center border-t pt-4">
          <h5 class="text-lg font-semibold mb-2">Tiền mặt</h5>
          <h4 class="text-xl font-bold">{{ formatCurrency(detail.cash) }}</h4>
        </div>
        <div class="text-center border-t pt-4">
          <h5 class="text-lg font-semibold mb-2">Tài khoản thẻ</h5>
          <h4 class="text-xl font-bold">{{ formatCurrency(detail.credit) }}</h4>
        </div>
        <div class="text-center border-t pt-4">
          <h5 class="text-lg font-semibold mb-2">Tiền điện tử</h5>
          <h4 class="text-xl font-bold">{{ formatCurrency(detail.e_money) }}</h4>
        </div>
      </div>

      <!-- Third Row: Actions -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center border-t pt-4">
          <h5 class="text-lg font-semibold mb-2">Số hóa đơn:</h5>
          <h4 class="text-xl font-bold">{{ detail.bill_number }}</h4>
        </div>
        <div class="flex items-end justify-center">
          <button
            @click="plusFundMoney"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Thêm vốn đầu ngày
          </button>
        </div>
        <div class="flex items-end justify-center">
          <button
            @click="plusMoney"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Thêm tiền thu
          </button>
        </div>
        <div class="flex items-end justify-center">
          <button
            @click="minusMoney"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Thêm tiền chi
          </button>
        </div>
      </div>
    </div>

    <!-- Modal plus/minus money -->
    <div
      v-if="showChangeMoneyModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelChangeMoney">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">{{ modalTitle }}</h3>

        <!-- Money Number -->
        <div class="mb-4">
          <label class="block mb-2 font-medium">{{ moneyNumber }}<span class="text-red-500">*</span></label>
          <input
            v-model="inputs.moneyNumber"
            type="text"
            autocomplete="new-password"
            maxlength="11"
            @keyup="changeMoneyNumber($event.target)"
            :class="['w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500', errorMoneyNumber ? 'border-red-500' : 'border-gray-300']">
          <div v-if="errorMoneyNumber" class="text-red-500 text-sm mt-1">
            Vui lòng nhập số tiền
          </div>
        </div>

        <!-- Money Content -->
        <div class="mb-4">
          <label class="block mb-2 font-medium">{{ moneyContent }}<span class="text-red-500">*</span></label>
          <textarea
            v-model="inputs.moneyContent"
            :placeholder="moneyContentExample"
            rows="5"
            :class="['w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500', errorMoneyContent ? 'border-red-500' : 'border-gray-300']">
          </textarea>
          <div v-if="errorMoneyContent" class="text-red-500 text-sm mt-1">
            Vui lòng nhập nội dung
          </div>
        </div>

        <!-- Custom Tabs -->
        <div class="mb-4">
          <!-- Tab Buttons -->
          <div class="flex border-b border-gray-300 mb-3">
            <button
              @click="activeTab = 'cash'"
              :class="['px-4 py-2 font-medium focus:outline-none', activeTab === 'cash' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600']">
              Tiền mặt
            </button>
            <button
              @click="activeTab = 'credit'"
              :class="['px-4 py-2 font-medium focus:outline-none', activeTab === 'credit' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600']">
              Chuyển khoản
            </button>
            <button
              @click="activeTab = 'e_money'"
              :class="['px-4 py-2 font-medium focus:outline-none', activeTab === 'e_money' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600']">
              Tiền điện tử
            </button>
          </div>

          <!-- Tab Content -->
          <div class="mt-3">
            <input
              v-if="activeTab === 'cash'"
              v-model="inputs.cash"
              type="text"
              autocomplete="new-password"
              maxlength="11"
              @keyup="intergerOnly($event.target)"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">

            <input
              v-if="activeTab === 'credit'"
              v-model="inputs.credit"
              type="text"
              autocomplete="new-password"
              maxlength="11"
              @keyup="intergerOnly($event.target)"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">

            <input
              v-if="activeTab === 'e_money'"
              v-model="inputs.e_money"
              type="text"
              autocomplete="new-password"
              maxlength="11"
              @keyup="intergerOnly($event.target)"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div v-if="errorMoney" class="text-red-500 text-sm mt-1">
            Vui lòng nhập đúng số tiền
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-between mt-6">
          <button
            @click="cancelChangeMoney"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Hủy
          </button>
          <button
            @click="confirmChangeMoney"
            :disabled="saving"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'


export default {
  setup() {
    const router = useRouter()
    const toast = useToast()
    const { formatCurrency } = useFormatters()

    return {
      router,
      toast,
      formatCurrency
    }
  },
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
      showChangeMoneyModal: false,
      activeTab: 'cash',
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
        this.toast.error(errorMess)
      })

    },

    /**
     * Plus money
     */
    plusMoney() {
      this.click = false
      this.activeTab = 'cash'
      this.modalTitle = "Thêm tiền thu"
      this.moneyNumber = "Số tiền thêm"
      this.moneyContent = "Nội dung thêm"
      this.moneyContentExample = "Tiền tip"

      this.inputs.type = "plus"
      this.showChangeMoneyModal = true
    },

    /**
     * Plus fund money
     */
    plusFundMoney() {
      this.click = false
      this.activeTab = 'cash'
      this.modalTitle = "Thêm vốn đầu ngày"
      this.moneyNumber = "Số tiền vốn"
      this.moneyContent = "Nội dung thêm"
      this.moneyContentExample = "Tiền vốn đầu ngày"

      this.inputs.type = "fund"
      this.inputs.moneyContent = "Tiền vốn đầu ngày"
      this.showChangeMoneyModal = true
    },

    /**
     * Minus money
     */
    minusMoney() {
      this.click = false
      this.activeTab = 'cash'
      this.modalTitle = "Thêm tiền chi"
      this.moneyNumber = "Số tiền chi"
      this.moneyContent = "Nội dung chi"
      this.moneyContentExample = "Trả tiền điện"

      this.inputs.type = "minus"
      this.showChangeMoneyModal = true
    },

    /**
     * Cancel change money
     */
    cancelChangeMoney() {
      this.showChangeMoneyModal = false
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
      this.showChangeMoneyModal = false
    },

    /**
     * Close day
     */
    closeDay() {
      if(confirm("Bạn có chắc muốn đóng ca làm việc cuối ngày?")) {
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
          this.toast.error(errorMess)
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
            this.toast.success("Thao tác thành công!")

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
          this.toast.error(errorMess)
        })
      }
    },

    /**
     * Go to money box history
     */
    goToHistory() {
      this.router.push("/money-box-history")
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
    }
  }
}
</script>
