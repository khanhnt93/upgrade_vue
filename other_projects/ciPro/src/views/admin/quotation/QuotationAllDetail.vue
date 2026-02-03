<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Action Buttons -->
        <div class="flex justify-between mb-4">
          <button
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-32"
            @click="back">
            Quay lại
          </button>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32"
            @click="openModalChooseFilePrint">
            In báo giá
          </button>
        </div>

        <!-- Title -->
        <div class="mb-4">
          <h4 class="text-center text-2xl font-bold text-orange-600">Chi Tiết Báo Giá</h4>
        </div>
        <hr class="my-4">

        <!-- Loading -->
        <div v-show="loading" class="text-center my-4">
          <icon name="loading" width="60" />
        </div>

        <!-- Basic Info -->
        <div class="mb-4">
          <p class="text-gray-700">Mã báo giá: {{ trade.quotation_number }}</p>
        </div>
        <div class="mb-4">
          <p class="text-gray-700">Ngày lập: {{ trade.created_at }}</p>
        </div>

        <!-- Customer Information Section -->
        <div class="bg-gray-600 text-white px-4 py-2 rounded-t mb-2">
          <h5 class="text-lg font-semibold">Thông tin khách hàng</h5>
        </div>

        <div class="mb-4">
          <div class="mb-2">
            <label class="text-gray-700">
              <span>Tên khách hàng: {{ trade.customer_name }}</span>
            </label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">
              <span>SĐT khách hàng: {{ trade.customer_phone }}</span>
            </label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">
              <span>Địa chỉ khách hàng: {{ trade.customer_address }}</span>
            </label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">
              <span>Loại công ty: {{ convertCompanyTypeIdToName(trade.customer_company_type_id) }}</span>
            </label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">
              <span>Tên người liên hệ: {{ trade.contact_person_name }}</span>
            </label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">
              <span>Sđt người liên hệ: {{ trade.contact_person_phone }}</span>
            </label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">
              <span>Tình trạng khách hàng: {{ convertCustomerStatusIdToName(trade.customer_status) }}</span>
            </label>
          </div>
        </div>

        <!-- Products Section -->
        <div class="bg-blue-500 text-white px-4 py-2 rounded-t mt-6 mb-2">
          <h5 class="text-lg font-semibold">Danh sách sản phẩm</h5>
        </div>

        <div class="flex justify-end mb-2">
          <button
            @click="exportToExcel"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            <b>Xuất Excel</b>
          </button>
        </div>

        <div class="mb-4">
          <p class="text-gray-700">
            Tổng doanh số theo hãng:
            <span v-for="(brand, index) in brands_amount" :key="index">
              {{ " - " + brand.name + ": " + currencyFormat(brand.amount) }}
            </span>
          </p>
        </div>

        <!-- Products Table -->
        <div v-show="trade.products.length > 0" class="overflow-x-auto mb-4">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
            <colgroup>
              <col style="width:2%">
              <col style="width:12%">
              <col style="width:12%">
              <col style="width:5%">
              <col style="width:7%">
              <col style="width:5%">
              <col style="width:7%">
              <col style="width:5%">
              <col style="width:5%">
              <col style="width:5%">
              <col style="width:7%">
              <col style="width:5%">
              <col style="width:8%">
              <col style="width:7%">
              <col style="width:4%">
            </colgroup>
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">STT</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Mã SP</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Sản phẩm</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Hãng SP</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Giá List</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">CK từ NCC</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Giá gốc</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">% lợi nhuận theo giá list</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">% lợi nhuận theo giá gốc</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Lợi nhuận/sản phẩm</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Giá bán</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Số lượng</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Thành tiền</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Lợi nhuận tổng</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border">Ghi chú</th>
              </tr>
            </thead>
            <tbody v-if="trade.type == 0 && trade.products.length > 0" class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in trade.products" :key="index">
                <td class="px-3 py-2 text-sm text-gray-900 border">{{ index + 1 }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 border">{{ item.product_code ? item.product_code : item.product_code_input }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 border">{{ item.product_name ? item.product_name : item.product_name_input }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 border">{{ item.brand_name ? item.brand_name : item.brand_name_input }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ currencyFormat(item.price_list) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ item.discount }}%</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ currencyFormat(item.price) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ item.discount_sale }}%</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ item.discount_original_price }}%</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ currencyFormat(item.profit_on_item) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ currencyFormat(item.price_sell) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ currencyFormat(item.quantity) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ currencyFormat(item.amount_sell) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ currencyFormat(item.profit) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">{{ item.note }}</td>
              </tr>
            </tbody>
            <tbody v-if="trade.type == 1 && projectProducts.length > 0" class="bg-white divide-y divide-gray-200">
              <tr v-for="(item) in projectProducts" :key="item.project_index" :class="item.product_type == 0 ? 'bg-blue-200' : ''">
                <td class="px-3 py-2 text-sm text-gray-900 border">{{ item.project_index }}</td>
                <td class="px-3 py-2 text-sm text-gray-900 border">
                  <span v-show="item.product_type == 1">{{ item.product_code ? item.product_code : item.product_code_input }}</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 border">
                  {{ item.product_name ? item.product_name : item.product_name_input }}
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 border">
                  <span v-show="item.product_type == 1">
                    {{ item.brand_name ? item.brand_name : item.brand_name_input }}
                  </span>
                  <span v-show="item.product_type == 0">
                    {{ item.project_brand_name }}
                  </span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  <span v-show="item.product_type == 1">{{ currencyFormat(item.price_list) }}</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  <span v-show="item.product_type == 1">{{ item.discount }}%</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  <span v-show="item.product_type == 1">{{ currencyFormat(item.price) }}</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  <span v-show="item.product_type == 1">{{ item.discount_sale }}%</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  <span v-show="item.product_type == 1">{{ item.discount_original_price }}%</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  <span v-show="item.product_type == 1">{{ currencyFormat(item.profit_on_item) }}</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  <span v-show="item.product_type == 0">{{ currencyFormat(item.project_price) }}</span>
                  <span v-show="item.product_type == 1">{{ currencyFormat(item.price_sell) }}</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  <span v-show="item.product_type == 0">{{ currencyFormat(item.project_quantity) }}</span>
                  <span v-show="item.product_type == 1">{{ currencyFormat(item.quantity) }}</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  {{ currencyFormat(item.product_type == 0 ? item.project_amount : item.amount_sell) }}
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 text-right border">
                  <span v-show="item.product_type == 1">{{ currencyFormat(item.profit) }}</span>
                </td>
                <td class="px-3 py-2 text-sm text-gray-900 border">
                  <span v-show="item.product_type == 1">{{ item.note }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Payment Information Section -->
        <div class="bg-green-500 text-white px-4 py-2 rounded-t mt-6 mb-2">
          <h5 class="text-lg font-semibold">Thông tin thanh toán</h5>
        </div>

        <div class="mb-4">
          <div class="mb-2">
            <label class="text-gray-700">Tổng tiền sản phẩm: {{ currencyFormat(trade.sub_total) }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">
              Chi phí thêm: {{ currencyFormat(trade.extra_fee) }}
              <span v-if="trade.extra_fee">{{ ' (' + trade.note_extra_fee + ')' }}</span>
            </label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Số tiền giảm: {{ currencyFormat(trade.fixed_discount) }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Thuế VAT({{ trade.vat_percent }}%): {{ currencyFormat(trade.vat_value) }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Thành tiền: {{ currencyFormat(trade.total) }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Lợi nhuận: {{ currencyFormat(trade.profit) }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Tài khoản nhận thanh toán: {{ trade.bank_account_str }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Hình thức thanh toán: {{ trade.payment_method }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Thỏa thuận vận chuyển: {{ trade.shipping_agreement }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Phí giao hàng: {{ currencyFormat(trade.shipping_fee) }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Hiệu lực báo giá: {{ trade.quotation_expiry_date }} ngày</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Nhân viên phụ trách: {{ trade.staff_in_charge_name }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Thời gian giao hàng: {{ trade.shipping_date }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Bảo hành: {{ trade.guarantee }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Giấy tờ kèm theo: {{ trade.attach_doc }}</label>
          </div>

          <div class="mb-2">
            <label class="text-gray-700">Ghi chú: {{ trade.description }}</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Print Section (Hidden) -->
    <div hidden id="provisionalInvoice">
      <img :src="'/static/img/project/print/quotation/header_' + authStore.user.storeId + '.png'" style="width: 100%"/>

      <div v-if="authStore.user.storeId != 19" style="width:100%; height:35px; font-size: 12px;" class="tr-bg">
        <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center; margin-top: 10px;">
          <b>BẢNG BÁO GIÁ</b>
        </div>
        <div style="float: right; width: 30%; margin-top: 10px; text-align: center">
          <i class="print-text-right">TP.HCM, Ngày {{ today_day }} tháng {{ today_month }} năm {{ today_year }}</i>
        </div>
      </div>

      <!-- Company 19 has different template -->
      <div v-if="authStore.user.storeId == 19" style="width:100%; height:35px; font-size: 12px;">
        <div style="font-size: 18px; text-align: center; margin-top: 10px;">
          <b>THƯ BÁO GIÁ</b>
        </div>
        <div style="font-size: 12px; text-align: center; margin-top: 10px;">
          <span><b>Số báo giá: {{ trade.quotation_number }}</b></span>
        </div>
        <div style="float: right; width: 100%; margin-top: 10px; text-align: right">
          <i class="print-text-right">TP.HCM, Ngày {{ today_day }} tháng {{ today_month }} năm {{ today_year }}</i>
        </div>
      </div>

      <div v-if="authStore.user.storeId != 19" style="width:100%; font-size: 12px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
        <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center;">
        </div>
        <div style="float: right; width: 30%; margin-top: 5px; margin-bottom: 5px; text-align: center">
          <span>Số báo giá: {{ trade.quotation_number }}</span>
        </div>
      </div>

      <div class="print-table-border custom-line-height">
        <table style="width:100%; font-size: 10px">
          <tbody>
          <tr class="print-pl-2">
            <td colspan="2" class="print-pl-2"> Kính gửi: <b><span>{{ trade.customer_name }}</span></b></td>
          </tr>
          <tr>
            <td class="print-no-border print-pl-2">Anh/chị: <span>{{ trade.contact_person_name }}</span></td>
            <td class="print-no-border">Kinh doanh: <span>{{ trade.staff_in_charge_name }}</span></td>
          </tr>
          <tr>
            <td class="print-no-border print-pl-2">Điện thoại: <span>{{ trade.contact_person_phone }}</span></td>
            <td class="print-no-border">Điện thoại: <span>{{ trade.staff_in_charge_phone }}</span></td>
          </tr>
          <tr>
            <td class="print-no-border print-pl-2">Email: <span>{{ trade.contact_person_email }}</span></td>
            <td class="print-no-border">Email: <span>{{ trade.staff_in_charge_email }}</span></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div style="width:100%; font-size: 12px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
        <div style="width: 100%; margin-top: 5px; margin-bottom: 5px; text-align: left">
          <span><i><b>{{ store_name }}</b> chân thành cảm ơn Quý Khách Hàng đã quan tâm đến dịch vụ/sản phẩm của công ty chúng tôi. Chúng tôi trân trọng gửi tới Quý Khách:</i></span>
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
          <tr v-if="trade.type == 0" v-for="(item, index) in trade.products" :key="item.product_id">
            <td class="print-text-center">{{ index + 1 }}</td>
            <td>{{ item.product_code ? item.product_code : item.product_code_input }}</td>
            <td>
              {{ item.product_name ? item.product_name : item.product_name_input }}
              <span v-for="(des, idx) in item.description" :key="idx">
                <br><i class="print-pl-2">{{ des }}</i>
              </span>
            </td>
            <td class="print-text-center">{{ item.brand_name ? item.brand_name : item.brand_name_input }}</td>
            <td class="print-text-center">{{ item.unit_name ? item.unit_name : item.unit_name_input }}</td>
            <td  class="print-text-center">{{ currencyFormat(item.quantity) }}</td>
            <td class="print-text-right">{{ currencyFormat(item.price_sell) }}</td>
            <td class="print-text-right">{{ currencyFormat(item.amount_sell) }}</td>
            <td>{{ item.note }}</td>
          </tr>
          <tr v-if="trade.type == 1" v-for="(item) in projectProducts" :key="item.project_index" :class="item.product_type == 0 ? 'project_bg' : ''">
            <td class="print-text-center">{{ item.project_index }}</td>
            <td>
              <span v-show="item.product_type == 1">{{ item.product_code ? item.product_code : item.product_code_input }}</span>
            </td>
            <td>
              <span v-show="item.product_type == 1">{{ item.product_name ? item.product_name : item.product_name_input }}</span>
              <b v-show="item.product_type == 0">{{ item.product_name }}</b>
            </td>
            <td class="print-text-center">
              <span v-show="item.product_type == 1">
                {{ item.brand_name ? item.brand_name : item.brand_name_input }}
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
            <td  class="print-text-center">
              {{ currencyFormat(item.product_type == 1 ? item.quantity : item.project_quantity) }}
            </td>
            <td class="print-text-right">
              <span v-show="trade.show_price_project == 'false' && item.product_type == 1">-</span>
              <span v-show="trade.show_price_project == 'false' && item.product_type == 0">{{ currencyFormat(item.project_price) }}</span>
              <span v-show="trade.show_price_project == 'true'">
                {{ currencyFormat(item.product_type == 1 ? item.price_sell : item.project_price) }}
              </span>
            </td>
            <td class="print-text-right">
              <span v-show="trade.show_price_project == 'false' && item.product_type == 1">-</span>
              <span v-show="trade.show_price_project == 'false' && item.product_type == 0">{{ currencyFormat(item.project_amount) }}</span>
              <span v-show="trade.show_price_project == 'true'">
                {{ currencyFormat(item.product_type == 1 ? item.amount_sell : item.project_amount) }}
              </span>
            </td>
            <td>{{ item.product_type == 1 ? item.note : '' }}</td>
          </tr>
          <tr>
            <td colspan="7" class="print-text-right">CỘNG TIỀN HÀNG:</td>
            <td class="print-text-right"><b>{{ currencyFormat(trade.sub_total) }}</b></td>
            <td></td>
          </tr>
          <tr v-show="trade.extra_fee && parseInt(trade.extra_fee) > 0">
            <td colspan="7" class="print-text-right">
              CHI PHÍ KHÁC
              <span v-show="trade.note_extra_fee"> ({{ trade.note_extra_fee }})</span>
            </td>
            <td class="print-text-right">{{ currencyFormat(trade.extra_fee) }}</td>
            <td></td>
          </tr>
          <tr v-show="trade.fixed_discount && parseInt(trade.fixed_discount) > 0">
            <td colspan="7" class="print-text-right">GIẢM GIÁ</td>
            <td class="print-text-right">{{ currencyFormat(trade.fixed_discount) }}</td>
            <td></td>
          </tr>
          <tr v-show="trade.have_vat && parseInt(trade.vat_value) > 0">
            <td colspan="7" class="print-text-right">Thuế GTGT (VAT {{ trade.vat_percent }}%)</td>
            <td class="print-text-right">{{ currencyFormat(trade.vat_value) }}</td>
            <td></td>
          </tr>
          <tr>
            <td colspan="7" class="print-text-right"><b>TỔNG TIỀN THANH TOÁN:</b></td>
            <td class="print-text-right"><b>{{ currencyFormat(trade.total) }}</b></td>
            <td></td>
          </tr>
          </tbody>
        </table>
        <div>
          <p style="font-size: 10px"><b> Số tiền viết bằng chữ:</b> {{ convertNumberToText(trade.total) }}</p>
        </div>
        <div>
          <p style="color: red; font-size: 10px">
            <b v-if="authStore.user.storeId != 19 && trade.type == 0">* Quý khách hàng vui lòng kiểm tra mã sản phẩm & thông số sản phẩm, hàng mua xin miễn đổi trả</b>
            <b v-if="authStore.user.storeId == 19 || trade.type == 1">* Quý khách hàng vui lòng xem thêm các Điều khoản - Chính sách báo giá phía dưới dây:</b>
          </p>
        </div>

        <div>
          <table style="width:100%; font-size: 10px">
            <tbody>
            <tr>
              <td class="print-no-border">
                {{ authStore.user.storeId == 19 ? 'Thời gian giao hàng:' : 'Bảo hành:' }}
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
              <td class="print-no-border">{{ trade.quotation_expiry_date }} ngày <span style="color: #C0C0C0">(kể từ ngày báo giá)</span></td>
              <td class="print-no-border">Tên tài khoản:</td>
              <td class="print-no-border">{{ trade.account_name }}</td>
            </tr>
            <tr>
              <td class="print-no-border">Giao hàng:</td>
              <td class="print-no-border">
                <span>{{ !trade.shipping_agreement ? 'Nội thành HCM' : trade.shipping_agreement }}. </span>
                <span v-show="trade.shipping_fee && parseInt(trade.shipping_fee) > 0">
                  {{ 'Chi Phí giao hàng là: ' + currencyFormat(trade.shipping_fee) + ' đồng' }}
                </span>
              </td>
              <td class="print-no-border">Số tài khoản: </td>
              <td class="print-no-border">
                <span>{{ trade.account_number }}</span>
              </td>
            </tr>
            <tr>
              <td class="print-no-border">Hình thức Thanh toán: </td>
              <td class="print-no-border">
                <span>{{ trade.payment_method ? trade.payment_method : trade.payment_method_input }}</span>
              </td>
              <td class="print-no-border">Ngân hàng: </td>
              <td class="print-no-border">
                <span>{{ trade.bank_name }}</span>
              </td>
            </tr>
            <tr>
              <td class="print-no-border"></td>
              <td class="print-no-border"></td>
              <td class="print-no-border">Nội dung chuyển khoản: </td>
              <td class="print-no-border">
                <span>{{ 'Tên công ty - ' + trade.quotation_number }}</span>
              </td>
            </tr>
            <tr v-show="trade.description">
              <td class="print-no-border"><b>Ghi chú thêm:</b></td>
              <td class="print-no-border" colspan="3">{{ trade.description }}</td>
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
              <td class="print-no-border print-text-center"><b>{{ trade.staff_in_charge_name }}</b></td>
            </tr>
            <tr>
              <td class="print-no-border print-text-center"></td>
              <td class="print-no-border print-text-center">{{ trade.staff_in_charge_position }}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- Modal Choose Print File Type -->
    <div v-if="showModalChoosePrintFileType" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="hideModalChooseFilePrint"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h4 class="text-center text-xl font-bold text-orange-600 mb-4">Chọn File In Báo Giá</h4>
            <hr class="mb-4">

            <div class="flex justify-between">
              <button
                v-show="!exportingExcel"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32"
                @click="exportExcel('excel')">
                Xuất Excel
              </button>

              <button
                v-show="!exportingExcel"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-32"
                @click="exportExcel('pdf')">
                Xuất PDF
              </button>
            </div>
            <div v-show="exportingExcel" class="text-center">
              <icon name="loading" width="60" />
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 text-center">
            <button
              type="button"
              class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm w-32"
              @click="hideModalChooseFilePrint">
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'
import quotationApi from '@/api/quotation'
import superAdminAPI from '@/api/superAdmin'
import { RootAPI } from '@/api/index'
import commonFunc from '@/common/commonFunc'

// Router and store
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { popToast } = useToast()

// State
const trade = ref({
  id: null,
  quotation_number: null,
  created_at: null,
  status: -1,
  customer_id: null,
  customer_name: null,
  customer_phone: null,
  customer_address: null,
  customer_tax_code: null,
  customer_company_type_id: null,
  contact_person_name: null,
  contact_person_phone: null,
  contact_person_email: null,
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
  bank_account_str: null,
  account_name: null,
  account_number: null,
  bank_name: null,
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
  promotions: [],
  shipping_date: null,
  guarantee: null,
  attach_doc: null,
  type: 0,
  show_price_project: 'false'
})

const currentProduct = ref({
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
  note: null
})

const products_excel = ref([])
const excel_fields = ref({
  'STT': 'index',
  'Mã sản phẩm': 'product_code',
  'Tên Sản phẩm': 'product_name',
  'HÃNG SX': 'brand_name',
  'ĐVT': 'unit_name',
  'SL': 'quantity',
  'ĐƠN GIÁ': 'price',
  'THÀNH TIỀN (VNĐ)': 'amount',
  'GHI CHÚ': 'note'
})

const loading = ref(false)
const store_name = ref('')
const store_tax_code = ref('')
const store_address = ref('')
const store_phone_number = ref('')
const today_day = ref('')
const today_month = ref('')
const today_year = ref('')
const userRole = ref('admin')
const brands_amount = ref([])
const projectProducts = ref([])
const exportingExcel = ref(false)
const showModalChoosePrintFileType = ref(false)

// Methods
const handleProductExcel = () => {
  products_excel.value = []
  if (trade.value.products.length > 0) {
    let productsExcel = JSON.parse(JSON.stringify(trade.value.products))

    for (let i in productsExcel) {
      let item = {
        'index': productsExcel[i].index,
        'product_code': productsExcel[i].product_code ? productsExcel[i].product_code : productsExcel[i].product_code_input,
        'product_name': productsExcel[i].product_name ? productsExcel[i].product_name : productsExcel[i].product_name_input,
        'brand_name': productsExcel[i].brand_name ? productsExcel[i].brand_name : productsExcel[i].brand_name_input,
        'unit_name': productsExcel[i].unit_name ? productsExcel[i].unit_name : productsExcel[i].unit_name_input,
        'quantity': productsExcel[i].quantity,
        'price': productsExcel[i].price_sell,
        'amount': productsExcel[i].amount_sell,
        'note': productsExcel[i].note
      }
      products_excel.value.push(item)
    }
  }
}

const getParentIndexByName = (list_projects_products, project_name) => {
  let pro_ind = 0
  for (let item of list_projects_products) {
    if (item.product_name == project_name) {
      return pro_ind
    }
    pro_ind += 1
  }
  return 0
}

const handleListProduct = () => {
  if (trade.value.products.length > 0) {
    // Create project list
    let list_projects = []
    let list_name_project_checked = []
    for (let p of trade.value.products) {
      if (!list_name_project_checked.includes(p.project_name)) {
        list_name_project_checked.push(p.project_name)
        let project = JSON.parse(JSON.stringify(currentProduct.value))
        project.product_name = p.project_name
        project.project_brand_name = p.project_brand_name
        project.project_unit_name = p.project_unit_name
        project.project_quantity = parseFloat(p.project_quantity)
        project.project_amount = 0
        list_projects.push(project)
      }
    }

    // Group products by project
    let list_projects_products = []
    let project_index = 1
    for (let project of list_projects) {
      project.project_index = project_index
      project.product_type = 0 // Project
      list_projects_products.push(project)

      let product_index = 1
      for (let product of trade.value.products) {
        let project_item = JSON.parse(JSON.stringify(product))
        if (product.project_name == project.product_name) {
          project_item.project_index = project.project_index + "." + product_index
          project_item.product_type = 1 // Product
          list_projects_products.push(project_item)

          let parent_index = getParentIndexByName(list_projects_products, product.project_name)
          let amount_sell = (product.amount_sell + '').replaceAll(",", "")
          list_projects_products[parent_index].project_amount += parseInt(amount_sell)
          product_index += 1
        }
      }

      project_index += 1
    }

    // Calculate project unit price
    for (let project of list_projects_products) {
      if (project.product_type == 0) {
        project.project_price = Math.round(project.project_amount / project.project_quantity)
      }
    }

    projectProducts.value = list_projects_products
  }
}

const getQuotationDetail = () => {
  let quotationId = route.params.id
  if (quotationId) {
    loading.value = true

    quotationApi.getQuotationDetail(quotationId, userRole.value).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        trade.value = res.data.data
        trade.value.show_price_project = trade.value.show_price_project + ''

        // Check if it's a project quotation
        if (trade.value.type == 1) {
          handleListProduct()
        }

        handleProductExcel()

        // Calculate product amount by brand
        calculateProductAmountByBrand()
      }

      loading.value = false

    }).catch(err => {
      loading.value = false

      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const calculateProductAmountByBrand = () => {
  brands_amount.value = []
  let brands = []
  for (let product of trade.value.products) {
    let brand_name = product.brand_name
    if (!brand_name) {
      brand_name = product.brand_name_input
    }
    if (!brand_name) {
      break
    }
    let price = (product.price + "").replaceAll(",", "")
    let quantity = (product.quantity + "").replaceAll(",", "")
    let amount = Math.round(parseInt(price) * parseFloat(quantity))
    if (brands.includes(brand_name)) {
      for (let brand of brands_amount.value) {
        if (brand.name == brand_name) {
          brand.amount += amount
        }
      }
    } else {
      let item = { "name": brand_name, "amount": amount }
      brands_amount.value.push(item)
      brands.push(brand_name)
    }
  }
}

const getStoreDetail = () => {
  let storeId = authStore.user.storeId
  if (storeId) {
    superAdminAPI.getStoreDetail(storeId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        let store = res.data.data
        store_name.value = store.name
        store_phone_number.value = store.phone_number
        store_tax_code.value = ""

        var address = ""
        if (store.address) {
          address += store.address
        }
        if (store.district_name) {
          address += store.district_name
        }
        if (store.city_name) {
          address += ", " + store.city_name
        }
        store_address.value = address
      }
    }).catch(err => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    authStore.logout()
    router.push('/staff-login')
  }
}

const openModalChooseFilePrint = () => {
  showModalChoosePrintFileType.value = true
}

const hideModalChooseFilePrint = () => {
  showModalChoosePrintFileType.value = false
}

const exportExcel = (type = 'excel') => {
  exportingExcel.value = true
  quotationApi.exportExcel({ 'id': trade.value.id, 'type': type }).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let data = res.data.data
      commonFunc.downloadFile(RootAPI.replace('api/', '') + data.file_path, data.file_name)
    }

    exportingExcel.value = false

  }).catch(err => {
    exportingExcel.value = false

    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const printInvoice = () => {
  var mywindow = window.open('', 'PRINT', 'height=900,width=1200')

  mywindow.document.write('<html><head><title> </title><style>')
  mywindow.document.write(' body {font-size: 14px;} ')
  mywindow.document.write(' .print-text-center {text-align: center;} ')
  mywindow.document.write(' .print-text-left {text-align: left;} ')
  mywindow.document.write(' .print-text-right {text-align: right;} ')
  mywindow.document.write(' .print-width-50-left {width: 48%; float: left;} ')
  mywindow.document.write(' .print-width-50-right {width: 48%; float: right;} ')
  mywindow.document.write(' .print-border {border: gray solid 0.03em;} ')
  mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ')
  mywindow.document.write(' .print-table-border > table, th, td {border: gray solid 0.03em; border-collapse: collapse;} ')
  mywindow.document.write(' .print-border {border: gray solid 0.03em; border-collapse: collapse;} ')
  mywindow.document.write(' .print-no-border {border: none;} ')
  mywindow.document.write(' .tr-bg {background-color: #eeece1 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ')
  mywindow.document.write(' .custom-line-height tr { line-height: 25px; } ')
  mywindow.document.write(' .project_name {background-color: #0C5395 !important; color: white; font-weight: bold; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ')

  mywindow.document.write('</style></head><body >')
  mywindow.document.write(document.getElementById('provisionalInvoice').innerHTML)
  mywindow.document.write('</body></html>')

  mywindow.document.close() // necessary for IE >= 10
  mywindow.focus() // necessary for IE >= 10*/

  setTimeout(function () {
    mywindow.print()
    mywindow.close()
  }, 1000)

  return true
}

const convertNumberToText = (number) => {
  let input = (number + '').replaceAll(",", "")
  return commonFunc.convert_number_to_text(input)
}

const back = () => {
  // Go to list
  if (userRole.value == "admin") {
    router.push("/quotation-all")
  } else {
    router.push("/quotation-staff")
  }
}

const currencyFormat = (num) => {
  let result = ""
  if (num == 0) {
    return "0"
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const convertCompanyTypeIdToName = (id) => {
  if (id == 0) {
    return "Khách lẻ"
  }
  if (id == 1) {
    return "Thương mại"
  }
  if (id == 2) {
    return "Nhà máy"
  }
  if (id == 3) {
    return "Công trình"
  }
  return ""
}

const convertCustomerStatusIdToName = (id) => {
  if (id == 1) {
    return "Khách mới"
  }
  if (id == 2) {
    return "Khách cũ"
  }
  return ""
}

const exportToExcel = () => {
  const exportData = products_excel.value.map((item, index) => ({
    'STT': index + 1,
    'Mã sản phẩm': item.product_code,
    'Tên Sản phẩm': item.product_name,
    'HÃNG SX': item.brand_name,
    'ĐVT': item.unit_name,
    'SL': item.quantity,
    'ĐƠN GIÁ': item.price,
    'THÀNH TIỀN (VNĐ)': item.amount,
    'GHI CHÚ': item.note
  }))
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách sản phẩm báo giá')
  XLSX.writeFile(workbook, 'danh_sach_san_pham_bao_gia.xlsx')
}

// Lifecycle hooks
onMounted(() => {
  // UI by staff
  let url = location.href
  if (url.includes("quotation-staff") || url.includes("quotation-project-staff")) {
    userRole.value = "staff"
  }

  // Get today day, month, year
  let dateNow = new Date()
  today_day.value = dateNow.getDate()
  today_month.value = dateNow.getMonth() + 1
  today_year.value = dateNow.getFullYear()

  // Get quotation detail
  getQuotationDetail()

  // Get store info
  getStoreDetail()
})
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

.project_name {
  color: #0C5395 !important;
  font-weight: bold;
}

.project_bg {
  background-color: #6A9AB0 !important;
}
</style>
