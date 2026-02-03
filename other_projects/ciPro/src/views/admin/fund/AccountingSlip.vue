<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h4 class="text-xl font-semibold text-center text-orange-600">Thêm Mới Phiếu Kế Toán</h4>
      </div>
      <hr class="my-4">

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Ngày tạo<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <Datepicker v-model="inputs.date_input" input-class="datepicker-cus w-full" @input="changeDateInput" />
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Ngày hoạch toán<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <Datepicker v-model="inputs.accounting_date" input-class="datepicker-cus w-full" />
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Nhóm khoản thu<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <select v-model="inputs.expend_income_group_id"
                  @change="changeIncomeGroup"
                  class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in incomeGroupOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Loại khoản thu<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <select v-model="inputs.expend_income_type_id"
                  :disabled="!inputs.expend_income_group_id"
                  class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in incomeTypeOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Đối tượng thu</label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <div class="flex flex-wrap gap-4 mb-2">
            <div class="flex items-center">
              <input type="radio" v-model="inputs.object_type" :value="0" class="mr-2" id="object_type_0">
              <label class="cursor-pointer" for="object_type_0">Khách hàng</label>
            </div>
            <div class="flex items-center">
              <input type="radio" v-model="inputs.object_type" :value="1" class="mr-2" id="object_type_1">
              <label class="cursor-pointer" for="object_type_1">Nhà cung cấp</label>
            </div>
            <div class="flex items-center">
              <input type="radio" v-model="inputs.object_type" :value="2" class="mr-2" id="object_type_2">
              <label class="cursor-pointer" for="object_type_2">Nhân viên</label>
            </div>
            <div class="flex items-center">
              <input type="radio" v-model="inputs.object_type" :value="3" class="mr-2" id="object_type_3">
              <label class="cursor-pointer" for="object_type_3">Khác</label>
            </div>
          </div>
          <div>
            <Multiselect
              v-show="inputs.object_type==0"
              v-model="customerSelect"
              :options="customerOptions"
              :loading="loadingOptions"
              placeholder="--Chọn khách hàng--"
              label="text"
              track-by="text" />
            <Multiselect
              v-show="inputs.object_type==1"
              v-model="supplierSelect"
              :options="supplierOptions"
              :loading="loadingOptions"
              placeholder="--Chọn nhà cung cấp--"
              label="name"
              track-by="name" />
            <Multiselect
              v-show="inputs.object_type==2"
              v-model="staffSelect"
              :options="staffOptions"
              :loading="loadingOptions"
              placeholder="--Chọn nhân viên--"
              label="name"
              track-by="name" />
            <input
              v-show="inputs.object_type==3"
              v-model="inputs.object_other_name"
              type="text"
              maxlength="255"
              class="form-input w-full rounded-md border-gray-300">
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Số tiền<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <input type="text" v-model="inputs.amount"
                 @keyup="integerPointAndCommaOnly($event.target)"
                 @change="changeAmount"
                 class="form-input w-full rounded-md border-gray-300"
                 maxlength="14">
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Sổ khoản thu</label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <select v-model="inputs.income_bank_account_id" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in bankAccountOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Sổ khoản chi</label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <select v-model="inputs.expend_bank_account_id" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in bankAccountOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Diễn giải nội dung<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <textarea v-model="inputs.description"
                    rows="2"
                    class="form-textarea w-full rounded-md border-gray-300"></textarea>
        </div>
      </div>

      <div class="flex justify-between mt-4">
        <button class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" @click="back">
          Huỷ
        </button>
        <button v-show="!saving"
                class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                @click="save"
                :disabled="saving">
          Xác nhận
        </button>
        <div v-show="saving" class="inline-block">
          <icon name="loading" width="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'

const router = useRouter()
const { popToast } = useToast()

const inputs = ref({
  "type": 0,
  "object_type": null,
  "date_input": new Date(),
  "accounting_date": new Date(),
  "expend_income_group_id": null,
  "expend_income_type_id": null,
  "amount": 0,
  "income_bank_account_id": null,
  "expend_bank_account_id": null,
  "description": null
})
const loadingOptions = ref(false)
const customerSelect = ref({})
const customerOptions = ref([])
const supplierSelect = ref({})
const supplierOptions = ref([])
const staffSelect = ref({})
const staffOptions = ref([])
const bankAccountOptions = ref([])
const incomeGroupOptions = ref([])
const incomeTypeOptions = ref([])
const incomeTypeOptionStore = ref([])
const saving = ref(false)

const changeIncomeGroup = () => {
  if(inputs.value.expend_income_group_id) {
    incomeTypeOptions.value = [{"value": null, "text": ""}]
    for(let item of incomeTypeOptionStore.value) {
      if(item.type == 2 && item.group_id == inputs.value.expend_income_group_id) {
        let typeItem = {"value": item.id, "text": item.name}
        incomeTypeOptions.value.push(typeItem)
      }
    }
  } else {
    incomeTypeOptions.value = []
  }
}

const getOptionRelatedFund = () => {
  loadingOptions.value = true

  let params = {
    customers: true,
    suppliers: true,
    staffs: true,
    bank_accounts: true,
    type: 2,
    expend_income_groups: true,
    expend_income_types: true
  }

  fundApi.getOptionsRelatedFund(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let options = res.data.data

      customerOptions.value = options.customers
      supplierOptions.value = options.suppliers
      staffOptions.value = options.staffs

      let bankAccounts = options.bank_accounts
      bankAccountOptions.value = [{value: null, text: ''}, {value: -1, text: 'Tiền mặt'}]
      if(bankAccounts) {
        for (let item of bankAccounts) {
          bankAccountOptions.value.push(item)
        }
      }

      incomeGroupOptions.value = []
      let income_groups = options.expend_income_groups
      for(let item of income_groups) {
        let option = {"value": item.id, "text": item.name}
        incomeGroupOptions.value.push(option)
      }

      incomeTypeOptions.value = options.expend_income_types
      incomeTypeOptionStore.value = options.expend_income_types
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const save = () => {
  switch(inputs.value.object_type) {
    case 0:
      if(customerSelect.value && customerSelect.value.value) {
        inputs.value.customer_id = customerSelect.value.value
      } else {
        inputs.value.customer_id = null
      }
      inputs.value.supplier_id = null
      inputs.value.staff_id = null
      inputs.value.object_other_name = null
      break
    case 1:
      if(supplierSelect.value && supplierSelect.value.id) {
        inputs.value.supplier_id = supplierSelect.value.id
      } else {
        inputs.value.supplier_id = null
      }
      inputs.value.customer_id = null
      inputs.value.staff_id = null
      inputs.value.object_other_name = null
      break
    case 2:
      if(staffSelect.value && staffSelect.value.id) {
        inputs.value.staff_id = staffSelect.value.id
      } else {
        inputs.value.staff_id = null
      }
      inputs.value.customer_id = null
      inputs.value.supplier_id = null
      inputs.value.object_other_name = null
      break
    case 3:
      inputs.value.customer_id = null
      inputs.value.supplier_id = null
      inputs.value.staff_id = null
      break
    default:
      inputs.value.customer_id = null
      inputs.value.supplier_id = null
      inputs.value.staff_id = null
      inputs.value.object_other_name = null
  }

  let amount = (inputs.value.amount + "").replaceAll(",", "")
  if(amount == "") {
    popToast('danger', "Vui lòng nhập [Số tiền*]")
    return
  }
  amount = parseInt(amount)
  if(amount < 0) {
    popToast('danger', "Không thể nhập [Số tiền*] âm")
    return
  }
  inputs.value.amount = amount

  if(!inputs.value.income_bank_account_id && !inputs.value.expend_bank_account_id) {
    popToast('danger', "Vui lòng chọn [Sổ khoản thu] hoặc [Sổ khoản chi]")
    return
  }

  if(inputs.value.income_bank_account_id == inputs.value.expend_bank_account_id) {
    popToast('danger', "Vui lòng chọn [Sổ khoản thu] khác [Sổ khoản chi]")
    return
  }

  if(!inputs.value.expend_income_group_id) {
    popToast('danger', "[Nhóm phiếu] là mục bắt buộc nhập")
    return
  }
  if(!inputs.value.expend_income_type_id) {
    popToast('danger', "[Loại phiếu] là mục bắt buộc nhập")
    return
  }

  saving.value = true
  fundApi.addAccountingSlip(inputs.value).then(res => {
    saving.value = false
    if(res != null && res.data != null){
      if (res.data.status == 200) {
        router.push("/fund")
      }
    }
  }).catch(err => {
    saving.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const integerPointAndCommaOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.integerPointAndCommaOnly(valueInput)
  item.value = result
}

const back = () => {
  router.push("/fund")
}

const currencyFormat = (num) => {
  let result = ""
  if(num === 0) {
    return "0"
  }
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const changeAmount = () => {
  let amount = (inputs.value.amount + "").replaceAll(",", "")
  inputs.value.amount = currencyFormat(amount)
}

const changeDateInput = () => {
  let dateNow = new Date()
  let today = dateNow.toJSON().slice(0,10)
  if(inputs.value.date_input != today && inputs.value.accounting_date == today) {
    inputs.value.accounting_date = new Date(JSON.parse(JSON.stringify(inputs.value.date_input)))
  }
}

onMounted(() => {
  let dateNow = new Date()
  inputs.value.date_input = new Date(dateNow.toJSON().slice(0,10))
  inputs.value.accounting_date = new Date(dateNow.toJSON().slice(0,10))
  getOptionRelatedFund()
})
</script>

<style scoped>
.datepicker-cus {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
