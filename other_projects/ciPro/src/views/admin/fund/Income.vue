<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h4 class="text-xl font-semibold text-center text-orange-600">{{title_prefix}} Khoản Thu</h4>
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
          <label class="block mb-2 font-medium">Loại thu<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <div class="flex gap-4">
            <div class="flex items-center">
              <input type="radio" v-model="inputs.sub_type" :value="0" class="mr-2"
                     id="sub_type_0" @change="changeSubType('0')">
              <label class="cursor-pointer" for="sub_type_0">Thu thường</label>
            </div>
            <div class="flex items-center">
              <input type="radio" v-model="inputs.sub_type" :value="1" class="mr-2"
                     id="sub_type_1" @change="changeSubType('1')">
              <label class="cursor-pointer" for="sub_type_1">Thu trả hàng</label>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Khoản thu cho ĐH</label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <label v-if="isEditFund">
            {{inputs.order_sell_number ? inputs.order_sell_number : inputs.order_buy_number}}
          </label>

          <div v-if="inputs.sub_type == 0 && !isEditFund" class="flex gap-2">
            <Multiselect
              v-model="orderSellSelect"
              :options="orderSellOptions"
              :loading="loadingOptions"
              placeholder="--Chọn từ đơn hàng bán--"
              label="name"
              track-by="name"
              class="flex-1"
              @input="changeOrderSell" />
            <button class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Tìm kiếm"
                    @click="showModalSearchOrderSell">
              <i class="fa fa-search"></i>
            </button>
          </div>

          <div v-if="inputs.sub_type == 1 && !isEditFund" class="flex gap-2">
            <Multiselect
              v-model="orderBuySelect"
              :options="orderBuyOptions"
              :loading="loadingOptions"
              placeholder="--Chọn từ đơn hàng nhập--"
              label="name"
              track-by="name"
              class="flex-1"
              @input="changeOrderBuy" />
            <button class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Tìm kiếm"
                    @click="showModalSearchOrderBuy">
              <i class="fa fa-search"></i>
            </button>
          </div>
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
          <label class="block mb-2 font-medium">Sổ khoản thu<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <div class="flex gap-4 mb-2">
            <div class="flex items-center">
              <input type="radio" v-model="inputs.money_type" :value="1" class="mr-2" id="money_type_1">
              <label class="cursor-pointer" for="money_type_1">Chuyển khoản</label>
            </div>
            <div class="flex items-center">
              <input type="radio" v-model="inputs.money_type" :value="0" class="mr-2" id="money_type_0">
              <label class="cursor-pointer" for="money_type_0">Tiền mặt</label>
            </div>
            <div v-if="isDebtRelief" class="flex items-center">
              <input type="radio" v-model="inputs.money_type" :value="2" class="mr-2" id="money_type_2">
              <label class="cursor-pointer" for="money_type_2">Khác</label>
            </div>
          </div>
          <div>
            <select v-show="inputs.money_type==1"
                    v-model="inputs.bank_account_id"
                    @change="changeBankAccount"
                    :disabled="inputs.money_type==0"
                    class="form-select w-full rounded-md border-gray-300">
              <option v-for="opt in bankAccountOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
            </select>
          </div>
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
                  @change="updateDescription"
                  class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in incomeTypeOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Diễn giải nội dung</label>
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

    <!-- Modal tìm kiếm đơn hàng bán -->
    <div v-if="showOrderSellModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalSearchOrderSell">
      <div class="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Tìm kiếm đơn hàng bán</h4>
        <hr class="my-4">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block mb-2 font-medium">Mã đơn hàng</label>
            <input type="text" v-model="orderSellSearch.order_sell_number"
                   class="form-input w-full rounded-md border-gray-300" maxlength="15">
          </div>
          <div>
            <label class="block mb-2 font-medium">Tên khách hàng</label>
            <input type="text" v-model="orderSellSearch.customer_name"
                   class="form-input w-full rounded-md border-gray-300" maxlength="255">
          </div>
        </div>

        <div class="flex justify-between mb-4">
          <button class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  @click.prevent="hideModalSearchOrderSell">
            Quay lại
          </button>
          <button class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  :disabled="onSearchOrderSell"
                  @click.prevent="searchOrderSell">
            Tìm Kiếm
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-2 py-2">STT</th>
                <th class="border border-gray-300 px-2 py-2">Ngày lập</th>
                <th class="border border-gray-300 px-2 py-2">Số ĐH</th>
                <th class="border border-gray-300 px-2 py-2">Tên K.H</th>
                <th class="border border-gray-300 px-2 py-2">Thành tiền</th>
                <th class="border border-gray-300 px-2 py-2">NV phụ trách</th>
                <th class="border border-gray-300 px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderSellSearchItems" :key="item.stt" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-2 py-2 text-center">{{item.stt}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.created_at}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.order_sell_number}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.customer_name}}</td>
                <td class="border border-gray-300 px-2 py-2 text-right">{{item.total}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.staff_on_charge_name}}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">
                  <button class="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          @click.prevent="chooseOrderSell(item.id, item.customer_id)">
                    Chọn
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-center mt-4">---Hết---</div>
      </div>
    </div>

    <!-- Modal tìm kiếm đơn hàng nhập -->
    <div v-if="showOrderBuyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalSearchOrderBuy">
      <div class="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Tìm kiếm đơn hàng nhập</h4>
        <hr class="my-4">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block mb-2 font-medium">Mã đơn hàng nhập</label>
            <input type="text" v-model="orderBuySearch.order_buy_number"
                   class="form-input w-full rounded-md border-gray-300" maxlength="15">
          </div>
          <div>
            <label class="block mb-2 font-medium">Tên nhà cung cấp</label>
            <input type="text" v-model="orderBuySearch.supplier_name"
                   class="form-input w-full rounded-md border-gray-300" maxlength="255">
          </div>
        </div>

        <div class="flex justify-between mb-4">
          <button class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  @click.prevent="hideModalSearchOrderBuy">
            Quay lại
          </button>
          <button class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  :disabled="onSearchOrderBuy"
                  @click.prevent="searchOrderBuy">
            Tìm Kiếm
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-2 py-2">STT</th>
                <th class="border border-gray-300 px-2 py-2">Ngày lập</th>
                <th class="border border-gray-300 px-2 py-2">Số ĐH</th>
                <th class="border border-gray-300 px-2 py-2">Tên nhà cung cấp</th>
                <th class="border border-gray-300 px-2 py-2">Thành tiền</th>
                <th class="border border-gray-300 px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderBuySearchItems" :key="item.stt" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-2 py-2 text-center">{{item.stt}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.created_at}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.order_buy_number}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.supplier_name}}</td>
                <td class="border border-gray-300 px-2 py-2 text-right">{{item.total}}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">
                  <button class="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          @click.prevent="chooseOrderBuy(item.id, item.supplier_id)">
                    Chọn
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-center mt-4">---Hết---</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vue3-datepicker'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

const title_prefix = ref('Thêm Mới')
const inputs = ref({
  "id": null,
  "type": 0,
  "sub_type": 0,
  "date_input": new Date(),
  "accounting_date": new Date(),
  "order_type": 0,
  "order_sell_id": null,
  "order_buy_id": null,
  "object_type": 0,
  "supplier_id": null,
  "customer_id": null,
  "staff_id": null,
  "object_other_name": null,
  "amount": 0,
  "money_type": 1,
  "bank_account_id": null,
  "expend_income_group_id": null,
  "expend_income_type_id": null,
  "description": null
})

const loadingOptions = ref(false)
const orderSellSelect = ref({})
const orderSellOptions = ref([])
const orderBuySelect = ref({})
const orderBuyOptions = ref([])
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

const orderSellSearchItems = ref([])
const onSearchOrderSell = ref(false)
const orderSellSearch = ref({
  order_sell_number: null,
  customer_name: null
})
const showOrderSellModal = ref(false)

const orderBuySearchItems = ref([])
const onSearchOrderBuy = ref(false)
const orderBuySearch = ref({
  order_buy_number: null,
  supplier_name: null
})
const showOrderBuyModal = ref(false)

const isIncomeFromOrderSell = ref(false)
const isProductBack = ref(false)
const isIncomeFromOrderBuy = ref(false)
const isEditFund = ref(false)
const isDebtRelief = ref(false)

const checkCreatedFromOrderSell = () => {
  if(isIncomeFromOrderSell.value) {
    let orderSellId = route.params.id
    chooseOrderSell(orderSellId, null)
  }
}

const getFundDetail = (fundHisId) => {
  if(fundHisId) {
    title_prefix.value = 'Cập Nhật'
    fundApi.getFundHisDetail(fundHisId).then(res => {
      if(res != null && res.data != null && res.data.data != null){
        inputs.value = res.data.data
        if(inputs.value.customer_id) {
          getCustomerById(inputs.value.customer_id)
        }
        if(inputs.value.supplier_id) {
          getSupplierById(inputs.value.supplier_id)
        }
        if(inputs.value.staff_id) {
          getStaffById(inputs.value.staff_id)
        }
        inputs.value.amount = currencyFormat(inputs.value.amount)

        if(inputs.value.expend_income_group_id && incomeTypeOptions.value.length > 0) {
          changeIncomeGroup()
        }
      }
    }).catch(err => {
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    title_prefix.value = 'Thêm Mới'
  }
}

const getOptionRelatedFund = () => {
  loadingOptions.value = true

  let params = {
    order_sells: true,
    order_buys_back: true,
    customers: true,
    suppliers: true,
    staffs: true,
    bank_accounts: true,
    type: 0,
    expend_income_groups: true,
    expend_income_types: true
  }
  if(isEditFund.value) {
    params.order_buys_back = false
    params.order_sells = false
  }
  if(isDebtRelief.value) {
    params.order_buys_back = false
    params.order_sells = false
    params.order_buys = true
  }

  fundApi.getOptionsRelatedFund(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let options = res.data.data

      customerOptions.value = options.customers
      if(inputs.value.customer_id) {
        getCustomerById(inputs.value.customer_id)
      }
      supplierOptions.value = options.suppliers
      if(inputs.value.supplier_id) {
        getSupplierById(inputs.value.supplier_id)
      }

      orderSellOptions.value = options.order_sells
      checkCreatedFromOrderSell()

      if(isProductBack.value || isIncomeFromOrderBuy.value) {
        inputs.value.sub_type = 1
        inputs.value.object_type = 1

        orderBuyOptions.value = options.order_buys
        let orderBuyId = route.params.id
        if(orderBuyId) {
          chooseOrderBuy(orderBuyId, null)
        }
      }

      staffOptions.value = options.staffs
      if(inputs.value.staff_id) {
        getStaffById(inputs.value.staff_id)
      }
      bankAccountOptions.value = options.bank_accounts

      incomeGroupOptions.value = []
      let income_groups = options.expend_income_groups
      for(let item of income_groups) {
        let option = {"value": item.id, "text": item.name}
        incomeGroupOptions.value.push(option)
      }

      incomeTypeOptions.value = options.expend_income_types
      incomeTypeOptionStore.value = options.expend_income_types

      if(isIncomeFromOrderBuy.value && isDebtRelief.value) {
        for(let item of income_groups) {
          if(item.code == 'thu_khac') {
            inputs.value.expend_income_group_id = item.id
            changeIncomeGroup()
            break
          }
        }
      } else {
        if(inputs.value.expend_income_group_id) {
          changeIncomeGroup()
        }
      }
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const updateDescription = () => {
  let income_type_text = ""
  if(inputs.value.expend_income_type_id) {
    income_type_text = commonFunc.getTextByValueOfSelectedBox(incomeTypeOptions.value, inputs.value.expend_income_type_id)
  }
  let order_name = ""
  if(orderSellSelect.value && orderSellSelect.value.id) {
    order_name = orderSellSelect.value.name
  } else {
    if (orderBuySelect.value && orderBuySelect.value.id) {
      order_name = orderBuySelect.value.name
      if (supplierSelect.value && supplierSelect.value.name) {
        order_name += " - " + supplierSelect.value.name
      }
    }
  }

  if(inputs.value.description && !inputs.value.description.includes(income_type_text) && !inputs.value.description.includes(order_name) ) {
    return
  }
  let description_str = income_type_text + " - " + order_name
  if(description_str.substring(0, 3) == " - ") {
    description_str = description_str.substring(3, description_str.length)
  }
  if(description_str.substring(description_str.length - 3, description_str.length) == " - ") {
    description_str = description_str.substring(0, description_str.length - 3)
  }

  if(isDebtRelief.value) {
    description_str = 'Lý do xóa nợ: ' + description_str
  }

  inputs.value.description = description_str
}

const save = () => {
  if(inputs.value.money_type == 0 || inputs.value.money_type == 2) {
    inputs.value.bank_account_id = -1
  } else {
    if(!inputs.value.bank_account_id) {
      popToast('danger', "[Sổ khoản thu] là mục bắt buộc nhập")
      return
    }
  }

  if(!inputs.value.expend_income_group_id) {
    popToast('danger', "[Nhóm khoản thu] là mục bắt buộc nhập")
    return
  }
  if(!inputs.value.expend_income_type_id) {
    popToast('danger', "[Loại Khoản thu] là mục bắt buộc nhập")
    return
  }

  if(orderSellSelect.value && orderSellSelect.value.id) {
    inputs.value.order_sell_id = orderSellSelect.value.id
  }
  if(orderBuySelect.value && orderBuySelect.value.id) {
    inputs.value.order_buy_id = orderBuySelect.value.id
  }

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

  saving.value = true
  if(inputs.value.id) {
    fundApi.updateIncome(inputs.value).then(res => {
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
  } else {
    fundApi.addIncome(inputs.value).then(res => {
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
  if(num == 0) {
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

const getCustomerById = (customerId) => {
  for(let customer of customerOptions.value) {
    if(customer.value == customerId) {
      customerSelect.value = customer
      break
    }
  }
  return {}
}

const getStaffById = (staffId) => {
  for(let staff of staffOptions.value) {
    if(staff.id == staffId) {
      staffSelect.value = staff
      break
    }
  }
  return {}
}

const getSupplierById = (supplierId) => {
  for(let supplier of supplierOptions.value) {
    if(supplier.id == supplierId) {
      supplierSelect.value = supplier
      break
    }
  }
  return {}
}

const checkIssueInvoice = () => {
  if(!orderSellSelect.value.issue_invoice) {
    if(inputs.value.bank_account_id) {
      for(let ba of bankAccountOptions.value) {
        if(inputs.value.bank_account_id == ba.value) {
          if(ba.text.includes("Cty")) {
            if(confirm("Bạn chọn mục [Sổ khoản thu] là tài khoản Cty nhưng đơn hàng này không mong muốn [Xuất VAT]. Vui lòng kiểm tra lại!")) {
              // User confirmed
            }
          }
          break
        }
      }
    }
  }
}

const changeOrderSell = () => {
  if(orderSellSelect.value && orderSellSelect.value.id) {
    inputs.value.amount = currencyFormat(orderSellSelect.value.total_remaining)
    if(orderSellSelect.value.customer_id) {
      getCustomerById(orderSellSelect.value.customer_id)
    }
    checkIssueInvoice()
  }
  updateDescription()
}

const changeBankAccount = () => {
  checkIssueInvoice()
}

const showModalSearchOrderSell = () => {
  showOrderSellModal.value = true
}

const hideModalSearchOrderSell = () => {
  showOrderSellModal.value = false
}

const searchOrderSell = () => {
  if (onSearchOrderSell.value) { return }

  onSearchOrderSell.value = true

  let params = {
    "order_sell_number": orderSellSearch.value.order_sell_number,
    "customer_name": orderSellSearch.value.customer_name,
    "limit": 100,
    "offset": 0
  }

  fundApi.searchOrderSell(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      orderSellSearchItems.value = res.data.data
    } else {
      orderSellSearchItems.value = []
    }
    onSearchOrderSell.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearchOrderSell.value = false
  })
}

const chooseOrderSell = (orderSellId, customerId) => {
  if(orderSellId) {
    for(let item of orderSellOptions.value) {
      if(item.id == orderSellId) {
        orderSellSelect.value = item
        if(!inputs.value.amount) {
          inputs.value.amount = currencyFormat(orderSellSelect.value.total_remaining)
        }
        if(!customerId && orderSellSelect.value.customer_id) {
          getCustomerById(orderSellSelect.value.customer_id)
        }
        break
      }
    }
  }
  if(customerId) {
    getCustomerById(customerId)
  }
  hideModalSearchOrderSell()
}

const changeIncomeGroup = () => {
  if(inputs.value.expend_income_group_id) {
    incomeTypeOptions.value = [{"value": null, "text": ""}]
    for(let item of incomeTypeOptionStore.value) {
      if(item.type == 0 && item.group_id == inputs.value.expend_income_group_id) {
        let typeItem = {"value": item.id, "text": item.name}
        incomeTypeOptions.value.push(typeItem)
      }
    }
  } else {
    incomeTypeOptions.value = []
  }
}

const showModalSearchOrderBuy = () => {
  showOrderBuyModal.value = true
}

const hideModalSearchOrderBuy = () => {
  showOrderBuyModal.value = false
}

const searchOrderBuy = () => {
  if (onSearchOrderBuy.value) { return }

  onSearchOrderBuy.value = true

  let params = {
    "order_buy_number": orderBuySearch.value.order_buy_number,
    "supplier_name": orderBuySearch.value.supplier_name,
    "limit": 100,
    "offset": 0
  }

  fundApi.searchOrderBuy(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      orderBuySearchItems.value = res.data.data
    } else {
      orderBuySearchItems.value = []
    }
    onSearchOrderBuy.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearchOrderBuy.value = false
  })
}

const chooseOrderBuy = (orderBuyId, supplierId) => {
  if(orderBuyId) {
    for(let item of orderBuyOptions.value) {
      if(item.id == orderBuyId) {
        orderBuySelect.value = item
        if(!inputs.value.amount) {
          inputs.value.amount = currencyFormat(orderBuySelect.value.amount_remaining)
        }
        if(!supplierId && orderBuySelect.value.supplier_id) {
          getSupplierById(orderBuySelect.value.supplier_id)
        }
        break
      }
    }
  }
  if(supplierId) {
    getSupplierById(supplierId)
  }
  hideModalSearchOrderBuy()
}

const changeOrderBuy = () => {
  if(orderBuySelect.value && orderBuySelect.value.id) {
    inputs.value.amount = currencyFormat(orderBuySelect.value.total)
    if(orderBuySelect.value.supplier_id) {
      getSupplierById(orderBuySelect.value.supplier_id)
    }
  }
  updateDescription()
}

const changeSubType = (subType) => {
  if(subType == 1) {
    inputs.value.object_type = 1
  } else {
    inputs.value.object_type = 0
  }
}

const changeDateInput = () => {
  let dateNow = new Date()
  let today = dateNow.toJSON().slice(0,10)
  if(inputs.value.date_input != today && inputs.value.accounting_date == today) {
    inputs.value.accounting_date = new Date(JSON.parse(JSON.stringify(inputs.value.date_input)))
  }
}

onMounted(() => {
  let url = location.href
  if(url.includes("income-from-order-sell")) {
    isIncomeFromOrderSell.value = true
  } else if(url.includes("income-from-product-back")){
    isProductBack.value = true
  } else if(url.includes("income-from-order-buy")) {
    isIncomeFromOrderBuy.value = true
    let isDebtReliefParam = route.query.isDebtRelief
    if(isDebtReliefParam) {
      inputs.value.money_type = 2
      isDebtRelief.value = true
    }
  } else if(url.includes("income/")) {
    let fundHisId = route.params.fundHisId
    if(fundHisId) {
      isEditFund.value = true
      getFundDetail(fundHisId)
    }
  }

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
