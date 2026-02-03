<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h4 class="text-xl font-semibold text-center text-orange-600">Lịch Sử Sửa Phiếu Thu-Chi</h4>
      </div>
      <hr class="my-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
          <label class="block mb-2 font-medium">Loại phiếu</label>
          <select v-model="inputs.fund_type" class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 float-right"
          :disabled="loading"
          @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="flex justify-between items-center mb-4 clear-both">
        <div>Số kết quả: <span class="font-bold text-gray-700">{{totalRow}}</span></div>
        <download-excel
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold"
          :data="excel_items"
          :fields="excel_fields"
          worksheet="Lịch Sử Sửa Phiếu Thu-Chi"
          name="Lịch Sử Sửa Phiếu Thu-Chi">
          Xuất Excel
        </download-excel>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-2 py-2 w-20">STT</th>
              <th class="border border-gray-300 px-2 py-2">Ngày</th>
              <th class="border border-gray-300 px-2 py-2">Người sửa</th>
              <th class="border border-gray-300 px-2 py-2">Loại phiếu</th>
              <th class="border border-gray-300 px-2 py-2">Phiếu cũ</th>
              <th class="border border-gray-300 px-2 py-2">Phiếu mới</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-2 py-2 text-center">{{index + 1}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.created_at}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.staff_name}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.fund_type_str}}</td>
              <td class="border border-gray-300 px-2 py-2">
                <a :href="'/fund-history-detail/' + item.fund_his_id_old"
                   target="_blank"
                   class="text-blue-600 hover:underline"
                   title="Chi tiết phiếu thu-chi">
                  {{item.fund_number_old}}
                </a>
              </td>
              <td class="border border-gray-300 px-2 py-2">
                <a :href="'/fund-history-detail/' + item.fund_his_id_new"
                   target="_blank"
                   class="text-blue-600 hover:underline"
                   title="Chi tiết phiếu thu-chi">
                  {{item.fund_number_new}}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="loading" class="flex justify-center my-4">
        <icon name="loading" width="60" />
      </div>
      <div v-if="hasNext === false" class="text-center my-4">--Hết--</div>
      <div v-if="hasNext === true && totalRow != 0" class="text-center my-4">
        <i class="fa fa-angle-double-down text-2xl"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'
import fundApi from '@/api/fund'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'

const { popToast } = useToast()

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
const year_input = ref(2024)
const quarter_input = ref(1)
const month_input = ref(1)
const typeOptions = ref([
  {"value": null, "text": ''},
  {"value": 0, "text": 'Phiếu thu'},
  {"value": 1, "text": 'Phiếu chi'}
])

const inputs = ref({
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02'),
  fund_type: null
})
const items = ref([])
const excel_items = ref([])
const excel_fields = ref({
  'Ngày sửa': 'created_at',
  'Người sửa': 'staff_name',
  'Loại phiếu': 'fund_type_str',
  'Mã phiếu cũ': 'fund_number_old',
  'Mã phiếu mới': 'fund_number_new'
})
const isGetExcelItems = ref(false)
const loadByScroll = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const totalRow = ref(0)

const prepareDateInput = () => {
  let dateNow = new Date()
  inputs.value.to_date = new Date(dateNow.toJSON().slice(0,10))
  inputs.value.from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
  let currentYear = new Date().getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }
  month_input.value = new Date().getMonth() + 1
}

const onScroll = (event) => {
  if(loading.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + pageLimit.value
      loadByScroll.value = true
      search()
    }
  }
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

const search = () => {
  if (loading.value) { return }
  loading.value = true

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
  if(time_option.value == 5) {
    toDate = new Date().toJSON().slice(0,10)
    fromDate = '2000-01-01'
  }

  let params = {
    "fund_type": inputs.value.fund_type,
    "from_date": fromDate,
    "to_date": toDate,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  fundApi.getEditFundHis(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data

      if(loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if(!isGetExcelItems.value) {
        getExcelItem(params)
      } else {
        if(parseInt(offset.value) + parseInt(pageLimit.value) >= parseInt(totalRow.value)) {
          hasNext.value = false
        }
      }
    } else {
      items.value = []
    }
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loading.value = false
  })
}

const getExcelItem = (params) => {
  if(isGetExcelItems.value) {
    return
  }

  excel_items.value = []
  params.limit = 999999

  fundApi.getEditFundHis(params).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      excel_items.value = res.data.data
      isGetExcelItems.value = true

      totalRow.value = res.data.data.length
      if(parseInt(offset.value) + parseInt(pageLimit.value) >= parseInt(totalRow.value)) {
        hasNext.value = false
      }
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loading.value = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  prepareDateInput()
  prepareToSearch()
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
