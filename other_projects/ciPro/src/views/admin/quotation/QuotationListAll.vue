<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">

      <!-- Action Buttons Row -->
      <div class="flex justify-end items-center gap-2 mb-4">
        <button
          @click="goToAdd()"
          class="px-4 py-2 bg-white border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors min-w-[120px]">
          Thêm BG
        </button>

        <button
          @click="goToAddProject()"
          class="px-4 py-2 bg-white border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors min-w-[220px]">
          Thêm BG dự án
        </button>

        <button
          @click="showModalSettingQuotation()"
          class="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px]">
          Cài đặt
        </button>
      </div>

      <!-- Title -->
      <div class="text-center mb-4">
        <h4 class="text-2xl font-semibold text-gray-800">Danh Sách Báo Giá</h4>
      </div>

      <hr class="my-4">

      <!-- Filter Section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

        <!-- Time Option -->
        <div :class="userRole === 'admin' ? 'md:col-span-1' : 'md:col-span-1'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
          <select v-model="time_option" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="opt in timeOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <!-- From Date / Year -->
        <div :class="userRole === 'admin' ? 'md:col-span-1' : 'md:col-span-1'">
          <label v-show="time_option !== 5" class="block text-sm font-medium text-gray-700 mb-1">
            {{ time_option === 1 ? 'Từ ngày' : 'Năm' }}
          </label>
          <!-- Date Picker -->
          <Datepicker
            v-show="time_option === 1"
            v-model="inputs.from_date"
            :format="'yyyy-MM-dd'"
            :input-class="'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'"
            placeholder="yyyy-MM-dd" />
          <!-- Year Select -->
          <select
            v-show="time_option !== 1 && time_option !== 5"
            v-model="year_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="opt in yearOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <!-- To Date / Month / Quarter -->
        <div :class="userRole === 'admin' ? 'md:col-span-1' : 'md:col-span-1'">
          <label v-show="time_option === 1 || time_option === 2 || time_option === 3" class="block text-sm font-medium text-gray-700 mb-1">
            {{ time_option === 1 ? 'Đến ngày' : time_option === 2 ? 'Tháng' : 'Quý' }}
          </label>
          <!-- Date Picker -->
          <Datepicker
            v-show="time_option === 1"
            v-model="inputs.to_date"
            :format="'yyyy-MM-dd'"
            :input-class="'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'"
            placeholder="yyyy-MM-dd" />
          <!-- Month Select -->
          <select
            v-show="time_option === 2"
            v-model="month_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="opt in monthOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
          <!-- Quarter Select -->
          <select
            v-show="time_option === 3"
            v-model="quarter_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="opt in quarterOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <!-- Status -->
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái báo giá</label>
          <select
            v-model="inputs.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <!-- Staff (Admin only) -->
        <div v-if="userRole === 'admin'" class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nhân viên phụ trách</label>
          <Multiselect
            v-model="inputs.staff_in_charge"
            :options="optionsStaff"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Tất cả--"
            label="name"
            track-by="name" />
        </div>
      </div>

      <!-- Second Filter Row -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">

        <!-- Brand -->
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Hãng sản phẩm</label>
          <Multiselect
            v-model="inputs.brand"
            :options="brandOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Tất cả--"
            label="name"
            track-by="name" />
        </div>

        <!-- Quotation Number -->
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Số báo giá</label>
          <input
            v-model="inputs.quotation_number"
            type="text"
            maxlength="100"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <!-- Company Type -->
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Loại CTY</label>
          <select
            v-model="inputs.customer_company_type_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="opt in optionsCompanyType" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <!-- Customer -->
        <div class="md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
          <Multiselect
            v-model="inputs.customer"
            :options="customerOptionStore"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Tất cả--"
            label="name"
            track-by="name" />
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-end mb-4">
        <button
          @click.prevent="prepareToSearch"
          :disabled="onSearch"
          class="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed">
          Tìm Kiếm
        </button>
      </div>

      <!-- Results Info and Export -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-sm text-gray-600">
          Số kết quả: {{ totalRow }}
        </div>
        <div v-if="excel_items.length > 0">
          <button
            @click="exportToExcel"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-semibold">
            Xuất Excel
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:3%">STT</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:8%">Số báo giá</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:5%">NV phụ trách</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:22%">Tên K.H</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:8%">Người liên hệ</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:8%">SĐT liên hệ</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:8%">Tổng tiền SP</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:8%">Thành tiền</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:8%">Lợi nhuận</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:8%">Ngày BG</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:6%">Trạng thái BG</th>
              <th class="px-2 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase" style="width:8%"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" :class="item.row_class" class="hover:bg-gray-50 border-b border-gray-200">
              <td class="px-2 py-2 text-sm text-gray-900">{{ item.stt }}</td>
              <td class="px-2 py-2 text-sm text-gray-900">
                <a
                  v-if="item.type === 0"
                  :href="'/quotation-' + scope + '/detail/' + item.id"
                  target="_blank"
                  title="Chi tiết báo giá"
                  class="text-blue-600 hover:text-blue-800 underline">
                  {{ item.quotation_number }}
                </a>
                <a
                  v-if="item.type === 1"
                  :href="'/quotation-project-' + scope + '/detail/' + item.id"
                  target="_blank"
                  title="Chi tiết báo giá"
                  class="text-blue-600 hover:text-blue-800 underline">
                  {{ item.quotation_number }}
                </a>
                <button
                  @click="showModalCopyQuotation(item)"
                  title="Copy báo giá"
                  class="ml-2 px-2 py-1 bg-white border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors text-xs">
                  <i class="fa fa-copy"/>
                </button>
              </td>
              <td class="px-2 py-2 text-sm text-gray-900">{{ item.staff_on_charge_name }}</td>
              <td class="px-2 py-2 text-sm text-gray-900">{{ item.customer_name }}</td>
              <td class="px-2 py-2 text-sm text-gray-900">{{ item.contact_person_name }}</td>
              <td class="px-2 py-2 text-sm text-gray-900">{{ item.contact_person_phone }}</td>
              <td class="px-2 py-2 text-sm text-gray-900 text-right">{{ currencyFormat(item.sub_total) }}</td>
              <td class="px-2 py-2 text-sm text-gray-900 text-right">{{ currencyFormat(item.total) }}</td>
              <td class="px-2 py-2 text-sm text-gray-900 text-right">{{ currencyFormat(item.profit) }}</td>
              <td class="px-2 py-2 text-sm text-gray-900">{{ item.created_at }}</td>
              <td class="px-2 py-2 text-sm text-gray-900" :class="item.item_class">
                {{ item.status_str }}
                <i
                  v-if="item.status === 0"
                  class="fa fa-edit cursor-pointer ml-1 text-blue-600 hover:text-blue-800"
                  @click="showModalUpdateQuotationStatus(item)"
                  title="Cập nhật trạng thái BG"/>
              </td>
              <td class="px-2 py-2 text-sm text-gray-900">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-show="item.status === -1"
                    @click="goToUpdate(item.id, item.type)"
                    class="px-3 py-1 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-xs">
                    Sửa
                  </button>
                  <button
                    v-show="item.status === -1 && userRole === 'admin'"
                    @click="deleteQuotation(item.id, item.customer_name)"
                    class="px-3 py-1 bg-white border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors text-xs">
                    Xóa
                  </button>
                  <button
                    v-show="item.status === 0"
                    @click="goToOrderSell(item.id, item.count_order_sell)"
                    class="px-3 py-1 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-xs">
                    Tạo đơn hàng
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="text-center py-4">
        <i class="fa fa-spinner fa-spin text-3xl text-blue-600"></i>
      </div>
      <div v-if="hasNext === false" class="text-center py-4 text-gray-600">--Hết--</div>
      <div v-if="hasNext === true && totalRow !== 0" class="text-center py-4">
        <i class="fa fa-angle-double-down text-2xl text-blue-600 cursor-pointer"></i>
      </div>
    </div>

    <!-- Modal Update Quotation Status -->
    <div v-if="showUpdateStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div class="p-6">
          <h4 class="text-xl font-semibold text-center text-green-600 mb-4">
            Cập nhật trạng thái báo giá
          </h4>
          <hr class="my-4">

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Mã báo giá: {{ currentQuotation.quotation_number }}
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Tên khách hàng: {{ currentQuotation.customer_name }}
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Trạng thái hiện tại: {{ currentQuotation.status_str }}
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Cập nhật thành: Báo giá lưu nháp
              </label>
            </div>
          </div>

          <div class="flex justify-between mt-6">
            <button
              @click.prevent="hideModalUpdateQuotationStatus"
              class="px-6 py-2 bg-white border border-gray-600 text-gray-600 rounded hover:bg-gray-50 transition-colors min-w-[120px]">
              Quay lại
            </button>

            <button
              v-show="!onChangeStatus"
              @click.prevent="confirmChangeStatus"
              :disabled="onChangeStatus"
              class="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px] disabled:opacity-50">
              Xác nhận
            </button>

            <div v-show="onChangeStatus" class="text-center">
              <i class="fa fa-spinner fa-spin text-3xl text-blue-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Copy Quotation -->
    <div v-if="showCopyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="p-6">
          <h4 class="text-xl font-semibold text-center mb-4">
            Đang copy báo giá: <span class="text-green-600">{{ copyQuotation.quotation_number }}</span>
          </h4>
          <hr class="my-4">

          <div v-show="loadingCopy" class="text-center py-4">
            <i class="fa fa-spinner fa-spin text-3xl text-blue-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Setting Quotation -->
    <div v-if="showSettingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div class="p-6">
          <h4 class="text-xl font-semibold text-center text-green-600 mb-4">
            Cài Đặt Báo Giá
          </h4>
          <hr class="my-4">

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Số ngày sẽ xuất hiện cảnh báo nếu quá hạn báo giá
              <span class="text-red-600">*</span>
            </label>
            <input
              v-model="number_of_days_overdue_quote"
              type="text"
              maxlength="5"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div class="flex justify-between mt-6">
            <button
              @click.prevent="hideModalSettingQuotation"
              class="px-6 py-2 bg-white border border-gray-600 text-gray-600 rounded hover:bg-gray-50 transition-colors min-w-[120px]">
              Quay lại
            </button>

            <button
              v-show="!onChangeSetting"
              @click.prevent="confirmChangeSettingQuotation"
              :disabled="onChangeSetting"
              class="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px] disabled:opacity-50">
              Lưu
            </button>

            <div v-show="onChangeSetting" class="text-center">
              <i class="fa fa-spinner fa-spin text-3xl text-blue-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import quotationApi from '@/api/quotation'
import settingApi from '@/api/setting'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToastNotification } from '@/composables/useToast'
import * as XLSX from 'xlsx'

const router = useRouter()
const { popToast } = useToastNotification()

// Refs
const timeOptions = ref([
  { value: 1, text: 'Ngày' },
  { value: 2, text: 'Tháng' },
  { value: 3, text: 'Quý' },
  { value: 4, text: 'Năm' },
  { value: 5, text: 'Tất cả' }
])

const yearOptions = ref([])
const quarterOptions = ref([
  { value: 1, text: 'Quý 1' },
  { value: 2, text: 'Quý 2' },
  { value: 3, text: 'Quý 3' },
  { value: 4, text: 'Quý 4' }
])

const monthOptions = ref([
  { value: 1, text: 'Tháng 1' },
  { value: 2, text: 'Tháng 2' },
  { value: 3, text: 'Tháng 3' },
  { value: 4, text: 'Tháng 4' },
  { value: 5, text: 'Tháng 5' },
  { value: 6, text: 'Tháng 6' },
  { value: 7, text: 'Tháng 7' },
  { value: 8, text: 'Tháng 8' },
  { value: 9, text: 'Tháng 9' },
  { value: 10, text: 'Tháng 10' },
  { value: 11, text: 'Tháng 11' },
  { value: 12, text: 'Tháng 12' }
])

const time_option = ref(1)
const year_input = ref(2024)
const quarter_input = ref(1)
const month_input = ref(1)

const statusOptions = ref([
  { value: null, text: '-- Tất cả --' },
  { value: -1, text: 'Báo giá lưu nháp' },
  { value: 0, text: 'Báo giá mới lập' },
  { value: 1, text: 'Báo giá đã thành công' },
  { value: 2, text: 'Báo giá đã rớt' }
])

const optionsCompanyType = ref([
  { value: null, text: '' },
  { value: 0, text: 'Khách lẻ' },
  { value: 1, text: 'Thương mại' },
  { value: 2, text: 'Nhà máy' },
  { value: 3, text: 'Công Trình' }
])

const optionsStaff = ref([])
const customerOptionStore = ref([])
const brandOptions = ref([])
const loadingOptions = ref(false)

const inputs = reactive({
  status: null,
  staff_in_charge: null,
  quotation_number: null,
  brand: null,
  customer: null,
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02'),
  customer_company_type_id: null
})

const items = ref([])
const excel_items = ref([])
const currentQuotation = ref({})
const copyQuotation = ref({})
const statusChange = ref(-1)
const reason_falling_note = ref(null)
const onChangeStatus = ref(false)
const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const loadingCopy = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const totalRow = ref(0)
const columnNumber = ref(5)
const userRole = ref('admin')
const scope = ref('all')
const isGetExcelItems = ref(false)
const number_of_days_overdue_quote = ref(3)
const onChangeSetting = ref(false)

// Modal visibility
const showUpdateStatusModal = ref(false)
const showCopyModal = ref(false)
const showSettingModal = ref(false)

const excel_fields = {
  'Mã báo giá': 'quotation_number',
  'Nhân viên phụ trách': 'staff_on_charge_name',
  'Tổng tiền sản phẩm': 'sub_total',
  'Tổng tiền SP': 'sub_total',
  'Thành tiền': 'total',
  'Giảm Giá': 'fixed_discount',
  'Thành Tiền': 'total',
  'Lợi nhuận': 'profit',
  'Ngày báo giá': 'created_at',
  'Trạng thái báo giá': 'status_str'
}

// Methods
const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const prepareDateInput = () => {
  const dateNow = new Date()
  inputs.to_date = dateNow
  const fromDate = new Date(dateNow)
  fromDate.setDate(fromDate.getDate() - 7)
  inputs.from_date = fromDate

  const currentYear = new Date().getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({ value: i, text: i })
  }
  month_input.value = new Date().getMonth() + 1
}

const getOptionsRelated = () => {
  console.log('this.userRole: ' + userRole.value)
  loadingOptions.value = true
  const params = {
    brands: true
  }
  if (userRole.value === 'staff') {
    params.customer_by_staff = true
  } else {
    params.customer_by_admin = true
    params.staffs = true
  }

  quotationApi.getOptionRelatedQuotationList(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      customerOptionStore.value = res.data.data.customers
      const itemEmpty = { id: null, name: '-- Tất cả --' }
      customerOptionStore.value.unshift(itemEmpty)

      brandOptions.value = res.data.data.brands
      const itemBrandEmpty = { id: null, name: '-- Tất cả --' }
      brandOptions.value.unshift(itemBrandEmpty)

      optionsStaff.value = res.data.data.staffs
      const itemStaffEmpty = { id: null, name: '-- Tất cả --' }
      optionsStaff.value.unshift(itemStaffEmpty)
    }

    loadingOptions.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loadingOptions.value = false
  })
}

const goToAdd = () => {
  console.log('this.userRole: ' + userRole.value)
  if (userRole.value === 'staff') {
    router.push('/quotation-staff/index')
  } else {
    router.push('/quotation-all/index')
  }
}

const goToAddProject = () => {
  console.log('this.userRole: ' + userRole.value)
  if (userRole.value === 'staff') {
    router.push('/quotation-project-staff/index')
  } else {
    router.push('/quotation-project-all/index')
  }
}

const goToUpdate = (id, type) => {
  console.log('this.userRole: ' + userRole.value)
  if (userRole.value === 'admin') {
    if (type === 0) {
      router.push('/quotation-all/index/' + id)
    } else {
      router.push('/quotation-project-all/index/' + id)
    }
  } else {
    if (type === 0) {
      router.push('/quotation-staff/index/' + id)
    } else {
      router.push('/quotation-project-staff/index/' + id)
    }
  }
}

const goToOrderSell = (id, count_order_sell) => {
  if (id) {
    if (count_order_sell) {
      if (confirm('Báo giá này đã lập đơn hàng bán, bạn có muốn tạo thêm đơn hàng bán từ báo giá này không?')) {
        console.log('this.userRole: ' + userRole.value)
        if (userRole.value === 'staff') {
          router.push('/order-sell-by-quotation-staff/' + id)
        } else {
          router.push('/order-sell-by-quotation/' + id)
        }
      }
    } else {
      console.log('this.userRole: ' + userRole.value)
      if (userRole.value === 'staff') {
        router.push('/order-sell-by-quotation-staff/' + id)
      } else {
        router.push('/order-sell-by-quotation/' + id)
      }
    }
  }
}

const showModalCopyQuotation = (quotation) => {
  copyQuotation.value = quotation
  showCopyModal.value = true

  loadingCopy.value = true
  quotationApi.copyQuotation(quotation.id).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      showCopyModal.value = false
      console.log('this.userRole: ' + userRole.value)
      if (userRole.value === 'admin') {
        router.push('/quotation-all/index/' + res.data.data)
      } else {
        router.push('/quotation-staff/index/' + res.data.data)
      }
    } else {
      popToast('danger', 'Có lỗi xảy ra trong quá trình copy')
    }
    loadingCopy.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onChangeStatus.value = false
  })
}

const showModalUpdateQuotationStatus = (quotation) => {
  currentQuotation.value = quotation
  showUpdateStatusModal.value = true
}

const hideModalUpdateQuotationStatus = () => {
  showUpdateStatusModal.value = false
}

const showModalSettingQuotation = () => {
  showSettingModal.value = true
}

const hideModalSettingQuotation = () => {
  showSettingModal.value = false
}

const confirmChangeSettingQuotation = () => {
  if (onChangeSetting.value) { return }

  if (!number_of_days_overdue_quote.value) {
    popToast('danger', 'Vui lòng nhập giá trị [Số ngày sẽ xuất hiện cảnh báo nếu quá hạn báo giá]')
    return
  }

  onChangeSetting.value = true
  const params = {
    code: 'number_of_days_overdue_quote',
    value: number_of_days_overdue_quote.value,
    group: 'quotation'
  }
  settingApi.updateStoreSetting(params).then(res => {
    if (res != null && res.data != null) {
      hideModalSettingQuotation()
      prepareToSearch()
    }
    onChangeSetting.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onChangeSetting.value = false
  })
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false

  search()
}

const getQuotationSetting = () => {
  const params = {
    group: 'quotation'
  }
  settingApi.getSettingByGroup(params).then(res => {
    if (res != null && res.data != null) {
      const settings = res.data.data

      for (const setting of settings) {
        if (setting.code === 'number_of_days_overdue_quote') {
          number_of_days_overdue_quote.value = setting.value
          break
        }
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const confirmChangeStatus = () => {
  if (onChangeStatus.value) { return }

  if (statusChange.value === currentQuotation.value.status) {
    return
  }

  onChangeStatus.value = true
  const params = {
    quotation_id: currentQuotation.value.id,
    status_old: currentQuotation.value.status,
    status_new: statusChange.value,
    reason_falling_note: reason_falling_note.value
  }
  console.log('this.userRole: ' + userRole.value)
  quotationApi.updateQuotationStatus(params, userRole.value).then(res => {
    if (res != null && res.data != null) {
      hideModalUpdateQuotationStatus()
      prepareToSearch()
    }
    onChangeStatus.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onChangeStatus.value = false
  })
}

const search = () => {
  if (onSearch.value) { return }

  onSearch.value = true
  loading.value = true

  let fromDate = inputs.from_date
  let toDate = inputs.to_date

  // Handle fromDate, toDate
  if (time_option.value === 2) {
    fromDate = year_input.value + '-' + month_input.value + '-01'
    toDate = year_input.value + '-' + month_input.value + '-' + new Date(year_input.value, month_input.value, 0).getDate()
  }
  if (time_option.value === 3) {
    const quarter = commonFunc.getMonthByQuarter(quarter_input.value)
    fromDate = year_input.value + '-' + quarter + '-01'
    toDate = year_input.value + '-' + (quarter + 2) + '-' + new Date(year_input.value, (quarter + 2), 0).getDate()
  }
  if (time_option.value === 4) {
    fromDate = year_input.value + '-01-01'
    toDate = year_input.value + '-12-' + new Date(year_input.value, 12, 0).getDate()
  }
  if (time_option.value === 5) {
    toDate = new Date().toJSON().slice(0, 10)
    fromDate = '2000-01-01'
  }

  // Handle Date objects
  if (fromDate instanceof Date) {
    fromDate = fromDate.toJSON().slice(0, 10)
  }
  if (toDate instanceof Date) {
    toDate = toDate.toJSON().slice(0, 10)
  }

  const params = {
    status: inputs.status,
    staff_in_charge: inputs.staff_in_charge && inputs.staff_in_charge.id ? inputs.staff_in_charge.id : null,
    brand_id: inputs.brand && inputs.brand.id ? inputs.brand.id : null,
    customer_id: inputs.customer ? inputs.customer.id : null,
    customer_company_type_id: inputs.customer_company_type_id,
    quotation_number: inputs.quotation_number,
    from_date: fromDate,
    to_date: toDate,
    limit: pageLimit.value,
    offset: offset.value
  }
  console.log('this.userRole: ' + userRole.value)
  quotationApi.searchQuotationAll(params, userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data.quotations
      totalRow.value = res.data.data.total_row

      // Update items
      if (loadByScroll.value) {
        const temp = items.value
        const newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      // Check has next
      if (offset.value + pageLimit.value >= res.data.data.total_row) {
        hasNext.value = false
      }

      if (!isGetExcelItems.value) {
        getExcelItem(params)
      }
    } else {
      items.value = []
      excel_items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    onSearch.value = false
    loading.value = false
  })
}

const getExcelItem = (params) => {
  if (isGetExcelItems.value) {
    return
  }

  excel_items.value = []

  // Define params
  params.limit = 999999

  console.log('this.userRole: ' + userRole.value)

  // Search
  quotationApi.searchQuotationAll(params, userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      excel_items.value = res.data.data.quotations
      isGetExcelItems.value = true
    }
  }).catch(err => {})
}

const exportToExcel = () => {
  if (excel_items.value.length === 0) {
    popToast('warning', 'Không có dữ liệu để xuất')
    return
  }

  // Map data according to excel_fields
  const dataToExport = excel_items.value.map(item => ({
    'Mã báo giá': item.quotation_number || '',
    'Nhân viên phụ trách': item.staff_on_charge_name || '',
    'Tổng tiền sản phẩm': item.sub_total || 0,
    'Thành tiền': item.total || 0,
    'Giảm Giá': item.fixed_discount || 0,
    'Lợi nhuận': item.profit || 0,
    'Ngày báo giá': item.created_at || '',
    'Trạng thái báo giá': item.status_str || ''
  }))

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(dataToExport)

  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách báo giá')

  // Write file
  XLSX.writeFile(wb, 'danh_sach_bao_gia.xlsx')
}

const currencyFormat = (num) => {
  let result = ''
  if (num === 0) {
    return '0'
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return result
}

const deleteQuotation = (id, name) => {
  console.log('this.userRole: ' + userRole.value)
  if (userRole.value === 'staff') {
    popToast('danger', 'Bạn không được quyền thực hiện chức năng này!')
    return
  }
  if (id) {
    if (confirm('Xóa báo giá cho K.H [' + name + ']. Bạn có chắc không?')) {
      quotationApi.deleteQuotation(id, userRole.value).then(res => {
        if (res != null && res.data != null) {
          prepareToSearch()
        }
      }).catch(err => {
        const errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  // UI by staff
  const url = location.href
  if (url.includes('quotation-staff')) {
    columnNumber.value = 4
    userRole.value = 'staff'
    scope.value = 'staff'
  } else {
    columnNumber.value = 5
    userRole.value = 'admin'
  }

  // Get default from date and to date
  prepareDateInput()

  window.addEventListener('scroll', onScroll)

  getOptionsRelated()

  // Search
  prepareToSearch()

  // Get quotation setting
  getQuotationSetting()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
  .total {
    color: #ed592a;
  }

  .bg-danger-cus {
    background-color: #fee2e1;
  }
</style>
