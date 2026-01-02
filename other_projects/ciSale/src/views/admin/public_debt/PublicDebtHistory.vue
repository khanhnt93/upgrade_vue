<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Lịch Sử Nợ Công</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="2">
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
            </b-col>
            <b-col md="2">
              <label> Tên </label>
              <input
                id="name"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_name"
                maxlength="75"
                :disabled="customerSelect.id">
            </b-col>
            <b-col md="2">
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
            </b-col>

            <b-col md="3">
              <label> Từ ngày </label>
              <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
            </b-col>

            <b-col md="3">
              <label> Đến ngày </label>
              <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
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
                worksheet = "Lịch sử công nợ"
                name    = "lich_su_cong_no.xls">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
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
                  <td>{{item.customer_phone_number}}</td>
                  <td>{{item.type}}</td>
                  <td class="text-right">{{currencyFormat(item.amount)}}</td>
                  <td class="text-right">{{currencyFormat(item.amount_remaining)}}</td>
                  <td>{{item.created_by}}</td>
                  <td>{{item.created_at}}</td>
                  <td>{{item.description}}</td>
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
import debitApi from '@/api/debt'
import tradeApi from '@/api/trade'
import commonFunc from '@/common/commonFunc'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
Vue.component('downloadExcel', JsonExcel)

export default {
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
        from_date: '',
        to_date: ''
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
    this.inputs.to_date = dateNow.toJSON().slice(0,10)
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
    this.inputs.from_date = fromDate.toJSON().slice(0,10)

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // Load list when load page
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
        this.popToast('danger', errorMess)
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
        this.inputs.customer_id = null
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
        "from_date": this.inputs.from_date,
        "to_date": this.inputs.to_date
      }

      // Search
      debitApi.getPublicDebtHistory(params).then(res => {
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
        this.popToast('danger', errorMess)

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
