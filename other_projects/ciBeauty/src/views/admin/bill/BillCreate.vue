<template>
  <div id="bill-create" class="d-flex flex-column" style="height: calc(100vh - 60px);">
    <div v-if="!trade.is_payment" class="d-flex flex-grow-1 overflow-hidden">
      <!-- Nửa trái: Giỏ hàng -->
      <div class="w-50 p-3 d-flex flex-column h-100 border-right">
        <h5>Dịch vụ đang chọn</h5>

        <!-- Danh sách giỏ hàng (cuộn) -->
        <ul class="list-group flex-grow-1 overflow-auto">
          <li
            v-for="(item, index) in trade.services"
            :key="index"
            class="list-group-item pb-2"
          >
            <!-- Thông tin sản phẩm + nút -->
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <strong class="font-big">{{ item.name }}</strong><br />

                <!-- Sửa giá bán -->
                <div class="input-group mb-1" style="max-width: 150px;">
                  <div class="input-group-prepend">
                    <span class="input-group-text">₫</span>
                  </div>
                  <input class="form-control"
                    type="text"
                    :value="item.price"
                    @input="updatePrice(index, $event)"
                    @blur="formatNumericInput(index, 'price')"
                    @change="calculatePaymentInfo(); handleSaveDraft();"
                  />
                </div>
              </div>
              <div class="d-flex align-items-center">
                <button class="btn btn-outline-primary" size="sm" @click="decreaseQty(index)">−</button>
                <span class="mx-2">{{ item.quantity }}</span>
                <button class="btn btn-outline-primary" size="sm" @click="increaseQty(index)">+</button>
                <button class="btn ml-2 btn-outline-danger" size="sm" @click="removeItem(index)">×</button>
              </div>
            </div>

            <!-- Nhân viên -->
            <div class="d-flex align-items-center mb-1 pb-2" :style="{ borderBottom: '1px solid #dee2e6' }">
              <!-- NV làm DV -->
              <label class="mr-2 mb-0" style="white-space: nowrap;"><small>NV làm DV:</small></label>
              <select class="form-control flex-grow-1 mr-3"
                v-model="item.staff_id"
                @change="saveDraft">
                <option :value="null" disabled>Chọn...</option>
                <option v-for="staff in staffList" :key="staff.value" :value="staff.value">
                  {{ staff.text }}
                </option>
              </select>

              <!-- NV sale DV -->
              <label class="mr-2 mb-0" style="white-space: nowrap;"><small>NV sale DV:</small></label>
              <select class="form-control flex-grow-1"
                v-model="item.staff_sale_id"
                @change="saveDraft">
                <option :value="null" disabled>Chọn...</option>
                <option v-for="staff in staffList" :key="staff.value" :value="staff.value">
                  {{ staff.text }}
                </option>
              </select>
            </div>
          </li>
        </ul>

        <!-- Tổng tiền & thông tin phụ -->
        <div class="mt-3">
          <h5 class="text-right">Tổng tiền thanh toán: <b>{{ currencyFormat(trade.total) }} đ</b></h5>

          <!-- Thông tin bổ sung -->
          <div class="mt-3 payment-info">
            <div class="d-flex justify-content-between">
              <span>Khách hàng:</span>
              <div class="d-flex align-items-center justify-content-end">
                <a class="text-blue-600 hover:underline" @click="showModal('customer')">{{ selectedCustomer.name || 'Chưa chọn' }}</a>
                <!-- Icon xoá nếu đã chọn khách -->
                <button class="btn p-0 ml-2 text-danger"
                  v-if="selectedCustomer.name"
                  @click="selectedCustomer = {}; trade.customer_id = null; trade.cards = []; isUpdateBillCustomer = false; updateBillCustomer(false)"
                  title="Bỏ khách hàng đã chọn"
                >
                  <i class="fa fa-trash" />
                </button>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <span>Tổng tiền dịch vụ:</span>
              <span>{{ currencyFormat(trade.sub_total) || 0 }} đ</span>
            </div>
            <div class="d-flex justify-content-between">
              <span>Đã thanh toán trước:</span>
              <span>{{ currencyFormat(trade.prepay_amount) || 0 }} đ</span>
            </div>
            <div class="d-flex justify-content-between">
              <span>Phụ thu:</span>
              <div class="d-flex align-items-center justify-content-end">
                <a class="text-blue-600 hover:underline" @click="showModal('surcharge')">{{ currencyFormat(trade.surcharge_amount) || 'Chưa áp dụng' }}</a>
                <!-- Icon xoá nếu đã chọn khách -->
                <button class="btn p-0 ml-2 text-danger"
                  v-if="trade.surcharge_amount"
                  @click="trade.surcharge = []; trade.surcharge_amount = 0; handleSaveDraft()"
                  title="Bỏ phụ thu"
                >
                  <i class="fa fa-trash" />
                </button>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <span>Khuyến mãi:</span>
              <div class="d-flex align-items-center justify-content-end">
                <a class="text-blue-600 hover:underline" @click="showModal('promotion')">{{ currencyFormat(trade.discount_amount) || 'Chưa áp dụng' }}</a>
                <!-- Icon xoá nếu đã chọn khách -->
                <button class="btn p-0 ml-2 text-danger"
                  v-if="trade.discount_amount"
                  @click="trade.pmts = []; trade.discount_amount = 0; handleSaveDraft()"
                  title="Bỏ phụ thu"
                >
                  <i class="fa fa-trash" />
                </button>
              </div>
            </div>
            <!-- VAT -->
            <div class="d-flex align-items-center">
              <!-- Label -->
               <span>Thuế VAT:</span>

              <!-- Checkbox -->
              <input type="checkbox" class="form-check-input mr-3"
                v-model="vatEnabled"
                switch
                
                size="sm"
                @change="onVatEnabledChange"
              >

              <!-- Input % VAT -->
              <div class="input-group mr-3" style="max-width: 100px;">
                <input class="form-control"
                  type="number"
                  v-model.number="trade.vat_percent"
                  :disabled="!vatEnabled"
                  min="0"
                  max="100"
                  step="1"
                  @change="handleSaveDraft"
                >
                <div class="input-group-append">
                  <span class="input-group-text">%</span>
                </div>
              </div>

              <!-- Tiền VAT -->
              <span class="ml-auto">{{ currencyFormat(trade.vat_value) || 0 }} đ</span>
            </div>

            <div v-if="trade.id && trade.customer_id" class="d-flex justify-content-between">
              <span>Thẻ dịch vụ lần/Thẻ tiền:</span>
              <a class="text-blue-600 hover:underline" @click="showModal('cards')">{{ currencyFormat(trade.card_amount) || 0  }} đ</a>
            </div>

            <div class="d-flex justify-content-between">
              <span>Loại tiền:</span>
              <a class="text-blue-600 hover:underline" @click="showModal('currency')">{{ selectedCurrency || 'Tiền mặt' }}</a>
            </div>
          </div>
        </div>

        <!-- Nút hành động cuối cùng -->
        <div class="mt-auto pt-2 d-flex justify-content-between">
          <button class="btn big-button btn-primary"
            v-if="trade.id"
            @click="$router.push('/bill/history')"
          >
            Danh sách bill
          </button>

          <!-- Tạo bill mới -->
          <button class="btn big-button btn-success"
            v-if="trade.id"
            @click="showModal('newBill')"
          >
            Tạo bill mới
          </button>

          <!-- Lưu nháp -->
          <button class="btn big-button btn-secondary" v-if="!trade.is_payment && trade.services.length"
            @click="saveDraft(true)">Lưu nháp</button>

          <!-- Thanh toán -->
          <button class="btn big-button btn-danger" v-if="trade.id && !trade.is_payment"
            @click="checkPayment">Thanh toán</button>
        </div>

      </div>

      <!-- Nửa phải: Danh sách sản phẩm -->
      <div class="w-50 p-3 d-flex flex-column h-100">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <h5 class="mb-0">Danh sách dịch vụ</h5>
          <input class="form-control ml-3"
            v-model="searchServiceQuery"
            @input="handleFilterService"
            placeholder="Tìm theo tên dịch vụ ..."
            size="sm"
            
            style="max-width: 250px;"
          />
        </div>
        <!-- <h5>Danh sách dịch vụ</h5> -->
        <!-- Danh sách nhóm sản phẩm -->
         <div class="mb-3">
            <button class="btn"
              :class="{ 
                'mr-1 mt-1': true, 
                'smallBtn': productGroups.length >= 10,
                'btn-primary': activeGroupId === null,
                'btn-outline-primary': activeGroupId !== null
              }"
              @click="handleSelectGroup(null)"
            >
              Tất cả
            </button>
            <button class="btn"
              :class="{ 
                'mr-1 mt-1': true, 
                'smallBtn': productGroups.length >= 10,
                'btn-primary': activeGroupId === group.id,
                'btn-outline-primary': activeGroupId !== group.id
              }"
              v-for="group in productGroups"
              :key="group.id || 'all'"
              @click="handleSelectGroup(group.id)"
            >
              {{ group.name }}
            </button>
        </div>

        <!-- Danh sách sản phẩm -->
        <div class="flex-grow-1 overflow-auto product-list">
          <div class="bg-white rounded-lg shadow-md p-4 mb-2 cursor-pointer"  v-for="product in filteredProducts"
            :key="product.id"
            
            @click="addToCart(product)"
            no-body
          >
            <div class="d-flex align-items-center">
              <img
                :src="product.image"
                alt="Ảnh sản phẩm"
                class="img-fluid rounded"
                style="width: 50px; height: 50px; object-fit: cover; margin-right: 15px;"
              />
              <div class="flex-grow-1">
                <div class="font-weight-bold" style="font-size: 1rem;">{{ product.name }}</div>
                <div class="text-muted" style="font-size: 0.8rem;">{{ currencyFormat(product.price) }} đ</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Thời gian và ghi chú -->
        <div class="mt-3 d-flex flex-grow-1" v-show="trade.id">
          <!-- Cột trái: 2 nút, căn trái -->
          <div class="d-flex flex-column align-items-start me-3 mr-3" style="width: 200px">
            <!-- In hóa đơn -->
            <button class="btn mt-3 btn-outline-warning"
              v-if="trade.id && trade.services.length"
              style="width: 100%"
              @click="printReceipt(true)"
            >
              🧾 In hóa đơn tạm tính
            </button>

            <!-- In phiếu tư vấn -->
            <button class="btn mt-3 btn-outline-primary"
              v-if="trade.id"
              style="width: 100%"
              @click="printConsultationForm"
            >
              🖨️ In phiếu tư vấn
            </button>
          </div>

          <!-- Cột phải: rộng còn lại -->
          <div class="flex-grow-1" v-if="trade.id">
            <div class="d-flex justify-content-between mb-2">
              <div>
                <strong>Thời gian khách vào: </strong>
                <span>{{ trade.order_at.slice(0, 16).replace("T", " ") }}</span>
              </div>
              <!-- <div>
                <strong>Thời gian làm DV: </strong>
                <span>{{ serviceTime.hours }} giờ {{ serviceTime.minutes }} phút</span>
              </div> -->
            </div>

            <textarea class="form-control"
              v-model="trade.note"
              placeholder="Ghi chú cho đơn hàng..."
              rows="2"
              max-rows="4"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Vùng hiển thị hóa đơn sau thanh toán -->
    <div v-if="trade.is_payment" class="d-flex flex-grow-1">
      <!-- Nửa trái: Mẫu in hóa đơn -->
      <div class="w-50 p-3 d-flex flex-column h-100 border-right">
        <div ref="receiptArea" class="receipt-container">
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
              <h3 style="font-size: 22px; text-align: center;"><strong>{{ storeInfo.name }}</strong></h3>
              <p style="text-align: center;">Địa chỉ: {{ storeInfo.address }}</p>
              <p style="text-align: center;">SĐT: {{ storeInfo.phone_number }}</p>
            </div>

            <h4 style="font-size: 22px; text-align: center; margin-bottom: 0.3rem; margin-top: 0.3rem;">
              <strong>{{ idsUseInvoice.includes(storeInfo.id) ? "INVOICE" : "HÓA ĐƠN THANH TOÁN" }}</strong>
            </h4>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 0;">
              <p>Số hóa đơn: {{ trade.bill_number }}</p>
              <p>Ngày: {{ getDateNow() }}</p>
            </div>
            <p v-if="selectedCustomer.id" style="margin: 0;">Khách hàng: {{ selectedCustomer.id + " - " + selectedCustomer.name }}</p>
            

            <!-- Danh sách dịch vụ -->
            <div style="font-size: 13px; margin-bottom: 0.5rem;">
              <div style="display: flex; padding-top:5px; justify-content: space-between; font-size: 0.875rem; border-bottom: 1px solid #4d4d4d; border-top: 1px solid #4d4d4d;">
                <div>Dịch vụ/Giá</div>
                <div>Số lượng</div>
                <div>Thành tiền</div>
              </div>
              <div v-for="(item, i) in trade.services" :key="i" style="border-bottom: 1px solid #4d4d4d;">
                <!-- Tên dịch vụ -->
                <div>
                  {{ item.name }}
                </div>
                <!-- Giá / SL / Thành tiền -->
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                  <div>{{ currencyFormat(item.price) }}</div>
                  <div>{{ currencyFormat(item.quantity) }}</div>
                  <div>{{ currencyFormat(item.amount) }}</div>
                </div>
              </div>
            </div>
            <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <strong>Tổng cộng: </strong>
              <span>{{ currencyFormat(trade.sub_total) }}</span>
            </p>
            <p v-if="trade.prepay_amount || trade.card_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span>Đã thanh toán trước: </span>
              <span>{{ currencyFormat(trade.prepay_amount + trade.card_amount) }}</span>
            </p>
            <p v-if="trade.surcharge_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span>Phụ thu: </span>
              <span>{{ currencyFormat(trade.surcharge_amount) }}</span>
            </p>
            <p v-if="trade.discount_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span>Giảm giá:</span>
              <span>{{ currencyFormat(trade.discount_amount) }}</span>
            </p>
            <p v-if="trade.vat_value"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span>VAT:</span>
              <span>{{ currencyFormat(trade.vat_value) }}</span>
            </p>
            <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <strong>Thanh toán:</strong>
              <strong>{{ currencyFormat(trade.total) }}</strong>
            </p>

            <div v-show="trade.is_payment && trade.total && this.bankAccount && this.bankAccount.id" style="text-align: center;">
              <img :src="qrImageUrl" alt="QR code" style="width: 100%; max-width: 5cm; margin: 10px auto;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Nửa phải: Các buttons  -->
      <div class="w-50 p-3 d-flex flex-column h-100">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-full">
            <div class="form-group" label="Chọn tài khoản thanh toán">
              <select class="form-control"
                v-model="bankAccountId"
                @change="changeBankAccount">
                <option v-for="option in bankAccountOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-full">
            <button class="btn btn-outline-primary pull-left px-4 btn-width-220" @click="printReceipt(false)">
              🖨️ In hóa đơn
            </button>
          </div>
        </div>
        <!-- <div class="grid grid-cols-12 gap-4 mt-4">
          <div class="col-span-full">
            <button class="btn btn-outline-primary pull-left px-4 btn-width-220" @click="printInvoice()">
              🧾 In hóa đơn GTGT
            </button>
          </div>
        </div> -->
        <div class="grid grid-cols-12 gap-4 mt-4">
          <div class="col-span-full">
            <button class="btn btn-outline-success pull-left px-4 btn-width-220" @click="resetBill()">
              🆕 Tạo bill mới
            </button>
          </div>
        </div>
      </div>
    </div>

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

        <h4 style="font-size: 22px; text-align: center; margin-bottom: 0.5rem; margin-top: 0.5rem;">
          <strong>{{ idsUseInvoice.includes(storeInfo.id) ? "PROFORMA INVOICE" : "HÓA ĐƠN TẠM TÍNH" }}</strong>
        </h4>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 0;">
          <p>Số hóa đơn: {{ trade.bill_number }}</p>
          <p>Ngày: {{ getDateNow() }}</p>
        </div>
        <p v-if="selectedCustomer.id" style="margin: 0;">Khách hàng: {{ selectedCustomer.id + " - " + selectedCustomer.name }}</p>

        <!-- Danh sách dịch vụ -->
        <div style="font-size: 13px; margin-bottom: 0.5rem;">
          <div style="display: flex; padding-top:5px; justify-content: space-between; font-size: 0.875rem; border-bottom: 1px solid #4d4d4d; border-top: 1px solid #4d4d4d;">
            <div>Dịch vụ/Giá</div>
            <div>Số lượng</div>
            <div>Thành tiền</div>
          </div>
          <div v-for="(item, i) in trade.services" :key="i" style="border-bottom: 1px solid #4d4d4d;">
            <!-- Tên dịch vụ -->
            <div>
              {{ item.name }}
            </div>
            <!-- Giá / SL / Thành tiền -->
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <div>{{ currencyFormat(item.price) }}</div>
              <div>{{ currencyFormat(item.quantity) }}</div>
              <div>{{ currencyFormat(item.amount) }}</div>
            </div>
          </div>
        </div>
        <p style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Tổng cộng: </strong>
          <span>{{ currencyFormat(trade.sub_total) }}</span>
        </p>
        <p v-if="trade.prepay_amount || trade.card_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Đã thanh toán trước: </strong>
          <span>{{ currencyFormat(trade.prepay_amount + trade.card_amount) }}</span>
        </p>
        <p v-if="trade.surcharge_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Phụ thu: </strong>
          <span>{{ currencyFormat(trade.surcharge_amount) }}</span>
        </p>
        <p v-if="trade.discount_amount"  style="display: flex; justify-content: space-between; font-size: 0.875rem;">
          <strong>Giảm giá:</strong>
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

        <!-- <div v-if="printer_image" style="border-top: 1px solid #4d4d4d;">
          <img :src="printer_image" alt="Spa" style="width: 100%; height: auto;" />
        </div> -->
      </div>
    </div>

    <!-- Modal Khách hàng -->
    <div v-if="modalCustomer" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-6"> <!-- size=xl equivalent -->
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Khách hàng</h5>
          <button @click="modalCustomer = false" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <div class="p-6">
          <div>
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a class="nav-link cursor-pointer" :class="{ active: activeCustomerTab === 'search' }" @click="activeCustomerTab = 'search'">Khách hàng cũ</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link cursor-pointer" :class="{ active: activeCustomerTab === 'create' }" @click="activeCustomerTab = 'create'">Thêm mới</a>
                </li>
              </ul>

              <!-- Tab 1: Tìm kiếm -->
              <div v-show="activeCustomerTab === 'search'">
                  <!-- Form tìm kiếm -->
                  <div class="my-3 d-flex gap-2 align-items-center">
                      <input class="form-control mr-2"
                      type="number"
                      v-model="customerSearch.id"
                      placeholder="Nhập ID"
                      maxlength="11"
                      
                      >
                      <input class="form-control mr-2"
                      v-model="customerSearch.name"
                      placeholder="Nhập tên"
                      maxlength="255"
                      
                      >
                      <input class="form-control mr-2"
                      v-model="customerSearch.phone"
                      placeholder="Nhập số điện thoại"
                      maxlength="15"
                      
                      >
                      <input class="form-control"
                      v-model="customerSearch.email"
                      placeholder="Nhập email"
                      maxlength="255"
                      >
                      <button class="btn btn-primary ml-2" @click="searchCustomers" style="white-space: nowrap;">
                        Tìm kiếm
                      </button>
                  </div>

                  <!-- Kết quả -->
                  <table class="table table-bordered table-striped table-sm">
                    <thead>
                      <tr>
                        <th v-for="field in customerFields" :key="field.key">{{ field.label }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in customerList" :key="index">
                        <td v-for="field in customerFields" :key="field.key" :data-label="field.label">
                          <div v-if="field.key === 'index'">
                            {{ index + 1 }}
                          </div>
                          <div v-else-if="field.key === 'action'">
                            <button class="btn btn-primary" @click="selectCustomer(item)">
                              Chọn
                            </button>
                          </div>
                          <div v-else>
                            {{ item[field.key] }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
              </div>

              <!-- Tab 2: Tạo mới -->
              <div v-show="activeCustomerTab === 'create'">
                  <form @submit.prevent="createCustomer">
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-6">
                        <div class="form-group" label="Tên khách hàng *"
                          :state="formCustomerErrors.name ? false : null"
                          :invalid-feedback="formCustomerErrors.name"
                        >
                          <input class="form-control" v-model="newCustomer.name" :state="formCustomerErrors.name ? false : null">
                        </div>
                      </div>
                      <div class="col-span-6">
                        <div class="form-group" label="Email"
                        :state="formCustomerErrors.email ? false : null"
                        :invalid-feedback="formCustomerErrors.email">
                          <input class="form-control" v-model="newCustomer.email" :state="formCustomerErrors.email ? false : null">
                        </div>
                      </div>
                      <div class="col-span-6">
                        <div class="form-group" label="Số điện thoại *"
                          :state="formCustomerErrors.phone_number ? false : null"
                          :invalid-feedback="formCustomerErrors.phone_number"
                        >
                          <input class="form-control" v-model="newCustomer.phone_number" :state="formCustomerErrors.phone_number ? false : null">
                        </div>
                      </div>
                      <div class="col-span-6">
                        <div class="form-group" label="Ngày sinh">
                          <input class="form-control" type="date" v-model="newCustomer.birthday">
                        </div>
                      </div>
                      <div class="col-span-6">
                        <div class="form-group" label="Giới tính">
                          <select class="form-control" v-model="newCustomer.gender">
                            <option v-for="option in optionsGender" :key="option.value" :value="option.value">
                              {{ option.text }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="col-span-6">
                        <div class="form-group" label="Nghề nghiệp">
                          <input class="form-control" v-model="newCustomer.industry">
                        </div>
                      </div>
                      <div class="col-span-6">
                        <div class="form-group" label="Quốc tịch">
                          <input class="form-control" v-model="newCustomer.national_code">
                        </div>
                      </div>
                      <div class="col-span-6">
                        <div class="form-group" label="Mã số thuế">
                          <input class="form-control" v-model="newCustomer.mst">
                        </div>
                      </div>
                      <div class="col-span-12">
                        <div class="form-group" label="Địa chỉ">
                          <input class="form-control" v-model="newCustomer.address">
                        </div>
                      </div>
                    </div>

                    <div class="text-right mt-3">
                      <button class="btn btn-success" type="submit">Xác nhận</button>
                    </div>
                  </form>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal khuyến mãi -->
    <!-- Modal khuyến mãi -->
    <div v-if="modalPromotion" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-6">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Khuyến mãi</h5>
          <button @click="modalPromotion = false" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <!-- Danh sách khuyến mãi -->
          <div class="mb-3">
            <h6 class="mb-2">Danh sách khuyến mãi:</h6>
            <div class="d-flex flex-wrap">
              <button class="btn m-1 btn-outline-success"
                v-for="promo in promotionList"
                :key="promo.id"
                size="sm"
                @click="addPromotion(promo)"
              >
                {{ promo.name }}
              </button>
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
                  <button class="btn btn-outline-primary" size="sm" @click="decreaseQtyPmt(index)">−</button>
                  <span class="mx-2">{{ promo.quantity }}</span>
                  <button class="btn btn-outline-primary" size="sm" @click="increaseQtyPmt(index)">+</button>
                  <button class="btn ml-2 btn-outline-danger" size="sm" variant="outline-danger" @click="removePromotion(index)">×</button>
                </div>
              </li>
            </ul>
          </div>

          <!-- Nút -->
          <div v-if="selectedPromotions.length" class="d-flex justify-content-between mt-4">
            <button class="btn btn-secondary" @click="hideModalPmt">Bỏ qua</button>
            <button class="btn btn-success" @click="applyPromotions">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal thẻ dv -->
    <!-- Modal thẻ dv -->
    <div v-if="modalCard" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 my-6">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Thẻ dịch vụ lần/Thẻ tiền</h5>
          <button @click="modalCard = false; saveDraft()" class="text-gray-500 hover:text-gray-700"> <!-- @hidden="saveDraft" logic moved here -->
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <!-- Danh sách thẻ -->
          <div class="card-list" v-show="trade.cards && trade.cards.length">
            <div class="bg-white rounded-lg shadow-md p-4 mb-3"  v-for="card in trade.cards"
              :key="card.id"
              
              :style="{ backgroundColor: getCardColor(card) }"
            >
              <div class="d-flex justify-content-between align-items-center mb-2">
                <input type="checkbox" class="form-check-input"
                  :checked="!card.is_delete"
                  @change="val => card.is_delete = !val"
                >
                  <strong>{{ card.card_name }}</strong>
                
              </div>

              <div class="small">
                <div v-if="card.card_type == 2">
                  <span><b>Lần còn lại:</b> {{ card.time_remaining }}/{{ card.number_of_use }}</span>
                </div>
                <div v-if="card.card_type == 3">
                  <span><b>Số tiền còn lại:</b> {{ formatCurrency(card.amount_remaining) }}/{{ formatCurrency(card.card_amount_limit) }}</span>
                </div>
                <div><b>Ngày tạo:</b> {{ formatDate(card.created_at) }}</div>
                <div><b>Hết hạn:</b> {{ formatDate(card.expired_at) }}</div>
                <div><b>Hóa đơn mua:</b> {{ card.bill_number }}</div>
              </div>
            </div>

            <!-- Danh sách dịch vụ áp dụng -->
            <div class="d-flex justify-content-between align-items-center mb-2">
              Áp dụng cho dịch vụ
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2"
              v-for="(item, index) in trade.services" :key="index">
              <input type="checkbox" class="form-check-input" :value="item.id" v-model="trade.card_service_ids">
                <strong>{{ item.name }}</strong>
              
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-4 mb-3"  v-show="!trade.cards || !trade.cards.length"
            
          >
            Khách hàng chưa sở hữu thẻ dịch vụ nào
          </div>

          <div class="text-center mt-4" v-show="trade.cards && trade.cards.length">
            <button class="btn btn-primary" @click="modalCard = false; saveDraft()">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Phụ thu -->
    <!-- Modal Phụ thu -->
    <div v-if="modalSurcharge" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 my-6">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Phụ thu</h5>
          <button @click="modalSurcharge = false" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <!-- Form thêm phí -->
          <form @submit.prevent="addExtraFee">

            <div class="grid grid-cols-12 gap-4 align-items-end">
              <!-- Tên phí -->
              <div class="col-span-12">
                <div class="form-group" label="Lý do phụ thu">
                  <input class="form-control" v-model="newFee.name" required>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 align-items-end">
              <!-- Số tiền -->
              <div class="col-span-12">
                <div class="form-group" label="Số tiền">
                  <input class="form-control"
                    type="number"
                    v-model.number="newFee.price"
                    min="0"
                    required
                  >
                </div>
              </div>
            </div>

            <!-- Button Thêm -->
            <div class="grid grid-cols-12 gap-4 text-center mt-3">
              <div class="col-span-12 text-center">
                <button class="btn" type="submit" variant="success" size="sm">Thêm</button>
              </div>
            </div>
          </form>

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
                  <strong>{{ fee.name }}</strong>
                  <small class="d-block text-muted">
                    {{ fee.type === 'service' ? 'Dịch vụ' : 'Phụ thu' }} - {{ currencyFormat(fee.price) }}
                  </small>
                </div>
              </li>
            </ul>
          </div>

          <!-- Nút -->
          <div v-if="extraFees.length" class="d-flex justify-content-between mt-4">
            <button class="btn btn-secondary" @click="hideModalExtraFees">Bỏ qua</button>
            <button class="btn btn-success" @click="applyExtraFees">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal chọn loại tiền thanh toán -->
    <!-- Modal chọn loại tiền thanh toán -->
    <div v-if="modalCurrency" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 my-6">
        <div class="flex items-center justify-between p-4 border-b">
          <h5 class="text-xl font-bold">Chọn loại tiền thanh toán</h5>
          <button @click="modalCurrency = false" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <!-- Tổng tiền cần thanh toán -->
          <p class="font-weight-bold text-center mb-4">
            Số tiền cần thanh toán: {{ currencyFormat(trade.total) }}
          </p>

          <!-- Các loại thanh toán -->
          <div class="form-group mb-3" v-for="(method, key) in paymentOptions" :key="key" >
            <input type="checkbox" class="form-check-input"
              v-model="method.checked"
              @change="onCheckboxChange(key)"
            >
              {{ method.label }}
            

            <input class="form-control mt-2"
              v-model.number="method.amount"
              type="number"
              min="0"
              
              :placeholder="`Nhập số tiền ${method.label.toLowerCase()}`"
            >
          </div>

          <!-- Error nếu tổng nhỏ hơn -->
          <p v-if="paymentError" class="text-danger text-center font-weight-bold">
            {{ paymentError }}
          </p>

          <!-- Buttons -->
          <div class="d-flex justify-content-between mt-4">
            <button class="btn btn-secondary" @click="hideModalCurrency">Bỏ qua</button>
            <button class="btn btn-success" @click="applyCurrency">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal chọn loại tiền thanh toán -->
    <!-- Modal Xác nhận thanh toán -->
    <div v-if="modalPayment" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 modal-payment-content"> <!-- modal-class="custom-payment-modal" replaced by inner style/class if needed -->
        <div class="text-center px-4 py-3">
          <!-- Custom title -->
          <h4 class="font-weight-bold mb-4" style="color: #3b82f6;">Xác nhận thanh toán</h4>

          <!-- Tên khách hàng -->
          <p class="mb-2" style="font-size: 1.25rem;">
            👤 <strong>Khách hàng: {{ selectedCustomer.name || 'Chưa chọn khách hàng' }}</strong>
          </p>

          <!-- Số tiền thanh toán -->
          <p class="mb-4" style="font-size: 2rem; font-weight: bold; color: #10b981;">
            💰 {{ currencyFormat(trade.total) }}
          </p>

          <!-- Buttons -->
          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-sm"
              @click="modalPayment = false">
              ❌ Hủy
            </button>

            <button class="btn btn-success rounded-pill px-4 py-2 shadow-sm"
              @click="confirmPayment">
              ✅ Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal chọn loại tiền thanh toán -->
    <!-- Modal Xác nhận tạo bill mới -->
    <div v-if="modalNewBill" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
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
            <button class="btn btn-outline-secondary rounded-pill px-4 py-2 shadow-sm"
              @click="modalNewBill = false">
              ❌ Hủy
            </button>

            <button class="btn btn-success rounded-pill px-4 py-2 shadow-sm"
              @click="resetBill">
              ✅ Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- In phiếu tư vấn -->
    <div id="consultation-print-area" style="display: none">
      <!-- Header -->
      <div style="display: flex; font-size: 13px; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 8px;">
        <div>{{ new Date().toLocaleString('vi-VN') }}</div>
        <div>No. {{ trade.customer_id || '_____' }}</div>
      </div>

      <h2 class="print-text-center mb-3" style="font-size: 16px;">PHIẾU TƯ VẤN</h2>

      <!-- Thông tin khách hàng -->
      <table style="width:100%; font-size: 13px" class="custom-line-height">
        <tbody>
        <tr>
          <td style="width:33%">Họ tên: <strong style="font-size: 14px;">{{ selectedCustomer.name }}</strong></td>
          <td style="width:33%">Sinh nhật: {{ selectedCustomer.birthday }}</td>
          <td style="width:33%">Giới tính: {{ selectedCustomer.gender_str }}</td>
        </tr>
        <tr>
          <td colspan="2" style="width:66%">Địa chỉ: {{ selectedCustomer.address }}</td>
          <td style="width:33%">Phone: {{ selectedCustomer.phone_number }}</td>
        </tr>
        </tbody>
      </table>

      <!-- Bảng thông tin tư vấn -->
      <table style="width:100%; font-size: 13px; margin-top: 10px;" class="custom-line-height">
        <tbody>
        <tr class="print-text-center">
          <td colspan="2" class="print-text-center">
            <strong style="font-size: 15px;">THÔNG TIN TƯ VẤN</strong>
          </td>
        </tr>
        <tr v-for="i in 22" :key="i" class="custom-line-height">
          <td>&nbsp;</td>
        </tr>
        </tbody>
      </table>
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
              <th>Tên dịch vụ</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in trade.services" :key="index">
              <td style="text-align: center;">{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td style="text-align: right;">{{ currencyFormat(item.price) }}</td>
              <td style="text-align: center;">{{ currencyFormat(item.quantity) }}</td>
              <td style="text-align: right;">{{ currencyFormat(item.price * item.quantity) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Tổng cộng -->
        <p style="text-align: right; margin-top: 10px;">
          <strong>Tổng tiền hàng:</strong> {{ currencyFormat(trade.sub_totaltotal) }}<br />
          <strong>Thuế VAT ({{ trade.vat_percent || 0 }}%):</strong> {{ currencyFormat(trade.vat_valuevalue) }}<br />
          <strong>Giảm giá:</strong> {{ currencyFormat(trade.discount_amount) }}<br />
          <strong>Phí khác:</strong> {{ currencyFormat(trade.surcharge_amount) }}<br />
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
import {Constant} from '@/common/constant'


export default {
  data() {
    return {
      storeInfo: {}, // thông tin spa
      productGroups: [],
      filteredProducts: [],
      activeGroupId: null,
      modalCustomer: false,
      modalPromotion: false,
      modalSurcharge: false,
      modalCurrency: false,
      modalPayment: false,
      modalNewBill: false,
      modalCard: false,
      vatEnabled: false,
      isFisrtSaveDraft: true,
      searchServiceQuery: '',
      isUpdateBillCustomer: false,
      trade: {
        id: null,
        bill_number: '',
        customer_id: null,
        services: [],
        total: 0,
        sub_total: 0,
        prepay_amount: 0,
        discount_amount: 0,
        content_discount: null,
        order_at: "2025-07-10 00:00:00",
        vat_percent: 0,
        vat_value: 0,
        is_edit_price: false,
        total_edit_price: 0,
        note: null,
        pmts: [],
        cards: [],
        surcharge_amount: 0,
        surcharge: [],
        cash: 0,
        credit: 0,
        e_money: 0,
        money_receive: 0,
        money_refunds: 0,
        card_amount: 0,
        cards: [],
        card_service_ids: []
      },
      modalCustomer: false,
      optionsGender: [
        {value: '1', text: 'Nam'},
        {value: '2', text: 'Nữ'},
        {value: '3', text: 'Khác'}
      ],
      activeCustomerTab: 'search',
      selectedCustomer: {},
      customerSearch: {
        id: null,
        name: null,
        phone: null,
        email: null
      },
      customerList: [],
      customerFields: [
        { key: 'index', label: 'STT' },
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Tên KH' },
        { key: 'phone_number', label: 'SĐT' },
        { key: 'email', label: 'Email' },
        { key: 'birthday', label: 'Ngày sinh' },
        { key: 'gender_str', label: 'Giới tính' },
        { key: 'mst', label: 'Mã số thuế' },
        { key: 'address', label: 'Địa chỉ' },
        { key: 'action', label: '' }
      ],
      newCustomer: {
        name: '',
        email: '',
        phone_number: '',
        birthday: '',
        gender: '',
        mst: '',
        address: '',
        national_code: '',
        industry: '',
      },
      formCustomerErrors: {
        name: null,
        phone_number: null,
        email: null,
      },
      staffList: [],
      promotionList: [],
      selectedPromotions: [],
      newFee: {
        type: 'surcharge',
        name: '',
        price: 0
      },
      extraFees: [],
      paymentOptions: {
        cash: { label: 'Tiền mặt', checked: true, amount: 0 },
        bank: { label: 'Chuyển khoản', checked: false, amount: 0 },
        emoney: { label: 'E-Money', checked: false, amount: 0 }
      },
      paymentError: '',
      intervalId: null,
      serviceTime: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      printer_image: null,
      qrImageUrl: null,
      bankAccount: {},
      bankAccountId: null,
      bankAccounts: [],
      bankAccountOptions: [],
      idsUseInvoice: Constant.STORE_USE_INVOICE,

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
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  mounted() {
    // check Add hay edit
     const path = window.location.pathname;
     if(path.includes('bill/edit')) {
      const billId = this.$route.params.id;
      this.getBillDetail(billId)
     }

    // Get danh sách dịch vụ
    this.fetchProductGroups();

    // Get danh sách khách hàng, khuyến mại
    this.getInfoRelatedBill();

    // Tính service time
    this.intervalId = setInterval(() => {
      this.calServiceTime();
    }, 60000); // 60000 ms = 1 phút

    // Kiểm tra url, nếu có ID thì get detail payment info
    // TODO
  },
  methods: {
    // Make toast without title
    popToast(variant, content) {
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
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

    handleFilterService(value) {
      this.activeGroupId = null
      this.handleSelectGroup(null)

      const products = JSON.parse(JSON.stringify(this.filteredProducts))

      this.searchProductQuery = value;
      const query = this.searchProductQuery.toLowerCase().trim();

      this.filteredProducts = products.filter(product => {
        const name = product.name || '';
        const matchName = name.toLowerCase().trim().includes(query);
        return matchName;
      });
    },

    calServiceTime() {
      if (this.trade.id && this.trade.order_at) {
        const orderTime = new Date(this.trade.order_at);
        const now = new Date();
        const diffMs = now - orderTime;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        this.serviceTime = {
          hours: hours % 24,
          minutes: minutes % 60,
          seconds: seconds % 60
        };
      }
    },

    // Get bill detail
    getBillDetail(billId) {
      billApi.getBillDetail(billId).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.trade = res.data.data

          if (this.trade.card_service_ids) {
            this.trade.card_service_ids = this.trade.card_service_ids.split(",")
          }

          // Check VAT
          if(this.trade.vat_value) {
            this.vatEnabled = true
          }

          if(this.trade.is_payment && this.trade.total && this.bankAccount.account_number) {
            this.generateVietQR()
          }

          // Get customer 
          this.selectedCustomer = this.trade.customer

          // Set loại tiền
          this.setPaymentOptions()
        }
      }).catch(err => {
        console.log("getBillDetail")
        console.log(err)

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // Get danh sách dịch vụ theo group
    fetchProductGroups() {
      billApi.getServiceByGroup().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.productGroups = res.data.data

          this.handleSelectGroup(null)
        }
      }).catch(err => {
        console.log("fetchProductGroups")
        console.log(err)

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // Get danh sách khách hàng, khuyến mại, staff
    getInfoRelatedBill() {
      billApi.getInfoRelatedBill().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          const data = res.data.data
          this.customerList = data.customers
          this.promotionList = data.promotions
          this.staffList = data.staffs
          this.storeInfo = data.store
          this.bankAccounts = JSON.parse(JSON.stringify(data.banks))

          // check VAT
          const path = window.location.pathname;
          if(!path.includes('bill/edit')) {
            if(data.store.is_include_vat && data.store.is_include_vat == 'true') {
              this.vatEnabled = true
              this.trade.vat_percent = 10
            } else {
              this.vatEnabled = false
              this.trade.vat_percent = 0
            }
          }

          // Hanlde bank account
          if(this.bankAccounts && this.bankAccounts.length) {
            // Check tài khoản doanh nghiệp
            for(let acc of this.bankAccounts) {
              if (acc.is_default && acc.type == 1) {
                this.bankAccount = acc
                break
              }
            }
            if(!this.bankAccount.id) {
              // Check tài khoản cá nhân
              for(let acc of this.bankAccounts) {
                if (acc.is_default && acc.type == 0) {
                  this.bankAccount = acc
                  break
                }
              }
            }
            if(!this.bankAccount.id) {
              this.bankAccount = this.bankAccounts[0]
            }
            this.bankAccountId = this.bankAccount.id
          }

          // Handle bank options
          this.bankAccountOptions = []
          for(let acc of this.bankAccounts) {
            let bank_text = `${acc.bank_name} - ${acc.account_name} - ${acc.account_number} - ${acc.type_str}`;
            this.bankAccountOptions.push({value: acc.id, text: bank_text})
          }

          if(this.trade.is_payment && this.trade.total && this.bankAccount.account_number) {
            this.generateVietQR()
          }
        }
      }).catch(err => {
        console.log("getInfoRelatedBill")
        console.log(err)

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    handleSelectGroup(groupId) {
      this.activeGroupId = groupId;
      if (this.activeGroupId === null) {
        this.filteredProducts = this.productGroups.flatMap(group => group.services);
      } else {
        const group = this.productGroups.find(g => g.id == groupId);
        this.filteredProducts = group ? group.services : [];
      }
    },

    onVatEnabledChange(checked) {
      if (checked) {
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

    handleCardServices() {
      this.trade.card_service_ids = []
      for(let service of this.trade.services) {
        this.trade.card_service_ids.push(service.id)
      }
    },

    addToCart(product) {
      const existing = this.trade.services.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++;
        existing.amount = parseInt(existing.quantity * existing.price)
      } else {
        this.trade.services.push({ ...product, quantity: 1, amount: product.price });
      }

      // Update card service
      this.handleCardServices()

      // Tính toán lại thông tin payment
      this.calculatePaymentInfo()

      // Check saveDraft
      this.handleSaveDraft()
    },
    increaseQty(index) {
      this.trade.services[index].quantity++;
      this.trade.services[index].amount = parseInt(this.trade.services[index].quantity * this.trade.services[index].price)

      // Update card service
      this.handleCardServices()

      // Tính toán lại thông tin payment
      this.calculatePaymentInfo()

      // Check saveDraft
      this.handleSaveDraft()
    },
    decreaseQty(index) {
      if (this.trade.services[index].quantity > 1) {
        this.trade.services[index].quantity--;
        this.trade.services[index].amount = parseInt(this.trade.services[index].quantity * this.trade.services[index].price)
      } else {
        this.removeItem(index);
      }

      // Update card service
      this.handleCardServices()

      // Tính toán lại thông tin payment
      this.calculatePaymentInfo()

      // Check saveDraft
      this.handleSaveDraft()
    },
    removeItem(index) {
      this.trade.services.splice(index, 1);

      // Update card service
      this.handleCardServices()

      // Tính toán lại thông tin payment
      this.calculatePaymentInfo()

      // Check saveDraft
      this.handleSaveDraft()
    },
    showModal(type) {
      switch (type) {
        case 'customer':
          this.modalCustomer = true
          break;
        case 'promotion':
          this.modalPromotion = true
          break;
        case 'surcharge':
          this.modalSurcharge = true
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
        case 'cards':
          this.modalCard = true
          break;
        default:
          console.log('No modal show');
      }
    },
    checkPayment() {
      if(this.trade.customer_id) {
        this.modalPayment = true
        return
      }
      for(const service of this.trade.services) {
        if(service.type == 2 || service.type == 3) {
          this.popToast('danger', 'Có thẻ dịch vụ trong dánh sách bán. Vui lòng chọn khách hàng.')
          return
        }
      }
      this.modalPayment = true
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
      this.trade.total_edit_price = billInfo.total_edit_price
      this.trade.surcharge_amount = billInfo.surcharge_amount
      this.trade.order_at = billInfo.order_at
      this.trade.cash = billInfo.cash
      this.trade.credit = billInfo.credit
      this.trade.e_money = billInfo.e_money
      this.trade.card_amount = billInfo.card_amount

      for(const service of this.trade.services) {
        service.price = this.currencyFormat((service.price + '').replaceAll(",", ""))
        service.quantity = this.currencyFormat((service.quantity + '').replaceAll(",", ""))
        // service.amount = this.currencyFormat((service.amount + '').replaceAll(",", ""))
      }
    },

    saveDraft(noti=false) {
      for(const service of this.trade.services) {
        service.price = parseInt((service.price + '').replaceAll(",", ""))
        service.quantity = parseInt((service.quantity + '').replaceAll(",", ""))
        service.amount = parseInt(service.price * service.quantity)
      }
      billApi.saveDraftBill(this.trade).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          const billInfo = res.data.data

          this.updateBillInfo(billInfo)

          // Set loại tiền
          this.setPaymentOptions()

          if(noti) {
            this.popToast('success', "Lưu nháp thành công!")
          }

          // Check card
          if(this.trade.customer_id) {
            this.updateBillCustomer()
          }
        }
      }).catch(err => {
        console.log("saveDraft")
        console.log(err)

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    async generateVietQR() {
      try {
        // Gọi API tạo dữ liệu QR từ vietqr.io
        const response = await fetch('https://api.vietqr.io/v2/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accountNo: this.bankAccount.account_number,
            accountName: this.bankAccount.account_name,
            acqId: this.bankAccount.bank_bin,
            amount: this.trade.total,
            addInfo: this.selectedCustomer.name ? 'Chuyển khoản cho ' + this.selectedCustomer.name : 'Chuyển khoản',
            template: 'compact'
          })
        });

        const result = await response.json();
        this.qrImageUrl = result.data.qrDataURL;
      } catch (err) {
        console.error('VietQR error:', err);
      }
    },

    // Xác nhận thanh toán
    confirmPayment() {
      billApi.confirmPayment({id: this.trade.id}).then(res => {
        if(res != null && res.data != null && res.data.status == 200){

          this.trade.is_payment = true
          this.trade.payment_a = new Date()
          this.modalPayment = false
          this.popToast('success', "Thanh toán thành công!")

          // Tạo QR code chuyển khoản ngân hàng
          if(this.trade.is_payment && this.trade.total && this.bankAccount && this.bankAccount.id) {
            this.generateVietQR();
          }
        }
      }).catch(err => {
        console.log("confirmPayment")
        console.log(err)

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    // Tạm tính toán tại client trước khi lấy tính toán từ API
    calculatePaymentInfo() {
      let total = 0;
      const oldTotal = JSON.parse(JSON.stringify(this.trade.total))

      for(const service of this.trade.services) {
        service.price = parseInt((service.price + '').replaceAll(",", ""))
      }

      // sub_total
      const sub_total = this.trade.services.reduce((total, item) => total + item.price * item.quantity, 0);
      this.trade.sub_total = sub_total
      total += sub_total

      // Kiểm tra thanh toán trước
      const prepay_amount = this.trade.services.reduce(
        (total, item) => item.pre ? total + item.price * item.quantity : total, 0
      );
      this.trade.prepay_amount = prepay_amount
      total -= prepay_amount

      // Phụ thu
      let surcharge_amount = 0;
      this.trade.surcharge.forEach(service => {
        if ('percent' in service && service.percent !== 0) {
          service.price = Math.floor(total * (parseInt(service.percent) / 100));
        }
        surcharge_amount += parseInt(service.price);
      });
      this.trade.surcharge_amount = surcharge_amount
      total += surcharge_amount

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
      billApi.searchCustomer(this.customerSearch).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.customerList = res.data.data
        }
      }).catch(err => {
        console.log("searchCustomers")
        console.log(err)

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    updateBillCustomer(isUpdate=true) {
      if(!this.trade.id || this.isUpdateBillCustomer) {
        return
      }
      const params = {
        id: this.trade.id,
        customer_id: this.trade.customer_id
      }

      billApi.updateBillCustomer(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          const billInfo = res.data.data

          this.trade.cards = billInfo.cards

          this.updateBillInfo(billInfo)

          // Set loại tiền
          this.setPaymentOptions()

          if(isUpdate) {
            this.isUpdateBillCustomer = true
          }
        }
      }).catch(err => {
        console.log("updateBillCustomer")
        console.log(err)

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

      // Update bill customer
      this.updateBillCustomer()
    },

    // Tạo mới khách hàng
    createCustomer() {
      this.formCustomerErrors = { name: null, phone_number: null, email: null };

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

      // Validate email
      if (this.newCustomer.email.trim() && !commonFunc.emailCheck(this.newCustomer.email.trim())) {
        this.formCustomerErrors.email = 'Email không hợp lệ';
      }

      // Nếu có lỗi thì không submit
      if (this.formCustomerErrors.name || this.formCustomerErrors.phone_number || this.formCustomerErrors.email) {
        return;
      }

      billApi.addCustomer(this.newCustomer).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.selectCustomer(res.data.data)
          this.resetNewCustomer();

          this.popToast('success', "Thêm mới khách hàng thành công!")

          this.searchCustomers()
        }
      }).catch(err => {
        console.log("createCustomer")
        console.log(err)

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
      this.trade.pmts = [...this.selectedPromotions];
      this.hideModalPmt()

      // TODO: kiểm tra nếu chọn service rồi thì lưu nháp luôn
      // TODO: UI phía trên, chưa chọn service thì chưa cho chọn pmt

      // Check saveDraft
      this.handleSaveDraft()
    },

    hideModalPmt() {
      this.modalPromotion = false
    },

    /**
     * Phụ thu
     */
     addExtraFee() {
      if (!this.newFee.name.trim() || this.newFee.price <= 0) return;

      this.extraFees.push({
        ...this.newFee,
        quantity: 1
      });

      // Reset input
      this.newFee.name = '';
      this.newFee.price = 0;
    },
    increaseFeeQty(index) {
      this.extraFees[index].quantity++;
    },
    decreaseFeeQty(index) {
      if (this.extraFees[index].quantity > 1) {
        this.extraFees[index].quantity--;
      }
    },
    removeExtraFee(index) {
      this.extraFees.splice(index, 1);
    },
    applyExtraFees() {
      this.trade.surcharge = [...this.extraFees];
      this.trade.surcharge_amount = this.trade.surcharge.reduce((total, item) => total + item.price * item.quantity, 0);
      this.hideModalExtraFees()

      // TODO: kiểm tra nếu chọn service rồi thì lưu nháp luôn
      // TODO: UI phía trên, chưa chọn service thì chưa cho phí dv/Phụ thu

      // Check saveDraft
      this.handleSaveDraft()
    },
    hideModalExtraFees() {
      this.modalSurcharge = false
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

      // TODO: kiểm tra nếu chọn service rồi thì lưu nháp luôn
      // TODO: UI phía trên, chưa chọn service thì chưa cho phí dv/Phụ thu

      // Check saveDraft
      this.handleSaveDraft()
    },

    hideModalCurrency() {
      this.modalCurrency = false
    },

    changeBankAccount() {
      console.log("===========")
      console.log(this.bankAccountId)
      console.log(this.bankAccounts)
      console.log("===========")
      for(let acc of this.bankAccounts) {
        if(acc.id == this.bankAccountId) {
          this.bankAccount = acc
          this.generateVietQR()
          break
        }
      }
    },

    /**
     * In phiếu tư vấn
     */
    printConsultationForm() {
      const printContent = document.getElementById('consultation-print-area').innerHTML;
      var mywindow = window.open('', 'PRINT', 'height=900,width=1200');

      mywindow.document.write('<html><head><title> </title><style>');
      mywindow.document.write(' body {font-size: 16px;} ');
      mywindow.document.write(' table { border-collapse: collapse; width: 100%;} ');
      mywindow.document.write(' table td, table th { border: 1px solid #000; padding: 4px; } ');
      mywindow.document.write(' .print-text-center {text-align: center; vertical-align: middle; } ');
      mywindow.document.write(' .custom-line-height tr { line-height: 25px; } ');

      mywindow.document.write('</style></head><body >');
      mywindow.document.write(printContent);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      setTimeout(function() {
        mywindow.print();
        // mywindow.close();
      }, 1000);

      return true;
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
      mywindow.document.write(' .print-text-center {text-align: center; vertical-align: middle; } ');
      mywindow.document.write(' .print-border-top { border-top: 1px solid #000; } ');
      mywindow.document.write(' .print-border-bot { border-bottom: 1px solid #000; } ');

      mywindow.document.write('</style></head><body >');
      mywindow.document.write(printContent);
      mywindow.document.write('</body></html>');

      mywindow.document.close();
      mywindow.focus();

      setTimeout(function() {
        mywindow.print();
        // mywindow.close();
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
    getDateNow() {
      let dateInput = this.trade.order_at
      if(this.trade.payment_at) {
        dateInput = this.trade.payment_at
      }
      const date = new Date(dateInput)
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const mi = String(date.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
    },
    getCardColor(card) {
      if (card.card_type == 2) return '#fff3cd';
      if (card.card_type == 3) return '#d4edda';
      return '#f8f9fa';
    },
    onToggleCard(card) {
      // Tùy ý xử lý toggle check
      console.log('Checked:', card.id, '=>', card.is_delete);
    },
    confirmSelectedCards() {
      const selectedCards = this.cards.filter(card => card.is_delete);
      console.log('Selected cards:', selectedCards);
      this.modalCard = false;
    },
    formatNumericInput(index, field) {
      let value = this.trade.services[index][field];
      if(value) {
        value = this.currencyFormat((value + '').replaceAll(",", ""))
        this.trade.services[index][field] = value;
      }
    },
    updatePrice(index, value) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        this.trade.services[index].price = parsed;
      }
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

  .services-list {
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

  .button-panel {
    min-width: 160px;
  }

  .big-button {
    font-size: 1.5rem !important;
    padding: 0.25rem 0.5rem;
  }

  .smallBtn {
    font-size: 0.7rem !important;         /* nhỏ ~30% */
    padding: 0.2rem 0.45rem !important;    /* thu nhỏ padding */
    line-height: 1.1;                      /* để nút tròn đẹp */
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
