<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- Header Button -->
      <div class="flex justify-end mb-4">
        <button
          @click="goToNew"
          class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors min-w-[120px]"
        >
          Thêm mới
        </button>
      </div>

      <!-- Title -->
      <h4 class="text-2xl font-semibold text-center text-blue-600 mb-4">Danh Sách Khoản Đi Vay</h4>
      <hr class="mb-6">

      <!-- Filter Section -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
          <select
            v-model="time_option"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in timeOptions" :key="option.value" :value="option.value">{{option.text}}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{time_option == 1 ? 'Từ ngày' : 'Năm'}}</label>
          <datepicker
            v-show="time_option == 1"
            v-model="inputs.from_date"
            format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          />
          <select
            v-show="time_option != 1"
            v-model="year_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in yearOptions" :key="option.value" :value="option.value">{{option.text}}</option>
          </select>
        </div>

        <div>
          <label v-show="time_option != 4" class="block text-sm font-medium text-gray-700 mb-1">
            {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý'}}
          </label>
          <datepicker
            v-show="time_option == 1"
            v-model="inputs.to_date"
            format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          />
          <select
            v-show="time_option == 2"
            v-model="month_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in monthOptions" :key="option.value" :value="option.value">{{option.text}}</option>
          </select>
          <select
            v-show="time_option == 3"
            v-model="quarter_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in quarterOptions" :key="option.value" :value="option.value">{{option.text}}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            v-model="inputs.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in status" :key="option.value" :value="option.value">{{option.text}}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
          <multiselect
            v-model="customerSelect"
            :options="customerOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn khách hàng--"
            label="text"
            track-by="text"
          />
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-end mb-4">
        <button
          @click="prepareToSearch"
          :disabled="onSearch"
          class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px] disabled:opacity-50"
        >
          Tìm Kiếm
        </button>
      </div>

      <!-- Result Count and Export -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-sm">
          Số kết quả: <span class="text-blue-600 font-semibold">{{totalRow}}</span>
        </div>
        <download-excel
          class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px] cursor-pointer"
          :data="excel_items"
          :fields="excel_fields"
          worksheet="Danh sách khoản đi vay"
          name="Danh sách khoản đi vay"
        >
          <b>Xuất Excel</b>
        </download-excel>
      </div>

      <hr class="mb-4">

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:3%">STT</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:12%">Tên K.H</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Số điện thoại</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Trạng thái</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Ngày mượn</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Ngày hẹn trả</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Số tiền</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Lãi suất %</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Kỳ hạn lãi</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Thời gian tính lãi</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Số tiền lãi</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Tổng tiền</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Đã trả</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:8%">Còn lại</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase border" style="width:5%"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm border">{{index + 1}}</td>
              <td class="px-4 py-2 text-sm border">{{item.customer_name}}</td>
              <td class="px-4 py-2 text-sm border">{{item.customer_phone}}</td>
              <td class="px-4 py-2 text-sm border">{{item.status_str}}</td>
              <td class="px-4 py-2 text-sm border">{{item.borrowed_date}}</td>
              <td class="px-4 py-2 text-sm border">{{item.due_date}}</td>
              <td class="px-4 py-2 text-sm text-right border">{{currencyFormat(item.amount)}}</td>
              <td class="px-4 py-2 text-sm text-right border">{{item.interest_rate}}%</td>
              <td class="px-4 py-2 text-sm border">{{item.interest_period_str}}</td>
              <td class="px-4 py-2 text-sm border">{{item.loan_time}}</td>
              <td class="px-4 py-2 text-sm text-right border">{{currencyFormat(item.interest_amount)}}</td>
              <td class="px-4 py-2 text-sm text-right border">{{currencyFormat(item.total)}}</td>
              <td class="px-4 py-2 text-sm text-right border">
                <span v-show="item.amount_paid > 0" class="ml-2 cursor-pointer">
                  <i class="fa fa-info-circle text-blue-600" title="Danh sách đã trả" @click="showModalDetailPayment(item.id)"/>
                </span>
                {{currencyFormat(item.amount_paid)}}
              </td>
              <td class="px-4 py-2 text-sm text-right border">{{currencyFormat(item.remaining)}}</td>
              <td class="px-4 py-2 text-sm border">
                <div class="flex flex-col gap-2">
                  <div v-if="item.status == -1 || isRoot" class="flex gap-2">
                    <i v-if="item.status == -1" class="fa fa-edit cursor-pointer text-blue-600 hover:text-blue-800" title="Cập nhật" @click="edit(item.id)"></i>
                    <i class="fa fa-trash cursor-pointer text-red-600 hover:text-red-800" title="Xóa" @click="deleted(item.id, item.customer_name)"></i>
                  </div>
                  <button
                    v-if="item.status != 2"
                    @click="goToPayment(item.id)"
                    class="px-3 py-1 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors text-xs"
                    title="Thanh toán"
                  >
                    Thanh toán
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading Indicator -->
      <div v-show="onSearch" class="text-center py-4">
        <icon name="loading" width="60" />
      </div>
      <div v-if="hasNext === false" class="text-center py-4 text-gray-500">--Hết--</div>
      <div v-if="hasNext === true && totalRow != 0" class="text-center py-4">
        <i class="fa fa-angle-double-down text-2xl text-blue-600 cursor-pointer"></i>
      </div>
    </div>

    <!-- Modal chi tiết thanh toán -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div class="p-6">
          <h4 class="text-2xl font-semibold text-center text-green-600 mb-4">Danh Sách Thanh Toán</h4>
          <hr class="mb-4">

          <div v-show="loadingPayment" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">STT</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Ngày</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Số phiếu</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Số tiền</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Sổ thu chi</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Nội dung</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in paymentItems" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-2 text-sm border">{{item.stt}}</td>
                  <td class="px-4 py-2 text-sm border">{{item.created_at}}</td>
                  <td class="px-4 py-2 text-sm border">{{item.fund_number}}</td>
                  <td class="px-4 py-2 text-sm border">{{currencyFormat(item.amount)}}</td>
                  <td class="px-4 py-2 text-sm border">{{item.bank_account_info}}</td>
                  <td class="px-4 py-2 text-sm border">{{item.description}}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="hideModalDetailPayment"
              class="px-4 py-2 bg-white text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors min-w-[120px]"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import loanApi from '@/api/loan'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'

const router = useRouter()
const authStore = useAuthStore()
const { popToast } = useToast()

// Data
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
const year_input = ref(2023)
const quarter_input = ref(1)
const month_input = ref(1)
const loadingOptions = ref(false)
const customerSelect = ref({})
const customerOptions = ref([])
const totalRow = ref(0)
const status = ref([
  {value: null, text: ''},
  {value: '-1', text: 'Lưu nháp'},
  {value: '0', text: 'Trong hạn'},
  {value: '1', text: 'Quá hạn'},
  {value: '2', text: 'Đã tất toán'}
])
const inputs = reactive({
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02'),
  customer_id: null,
  status: null,
})
const items = ref([])
const excel_fields = reactive({
  'Tên K.H': 'customer_name',
  'Số điện thoại': 'customer_phone',
  'Trạng thái': 'status_str',
  'Ngày mượn': 'borrowed_date',
  'Ngày hẹn trả': 'due_date',
  'Số tiền': 'amount',
  'Lãi suất %': 'interest_rate',
  'Kỳ hạn lãi': 'interest_period_str',
  'Thời gian tính lãi': 'loan_time',
  'Số tiền lãi': 'interest_amount',
  'Tổng tiền': 'total',
  'Đã trả': 'amount_paid',
  'Còn lại': 'remaining',
})
const excel_items = ref([])
const isGetExcelItems = ref(false)
const loadByScroll = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const isRoot = ref(false)
const paymentItems = ref([])
const loadingPayment = ref(false)
const showPaymentModal = ref(false)

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  if (authStore.user && authStore.user.isRoot) {
    isRoot.value = true
  }

  prepareDateInput()
  getOptions()
  prepareToSearch()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// Methods
function prepareDateInput() {
  let dateNow = new Date()
  inputs.to_date = new Date(dateNow)
  let fromDate = new Date(dateNow)
  fromDate.setDate(fromDate.getDate() - 30)
  inputs.from_date = fromDate
  let currentYear = new Date().getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }
  month_input.value = dateNow.getMonth() + 1
}

function onScroll(event) {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + pageLimit.value
      loadByScroll.value = true
      search()
    }
  }
}

function getOptions() {
  loadingOptions.value = true
  const params = {
    "loan_type": 0,
    "customers": true
  }

  loanApi.getOptionsRelated(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      customerOptions.value = res.data.data.customers
      const itemEmpty = {"value": null, "text": null}
      customerOptions.value.unshift(itemEmpty)
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

function goToNew() {
  router.push('/loan-in/add')
}

function prepareToSearch() {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

function search() {
  if (onSearch.value) { return }

  onSearch.value = true

  let fromDate = formatDateLocal(inputs.from_date)
  let toDate = formatDateLocal(inputs.to_date)

  if (time_option.value == 2) {
    fromDate = year_input.value + '-' + month_input.value + '-01'
    toDate = year_input.value + '-' + month_input.value + '-' + new Date(year_input.value, month_input.value, 0).getDate()
  }
  if (time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(quarter_input.value)
    fromDate = year_input.value + '-' + quarter + '-01'
    toDate = year_input.value + '-' + (quarter + 2) + '-' + new Date(year_input.value, (quarter + 2), 0).getDate()
  }
  if (time_option.value == 4) {
    fromDate = year_input.value + '-01-01'
    toDate = year_input.value + '-12-' + new Date(year_input.value, 12, 0).getDate()
  }

  const params = {
    "loan_type": 0,
    "from_date": fromDate,
    "to_date": toDate,
    "customer_id": customerSelect.value.value ? customerSelect.value.value : null,
    "status": inputs.status,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  loanApi.searchLoan(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data

      if (loadByScroll.value) {
        const temp = items.value
        const newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if (!isGetExcelItems.value) {
        getExcelItem(params)
      } else {
        if (parseInt(offset.value) + parseInt(pageLimit.value) >= parseInt(totalRow.value)) {
          hasNext.value = false
        }
      }
    }

    onSearch.value = false
  }).catch(err => {
    onSearch.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

function getExcelItem(params) {
  if (isGetExcelItems.value) {
    return
  }

  excel_items.value = []
  params.limit = 999999

  loanApi.searchLoan(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const datas = res.data.data
      excel_items.value = datas

      totalRow.value = res.data.data.length
      if (parseInt(offset.value) + parseInt(pageLimit.value) >= parseInt(totalRow.value)) {
        hasNext.value = false
      }

      isGetExcelItems.value = true
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

function edit(id) {
  router.push('/loan-in/edit/' + id)
}

function deleted(id, name) {
  if (id && name) {
    if (confirm('Xóa khoản vay của [' + name + "]. Bạn có chắc không?")) {
      loanApi.deleteLoan(id).then(res => {
        prepareToSearch()
      }).catch(err => {
        const errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

function goToPayment(id) {
  window.open('/loan-in-payment/' + id, '_blank')
}

function showModalDetailPayment(id) {
  getListPayment(id)
  showPaymentModal.value = true
}

function hideModalDetailPayment() {
  showPaymentModal.value = false
}

function getListPayment(id) {
  loadingPayment.value = true

  loanApi.getListPayment({"id": id, "type": 1}).then(res => {
    if (res != null && res.data != null) {
      paymentItems.value = res.data.data
    }
    loadingPayment.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loadingPayment.value = false
  })
}

function currencyFormat(num) {
  let result = ""
  if (num == 0) {
    return "0"
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

function formatDateLocal(date) {
  if (!(date instanceof Date)) return date
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<style lang="scss" scoped>
.label-width {
  width: 100%;
}
</style>
