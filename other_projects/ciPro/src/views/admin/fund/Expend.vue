<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center text-header">{{title_prefix}} Khoản Chi</h4>
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
                <label>Khoản chi cho ĐH</label>
              </b-col>
              <b-col md="9" class="mt-2">
                <label v-if="isEditFund">
                  {{inputs.order_sell_number ? inputs.order_sell_number : inputs.order_buy_number}}
                </label>
                <label v-if="inputs.loan_id">
                  Khoản vay: {{inputs.object_other_name}}
                </label>
                <!--Đơn hàng nhập-->
                <div class="input-group" v-if="inputs.sub_type == 0 && !isEditFund">
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
                <!--Đơn hàng bán-->
                <div class="input-group" v-if="inputs.sub_type == 1 && !isEditFund">
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
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Đối tượng chi</label>
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
                <label>Sổ khoản chi<span class="error-sybol"></span></label>
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
                    v-model="inputs.bank_account_id" :disabled="inputs.money_type==0">
                  </b-form-select>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Nhóm khoản chi<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select :options="expendGroupOptions"
                               v-model="inputs.expend_income_group_id"
                               @change="changeExpendGroup"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Loại khoản chi<span class="error-sybol"></span></label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-form-select :options="expendTypeOptions" v-model="inputs.expend_income_type_id"
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

  </div>
</template>
<script>


import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      title_prefix: 'Thêm Mới',
      inputs: {
        "type": 1,
        "sub_type": 0,
        "date_input": null,
        "accounting_date": null,
        "order_type": 0,
        "order_sell_id": null,
        "order_buy_id": null,
        "object_type": 1,
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
      orderNumber: null,
      orderBuySelect: {},
      orderBuyOptions: [],
      orderSellSelect: {},
      orderSellOptions: [],
      customerSelect: {},
      customerOptions: [],
      supplierSelect: {},
      supplierOptions: [],
      staffSelect: {},
      staffOptions: [],
      bankAccountOptions: [],
      expendGroupOptions: [],
      expendTypeOptions: [],
      expendTypeOptionStore: [],
      saving: false,
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
      isExpendFromOrderBuy: false,
      isMoneyBack: false,
      isExpendFromOrderSell: false,
      isEditFund: false,
      isDebtRelief: false
    }
  },
  mounted() {
    let url = location.href
      if(url.includes("expend-from-order-buy")) {
          this.isExpendFromOrderBuy = true
      } else if(url.includes("expend-from-money-back")){
        this.isMoneyBack = true
      } else if(url.includes("expend-from-order-sell")) {
          this.isExpendFromOrderSell = true
        // Xoa no
        let isDebtRelief = this.$router.currentRoute.query.isDebtRelief
        if(isDebtRelief) {
          this.inputs.money_type = 2
          this.isDebtRelief = true
        }
      } else if(url.includes("expend/")) {
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

    checkCreatedFromOrderBuy() {
      // Check tạo phiếu chi từ đơn hàng nhập
      if(this.isExpendFromOrderBuy) {
        let orderBuyId = this.$route.params.id
        this.chooseOrderBuy(orderBuyId, null)
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
        order_sells_back: true,
        order_buys: true,
        customers: true,
        suppliers: true,
        staffs: true,
        bank_accounts: true,
        type: 1,
        expend_income_groups: true,
        expend_income_types: true
      }
      if(this.isEditFund) {
        params.order_sells_back = false
        params.order_buys = false
      }
      if(this.isDebtRelief) {
        params.order_sells_back = false
          params.order_buys = false
          params.order_sells = true
      }

      fundApi.getOptionsRelatedFund(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.customerOptions = options.customers
          if(this.inputs.customer_id) {
            this.getCustomerById(this.inputs.customer_id)
          }
          this.supplierOptions = options.suppliers
          if(this.inputs.supplier_id) {
            this.getSupplierById(this.inputs.supplier_id)
          }

          this.orderBuyOptions = options.order_buys
          this.checkCreatedFromOrderBuy()

          if(this.isMoneyBack || this.isExpendFromOrderSell) {
            this.inputs.sub_type = 1
            this.inputs.object_type = 0

            this.orderSellOptions = options.order_sells
            let orderSellId = this.$route.params.id
            this.chooseOrderSell(orderSellId, null)
          }

          this.staffOptions = options.staffs
          if(this.inputs.staff_id) {
            this.getStaffById(this.inputs.staff_id)
          }
          this.bankAccountOptions = options.bank_accounts

          this.expendGroupOptions = []
          let expend_groups = options.expend_income_groups
          for(let item of expend_groups) {
            let option = {"value": item.id, "text": item.name}
            this.expendGroupOptions.push(option)
          }

          this.expendTypeOptions = []
          let expend_income_types = options.expend_income_types
          for(let item of expend_income_types) {
            let option = {"value": item.id, "text": item.name}
            this.expendTypeOptions.push(option)
          }
          this.expendTypeOptionStore = JSON.parse(JSON.stringify(options.expend_income_types))

          if(this.isExpendFromOrderSell) {
            let expend_group_code = 'chi_phi_ban_hang'
            if(this.isDebtRelief) {
              expend_group_code = 'chi_phi_quan_ly_doanh_nghiep'
            }
            for(let item of expend_groups) {
              if(item.code == expend_group_code) {
                this.inputs.expend_income_group_id = item.id
                this.changeExpendGroup()
                break
              }
            }
          }

          if(this.isMoneyBack) {
            for(let item of expend_groups) {
              if(item.code == 'chi_tien_do_khach_tra_hang') {
                this.inputs.expend_income_group_id = item.id
                this.changeExpendGroup()
                if(this.expendTypeOptions.length > 0) {
                  this.inputs.expend_income_type_id = this.expendTypeOptions[0].value
                }
                break
              }
            }
          }

          // // Get fund detail
          // this.getFundDetail()

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
        try {
            let expend_type_text = ""

            if (this.inputs.expend_income_type_id && this.expendTypeOptions.length > 0) {
                console.log(this.expendTypeOptions)
                console.log(this.inputs.expend_income_type_id)
                expend_type_text = commonFunc.getTextByValueOfSelectedBox(this.expendTypeOptions, this.inputs.expend_income_type_id)
            }
            let order_name = ""
            if (this.orderBuySelect && this.orderBuySelect.id) {
                order_name = this.orderBuySelect.name
            } else {
                if (this.orderSellSelect && this.orderSellSelect.id) {
                    order_name = this.orderSellSelect.name

                    if (this.customerSelect && this.customerSelect.name) {
                        order_name += " - " + this.customerSelect.name
                    }
                }
            }

            if (this.inputs.description && !this.inputs.description.includes(expend_type_text)
                && !this.inputs.description.includes(order_name)) {
                return;
            }
            let description_str = expend_type_text + " - " + order_name
            if (description_str.substring(0, 3) == " - ") {
                description_str = description_str.substring(3, description_str.length)
            }
            if (description_str.substring(description_str.length - 3, description_str.length) == " - ") {
                description_str = description_str.substring(0, description_str.length - 3)
            }

            if (this.isDebtRelief) {
                description_str = 'Lý do xóa nợ: ' + description_str
            }

            this.inputs.description = description_str
        }
        catch(err) {
          console.log(err)
        }
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
            this.popToast('danger', "[Sổ khoản chi] là mục bắt buộc nhập")
            return;
          }
      }
      if(!this.inputs.expend_income_group_id) {
        this.popToast('danger', "[Nhóm khoản chi] là mục bắt buộc nhập")
        return;
      }
      if(!this.inputs.expend_income_type_id) {
        this.popToast('danger', "[Loại Khoản chi] là mục bắt buộc nhập")
        return;
      }

      if(this.orderBuySelect && this.orderBuySelect.id) {
        this.inputs.order_buy_id = this.orderBuySelect.id
      }
      if(this.orderSellSelect && this.orderSellSelect.id) {
        this.inputs.order_sell_id = this.orderSellSelect.id
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
        fundApi.updateExpend(this.inputs).then(res => {
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
        fundApi.addExpend(this.inputs).then(res => {
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

      changeAmount() {
        let amount = (this.inputs.amount + "").replaceAll(",", "")
        this.inputs.amount = this.currencyFormat(amount)
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

    /**
     * Back to list
     */
    back() {
      this.$router.push("/fund")
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
    getStaffById(staffId) {
        for(let staff of this.staffOptions) {
            if(staff.id == staffId) {
                this.staffSelect = staff
                break
            }
        }
        return {}
      },

    changeOrderBuy(updateDes=true) {
      if(this.orderBuySelect && this.orderBuySelect.id) {
          this.inputs.amount = this.currencyFormat(this.orderBuySelect.amount_remaining)
          if(this.orderBuySelect.supplier_id) {
              this.getSupplierById(this.orderBuySelect.supplier_id)
          }
      }

      // Cập nhật mô tả
        if(updateDes) {
            this.updateDescription()
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

    changeExpendGroup() {
      if(this.inputs.expend_income_group_id) {
        this.expendTypeOptions = [{"value": null, "text": ""}]
        for(let item of this.expendTypeOptionStore) {
          if(item.type == 1 && item.group_id == this.inputs.expend_income_group_id) {
            let typeItem = {"value": item.id, "text": item.name}
            this.expendTypeOptions.push(typeItem)
          }
        }
      } else {
        this.expendTypeOptions = []
      }
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

      changeSubType(subType) {
        if(subType == 1) {
            this.inputs.object_type = 0
        } else {
            this.inputs.object_type = 1
        }
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

      changeOrderSell(updateDes=true) {
        if(this.orderSellSelect && this.orderSellSelect.id) {
            this.inputs.amount = this.currencyFormat(this.orderSellSelect.total_remaining)
            if(this.orderSellSelect.customer_id) {
                this.getCustomerById(this.orderSellSelect.customer_id)
            }
        }

        // Cập nhật nội dung
          if(updateDes) {
              this.updateOrderSellDescription()
          }

      },

      updateOrderSellDescription() {
        let income_type_text = ""
        if(this.inputs.expend_income_type_id && this.incomeTypeOptions.length > 0) {
          income_type_text = commonFunc.getTextByValueOfSelectedBox(this.incomeTypeOptions, this.inputs.expend_income_type_id)
        }
        let order_sell_name = ""
        if(this.orderSellSelect && this.orderSellSelect.id) {
          order_sell_name = this.orderSellSelect.name
        }

        if(this.inputs.description && !this.inputs.description.includes(income_type_text) && !this.inputs.description.includes(order_sell_name) ) {
          return;
        }
        let description_str = income_type_text + " - " + order_sell_name
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
