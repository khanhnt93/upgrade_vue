<template>
  <div id="bill-create" class="d-flex flex-column" style="height: calc(100vh - 60px);">
    <div v-if="trade.trade_status == 0" class="d-flex flex-grow-1 overflow-hidden">
      <!-- Nửa trái: Giỏ hàng -->
      <div class="w-50 p-3 d-flex flex-column h-100 border-right">
        <h5>Sản phẩm đang chọn</h5>

        <!-- Danh sách giỏ hàng (cuộn) -->
        <div class="list-group flex-grow-1 overflow-auto">
          <div v-for="(item, index) in trade.products" :key="index" class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <strong class="font-big">{{ item.name }}</strong><br />

              <!-- Sửa giá bán -->
              <b-input-group size="sm" class="mb-1" style="max-width: 150px;">
                <b-input-group-prepend>
                  <b-input-group-text>₫</b-input-group-text>
                </b-input-group-prepend>
                <b-form-input
                  type="text"
                  :value="item.price_sell"
                  @input="updatePrice(index, $event)"
                  @blur="formatNumericInput(index, 'price_sell')"
                  @change="calculatePaymentInfo(); handleSaveDraft();"
                />
              </b-input-group>
            </div>

            <div class="d-flex align-items-center">
              <span class="text-muted mr-2">{{ item.unit_name }}</span>
              <b-button size="sm" variant="outline-primary" @click="decreaseQty(index)">−</b-button>

              <!-- Sửa số lượng -->
              <b-form-input
                type="number"
                min="1"
                :value="item.quantity"
                @input="updateQty(index, $event)"
                @blur="formatNumericInput(index, 'quantity')"
                @change="calculatePaymentInfo(); handleSaveDraft();"
                size="sm"
                class="mx-2"
                style="width: 60px;"
              />
              <b-button size="sm" variant="outline-primary" @click="increaseQty(index)">+</b-button>
              <b-button size="sm" variant="outline-danger" class="ml-2" @click="removeItem(index)">×</b-button>
            </div>
          </div>
        </div>

        <!-- Tổng tiền & thông tin phụ -->
        <div class="mt-3">
          <h5 class="text-right">Tổng tiền thanh toán: <b>{{ currencyFormat(trade.total) }} đ</b></h5>

          <!-- Thông tin bổ sung -->
          <div class="mt-3 payment-info">
            <div class="d-flex justify-content-between">
              <span>Khách hàng:</span>
              <div class="d-flex align-items-center justify-content-end">
                <b-link @click="showModal('customer')">{{ selectedCustomer.name || 'Chưa chọn' }}</b-link>
                <!-- Icon xoá nếu đã chọn khách -->
                <b-button
                  v-if="selectedCustomer.name"
                  variant="link"
                  class="p-0 ml-2 text-danger"
                  @click="selectedCustomer = {}; trade.customer_id = null;"
                  title="Bỏ khách hàng đã chọn"
                >
                  <i class="fa fa-trash" />
                </b-button>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <span>Tổng tiền Sản phẩm:</span>
              <span>{{ currencyFormat(trade.sub_total) || 0 }} đ</span>
            </div>
            <div class="d-flex justify-content-between">
              <span>Chi phí thêm / Giảm tiền:</span>
              <div class="d-flex align-items-center justify-content-end">
                <b-link @click="showModal('extraFee')">{{ currencyFormat(parseInt(trade.extra_fee) - parseInt(trade.fixed_discount)) }}</b-link>
                <!-- Icon xoá nếu đã chọn khách -->
                <b-button
                  v-if="trade.extra_fee || trade.fixed_discount"
                  variant="link"
                  class="p-0 ml-2 text-danger"
                  @click="trade.extra_fee = 0; trade.fixed_discount = 0; handleSaveDraft()"
                  title="Bỏ chi phí thêm / Giảm tiền"
                >
                  <i class="fa fa-trash" />
                </b-button>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <span>Khuyến mãi:</span>
              <div class="d-flex align-items-center justify-content-end">
                <b-link @click="showModal('promotion')">{{ currencyFormat(trade.discount_amount) || 'Chưa áp dụng' }}</b-link>
                <!-- Icon xoá nếu đã chọn khách -->
                <b-button
                  v-if="trade.discount_amount"
                  variant="link"
                  class="p-0 ml-2 text-danger"
                  @click="trade.promotions = []; trade.discount_amount = 0; handleSaveDraft()"
                  title="Bỏ phụ thu"
                >
                  <i class="fa fa-trash" />
                </b-button>
              </div>
            </div>
            <!-- VAT -->
            <div class="d-flex align-items-center">
              <!-- Label -->
               <span class="mr-2">Thuế VAT:</span>
              <!-- <label class="mb-0 mr-2"><small>Thuế VAT:</small></label> -->

              <!-- Checkbox -->
              <b-form-checkbox
                v-model="trade.have_vat"
                switch
                class="mr-3"
                size="sm"
                @change="onVatEnabledChange"
              ></b-form-checkbox>

              <!-- Input % VAT -->
              <b-input-group size="sm" class="mr-3" style="max-width: 100px;">
                <b-form-input
                  type="number"
                  v-model.number="trade.vat_percent"
                  :disabled="!trade.have_vat"
                  min="0"
                  max="100"
                  step="1"
                  @change="handleSaveDraft"
                ></b-form-input>
                <b-input-group-append>
                  <b-input-group-text>%</b-input-group-text>
                </b-input-group-append>
              </b-input-group>

              <!-- Tiền VAT -->
              <span class="ml-auto">{{ currencyFormat(trade.vat_value) || 0 }} đ</span>
            </div>

            <div class="d-flex justify-content-between">
              <span>Loại tiền:</span>
              <b-link @click="showModal('currency')">{{ selectedCurrency || 'Tiền mặt' }}</b-link>
            </div>

            <div class="d-flex justify-content-between" @click="handlePaymentTypeChange">
              <span>Loại thanh toán:</span>
              <b-form-radio-group
                v-model="paymentType"
                :options="[
                  { text: 'Tất toán', value: 'full' },
                  { text: 'Ghi nợ', value: 'debt' }
                ]"
                buttons
                button-variant="outline-primary"
                size="sm"
                @change="handlePaymentTypeChange"
                @click="handlePaymentTypeChange"
              ></b-form-radio-group>
            </div>
          </div>
        </div>

        <!-- Nút hành động cuối cùng -->
        <div class="mt-auto pt-2 d-flex justify-content-between">
          <b-button
            v-if="trade.id"
            variant="primary"
            @click="$router.push('/bill/history')"
          >
            Danh sách bill
          </b-button>

          <!-- In hóa đơn -->
          <b-button v-if="trade.id && trade.products.length" variant="outline-warning" class="mr-2" @click="printReceipt">
            🧾 In hóa đơn tạm tính
          </b-button>

          <!-- Tạo bill mới -->
          <b-button
            v-if="trade.id"
            variant="success"
             @click="showModal('newBill')"
          >
            Tạo bill mới
          </b-button>

          <!-- Lưu nháp -->
          <b-button v-if="trade.trade_status == 0 && trade.products.length" variant="secondary" @click="saveDraft(true)">Lưu nháp</b-button>

          <!-- Thanh toán -->
          <b-button v-if="trade.id && trade.trade_status == 0" variant="danger" 
          @click="checkBeforeSell">Thanh toán</b-button>
        </div>

      </div>

      <!-- Nửa phải: Danh sách sản phẩm -->
      <div class="w-50 p-3 d-flex flex-column h-100">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <h5 class="mb-0">Danh sách Sản phẩm</h5>
          <b-form-input
            v-model="searchProductQuery"
            @input="handleFilterProduct"
            placeholder="Tìm theo tên/mã sản phẩm..."
            size="sm"
            class="ml-3"
            style="max-width: 250px;"
          />
        </div>

        <!-- <h5>Danh sách Sản phẩm</h5> -->
        <div class="mb-3">
          <b-button
            :variant="activeGroupId === null ? 'primary' : 'outline-primary'"
            @click="handleSelectGroup(null)"
            class="mr-1 mt-1"
          >
            Tất cả
          </b-button>
          <b-button
            v-for="group in productGroups"
            :key="group.id || 'all'"
            :variant="activeGroupId === group.id ? 'primary' : 'outline-primary'"
            @click="handleSelectGroup(group.id)"
            class="mr-1 mt-1"
          >
            {{ group.name }}
          </b-button>
        </div>

        <!-- Danh sách sản phẩm -->
        <div class="flex-grow-1 overflow-auto product-list">
          <b-card
            v-for="product in filteredProducts"
            :key="product.id"
            class="mb-2 cursor-pointer"
            no-body
          >
            <div class="d-flex align-items-center">
              <b-img
                :src="product.image"
                alt="Ảnh sản phẩm"
                fluid
                rounded
                @click="addToCart(product)"
                style="width: 50px; height: 50px; object-fit: cover; margin-right: 15px;"
              />
              <div class="flex-grow-1">
                <div class="font-weight-bold font-big mt-10" @click="addToCart(product)">{{ product.name_full }}</div>
                <div class="d-flex small">
                  <div class="text-muted" style="flex: 1;" @click="addToCart(product)">
                    <span v-show="product.price_sell">Giá bán: <strong>{{ currencyFormat(product.price_sell) }} đ</strong></span>
                    <span v-show="!product.price_sell">Hàng chưa định giá bán</span>
                  </div>
                  <div class="text-muted d-flex align-items-center" style="flex: 1;">
                    <span class="mr-2" v-show="product.price_buy != null" title="Xem giá nhập">
                      Giá nhập: <strong>{{ showBuyPrice[product.id] ? currencyFormat(product.price_buy) + ' đ' : '***' }}</strong>
                    </span>
                    <b-button
                      v-show="product.price_buy != null"
                      variant="link"
                      size="sm"
                      @click="toggleBuyPrice(product.id)"
                      class="p-0"
                      style="font-size: 1rem;"
                    >
                      <i v-show="!showBuyPrice[product.id]" class="fa fa-eye" aria-hidden="true" title="Xem giá nhập"></i>
                      <i v-show="showBuyPrice[product.id]" class="fa fa-eye-slash" aria-hidden="true" title="Đóng giá nhập"></i>
                    </b-button>
                    <span v-show="product.price_buy == null">Hàng chưa nhập kho</span>
                  </div>
                  <div class="text-muted text-right" style="flex: 1;">
                    Đơn vị: {{ product.unit_name }}
                  </div>
                </div>

              </div>
            </div>
          </b-card>
        </div>

        <!-- Ghi chú -->
        <div class="mt-3" v-show="trade.id">
          <b-form-textarea
            v-model="trade.note"
            placeholder="Ghi chú cho đơn hàng..."
            rows="2"
            max-rows="4"
            class="mb-3"
          ></b-form-textarea>
        </div>
      </div>
    </div>

    <!-- Vùng hiển thị hóa đơn sau thanh toán -->
    <div v-if="trade.trade_status == 1" class="d-flex flex-grow-1">
      <!-- Nửa trái: Mẫu in hóa đơn -->
      <div class="w-50 p-3 d-flex flex-column h-100 border-right">
        <div ref="receiptArea" class="receipt-container">
          <div class="receipt-content">
            <!-- Logo -->
            <!-- <div>
              <img src="/static/img/project/logo.png" alt="Spa" style="width: 100%; height: auto;" />
            </div> -->

            <h4 style="font-size: 18px; text-align: center;">{{ storeInfo.name }}</h4>
            <p style="text-align: center;">Địa chỉ: {{ storeInfo.address }}</p>
            <p style="text-align: center;">SĐT: {{ storeInfo.phone_number }}</p>

            <h4 style="text-align: center; margin-bottom: 0.5rem; margin-top: 0.5rem;">HÓA ĐƠN THANH TOÁN</h4>
            <p>Số hóa đơn: {{ trade.bill_number }}</p>
            <p style="border-bottom: 1px solid #4d4d4d;">Ngày: {{ new Date().toLocaleString('vi-VN') }}</p>

            <!-- Danh sách Sản phẩm -->
            <div style="font-size: 13px; margin-bottom: 0.5rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.875rem; border-bottom: 1px solid #4d4d4d;">
                <div>Sản phẩm/Giá</div>
                <div>Số lượng</div>
                <div>Thành tiền</div>
              </div>
              <div v-for="(item, i) in trade.products" :key="i" style="border-bottom: 1px solid #4d4d4d;">
                <!-- Tên Sản phẩm -->
                <div>
                  {{ item.name }}
                </div>
                <!-- Giá / SL / Thành tiền -->
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                  <div>{{ currencyFormat(item.price_sell) }}</div>
                  <div>{{ currencyFormat(item.quantity) }}</div>
                  <div>{{ currencyFormat(item.price_sell * item.quantity) }}</div>
                </div>
              </div>
            </div>
            <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <strong>Tổng cộng: </strong>
              <span>{{ currencyFormat(trade.sub_total) }}</span>
            </p>
            <p v-if="trade.extra_fee"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <strong>Chi phí thêm: </strong>
              <span>{{ currencyFormat(trade.extra_fee) }}</span>
            </p>
            <p v-if="trade.fixed_discount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <strong>Giảm tiền: </strong>
              <span>{{ currencyFormat(trade.fixed_discount) }}</span>
            </p>
            <p v-if="trade.discount_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <strong>Khuyến mãi:</strong>
              <span>{{ currencyFormat(trade.discount_amount) }}</span>
            </p>
            <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <strong>Thanh toán:</strong>
              <span>{{ currencyFormat(trade.total) }}</span>
            </p>

            <p style="text-align: center; margin-top: 2rem;">Cảm ơn quý khách!</p>
            <p style="text-align: center;">Hẹn gặp lại 💖</p>
          </div>
        </div>
      </div>

      <!-- Nửa phải: Các buttons  -->
      <div class="w-50 p-3 d-flex flex-column h-100">
        <b-row>
          <b-col>
            <b-button variant="outline-primary" class="pull-left px-4 btn-width-220" @click="printReceipt()">
              🖨️ In hóa đơn
            </b-button>
          </b-col>
        </b-row>
        <!-- <b-row class="mt-4">
          <b-col>
            <b-button variant="outline-primary" class="pull-left px-4 btn-width-220" @click="printInvoice()">
              🧾 In hóa đơn GTGT
            </b-button>
          </b-col>
        </b-row> -->
        <b-row class="mt-4">
          <b-col>
            <b-button variant="outline-success" class="pull-left px-4 btn-width-220" @click="resetBill()">
              🆕 Tạo bill mới
            </b-button>
          </b-col>
        </b-row>
      </div>
    </div>

    <!-- Vùng in hoá đơn tạm tính -->
    <div ref="receiptArea" class="receipt-container"  style="display: none;">
      <div class="receipt-content">
        <!-- Logo -->
        <div>
          <img src="/static/img/project/logo.png" alt="Spa" style="width: 100%; height: auto;" />
        </div>

        <h4 style="font-size: 18px; text-align: center;">{{ storeInfo.name }}</h4>
        <p style="text-align: center;">Địa chỉ: {{ storeInfo.address }}</p>
        <p style="text-align: center;">SĐT: {{ storeInfo.phone_number }}</p>

        <h4 style="text-align: center; margin-bottom: 0.5rem; margin-top: 0.5rem;">HÓA ĐƠN TẠM TÍNH</h4>
        <p>Số hóa đơn: {{ trade.bill_number }}</p>
        <p style="border-bottom: 1px solid #4d4d4d;">Ngày: {{ new Date().toLocaleString('vi-VN') }}</p>

        <!-- Danh sách Sản phẩm -->
        <div style="font-size: 13px; margin-bottom: 0.5rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.875rem; border-bottom: 1px solid #4d4d4d;">
            <div>Sản phẩm/Giá</div>
            <div>Số lượng</div>
            <div>Thành tiền</div>
          </div>
          <div v-for="(item, i) in trade.products" :key="i" style="border-bottom: 1px solid #4d4d4d;">
            <!-- Tên Sản phẩm -->
            <div>
              {{ item.name }}
            </div>
            <!-- Giá / SL / Thành tiền -->
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <div>{{ currencyFormat(item.price_sell) }}</div>
              <div>{{ currencyFormat(item.quantity) }}</div>
              <div>{{ currencyFormat(item.price_sell * item.quantity) }}</div>
            </div>
          </div>
        </div>
        <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Tổng cộng: </strong>
          <span>{{ currencyFormat(trade.sub_total) }}</span>
        </p>
        <p v-if="trade.extra_fee"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Chi phí thêm: </strong>
          <span>{{ currencyFormat(trade.extra_fee) }}</span>
        </p>
        <p v-if="trade.fixed_discount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Giảm tiền: </strong>
          <span>{{ currencyFormat(trade.fixed_discount) }}</span>
        </p>
        <p v-if="trade.discount_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Khuyến mãi:</strong>
          <span>{{ currencyFormat(trade.discount_amount) }}</span>
        </p>
        <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Thanh toán:</strong>
          <span>{{ currencyFormat(trade.total || 0) }}</span>
        </p>

        <p style="text-align: center; margin-top: 2rem;">Cảm ơn quý khách!</p>
        <p style="text-align: center;">Hẹn gặp lại 💖</p>
      </div>
    </div>

    <!-- Modal Khách hàng -->
    <b-modal
      v-model="modalCustomer"
      id="customer-modal"
      title="Khách hàng"
      size="xl"
      scrollable
      ok-only
      ok-title="Đóng"
    >
      <b-tabs pills card>
        <!-- Tab 1: Tìm kiếm -->
        <b-tab title="Khách hàng cũ" active>
          <!-- Form tìm kiếm -->
          <div class="my-3 d-flex gap-2 align-items-center">
            <b-form-input
              v-model="customerSearchQuery"
              placeholder="Nhập tên hoặc số điện thoại"
              class="flex-grow-1"
            ></b-form-input>
            <b-button variant="primary" @click="searchCustomers" class="ml-2" style="white-space: nowrap;">
              Tìm kiếm
            </b-button>
          </div>

          <!-- Kết quả -->
          <b-table
            :items="customerList"
            :fields="customerFields"
            striped
            bordered
            small
          >
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>
            <template #cell(action)="data">
              <b-button variant="primary" @click="selectCustomer(data.item)">
                Chọn
              </b-button>
            </template>
          </b-table>
        </b-tab>

        <!-- Tab 2: Tạo mới -->
        <b-tab title="Thêm mới">
          <b-form @submit.prevent="createCustomer">
            <b-row>
              <b-col md="6">
                <b-form-group label="Tên khách hàng *"
                  :state="formCustomerErrors.name ? false : null"
                  :invalid-feedback="formCustomerErrors.name"
                >
                  <b-form-input v-model="newCustomer.name" required :state="formCustomerErrors.name ? false : null"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Loại khách hàng">
                  <b-form-input v-model="newCustomer.type"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Số điện thoại *"
                  :state="formCustomerErrors.phone_number ? false : null"
                  :invalid-feedback="formCustomerErrors.phone_number"
                >
                  <b-form-input v-model="newCustomer.phone_number" :state="formCustomerErrors.phone_number ? false : null"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Ngày sinh">
                  <b-form-input type="date" v-model="newCustomer.birthday"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Giới tính">
                  <b-form-select v-model="newCustomer.gender" :options="optionsGender"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Mã số thuế">
                  <b-form-input v-model="newCustomer.mst"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Địa chỉ">
                  <b-form-input v-model="newCustomer.address"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <div class="text-right">
              <b-button variant="success" type="submit">Tạo khách hàng</b-button>
            </div>
          </b-form>
        </b-tab>
      </b-tabs>
    </b-modal>

    <!-- Modal khuyến mãi -->
    <b-modal
      v-model="modalPromotion"
      id="promotion-modal"
      title="Khuyến mãi"
      size="xl"
      scrollable
      hide-footer
    >
      <!-- Danh sách khuyến mãi -->
      <div class="mb-3">
        <h6 class="mb-2">Danh sách khuyến mãi:</h6>
        <div class="d-flex flex-wrap">
          <b-button
            v-for="promo in promotionList"
            :key="promo.id"
            size="sm"
            class="m-1"
            variant="outline-success"
            @click="addPromotion(promo)"
          >
            {{ promo.name }}
          </b-button>
        </div>
      </div>

      <!-- Danh sách khuyến mãi đã chọn -->
      <div v-if="selectedPromotions.length">
        <h6 class="mb-2">Đã chọn:</h6>
        <ul class="list-group mb-3">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(promo, index) in selectedPromotions"
            :key="promo.id"
          >
            <div>
              <strong>{{ promo.name }}</strong>
            </div>
            <div class="d-flex align-items-center">
              <b-button size="sm" @click="decreaseQtyPmt(index)" variant="outline-primary">−</b-button>
              <span class="mx-2">{{ promo.quantity }}</span>
              <b-button size="sm" @click="increaseQtyPmt(index)" variant="outline-primary">+</b-button>
              <b-button size="sm" variant="outline-danger" class="ml-2" @click="removePromotion(index)">×</b-button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Nút -->
      <div v-if="selectedPromotions.length" class="d-flex justify-content-between">
        <b-button variant="secondary" @click="hideModalPmt">Bỏ qua</b-button>
        <b-button variant="success" @click="applyPromotions">Áp dụng</b-button>
      </div>
    </b-modal>

    <!-- Modal Chi phí thêm / Giảm tiền -->
    <b-modal
      v-model="modalExtraFee"
      id="extraFee-modal"
      title="Chi phí thêm / Giảm tiền"
      size="lg"
      scrollable
      hide-footer
    >
      <!-- Form thêm phí -->
      <b-form @submit.prevent="addExtraFee">

        <b-row class="align-items-end">
          <!-- Tên phí -->
          <b-col md="12">
            <div class="input-group">
              <input type="radio" v-model="newFee.type" name="type" value="0" class="mt-2">
              <label class="ml-4 mt-1">Chi phí thêm</label>
              <input type="radio" v-model="newFee.type" name="type" value="1" class="ml-5 mt-2">
              <label class="ml-4 mt-1">Giảm tiền</label>
            </div>
            <!-- <b-form-group label="Lý do phụ thu / thêm phí">
              <b-form-input v-model="newFee.name" required></b-form-input>
            </b-form-group> -->
          </b-col>
        </b-row>

        <b-row class="align-items-end">
          <!-- Số tiền -->
          <b-col md="12">
            <b-form-group label="Số tiền">
              <b-form-input
                type="number"
                v-model.number="newFee.price"
                min="0"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Button Thêm -->
        <b-row class="text-center">
          <b-col md="12" class="text-center">
            <b-button type="submit" variant="success" size="sm">Thêm</b-button>
          </b-col>
        </b-row>
      </b-form>

      <!-- Danh sách phí đã thêm -->
      <div v-if="extraFees.length" class="mt-4">
        <h6 class="mb-2">Đã thêm:</h6>
        <ul class="list-group mb-3">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(fee, index) in extraFees"
            :key="index"
          >
            <div>
              <strong>{{ fee.type == '0' ? 'Chi phí thêm' : 'Giảm tiền' }}</strong>
              <small class="d-block text-muted">
                {{ currencyFormat(fee.price) }}đ
              </small>
            </div>
            <div class="d-flex align-items-center">
              <b-button size="sm" variant="outline-danger" class="ml-2" @click="removeExtraFee(index)">×</b-button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Nút -->
      <div v-if="extraFees.length" class="d-flex justify-content-between">
        <b-button variant="secondary" @click="hideModalExtraFees">Bỏ qua</b-button>
        <b-button variant="success" @click="applyExtraFees">Áp dụng</b-button>
      </div>
    </b-modal>

    <!-- Modal chọn loại tiền thanh toán -->
    <b-modal
      v-model="modalCurrency"
      id="currency-modal"
      title="Chọn loại tiền thanh toán"
      size="lg"
      scrollable
      hide-footer
    >
      <!-- Tổng tiền cần thanh toán -->
      <p class="font-weight-bold text-center mb-4">
        Số tiền cần thanh toán: {{ currencyFormat(trade.total) }}
      </p>

      <!-- Các loại thanh toán -->
      <b-form-group v-for="(method, key) in paymentOptions" :key="key" class="mb-3">
        <b-form-checkbox
          v-model="method.checked"
          @change="onCheckboxChange(key)"
        >
          {{ method.label }}
        </b-form-checkbox>

        <b-form-input
          v-model.number="method.amount"
          type="number"
          min="0"
          class="mt-2"
          :placeholder="`Nhập số tiền ${method.label.toLowerCase()}`"
        ></b-form-input>
      </b-form-group>

      <!-- Error nếu tổng nhỏ hơn -->
      <p v-if="paymentError" class="text-danger text-center font-weight-bold">
        {{ paymentError }}
      </p>

      <!-- Buttons -->
      <div class="d-flex justify-content-between mt-4">
        <b-button variant="secondary" @click="hideModalCurrency">Bỏ qua</b-button>
        <b-button variant="success" @click="applyCurrency">Áp dụng</b-button>
      </div>
    </b-modal>

    <!-- Modal xác nhận thanh toán -->
    <b-modal
      v-model="modalPayment"
      id="payment-modal"
      hide-footer
      hide-header
      centered
      size="md"
      modal-class="custom-payment-modal"
    >
      <div class="text-center px-4 py-3">
        <!-- Custom title -->
        <h4 class="font-weight-bold mb-4" style="color: #3b82f6;">Xác nhận thanh toán</h4>

        <!-- Tên khách hàng -->
        <p class="mb-2" style="font-size: 1.25rem;">
          👤 <strong>Khách hàng: {{ selectedCustomer.name || 'Chưa chọn khách hàng' }}</strong>
        </p>

        <!-- Số tiền thanh toán -->
        <p class="mb-4" style="font-size: 2rem; font-weight: bold; color: #10b981;">
          💰 {{ currencyFormat(trade.total_paid ? trade.total_paid : trade.total) }}
        </p>

        <!-- Số tiền ghi nợ -->
        <p v-show="trade.total_paid && trade.total_paid < trade.total" class="mb-4" style="font-size: 2rem; font-weight: bold; color: #dc3545;">
          🧾 Ghi nợ: {{ currencyFormat(trade.total - trade.total_paid) }}
        </p>

        <!-- Buttons -->
        <div class="d-flex justify-content-center gap-3">
          <b-button variant="outline-secondary" class="rounded-pill px-4 py-2 shadow-sm"
            @click="modalPayment = false">
            ❌ Hủy
          </b-button>

          <b-button variant="success" class="rounded-pill px-4 py-2 shadow-sm"
            @click="confirmPayment">
            ✅ Xác nhận thanh toán
          </b-button>
        </div>
      </div>
      
    </b-modal>

    <!-- Modal xác nhận tạo bill mới -->
    <b-modal
      v-model="modalNewBill"
      id="new-bill-modal"
      hide-footer
      hide-header
      centered
      size="md"
    >
      <div class="text-center px-4 py-3">
        <!-- Custom title -->
        <h4 class="font-weight-bold mb-4" style="color: #3b82f6;">Xác nhận tạo bill mới</h4>
        <hr>

        <!-- Số tiền thanh toán -->
        <p class="mb-4" style="font-weight: bold">
          Thông tin bill hiện tại đã được lưu nháp tại "Danh sách bill", bạn có thể chỉnh sửa hoặc xóa bill này nếu muốn!
        </p>

        <!-- Buttons -->
        <div class="d-flex justify-content-center gap-3">
          <b-button variant="outline-secondary" class="rounded-pill px-4 py-2 shadow-sm"
            @click="modalNewBill = false">
            ❌ Hủy
          </b-button>

          <b-button variant="success" class="rounded-pill px-4 py-2 shadow-sm"
            @click="resetBill">
            ✅ Xác nhận
          </b-button>
        </div>
      </div>
      
    </b-modal>

    <!-- Modal ghi nợ -->
    <b-modal
      v-model="showDebtModal"
      id="debt-modal"
      title="Thông tin ghi nợ"
      size="xl"
      scrollable
      hide-footer
    >
    <b-row class="form-row">
      <b-col md="12" class="mt-2">
        <h4>Số tiền cần thanh toán: <span class="text-header">{{currencyFormat(trade.total)}}</span></h4>
      </b-col>
    </b-row>

    <b-row class="form-row">
      <b-col md="3" class="mt-1">
        <label>Số tiền khách trả</label>
      </b-col>
      <b-col md="9" class="mt-1">
        <input
          id="total_paid"
          type="text"
          class="form-control"
          v-model="currentDebt.total_paid"
          autocomplete="new-password"
          maxlength="14"
          @keyup="integerAndPointOnly($event.target)">
      </b-col>
    </b-row>

    <b-row class="form-row" v-show="currentDebt.total_paid && currentDebt.total_paid < trade.total">
      <b-col md="12" class="mt-2">
        <h4>Số tiền ghi nợ: <span class="text-header">{{currencyFormat(trade.total - currentDebt.total_paid)}}</span></h4>
      </b-col>
    </b-row>

    <b-row class="form-row">
      <b-col md="3" class="mt-1">
        <label>Lãi suất (%)</label>
      </b-col>
      <b-col md="9" class="mt-1">
        <input
          id="interest_rate"
          type="text"
          class="form-control"
          v-model="currentDebt.interest_rate"
          autocomplete="new-password"
          maxlength="5"
          @keyup="integerAndPointOnly($event.target)">
      </b-col>
    </b-row>

    <b-row class="form-row">
      <b-col md="3" class="mt-1">
        <label>Kỳ hạn tính lãi</label>
      </b-col>
      <b-col md="9" class="mt-1">
        <b-form-select
          :options="periodOptions"
          id="interest_period"
          type="text"
          autocomplete="new-password"
          class="form-control"
          v-model="currentDebt.interest_period">
        </b-form-select>
      </b-col>
    </b-row>

    <b-row class="form-row">
      <b-col md="3" class="mt-1">
        <label>Ngày hẹn thanh toán </label>
      </b-col>
      <b-col md="9" class="mt-1">
        <datepicker v-model="currentDebt.appointment_date" format="yyyy-MM-dd" :typeable="true"
                    placeholder="" input-class="datepicker-cus" ></datepicker>
      </b-col>
    </b-row>

    <b-row class="form-row">
      <b-col md="3" class="mt-1">
        <label>Nhắc hẹn thanh toán trước số ngày </label>
      </b-col>
      <b-col md="9" class="mt-1">
        <input
          id="forewarning"
          type="text"
          maxlength="14"
          autocomplete="new-password"
          class="form-control"
          v-model="currentDebt.forewarning"
          @keyup="integerOnly($event.target)">
      </b-col>
    </b-row>

      <!-- Nút -->
      <div class="d-flex justify-content-between mt-2">
        <b-button variant="secondary" @click="cancelDebt">Bỏ qua</b-button>
        <b-button variant="success" @click="applyDebt">Áp dụng</b-button>
      </div>
    </b-modal>

    <!--Modal cảnh báo bán quá số lượng trong kho -->
    <b-modal centered hide-footer hide-header no-close-on-backdrop size="xl" id="modal-confirm-sell">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Sản phẩm bán vượt quá số lượng trong kho</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="productImportFields"
            :items="productNotEnoughQuantity">
          </b-table>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="4" class="text-left mt-3">
          <button class="btn btn-danger px-4" @click="hideModalConfirmSell">
            Hủy bán
          </button>
        </b-col>
        <b-col cols="8" class="text-right mt-3">
          <button class="btn btn-primary px-4 default-btn-bg" 
          @click="modalPayment = true; hideModalConfirmSell();">
            Tiếp tục bán
          </button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Hoá đơn, khu vực ẩn để in -->
    <div ref="invoiceArea" style="display: none;">
      <div style="width: 210mm; padding: 20mm; font-family: Arial; font-size: 14px;">
        <h3 style="text-align: center; font-weight: bold;">HÓA ĐƠN GIÁ TRỊ GIA TĂNG</h3>
        <p style="text-align: center;">(Mẫu số: 01GTKT0/001 – Ký hiệu: AA/22E)</p>

        <!-- Thông tin người bán -->
        <p><strong>Đơn vị bán hàng:</strong> {{storeInfo.name}}</p>
        <p><strong>Mã số thuế:</strong> </p>
        <p><strong>Địa chỉ:</strong> {{storeInfo.address}}</p>
        <p><strong>Điện thoại:</strong> {{storeInfo.phone_number}}</p>
        <p><strong>Số hóa đơn:</strong> {{trade.bill_number}} – Ngày {{ new Date().toLocaleDateString('vi-VN') }}</p>

        <!-- Thông tin người mua -->
        <hr />
        <p><strong>Họ tên người mua hàng:</strong> {{ selectedCustomer.name }}</p>
        <p><strong>SĐT:</strong> {{ selectedCustomer.phone_number }}</p>
        <p><strong>Địa chỉ:</strong> {{ selectedCustomer.address || '...' }}</p>
        <p><strong>Mã số thuế (nếu có):</strong> {{ selectedCustomer.mst || '...' }}</p>

        <!-- Bảng sản phẩm -->
        <table width="100%" border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in trade.products" :key="index">
              <td style="text-align: center;">{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td style="text-align: right;">{{ currencyFormat(item.price_sell) }}</td>
              <td style="text-align: center;">{{ currencyFormat(item.quantity) }}</td>
              <td style="text-align: right;">{{ currencyFormat(item.price_sell * item.quantity) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Tổng cộng -->
        <p style="text-align: right; margin-top: 10px;">
          <strong>Tổng tiền hàng:</strong> {{ currencyFormat(trade.sub_total) }}<br />
          <strong>Thuế VAT ({{ trade.vat_percent || 0 }}%):</strong> {{ currencyFormat(trade.vat_valuevalue) }}<br />
          <strong>Giảm giá KM:</strong> {{ currencyFormat(trade.discount_amount) }}<br />
          <strong>Giảm tiền:</strong> {{ currencyFormat(trade.fixed_discount) }}<br />
          <strong>Chi phí thêm:</strong> {{ currencyFormat(trade.extra_fee) }}<br />
          <strong>Thanh toán:</strong> {{ currencyFormat(trade.total) }}
        </p>

        <p><strong>Số tiền viết bằng chữ:</strong> {{ numberToWords(trade.total) }}</p>

        <!-- Chữ ký -->
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div>
            <p><strong>Người mua hàng</strong></p>
            <p style="font-style: italic;">(Ký, ghi rõ họ tên)</p>
          </div>
          <div>
            <p><strong>Người bán hàng</strong></p>
            <p style="font-style: italic;">(Ký, ghi rõ họ tên)</p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import billApi from '@/api/bill'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vuejs-datepicker'


export default {
  components: {
    Datepicker
  },
  data() {
    return {
      storeInfo: {}, // thông tin store
      productGroups: [],
      filteredProducts: [],
      activeGroupId: null,
      modalCustomer: false,
      modalPromotion: false,
      modalExtraFee: false,
      modalCurrency: false,
      modalPayment: false,
      modalNewBill: false,
      isFisrtSaveDraft: true,
      // So sánh với trade của màn hình bán hàng cũ
      trade: {
        id: null,
        trade_status: 0,
        order_id: null,
        amount_paid_on_order: 0,
        bill_number: null,
        from_type: 0,
        customer_id: null,
        customer_name: null,
        customer_phone: null,
        customer_address: null,
        customer_tax_code: null,
        supplier_id: null,
        supplier_name: null,
        supplier_phone: null,
        supplier_address: null,
        supplier_tax_code: null,
        sub_total: 0,
        extra_fee: 0,
        fixed_discount: 0,
        discount_amount: 0,
        have_vat: false,
        vat_percent: 10,
        vat_value: 0,
        total: 0,
        total_paid: 0,
        cash: 0,
        credit: 0,
        e_money: 0,
        description: null,
        products: [],
        promotions: [],
        interest_rate: 0,
        interest_period: 'month',
        appointment_date: null,
        forewarning: 30,
      },
      modalCustomer: false,
      optionsGender: [
        {value: '1', text: 'Nam'},
        {value: '2', text: 'Nữ'},
        {value: '3', text: 'Khác'}
      ],
      selectedCustomer: {},
      customerSearchQuery: '',
      customerList: [],
      customerFields: [
        { key: 'index', label: 'STT' },
        { key: 'name', label: 'Tên KH' },
        { key: 'phone_number', label: 'SĐT' },
        { key: 'birthday', label: 'Ngày sinh' },
        { key: 'gender_str', label: 'Giới tính' },
        { key: 'mst', label: 'Mã số thuế' },
        { key: 'address', label: 'Địa chỉ' },
        { key: 'type_str', label: 'Loại KH' },
        { key: 'action', label: '' }
      ],
      newCustomer: {
        name: '',
        type: '',
        phone_number: '',
        birthday: '',
        gender: '',
        mst: '',
        address: '',
      },
      formCustomerErrors: {
        name: null,
        phone_number: null,
      },
      promotionList: [],
      selectedPromotions: [],
      newFee: {
        type: '0',
        price: 0
      },
      extraFees: [],
      paymentOptions: {
        cash: { label: 'Tiền mặt', checked: true, amount: 0 },
        bank: { label: 'Chuyển khoản', checked: false, amount: 0 },
        emoney: { label: 'E-Money', checked: false, amount: 0 }
      },
      paymentError: '',
      searchProductQuery: '',
      showBuyPrice: {},
      periodOptions: [
        {value: 'day', text: 'Ngày'},
        {value: 'month', text: 'Tháng'},
        {value: 'year', text: 'Năm'}
      ],
      paymentType: 'full', // Loại thanh toán: mặc định là "Tất toán"
      showDebtModal: false,
      currentDebt: {
        total_paid: 0,
        interest_rate: 0,
        interest_period: 'month',
        appointment_date: null,
        forewarning: 30,
      },
      productNotEnoughQuantity: [],
      productImportFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
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
    }
  },
  computed: {
    selectedCurrency() {
      return Object.values(this.paymentOptions)
        .filter(opt => opt.amount > 0)
        .map(opt => `${opt.label}: ${this.currencyFormat(opt.amount)} đ`)
        .join(' | ');
    },
  },
  mounted() {
    // check Add hay edit
     const path = window.location.pathname;
     if(path.includes('bill/edit')) {
      const billId = this.$route.params.id;
      this.getBillDetail(billId)
     }

    // Get danh sách Sản phẩm
    this.fetchProductGroups();

    // Get danh sách khách hàng, khuyến mại
    this.getInfoRelatedBill();
  },
  methods: {
    // Make toast without title
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
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

    toggleBuyPrice(productId) {
      this.$set(this.showBuyPrice, productId, !this.showBuyPrice[productId]);
    },

    formatProductBeforeShow() {
      const products = JSON.parse(JSON.stringify(this.trade.products))
      if(products && products.length > 0) {
        for(const product of products) {
          product.price_sell = this.currencyFormat((product.price_sell + '').replaceAll(",", ""))
          product.quantity = this.currencyFormat((product.quantity + '').replaceAll(",", ""))
        }
      }
      this.trade.products = products
    },

    formatProductBeforeSave() {
      const products = JSON.parse(JSON.stringify(this.trade.products))
      if(products && products.length > 0) {
        for(const product of products) {
          product.price_sell = parseInt((product.price_sell + '').replaceAll(",", ""))
          product.quantity = parseFloat((product.quantity + '').replaceAll(",", ""))
        }
      }
      return products
    },

    // Get bill detail
    getBillDetail(billId) {
      billApi.getBillDetail(billId).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.trade = res.data.data

          // Format trước khi show
          this.formatProductBeforeShow()

          // Get customer 
          if(this.trade.customer) {
            this.selectedCustomer = this.trade.customer
          }

          // Set loại tiền
          this.setPaymentOptions()

          // Set loại thanh toán
          if(this.trade.total > this.trade.total_paid) {
            this.paymentType = 'debt'
          } else {
            this.paymentType = 'full'
          }

          // Chi phí thêm / Giảm tiền
          if(this.trade.extra_fee) {
            this.extraFees.push({type: '0', price: this.trade.extra_fee});
          }
          if(this.trade.fixed_discount) {
            this.extraFees.push({type: '1', price: this.trade.fixed_discount});
          }
          
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // Get danh sách Sản phẩm theo group
    fetchProductGroups() {
      billApi.getProductByGroup().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.productGroups = res.data.data

          this.handleSelectGroup(null)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
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
        this.$bvModal.show('modal-confirm-sell')
        return
      }
      this.modalPayment = true
    },

    hideModalConfirmSell() {
      this.$bvModal.hide('modal-confirm-sell')
    },

    // Get danh sách khách hàng, khuyến mại, staff
    getInfoRelatedBill() {
      billApi.getInfoRelatedBill().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          const data = res.data.data
          this.customerList = data.customers
          this.promotionList = data.promotions
          this.storeInfo = data.store
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    handleSelectGroup(groupId) {
      this.activeGroupId = groupId;
      if (this.activeGroupId === null) {
        this.filteredProducts = this.productGroups.flatMap(group => group.products);
      } else {
        const group = this.productGroups.find(g => g.id == groupId);
        this.filteredProducts = group ? group.products : [];
      }
    },

    handleFilterProduct(value) {
      this.activeGroupId = null
      this.handleSelectGroup(null)

      const products = JSON.parse(JSON.stringify(this.filteredProducts))

      this.searchProductQuery = value;
      const query = this.searchProductQuery.toLowerCase().trim();

      this.filteredProducts = products.filter(product => {
        const name = product.name_full || '';
        const matchName = name.toLowerCase().trim().includes(query);
        return matchName;
      });
    },

    onVatEnabledChange() {
      if (this.trade.have_vat) {
        this.trade.vat_percent = 10 // Default
      } else {
        this.trade.vat_percent = 0 // Default
        this.trade.vat_value = 0
      }
      // Check saveDraft
      this.handleSaveDraft()
    },

    handleSaveDraft() {
      // Nếu lưu nháp lần đầu thì lưu nháp ngay
      if(this.isFisrtSaveDraft) {
        this.isFisrtSaveDraft = false
        this.saveDraft()
      } else {
        // Nếu lưu nháp từ lần 2 trở đi
        // Nếu có trade ID thì lưu nháp ngay, ko thì đợi 3s
        if(this.trade.id) {
          this.saveDraft()
        } else {
          setTimeout(() => {
            this.saveDraft()
          }, 1500);
        }
      }
    },

    addToCart(product) {
      const existing = this.trade.products.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++; // TODO: Trường hợp số lượng ko phải tăng 1
        let price_sell = (existing.price_sell + '').replaceAll(",", "")
        existing.amount = parseInt(existing.quantity * price_sell)
      } else {
        // TODO: Trường hợp số lượng ko phải tăng 1
        if(!product.price_sell) {
          product.price_sell = 0
        }
        product.price_sell = this.currencyFormat(product.price_sell)
        this.trade.products.push({ ...product, quantity: 1, amount: product.price_sell });
      }

      console.log("----------")
      console.log(this.trade.products)
      console.log("----------")

      // Tính toán lại thông tin payment
      this.calculatePaymentInfo()

      // Check saveDraft
      this.handleSaveDraft()
    },

    // Cập nhật giá bán
    updatePrice(index, value) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        this.trade.products[index].price_sell = parsed;
      }
    },
    // Cập nhật số lượng
    updateQty(index, value) {
      const parsed = parseInt(value);
      if (!isNaN(parsed) && parsed >= 1) {
        this.trade.products[index].quantity = parsed;
      }
    },

    increaseQty(index) {
      // TODO: Trường hợp số lượng ko phải tăng 1
      this.trade.products[index].quantity++;
      this.trade.products[index].amount = parseInt(this.trade.products[index].quantity * this.trade.products[index].price_sell)

      // Tính toán lại thông tin payment
      this.calculatePaymentInfo()

      // Check saveDraft
      this.handleSaveDraft()
    },
    decreaseQty(index) {
      if (this.trade.products[index].quantity > 1) {
        // TODO: Trường hợp số lượng ko phải tăng 1
        this.trade.products[index].quantity--;
        this.trade.products[index].amount = parseInt(this.trade.products[index].quantity * this.trade.products[index].price_sell)
      } else {
        this.removeItem(index);
      }

      // Tính toán lại thông tin payment
      this.calculatePaymentInfo()

      // Check saveDraft
      this.handleSaveDraft()
    },
    removeItem(index) {
      this.trade.products.splice(index, 1);

      // Tính toán lại thông tin payment
      this.calculatePaymentInfo()

      // Check saveDraft
      this.handleSaveDraft()
    },
    formatNumericInput(index, field) {
      let value = this.trade.products[index][field];
      if(value) {
        value = this.currencyFormat((value + '').replaceAll(",", ""))
        this.trade.products[index][field] = value;
      }
    },

    showModal(type) {
      switch (type) {
        case 'customer':
          this.modalCustomer = true
          break;
        case 'promotion':
          this.modalPromotion = true
          break;
        case 'extraFee':
          this.modalExtraFee = true
          break;
        case 'currency':
          this.modalCurrency = true
          break;
        case 'payment':
          this.modalPayment = true
          break;
        case 'newBill':
          this.modalNewBill = true
          break;
        default:
          console.log('No modal show');
      }
    },

    setPaymentOptions() {
      this.paymentOptions['cash'].amount = this.trade.cash
      if (this.trade.cash) {
        this.paymentOptions['cash'].checked = true
      } else {
        this.paymentOptions['cash'].checked = false
      }
      this.paymentOptions['bank'].amount = this.trade.credit
      if (this.trade.credit) {
        this.paymentOptions['bank'].checked = true
      } else {
        this.paymentOptions['bank'].checked = false
      }
      this.paymentOptions['emoney'].amount = this.trade.e_money
      if (this.trade.e_money) {
        this.paymentOptions['emoney'].checked = true
      } else {
        this.paymentOptions['emoney'].checked = false
      }
    },

    updateBillInfo(billInfo) {
      this.trade.id = billInfo.id
      this.trade.bill_number = billInfo.bill_number
      this.trade.total = billInfo.total
      this.trade.sub_total = billInfo.sub_total
      this.trade.discount_amount = billInfo.discount_amount
      this.trade.vat_value = billInfo.vat_value
      this.trade.total_paid = billInfo.total_paid
      this.trade.cash = billInfo.cash
      this.trade.credit = billInfo.credit
      this.trade.e_money = billInfo.e_money
    },

    saveDraft(noti=false) {
      // Format trước khi save
      const products = this.formatProductBeforeSave()
      let trade = JSON.parse(JSON.stringify(this.trade))
      trade.products = products

      billApi.saveDraftBill(trade).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          const billInfo = res.data.data

          this.updateBillInfo(billInfo)

          // Set loại tiền
          this.setPaymentOptions()

          this.popToast('success', "Lưu nháp thành công!")

          // if(noti) {
          //   this.popToast('success', "Lưu nháp thành công!")
          // }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // Xác nhận thanh toán
    confirmPayment() {
      billApi.confirmPayment({id: this.trade.id}).then(res => {
        if(res != null && res.data != null && res.data.status == 200){

          this.trade.trade_status = 1
          this.modalPayment = false
          this.popToast('success', "Thanh toán thành công!")
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // Tạm tính toán tại client trước khi lấy tính toán từ API
    calculatePaymentInfo() {
      let total = 0;
      const oldTotal = JSON.parse(JSON.stringify(this.trade.total))

      // sub_total
      // const sub_total = this.trade.products.reduce((total, item) => total + parseInt((item.price_sell + '').replaceAll(",", "")) * parseFloat((item.quantity + '').replaceAll(",", "")), 0);
      const sub_total = this.trade.products.reduce((total, item) => {
        if (item.price_sell) {
          const price = parseInt((item.price_sell + '').replaceAll(",", ""));
          const quantity = parseFloat((item.quantity + '').replaceAll(",", ""));
          return total + price * quantity;
        }
        return total;
      }, 0);
      this.trade.sub_total = sub_total
      if(!this.trade.sub_total) {
        this.trade.sub_total = 0 
      }
      total += sub_total

      // Chi phí thêm
      total += this.trade.extra_fee

      // Giảm giá trực tiếp
      total -= this.trade.fixed_discount

      // Promotions
      // TODO

      // VAT
      if (
        this.trade.vat_percent !== 0 &&
        this.trade.vat_percent !== "0" &&
        this.trade.vat_percent !== null &&
        this.trade.vat_percent !== undefined
      ) {
        this.trade.vat_value = Math.floor(parseInt(total) * parseInt(this.trade.vat_percent) / 100);
        total += this.trade.vat_value;
      } else {
        this.trade.vat_value = 0;
        this.trade.vat_percent = 0;
      }

      // Loại tiền
      if (oldTotal != total) {
        this.trade.cash = total
        this.trade.credit = 0
        this.trade.e_money = 0
      }
        
      // Total
      this.trade.total = total;
    },

    // Tìm kiếm khách hàng
    searchCustomers() {
      billApi.searchCustomer({search_text: this.customerSearchQuery}).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.customerList = res.data.data
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // Chọn khách hàng trên model tìm kiếm
    selectCustomer(item) {
      this.trade.customer_id = item.id
      this.selectedCustomer = item
      this.modalCustomer = false

      // Check saveDraft
      this.handleSaveDraft()
    },

    // Tạo mới khách hàng
    createCustomer() {
      this.formCustomerErrors = { name: null, phone_number: null };

      // Validate tên
      if (!this.newCustomer.name.trim()) {
        this.formCustomerErrors.name = 'Vui lòng nhập tên khách hàng';
      }

      // Validate SĐT
      if (!this.newCustomer.phone_number.trim()) {
        this.formCustomerErrors.phone_number = 'Vui lòng nhập số điện thoại';
      } else if (!commonFunc.phoneNumberCheck(this.newCustomer.phone_number.trim())) {
        this.formCustomerErrors.phone_number = 'Số điện thoại không hợp lệ';
      }

      // Nếu có lỗi thì không submit
      if (this.formCustomerErrors.name || this.formCustomerErrors.phone_number) {
        return;
      }

      billApi.addCustomer(this.newCustomer).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.selectCustomer(res.data.data)
          this.resetNewCustomer();

          this.popToast('success', "Thêm mới khách hàng thành công!")
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    resetNewCustomer() {
      this.newCustomer = {
        name: '',
        type: '',
        phone_number: '',
        birthday: '',
        gender: '',
        mst: '',
        address: '',
      }
    },

    /**
     * Khuyến mãi
     */
    addPromotion(promo) {
      const exists = this.selectedPromotions.find(p => p.id === promo.id);
      if (!exists) {
        this.selectedPromotions.push({ ...promo, quantity: 1 });
      }
    },
    removePromotion(index) {
      this.selectedPromotions.splice(index, 1);
    },
    increaseQtyPmt(index) {
      this.selectedPromotions[index].quantity++;
    },
    decreaseQtyPmt(index) {
      if (this.selectedPromotions[index].quantity > 1) {
        this.selectedPromotions[index].quantity--;
      } else {
        this.removePromotion(index);
      }
    },
    applyPromotions() {
      this.trade.promotions = [...this.selectedPromotions];
      this.hideModalPmt()

      // TODO: kiểm tra nếu chọn product rồi thì lưu nháp luôn
      // TODO: UI phía trên, chưa chọn product thì chưa cho chọn pmt

      // Check saveDraft
      this.handleSaveDraft()
    },

    hideModalPmt() {
      this.$bvModal.hide('promotion-modal')
    },

    /**
     * Phụ thu
     */
     addExtraFee() {
      if (this.newFee.price <= 0) return;

      const existing = this.extraFees.find(item => item.type === this.newFee.type);
      if (existing) {
        existing.price += this.newFee.price;
      } else {
        this.extraFees.push({
          ...this.newFee
        });
      }

      // Reset input
      this.newFee.type = '0';
      this.newFee.price = 0;
    },
    removeExtraFee(index) {
      this.extraFees.splice(index, 1);
    },
    applyExtraFees() {
      for(const item of this.extraFees) {
        if(item.type == '0') {
          this.trade.extra_fee = item.price
        } else {
          this.trade.fixed_discount = item.price
        }
      }
      this.hideModalExtraFees()

      // Check saveDraft
      this.handleSaveDraft()
    },
    hideModalExtraFees() {
      this.$bvModal.hide('extraFee-modal')
    },

    /**
     * Loại tiền thanh toán
     */
    onCheckboxChange(type) {
      if (this.paymentOptions[type].checked) {
        this.paymentOptions[type].amount = this.trade.total;
      } else {
        this.paymentOptions[type].amount = 0;
      }
    },
    applyCurrency() {
      this.paymentError = '';

      const totalSelected = Object.values(this.paymentOptions)
        .filter(m => m.checked)
        .reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

      if (totalSelected < this.trade.total) {
        this.paymentError = 'Tổng tiền không được nhỏ hơn số tiền cần thanh toán';
        return;
      }

      if(this.paymentOptions['cash'].checked) {
        this.trade.cash = this.paymentOptions['cash'].amount
      }
      if(this.paymentOptions['bank'].checked) {
        this.trade.credit = this.paymentOptions['bank'].amount
      }
      if(this.paymentOptions['emoney'].checked) {
        this.trade.e_money = this.paymentOptions['emoney'].amount
      }

      this.hideModalCurrency()

      // TODO: kiểm tra nếu chọn product rồi thì lưu nháp luôn
      // TODO: UI phía trên, chưa chọn product thì chưa cho phí dv/Phụ thu

      // Check saveDraft
      this.handleSaveDraft()
    },

    hideModalCurrency() {
      this.$bvModal.hide('currency-modal')
    },

    /**
     * In hóa đơn: Mẫu in bill
     */
    printReceipt() {
      const printContent = this.$refs.receiptArea.innerHTML;
      var mywindow = window.open('', 'PRINT', 'height=900,width=1200');

      mywindow.document.write('<html><head><title> </title><style>');
      mywindow.document.write(' body {font-size: 12px;} ');
      mywindow.document.write(' table { border-collapse: collapse; width: 100%;} ');
      mywindow.document.write(' table td, table th { border: 1px solid #000; padding: 4px; } ');
      mywindow.document.write(' .print-text-center {text-align: center;} ');
      mywindow.document.write(' .print-border-top { border-top: 1px solid #000; } ');
      mywindow.document.write(' .print-border-bot { border-bottom: 1px solid #000; } ');

      mywindow.document.write('</style></head><body >');
      mywindow.document.write(printContent);
      mywindow.document.write('</body></html>');

      mywindow.document.close();
      mywindow.focus();

      setTimeout(function() {
        mywindow.print();
        mywindow.close();
      }, 1000);

      return true;
    },

    /**
     * In hóa đơn: Mẫu in bill GTGT
     */
     printInvoice() {
      const printContent = this.$refs.receiptArea.innerHTML;
      const win = window.open('', '', 'width=800,height=1000');
      win.document.write(`
        <html>
          <head>
            <title>Hóa đơn giá trị gia tăng</title>
            <style>
              body { font-family: Arial, sans-serif; font-size: 14px; margin: 0; padding: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #000; padding: 5px; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `);
      win.document.close();
    },
    numberToWords(number) {
      // bạn có thể dùng lib như `doc-so` hoặc mình có thể giúp viết riêng hàm đọc số tiền bằng chữ
      return 'Một triệu đồng'; // tạm fix cứng, sẽ xử lý ở bước sau
    },

    resetBill() {
      window.location.href = '/bill/create'
    },

    formatCurrency(value) {
      if (!value) return '0 đ';
      return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('vi-VN');
    },

    handlePaymentTypeChange() {
      if (this.paymentType == 'debt') {
        this.currentDebt.total_paid = this.trade.total_paid
        this.currentDebt.interest_rate = this.trade.interest_rate
        this.currentDebt.interest_period = this.trade.interest_period
        this.currentDebt.forewarning = this.trade.forewarning
        this.currentDebt.appointment_date = this.trade.appointment_date

        this.showDebtModal = true;
      } else {
        this.resetDebtInfo();
      }
    },
    resetDebtInfo() {
      this.trade.total_paid = this.trade.total
      this.trade.interest_rate = 0
      this.trade.interest_period = 'month'
      this.trade.appointment_date = null
      this.trade.forewarning = 30
    },
    cancelDebt() {
      this.showDebtModal = false;
      this.currentDebt = {
        total_paid: 0,
        interest_rate: 0,
        interest_period: 'month',
        appointment_date: null,
        forewarning: 30,
      }
    },
    applyDebt() {
      this.showDebtModal = false;
      const debt = JSON.parse(JSON.stringify(this.currentDebt))
      this.trade.total_paid = debt.total_paid
      this.trade.interest_rate = debt.interest_rate
      this.trade.interest_period = debt.interest_period
      this.trade.appointment_date = debt.appointment_date
      this.trade.forewarning = debt.forewarning

      // Check saveDraft
      this.handleSaveDraft()
    },

    /**
     * Only input float
     */
    integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },

  },
  
}
</script>

<style scoped>
  #bill-create {
    font-size: 0.6rem !important;
  }
  #bill-create h3,
  #bill-create h4,
  #bill-create h5,
  #bill-create h6 {
    font-size: 0.8rem !important;
  }
  #bill-create button,
  #bill-create .btn,
  #bill-create .b-button,
  #bill-create .custom-select,
  #bill-create .b-form-select,
  #bill-create .form-control
  #bill-create .input-group-text,
  #bill-create .form-input,
  #bill-create .input-group-text {
    font-size: 0.6rem !important;
  }
  .payment-info {
    font-size: 1rem !important;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .product-list {
    overflow-y: auto;
    max-height: 100%;
  }
  .custom-payment-modal .modal-content {
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    background: #ffffff;
  }

  .custom-payment-modal .modal-body {
    padding: 2rem 1.5rem;
  }

  .gap-3 > *:not(:last-child) {
    margin-right: 1rem;
  }
  
  .receipt-container {
    width: 72mm;
    font-family: monospace, Arial;
    font-size: 12px;
    background: #fff;
    color: #000;
  }

  .receipt-content {
    padding: 10px;
    border: 1px dashed #ccc;
  }

  .products-list {
    font-size: 13px;
  }
  .border-bottom {
    border-bottom: 1px dashed #ccc;
  }
  .font-weight-bold {
    font-weight: bold;
  }
  .small {
    font-size: 12px;
  }
  .font-big {
    font-size: 15px;
  }
  .mt-10 {
    margin-top: -10px;
  }

  .button-panel {
    min-width: 160px;
  }

  @media print {
    body * {
      visibility: hidden;
    }
    .receipt-container, .receipt-container * {
      visibility: visible;
    }
    .receipt-container {
      margin: 0;
      padding: 0;
      width: 80mm;
    }
  }
</style>
