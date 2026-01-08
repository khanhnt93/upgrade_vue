<template>
  <div class="container-fluid px-4 py-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Title -->
        <h4 class="text-xl font-semibold text-center mb-4">Báo cáo tổng quát</h4>
        <hr class="mb-4">

        <!-- Date Filters -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              v-model="fromDate"
              type="text"
              placeholder="DD-MM-YYYY"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              v-model="toDate"
              type="text"
              placeholder="DD-MM-YYYY"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <!-- Search Button -->
        <div class="flex justify-end mb-6">
          <button
            @click="getDataReport"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
            Tìm Kiếm
          </button>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        </div>

        <!-- Report Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Profit Card -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <h5 class="text-lg font-semibold text-gray-700 mb-2">Lợi nhuận bán hàng</h5>
              <div class="text-2xl font-bold text-blue-600">
                {{ formatCurrency(report.profit) }}
              </div>
            </div>
          </div>

          <!-- Total Debt Card -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <h5 class="text-lg font-semibold text-gray-700 mb-2">Tổng ghi nợ</h5>
              <div class="text-2xl font-bold text-green-600">
                {{ formatCurrency(report.totalDebt) }}
              </div>
            </div>
          </div>

          <!-- Total Public Debt Card -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <h5 class="text-lg font-semibold text-gray-700 mb-2">Tổng nợ công</h5>
              <div class="text-2xl font-bold text-orange-600">
                {{ formatCurrency(report.totalPublicDebt) }}
              </div>
            </div>
          </div>

          <!-- Total Profit Card -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <h5 class="text-lg font-semibold text-gray-700 mb-2">Lợi nhuận sơ bộ</h5>
              <div class="text-2xl font-bold text-purple-600">
                {{ formatCurrency(report.totalProfit) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import moment from 'moment'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

const { popToast } = useToast()
const { formatCurrency } = useFormatters()

// Data
const fromDate = ref(moment().startOf('month').format('DD-MM-YYYY'))
const toDate = ref(moment().format('DD-MM-YYYY'))

const report = ref({
  profit: 0,
  totalDebt: 0,
  totalPublicDebt: 0,
  totalProfit: 0
})

const loading = ref(false)

// Methods
const checkFromDateAndToDate = () => {
  if (fromDate.value == null || toDate.value == null) {
    popToast('danger', 'Vui lòng nhập đầy đủ từ ngày và đến ngày')
    return false
  }

  // Convert to compare
  const from = moment(fromDate.value, 'DD-MM-YYYY')
  const to = moment(toDate.value, 'DD-MM-YYYY')

  if (!from.isValid() || !to.isValid()) {
    popToast('danger', 'Định dạng ngày không hợp lệ (DD-MM-YYYY)')
    return false
  }

  if (from.isAfter(to)) {
    popToast('danger', 'Từ ngày phải nhỏ hơn hoặc bằng đến ngày')
    return false
  }

  return true
}

const getDataReport = () => {
  if (!checkFromDateAndToDate()) {
    return
  }

  loading.value = true

  const params = {
    time: {
      dateFrom: fromDate.value,
      dateTo: toDate.value
    }
  }

  adminAPI.getGeneralReport(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const data = res.data.data
      report.value.profit = data.profit || 0
      report.value.totalDebt = data.totalDebt || 0
      report.value.totalPublicDebt = data.totalPublicDebt || 0
      report.value.totalProfit = data.totalProfit || 0
    }
    loading.value = false
  }).catch(err => {
    loading.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

// Lifecycle
onMounted(() => {
  getDataReport()
})
</script>
