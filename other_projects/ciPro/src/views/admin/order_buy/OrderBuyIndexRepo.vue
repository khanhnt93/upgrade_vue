<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body>

            <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">{{prefix_title}} ĐH Nhập Tồn Kho</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row>
              <b-col md="12" class="bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin nhà cung cấp</span>
                  <span class="pull-right" v-show="showPartnerInfo" @click="showPartnerInfo = !showPartnerInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showPartnerInfo" @click="showPartnerInfo = !showPartnerInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </b-col>
            </b-row>

            <b-row v-show="showPartnerInfo">
              <b-col>

                <b-row class="form-row mt-2">
                  <b-col md="2" class="mt-2">
                    <label>
                      <span>Nhà cung cấp</span>
                    </label>
                  </b-col>
                  <b-col md="10">
                    <div class="input-group">
                      <multiselect
                        v-model="supplierSelect"
                        :options="supplierOptions"
                        :loading="loadingOptions"
                        :select-label="''"
                        :deselect-label="''"
                        placeholder="--Chọn nhà cung cấp--"
                        label="name"
                        track-by="name"
                        @input="changeSupplier">
                      </multiselect>
                    </div>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="2" class="mt-2">
                    <label>
                      Tên nhà cung cấp<span class="error-sybol"></span>
                    </label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                    <input
                      id="supplier_name"
                      type="text"
                      maxlength="255"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="orderBuy.supplier_name"
                      :disabled="saving">
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="2" class="mt-2">
                    <label>Địa chỉ</label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                    <input
                      id="supplier_address"
                      type="text"
                      maxlength="255"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="orderBuy.supplier_address"
                      :disabled="saving">
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="12" class="bg-info bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin sản phẩm</span>
                  <span class="pull-right" v-show="showProductInfo" @click="showProductInfo = !showProductInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showProductInfo" @click="showProductInfo = !showProductInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </b-col>
            </b-row>

            <b-row v-show="showProductInfo" class="mt-2">
              <b-col md="12">

                <b-row class="form-row">
                  <b-col md="2" class="mt-2">
                    <label>Sản phẩm<span class="error-sybol"></span> </label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                    <div class="input-group">
                      <multiselect
                        v-model="productSelect"
                        :options="productOptions"
                        :loading="loadingProductOptions"
                        :select-label="''"
                        :deselect-label="''"
                        placeholder="--Chọn sản phẩm--"
                        label="name_full"
                        track-by="name_full"
                        @input="changeProduct">
                      </multiselect>
                      <b-button variant="outline-primary" class="pull-right ml-2" @click="showModalSearchProduct" >
                        <i class="fa fa-search"></i>
                      </b-button>
                    </div>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="2" class="mt-2">
                    <label>Giá nhập</label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                    <input
                      id="price_list"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.price_buy"
                      @change="changePriceBuy()">
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="2" class="mt-2">
                    <label>Số Lượng</label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                    <input
                      id="quantity"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.quantity"
                      @keyup="integerPointAndCommaOnly($event.target)"
                      @change="changeQuantity()">
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="12">
                    <b-row class="form-row">
                      <b-col md="2" class="mt-2">
                        <label>Ghi Chú</label>
                      </b-col>
                      <b-col md="10" class="mt-2">
                        <b-form-textarea
                          id="note"
                          style="width:100%;"
                          rows="2"
                          v-model="currentProduct.note"
                        ></b-form-textarea>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="mt-2">
                  <b-col md="12" class="text-center">
                    <b-button variant="outline-primary" class="text-center btn-width-180"
                              @click="confirmBuyProduct">
                      {{prefixBuyProduct}} sản phẩm
                    </b-button>
                  </b-col>
                </b-row>

                <b-row class="mt-2" v-show="orderBuy.products.length > 0" >
                  <b-col md="12" class="table-cus">
                    <table class="table table-bordered table-striped fixed_header">
                      <colgroup>
                        <col style="width:4%">
                        <col style="width:17%">
                        <col style="width:20%">
                        <col style="width:6%">
                        <col style="width:6%">
                        <col style="width:5%">
                        <col style="width:10%">
                        <col style="width:12%">
                        <col style="width:13%">
                        <col style="width:7%">
                      </colgroup>
                      <tr>
                          <th class="text-center font-weight-bold">STT</th>
                          <th class="text-center font-weight-bold">Mã sản phẩm(*)</th>
                          <th class="text-center font-weight-bold">Tên hàng sản phẩm(*)</th>
                          <th class="text-center font-weight-bold">Hãng</th>
                          <th class="text-center font-weight-bold">Đơn vị(*)</th>
                          <th class="text-center font-weight-bold">số lượng(*)</th>
                          <th class="text-center font-weight-bold">Giá nhập</th>
                          <th class="text-center font-weight-bold">Thành tiền</th>
                          <th class="text-center font-weight-bold">Ghi Chú</th>
                          <th></th>
                        </tr>
                      <tbody>
                      <tr v-for="(item, index) in orderBuy.products">
                        <td>{{index + 1}}</td>
                        <td>{{item.product_code}}</td>
                        <td>{{item.product_name}}</td>
                        <td>{{item.product_brand}}</td>
                        <td>{{item.unit}}</td>
                        <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                        <td class="text-right">{{currencyFormat(item.price_buy)}}</td>
                        <td class="text-right">{{currencyFormat(item.amount)}}</td>
                        <td>{{item.note}}</td>
                        <td>
                          <i class="fa fa-edit" @click="editProduct(index)" />
                          <i class="fa fa-trash ml-2" title="Xoá" @click="deleteProduct(index)" />
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="12" class="bg-success bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin thanh toán và giao hàng</span>
                  <span class="pull-right" v-show="showPaymentInfo" @click="showPaymentInfo = !showPaymentInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showPaymentInfo" @click="showPaymentInfo = !showPaymentInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="mt-2" v-show="showPaymentInfo">
              <b-col>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Tổng thành tiền:</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="sub_total"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="orderBuy.sub_total"
                          readonly>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Vat</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <div class="input-group">
                          <input type="checkbox" id="have_vat" v-model="orderBuy.have_vat" class="mr-2" @change="calculateAmount('vat')">
                          <input
                            id="vat_percent"
                            type="text"
                            maxlength="3"
                            autocomplete="new-password"
                            class="form-control mr-2"
                            v-model="orderBuy.vat_percent"
                            @keyup="integerOnly($event.target)"
                            @change="calculateAmount, handleProductExcel">
                          <input
                            id="vat_value"
                            type="text"
                            maxlength="14"
                            autocomplete="new-password"
                            class="form-control"
                            v-model="orderBuy.vat_value"
                            @keyup="integerOnly($event.target)"
                            @change="calculateAmount, handleProductExcel">
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Tổng tiền thanh toán:<span class="error-sybol"></span> </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="amount"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="orderBuy.total"
                          readonly>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Phương thức thanh toán:</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select
                          :options="paymentMethodOptions"
                          v-model="orderBuy.payment_method"
                          @change="handleProductExcel"></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Hình thức giao hàng:</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select :options="shippingMethodOptions"
                                       v-model="orderBuy.shipping_method"
                                       @change="handleProductExcel"></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Số ngày dự kiến GH</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <datepicker v-model="orderBuy.shipping_date" format="yyyy-MM-dd"
                                    input-class="datepicker-cus"></datepicker>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="2" class="mt-2">
                <label>Ghi chú</label>
              </b-col>
              <b-col md="10" class="mt-2">
                <b-form-textarea
                  id="description"
                  style="width:100%;"
                  rows="2"
                  v-model="orderBuy.note"
                  @change="handleProductExcel"
                ></b-form-textarea>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12" class="text-left">
                <b-button variant="outline-primary" class="pull-left btn-width-120 mt-1"
                          @click="updateDraft" :disabled="saving || !this.orderBuy.id">
                  Lưu nháp
                </b-button>
                <download-excel
                  class   = "btn btn-default text-header pull-right mt-1"
                  :data   = "excel_one_items"
                  :fields = "excel_one_fields"
                  worksheet = "DS SP trong đơn hàng"
                  name    = "danh_sach_san_pham_trong_don_hang.xls">
                  <b>Xuất Excel</b>
                </download-excel>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button v-show="!saving" variant="outline-success" style="height: 50px; width: 240px"
                          @click="save" :disabled="saving || !this.orderBuy.id">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận Đơn Hàng
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!--Modal tìm kiếm sản phẩm -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-product">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tìm kiếm sản phẩm</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="form-row">
        <b-col md="2" class="mt-2">
          <label> Hãng sản phẩm </label>
          <b-form-select
            :options="productBrandOptions"
            id="product_brand"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="productSearch.product_brand_id"></b-form-select>
        </b-col>
        <b-col md="2" class="mt-2">
          <label> Nhóm sản phẩm </label>
          <multiselect
            v-model="productGroupSelect"
            :options="productGroupOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn nhóm sản phẩm--"
            label="text"
            track-by="text"
            @input="changeProductGroupSearch">
          </multiselect>
        </b-col>

        <b-col md="2" class="mt-2">
          <label> Loại sản phẩm </label>
          <multiselect
            v-model="productTypeSelect"
            :options="productTypeOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn loại sản phẩm--"
            label="text"
            track-by="text"
            @input="changeProductTypeSearch">
          </multiselect>
        </b-col>

        <b-col md="3" class="mt-2">
          <label> Mã sản phẩm </label>
          <input
            id="codeProductCus"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="productSearch.code"
            maxlength="255">
        </b-col>

        <b-col md="3" class="mt-2">
          <label> Tên sản phẩm </label>
          <input
            id="nameProductCus"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="productSearch.name"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click.prevent="hideModalSearchProduct">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchProduct"
                    @click.prevent="searchProduct" v-show="!onSearchProduct">
            Tìm Kiếm
          </b-button>
          <span class="loading-more pull-right" v-show="onSearchProduct"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="productSearchFields"
            :items="productSearchItems">
            <template v-slot:cell(actions)="data">
              <b-button variant="outline-success" class="pull-right btn-width-120"
                        @click.prevent="chooseProduct(data.item.id, data.item.name, data.item.code,
                        data.item.product_brand_name, data.item.unit_name)">
                Chọn
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>


<script>
import orderBuyApi from '@/api/orderBuy'
import supplierApi from '@/api/supplier'
import productApi from '@/api/product'
import orderSellApi from '@/api/orderSell'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      prefix_title: "Thêm Mới",
      paymentMethodOptions: [
        {"value": null, "text": ''},
        {"value": 'Tiền mặt khi nhận hàng', "text": 'Tiền mặt khi nhận hàng'},
        {"value": "Chuyển khoản trước khi nhận hàng", "text": 'Chuyển khoản trước khi nhận hàng'},
        {"value": "Công nợ 7 ngày", "text": 'Công nợ 7 ngày'},
        {"value": "Công nợ 15 ngày", "text": 'Công nợ 15 ngày'},
        {"value": "Công nợ 30 ngày", "text": 'Công nợ 30 ngày'},
        {"value": "Công nợ 45 ngày", "text": 'Công nợ 45 ngày'}
      ],
      shippingMethodOptions: [
        {"value": null, "text": ''},
        {"value": 'Giao tại kho bên mua', "text": 'Giao tại kho bên mua'},
        {"value": "Giao thẳng cho khách hàng", "text": 'Giao thẳng cho khách hàng'},
        {"value": "Nhân viên bên mua đến lấy", "text": 'Nhân viên bên mua đến lấy'},
        {"value": "Bên mua đặt grap đến lấy", "text": 'Bên mua đặt grap đến lấy'}
      ],
      showPartnerInfo: true,
      showProductInfo: true,
      showPaymentInfo: true,
      loadingOptions: false,
      loadingProductOptions: false,
      supplierOptions: [],
      supplierSelect: {},
      productSelect: {},
      productOptions: [],
      orderBuy: {
        supplier_id: null,
        supplier_name: null,
        supplier_address: null,
        products: [],
        sub_total: 0,
        have_vat: false,
        vat_percent: 10,
        vat_value: 0,
        total: 0,
        payment_method: null,
        shipping_method: null,
        shipping_date: null,
        note: null
      },
      currentProduct: {
        index: -1,
        product_id: null,
        product_code: null,
        product_name: null,
        product_brand: null,
        unit: null,
        price_buy: null,
        quantity: null,
        amount: null,
        note: null,
        order_sell_id: null
      },
      loading: false,
      saving: false,
      productBrandOptions:[],
      productGroupOptions:[],
      productGroupSelect: {},
      productTypeSelect:{},
      productTypeOptions:[],
      productSearch: {
        "code": null,
        "name": null,
        "product_brand_id": null,
        "product_type_id": null,
        "product_group_id": null
      },
      onSearchProduct: false,
      productSearchFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'product_group_name',
          label: 'Nhóm SP'
        },
        {
          key: 'product_type_name',
          label: 'Loại SP'
        },
        {
          key: 'code',
          label: 'Mã SP'
        },
        {
          key: 'name',
          label: 'Tên SP'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      productSearchItems: [],
      excel_one_items: [],
      excel_one_fields: {
        'STT': 'index',
        'Mã Hàng': 'product_code',
        'Tên Hàng': 'product_name',
        'Hãng' : 'product_brand',
        'DVT' : 'unit',
        'SL' : 'quantity',
        'Đơn giá' : 'price_buy',
        'Thành tiền' : 'amount',
        'Ghi Chú' : 'note'
      },
        prefixBuyProduct: "Thêm"
    }
  },
  mounted() {
    // Check prefix
    if(this.$route.params.id) {
      this.prefix_title = "Cập Nhật"
    } else {
      this.prefix_title = "Thêm Mới"
    }

    // Get trade detail
    this.getOrderBuyDetail()

    this.getSupplierOptions()
    this.getOptionRelatedProduct()
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
     * Back to list
     */
    back() {
      this.$router.push("/order-buy")
    },

    /**
     * Currency format
     */
    currencyFormat(num) {
      let result = ""
      if(num === 0) {
        return "0"
      }
      num = (num + "").replaceAll(",", "")
      if(num) {
        result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

      /**
     *  Get detail
     */
    getOrderBuyDetail() {
      let orderBuyId = this.$route.params.id
      if(orderBuyId){
        this.loading = true
        orderBuyApi.getOrderBuyDetail(orderBuyId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.orderBuy = res.data.data

              // Format
              this.orderBuy.sub_total = this.currencyFormat((this.orderBuy.sub_total + '').replaceAll(",", ""))
              this.orderBuy.total = this.currencyFormat((this.orderBuy.total + '').replaceAll(",", ""))
              this.orderBuy.vat_value = this.currencyFormat((this.orderBuy.vat_value + '').replaceAll(",", ""))

              if(this.orderBuy.supplier_id && this.supplierOptions.length > 0) {
                  this.getSupplierItemById(this.orderBuy.supplier_id)
              }
          }

          this.loading = false

        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    getSupplierItemById(id) {
      for(let i in this.supplierOptions) {
          if(this.supplierOptions[i].id == id) {
              this.supplierSelect = this.supplierOptions[i]
          }
      }
    },

    /**
     *  Event change supplier
     */
    changeSupplier() {
      if(this.supplierSelect) {
        this.orderBuy.supplier_id = this.supplierSelect.id
        this.orderBuy.supplier_name = this.supplierSelect.name
        this.orderBuy.supplier_address = this.supplierSelect.address
      } else{
        this.orderBuy.supplier_id = null
        this.orderBuy.supplier_name = null
        this.orderBuy.supplier_address = null
      }
    },

    showModalSearchProduct() {
      this.$bvModal.show('modal-search-product')
    },

    hideModalSearchProduct() {
      this.$bvModal.hide('modal-search-product')
    },

    /**
     * Only input integer and point
     */
    integerPointAndCommaOnly(item) {
      let valueInput = item.value
        valueInput = valueInput.replaceAll(",", "")
      let result = commonFunc.integerPointAndCommaOnly(valueInput)

        result = this.currencyFormat(result)
      item.value = result
    },

    /**
     *  Event change product
     */
    changeProduct() {
      if(this.productSelect) {
        this.currentProduct.product_id = this.productSelect.id
        this.currentProduct.product_name = this.productSelect.name
        this.currentProduct.product_code = this.productSelect.code
        this.currentProduct.product_brand = this.productSelect.brand_name
        this.currentProduct.unit = this.productSelect.unit_name
      } else {
        this.currentProduct.product_id = null
        this.currentProduct.product_name = null
        this.currentProduct.product_code = null
        this.currentProduct.product_brand = null
        this.currentProduct.unit = null
      }
      console.log(this.currentProduct)
    },

    changePriceBuy() {
      let price_buy = parseInt((this.currentProduct.price_buy + "").replaceAll(",", ""))
      this.currentProduct.price_buy = this.currencyFormat(price_buy)
    },

    changeQuantity() {
      let quantity = parseFloat((this.currentProduct.quantity + "").replaceAll(",", ""))
      this.currentProduct.quantity = this.currencyFormat(quantity)
    },

    calculateCurrentProduct(key) {
      let price_buy = (this.currentProduct.price_buy + "").replaceAll(",", "")
      let quantity = (this.currentProduct.quantity + "").replaceAll(",", "")

      if(key == 'price_buy') {
        this.currentProduct.price_buy = this.currencyFormat(price_buy)
        if (price_buy && quantity) {
          this.currentProduct.amount = this.currencyFormat(price_buy * quantity)
        }
      }

      if(key == 'quantity') {
        this.currentProduct.quantity = this.currencyFormat(quantity)
        if (price_buy && quantity) {
          this.currentProduct.amount = this.currencyFormat(price_buy * quantity)
        }
      }
    },

    editProduct(index) {
      this.currentProduct = this.orderBuy.products[index]
      if(this.currentProduct.product_id) {
        this.productSelect = this.getProductItemById(this.currentProduct.product_id)
      } else {
        this.productSelect = {}
      }
      this.currentProduct.index = index
      this.currentProduct.price_buy = this.currencyFormat(this.currentProduct.price_buy)
      this.currentProduct.quantity = this.currencyFormat(this.currentProduct.quantity)

      this.prefixBuyProduct = "Sửa"
    },

    /**
     *  Xác nhận sản phẩm
     */
    confirmBuyProduct() {
      // Check product
      if (!this.currentProduct.product_id) {
        this.currentProduct.product_id = null
        this.currentProduct.product_code = null
        this.currentProduct.product_name = null
        this.popToast('danger', "Vui lòng chọn sản phẩm")
        return
      }

      // Check price buy
      if (this.currentProduct.price_buy == null || this.currentProduct.price_buy == '') {
        this.popToast('danger', "Vui lòng nhập [Giá nhập]")
        return
      }

      // Check quantity
      if (this.currentProduct.quantity == null || this.currentProduct.quantity == '') {
        this.popToast('danger', "Vui lòng nhập [Số lượng]")
        return
      }
      this.currentProduct.price_buy = (this.currentProduct.price_buy + "").replaceAll(",", "")
      this.currentProduct.quantity = (this.currentProduct.quantity + "").replaceAll(",", "")
      this.currentProduct.amount = Math.round(parseInt(this.currentProduct.price_buy) * parseFloat(this.currentProduct.quantity))

      console.log("xx:" + JSON.stringify(this.currentProduct))
      if(this.currentProduct.index == -1) {
        // Thêm mới product
        this.currentProduct.index = this.orderBuy.products.length
        this.orderBuy.products.push(JSON.parse(JSON.stringify(this.currentProduct)))
      } else {
        // Cập nhật product
        this.orderBuy.products[this.currentProduct.index] = JSON.parse(JSON.stringify(this.currentProduct))
      }

      // Tính toán amount
      this.calculateAmount()

      // Refresh current product
      this.refreshCurrentProduct()

      // Lưu nháp
      if(this.orderBuy.id) {
        this.updateDraft()
      } else {
        this.saveDraft()
      }
    },

    refreshCurrentProduct() {
      this.currentProduct = {
          index: -1,
          product_id: null,
          product_code: null,
          product_name: null,
          product_brand: null,
          unit: null,
          price_buy: null,
          quantity: null,
          amount: null,
          note: null,
          order_sell_id: null
      }
      this.productSelect = {}
    },

    /**
     * Tính toán thành tiền sản phẩm
     */
    calculateAmount() {
      var amount = 0
      for (let i in this.orderBuy.products) {
        amount += Math.round(parseInt(this.orderBuy.products[i].price_buy) * parseFloat(this.orderBuy.products[i].quantity))
      }
      this.orderBuy.sub_total = this.currencyFormat(amount)

      // Calculate vat value
      let vat_value = 0
      if(this.orderBuy.have_vat) {
        if(this.orderBuy.vat_percent) {
          vat_value = Math.round(amount * this.orderBuy.vat_percent / 100)
          this.orderBuy.vat_value = this.currencyFormat(vat_value)
        } else {
          this.orderBuy.vat_value = 0
        }
      } else {
        this.orderBuy.vat_value = 0
      }
      this.orderBuy.total = this.currencyFormat(amount + vat_value)
    },

    /**
     *  Save
     */
    saveDraft () {
      // Reformat data
      let data = JSON.parse(JSON.stringify(this.orderBuy))
      if(!data.supplier_id) {
        data.supplier_id = null
      }
      data.sub_total = (data.sub_total + '').replaceAll(",", "")

      let vat_value = 0
      if(data.vat_value) {
        vat_value = (data.vat_value + '').replaceAll(",", "")
      }
      data.vat_value = vat_value
      data.total = (data.total + '').replaceAll(",", "")

      // Check products
      if(data.products.length == 0) {
        this.popToast('danger', "Không có sản phẩm nào được chọn!")
        return
      }

      orderBuyApi.saveDraftOrderBuy(data).then(res => {
        if(res != null && res.data != null){

          if (res.data.status == 200) {
            this.popToast('success', "Lưu nháp thành công!")
            let response = res.data.data
            this.orderBuy.id = response.order_buy_id
            this.orderBuy.order_buy_number = response.order_buy_number

            this.prefixBuyProduct = "Thêm"
          }

          this.handleProductExcel()
        }
      }).catch(err => {})
    },

      /**
     *  Save
     */
    getSupplierOptions () {
      this.loadingOptions = true
      supplierApi.getListSupplierOption().then(res => {
        if(res != null && res.data != null && res.data.data != null){

          this.supplierOptions = res.data.data;

          let itemEmpty = {"id": null, "name": null, "address": null}
          this.supplierOptions.unshift(itemEmpty)

          this.loadingOptions = false

          if(this.orderBuy.supplier_id && this.supplierOptions.length > 0) {
              this.getSupplierItemById(this.orderBuy.supplier_id)
          }
        }
      }).catch(err => {
          this.loadingOptions = false
      })
    },

    /**
     * Get staff options
     */
    getOptionRelatedProduct() {
      orderSellApi.getOptionRelatedProduct().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          this.productGroupOptions = options.product_groups
          this.productTypeOptionStore = options.product_types
          this.productTypeOptions = options.product_types
          this.resetListProductType()
          this.productOptions = options.products
          this.resetListProduct()
          this.productBrandOptions = options.brands
        }
      })
    },

    resetListProductType() {
      this.productTypeSelect = {}

      this.productTypeOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))

      if(this.productTypeOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        this.productTypeOptions.unshift(itemEmpty)
      }

      this.resetListProduct()
    },

    resetListProduct() {
      this.productSelect = {}
      this.productOptions = JSON.parse(JSON.stringify(this.productOptions))

      if(this.productOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        itemEmpty.name_full = ""
        this.productOptions.unshift(itemEmpty)
      }
    },

    /**
     *  Update draft
     */
    updateDraft () {
      if(this.orderBuy.id == null) {
        this.popToast('danger', "Không hợp lệ, vui lòng đợi trong giây lát!")
        return
      }

      let data = JSON.parse(JSON.stringify(this.orderBuy))
      // Check products
      if(data.products.length == 0) {
        this.popToast('danger', "Không có sản phẩm nào được chọn!")
        return
      }
      for(let product of data.products) {
        product.price_buy = (product.price_buy + '').replaceAll(",", "")
        product.quantity = (product.quantity + '').replaceAll(",", "")
        product.amount = (product.amount + '').replaceAll(",", "")
      }

      if(!data.supplier_id) {
        data.supplier_id = null
      }
      data.sub_total = (data.sub_total + '').replaceAll(",", "")

      let vat_value = 0
      if(data.vat_value) {
        vat_value = (data.vat_value + '').replaceAll(",", "")
      }
      data.vat_value = vat_value
      data.total = (data.total + '').replaceAll(",", "")

      orderBuyApi.updateDraftOrderBuy(data).then(res => {
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.popToast('success', "Lưu nháp thành công!")

            this.prefixBuyProduct = "Thêm"

            this.handleProductExcel()
          }
        }
      }).catch(err => {})
    },

    /**
     *  Save
     */
    save () {
      // Reformat data
      let data = JSON.parse(JSON.stringify(this.orderBuy))

      // Check nhà cung cấp
      if(!data.supplier_id) {
        this.popToast('danger', "Vui lòng nhập nhà cung cấp")
        return
      }

      // Check products
      if(data.products.length == 0) {
        this.popToast('danger', "Chưa có sản phẩm nào được chọn")
        return
      }

      data.sub_total = (data.sub_total + '').replaceAll(",", "")

      let vat_value = 0
      if(data.vat_value) {
        vat_value = (data.vat_value + '').replaceAll(",", "")
      }
      data.vat_value = vat_value
      data.total = (data.total + '').replaceAll(",", "")

      this.saving = true

      orderBuyApi.saveOrderBuy(data).then(res => {
        this.saving = false
        if(res != null && res.data != null){

          if (res.data.status == 200) {
            this.back()
          }
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Search
     */
    searchProduct() {
      this.productSearchItems = []

      if (this.onSearchProduct) { return }

      this.onSearchProduct = true

      if(!this.productSearch.product_type_id)
      {this.productSearch.product_type_id = null}

      if(!this.productSearch.product_group_id)
      {this.productSearch.product_group_id = null}

      let params = {
        "code": this.productSearch.code,
        "name": this.productSearch.name,
        "product_type_id": this.productSearch.product_type_id,
        "product_group_id": this.productSearch.product_group_id,
        "product_brand_id": this.productSearch.product_brand_id,
        "limit": 100,
        "offset": 0
      }

      productApi.searchProductByStaff(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.productSearchItems = res.data.data.products
        } else {
          this.productSearchItems = []
        }
        this.onSearchProduct = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchProduct = false
      })
    },

    getProductItemById(id) {
      for(let i in this.productOptions) {
        if(this.productOptions[i].id == id) {
          return this.productOptions[i]
        }
      }
      return {}
    },

    chooseProduct(product_id, product_name, product_code, product_brand, unit) {
      this.currentProduct.product_id = product_id
      this.currentProduct.product_code = product_code
      this.currentProduct.product_name = product_name
      this.currentProduct.product_brand = product_brand
      this.currentProduct.unit = unit

      this.productSelect = this.getProductItemById(product_id)

      this.$bvModal.hide('modal-search-product')
    },

    changeProductGroupSearch() {
      if(this.productGroupSelect.value) {
        this.productSearch.product_group_id = this.productGroupSelect.value

        // Reload list type by group
        this.productTypeOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.productSearch.product_group_id == this.productTypeOptionStore[i].product_group_id) {
            // let item = {id: this.productTypeOptionStore[i].value, name: this.productTypeOptionStore[i].text}
            this.productTypeOptions.push(this.productTypeOptionStore[i])
          }
        }
        if(this.productTypeOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
          itemEmpty.value = null
          itemEmpty.text = ""
          this.productTypeOptions.unshift(itemEmpty)
        }
      } else {
        this.productSearch.product_group_id = null

        this.resetListProductType()
      }
    },

    changeProductTypeSearch() {
      if(this.productTypeSelect.value) {
        this.productSearch.product_type_id = this.productTypeSelect.value
      } else {
        this.productSearch.product_type_id = null
      }
    },

    deleteProduct(indexProduct) {
      this.orderBuy.products.splice(indexProduct, 1)
      this.calculateAmount()
    },

    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    handleProductExcel() {
      this.excel_one_items = [
        {
          'index': 'Nhà cung cấp: ', 'product_code': this.orderBuy.supplier_name,
          'product_name' : null, 'product_brand' : null, 'unit' : null,
          'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
        },
        {
          'index': 'Ngày đặt hàng: ', 'product_code': this.orderBuy.shipping_date,
          'product_name' : null, 'product_brand' : null, 'unit' : null,
          'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
        },
        {
          'index': 'Thời gian GH dự kiến: ', 'product_code': this.orderBuy.shipping_date,
          'product_name' : null, 'product_brand' : null, 'unit' : null,
          'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
        },
        {
          'index': 'Xuất hóa đơn: ', 'product_code': this.orderBuy.have_vat ? 'Có': 'Không',
          'product_name' : null, 'product_brand' : null, 'unit' : null,
          'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
        },
        {
          'index': 'Phương thức thanh toán: ', 'product_code': this.orderBuy.payment_method,
          'product_name' : null, 'product_brand' : null, 'unit' : null,
          'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
        },
        {
          'index': 'Tổng tiền gồm VAT: ', 'product_code': this.orderBuy.total,
          'product_name' : null, 'product_brand' : null, 'unit' : null,
          'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
        },
        {
          'index': 'Số Đơn hàng bán: ', 'product_code': "",
          'product_name' : null, 'product_brand' : null, 'unit' : null,
          'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
        }
      ]

      if(this.orderBuy.products.length > 0) {
        let productsExcel = JSON.parse(JSON.stringify(this.orderBuy.products))

        for(let i in productsExcel) {
          let item = {
            'index': parseInt(productsExcel[i].index),
            'product_code': productsExcel[i].product_code,
            'product_name' : productsExcel[i].product_name,
            'product_brand' : productsExcel[i].product_brand,
            'unit' : productsExcel[i].unit,
            'quantity' : productsExcel[i].quantity,
            'price_buy' : productsExcel[i].price_buy,
            'amount' : productsExcel[i].amount,
            'note' : productsExcel[i].note
          }
          this.excel_one_items.push(item)
        }
      }
    },


  }
}
</script>

<style lang="scss" scoped>

  .title-partner {
    border-radius: 5px 5px;
    padding: 5px;

  }

</style>
