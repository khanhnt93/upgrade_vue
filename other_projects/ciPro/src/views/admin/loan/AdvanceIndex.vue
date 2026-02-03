<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <h4 class="text-2xl font-bold text-center text-orange-600 mb-4">{{ title_prefix }} Tạm Ứng</h4>
        <hr class="mb-6" />

        <!-- Staff Selection -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Nhân viên<span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4">
            <multiselect
              v-model="staffSelect"
              :options="staffOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn nhân viên--"
              label="text"
              track-by="text"
            />
            <div v-if="errorStaff" class="text-red-600 text-sm mt-1">
              Vui lòng chọn nhân viên
            </div>
          </div>
        </div>

        <!-- Borrowed Date -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Ngày mượn<span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4">
            <datepicker
              v-model="inputs.borrowed_date"
              format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
              input-class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              :class="{ 'border-red-500': errorBorrowedDate }"
            />
            <div v-if="errorBorrowedDate" class="text-red-600 text-sm mt-1">
              Vui lòng chọn ngày mượn
            </div>
          </div>
        </div>

        <!-- Due Date -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Ngày hẹn trả<span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4">
            <datepicker
              v-model="inputs.due_date"
              format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
              input-class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              :class="{ 'border-red-500': errorDueDate }"
            />
            <div v-if="errorDueDate" class="text-red-600 text-sm mt-1">
              Vui lòng chọn ngày hẹn trả
            </div>
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
              :class="{ 'border-red-500': errorAmount }"
              v-model="inputs.amount"
              @keyup="integerPointAndCommaOnly($event.target)"
              @change="changeAmount()"
              maxlength="14"
              placeholder="Nhập số tiền"
            >
            <div v-if="errorAmount" class="text-red-600 text-sm mt-1">
              Vui lòng nhập số tiền
            </div>
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

        <!-- Advance Reason -->
        <div class="flex mb-6">
          <div class="w-1/4">
            <label class="block mt-2">Lý do tạm ứng</label>
          </div>
          <div class="w-3/4">
            <textarea
              rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              v-model="inputs.advance_reason"
              placeholder="Nhập lý do tạm ứng"
            ></textarea>
          </div>
        </div>

        <!-- Save Draft Button -->
        <div class="flex mb-4">
          <div class="w-full text-center">
            <button
              @click="save(true)"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-48"
            >
              Lưu nháp
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between">
          <button
            @click="back"
            class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-32"
          >
            Huỷ
          </button>

          <button
            v-show="!saving"
            @click="save(false)"
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import loanApi from '@/api/loan'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { popToast } = useToast()

// Data
const title_prefix = ref('Thêm Mới')
const inputs = reactive({
  id: null,
  staff_id: null,
  staff_name: null,
  staff_phone: null,
  borrowed_date: null,
  due_date: null,
  amount: 0,
  money_type: 1,
  bank_account_id: null,
  advance_reason: null
})

const bankAccountOptions = ref([])
const loadingOptions = ref(false)
const staffSelect = ref({})
const staffOptions = ref([])
const saving = ref(false)
const click = ref(false)

// Computed
const errorStaff = computed(() => {
  return click.value && !inputs.staff_id
})

const errorBorrowedDate = computed(() => {
  return click.value && !inputs.borrowed_date
})

const errorDueDate = computed(() => {
  return click.value && !inputs.due_date
})

const errorAmount = computed(() => {
  return click.value && (!inputs.amount || inputs.amount == 0)
})

// Methods
const prepareDateInput = () => {
  const dateNow = new Date()
  inputs.borrowed_date = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())

  const futureDate = new Date(dateNow)
  futureDate.setMonth(futureDate.getMonth() + 3)
  inputs.due_date = new Date(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate())
}

const getLoanDetail = async () => {
  const loanId = route.params.id
  if (loanId) {
    title_prefix.value = 'Cập Nhật'
    await loanApi.getAdvanceDetail(loanId)
      .then((result) => {
        if (result?.data?.data) {
          const data = result.data.data
          Object.assign(inputs, data)

          // Convert date strings to Date objects
          if (inputs.borrowed_date) {
            const borrowed = inputs.borrowed_date.split('-')
            inputs.borrowed_date = new Date(parseInt(borrowed[0]), parseInt(borrowed[1]) - 1, parseInt(borrowed[2]))
          }
          if (inputs.due_date) {
            const due = inputs.due_date.split('-')
            inputs.due_date = new Date(parseInt(due[0]), parseInt(due[1]) - 1, parseInt(due[2]))
          }

          // Format amount
          inputs.amount = currencyFormat(inputs.amount)

          // Set staff select
          if (inputs.staff_id) {
            const staff = staffOptions.value.find(s => s.value == inputs.staff_id)
            if (staff) {
              staffSelect.value = staff
            }
          }
        }
      })
      .catch((error) => {
        popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
      })
  } else {
    title_prefix.value = 'Thêm Mới'
  }
}

const getOptionRelated = async () => {
  loadingOptions.value = true

  const params = {
    loan_type: 1,
    staffs: true,
    bank_accounts: true
  }

  await loanApi.getOptionsRelated(params)
    .then((result) => {
      if (result?.data?.data) {
        const options = result.data.data

        // Set staff options
        if (options.staffs) {
          staffOptions.value = options.staffs
          // If editing, set the selected staff
          if (inputs.staff_id) {
            const staff = staffOptions.value.find(s => s.value == inputs.staff_id)
            if (staff) {
              staffSelect.value = staff
            }
          }
        }

        // Set bank account options
        if (options.bank_accounts) {
          bankAccountOptions.value = options.bank_accounts
        }
      }
      loadingOptions.value = false
    })
    .catch((error) => {
      popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
      loadingOptions.value = false
    })
}

const formatDateLocal = (date) => {
  if (!date) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const save = async (is_draft) => {
  click.value = true
  saving.value = true

  // Validate staff
  if (!inputs.staff_id) {
    saving.value = false
    return
  }

  // Validate other required fields
  if (!inputs.borrowed_date || !inputs.due_date || !inputs.amount) {
    saving.value = false
    return
  }

  // Validate bank account for non-draft bank transfers
  if (!is_draft && inputs.money_type == 1 && !inputs.bank_account_id) {
    popToast('Lỗi', 'Vui lòng chọn sổ khoản chi', 'error')
    saving.value = false
    return
  }

  // Prepare data
  const data = { ...inputs }

  // Set staff info from select
  if (staffSelect.value && staffSelect.value.text) {
    const name_phone = staffSelect.value.text
    const name_phones = name_phone.split(" - ")
    data.staff_name = name_phones[0]
    data.staff_phone = name_phones[1] || null
  }

  data.borrowed_date = formatDateLocal(data.borrowed_date)
  data.due_date = formatDateLocal(data.due_date)
  data.amount = parseFloat((data.amount + '').replace(/,/g, ''))

  if (data.amount <= 0) {
    popToast('Lỗi', 'Vui lòng nhập số tiền', 'error')
    saving.value = false
    return
  }

  data.is_draft = is_draft

  if (inputs.id) {
    // Update existing advance
    await loanApi.updateAdvance(data)
      .then(() => {
        popToast('Thành công', 'Cập nhật tạm ứng thành công', 'success')
        router.push('/advance')
      })
      .catch((error) => {
        popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
        saving.value = false
      })
  } else {
    // Create new advance
    await loanApi.addAdvance(data)
      .then(() => {
        popToast('Thành công', 'Thêm mới tạm ứng thành công', 'success')
        router.push('/advance')
      })
      .catch((error) => {
        popToast('Lỗi', commonFunc.getErrorMessage(error), 'error')
        saving.value = false
      })
  }
}

const changeAmount = () => {
  const amount = (inputs.amount + '').replace(/,/g, '')
  inputs.amount = currencyFormat(amount)
}

const integerPointAndCommaOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.integerPointAndCommaOnly(valueInput)
  item.value = result
}

const back = () => {
  router.push('/advance')
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

// Watch staff select
watch(staffSelect, (newVal) => {
  if (newVal && newVal.value) {
    inputs.staff_id = newVal.value
  } else {
    inputs.staff_id = null
  }
})

// Mounted
onMounted(async () => {
  prepareDateInput()
  await getOptionRelated()
  await getLoanDetail()
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
