<template>
  <div class="container-fluid px-4 py-4">
    <div class="space-y-6">
      <!-- Today Statistics Card -->
      <div class="card">
        <div class="card-body">
          <div class="mb-4">
            <h4 class="text-center font-semibold text-lg">Hôm Nay</h4>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div class="bg-blue-50 border border-blue-500 rounded-lg p-6 text-center">
                <h5 class="text-lg font-semibold mb-4">Số hóa đơn</h5>
                <div class="flex items-center justify-center">
                  <font-awesome-icon icon="clipboard" class="text-6xl text-blue-400 mr-4" />
                  <div class="text-4xl font-bold">{{ formatCurrency(toDayBillNumber) }}</div>
                </div>
              </div>
            </div>

            <div>
              <div class="bg-orange-50 border border-orange-500 rounded-lg p-6 text-center">
                <h5 class="text-lg font-semibold mb-4">Doanh thu</h5>
                <div class="flex items-center justify-center">
                  <font-awesome-icon icon="plus" class="text-6xl text-orange-300 mr-4" />
                  <div class="text-4xl font-bold">{{ formatCurrency(toDayRevenue) }}</div>
                </div>
              </div>
            </div>

            <div>
              <div class="bg-purple-50 border border-purple-500 rounded-lg p-6 text-center">
                <h5 class="text-lg font-semibold mb-4">Chi phí</h5>
                <div class="flex items-center justify-center">
                  <font-awesome-icon icon="minus" class="text-6xl text-purple-300 mr-4" />
                  <div class="text-4xl font-bold">{{ formatCurrency(toDayFee) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Chart Card -->
      <div class="card">
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-12">
              <h4 class="text-center font-semibold text-lg">Doanh Thu</h4>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <GChart
                type="ColumnChart"
                :data="chartDayData"
                :options="chartOptions"
              />
            </div>
          </div>

          <div class="row mt-4">
            <div class="col-12 text-center">
              <router-link to="/chart-profit-revenue" class="text-blue-600 hover:text-blue-800 hover:underline">
                Xem nhiều hơn
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Best Selling Card -->
      <div class="card">
        <div class="card-body">
          <h4 class="text-center font-semibold text-lg mb-4">Bán Chạy</h4>

          <!-- Group Menu Chart -->
          <div class="row">
            <div class="col-12">
              <p class="font-semibold mb-3">Nhóm mặt hàng bán chạy(7 ngày qua)</p>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-12">
              <div class="flex gap-4 mb-3">
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="groupGMenu"
                    v-model="showGMenuAmount"
                    :value="true"
                    class="mr-2"
                  />
                  <span>Doanh thu</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="groupGMenu"
                    v-model="showGMenuAmount"
                    :value="false"
                    class="mr-2"
                  />
                  <span>Số lượng</span>
                </label>
              </div>

              <GChart
                v-if="showGMenuAmount"
                type="PieChart"
                :data="chartGroupMenuDataAmount"
                :options="chartOptions"
              />

              <GChart
                v-else
                type="PieChart"
                :data="chartGroupMenuDataQuantity"
                :options="chartOptions"
              />
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-12 text-center">
              <router-link to="/statistic" class="text-blue-600 hover:text-blue-800 hover:underline">
                Xem nhiều hơn
              </router-link>
            </div>
          </div>

          <!-- Menu Items Chart -->
          <div class="row">
            <div class="col-12">
              <p class="font-semibold mb-3">Mặt hàng bán chạy(7 ngày qua)</p>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12">
              <div class="flex gap-4 mb-3">
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="menu"
                    v-model="showMenuAmount"
                    :value="true"
                    class="mr-2"
                  />
                  <span>Doanh thu</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="menu"
                    v-model="showMenuAmount"
                    :value="false"
                    class="mr-2"
                  />
                  <span>Số lượng</span>
                </label>
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12">
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="topMenu"
                    @change="handleShowTop5Menu"
                    checked
                    class="mr-2"
                  />
                  <span>Top 5</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="topMenu"
                    @change="handleShowTop10Menu"
                    class="mr-2"
                  />
                  <span>Top 10</span>
                </label>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <GChart
                v-if="showMenuAmount"
                type="PieChart"
                :data="chartMenuDataAmount"
                :options="chartOptions"
              />
              <GChart
                v-else
                type="PieChart"
                :data="chartMenuDataQuantity"
                :options="chartOptions"
              />
            </div>
          </div>

          <div class="row mt-4">
            <div class="col-12 text-center">
              <router-link to="/statistic" class="text-blue-600 hover:text-blue-800 hover:underline">
                Xem nhiều hơn
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory Card -->
      <div class="card">
        <div class="card-body">
          <h4 class="text-center font-semibold text-lg mb-4">Kho Hàng</h4>

          <div class="row">
            <div class="col-md-6 mb-4">
              <div class="border border-red-500 rounded-lg overflow-hidden">
                <div class="bg-red-500 text-white px-4 py-2 font-semibold">
                  Sản phẩm đã hết
                </div>
                <div class="p-4 text-center">
                  <h5 class="text-xl font-semibold mb-3">{{ formatCurrency(out_over) }}</h5>
                  <div v-for="item in resource_out_over" :key="item.resource_name" class="text-left text-sm mb-1">
                    {{ ' - ' + item.resource_name + ': ' + item.quantity + '/' + item.min_quantity + '(' + item.unit_name + ')' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6 mb-4">
              <div class="border border-blue-500 rounded-lg overflow-hidden">
                <div class="bg-blue-500 text-white px-4 py-2 font-semibold">
                  Sản phẩm sắp hết
                </div>
                <div class="p-4 text-center">
                  <h5 class="text-xl font-semibold mb-3">{{ formatCurrency(running_out) }}</h5>
                  <div v-for="item in resource_running_out" :key="item.resource_name" class="text-left text-sm mb-1">
                    {{ ' - ' + item.resource_name + ': ' + item.quantity + '/' + item.min_quantity + '(' + item.unit_name + ')' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p class="text-center mt-4">
            <router-link to="/resource/list" class="text-blue-600 hover:text-blue-800 hover:underline">
              Xem nhiều hơn
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GChart } from 'vue-google-charts'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

const { popToast } = useToast()
const { formatCurrency } = useFormatters()

// Chart data
const chartDayData = ref([
  ["Time", "Doanh thu"],
  ["Hôm qua ", 0],
  ["Hôm nay", 0],
])

const chartOptions = ref({
  chart: {
    title: 'Biểu đồ doanh thu',
    subtitle: 'Biểu đồ doanh thu',
  },
  responsive: false,
  maintainAspectRatio: true
})

const chartGroupMenuDataAmount = ref([
  ["Tên nhóm", "Doanh thu"],
  ["nhóm 1", 0]
])

const chartGroupMenuDataQuantity = ref([
  ["Tên nhóm", "Số lượng"],
  ["nhóm 1", 0]
])

const chartMenuDataAmount = ref([
  ["Tên món", "Doanh thu"],
  ["Món 1", 0]
])

const chartMenuDataQuantity = ref([
  ["Tên món", "Số lượng"],
  ["Món 1", 0]
])

// Data
const fromDay = ref(null)
const toDay = ref(null)
const out_over = ref(0)
const resource_out_over = ref([])
const running_out = ref(0)
const resource_running_out = ref([])
const showGMenuAmount = ref(true)
const showMenuAmount = ref(true)
const store_food_report_amount = ref([])
const store_food_report_quantity = ref([])
const toDayBillNumber = ref(0)
const toDayRevenue = ref(0)
const toDayFee = ref(0)

/**
 * Define input
 */
const defineInput = () => {
  let dateNow = new Date()

  // Day
  toDay.value = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
  let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
  fromDay.value = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
}

/**
 * Get list day
 */
const getListDay = () => {
  let result = []

  for (let i = 6; i >= 0; i--) {
    let dateNow = new Date()
    let dateTemp = new Date(dateNow.setDate(dateNow.getDate() - i))
    dateTemp = commonFunc.formatDate(dateTemp.toJSON().slice(0,10)).substring(0, 5)
    result.push(dateTemp)
  }
  return result
}

/**
 * Handle day date
 */
const handleDayData = (data) => {
  let newChartDayData = [
    ["Time", "Doanh thu"]
  ]
  let listDay = getListDay()
  for (let i in listDay) {
    let item = [listDay[i], 0]
    for (let j in data) {
      if(listDay[i] == data[j].time) {
        item[1] = data[j].profit
        break
      }
    }
    newChartDayData.push(item)
  }
  chartDayData.value = newChartDayData
}

/**
 * Get today report
 */
const getTodayReport = () => {
  // Search
  adminAPI.getTodayReport().then(res => {
    if(res && res.data && res.data.data) {
      let data = res.data.data
      toDayBillNumber.value = data.bill_number
      toDayRevenue.value = data.reveneu
      toDayFee.value = data.fee
    }

    // Get other report
    getData()

  }).catch(err => {
    console.log(err)
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Search
 */
const getData = () => {
  defineInput()
  let params = {
    "from_day": commonFunc.convertDDMMYYYYToYYYYMMDD(fromDay.value),
    "to_day": commonFunc.convertDDMMYYYYToYYYYMMDD(toDay.value)
  }

  // Search
  adminAPI.getOverView(params).then(res => {
    if(res && res.data && res.data.data) {
      handleDayData(res.data.data.data_day)

      store_food_report_amount.value = res.data.data.data_menu.food_report_amount
      getTopMenuAmount(6)
      store_food_report_quantity.value = res.data.data.data_menu.food_report_quantity
      getTopMenuQuantity(6)
      chartGroupMenuDataAmount.value = res.data.data.data_menu.group_report_amount
      chartGroupMenuDataQuantity.value = res.data.data.data_menu.group_report_quantity

      out_over.value = res.data.data.data_resource_out_over
      running_out.value = res.data.data.date_resource_running_out
      resource_out_over.value = res.data.data.resource_out_over
      resource_running_out.value = res.data.data.resource_running_out
    }

  }).catch(err => {
    console.log(err)
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Get top menu amount
 */
const getTopMenuAmount = (index) => {
  let length = index
  if(store_food_report_amount.value.length < index) {
    length = store_food_report_amount.value.length
  }
  let result = []
  for (let i = 0; i <= length -1 ; i++) {
    result.push(store_food_report_amount.value[i])
  }
  chartMenuDataAmount.value = result
}

/**
 * Get top menu quantity
 */
const getTopMenuQuantity = (index) => {
  let length = index
  if(store_food_report_quantity.value.length < index) {
    length = store_food_report_quantity.value.length
  }
  let result = []
  for (let i = 0; i <= length -1 ; i++) {
    result.push(store_food_report_quantity.value[i])
  }
  chartMenuDataQuantity.value = result
}

/**
 * Handle show top menu
 */
const handleShowTop5Menu = () => {
  getTopMenuAmount(6)
  getTopMenuQuantity(6)
}

/**
 * Handle show top menu
 */
const handleShowTop10Menu = () => {
  getTopMenuAmount(11)
  getTopMenuQuantity(11)
}

onMounted(() => {
  getTodayReport()
})
</script>

<style scoped>
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>

