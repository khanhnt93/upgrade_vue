<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center text-header">Báo Cáo Hiệu Quả Kinh Doanh</h4>

            <b-row class="form-row">

              <b-col md="3">
                <label>Thời gian</label>
                <b-form-select :options="timeOptions" v-model="time_option" ></b-form-select>
              </b-col>

              <b-col md="3">
                <label v-show="time_option != 5"> {{time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
                <!--Thời gian theo ngày-->
                <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
                <!--Thời gian năm-->
                <b-form-select v-show="time_option != 1 && time_option != 5" :options="yearOptions" v-model="year_input"></b-form-select>
              </b-col>

              <b-col md="3">
                <label v-show="time_option == 1 || time_option == 2 || time_option == 3">
                  {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
                </label>

                <!--Thời gian theo ngày-->
                <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

                <!--Thời gian tháng -->
                <b-form-select v-show="time_option == 2" :options="monthOptions" v-model="month_input"></b-form-select>

                <!--Thời gian quý -->
                <b-form-select v-show="time_option == 3" :options="quarterOptions" v-model="quarter_input"></b-form-select>
              </b-col>

              <b-col md="3">
                <label>Nhân viên</label>
                <multiselect
                  v-model="inputs.staff_in_charge"
                  :options="optionsStaff"
                  :loading="loadingOptions"
                  :select-label="''"
                  :deselect-label="''"
                  placeholder="--Tất cả--"
                  label="text"
                  track-by="text">
                </multiselect>
                </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12">
                <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                          @click.prevent="search">
                  Tìm Kiếm
                </b-button>
              </b-col>
            </b-row>

            <b-row v-bind:class="loadingCustomerReport ? 'bg-secondary' : ''">
              <b-col>
                <h5 class="text-header">Khách hàng</h5>
                <p>Tổng Số lượng khách hàng: {{currencyFormat(customer_report.total)}}</p>
                <p>Tổng số lượng khách hàng mới: {{currencyFormat(customer_report.total_new)}}</p>
                <p>Tổng số lượng khách hàng cũ: {{currencyFormat(customer_report.total_old)}}</p>
              </b-col>
            </b-row>

            <b-row v-bind:class="loadingQuotationReport ? 'bg-secondary' : ''">
              <b-col class="mt-3">
                <h5 class="text-header">Báo cáo báo giá</h5>
              </b-col>
            </b-row>

            <b-row v-bind:class="loadingQuotationReport ? 'bg-secondary' : ''">
              <b-col md="4">
                <p>Tổng giá trị báo giá: {{currencyFormat(quotation_report.total_amount)}}</p>
                <p>Tổng số báo giá: {{currencyFormat(quotation_report.total_number)}}</p>
              </b-col>
              <b-col md="4">
                <p>Số lương BG thành công: {{currencyFormat(quotation_report.total_success)}}</p>
                <p>Số lương BG thất bại: {{currencyFormat(quotation_report.total_fail)}}</p>
                <p>Số lương BG chờ: {{currencyFormat(quotation_report.total_waiting)}}</p>
              </b-col>
              <b-col md="4">
                <p>Tỉ lệ BG thành công: {{quotation_report.percent_success}}%</p>
                <p>Tỉ lệ BG thất bại: {{quotation_report.percent_fail}}%</p>
                <p>Tỉ lệ BG chờ: {{quotation_report.percent_waiting}}%</p>
              </b-col>
            </b-row>

            <b-row v-bind:class="loadingQuotationDetailReport ? 'bg-secondary' : ''">
              <b-col md="4" class="mt-2 table-cus" :style="{ height: max_table_height + 'px; overflow-y: auto; overflow-x: auto;'}">
                <p>Tổng giá trị báo giá (chưa VAT) theo nhóm sản phẩm</p>
                <table class="table table-bordered table-striped fixed_header">
                    <tr>
                      <th style="width:25%">Nhóm SP</th>
                      <th style="width:25%">Tổng giá trị BG</th>
                      <th style="width:25%">Thành công</th>
                      <th style="width:25%">Thất bại</th>
                    </tr>
                    <tr v-for="(item) in quotation_detail_report.group_products" :key="item.name">
                      <td>{{item.name}}</td>
                      <td class="text-right">{{currencyFormat(item.total)}}</td>
                      <td class="text-right">{{currencyFormat(item.total_success)}}</td>
                      <td class="text-right">{{currencyFormat(item.total_fail)}}</td>
                    </tr>
                </table>
                <b-row v-show="quotation_detail_report.group_products_full_item.length > show_more_item">
                  <b-col class="text-center">
                    <button class="button-like-a btn-width-220" @click="showMoreQuotationDetailReportGroupProduct()">
                      {{quotation_detail_report.group_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
                    </button>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="4" class="mt-2 table-cus" :style="{ height: max_table_height + 'px; overflow-y: auto; overflow-x: auto;'}">
                <p>Tổng giá trị báo giá (chưa VAT) theo loại sản phẩm</p>
                <table class="table table-bordered table-striped fixed_header">
                    <tr>
                      <th style="width:25%">Loại SP</th>
                      <th style="width:25%">Tổng giá trị BG</th>
                      <th style="width:25%">Thành công</th>
                      <th style="width:25%">Thất bại</th>
                    </tr>
                    <tr v-for="(item) in quotation_detail_report.type_products" :key="item.name">
                      <td>{{item.name}}</td>
                      <td class="text-right">{{currencyFormat(item.total)}}</td>
                      <td class="text-right">{{currencyFormat(item.total_success)}}</td>
                      <td class="text-right">{{currencyFormat(item.total_fail)}}</td>
                    </tr>
                </table>
                <b-row v-show="quotation_detail_report.type_products_full_item.length > show_more_item">
                  <b-col class="text-center">
                    <button class="button-like-a btn-width-220" @click="showMoreQuotationDetailReportTypeProduct()">
                      {{quotation_detail_report.type_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
                    </button>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="4" class="mt-2 table-cus" :style="{ height: max_table_height + 'px; overflow-y: auto; overflow-x: auto;'}">
                <p>Tổng giá trị báo giá (chưa VAT) theo hãng sản phẩm</p>
                <table class="table table-bordered table-striped fixed_header">
                    <tr>
                      <th style="width:25%">Hãng SP</th>
                      <th style="width:25%">Tổng giá trị BG</th>
                      <th style="width:25%">Thành công</th>
                      <th style="width:25%">Thất bại</th>
                    </tr>
                    <tr v-for="(item) in quotation_detail_report.brand_products" :key="item.name">
                      <td>{{item.name}}</td>
                      <td class="text-right">{{currencyFormat(item.total)}}</td>
                      <td class="text-right">{{currencyFormat(item.total_success)}}</td>
                      <td class="text-right">{{currencyFormat(item.total_fail)}}</td>
                    </tr>
                </table>
                <b-row v-show="quotation_detail_report.brand_products_full_item.length > 10">
                  <b-col class="text-center">
                    <button class="button-like-a btn-width-220"
                      @click="showMoreQuotationDetailReportBrandProduct()">
                      {{quotation_detail_report.brand_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
                    </button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row v-bind:class="loadingQuotationCareReport ? 'bg-secondary' : ''">
              <b-col class="mt-3">
                <h5 class="text-header">Chăm sóc báo giá</h5>
                <p>Tỉ lệ chăm sóc khách hàng lần 1 đúng hạn: {{quotation_care_report.percent_care_1}}%</p>
                <p>Tỉ lệ chăm sóc khách hàng lần 2 đúng hạn: {{quotation_care_report.percent_care_2}}%</p>
              </b-col>
            </b-row>

            <b-row v-bind:class="loadingRevenueProfitReport ? 'bg-secondary' : ''">
              <b-col class="mt-3">
                <h5 class="text-header">Doanh Thu</h5>
                <p>Tổng doanh thu: {{currencyFormat(revenue_profit.revenue)}}</p>
                <p>Tổng lợi nhuận: {{currencyFormat(revenue_profit.profit)}}</p>
              </b-col>
            </b-row>

            <b-row v-bind:class="loadingRevenueProfitReport ? 'bg-secondary' : ''">
              <b-col md="4" class="mt-2 table-cus" :style="{ height: max_table_height + 'px; overflow-y: auto; overflow-x: auto;'}">
                <p>Doanh thu/lợi nhuận theo nhóm sp</p>
                <table class="table table-bordered table-striped fixed_header">
                    <tr>
                      <th style="width:40%">Nhóm sp</th>
                      <th style="width:30%">Doanh thu</th>
                      <th style="width:30%">Lợi nhuận</th>
                    </tr>
                    <tr v-for="(item) in revenue_profit_detail_report.group_products" :key="item.name">
                      <td>{{item.name}}</td>
                      <td class="text-right">{{currencyFormat(item.revenue)}}</td>
                      <td class="text-right">{{currencyFormat(item.profit)}}</td>
                    </tr>
                </table>
                <b-row v-show="revenue_profit_detail_report.group_products_full_item.length > show_more_item">
                  <b-col class="text-center">
                    <button class="button-like-a btn-width-220" @click="showMoreRevenueProfitDetailReportGroupProduct()">
                      {{revenue_profit_detail_report.group_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
                    </button>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="4" class="mt-2 table-cus" :style="{ height: max_table_height + 'px; overflow-y: auto; overflow-x: auto;'}">
                <p>Doanh thu/lợi nhuận theo loại sp</p>
                <table class="table table-bordered table-striped fixed_header">
                    <tr>
                      <th style="width:40%">Loại sp</th>
                      <th style="width:30%">Doanh thu</th>
                      <th style="width:30%">Lợi nhuận</th>
                    </tr>
                    <tr v-for="(item) in revenue_profit_detail_report.type_products" :key="item.name">
                      <td>{{item.name}}</td>
                      <td class="text-right">{{currencyFormat(item.revenue)}}</td>
                      <td class="text-right">{{currencyFormat(item.profit)}}</td>
                    </tr>
                </table>
                <b-row v-show="revenue_profit_detail_report.type_products_full_item.length > show_more_item">
                  <b-col class="text-center">
                    <button class="button-like-a btn-width-220" @click="showMoreRevenueProfitDetailReportTypeProduct()">
                      {{revenue_profit_detail_report.type_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
                    </button>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="4" class="mt-2 table-cus" :style="{ height: max_table_height + 'px; overflow-y: auto; overflow-x: auto;'}">
                <p>Doanh thu/lợi nhuận theo hãng sp</p>
                <table class="table table-bordered table-striped fixed_header">
                    <tr>
                      <th style="width:40%">Hãng sp</th>
                      <th style="width:30%">Doanh thu</th>
                      <th style="width:30%">Lợi nhuận</th>
                    </tr>
                    <tr v-for="(item) in revenue_profit_detail_report.brand_products" :key="item.name">
                      <td>{{item.name}}</td>
                      <td class="text-right">{{currencyFormat(item.revenue)}}</td>
                      <td class="text-right">{{currencyFormat(item.profit)}}</td>
                    </tr>
                </table>
                <b-row v-show="revenue_profit_detail_report.brand_products_full_item.length > show_more_item">
                  <b-col class="text-center">
                    <button class="button-like-a btn-width-220" @click="showMoreRevenueProfitDetailReportBrandProduct()">
                      {{revenue_profit_detail_report.brand_products_show_extra ? 'Thu gọn' : 'Xem thêm'}}
                    </button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row v-bind:class="loadingRevenueProfitReport ? 'bg-secondary' : ''">
              <b-col class="mt-3">
                <h5 class="text-header">Chi Phí bán hàng</h5>
                <p>
                  Tổng chi phí bán hàng: {{currencyFormat(expend.total)}}
                  <button class="button-like-a btn-width-220" @click="goToExpendReport()">Xem chi tiết</button>
                </p>
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
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      timeOptions: [
        {"value": 1, "text": 'Ngày'},
        {"value": 2, "text": 'Tháng'},
        {"value": 3, "text": 'Quý'},
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
      time_option: 1,
      year_input: 2024,
      quarter_input: 1,
      month_input: 1,
      inputs: {
        staff_in_charge: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      loadingOptions: false,
      optionsStaff: [],
      onSearch: false,
      loadingCustomerReport: false,
      customer_report: {
        total: 0,
        total_new: 0,
        total_old: 0
      },
      loadingQuotationReport: false,
      quotation_report: {
        total_amount: 0,
        total_number: 0,
        total_success: 0,
        total_fail: 0,
        total_waiting: 0,
        percent_success: 0,
        percent_fail: 0,
        percent_waiting: 0
      },
      loadingQuotationDetailReport: false,
      quotation_detail_report: {
        group_products: [],
        group_products_10_item: [],
        group_products_full_item: [],
        group_products_show_extra: false,
        type_products: [],
        type_products_10_item: [],
        type_products_full_item: [],
        type_products_show_extra: false,
        brand_products: [],
        brand_products_10_item: [],
        brand_products_full_item: [],
        brand_products_show_extra: false,
      },
      loadingQuotationCareReport: false,
      quotation_care_report: {
        percent_care_1: 0,
        percent_care_2: 0
      },
      loadingRevenueProfitReport: false,
      revenue_profit: {
        revenue: 0,
        profit: 0
      },
      // loadingRevenueProfitDetailReport: false,
      revenue_profit_detail_report: {
        group_products: [],
        group_products_10_item: [],
        group_products_full_item: [],
        group_products_show_extra: false,
        type_products: [],
        type_products_10_item: [],
        type_products_full_item: [],
        type_products_show_extra: false,
        brand_products: [],
        brand_products_10_item: [],
        brand_products_full_item: [],
        brand_products_show_extra: false,
      },
      // loadingExpendReport: false,
      expend: {
        total: 0
      },
      max_table_height: 500,
      show_more_item: 10
    }
  },
  mounted() {
    let height = screen.height;
    if(height && height > 500) {
      this.max_table_height = Math.round(height / 2)
    }

    // Get default from date and to date
    this.prepareDateInput()

    // Get danh sách nhân viên
    this.getOptionRelated()

    // Tìm kiếm
    this.search()
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
      this.inputs.to_date = dateNow.toJSON().slice(0,10)
      this.inputs.from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
      let currentYear = new Date().getFullYear()
      this.year_input = currentYear
      this.yearOptions = []
      for (let i = currentYear; i > currentYear - 10; i--) {
          this.yearOptions.push({value: i, text: i})
      }

      this.month_input = dateNow.getMonth() + 1
    },

    /**
     * Get options related repository
     */
    getOptionRelated() {
      this.loadingOptions = true

      let params = {
        'staffs': true
      }

      reportApi.getOptionsRelatedReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.optionsStaff = options.staffs
          this.optionsStaff.unshift({value: null, text: "-- Tất cả --"})
        }
        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    search() {
      if(this.onSearch) {
        return
      }

      this.onSearch = true

      let fromDate = this.inputs.from_date
      let toDate = this.inputs.to_date

      // Handle fromDate, toDate
      if(this.time_option == 2) {
        fromDate = this.year_input + '-' + this.month_input + '-01'
        toDate = this.year_input + '-' + this.month_input + '-' + new Date(this.year_input, this.month_input, 0).getDate()
      }
      if(this.time_option == 3) {
          let quarter = commonFunc.getMonthByQuarter(this.quarter_input)
        fromDate = this.year_input + '-' + quarter + '-01'
        toDate = this.year_input + '-' + (quarter + 2) + '-' + new Date(this.year_input, (quarter + 2), 0).getDate()
      }
      if(this.time_option == 4) {
        fromDate = this.year_input + '-01-01'
        toDate = this.year_input + '-12-' + new Date(this.year_input, 12, 0).getDate()
      }
      if(this.time_option == 5) {
        toDate = new Date().toJSON().slice(0,10)
        fromDate = '2000-01-01'
      }

      let params = {
        "staff_in_charge": this.inputs.staff_in_charge && this.inputs.staff_in_charge.value ? this.inputs.staff_in_charge.value : null,
        "from_date": fromDate,
        "to_date": toDate
      }

      // Lấy báo cáo khách hàng
      this.getCustomerReport(params)

      // Lấy báo cáo báo giá
      this.getQuotationReport(params)

      // Lấy báo cáo báo giá chi tiết
      this.getQuotationDetailReport(params)

      // Lấy báo cáo chăm sóc báo giá
      this.getQuotationCareReport(params)

      // Lấy báo cáo doanh thu, lợi nhuận
      this.getRevenueProfitReport(params)

      // // Lấy báo cáo doanh thu, lợi nhuận chi tiết
      // this.getRevenueProfitDetailReport(params)
      //
      // // Lấy báo cáo chi phí
      // this.getExpendReport(params)
    },

    /**
     * Lấy báo cáo khách hàng
     */
    getCustomerReport(params) {
      this.loadingCustomerReport = true

      reportApi.getPerformanceCustomerReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.customer_report = res.data.data
        }
        this.loadingCustomerReport = false
      }).catch(err => {
        this.loadingCustomerReport = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Lấy báo cáo báo giá
     */
    getQuotationReport(params) {
      this.loadingQuotationReport = true

      reportApi.getPerformanceQuotationReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.quotation_report = res.data.data
        }
        this.loadingQuotationReport = false
      }).catch(err => {
        this.loadingQuotationReport = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Lấy báo cáo báo giá chi tiết
     */
    getQuotationDetailReport(params) {
      this.loadingQuotationDetailReport = true

      reportApi.getPerformanceQuotationDetailReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
            let data = JSON.parse(JSON.stringify(res.data.data))

          let group_products = data.group_products
          this.quotation_detail_report.group_products_full_item = group_products
          let group_products_10_item = JSON.parse(JSON.stringify(group_products.slice(0, this.show_more_item)))
          this.quotation_detail_report.group_products_10_item = group_products_10_item
          this.quotation_detail_report.group_products = group_products_10_item

          let type_products = data.type_products
          this.quotation_detail_report.type_products_full_item = type_products
          let type_products_10_item = JSON.parse(JSON.stringify(type_products.slice(0, this.show_more_item)))
          this.quotation_detail_report.type_products_10_item = type_products_10_item
          this.quotation_detail_report.type_products = type_products_10_item

          let brand_products = data.brand_products
          this.quotation_detail_report.brand_products_full_item = brand_products
          let brand_products_10_item = JSON.parse(JSON.stringify(brand_products.slice(0, this.show_more_item)))
          this.quotation_detail_report.brand_products_10_item = brand_products_10_item
          this.quotation_detail_report.brand_products = brand_products_10_item
        }
        this.loadingQuotationDetailReport = false
      }).catch(err => {
        this.loadingQuotationDetailReport = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Lấy báo cáo chăm sóc báo giá
     */
    getQuotationCareReport(params) {
      this.loadingQuotationCareReport = true

      reportApi.getPerformanceQuotationCareReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.quotation_care_report = res.data.data
        }
        this.loadingQuotationCareReport = false
      }).catch(err => {
        this.loadingQuotationCareReport = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Lấy báo cáo doanh thu, lợi nhuận
     */
    getRevenueProfitReport(params) {
      this.loadingRevenueProfitReport = true

      reportApi.getPerformanceRevenueProfitReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let data = res.data.data
          this.revenue_profit.revenue = data.revenue
          this.revenue_profit.profit = data.profit
          this.expend.total = data.expend

          let group_products = data.group_products
          this.revenue_profit_detail_report.group_products_full_item = group_products
          let group_products_10_item = JSON.parse(JSON.stringify(group_products.slice(0, this.show_more_item)))
          this.revenue_profit_detail_report.group_products_10_item = group_products_10_item
          this.revenue_profit_detail_report.group_products = group_products_10_item

          let type_products = data.type_products
          this.revenue_profit_detail_report.type_products_full_item = type_products
          let type_products_10_item = JSON.parse(JSON.stringify(type_products.slice(0, this.show_more_item)))
          this.revenue_profit_detail_report.type_products_10_item = type_products_10_item
          this.revenue_profit_detail_report.type_products = type_products_10_item

          let brand_products = data.brand_products
          this.revenue_profit_detail_report.brand_products_full_item = brand_products
          let brand_products_10_item = JSON.parse(JSON.stringify(brand_products.slice(0, this.show_more_item)))
          this.revenue_profit_detail_report.brand_products_10_item = brand_products_10_item
          this.revenue_profit_detail_report.brand_products = brand_products_10_item


          // this.revenue_profit_detail_report.group_products = data.group_products
          // this.revenue_profit_detail_report.type_products = data.type_products
          // this.revenue_profit_detail_report.brand_products = data.brand_products
        }
        this.loadingRevenueProfitReport = false

        this.onSearch = false
      }).catch(err => {
        this.onSearch = false
        this.loadingRevenueProfitReport = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    goToExpendReport() {
      const routeData = this.$router.resolve(
          {name: 'Báo cáo chi phí',
              query: {from_date: new Date(this.inputs.from_date).toJSON().slice(0,10),
                  to_date: new Date(this.inputs.to_date).toJSON().slice(0,10),
                  staff_id: this.inputs.staff_in_charge && this.inputs.staff_in_charge.value ? this.inputs.staff_in_charge.value : null
              }
          })
      window.open(routeData.href, '_blank');
    },

      showMoreQuotationDetailReportGroupProduct() {
        if(!this.quotation_detail_report.group_products_show_extra) {
            this.quotation_detail_report.group_products = this.quotation_detail_report.group_products_full_item
            this.quotation_detail_report.group_products_show_extra = true
        } else {
            this.quotation_detail_report.group_products = this.quotation_detail_report.group_products_10_item
            this.quotation_detail_report.group_products_show_extra = false
        }
      },
      showMoreQuotationDetailReportTypeProduct() {
        if(!this.quotation_detail_report.type_products_show_extra) {
            this.quotation_detail_report.type_products = this.quotation_detail_report.type_products_full_item
            this.quotation_detail_report.type_products_show_extra = true
        } else {
            this.quotation_detail_report.type_products = this.quotation_detail_report.type_products_10_item
            this.quotation_detail_report.type_products_show_extra = false
        }
      },

      showMoreQuotationDetailReportBrandProduct() {
        if(!this.quotation_detail_report.brand_products_show_extra) {
            this.quotation_detail_report.brand_products = this.quotation_detail_report.brand_products_full_item
            this.quotation_detail_report.brand_products_show_extra = true
        } else {
            this.quotation_detail_report.brand_products = this.quotation_detail_report.brand_products_10_item
            this.quotation_detail_report.brand_products_show_extra = false
        }
      },

      showMoreRevenueProfitDetailReportGroupProduct() {
        if(!this.revenue_profit_detail_report.group_products_show_extra) {
            this.revenue_profit_detail_report.group_products = this.revenue_profit_detail_report.group_products_full_item
            this.revenue_profit_detail_report.group_products_show_extra = true
        } else {
            this.revenue_profit_detail_report.group_products = this.revenue_profit_detail_report.group_products_10_item
            this.revenue_profit_detail_report.group_products_show_extra = false
        }
      },
      showMoreRevenueProfitDetailReportTypeProduct() {
        if(!this.revenue_profit_detail_report.type_products_show_extra) {
            this.revenue_profit_detail_report.type_products = this.revenue_profit_detail_report.type_products_full_item
            this.revenue_profit_detail_report.type_products_show_extra = true
        } else {
            this.revenue_profit_detail_report.type_products = this.revenue_profit_detail_report.type_products_10_item
            this.revenue_profit_detail_report.type_products_show_extra = false
        }
      },

      showMoreRevenueProfitDetailReportBrandProduct() {
        if(!this.revenue_profit_detail_report.brand_products_show_extra) {
            this.revenue_profit_detail_report.brand_products = this.revenue_profit_detail_report.brand_products_full_item
            this.revenue_profit_detail_report.brand_products_show_extra = true
        } else {
            this.revenue_profit_detail_report.brand_products = this.revenue_profit_detail_report.brand_products_10_item
            this.revenue_profit_detail_report.brand_products_show_extra = false
        }
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
  .button-like-a {
    background: none!important;
    border: none;
    padding: 0!important;
    font-family: arial, sans-serif;
    color: #069;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
