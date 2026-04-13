<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow p-6">
      <div>
        <h3 class="text-xl font-semibold text-center text-orange-600 mb-4">Lịch Sử Khách Hàng</h3>
      </div>
      <hr class="my-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block mb-2">Tên</label>
          <input id="name" v-model="inputs.name" type="text" autocomplete="new-password" class="form-control w-full" maxlength="75">
        </div>
        <div>
          <label class="block mb-2">Số điện thoại</label>
          <input id="price" v-model="inputs.phone" type="text" autocomplete="new-password" class="form-control w-full" maxlength="11" @keyup="integerOnly($event.target)">
        </div>
        <div>
          <label class="block mb-2">Từ ngày</label>
          <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus"></datepicker>
        </div>
        <div>
          <label class="block mb-2">Đến ngày</label>
          <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus"></datepicker>
        </div>
      </div>

      <div class="mb-4">
        <button class="btn btn-primary" :disabled="onSearch" @click="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 clear-both">
        <div>
          Số kết quả: {{items.length}}
        </div>
        <div class="text-right">
          <button class="btn btn-success" @click="exportExcel()">
              <i class="fa fa-file-excel-o"></i> Xuất Excel
            </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <span v-show="loading" class="loading-more"><i class="fa fa-spinner fa-spin fa-2x text-blue-500"></i></span>
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">STT</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Ngày</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Tên k.H</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Số điện thoại</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Loại giao dịch</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Số hoá đơn</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Tổng tiền SP</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Thành tiền</th>
              <th class="px-4 py-3 border"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 text-center font-bold text-orange-600 border" colspan="6">Tổng</td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border">{{currencyFormat(sum_sub_total)}}</td>
              <td class="px-4 py-3 text-right font-bold text-orange-600 border">{{currencyFormat(sum_total)}}</td>
              <td class="border"></td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap border">{{item.stt}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.created_at}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.customer_name}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.customer_phone}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.trade_type}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.bill_number}}</td>
              <td class="px-4 py-3 text-right whitespace-nowrap border">{{currencyFormat(item.sub_total)}}</td>
              <td class="px-4 py-3 text-right whitespace-nowrap border">{{currencyFormat(item.total)}}</td>
              <td class="px-4 py-3 text-center border">
                <button class="btn btn-success btn-width-120" @click="goToDetail(item.id)">
                  Chi tiết
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <span class="loading-more">--Hết--</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import customerApi from '@/api/customer'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'

const router = useRouter()
const { popToast } = useToast()

const inputs = ref({
  name: null,
  phone: null,
  from_date: null,
  to_date: null
})
const items = ref([])
const excel_fields = ref({
  'Ngày': 'created_at',
  'Tên K.H': 'customer_name',
  'Số điện thoại': 'customer_phone',
  'Số Bill': 'bill_number',
  'Loại giao dịch': 'trade_type',
  'Tổng tiền SP': 'sub_total',
  'Thành Tiền': 'total'
})
const sum_sub_total = ref(0)
const sum_total = ref(0)
const onSearch = ref(false)
const loading = ref(false)

const formatDateLocal = (date) => {
  if (!(date instanceof Date)) return date
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const prepareToSearch = () => {
  items.value = []
  search()
}

const search = () => {
  if (onSearch.value) return
  onSearch.value = true
  loading.value = true

  let params = {
    "name": inputs.value.name,
    "phone": inputs.value.phone,
    "from_date": formatDateLocal(inputs.value.from_date),
    "to_date": formatDateLocal(inputs.value.to_date)
  }

  customerApi.getCustomerHistory(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data

      // Calculate sum
      sum_sub_total.value = 0
      sum_total.value = 0
      for (let i in items.value) {
        sum_sub_total.value += items.value[i].sub_total
        sum_total.value += items.value[i].total
      }
    } else {
      items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const goToDetail = (id) => {
  let routeData = router.resolve({ path: '/trade-detail/' + id })
  window.open(routeData.href, '_blank')
}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const currencyFormat = (num) => {
  let result = ""
  if (num == 0) {
    return "0"
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const exportExcel = () => {
  const data = items.value
  const fields = excel_fields.value
  if (!data || data.length === 0) return
  const headers = Object.keys(fields)
  const rows = data.map(item => headers.map(header => {
    const f = fields[header]
    if (typeof f === 'string') return item[f] !== undefined ? item[f] : ''
    const raw = item[f.field] !== undefined ? item[f.field] : ''
    return f.callback ? f.callback(raw) : raw
  }))
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Lịch sử khách hàng')
  XLSX.writeFile(wb, 'lich_su_khach_hang.xls', { bookType: 'xls' })
}

onMounted(() => {
  // Get default from date and to date
  let dateNow = new Date()
  inputs.value.from_date = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1)
  inputs.value.to_date = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0)

  // Load list when load page
  search()
})
</script>
