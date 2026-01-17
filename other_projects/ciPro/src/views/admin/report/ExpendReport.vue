<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <h4 class="text-center text-xl font-semibold text-gray-800 mb-4">Báo Cáo Chi Phí Của Đơn Hàng Đã Hoàn Thành</h4>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Thời gian</label>
          <select v-model="time_option" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in timeOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label v-show="time_option != 5" class="block text-sm font-medium mb-1">{{time_option == 1 ? 'Từ ngày' : 'Năm' }}</label>
          <Datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
          <select v-show="time_option != 1 && time_option != 5" v-model="year_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in yearOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label v-show="time_option == 1 || time_option == 2 || time_option == 3" class="block text-sm font-medium mb-1">
            {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
          </label>
          <Datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
          <select v-show="time_option == 2" v-model="month_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in monthOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
          <select v-show="time_option == 3" v-model="quarter_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-6">
          <label class="block text-sm font-medium mb-1">Nhân viên</label>
          <multiselect
            v-model="inputs.staff_in_charge"
            :options="optionsStaff"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Tất cả--"
            label="text"
            track-by="text">
          </multiselect>
        </div>
      </div>

      <div class="mt-4 mb-4 text-right">
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
          @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="mb-4">
        <p>Tổng số tiền chi: {{currencyFormat(sum_expend)}}</p>
      </div>

      <div class="flex justify-between items-center mb-4">
        <div>
          Số kết quả: {{total_row}}
        </div>
        <div v-if="excel_items.length > 0">
          <button
            @click="exportToExcel"
            class="btn btn-default text-header bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <b>Xuất Excel</b>
          </button>
        </div>
      </div>

      <div class="table-cus">
        <table class="table table-bordered table-striped fixed_header">
          <thead>
            <tr>
              <th style="width:5%" class="text-center">STT</th>
              <th style="width:12%" class="text-center">Ngày phát sinh</th>
              <th style="width:12%" class="text-center">Nhân viên</th>
              <th style="width:14%" class="text-center">Mã ĐH bán</th>
              <th style="width:14%" class="text-center">Ngày hoàn thành đơn</th>
              <th style="width:14%" class="text-center">Mã phiếu chi</th>
              <th style="width:12%" class="text-center">Số tiền</th>
              <th style="width:17%" class="text-center">Nội dung chi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td class="text-center">{{index + 1}}</td>
              <td>{{item.accounting_date}}</td>
              <td>{{item.staff_name}}</td>
              <td>{{item.order_sell_number}}</td>
              <td>{{item.finished_date}}</td>
              <td>{{item.fund_number}}</td>
              <td class="text-right">{{currencyFormat(item.amount)}}</td>
              <td>{{item.description}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
      <span class="loading-more" v-if="hasNext === false">--Hết--</span>
      <span class="loading-more" v-if="hasNext === true && total_row != 0"><i class="fa fa-angle-double-down has-next"></i></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import reportApi from '@/api/report'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'

const { popToast } = useToast()

const timeOptions = ref([
  {"value": 1, "text": 'Ngày'},
  {"value": 2, "text": 'Tháng'},
  {"value": 3, "text": 'Quý'},
  {"value": 4, "text": 'Năm'},
  {"value": 5, "text": 'Tất cả'}
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
  status_id: null,
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02'),
  staff_in_charge: null
})
const loadingOptions = ref(false)
const optionsStaff = ref([])
const items = ref([])
const sum_expend = ref(0)
const hasNext = ref(true)
const loading = ref(false)
const total_row = ref(0)
const loadByScroll = ref(false)
const pageLimit = Constant.PAGE_LIMIT
const offset = ref(0)
const excel_items = ref([])
const excel_fields = {
  'Ngày phát sinh': 'accounting_date',
  'Nhân viên': 'staff_name',
  'Mã ĐH bán' : 'order_sell_number',
  'Ngày hoàn thành đơn' : 'finished_date',
  'Mã phiếu chi' : 'fund_number',
  'Số tiền' : 'amount'
}
const isGetExcelItems = ref(false)

const onScroll = (event) => {
  if(loading.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + pageLimit
      loadByScroll.value = true
      search()
    }
  }
}

const prepareDateInput = () => {
  let dateNow = new Date()
  let currentYear = dateNow.getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }

  month_input.value = dateNow.getMonth() + 1

  // Check URL params
  let params = new URL(location.href).searchParams

  if (params) {
    if (params.get('to_date')) {
      inputs.value.to_date = new Date(params.get('to_date'))
    } else {
      let to_date = dateNow.toJSON().slice(0,10)
      inputs.value.to_date = new Date(to_date)
    }

    if (params.get('from_date')) {
      inputs.value.from_date = new Date(params.get('from_date'))
    } else {
      let from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
      inputs.value.from_date = from_date
    }

    if (params.get('staff_id')) {
      inputs.value.staff_in_charge = {"value": params.get('staff_id'), "text": ''}
    }
  }
}

const getOptionRelated = () => {
  loadingOptions.value = true

  let params = {
    'staffs': true,
  }

  reportApi.getOptionsRelatedReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let options = res.data.data

      optionsStaff.value = options.staffs
      optionsStaff.value.unshift({value: null, text: "-- Tất cả --"})

      if (inputs.value.staff_in_charge && inputs.value.staff_in_charge.value) {
        for(let staff of optionsStaff.value) {
          if(staff.value == inputs.value.staff_in_charge.value) {
            inputs.value.staff_in_charge = staff
            break
          }
        }
      } else {
        inputs.value.staff_in_charge = optionsStaff.value[0]
      }
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getExcelItem = (params) => {
  if(isGetExcelItems.value) {
    return
  }

  excel_items.value = []

  params.limit = 999999

  reportApi.getExpendReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      excel_items.value = res.data.data.expends
      isGetExcelItems.value = true
    }
  }).catch(err => {})
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false

  search()
}

const search = () => {
  if(loading.value) {
    return
  }

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
    staff_id: inputs.value.staff_in_charge && inputs.value.staff_in_charge.value ? inputs.value.staff_in_charge.value : null,
    from_date: fromDate,
    to_date: toDate,
    limit: pageLimit,
    offset: offset.value
  }

  reportApi.getExpendReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.expends
      total_row.value = res.data.data.total_row
      sum_expend.value = res.data.data.sum_expend

      if(loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if(offset.value + pageLimit >= res.data.data.total_row) {
        hasNext.value = false
      }

      if(!isGetExcelItems.value) {
        getExcelItem(params)
      }
    } else {
      items.value = []
      excel_items.value = []
    }
    loading.value = false
  }).catch(err => {
    loading.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const currencyFormat = (num) => {
  let result = ""
  if(num == 0) return "0"
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const exportToExcel = () => {
  // Prepare data with field mappings
  const exportData = excel_items.value.map(item => ({
    'Ngày': item.date,
    'Nội dung': item.description,
    'Số tiền': item.amount,
    'Nhân viên': item.staff_name
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo chi phí')
  XLSX.writeFile(workbook, 'bao_cao_chi_phi.xlsx')
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  prepareDateInput()
  getOptionRelated()
  prepareToSearch()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
