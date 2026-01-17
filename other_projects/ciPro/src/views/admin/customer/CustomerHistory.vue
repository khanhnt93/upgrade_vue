<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div>
        <h4 class="mt-2 text-center text-header font-bold">Lịch Sử Khách Hàng</h4>
      </div>
      <hr class="my-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block mb-2">Tên</label>
          <input id="name" v-model="inputs.name" type="text" autocomplete="new-password" class="form-control w-full" maxlength="75">
        </div>
        <div>
          <label class="block mb-2">Số điện thoại</label>
          <input id="price" v-model="inputs.phone" type="text" autocomplete="new-password" class="form-control w-full" maxlength="11" @keyup="integerOnly($event.target)">
        </div>
        <div>
          <label class="block mb-2">Từ ngày</label>
          <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus"></datepicker>
        </div>
        <div>
          <label class="block mb-2">Đến ngày</label>
          <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus"></datepicker>
        </div>
      </div>

      <div class="mb-4">
        <button class="float-right px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 btn-width-120" :disabled="onSearch" @click="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 clear-both">
        <div>
          Số kết quả: {{items.length}}
        </div>
        <div class="text-right">
          <download-excel
            class="btn btn-default text-header"
            :data="items"
            :fields="excel_fields"
            worksheet="Lịch sử khách hàng"
            name="lich_su_khach_hang.xls">
            <b>Xuất Excel</b>
          </download-excel>
        </div>
      </div>

      <div class="overflow-x-auto">
        <span v-show="loading" class="loading-more"><icon name="loading" width="60" /></span>
        <table class="min-w-full divide-y divide-gray-200 border">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">STT</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Ngày</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Tên k.H</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Số điện thoại</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Loại giao dịch</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Số hoá đơn</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Tổng tiền SP</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Thành tiền</th>
              <th class="px-4 py-3 border"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 text-center font-bold text-header border" colspan="6">Tổng</td>
              <td class="px-4 py-3 text-right font-bold text-header border">{{currencyFormat(sum_sub_total)}}</td>
              <td class="px-4 py-3 text-right font-bold text-header border">{{currencyFormat(sum_total)}}</td>
              <td class="border"></td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap border">{{item.stt}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.created_at}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.customer_name}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.customer_phone}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.trade_type}}</td>
              <td class="px-4 py-3 whitespace-nowrap border">{{item.bill_number}}</td>
              <td class="px-4 py-3 text-right whitespace-nowrap border">{{currencyFormat(item.sub_total)}}</td>
              <td class="px-4 py-3 text-right whitespace-nowrap border">{{currencyFormat(item.total)}}</td>
              <td class="px-4 py-3 text-center border">
                <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 btn-width-120" @click="goToDetail(item.id)">
                  Chi tiết
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <span class="loading-more">--Hết--</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import customerApi from '@/api/customer'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'

const router = useRouter()
const { popToast } = useToast()

const inputs = ref({
  name: null,
  phone: null,
  from_date: '',
  to_date: ''
})
const items = ref([])
const excel_fields = ref({
  'Ngày': 'created_at',
  'Tên K.H': 'customer_name',
  'Số điện thoại': 'customer_phone',
  'Số Bill': 'bill_number',
  'Loại giao dịch': 'trade_type',
  'Tổng tiền SP': 'sub_total',
  'Thành Tiền': 'total'
})
const sum_sub_total = ref(0)
const sum_total = ref(0)
const onSearch = ref(false)
const loading = ref(false)

const prepareToSearch = () => {
  items.value = []
  search()
}

const search = () => {
  if (onSearch.value) return
  onSearch.value = true
  loading.value = true

  let params = {
    "name": inputs.value.name,
    "phone": inputs.value.phone,
    "from_date": inputs.value.from_date,
    "to_date": inputs.value.to_date
  }

  customerApi.getCustomerHistory(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      items.value = res.data.data

      // Calculate sum
      sum_sub_total.value = 0
      sum_total.value = 0
      for (let i in items.value) {
        sum_sub_total.value += items.value[i].sub_total
        sum_total.value += items.value[i].total
      }
    } else {
      items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const goToDetail = (id) => {
  let routeData = router.resolve({ path: '/trade-detail/' + id })
  window.open(routeData.href, '_blank')
}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const currencyFormat = (num) => {
  let result = ""
  if (num == 0) {
    return "0"
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

onMounted(() => {
  // Get default from date and to date
  let dateNow = new Date()
  inputs.value.from_date = dateNow.toJSON().slice(0, 8) + '01'
  let dayOfMonth = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0).getDate()
  let toDate = new Date(dateNow.setDate(dayOfMonth))
  inputs.value.to_date = toDate.toJSON().slice(0, 10)

  // Load list when load page
  search()
})
</script>
