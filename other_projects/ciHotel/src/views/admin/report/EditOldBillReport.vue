<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Báo cáo sửa bill cũ</h2>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- From Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày <span class="text-red-500">*</span>
          </label>
          <input
            v-model="inputs.fromDate"
            type="text"
            placeholder="dd-mm-yyyy"
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              errorFromDate ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="errorFromDate" class="text-red-500 text-xs mt-1">{{ errorFromDate }}</p>
        </div>

        <!-- To Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày <span class="text-red-500">*</span>
          </label>
          <input
            v-model="inputs.toDate"
            type="text"
            placeholder="dd-mm-yyyy"
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              errorToDate ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="errorToDate" class="text-red-500 text-xs mt-1">{{ errorToDate }}</p>
        </div>

        <!-- Search Button -->
        <div class="flex items-end">
          <button
            @click="search"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            <i class="fa fa-search mr-2"></i>
            Tìm kiếm
          </button>
        </div>
      </div>

      <!-- Excel Export Button -->
      <div class="mt-4">
        <download-excel
          :data="excelData"
          :fields="excelFields"
          type="csv"
          name="bao_cao_sua_bill_cu.xls"
          class="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          <i class="fa fa-file-excel-o mr-2"></i>
          Xuất Excel
        </download-excel>
      </div>
    </div>

    <!-- Results Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        <p class="text-gray-600 mt-4">Đang tải dữ liệu...</p>
      </div>

      <!-- Data Table -->
      <div v-else-if="data.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số bill</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền bill gốc</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền bill sửa</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sửa</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người sửa</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ item.stt }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ item.bill_number }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{{ formatCurrency(item.old_total) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{{ formatCurrency(item.new_total) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ item.created_at }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ item.staff_name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <i class="fa fa-inbox fa-3x text-gray-400 mb-4"></i>
        <p class="text-gray-600">Không có dữ liệu</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

export default {
  name: 'EditOldBillReport',
  setup() {
    const toast = useToast()
    const { formatCurrency } = useFormatters()

    return {
      toast,
      formatCurrency
    }
  },
  data() {
    return {
      inputs: {
        fromDate: '',
        toDate: ''
      },
      data: [],
      loading: false,
      firstSearch: true
    }
  },
  computed: {
    errorFromDate() {
      if (!this.inputs.fromDate) {
        return 'Vui lòng chọn từ ngày'
      }
      if (!commonFunc.checkDate(this.inputs.fromDate)) {
        return 'Ngày không đúng định dạng dd-mm-yyyy'
      }
      return ''
    },
    errorToDate() {
      if (!this.inputs.toDate) {
        return 'Vui lòng chọn đến ngày'
      }
      if (!commonFunc.checkDate(this.inputs.toDate)) {
        return 'Ngày không đúng định dạng dd-mm-yyyy'
      }
      return ''
    },
    excelData() {
      return this.data.map(item => ({
        stt: item.stt,
        bill_number: item.bill_number,
        old_total: item.old_total,
        new_total: item.new_total,
        created_at: item.created_at,
        staff_name: item.staff_name
      }))
    },
    excelFields() {
      return {
        'STT': 'stt',
        'Số bill': 'bill_number',
        'Thành tiền bill gốc': 'old_total',
        'Thành tiền bill sửa': 'new_total',
        'Ngày sửa': 'created_at',
        'Người sửa': 'staff_name'
      }
    }
  },
  mounted() {
    // Set default date range (last 7 days)
    const today = new Date()
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    
    this.inputs.toDate = this.formatDateInput(today)
    this.inputs.fromDate = this.formatDateInput(lastWeek)
  },
  methods: {
    formatDateInput(date) {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    },
    checkFromDateAndToDate() {
      if (this.errorFromDate || this.errorToDate) {
        return false
      }

      const fromParts = this.inputs.fromDate.split('-')
      const toParts = this.inputs.toDate.split('-')
      const fromDate = new Date(fromParts[2], fromParts[1] - 1, fromParts[0])
      const toDate = new Date(toParts[2], toParts[1] - 1, toParts[0])

      if (fromDate > toDate) {
        this.toast.error('Từ ngày phải nhỏ hơn đến ngày')
        return false
      }

      // Check max 62 days
      const diffTime = Math.abs(toDate - fromDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 62) {
        this.toast.error('Khoảng thời gian không được vượt quá 62 ngày')
        return false
      }

      return true
    },
    async search() {
      if (!this.checkFromDateAndToDate()) {
        return
      }

      this.firstSearch = false
      this.loading = true

      const params = {
        from_date: this.inputs.fromDate,
        to_date: this.inputs.toDate
      }

      try {
        const response = await adminAPI.getEditOldBillReport(params)
        const items = response.data.data || []
        
        // Add stt (sequence number) to each item
        this.data = items.map((item, index) => ({
          ...item,
          stt: index + 1
        }))
      } catch (error) {
        console.error('Error fetching edit old bill report:', error)
        this.toast.error('Không thể tải dữ liệu. Vui lòng thử lại.')
        this.data = []
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
