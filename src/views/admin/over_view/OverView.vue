<template>
  <div class="container mx-auto px-4">

    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">

        <div class="bg-white rounded-lg shadow p-6 mb-4">

            <div class="grid grid-cols-1 mb-4">
              <div class="w-full">
                <h1 class="text-center text-3xl font-bold"><b>Hôm Nay</b></h1>
              </div>
            </div>
          
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="w-full">
                  <div
                    class="border-2 border-blue-500 rounded-lg p-6 text-center"
                    style="background-color: rgb(255,230,230)"
                  >
                    <h5 class="text-lg font-semibold mb-4">Tổng Chi</h5>
                    <div class="form-group">
                      <div class="flex items-center justify-center gap-4">
                        <i class="fa fa-minus-circle text-6xl" style="color:#78B7D0"></i>
                        <div class="text-center flex-1">
                          <b class="text-4xl">{{currencyFormat(totalExpendToDay)}}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full">
                  <div
                    class="border-2 border-blue-500 rounded-lg p-6 text-center"
                    style="background-color: rgb(230,247,255)"
                  >
                    <h5 class="text-lg font-semibold mb-4">Tổng Thu</h5>
                    <div class="form-group">
                      <div class="flex items-center justify-center gap-4">
                        <i class="fa fa-plus-circle text-6xl" style="color:#FFDBB5"></i>
                        <div class="text-center flex-1">
                          <b class="text-4xl">{{currencyFormat(totalIncomeToDay)}}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          
            <div class="grid grid-cols-1 gap-4 mt-4">
              <div class="w-full">
                <p class="text-center text-lg mb-4">7 ngày qua</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="w-full">
                    <GChart
                      type="ColumnChart"
                      :data="chartDayData"
                      :options="chartOptions"
                    />
                  </div>
                  <div class="w-full">
                    <GChart
                      type="PieChart"
                      :data="pieChartDayData"
                      :options="chartOptions"
                    />
                  </div>
                </div>

              </div>
            </div>

        </div>

        <div class="bg-white rounded-lg shadow p-6 mb-4">
            <div class="grid grid-cols-1 mb-4">
              <div class="w-full">
                <h1 class="text-center text-3xl font-bold"><b>Tuần Này</b></h1>
              </div>
            </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="w-full">
                  <div
                    class="border-2 border-blue-500 rounded-lg p-6 text-center"
                    style="background-color: rgb(255,230,230)"
                  >
                    <h5 class="text-lg font-semibold mb-4">Tổng Chi</h5>
                    <div class="form-group">
                      <div class="flex items-center justify-center gap-4">
                        <i class="fa fa-minus-circle text-6xl" style="color:#78B7D0"></i>
                        <div class="text-center flex-1">
                          <b class="text-4xl">{{currencyFormat(totalExpendThisWeek)}}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full">
                  <div
                    class="border-2 border-blue-500 rounded-lg p-6 text-center"
                    style="background-color: rgb(230,247,255)"
                  >
                    <h5 class="text-lg font-semibold mb-4">Tổng Thu</h5>
                    <div class="form-group">
                      <div class="flex items-center justify-center gap-4">
                        <i class="fa fa-plus-circle text-6xl" style="color:#FFDBB5"></i>
                        <div class="text-center flex-1">
                          <b class="text-4xl">{{currencyFormat(totalIncomeThisWeek)}}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          
            <div class="grid grid-cols-1 gap-4 mt-4">
              <div class="w-full">
                <p class="text-center text-lg mb-4">8 tuần qua</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="w-full">
                    <GChart
                      type="ColumnChart"
                      :data="chartWeekData"
                      :options="chartOptions"
                    />
                  </div>
                  <div class="w-full">
                    <GChart
                      type="PieChart"
                      :data="pieChartWeekData"
                      :options="chartOptions"
                    />
                  </div>
                </div>

              </div>
            </div>

        </div>
        
        <div class="bg-white rounded-lg shadow p-6 mb-4">
            <div class="grid grid-cols-1 mb-4">
              <div class="w-full">
                <h1 class="text-center text-3xl font-bold"><b>Tháng Này</b></h1>
              </div>
            </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="w-full">
                  <div
                    class="border-2 border-blue-500 rounded-lg p-6 text-center"
                    style="background-color: rgb(255,230,230)"
                  >
                    <h5 class="text-lg font-semibold mb-4">Tổng Chi</h5>
                    <div class="form-group">
                      <div class="flex items-center justify-center gap-4">
                        <i class="fa fa-minus-circle text-6xl" style="color:#78B7D0"></i>
                        <div class="text-center flex-1">
                          <b class="text-4xl">{{currencyFormat(totalExpendThisMonth)}}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full">
                  <div
                    class="border-2 border-blue-500 rounded-lg p-6 text-center"
                    style="background-color: rgb(230,247,255)"
                  >
                    <h5 class="text-lg font-semibold mb-4">Tổng Thu</h5>
                    <div class="form-group">
                      <div class="flex items-center justify-center gap-4">
                        <i class="fa fa-plus-circle text-6xl" style="color:#FFDBB5"></i>
                        <div class="text-center flex-1">
                          <b class="text-4xl">{{currencyFormat(totalIncomeThisMonth)}}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          
            <div class="grid grid-cols-1 gap-4 mt-4">
              <div class="w-full">
                <p class="text-center text-lg mb-4">6 tháng qua</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="w-full">
                    <GChart
                      type="ColumnChart"
                      :data="chartMonthData"
                      :options="chartOptions"
                    />
                  </div>
                  <div class="w-full">
                    <GChart
                      type="PieChart"
                      :data="pieChartMonthData"
                      :options="chartOptions"
                    />
                  </div>
                </div>

              </div>
            </div>

        </div>
        
        <div class="bg-white rounded-lg shadow p-6 mb-4">
            <div class="grid grid-cols-1 mb-4">
              <div class="w-full">
                <h1 class="text-center text-3xl font-bold"><b>Năm Nay</b></h1>
              </div>
            </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="w-full">
                  <div
                    class="border-2 border-blue-500 rounded-lg p-6 text-center"
                    style="background-color: rgb(255,230,230)"
                  >
                    <h5 class="text-lg font-semibold mb-4">Tổng Chi</h5>
                    <div class="form-group">
                      <div class="flex items-center justify-center gap-4">
                        <i class="fa fa-minus-circle text-6xl" style="color:#78B7D0"></i>
                        <div class="text-center flex-1">
                          <b class="text-3xl">{{currencyFormat(totalExpendThisYear)}}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full">
                  <div
                    class="border-2 border-blue-500 rounded-lg p-6 text-center"
                    style="background-color: rgb(230,247,255)"
                  >
                    <h5 class="text-lg font-semibold mb-4">Tổng Thu</h5>
                    <div class="form-group">
                      <div class="flex items-center justify-center gap-4">
                        <i class="fa fa-plus-circle text-6xl" style="color:#FFDBB5"></i>
                        <div class="text-center flex-1">
                          <b class="text-3xl">{{currencyFormat(totalIncomeThisYear)}}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            <div class="grid grid-cols-1 gap-4 mt-4">
              <div class="w-full">
                <p class="text-center text-lg mb-4">5 năm qua</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="w-full">
                    <GChart
                      type="ColumnChart"
                      :data="chartYearData"
                      :options="chartOptions"
                    />
                  </div>
                  <div class="w-full">
                    <GChart
                      type="PieChart"
                      :data="pieChartYearData"
                      :options="chartOptions"
                    />
                  </div>
                </div>

              </div>
            </div>

        </div>

      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import overViewApi from '@/api/overView'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'

// Reactive state
const chartDayData = ref([
  ['Ngày', 'Thu', 'Chi'],
  ['01-01', 90, 30],
  ['01-02', 50, 60],
])
const chartWeekData = ref([
  ['Ngày', 'Thu', 'Chi'],
  ['01-01', 0, 0]
])
const chartMonthData = ref([
  ['Tháng', 'Thu', 'Chi'],
  ['Tháng 1', 0, 0]
])
const chartYearData = ref([
  ['Năm', 'Thu', 'Chi'],
  ['2024', 0, 0]
])
const pieChartDayData = ref([
  ['Nhóm chi phí', 'Chi phí'],
  ['Chi phí ăn uống', 40],
  ['Chi phí mua sắm', 60]
])
const pieChartWeekData = ref([
  ['Nhóm chi phí', 'Chi phí'],
  ['Chi phí ăn uống', 40],
  ['Chi phí mua sắm', 60]
])
const pieChartMonthData = ref([
  ['Nhóm chi phí', 'Chi phí'],
  ['Chi phí ăn uống', 40],
  ['Chi phí mua sắm', 60]
])
const pieChartYearData = ref([
  ['Nhóm chi phí', 'Chi phí'],
  ['Chi phí ăn uống', 40],
  ['Chi phí mua sắm', 60]
])
const chartOptions = ref({
  chart: {
    title: 'Biểu đồ thu chi',
    subtitle: 'Biểu đồ thu chi',
  }
})
const totalExpendToDay = ref(0)
const totalIncomeToDay = ref(0)
const totalExpendThisWeek = ref(0)
const totalIncomeThisWeek = ref(0)
const totalExpendThisMonth = ref(0)
const totalIncomeThisMonth = ref(0)
const totalExpendThisYear = ref(0)
const totalIncomeThisYear = ref(0)
const yearOptions = ref([])
const year_input = ref(new Date().getFullYear())

// Initialize
onMounted(() => {
  defineInput()
  getOverViewInfo()
  getOverViewChart()
})

/**
 * Define input
 */
function defineInput() {
  let dateNow = new Date()
  year_input.value = dateNow.getFullYear()

  let currentYear = dateNow.getFullYear()
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }
}

/**
 * Get today report
 */
function getOverViewInfo() {
  overViewApi.getOverViewInfo().then(res => {
    if(res && res.data && res.data.data) {
      let data = res.data.data
      totalExpendToDay.value = data.total_expend_today
      totalIncomeToDay.value = data.total_income_today
      totalExpendThisWeek.value = data.total_expend_this_week
      totalIncomeThisWeek.value = data.total_income_this_week
      totalExpendThisMonth.value = data.total_expend_this_month
      totalIncomeThisMonth.value = data.total_income_this_month
      totalExpendThisYear.value = data.total_expend_this_year
      totalIncomeThisYear.value = data.total_income_this_year
    }
  }).catch(err => {
    console.log(err)
    let errorMess = commonFunc.handleStaffError(err)
    console.error(errorMess)
  })
}

/**
 * Get data revenue
 */
function getOverViewChart() {
  overViewApi.getOverViewChart().then(res => {
    if(res && res.data && res.data.data) {
      let data = res.data.data
      chartDayData.value = data.chart_day_datas
      pieChartDayData.value = data.pie_chart_day_datas
      chartWeekData.value = data.chart_week_datas
      pieChartWeekData.value = data.pie_chart_week_datas
      chartMonthData.value = data.chart_month_datas
      pieChartMonthData.value = data.pie_chart_month_datas
      chartYearData.value = data.chart_year_datas
      pieChartYearData.value = data.pie_chart_year_datas
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    console.error(errorMess)
  })
}

/**
 * Currency format
 */
function currencyFormat(num) {
  let result = null

  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  } else {
    if(num === 0) {
      return 0
    }
  }
  return result
}
</script>


<style lang="scss">
  .content-circle {
    width: 45%;
    float: left;
    text-align: center;
  }

  .circle-without-text {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    background-color: #003399;
    position: relative;
    margin: auto;
  }

  .text-inside-circle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

</style>

