<template>
  <div class="w-full mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Lịch Sử Xoá Nợ</h4>
      </div>
      <hr class="my-4">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block mb-2 font-medium">Thời gian</label>
          <select v-model="time_option" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in timeOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 font-medium">{{time_option == 1 ? 'Từ ngày' : 'Năm'}}</label>
          <Datepicker v-show="time_option == 1" v-model="inputs.from_date" input-class="datepicker-cus w-full" />
          <select v-show="time_option != 1" v-model="year_input" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in yearOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>

        <div>
          <label v-show="time_option != 4" class="block mb-2 font-medium">
            {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý'}}
          </label>
          <Datepicker v-show="time_option == 1" v-model="inputs.to_date" input-class="datepicker-cus w-full" />
          <select v-show="time_option == 2" v-model="month_input" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in monthOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
          <select v-show="time_option == 3" v-model="quarter_input" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in quarterOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <button
          class="btn btn-primary float-right"
          :disabled="loading"
          @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="flex justify-between items-center mb-4 clear-both pt-2">
        <div>Số kết quả: <span class="font-bold text-gray-700">{{totalRow}}</span></div>
        <button class="btn btn-success" @click="exportExcel()">
          <i class="fa fa-file-excel-o"></i> Xuất Excel
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-2 py-2 w-12">STT</th>
              <th class="border border-gray-300 px-3 py-2 text-center">Ngày lập</th>
              <th class="border border-gray-300 px-3 py-2 text-center">Loại</th>
              <th class="border border-gray-300 px-3 py-2 text-center">Số ĐH xoá nợ</th>
              <th class="border border-gray-300 px-3 py-2 text-center">Tên K.H/NCC</th>
              <th class="border border-gray-300 px-3 py-2 text-center">Số tiền</th>
              <th class="border border-gray-300 px-3 py-2 text-center">Số ngày nợ</th>
              <th class="border border-gray-300 px-3 py-2 text-center">Lý do xoá nợ</th>
              <th class="border border-gray-300 px-3 py-2 text-center">Tài khoản thực hiện</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-3 py-2 text-center">{{index + 1}}</td>
              <td class="border border-gray-300 px-3 py-2">{{item.created_at}}</td>
              <td class="border border-gray-300 px-3 py-2">{{item.type_str}}</td>
              <td class="border border-gray-300 px-3 py-2">{{item.order_number}}</td>
              <td class="border border-gray-300 px-3 py-2">{{item.object_name}}</td>
              <td class="border border-gray-300 px-3 py-2 text-right">{{currencyFormat(item.amount)}}</td>
              <td class="border border-gray-300 px-3 py-2 text-center">{{item.debt_relief_date_number}}</td>
              <td class="border border-gray-300 px-3 py-2">{{item.description}}</td>
              <td class="border border-gray-300 px-3 py-2">{{item.staff_name}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="loading" class="flex justify-center my-4">
        <i class="fa fa-spinner fa-spin fa-2x text-blue-500"></i>
      </div>
      <div v-if="hasNext === false" class="text-center my-4">--Hết--</div>
      <div v-if="hasNext === true && totalRow != 0" class="text-center my-4">
        <i class="fa fa-angle-double-down text-2xl"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'
import fundApi from '@/api/fund'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'

const { popToast } = useToast()

const timeOptions = ref([
  {"value": 1, "text": 'Ngày'},
  {"value": 2, "text": 'Tháng'},
  {"value": 3, "text": 'Quý'},
  {"value": 4, "text": 'Năm'}
])
const yearOptions = ref([])
const quarterOptions = ref([
  {"value": 1, "text": 'Quý 1'},
  {"value": 2, "text": 'Quý 2'},
  {"value": 3, "text": 'Quý 3'},
  {"value": 4, "text": 'Quý 4'}
])
const monthOptions = ref([
  {"value": 1, "text": 'Tháng 1'},
  {"value": 2, "text": 'Tháng 2'},
  {"value": 3, "text": 'Tháng 3'},
  {"value": 4, "text": 'Tháng 4'},
  {"value": 5, "text": 'Tháng 5'},
  {"value": 6, "text": 'Tháng 6'},
  {"value": 7, "text": 'Tháng 7'},
  {"value": 8, "text": 'Tháng 8'},
  {"value": 9, "text": 'Tháng 9'},
  {"value": 10, "text": 'Tháng 10'},
  {"value": 11, "text": 'Tháng 11'},
  {"value": 12, "text": 'Tháng 12'}
])
const time_option = ref(1)
const year_input = ref(2024)
const quarter_input = ref(1)
const month_input = ref(1)

const inputs = ref({
  from_date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7, 0, 0, 0),
  to_date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
})
const items = ref([])
const excel_items = ref([])
const excel_fields = ref({
  'Ngày lập': 'created_at',
  'Loại': 'type_str',
  'Số ĐH xoá nợ': 'order_number',
  'Tên K.H/NCC': 'object_name',
  'Số tiền': 'amount',
  'Số ngày nợ tới thời điểm xoá nợ': 'debt_relief_date_number',
  'Lý do xóa nợ': 'description',
  'Tài khoản thực hiện': 'staff_name'
})
const isGetExcelItems = ref(false)
const loadByScroll = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const totalRow = ref(0)

const prepareDateInput = () => {
  const dateNow = new Date()
  const y = dateNow.getFullYear()
  const m = dateNow.getMonth()
  const d = dateNow.getDate()
  inputs.value.to_date = new Date(y, m, d, 23, 59, 59)
  inputs.value.from_date = new Date(y, m, d - 7, 0, 0, 0)
  let currentYear = y
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }
  month_input.value = dateNow.getMonth() + 1
}

const onScroll = (event) => {
  if(loading.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + pageLimit.value
      loadByScroll.value = true
      search()
    }
  }
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

const search = () => {
  if (loading.value) { return }
  loading.value = true

  let fromDate = inputs.value.from_date
  let toDate = inputs.value.to_date

  if(time_option.value == 2) {
    fromDate = year_input.value + '-' + month_input.value + '-01'
    toDate = year_input.value + '-' + month_input.value + '-' + new Date(year_input.value, month_input.value, 0).getDate()
  }
  if(time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(quarter_input.value)
    fromDate = year_input.value + '-' + quarter + '-01'
    toDate = year_input.value + '-' + (quarter + 2) + '-' + new Date(year_input.value, (quarter + 2), 0).getDate()
  }
  if(time_option.value == 4) {
    fromDate = year_input.value + '-01-01'
    toDate = year_input.value + '-12-' + new Date(year_input.value, 12, 0).getDate()
  }
  if(time_option.value == 5) {
    toDate = new Date().toJSON().slice(0,10)
    fromDate = '2000-01-01'
  }

  let params = {
    "from_date": fromDate,
    "to_date": toDate,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  fundApi.getDebtReliefHis(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data

      if(loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if(!isGetExcelItems.value) {
        getExcelItem(params)
      } else {
        if(parseInt(offset.value) + parseInt(pageLimit.value) >= parseInt(totalRow.value)) {
          hasNext.value = false
        }
      }
    } else {
      items.value = []
    }
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loading.value = false
  })
}

const getExcelItem = (params) => {
  if(isGetExcelItems.value) {
    return
  }

  excel_items.value = []
  params.limit = 999999

  fundApi.getDebtReliefHis(params).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      excel_items.value = res.data.data
      isGetExcelItems.value = true

      totalRow.value = res.data.data.length
      if(parseInt(offset.value) + parseInt(pageLimit.value) >= parseInt(totalRow.value)) {
        hasNext.value = false
      }
    }
  }).catch(err => {})
}

const currencyFormat = (num) => {
  let result = ""
  if(num == 0) {
    return "0"
  }
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const exportExcel = () => {
  const data = excel_items.value
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
  XLSX.utils.book_append_sheet(wb, ws, 'Lịch Sử Xoá Nợ')
  XLSX.writeFile(wb, 'Lịch Sử Xoá Nợ.xls', { bookType: 'xls' })
}

onMounted(() => {
  prepareDateInput()
  prepareToSearch()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.datepicker-cus {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
