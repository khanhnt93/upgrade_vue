<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- Header Buttons -->
      <div class="flex justify-end gap-2 mb-4">
        <button
          @click="goToAddRepo"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-48"
        >
          Thêm mới nhập kho
        </button>
        <button
          @click="goToAdd"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48"
        >
          Thêm mới từ ĐH bán
        </button>
      </div>

      <!-- Title -->
      <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Danh Sách Đơn Hàng Nhập</h4>
      <hr class="mb-4">

      <!-- Filters Row 1 -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Thời gian</label>
          <select v-model="time_option" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option v-for="opt in timeOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label v-show="time_option != 5" class="block text-sm font-medium mb-1">
            {{ time_option == 1 ? 'Từ ngày' : 'Năm' }}
          </label>
          <Datepicker
            v-show="time_option == 1"
            v-model="inputs.from_date"
            :format="'yyyy-MM-dd'"
          />
          <select
            v-show="time_option != 1 && time_option != 5"
            v-model="year_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option v-for="opt in yearOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label v-show="time_option == 1 || time_option == 2 || time_option == 3" class="block text-sm font-medium mb-1">
            {{ time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
          </label>
          <Datepicker
            v-show="time_option == 1"
            v-model="inputs.to_date"
            :format="'yyyy-MM-dd'"
          />
          <select
            v-show="time_option == 2"
            v-model="month_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option v-for="opt in monthOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
          <select
            v-show="time_option == 3"
            v-model="quarter_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option v-for="opt in quarterOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <div class="md:col-span-6">
          <label class="block text-sm font-medium mb-1">Tên Nhà Cung cấp</label>
          <Multiselect
            v-model="supplierSelect"
            :options="supplierOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn nhà cung cấp--"
            label="name"
            track-by="name"
          />
        </div>
      </div>

      <!-- Filters Row 2 -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Tình trạng thanh toán</label>
          <select v-model="inputs.payment_status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option v-for="opt in paymentStatusOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Tình trạng hàng</label>
          <select v-model="inputs.status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Số HĐ VAT vào</label>
          <input
            v-model="inputs.invoice_note"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Số HĐ VAT"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Mã ĐH nhập</label>
          <input
            v-model="inputs.order_buy_number"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Mã ĐH nhập"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Phiếu liên quan</label>
          <input
            v-model="inputs.related_number"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Mã phiếu"
          />
        </div>

        <div class="md:col-span-2 flex items-end">
          <button
            @click="prepareToSearch"
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <!-- Excel Export Button -->
      <div class="flex justify-end mb-4">
        <button
          @click="exportToExcel"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <i class="fa fa-file-excel-o"></i> Excel
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ĐH nhập</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phiếu liên quan</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà cung cấp</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TG dự kiến GH</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lấy VAT</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tình trạng hàng</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PT thanh toán</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Còn phải trả</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số HĐ VAT vào</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái trả hàng</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in items" :key="item.id" :class="item.status == -1 ? 'bg-red-50' : ''">
              <td class="px-3 py-4 whitespace-nowrap text-sm">{{ index + 1 }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">
                <a :href="'/order-buy-detail/' + item.id" target="_blank" class="text-blue-600 hover:underline">
                  {{ item.order_buy_number }}
                </a>
              </td>
              <td class="px-3 py-4 text-sm" v-html="item.ballots"></td>
              <td class="px-3 py-4 text-sm">{{ item.supplier_name }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">{{ item.shipping_date }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">{{ currencyFormat(item.total) }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">{{ item.have_vat ? 'Có' : 'Không' }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">{{ item.status_str }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">{{ item.payment_method }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">
                {{ currencyFormat(item.amount_remaining) }}
                <span v-show="item.amount_remaining != item.total" class="ml-2">
                  <i class="fa fa-info-circle cursor-pointer" title="Chi tiết thanh toán" @click="showModalDetailPayment(item.id)"></i>
                </span>
              </td>
              <td class="px-3 py-4 text-sm">
                {{ item.invoice_note }}
                <i class="fa fa-edit cursor-pointer ml-2" @click="showModalUpdateInvoiceNote(item)" title="Cập nhật HĐ VAT vào"></i>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">{{ item.product_back_status_str }}</td>
              <td class="px-3 py-4 text-sm">
                {{ item.note }}
                <i class="fa fa-edit cursor-pointer ml-2" @click="showModalUpdateNote(item)" title="Cập nhật ghi chú"></i>
              </td>
              <td class="px-3 py-4 text-sm">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-if="item.status < 1"
                    @click="goToUpdate(item.id)"
                    class="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Sửa
                  </button>
                  <button
                    v-if="item.status < 1"
                    @click="deleteOrderBuy(item.id, item.supplier_name)"
                    class="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Xóa
                  </button>
                  <button
                    v-show="item.status > -1"
                    @click="openModalCreateBallot(item)"
                    class="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Tạo phiếu
                  </button>
                  <button
                    v-show="item.status < 3 && !loadingDetail"
                    @click="handleProductExcel(item.id)"
                    class="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                  >
                    In excel
                  </button>
                  <span v-show="loadingDetail" class="text-blue-500">
                    <i class="fa fa-spinner fa-spin"></i>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <div class="text-center mt-4">
        <span v-show="loading" class="text-blue-500">
          <i class="fa fa-spinner fa-spin text-3xl"></i>
        </span>
        <span v-if="hasNext === false" class="text-gray-500">--Hết--</span>
        <span v-if="hasNext === true && totalRow != 0" class="text-blue-500">
          <i class="fa fa-angle-double-down text-2xl"></i>
        </span>
      </div>
    </div>

    <!-- Modal Update Note -->
    <div v-if="showUpdateNoteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h4 class="text-lg font-semibold text-center text-orange-600 mb-4">Cập nhật ghi chú</h4>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Mã đơn hàng nhập: {{ currentOrderBuy.order_buy_number }}</label>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Tên nhà cung cấp: {{ currentOrderBuy.supplier_name }}</label>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Ghi chú:</label>
            <textarea
              v-model="currentOrderBuy.note"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div class="flex justify-between mt-4">
            <button
              @click="hideModalChangeNote"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-32"
            >
              Quay lại
            </button>
            <button
              @click="confirmChangeNote"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Update Invoice Note -->
    <div v-if="showUpdateInvoiceNoteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h4 class="text-lg font-semibold text-center text-orange-600 mb-4">Cập nhật HĐ VAT vào</h4>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Mã đơn hàng nhập: {{ currentOrderBuy.order_buy_number }}</label>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Tên nhà cung cấp: {{ currentOrderBuy.supplier_name }}</label>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Số HĐ VAT vào:</label>
            <input
              v-model="currentOrderBuy.invoice_note"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div class="flex justify-between mt-4">
            <button
              @click="hideModalChangeInvoiceNote"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-32"
            >
              Quay lại
            </button>
            <button
              @click="confirmChangeInvoiceNote"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create Ballot -->
    <div v-if="showCreateBallotModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h4 class="text-lg font-semibold text-center text-orange-600 mb-4">Tạo phiếu liên quan</h4>
          <hr class="mb-4">

          <div class="space-y-3">
            <button
              @click="goToRepoInput(currentOrderBuy.id)"
              class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Phiếu nhập kho
            </button>
            <button
              @click="goToProductBack(currentOrderBuy.id)"
              class="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            >
              Phiếu trả hàng nhập
            </button>
            <button
              @click="goToExpense(currentOrderBuy.id)"
              class="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Phiếu chi
            </button>
            <button
              @click="goToIncomeBack(currentOrderBuy.id)"
              class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Phiếu thu từ trả hàng
            </button>
          </div>

          <div class="flex justify-center mt-4">
            <button
              @click="hideModalCreateBallot"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-32"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detail Payment -->
    <div v-if="showDetailPaymentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h4 class="text-lg font-semibold text-center text-orange-600 mb-4">Chi tiết thanh toán</h4>
          <hr class="mb-4">

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="field in expendFields" :key="field.key" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in expendItems" :key="index">
                  <td class="px-3 py-4 whitespace-nowrap text-sm">{{ index + 1 }}</td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm">{{ item.created_at }}</td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm">{{ item.fund_number }}</td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm">{{ currencyFormat(item.amount) }}</td>
                  <td class="px-3 py-4 text-sm">{{ item.bank_account_info }}</td>
                  <td class="px-3 py-4 text-sm">{{ item.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-show="loadingExpend" class="text-center mt-4">
            <i class="fa fa-spinner fa-spin text-3xl text-blue-500"></i>
          </div>

          <div class="flex justify-end mt-4">
            <button
              @click="hideModalDetailPayment"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-32"
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
import { useToast } from '@/composables/useToast'
import orderBuyApi from '@/api/orderBuy'
import supplierApi from '@/api/supplier'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import * as XLSX from 'xlsx'

const router = useRouter()
const { showToast } = useToast()

// Data
const timeOptions = [
  { value: 1, text: 'Ngày' },
  { value: 2, text: 'Tháng' },
  { value: 3, text: 'Quý' },
  { value: 4, text: 'Năm' },
  { value: 5, text: 'Tất cả' }
]

const yearOptions = ref([])
const quarterOptions = [
  { value: 1, text: 'Quý 1' },
  { value: 2, text: 'Quý 2' },
  { value: 3, text: 'Quý 3' },
  { value: 4, text: 'Quý 4' }
]

const monthOptions = [
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
]

const time_option = ref(1)
const year_input = ref(2023)
const quarter_input = ref(1)
const month_input = ref(1)

const statusOptions = [
  { value: null, text: 'Tất cả' },
  { value: -1, text: 'Lưu nháp' },
  { value: 0, text: 'Đã đặt chưa giao' },
  { value: 1, text: 'Đã nhập kho' },
  { value: 2, text: 'Đã nhập kho một phần' }
]

const paymentStatusOptions = [
  { value: null, text: 'Tất cả' },
  { value: 1, text: 'Chưa thanh toán' },
  { value: 2, text: 'Đã thanh toán' }
]

const supplierSelect = ref({})
const supplierOptions = ref([])
const inputs = reactive({
  status: null,
  payment_status: null,
  supplier_id: null,
  order_buy_number: '',
  related_number: '',
  invoice_note: null,
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02')
})

const loadingOptions = ref(false)
const items = ref([])
const currentOrderBuy = ref({})
const loadingDetail = ref(false)
const onSearch = ref(false)
const loadByScroll = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = Constant.PAGE_LIMIT
const offset = ref(0)
const totalRow = ref(0)

const excel_items = ref([])
const excel_fields = {
  'STT': 'stt',
  'Số đơn hàng nhập': 'order_buy_number',
  'Các phiếu liên quan': 'ballots',
  'Nhà cung cấp': 'supplier_name',
  'Thời gian dự kiến GH': 'shipping_date',
  'Tổng tiền (Gồm vat)': 'total',
  'Lấy VAT': 'have_vat',
  'Tình trạng hàng': 'status_str',
  'Phương thức thanh toán': 'payment_method',
  'Tình trạng thanh toán': 'payment_status',
  'Số HD vat Vào': 'invoice_note',
  'Trạng thái trả hàng': 'product_back_status_str',
  'Ghi chú': 'note'
}

const isGetExcelItems = ref(false)
const expendFields = [
  { key: 'stt', label: 'STT' },
  { key: 'created_at', label: 'Ngày' },
  { key: 'fund_number', label: 'Số phiếu' },
  { key: 'amount', label: 'Số tiền' },
  { key: 'bank_account_info', label: 'Sổ thu chi' },
  { key: 'description', label: 'Nội dung chi' }
]
const expendItems = ref([])
const loadingExpend = ref(false)

// Modal states
const showUpdateNoteModal = ref(false)
const showUpdateInvoiceNoteModal = ref(false)
const showCreateBallotModal = ref(false)
const showDetailPaymentModal = ref(false)

// Methods
const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (
    window.pageYOffset + window.innerHeight + 25 >
    Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  ) {
    if (hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const prepareDateInput = () => {
  let dateNow = new Date()
  inputs.to_date = dateNow
  inputs.from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))

  let currentYear = new Date().getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({ value: i, text: i })
  }
  month_input.value = new Date().getMonth() + 1
}

const getOptionSupplier = () => {
  loadingOptions.value = true
  supplierApi.getListSupplierOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      supplierOptions.value = res.data.data
      let itemEmpty = { id: null, name: null, address: null }
      supplierOptions.value.unshift(itemEmpty)
      loadingOptions.value = false
    }
  }).catch(err => {
    loadingOptions.value = false
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)
  })
}

const goToAdd = () => {
  router.push('/order-buy/index')
}

const goToAddRepo = () => {
  router.push('/order-buy/index-repo')
}

const goToUpdate = (id) => {
  router.push('/order-buy/index-repo/' + id)
}

const goToRepoInput = (id) => {
  showCreateBallotModal.value = false
  window.open('/repository-from-order-buy/' + id, '_blank')
}

const goToProductBack = (id) => {
  showCreateBallotModal.value = false
  window.open('/order-buy-back/' + id, '_blank')
}

const goToExpense = (id) => {
  showCreateBallotModal.value = false
  window.open('/expend-from-order-buy/' + id, '_blank')
}

const goToIncomeBack = (id) => {
  showCreateBallotModal.value = false
  window.open('/income-from-product-back/' + id, '_blank')
}

const showModalUpdateNote = (orderBuy) => {
  currentOrderBuy.value = { ...orderBuy }
  showUpdateNoteModal.value = true
}

const hideModalChangeNote = () => {
  currentOrderBuy.value = {}
  showUpdateNoteModal.value = false
}

const confirmChangeNote = () => {
  let params = {
    order_buy_id: currentOrderBuy.value.id,
    note: currentOrderBuy.value.note
  }
  orderBuyApi.updateOrderBuyNote(params).then(res => {
    if (res != null && res.data != null) {
      for (let index in items.value) {
        if (items.value[index].id == currentOrderBuy.value.id) {
          items.value[index].note = currentOrderBuy.value.note
          break
        }
      }
      showUpdateNoteModal.value = false
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)
  })
}

const showModalUpdateInvoiceNote = (orderBuy) => {
  currentOrderBuy.value = { ...orderBuy }
  showUpdateInvoiceNoteModal.value = true
}

const hideModalChangeInvoiceNote = () => {
  currentOrderBuy.value = {}
  showUpdateInvoiceNoteModal.value = false
}

const confirmChangeInvoiceNote = () => {
  let params = {
    order_buy_id: currentOrderBuy.value.id,
    invoice_note: currentOrderBuy.value.invoice_note
  }
  orderBuyApi.updateOrderBuyInvoiceNote(params).then(res => {
    if (res != null && res.data != null) {
      for (let index in items.value) {
        if (items.value[index].id == currentOrderBuy.value.id) {
          items.value[index].invoice_note = currentOrderBuy.value.invoice_note
          break
        }
      }
      showUpdateInvoiceNoteModal.value = false
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)
  })
}

const handleProductExcel = (orderBuyId) => {
  if (orderBuyId) {
    loadingDetail.value = true
    orderBuyApi.getOrderBuyDetail(orderBuyId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        let excel_one_items = res.data.data.products || []

        if (excel_one_items.length > 0) {
          const excel_one_fields = {
            'STT': 'stt',
            'Mã SP': 'product_code',
            'Tên SP': 'product_name',
            'ĐVT': 'unit',
            'SL': 'quantity',
            'Giá': 'unit_price',
            'Thành tiền': 'total_price'
          }

          downloadExcel({
            data: excel_one_items,
            fields: excel_one_fields,
            worksheet: 'Chi tiết đơn hàng',
            name: 'chi-tiet-don-hang-nhap.xls'
          })
        }
        loadingDetail.value = false
      }
    }).catch(err => {
      let errorMess = commonFunc.handleStaffError(err)
      showToast('danger', errorMess)
      loadingDetail.value = false
    })
  }
}

const prepareToSearch = () => {
  offset.value = 0
  hasNext.value = true
  items.value = []
  excel_items.value = []
  isGetExcelItems.value = false
  onSearch.value = true
  loading.value = true
  search()
}

const handleBallot = (orderBuys, isExcel) => {
  for (let item of orderBuys) {
    let ballots = ''
    if (item.repository_inputs && item.repository_inputs.length > 0) {
      for (let repo of item.repository_inputs) {
        if (isExcel) {
          ballots += repo.repository_input_number + ', '
        } else {
          ballots += `<a href="/repository-input-detail/${repo.id}" target="_blank" class="text-blue-600 hover:underline">${repo.repository_input_number}</a>, `
        }
      }
    }
    if (item.product_backs && item.product_backs.length > 0) {
      for (let back of item.product_backs) {
        if (isExcel) {
          ballots += back.product_back_number + ', '
        } else {
          ballots += `<a href="/order-buy-back-detail/${back.id}" target="_blank" class="text-blue-600 hover:underline">${back.product_back_number}</a>, `
        }
      }
    }
    if (ballots) {
      ballots = ballots.slice(0, -2)
    }
    item.ballots = ballots
  }
  return orderBuys
}

const search = () => {
  let fromDate = inputs.from_date instanceof Date
    ? inputs.from_date.toISOString().slice(0, 10)
    : inputs.from_date

  let toDate = inputs.to_date instanceof Date
    ? inputs.to_date.toISOString().slice(0, 10)
    : inputs.to_date

  if (time_option.value == 2) {
    fromDate = year_input.value + '-' + String(month_input.value).padStart(2, '0') + '-01'
    let lastDay = new Date(year_input.value, month_input.value, 0).getDate()
    toDate = year_input.value + '-' + String(month_input.value).padStart(2, '0') + '-' + lastDay
  } else if (time_option.value == 3) {
    let startMonth = (quarter_input.value - 1) * 3 + 1
    let endMonth = quarter_input.value * 3
    fromDate = year_input.value + '-' + String(startMonth).padStart(2, '0') + '-01'
    let lastDay = new Date(year_input.value, endMonth, 0).getDate()
    toDate = year_input.value + '-' + String(endMonth).padStart(2, '0') + '-' + lastDay
  } else if (time_option.value == 4) {
    fromDate = year_input.value + '-01-01'
    toDate = year_input.value + '-12-31'
  } else if (time_option.value == 5) {
    fromDate = '2000-01-01'
    toDate = '2100-12-31'
  }

  let params = {
    supplier_id: supplierSelect.value.id ? supplierSelect.value.id : null,
    status: inputs.status,
    payment_status: inputs.payment_status,
    order_buy_number: inputs.order_buy_number.trim(),
    related_number: inputs.related_number.trim(),
    invoice_note: inputs.invoice_note,
    from_date: fromDate,
    to_date: toDate,
    limit: pageLimit,
    offset: offset.value
  }

  orderBuyApi.searchOrderBuy(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.order_buys
      totalRow.value = res.data.data.total_row

      it = handleBallot(it, false)

      if (loadByScroll.value) {
        let temp = items.value
        items.value = temp.concat(it)
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if (offset.value + pageLimit >= res.data.data.total_row) {
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
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const getExcelItem = (params) => {
  if (isGetExcelItems.value) {
    return
  }

  excel_items.value = []
  params.limit = 999999

  orderBuyApi.searchOrderBuy(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let order_buys = res.data.data.order_buys
      order_buys = handleBallot(order_buys, true)
      isGetExcelItems.value = true

      for (let item of order_buys) {
        if (item.have_vat) {
          item.have_vat = 'Có'
        } else {
          item.have_vat = 'Không'
        }

        if (item.amount_remaining > 0) {
          item.payment_status = 'Chưa TT'
        } else {
          item.payment_status = 'Đã TT'
        }

        excel_items.value.push(item)
      }
    }
  }).catch(() => {})
}

const currencyFormat = (num) => {
  if (num == 0) {
    return '0'
  }
  if (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return ''
}

const openModalCreateBallot = (orderBuy) => {
  currentOrderBuy.value = orderBuy
  showCreateBallotModal.value = true
}

const hideModalCreateBallot = () => {
  showCreateBallotModal.value = false
}

const deleteOrderBuy = (id, name) => {
  if (id) {
    if (confirm('Xóa đơn hàng nhập từ nhà cung cấp [' + name + ']. Bạn có chắc không?')) {
      orderBuyApi.deleteOrderBuy(id).then(res => {
        if (res != null && res.data != null) {
          prepareToSearch()
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
      })
    }
  }
}

const getListExpend = (id) => {
  loadingExpend.value = true

  orderBuyApi.getListExpend(id).then(res => {
    if (res != null && res.data != null) {
      expendItems.value = res.data.data
    }
    loadingExpend.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)
    loadingExpend.value = false
  })
}

const showModalDetailPayment = (id) => {
  getListExpend(id)
  showDetailPaymentModal.value = true
}

const hideModalDetailPayment = () => {
  showDetailPaymentModal.value = false
}

const exportToExcel = () => {
  // Prepare data with field mappings
  const exportData = excel_items.value.map((item, index) => ({
    'STT': index + 1,
    'Số đơn hàng nhập': item.order_buy_number,
    'Các phiếu liên quan': item.ballots,
    'Nhà cung cấp': item.supplier_name,
    'Thời gian dự kiến GH': item.shipping_date,
    'Tổng tiền (Gồm vat)': item.total,
    'Lấy VAT': item.have_vat,
    'Tình trạng hàng': item.status_str,
    'Phương thức thanh toán': item.payment_method,
    'Tình trạng thanh toán': item.payment_status,
    'Số HD vat Vào': item.invoice_note,
    'Trạng thái trả hàng': item.product_back_status_str,
    'Ghi chú': item.note
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Đơn hàng nhập')
  XLSX.writeFile(workbook, 'don-hang-nhap.xlsx')
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', onScroll)

  prepareDateInput()
  getOptionSupplier()
  prepareToSearch()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.total {
  color: #ed592a;
}
</style>
