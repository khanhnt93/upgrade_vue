<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- Title -->
      <h4 class="text-2xl font-semibold text-center text-orange-600 mb-4">{{title_prefix}} Khoản Cho Vay</h4>
      <hr class="mb-6">

      <!-- Customer Type Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Khách hàng<span class="text-red-600">*</span></label>
        <div class="flex items-center gap-6 mb-3">
          <label class="flex items-center cursor-pointer">
            <input type="radio" v-model="inputs.customer_type" :value="0" class="mr-2">
            <span>Cũ</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input type="radio" v-model="inputs.customer_type" :value="1" class="mr-2">
            <span>Mới</span>
          </label>
        </div>

        <!-- Existing Customer -->
        <div v-show="inputs.customer_type == 0">
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
          <p v-if="errorCustomerOld" class="text-red-600 text-sm mt-1">Vui lòng chọn khách hàng</p>
        </div>

        <!-- New Customer -->
        <div v-show="inputs.customer_type == 1" class="space-y-3">
          <div>
            <input
              v-model="inputs.customer_name"
              type="text"
              maxlength="255"
              placeholder="Tên khách hàng"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errorCustomerName}"
            >
            <p v-if="errorCustomerName" class="text-red-600 text-sm mt-1">Vui lòng nhập tên khách hàng</p>
          </div>
          <div>
            <input
              v-model="inputs.customer_phone"
              type="text"
              maxlength="12"
              placeholder="Số điện thoại khách hàng"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errorCustomerPhone}"
            >
            <p v-if="errorCustomerPhone" class="text-red-600 text-sm mt-1">Vui lòng nhập số điện thoại khách hàng</p>
          </div>
        </div>
      </div>

      <!-- Borrowed Date -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Ngày mượn<span class="text-red-600">*</span></label>
        <datepicker
          v-model="inputs.borrowed_date"
          format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
        />
        <p v-if="errorBorrowedDate" class="text-red-600 text-sm mt-1">Vui lòng chọn ngày mượn</p>
      </div>

      <!-- Due Date -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn trả<span class="text-red-600">*</span></label>
        <datepicker
          v-model="inputs.due_date"
          format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
        />
        <p v-if="errorDueDate" class="text-red-600 text-sm mt-1">Vui lòng chọn ngày hẹn trả</p>
      </div>

      <!-- Amount -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Số tiền<span class="text-red-600">*</span></label>
        <input
          v-model="inputs.amount"
          type="text"
          maxlength="14"
          @keyup="integerPointAndCommaOnly($event.target)"
          @change="changeAmount()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{'border-red-500': errorAmount}"
        >
        <p v-if="errorAmount" class="text-red-600 text-sm mt-1">Vui lòng nhập số tiền</p>
      </div>

      <!-- Money Type and Bank Account -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Sổ khoản chi<span class="text-red-600">*</span></label>
        <div class="flex items-center gap-6 mb-3">
          <label class="flex items-center cursor-pointer">
            <input type="radio" v-model="inputs.money_type" :value="1" class="mr-2">
            <span>Chuyển khoản</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input type="radio" v-model="inputs.money_type" :value="0" class="mr-2">
            <span>Tiền mặt</span>
          </label>
        </div>
        <select
          v-show="inputs.money_type == 1"
          v-model="inputs.bank_account_id"
          :disabled="inputs.money_type == 0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="option in bankAccountOptions" :key="option.value" :value="option.value">{{option.text}}</option>
        </select>
      </div>

      <!-- Interest Rate -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Lãi suất (%)<span class="text-red-600">*</span></label>
        <input
          v-model="inputs.interest_rate"
          type="text"
          maxlength="5"
          @keyup="integerPointAndCommaOnly($event.target)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <!-- Interest Period -->
      <div v-show="inputs.interest_rate" class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Kỳ hạn lãi<span class="text-red-600">*</span></label>
        <select
          v-model="inputs.interest_period"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{'border-red-500': errorInterestPeriod}"
        >
          <option v-for="option in periodOptions" :key="option.value" :value="option.value">{{option.text}}</option>
        </select>
        <p v-if="errorInterestPeriod" class="text-red-600 text-sm mt-1">Vui lòng chọn kỳ hạn lãi</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center mb-4">
        <button
          @click="save(true)"
          class="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[200px]"
        >
          Lưu nháp
        </button>
      </div>

      <div class="flex justify-between items-center">
        <button
          @click="back"
          class="px-6 py-2 bg-white text-gray-600 border border-gray-600 rounded hover:bg-gray-50 transition-colors min-w-[120px]"
        >
          Huỷ
        </button>
        <button
          v-show="!saving"
          @click="save(false)"
          :disabled="saving"
          class="px-6 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors min-w-[120px] disabled:opacity-50"
        >
          Xác nhận
        </button>
        <div v-show="saving" class="flex justify-center">
          <icon name="loading" width="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import loanApi from '@/api/loan'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vue3-datepicker'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

// Data
const title_prefix = ref('Thêm Mới')
const inputs = reactive({
  id: null,
  customer_type: 0,
  customer_id: null,
  customer_name: null,
  customer_phone: null,
  borrowed_date: new Date(),
  due_date: new Date(),
  amount: 0,
  money_type: 1,
  bank_account_id: null,
  interest_rate: 0,
  interest_period: 'month'
})
const periodOptions = ref([
  {value: 'day', text: 'Ngày'},
  {value: 'month', text: 'Tháng'},
  {value: 'year', text: 'Năm'}
])
const bankAccountOptions = ref([])
const loadingOptions = ref(false)
const customerSelect = ref({})
const customerOptions = ref([])
const saving = ref(false)
const click = ref(false)

// Computed
const errorCustomerOld = computed(() => {
  return click.value && inputs.customer_type == 0 && !customerSelect.value.value
})
const errorCustomerName = computed(() => {
  return click.value && inputs.customer_type == 1 && !inputs.customer_name
})
const errorCustomerPhone = computed(() => {
  return click.value && inputs.customer_type == 1 && !inputs.customer_phone
})
const errorBorrowedDate = computed(() => {
  return click.value && !inputs.borrowed_date
})
const errorDueDate = computed(() => {
  return click.value && !inputs.due_date
})
const errorAmount = computed(() => {
  return click.value && (!inputs.amount || inputs.amount.length <= 0)
})
const errorInterestPeriod = computed(() => {
  return click.value && inputs.interest_rate && !inputs.interest_period
})

// Lifecycle
onMounted(() => {
  let dateNow = new Date()
  inputs.borrowed_date = new Date(dateNow)
  let dueDate = new Date(dateNow.setMonth(dateNow.getMonth() + 3))
  inputs.due_date = new Date(dueDate)

  getOptionRelated()
  getLoanDetail()
})

// Methods
function checkValidate() {
  return !(errorCustomerOld.value || errorCustomerName.value || errorCustomerPhone.value
    || errorBorrowedDate.value || errorDueDate.value || errorAmount.value || errorInterestPeriod.value)
}

function getLoanDetail() {
  let loanId = route.params.id
  if (loanId) {
    title_prefix.value = 'Cập Nhật'
    loanApi.getLoanDetail(loanId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        Object.assign(inputs, res.data.data)
        inputs.customer_type = 0
        inputs.borrowed_date = new Date(inputs.borrowed_date)
        inputs.due_date = new Date(inputs.due_date)
        if (inputs.customer_id) {
          getCustomerById(inputs.customer_id)
        }
        inputs.amount = currencyFormat(inputs.amount)
      }
    }).catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    title_prefix.value = 'Thêm Mới'
  }
}

function getCustomerById(customerId) {
  for (let customer of customerOptions.value) {
    if (customer.value == customerId) {
      customerSelect.value = customer
      break
    }
  }
}

function getOptionRelated() {
  loadingOptions.value = true

  const params = {
    loan_type: 1,
    customers: true,
    bank_accounts: true
  }

  loanApi.getOptionsRelated(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const options = res.data.data

      customerOptions.value = options.customers
      if (inputs.customer_id) {
        getCustomerById(inputs.customer_id)
      }

      bankAccountOptions.value = options.bank_accounts
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

function save(is_draft) {
  click.value = true

  const checkValid = checkValidate()
  if (!checkValid) {
    return
  }

  if (inputs.customer_type == 0) {
    inputs.customer_id = customerSelect.value.value
    const name_phone = customerSelect.value.text
    const name_phones = name_phone.split(" - ")
    inputs.customer_name = name_phones[0]
    inputs.customer_phone = name_phones[1]
  }
  if (inputs.interest_rate == 0) {
    inputs.interest_period = null
  }

  inputs.amount = (inputs.amount + "").replaceAll(",", "")
  if (parseInt(inputs.amount) <= 0) {
    popToast('danger', 'Vui lòng nhập số tiền')
    return
  }

  inputs.is_draft = false
  if (is_draft) {
    inputs.is_draft = true
  } else {
    if (inputs.money_type == 1 && !inputs.bank_account_id) {
      popToast('danger', 'Vui lòng chọn sổ khoản chi')
      return
    }
  }

  // Format dates
  const submitData = {
    ...inputs,
    borrowed_date: formatDateLocal(inputs.borrowed_date),
    due_date: formatDateLocal(inputs.due_date)
  }

  saving.value = true
  if (inputs.id) {
    loanApi.updateLoanOut(submitData).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          router.push("/loan-in")
        }
      }
    }).catch(err => {
      saving.value = false
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    loanApi.addLoanOut(submitData).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          router.push("/loan-out")
        }
      }
    }).catch(err => {
      saving.value = false
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

function changeAmount() {
  const amount = (inputs.amount + "").replaceAll(",", "")
  inputs.amount = currencyFormat(amount)
}

function integerPointAndCommaOnly(item) {
  const valueInput = item.value
  const result = commonFunc.integerPointAndCommaOnly(valueInput)
  item.value = result
}

function back() {
  router.push("/loan-out")
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

<style scoped>
.error-sybol {
  color: red;
}
</style>
