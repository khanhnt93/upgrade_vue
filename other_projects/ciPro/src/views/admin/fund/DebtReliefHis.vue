<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Lịch Sử Xoá Nợ</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">

            <b-col md="4">
              <label> Thời gian </label>
              <b-form-select :options="timeOptions" v-model="time_option" ></b-form-select>
            </b-col>

            <b-col md="4">
              <label> {{time_option == 1 ? 'Từ ngày' : 'Năm' }} </label>
              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              <!--Thời gian năm-->
              <b-form-select v-show="time_option != 1" :options="yearOptions" v-model="year_input"></b-form-select>
            </b-col>

            <b-col md="4">
              <label v-show="time_option != 4"> {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }} </label>

              <!--Thời gian theo ngày-->
              <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>

              <!--Thời gian tháng -->
              <b-form-select v-show="time_option == 2" :options="monthOptions" v-model="month_input"></b-form-select>

              <!--Thời gian quý -->
              <b-form-select v-show="time_option == 3" :options="quarterOptions" v-model="quarter_input"></b-form-select>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="loading"
                        @click.prevent="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{totalRow}}</b></span></div>
              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "excel_items"
                :fields = "excel_fields"
                worksheet = "Lịch Sử Xoá Nợ"
                name    = "Lịch Sử Xoá Nợ">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12" class="table-cus">
              <table class="table table-bordered table-striped fixed_header">
                <tr>
                  <th style="width:4%">STT</th>
                  <th style="width:10%">Ngày lập</th>
                  <th style="width:10%">Loại</th>
                  <th style="width:10%">Số ĐH xoá nợ</th>
                  <th style="width:20%">Tên K.H/NCC</th>
                  <th style="width:10%">Số tiền</th>
                  <th style="width:10%">Số ngày nợ tới thời điểm xoá nợ</th>
                  <th style="width:16%">Lý do xoá nợ</th>
                  <th style="width:10%">Tài khoản thực hiện</th>
                </tr>
                <tr v-for="(item, index) in items">
                  <td>{{index + 1}}</td>
                  <td>{{item.created_at}}</td>
                  <td>{{item.type_str}}</td>
                  <td>{{item.order_number}}</td>
                  <td>{{item.object_name}}</td>
                  <td>{{item.amount | format_currency}}</td>
                  <td>{{item.debt_relief_date_number}}</td>
                  <td>{{item.description}}</td>
                  <td>{{item.staff_name}}</td>
                </tr>
              </table>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>
<script>


import fundApi from '@/api/fund'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vuejs-datepicker'


export default {
  components: {
    Datepicker
  },
  data () {
    return {
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
      time_option: 1,
      year_input: 2024,
      quarter_input: 1,
      month_input: 1,
      typeOptions: [
        {"value": null, "text": ''},
        {"value": 0, "text": 'Phiếu thu'},
        {"value": 1, "text": 'Phiếu chi'}
      ],
      inputs: {
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      items: [],
      excel_items: [],
      excel_fields: {
        'Ngày lập': 'created_at',
        'Loại' : 'type_str',
        'Số ĐH xoá nợ' : 'order_number',
        'Tên K.H/NCC' : 'object_name',
        'Số tiền': 'amount',
        'Số ngày nợ tới thời điểm xoá nợ': 'debt_relief_date_number',
        'Lý do xóa nợ': 'description',
        'Tài khoản thực hiện': 'staff_name',
      },
      isGetExcelItems: false,
      loadByScroll: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      totalRow: 0,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    // Get default from date and to date
    this.prepareDateInput()

    // Search
    this.prepareToSearch()
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

    /**
     * Search
     */
    search () {
      if (this.loading) { return }
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
        "from_date": fromDate,
        "to_date": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      fundApi.getDebtReliefHis(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data

          // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          if(!this.isGetExcelItems) {
            this.getExcelItem(params)
          } else {
            if(parseInt(this.offset) + parseInt(this.pageLimit) >= parseInt(this.totalRow)) {
              this.hasNext = false
            }
          }
        } else {
          this.items = []
        }
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loading = false
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
      fundApi.getDebtReliefHis(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data
          this.isGetExcelItems = true

          // Check has next
          this.totalRow = res.data.data.length
          if(parseInt(this.offset) + parseInt(this.pageLimit) >= parseInt(this.totalRow)) {
            this.hasNext = false
          }
        }
      }).catch(err => {})
    },

  }
}
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }
</style>
