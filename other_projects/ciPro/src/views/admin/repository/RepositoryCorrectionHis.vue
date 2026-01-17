<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4 space-x-2">
          <button
            @click="goToAddInput"
            class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors w-40"
          >
            Thừa hàng hoá
          </button>
          <button
            @click="goToAddOutput"
            class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors w-40"
          >
            Thiếu hàng hoá
          </button>
        </div>

        <h4 class="text-2xl font-semibold text-center mb-4">Lịch Sử Hiệu Chỉnh Kho</h4>
        <hr class="mb-6">

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
            <select
              v-model="time_option"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="opt in timeOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ time_option == 1 ? 'Từ ngày' : 'Năm' }}</label>
            <datepicker
              v-show="time_option == 1"
              v-model="inputs.from_date"
              format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
              input-class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              v-show="time_option != 1"
              v-model="year_input"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="opt in yearOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>

          <div>
            <label v-show="time_option != 4" class="block text-sm font-medium text-gray-700 mb-1">
              {{ time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
            </label>
            <datepicker
              v-show="time_option == 1"
              v-model="inputs.to_date"
              format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
              input-class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              v-show="time_option == 2"
              v-model="month_input"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="opt in monthOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
            <select
              v-show="time_option == 3"
              v-model="quarter_input"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="opt in quarterOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loại hoạt động</label>
            <select
              v-model="inputs.type_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số phiếu</label>
            <input
              type="text"
              maxlength="100"
              v-model="inputs.repository_number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nhóm SP</label>
            <multiselect
              v-model="productGroupSelect"
              :options="productGroupOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn nhóm sản phẩm--"
              label="name"
              track-by="name"
              @input="changeProductGroup"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loại SP</label>
            <multiselect
              v-model="productTypeSelect"
              :options="productTypeOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn loại sản phẩm--"
              label="name"
              track-by="name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hãng SP</label>
            <select
              v-model="inputs.product_brand_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="opt in productBrandOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã SP</label>
            <input
              type="text"
              maxlength="255"
              v-model="inputs.product_code"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên SP</label>
            <input
              type="text"
              maxlength="255"
              v-model="inputs.product_name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <div class="flex justify-end mb-4">
          <button
            @click="prepareToSearch"
            :disabled="onSearch"
            class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px] disabled:opacity-50"
          >
            Tìm Kiếm
          </button>
        </div>

        <div class="flex justify-between items-center mb-4">
          <div class="text-sm text-gray-600">
            Số kết quả: <span class="font-semibold">{{totalRow}}</span>
          </div>
          <button
            @click="exportToExcel"
            class="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors cursor-pointer inline-block"
          >
            <b>Xuất Excel</b>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b" style="width:3%">STT</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b" style="width:8%">Ngày</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b" style="width:8%">Loại hoạt động</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b" style="width:10%">Số phiếu</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b" style="width:9%">Mã hàng</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b" style="width:13%">Tên hàng</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b" style="width:10%">Hãng</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase border-b" style="width:9%">Số lượng</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase border-b" style="width:9%">Đơn giá</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase border-b" style="width:9%">Thành tiền</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b" style="width:9%">Người thao tác</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b" style="width:3%"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.stt}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.created_at}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.type_str}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">
                  <span>{{item.repository_number}}</span>
                  <button
                    v-show="!creatingPHG"
                    v-if="item.type == 1 && item.order_sell_id"
                    @click="preparePrintPHG(item)"
                    class="px-3 py-1 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 text-xs ml-2"
                  >
                    In phiếu xuất kho
                  </button>
                  <span v-show="creatingPHG"><icon name="loading" width="60" /></span>
                </td>
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.product_code}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.product_name}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.brand_name}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 text-right border">{{currencyFormat(item.quantity)}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 text-right border">{{currencyFormat(item.price)}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 text-right border">{{currencyFormat(item.amount)}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.created_by_name}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">
                  <i v-if="isUserRoot" class="fa fa-trash text-red-600 cursor-pointer hover:text-red-900" title="Xoá"
                     @click="deleted(item.id, item.repository_number)"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>
        <div v-if="hasNext === false" class="text-center py-4 text-gray-500">--Hết--</div>
        <div v-if="hasNext === true && totalRow != 0" class="text-center py-4">
          <i class="fa fa-angle-double-down text-2xl text-blue-600 cursor-pointer"></i>
        </div>
      </div>
    </div>

    <!-- Print Content (Hidden) -->
    <div hidden id="contentPrintPHG">
      <img :src="'/static/img/project/print/quotation/header_' + authStore.user.storeId + '.png'" style="width: 100%"/>
      <div style="width:100%; height:35px; font-size: 12px;" class="tr-bg">
        <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center; margin-top: 10px;">
          <b>PHIẾU GIAO HÀNG</b>
        </div>
        <div style="float: right; width: 30%; margin-top: 10px; text-align: center">
          <i class="print-text-right">TP.HCM, Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</i>
        </div>
      </div>
      <div style="width:100%; font-size: 12px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
        <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center;"></div>
        <div style="float: right; width: 30%; margin-top: 5px; margin-bottom: 5px; text-align: center">
          <span>Số: {{currentRepository.order_sell_number}}</span>
        </div>
      </div>

      <div class="custom-line-height">
        <table style="width:100%; font-size: 10px">
          <tbody>
          <tr class="print-pl-2">
            <td style="width:15%" class="print-no-border print-pl-2 print-text-right">
              <u><b> Tên khách hàng: </b></u>
            </td>
            <td colspan="3" class="print-no-border print-text-left">
              <b><span>{{currentRepository.customer_name}}</span></b>
            </td>
          </tr>
          <tr>
            <td style="width:15%" class="print-no-border print-pl-2 print-text-right">Địa chỉ giao hàng: </td>
            <td colspan="3" class="print-no-border print-text-left">{{currentRepository.receiver_address}}</td>
          </tr>
          <tr>
            <td style="width:15%" class="print-no-border print-pl-2 print-text-right">Người nhận hàng: </td>
            <td style="width:35%" class="print-no-border print-text-left">{{currentRepository.receiver_name}}</td>
            <td style="width:15%" class="print-no-border print-pl-2 print-text-right">Điện thoại: </td>
            <td class="print-no-border print-text-left">{{currentRepository.receiver_phone}}</td>
          </tr>
          <tr>
            <td style="width:15%" class="print-no-border print-pl-2 print-text-right">Ghi chú về giao hàng: </td>
            <td colspan="3" class="print-no-border print-pl-2 print-text-left">{{currentRepository.shipping_note}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <br>
      <div class="print-table-border">
        <table style="width:100%; font-size: 10px" class="custom-line-height">
          <thead>
          <tr class="print-text-center tr-bg" style="background-color: #eeece1">
            <th>STT</th>
            <th>MÃ SẢN PHẨM</th>
            <th>MÔ TẢ SẢN PHẨM</th>
            <th>HÃNG SX</th>
            <th>ĐVT</th>
            <th style="width:50px">SL</th>
            <th>GHI CHÚ</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in currentRepository.products" :key="item.product_id">
            <td class="print-text-center">{{index + 1}}</td>
            <td>{{item.product_code}}</td>
            <td>{{item.product_name}}</td>
            <td class="print-text-center">{{item.brand_name}}</td>
            <td class="print-text-center">{{item.unit_name}}</td>
            <td style="width:50px" class="print-text-center">{{currencyFormat(item.quantity)}}</td>
            <td>{{item.note}}</td>
          </tr>
          <tr>
            <td colspan="5" class="print-text-center"><b>TỔNG CỘNG</b></td>
            <td class="print-text-right"><b>{{currentRepository.total_quantity + ''}}</b></td>
            <td></td>
          </tr>
          </tbody>
        </table>
        <div>
          <p style="font-size: 10px"><b>Chứng từ kèm theo:</b></p>
          <p style="font-size: 10px" class="print-pl-2">{{currentRepository.issue_invoice ? '• Hóa đơn GTGT' : ''}}</p>
        </div>
        <div>
          <p style="font-size: 10px"><b>Liên hệ với Nhân viên kinh doanh khi cần:</b></p>
          <p style="font-size: 10px" class="print-pl-2">• Tên: {{currentRepository.staff_in_charge_name}}</p>
          <p style="font-size: 10px" class="print-pl-2">• Điện thoại: {{currentRepository.staff_in_charge_phone}}</p>
          <p style="font-size: 10px" class="print-pl-2">• Email: {{currentRepository.staff_in_charge_email}}</p>
        </div>

        <br><br>
        <div>
          <table style="width:100%; font-size: 10px">
            <tbody>
            <tr>
              <td class="print-no-border print-text-center"><b>NGƯỜI NHẬN HÀNG</b></td>
              <td class="print-no-border print-text-center"><b>NGƯỜI GIAO HÀNG</b></td>
              <td class="print-no-border print-text-center"><b>NGƯỜI LẬP PHIẾU</b></td>
            </tr>
            <tr>
              <td class="print-no-border print-text-center" style="color: #C0C0C0">(Ký, họ tên)</td>
              <td class="print-no-border print-text-center" style="color: #C0C0C0">(Ký, họ tên)</td>
              <td class="print-no-border print-text-center" style="color: #C0C0C0">(Ký, họ tên)</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import repositoryApi from '@/api/repository'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'

const router = useRouter()
const authStore = useAuthStore()
const { popToast } = useToast()

// Data
const timeOptions = [
  {value: 1, text: 'Ngày'},
  {value: 2, text: 'Tháng'},
  {value: 3, text: 'Quý'},
  {value: 4, text: 'Năm'}
]
const yearOptions = ref([])
const quarterOptions = [
  {value: 1, text: 'Quý 1'},
  {value: 2, text: 'Quý 2'},
  {value: 3, text: 'Quý 3'},
  {value: 4, text: 'Quý 4'}
]
const monthOptions = [
  {value: 1, text: 'Tháng 1'}, {value: 2, text: 'Tháng 2'}, {value: 3, text: 'Tháng 3'},
  {value: 4, text: 'Tháng 4'}, {value: 5, text: 'Tháng 5'}, {value: 6, text: 'Tháng 6'},
  {value: 7, text: 'Tháng 7'}, {value: 8, text: 'Tháng 8'}, {value: 9, text: 'Tháng 9'},
  {value: 10, text: 'Tháng 10'}, {value: 11, text: 'Tháng 11'}, {value: 12, text: 'Tháng 12'}
]
const time_option = ref(1)
const year_input = ref(2023)
const quarter_input = ref(1)
const month_input = ref(1)
const typeOptions = [
  {value: null, text: ''},
  {value: 0, text: 'Nhập vào'},
  {value: 1, text: 'Bán ra'}
]
const productBrandOptions = ref([])
const productGroupOptions = ref([])
const productGroupSelect = ref({})
const productTypeSelect = ref({})
const productTypeOptions = ref([])
const productTypeOptionStore = ref([])
const loadingOptions = ref(false)
const inputs = reactive({
  is_correction: true,
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02'),
  type_id: null,
  repository_number: null,
  product_group_id: null,
  product_type_id: null,
  product_brand_id: null,
  product_code: null,
  product_name: null
})
const items = ref([])
const excel_items = ref([])
const excel_fields = {
  'Ngày tạo': 'created_at',
  'Loại hoạt động' : 'type_str',
  'Nhóm SP' : 'product_group_name',
  'Loại SP': 'product_type_name',
  'Mã hàng' : 'product_code',
  'Tên hàng' : 'product_name',
  'Số lượng': 'quantity',
  'Đơn giá': 'price',
  'Thành tiền': 'amount',
  'Người tạo': 'created_by_name',
}
const isGetExcelItems = ref(false)
const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = Constant.PAGE_LIMIT
const offset = ref(0)
const totalRow = ref(0)
const currentRepository = ref({})
const creatingPHG = ref(false)
const today_day = ref("")
const today_month = ref("")
const today_year = ref("")
const isUserRoot = ref(false)

// Helper function to format date to yyyy-MM-dd in local timezone
const formatDateLocal = (date) => {
  if (!(date instanceof Date)) return date
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Methods
const prepareDateInput = () => {
  let dateNow = new Date()
  inputs.to_date = new Date(dateNow)
  let fromDate = new Date(dateNow)
  fromDate.setDate(fromDate.getDate() - 7)
  inputs.from_date = fromDate
  let currentYear = new Date().getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }
  month_input.value = dateNow.getMonth() + 1
}

const onScroll = (event) => {
  if(onSearch.value) return
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const getOptionRelatedRepository = () => {
  loadingOptions.value = true
  let params = {
    product_groups: true,
    product_types: true,
    product_brands: true
  }

  repositoryApi.getOptionsRelatedRepository(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let options = res.data.data

      productGroupOptions.value = options.product_groups
      productGroupOptions.value.unshift({id: null, name: "--Tất cả--"})
      productTypeOptionStore.value = JSON.parse(JSON.stringify(options.product_types))
      productTypeOptions.value = options.product_types
      productTypeOptions.value.unshift({id: null, name: "--Tất cả--", product_group_id: null})

      productBrandOptions.value = [{text: "", value: null}]
      let product_brands = options.product_brands
      for(let product_brand of product_brands) {
        productBrandOptions.value.push(product_brand)
      }
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
    productTypeOptions.value = [{id: null, name: "--Tất cả--", product_group_id: null}]
    for (let i in productTypeOptionStore.value) {
      if(productGroupSelect.value.id == productTypeOptionStore.value[i].product_group_id) {
        productTypeOptions.value.push(productTypeOptionStore.value[i])
      }
    }
  } else {
    productTypeOptions.value = JSON.parse(JSON.stringify(productTypeOptionStore.value))
    let itemTypeEmpty = {id: null, name: "--Tất cả--", product_group_id: null}
    productTypeOptions.value.unshift(itemTypeEmpty)
  }
  productTypeSelect.value = productTypeOptions.value[0]
}

const printPHG = () => {
  var mywindow = window.open('', 'PRINT', 'height=900,width=1200')

  mywindow.document.write('<html><head><title> </title><style>')
  mywindow.document.write(' body {font-size: 14px;} ')
  mywindow.document.write(' .print-text-center {text-align: center;} ')
  mywindow.document.write(' .print-text-left {text-align: left;} ')
  mywindow.document.write(' .print-text-right {text-align: right;} ')
  mywindow.document.write(' .print-width-50-left {width: 48%; float: left;} ')
  mywindow.document.write(' .print-width-50-right {width: 48%; float: right;} ')
  mywindow.document.write(' .print-border {border: gray solid 0.5px;} ')
  mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ')
  mywindow.document.write(' .print-table-border > table, th, td {border: gray solid 0.1px; border-collapse: collapse;} ')
  mywindow.document.write(' .print-border {border: gray solid 0.1px; border-collapse: collapse;} ')
  mywindow.document.write(' .print-no-border {border: none;} ')
  mywindow.document.write(' .tr-bg {background-color: #eeece1 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ')
  mywindow.document.write(' .custom-line-height tr { line-height: 25px; } ')

  mywindow.document.write('</style></head><body >')
  mywindow.document.write(document.getElementById('contentPrintPHG').innerHTML)
  mywindow.document.write('</body></html>')

  mywindow.document.close()
  mywindow.focus()

  setTimeout(function() {
    mywindow.print()
    mywindow.close()
  }, 1000)

  return true
}

const preparePrintPHG = async (repoHis) => {
  if(repoHis && repoHis.id) {
    creatingPHG.value = true
    await getRepositoryDetailForPrint(repoHis.id)
    creatingPHG.value = false
    printPHG()
  }
}

const getRepositoryDetailForPrint = async (id) => {
  await repositoryApi.getRepositoryDetailForPrint(id).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      currentRepository.value = res.data.data
    } else {
      currentRepository.value = {}
    }
  }).catch(err => {
    currentRepository.value = {}
  })
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

const search = () => {
  if (loading.value) return

  onSearch.value = true
  loading.value = true

  let fromDate = formatDateLocal(inputs.from_date)
  let toDate = formatDateLocal(inputs.to_date)

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
    is_correction: inputs.is_correction,
    type_id: inputs.type_id,
    from_date: fromDate,
    to_date: toDate,
    repository_number: inputs.repository_number,
    product_group_id: productGroupSelect.value.id ? productGroupSelect.value.id : null,
    product_type_id: productTypeSelect.value.id ? productTypeSelect.value.id : null,
    product_brand_id: inputs.product_brand_id,
    product_code: inputs.product_code,
    product_name: inputs.product_name,
    limit: pageLimit,
    offset: offset.value
  }

  repositoryApi.getRepositoryHis(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.repository_historys
      totalRow.value = res.data.data.total_row

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

const getExcelItem = (params) => {
  if(isGetExcelItems.value) return

  excel_items.value = []
  params.limit = 999999

  repositoryApi.getRepositoryHis(params).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      excel_items.value = res.data.data.repository_historys
      isGetExcelItems.value = true
    }
  }).catch(err => {})
}

const currencyFormat = (num) => {
  let result = ""
  if(num == 0) return "0"
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const goToAddOutput = () => {
  router.push("/repo-correction-output")
}

const goToAddInput = () => {
  router.push("/repo-correction-input")
}

const deleted = (id, name) => {
  if(id && name) {
    if (confirm('Xóa phiếu [' + name + "]. Bạn có chắc không?")) {
      repositoryApi.deleteRepoHis(id).then(res => {
        popToast('success', 'Xoá phiếu [' + name + '] thành công!')
        prepareToSearch()
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const exportToExcel = () => {
  const exportData = excel_items.value.map((item, index) => ({
    'Ngày tạo': item.created_at,
    'Loại hoạt động': item.type_str,
    'Nhóm SP': item.product_group_name,
    'Loại SP': item.product_type_name,
    'Mã hàng': item.product_code,
    'Tên hàng': item.product_name,
    'Số lượng': item.quantity,
    'Đơn giá': item.price,
    'Thành tiền': item.amount,
    'Người tạo': item.created_by_name
  }))
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch sử hiệu chỉnh kho')
  XLSX.writeFile(workbook, 'lich_su_hieu_chinh_kho.xlsx')
}

// Lifecycle
onMounted(() => {
  if(authStore.user && authStore.user.isRoot) {
    isUserRoot.value = true
  }

  window.addEventListener('scroll', onScroll)

  let dateNow = new Date()
  today_day.value = dateNow.getDate()
  today_month.value = dateNow.getMonth() + 1
  today_year.value = dateNow.getFullYear()

  prepareDateInput()
  getOptionRelatedRepository()
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
.label-width {
  width: 100%;
}
</style>
