<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center text-header">Báo Cáo Doanh Thu - Lợi Nhuận Chi Tiết</h4>
            <b-row class="form-row">

            <b-col md="2">
              <label>Thời gian</label>
              <b-form-select :options="timeOptions" v-model="time_option" ></b-form-select>
            </b-col>

            <b-col md="2">
              <label> {{time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              <!--Thời gian năm-->
              <b-form-select v-show="time_option != 1" :options="yearOptions" v-model="year_input"></b-form-select>
            </b-col>

            <b-col md="2">
              <label v-show="time_option != 4"> {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }} </label>

              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

              <!--Thời gian tháng -->
              <b-form-select v-show="time_option == 2" :options="monthOptions" v-model="month_input"></b-form-select>

              <!--Thời gian quý -->
              <b-form-select v-show="time_option == 3" :options="quarterOptions" v-model="quarter_input"></b-form-select>
            </b-col>

            <b-col md="3">
              <label>Nhóm SP</label>
              <multiselect
                v-model="productGroupSelect"
                :options="productGroupOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn nhóm sản phẩm--"
                label="name"
                track-by="name"
                @input="changeProductGroup">
              </multiselect>
            </b-col>
            <b-col md="3">
              <label>Loại SP</label>
              <multiselect
                v-model="productTypeSelect"
                :options="productTypeOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn loại sản phẩm--"
                label="name"
                track-by="name">
              </multiselect>
            </b-col>
          </b-row>

            <b-row class="form-row">
              <b-col md="3">
                <label>Số ĐH bán</label>
                <input
                id="order_sell_number"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.order_sell_number">
              </b-col>
              <b-col md="3">
                <label>Hãng SP</label>
                <multiselect
                  v-model="productBrandSelect"
                  :options="productBrandOptions"
                  :loading="loadingOptions"
                  :select-label="''"
                  :deselect-label="''"
                  placeholder="--Chọn hãng SP--"
                  label="text"
                  track-by="text">
                </multiselect>
              </b-col>
              <b-col md="3">
                <label>Mã SP</label>
                <input
                  id="codeProductCus"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.product_code"
                  maxlength="255">
              </b-col>
              <b-col md="3">
                <label>Nhân viên</label>
                <b-form-select
                  id="created_by"
                  :options="optionsStaff"
                  v-model="inputs.staff_in_charge"
                  type="text"
                  class="form-control"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="mt-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="loading"
                        @click.prevent="search">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row v-show="items.length > 0">
              <b-col md="12">
                <p class="text-header">Doanh thu: <b>{{currencyFormat(revenue_total)}}đ</b></p>
                <p class="text-header">Lợi nhuận: <b>{{currencyFormat(profit_total)}}đ</b></p>
              </b-col>
            </b-row>

            <b-row v-show="items.length > 0">
              <b-col md="4">
                Số kết quả: {{items.length}}
              </b-col>
              <b-col md="8" class="text-right">
                <download-excel
                  class   = "btn btn-default text-header"
                  :data   = "items"
                  :fields = "excel_fields"
                  worksheet = "Báo cáo chi tiết"
                  name    = "bao_cao_chi_tiet.xls">
                  <b>Xuất Excel</b>
                </download-excel>
              </b-col>
            </b-row>

            <b-row class="mt-2 mb-2">
              <b-col md="12" class="table-cus">
                <table class="table table-bordered table-striped fixed_header" v-show="items.length > 0">
                    <tr class="text-center">
                      <th colspan="9"></th>
                      <th colspan="2">Doanh thu</th>
                      <th colspan="2">Giá vốn</th>
                      <th colspan="2"></th>
                    </tr>
                    <tr class="text-center">
                      <th style="width:2%">STT</th>
                      <th style="width:6%">Ngày</th>
                      <th style="width:6%">Mã ĐH</th>
                      <th style="width:8%">Nhóm SP</th>
                      <th style="width:8%">Loại SP</th>
                      <th style="width:8%">Hãng SP</th>
                      <th style="width:8%">Mã SP</th>
                      <th style="width:9%">Tên SP</th>
                      <th style="width:5%">Số lượng</th>
                      <th style="width:7%">Đơn giá</th>
                      <th style="width:7%">Thành tiền</th>
                      <th style="width:7%">Đơn giá</th>
                      <th style="width:7%">Thành tiền</th>
                      <th style="width:7%">Lợi nhuận</th>
                      <th style="width:5%">Tỉ suất lợi nhuận</th>
                    </tr>
                    <tr v-for="(item) in items">
                      <td>{{item.stt}}</td>
                      <td>{{item.finished_date}}</td>
                      <td>{{item.order_sell_number}}</td>
                      <td>{{item.product_group_name}}</td>
                      <td>{{item.product_type_name}}</td>
                      <td>{{item.brand_name}}</td>
                      <td>{{item.product_code}}</td>
                      <td>{{item.product_name}}</td>
                      <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                      <td class="text-right">{{currencyFormat(item.price_sell)}}</td>
                      <td class="text-right">{{currencyFormat(item.amount_sell)}}</td>
                      <td class="text-right">{{currencyFormat(item.price_buy)}}</td>
                      <td class="text-right">{{currencyFormat(item.amount_buy)}}</td>
                      <td class="text-right">{{currencyFormat(item.profit)}}</td>
                      <td class="text-right">{{item.profit_percent}}%</td>
                    </tr>
                </table>

                <p v-show="firstSearch == false && items.length == 0" class="text-center">Không có kết quả nào</p>
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
      inputs: {
        from_date: null,
        to_date: null,
        order_sell_number: null,
        staff_in_charge: null,
        product_group_id: null,
        product_type_id: null,
        product_brand_id: null,
        product_code: null
      },
      timeOptions: [
        {"value": 1, "text": 'Ngày'},
        {"value": 2, "text": 'Tháng'},
        {"value": 3, "text": 'Quý'},
        {"value": 4, "text": 'Năm'}
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
      time_option: 2,
      year_input: 2024,
      quarter_input: 1,
      month_input: 1,
      optionsStaff: [],
      productBrandOptions:[],
      productBrandSelect: {},
      productGroupOptions:[],
      productGroupSelect: {},
      productTypeOptionStore: [],
      productTypeSelect:{},
      productTypeOptions:[],
      loadingOptions: false,
      items: [],
      loading: false,
      excel_fields: {
        'STT': 'stt',
        'Ngày': 'finished_date',
        'Mã ĐH': 'order_sell_number',
        'Nhóm SP': 'product_group_name',
        'Loại SP': 'product_type_name',
        'Hãng SP': 'brand_name',
        'Mã SP': 'product_code',
        'Tên SP': 'product_name',
        'Số lượng': 'quantity',
        'Doanh thu - Đơn giá': 'price_sell',
        'Doanh thu - Thành tiền': 'amount_sell',
        'Giá vốn - Đơn giá': 'price_buy',
        'Giá vốn - Thành tiền': 'amount_buy',
        'Lợi nhuận': 'profit',
        'Tỉ suất lợi nhuận': 'profit_percent'
      },
      firstSearch: true,
      revenue_total: 0,
      profit_total: 0
    }
  },
  mounted() {
    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    // Get default from date and to date
    this.prepareDateInput()

    // Get options related repository
    this.getOptionRelated()

    // Search
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
      this.year_input = dateNow.getFullYear()

      let currentYear = dateNow.getFullYear()
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

      reportApi.getOptionsRelatedDetailReport().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.productGroupOptions = options.product_groups
          this.productGroupOptions.unshift({name: "", id: null})

          this.productTypeOptionStore = JSON.parse(JSON.stringify(options.product_types))
          this.productTypeOptions = options.product_types
          this.productTypeOptions.unshift({name: "", id: null, product_group_id: null})

          this.productBrandOptions = options.product_brands
          this.productBrandOptions.unshift({text: "", value: null})

          this.optionsStaff = options.staffs
          this.optionsStaff.unshift({text: "", value: null})
        }
        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    changeProductGroup() {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        this.productTypeOptions = [{"id": null, "name": "", "product_group_id": null}]
        for (let i in this.productTypeOptionStore) {
          if(this.productGroupSelect.id == this.productTypeOptionStore[i].product_group_id) {
            this.productTypeOptions.push(this.productTypeOptionStore[i])
          }
        }
      } else {
        this.productTypeOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))
          let itemTypeEmpty = {"id": null, "name": "", "product_group_id": null}
        this.productTypeOptions.unshift(itemTypeEmpty)
      }
    },

    /**
     * Search
     */
    search() {
      if (this.loading) { return }

      // Handle fromDate, toDate
        if(this.time_option == 2) {
          this.inputs.from_date = this.year_input + '-' + this.month_input + '-01'
          this.inputs.to_date = this.year_input + '-' + this.month_input + '-' + new Date(this.year_input, this.month_input, 0).getDate()
        }
        if(this.time_option == 3) {
            let quarter = commonFunc.getMonthByQuarter(this.quarter_input)
          this.inputs.from_date = this.year_input + '-' + quarter + '-01'
          this.inputs.to_date = this.year_input + '-' + (quarter + 2) + '-' + new Date(this.year_input, (quarter + 2), 0).getDate()
        }
        if(this.time_option == 4) {
          this.inputs.from_date = this.year_input + '-01-01'
          this.inputs.to_date = this.year_input + '-12-' + new Date(this.year_input, 12, 0).getDate()
        }
        let params = {
          "from_date": this.inputs.from_date,
          "to_date": this.inputs.to_date,
          "order_sell_number": this.inputs.order_sell_number,
          "product_group_id": this.productGroupSelect && this.productGroupSelect.id ? this.productGroupSelect.id : null,
          "product_type_id": this.productTypeSelect && this.productTypeSelect.id ? this.productTypeSelect.id : null,
          "product_brand_id": this.productBrandSelect && this.productBrandSelect.value ? this.productBrandSelect.value : null,
          "product_code": this.inputs.product_code,
          "staff_in_charge": this.inputs.staff_in_charge
        }

      this.loading = true

      // Search
      reportApi.getDetailReport(params).then(res => {
        if(res && res.data && res.data.data) {
          this.items = res.data.data;

          // Tính toán doanh thu, lợi nhuận
          this.revenue_total = 0
          this.profit_total = 0
          for(let item of this.items) {
            this.revenue_total += parseInt(item.amount_sell)
            this.profit_total += parseInt(item.profit)
          }
        }

        this.firstSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.firstSearch = false
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
