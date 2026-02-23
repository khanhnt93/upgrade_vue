<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card card-overflow-visible">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="mt-2 text-center text-header">Lịch Sử Công Nợ</h4>
              </div>
            </div>
            <hr>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/6 px-2">
              <label> Khách hàng </label>
              <multiselect
                v-model="customerSelect"
                :options="customerOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn khách hàng--"
                label="name"
                track-by="name"
                @input="changeCustomer">
              </multiselect>
              </div>
              <div class="w-full md:w-1/6 px-2">
                <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.customer_name"
              maxlength="75"
              :disabled="customerSelect.id">
              </div>
              <div class="w-full md:w-1/6 px-2">
                <label> Số điện thoại </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.customer_phone_number"
              maxlength="11"
              @keyup="integerOnly($event.target)"
              :disabled="customerSelect.id">
              </div>

              <div class="w-full md:w-1/4 px-2">
                <label> Từ ngày </label>
                <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus"  :typeable="true" ></datepicker>
              </div>

              <div class="w-full md:w-1/4 px-2">
                <label> Đến ngày </label>
                <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true" ></datepicker>
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
              <button
                  class="btn btn-default text-header btn-width-120 float-right"
                  @click="exportToExcel(items, excel_fields, 'Danh sách nợ thu hồi.xls', 'Danh sách nợ thu hồi')"
                  title="Xuất Excel">
                <b>Xuất Excel</b>
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
              <span class="loading-more" v-show="loading"><i class="fa fa-spinner fa-spin fa-3x text-primary"></i></span>
              <table class="table table-bordered table-striped fixed_header">
                <thead>
                <tr>
                  <th class="text-center font-weight-bold">STT</th>
                  <th class="text-center font-weight-bold">Tên k.H</th>
                  <th class="text-center font-weight-bold">Số điện thoại</th>
                  <th class="text-center font-weight-bold">Loại</th>
                  <th class="text-center font-weight-bold">Số tiền</th>
                  <th class="text-center font-weight-bold">Số tiền còn lại</th>
                  <th class="text-center font-weight-bold">Người tạo</th>
                  <th class="text-center font-weight-bold">Ngày tạo</th>
                  <th class="text-center font-weight-bold">Ghi chú</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item) in items">
                  <td>{{item.stt}}</td>
                  <td>{{item.customer_name}}</td>
                  <td>{{item.customer_phone}}</td>
                  <td>{{item.type}}</td>
                  <td class="text-right">{{currencyFormat(item.amount)}}</td>
                  <td class="text-right">{{currencyFormat(item.amount_remaining)}}</td>
                  <td>{{item.created_by}}</td>
                  <td>{{item.created_at}}</td>
                  <td>{{item.description}}</td>
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
import debitApi from '@/api/debt'
import commonFunc from '@/common/commonFunc'

// import JsonExcel from 'vue-json-excel' // TODO: Replace with xlsx library
import Datepicker from 'vue3-datepicker'
import tradeApi from '@/api/trade'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import { useExcelExport } from '@/composables/useExcelExport'



export default {
  setup() {
    const { popToast } = useToast()
    const { exportToExcel } = useExcelExport()

    return { popToast, exportToExcel }
  },
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      loadingGetOptions: false,
      customerSelect: {},
      customerOptions: [],
      inputs: {
        customer_id: null,
        customer_name: null,
        customer_phone_number: null,
        from_date: new Date(),
        to_date: new Date()
      },
      items: [],
      excel_fields: {
        'Tên K.H': 'customer_name',
        'Số điện thoại': 'customer_phone',
        'Loại': 'Loại',
        'Số tiền' : 'amount',
        'Số tiền còn lại' : 'amount_remaining',
        'Người tạo' : 'created_by',
        'Ngày': 'created_at',
        'Ghi chú' : 'description',
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
    // this.inputs.to_date = dateNow
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
    this.inputs.from_date = fromDate

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // // Get list customer option
    // this.getCustomerOption()

    // Load list when load page
    this.search()
  },
  methods: {

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated() {
      this.loadingGetOptions = true
      let params = {
        "customers": true
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // customers
          if(params.customers) {
            this.customerOptions = options.customers
            this.customerOptions.unshift({"id": null, "name": ''})
          }
        }
        this.loadingGetOptions = false
      }).catch(err => {
        this.loadingGetOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)
      })
    },

    /**
     *  Event change customer
     */
    changeCustomer() {
      if(this.customerSelect && this.customerSelect.id) {
        this.inputs.customer_id = this.customerSelect.id
        this.inputs.customer_name = this.customerSelect.name
        this.inputs.customer_phone_number = this.customerSelect.phone_number
      } else {
        this.inputs.customer_name = null
        this.inputs.customer_phone_number = null
      }
    },

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

      this.onSearch = true
      this.loading = true

      // Define params
      let params = {
        "customer_id": this.inputs.customer_id,
        "customer_name": this.inputs.customer_name,
        "customer_phone_number": this.inputs.customer_phone_number,
        "from_date": moment(this.inputs.from_date).format('YYYY-MM-DD'),
        "to_date": moment(this.inputs.to_date).format('YYYY-MM-DD')
      }

      // Search
      debitApi.getDebtHistory(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.items = res.data.data
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


<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }


  table {
    margin: auto;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
  }

  td, th {
    padding: .5rem;
  }

  th {
    text-align: left;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
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
