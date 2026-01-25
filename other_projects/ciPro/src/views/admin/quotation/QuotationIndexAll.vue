<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white shadow rounded-lg p-4">
          <div class="p-4">
            <div class="grid grid-cols-1 gap-4">
              <div class="w-full" cols="6">
                <button
                  class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 float-left btn-width-120"
                  @click="back"
                >
                  Quay lại
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 form-row">
              <div class="w-full" md="12">
                <h4 class="mt-1 text-center text-header">
                  {{ prefix_title }} Báo Giá
                </h4>
              </div>
            </div>
            <hr />

            <!-- Loading -->
            <span class="loading-more" v-show="loading"
              ><i class="fa fa-spinner fa-spin fa-3x"></i
            ></span>

            <div class="grid grid-cols-1 gap-4">
              <div
                class="w-full md:col-span-12 bg-gray-500 text-white title-partner"
              >
                <h5>
                  <span class="float-left">Thông tin người mua</span>
                  <span
                    class="float-right"
                    v-show="showPartnerInfo"
                    @click="showPartnerInfo = !showPartnerInfo"
                    ><i class="fa fa-angle-double-up"
                  /></span>
                  <span
                    class="float-right"
                    v-show="!showPartnerInfo"
                    @click="showPartnerInfo = !showPartnerInfo"
                    ><i class="fa fa-angle-double-down"
                  /></span>
                </h5>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4" v-show="showPartnerInfo">
              <div class="w-full">
                <div class="grid grid-cols-1 gap-4 form-row mt-2">
                  <div class="w-full md:col-span-2 mt-2">
                    <label>
                      <span>Khách hàng</span>
                    </label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <div class="flex gap-2 items-start">
                      <div class="flex-1">
                        <Multiselect
                          v-model="customerSelect"
                          :options="customerOptionStore"
                          :loading="loadingCustomerOptions"
                          :searchable="true"
                          :close-on-select="true"
                          :clear-on-select="false"
                          :preserve-search="false"
                          placeholder="--Chọn khách hàng--"
                          label="name"
                          track-by="id"
                          @select="changeCustomer"
                        >
                        </Multiselect>
                      </div>

                      <button
                        class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                        @click="openModalSearchCustomer"
                      >
                        <i class="fa fa-search"></i>
                      </button>

                      <button
                        class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
                        @click="openModalAddCustomer"
                      >
                        <i class="fa fa-plus"></i>
                      </button>

                      <button
                        v-show="customerSelect.id"
                        class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
                        @click="updateCustomerInfo"
                      >
                        <i class="fa fa-save"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Loading -->
                <span class="loading-more" v-show="loadCusDetail"
                  ><i class="fa fa-spinner fa-spin fa-3x"></i
                ></span>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>
                      Tên khách hàng<span class="error-sybol"></span>
                    </label>
                    <input
                      id="customer_name"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_name"
                      :disabled="saving"
                    />
                  </div>
                  <div>
                    <label>
                      Tên người liên hệ<span class="error-sybol"></span>
                    </label>
                    <input
                      id="contact_person_name"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.contact_person_name"
                      :disabled="saving"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>
                      <span>SĐT khách hàng</span>
                    </label>
                    <input
                      id="customer_phone"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_phone"
                      :disabled="saving"
                      @keyup="integerOnly($event.target)"
                    />
                  </div>
                  <div>
                    <label>
                      Sđt người liên hệ<span class="error-sybol"></span>
                    </label>
                    <input
                      id="contact_person_phone"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.contact_person_phone"
                      :disabled="saving"
                      @keyup="integerOnly($event.target)"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>
                      <span>Địa chỉ khách hàng</span>
                    </label>
                    <input
                      id="address"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_address"
                      :disabled="saving"
                    />
                  </div>
                  <div>
                    <label>Loại CTY<span class="error-sybol"></span> </label>
                    <select
                      class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                      v-model="trade.customer_company_type_id"
                    >
                      <option
                        v-for="option in optionsCompanyType"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Email K.H</label>
                    <input
                      id="customer_email"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_email"
                      :disabled="saving"
                    />
                  </div>
                  <div>
                    <label
                      >Tình trạng K.H<span class="error-sybol"></span
                    ></label>
                    <select
                      class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                      v-model="trade.customer_status"
                      disabled
                    >
                      <option
                        v-for="option in customerStatusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4" v-show="trade.customer_id">
                  <div class="w-full">
                    <p>
                      Số lượng đơn hàng:
                      <b>{{
                        currencyFormat(currentCustomer.number_order_sell || 0)
                      }}</b>
                      | Tổng doanh số mua hàng:
                      <b>{{
                        currencyFormat(currentCustomer.order_sell_amount || 0)
                      }}</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mt-3" id="productInfoArea">
              <div
                class="w-full md:col-span-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white title-partner"
              >
                <h5>
                  <span class="float-left">Thông tin sản phẩm</span>
                  <span
                    class="float-right"
                    v-show="showProductInfo"
                    @click="showProductInfo = !showProductInfo"
                    ><i class="fa fa-angle-double-up"
                  /></span>
                  <span
                    class="float-right"
                    v-show="!showProductInfo"
                    @click="showProductInfo = !showProductInfo"
                    ><i class="fa fa-angle-double-down"
                  /></span>
                </h5>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mt-2" v-show="showProductInfo">
              <div class="w-full md:col-span-12">
                <div
                  class="grid grid-cols-1 gap-4 form-row mt-2"
                  v-show="trade.type == 1"
                >
                  <div class="w-full md:col-span-2 mt-2">
                    <label>
                      <span>Dự án</span>
                    </label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <div class="input-group">
                      <input
                        type="radio"
                        v-model="currentProduct.project_type"
                        name="project_type"
                        value="0"
                        @change="changeProjectType"
                        id="project_type_0"
                      />
                      <label class="ml-4 mt-1" for="project_type_0"
                        >Dự án mới</label
                      >
                      <input
                        type="radio"
                        v-model="currentProduct.project_type"
                        name="project_type"
                        value="1"
                        class="ml-5"
                        @change="changeProjectType"
                        id="project_type_1"
                      />
                      <label class="ml-4 mt-1" for="project_type_1"
                        >Dự án mẫu</label
                      >
                    </div>
                  </div>
                </div>

                <div
                  class="grid grid-cols-1 gap-4"
                  v-show="trade.type == 1 && currentProduct.project_type == 0"
                >
                  <div class="w-full md:col-span-2 mt-2">
                    <label>Tên dự án<span class="error-sybol"></span></label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <input
                      id="project_name"
                      type="text"
                      maxlength="255"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.project_name"
                    />
                  </div>
                </div>

                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                  v-show="trade.type == 1 && currentProduct.project_type == 0"
                >
                  <div>
                    <label>Hãng dự án</label>
                    <select
                      class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                      id="project_brand_id"
                      autocomplete="new-password"
                      v-model="currentProduct.project_brand_id"
                      placeholder="--Chọn hãng dự án--"
                      @change="changeProjectBrand"
                    >
                      <option
                        v-for="option in productBrandOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label>Đơn vị dự án</label>
                    <select
                      class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                      id="project_unit_id"
                      autocomplete="new-password"
                      v-model="currentProduct.project_unit_id"
                      placeholder="--Chọn Đơn vị dự án--"
                      @change="changeProjectUnit"
                    >
                      <option
                        v-for="option in unitOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <div
                  class="grid grid-cols-1 gap-4"
                  v-show="trade.type == 1 && currentProduct.project_type == 1"
                >
                  <div class="w-full md:col-span-2 mt-2">
                    <label>
                      <span>Dự án mẫu</span>
                    </label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <Multiselect
                      v-model="projectSelect"
                      :options="projectOptions"
                      :loading="loadingOptions"
                      :searchable="true"
                      :close-on-select="true"
                      :clear-on-select="false"
                      :preserve-search="false"
                      placeholder="-- Chọn dự án mẫu --"
                      label="name"
                      track-by="id"
                      @select="changeProject"
                    >
                    </Multiselect>
                  </div>
                </div>
                <!-- Loading -->
                <span class="loading-more" v-show="loadProjectDetail"
                  ><i class="fa fa-spinner fa-spin fa-3x"></i
                ></span>

                <div class="grid grid-cols-1 gap-4 form-row">
                  <div class="w-full md:col-span-2 mt-2">
                    <label>Sản phẩm<span class="error-sybol"></span> </label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <div class="flex gap-2 items-start">
                      <div class="flex-1">
                        <Multiselect
                          v-model="productSelect"
                          :options="productOptions"
                          :loading="loadingProductOptions"
                          :searchable="true"
                          :close-on-select="true"
                          :clear-on-select="false"
                          :preserve-search="false"
                          placeholder="--Chọn sản phẩm--"
                          label="name_full"
                          track-by="id"
                          @select="changeProduct"
                        >
                        </Multiselect>
                      </div>
                      <button
                        class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                        @click="openModalSearchProduct"
                      >
                        <i class="fa fa-search"></i>
                      </button>
                    </div>

                    <!-- Loading -->
                    <span class="loading-more" v-show="loadProductDetail"
                      ><i class="fa fa-spinner fa-spin fa-3x"></i
                    ></span>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <input
                          id="product_code_input"
                          type="text"
                          maxlength="255"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.product_code_input"
                          placeholder="Mã SP chưa có trong hệ thống"
                        />
                      </div>
                      <div>
                        <input
                          id="product_name_input"
                          type="text"
                          maxlength="255"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="currentProduct.product_name_input"
                          placeholder="Tên SP chưa có trong hệ thống"
                        />
                      </div>
                      <div>
                        <select
                          class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                          id="product_brand"
                          autocomplete="new-password"
                          v-model="currentProduct.brand_id_input"
                          placeholder="Hãng SP"
                          @change="changeBrandInput"
                        >
                          <option
                            v-for="option in productBrandOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.text }}
                          </option>
                        </select>
                      </div>
                      <div>
                        <select
                          class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                          id="unit"
                          autocomplete="new-password"
                          v-model="currentProduct.unit_id_input"
                          placeholder="Đơn vị"
                          @change="changeUnitInput"
                        >
                          <option
                            v-for="option in unitOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.text }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="grid grid-cols-1 gap-4 form-row"
                  v-show="currentProperties.length > 0"
                >
                  <div class="w-full md:col-span-2 mt-2">
                    <label>Thuộc tính</label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <p v-for="item in currentProperties" :key="item.name">
                      <label :for="item.name"
                        >{{ item.name }}:
                        <span v-for="(value, index) in item.value" :key="value">
                          <input
                            type="radio"
                            :id="item.name + value"
                            :value="value"
                            :name="item.name"
                            class="ml-2"
                            :checked="index == 0"
                            v-on:change="calQuantityRepo"
                          />
                          <label :for="value" class="ml-1">{{ value }}</label>
                        </span>
                      </label>
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Giá list</label>
                    <input
                      id="price_list"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.price_list"
                      @change="calculateCurrentProduct('price_list')"
                    />
                  </div>
                  <div>
                    <label>Chiết khấu từ NCC (%)</label>
                    <input
                      id="discount"
                      type="text"
                      maxlength="5"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.discount"
                      @change="calculateCurrentProduct('discount')"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Giá gốc<span class="error-sybol"></span></label>
                    <input
                      id="price"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.price"
                      @change="calculateCurrentProduct('price')"
                    />
                  </div>
                  <div>
                    <label>% Lợi nhuận theo giá list</label>
                    <input
                      id="discount_sale"
                      type="text"
                      maxlength="5"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.discount_sale"
                      @change="calculateCurrentProduct('discount_sale')"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>% Lợi nhuận theo giá gốc</label>
                    <input
                      id="discount_original_price"
                      type="text"
                      maxlength="5"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.discount_original_price"
                      @change="
                        calculateCurrentProduct('discount_original_price')
                      "
                    />
                  </div>
                  <div>
                    <label>Lợi nhuận/sản phẩm</label>
                    <input
                      id="profit_on_item"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.profit_on_item"
                      @change="calculateCurrentProduct('profit_on_item')"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Giá bán<span class="error-sybol"></span></label>
                    <input
                      id="price_sell"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.price_sell"
                      @change="calculateCurrentProduct('price_sell')"
                    />
                  </div>
                  <div>
                    <label
                      >SL trong kho
                      {{
                        root_unit.name
                          ? "(ĐV: " + root_unit.name + ")"
                          : currentProduct.unit_name_input
                            ? "(Đơn vị: " + currentProduct.unit_name_input + ")"
                            : ""
                      }}</label
                    >
                    <input
                      id="quantity_repo"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.quantity_repo"
                      readonly
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      >SL báo giá {{ handleUnitName()
                      }}<span class="error-sybol"></span
                    ></label>
                    <input
                      id="quantity"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.quantity"
                      @change="calculateCurrentProduct('quantity')"
                    />
                  </div>
                  <div>
                    <label>Thành tiền</label>
                    <input
                      id="amount_sell"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.amount_sell"
                      readonly
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Lợi nhuận tổng</label>
                    <input
                      id="profit"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.profit"
                      readonly
                    />
                  </div>
                  <div>
                    <label>Ghi chú</label>
                    <input
                      id="note"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.note"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 mt-2">
                  <div class="w-full md:col-span-12 text-center">
                    <button
                      class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-center btn-width-120"
                      @click="confirmBuyProduct"
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>

                <div
                  class="grid grid-cols-1 gap-4 mt-2"
                  v-show="trade.products.length > 0"
                >
                  <div class="w-full" md="9">
                    <h5 class="text-center">Danh sách sản phẩm báo giá</h5>
                  </div>
                  <div class="w-full md:col-span-3 text-right">
                    <button
                      class="btn btn-default text-header"
                      @click="
                        exportToExcel(
                          products_excel,
                          excel_fields,
                          'danh_sach_san_pham_bao_gia.xls',
                        )
                      "
                    >
                      <b>Xuất Excel</b>
                    </button>
                  </div>
                </div>

                <div
                  class="grid grid-cols-1 gap-4"
                  v-show="trade.products.length > 0"
                >
                  <div class="w-full">
                    <p>
                      Tổng doanh số theo hãng:
                      <span v-for="brand in brands_amount" :key="brand">
                        {{
                          " - " +
                          brand.name +
                          ": " +
                          currencyFormat(brand.amount)
                        }}
                      </span>
                    </p>
                  </div>
                </div>

                <!-- Báo giá thường thì dùng danh sách này-->
                <div
                  class="grid grid-cols-1 gap-4 mt-2"
                  v-show="trade.type == 0 && trade.products.length > 0"
                >
                  <div class="w-full md:col-span-12">
                    <div
                      style="width: 100%; overflow-x: scroll"
                      class="sub-table-cus"
                    >
                      <table
                        class="table table-bordered table-striped fixed_header"
                      >
                        <colgroup>
                          <col style="width: 60px" />
                          <col style="width: 130px" />
                          <col style="width: 220px" />
                          <col style="width: 130px" />
                          <col style="width: 130px" />
                          <col style="width: 80px" />
                          <col style="width: 130px" />
                          <col style="width: 80px" />
                          <col style="width: 80px" />
                          <col style="width: 130px" />
                          <col style="width: 130px" />
                          <col style="width: 100px" />
                          <col style="width: 130px" />
                          <col style="width: 130px" />
                          <col style="width: 130px" />
                          <col style="width: 50px" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th class="text-center font-weight-bold">STT</th>
                            <th class="text-center font-weight-bold">Mã SP</th>
                            <th class="text-center font-weight-bold">
                              Sản phẩm
                            </th>
                            <th class="text-center font-weight-bold">
                              Hãng SP
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá List
                            </th>
                            <th class="text-center font-weight-bold">
                              % CK từ NCC
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá gốc
                            </th>
                            <th class="text-center font-weight-bold">
                              % Lợi nhuận theo giá list
                            </th>
                            <th class="text-center font-weight-bold">
                              % Lợi nhuận theo giá gốc
                            </th>
                            <th class="text-center font-weight-bold">
                              Lợi nhuận/sản phẩm
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá bán
                            </th>
                            <th class="text-center font-weight-bold">
                              Số lượng
                            </th>
                            <th class="text-center font-weight-bold">
                              Thành tiền
                            </th>
                            <th class="text-center font-weight-bold">
                              Lợi nhuận tổng
                            </th>
                            <th class="text-center font-weight-bold">
                              Ghi chú
                            </th>
                            <th class=""></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in trade.products"
                            :key="index"
                          >
                            <td class="fitwidth-50">
                              {{ index + 1 }}
                              <i
                                class="fa fa-long-arrow-up"
                                @click="upProductIndex(item.index)"
                              />
                            </td>
                            <td class="fitwidth-250">
                              {{
                                item.product_code
                                  ? item.product_code
                                  : item.product_code_input
                              }}
                            </td>
                            <td class="fitwidth-250">
                              {{
                                item.product_name
                                  ? item.product_name
                                  : item.product_name_input
                              }}
                            </td>
                            <td class="fitwidth-50">
                              {{
                                item.brand_name
                                  ? item.brand_name
                                  : item.brand_name_input
                              }}
                            </td>
                            <td class="text-right">
                              <input
                                :id="'price_list_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.price_list"
                                @change="changeProductItem('price_list', index)"
                              />
                            </td>
                            <td class="text-right">
                              <input
                                :id="'discount_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.discount"
                                @change="changeProductItem('discount', index)"
                              />
                            </td>
                            <td class="text-right">
                              <input
                                :id="'price_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.price"
                                @change="changeProductItem('price', index)"
                              />
                            </td>
                            <td class="text-right">
                              <input
                                :id="'discount_sale_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.discount_sale"
                                @change="
                                  changeProductItem('discount_sale', index)
                                "
                              />
                            </td>
                            <td class="text-right">
                              <input
                                :id="'discount_original_price_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.discount_original_price"
                                @change="
                                  changeProductItem(
                                    'discount_original_price',
                                    index,
                                  )
                                "
                              />
                            </td>
                            <td class="text-right">
                              <input
                                :id="'profit_on_item_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.profit_on_item"
                                @change="
                                  changeProductItem('profit_on_item', index)
                                "
                              />
                            </td>
                            <td class="text-right">
                              <input
                                :id="'price_sell_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.price_sell"
                                @change="changeProductItem('price_sell', index)"
                              />
                            </td>
                            <td class="text-right">
                              <input
                                :id="'quantity_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.quantity"
                                @change="changeProductItem('quantity', index)"
                              />
                            </td>
                            <td class="text-right">
                              {{ currencyFormat(item.amount_sell) }}
                            </td>
                            <td class="text-right">
                              {{ currencyFormat(item.profit) }}
                            </td>
                            <td class="text-right">
                              <!--{{item.note}}-->
                              <input
                                :id="'note_' + index"
                                type="text"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.note"
                                @change="changeProductNote(index)"
                              />
                            </td>
                            <td class="fitwidth-50">
                              <i
                                class="fa fa-trash ml-2"
                                @click="
                                  deleteProduct(
                                    index,
                                    item.product_id,
                                    item.quantity,
                                    item.properties,
                                  )
                                "
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- Báo giá dự án thì dùng danh sách này-->
                <div
                  class="grid grid-cols-1 gap-4 mt-2"
                  v-show="trade.type == 1 && projectProducts.length > 0"
                >
                  <div class="w-full md:col-span-12">
                    <div
                      style="width: 100%; overflow-x: scroll"
                      class="sub-table-cus"
                    >
                      <table
                        class="table table-bordered table-striped fixed_header"
                      >
                        <colgroup>
                          <col style="width: 60px" />
                          <col style="width: 130px" />
                          <col style="width: 220px" />
                          <col style="width: 130px" />
                          <col style="width: 130px" />
                          <col style="width: 80px" />
                          <col style="width: 130px" />
                          <col style="width: 80px" />
                          <col style="width: 80px" />
                          <col style="width: 130px" />
                          <col style="width: 130px" />
                          <col style="width: 100px" />
                          <col style="width: 130px" />
                          <col style="width: 130px" />
                          <col style="width: 130px" />
                          <col style="width: 50px" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th class="text-center font-weight-bold">STT</th>
                            <th class="text-center font-weight-bold">Mã SP</th>
                            <th class="text-center font-weight-bold">
                              Sản phẩm
                            </th>
                            <th class="text-center font-weight-bold">
                              Hãng SP
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá List
                            </th>
                            <th class="text-center font-weight-bold">
                              % CK từ NCC
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá gốc
                            </th>
                            <th class="text-center font-weight-bold">
                              % Lợi nhuận theo giá list
                            </th>
                            <th class="text-center font-weight-bold">
                              % Lợi nhuận theo giá gốc
                            </th>
                            <th class="text-center font-weight-bold">
                              Lợi nhuận/sản phẩm
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá bán
                            </th>
                            <th class="text-center font-weight-bold">
                              Số lượng
                            </th>
                            <th class="text-center font-weight-bold">
                              Thành tiền
                            </th>
                            <th class="text-center font-weight-bold">
                              Lợi nhuận tổng
                            </th>
                            <th class="text-center font-weight-bold">
                              Ghi chú
                            </th>
                            <th class=""></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in projectProducts"
                            :key="index"
                            v-bind:class="
                              item.product_type == 0 ? 'project_bg' : ''
                            "
                          >
                            <td class="fitwidth-50">
                              {{ item.project_index }}
                              <i
                                v-show="item.product_type == 1"
                                class="fa fa-long-arrow-up"
                                @click="upProductIndex(item.index, true)"
                              />
                            </td>
                            <td class="fitwidth-250">
                              <span v-show="item.product_type == 1">{{
                                item.product_code
                                  ? item.product_code
                                  : item.product_code_input
                              }}</span>
                            </td>
                            <td class="fitwidth-250">
                              <span v-show="item.product_type == 1">{{
                                item.product_name
                                  ? item.product_name
                                  : item.product_name_input
                              }}</span>
                              <input
                                v-show="item.product_type == 0"
                                :id="'project_name_' + index"
                                type="text"
                                maxlength="255"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.product_name"
                                @change="
                                  changeProjectName(index, item.project_index)
                                "
                              />
                            </td>
                            <td class="fitwidth-50">
                              <span v-show="item.product_type == 1">
                                {{
                                  item.brand_name
                                    ? item.brand_name
                                    : item.brand_name_input
                                }}
                              </span>
                              <span v-show="item.product_type == 0">
                                {{ item.project_brand_name }}
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
                                @change="
                                  changeProductItem(
                                    'price_list',
                                    index,
                                    item.project_index,
                                    item.index,
                                  )
                                "
                              />
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
                                @change="
                                  changeProductItem(
                                    'discount',
                                    index,
                                    item.project_index,
                                    item.index,
                                  )
                                "
                              />
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
                                @change="
                                  changeProductItem(
                                    'price',
                                    index,
                                    item.project_index,
                                    item.index,
                                  )
                                "
                              />
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
                                @change="
                                  changeProductItem(
                                    'discount_sale',
                                    index,
                                    item.project_index,
                                    item.index,
                                  )
                                "
                              />
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
                                @change="
                                  changeProductItem(
                                    'discount_original_price',
                                    index,
                                    item.project_index,
                                    item.index,
                                  )
                                "
                              />
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
                                @change="
                                  changeProductItem(
                                    'profit_on_item',
                                    index,
                                    item.project_index,
                                    item.index,
                                  )
                                "
                              />
                            </td>
                            <td class="text-right">
                              <span v-show="item.product_type == 0"
                                ><b>{{
                                  currencyFormat(item.project_price)
                                }}</b></span
                              >
                              <input
                                v-show="item.product_type == 1"
                                :id="'price_sell_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.price_sell"
                                @change="
                                  changeProductItem(
                                    'price_sell',
                                    index,
                                    item.project_index,
                                    item.index,
                                  )
                                "
                              />
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
                                @change="changeProjectQuantity(index)"
                              />
                              <input
                                v-show="item.product_type == 1"
                                :id="'quantity_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.quantity"
                                @change="
                                  changeProductItem(
                                    'quantity',
                                    index,
                                    item.project_index,
                                    item.index,
                                  )
                                "
                              />
                            </td>

                            <td class="text-right">
                              <span v-show="item.product_type == 0"
                                ><b>{{
                                  currencyFormat(item.project_amount)
                                }}</b></span
                              >
                              <span v-show="item.product_type == 1">{{
                                currencyFormat(item.amount_sell)
                              }}</span>
                            </td>
                            <td class="text-right">
                              <span v-show="item.product_type == 1">{{
                                currencyFormat(item.profit)
                              }}</span>
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
                                @change="
                                  changeProjectProductNote(
                                    index,
                                    item.project_index,
                                    item.index,
                                  )
                                "
                              />
                            </td>
                            <td class="fitwidth-50">
                              <i
                                v-show="item.product_type == 0"
                                class="fa fa-edit mr-2"
                                @click="editProject(item.product_name)"
                              />
                              <i
                                class="fa fa-trash"
                                @click="
                                  deleteProductOfProject(
                                    item.index,
                                    item.product_type,
                                    item.product_name,
                                    item.product_id,
                                    item.quantity,
                                    item.properties,
                                  )
                                "
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div
                  class="grid grid-cols-1 gap-4 form-row"
                  v-show="trade.type == 1 && projectProducts.length > 0"
                >
                  <div class="w-full md:col-span-2 mt-2">
                    <label
                      >Hiện giá chi tiết<span class="error-sybol"></span
                    ></label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <div class="input-group">
                      <input
                        type="radio"
                        v-model="trade.show_price_project"
                        name="show_price_project"
                        :value="'true'"
                        class="mt-2"
                        id="show_price_project_true"
                      />
                      <label class="ml-4 mt-1" for="show_price_project_true"
                        >Có</label
                      >
                      <input
                        type="radio"
                        v-model="trade.show_price_project"
                        name="show_price_project"
                        :value="'false'"
                        class="ml-5 mt-2"
                        id="show_price_project_false"
                      />
                      <label class="ml-4 mt-1" for="show_price_project_false"
                        >Không</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mt-3">
              <div
                class="w-full md:col-span-12 bg-gradient-to-r from-green-500 to-green-600 text-white title-partner"
              >
                <h5>
                  <span class="float-left">Thông tin thanh toán</span>
                  <span
                    class="float-right"
                    v-show="showPaymentInfo"
                    @click="showPaymentInfo = !showPaymentInfo"
                    ><i class="fa fa-angle-double-up"
                  /></span>
                  <span
                    class="float-right"
                    v-show="!showPaymentInfo"
                    @click="showPaymentInfo = !showPaymentInfo"
                    ><i class="fa fa-angle-double-down"
                  /></span>
                </h5>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mt-2" v-show="showPaymentInfo">
              <div class="w-full">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Tổng tiền sản phẩm</label>
                    <input
                      id="sub_total"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.sub_total"
                      readonly
                    />
                  </div>
                  <div>
                    <label>Chi phí thêm</label>
                    <input
                      id="extra_fee"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.extra_fee"
                      placeholder="Số tiền"
                      @change="calculateAmount"
                    />
                    <input
                      id="note_extra_fee"
                      type="text"
                      maxlength="255"
                      autocomplete="new-password"
                      class="form-control mt-2"
                      placeholder="Ghi chú cho chi phí thêm"
                      v-model="trade.note_extra_fee"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label>Số tiền giảm</label>
                    <input
                      id="fixed_discount"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.fixed_discount"
                      @change="calculateAmount"
                    />
                  </div>
                  <div>
                    <label>Thuế VAT</label>
                    <div class="input-group">
                      <input
                        type="checkbox"
                        id="have_vat"
                        v-model="trade.have_vat"
                        class="mr-2"
                        @change="calculateAmount('vat')"
                      />
                      <input
                        id="vat_percent"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control mr-2"
                        v-model="trade.vat_percent"
                        @change="calculateAmount"
                      />
                      <input
                        id="vat_value"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="trade.vat_value"
                        @change="calculateAmount"
                      />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Thành tiền<span class="error-sybol"></span> </label>
                    <input
                      id="amount"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.total"
                      readonly
                    />
                  </div>
                  <div>
                    <label>Lợi nhuận</label>
                    <input
                      id="trade_profit"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.profit"
                      readonly
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Tài khoản nhận thanh toán</label>
                    <select
                      class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                      id="bank_account_id"
                      v-model="trade.bank_account_id"
                      @change="changeBankAccount"
                    >
                      <option
                        v-for="option in bankAccountOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label>Hình thức thanh toán</label>
                    <div class="flex gap-2 items-start">
                      <div class="flex-1">
                        <select
                          class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                          id="payment_method"
                          v-model="trade.payment_method"
                        >
                          <option
                            v-for="option in optionsPaymentMethod"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.text }}
                          </option>
                        </select>
                      </div>
                      <input
                        v-show="trade.payment_method == null"
                        id="payment_method_input"
                        type="text"
                        maxlength="255"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="trade.payment_method_input"
                      />

                      <button
                        class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
                        @click="openModalPaymentMethod"
                      >
                        <i class="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Thỏa thuận vận chuyển</label>
                    <div class="flex gap-2 items-start">
                      <div class="flex-1">
                        <select
                          class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                          id="shipping_agreement"
                          v-model="trade.shipping_agreement"
                        >
                          <option
                            v-for="option in optionsShippingAgreement"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.text }}
                          </option>
                        </select>
                      </div>

                      <button
                        class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
                        @click="openModalShippingAgreement"
                      >
                        <i class="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label>Phí giao hàng</label>
                    <input
                      id="shipping_fee"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.shipping_fee"
                      @change="changeCurrencyField('shipping_fee')"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Hiệu lực báo giá (ngày)</label>
                    <input
                      id="quotation_expiry_date"
                      type="text"
                      maxlength="3"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.quotation_expiry_date"
                      @keyup="integerOnly($event.target)"
                    />
                  </div>
                  <div v-if="userRole.value == 'admin'">
                    <label>Nhân viên phụ trách</label>
                    <select
                      class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                      id="staff_in_charge"
                      v-model="trade.staff_in_charge"
                      @change="changeStaffInChange"
                    >
                      <option
                        v-for="option in optionsStaff"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>
                      <span>Thời gian giao hàng</span>
                    </label>
                    <input
                      id="shipping_date"
                      type="text"
                      maxlength="255"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.shipping_date"
                    />
                  </div>
                  <div>
                    <label>Bảo hành</label>
                    <input
                      id="guarantee"
                      type="text"
                      maxlength="255"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.guarantee"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Giấy tờ kèm theo</label>
                    <input
                      id="attach_doc"
                      type="text"
                      maxlength="255"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.attach_doc"
                    />
                  </div>
                  <div>
                    <label>Ghi chú</label>
                    <textarea
                      class="form-textarea w-full px-3 py-2 border border-gray-300 rounded-md"
                      id="description"
                      style="width: 100%"
                      rows="2"
                      v-model="trade.description"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div class="w-full" md="12">
                <button
                  class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 float-left btn-width-120 mt-1"
                  @click="updateDraft"
                >
                  Lưu nháp
                </button>

                <button
                  class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 float-right btn-width-120 mt-1"
                  @click="openModalChooseFilePrint"
                >
                  In báo giá
                </button>
              </div>
              <!-- openModalChooseFilePrint -->
            </div>

            <div class="grid grid-cols-1 gap-4 mt-2">
              <div class="w-full md:col-span-12 text-center">
                <button
                  v-show="!saving"
                  class="btn-outline-success btn-sm"
                  style="height: 50px; width: 240px"
                  @click="save"
                  :disabled="saving || !trade.id"
                >
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận Báo Giá
                </button>
                <span class="loading-more" v-show="saving"
                  ><i class="fa fa-spinner fa-spin fa-3x"></i
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal chọn kiểu file in -->
    <div
      v-if="showModalProduct"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
      >
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Chọn File In Báo Giá
            </h4>
          </div>
        </div>
        <hr />

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full" cols="12">
            <button
              v-show="!exportingExcel"
              class="btn-outline-primary float-left btn-width-120 btn-sm"
              @click="exportExcel('excel')"
            >
              Xuất Excel
            </button>

            <button
              v-show="!exportingExcel"
              class="btn-outline-success float-right btn-width-120 btn-sm"
              @click="exportExcel('pdf')"
            >
              Xuất PDF
            </button>
            <span class="loading-more" v-show="exportingExcel"
              ><i class="fa fa-spinner fa-spin fa-3x"></i
            ></span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full text-center mt-3" cols="12">
            <button
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 btn-width-120"
              @click="hideModalChooseFilePrint"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal chọn đơn vị -->
    <div
      v-if="showModalChooseMultipleUnit"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
      >
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Chọn Đơn Vị Báo Giá
            </h4>
          </div>
        </div>
        <hr />
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full" cols="12">Đơn vị gốc: {{ root_unit.name }}</div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full" cols="12">Chuyển đổi thành:</div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full" cols="12">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              id="multiple_unit"
              autocomplete="new-password"
              v-model="current_unit"
            >
              <option
                v-for="option in multipleUnitsOption"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full text-center mt-3" cols="12">
            <button
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 float-left btn-width-120"
              @click="hideModalChooseMultipleUnit"
            >
              Bỏ qua
            </button>
            <button
              class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 float-right btn-width-120"
              @click="chooseUnit"
            >
              Chuyển đổi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--Print-->
    <div class="grid grid-cols-1 gap-4 hidden" id="provisionalInvoice">
      <div class="w-full">
        <img
          :src="
            '/static/img/project/print/quotation/header_' +
            authStore.user.storeId +
            '.png'
          "
          style="width: 100%"
        />

        <div
          v-if="authStore.user.storeId != 19"
          style="width: 100%; height: 35px; font-size: 12px"
          class="tr-bg"
        >
          <div
            style="
              color: #006699;
              font-size: 18px;
              float: left;
              width: 70%;
              text-align: center;
              margin-top: 10px;
            "
          >
            <b>BẢNG BÁO GIÁ</b>
          </div>
          <div
            style="
              float: right;
              width: 30%;
              margin-top: 10px;
              text-align: center;
            "
          >
            <i class="print-text-right"
              >TP.HCM, Ngày {{ today_day }} tháng {{ today_month }} năm
              {{ today_year }}</i
            >
          </div>
        </div>

        <!--Cty 19 mong muốn mẫu báo giá khác-->
        <div
          v-if="authStore.user.storeId == 19"
          style="width: 100%; height: 35px; font-size: 12px"
        >
          <div style="font-size: 18px; text-align: center; margin-top: 10px">
            <b>THƯ BÁO GIÁ</b>
          </div>
          <div style="font-size: 12px; text-align: center; margin-top: 10px">
            <span
              ><b>Số báo giá: {{ trade.quotation_number }}</b></span
            >
          </div>
          <div
            style="
              float: right;
              width: 100%;
              margin-top: 10px;
              text-align: right;
            "
          >
            <i class="print-text-right"
              >TP.HCM, Ngày {{ today_day }} tháng {{ today_month }} năm
              {{ today_year }}</i
            >
          </div>
        </div>

        <div
          v-if="authStore.user.storeId != 19"
          style="
            width: 100%;
            font-size: 12px;
            text-align: right;
            margin-top: 5px;
            margin-bottom: 5px;
          "
        >
          <div
            style="
              color: #006699;
              font-size: 18px;
              float: left;
              width: 70%;
              text-align: center;
            "
          ></div>
          <div
            style="
              float: right;
              width: 30%;
              margin-top: 5px;
              margin-bottom: 5px;
              text-align: center;
            "
          >
            <span>Số báo giá: {{ trade.quotation_number }}</span>
          </div>
        </div>

        <div class="print-table-border custom-line-height">
          <table style="width: 100%; font-size: 10px">
            <tbody>
              <tr class="print-pl-2">
                <td colspan="2" class="print-pl-2">
                  Kính gửi:
                  <b>
                    <span>{{ trade.customer_name }}</span>
                  </b>
                </td>
              </tr>
              <tr>
                <td class="print-no-border print-pl-2">
                  Anh/chị: <span>{{ trade.contact_person_name }}</span>
                </td>
                <td class="print-no-border">
                  Kinh doanh: <span>{{ trade.staff_in_charge_name }}</span>
                </td>
              </tr>
              <tr>
                <td class="print-no-border print-pl-2">
                  Điện thoại: <span>{{ trade.contact_person_phone }}</span>
                </td>
                <td class="print-no-border">
                  Điện thoại: <span>{{ trade.staff_in_charge_phone }}</span>
                </td>
              </tr>
              <tr>
                <td class="print-no-border print-pl-2">
                  Email: <span>{{ trade.contact_person_email }}</span>
                </td>
                <td class="print-no-border">
                  Email: <span>{{ trade.staff_in_charge_email }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          style="
            width: 100%;
            font-size: 12px;
            text-align: right;
            margin-top: 5px;
            margin-bottom: 5px;
          "
        >
          <div
            style="
              width: 100%;
              margin-top: 5px;
              margin-bottom: 5px;
              text-align: left;
            "
          >
            <span
              ><i
                ><b>{{ store_name }}</b> chân thành cảm ơn Quý Khách Hàng đã
                quan tâm đến dịch vụ/sản phẩm của công ty chúng tôi. Chúng tôi
                trân trọng gửi tới Quý Khách:</i
              ></span
            >
          </div>
        </div>
        <div class="print-table-border">
          <table
            style="width: 100%; font-size: 10px"
            class="custom-line-height"
          >
            <thead>
              <tr
                class="print-text-center tr-bg"
                style="background-color: #eeece1"
              >
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
              <tr
                v-if="trade.type == 0"
                v-for="(item, index) in trade.products"
                :key="index"
              >
                <td class="print-text-center">{{ index + 1 }}</td>
                <td>
                  {{
                    item.product_code
                      ? item.product_code
                      : item.product_code_input
                  }}
                </td>
                <td>
                  {{
                    item.product_name
                      ? item.product_name
                      : item.product_name_input
                  }}
                  <span v-for="des in item.description" :key="des">
                    <br /><i class="print-pl-2">{{ des }}</i>
                  </span>
                </td>
                <td class="print-text-center">
                  {{
                    item.brand_name ? item.brand_name : item.brand_name_input
                  }}
                </td>
                <td class="print-text-center">
                  {{ item.unit_name ? item.unit_name : item.unit_name_input }}
                </td>
                <td class="print-text-center">
                  {{ currencyFormat(item.quantity) }}
                </td>
                <td class="print-text-right">
                  {{ currencyFormat(item.price_sell) }}
                </td>
                <td class="print-text-right">
                  {{ currencyFormat(item.amount_sell) }}
                </td>
                <td>{{ item.note }}</td>
              </tr>
              <tr
                v-if="trade.type == 1"
                v-for="(item, index) in projectProducts"
                :key="index"
                :class="item.product_type == 0 ? 'project_name' : ''"
              >
                <td class="print-text-center">{{ item.project_index }}</td>
                <td>
                  <span v-show="item.product_type == 1">{{
                    item.product_code
                      ? item.product_code
                      : item.product_code_input
                  }}</span>
                </td>
                <td>
                  <span v-show="item.product_type == 1">{{
                    item.product_name
                      ? item.product_name
                      : item.product_name_input
                  }}</span>
                  <b v-show="item.product_type == 0">{{ item.product_name }}</b>
                </td>
                <td class="print-text-center">
                  <span v-show="item.product_type == 1">
                    {{
                      item.brand_name ? item.brand_name : item.brand_name_input
                    }}
                  </span>
                  <span v-show="item.product_type == 0">
                    {{ item.project_brand_name }}
                  </span>
                </td>
                <td class="print-text-center">
                  <span v-show="item.product_type == 1">
                    {{ item.unit_name ? item.unit_name : item.unit_name_input }}
                  </span>
                  <span v-show="item.product_type == 0">
                    {{ item.project_unit_name }}
                  </span>
                </td>
                <td class="print-text-center">
                  {{
                    currencyFormat(
                      item.product_type == 1
                        ? item.quantity
                        : item.project_quantity,
                    )
                  }}
                </td>
                <td class="print-text-right">
                  <span
                    v-show="
                      trade.show_price_project == 'false' &&
                      item.product_type == 1
                    "
                    >-</span
                  >
                  <span
                    v-show="
                      trade.show_price_project == 'false' &&
                      item.product_type == 0
                    "
                    >{{ currencyFormat(item.project_price) }}</span
                  >
                  <span v-show="trade.show_price_project == 'true'">
                    {{
                      currencyFormat(
                        item.product_type == 1
                          ? item.price_sell
                          : item.project_price,
                      )
                    }}
                  </span>
                </td>
                <td class="print-text-right">
                  <span
                    v-show="
                      trade.show_price_project == 'false' &&
                      item.product_type == 1
                    "
                    >-</span
                  >
                  <span
                    v-show="
                      trade.show_price_project == 'false' &&
                      item.product_type == 0
                    "
                    >{{ currencyFormat(item.project_amount) }}</span
                  >
                  <span v-show="trade.show_price_project == 'true'">
                    {{
                      currencyFormat(
                        item.product_type == 1
                          ? item.amount_sell
                          : item.project_amount,
                      )
                    }}
                  </span>
                </td>
                <td>{{ item.product_type == 1 ? item.note : "" }}</td>
              </tr>
              <tr>
                <td colspan="7" class="print-text-right">CỘNG TIỀN HÀNG:</td>
                <td class="print-text-right">
                  <b>{{ currencyFormat(trade.sub_total) }}</b>
                </td>
                <td></td>
              </tr>
              <tr v-show="trade.extra_fee && parseInt(trade.extra_fee) > 0">
                <td colspan="7" class="print-text-right">
                  CHI PHÍ KHÁC
                  <span v-show="trade.note_extra_fee">
                    ({{ trade.note_extra_fee }})</span
                  >
                </td>
                <td class="print-text-right">
                  {{ currencyFormat(trade.extra_fee) }}
                </td>
                <td></td>
              </tr>
              <tr
                v-show="
                  trade.fixed_discount && parseInt(trade.fixed_discount) > 0
                "
              >
                <td colspan="7" class="print-text-right">GIẢM GIÁ</td>
                <td class="print-text-right">
                  {{ currencyFormat(trade.fixed_discount) }}
                </td>
                <td></td>
              </tr>
              <tr v-show="trade.have_vat && parseInt(trade.vat_value) > 0">
                <td colspan="7" class="print-text-right">
                  Thuế GTGT (VAT {{ trade.vat_percent }}%)
                </td>
                <td class="print-text-right">
                  {{ currencyFormat(trade.vat_value) }}
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="7" class="print-text-right">
                  <b>TỔNG TIỀN THANH TOÁN:</b>
                </td>
                <td class="print-text-right">
                  <b>{{ currencyFormat(trade.total) }}</b>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div>
            <p style="font-size: 10px">
              <b> Số tiền viết bằng chữ:</b>
              {{ convertNumberToText(trade.total) }}
            </p>
          </div>
          <div>
            <p style="color: red; font-size: 10px">
              <b v-if="authStore.user.storeId != 19 && trade.type == 0"
                >* Quý khách hàng vui lòng kiểm tra mã sản phẩm & thông số sản
                phẩm, hàng mua xin miễn đổi trả</b
              >
              <b v-if="authStore.user.storeId == 19 || trade.type == 1"
                >* Quý khách hàng vui lòng xem thêm các Điều khoản - Chính sách
                báo giá phía dưới dây:</b
              >
            </p>
          </div>

          <div>
            <table style="width: 100%; font-size: 10px">
              <tbody>
                <tr>
                  <td class="print-no-border">
                    {{
                      authStore.user.storeId == 19
                        ? "Thời gian giao hàng:"
                        : "Bảo hành:"
                    }}
                  </td>
                  <td class="print-no-border">
                    <span v-if="authStore.user.storeId == 19">
                      {{ trade.shipping_date }}
                    </span>
                    <span v-if="authStore.user.storeId != 19">
                      {{ trade.guarantee }}
                    </span>
                  </td>
                  <td class="print-no-border" colspan="2">
                    Thông tin tài khoản ngân hàng thụ hưởng:
                  </td>
                </tr>
                <tr>
                  <td class="print-no-border">Hiệu lực báo giá:</td>
                  <td class="print-no-border">
                    {{ trade.quotation_expiry_date }} ngày
                    <span style="color: #c0c0c0">(kể từ ngày báo giá)</span>
                  </td>
                  <td class="print-no-border">Tên tài khoản:</td>
                  <td class="print-no-border">
                    {{ bankAccountSelected.account_name }}
                  </td>
                </tr>
                <tr>
                  <td class="print-no-border">Giao hàng:</td>
                  <td class="print-no-border">
                    <span
                      >{{
                        !trade.shipping_agreement
                          ? "Nội thành HCM"
                          : trade.shipping_agreement
                      }}.
                    </span>
                    <span
                      v-show="
                        trade.shipping_fee && parseInt(trade.shipping_fee) > 0
                      "
                    >
                      {{
                        "Chi Phí giao hàng là: " +
                        currencyFormat(trade.shipping_fee) +
                        " đồng"
                      }}
                    </span>
                  </td>
                  <td class="print-no-border">Số tài khoản:</td>
                  <td class="print-no-border">
                    <span>{{ bankAccountSelected.account_number }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="print-no-border">Hình thức Thanh toán:</td>
                  <td class="print-no-border">
                    <span>{{
                      trade.payment_method
                        ? trade.payment_method
                        : trade.payment_method_input
                    }}</span>
                  </td>
                  <td class="print-no-border">Ngân hàng:</td>
                  <td class="print-no-border">
                    <span>{{ bankAccountSelected.bank_name }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="print-no-border"></td>
                  <td class="print-no-border"></td>
                  <td class="print-no-border">Nội dung chuyển khoản:</td>
                  <td class="print-no-border">
                    <span>{{ "Tên công ty - " + trade.quotation_number }}</span>
                  </td>
                </tr>
                <tr v-show="trade.description">
                  <td class="print-no-border"><b>Ghi chú thêm:</b></td>
                  <td class="print-no-border" colspan="3">
                    {{ trade.description }}
                  </td>
                </tr>
                <tr v-show="trade.type == 1">
                  <td class="print-no-border" colspan="4">
                    <b style="color: red">* Cam kết:</b> Khách hàng được hỗ trợ
                    tư vấn kỹ thuật trong suốt thời gian sử dụng tủ điện. Bàn
                    giao bản vẽ sơ đồ nguyên lý đấu nối, mạch điều khiển, Giấy
                    test chất lượng xuất xưởng, Phiếu bảo hành cho khách hàng.
                  </td>
                </tr>
                <tr>
                  <td class="print-no-border" colspan="4">
                    Mọi thắc mắc vui lòng liên hệ nhân viên lập báo giá phía
                    trên
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br /><br />
          <div>
            <table style="width: 100%; font-size: 10px">
              <tbody>
                <tr>
                  <td class="print-no-border print-text-center">
                    <b>XÁC NHẬN ĐẶT HÀNG</b>
                  </td>
                  <td class="print-no-border print-text-center">
                    <b>NGƯỜI BÁO GIÁ</b>
                  </td>
                </tr>
                <tr>
                  <td
                    class="print-no-border print-text-center"
                    style="color: #c0c0c0"
                  >
                    (Đại diện khách hàng)
                  </td>
                  <td
                    class="print-no-border print-text-center"
                    style="color: #c0c0c0"
                  >
                    (Đại diện thiết bị Bến Thành)
                  </td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center"></td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center"></td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center"></td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center"></td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center"></td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center"></td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center"></td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center"></td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center"></td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center">
                    <b>{{ trade.staff_in_charge_name }}</b>
                  </td>
                </tr>
                <tr>
                  <td class="print-no-border print-text-center"></td>
                  <td class="print-no-border print-text-center">
                    {{ trade.staff_in_charge_position }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_1_' + $store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_2_' + $store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_3_' + $store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_4_' + $store.state.user.storeId + '.png'" style="width: 100%"/>-->
        <!--<img @error="imageUrlNotExist" v-show="trade.type == 1 && showImage" :src="'/static/img/project/print/quotation/bottom_5_' + $store.state.user.storeId + '.png'" style="width: 100%"/>-->
      </div>
    </div>

    <!--Modal tìm kiếm sản phẩm -->
    <div
      v-if="showModalSearchProduct"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto"
      >
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Tìm kiếm sản phẩm
            </h4>
          </div>
        </div>
        <hr />

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-2 mt-2">
            <label>Hãng sản phẩm</label>
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              id="product_brand"
              autocomplete="new-password"
              v-model="productSearch.product_brand_id"
            ></select>
          </div>
          <div class="w-full md:col-span-2 mt-2">
            <label>Nhóm sản phẩm</label>
            <Multiselect
              v-model="productGroupSearchSelect"
              :options="productGroupOptions"
              :loading="loadingOptions"
              :searchable="true"
              :close-on-select="true"
              :clear-on-select="false"
              :preserve-search="false"
              placeholder="--Chọn nhóm sản phẩm--"
              label="name"
              track-by="id"
              @select="changeProductGroupSearch"
            >
            </Multiselect>
          </div>

          <div class="w-full md:col-span-2 mt-2">
            <label>Loại sản phẩm</label>
            <Multiselect
              v-model="productTypeSearchSelect"
              :options="productTypeSearchOptions"
              :loading="loadingOptions"
              :searchable="true"
              :close-on-select="true"
              :clear-on-select="false"
              :preserve-search="false"
              placeholder="--Chọn loại sản phẩm--"
              label="name"
              track-by="id"
              @select="changeProductTypeSearch"
            >
            </Multiselect>
          </div>

          <div class="w-full md:col-span-3 mt-2">
            <label>Mã sản phẩm</label>
            <input
              id="codeProductCus"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="productSearch.code"
              maxlength="255"
            />
          </div>

          <div class="w-full md:col-span-3 mt-2">
            <label>Tên sản phẩm</label>
            <input
              id="nameProductCus"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="productSearch.name"
              maxlength="255"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full" cols="12">
            <button
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 float-left btn-width-120"
              @click.prevent="hideModalSearchProduct"
            >
              Quay lại
            </button>

            <button
              class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 float-right btn-width-120"
              :disabled="onSearchProduct"
              @click.prevent="searchProduct"
              v-show="!onSearchProduct"
            >
              Tìm Kiếm
            </button>
            <span class="loading-more float-right" v-show="onSearchProduct"
              ><i class="fa fa-spinner fa-spin fa-3x"></i
            ></span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full">
            <table
              class="min-w-full divide-y divide-gray-200 border border-gray-300"
            >
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="field in productSearchFields"
                    :key="field.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in productSearchItems"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.product_group_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.product_type_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.code }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.product_brand_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 float-right btn-width-120"
                      @click.prevent="chooseProduct(item.id)"
                    >
                      Chọn
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!--Modal tìm kiếm khách hàng -->
    <div
      v-if="showModalSearchCustomer"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto"
      >
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Tìm kiếm khách hàng
            </h4>
          </div>
        </div>
        <hr />

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full md:col-span-6">
            <label>Tên</label>
            <input
              id="nameCusSearch"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="customerSearch.name"
              maxlength="75"
            />
          </div>
          <div class="w-full md:col-span-6">
            <label>Số điện thoại</label>
            <input
              id="phoneNumberCus"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="customerSearch.phone"
              maxlength="11"
              @keyup="integerOnly($event.target)"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full" cols="12">
            <button
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 float-left btn-width-120"
              @click.prevent="hideModalSearchCustomer"
            >
              Quay lại
            </button>

            <button
              class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 float-right btn-width-120"
              :disabled="onSearchCustomer"
              @click.prevent="searchCustomer"
            >
              Tìm Kiếm
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full">
            <table
              class="min-w-full divide-y divide-gray-200 border border-gray-300"
            >
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="field in customerSearchFields"
                    :key="field.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in customerSearchItems"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.phone_number }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.gender }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.birthday }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.tax_code }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.city_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.district_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.address }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 float-right btn-width-120"
                      @click.prevent="chooseCustomer(item.id)"
                    >
                      Chọn
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <p class="text-center">--Hết--</p>
          </div>
        </div>
      </div>
    </div>

    <!--Modal thêm khách hàng -->
    <div
      v-if="showModalCustomer"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Thêm khách hàng
            </h4>
          </div>
        </div>
        <hr />

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Loại khách hàng </label>
          </div>
          <div class="w-full" md="9">
            <div class="input-group">
              <input
                type="radio"
                v-model="customer.type"
                name="type"
                value="0"
                class="mt-2"
              /><label class="ml-4 mt-1">Cá nhân</label>
              <input
                type="radio"
                v-model="customer.type"
                name="type"
                value="1"
                class="ml-5 mt-2"
              /><label class="ml-4 mt-1">Công ty</label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Tên<span class="error-sybol"></span> </label>
          </div>
          <div class="w-full" md="9">
            <input
              id="nameCus"
              type="text"
              class="form-control"
              v-model="customer.name"
              autocomplete="new-password"
              maxlength="75"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Mã khách hàng<span class="error-sybol"></span> </label>
          </div>
          <div class="w-full" md="9">
            <input
              id="code"
              type="text"
              class="form-control"
              v-model="customer.code"
              @keyup="integerOnly($event.target)"
              autocomplete="new-password"
              maxlength="20"
              placeholder="Số điện thoại hoặc mã số thuế"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Số Điện Thoại</label>
          </div>
          <div class="w-full" md="9">
            <input
              id="phoneCuss"
              type="text"
              class="form-control"
              v-model="customer.phone_number"
              @keyup="integerOnly($event.target)"
              autocomplete="new-password"
              maxlength="15"
              v-on:change="checkPhoneNumberFormat($event.target.value)"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Email</label>
          </div>
          <div class="w-full" md="9">
            <input
              id="email"
              type="text"
              class="form-control"
              v-model="customer.email"
              autocomplete="new-password"
              maxlength="255"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label
              >Mã số thuế
              <span v-show="customer.type == 1" class="error-sybol"></span
            ></label>
          </div>
          <div class="w-full" md="9">
            <input
              id="tax_code"
              type="text"
              class="form-control"
              v-model="customer.tax_code"
              @keyup="integerOnly($event.target)"
              autocomplete="new-password"
              maxlength="20"
            />
          </div>
        </div>

        <div
          class="grid grid-cols-1 gap-4 form-row"
          v-show="customer.type == 1"
        >
          <div class="w-full md:col-span-3 mt-2">
            <label>Phân loại</label>
          </div>
          <div class="w-full" md="9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              v-model="customer.company_type"
            ></select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Giới Tính</label>
          </div>
          <div class="w-full" md="9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              v-model="customer.gender"
            ></select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Ngày Tháng Năm Sinh</label>
          </div>
          <div class="w-full" md="9">
            <datepicker
              v-model="customer.birthday"
              format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
              input-class="datepicker-cus"
            ></datepicker>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Tỉnh/ Thành Phố</label>
          </div>
          <div class="w-full" md="9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              id="city_id"
              v-model="customer.city_id"
              v-on:change="changeCity($event.target)"
            ></select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Quận/ Huyện</label>
          </div>
          <div class="w-full" md="9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              id="district_id"
              v-model="customer.district_id"
              :disabled="!customer.city_id"
            ></select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Địa chỉ</label>
          </div>
          <div class="w-full" md="9">
            <input
              id="addressCus"
              type="text"
              class="form-control"
              v-model="customer.address"
              autocomplete="new-password"
              maxlength="255"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>
              <span>Tên người liên hệ</span>
            </label>
          </div>
          <div class="w-full" md="9">
            <input
              id="customer_contact_person_name"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="form-control"
              v-model="customer.contact_person_name"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>
              <span>Sđt người liên hệ</span>
            </label>
          </div>
          <div class="w-full" md="9">
            <input
              id="customer_contact_person_phone"
              type="text"
              maxlength="14"
              autocomplete="new-password"
              class="form-control"
              v-model="customer.contact_person_phone"
              @keyup="integerOnly($event.target)"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Email người liên hệ</label>
          </div>
          <div class="w-full" md="9">
            <input
              id="contact_person_email"
              type="text"
              class="form-control"
              v-model="customer.contact_person_email"
              autocomplete="new-password"
              maxlength="255"
            />
          </div>
        </div>

        <div
          class="grid grid-cols-1 gap-4 form-row"
          v-show="userRole.value == 'admin'"
        >
          <div class="w-full md:col-span-3 mt-2">
            <label>Nhân viên phụ trách</label>
          </div>
          <div class="w-full" md="9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              id="created_by"
              v-model="customer.created_by"
            ></select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full" cols="12">
            <button
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 float-left btn-width-120"
              @click="backCustomer"
            >
              Hủy bỏ
            </button>
            <button
              v-show="!savingCustomer"
              class="btn-outline-success float-right btn-width-120 btn-sm"
              @click="saveCustomer"
              :disabled="savingCustomer"
            >
              Lưu
            </button>
            <span class="loading-more" v-show="savingCustomer"
              ><i class="fa fa-spinner fa-spin fa-3x"></i
            ></span>
          </div>
        </div>
      </div>
    </div>

    <!--Modal QL hình thức thanh toán -->
    <div
      v-if="showModalPaymentMethod"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto"
      >
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              QL Hình Thức Thanh Toán
            </h4>
          </div>
        </div>
        <hr />

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Hình thức thanh toán<span class="error-sybol"></span></label>
          </div>
          <div class="w-full" md="9">
            <input
              id="payment_method_man"
              type="text"
              class="form-control"
              v-model="paymentMethod.payment_method"
              autocomplete="new-password"
              maxlength="255"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Số ngày công nợ<span class="error-sybol"></span></label>
          </div>
          <div class="w-full md:col-span-9 mt-2">
            <input
              id="payment_method_debt_date_number"
              type="text"
              class="form-control"
              v-model="paymentMethod.debt_date_number"
              autocomplete="new-password"
              @keyup="integerOnly($event.target)"
              maxlength="4"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Thứ tự xuất hiện<span class="error-sybol"></span></label>
          </div>
          <div class="w-full mt-2" md="9">
            <input
              id="payment_method_index"
              type="text"
              class="form-control"
              v-model="paymentMethod.index"
              autocomplete="new-password"
              @keyup="integerOnly($event.target)"
              maxlength="2"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-2 mb-2">
          <div class="w-full md:col-span-12 text-center">
            <button
              v-show="!savingPaymentMethod"
              class="btn-outline-secondary btn-width-120 text-center btn-sm"
              @click.prevent="hideModalPaymentMethod"
            >
              Đóng
            </button>
            <button
              v-show="!savingPaymentMethod"
              class="btn-outline-primary btn-width-120 text-center btn-sm"
              :disabled="savingPaymentMethod"
              @click.prevent="addUpdatePaymentMethod"
            >
              <span>{{ btn_payment_method_text }}</span>
            </button>
            <span class="loading-more" v-show="savingPaymentMethod"
              ><i class="fa fa-spinner fa-spin fa-3x"></i
            ></span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-3">
          <div class="w-full md:col-span-12">
            Số kết quả: <b>{{ itemsPaymentMethod.length }}</b>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <table
              class="min-w-full divide-y divide-gray-200 border border-gray-300"
            >
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="field in fieldsPaymentMethod"
                    :key="field.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in itemsPaymentMethod"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.index }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.payment_method }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.debt_date_number }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button
                        title="Cập nhật"
                        @click="editPaymentMethod(index)"
                        class="text-blue-600 hover:text-blue-800"
                      >
                        <i class="fa fa-edit" />
                      </button>
                      <button
                        title="Xóa"
                        @click="
                          deletedPaymentMethod(item.id, item.payment_method)
                        "
                        class="text-red-600 hover:text-red-800"
                      >
                        <i class="fa fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Loading -->
        <span class="loading-more" v-show="loadingPaymentMethod"
          ><i class="fa fa-spinner fa-spin fa-3x"></i
        ></span>
        <span class="loading-more">--Hết--</span>
      </div>
    </div>

    <!--Modal QL Thỏa thuận vận chuyển -->
    <div
      v-if="showModalShippingAgreement"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto"
      >
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              QL Thỏa Thuận Vận Chuyển
            </h4>
          </div>
        </div>
        <hr />

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label
              >Thỏa thuận vận chuyển<span class="error-sybol"></span
            ></label>
          </div>
          <div class="w-full" md="9">
            <input
              id="shipping_agreement_man"
              type="text"
              class="form-control"
              v-model="shippingAgreement.shipping_agreement"
              autocomplete="new-password"
              maxlength="255"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Thứ tự xuất hiện<span class="error-sybol"></span></label>
          </div>
          <div class="w-full mt-2" md="9">
            <input
              id="shipping_agreement_index"
              type="text"
              class="form-control"
              v-model="shippingAgreement.index"
              autocomplete="new-password"
              @keyup="integerOnly($event.target)"
              maxlength="2"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-2 mb-2">
          <div class="w-full md:col-span-12 text-center">
            <button
              v-show="!savingShippingAgreement"
              class="btn-width-120 text-center btn-outline-secondary btn-sm"
              @click.prevent="hideModalShippingAgreement"
            >
              Đóng
            </button>
            <button
              v-show="!savingShippingAgreement"
              class="btn-width-120 text-center btn-outline-primary btn-sm"
              :disabled="savingShippingAgreement"
              @click.prevent="addUpdateShippingAgreement"
            >
              <span>{{ btn_shipping_agreement_text }}</span>
            </button>
            <span class="loading-more" v-show="savingShippingAgreement"
              ><i class="fa fa-spinner fa-spin fa-3x"></i
            ></span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-3">
          <div class="w-full md:col-span-12">
            Số kết quả: <b>{{ itemsShippingAgreement.length }}</b>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <table
              class="min-w-full divide-y divide-gray-200 border border-gray-300"
            >
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="field in fieldsShippingAgreement"
                    :key="field.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in itemsShippingAgreement"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.index }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.shipping_agreement }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button
                        title="Cập nhật"
                        @click="editShippingAgreement(index)"
                        class="text-blue-600 hover:text-blue-800"
                      >
                        <i class="fa fa-edit" />
                      </button>
                      <button
                        title="Xóa"
                        @click="
                          deletedShippingAgreement(
                            item.id,
                            item.shipping_agreement,
                          )
                        "
                        class="text-red-600 hover:text-red-800"
                      >
                        <i class="fa fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Loading -->
        <span class="loading-more" v-show="loadingShippingAgreement"
          ><i class="fa fa-spinner fa-spin fa-3x"></i
        ></span>
        <span class="loading-more">--Hết--</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  defineOptions,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";
import { useExcelExport } from "@/composables/useExcelExport";
import productApi from "@/api/product";
import quotationApi from "@/api/quotation";
import superAdminAPI from "@/api/superAdmin";
import customerApi from "@/api/customer";
import MasterApi from "@/api/master";
import { RootAPI } from "@/api/index";
import paymentMethodApi from "@/api/paymentMethod";
import shippingAgreementApi from "@/api/shippingAgreement";
import MasterMapper from "@/mapper/master";
import commonFunc from "@/common/commonFunc";
import Datepicker from "vue3-datepicker";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";

// Define component options
defineOptions({
  name: "QuotationIndexAll",
  components: {
    Multiselect,
    Datepicker,
  },
});

// Router and stores
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { popToast } = useToast();
const { exportToExcel } = useExcelExport();

// Data - Refs
const prefix_title = ref("Thêm Mới");
const customerSelect = ref({});
const customerOptionStore = ref([]);
const productGroupSearchSelect = ref({});
const productGroupOptions = ref([]);
const productTypeSearchSelect = ref({});
const productTypeSearchOptions = ref([]);
const productTypeOptionStore = ref([]);
const productSelect = ref({});
const productOptions = ref([]);
const unitOptions = ref([]);
const productBrandOptions = ref([]);
const productBrandOptionsSearch = ref([]);
const optionsStaff = ref([]);
const optionsStaffStore = ref([]);
const optionsPaymentMethod = ref([]);
const optionsShippingAgreement = ref([]);
const bankAccountOptions = ref([]);
const bankAccountOptionStore = ref([]);
const multipleUnitsOptionStore = ref([]);
const multipleUnitsOption = ref([]);
const current_unit = ref(null);
const root_unit = ref({});
const projectSelect = ref({});
const projectOptions = ref([]);

const optionsCompanyType = ref([
  { value: null, text: "" },
  { value: 0, text: "Khách lẻ" },
  { value: 1, text: "Thương mại" },
  { value: 2, text: "Nhà máy" },
  { value: 3, text: "Công Trình" },
]);

const customerStatusOptions = ref([
  { value: null, text: "" },
  { value: 1, text: "Khách mới" },
  { value: 2, text: "Khách cũ" },
]);

const bankAccountSelected = ref({
  account_name: "",
  account_number: "",
  bank_name: "",
});

const curent_unit = ref(null);
const is_have_price_sell = ref(false);
const brand_input = ref(null);
const brands_amount = ref([]);
const currentProperties = ref([]);
const propertiesChoosen = ref([]);
const currentPropertiesRoot = ref([]);
const products_excel = ref([]);

const excel_fields = ref({
  STT: "index",
  "Mã sản phẩm": "product_code",
  "Tên Sản phẩm": "product_name",
  "HÃNG SX": "brand_name",
  ĐVT: "unit_name",
  SL: "quantity",
  "ĐƠN GIÁ": "price",
  "THÀNH TIỀN (VNĐ)": "amount",
  "GHI CHÚ": "note",
});

const saving = ref(false);
const loading = ref(false);
const showPartnerInfo = ref(true);
const showProductInfo = ref(true);
const showPaymentInfo = ref(true);
const saveSuccess = ref(false);
const today_day = ref("");
const today_month = ref("");
const today_year = ref("");
const store_name = ref("");
const store_tax_code = ref("");
const store_address = ref("");
const store_phone_number = ref("");

const onSearchProduct = ref(false);

const productSearchFields = ref([
  {
    key: "stt",
    label: "STT",
  },
  {
    key: "product_group_name",
    label: "Nhóm SP",
  },
  {
    key: "product_type_name",
    label: "Loại SP",
  },
  {
    key: "code",
    label: "Mã SP",
  },
  {
    key: "name",
    label: "Tên SP",
  },
  {
    key: "product_brand_name",
    label: "Hãng SP",
  },
  {
    key: "actions",
    label: "",
    class: "actions-cell",
  },
]);

const productSearchItems = ref([]);

const optionsGender = ref([
  { value: "1", text: "Nam" },
  { value: "2", text: "Nữ" },
  { value: "3", text: "Khác" },
]);

const optionsCity = ref([]);
const optionsDistrict = ref([]);
const savingCustomer = ref(false);

const onSearchCustomer = ref(false);

const customerSearchFields = ref([
  {
    key: "stt",
    label: "STT",
  },
  {
    key: "type",
    label: "Loại",
  },
  {
    key: "name",
    label: "Tên",
  },
  {
    key: "phone_number",
    label: "Số điện thoại",
  },
  {
    key: "gender",
    label: "Giới tính",
  },
  {
    key: "birthday",
    label: "Ngày sinh",
  },
  {
    key: "tax_code",
    label: "Mã số thuế",
  },
  {
    key: "city_name",
    label: "Tỉnh/TP",
  },
  {
    key: "district_name",
    label: "Quận/Huyện",
  },
  {
    key: "address",
    label: "Địa chỉ",
  },
  {
    key: "action",
    label: "",
    class: "actions-cell",
  },
]);

const customerSearchItems = ref([]);
const userRole = ref("admin");
const loadingOptions = ref(false);
const loadingCustomerOptions = ref(false);
const loadingProductOptions = ref(false);
const loadCusDetail = ref(false);
const loadProjectDetail = ref(false);
const loadProductDetail = ref(false);
const currentCustomer = ref({});
const projectProducts = ref([]);
const exportingExcel = ref(false);

const fieldsPaymentMethod = ref([
  {
    key: "index",
    label: "STT",
  },
  {
    key: "payment_method",
    label: "Hình thức thanh toán",
  },
  {
    key: "debt_date_number",
    label: "Số ngày công nợ",
  },
  {
    key: "action",
    label: "",
    class: "actions-cell",
  },
]);

const itemsPaymentMethod = ref([]);
const savingPaymentMethod = ref(false);
const loadingPaymentMethod = ref(false);
const btn_payment_method_text = ref("Thêm mới");

const fieldsShippingAgreement = ref([
  {
    key: "index",
    label: "STT",
  },
  {
    key: "shipping_agreement",
    label: "Thỏa thuận vận chuyển",
  },
  {
    key: "action",
    label: "",
    class: "actions-cell",
  },
]);

const itemsShippingAgreement = ref([]);
const savingShippingAgreement = ref(false);
const loadingShippingAgreement = ref(false);
const btn_shipping_agreement_text = ref("Thêm mới");

// Reactive objects
const trade = reactive({
  id: null,
  quotation_number: null,
  status: -1,
  type: 0,
  customer_id: null,
  customer_name: null,
  customer_phone: null,
  customer_address: null,
  customer_tax_code: null,
  customer_company_type_id: null,
  contact_person_name: null,
  contact_person_phone: null,
  customer_status: 1,
  sub_total: 0,
  extra_fee: null,
  note_extra_fee: null,
  fixed_discount: null,
  have_vat: false,
  vat_percent: 10,
  vat_value: 0,
  total: 0,
  profit: 0,
  bank_account_id: null,
  payment_method: "TT 100% trước khi giao hàng",
  payment_method_input: null,
  shipping_agreement: null,
  shipping_fee: 0,
  quotation_expiry_date: 3,
  staff_in_charge: null,
  staff_in_charge_name: null,
  staff_in_charge_phone: null,
  staff_in_charge_email: null,
  staff_in_charge_position: null,
  description: null,
  products: [],
  promotions: [],
  show_price_project: "true",
  shipping_date: "3-5 ngày kể từ ngày đặt hàng",
  guarantee: "Mới 100% bảo hành theo nhà Sản Xuất",
  attach_doc: null,
});

const currentProduct = reactive({
  index: -1,
  project_type: 0,
  project_name: null,
  project_brand_id: null,
  project_brand_name: null,
  project_unit_id: null,
  project_unit_name: null,
  project_quantity: 1,
  product_group_id: null,
  product_group_name: null,
  product_type_id: null,
  product_type_name: null,
  product_id: null,
  product_code: null,
  product_code_input: null,
  product_name: null,
  product_name_input: null,
  unit_id: null,
  unit_name: null,
  unit_id_input: null,
  unit_name_input: null,
  brand_id: null,
  brand_name: null,
  brand_id_input: null,
  brand_name_input: null,
  price_list: null,
  discount: null,
  price: null,
  discount_sale: null,
  discount_original_price: null,
  profit_on_item: null,
  amount: null,
  price_sell: null,
  amount_sell: null,
  profit: null,
  quantity_repo: null,
  quantity: null,
  is_available_in_repo: true,
  properties: [],
  note: null,
  description: [],
  target_unit_id: null,
  target_unit_name: null,
  conversion_value: null,
  quantity_root: null,
});

const productSearch = reactive({
  code: null,
  name: null,
  product_brand_id: null,
  product_type_id: null,
  product_group_id: null,
});

const customer = reactive({
  type: 0,
  name: null,
  code: null,
  phone_number: null,
  email: null,
  tax_code: null,
  company_type: null,
  gender: null,
  birthday: null,
  city_id: null,
  district_id: null,
  address: null,
  contact_person_name: null,
  contact_person_phone: null,
  contact_person_email: null,
  created_by: null,
});

const customerSearch = reactive({
  phone: null,
  name: null,
});

const paymentMethod = reactive({
  id: null,
  payment_method: null,
  debt_date_number: 0,
  index: null,
});

const shippingAgreement = reactive({
  id: null,
  shipping_agreement: null,
  index: null,
});

// Modal state refs (converted from $bvModal.show/hide)
const showModalProduct = ref(false);
const showModalAddProduct = ref(false);
const showModalCustomer = ref(false);
const showModalSearchCustomer = ref(false);
const showModalChooseMultipleUnit = ref(false);
const showModalPaymentMethod = ref(false);
const showModalShippingAgreement = ref(false);
const showModalProject = ref(false);
const showModalSearchProduct = ref(false);

const propertiesToString = (properties) => {
  let result = "";
  for (let i in properties) {
    result += properties[i].value;
  }
  return result;
};

// Lifecycle - onMounted
onMounted(() => {
  document.addEventListener("beforeunload", checkUpdateDraft);

  // Check prefix
  if (route.params.id) {
    prefix_title.value = "Cập Nhật";
  } else {
    prefix_title.value = "Thêm Mới";
  }

  // UI by staff
  let url = location.href;
  if (
    url.includes("quotation-staff") ||
    url.includes("quotation-project-staff")
  ) {
    userRole.value = "staff";
    if (url.includes("quotation-project-staff")) {
      trade.type = 1; // Báo giá dự án
      trade.guarantee = "1 năm"; // Báo giá dự án
      trade.quotation_expiry_date = 7;
    }
  } else {
    userRole.value = "admin";
    if (url.includes("quotation-project-all")) {
      trade.type = 1; // Báo giá dự án
      trade.guarantee = "1 năm"; // Báo giá dự án
      trade.quotation_expiry_date = 7;
    }
  }

  // Get today day, month, year
  let dateNow = new Date();
  today_day.value = dateNow.getDate();
  today_month.value = dateNow.getMonth() + 1;
  today_year.value = dateNow.getFullYear();

  // Get trade detail
  getTradeDetail();

  // Lấy danh sách khách hàng trước
  getCustomerOptions();

  // Lấy danh sách sản phẩm
  getProductOptions();

  // Lấy các danh sách còn lại sau
  getOptionsRelated();

  // Get store info
  getStoreDetail();
});

onBeforeUnmount(() => {
  document.removeEventListener("beforeunload", checkUpdateDraft);
});

// Methods converted to functions

/**
 *  Get customer options
 */
const getOptionsRelated = () => {
  console.log("userRole: " + userRole.value);
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
  };
  if (userRole.value == "admin") {
    params.staffs = true;
  }
  if (trade.type == 1) {
    params.projects = true;
  }

  loadingOptions.value = true;

  quotationApi
    .getOptionRelatedQuotation(params)
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        // Product groups
        if (params.product_groups) {
          productGroupOptions.value = res.data.data.product_groups;
          let itemProductGroupEmpty = { id: null, name: "-- Tất cả --" };
          productGroupOptions.value.unshift(itemProductGroupEmpty);
        }

        // Product types
        if (params.product_types) {
          productTypeOptionStore.value = res.data.data.product_types;
          resetListProductType();
        }

        // Cities
        if (params.cities) {
          optionsCity.value = res.data.data.cities;
          optionsCity.value.unshift({ value: null, text: "" });
          changeCity();
        }

        // Brands
        if (params.brands) {
          productBrandOptions.value = [
            { value: null, text: "-- Hãng sản phẩm --" },
          ];
          productBrandOptionsSearch.value = [{ value: null, text: "" }];
          let productBrands = res.data.data.brands;
          if (productBrands) {
            for (let i in productBrands) {
              let item = {
                value: productBrands[i].id,
                text: productBrands[i].name,
              };
              productBrandOptions.value.push(item);

              let itemSearch = {
                value: productBrands[i].id,
                text: productBrands[i].name,
              };
              productBrandOptionsSearch.value.push(itemSearch);
            }
          }
        }

        // Staffs
        if (params.staffs) {
          let staffs = res.data.data.staffs;
          optionsStaffStore.value = JSON.parse(JSON.stringify(staffs));
          optionsStaff.value = [{ value: null, text: "" }];
          if (staffs) {
            for (let i in staffs) {
              let item = { value: staffs[i].id, text: staffs[i].name };
              optionsStaff.value.push(item);
            }
          }
        }

        // Units
        if (params.units) {
          unitOptions.value = [{ value: null, text: "-- Đơn vị --" }];
          let units = res.data.data.units;
          if (units) {
            for (let i in units) {
              let item = { value: units[i].id, text: units[i].name };
              unitOptions.value.push(item);
            }
          }
        }

        // Bank accounts
        if (params.bank_accounts) {
          let bankAccounts = res.data.data.bank_accounts;
          bankAccountOptionStore.value = JSON.parse(
            JSON.stringify(bankAccounts),
          );

          bankAccountOptions.value = [
            { value: null, text: "-- Chọn tài khoản nhận thanh toán --" },
          ];
          if (bankAccounts) {
            for (let i in bankAccounts) {
              let itemText =
                bankAccounts[i].type_str +
                " - " +
                bankAccounts[i].account_name +
                " - " +
                bankAccounts[i].account_number +
                " - " +
                bankAccounts[i].bank_name;
              let item = { value: bankAccounts[i].id, text: itemText };
              bankAccountOptions.value.push(item);
            }
          }
          // Handle bank account
          handleBankAccount();
          changeBankAccount();
        }

        // Projects
        if (params.projects) {
          projectOptions.value = res.data.data.projects;
          projectOptions.value.unshift({
            id: null,
            name: "-- Chọn dự án mẫu --",
            brand_name: null,
            unit_name: null,
          });
          projectSelect.value = projectOptions.value[0];
        }

        // Payments methods
        if (params.payment_methods) {
          optionsPaymentMethod.value = res.data.data.payment_methods;
          optionsPaymentMethod.value.unshift({ value: null, text: "Khác" });
        }

        // Shipping agreements
        if (params.shipping_agreements) {
          optionsShippingAgreement.value = res.data.data.shipping_agreements;
          optionsShippingAgreement.value.unshift({ value: null, text: "" });
        }

        // Multiple Units
        if (params.multiple_units) {
          multipleUnitsOptionStore.value = res.data.data.multiple_units;
        }
      }

      loadingOptions.value = false;
    })
    .catch((err) => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);

      loadingOptions.value = false;
    });
};

/**
 *  Get customer options
 */
const getCustomerOptions = () => {
  console.log("userRole: " + userRole.value);
  let params = {};
  if (userRole.value == "staff") {
    params.customer_by_staff = true;
  } else {
    params.customer_by_admin = true;
  }

  loadingCustomerOptions.value = true;

  quotationApi
    .getCustomerOptions(params)
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        // Customers
        customerOptionStore.value = res.data.data;
        let itemEmpty = { id: null, name: "-- Chọn khách hàng --" };
        customerOptionStore.value.unshift(itemEmpty);
        getCustomerItemById(trade.customer_id);
        changeCustomer();
      }

      loadingCustomerOptions.value = false;
    })
    .catch((err) => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);

      loadingCustomerOptions.value = false;
    });
};

/**
 *  Get customer options
 */
const getProductOptions = () => {
  loadingProductOptions.value = true;

  quotationApi
    .getProductOptions()
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        // Products
        productOptions.value = res.data.data;
        let itemEmpty = { id: null, name_full: "-- Chọn sản phẩm --" };
        productOptions.value.unshift(itemEmpty);
        // resetListProduct()
        // changeProductType(true)
      }

      loadingProductOptions.value = false;
    })
    .catch((err) => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);

      loadingProductOptions.value = false;
    });
};

/**
 * Get district by city
 */
const changeCity = () => {
  let cityId = customer.city_id;
  if (cityId != "" && cityId != undefined) {
    MasterApi.getDistrictOptions(cityId).then((res) => {
      optionsDistrict.value = MasterMapper.mapCityModelToDto(res.data.data);
    });
  } else {
    customer.district_id = null;
  }
};

const openModalSearchProduct = () => {
  showModalSearchProduct.value = true;
};

const hideModalSearchProduct = () => {
  showModalSearchProduct.value = false;
};

const getProductItemById = (id) => {
  for (let i in productOptions) {
    if (productOptions[i].id == id) {
      return productOptions[i];
    }
  }
  return {};
};

/**
 * Search
 */
const searchProduct = () => {
  if (onSearchProduct) {
    return;
  }
  productSearchItems.value = [];

  onSearchProduct.value = true;

  if (!productSearch.product_type_id) {
    productSearch.product_type_id = null;
  }

  if (!productSearch.product_group_id) {
    productSearch.product_group_id = null;
  }

  let params = {
    code: productSearch.code,
    name: productSearch.name,
    product_type_id: productSearch.product_type_id,
    product_group_id: productSearch.product_group_id,
    product_brand_id: productSearch.product_brand_id,
    limit: 100,
    offset: 0,
  };

  productApi
    .searchProductByStaff(params)
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        productSearchItems.value = res.data.data.products;
      } else {
        productSearchItems.value = [];
      }
      onSearchProduct.value = false;
    })
    .catch((err) => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);

      onSearchProduct.value = false;
    });
};

const chooseProduct = (product_id) => {
  // Set product selected
  productSelect.value = getProductItemById(product_id);
  changeProduct();
  showModalSearchProduct.value = false;
};

const openModalAddCustomer = () => {
  showModalCustomer.value = true;
};

const openModalSearchCustomer = () => {
  showModalSearchCustomer.value = true;

  searchCustomer();
};

const openModalShippingAgreement = () => {
  getListShippingAgreement();
  showModalShippingAgreement.value = true;
};

const hideModalShippingAgreement = () => {
  showModalShippingAgreement.value = false;
};

const openModalPaymentMethod = () => {
  getListPaymentMethod();
  showModalPaymentMethod.value = true;
};

const hideModalPaymentMethod = () => {
  showModalPaymentMethod.value = false;
};

const backCustomer = () => {
  Object.assign(customer, {
    type: 0,
    name: null,
    code: null,
    phone_number: null,
    email: null,
    tax_code: null,
    gender: null,
    birthday: null,
    city_id: null,
    district_id: null,
    address: null,
    contact_person_name: null,
    contact_person_phone: null,
    contact_person_email: null,
    created_by: null,
  });
  showModalCustomer.value = false;
};

// getCustomerCodeById(id) {
//     for(let i in customerOptionStore) {
//         if(customerOptionStore[i].id == id) {
//             return customerOptionStore[i].code
//         }
//     }
//     return null
//   },

/**
 * Get staff options
 */
const updateCustomerInfo = () => {
  if (!trade.customer_id) {
    return;
  }
  let params = {
    id: trade.customer_id,
    name: trade.customer_name,
    phone: trade.customer_phone
      ? trade.customer_phone
      : trade.contact_person_phone,
    address: trade.customer_address,
    email: trade.customer_email,
    customer_company_type_id: trade.customer_company_type_id,
    contact_person_name: trade.contact_person_name,
    contact_person_phone: trade.contact_person_phone,
    code: currentCustomer.code,
    tax_code: trade.customer_tax_code,
  };
  customerApi.updateCustomerFromQuotation(params).then((res) => {
    if (res != null && res.data != null) {
      popToast("success", "Cập nhật thông tin khách hàng thành công!");

      if (customerSelect && customerSelect.id) {
        customerSelect.name = JSON.parse(JSON.stringify(trade.customer_name));
      }

      getCustomerOptions();
    }
  });
};

const saveCustomer = () => {
  if (!customer.name) {
    popToast("danger", "Vui lòng nhập tên khách hàng");
    return;
  }
  if (!customer.code) {
    popToast("danger", "Vui lòng nhập mã khách hàng");
    return;
  }
  if (customer.type == 1 && !customer.tax_code) {
    popToast("danger", "Vui lòng nhập mã số thuế");
    return;
  }

  // Add
  savingCustomer.value = true;
  customerApi
    .addCustomerByStore(customer)
    .then((res) => {
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast("success", "Thêm khách hàng thành công!");

          let customer_id = res.data.data;
          let customer = JSON.parse(JSON.stringify(customer));

          currentCustomer.value = JSON.parse(JSON.stringify(customer));
          currentCustomer.id = customer_id;

          // customerOptionStore.unshift({id: customer_id, name: customer.name})
          customerSelect.value = { id: customer_id, name: customer.name };

          trade.customer_id = customer_id;
          trade.customer_name = customer.name;
          trade.customer_phone = customer.phone_number;
          trade.customer_address = customer.address;
          trade.customer_email = customer.email;
          trade.customer_tax_code = customer.tax_code;
          trade.customer_company_type_id = customer.company_type;
          trade.contact_person_name = customer.contact_person_name;
          trade.contact_person_phone = customer.contact_person_phone;
          trade.customer_status = 1;

          getCustomerOptions();

          backCustomer();
        }
      }
      savingCustomer.value = false;
    })
    .catch((err) => {
      savingCustomer.value = false;

      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);
    });
};

const hideModalSearchCustomer = () => {
  showModalSearchCustomer.value = false;
};

/**
 * Search
 */
const searchCustomer = () => {
  if (onSearchCustomer) {
    return;
  }
  customerSearchItems.value = [];

  onSearchCustomer.value = true;

  let params = {
    name: customerSearch.name,
    phone: customerSearch.phone,
    staff_in_charge: null,
    city_id: null,
    type: null,
    limit: 50,
    offset: 0,
  };
  console.log("userRole: " + userRole.value);
  customerApi
    .getCustomerByStore(params, userRole.value)
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        customerSearchItems.value = res.data.data.customers;

        if (customerSearchItems.length == 0) {
          popToast("danger", "Không có khách hàng nào được tìm thấy");
        }
      } else {
        customerSearchItems.value = [];
        popToast("danger", "Không có khách hàng nào được tìm thấy");
      }
      onSearchCustomer.value = false;
    })
    .catch((err) => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);

      onSearchCustomer.value = false;
    });
};

const chooseCustomer = (id) => {
  getCustomerItemById(id);
  changeCustomer();

  showModalSearchCustomer.value = false;
};

const getCustomerItemById = (id) => {
  if (id) {
    for (let i in customerOptionStore) {
      if (customerOptionStore[i].id == id) {
        customerSelect.value = customerOptionStore[i];
      }
    }
  }
};

const handleProductExcel = () => {
  products_excel.value = [];
  if (trade.products.length > 0) {
    let productsExcel = JSON.parse(JSON.stringify(trade.products));

    for (let i in productsExcel) {
      let item = {
        index: productsExcel[i].index,
        product_code: productsExcel[i].product_code
          ? productsExcel[i].product_code
          : productsExcel[i].product_code_input,
        product_name: productsExcel[i].product_name
          ? productsExcel[i].product_name
          : productsExcel[i].product_name_input,
        brand_name: productsExcel[i].brand_name
          ? productsExcel[i].brand_name
          : productsExcel[i].brand_name_input,
        unit_name: productsExcel[i].target_unit_name
          ? productsExcel[i].target_unit_name
          : productsExcel[i].unit_name
            ? productsExcel[i].unit_name
            : productsExcel[i].unit_name_input,
        quantity: productsExcel[i].quantity,
        price: productsExcel[i].price_sell,
        amount: productsExcel[i].amount_sell,
        note: productsExcel[i].note,
      };
      products_excel.push(item);
    }
  }
};

/**
 *  Get detail
 */
const getTradeDetail = () => {
  let tradeId = route.params.id;
  if (tradeId) {
    loading.value = true;
    console.log("userRole: " + userRole.value);
    quotationApi
      .getQuotationDetail(tradeId, userRole.value)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          trade = res.data.data;

          // Format
          trade.sub_total = currencyFormat(
            (trade.sub_total + "").replaceAll(",", ""),
          );
          trade.profit = currencyFormat(
            (trade.profit + "").replaceAll(",", ""),
          );
          trade.total = currencyFormat((trade.total + "").replaceAll(",", ""));
          trade.extra_fee = currencyFormat(
            (trade.extra_fee + "").replaceAll(",", ""),
          );
          trade.fixed_discount = currencyFormat(
            (trade.fixed_discount + "").replaceAll(",", ""),
          );
          trade.shipping_fee = currencyFormat(
            (trade.shipping_fee + "").replaceAll(",", ""),
          );

          // Check flag show_price_project
          if (trade.show_price_project) {
            trade.show_price_project = "true";
          } else {
            trade.show_price_project = "false";
          }

          if (trade.customer_id) {
            getCustomerItemById(trade.customer_id);
            changeCustomer();
          }

          // Nếu là báo giá dự án thì handle lại list products
          if (trade.type == 1) {
            handleListProduct();
          }

          // Handle bank account
          handleBankAccount();
          changeBankAccount();

          handleProductExcel();

          calculateProductAmountByBrand();
        }

        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  }
};

const resetListProductType = () => {
  productTypeSearchOptions.value = JSON.parse(
    JSON.stringify(productTypeOptionStore.value),
  );
  productTypeSearchOptions.value.unshift({
    id: null,
    name: "-- Tất cả --",
    product_group_id: null,
  });
  productTypeSearchSelect.value = productTypeSearchOptions.value[0];
};

const changeProductGroupSearch = () => {
  if (productGroupSearchSelect.id) {
    productSearch.product_group_id = productGroupSearchSelect.id;

    // Reload list type by group
    productTypeSearchOptions.value = [];
    for (let i in productTypeOptionStore.value) {
      if (
        productSearch.product_group_id ==
        productTypeOptionStore.value[i].product_group_id
      ) {
        // let item = {id: productTypeOptionStore.value[i].value, name: productTypeOptionStore.value[i].text}
        productTypeSearchOptions.value.push(productTypeOptionStore.value[i]);
      }
    }
    if (productTypeSearchOptions.value.length > 0) {
      let itemEmpty = {};
      itemEmpty.id = null;
      itemEmpty.name = "-- Tất cả --";
      itemEmpty.product_group_id = null;
      productTypeSearchOptions.value.unshift(itemEmpty);
    }
  } else {
    productSearch.product_group_id = null;

    resetListProductType();
  }
};

const changeProductTypeSearch = () => {
  if (productTypeSearchSelect.id) {
    productSearch.product_type_id = productTypeSearchSelect.id;
  } else {
    productSearch.product_type_id = null;
  }
};

const compareObjectProperties = (properties, listProperties) => {
  for (let o in listProperties) {
    if (
      listProperties[o].name == properties.name &&
      listProperties[o].value == properties.value
    ) {
      return true;
    }
  }
  return false;
};

const calQuantityRepo = () => {
  if (currentProperties.length > 0 && currentProduct.properties.length > 0) {
    let properties = [];
    if (propertiesChoosen.length > 0) {
      for (let j in propertiesChoosen) {
        var ele = document.getElementsByName(propertiesChoosen[j]);

        for (let i = 0; i < ele.length; i++) {
          if (ele[i].checked) {
            let item = { name: propertiesChoosen[j], value: ele[i].value };
            properties.push(item);
          }
        }
      }
    }

    // let quantity_repo_obj = null
    if (properties.length > 0) {
      currentProduct.quantity_repo = 0;
      for (let x in currentProduct.properties) {
        let properties_str = propertiesToString(currentProduct.properties[x]);
        let properties_input_str = propertiesToString(properties);

        if (properties_str.includes(properties_input_str)) {
          currentProduct.quantity_repo = currencyFormat(
            properties_str.replaceAll(properties_input_str, ""),
          );
        }
      }
    }
  }
};

const changeBrandInput = () => {
  if (currentProduct.brand_id_input) {
    for (let brand of productBrandOptions.value) {
      if (brand.value == currentProduct.brand_id_input) {
        currentProduct.brand_name_input = brand.text;
        return;
      }
    }
  } else {
    currentProduct.brand_name_input = null;
  }
};

const changeUnitInput = () => {
  if (currentProduct.unit_id_input) {
    for (let unit of unitOptions.value) {
      if (unit.value == currentProduct.unit_id_input) {
        currentProduct.unit_name_input = unit.text;
        return;
      }
    }
  } else {
    currentProduct.unit_name_input = null;
  }
};

const changeProjectBrand = () => {
  if (currentProduct.project_brand_id) {
    for (let brand of productBrandOptions.value) {
      if (brand.value == currentProduct.project_brand_id) {
        currentProduct.project_brand_name = brand.text;
        return;
      }
    }
  } else {
    currentProduct.project_brand_name = null;
  }
};

const changeProjectUnit = () => {
  if (currentProduct.project_unit_id) {
    for (let unit of unitOptions.value) {
      if (unit.value == currentProduct.project_unit_id) {
        currentProduct.project_unit_name = unit.text;
        return;
      }
    }
  } else {
    currentProduct.project_unit_name = null;
  }
};

/**
 *  Event change product
 */
const changeProduct = () => {
  if (productSelect.value && productSelect.value.id) {
    currentProduct.product_id = productSelect.value.id;

    // Call api: get product info detail
    loadProductDetail.value = true;
    quotationApi
      .getProductDetail(productSelect.value.id)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let product = res.data.data;

          currentProduct.product_group_id = product.product_group_id;
          currentProduct.product_type_id = product.product_type_id;
          currentProduct.product_name = product.name;
          currentProduct.product_code = product.code;
          currentProduct.description = product.description;
          currentProduct.have_resource = product.have_resource;

          let price_list = product.price_list;
          if (!price_list) {
            price_list = 0;
          }

          let discount = product.discount;
          if (!discount) {
            discount = 0;
          }
          currentProduct.price_list = currencyFormat(price_list);
          currentProduct.discount = discount;

          let price = product.price;
          if (!price) {
            price = Math.round(
              (parseInt(price_list) * (100 - parseFloat(discount))) / 100,
            );
          }
          currentProduct.price = currencyFormat(price);

          if (product.price_sell) {
            currentProduct.price_sell = currencyFormat(product.price_sell);
          }
          currentProduct.quantity_repo = currencyFormat(product.quantity_repo);
          currentProduct.properties = product.properties;
          currentProduct.unit_name = product.unit_name;
          currentProduct.unit_id = product.unit_id;
          root_unit.value = { id: product.unit_id, name: product.unit_name };
          currentProduct.brand_name = product.brand_name;
          currentProduct.brand_id = product.brand_id;
        }
        loadProductDetail.value = false;
      })
      .catch((err) => {
        loadProductDetail.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  } else {
    refreshCurrentProduct();
  }

  // Kiểm tra SP này có nhiều đơn vị hay ko
  setTimeout(() => {
    checkMultipleUnit();
  }, 500);
};

/**
 * Check multiple unit
 */
const checkMultipleUnit = () => {
  if (productSelect.value && productSelect.value.is_multi_unit) {
    multipleUnitsOption.value = [];
    let index = 0;
    for (let item of multipleUnitsOptionStore.value) {
      if (item.product_id == productSelect.value.id) {
        if (index == 0) {
          multipleUnitsOption.value.push({
            value: item.root_unit_id,
            text: item.root_unit_name,
          });
          multipleUnitsOption.value.push({
            value: item.target_unit_id,
            text: item.target_unit_name,
          });
        } else {
          multipleUnitsOption.value.push({
            value: item.target_unit_id,
            text: item.target_unit_name,
          });
        }
        index += 1;
      }
    }
    if (multipleUnitsOption.value.length > 0) {
      current_unit.value = multipleUnitsOption.value[0].value;
      openModalChooseMultipleUnit();
    }
  }
};

/**
 * Get detail
 */
const getStoreDetail = () => {
  let storeId = authStore.user.storeId;
  if (storeId) {
    superAdminAPI
      .getStoreDetail(storeId)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let store = res.data.data;
          store_name.value = store.name;
          store_phone_number.value = store.phone_number;
          store_tax_code.value = store.phone_number;

          var address = "";
          if (store.address) {
            address += store.address;
          }
          if (store.district_name) {
            address += store.district_name;
          }
          if (store.city_name) {
            address += ", " + store.city_name;
          }
          store_address.value = address;
        }
      })
      .catch((err) => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  } else {
    authStore.logout();
    router.push("/staff-login");
  }
};

// selectGroupProduct(item) {
//   if(item) {
//       currentProduct.product_group_id = item.id
//     currentProduct.product_group_name = item.name
//       productSearch.product_group_id = item.id
//       if(item.id) {
//           changeProductGroup()
//       }
//
//   } else {
//       currentProduct.product_group_id = null
//     currentProduct.product_group_name = null
//       productSearch.product_group_id = null
//   }
// },

// selectTypeProduct(item) {
//   if(item) {
//       currentProduct.product_type_id = item.id
//     currentProduct.product_type_name = item.name
//       productSearch.product_type_id = item.id
//       if(item.id) {
//           changeProductType()
//       }
//
//   } else {
//       currentProduct.product_type_id = null
//       productSearch.product_type_id = null
//   }
// },

// selectProduct(item) {
//   if(item) {
//       currentProduct.product_id = item.id
//     currentProduct.product_code = item.code
//     currentProduct.product_name = item.name
//       changeProduct()
//   } else {
//       currentProduct.product_id = null
//   }
// },

/**
 *  Event change customer
 */
const changeCustomer = () => {
  if (customerSelect.value && customerSelect.value.id) {
    trade.customer_id = customerSelect.value.id;
    trade.customer_name = customerSelect.value.name;

    // Call api: get user info detail
    loadCusDetail.value = true;
    quotationApi
      .getCustomerDetail(customerSelect.value.id)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let customer = res.data.data;
          currentCustomer.value = JSON.parse(JSON.stringify(customer));

          trade.customer_phone = customer.phone_number;
          trade.customer_address = customer.address;
          trade.customer_email = customer.email;
          trade.customer_tax_code = customer.tax_code;
          trade.customer_company_type_id = customer.company_type;
          trade.contact_person_name = customer.contact_person_name;
          trade.contact_person_phone = customer.contact_person_phone;
          trade.customer_status =
            customer.customer_order_number && customer.customer_order_number > 0
              ? 2
              : 1;
        }
        loadCusDetail.value = false;
      })
      .catch((err) => {
        loadCusDetail.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  }
  // else {
  //   refreshCustomerInfo()
  // }
};

const calculateProductProject = (product) => {
  if (!product.price_list) {
    product.price_list = 0;
  }
  if (!product.discount) {
    product.discount = 0;
  }
  if (!product.price) {
    product.price = 0;
  }
  if (!product.discount_sale) {
    product.discount_sale = 0;
  }
  if (!product.discount_original_price) {
    product.discount_original_price = 0;
  }
  if (!product.profit_on_item) {
    product.profit_on_item = 0;
  }
  if (!product.quantity) {
    product.quantity = 0;
  }
  if (!product.price_sell) {
    product.price_sell = 0;
  }

  let discount_temp = product.discount_sale;
  if (discount_temp == 0) {
    discount_temp = product.discount_original_price;
  }

  if (!product.price_list) {
    product.price_list = product.price;
    product.discount = 0;
  } else {
    if (product.discount == 0) {
      product.price_list = product.price;
    } else {
      product.discount =
        Math.round(
          ((product.price_list - product.price) / product.price_list) *
            100 *
            100,
        ) / 100;
    }
  }

  if (!product.price) {
    product.price = Math.round(
      (product.price_list * (100 - product.discount)) / 100,
    );
  }

  product.profit_on_item = Math.round(
    (product.price_list * discount_temp) / 100,
  );

  // product.price_sell = product.profit_on_item + parseInt(product.price)

  product.amount_sell = product.price_sell * product.quantity;
  product.profit = Math.round(
    (parseInt(product.price_sell) - parseInt(product.price)) * product.quantity,
  );

  return product;
};

/**
 *  Event change customer
 */
const changeProject = () => {
  if (projectSelect && projectSelect.id) {
    // Call api: get project detail
    loadProjectDetail.value = true;
    quotationApi
      .getProjectDetail(projectSelect.id)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let products = res.data.data;
          currentProduct.project_name = projectSelect.name;

          // let product_index = trade.products.length + 1
          for (let product of products) {
            product.product_code_input = null;
            product.product_name_input = null;
            product.unit_id_input = null;
            product.unit_name_input = null;
            product.brand_id_input = null;
            product.brand_name_input = null;
            product.discount_sale = 0; // TODO
            product.discount_original_price = 0; // TODO
            product.is_available_in_repo = null; // TODO
            product.note = null; // TODO
            product.properties = []; // TODO: hiện tại ciPro ko dùng tới properties
            product.index = trade.products.length + 1; //product_index

            product.project_brand_id = projectSelect.brand_id;
            product.project_brand_name = projectSelect.brand_name;
            product.project_unit_id = projectSelect.unit_id;
            product.project_unit_name = projectSelect.unit_name;

            product.target_unit_id = null;
            product.target_unit_name = null;
            product.conversion_value = null;
            product.quantity_root = null;

            let item = calculateProductProject(product);

            trade.products.push(item);

            // product_index += 1
          }
          handleListProduct();
          calculateAmount();
          handleProductExcel();

          // Lưu nháp
          if (trade.id) {
            updateDraft();
          } else {
            saveDraft();
          }
        }
        loadProjectDetail.value = false;
      })
      .catch((err) => {
        loadProjectDetail.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  }
};

const changeProjectType = () => {
  if (currentProduct.project_type == 0) {
    projectSelect.value = projectOptions[0];
  } else {
    currentProduct.project_name = null;
    currentProduct.project_brand_id = null;
    currentProduct.project_brand_name = null;
    currentProduct.project_unit_id = null;
    currentProduct.project_unit_name = null;
  }
};

const refreshCustomerInfo = () => {
  trade.customer_id = null;
  trade.customer_name = null;
  trade.customer_phone = null;
  trade.customer_address = null;
  trade.customer_email = null;
  trade.customer_tax_code = null;
  trade.customer_company_type_id = null;
  trade.contact_person_name = null;
  trade.contact_person_phone = null;
  trade.customer_status = null;
};

/**
 * Refresh current product
 */
const refreshCurrentProduct = () => {
  currentProduct.index = -1;
  currentProduct.product_type = 0;
  // currentProduct.project_name = null
  currentProduct.project_quantity = 1;
  currentProduct.product_id = null;
  currentProduct.product_code = null;
  currentProduct.product_code_input = null;
  currentProduct.product_name = null;
  currentProduct.product_name_input = null;
  currentProduct.unit_id = null;
  currentProduct.unit_name = null;
  currentProduct.unit_id_input = null;
  currentProduct.unit_name_input = null;
  currentProduct.brand_id = null;
  currentProduct.brand_name = null;
  currentProduct.brand_id_input = null;
  currentProduct.brand_name_input = null;
  currentProduct.price_list = null;
  currentProduct.discount = null;
  currentProduct.price = null;
  currentProduct.discount_sale = 0;
  currentProduct.discount_original_price = 0;
  currentProduct.profit_on_item = 0;
  currentProduct.amount = null;
  currentProduct.price_sell = null;
  currentProduct.amount_sell = null;
  currentProduct.profit = 0;
  currentProduct.quantity_repo = null;
  currentProduct.quantity = null;
  currentProduct.is_available_in_repo = null;
  currentProduct.properties = [];
  currentProduct.note = null;
  currentProduct.description = [];
  currentProduct.target_unit_id = null;
  currentProduct.target_unit_name = null;
  currentProduct.conversion_value = null;
  currentProduct.quantity_root = null;

  productSelect.value = productOptions[0];
};

const refreshTradeInfo = () => {
  trade = {
    id: null,
    quotation_number: null,
    status: -1,
    type: 0,
    customer_id: null,
    customer_name: null,
    customer_phone: null,
    customer_address: null,
    customer_tax_code: null,
    customer_company_type_id: null,
    contact_person_name: null,
    contact_person_phone: null,
    customer_status: 1,
    sub_total: 0,
    extra_fee: null,
    note_extra_fee: null,
    fixed_discount: null,
    have_vat: false,
    vat_percent: 10,
    vat_value: 0,
    total: 0,
    profit: 0,
    bank_account_id: null,
    payment_method: "TT 100% trước khi giao hàng",
    payment_method_input: null,
    shipping_agreement: null,
    shipping_fee: 0,
    quotation_expiry_date: 3,
    staff_in_charge: null,
    description: null,
    products: [],
    promotions: [],
    show_price_project: "true",
    shipping_date: "3-5 ngày kể từ ngày đặt hàng",
    guarantee: "Mới 100% bảo hành theo nhà Sản Xuất",
    attach_doc: null,
  };
  if (url.includes("quotation-project")) {
    trade.type = 1; // Báo giá dự án
    trade.guarantee = "1 năm"; // Báo giá dự án
    trade.quotation_expiry_date = 7;
  }
};

/**
 * Tính toán thành tiền sản phẩm
 */
const calculateAmount = (keyInput) => {
  let amount = 0;
  // let total_profit_margin = 0
  let total_profit = 0;
  for (let i in trade.products) {
    amount += Math.round(
      (trade.products[i].price_sell + "").replaceAll(",", "") *
        (trade.products[i].quantity + "").replaceAll(",", ""),
    );
    // total_profit_margin += parseFloat(trade.products[i].profit_margin)
    let profit = (trade.products[i].profit + "").replaceAll(",", "");
    total_profit += parseInt(profit);
  }

  trade.sub_total = currencyFormat(amount);

  let extra_fee = 0;
  if (trade.extra_fee) {
    extra_fee = (trade.extra_fee + "").replaceAll(",", "");
    trade.extra_fee = currencyFormat(extra_fee);
  }

  let fixed_discount = 0;
  if (trade.fixed_discount) {
    fixed_discount = (trade.fixed_discount + "").replaceAll(",", "");
    trade.fixed_discount = currencyFormat(fixed_discount);
  }

  // Calculate vat value
  let vat_value = 0;
  if (trade.have_vat) {
    if (trade.vat_percent) {
      vat_value = Math.round(
        ((amount + parseInt(extra_fee) - parseInt(fixed_discount)) *
          trade.vat_percent) /
          100,
      );
      trade.vat_value = currencyFormat(vat_value);
    } else {
      trade.vat_value = 0;
    }
  } else {
    trade.vat_value = 0;
  }

  trade.profit = currencyFormat(total_profit - parseInt(fixed_discount));
  // trade.profit_margin = total_profit_margin
  trade.total = currencyFormat(
    amount + parseInt(extra_fee) - parseInt(fixed_discount) + vat_value,
  );

  // Check reload bank account
  if (keyInput == "vat") {
    handleBankAccount();
  }

  // Tính toán amount theo brand
  calculateProductAmountByBrand();
};

const calculateProductAmountByBrand = () => {
  brands_amount.value = [];

  let brands_name = [];
  let brands_amount_arr = [];
  for (let product of trade.products) {
    let brand_name = product.brand_name;
    if (!brand_name) {
      brand_name = product.brand_name_input;
    }
    if (!brand_name) {
      break;
    }
    let price = (product.price + "").replaceAll(",", "");
    let quantity = (product.quantity + "").replaceAll(",", "");
    let amount = Math.round(parseInt(price) * parseFloat(quantity));
    if (brands_name.includes(brand_name)) {
      for (let brand of brands_amount_arr) {
        if (brand.name == brand_name) {
          brand.amount += amount;
          break;
        }
      }
    } else {
      let item = { name: brand_name, amount: amount };
      brands_amount_arr.push(item);
      brands_name.push(brand_name);
    }
  }
  brands_amount.value = brands_amount_arr;
};

const getCurrentBankAccountType = () => {
  if (trade.bank_account_id) {
    for (let i in bankAccountOptionStore) {
      if (bankAccountOptionStore[i].id == trade.bank_account_id) {
        return bankAccountOptionStore[i].type;
      }
    }
  }
  return null;
};

const handleBankAccount = () => {
  // Check bank account isvalid
  let currentBankAccountType = getCurrentBankAccountType();
  if (trade.have_vat) {
    if (currentBankAccountType != 1) {
      trade.bank_account_id = null;
      let firstItemId = null;
      for (let i in bankAccountOptionStore) {
        if (bankAccountOptionStore[i].type == 1) {
          firstItemId = bankAccountOptionStore[i].id;
          if (bankAccountOptionStore[i].is_default) {
            trade.bank_account_id = bankAccountOptionStore[i].id;
          }
        }
      }
      if (!trade.bank_account_id) {
        trade.bank_account_id = firstItemId;
      }
    }
  } else {
    if (currentBankAccountType != 0) {
      trade.bank_account_id = null;
      let firstItemId = null;
      for (let i in bankAccountOptionStore) {
        if (bankAccountOptionStore[i].type == 0) {
          firstItemId = bankAccountOptionStore[i].id;
          if (bankAccountOptionStore[i].is_default) {
            trade.bank_account_id = bankAccountOptionStore[i].id;
          }
        }
      }
      if (!trade.bank_account_id) {
        trade.bank_account_id = firstItemId;
      }
    }
  }
  if (!trade.bank_account_id && bankAccountOptionStore.length) {
    trade.bank_account_id = bankAccountOptionStore[0].id;
  }
  changeBankAccount();
};

/**
 *  Xác nhận sản phẩm
 */
const confirmBuyProduct = () => {
  console.log("xx2:" + JSON.stringify(currentProduct));
  // // TODO: kiểm tra trùng sản phẩm
  // for(let product of trade.products) {
  //   if(currentProduct.product_id == product.product_id) {
  //     popToast('danger', "Sản phẩm này đã được thêm vào danh sách sản phẩm báo giá bên dưới. Vui lòng kiểm tra lại!")
  //     return
  //   }
  // }

  if (trade.type == 1 && !currentProduct.project_name) {
    popToast("danger", "Vui lòng nhập tên dự án");
    return;
  }
  if (trade.type == 1 && !currentProduct.project_quantity) {
    popToast("danger", "Vui lòng nhập số lượng dự án");
    return;
  }

  // Check product group
  if (!currentProduct.product_group_id) {
    currentProduct.product_group_id = null;
    currentProduct.product_group_name = null;
  }

  // Check product type
  if (!currentProduct.product_type_id) {
    currentProduct.product_type_id = null;
    currentProduct.product_type_name = null;
  }

  // Check product
  if (!currentProduct.product_id) {
    currentProduct.product_id = null;
    currentProduct.product_code = null;
    currentProduct.product_name = null;

    if (!currentProduct.product_name_input) {
      popToast("danger", "Vui lòng chọn hoặc nhập tạm tên sản phẩm");
      return;
    }
  }

  // Check price buy
  if (currentProduct.price == null || currentProduct.price == "") {
    if (is_have_price_sell) {
      currentProduct.price = 0;
    } else {
      popToast("danger", "Vui lòng nhập giá bán sản phẩm");
      return;
    }
  }

  // Check quantity
  if (currentProduct.quantity == null || currentProduct.quantity == "") {
    popToast("danger", "Vui lòng nhập số lượng sản phẩm bán");
    return;
  }

  // Check quantity bán và số lượng trong kho
  let quantity_repo = (currentProduct.quantity_repo + "").replaceAll(",", "");
  if (parseFloat(currentProduct.quantity) > parseFloat(quantity_repo)) {
    // popToast('danger', "Không thể bán số lượng lớn hơn số lượng đang có trong kho")
    // return
    // TODO: thêm thuộc tính báo sản phẩm đang có trong kho hay ko
  }
  currentProduct.price_list = (currentProduct.price_list + "").replaceAll(
    ",",
    "",
  );
  currentProduct.price = (currentProduct.price + "").replaceAll(",", "");
  if (!currentProduct.profit_on_item) {
    currentProduct.profit_on_item = 0;
  } else {
    currentProduct.profit_on_item = (
      currentProduct.profit_on_item + ""
    ).replaceAll(",", "");
  }

  currentProduct.quantity = (currentProduct.quantity + "").replaceAll(",", "");
  currentProduct.amount = Math.round(
    currentProduct.price * currentProduct.quantity,
  );

  if (!currentProduct.price_sell) {
    currentProduct.price_sell = currentProduct.price;
  }
  if (
    currentProduct.discount_sale == "" ||
    currentProduct.discount_sale == null
  ) {
    currentProduct.discount_sale = 0;
  }
  if (
    currentProduct.discount_original_price == "" ||
    currentProduct.discount_original_price == null
  ) {
    currentProduct.discount_original_price = 0;
  }
  currentProduct.price_sell = (currentProduct.price_sell + "").replaceAll(
    ",",
    "",
  );
  currentProduct.profit = (currentProduct.profit + "").replaceAll(",", "");
  currentProduct.amount_sell = Math.round(
    currentProduct.price_sell * currentProduct.quantity,
  );

  // TODO: handle thuộc tính sp
  let properties = [];
  if (propertiesChoosen.length > 0) {
    for (let j in propertiesChoosen) {
      var ele = document.getElementsByName(propertiesChoosen[j]);

      for (let i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
          let item = { name: propertiesChoosen[j], value: ele[i].value };
          properties.push(item);
        }
      }
    }
  }
  currentProduct.properties = properties;

  console.log("xx:" + JSON.stringify(currentProduct));
  if (currentProduct.index == -1) {
    // Thêm mới product
    currentProduct.index = trade.products.length + 1;
    trade.products.push(JSON.parse(JSON.stringify(currentProduct)));
  } else {
    // Cập nhật product
    trade.products[currentProduct.index - 1] = JSON.parse(
      JSON.stringify(currentProduct),
    );
  }

  // Nếu là báo giá dự an thì phải handle lại danh sách sản phẩm
  if (trade.type == 1) {
    handleListProduct();
  }

  console.log("xx:" + JSON.stringify(trade.products));

  // Tính toán amount
  calculateAmount();

  console.log("xx:" + JSON.stringify(trade.products));

  // TODO: làm sau: Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
  //   if(currentProduct.product_id){
  //       updateQuantityRepo(JSON.parse(JSON.stringify(currentProduct.product_id)), JSON.parse(JSON.stringify(currentProduct.quantity)), properties, 'sell')
  //   }
  console.log("xx:" + JSON.stringify(trade.products));

  // Refresh current product
  refreshCurrentProduct();

  handleProductExcel();

  console.log("xx:" + JSON.stringify(trade.products));

  // Lưu nháp
  if (trade.id) {
    updateDraft();
  } else {
    saveDraft();
  }

  console.log("xx:" + JSON.stringify(trade.products));
};

const getParentIndexByName = (list_projects_products, project_name) => {
  let pro_ind = 0;
  for (let item of list_projects_products) {
    if (item.product_name == project_name) {
      return pro_ind;
    }
    pro_ind += 1;
  }
  return 0;
};

const handleListProduct = () => {
  if (trade.products.length > 0) {
    console.log("bbbbbbbbbbbbbbbbbbbbbb");
    console.log(trade.products);
    console.log("bbbbbbbbbbbbbb");

    // Tạo danh sách dự án
    let list_projects = [];
    let list_name_project_checked = [];
    for (let p of trade.products) {
      if (!list_name_project_checked.includes(p.project_name)) {
        list_name_project_checked.push(p.project_name);
        let project = JSON.parse(JSON.stringify(currentProduct));
        // project.project_index = index
        project.product_name = p.project_name;
        project.project_brand_name = p.project_brand_name;
        project.project_unit_name = p.project_unit_name;
        project.project_quantity = parseFloat(p.project_quantity);
        project.project_amount = 0;
        list_projects.push(project);
      }
    }

    // Gom sản phẩm theo dự án
    let list_projects_products = [];
    let project_index = 1;
    for (let project of list_projects) {
      project.project_index = project_index;
      project.product_type = 0; // Dự án
      list_projects_products.push(project);

      let product_index = 1;
      for (let product of trade.products) {
        let project_item = JSON.parse(JSON.stringify(product));
        if (product.project_name == project.product_name) {
          project_item.project_index =
            project.project_index + "." + product_index;
          project_item.product_type = 1; // Sản phẩm

          project_item = reformatProductItem(project_item);

          list_projects_products.push(project_item);

          let parent_index = getParentIndexByName(
            list_projects_products,
            product.project_name,
          );
          let amount_sell = (product.amount_sell + "").replaceAll(",", "");
          list_projects_products[parent_index].project_amount +=
            parseInt(amount_sell);
          product_index += 1;
        }
      }

      project_index += 1;
    }

    // Tính đơn giá dự án
    for (let project of list_projects_products) {
      if (project.product_type == 0) {
        project.project_price = Math.round(
          project.project_amount / project.project_quantity,
        );
      }
    }

    projectProducts.value = list_projects_products;

    console.log("aaaaaa");
    console.log(projectProducts);
    console.log("aaaaaa");
  }
};

/**
 * Cập nhật số lượng sản phẩm tại client khi mua sản phẩm
 */
const updateQuantityRepo = (product_id, quantitySell, properties, type) => {
  for (let i in productOptionStore) {
    if (product_id == productOptionStore[i].id) {
      if (type == "sell") {
        productOptionStore[i].quantity =
          parseFloat(productOptionStore[i].quantity) - parseFloat(quantitySell);
      }
      if (type == "delete") {
        productOptionStore[i].quantity =
          parseFloat(productOptionStore[i].quantity) + parseFloat(quantitySell);
      }

      // Update quantity cả trong thuộc tính
      if (productOptionStore[i].properties.length > 0) {
        for (let j in productOptionStore[i].properties) {
          let properties_str = propertiesToString(
            productOptionStore[i].properties[j],
          );
          let properties_input_str = propertiesToString(properties);

          if (properties_str.includes(properties_input_str)) {
            for (let x in productOptionStore[i].properties[j]) {
              if (productOptionStore[i].properties[j][x].name == "quantity") {
                if (type == "sell") {
                  productOptionStore[i].properties[j][x].value =
                    parseFloat(productOptionStore[i].properties[j][x].value) -
                    parseFloat(quantitySell);
                }
                if (type == "delete") {
                  productOptionStore[i].properties[j][x].value =
                    parseFloat(productOptionStore[i].properties[j][x].value) +
                    parseFloat(quantitySell);
                }
              }
            }
          }
        }
      }
    }
  }
};

/**
 *  Save
 */
const saveDraft = () => {
  // Reformat data
  let data = JSON.parse(JSON.stringify(trade));
  data = handleTradeInfoBeforeSave(data);
  if (data.products.length == 0) {
    return;
  }

  quotationApi
    .saveDraftQuotation(data)
    .then((res) => {
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast("success", "Lưu nháp thành công!");

          // trade.products = reformatProduct(data.products)
          let response = res.data.data;
          trade.id = response.quotation_id;
          trade.quotation_number = response.quotation_number;
          trade.staff_in_charge_name = response.staff_in_charge_name;
          trade.staff_in_charge_phone = response.staff_in_charge_phone;
          trade.staff_in_charge_email = response.staff_in_charge_email;
          trade.staff_in_charge_position = response.staff_in_charge_position;
        }
      }
    })
    .catch((err) => {});
};

const changeStaffInChange = () => {
  if (trade.staff_in_charge) {
    for (let i in optionsStaffStore) {
      if (optionsStaffStore[i].id == trade.staff_in_charge) {
        trade.staff_in_charge_name = optionsStaffStore[i].name;
        trade.staff_in_charge_phone = optionsStaffStore[i].phone_number;
        trade.staff_in_charge_email = optionsStaffStore[i].email;
        trade.staff_in_charge_position = optionsStaffStore[i].position;
      }
    }
  } else {
    trade.staff_in_charge_name = null;
    trade.staff_in_charge_phone = null;
    trade.staff_in_charge_email = null;
    trade.staff_in_charge_position = null;
  }
};

const formatProductItem = (product) => {
  product.price_list = (product.price_list + "").replaceAll(",", "");
  product.price = (product.price + "").replaceAll(",", "");
  product.profit_on_item = (product.profit_on_item + "").replaceAll(",", "");
  product.price_sell = (product.price_sell + "").replaceAll(",", "");
  product.quantity = (product.quantity + "").replaceAll(",", "");
  product.amount = (product.amount + "").replaceAll(",", "");
  if (
    product.amount == "" ||
    product.amount == "null" ||
    product.amount == "NaN"
  ) {
    product.amount = 0;
  }
  product.amount_sell = (product.amount_sell + "").replaceAll(",", "");
  if (
    product.amount_sell == "" ||
    product.amount_sell == "null" ||
    product.amount_sell == "NaN"
  ) {
    product.amount_sell = 0;
  }
  product.profit = (product.profit + "").replaceAll(",", "");

  if (product.conversion_value) {
    product.quantity_root =
      parseFloat(product.quantity) / parseFloat(product.conversion_value);
  }

  return product;
};

const formatProduct = (products) => {
  for (let product of products) {
    product = formatProductItem(product);
  }
  return products;
};

const reformatProductItem = (product) => {
  product.price_list = currencyFormat(
    (product.price_list + "").replaceAll(",", ""),
  );
  product.price = currencyFormat((product.price + "").replaceAll(",", ""));
  product.profit_on_item = currencyFormat(
    (product.profit_on_item + "").replaceAll(",", ""),
  );
  product.price_sell = currencyFormat(
    (product.price_sell + "").replaceAll(",", ""),
  );
  product.quantity = currencyFormat(
    (product.quantity + "").replaceAll(",", ""),
  );
  product.amount = currencyFormat((product.amount + "").replaceAll(",", ""));
  if (
    product.amount == "" ||
    product.amount == "null" ||
    product.amount == "NaN"
  ) {
    product.amount = 0;
  }
  product.amount_sell = (product.amount_sell + "").replaceAll(",", "");
  if (
    product.amount_sell == "" ||
    product.amount_sell == "null" ||
    product.amount_sell == "NaN"
  ) {
    product.amount_sell = 0;
  }
  product.profit = currencyFormat((product.profit + "").replaceAll(",", ""));

  return product;
};

const reformatProduct = (products) => {
  for (let product of products) {
    product = reformatProductItem(product);
  }
  return products;
};

const handleTradeInfoBeforeSave = (data) => {
  if (data.show_price_project == "true") {
    data.show_price_project = true;
  } else {
    data.show_price_project = false;
  }

  if (!data.customer_id) {
    data.customer_id = null;
  }

  data.sub_total = (data.sub_total + "").replaceAll(",", "");

  let extra_fee = 0;
  if (data.extra_fee) {
    extra_fee = (data.extra_fee + "").replaceAll(",", "");
  }
  data.extra_fee = extra_fee;

  let fixed_discount = 0;
  if (data.fixed_discount) {
    fixed_discount = (data.fixed_discount + "").replaceAll(",", "");
  }
  data.fixed_discount = fixed_discount;

  let profit = 0;
  if (data.profit) {
    profit = (data.profit + "").replaceAll(",", "");
  }
  data.profit = profit;

  data.total = (data.total + "").replaceAll(",", "");

  let vat_value = 0;
  if (data.vat_value) {
    vat_value = (data.vat_value + "").replaceAll(",", "");
  }
  data.vat_value = vat_value;

  let shipping_fee = 0;
  if (data.shipping_fee) {
    shipping_fee = (data.shipping_fee + "").replaceAll(",", "");
  }
  data.shipping_fee = shipping_fee;

  // Check products
  data.products = formatProduct(data.products);

  return data;
};

/**
 *  Update draft
 */
const updateDraft = () => {
  if (trade.id == null) {
    return;
  }

  // Reformat data
  let data = JSON.parse(JSON.stringify(trade));
  data = handleTradeInfoBeforeSave(data);
  if (data.products.length == 0) {
    return;
  }

  quotationApi
    .updateDraftQuotation(data)
    .then((res) => {
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast("success", "Lưu nháp thành công!");
          // trade.products = reformatProduct(data.products)
        }
      }
    })
    .catch((err) => {});
};

const checkUpdateDraft = () => {
  if (saveSuccess == false) {
    updateDraft();
  }
};

/**
 *  Save
 */
const save = () => {
  // Reformat data
  let data = JSON.parse(JSON.stringify(trade));

  // validate
  if (
    !data.customer_name ||
    !data.contact_person_name ||
    !data.contact_person_phone ||
    data.customer_company_type_id == null ||
    !data.customer_status
  ) {
    popToast("danger", "Hãy nhập đủ thông tin bắt buộc của khách hàng");
    return;
  }

  // Check products
  data = handleTradeInfoBeforeSave(data);
  if (data.products.length == 0) {
    return;
  }

  saving.value = true;

  quotationApi
    .saveQuotation(data)
    .then((res) => {
      saving.value = false;
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          back();
        }
      }
    })
    .catch((err) => {
      saving.value = false;

      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);
    });
};

// handlePrintProvisionalInvoice() {
//   if(trade.type == 0) {
//     openModalChooseFilePrint()
//   } else {
//     printProvisionalInvoice()
//   }
// },

/**
 * In hoá đơn tạm tính
 */
const printProvisionalInvoice = () => {
  console.log("in");
  console.log(JSON.stringify(trade));

  var mywindow = window.open("", "PRINT", "height=900,width=1200");

  mywindow.document.write("<html><head><title> </title><style>");
  mywindow.document.write(" body {font-size: 14px;} ");
  mywindow.document.write(" .print-text-center {text-align: center;} ");
  mywindow.document.write(" .print-text-left {text-align: left;} ");
  mywindow.document.write(" .print-text-right {text-align: right;} ");
  mywindow.document.write(" .print-width-50-left {width: 48%; float: left;} ");
  mywindow.document.write(
    " .print-width-50-right {width: 48%; float: right;} ",
  );
  mywindow.document.write(" .print-border {border: gray solid 0.03em;} ");
  mywindow.document.write(" .print-pl-2 {padding-left: 10px;} ");
  mywindow.document.write(
    " .print-table-border > table, th, td {border: gray solid 0.03em; border-collapse: collapse;} ",
  );
  mywindow.document.write(
    " .print-border {border: gray solid 0.03em; border-collapse: collapse;} ",
  );
  mywindow.document.write(" .print-no-border {border: none;} ");
  mywindow.document.write(
    " .tr-bg {background-color: #eeece1 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ",
  );
  mywindow.document.write(" .custom-line-height tr { line-height: 25px; } ");
  mywindow.document.write(
    " .project_name {background-color: #0C5395 !important; color: white; font-weight: bold; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ",
  );

  mywindow.document.write("</style></head><body >");
  mywindow.document.write(
    document.getElementById("provisionalInvoice").innerHTML,
  );
  mywindow.document.write("</body></html>");

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  setTimeout(function () {
    mywindow.print();
    mywindow.close();
  }, 1000);

  // mywindow.print();
  // mywindow.close();

  return true;
};

/**
 * Back to list
 */
const back = () => {
  // Go to list
  console.log("userRole: " + userRole.value);
  if (userRole.value == "staff") {
    router.push("/quotation-staff");
  } else {
    router.push("/quotation-all");
  }
};

/**
 * Only input integer
 */
const integerOnly = (item) => {
  let valueInput = item.value;
  let result = commonFunc.intergerOnly(valueInput);
  item.value = result;
};

const changeCurrencyField = (key) => {
  if (trade.shipping_fee) {
    trade.shipping_fee = commonFunc.intergerOnly(trade.shipping_fee);
    trade.shipping_fee = parseInt(trade.shipping_fee);
    trade.shipping_fee = currencyFormat(trade.shipping_fee + "");
  } else {
    trade.shipping_fee = 0;
  }
};

const calculateCurrentProduct = (key) => {
  let price_list = parseInt(
    (currentProduct.price_list + "").replaceAll(",", ""),
  );
  let discount = (currentProduct.discount + "").replaceAll(",", "");
  let price_buy = (currentProduct.price + "").replaceAll(",", "");
  let discount_sale = (currentProduct.discount_sale + "").replaceAll(",", "");
  let discount_original_price = (
    currentProduct.discount_original_price + ""
  ).replaceAll(",", "");
  let profit_on_item = (currentProduct.profit_on_item + "").replaceAll(",", "");
  if (profit_on_item == "null" || profit_on_item == "") {
    profit_on_item = 0;
  }
  let price_sell = (currentProduct.price_sell + "").replaceAll(",", "");
  let quantity = (currentProduct.quantity + "").replaceAll(",", "");
  if (quantity == "null") {
    quantity = "";
  }

  if (!price_list) {
    discount = 0;
  }
  if (discount_sale == "" || discount_sale == "null") {
    discount_sale = 0;
  }
  if (discount_original_price == "" || discount_original_price == "null") {
    discount_original_price = 0;
  }
  let discount_temp = discount_sale;
  if (discount_temp == 0) {
    discount_temp = discount_original_price;
  }
  if (key == "price_list" || key == "discount") {
    if (price_list && discount) {
      discount = Math.round(discount * 100) / 100;
      price_buy = Math.round((price_list * (100 - discount)) / 100);
      currentProduct.price = currencyFormat(price_buy);

      discount_temp = Math.round(discount_temp * 100) / 100;
      profit_on_item = Math.round((price_list * discount_temp) / 100);
      currentProduct.profit_on_item = currencyFormat(profit_on_item);

      price_sell = profit_on_item + parseInt(price_buy);
      currentProduct.price_sell = currencyFormat(price_sell);

      if (price_buy && price_sell && quantity) {
        currentProduct.amount_sell = currencyFormat(
          Math.round(price_sell * quantity),
        );
        currentProduct.profit = currencyFormat(
          Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
        );
      }
    }
    currentProduct.price_list = currencyFormat(price_list);
  }

  if (key == "price") {
    if (!price_list) {
      currentProduct.price_list = currencyFormat(price_buy);
      currentProduct.discount = 0;
    } else {
      if (currentProduct.discount == 0) {
        currentProduct.price_list = currencyFormat(price_buy);
      } else {
        currentProduct.discount =
          Math.round(((price_list - price_buy) / price_list) * 100 * 100) / 100;
      }
    }
    currentProduct.price = currencyFormat(price_buy);

    if (profit_on_item != "" && profit_on_item != "null") {
      price_sell = parseInt(profit_on_item) + parseInt(price_buy);
      currentProduct.price_sell = currencyFormat(price_sell);
    }

    if (price_buy && price_sell && quantity) {
      currentProduct.amount_sell = currencyFormat(
        Math.round(price_sell * quantity),
      );
      currentProduct.profit = currencyFormat(
        Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
      );
    }
  }

  if (key == "discount_sale") {
    if (price_buy) {
      discount_temp = Math.round(discount_temp * 100) / 100;
      profit_on_item = Math.round((price_list * discount_temp) / 100);
      currentProduct.profit_on_item = currencyFormat(profit_on_item);
      currentProduct.price_sell = currencyFormat(
        profit_on_item + parseInt(price_buy),
      );

      if (quantity && quantity != "null") {
        currentProduct.amount_sell = currencyFormat(
          Math.round(profit_on_item + parseInt(price_buy) * quantity),
        );
        currentProduct.profit = currencyFormat(
          Math.round(profit_on_item * quantity),
        );
      }
    }
    if (discount_sale) {
      currentProduct.discount_original_price = 0;
    }
  }

  if (key == "discount_original_price") {
    if (price_buy) {
      discount_temp = Math.round(discount_temp * 100) / 100;
      profit_on_item = Math.round((price_buy * discount_temp) / 100);
      currentProduct.profit_on_item = currencyFormat(profit_on_item);

      currentProduct.price_sell = currencyFormat(
        profit_on_item + parseInt(price_buy),
      );

      if (quantity && quantity != "null") {
        currentProduct.amount_sell = currencyFormat(
          Math.round(profit_on_item + parseInt(price_buy) * quantity),
        );
        currentProduct.profit = currencyFormat(
          Math.round(profit_on_item * quantity),
        );
      }
    }
    if (discount_original_price) {
      currentProduct.discount_sale = 0;
    }
  }

  if (key == "profit_on_item") {
    if (price_list) {
      let discount_sale_temp =
        Math.round((profit_on_item / price_list) * 100 * 100) / 100;
      currentProduct.discount_sale = discount_sale_temp;
      currentProduct.profit_on_item = currencyFormat(profit_on_item);
      currentProduct.price_sell = currencyFormat(
        parseInt(profit_on_item) + parseInt(price_buy),
      );
    } else {
      if (price_buy) {
        let discount_sale_temp =
          Math.round((profit_on_item / price_buy) * 100 * 100) / 100;
        currentProduct.discount_original_price = discount_sale_temp;
        currentProduct.discount_sale = 0;
        currentProduct.profit_on_item = currencyFormat(profit_on_item);
        currentProduct.price_sell = currencyFormat(
          parseInt(profit_on_item) + parseInt(price_buy),
        );
      }
    }
  }

  if (key == "price_sell") {
    currentProduct.price_sell = currencyFormat(price_sell);

    if (price_sell && quantity) {
      currentProduct.amount_sell = currencyFormat(
        Math.round(price_sell * quantity),
      );
    }

    if (price_buy && price_sell && quantity) {
      currentProduct.profit = currencyFormat(
        Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
      );
    }
  }

  if (key == "quantity") {
    // Calculate profit
    if (price_buy && price_sell && quantity) {
      currentProduct.amount_sell = currencyFormat(
        Math.round(price_sell * quantity),
      );
      currentProduct.profit = currencyFormat(
        Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
      );
    }
  }
};

const changeProductNote = (index) => {
  let note = document.getElementById("note_" + index).value;
  if (note == "null" || note == "Nan") {
    note = "";
  }
  trade.products[index].note = note;
};

const changeProjectProductNote = (
  index,
  project_index = 0,
  product_index = 0,
) => {
  let index_item_str = "project_" + index;

  let note = document.getElementById("note_" + index_item_str).value;
  if (note == "null" || note == "Nan") {
    note = "";
  }
  trade.products[product_index - 1].note = note;
  handleListProduct();
};

const changeProjectQuantity = (item_index) => {
  let project_name = document.getElementById(
    "project_name_" + item_index,
  ).value;
  let project_quantity = document.getElementById(
    "project_quantity_" + item_index,
  ).value;
  if (!project_quantity || project_quantity == 0) {
    popToast("danger", "Số lượng dự án không thể bằng 0 hoặc để trống");
    return;
  }
  project_quantity = parseFloat((project_quantity + "").replaceAll(",", ""));

  for (let product of trade.products) {
    if (product["project_name"] == project_name) {
      let project_quantity_old = parseFloat(
        (product["project_quantity"] + "").replaceAll(",", ""),
      );
      product["project_quantity"] = project_quantity;
      let product_quantity =
        (parseFloat(product["quantity"]) * project_quantity) /
        project_quantity_old;
      product["quantity"] = product_quantity;
      let price_sell = parseInt(
        (product["price_sell"] + "").replaceAll(",", ""),
      );
      let price_buy = parseInt((product["price"] + "").replaceAll(",", ""));
      if (!price_buy) {
        price_buy = 0;
      }
      product["amount_sell"] = price_sell * product_quantity;
      product["profit"] = Math.round(
        (parseInt(price_sell) - parseInt(price_buy)) * product_quantity,
      );
    }
  }
  // Tính toán amount
  calculateAmount();

  handleProductExcel();

  // Lưu nháp
  if (trade.id) {
    updateDraft();
  } else {
    saveDraft();
  }
  handleListProduct();
};

const changeProjectName = (item_index, project_index = 0) => {
  let index = 0;
  if (item_index > 0) {
    index = item_index - parseInt(project_index) + 1;
  }
  let old_project_name = trade.products[index].project_name;
  let new_project_name = document.getElementById(
    "project_name_" + item_index,
  ).value;

  for (let product of trade.products) {
    if (product["project_name"] == old_project_name) {
      product["project_name"] = new_project_name;
    }
  }
  updateDraft();
  handleListProduct();
};

const changeProductItem = (
  key,
  index_item,
  project_index = 0,
  product_index = 0,
) => {
  console.log("changeProductItem index_item: " + index_item);
  let index_item_str = index_item;
  if (project_index) {
    index_item_str = "project_" + index_item;
  }

  let price_list = document.getElementById(
    "price_list_" + index_item_str,
  ).value;
  if (price_list && price_list != "null") {
    price_list = parseInt((price_list + "").replaceAll(",", ""));
  } else {
    price_list = 0;
  }

  let discount = document.getElementById("discount_" + index_item_str).value;
  if (discount && discount != "null") {
    discount = (discount + "").replaceAll(",", "");
  } else {
    discount = 0;
  }

  let price_buy = document.getElementById("price_" + index_item_str).value;
  if (price_buy && price_buy != "null") {
    price_buy = parseInt((price_buy + "").replaceAll(",", ""));
  } else {
    price_buy = 0;
  }

  let discount_sale = document.getElementById(
    "discount_sale_" + index_item_str,
  ).value;
  if (discount_sale && discount_sale != "null") {
    discount_sale = (discount_sale + "").replaceAll(",", "");
  } else {
    discount_sale = 0;
  }

  let discount_original_price = document.getElementById(
    "discount_original_price_" + index_item_str,
  ).value;
  if (discount_original_price && discount_original_price != "null") {
    discount_original_price = (discount_original_price + "").replaceAll(
      ",",
      "",
    );
  } else {
    discount_original_price = 0;
  }

  let profit_on_item = document.getElementById(
    "profit_on_item_" + index_item_str,
  ).value;
  if (profit_on_item && profit_on_item != "null") {
    profit_on_item = parseInt((profit_on_item + "").replaceAll(",", ""));
  } else {
    profit_on_item = 0;
  }

  let price_sell = document.getElementById(
    "price_sell_" + index_item_str,
  ).value;
  if (price_sell && price_sell != "null") {
    price_sell = parseInt((price_sell + "").replaceAll(",", ""));
  } else {
    price_sell = 0;
  }

  let quantity = document.getElementById("quantity_" + index_item_str).value;
  if (quantity && quantity != "null") {
    quantity = (quantity + "").replaceAll(",", "");
  } else {
    quantity = 0;
  }

  if (!price_list) {
    discount = 0;
  }
  let discount_temp = discount_sale;
  if (discount_temp == 0) {
    discount_temp = discount_original_price;
  }

  let index = index_item - parseInt(project_index);
  if (project_index) {
    index = parseInt(product_index) - 1;
  }
  // if(product_index) {
  //   index = product_index - 1
  // }
  console.log("changeProductItem index: " + index);

  if (key == "price_list" || key == "discount") {
    if (price_list && discount) {
      discount = Math.round(discount * 100) / 100;
      price_buy = Math.round((price_list * (100 - discount)) / 100);
      trade.products[index].price = currencyFormat(price_buy);

      discount_temp = Math.round(discount_temp * 100) / 100;
      profit_on_item = Math.round((price_list * discount_temp) / 100);
      trade.products[index].profit_on_item = currencyFormat(profit_on_item);

      price_sell = profit_on_item + parseInt(price_buy);
      trade.products[index].price_sell = currencyFormat(price_sell);

      trade.products[index].amount_sell = currencyFormat(
        Math.round(price_sell * quantity),
      );
      trade.products[index].profit = currencyFormat(
        Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
      );
    }
    trade.products[index].price_list = currencyFormat(price_list);
    trade.products[index].discount = discount;
  }

  if (key == "price") {
    if (!price_list) {
      trade.products[index].price_list = currencyFormat(price_buy);
      trade.products[index].discount = 0;
    } else {
      if (discount == 0) {
        trade.products[index].price_list = currencyFormat(price_buy);
      } else {
        trade.products[index].discount =
          Math.round(((price_list - price_buy) / price_list) * 100 * 100) / 100;
      }
    }
    trade.products[index].price = currencyFormat(price_buy);

    price_sell = profit_on_item + parseInt(price_buy);
    trade.products[index].price_sell = currencyFormat(price_sell);

    trade.products[index].amount_sell = currencyFormat(
      Math.round(price_sell * quantity),
    );
    trade.products[index].profit = currencyFormat(
      Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
    );
  }

  if (key == "discount_sale") {
    if (price_buy) {
      discount_temp = document.getElementById(
        "discount_sale_" + index_item_str,
      ).value;
      discount_temp = (discount_temp + "").replaceAll(",", "");
      profit_on_item = Math.round((price_list * discount_temp) / 100);
      trade.products[index].profit_on_item = currencyFormat(profit_on_item);
      price_sell = profit_on_item + parseInt(price_buy);
      trade.products[index].price_sell = currencyFormat(price_sell);

      trade.products[index].amount_sell = currencyFormat(
        Math.round(price_sell * quantity),
      );
      trade.products[index].profit = currencyFormat(
        Math.round(profit_on_item * quantity),
      );
    }
    if (discount_sale) {
      trade.products[index].discount_original_price = 0;
      trade.products[index].discount_sale = discount_sale;
    }
  }

  if (key == "discount_original_price") {
    if (price_buy) {
      discount_temp = document.getElementById(
        "discount_original_price_" + index_item_str,
      ).value;
      discount_temp = (discount_temp + "").replaceAll(",", "");
      discount_temp = Math.round(discount_temp * 100) / 100;
      profit_on_item = Math.round((price_buy * discount_temp) / 100);
      trade.products[index].profit_on_item = currencyFormat(profit_on_item);
      price_sell = profit_on_item + parseInt(price_buy);
      trade.products[index].price_sell = currencyFormat(price_sell);

      trade.products[index].amount_sell = currencyFormat(
        Math.round(price_sell * quantity),
      );
      trade.products[index].profit = currencyFormat(
        Math.round(profit_on_item * quantity),
      );
    }
    if (discount_original_price) {
      trade.products[index].discount_sale = 0;
      trade.products[index].discount_original_price = discount_original_price;
    }
  }

  if (key == "profit_on_item") {
    if (price_list) {
      let discount_sale_temp =
        Math.round((profit_on_item / price_list) * 100 * 100) / 100;
      trade.products[index].discount_sale = discount_sale_temp;
      trade.products[index].discount_original_price = 0;
      trade.products[index].profit_on_item = currencyFormat(profit_on_item);
      price_sell = parseInt(profit_on_item) + parseInt(price_buy);
      trade.products[index].price_sell = currencyFormat(price_sell);

      trade.products[index].amount_sell = currencyFormat(
        Math.round(price_sell * quantity),
      );
      trade.products[index].profit = currencyFormat(
        Math.round(profit_on_item * quantity),
      );
    } else {
      if (price_buy) {
        let discount_sale_temp =
          Math.round((profit_on_item / price_buy) * 100 * 100) / 100;
        trade.products[index].discount_original_price = discount_sale_temp;
        trade.products[index].discount_sale = 0;
        trade.products[index].profit_on_item = currencyFormat(profit_on_item);
        price_sell = parseInt(profit_on_item) + parseInt(price_buy);
        trade.products[index].price_sell = currencyFormat(price_sell);

        trade.products[index].amount_sell = currencyFormat(
          Math.round(price_sell * quantity),
        );
        trade.products[index].profit = currencyFormat(
          Math.round(profit_on_item * quantity),
        );
      }
    }
  }

  if (key == "price_sell") {
    trade.products[index].price_sell = currencyFormat(price_sell);
    trade.products[index].amount_sell = currencyFormat(
      Math.round(price_sell * quantity),
    );
    trade.products[index].profit = currencyFormat(
      Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
    );
  }

  if (key == "quantity") {
    // Calculate profit
    // if (price_sell) {
    trade.products[index].amount_sell = currencyFormat(
      Math.round(price_sell * quantity),
    );
    // }
    // if (price_buy && price_sell) {
    trade.products[index].profit = currencyFormat(
      Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
    );

    // }
    trade.products[index].quantity = currencyFormat(quantity);
  }

  // fortmatProductItem(index)

  // Tính toán amount
  calculateAmount();

  handleProductExcel();

  // Lưu nháp
  if (trade.id) {
    updateDraft();
  } else {
    saveDraft();
  }

  // Nếu là dự án, cần handle lại list sản phẩm
  if (project_index) {
    handleListProduct();
  }
};

// fortmatProductItem(index) {
//   let item = trade.products[index]
//
//   let price_list = currencyFormat(item.price_list)
//   trade.products[index].price_list = currencyFormat(price_list)
//   document.getElementById("price_list_" + index).value = price_list
//
//     let price = currencyFormat(item.price)
//   trade.products[index].price = price
//   document.getElementById("price_" + index).value = price
//
// },

const changeBankAccount = () => {
  if (trade.bank_account_id) {
    for (let i in bankAccountOptionStore) {
      if (bankAccountOptionStore[i].id == trade.bank_account_id) {
        bankAccountSelected.account_name =
          bankAccountOptionStore[i].account_name;
        bankAccountSelected.account_number =
          bankAccountOptionStore[i].account_number;
        bankAccountSelected.bank_name = bankAccountOptionStore[i].bank_name;
      }
    }
  } else {
    bankAccountSelected.account_name = "";
    bankAccountSelected.account_number = "";
    bankAccountSelected.bank_name = "";
  }
};

// changePriceSell() {
//   let price_sell = currentProduct.price_sell.replaceAll(",", "")
//     currentProduct.price_sell = currencyFormat(price_sell)
//
//     // Calculate profit margin
//     let price_buy = currentProduct.price.replaceAll(",", "")
//
//     if (price_buy && price_sell) {
//         let margin = parseInt(price_sell) - parseInt(price_buy)
//         currentProduct.profit_margin = Math.round(((margin / price_buy) * 100) * 100) / 100
//     }
//
//
// },
//
// changeQuantity() {
//   let quantity = currentProduct.quantity.replaceAll(",", "")
//   currentProduct.quantity = currencyFormat(quantity)
//
//     // Calculate profit
//     let price_sell = currentProduct.price_sell.replaceAll(",", "")
//     let price_buy = currentProduct.price.replaceAll(",", "")
//     if (price_buy && price_sell && quantity) {
//         currentProduct.profit = currencyFormat(parseInt((parseInt(price_sell) - parseInt(price_buy)) * quantity))
//     }
//
// },

// editProduct(index) {
//   currentProduct = trade.products[index]
//   if(currentProduct.product_group_id) {
//     productGroupSelect = getProductGroupItemById(currentProduct.product_group_id)
//   } else {
//     productGroupSelect = {}
//   }
//   if(currentProduct.product_type_id) {
//     productTypeSelect = getProductTypeItemById(currentProduct.product_type_id)
//   } else {
//     productTypeSelect = {}
//   }
//   if(currentProduct.product_id) {
//     productSelect.value = getProductItemById(currentProduct.product_id)
//   } else {
//     productSelect.value = {}
//   }
//   currentProduct.index = index
//   currentProduct.price_list = currencyFormat(currentProduct.price_list)
//   currentProduct.price = currencyFormat(currentProduct.price)
//   currentProduct.profit_on_item = currencyFormat(currentProduct.profit_on_item)
//   currentProduct.quantity = currencyFormat(currentProduct.quantity)
//   currentProduct.amount = currencyFormat(currentProduct.amount)
//   currentProduct.price_sell = currencyFormat(currentProduct.price_sell)
//   currentProduct.profit = currencyFormat(currentProduct.profit)
//   currentProduct.amount_sell = currencyFormat(currentProduct.amount_sell)
// },

const deleteProductByProjectName = (project_name) => {
  let products = [];
  for (let product of trade.products) {
    if (product.project_name != project_name) {
      products.push(product);
    }
  }
  trade.products = products;
};

const editProject = (project_name) => {
  currentProduct.project_type = "0";
  currentProduct.project_name = project_name;
  // location.href = "#";
  location.href = "#productInfoArea";
};

const deleteProduct = (ind, product_id, quantity, properties) => {
  trade.products.splice(parseInt(ind), 1); // Xoá sp

  // Check remove all product
  if (trade.products.length == 0) {
    deleteTrade(trade.id);

    // Refresh data
    refreshTradeInfo();
  }

  // Reset index
  let index = 1;
  let products = JSON.parse(JSON.stringify(trade.products));
  trade.products = [];
  for (let product of products) {
    product.index = index;
    trade.products.push(product);
    index += 1;
  }

  // Calculate
  calculateAmount();

  // Update
  // checkUpdateDraft()
  updateDraft();

  // Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
  updateQuantityRepo(product_id, quantity, properties, "delete");

  handleProductExcel();
};

const deleteProductOfProject = (
  ind,
  product_type,
  project_name,
  product_id,
  quantity,
  properties,
) => {
  // Remove item
  if (product_type == 0) {
    deleteProductByProjectName(project_name);
  } else {
    trade.products.splice(parseInt(ind) - 1, 1); // Xoá sp
  }

  // Check remove all product
  if (trade.products.length == 0) {
    deleteTrade(trade.id);

    // Refresh data
    refreshTradeInfo();
  }

  // Reset index
  let index = 1;
  let products = JSON.parse(JSON.stringify(trade.products));
  trade.products = [];
  for (let product of products) {
    product.index = index;
    trade.products.push(product);
    index += 1;
  }

  if (trade.type == 1) {
    handleListProduct();
  }

  // Calculate
  calculateAmount();

  // Update
  // checkUpdateDraft()
  updateDraft();

  // Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
  updateQuantityRepo(product_id, quantity, properties, "delete");

  handleProductExcel();
};

const upProductIndex = (index, is_project = false) => {
  if (index > 1) {
    trade.products[index - 1].index = trade.products[index - 1].index - 1;
    trade.products[index - 2].index = trade.products[index - 1].index + 1;

    trade.products.sort(function (a, b) {
      return a.index - b.index;
    });
  }
  if (is_project) {
    handleListProduct();
  }
};

const deleteTrade = (trade_id) => {
  quotationApi
    .deleteQuotation(trade_id, "admin")
    .then((res) => {})
    .catch((err) => {});
};

const printInvoice = () => {
  printProvisionalInvoice();
};

/**
 * Xuất file excel
 */
const exportExcel = (type = "excel") => {
  exportingExcel.value = true;
  quotationApi
    .exportExcel({ id: trade.id, type: type })
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        let data = res.data.data;
        commonFunc.downloadFile(
          RootAPI.replace("api/", "") + data.file_path,
          data.file_name,
        );
      }

      exportingExcel.value = false;
    })
    .catch((err) => {
      exportingExcel.value = false;

      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);
    });
};

// /**
//  * Only input integer and point
//  */
// integerAndCommaOnly(item) {
//   let valueInput = item.value
//   let result = commonFunc.integerAndCommaOnly(valueInput)
//
//   result = currencyFormat((result + "").replace(",",""))
//   item.value = result
// },

/**
 * Only input integer and point
 */
const integerPointAndCommaOnly = (item) => {
  console.log("integerPointAndCommaOnly");
  console.log("1");
  console.log(item);
  let valueInput = item.value;
  console.log("2");
  console.log(valueInput);
  valueInput = valueInput.replaceAll(",", "").replaceAll(".", "");
  console.log("3");
  console.log(valueInput);
  let result = commonFunc.integerPointAndCommaOnly(valueInput);
  console.log("4");
  console.log(result);

  result = currencyFormat(result);
  console.log("5");
  console.log(result);
  item.value = result;
};

/**
 * Currency format
 */
const currencyFormat = (num) => {
  let result = "";
  if (num === 0) {
    return "0";
  }
  if (num) {
    num = (num + "").replaceAll(",", "");
  }

  if (num) {
    result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return result;
};

const convertNumberToText = (number) => {
  let input = (number + "").replaceAll(",", "");
  return commonFunc.convert_number_to_text(input);
};

/**
 * Only input float
 */
const integerAndPointOnly = (item) => {
  let valueInput = item.value;
  let result = commonFunc.integerAndPointOnly(valueInput);
  item.value = result;
};

/**
 * Check phone number
 */
const checkPhoneNumberFormat = (item) => {
  let valueInput = item;
  if (valueInput != null && valueInput != "") {
    if (!commonFunc.phoneNumberCheck(valueInput)) {
      return false;
    }
  }
  return true;
};

const openModalChooseFilePrint = () => {
  showModalProduct.value = true;
};

const hideModalChooseFilePrint = () => {
  showModalProduct.value = false;
};

const openModalChooseMultipleUnit = () => {
  showModalChooseMultipleUnit.value = true;
};

const hideModalChooseMultipleUnit = () => {
  showModalChooseMultipleUnit.value = false;
};

const chooseUnit = () => {
  // Nếu chọn phải đơn vị gốc thì show cảnh báo
  if (current_unit.value == multipleUnitsOption.value[0].value) {
    popToast("danger", "Vui lòng chọn đơn vị chuyển đổi khác đơn vị gốc!");
    return;
  }
  for (let item of multipleUnitsOptionStore.value) {
    if (
      item.target_unit_id == current_unit.value &&
      currentProduct.product_id == item.product_id
    ) {
      currentProduct.target_unit_id = item.target_unit_id;
      currentProduct.target_unit_name = item.target_unit_name;
      currentProduct.conversion_value = item.conversion_value;
      if (item.price) {
        currentProduct.price_sell = currencyFormat(item.price);
      }
      hideModalChooseMultipleUnit();
      break;
    }
  }
};

const editPaymentMethod = (index) => {
  paymentMethod = itemsPaymentMethod[index];
  btn_payment_method_text.value = "Cập nhật";
};

const handleListOptionPaymentMethod = (items) => {
  optionsPaymentMethod.value = [{ value: null, text: "Khác" }];
  for (let item of items) {
    optionsPaymentMethod.push({
      value: item.payment_method,
      text: item.payment_method,
    });
  }
};

const getListPaymentMethod = () => {
  loadingPaymentMethod.value = true;
  paymentMethodApi
    .getListPaymentMethod()
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        let data = res.data.data;
        itemsPaymentMethod.value = data;
      }
      loadingPaymentMethod.value = false;
    })
    .catch((err) => {
      loadingPaymentMethod.value = false;

      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);
    });
};

const deletedPaymentMethod = (id, name) => {
  if (id && name) {
    confirm("Xóa [" + name + "]. Bạn có chắc không?", {
      title: false,
      buttonSize: "sm",
      centered: true,
      size: "sm",
      footerClass: "p-2",
    }).then((res) => {
      if (res) {
        paymentMethodApi
          .deletePaymentMethod(id)
          .then((res) => {
            if (res != null && res.data != null && res.data.data != null) {
              let data = res.data.data;
              itemsPaymentMethod.value = data;
              handleListOptionPaymentMethod(data);
              popToast("success", "Xoá thành công!");
            }
          })
          .catch((err) => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err);
            popToast("danger", errorMess);
          });
      }
    });
  }
};

const cleanPaymentMethod = () => {
  paymentMethod.id = null;
  paymentMethod.payment_method = null;
  paymentMethod.debt_date_number = 0;
  paymentMethod.index = null;
  btn_payment_method_text.value = "Thêm mới";
};

const addUpdatePaymentMethod = () => {
  if (!paymentMethod.payment_method) {
    popToast("danger", "Vui lòng nhập [Hình thức thanh toán]");
    return;
  }
  paymentMethod.payment_method = paymentMethod.payment_method.trim();
  if (!paymentMethod.debt_date_number) {
    paymentMethod.debt_date_number = 0;
  }

  savingPaymentMethod.value = true;

  let id = paymentMethod.id;
  if (id) {
    // Edit
    paymentMethodApi
      .editPaymentMethod(paymentMethod)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let data = res.data.data;
          itemsPaymentMethod.value = data;
          handleListOptionPaymentMethod(data);
          popToast("success", "Cập nhật thành công!");

          cleanPaymentMethod();
        }
        savingPaymentMethod.value = false;
      })
      .catch((err) => {
        savingPaymentMethod.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  } else {
    // Add
    paymentMethodApi
      .addPaymentMethod(paymentMethod)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let data = res.data.data;
          itemsPaymentMethod.value = data;
          handleListOptionPaymentMethod(data);
          popToast("success", "Thêm mới thành công!");

          cleanPaymentMethod();
        }
        savingPaymentMethod.value = false;
      })
      .catch((err) => {
        savingPaymentMethod.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  }
};

const cleanShippingAgreement = () => {
  shippingAgreement.id = null;
  shippingAgreement.shipping_agreement = null;
  shippingAgreement.index = null;
  btn_shipping_agreement_text.value = "Thêm mới";
};

const editShippingAgreement = (index) => {
  shippingAgreement = itemsShippingAgreement[index];
  btn_shipping_agreement_text.value = "Cập nhật";
};

const handleUnitName = () => {
  if (currentProduct.target_unit_name) {
    return "(ĐV: " + currentProduct.target_unit_name + ")";
  }
  if (currentProduct.unit_name) {
    return "(ĐV: " + currentProduct.unit_name + ")";
  }
  if (currentProduct.unit_name_input) {
    return "(ĐV: " + currentProduct.unit_name_input + ")";
  }
  return "";
};

const handleListOptionShippingAgreement = (items) => {
  optionsShippingAgreement.value = [{ value: null, text: "" }];
  for (let item of items) {
    optionsShippingAgreement.push({
      value: item.shipping_agreement,
      text: item.shipping_agreement,
    });
  }
};

const getListShippingAgreement = () => {
  loadingShippingAgreement.value = true;
  shippingAgreementApi
    .getListShippingAgreement()
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        let data = res.data.data;
        itemsShippingAgreement.value = data;
      }
      loadingShippingAgreement.value = false;
    })
    .catch((err) => {
      loadingShippingAgreement.value = false;

      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);
    });
};

const deletedShippingAgreement = (id, name) => {
  if (id && name) {
    confirm("Xóa [" + name + "]. Bạn có chắc không?", {
      title: false,
      buttonSize: "sm",
      centered: true,
      size: "sm",
      footerClass: "p-2",
    }).then((res) => {
      if (res) {
        shippingAgreementApi
          .deleteShippingAgreement(id)
          .then((res) => {
            if (res != null && res.data != null && res.data.data != null) {
              let data = res.data.data;
              itemsShippingAgreement.value = data;
              handleListOptionShippingAgreement(data);
              popToast("success", "Xoá thành công!");
            }
          })
          .catch((err) => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err);
            popToast("danger", errorMess);
          });
      }
    });
  }
};

const addUpdateShippingAgreement = () => {
  if (!shippingAgreement.shipping_agreement) {
    popToast("danger", "Vui lòng nhập [Thỏa thuận vận chuyển]");
    return;
  }
  shippingAgreement.shipping_agreement =
    shippingAgreement.shipping_agreement.trim();

  savingShippingAgreement.value = true;

  let id = shippingAgreement.id;
  if (id) {
    // Edit
    shippingAgreementApi
      .editShippingAgreement(shippingAgreement)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let data = res.data.data;
          itemsShippingAgreement.value = data;
          handleListOptionShippingAgreement(data);
          popToast("success", "Cập nhật thành công!");

          cleanShippingAgreement();
        }
        savingShippingAgreement.value = false;
      })
      .catch((err) => {
        savingShippingAgreement.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  } else {
    // Add
    shippingAgreementApi
      .addShippingAgreement(shippingAgreement)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let data = res.data.data;
          itemsShippingAgreement.value = data;
          handleListOptionShippingAgreement(data);
          popToast("success", "Thêm mới thành công!");

          cleanShippingAgreement();
        }
        savingShippingAgreement.value = false;
      })
      .catch((err) => {
        savingShippingAgreement.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  }
};
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
  background-color: #6a9ab0 !important;
}
</style>
