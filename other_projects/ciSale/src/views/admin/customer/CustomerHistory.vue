<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="mt-2 text-center text-header">Lịch Sử Khách Hàng</h4>
              </div>
            </div>
            <hr>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/4 px-2 mb-3">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name"
              maxlength="75">
              </div>
              <div class="w-full md:w-1/4 px-2 mb-3">
                <label> Số điện thoại </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.phone"
              maxlength="11"
              @keyup="integerOnly($event.target)">
              </div>

              <div class="w-full md:w-1/4 px-2 mb-3">
                <label> Từ ngày </label>
            <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" :typeable="true"
                        placeholder="yyyy-mm-dd" input-class="datepicker-cus" ></datepicker>
              </div>

              <div class="w-full md:w-1/4 px-2 mb-3">
                <label> Đến ngày </label>
            <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" :typeable="true"
                        placeholder="yyyy-mm-dd" input-class="datepicker-cus" ></datepicker>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-2 mb-2">
              <div class="w-full px-2">
                <button class="btn btn-outline-primary float-right btn-width-120" :disabled="onSearch" @click="prepareToSearch">
                  Tìm Kiếm
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/3 px-2">
                Số kết quả: {{items.length}}
              </div>
              <div class="w-full md:w-2/3 px-2 text-right">
              <!-- TODO: Replace with xlsx library -->
              <!-- <download-excel
                class   = "btn btn-default text-header"
                :data   = "items"
                :fields = "excel_fields"
                worksheet = "Lịch sử khách hàng"
                name    = "lich_su_khach_hang.xls">
                <b>Xuất Excel</b>
              </download-excel> -->
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
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
                    <button class="btn btn-outline-success float-right btn-width-120"
                              @click="goToDetail(item.id)">
                      Chi tiết
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>

              </div>
            </div>

            <span class="loading-more">--Hết--</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>


<script>
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import customerApi from '@/api/customer'
import commonFunc from '@/common/commonFunc'
// import JsonExcel from 'vue-json-excel' // TODO: Replace with xlsx library
import Datepicker from 'vue3-datepicker'

export default {
  components: {
    Datepicker
  },
  setup() {
    const { popToast } = useToast()
    const router = useRouter()
    return { popToast, router }
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
  mounted() {
    // Get default from date and to date
    let dateNow = new Date()
    this.inputs.to_date = dateNow.toJSON().slice(0,10)
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
    this.inputs.from_date = fromDate.toJSON().slice(0,10)

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
   * Make toast without title
   */
    popToast(variant, content) {
      const toastOptions = {
        timeout: 3000,
        closeButton: false
      }

      if (variant === 'success') {
        this.toast.success(content, toastOptions)
      } else if (variant === 'danger' || variant === 'error') {
        this.toast.error(content, toastOptions)
      } else if (variant === 'warning') {
        this.toast.warning(content, toastOptions)
      } else {
        this.toast.info(content, toastOptions)
      }
    },

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
    //   if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
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
        this.popToast('error', errorMess)

        this.onSearch = false
        this.loading = false
      })
    },

    /**
     * Go to detail
     */
    goToDetail(id) {
      let routeData = this.router.resolve({path: '/trade-detail/' + id});
      // let routeData = this.router.resolve({name: 'routeName', query: {data: "someData"}});
      window.open(routeData.href, '_blank');

      // this.router.push('/trade-detail/' + id)
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
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
  }
}
</script>

<style lang="css" scoped>

  table {
    margin: auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
  }

  td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  th {
    text-align: left;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  td {
    white-space: nowrap;
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  td:first-of-type, th:first-of-type {
    border-left: none;
  }

  td:last-of-type, th:last-of-type {
    border-right: none;
  }
</style>
