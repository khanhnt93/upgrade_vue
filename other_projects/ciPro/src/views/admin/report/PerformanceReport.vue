<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <h4 class="text-center text-xl font-semibold text-gray-800 mb-4">Báo Cáo Hiệu Quả Kinh Doanh</h4>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3">
          <label class="block text-sm font-medium mb-1">Thời gian</label>
          <select v-model="time_option" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in timeOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-3">
          <label v-show="time_option != 5" class="block text-sm font-medium mb-1">{{time_option == 1 ? 'Từ ngày' : 'Năm' }}</label>
          <Datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
          <select v-show="time_option != 1 && time_option != 5" v-model="year_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in yearOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-3">
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

        <div class="md:col-span-3">
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
          :disabled="onSearch"
          @click.prevent="search">
          Tìm Kiếm
        </button>
      </div>

      <div :class="loadingCustomerReport ? 'bg-gray-200' : ''">
        <h5 class="text-header font-semibold">Khách hàng</h5>
        <p>Tổng Số lượng khách hàng: {{currencyFormat(customer_report.total)}}</p>
        <p>Tổng số lượng khách hàng mới: {{currencyFormat(customer_report.total_new)}}</p>
        <p>Tổng số lượng khách hàng cũ: {{currencyFormat(customer_report.total_old)}}</p>
      </div>

      <div :class="loadingQuotationReport ? 'bg-gray-200' : ''" class="mt-3">
        <h5 class="text-header font-semibold">Báo cáo báo giá</h5>
      </div>

      <div :class="loadingQuotationReport ? 'bg-gray-200' : ''" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p>Tổng giá trị báo giá: {{currencyFormat(quotation_report.total_amount)}}</p>
          <p>Tổng số báo giá: {{currencyFormat(quotation_report.total_number)}}</p>
        </div>
        <div>
          <p>Số lương BG thành công: {{currencyFormat(quotation_report.total_success)}}</p>
          <p>Số lương BG thất bại: {{currencyFormat(quotation_report.total_fail)}}</p>
          <p>Số lương BG chờ: {{currencyFormat(quotation_report.total_waiting)}}</p>
        </div>
        <div>
          <p>Tỉ lệ BG thành công: {{quotation_report.percent_success}}%</p>
          <p>Tỉ lệ BG thất bại: {{quotation_report.percent_fail}}%</p>
          <p>Tỉ lệ BG chờ: {{quotation_report.percent_waiting}}%</p>
        </div>
      </div>

      <div :class="loadingQuotationDetailReport ? 'bg-gray-200' : ''" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div class="table-cus" :style="{ height: max_table_height + 'px', overflowY: 'auto', overflowX: 'auto'}">
          <p>Tổng giá trị báo giá (chưa VAT) theo nhóm sản phẩm</p>
          <table class="table table-bordered table-striped fixed_header">
            <thead>
              <tr>
                <th style="width:25%">Nhóm SP</th>
                <th style="width:25%">Tổng giá trị BG</th>
                <th style="width:25%">Thành công</th>
                <th style="width:25%">Thất bại</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in quotation_detail_report.group_products" :key="item.name">
                <td>{{item.name}}</td>
                <td class="text-right">{{currencyFormat(item.total)}}</td>
                <td class="text-right">{{currencyFormat(item.total_success)}}</td>
                <td class="text-right">{{currencyFormat(item.total_fail)}}</td>
              </tr>
            </tbody>
          </table>
          <div v-show="quotation_detail_report.group_products_full_item.length > show_more_item" class="text-center">
            <button class="button-like-a btn-width-220" @click="showMoreQuotationDetailReportGroupProduct()">
              {{quotation_detail_report.group_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
            </button>
          </div>
        </div>

        <div class="table-cus" :style="{ height: max_table_height + 'px', overflowY: 'auto', overflowX: 'auto'}">
          <p>Tổng giá trị báo giá (chưa VAT) theo loại sản phẩm</p>
          <table class="table table-bordered table-striped fixed_header">
            <thead>
              <tr>
                <th style="width:25%">Loại SP</th>
                <th style="width:25%">Tổng giá trị BG</th>
                <th style="width:25%">Thành công</th>
                <th style="width:25%">Thất bại</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in quotation_detail_report.type_products" :key="item.name">
                <td>{{item.name}}</td>
                <td class="text-right">{{currencyFormat(item.total)}}</td>
                <td class="text-right">{{currencyFormat(item.total_success)}}</td>
                <td class="text-right">{{currencyFormat(item.total_fail)}}</td>
              </tr>
            </tbody>
          </table>
          <div v-show="quotation_detail_report.type_products_full_item.length > show_more_item" class="text-center">
            <button class="button-like-a btn-width-220" @click="showMoreQuotationDetailReportTypeProduct()">
              {{quotation_detail_report.type_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
            </button>
          </div>
        </div>

        <div class="table-cus" :style="{ height: max_table_height + 'px', overflowY: 'auto', overflowX: 'auto'}">
          <p>Tổng giá trị báo giá (chưa VAT) theo hãng sản phẩm</p>
          <table class="table table-bordered table-striped fixed_header">
            <thead>
              <tr>
                <th style="width:25%">Hãng SP</th>
                <th style="width:25%">Tổng giá trị BG</th>
                <th style="width:25%">Thành công</th>
                <th style="width:25%">Thất bại</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in quotation_detail_report.brand_products" :key="item.name">
                <td>{{item.name}}</td>
                <td class="text-right">{{currencyFormat(item.total)}}</td>
                <td class="text-right">{{currencyFormat(item.total_success)}}</td>
                <td class="text-right">{{currencyFormat(item.total_fail)}}</td>
              </tr>
            </tbody>
          </table>
          <div v-show="quotation_detail_report.brand_products_full_item.length > 10" class="text-center">
            <button class="button-like-a btn-width-220"
              @click="showMoreQuotationDetailReportBrandProduct()">
              {{quotation_detail_report.brand_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
            </button>
          </div>
        </div>
      </div>

      <div :class="loadingQuotationCareReport ? 'bg-gray-200' : ''" class="mt-3">
        <h5 class="text-header font-semibold">Chăm sóc báo giá</h5>
        <p>Tỉ lệ chăm sóc khách hàng lần 1 đúng hạn: {{quotation_care_report.percent_care_1}}%</p>
        <p>Tỉ lệ chăm sóc khách hàng lần 2 đúng hạn: {{quotation_care_report.percent_care_2}}%</p>
      </div>

      <div :class="loadingRevenueProfitReport ? 'bg-gray-200' : ''" class="mt-3">
        <h5 class="text-header font-semibold">Doanh Thu</h5>
        <p>Tổng doanh thu: {{currencyFormat(revenue_profit.revenue)}}</p>
        <p>Tổng lợi nhuận: {{currencyFormat(revenue_profit.profit)}}</p>
      </div>

      <div :class="loadingRevenueProfitReport ? 'bg-gray-200' : ''" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div class="table-cus" :style="{ height: max_table_height + 'px', overflowY: 'auto', overflowX: 'auto'}">
          <p>Doanh thu/lợi nhuận theo nhóm sp</p>
          <table class="table table-bordered table-striped fixed_header">
            <thead>
              <tr>
                <th style="width:40%">Nhóm sp</th>
                <th style="width:30%">Doanh thu</th>
                <th style="width:30%">Lợi nhuận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in revenue_profit_detail_report.group_products" :key="item.name">
                <td>{{item.name}}</td>
                <td class="text-right">{{currencyFormat(item.revenue)}}</td>
                <td class="text-right">{{currencyFormat(item.profit)}}</td>
              </tr>
            </tbody>
          </table>
          <div v-show="revenue_profit_detail_report.group_products_full_item.length > show_more_item" class="text-center">
            <button class="button-like-a btn-width-220" @click="showMoreRevenueProfitDetailReportGroupProduct()">
              {{revenue_profit_detail_report.group_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
            </button>
          </div>
        </div>

        <div class="table-cus" :style="{ height: max_table_height + 'px', overflowY: 'auto', overflowX: 'auto'}">
          <p>Doanh thu/lợi nhuận theo loại sp</p>
          <table class="table table-bordered table-striped fixed_header">
            <thead>
              <tr>
                <th style="width:40%">Loại sp</th>
                <th style="width:30%">Doanh thu</th>
                <th style="width:30%">Lợi nhuận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in revenue_profit_detail_report.type_products" :key="item.name">
                <td>{{item.name}}</td>
                <td class="text-right">{{currencyFormat(item.revenue)}}</td>
                <td class="text-right">{{currencyFormat(item.profit)}}</td>
              </tr>
            </tbody>
          </table>
          <div v-show="revenue_profit_detail_report.type_products_full_item.length > show_more_item" class="text-center">
            <button class="button-like-a btn-width-220" @click="showMoreRevenueProfitDetailReportTypeProduct()">
              {{revenue_profit_detail_report.type_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
            </button>
          </div>
        </div>

        <div class="table-cus" :style="{ height: max_table_height + 'px', overflowY: 'auto', overflowX: 'auto'}">
          <p>Doanh thu/lợi nhuận theo hãng sp</p>
          <table class="table table-bordered table-striped fixed_header">
            <thead>
              <tr>
                <th style="width:40%">Hãng sp</th>
                <th style="width:30%">Doanh thu</th>
                <th style="width:30%">Lợi nhuận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in revenue_profit_detail_report.brand_products" :key="item.name">
                <td>{{item.name}}</td>
                <td class="text-right">{{currencyFormat(item.revenue)}}</td>
                <td class="text-right">{{currencyFormat(item.profit)}}</td>
              </tr>
            </tbody>
          </table>
          <div v-show="revenue_profit_detail_report.brand_products_full_item.length > show_more_item" class="text-center">
            <button class="button-like-a btn-width-220" @click="showMoreRevenueProfitDetailReportBrandProduct()">
              {{revenue_profit_detail_report.brand_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
            </button>
          </div>
        </div>
      </div>

      <div :class="loadingRevenueProfitReport ? 'bg-gray-200' : ''" class="mt-3">
        <h5 class="text-header font-semibold">Chi Phí bán hàng</h5>
        <p>
          Tổng chi phí bán hàng: {{currencyFormat(expend.total)}}
          <button class="button-like-a btn-width-220" @click="goToExpendReport()">Xem chi tiết</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import reportApi from '@/api/report'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'

const router = useRouter()
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
  staff_in_charge: null,
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02')
})
const loadingOptions = ref(false)
const optionsStaff = ref([])
const onSearch = ref(false)
const loadingCustomerReport = ref(false)
const customer_report = ref({
  total: 0,
  total_new: 0,
  total_old: 0
})
const loadingQuotationReport = ref(false)
const quotation_report = ref({
  total_amount: 0,
  total_number: 0,
  total_success: 0,
  total_fail: 0,
  total_waiting: 0,
  percent_success: 0,
  percent_fail: 0,
  percent_waiting: 0
})
const loadingQuotationDetailReport = ref(false)
const quotation_detail_report = ref({
  group_products: [],
  group_products_10_item: [],
  group_products_full_item: [],
  group_products_show_extra: false,
  type_products: [],
  type_products_10_item: [],
  type_products_full_item: [],
  type_products_show_extra: false,
  brand_products: [],
  brand_products_10_item: [],
  brand_products_full_item: [],
  brand_products_show_extra: false,
})
const loadingQuotationCareReport = ref(false)
const quotation_care_report = ref({
  percent_care_1: 0,
  percent_care_2: 0
})
const loadingRevenueProfitReport = ref(false)
const revenue_profit = ref({
  revenue: 0,
  profit: 0
})
const revenue_profit_detail_report = ref({
  group_products: [],
  group_products_10_item: [],
  group_products_full_item: [],
  group_products_show_extra: false,
  type_products: [],
  type_products_10_item: [],
  type_products_full_item: [],
  type_products_show_extra: false,
  brand_products: [],
  brand_products_10_item: [],
  brand_products_full_item: [],
  brand_products_show_extra: false,
})
const expend = ref({
  total: 0
})
const max_table_height = ref(500)
const show_more_item = 10

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

  let params = {
    'staffs': true
  }

  reportApi.getOptionsRelatedReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let options = res.data.data

      optionsStaff.value = options.staffs
      optionsStaff.value.unshift({value: null, text: "-- Tất cả --"})
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const search = () => {
  if(onSearch.value) {
    return
  }

  onSearch.value = true

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
    "staff_in_charge": inputs.value.staff_in_charge && inputs.value.staff_in_charge.value ? inputs.value.staff_in_charge.value : null,
    "from_date": fromDate,
    "to_date": toDate
  }

  getCustomerReport(params)
  getQuotationReport(params)
  getQuotationDetailReport(params)
  getQuotationCareReport(params)
  getRevenueProfitReport(params)
}

const getCustomerReport = (params) => {
  loadingCustomerReport.value = true

  reportApi.getPerformanceCustomerReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      customer_report.value = res.data.data
    }
    loadingCustomerReport.value = false
  }).catch(err => {
    loadingCustomerReport.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getQuotationReport = (params) => {
  loadingQuotationReport.value = true

  reportApi.getPerformanceQuotationReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      quotation_report.value = res.data.data
    }
    loadingQuotationReport.value = false
  }).catch(err => {
    loadingQuotationReport.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getQuotationDetailReport = (params) => {
  loadingQuotationDetailReport.value = true

  reportApi.getPerformanceQuotationDetailReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let data = JSON.parse(JSON.stringify(res.data.data))

      let group_products = data.group_products
      quotation_detail_report.value.group_products_full_item = group_products
      let group_products_10_item = JSON.parse(JSON.stringify(group_products.slice(0, show_more_item)))
      quotation_detail_report.value.group_products_10_item = group_products_10_item
      quotation_detail_report.value.group_products = group_products_10_item

      let type_products = data.type_products
      quotation_detail_report.value.type_products_full_item = type_products
      let type_products_10_item = JSON.parse(JSON.stringify(type_products.slice(0, show_more_item)))
      quotation_detail_report.value.type_products_10_item = type_products_10_item
      quotation_detail_report.value.type_products = type_products_10_item

      let brand_products = data.brand_products
      quotation_detail_report.value.brand_products_full_item = brand_products
      let brand_products_10_item = JSON.parse(JSON.stringify(brand_products.slice(0, show_more_item)))
      quotation_detail_report.value.brand_products_10_item = brand_products_10_item
      quotation_detail_report.value.brand_products = brand_products_10_item
    }
    loadingQuotationDetailReport.value = false
  }).catch(err => {
    loadingQuotationDetailReport.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getQuotationCareReport = (params) => {
  loadingQuotationCareReport.value = true

  reportApi.getPerformanceQuotationCareReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      quotation_care_report.value = res.data.data
    }
    loadingQuotationCareReport.value = false
  }).catch(err => {
    loadingQuotationCareReport.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getRevenueProfitReport = (params) => {
  loadingRevenueProfitReport.value = true

  reportApi.getPerformanceRevenueProfitReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let data = res.data.data
      revenue_profit.value.revenue = data.revenue
      revenue_profit.value.profit = data.profit
      expend.value.total = data.expend

      let group_products = data.group_products
      revenue_profit_detail_report.value.group_products_full_item = group_products
      let group_products_10_item = JSON.parse(JSON.stringify(group_products.slice(0, show_more_item)))
      revenue_profit_detail_report.value.group_products_10_item = group_products_10_item
      revenue_profit_detail_report.value.group_products = group_products_10_item

      let type_products = data.type_products
      revenue_profit_detail_report.value.type_products_full_item = type_products
      let type_products_10_item = JSON.parse(JSON.stringify(type_products.slice(0, show_more_item)))
      revenue_profit_detail_report.value.type_products_10_item = type_products_10_item
      revenue_profit_detail_report.value.type_products = type_products_10_item

      let brand_products = data.brand_products
      revenue_profit_detail_report.value.brand_products_full_item = brand_products
      let brand_products_10_item = JSON.parse(JSON.stringify(brand_products.slice(0, show_more_item)))
      revenue_profit_detail_report.value.brand_products_10_item = brand_products_10_item
      revenue_profit_detail_report.value.brand_products = brand_products_10_item
    }
    loadingRevenueProfitReport.value = false

    onSearch.value = false
  }).catch(err => {
    onSearch.value = false
    loadingRevenueProfitReport.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const goToExpendReport = () => {
  const routeData = router.resolve(
    {name: 'Báo cáo chi phí',
      query: {from_date: new Date(inputs.value.from_date).toJSON().slice(0,10),
        to_date: new Date(inputs.value.to_date).toJSON().slice(0,10),
        staff_id: inputs.value.staff_in_charge && inputs.value.staff_in_charge.value ? inputs.value.staff_in_charge.value : null
      }
    })
  window.open(routeData.href, '_blank')
}

const showMoreQuotationDetailReportGroupProduct = () => {
  if(!quotation_detail_report.value.group_products_show_extra) {
    quotation_detail_report.value.group_products = quotation_detail_report.value.group_products_full_item
    quotation_detail_report.value.group_products_show_extra = true
  } else {
    quotation_detail_report.value.group_products = quotation_detail_report.value.group_products_10_item
    quotation_detail_report.value.group_products_show_extra = false
  }
}

const showMoreQuotationDetailReportTypeProduct = () => {
  if(!quotation_detail_report.value.type_products_show_extra) {
    quotation_detail_report.value.type_products = quotation_detail_report.value.type_products_full_item
    quotation_detail_report.value.type_products_show_extra = true
  } else {
    quotation_detail_report.value.type_products = quotation_detail_report.value.type_products_10_item
    quotation_detail_report.value.type_products_show_extra = false
  }
}

const showMoreQuotationDetailReportBrandProduct = () => {
  if(!quotation_detail_report.value.brand_products_show_extra) {
    quotation_detail_report.value.brand_products = quotation_detail_report.value.brand_products_full_item
    quotation_detail_report.value.brand_products_show_extra = true
  } else {
    quotation_detail_report.value.brand_products = quotation_detail_report.value.brand_products_10_item
    quotation_detail_report.value.brand_products_show_extra = false
  }
}

const showMoreRevenueProfitDetailReportGroupProduct = () => {
  if(!revenue_profit_detail_report.value.group_products_show_extra) {
    revenue_profit_detail_report.value.group_products = revenue_profit_detail_report.value.group_products_full_item
    revenue_profit_detail_report.value.group_products_show_extra = true
  } else {
    revenue_profit_detail_report.value.group_products = revenue_profit_detail_report.value.group_products_10_item
    revenue_profit_detail_report.value.group_products_show_extra = false
  }
}

const showMoreRevenueProfitDetailReportTypeProduct = () => {
  if(!revenue_profit_detail_report.value.type_products_show_extra) {
    revenue_profit_detail_report.value.type_products = revenue_profit_detail_report.value.type_products_full_item
    revenue_profit_detail_report.value.type_products_show_extra = true
  } else {
    revenue_profit_detail_report.value.type_products = revenue_profit_detail_report.value.type_products_10_item
    revenue_profit_detail_report.value.type_products_show_extra = false
  }
}

const showMoreRevenueProfitDetailReportBrandProduct = () => {
  if(!revenue_profit_detail_report.value.brand_products_show_extra) {
    revenue_profit_detail_report.value.brand_products = revenue_profit_detail_report.value.brand_products_full_item
    revenue_profit_detail_report.value.brand_products_show_extra = true
  } else {
    revenue_profit_detail_report.value.brand_products = revenue_profit_detail_report.value.brand_products_10_item
    revenue_profit_detail_report.value.brand_products_show_extra = false
  }
}

const currencyFormat = (num) => {
  let result = ""
  if(num == 0) return "0"
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

onMounted(() => {
  let height = screen.height
  if(height && height > 500) {
    max_table_height.value = Math.round(height / 2)
  }

  prepareDateInput()
  getOptionRelated()
  search()
})
</script>

<style lang="scss" scoped>
.button-like-a {
  background: none!important;
  border: none;
  padding: 0!important;
  font-family: arial, sans-serif;
  color: #069;
  text-decoration: underline;
  cursor: pointer;
}
</style>
