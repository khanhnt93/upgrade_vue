<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
              <b-button variant="outline-primary" class="pull-right btn-width-160 ml-2 mt-1" @click="goToAddAccountingSlip">
                Thêm PKT
              </b-button>
              <b-button variant="outline-danger" class="pull-right btn-width-160 ml-2 mt-1" @click="goToAddExpend">
                Thêm khoản chi
              </b-button>
              <b-button variant="outline-success" class="pull-right btn-width-160 ml-2 mt-1" @click="goToAddIncome">
                Thêm khoản thu
              </b-button>

            </b-col>
          </b-row>
          <h2 class="text-center text-header">Báo Cáo Quỹ</h2>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

          <b-row>
            <b-col md="3">
              <label>Tổng tiền có: <span :class="total_net_class"><b>{{currencyFormat(total_net)}}</b></span></label>
            </b-col>
            <b-col md="3">
              <label>Tiền mặt: {{currencyFormat(cash)}}</label>
            </b-col>
            <b-col md="3">
              <label>Nợ Phải Thu: {{currencyFormat(debt)}}</label>
            </b-col>
            <b-col md="3">
              <label>Vay phải thu: {{currencyFormat(loan_receive)}}</label>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="3">
              <label>Tồng tiền hiện tại: <span :class="total_class"><b>{{currencyFormat(total)}}</b></span></label>
            </b-col>
            <b-col md="3">
              <label>
                Tài khoản NH: {{currencyFormat(credit)}}
                <span class="ml-2"><i class="fa fa-info-circle" title="Chi tiết" @click="showModalListBankAccount"/></span>
              </label>
            </b-col>
            <b-col md="3">
              <label>Nợ Phải Trả: {{currencyFormat(public_debt)}}</label>
            </b-col>
            <b-col md="3">
              <label>Vay phải trả: {{currencyFormat(loan_pay)}}</label>
            </b-col>
          </b-row>

        </b-card>

      <b-card>
        <b-row>
          <b-col>
            <h3 class="text-header text-center">Danh sách khoản Thu Chi</h3>
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
            <label>Số phiếu</label>
            <input
            id="fund_number"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="inputs.fund_number"
            maxlength="20">
          </b-col>

          <b-col md="2">
            <label>Diễn giải</label>
            <input
            id="description"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="inputs.description"
            maxlength="255">
          </b-col>

          <b-col md="2">
            <label>Số tiền thu-chi</label>
            <input
            id="amount"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="inputs.amount"
            maxlength="20">
          </b-col>

        </b-row>

        <b-row>
          <b-col md="3" class="mt-2">
            <label>Loại sổ</label>
            <b-form-select
              id="created_by"
              :options="bankAccountOptions"
              v-model="inputs.bank_account"
              type="text"
              class="form-control"
            ></b-form-select>
          </b-col>

          <b-col md="3" class="mt-2">
            <label>Nhóm khoản thu-chi</label>
            <multiselect
              :multiple="true"
              v-model="expendIncomeGroupSelect"
              :options="incomeExpendGroupOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Tất cả--"
              label="text"
              track-by="text"
              @input="changeGroup">
            </multiselect>
          </b-col>

          <b-col md="3" class="mt-2">
            <label>Loại khoản thu-chi</label>
            <multiselect
              :multiple="true"
              v-model="expendIncomeTypeSelect"
              :options="incomeExpendTypeOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Tất cả--"
              label="text"
              track-by="text">
            </multiselect>
          </b-col>
          
          <b-col md="3" class="mt-2">
            <label>Ngày hoạch toán</label>
            <div class="input-group">
              <datepicker v-model="inputs.accounting_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus" clearable></datepicker>
              <b-button variant="outline-danger" class="ml-2 mt-1" @click="clearDate">X</b-button>
              <!-- <button @click="clearDate">X</button> -->
            </div>
          </b-col>
        </b-row>

        <b-row class="mt-2">
          <b-col md="12">
            <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                      @click.prevent="prepareToSearch">
              Tìm Kiếm
            </b-button>
          </b-col>
        </b-row>

        <b-row>
            <b-col md="12">

              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{currencyFormat(totalRow)}}</b></span></div>

              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "excel_items"
                :fields = "excel_fields"
                worksheet = "Lịch sử quỹ"
                name    = "Lịch sử quỹ">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>

          <b-row>
            <b-col md="3">
              <label>Số dư đầu kỳ: {{currencyFormat(start_period_amount)}}</label>
            </b-col>
            <b-col md="3">
              <label>Số dư cuối kỳ: {{currencyFormat(end_period_amount)}}</label>
            </b-col>
            <b-col md="3">
              <label>Tổng thu: {{currencyFormat(total_income)}}</label>
            </b-col>
            <b-col md="3">
              <label>Tổng chi: {{currencyFormat(total_expend)}}</label>
            </b-col>
          </b-row>

          <b-card-body class="p-4">
            <b-row>
              <b-col md="12" class="table-cus">
                <table class="table table-bordered table-striped fixed_header">
                  <tr>
                    <th style="width:3%" class="text-center">STT</th>
                    <th style="width:7%" class="text-center">Ngày phát sinh</th>
                    <th style="width:7%" class="text-center">Ngày hạch toán</th>
                    <th style="width:6%" class="text-center">Số Phiếu</th>
                    <th style="width:14%" class="text-center">Loại sổ thu - chi</th>
                    <th style="width:13%" class="text-center">Nhóm khoản thu-chi</th>
                    <th style="width:13%" class="text-center">Loại khoản thu-chi</th>
                    <th style="width:14%" class="text-center">Diễn giải nội dung</th>
                    <th style="width:14%" class="text-center">Đối tượng</th>
                    <th style="width:10%" class="text-center">Tiền thu-chi</th>
                    <th style="width:10%" class="text-center">Tồn quỹ</th>
                    <th style="width:3%" class="text-center"></th>
                  </tr>
                  <tr v-for="(item) in items">
                    <td>{{item.stt}}</td>
                    <td>{{item.date_input}}</td>
                    <td>{{item.accounting_date}}</td>
                    <td>{{item.fund_number}}</td>
                    <td>{{item.bank_account_info}}</td>
                    <td>{{item.expend_income_group}}</td>
                    <td>{{item.expend_income_type}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.object_name}}</td>
                    <td class="text-right">{{item.type == 0 ? "+" : "-"}}{{item.amount | format_currency}}đ</td>
                    <td class="text-right">
                      <span v-if="item.money_type != 2 && item.fund_amount != null">{{item.fund_amount | format_currency}}đ</span>
                    </td>
                    <td  class="text-center">
                      <i v-if="!item.loan_id" class="fa fa-edit ml-2" title="Sửa"
                         @click="editFund(item)" />
                      <i v-if="isUserRoot" class="fa fa-trash ml-2" title="Xoá"
                         @click="deleteFund(item.id, item.fund_number)" />
                    </td>
                  </tr>
                </table>

                <!-- Loading -->
                <span class="loading-more" v-show="loadByScroll"><icon name="loading" width="60" /></span>
                <span class="loading-more" v-if="hasNext === false">--Hết--</span>
                <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-modal centered hide-footer hide-header size="xl" id="modal-show-list-bank-account">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Danh Sách Tài Khoản Ngân Hàng</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="bankAccountFields"
            :items="bankAccountItems">
            <template v-slot:cell(amount)="data">{{ currencyFormat(data.item.amount) }}</template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-danger" class="pull-right btn-width-120"
                    @click.prevent="hideModalListBankAccount">
            Đóng
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>

<script>
import fundApi from "@/api/fund"
import {Constant} from '@/common/constant'
import commonFunc from "@/common/commonFunc"
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Datepicker,
    Multiselect
  },
  data() {
    return {
      total: 0,
      cash: 0,
      credit: 0,
      total_net: 0,
      debt: 0,
      public_debt: 0,
      loan_pay: 0,
      loan_receive: 0,
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
      year_input: 2025,
      quarter_input: 1,
      month_input: 1,
      bankAccountOptions: [],
      incomeExpendGroupOptions: [],
      incomeExpendGroupOptionsStore: [],
      incomeExpendTypeOptions: [],
      incomeExpendTypeOptionsStore: [],
      expendIncomeGroupSelect: [],
      expendIncomeTypeSelect: [],
      inputs: {
          from_date: null,
          to_date: null,
          fund_number: null,
          bank_account: null,
          expend_income_group_ids: [],
          expend_income_type_ids: [],
          amount: null,
          description: null,
          accounting_date: null
      },
      items: [],
      totalRow: 0,
      loading: false,
      loadByScroll: false,
      hasNext: true,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      excel_items: [],
      excel_fields: {
        'Ngày phát sinh': 'date_input',
        'Ngày hạch toán': 'accounting_date',
        'Số Phiếu' : 'fund_number',
        'Loại sổ thu - chi' : 'bank_account_info',
        'Nhóm khoản thu-chi': 'expend_income_group',
        'Loại khoản thu-chi': 'expend_income_type',
        'Diễn giải nội dung': 'description',
        'Đối tượng': 'object_name',
        'Số Tiền': 'amount',
        'Tồn quỹ': 'fund_amount'
      },
      onSearch: false,
      total_class: "text-success",
      total_net_class: "text-success",
      start_period_amount: 0,
      end_period_amount: 0,
      total_income: 0,
      total_expend: 0,
      gotExcelItems: false,
      bankAccountItems: [],
      bankAccountFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'type_str',
          label: 'Loại TK'
        },
        {
          key: 'account_name',
          label: 'Tên TK'
        },
        {
          key: 'account_number',
          label: 'Số TK'
        },
        {
          key: 'bank_name',
          label: 'Ngân hàng'
        },
        {
          key: 'amount',
          label: 'Số dư TK hiện tại',
          class: 'text-right'
        }
      ],
      isUserRoot: false,
    };
  },
  mounted() {
    if(this.$store.state.user && this.$store.state.user.isRoot) {
      this.isUserRoot = true
    } else {
      this.isUserRoot = false
    }
    window.addEventListener('scroll', this.onScroll)

    // Get default from date and to date
    this.prepareDateInput()

    this.getFundInfo();

    this.getOptionRelatedFund()

    this.search();
  },
  methods: {
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: "my-toast",
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      });
    },

    /**
     * Scroll event
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
          this.offset = this.offset + 10
          this.loadByScroll = true
          this.search()
        }
      }
    },

    goToAddIncome() {
      this.$router.push("/income")
    },
    goToAddExpend() {
      this.$router.push("/expend")
    },
    goToAddAccountingSlip() {
      this.$router.push("/accounting-slip")
    },

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
     * Get thông tin quỹ
     */
    getFundInfo() {
      this.loading = true
      fundApi.getFundInfo().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let data = res.data.data
            this.total = data.total
            this.cash = data.cash
            this.credit = data.credit
            this.total_net = data.total_net
            this.debt = data.debt
            this.public_debt = data.public_debt
            this.loan_pay = data.loan_pay
            this.loan_receive = data.loan_receive
            this.bankAccountItems = data.bank_account_infos

            // Handle fund class
            if(this.total >= 0) {
                this.total_class = "text-success"
            } else {
                this.total_class = "text-danger"
            }
            if(this.total_net >= 0) {
              this.total_net_class = "text-success"
            } else {
              this.total_net_class = "text-danger"
            }
        }
        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    getOptionRelatedFund() {
      this.loadingOptions = true

      let params = {
        bank_accounts: true,
        expend_income_groups: true,
        expend_income_types: true
      }

      fundApi.getOptionsRelatedFund(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // Bank account
          let bankAccounts = options.bank_accounts
          this.bankAccountOptions = [{value: null, text: ''}, {value: -1, text: 'Tiền mặt'}]
          if(bankAccounts) {
            for (let item of bankAccounts) {
              this.bankAccountOptions.push(item)
            }
          }

          // Nhóm thu chi
          let expend_income_groups = options.expend_income_groups
          this.incomeExpendGroupOptionsStore = JSON.parse(JSON.stringify(expend_income_groups))
          this.incomeExpendGroupOptions = [{value: null, text: ''}]
          for (let item of expend_income_groups) {
            let type = "Thu"
            if(item.type == 1) {
              type = "Chi"
            }
            if(item.type == 2) {
              type = "PKT"
            }
            let option = {
              value: item.id,
              text: type + " - " + item.name
            }
            this.incomeExpendGroupOptions.push(option)
          }

          // Loại thu chi
          let expend_income_types = options.expend_income_types
          this.incomeExpendTypeOptionsStore = JSON.parse(JSON.stringify(expend_income_types))
          this.incomeExpendTypeOptions = [{value: null, text: ''}]
          for (let item of expend_income_types) {
            let type = "Thu"
            if(item.type == 1) {
              type = "Chi"
            }
            if(item.type == 2) {
              type = "PKT"
            }
            let option = {
              value: item.id,
              text: type + " - " + item.name
            }
            this.incomeExpendTypeOptions.push(option)
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

    showModalListBankAccount() {
      this.$bvModal.show('modal-show-list-bank-account')
    },

    hideModalListBankAccount() {
      this.$bvModal.hide('modal-show-list-bank-account')
    },

    changeGroup() {
      this.incomeExpendTypeOptions = [{value: null, text: ''}]
      let expend_income_types = JSON.parse(JSON.stringify(this.incomeExpendTypeOptionsStore))
      if(this.expendIncomeGroupSelect.length > 0) {
        for(let group of this.expendIncomeGroupSelect) {
          for (let item of expend_income_types) {
            if(item.group_id == group.value) {
              let type = "Thu"
              if(item.type == 1) {
                type = "Chi"
              }
              if(item.type == 2) {
                type = "PKT"
              }
              let option = {
                value: item.id,
                text: type + " - " + item.name
              }
              this.incomeExpendTypeOptions.push(option)
            }
          }
        }

      } else {
        for (let item of expend_income_types) {
            let type = "Thu"
            if(item.type == 1) {
              type = "Chi"
            }
            if(item.type == 2) {
              type = "PKT"
            }
            let option = {
              value: item.id,
              text: type + " - " + item.name
            }
            this.incomeExpendTypeOptions.push(option)
        }
      }
      this.expendIncomeTypeSelect = []

    },

    clearDate() {
      this.inputs.accounting_date = null
    },

    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true

      this.gotExcelItems = false
      this.search()
    },

      /**
     * Get lịch sử quỹ
     */
      search () {
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
        let expend_income_group_ids = []
        for (let group of this.expendIncomeGroupSelect) {
          expend_income_group_ids.push(group.value)
        }
        let expend_income_type_ids = []
        for (let type of this.expendIncomeTypeSelect) {
          expend_income_type_ids.push(type.value)
        }

        let params = {
          "from_date": fromDate,
          "to_date": toDate,
          "bank_account": this.inputs.bank_account,
          "expend_income_group_ids": expend_income_group_ids,
          "expend_income_type_ids": expend_income_type_ids,
          "fund_number": this.inputs.fund_number,
          "amount": this.inputs.amount,
          "description": this.inputs.description,
          "accounting_date": this.inputs.accounting_date,
          "limit": this.pageLimit,
          "offset": this.offset
        }
        fundApi.getFundHistory(params).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            let it = res.data.data.fund_his
            this.totalRow = res.data.data.total_row
            this.start_period_amount = res.data.data.start_period_amount
            this.end_period_amount = res.data.data.end_period_amount
            this.total_income = res.data.data.total_income
            this.total_expend = res.data.data.total_expend

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

            if(!this.gotExcelItems) {
              this.getExcelItem(params)
            }
          } else {
            this.items = []
            this.excel_items = []
          }
          this.onSearch = false
      }).catch(err => {
        console.log("search fund his")
          console.log(err)
          this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    getExcelItem(params) {
      this.excel_items = []

      // Define params
      params.limit = 999999

      // Search
      fundApi.getFundHistory(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data.fund_his
          this.gotExcelItems = true
        }
      }).catch(err => {})
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

    editFund(item) {
      if(item.type == 0) {
        // Sửa phiếu thu
        this.$router.push('/income/' + item.id)
      }
      if(item.type == 1) {
        // Sửa phiếu chi
        this.$router.push('/expend/' + item.id)
      }
    },

    deleteFund (id, name) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            fundApi.deleteFund(id).then(res => {
              // Reload data
              this.prepareToSearch()
              this.getFundInfo();
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },
  }
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }
</style>
