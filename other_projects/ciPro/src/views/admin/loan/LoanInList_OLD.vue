<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToNew">
                Thêm mới
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Khoản Đi Vay</h4>
            </b-col>
          </b-row>

          <b-row>
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

            <b-col md="2">
              <label>Trạng thái</label>
              <b-form-select
                :options="status"
                id="status"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.status">
              </b-form-select>
            </b-col>
            <b-col md="4">
              <label>Khách hàng</label>
              <multiselect
                v-model="customerSelect"
                :options="customerOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn khách hàng--"
                label="text"
                track-by="text">
              </multiselect>
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click="prepareToSearch">
                <!--<b-icon icon="search" aria-hidden="true"></b-icon>-->
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
                worksheet = "Danh sách khoản đi vay"
                name    = "Danh sách khoản đi vay">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <hr>

          <b-row>
            <b-col class="table-cus">
              <table class="table table-bordered table-striped fixed_header">
                  <thead>
                  <tr>
                    <th style="width:3%" class="text-center">STT</th>
                    <th style="width:12%" class="text-center">Tên K.H</th>
                    <th style="width:8%" class="text-center">Số điện thoại</th>
                    <th style="width:8%" class="text-center">Trạng thái</th>
                    <th style="width:8%" class="text-center">Ngày mượn</th>
                    <th style="width:8%" class="text-center">Ngày hẹn trả</th>
                    <th style="width:8%" class="text-center">Số tiền</th>
                    <th style="width:8%" class="text-center">Lãi suất %</th>
                    <th style="width:8%" class="text-center">Kỳ hạn lãi</th>
                    <th style="width:8%" class="text-center">Thời gian tính lãi</th>
                    <th style="width:8%" class="text-center">Số tiền lãi</th>
                    <th style="width:8%" class="text-center">Tổng tiền</th>
                    <th style="width:8%" class="text-center">Đã trả</th>
                    <th style="width:8%" class="text-center">Còn lại</th>
                    <th style="width:5%"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in items">
                    <td>{{index + 1}}</td>
                    <td>
                      {{item.customer_name}}
                    </td>
                    <td>
                      {{item.customer_phone}}
                    </td>
                    <td>{{item.status_str}}</td>
                    <td>{{item.borrowed_date}}</td>
                    <td>{{item.due_date}}</td>
                    <td class="text-right">{{item.amount | format_currency}}</td>
                    <td class="text-right">{{item.interest_rate}}%</td>
                    <td>{{item.interest_period_str}}</td>
                    <td>{{item.loan_time}}</td>
                    <td class="text-right">{{item.interest_amount | format_currency}}</td>
                    <td class="text-right">{{item.total | format_currency}}</td>
                    <td class="text-right">
                      <span v-show="item.amount_paid > 0" class="ml-2">
                        <i class="fa fa-info-circle" title="Danh sách đã trả"
                           @click="showModalDetailPayment(item.id)"/>
                      </span>
                      {{item.amount_paid | format_currency}}
                    </td>
                    <td class="text-right">{{item.remaining | format_currency}}</td>
                    <td>
                      <b-list-group horizontal class="mt-2">
                        <b-list-group-item v-if="item.status == -1" v-b-tooltip.hover title="Cập nhật" @click="edit(item.id)">
                          <i class="fa fa-edit" />
                        </b-list-group-item>
                        <b-list-group-item v-if="item.status == -1 || isRoot" v-b-tooltip.hover title="Xóa"
                                @click="deleted(item.id, item.customer_name)">
                          <i class="fa fa-trash" />
                        </b-list-group-item>
                      </b-list-group>

                      <b-button class="mt-2" v-if="item.status != 2" variant="outline-success"
                                @click="goToPayment(item.id)" title="Thanh toán">
                        Thanh toán
                      </b-button>
                    </td>
                  </tr>
                  </tbody>
              </table>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </b-card>
      </b-col>
    </b-row>

    <!--Modal chi tiết thanh toán-->
    <b-modal centered hide-footer hide-header size="xl" id="modal-list-payment">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Danh Sách Thanh Toán</h4>
        </b-col>
      </b-row>
      <hr>
      <span class="loading-more" v-show="loadingPayment"><icon name="loading" width="60" /></span>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="paymentFields"
            :items="paymentItems">
            <template v-slot:cell(amount)="data">{{ data.item.amount | format_currency }}</template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-danger" class="pull-right btn-width-120"
                    @click.prevent="hideModalDetailPayment">
            Đóng
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>


<script>
import loanApi from '@/api/loan'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    const { popToast } = useToast()
    return { authStore, popToast }
  },
  components: {
    Multiselect,
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
      year_input: 2023,
      quarter_input: 1,
      month_input: 1,
      loadingOptions: false,
      customerSelect: {},
      customerOptions: [],
      optionsStaff: [],
      totalRow: 0,
      status: [
        {value: null, text: ''},
        {value: '-1', text: 'Lưu nháp'},
        {value: '0', text: 'Trong hạn'},
        {value: '1', text: 'Quá hạn'},
        {value: '2', text: 'Đã tất toán'}

      ],
      inputs: {
        from_date: null,
        to_date: null,
        customer_id: null,
        status: null,
      },
      items: [],
      excel_fields: {
        'Tên K.H': 'customer_name',
        'Số điện thoại': 'customer_phone',
        'Trạng thái' : 'status_str',
        'Ngày mượn' : 'borrowed_date',
        'Ngày hẹn trả': 'due_date',
        'Số tiền': 'amount',
        'Lãi suất %': 'interest_rate',
        'Kỳ hạn lãi': 'interest_period_str',
        'Thời gian tính lãi': 'loan_time',
        'Số tiền lãi': 'interest_amount',
        'Tổng tiền': 'total',
        'Đã trả': 'amount_paid',
        'Còn lại': 'remaining',
      },
      excel_items: [],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      isRoot: false,
      paymentFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'created_at',
          label: 'Ngày'
        },
        {
          key: 'fund_number',
          label: 'Số phiếu'
        },
        {
          key: 'amount',
          label: 'Số tiền'
        },
        {
          key: 'bank_account_info',
          label: 'Sổ thu chi'
        },
        {
          key: 'description',
          label: 'Nội dung'
        }
      ],
      paymentItems: [],
      loadingPayment: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    if(this.authStore.user.isRoot) {
      this.isRoot = true
    }

    this.prepareDateInput()

    this.getOptions()

    // Load list when load page
    this.prepareToSearch()
  },
  methods: {
    prepareDateInput() {
      let dateNow = new Date()
      this.inputs.to_date = dateNow.toJSON().slice(0,10)
      this.inputs.from_date = new Date(dateNow.setDate(dateNow.getDate() - 30))
      let currentYear = new Date().getFullYear()
      this.year_input = currentYear
      this.yearOptions = []
      for (let i = currentYear; i > currentYear - 10; i--) {
        this.yearOptions.push({value: i, text: i})
      }

      this.month_input = dateNow.getMonth() + 1
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
     *  Processing on scroll: use for paging
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search ()
        }
      }
    },

      /**
     *  Get options
     */
    getOptions() {
      this.loadingOptions = true
        let params = {
          "loan_type": 0,
          "customers": true
        }
      loanApi.getOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {

          // Customer
          this.customerOptions = res.data.data.customers
          let itemEmpty = {"value": null, "text": null}
          this.customerOptions.unshift(itemEmpty)
        }

        this.loadingOptions = false
      }).catch(err => {
        this.loadingOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Go to add
     */
    goToNew () {
      this.$router.push('/loan-in/add')
    },

    /**
     *  Search
     */
    search() {
      if (this.onSearch) { return }

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

      // Define params
      let params = {
        "loan_type": 0,
        "from_date": fromDate,
        "to_date": toDate,
        "customer_id": this.customerSelect.value ? this.customerSelect.value : null,
        "status": this.inputs.status,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      loanApi.searchLoan(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let it = res.data.data;

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
        }

        this.onSearch = false
      }).catch(err => {
        this.onSearch = false

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
      loanApi.searchLoan(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let datas = res.data.data
          this.excel_items = datas

          // Check has next
          this.totalRow = res.data.data.length
          if(parseInt(this.offset) + parseInt(this.pageLimit) >= parseInt(this.totalRow)) {
            this.hasNext = false
          }

          this.isGetExcelItems = true
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Go to page edit
     */
    edit (id) {
        this.$router.push('/loan-in/edit/' + id)
    },

    deleted (id, name) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa khoản vay của [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            loanApi.deleteLoan(id).then(res => {
              // Reload data
              this.prepareToSearch()
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },

    goToPayment(id) {
      window.open('/loan-in-payment/' + id, '_blank')
    },

    showModalDetailPayment(id) {
      this.getListPayment(id)

      this.$bvModal.show('modal-list-payment')
    },

    hideModalDetailPayment() {
      this.$bvModal.hide('modal-list-payment')
    },

    getListPayment(id) {
      this.loadingPayment = true

      loanApi.getListPayment({"id": id, "type": 1}).then(res => {
        if (res != null && res.data != null) {
          this.paymentItems = res.data.data
        }
        this.loadingPayment = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingPayment = false
      })
    },

  }
}
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }
</style>
