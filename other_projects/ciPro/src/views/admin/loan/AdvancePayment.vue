<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <h4 class="text-2xl font-bold text-center text-orange-600 mb-4">Thanh Toán Khoản Tạm Ứng</h4>
        <hr class="mb-6" />

        <!-- Advance Information -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2 font-semibold">Khoản tạm ứng</label>
          </div>
          <div class="w-3/4">
            <p class="mb-1">Nhân viên: {{ loan.staff_name + ' - ' + loan.staff_phone }}</p>
            <p class="mb-1">Ngày mượn: {{ loan.borrowed_date }}</p>
            <p class="mb-1">Ngày hẹn trả: {{ loan.due_date }}</p>
            <p class="mb-1">Số tiền vay: {{ currencyFormat(loan.amount) }}</p>
            <p class="mb-1 font-bold text-red-600">Còn lại: {{ currencyFormat(loan.remaining) }}</p>
          </div>
        </div>

        <!-- Date Input -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Ngày tạo<span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4">
            <datepicker
              v-model="inputs.date_input"
              format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
              input-class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              @input="changeDateInput"
            />
          </div>
        </div>

        <!-- Accounting Date -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Ngày hoạch toán<span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4">
            <datepicker
              v-model="inputs.accounting_date"
              format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
              input-class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Amount -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Số tiền<span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4">
            <input
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              v-model="inputs.amount"
              @keyup="integerPointAndCommaOnly($event.target)"
              @change="changeAmount"
              maxlength="14"
              placeholder="Nhập số tiền"
            >
          </div>
        </div>

        <!-- Money Type & Bank Account -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Sổ khoản chi<span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4">
            <div class="flex space-x-4 mb-2">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="inputs.money_type"
                  name="money_type"
                  :value="1"
                  class="form-radio text-blue-600"
                >
                <span class="ml-2">Chuyển khoản</span>
              </label>
              <label class="inline-flex items-center ml-4">
                <input
                  type="radio"
                  v-model="inputs.money_type"
                  name="money_type"
                  :value="0"
                  class="form-radio text-blue-600"
                >
                <span class="ml-2">Tiền mặt</span>
              </label>
            </div>
            <select
              v-show="inputs.money_type == 1"
              v-model="inputs.bank_account_id"
              :disabled="inputs.money_type == 0"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option :value="null">--Chọn sổ khoản chi--</option>
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

        <!-- Expense Group -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Nhóm khoản chi<span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4">
            <select
              v-model="inputs.expend_income_group_id"
              @change="changeExpendGroup"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option :value="null">--Chọn nhóm khoản chi--</option>
              <option
                v-for="option in expendGroupOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <!-- Expense Type -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Loại khoản chi<span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4">
            <select
              v-model="inputs.expend_income_type_id"
              :disabled="!inputs.expend_income_group_id"
              @change="updateDescription"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option :value="null">--Chọn loại khoản chi--</option>
              <option
                v-for="option in expendTypeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Diễn giải nội dung</label>
          </div>
          <div class="w-3/4">
            <textarea
              rows="2"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              v-model="inputs.description"
              placeholder="Nhập diễn giải nội dung"
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-4">
          <button
            @click="back"
            class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-32"
          >
            Huỷ
          </button>

          <button
            v-show="!saving"
            @click="save"
            :disabled="saving"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-32"
          >
            Xác nhận
          </button>
          <span v-show="saving" class="text-blue-500">
            <icon name="loading" width="60" />
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import loanApi from '@/api/loan'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { popToast } = useToast()

// Data
const loan = reactive({
  id: null,
  staff_id: null,
  staff_name: null,
  staff_phone: null,
  borrowed_date: null,
  due_date: null,
  amount: 0,
  remaining: 0
})

const inputs = reactive({
  loan_id: null,
  type: 0,
  sub_type: 0,
  date_input: null,
  accounting_date: null,
  object_other_name: null,
  amount: 0,
  money_type: 1,
  bank_account_id: null,
  expend_income_group_id: null,
  expend_income_type_id: null,
  description: null
})

const loadingOptions = ref(false)
const bankAccountOptions = ref([])
const expendGroupOptions = ref([])
const expendTypeOptions = ref([])
const expendTypeOptionStore = ref([])
const saving = ref(false)

// Methods
const formatDateLocal = (date) => {
  if (!date) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const prepareDateInput = () => {
  const dateNow = new Date()
  inputs.date_input = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
  inputs.accounting_date = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
}

const getLoanDetail = async () => {
  const loanId = route.params.id
  if (loanId) {
    await loanApi.getAdvanceDetail(loanId)
      .then((result) => {
        if (result?.data?.data) {
          Object.assign(loan, result.data.data)
          const loanTemp = JSON.parse(JSON.stringify(loan))
          inputs.amount = currencyFormat(loanTemp.remaining)
          inputs.object_other_name = loanTemp.staff_name + " - " + loanTemp.staff_phone
          updateDescription()
        }
      })
      .catch((error) => {
        popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
      })
  }
}

const getOptionRelated = async () => {
  loadingOptions.value = true

  const params = {
    bank_accounts: true,
    expend_income_groups: true,
    expend_income_types: true,
    type: 2
  }

  await loanApi.getOptionsRelated(params)
    .then((result) => {
      if (result?.data?.data) {
        const options = result.data.data

        // Set bank accounts
        if (options.bank_accounts) {
          bankAccountOptions.value = options.bank_accounts
        }

        // Set expend groups
        if (options.expend_income_groups) {
          expendGroupOptions.value = []
          for (const item of options.expend_income_groups) {
            expendGroupOptions.value.push({ value: item.id, text: item.name })
          }

          // Set default expend group
          const expend_group_code = 'tam_ung'
          for (const item of options.expend_income_groups) {
            if (item.code == expend_group_code) {
              inputs.expend_income_group_id = item.id
              changeExpendGroup()
              break
            }
          }
        }

        // Set expend types
        if (options.expend_income_types) {
          expendTypeOptions.value = []
          for (const item of options.expend_income_types) {
            expendTypeOptions.value.push({ value: item.id, text: item.name })
          }
          expendTypeOptionStore.value = JSON.parse(JSON.stringify(options.expend_income_types))
        }
      }
      loadingOptions.value = false
    })
    .catch((error) => {
      popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
      loadingOptions.value = false
    })
}

const updateDescription = () => {
  try {
    let description_str = ""

    if (inputs.expend_income_type_id && expendTypeOptions.value.length > 0) {
      description_str = commonFunc.getTextByValueOfSelectedBox(expendTypeOptions.value, inputs.expend_income_type_id)
    }

    if (!description_str) {
      description_str = "Thu hoàn tạm ứng"
    }

    description_str += ": " + loan.staff_name + ' - ' + loan.staff_phone

    inputs.description = description_str
  } catch (err) {
    console.log(err)
  }
}

const save = async () => {
  // Check validate
  if (inputs.money_type == 0 || inputs.money_type == 2) {
    inputs.bank_account_id = -1
  } else {
    if (!inputs.bank_account_id) {
      popToast('Lỗi', '[Sổ khoản chi] là mục bắt buộc nhập', 'error')
      return
    }
  }

  if (!inputs.expend_income_group_id) {
    popToast('Lỗi', '[Nhóm khoản chi] là mục bắt buộc nhập', 'error')
    return
  }

  if (!inputs.expend_income_type_id) {
    popToast('Lỗi', '[Loại Khoản chi] là mục bắt buộc nhập', 'error')
    return
  }

  let amount = (inputs.amount + "").replace(/,/g, '')
  if (amount == "") {
    popToast('Lỗi', 'Vui lòng nhập [Số tiền*]', 'error')
    return
  }

  amount = parseInt(amount)
  if (amount < 0) {
    popToast('Lỗi', 'Không thể nhập [Số tiền*] âm', 'error')
    return
  }

  // Prepare data
  const data = { ...inputs }
  data.amount = amount
  data.loan_id = loan.id
  data.object_other_name = loan.staff_name + ' - ' + loan.staff_phone
  data.date_input = formatDateLocal(data.date_input)
  data.accounting_date = formatDateLocal(data.accounting_date)

  // Add payment
  saving.value = true
  await loanApi.addAdvancePayment(data)
    .then(() => {
      popToast('Thành công', 'Thanh toán tạm ứng thành công', 'success')
      router.push('/advance')
    })
    .catch((error) => {
      popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
      saving.value = false
    })
}

const integerPointAndCommaOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.integerPointAndCommaOnly(valueInput)
  item.value = result
}

const changeAmount = () => {
  const amount = (inputs.amount + '').replace(/,/g, '')
  inputs.amount = currencyFormat(amount)
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

const back = () => {
  router.push('/advance')
}

const changeExpendGroup = () => {
  if (inputs.expend_income_group_id) {
    expendTypeOptions.value = [{ value: null, text: '' }]
    for (const item of expendTypeOptionStore.value) {
      if (item.group_id == inputs.expend_income_group_id) {
        const typeItem = { value: item.id, text: item.name }
        expendTypeOptions.value.push(typeItem)

        if (item.name == 'Thu hoàn tạm ứng') {
          inputs.expend_income_type_id = item.id
          updateDescription()
        }
      }
    }
  } else {
    expendTypeOptions.value = []
  }
}

const changeDateInput = () => {
  const dateNow = new Date()
  const today = formatDateLocal(new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()))
  const date_input_str = formatDateLocal(inputs.date_input)
  const accounting_date_str = formatDateLocal(inputs.accounting_date)

  if (date_input_str != today && accounting_date_str == today) {
    inputs.accounting_date = new Date(inputs.date_input.getTime())
  }
}

// Mounted
onMounted(async () => {
  prepareDateInput()
  await getOptionRelated()
  await getLoanDetail()
})
</script>
