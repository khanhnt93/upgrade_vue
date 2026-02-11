<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-1/2 px-2">
                <button class="btn btn-outline-secondary pull-left btn-width-120" @click="back">
                  Quay lại
                </button>
              </div>
            </div>

            <div class="form-row">
              <div class="w-full px-2">
                <h4 class="mt-1 text-center text-header">Đặt Hàng</h4>
              </div>
            </div>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 bg-gray text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin người mua</span>
                  <span class="pull-right" v-show="showPartnerInfo" @click="showPartnerInfo = !showPartnerInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showPartnerInfo" @click="showPartnerInfo = !showPartnerInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
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
                    <div class="input-group">
                      <multiselect
                        v-model="customerSelect"
                        :options="customerOptionStore"
                        :loading="loadingGetOptions"
                        placeholder="--Chọn khách hàng--"
                        label="name"
                        track-by="name"
                        @input="changeCustomer">
                      </multiselect>

                      <button class="btn btn-outline-primary pull-right ml-2" @click="showModalSearchCustomer" >
                        <i class="fa fa-search"></i>
                      </button>

                      <button class="btn btn-outline-success pull-right ml-2" @click="showModalAddCustomer" >
                        <i class="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>
                      <span>Tên khách hàng<span class="error-sybol"></span></span>
                    </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>
                      <span>SĐT khách hàng<span class="error-sybol"></span></span>
                    </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>
                      <span>Địa chỉ khách hàng</span>
                    </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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
              <div class="w-full px-2 bg-info bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin sản phẩm</span>
                  <span class="pull-right" v-show="showProductInfo" @click="showProductInfo = !showProductInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showProductInfo" @click="showProductInfo = !showProductInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </div>
            </div>

            <div v-show="showProductInfo" class="mt-2">
              <div class="w-full px-2">

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Sản phẩm<span class="error-sybol"></span></label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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

                      <button class="btn btn-outline-primary pull-right ml-2" @click="showModalSearchProduct" >
                        <i class="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-row" v-show="currentProperties.length > 0">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Thuộc tính</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
                    <p v-for="(item) in currentProperties" :key="item.name">
                      <label :for="item.name">{{ item.name }}:
                        <span v-for="(value, index) in item.value" :key="value">
                          <input type="radio" :id="item.name + value" :value="value" :name="item.name" class="ml-2"
                                 :checked="index == 0">
                          <label :for="value" class="ml-1">{{value}}</label>
                        </span>
                      </label>
                    </p>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Đơn giá nhập</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
                    <div class="input-group">
                      <!--v-show="isShowPriceBuy"-->
                      <input
                        id="price_buy"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="currentProduct.price_buy"
                        @keyup="integerOnly($event.target)"
                        >
<!--                      <input-->
<!--                        v-show="!isShowPriceBuy"-->
<!--                        id="price_buy_show"-->
<!--                        type="text"-->
<!--                        maxlength="14"-->
<!--                        autocomplete="new-password"-->
<!--                        class="form-control"-->
<!--                        value="****"-->
<!--                        readonly>-->
<!--                      <button class="btn btn-outline-primary pull-right ml-2"  @click="isShowPriceBuy = !isShowPriceBuy" >-->
<!--                        <i v-show="!isShowPriceBuy" class="fa fa-eye" aria-hidden="true" title="Xem giá nhập"></i>-->
<!--                        <i v-show="isShowPriceBuy" class="fa fa-eye-slash" aria-hidden="true" title="Đóng giá nhập"></i>-->
<!--                      </button>-->
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Đơn giá bán<span class="error-sybol"></span></label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
                      <input
                        id="price_sell"
                        type="text"
                        maxlength="14"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="currentProduct.price_sell"
                        @keyup="integerOnly($event.target)"
                      @change="changePriceSell">
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Số lượng trong kho {{unit_name}}</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
                    <input
                      id="quantity_repo"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.quantity_repo"
                      readonly
                    >
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Số lượng đặt {{unit_name}}<span class="error-sybol"></span></label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
                    <input
                      id="quantity"
                      type="text"
                      maxlength="14"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="currentProduct.quantity"
                      @keyup="integerOnly($event.target)"
                    @change="changeQuantity">
                  </div>
                </div>

                <div class="mt-2">
                  <div class="w-full px-2 text-center">
                    <button class="btn btn-outline-primary text-center btn-width-120" @click="confirmBuyProduct">
                      Xác nhận
                    </button>
                  </div>
                </div>

                <div v-show="trade.products.length > 0" class="mt-2">
                  <div class="w-full px-2">
                    <h5>Danh sách sản phẩm đặt hàng</h5>
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
                      <td class="text-right">{{formatCurrency(item.price_sell)}}</td>
                      <td class="text-right">{{formatCurrency(item.quantity)}}</td>
                      <td class="text-right">{{formatCurrency(item.amount_sell)}}</td>
                      <td><i class="fa fa-trash" @click="deleteProduct(item.index, item.product_id, item.quantity, item.properties)" /></td>
                    </tr>
                    </tbody>
                  </table>
                  </div>
                </div>

              </div>
            </div>

            <div class="mt-3">
              <div class="w-full px-2 bg-success bg-gradient text-white title-partner">
                <h5>
                  <span class="pull-left">Thông tin thanh toán</span>
                  <span class="pull-right" v-show="showPaymentInfo" @click="showPaymentInfo = !showPaymentInfo"><i class="fa fa-angle-double-up" /></span>
                  <span class="pull-right" v-show="!showPaymentInfo" @click="showPaymentInfo = !showPaymentInfo"><i class="fa fa-angle-double-down" /></span>
                </h5>
              </div>
            </div>

            <div class="mt-2" v-show="showPaymentInfo">
              <div class="w-full px-2">
                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Tổng tiền sản phẩm</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Chi phí thêm</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Số tiền giảm</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Khuyến mãi</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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
                      <button class="btn btn-outline-success pull-right ml-2" @click="showModalApplyPmt" >
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Thuế VAT</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Thành tiền<span class="error-sybol"></span></label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Số tiền đã thanh toán</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
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

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Ngày hẹn lấy hàng</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 mt-2">
                    <datepicker v-model="trade.appointment_date" format="yyyy-MM-dd" :typeable="true"
                                placeholder="2022-12-31" input-class="datepicker-cus" ></datepicker>
                  </div>
                </div>

                <div class="form-row" v-show="parseInt(trade.total_paid) > 0">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Loại tiền thanh toán</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2 pl-2">

                    <div class="form-row">
                      <div class="w-full md:w-1/4 px-2 mt-2">
                        <label> Tiền mặt </label>
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
                      <div class="w-full md:w-1/4 px-2 mt-2">
                        <label> Chuyển khoản </label>
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
                      <div class="w-full md:w-1/4 px-2 mt-2">
                        <label> Tiền điện tử </label>
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
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
              <div class="w-full px-2 text-center">
                <button v-show="!saving" class="btn btn-outline-success" style="height: 50px; width: 240px" @click="save"
                          :disabled="saving || !this.trade.id">
                  <i class="fa fa-pencil-square-o" style="margin-right: 5px" />
                  Xác Nhận Đặt Hàng
                </button>
                <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!--Modal tìm kiếm sản phẩm -->
      <!-- Modal Search Product -->
      <TransitionRoot :show="showModalSearchProduct" as="template">
        <Dialog @close="showModalSearchProduct = false" class="relative z-50">
          <!-- Backdrop -->
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/30" />
          </TransitionChild>

          <!-- Modal Panel -->
          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="ease-in duration-200"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-6xl bg-white rounded-lg shadow-xl p-6">
                  <DialogTitle class="text-center text-success text-xl font-semibold mb-4">
                    Tìm kiếm sản phẩm
                  </DialogTitle>
                  <hr>

                  <div class="form-row">
                    <div class="w-full md:w-1/4 px-2 mt-2">
                      <label> Nhóm sản phẩm </label>
                      <multiselect
                        v-model="productGroupSearchSelect"
                        :options="productGroupOptions"
                        :loading="loadingGetOptions"
                        placeholder="--Chọn nhóm sản phẩm--"
                        label="name"
                        track-by="name"
                        @input="changeProductGroupSearch">
                      </multiselect>
                    </div>

                    <div class="w-full md:w-1/4 px-2 mt-2">
                      <label> Loại sản phẩm </label>
                      <multiselect
                        v-model="productTypeSearchSelect"
                        :options="productTypeSearchOptions"
                        :loading="loadingGetOptions"
                        placeholder="--Chọn loại sản phẩm--"
                        label="name"
                        track-by="name"
                        @input="changeProductTypeSearch">
                      </multiselect>
                    </div>

                    <div class="w-full md:w-1/4 px-2 mt-2">
                      <label> Mã sản phẩm </label>
                      <input
                        id="codeProductCus"
                        type="text"
                        autocomplete="new-password"
                        class="form-control"
                        v-model="productSearch.code"
                        maxlength="255">
                    </div>

                    <div class="w-full md:w-1/4 px-2 mt-2">
                      <label> Tên sản phẩm </label>
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
                      <button class="btn btn-outline-secondary pull-left btn-width-120" @click.prevent="hideModalSearchProduct">
                        Quay lại
                      </button>

                      <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearchProduct"
                                @click.prevent="searchProduct">
                        Tìm Kiếm
                      </button>
                    </div>
                  </div>

                  <div class="mt-2">
                    <div class="w-full px-2">
                      <div class="overflow-x-auto">
                        <table class="table table-bordered table-hover w-full">
                          <thead>
                            <tr>
                              <th v-for="field in productSearchFields" :key="field.key">{{ field.label }}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in productSearchItems" :key="item.product_id">
                              <td v-for="field in productSearchFields" :key="field.key">
                                <template v-if="field.key === 'actions'">
                                  <button class="btn btn-outline-success pull-right btn-width-120"
                                    @click.prevent="chooseProduct(item.product_group_id, item.product_group_name,
                                    item.product_type_id, item.product_type_name, item.product_id, item.product_name)">
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
                  </div>

                  <div class="mt-3">
                    <div class="w-full px-2">
                      <span>--Hết--</span>
                    </div>
                  </div>

                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

    <!--Modal tìm kiếm khách hàng -->
    <TransitionRoot :show="showModalSearchCustomer" as="template">
      <Dialog @close="showModalSearchCustomer = false" class="relative z-50">
        <!-- Backdrop -->
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <!-- Modal Panel -->
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-6xl bg-white rounded-lg shadow-xl p-6">
                <DialogTitle class="text-center text-success text-xl font-semibold mb-4">
                  Tìm kiếm khách hàng
                </DialogTitle>
                <hr>

                <div class="flex flex-wrap -mx-2">
                  <div class="w-full md:w-1/2 px-2">
                    <label> Tên </label>
                    <input
                      id="nameCusSearch"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      v-model="customerSearch.name"
                      maxlength="75">
                  </div>
                  <div class="w-full md:w-1/2 px-2">
                    <label> Số điện thoại </label>
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
                    <button class="btn btn-outline-secondary pull-left btn-width-120" @click.prevent="hideModalSearchCustomer">
                      Quay lại
                    </button>

                    <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearchCustomer" @click.prevent="searchCustomer">
                      Tìm Kiếm
                    </button>
                  </div>
                </div>

                <div class="mt-2">
                  <div class="w-full px-2">
                    <div class="overflow-x-auto">
                      <table class="table table-bordered table-hover w-full">
                        <thead>
                          <tr>
                            <th v-for="field in customerSearchFields" :key="field.key">{{ field.label }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in customerSearchItems" :key="item.id">
                            <td v-for="field in customerSearchFields" :key="field.key">
                              <template v-if="field.key === 'action'">
                                <button class="btn btn-outline-success pull-right btn-width-120"
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
                </div>

                <div class="mt-3">
                  <div class="w-full px-2">
                    <span>--Hết--</span>
                  </div>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!--Modal thêm khách hàng -->
    <TransitionRoot :show="showModalAddCustomer" as="template">
      <Dialog @close="showModalAddCustomer = false" class="relative z-50">
        <!-- Backdrop -->
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <!-- Modal Panel -->
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6">
                <DialogTitle class="text-center text-success text-xl font-semibold mb-4">
                  Thêm khách hàng
                </DialogTitle>
                <hr>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Loại khách hàng </label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <div class="input-group">
                      <input type="radio" v-model="customer.type" name="type" value="0" class="mt-2"><label class="ml-4 mt-1">Cá nhân</label>
                      <input type="radio" v-model="customer.type" name="type" value="1" class="ml-5 mt-2"><label class="ml-4 mt-1">Công ty</label>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Tên<span class="error-sybol"></span> </label>
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Số Điện Thoại<span class="error-sybol"></span> </label>
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Giới Tính</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <select class="form-select" :options="optionsGender" v-model="customer.gender"></select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Ngày Tháng Năm Sinh</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <datepicker v-model="customer.birthday" format="yyyy-MM-dd" :typeable="true"
                                  placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Tỉnh/ Thành Phố</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <select class="form-select form-control"
                      id="city_id"
                      :options="optionsCity"
                      v-model="customer.city_id"
                      type="text"
                      v-on:change="changeCity($event.target)"
                    ></select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label>Quận/ Huyện</label>
                  </div>
                  <div class="w-full md:w-3/4 px-2">
                    <select class="form-select form-control"
                      id="district_id"
                      :options="optionsDistrict"
                      v-model="customer.district_id"
                      type="text"
                      :disabled="!customer.city_id"
                    ></select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Địa chỉ </label>
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
                  <div class="w-full md:w-1/4 px-2 mt-2">
                    <label> Mã số thuế </label>
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
                    <button class="btn btn-outline-secondary pull-left btn-width-120" @click="backCustomer">
                      Hủy bỏ
                    </button>
                    <button v-show="!savingCustomer" class="btn btn-outline-success pull-right btn-width-120" @click="saveCustomer"
                              :disabled="savingCustomer">
                      Lưu
                    </button>
                    <span class="loading-more" v-show="savingCustomer"><icon name="loading" width="60" /></span>

                  </div>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal apply pmt -->
    <TransitionRoot :show="showModalApplyPmt" as="template">
      <Dialog @close="showModalApplyPmt = false" class="relative z-50">
        <!-- Backdrop -->
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <!-- Modal Panel -->
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-6xl bg-white rounded-lg shadow-xl p-6">
                <DialogTitle class="text-center text-xl font-semibold mb-4">
                  Áp dụng khuyến mãi
                </DialogTitle>
                <hr>

                <div class="flex flex-wrap -mx-2">

                  <div class="w-full px-2">
                    <div class="col-12" v-for="pmt in this.pmtOfStore" :key="pmt.id">
                      <p><b>- </b> {{pmt.name}}<span v-if="pmt.code">({{pmt.code}})</span></p>
                      <div class="flex items-center gap-2 mt-2">
                        <button class="btn btn-sm btn-outline-primary px-2 py-1" @click="plusQuantityPmt(pmt.id, pmt.type, pmt.remaining, pmt)">
                          <i class="fa fa-plus"/>
                        </button>
                        <div class="px-3 py-1 border rounded">
                          <span :id="'pmtStore' + pmt.id">0</span>
                        </div>
                        <button class="btn btn-sm btn-outline-primary px-2 py-1" @click="minusQuantityPmt(pmt.id, pmt)">
                          <i class="fa fa-minus"/>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                <div class="mt-2">
                  <div class="w-1/2 px-2">
                    <button class="btn btn-secondary pull-left px-4" @click="cancelApplyPmt()">
                      Hủy
                    </button>
                  </div>
                  <div class="w-1/2 px-2">
                    <!-- Loading -->
                    <span class="loading-more" v-show="loadingConfirmPmt"><icon name="loading" width="60" /></span>

                    <button v-show="!loadingConfirmPmt" class="btn btn-primary pull-right px-4 default-btn-bg"
                            @click="confirmApplyPmt()">
                      Xác nhận &nbsp;
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
import orderApi from '@/api/order'
import customerApi from '@/api/customer'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import productApi from '@/api/product'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'
import { useFormatters } from '@/composables/useFormatters'

export default {
  components: {
    Datepicker,
    Multiselect,
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild
  },
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    const route = useRoute()
    const { formatCurrency } = useFormatters()

    return {
      toast,
      router,
      route,
      formatCurrency
    }
  },
  data () {
    return {
      loadingGetOptions: false,
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
      trade: {
        "id": null,
        "order_number": null,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_address": null,
        "customer_tax_code": null,
        "sub_total": 0,
        "extra_fee": null,
        "fixed_discount": null,
        "discount_amount": 0,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "total_paid": 0,
        "cash": null,
        "credit": null,
        "e_money": null,
        "description": null,
        "products": [],
        "promotions": [],
        "appointment_date": null,
        "status": 0
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
      // currentPropertiesRoot: [],
      unit_name: "",
      saving: false,
      loading: false,
      showPartnerInfo: true,
      showProductInfo: true,
      showPaymentInfo: true,
      saveSuccess: false,
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
      pmtApplying: [],
      pmtOfStore: [],
      loadingConfirmPmt: false,
      // Modal states for HeadlessUI
      showModalSearchProduct: false,
      showModalSearchCustomer: false,
      showModalAddCustomer: false,
      showModalAddProduct: false,
      showModalApplyPmt: false,

    }
  },
  created() {
    document.addEventListener('beforeunload', this.checkUpdateDraft())
  },
  mounted() {
    // Get today day, month, year
    let dateNow = new Date()

    let toDate = new Date(dateNow.setDate(dateNow.getDate() + 3))
    this.trade.appointment_date = toDate.toJSON().slice(0,10)

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // Get order detail
    this.getTradeDetail()

    // Get list promotion
    this.getPmtOfStore()
  },
  methods: {

    /**
     * Make toast without title
     */
    popToast(content, variant) {
      this.toast(content, variant === 'danger' ? 'error' : variant)
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
      this.showModalSearchProduct = true
    },

    hideModalSearchProduct() {
      this.showModalSearchProduct = false
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
      this.showModalAddProduct = false
    },

    getPmtOfStore() {
      // Call api get payment info
      orderApi.getPmtOfStore().then(res => {
        if(res != null && res.data != null) {
          this.pmtOfStore = res.data.data

          this.setQuantityApplyForPromotionStore()
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast(errorMess, 'error')
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
        "product_group_id": this.productSearch.product_group_id
      }

        productApi.searchProductByStaff(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.productSearchItems = res.data.data
        } else {
          this.productSearchItems = []
        }
        this.onSearchProduct = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)

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

      this.showModalSearchProduct = false
    },

    showModalAddCustomer() {
      this.showModalAddCustomer = true
    },

    showModalSearchCustomer() {
      this.showModalSearchCustomer = true
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
      this.showModalAddCustomer = false
    },

    hideModalSearchCustomer() {
      this.showModalSearchCustomer = false
    },

    saveCustomer() {
      // Check validate
      if(!this.customer.type) {
        this.popToast('error', "Vui lòng chọn loại khách hàng")
        return
      }
      if(!this.customer.name) {
        this.popToast('error', "Vui lòng nhập tên khách hàng")
        return
      }
      if(!this.customer.phone_number) {
        this.popToast('error', "Vui lòng nhập số điện thoại khách hàng")
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
        this.popToast('error', errorMess)
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
        this.popToast('error', errorMess)

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

      this.showModalSearchCustomer = false
    },

      /**
     *  Get detail
     */
    getTradeDetail() {
      let orderId = this.route.params.id
      if(orderId){
        this.loading = true

        orderApi.getDetailOrder(orderId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.handleResponseTradeDetail(res.data.data)
          }

          this.loading = false

        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
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
        if(id) {
            for(let i in this.customerOptionStore) {
                if(this.customerOptionStore[i].id == id) {
                    this.customerSelect = this.customerOptionStore[i]
                    break
                }
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
        "citys": true
      }
      if(data) {
        params = data
      }
      orderApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

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

          // products
          if(params.products) {
            this.productOptionStore = options.products
            this.resetListProduct()
            this.changeProductType(true)
          }

          // customers
          if(params.customers) {
            this.customerOptionStore = options.customers
            this.customerOptionStore.unshift({"id": null, "name": '-- Chọn khách hàng --'})
            this.customerSelect = this.customerOptionStore[0]
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
        this.popToast('error', errorMess)
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
          itemEmpty.name_full = ""
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
      this.currentProduct.price_buy = null
      this.currentProduct.quantity_repo = null
      this.currentProduct.quantity = null
      this.currentProduct.amount_buy = null
      this.currentProduct.price_sell = null
      this.currentProduct.amount_sell = null
      this.currentProduct.properties = []
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
          itemEmpty.name_full = ""
          this.productOptions.unshift(itemEmpty)
        }

        // Update properties
        this.currentProperties = []
        for (let i in this.productTypeOptionStore) {
          if(this.currentProduct.product_type_id == this.productTypeOptionStore[i].value
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

        this.currentProduct.price_buy = this.formatCurrency(this.productSelect.price_buy)
        this.currentProduct.price_sell = this.formatCurrency(this.productSelect.price_sell)
        this.currentProduct.quantity_repo = this.formatCurrency(this.productSelect.quantity)
        this.currentProduct.properties = this.productSelect.properties

        // this.calQuantityRepo()

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

    refreshOrderInfo() {
      this.trade = {
        "id": null,
        "order_number": null,
        "customer_id": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_address": null,
        "customer_tax_code": null,
        "sub_total": 0,
        "extra_fee": null,
        "fixed_discount": null,
        "discount_amount": 0,
        "have_vat": false,
        "vat_percent": 10,
        "vat_value": 0,
        "total": 0,
        "total_paid": 0,
        "cash": null,
        "credit": null,
        "e_money": null,
        "description": null,
        "products": [],
        "promotions": [],
        "appointment_date": null,
        "status": 0
      }
    },

    /**
     * Event change total paid
     */
    changeTotalPaid() {
      let total_paid = (this.trade.total_paid + "").replaceAll(",", "")
      this.trade.total_paid = this.formatCurrency(total_paid)

      this.trade.cash = this.trade.total_paid
      this.trade.credit = 0
      this.trade.e_money = 0
    },

      changeCash() {
          let cash = (this.trade.cash + '').replaceAll(",", "")
          this.trade.cash = this.formatCurrency(cash)
      },

      changeCredit() {
          let credit = (this.trade.credit + '').replaceAll(",", "")
          this.trade.credit = this.formatCurrency(credit)
      },

      changeEMoney() {
          let e_money = (this.trade.e_money + '').replaceAll(",", "")
          this.trade.e_money = this.formatCurrency(e_money)
      },

    /**
     * Tính toán thành tiền sản phẩm
     */
    calculateAmount() {
      var amount = 0
      for (let i in this.trade.products) {
        amount += parseInt((this.trade.products[i].price_sell + '').replaceAll(",", "") * (this.trade.products[i].quantity + '').replaceAll(",", ""))
      }
      this.trade.sub_total = this.formatCurrency(amount)

      let extra_fee = 0
      if(this.trade.extra_fee) {
          extra_fee = (this.trade.extra_fee + '').replaceAll(",", "")
          this.trade.extra_fee = this.formatCurrency(extra_fee)
      }

      let fixed_discount = 0
      if(this.trade.fixed_discount) {
          fixed_discount = (this.trade.fixed_discount + '').replaceAll(",", "")
          this.trade.fixed_discount = this.formatCurrency(fixed_discount)
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
      this.trade.vat_value = this.formatCurrency(vat_value)

        let total = amount + parseInt(extra_fee) - parseInt(fixed_discount) + vat_value

      this.trade.total = this.formatCurrency(total)

        if(this.trade.total_paid) {
            let total_paid = (this.trade.total_paid + '').replaceAll(",", "")
            if(parseInt(total_paid) > parseInt(total)) {
                this.trade.total_paid = JSON.parse(JSON.stringify(this.trade.total))

                this.trade.cash = this.trade.total_paid
                this.trade.credit = 0
                this.trade.e_money = 0
            }
        } else {
            this.trade.total_paid = 0
            this.trade.cash = 0
            this.trade.credit = 0
            this.trade.e_money = 0
        }

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
        this.popToast('error', "Vui lòng chọn nhóm sản phẩm")
        return
      }

      // Check product type
      if (!this.currentProduct.product_type_id) {
        this.popToast('error', "Vui lòng chọn loại sản phẩm")
        return
      }

      // Check product
      if (!this.currentProduct.product_id) {
        this.popToast('error', "Vui lòng chọn sản phẩm")
        return
      }

      // Check price sell
      if (this.currentProduct.price_sell == null || this.currentProduct.price_sell == '') {
        this.popToast('error', "Vui lòng nhập [đơn giá bán] sản phẩm")
        return
      }

      // Check quantity
      if (this.currentProduct.quantity == null || this.currentProduct.quantity == '') {
        this.popToast('error', "Vui lòng nhập số lượng sản phẩm bán")
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

      // Check thuộc tính sp
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

      propertiesToString(properties) {
        let result = ""
        for(let i in properties) {
            result += properties[i].value
        }
        return result
      },

    handleResponseTradeDetail (data) {
      this.trade = data

      // Format
      this.trade.sub_total = this.formatCurrency((this.trade.sub_total + '').replaceAll(",", ""))
      this.trade.total = this.formatCurrency((this.trade.total + '').replaceAll(",", ""))
      this.trade.extra_fee = this.formatCurrency((this.trade.extra_fee + '').replaceAll(",", ""))
      this.trade.fixed_discount = this.formatCurrency((this.trade.fixed_discount + '').replaceAll(",", ""))
      this.trade.total_paid = this.formatCurrency((this.trade.total_paid + '').replaceAll(",", ""))
      this.trade.cash = this.formatCurrency((this.trade.cash + '').replaceAll(",", ""))
      this.trade.credit = this.formatCurrency((this.trade.credit + '').replaceAll(",", ""))
      this.trade.e_money = this.formatCurrency((this.trade.e_money + '').replaceAll(",", ""))
      this.trade.discount_amount = this.formatCurrency((this.trade.discount_amount + '').replaceAll(",", ""))
      this.trade.vat_value = this.formatCurrency((this.trade.vat_value + '').replaceAll(",", ""))

      if(!this.trade.appointment_date) {
        let dateNow = new Date()
        let toDate = new Date(dateNow.setDate(dateNow.getDate() + 3))
        this.trade.appointment_date = toDate.toJSON().slice(0,10)
      }

      this.setQuantityApplyForPromotionStore()

      this.getCustomerItemById(this.trade.customer_id)
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
      data.discount_amount = (data.discount_amount + '').replaceAll(",", "")
      data.status = 0

      // Check products
      if(data.products.length == 0) {
          this.popToast('error', "Chưa có sản phẩm nào được chọn")
        return
      }

      // Check loại tiền
      if(parseInt(data.total_paid) != parseInt(data.cash) + parseInt(data.credit) + parseInt(data.e_money)) {
          this.popToast('error', "Tổng loại tiền phải bằng số tiền thanh toán")
        return
      }
      this.loadingConfirmPmt = true

      orderApi.saveDraft(data).then(res => {
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

        this.popToast('error', "Lưu nháp thất bại!")
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
      data.discount_amount = (data.discount_amount + '').replaceAll(",", "")
      data.status = 0

      // Check products
      if(data.products.length == 0) {
        this.popToast('error', "Chưa có sản phẩm nào được chọn")
        return
      }

      // Check loại tiền
      if(parseInt(data.total_paid) != parseInt(data.cash) + parseInt(data.credit) + parseInt(data.e_money)) {
        this.popToast('error', "Tổng loại tiền phải bằng số tiền thanh toán")
        return
      }

      this.loadingConfirmPmt = true

        console.log("xxx")
        console.log(data)

      orderApi.updateDraft(data).then(res => {
        if(res != null && res.data != null && res.data.data){
          this.handleResponseTradeDetail (res.data.data)

            this.popToast('success', "Lưu nháp thành công!")

          this.loadingConfirmPmt = false
          this.hideModalApplyPmt()
        }
      }).catch(err => {
        this.loadingConfirmPmt = false

          this.popToast('error', "Lưu nháp thất bại!")
      })
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

        /**
         * Validate
         */

        // Check customer
        if(!data.customer_name) {
            this.popToast('error', "Vui lòng nhập tên khách hàng")
            return
        }
        if(!data.customer_phone) {
            this.popToast('error', "Vui lòng nhập sđt khách hàng")
            return
        }

        // Check products
        if(data.products.length == 0) {
            this.popToast('error', "Chưa có sản phẩm nào được chọn")
          return
        }

        // Check loại tiền
        if(parseInt(data.total_paid) != parseInt(data.cash) + parseInt(data.credit) + parseInt(data.e_money)) {
          this.popToast('error', "Tổng loại tiền phải bằng số tiền thanh toán")
          return
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
        data.total_paid = (data.total_paid + '').replaceAll(",", "")
        data.cash = (data.cash + '').replaceAll(",", "")
        data.credit = (data.credit + '').replaceAll(",", "")
        data.e_money = (data.e_money + '').replaceAll(",", "")
        data.discount_amount = (data.discount_amount + '').replaceAll(",", "")

      data.status = 1 // Đã xác nhận


        this.saving = true

        orderApi.updateDraft(data).then(res => {
          this.saving = false
          if(res != null && res.data != null){

            if (res.data.status == 200) {
              let tradeId = this.route.params.id
              if(!tradeId){
                this.popToast('success', 'Đặt sản phẩm thành công!!! ')
                this.router.push("/order-list")
              } else {
                this.popToast('success', 'Cập nhật đặt sản phẩm thành công!!! ')
                this.saveSuccess = true

                this.trade = res.data.data
              }
            }
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push("/order-list")
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
          this.currentProduct.price_buy = this.formatCurrency(price_buy)
      },

      changePriceSell() {
        let price_sell = this.currentProduct.price_sell.replaceAll(",", "")
          this.currentProduct.price_sell = this.formatCurrency(price_sell)
      },

      changeQuantity() {
        let quantity = this.currentProduct.quantity.replaceAll(",", "")
          this.currentProduct.quantity = this.formatCurrency(quantity)
      },

      deleteProduct(ind, product_id, quantity, properties) {
        // Remove item
        this.trade.products.splice(parseInt(ind) - 1, 1)

          // Check remove all product
          if(this.trade.products.length == 0) {
            this.deleteTrade(this.trade.id)

              // Refresh data
            this.refreshOrderInfo()
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

        // // Cập nhật số lượng sản phẩm trong kho của sản phẩm tại client
        // this.updateQuantityRepo(product_id, quantity, properties, 'delete')
      },

      deleteTrade(orderId) {
        orderApi.deleteOrder(orderId).then(res => {
        }).catch(err => {
        })
      },

    /**
     * Only input integer and point
     */
    integerAndCommaOnly(item) {
      let valueInput = item.value
        valueInput = valueInput.replaceAll(",", "")
      let result = commonFunc.integerAndCommaOnly(valueInput)

        result = this.formatCurrency(result)
      item.value = result
    },

      /**
     * Only input integer and point
     */
    integerPointAndCommaOnly(item) {
      let valueInput = item.value
        valueInput = valueInput.replaceAll(",", "")
      let result = commonFunc.integerPointAndCommaOnly(valueInput)

        result = this.formatCurrency(result)
      item.value = result
    },

    /**
   * Currency format
   */
    formatCurrency(num) {
      let result = ""
        if(num === 0) {
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

      this.showModalApplyPmt = true


      setTimeout(this.updatePmtAllyToModal, 1000)
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
      this.showModalApplyPmt = false
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
        this.popToast('error', 'Vượt quá số lượng còn lại của khuyến mãi')
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

      this.showModalApplyPmt = false
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
