<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center text-header">Báo Cáo Kết Quả Kinh Doanh</h4>
            <h4 class="text-center text-header">Năm {{year_input}}</h4>
            <hr>
            <b-row>
              <b-col>
                <div class="input-group" style="width: 200px !important;">
                  <span class="pr-3">Năm: </span>
                      <b-form-select :options="yearOptions" v-model="year_input" @change="getData">
                      </b-form-select>
                    </div>
              </b-col>
            </b-row>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <GChart
              type="ColumnChart"
              :data="chartData"
              :options="chartOptions"
            />

            <b-row>
              <b-col md="12">
                <p>Tổng số đơn chưa hoàn thành tạm tính: <b>{{currencyFormat(order_sell_number)}}</b></p>
                <p>Doanh thu đơn chưa hoàn thành tạm tính: <b>{{currencyFormat(order_sell_amount)}}đ</b></p>
              </b-col>
            </b-row>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row v-show="items.length > 0">
              <b-col md="12" class="text-right">
                <download-excel
                  class   = "btn btn-default text-header"
                  :data   = "items"
                  :fields = "excel_fields"
                  worksheet = "Báo cáo tổng quát"
                  name    = "bao_cao_tong_quat.xls">
                  <b>Xuất Excel</b>
                </download-excel>
              </b-col>
            </b-row>

            <b-row class="mt-2 mb-2">
              <b-col md="12" class="table-cus">
                <table class="table table-bordered table-striped fixed_header">
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
                    <tr v-for="(item) in items" v-bind:class="(item.stt + '').includes('.') ? '' : 'bg-row-main'">
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
                </table>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>


  </div>
</template>


<script>
import reportApi from '@/api/report'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      year_input: "2024",
      yearOptions: [],
      chartData: [
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
      ],
      chartOptions: {
        chart: {
          title: 'Biểu đồ kết quả kinh doanh',
          subtitle: 'Biểu đồ kết quả kinh doanh',
        }
      },
      loading: false,
      items: [],
      excel_fields: {
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
      },
      order_sell_number: 0,
      order_sell_amount: 0
    }
  },
  mounted() {
    // Get today day, month, year
    this.prepareDateInput()

    // Get data
    this.getData()

    // Get summary data
    // this.getSummaryData()
  },
  methods: {

    /**
     * Make toast without title
     */
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    prepareDateInput() {
      let dateNow = new Date()
      let currentYear = dateNow.getFullYear()
      this.year_input = currentYear

      this.yearOptions = []
      for (let i = currentYear; i > currentYear - 10; i--) {
        this.yearOptions.push({value: i, text: i})
      }

      this.month_input = dateNow.getMonth() + 1
    },

    /**
     * Search
     */
    getData() {
      this.loading = true

      // Search
        let param = {
          "year": this.year_input
        }
      reportApi.getSummaryReport(param).then(res => {
        if(res && res.data && res.data.data) {
          this.chartData = res.data.data.chart_datas
          this.items = res.data.data.summary_datas
          this.order_sell_number = res.data.data.order_sell_number
          this.order_sell_amount = res.data.data.order_sell_amount
        }

        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loading = false
      })
    },

      /**
   * Currency format
   */
    currencyFormat(num) {
      let result = 0
        if(num == 0) {
          return "0"
        }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

  }
}
</script>


<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }

  .bg-row-main {
    background-color: rgba(0, 0, 0, 0.09) !important;
  }
</style>
