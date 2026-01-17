<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6 mb-4">
      <div class="flex flex-wrap gap-2 justify-end mb-4">
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="goToAddAccountingSlip">
          Thêm PKT
        </button>
        <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" @click="goToAddExpend">
          Thêm khoản chi
        </button>
        <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" @click="goToAddIncome">
          Thêm khoản thu
        </button>
      </div>

      <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Báo Cáo Quỹ</h2>

      <div v-show="loading" class="flex justify-center my-4">
        <icon name="loading" width="60" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="font-medium">Tổng tiền có: <span :class="total_net_class" class="font-bold">{{currencyFormat(total_net)}}</span></label>
        </div>
        <div>
          <label class="font-medium">Tiền mặt: {{currencyFormat(cash)}}</label>
        </div>
        <div>
          <label class="font-medium">Nợ Phải Thu: {{currencyFormat(debt)}}</label>
        </div>
        <div>
          <label class="font-medium">Vay phải thu: {{currencyFormat(loan_receive)}}</label>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="font-medium">Tổng tiền hiện tại: <span :class="total_class" class="font-bold">{{currencyFormat(total)}}</span></label>
        </div>
        <div>
          <label class="font-medium">
            Tài khoản NH: {{currencyFormat(credit)}}
            <span class="ml-2 cursor-pointer"><i class="fa fa-info-circle" title="Chi tiết" @click="showModalListBankAccount"/></span>
          </label>
        </div>
        <div>
          <label class="font-medium">Nợ Phải Trả: {{currencyFormat(public_debt)}}</label>
        </div>
        <div>
          <label class="font-medium">Vay phải trả: {{currencyFormat(loan_pay)}}</label>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold text-center text-gray-700 mb-4">Danh sách khoản Thu Chi</h3>

      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <div>
          <label class="block mb-2 font-medium">Thời gian</label>
          <select v-model="time_option" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in timeOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 font-medium">{{time_option == 1 ? 'Từ ngày' : 'Năm'}}</label>
          <Datepicker v-show="time_option == 1" v-model="inputs.from_date" input-class="datepicker-cus w-full" />
          <select v-show="time_option != 1" v-model="year_input" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in yearOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>

        <div>
          <label v-show="time_option != 4" class="block mb-2 font-medium">
            {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý'}}
          </label>
          <Datepicker v-show="time_option == 1" v-model="inputs.to_date" input-class="datepicker-cus w-full" />
          <select v-show="time_option == 2" v-model="month_input" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in monthOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
          <select v-show="time_option == 3" v-model="quarter_input" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in quarterOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 font-medium">Số phiếu</label>
          <input type="text" v-model="inputs.fund_number" class="form-input w-full rounded-md border-gray-300" maxlength="20">
        </div>

        <div>
          <label class="block mb-2 font-medium">Diễn giải</label>
          <input type="text" v-model="inputs.description" class="form-input w-full rounded-md border-gray-300" maxlength="255">
        </div>

        <div>
          <label class="block mb-2 font-medium">Số tiền thu-chi</label>
          <input type="text" v-model="inputs.amount" class="form-input w-full rounded-md border-gray-300" maxlength="20">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block mb-2 font-medium">Loại sổ</label>
          <select v-model="inputs.bank_account" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in bankAccountOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 font-medium">Nhóm khoản thu-chi</label>
          <Multiselect
            :multiple="true"
            v-model="expendIncomeGroupSelect"
            :options="incomeExpendGroupOptions"
            placeholder="--Tất cả--"
            label="text"
            track-by="text"
            @input="changeGroup" />
        </div>

        <div>
          <label class="block mb-2 font-medium">Loại khoản thu-chi</label>
          <Multiselect
            :multiple="true"
            v-model="expendIncomeTypeSelect"
            :options="incomeExpendTypeOptions"
            placeholder="--Tất cả--"
            label="text"
            track-by="text" />
        </div>

        <div>
          <label class="block mb-2 font-medium">Ngày hoạch toán</label>
          <div class="flex gap-2">
            <Datepicker v-model="inputs.accounting_date" input-class="datepicker-cus flex-1" clearable />
            <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" @click="clearDate">X</button>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 float-right"
          :disabled="onSearch"
          @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="flex justify-between items-center mb-4 clear-both">
        <div>Số kết quả: <span class="font-bold text-gray-700">{{currencyFormat(totalRow)}}</span></div>
        <download-excel
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold"
          :data="excel_items"
          :fields="excel_fields"
          worksheet="Lịch sử quỹ"
          name="Lịch sử quỹ">
          Xuất Excel
        </download-excel>
      </div>

      <div v-show="onSearch" class="flex justify-center my-4">
        <icon name="loading" width="60" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="font-medium">Số dư đầu kỳ: {{currencyFormat(start_period_amount)}}</label>
        </div>
        <div>
          <label class="font-medium">Số dư cuối kỳ: {{currencyFormat(end_period_amount)}}</label>
        </div>
        <div>
          <label class="font-medium">Tổng thu: {{currencyFormat(total_income)}}</label>
        </div>
        <div>
          <label class="font-medium">Tổng chi: {{currencyFormat(total_expend)}}</label>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-2 py-2 text-center w-12">STT</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Ngày phát sinh</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Ngày hạch toán</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Số Phiếu</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Loại sổ thu - chi</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Nhóm khoản thu-chi</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Loại khoản thu-chi</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Diễn giải nội dung</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Đối tượng</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Tiền thu-chi</th>
              <th class="border border-gray-300 px-2 py-2 text-center">Tồn quỹ</th>
              <th class="border border-gray-300 px-2 py-2 text-center w-16"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in items" :key="item.id" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-2 py-2 text-center">{{item.stt}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.date_input}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.accounting_date}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.fund_number}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.bank_account_info}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.expend_income_group}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.expend_income_type}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.description}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.object_name}}</td>
              <td class="border border-gray-300 px-2 py-2 text-right">
                {{item.type == 0 ? "+" : "-"}}{{currencyFormat(item.amount)}}đ
              </td>
              <td class="border border-gray-300 px-2 py-2 text-right">
                <span v-if="item.money_type != 2 && item.fund_amount != null">{{currencyFormat(item.fund_amount)}}đ</span>
              </td>
              <td class="border border-gray-300 px-2 py-2 text-center">
                <i v-if="!item.loan_id" class="fa fa-edit ml-2 cursor-pointer text-blue-600 hover:text-blue-800"
                   title="Sửa" @click="editFund(item)" />
                <i v-if="isUserRoot" class="fa fa-trash ml-2 cursor-pointer text-red-600 hover:text-red-800"
                   title="Xoá" @click="deleteFund(item.id, item.fund_number)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="loadByScroll" class="flex justify-center my-4">
        <icon name="loading" width="60" />
      </div>
      <div v-if="hasNext === false" class="text-center my-4">--Hết--</div>
      <div v-if="hasNext === true && totalRow != 0" class="text-center my-4">
        <i class="fa fa-angle-double-down text-2xl"></i>
      </div>
    </div>

    <!-- Modal Bank Account List -->
    <div v-if="showBankAccountModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalListBankAccount">
      <div class="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h4 class="text-xl font-semibold text-center text-green-600 mb-4">Danh Sách Tài Khoản Ngân Hàng</h4>
        <hr class="my-4">

        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-2 py-2">STT</th>
                <th class="border border-gray-300 px-2 py-2">Loại TK</th>
                <th class="border border-gray-300 px-2 py-2">Tên TK</th>
                <th class="border border-gray-300 px-2 py-2">Số TK</th>
                <th class="border border-gray-300 px-2 py-2">Ngân hàng</th>
                <th class="border border-gray-300 px-2 py-2 text-right">Số dư TK hiện tại</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in bankAccountItems" :key="item.stt" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-2 py-2 text-center">{{item.stt}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.type_str}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.account_name}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.account_number}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.bank_name}}</td>
                <td class="border border-gray-300 px-2 py-2 text-right">{{currencyFormat(item.amount)}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end mt-4">
          <button class="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600" @click.prevent="hideModalListBankAccount">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import fundAPI from '@/api/fund'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'

const router = useRouter()
const authStore = useAuthStore()
const { popToast } = useToast()

const total = ref(0)
const cash = ref(0)
const credit = ref(0)
const total_net = ref(0)
const debt = ref(0)
const public_debt = ref(0)
const loan_pay = ref(0)
const loan_receive = ref(0)

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
const year_input = ref(2025)
const quarter_input = ref(1)
const month_input = ref(1)

const bankAccountOptions = ref([])
const incomeExpendGroupOptions = ref([])
const incomeExpendGroupOptionsStore = ref([])
const incomeExpendTypeOptions = ref([])
const incomeExpendTypeOptionsStore = ref([])
const expendIncomeGroupSelect = ref([])
const expendIncomeTypeSelect = ref([])

const inputs = ref({
  from_date: new Date(),
  to_date: new Date(),
  fund_number: null,
  bank_account: null,
  expend_income_group_ids: [],
  expend_income_type_ids: [],
  amount: null,
  description: null,
  accounting_date: null
})

const items = ref([])
const totalRow = ref(0)
const loading = ref(false)
const loadByScroll = ref(false)
const hasNext = ref(true)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)

const excel_items = ref([])
const excel_fields = ref({
  'Ngày phát sinh': 'date_input',
  'Ngày hạch toán': 'accounting_date',
  'Số Phiếu': 'fund_number',
  'Loại sổ thu - chi': 'bank_account_info',
  'Nhóm khoản thu-chi': 'expend_income_group',
  'Loại khoản thu-chi': 'expend_income_type',
  'Diễn giải nội dung': 'description',
  'Đối tượng': 'object_name',
  'Số Tiền': 'amount',
  'Tồn quỹ': 'fund_amount'
})

const onSearch = ref(false)
const total_class = ref("text-green-600")
const total_net_class = ref("text-green-600")
const start_period_amount = ref(0)
const end_period_amount = ref(0)
const total_income = ref(0)
const total_expend = ref(0)
const gotExcelItems = ref(false)

const bankAccountItems = ref([])
const showBankAccountModal = ref(false)
const isUserRoot = ref(false)

const onScroll = (event) => {
  if(onSearch.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const goToAddIncome = () => {
  router.push("/income")
}

const goToAddExpend = () => {
  router.push("/expend")
}

const goToAddAccountingSlip = () => {
  router.push("/accounting-slip")
}

const prepareDateInput = () => {
  let dateNow = new Date()
  inputs.value.to_date = new Date(dateNow.toJSON().slice(0,10))
  inputs.value.from_date = new Date(dateNow.setDate(dateNow.getDate() - 30))
  let currentYear = new Date().getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }
  month_input.value = new Date().getMonth() + 1
}

const getFundInfo = () => {
  loading.value = true
  fundAPI.getFundInfo().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let data = res.data.data
      total.value = data.total
      cash.value = data.cash
      credit.value = data.credit
      total_net.value = data.total_net
      debt.value = data.debt
      public_debt.value = data.public_debt
      loan_pay.value = data.loan_pay
      loan_receive.value = data.loan_receive
      bankAccountItems.value = data.bank_account_infos

      if(total.value >= 0) {
        total_class.value = "text-green-600"
      } else {
        total_class.value = "text-red-600"
      }
      if(total_net.value >= 0) {
        total_net_class.value = "text-green-600"
      } else {
        total_net_class.value = "text-red-600"
      }
    }
    loading.value = false
  }).catch(err => {
    loading.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getOptionRelatedFund = () => {
  let params = {
    bank_accounts: true,
    expend_income_groups: true,
    expend_income_types: true
  }

  fundAPI.getOptionsRelatedFund(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let options = res.data.data

      let bankAccounts = options.bank_accounts
      bankAccountOptions.value = [{value: null, text: ''}, {value: -1, text: 'Tiền mặt'}]
      if(bankAccounts) {
        for (let item of bankAccounts) {
          bankAccountOptions.value.push(item)
        }
      }

      let expend_income_groups = options.expend_income_groups
      incomeExpendGroupOptionsStore.value = JSON.parse(JSON.stringify(expend_income_groups))
      incomeExpendGroupOptions.value = [{value: null, text: ''}]
      for (let item of expend_income_groups) {
        let type = "Thu"
        if(item.type == 1) {
          type = "Chi"
        }
        if(item.type == 2) {
          type = "PKT"
        }
        let option = {
          value: item.id,
          text: type + " - " + item.name
        }
        incomeExpendGroupOptions.value.push(option)
      }

      let expend_income_types = options.expend_income_types
      incomeExpendTypeOptionsStore.value = JSON.parse(JSON.stringify(expend_income_types))
      incomeExpendTypeOptions.value = [{value: null, text: ''}]
      for (let item of expend_income_types) {
        let type = "Thu"
        if(item.type == 1) {
          type = "Chi"
        }
        if(item.type == 2) {
          type = "PKT"
        }
        let option = {
          value: item.id,
          text: type + " - " + item.name
        }
        incomeExpendTypeOptions.value.push(option)
      }
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const showModalListBankAccount = () => {
  showBankAccountModal.value = true
}

const hideModalListBankAccount = () => {
  showBankAccountModal.value = false
}

const changeGroup = () => {
  incomeExpendTypeOptions.value = [{value: null, text: ''}]
  let expend_income_types = JSON.parse(JSON.stringify(incomeExpendTypeOptionsStore.value))
  if(expendIncomeGroupSelect.value.length > 0) {
    for(let group of expendIncomeGroupSelect.value) {
      for (let item of expend_income_types) {
        if(item.group_id == group.value) {
          let type = "Thu"
          if(item.type == 1) {
            type = "Chi"
          }
          if(item.type == 2) {
            type = "PKT"
          }
          let option = {
            value: item.id,
            text: type + " - " + item.name
          }
          incomeExpendTypeOptions.value.push(option)
        }
      }
    }
  } else {
    for (let item of expend_income_types) {
      let type = "Thu"
      if(item.type == 1) {
        type = "Chi"
      }
      if(item.type == 2) {
        type = "PKT"
      }
      let option = {
        value: item.id,
        text: type + " - " + item.name
      }
      incomeExpendTypeOptions.value.push(option)
    }
  }
  expendIncomeTypeSelect.value = []
}

const clearDate = () => {
  inputs.value.accounting_date = null
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  gotExcelItems.value = false
  search()
}

const search = () => {
  if (onSearch.value) { return }

  onSearch.value = true

  let fromDate = inputs.value.from_date
  let toDate = inputs.value.to_date

  if(time_option.value == 2) {
    fromDate = year_input.value + '-' + month_input.value + '-01'
    toDate = year_input.value + '-' + month_input.value + '-' + new Date(year_input.value, month_input.value, 0).getDate()
  }
  if(time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(quarter_input.value)
    fromDate = year_input.value + '-' + quarter + '-01'
    toDate = year_input.value + '-' + (quarter + 2) + '-' + new Date(year_input.value, (quarter + 2), 0).getDate()
  }
  if(time_option.value == 4) {
    fromDate = year_input.value + '-01-01'
    toDate = year_input.value + '-12-' + new Date(year_input.value, 12, 0).getDate()
  }

  let expend_income_group_ids = []
  for (let group of expendIncomeGroupSelect.value) {
    expend_income_group_ids.push(group.value)
  }
  let expend_income_type_ids = []
  for (let type of expendIncomeTypeSelect.value) {
    expend_income_type_ids.push(type.value)
  }

  let params = {
    "from_date": fromDate,
    "to_date": toDate,
    "bank_account": inputs.value.bank_account,
    "expend_income_group_ids": expend_income_group_ids,
    "expend_income_type_ids": expend_income_type_ids,
    "fund_number": inputs.value.fund_number,
    "amount": inputs.value.amount,
    "description": inputs.value.description,
    "accounting_date": inputs.value.accounting_date,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  fundAPI.getFundHistory(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.fund_his
      totalRow.value = res.data.data.total_row
      start_period_amount.value = res.data.data.start_period_amount
      end_period_amount.value = res.data.data.end_period_amount
      total_income.value = res.data.data.total_income
      total_expend.value = res.data.data.total_expend

      if(loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if(offset.value + pageLimit.value >= res.data.data.total_row) {
        hasNext.value = false
      }

      if(!gotExcelItems.value) {
        getExcelItem(params)
      }
    } else {
      items.value = []
      excel_items.value = []
    }
    onSearch.value = false
  }).catch(err => {
    console.log(err)
    onSearch.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getExcelItem = (params) => {
  excel_items.value = []
  params.limit = 999999

  fundAPI.getFundHistory(params).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      excel_items.value = res.data.data.fund_his
      gotExcelItems.value = true
    }
  }).catch(err => {})
}

const currencyFormat = (num) => {
  let result = ""
  if(num == 0) {
    return "0"
  }
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const editFund = (item) => {
  if(item.type == 0) {
    router.push('/income/' + item.id)
  }
  if(item.type == 1) {
    router.push('/expend/' + item.id)
  }
}

const deleteFund = (id, name) => {
  if(id && name) {
    if(confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
      fundAPI.deleteFund(id).then(res => {
        prepareToSearch()
        getFundInfo()
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

onMounted(() => {
  if(authStore.user && authStore.user.isRoot) {
    isUserRoot.value = true
  } else {
    isUserRoot.value = false
  }
  window.addEventListener('scroll', onScroll)
  prepareDateInput()
  getFundInfo()
  getOptionRelatedFund()
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.datepicker-cus {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
