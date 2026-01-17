<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">{{title_prefix}} Khoản Thu</h4>
              </b-col>
            </b-row>
            <hr/>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày tạo<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <datepicker v-model="inputs.date_input" format="yyyy-MM-dd"
                  placeholder="yyyy-MM-dd"  input-class="datepicker-cus" @input="changeDateInput"></datepicker>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Ngày hoạch toán<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <datepicker v-model="inputs.accounting_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Loại thu<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9">
                <div class="input-group">
                  <input type="radio" v-model="inputs.sub_type" name="sub_type" :value="0" class="mt-2"
                         id="sub_type_0" @change="changeSubType('0')">
                  <label class="ml-4 mt-1" for="sub_type_0">Thu thường</label>
                  <input type="radio" v-model="inputs.sub_type" name="sub_type" :value="1" class="ml-5 mt-2"
                         id="sub_type_1" @change="changeSubType('1')">
                  <label class="ml-4 mt-1" for="sub_type_1">Thu trả hàng</label>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Khoản thu cho ĐH</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <label v-if="isEditFund">
                  {{inputs.order_sell_number ? inputs.order_sell_number : inputs.order_buy_number}}
                </label>
                <!--Đơn hàng bán-->
                <div class="input-group" v-if="inputs.sub_type == 0 && !isEditFund">
                  <multiselect
                    v-model="orderSellSelect"
                    :options="orderSellOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn từ đơn hàng bán--"
                    label="name"
                    track-by="name"
                    @input="changeOrderSell">
                  </multiselect>

                  <b-button variant="outline-primary" class="pull-right ml-2" title="Tìm kiếm"
                            @click="showModalSearchOrderSell" >
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>

                <!--Đơn hàng nhập-->
                <div class="input-group" v-if="inputs.sub_type == 1 && !isEditFund">
                  <multiselect
                    v-model="orderBuySelect"
                    :options="orderBuyOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn từ đơn hàng nhập--"
                    label="name"
                    track-by="name"
                    @input="changeOrderBuy">
                  </multiselect>

                  <b-button variant="outline-primary" class="pull-right ml-2" title="Tìm kiếm"
                            @click="showModalSearchOrderBuy" >
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Đối tượng thu</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <input type="radio" v-model="inputs.object_type" name="object_type" :value="0" class="mt-2"
                         id="object_type_0">
                  <label class="ml-4 mt-1" for="object_type_0">Khách hàng</label>
                  <input type="radio" v-model="inputs.object_type" name="object_type" :value="1" class="ml-5 mt-2"
                         id="object_type_1">
                  <label class="ml-4 mt-1" for="object_type_1">Nhà cung cấp</label>
                  <input type="radio" v-model="inputs.object_type" name="object_type" :value="2" class="ml-5 mt-2"
                         id="object_type_2">
                  <label class="ml-4 mt-1" for="object_type_2">Nhân viên</label>
                  <input type="radio" v-model="inputs.object_type" name="object_type" :value="3" class="ml-5 mt-2"
                         id="object_type_3">
                  <label class="ml-4 mt-1" for="object_type_3">Khác</label>
                </div>
                <div class="input-group">
                  <!--Khách hàng-->
                  <multiselect
                    v-show="inputs.object_type==0"
                    v-model="customerSelect"
                    :options="customerOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn khách hàng--"
                    label="text"
                    track-by="text">
                  </multiselect>

                  <!--Nhà cung cấp-->
                  <multiselect
                    v-show="inputs.object_type==1"
                    v-model="supplierSelect"
                    :options="supplierOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn nhà cung cấp--"
                    label="name"
                    track-by="name">
                  </multiselect>

                  <!--Nhân viên-->
                  <multiselect
                    v-show="inputs.object_type==2"
                    v-model="staffSelect"
                    :options="staffOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn nhân viên--"
                    label="name"
                    track-by="name">
                  </multiselect>

                  <!--Đối tượng khác-->
                  <input
                    v-show="inputs.object_type==3"
                    v-model="inputs.object_other_name"
                    id="object_type_other"
                    type="text"
                    maxlength="255"
                    autocomplete="new-password"
                    class="form-control">
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Số tiền<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <input
                  id="amount"
                  type="text"
                  class="form-control"
                  v-model="inputs.amount"
                  autocomplete="new-password"
                  @keyup="integerPointAndCommaOnly($event.target)"
                  @change="changeAmount"
                  maxlength="14">
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Sổ khoản thu<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <input type="radio" v-model="inputs.money_type" name="money_type" :value="1" class="mt-2"
                         id="money_type_1">
                  <label class="ml-4 mt-1" for="money_type_1">Chuyển khoản</label>
                  <input type="radio" v-model="inputs.money_type" name="money_type" :value="0" class="ml-5 mt-2"
                         id="money_type_0">
                  <label class="ml-4 mt-1" for="money_type_0">Tiền mặt</label>
                  <input v-if="isDebtRelief" type="radio" v-model="inputs.money_type" name="money_type" :value="2" class="ml-5 mt-2"
                         id="money_type_2">
                  <label v-if="isDebtRelief" class="ml-4 mt-1" for="money_type_2">Khác</label>
                </div>
                <div class="input-group">
                  <b-form-select
                    v-show="inputs.money_type==1"
                    :options="bankAccountOptions"
                    v-model="inputs.bank_account_id"
                    @change="changeBankAccount"
                    :disabled="inputs.money_type==0">
                  </b-form-select>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Nhóm khoản thu<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select :options="incomeGroupOptions"
                               v-model="inputs.expend_income_group_id"
                               @change="changeIncomeGroup"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Loại khoản thu<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select :options="incomeTypeOptions" v-model="inputs.expend_income_type_id"
                               :disabled="!inputs.expend_income_group_id" @change="updateDescription"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Diễn giải nội dung</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-textarea
                  id="description"
                  v-model="inputs.description"
                  style="width:100%;"
                  rows="2"></b-form-textarea>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12" class="text-center">
                <b-button variant="outline-secondary" class="pull-left btn-width-120 mt-2" @click="back">
                  Huỷ
                </b-button>

                <b-button  v-show="!saving" variant="outline-success" class="pull-right btn-width-120 mt-2"
                           @click="save" :disabled="saving">
                  Xác nhận
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!--Modal tìm kiếm đơn hàng bán -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-order-sell">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tìm kiếm đơn hàng bán</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="6">
          <label> Mã đơn hàng </label>
          <input
            id="order_sell_number"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="orderSellSearch.order_sell_number"
            maxlength="15">
        </b-col>
        <b-col md="6">
          <label> Tên khách hàng </label>
          <input
            id="customer_name"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="orderSellSearch.customer_name"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalSearchOrderSell">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchOrderSell"
                    @click.prevent="searchOrderSell">
            Tìm Kiếm
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="orderSellSearchFields"
            :items="orderSellSearchItems">
            <template v-slot:cell(actions)="data">
              <b-button variant="outline-success" class="pull-right btn-width-120"
                        @click.prevent="chooseOrderSell(data.item.id, data.item.customer_id)">
                Chọn
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <p class="text-center">---Hết---</p>
        </b-col>
      </b-row>

    </b-modal>

    <!--Modal tìm kiếm đơn hàng nhập -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-order-buy">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tìm kiếm đơn hàng nhập</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="6">
          <label> Mã đơn hàng nhập </label>
          <input
            id="order_buy_number"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="orderBuySearch.order_buy_number"
            maxlength="15">
        </b-col>
        <b-col md="6">
          <label> Tên nhà cung cấp </label>
          <input
            id="supplier_name"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="orderBuySearch.supplier_name"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalSearchOrderBuy">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchOrderBuy"
                    @click.prevent="searchOrderBuy">
            Tìm Kiếm
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="orderBuySearchFields"
            :items="orderBuySearchItems">
            <template v-slot:cell(actions)="data">
              <b-button variant="outline-success" class="pull-right btn-width-120"
                        @click.prevent="chooseOrderBuy(data.item.id, data.item.supplier_id)">
                Chọn
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <p class="text-center">---Hết---</p>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>
<script>


import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      title_prefix: 'Thêm Mới',
      inputs: {
        "id": null,
        "type": 0,
        "sub_type": 0,
        "date_input": null,
        "accounting_date": null,
        "order_type": 0,
        "order_sell_id": null,
        "order_buy_id": null,
        "object_type": 0,
        "supplier_id": null,
        "customer_id": null,
        "staff_id": null,
        "object_other_name": null,
        "amount": 0,
        "money_type": 1,
        "bank_account_id": null,
        "expend_income_group_id": null,
        "expend_income_type_id": null,
        "description": null
      },
      loadingOptions: false,
      orderSellSelect: {},
      orderSellOptions: [],
      orderBuySelect: {},
      orderBuyOptions: [],
      customerSelect: {},
      customerOptions: [],
      supplierSelect: {},
      supplierOptions: [],
      staffSelect: {},
      staffOptions: [],
      bankAccountOptions: [],
      incomeGroupOptions: [],
      incomeTypeOptions: [],
      incomeTypeOptionStore: [],
      saving: false,
      orderSellSearchItems: [],
      orderSellSearchFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'created_at',
          label: 'Ngày lập'
        },
        {
          key: 'order_sell_number',
          label: 'Số ĐH'
        },
        {
          key: 'customer_name',
          label: 'Tên K.H'
        },
        {
          key: 'total',
          label: 'Thành tiền'
        },
        {
          key: 'staff_on_charge_name',
          label: 'NV phụ trách'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      onSearchOrderSell: false,
      orderSellSearch: {
        order_sell_number: null,
        customer_name: null
      },
      orderBuySearchItems: [],
      orderBuySearchFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'created_at',
          label: 'Ngày lập'
        },
        {
          key: 'order_buy_number',
          label: 'Số ĐH'
        },
        {
          key: 'supplier_name',
          label: 'Tên nhà cung cấp'
        },
        {
          key: 'total',
          label: 'Thành tiền'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      onSearchOrderBuy: false,
      orderBuySearch: {
        order_buy_number: null,
        supplier_name: null
      },
      isIncomeFromOrderSell: false,
      isProductBack: false,
      isIncomeFromOrderBuy: false,
      isEditFund: false,
      isDebtRelief: false,
    }
  },
  mounted() {
    let url = location.href
    if(url.includes("income-from-order-sell")) {
        this.isIncomeFromOrderSell = true
      } else if(url.includes("income-from-product-back")){
        this.isProductBack = true
      } else if(url.includes("income-from-order-buy")) {
        this.isIncomeFromOrderBuy = true
        // Xoa no
        let isDebtRelief = this.$router.currentRoute.query.isDebtRelief
        if(isDebtRelief) {
          this.inputs.money_type = 2
          this.isDebtRelief = true
        }
      } else if(url.includes("income/")) {
        let fundHisId = this.$route.params.fundHisId
        if(fundHisId) {
          this.isEditFund = true
          // Get fund detail
          this.getFundDetail(fundHisId)
        }
      }

    let dateNow = new Date()
    this.inputs.date_input = dateNow.toJSON().slice(0,10)
    this.inputs.accounting_date = dateNow.toJSON().slice(0,10)

    // Get options related fund
    this.getOptionRelatedFund()
  },
  methods: {



    checkCreatedFromOrderSell() {
      // Check tạo đơn hàng nhập từ đơn hàng bán
      if(this.isIncomeFromOrderSell) {
        let orderSellId = this.$route.params.id
        this.chooseOrderSell(orderSellId, null)
      }
    },

    /**
     *  Get detail
     */
    getFundDetail(fundHisId) {
      if(fundHisId) {
        this.title_prefix = 'Cập Nhật'
        fundApi.getFundHisDetail(fundHisId).then(res => {
          if(res != null && res.data != null && res.data.data != null){
            this.inputs = res.data.data
            if(this.inputs.customer_id) {
              this.getCustomerById(this.inputs.customer_id)
            }
            if(this.inputs.supplier_id) {
              this.getSupplierById(this.inputs.supplier_id)
            }
            if(this.inputs.staff_id) {
              this.getStaffById(this.inputs.staff_id)
            }
            this.inputs.amount = this.currencyFormat(this.inputs.amount)

            if(this.inputs.expend_income_group_id && this.incomeTypeOptions.length > 0) {
              this.changeIncomeGroup()
            }
          }
        }).catch(err => {
          // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
        })
      } else {
        this.title_prefix = 'Thêm Mới'
      }
    },

    /**
     * Get options related fund
     */
    getOptionRelatedFund() {
      this.loadingOptions = true

      let params = {
        order_sells: true,
        order_buys_back: true,
        customers: true,
        suppliers: true,
        staffs: true,
        bank_accounts: true,
        type: 0,
        expend_income_groups: true,
        expend_income_types: true
      }
      if(this.isEditFund) {
        params.order_buys_back = false
        params.order_sells = false
      }
      if(this.isDebtRelief) {
        params.order_buys_back = false
          params.order_sells = false
          params.order_buys = true
      }

      fundApi.getOptionsRelatedFund(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.customerOptions = options.customers
          if(this.inputs.customer_id) {
            this.getCustomerById(this.inputs.customer_id)
          }
          this.supplierOptions = options.suppliers
          if(this.inputs.customer_id) {
            this.getSupplierById(this.inputs.supplier_id)
          }

          this.orderSellOptions = options.order_sells
          this.checkCreatedFromOrderSell()

          if(this.isProductBack || this.isIncomeFromOrderBuy) {
            this.inputs.sub_type = 1
            this.inputs.object_type = 1

            this.orderBuyOptions = options.order_buys
            let orderBuyId = this.$route.params.id
              if(orderBuyId) {
                  this.chooseOrderBuy(orderBuyId, null)
              }
          }

          this.staffOptions = options.staffs
          if(this.inputs.staff_id) {
            this.getStaffById(this.inputs.staff_id)
          }
          this.bankAccountOptions = options.bank_accounts

          this.incomeGroupOptions = []
          let income_groups = options.expend_income_groups
          for(let item of income_groups) {
              let option = {"value": item.id, "text": item.name}
              this.incomeGroupOptions.push(option)
          }

          this.incomeTypeOptions = options.expend_income_types
          this.incomeTypeOptionStore = options.expend_income_types

          if(this.isIncomeFromOrderBuy && this.isDebtRelief) {
            for(let item of income_groups) {
              if(item.code == 'thu_khac') {
                this.inputs.expend_income_group_id = item.id
                this.changeIncomeGroup()
                break
              }
            }
          } else {
            if(this.inputs.expend_income_group_id) {
              this.changeIncomeGroup()
            }
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

    updateDescription() {
      let income_type_text = ""
      if(this.inputs.expend_income_type_id) {
        income_type_text = commonFunc.getTextByValueOfSelectedBox(this.incomeTypeOptions, this.inputs.expend_income_type_id)
      }
      let order_name = ""
      if(this.orderSellSelect && this.orderSellSelect.id) {
        order_name = this.orderSellSelect.name
      } else {
          if (this.orderBuySelect && this.orderBuySelect.id) {
              order_name = this.orderBuySelect.name

              if (this.supplierSelect && this.supplierSelect.name) {
                  order_name += " - " + this.supplierSelect.name
              }
          }
      }

      if(this.inputs.description && !this.inputs.description.includes(income_type_text) && !this.inputs.description.includes(order_name) ) {
        return;
      }
      let description_str = income_type_text + " - " + order_name
        if(description_str.substring(0, 3) == " - ") {
            description_str = description_str.substring(3, description_str.length)
        }
        if(description_str.substring(description_str.length - 3, description_str.length) == " - ") {
            description_str = description_str.substring(0, description_str.length - 3)
        }

      if(this.isDebtRelief) {
        description_str = 'Lý do xóa nợ: ' + description_str
      }

      this.inputs.description = description_str
    },

    /**
     *  Save
     */
    save () {
      // Check validate
      if(this.inputs.money_type == 0 || this.inputs.money_type == 2) {
        this.inputs.bank_account_id = -1
      } else {
          if(!this.inputs.bank_account_id) {
            this.popToast('danger', "[Sổ khoản thu] là mục bắt buộc nhập")
            return;
          }
      }

      if(!this.inputs.expend_income_group_id) {
        this.popToast('danger', "[Nhóm khoản thu] là mục bắt buộc nhập")
        return;
      }
      if(!this.inputs.expend_income_type_id) {
        this.popToast('danger', "[Loại Khoản thu] là mục bắt buộc nhập")
        return;
      }

      if(this.orderSellSelect && this.orderSellSelect.id) {
        this.inputs.order_sell_id = this.orderSellSelect.id
      }
      if(this.orderBuySelect && this.orderBuySelect.id) {
        this.inputs.order_buy_id = this.orderBuySelect.id
      }
      switch(this.inputs.object_type) {
        case 0:
          if(this.customerSelect && this.customerSelect.value) {
            this.inputs.customer_id = this.customerSelect.value
          } else {
            this.inputs.customer_id = null
          }
          this.inputs.supplier_id = null
          this.inputs.staff_id = null
          this.inputs.object_other_name = null
          break;
        case 1:
          if(this.supplierSelect && this.supplierSelect.id) {
            this.inputs.supplier_id = this.supplierSelect.id
          } else {
            this.inputs.supplier_id = null
          }
          this.inputs.customer_id = null
          this.inputs.staff_id = null
          this.inputs.object_other_name = null
          break;
        case 2:
          if(this.staffSelect && this.staffSelect.id) {
            this.inputs.staff_id = this.staffSelect.id
          } else {
            this.inputs.staff_id = null
          }
          this.inputs.customer_id = null
          this.inputs.supplier_id = null
          this.inputs.object_other_name = null
          break;
        case 3:
          this.inputs.customer_id = null
          this.inputs.supplier_id = null
          this.inputs.staff_id = null
          break;
        default:
          this.inputs.customer_id = null
          this.inputs.supplier_id = null
          this.inputs.staff_id = null
          this.inputs.object_other_name = null
      }

      let amount = (this.inputs.amount + "").replaceAll(",", "")
      if(amount == "") {
        this.popToast('danger', "Vui lòng nhập [Số tiền*]")
        return;
      }
      amount = parseInt(amount)
      if(amount < 0) {
        this.popToast('danger', "Không thể nhập [Số tiền*] âm")
        return;
      }
      this.inputs.amount = amount

      // Add
      this.saving = true
      if(this.inputs.id) {
        fundApi.updateIncome(this.inputs).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.$router.push("/fund")
            }
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        fundApi.addIncome(this.inputs).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.$router.push("/fund")
            }
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }


    },

    /**
     * Only input integer
     */
    integerPointAndCommaOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerPointAndCommaOnly(valueInput)
      item.value = result
    },

    /**
     * Back to list
     */
    back() {
      this.$router.push("/fund")
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

      changeAmount() {
        let amount = (this.inputs.amount + "").replaceAll(",", "")
        this.inputs.amount = this.currencyFormat(amount)
      },

      getCustomerById(customerId) {
        for(let customer of this.customerOptions) {
            if(customer.value == customerId) {
                this.customerSelect = customer
                break
            }
        }
        return {}
      },
    getStaffById(staffId) {
        for(let staff of this.staffOptions) {
            if(staff.id == staffId) {
                this.staffSelect = staff
                break
            }
        }
        return {}
      },

      checkIssueInvoice () {
        if(!this.orderSellSelect.issue_invoice) {
            if(this.inputs.bank_account_id) {
              for(let ba of this.bankAccountOptions) {
                if(this.inputs.bank_account_id == ba.value) {
                  if(ba.text.includes("Cty")) {
                    this.$bvModal.msgBoxOk("Bạn chọn mục [Sổ khoản thu] là tài khoản Cty nhưng đơn hàng này không mong muốn [Xuất VAT]. Vui lòng kiểm tra lại!", {
                      title: "Cảnh báo!",
                      centered: true,
                      size: 'sm',
                      headerClass: 'bg-danger',
                    }).then(res => {})
                  }
                  break
                }
              }

            }
          }
      },

    changeOrderSell() {
      if(this.orderSellSelect && this.orderSellSelect.id) {
          this.inputs.amount = this.currencyFormat(this.orderSellSelect.total_remaining)
          if(this.orderSellSelect.customer_id) {
              this.getCustomerById(this.orderSellSelect.customer_id)
          }
          this.checkIssueInvoice()

      }

      // Cập nhật nội dung
      this.updateDescription()
    },

    changeBankAccount() {
      this.checkIssueInvoice()
    },

    showModalSearchOrderSell() {
      this.$bvModal.show('modal-search-order-sell')
    },

    hideModalSearchOrderSell() {
      this.$bvModal.hide('modal-search-order-sell')
    },

    searchOrderSell() {
      if (this.onSearchOrderSell) { return }

      this.onSearchOrderSell = true

      let params = {
        "order_sell_number": this.orderSellSearch.order_sell_number,
        "customer_name": this.orderSellSearch.customer_name,
        "limit": 100,
        "offset": 0
      }

      fundApi.searchOrderSell(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.orderSellSearchItems = res.data.data
        } else {
          this.orderSellSearchItems = []
        }
        this.onSearchOrderSell = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchOrderSell = false
      })
    },

    /**
     *  Event change quotation
     */
    chooseOrderSell(orderSellId, customerId) {
      if(orderSellId) {
        for(let item of this.orderSellOptions) {
          if(item.id == orderSellId) {
            this.orderSellSelect = item
            if(!this.inputs.amount) {
              this.inputs.amount = this.currencyFormat(this.orderSellSelect.total_remaining)
            }
            if(!customerId && this.orderSellSelect.customer_id) {
              this.getCustomerById(this.orderSellSelect.customer_id)
            }
            break
          }
        }
      }
      if(customerId) {
          this.getCustomerById(customerId)
      }
      this.hideModalSearchOrderSell()
    },

    changeIncomeGroup() {
      if(this.inputs.expend_income_group_id) {
        this.incomeTypeOptions = [{"value": null, "text": ""}]
        for(let item of this.incomeTypeOptionStore) {
          if(item.type == 0 && item.group_id == this.inputs.expend_income_group_id) {
            let typeItem = {"value": item.id, "text": item.name}
            this.incomeTypeOptions.push(typeItem)
          }
        }
      } else {
        this.incomeTypeOptions = []
      }
    },

    showModalSearchOrderBuy() {
      this.$bvModal.show('modal-search-order-buy')
    },

    hideModalSearchOrderBuy() {
      this.$bvModal.hide('modal-search-order-buy')
    },

    searchOrderBuy() {
      if (this.onSearchOrderBuy) { return }

      this.onSearchOrderBuy = true

      let params = {
        "order_buy_number": this.orderBuySearch.order_buy_number,
        "supplier_name": this.orderBuySearch.supplier_name,
        "limit": 100,
        "offset": 0
      }

      fundApi.searchOrderBuy(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.orderBuySearchItems = res.data.data
        } else {
          this.orderBuySearchItems = []
        }
        this.onSearchOrderBuy = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchOrderBuy = false
      })
    },

    /**
     *  Event change quotation
     */
    chooseOrderBuy(orderBuyId, supplierId) {
      if(orderBuyId) {
        for(let item of this.orderBuyOptions) {
          if(item.id == orderBuyId) {
            this.orderBuySelect = item
            if(!this.inputs.amount) {
              this.inputs.amount = this.currencyFormat(this.orderBuySelect.amount_remaining)
            }
            if(!supplierId && this.orderBuySelect.supplier_id) {
              this.getSupplierById(this.orderBuySelect.supplier_id)
            }
            break
          }
        }
      }
      if(supplierId) {
          this.getSupplierById(supplierId)
      }
      this.hideModalSearchOrderBuy()
    },

      getSupplierById(supplierId) {
        for(let supplier of this.supplierOptions) {
            if(supplier.id == supplierId) {
                this.supplierSelect = supplier
                break
            }
        }
        return {}
      },

    changeOrderBuy() {
      if(this.orderBuySelect && this.orderBuySelect.id) {
          this.inputs.amount = this.currencyFormat(this.orderBuySelect.total)
          if(this.orderBuySelect.supplier_id) {
              this.getSupplierById(this.orderBuySelect.supplier_id)
          }
      }

      // Cập nhật mô tả
      this.updateOrderBuyDescription()
    },

    updateOrderBuyDescription() {
      let expend_type_text = ""
      if(this.inputs.expend_income_type_id) {
        expend_type_text = commonFunc.getTextByValueOfSelectedBox(this.expendTypeOptions, this.inputs.expend_income_type_id)
      }
      let order_buy_name = ""
      if(this.orderBuySelect && this.orderBuySelect.id) {
        order_buy_name = this.orderBuySelect.name
      }

      if(this.inputs.description && !this.inputs.description.includes(expend_type_text)
          && !this.inputs.description.includes(order_buy_name) ) {
        return;
      }
      let description_str = expend_type_text + " - " + order_buy_name
        if(description_str.substring(0, 3) == " - ") {
            description_str = description_str.substring(3, description_str.length)
        }
        if(description_str.substring(description_str.length - 3, description_str.length) == " - ") {
            description_str = description_str.substring(0, description_str.length - 3)
        }
      if(this.isDebtRelief) {
        description_str = 'Lý do xóa nợ: ' + description_str
      }
      this.inputs.description = description_str
    },

      changeSubType(subType) {
        if(subType == 1) {
            this.inputs.object_type = 1
        } else {
            this.inputs.object_type = 0
        }
      },

    changeDateInput() {
      let dateNow = new Date()
      let today = dateNow.toJSON().slice(0,10)
      if(this.inputs.date_input != today && this.inputs.accounting_date == today) {
        this.inputs.accounting_date = JSON.parse(JSON.stringify(this.inputs.date_input))
      }
    }


  }
}
</script>
