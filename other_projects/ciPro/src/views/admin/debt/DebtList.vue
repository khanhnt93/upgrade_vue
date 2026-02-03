<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- Add Button -->
      <div v-if="userRole == 'admin'" class="flex justify-end mb-4">
        <button
          @click="goToPay"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-64"
        >
          Thêm phiếu thanh toán
        </button>
      </div>

      <!-- Title -->
      <h4 class="text-2xl font-bold text-center text-orange-600 mb-6">Danh Sách Nợ Phải Thu</h4>

      <!-- Summary Statistics -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block">Tổng số tiền nợ phải thu: <b>{{ currencyFormat(sum_total) }}</b></label>
        </div>
        <div>
          <label class="block">Nợ phải thu chưa đến hạn:
            <b class="text-green-600">{{ currencyFormat(sum_total_not_out_of_date) }}</b>
          </label>
        </div>
        <div>
          <label class="block">Nợ phải thu quá hạn:
            <b class="text-red-600">{{ currencyFormat(sum_total_out_of_date) }}</b>
          </label>
        </div>
        <div class="flex items-center gap-2">
          <label class="block">Tiền khách trả dư:
            <b class="text-blue-600">{{ currencyFormat(sum_total_over_payment) }}</b>
          </label>
          <button
            @click="showModalOverPayment"
            class="px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cấn trừ công nợ
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid gap-4 mb-4" :class="userRole == 'admin' ? 'grid-cols-3' : 'grid-cols-2'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Khách hàng</label>
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
        <div v-if="userRole == 'admin'">
          <label class="block text-sm font-medium text-gray-700 mb-2">NV phụ trách</label>
          <select
            v-model="inputs.staff_in_charge"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option :value="null">--Chọn nhân viên--</option>
            <option
              v-for="option in optionsStaff"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <select
            v-model="inputs.status"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option :value="null"></option>
            <option value="1">Nợ quá hạn</option>
            <option value="2">Nợ chưa đến hạn</option>
          </select>
        </div>
      </div>

      <!-- Search & Export -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-sm">
          Số kết quả: <span class="font-bold text-gray-800">{{ totalRow }}</span>
        </div>
        <div class="flex gap-2">
          <download-excel
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none font-bold"
            :data="excel_items"
            :fields="excel_fields"
            worksheet="Danh sách nợ phải thu"
            name="Danh sách nợ phải thu"
          >
            <b>Xuất Excel</b>
          </download-excel>
          <button
            @click="prepareToSearch"
            :disabled="onSearch"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 w-32"
          >
            Tìm Kiếm
          </button>
        </div>
      </div>

      <hr class="mb-4" />

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-2 py-2 text-center w-12">STT</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Số ĐH bán</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Tên K.H</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Số ngày công nợ</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Tổng giá trị ĐH (gồm VAT)</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Số tiền còn nợ</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Ngày giao hàng</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Tình trạng giao hàng</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Số HĐ VAT ra</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Ngày thanh toán</th>
              <th class="border border-gray-300 px-2 py-2 text-center">NV phụ trách</th>
              <th class="border border-gray-300 px-2 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-2 py-2 text-center">{{ index + 1 }}</td>
              <td class="border border-gray-300 px-2 py-2">
                <a
                  :href="order_sell_detail_link + item.id"
                  target="_blank"
                  title="Chi tiết đơn hàng bán"
                  class="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {{ item.order_sell_number }}
                </a>
                <button
                  v-if="userRole == 'admin'"
                  @click="goToPayByCustomerId(item.customer_id)"
                  title="Tạo phiếu thu"
                  class="ml-2 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  Thanh toán
                </button>
              </td>
              <td class="border border-gray-300 px-2 py-2">{{ item.customer_name }}</td>
              <td class="border border-gray-300 px-2 py-2 text-center">{{ item.debt_date_number }}</td>
              <td class="border border-gray-300 px-2 py-2 text-right">{{ currencyFormat(item.total) }}</td>
              <td class="border border-gray-300 px-2 py-2 text-right">{{ currencyFormat(item.total_remaining) }}</td>
              <td class="border border-gray-300 px-2 py-2">{{ item.shipping_date }}</td>
              <td class="border border-gray-300 px-2 py-2">{{ item.shipping_status_str }}</td>
              <td class="border border-gray-300 px-2 py-2">{{ item.invoice_note }}</td>
              <td class="border border-gray-300 px-2 py-2">{{ item.payment_date }}</td>
              <td class="border border-gray-300 px-2 py-2">{{ item.staff_in_charge_name }}</td>
              <td class="border border-gray-300 px-2 py-2 text-center">
                <button
                  v-if="userRole == 'admin'"
                  @click="goToExpend(item.id)"
                  title="Xoá nợ"
                  class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Xoá nợ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading & Pagination -->
      <div class="text-center mt-4">
        <span v-show="loading" class="text-blue-500">
          <icon name="loading" width="60" />
        </span>
        <span v-if="!loading && hasNext === false" class="text-gray-500">--Hết--</span>
        <span v-if="!loading && hasNext === true && totalRow != 0" class="text-gray-500">
          <i class="fa fa-angle-double-down"></i>
        </span>
      </div>
    </div>

    <!-- Over Payment Modal -->
    <div
      v-if="showOverPaymentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="hideModalOverPayment"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-6xl max-h-screen overflow-y-auto">
        <h4 class="text-2xl font-bold text-center text-orange-600 mb-4">Cấn Trừ Công Nợ</h4>
        <hr class="mb-4" />

        <div class="mb-4">
          <p class="mb-2">Khách hàng: <b>{{ customerSelect.text }}</b></p>
          <p>Tổng tiền trả dư: <b>{{ currencyFormat(sum_total_over_payment) }}</b></p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full table-auto border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-2 py-2 text-center w-16">STT</th>
                <th class="border border-gray-300 px-2 py-2 text-center">Số ĐH bán</th>
                <th class="border border-gray-300 px-2 py-2 text-center">Số ngày công nợ</th>
                <th class="border border-gray-300 px-2 py-2 text-center">Tổng giá trị ĐH (gồm VAT)</th>
                <th class="border border-gray-300 px-2 py-2 text-center">Số tiền còn nợ</th>
                <th class="border border-gray-300 px-2 py-2 text-center w-16"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-2 py-2 text-center">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-2 py-2">{{ item.order_sell_number }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">{{ item.debt_date_number }}</td>
                <td class="border border-gray-300 px-2 py-2 text-right">{{ currencyFormat(item.total) }}</td>
                <td class="border border-gray-300 px-2 py-2 text-right">{{ currencyFormat(item.total_remaining) }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">
                  <input type="checkbox" v-model="payForDebts" :value="item.id" class="w-4 h-4" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-center gap-4 mt-6">
          <button
            @click="hideModalOverPayment"
            class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-32"
          >
            Đóng
          </button>
          <button
            v-show="!payingOverPayment"
            @click="payOverPayment()"
            :disabled="payForDebts.length == 0"
            title="Cấn trừ công nợ"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 w-32"
          >
            Cấn trừ
          </button>
          <span v-show="payingOverPayment" class="text-blue-500">
            <icon name="loading" width="60" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import debtApi from '@/api/debt'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { popToast } = useToast()

// Data
const loadingOptions = ref(false)
const customerSelect = ref({})
const customerOptions = ref([])
const optionsStaff = ref([])
const totalRow = ref(0)

const inputs = reactive({
  customer_id: null,
  staff_in_charge: null,
  status: null
})

const items = ref([])
const excel_fields = {
  'Số ĐH bán': 'order_sell_number',
  'Tên KH': 'customer_name',
  'Số ngày công nợ': 'debt_date_number',
  'Tổng giá trị ĐH (gồm VAT)': 'total',
  'Số tiền còn nợ': 'total_remaining',
  'Ngày giao hàng': 'shipping_date',
  'Tình trạng giao hàng': 'shipping_status_str',
  'Số HĐ VAT ra': 'invoice_note',
  'Ngày thanh toán': 'payment_date',
  'NV phụ trách': 'staff_in_charge_name'
}
const excel_items = ref([])

const sum_total = ref(0)
const sum_total_not_out_of_date = ref(0)
const sum_total_out_of_date = ref(0)
const sum_total_over_payment = ref(0)

const pageLimit = Constant.PAGE_LIMIT
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const loading = ref(false)
const loadByScroll = ref(false)
const isGetExcelItems = ref(false)

const userRole = ref('admin')
const order_sell_detail_link = ref('/order-sell-all/detail/')
const currentCustomer = ref(null)

const showOverPaymentModal = ref(false)
const payingOverPayment = ref(false)
const payForDebts = ref([])

// Methods
const currencyFormat = (num) => {
  if (num == 0) return '0'
  if (num) return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return ''
}

const onScroll = (event) => {
  if (onSearch.value) return
  event.preventDefault()

  const body = document.body
  const html = document.documentElement
  const scrollPosition = window.pageYOffset + window.innerHeight + 25
  const maxHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )

  if (scrollPosition > maxHeight && hasNext.value) {
    offset.value = offset.value + pageLimit
    loadByScroll.value = true
    search()
  }
}

const getOptions = async () => {
  loadingOptions.value = true
  await debtApi.getOptionsRelatedDebt({}, userRole.value)
    .then((result) => {
      if (result?.data?.data) {
        const data = result.data.data

        // Staff options
        optionsStaff.value = [{ value: null, text: '' }]
        if (data.staffs) {
          for (const staff of data.staffs) {
            optionsStaff.value.push(staff)
          }
        }

        // Customer options
        customerOptions.value = data.customers || []
        const itemEmpty = { value: null, text: null }
        customerOptions.value.unshift(itemEmpty)
      }
      loadingOptions.value = false
    })
    .catch((error) => {
      loadingOptions.value = false
      popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
    })
}

const goToPay = () => {
  if (userRole.value == 'admin') {
    router.push('/debt/pay')
  }
}

const goToPayByCustomerId = (customer_id) => {
  if (userRole.value == 'admin') {
    router.push({ name: 'Thanh toán nợ phải thu', params: { id: customer_id } })
  }
}

const goToExpend = (id) => {
  if (userRole.value == 'admin') {
    window.open('/expend-from-order-sell/' + id + '?isDebtRelief=1', '_blank')
  }
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

const search = async () => {
  if (onSearch.value) return

  loading.value = true
  onSearch.value = true

  const params = {
    customer_id: customerSelect.value.value || null,
    staff_in_charge: inputs.staff_in_charge,
    status: inputs.status,
    limit: pageLimit,
    offset: offset.value
  }
  currentCustomer.value = JSON.parse(JSON.stringify(params.customer_id))

  await debtApi.searchdebt(params, userRole.value)
    .then((result) => {
      if (result?.data?.data) {
        const data = result.data.data

        if (loadByScroll.value) {
          items.value = items.value.concat(data)
        } else {
          items.value = data
        }
        loadByScroll.value = false

        if (!isGetExcelItems.value) {
          getExcelItem(params)
        } else {
          if (parseInt(offset.value) + parseInt(pageLimit) >= parseInt(totalRow.value)) {
            hasNext.value = false
          }
        }
      }
      loading.value = false
      onSearch.value = false
    })
    .catch((error) => {
      loading.value = false
      onSearch.value = false
      popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
    })
}

const getExcelItem = async (params) => {
  if (isGetExcelItems.value) return

  excel_items.value = []
  const excelParams = { ...params, limit: 999999 }

  await debtApi.searchdebt(excelParams, userRole.value)
    .then((result) => {
      if (result?.data?.data) {
        const datas = result.data.data
        excel_items.value = datas

        totalRow.value = datas.length
        if (parseInt(offset.value) + parseInt(pageLimit) >= parseInt(totalRow.value)) {
          hasNext.value = false
        }

        // Calculate sums
        sum_total.value = 0
        sum_total_not_out_of_date.value = 0
        sum_total_out_of_date.value = 0
        sum_total_over_payment.value = 0

        const list_checked = []
        for (const data of datas) {
          sum_total.value += data.total_remaining

          if (data.total_over_payment && !list_checked.includes(data.customer_id)) {
            sum_total_over_payment.value += data.total_over_payment
            list_checked.push(data.customer_id)
          }

          if (data.payment_date) {
            if (new Date(data.payment_date) < new Date()) {
              sum_total_out_of_date.value += data.total_remaining
            } else {
              sum_total_not_out_of_date.value += data.total_remaining
            }
          }
        }

        isGetExcelItems.value = true
      }
    })
    .catch((error) => {
      popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
    })
}

const showModalOverPayment = () => {
  if (!currentCustomer.value) {
    popToast('Lỗi', 'Vui lòng chọn [Khách hàng] cụ thể sau đó click "Tìm kiếm" để sử dụng chức năng "Cấn trừ công nợ"', 'error')
    return
  }
  if (currentCustomer.value != customerSelect.value.value) {
    popToast('Lỗi', 'Vui lòng chọn [Khách hàng] cụ thể sau đó click "Tìm kiếm" để sử dụng chức năng "Cấn trừ công nợ"', 'error')
    return
  }
  if (sum_total_over_payment.value == 0) {
    popToast('Lỗi', 'Không có dư nợ để cấn trừ', 'error')
    return
  }
  showOverPaymentModal.value = true
}

const hideModalOverPayment = () => {
  showOverPaymentModal.value = false
}

const payOverPayment = async () => {
  if (payForDebts.value.length == 0) {
    popToast('Lỗi', 'Vui lòng lựa chọn đơn hàng bạn muốn cấn trừ', 'error')
    return
  }

  payingOverPayment.value = true

  const debts = []
  for (const item of items.value) {
    if (payForDebts.value.includes(item.id)) {
      debts.push({
        order_sell_id: item.id,
        customer_id: item.customer_id,
        debt_total_remaining: item.total_remaining
      })
    }
  }

  const params = {
    debts: debts,
    sum_total_over_payment: sum_total_over_payment.value
  }

  await debtApi.payOverPayment(params)
    .then((result) => {
      if (result?.data?.status == 200) {
        isGetExcelItems.value = false
        hideModalOverPayment()
        search()
        payingOverPayment.value = false
      }
    })
    .catch((error) => {
      payingOverPayment.value = false
      popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
    })
}

// Lifecycle
onMounted(() => {
  // Determine UI by role
  const url = location.href
  if (url.includes('debt-sale')) {
    userRole.value = 'staff'
    order_sell_detail_link.value = '/order-sell-staff/detail/'
  } else {
    userRole.value = 'admin'
    order_sell_detail_link.value = '/order-sell-all/detail/'
  }

  window.addEventListener('scroll', onScroll)
  getOptions()
  prepareToSearch()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
