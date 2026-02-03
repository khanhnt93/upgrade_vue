<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="mb-4">
          <h4 class="text-center text-xl font-semibold text-orange-600">Lịch Sử Nhà Cung Cấp</h4>
        </div>
        <hr class="mb-6">

        <!-- Search Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Tên</label>
            <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control border rounded px-3 py-2 w-full"
              v-model="inputs.name"
              maxlength="75">
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              id="phone"
              type="text"
              autocomplete="new-password"
              class="form-control border rounded px-3 py-2 w-full"
              v-model="inputs.phone"
              maxlength="11"
              @keyup="integerOnly($event.target)">
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Từ ngày</label>
            <Datepicker
              v-model="inputs.from_date"
              format="yyyy-MM-dd"
              placeholder="yyyy-mm-dd"
              input-class="datepicker-cus" />
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Đến ngày</label>
            <Datepicker
              v-model="inputs.to_date"
              format="yyyy-MM-dd"
              placeholder="yyyy-mm-dd"
              input-class="datepicker-cus" />
          </div>
        </div>

        <div class="flex justify-end mb-4">
          <button
            class="border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded w-32"
            :disabled="onSearch"
            @click="prepareToSearch">
            Tìm Kiếm
          </button>
        </div>

        <!-- Result Count and Excel Export -->
        <div class="flex justify-between items-center mb-4">
          <div>
            Số kết quả: {{items.length}}
          </div>
          <div>
            <button
              @click="exportToExcel"
              class="btn btn-default text-header cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border"
            >
              <b>Xuất Excel</b>
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">STT</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Ngày</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Tên nhà CC</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Số điện thoại</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Loại giao dịch</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Số hoá đơn</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Tổng tiền SP</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Thành tiền</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Total Row -->
              <tr class="bg-gray-50">
                <td colspan="6" class="px-4 py-3 text-center font-bold text-gray-700">Tổng</td>
                <td class="px-4 py-3 text-right font-bold text-gray-700">{{currencyFormat(sum_sub_total)}}</td>
                <td class="px-4 py-3 text-right font-bold text-gray-700">{{currencyFormat(sum_total)}}</td>
                <td></td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-center">{{item.stt}}</td>
                <td class="px-4 py-3 text-center">{{item.created_at}}</td>
                <td class="px-4 py-3">{{item.supplier_name}}</td>
                <td class="px-4 py-3 text-center">{{item.supplier_phone}}</td>
                <td class="px-4 py-3 text-center">{{item.trade_type}}</td>
                <td class="px-4 py-3 text-center">{{item.bill_number}}</td>
                <td class="px-4 py-3 text-right">{{currencyFormat(item.sub_total)}}</td>
                <td class="px-4 py-3 text-right">{{currencyFormat(item.total)}}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-24 text-sm"
                    @click="goToDetail(item.id)">
                    Chi tiết
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-center mt-4 text-gray-500">--Hết--</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import supplierApi from '@/api/supplier'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import * as XLSX from 'xlsx'

const router = useRouter()
const { popToast } = useToast()

const inputs = ref({
  name: null,
  phone: null,
  from_date: new Date(),
  to_date: new Date()
})

const items = ref([])
const excel_fields = {
  'Ngày': 'created_at',
  'Tên K.H': 'supplier_name',
  'Số điện thoại': 'supplier_phone',
  'Số Bill': 'bill_number',
  'Loại giao dịch': 'trade_type',
  'Tổng tiền SP': 'sub_total',
  'Thành Tiền': 'total'
}

const sum_sub_total = ref(0)
const sum_total = ref(0)
const onSearch = ref(false)
const loading = ref(false)
const click = ref(false)

/**
 * Go to detail
 */
const goToDetail = (id) => {
  let routeData = router.resolve({path: '/trade-detail/' + id})
  window.open(routeData.href, '_blank')
}

/**
 * Prepare to search
 */
const prepareToSearch = () => {
  items.value = []
  search()
}

/**
 * Search
 */
const search = () => {
  click.value = true
  if (onSearch.value) { return }

  onSearch.value = true
  loading.value = true

  // Format dates
  let fromDate = inputs.value.from_date
  let toDate = inputs.value.to_date

  if (fromDate instanceof Date) {
    fromDate = fromDate.toISOString().slice(0, 10)
  }
  if (toDate instanceof Date) {
    toDate = toDate.toISOString().slice(0, 10)
  }

  // Define params
  let params = {
    "name": inputs.value.name,
    "phone": inputs.value.phone,
    "from_date": fromDate,
    "to_date": toDate
  }

  // Search
  supplierApi.getSupplierHistory(params).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      items.value = res.data.data

      // Calculate sum
      sum_sub_total.value = 0
      sum_total.value = 0
      for(let i in items.value) {
        sum_sub_total.value += items.value[i].sub_total
        sum_total.value += items.value[i].total
      }
    } else {
      items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    onSearch.value = false
    loading.value = false
  })
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

/**
 * Currency format
 */
const currencyFormat = (num) => {
  let result = ""
  if(num === 0) {
    return "0"
  }
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const exportToExcel = () => {
  // Prepare data with field mappings
  const exportData = items.value.map(item => ({
    'Ngày': item.created_at,
    'Tên K.H': item.supplier_name,
    'Số điện thoại': item.supplier_phone,
    'Số Bill': item.bill_number,
    'Loại giao dịch': item.trade_type,
    'Tổng tiền SP': item.sub_total,
    'Thành Tiền': item.total
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch sử nhà cung cấp')
  XLSX.writeFile(workbook, 'lich_su_nha_cung_cap.xlsx')
}

onMounted(() => {
  // Get default from date and to date
  let dateNow = new Date()
  inputs.value.from_date = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1)
  let dayOfMonth = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0).getDate()
  inputs.value.to_date = new Date(dateNow.getFullYear(), dateNow.getMonth(), dayOfMonth)

  // Load list when load page
  search()
})
</script>

<style scoped>
.form-control {
  display: block;
  width: 100%;
}
.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.datepicker-cus {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.datepicker-cus:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table-cus {
  position: relative;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
