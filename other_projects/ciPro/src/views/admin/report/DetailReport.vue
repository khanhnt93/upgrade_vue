<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <h4 class="text-center text-xl font-semibold text-orange-600 mb-4">Báo Cáo Doanh Thu - Lợi Nhuận Chi Tiết</h4>

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
          <label class="block text-sm font-medium mb-1">{{time_option == 1 ? 'Từ ngày' : 'Năm' }}</label>
          <Datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
          <select v-show="time_option != 1" v-model="year_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in yearOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label v-show="time_option != 4" class="block text-sm font-medium mb-1">{{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}</label>
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

        <div class="md:col-span-3">
          <label class="block text-sm font-medium mb-1">Nhóm SP</label>
          <multiselect
            v-model="productGroupSelect"
            :options="productGroupOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn nhóm sản phẩm--"
            label="name"
            track-by="name"
            @input="changeProductGroup">
          </multiselect>
        </div>

        <div class="md:col-span-3">
          <label class="block text-sm font-medium mb-1">Loại SP</label>
          <multiselect
            v-model="productTypeSelect"
            :options="productTypeOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn loại sản phẩm--"
            label="name"
            track-by="name">
          </multiselect>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3">
          <label class="block text-sm font-medium mb-1">Số ĐH bán</label>
          <input
            id="order_sell_number"
            type="text"
            maxlength="100"
            autocomplete="new-password"
            class="form-control border border-gray-300 rounded px-3 py-2 w-full"
            v-model="inputs.order_sell_number">
        </div>

        <div class="md:col-span-3">
          <label class="block text-sm font-medium mb-1">Hãng SP</label>
          <multiselect
            v-model="productBrandSelect"
            :options="productBrandOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn hãng SP--"
            label="text"
            track-by="text">
          </multiselect>
        </div>

        <div class="md:col-span-3">
          <label class="block text-sm font-medium mb-1">Mã SP</label>
          <input
            id="codeProductCus"
            type="text"
            autocomplete="new-password"
            class="form-control border border-gray-300 rounded px-3 py-2 w-full"
            v-model="inputs.product_code"
            maxlength="255">
        </div>

        <div class="md:col-span-3">
          <label class="block text-sm font-medium mb-1">Nhân viên</label>
          <select
            id="created_by"
            v-model="inputs.staff_in_charge"
            class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in optionsStaff" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-4 mb-4 text-right">
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
          @click.prevent="search">
          Tìm Kiếm
        </button>
      </div>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

      <div v-show="items.length > 0" class="mb-4">
        <p class="text-header">Doanh thu: <b>{{currencyFormat(revenue_total)}}đ</b></p>
        <p class="text-header">Lợi nhuận: <b>{{currencyFormat(profit_total)}}đ</b></p>
      </div>

      <div v-show="items.length > 0" class="flex justify-between items-center mb-4">
        <div>
          Số kết quả: {{items.length}}
        </div>
        <div>
          <button
            @click="exportToExcel"
            class="btn btn-default text-header bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <b>Xuất Excel</b>
          </button>
        </div>
      </div>

      <div class="mt-4 mb-4">
        <div class="table-cus">
          <table class="table table-bordered table-striped fixed_header" v-show="items.length > 0">
            <thead>
              <tr class="text-center">
                <th colspan="9"></th>
                <th colspan="2">Doanh thu</th>
                <th colspan="2">Giá vốn</th>
                <th colspan="2"></th>
              </tr>
              <tr class="text-center">
                <th style="width:2%">STT</th>
                <th style="width:6%">Ngày</th>
                <th style="width:6%">Mã ĐH</th>
                <th style="width:8%">Nhóm SP</th>
                <th style="width:8%">Loại SP</th>
                <th style="width:8%">Hãng SP</th>
                <th style="width:8%">Mã SP</th>
                <th style="width:9%">Tên SP</th>
                <th style="width:5%">Số lượng</th>
                <th style="width:7%">Đơn giá</th>
                <th style="width:7%">Thành tiền</th>
                <th style="width:7%">Đơn giá</th>
                <th style="width:7%">Thành tiền</th>
                <th style="width:7%">Lợi nhuận</th>
                <th style="width:5%">Tỉ suất lợi nhuận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in items" :key="item.stt">
                <td>{{item.stt}}</td>
                <td>{{item.finished_date}}</td>
                <td>{{item.order_sell_number}}</td>
                <td>{{item.product_group_name}}</td>
                <td>{{item.product_type_name}}</td>
                <td>{{item.brand_name}}</td>
                <td>{{item.product_code}}</td>
                <td>{{item.product_name}}</td>
                <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                <td class="text-right">{{currencyFormat(item.price_sell)}}</td>
                <td class="text-right">{{currencyFormat(item.amount_sell)}}</td>
                <td class="text-right">{{currencyFormat(item.price_buy)}}</td>
                <td class="text-right">{{currencyFormat(item.amount_buy)}}</td>
                <td class="text-right">{{currencyFormat(item.profit)}}</td>
                <td class="text-right">{{item.profit_percent}}%</td>
              </tr>
            </tbody>
          </table>

          <p v-show="firstSearch == false && items.length == 0" class="text-center">Không có kết quả nào</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import reportApi from '@/api/report'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'

const { popToast } = useToast()

const inputs = ref({
  from_date: null,
  to_date: null,
  order_sell_number: null,
  staff_in_charge: null,
  product_group_id: null,
  product_type_id: null,
  product_brand_id: null,
  product_code: null
})
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
const time_option = ref(2)
const year_input = ref(2024)
const quarter_input = ref(1)
const month_input = ref(1)
const optionsStaff = ref([])
const productBrandOptions = ref([])
const productBrandSelect = ref({})
const productGroupOptions = ref([])
const productGroupSelect = ref({})
const productTypeOptionStore = ref([])
const productTypeSelect = ref({})
const productTypeOptions = ref([])
const loadingOptions = ref(false)
const items = ref([])
const loading = ref(false)
const excel_fields = {
  'STT': 'stt',
  'Ngày': 'finished_date',
  'Mã ĐH': 'order_sell_number',
  'Nhóm SP': 'product_group_name',
  'Loại SP': 'product_type_name',
  'Hãng SP': 'brand_name',
  'Mã SP': 'product_code',
  'Tên SP': 'product_name',
  'Số lượng': 'quantity',
  'Doanh thu - Đơn giá': 'price_sell',
  'Doanh thu - Thành tiền': 'amount_sell',
  'Giá vốn - Đơn giá': 'price_buy',
  'Giá vốn - Thành tiền': 'amount_buy',
  'Lợi nhuận': 'profit',
  'Tỉ suất lợi nhuận': 'profit_percent'
}
const firstSearch = ref(true)
const revenue_total = ref(0)
const profit_total = ref(0)

const prepareDateInput = () => {
  let dateNow = new Date()
  inputs.value.to_date = new Date(dateNow.toJSON().slice(0,10))
  inputs.value.from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
  let currentYear = new Date().getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }

  month_input.value = dateNow.getMonth() + 1
}

const getOptionRelated = () => {
  loadingOptions.value = true

  reportApi.getOptionsRelatedDetailReport().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let options = res.data.data

      productGroupOptions.value = options.product_groups
      productGroupOptions.value.unshift({name: "", id: null})

      productTypeOptionStore.value = JSON.parse(JSON.stringify(options.product_types))
      productTypeOptions.value = options.product_types
      productTypeOptions.value.unshift({name: "", id: null, product_group_id: null})

      productBrandOptions.value = options.product_brands
      productBrandOptions.value.unshift({text: "", value: null})

      optionsStaff.value = options.staffs
      optionsStaff.value.unshift({text: "", value: null})
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const changeProductGroup = () => {
  if(productGroupSelect.value && productGroupSelect.value.id) {
    productTypeOptions.value = [{"id": null, "name": "", "product_group_id": null}]
    for (let i in productTypeOptionStore.value) {
      if(productGroupSelect.value.id == productTypeOptionStore.value[i].product_group_id) {
        productTypeOptions.value.push(productTypeOptionStore.value[i])
      }
    }
  } else {
    productTypeOptions.value = JSON.parse(JSON.stringify(productTypeOptionStore.value))
    let itemTypeEmpty = {"id": null, "name": "", "product_group_id": null}
    productTypeOptions.value.unshift(itemTypeEmpty)
  }
}

const search = () => {
  if (loading.value) { return }

  if(time_option.value == 2) {
    inputs.value.from_date = year_input.value + '-' + month_input.value + '-01'
    inputs.value.to_date = year_input.value + '-' + month_input.value + '-' + new Date(year_input.value, month_input.value, 0).getDate()
  }
  if(time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(quarter_input.value)
    inputs.value.from_date = year_input.value + '-' + quarter + '-01'
    inputs.value.to_date = year_input.value + '-' + (quarter + 2) + '-' + new Date(year_input.value, (quarter + 2), 0).getDate()
  }
  if(time_option.value == 4) {
    inputs.value.from_date = year_input.value + '-01-01'
    inputs.value.to_date = year_input.value + '-12-' + new Date(year_input.value, 12, 0).getDate()
  }

  let params = {
    "from_date": inputs.value.from_date,
    "to_date": inputs.value.to_date,
    "order_sell_number": inputs.value.order_sell_number,
    "product_group_id": productGroupSelect.value && productGroupSelect.value.id ? productGroupSelect.value.id : null,
    "product_type_id": productTypeSelect.value && productTypeSelect.value.id ? productTypeSelect.value.id : null,
    "product_brand_id": productBrandSelect.value && productBrandSelect.value.value ? productBrandSelect.value.value : null,
    "product_code": inputs.value.product_code,
    "staff_in_charge": inputs.value.staff_in_charge
  }

  loading.value = true

  reportApi.getDetailReport(params).then(res => {
    if(res && res.data && res.data.data) {
      items.value = res.data.data

      revenue_total.value = 0
      profit_total.value = 0
      for(let item of items.value) {
        revenue_total.value += parseInt(item.amount_sell)
        profit_total.value += parseInt(item.profit)
      }
    }

    firstSearch.value = false
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    firstSearch.value = false
    loading.value = false
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
  const exportData = items.value.map(item => ({
    'Mã SP': item.product_code,
    'Tên SP': item.product_name,
    'Số lượng': item.quantity,
    'Giá bán': item.price_sell,
    'Tiền bán': item.amount_sell,
    'Giá nhập': item.price_buy,
    'Tiền nhập': item.amount_buy,
    'Lợi nhuận': item.profit,
    'Tỷ lệ LN': item.profit_percent + '%'
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo chi tiết')
  XLSX.writeFile(workbook, 'bao_cao_chi_tiet.xlsx')
}

onMounted(() => {
  prepareDateInput()
  getOptionRelated()
  search()
})
</script>
