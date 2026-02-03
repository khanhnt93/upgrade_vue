<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Add Payment Button -->
        <div class="flex justify-end mb-4">
          <button
            @click="goToPay"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Thêm phiếu thanh toán
          </button>
        </div>

        <h4 class="text-2xl font-bold text-center text-orange-600 mb-4">Danh Sách Nợ Phải Trả</h4>

        <!-- Summary Information -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label>Tổng số tiền nợ phải trả: <b>{{ currencyFormat(sum_total) }}</b></label>
          </div>
          <div>
            <label>Nợ phải trả quá hạn:
              <b class="text-red-600">{{ currencyFormat(sum_total_out_of_date) }}</b>
            </label>
          </div>
          <div>
            <label>Tổng số tiền nợ dự kiến:
              <b class="text-blue-600">{{ currencyFormat(sum_total_feature) }}</b>
            </label>
          </div>
          <div>
            <label>Nợ phải trả chưa đến hạn:
              <b class="text-green-600">{{ currencyFormat(sum_total_not_out_of_date) }}</b>
            </label>
          </div>
        </div>

        <div class="mb-4">
          <label>Tiền nhà cung cấp trả dư:
            <b class="text-green-600">{{ currencyFormat(sum_total_over_payment) }}</b>
          </label>
          <button
            @click="showModalOverPayment"
            class="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Cấn trừ công nợ
          </button>
        </div>

        <!-- Filters -->
        <div class="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block mb-2">Nhà cung cấp</label>
            <multiselect
              v-model="supplierSelect"
              :options="supplierOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn nhà cung cấp--"
              label="name"
              track-by="name"
            >
            </multiselect>
          </div>
          <div>
            <label class="block mb-2">Tình trạng nợ</label>
            <select
              v-model="inputs.pay_status"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option
                v-for="option in payStatus"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
          <div>
            <label class="block mb-2">Tình trạng GH</label>
            <select
              v-model="inputs.shipping_status"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option
                v-for="option in shippingStatus"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
          <div>
            <label class="block mb-2">Số HĐ VAT vào</label>
            <input
              id="invoice_note"
              type="text"
              maxlength="20"
              autocomplete="new-password"
              v-model="inputs.invoice_note"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Search and Export Buttons -->
        <div class="flex justify-between mb-4">
          <div>
            Số kết quả: <span class="font-bold text-blue-600">{{ totalRow }}</span>
          </div>
          <div class="flex space-x-4">
            <button
              @click="prepareToSearch"
              :disabled="onSearch"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tìm Kiếm
            </button>
            <download-excel
              class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer inline-block"
              :data="excel_items"
              :fields="excel_fields"
              worksheet="Danh sách nợ phải trả"
              name="Danh sách nợ phải trả"
            >
              <b>Xuất Excel</b>
            </download-excel>
          </div>
        </div>

        <hr class="mb-4" />

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-4 py-2 text-center w-16">STT</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Số ĐH mua</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Tên NCC</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Số ngày công nợ</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Tổng tiền (gồm VAT)</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Số tiền còn phải TT</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Ngày nhập kho</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Tình trạng hàng</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Ngày thanh toán</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Số HĐ VAT vào</th>
                <th class="border border-gray-300 px-4 py-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2 text-center">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <a
                    :href="'/order-buy/detail/' + item.id"
                    target="_blank"
                    title="Chi tiết đơn hàng nhập"
                    class="text-blue-600 hover:underline"
                  >
                    {{ item.order_buy_number }}
                  </a>
                  <span v-show="!item.order_buy_number.includes('V')">&nbsp;&nbsp;</span>
                  <button
                    @click="goToPayBySupplierId(item.supplier_id)"
                    title="Tạo phiếu chi"
                    class="ml-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Thanh toán
                  </button>
                </td>
                <td class="border border-gray-300 px-4 py-2">{{ item.supplier_name }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{ item.public_debt_date_number }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">{{ currencyFormat(item.total) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">{{ currencyFormat(item.amount_remaining) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{ item.input_repo_date }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.status_str }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{ item.payment_date }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.invoice_note }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  <button
                    @click="goToIncome(item.id)"
                    title="Xoá nợ"
                    class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Xoá nợ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="flex justify-center my-4">
          <icon name="loading" width="60" />
        </div>
        <div v-if="hasNext === false" class="text-center my-4">--Hết--</div>
        <div v-if="hasNext === true && totalRow != 0" class="text-center my-4">
          <i class="fa fa-angle-double-down text-2xl"></i>
        </div>
      </div>
    </div>

    <!-- Cấn Trừ Công Nợ Modal -->
    <div v-if="showOverPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-11/12 max-w-6xl max-h-screen overflow-y-auto">
        <div class="p-6">
          <h4 class="text-2xl font-bold text-center text-orange-600 mb-4">Cấn Trừ Công Nợ</h4>
          <hr class="mb-4" />

          <div class="mb-4">
            <p>Nhà cung cấp: <b>{{ supplierSelect.name }}</b></p>
            <p>Tổng tiền trả dư: <b>{{ currencyFormat(sum_total_over_payment) }}</b></p>
          </div>

          <div class="overflow-x-auto mb-4">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-center">STT</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Số ĐH mua</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Số ngày công nợ</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Tổng giá trị ĐH (gồm VAT)</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Số tiền còn nợ</th>
                  <th class="border border-gray-300 px-4 py-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2 text-center">{{ index + 1 }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.order_buy_number }}</td>
                  <td class="border border-gray-300 px-4 py-2 text-center">{{ item.public_debt_date_number }}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{ currencyFormat(item.total) }}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{ currencyFormat(item.amount_remaining) }}</td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      v-model="payForDebts"
                      :value="item.id"
                      class="w-4 h-4"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-center space-x-4">
            <button
              @click="hideModalOverPayment"
              class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Đóng
            </button>
            <button
              v-show="!payingOverPayment"
              @click="payOverPayment"
              :disabled="payForDebts.length == 0"
              title="Cấn trừ công nợ"
              class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import publicDebtApi from '@/api/publicDebt'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { popToast } = useToast()

// Data
const loadingOptions = ref(false)
const supplierSelect = ref({})
const supplierOptions = ref([])

const payStatus = ref([
  { value: null, text: '' },
  { value: '1', text: 'Nợ quá hạn' },
  { value: '2', text: 'Nợ chưa đến hạn' }
])

const shippingStatus = ref([
  { value: null, text: '' },
  { value: '1', text: 'Đã nhập đủ kho' },
  { value: '2', text: 'Đã nhập kho 1 phần' },
  { value: '0', text: 'Đã đặt chưa giao' }
])

const inputs = reactive({
  supplier_id: null,
  pay_status: null,
  shipping_status: null,
  invoice_note: null
})

const items = ref([])
const excel_fields = {
  'Số ĐH bán': 'order_buy_number',
  'Tên NCC': 'supplier_name',
  'Số ngày công nợ': 'public_debt_date_number',
  'Tổng tiền (gồm VAT)': 'total',
  'Số tiền còn phải TT': 'amount_remaining',
  'Ngày nhập kho': 'input_repo_date',
  'Tình trạng hàng': 'status_str',
  'Ngày thanh toán': 'payment_date',
  'Số HĐ VAT vào': 'invoice_note'
}
const excel_items = ref([])

const sum_total = ref(0)
const sum_total_not_out_of_date = ref(0)
const sum_total_out_of_date = ref(0)
const sum_total_feature = ref(0)
const sum_total_over_payment = ref(0)

const pageLimit = Constant.PAGE_LIMIT
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const loading = ref(false)
const loadByScroll = ref(false)
const totalRow = ref(0)
const currentSupplier = ref(null)
const isGetExcelItems = ref(false)

const showOverPaymentModal = ref(false)
const payingOverPayment = ref(false)
const payForDebts = ref([])

// Methods
const currencyFormat = (num) => {
  if (num == null || num == undefined) {
    return ''
  }
  let result = ''
  if (num == 0) {
    return '0'
  }
  num = (num + '').replaceAll(',', '')
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return result
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false

  search()
}

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
      offset.value = offset.value + pageLimit
      loadByScroll.value = true
      search()
    }
  }
}

const getOptions = async () => {
  loadingOptions.value = true
  try {
    const res = await publicDebtApi.getOptionsRelatedPublicDebt({})
    if (res?.data?.data) {
      // Supplier
      supplierOptions.value = res.data.data.suppliers
      const itemEmpty = { id: null, name: null, address: null }
      supplierOptions.value.unshift(itemEmpty)
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  } finally {
    loadingOptions.value = false
  }
}

const goToPay = () => {
  router.push('/public-debt/pay')
}

const goToPayBySupplierId = (supplier_id) => {
  router.push({ name: 'Thanh toán nợ phải trả', params: { id: supplier_id } })
}

const goToIncome = (id) => {
  window.open('/income-from-order-buy/' + id + '?isDebtRelief=1', '_blank')
}

const search = async () => {
  if (onSearch.value) {
    return
  }
  loading.value = true
  onSearch.value = true

  // Define params
  const params = {
    supplier_id: supplierSelect.value.supplier_id ? supplierSelect.value.supplier_id : null,
    pay_status: inputs.pay_status,
    shipping_status: inputs.shipping_status,
    invoice_note: inputs.invoice_note,
    limit: pageLimit,
    offset: offset.value
  }
  currentSupplier.value = JSON.parse(JSON.stringify(params.supplier_id))

  try {
    const res = await publicDebtApi.searchPublicDebit(params)
    if (res?.data?.data) {
      const it = res.data.data

      // Update items
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
        if (parseInt(offset.value) + parseInt(pageLimit) >= parseInt(totalRow.value)) {
          hasNext.value = false
        }
      }
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  } finally {
    loading.value = false
    onSearch.value = false
  }
}

const getExcelItem = async (params) => {
  if (isGetExcelItems.value) {
    return
  }

  excel_items.value = []

  // Define params
  params.limit = 999999

  try {
    const res = await publicDebtApi.searchPublicDebit(params)
    if (res?.data?.data) {
      const datas = res.data.data
      excel_items.value = datas

      // Check has next
      totalRow.value = res.data.data.length
      if (parseInt(offset.value) + parseInt(pageLimit) >= parseInt(totalRow.value)) {
        hasNext.value = false
      }

      // Calculate sum
      sum_total.value = 0
      sum_total_not_out_of_date.value = 0
      sum_total_out_of_date.value = 0
      sum_total_feature.value = 0
      sum_total_over_payment.value = 0
      const list_checked = []

      for (const data of datas) {
        if (data.status > 0) {
          sum_total.value += data.amount_remaining
          if (data.total_over_payment && !list_checked.includes(data.supplier_id)) {
            sum_total_over_payment.value += data.total_over_payment
            list_checked.push(data.supplier_id)
          }
          if (data.payment_date) {
            if (new Date(data.payment_date) < new Date()) {
              sum_total_out_of_date.value += data.amount_remaining
            } else {
              sum_total_not_out_of_date.value += data.amount_remaining
            }
          }
        } else {
          sum_total_feature.value += data.amount_remaining
        }
      }

      isGetExcelItems.value = true
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  }
}

const showModalOverPayment = () => {
  if (!currentSupplier.value) {
    popToast('danger', 'Vui lòng chọn [Nhà cung cấp] cụ thể sau đó click "Tìm kiếm" để sử dụng chức năng "Cấn trừ công nợ"')
    return
  }
  if (currentSupplier.value != supplierSelect.value.supplier_id) {
    popToast('danger', 'Vui lòng chọn [Nhà cung cấp] cụ thể sau đó click "Tìm kiếm" để sử dụng chức năng "Cấn trừ công nợ"')
    return
  }
  if (sum_total_over_payment.value == 0) {
    popToast('danger', 'Không có dư nợ để cấn trừ')
    return
  }
  showOverPaymentModal.value = true
}

const hideModalOverPayment = () => {
  showOverPaymentModal.value = false
}

const payOverPayment = async () => {
  if (payForDebts.value.length == 0) {
    popToast('danger', 'Vui lòng lựa chọn đơn hàng bạn muốn cấn trừ')
    return
  }

  payingOverPayment.value = true
  const debts = []
  for (const item of items.value) {
    if (payForDebts.value.includes(item.id)) {
      const debt = {
        order_buy_id: item.id,
        supplier_id: item.supplier_id,
        debt_total_remaining: item.amount_remaining
      }
      debts.push(debt)
    }
  }
  const params = {
    debts: debts,
    sum_total_over_payment: sum_total_over_payment.value
  }

  try {
    const res = await publicDebtApi.payOverPayment(params)
    if (res?.data?.status == 200) {
      isGetExcelItems.value = false
      hideModalOverPayment()
      search()
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  } finally {
    payingOverPayment.value = false
  }
}

// Mounted
onMounted(() => {
  window.addEventListener('scroll', onScroll)

  getOptions()

  // Load list when load page
  prepareToSearch()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
