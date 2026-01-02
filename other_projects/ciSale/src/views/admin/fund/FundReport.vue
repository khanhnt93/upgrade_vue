<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
              <b-button variant="outline-danger" class="pull-right btn-width-160 ml-2" @click="minusMoney">
                Thêm khoản chi
              </b-button>
              <b-button variant="outline-success" class="pull-right btn-width-160 ml-2" @click="plusMoney">
                Thêm khoản thu
              </b-button>

            </b-col>
          </b-row>
          <h2 class="text-center text-header">Báo Cáo Quỹ</h2>

          <b-row>
            <b-col>
              <h1 :class="fund_class" class="text-center">{{fund | format_currency}}đ</h1>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="4">
              <p>Tiền mặt: {{cash | format_currency}}đ</p>
            </b-col>
            <b-col md="4">
              <p>Tài khoản NH: {{credit | format_currency}}đ</p>
            </b-col>
            <b-col md="4">
              <p>Tiền điện tử: {{e_money | format_currency}}đ</p>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="4">
              <p>Nợ công (Nợ phải trả) sắp tới: <span class="text-danger">{{public_debt | format_currency}}đ</span></p>
            </b-col>
            <b-col md="4">
              <p>Công nợ (Nợ cần thu hồi) sắp tới: <span class="text-success">{{debit | format_currency}}đ</span></p>
            </b-col>
          </b-row>


        </b-card>

      <b-card>
        <b-row>
          <b-col>
            <h3 class="text-header text-center">Lịch Sử Quỹ</h3>
          </b-col>
        </b-row>

          <b-row>
            <b-col md="4">
              <label> Từ ngày </label>
              <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" :typeable="true"
                          placeholder="yyyy-mm-dd" input-class="datepicker-cus" ></datepicker>
            </b-col>

            <b-col md="4">
              <label> Đến ngày </label>
              <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
            </b-col>
            <b-col md="4">
              <label class="label-width text-white">
                 Xem
              </label>
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click="getFundHistory">
                Xem
              </b-button>
            </b-col>
          </b-row>

        <b-row>
            <b-col md="12">
              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{items.length}}</b></span></div>

              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "items"
                :fields = "excel_fields"
                worksheet = "Lịch sử quỹ"
                name    = "Lịch sử quỹ">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>

          <b-card-body class="p-4">
            <b-row>
              <b-col md="12">
                <table class="table table-bordered table-striped fixed_header">
                  <thead>
                    <tr>
                      <th class="text-center">STT</th>
                      <th class="text-center">Ngày</th>
                      <th class="text-center">Loại</th>
                      <th class="text-center">Số tiền thu</th>
                      <th class="text-center">Số tiền chi</th>
                      <th class="text-center">Tiền mặt</th>
                      <th class="text-center">Chuyển khoản</th>
                      <th class="text-center">Tiền điện tử</th>
                      <th class="text-center">Số tiền quỹ</th>
                      <th class="text-center">Nội dung</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="total text-center font-weight-bold text-header" :colspan="3">Tổng</td>
                      <td class="text-right total font-weight-bold text-header">{{total_plus | format_currency}}đ</td>
                      <td class="text-right total font-weight-bold text-header">{{total_minus | format_currency}}đ</td>
                      <td class="text-right total font-weight-bold text-header">{{total_cash | format_currency}}đ</td>
                      <td class="text-right total font-weight-bold text-header">{{total_credit | format_currency}}đ</td>
                      <td class="text-right total font-weight-bold text-header">{{total_e_money | format_currency}}đ</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr v-for="(item) in items">
                      <td>{{item.stt}}</td>
                      <td>{{item.created_at}}</td>
                      <td>{{item.type_str}}</td>
                      <td class="text-right">{{handleAmountPlus(item.type, item.amount) | format_currency}}đ</td>
                      <td class="text-right">{{handleAmountMinus(item.type, item.amount) | format_currency}}đ</td>
                      <td class="text-right">{{item.cash | format_currency}}đ</td>
                      <td class="text-right">{{item.credit | format_currency}}đ</td>
                      <td class="text-right">{{item.e_money | format_currency}}đ</td>
                      <td class="text-right">{{item.fund | format_currency}}đ</td>
                      <td>{{item.note}}</td>
                    </tr>

                  </tbody>
                </table>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal plus/minus money-->
    <b-modal :title="modalTitle" centered hide-footer id="modal-change-money">
      <b-row>
        <b-col>
          <div class="form-group">
            <label>{{moneyNumber}}</label><span class="error-sybol"></span>
            <input
              v-model="fundUpdate.total"
              type="text"
              autocomplete="new-password"
              class="form-control"
              maxlength="11"
              @keyup="integerOnly($event.target)"
            @change="changeCurrency($event.target)">
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="form-group">
            <label>{{moneyContent}}</label><span class="error-sybol"></span>
            <b-form-textarea
              rows="5"
              v-model="fundUpdate.note">
            </b-form-textarea>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-row content-class="mt-2">
            <b-col md="12">
              <label>Tiền mặt</label>
              <input
                type="text"
                autocomplete="new-password"
                class="form-control"
                maxlength="14"
                v-model="fundUpdate.cash"
                @keyup="integerOnly($event.target)"
                @change="changeCash()">
            </b-col>
          </b-row>

          <b-row content-class="mt-2">
            <b-col md="12">
              <label>Chuyển khoản</label>
              <input
                type="text"
                autocomplete="new-password"
                class="form-control"
                maxlength="14"
                v-model="fundUpdate.credit"
                @keyup="integerOnly($event.target)"
                @change="changeCredit()">
            </b-col>
          </b-row>

          <b-row content-class="mt-2">
            <b-col md="12">
              <label>Tiền điện tử</label>
              <input
                type="text"
                autocomplete="new-password"
                class="form-control"
                maxlength="14"
                v-model="fundUpdate.e_money"
                @keyup="integerOnly($event.target)"
                @change="changeEMoney()">
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="4" class="text-left mt-3">
          <button class="btn btn-danger px-4" @click="cancelChangeMoney">
            Hủy
          </button>
        </b-col>
        <b-col cols="8" class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" @click="confirmChangeMoney" :disabled="saving">
            Xác nhận
          </button>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>

<script>
import fundAPI from "@/api/fund";
import commonFunc from "@/common/commonFunc";
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      fund: 0,
      cash: 0,
      credit: 0,
      e_money: 0,
      debit: 0,
      public_debt: 0,
      loading: false,
      inputs: {
          from_date: null,
          to_date: null,
      },
      items: [],
      excel_fields: {
        'Ngày': 'created_at',
        'Loại' : 'type_str',
        'Số tiền' : 'amount',
        'Tiền mặt': 'cash',
        'Chuyển khoản': 'credit',
        'Tiền điện tử': 'e_money',
        'Số tiền quỹ': 'fund',
        'Nội dung': 'note',
      },
      total_plus: 0,
      total_minus: 0,
      total_cash: 0,
      total_credit: 0,
      total_e_money: 0,
      onSearch: false,
      fund_class: "text-success",
      click: false,
      modalTitle: "Thêm tiền thu",
      moneyNumber: "Số tiền",
      moneyContent: "Nội dung",
      fundUpdate: {
        type: null,
        total: null,
        note: null,
        cash: 0,
        credit: 0,
        e_money: 0
      },
      saving: false,
    };
  },
  computed: {
    errorFromDate: function () {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate: function () {
      return this.checkDate(this.inputs.toDate)
    },
  },
  mounted() {
    // Get default from date and to date
    let dateNow = new Date()
    this.inputs.to_date = dateNow.toJSON().slice(0,10)
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
    this.inputs.from_date = fromDate.toJSON().slice(0,10)

    this.getFundInfo();

    this.getFundHistory();
  },
  methods: {
    checkDate(dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkValidate() {
      return !(this.errorFromDate || this.errorToDate)
    },
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: "my-toast",
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      });
    },

    /**
     * Get thông tin quỹ
     */
    getFundInfo() {
      fundAPI.getFundInfo().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let data = res.data.data
            this.fund = data.fund
            this.cash = data.cash
            this.credit = data.credit
            this.e_money = data.e_money
            this.debit = data.debit
            this.public_debt = data.public_debt

            // Handle fund class
            let profit = parseInt(this.fund) - parseInt(this.public_debt) + parseInt(this.debit)
            if(profit >= 0) {
                this.fund_class = "text-success"
            } else {
                this.fund_class = "text-danger"
            }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      /**
     * Get lịch sử quỹ
     */
    getFundHistory() {
        this.click = true
        if (this.onSearch) { return }

        // if(!this.checkValidate()) {
        //   return
        // }

        this.onSearch = true
      fundAPI.getFundHistory(this.inputs).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data

            // Handle data
            this.calcTotal()
        }
        this.onSearch = false
      }).catch(err => {
          this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      calcTotal() {
        if (this.items.length > 0) {
            this.total_plus = 0
            this.total_minus = 0
            this.total_cash = 0
            this.total_credit = 0
            this.total_e_money = 0
            for(let i in this.items) {
                if(this.items[i].type == 0) {
                    this.total_plus += this.items[i].amount
                }
                if(this.items[i].type == 1) {
                    this.total_minus += this.items[i].amount
                }
                this.total_cash += this.items[i].cash
                this.total_credit += this.items[i].credit
                this.total_e_money += this.items[i].e_money
            }
        }
      },

      handleAmountPlus(type, amount) {
        if(type == 0) {
            return amount
        }
        return 0
      },

      handleAmountMinus(type, amount) {
        if(type == 1) {
            return amount
        }
        return 0
      },

    /**
     * Plus money
     */
    plusMoney() {
      this.click = false
      this.modalTitle = "Thêm tiền thu"
      this.moneyNumber = "Số tiền thêm"
      this.moneyContent = "Nội dung thêm"
      this.fundUpdate.type = 0
      this.$bvModal.show('modal-change-money')
    },

    /**
     * Minus money
     */
    minusMoney() {
      this.click = false
      this.modalTitle = "Thêm tiền chi"
      this.moneyNumber = "Số tiền chi"
      this.moneyContent = "Nội dung chi"
      this.fundUpdate.type = 1
      this.$bvModal.show('modal-change-money')
    },

    /**
     * Event key up money number
     */
    changeMoneyNumber(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
        result = this.currencyFormat(result)
      item.value = result
      this.fundUpdate.cash = result
    },

      /**
     * Event key up money number
     */
    changeCurrency() {
      // let valueInput = item.value
      //     valueInput = valueInput.replaceAll(",", "")
      // let result = commonFunc.intergerOnly(valueInput)
      //   result = this.currencyFormat(result)
      // item.value = result
        if(this.fundUpdate.total) {
            let cash = (JSON.parse(JSON.stringify(this.fundUpdate.total)) + '').replaceAll(",", "")
            this.fundUpdate.total = this.currencyFormat(cash)

            this.fundUpdate.cash = JSON.parse(JSON.stringify(this.fundUpdate.total))
        }
    },

      changeCash() {
        if(this.fundUpdate.cash) {
            let cash = (JSON.parse(JSON.stringify(this.fundUpdate.cash)) + '').replaceAll(",", "")
          this.fundUpdate.cash = this.currencyFormat(cash)
        }

      },

      changeCredit() {
        if(this.fundUpdate.credit) {
            let cash = (JSON.parse(JSON.stringify(this.fundUpdate.credit)) + '').replaceAll(",", "")
            this.fundUpdate.credit = this.currencyFormat(cash)
        }
      },

      changeEMoney() {
        if(this.fundUpdate.e_money) {
            let cash = (JSON.parse(JSON.stringify(this.fundUpdate.e_money)) + '').replaceAll(",", "")
            this.fundUpdate.e_money = this.currencyFormat(cash)
        }
      },

    /**
     * Cancel change money
     */
    cancelChangeMoney() {
      this.$bvModal.hide('modal-change-money')
    },
    /**
     * Reset modal
     */
    resetModal() {
      this.modalTitle = "Thêm tiền"
      this.moneyNumber = "Số tiền"
      this.moneyContent = "Nội dung"
      this.fundUpdate.type = null
      this.fundUpdate.total = null
      this.fundUpdate.note = null
      this.fundUpdate.cash = 0
      this.fundUpdate.credit = 0
      this.fundUpdate.e_money = 0
      this.$bvModal.hide('modal-change-money')
    },

    /**
     * Confirm change money
     */
    confirmChangeMoney() {
      // Check validate
      if(!this.fundUpdate.total) {
        this.popToast('danger', "Vui lòng nhập số tiền")
        return
      }
      if(!this.fundUpdate.note) {
        this.popToast('danger', "Vui lòng nhập nội dung")
        return
      }

      if(parseInt((this.fundUpdate.total + '').replaceAll(",", "")) !=
          parseInt((this.fundUpdate.cash + '').replaceAll(",", ""))
          + parseInt((this.fundUpdate.credit + '').replaceAll(",", ""))
          + parseInt((this.fundUpdate.e_money + '').replaceAll(",", ""))) {
        this.popToast('danger', "Tổng loại tiền phải bằng số tiền nhập")
        return
      }
      this.fundUpdate.total = (this.fundUpdate.total +'').replaceAll(",", "")
        this.fundUpdate.cash = (this.fundUpdate.cash +'').replaceAll(",", "")
        this.fundUpdate.credit = (this.fundUpdate.credit +'').replaceAll(",", "")
        this.fundUpdate.e_money = (this.fundUpdate.e_money +'').replaceAll(",", "")

        this.saving = true
        // Call api, update data
        fundAPI.updateMoney(this.fundUpdate).then(res => {
          if (res != null && res.data != null) {
            this.popToast('success', "Thao tác thành công!")

            this.getFundInfo();

            this.getFundHistory();

            // Reset modal
            this.resetModal()
          }
          this.saving = false
        }).catch(err => {
          this.saving = false
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
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
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }


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
