<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <button
          @click="back"
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          style="width: 120px">
          Quay lại
        </button>
      </div>

      <div class="mb-4">
        <h4 class="text-2xl text-center font-semibold text-orange-600">{{prefix_title}} ĐH Nhập Tồn Kho</h4>
      </div>
      <hr class="my-4"/>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

      <div class="bg-gray-600 text-white rounded-t-md p-3">
        <h5 class="text-lg font-semibold flex justify-between items-center">
          <span>Thông tin nhà cung cấp</span>
          <span class="cursor-pointer" @click="showPartnerInfo = !showPartnerInfo">
            <i :class="showPartnerInfo ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'" />
          </span>
        </h5>
      </div>

      <div v-show="showPartnerInfo" class="border border-gray-300 border-t-0 p-4 rounded-b-md">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-2">
            <label class="block text-gray-700 mb-2">
              <span>Nhà cung cấp</span>
            </label>
          </div>
          <div class="md:col-span-10">
            <Multiselect
              v-model="supplierSelect"
              :options="supplierOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn nhà cung cấp--"
              label="name"
              track-by="name"
              @update:model-value="changeSupplier">
            </Multiselect>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-2">
            <label class="block text-gray-700">
              Tên nhà cung cấp<span class="text-red-600"></span>
            </label>
          </div>
          <div class="md:col-span-10">
            <input
              id="supplier_name"
              type="text"
              maxlength="255"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="orderBuy.supplier_name"
              :disabled="saving">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-2">
            <label class="block text-gray-700">Địa chỉ</label>
          </div>
          <div class="md:col-span-10">
            <input
              id="supplier_address"
              type="text"
              maxlength="255"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="orderBuy.supplier_address"
              :disabled="saving">
          </div>
        </div>
      </div>

      <div class="bg-blue-500 text-white rounded-t-md p-3 mt-4">
        <h5 class="text-lg font-semibold flex justify-between items-center">
          <span>Thông tin sản phẩm</span>
          <span class="cursor-pointer" @click="showProductInfo = !showProductInfo">
            <i :class="showProductInfo ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'" />
          </span>
        </h5>
      </div>

      <div v-show="showProductInfo" class="border border-gray-300 border-t-0 p-4 rounded-b-md">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-2">
            <label class="block text-gray-700 mb-2">Sản phẩm<span class="text-red-600"></span> </label>
          </div>
          <div class="md:col-span-10">
            <div class="flex">
              <Multiselect
                v-model="productSelect"
                :options="productOptions"
                :loading="loadingProductOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn sản phẩm--"
                label="name_full"
                track-by="name_full"
                @update:model-value="changeProduct"
                class="flex-1">
              </Multiselect>
              <button
                @click="showModalSearchProduct"
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2">
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-2">
            <label class="block text-gray-700">Giá nhập</label>
          </div>
          <div class="md:col-span-10">
            <input
              id="price_list"
              type="text"
              maxlength="14"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="currentProduct.price_buy"
              @change="changePriceBuy()">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-2">
            <label class="block text-gray-700">Số Lượng</label>
          </div>
          <div class="md:col-span-10">
            <input
              id="quantity"
              type="text"
              maxlength="14"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="currentProduct.quantity"
              @keyup="integerPointAndCommaOnly($event.target)"
              @change="changeQuantity()">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-2">
            <label class="block text-gray-700">Ghi Chú</label>
          </div>
          <div class="md:col-span-10">
            <textarea
              id="note"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="currentProduct.note"
            ></textarea>
          </div>
        </div>

        <div class="text-center mb-4">
          <button
            @click="confirmBuyProduct"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
            style="width: 180px">
            {{prefixBuyProduct}} sản phẩm
          </button>
        </div>

        <div class="mb-4" v-show="orderBuy.products.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
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
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">STT</th>
                  <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Mã sản phẩm(*)</th>
                  <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Tên hàng sản phẩm(*)</th>
                  <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Hãng</th>
                  <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Đơn vị(*)</th>
                  <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">số lượng(*)</th>
                  <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Giá nhập</th>
                  <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Thành tiền</th>
                  <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Ghi Chú</th>
                  <th class="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in orderBuy.products" :key="index">
                  <td class="px-3 py-2">{{index + 1}}</td>
                  <td class="px-3 py-2">{{item.product_code}}</td>
                  <td class="px-3 py-2">{{item.product_name}}</td>
                  <td class="px-3 py-2">{{item.product_brand}}</td>
                  <td class="px-3 py-2">{{item.unit}}</td>
                  <td class="px-3 py-2 text-right">{{currencyFormat(item.quantity)}}</td>
                  <td class="px-3 py-2 text-right">{{currencyFormat(item.price_buy)}}</td>
                  <td class="px-3 py-2 text-right">{{currencyFormat(item.amount)}}</td>
                  <td class="px-3 py-2">{{item.note}}</td>
                  <td class="px-3 py-2">
                    <i class="fa fa-edit cursor-pointer text-blue-600 hover:text-blue-800" @click="editProduct(index)" />
                    <i class="fa fa-trash ml-2 cursor-pointer text-red-600 hover:text-red-800" title="Xoá" @click="deleteProduct(index)" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="bg-green-500 text-white rounded-t-md p-3 mt-4">
        <h5 class="text-lg font-semibold flex justify-between items-center">
          <span>Thông tin thanh toán và giao hàng</span>
          <span class="cursor-pointer" @click="showPaymentInfo = !showPaymentInfo">
            <i :class="showPaymentInfo ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'" />
          </span>
        </h5>
      </div>

      <div v-show="showPaymentInfo" class="border border-gray-300 border-t-0 p-4 rounded-b-md">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div class="grid grid-cols-12 gap-2 items-center">
              <div class="col-span-4">
                <label class="block text-gray-700">Tổng thành tiền:</label>
              </div>
              <div class="col-span-8">
                <input
                  id="sub_total"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  v-model="orderBuy.sub_total"
                  readonly>
              </div>
            </div>
          </div>
          <div>
            <div class="grid grid-cols-12 gap-2 items-center">
              <div class="col-span-4">
                <label class="block text-gray-700">Vat</label>
              </div>
              <div class="col-span-8 flex items-center gap-2">
                <input type="checkbox" id="have_vat" v-model="orderBuy.have_vat" class="mr-2" @change="calculateAmount">
                <input
                  id="vat_percent"
                  type="text"
                  maxlength="3"
                  autocomplete="new-password"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="orderBuy.vat_percent"
                  @keyup="integerOnly($event.target)"
                  @change="calculateAmount">
                <input
                  id="vat_value"
                  type="text"
                  maxlength="14"
                  autocomplete="new-password"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="orderBuy.vat_value"
                  @keyup="integerOnly($event.target)"
                  @change="calculateAmount">
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div class="grid grid-cols-12 gap-2 items-center">
              <div class="col-span-4">
                <label class="block text-gray-700">Tổng tiền thanh toán:<span class="text-red-600"></span> </label>
              </div>
              <div class="col-span-8">
                <input
                  id="amount"
                  type="text"
                  maxlength="14"
                  autocomplete="new-password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  v-model="orderBuy.total"
                  readonly>
              </div>
            </div>
          </div>
          <div>
            <div class="grid grid-cols-12 gap-2 items-center">
              <div class="col-span-4">
                <label class="block text-gray-700">Phương thức thanh toán:</label>
              </div>
              <div class="col-span-8">
                <select
                  v-model="orderBuy.payment_method"
                  @change="handleProductExcel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="option in paymentMethodOptions" :key="option.value" :value="option.value">
                    {{option.text}}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div class="grid grid-cols-12 gap-2 items-center">
              <div class="col-span-4">
                <label class="block text-gray-700">Hình thức giao hàng:</label>
              </div>
              <div class="col-span-8">
                <select
                  v-model="orderBuy.shipping_method"
                  @change="handleProductExcel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="option in shippingMethodOptions" :key="option.value" :value="option.value">
                    {{option.text}}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <div class="grid grid-cols-12 gap-2 items-center">
              <div class="col-span-4">
                <label class="block text-gray-700">Số ngày dự kiến GH</label>
              </div>
              <div class="col-span-8">
                <Datepicker
                  v-model="orderBuy.shipping_date"
                  input-format="yyyy-MM-dd">
                </Datepicker>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-2">
          <label class="block text-gray-700">Ghi chú</label>
        </div>
        <div class="md:col-span-10">
          <textarea
            id="description"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="orderBuy.note"
            @change="handleProductExcel"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-between items-center mb-4">
        <button
          @click="updateDraft"
          :disabled="saving || !orderBuy.id"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          style="width: 120px">
          Lưu nháp
        </button>
        <button
          v-if="excel_one_items.length > 0"
          @click="exportExcel"
          class="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded">
          <b>Xuất Excel</b>
        </button>
      </div>

      <div class="text-center mb-4">
        <button
          v-show="!saving"
          @click="save"
          :disabled="saving || !orderBuy.id"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          style="height: 50px; width: 240px">
          <i class="fa fa-pencil-square-o mr-2" />
          Xác Nhận Đơn Hàng
        </button>
        <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
      </div>
    </div>

    <!-- Modal tìm kiếm sản phẩm -->
    <div v-if="showSearchProductModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="hideModalSearchProduct">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white" @click.stop>
        <div class="mb-4">
          <h4 class="text-2xl text-center font-semibold text-orange-600">Tìm kiếm sản phẩm</h4>
        </div>
        <hr class="my-4"/>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 mb-2"> Hãng sản phẩm </label>
            <select
              id="product_brand"
              v-model="productSearch.product_brand_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option v-for="option in productBrandOptions" :key="option.value" :value="option.value">
                {{option.text}}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700 mb-2"> Nhóm sản phẩm </label>
            <Multiselect
              v-model="productGroupSelect"
              :options="productGroupOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn nhóm sản phẩm--"
              label="text"
              track-by="text"
              @update:model-value="changeProductGroupSearch">
            </Multiselect>
          </div>
          <div>
            <label class="block text-gray-700 mb-2"> Loại sản phẩm </label>
            <Multiselect
              v-model="productTypeSelect"
              :options="productTypeOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn loại sản phẩm--"
              label="text"
              track-by="text"
              @update:model-value="changeProductTypeSearch">
            </Multiselect>
          </div>
          <div>
            <label class="block text-gray-700 mb-2"> Mã sản phẩm </label>
            <input
              id="codeProductCus"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              v-model="productSearch.code"
              maxlength="255">
          </div>
          <div>
            <label class="block text-gray-700 mb-2"> Tên sản phẩm </label>
            <input
              id="nameProductCus"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              v-model="productSearch.name"
              maxlength="255">
          </div>
        </div>

        <div class="flex justify-between mb-4">
          <button
            @click="hideModalSearchProduct"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            style="width: 120px">
            Quay lại
          </button>
          <button
            v-show="!onSearchProduct"
            @click="searchProduct"
            :disabled="onSearchProduct"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            style="width: 120px">
            Tìm Kiếm
          </button>
          <span class="loading-more" v-show="onSearchProduct"><icon name="loading" width="60" /></span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">STT</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Nhóm SP</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Loại SP</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Mã SP</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Tên SP</th>
                <th class="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in productSearchItems" :key="index">
                <td class="px-3 py-2">{{item.stt}}</td>
                <td class="px-3 py-2">{{item.product_group_name}}</td>
                <td class="px-3 py-2">{{item.product_type_name}}</td>
                <td class="px-3 py-2">{{item.code}}</td>
                <td class="px-3 py-2">{{item.name}}</td>
                <td class="px-3 py-2">
                  <button
                    @click="chooseProduct(item.id, item.name, item.code, item.product_brand_name, item.unit_name)"
                    class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                    style="width: 120px">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import orderBuyApi from '@/api/orderBuy'
import supplierApi from '@/api/supplier'
import productApi from '@/api/product'
import orderSellApi from '@/api/orderSell'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'

const { popToast } = useToast()
const route = useRoute()
const router = useRouter()

const prefix_title = ref("Thêm Mới")

const paymentMethodOptions = [
  {"value": null, "text": ''},
  {"value": 'Tiền mặt khi nhận hàng', "text": 'Tiền mặt khi nhận hàng'},
  {"value": "Chuyển khoản trước khi nhận hàng", "text": 'Chuyển khoản trước khi nhận hàng'},
  {"value": "Công nợ 7 ngày", "text": 'Công nợ 7 ngày'},
  {"value": "Công nợ 15 ngày", "text": 'Công nợ 15 ngày'},
  {"value": "Công nợ 30 ngày", "text": 'Công nợ 30 ngày'},
  {"value": "Công nợ 45 ngày", "text": 'Công nợ 45 ngày'}
]

const shippingMethodOptions = [
  {"value": null, "text": ''},
  {"value": 'Giao tại kho bên mua', "text": 'Giao tại kho bên mua'},
  {"value": "Giao thẳng cho khách hàng", "text": 'Giao thẳng cho khách hàng'},
  {"value": "Nhân viên bên mua đến lấy", "text": 'Nhân viên bên mua đến lấy'},
  {"value": "Bên mua đặt grap đến lấy", "text": 'Bên mua đặt grap đến lấy'}
]

const showPartnerInfo = ref(true)
const showProductInfo = ref(true)
const showPaymentInfo = ref(true)
const loadingOptions = ref(false)
const loadingProductOptions = ref(false)

const supplierOptions = ref([])
const supplierSelect = ref({})
const productSelect = ref({})
const productOptions = ref([])

const orderBuy = ref({
  supplier_id: null,
  supplier_name: null,
  supplier_address: null,
  products: [],
  sub_total: 0,
  have_vat: false,
  vat_percent: 10,
  vat_value: 0,
  total: 0,
  payment_method: null,
  shipping_method: null,
  shipping_date: new Date(),
  note: null
})

const currentProduct = ref({
  index: -1,
  product_id: null,
  product_code: null,
  product_name: null,
  product_brand: null,
  unit: null,
  price_buy: null,
  quantity: null,
  amount: null,
  note: null,
  order_sell_id: null
})

const loading = ref(false)
const saving = ref(false)
const productBrandOptions = ref([])
const productGroupOptions = ref([])
const productGroupSelect = ref({})
const productTypeSelect = ref({})
const productTypeOptions = ref([])
const productTypeOptionStore = ref([])

const productSearch = ref({
  "code": null,
  "name": null,
  "product_brand_id": null,
  "product_type_id": null,
  "product_group_id": null
})

const onSearchProduct = ref(false)
const productSearchItems = ref([])
const showSearchProductModal = ref(false)
const excel_one_items = ref([])
const prefixBuyProduct = ref("Thêm")

onMounted(() => {
  // Check prefix
  if(route.params.id) {
    prefix_title.value = "Cập Nhật"
  } else {
    prefix_title.value = "Thêm Mới"
  }

  getOrderBuyDetail()
  getSupplierOptions()
  getOptionRelatedProduct()
})

/**
 * Back to list
 */
const back = () => {
  router.push("/order-buy")
}

/**
 * Currency format
 */
const currencyFormat = (num) => {
  let result = ""
  if(num === 0) {
    return "0"
  }
  num = (num + "").replaceAll(",", "")
  if(num) {
    result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

/**
 *  Get detail
 */
const getOrderBuyDetail = () => {
  const orderBuyId = route.params.id
  if(orderBuyId){
    loading.value = true
    orderBuyApi.getOrderBuyDetail(orderBuyId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        orderBuy.value = res.data.data

        // Format
        orderBuy.value.sub_total = currencyFormat((orderBuy.value.sub_total + '').replaceAll(",", ""))
        orderBuy.value.total = currencyFormat((orderBuy.value.total + '').replaceAll(",", ""))
        orderBuy.value.vat_value = currencyFormat((orderBuy.value.vat_value + '').replaceAll(",", ""))

        if(orderBuy.value.supplier_id && supplierOptions.value.length > 0) {
          getSupplierItemById(orderBuy.value.supplier_id)
        }

        // Convert shipping_date to Date object
        if(orderBuy.value.shipping_date) {
          orderBuy.value.shipping_date = new Date(orderBuy.value.shipping_date)
        }
      }

      loading.value = false

    }).catch(err => {
      loading.value = false

      // Handle error
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const getSupplierItemById = (id) => {
  for(let i in supplierOptions.value) {
    if(supplierOptions.value[i].id == id) {
      supplierSelect.value = supplierOptions.value[i]
    }
  }
}

/**
 *  Event change supplier
 */
const changeSupplier = () => {
  if(supplierSelect.value) {
    orderBuy.value.supplier_id = supplierSelect.value.id
    orderBuy.value.supplier_name = supplierSelect.value.name
    orderBuy.value.supplier_address = supplierSelect.value.address
  } else{
    orderBuy.value.supplier_id = null
    orderBuy.value.supplier_name = null
    orderBuy.value.supplier_address = null
  }
}

const showModalSearchProduct = () => {
  showSearchProductModal.value = true
}

const hideModalSearchProduct = () => {
  showSearchProductModal.value = false
}

/**
 * Only input integer and point
 */
const integerPointAndCommaOnly = (item) => {
  let valueInput = item.value
  valueInput = valueInput.replaceAll(",", "")
  let result = commonFunc.integerPointAndCommaOnly(valueInput)

  result = currencyFormat(result)
  item.value = result
}

/**
 *  Event change product
 */
const changeProduct = () => {
  if(productSelect.value) {
    currentProduct.value.product_id = productSelect.value.id
    currentProduct.value.product_name = productSelect.value.name
    currentProduct.value.product_code = productSelect.value.code
    currentProduct.value.product_brand = productSelect.value.brand_name
    currentProduct.value.unit = productSelect.value.unit_name
  } else {
    currentProduct.value.product_id = null
    currentProduct.value.product_name = null
    currentProduct.value.product_code = null
    currentProduct.value.product_brand = null
    currentProduct.value.unit = null
  }
}

const changePriceBuy = () => {
  let price_buy = parseInt((currentProduct.value.price_buy + "").replaceAll(",", ""))
  currentProduct.value.price_buy = currencyFormat(price_buy)
}

const changeQuantity = () => {
  let quantity = parseFloat((currentProduct.value.quantity + "").replaceAll(",", ""))
  currentProduct.value.quantity = currencyFormat(quantity)
}

const editProduct = (index) => {
  currentProduct.value = orderBuy.value.products[index]
  if(currentProduct.value.product_id) {
    productSelect.value = getProductItemById(currentProduct.value.product_id)
  } else {
    productSelect.value = {}
  }
  currentProduct.value.index = index
  currentProduct.value.price_buy = currencyFormat(currentProduct.value.price_buy)
  currentProduct.value.quantity = currencyFormat(currentProduct.value.quantity)

  prefixBuyProduct.value = "Sửa"
}

/**
 *  Xác nhận sản phẩm
 */
const confirmBuyProduct = () => {
  // Check product
  if (!currentProduct.value.product_id) {
    currentProduct.value.product_id = null
    currentProduct.value.product_code = null
    currentProduct.value.product_name = null
    popToast('danger', "Vui lòng chọn sản phẩm")
    return
  }

  // Check price buy
  if (currentProduct.value.price_buy == null || currentProduct.value.price_buy == '') {
    popToast('danger', "Vui lòng nhập [Giá nhập]")
    return
  }

  // Check quantity
  if (currentProduct.value.quantity == null || currentProduct.value.quantity == '') {
    popToast('danger', "Vui lòng nhập [Số lượng]")
    return
  }
  currentProduct.value.price_buy = (currentProduct.value.price_buy + "").replaceAll(",", "")
  currentProduct.value.quantity = (currentProduct.value.quantity + "").replaceAll(",", "")
  currentProduct.value.amount = Math.round(parseInt(currentProduct.value.price_buy) * parseFloat(currentProduct.value.quantity))

  if(currentProduct.value.index == -1) {
    // Thêm mới product
    currentProduct.value.index = orderBuy.value.products.length
    orderBuy.value.products.push(JSON.parse(JSON.stringify(currentProduct.value)))
  } else {
    // Cập nhật product
    orderBuy.value.products[currentProduct.value.index] = JSON.parse(JSON.stringify(currentProduct.value))
  }

  // Tính toán amount
  calculateAmount()

  // Refresh current product
  refreshCurrentProduct()

  // Lưu nháp
  if(orderBuy.value.id) {
    updateDraft()
  } else {
    saveDraft()
  }
}

const refreshCurrentProduct = () => {
  currentProduct.value = {
    index: -1,
    product_id: null,
    product_code: null,
    product_name: null,
    product_brand: null,
    unit: null,
    price_buy: null,
    quantity: null,
    amount: null,
    note: null,
    order_sell_id: null
  }
  productSelect.value = {}
}

/**
 * Tính toán thành tiền sản phẩm
 */
const calculateAmount = () => {
  let amount = 0
  for (let i in orderBuy.value.products) {
    amount += Math.round(parseInt(orderBuy.value.products[i].price_buy) * parseFloat(orderBuy.value.products[i].quantity))
  }
  orderBuy.value.sub_total = currencyFormat(amount)

  // Calculate vat value
  let vat_value = 0
  if(orderBuy.value.have_vat) {
    if(orderBuy.value.vat_percent) {
      vat_value = Math.round(amount * orderBuy.value.vat_percent / 100)
      orderBuy.value.vat_value = currencyFormat(vat_value)
    } else {
      orderBuy.value.vat_value = 0
    }
  } else {
    orderBuy.value.vat_value = 0
  }
  orderBuy.value.total = currencyFormat(amount + vat_value)
}

/**
 *  Save draft
 */
const saveDraft = () => {
  // Reformat data
  const data = JSON.parse(JSON.stringify(orderBuy.value))
  if(!data.supplier_id) {
    data.supplier_id = null
  }
  data.sub_total = (data.sub_total + '').replaceAll(",", "")

  let vat_value = 0
  if(data.vat_value) {
    vat_value = (data.vat_value + '').replaceAll(",", "")
  }
  data.vat_value = vat_value
  data.total = (data.total + '').replaceAll(",", "")

  // Check products
  if(data.products.length == 0) {
    popToast('danger', "Không có sản phẩm nào được chọn!")
    return
  }

  // Format shipping_date
  if(data.shipping_date && data.shipping_date instanceof Date) {
    const year = data.shipping_date.getFullYear()
    const month = String(data.shipping_date.getMonth() + 1).padStart(2, '0')
    const day = String(data.shipping_date.getDate()).padStart(2, '0')
    data.shipping_date = `${year}-${month}-${day}`
  }

  orderBuyApi.saveDraftOrderBuy(data).then(res => {
    if(res != null && res.data != null){
      if (res.data.status == 200) {
        popToast('success', "Lưu nháp thành công!")
        const response = res.data.data
        orderBuy.value.id = response.order_buy_id
        orderBuy.value.order_buy_number = response.order_buy_number

        prefixBuyProduct.value = "Thêm"
      }

      handleProductExcel()
    }
  }).catch(err => {})
}

/**
 *  Get supplier options
 */
const getSupplierOptions = () => {
  loadingOptions.value = true
  supplierApi.getListSupplierOption().then(res => {
    if(res != null && res.data != null && res.data.data != null){
      supplierOptions.value = res.data.data

      const itemEmpty = {"id": null, "name": null, "address": null}
      supplierOptions.value.unshift(itemEmpty)

      loadingOptions.value = false

      if(orderBuy.value.supplier_id && supplierOptions.value.length > 0) {
        getSupplierItemById(orderBuy.value.supplier_id)
      }
    }
  }).catch(err => {
    loadingOptions.value = false
  })
}

/**
 * Get product options
 */
const getOptionRelatedProduct = () => {
  orderSellApi.getOptionRelatedProduct().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      const options = res.data.data

      productGroupOptions.value = options.product_groups
      productTypeOptionStore.value = options.product_types
      productTypeOptions.value = options.product_types
      resetListProductType()
      productOptions.value = options.products
      resetListProduct()
      productBrandOptions.value = options.brands
    }
  })
}

const resetListProductType = () => {
  productTypeSelect.value = {}

  productTypeOptions.value = JSON.parse(JSON.stringify(productTypeOptionStore.value))

  if(productTypeOptions.value.length > 0) {
    const itemEmpty = JSON.parse(JSON.stringify(productTypeOptions.value[0]))
    itemEmpty.id = null
    itemEmpty.name = ""
    productTypeOptions.value.unshift(itemEmpty)
  }

  resetListProduct()
}

const resetListProduct = () => {
  productSelect.value = {}
  productOptions.value = JSON.parse(JSON.stringify(productOptions.value))

  if(productOptions.value.length > 0) {
    const itemEmpty = JSON.parse(JSON.stringify(productOptions.value[0]))
    itemEmpty.id = null
    itemEmpty.name = ""
    itemEmpty.name_full = ""
    productOptions.value.unshift(itemEmpty)
  }
}

/**
 *  Update draft
 */
const updateDraft = () => {
  if(orderBuy.value.id == null) {
    popToast('danger', "Không hợp lệ, vui lòng đợi trong giây lát!")
    return
  }

  const data = JSON.parse(JSON.stringify(orderBuy.value))
  // Check products
  if(data.products.length == 0) {
    popToast('danger', "Không có sản phẩm nào được chọn!")
    return
  }
  for(let product of data.products) {
    product.price_buy = (product.price_buy + '').replaceAll(",", "")
    product.quantity = (product.quantity + '').replaceAll(",", "")
    product.amount = (product.amount + '').replaceAll(",", "")
  }

  if(!data.supplier_id) {
    data.supplier_id = null
  }
  data.sub_total = (data.sub_total + '').replaceAll(",", "")

  let vat_value = 0
  if(data.vat_value) {
    vat_value = (data.vat_value + '').replaceAll(",", "")
  }
  data.vat_value = vat_value
  data.total = (data.total + '').replaceAll(",", "")

  // Format shipping_date
  if(data.shipping_date && data.shipping_date instanceof Date) {
    const year = data.shipping_date.getFullYear()
    const month = String(data.shipping_date.getMonth() + 1).padStart(2, '0')
    const day = String(data.shipping_date.getDate()).padStart(2, '0')
    data.shipping_date = `${year}-${month}-${day}`
  }

  orderBuyApi.updateDraftOrderBuy(data).then(res => {
    if(res != null && res.data != null){
      if (res.data.status == 200) {
        popToast('success', "Lưu nháp thành công!")

        prefixBuyProduct.value = "Thêm"

        handleProductExcel()
      }
    }
  }).catch(err => {})
}

/**
 *  Save
 */
const save = () => {
  // Reformat data
  const data = JSON.parse(JSON.stringify(orderBuy.value))

  // Check nhà cung cấp
  if(!data.supplier_id) {
    popToast('danger', "Vui lòng nhập nhà cung cấp")
    return
  }

  // Check products
  if(data.products.length == 0) {
    popToast('danger', "Chưa có sản phẩm nào được chọn")
    return
  }

  data.sub_total = (data.sub_total + '').replaceAll(",", "")

  let vat_value = 0
  if(data.vat_value) {
    vat_value = (data.vat_value + '').replaceAll(",", "")
  }
  data.vat_value = vat_value
  data.total = (data.total + '').replaceAll(",", "")

  // Format shipping_date
  if(data.shipping_date && data.shipping_date instanceof Date) {
    const year = data.shipping_date.getFullYear()
    const month = String(data.shipping_date.getMonth() + 1).padStart(2, '0')
    const day = String(data.shipping_date.getDate()).padStart(2, '0')
    data.shipping_date = `${year}-${month}-${day}`
  }

  saving.value = true

  orderBuyApi.saveOrderBuy(data).then(res => {
    saving.value = false
    if(res != null && res.data != null){
      if (res.data.status == 200) {
        back()
      }
    }
  }).catch(err => {
    saving.value = false

    // Handle error
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Search
 */
const searchProduct = () => {
  productSearchItems.value = []

  if (onSearchProduct.value) { return }

  onSearchProduct.value = true

  if(!productSearch.value.product_type_id)
  {productSearch.value.product_type_id = null}

  if(!productSearch.value.product_group_id)
  {productSearch.value.product_group_id = null}

  const params = {
    "code": productSearch.value.code,
    "name": productSearch.value.name,
    "product_type_id": productSearch.value.product_type_id,
    "product_group_id": productSearch.value.product_group_id,
    "product_brand_id": productSearch.value.product_brand_id,
    "limit": 100,
    "offset": 0
  }

  productApi.searchProductByStaff(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      productSearchItems.value = res.data.data.products
    } else {
      productSearchItems.value = []
    }
    onSearchProduct.value = false
  }).catch(err => {
    // Handle error
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    onSearchProduct.value = false
  })
}

const getProductItemById = (id) => {
  for(let i in productOptions.value) {
    if(productOptions.value[i].id == id) {
      return productOptions.value[i]
    }
  }
  return {}
}

const chooseProduct = (product_id, product_name, product_code, product_brand, unit) => {
  currentProduct.value.product_id = product_id
  currentProduct.value.product_code = product_code
  currentProduct.value.product_name = product_name
  currentProduct.value.product_brand = product_brand
  currentProduct.value.unit = unit

  productSelect.value = getProductItemById(product_id)

  showSearchProductModal.value = false
}

const changeProductGroupSearch = () => {
  if(productGroupSelect.value.value) {
    productSearch.value.product_group_id = productGroupSelect.value.value

    // Reload list type by group
    productTypeOptions.value = []
    for (let i in productTypeOptionStore.value) {
      if(productSearch.value.product_group_id == productTypeOptionStore.value[i].product_group_id) {
        productTypeOptions.value.push(productTypeOptionStore.value[i])
      }
    }
    if(productTypeOptions.value.length > 0) {
      const itemEmpty = JSON.parse(JSON.stringify(productTypeOptions.value[0]))
      itemEmpty.value = null
      itemEmpty.text = ""
      productTypeOptions.value.unshift(itemEmpty)
    }
  } else {
    productSearch.value.product_group_id = null

    resetListProductType()
  }
}

const changeProductTypeSearch = () => {
  if(productTypeSelect.value.value) {
    productSearch.value.product_type_id = productTypeSelect.value.value
  } else {
    productSearch.value.product_type_id = null
  }
}

const deleteProduct = (indexProduct) => {
  orderBuy.value.products.splice(indexProduct, 1)
  calculateAmount()
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const handleProductExcel = () => {
  excel_one_items.value = [
    {
      'index': 'Nhà cung cấp: ', 'product_code': orderBuy.value.supplier_name,
      'product_name' : null, 'product_brand' : null, 'unit' : null,
      'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
    },
    {
      'index': 'Ngày đặt hàng: ', 'product_code': orderBuy.value.shipping_date,
      'product_name' : null, 'product_brand' : null, 'unit' : null,
      'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
    },
    {
      'index': 'Thời gian GH dự kiến: ', 'product_code': orderBuy.value.shipping_date,
      'product_name' : null, 'product_brand' : null, 'unit' : null,
      'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
    },
    {
      'index': 'Xuất hóa đơn: ', 'product_code': orderBuy.value.have_vat ? 'Có': 'Không',
      'product_name' : null, 'product_brand' : null, 'unit' : null,
      'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
    },
    {
      'index': 'Phương thức thanh toán: ', 'product_code': orderBuy.value.payment_method,
      'product_name' : null, 'product_brand' : null, 'unit' : null,
      'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
    },
    {
      'index': 'Tổng tiền gồm VAT: ', 'product_code': orderBuy.value.total,
      'product_name' : null, 'product_brand' : null, 'unit' : null,
      'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
    },
    {
      'index': 'Số Đơn hàng bán: ', 'product_code': "",
      'product_name' : null, 'product_brand' : null, 'unit' : null,
      'quantity' : null, 'price_buy' : null, 'amount' : null, 'note' : null
    }
  ]

  if(orderBuy.value.products.length > 0) {
    const productsExcel = JSON.parse(JSON.stringify(orderBuy.value.products))

    for(let i in productsExcel) {
      const item = {
        'index': parseInt(productsExcel[i].index),
        'product_code': productsExcel[i].product_code,
        'product_name' : productsExcel[i].product_name,
        'product_brand' : productsExcel[i].product_brand,
        'unit' : productsExcel[i].unit,
        'quantity' : productsExcel[i].quantity,
        'price_buy' : productsExcel[i].price_buy,
        'amount' : productsExcel[i].amount,
        'note' : productsExcel[i].note
      }
      excel_one_items.value.push(item)
    }
  }
}

const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(excel_one_items.value)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "DS SP trong đơn hàng")
  XLSX.writeFile(wb, "danh_sach_san_pham_trong_don_hang.xlsx")
}
</script>

<style lang="scss" scoped>
.title-partner {
  border-radius: 5px 5px;
  padding: 5px;
}
</style>
