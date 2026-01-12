<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Báo cáo sửa giá</h2>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <!-- Order By -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
          <select
            v-model="inputs.orderBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="payment_at asc">Thời gian tăng dần</option>
            <option value="payment_at desc">Thời gian giảm dần</option>
          </select>
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
        <button
          @click="handleExportExcel"
          class="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          <i class="fa fa-file-excel-o mr-2"></i>
          Xuất Excel
        </button>
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
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bàn</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số bill</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền thay đổi</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ item.payment_at }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ item.table_name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ item.staff_name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ item.bill_number }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{{ formatCurrency(item.total_edit_price) }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">
                <div v-for="(food, foodIndex) in item.foods" :key="foodIndex">
                  <template v-if="food.edit_price != 0">
                    <span v-if="food.edit_price < 0" class="text-red-600">
                      Giảm: {{ formatCurrency(Math.abs(food.edit_price)) }}
                    </span>
                    <span v-else class="text-green-600">
                      Tăng: {{ formatCurrency(food.edit_price) }}
                    </span>
                    <span class="text-gray-600">
                      - [Số lượng]: {{ food.quantity }} [Tên món]: {{ food.name }}
                    </span>
                  </template>
                </div>
              </td>
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
import { useExcelExport } from '@/composables/useExcelExport'

export default {
  name: 'EditPriceReport',
  setup() {
    const toast = useToast()
    const { formatCurrency } = useFormatters()
    const { exportToExcel } = useExcelExport()

    return {
      toast,
      formatCurrency,
      exportToExcel
    }
  },
  data() {
    return {
      inputs: {
        fromDate: '',
        toDate: '',
        orderBy: 'payment_at asc'
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
      return this.data.map((item, index) => ({
        stt: index + 1,
        payment_at: item.payment_at,
        table_name: item.table_name,
        staff_name: item.staff_name,
        bill_number: item.bill_number
      }))
    },
    excelFields() {
      return {
        'STT': 'stt',
        'Thời gian': 'payment_at',
        'Bàn': 'table_name',
        'Nhân viên': 'staff_name',
        'Số bill': 'bill_number'
      }
    }
  },
  mounted() {
    // Set default date range (today)
    const today = new Date()
    this.inputs.toDate = this.formatDateInput(today)
    this.inputs.fromDate = this.formatDateInput(today)
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
        to_date: this.inputs.toDate,
        order_by: this.inputs.orderBy
      }

      try {
        const response = await adminAPI.getReportEditPrice(params)
        this.data = response.data.data || []
      } catch (error) {
        console.error('Error fetching edit price report:', error)
        this.toast.error('Không thể tải dữ liệu. Vui lòng thử lại.')
        this.data = []
      } finally {
        this.loading = false
      }
    },

    handleExportExcel() {
      this.exportToExcel(
        this.excelData,
        this.excelFields,
        'Báo Cáo Sửa Giá',
        'bao_cao_sua_gia.xls'
      )
    }
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
