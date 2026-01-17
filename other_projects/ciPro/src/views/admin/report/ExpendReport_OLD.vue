<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <h4 class="text-center text-header">Báo Cáo Chi Phí Của Đơn Hàng Đã Hoàn Thành</h4>

            <b-row class="form-row">

              <b-col md="2">
                <label>Thời gian</label>
                <b-form-select :options="timeOptions" v-model="time_option" ></b-form-select>
              </b-col>

              <b-col md="2">
                <label v-show="time_option != 5"> {{time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
                <!--Thời gian theo ngày-->
                <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
                <!--Thời gian năm-->
                <b-form-select v-show="time_option != 1 && time_option != 5" :options="yearOptions" v-model="year_input"></b-form-select>
              </b-col>

              <b-col md="2">
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

              <b-col md="6">
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
                <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="loading"
                          @click.prevent="prepareToSearch">
                  Tìm Kiếm
                </b-button>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col>
                <p>Tổng số tiền chi: {{currencyFormat(sum_expend)}}</p>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="4">
                Số kết quả: {{total_row}}
              </b-col>
              <b-col md="8" class="text-right" v-if="excel_items.length > 0">
                    <download-excel
                      class   = "btn btn-default text-header"
                      :data   = "excel_items"
                      :fields = "excel_fields"
                      worksheet = "Báo cáo chi phí"
                      name    = "bao_cao_chi_phi.xls">
                      <b>Xuất Excel</b>
                    </download-excel>
                  </b-col>
            </b-row>

            <b-row>
              <b-col class="table-cus">
                <table class="table table-bordered table-striped fixed_header">
                  <thead>
                    <tr>
                      <th style="width:5%" class="text-center">STT</th>
                      <th style="width:12%" class="text-center">Ngày phát sinh</th>
                      <th style="width:12%" class="text-center">Nhân viên</th>
                      <th style="width:14%" class="text-center">Mã ĐH bán</th>
                      <th style="width:14%" class="text-center">Ngày hoàn thành đơn</th>
                      <th style="width:14%" class="text-center">Mã phiếu chi</th>
                      <th style="width:12%" class="text-center">Số tiền</th>
                      <th style="width:17%" class="text-center">Nội dung chi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in items" :key="index">
                      <td class="text-center">{{index + 1}}</td>
                      <td>{{item.accounting_date}}</td>
                      <td>{{item.staff_name}}</td>
                      <td>{{item.order_sell_number}}</td>
                      <td>{{item.finished_date}}</td>
                      <td>{{item.fund_number}}</td>
                      <td class="text-right">{{currencyFormat(item.amount)}}</td>
                      <td>{{item.description}}</td>
                    </tr>
                    </tbody>
                </table>
              </b-col>
            </b-row>

            <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && total_row != 0"><i class="fa fa-angle-double-down has-next"></i></span>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import reportApi from '@/api/report'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'
import Datepicker from 'vue3-datepicker'
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
        status_id: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      loadingOptions: false,
      optionsStaff: [],
      items: [],
      sum_expend: 0,
      hasNext: true,
      loading: false,
      total_row: 0,
      loadByScroll: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      excel_items: [],
      excel_fields: {
        'Ngày phát sinh': 'accounting_date',
        'Nhân viên': 'staff_name',
        'Mã ĐH bán' : 'order_sell_number',
        'Ngày hoàn thành đơn' : 'finished_date',
        'Mã phiếu chi' : 'fund_number',
        'Số tiền' : 'amount'
      },
      isGetExcelItems: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Check xem có params gửi từ báo cáo khác qua ko
    // let params = this.$router.currentRoute.query
      let params = new URL(location.href).searchParams

    if (params) {
      let dateNow = new Date()

      if (params.get('to_date')) {
        this.inputs.to_date = params.get('to_date')
      } else {
          let to_date = dateNow.toJSON().slice(0,10)
          this.inputs.to_date = to_date
      }

      if (params.get('from_date')) {
        this.inputs.from_date = params.get('from_date')
      } else {
        let from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
        this.inputs.from_date = from_date.toJSON().slice(0,10)
      }

      if (params.get('staff_id')) {
        this.inputs.staff_in_charge = {"value": params.get('staff_id'), "text": ''}
      }
    }

    // Get default from date and to date
    this.prepareDateInput()

    // Get danh sách nhân viên
    this.getOptionRelated()

    // Tìm kiếm
    this.prepareToSearch()
  },
  methods: {

    /**
     * Scroll event
     */
    onScroll (event) {
      if(this.loading) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search()
        }
      }
    },

    prepareDateInput() {
      let dateNow = new Date()
      // let to_date = dateNow.toJSON().slice(0,10)
      // let from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
      // this.inputs.to_date = to_date
      // this.inputs.from_date = from_date
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
        'staffs': true,
      }

      reportApi.getOptionsRelatedReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.optionsStaff = options.staffs
          this.optionsStaff.unshift({value: null, text: "-- Tất cả --"})

          if (this.inputs.staff_in_charge && this.inputs.staff_in_charge.value) {
            for(let staff of this.optionsStaff) {
              if(staff.value == this.inputs.staff_in_charge.value) {
                this.inputs.staff_in_charge = staff
                break
              }
            }
          } else {
            this.inputs.staff_in_charge = this.optionsStaff[0]
          }
        }
        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    getExcelItem(params) {
      if(this.isGetExcelItems) {
        return;
      }

      this.excel_items = []

      // Define params
      params.limit = 999999

      // Search
      reportApi.getExpendReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data.expends
          this.isGetExcelItems = true
        }
      }).catch(err => {})
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true
      this.isGetExcelItems = false

      this.search()
    },

    search() {
      if(this.loading) {
        return
      }

      this.loading = true

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
        staff_id: this.inputs.staff_in_charge && this.inputs.staff_in_charge.value ? this.inputs.staff_in_charge.value : null,
        from_date: fromDate,
        to_date: toDate,
        limit: this.pageLimit,
        offset: this.offset
      }

      reportApi.getExpendReport(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.expends
          this.total_row = res.data.data.total_row
          this.sum_expend = res.data.data.sum_expend

          // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          // Check has next
          if(this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }

          if(!this.isGetExcelItems) {
            this.getExcelItem(params)
          }
        } else {
          this.items = []
          this.excel_items = []
        }
        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
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
