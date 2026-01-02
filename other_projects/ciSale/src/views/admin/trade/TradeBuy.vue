<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

            <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-1 text-center text-header">Mua Hàng</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row>
              <b-col md="12" class="bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin nguồn mua</span>
                  <span class="pull-right" v-show="showPartnerInfo" @click="showPartnerInfo = !showPartnerInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showPartnerInfo" @click="showPartnerInfo = !showPartnerInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </b-col>
            </b-row>

            <b-row v-show="showPartnerInfo">
              <b-col>
                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Nguồn mua </label>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <input type="radio" v-model="trade.from_type" name="from_type" :value="1" class="mt-2" id="from_type_supplier" @change="changeFromType">
                    <label class="ml-4 mt-1" for="from_type_supplier">Nhà cung cấp</label>
                    <input type="radio" v-model="trade.from_type" name="from_type" :value="0" class="ml-5 mt-2" id="from_type_customer" @change="changeFromType">
                    <label class="ml-4 mt-1" for="from_type_customer">Khách hàng</label>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label>
                      <span v-show="trade.from_type == 1">Nhà cung cấp</span>
                      <span v-show="trade.from_type == 0">Khách hàng</span>
                    </label>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <multiselect
                      v-show="trade.from_type == 1"
                      v-model="supplierSelect"
                      :options="supplierOptionStore"
                      :loading="loadingGetOptions"
                      placeholder="--Chọn nhà cung cấp--"
                      label="name"
                      track-by="name"
                      @input="changeSupplier">
                    </multiselect>

                    <div class="input-group" v-show="trade.from_type == 0">
                      <multiselect
                        v-model="customerSelect"
                        :options="customerOptionStore"
                        :loading="loadingGetOptions"
                        placeholder="--Chọn khách hàng--"
                        label="name"
                        track-by="name"
                        @input="changeCustomer">
                      </multiselect>

                      <b-button variant="outline-primary" class="pull-right ml-2" @click="showModalSearchCustomer" >
                        <i class="fa fa-search"></i>
                      </b-button>

                      <b-button variant="outline-success" class="pull-right ml-2" @click="showModalAddCustomer" >
                        <i class="fa fa-plus"></i>
                      </b-button>
                    </div>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label>
                      <span v-show="trade.from_type == 1">Tên nhà cung cấp</span>
                      <span v-show="trade.from_type == 0">Tên khách hàng</span>
                    </label>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <input
                      id="customer_name"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_name"
                      :disabled="saving"
                      v-show="trade.from_type == 0">

                    <input
                      id="supplier_name"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.supplier_name"
                      :disabled="saving"
                      v-show="trade.from_type == 1">
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label>
                      <span v-show="trade.from_type == 1">SĐT nhà cung cấp</span>
                      <span v-show="trade.from_type == 0">SĐT khách hàng</span>
                    </label>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <input
                      id="customer_phone"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_phone"
                      :disabled="saving"
                      @keyup="integerOnly($event.target)"
                      v-show="trade.from_type == 0">

                    <input
                      id="supplier_phone"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.supplier_phone"
                      :disabled="saving"
                      @keyup="integerOnly($event.target)"
                      v-show="trade.from_type == 1">
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label>
                      <span v-show="trade.from_type == 1">Địa chỉ nhà cung cấp</span>
                      <span v-show="trade.from_type == 0">Địa chỉ khách hàng</span>
                    </label>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <input
                      id="address"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_address"
                      :disabled="saving"
                      v-show="trade.from_type == 0">

                    <input
                      id="supplier_address"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.supplier_address"
                      :disabled="saving"
                      v-show="trade.from_type == 1">
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

                <!--<b-row class="form-row">-->
                  <!--<b-col md="3" class="mt-2">-->
                    <!--<label>Nhóm sản phẩm </label><span class="error-sybol"></span>-->
                  <!--</b-col>-->
                  <!--<b-col md="9" class="mt-2">-->
                    <!--<div class="input-group">-->
                      <!--<multiselect-->
                        <!--v-model="productGroupSelect"-->
                        <!--:options="productGroupOptions"-->
                        <!--:loading="loadingGetOptions"-->
                        <!--placeholder="&#45;&#45;Chọn nhóm sản phẩm&#45;&#45;"-->
                        <!--label="name"-->
                        <!--track-by="name"-->
                        <!--@input="changeProductGroup">-->
                      <!--</multiselect>-->

                      <!--<b-button variant="outline-success" class="pull-right ml-2" @click="showModalAddGroupProduct">-->
                        <!--<i class="fa fa-plus"></i>-->
                      <!--</b-button>-->
                    <!--</div>-->


                  <!--</b-col>-->
                <!--</b-row>-->

                <!--<b-row class="form-row">-->
                  <!--<b-col md="3" class="mt-2">-->
                    <!--<label>Loại sản phẩm </label><span class="error-sybol"></span>-->
                  <!--</b-col>-->
                  <!--<b-col md="9" class="mt-2">-->
                    <!--<div class="input-group">-->
                      <!--<multiselect-->
                        <!--v-model="productTypeSelect"-->
                        <!--:options="productTypeOptions"-->
                        <!--:loading="loadingGetOptions"-->
                        <!--placeholder="&#45;&#45;Chọn loại sản phẩm&#45;&#45;"-->
                        <!--label="name"-->
                        <!--track-by="name"-->
                        <!--@input="changeProductType">-->
                      <!--</multiselect>-->

                      <!--<b-button variant="outline-success" class="pull-right ml-2" @click="showModalAddTypeProduct">-->
                        <!--<i class="fa fa-plus"></i>-->
                      <!--</b-button>-->
                    <!--</div>-->
                  <!--</b-col>-->
                <!--</b-row>-->

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label>Sản phẩm </label><span class="error-sybol"></span>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <div class="input-group">
                      <multiselect
                        v-model="productSelect"
                        :options="productOptions"
                        :loading="loadingGetOptions"
                        placeholder="--Chọn sản phẩm--"
                        label="name_full"
                        track-by="name_full"
                        @input="changeProduct">
                      </multiselect>

                      <b-button variant="outline-primary" class="pull-right ml-2" @click="showModalSearchProduct" >
                        <i class="fa fa-search"></i>
                      </b-button>

                      <b-button variant="outline-success" class="pull-right ml-2" @click="showModalAddProduct" >
                        <i class="fa fa-plus"></i>
                      </b-button>
                    </div>
                  </b-col>
                </b-row>

                <b-row class="form-row mt-2" v-show="currentProperties.length > 0">
                  <b-col md="3">
                    <label>Thuộc tính</label>
                  </b-col>
                  <b-col md="9">
                    <p v-for="(item) in currentProperties" :key="item.name">
                      <input :id="item.name" type="checkbox" name="properties" v-model="propertiesChoosen" :value="item.name">
                      <label :for="item.name">{{ item.name }}:
                        <span v-for="(value, index) in item.value" :key="value">
                          <input type="radio" :id="item.name + value" :value="value" :name="item.name" class="ml-2" :checked="index == 0">
                          <label :for="value" class="ml-1">{{value}}</label>
                        </span>
                      </label>
                    </p>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label>Đơn giá mua</label><span class="error-sybol"></span>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <input
                      id="price_buy"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.price_buy"
                    @change="changePriceBuy">
                  </b-col>
                </b-row>
                <!--@keyup="integerPointAndCommaOnly($event.target)"-->

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label>Số lượng {{unit_name}}</label><span class="error-sybol"></span>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <input
                      id="quantity"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.quantity"
                    @change="changeQuantity">
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label>Giá bán dự tính</label>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <input
                      id="price_sell"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.price_sell"
                    @change="changePriceSell">
                  </b-col>
                </b-row>

                <b-row class="mt-2">
                  <b-col md="12" class="text-center">
                    <b-button variant="outline-primary" class="text-center btn-width-120" @click="confirmBuyProduct">
                      Xác nhận
                    </b-button>
                    <b-button v-show="isShowCalCafe" variant="outline-secondary" class="text-center btn-width-120" @click="showModalCafeCalBy">
                      Tính toán
                    </b-button>
                  </b-col>
                </b-row>

                <b-row class="mt-2" v-show="trade.products.length > 0" >
                  <b-col md="12">
                    <h5>Danh sách sản phẩm đang mua</h5>
                  </b-col>
                </b-row>
                <b-row class="mt-2" v-show="trade.products.length > 0">
                  <b-col md="12">
                  <table class="table table-bordered table-striped fixed_header">
                    <thead>
                    <tr>
                      <th class="text-center font-weight-bold">STT</th>
                      <th class="text-center font-weight-bold">Sản phẩm</th>
                      <th class="text-center font-weight-bold">Thuộc tính</th>
                      <th class="text-center font-weight-bold">Đơn giá</th>
                      <th class="text-center font-weight-bold">Số lượng</th>
                      <th class="text-center font-weight-bold">Thành tiền</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in trade.products" :key="item.index">
                      <td>{{item.index}}</td>
                      <td>{{item.product_name}}</td>
                      <td>
                        <p v-for="(pro) in item.properties" :key="pro.name">
                          + {{pro.name}}: {{pro.value}}
                        </p>
                      </td>
                      <td class="text-right">{{currencyFormat(item.price_buy)}}</td>
                      <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                      <td class="text-right">{{currencyFormat(item.amount_buy)}}</td>
                      <td><i class="fa fa-trash" @click="deleteProduct(item.index)" /></td>
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
                  <span class="pull-left">Thông tin thanh toán</span>
                  <span class="pull-right" v-show="showPaymentInfo" @click="showPaymentInfo = !showPaymentInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showPaymentInfo" @click="showPaymentInfo = !showPaymentInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </b-col>
            </b-row>

            <b-row class="mt-2" v-show="showPaymentInfo">
              <b-col>
                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Tổng tiền sản phẩm </label>
                  </b-col>
                  <b-col md="9">
                    <input
                      id="sub_total"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.sub_total"
                      readonly>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Chi phí thêm </label>
                  </b-col>
                  <b-col md="9">
                    <input
                      id="extra_fee"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.extra_fee"
                      @change="calculateAmount">
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Số tiền giảm  </label>
                  </b-col>
                  <b-col md="9">
                    <input
                      id="fixed_discount"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.fixed_discount"
                      @change="calculateAmount">
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Thuế VAT </label>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <div class="input-group">
                      <input type="checkbox" id="have_vat" v-model="trade.have_vat" class="mr-2" @change="calculateAmount">
                      <input
                        id="vat_percent"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control mr-2"
                        v-model="trade.vat_percent"
                        @change="calculateAmount">
                      <input
                        id="vat_value"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="trade.vat_value"
                        @change="calculateAmount">
                    </div>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Thành tiền </label><span class="error-sybol"></span>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <input
                      id="amount"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.total"
                      readonly>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Số tiền thanh toán </label>
                  </b-col>
                  <b-col md="9">
                    <input
                      id="total_paid"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.total_paid"
                      @change="changeTotalPaid">
                  </b-col>
                </b-row>

                <b-row class="form-row" v-show="isShowApoimentPayment">
                  <b-col md="3" class="mt-2">
                    <label> Số tiền nợ lại </label>
                  </b-col>
                  <b-col md="9" class="mt-2">
                    <input
                      id="amount_remaining"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.amount_remaining"
                      readonly>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-show="isShowApoimentPayment">
                  <b-col md="3" class="mt-2">
                    <label>Lãi suất (%)</label>
                  </b-col>
                  <b-col md="9">
                    <input
                      id="interest_rate"
                      type="text"
                      class="form-control"
                      v-model="trade.interest_rate"
                      autocomplete="new-password"
                      maxlength="5"
                      @keyup="integerAndPointOnly($event.target)">
                  </b-col>
                </b-row>

                <b-row class="form-row" v-show="isShowApoimentPayment">
                  <b-col md="3" class="mt-2">
                    <label>Kỳ hạn tính lãi</label>
                  </b-col>
                  <b-col md="9">
                    <b-form-select
                      :options="periodOptions"
                      id="interest_period"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.interest_period">
                    </b-form-select>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-show="isShowApoimentPayment">
                  <b-col md="3" class="mt-2">
                    <label> Ngày hẹn thanh toán </label>
                  </b-col>
                  <b-col md="9">
                    <datepicker v-model="trade.appointment_date" format="yyyy-MM-dd" :typeable="true"
                                placeholder="2022-12-31" input-class="datepicker-cus" ></datepicker>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-show="isShowApoimentPayment">
                  <b-col md="3" class="mt-2">
                    <label> Nhắc hẹn thanh toán trước số ngày </label>
                  </b-col>
                  <b-col md="9">
                    <input
                      id="forewarning"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.forewarning"
                      @keyup="integerOnly($event.target)">
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Loại tiền thanh toán </label>
                  </b-col>
                  <b-col md="9" class="pl-2">

                    <b-row class="form-row">
                      <b-col md="3" class="mt-2">
                        <label> Tiền mặt </label>
                      </b-col>
                      <b-col md="9">
                        <input
                          id="cash_input"
                          type="text"
                          class="form-control"
                          v-model="trade.cash"
                          autocomplete="new-password"
                          maxlength="14"
                          @change="changeCash">
                      </b-col>
                    </b-row>

                    <b-row class="form-row">
                      <b-col md="3" class="mt-2">
                        <label> Chuyển khoản </label>
                      </b-col>
                      <b-col md="9">
                        <input
                          id="credit_input"
                          type="text"
                          class="form-control"
                          v-model="trade.credit"
                          autocomplete="new-password"
                          maxlength="14"
                          @change="changeCredit">
                      </b-col>
                    </b-row>

                    <b-row class="form-row">
                      <b-col md="3" class="mt-2">
                        <label> Tiền điện tử </label>
                      </b-col>
                      <b-col md="9">
                        <input
                          id="e_money_input"
                          type="text"
                          class="form-control"
                          v-model="trade.e_money"
                          autocomplete="new-password"
                          maxlength="14"
                          @change="changeEMoney">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="3" class="mt-2">
                    <label> Ghi chú </label>
                  </b-col>
                  <b-col md="9">
                    <b-form-textarea
                      id="description"
                      style="width:100%;"
                      rows="3"
                      v-model="trade.description"
                    ></b-form-textarea>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button variant="outline-primary" class="pull-right btn-width-200" @click="printProvisionalInvoice">
                  In hóa đơn tạm tính
                </b-button>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button v-show="!saving" variant="outline-success" style="height: 50px; width: 240px" @click="save"
                          :disabled="saving || !this.trade.id">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận Mua
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!--    Print-->
    <b-row hidden id="provisionalInvoice">
      <b-col>

        <div>
          <div class="print-text-left print-width-50-left">
            <h4>TÊN CỤC THUẾ................</h4>
          </div>
          <b-col class="print-text-right print-width-50-right">
            <h4>Mẫu số: 02GTTT3/001</h4>
          </b-col>
        </div>

        <h2 class="print-text-center">HOÁ ĐƠN MUA HÀNG{{suffix_print_title}}</h2>
        <p class="print-text-center">Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</p>
        <p class="print-text-center">Số hoá đơn: {{trade.bill_number}}</p>
        <br>
        <div class="print-border print-pl-2">
          <table style="width:100%">
            <tr><td class="print-no-border">Đơn vị bán hàng: <b>
              <span v-show="trade.from_type == 1">{{trade.supplier_name}}</span>
              <span v-show="trade.from_type == 0">{{trade.customer_name}}</span>
            </b></td></tr>
            <tr><td class="print-no-border">Mã số thuế:
              <span v-show="trade.from_type == 1">{{trade.supplier_tax_code}}</span>
              <span v-show="trade.from_type == 0">{{trade.customer_tax_code}}</span>
            </td></tr>
            <tr><td class="print-no-border">Địa chỉ:
              <span v-show="trade.from_type == 1">{{trade.supplier_address}}</span>
              <span v-show="trade.from_type == 0">{{trade.customer_address}}</span>
            </td></tr>
            <tr><td class="print-no-border">Điện thoại:
              <span v-show="trade.from_type == 1">{{trade.supplier_phone}}</span>
              <span v-show="trade.from_type == 0">{{trade.customer_phone}}</span>
            </td></tr>
          </table>

          <table style="width:100%">
            <tr><td class="print-no-border">Họ tên người mua hàng: <b>{{store_name}}</b></td></tr>
            <tr><td class="print-no-border">Mã số thuế: {{store_tax_code}}</td></tr>
            <tr><td class="print-no-border">Địa chỉ: {{store_address}}</td></tr>
            <tr><td class="print-no-border">Điện thoại: {{store_phone_number}}</td></tr>
          </table>
          <hr>

        </div>
        <br>
        <div id="print-table-border">
          <table style="width:100%">
            <tr class="print-text-center">
              <th>STT</th>
              <th>Tên hàng hóa, dv</th>
              <th>Đơn vị tính</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
            <tr v-for="(item, index) in trade.products" :key="item.product_id">
              <td class="print-text-center">{{index + 1}}</td>
              <td>{{item.product_name}}</td>
              <td>{{item.id}}</td>
              <td class="print-text-right">{{currencyFormat(item.price_buy)}}</td>
              <td class="print-text-right">{{currencyFormat(item.quantity)}}</td>
              <td class="print-text-right">{{currencyFormat(item.amount_buy)}}</td>
            </tr>
            <tr>
              <td colspan="5">Tổng tiền sản phẩm</td>
              <td class="print-text-right">{{currencyFormat(trade.sub_total)}}</td>
            </tr>
            <tr v-show="trade.extra_fee && parseInt(trade.extra_fee) > 0">
              <td colspan="5">Chi phí khác</td>
              <td class="print-text-right">+{{currencyFormat(trade.extra_fee)}}</td>
            </tr>
            <tr v-show="trade.fixed_discount && parseInt(trade.fixed_discount) > 0">
              <td colspan="5">Giảm giá</td>
              <td class="print-text-right">-{{currencyFormat(trade.fixed_discount)}}</td>
            </tr>
            <tr v-show="trade.vat_value && parseInt(trade.vat_value) > 0">
              <td colspan="5">VAT ({{trade.vat_percent}}%)</td>
              <td class="print-text-right">+{{currencyFormat(trade.vat_value)}}</td>
            </tr>
            <tr>
              <td colspan="5">Thành tiền</td>
              <td class="print-text-right"><b>{{currencyFormat(trade.total)}}</b></td>
            </tr>
            <tr>
              <td colspan="6">Số tiền viết bằng chữ: {{convertNumberToText(trade.total)}}</td>
            </tr>

          </table>
          <br>
          <div>
            <table style="width:100%">
              <tr>
                <td colspan="3" class="print-text-center print-no-border">Người mua hàng</td>
                <td colspan="3" class="print-text-center print-no-border">Người bán hàng</td>
              </tr>
              <tr>
                <td colspan="3" class="print-text-center print-no-border">(Ký, ghi rõ họ tên)</td>
                <td colspan="3" class="print-text-center print-no-border">(Ký, đóng dấu, ghi rõ họ tên)</td>
              </tr>
            </table>
          </div>

        </div>


      </b-col>

    </b-row>

    <!--Modal thêm nhóm sản phẩm -->
      <b-modal centered hide-footer hide-header no-close-on-backdrop size="lg" id="modal-add-group-product">
        <b-row>
          <b-col md="12">
            <h4 class="modal-title text-center text-success">Thêm nhóm sản phẩm</h4>
          </b-col>
        </b-row>
        <hr>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Mã nhóm sản phẩm </label><span class="error-sybol"></span>

            <input
            id="code"
            type="text"
            maxlength="30"
            autocomplete="new-password"
            class="form-control"
            v-model="productGroup.code">
          </b-col>
        </b-row>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Tên nhóm sản phẩm </label><span class="error-sybol"></span>

            <input
            id="name"
            type="text"
            maxlength="255"
            autocomplete="new-password"
            class="form-control"
            v-model="productGroup.name">
          </b-col>
        </b-row>

        <b-row class="mt-2">
              <b-col cols="12">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="backGroupProduct">
                  Hủy bỏ
                </b-button>
                <b-button v-show="!savingGroupProduct" variant="outline-success"
                          class="pull-right btn-width-120" @click="saveGroupProduct"
                          :disabled="savingGroupProduct">
                    Lưu
                </b-button>
                <span class="loading-more" v-show="savingGroupProduct"><icon name="loading" width="60" /></span>

              </b-col>
            </b-row>

      </b-modal>

    <!--Modal thêm loại sản phẩm -->
      <b-modal centered hide-footer hide-header no-close-on-backdrop size="lg" id="modal-add-type-product">
        <b-row>
          <b-col md="12">
            <h4 class="modal-title text-center text-success">Thêm loại sản phẩm</h4>
          </b-col>
        </b-row>
        <hr>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Nhóm sản phẩm </label><span class="error-sybol"></span>
              <multiselect
                v-model="productGroupSelectAdd"
                :options="productGroupOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn nhóm sản phẩm--"
                label="name"
                track-by="name"
                @input="changeProductGroupWhenAddType">
              </multiselect>
          </b-col>
        </b-row>

        <b-row class="form-row">
            <b-col md="12" class="mt-2">
              <label> Mã loại sản phẩm </label><span class="error-sybol"></span>
              <input
              id="codeType"
              type="text"
              maxlength="30"
              autocomplete="new-password"
              class="form-control"
              v-model="productType.code">
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="12" class="mt-2">
              <label> Tên loại sản phẩm </label><span class="error-sybol"></span>
              <input
              id="nameType"
              type="text"
              maxlength="255"
              autocomplete="new-password"
              class="form-control"
              v-model="productType.name">
            </b-col>
          </b-row>

        <b-row class="mt-2">
              <b-col cols="12">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="backTypeProduct">
                  Hủy bỏ
                </b-button>
                <b-button v-show="!savingTypeProduct" variant="outline-success"
                          class="pull-right btn-width-120" @click="saveTypeProduct"
                          :disabled="savingTypeProduct">
                    Lưu
                </b-button>
                <span class="loading-more" v-show="savingTypeProduct"><icon name="loading" width="60" /></span>

              </b-col>
            </b-row>

      </b-modal>

      <!--Modal thêm sản phẩm -->
      <b-modal centered hide-footer hide-header no-close-on-backdrop size="lg" id="modal-add-product">
        <b-row>
          <b-col md="12">
            <h4 class="modal-title text-center text-success">Thêm sản phẩm</h4>
          </b-col>
        </b-row>
        <hr>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Nhóm sản phẩm </label><span class="error-sybol"></span>
            <multiselect
                v-model="productGroupSelectAdd"
                :options="productGroupOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn nhóm sản phẩm--"
                label="name"
                track-by="name"
                @input="changeProductGroupWhenAddProduct">
              </multiselect>
          </b-col>
        </b-row>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Loại sản phẩm </label><span class="error-sybol"></span>
            <multiselect
                v-model="productTypeSelectAdd"
                :options="productTypeOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn loại sản phẩm--"
                label="name"
                track-by="name"
                @input="changeProductTypeWhenAddProduct">
              </multiselect>
          </b-col>
        </b-row>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Hãng sản phẩm </label>
            <b-form-select
              :options="productBrandOptions"
              id="product_brand"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="product.product_brand_id"></b-form-select>
          </b-col>
        </b-row>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Mã sản phẩm </label>
            <input
              id="codeProduct"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="product.code"
              maxlength="30">
          </b-col>
        </b-row>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Tên sản phẩm </label><span class="error-sybol"></span>
            <input
              id="nameProduct"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="product.name"
              maxlength="255">
          </b-col>
        </b-row>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Đơn vị </label><span class="error-sybol"></span>
            <b-form-select
              :options="unitOptions"
              id="unit"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="product.unit_id"></b-form-select>
          </b-col>
        </b-row>

        <b-row class="form-row">
          <b-col md="12" class="mt-2">
            <label> Mô tả </label>
            <b-form-textarea
              id="description"
              style="width:100%;"
              rows="3"
              v-model="product.description"
            ></b-form-textarea>
          </b-col>
        </b-row>

        <b-row class="mt-2">
          <b-col cols="12">
            <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="backProduct">
              Hủy bỏ
            </b-button>
            <b-button v-show="!savingProduct" variant="outline-success"
                      class="pull-right btn-width-120" @click="saveProduct"
                      :disabled="savingProduct">
              Lưu
            </b-button>
            <span class="loading-more" v-show="savingProduct"><icon name="loading" width="60" /></span>

          </b-col>
        </b-row>

      </b-modal>

      <!--Modal tìm kiếm sản phẩm -->
      <b-modal centered hide-footer hide-header no-close-on-backdrop size="xl" id="modal-search-product">
        <b-row>
          <b-col md="12">
            <h4 class="modal-title text-center text-success">Tìm kiếm sản phẩm</h4>
          </b-col>
        </b-row>
        <hr>

        <b-row class="form-row">
          <b-col md="3" class="mt-2">
            <label>Nhóm sản phẩm</label>
            <multiselect
              v-model="productGroupSearchSelect"
              :options="productGroupOptions"
              :loading="loadingGetOptions"
              placeholder="--Chọn nhóm sản phẩm--"
              label="name"
              track-by="name"
              @input="changeProductGroupSearch">
            </multiselect>
          </b-col>

          <b-col md="3" class="mt-2">
            <label>Loại sản phẩm</label>
            <multiselect
              v-model="productTypeSearchSelect"
              :options="productTypeSearchOptions"
              :loading="loadingGetOptions"
              placeholder="--Chọn loại sản phẩm--"
              label="name"
              track-by="name"
              @input="changeProductTypeSearch">
            </multiselect>
          </b-col>

          <b-col md="3" class="mt-2">
            <label>Mã sản phẩm</label>
            <input
              id="codeProductCus"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="productSearch.code"
              maxlength="30">
          </b-col>

          <b-col md="3" class="mt-2">
            <label>Tên sản phẩm</label>
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
                      @click.prevent="searchProduct">
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
              :fields="productSearchFields"
              :items="productSearchItems">
              <template v-slot:cell(actions)="data">
                <b-button variant="outline-success" class="pull-right btn-width-120"
                  @click.prevent="chooseProduct(data.item.id)">
                  Chọn
                </b-button>
              </template>
            </b-table>
          </b-col>
        </b-row>

        <b-row class="mt-3">
          <b-col>
            <span>--Hết--</span>
          </b-col>
        </b-row>

      </b-modal>

    <!--Modal tìm kiếm khách hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-customer">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tìm kiếm khách hàng</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="6">
          <label> Tên </label>
          <input
            id="nameCusSearch"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="customerSearch.name"
            maxlength="75">
        </b-col>
        <b-col md="6">
          <label> Số điện thoại </label>
          <input
            id="phoneNumberCus"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="customerSearch.phone"
            maxlength="11"
            @keyup="integerOnly($event.target)">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click.prevent="hideModalSearchCustomer">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchCustomer" @click.prevent="searchCustomer">
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
            :fields="customerSearchFields"
            :items="customerSearchItems">
            <template v-slot:cell(action)="data">
              <b-button variant="outline-success" class="pull-right btn-width-120"
                        @click.prevent="chooseCustomer(data.item.id, data.item.name, data.item.phone_number, data.item.address, data.item.tax_code)">
                Chọn
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col>
          <span>--Hết--</span>
        </b-col>
      </b-row>

    </b-modal>

    <!--Modal thêm khách hàng -->
    <b-modal centered hide-footer hide-header no-close-on-backdrop size="lg" id="modal-add-customer">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Thêm khách hàng</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label> Loại khách hàng </label>
        </b-col>
        <b-col md="9">
          <div class="input-group">
            <input type="radio" v-model="customer.type" name="type" value="0" class="mt-2"><label class="ml-4 mt-1">Cá nhân</label>
            <input type="radio" v-model="customer.type" name="type" value="1" class="ml-5 mt-2"><label class="ml-4 mt-1">Công ty</label>
          </div>
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label> Tên </label><span class="error-sybol"></span>
        </b-col>
        <b-col md="9">
          <input
            id="nameCus"
            type="text"
            class="form-control"
            v-model="customer.name"
            autocomplete="new-password"
            maxlength="75">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label> Số Điện Thoại </label><span class="error-sybol"></span>
        </b-col>
        <b-col md="9">
          <input
            id="phoneCuss"
            type="text"
            class="form-control"
            v-model="customer.phone_number"
            @keyup="integerOnly($event.target)"
            autocomplete="new-password"
            maxlength="20"
            v-on:change="checkPhoneNumberFormat($event.target.value)">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>Giới Tính</label>
        </b-col>
        <b-col md="9">
          <b-form-select :options="optionsGender" v-model="customer.gender"></b-form-select>
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>Ngày Tháng Năm Sinh</label>
        </b-col>
        <b-col md="9">
          <datepicker v-model="customer.birthday" format="yyyy-MM-dd" :typeable="true"
                                placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>Tỉnh/ Thành Phố</label>
        </b-col>
        <b-col md="9">
          <b-form-select
            id="city_id"
            :options="optionsCity"
            v-model="customer.city_id"
            type="text"
            class="form-control"
            v-on:change="changeCity($event.target)"
          ></b-form-select>
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>Quận/ Huyện</label>
        </b-col>
        <b-col md="9">
          <b-form-select
            id="district_id"
            :options="optionsDistrict"
            v-model="customer.district_id"
            type="text"
            class="form-control"
            :disabled="!customer.city_id"
          ></b-form-select>
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label> Địa chỉ </label>
        </b-col>
        <b-col md="9">
          <input
            id="addressCus"
            type="text"
            class="form-control"
            v-model="customer.address"
            autocomplete="new-password"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label> Mã số thuế </label>
        </b-col>
        <b-col md="9">
          <input
            id="tax_code"
            type="text"
            class="form-control"
            v-model="customer.tax_code"
            @keyup="integerOnly($event.target)"
            autocomplete="new-password"
            maxlength="20">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="backCustomer">
            Hủy bỏ
          </b-button>
          <b-button v-show="!savingCustomer" variant="outline-success"
                    class="pull-right btn-width-120" @click="saveCustomer"
                    :disabled="savingCustomer">
            Lưu
          </b-button>
          <span class="loading-more" v-show="savingCustomer"><icon name="loading" width="60" /></span>

        </b-col>
      </b-row>

    </b-modal>

    <!--Modal thao tác sau khi xác nhận mua -->
      <b-modal centered hide-footer hide-header no-close-on-backdrop size="lg" id="modal-actions">
        <b-row>
          <b-col md="12">
            <h4 class="modal-title text-center text-success">Mua hàng thành công!</h4>
          </b-col>
        </b-row>
        <hr>

        <b-row>
          <b-col md="4" class="mt-2 text-center">
            <b-button variant="outline-secondary" class="text-center btn-width-120" @click="back">
              Quay lại
            </b-button>
          </b-col>
          <b-col md="4" class="mt-2 text-center">
            <b-button variant="outline-success" class="text-center btn-width-120" @click="buyNext">
              Mua tiếp
            </b-button>
          </b-col>
          <b-col md="4" class="mt-2 text-center">
            <b-button variant="outline-primary" class="text-center btn-width-120" @click="printInvoice">
              In hóa đơn
            </b-button>
          </b-col>
        </b-row>

      </b-modal>

    <!--Modal tính số lượng thực tế dựa trên tạp và độ ẩm -->
    <b-modal centered hide-footer hide-header size="lg" id="modal-cal-impurities-moisture">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-header">Tính toán dựa trên độ ẩm và tạp</h4>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Độ ẩm tiêu chuẩn </label><span class="error-sybol"></span>
          <div class="input-group">
            <input
              id="moisture_default"
              type="text"
              maxlength="20"
              autocomplete="new-password"
              class="form-control"
              v-model="cafe_impurities_and_moisture.moisture_default"
              @keyup="integerAndPointOnly($event.target)"
              :disabled="!edit_moisture_default">
            <b-button v-show="edit_moisture_default == false" variant="outline-primary" class="ml-2 pull-right text-center btn-width-80"
                      @click="edit_moisture_default = true">
              Sửa
            </b-button>
            <b-button v-show="edit_moisture_default == true" variant="outline-success" class="ml-2 pull-right text-center btn-width-80"
                      @click="updateStoreSetting('moisture_default')">
              Lưu
            </b-button>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> % tạp tiêu chuẩn </label><span class="error-sybol"></span>
          <div class="input-group">
            <input
              id="impurities_default"
              type="text"
              maxlength="20"
              autocomplete="new-password"
              class="form-control"
              v-model="cafe_impurities_and_moisture.impurities_default"
              @keyup="integerAndPointOnly($event.target)"
              :disabled="!edit_impurities_default">
            <b-button v-show="edit_impurities_default == false" variant="outline-primary" class="ml-2 pull-right text-center btn-width-80"
                      @click="edit_impurities_default = true">
              Sửa
            </b-button>
            <b-button v-show="edit_impurities_default == true" variant="outline-success" class="ml-2 pull-right text-center btn-width-80"
                      @click="updateStoreSetting('impurities_default')">
              Lưu
            </b-button>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Cân nặng bì tiêu chuẩn </label><span class="error-sybol"></span>
          <div class="input-group">
            <input
              id="bad_weight_default"
              type="text"
              maxlength="20"
              autocomplete="new-password"
              class="form-control"
              v-model="cafe_impurities_and_moisture.bad_weight_default"
              @keyup="integerAndPointOnly($event.target)"
              :disabled="!edit_bad_weight_default">
            <b-button v-show="edit_bad_weight_default == false" variant="outline-primary" class="ml-2 pull-right text-center btn-width-80"
                      @click="edit_bad_weight_default = true">
              Sửa
            </b-button>
            <b-button v-show="edit_bad_weight_default == true" variant="outline-success" class="ml-2 pull-right text-center btn-width-80"
                      @click="updateStoreSetting('bad_weight_default')">
              Lưu
            </b-button>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Độ ẩm thực tế </label> <span class="error-sybol"></span>
          <input
            id="moisture_input"
            type="text"
            maxlength="20"
            autocomplete="new-password"
            class="form-control"
            v-model="cafe_impurities_and_moisture.moisture_input"
            @keyup="integerAndPointOnly($event.target)">
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> % tạp thực tế </label> <span class="error-sybol"></span>
          <input
            id="impurities_input"
            type="text"
            maxlength="20"
            autocomplete="new-password"
            class="form-control"
            v-model="cafe_impurities_and_moisture.impurities_input"
            @keyup="integerAndPointOnly($event.target)">
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Số lượng bì </label> <span class="error-sybol"></span>
          <input
            id="number_bag_input"
            type="text"
            maxlength="20"
            autocomplete="new-password"
            class="form-control"
            v-model="cafe_impurities_and_moisture.number_bag_input"
            @keyup="integerOnly($event.target)">
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <label> Số lượng nhập </label> <span class="error-sybol"></span>
          <input
            id="phone"
            type="text"
            maxlength="20"
            autocomplete="new-password"
            class="form-control"
            v-model="cafe_impurities_and_moisture.quantity"
            @keyup="integerAndPointOnly($event.target)">
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <p> Mỗi đơn vị trừ: <b>{{currencyFormat(result_cal_cafe_impurities_and_moisture.minus_in_1_kg)}} đơn vị</b></p>
          <p> Tổng số lượng trừ ẩm, tạp: <b>{{currencyFormat(result_cal_cafe_impurities_and_moisture.minus_in_all_1)}} đơn vị</b></p>
          <p> Tổng số lượng trừ bì: <b>{{currencyFormat(result_cal_cafe_impurities_and_moisture.minus_in_all_2)}} đơn vị</b></p>
          <p> Số lượng thực tế nhập kho: <b class="text-header">{{currencyFormat(result_cal_cafe_impurities_and_moisture.current_quantity)}} đơn vị</b></p>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <b-button variant="outline-secondary" class="pull-left text-center btn-width-120" :disabled="loading"
                    @click="hideModalCafeCalBy">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right text-center btn-width-120" :disabled="loading"
                    @click="calQuantityByImpuritiesAndMoisture">
            Xác nhận
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>


<script>
import productApi from '@/api/product'
import tradeApi from '@/api/trade'
import superAdminAPI from '@/api/superAdmin'
import customerApi from '@/api/customer'
import settingAPI from "@/api/setting"
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
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
      loadingGetOptions: false,
      supplierSelect: {},
      supplierOptions: [],
      supplierOptionStore: [],
      customerSelect: {},
      customerOptions: [],
      customerOptionStore: [],
      productGroupSelect: {},
      productGroupSearchSelect: {},
      productGroupOptions:[],
      productTypeSelect:{},
      productTypeSearchSelect: {},
      productTypeOptions:[],
      productTypeSearchOptions:[],
      productTypeOptionStore: [],
      productSelect: {},
      productOptions: [],
      productOptionStore: [],
      unitOptions:[],
      periodOptions: [
        {value: 'day', text: 'Ngày'},
        {value: 'month', text: 'Tháng'},
        {value: 'year', text: 'Năm'}
      ],
      trade: {
        "id": null,
        "bill_number": null,
        "from_type": 1,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_address": null,
        "customer_tax_code": null,
        "supplier_id": null,
        "supplier_name": null,
        "supplier_phone": null,
        "supplier_address": null,
        "supplier_tax_code": null,
        "sub_total": 0,
        "extra_fee": null,
        "fixed_discount": null,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "total_paid": null,
        "amount_remaining": 0,
        "cash": null,
        "credit": null,
        "e_money": null,
        "description": null,
        "products": [],
        "promotions": [],
        "interest_rate": 0,
        "interest_period": "month",
        "appointment_date": null,
        "forewarning": 30,
      },
      currentProduct: {
        "index": 0,
        "product_group_id": null,
        "product_group_name": null,
        "product_type_id": null,
        "product_type_name": null,
        "product_id": null,
        "product_name": null,
        "price_buy": null,
        "quantity": null,
        "amount_buy": null,
        "price_sell": null,
        "amount_sell": null,
        "properties": []
      },
      currentProperties: [],
      propertiesChoosen: [],
      unit_name: "",
      saving: false,
      loading: false,
      showPartnerInfo: true,
      showProductInfo: true,
      showPaymentInfo: true,
      saveSuccess: false,
      today_day: "",
      today_month: "",
      today_year: "",
      suffix_print_title: " TẠM TÍNH",
      store_name: "",
      store_tax_code: "",
      store_address: "",
      store_phone_number: "",
      isShowApoimentPayment: false,

      isShowCalCafe: false,
      cafe_impurities_and_moisture: {
        "impurities_default": 0, // Độ tạp
        "moisture_default": 0, // Độ ẩm
        "bad_weight_default": 0, // Cân nặng bao
        "impurities_input": null,
        "moisture_input": null,
        "number_bag_input": null,
        "quantity": null,
      },
      result_cal_cafe_impurities_and_moisture: {
        "minus_in_1_kg": 0,
        "minus_in_all_1": 0,
        "minus_in_all_2": 0,
        "current_quantity": 0,
      },
      edit_moisture_default: false,
      edit_impurities_default: false,
      edit_bad_weight_default: false,

      productGroup: {
        "code": null,
        "name": null,
      },
      savingGroupProduct: false,
      productGroupSelectAdd: {},
      productType: {
        "product_group_id": null,
        "code": null,
        "name": null,
      },
      savingTypeProduct: false,
      productTypeSelectAdd: {},
      productBrandOptions: [],
      product: {
        "code": null,
        "name": null,
        "product_type_id": null,
        "product_type_name": null,
        "product_group_id": null,
        "product_group_name": null,
        "product_brand_id": null,
        "product_brand_name": null,
        "unit_id": null,
        "description": null
      },
      savingProduct: false,
      productSearch: {
        "code": null,
        "name": null,
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

      customer: {
        "type": null,
        "name": null,
        "phone_number": null,
        "gender": null,
        "birthday": null,
        "city_id": null,
        "district_id": null,
        "address": null,
        "tax_code": null,
      },
      optionsGender: [
        {value: '1', text: 'Nam'},
        {value: '2', text: 'Nữ'},
        {value: '3', text: 'Khác'}
      ],
      optionsCity: [],
      optionsDistrict: [],
      savingCustomer: false,
      customerSearch: {
        "phone": null,
        "name": null
      },
      onSearchCustomer: false,
      customerSearchFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'type',
          label: 'Loại'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'phone_number',
          label: 'Số điện thoại'
        },
        {
          key: 'gender',
          label: 'Giới tính'
        },
        {
          key: 'birthday',
          label: 'Ngày sinh'
        },
        {
          key: 'tax_code',
          label: 'Mã số thuế'
        },
        {
          key: 'city_name',
          label: 'Tỉnh/TP'
        },
        {
          key: 'district_name',
          label: 'Quận/Huyện'
        },
        {
          key: 'address',
          label: 'Địa chỉ'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      customerSearchItems: [],

    }
  },
  created() {
    document.addEventListener('beforeunload', this.checkUpdateDraft())
  },
  mounted() {
    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    let toDate = new Date(dateNow.setDate(dateNow.getDate() + 60))
    this.trade.appointment_date = toDate.toJSON().slice(0,10)

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // Get trade detail
    this.getTradeDetail()

    // Get list promotion
    // TODO

    // VAT
    // TODO

      // Get store info
      this.getStoreDetail()

    // Get độ tạp, độ ẩm tiêu chuẩn từ setting
    this.getSettingByGroup()
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
     * Check phone number
     */
    checkPhoneNumberFormat(item) {
      let valueInput = item
      if (valueInput != null && valueInput != "") {
        if (!commonFunc.phoneNumberCheck(valueInput)) {
          return false
        }
      }
      return true
    },

    /**
     * Get district by city
     */
    changeCity() {
      let cityId = this.customer.city_id
      if(cityId != "" && cityId != undefined) {
        MasterApi.getDistrictOptions(cityId).then(res => {
          this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
        })
      } else {
        this.customer.district_id = ""
      }

    },

    showModalAddGroupProduct() {
        this.$bvModal.show('modal-add-group-product')
      },

    backGroupProduct() {
      this.productGroup = {
        "code": null,
        "name": null,
      }
        this.$bvModal.hide('modal-add-group-product')
    },

      /**
     * Save group product
     */
    saveGroupProduct () {
        // Check validate
          if(!this.productGroup.code) {
              this.popToast('danger', "Vui lòng nhập mã nhóm sản phẩm")
              return
          }
          if(!this.productGroup.name) {
              this.popToast('danger', "Vui lòng nhập tên nhóm sản phẩm")
              return
          }

      // Add
          this.savingGroupProduct = true
      productApi.addProductGroup(this.productGroup).then(res => {
        this.savingGroupProduct = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.popToast('success', "Thêm nhóm sản phẩm thành công!")

            this.currentProduct.product_group_id = res.data.data
            this.currentProduct.product_group_name = this.productGroup.name

            this.getOptionsRelated({"product_groups": true, "product_types": true, "products": true})

            this.backGroupProduct()
          } else {
              if (res.data.status == 422) {
                  this.popToast('danger', res.data.mess)
              }
          }
        }
      }).catch(err => {
        this.savingGroupProduct = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })

    },

      showModalAddTypeProduct() {
        this.productType.productGroupSelect = this.getProductGroupSelectedById(this.currentProduct.product_group_id)
        this.$bvModal.show('modal-add-type-product')
      },

    backTypeProduct() {
      this.productType = {
        "product_group_id": null,
        "code": null,
        "name": null,
      }
        this.$bvModal.hide('modal-add-type-product')
    },

      /**
     * Save type product
     */
    saveTypeProduct () {
        // Check validate
          if(!this.productType.product_group_id && !this.productType.product_group_id) {
              this.popToast('danger', "Vui lòng chọn nhóm sản phẩm")
              return
          }
          if(!this.productType.code) {
              this.popToast('danger', "Vui lòng nhập mã loại sản phẩm")
              return
          }
          if(!this.productType.name) {
              this.popToast('danger', "Vui lòng nhập tên loại sản phẩm")
              return
          }

      // Add
          this.savingTypeProduct = true
      productApi.addProductType(this.productType).then(res => {
        this.savingTypeProduct = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.popToast('success', "Thêm loại sản phẩm thành công!")

            this.currentProduct.product_group_id = this.productType.product_group_id
            this.currentProduct.product_group_name = this.productGroupSelect.name // this.getProductGroupNameById(this.currentProduct.product_group_id)
            this.currentProduct.product_type_id = res.data.data
            this.currentProduct.product_type_name = this.productType.name

            this.getProductGroupSelectedById(this.currentProduct.product_group_id)
            this.getOptionsRelated({"product_types": true, "products": true})

            this.backTypeProduct()
          } else {
              if (res.data.status == 422) {
                  this.popToast('danger', res.data.mess)
              }
          }
        }
      }).catch(err => {
        this.savingTypeProduct = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })

    },

    showModalAddProduct() {
      this.product.product_group_id = this.currentProduct.product_group_id
      this.product.product_type_id = this.currentProduct.product_type_id
      this.$bvModal.show('modal-add-product')
    },

    showModalSearchProduct() {
      this.$bvModal.show('modal-search-product')
    },

    hideModalSearchProduct() {
      this.$bvModal.hide('modal-search-product')
    },

    backProduct() {
      this.product = {
        "code": null,
          "name": null,
          "product_type_id": null,
          "product_group_id": null,
          "product_brand_id": null,
          "unit_id": null,
          "description": null
      }
      this.$bvModal.hide('modal-add-product')
    },

    /**
     * Save product
     */
    saveProduct () {
      // Check validate
      if(!this.product.product_group_id) {
        this.popToast('danger', "Vui lòng chọn nhóm sản phẩm")
        return
      }
      if(!this.product.product_type_id) {
        this.popToast('danger', "Vui lòng chọn loại sản phẩm")
        return
      }
      if(!this.product.unit_id) {
        this.popToast('danger', "Vui lòng chọn đơn vị")
        return
      }
      if(!this.product.code) {
        this.popToast('danger', "Vui lòng nhập mã sản phẩm")
        return
      }
      if(!this.product.name) {
        this.popToast('danger', "Vui lòng nhập tên sản phẩm")
        return
      }

      // Add
      this.savingProduct = true
      productApi.addProduct(this.product).then(res => {
        this.savingProduct = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.popToast('success', "Thêm sản phẩm thành công!")

            this.currentProduct.product_group_id = this.product.product_group_id
            this.currentProduct.product_group_name = this.productGroupSelectAdd.name //this.getProductGroupNameById(this.currentProduct.product_group_id)
            this.currentProduct.product_type_id = this.product.product_type_id
            this.currentProduct.product_type_name = this.productTypeSelectAdd.name //this.getProductTypeNameById(this.currentProduct.product_type_id)
            this.currentProduct.product_id = res.data.data
            this.currentProduct.product_name = this.product.name

            this.getOptionsRelated({"products": true})

            this.backProduct()
          } else {
              if (res.data.status == 422) {
                  this.popToast('danger', res.data.mess)
              }
          }
        }
      }).catch(err => {
        this.savingProduct = false

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

      let params = {
        "name": this.productSearch.name,
        "code": this.productSearch.code,
        "product_type_id": this.productSearch.product_type_id,
        "product_group_id": this.productSearch.product_group_id,
        "limit": 50,
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

      getProductGroupSelectedById(id) {
        for(let item of this.productGroupOptions) {
            if(item.id == id) {
                this.productGroupSelect = item
                return
            }
        }
      },

      getProductTypeSelectedById(id) {
        for(let item of this.productTypeOptionStore) {
            if(item.id == id) {
                this.productTypeSelect = item
                return
            }
        }

      },

      getProductSelectedById(id) {
        for(let item of this.productOptionStore) {
            if(item.id == id) {
                this.productSelect = item
                return
            }
        }
      },

    chooseProduct(product_id) {
      this.getProductSelectedById(product_id)
      this.changeProduct()
    },

    showModalAddCustomer() {
      this.$bvModal.show('modal-add-customer')
    },

    showModalSearchCustomer() {
      this.$bvModal.show('modal-search-customer')
    },

    backCustomer() {
      this.customer = {
        "type": null,
          "name": null,
          "phone_number": null,
          "gender": null,
          "birthday": null,
          "city_id": null,
          "district_id": null,
          "address": null,
          "tax_code": null,
      }
      this.$bvModal.hide('modal-add-customer')
    },

    hideModalSearchCustomer() {
      this.$bvModal.hide('modal-search-customer')
    },

    saveCustomer() {
      // Check validate
      if(!this.customer.type) {
        this.popToast('danger', "Vui lòng chọn loại khách hàng")
        return
      }
      if(!this.customer.name) {
        this.popToast('danger', "Vui lòng nhập tên khách hàng")
        return
      }
      if(!this.customer.phone_number) {
        this.popToast('danger', "Vui lòng nhập số điện thoại khách hàng")
        return
      }

      // Add
      this.savingCustomer = true
      customerApi.addCustomerByStore(this.customer).then(res => {
        this.savingCustomer = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.popToast('success', "Thêm khách hàng thành công!")

            this.getOptionsRelated({"customers": true})

            this.trade.customer_id = res.data.data
            this.trade.customer_name = this.customer.name
            this.trade.customer_phone = this.customer.phone_number
            this.trade.customer_address = this.customer.address
            this.trade.customer_tax_code = this.customer.tax_code

            this.backCustomer()
          }
        }
      }).catch(err => {
        this.savingCustomer = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Search
     */
    searchCustomer() {
      if (this.onSearchCustomer) { return }
      this.customerSearchItems = []

      this.onSearchCustomer = true

      let params = {
        "name": this.customerSearch.name,
        "phone": this.customerSearch.phone,
        "limit": 50,
        "offset": 0
      }

      customerApi.getCustomerByStore(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.customerSearchItems = res.data.data.customers
        } else {
          this.customerSearchItems = []
        }
        this.onSearchCustomer = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchCustomer = false
      })
    },

    chooseCustomer(id, name, phone_number, address, tax_code) {
      this.trade.customer_id = id
      this.trade.customer_name = name
      this.trade.customer_phone = phone_number
      this.trade.customer_address = address
      this.trade.customer_tax_code = tax_code

      this.getCustomerItemById(this.trade.customer_id)

      this.$bvModal.hide('modal-search-customer')
    },

      /**
     *  Get detail
     */
    getTradeDetail() {
      let tradeId = this.$route.params.id
      if(tradeId){
        this.loading = true

        tradeApi.getTradeDetail(tradeId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.trade = res.data.data

              // Format
              this.trade.sub_total = this.currencyFormat((this.trade.sub_total + '').replaceAll(",", ""))
              this.trade.total = this.currencyFormat((this.trade.total + '').replaceAll(",", ""))
              this.trade.extra_fee = this.currencyFormat((this.trade.extra_fee + '').replaceAll(",", ""))
              this.trade.fixed_discount = this.currencyFormat((this.trade.fixed_discount + '').replaceAll(",", ""))
              this.trade.total_paid = this.currencyFormat((this.trade.total_paid + '').replaceAll(",", ""))
              this.trade.cash = this.currencyFormat((this.trade.cash + '').replaceAll(",", ""))
              this.trade.credit = this.currencyFormat((this.trade.credit + '').replaceAll(",", ""))
              this.trade.e_money = this.currencyFormat((this.trade.e_money + '').replaceAll(",", ""))

              if(!this.trade.appointment_date) {
                  let dateNow = new Date()
                  let toDate = new Date(dateNow.setDate(dateNow.getDate() + 60))
                  this.trade.appointment_date = toDate.toJSON().slice(0,10)
                  this.trade.forewarning = 30
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

    resetListProductType() {
      this.productTypeSelect = {}
      this.productTypeSearchSelect = {}

      if(this.currentProduct.product_group_id) {
          this.getListProductTypeOptionByProductGroupId(this.currentProduct.product_group_id)
      } else {
          this.productTypeOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))
          if(this.productTypeOptions.length > 0) {
            let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
            itemEmpty.id = null
            itemEmpty.name = ""
            this.productTypeOptions.unshift(itemEmpty)
          }
      }
    },

    resetListProduct() {
      this.productSelect = {id: null, name: '', name_full: "-- Chọn sản phẩm --"}

      if(this.currentProduct.product_type_id) {
          this.getListOptionProductByProductTypeId(this.currentProduct.product_type_id)
      } else {
          this.productOptions = JSON.parse(JSON.stringify(this.productOptionStore))

          if(this.productOptions.length > 0) {
            let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
            itemEmpty.id = null
            itemEmpty.name = ""
            itemEmpty.name_full = "-- Chọn sản phẩm --"
            this.productOptions.unshift(itemEmpty)
          }
      }
    },

    getCustomerItemById(id) {
      for(let i in this.customerOptionStore) {
        if(this.customerOptionStore[i].id == id) {
          this.customerSelect = this.customerOptionStore[i]
        }
      }
    },

      getSupplierItemById(id) {
      for(let i in this.supplierOptionStore) {
        if(this.supplierOptionStore[i].id == id) {
          this.supplierSelect = this.supplierOptionStore[i]
        }
      }
    },

      /**
     *  Get product brand options
     */
    getProductBrandOption(brands) {
      this.productBrandOptions = [{value: null, text: ''}]
      if(brands) {
        for (let i in brands) {
          this.productBrandOptions.push(brands[i])
        }
      }
    },

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated(data) {
      this.loadingGetOptions = true
      let params = {
        "product_groups": true,
        "product_types": true,
        "products": true,
        "suppliers": true,
        "customers": true,
        "citys": true,
        "units": true,
        "product_brands": true
      }
      if(data) {
        params = data
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // product_groups
          if(params.product_groups) {
            this.productGroupOptions = options.product_groups
            let itemEmpty = {"id": null, "name": ""}
            this.productGroupOptions.unshift(itemEmpty)

            if(this.currentProduct.product_group_id) {
                this.getProductGroupSelectedById(this.currentProduct.product_group_id)
                this.changeProductGroup()
            }
          }

          // product_types
          if(params.product_types) {
            this.productTypeOptionStore = options.product_types
            this.resetListProductType()

            if(this.currentProduct.product_type_id) {
                this.getProductTypeSelectedById(this.currentProduct.product_type_id)
                this.changeProductType()
            }
          }

          // products
          if(params.products) {
            this.productOptionStore = options.products
            this.resetListProduct()

            if(this.currentProduct.product_id) {
                this.getProductSelectedById(this.currentProduct.product_id)
                this.changeProduct()
            }
          }

          // suppliers
          if(params.suppliers) {
            this.supplierOptionStore = options.suppliers
            this.supplierOptionStore.unshift({"id": null, "name": '-- Chọn nhà cung cấp --'})
            this.getSupplierItemById(this.trade.customer_id)
          }

          // customers
          if(params.customers) {
            this.customerOptionStore = options.customers
            this.customerOptionStore.unshift({"id": null, "name": '-- Chọn khách hàng --'})
            this.getCustomerItemById(this.trade.customer_id)
          }

          // citys
          if(params.citys) {
            this.optionsCity = options.citys
          }

          // units
          if(params.units) {
            this.unitOptions = options.units
          }

          // product_brands
          if (params.product_brands) {
            this.getProductBrandOption(options.product_brands)
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

      getListProductTypeOptionByProductGroupId(product_group_id) {
        this.productTypeOptions = []
        for (let i in this.productTypeOptionStore) {
          if(product_group_id == this.productTypeOptionStore[i].product_group_id) {
            this.productTypeOptions.push(this.productTypeOptionStore[i])
          }
        }
        if(this.productTypeOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          this.productTypeOptions.unshift(itemEmpty)
        }
      },

    /**
     *  Event change product group
     */
    changeProductGroup(notReset) {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        this.currentProduct.product_group_id = this.productGroupSelect.id
        this.currentProduct.product_group_name = this.productGroupSelect.name

        // Reload list type by group
        this.getListProductTypeOptionByProductGroupId(this.productGroupSelect.id)

        // Reload list product by group
        this.getListOptionProductByProductGroupId(this.productGroupSelect.id)
      } else {
        this.currentProduct.product_group_id = null
        this.currentProduct.product_group_name = null

        this.resetListProductType()
        this.resetListProduct()
      }

      // Reset other info
      if(notReset != true) {
        this.productTypeSelect = {}
        this.currentProduct.product_type_id = null
        this.currentProduct.product_type_name = null

        this.productSelect = {}
        this.currentProduct.product_id = null
        this.currentProduct.product_code = null
        this.currentProduct.product_name = null
      }

      this.resetProductInfo()
    },

      /**
     *  Event change product group
     */
    changeProductGroupWhenAddType() {
      if(this.productGroupSelectAdd && this.productGroupSelectAdd.id) {
          this.productType.product_group_id = this.productGroupSelectAdd.id
      } else {
          this.productType.product_group_id = null
      }
    },

      /**
     *  Event change product group
     */
    changeProductGroupWhenAddProduct() {
      if(this.productGroupSelectAdd && this.productGroupSelectAdd.id) {
          this.product.product_group_id = this.productGroupSelectAdd.id
          this.product.product_group_name = this.productGroupSelectAdd.name

          this.getListProductTypeOptionByProductGroupId(this.product.product_group_id)
      } else {
          this.product.product_group_id = null
          this.product.product_group_name = null
      }
    },

      changeProductTypeWhenAddProduct() {
        if(this.productTypeSelectAdd && this.productTypeSelectAdd.id) {
            this.product.product_type_id = this.productTypeSelectAdd.id
            this.product.product_type_name = this.productTypeSelectAdd.name

            this.getListOptionProductByProductTypeId(this.product.product_type_id)
        } else {
            this.product.product_type_id = null
            this.product.product_type_name = null
        }
      },

    resetProductInfo() {
      this.currentProduct.price_buy = null
      this.currentProduct.quantity = null
      this.currentProduct.amount_buy = null
      this.currentProduct.price_sell = null
      this.currentProduct.amount_sell = null
      this.currentProduct.properties = []
    },

      /**
     *  Event change product group
     */
    changeProductGroupWhenAdd() {
      // TODO
      this.productTypeOptions = [{value: null, text: ''}]

      for (let i in this.productTypeOptionStore) {
        if(this.product.product_group_id == this.productTypeOptionStore[i].product_group_id) {
          let item = {value: this.productTypeOptionStore[i].value, text: this.productTypeOptionStore[i].text}
          this.productTypeOptions.push(item)
        }
      }
    },

    getListOptionProductByProductTypeId(product_type_id) {
        this.productOptions = []
        for (let i in this.productOptionStore) {
          if(product_type_id == this.productOptionStore[i].product_type_id) {
            this.productOptions.push(this.productOptionStore[i])
          }
        }
        if(this.productOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          itemEmpty.name_full = ""
          this.productOptions.unshift(itemEmpty)
        }
      },

    getListOptionProductByProductGroupId(product_group_id) {
      this.productOptions = []
      for (let i in this.productOptionStore) {
        if(product_group_id == this.productOptionStore[i].product_group_id) {
          this.productOptions.push(this.productOptionStore[i])
        }
      }
      if(this.productOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        itemEmpty.name_full = ""
        this.productOptions.unshift(itemEmpty)
      }
    },

      getProductPropertiesByProductType() {
      if(this.productTypeSelect && this.productTypeSelect.id) {
        // Update properties
        this.currentProperties = []
        for (let i in this.productTypeOptionStore) {
          if(this.currentProduct.product_type_id == this.productTypeOptionStore[i].id
            && this.productTypeOptionStore[i].properties) {
            this.currentProperties = this.productTypeOptionStore[i].properties
            // this.currentPropertiesRoot = this.productTypeOptionStore[i].properties_root
            break
          }
        }
        this.propertiesChoosen = []
        for (let i in this.currentProperties) {
          this.propertiesChoosen.push(this.currentProperties[i].name)
        }
      }

    },

    /**
     *  Event change product type
     */
    changeProductType(notReset) {
      if(this.productTypeSelect && this.productTypeSelect.id) {
        this.currentProduct.product_type_id = this.productTypeSelect.id
        this.currentProduct.product_type_name = this.productTypeSelect.name

        // Reload list product by type
        this.getListOptionProductByProductTypeId(this.currentProduct.product_type_id)

        // Update properties
        this.currentProperties = []
        for (let i in this.productTypeOptionStore) {
          if(this.currentProduct.product_type_id == this.productTypeOptionStore[i].id
            && this.productTypeOptionStore[i].properties) {
            this.currentProperties = this.productTypeOptionStore[i].properties
            // this.currentPropertiesRoot = this.productTypeOptionStore[i].properties_root
            break
          }
        }
        this.propertiesChoosen = []
        for (let i in this.currentProperties) {
          this.propertiesChoosen.push(this.currentProperties[i].name)
        }

        // Chọn nhóm sp
        this.getProductGroupSelectedById(this.productTypeSelect.product_group_id)
      } else {
        this.currentProduct.product_type_id = null
        this.currentProduct.product_type_name = null
        this.currentProperties = []
        this.propertiesChoosen = []

        this.resetListProduct()
      }

      // Reset other info
      if(notReset != true) {
        this.productSelect = {}
        this.currentProduct.product_id = null
        this.currentProduct.product_code = null
        this.currentProduct.product_name = null
      }

      this.resetProductInfo()
    },

    /**
     *  Event change product
     */
    changeProduct() {
      // Reset other info
      this.resetProductInfo()

      if(this.productSelect && this.productSelect.id) {
        this.currentProduct.product_id = this.productSelect.id
        this.currentProduct.product_name = this.productSelect.name
        this.currentProduct.product_code = this.productSelect.code
        this.currentProduct.price_buy = this.currencyFormat(this.productSelect.price_buy)
        this.currentProduct.price_sell = this.currencyFormat(this.productSelect.price_sell)
        this.currentProduct.properties = this.productSelect.properties
        this.currentProduct.product_group_id = this.productSelect.product_group_id
        this.currentProduct.product_type_id = this.productSelect.product_type_id

          // // Check xem sản phẩm có thuộc tính không
          // this.currentProduct.product_type_id = this.productSelect.product_type_id
          // this.getProductTypeSelectedById(this.productSelect.product_type_id)
          // this.getProductPropertiesByProductType()

        let unit_name = this.productSelect.unit_name
        if(unit_name) {
          this.unit_name = "(Đơn vị: " + unit_name + ")"
        } else {
          this.unit_name = ""
        }

        // Giành riêng cho đại lý cafe
        this.isShowCalCafe = false
        if(this.currentProduct.product_code && this.currentProduct.product_code.includes("ca_phe")) {
          this.isShowCalCafe = true
        }

        // Chọn nhóm sp
        this.getProductGroupSelectedById(this.currentProduct.product_group_id)
        this.currentProduct.product_group_name = this.productGroupSelect.name

        // Chọn loại sp
        this.getProductTypeSelectedById(this.currentProduct.product_type_id)
        this.currentProduct.product_type_name = this.productTypeSelect.name
        this.getProductPropertiesByProductType()
      } else {
        this.currentProduct.product_id = null
        this.currentProduct.product_name = null
        this.currentProduct.product_code = null
        this.currentProduct.price_buy = null
        this.currentProduct.price_sell = null
        this.currentProduct.properties = []
        this.currentProduct.product_group_id = null
        this.currentProduct.product_group_name = null
        this.currentProduct.product_type_id = null
        this.currentProduct.product_type_name = null
        this.unit_name = ""
        this.isShowCalCafe = false
      }
    },

    /**
     * Get detail
     */
    getStoreDetail() {
      let storeId = this.$store.state.user.storeId
      if(storeId){
        superAdminAPI.getStoreDetail(storeId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            let store = res.data.data
              this.store_name = store.name
              this.store_phone_number = store.phone_number
              this.store_tax_code = store.tax_code

              var address = ""
              if(store.address) {
                  address += store.address
              }
              if(store.district_name) {
                  address += store.district_name
              }
              if(store.city_name) {
                  address += ", " + store.city_name
              }
              this.store_address = address
          }
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        this.$store.commit('removeToken')
        this.$router.push('/staff-login')
      }
    },

    /**
     *  Event change from type
     */
    changeFromType() {
      if(this.trade.from_type == 0) {
        this.trade.supplier_id = null
        this.trade.supplier_name = null
        this.trade.supplier_phone = null
        this.trade.supplier_address = null
        this.trade.supplier_tax_code = null
      } else {
        this.trade.customer_id = null
        this.trade.customer_name = null
        this.trade.customer_phone = null
        this.trade.customer_address = null
        this.trade.customer_tax_code = null
      }
    },

    /**
     *  Event change supplier
     */
    changeSupplier() {

      if(this.supplierSelect && this.supplierSelect.id) {
        this.trade.customer_id = this.supplierSelect.id
        this.trade.supplier_name = this.supplierSelect.name
        this.trade.supplier_phone = this.supplierSelect.phone_number
        this.trade.supplier_address = this.supplierSelect.address
        this.trade.supplier_tax_code = this.supplierSelect.tax_code
      } else{
        this.trade.customer_id = null
        this.trade.supplier_name = null
        this.trade.supplier_phone = null
        this.trade.supplier_address = null
        this.trade.supplier_tax_code = null
      }
    },

    /**
     *  Event change customer
     */
    changeCustomer() {
      if(this.customerSelect && this.customerSelect.id) {
        this.trade.customer_id = this.customerSelect.id
        this.trade.customer_name = this.customerSelect.name
        this.trade.customer_phone = this.customerSelect.phone_number
        this.trade.customer_address = this.customerSelect.address
        this.trade.customer_tax_code = this.customerSelect.tax_code
      } else{
        this.trade.customer_id = null
        this.trade.customer_name = null
        this.trade.customer_phone = null
        this.trade.customer_address = null
        this.trade.customer_tax_code = null
      }
    },

    /**
     * Refresh current product
     */
    refreshCurrentProduct() {
      this.currentProduct = {
        "product_group_id": null,
          "product_group_name": null,
          "product_type_id": null,
          "product_type_name": null,
          "product_id": null,
          "product_name": null,
          "price_buy": null,
          "quantity": null,
          "amount_buy": null,
          "price_sell": null,
          "amount_sell": null,
          "properties": []
      }
    },

    /**
     * Event change total paid
     */
    changeTotalPaid() {
      let total_paid = this.trade.total_paid.replaceAll(",", "")
      let total = this.trade.total.replaceAll(",", "")
      if(parseInt(total_paid) < total) {
        this.isShowApoimentPayment = true
        this.trade.amount_remaining = this.currencyFormat(parseInt(total) - parseInt(total_paid))
      } else {
        this.isShowApoimentPayment = false
        this.trade.amount_remaining = 0
      }
      this.trade.total_paid = this.currencyFormat(total_paid)

      this.trade.cash = this.trade.total_paid
      this.trade.credit = 0
      this.trade.e_money = 0
    },

      changeCash() {
          let cash = (this.trade.cash + '').replaceAll(",", "")
          this.trade.cash = this.currencyFormat(cash)
      },

      changeCredit() {
          let credit = (this.trade.credit + '').replaceAll(",", "")
          this.trade.credit = this.currencyFormat(credit)
      },

      changeEMoney() {
          let e_money = (this.trade.e_money + '').replaceAll(",", "")
          this.trade.e_money = this.currencyFormat(e_money)
      },

    /**
     * Tính toán thành tiền sản phẩm
     */
    calculateAmount() {
      var amount = 0
      for (let i in this.trade.products) {
        amount += parseInt((this.trade.products[i].price_buy + '').replaceAll(",", "") * (this.trade.products[i].quantity + '').replaceAll(",", ""))
      }
      this.trade.sub_total = this.currencyFormat(amount)

      let extra_fee = 0
      if(this.trade.extra_fee) {
          extra_fee = (this.trade.extra_fee + '').replaceAll(",", "")
          this.trade.extra_fee = this.currencyFormat(extra_fee)
      }
      let fixed_discount = 0
      if(this.trade.fixed_discount) {
          fixed_discount = (this.trade.fixed_discount + '').replaceAll(",", "")
          this.trade.fixed_discount = this.currencyFormat(fixed_discount)
      }

      // Calculate vat value
      let vat_value = 0
      if(this.trade.have_vat) {
        if(this.trade.vat_percent) {
          vat_value = parseInt((amount + parseInt(extra_fee) - parseInt(fixed_discount)) * this.trade.vat_percent / 100)
          this.trade.vat_value = this.currencyFormat(vat_value)
        } else {
          this.trade.vat_value = 0
        }
      } else {
        this.trade.vat_value = 0
      }

      this.trade.total = this.currencyFormat(amount + parseInt(extra_fee) - parseInt(fixed_discount) + vat_value)

      this.trade.total_paid = this.trade.total
      this.trade.amount_remaining = 0
      this.isShowApoimentPayment = false

      this.trade.cash = this.trade.total_paid
      this.trade.credit = 0
      this.trade.e_money = 0
    },

    showModalCafeCalBy() {
      this.$bvModal.show('modal-cal-impurities-moisture')
    },

    hideModalCafeCalBy() {
      this.$bvModal.hide('modal-cal-impurities-moisture')
    },

    /**
     *  Xác nhận sản phẩm
     */
    confirmBuyProduct() {
      // Check product group
      if (!this.currentProduct.product_group_id) {
        this.popToast('danger', "Vui lòng chọn nhóm sản phẩm")
        return
      }

      // Check product type
      if (!this.currentProduct.product_type_id) {
        this.popToast('danger', "Vui lòng chọn loại sản phẩm")
        return
      }

      // Check product
      if (!this.currentProduct.product_id) {
        this.popToast('danger', "Vui lòng chọn sản phẩm")
        return
      }

      // Check price buy
      if (this.currentProduct.price_buy == null || this.currentProduct.price_buy == '') {
        this.popToast('danger', "Vui lòng nhập giá mua sản phẩm")
        return
      }

      // Check quantity
      if (this.currentProduct.quantity == null || this.currentProduct.quantity == '') {
        this.popToast('danger', "Vui lòng nhập số lượng sản phẩm mua")
        return
      }
      this.currentProduct.price_buy = this.currentProduct.price_buy.replaceAll(",", "")
      this.currentProduct.quantity = this.currentProduct.quantity.replaceAll(",", "")
      this.currentProduct.amount_buy = parseInt(this.currentProduct.price_buy * this.currentProduct.quantity)

      if(!this.currentProduct.price_sell) {
          this.currentProduct.price_sell = this.currentProduct.price_buy
      }
      this.currentProduct.price_sell = this.currentProduct.price_sell.replaceAll(",", "")
      this.currentProduct.amount_sell = parseInt(this.currentProduct.price_sell * this.currentProduct.quantity)
      this.currentProduct.index = this.trade.products.length + 1

      // TODO: handle thuộc tính sp
      let properties = []
        if(this.propertiesChoosen.length > 0) {
            for(let j in this.propertiesChoosen) {
                var ele = document.getElementsByName(this.propertiesChoosen[j]);

                for(let i = 0; i < ele.length; i++) {
                    if(ele[i].checked) {
                        let item = {"name": this.propertiesChoosen[j], "value": ele[i].value}
                        properties.push(item)
                    }
                }
            }
        }
      this.currentProduct.properties = properties
      this.trade.products.push(this.currentProduct)

      // Tính toán amount
      this.calculateAmount()

      // Refresh current product
      this.refreshCurrentProduct()

      // Lưu nháp
      if(this.trade.id) {
        this.updateDraft()
      } else {
        this.saveDraft()
      }

    },

    /**
     *  Save
     */
    saveDraft () {
      // Reformat data
      let data = JSON.parse(JSON.stringify(this.trade))
      data.sub_total = (data.sub_total + '').replaceAll(",", "")

        let extra_fee = 0
        if(data.extra_fee) {
            extra_fee = (data.extra_fee + '').replaceAll(",", "")
        }
      data.extra_fee = extra_fee

        let fixed_discount = 0
        if(data.fixed_discount) {
            fixed_discount = (data.fixed_discount + '').replaceAll(",", "")
        }
      data.fixed_discount = fixed_discount

      let vat_value = 0
      if(data.vat_value) {
        vat_value = (data.vat_value + '').replaceAll(",", "")
      }
      data.vat_value = vat_value

      data.total = (data.total + '').replaceAll(",", "")
      data.total_paid = (data.total_paid + '').replaceAll(",", "")
      data.cash = (data.cash + '').replaceAll(",", "")
      data.credit = (data.credit + '').replaceAll(",", "")
      data.e_money = (data.e_money + '').replaceAll(",", "")

      // Check products
      if(data.products.length == 0) {
        return
      }

      // Check loại tiền
      if(parseInt(data.total_paid) != parseInt(data.cash) + parseInt(data.credit) + parseInt(data.e_money)) {
        return
      }

      tradeApi.saveDraftBuy(data).then(res => {
        if(res != null && res.data != null){

          if (res.data.status == 200) {
            this.trade.id = res.data.data.trade_his_id
            this.trade.bill_number = res.data.data.bill_number

            this.popToast('success', "Lưu nháp thành công!")
          }
        }
      }).catch(err => {})
    },

    /**
     *  Update draft
     */
    updateDraft () {
      if(this.trade.id == null) {
        return
      }

      // Reformat data
      let data = JSON.parse(JSON.stringify(this.trade))
      data.sub_total = (data.sub_total + '').replaceAll(",", "")
      let extra_fee = 0
        if(data.extra_fee) {
            extra_fee = (data.extra_fee + '').replaceAll(",", "")
        }
      data.extra_fee = extra_fee

        let fixed_discount = 0
        if(data.fixed_discount) {
            fixed_discount = (data.fixed_discount + '').replaceAll(",", "")
        }
      data.fixed_discount = fixed_discount
      data.vat_value = (data.vat_value + '').replaceAll(",", "")
      data.total = (data.total + '').replaceAll(",", "")
      data.total_paid = (data.total_paid + '').replaceAll(",", "")
      data.cash = (data.cash + '').replaceAll(",", "")
      data.credit = (data.credit + '').replaceAll(",", "")
      data.e_money = (data.e_money + '').replaceAll(",", "")

      // Check products
      if(data.products.length == 0) {
        return
      }

      // Check loại tiền
      if(parseInt(data.total_paid) != parseInt(data.cash) + parseInt(data.credit) + parseInt(data.e_money)) {
        return
      }

      tradeApi.updateDraftBuy(data).then(res => {
        if(res != null && res.data != null){
            this.popToast('success', "Lưu nháp thành công!")
        }
      }).catch(err => {})
    },

    checkUpdateDraft() {
      if(this.saveSuccess == false) {
        this.updateDraft()
      }
    },

    /**
     *  Save
     */
    save () {
      // Reformat data
      let data = JSON.parse(JSON.stringify(this.trade))
      data.sub_total = (data.sub_total + '').replaceAll(",", "")
      let extra_fee = 0
      if(data.extra_fee) {
          extra_fee = (data.extra_fee + '').replaceAll(",", "")
      }
      data.extra_fee = extra_fee

      let fixed_discount = 0
      if(data.fixed_discount) {
          fixed_discount = (data.fixed_discount + '').replaceAll(",", "")
      }
      data.fixed_discount = fixed_discount

      let vat_value = 0
      if(data.vat_value) {
        vat_value = (data.vat_value + '').replaceAll(",", "")
      }
      data.vat_value = vat_value
        data.total = (data.total + '').replaceAll(",", "")
        data.total_paid = (data.total_paid + '').replaceAll(",", "")
        data.cash = (data.cash + '').replaceAll(",", "")
        data.credit = (data.credit + '').replaceAll(",", "")
        data.e_money = (data.e_money + '').replaceAll(",", "")

        // Check products
        if(data.products.length == 0) {
            this.popToast('danger', "Chưa có sản phẩm nào được chọn")
          return
        }

      // Check loại tiền
      if(parseInt(data.total_paid) != parseInt(data.cash) + parseInt(data.credit) + parseInt(data.e_money)) {
        this.popToast('danger', "Tổng loại tiền phải bằng số tiền thanh toán")
        return
      }


        this.saving = true

        tradeApi.tradeBuy(data).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.popToast('success', 'Mua sản phẩm thành công!!! ')

              this.saveSuccess = true

              this.trade = res.data.data

              this.suffix_print_title = ""
              this.$bvModal.show('modal-actions')

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
     * In hoá đơn tạm tính
     */
    printProvisionalInvoice() {
      if(this.trade.products.length == 0) {
        this.popToast('danger', "Vui lòng chọn sản phẩm muốn mua")
        return
      }

      var mywindow = window.open('', 'PRINT', 'height=600,width=800');

      mywindow.document.write('<html><head><title> </title><style>');
      mywindow.document.write(' .print-text-center {text-align: center;} ');
      mywindow.document.write(' .print-text-left {text-align: left;} ');
      mywindow.document.write(' .print-text-right {text-align: right;} ');
      mywindow.document.write(' .print-width-50-left {width: 48%; float: left;} ');
      mywindow.document.write(' .print-width-50-right {width: 48%; float: right;} ');
      mywindow.document.write(' .print-border {border: black solid 1px;} ');
      mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ');
      mywindow.document.write(' #print-table-border > table, th, td {border: black solid 1px; border-collapse: collapse;} ');
      mywindow.document.write(' .print-border {border: black solid 1px; border-collapse: collapse;} ');
      mywindow.document.write(' .print-no-border {border: none;} ');

      mywindow.document.write('</style></head><body >');
      mywindow.document.write(document.getElementById('provisionalInvoice').innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/trade-buy-his")
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
     * Only input integer
     */
    integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },

      changePriceBuy() {
        let price_buy = this.currentProduct.price_buy.replaceAll(",", "")
          this.currentProduct.price_buy = this.currencyFormat(price_buy)
      },

      changePriceSell() {
        let price_sell = this.currentProduct.price_sell.replaceAll(",", "")
          this.currentProduct.price_sell = this.currencyFormat(price_sell)
      },

      changeQuantity() {
        let quantity = this.currentProduct.quantity.replaceAll(",", "")
          this.currentProduct.quantity = this.currencyFormat(quantity)
      },

      deleteProduct(ind) {
        // Remove item
        this.trade.products.splice(parseInt(ind) - 1, 1)

          // Check remove all product
          if(this.trade.products.length == 0) {
            this.deleteTrade(this.trade.id)

              // Refresh data
            this.refreshTradeInfo()
          }

          // Reset index
        let index = 1
          let products = JSON.parse(JSON.stringify(this.trade.products))
          this.trade.products = []
        for (var i in products) {
          products[i].index = index
            this.trade.products.push(products[i])
          index += 1
        }

        // Calculate
          this.calculateAmount()

          // Update
          this.checkUpdateDraft()
      },

      deleteTrade(trade_id) {
        tradeApi.deleteTrade(trade_id).then(res => {
        }).catch(err => {
        })
      },

    refreshTradeInfo() {
      this.trade = {
        "id": null,
        "bill_number": null,
        "from_type": 1,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_address": null,
        "customer_tax_code": null,
        "supplier_id": null,
        "supplier_name": null,
        "supplier_phone": null,
        "supplier_address": null,
        "supplier_tax_code": null,
        "sub_total": 0,
        "extra_fee": null,
        "fixed_discount": null,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "total_paid": null,
        "amount_remaining": 0,
        "cash": null,
        "credit": null,
        "e_money": null,
        "description": null,
        "products": [],
        "promotions": [],
        "interest_rate": 0,
        "interest_period": "month",
        "appointment_date": null,
        "forewarning": 30,
      }
    },

      buyNext() {
        this.supplierSelect = {}
        this.customerSelect = {}
        this.refreshCurrentProduct()
        this.refreshTradeInfo()
        this.$bvModal.hide('modal-actions')
      },

      printInvoice() {
        this.suffix_print_title = ""
        this.printProvisionalInvoice()
      },

    /**
     * Only input integer and point
     */
    integerAndCommaOnly(item) {
      let valueInput = item.value
        valueInput = valueInput.replaceAll(",", "")
      let result = commonFunc.integerAndCommaOnly(valueInput)

        result = this.currencyFormat(result)
      item.value = result
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

      convertNumberToText(number) {
        let input = (number + '').replaceAll("," ,"")
        return commonFunc.convert_number_to_text(input)
      },

    /**
     * Get độ tạp, độ ẩm tiêu chuẩn từ setting
     */
    getSettingByGroup() {
      let params = {"group": "cafe_impurities_and_moisture"}
      settingAPI.getSettingByGroup(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let datas = res.data.data

          let is_edit_impurities_default = false
          let is_edit_moisture_default = false
          let is_edit_bag_weight_default = false
          for (let i in datas) {
            if(datas[i].code == "impurities_default") {
              this.cafe_impurities_and_moisture.impurities_default = datas[i].value
              this.edit_impurities_default = false
              is_edit_impurities_default = true
            }
            if(datas[i].code == "moisture_default") {
              this.cafe_impurities_and_moisture.moisture_default = datas[i].value
              this.edit_moisture_default = false
              is_edit_moisture_default = true
            }
            if(datas[i].code == "bad_weight_default") {
              this.cafe_impurities_and_moisture.bad_weight_default = datas[i].value
              this.edit_bad_weight_default = false
              is_edit_bag_weight_default = true
            }
          }

          if(is_edit_impurities_default == false) {
            this.edit_impurities_default = true
          }
          if(is_edit_moisture_default == false) {
            this.edit_moisture_default = true
          }
          if(is_edit_bag_weight_default == false) {
            this.edit_bad_weight_default = true
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Tính toán số lượng dựa trên độ ẩm và tạp
     */
    calQuantityByImpuritiesAndMoisture() {
      // Validate ở đây
      if(!this.cafe_impurities_and_moisture.impurities_default) {
        this.popToast('danger', "Hãy nhập giá trị độ tạp tiêu chuẩn")
        return
      }
      if(!this.cafe_impurities_and_moisture.moisture_default) {
        this.popToast('danger', "Hãy nhập giá trị độ ẩm tiêu chuẩn")
        return
      }

      if(!this.cafe_impurities_and_moisture.impurities_default || !this.cafe_impurities_and_moisture.moisture_input || !this.cafe_impurities_and_moisture.quantity) {
        this.popToast('danger', "Hãy nhập đủ các giá trị bắt buộc")
        return
      }

      this.result_cal_cafe_impurities_and_moisture = commonFunc.calQuantityCafe(
        this.cafe_impurities_and_moisture.impurities_input,
        this.cafe_impurities_and_moisture.impurities_default,
        this.cafe_impurities_and_moisture.bad_weight_default,
        this.cafe_impurities_and_moisture.moisture_input,
        this.cafe_impurities_and_moisture.moisture_default,
        this.cafe_impurities_and_moisture.number_bag_input,
        this.cafe_impurities_and_moisture.quantity)

      this.currentProduct.quantity = this.currencyFormat(this.result_cal_cafe_impurities_and_moisture.current_quantity)
    },

    /**
     * Update store setting
     */
    updateStoreSetting(code) {
      let params = {
        "code": code,
        "value": "",
        "group": "cafe_impurities_and_moisture"
      }
      if(code == "moisture_default") {
        params.value = this.cafe_impurities_and_moisture.moisture_default
      }
      if(code == "impurities_default") {
        params.value = this.cafe_impurities_and_moisture.impurities_default
      }
      if(code == "bad_weight_default") {
        params.value = this.cafe_impurities_and_moisture.bad_weight_default
      }
      settingAPI.updateStoreSetting(params).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', "Lưu giá trị thành công!")

          if(code == "moisture_default") {
            this.edit_moisture_default = false
          }
          if(code == "impurities_default") {
            this.edit_impurities_default = false
          }
          if(code == "bad_weight_default") {
            this.edit_bad_weight_default = false
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      /**
     * Only input float
     */
    integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },

    changeProductGroupSearch() {
      if(this.productGroupSearchSelect && this.productGroupSearchSelect.id) {
        this.productSearch.product_group_id = this.productGroupSearchSelect.id

        // Reload list type by group
        this.productTypeSearchOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.productSearch.product_group_id == this.productTypeOptionStore[i].product_group_id) {
            this.productTypeSearchOptions.push(this.productTypeOptionStore[i])
          }
        }
        if(this.productTypeSearchOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
          itemEmpty.value = null
          itemEmpty.text = ""
          this.productTypeSearchOptions.unshift(itemEmpty)
        }

        this.productTypeSearchSelect = {"id": null, "name": null}
      } else {
        this.productSearch.product_group_id = null

        this.resetListProductType()
      }
    },

    changeProductTypeSearch() {
      if(this.productTypeSearchSelect && this.productTypeSearchSelect.id) {
        this.productSearch.product_type_id = this.productTypeSearchSelect.id
      } else {
        this.productSearch.product_type_id = null
      }
    },

  }
}
</script>

<style lang="scss" scoped>
  @media print {
    .print-center {
      text-align: center;
    }
  }

  .title-partner {
    border-radius: 5px 5px;
    padding: 5px;

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
