<template>
  <div class="container-fluid">

    <b-row>
      <b-col>

        <b-card>

            <b-row class="mb-2">
              <b-col>
                <h4 class="text-center text-header"><b>Báo Cáo Năm</b></h4>
              </b-col>
            </b-row>
            <b-row class="mb-2">
              <b-col class="text-center">
                <b-form-select :options="yearOptions" v-model="year_input"
                               class="btn-width-200" @change="changeYear"></b-form-select>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="4">
                <b-card
                  border-variant="primary"
                  align="center"
                  style="background-color: rgb(229 249 255)"
                >
                  <h5>Tổng Số Báo Giá</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-clipboard" style="font-size:55px;color:#78B7D0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(totalQuotationNumber)}}</b>
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
                  <h5>Tổng Số Đơn Hàng bán</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-shopping-cart" style="font-size:60px;color:#FFDBB5;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(totalOrderSellNumber)}}</b>
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
                  <h5>Tổng Số Đơn Hoàn Thành</h5>
                  <div class="form-group">
                    <div class="input-group">
                      <i class="fa fa-check" style="font-size:60px;color:#C8A1E0;width:20%;"></i>
                      <div class="text-center" style="width: 75%">
                        <b style="font-size:40px;">{{currencyFormat(totalOrderSellFinishNumber)}}</b>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
            </b-row>
        </b-card>

        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center text-header"><b>Biểu Đồ Doanh Thu Theo Tháng</b></h4>

            <b-row>
              <b-col>
                <GChart
                  type="ColumnChart"
                  :data="chartData"
                  :options="chartOptions"
                />
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>

        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center text-header"><b>Kho Hàng</b></h4>
            <b-row>
              <b-col md="6">
                <b-row>
                  <b-col>
                    <b-card border-variant="primary"
                        header="Số lượng SP tồn kho"
                        header-border-variant="primary"
                        header-text-variant="primary"
                        align="center">
                      <b-card-text>
                        <h5 class="text-center text-header">{{currencyFormat(repo.number_of_product)}}</h5>
                      </b-card-text>
                    </b-card>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-card border-variant="danger"
                        header="Giá trị hàng tồn kho"
                        header-border-variant="danger"
                        header-text-variant="danger"
                        align="center">
                      <b-card-text>
                        <h5 class="text-center text-header">{{currencyFormat(repo.total_price_buy)}}đ</h5>
                      </b-card-text>
                    </b-card>
                  </b-col>
                </b-row>

              </b-col>
              <b-col md="6">
                <p class="text-center"><b>Loại Sản Phẩm chiếm tỉ lệ doanh thu cao nhất</b></p>
                <GChart
                  type="PieChart"
                  :data="chartProductTypeAmount"
                  :options="chartOptions"
                />

              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <p v-for="(item1, index1) in repo.product_type_1_best_sales" :key="item1.product_type_name">
                  {{ (index1 + 1) + '. Loại sản phẩm [' + item1.product_type_name + '] đạt doanh thu: ' + currencyFormat(item1.total_amount_sell) + 'đ , chiếm: ' + item1.percent + '%'}}
                </p>
              </b-col>
              <b-col md="6">
                <p v-for="(item2, index2) in repo.product_type_2_best_sales" :key="item2.product_type_name">
                  {{ (index2 + 4) + '. Loại sản phẩm [' + item2.product_type_name + '] đạt doanh thu: ' + currencyFormat(item2.total_amount_sell) + 'đ , chiếm: ' + item2.percent + '%'}}
                </p>
              </b-col>
            </b-row>

          </b-card-body>
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
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>

      </b-col>
    </b-row>

  </div>
</template>


<script>
import { useToast } from '@/composables/useToast'
import reportAPI from '@/api/report'
import commonFunc from '@/common/commonFunc'
import { GChart } from 'vue-google-charts'

export default {
  components: {
    GChart
  },
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
  data () {
    return {
      yearOptions: [],
      year_input: 2024,
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
        },
        hAxis : {
            textStyle : {
                fontSize: 10 // or the number you want
            }
        },
        vAxis : {
            textStyle : {
                fontSize: 10 // or the number you want
            }
        },
        legend : {
            textStyle : {
                fontSize: 10 // or the number you want
            }
        },
      },
      chartProductTypeAmount: [
        ["Loại SP", "Doanh thu"],
        ["Loại 1", 0]
      ],
      totalQuotationNumber: 0,
      totalOrderSellNumber: 0,
      totalOrderSellFinishNumber: 0,
      repo: {
          "number_of_product": 0,
          "total_price_buy": 0,
          "product_type_1_best_sales": [],
          "product_type_2_best_sales": []
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
    // Define default value for from data, to date
    this.defineInput()

    // Get over view
    this.getOverView()

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
     * Define input
     */
    defineInput() {
      let currentYear = new Date().getFullYear()
      this.year_input = currentYear

      this.yearOptions = []
      for (let i = currentYear; i > currentYear - 10; i--) {
          this.yearOptions.push({value: i, text: i})
      }
    },

    /**
     * Get today report
     */
    getOverView() {
      reportAPI.getOverView({year: this.year_input}).then(res => {
        if(res && res.data && res.data.data) {
          let data = res.data.data
          this.totalQuotationNumber = data.total_quotation_number
          this.totalOrderSellNumber = data.total_order_sell_number
          this.totalOrderSellFinishNumber = data.total_order_sell_finish_number
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get data revenue
     */
    getRevenue() {
      reportAPI.getSummaryReport({"year": this.year_input}).then(res => {
        if(res && res.data && res.data.data) {
          this.chartData = res.data.data.chart_datas
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })

      // reportAPI.getRevenue({"year": this.year_input}).then(res => {
      //   if(res && res.data && res.data.data) {
      //     this.chartData = res.data.data
      //   }
      //
      // }).catch(err => {
      //   // Handle error
      //   let errorMess = commonFunc.handleStaffError(err)
      //   this.popToast('danger', errorMess)
      // })
    },

    /**
     * Get data repository overview
     */
    getRepository() {
      reportAPI.getRepositoryOverview().then(res => {
        if(res && res.data && res.data.data) {
          let repo_infos = res.data.data

          if(repo_infos) {
            this.repo.number_of_product = repo_infos.number_of_product
            this.repo.total_price_buy = repo_infos.total_price_buy

            // let product_type_best_sales = repo_infos.product_type_best_sales
            this.chartProductTypeAmount = repo_infos.product_type_best_sales
            // if(product_type_best_sales.length > 3) {
            //   this.repo.product_type_1_best_sales = product_type_best_sales.slice(0, 3)
            //   this.repo.product_type_2_best_sales = product_type_best_sales.slice(3, product_type_best_sales.length)
            // } else {
            //   this.repo.product_type_1_best_sales = product_type_best_sales
            //   this.repo.product_type_2_best_sales = []
            // }
          }
        }

      }).catch(err => {
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
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      changeYear() {
        this.getOverView()
        this.getRevenue()
      },

    /**
   * Currency format
   */
    currencyFormat(num) {
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

