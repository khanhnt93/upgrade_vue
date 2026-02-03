<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="mb-6">
          <button
            @click="back"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-32"
          >
            Quay lại
          </button>
        </div>

        <h4 class="text-2xl font-bold text-center text-orange-600 mb-4">Thanh Toán Nợ Phải Thu</h4>
        <hr class="mb-6" />

        <!-- Customer Selection -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2 font-semibold">Khách hàng<span class="text-red-500"></span></label>
          </div>
          <div class="w-3/4">
            <multiselect
              v-model="customerSelect"
              :options="customerOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn khách hàng--"
              label="text"
              track-by="text"
              @input="changeCustomer"
            >
            </multiselect>
          </div>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="flex justify-center my-4">
          <icon name="loading" width="60" />
        </div>

        <!-- Order Information Section -->
        <div v-show="customerSelect.value" class="mb-6">
          <div class="bg-blue-500 text-white p-3 rounded-t-lg">
            <h5 class="text-lg font-semibold">Thông tin đơn hàng</h5>
          </div>

          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-center">STT</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Số ĐH bán</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Tên K.H</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Số tiền còn nợ</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Số tiền thanh toán</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in debtList" :key="index" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2 text-center">{{ index + 1 }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.order_sell_number }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.customer_name }}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{ currencyFormat(item.total_remaining) }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input
                      :id="'total_' + index"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      :value="item.total"
                      @keyup="integerPointAndCommaOnly($event.target)"
                      @change="changeTotal(index)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payment Information Section -->
        <div v-show="customerSelect.value" class="mb-6">
          <div class="bg-green-500 text-white p-3 rounded-t-lg">
            <h5 class="text-lg font-semibold">Thông tin thanh toán</h5>
          </div>

          <!-- Date Input -->
          <div class="flex mt-4 mb-6">
            <div class="w-1/4">
              <label class="block mt-2">Ngày ghi nhận tiền<span class="text-red-500"></span></label>
            </div>
            <div class="w-3/4">
              <datepicker
                v-model="debt.date_input"
                format="yyyy-MM-dd"
                placeholder="yyyy-MM-dd"
                input-class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Amount Pay -->
          <div class="flex mb-6">
            <div class="w-1/4">
              <label class="block mt-2">Số tiền thanh toán<span class="text-red-500"></span></label>
            </div>
            <div class="w-3/4">
              <input
                id="amount_pay"
                type="text"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                v-model="debt.amount_pay"
                autocomplete="new-password"
                maxlength="14"
                @keyup="integerPointAndCommaOnly($event.target)"
                @change="changeAmountPay"
              />
            </div>
          </div>

          <!-- Bank Account -->
          <div class="flex mb-6">
            <div class="w-1/4">
              <label class="block mt-2">Thanh toán vào</label>
            </div>
            <div class="w-3/4">
              <select
                id="bank_account"
                v-model="debt.bank_account_id"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option
                  v-for="option in bankAccountOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <!-- Remaining Amount -->
          <div class="flex mb-6">
            <div class="w-1/4">
              <p class="mt-2">Số tiền còn lại</p>
            </div>
            <div class="w-3/4">
              <p class="mt-2"><b class="text-blue-600 text-lg">{{ currencyFormat(debt.remaining) }}đ</b></p>
            </div>
          </div>

          <!-- Note -->
          <div class="flex mb-6">
            <div class="w-1/4">
              <label class="block mt-2">Ghi chú</label>
            </div>
            <div class="w-3/4">
              <textarea
                id="note"
                v-model="debt.note"
                rows="3"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center">
            <button
              v-show="!saving"
              @click="confirmPayment"
              :disabled="saving || debt.amount_pay <= 0"
              class="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fa fa-pencil-square-o mr-2" />
              Xác Nhận
            </button>
            <span v-show="saving" class="text-blue-500">
              <icon name="loading" width="60" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import debtApi from '@/api/debt'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { popToast } = useToast()

// Data
const loadingOptions = ref(false)
const customerSelect = ref({})
const customerOptions = ref([])
const bankAccountOptions = ref([])

const debt = reactive({
  customer_id: null,
  date_input: null,
  amount_pay: 0,
  bank_account_id: -1,
  remaining: 0,
  note: null
})

const debtList = ref([])
const sum_remaining = ref(0)
const saving = ref(false)
const loading = ref(false)

// Methods
const formatDateLocal = (date) => {
  if (!date) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getOptions = async () => {
  loadingOptions.value = true
  try {
    const res = await debtApi.getOptionsRelatedDebt({ 'customer-all': true }, 'admin')
    if (res?.data?.data) {
      // Customer
      customerOptions.value = res.data.data.customers
      const itemEmpty = { value: null, text: null }
      customerOptions.value.unshift(itemEmpty)

      const customer_id = route.params.id
      if (customer_id) {
        for (const customer of customerOptions.value) {
          if (customer.value == customer_id) {
            customerSelect.value = customer
            break
          }
        }
        debt.customer_id = customer_id
        // Get lại danh sách các khoản vay
        getListDebtByCustomer()
      }

      bankAccountOptions.value = res.data.data.bank_accounts
      bankAccountOptions.value.unshift({ value: -1, text: 'Tiền mặt' })
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  } finally {
    loadingOptions.value = false
  }
}

const changeCustomer = () => {
  if (customerSelect.value.value) {
    debt.customer_id = customerSelect.value.value
    // Get lại danh sách các khoản vay
    getListDebtByCustomer()
  } else {
    debt.customer_id = null
  }
}

const confirmPayment = async () => {
  // Format data
  debt.amount_pay = (debt.amount_pay + '').replaceAll(',', '')
  if (parseInt(debt.amount_pay) <= 0) {
    popToast('danger', 'Số tiền trả phải lớn hơn 0')
    return
  }

  const debt_list = []
  for (const item of debtList.value) {
    item.total = (item.total + '').replaceAll(',', '')
    if (parseInt(item.total) > 0) {
      debt_list.push(item)
    }
  }

  saving.value = true
  try {
    debt.debt_list = debt_list
    const res = await debtApi.payDebtFast(debt)
    if (res?.data) {
      popToast('success', 'Thanh toán thành công')

      // Show modal báo, reset data
      customerSelect.value = {}
      debtList.value = []
      debt.customer_id = null
      debt.amount_pay = 0
      debt.bank_account_id = -1
      debt.remaining = 0
      debt.note = null

      const dateNow = new Date()
      debt.date_input = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  } finally {
    saving.value = false
  }
}

const changeAmountPay = () => {
  const amount_pay_value = parseInt((debt.amount_pay + '').replaceAll(',', ''))
  let amount_pay_remaining = parseInt(JSON.parse(JSON.stringify(amount_pay_value)))

  for (const item of debtList.value) {
    if (amount_pay_remaining <= 0) {
      item.total = 0
    } else {
      if (amount_pay_remaining > parseInt(item.total_remaining)) {
        item.total = currencyFormat(JSON.parse(JSON.stringify(item.total_remaining)))
        amount_pay_remaining = amount_pay_remaining - parseInt(item.total_remaining)
      } else {
        item.total = currencyFormat(amount_pay_remaining)
        amount_pay_remaining = 0
      }
    }
  }

  // Tính toán số tiền còn lại
  if (sum_remaining.value >= amount_pay_value) {
    debt.remaining = currencyFormat(parseInt(sum_remaining.value) - amount_pay_value)
  } else {
    debt.remaining = 0
  }

  debt.amount_pay = currencyFormat(amount_pay_value)
}

const getListDebtByCustomer = async () => {
  if (!debt.customer_id) return
  if (loading.value) return

  loading.value = true
  try {
    const res = await debtApi.getDebtByCustomer(debt.customer_id)
    if (res?.data?.data) {
      debtList.value = res.data.data.debts
      sum_remaining.value = res.data.data.sum_remaining
      debt.remaining = 0
      debt.amount_pay = currencyFormat(res.data.data.sum_total)
    } else {
      debtList.value = []
      sum_remaining.value = 0
      debt.remaining = 0
      debt.amount_pay = 0
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  } finally {
    loading.value = false
  }
}

const changeTotal = (index) => {
  let amount_pay = 0
  for (const item_index in debtList.value) {
    let item_total = document.getElementById('total_' + item_index).value
    item_total = (item_total + '').replaceAll(',', '')
    amount_pay += parseInt(item_total)
  }
  debt.remaining = parseInt(sum_remaining.value) - amount_pay
  debt.amount_pay = currencyFormat(amount_pay)

  let total = document.getElementById('total_' + index).value
  total = (total + '').replaceAll(',', '')
  total = currencyFormat(total)
  document.getElementById('total_' + index).value = total
  debtList.value[index].total = total
}

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
    result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return result
}

const integerPointAndCommaOnly = (item) => {
  let valueInput = item.value
  valueInput = valueInput.replaceAll(',', '')
  const result = commonFunc.integerPointAndCommaOnly(valueInput)
  item.value = currencyFormat(result)
}

const back = () => {
  router.push('/debt')
}

// Mounted
onMounted(() => {
  const dateNow = new Date()
  debt.date_input = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())

  // Get list customer option
  getOptions()
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

