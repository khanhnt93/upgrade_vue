<template>
  <div class="container-fluid">

    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="mt-2 text-center text-header">Lịch Sử Bán Hàng</h4>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-4 items-end">

              <div class="w-full md:w-1/4 px-2 mb-3">
                <label class="font-bold">Từ ngày</label>
                <input
                    id="fromDate"
                    type="text"
                    autocomplete="off"
                    class="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:border-blue-500"
                    v-model="inputs.fromDate"
                    maxlength="10"
                    @keyup="inputDateOnly($event.target)"
                    placeholder="dd/mm/yyyy"
                    :disabled="onSearch">
              </div>

              <div class="w-full md:w-1/4 px-2 mb-3">
                <label class="font-bold">Đến ngày</label>
                <input
                    id="toDate"
                    type="text"
                    autocomplete="off"
                    class="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:border-blue-500"
                    v-model="inputs.toDate"
                    maxlength="10"
                    @keyup="inputDateOnly($event.target)"
                    placeholder="dd/mm/yyyy"
                    :disabled="onSearch">
              </div>

              <div class="w-full md:w-1/4 px-2 mb-3">
                <label class="font-bold">
                  Trạng thái đơn
                </label>
                <select
                  id="status"
                  class="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:border-blue-500"
                  v-model="inputs.status">
                  <option v-for="option in statusOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>

              <div class="w-full md:w-1/4 px-2 mb-3">
                <label class="invisible">
                   Xem
                </label>
                <button class="w-32 h-10 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
                  :disabled="onSearch" @click.prevent="search">
                  Xem
                </button>
              </div>
            </div>

            <!-- Loading -->
            <div class="text-center py-4" v-show="loading"><i class="fas fa-spinner fa-spin fa-2x text-primary"></i></div>

            <div class="flex flex-wrap -mx-2" v-show="firstSearch == false && bills.length">
              <div class="w-full px-2">
                <div class="flex flex-wrap -mx-2 mb-3">
                  <div class="w-full md:w-1/3 px-2">
                    Số kết quả: {{bills.length}}
                  </div>
                  <!-- <div class="w-full md:w-2/3 px-2 text-right">
                  <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "bills"
                    :fields = "excel_bill_fields"
                    worksheet = "Báo Cáo Theo Bill"
                    name    = "bao_cao_theo_bill.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                </div> -->
                </div>
                <div class="flex flex-wrap -mx-2">
                  <div class="w-full px-2">
                    <table class="table table-bordered table-striped fixed_header">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Số Bill</th>
                        <th>Tên K.H</th>
                        <th>Sdt K.H</th>
                        <th>Tổng tiền SP</th>
                        <th>Tổng tiền thanh toán</th>
                        <th>Trạng thái</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(bill, index) in bills">
                        <td>{{index + 1}}</td>
                        <td>{{bill.created_at}}</td>
                        <td>{{bill.bill_number}}</td>
                        <td>{{bill.customer_name}}</td>
                        <td>{{bill.customer_phone}}</td>
                        <td class="text-right">{{currencyFormat(bill.sub_total)}}</td>
                        <td class="text-right">{{currencyFormat(bill.total)}}</td>
                        <td>
                          <span class="text-danger" v-if="bill.trade_status == 0">Lưu nháp</span>
                          <span v-if="bill.trade_status == 1">Đã thanh toán</span>
                        </td>
                        <td class="text-center align-middle">
                          <div v-if="bill.trade_status == 0" class="flex justify-center gap-2">
                            <button class="btn btn-sm btn-outline-primary" title="Sửa" @click="router.push('/bill/edit/' + bill.id)">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" title="Xoá" @click.prevent="deleteBill(bill)">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                          <button v-if="bill.trade_status == 1" class="btn btn-sm btn-outline-success"
                          @click="router.push('/bill/edit/' + bill.id)">
                            <i class="fas fa-print mr-1"></i> In hóa đơn
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2" v-show="firstSearch == false && bills.length == 0">
              <div class="w-full px-2 text-center">
                Không tìm thấy kết quả nào
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal xác nhận xoá -->
    <TransitionRoot appear :show="modalDeleteBill" as="template">
      <Dialog as="div" @close="modalDeleteBill = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div class="text-center px-4 py-3">
        <!-- Custom title -->
        <h4 class="font-weight-bold mb-4" style="color: #3b82f6;">Xác nhận xoá bill</h4>

        <!-- Số hoá đơn -->
        <p class="mb-2" style="font-size: 1.25rem;">
          <strong>Số hoá đơn: {{ selectedBill.bill_number }}</strong>
        </p>

        <p class="mb-2" style="font-size: 1.25rem;">
          <strong>Trạng thái: Lưu nháp</strong>
        </p>

        <!-- Tên khách hàng -->
        <p class="mb-2" style="font-size: 1.25rem;">
          👤 <strong>Khách hàng: {{ selectedBill.customer_name || 'Chưa chọn khách hàng' }}</strong>
        </p>

        <!-- Số tiền thanh toán -->
        <p class="mb-4" style="font-size: 2rem; font-weight: bold; color: #10b981;">
          💰 {{ currencyFormat(selectedBill.total) }}
        </p>

                  <!-- Buttons -->
                  <div class="flex justify-center gap-3">
                    <button class="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-sm"
                      @click="modalDeleteBill = false">
                      ❌ Hủy
                    </button>

                    <button class="btn btn-danger rounded-pill px-4 py-2 shadow-sm"
                      @click="confirmDeleteBill">
                      ✅ Xác nhận xoá
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>
<script>
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import billApi from '@/api/bill'
import commonFunc from '@/common/commonFunc'
//
// import JsonExcel from 'vue-json-excel'

//


export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild
  },
  setup() {
    const { popToast } = useToast()
    const router = useRouter()
    return { popToast, router }
  },
  data () {
    return {
      statusOption: [
        {value: 1, text: '-- Tất cả --'},
        {value: 2, text: 'Chưa thanh toán'},
        {value: 3, text: 'Đã thanh toán'}
      ],
      inputs: {
        fromDate: null,
        toDate: null,
        status: 1,
      },
      onSearch: false,
      bills: [],
      selectedBill: {},
      modalDeleteBill: false,
      firstSearch: true,
      widowHeight: 500,
      loading: false,
    }
  },
  mounted() {
    let dateNow = new Date().toJSON().slice(0,10)
    this.inputs.toDate = commonFunc.formatDate(dateNow)
    this.inputs.fromDate = commonFunc.formatDate(dateNow)

    // Get window height
    this.widowHeight = window.innerHeight;

    this.search()
  },
  methods: {
    /**
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {
      if(this.inputs.fromDate == "" || this.inputs.fromDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.popToast('error', "Mục từ ngày không đúng")
        return false
      }
      if(this.inputs.toDate == "" || this.inputs.toDate == null || commonFunc.dateFormatCheck(this.inputs.fromDate) == false) {
        this.popToast('error', "Mục đến ngày không đúng")
        return false
      }
      let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
      let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

      if(fromDate > toDate) {
        this.popToast('error', "Từ ngày không thể lớn hớn đến ngày")
        return false
      }

      fromDate.setDate(fromDate.getDate() + 62)

      if(fromDate < toDate) {
        this.popToast('error', "Thời gian không quá 62 ngày")
        return false
      }

      return true
    },

    /**
     * Search
     */
    search() {

      // Check validate
      if(!this.checkFromDateAndToDate()) {
        this.bills = []
        return
      }
      this.onSearch = true
      this.loading = true

      let params = {
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
      }

      // Search
      billApi.searchBill(params).then(res => {
        if(res && res.data && res.data.data) {
          this.bills = res.data.data
        }

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)

        this.firstSearch = false
        this.onSearch = false
        this.loading = false
      })
    },

    deleteBill(bill) {
      this.selectedBill = bill
      this.modalDeleteBill = true
    },

    confirmDeleteBill() {
      billApi.deleteBill(this.selectedBill.id).then(res => {
        if(res && res.data && res.data.status == 200) {
          this.modalDeleteBill = false
          this.search()
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)
      })
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = null
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

    /**
     * Only input date
     */
     inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

  }
}
</script>


<style lang="css" scoped>
  .label-width {
    width: 100%;
  }
  .total {
    color: #ed592a;
  }

  table {
    margin: 0 auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content !important;
    min-width: 0 !important;
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
