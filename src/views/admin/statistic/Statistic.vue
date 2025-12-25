<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div class="w-full md:col-span-12">
        <div class="bg-white rounded-lg shadow p-6">

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="w-full md:col-span-12">
              <h1 class="text-center text-header"><b>Thống Kê</b></h1>
            </div>
          </div>
          <hr>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
            <div class="w-full md:col-span-3">
              <label>Lọc thời gian theo</label>
              <select class="form-control" v-model="inputs.time_option">
                <option v-for="option in timeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="w-full md:col-span-3">
              <!--Thời gian theo ngày-->
              <label v-show="inputs.time_option == 1">Từ ngày</label>
              <datepicker v-show="inputs.time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
            </div>

            <div class="w-full md:col-span-3">
              <!--Thời gian theo ngày-->
              <label v-show="inputs.time_option == 1">Đến ngày</label>
              <datepicker v-show="inputs.time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              
              <!--Thời gian tuần -->
              <label v-show="inputs.time_option == 6">Tuần</label>
              <select v-show="inputs.time_option == 6" class="form-control" v-model="week_input">
                <option v-for="option in weekOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>

              <!--Thời gian tháng -->
              <label v-show="inputs.time_option == 2">Tháng</label>
              <select v-show="inputs.time_option == 2" class="form-control" v-model="month_input">
                <option v-for="option in monthOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>

              <!--Thời gian năm -->
              <label v-show="inputs.time_option == 4">Năm</label>
              <select v-show="inputs.time_option == 4" class="form-control" v-model="year_input">
                <option v-for="option in yearOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="w-full md:col-span-3">
                <label class="label-width text-white">
                  Thống kê
                </label>
                <button class="btn btn-outline-primary pull-right btn-width-120 px-4 py-2" 
                  @click.prevent="search">
                  Thống kê
                </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <!-- Bảng danh sách -->
            <div class="w-full md:col-span-7 mt-4">
              <div style="overflow-x: auto;">
                <table
                  border="1"
                  cellpadding="8"
                  cellspacing="0"
                  style="border-collapse: collapse; width: 100%; text-align: left; font-size: 14px;"
                >
                  <thead style="background-color: #3B9797; font-weight: bold;">
                    <tr class="text-white">
                      <th colspan="2" class="text-center">Danh mục</th>
                      <th class="text-center">Số tiền</th>
                      <th class="text-center">Tỷ lệ %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Dư tiền mặt -->
                    <tr style="background-color: #FFE1AF; font-weight: bold;">
                      <td colspan="2">Dư tiền mặt (1) - (2)</td>
                      <td class="text-right">{{ currencyFormat(totalIncome - totalExpend) }}</td>
                      <td></td>
                    </tr>
                    <!-- Thu --> 
                    <tr style="background-color: #F5F5F0; font-weight: bold;">
                      <td colspan="2">Tổng thu (1)</td>
                      <td class="text-right">{{ currencyFormat(totalIncome) }}</td>
                      <td class="text-right">100%</td>
                    </tr>
                    <tr v-for="(income, index) in incomes" :key="income.name + index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ income.name }}</td>
                      <td class="text-right">
                        <router-link :to="{ path: '/income', query: { group_id: income.id, from_date: from_date, to_date: to_date } }">
                          {{ currencyFormat(income.amount) }}
                        </router-link>
                      </td>
                      <td class="text-right">
                        {{ ((income.amount / totalIncome) * 100).toFixed(1) + '%' }}
                      </td>
                    </tr>
                    <!-- Chi -->
                    <tr style="background-color: #F5F5F0; font-weight: bold;">
                      <td colspan="2">Tổng chi (2)</td>
                      <td class="text-right">{{ currencyFormat(totalExpend) }}</td>
                      <td class="text-right">100%</td>
                    </tr>
                    <tr v-for="(expend, index) in expends" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ expend.name }}</td>
                      <td class="text-right">
                        <router-link :to="{ path: '/expend', query: { group_id: expend.id, from_date: from_date, to_date: to_date } }">
                          {{ currencyFormat(expend.amount) }}
                        </router-link>
                      </td>
                      <td class="text-right">
                        {{ ((expend.amount / totalExpend) * 100).toFixed(1) + '%' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Biểu đồ tròn -->
            <div class="w-full md:col-span-5 mt-4">
              <div class="grid grid-cols-1 gap-4">
                <div class="w-full">
                  <h5 class="text-center">Tỷ lệ thu</h5>
                  <GChart
                    type="PieChart"
                    :data="pieChartIncomeData"
                    :options="chartOptions"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div class="w-full">
                  <h5 class="text-center">Tỷ lệ chi</h5>
                  <GChart
                    type="PieChart"
                    :data="pieChartExpendData"
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


<script>
import overViewApi from '@/api/overView'
import commonFunc from '@/common/commonFunc'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useToast } from 'vue-toastification'

use([CanvasRenderer, BarChart, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent])
import { GChart } from 'vue-google-charts'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

export default {
  components: {
    GChart,
    Datepicker,
    Multiselect
  },
  data () {
    return {
      timeOptions: [
        {"value": 1, "text": 'Ngày'},
        {"value": 6, "text": 'Tuần'},
        {"value": 2, "text": 'Tháng'},
        {"value": 4, "text": 'Năm'},
        {"value": 5, "text": 'Tất cả'}
      ],
      yearOptions: [],
      quarterOptions: [
          {"value": 1, "text": 'Quý 1'},
          {"value": 2, "text": 'Quý 2'},
          {"value": 3, "text": 'Quý 3'},
          {"value": 4, "text": 'Quý 4'}
      ],
      weekOptions: [
          {"value": 1, "text": 'Tuần này'},
          {"value": 2, "text": 'Tuần trước'}
      ],
      monthOptions: [
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
      ],
      year_input: 2024,
      quarter_input: 1,
      week_input: 1,
      month_input: 1,
      inputs: {
        time_option: 2,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      from_date: '2000-01-01',
      to_date: '2000-01-02',
      expends: [],
      incomes: [],
      pieChartExpendData: [
        ['Nhóm chi phí', 'Chi phí'],
        ['Chi phí ăn uống', 40],
        ['Chi phí mua sắm', 60]
      ],
      pieChartIncomeData: [
        ['Nhóm thu nhập', 'Thu nhập'],
        ['Lương', 40],
        ['Khác', 60]
      ],
      chartData: [
        ['Ngày', 'Thu', 'Chi'],
        ['01-01', 90, 30],
        ['01-02', 50, 60],
      ],
      totalExpend: 0,
      totalIncome: 0,
    }
  },
  mounted() {
    this.toast = useToast()
    // Define chart
    this.defineInput()
    
    // Get info
    this.search()
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      switch(variant) {
        case 'success': this.toast.success(content); break;
        case 'danger': this.toast.error(content); break;
        case 'warning': this.toast.warning(content); break;
        default: this.toast.info(content);
      }
    },

    /**
     * Define input
     */
    defineInput() {
      let dateNow = new Date()

      this.year_input = dateNow.getFullYear()
      this.month_input = dateNow.getMonth() + 1
      this.inputs.to_date = dateNow.toJSON().slice(0,10)
      this.inputs.from_date = new Date(dateNow.setDate(dateNow.getDate() - 7)).toJSON().slice(0,10)

      let currentYear = dateNow.getFullYear()
      this.yearOptions = []
      for (let i = currentYear; i > currentYear - 10; i--) {
          this.yearOptions.push({value: i, text: i})
      }
    },

    search() {
      let fromDate = this.inputs.from_date
      let toDate = this.inputs.to_date

      // Handle fromDate, toDate
      if(this.inputs.time_option == 2) {
        fromDate = this.year_input + '-' + this.month_input + '-01'
        toDate = this.year_input + '-' + this.month_input + '-' + new Date(this.year_input, this.month_input, 0).getDate()
      }
      if(this.inputs.time_option == 4) {
        fromDate = this.year_input + '-01-01'
        toDate = this.year_input + '-12-' + new Date(this.year_input, 12, 0).getDate()
      }
      if(this.inputs.time_option == 5) {
        toDate = new Date().toJSON().slice(0,10)
        fromDate = '2000-01-01'
      }
      if(this.inputs.time_option == 6) {
        let dateNow = new Date()
        let dayNow = ((dateNow.getDay() + 6) % 7)
        if(this.week_input == 1) {
          toDate = dateNow.toJSON().slice(0,10)
          fromDate = new Date(dateNow.setDate(dateNow.getDate() - dayNow)).toJSON().slice(0,10)
        } else {
          toDate = new Date(dateNow.setDate(dateNow.getDate() - dayNow - 1)).toJSON().slice(0,10)
          fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6)).toJSON().slice(0,10)
        }
      }
      this.from_date = fromDate
      this.to_date = toDate

      // Get info
      this.getStatisticInfo();
      
      // Get chart
      this.getStatisticChart();
    },

    /**
     * Get today report
     */
    getStatisticInfo() {
      let params = {
        "from_date": this.from_date,
        "to_date": this.to_date
      }
      overViewApi.getStatisticInfo(params).then(res => {
        if(res && res.data && res.data.data) {
          let data = res.data.data
          this.totalExpend = data.total_expend
          this.totalIncome = data.total_income
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get data revenue
     */
    getStatisticChart() {
      let data = {
        "from_date": this.from_date,
        "to_date": this.to_date,
        "time_option": this.inputs.time_option
      }

      overViewApi.getStatisticChart(data).then(res => {
        if(res && res.data && res.data.data) {
          let data = res.data.data
          this.chartData = data.chart_datas
          this.expends = data.list_expends
          this.incomes = data.list_incomes
          this.pieChartExpendData = data.expend_pie_chart_datas
          this.pieChartIncomeData = data.income_pie_chart_datas
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },
    currencyFormat(num) {
      console.log('currencyFormat input:', num)
      let result = null

      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      } else {
        if(num === 0) {
          return 0
        }
      }
      return result
    },
    getRowStyle(name) {
      if (name.includes('Tổng thu')) {
        return 'background-color: #fff7cc; font-weight: bold;'; // vàng nhạt
      }
      if (name.includes('Tổng chi')) {
        return 'background-color: #ffeaea; font-weight: bold;'; // đỏ nhạt
      }
      if (name.includes('Dư tiền mặt')) {
        return 'background-color: #e6f4ea; font-weight: bold;'; // xanh nhạt
      }
      return '';
    },

  }
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

