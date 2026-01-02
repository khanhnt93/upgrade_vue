<template>
  <div class="container-fluid">

    <b-row>
      <b-col>

        <b-card>

            <b-row class="mb-2">
              <b-col>
                <h4 class="text-center text-header"><b>Hôm Nay</b></h4>
              </b-col>
            </b-row>

          <b-row>
              <b-col md="4">
                <b-card
                  border-variant="primary"
                  align="center"
                  style="background-color: rgb(229 249 255)"
                >
                  <h5>Số bill</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-clipboard" style="font-size:55px;color:#78B7D0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(todayBillNumber)}}</b>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
              <b-col md="4">
                <b-card
                  border-variant="primary"
                  align="center"
                  style="background-color: rgb(255 237 229)"
                >
                  <h5>Doanh thu</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-plus" style="font-size:60px;color:#FFDBB5;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(todayRevenue)}}</b>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
              <b-col md="4">
                <b-card
                  border-variant="primary"
                  align="center"
                  style="background-color: rgb(234 229 255)"
                >
                  <h5>Lợi nhuận</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-check" style="font-size:60px;color:#C8A1E0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(todayProfit)}}</b>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
            </b-row>

        </b-card>


        <b-card>
            <h4 class="text-center text-header"><b>Biểu Đồ Doanh Thu</b></h4>

            <b-row>
              <b-col>
                <GChart
                  type="ColumnChart"
                  :data="chartRevenueData"
                  :options="chartOptions"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col class="text-center">
                <a href="/chart-revenue">Xem nhiều hơn</a>
              </b-col>
            </b-row>

        </b-card>

        <b-card>
            <h4 class="text-center text-header"><b>Kho Hàng</b></h4>

            <b-row>
              <b-col md="3">
                <b-card border-variant="secondary"
                        header="Số Loại Sản Phẩm"
                        header-border-variant="secondary"
                        header-text-variant="secondary"
                        align="center">
                  <b-card-text>
                    <h5 class="text-center text-header">{{currencyFormat(repo.number_of_product)}}</h5>
                  </b-card-text>
                </b-card>

              </b-col>
              <b-col md="3">
                <b-card border-variant="secondary"
                        header="Tổng Tiền Mua"
                        header-border-variant="secondary"
                        header-text-variant="secondary"
                        align="center">
                  <b-card-text>
                    <h5 class="text-center text-header">{{currencyFormat(repo.total_price_buy)}}đ</h5>
                  </b-card-text>
                </b-card>

              </b-col>
              <b-col md="3">
                <b-card border-variant="secondary"
                        header="Tổng Tiền Bán (dự tính)"
                        header-border-variant="secondary"
                        header-text-variant="secondary"
                        align="center">
                  <b-card-text>
                    <h5 class="text-center text-header">{{currencyFormat(repo.total_price_sell)}}đ</h5>
                  </b-card-text>
                </b-card>

              </b-col>
              <b-col md="3">
                <b-card border-variant="secondary"
                        header="Lợi nhuận (dự tính)"
                        header-border-variant="secondary"
                        header-text-variant="secondary"
                        align="center">
                  <b-card-text>
                    <h5 class="text-center text-header">{{currencyFormat(repo.total_price_sell - repo.total_price_buy)}}đ</h5>
                  </b-card-text>
                </b-card>

              </b-col>
            </b-row>

            <b-row>
              <b-col class="text-center">
                <a href="/repo-report">Xem nhiều hơn</a>
              </b-col>
            </b-row>
        </b-card>

        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center text-header"><b>Nợ công - Công nợ</b></h4>

            <b-row>
              <b-col md="6">
                <b-card border-variant="success"
                  header="Công nợ (Nợ cần thu hồi)"
                  header-border-variant="success"
                  header-text-variant="success"
                  align="center">
                  <b-card-text>
                    <h5 class="text-center text-success">Tổng công nợ: {{currencyFormat(debt_total)}}đ</h5>
                    - Số lượng công nợ sắp đến hạn thu hồi: {{currencyFormat(debt_number)}}<br>
                    - Tổng tiền công nợ sắp đến hạn thu hồi: <span class="text-success"><b>{{currencyFormat(debt_amount)}}đ</b></span>
                  </b-card-text>
                </b-card>

                <b-row>
                  <b-col class="text-center">
                    <a href="/debt">Xem nhiều hơn</a>
                  </b-col>
                </b-row>

              </b-col>
              <b-col md="6">
                <b-card border-variant="danger"
                  header="Nợ công (Nợ phải trả)"
                  header-border-variant="danger"
                  header-text-variant="danger"
                  align="center">
                  <b-card-text>
                    <h5 class="text-center text-header">Tổng nợ công: {{currencyFormat(public_debt_total)}}đ</h5>
                    - Số lượng nợ công sắp đến hạn trả: {{currencyFormat(public_debt_number)}}<br>
                    - Tổng tiền nợ công sắp đến hạn trả: <span class="text-header"><b>{{currencyFormat(public_debt_amount)}}đ</b></span>
                  </b-card-text>
                </b-card>

                <b-row>
                  <b-col class="text-center">
                    <a href="/public-debt">Xem nhiều hơn</a>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>

      </b-col>
    </b-row>

  </div>
</template>


<script>
import reportAPI from '@/api/report'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'

export default {
  components: {
    GChart
  },
  data () {
    return {
      chartRevenueData: [
        ["Thời gian", "Doanh thu"],
        ["Hôm qua ", 0],
        ["Hôm nay", 0],
      ],
      chartOptions: {
        chart: {
          title: 'Biểu đồ doanh thu',
          subtitle: 'Biểu đồ doanh thu',
        },
        responsive: false,
        maintainAspectRatio: true
      },
      fromDay: null,
      toDay: null,
      todayBillNumber: 0,
      todayRevenue: 0,
      todayProfit: 0,
      repo: {
          "number_of_product": 0,
          "total_price_buy": 0,
          "total_price_sell": 0
      },
      debt_total: 0,
      debt_number: 0,
      debt_amount: 0,
      public_debt_total: 0,
      public_debt_number: 0,
      public_debt_amount: 0
    }
  },
  mounted() {
    // Get over view
    this.getOverView()

    // Define default value for from data, to date
    this.defineInput()

    // Doanh thu
    this.getRevenue()

    // Lợi nhuận
    // this.getProfit()

    // Kho hàng
    this.getRepository()

    // CÔng nợ, nợ công
    this.getDebtAndPublicDebt()
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

    /**
     * Define input
     */
    defineInput() {
      let dateNow = new Date()

      // Day
      this.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
      let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
      this.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
    },

    /**
     * Get list day
     */
    getListDay() {
      let result = []

      for (let i = 6; i >= 0; i--) {
        let dateNow = new Date()
        let dateTemp = new Date(dateNow.setDate(dateNow.getDate() - i))
        dateTemp = commonFunc.formatDate(dateTemp.toJSON().slice(0,10)).substring(0, 5)
        result.push(dateTemp)
      }
      return result
    },

    /**
     * Handle day date
     */
    handleRevenueData(data) {
      let chartData = [
        ["Time", "Doanh thu"]
      ]
      let listDay = this.getListDay()
      for (let i in listDay) {
        let item = [listDay[i], 0]
        for (let j in data) {
          if(listDay[i] == data[j].time) {
            item[1] = data[j].revenue
            break
          }
        }

        chartData.push(item)
      }
      this.chartRevenueData = chartData
    },

    /**
     * Get today report
     */
    getOverView() {
      reportAPI.getOverView().then(res => {
        if(res && res.data && res.data.data) {
          let data = res.data.data
          this.todayBillNumber = data.bill_number
          this.todayRevenue = data.reveneu
          this.todayProfit = data.profit
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      /**
     * Get list date from date input
     */
    getListDateFromDateInput() {
      let result = []

      let fromDate = new Date(this.fromDate)
        let toDate = new Date(this.toDate)
        while(fromDate <= toDate) {
          let dateTemp = commonFunc.formatDate(fromDate.toJSON().slice(0,10)).substring(0, 5)
          result.push(dateTemp)
          fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1))
        }

      return result
    },

    /**
     * Get data revenue
     */
    getRevenue() {
      let params = {
        "chartBy" : "Day",
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.toDate),
        "fromMonth": "",
        "toMonth": "",
        "listDay": this.getListDay()
      }

      // Search
      reportAPI.getRevenue(params).then(res => {
        if(res && res.data && res.data.data) {
          this.handleRevenueData(res.data.data)
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get data repository overview
     */
    getRepository() {
      reportAPI.getRepositoryOverview().then(res => {
        if(res && res.data && res.data.data) {
          this.repo = res.data.data
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get data repository overview
     */
    getDebtAndPublicDebt() {
      reportAPI.getDebtAndPublicDebtOverview().then(res => {
        if(res && res.data && res.data.data) {
          let data = res.data.data
          this.debt_total = data.debt_total
          this.debt_number = data.debt_forewarning_number
          this.debt_amount = data.debt_forewarning_amount
          this.public_debt_total = data.public_debt_total
          this.public_debt_number = data.public_debt_forewarning_number
          this.public_debt_amount = data.public_debt_forewarning_amount
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = null

      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      } else {
        if(num == 0) {
          return 0
        }
      }
      return result
    },

  }
}
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

