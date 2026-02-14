<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/2 px-2">
                <button class="btn btn-outline-secondary btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
            </div>

            <div md='12'>
                <h2 class="mt-1 text-center text-header">Bán Hàng</h2>
              </div>
            <hr/>

            <!-- Loading -->
            <div class="loading-more" v-show="loading">
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>

            <div class="form-row mt-2">
              <div class="w-full md:w-1/4 px-2 mt-2">
                <label>
                  <span>Từ đơn đặt hàng</span>
              </label>
              </div>
              <div class="w-full md:w-3/4 px-2">
                <div class="input-group">
                  <multiselect
                    v-model="orderSelect"
                    :options="orderOptions"
                    :loading="loadingGetOptions"
                    placeholder="--Chọn từ báo giá--"
                    label="name"
                    track-by="name"
                    @input="changeOrder"
                    @select="changeOrder">
                  </multiselect>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <div class="w-full px-2 bg-gray text-white title-partner">
                <div class="flex justify-between items-center py-2">
                  <h5 class="mb-0">Thông tin người mua</h5>
                  <button @click="showPartnerInfo = !showPartnerInfo" class="text-white hover:text-gray-200 cursor-pointer">
                    <i class="fa fa-angle-double-up" v-show="showPartnerInfo" />
                    <i class="fa fa-angle-double-down" v-show="!showPartnerInfo" />
                  </button>
                </div>
              </div>
            </div>

            <div v-show="showPartnerInfo">
              <div class="w-full px-2">

                <div class="form-row mt-2">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>
                      <span>Khách hàng</span>
                  </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
                    <div class="input-group" v-show="trade.from_type == 0">
                      <multiselect
                        v-model="customerSelect"
                        :options="customerOptionStore"
                        :loading="loadingGetOptions"
                        placeholder="--Chọn khách hàng--"
                        label="name"
                        track-by="name"
                        @input="changeCustomer"
                        @select="changeCustomer">
                      </multiselect>

                      <button class="btn btn-outline-primary ml-2"  @click="showModalSearchCustomer" >
                        <i class="fa fa-search"></i>
                      </button>

                      <button class="btn btn-outline-success ml-2"  @click="showModalAddCustomer" >
                        <i class="fa fa-plus"></i>
                      </button>

                      <button class="btn ml-2" v-show="customerSelect.id" variant="outline-success"
                                @click="updateCustomerInfo" >
                        <i class="fa fa-save"></i>
                      </button>

                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>
                      <span>Tên khách hàng</span>
                  </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <input
                      id="customer_name"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_name"
                      :disabled="saving">
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>
                      <span>SĐT khách hàng</span>
                  </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <input
                      id="customer_phone"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_phone"
                      :disabled="saving"
                      @keyup="integerOnly($event.target)">
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>
                      <span>Địa chỉ khách hàng</span>
                  </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <input
                      id="address"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.customer_address"
                      :disabled="saving">
                  </div>
                </div>
              </div>
            </div>


            <div class="mt-3">
              <div class="w-full px-2 bg-info bg-gradient text-white title-partner" >
                <div class="flex justify-between items-center py-2">
                  <h5 class="mb-0">Thông tin sản phẩm</h5>
                  <button @click="showProductInfo = !showProductInfo" class="text-white hover:text-gray-200 cursor-pointer">
                    <i class="fa fa-angle-double-up" v-show="showProductInfo" />
                    <i class="fa fa-angle-double-down" v-show="!showProductInfo" />
                  </button>
                </div>
              </div>
            </div>

            <div v-show="showProductInfo" class="mt-2">
              <div class="w-full px-2">
                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Sản phẩm</label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <div class="input-group">
                      <multiselect
                        v-model="productSelect"
                        :options="productOptions"
                        :loading="loadingGetOptions"
                        placeholder="--Chọn sản phẩm--"
                        label="name_full"
                        track-by="name_full"
                        @input="changeProduct"
                        @select="changeProduct">
                      </multiselect>

                      <button class="btn btn-outline-primary ml-2"  @click="showModalSearchProduct" >
                        <i class="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-row mt-2" v-show="currentProperties.length > 0">
                  <div class="w-full md:w-1/4 px-2">
                    <label>Thuộc tính</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <p v-for="(item) in currentProperties" :key="item.name">
                      <label :for="item.name">{{ item.name }}:
                        <span v-for="(value, index) in item.value" :key="value">
                          <input type="radio" :id="item.name + value" :value="value" :name="item.name" class="ml-2"
                                 :checked="index == 0" v-on:change="calQuantityRepo">
                          <label :for="value" class="ml-1">{{value}}</label>
                        </span>
                    </label>
                    </p>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Đơn giá nhập</label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <div class="input-group">
                      <input
                        v-show="isShowPriceBuy"
                        id="price_buy"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="currentProduct.price_buy"
                        readonly>
                      <input
                        v-show="!isShowPriceBuy"
                        id="price_buy_show"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        value="****"
                        readonly>
                      <button class="btn btn-outline-primary ml-2"  @click="isShowPriceBuy = !isShowPriceBuy" >
                        <i v-show="!isShowPriceBuy" class="fa fa-eye" aria-hidden="true" title="Xem giá nhập"></i>
                        <i v-show="isShowPriceBuy" class="fa fa-eye-slash" aria-hidden="true" title="Đóng giá nhập"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Đơn giá bán</label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                      <input
                        id="price_sell"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="currentProduct.price_sell"
                      @change="changePriceSell">
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Số lượng trong kho {{unit_name}}</label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <input
                      id="quantity_repo"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.quantity_repo"
                      readonly
                    >
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Số lượng bán {{unit_name}}</label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <input
                      id="quantity"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.quantity"
                    @change="changeQuantity">
                  </div>
                </div>

                <div class="mt-2">
                  <div class="w-full px-2 text-center" >
                    <button class="btn btn-outline-primary text-center btn-width-120"  @click="confirmBuyProduct">
                      Xác nhận
                    </button>
                  </div>
                </div>

                <div v-show="trade.products.length > 0" class="mt-2">
                  <div class="w-full px-2">
                    <h5>Danh sách sản phẩm đang bán</h5>
                  </div>
                </div>
                <div class="mt-2" v-show="trade.products.length > 0" >
                  <div class="w-full px-2">
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
                    <tr v-for="(item, index) in trade.products">
                      <td>{{item.index}}</td>
                      <td>{{item.product_name}}</td>
                      <td>
                        <p v-for="(pro) in item.properties" :key="pro.name">
                          + {{pro.name}}: {{pro.value}}
                        </p>
                      </td>
                      <td class="text-right">{{currencyFormat(item.price_sell)}}</td>
                      <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                      <td class="text-right">{{currencyFormat(item.amount_sell)}}</td>
                      <td><i class="fa fa-trash" @click="deleteProduct(item.index, item.product_id, item.quantity, item.properties)" /></td>
                    </tr>
                    </tbody>
                  </table>
                  </div>
                </div>

              </div>
            </div>

            <div class="mt-3">
              <div class="w-full px-2 bg-success bg-gradient text-white title-partner" >
                <div class="flex justify-between items-center py-2">
                  <h5 class="mb-0">Thông tin thanh toán</h5>
                  <button @click="showPaymentInfo = !showPaymentInfo" class="text-white hover:text-gray-200 cursor-pointer">
                    <i class="fa fa-angle-double-up" v-show="showPaymentInfo" />
                    <i class="fa fa-angle-double-down" v-show="!showPaymentInfo" />
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-2" v-show="showPaymentInfo">
              <div class="w-full px-2">
                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Tổng tiền sản phẩm </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                      id="sub_total"
                      type="text"
                      maxlength="100"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.sub_total"
                      readonly>
                  </div>
                </div>

                <div class="form-row" v-show="trade.order_id && trade.amount_paid_on_order">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Đã thanh toán khi đặt hàng </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <input
                      id="amount_paid_on_order"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.amount_paid_on_order"
                      readonly>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Chi phí thêm </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                      id="extra_fee"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.extra_fee"
                      @change="calculateAmount">
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Số tiền giảm</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                      id="fixed_discount"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.fixed_discount"
                      @change="calculateAmount">
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Khuyến mãi</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <div class="input-group">
                      <input
                        id="pmt"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        style="width: 100px"
                        v-model="trade.discount_amount"
                        readonly disabled
                      >
                      <button class="btn btn-outline-success ml-2"  @click="showModalApplyPmt" >
                        <i class="fa fa-plus"></i>
                      </button>
                    </div>

                    <div class="input-group" v-show="trade.promotions.length > 0">
                      <p>Danh sách khuyến mãi đang áp dụng</p>
                      <p class="col-12" v-for="pmt in trade.promotions" :key="pmt.id">
                        {{" - " + pmt.quantity_apply + " x " + pmt.name}}
                        <i v-show="pmt.method != 'auto'" class="fa fa-trash" @click="deletePromotion(pmt.id)"/>
                      </p>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Thuế VAT </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <div class="input-group">
                      <input type="checkbox" id="have_vat" v-model="trade.have_vat" class="mr-2" @change="calculateAmount">
                      <input
                        id="vat_percent"
                        type="text"
                        maxlength="3"
                        autocomplete="new-password"
                        class="mr-2"
                        style="width: 50px"
                        v-model="trade.vat_percent"
                        @change="calculateAmount">%
                      <input
                        id="vat_value"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="trade.vat_value"
                        @change="calculateAmount">
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Thành tiền </label><span class="error-sybol"></span>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <input
                      id="amount"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.total"
                      readonly>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Số tiền thanh toán </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <input
                      id="total_paid"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.total_paid"
                      @change="changeTotalPaid">
                  </div>
                </div>

                <div class="form-row" v-show="isShowApoimentPayment">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Lãi suất (%)</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                      id="interest_rate"
                      type="text"
                      class="form-control"
                      v-model="trade.interest_rate"
                      autocomplete="new-password"
                      maxlength="5"
                      @keyup="integerAndPointOnly($event.target)">
                  </div>
                </div>

                <div class="form-row" v-show="isShowApoimentPayment">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Kỳ hạn tính lãi</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <select class="form-control form-control"
                      id="interest_period"
                      autocomplete="new-password"
                      v-model="trade.interest_period"
                    >
                      <option v-for="option in periodOptions" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-row" v-show="isShowApoimentPayment">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Ngày hẹn thanh toán </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2" >
                    <datepicker
                      :modelValue="trade.appointment_date ? parseDate(trade.appointment_date) : null"
                      @update:modelValue="trade.appointment_date = $event ? formatDate($event) : null"
                      format="yyyy-MM-dd"
                      :typeable="true"
                      placeholder="yyyy-MM-dd"
                      input-class="datepicker-cus"
                    ></datepicker>
                  </div>
                </div>

                <div class="form-row" v-show="isShowApoimentPayment">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Nhắc hẹn thanh toán trước số ngày </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <input
                      id="forewarning"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="trade.forewarning"
                      @keyup="integerOnly($event.target)">
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Loại tiền thanh toán </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 pl-2" >

                    <div class="form-row">
                      <div class="w-full md:w-1/4 px-2 mt-2" >
                        <label>Tiền mặt </label>
                      </div>
                      <div class="w-full md:w-3/4 px-2">
                        <input
                          id="cash_input"
                          type="text"
                          class="form-control"
                          v-model="trade.cash"
                          autocomplete="new-password"
                          maxlength="14"
                          @change="changeCash">
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="w-full md:w-1/4 px-2 mt-2" >
                        <label>Chuyển khoản </label>
                      </div>
                      <div class="w-full md:w-3/4 px-2">
                        <input
                          id="credit_input"
                          type="text"
                          class="form-control"
                          v-model="trade.credit"
                          autocomplete="new-password"
                          maxlength="14"
                          @change="changeCredit">
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="w-full md:w-1/4 px-2 mt-2" >
                        <label>Tiền điện tử </label>
                      </div>
                      <div class="w-full md:w-3/4 px-2">
                        <input
                          id="e_money_input"
                          type="text"
                          class="form-control"
                          v-model="trade.e_money"
                          autocomplete="new-password"
                          maxlength="14"
                          @change="changeEMoney">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2" >
                    <label>Ghi chú </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <textarea class="form-control"
                      id="description"
                      style="width:100%;"
                      rows="3"
                      v-model="trade.description"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <div class="w-full px-2 text-center" >
                <button class="btn btn-outline-primary btn-width-200"  @click="printProvisionalInvoice">
                  In hóa đơn tạm tính
                </button>
              </div>
            </div>

            <div class="mt-2">
              <div class="w-full px-2 text-center" >
                <button class="btn" v-show="!saving" variant="outline-success" style="height: 50px; width: 240px" @click="checkBeforeSell"
                          :disabled="saving || !this.trade.id">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận Bán
                </button>
                <div class="loading-more" v-show="saving">
                  <div class="spinner-border text-success" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Mẫu in hoá đơn 1-->
    <div hidden id="provisionalInvoice">
      <div class="w-full px-2">

        <div>
          <div class="print-text-left print-width-50-left">
            <h4>TÊN CỤC THUẾ................</h4>
          </div>
          <div class="print-text-right print-width-50-right">
            <h4>Mẫu số: 02GTTT3/001</h4>
          </div>
        </div>

        <h2 class="print-text-center">HOÁ ĐƠN BÁN HÀNG{{suffix_print_title}}</h2>
        <p class="print-text-center">Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</p>
        <p class="print-text-center">Số hoá đơn: {{trade.bill_number}}</p>
        <br>
        <div class="print-border print-pl-2">
          <table style="width:100%">

            <tbody>
            <tr><td class="print-no-border">Đơn vị bán hàng: <b>{{store_name}}</b></td></tr>
            <tr><td class="print-no-border">Mã số thuế: {{store_tax_code}}</td></tr>
            <tr><td class="print-no-border">Địa chỉ: {{store_address}}</td></tr>
            <tr><td class="print-no-border">Điện thoại: {{store_phone_number}}</td></tr>

            </tbody>
          </table>
          <hr>
          <table style="width:100%">

            <tbody>
            <tr><td class="print-no-border">Họ tên người mua hàng: <b>
              <span>{{trade.customer_name}}</span>
            </b></td></tr>
            <tr><td class="print-no-border">Mã số thuế: </td></tr>
            <tr><td class="print-no-border">Địa chỉ:
              <span>{{trade.customer_address}}</span>
            </td></tr>
            <tr><td class="print-no-border">Điện thoại:
              <span>{{trade.customer_phone}}</span>
            </td></tr>

            </tbody>
          </table>
        </div>
        <br>
        <div id="print-table-border">
          <table style="width:100%">

            <tbody>
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
              <td class="print-text-right">{{currencyFormat(item.price_sell)}}</td>
              <td class="print-text-right">{{currencyFormat(item.quantity)}}</td>
              <td class="print-text-right">{{currencyFormat(item.amount_sell)}}</td>
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
            <tr v-show="trade.discount_amount && parseInt(trade.discount_amount) > 0">
              <td colspan="5">Khuyến mãi</td>
              <td class="print-text-right">-{{currencyFormat(trade.discount_amount)}}</td>
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

            </tbody>

          </table>
          <br>
          <div>
            <table style="width:100%">

              <tbody>
              <tr>
                <td colspan="3" class="print-text-center print-no-border">Người mua hàng</td>
                <td colspan="3" class="print-text-center print-no-border">Người bán hàng</td>
              </tr>
              <tr>
                <td colspan="3" class="print-text-center print-no-border">(Ký, ghi rõ họ tên)</td>
                <td colspan="3" class="print-text-center print-no-border">(Ký, đóng dấu, ghi rõ họ tên)</td>
              </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!--Mẫu in hoá đơn 2-->
    <div hidden id="compactInvoice">
      <div class="w-full px-2">
        <div>
          <h2 class="print-text-center">{{store_name}}</h2>
          <p class="print-text-center">{{store_address}}</p>
          <p class="print-text-center">{{store_phone_number}}</p>
        </div>

        <h4 class="print-text-center">HOÁ ĐƠN BÁN HÀNG{{suffix_print_title}}</h4>
        <p class="print-text-center">Số HĐ: {{trade.bill_number}}</p>
        <br>
        <p>Ngày: {{today_day}}-{{today_month}}-{{today_year}}</p>
        <p>Khách hàng: {{trade.customer_name}}</p>

        <div>
          <div>
            <div style="margin-top:10px;display:flex;width:100%;border-top:1px solid #555555;border-bottom:1px solid #555555">
              <div style="width:33%;text-align:center;font-size:13;">
                  Số lượng
                </div>
                <div style="width:33%;text-align:center;font-size:13;">
                  Đơn giá
                </div>
                <div style="width:33%;text-align:center;font-size:13;">
                  Thành tiền
                </div>
            </div>
            <div style="border-top:1px dotted #555555;width:100%;display:flex;flex-direction:row;flex-wrap:wrap"
              v-for="(item, index) in trade.products" :key="item.product_id">
               <div style="font-size:13;">
                {{index + 1}}. {{item.product_name}}
               </div>
                <div style="display:flex;width:100%">
                 <div style="width:33.3%;text-align:center;font-size:13;" >
                    {{currencyFormat(item.quantity)}}
                </div>
                 <div style="width:33.3%;text-align:end;font-size:13;" >
                    {{currencyFormat(item.price_sell)}}
                 </div>
                 <div style="width:33.3%;text-align:end;font-size:13;" >
                    {{currencyFormat(item.amount_sell)}}
                 </div>
               </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555">
                <div style="width:66.6%;font-size:13;">
                  Tổng tiền sản phẩm
                </div>
                <div style="width:33.3%;text-align:right;font-size:13;">
                  {{currencyFormat(trade.sub_total)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555"
              v-show="trade.extra_fee && parseInt(trade.extra_fee) > 0">
                <div style="width:66.6%;font-size:13;">
                  Chi phí khác
                </div>
                <div style="width:33.3%;text-align:right;font-size:13;">
                  +{{currencyFormat(trade.extra_fee)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555"
                 v-show="trade.fixed_discount && parseInt(trade.fixed_discount) > 0">
                <div style="width:66.6%;font-size:13;">
                  Giảm giá
                </div>
                <div style="width:33.3%;text-align:right;font-size:13;">
                  -{{currencyFormat(trade.fixed_discount)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555"
              v-show="trade.discount_amount && parseInt(trade.discount_amount) > 0">
                <div style="width:66.6%;font-size:13;">
                  Khuyến mãi
                </div>
                <div style="width:33.3%;text-align:right;font-size:13;">
                  -{{currencyFormat(trade.discount_amount)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555"
              v-show="trade.vat_value && parseInt(trade.vat_value) > 0">
                <div style="width:66.6%;font-size:13;">
                  VAT ({{trade.vat_percent}}%)
                </div>
                <div style="width:33.3%;text-align:right;font-size:13;">
                  +{{currencyFormat(trade.vat_value)}}
                </div>
            </div>
            <div style="display:flex;width:100%;border-top:1px solid #555555">
                <div style="width:66.6%;font-size:13;">
                  Thành tiền
                </div>
                <div style="width:33.3%;text-align:right;font-size:13;">
                  <b>{{currencyFormat(trade.total)}}</b>
                </div>
            </div>
            <br>
            <div>
              <p style="text-align:center;font-size:13;">Cảm ơn quý khách và hẹn gặp lại!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Modal tìm kiếm sản phẩm -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="modalStates.searchProduct" class="modal-overlay" @click="hideModalSearchProduct">
          <div class="modal-container modal-xl" @click.stop>
            <div class="modal-header">
              <h4 class="modal-title text-success">Tìm kiếm sản phẩm</h4>
              <button @click="hideModalSearchProduct" class="modal-close-button">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="modal-body modal-scroll">

        <div class="form-row">
          <div class="w-full md:w-1/4 px-2 mt-2" >
            <label>Nhóm sản phẩm </label>
            <multiselect
              v-model="productGroupSearchSelect"
              :options="productGroupOptions"
              :loading="loadingGetOptions"
              placeholder="--Chọn nhóm sản phẩm--"
              label="name"
              track-by="name"
              @input="changeProductGroupSearch"
              @select="changeProductGroupSearch">
            </multiselect>
          </div>

          <div class="w-full md:w-1/4 px-2 mt-2" >
            <label>Loại sản phẩm </label>
            <multiselect
              v-model="productTypeSearchSelect"
              :options="productTypeSearchOptions"
              :loading="loadingGetOptions"
              placeholder="--Chọn loại sản phẩm--"
              label="name"
              track-by="name"
              @input="changeProductTypeSearch"
              @select="changeProductTypeSearch">
            </multiselect>
          </div>

          <div class="w-full md:w-1/4 px-2 mt-2" >
            <label>Mã sản phẩm </label>
            <input
              id="codeProductCus"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="productSearch.code"
              maxlength="255">
          </div>

          <div class="w-full md:w-1/4 px-2 mt-2" >
            <label>Tên sản phẩm </label>
            <input
              id="nameProductCus"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="productSearch.name"
              maxlength="255">
          </div>
        </div>

        <div class="mt-2">
          <div class="w-full px-2">
            <button class="btn btn-outline-secondary float-left btn-width-120"  @click.prevent="hideModalSearchProduct">
              Quay lại
            </button>

            <button class="btn btn-outline-primary float-right btn-width-120"  :disabled="onSearchProduct"
                      @click.prevent="searchProduct">
              Tìm Kiếm
            </button>
          </div>
        </div>

        <div class="mt-2">
          <div class="w-full px-2">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th v-for="field in productSearchFields" :key="field.key">{{ field.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in productSearchItems" :key="index">
                  <td v-for="field in productSearchFields" :key="field.key">
                    <template v-if="field.key === 'actions'">
                      <button class="btn btn-outline-success float-right btn-width-120"
                        @click.prevent="chooseProduct(item.product_id)">
                        Chọn
                      </button>
                    </template>
                    <template v-else>
                      {{ item[field.key] }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-3">
          <div class="w-full px-2">
            <span>--Hết--</span>
          </div>
        </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!--Modal tìm kiếm khách hàng -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="modalStates.searchCustomer" class="modal-overlay" @click="hideModalSearchCustomer">
          <div class="modal-container modal-xl" @click.stop>
            <div class="modal-header">
              <h4 class="modal-title text-success">Tìm kiếm khách hàng</h4>
              <button @click="hideModalSearchCustomer" class="modal-close-button">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="modal-body modal-scroll">

      <div class="flex flex-wrap -mx-2">
        <div class="w-full md:w-1/2 px-2">
          <label>Tên </label>
          <input
            id="nameCusSearch"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="customerSearch.name"
            maxlength="75">
        </div>
        <div class="w-full md:w-1/2 px-2">
          <label>Số điện thoại </label>
          <input
            id="phoneNumberCus"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="customerSearch.phone"
            maxlength="11"
            @keyup="integerOnly($event.target)">
        </div>
      </div>

      <div class="mt-2">
        <div class="w-full px-2">
          <button class="btn btn-outline-secondary float-left btn-width-120"  @click.prevent="hideModalSearchCustomer">
            Quay lại
          </button>

          <button class="btn btn-outline-primary float-right btn-width-120"  :disabled="onSearchCustomer" @click.prevent="searchCustomer">
            Tìm Kiếm
          </button>
        </div>
      </div>

      <div class="mt-2">
        <div class="w-full px-2">
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th v-for="field in customerSearchFields" :key="field.key">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in customerSearchItems" :key="index">
                <td v-for="field in customerSearchFields" :key="field.key">
                  <template v-if="field.key === 'action'">
                    <button class="btn btn-outline-success float-right btn-width-120"
                      @click.prevent="chooseCustomer(item.id, item.name, item.phone_number, item.address, item.tax_code)">
                      Chọn
                    </button>
                  </template>
                  <template v-else>
                    {{ item[field.key] }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-3">
        <div class="w-full px-2">
          <span>--Hết--</span>
        </div>
      </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!--Modal thêm khách hàng -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="modalStates.addCustomer" class="modal-overlay" @click="backCustomer">
          <div class="modal-container modal-lg" @click.stop>
            <div class="modal-header">
              <h4 class="modal-title text-success">Thêm khách hàng</h4>
              <button @click="backCustomer" class="modal-close-button">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="modal-body modal-scroll">

      <div class="form-row">
        <div class="w-full md:w-1/4 px-2 mt-2" >
          <label>Loại khách hàng </label>
        </div>
        <div class="w-full md:w-3/4 px-2">
          <div class="input-group">
            <input type="radio" v-model="customer.type" name="type" value="0" class="mt-2"><label class="ml-4 mt-1">Cá nhân</label>
            <input type="radio" v-model="customer.type" name="type" value="1" class="ml-5 mt-2"><label class="ml-4 mt-1">Công ty</label>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="w-full md:w-1/4 px-2 mt-2" >
          <label>Tên </label><span class="error-sybol"></span>
        </div>
        <div class="w-full md:w-3/4 px-2">
          <input
            id="nameCus"
            type="text"
            class="form-control"
            v-model="customer.name"
            autocomplete="new-password"
            maxlength="75">
        </div>
      </div>

      <div class="form-row">
        <div class="w-full md:w-1/4 px-2 mt-2" >
          <label>Số Điện Thoại </label><span class="error-sybol"></span>
        </div>
        <div class="w-full md:w-3/4 px-2">
          <input
            id="phoneCuss"
            type="text"
            class="form-control"
            v-model="customer.phone_number"
            @keyup="integerOnly($event.target)"
            autocomplete="new-password"
            maxlength="20"
            v-on:change="checkPhoneNumberFormat($event.target.value)">
        </div>
      </div>

      <div class="form-row">
        <div class="w-full md:w-1/4 px-2 mt-2" >
          <label>Giới Tính</label>
        </div>
        <div class="w-full md:w-3/4 px-2">
          <select class="form-control" v-model="customer.gender">
            <option value="">-- Chọn giới tính --</option>
            <option v-for="option in optionsGender" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="w-full md:w-1/4 px-2 mt-2" >
          <label>Ngày Tháng Năm Sinh</label>
        </div>
        <div class="w-full md:w-3/4 px-2">
          <datepicker
            :modelValue="customer.birthday ? parseDate(customer.birthday) : null"
            @update:modelValue="customer.birthday = $event ? formatDate($event) : null"
            format="yyyy-MM-dd"
            :typeable="true"
            placeholder="yyyy-MM-dd"
            input-class="datepicker-cus"
          ></datepicker>
        </div>
      </div>

      <div class="form-row">
        <div class="w-full md:w-1/4 px-2 mt-2" >
          <label>Tỉnh/ Thành Phố</label>
        </div>
        <div class="w-full md:w-3/4 px-2">
          <select class="form-control form-control"
            id="city_id"
            v-model="customer.city_id"
            v-on:change="changeCity($event.target)"
          >
            <option value="">-- Chọn tỉnh/thành phố --</option>
            <option v-for="option in optionsCity" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="w-full md:w-1/4 px-2 mt-2" >
          <label>Quận/ Huyện</label>
        </div>
        <div class="w-full md:w-3/4 px-2">
          <select class="form-control form-control"
            id="district_id"
            v-model="customer.district_id"
            :disabled="!customer.city_id"
          >
            <option value="">-- Chọn quận/huyện --</option>
            <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="w-full md:w-1/4 px-2 mt-2" >
          <label>Địa chỉ </label>
        </div>
        <div class="w-full md:w-3/4 px-2">
          <input
            id="addressCus"
            type="text"
            class="form-control"
            v-model="customer.address"
            autocomplete="new-password"
            maxlength="255">
        </div>
      </div>

      <div class="form-row">
        <div class="w-full md:w-1/4 px-2 mt-2" >
          <label>Mã số thuế </label>
        </div>
        <div class="w-full md:w-3/4 px-2">
          <input
            id="tax_code"
            type="text"
            class="form-control"
            v-model="customer.tax_code"
            @keyup="integerOnly($event.target)"
            autocomplete="new-password"
            maxlength="20">
        </div>
      </div>

      <div class="mt-2">
        <div class="w-full px-2">
          <button class="btn btn-outline-secondary float-left btn-width-120"  @click="backCustomer">
            Hủy bỏ
          </button>
          <button class="btn float-right btn-width-120" v-show="!savingCustomer" variant="outline-success"
                     @click="saveCustomer"
                    :disabled="savingCustomer">
            Lưu
          </button>
          <div class="loading-more" v-show="savingCustomer">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>

        </div>
      </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!--Modal thao tác sau khi xác nhận mua -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="modalStates.actions" class="modal-overlay" @click="back">
          <div class="modal-container modal-lg" @click.stop>
            <div class="modal-header">
              <h4 class="modal-title text-success">Bán hàng thành công!</h4>
              <button @click="back" class="modal-close-button">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div class="text-center">
            <button class="btn btn-outline-secondary text-center btn-width-120" @click="back">
              Quay lại
            </button>
          </div>
          <div class="text-center">
            <button class="btn btn-outline-success text-center btn-width-120" @click="buyNext">
              Bán tiếp
            </button>
          </div>
          <div class="text-center">
            <button class="btn btn-outline-primary text-center btn-width-120" @click="printInvoice">
              In hóa đơn
            </button>
          </div>
        </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal apply pmt -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="modalStates.applyPmt" class="modal-overlay" @click="cancelApplyPmt">
          <div class="modal-container modal-xl" @click.stop>
            <div class="modal-header">
              <h5 class="modal-title text-success">Áp dụng khuyến mãi</h5>
              <button @click="cancelApplyPmt" class="modal-close-button">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="modal-body modal-scroll">

      <div class="flex flex-wrap -mx-2">

        <div class="w-full px-2">
          <div class="col-12" v-for="pmt in this.pmtOfStore" :key="pmt.id">
            <b>- </b> {{pmt.name}}<span v-if="pmt.code">({{pmt.code}})</span>
            <div class="d-inline-flex gap-2 ml-2">
              <button class="btn btn-sm btn-outline-primary" @click="plusQuantityPmt(pmt.id, pmt.type, pmt.remaining, pmt)">
                <i class="fa fa-plus"/>
              </button>
              <span class="px-2" style="min-width: 30px; text-align: center;" :id="'pmtStore' + pmt.id">0</span>
              <button class="btn btn-sm btn-outline-primary" @click="minusQuantityPmt(pmt.id, pmt)">
                <i class="fa fa-minus"/>
              </button>
            </div>
          </div>
        </div>

      </div>

      <div class="mt-4 flex justify-between">
        <button class="btn btn-secondary px-4" @click="cancelApplyPmt()">
          Hủy
        </button>

        <!-- Loading -->
        <div class="loading-more" v-show="loadingConfirmPmt">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <button v-show="!loadingConfirmPmt" class="btn btn-primary px-4"
                @click="confirmApplyPmt()">
          Xác nhận
        </button>
      </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!--Modal cảnh báo bán quá số lượng trong kho -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="modalStates.confirmSell" class="modal-overlay" @click="hideModalConfirmSell">
          <div class="modal-container modal-xl" @click.stop>
            <div class="modal-header">
              <h4 class="modal-title text-success">Sản phẩm bán vượt quá số lượng trong kho</h4>
              <button @click="hideModalConfirmSell" class="modal-close-button">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="modal-body modal-scroll">

      <div class="mt-2">
        <div class="w-full px-2">
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th v-for="field in productImportFields" :key="field.key">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in productNotEnoughQuantity" :key="index">
                <td v-for="field in productImportFields" :key="field.key">
                  {{ item[field.key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-between mt-4">
        <button class="btn btn-danger px-4" @click="hideModalConfirmSell">
          Hủy bán
        </button>
        <button class="btn btn-primary px-4" @click="save" :disabled="saving">
          Tiếp tục bán
        </button>
      </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>


<script>
import tradeApi from '@/api/trade'
import superAdminAPI from '@/api/superAdmin'
import customerApi from '@/api/customer'
import MasterApi from '@/api/master'
import settingAPI from "@/api/setting"
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useAuthStore } from '@/stores/auth'
import { parseISO, format } from 'date-fns'

export default {
  components: {
    Datepicker,
    Multiselect
  },
  setup() {
    const authStore = useAuthStore()

    return {
      authStore
    }
  },
  data () {
    return {
      loadingGetOptions: false,
      orderSelect: {},
      orderOptions: [],
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
        "order_id": null,
        "amount_paid_on_order": 0,
        "bill_number": null,
        "from_type": 0,
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
        "discount_amount": null,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "total_paid": null,
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
        "quantity_repo": null,
        "quantity": null,
        "amount_buy": null,
        "price_sell": null,
        "amount_sell": null,
        "properties": []
      },
      isShowPriceBuy: false,
      currentProperties: [], // TODO: chỉ lấy thuộc tính có trong kho
      propertiesChoosen: [],
      currentPropertiesRoot: [],
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
          key: 'product_code',
          label: 'Mã SP'
        },
        {
          key: 'product_name',
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
      pmtTemp: [],
      pmtOfStore: [],
      loadingConfirmPmt: false,
      productNotEnoughQuantity: [],
      productImportFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'product_name',
          label: 'Sản phẩm'
        },
        {
          key: 'quantity_repo',
          label: 'Số lượng kho'
        },
        {
          key: 'quantity',
          label: 'Số lượng bán'
        }
      ],
      orderProducts: [],
      invoiceTemplate: 'template_1',

      // Modal states
      modalStates: {
        searchProduct: false,
        searchCustomer: false,
        addCustomer: false,
        actions: false,
        applyPmt: false,
        confirmSell: false
      },

    }
  },
  created() {
    document.addEventListener('beforeunload', this.checkUpdateDraft())
    // Add escape key listener for closing modals
    document.addEventListener('keydown', this.handleEscapeKey)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscapeKey)
  },
  mounted() {
    // Get today day, month, year
    let dateNow = new Date()
    this.today_day = dateNow.getDate()
    this.today_month = dateNow.getMonth() + 1
    this.today_year = dateNow.getFullYear()

    let toDate = new Date()
    toDate.setDate(toDate.getDate() + 60)
    this.trade.appointment_date = this.formatDate(toDate)

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // Get trade detail
    this.getTradeDetail()

    // Get list promotion
    this.getPmtOfStore()

    // VAT
    // TODO

    // Get store info
    this.getStoreDetail()

    // Get print template
    this.getSettingByGroup()
  },
  methods: {

    /**
     * Parse date string safely for date-fns v2+
     */
    parseDate(dateString) {
      if (!dateString) return null

      try {
        // Handle string dates
        if (typeof dateString === 'string') {
          // Handle ISO date strings
          if (dateString.includes('T') || dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return parseISO(dateString)
          }
          // Handle other date formats
          return new Date(dateString)
        }

        // Return Date objects as-is
        if (dateString instanceof Date) {
          return isNaN(dateString.getTime()) ? null : dateString
        }

        // Convert other types to Date
        return new Date(dateString)
      } catch (error) {
        console.warn('Date parsing error:', error)
        return null
      }
    },

    /**
     * Format date safely
     */
    formatDate(date, formatString = 'yyyy-MM-dd') {
      if (!date) return ''

      try {
        const dateObj = date instanceof Date ? date : this.parseDate(date)
        if (!dateObj || isNaN(dateObj.getTime())) return ''
        return format(dateObj, formatString)
      } catch (error) {
        console.warn('Date formatting error:', error)
        return ''
      }
    },

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
     * Get city options
     */
    getOptionCity() {
      MasterApi.getCityOptions().then(res => {
        this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
        this.changeCity()
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
      this.modalStates.searchProduct = true
    },

    hideModalSearchProduct() {
      this.modalStates.searchProduct = false
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
    },

    getPmtOfStore() {
      // Call api get payment info
      tradeApi.getPmtOfStore().then(res => {
        if(res != null && res.data != null) {
          this.pmtOfStore = res.data.data

          this.setQuantityApplyForPromotionStore()
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    getSettingByGroup() {
      let params = {"group": "invoice_template"}
      settingAPI.getSettingByGroup(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let datas = res.data.data

          for (let i in datas) {
            if(datas[i].code == "invoice_template") {
              this.invoiceTemplate = datas[i].value
              break
            }
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      setQuantityApplyForPromotionStore() {
        if(this.pmtOfStore.length > 0) {
            if(this.trade.promotions.length > 0) {
              for(let i in this.pmtOfStore) {
                  for(let j in this.trade.promotions) {
                      if(this.trade.promotions[j].id == this.pmtOfStore[i].id) {
                          this.pmtOfStore[i].quantity_apply = this.trade.promotions[j].quantity_apply
                      }
                  }
                }
            } else {
                for(let i in this.pmtOfStore) {
                    this.pmtOfStore[i].quantity_apply = 0
                }
            }
        }
      },

      /**
     * Search
     */
    searchProduct() {
      this.productSearchItems = []

      if (this.onSearchProduct) { return }

      this.onSearchProduct = true

      let params = {
        "code": this.productSearch.code,
        "name": this.productSearch.name,
        "product_type_id": this.productSearch.product_type_id,
        "product_group_id": this.productSearch.product_group_id,
          "limit": 100,
          "offset": 0
      }

      tradeApi.searchProductWhenSell(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.productSearchItems = res.data.data
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

      this.modalStates.searchProduct = false
    },

    showModalAddCustomer() {
      this.modalStates.addCustomer = true
    },

    showModalSearchCustomer() {
      this.modalStates.searchCustomer = true
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
      this.modalStates.addCustomer = false
    },

    hideModalSearchCustomer() {
      this.modalStates.searchCustomer = false
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
      // Update trade data
      this.trade.customer_id = id
      this.trade.customer_name = name
      this.trade.customer_phone = phone_number
      this.trade.customer_address = address
      this.trade.customer_tax_code = tax_code

      // Update multiselect customerSelect to reflect the chosen customer
      this.customerSelect = {
        id: id,
        name: name,
        phone_number: phone_number,
        address: address,
        tax_code: tax_code
      }

      this.getCustomerItemById(this.trade.customer_id)

      this.modalStates.searchCustomer = false
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
            this.handleResponseTradeDetail(res.data.data)
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
        if(url.includes("trade-sell-from-order")) {
          let orderId = this.$route.params.orderId
          this.trade.order_id = orderId
          this.getOrderDetailById(orderId)
        }
      }
    },

    resetListProductType() {
      this.productTypeSelect = {}
      this.productTypeSearchSelect = {}
      this.productTypeOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))

      if(this.productTypeOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        this.productTypeOptions.unshift(itemEmpty)
      }
    },

    resetListProduct() {
      this.productSelect = {id: null, name: '', name_full: '-- Chọn sản phẩm --'}
      this.productOptions = JSON.parse(JSON.stringify(this.productOptionStore))

      if(this.productOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        itemEmpty.name_full = "-- Chọn sản phẩm --"
        this.productOptions.unshift(itemEmpty)
      }
    },

    getCustomerItemById(id) {
      for(let i in this.customerOptionStore) {
        if(this.customerOptionStore[i].id == id) {
          this.customerSelect = this.customerOptionStore[i]
          break
        }
      }
    },

    getOrderItemById(id) {
      for(let i in this.orderOptions) {
        if(this.orderOptions[i].id == id) {
          this.orderSelect = this.orderOptions[i]
          break
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
        "products": false,
        "product_repos": true,
        "customers": true,
        "citys": true,
        "orders": true
      }
      if(data) {
        params = data
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // orders
          if(params.orders) {
            this.orderOptions = options.orders
            this.orderOptions.unshift({"id": null, "name": '-- Chọn đơn đặt hàng --'})
            this.getOrderItemById(this.trade.order_id)
          }

          // product_groups
          if(params.product_groups) {
            this.productGroupOptions = options.product_groups
            let itemEmpty = {"id": null, "name": ""}
            this.productGroupOptions.unshift(itemEmpty)
          }

          // product_types
          if(params.product_types) {
            this.productTypeOptionStore = options.product_types
            this.productTypeSearchOptions = options.product_types
            this.resetListProductType()
          }

          // product_repos
          if(params.product_repos) {
            this.productOptionStore = options.product_repos
            this.resetListProduct()
            this.changeProductType(true)
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
        }
        this.loadingGetOptions = false
      }).catch(err => {
        this.loadingGetOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Event change product group
     */
    changeProductGroup(notReset) {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        this.currentProduct.product_group_id = this.productGroupSelect.id
        this.currentProduct.product_group_name = this.productGroupSelect.name

        // Reload list type by group
        this.productTypeOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.productGroupSelect.id == this.productTypeOptionStore[i].product_group_id) {
            this.productTypeOptions.push(this.productTypeOptionStore[i])
          }
        }
        if(this.productTypeOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          this.productTypeOptions.unshift(itemEmpty)
        }

        // Reload list product by group
        this.productOptions = []
        for (let i in this.productOptionStore) {
          if(this.currentProduct.product_type_id == this.productOptionStore[i].product_group_id) {
            this.productOptions.push(this.productOptionStore[i])
          }
        }
        if(this.productOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          itemEmpty.name_full = "-- Chọn sản phẩm --"
          this.productOptions.unshift(itemEmpty)
        }

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

    resetProductInfo() {
      // Create a new reactive object to ensure Vue 3 detects changes
      this.currentProduct = {
        ...this.currentProduct,
        price_buy: null,
        quantity_repo: null,
        quantity: null,
        amount_buy: null,
        price_sell: null,
        amount_sell: null,
        properties: []
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
        this.productOptions = []
        for (let i in this.productOptionStore) {
          if(this.currentProduct.product_type_id == this.productOptionStore[i].product_type_id) {
            this.productOptions.push(this.productOptionStore[i])
          }
        }
        if(this.productOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          itemEmpty.name_full = "-- Chọn sản phẩm --"
          this.productOptions.unshift(itemEmpty)
        }

        // Update properties
        this.currentProperties = []
        for (let i in this.productTypeOptionStore) {
          if(this.currentProduct.product_type_id == this.productTypeOptionStore[i].value
            && this.productTypeOptionStore[i].properties) {
            this.currentProperties = this.productTypeOptionStore[i].properties
            this.currentPropertiesRoot = this.productTypeOptionStore[i].properties_root
            break
          }
        }
        this.propertiesChoosen = []
        for (let i in this.currentProperties) {
          this.propertiesChoosen.push(this.currentProperties[i].name)
        }
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
                    this.currentProduct.quantity_repo = this.currencyFormat(properties_str.replace(properties_input_str, ""))
                }
            }
        }

      }
    },

  /**
     *  Event change product
     */
    changeProduct() {
      // Reset other info
      this.resetProductInfo()

      if(this.productSelect && this.productSelect.id) {
        // Create a new reactive object to ensure Vue 3 detects changes
        this.currentProduct = {
          ...this.currentProduct,
          product_id: this.productSelect.id,
          product_name: this.productSelect.name,
          product_code: this.productSelect.code,
          price_buy: this.currencyFormat(this.productSelect.price_buy),
          price_sell: this.currencyFormat(this.productSelect.price_sell),
          quantity_repo: this.currencyFormat(this.productSelect.quantity),
          properties: this.productSelect.properties ? [...this.productSelect.properties] : []
        }

        this.calQuantityRepo()

        let unit_name = this.productSelect.unit_name
        if(unit_name) {
          this.unit_name = "(Đơn vị: " + unit_name + ")"
        } else {
          this.unit_name = ""
        }

        // Chọn nhóm sp
        this.getProductGroupSelectedById(this.productSelect.product_group_id)
        this.currentProduct.product_group_id = this.productGroupSelect.id
        this.currentProduct.product_group_name = this.productGroupSelect.name

        // Chọn loại sp
        this.getProductTypeSelectedById(this.productSelect.product_type_id)
        this.currentProduct.product_type_id = this.productTypeSelect.id
        this.currentProduct.product_type_name = this.productTypeSelect.name
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
        this.authStore.removeToken()
        this.$router.push('/staff-login')
      }
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
        "phone": this.trade.customer_phone,
        "address": this.trade.customer_address
      }
      customerApi.updateCustomer(params).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', "Cập nhật thông tin khách hàng thành công!")

          if(this.customerSelect && this.customerSelect.id) {
            this.customerSelect.name = JSON.parse(JSON.stringify(this.trade.customer_name))
          }

          this.getOptionsRelated({"customers": true})
        }
      }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },

    /**
     *  Event change customer
     */
    changeCustomer() {
      if(this.customerSelect && this.customerSelect.id) {
        // Directly assign properties to trigger Vue 3 reactivity
        this.trade.customer_id = this.customerSelect.id
        this.trade.customer_name = this.customerSelect.name
        this.trade.customer_phone = this.customerSelect.phone_number
        this.trade.customer_address = this.customerSelect.address
        this.trade.customer_tax_code = this.customerSelect.tax_code
      } else {
        // Clear customer data
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
        "index": 0,
        "product_group_id": null,
        "product_group_name": null,
        "product_type_id": null,
        "product_type_name": null,
        "product_id": null,
        "product_name": null,
        "price_buy": null,
        "quantity_repo": null,
        "quantity": null,
        "amount_buy": null,
        "price_sell": null,
        "amount_sell": null,
        "properties": []
      }
    },

    refreshTradeInfo() {
      this.trade = {
        "id": null,
        "order_id": null,
        "amount_paid_on_order": 0,
        "bill_number": null,
        "from_type": 0,
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
        "discount_amount": null,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "total_paid": null,
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

    /**
     * Event change total paid
     */
    changeTotalPaid() {
      let total_paid = this.trade.total_paid.replaceAll(",", "")
      let total = this.trade.total.replaceAll(",", "")
      if(parseInt(total_paid) < total) {
        this.isShowApoimentPayment = true
      } else {
        this.isShowApoimentPayment = false
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
        amount += parseInt((this.trade.products[i].price_sell + '').replaceAll(",", "") * (this.trade.products[i].quantity + '').replaceAll(",", ""))
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
        if(this.trade.vat_percent == 0) {
          this.trade.vat_percent = 10
        }
        vat_value = parseInt((amount + parseInt(extra_fee) - parseInt(fixed_discount)) * this.trade.vat_percent / 100)
      } else {
        this.trade.vat_value = 0
      }
      this.trade.vat_value = this.currencyFormat(vat_value)

        let total = amount + parseInt(extra_fee) - parseInt(fixed_discount) + vat_value

      this.trade.total = this.currencyFormat(total)

      this.trade.total_paid = this.trade.total

      this.trade.cash = this.trade.total_paid
      this.trade.credit = 0
      this.trade.e_money = 0


        console.log("===")
        console.log(this.trade)


        this.updateDraft()
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

      if(!this.currentProduct.price_sell) {
          this.popToast('danger', "Vui lòng nhập giá bán sản phẩm")
          return

      }

      // Check price buy
      if (this.currentProduct.price_buy == null || this.currentProduct.price_buy == '') {
          this.currentProduct.price_buy = this.currentProduct.price_sell
      }

      // Check quantity
      if (this.currentProduct.quantity == null || this.currentProduct.quantity == '') {
        this.popToast('danger', "Vui lòng nhập số lượng sản phẩm bán")
        return
      }

      // // Check quantity bán và số lượng trong kho
      // let quantity_repo = (this.currentProduct.quantity_repo + "").replaceAll(",", "")
      // if (parseFloat(this.currentProduct.quantity) > parseFloat(quantity_repo)) {
      //   this.popToast('danger', "Không thể bán số lượng lớn hơn số lượng đang có trong kho")
      //   return
      // }
      this.currentProduct.price_buy = this.currentProduct.price_buy.replaceAll(",", "")
      this.currentProduct.quantity = this.currentProduct.quantity.replaceAll(",", "")
      this.currentProduct.quantity_repo = this.currentProduct.quantity_repo.replaceAll(",", "")
      this.currentProduct.amount_buy = parseInt(this.currentProduct.price_buy * this.currentProduct.quantity)


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

      // Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
      this.updateQuantityRepo(JSON.parse(JSON.stringify(this.currentProduct.product_id)), JSON.parse(JSON.stringify(this.currentProduct.quantity)), properties, 'sell')

      // Refresh current product
      this.refreshCurrentProduct()

      // Lưu nháp
      if(this.trade.id) {
        this.updateDraft()
      } else {
        this.saveDraft()
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
     * @param product_id
     * @param quantitySell
     * @param properties
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

    handleResponseTradeDetail (data) {
      this.trade = data

      // Format
      this.trade.sub_total = this.currencyFormat((this.trade.sub_total + '').replaceAll(",", ""))
      this.trade.total = this.currencyFormat((this.trade.total + '').replaceAll(",", ""))
      this.trade.extra_fee = this.currencyFormat((this.trade.extra_fee + '').replaceAll(",", ""))
      this.trade.fixed_discount = this.currencyFormat((this.trade.fixed_discount + '').replaceAll(",", ""))
      this.trade.total_paid = this.currencyFormat((this.trade.total_paid + '').replaceAll(",", ""))
      this.trade.cash = this.currencyFormat((this.trade.cash + '').replaceAll(",", ""))
      this.trade.credit = this.currencyFormat((this.trade.credit + '').replaceAll(",", ""))
      this.trade.e_money = this.currencyFormat((this.trade.e_money + '').replaceAll(",", ""))
      this.trade.discount_amount = this.currencyFormat((this.trade.discount_amount + '').replaceAll(",", ""))
      this.trade.vat_value = this.currencyFormat((this.trade.vat_value + '').replaceAll(",", ""))

      if(!this.trade.appointment_date) {
        let dateNow = new Date()
        let toDate = new Date()
        toDate.setDate(toDate.getDate() + 60)
        this.trade.appointment_date = this.formatDate(toDate)
        this.trade.forewarning = 30
      }

      this.setQuantityApplyForPromotionStore()

        this.setQuantityRepoForProduct()
    },

      setQuantityRepoForProduct() {
        if(this.orderProducts.length > 0) {
            for (let orderProduct of this.orderProducts) {
                for (let tradeProduct of this.trade.products) {
                    if(orderProduct.product_id == tradeProduct.product_id) {
                        tradeProduct.quantity_repo = orderProduct.quantity_repo
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
      data.amount_paid_on_order = (data.amount_paid_on_order + '').replaceAll(",", "")

      // Check products
      if(data.products.length == 0) {
        return
      }

      // Check loại tiền
      if(parseInt(data.total_paid) != parseInt(data.cash) + parseInt(data.credit) + parseInt(data.e_money)) {
        return
      }
      this.loadingConfirmPmt = true

      tradeApi.saveDraftSell(data).then(res => {
        if(res != null && res.data != null){

          if (res.data.status == 200) {
            this.handleResponseTradeDetail (res.data.data)


            this.popToast('success', "Lưu nháp thành công!")
            this.loadingConfirmPmt = false
            this.hideModalApplyPmt()
          }
        }
      }).catch(err => {
        this.loadingConfirmPmt = false

        // this.popToast('danger', "Lưu nháp thất bại!")
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
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
      data.amount_paid_on_order = (data.amount_paid_on_order + '').replaceAll(",", "")

      // Check products
      if(data.products.length == 0) {
        return
      }

      // Check loại tiền
      if(parseInt(data.total_paid) != parseInt(data.cash) + parseInt(data.credit) + parseInt(data.e_money)) {
        return
      }

      this.loadingConfirmPmt = true

        console.log("xxx")
        console.log(data)

      tradeApi.updateDraftSell(data).then(res => {
        if(res != null && res.data != null && res.data.data){
          this.handleResponseTradeDetail (res.data.data)

            this.popToast('success', "Lưu nháp thành công!")

          this.loadingConfirmPmt = false
          this.hideModalApplyPmt()
        }
      }).catch(err => {
        this.loadingConfirmPmt = false

          // this.popToast('danger', "Lưu nháp thất bại!")
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },

    checkUpdateDraft() {
      if(this.saveSuccess == false) {
        this.updateDraft()
      }
    },

    checkBeforeSell() {
      let products = this.trade.products
      this.productNotEnoughQuantity = []

        let stt = 1
      for (let product of products) {
        if(parseInt(product.quantity) > parseInt(product.quantity_repo)) {
          product.stt = stt
          this.productNotEnoughQuantity.push(product)
          stt += 1
        }
      }

      if(this.productNotEnoughQuantity.length > 0) {
        // Show modal cảnh báo bán quá số lượng trong kho
        this.modalStates.confirmSell = true
        return
      }
      this.save()
    },

    hideModalConfirmSell() {
      this.modalStates.confirmSell = false
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
        data.amount_paid_on_order = (data.amount_paid_on_order + '').replaceAll(",", "")

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

        tradeApi.tradeSell(data).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              this.popToast('success', 'Bán sản phẩm thành công!!! ')

              this.saveSuccess = true

              this.trade = res.data.data

              this.suffix_print_title = ""
              this.modalStates.actions = true
              this.modalStates.confirmSell = false

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
        this.popToast('danger', "Vui lòng chọn sản phẩm muốn bán")
        return
      }
      var mywindow = window.open('', 'PRINT', 'height=600,width=800');

      mywindow.document.write('<html><head><title> </title><style>');
      mywindow.document.write(' .print-text-center {text-align: center;} ');
      mywindow.document.write(' .print-text-left {text-align: left;} ');
      mywindow.document.write(' .print-text-right {text-align: right;} ');
      mywindow.document.write(' .print-width-50-left {width: 48%; float: left;} ');
      mywindow.document.write(' .print-width-50-right {width: 48%; float: right;} ');
      if(this.invoiceTemplate == 'template_1') {
        mywindow.document.write(' .print-border {border: black solid 1px;} ');
        mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ');
        mywindow.document.write(' #print-table-border > table, th, td {border: black solid 1px; border-collapse: collapse;} ');
        mywindow.document.write(' .print-border {border: black solid 1px; border-collapse: collapse;} ');
        mywindow.document.write(' .print-no-border {border: none;} ');

        mywindow.document.write('</style></head><body >');
        mywindow.document.write(document.getElementById('provisionalInvoice').innerHTML);
      } else {
        mywindow.document.write('</style></head><body >');
        mywindow.document.write(document.getElementById('compactInvoice').innerHTML);
      }
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
      this.$router.push("/trade-sell-his")
    },

    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
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

      deleteProduct(ind, product_id, quantity, properties) {
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

        // Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
        this.updateQuantityRepo(product_id, quantity, properties, 'delete')
      },

      deleteTrade(trade_id) {
        tradeApi.deleteTrade(trade_id).then(res => {
        }).catch(err => {
        })
      },

      buyNext() {
        this.productGroupSelect = {}
        this.productTypeSelect = {}
        this.getOptionsRelated({"product_repos": true})

        this.refreshCurrentProduct()

        this.customerSelect = {}
        this.refreshTradeInfo()

        this.modalStates.actions = false
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

    /**
     * Show modal apply pmt
     */
    showModalApplyPmt() {
      this.pmtTemp = JSON.parse(JSON.stringify(this.trade.promotions))

      this.modalStates.applyPmt = true


      setTimeout(this.updatePmtAllyToModal, 1000)
    },

    /**
     * Remove promotion
     */
    deletePromotion(id) {

      // Get index pmt by id
      let indexTemp = this.getPromotionIndexById(id)

      if(indexTemp !== false) {
        this.trade.promotions.splice(indexTemp, 1)

        // Lưu nháp
        if(this.trade.id) {
          this.updateDraft()
        } else {
          this.saveDraft()
        }
      }
    },

    /**
     * Get index by id
     */
    getPromotionIndexById(pmtId) {
      for(let i in this.trade.promotions) {
        if(this.trade.promotions[i].id == pmtId) {
          return i
        }
      }
      return false
    },

    updatePmtAllyToModal() {
        if(this.pmtTemp.length > 0 && this.pmtOfStore.length > 0) {
            for(let itemTemp of this.pmtTemp) {
                for(let itemStore of this.pmtOfStore) {
                    if(itemTemp.id == itemStore.id) {
                        document.getElementById("pmtStore" + itemTemp.id).innerHTML = itemTemp.quantity_apply
                    }
                }
            }
        }
      },

    hideModalApplyPmt() {
      this.modalStates.applyPmt = false
    },

    /**
     * Remove promotion temp
     */
    deletePromotionTemp(id) {
      // Get index pmt by id
      for(let i in this.pmtTemp) {
        if(this.pmtTemp[i].id == id) {
          this.pmtTemp.splice(i, 1)
          break
        }
      }
    },

    /**
     * Plus quantity pmt of store
     */
    plusQuantityPmt(pmtId, type, remaining, pmtInfo) {
      // Check system config
      let currentQuantity = this.getQuantityOfPmtApplyingById(pmtId)

      // Check remaining of pmt
      if(currentQuantity == parseInt(remaining)) {
        this.popToast('danger', 'Vượt quá số lượng còn lại của khuyến mãi')
        return
      }

      // Plus quantity
      let elementId = 'pmtStore' + pmtId
      this.plusOne(elementId)

      // Add pmt to list
      this.addPmtToList(pmtInfo)
    },

    /**
     * Minus quantity pmt of store
     */
    minusQuantityPmt(pmtId, pmtInfo) {
      let elementId = 'pmtStore' + pmtId

      let currentNumber = parseInt(document.getElementById(elementId).textContent)
      if(currentNumber > 0) {
        let nextIndex = currentNumber - 1
        document.getElementById(elementId).textContent = nextIndex

          if(nextIndex == 0) {
              this.deletePromotionTemp(pmtId)
          } else {
              for(let itemTemp of this.pmtTemp) {
                  if(itemTemp.id == pmtId) {
                      itemTemp.quantity_apply = nextIndex
                  }
              }
          }
      }
    },

    /**
     * Cancel apply promotion
     */
    cancelApplyPmt () {
      this.pmtTemp = []

      this.modalStates.applyPmt = false
    },


    /**
     * Confirm apply promotion
     */
    confirmApplyPmt () {
      // Call api confirm update payment
      this.trade.promotions = JSON.parse(JSON.stringify(this.pmtTemp))

      // Lưu nháp
      if(this.trade.id) {
        this.updateDraft()
      } else {
        this.saveDraft()
      }

    },

    /**
     * Plus 1 result
     */
    plusOne(id) {
      let currentNumber = document.getElementById(id).textContent
      document.getElementById(id).textContent = parseInt(currentNumber) + 1
    },

    /**
     * Minus 1 result
     */
    minusOne(id) {
      let currentNumber = document.getElementById(id).textContent
      if(parseInt(currentNumber) > 0) {
        document.getElementById(id).textContent = parseInt(currentNumber) - 1
      }
    },

    /**
     * Add pmt to list
     */
    addPmtToList(pmtInfo) {
      // Add pmt to temp list
      let flagCheckExistTemp = false
      for (let i = 0; i < this.pmtTemp.length; i++) {
        if(parseInt(this.pmtTemp[i].id) === parseInt(pmtInfo.id)) {
          this.pmtTemp[i].quantity_apply = parseInt(this.pmtTemp[i].quantity_apply) + 1
          flagCheckExistTemp = true
          break
        }
      }

      if(!flagCheckExistTemp) {
        let pmtTemp = pmtInfo
        pmtTemp.quantity_apply = 1
        this.pmtTemp.push(pmtTemp)
      }
    },

    /**
     * Get quantity of pmt applying by id
     */
    getQuantityOfPmtApplyingById(pmtId) {
      let result = 0
      for (let index in this.trade.promotions) {
        if(parseInt(this.trade.promotions[index].id) === parseInt(pmtId)) {
          result = parseInt(this.trade.promotions[index].pmt_quantity)
        }
      }
      return result
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
     *  Event change order
     */
    changeOrder() {
      if(this.orderSelect && this.orderSelect.id) {
        // Call api, get order detail
        this.getOrderDetailById(this.orderSelect.id)
      }
    },

    getOrderDetailById(orderId) {
      if(orderId){
        this.loading = true

        tradeApi.getOrderDetail(orderId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            let order = res.data.data
            this.orderProducts = order.products

            // Update trade object reactively
            this.trade = {
              ...this.trade,
              order_id: order.id,
              amount_paid_on_order: this.currencyFormat(order.total_paid),
              customer_id: order.customer_id,
              customer_name: order.customer_name,
              customer_phone: order.customer_phone,
              customer_address: order.customer_address,
              customer_tax_code: order.customer_tax_code,
              products: order.products ? [...order.products] : [],
              promotions: order.promotions ? [...order.promotions] : []
            }

            this.getCustomerItemById(order.customer_id)
            this.getOrderItemById(order.id)

            this.calculateAmount()

            this.saveDraft()
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
     * Handle escape key to close modals
     */
    handleEscapeKey(event) {
      if (event.key === 'Escape') {
        if (this.modalStates.searchProduct) {
          this.hideModalSearchProduct()
        } else if (this.modalStates.searchCustomer) {
          this.hideModalSearchCustomer()
        } else if (this.modalStates.addCustomer) {
          this.backCustomer()
        } else if (this.modalStates.actions) {
          this.back()
        } else if (this.modalStates.applyPmt) {
          this.cancelApplyPmt()
        } else if (this.modalStates.confirmSell) {
          this.hideModalConfirmSell()
        }
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
