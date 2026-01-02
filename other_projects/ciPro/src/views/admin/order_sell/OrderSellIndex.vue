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
                <h4 class="mt-1 text-center text-header">{{prefix_title}} Đơn Hàng Bán</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <b-row class="form-row mt-2">
              <b-col md="2" class="mt-2">
                <label>
                  <span>Từ báo giá</span>
                </label>
              </b-col>
              <b-col md="10">
                <div class="input-group">
                  <multiselect
                    v-model="quotationSelect"
                    :options="quotationOptions"
                    :loading="loadingQuotation"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn từ báo giá--"
                    label="name"
                    track-by="name"
                    @input="changeQuotation">
                  </multiselect>

                  <b-button variant="outline-primary" class="pull-right ml-2" @click="showModalSearchQuotation" >
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row mt-2">
              <b-col md="2" class="mt-2">
                <label>
                  Xuất hóa đơn<span class="error-sybol"></span>
                </label>
              </b-col>
              <b-col md="10">
                <div class="input-group">
                  <input type="radio" v-model="trade.issue_invoice" name="issue_invoice" :value="'true'" class="mt-2" id="issue_invoice_true">
                  <label class="ml-4 mt-1" for="issue_invoice_true">Có</label>
                  <input type="radio" v-model="trade.issue_invoice" name="issue_invoice" :value="'false'" class="ml-5 mt-2" id="issue_invoice_false">
                  <label class="ml-4 mt-1" for="issue_invoice_false">Không</label>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12" class="bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin người mua</span>
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
                      <span>Khách hàng</span>
                    </label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                    <div class="input-group">
                      <multiselect
                        v-model="customerSelect"
                        :options="customerOptionStore"
                        :loading="loadingCustomerOptions"
                        :select-label="''"
                        :deselect-label="''"
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

                      <b-button v-show="customerSelect.id" variant="outline-success" class="pull-right ml-2"
                                @click="updateCustomerInfo" >
                        <i class="fa fa-save"></i>
                      </b-button>
                    </div>
                  </b-col>
                </b-row>

                <!-- Loading -->
                <span class="loading-more" v-show="loadCusDetail"><icon name="loading" width="60" /></span>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Tên khách hàng<span class="error-sybol"></span>
                        </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="customer_name"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.customer_name"
                          :disabled="saving">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="3" class="mt-2">
                        <label>Mã số thuế<span class="error-sybol" v-show="trade.issue_invoice == 'true'"></span></label>
                      </b-col>
                      <b-col md="9" class="mt-2">
                        <input
                        id="customer_tax_code"
                        type="text"
                        class="form-control"
                        v-model="trade.customer_tax_code"
                        @keyup="integerOnly($event.target)"
                        autocomplete="new-password"
                        maxlength="20">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>
                          <span>Địa chỉ khách hàng<span class="error-sybol" v-show="trade.issue_invoice == 'true'"></span></span>
                        </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="address"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.customer_address"
                          :disabled="saving">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="3" class="mt-2">
                        <label>Email nhận hoá đơn<span class="error-sybol" v-show="trade.issue_invoice == 'true'"></span></label>
                      </b-col>
                      <b-col md="9" class="mt-2">
                        <input
                        id="customer_email"
                        type="text"
                        class="form-control"
                        v-model="trade.customer_email"
                        autocomplete="new-password"
                        maxlength="255">
                      </b-col>
                    </b-row>
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
                        placeholder="-- Chọn sản phẩm --"
                        label="name_full"
                        track-by="name_full"
                        @input="changeProduct">
                      </multiselect>
                      <b-button variant="outline-primary" class="pull-right ml-2" @click="showModalSearchProduct" >
                        <i class="fa fa-search"></i>
                      </b-button>
                    </div>

                    <!-- Loading -->
                    <span class="loading-more" v-show="loadProductDetail"><icon name="loading" width="60" /></span>

                    <b-row>
                      <b-col md="3" class="mt-2">
                        <input
                          id="product_code_input"
                          type="text"
                          maxlength="255"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.product_code_input"
                          placeholder="Mã SP chưa có trong hệ thống">
                      </b-col>
                      <b-col md="3" class="mt-2">
                        <input
                          id="product_name_input"
                          type="text"
                          maxlength="255"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.product_name_input"
                          placeholder="Tên SP chưa có trong hệ thống">
                      </b-col>
                      <b-col md="3" class="mt-2">
                        <b-form-select
                          :options="productBrandOptions"
                          id="product_brand"
                          type="text"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.brand_id_input"
                          placeholder="Hãng SP"
                          @change="changeBrandInput"></b-form-select>
                      </b-col>
                      <b-col md="3" class="mt-2">
                        <b-form-select
                          :options="unitOptions"
                          id="unit"
                          type="text"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.unit_id_input"
                          placeholder="Đơn vị"
                          @change="changeUnitInput"></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="form-row" v-show="currentProperties.length > 0">
                  <b-col md="2" class="mt-2">
                    <label>Thuộc tính</label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                    <p v-for="(item) in currentProperties" :key="item.name">
                      <label :for="item.name">{{ item.name }}:
                        <span v-for="(value, index) in item.value" :key="value">
                          <input type="radio" :id="item.name + value" :value="value" :name="item.name" class="ml-2"
                                 :checked="index == 0" v-on:change="calQuantityRepo">
                          <label :for="value" class="ml-1">{{value}}</label>
                        </span>
                      </label>
                    </p>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Giá list</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="price_list"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.price_list"
                          @change="calculateCurrentProduct('price_list')">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Chiết khấu từ NCC (%)</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="discount"
                          type="text"
                          maxlength="5"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.discount"
                          @change="calculateCurrentProduct('discount')">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Giá gốc<span class="error-sybol"></span></label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="price"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.price"
                          @change="calculateCurrentProduct('price')">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>% Lợi nhuận mong muốn</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="discount_sale"
                          type="text"
                          maxlength="5"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.discount_sale"
                          @change="calculateCurrentProduct('discount_sale')">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Lợi nhuận/sản phẩm</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="profit_on_item"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.profit_on_item"
                          @change="calculateCurrentProduct('profit_on_item')">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Giá bán<span class="error-sybol"></span></label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="price_sell"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.price_sell"
                          @change="calculateCurrentProduct('price_sell')">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>SL trong kho {{root_unit.name ? '(ĐV: ' + root_unit.name + ')' : currentProduct.unit_name_input ? '(Đơn vị: ' + currentProduct.unit_name_input + ')' : ''}}</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="quantity_repo"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.quantity_repo"
                          readonly
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>SL bán {{handleUnitName()}}<span class="error-sybol"></span></label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="quantity"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.quantity"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="calculateCurrentProduct('quantity')">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Thành tiền</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="amount_sell"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.amount_sell"
                          readonly>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Lợi nhuận tổng</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="profit"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.profit"
                          readonly>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="2" class="mt-2">
                    <label> Ghi chú </label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                    <b-form-textarea
                      id="note"
                      style="width:100%;"
                      rows="1"
                      v-model="currentProduct.note"
                    ></b-form-textarea>
                  </b-col>
                </b-row>

                <b-row class="mt-2">
                  <b-col md="12" class="text-center">
                    <b-button variant="outline-primary" class="text-center btn-width-120" @click="confirmBuyProduct">
                      Xác nhận
                    </b-button>
                  </b-col>
                </b-row>

                <b-row v-show="trade.products.length > 0" class="mt-2">
                  <b-col md="9">
                    <h5>Danh sách sản phẩm</h5>
                  </b-col>
                  <b-col md="3" class="text-right">
                    <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "products_excel"
                    :fields = "excel_fields"
                    worksheet = "DS SP trong đơn hàng"
                    name    = "danh_sach_san_pham_trong_don_hang.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                  </b-col>
                </b-row>

                <!-- Báo giá thường thì dùng danh sách này-->
                <b-row class="mt-2" v-show="trade.type == 0 && trade.products.length > 0" >
                  <b-col md="12">
                    <div style="width: 100%; overflow-x: scroll" class="sub-table-cus">
                  <table class="table table-bordered table-striped fixed_header">
                    <colgroup>
                        <col style="width:60px">
                        <col style="width:130px">
                        <col style="width:220px">
                        <col style="width:130px">
                        <col style="width:130px">
                        <col style="width:80px">
                        <col style="width:130px">
                        <col style="width:80px">
                        <col style="width:130px">
                        <col style="width:130px">
                        <col style="width:100px">
                        <col style="width:130px">
                        <col style="width:130px">
                        <col style="width:130px">
                        <col style="width:50px">
                      </colgroup>
                     <thead>
                      <tr>
                        <th class="text-center font-weight-bold">STT</th>
                        <th class="text-center font-weight-bold">Mã SP</th>
                        <th class="text-center font-weight-bold">Tên SP</th>
                        <th class="text-center font-weight-bold">Hãng SP</th>
                        <th class="text-center font-weight-bold">Giá List</th>
                        <th class="text-center font-weight-bold">CK từ NCC</th>
                        <th class="text-center font-weight-bold">Giá gốc</th>
                        <th class="text-center font-weight-bold">% lợi nhuận mong muốn</th>
                        <th class="text-center font-weight-bold">Lợi nhuận/sản phẩm</th>
                        <th class="text-center font-weight-bold">Giá bán</th>
                        <th class="text-center font-weight-bold">Số lượng</th>
                        <th class="text-center font-weight-bold">Thành tiền</th>
                        <th class="text-center font-weight-bold">Lợi nhuận tổng</th>
                        <th class="text-center font-weight-bold">Ghi chú</th>
                        <th></th>
                      </tr>
                     </thead>
                    <tbody>
                    <tr v-for="(item, index) in trade.products">
                      <td>{{index + 1}}</td>
                      <td>{{item.product_code ? item.product_code : item.product_code_input}}</td>
                      <td>{{item.product_name ? item.product_name : item.product_name_input}}</td>
                      <td>{{item.brand_name ? item.brand_name : item.brand_name_input}}</td>
                      <td class="text-right">
<!--                        {{currencyFormat(item.price_list)}}-->
                        <input
                          :id="'price_list_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.price_list"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changeProductItem('price_list', index)">
                      </td>
                      <td class="text-right">
<!--                        {{item.discount}}%-->
                        <input
                          :id="'discount_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.discount"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changeProductItem('discount', index)">
                      </td>
                      <td class="text-right">
<!--                        {{currencyFormat(item.price)}}-->
                        <input
                          :id="'price_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.price"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changeProductItem('price', index)">
                      </td>
                      <td class="text-right">
<!--                        {{item.discount_sale}}%-->
                        <input
                          :id="'discount_sale_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.discount_sale"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changeProductItem('discount_sale', index)">
                      </td>
                      <td class="text-right">
<!--                        {{currencyFormat(item.profit_on_item)}}-->
                        <input
                          :id="'profit_on_item_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.profit_on_item"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changeProductItem('profit_on_item', index)">
                      </td>
                      <td class="text-right">
<!--                        {{currencyFormat(item.price_sell)}}-->
                        <input
                          :id="'price_sell_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.price_sell"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changeProductItem('price_sell', index)">
                      </td>
                      <td class="text-right">
<!--                        {{currencyFormat(item.quantity)}}-->
                        <input
                          :id="'quantity_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.quantity"
                          @keyup="integerPointAndCommaOnly($event.target)"
                          @change="changeProductItem('quantity', index)">
                      </td>
                      <td class="text-right">{{currencyFormat(item.amount_sell)}}</td>
                      <td class="text-right">{{currencyFormat(item.profit)}}</td>
                      <td class="text-right">{{item.note}}</td>
                      <td>
<!--                        <i class="fa fa-edit" @click="editProduct(index)" />-->
                        <i class="fa fa-trash ml-2" @click="deleteProduct(index, 1, '', item.product_id, item.quantity, item.properties)" />
                      </td>
                    </tr>
                    </tbody>
                  </table>
                    </div>
                  </b-col>
                </b-row>

                <!-- Báo giá dự án thì dùng danh sách này-->
                <b-row class="mt-2" v-show="trade.type == 1 && projectProducts.length > 0" >
                  <b-col md="12">
                    <div style="width: 100%; overflow-x: scroll" class="sub-table-cus">
                      <table class="table table-bordered table-striped fixed_header">
                        <colgroup>
                          <col style="width:60px">
                          <col style="width:130px">
                          <col style="width:220px">
                          <col style="width:130px">
                          <col style="width:130px">
                          <col style="width:80px">
                          <col style="width:130px">
                          <col style="width:80px">
                          <col style="width:130px">
                          <col style="width:130px">
                          <col style="width:100px">
                          <col style="width:130px">
                          <col style="width:130px">
                          <col style="width:130px">
                          <col style="width:50px">
                        </colgroup>
                        <thead>
                          <tr>
                            <th class="text-center font-weight-bold">STT</th>
                            <th class="text-center font-weight-bold">Mã SP</th>
                            <th class="text-center font-weight-bold">Tên SP</th>
                            <th class="text-center font-weight-bold">Hãng SP</th>
                            <th class="text-center font-weight-bold">Giá List</th>
                            <th class="text-center font-weight-bold">CK từ NCC</th>
                            <th class="text-center font-weight-bold">Giá gốc</th>
                            <th class="text-center font-weight-bold">% lợi nhuận mong muốn</th>
                            <th class="text-center font-weight-bold">Lợi nhuận/sản phẩm</th>
                            <th class="text-center font-weight-bold">Giá bán</th>
                            <th class="text-center font-weight-bold">Số lượng</th>
                            <th class="text-center font-weight-bold">Thành tiền</th>
                            <th class="text-center font-weight-bold">Lợi nhuận tổng</th>
                            <th class="text-center font-weight-bold">Ghi chú</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in projectProducts" :class="item.product_type == 0 ? 'project_bg' : ''" >
                            <td>
                              {{item.project_index}}
                            </td>
                            <td>
                              <span v-show="item.product_type == 1">{{item.product_code ? item.product_code : item.product_code_input}}</span>
                            </td>
                            <td>
                              <span v-show="item.product_type == 1">
                                {{item.product_name ? item.product_name : item.product_name_input}}
                              </span>
                              <span v-show="item.product_type == 0">
                                <b>{{item.product_name}}</b>
                              </span>
                            </td>
                            <td>
                              <span v-show="item.product_type == 1">
                                {{item.brand_name ? item.brand_name : item.brand_name_input}}
                              </span>
                              <span v-show="item.product_type == 0">
                                {{item.project_brand_name}}
                              </span>
                            </td>
                            <td class="text-right">
                              <input
                                 v-show="item.product_type == 1"
                                :id="'price_list_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.price_list"
                                @keyup="integerPointAndCommaOnly($event.target)"
                                @change="changeProductItem('price_list', index, item.project_index, item.index)">
                            </td>
                            <td class="text-right">
                              <input
                                v-show="item.product_type == 1"
                                :id="'discount_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.discount"
                                @keyup="integerPointAndCommaOnly($event.target)"
                                @change="changeProductItem('discount', index, item.project_index, item.index)">
                            </td>
                            <td class="text-right">
                              <input
                                v-show="item.product_type == 1"
                                :id="'price_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.price"
                                @keyup="integerPointAndCommaOnly($event.target)"
                                @change="changeProductItem('price', index, item.project_index, item.index)">
                            </td>
                            <td class="text-right">
                              <input
                                v-show="item.product_type == 1"
                                :id="'discount_sale_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.discount_sale"
                                @keyup="integerPointAndCommaOnly($event.target)"
                                @change="changeProductItem('discount_sale', index, item.project_index, item.index)">
                            </td>
                            <td class="text-right">
                              <input
                                v-show="item.product_type == 1"
                                :id="'profit_on_item_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.profit_on_item"
                                @keyup="integerPointAndCommaOnly($event.target)"
                                @change="changeProductItem('profit_on_item', index, item.project_index, item.index)">
                            </td>
                            <td class="text-right">
                              <span v-show="item.product_type == 0"><b>{{currencyFormat(item.project_price)}}</b></span>
                              <input
                                 v-show="item.product_type == 1"
                                :id="'price_sell_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.price_sell"
                                @keyup="integerPointAndCommaOnly($event.target)"
                                @change="changeProductItem('price_sell', index, item.project_index, item.index)">
                            </td>
                            <td class="text-right">
                              <span v-show="item.product_type == 0"><b>{{item.project_quantity}}</b></span>
                              <input
                                 v-show="item.product_type == 1"
                                :id="'quantity_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.quantity"
                                @change="changeProductItem('quantity', index, item.project_index, item.index)">
                            </td>

                            <td class="text-right">
                              <span v-show="item.product_type == 0"><b>{{currencyFormat(item.project_amount)}}</b></span>
                              <span v-show="item.product_type == 1">{{currencyFormat(item.amount_sell)}}</span>
                            </td>
                            <td class="text-right">
                              <span v-show="item.product_type == 1">{{currencyFormat(item.profit)}}</span>
                            </td>
                            <td class="text-right">
                              {{item.note}}
                            </td>
                            <td>
                              <i class="fa fa-trash ml-2" @click="deleteProduct(index, item.product_type, item.product_name, item.product_id, item.quantity, item.properties, item.project_index, item.index)" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

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

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Tổng tiền sản phẩm </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
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
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Chi phí thêm </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
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
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Số tiền giảm  </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
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
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Thuế VAT </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <div class="input-group">
                          <input type="checkbox" id="have_vat" v-model="trade.have_vat" class="mr-2" @change="calculateAmount('vat')">
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
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Thành tiền<span class="error-sybol"></span> </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
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
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Lợi nhuận </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="trade_profit"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.profit"
                          readonly>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Tài khoản nhận thanh toán </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select
                          id="bank_account_id"
                          :options="bankAccountOptions"
                          v-model="trade.bank_account_id"
                          type="text"
                          class="form-control"
                          @change="changeBankAccount"
                        ></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Hình thức thanh toán </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select
                          id="payment_method"
                          :options="optionsPaymentMethod"
                          v-model="trade.payment_method"
                          type="text"
                          class="form-control"
                        ></b-form-select>
                        <input
                          v-show="trade.payment_method == null"
                          id="payment_method_input"
                          type="text"
                          maxlength="255"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.payment_method_input">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Thỏa thuận vận chuyển </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select
                          id="shipping_agreement"
                          :options="optionsShippingAgreement"
                          v-model="trade.shipping_agreement"
                          type="text"
                          class="form-control"
                        ></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Phí giao hàng </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="shipping_fee"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.shipping_fee"
                          @change="changeCurrencyField('shipping_fee')">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row" v-if="userRole == 'admin'">
                      <b-col md="4" class="mt-2">
                        <label> Nhân viên phụ trách </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select
                          id="staff_in_charge"
                          :options="optionsStaff"
                          v-model="trade.staff_in_charge"
                          type="text"
                          class="form-control"
                          @change="changeStaffInChange"
                        ></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label> Ghi chú </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-textarea
                          id="description"
                          style="width:100%;"
                          rows="2"
                          v-model="trade.description"
                        ></b-form-textarea>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>


              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="bg-warning text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin giao hàng</span>
                  <span class="pull-right" v-show="showShippingInfo" @click="showShippingInfo = !showShippingInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showShippingInfo" @click="showShippingInfo = !showShippingInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </b-col>
            </b-row>

            <b-row v-show="showShippingInfo" class="mt-1">
              <b-col>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>
                          <span>Tên người nhận hàng</span>
                        </label>
                      </b-col>
                      <b-col md="8">
                        <input
                          id="receiver_name"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.receiver_name"
                          :disabled="saving">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>
                          <span>SĐT nhận hàng</span>
                        </label>
                      </b-col>
                      <b-col md="8">
                        <input
                          id="receiver_phone"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.receiver_phone"
                          :disabled="saving"
                          @keyup="integerOnly($event.target)">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>
                          <span>Địa chỉ nhận hàng</span>
                        </label>
                      </b-col>
                      <b-col md="8">
                        <input
                          id="receiver_address"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.receiver_address"
                          :disabled="saving">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>
                          <span>Ngày giao hàng dự kiến</span>
                        </label>
                      </b-col>
                      <b-col md="8">
                        <datepicker v-model="trade.shipping_date" format="yyyy-MM-dd" input-class="datepicker-cus"></datepicker>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="form-row">
                  <b-col md="2" class="mt-2">
                    <label>
                      <span>Ghi chú khi giao hàng</span>
                    </label>
                  </b-col>
                  <b-col md="10">
                    <b-form-textarea
                      id="shipping_note"
                      style="width:100%;"
                      rows="2"
                      v-model="trade.shipping_note"
                    ></b-form-textarea>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-left">
                <b-button variant="outline-primary" class="pull-left btn-width-120 mt-1" @click="updateDraft">
                  Lưu nháp
                </b-button>
                <download-excel
                  v-show="trade.products.length > 0"
                  class   = "btn btn-default text-header pull-right mt-1"
                  :data   = "products_excel"
                  :fields = "excel_fields"
                  worksheet = "DS SP trong đơn hàng"
                  name    = "danh_sach_san_pham_trong_don_hang.xls">
                  <b>Xuất Excel</b>
                </download-excel>
              </b-col>
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button v-show="!saving" variant="outline-success" style="height: 50px; width: 240px"
                          @click="save" :disabled="saving || !this.trade.id">
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

    <!--Modal tìm kiếm báo giá -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-search-quotation">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tìm kiếm báo giá</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col md="6">
          <label> Mã báo giá </label>
          <input
            id="quatationNumber"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="quotationSearch.quotation_number"
            maxlength="15">
        </b-col>
        <b-col md="6">
          <label> Tên khách hàng </label>
          <input
            id="customerName"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="quotationSearch.customer_name"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="this.$bvModal.hide('modal-search-quotation')">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchQuotation"
                    @click.prevent="searchQuotation">
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
            :fields="quotationSearchFields"
            :items="quotationSearchItems">
            <template v-slot:cell(action)="data">
              <b-button variant="outline-success" class="pull-right btn-width-120"
                @click.prevent="chooseQuotation(data.item.id)">
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
            <label>Hãng sản phẩm</label>
            <b-form-select
              :options="productBrandOptionsSearch"
              id="product_brand"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="productSearch.product_brand_id"></b-form-select>
          </b-col>
          <b-col md="2" class="mt-2">
            <label>Nhóm sản phẩm</label>
              <multiselect
                v-model="productGroupSearchSelect"
                :options="productGroupOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn nhóm sản phẩm--"
                label="text"
                track-by="text"
                @input="changeProductGroupSearch">
              </multiselect>
          </b-col>

          <b-col md="2" class="mt-2">
            <label>Loại sản phẩm</label>
            <multiselect
              v-model="productTypeSearchSelect"
              :options="productTypeSearchOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn loại sản phẩm--"
              label="text"
              track-by="text"
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
              maxlength="255">
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
                  @click.prevent="chooseProduct(data.item.id)">
                  Chọn
                </b-button>
              </template>
            </b-table>
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
          <label>Tên</label>
          <input
            id="nameCusSearch"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="customerSearch.name"
            maxlength="75">
        </b-col>
        <b-col md="6">
          <label>Số điện thoại</label>
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
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalSearchCustomer">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchCustomer"
                    @click.prevent="searchCustomer">
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
                @click.prevent="chooseCustomer(data.item.id)">
                Chọn
              </b-button>
            </template>
          </b-table>

          <p class="text-center">--Hết--</p>
        </b-col>
      </b-row>

    </b-modal>

    <!--Modal thêm khách hàng -->
    <b-modal centered hide-footer hide-header size="lg" id="modal-add-customer">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Thêm khách hàng</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>Loại khách hàng</label>
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
          <label>Tên<span class="error-sybol"></span> </label>
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
          <label>Mã khách hàng<span class="error-sybol"></span> </label>
        </b-col>
        <b-col md="9">
          <input
            id="code"
            type="text"
            class="form-control"
            v-model="customer.code"
            @keyup="integerOnly($event.target)"
            autocomplete="new-password"
            maxlength="20"
            placeholder="Số điện thoại hoặc mã số thuế">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>Số Điện Thoại</label>
        </b-col>
        <b-col md="9">
          <input
            id="phoneCuss"
            type="text"
            class="form-control"
            v-model="customer.phone_number"
            @keyup="integerOnly($event.target)"
            autocomplete="new-password"
            maxlength="15"
            v-on:change="checkPhoneNumberFormat($event.target.value)">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>Email</label>
        </b-col>
        <b-col md="9">
          <input
            id="email"
            type="text"
            class="form-control"
            v-model="customer.email"
            autocomplete="new-password"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>Mã số thuế<span v-show="customer.type == 1" class="error-sybol"></span></label>
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

      <b-row class="form-row" v-show="customer.type == 1">
        <b-col md="3" class="mt-2">
          <label>Phân loại</label>
        </b-col>
        <b-col md="9">
          <b-form-select :options="optionsCompanyType" v-model="customer.company_type"></b-form-select>
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
          <datepicker v-model="customer.birthday" format="yyyy-MM-dd"
                                placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
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
          <label>Quận/Huyện</label>
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
          <label>Địa chỉ</label>
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
          <label>
            <span>Tên người liên hệ</span>
          </label>
        </b-col>
        <b-col md="9">
          <input
            id="customer_contact_person_name"
            type="text"
            maxlength="100"
            autocomplete="new-password"
            class="form-control"
            v-model="customer.contact_person_name">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>
            <span>Sđt người liên hệ</span>
          </label>
        </b-col>
        <b-col md="9">
          <input
            id="customer_contact_person_phone"
            type="text"
            maxlength="14"
            autocomplete="new-password"
            class="form-control"
            v-model="customer.contact_person_phone"
            @keyup="integerOnly($event.target)">
        </b-col>
      </b-row>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label>Email người liên hệ</label>
        </b-col>
        <b-col md="9">
          <input
            id="contact_person_email"
            type="text"
            class="form-control"
            v-model="customer.contact_person_email"
            autocomplete="new-password"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="form-row" v-show="userRole == 'admin'">
        <b-col md="3" class="mt-2">
          <label>Nhân viên phụ trách</label>
        </b-col>
        <b-col md="9">
          <b-form-select
            id="created_by_2"
            :options="optionsStaff"
            v-model="customer.created_by"
            type="text"
            class="form-control"
          ></b-form-select>
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

    <!-- Modal chọn đơn vị -->
    <b-modal centered hide-footer hide-header size="sm" id="modal-choose-multiple-unit">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Chọn Đơn Vị Báo Giá</h4>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col cols="12">
          Đơn vị gốc: TODO
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          Chuyển đổi thành:
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12">
          <b-form-select
            :options="multipleUnitsOption"
            id="multiple_unit"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="current_unit"
          >
          </b-form-select>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-center mt-3">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="hideModalChooseMultipleUnit">
            Bỏ qua
          </b-button>
          <b-button variant="outline-success" class="pull-right btn-width-120" @click="chooseUnit">
            Chuyển đổi
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal giữ hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-repo-keep">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Sản phẩm có sẵn trong kho. Bạn có muốn giữ hàng cho đơn hàng này không?</h4>
        </b-col>
      </b-row>
      <hr>
      <b-row>
            <b-col>
              <b-table
                hover
                bordered
                stacked="md"
                :fields="repo_product_fields"
                :items="repo_products">
              </b-table>
            </b-col>
          </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalRepoKeep">
            Bỏ qua
          </b-button>

          <b-button v-show="!saving" variant="outline-primary" class="pull-right btn-width-120"
                    :disabled="saving" @click.prevent="confirmRepoKeep">
            Giữ hàng
          </b-button>

          <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>


<script>
import productApi from '@/api/product'
import quotationApi from '@/api/quotation'
import orderSellApi from '@/api/orderSell'
import superAdminAPI from '@/api/superAdmin'
import customerApi from '@/api/customer'
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
      prefix_title: "Thêm Mới",
      quotationOptions: [],
      loadingQuotation: false,
      quotationSelect: {},
      loadingCustomerOptions: false,
      customerSelect: {},
      customerOptionStore: [],
      loadCusDetail: false,
      productGroupSearchSelect: {},
      // productGroupSelect: {},
      productGroupOptions:[],
      productTypeSearchSelect:{},
      productTypeSearchOptions:[],
      // productTypeSelect:{},
      // productTypeOptions:[],
      productTypeOptionStore: [],
      loadingProductOptions: false,
      loadProductDetail: false,
      productSelect: {},
      productOptions: [],
      productOptionStore: [],
      unitOptions:[],
      productBrandOptions:[],
      productBrandOptionsSearch: [],
      optionsStaff: [],
      optionsStaffStore: [],
      optionsPaymentMethod: [],
      optionsShippingAgreement: [],
      bankAccountOptions: [],
      bankAccountOptionStore: [],
      multipleUnitsOptionStore: [],
      multipleUnitsOption: [],
      current_unit: null,
      root_unit: {},
      optionsCompanyType: [
        {value: null, text: ''},
        {value: 1, text: 'Thương mại'},
        {value: 2, text: 'Nhà máy'},
        {value: 3, text: 'Công Trình'}
      ],
      bankAccountSelected: {"account_name": "", "account_number": "", "bank_name": ""},
      quotationSearch: {
        "quotation_number": null,
        "customer_name": null
      },
      onSearchQuotation: false,
      quotationSearchFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'quotation_number',
          label: 'Mã BG'
        },
        {
          key: 'customer_name',
          label: 'Tên K.H'
        },
        {
          key: 'created_at',
          label: 'Ngày tạo BG'
        },
        {
          key: 'staff_on_charge_name',
          label: 'NV quản lý'
        },
        {
          key: 'sub_total',
          label: 'Tổng tiền SP'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      quotationSearchItems: [],
      trade: {
        "id": null,
        "status": -1,
        "type": 0,
        "quotation_id": null,
        "issue_invoice": null,
        "customer_id": null,
        "customer_name": null,
        "customer_tax_code": null,
        "customer_address": null,
        "customer_email": null,
        "sub_total": 0,
        "extra_fee": null,
        "fixed_discount": null,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "profit": 0,
        "bank_account_id": null,
        "payment_method": null,
        "payment_method_input": null,
        "shipping_agreement": null,
        "shipping_fee": 0,
        "staff_in_charge": null,
        "staff_in_charge_name": null,
        "staff_in_charge_phone": null,
        "staff_in_charge_email": null,
        "staff_in_charge_position": null,
        "description": null,
        "products": [],
        "receiver_name": null,
        "receiver_phone": null,
        "receiver_address": null,
        "shipping_date": null,
        "shipping_note": null
      },
      currentProduct: {
        "index": -1,
        "product_group_id": null,
        "product_group_name": null,
        "product_type_id": null,
        "product_type_name": null,
        "product_id": null,
        "product_code": null,
        "product_code_input": null,
        "product_name": null,
        "product_name_input": null,
        "unit_id": null,
        "unit_name": null,
        "unit_id_input": null,
        "unit_name_input": null,
        "brand_id": null,
        "brand_name": null,
        "brand_id_input": null,
        "brand_name_input": null,
        "price_list": null,
        "discount": null,
        "price": null,
        "discount_sale": null,
        "profit_on_item": null,
        "amount": null,
        "price_sell": null,
        "amount_sell": null,
        "profit": null,
        "quantity_repo": null,
        "quantity": null,
        "is_available_in_repo": true,
        "properties": [],
        "note": null,
        "target_unit_id": null, 
        "target_unit_name": null,
        "conversion_value": null,
        "quantity_root": null
      },
      currentProperties: [], // TODO: chỉ lấy thuộc tính có trong kho
      propertiesChoosen: [],
      currentPropertiesRoot: [],
      products_excel: [],
      excel_fields: {
        'STT': 'index',
        'Mã sản phẩm': 'product_code',
        'Tên Sản phẩm' : 'product_name',
        'HÃNG SX' : 'brand_name',
        'ĐVT' : 'unit_name',
        'SL' : 'quantity',
        'ĐƠN GIÁ' : 'price',
        'THÀNH TIỀN (VNĐ)' : 'amount',
        'GHI CHÚ' : 'note'
      },
      saving: false,
      loading: false,
      showPartnerInfo: true,
      showProductInfo: true,
      showPaymentInfo: true,
      showShippingInfo: true,
      saveSuccess: false,
      today_day: "",
      today_month: "",
      today_year: "",
      store_name: "",
      store_tax_code: "",
      store_address: "",
      store_phone_number: "",
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

      customer: {
        "type": 0,
        "name": null,
        "code": null,
        "phone_number": null,
        "email": null,
        "tax_code": null,
        "company_type": null,
        "gender": null,
        "birthday": null,
        "city_id": null,
        "district_id": null,
        "address": null,
        "contact_person_name": null,
        "contact_person_phone": null,
        "contact_person_email": null,
        "created_by": null
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
      userRole: "admin",
      // loadingCustomer: false,
      // loadingGroupProduct: false,
      // loadingTypeProduct: false,
      // loadingProduct: false,
      repo_keep: {},
      repo_products: [],
      repo_product_fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'product_name',
          label: 'Sản phẩm'
        },
        {
          key: 'unit_name',
          label: 'Đơn vị'
        },
        {
          key: 'quantity',
          label: 'Số lượng bán'
        },
        {
          key: 'repo_quantity_remain',
          label: 'Số lượng trong kho'
        }
      ],
      currentCustomer: {},
      projectProducts : [],
    }
  },
  created() {
    document.addEventListener('beforeunload', this.checkUpdateDraft())
  },
  mounted() {
    // Check prefix
    if(this.$route.params.id) {
      this.prefix_title = "Cập Nhật"
    } else {
      this.prefix_title = "Thêm Mới"
    }

    // UI by staff
    let url = location.href
    if(url.includes("order-sell-staff") || url.includes("order-sell-by-quotation-staff")) {
      this.userRole = "staff"
    } else {
      this.userRole = "admin"
    }

    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()
    this.trade.shipping_date = new Date(dateNow.setDate(dateNow.getDate() + 3))

    // Get list quotation option
    this.getQuotationOption()

    // Lấy danh sách khách hàng trước
    this.getCustomerOptions()

    // Lấy danh sách sản phẩm
    this.getProductOptions()

    // Lấy danh sách khách hàng trước
    // this.getOptionsRelated()

    // Lấy các danh sách còn lại sau
    let params2 = {
      product_groups: true,
      product_types: true,
      products: true,
      cities: true,
      brands: true,
      units: true,
      bank_accounts: true,
      payment_methods: true,
      shipping_agreements: true,
      multiple_units: true,
    }
    if(this.userRole == "admin") {
      params2.staffs = true
    }
    this.getOptionsRelated(params2)

    // Get trade detail
    this.getTradeDetail()

    // Get store info
    this.getStoreDetail()
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
     *  Get customer options
     */
    getCustomerOptions() {
      console.log("this.userRole: " + this.userRole)
      let params = {}
      if(this.userRole == "staff") {
        params.customer_by_staff = true
      } else {
        params.customer_by_admin = true
      }

      this.loadingCustomerOptions = true

      quotationApi.getCustomerOptions(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          // Customers
          this.customerOptionStore = res.data.data
          let itemEmpty = {"id": null, "name": '-- Chọn khách hàng --'}
          this.customerOptionStore.unshift(itemEmpty)
          this.getCustomerItemById(this.trade.customer_id)
          this.changeCustomer()
        }

        this.loadingCustomerOptions = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingCustomerOptions = false
      })
    },

    /**
     *  Get customer options
     */
    getProductOptions() {
      this.loadingProductOptions = true

      quotationApi.getProductOptions().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          // Products
          this.productOptions = res.data.data
          let itemEmpty = {"id": null, "name_full": '-- Chọn sản phẩm --'}
          this.productOptions.unshift(itemEmpty)
        }

        this.loadingProductOptions = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingProductOptions = false
      })
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
        this.customer.district_id = null
      }

    },

      getCustomerCodeById(id) {
        for(let i in this.customerOptionStore) {
            if(this.customerOptionStore[i].id == id) {
                return this.customerOptionStore[i].code
            }
        }
        return null
      },

    /**
     * Get staff options
     */
    updateCustomerInfo() {
        if(!this.trade.customer_id) {
            return
        }
        let params = {
            "id": this.trade.customer_id,
            "name": this.trade.customer_name,
            "address": this.trade.customer_address,
            "tax_code": this.trade.customer_tax_code,
            "email": this.trade.customer_email,
            "code": this.currentCustomer.code
        }
      customerApi.updateCustomerFromOrderSell(params).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', "Cập nhật thông tin khách hàng thành công!")

          if(this.customerSelect && this.customerSelect.id) {
            this.customerSelect.name = JSON.parse(JSON.stringify(this.trade.customer_name))
          }

          this.getCustomerOptions()
        }
      })
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
          "unit_id": null,
          "description": null
      }
      this.$bvModal.hide('modal-add-product')
    },

    getProductGroupItemById(id) {
      for(let i in this.productGroupOptions) {
        if(this.productGroupOptions[i].id == id) {
          return this.productGroupOptions[i]
        }
      }
      return {}
    },

    getProductTypeItemById(id) {
      for(let i in this.productTypeOptionStore) {
        if(this.productTypeOptionStore[i].value == id) {
          return this.productTypeOptionStore[i]
        }
      }
      return {}
    },

    getProductItemById(id) {
      for(let i in this.productOptions) {
        if(this.productOptions[i].id == id) {
          return this.productOptions[i]
        }
      }
      return {}
    },

      /**
     * Search
     */
    searchQuotation() {
      if (this.onSearchQuotation) { return }
      this.quotationSearchItems = []

      this.onSearchQuotation = true

      let params = {
        "quotation_number": this.quotationSearch.quotation_number,
        "customer_name": this.quotationSearch.customer_name,
        "limit": 100,
        "offset": 0
      }

      quotationApi.searchQuotationForOrderSell(params, this.userRole).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.quotationSearchItems = res.data.data
        } else {
          this.quotationSearchItems = []
        }
        this.onSearchQuotation = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchQuotation = false
      })
    },

    chooseQuotation(id) {
        let quotationId = id
        if(!id) {
            quotationId = this.trade.quotation_id
        }
      // Get order sell detail by quotation id
      this.getOrderSellDetailByQuotationId(quotationId)
      this.getQuotationItemById(quotationId)
      this.$bvModal.hide('modal-search-quotation')
    },

    getParentIndexByName(list_projects_products, project_name) {
      let pro_ind = 0
      for(let item of list_projects_products) {
        if(item.product_name == project_name) {
          return pro_ind
        }
        pro_ind += 1
      }
      return 0
    },

      reformatProductItem(product) {
        product.price_list = this.currencyFormat((product.price_list + '').replaceAll(",", ""))
        
        product.price = this.currencyFormat((product.price + '').replaceAll(",", ""))
        
        product.profit_on_item = this.currencyFormat((product.profit_on_item + '').replaceAll(",", ""))
        if(product.profit_on_item == "" || product.profit_on_item == "null" || product.profit_on_item == "NaN") {
            product.profit_on_item = 0
        }
        
        product.price_sell = this.currencyFormat((product.price_sell + '').replaceAll(",", ""))
        product.quantity = this.currencyFormat((product.quantity + '').replaceAll(",", ""))
        product.amount = this.currencyFormat((product.amount + '').replaceAll(",", ""))
        if(product.amount == "" || product.amount == "null" || product.amount == "NaN") {
            product.amount = 0
        }
        product.amount_sell = (product.amount_sell + '').replaceAll(",", "")
        if(product.amount_sell == "" || product.amount_sell == "null" || product.amount_sell == "NaN") {
            product.amount_sell = 0
        }
        product.profit = this.currencyFormat((product.profit + '').replaceAll(",", ""))
        if(product.profit == "" || product.profit == "null" || product.profit == "NaN") {
            product.profit = 0
        }

        return product
      },

    handleListProduct() {
      if(this.trade.products.length > 0) {

        // Tạo danh sách dự án
        let list_projects = []
        let list_name_project_checked = []
        for(let p of this.trade.products) {
          if(!list_name_project_checked.includes(p.project_name)) {
            list_name_project_checked.push(p.project_name)
            let project = JSON.parse(JSON.stringify(this.currentProduct))
            // project.project_index = index
            project.product_name = p.project_name
            project.project_brand_name = p.project_brand_name
            project.project_quantity = p.project_quantity
            project.project_amount = 0
            list_projects.push(project)
          }
        }

        // Gom sản phẩm theo dự án
        let list_projects_products = []
        let project_index = 1
        for(let project of list_projects) {
          project.project_index = project_index
          project.product_type = 0 // Dự án
          list_projects_products.push(project)

          let product_index = 1
          for(let product of this.trade.products) {
            let project_item = JSON.parse(JSON.stringify(product))
            if(product.project_name == project.product_name) {
              project_item.project_index = project.project_index + "." + product_index
              project_item.product_type = 1 // Sản phẩm

              project_item = this.reformatProductItem(project_item)

              list_projects_products.push(project_item)

              let parent_index = this.getParentIndexByName(list_projects_products, product.project_name)
              let amount_sell = (product.amount_sell + '').replaceAll(",", "")
              list_projects_products[parent_index].project_amount += parseInt(amount_sell)
              product_index += 1
            }
          }

          project_index += 1
        }

        // Tính đơn giá dự án
        for(let project of list_projects_products) {
          if(project.product_type == 0) {
            project.project_price = Math.round(project.project_amount / project.project_quantity)
          }
        }

        this.projectProducts = list_projects_products
      }

    },

      getOrderSellDetailByQuotationId(quotationId) {
        if(quotationId){
          this.loading = true

          quotationApi.getQuotationDetail(quotationId, this.userRole).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              let quotation = res.data.data

                console.log("===")
                console.log(quotation)
                console.log(quotation.customer_id)

              this.trade.quotation_id = quotationId
              this.trade.customer_id = quotation.customer_id
                console.log(this.trade.customer_id)
              this.trade.customer_name = quotation.customer_name
              this.trade.customer_address = quotation.customer_address
              this.trade.customer_tax_code = quotation.customer_tax_code
              this.trade.customer_email = quotation.customer_email
              this.trade.receiver_name = quotation.contact_person_name
              this.trade.receiver_phone = quotation.contact_person_phone
              this.trade.have_vat = quotation.have_vat
              this.trade.vat_percent = quotation.vat_percent
              this.trade.vat_value = quotation.vat_value
              this.trade.profit_margin = quotation.profit_margin
              this.trade.profit = quotation.profit
              this.trade.payment_method = quotation.payment_method
              this.trade.payment_method_input = quotation.payment_method_input
              this.trade.shipping_agreement = quotation.shipping_agreement
              this.trade.staff_in_charge = quotation.staff_in_charge
              this.trade.description = quotation.description
              this.trade.products = quotation.products
              this.trade.promotions = quotation.promotions
              this.trade.type = quotation.type
              // if(quotation.shipping_date) {
              //     this.trade.shipping_date = quotation.shipping_date
              // }

              // Kiểm tra là loại báo giá nào, nếu là báo giá dự án thì handle lại ds sp:
              if(quotation.type == 1) {
                this.handleListProduct()
              }

                // Format
                this.trade.sub_total = this.currencyFormat((quotation.sub_total + '').replaceAll(",", ""))
                this.trade.profit = this.currencyFormat((quotation.profit + '').replaceAll(",", ""))
                this.trade.total = this.currencyFormat((quotation.total + '').replaceAll(",", ""))
                this.trade.extra_fee = this.currencyFormat((quotation.extra_fee + '').replaceAll(",", ""))
                this.trade.fixed_discount = this.currencyFormat((quotation.fixed_discount + '').replaceAll(",", ""))
                this.trade.shipping_fee = this.currencyFormat((quotation.shipping_fee + '').replaceAll(",", ""))

                console.log("===")
                console.log(this.trade)

                // Check đã save draft chưa
                if(!this.trade.order_sell_number) {
                    this.saveDraft()
                }

                console.log("===")
                console.log(this.trade)

                // Selected customer option
                if(this.trade.customer_id) {
                  this.getCustomerItemById(this.trade.customer_id)
                  // this.changeCustomer()
                }

                console.log("===")
                console.log(this.trade)

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

    chooseProduct(product_id) {
      // Set product selected
      this.productSelect = this.getProductItemById(product_id)
      this.changeProduct()
      this.$bvModal.hide('modal-search-product')
    },

    showModalAddCustomer() {
      this.$bvModal.show('modal-add-customer')
    },

    showModalSearchCustomer() {
      this.$bvModal.show('modal-search-customer')

      this.searchCustomer()
    },

    showModalSearchQuotation() {
      this.$bvModal.show('modal-search-quotation')
    },

    backCustomer() {
      this.customer = {
        "type": 0,
        "name": null,
        "code": null,
        "phone_number": null,
        "email": null,
        "tax_code": null,
        "gender": null,
        "birthday": null,
        "city_id": null,
        "district_id": null,
        "address": null,
        "contact_person_name": null,
        "contact_person_phone": null,
        "contact_person_email": null,
        "created_by": null
      }
      this.$bvModal.hide('modal-add-customer')
    },

    saveCustomer() {
      if(!this.customer.name) {
        this.popToast('danger', "Vui lòng nhập tên khách hàng")
        return
      }
      if(!this.customer.code) {
        this.popToast('danger', "Vui lòng nhập mã khách hàng")
        return
      }
      if(this.customer.type == 1 && !this.customer.tax_code) {
        this.popToast('danger', "Vui lòng nhập mã số thuế")
        return
      }

      // Add
      this.savingCustomer = true
      customerApi.addCustomerByStore(this.customer).then(res => {
        this.savingCustomer = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.popToast('success', "Thêm khách hàng thành công!")

            let customer_id = res.data.data
            let customer = JSON.parse(JSON.stringify(this.customer))
              this.currentCustomer = JSON.parse(JSON.stringify(customer))
              this.currentCustomer.id = customer_id

            // this.customerOptionStore.unshift({id: customer_id, name: customer.name})
            this.customerSelect = {id: customer_id, name: customer.name}

            this.trade.customer_id = customer_id
            this.trade.customer_name = customer.name
            this.trade.customer_address = customer.address
            this.trade.customer_tax_code = customer.tax_code
            this.trade.receiver_name = customer.contact_person_name
            this.trade.receiver_phone = customer.contact_person_phone
            this.trade.customer_email = customer.email

            this.getCustomerOptions()

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

    hideModalSearchCustomer() {
        this.$bvModal.hide('modal-search-customer')
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
        "staff_in_charge": null,
        "city_id": null,
        "type": null,
        "limit": 50,
        "offset": 0
      }
      console.log("this.userRole: " + this.userRole)
      customerApi.getCustomerByStore(params, this.userRole).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.customerSearchItems = res.data.data.customers

          if(this.customerSearchItems.length == 0) {
            this.popToast('danger', "Không có khách hàng nào được tìm thấy")
          }
        } else {
          this.customerSearchItems = []
          this.popToast('danger', "Không có khách hàng nào được tìm thấy")
        }
        this.onSearchCustomer = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchCustomer = false
      })
    },

    chooseCustomer(id) {
        this.getCustomerItemById(id)
        this.changeCustomer()

      this.$bvModal.hide('modal-search-customer')
    },

      getCustomerItemById(id) {
        if(id) {
          for(let i in this.customerOptionStore) {
              if(this.customerOptionStore[i].id == id) {
                  this.customerSelect = this.customerOptionStore[i]
                  break
              }
          }
        }
      },

      getQuotationItemById(id) {
        for(let i in this.quotationOptions) {
            if(this.quotationOptions[i].id == id) {
                this.quotationSelect = this.quotationOptions[i]
            }
        }
      },

      handleCustomerTaxCode(customer_tax_code) {
          if(customer_tax_code) {
              if(customer_tax_code.substring(0,1) == 0) {
                  return "'" + customer_tax_code
              } else {
                  return customer_tax_code
              }

          }
          return ''
      },

      handleProductExcel() {
        this.products_excel = [
          {
            'index': 'Tên khách hàng: ', 'product_code': this.trade.customer_name,
              'product_name' : null, 'brand_name' : null, 'unit_name' : null,
            'quantity' : null, 'price' : null, 'amount' : null, 'note' : null
          },
          {
            'index': 'Mã số thuế: ', 'product_code': this.handleCustomerTaxCode(this.trade.customer_tax_code),
              'product_name' : null, 'brand_name' : null, 'unit_name' : null,
            'quantity' : null, 'price' : null, 'amount' : null, 'note' : null
          },
          {
            'index': 'Địa chỉ: ', 'product_code': this.trade.customer_address,
              'product_name' : null, 'brand_name' : null, 'unit_name' : null,
            'quantity' : null, 'price' : null, 'amount' : null, 'note' : null
          },
          {
            'index': 'Email: ', 'product_code': this.trade.customer_email,
              'product_name' : null, 'brand_name' : null, 'unit_name' : null,
            'quantity' : null, 'price' : null, 'amount' : null, 'note' : null
          },
          {
            'index': null, 'product_code': null, 'product_name' : null, 'brand_name' : null, 'unit_name' : null,
            'quantity' : null, 'price' : null, 'amount' : null, 'note' : null
          },
          {
            'index': 'STT', 'product_code': 'Mã SP', 'product_name' : 'Tên SP', 'brand_name' : 'Thương hiệu',
            'unit_name' : 'Đơn vị', 'quantity' : 'Số lượng', 'price' : 'Giá bán', 'amount' : 'Thành tiền',
            'note' : 'Ghi chú'
          }
        ]

        if(this.trade.products.length > 0) {
            let productsExcel = JSON.parse(JSON.stringify(this.trade.products))

            for(let i in productsExcel) {
                let item = {
                  'index': parseInt(productsExcel[i].index),
                  'product_code': productsExcel[i].product_code ? productsExcel[i].product_code : productsExcel[i].product_code_input,
                  'product_name' : productsExcel[i].product_name ? productsExcel[i].product_name : productsExcel[i].product_name_input,
                  'brand_name' : productsExcel[i].brand_name ? productsExcel[i].brand_name : productsExcel[i].brand_name_input,
                  'unit_name' : productsExcel[i].target_unit_name ? productsExcel[i].target_unit_name : productsExcel[i].unit_name ? productsExcel[i].unit_name : productsExcel[i].unit_name_input,
                  'quantity' : productsExcel[i].quantity,
                  'price' : productsExcel[i].price,
                  'amount' : productsExcel[i].amount,
                  'note' : productsExcel[i].note
                }
                this.products_excel.push(item)
            }
        }
      },


    /**
     *  Get options
     */
    getOptionsRelated(params) {
      console.log("this.userRole: " + this.userRole)
      this.loadingOptions = true

      orderSellApi.getOptionRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {

          // Brands
          if(params.brands) {
            this.productBrandOptions = [{value: null, text: '-- Hãng sản phẩm --'}]
            this.productBrandOptionsSearch = [{value: null, text: ''}]
            let productBrands = res.data.data.brands
            if (productBrands) {
              for (let i in productBrands) {
                let item = {value: productBrands[i].id, text: productBrands[i].name}
                this.productBrandOptions.push(item)

                let itemSearch = {value: productBrands[i].id, text: productBrands[i].name}
                this.productBrandOptionsSearch.push(itemSearch)
              }
            }
          }

          // Cities
          if(params.cities) {
            this.optionsCity = res.data.data.cities
            this.optionsCity.unshift({"value": null, "text": ""})
            this.changeCity()
          }

          // Staffs
          if(params.staffs) {
            let staffs = res.data.data.staffs
            this.optionsStaffStore = JSON.parse(JSON.stringify(staffs))
            this.optionsStaff = [{value: null, text: ''}]
            if (staffs) {
              for (let i in staffs) {
                let item = {value: staffs[i].id, text: staffs[i].name}
                this.optionsStaff.push(item)
              }
            }
          }

          // Units
          if(params.units) {
            this.unitOptions = [{value: null, text: '-- Đơn vị --'}]
            let units = res.data.data.units
            if (units) {
              for (let i in units) {
                let item = {value: units[i].id, text: units[i].name}
                this.unitOptions.push(item)
              }
            }
          }

          // Bank accounts
          if(params.bank_accounts) {
            let bankAccounts = res.data.data.bank_accounts
            this.bankAccountOptionStore = JSON.parse(JSON.stringify(bankAccounts))

            this.bankAccountOptions = [{value: null, text: '-- Chọn tài khoản nhận thanh toán --'}]
            if (bankAccounts) {
              for (let i in bankAccounts) {
                let itemText = bankAccounts[i].type_str + " - " + bankAccounts[i].account_name + " - "
                  + bankAccounts[i].account_number + " - " + bankAccounts[i].bank_name
                let item = {value: bankAccounts[i].id, text: itemText}
                this.bankAccountOptions.push(item)
              }
            }
            // Handle bank account
            this.handleBankAccount()
            this.changeBankAccount()
          }

          // Payments methods
          if(params.payment_methods) {
            this.optionsPaymentMethod = res.data.data.payment_methods
            this.optionsPaymentMethod.unshift({value: null, text: 'Khác'})
          }

          // // Shipping agreements
          if(params.shipping_agreements) {
            this.optionsShippingAgreement = res.data.data.shipping_agreements
            this.optionsShippingAgreement.unshift({value: null, text: ''})
          }

          // Multiple Units
          if(params.multiple_units) {
            this.multipleUnitsOptionStore = res.data.data.multiple_units
          }

        }

        this.loadingOptions = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingOptions = false
      })
    },

    /**
     * Check multiple unit
     */
     checkMultipleUnit() {
      if(this.productSelect && this.productSelect.is_multi_unit) {
        this.multipleUnitsOption = []
        let index = 0
        for(let item of this.multipleUnitsOptionStore) {
          if(item.product_id == this.productSelect.id) {
            if(index == 0) {
              this.multipleUnitsOption.push({value: item.root_unit_id, text: item.root_unit_name})
              this.multipleUnitsOption.push({value: item.target_unit_id, text: item.target_unit_name})
            } else {
              this.multipleUnitsOption.push({value: item.target_unit_id, text: item.target_unit_name})
            }
            index += 1
          }
        }
        if(this.multipleUnitsOption.length > 0) {
          this.current_unit = this.multipleUnitsOption[0].value
          this.openModalChooseMultipleUnit()
        }
      }
    },

      /**
     *  Get detail
     */
    getTradeDetail() {
      let tradeId = this.$route.params.id
      if(tradeId){
        this.loading = true
        console.log("this.userRole: " + this.userRole)
        orderSellApi.getOrderSellDetail(tradeId, this.userRole).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.trade = res.data.data

            // Kiểm tra là loại báo giá nào, nếu là báo giá dự án thì handle lại ds sp:
              if(this.trade.type == 1) {
                this.handleListProduct()
              }

              // Format
              this.trade.sub_total = this.currencyFormat((this.trade.sub_total + '').replaceAll(",", ""))
              this.trade.profit = this.currencyFormat((this.trade.profit + '').replaceAll(",", ""))
              this.trade.total = this.currencyFormat((this.trade.total + '').replaceAll(",", ""))
              this.trade.extra_fee = this.currencyFormat((this.trade.extra_fee + '').replaceAll(",", ""))
              this.trade.fixed_discount = this.currencyFormat((this.trade.fixed_discount + '').replaceAll(",", ""))
              this.trade.shipping_fee = this.currencyFormat((this.trade.shipping_fee + '').replaceAll(",", ""))

              if(this.trade.customer_id) {
                  this.getCustomerItemById(this.trade.customer_id)
                // Ko cần change customer ở đây vì có thể thông tin k.h ở báo giá khác
                  // this.changeCustomer()
              }

              // Handle bank account
              this.handleBankAccount()
              this.changeBankAccount()

              this.handleProductExcel()

          }

          this.loading = false

        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
          let url = location.href
          if(url.includes("order-sell-by-quotation")) {
            let quotationId = this.$route.params.quotationId
            this.trade.quotation_id = quotationId
            this.getOrderSellDetailByQuotationId(quotationId)
          }
      }
    },

      resetListProductType() {
        this.productTypeSearchOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))
        this.productTypeSearchOptions.unshift({id: null, name: '-- Tất cả --', product_group_id: null})
        this.productTypeSearchSelect = this.productTypeSearchOptions[0]
      },

      // resetListProduct() {
      //   this.productSelect = {}
      //   this.productOptions = JSON.parse(JSON.stringify(this.productOptionStore))
      //
      //   if(this.productOptions.length > 0) {
      //       let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
      //       itemEmpty.id = null
      //       itemEmpty.name = ""
      //       this.productOptions.unshift(itemEmpty)
      //   }
      // },

    changeProductGroupSearch() {
      if(this.productGroupSearchSelect.id) {
        this.productSearch.product_group_id = this.productGroupSearchSelect.id

        // Reload list type by group
        this.productTypeSearchOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.productSearch.product_group_id == this.productTypeOptionStore[i].product_group_id) {
            // let item = {id: this.productTypeOptionStore[i].value, name: this.productTypeOptionStore[i].text}
            this.productTypeSearchOptions.push(this.productTypeOptionStore[i])
          }
        }
        if(this.productTypeSearchOptions.length > 0) {
          let itemEmpty = {}
          itemEmpty.id = null
          itemEmpty.name = "-- Tất cả --"
          itemEmpty.product_group_id = null
          this.productTypeSearchOptions.unshift(itemEmpty)
        }
      } else {
        this.productSearch.product_group_id = null

        this.resetListProductType()
      }
    },

    changeProductTypeSearch() {
      if(this.productTypeSearchSelect.value) {
        this.productSearch.product_type_id = this.productTypeSearchSelect.value
      } else {
        this.productSearch.product_type_id = null
      }
    },

      compareObjectProperties(properties, listProperties) {
        for(let o in listProperties) {
            if(listProperties[o].name == properties.name && listProperties[o].value == properties.value) {
                return true
            }
        }
        return false
      },

    calQuantityRepo() {
      if(this.currentProperties.length > 0 && this.currentProduct.properties.length > 0) {
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

        // let quantity_repo_obj = null
        if(properties.length > 0) {
            this.currentProduct.quantity_repo = 0
            for(let x in this.currentProduct.properties) {
                let properties_str = this.propertiesToString(this.currentProduct.properties[x])
                let properties_input_str = this.propertiesToString(properties)

                if(properties_str.includes(properties_input_str)) {
                    this.currentProduct.quantity_repo = this.currencyFormat(properties_str.replaceAll(properties_input_str, ""))
                }
            }
        }

      }
    },

    changeBrandInput() {
      if(this.currentProduct.brand_id_input) {
        for(let brand of this.productBrandOptions) {
          if(brand.value == this.currentProduct.brand_id_input) {
            this.currentProduct.brand_name_input = brand.text
            return
          }
        }
      } else {
        this.currentProduct.brand_name_input = null
      }
    },

    changeUnitInput() {
      if(this.currentProduct.unit_id_input) {
        for(let unit of this.unitOptions) {
          if(unit.value == this.currentProduct.unit_id_input) {
            this.currentProduct.unit_name_input = unit.text
            return
          }
        }
      } else {
        this.currentProduct.unit_name_input = null
      }
    },

  /**
     *  Event change product
     */
    changeProduct() {
      if(this.productSelect && this.productSelect.id) {
        this.currentProduct.product_id = this.productSelect.id

          // Call api: get product info detail
          this.loadProductDetail = true
          quotationApi.getProductDetail(this.productSelect.id).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              let product = res.data.data

              this.currentProduct.product_group_id = product.product_group_id
              this.currentProduct.product_type_id = product.product_type_id
              this.currentProduct.product_name = product.name
              this.currentProduct.product_code = product.code
              this.currentProduct.have_resource = product.have_resource

              let price_list = product.price_list
              if (!price_list) {
                price_list = 0
              }

              let discount = product.discount
              if(!discount) {
                  discount = 0
              }
              this.currentProduct.price_list = this.currencyFormat(price_list)
              this.currentProduct.discount = discount
              if(product.price_buy) {
                this.currentProduct.price = this.currencyFormat(product.price_buy)
              } else {
                let price = parseInt(parseInt(price_list) * (100 - parseFloat(discount)) / 100)
                this.currentProduct.price = this.currencyFormat(price)
              }

              if(product.price_sell) {
                this.currentProduct.price_sell = this.currencyFormat(product.price_sell)
              } else {
                this.currentProduct.price_sell = JSON.parse(JSON.stringify(this.currentProduct.price))
              }
              this.currentProduct.quantity_repo = this.currencyFormat(product.quantity_repo)
              this.currentProduct.properties = product.properties
              this.currentProduct.unit_name = product.unit_name
              this.currentProduct.unit_id = product.unit_id
              this.currentProduct.brand_name = product.brand_name
              this.currentProduct.brand_id = product.brand_id

            }
            this.loadProductDetail = false
          }).catch(err => {
            this.loadProductDetail = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })

      } else {
        this.refreshCurrentProduct()
      }

      // Kiểm tra SP này có nhiều đơn vị hay ko
      setTimeout(() => {
        this.checkMultipleUnit();
      }, 500);

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
              this.store_tax_code = store.phone_number

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


      selectProduct(item) {
        if(item) {
            this.currentProduct.product_id = item.id
          this.currentProduct.product_code = item.code
          this.currentProduct.product_name = item.name
            this.changeProduct()
        } else {
            this.currentProduct.product_id = null
        }
      },

      /**
     *  Event change quotation
     */
    changeQuotation() {
        if(this.quotationSelect && this.quotationSelect.id) {
          // Call api, get quotation detail
            this.getOrderSellDetailByQuotationId(this.quotationSelect.id)
        }
    },

    /**
     *  Event change customer
     */
    changeCustomer() {
        if(this.customerSelect && this.customerSelect.id) {
          this.trade.customer_id = this.customerSelect.id
          this.trade.customer_name = this.customerSelect.name

          // Call api: get user info detail
          this.loadCusDetail = true
          orderSellApi.getCustomerDetail(this.customerSelect.id).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              let customer = res.data.data
              this.currentCustomer = JSON.parse(JSON.stringify(customer))

              this.trade.customer_address = customer.address
              this.trade.customer_tax_code = customer.tax_code
              this.trade.receiver_name = customer.contact_person_name
              this.trade.receiver_phone = customer.contact_person_phone
              this.trade.receiver_address = customer.shipping_person_address
              this.trade.customer_email = customer.email
            }
            this.loadCusDetail = false
          }).catch(err => {
            this.loadCusDetail = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        } else {
          this.refreshCustomerInfo()
        }
    },

    refreshCustomerInfo() {
      this.trade.customer_id = null
      this.trade.customer_name = null
      this.trade.customer_address = null
      this.trade.customer_tax_code = null
      this.trade.receiver_name = null
      this.trade.receiver_phone = null
      this.trade.receiver_address = null
      this.trade.customer_email = null
    },

    /**
     *  Get quotation options
     */
    getQuotationOption() {

      orderSellApi.getQuotationOption(this.userRole).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.quotationOptions = res.data.data;

          let itemEmpty = {"id": null, "name": null}
          this.quotationOptions.unshift(itemEmpty)

          this.getQuotationItemById(this.trade.quotation_id)
        }
      })
    },

    /**
     * Refresh current product
     */
    refreshCurrentProduct() {
      this.currentProduct.index = -1
      this.currentProduct.product_id = null
      this.currentProduct.product_code = null
      this.currentProduct.product_code_input = null
      this.currentProduct.product_name = null
      this.currentProduct.product_name_input = null
      this.currentProduct.unit_id = null
      this.currentProduct.unit_name = null
      this.currentProduct.unit_id_input = null
      this.currentProduct.unit_name_input = null
      this.currentProduct.brand_id = null
      this.currentProduct.brand_name = null
      this.currentProduct.brand_id_input = null
      this.currentProduct.brand_name_input = null
      this.currentProduct.price_list = null
      this.currentProduct.discount = null
      this.currentProduct.price = null
      this.currentProduct.discount_sale = null
      this.currentProduct.profit_on_item = null
      this.currentProduct.amount = null
      this.currentProduct.price_sell = null
      this.currentProduct.amount_sell = null
      this.currentProduct.profit = null
      this.currentProduct.quantity_repo = null
      this.currentProduct.quantity = null
      this.currentProduct.is_available_in_repo = null
      this.currentProduct.properties = []
      this.currentProduct.note = null
      this.currentProduct.target_unit_id = null
      this.currentProduct.target_unit_name = null
      this.currentProduct.conversion_value = null
      this.currentProduct.quantity_root = null
    },

    refreshTradeInfo() {
      this.trade = {
        "id": null,
        "status": -1,
        "type": 0,
        "quotation_id": null,
        "issue_invoice": null,
        "customer_id": null,
        "customer_name": null,
        "customer_tax_code": null,
        "customer_address": null,
        "customer_email": null,
        "sub_total": 0,
        "extra_fee": null,
        "fixed_discount": null,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "profit": 0,
        "bank_account_id": null,
        "payment_method": null,
        "payment_method_input": null,
        "shipping_agreement": null,
        "shipping_fee": 0,
        "quotation_expiry_date": 3,
        "staff_in_charge": null,
        "staff_in_charge_name": null,
        "staff_in_charge_phone": null,
        "staff_in_charge_email": null,
        "staff_in_charge_position": null,
        "description": null,
        "products": [],
        "receiver_name": null,
        "receiver_phone": null,
        "receiver_address": null,
        "shipping_date": null,
        "shipping_note": null
      }
    },

    /**
     * Tính toán thành tiền sản phẩm
     */
    calculateAmount(keyInput) {
      var amount = 0
        // let total_profit_margin = 0
        let total_profit = 0
      for (let i in this.trade.products) {
        amount += Math.round((this.trade.products[i].price_sell + '').replaceAll(",", "") * (this.trade.products[i].quantity + '').replaceAll(",", ""))
          // total_profit_margin += parseFloat(this.trade.products[i].profit_margin)
          total_profit += parseInt(this.trade.products[i].profit)
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
                vat_value = Math.round((amount + parseInt(extra_fee) - parseInt(fixed_discount)) * this.trade.vat_percent / 100)
                this.trade.vat_value = this.currencyFormat(vat_value)
            } else {
                this.trade.vat_value = 0
            }
        } else {
            this.trade.vat_value = 0
        }

      this.trade.profit = this.currencyFormat(total_profit - fixed_discount)
      // this.trade.profit_margin = total_profit_margin
      this.trade.total = this.currencyFormat(amount + parseInt(extra_fee) - parseInt(fixed_discount) + vat_value)

      // Check reload bank account
        if(keyInput == "vat") {
            this.handleBankAccount()
        }
    },

      getCurrentBankAccountType() {
        if(this.trade.bank_account_id) {
            for (let i in this.bankAccountOptionStore) {
                if(this.bankAccountOptionStore[i].id == this.trade.bank_account_id) {
                    return this.bankAccountOptionStore[i].type
                }
            }
        }
        return null
      },

    handleBankAccount() {
      // Check bank account isvalid
      let currentBankAccountType =  this.getCurrentBankAccountType()
      if(this.trade.have_vat) {
        if(currentBankAccountType != 1) {
          this.trade.bank_account_id = null
          let firstItemId = null
          for (let i in this.bankAccountOptionStore) {
            if(this.bankAccountOptionStore[i].type == 1) {
              firstItemId = this.bankAccountOptionStore[i].id
              if(this.bankAccountOptionStore[i].is_default) {
                this.trade.bank_account_id = this.bankAccountOptionStore[i].id
              }
            }
          }
          if(!this.trade.bank_account_id) {
            this.trade.bank_account_id = firstItemId
          }
        }
      } else {
        if(currentBankAccountType != 0) {
          this.trade.bank_account_id = null
          let firstItemId = null
          if(this.bankAccountOptionStore.length > 0) {
            firstItemId = this.bankAccountOptionStore[0].id
          }
          for (let i in this.bankAccountOptionStore) {
            if(this.bankAccountOptionStore[i].type == 0) {
              firstItemId = this.bankAccountOptionStore[i].id
              if(this.bankAccountOptionStore[i].is_default) {
                this.trade.bank_account_id = this.bankAccountOptionStore[i].id
              }
            }
          }
          if(!this.trade.bank_account_id) {
            this.trade.bank_account_id = firstItemId
          }
        }
      }
      this.changeBankAccount()

    },

    /**
     *  Xác nhận sản phẩm
     */
    confirmBuyProduct() {
      // Check product group
      if (!this.currentProduct.product_group_id) {
        // this.popToast('danger', "Vui lòng chọn nhóm sản phẩm")
        // return
          this.currentProduct.product_group_id = null
        this.currentProduct.product_group_name = null
      }

      // Check product type
      if (!this.currentProduct.product_type_id) {
        // this.popToast('danger', "Vui lòng chọn loại sản phẩm")
        // return
          this.currentProduct.product_type_id = null
        this.currentProduct.product_type_name = null
      }

      // Check product
      if (!this.currentProduct.product_id) {
          this.currentProduct.product_id = null
        this.currentProduct.product_code = null
        this.currentProduct.product_name = null
          if(!this.currentProduct.product_name_input) {
              this.popToast('danger', "Vui lòng chọn hoặc nhập tạm tên sản phẩm")
              return
          }
      }

      // Check price buy
      if (this.currentProduct.price == null || this.currentProduct.price == '') {
        this.popToast('danger', "Vui lòng nhập giá bán sản phẩm")
        return
      }

      // Check quantity
      if (this.currentProduct.quantity == null || this.currentProduct.quantity == '') {
        this.popToast('danger', "Vui lòng nhập số lượng sản phẩm bán")
        return
      }

      // Check quantity bán và số lượng trong kho
        let quantity_repo = (this.currentProduct.quantity_repo + "").replaceAll(",", "")
      if (parseFloat(this.currentProduct.quantity) > parseFloat(quantity_repo)) {
        // this.popToast('danger', "Không thể bán số lượng lớn hơn số lượng đang có trong kho")
        // return
        // TODO: thêm thuộc tính báo sản phẩm đang có trong kho hay ko

      }
      this.currentProduct.price_list = (this.currentProduct.price_list + "").replaceAll(",", "")
      this.currentProduct.price = (this.currentProduct.price + "").replaceAll(",", "")
        if(!this.currentProduct.profit_on_item) {
            this.currentProduct.profit_on_item = 0
        } else {
            this.currentProduct.profit_on_item = (this.currentProduct.profit_on_item + "").replaceAll(",", "")
        }


      this.currentProduct.quantity = (this.currentProduct.quantity + "").replaceAll(",", "")
      this.currentProduct.amount = parseInt(this.currentProduct.price * this.currentProduct.quantity)

      if(!this.currentProduct.price_sell) {
          this.currentProduct.price_sell = this.currentProduct.price
      }
      if(!this.currentProduct.discount_sale) {
          this.currentProduct.discount_sale = 0
      }
      this.currentProduct.price_sell = (this.currentProduct.price_sell + "").replaceAll(",", "")
      this.currentProduct.profit = (this.currentProduct.profit + "").replaceAll(",", "")
      this.currentProduct.amount_sell = parseInt(this.currentProduct.price_sell * this.currentProduct.quantity)


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

        console.log("xx:" + JSON.stringify(this.currentProduct))
      if(this.currentProduct.index == -1) {
        // Thêm mới product
        this.currentProduct.index = this.trade.products.length
        this.trade.products.push(JSON.parse(JSON.stringify(this.currentProduct)))
      } else {
        // Cập nhật product
        this.trade.products[this.currentProduct.index] = JSON.parse(JSON.stringify(this.currentProduct))
      }

        console.log("xx:" + JSON.stringify(this.trade.products))

      // Tính toán amount
      this.calculateAmount()

        console.log("xx:" + JSON.stringify(this.trade.products))

      // TODO: làm sau: Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
      //   if(this.currentProduct.product_id){
      //       this.updateQuantityRepo(JSON.parse(JSON.stringify(this.currentProduct.product_id)), JSON.parse(JSON.stringify(this.currentProduct.quantity)), properties, 'sell')
      //   }
        console.log("xx:" + JSON.stringify(this.trade.products))


      // Refresh current product
      this.refreshCurrentProduct()

        this.handleProductExcel()

        console.log("xx:" + JSON.stringify(this.trade.products))

      // Lưu nháp
      if(this.trade.id) {
        this.updateDraft()
      } else {
        this.saveDraft()
      }

      console.log("xx:" + JSON.stringify(this.trade.products))

    },

      propertiesToString(properties) {
        let result = ""
        for(let i in properties) {
            result += properties[i].value
        }
        return result
      },

    /**
     * Cập nhật số lượng sản phẩm tại client khi mua sản phẩm
     */
    updateQuantityRepo(product_id, quantitySell, properties, type) {
      for (let i in this.productOptions) {
        if(product_id == this.productOptions[i].id) {
          if(type == 'sell') {
            this.productOptions[i].quantity = parseFloat(this.productOptions[i].quantity) - parseFloat(quantitySell)
          }
          if(type == 'delete') {
            this.productOptions[i].quantity = parseFloat(this.productOptions[i].quantity) + parseFloat(quantitySell)
          }

          // Update quantity cả trong thuộc tính
          if(this.productOptions[i].properties.length > 0) {
            for(let j in this.productOptions[i].properties) {
              let properties_str = this.propertiesToString(this.productOptions[i].properties[j])
              let properties_input_str = this.propertiesToString(properties)

              if(properties_str.includes(properties_input_str)) {
                for(let x in this.productOptions[i].properties[j]) {
                  if(this.productOptions[i].properties[j][x].name == "quantity") {
                    if(type == 'sell') {
                      this.productOptions[i].properties[j][x].value = parseFloat(this.productOptions[i].properties[j][x].value) - parseFloat(quantitySell)
                    }
                    if(type == 'delete') {
                      this.productOptions[i].properties[j][x].value = parseFloat(this.productOptions[i].properties[j][x].value) + parseFloat(quantitySell)
                    }
                  }
                }
              }
            }
          }
        }
      }

    },

    /**
     *  Save
     */
    saveDraft () {
      // Reformat data
      let data = JSON.parse(JSON.stringify(this.trade))
        if(!data.customer_id) {
            data.customer_id = null
        }
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

      data.shipping_fee = (data.shipping_fee + '').replaceAll(",", "")
      data.profit = (data.profit + '').replaceAll(",", "")
      data.total = (data.total + '').replaceAll(",", "")

      // Check products
      if(data.products.length == 0) {
        return
      } else {
          data.products = this.formatProduct(data.products)
        }

      orderSellApi.saveDraftOrderSell(data).then(res => {
        if(res != null && res.data != null){

          if (res.data.status == 200) {
              this.popToast('success', "Lưu nháp thành công!")
            let response = res.data.data
            this.trade.id = response.order_sell_id
            this.trade.order_sell_number = response.order_sell_number
              this.trade.staff_in_charge_name = response.staff_in_charge_name
              this.trade.staff_in_charge_phone = response.staff_in_charge_phone
              this.trade.staff_in_charge_email = response.staff_in_charge_email
              this.trade.staff_in_charge_position = response.staff_in_charge_position

          }
        }
      }).catch(err => {})
    },

    changeStaffInChange() {
      if(this.trade.staff_in_charge) {
        for(let i in this.optionsStaffStore) {
          if(this.optionsStaffStore[i].id == this.trade.staff_in_charge) {
            this.trade.staff_in_charge_name = this.optionsStaffStore[i].name
            this.trade.staff_in_charge_phone = this.optionsStaffStore[i].phone_number
            this.trade.staff_in_charge_email = this.optionsStaffStore[i].email
            this.trade.staff_in_charge_position = this.optionsStaffStore[i].position
          }
        }
      } else {
        this.trade.staff_in_charge_name = null
        this.trade.staff_in_charge_phone = null
        this.trade.staff_in_charge_email = null
        this.trade.staff_in_charge_position = null
      }
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
        if(!data.customer_id) {
            data.customer_id = null
        }

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
        data.profit = (data.profit + '').replaceAll(",", "")
      data.total = (data.total + '').replaceAll(",", "")
        data.vat_value = (data.vat_value + '').replaceAll(",", "")
        data.shipping_fee = (data.shipping_fee + '').replaceAll(",", "")

      // Check products
      if(data.products.length == 0) {
        return
      } else {
          data.products = this.formatProduct(data.products)
        }

      orderSellApi.updateDraftOrderSell(data).then(res => {
        if(res != null && res.data != null){
          if (res.data.status == 200) {
              this.popToast('success', "Lưu nháp thành công!")
          }
        }
      }).catch(err => {})
    },

    checkUpdateDraft() {
      if(this.saveSuccess == false) {
        this.updateDraft()
      }
    },

    formatProductItem(product) {
      product.price_list = (product.price_list + '').replaceAll(",", "")
      product.price = (product.price + '').replaceAll(",", "")
      product.profit_on_item = (product.profit_on_item + '').replaceAll(",", "")
      product.price_sell = (product.price_sell + '').replaceAll(",", "")
      product.quantity = (product.quantity + '').replaceAll(",", "")
      product.amount = (product.amount + '').replaceAll(",", "")
      if(product.amount == "" || product.amount == "null" || product.amount == "NaN") {
          product.amount = 0
      }
      product.amount_sell = (product.amount_sell + '').replaceAll(",", "")
      if(product.amount_sell == "" || product.amount_sell == "null" || product.amount_sell == "NaN") {
          product.amount_sell = 0
      }
      product.profit = (product.profit + '').replaceAll(",", "")

      if(product.conversion_value) {
        product.quantity_root = parseFloat(product.quantity) / parseFloat(product.conversion_value)
      }
      console.log("formatProductItem")
      console.log(product)
      console.log("formatProductItem")

      return product
    },

      formatProduct(products) {
        for(let product of products) {
          product = this.formatProductItem(product)
        }
        return products
    },

    /**
     *  Save
     */
    save () {
        // Reformat data
        let data = JSON.parse(JSON.stringify(this.trade))

        // validate
        // Check products
        if(data.products.length == 0) {
            this.popToast('danger', "Chưa có sản phẩm nào được chọn")
            return
        } else {
          data.products = this.formatProduct(data.products)
        }

      if(data.issue_invoice == null) {
        this.popToast('danger', "Vui lòng chọn mục [Xuất hóa đơn]")
        return
      }

      if(data.issue_invoice == 'true') {
        if(!data.customer_name || !data.customer_tax_code || !data.customer_address || !data.customer_email) {
          this.popToast('danger', "Vui lòng nhập đủ thông tin khách hàng")
          return
        }
      }

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
        data.profit = (data.profit + '').replaceAll(",", "")
        data.shipping_fee = (data.shipping_fee + '').replaceAll(",", "")


        this.saving = true

      orderSellApi.saveOrderSell(data).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
                // Kiểm tra tình trạng kho, xác nhận có muốn giữ hàng ko
                this.repo_keep = res.data.data
                if(this.repo_keep.products.length > 0) {
                    // Show modal giữ hàng
                    this.repo_products = this.repo_keep.products
                    this.showModalRepoKeep()
                } else {
                    this.back()
                }
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
     * Back to list
     */
    back() {
      // Go to list
      console.log("this.userRole: " + this.userRole)
      if(this.userRole == "staff") {
          this.$router.push("/order-sell-staff")
      } else {
          this.$router.push("/order-sell-all")
      }
    },

    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

      changeCurrencyField(key) {
          this.trade.shipping_fee = commonFunc.intergerOnly(this.trade.shipping_fee)
          this.trade.shipping_fee = parseInt(this.trade.shipping_fee)
        this.trade.shipping_fee = this.currencyFormat(this.trade.shipping_fee + "")
      },

      calculateCurrentProduct(key) {
        let price_list = parseInt((this.currentProduct.price_list + "").replaceAll(",", ""))
        let discount = (this.currentProduct.discount + "").replaceAll(",", "")
        let price_buy = (this.currentProduct.price + "").replaceAll(",", "")
        let discount_sale = (this.currentProduct.discount_sale + "").replaceAll(",", "")
        let profit_on_item = (this.currentProduct.profit_on_item + "").replaceAll(",", "")
        let price_sell = (this.currentProduct.price_sell + "").replaceAll(",", "")
        let quantity = (this.currentProduct.quantity + "").replaceAll(",", "")

        if(key == 'price_list' || key == 'discount') {
          if(price_list && discount) {
            discount = Math.round(discount * 100) / 100
            price_buy = Math.round(price_list * (100 - discount) / 100)
            this.currentProduct.price = this.currencyFormat(price_buy)

             if(discount_sale) {
                 discount_sale = Math.round(discount_sale * 100) / 100
                  profit_on_item = Math.round(price_list * discount_sale / 100)
                  this.currentProduct.profit_on_item = this.currencyFormat(profit_on_item)

                  price_sell = profit_on_item + parseInt(price_buy)
                  this.currentProduct.price_sell = this.currencyFormat(price_sell)
             }
             if (price_buy && price_sell && quantity) {
                this.currentProduct.amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
                this.currentProduct.profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
              }

          }
          this.currentProduct.price_list = this.currencyFormat(price_list)
        }

        if(key == 'price') {
          if(!price_list) {
            this.currentProduct.price_list = this.currencyFormat(price_buy)
            this.currentProduct.discount = 0
          } else {
            if(this.currentProduct.discount == 0) {
              this.currentProduct.price_list = this.currencyFormat(price_buy)
            } else {
              this.currentProduct.discount = Math.round((((price_list - price_buy) / price_list) * 100) * 100) / 100
            }
          }
          this.currentProduct.price = this.currencyFormat(price_buy)

            if(profit_on_item) {
                price_sell = parseInt(price_buy) + parseInt(profit_on_item)
                this.currentProduct.price_sell = this.currencyFormat(price_sell)
            }

          if (price_buy && price_sell && quantity) {
            this.currentProduct.amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
            this.currentProduct.profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
          }
        }

        if(key == 'discount_sale') {
          if(price_buy) {
            discount_sale = Math.round(discount_sale * 100) / 100
            profit_on_item = Math.round(price_list * discount_sale / 100)
            this.currentProduct.profit_on_item = this.currencyFormat(profit_on_item)
            this.currentProduct.price_sell = this.currencyFormat(profit_on_item + parseInt(price_buy))

              if(quantity && quantity != 'null') {
                this.currentProduct.amount_sell = this.currencyFormat(Math.round(profit_on_item + parseInt(price_buy) * quantity))
                this.currentProduct.profit = this.currencyFormat(Math.round(profit_on_item * quantity))
              }

          }
        }

        if(key == 'profit_on_item') {
          if(price_list) {
            let discount_sale_temp = Math.round(((profit_on_item / price_list) * 100) * 100) / 100
            this.currentProduct.discount_sale = discount_sale_temp
            this.currentProduct.profit_on_item = this.currencyFormat(profit_on_item)
            this.currentProduct.price_sell = this.currencyFormat(parseInt(profit_on_item) + parseInt(price_buy))
          }
        }

        if(key == 'price_sell') {
          this.currentProduct.price_sell = this.currencyFormat(price_sell)

          if (price_sell && quantity) {
            this.currentProduct.amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
          }

          if (price_buy && price_sell && quantity) {
            this.currentProduct.profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
          }
        }

        if(key == 'quantity') {
          // Calculate profit
          if (price_buy && price_sell && quantity) {
            this.currentProduct.amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
            this.currentProduct.profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
          }
        }

      },

      changeBankAccount() {
        if(this.trade.bank_account_id) {
            for (let i in this.bankAccountOptionStore) {
                if(this.bankAccountOptionStore[i].id == this.trade.bank_account_id) {
                    this.bankAccountSelected.account_name = this.bankAccountOptionStore[i].account_name
                    this.bankAccountSelected.account_number = this.bankAccountOptionStore[i].account_number
                    this.bankAccountSelected.bank_name = this.bankAccountOptionStore[i].bank_name
                }
            }
        } else {
            this.bankAccountSelected.account_name = ""
            this.bankAccountSelected.account_number = ""
            this.bankAccountSelected.bank_name = ""
        }
      },

    changeProjectQuantity(item_index) {
      let project_name = document.getElementById("project_name_" + item_index).value
      let project_quantity = document.getElementById("project_quantity_" + item_index).value
      if(!project_quantity || project_quantity == 0) {
        this.popToast('danger', 'Số lượng dự án không thể bằng 0 hoặc để trống')
        return
      }
      project_quantity = parseFloat((project_quantity + '').replaceAll(",", ""))

      for(let product of this.trade.products) {
        if(product['project_name'] == project_name) {
          product['project_quantity'] = project_quantity
         let product_quantity = project_quantity * parseFloat(product['quantity'])
          product['quantity'] = product_quantity
          let price_sell = parseInt((product['price_sell'] + '').replaceAll(",", ""))
          product['amount_sell'] = price_sell * product_quantity
        }
      }
      this.handleListProduct()
    },

    changeProjectName(item_index, project_index=0) {
      let index = 1
        if (item_index > 0) {
            index = item_index - parseInt(project_index) + 1
        }
      let old_project_name = this.trade.products[index].project_name
      let new_project_name = document.getElementById("project_name_" + item_index).value

      for(let product of this.trade.products) {
        if(product['project_name'] == old_project_name) {
          product['project_name'] = new_project_name
        }
      }
      this.handleListProduct()
    },

    changeProductItem(key, index_item, project_index = 0, product_index = 0) {
        let index_item_str = index_item
        if(project_index) {
          index_item_str = 'project_' + index_item
        }

        let price_list = document.getElementById("price_list_" + index_item_str).value
        if(price_list) {
          price_list = parseInt((price_list + "").replaceAll(",", ""))
        } else {
          price_list = 0
        }

        let discount = document.getElementById("discount_" + index_item_str).value
        if(discount) {
          discount = (discount + "").replaceAll(",", "")
        } else {
          discount = 0
        }

        let price_buy = document.getElementById("price_" + index_item_str).value
        if(price_buy) {
          price_buy = parseInt((price_buy + "").replaceAll(",", ""))
        } else {
          price_buy = 0
        }

        let discount_sale = document.getElementById("discount_sale_" + index_item_str).value
        if(discount_sale) {
          discount_sale = (discount_sale + "").replaceAll(",", "")
        } else {
          discount_sale = 0
        }

        let profit_on_item = document.getElementById("profit_on_item_" + index_item_str).value
        if(profit_on_item) {
          profit_on_item = parseInt((profit_on_item + "").replaceAll(",", ""))
        } else {
          profit_on_item = 0
        }

        let price_sell = document.getElementById("price_sell_" + index_item_str).value
        if(price_sell) {
          price_sell = parseInt((price_sell + "").replaceAll(",", ""))
        } else {
          price_sell = 0
        }

        let quantity = document.getElementById("quantity_" + index_item_str).value
        if(quantity) {
          quantity = (quantity + "").replaceAll(",", "")
        } else {
          quantity = 0
        }

        if (!price_list) {
            discount = 0
        }
        let discount_temp = discount_sale
        // if(discount_temp == 0) {
        //   discount_temp = discount_original_price
        // }

        let index = index_item - parseInt(project_index)
        // if(product_index) {
        //   index = product_index - 1
        // }

        if(key == 'price_list' || key == 'discount') {
          if(price_list && discount) {
            discount = Math.round(discount * 100) / 100
            price_buy = Math.round(price_list * (100 - discount) / 100)
            this.trade.products[index].price = this.currencyFormat(price_buy)

             discount_temp = Math.round(discount_temp * 100) / 100
              profit_on_item = Math.round(price_list * discount_temp / 100)
              this.trade.products[index].profit_on_item = this.currencyFormat(profit_on_item)

              price_sell = profit_on_item + parseInt(price_buy)
              this.trade.products[index].price_sell = this.currencyFormat(price_sell)

             if (price_buy && price_sell && quantity) {
                this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
                this.trade.products[index].profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
              }
          }
          this.trade.products[index].price_list = this.currencyFormat(price_list)
          this.trade.products[index].discount = discount
        }

        if(key == 'price') {
          if(!price_list) {
            this.trade.products[index].price_list = this.currencyFormat(price_buy)
            this.trade.products[index].discount = 0
          } else {
            if(discount == 0) {
              this.trade.products[index].price_list = this.currencyFormat(price_buy)
            } else {
              this.trade.products[index].discount = Math.round((((price_list - price_buy) / price_list) * 100) * 100) / 100
            }
          }
          this.trade.products[index].price = this.currencyFormat(price_buy)

            if(profit_on_item) {
                price_sell = profit_on_item + parseInt(price_buy)
                this.trade.products[index].price_sell = this.currencyFormat(price_sell)
            }

          if (price_buy && price_sell && quantity) {
            this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
            this.trade.products[index].profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
          }
        }

        if(key == 'discount_sale') {
          if(price_buy) {
            discount_temp = document.getElementById("discount_sale_" + index).value
            discount_temp = (discount_temp + "").replaceAll(",", "")
            profit_on_item = Math.round(price_list * discount_temp / 100)
            this.trade.products[index].profit_on_item = this.currencyFormat(profit_on_item)
              price_sell = profit_on_item + parseInt(price_buy)
              this.trade.products[index].price_sell = this.currencyFormat(price_sell)

            if(price_sell != '' && price_sell != 'null' && quantity != '' && quantity != 'null') {
              this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
              this.trade.products[index].profit = this.currencyFormat(Math.round(profit_on_item * quantity))
            }
          }
          if(discount_sale) {
            // this.trade.products[index].discount_original_price = 0
            this.trade.products[index].discount_sale = discount_sale
          }
        }

        if(key == 'profit_on_item') {
          if(price_list) {
            let discount_sale_temp = Math.round(((profit_on_item / price_list) * 100) * 100) / 100
            this.trade.products[index].discount_sale = discount_sale_temp
            // this.trade.products[index].discount_original_price = 0
            this.trade.products[index].profit_on_item = this.currencyFormat(profit_on_item)
              price_sell = parseInt(profit_on_item) + parseInt(price_buy)
              this.trade.products[index].price_sell = this.currencyFormat(price_sell)

            if(price_sell != '' && price_sell != 'null' && quantity != '' && quantity != 'null') {
              this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
              this.trade.products[index].profit = this.currencyFormat(Math.round(profit_on_item * quantity))
            }
          } else {
            if(price_buy) {
              let discount_sale_temp = Math.round(((profit_on_item / price_buy) * 100) * 100) / 100
              // this.trade.products[index].discount_original_price = discount_sale_temp
              this.trade.products[index].discount_sale = 0
              this.trade.products[index].profit_on_item = this.currencyFormat(profit_on_item)
                price_sell = parseInt(profit_on_item) + parseInt(price_buy)
                this.trade.products[index].price_sell = this.currencyFormat(price_sell)

              if(price_sell != '' && price_sell != 'null' && quantity != '' && quantity != 'null') {
                this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
                this.trade.products[index].profit = this.currencyFormat(Math.round(profit_on_item * quantity))
              }
            }
          }

        }

        if(key == 'price_sell') {
          this.trade.products[index].price_sell = this.currencyFormat(price_sell)

          if (price_sell && quantity) {
            this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
          }

          if (price_buy && price_sell && quantity) {
            this.trade.products[index].profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
          }
        }

        if(key == 'quantity') {
          // Calculate profit
          // if (price_buy && price_sell && quantity) {
            this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
            this.trade.products[index].profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
            this.trade.products[index].quantity = this.currencyFormat(quantity)
          // }
        }

        // this.fortmatProductItem(index)

        // Tính toán amount
        this.calculateAmount()

        this.handleProductExcel()

        // Lưu nháp
        if(this.trade.id) {
          this.updateDraft()
        } else {
          this.saveDraft()
        }

        // Nếu là dự án, cần handle lại list sản phẩm
        if(project_index) {
          this.handleListProduct()
        }

      },

      deleteProductByProjectName(project_name) {
        let products = []
        for (let product of this.trade.products) {
          if(product.project_name != project_name) {
            products.push(product)
          }
        }
        this.trade.products = products
      },

      deleteProduct(ind, product_type, project_name, product_id, quantity, properties, project_index=0) {
        ind = ind - parseInt(project_index)

        // Remove item
        if(product_type == 0) {
          this.deleteProductByProjectName(project_name)
        } else {
          this.trade.products.splice(parseInt(ind), 1) // Xoá sp
        }

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

        // Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
        this.updateQuantityRepo(product_id, quantity, properties, 'delete')

          this.handleProductExcel()
      },

      deleteTrade(trade_id) {
        quotationApi.deleteQuotation(trade_id).then(res => {
        }).catch(err => {
        })
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
        num = (num + "").replace(",", "")
      if(num) {
        result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

      convertNumberToText(number) {
        let input = (number + '').replaceAll("," ,"")
        return commonFunc.convert_number_to_text(input)
      },

      /**
     * Only input float
     */
    integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
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

    openModalChooseMultipleUnit() {
      this.$bvModal.show('modal-choose-multiple-unit')
    },

    hideModalChooseMultipleUnit() {
      this.$bvModal.hide('modal-choose-multiple-unit')
    },

    chooseUnit() {
      // Nếu chọn phải đơn vị gốc thì show cảnh báo
      if(this.current_unit == this.multipleUnitsOption[0].value) {
        this.popToast('danger', "Vui lòng chọn đơn vị chuyển đổi khác đơn vị gốc!")
        return
      }
      for(let item of this.multipleUnitsOptionStore) {
        if(item.target_unit_id == this.current_unit && this.currentProduct.product_id == item.product_id) {
          this.currentProduct.target_unit_id = item.target_unit_id
          this.currentProduct.target_unit_name = item.target_unit_name
          this.currentProduct.conversion_value = item.conversion_value
          if(item.price) {
            this.currentProduct.price_sell = this.currencyFormat(item.price)
          }
          this.hideModalChooseMultipleUnit()
          break
        }
      }
    },

    handleUnitName() {
      if(this.currentProduct.target_unit_name) {
        return '(ĐV: ' + this.currentProduct.target_unit_name + ')'
      }
      if(this.currentProduct.unit_name) {
        return '(ĐV: ' + this.currentProduct.unit_name + ')'
      }
      if(this.currentProduct.unit_name_input) {
        return '(ĐV: ' + this.currentProduct.unit_name_input + ')'
      }
      return ''
    },

    showModalRepoKeep() {
      this.$bvModal.show('modal-repo-keep')
    },

    hideModalRepoKeep() {
      this.back()
      this.$bvModal.hide('modal-repo-keep')
    },

    confirmRepoKeep() {
      this.saving = true
      orderSellApi.keepProductOnRepo(this.repo_keep).then(res => {
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
  }
}
</script>

<style lang="scss" scoped>

  .title-partner {
    border-radius: 5px 5px;
    padding: 5px;

  }

  .project_bg {
    background-color: #6A9AB0 !important;
  }
</style>
