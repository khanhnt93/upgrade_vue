<template>
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Back button -->
        <div class="flex justify-between mb-4">
          <button
            @click="back"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors w-32">
            Quay lại
          </button>
        </div>

        <!-- Title -->
        <div class="mb-4">
          <h4 class="text-2xl font-bold text-center text-blue-600">Thêm Mới ĐH Nhập Từ ĐH Bán</h4>
        </div>
        <hr class="my-4"/>

        <!-- Order Sell Selection -->
        <div class="flex items-center gap-4 mt-4">
          <label class="w-48 font-medium">
            <span>Từ đơn hàng bán</span>
          </label>
          <div class="flex-1 flex gap-2">
            <div class="flex-1">
              <multiselect
                v-model="orderSellSelect"
                :options="orderSellOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn từ đơn hàng bán--"
                label="name"
                track-by="name">
              </multiselect>
            </div>

            <button
              @click="showModalSearchOrderSell"
              class="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              title="Tìm kiếm">
              <i class="fa fa-search"></i>
            </button>

            <button
              @click="chooseOrderSell()"
              :disabled="!orderSellSelect?.id"
              class="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Chọn">
              <i class="fa fa-arrow-down"></i>
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-show="loadingOrderSell" class="flex justify-center my-4">
          <icon name="loading" width="60" />
        </div>

        <!-- Product list from order sell -->
        <div v-show="productOfOrderSell.length > 0" class="mt-6">
          <label class="font-medium">
            Danh sách sản phẩm cần đặt hàng của đơn hàng bán
            [<b>{{orderSellDetail.order_sell_number}}</b>]
            [<b>{{orderSellDetail.customer_name}}</b>]
          </label>
        </div>

        <div v-show="productOfOrderSell.length > 0" class="mt-4 overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <colgroup>
              <col style="width:3%">
              <col style="width:3%">
              <col style="width:12%">
              <col style="width:12%">
              <col style="width:5%">
              <col style="width:5%">
              <col style="width:8%">
              <col style="width:12%">
              <col style="width:10%">
              <col style="width:18%">
              <col style="width:6%">
              <col style="width:6%">
            </colgroup>
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">STT</th>
                <th class="border border-gray-300 px-2 py-2 text-center">
                  <input type="checkbox" v-model="checkAll" class="mr-2" @change="changeCheckAll()" checked>
                </th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">Mã hàng</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">Tên hàng</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">Hãng</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">Đơn vị</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">Số Lượng</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">Giá Nhập</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">Thành tiền</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">Nhà Cung Cấp</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">SL hàng trong kho</th>
                <th class="border border-gray-300 px-2 py-2 text-center font-bold">SL hàng đang tạm giữ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in productOfOrderSell" :key="index" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-2 py-2 text-center">{{index + 1}}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">
                  <input type="checkbox" :id="'is_get_' + index" class="mr-2" checked>
                </td>
                <td class="border border-gray-300 px-2 py-2">{{item.product_code}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.product_name}}</td>
                <td class="border border-gray-300 px-2 py-2">{{item.brand_name}}</td>
                <td class="border border-gray-300 px-2 py-2 text-right">{{item.unit_name}}</td>
                <td class="border border-gray-300 px-2 py-2 text-right">
                  <input
                    :id="'quantity_' + index"
                    type="text"
                    maxlength="11"
                    autocomplete="new-password"
                    class="w-full px-2 py-1 border border-gray-300 rounded"
                    :value="item.quantity"
                    @keyup="integerPointAndCommaOnly($event.target)"
                    @change="changeQuantity(index)">
                </td>
                <td class="border border-gray-300 px-2 py-2 text-right">
                  <input
                    :id="'price_' + index"
                    type="text"
                    maxlength="11"
                    autocomplete="new-password"
                    class="w-full px-2 py-1 border border-gray-300 rounded"
                    :value="item.price_buy"
                    @change="changePrice(index)">
                </td>
                <td class="border border-gray-300 px-2 py-2 text-right">
                  <input
                    :id="'amount_' + index"
                    type="text"
                    maxlength="14"
                    autocomplete="new-password"
                    class="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100"
                    :value="item.amount"
                    readonly>
                </td>
                <td class="border border-gray-300 px-2 py-2">
                  <multiselect
                    v-model="supplierSelect[index]"
                    :options="supplierOptions"
                    :loading="loadingOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="--Chọn NCC--"
                    label="name"
                    track-by="name">
                  </multiselect>
                </td>
                <td class="border border-gray-300 px-2 py-2 text-center">{{item.quantity_repo}}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">{{item.quantity_keep}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Confirm/Cancel buttons -->
        <div v-show="productOfOrderSell.length > 0" class="flex justify-center gap-4 mt-4">
          <button
            @click="cancelChooseOrderSell"
            class="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors w-48">
            Huỷ chọn
          </button>
          <button
            @click="confirmOrderSell"
            :disabled="productOfOrderSell.length == 0"
            class="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors w-48 disabled:opacity-50 disabled:cursor-not-allowed">
            Xác nhận đặt hàng
          </button>
        </div>

        <!-- Confirmed order sells list -->
        <div v-show="orderSells.length > 0" class="mt-8">
          <label class="font-bold">Danh sách đơn hàng bán đã xác nhận</label>
        </div>

        <div v-show="orderSells.length > 0" class="mt-4 overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-4 py-2 text-center font-bold">STT</th>
                <th class="border border-gray-300 px-4 py-2 text-center font-bold">Ngày Lập</th>
                <th class="border border-gray-300 px-4 py-2 text-center font-bold">Số đơn hàng</th>
                <th class="border border-gray-300 px-4 py-2 text-center font-bold">Khách hàng</th>
                <th class="border border-gray-300 px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in orderSells" :key="index" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2 text-center">{{index + 1}}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{item.created_at}}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">{{item.order_sell_number}}</td>
                <td class="border border-gray-300 px-4 py-2">{{item.customer_name}}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  <i class="fa fa-edit cursor-pointer text-blue-500 hover:text-blue-700" @click="editOrderSell(index)" title="Sửa" />
                  <i class="fa fa-trash ml-2 cursor-pointer text-red-500 hover:text-red-700" title="Xoá"
                     @click="deleteOrderSell(index)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Order Buy Details -->
        <div v-for="(orderBuy, index) in orderBuys" :key="index" class="mt-6 border-t pt-6">
          <div class="mb-4">
            <label class="text-lg font-bold text-blue-600">THÔNG TIN ĐƠN HÀNG NHẬP SỐ: {{index + 1}}</label>
          </div>

          <div class="mb-4">
            <label class="font-medium">Nhà cung cấp: <b>{{orderBuy.supplier_name}}</b></label>
            <p class="text-gray-600">Địa chỉ: {{orderBuy.supplier_address}}</p>
          </div>

          <!-- Products table -->
          <div class="overflow-x-auto mb-4">
            <table class="min-w-full border border-gray-300">
              <colgroup>
                <col style="width:4%">
                <col style="width:17%">
                <col style="width:20%">
                <col style="width:6%">
                <col style="width:6%">
                <col style="width:5%">
                <col style="width:10%">
                <col style="width:12%">
                <col style="width:13%">
                <col style="width:7%">
              </colgroup>
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-300 px-2 py-2 text-center font-bold">STT</th>
                  <th class="border border-gray-300 px-2 py-2 text-center font-bold">Mã sản phẩm(*)</th>
                  <th class="border border-gray-300 px-2 py-2 text-center font-bold">Tên hàng sản phẩm(*)</th>
                  <th class="border border-gray-300 px-2 py-2 text-center font-bold">Hãng</th>
                  <th class="border border-gray-300 px-2 py-2 text-center font-bold">Đơn vị(*)</th>
                  <th class="border border-gray-300 px-2 py-2 text-center font-bold">số lượng(*)</th>
                  <th class="border border-gray-300 px-2 py-2 text-center font-bold">Giá nhập</th>
                  <th class="border border-gray-300 px-2 py-2 text-center font-bold">Thành tiền</th>
                  <th class="border border-gray-300 px-2 py-2 text-center font-bold">Ghi Chú</th>
                  <th class="border border-gray-300 px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, indexPro) in orderBuy.products" :key="indexPro" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-2 py-2 text-center">{{indexPro + 1}}</td>
                  <td class="border border-gray-300 px-2 py-2">{{product.product_code}}</td>
                  <td class="border border-gray-300 px-2 py-2">{{product.product_name}}</td>
                  <td class="border border-gray-300 px-2 py-2">{{product.product_brand}}</td>
                  <td class="border border-gray-300 px-2 py-2">{{product.unit}}</td>
                  <td class="border border-gray-300 px-2 py-2 text-right">{{currencyFormat(product.quantity)}}</td>
                  <td class="border border-gray-300 px-2 py-2 text-right">{{currencyFormat(product.price_buy)}}</td>
                  <td class="border border-gray-300 px-2 py-2 text-right">{{currencyFormat(product.amount)}}</td>
                  <td class="border border-gray-300 px-2 py-2">{{product.note}}</td>
                  <td class="border border-gray-300 px-2 py-2 text-center">
                    <i class="fa fa-trash cursor-pointer text-red-500 hover:text-red-700" title="Xoá"
                       @click="deleteProduct(index, indexPro)" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Order Buy summary -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Left column -->
            <div>
              <div class="flex items-center gap-4 mb-3">
                <label class="w-40 font-medium">Tổng thành tiền:</label>
                <input
                  :id="'sub_total_' + index"
                  type="text"
                  maxlength="14"
                  autocomplete="new-password"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  :value="currencyFormat(orderBuy.sub_total)"
                  readonly>
              </div>
            </div>

            <!-- Right column -->
            <div>
              <div class="flex items-center gap-4 mb-3">
                <label class="w-40 font-medium">Vat</label>
                <div class="flex-1 flex gap-2">
                  <input type="checkbox" :id="'have_vat_' + index" class="mr-2"
                         @change="calculateAmount(index)">
                  <input
                    :id="'vat_percent_' + index"
                    type="text"
                    maxlength="3"
                    autocomplete="new-password"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded"
                    @keyup="integerOnly($event.target)"
                    :value="orderBuy.vat_percent"
                    @change="calculateAmount(index)">
                  <input
                    :id="'vat_value_' + index"
                    type="text"
                    maxlength="14"
                    autocomplete="new-password"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded"
                    @keyup="integerOnly($event.target)"
                    @change="calculateAmount(index)">
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Left column -->
            <div>
              <div class="flex items-center gap-4 mb-3">
                <label class="w-40 font-medium">Tổng tiền thanh toán:<span class="text-red-500">*</span></label>
                <input
                  :id="'amount_' + index"
                  type="text"
                  maxlength="14"
                  autocomplete="new-password"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  :value="currencyFormat(orderBuy.total)"
                  readonly>
              </div>
            </div>

            <!-- Right column -->
            <div>
              <div class="flex items-center gap-4 mb-3">
                <label class="w-40 font-medium">Phương thức thanh toán:<span class="text-red-500">*</span></label>
                <select
                  :id="'payment_method_' + index"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="option in paymentMethodOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Left column -->
            <div>
              <div class="flex items-center gap-4 mb-3">
                <label class="w-40 font-medium">Hình thức giao hàng:</label>
                <select
                  :id="'shipping_method_' + index"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="option in shippingMethodOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Right column -->
            <div>
              <div class="flex items-center gap-4 mb-3">
                <label class="w-40 font-medium">Số ngày dự kiến GH</label>
                <Datepicker
                  :id="'shipping_date_' + index"
                  v-model="orderBuy.shipping_date_model"
                  :inputFormat="'yyyy-MM-dd'"
                  :typeable="true"
                  class="flex-1" />
              </div>
            </div>
          </div>

          <div class="flex items-start gap-4 mb-4">
            <label class="w-32 font-medium mt-2">Ghi chú</label>
            <textarea
              :id="'note_' + index"
              rows="2"
              class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </div>

        <!-- Save button -->
        <div class="flex justify-center mt-6">
          <button
            v-show="!saving && orderSells.length > 0"
            @click="save"
            :disabled="saving"
            class="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style="height: 50px; width: 240px">
            <i class="fa fa-pencil-square-o"></i>
            <span>Xác Nhận Tất Cả</span>
          </button>
          <div v-show="saving" class="flex justify-center">
            <icon name="loading" width="60" />
          </div>
        </div>

      </div>
    </div>

    <!-- Modal search order sell -->
    <div v-if="showSearchModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Modal header -->
          <div class="mb-4">
            <h4 class="text-2xl font-bold text-center text-green-600">Tìm kiếm đơn hàng bán</h4>
          </div>
          <hr class="my-4"/>

          <!-- Search fields -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block mb-2 font-medium">Mã đơn hàng</label>
              <input
                id="order_sell_number"
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="orderSellSearch.order_sell_number"
                maxlength="15">
            </div>
            <div>
              <label class="block mb-2 font-medium">Tên khách hàng</label>
              <input
                id="customer_name"
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="orderSellSearch.customer_name"
                maxlength="255">
            </div>
          </div>

          <!-- Modal buttons -->
          <div class="flex justify-between mb-4">
            <button
              @click="showSearchModal = false"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors w-32">
              Quay lại
            </button>
            <button
              @click="searchOrderSell"
              :disabled="onSearchOrderSell"
              class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-32 disabled:opacity-50 disabled:cursor-not-allowed">
              Tìm Kiếm
            </button>
          </div>

          <!-- Search results table -->
          <div class="overflow-x-auto mb-4">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-center font-bold">STT</th>
                  <th class="border border-gray-300 px-4 py-2 text-center font-bold">Ngày lập</th>
                  <th class="border border-gray-300 px-4 py-2 text-center font-bold">Số ĐH</th>
                  <th class="border border-gray-300 px-4 py-2 text-center font-bold">Tên K.H</th>
                  <th class="border border-gray-300 px-4 py-2 text-center font-bold">Thành tiền</th>
                  <th class="border border-gray-300 px-4 py-2 text-center font-bold">NV phụ trách</th>
                  <th class="border border-gray-300 px-4 py-2 text-center font-bold"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in orderSellSearchItems" :key="item.id" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2 text-center">{{index + 1}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-center">{{item.created_at}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-center">{{item.order_sell_number}}</td>
                  <td class="border border-gray-300 px-4 py-2">{{item.customer_name}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">{{item.amount}}</td>
                  <td class="border border-gray-300 px-4 py-2">{{item.staff_in_change}}</td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <button
                      @click="chooseOrderSell(item.id)"
                      class="px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors w-32">
                      Chọn
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="text-center">
            <p>---Hết---</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import orderBuyApi from '@/api/orderBuy'
import supplierApi from '@/api/supplier'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { popToast } = useToast()

// Reactive data
const paymentMethodOptions = ref([
  {"value": null, "text": ''},
  {"value": 'Tiền mặt khi nhận hàng', "text": 'Tiền mặt khi nhận hàng'},
  {"value": "Chuyển khoản trước khi nhận hàng", "text": 'Chuyển khoản trước khi nhận hàng'},
  {"value": "Công nợ 7 ngày", "text": 'Công nợ 7 ngày'},
  {"value": "Công nợ 15 ngày", "text": 'Công nợ 15 ngày'},
  {"value": "Công nợ 30 ngày", "text": 'Công nợ 30 ngày'},
  {"value": "Công nợ 45 ngày", "text": 'Công nợ 45 ngày'}
])

const shippingMethodOptions = ref([
  {"value": null, "text": ''},
  {"value": 'Giao tại kho bên mua', "text": 'Giao tại kho bên mua'},
  {"value": "Giao thẳng cho khách hàng", "text": 'Giao thẳng cho khách hàng'},
  {"value": "Nhân viên bên mua đến lấy", "text": 'Nhân viên bên mua đến lấy'},
  {"value": "Bên mua đặt grap đến lấy", "text": 'Bên mua đặt grap đến lấy'}
])

const orderSellOptions = ref([])
const loadingOptions = ref(false)
const orderSellSelect = ref({})
const loadingOrderSell = ref(false)
const orderSellDetail = ref({})
const productOfOrderSell = ref([])
const productConfirmed = ref([])
const orderSells = ref([])
const orderBuys = ref([])
const saving = ref(false)
const supplierSelect = ref([])
const supplierOptions = ref([])
const orderSellSearchItems = ref([])
const onSearchOrderSell = ref(false)
const orderSellSearch = reactive({
  order_sell_number: null,
  customer_name: null
})
const checkAll = ref(true)
const showSearchModal = ref(false)

// Lifecycle hooks
onMounted(() => {
  getSupplierOptions()
  getOptionOrderSell()
})

// Methods
const back = () => {
  router.push("/order-buy")
}

const currencyFormat = (num) => {
  if(num == null || num == undefined) {
    return ""
  }
  let result = ""
  if(num == 0) {
    return "0"
  }
  num = (num + "").replace(",", "")
  if(num) {
    result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const getSupplierOptions = () => {
  loadingOptions.value = true
  supplierApi.getListSupplierOption().then(res => {
    if(res != null && res.data != null && res.data.data != null){
      supplierOptions.value = res.data.data

      let itemEmpty = {"id": null, "name": null, "address": null}
      supplierOptions.value.unshift(itemEmpty)

      loadingOptions.value = false
    }
  }).catch(err => {
    loadingOptions.value = false
  })
}

const getOptionOrderSell = () => {
  orderBuyApi.getOrderSellOptions().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      orderSellOptions.value = res.data.data

      let itemEmpty = {"id": null, "name": null}
      orderSellOptions.value.unshift(itemEmpty)

      // Check tạo đơn hàng nhập từ đơn hàng bán
      let url = location.href
      if(url.includes("order-buy-from-order-sell")) {
        let orderSellId = route.params.orderSellId
        chooseOrderSell(orderSellId)
      }
    }
  })
}

const showModalSearchOrderSell = () => {
  showSearchModal.value = true
}

const chooseOrderSell = (orderSellId) => {
  if(orderSellId) {
    for(let item of orderSellOptions.value) {
      if(item.id == orderSellId) {
        orderSellSelect.value = item
        break
      }
    }

    // Call api, get order sell detail
    getOrderSellDetailById(orderSellSelect.value.id)
    showSearchModal.value = false
  } else {
    if(orderSellSelect.value) {
      // Call api, get order sell detail
      getOrderSellDetailById(orderSellSelect.value.id)
    }
  }
}

const getOrderSellDetailById = (orderSellId) => {
  if(orderSellId){
    loadingOrderSell.value = true
    productOfOrderSell.value = []

    orderBuyApi.getOrderSellDetail(orderSellId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        orderSellDetail.value = res.data.data
        if(orderSellDetail.value.products && orderSellDetail.value.products.length > 0) {
          productOfOrderSell.value = orderSellDetail.value.products

          for(let index in productOfOrderSell.value) {
            productOfOrderSell.value[index].amount = null
          }
        }
      }

      loadingOrderSell.value = false

    }).catch(err => {
      loadingOrderSell.value = false

      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const cancelChooseOrderSell = () => {
  orderSellSelect.value = {}
  productOfOrderSell.value = []
}

const confirmOrderSell = () => {
  // Handle product
  let products = JSON.parse(JSON.stringify(orderSellDetail.value.products))
  let products_checked = []

  for(let index in products) {
    index = parseInt(index)

    // Kiểm tra việc bỏ qua sản phẩm
    let is_get_product = document.getElementById("is_get_" + index).checked
    if(!is_get_product) {
      continue
    }

    // Validate and set value
    let supplier = supplierSelect.value[index]
    if(!supplier || !supplier.id) {
      popToast('danger', "Vui lòng chọn nhà cung cấp tại sản phẩm số " + (index + 1))
      return
    }
    products[index].supplier_id = supplier.id
    products[index].supplier_name = supplier.name
    products[index].supplier_address = supplier.address

    let price_buy = document.getElementById("price_" + index).value
    if(!price_buy) {
      popToast('danger', "Vui lòng nhập giá mua tại sản phẩm số " + (index + 1))
      return
    }
    price_buy = (price_buy + "").replaceAll(",", "")
    products[index].price_buy = price_buy

    let quantity = document.getElementById("quantity_" + index).value
    quantity = (quantity + "").replaceAll(",", "")
    if(!quantity) {
      popToast('danger', "Vui lòng nhập số lượng tại sản phẩm số " + (index + 1))
      return
    }
    products[index].quantity = quantity
    products[index].amount = Math.round(parseInt(price_buy) * parseFloat(quantity))
    products[index].note = null
    products[index].unit = products[index].unit_name
    products[index].product_brand = products[index].brand_name
    products[index].order_sell_id = orderSellDetail.value.id

    productConfirmed.value.push(products[index])
    products_checked.push(products[index])
  }

  if(products_checked.length == 0) {
    popToast('danger', "Không có sản phẩm nào được chọn")
    return
  }

  orderSellDetail.value.products = products_checked
  orderSells.value.push(JSON.parse(JSON.stringify(orderSellDetail.value)))
  orderSellSelect.value = {}
  orderSellDetail.value = {}
  productOfOrderSell.value = []

  // Tính toán tách đơn hàng nhập
  calOrderBuy()
}

const editOrderSell = (index) => {
  orderSellDetail.value = JSON.parse(JSON.stringify(orderSells.value[index]))
  let products = orderSellDetail.value.products
  productOfOrderSell.value = products
  orderSells.value.splice(index, 1)
  reCalOrderBuy()

  for(let i in products) {
    let price_buy = currencyFormat(products[i].price_buy)
    products[i].price_buy = price_buy

    let quantity = currencyFormat(products[i].quantity)
    products[i].quantity = quantity

    let amount = currencyFormat(products[i].amount)
    products[i].amount = amount
  }
}

const deleteOrderSell = (index) => {
  orderSells.value.splice(index, 1)
  if(orderSells.value.length == 0) {
    orderBuys.value = []
  } else {
    reCalOrderBuy()
  }
}

const reCalOrderBuy = () => {
  productConfirmed.value = []
  for(let index in orderSells.value) {
    productConfirmed.value = productConfirmed.value.concat(orderSells.value[index].products)
  }
  // Tính toán tách đơn hàng nhập
  calOrderBuy()
}

const getIndexOfOrderBuy = (orderBuys, supplier_id) => {
  for(let index in orderBuys) {
    if(orderBuys[index].supplier_id == supplier_id) {
      return index
    }
  }
  return -1
}

const calOrderBuy = () => {
  let orderBuysTemp = []

  // Group by supplier
  let supplierIdChecked = []
  for(let item of productConfirmed.value) {
    let orderBuy = {}
    if(supplierIdChecked.includes(item.supplier_id)) {

      let index = getIndexOfOrderBuy(orderBuysTemp, item.supplier_id)
      orderBuysTemp[index].order_sell_ids.push(item.order_sell_id)
      orderBuysTemp[index].products.push(item)
      orderBuysTemp[index].sub_total += parseInt(parseInt(item.price_buy) * parseFloat(item.quantity))

      let vat_value = 0
      let vat_percent = 10
      let have_vat = false
      let have_vat_flag = document.getElementById("have_vat_" + index)
      if(have_vat_flag) {
        have_vat = have_vat_flag.checked
        if(have_vat) {
          vat_percent = document.getElementById("vat_percent_" + index).value
          if(vat_percent) {
            vat_value = Math.round((orderBuysTemp[index].sub_total) * vat_percent / 100)
          }
        }
      }

      orderBuysTemp[index].have_vat = have_vat
      orderBuysTemp[index].vat_percent = vat_percent
      orderBuysTemp[index].vat_value = vat_value

      let vat_value_flag = document.getElementById("vat_value_" + index)
      if(vat_value_flag) {
        vat_value_flag.value = currencyFormat(vat_value)
      }

      orderBuysTemp[index].total = orderBuysTemp[index].sub_total + vat_value
      orderBuysTemp[index].note = null
    } else {
      orderBuy = {
        order_sell_ids: [item.order_sell_id],
        supplier_id: item.supplier_id,
        supplier_name: item.supplier_name,
        supplier_address: item.supplier_address,
        products: [item],
        sub_total: Math.round(parseInt(item.price_buy) * parseFloat(item.quantity)),
        have_vat: false,
        vat_percent: 10,
        vat_value: 0,
        total: Math.round(parseInt(item.price_buy) * parseFloat(item.quantity)),
        payment_method: null,
        shipping_method: null,
        shipping_date: null,
        shipping_date_model: null,
        note: null
      }
      orderBuysTemp.push(orderBuy)
      supplierIdChecked.push(item.supplier_id)
    }
  }

  orderBuys.value = orderBuysTemp
}

const deleteProduct = (indexOrderBuy, indexProduct) => {
  orderBuys.value[indexOrderBuy].products.splice(indexProduct, 1)
  if(orderBuys.value[indexOrderBuy].products.length == 0) {
    orderBuys.value.splice(indexOrderBuy, 1)
  } else {
    calculateAmount(indexOrderBuy)
  }
}

const integerPointAndCommaOnly = (item) => {
  let valueInput = item.value
  valueInput = valueInput.replaceAll(",", "")
  let result = commonFunc.integerPointAndCommaOnly(valueInput)

  result = currencyFormat(result)
  item.value = result
}

const calSubTotal = (index) => {
  let result = 0
  for(let item of orderBuys.value[index].products) {
    result += parseInt(item.amount)
  }
  return result
}

const calculateAmount = (index) => {
  index = parseInt(index)
  let sub_total = calSubTotal(index)
  orderBuys.value[index].sub_total = sub_total

  let vat_value = 0
  let have_vat = document.getElementById("have_vat_" + index).checked
  if(have_vat) {
    let vat_percent = document.getElementById("vat_percent_" + index).value
    if(vat_percent) {
      vat_value = Math.round((sub_total) * vat_percent / 100)

      orderBuys.value[index].vat_value = currencyFormat(vat_value)
      orderBuys.value[index].vat_percent = vat_percent
    } else {
      orderBuys.value[index].vat_value = 0
    }
  } else {
    orderBuys.value[index].vat_value = 0
  }
  document.getElementById("vat_value_" + index).value = currencyFormat(vat_value)
  orderBuys.value[index].total = parseInt(sub_total) + parseInt(vat_value)
}

const save = () => {
  if(orderBuys.value.length == 0) {
    popToast('danger', "Chưa có đơn hàng nào được chọn")
    return
  }

  // Handle data order buy
  for (let index in orderBuys.value) {
    index = parseInt(index)
    let sub_total = (orderBuys.value[index].sub_total + "").replaceAll(",","")
    let vat_value = 0
    let vat_percent = 10
    let have_vat = document.getElementById("have_vat_" + index).checked
    if(have_vat) {
      vat_percent = document.getElementById("vat_percent_" + index).value
      if(vat_percent) {
        vat_value = Math.round((sub_total) * vat_percent / 100)
      }
    }

    orderBuys.value[index].have_vat = have_vat
    orderBuys.value[index].vat_percent = vat_percent
    orderBuys.value[index].vat_value = vat_value
    orderBuys.value[index].total = parseInt(sub_total) + parseInt(vat_value)

    let payment_method = document.getElementById("payment_method_" + index).value
    if(!payment_method) {
      popToast('danger', "Vui lòng chọn [Phương thức thanh toán] cho đơn hàng số " + (index + 1))
      return
    }
    orderBuys.value[index].payment_method = payment_method
    orderBuys.value[index].shipping_method = document.getElementById("shipping_method_" + index).value

    // Get shipping date from model
    let shipping_date = orderBuys.value[index].shipping_date_model
    if (shipping_date && shipping_date instanceof Date) {
      const year = shipping_date.getFullYear()
      const month = String(shipping_date.getMonth() + 1).padStart(2, '0')
      const day = String(shipping_date.getDate()).padStart(2, '0')
      orderBuys.value[index].shipping_date = `${year}-${month}-${day}`
    } else {
      orderBuys.value[index].shipping_date = null
    }

    orderBuys.value[index].note = document.getElementById("note_" + index).value
  }

  saving.value = true
  orderBuyApi.saveOrderBuyByGroup(orderBuys.value).then(res => {
    if(res != null && res.data != null) {
      router.push("/order-buy")
    }

    saving.value = false
  }).catch(err => {
    saving.value = false

    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const changePrice = (index) => {
  let price_buy = document.getElementById("price_" + index).value
  if(price_buy) {
    price_buy = (price_buy + "").replaceAll(",", "")

    let quantity = document.getElementById("quantity_" + index).value
    if(quantity) {
      quantity = (quantity + "").replaceAll(",", "")
      let amount = Math.round(parseInt(price_buy) * parseFloat(quantity))
      amount = currencyFormat(amount)
      productOfOrderSell.value[index].amount = amount
      document.getElementById("amount_" + index).value = amount
    } else {
      productOfOrderSell.value[index].amount = null
      document.getElementById("amount_" + index).value = null
    }

    price_buy = currencyFormat(price_buy)
    document.getElementById("price_" + index).value = price_buy
    productOfOrderSell.value[index].price_buy = price_buy
  } else {
    productOfOrderSell.value[index].amount = null
    document.getElementById("amount_" + index).value = null
  }
}

const changeQuantity = (index) => {
  let quantity = document.getElementById("quantity_" + index).value
  if(quantity) {
    quantity = (quantity + "").replaceAll(",", "")

    let price_buy = document.getElementById("price_" + index).value
    if(price_buy) {
      price_buy = (price_buy + "").replaceAll(",", "")
      let amount = Math.round(parseInt(price_buy) * parseFloat(quantity))
      productOfOrderSell.value[index].amount = currencyFormat(amount)
      document.getElementById("amount_" + index).value = amount
    } else {
      productOfOrderSell.value[index].amount = null
      document.getElementById("amount_" + index).value = null
    }

    quantity = currencyFormat(quantity)
    document.getElementById("quantity_" + index).value = quantity
    productOfOrderSell.value[index].quantity = quantity
  } else {
    productOfOrderSell.value[index].amount = null
    document.getElementById("amount_" + index).value = null
  }
}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const searchOrderSell = () => {
  if (onSearchOrderSell.value) { return }

  onSearchOrderSell.value = true

  let params = {
    "order_sell_number": orderSellSearch.order_sell_number,
    "customer_name": orderSellSearch.customer_name,
    "limit": 100,
    "offset": 0
  }

  orderBuyApi.searchOrderSell(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      orderSellSearchItems.value = res.data.data
    } else {
      orderSellSearchItems.value = []
    }
    onSearchOrderSell.value = false
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    onSearchOrderSell.value = false
  })
}

const changeCheckAll = () => {
  for(let index in productOfOrderSell.value) {
    document.getElementById("is_get_" + index).checked = checkAll.value
  }
}
</script>

<style scoped>
.datepicker-cus {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.datepicker-cus:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
