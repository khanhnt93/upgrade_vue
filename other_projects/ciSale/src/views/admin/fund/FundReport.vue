<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <button class="btn btn-outline-danger float-right btn-width-160 ml-2" @click="minusMoney">
                  Thêm khoản chi
                </button>
                <button class="btn btn-outline-success float-right btn-width-160 ml-2" @click="plusMoney">
                  Thêm khoản thu
                </button>

              </div>
            </div>
            <h2 class="text-center text-header">Báo Cáo Quỹ</h2>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h1 :class="[fund_class, 'text-center']" >{{formatCurrency(fund)}}đ</h1>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/3 px-2">
                <p>Tiền mặt: {{formatCurrency(cash)}}đ</p>
              </div>
              <div class="w-full md:w-1/3 px-2">
                <p>Tài khoản NH: {{formatCurrency(credit)}}đ</p>
              </div>
              <div class="w-full md:w-1/3 px-2">
                <p>Tiền điện tử: {{formatCurrency(e_money)}}đ</p>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/2 px-2">
                <p>Nợ công (Nợ phải trả) sắp tới: <span class="text-danger">{{formatCurrency(public_debt)}}đ</span></p>
              </div>
              <div class="w-full md:w-1/2 px-2">
                <p>Công nợ (Nợ cần thu hồi) sắp tới: <span class="text-success">{{formatCurrency(debit)}}đ</span></p>
              </div>
            </div>

          </div>
        </div>

        <div class="card">
          <div class="p-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h3 class="text-header text-center">Lịch Sử Quỹ</h3>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/3 px-2">
                <label> Từ ngày </label>
                <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" :typeable="true"
                            placeholder="yyyy-mm-dd" input-class="datepicker-cus" ></datepicker>
              </div>

              <div class="w-full md:w-1/3 px-2">
                <label> Đến ngày </label>
                <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" :typeable="true"  ></datepicker>
              </div>
              <div class="w-full md:w-1/3 px-2 flex flex-col items-end">
                <label class="invisible">
                   Xem
                </label>
                <button class="btn btn-outline-primary float-right btn-width-120" :disabled="onSearch" @click="getFundHistory">
                  Xem
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{items.length}}</b></span></div>

                <button
                  class="btn btn-default text-header btn-width-120 float-right"
                  @click="exportToExcel(items, excel_fields, 'Danh sách nợ thu hồi.xls', 'Danh sách nợ thu hồi')"
                  title="Xuất Excel">
                <b>Xuất Excel</b>
                </button>
              </div>
            </div>

          <!-- Loading -->
          <span class="loading-more" v-show="onSearch"><i class="fa fa-spinner fa-spin fa-3x text-primary"></i></span>

          <div class="p-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
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
                      <td class="text-right total font-weight-bold text-header">{{formatCurrency(total_plus)}}đ</td>
                      <td class="text-right total font-weight-bold text-header">{{formatCurrency(total_minus)}}đ</td>
                      <td class="text-right total font-weight-bold text-header">{{formatCurrency(total_cash)}}đ</td>
                      <td class="text-right total font-weight-bold text-header">{{formatCurrency(total_credit)}}đ</td>
                      <td class="text-right total font-weight-bold text-header">{{formatCurrency(total_e_money)}}đ</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr v-for="(item) in items">
                      <td>{{item.stt}}</td>
                      <td>{{item.created_at}}</td>
                      <td>{{item.type_str}}</td>
                      <td class="text-right">{{formatCurrency(handleAmountPlus(item.type, item.amount))}}đ</td>
                      <td class="text-right">{{formatCurrency(handleAmountMinus(item.type, item.amount))}}đ</td>
                      <td class="text-right">{{formatCurrency(item.cash)}}đ</td>
                      <td class="text-right">{{formatCurrency(item.credit)}}đ</td>
                      <td class="text-right">{{formatCurrency(item.e_money)}}đ</td>
                      <td class="text-right">{{formatCurrency(item.fund)}}đ</td>
                      <td>{{item.note}}</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Modal plus/minus money-->
    <TransitionRoot appear :show="modalChangeMoney" as="template">
      <Dialog as="div" @close="cancelChangeMoney" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h5" class="text-center">
                  {{modalTitle}}
                </DialogTitle>
                <hr class="my-3">

                <div class="flex flex-wrap -mx-2">
                  <div class="w-full px-2">
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
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2">
                  <div class="w-full px-2">
                    <div class="form-group">
                      <label>{{moneyContent}}</label><span class="error-sybol"></span>
                      <textarea
                        rows="5"
                        class="form-control"
                        v-model="fundUpdate.note">
                      </textarea>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2">
                  <div class="w-full px-2">
                    <div class="flex flex-wrap -mx-2 mt-2">
                      <div class="w-full px-2">
                        <label>Tiền mặt</label>
                        <input
                          type="text"
                          autocomplete="new-password"
                          class="form-control"
                          maxlength="14"
                          v-model="fundUpdate.cash"
                          @keyup="integerOnly($event.target)"
                          @change="changeCash()">
                      </div>
                    </div>

                    <div class="flex flex-wrap -mx-2 mt-2">
                      <div class="w-full px-2">
                        <label>Chuyển khoản</label>
                        <input
                          type="text"
                          autocomplete="new-password"
                          class="form-control"
                          maxlength="14"
                          v-model="fundUpdate.credit"
                          @keyup="integerOnly($event.target)"
                          @change="changeCredit()">
                      </div>
                    </div>

                    <div class="flex flex-wrap -mx-2 mt-2">
                      <div class="w-full px-2">
                        <label>Tiền điện tử</label>
                        <input
                          type="text"
                          autocomplete="new-password"
                          class="form-control"
                          maxlength="14"
                          v-model="fundUpdate.e_money"
                          @keyup="integerOnly($event.target)"
                          @change="changeEMoney()">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2">
                  <div class="w-full md:w-1/3 px-2 text-left mt-3">
                    <button class="btn btn-danger px-4" @click="cancelChangeMoney">
                      Hủy
                    </button>
                  </div>
                  <div class="w-full md:w-2/3 px-2 text-right mt-3">
                    <button class="btn btn-primary px-4 default-btn-bg" @click="confirmChangeMoney" :disabled="saving">
                      Xác nhận
                    </button>
                  </div>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import fundAPI from "@/api/fund";
import commonFunc from "@/common/commonFunc";
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import { useExcelExport } from '@/composables/useExcelExport'
import moment from 'moment'
// import JsonExcel from 'vue-json-excel' // TODO: Replace with xlsx library


export default {
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    Datepicker
  },
  setup() {
    const { toast } = useToast()
    const { formatCurrency, currencyFormat } = useFormatters()
    const { exportToExcel } = useExcelExport()

    return {
      toast,
      formatCurrency,
      currencyFormat,
      exportToExcel
    }
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
      modalChangeMoney: false,
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
    this.inputs.to_date = dateNow
    let fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 6)
    this.inputs.from_date = fromDate

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
      this.toast(content, variant)
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
        this.popToast('error', errorMess)
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
        let params = {
           ...this.inputs,
           from_date: moment(this.inputs.from_date).format('YYYY-MM-DD'),
           to_date: moment(this.inputs.to_date).format('YYYY-MM-DD')
        }
      fundAPI.getFundHistory(params).then(res => {
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
        this.popToast('error', errorMess)
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
      this.fundUpdate.total = ""
      this.fundUpdate.note = ""
      this.fundUpdate.cash = 0
      this.fundUpdate.credit = 0
      this.fundUpdate.e_money = 0
      this.modalChangeMoney = true
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
      this.fundUpdate.total = ""
      this.fundUpdate.note = ""
      this.fundUpdate.cash = 0
      this.fundUpdate.credit = 0
      this.fundUpdate.e_money = 0
      this.modalChangeMoney = true
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
      this.modalChangeMoney = false
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
      this.modalChangeMoney = false
    },

    /**
     * Confirm change money
     */
    confirmChangeMoney() {
      // Check validate
      if(!this.fundUpdate.total) {
        this.popToast('error', "Vui lòng nhập số tiền")
        return
      }
      if(!this.fundUpdate.note) {
        this.popToast('error', "Vui lòng nhập nội dung")
        return
      }

      let total = parseInt((this.fundUpdate.total + '').replaceAll(",", "") || 0)
      let cash = parseInt((this.fundUpdate.cash + '').replaceAll(",", "") || 0)
      let credit = parseInt((this.fundUpdate.credit + '').replaceAll(",", "") || 0)
      let e_money = parseInt((this.fundUpdate.e_money + '').replaceAll(",", "") || 0)

      if(total != cash + credit + e_money) {
        this.popToast('error', "Tổng loại tiền phải bằng số tiền nhập")
        return
      }
      this.fundUpdate.total = total
      this.fundUpdate.cash = cash
      this.fundUpdate.credit = credit
      this.fundUpdate.e_money = e_money

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
          this.popToast('error', errorMess)
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
