<template>
  <div class="w-full px-4 py-6">
    <!-- Store Selection Modal -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="() => {}" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
                  Vui lòng chọn chi nhánh
                </DialogTitle>
                <div class="mt-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Cửa hàng</label>
                  <select
                    v-model="selectedStoreId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :disabled="loading">
                    <option v-for="option in optionsStore" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>

                <div class="mt-4 flex justify-center">
                  <button
                    type="button"
                    class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!selectedStoreId || loading"
                    @click="confirmChooseStore">
                    Xác nhận
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Báo Cáo Theo Ngày</h2>

      <!-- Store Selection Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Chọn chi nhánh</label>
          <select
            v-model="selectedStoreId"
            @change="confirmChooseStore"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading">
            <option v-for="option in optionsStore" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Bill Number Card -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 shadow">
          <div class="text-sm text-gray-600 font-medium mb-2">Số lượng hoá đơn</div>
          <div class="text-2xl font-bold text-blue-700">{{ formatCurrency(billNumber) }}</div>
        </div>

        <!-- Revenue Card -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 shadow">
          <div class="text-sm text-gray-600 font-medium mb-2">Tổng doanh thu</div>
          <div class="text-2xl font-bold text-green-700">{{ formatCurrency(revenue) }}</div>
        </div>

        <!-- Fee Card -->
        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 shadow">
          <div class="text-sm text-gray-600 font-medium mb-2">Tổng chi phí</div>
          <div class="text-2xl font-bold text-orange-700">{{ formatCurrency(fee) }}</div>
        </div>

        <!-- Profit Card -->
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 shadow">
          <div class="text-sm text-gray-600 font-medium mb-2">Tổng lợi nhuận</div>
          <div class="text-2xl font-bold text-purple-700">{{ formatCurrency(profit) }}</div>
        </div>

        <!-- Fund Card -->
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 shadow">
          <div class="text-sm text-gray-600 font-medium mb-2">Tiền vốn đầu ngày</div>
          <div class="text-2xl font-bold text-indigo-700">{{ formatCurrency(fund) }}</div>
        </div>
      </div>
    </div>

    <!-- Bills Table Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Loading State -->
      <div v-show="loading" class="flex justify-center items-center py-8">
        <i class="fa fa-spinner fa-spin text-blue-500 text-4xl"></i>
      </div>

      <!-- Table Content -->
      <div v-show="!loading && bills.length > 0">
        <!-- Header with Count and Export -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-700">
            Số kết quả: <span class="font-semibold">{{ bills.length }}</span>
          </div>
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-gray-700 font-semibold"
            @click="exportToExcel(bills, excel_bill_fields, 'bao_cao_theo_bill', 'Báo Cáo Theo Bill')">
            <b>Xuất Excel</b>
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">STT</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Ngày</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Số Bill</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Bàn</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Tổng tiền món</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Phí dv, phụ thu</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Giảm Giá</th>
                <th class="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">% Thuế</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Số Tiền Thuế</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Thành Tiền</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Tiền mặt</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Chuyển khoản</th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Tiền điện tử</th>
              </tr>
            </thead>
            <tbody>
              <!-- Sum Row -->
              <tr class="bg-orange-50">
                <td class="border border-gray-300 px-3 py-2 text-center font-bold text-orange-600" colspan="4">
                  Tổng
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(totalPrice) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(totalServicePrice) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(totalDiscount) }}
                </td>
                <td class="border border-gray-300 px-3 py-2"></td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(totalVat) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(totalAmount) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(total_cash) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(total_credit) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-right font-bold text-orange-600">
                  {{ formatCurrency(total_emoney) }}
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="(bill, index) in bills" :key="index" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-3 py-2 text-center">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ bill.created_at }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ bill.bill_number }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ bill.table_name }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(bill.sub_total) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(bill.service_price) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(bill.discount_amount) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-center">{{ bill.vat_percent }}%</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(bill.vat_value) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(bill.total) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(bill.cash) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(bill.credit) }}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">{{ formatCurrency(bill.e_money) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-show="!loading && bills.length === 0 && selectedStoreId" class="text-center py-8 text-gray-500">
        Không có dữ liệu
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useFormatters } from '@/composables/useFormatters'
import { useToast } from '@/composables/useToast'
import { useExcelExport } from '@/composables/useExcelExport'

// Composables
const { formatCurrency } = useFormatters()
const { popToast } = useToast()
const { exportToExcel } = useExcelExport()

// Modal State
const isModalOpen = ref(true)
const selectedStoreId = ref(null)
const optionsStore = ref([])

// Data State
const loading = ref(false)
const billNumber = ref(0)
const revenue = ref(0)
const fee = ref(0)
const profit = ref(0)
const fund = ref(0)

// Bills State
const bills = ref([])
const totalPrice = ref(0)
const totalServicePrice = ref(0)
const totalDiscount = ref(0)
const totalVat = ref(0)
const totalAmount = ref(0)
const total_cash = ref(0)
const total_credit = ref(0)
const total_emoney = ref(0)

// Excel Configuration
const excel_bill_fields = {
  'Ngày': 'created_at',
  'Số Bill': 'bill_number',
  'Bàn': 'table_name',
  'Tổng tiền món': 'sub_total',
  'Phí dv, phụ thu': 'service_price',
  'Giảm Giá': 'discount_amount',
  '% Thuế': 'vat_percent',
  'Số Tiền Thuế': 'vat_value',
  'Thành Tiền': 'total',
  'Tiền mặt': 'cash',
  'Chuyển khoản': 'credit',
  'Tiền điện tử': 'e_money'
}

/**
 * Get store options
 */
const getOptionStore = async () => {
  try {
    const res = await adminAPI.getStoreOption()
    if (res && res.data && res.data.data) {
      optionsStore.value = res.data.data
      if (optionsStore.value.length > 0) {
        selectedStoreId.value = optionsStore.value[0].value
      }
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  }
}

/**
 * Get today report
 */
const getReportToday = async (storeId) => {
  try {
    const res = await adminAPI.getBrandReportToday(storeId)
    if (res && res.data && res.data.data) {
      revenue.value = res.data.data.reveneu || 0
      billNumber.value = res.data.data.bill_number || 0
      fee.value = res.data.data.fee || 0
      profit.value = res.data.data.profit || 0
      fund.value = res.data.data.fund || 0
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  }
}

/**
 * Get bills for today report
 */
const getTotalBill = async (storeId) => {
  loading.value = true
  try {
    const res = await adminAPI.getBrandBillForTodayReport(storeId)
    if (res && res.data && res.data.data) {
      bills.value = res.data.data.data || []
      totalPrice.value = res.data.data.total_price || 0
      totalServicePrice.value = res.data.data.total_service_price || 0
      totalDiscount.value = res.data.data.total_discount || 0
      totalVat.value = res.data.data.total_vat || 0
      totalAmount.value = res.data.data.total_amount || 0
      total_cash.value = res.data.data.total_cash || 0
      total_credit.value = res.data.data.total_credit || 0
      total_emoney.value = res.data.data.total_emoney || 0
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  } finally {
    loading.value = false
  }
}

/**
 * Confirm store selection
 */
const confirmChooseStore = () => {
  if (!selectedStoreId.value) {
    popToast('warning', 'Vui lòng chọn cửa hàng')
    return
  }

  isModalOpen.value = false
  getReportToday(selectedStoreId.value)
  getTotalBill(selectedStoreId.value)
}

// Lifecycle
onMounted(() => {
  getOptionStore()
})
</script>

<style scoped>
.text-header {
  color: #2c3e50;
}
</style>
