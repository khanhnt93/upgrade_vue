<template>
  <div id="bill-create" class="flex flex-col" style="height: calc(100vh - 60px);">
    <div v-if="trade.trade_status == 0" class="flex flex-grow overflow-hidden">
      <!-- Nửa trái: Giỏ hàng -->
      <div class="w-1/2 p-3 flex flex-col h-full border-r border-gray-300">
        <h5>Sản phẩm đang chọn</h5>

        <!-- Danh sách giỏ hàng (cuộn) -->
        <div class="flex-grow overflow-auto">
          <div v-for="(item, index) in trade.products" :key="index" class="flex justify-between items-center mb-2 p-3 border border-gray-200 rounded bg-white">
            <div>
              <strong class="font-big">{{ item.name }}</strong><br />

              <!-- Sửa giá bán -->
              <div class="flex items-center mb-1" style="max-width: 150px;">
                <span class="bg-gray-100 border border-r-0 border-gray-300 px-2 py-1 text-sm rounded-l">₫</span>
                <input
                  type="text"
                  class="border border-gray-300 rounded-r px-2 py-1 text-sm flex-grow focus:outline-none focus:border-blue-500"
                  :value="item.price_sell"
                  @input="updatePrice(index, $event)"
                  @blur="formatNumericInput(index, 'price_sell')"
                  @change="calculatePaymentInfo(); handleSaveDraft();"
                />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-gray-600 text-sm">{{ item.unit_name }}</span>
              <button class="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600" @click="decreaseQty(index)">−</button>

              <!-- Sửa số lượng -->
              <input
                type="text"
                min="1"
                :value="item.quantity"
                @input="updateQty(index, $event)"
                @blur="formatNumericInput(index, 'quantity')"
                @change="calculatePaymentInfo(); handleSaveDraft();"
                class="border border-gray-300 rounded px-2 py-1 text-sm w-16 text-center focus:outline-none focus:border-blue-500"
              />
              <button class="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600" @click="increaseQty(index)">+</button>
              <button class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600" @click="removeItem(index)">×</button>
            </div>
          </div>
        </div>

        <!-- Tổng tiền & thông tin phụ -->
        <div class="mt-3">
          <h5 class="text-right text-xl font-semibold">Tổng tiền thanh toán: <span class="text-green-600">{{ currencyFormat(trade.total) }} đ</span></h5>

          <!-- Thông tin bổ sung -->
          <div class="mt-3 space-y-3 bg-gray-50 p-4 rounded">
            <div class="flex justify-between items-center">
              <span class="font-medium">Khách hàng:</span>
              <div class="flex items-center">
                <a href="javascript:void(0)" @click="showModal('customer')" class="text-blue-600 hover:underline">{{ selectedCustomer.name || 'Chưa chọn' }}</a>
                <button
                  v-if="selectedCustomer.name"
                  class="text-red-500 hover:text-red-700 ml-2 p-1"
                  @click="selectedCustomer = {}; trade.customer_id = null;"
                  title="Bỏ khách hàng đã chọn"
                >
                  <i class="fa fa-trash" />
                </button>
              </div>
            </div>
            <div class="flex justify-between">
              <span>Tổng tiền Sản phẩm:</span>
              <span class="font-semibold">{{ currencyFormat(trade.sub_total) || 0 }} đ</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Chi phí thêm / Giảm tiền:</span>
              <div class="flex items-center">
                <a href="javascript:void(0)" @click="showModal('extraFee')" class="text-blue-600 hover:underline">{{ currencyFormat(parseInt(trade.extra_fee) - parseInt(trade.fixed_discount)) }}</a>
                <button
                  v-if="trade.extra_fee || trade.fixed_discount"
                  class="text-red-500 hover:text-red-700 ml-2 p-1"
                  @click="trade.extra_fee = 0; trade.fixed_discount = 0; handleSaveDraft()"
                  title="Bỏ chi phí thêm / Giảm tiền"
                >
                  <i class="fa fa-trash" />
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span>Khuyến mãi:</span>
              <div class="flex items-center">
                <a href="javascript:void(0)" @click="showModal('promotion')" class="text-blue-600 hover:underline">{{ currencyFormat(trade.discount_amount) || 'Chưa áp dụng' }}</a>
                <button
                  v-if="trade.discount_amount"
                  class="text-red-500 hover:text-red-700 ml-2 p-1"
                  @click="trade.promotions = []; trade.discount_amount = 0; handleSaveDraft()"
                  title="Bỏ phụ thu"
                >
                  <i class="fa fa-trash" />
                </button>
              </div>
            </div>
            <!-- VAT -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="font-medium">Thuế VAT:</span>
                <input
                  type="checkbox"
                  v-model="trade.have_vat"
                  class="form-checkbox"
                  @change="onVatEnabledChange"
                />
                <div class="flex items-center" style="max-width: 100px;">
                  <input
                    type="number"
                    class="border border-gray-300 rounded-l px-2 py-1 text-sm w-16 focus:outline-none focus:border-blue-500"
                    v-model.number="trade.vat_percent"
                    :disabled="!trade.have_vat"
                    :class="{ 'bg-gray-100': !trade.have_vat }"
                    min="0"
                    max="100"
                    step="1"
                    @change="handleSaveDraft"
                  />
                  <span class="bg-gray-100 border border-l-0 border-gray-300 px-2 py-1 text-sm rounded-r">%</span>
                </div>
              </div>
              <!-- Tiền VAT -->
              <span class="font-semibold">{{ currencyFormat(trade.vat_value) || 0 }} đ</span>
            </div>

            <div class="flex justify-between">
              <span>Loại tiền:</span>
              <a href="javascript:void(0)" @click="showModal('currency')" class="text-blue-600 hover:underline">{{ selectedCurrency || 'Tiền mặt' }}</a>
            </div>

            <div class="flex justify-between items-center">
              <span>Loại thanh toán:</span>
              <div class="flex space-x-2">
                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="full"
                    v-model="paymentType"
                    @change="handlePaymentTypeChange"
                    class="form-radio"
                  />
                  <span class="text-sm">Tất toán</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="debt"
                    v-model="paymentType"
                    @change="handlePaymentTypeChange"
                    class="form-radio"
                  />
                  <span class="text-sm">Ghi nợ</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Nút hành động cuối cùng -->
        <div class="mt-auto pt-2 flex justify-between flex-wrap gap-2">
          <button
            v-if="trade.id"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            @click="router.push('/bill/history')"
          >
            Danh sách bill
          </button>

          <!-- In hóa đơn -->
          <button
            v-if="trade.id && trade.products.length"
            class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            @click="printReceipt(true)"
          >
            🧾 In hóa đơn tạm tính
          </button>

          <!-- Tạo bill mới -->
          <button
            v-if="trade.id"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            @click="showModal('newBill')"
          >
            Tạo bill mới
          </button>

          <!-- Lưu nháp -->
          <button
            v-if="trade.trade_status == 0 && trade.products.length"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            @click="saveDraft(true)"
          >
            Lưu nháp
          </button>

          <!-- Thanh toán -->
          <button
            v-if="trade.id && trade.trade_status == 0"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            @click="checkBeforeSell"
          >
            Thanh toán
          </button>
        </div>

      </div>

      <!-- Nửa phải: Danh sách sản phẩm -->
      <div class="w-1/2 p-3 flex flex-col h-full">
        <div class="flex items-center justify-between mb-4">
          <h5 class="text-xl font-semibold">Danh sách Sản phẩm</h5>
          <input
            v-model="searchProductQuery"
            @input="handleFilterProduct"
            placeholder="Tìm theo tên/mã sản phẩm..."
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            style="max-width: 250px;"
          />
        </div>

        <!-- Product group buttons -->
        <div class="mb-3">
          <button
            :class="['px-3 py-1 rounded mr-2 mt-1', activeGroupId === null ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500']"
            @click="handleSelectGroup(null)"
          >
            Tất cả
          </button>
          <button
            v-for="group in productGroups"
            :key="group.id || 'all'"
            :class="['px-3 py-1 rounded mr-2 mt-1', activeGroupId === group.id ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500']"
            @click="handleSelectGroup(group.id)"
          >
            {{ group.name }}
          </button>
        </div>

        <!-- Danh sách sản phẩm -->
        <div class="flex-grow overflow-auto product-list">
          <div class="bg-white border rounded mb-2 p-3 cursor-pointer hover:bg-gray-50"
            v-for="product in filteredProducts"
            :key="product.id"
          >
            <div class="flex items-center">
              <img
                :src="product.image"
                alt="Ảnh sản phẩm"
                @click="addToCart(product)"
                class="w-12 h-12 object-cover rounded mr-4"
              />
              <div class="flex-grow">
                <div class="font-semibold text-base cursor-pointer" @click="addToCart(product)">{{ product.name_full }}</div>
                <div class="flex text-sm text-gray-600">
                  <div class="flex-1 cursor-pointer" @click="addToCart(product)">
                    <span v-show="product.price_sell">Giá bán: <strong>{{ currencyFormat(product.price_sell) }} đ</strong></span>
                    <span v-show="!product.price_sell">Hàng chưa định giá bán</span>
                  </div>
                  <div class="flex items-center flex-1">
                    <span class="mr-2" v-show="product.price_buy != null" title="Xem giá nhập">
                      Giá nhập: <strong>{{ showBuyPrice[product.id] ? currencyFormat(product.price_buy) + ' đ' : '***' }}</strong>
                    </span>
                    <button
                      v-show="product.price_buy != null"
                      class="text-blue-500 hover:text-blue-700"
                      @click="toggleBuyPrice(product.id)"
                    >
                      <i v-show="!showBuyPrice[product.id]" class="fa fa-eye" aria-hidden="true" title="Xem giá nhập"></i>
                      <i v-show="showBuyPrice[product.id]" class="fa fa-eye-slash" aria-hidden="true" title="Đóng giá nhập"></i>
                    </button>
                    <span v-show="product.price_buy == null">Hàng chưa nhập kho</span>
                  </div>
                  <div class="text-right flex-1">
                    Đơn vị: {{ product.unit_name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ghi chú -->
        <div class="mt-4" v-show="trade.id">
          <textarea
            v-model="trade.note"
            placeholder="Ghi chú cho đơn hàng..."
            rows="2"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 mb-3"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Vùng hiển thị hóa đơn sau thanh toán -->
    <div v-if="trade.trade_status == 1" class="flex flex-grow">
      <!-- Nửa trái: Mẫu in hóa đơn -->
      <div class="w-1/2 p-3 flex flex-col h-full border-r border-gray-300">
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
                  <div>{{ currencyFormat(item.amount) }}</div>
                </div>
              </div>
            </div>
            <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <strong>Tổng cộng: </strong>
              <span>{{ currencyFormat(trade.sub_total) }}</span>
            </p>
            <p v-if="trade.extra_fee"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span>Chi phí thêm: </span>
              <span>{{ currencyFormat(trade.extra_fee) }}</span>
            </p>
            <p v-if="trade.fixed_discount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span>Giảm tiền: </span>
              <span>{{ currencyFormat(trade.fixed_discount) }}</span>
            </p>
            <p v-if="trade.discount_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span>Khuyến mãi:</span>
              <span>{{ currencyFormat(trade.discount_amount) }}</span>
            </p>
            <p v-if="trade.vat_value"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span>VAT:</span>
              <span>{{ currencyFormat(trade.vat_value) }}</span>
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
      <div class="w-1/2 p-3 flex flex-col h-full">
        <div class="space-y-4">
          <button class="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 flex items-center justify-center" @click="printReceipt(false)">
            🖨️ In hóa đơn
          </button>
          <!-- <button class="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 flex items-center justify-center" @click="printInvoice()">
            🧾 In hóa đơn GTGT
          </button> -->
          <button class="w-full bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 flex items-center justify-center" @click="resetBill()">
            🆕 Tạo bill mới
          </button>
        </div>
      </div>
    </div>

    <!-- Vùng in hoá đơn tạm tính -->
    <div ref="receiptAreaTemp" class="receipt-container"  style="display: none;">
      <div class="receipt-content">
        <div v-if="storeInfo.logo" style="display: flex; align-items: center; gap: 5px;">
          <!-- Logo -->
          <div style="flex: 1; max-width: 25%; padding-right: 5px;">
            <img :src="storeInfo.logo" alt="Spa" style="width: 100%; height: auto;" />
          </div>

          <!-- Thông tin -->
          <div style="flex: 1;">
            <h4 style="font-size: 22px; margin: 0;">
              <strong>{{ storeInfo.name }}</strong>
            </h4>
            <p style="margin: 4px 0;">Địa chỉ: {{ storeInfo.address }}</p>
            <p style="margin: 4px 0;">SĐT: {{ storeInfo.phone_number }}</p>
          </div>
        </div>

        <div v-if="!storeInfo.logo">
          <h3 style="font-size: 20px; text-align: center;"><strong>{{ storeInfo.name }}</strong></h3>
          <p style="text-align: center;">Địa chỉ: {{ storeInfo.address }}</p>
          <p style="text-align: center;">SĐT: {{ storeInfo.phone_number }}</p>
        </div>

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
              <div>{{ currencyFormat(item.amount) }}</div>
            </div>
          </div>
        </div>
        <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Tổng cộng: </strong>
          <span>{{ currencyFormat(trade.sub_total) }}</span>
        </p>
        <p v-if="trade.extra_fee"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <span>Chi phí thêm: </span>
          <span>{{ currencyFormat(trade.extra_fee) }}</span>
        </p>
        <p v-if="trade.fixed_discount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <span>Giảm tiền: </span>
          <span>{{ currencyFormat(trade.fixed_discount) }}</span>
        </p>
        <p v-if="trade.discount_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <span>Khuyến mãi:</span>
          <span>{{ currencyFormat(trade.discount_amount) }}</span>
        </p>
        <p v-if="trade.vat_value"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <span>VAT:</span>
          <span>{{ currencyFormat(trade.vat_value) }}</span>
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
    <div
      v-if="modalCustomer"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-full overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h5 class="text-lg font-semibold">Khách hàng</h5>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="modalCustomer = false">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-4">
          <!-- Form tìm kiếm -->
          <div class="flex gap-2 items-center mb-4">
            <input
              v-model="customerSearchQuery"
              placeholder="Nhập tên hoặc số điện thoại"
              class="border border-gray-300 rounded px-3 py-2 flex-grow focus:outline-none focus:border-blue-500"
            >
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="searchCustomers">
              Tìm kiếm
            </button>
          </div>

          <!-- Kết quả -->
          <div class="overflow-x-auto">
            <table class="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th v-for="f in customerFields" :key="f.key" class="border border-gray-300 px-2 py-1 text-left">{{ f.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in customerList" :key="item.id" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-2 py-1">{{ index + 1 }}</td>
                  <td class="border border-gray-300 px-2 py-1">{{ item.name }}</td>
                  <td class="border border-gray-300 px-2 py-1">{{ item.phone_number }}</td>
                  <td class="border border-gray-300 px-2 py-1">{{ item.birthday }}</td>
                  <td class="border border-gray-300 px-2 py-1">{{ item.gender_str }}</td>
                  <td class="border border-gray-300 px-2 py-1">{{ item.mst }}</td>
                  <td class="border border-gray-300 px-2 py-1">{{ item.address }}</td>
                  <td class="border border-gray-300 px-2 py-1">{{ item.type_str }}</td>
                  <td class="border border-gray-300 px-2 py-1">
                    <button class="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600" @click="selectCustomer(item)">Chọn</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tạo mới -->
          <div class="mt-6">
            <h6 class="text-md font-semibold mb-3">Tạo khách hàng mới:</h6>
            <form @submit.prevent="createCustomer">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng *</label>
                  <input
                    v-model="newCustomer.name"
                    required
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    :class="formCustomerErrors.name ? 'border-red-500' : ''"
                  >
                  <span v-if="formCustomerErrors.name" class="text-red-500 text-sm">{{ formCustomerErrors.name }}</span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Loại khách hàng</label>
                  <select v-model="newCustomer.type" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
                    <option v-for="option in optionsCustomerType" :key="option.value" :value="option.value">{{ option.text }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input
                    v-model="newCustomer.phone_number"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    :class="formCustomerErrors.phone_number ? 'border-red-500' : ''"
                  >
                  <span v-if="formCustomerErrors.phone_number" class="text-red-500 text-sm">{{ formCustomerErrors.phone_number }}</span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input type="date" v-model="newCustomer.birthday" :min="minDate" :max="maxDate" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select v-model="newCustomer.gender" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
                    <option v-for="option in optionsGender" :key="option.value" :value="option.value">{{ option.text }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mã số thuế</label>
                  <input v-model="newCustomer.mst" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input v-model="newCustomer.address" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div class="text-right mt-4">
                <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" type="submit">Tạo khách hàng</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>




    <!-- Modal khuyến mãi -->
    <div
      v-if="modalPromotion"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-full overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h5 class="text-lg font-semibold">Khuyến mãi</h5>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="modalPromotion = false">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-4">
          <!-- Danh sách khuyến mãi -->
          <div class="mb-6">
            <h6 class="text-md font-semibold mb-3">Danh sách khuyến mãi:</h6>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="promo in promotionList"
                :key="promo.id"
                class="bg-green-100 text-green-700 border border-green-300 px-3 py-2 rounded text-sm hover:bg-green-200"
                @click="addPromotion(promo)"
              >
                {{ promo.name }}
              </button>
            </div>
          </div>

          <!-- Danh sách khuyến mãi đã chọn -->
          <div v-if="selectedPromotions.length" class="mb-6">
            <h6 class="text-md font-semibold mb-3">Đã chọn:</h6>
            <div class="space-y-3">
              <div
                class="flex justify-between items-center bg-gray-50 p-3 rounded border"
                v-for="(promo, index) in selectedPromotions"
                :key="promo.id"
              >
                <div>
                  <strong class="text-gray-800">{{ promo.name }}</strong>
                </div>
                <div class="flex items-center gap-2">
                  <button class="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600" @click="decreaseQtyPmt(index)">−</button>
                  <span class="mx-2 font-semibold">{{ promo.quantity }}</span>
                  <button class="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600" @click="increaseQtyPmt(index)">+</button>
                  <button class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600" @click="removePromotion(index)">×</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Nút -->
          <div v-if="selectedPromotions.length" class="flex justify-between">
            <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" @click="hideModalPmt">Bỏ qua</button>
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" @click="applyPromotions">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Modal Chi phí thêm / Giảm tiền -->
    <div
      v-if="modalExtraFee"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-full overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h5 class="text-lg font-semibold">Chi phí thêm / Giảm tiền</h5>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="modalExtraFee = false">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-4">
          <!-- Form thêm phí -->
          <form @submit.prevent="addExtraFee" class="mb-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Loại phí:</label>
              <div class="flex gap-4">
                <label class="flex items-center space-x-2">
                  <input type="radio" v-model="newFee.type" name="type" value="0" class="form-radio" />
                  <span>Chi phí thêm</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="radio" v-model="newFee.type" name="type" value="1" class="form-radio" />
                  <span>Giảm tiền</span>
                </label>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Số tiền:</label>
              <input
                type="number"
                v-model.number="newFee.price"
                min="0"
                required
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Nhập số tiền"
              >
            </div>

            <div class="text-center">
              <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" type="submit">Thêm</button>
            </div>
          </form>

          <!-- Danh sách phí đã thêm -->
          <div v-if="extraFees.length" class="mb-6">
            <h6 class="text-md font-semibold mb-3">Đã thêm:</h6>
            <div class="space-y-3">
              <div
                class="flex justify-between items-center bg-gray-50 p-3 rounded border"
                v-for="(fee, index) in extraFees"
                :key="index"
              >
                <div>
                  <strong class="text-gray-800">{{ fee.type == '0' ? 'Chi phí thêm' : 'Giảm tiền' }}</strong>
                  <div class="text-sm text-gray-600">
                    {{ currencyFormat(fee.price) }}đ
                  </div>
                </div>
                <button class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600" @click="removeExtraFee(index)">×</button>
              </div>
            </div>
          </div>

          <!-- Nút -->
          <div v-if="extraFees.length" class="flex justify-between">
            <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" @click="hideModalExtraFees">Bỏ qua</button>
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" @click="applyExtraFees">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Modal chọn loại tiền thanh toán -->
    <div
      v-if="modalCurrency"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-full overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h5 class="text-lg font-semibold">Chọn loại tiền thanh toán</h5>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="modalCurrency = false">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-4">
          <!-- Tổng tiền cần thanh toán -->
          <p class="font-semibold text-center mb-4">
            Số tiền cần thanh toán: {{ currencyFormat(trade.total) }}
          </p>

          <!-- Các loại thanh toán -->
          <div v-for="(method, key) in paymentOptions" :key="key" class="mb-4">
            <label class="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                v-model="method.checked"
                @change="onCheckboxChange(key)"
                class="form-checkbox"
              >
              <span>{{ method.label }}</span>
            </label>
            <input
              v-model.number="method.amount"
              type="number"
              min="0"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              :placeholder="`Nhập số tiền ${method.label.toLowerCase()}`"
            >
          </div>

          <!-- Error nếu tổng nhỏ hơn -->
          <p v-if="paymentError" class="text-red-500 text-center font-semibold">
            {{ paymentError }}
          </p>

          <!-- Buttons -->
          <div class="flex justify-between mt-4">
            <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" @click="hideModalCurrency">Bỏ qua</button>
            <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" @click="applyCurrency">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Modal xác nhận thanh toán -->
    <div
      v-if="modalPayment"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6 text-center">
          <h4 class="text-xl font-semibold mb-4 text-blue-600">Xác nhận thanh toán</h4>

          <!-- Tên khách hàng -->
          <p class="mb-2 text-lg">
            👤 <strong>Khách hàng: {{ selectedCustomer.name || 'Chưa chọn khách hàng' }}</strong>
          </p>

          <!-- Số tiền thanh toán -->
          <p class="mb-4 text-2xl font-bold text-green-600">
            💰 {{ currencyFormat(trade.total_paid ? trade.total_paid : trade.total) }}
          </p>

          <!-- Số tiền ghi nợ -->
          <p v-show="trade.total_paid && trade.total_paid < trade.total" class="mb-4 text-2xl font-bold text-red-600">
            🧾 Ghi nợ: {{ currencyFormat(trade.total - trade.total_paid) }}
          </p>

          <!-- Buttons -->
          <div class="flex justify-center space-x-4">
            <button
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-full shadow-sm hover:bg-gray-300"
              @click="modalPayment = false"
            >
              ❌ Hủy
            </button>
            <button
              class="px-6 py-2 bg-green-500 text-white rounded-full shadow-sm hover:bg-green-600"
              @click="confirmPayment"
            >
              ✅ Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận tạo bill mới -->
    <div
      v-if="modalNewBill"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6 text-center">
          <h4 class="text-xl font-semibold mb-4 text-blue-600">Xác nhận tạo bill mới</h4>
          <hr class="mb-4">

          <p class="mb-4 font-medium">
            Thông tin bill hiện tại đã được lưu nháp tại "Danh sách bill", bạn có thể chỉnh sửa hoặc xóa bill này nếu muốn!
          </p>

          <div class="flex justify-center space-x-4">
            <button
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-full shadow-sm hover:bg-gray-300"
              @click="modalNewBill = false"
            >
              ❌ Hủy
            </button>
            <button
              class="px-6 py-2 bg-green-500 text-white rounded-full shadow-sm hover:bg-green-600"
              @click="resetBill"
            >
              ✅ Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal ghi nợ -->
    <div
      v-if="showDebtModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-full overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h5 class="text-lg font-semibold">Thông tin ghi nợ</h5>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="showDebtModal = false">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-4">
          <div class="space-y-4">
            <div>
              <h4 class="text-lg font-semibold text-blue-600">Số tiền cần thanh toán: <span class="text-green-600">{{currencyFormat(trade.total)}}</span></h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label class="text-sm font-medium text-gray-700">Số tiền khách trả:</label>
              <div class="md:col-span-2">
                <input
                  id="total_paid"
                  type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  v-model="currentDebt.total_paid"
                  autocomplete="new-password"
                  maxlength="14"
                  placeholder="Nhập số tiền khách trả"
                  @keyup="integerAndPointOnly($event.target)">
              </div>
            </div>

            <div v-show="currentDebt.total_paid && currentDebt.total_paid < trade.total">
              <h4 class="text-lg font-semibold text-red-600">Số tiền ghi nợ: <span>{{currencyFormat(trade.total - currentDebt.total_paid)}}</span></h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label class="text-sm font-medium text-gray-700">Lãi suất (%):</label>
              <div class="md:col-span-2">
                <input
                  id="interest_rate"
                  type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  v-model="currentDebt.interest_rate"
                  autocomplete="new-password"
                  maxlength="5"
                  placeholder="Nhập lãi suất"
                  @keyup="integerAndPointOnly($event.target)">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label class="text-sm font-medium text-gray-700">Kỳ hạn tính lãi:</label>
              <div class="md:col-span-2">
                <select class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  id="interest_period"
                  v-model="currentDebt.interest_period">
                  <option v-for="option in periodOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label class="text-sm font-medium text-gray-700">Ngày hẹn thanh toán:</label>
              <div class="md:col-span-2">
                <datepicker
                  v-model="currentDebt.appointment_date"
                  format="yyyy-MM-dd"
                  :typeable="true"
                  placeholder="Chọn ngày hẹn thanh toán"
                  input-class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                ></datepicker>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label class="text-sm font-medium text-gray-700">Nhắc hẹn trước (ngày):</label>
              <div class="md:col-span-2">
                <input
                  id="forewarning"
                  type="text"
                  maxlength="14"
                  autocomplete="new-password"
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  v-model="currentDebt.forewarning"
                  placeholder="Số ngày nhắc trước"
                  @keyup="integerOnly($event.target)">
              </div>
            </div>

            <div class="flex justify-between pt-4">
              <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" @click="cancelDebt">Bỏ qua</button>
              <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" @click="applyDebt">Áp dụng</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Modal cảnh báo bán quá số lượng trong kho -->
    <div
      v-if="showModalConfirmSell"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-full overflow-y-auto">
        <div class="p-6">
          <div class="text-center mb-6">
            <h4 class="text-xl font-semibold text-green-600">Sản phẩm bán vượt quá số lượng trong kho</h4>
          </div>

          <hr class="mb-6">

          <div class="overflow-x-auto mb-6">
            <table class="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th v-for="f in productImportFields" :key="f.key" class="border border-gray-300 px-3 py-2 text-left">{{ f.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in productNotEnoughQuantity" :key="item.stt" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-3 py-2">{{ item.stt }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ item.name }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ item.quantity_repo }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ item.quantity }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between">
            <button class="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600" @click="hideModalConfirmSell">
              Hủy bán
            </button>
            <button
              class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              @click="modalPayment = true; hideModalConfirmSell();"
            >
              Tiếp tục bán
            </button>
          </div>
        </div>
      </div>
    </div>



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
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'


export default {
  components: {
    Datepicker
  },
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    const route = useRoute()
    return { toast, router, route }
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
      showModalConfirmSell: false,
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
      optionsCustomerType: [
        {value: '0', text: 'Cá nhân'},
        {value: '1', text: 'Cty'}
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
      minDate: '1926-01-01',
      maxDate: '2099-01-01'
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
    const today = new Date()

    this.maxDate = today.toISOString().split('T')[0]

    const minDateObj = new Date()
    minDateObj.setFullYear(minDateObj.getFullYear() - 100)

    this.minDate = minDateObj.toISOString().split('T')[0]


    // check Add hay edit
     const path = window.location.pathname;
     if(path.includes('bill/edit')) {
      const billId = this.route.params.id;
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
      this.toast(content, variant === 'danger' ? 'error' : variant)
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
          const price_sell = (product.price_sell + '').replaceAll(",", "")
          product.price_sell = this.currencyFormat(price_sell)
          const quantity = (product.quantity + '').replaceAll(",", "")
          product.quantity = this.currencyFormat(quantity)
          product.amount = parseInt(parseInt(price_sell) * parseFloat(quantity))
        }
      }
      this.trade.products = products
    },

    formatProductBeforeSave() {
      const products = JSON.parse(JSON.stringify(this.trade.products))
      if(products && products.length > 0) {
        for(const product of products) {
          const price_sell = parseInt((product.price_sell + '').replaceAll(",", ""))
          product.price_sell = price_sell
          const quantity = parseFloat((product.quantity + '').replaceAll(",", ""))
          product.quantity = quantity
          product.amount = parseInt(parseInt(price_sell) * parseFloat(quantity))
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
        this.showModalConfirmSell = true
        return
      }
      this.modalPayment = true
    },

    hideModalConfirmSell() {
      this.showModalConfirmSell = false
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
      const parsed = parseInt(value);
      if (!isNaN(parsed)) {
        this.trade.products[index].price_sell = parsed;
      }
    },
    // Cập nhật số lượng
    updateQty(index, value) {
      const parsed = parseFloat(value);
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
      console.log("aaaaaaaaaaaaaaaaa")
      let value = this.trade.products[index][field];
      console.log(value)
      if(value) {
        value = this.currencyFormat((value + '').replaceAll(",", ""))
        this.trade.products[index][field] = value;
      }

      console.log(value)
      console.log("aaaaaaaaaaaaaaaaa")
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

      let sub_total = 0
      for(let item of this.trade.products) {
        if (item.price_sell) {
          const price = parseInt((item.price_sell + '').replaceAll(",", ""));
          const quantity = parseFloat((item.quantity + '').replaceAll(",", ""));
          const amount = parseInt(price * quantity);
          item.amount = amount
          sub_total += amount
        }
      }
      // const sub_total = this.trade.products.reduce((total, item) => {
      //   if (item.price_sell) {
      //     const price = parseInt((item.price_sell + '').replaceAll(",", ""));
      //     const quantity = parseFloat((item.quantity + '').replaceAll(",", ""));
      //     return total + price * quantity;
      //   }
      //   return total;
      // }, 0);
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
      this.trade.total_paid = total
      this.paymentType = 'full'
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
      this.modalPromotion = false
    },

    hideModalExtraFees() {
      this.modalExtraFee = false
    },

    hideModalCurrency() {
      this.modalCurrency = false
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
      this.modalExtraFee = false
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
      this.modalCurrency = false
    },

    /**
     * In hóa đơn: Mẫu in bill
     */
    printReceipt(isTemp) {
      let printContent = null
      if(isTemp) {
        printContent = this.$refs.receiptAreaTemp.innerHTML;
      } else {
        printContent = this.$refs.receiptArea.innerHTML;
      }

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
