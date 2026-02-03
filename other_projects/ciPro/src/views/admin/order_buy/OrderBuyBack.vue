<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h4 class="text-2xl text-center font-semibold text-orange-600">Phiếu Trả Hàng Nhập</h4>
      </div>
      <hr class="my-4"/>

      <div class="mb-4">
        <label class="block text-gray-700">Tên nhà cung cấp: {{order_buy_back.supplier_name}}</label>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Số đơn hàng nhập: {{order_buy_back.order_buy_number}}</label>
      </div>

      <div class="mb-4" v-show="order_buy_back.products.length > 0">
        <label class="block text-gray-700 font-semibold">Danh sách sản phẩm cần xuất kho lại</label>
      </div>

      <div class="mb-4" v-show="order_buy_back.products.length > 0">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
            <colgroup>
              <col style="width:5%">
              <col style="width:12%">
              <col style="width:18%">
              <col style="width:13%">
              <col style="width:13%">
              <col style="width:13%">
              <col style="width:13%">
              <col style="width:13%">
            </colgroup>
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">STT</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Mã SP</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Tên SP</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Đơn vị</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Số lượng trả lại</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Đơn giá nhập</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Thành tiền</th>
                <th class="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in order_buy_back.products" :key="index">
                <td class="px-3 py-2 whitespace-nowrap">{{index + 1}}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{item.product_code}}</td>
                <td class="px-3 py-2">{{item.product_name}}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{item.unit_name}}</td>
                <td class="px-3 py-2">
                  <input
                    :id="'quantity_' + index"
                    type="text"
                    maxlength="11"
                    autocomplete="new-password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :value="item.quantity"
                    @keyup="integerPointAndCommaOnly($event.target)"
                    @change="changeQuantity(index)">
                </td>
                <td class="px-3 py-2 text-right">{{currencyFormat(item.price_buy)}}</td>
                <td class="px-3 py-2 text-right">{{currencyFormat(item.amount_buy)}}</td>
                <td class="px-3 py-2">
                  <i class="fa fa-trash ml-2 cursor-pointer text-red-600 hover:text-red-800" @click="deleteProduct(index)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Tổng tiền hàng: {{currencyFormat(order_buy_back.sub_total)}}</label>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">VAT: {{currencyFormat(order_buy_back.vat_value)}}</label>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Tổng : {{currencyFormat(order_buy_back.total)}}</label>
      </div>

      <div class="mt-4 text-center" v-if="product_back_flag == false">
        <button
          v-show="!saving"
          @click="save"
          :disabled="saving"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          style="height: 50px; width: 240px">
          <i class="fa fa-pencil-square-o mr-2" />
          Xác Nhận
        </button>
        <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import orderBuyApi from '@/api/orderBuy'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const { popToast } = useToast()
const route = useRoute()

const order_buy_back = ref({
  order_buy_id: null,
  order_buy_number: null,
  supplier_id: null,
  supplier_name: null,
  products: [],
  sub_total: 0,
  have_vat: true,
  vat_percent: 10,
  vat_value: 0,
  total: 0
})

const loading = ref(false)
const saving = ref(false)
const product_back_flag = ref(false)

onMounted(() => {
  getOrderBuyDetail()
})

/**
 *  Get detail
 */
const getOrderBuyDetail = () => {
  const orderBuyId = route.params.id
  if(orderBuyId){
    loading.value = true

    orderBuyApi.getOrderBuyDetail(orderBuyId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        const order_sell = res.data.data
        order_buy_back.value.order_buy_id = order_sell.id
        order_buy_back.value.order_buy_number = order_sell.order_buy_number
        order_buy_back.value.supplier_id = order_sell.supplier_id
        order_buy_back.value.supplier_name = order_sell.supplier_name
        order_buy_back.value.sub_total = order_sell.sub_total
        order_buy_back.value.have_vat = order_sell.have_vat
        order_buy_back.value.vat_percent = order_sell.vat_percent
        order_buy_back.value.vat_value = order_sell.vat_value
        order_buy_back.value.total = order_sell.total
        order_buy_back.value.products = order_sell.products

        calculateTotal()
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

const changeQuantity = (index) => {
  let quantity = document.getElementById("quantity_" + index).value
  if(quantity) {
    quantity = (quantity + "").replaceAll(",", "")
    order_buy_back.value.products[index].quantity = parseFloat(quantity)
    calculateTotal()
  }
}

const deleteProduct = (index) => {
  order_buy_back.value.products.splice(index, 1)
  calculateTotal()
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
 * Currency format
 */
const currencyFormat = (num) => {
  let result = ""
  if(num === 0) {
    return "0"
  }
  if(num) {
    num = (num + "").replaceAll(",", "")
  }

  if(num) {
    result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const calculateTotal = () => {
  order_buy_back.value.sub_total = 0

  for(let product of order_buy_back.value.products) {
    product.amount_buy = Math.round(parseFloat(product.quantity) * product.price_buy)
    order_buy_back.value.sub_total += product.amount_buy
  }
  if(order_buy_back.value.have_vat && order_buy_back.value.vat_percent) {
    order_buy_back.value.vat_value = order_buy_back.value.sub_total * order_buy_back.value.vat_percent / 100
  } else {
    order_buy_back.value.vat_value = 0
  }
  order_buy_back.value.total = order_buy_back.value.sub_total + order_buy_back.value.vat_value
}

const save = () => {
  if(order_buy_back.value.products.length == 0) {
    popToast('danger', "Không có sản phẩm nào để trả hàng")
    return
  }
  saving.value = true

  orderBuyApi.confirmOrderBuyBack(order_buy_back.value).then(res => {
    if(res != null && res.data != null) {
      if (res.data.status == 200) {
        popToast('success', "Trả hàng thành công!")
        product_back_flag.value = true
        // window.open('/income-from-product-back/' + order_buy_back.value.order_buy_id, '_blank')
      }
    }

    saving.value = false

  }).catch(err => {
    saving.value = false

    // Handle error
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}
</script>
