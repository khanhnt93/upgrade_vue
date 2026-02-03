<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-start mb-4">
          <button
            @click="back"
            class="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors w-32"
          >
            Quay lại
          </button>
        </div>

        <h4 class="text-2xl font-semibold text-center mb-4">{{title}}</h4>
        <hr class="mb-6">

        <div v-if="!repository.is_correction" class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span>Từ đơn hàng bán</span>
            </label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <div class="flex gap-2">
              <multiselect
                v-model="orderSellSelect"
                :options="orderSellOptions"
                :loading="loadingOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn từ đơn hàng nhập--"
                label="name"
                track-by="name"
                @input="changeOrderBuy"
                class="flex-1"
              />
              <button
                @click="showModalSearchOrderBuy"
                title="Tìm kiếm"
                class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="!repository.is_correction" class="mb-4 mt-6">
          <div class="bg-gray-500 text-white rounded-t-lg p-3">
            <h5 class="text-lg font-semibold">Thông tin khách hàng</h5>
          </div>
        </div>

        <div v-if="!repository.is_correction" class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span>Khách hàng</span>
            </label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <multiselect
              v-model="customerSelect"
              :options="customerOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn khách hàng--"
              label="name"
              track-by="name"
              @input="changeSupplier"
            />
          </div>
        </div>

        <div v-if="!repository.is_correction" class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span>Tên khách hàng</span>
            </label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="customer_name"
              type="text"
              maxlength="255"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="repository.customer_name"
            >
          </div>
        </div>

        <div v-if="!repository.is_correction" class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span>Địa chỉ</span>
            </label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="customer_address"
              type="text"
              maxlength="255"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="repository.customer_address"
            >
          </div>
        </div>

        <div class="mb-4 mt-6">
          <div class="bg-blue-500 text-white rounded-t-lg p-3">
            <h5 class="text-lg font-semibold">Thông tin sản phẩm</h5>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Sản phẩm<span class="text-red-600"></span>
            </label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <multiselect
              v-model="productSelect"
              :options="productOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Chọn sản phẩm--"
              label="name"
              track-by="name"
              @input="changeProduct"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Đơn giá bán<span class="text-red-600"></span>
            </label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="price"
              type="text"
              maxlength="14"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="currentProduct.price"
              @change="changePriceInput"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Số lượng<span class="text-red-600"></span>
            </label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="quantity"
              type="text"
              maxlength="14"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="currentProduct.quantity"
              @keyup="integerPointAndCommaOnly($event.target)"
              @change="changeQuantityInput"
            >
          </div>
        </div>

        <div class="text-center mb-4">
          <button
            @click="confirmBuyProduct"
            class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors w-32"
          >
            Thêm
          </button>
        </div>

        <div v-show="repository.products.length > 0" class="mb-4">
          <h5 class="text-lg font-semibold">Danh sách sản phẩm xuất</h5>
        </div>

        <div v-show="repository.products.length > 0" class="overflow-x-auto mb-4">
          <table class="min-w-full border border-gray-300">
            <colgroup>
              <col style="width:5%">
              <col style="width:17%">
              <col style="width:18%">
              <col style="width:10%">
              <col style="width:15%">
              <col style="width:15%">
              <col style="width:15%">
              <col style="width:5%">
            </colgroup>
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border-b">STT</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border-b">Mã SP</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border-b">Tên SP</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border-b">Đơn vị</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border-b">Số lượng</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border-b">Giá bán</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase border-b">Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in repository.products" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm text-gray-900 border">{{index + 1}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.product_code}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.product_name}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">{{item.unit_name}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 text-right border">
                  <input
                    :id="'quantity_' + index"
                    type="text"
                    maxlength="14"
                    autocomplete="new-password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    :value="item.quantity"
                    @keyup="integerPointAndCommaOnly($event.target)"
                    @change="changeQuantity(index)"
                  >
                </td>
                <td class="px-4 py-2 text-sm text-gray-900 text-right border">
                  <input
                    :id="'price_' + index"
                    type="text"
                    maxlength="14"
                    autocomplete="new-password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    :value="item.price"
                    @change="changePrice(index)"
                  >
                </td>
                <td class="px-4 py-2 text-sm text-gray-900 text-right border">{{currencyFormat(item.amount)}}</td>
                <td class="px-4 py-2 text-sm text-gray-900 border">
                  <i class="fa fa-trash text-red-600 cursor-pointer hover:text-red-900" @click="deleteProduct(index)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mb-4">
          <label class="text-sm font-medium text-gray-700">
            Tổng tiền sản phẩm: {{currencyFormat(repository.sub_total)}}
          </label>
        </div>

        <div class="text-center mt-8">
          <button
            v-show="!saving"
            @click="save"
            :disabled="saving"
            class="px-6 py-3 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
            style="height: 50px; width: 240px"
          >
            <i class="fa fa-pencil-square-o mr-2" />
            Xác nhận xuất kho
          </button>
          <span v-show="saving"><icon name="loading" width="60" /></span>
        </div>
      </div>
    </div>

    <!-- Modal tìm kiếm đơn hàng nhập -->
    <div v-if="showModalSearchOrderBuy" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="hideModalSearchOrderBuy"></div>
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-6xl w-full p-6">
          <h4 class="text-2xl font-semibold text-center text-orange-600 mb-4">Tìm kiếm đơn hàng nhập</h4>
          <hr class="mb-4">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mã đơn hàng nhập</label>
              <input
                id="order_sell_number"
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="orderSellSearch.order_sell_number"
                maxlength="15"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
              <input
                id="customer_name_search"
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="orderSellSearch.customer_name"
                maxlength="255"
              >
            </div>
          </div>

          <div class="flex justify-between mb-4">
            <button
              @click.prevent="hideModalSearchOrderBuy"
              class="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors w-32"
            >
              Quay lại
            </button>
            <button
              @click.prevent="searchOrderBuy"
              :disabled="onSearchOrderBuy"
              class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors w-32 disabled:opacity-50"
            >
              Tìm Kiếm
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b">STT</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b">Ngày lập</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b">Số ĐH</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b">Tên khách hàng</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase border-b">Thành tiền</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase border-b"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in orderSellSearchItems" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{item.stt}}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{item.created_at}}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{item.order_sell_number}}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{item.customer_name}}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 text-right border">{{item.total}}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 border text-center">
                    <button
                      @click.prevent="chooseOrderBuy(item.id, item.customer_id)"
                      class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors"
                    >
                      Chọn
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="text-center mt-4 text-gray-500">---Hết---</p>
        </div>
      </div>
    </div>

    <!-- Modal giữ hàng -->
    <div v-if="showModalCreateBallot" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="hideModalCreateBallot"></div>
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-6xl w-full p-6">
          <h4 class="text-2xl font-semibold text-center text-orange-600 mb-4">
            Tạo phiếu xuất kho thành công!
          </h4>
          <hr class="mb-4">

          <div class="overflow-x-auto mb-4">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b">STT</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b">Ngày</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b">Sản phẩm</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b">Số lượng</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in outputItems" :key="item.stt" class="hover:bg-gray-50">
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{item.stt}}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{item.order_sell_number}}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{item.product_name}}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{item.quantity}}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between">
            <button
              @click.prevent="hideModalCreateBallot"
              class="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors w-32"
            >
              Quay lại
            </button>
            <button
              v-show="!saving"
              @click.prevent="confirmOutput"
              :disabled="saving"
              class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors w-32 disabled:opacity-50"
            >
              Xác nhận
            </button>
            <span v-show="saving"><icon name="loading" width="60" /></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import repositoryApi from '@/api/repository'
import orderSellApi from '@/api/orderSell'
import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { popToast } = useToast()

// Data
const title = ref("Thêm Mới Phiếu Xuất Kho")
const repository = reactive({
  is_correction: false,
  order_buy_id: null,
  customer_id: null,
  customer_name: null,
  customer_address: null,
  products: [],
  sub_total: 0
})
const currentProduct = reactive({
  product_id: null,
  product_code: null,
  product_name: null,
  product_brand: null,
  unit_name: null,
  quantity: 0,
  price: 0,
})
const loadingOptions = ref(false)
const orderSellSelect = ref({})
const orderSell = ref({})
const orderSellOptions = ref([])
const customerSelect = ref({})
const customerOptions = ref([])
const productSelect = ref({})
const productOptions = ref([])
const saving = ref(false)
const orderSellSearchItems = ref([])
const onSearchOrderBuy = ref(false)
const orderSellSearch = reactive({
  order_sell_number: null,
  customer_name: null
})
const outputItems = ref([])
const showModalSearchOrderBuy = ref(false)
const showModalCreateBallot = ref(false)

// Methods
const back = () => {
  if(repository.is_correction) {
    router.push("/repo-correction-history")
  } else {
    router.push("/repo-history")
  }
}

const getOptionRelatedRepository = () => {
  loadingOptions.value = true

  let params = {
    order_buys: true,
    customers: true,
    products: true
  }

  repositoryApi.getOptionsRelatedRepository(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let options = res.data.data

      customerOptions.value = options.customers
      productOptions.value = options.products
      orderSellOptions.value = options.order_buys

      if(!repository.is_correction) {
        checkCreatedFromOrderBuy()
      }
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const checkCreatedFromOrderBuy = () => {
  let url = location.href
  if(url.includes("repository-from-order-sell")) {
    let orderSellId = route.params.id
    chooseOrderBuy(orderSellId, null)
  }
}

const chooseOrderBuy = (orderSellId, customerId) => {
  if(orderSellId) {
    for(let item of orderSellOptions.value) {
      if(item.id == orderSellId) {
        orderSellSelect.value = item
        changeOrderBuy()
        break
      }
    }
  }
  if(customerId) {
    getSupplierById(customerId)
  }
  hideModalSearchOrderBuy()
}

const getSupplierById = (customerId) => {
  for(let customer of customerOptions.value) {
    if(customer.id == customerId) {
      customerSelect.value = customer
      break
    }
  }
  return {}
}

const hideModalSearchOrderBuy = () => {
  showModalSearchOrderBuy.value = false
}

const getSupplierItemById = () => {
  if(repository.customer_id && customerOptions.value.length > 0) {
    for(let i in customerOptions.value) {
      if(customerOptions.value[i].id == repository.customer_id) {
        customerSelect.value = customerOptions.value[i]
        break
      }
    }
    changeSupplier()
  }
}

const refreshRepositoryInfo = () => {
  repository.is_correction = false
  repository.order_buy_id = null
  repository.customer_id = null
  repository.customer_name = null
  repository.customer_address = null
  repository.products = []
  repository.sub_total = 0
}

const changeOrderBuy = () => {
  if(orderSellSelect.value && orderSellSelect.value.id) {
    repositoryApi.getOrderSellDetailForRepoOutput(orderSellSelect.value.id).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        refreshRepositoryInfo()

        let orderSell = res.data.data
        repository.order_buy_id = orderSell.id
        repository.customer_id = orderSell.customer_id
        getSupplierItemById()

        let products = orderSell.products
        for(let i in products) {
          let product = {
            "product_id": products[i].product_id,
            "product_code": products[i].product_code,
            "product_name": products[i].product_name,
            "unit_name": products[i].unit,
            "quantity": currencyFormat(products[i].quantity),
            "price": currencyFormat(products[i].price_sell),
            "amount": products[i].amount
          }
          repository.products.push(product)
        }

        calProductSubTotal()
      }
    }).catch(err => {
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const changeSupplier = () => {
  if(customerSelect.value && customerSelect.value.id) {
    repository.customer_id = customerSelect.value.id
    repository.customer_name = customerSelect.value.name
    repository.customer_address = customerSelect.value.address
  } else{
    repository.customer_id = null
    repository.customer_name = null
    repository.customer_address = null
  }
}

const changeProduct = () => {
  if(productSelect.value && productSelect.value.id) {
    currentProduct.product_id = productSelect.value.id
    currentProduct.product_name = productSelect.value.product_name
    currentProduct.product_code = productSelect.value.product_code
    currentProduct.brand_name = productSelect.value.brand_name
    currentProduct.unit_name = productSelect.value.unit_name
  } else {
    currentProduct.product_id = null
    currentProduct.product_name = null
    currentProduct.product_code = null
    currentProduct.brand_name = null
    currentProduct.unit_name = null
  }
}

const confirmBuyProduct = () => {
  if(!currentProduct.product_id || !currentProduct.quantity || !currentProduct.price) {
    popToast('danger', "Vui lòng nhập đủ các thông tin bắt buộc")
    return
  }
  let quantity = (currentProduct.quantity + "").replaceAll(",", "")
  let price = (currentProduct.price + "").replaceAll(",", "")
  currentProduct.amount = Math.round(parseFloat(quantity) * parseInt(price))
  repository.products.push({...currentProduct})

  calProductSubTotal()

  // Reset
  currentProduct.product_id = null
  currentProduct.product_code = null
  currentProduct.product_name = null
  currentProduct.product_brand = null
  currentProduct.unit_name = null
  currentProduct.quantity = 0
  currentProduct.price = 0
}

const integerPointAndCommaOnly = (item) => {
  let valueInput = item.value
  valueInput = valueInput.replaceAll(",", "")
  let result = commonFunc.integerPointAndCommaOnly(valueInput)
  result = currencyFormat(result)
  item.value = result
}

const calProductSubTotal = () => {
  repository.sub_total = 0
  for (let item of repository.products) {
    repository.sub_total += item.amount
  }
}

const deleteProduct = (index) => {
  repository.products.splice(index, 1)
  calProductSubTotal()
}

const currencyFormat = (num) => {
  let result = ""
  if(num == 0) {
    return "0"
  }
  num = (num + "").replaceAll(",", "")
  if(num) {
    result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const searchOrderBuy = () => {
  if (onSearchOrderBuy.value) { return }

  onSearchOrderBuy.value = true

  let params = {
    "order_sell_number": orderSellSearch.order_sell_number,
    "customer_name": orderSellSearch.customer_name,
    "limit": 100,
    "offset": 0
  }

  fundApi.searchOrderBuy(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      orderSellSearchItems.value = res.data.data
    } else {
      orderSellSearchItems.value = []
    }
    onSearchOrderBuy.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearchOrderBuy.value = false
  })
}

const save = () => {
  if(repository.products.length == 0) {
    popToast('danger', 'Vui lòng chọn sản phẩm muốn xuất kho!')
    return;
  } else {
    for(let item of repository.products) {
      item.price = (item.price + "").replaceAll(",", "")
      item.quantity = (item.quantity + "").replaceAll(",", "")
      item.amount = Math.round(parseInt(item.price) * parseFloat(item.quantity))
    }
  }

  saving.value = true
  repositoryApi.addRepositoryOutput(repository).then(res => {
    saving.value = false
    if(res != null && res.data != null){
      if (res.data.status == 200) {
        if(res.data.data && res.data.data.length > 0) {
          outputItems.value = res.data.data
          showModalCreateBallot.value = true
        } else {
          back()
        }
      }
    }
  }).catch(err => {
    saving.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const changeQuantity = (index) => {
  let quantity = document.getElementById("quantity_" + index).value
  if(quantity) {
    quantity = (quantity + "").replaceAll(",", "")

    let price_sell = document.getElementById("price_" + index).value
    if(price_sell) {
      price_sell = (price_sell + "").replaceAll(",", "")
      let amount = Math.round(parseInt(price_sell) * parseFloat(quantity))
      amount = currencyFormat(amount)
      repository.products[index].amount = amount
    } else {
      repository.products[index].amount = null
    }

    quantity = currencyFormat(quantity)
    document.getElementById("quantity_" + index).value = quantity
    repository.products[index].quantity = quantity
  } else {
    repository.products[index].amount = null
  }
}

const changePrice = (index) => {
  let price_sell = document.getElementById("price_" + index).value
  if(price_sell) {
    price_sell = (price_sell + "").replaceAll(",", "")

    let quantity = document.getElementById("quantity_" + index).value
    if(quantity) {
      quantity = (quantity + "").replaceAll(",", "")
      let amount = Math.round(parseInt(price_sell) * parseFloat(quantity))
      amount = currencyFormat(amount)
      repository.products[index].amount = amount
    } else {
      repository.products[index].amount = null
    }

    price_sell = currencyFormat(price_sell)
    document.getElementById("price_" + index).value = price_sell
    repository.products[index].price = price_sell
  } else {
    repository.products[index].amount = null
  }
}

const changePriceInput = () => {
  let price = parseInt((currentProduct.price + "").replaceAll(",", ""))
  currentProduct.price = currencyFormat(price)
}

const changeQuantityInput = () => {
  let quantity = parseInt((currentProduct.quantity + "").replaceAll(",", ""))
  currentProduct.quantity = currencyFormat(quantity)
}

const hideModalCreateBallot = () => {
  back()
  showModalCreateBallot.value = false
}

const confirmOutput = () => {
  let params = {
    'order_buy_id': repository.order_buy_id,
    'products': outputItems.value
  }
  repositoryApi.confirmOutput(params).then(res => {
    saving.value = false
    if(res != null && res.data != null){
      if (res.data.status == 200) {
        back()
      }
    }
  }).catch(err => {
    saving.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

// Lifecycle
onMounted(() => {
  let url = location.href
  if(url.includes("repo-correction-output")) {
    repository.is_correction = true
    title.value = 'Thêm Mới Hiệu Chỉnh Thiếu Hàng Hoá'
  }

  getOptionRelatedRepository()
})
</script>

<style lang="scss" scoped>
.title-partner {
  border-radius: 5px 5px;
  padding: 5px;
}
</style>
