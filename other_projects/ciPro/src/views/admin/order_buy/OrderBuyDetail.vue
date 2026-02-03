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
        <h4 class="text-2xl text-center font-semibold text-orange-600">Chi tiết ĐH Nhập</h4>
      </div>
      <hr class="my-4"/>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

      <div class="mb-4">
        <label class="block text-gray-700">
          <span>Số ĐH nhập: {{orderBuy.order_buy_number}}</span>
        </label>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">
          <span>Ngày tạo: {{orderBuy.created_at}}</span>
        </label>
      </div>

      <div class="bg-gray-600 text-white rounded-t-md p-3">
        <h5 class="text-lg font-semibold flex justify-between items-center">
          <span>Thông tin nhà cung cấp</span>
          <span class="cursor-pointer" @click="showPartnerInfo = !showPartnerInfo">
            <i :class="showPartnerInfo ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'" />
          </span>
        </h5>
      </div>

      <div v-show="showPartnerInfo" class="border border-gray-300 border-t-0 p-4 rounded-b-md">
        <div class="mb-4">
          <label class="block text-gray-700">
            Tên nhà cung cấp: {{orderBuy.supplier_name}}
          </label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Địa chỉ: {{orderBuy.supplier_address}}</label>
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
        <div class="mb-4" v-show="orderBuy.products.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
              <colgroup>
                <col style="width:4%">
                <col style="width:20%">
                <col style="width:20%">
                <col style="width:9%">
                <col style="width:9%">
                <col style="width:10%">
                <col style="width:15%">
                <col style="width:15%">
                <col style="width:8%">
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
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in orderBuy.products" :key="index">
                  <td class="px-3 py-2 whitespace-nowrap">{{index + 1}}</td>
                  <td class="px-3 py-2">{{item.product_code}}</td>
                  <td class="px-3 py-2">{{item.product_name}}</td>
                  <td class="px-3 py-2">{{item.product_brand}}</td>
                  <td class="px-3 py-2">{{item.unit}}</td>
                  <td class="px-3 py-2 text-right">{{currencyFormat(item.quantity)}}</td>
                  <td class="px-3 py-2 text-right">{{currencyFormat(item.price_buy)}}</td>
                  <td class="px-3 py-2 text-right">{{currencyFormat(item.amount)}}</td>
                  <td class="px-3 py-2">{{item.note}}</td>
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

      <div v-show="showPaymentInfo" class="border border-gray-300 border-t-0 p-4 rounded-b-md mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="mb-4">
              <label class="block text-gray-700">Tổng thành tiền: {{orderBuy.sub_total}}</label>
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label class="block text-gray-700">Vat({{orderBuy.vat_percent}}): {{orderBuy.vat_value}}</label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="mb-4">
              <label class="block text-gray-700">Tổng tiền thanh toán: {{orderBuy.total}}</label>
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label class="block text-gray-700">Phương thức thanh toán: {{orderBuy.payment_method}}</label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="mb-4">
              <label class="block text-gray-700">Hình thức giao hàng: {{orderBuy.shipping_method}}</label>
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label class="block text-gray-700">Ngày dự kiến GH: {{orderBuy.shipping_date}}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Ghi chú: {{orderBuy.note}}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import orderBuyApi from '@/api/orderBuy'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const { popToast } = useToast()
const route = useRoute()
const router = useRouter()

const showPartnerInfo = ref(true)
const showProductInfo = ref(true)
const showPaymentInfo = ref(true)

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
  shipping_date: null,
  note: null
})

const loading = ref(false)

onMounted(() => {
  getOrderBuyDetail()
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
  if(num == 0) {
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
</script>

<style lang="scss" scoped>
.title-partner {
  border-radius: 5px 5px;
  padding: 5px;
}
</style>
