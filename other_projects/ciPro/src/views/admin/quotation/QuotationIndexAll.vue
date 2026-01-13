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
                <h4 class="mt-1 text-center text-header">{{prefix_title}} Báo Giá</h4>
              </b-col>
            </b-row>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

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
                        <label>
                          Tên khách hàng<span class="error-sybol"></span>
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
                      <b-col md="4" class="mt-2">
                        <label>
                          Tên người liên hệ<span class="error-sybol"></span>
                        </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="contact_person_name"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.contact_person_name"
                          :disabled="saving">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>
                          <span>SĐT khách hàng</span>
                        </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="customer_phone"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.customer_phone"
                          :disabled="saving"
                          @keyup="integerOnly($event.target)">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>
                          Sđt người liên hệ<span class="error-sybol"></span>
                        </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="contact_person_phone"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.contact_person_phone"
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
                          <span>Địa chỉ khách hàng</span>
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
                      <b-col md="4" class="mt-2">
                        <label>Loại CTY<span class="error-sybol"></span>
                        </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select :options="optionsCompanyType"
                         v-model="trade.customer_company_type_id"
                        ></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Email K.H</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="customer_email"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.customer_email"
                          :disabled="saving">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Tình trạng K.H<span class="error-sybol"></span></label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select :options="customerStatusOptions" v-model="trade.customer_status" disabled></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row v-show="trade.customer_id">
                  <b-col>
                    <p>
                      Số lượng đơn hàng: <b>{{ currencyFormat(currentCustomer.number_order_sell || 0) }}</b> | Tổng doanh số mua hàng: <b>{{ currencyFormat(currentCustomer.order_sell_amount || 0) }}</b>
                    </p>
                  </b-col>
                </b-row>

              </b-col>
            </b-row>


            <b-row class="mt-3" id="productInfoArea">
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

                <b-row v-show="trade.type == 1" class="form-row mt-2">
                  <b-col md="2" class="mt-2">
                    <label>
                      <span>Dự án</span>
                    </label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                      <div class="input-group">
                        <input type="radio" v-model="currentProduct.project_type" name="project_type"
                               value="0" @change="changeProjectType"  id="project_type_0">
                        <label class="ml-4 mt-1" for="project_type_0">Dự án mới</label>
                        <input type="radio" v-model="currentProduct.project_type" name="project_type"
                               value="1" class="ml-5" @change="changeProjectType" id="project_type_1">
                        <label class="ml-4 mt-1" for="project_type_1">Dự án mẫu</label>
                      </div>
                  </b-col>
                </b-row>

                <b-row v-show="trade.type == 1 && currentProduct.project_type == 0">
                    <b-col md="2" class="mt-2">
                      <label>Tên dự án<span class="error-sybol"></span></label>
                    </b-col>
                    <b-col md="10" class="mt-2">
                      <input
                        id="project_name"
                        type="text"
                        maxlength="255"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="currentProduct.project_name">
                    </b-col>
                </b-row>

                <b-row v-show="trade.type == 1 && currentProduct.project_type == 0">
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Hãng dự án</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select
                        :options="productBrandOptions"
                        id="project_brand_id"
                        type="text"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="currentProduct.project_brand_id"
                        placeholder="--Chọn hãng dự án--"
                        @change="changeProjectBrand"></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Đơn vị dự án</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <b-form-select
                      :options="unitOptions"
                      id="project_unit_id"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.project_unit_id"
                      placeholder="--Chọn Đơn vị dự án--"
                      @change="changeProjectUnit"></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row v-show="trade.type == 1 && currentProduct.project_type == 1">
                  <b-col md="2" class="mt-2">
                    <label>
                      <span>Dự án mẫu</span>
                    </label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                      <multiselect
                        v-model="projectSelect"
                        :options="projectOptions"
                        :loading="loadingOptions"
                        :select-label="''"
                        :deselect-label="''"
                        placeholder="-- Chọn dự án mẫu --"
                        label="name"
                        track-by="name"
                        @input="changeProject">
                      </multiselect>
                  </b-col>
                </b-row>
                <!-- Loading -->
                <span class="loading-more" v-show="loadProjectDetail"><icon name="loading" width="60" /></span>

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
                        <label>% Lợi nhuận theo giá list</label>
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
                        <label>% Lợi nhuận theo giá gốc</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="discount_original_price"
                          type="text"
                          maxlength="5"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.discount_original_price"
                          @change="calculateCurrentProduct('discount_original_price')">
                      </b-col>
                    </b-row>
                  </b-col>
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
                </b-row>

                <b-row>
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
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>SL báo giá {{handleUnitName()}}<span class="error-sybol"></span></label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="quantity"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.quantity"
                          @change="calculateCurrentProduct('quantity')">
                      </b-col>
                    </b-row>
                  </b-col>
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
                </b-row>

                <b-row>
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
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Ghi chú</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="note"
                          type="text"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.note">
                      </b-col>
                    </b-row>
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
                    <h5 class="text-center">Danh sách sản phẩm báo giá</h5>
                  </b-col>
                  <b-col md="3" class="text-right">
                    <download-excel
                    class   = "btn btn-default text-header"
                    :data   = "products_excel"
                    :fields = "excel_fields"
                    worksheet = "Danh sách sản phẩm báo giá"
                    name    = "danh_sach_san_pham_bao_gia.xls">
                    <b>Xuất Excel</b>
                  </download-excel>
                  </b-col>
                </b-row>

                <b-row v-show="trade.products.length > 0">
                  <b-col>
                    <p>
                      Tổng doanh số theo hãng:
                      <span v-for="(brand) in brands_amount" :key="brand">
                        {{" - " + brand.name + ": " + currencyFormat(brand.amount) }}
                      </span>
                    </p>
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
                            <th class="text-center font-weight-bold">Sản phẩm</th>
                            <th class="text-center font-weight-bold">Hãng SP</th>
                            <th class="text-center font-weight-bold">Giá List</th>
                            <th class="text-center font-weight-bold">% CK từ NCC</th>
                            <th class="text-center font-weight-bold">Giá gốc</th>
                            <th class="text-center font-weight-bold">% Lợi nhuận theo giá list</th>
                            <th class="text-center font-weight-bold">% Lợi nhuận theo giá gốc</th>
                            <th class="text-center font-weight-bold">Lợi nhuận/sản phẩm</th>
                            <th class="text-center font-weight-bold">Giá bán</th>
                            <th class="text-center font-weight-bold">Số lượng</th>
                            <th class="text-center font-weight-bold">Thành tiền</th>
                            <th class="text-center font-weight-bold">Lợi nhuận tổng</th>
                            <th class="text-center font-weight-bold">Ghi chú</th>
                            <th class=""></th>
                          </tr>
                        </thead>
                    <tbody>
                    <tr v-for="(item, index) in trade.products" :key="index">
                      <td class="fitwidth-50">
                        {{index + 1}}
                        <i class="fa fa-long-arrow-up" @click="upProductIndex(item.index)" />
                      </td>
                      <td class="fitwidth-250">{{item.product_code ? item.product_code : item.product_code_input}}</td>
                      <td class="fitwidth-250">{{item.product_name ? item.product_name : item.product_name_input}}</td>
                      <td class="fitwidth-50">{{item.brand_name ? item.brand_name : item.brand_name_input}}</td>
                      <td class="text-right">
                        <input
                          :id="'price_list_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.price_list"
                          @change="changeProductItem('price_list', index)">
                      </td>
                      <td class="text-right">
                        <input
                          :id="'discount_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.discount"
                          @change="changeProductItem('discount', index)">
                      </td>
                      <td class="text-right">
                        <input
                          :id="'price_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.price"
                          @change="changeProductItem('price', index)">
                      </td>
                      <td class="text-right">
                        <input
                          :id="'discount_sale_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.discount_sale"
                          @change="changeProductItem('discount_sale', index)">
                      </td>
                      <td class="text-right">
                        <input
                          :id="'discount_original_price_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.discount_original_price"
                          @change="changeProductItem('discount_original_price', index)">
                      </td>
                      <td class="text-right">
                        <input
                          :id="'profit_on_item_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.profit_on_item"
                          @change="changeProductItem('profit_on_item', index)">
                      </td>
                      <td class="text-right">
                        <input
                          :id="'price_sell_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.price_sell"
                          @change="changeProductItem('price_sell', index)">
                      </td>
                      <td class="text-right">
                        <input
                          :id="'quantity_' + index"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.quantity"
                          @change="changeProductItem('quantity', index)">
                      </td>
                      <td class="text-right">
                        {{currencyFormat(item.amount_sell)}}
                      </td>
                      <td class="text-right">
                        {{currencyFormat(item.profit)}}
                      </td>
                      <td class="text-right">
                        <!--{{item.note}}-->
                        <input
                          :id="'note_' + index"
                          type="text"
                          autocomplete="new-password"
                          class="form-control"
                          :value="item.note"
                          @change="changeProductNote(index)">
                      </td>
                      <td class="fitwidth-50">
                        <i class="fa fa-trash ml-2" @click="deleteProduct(index, item.product_id, item.quantity, item.properties)" />
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
                            <th class="text-center font-weight-bold">Sản phẩm</th>
                            <th class="text-center font-weight-bold">Hãng SP</th>
                            <th class="text-center font-weight-bold">Giá List</th>
                            <th class="text-center font-weight-bold">% CK từ NCC</th>
                            <th class="text-center font-weight-bold">Giá gốc</th>
                            <th class="text-center font-weight-bold">% Lợi nhuận theo giá list</th>
                            <th class="text-center font-weight-bold">% Lợi nhuận theo giá gốc</th>
                            <th class="text-center font-weight-bold">Lợi nhuận/sản phẩm</th>
                            <th class="text-center font-weight-bold">Giá bán</th>
                            <th class="text-center font-weight-bold">Số lượng</th>
                            <th class="text-center font-weight-bold">Thành tiền</th>
                            <th class="text-center font-weight-bold">Lợi nhuận tổng</th>
                            <th class="text-center font-weight-bold">Ghi chú</th>
                            <th class=""></th>
                          </tr>
                        </thead>
                    <tbody>
                      <tr v-for="(item, index) in projectProducts" :key="index" v-bind:class="item.product_type == 0 ? 'project_bg' : ''">
                        <td class="fitwidth-50">
                          {{item.project_index}}
                          <i v-show="item.product_type == 1" class="fa fa-long-arrow-up" @click="upProductIndex(item.index, true)" />
                        </td>
                        <td class="fitwidth-250">
                          <span v-show="item.product_type == 1">{{item.product_code ? item.product_code : item.product_code_input}}</span>
                        </td>
                        <td class="fitwidth-250">
                          <span v-show="item.product_type == 1">{{item.product_name ? item.product_name : item.product_name_input}}</span>
                          <input
                             v-show="item.product_type == 0"
                            :id="'project_name_' + index"
                            type="text"
                            maxlength="255"
                            autocomplete="new-password"
                            class="form-control"
                            :value="item.product_name"
                            @change="changeProjectName(index, item.project_index)">
                        </td>
                        <td class="fitwidth-50">
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
                            @change="changeProductItem('discount_sale', index, item.project_index, item.index)">
                        </td>
                        <td class="text-right">
                          <input
                            v-show="item.product_type == 1"
                            :id="'discount_original_price_project_' + index"
                            type="text"
                            maxlength="14"
                            autocomplete="new-password"
                            class="form-control"
                            :value="item.discount_original_price"
                            @change="changeProductItem('discount_original_price', index, item.project_index, item.index)">
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
                            @change="changeProductItem('price_sell', index, item.project_index, item.index)">
                        </td>
                        <td class="text-right">
                          <input
                             v-show="item.product_type == 0"
                            :id="'project_quantity_' + index"
                            type="text"
                            maxlength="14"
                            autocomplete="new-password"
                            class="form-control"
                            :value="item.project_quantity"
                            @change="changeProjectQuantity(index)">
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
                          <!--{{item.note}}-->
                          <input
                             v-show="item.product_type == 1"
                            :id="'note_project_' + index"
                            type="text"
                            autocomplete="new-password"
                            class="form-control"
                            :value="item.note"
                            @change="changeProjectProductNote(index, item.project_index, item.index)">
                        </td>
                        <td class="fitwidth-50">
                          <i v-show="item.product_type == 0" class="fa fa-edit mr-2" @click="editProject(item.product_name)" />
                          <i class="fa fa-trash" @click="deleteProductOfProject(item.index, item.product_type, item.product_name, item.product_id, item.quantity, item.properties)" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                    </div>

                  </b-col>
                </b-row>

                <b-row class="form-row" v-show="trade.type == 1 && projectProducts.length > 0" >
                  <b-col md="2" class="mt-2">
                    <label>Hiện giá chi tiết<span class="error-sybol"></span></label>
                  </b-col>
                  <b-col md="10" class="mt-2">
                    <div class="input-group">
                      <input type="radio" v-model="trade.show_price_project" name="show_price_project" :value="'true'" class="mt-2" id="show_price_project_true">
                      <label class="ml-4 mt-1" for="show_price_project_true">Có</label>
                      <input type="radio" v-model="trade.show_price_project" name="show_price_project" :value="'false'" class="ml-5 mt-2" id="show_price_project_false">
                      <label class="ml-4 mt-1" for="show_price_project_false">Không</label>
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
                        <label>Tổng tiền sản phẩm</label>
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
                        <label>Chi phí thêm</label>
                      </b-col>
                      <b-col md="8">
                        <b-row>
                          <b-col md="5">
                            <input
                              id="extra_fee"
                              type="text"
                              maxlength="14"
                              autocomplete="new-password"
                              class="form-control"
                              v-model="trade.extra_fee"
                              placeholder="Số tiền"
                              @change="calculateAmount">
                          </b-col>
                          <b-col md="5">
                            <input
                              id="note_extra_fee"
                              type="text"
                              maxlength="255"
                              autocomplete="new-password"
                              class="form-control"
                              placeholder="Ghi chú cho chi phí thêm"
                              v-model="trade.note_extra_fee">
                          </b-col>
                        </b-row>

                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="mt-2">
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Số tiền giảm</label>
                      </b-col>
                      <b-col md="8">
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
                        <label>Thuế VAT</label>
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
                        <label>Thành tiền<span class="error-sybol"></span> </label>
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
                        <label>Lợi nhuận</label>
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
                        <label>Tài khoản nhận thanh toán</label>
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
                        <label>Hình thức thanh toán</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <div class="input-group">
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

                          <b-button variant="outline-success" class="pull-right ml-2" @click="showModalPaymentMethod" >
                            <i class="fa fa-plus"></i>
                          </b-button>
                        </div>

                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Thỏa thuận vận chuyển</label>
                      </b-col>
                      <b-col md="8" class="mt-2">

                        <div class="input-group">
                          <b-form-select
                          id="shipping_agreement"
                          :options="optionsShippingAgreement"
                          v-model="trade.shipping_agreement"
                          type="text"
                          class="form-control"
                        ></b-form-select>

                          <b-button variant="outline-success" class="pull-right ml-2" @click="showModalShippingAgreement" >
                            <i class="fa fa-plus"></i>
                          </b-button>
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Phí giao hàng</label>
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
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Hiệu lực báo giá (ngày)</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="quotation_expiry_date"
                          type="text"
                          maxlength="3"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.quotation_expiry_date"
                          @keyup="integerOnly($event.target)">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row" v-if="userRole == 'admin'">
                      <b-col md="4" class="mt-2">
                        <label>Nhân viên phụ trách</label>
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
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>
                          <span>Thời gian giao hàng</span>
                        </label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="shipping_date"
                          type="text"
                          maxlength="255"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.shipping_date">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">

                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Bảo hành</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="guarantee"
                          type="text"
                          maxlength="255"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.guarantee">
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Giấy tờ kèm theo</label>
                      </b-col>
                      <b-col md="8" class="mt-2">
                        <input
                          id="attach_doc"
                          type="text"
                          maxlength="255"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.attach_doc">
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="6">
                    <b-row class="form-row">
                      <b-col md="4" class="mt-2">
                        <label>Ghi chú</label>
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

            <b-row>
              <b-col md='12'>
                <b-button variant="outline-primary" class="pull-left btn-width-120 mt-1"
                  @click="updateDraft">
                    Lưu nháp
                </b-button>

                <b-button variant="outline-primary" class="pull-right btn-width-120 mt-1"
                  @click="openModalChooseFilePrint">
                    In báo giá
                </b-button>
              </b-col>
                <!-- openModalChooseFilePrint -->
            </b-row>

            <b-row class="mt-2">
              <b-col md="12" class="text-center">
                <b-button v-show="!saving" variant="outline-success" style="height: 50px; width: 240px"
                          @click="save" :disabled="saving || !this.trade.id">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận Báo Giá
                </b-button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal chọn kiểu file in -->
    <b-modal centered hide-footer hide-header size="sm" id="modal-choose-print-file-type">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Chọn File In Báo Giá</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col cols="12">
          <b-button v-show="!exportingExcel" variant="outline-primary"
                    class="pull-left btn-width-120" @click="exportExcel('excel')">
            Xuất Excel
          </b-button>

          <b-button v-show="!exportingExcel" variant="outline-success"
                    class="pull-right btn-width-120" @click="exportExcel('pdf')">
            Xuất PDF
          </b-button>
          <span class="loading-more" v-show="exportingExcel"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="text-center mt-3">
          <b-button variant="outline-secondary" class="btn-width-120" @click="hideModalChooseFilePrint">
            Quay lại
          </b-button>
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
          Đơn vị gốc: {{ root_unit.name }}
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

    <!--Print-->
    <b-row hidden id="provisionalInvoice">
      <b-col>
        <img :src="'/static/img/project/print/quotation/header_' + this.authStore.user.storeId + '.png'" style="width: 100%"/>

        <div v-if="this.authStore.user.storeId != 19" style="width:100%; height:35px; font-size: 12px;" class="tr-bg">
          <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center; margin-top: 10px;">
            <b>BẢNG BÁO GIÁ</b>
          </div>
          <div style="float: right; width: 30%; margin-top: 10px; text-align: center">
            <i class="print-text-right">TP.HCM, Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</i>
          </div>
        </div>

        <!--Cty 19 mong muốn mẫu báo giá khác-->
        <div v-if="this.authStore.user.storeId == 19" style="width:100%; height:35px; font-size: 12px;">
          <div style="font-size: 18px; text-align: center; margin-top: 10px;">
            <b>THƯ BÁO GIÁ</b>
          </div>
          <div style="font-size: 12px; text-align: center; margin-top: 10px;">
            <span><b>Số báo giá: {{trade.quotation_number}}</b></span>
          </div>
          <div style="float: right; width: 100%; margin-top: 10px; text-align: right">
            <i class="print-text-right">TP.HCM, Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</i>
          </div>
        </div>

        <div v-if="this.authStore.user.storeId != 19" style="width:100%; font-size: 12px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
          <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center;">

          </div>
          <div style="float: right; width: 30%; margin-top: 5px; margin-bottom: 5px; text-align: center">
            <span>Số báo giá: {{trade.quotation_number}}</span>
          </div>
        </div>

        <div class="print-table-border custom-line-height">
          <table style="width:100%; font-size: 10px">
            <tbody>
            <tr class="print-pl-2">
              <td colspan="2" class="print-pl-2"> Kính gửi: <b>
              <span>{{trade.customer_name}}</span>
              </b></td>
            </tr>
            <tr>
              <td class="print-no-border print-pl-2">Anh/chị: <span>{{trade.contact_person_name}}</span></td>
              <td class="print-no-border">Kinh doanh: <span>{{trade.staff_in_charge_name}}</span></td>
            </tr>
            <tr>
              <td class="print-no-border print-pl-2">Điện thoại: <span>{{trade.contact_person_phone}}</span></td>
              <td class="print-no-border">Điện thoại: <span>{{trade.staff_in_charge_phone}}</span></td>
            </tr>
            <tr>
              <td class="print-no-border print-pl-2">Email: <span>{{trade.contact_person_email}}</span></td>
              <td class="print-no-border">Email: <span>{{trade.staff_in_charge_email}}</span></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div style="width:100%; font-size: 12px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
          <div style="width: 100%; margin-top: 5px; margin-bottom: 5px; text-align: left">
            <span><i><b>{{store_name}}</b> chân thành cảm ơn Quý Khách Hàng đã quan tâm đến dịch vụ/sản phẩm của công ty chúng tôi. Chúng tôi trân trọng gửi tới Quý Khách:</i></span>
          </div>
        </div>
        <div class="print-table-border">
          <table style="width:100%; font-size: 10px" class="custom-line-height">
            <thead>
            <tr class="print-text-center tr-bg" style="background-color: #eeece1">
              <th>STT</th>
              <th>MÃ SẢN PHẨM</th>
              <th>MÔ TẢ SẢN PHẨM</th>
              <th>HÃNG SX</th>
              <th>ĐVT</th>
              <th>SL</th>
              <th>ĐƠN GIÁ</th>
              <th>THÀNH TIỀN (VNĐ)</th>
              <th>GHI CHÚ</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="trade.type == 0" v-for="(item, index) in trade.products" :key="index">
              <td class="print-text-center">{{index + 1}}</td>
              <td>{{item.product_code ? item.product_code : item.product_code_input}}</td>
              <td>
                {{item.product_name ? item.product_name : item.product_name_input}}
                <span v-for="(des) in item.description" :key="des">
                  <br><i class="print-pl-2">{{des}}</i>
                </span>
              </td>
              <td class="print-text-center">{{item.brand_name ? item.brand_name : item.brand_name_input}}</td>
              <td class="print-text-center">{{item.unit_name ? item.unit_name : item.unit_name_input}}</td>
              <td class="print-text-center">{{currencyFormat(item.quantity)}}</td>
              <td class="print-text-right">{{currencyFormat(item.price_sell)}}</td>
              <td class="print-text-right">{{currencyFormat(item.amount_sell)}}</td>
              <td>{{item.note}}</td>
            </tr>
            <tr v-if="trade.type == 1" v-for="(item, index) in projectProducts" :key="index" :class="item.product_type == 0 ? 'project_name' : ''">
              <td class="print-text-center">{{item.project_index}}</td>
              <td>
              	<span v-show="item.product_type == 1">{{item.product_code ? item.product_code : item.product_code_input}}</span>
          	  </td>
              <td>
                <span v-show="item.product_type == 1">{{item.product_name ? item.product_name : item.product_name_input}}</span>
                <b v-show="item.product_type == 0">{{item.product_name}}</b>
              </td>
              <td class="print-text-center">
                <span v-show="item.product_type == 1">
                  {{item.brand_name ? item.brand_name : item.brand_name_input}}
                </span>
                <span v-show="item.product_type == 0">
                  {{item.project_brand_name}}
                </span>
              </td>
              <td class="print-text-center">
                <span v-show="item.product_type == 1">
                  {{item.unit_name ? item.unit_name : item.unit_name_input}}
                </span>
                <span v-show="item.product_type == 0">
                  {{item.project_unit_name}}
                </span>
              </td>
              <td  class="print-text-center">
                {{currencyFormat(item.product_type == 1 ? item.quantity : item.project_quantity)}}
              </td>
              <td class="print-text-right">
                <span v-show="trade.show_price_project == 'false' && item.product_type == 1">-</span>
                <span v-show="trade.show_price_project == 'false' && item.product_type == 0">{{currencyFormat(item.project_price)}}</span>
                <span v-show="trade.show_price_project == 'true'">
                  {{currencyFormat(item.product_type == 1 ? item.price_sell : item.project_price)}}
                </span>
              </td>
              <td class="print-text-right">
                <span v-show="trade.show_price_project == 'false' && item.product_type == 1">-</span>
                <span v-show="trade.show_price_project == 'false' && item.product_type == 0">{{currencyFormat(item.project_amount)}}</span>
                <span v-show="trade.show_price_project == 'true'">
                  {{currencyFormat(item.product_type == 1 ? item.amount_sell : item.project_amount)}}
                </span>
              </td>
              <td>{{item.product_type == 1 ? item.note : ''}}</td>
            </tr>
            <tr>
              <td colspan="7" class="print-text-right">CỘNG TIỀN HÀNG:</td>
              <td class="print-text-right"><b>{{currencyFormat(trade.sub_total)}}</b></td>
              <td></td>
            </tr>
            <tr v-show="trade.extra_fee && parseInt(trade.extra_fee) > 0">
              <td colspan="7" class="print-text-right">
                CHI PHÍ KHÁC
                <span v-show="trade.note_extra_fee"> ({{trade.note_extra_fee}})</span>
              </td>
              <td class="print-text-right">{{currencyFormat(trade.extra_fee)}}</td>
              <td></td>
            </tr>
            <tr v-show="trade.fixed_discount && parseInt(trade.fixed_discount) > 0">
              <td colspan="7" class="print-text-right">GIẢM GIÁ</td>
              <td class="print-text-right">{{currencyFormat(trade.fixed_discount)}}</td>
              <td></td>
            </tr>
            <tr v-show="trade.have_vat && parseInt(trade.vat_value) > 0">
              <td colspan="7" class="print-text-right">Thuế GTGT (VAT {{trade.vat_percent}}%)</td>
              <td class="print-text-right">{{currencyFormat(trade.vat_value)}}</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="7" class="print-text-right"><b>TỔNG TIỀN THANH TOÁN:</b></td>
              <td class="print-text-right"><b>{{currencyFormat(trade.total)}}</b></td>
              <td></td>
            </tr>
            </tbody>
          </table>
          <div>
            <p style="font-size: 10px"><b> Số tiền viết bằng chữ:</b> {{convertNumberToText(trade.total)}}</p>
          </div>
          <div>
            <p style="color: red; font-size: 10px">
              <b v-if="this.authStore.user.storeId != 19 && trade.type == 0">* Quý khách hàng vui lòng kiểm tra mã sản phẩm & thông số sản phẩm, hàng mua xin miễn đổi trả</b>
              <b v-if="this.authStore.user.storeId == 19 || trade.type == 1">* Quý khách hàng vui lòng xem thêm các Điều khoản - Chính sách báo giá phía dưới dây:</b>
            </p>
          </div>

          <div>
            <table style="width:100%; font-size: 10px">
              <tbody>
              <tr>
                <td class="print-no-border">
                  {{this.authStore.user.storeId == 19 ? 'Thời gian giao hàng:' : 'Bảo hành:'}}
                </td>
                <td class="print-no-border">
                  <span v-if="this.authStore.user.storeId == 19">
                    {{trade.shipping_date}}
                  </span>
                  <span v-if="this.authStore.user.storeId != 19">
                    {{trade.guarantee}}
                  </span>
                </td>
                <td class="print-no-border" colspan="2">
                  Thông tin tài khoản ngân hàng thụ hưởng:
                </td>
              </tr>
              <tr>
                <td class="print-no-border">Hiệu lực báo giá:</td>
                <td class="print-no-border">{{trade.quotation_expiry_date}} ngày <span style="color: #C0C0C0">(kể từ ngày báo giá)</span></td>
                <td class="print-no-border">Tên tài khoản:</td>
                <td class="print-no-border">{{bankAccountSelected.account_name}}</td>
              </tr>
              <tr>
                <td class="print-no-border">Giao hàng:</td>
                <td class="print-no-border">
                  <span>{{!trade.shipping_agreement ? 'Nội thành HCM' : trade.shipping_agreement}}. </span>
                  <span v-show="trade.shipping_fee && parseInt(trade.shipping_fee) > 0">
                    {{'Chi Phí giao hàng là: ' + currencyFormat(trade.shipping_fee) + ' đồng'}}
                  </span>
                </td>
                <td class="print-no-border">Số tài khoản: </td>
                <td class="print-no-border">
                  <span>{{bankAccountSelected.account_number}}</span>
                </td>
              </tr>
              <tr>
                <td class="print-no-border">Hình thức Thanh toán: </td>
                <td class="print-no-border">
                   <span>{{trade.payment_method ? trade.payment_method : trade.payment_method_input }}</span>
                </td>
                <td class="print-no-border">Ngân hàng: </td>
                <td class="print-no-border">
                  <span>{{bankAccountSelected.bank_name}}</span>
                </td>
              </tr>
              <tr>
                <td class="print-no-border"></td>
                <td class="print-no-border"></td>
                <td class="print-no-border">Nội dung chuyển khoản: </td>
                <td class="print-no-border">
                  <span>{{'Tên công ty - ' + trade.quotation_number}}</span>
                </td>
              </tr>
              <tr v-show="trade.description">
                <td class="print-no-border"><b>Ghi chú thêm:</b></td>
                <td class="print-no-border" colspan="3">{{trade.description}}</td>
              </tr>
              <tr v-show="trade.type == 1">
                <td class="print-no-border" colspan="4"><b style="color: red">* Cam kết:</b> Khách hàng được hỗ trợ tư vấn kỹ thuật trong suốt thời gian sử dụng tủ điện. Bàn giao bản vẽ sơ đồ nguyên lý đấu nối, mạch điều khiển, Giấy test chất lượng xuất xưởng, Phiếu bảo hành cho khách hàng.</td>
              </tr>
              <tr>
                <td class="print-no-border" colspan="4">Mọi thắc mắc vui lòng liên hệ nhân viên lập báo giá phía trên</td>
              </tr>
              </tbody>
            </table>
          </div>
          <br><br>
          <div>
            <table style="width:100%; font-size: 10px">
              <tbody>
              <tr>
                <td class="print-no-border print-text-center"><b>XÁC NHẬN ĐẶT HÀNG</b></td>
                <td class="print-no-border print-text-center"><b>NGƯỜI BÁO GIÁ</b></td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center" style="color: #C0C0C0">(Đại diện khách hàng)</td>
                <td class="print-no-border print-text-center" style="color: #C0C0C0">(Đại diện thiết bị Bến Thành)</td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"> </td>
                <td class="print-no-border print-text-center"> </td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"></td>
                <td class="print-no-border print-text-center"><b>{{trade.staff_in_charge_name}}</b></td>
              </tr>
              <tr>
                <td class="print-no-border print-text-center"></td>
                <td class="print-no-border print-text-center">{{trade.staff_in_charge_position}}</td>
              </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_1_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_2_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_3_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_4_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_5_' + this.$store.state.user.storeId + '.png'" style="width: 100%"/>-->

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
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn nhóm sản phẩm--"
                label="name"
                track-by="name"
                @input="changeProductGroupSearch">
              </multiselect>
          </b-col>

          <b-col md="2" class="mt-2">
            <label>Loại sản phẩm</label>
            <multiselect
              v-model="productTypeSearchSelect"
              :options="productTypeSearchOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
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
          <label>Loại khách hàng </label>
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
          <label>Mã số thuế <span v-show="customer.type == 1" class="error-sybol"></span></label>
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
            id="created_by"
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

    <!--Modal QL hình thức thanh toán -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-man-payment-method" @hide="cleanPaymentMethod">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">QL Hình Thức Thanh Toán</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Hình thức thanh toán<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="9">
              <input
                id="payment_method_man"
                type="text"
                class="form-control"
                v-model="paymentMethod.payment_method"
                autocomplete="new-password"
                maxlength="255">
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Số ngày công nợ<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="9" class="mt-2">
              <input
                id="payment_method_debt_date_number"
                type="text"
                class="form-control"
                v-model="paymentMethod.debt_date_number"
                autocomplete="new-password"
                @keyup="integerOnly($event.target)"
                maxlength="4">
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Thứ tự xuất hiện<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="9" class="mt-2">
              <input
                id="payment_method_index"
                type="text"
                class="form-control"
                v-model="paymentMethod.index"
                autocomplete="new-password"
                @keyup="integerOnly($event.target)"
                maxlength="2">
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12" class="text-center">
              <b-button v-show="!savingPaymentMethod" variant="outline-secondary"
                        class="btn-width-120 text-center"
                        @click.prevent="hideModalPaymentMethod">
                Đóng
              </b-button>
              <b-button v-show="!savingPaymentMethod" variant="outline-primary"
                        class="btn-width-120 text-center" :disabled="savingPaymentMethod"
                        @click.prevent="addUpdatePaymentMethod">
                <span>{{btn_payment_method_text}}</span>
              </b-button>
              <span class="loading-more" v-show="savingPaymentMethod"><icon name="loading" width="60" /></span>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col md="12">
              Số kết quả: <b>{{itemsPaymentMethod.length}}</b>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-table
                hover
                bordered
                stacked="md"
                :fields="fieldsPaymentMethod"
                :items="itemsPaymentMethod">
                <template v-slot:cell(action)="dataId">
                  <b-list-group horizontal>
                    <b-list-group-item v-b-tooltip.hover title="Cập nhật"
                                       @click="editPaymentMethod(dataId.index)">
                      <i class="fa fa-edit" />
                    </b-list-group-item>
                    <b-list-group-item v-b-tooltip.hover title="Xóa"
                                       @click="deletedPaymentMethod(dataId.item.id, dataId.item.payment_method)">
                      <i class="fa fa-trash" />
                    </b-list-group-item>
                  </b-list-group>
                </template>
              </b-table>
            </b-col>
          </b-row>


          <!-- Loading -->
          <span class="loading-more" v-show="loadingPaymentMethod"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>

    </b-modal>

    <!--Modal QL Thỏa thuận vận chuyển -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-man-shipping-agreement" @hide="cleanShippingAgreement">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">QL Thỏa Thuận Vận Chuyển</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Thỏa thuận vận chuyển<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="9">
              <input
                id="shipping_agreement_man"
                type="text"
                class="form-control"
                v-model="shippingAgreement.shipping_agreement"
                autocomplete="new-password"
                maxlength="255">
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Thứ tự xuất hiện<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="9" class="mt-2">
              <input
                id="shipping_agreement_index"
                type="text"
                class="form-control"
                v-model="shippingAgreement.index"
                autocomplete="new-password"
                @keyup="integerOnly($event.target)"
                maxlength="2">
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12" class="text-center">
              <b-button v-show="!savingShippingAgreement" variant="outline-secondary"
                        class="btn-width-120 text-center"
                        @click.prevent="hideModalShippingAgreement">
                Đóng
              </b-button>
              <b-button v-show="!savingShippingAgreement" variant="outline-primary"
                        class="btn-width-120 text-center" :disabled="savingShippingAgreement"
                        @click.prevent="addUpdateShippingAgreement">
                <span>{{btn_shipping_agreement_text}}</span>
              </b-button>
              <span class="loading-more" v-show="savingShippingAgreement"><icon name="loading" width="60" /></span>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col md="12">
              Số kết quả: <b>{{itemsShippingAgreement.length}}</b>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-table
                hover
                bordered
                stacked="md"
                :fields="fieldsShippingAgreement"
                :items="itemsShippingAgreement">
                <template v-slot:cell(action)="dataId">
                  <b-list-group horizontal>
                    <b-list-group-item v-b-tooltip.hover title="Cập nhật"
                                       @click="editShippingAgreement(dataId.index)">
                      <i class="fa fa-edit" />
                    </b-list-group-item>
                    <b-list-group-item v-b-tooltip.hover title="Xóa"
                                       @click="deletedShippingAgreement(dataId.item.id, dataId.item.shipping_agreement)">
                      <i class="fa fa-trash" />
                    </b-list-group-item>
                  </b-list-group>
                </template>
              </b-table>
            </b-col>
          </b-row>


          <!-- Loading -->
          <span class="loading-more" v-show="loadingShippingAgreement"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>

    </b-modal>

  </div>
</template>


<script>
import productApi from '@/api/product'
import quotationApi from '@/api/quotation'
import superAdminAPI from '@/api/superAdmin'
import customerApi from '@/api/customer'
import MasterApi from '@/api/master'
import { RootAPI } from '@/api/index'
import paymentMethodApi from '@/api/paymentMethod'
import shippingAgreementApi from '@/api/shippingAgreement'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      prefix_title: "Thêm Mới",
      customerSelect: {},
      customerOptionStore: [],
      productGroupSearchSelect: {},
      // productGroupSelect: {},
      productGroupOptions:[],
      productTypeSearchSelect:{},
      productTypeSearchOptions:[],
      // productTypeSelect:{},
      // productTypeOptions:[],
      productTypeOptionStore: [],
      productSelect: {},
      productOptions: [],
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
      projectSelect: {},
      projectOptions: [],
      optionsCompanyType: [
        {value: null, text: ''},
        {value: 0, text: 'Khách lẻ'},
        {value: 1, text: 'Thương mại'},
        {value: 2, text: 'Nhà máy'},
        {value: 3, text: 'Công Trình'}
      ],
      customerStatusOptions: [
        {value: null, text: ''},
        {value: 1, text: 'Khách mới'},
        {value: 2, text: 'Khách cũ'}
      ],
      bankAccountSelected: {"account_name": "", "account_number": "", "bank_name": ""},
      trade: {
        "id": null,
        "quotation_number": null,
        "status": -1,
        "type": 0,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_address": null,
        "customer_tax_code": null,
        "customer_company_type_id": null,
        "contact_person_name": null,
        "contact_person_phone": null,
        "customer_status": 1,
        "sub_total": 0,
        "extra_fee": null,
        "note_extra_fee": null,
        "fixed_discount": null,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "profit": 0,
        "bank_account_id": null,
        "payment_method": 'TT 100% trước khi giao hàng',
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
        "promotions": [],
        "show_price_project": 'true',
        "shipping_date": '3-5 ngày kể từ ngày đặt hàng',
        "guarantee": 'Mới 100% bảo hành theo nhà Sản Xuất',
        "attach_doc": null
      },
      currentProduct: {
        "index": -1,
        "project_type": 0,
        "project_name": null,
        "project_brand_id": null,
        "project_brand_name": null,
        "project_unit_id": null,
        "project_unit_name": null,
        "project_quantity": 1,
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
        "discount_original_price": null,
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
        "description": [],
        "target_unit_id": null,
        "target_unit_name": null,
        "conversion_value": null,
        "quantity_root": null
      },
      curent_unit: null,
      is_have_price_sell: false,
      brand_input: null,
      brands_amount: [],
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
          key: 'product_brand_name',
          label: 'Hãng SP'
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
      loadingOptions: false,
      loadingCustomerOptions: false,
      loadingProductOptions: false,
      loadCusDetail: false,
      loadProjectDetail: false,
      loadProductDetail: false,
      currentCustomer: {},
      projectProducts : [],
      exportingExcel: false,
      // showImage: true,
      paymentMethod: {
        id: null,
        payment_method: null,
        debt_date_number: 0,
        index: null
      },
      itemsPaymentMethod: [],
      fieldsPaymentMethod: [
        {
          key: 'index',
          label: 'STT'
        },
        {
          key: 'payment_method',
          label: 'Hình thức thanh toán'
        },
        {
          key: 'debt_date_number',
          label: 'Số ngày công nợ'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      savingPaymentMethod: false,
      loadingPaymentMethod: false,
      btn_payment_method_text: 'Thêm mới',
      shippingAgreement: {
        id: null,
        shipping_agreement: null,
        index: null
      },
      itemsShippingAgreement: [],
      fieldsShippingAgreement: [
        {
          key: 'index',
          label: 'STT'
        },
        {
          key: 'shipping_agreement',
          label: 'Thỏa thuận vận chuyển'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      savingShippingAgreement: false,
      loadingShippingAgreement: false,
      btn_shipping_agreement_text: 'Thêm mới',
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
    if(url.includes("quotation-staff") || url.includes("quotation-project-staff")) {
      this.userRole = "staff"
      if(url.includes("quotation-project-staff")) {
        this.trade.type = 1 // Báo giá dự án
        this.trade.guarantee = '1 năm' // Báo giá dự án
        this.trade.quotation_expiry_date = 7
      }
    } else {
      this.userRole = "admin"
      if(url.includes("quotation-project-all")) {
        this.trade.type = 1 // Báo giá dự án
        this.trade.guarantee = '1 năm' // Báo giá dự án
        this.trade.quotation_expiry_date = 7
      }
    }

    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    // Get trade detail
    this.getTradeDetail()

    // Lấy danh sách khách hàng trước
    this.getCustomerOptions()

    // Lấy danh sách sản phẩm
    this.getProductOptions()

    // Lấy các danh sách còn lại sau
    this.getOptionsRelated()

    // Get store info
    this.getStoreDetail()
  },
  methods: {



    /**
     *  Get customer options
     */
    getOptionsRelated() {
      console.log("this.userRole: " + this.userRole)
      let params = {
        product_groups: true,
        product_types: true,
        cities: true,
        brands: true,
        units: true,
        bank_accounts: true,
        payment_methods: true,
        shipping_agreements: true,
        multiple_units: true,
      }
      if(this.userRole == "admin") {
        params.staffs = true
      }
      if(this.trade.type == 1) {
        params.projects = true
      }

      this.loadingOptions = true

      quotationApi.getOptionRelatedQuotation(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {

          // Product groups
          if(params.product_groups) {
            this.productGroupOptions = res.data.data.product_groups
            let itemProductGroupEmpty = {"id": null, "name": "-- Tất cả --"}
            this.productGroupOptions.unshift(itemProductGroupEmpty)
          }

          // Product types
          if(params.product_types) {
            this.productTypeOptionStore = res.data.data.product_types
            this.resetListProductType()
          }

          // Cities
          if(params.cities) {
            this.optionsCity = res.data.data.cities
            this.optionsCity.unshift({"value": null, "text": ""})
            this.changeCity()
          }

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

          // Projects
          if(params.projects) {
            this.projectOptions = res.data.data.projects
            this.projectOptions.unshift({"id": null, "name": "-- Chọn dự án mẫu --", "brand_name": null, "unit_name": null})
            this.projectSelect = this.projectOptions[0]
          }

          // Payments methods
          if(params.payment_methods) {
            this.optionsPaymentMethod = res.data.data.payment_methods
            this.optionsPaymentMethod.unshift({value: null, text: 'Khác'})
          }

          // Shipping agreements
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
          // this.resetListProduct()
          // this.changeProductType(true)
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

    showModalSearchProduct() {
      this.$bvModal.show('modal-search-product')
    },

    hideModalSearchProduct() {
      this.$bvModal.hide('modal-search-product')
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
    searchProduct() {
      if (this.onSearchProduct) { return }
      this.productSearchItems = []

      this.onSearchProduct = true

      if(!this.productSearch.product_type_id) {
        this.productSearch.product_type_id = null
      }

      if(!this.productSearch.product_group_id) {
        this.productSearch.product_group_id = null
      }

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

    showModalShippingAgreement() {
      this.getListShippingAgreement()
      this.$bvModal.show('modal-man-shipping-agreement')
    },

    hideModalShippingAgreement() {
      this.$bvModal.hide('modal-man-shipping-agreement')
    },

    showModalPaymentMethod() {
      this.getListPaymentMethod()
      this.$bvModal.show('modal-man-payment-method')
    },

    hideModalPaymentMethod() {
      this.$bvModal.hide('modal-man-payment-method')
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

    // getCustomerCodeById(id) {
    //     for(let i in this.customerOptionStore) {
    //         if(this.customerOptionStore[i].id == id) {
    //             return this.customerOptionStore[i].code
    //         }
    //     }
    //     return null
    //   },

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
        "phone": this.trade.customer_phone ? this.trade.customer_phone : this.trade.contact_person_phone,
        "address": this.trade.customer_address,
        "email": this.trade.customer_email,
        "customer_company_type_id": this.trade.customer_company_type_id,
        "contact_person_name": this.trade.contact_person_name,
        "contact_person_phone": this.trade.contact_person_phone,
        "code": this.currentCustomer.code,
        "tax_code": this.trade.customer_tax_code
      }
      customerApi.updateCustomerFromQuotation(params).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', "Cập nhật thông tin khách hàng thành công!")

          if(this.customerSelect && this.customerSelect.id) {
            this.customerSelect.name = JSON.parse(JSON.stringify(this.trade.customer_name))
          }

          this.getCustomerOptions()
        }
      })
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
            this.trade.customer_phone = customer.phone_number
            this.trade.customer_address = customer.address
            this.trade.customer_email = customer.email
            this.trade.customer_tax_code = customer.tax_code
            this.trade.customer_company_type_id = customer.company_type
            this.trade.contact_person_name = customer.contact_person_name
            this.trade.contact_person_phone = customer.contact_person_phone
            this.trade.customer_status = 1

            this.getCustomerOptions()

            this.backCustomer()
          }
        }
        this.savingCustomer = false
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
        if(id){
            for(let i in this.customerOptionStore) {
                if(this.customerOptionStore[i].id == id) {
                    this.customerSelect = this.customerOptionStore[i]
                }
            }
        }

    },

    handleProductExcel() {
      this.products_excel = []
      if(this.trade.products.length > 0) {
          let productsExcel = JSON.parse(JSON.stringify(this.trade.products))

          for(let i in productsExcel) {
              let item = {
                'index': productsExcel[i].index,
                'product_code': productsExcel[i].product_code ? productsExcel[i].product_code : productsExcel[i].product_code_input,
                'product_name' : productsExcel[i].product_name ? productsExcel[i].product_name : productsExcel[i].product_name_input,
                'brand_name' : productsExcel[i].brand_name ? productsExcel[i].brand_name : productsExcel[i].brand_name_input,
                'unit_name' : productsExcel[i].target_unit_name ? productsExcel[i].target_unit_name : productsExcel[i].unit_name ? productsExcel[i].unit_name : productsExcel[i].unit_name_input,
                'quantity' : productsExcel[i].quantity,
                'price' : productsExcel[i].price_sell,
                'amount' : productsExcel[i].amount_sell,
                'note' : productsExcel[i].note
              }
              this.products_excel.push(item)
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
        quotationApi.getQuotationDetail(tradeId, this.userRole).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.trade = res.data.data

              // Format
              this.trade.sub_total = this.currencyFormat((this.trade.sub_total + '').replaceAll(",", ""))
              this.trade.profit = this.currencyFormat((this.trade.profit + '').replaceAll(",", ""))
              this.trade.total = this.currencyFormat((this.trade.total + '').replaceAll(",", ""))
              this.trade.extra_fee = this.currencyFormat((this.trade.extra_fee + '').replaceAll(",", ""))
              this.trade.fixed_discount = this.currencyFormat((this.trade.fixed_discount + '').replaceAll(",", ""))
              this.trade.shipping_fee = this.currencyFormat((this.trade.shipping_fee + '').replaceAll(",", ""))

              // Check flag show_price_project
              if(this.trade.show_price_project) {
                this.trade.show_price_project = 'true'
              } else {
                this.trade.show_price_project = 'false'
              }

              if(this.trade.customer_id) {
                  this.getCustomerItemById(this.trade.customer_id)
                  this.changeCustomer()
              }

              // Nếu là báo giá dự án thì handle lại list products
              if(this.trade.type == 1) {
                this.handleListProduct()
              }

              // Handle bank account
              this.handleBankAccount()
              this.changeBankAccount()

              this.handleProductExcel()

              this.calculateProductAmountByBrand()

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
        this.productTypeSearchOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))
        this.productTypeSearchOptions.unshift({id: null, name: '-- Tất cả --', product_group_id: null})
        this.productTypeSearchSelect = this.productTypeSearchOptions[0]
      },

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
      if(this.productTypeSearchSelect.id) {
        this.productSearch.product_type_id = this.productTypeSearchSelect.id
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

    changeProjectBrand() {
      if(this.currentProduct.project_brand_id) {
        for(let brand of this.productBrandOptions) {
          if(brand.value == this.currentProduct.project_brand_id) {
            this.currentProduct.project_brand_name = brand.text
            return
          }
        }
      } else {
        this.currentProduct.project_brand_name = null
      }
    },

    changeProjectUnit() {
      if(this.currentProduct.project_unit_id) {
        for(let unit of this.unitOptions) {
          if(unit.value == this.currentProduct.project_unit_id) {
            this.currentProduct.project_unit_name = unit.text
            return
          }
        }
      } else {
        this.currentProduct.project_unit_name = null
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
              this.currentProduct.description = product.description
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

              let price = product.price
              if(!price) {
                price = Math.round(parseInt(price_list) * (100 - parseFloat(discount)) / 100)
              }
              this.currentProduct.price = this.currencyFormat(price)

              if(product.price_sell) {
                this.currentProduct.price_sell = this.currencyFormat(product.price_sell)
              }
              this.currentProduct.quantity_repo = this.currencyFormat(product.quantity_repo)
              this.currentProduct.properties = product.properties
              this.currentProduct.unit_name = product.unit_name
              this.currentProduct.unit_id = product.unit_id
              this.root_unit = {id: product.unit_id, name: product.unit_name}
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
     * Get detail
     */
    getStoreDetail() {
      let storeId = this.authStore.user.storeId
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
        this.authStore.logout()
        this.$router.push('/staff-login')
      }
    },

      // selectGroupProduct(item) {
      //   if(item) {
      //       this.currentProduct.product_group_id = item.id
      //     this.currentProduct.product_group_name = item.name
      //       this.productSearch.product_group_id = item.id
      //       if(item.id) {
      //           this.changeProductGroup()
      //       }
      //
      //   } else {
      //       this.currentProduct.product_group_id = null
      //     this.currentProduct.product_group_name = null
      //       this.productSearch.product_group_id = null
      //   }
      // },

      // selectTypeProduct(item) {
      //   if(item) {
      //       this.currentProduct.product_type_id = item.id
      //     this.currentProduct.product_type_name = item.name
      //       this.productSearch.product_type_id = item.id
      //       if(item.id) {
      //           this.changeProductType()
      //       }
      //
      //   } else {
      //       this.currentProduct.product_type_id = null
      //       this.productSearch.product_type_id = null
      //   }
      // },

      // selectProduct(item) {
      //   if(item) {
      //       this.currentProduct.product_id = item.id
      //     this.currentProduct.product_code = item.code
      //     this.currentProduct.product_name = item.name
      //       this.changeProduct()
      //   } else {
      //       this.currentProduct.product_id = null
      //   }
      // },

    /**
     *  Event change customer
     */
    changeCustomer() {
        if(this.customerSelect && this.customerSelect.id) {
          this.trade.customer_id = this.customerSelect.id
          this.trade.customer_name = this.customerSelect.name

          // Call api: get user info detail
          this.loadCusDetail = true
          quotationApi.getCustomerDetail(this.customerSelect.id).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              let customer = res.data.data
              this.currentCustomer = JSON.parse(JSON.stringify(customer))

              this.trade.customer_phone = customer.phone_number
              this.trade.customer_address = customer.address
              this.trade.customer_email = customer.email
              this.trade.customer_tax_code = customer.tax_code
              this.trade.customer_company_type_id = customer.company_type
              this.trade.contact_person_name = customer.contact_person_name
              this.trade.contact_person_phone = customer.contact_person_phone
              this.trade.customer_status = customer.customer_order_number && customer.customer_order_number > 0 ? 2 : 1
            }
            this.loadCusDetail = false
          }).catch(err => {
            this.loadCusDetail = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
        // else {
        //   this.refreshCustomerInfo()
        // }
    },

    calculateProductProject(product) {
        if (!product.price_list) {
            product.price_list = 0
        }
        if (!product.discount) {
            product.discount = 0
        }
        if (!product.price) {
            product.price = 0
        }
        if (!product.discount_sale) {
          product.discount_sale = 0
        }
        if (!product.discount_original_price) {
          product.discount_original_price = 0
        }
        if(!product.profit_on_item) {
            product.profit_on_item = 0
        }
        if(!product.quantity) {
            product.quantity = 0
        }
        if(!product.price_sell) {
            product.price_sell = 0
        }

        let discount_temp = product.discount_sale
        if(discount_temp == 0) {
          discount_temp = product.discount_original_price
        }

        if(!product.price_list) {
          product.price_list = product.price
          product.discount = 0
        } else {
          if(product.discount == 0) {
            product.price_list = product.price
          } else {
            product.discount = Math.round((((product.price_list - product.price) / product.price_list) * 100) * 100) / 100
          }
        }

        if (!product.price) {
          product.price = Math.round(product.price_list * (100 - product.discount) / 100)
        }

        product.profit_on_item = Math.round(product.price_list * discount_temp / 100)

        // product.price_sell = product.profit_on_item + parseInt(product.price)

        product.amount_sell = product.price_sell * product.quantity
        product.profit = Math.round((parseInt(product.price_sell) - parseInt(product.price)) * product.quantity)

        return product

      },

    /**
     *  Event change customer
     */
    changeProject() {
        if(this.projectSelect && this.projectSelect.id) {
          // Call api: get project detail
          this.loadProjectDetail = true
          quotationApi.getProjectDetail(this.projectSelect.id).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              let products = res.data.data
              this.currentProduct.project_name = this.projectSelect.name

              // let product_index = this.trade.products.length + 1
              for(let product of products) {
                product.product_code_input = null
                product.product_name_input = null
                product.unit_id_input = null
                product.unit_name_input = null
                product.brand_id_input = null
                product.brand_name_input = null
                product.discount_sale = 0 // TODO
                product.discount_original_price = 0 // TODO
                product.is_available_in_repo = null // TODO
                product.note = null // TODO
                product.properties = [] // TODO: hiện tại ciPro ko dùng tới properties
                product.index = this.trade.products.length + 1  //product_index

                product.project_brand_id = this.projectSelect.brand_id
                product.project_brand_name = this.projectSelect.brand_name
                product.project_unit_id = this.projectSelect.unit_id
                product.project_unit_name = this.projectSelect.unit_name

                product.target_unit_id = null
                product.target_unit_name = null
                product.conversion_value = null
                product.quantity_root = null

                let item = this.calculateProductProject(product)

                this.trade.products.push(item)

                // product_index += 1
              }
              this.handleListProduct()
              this.calculateAmount()
              this.handleProductExcel()

              // Lưu nháp
              if(this.trade.id) {
                this.updateDraft()
              } else {
                this.saveDraft()
              }
            }
            this.loadProjectDetail = false
          }).catch(err => {
            this.loadProjectDetail = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
    },

    changeProjectType() {
      if(this.currentProduct.project_type == 0) {
        this.projectSelect = this.projectOptions[0]
      } else {
        this.currentProduct.project_name = null
        this.currentProduct.project_brand_id = null
        this.currentProduct.project_brand_name = null
        this.currentProduct.project_unit_id = null
        this.currentProduct.project_unit_name = null
      }
    },

    refreshCustomerInfo() {
      this.trade.customer_id = null
      this.trade.customer_name = null
      this.trade.customer_phone = null
      this.trade.customer_address = null
      this.trade.customer_email = null
      this.trade.customer_tax_code = null
      this.trade.customer_company_type_id = null
      this.trade.contact_person_name = null
      this.trade.contact_person_phone = null
      this.trade.customer_status = null
    },

    /**
     * Refresh current product
     */
    refreshCurrentProduct() {
      this.currentProduct.index = -1
      this.currentProduct.product_type = 0
      // this.currentProduct.project_name = null
      this.currentProduct.project_quantity = 1
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
      this.currentProduct.discount_sale = 0
      this.currentProduct.discount_original_price = 0
      this.currentProduct.profit_on_item = 0
      this.currentProduct.amount = null
      this.currentProduct.price_sell = null
      this.currentProduct.amount_sell = null
      this.currentProduct.profit = 0
      this.currentProduct.quantity_repo = null
      this.currentProduct.quantity = null
      this.currentProduct.is_available_in_repo = null
      this.currentProduct.properties = []
      this.currentProduct.note = null
      this.currentProduct.description = []
      this.currentProduct.target_unit_id = null
      this.currentProduct.target_unit_name = null
      this.currentProduct.conversion_value = null
      this.currentProduct.quantity_root = null

      this.productSelect = this.productOptions[0]
    },

    refreshTradeInfo() {
      this.trade = {
        "id": null,
        "quotation_number": null,
        "status": -1,
        "type": 0,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_address": null,
        "customer_tax_code": null,
        "customer_company_type_id": null,
        "contact_person_name": null,
        "contact_person_phone": null,
        "customer_status": 1,
        "sub_total": 0,
        "extra_fee": null,
        "note_extra_fee": null,
        "fixed_discount": null,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "profit": 0,
        "bank_account_id": null,
        "payment_method": 'TT 100% trước khi giao hàng',
        "payment_method_input": null,
        "shipping_agreement": null,
        "shipping_fee": 0,
        "quotation_expiry_date": 3,
        "staff_in_charge": null,
        "description": null,
        "products": [],
        "promotions": [],
        "show_price_project": 'true',
        "shipping_date": '3-5 ngày kể từ ngày đặt hàng',
        "guarantee": 'Mới 100% bảo hành theo nhà Sản Xuất',
        "attach_doc": null
      }
      if(url.includes("quotation-project")) {
        this.trade.type = 1 // Báo giá dự án
        this.trade.guarantee = '1 năm' // Báo giá dự án
        this.trade.quotation_expiry_date = 7
      }
    },

    /**
     * Tính toán thành tiền sản phẩm
     */
    calculateAmount(keyInput) {
      let amount = 0
        // let total_profit_margin = 0
        let total_profit = 0
      for (let i in this.trade.products) {
        amount += Math.round((this.trade.products[i].price_sell + '').replaceAll(",", "") * (this.trade.products[i].quantity + '').replaceAll(",", ""))
          // total_profit_margin += parseFloat(this.trade.products[i].profit_margin)
          let profit = (this.trade.products[i].profit + "").replaceAll(",", "")
          total_profit += parseInt(profit)
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

      this.trade.profit = this.currencyFormat(total_profit - parseInt(fixed_discount))
      // this.trade.profit_margin = total_profit_margin
      this.trade.total = this.currencyFormat(amount + parseInt(extra_fee) - parseInt(fixed_discount) + vat_value)

      // Check reload bank account
      if(keyInput == "vat") {
          this.handleBankAccount()
      }

      // Tính toán amount theo brand
      this.calculateProductAmountByBrand()
    },

    calculateProductAmountByBrand() {
      this.brands_amount = []

      let brands_name = []
      let brands_amount = []
      for (let product of this.trade.products) {
        let brand_name = product.brand_name
        if(!brand_name) {
          brand_name = product.brand_name_input
        }
        if(!brand_name) {
          break
        }
        let price = (product.price + "").replaceAll(",", "")
        let quantity = (product.quantity + "").replaceAll(",", "")
        let amount = Math.round(parseInt(price) * parseFloat(quantity))
        if(brands_name.includes(brand_name)) {
          for(let brand of brands_amount) {
            if(brand.name == brand_name) {
              brand.amount += amount
              break
            }
          }
        } else {
          let item = {"name": brand_name, "amount": amount}
          brands_amount.push(item)
          brands_name.push(brand_name)
        }
      }
      this.brands_amount = brands_amount
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
      if(!this.trade.bank_account_id && this.bankAccountOptionStore.length) {
        this.trade.bank_account_id = this.bankAccountOptionStore[0].id
      }
      this.changeBankAccount()
    },

    /**
     *  Xác nhận sản phẩm
     */
    confirmBuyProduct() {
      console.log("xx2:" + JSON.stringify(this.currentProduct))
      // // TODO: kiểm tra trùng sản phẩm
      // for(let product of this.trade.products) {
      //   if(this.currentProduct.product_id == product.product_id) {
      //     this.popToast('danger', "Sản phẩm này đã được thêm vào danh sách sản phẩm báo giá bên dưới. Vui lòng kiểm tra lại!")
      //     return
      //   }
      // }

      if(this.trade.type == 1 && !this.currentProduct.project_name) {
            this.popToast('danger', "Vui lòng nhập tên dự án")
            return
      }
      if(this.trade.type == 1 && !this.currentProduct.project_quantity) {
            this.popToast('danger', "Vui lòng nhập số lượng dự án")
            return
      }

      // Check product group
      if (!this.currentProduct.product_group_id) {
        this.currentProduct.product_group_id = null
        this.currentProduct.product_group_name = null
      }

      // Check product type
      if (!this.currentProduct.product_type_id) {
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
        if(this.is_have_price_sell) {
          this.currentProduct.price = 0
        } else {
          this.popToast('danger', "Vui lòng nhập giá bán sản phẩm")
          return
        }
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
      this.currentProduct.amount = Math.round(this.currentProduct.price * this.currentProduct.quantity)

      if(!this.currentProduct.price_sell) {
          this.currentProduct.price_sell = this.currentProduct.price
      }
      if(this.currentProduct.discount_sale == "" || this.currentProduct.discount_sale == null) {
          this.currentProduct.discount_sale = 0
      }
      if(this.currentProduct.discount_original_price == "" || this.currentProduct.discount_original_price == null) {
          this.currentProduct.discount_original_price = 0
      }
      this.currentProduct.price_sell = (this.currentProduct.price_sell + "").replaceAll(",", "")
      this.currentProduct.profit = (this.currentProduct.profit + "").replaceAll(",", "")
      this.currentProduct.amount_sell = Math.round(this.currentProduct.price_sell * this.currentProduct.quantity)


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
        this.currentProduct.index = this.trade.products.length + 1
        this.trade.products.push(JSON.parse(JSON.stringify(this.currentProduct)))
      } else {
        // Cập nhật product
        this.trade.products[this.currentProduct.index - 1] = JSON.parse(JSON.stringify(this.currentProduct))
      }

      // Nếu là báo giá dự an thì phải handle lại danh sách sản phẩm
      if(this.trade.type == 1) {
        this.handleListProduct()
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

    handleListProduct() {
      if(this.trade.products.length > 0) {
        console.log("bbbbbbbbbbbbbbbbbbbbbb")
        console.log(this.trade.products)
        console.log("bbbbbbbbbbbbbb")

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
            project.project_unit_name = p.project_unit_name
            project.project_quantity = parseFloat(p.project_quantity)
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

        console.log("aaaaaa")
        console.log(this.projectProducts)
        console.log("aaaaaa")
      }
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
      for (let i in this.productOptionStore) {
        if(product_id == this.productOptionStore[i].id) {
          if(type == 'sell') {
            this.productOptionStore[i].quantity = parseFloat(this.productOptionStore[i].quantity) - parseFloat(quantitySell)
          }
          if(type == 'delete') {
            this.productOptionStore[i].quantity = parseFloat(this.productOptionStore[i].quantity) + parseFloat(quantitySell)
          }

          // Update quantity cả trong thuộc tính
          if(this.productOptionStore[i].properties.length > 0) {
            for(let j in this.productOptionStore[i].properties) {
              let properties_str = this.propertiesToString(this.productOptionStore[i].properties[j])
              let properties_input_str = this.propertiesToString(properties)

              if(properties_str.includes(properties_input_str)) {
                for(let x in this.productOptionStore[i].properties[j]) {
                  if(this.productOptionStore[i].properties[j][x].name == "quantity") {
                    if(type == 'sell') {
                      this.productOptionStore[i].properties[j][x].value = parseFloat(this.productOptionStore[i].properties[j][x].value) - parseFloat(quantitySell)
                    }
                    if(type == 'delete') {
                      this.productOptionStore[i].properties[j][x].value = parseFloat(this.productOptionStore[i].properties[j][x].value) + parseFloat(quantitySell)
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
      data = this.handleTradeInfoBeforeSave(data)
      if(data.products.length == 0) {
        return
      }

      quotationApi.saveDraftQuotation(data).then(res => {
        if(res != null && res.data != null){

          if (res.data.status == 200) {
            this.popToast('success', "Lưu nháp thành công!")

            // this.trade.products = this.reformatProduct(data.products)
            let response = res.data.data
            this.trade.id = response.quotation_id
            this.trade.quotation_number = response.quotation_number
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

      return product
    },

    formatProduct(products) {
        for(let product of products) {
          product = this.formatProductItem(product)
        }
        return products
    },

      reformatProductItem(product) {
        product.price_list = this.currencyFormat((product.price_list + '').replaceAll(",", ""))
        product.price = this.currencyFormat((product.price + '').replaceAll(",", ""))
        product.profit_on_item = this.currencyFormat((product.profit_on_item + '').replaceAll(",", ""))
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

        return product
      },

    reformatProduct(products) {
      for(let product of products) {
          product = this.reformatProductItem(product)
      }
      return products
    },

    handleTradeInfoBeforeSave(data) {

      if(data.show_price_project == 'true') {
        data.show_price_project = true
      } else {
        data.show_price_project = false
      }

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

      let profit = 0
      if(data.profit) {
        profit = (data.profit + '').replaceAll(",", "")
      }
      data.profit = profit

      data.total = (data.total + '').replaceAll(",", "")

      let vat_value = 0
      if(data.vat_value) {
          vat_value = (data.vat_value + '').replaceAll(",", "")
      }
      data.vat_value = vat_value

      let shipping_fee = 0
      if(data.shipping_fee) {
        shipping_fee = (data.shipping_fee + '').replaceAll(",", "")
      }
      data.shipping_fee = shipping_fee

      // Check products
      data.products = this.formatProduct(data.products)

      return data
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
      data = this.handleTradeInfoBeforeSave(data)
      if(data.products.length == 0) {
        return
      }

      quotationApi.updateDraftQuotation(data).then(res => {
        if(res != null && res.data != null){
            if (res.data.status == 200) {
              this.popToast('success', "Lưu nháp thành công!")
              // this.trade.products = this.reformatProduct(data.products)
          }
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

        // validate
        if(!data.customer_name || !data.contact_person_name || !data.contact_person_phone
          || data.customer_company_type_id == null || !data.customer_status) {
          this.popToast('danger', "Hãy nhập đủ thông tin bắt buộc của khách hàng")
          return
        }

        // Check products
        data = this.handleTradeInfoBeforeSave(data)
        if(data.products.length == 0) {
          return
        }

        this.saving = true

      quotationApi.saveQuotation(data).then(res => {
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

    // handlePrintProvisionalInvoice() {
    //   if(this.trade.type == 0) {
    //     this.openModalChooseFilePrint()
    //   } else {
    //     this.printProvisionalInvoice()
    //   }
    // },

    /**
     * In hoá đơn tạm tính
     */
    printProvisionalInvoice() {
        console.log("in")
        console.log(JSON.stringify(this.trade))

      var mywindow = window.open('', 'PRINT', 'height=900,width=1200');

      mywindow.document.write('<html><head><title> </title><style>');
      mywindow.document.write(' body {font-size: 14px;} ');
      mywindow.document.write(' .print-text-center {text-align: center;} ');
      mywindow.document.write(' .print-text-left {text-align: left;} ');
      mywindow.document.write(' .print-text-right {text-align: right;} ');
      mywindow.document.write(' .print-width-50-left {width: 48%; float: left;} ');
      mywindow.document.write(' .print-width-50-right {width: 48%; float: right;} ');
      mywindow.document.write(' .print-border {border: gray solid 0.03em;} ');
      mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ');
      mywindow.document.write(' .print-table-border > table, th, td {border: gray solid 0.03em; border-collapse: collapse;} ');
      mywindow.document.write(' .print-border {border: gray solid 0.03em; border-collapse: collapse;} ');
      mywindow.document.write(' .print-no-border {border: none;} ');
      mywindow.document.write(' .tr-bg {background-color: #eeece1 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ');
      mywindow.document.write(' .custom-line-height tr { line-height: 25px; } ');
      mywindow.document.write(' .project_name {background-color: #0C5395 !important; color: white; font-weight: bold; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ');

      mywindow.document.write('</style></head><body >');
      mywindow.document.write(document.getElementById('provisionalInvoice').innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      setTimeout(function() {
        mywindow.print();
        mywindow.close();
      }, 1000);

      // mywindow.print();
      // mywindow.close();

      return true;
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      console.log("this.userRole: " + this.userRole)
      if(this.userRole == "staff") {
          this.$router.push("/quotation-staff")
      } else {
          this.$router.push("/quotation-all")
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
        if(this.trade.shipping_fee) {
          this.trade.shipping_fee = commonFunc.intergerOnly(this.trade.shipping_fee)
          this.trade.shipping_fee = parseInt(this.trade.shipping_fee)
          this.trade.shipping_fee = this.currencyFormat(this.trade.shipping_fee + "")
        } else {
          this.trade.shipping_fee = 0
        }
      },

      calculateCurrentProduct(key) {
        let price_list = parseInt((this.currentProduct.price_list + "").replaceAll(",", ""))
        let discount = (this.currentProduct.discount + "").replaceAll(",", "")
        let price_buy = (this.currentProduct.price + "").replaceAll(",", "")
        let discount_sale = (this.currentProduct.discount_sale + "").replaceAll(",", "")
        let discount_original_price = (this.currentProduct.discount_original_price + "").replaceAll(",", "")
        let profit_on_item = (this.currentProduct.profit_on_item + "").replaceAll(",", "")
        if(profit_on_item == 'null' || profit_on_item == "") {
              profit_on_item = 0
          }
        let price_sell = (this.currentProduct.price_sell + "").replaceAll(",", "")
        let quantity = (this.currentProduct.quantity + "").replaceAll(",", "")
          if(quantity == 'null') {
              quantity = ""
          }

        if (!price_list) {
            discount = 0
        }
        if (discount_sale == "" || discount_sale == 'null') {
          discount_sale = 0
        }
        if (discount_original_price == "" || discount_original_price == 'null') {
          discount_original_price = 0
        }
        let discount_temp = discount_sale
        if(discount_temp == 0) {
          discount_temp = discount_original_price
        }
        if(key == 'price_list' || key == 'discount') {
          if(price_list && discount) {
            discount = Math.round(discount * 100) / 100
            price_buy = Math.round(price_list * (100 - discount) / 100)
            this.currentProduct.price = this.currencyFormat(price_buy)

             discount_temp = Math.round(discount_temp * 100) / 100
              profit_on_item = Math.round(price_list * discount_temp / 100)
              this.currentProduct.profit_on_item = this.currencyFormat(profit_on_item)

              price_sell = profit_on_item + parseInt(price_buy)
              this.currentProduct.price_sell = this.currencyFormat(price_sell)

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

            if(profit_on_item != "" && profit_on_item != "null") {
              price_sell = parseInt(profit_on_item) + parseInt(price_buy)
              this.currentProduct.price_sell = this.currencyFormat(price_sell)
            }

          if (price_buy && price_sell && quantity) {
            this.currentProduct.amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
            this.currentProduct.profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
          }
        }

        if(key == 'discount_sale') {
          if(price_buy) {
            discount_temp = Math.round(discount_temp * 100) / 100
            profit_on_item = Math.round(price_list * discount_temp / 100)
            this.currentProduct.profit_on_item = this.currencyFormat(profit_on_item)
            this.currentProduct.price_sell = this.currencyFormat(profit_on_item + parseInt(price_buy))

            if(quantity && quantity != 'null') {
              this.currentProduct.amount_sell = this.currencyFormat(Math.round(profit_on_item + parseInt(price_buy) * quantity))
              this.currentProduct.profit = this.currencyFormat(Math.round(profit_on_item * quantity))
            }
          }
          if(discount_sale) {
            this.currentProduct.discount_original_price = 0
          }
        }

        if(key == 'discount_original_price') {
          if(price_buy) {
            discount_temp = Math.round(discount_temp * 100) / 100
            profit_on_item = Math.round(price_buy * discount_temp / 100)
            this.currentProduct.profit_on_item = this.currencyFormat(profit_on_item)

            this.currentProduct.price_sell = this.currencyFormat(profit_on_item + parseInt(price_buy))

            if(quantity && quantity != 'null') {
              this.currentProduct.amount_sell = this.currencyFormat(Math.round(profit_on_item + parseInt(price_buy) * quantity))
              this.currentProduct.profit = this.currencyFormat(Math.round(profit_on_item * quantity))
            }
          }
          if(discount_original_price) {
            this.currentProduct.discount_sale = 0
          }
        }

        if(key == 'profit_on_item') {
          if(price_list) {
            let discount_sale_temp = Math.round(((profit_on_item / price_list) * 100) * 100) / 100
            this.currentProduct.discount_sale = discount_sale_temp
            this.currentProduct.profit_on_item = this.currencyFormat(profit_on_item)
            this.currentProduct.price_sell = this.currencyFormat(parseInt(profit_on_item) + parseInt(price_buy))
          } else {
            if(price_buy) {
              let discount_sale_temp = Math.round(((profit_on_item / price_buy) * 100) * 100) / 100
              this.currentProduct.discount_original_price = discount_sale_temp
              this.currentProduct.discount_sale = 0
              this.currentProduct.profit_on_item = this.currencyFormat(profit_on_item)
              this.currentProduct.price_sell = this.currencyFormat(parseInt(profit_on_item) + parseInt(price_buy))
            }
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

    changeProductNote(index) {
      let note = document.getElementById("note_" + index).value
      if(note == 'null' || note == 'Nan') {
        note = ""
      }
      this.trade.products[index].note = note
    },

    changeProjectProductNote(index, project_index=0, product_index=0) {
      let index_item_str = 'project_' + index

      let note = document.getElementById("note_" + index_item_str).value
      if(note == 'null' || note == 'Nan') {
        note = ""
      }
      this.trade.products[product_index-1].note = note
      this.handleListProduct()
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
          let project_quantity_old = parseFloat((product['project_quantity'] + '').replaceAll(",",""))
          product['project_quantity'] = project_quantity
         let product_quantity = (parseFloat(product['quantity']) * project_quantity) / project_quantity_old
          product['quantity'] = product_quantity
          let price_sell = parseInt((product['price_sell'] + '').replaceAll(",", ""))
          let price_buy = parseInt((product['price'] + '').replaceAll(",", ""))
          if(!price_buy) {
              price_buy = 0
          }
          product['amount_sell'] = price_sell * product_quantity
          product['profit'] = Math.round((parseInt(price_sell) - parseInt(price_buy)) * product_quantity)
        }
      }
      // Tính toán amount
      this.calculateAmount()

      this.handleProductExcel()

      // Lưu nháp
      if(this.trade.id) {
        this.updateDraft()
      } else {
        this.saveDraft()
      }
      this.handleListProduct()
    },

    changeProjectName(item_index, project_index=0) {
      let index = 0
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
      this.updateDraft()
      this.handleListProduct()
    },

    changeProductItem(key, index_item, project_index = 0, product_index = 0) {
        console.log("changeProductItem index_item: " + index_item)
        let index_item_str = index_item
        if(project_index) {
          index_item_str = 'project_' + index_item
        }

        let price_list = document.getElementById("price_list_" + index_item_str).value
        if(price_list && price_list != 'null') {
          price_list = parseInt((price_list + "").replaceAll(",", ""))
        } else {
          price_list = 0
        }

        let discount = document.getElementById("discount_" + index_item_str).value
        if(discount && discount != 'null') {
          discount = (discount + "").replaceAll(",", "")
        } else {
          discount = 0
        }

        let price_buy = document.getElementById("price_" + index_item_str).value
        if(price_buy && price_buy != 'null') {
          price_buy = parseInt((price_buy + "").replaceAll(",", ""))
        } else {
          price_buy = 0
        }

        let discount_sale = document.getElementById("discount_sale_" + index_item_str).value
        if(discount_sale && discount_sale != 'null') {
          discount_sale = (discount_sale + "").replaceAll(",", "")
        } else {
          discount_sale = 0
        }

        let discount_original_price = document.getElementById("discount_original_price_" + index_item_str).value
        if(discount_original_price && discount_original_price != 'null') {
          discount_original_price = (discount_original_price + "").replaceAll(",", "")
        } else {
          discount_original_price = 0
        }

        let profit_on_item = document.getElementById("profit_on_item_" + index_item_str).value
        if(profit_on_item && profit_on_item != 'null') {
          profit_on_item = parseInt((profit_on_item + "").replaceAll(",", ""))
        } else {
          profit_on_item = 0
        }

        let price_sell = document.getElementById("price_sell_" + index_item_str).value
        if(price_sell && price_sell != 'null') {
          price_sell = parseInt((price_sell + "").replaceAll(",", ""))
        } else {
          price_sell = 0
        }

        let quantity = document.getElementById("quantity_" + index_item_str).value
        if(quantity && quantity != 'null') {
          quantity = (quantity + "").replaceAll(",", "")
        } else {
          quantity = 0
        }

        if (!price_list) {
            discount = 0
        }
        let discount_temp = discount_sale
        if(discount_temp == 0) {
          discount_temp = discount_original_price
        }

        let index = index_item - parseInt(project_index)
        if(project_index) {
          index = parseInt(product_index) - 1
        }
        // if(product_index) {
        //   index = product_index - 1
        // }
        console.log("changeProductItem index: " + index)

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

              this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
              this.trade.products[index].profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
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

          price_sell = profit_on_item + parseInt(price_buy)
          this.trade.products[index].price_sell = this.currencyFormat(price_sell)

          this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
          this.trade.products[index].profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))
        }

        if(key == 'discount_sale') {
          if(price_buy) {
            discount_temp = document.getElementById("discount_sale_" + index_item_str).value
            discount_temp = (discount_temp + "").replaceAll(",", "")
            profit_on_item = Math.round(price_list * discount_temp / 100)
            this.trade.products[index].profit_on_item = this.currencyFormat(profit_on_item)
            price_sell = profit_on_item + parseInt(price_buy)
            this.trade.products[index].price_sell = this.currencyFormat(price_sell)

            this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
            this.trade.products[index].profit = this.currencyFormat(Math.round(profit_on_item * quantity))
          }
          if(discount_sale) {
            this.trade.products[index].discount_original_price = 0
            this.trade.products[index].discount_sale = discount_sale
          }
        }

        if(key == 'discount_original_price') {
          if(price_buy) {
            discount_temp = document.getElementById("discount_original_price_" + index_item_str).value
            discount_temp = (discount_temp + "").replaceAll(",", "")
            discount_temp = Math.round(discount_temp * 100) / 100
            profit_on_item = Math.round(price_buy * discount_temp / 100)
            this.trade.products[index].profit_on_item = this.currencyFormat(profit_on_item)
            price_sell = profit_on_item + parseInt(price_buy)
            this.trade.products[index].price_sell = this.currencyFormat(price_sell)

            this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
            this.trade.products[index].profit = this.currencyFormat(Math.round(profit_on_item * quantity))
          }
          if(discount_original_price) {
            this.trade.products[index].discount_sale = 0
            this.trade.products[index].discount_original_price = discount_original_price
          }
        }

        if(key == 'profit_on_item') {
          if(price_list) {
            let discount_sale_temp = Math.round(((profit_on_item / price_list) * 100) * 100) / 100
            this.trade.products[index].discount_sale = discount_sale_temp
            this.trade.products[index].discount_original_price = 0
            this.trade.products[index].profit_on_item = this.currencyFormat(profit_on_item)
            price_sell = parseInt(profit_on_item) + parseInt(price_buy)
            this.trade.products[index].price_sell = this.currencyFormat(price_sell)

            this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
            this.trade.products[index].profit = this.currencyFormat(Math.round(profit_on_item * quantity))

          } else {
            if(price_buy) {
              let discount_sale_temp = Math.round(((profit_on_item / price_buy) * 100) * 100) / 100
              this.trade.products[index].discount_original_price = discount_sale_temp
              this.trade.products[index].discount_sale = 0
              this.trade.products[index].profit_on_item = this.currencyFormat(profit_on_item)
              price_sell = parseInt(profit_on_item) + parseInt(price_buy)
              this.trade.products[index].price_sell = this.currencyFormat(price_sell)

              this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
              this.trade.products[index].profit = this.currencyFormat(Math.round(profit_on_item * quantity))
            }
          }

        }

        if(key == 'price_sell') {
          this.trade.products[index].price_sell = this.currencyFormat(price_sell)
          this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
          this.trade.products[index].profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))

        }

        if(key == 'quantity') {
          // Calculate profit
          // if (price_sell) {
            this.trade.products[index].amount_sell = this.currencyFormat(Math.round(price_sell * quantity))
          // }
          // if (price_buy && price_sell) {
            this.trade.products[index].profit = this.currencyFormat(Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity))

          // }
          this.trade.products[index].quantity = this.currencyFormat(quantity)
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

      // fortmatProductItem(index) {
      //   let item = this.trade.products[index]
      //
      //   let price_list = this.currencyFormat(item.price_list)
      //   this.trade.products[index].price_list = this.currencyFormat(price_list)
      //   document.getElementById("price_list_" + index).value = price_list
      //
      //     let price = this.currencyFormat(item.price)
      //   this.trade.products[index].price = price
      //   document.getElementById("price_" + index).value = price
      //
      // },

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

      // changePriceSell() {
      //   let price_sell = this.currentProduct.price_sell.replaceAll(",", "")
      //     this.currentProduct.price_sell = this.currencyFormat(price_sell)
      //
      //     // Calculate profit margin
      //     let price_buy = this.currentProduct.price.replaceAll(",", "")
      //
      //     if (price_buy && price_sell) {
      //         let margin = parseInt(price_sell) - parseInt(price_buy)
      //         this.currentProduct.profit_margin = Math.round(((margin / price_buy) * 100) * 100) / 100
      //     }
      //
      //
      // },
      //
      // changeQuantity() {
      //   let quantity = this.currentProduct.quantity.replaceAll(",", "")
      //   this.currentProduct.quantity = this.currencyFormat(quantity)
      //
      //     // Calculate profit
      //     let price_sell = this.currentProduct.price_sell.replaceAll(",", "")
      //     let price_buy = this.currentProduct.price.replaceAll(",", "")
      //     if (price_buy && price_sell && quantity) {
      //         this.currentProduct.profit = this.currencyFormat(parseInt((parseInt(price_sell) - parseInt(price_buy)) * quantity))
      //     }
      //
      // },

    // editProduct(index) {
    //   this.currentProduct = this.trade.products[index]
    //   if(this.currentProduct.product_group_id) {
    //     this.productGroupSelect = this.getProductGroupItemById(this.currentProduct.product_group_id)
    //   } else {
    //     this.productGroupSelect = {}
    //   }
    //   if(this.currentProduct.product_type_id) {
    //     this.productTypeSelect = this.getProductTypeItemById(this.currentProduct.product_type_id)
    //   } else {
    //     this.productTypeSelect = {}
    //   }
    //   if(this.currentProduct.product_id) {
    //     this.productSelect = this.getProductItemById(this.currentProduct.product_id)
    //   } else {
    //     this.productSelect = {}
    //   }
    //   this.currentProduct.index = index
    //   this.currentProduct.price_list = this.currencyFormat(this.currentProduct.price_list)
    //   this.currentProduct.price = this.currencyFormat(this.currentProduct.price)
    //   this.currentProduct.profit_on_item = this.currencyFormat(this.currentProduct.profit_on_item)
    //   this.currentProduct.quantity = this.currencyFormat(this.currentProduct.quantity)
    //   this.currentProduct.amount = this.currencyFormat(this.currentProduct.amount)
    //   this.currentProduct.price_sell = this.currencyFormat(this.currentProduct.price_sell)
    //   this.currentProduct.profit = this.currencyFormat(this.currentProduct.profit)
    //   this.currentProduct.amount_sell = this.currencyFormat(this.currentProduct.amount_sell)
    // },

    deleteProductByProjectName(project_name) {
      let products = []
      for (let product of this.trade.products) {
        if(product.project_name != project_name) {
          products.push(product)
        }
      }
      this.trade.products = products
    },

    editProject(project_name) {
      this.currentProduct.project_type = '0'
      this.currentProduct.project_name = project_name
      // location.href = "#";
      location.href = "#productInfoArea";
    },

      deleteProduct(ind, product_id, quantity, properties) {
        this.trade.products.splice(parseInt(ind), 1) // Xoá sp

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
        for (let product of products) {
          product.index = index
          this.trade.products.push(product)
          index += 1
        }

        // Calculate
        this.calculateAmount()

        // Update
        // this.checkUpdateDraft()
        this.updateDraft()

        // Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
        this.updateQuantityRepo(product_id, quantity, properties, 'delete')

        this.handleProductExcel()
      },

    deleteProductOfProject(ind, product_type, project_name, product_id, quantity, properties) {

        // Remove item
        if(product_type == 0) {
          this.deleteProductByProjectName(project_name)
        } else {
          this.trade.products.splice(parseInt(ind) - 1, 1) // Xoá sp
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
        for (let product of products) {
          product.index = index
          this.trade.products.push(product)
          index += 1
        }

        if(this.trade.type == 1) {
          this.handleListProduct()
        }

        // Calculate
        this.calculateAmount()

        // Update
        // this.checkUpdateDraft()
        this.updateDraft()

        // Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
        this.updateQuantityRepo(product_id, quantity, properties, 'delete')

        this.handleProductExcel()
      },

      upProductIndex(index, is_project=false) {
          if(index > 1) {
              this.trade.products[index - 1].index = this.trade.products[index - 1].index - 1
              this.trade.products[index - 2].index = this.trade.products[index - 1].index + 1

              this.trade.products.sort(function(a, b){return a.index - b.index});
          }
          if(is_project) {
              this.handleListProduct()
          }
      },

      deleteTrade(trade_id) {
        quotationApi.deleteQuotation(trade_id, 'admin').then(res => {
        }).catch(err => {
        })
      },

      printInvoice() {
        this.printProvisionalInvoice()
      },

    /**
     * Xuất file excel
     */
    exportExcel(type='excel') {
      this.exportingExcel = true
      quotationApi.exportExcel({'id': this.trade.id, 'type': type}).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            let data = res.data.data
            commonFunc.downloadFile(RootAPI.replace('api/', '') + data.file_path, data.file_name)
          }

          this.exportingExcel = false

        }).catch(err => {
          this.exportingExcel = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
    },

    // /**
    //  * Only input integer and point
    //  */
    // integerAndCommaOnly(item) {
    //   let valueInput = item.value
    //   let result = commonFunc.integerAndCommaOnly(valueInput)
    //
    //   result = this.currencyFormat((result + "").replace(",",""))
    //   item.value = result
    // },

      /**
     * Only input integer and point
     */
    integerPointAndCommaOnly(item) {
      console.log("integerPointAndCommaOnly")
      console.log("1")
      console.log(item)
      let valueInput = item.value
      console.log("2")
      console.log(valueInput)
      valueInput = valueInput.replaceAll(",", "").replaceAll(".", "")
      console.log("3")
      console.log(valueInput)
      let result = commonFunc.integerPointAndCommaOnly(valueInput)
      console.log("4")
      console.log(result)

      result = this.currencyFormat(result)
      console.log("5")
      console.log(result)
      item.value = result
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
        if(num === 0) {
            return "0"
        }
        if(num) {
            num = (num + "").replaceAll(",", "")
        }

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

    openModalChooseFilePrint() {
      this.$bvModal.show('modal-choose-print-file-type')
    },

    hideModalChooseFilePrint() {
      this.$bvModal.hide('modal-choose-print-file-type')
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

    editPaymentMethod(index) {
      this.paymentMethod = this.itemsPaymentMethod[index]
      this.btn_payment_method_text = "Cập nhật"
    },

    handleListOptionPaymentMethod(items) {
      this.optionsPaymentMethod = [{value: null, text: 'Khác'}]
      for (let item of items) {
        this.optionsPaymentMethod.push({value: item.payment_method, text: item.payment_method})
      }
    },

    getListPaymentMethod() {
      this.loadingPaymentMethod = true
      paymentMethodApi.getListPaymentMethod().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let data = res.data.data
          this.itemsPaymentMethod = data
        }
        this.loadingPaymentMethod = false
      }).catch(err => {
        this.loadingPaymentMethod = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    deletedPaymentMethod (id, name) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            paymentMethodApi.deletePaymentMethod(id).then(res => {
              if(res != null && res.data != null && res.data.data != null){
                let data = res.data.data
                this.itemsPaymentMethod = data
                this.handleListOptionPaymentMethod(data)
                this.popToast('success', 'Xoá thành công!')
              }
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },

    cleanPaymentMethod() {
      this.paymentMethod.id = null
      this.paymentMethod.payment_method = null
      this.paymentMethod.debt_date_number = 0
      this.paymentMethod.index = null
      this.btn_payment_method_text = 'Thêm mới'
    },

    addUpdatePaymentMethod () {
      if(!this.paymentMethod.payment_method) {
        this.popToast('danger', 'Vui lòng nhập [Hình thức thanh toán]')
        return
      }
      this.paymentMethod.payment_method = this.paymentMethod.payment_method.trim()
      if(!this.paymentMethod.debt_date_number) {
        this.paymentMethod.debt_date_number = 0
      }

      this.savingPaymentMethod = true

      let id = this.paymentMethod.id
      if(id){
        // Edit
        paymentMethodApi.editPaymentMethod(this.paymentMethod).then(res => {

          if(res != null && res.data != null && res.data.data != null){
            let data = res.data.data
            this.itemsPaymentMethod = data
            this.handleListOptionPaymentMethod(data)
            this.popToast('success', 'Cập nhật thành công!')

            this.cleanPaymentMethod()
          }
          this.savingPaymentMethod = false
        }).catch(err => {
          this.savingPaymentMethod = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        // Add
        paymentMethodApi.addPaymentMethod(this.paymentMethod).then(res => {

          if(res != null && res.data != null && res.data.data != null){
            let data = res.data.data
            this.itemsPaymentMethod = data
            this.handleListOptionPaymentMethod(data)
            this.popToast('success', 'Thêm mới thành công!')

            this.cleanPaymentMethod()
          }
          this.savingPaymentMethod = false
        }).catch(err => {
          this.savingPaymentMethod = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    cleanShippingAgreement() {
      this.shippingAgreement.id = null
      this.shippingAgreement.shipping_agreement = null
      this.shippingAgreement.index = null
      this.btn_shipping_agreement_text = 'Thêm mới'
    },

    editShippingAgreement(index) {
      this.shippingAgreement = this.itemsShippingAgreement[index]
      this.btn_shipping_agreement_text = "Cập nhật"
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

    handleListOptionShippingAgreement(items) {
      this.optionsShippingAgreement = [{value: null, text: ''}]
      for (let item of items) {
        this.optionsShippingAgreement.push({value: item.shipping_agreement, text: item.shipping_agreement})
      }
    },

    getListShippingAgreement() {
      this.loadingShippingAgreement = true
      shippingAgreementApi.getListShippingAgreement().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let data = res.data.data
          this.itemsShippingAgreement = data
        }
        this.loadingShippingAgreement = false
      }).catch(err => {
        this.loadingShippingAgreement = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    deletedShippingAgreement (id, name) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            shippingAgreementApi.deleteShippingAgreement(id).then(res => {
              if(res != null && res.data != null && res.data.data != null){
                let data = res.data.data
                this.itemsShippingAgreement = data
                this.handleListOptionShippingAgreement(data)
                this.popToast('success', 'Xoá thành công!')
              }
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },

    addUpdateShippingAgreement () {
      if(!this.shippingAgreement.shipping_agreement) {
        this.popToast('danger', 'Vui lòng nhập [Thỏa thuận vận chuyển]')
        return
      }
      this.shippingAgreement.shipping_agreement = this.shippingAgreement.shipping_agreement.trim()

      this.savingShippingAgreement = true

      let id = this.shippingAgreement.id
      if(id){
        // Edit
        shippingAgreementApi.editShippingAgreement(this.shippingAgreement).then(res => {

          if(res != null && res.data != null && res.data.data != null){
            let data = res.data.data
            this.itemsShippingAgreement = data
            this.handleListOptionShippingAgreement(data)
            this.popToast('success', 'Cập nhật thành công!')

            this.cleanShippingAgreement()
          }
          this.savingShippingAgreement = false
        }).catch(err => {
          this.savingShippingAgreement = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        // Add
        shippingAgreementApi.addShippingAgreement(this.shippingAgreement).then(res => {

          if(res != null && res.data != null && res.data.data != null){
            let data = res.data.data
            this.itemsShippingAgreement = data
            this.handleListOptionShippingAgreement(data)
            this.popToast('success', 'Thêm mới thành công!')

            this.cleanShippingAgreement()
          }
          this.savingShippingAgreement = false
        }).catch(err => {
          this.savingShippingAgreement = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
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


  .project_bg {
    background-color: #6A9AB0 !important;
  }
</style>
