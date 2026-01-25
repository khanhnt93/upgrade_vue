<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white shadow rounded-lg">
          <div class="p-6">
            <div class="grid grid-cols-1 gap-4">
              <div class="w-full">
                <button
                  class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 float-left btn-width-120"
                  @click="back"
                >
                  Quay lại
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-12">
                <h4 class="mt-1 text-center text-header">
                  {{ prefix_title }} Đơn Hàng Bán
                </h4>
              </div>
            </div>
            <hr />

            <!-- Loading -->
            <span class="loading-more" v-show="loading"
              ><i class="fa fa-spinner fa-spin fa-3x"></i
            ></span>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row mt-2">
              <div class="w-full md:col-span-2 mt-2">
                <label>
                  <span>Từ báo giá</span>
                </label>
              </div>
              <div class="w-full md:col-span-10">
                <div class="flex gap-2 items-start">
                  <div class="flex-1">
                    <multiselect
                      v-model="quotationSelect"
                      :options="quotationOptions"
                      :loading="loadingQuotation"
                      :select-label="''"
                      :deselect-label="''"
                      placeholder="--Chọn từ báo giá--"
                      label="name"
                      track-by="name"
                      @select="changeQuotation"
                    >
                    </multiselect>
                  </div>

                  <button
                    class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                    @click="showModalSearchQuotation"
                  >
                    <i class="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row mt-2">
              <div class="w-full md:col-span-2 mt-2">
                <label> Xuất hóa đơn<span class="error-sybol"></span> </label>
              </div>
              <div class="w-full md:col-span-10">
                <div class="input-group">
                  <input
                    type="radio"
                    v-model="trade.issue_invoice"
                    name="issue_invoice"
                    :value="'true'"
                    class="mt-2"
                    id="issue_invoice_true"
                  />
                  <label class="ml-4 mt-1" for="issue_invoice_true">Có</label>
                  <input
                    type="radio"
                    v-model="trade.issue_invoice"
                    name="issue_invoice"
                    :value="'false'"
                    class="ml-5 mt-2"
                    id="issue_invoice_false"
                  />
                  <label class="ml-4 mt-1" for="issue_invoice_false"
                    >Không</label
                  >
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div
                class="w-full md:col-span-12 bg-gray-600 text-white title-partner"
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
                <div
                  class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row mt-2"
                >
                  <div class="w-full md:col-span-2 mt-2">
                    <label>
                      <span>Khách hàng</span>
                    </label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <div class="flex gap-2 items-start">
                      <div class="flex-1">
                        <multiselect
                          v-model="customerSelect"
                          :options="customerOptionStore"
                          :loading="loadingCustomerOptions"
                          :select-label="''"
                          :deselect-label="''"
                          placeholder="--Chọn khách hàng--"
                          label="name"
                          track-by="name"
                          @select="changeCustomer"
                        >
                        </multiselect>
                      </div>

                      <button
                        class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                        @click="showModalSearchCustomer"
                      >
                        <i class="fa fa-search"></i>
                      </button>

                      <button
                        class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
                        @click="showModalAddCustomer"
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
                  <div class="form-row">
                    <label
                      >Tên khách hàng<span class="error-sybol"></span
                    ></label>
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
                  <div class="form-row">
                    <label
                      >Mã số thuế<span
                        class="error-sybol"
                        v-show="trade.issue_invoice == 'true'"
                      ></span
                    ></label>
                    <input
                      id="customer_tax_code"
                      type="text"
                      class="form-control"
                      v-model="trade.customer_tax_code"
                      @keyup="integerOnly($event.target)"
                      autocomplete="new-password"
                      maxlength="20"
                    />
                  </div>
                  <div class="form-row">
                    <label
                      >Địa chỉ khách hàng<span
                        class="error-sybol"
                        v-show="trade.issue_invoice == 'true'"
                      ></span
                    ></label>
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
                  <div class="form-row">
                    <label
                      >Email nhận hoá đơn<span
                        class="error-sybol"
                        v-show="trade.issue_invoice == 'true'"
                      ></span
                    ></label>
                    <input
                      id="customer_email"
                      type="text"
                      class="form-control"
                      v-model="trade.customer_email"
                      autocomplete="new-password"
                      maxlength="255"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
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

            <div
              class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2"
              v-show="showProductInfo"
            >
              <div class="w-full md:col-span-12">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                  <div class="w-full md:col-span-2 mt-2">
                    <label>Sản phẩm<span class="error-sybol"></span> </label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <div class="flex gap-2 items-start">
                      <div class="flex-1">
                        <multiselect
                          v-model="productSelect"
                          :options="productOptions"
                          :loading="loadingProductOptions"
                          :select-label="''"
                          :deselect-label="''"
                          placeholder="-- Chọn sản phẩm --"
                          label="name_full"
                          track-by="name_full"
                          @select="changeProduct"
                        >
                        </multiselect>
                      </div>
                      <button
                        class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                        @click="showModalSearchProduct"
                      >
                        <i class="fa fa-search"></i>
                      </button>
                    </div>

                    <!-- Loading -->
                    <span class="loading-more" v-show="loadProductDetail"
                      ><i class="fa fa-spinner fa-spin fa-3x"></i
                    ></span>

                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div class="w-full md:col-span-3 mt-2">
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
                      <div class="w-full md:col-span-3 mt-2">
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
                      <div class="w-full md:col-span-3 mt-2">
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
                      <div class="w-full md:col-span-3 mt-2">
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
                  class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row"
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
                  <div class="form-row">
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
                  <div class="form-row">
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
                  <div class="form-row">
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
                  <div class="form-row">
                    <label>% Lợi nhuận mong muốn</label>
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
                  <div class="form-row">
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
                  <div class="form-row">
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
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="form-row">
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
                  <div class="form-row">
                    <label
                      >SL bán {{ handleUnitName()
                      }}<span class="error-sybol"></span
                    ></label>
                    <input
                      id="quantity"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.quantity"
                      @keyup="integerPointAndCommaOnly($event.target)"
                      @change="calculateCurrentProduct('quantity')"
                    />
                  </div>
                </div>

                <div>
                  <div class="w-full md:col-span-6">
                    <div
                      class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row"
                    >
                      <div class="w-full md:col-span-4 mt-2">
                        <label>Thành tiền</label>
                      </div>
                      <div class="w-full md:col-span-8 mt-2">
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
                  </div>
                  <div class="w-full md:col-span-6">
                    <div
                      class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row"
                    >
                      <div class="w-full md:col-span-4 mt-2">
                        <label>Lợi nhuận tổng</label>
                      </div>
                      <div class="w-full md:col-span-8 mt-2">
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
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                  <div class="w-full md:col-span-2 mt-2">
                    <label> Ghi chú </label>
                  </div>
                  <div class="w-full md:col-span-10 mt-2">
                    <textarea
                      class="form-textarea w-full px-3 py-2 border border-gray-300 rounded-md"
                      id="note"
                      style="width: 100%"
                      rows="1"
                      v-model="currentProduct.note"
                    ></textarea>
                  </div>
                </div>

                <div class="mt-2">
                  <div class="w-full md:col-span-12 text-center">
                    <button
                      class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-center btn-width-120"
                      @click="confirmBuyProduct"
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>

                <div v-show="trade.products.length > 0" class="mt-2">
                  <div class="w-full md:col-span-9">
                    <h5>Danh sách sản phẩm</h5>
                  </div>
                  <div class="w-full md:col-span-3 text-right">
                    <button
                      class="btn btn-default text-header"
                      @click="
                        exportToExcel(
                          products_excel,
                          excel_fields,
                          'danh_sach_san_pham_trong_don_hang.xls',
                        )
                      "
                    >
                      <b>Xuất Excel</b>
                    </button>
                  </div>
                </div>

                <!-- Báo giá thường thì dùng danh sách này-->
                <div
                  class="mt-2"
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
                            <th class="text-center font-weight-bold">Tên SP</th>
                            <th class="text-center font-weight-bold">
                              Hãng SP
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá List
                            </th>
                            <th class="text-center font-weight-bold">
                              CK từ NCC
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá gốc
                            </th>
                            <th class="text-center font-weight-bold">
                              % lợi nhuận mong muốn
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
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in trade.products">
                            <td>{{ index + 1 }}</td>
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
                            </td>
                            <td>
                              {{
                                item.brand_name
                                  ? item.brand_name
                                  : item.brand_name_input
                              }}
                            </td>
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
                                @change="changeProductItem('price_list', index)"
                              />
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
                                @change="changeProductItem('discount', index)"
                              />
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
                                @change="changeProductItem('price', index)"
                              />
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
                                @change="
                                  changeProductItem('discount_sale', index)
                                "
                              />
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
                                @change="
                                  changeProductItem('profit_on_item', index)
                                "
                              />
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
                                @change="changeProductItem('price_sell', index)"
                              />
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
                                @change="changeProductItem('quantity', index)"
                              />
                            </td>
                            <td class="text-right">
                              {{ currencyFormat(item.amount_sell) }}
                            </td>
                            <td class="text-right">
                              {{ currencyFormat(item.profit) }}
                            </td>
                            <td class="text-right">{{ item.note }}</td>
                            <td>
                              <!--                        <i class="fa fa-edit" @click="editProduct(index)" />-->
                              <i
                                class="fa fa-trash ml-2"
                                @click="
                                  deleteProduct(
                                    index,
                                    1,
                                    '',
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
                  class="mt-2"
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
                            <th class="text-center font-weight-bold">Tên SP</th>
                            <th class="text-center font-weight-bold">
                              Hãng SP
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá List
                            </th>
                            <th class="text-center font-weight-bold">
                              CK từ NCC
                            </th>
                            <th class="text-center font-weight-bold">
                              Giá gốc
                            </th>
                            <th class="text-center font-weight-bold">
                              % lợi nhuận mong muốn
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
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in projectProducts"
                            :class="item.product_type == 0 ? 'project_bg' : ''"
                          >
                            <td>
                              {{ item.project_index }}
                            </td>
                            <td>
                              <span v-show="item.product_type == 1">{{
                                item.product_code
                                  ? item.product_code
                                  : item.product_code_input
                              }}</span>
                            </td>
                            <td>
                              <span v-show="item.product_type == 1">
                                {{
                                  item.product_name
                                    ? item.product_name
                                    : item.product_name_input
                                }}
                              </span>
                              <span v-show="item.product_type == 0">
                                <b>{{ item.product_name }}</b>
                              </span>
                            </td>
                            <td>
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
                                @keyup="integerPointAndCommaOnly($event.target)"
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
                                @keyup="integerPointAndCommaOnly($event.target)"
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
                                @keyup="integerPointAndCommaOnly($event.target)"
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
                                @keyup="integerPointAndCommaOnly($event.target)"
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
                                :id="'profit_on_item_project_' + index"
                                type="text"
                                maxlength="14"
                                autocomplete="new-password"
                                class="form-control"
                                :value="item.profit_on_item"
                                @keyup="integerPointAndCommaOnly($event.target)"
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
                                @keyup="integerPointAndCommaOnly($event.target)"
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
                              <span v-show="item.product_type == 0"
                                ><b>{{ item.project_quantity }}</b></span
                              >
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
                              {{ item.note }}
                            </td>
                            <td>
                              <i
                                class="fa fa-trash ml-2"
                                @click="
                                  deleteProduct(
                                    index,
                                    item.product_type,
                                    item.product_name,
                                    item.product_id,
                                    item.quantity,
                                    item.properties,
                                    item.project_index,
                                    item.index,
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
              </div>
            </div>

            <div class="mt-3">
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

            <div class="mt-2" v-show="showPaymentInfo">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-row">
                  <label> Tổng tiền sản phẩm </label>
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
                <div class="form-row">
                  <label> Chi phí thêm </label>
                  <input
                    id="extra_fee"
                    type="text"
                    maxlength="14"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="trade.extra_fee"
                    @change="calculateAmount"
                  />
                </div>
                <div class="form-row">
                  <label> Số tiền giảm </label>
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
                <div class="form-row">
                  <label> Thuế VAT </label>
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
                <div class="form-row">
                  <label> Thành tiền<span class="error-sybol"></span> </label>
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
                <div class="form-row">
                  <label> Lợi nhuận </label>
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
                <div class="form-row">
                  <label> Tài khoản nhận thanh toán </label>
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
                <div class="form-row">
                  <label> Hình thức thanh toán </label>
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
                  <input
                    v-show="trade.payment_method == null"
                    id="payment_method_input"
                    type="text"
                    maxlength="255"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="trade.payment_method_input"
                  />
                </div>
                <div class="form-row">
                  <label> Thỏa thuận vận chuyển </label>
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
                <div class="form-row">
                  <label> Phí giao hàng </label>
                  <input
                    id="shipping_fee"
                    type="text"
                    maxlength="14"
                    autocomplete="new-password"
                    v-model="trade.shipping_fee"
                    @change="changeCurrencyField('shipping_fee')"
                  />
                </div>
                <div class="form-row" v-if="userRole == 'admin'">
                  <label> Nhân viên phụ trách </label>
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
                <div class="form-row">
                  <label> Ghi chú </label>
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

            <div class="mt-2">
              <div
                class="w-full md:col-span-12 bg-yellow-500 text-white title-partner"
              >
                <h5>
                  <span class="float-left">Thông tin giao hàng</span>
                  <span
                    class="float-right"
                    v-show="showShippingInfo"
                    @click="showShippingInfo = !showShippingInfo"
                    ><i class="fa fa-angle-double-up"
                  /></span>
                  <span
                    class="float-right"
                    v-show="!showShippingInfo"
                    @click="showShippingInfo = !showShippingInfo"
                    ><i class="fa fa-angle-double-down"
                  /></span>
                </h5>
              </div>
            </div>

            <div v-show="showShippingInfo" class="mt-1">
              <div>
                <div>
                  <div class="w-full md:col-span-6">
                    <div
                      class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row"
                    >
                      <div class="w-full md:col-span-4 mt-2">
                        <label>
                          <span>Tên người nhận hàng</span>
                        </label>
                      </div>
                      <div class="w-full md:col-span-8">
                        <input
                          id="receiver_name"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.receiver_name"
                          :disabled="saving"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="w-full md:col-span-6">
                    <div
                      class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row"
                    >
                      <div class="w-full md:col-span-4 mt-2">
                        <label>
                          <span>SĐT nhận hàng</span>
                        </label>
                      </div>
                      <div class="w-full md:col-span-8">
                        <input
                          id="receiver_phone"
                          type="text"
                          maxlength="14"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.receiver_phone"
                          :disabled="saving"
                          @keyup="integerOnly($event.target)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="w-full md:col-span-6">
                    <div
                      class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row"
                    >
                      <div class="w-full md:col-span-4 mt-2">
                        <label>
                          <span>Địa chỉ nhận hàng</span>
                        </label>
                      </div>
                      <div class="w-full md:col-span-8">
                        <input
                          id="receiver_address"
                          type="text"
                          maxlength="100"
                          autocomplete="new-password"
                          class="form-control"
                          v-model="trade.receiver_address"
                          :disabled="saving"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="w-full md:col-span-6">
                    <div
                      class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row"
                    >
                      <div class="w-full md:col-span-4 mt-2">
                        <label>
                          <span>Ngày giao hàng dự kiến</span>
                        </label>
                      </div>
                      <div class="w-full md:col-span-8">
                        <datepicker
                          v-model="trade.shipping_date"
                          format="yyyy-MM-dd"
                          input-class="datepicker-cus"
                        ></datepicker>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                  <div class="w-full md:col-span-2 mt-2">
                    <label>
                      <span>Ghi chú khi giao hàng</span>
                    </label>
                  </div>
                  <div class="w-full md:col-span-10">
                    <textarea
                      class="form-textarea w-full px-3 py-2 border border-gray-300 rounded-md"
                      id="shipping_note"
                      style="width: 100%"
                      rows="2"
                      v-model="trade.shipping_note"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <div class="w-full md:col-span-12 text-left">
                <button
                  class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 float-left btn-width-120 mt-1"
                  @click="updateDraft"
                >
                  Lưu nháp
                </button>
                <button
                  v-show="trade.products.length > 0"
                  class="btn btn-default text-header float-right mt-1"
                  @click="
                    exportToExcel(
                      products_excel,
                      excel_fields,
                      'danh_sach_san_pham_trong_don_hang.xls',
                    )
                  "
                >
                  <b>Xuất Excel</b>
                </button>
              </div>
            </div>

            <div class="mt-2">
              <div class="w-full md:col-span-12 text-center">
                <button
                  v-show="!saving"
                  class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
                  style="height: 50px; width: 240px"
                  @click="save"
                  :disabled="saving || !trade.id"
                >
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận Đơn Hàng
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

    <!--Modal tìm kiếm báo giá -->
    <div
      v-if="showModalQuotation"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      id="modal-search-quotation"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <div>
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Tìm kiếm báo giá
            </h4>
          </div>
        </div>
        <hr />

        <div>
          <div class="w-full md:col-span-6">
            <label> Mã báo giá </label>
            <input
              id="quatationNumber"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="quotationSearch.quotation_number"
              maxlength="15"
            />
          </div>
          <div class="w-full md:col-span-6">
            <label> Tên khách hàng </label>
            <input
              id="customerName"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="quotationSearch.customer_name"
              maxlength="255"
            />
          </div>
        </div>

        <div class="mt-2">
          <div cols="12">
            <button
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 float-left btn-width-120"
              @click.prevent="showModalQuotation = false"
            >
              Quay lại
            </button>

            <button
              class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 float-right btn-width-120"
              :disabled="onSearchQuotation"
              @click.prevent="searchQuotation"
            >
              Tìm Kiếm
            </button>
          </div>
        </div>

        <div class="mt-2">
          <div>
            <table
              class="min-w-full divide-y divide-gray-200 border border-gray-300"
            >
              <thead>
                <tr>
                  <th
                    v-for="field in quotationSearchFields"
                    :key="field.key"
                    :class="field.class"
                  >
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in quotationSearchItems" :key="index">
                  <td
                    v-for="field in quotationSearchFields.filter(
                      (f) => f.key !== 'action',
                    )"
                    :key="field.key"
                  >
                    {{ item[field.key] }}
                  </td>
                  <td>
                    <button
                      class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 float-right btn-width-120"
                      @click.prevent="chooseQuotation(item.id)"
                    >
                      Chọn
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-2">
          <div>
            <p class="text-center">---Hết---</p>
          </div>
        </div>
      </div>
    </div>

    <!--Modal tìm kiếm sản phẩm -->
    <div
      v-if="showModalProduct"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      id="modal-search-product"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <div>
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Tìm kiếm sản phẩm
            </h4>
          </div>
        </div>
        <hr />

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-2 mt-2">
            <label>Hãng sản phẩm</label>
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              id="product_brand"
              autocomplete="new-password"
              v-model="productSearch.product_brand_id"
            >
              <option
                v-for="option in productBrandOptionsSearch"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="w-full md:col-span-2 mt-2">
            <label>Nhóm sản phẩm</label>
            <multiselect
              v-model="productGroupSearchSelect"
              :options="productGroupOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn nhóm sản phẩm--"
              label="text"
              track-by="text"
              @input="changeProductGroupSearch"
            >
            </multiselect>
          </div>

          <div class="w-full md:col-span-2 mt-2">
            <label>Loại sản phẩm</label>
            <multiselect
              v-model="productTypeSearchSelect"
              :options="productTypeSearchOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn loại sản phẩm--"
              label="text"
              track-by="text"
              @input="changeProductTypeSearch"
            >
            </multiselect>
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

        <div class="mt-2">
          <div cols="12">
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

        <div class="mt-2">
          <div>
            <table
              class="min-w-full divide-y divide-gray-200 border border-gray-300"
            >
              <thead>
                <tr>
                  <th
                    v-for="field in productSearchFields"
                    :key="field.key"
                    :class="field.class"
                  >
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in productSearchItems" :key="index">
                  <td
                    v-for="field in productSearchFields.filter(
                      (f) => f.key !== 'actions',
                    )"
                    :key="field.key"
                  >
                    {{ item[field.key] }}
                  </td>
                  <td>
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
      v-if="showModalSearchCustomerModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      id="modal-search-customer"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <div>
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Tìm kiếm khách hàng
            </h4>
          </div>
        </div>
        <hr />

        <div>
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

        <div class="mt-2">
          <div cols="12">
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

        <div class="mt-2">
          <div>
            <table
              class="min-w-full divide-y divide-gray-200 border border-gray-300"
            >
              <thead>
                <tr>
                  <th
                    v-for="field in customerSearchFields"
                    :key="field.key"
                    :class="field.class"
                  >
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in customerSearchItems" :key="index">
                  <td
                    v-for="field in customerSearchFields.filter(
                      (f) => f.key !== 'action',
                    )"
                    :key="field.key"
                  >
                    {{ item[field.key] }}
                  </td>
                  <td>
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
      id="modal-add-customer"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div>
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Thêm khách hàng
            </h4>
          </div>
        </div>
        <hr />

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Loại khách hàng</label>
          </div>
          <div class="w-full md:col-span-9">
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

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Tên<span class="error-sybol"></span> </label>
          </div>
          <div class="w-full md:col-span-9">
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

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Mã khách hàng<span class="error-sybol"></span> </label>
          </div>
          <div class="w-full md:col-span-9">
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

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Số Điện Thoại</label>
          </div>
          <div class="w-full md:col-span-9">
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

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Email</label>
          </div>
          <div class="w-full md:col-span-9">
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

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label
              >Mã số thuế<span
                v-show="customer.type == 1"
                class="error-sybol"
              ></span
            ></label>
          </div>
          <div class="w-full md:col-span-9">
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
          class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row"
          v-show="customer.type == 1"
        >
          <div class="w-full md:col-span-3 mt-2">
            <label>Phân loại</label>
          </div>
          <div class="w-full md:col-span-9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              v-model="customer.company_type"
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

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Giới Tính</label>
          </div>
          <div class="w-full md:col-span-9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              v-model="customer.gender"
            >
              <option
                v-for="option in optionsGender"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Ngày Tháng Năm Sinh</label>
          </div>
          <div class="w-full md:col-span-9">
            <datepicker
              v-model="customer.birthday"
              format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
              input-class="datepicker-cus"
            ></datepicker>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Tỉnh/ Thành Phố</label>
          </div>
          <div class="w-full md:col-span-9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              id="city_id"
              v-model="customer.city_id"
              v-on:change="changeCity($event.target)"
            >
              <option
                v-for="option in optionsCity"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Quận/Huyện</label>
          </div>
          <div class="w-full md:col-span-9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              id="district_id"
              v-model="customer.district_id"
              :disabled="!customer.city_id"
            >
              <option
                v-for="option in optionsDistrict"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Địa chỉ</label>
          </div>
          <div class="w-full md:col-span-9">
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

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>
              <span>Tên người liên hệ</span>
            </label>
          </div>
          <div class="w-full md:col-span-9">
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

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>
              <span>Sđt người liên hệ</span>
            </label>
          </div>
          <div class="w-full md:col-span-9">
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

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-3 mt-2">
            <label>Email người liên hệ</label>
          </div>
          <div class="w-full md:col-span-9">
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
          class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row"
          v-show="userRole == 'admin'"
        >
          <div class="w-full md:col-span-3 mt-2">
            <label>Nhân viên phụ trách</label>
          </div>
          <div class="w-full md:col-span-9">
            <select
              class="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
              id="created_by_2"
              v-model="customer.created_by"
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

        <div class="mt-2">
          <div cols="12">
            <button
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 float-left btn-width-120"
              @click="backCustomer"
            >
              Hủy bỏ
            </button>
            <button
              v-show="!savingCustomer"
              class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 float-right btn-width-120"
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

    <!-- Modal chọn đơn vị -->
    <div
      v-if="showModalChooseMultipleUnit"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      id="modal-choose-multiple-unit"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
      >
        <div>
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Chọn Đơn Vị Báo Giá
            </h4>
          </div>
        </div>
        <hr />
        <div>
          <div cols="12">Đơn vị gốc: TODO</div>
        </div>
        <div>
          <div cols="12">Chuyển đổi thành:</div>
        </div>

        <div>
          <div cols="12">
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

        <div>
          <div cols="12" class="text-center mt-3">
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

    <!-- Modal giữ hàng -->
    <div
      v-if="showModalRepoKeepFlag"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      id="modal-repo-keep"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <div>
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">
              Sản phẩm có sẵn trong kho. Bạn có muốn giữ hàng cho đơn hàng này
              không?
            </h4>
          </div>
        </div>
        <hr />
        <div>
          <div>
            <table
              class="min-w-full divide-y divide-gray-200 border border-gray-300"
            >
              <thead>
                <tr>
                  <th v-for="field in repo_product_fields" :key="field.key">
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in repo_products" :key="index">
                  <td v-for="field in repo_product_fields" :key="field.key">
                    {{ item[field.key] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-2">
          <div cols="12">
            <button
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 float-left btn-width-120"
              @click.prevent="hideModalRepoKeep"
            >
              Bỏ qua
            </button>

            <button
              v-show="!saving"
              class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 float-right btn-width-120"
              :disabled="saving"
              @click.prevent="confirmRepoKeep"
            >
              Giữ hàng
            </button>

            <span class="loading-more" v-show="saving"
              ><i class="fa fa-spinner fa-spin fa-3x"></i
            ></span>
          </div>
        </div>
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
import Datepicker from "vue3-datepicker";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import productApi from "@/api/product";
import quotationApi from "@/api/quotation";
import orderSellApi from "@/api/orderSell";
import superAdminAPI from "@/api/superAdmin";
import customerApi from "@/api/customer";
import MasterApi from "@/api/master";
import MasterMapper from "@/mapper/master";
import commonFunc from "@/common/commonFunc";

defineOptions({
  name: "OrderSellIndex",
  components: {
    Multiselect,
    Datepicker,
  },
});

// ============= COMPOSABLES =============
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { showToast: popToast } = useToast();
const { exportToExcel } = useExcelExport();

// ============= STATE =============

// Page state
const prefix_title = ref("Thêm Mới");
const saving = ref(false);
const loading = ref(false);
const loadingOptions = ref(false);
const showPartnerInfo = ref(true);
const showProductInfo = ref(true);
const showPaymentInfo = ref(true);
const showShippingInfo = ref(true);
const saveSuccess = ref(false);
const userRole = ref("admin");

// Modal state
const showModalProduct = ref(false);
const showModalAddProduct = ref(false);
const showModalQuotation = ref(false);
const showModalCustomer = ref(false);
const showModalSearchCustomerModal = ref(false);
const showModalRepoKeepFlag = ref(false);
const showModalChooseMultipleUnit = ref(false);

// Date info
const today_day = ref("");
const today_month = ref("");
const today_year = ref("");

// Store info
const store_name = ref("");
const store_tax_code = ref("");
const store_address = ref("");
const store_phone_number = ref("");

// Quotation state
const quotationOptions = ref([]);
const loadingQuotation = ref(false);
const quotationSelect = ref({});
const quotationSearch = reactive({
  quotation_number: null,
  customer_name: null,
});
const onSearchQuotation = ref(false);
const quotationSearchFields = ref([
  { key: "stt", label: "STT" },
  { key: "quotation_number", label: "Mã BG" },
  { key: "customer_name", label: "Tên K.H" },
  { key: "created_at", label: "Ngày tạo BG" },
  { key: "staff_on_charge_name", label: "NV quản lý" },
  { key: "sub_total", label: "Tổng tiền SP" },
  { key: "action", label: "", class: "actions-cell" },
]);
const quotationSearchItems = ref([]);

// Customer state
const customerSelect = ref({});
const customerOptionStore = ref([]);
const loadingCustomerOptions = ref(false);
const loadCusDetail = ref(false);
const currentCustomer = ref({});
const customer = reactive({
  type: 0,
  name: null,
  code: null,
  phone_number: null,
  email: null,
  tax_code: null,
  company_type: null,
  gender: null,
  birthday: undefined,
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
const onSearchCustomer = ref(false);
const customerSearchFields = ref([
  { key: "stt", label: "STT" },
  { key: "type", label: "Loại" },
  { key: "name", label: "Tên" },
  { key: "phone_number", label: "Số điện thoại" },
  { key: "gender", label: "Giới tính" },
  { key: "birthday", label: "Ngày sinh" },
  { key: "tax_code", label: "Mã số thuế" },
  { key: "city_name", label: "Tỉnh/TP" },
  { key: "district_name", label: "Quận/Huyện" },
  { key: "address", label: "Địa chỉ" },
  { key: "action", label: "", class: "actions-cell" },
]);
const customerSearchItems = ref([]);
const savingCustomer = ref(false);

// Product state
const productSelect = ref({});
const productOptions = ref([]);
const productOptionStore = ref([]);
const loadingProductOptions = ref(false);
const loadProductDetail = ref(false);
const productGroupSearchSelect = ref({});
const productGroupOptions = ref([]);
const productTypeSearchSelect = ref({});
const productTypeSearchOptions = ref([]);
const productTypeOptionStore = ref([]);
const productBrandOptions = ref([]);
const productBrandOptionsSearch = ref([]);
const productSearch = reactive({
  code: null,
  name: null,
  product_brand_id: null,
  product_type_id: null,
  product_group_id: null,
});
const onSearchProduct = ref(false);
const productSearchFields = ref([
  { key: "stt", label: "STT" },
  { key: "product_group_name", label: "Nhóm SP" },
  { key: "product_type_name", label: "Loại SP" },
  { key: "code", label: "Mã SP" },
  { key: "name", label: "Tên SP" },
  { key: "actions", label: "", class: "actions-cell" },
]);
const productSearchItems = ref([]);
const projectProducts = ref([]);

// Current product being edited
const currentProduct = reactive({
  index: -1,
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
  target_unit_id: null,
  target_unit_name: null,
  conversion_value: null,
  quantity_root: null,
});

// Product properties
const currentProperties = ref([]);
const propertiesChoosen = ref([]);
const currentPropertiesRoot = ref([]);

// Unit management
const unitOptions = ref([]);
const multipleUnitsOptionStore = ref([]);
const multipleUnitsOption = ref([]);
const current_unit = ref(null);
const root_unit = ref({});

// Staff and master data
const optionsStaff = ref([]);
const optionsStaffStore = ref([]);
const optionsPaymentMethod = ref([]);
const optionsShippingAgreement = ref([]);
const optionsCompanyType = ref([
  { value: null, text: "" },
  { value: 1, text: "Thương mại" },
  { value: 2, text: "Nhà máy" },
  { value: 3, text: "Công Trình" },
]);
const optionsGender = ref([
  { value: "1", text: "Nam" },
  { value: "2", text: "Nữ" },
  { value: "3", text: "Khác" },
]);
const optionsCity = ref([]);
const optionsDistrict = ref([]);

// Bank account
const bankAccountOptions = ref([]);
const bankAccountOptionStore = ref([]);
const bankAccountSelected = ref({
  account_name: "",
  account_number: "",
  bank_name: "",
});

// Repository
const repo_keep = ref({});
const repo_products = ref([]);
const repo_product_fields = ref([
  { key: "stt", label: "STT" },
  { key: "product_name", label: "Sản phẩm" },
  { key: "unit_name", label: "Đơn vị" },
  { key: "quantity", label: "Số lượng bán" },
  { key: "repo_quantity_remain", label: "Số lượng trong kho" },
]);

// Excel export
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

// Main trade object
const trade = reactive({
  id: null,
  status: -1,
  type: 0,
  quotation_id: null,
  issue_invoice: null,
  customer_id: null,
  customer_name: null,
  customer_tax_code: null,
  customer_address: null,
  customer_email: null,
  sub_total: 0,
  extra_fee: null,
  fixed_discount: null,
  have_vat: false,
  vat_percent: 10,
  vat_value: 0,
  total: 0,
  profit: 0,
  bank_account_id: null,
  payment_method: null,
  payment_method_input: null,
  shipping_agreement: null,
  shipping_fee: 0,
  staff_in_charge: null,
  staff_in_charge_name: null,
  staff_in_charge_phone: null,
  staff_in_charge_email: null,
  staff_in_charge_position: null,
  description: null,
  products: [],
  receiver_name: null,
  receiver_phone: null,
  receiver_address: null,
  shipping_date: undefined,
  shipping_note: null,
});

// ============= LIFECYCLE HOOKS =============

onMounted(() => {
  // Check prefix
  if (route.params.id) {
    prefix_title.value = "Cập Nhật";
  } else {
    prefix_title.value = "Thêm Mới";
  }

  // UI by staff
  let url = location.href;
  if (
    url.includes("order-sell-staff") ||
    url.includes("order-sell-by-quotation-staff")
  ) {
    userRole.value = "staff";
  } else {
    userRole.value = "admin";
  }

  // Get today day, month, year
  let dateNow = new Date();
  today_day.value = dateNow.getDate();
  today_month.value = dateNow.getMonth() + 1;
  today_year.value = dateNow.getFullYear();
  trade.shipping_date = new Date(dateNow.setDate(dateNow.getDate() + 3));

  // Get list quotation option
  getQuotationOption();

  // Lấy danh sách khách hàng trước
  getCustomerOptions();

  // Lấy danh sách sản phẩm
  getProductOptions();

  // Lấy danh sách khách hàng trước
  // getOptionsRelated()

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
  };
  if (userRole.value == "admin") {
    params2.staffs = true;
  }
  getOptionsRelated(params2);

  // Get trade detail
  getTradeDetail();

  // Get store info
  getStoreDetail();
});

// ============= METHODS =============

/**
 *  Get customer options
 */
const getCustomerOptions = () => {
  console.log("userRole.value: " + userRole.value);
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
 *  Get product options
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

const getCustomerCodeById = (id) => {
  for (let i in customerOptionStore.value) {
    if (customerOptionStore.value[i].id == id) {
      return customerOptionStore.value[i].code;
    }
  }
  return null;
};

/**
 * Update customer info
 */
const updateCustomerInfo = () => {
  if (!trade.customer_id) {
    return;
  }
  let params = {
    id: trade.customer_id,
    name: trade.customer_name,
    address: trade.customer_address,
    tax_code: trade.customer_tax_code,
    email: trade.customer_email,
    code: currentCustomer.code,
  };
  customerApi.updateCustomerFromOrderSell(params).then((res) => {
    if (res != null && res.data != null) {
      popToast("success", "Cập nhật thông tin khách hàng thành công!");

      if (customerSelect.value && customerSelect.value.id) {
        customerSelect.value.name = JSON.parse(
          JSON.stringify(trade.customer_name),
        );
      }

      getCustomerOptions();
    }
  });
};

const showModalSearchProduct = () => {
  showModalProduct.value = true;
};

const hideModalSearchProduct = () => {
  showModalProduct.value = false;
};

const backProduct = () => {
  product.code = null;
  product.name = null;
  product.product_type_id = null;
  product.product_group_id = null;
  product.unit_id = null;
  product.description = null;
  showModalAddProduct.value = false;
};

const getProductGroupItemById = (id) => {
  for (let i in productGroupOptions.value) {
    if (productGroupOptions.value[i].id == id) {
      return productGroupOptions.value[i];
    }
  }
  return {};
};

const getProductTypeItemById = (id) => {
  for (let i in productTypeOptionStore.value) {
    if (productTypeOptionStore.value[i].value == id) {
      return productTypeOptionStore.value[i];
    }
  }
  return {};
};

const getProductItemById = (id) => {
  for (let i in productOptions.value) {
    if (productOptions.value[i].id == id) {
      return productOptions.value[i];
    }
  }
  return {};
};

/**
 * Search
 */
const searchQuotation = () => {
  if (onSearchQuotation.value) {
    return;
  }
  quotationSearchItems.value = [];

  onSearchQuotation.value = true;

  let params = {
    quotation_number: quotationSearch.quotation_number,
    customer_name: quotationSearch.customer_name,
    limit: 100,
    offset: 0,
  };

  quotationApi
    .searchQuotationForOrderSell(params, userRole.value)
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        quotationSearchItems.value = res.data.data;
      } else {
        quotationSearchItems.value = [];
      }
      onSearchQuotation.value = false;
    })
    .catch((err) => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);

      onSearchQuotation.value = false;
    });
};

const chooseQuotation = (id) => {
  let quotationId = id;
  if (!id) {
    quotationId = trade.quotation_id;
  }
  // Get order sell detail by quotation id
  getOrderSellDetailByQuotationId(quotationId);
  getQuotationItemById(quotationId);
  showModalQuotation.value = false;
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

const reformatProductItem = (product) => {
  product.price_list = currencyFormat(
    (product.price_list + "").replaceAll(",", ""),
  );

  product.price = currencyFormat((product.price + "").replaceAll(",", ""));

  product.profit_on_item = currencyFormat(
    (product.profit_on_item + "").replaceAll(",", ""),
  );
  if (
    product.profit_on_item == "" ||
    product.profit_on_item == "null" ||
    product.profit_on_item == "NaN"
  ) {
    product.profit_on_item = 0;
  }

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
  if (
    product.profit == "" ||
    product.profit == "null" ||
    product.profit == "NaN"
  ) {
    product.profit = 0;
  }

  return product;
};

const handleListProduct = () => {
  if (trade.products.length > 0) {
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
        project.project_quantity = p.project_quantity;
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
  }
};

const getOrderSellDetailByQuotationId = (quotationId) => {
  if (quotationId) {
    loading.value = true;

    quotationApi
      .getQuotationDetail(quotationId, userRole.value)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let quotation = res.data.data;

          console.log("===");
          console.log(quotation);
          console.log(quotation.customer_id);

          trade.quotation_id = quotationId;
          trade.customer_id = quotation.customer_id;
          console.log(trade.customer_id);
          trade.customer_name = quotation.customer_name;
          trade.customer_address = quotation.customer_address;
          trade.customer_tax_code = quotation.customer_tax_code;
          trade.customer_email = quotation.customer_email;
          trade.receiver_name = quotation.contact_person_name;
          trade.receiver_phone = quotation.contact_person_phone;
          trade.have_vat = quotation.have_vat;
          trade.vat_percent = quotation.vat_percent;
          trade.vat_value = quotation.vat_value;
          trade.profit_margin = quotation.profit_margin;
          trade.profit = quotation.profit;
          trade.payment_method = quotation.payment_method;
          trade.payment_method_input = quotation.payment_method_input;
          trade.shipping_agreement = quotation.shipping_agreement;
          trade.staff_in_charge = quotation.staff_in_charge;
          trade.description = quotation.description;
          trade.products = quotation.products;
          trade.promotions = quotation.promotions;
          trade.type = quotation.type;
          // if(quotation.shipping_date) {
          //     trade.shipping_date = quotation.shipping_date
          // }

          // Kiểm tra là loại báo giá nào, nếu là báo giá dự án thì handle lại ds sp:
          if (quotation.type == 1) {
            handleListProduct();
          }

          // Format
          trade.sub_total = currencyFormat(
            (quotation.sub_total + "").replaceAll(",", ""),
          );
          trade.profit = currencyFormat(
            (quotation.profit + "").replaceAll(",", ""),
          );
          trade.total = currencyFormat(
            (quotation.total + "").replaceAll(",", ""),
          );
          trade.extra_fee = currencyFormat(
            (quotation.extra_fee + "").replaceAll(",", ""),
          );
          trade.fixed_discount = currencyFormat(
            (quotation.fixed_discount + "").replaceAll(",", ""),
          );
          trade.shipping_fee = currencyFormat(
            (quotation.shipping_fee + "").replaceAll(",", ""),
          );

          console.log("===");
          console.log(trade);

          // Check đã save draft chưa
          if (!trade.order_sell_number) {
            saveDraft();
          }

          console.log("===");
          console.log(trade);

          // Selected customer option
          if (trade.customer_id) {
            getCustomerItemById(trade.customer_id);
            // changeCustomer()
          }

          console.log("===");
          console.log(trade);
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

/**
 * Search product
 */
const searchProduct = () => {
  productSearchItems.value = [];

  if (onSearchProduct.value) {
    return;
  }

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
  showModalProduct.value = false;
};

const showModalAddCustomer = () => {
  showModalCustomer.value = true;
};

const showModalSearchCustomer = () => {
  showModalSearchCustomerModal.value = true;
  searchCustomer();
};

const showModalSearchQuotation = () => {
  showModalQuotation.value = true;
};

const backCustomer = () => {
  customer.type = 0;
  customer.name = null;
  customer.code = null;
  customer.phone_number = null;
  customer.email = null;
  customer.tax_code = null;
  customer.gender = null;
  customer.birthday = null;
  customer.city_id = null;
  customer.district_id = null;
  customer.address = null;
  customer.contact_person_name = null;
  customer.contact_person_phone = null;
  customer.contact_person_email = null;
  customer.created_by = null;
  showModalCustomer.value = false;
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
      savingCustomer.value = false;
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast("success", "Thêm khách hàng thành công!");

          let customer_id = res.data.data;
          let customerData = JSON.parse(JSON.stringify(customer));
          currentCustomer.id = customer_id;
          Object.assign(currentCustomer, customerData);

          // customerOptionStore.value.unshift({id: customer_id, name: customerData.name})
          customerSelect.value = { id: customer_id, name: customerData.name };

          trade.customer_id = customer_id;
          trade.customer_name = customerData.name;
          trade.customer_address = customerData.address;
          trade.customer_tax_code = customerData.tax_code;
          trade.receiver_name = customerData.contact_person_name;
          trade.receiver_phone = customerData.contact_person_phone;
          trade.customer_email = customerData.email;

          getCustomerOptions();

          backCustomer();
        }
      }
    })
    .catch((err) => {
      savingCustomer.value = false;

      // Handle error
      let errorMess = commonFunc.handleStaffError(err);
      popToast("danger", errorMess);
    });
};

const hideModalSearchCustomer = () => {
  showModalSearchCustomerModal.value = false;
};

/**
 * Search customer
 */
const searchCustomer = () => {
  if (onSearchCustomer.value) {
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
  console.log("userRole.value: " + userRole.value);
  customerApi
    .getCustomerByStore(params, userRole.value)
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
        customerSearchItems.value = res.data.data.customers;

        if (customerSearchItems.value.length == 0) {
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
  showModalSearchCustomerModal.value = false;
};

const getCustomerItemById = (id) => {
  if (id) {
    for (let i in customerOptionStore.value) {
      if (customerOptionStore.value[i].id == id) {
        customerSelect.value = customerOptionStore.value[i];
        break;
      }
    }
  }
};

const getQuotationItemById = (id) => {
  for (let i in quotationOptions.value) {
    if (quotationOptions.value[i].id == id) {
      quotationSelect.value = quotationOptions.value[i];
    }
  }
};

const handleCustomerTaxCode = (customer_tax_code) => {
  if (customer_tax_code) {
    if (customer_tax_code.substring(0, 1) == 0) {
      return "'" + customer_tax_code;
    } else {
      return customer_tax_code;
    }
  }
  return "";
};

const handleProductExcel = () => {
  products_excel.value = [
    {
      index: "Tên khách hàng: ",
      product_code: trade.customer_name,
      product_name: null,
      brand_name: null,
      unit_name: null,
      quantity: null,
      price: null,
      amount: null,
      note: null,
    },
    {
      index: "Mã số thuế: ",
      product_code: handleCustomerTaxCode(trade.customer_tax_code),
      product_name: null,
      brand_name: null,
      unit_name: null,
      quantity: null,
      price: null,
      amount: null,
      note: null,
    },
    {
      index: "Địa chỉ: ",
      product_code: trade.customer_address,
      product_name: null,
      brand_name: null,
      unit_name: null,
      quantity: null,
      price: null,
      amount: null,
      note: null,
    },
    {
      index: "Email: ",
      product_code: trade.customer_email,
      product_name: null,
      brand_name: null,
      unit_name: null,
      quantity: null,
      price: null,
      amount: null,
      note: null,
    },
    {
      index: null,
      product_code: null,
      product_name: null,
      brand_name: null,
      unit_name: null,
      quantity: null,
      price: null,
      amount: null,
      note: null,
    },
    {
      index: "STT",
      product_code: "Mã SP",
      product_name: "Tên SP",
      brand_name: "Thương hiệu",
      unit_name: "Đơn vị",
      quantity: "Số lượng",
      price: "Giá bán",
      amount: "Thành tiền",
      note: "Ghi chú",
    },
  ];

  if (trade.products.length > 0) {
    let productsExcel = JSON.parse(JSON.stringify(trade.products));

    for (let i in productsExcel) {
      let item = {
        index: parseInt(productsExcel[i].index),
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
        price: productsExcel[i].price,
        amount: productsExcel[i].amount,
        note: productsExcel[i].note,
      };
      products_excel.value.push(item);
    }
  }
};

/**
 *  Get options
 */
const getOptionsRelated = (params) => {
  console.log("userRole.value: " + userRole.value);
  loadingOptions.value = true;

  orderSellApi
    .getOptionRelated(params)
    .then((res) => {
      if (res != null && res.data != null && res.data.data != null) {
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

        // Cities
        if (params.cities) {
          optionsCity.value = res.data.data.cities;
          optionsCity.value.unshift({ value: null, text: "" });
          changeCity();
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

        // Payments methods
        if (params.payment_methods) {
          optionsPaymentMethod.value = res.data.data.payment_methods;
          optionsPaymentMethod.value.unshift({ value: null, text: "Khác" });
        }

        // // Shipping agreements
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
 *  Get detail
 */
const getTradeDetail = () => {
  let tradeId = route.params.id;
  if (tradeId) {
    loading.value = true;
    console.log("userRole.value: " + userRole.value);
    orderSellApi
      .getOrderSellDetail(tradeId, userRole.value)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          Object.assign(trade, res.data.data);

          // Kiểm tra là loại báo giá nào, nếu là báo giá dự án thì handle lại ds sp:
          if (trade.type == 1) {
            handleListProduct();
          }

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

          if (trade.customer_id) {
            getCustomerItemById(trade.customer_id);
            // Ko cần change customer ở đây vì có thể thông tin k.h ở báo giá khác
            // changeCustomer()
          }

          // Handle bank account
          handleBankAccount();
          changeBankAccount();

          handleProductExcel();
        }

        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  } else {
    let url = location.href;
    if (url.includes("order-sell-by-quotation")) {
      let quotationId = route.params.quotationId;
      trade.quotation_id = quotationId;
      getOrderSellDetailByQuotationId(quotationId);
    }
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

const changeProductGroupSearch = () => {
  if (productGroupSearchSelect.value.id) {
    productSearch.product_group_id = productGroupSearchSelect.value.id;

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
  if (productTypeSearchSelect.value.value) {
    productSearch.product_type_id = productTypeSearchSelect.value.value;
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
  if (
    currentProperties.value.length > 0 &&
    currentProduct.properties.length > 0
  ) {
    let properties = [];
    if (propertiesChoosen.value.length > 0) {
      for (let j in propertiesChoosen.value) {
        var ele = document.getElementsByName(propertiesChoosen.value[j]);

        for (let i = 0; i < ele.length; i++) {
          if (ele[i].checked) {
            let item = {
              name: propertiesChoosen.value[j],
              value: ele[i].value,
            };
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
          if (product.price_buy) {
            currentProduct.price = currencyFormat(product.price_buy);
          } else {
            let price = parseInt(
              (parseInt(price_list) * (100 - parseFloat(discount))) / 100,
            );
            currentProduct.price = currencyFormat(price);
          }

          if (product.price_sell) {
            currentProduct.price_sell = currencyFormat(product.price_sell);
          } else {
            currentProduct.price_sell = JSON.parse(
              JSON.stringify(currentProduct.price),
            );
          }
          currentProduct.quantity_repo = currencyFormat(product.quantity_repo);
          currentProduct.properties = product.properties;
          currentProduct.unit_name = product.unit_name;
          currentProduct.unit_id = product.unit_id;
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
 * Get store detail
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

const selectProduct = (item) => {
  if (item) {
    currentProduct.product_id = item.id;
    currentProduct.product_code = item.code;
    currentProduct.product_name = item.name;
    changeProduct();
  } else {
    currentProduct.product_id = null;
  }
};

/**
 *  Event change quotation
 */
const changeQuotation = () => {
  if (quotationSelect.value && quotationSelect.value.id) {
    // Call api, get quotation detail
    getOrderSellDetailByQuotationId(quotationSelect.value.id);
  }
};

/**
 *  Event change customer
 */
const changeCustomer = () => {
  if (customerSelect.value && customerSelect.value.id) {
    trade.customer_id = customerSelect.value.id;
    trade.customer_name = customerSelect.value.name;

    // Call api: get user info detail
    loadCusDetail.value = true;
    orderSellApi
      .getCustomerDetail(customerSelect.value.id)
      .then((res) => {
        if (res != null && res.data != null && res.data.data != null) {
          let customer = res.data.data;
          Object.assign(currentCustomer, JSON.parse(JSON.stringify(customer)));

          trade.customer_address = customer.address;
          trade.customer_tax_code = customer.tax_code;
          trade.receiver_name = customer.contact_person_name;
          trade.receiver_phone = customer.contact_person_phone;
          trade.receiver_address = customer.shipping_person_address;
          trade.customer_email = customer.email;
        }
        loadCusDetail.value = false;
      })
      .catch((err) => {
        loadCusDetail.value = false;

        // Handle error
        let errorMess = commonFunc.handleStaffError(err);
        popToast("danger", errorMess);
      });
  } else {
    refreshCustomerInfo();
  }
};

const refreshCustomerInfo = () => {
  trade.customer_id = null;
  trade.customer_name = null;
  trade.customer_address = null;
  trade.customer_tax_code = null;
  trade.receiver_name = null;
  trade.receiver_phone = null;
  trade.receiver_address = null;
  trade.customer_email = null;
};

/**
 *  Get quotation options
 */
const getQuotationOption = () => {
  orderSellApi.getQuotationOption(userRole.value).then((res) => {
    if (res != null && res.data != null && res.data.data != null) {
      quotationOptions.value = res.data.data;

      let itemEmpty = { id: null, name: null };
      quotationOptions.value.unshift(itemEmpty);

      getQuotationItemById(trade.quotation_id);
    }
  });
};

/**
 * Refresh current product
 */
const refreshCurrentProduct = () => {
  currentProduct.index = -1;
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
  currentProduct.discount_sale = null;
  currentProduct.profit_on_item = null;
  currentProduct.amount = null;
  currentProduct.price_sell = null;
  currentProduct.amount_sell = null;
  currentProduct.profit = null;
  currentProduct.quantity_repo = null;
  currentProduct.quantity = null;
  currentProduct.is_available_in_repo = null;
  currentProduct.properties = [];
  currentProduct.note = null;
  currentProduct.target_unit_id = null;
  currentProduct.target_unit_name = null;
  currentProduct.conversion_value = null;
  currentProduct.quantity_root = null;
};

const refreshTradeInfo = () => {
  Object.assign(trade, {
    id: null,
    status: -1,
    type: 0,
    quotation_id: null,
    issue_invoice: null,
    customer_id: null,
    customer_name: null,
    customer_tax_code: null,
    customer_address: null,
    customer_email: null,
    sub_total: 0,
    extra_fee: null,
    fixed_discount: null,
    have_vat: false,
    vat_percent: 10,
    vat_value: 0,
    total: 0,
    profit: 0,
    bank_account_id: null,
    payment_method: null,
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
    receiver_name: null,
    receiver_phone: null,
    receiver_address: null,
    shipping_date: null,
    shipping_note: null,
  });
};

/**
 * Tính toán thành tiền sản phẩm
 */
const calculateAmount = (keyInput) => {
  var amount = 0;
  // let total_profit_margin = 0
  let total_profit = 0;
  for (let i in trade.products) {
    amount += Math.round(
      (trade.products[i].price_sell + "").replaceAll(",", "") *
        (trade.products[i].quantity + "").replaceAll(",", ""),
    );
    // total_profit_margin += parseFloat(trade.products[i].profit_margin)
    total_profit += parseInt(trade.products[i].profit);
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

  trade.profit = currencyFormat(total_profit - fixed_discount);
  // trade.profit_margin = total_profit_margin
  trade.total = currencyFormat(
    amount + parseInt(extra_fee) - parseInt(fixed_discount) + vat_value,
  );

  // Check reload bank account
  if (keyInput == "vat") {
    handleBankAccount();
  }
};

const getCurrentBankAccountType = () => {
  if (trade.bank_account_id) {
    for (let i in bankAccountOptionStore.value) {
      if (bankAccountOptionStore.value[i].id == trade.bank_account_id) {
        return bankAccountOptionStore.value[i].type;
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
      for (let i in bankAccountOptionStore.value) {
        if (bankAccountOptionStore.value[i].type == 1) {
          firstItemId = bankAccountOptionStore.value[i].id;
          if (bankAccountOptionStore.value[i].is_default) {
            trade.bank_account_id = bankAccountOptionStore.value[i].id;
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
      if (bankAccountOptionStore.value.length > 0) {
        firstItemId = bankAccountOptionStore.value[0].id;
      }
      for (let i in bankAccountOptionStore.value) {
        if (bankAccountOptionStore.value[i].type == 0) {
          firstItemId = bankAccountOptionStore.value[i].id;
          if (bankAccountOptionStore.value[i].is_default) {
            trade.bank_account_id = bankAccountOptionStore.value[i].id;
          }
        }
      }
      if (!trade.bank_account_id) {
        trade.bank_account_id = firstItemId;
      }
    }
  }
  changeBankAccount();
};

/**
 *  Xác nhận sản phẩm
 */
const confirmBuyProduct = () => {
  // Check product group
  if (!currentProduct.product_group_id) {
    // popToast('danger', "Vui lòng chọn nhóm sản phẩm")
    // return
    currentProduct.product_group_id = null;
    currentProduct.product_group_name = null;
  }

  // Check product type
  if (!currentProduct.product_type_id) {
    // popToast('danger', "Vui lòng chọn loại sản phẩm")
    // return
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
    popToast("danger", "Vui lòng nhập giá bán sản phẩm");
    return;
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
  currentProduct.amount = parseInt(
    currentProduct.price * currentProduct.quantity,
  );

  if (!currentProduct.price_sell) {
    currentProduct.price_sell = currentProduct.price;
  }
  if (!currentProduct.discount_sale) {
    currentProduct.discount_sale = 0;
  }
  currentProduct.price_sell = (currentProduct.price_sell + "").replaceAll(
    ",",
    "",
  );
  currentProduct.profit = (currentProduct.profit + "").replaceAll(",", "");
  currentProduct.amount_sell = parseInt(
    currentProduct.price_sell * currentProduct.quantity,
  );

  // TODO: handle thuộc tính sp
  let properties = [];
  if (propertiesChoosen.value.length > 0) {
    for (let j in propertiesChoosen.value) {
      var ele = document.getElementsByName(propertiesChoosen.value[j]);

      for (let i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
          let item = { name: propertiesChoosen.value[j], value: ele[i].value };
          properties.push(item);
        }
      }
    }
  }
  currentProduct.properties = properties;

  console.log("xx:" + JSON.stringify(currentProduct));
  if (currentProduct.index == -1) {
    // Thêm mới product
    currentProduct.index = trade.products.length;
    trade.products.push(JSON.parse(JSON.stringify(currentProduct)));
  } else {
    // Cập nhật product
    trade.products[currentProduct.index] = JSON.parse(
      JSON.stringify(currentProduct),
    );
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

const propertiesToString = (properties) => {
  let result = "";
  for (let i in properties) {
    result += properties[i].value;
  }
  return result;
};

/**
 * Cập nhật số lượng sản phẩm tại client khi mua sản phẩm
 */
const updateQuantityRepo = (product_id, quantitySell, properties, type) => {
  for (let i in productOptions.value) {
    if (product_id == productOptions.value[i].id) {
      if (type == "sell") {
        productOptions.value[i].quantity =
          parseFloat(productOptions.value[i].quantity) -
          parseFloat(quantitySell);
      }
      if (type == "delete") {
        productOptions.value[i].quantity =
          parseFloat(productOptions.value[i].quantity) +
          parseFloat(quantitySell);
      }

      // Update quantity cả trong thuộc tính
      if (productOptions.value[i].properties.length > 0) {
        for (let j in productOptions.value[i].properties) {
          let properties_str = propertiesToString(
            productOptions.value[i].properties[j],
          );
          let properties_input_str = propertiesToString(properties);

          if (properties_str.includes(properties_input_str)) {
            for (let x in productOptions.value[i].properties[j]) {
              if (productOptions.value[i].properties[j][x].name == "quantity") {
                if (type == "sell") {
                  productOptions.value[i].properties[j][x].value =
                    parseFloat(productOptions.value[i].properties[j][x].value) -
                    parseFloat(quantitySell);
                }
                if (type == "delete") {
                  productOptions.value[i].properties[j][x].value =
                    parseFloat(productOptions.value[i].properties[j][x].value) +
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
 *  Save draft
 */
const saveDraft = () => {
  // Reformat data
  let data = JSON.parse(JSON.stringify(trade));
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

  let vat_value = 0;
  if (data.vat_value) {
    vat_value = (data.vat_value + "").replaceAll(",", "");
  }
  data.vat_value = vat_value;

  data.shipping_fee = (data.shipping_fee + "").replaceAll(",", "");
  data.profit = (data.profit + "").replaceAll(",", "");
  data.total = (data.total + "").replaceAll(",", "");

  // Check products
  if (data.products.length == 0) {
    return;
  } else {
    data.products = formatProduct(data.products);
  }

  orderSellApi
    .saveDraftOrderSell(data)
    .then((res) => {
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast("success", "Lưu nháp thành công!");
          let response = res.data.data;
          trade.id = response.order_sell_id;
          trade.order_sell_number = response.order_sell_number;
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
    for (let i in optionsStaffStore.value) {
      if (optionsStaffStore.value[i].id == trade.staff_in_charge) {
        trade.staff_in_charge_name = optionsStaffStore.value[i].name;
        trade.staff_in_charge_phone = optionsStaffStore.value[i].phone_number;
        trade.staff_in_charge_email = optionsStaffStore.value[i].email;
        trade.staff_in_charge_position = optionsStaffStore.value[i].position;
      }
    }
  } else {
    trade.staff_in_charge_name = null;
    trade.staff_in_charge_phone = null;
    trade.staff_in_charge_email = null;
    trade.staff_in_charge_position = null;
  }
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
  data.profit = (data.profit + "").replaceAll(",", "");
  data.total = (data.total + "").replaceAll(",", "");
  data.vat_value = (data.vat_value + "").replaceAll(",", "");
  data.shipping_fee = (data.shipping_fee + "").replaceAll(",", "");

  // Check products
  if (data.products.length == 0) {
    return;
  } else {
    data.products = formatProduct(data.products);
  }

  orderSellApi
    .updateDraftOrderSell(data)
    .then((res) => {
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast("success", "Lưu nháp thành công!");
        }
      }
    })
    .catch((err) => {});
};

const checkUpdateDraft = () => {
  if (saveSuccess.value == false) {
    updateDraft();
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
  console.log("formatProductItem");
  console.log(product);
  console.log("formatProductItem");

  return product;
};

const formatProduct = (products) => {
  for (let product of products) {
    product = formatProductItem(product);
  }
  return products;
};

/**
 *  Save
 */
const save = () => {
  // Reformat data
  let data = JSON.parse(JSON.stringify(trade));

  // validate
  // Check products
  if (data.products.length == 0) {
    popToast("danger", "Chưa có sản phẩm nào được chọn");
    return;
  } else {
    data.products = formatProduct(data.products);
  }

  if (data.issue_invoice == null) {
    popToast("danger", "Vui lòng chọn mục [Xuất hóa đơn]");
    return;
  }

  if (data.issue_invoice == "true") {
    if (
      !data.customer_name ||
      !data.customer_tax_code ||
      !data.customer_address ||
      !data.customer_email
    ) {
      popToast("danger", "Vui lòng nhập đủ thông tin khách hàng");
      return;
    }
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

  let vat_value = 0;
  if (data.vat_value) {
    vat_value = (data.vat_value + "").replaceAll(",", "");
  }
  data.vat_value = vat_value;

  data.total = (data.total + "").replaceAll(",", "");
  data.profit = (data.profit + "").replaceAll(",", "");
  data.shipping_fee = (data.shipping_fee + "").replaceAll(",", "");

  saving.value = true;

  orderSellApi
    .saveOrderSell(data)
    .then((res) => {
      saving.value = false;
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          // Kiểm tra tình trạng kho, xác nhận có muốn giữ hàng ko
          repo_keep.value = res.data.data;
          if (repo_keep.value.products.length > 0) {
            // Show modal giữ hàng
            repo_products.value = repo_keep.value.products;
            showModalRepoKeep();
          } else {
            back();
          }
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

/**
 * Back to list
 */
const back = () => {
  // Go to list
  console.log("userRole.value: " + userRole.value);
  if (userRole.value == "staff") {
    router.push("/order-sell-staff");
  } else {
    router.push("/order-sell-all");
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
  trade.shipping_fee = commonFunc.intergerOnly(trade.shipping_fee);
  trade.shipping_fee = parseInt(trade.shipping_fee);
  trade.shipping_fee = currencyFormat(trade.shipping_fee + "");
};

const calculateCurrentProduct = (key) => {
  let price_list = parseInt(
    (currentProduct.price_list + "").replaceAll(",", ""),
  );
  let discount = (currentProduct.discount + "").replaceAll(",", "");
  let price_buy = (currentProduct.price + "").replaceAll(",", "");
  let discount_sale = (currentProduct.discount_sale + "").replaceAll(",", "");
  let profit_on_item = (currentProduct.profit_on_item + "").replaceAll(",", "");
  let price_sell = (currentProduct.price_sell + "").replaceAll(",", "");
  let quantity = (currentProduct.quantity + "").replaceAll(",", "");

  if (key == "price_list" || key == "discount") {
    if (price_list && discount) {
      discount = Math.round(discount * 100) / 100;
      price_buy = Math.round((price_list * (100 - discount)) / 100);
      currentProduct.price = currencyFormat(price_buy);

      if (discount_sale) {
        discount_sale = Math.round(discount_sale * 100) / 100;
        profit_on_item = Math.round((price_list * discount_sale) / 100);
        currentProduct.profit_on_item = currencyFormat(profit_on_item);

        price_sell = profit_on_item + parseInt(price_buy);
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

    if (profit_on_item) {
      price_sell = parseInt(price_buy) + parseInt(profit_on_item);
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
      discount_sale = Math.round(discount_sale * 100) / 100;
      profit_on_item = Math.round((price_list * discount_sale) / 100);
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

const changeBankAccount = () => {
  if (trade.bank_account_id) {
    for (let i in bankAccountOptionStore.value) {
      if (bankAccountOptionStore.value[i].id == trade.bank_account_id) {
        bankAccountSelected.account_name =
          bankAccountOptionStore.value[i].account_name;
        bankAccountSelected.account_number =
          bankAccountOptionStore.value[i].account_number;
        bankAccountSelected.bank_name =
          bankAccountOptionStore.value[i].bank_name;
      }
    }
  } else {
    bankAccountSelected.account_name = "";
    bankAccountSelected.account_number = "";
    bankAccountSelected.bank_name = "";
  }
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
      product["project_quantity"] = project_quantity;
      let product_quantity = project_quantity * parseFloat(product["quantity"]);
      product["quantity"] = product_quantity;
      let price_sell = parseInt(
        (product["price_sell"] + "").replaceAll(",", ""),
      );
      product["amount_sell"] = price_sell * product_quantity;
    }
  }
  handleListProduct();
};

const changeProjectName = (item_index, project_index = 0) => {
  let index = 1;
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
  handleListProduct();
};

const changeProductItem = (
  key,
  index_item,
  project_index = 0,
  product_index = 0,
) => {
  let index_item_str = index_item;
  if (project_index) {
    index_item_str = "project_" + index_item;
  }

  let price_list = document.getElementById(
    "price_list_" + index_item_str,
  ).value;
  if (price_list) {
    price_list = parseInt((price_list + "").replaceAll(",", ""));
  } else {
    price_list = 0;
  }

  let discount = document.getElementById("discount_" + index_item_str).value;
  if (discount) {
    discount = (discount + "").replaceAll(",", "");
  } else {
    discount = 0;
  }

  let price_buy = document.getElementById("price_" + index_item_str).value;
  if (price_buy) {
    price_buy = parseInt((price_buy + "").replaceAll(",", ""));
  } else {
    price_buy = 0;
  }

  let discount_sale = document.getElementById(
    "discount_sale_" + index_item_str,
  ).value;
  if (discount_sale) {
    discount_sale = (discount_sale + "").replaceAll(",", "");
  } else {
    discount_sale = 0;
  }

  let profit_on_item = document.getElementById(
    "profit_on_item_" + index_item_str,
  ).value;
  if (profit_on_item) {
    profit_on_item = parseInt((profit_on_item + "").replaceAll(",", ""));
  } else {
    profit_on_item = 0;
  }

  let price_sell = document.getElementById(
    "price_sell_" + index_item_str,
  ).value;
  if (price_sell) {
    price_sell = parseInt((price_sell + "").replaceAll(",", ""));
  } else {
    price_sell = 0;
  }

  let quantity = document.getElementById("quantity_" + index_item_str).value;
  if (quantity) {
    quantity = (quantity + "").replaceAll(",", "");
  } else {
    quantity = 0;
  }

  if (!price_list) {
    discount = 0;
  }
  let discount_temp = discount_sale;
  // if(discount_temp == 0) {
  //   discount_temp = discount_original_price
  // }

  let index = index_item - parseInt(project_index);
  // if(product_index) {
  //   index = product_index - 1
  // }

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

      if (price_buy && price_sell && quantity) {
        trade.products[index].amount_sell = currencyFormat(
          Math.round(price_sell * quantity),
        );
        trade.products[index].profit = currencyFormat(
          Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
        );
      }
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

    if (profit_on_item) {
      price_sell = profit_on_item + parseInt(price_buy);
      trade.products[index].price_sell = currencyFormat(price_sell);
    }

    if (price_buy && price_sell && quantity) {
      trade.products[index].amount_sell = currencyFormat(
        Math.round(price_sell * quantity),
      );
      trade.products[index].profit = currencyFormat(
        Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
      );
    }
  }

  if (key == "discount_sale") {
    if (price_buy) {
      discount_temp = document.getElementById("discount_sale_" + index).value;
      discount_temp = (discount_temp + "").replaceAll(",", "");
      profit_on_item = Math.round((price_list * discount_temp) / 100);
      trade.products[index].profit_on_item = currencyFormat(profit_on_item);
      price_sell = profit_on_item + parseInt(price_buy);
      trade.products[index].price_sell = currencyFormat(price_sell);

      if (
        price_sell != "" &&
        price_sell != "null" &&
        quantity != "" &&
        quantity != "null"
      ) {
        trade.products[index].amount_sell = currencyFormat(
          Math.round(price_sell * quantity),
        );
        trade.products[index].profit = currencyFormat(
          Math.round(profit_on_item * quantity),
        );
      }
    }
    if (discount_sale) {
      // trade.products[index].discount_original_price = 0
      trade.products[index].discount_sale = discount_sale;
    }
  }

  if (key == "profit_on_item") {
    if (price_list) {
      let discount_sale_temp =
        Math.round((profit_on_item / price_list) * 100 * 100) / 100;
      trade.products[index].discount_sale = discount_sale_temp;
      // trade.products[index].discount_original_price = 0
      trade.products[index].profit_on_item = currencyFormat(profit_on_item);
      price_sell = parseInt(profit_on_item) + parseInt(price_buy);
      trade.products[index].price_sell = currencyFormat(price_sell);

      if (
        price_sell != "" &&
        price_sell != "null" &&
        quantity != "" &&
        quantity != "null"
      ) {
        trade.products[index].amount_sell = currencyFormat(
          Math.round(price_sell * quantity),
        );
        trade.products[index].profit = currencyFormat(
          Math.round(profit_on_item * quantity),
        );
      }
    } else {
      if (price_buy) {
        let discount_sale_temp =
          Math.round((profit_on_item / price_buy) * 100 * 100) / 100;
        // trade.products[index].discount_original_price = discount_sale_temp
        trade.products[index].discount_sale = 0;
        trade.products[index].profit_on_item = currencyFormat(profit_on_item);
        price_sell = parseInt(profit_on_item) + parseInt(price_buy);
        trade.products[index].price_sell = currencyFormat(price_sell);

        if (
          price_sell != "" &&
          price_sell != "null" &&
          quantity != "" &&
          quantity != "null"
        ) {
          trade.products[index].amount_sell = currencyFormat(
            Math.round(price_sell * quantity),
          );
          trade.products[index].profit = currencyFormat(
            Math.round(profit_on_item * quantity),
          );
        }
      }
    }
  }

  if (key == "price_sell") {
    trade.products[index].price_sell = currencyFormat(price_sell);

    if (price_sell && quantity) {
      trade.products[index].amount_sell = currencyFormat(
        Math.round(price_sell * quantity),
      );
    }

    if (price_buy && price_sell && quantity) {
      trade.products[index].profit = currencyFormat(
        Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
      );
    }
  }

  if (key == "quantity") {
    // Calculate profit
    // if (price_buy && price_sell && quantity) {
    trade.products[index].amount_sell = currencyFormat(
      Math.round(price_sell * quantity),
    );
    trade.products[index].profit = currencyFormat(
      Math.round((parseInt(price_sell) - parseInt(price_buy)) * quantity),
    );
    trade.products[index].quantity = currencyFormat(quantity);
    // }
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

const deleteProductByProjectName = (project_name) => {
  let products = [];
  for (let product of trade.products) {
    if (product.project_name != project_name) {
      products.push(product);
    }
  }
  trade.products = products;
};

const deleteProduct = (
  ind,
  product_type,
  project_name,
  product_id,
  quantity,
  properties,
  project_index = 0,
) => {
  ind = ind - parseInt(project_index);

  // Remove item
  if (product_type == 0) {
    deleteProductByProjectName(project_name);
  } else {
    trade.products.splice(parseInt(ind), 1); // Xoá sp
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
  for (var i in products) {
    products[i].index = index;
    trade.products.push(products[i]);
    index += 1;
  }

  // Calculate
  calculateAmount();

  // Update
  checkUpdateDraft();

  // Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
  updateQuantityRepo(product_id, quantity, properties, "delete");

  handleProductExcel();
};

const deleteTrade = (trade_id) => {
  quotationApi
    .deleteQuotation(trade_id)
    .then((res) => {})
    .catch((err) => {});
};

/**
 * Only input integer and point
 */
const integerPointAndCommaOnly = (item) => {
  let valueInput = item.value;
  valueInput = valueInput.replaceAll(",", "");
  let result = commonFunc.integerPointAndCommaOnly(valueInput);

  result = currencyFormat(result);
  item.value = result;
};

/**
 * Currency format
 */
const currencyFormat = (num) => {
  let result = "";
  if (num == 0) {
    return "0";
  }
  num = (num + "").replace(",", "");
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

const showModalRepoKeep = () => {
  showModalRepoKeepFlag.value = true;
};

const hideModalRepoKeep = () => {
  back();
  showModalRepoKeepFlag.value = false;
};

const confirmRepoKeep = () => {
  saving.value = true;
  orderSellApi
    .keepProductOnRepo(repo_keep.value)
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
</script>

<style lang="scss" scoped>
.title-partner {
  border-radius: 5px 5px;
  padding: 5px;
  height: 30px;
}

.project_bg {
  background-color: #6a9ab0 !important;
}
</style>
