<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">

        <!-- Year Report Card -->
        <div class="bg-white rounded-lg shadow p-6 mb-4">
          <div class="mb-4">
            <h4 class="text-center text-header font-bold">Báo Cáo Năm</h4>
          </div>

          <div class="mb-4 text-center">
            <select
              v-model="year_input"
              @change="changeYear"
              class="form-control btn-width-200 mx-auto">
              <option v-for="option in yearOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Total Quotations -->
            <div class="bg-[rgb(229,249,255)] border-2 border-blue-500 rounded-lg p-6 text-center">
              <h5 class="mb-4">Tổng Số Báo Giá</h5>
              <div class="flex items-center justify-center">
                <i class="fa fa-clipboard text-[#78B7D0]" style="font-size:55px;width:20%;"></i>
                <div class="text-center" style="width: 75%">
                  <b class="text-4xl">{{ formatCurrency(totalQuotationNumber) }}</b>
                </div>
              </div>
            </div>

            <!-- Total Orders -->
            <div class="bg-[rgb(255,237,229)] border-2 border-blue-500 rounded-lg p-6 text-center">
              <h5 class="mb-4">Tổng Số Đơn Hàng bán</h5>
              <div class="flex items-center justify-center">
                <i class="fa fa-shopping-cart text-[#FFDBB5]" style="font-size:60px;width:20%;"></i>
                <div class="text-center" style="width: 75%">
                  <b class="text-4xl">{{ formatCurrency(totalOrderSellNumber) }}</b>
                </div>
              </div>
            </div>

            <!-- Completed Orders -->
            <div class="bg-[rgb(234,229,255)] border-2 border-blue-500 rounded-lg p-6 text-center">
              <h5 class="mb-4">Tổng Số Đơn Hoàn Thành</h5>
              <div class="flex items-center justify-center">
                <i class="fa fa-check text-[#C8A1E0]" style="font-size:60px;width:20%;"></i>
                <div class="text-center" style="width: 75%">
                  <b class="text-4xl">{{ formatCurrency(totalOrderSellFinishNumber) }}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Chart Card -->
        <div class="bg-white rounded-lg shadow p-6 mb-4">
          <div class="p-4">
            <h4 class="text-center text-header font-bold mb-6">Biểu Đồ Doanh Thu Theo Tháng</h4>

            <div class="w-full">
              <GChart
                type="ColumnChart"
                :data="chartData"
                :options="chartOptions"
              />
            </div>
          </div>
        </div>

        <!-- Inventory Card -->
        <div class="bg-white rounded-lg shadow p-6 mb-4">
          <div class="p-4">
            <h4 class="text-center text-header font-bold mb-6">Kho Hàng</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Inventory Stats -->
              <div class="space-y-4">
                <!-- Product Count -->
                <div class="border-2 border-blue-500 rounded-lg p-4 text-center">
                  <div class="text-blue-600 font-semibold border-b-2 border-blue-500 pb-2 mb-4">
                    Số lượng SP tồn kho
                  </div>
                  <h5 class="text-center text-header">{{ formatCurrency(repo.number_of_product) }}</h5>
                </div>

                <!-- Inventory Value -->
                <div class="border-2 border-red-500 rounded-lg p-4 text-center">
                  <div class="text-red-600 font-semibold border-b-2 border-red-500 pb-2 mb-4">
                    Giá trị hàng tồn kho
                  </div>
                  <h5 class="text-center text-header">{{ formatCurrency(repo.total_price_buy) }}đ</h5>
                </div>
              </div>

              <!-- Product Type Chart -->
              <div>
                <p class="text-center font-bold mb-4">Loại Sản Phẩm chiếm tỉ lệ doanh thu cao nhất</p>
                <GChart
                  type="PieChart"
                  :data="chartProductTypeAmount"
                  :options="chartOptions"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p v-for="(item1, index1) in repo.product_type_1_best_sales" :key="item1.product_type_name">
                  {{ (index1 + 1) + '. Loại sản phẩm [' + item1.product_type_name + '] đạt doanh thu: ' + formatCurrency(item1.total_amount_sell) + 'đ , chiếm: ' + item1.percent + '%'}}
                </p>
              </div>
              <div>
                <p v-for="(item2, index2) in repo.product_type_2_best_sales" :key="item2.product_type_name">
                  {{ (index2 + 4) + '. Loại sản phẩm [' + item2.product_type_name + '] đạt doanh thu: ' + formatCurrency(item2.total_amount_sell) + 'đ , chiếm: ' + item2.percent + '%'}}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Debt Card -->
        <div class="bg-white rounded-lg shadow p-6 mb-4">
          <div class="p-4">
            <h4 class="text-center text-header font-bold mb-6">Nợ công - Công nợ</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Receivable Debt -->
              <div class="border-2 border-green-500 rounded-lg p-4 text-center">
                <div class="text-green-600 font-semibold border-b-2 border-green-500 pb-2 mb-4">
                  Công nợ (Nợ cần thu hồi)
                </div>
                <div>
                  <h5 class="text-center text-green-600 mb-2">Tổng công nợ: {{ formatCurrency(debt_total) }}đ</h5>
                  <div class="text-left">
                    - Số lượng công nợ sắp đến hạn thu hồi: {{ formatCurrency(debt_number) }}<br>
                    - Tổng tiền công nợ sắp đến hạn thu hồi: <span class="text-green-600"><b>{{ formatCurrency(debt_amount) }}đ</b></span>
                  </div>
                </div>
              </div>

              <!-- Payable Debt -->
              <div class="border-2 border-red-500 rounded-lg p-4 text-center">
                <div class="text-red-600 font-semibold border-b-2 border-red-500 pb-2 mb-4">
                  Nợ công (Nợ phải trả)
                </div>
                <div>
                  <h5 class="text-center text-header mb-2">Tổng nợ công: {{ formatCurrency(public_debt_total) }}đ</h5>
                  <div class="text-left">
                    - Số lượng nợ công sắp đến hạn trả: {{ formatCurrency(public_debt_number) }}<br>
                    - Tổng tiền nợ công sắp đến hạn trả: <span class="text-header"><b>{{ formatCurrency(public_debt_amount) }}đ</b></span>
                  </div>
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
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import reportAPI from '@/api/report'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'

const { popToast } = useToast()
const { formatCurrency } = useFormatters()

// Data
const yearOptions = ref([])
const year_input = ref(2024)
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
  },
  hAxis: {
    textStyle: {
      fontSize: 10
    }
  },
  vAxis: {
    textStyle: {
      fontSize: 10
    }
  },
  legend: {
    textStyle: {
      fontSize: 10
    }
  },
})

const chartProductTypeAmount = ref([
  ["Loại SP", "Doanh thu"],
  ["Loại 1", 0]
])

const totalQuotationNumber = ref(0)
const totalOrderSellNumber = ref(0)
const totalOrderSellFinishNumber = ref(0)

const repo = ref({
  number_of_product: 0,
  total_price_buy: 0,
  product_type_1_best_sales: [],
  product_type_2_best_sales: []
})

const debt_total = ref(0)
const debt_number = ref(0)
const debt_amount = ref(0)
const public_debt_total = ref(0)
const public_debt_number = ref(0)
const public_debt_amount = ref(0)

// Methods
const defineInput = () => {
  let currentYear = new Date().getFullYear()
  year_input.value = currentYear

  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({ value: i, text: i })
  }
}

const getOverView = () => {
  reportAPI.getOverView({ year: year_input.value }).then(res => {
    if (res && res.data && res.data.data) {
      let data = res.data.data
      totalQuotationNumber.value = data.total_quotation_number
      totalOrderSellNumber.value = data.total_order_sell_number
      totalOrderSellFinishNumber.value = data.total_order_sell_finish_number
    }
  }).catch(err => {
    console.log(err)
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getRevenue = () => {
  reportAPI.getSummaryReport({ "year": year_input.value }).then(res => {
    if (res && res.data && res.data.data) {
      chartData.value = res.data.data.chart_datas
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getRepository = () => {
  reportAPI.getRepositoryOverview().then(res => {
    if (res && res.data && res.data.data) {
      let repo_infos = res.data.data

      if (repo_infos) {
        repo.value.number_of_product = repo_infos.number_of_product
        repo.value.total_price_buy = repo_infos.total_price_buy
        chartProductTypeAmount.value = repo_infos.product_type_best_sales
      }
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getDebtAndPublicDebt = () => {
  reportAPI.getDebtAndPublicDebtOverview().then(res => {
    if (res && res.data && res.data.data) {
      let data = res.data.data
      debt_total.value = data.debt_total
      debt_number.value = data.debt_forewarning_number
      debt_amount.value = data.debt_forewarning_amount
      public_debt_total.value = data.public_debt_total
      public_debt_number.value = data.public_debt_forewarning_number
      public_debt_amount.value = data.public_debt_forewarning_amount
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const changeYear = () => {
  getOverView()
  getRevenue()
}

// Lifecycle
onMounted(() => {
  defineInput()
  getOverView()
  getRevenue()
  getRepository()
  getDebtAndPublicDebt()
})
</script>


<style lang="scss">
  .content-circle {
    width: 32%;
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

