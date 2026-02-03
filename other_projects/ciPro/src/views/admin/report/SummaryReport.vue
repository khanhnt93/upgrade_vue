<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <h4 class="text-center text-xl font-semibold text-orange-600 mb-2">Báo Cáo Kết Quả Kinh Doanh</h4>
      <h4 class="text-center text-xl font-semibold text-orange-600 mb-4">Năm {{year_input}}</h4>
      <hr class="mb-4">

      <div class="mb-4">
        <div class="flex items-center gap-3" style="width: 200px">
          <span class="whitespace-nowrap">Năm:</span>
          <select v-model="year_input" @change="getData" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in yearOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

      <GChart
        type="ColumnChart"
        :data="chartData"
        :options="chartOptions"
      />

      <div class="mb-4">
        <p>Tổng số đơn chưa hoàn thành tạm tính: <b>{{currencyFormat(order_sell_number)}}</b></p>
        <p>Doanh thu đơn chưa hoàn thành tạm tính: <b>{{currencyFormat(order_sell_amount)}}đ</b></p>
      </div>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

      <div v-show="items.length > 0" class="mb-4 text-right">
        <button
          @click="exportToExcel"
          class="btn btn-default text-header bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <b>Xuất Excel</b>
        </button>
      </div>

      <div class="mt-4 mb-4">
        <div class="table-cus">
          <table class="table table-bordered table-striped fixed_header">
            <thead>
              <tr>
                <th style="width:2%">STT</th>
                <th style="width:18%">Chi tiết các khoản Thu Chi</th>
                <th style="width:8%">Tổng cộng</th>
                <th style="width:6%">Tháng 1</th>
                <th style="width:6%">Tháng 2</th>
                <th style="width:6%">Tháng 3</th>
                <th style="width:6%">Tháng 4</th>
                <th style="width:6%">Tháng 5</th>
                <th style="width:6%">Tháng 6</th>
                <th style="width:6%">Tháng 7</th>
                <th style="width:6%">Tháng 8</th>
                <th style="width:6%">Tháng 9</th>
                <th style="width:6%">Tháng 10</th>
                <th style="width:6%">Tháng 11</th>
                <th style="width:6%">Tháng 12</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in items" :key="item.stt" :class="(item.stt + '').includes('.') ? '' : 'bg-row-main'">
                <td>{{item.stt}}</td>
                <td>{{item.name}}</td>
                <td class="text-right">{{currencyFormat(item.total)}}</td>
                <td class="text-right">{{currencyFormat(item.month_1)}}</td>
                <td class="text-right">{{currencyFormat(item.month_2)}}</td>
                <td class="text-right">{{currencyFormat(item.month_3)}}</td>
                <td class="text-right">{{currencyFormat(item.month_4)}}</td>
                <td class="text-right">{{currencyFormat(item.month_5)}}</td>
                <td class="text-right">{{currencyFormat(item.month_6)}}</td>
                <td class="text-right">{{currencyFormat(item.month_7)}}</td>
                <td class="text-right">{{currencyFormat(item.month_8)}}</td>
                <td class="text-right">{{currencyFormat(item.month_9)}}</td>
                <td class="text-right">{{currencyFormat(item.month_10)}}</td>
                <td class="text-right">{{currencyFormat(item.month_11)}}</td>
                <td class="text-right">{{currencyFormat(item.month_12)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GChart } from 'vue-google-charts'
import reportApi from '@/api/report'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'

const { popToast } = useToast()

const year_input = ref(2024)
const yearOptions = ref([])
const chartData = ref([
  ['Tháng', 'Doanh thu', 'Chi phí', 'Lợi nhuận'],
  ['Tháng 1', 0, 0, 0],
  ['Tháng 2', 0, 0, 0],
  ['Tháng 3', 0, 0, 0],
  ['Tháng 4', 0, 0, 0],
  ['Tháng 5', 0, 0, 0],
  ['Tháng 6', 0, 0, 0],
  ['Tháng 7', 0, 0, 0],
  ['Tháng 8', 0, 0, 0],
  ['Tháng 9', 0, 0, 0],
  ['Tháng 10', 0, 0, 0],
  ['Tháng 11', 0, 0, 0],
  ['Tháng 12', 0, 0, 0]
])
const chartOptions = ref({
  chart: {
    title: 'Biểu đồ kết quả kinh doanh',
    subtitle: 'Biểu đồ kết quả kinh doanh',
  }
})
const loading = ref(false)
const items = ref([])
const excel_fields = {
  'STT': 'stt',
  'Chi tiết các khoản Thu Chi': 'name',
  'Tổng cộng': 'total',
  'Tháng 1': 'month_1',
  'Tháng 2': 'month_2',
  'Tháng 3': 'month_3',
  'Tháng 4': 'month_4',
  'Tháng 5': 'month_5',
  'Tháng 6': 'month_6',
  'Tháng 7': 'month_7',
  'Tháng 8': 'month_8',
  'Tháng 9': 'month_9',
  'Tháng 10': 'month_10',
  'Tháng 11': 'month_11',
  'Tháng 12': 'month_12',
}
const order_sell_number = ref(0)
const order_sell_amount = ref(0)

const prepareDateInput = () => {
  let dateNow = new Date()
  let currentYear = dateNow.getFullYear()
  year_input.value = currentYear

  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }
}

const getData = () => {
  loading.value = true

  let param = {
    "year": year_input.value
  }
  reportApi.getSummaryReport(param).then(res => {
    if(res && res.data && res.data.data) {
      chartData.value = res.data.data.chart_datas
      items.value = res.data.data.summary_datas
      order_sell_number.value = res.data.data.order_sell_number
      order_sell_amount.value = res.data.data.order_sell_amount
    }

    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    loading.value = false
  })
}

const currencyFormat = (num) => {
  let result = ""
  if(num == 0) return "0"
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const exportToExcel = () => {
  // Prepare data with field mappings
  const exportData = items.value.map(item => ({
    'Tháng': item.month,
    'Doanh thu': item.revenue,
    'Chi phí': item.expend,
    'Lợi nhuận': item.profit
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo tổng quát')
  XLSX.writeFile(workbook, 'bao_cao_tong_quat.xlsx')
}

onMounted(() => {
  prepareDateInput()
  getData()
})
</script>

<style lang="scss" scoped>
.label-width {
  width: 100%;
}

.bg-row-main {
  background-color: rgba(0, 0, 0, 0.09) !important;
}
</style>
