<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Lịch Sử Khách Hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="3">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name"
              maxlength="75">
            </b-col>
            <b-col md="3">
              <label> Số điện thoại </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.phone"
              maxlength="11"
              @keyup="integerOnly($event.target)">
            </b-col>

          <b-col md="3">
            <label> Từ ngày </label>
            <datepicker v-model="inputs.from_date" format="yyyy-MM-dd"
                        placeholder="yyyy-mm-dd"  input-class="datepicker-cus"></datepicker>
          </b-col>

          <b-col md="3">
            <label> Đến ngày </label>
            <datepicker v-model="inputs.to_date" format="yyyy-MM-dd"
                        placeholder="yyyy-mm-dd"  input-class="datepicker-cus"></datepicker>
          </b-col>
        </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="4">
              Số kết quả: {{items.length}}
            </b-col>
            <b-col md="8" class="text-right">
              <download-excel
                class   = "btn btn-default text-header"
                :data   = "items"
                :fields = "excel_fields"
                worksheet = "Lịch sử khách hàng"
                name    = "lich_su_khach_hang.xls">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <b-row>
            <b-col class="table-cus">
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
              <table class="table table-bordered table-striped fixed_header">
                <thead>
                <tr>
                  <th class="text-center font-weight-bold">STT</th>
                  <th class="text-center font-weight-bold">Ngày</th>
                  <th class="text-center font-weight-bold">Tên k.H</th>
                  <th class="text-center font-weight-bold">Số điện thoại</th>
                  <th class="text-center font-weight-bold">Loại giao dịch</th>
                  <th class="text-center font-weight-bold">Số hoá đơn</th>
                  <th class="text-center font-weight-bold">Tổng tiền SP</th>
                  <th class="text-center font-weight-bold">Thành tiền</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td class="total text-center font-weight-bold text-header" colspan="6">Tổng</td>
                  <td class="text-right total font-weight-bold text-header">{{currencyFormat(sum_sub_total)}}</td>
                  <td class="text-right total font-weight-bold text-header">{{currencyFormat(sum_total)}}</td>
                  <td></td>
                </tr>

                <tr v-for="(item) in items">
                  <td>{{item.stt}}</td>
                  <td>{{item.created_at}}</td>
                  <td>{{item.customer_name}}</td>
                  <td>{{item.customer_phone}}</td>
                  <td>{{item.trade_type}}</td>
                  <td>{{item.bill_number}}</td>
                  <td class="text-right">{{currencyFormat(item.sub_total)}}</td>
                  <td class="text-right">{{currencyFormat(item.total)}}</td>
                  <td class="text-center">
                    <b-button variant="outline-success" class="pull-right btn-width-120"
                              @click="goToDetail(item.id)">
                      Chi tiết
                    </b-button>
                  </td>
                </tr>
                </tbody>
              </table>

            </b-col>
          </b-row>

          <span class="loading-more">--Hết--</span>
        </b-card>

      </b-col>
    </b-row>

  </div>
</template>


<script>
import customerApi from '@/api/customer'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'

export default {
  components: {
    Datepicker
  },
  data () {
    return {
      inputs: {
        name: null,
        phone: null,
        from_date: '',
        to_date: ''
      },
      items: [],
      excel_fields: {
        'Ngày': 'created_at',
        'Tên K.H': 'customer_name',
        'Số điện thoại': 'customer_phone',
        'Số Bill': 'bill_number',
        'Loại giao dịch' : 'trade_type',
        'Tổng tiền SP' : 'sub_total',
        'Thành Tiền' : 'total'
      },
      sum_sub_total: 0,
      sum_total: 0,
      onSearch: false,
      loading: false,
      totalRow: 0,
      click: false,
    }
  },
  // computed: {
  //   errorFromDate: function () {
  //     return this.checkDate(this.inputs.fromDate)
  //   },
  //   errorToDate: function () {
  //     return this.checkDate(this.inputs.toDate)
  //   },
  // },
  mounted() {
    // Get default from date and to date
    let dateNow = new Date()
    this.inputs.from_date = dateNow.toJSON().slice(0,8) + '01'
    let dayOfMonth = new Date(dateNow.getFullYear(), dateNow.getMonth() +1, 0).getDate()
    let toDate = new Date(dateNow.setDate(dayOfMonth))
    this.inputs.to_date = toDate.toJSON().slice(0,10)

    // window.addEventListener('scroll', this.onScroll)
    //
    // window.addEventListener('resize', this.delete)

    // Load list when load page
    this.search()
  },
  methods: {
    // checkDate(dateInput) {
    //   return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    // },
    // checkValidate() {
    //   return !(this.errorFromDate || this.errorToDate)
    // },



    /**
     *  Processing on scroll: use for paging
     */
    // onScroll (event) {
    //   if(this.onSearch) {
    //     return
    //   }
    //   event.preventDefault()
    //   var body = document.body
    //   var html = document.documentElement
    //   if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    //     if(this.hasNext) {
    //       this.offset = this.offset + this.pageLimit
    //       this.loadByScroll = true
    //       this.search ()
    //     }
    //   }
    // },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []

      this.search()
    },

    /**
     *  Search
     */
    search() {
      // this.click = true
      if (this.onSearch) { return }

      // if(!this.checkValidate()) {
      //   return
      // }

      this.onSearch = true
      this.loading = true


      // Define params
      let params = {
        "name": this.inputs.name,
        "phone": this.inputs.phone,
        "from_date": this.inputs.from_date,
        "to_date": this.inputs.to_date
      }

      // Search
      customerApi.getCustomerHistory(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.items = res.data.data

          // Calculate sum
          this.sum_sub_total = 0
          this.sum_total = 0
          for(let i in this.items) {
            this.sum_sub_total += this.items[i].sub_total
            this.sum_total += this.items[i].total
          }
        }else{
            this.items = []
        }
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearch = false
        this.loading = false
      })
    },

    /**
     * Go to detail
     */
    goToDetail(id) {
      let routeData = this.$router.resolve({path: '/trade-detail/' + id});
      // let routeData = this.$router.resolve({name: 'routeName', query: {data: "someData"}});
      window.open(routeData.href, '_blank');

      // this.$router.push('/trade-detail/' + id)
    },

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
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
