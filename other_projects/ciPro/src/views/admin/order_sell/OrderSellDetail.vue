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
        <h4 class="text-2xl text-center font-semibold text-orange-600">Chi Tiết Đơn Hàng Bán</h4>
      </div>
      <hr class="my-4"/>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700">
            <span>Số ĐH bán: {{trade.order_sell_number}}</span>
          </label>
        </div>
        <div>
          <label class="block text-gray-700">
            <span>Xuất hóa đơn: {{trade.issue_invoice ? 'Có' : 'Không'}}</span>
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700">
            <span>Từ báo giá: {{trade.quotation_number}}</span>
          </label>
        </div>
        <div>
          <label class="block text-gray-700">
            <span>Ngày lập: {{trade.created_at}}</span>
          </label>
        </div>
      </div>

      <div class="bg-gray-600 text-white rounded-t-md p-3">
        <h5 class="text-lg font-semibold">
          <span>Thông tin người mua</span>
        </h5>
      </div>

      <div class="border border-gray-300 border-t-0 p-4 rounded-b-md">
        <div class="mb-4">
          <label class="block text-gray-700">
            <span>Tên khách hàng: {{trade.customer_name}}</span>
          </label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">
            <span>Mã số thuế: {{trade.customer_tax_code}}</span>
          </label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">
            <span>Địa chỉ khách hàng: {{trade.customer_address}}</span>
          </label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">
            <span>Email nhận hoá đơn: {{trade.customer_email}}</span>
          </label>
        </div>
      </div>

      <div class="bg-blue-500 text-white rounded-t-md p-3 mt-4">
        <h5 class="text-lg font-semibold">
          <span>Danh sách sản phẩm</span>
        </h5>
      </div>

      <div class="border border-gray-300 border-t-0 p-4 rounded-b-md">
        <div class="text-right mb-2">
          <download-excel
            class="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded cursor-pointer inline-block"
            :data="products_excel"
            :fields="excel_fields"
            worksheet="Danh sách sản phẩm báo giá"
            name="danh_sach_san_pham_bao_gia.xls">
            <b>Xuất Excel</b>
          </download-excel>
        </div>

        <div class="overflow-x-auto" v-show="trade.products.length > 0">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
            <colgroup>
              <col style="width:3%">
              <col style="width:13%">
              <col style="width:14%">
              <col style="width:5%">
              <col style="width:8%">
              <col style="width:5%">
              <col style="width:8%">
              <col style="width:5%">
              <col style="width:5%">
              <col style="width:8%">
              <col style="width:5%">
              <col style="width:9%">
              <col style="width:8%">
              <col style="width:4%">
            </colgroup>
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">STT</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Mã sản phẩm</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Tên sản phẩm</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Hãng SP</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Giá List</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">CK từ NCC</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Giá gốc</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">% lợi nhuận mong muốn</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Lợi nhuận/sản phẩm</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Giá bán</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Số lượng</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Thành tiền</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Lợi nhuận tổng</th>
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Ghi chú</th>
              </tr>
            </thead>
            <tbody v-if="trade.type == 0 && trade.products.length > 0" class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in trade.products" :key="index">
                <td class="px-3 py-2">{{index + 1}}</td>
                <td class="px-3 py-2">{{item.product_code ? item.product_code : item.product_code_input}}</td>
                <td class="px-3 py-2">{{item.product_name ? item.product_name : item.product_name_input}}</td>
                <td class="px-3 py-2">{{item.brand_name ? item.brand_name : item.brand_name_input}}</td>
                <td class="px-3 py-2 text-right">{{currencyFormat(item.price_list)}}</td>
                <td class="px-3 py-2 text-right">{{item.discount}}%</td>
                <td class="px-3 py-2 text-right">{{currencyFormat(item.price)}}</td>
                <td class="px-3 py-2 text-right">{{item.discount_sale}}%</td>
                <td class="px-3 py-2 text-right">{{currencyFormat(item.profit_on_item)}}</td>
                <td class="px-3 py-2 text-right">{{currencyFormat(item.price_sell)}}</td>
                <td class="px-3 py-2 text-right">{{currencyFormat(item.quantity)}}</td>
                <td class="px-3 py-2 text-right">{{currencyFormat(item.amount_sell)}}</td>
                <td class="px-3 py-2 text-right">{{currencyFormat(item.profit)}}</td>
                <td class="px-3 py-2">{{item.note}}</td>
              </tr>
            </tbody>
            <tbody v-if="trade.type == 1 && projectProducts.length > 0" class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, itemIndex) in projectProducts" :key="itemIndex" :class="item.product_type == 0 ? 'bg-blue-100' : ''">
                <td class="px-3 py-2">
                  {{item.project_index}}
                </td>
                <td class="px-3 py-2">
                  <span v-show="item.product_type == 1">{{item.product_code ? item.product_code : item.product_code_input}}</span>
                </td>
                <td class="px-3 py-2">
                  <span v-show="item.product_type == 1">
                    {{item.product_name ? item.product_name : item.product_name_input}}
                  </span>
                  <span v-show="item.product_type == 0">
                    <b>{{item.product_name}}</b>
                  </span>
                </td>
                <td class="px-3 py-2">
                  <span v-show="item.product_type == 1">
                    {{item.brand_name ? item.brand_name : item.brand_name_input}}
                  </span>
                  <span v-show="item.product_type == 0">
                    {{item.project_brand_name}}
                  </span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-show="item.product_type == 1">{{currencyFormat(item.price_list)}}</span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-show="item.product_type == 1">{{item.discount}}%</span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-show="item.product_type == 1">{{currencyFormat(item.price)}}</span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-show="item.product_type == 1">{{item.discount_sale}}%</span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-show="item.product_type == 1">{{currencyFormat(item.profit_on_item)}}</span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-show="item.product_type == 0">{{currencyFormat(item.project_price)}}</span>
                  <span v-show="item.product_type == 1">{{currencyFormat(item.price_sell)}}</span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-show="item.product_type == 0">
                    <b>{{currencyFormat(item.project_quantity)}}</b>
                  </span>
                  <span v-show="item.product_type == 1">{{currencyFormat(item.quantity)}}</span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-show="item.product_type == 0">
                    <b>{{currencyFormat(item.project_amount)}}</b>
                  </span>
                  <span v-show="item.product_type == 1">
                    <b>{{currencyFormat(item.amount_sell)}}</b>
                  </span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-show="item.product_type == 1">{{currencyFormat(item.profit)}}</span>
                </td>
                <td class="px-3 py-2">
                  <span v-show="item.product_type == 1">{{item.note}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-green-500 text-white rounded-t-md p-3 mt-4">
        <h5 class="text-lg font-semibold">
          <span>Thông tin thanh toán</span>
        </h5>
      </div>

      <div class="border border-gray-300 border-t-0 p-4 rounded-b-md">
        <div class="mb-4">
          <label class="block text-gray-700">Tổng tiền sản phẩm: {{currencyFormat(trade.sub_total)}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Chi phí thêm: {{currencyFormat(trade.extra_fee)}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Số tiền giảm: {{currencyFormat(trade.fixed_discount)}}  </label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Thuế VAT({{trade.vat_percent}}%): {{currencyFormat(trade.vat_value)}} </label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Thành tiền: {{currencyFormat(trade.total)}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Lợi nhuận: {{currencyFormat(trade.profit)}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Tài khoản nhận thanh toán: {{trade.bank_account_str}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Hình thức thanh toán: {{trade.payment_method}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Thỏa thuận vận chuyển: {{trade.shipping_agreement}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Phí giao hàng: {{currencyFormat(trade.shipping_fee)}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Nhân viên phụ trách: {{trade.staff_in_charge_name}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Ghi chú: {{trade.description}}</label>
        </div>
      </div>

      <div class="bg-yellow-500 text-white rounded-t-md p-3 mt-4">
        <h5 class="text-lg font-semibold">
          <span>Thông tin giao hàng</span>
        </h5>
      </div>

      <div class="border border-gray-300 border-t-0 p-4 rounded-b-md">
        <div class="mb-4">
          <label class="block text-gray-700">Tên người nhận hàng: {{trade.receiver_name}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">SĐT nhận hàng: {{trade.receiver_phone}}</label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Địa chỉ nhận hàng: {{trade.receiver_address}}  </label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Ngày giao hàng dự kiến: {{trade.shipping_date ? trade.shipping_date.substring(0, 10) : ''}} </label>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Ghi chú khi giao hàng: {{trade.shipping_note}}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import orderSellApi from '@/api/orderSell'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const { popToast } = useToast()
const route = useRoute()
const router = useRouter()

const trade = ref({
  "id": null,
  "quotation_number": null,
  "status": -1,
  "type": 0,
  "customer_id": null,
  "customer_name": null,
  "customer_phone": null,
  "customer_address": null,
  "customer_tax_code": null,
  "customer_company_type_id": null,
  "contact_person_name": null,
  "contact_person_phone": null,
  "sub_total": 0,
  "extra_fee": null,
  "fixed_discount": null,
  "have_vat": false,
  "vat_percent": 10,
  "vat_value": 0,
  "total": 0,
  "profit": 0,
  "bank_account_id": null,
  "bank_account_str": null,
  "account_name": null,
  "account_number": null,
  "bank_name": null,
  "payment_method": null,
  "payment_method_input": null,
  "shipping_agreement": null,
  "shipping_fee": 0,
  "staff_in_charge": null,
  "staff_in_charge_name": null,
  "staff_in_charge_phone": null,
  "staff_in_charge_email": null,
  "staff_in_charge_position": null,
  "description": null,
  "products": [],
  "promotions": []
})

const currentProduct = ref({
  "index": -1,
  "product_group_id": null,
  "product_group_name": null,
  "product_type_id": null,
  "product_type_name": null,
  "product_id": null,
  "product_code": null,
  "product_code_input": null,
  "product_name": null,
  "product_name_input": null,
  "unit_id": null,
  "unit_name": null,
  "unit_id_input": null,
  "unit_name_input": null,
  "brand_id": null,
  "brand_name": null,
  "brand_id_input": null,
  "brand_name_input": null,
  "price_list": null,
  "discount": null,
  "price": null,
  "discount_sale": null,
  "profit_on_item": null,
  "amount": null,
  "price_sell": null,
  "amount_sell": null,
  "profit": null,
  "quantity_repo": null,
  "quantity": null,
  "is_available_in_repo": true,
  "properties": [],
  "note": null
})

const products_excel = ref([])
const excel_fields = {
  'STT': 'index',
  'Mã sản phẩm': 'product_code',
  'Tên Sản phẩm' : 'product_name',
  'HÃNG SX' : 'brand_name',
  'ĐVT' : 'unit_name',
  'SL' : 'quantity',
  'ĐƠN GIÁ' : 'price',
  'THÀNH TIỀN (VNĐ)' : 'amount',
  'GHI CHÚ' : 'note'
}

const loading = ref(false)
const userRole = ref("admin")
const projectProducts = ref([])

onMounted(() => {
  // UI by staff
  const url = location.href
  if(url.includes("order-sell-staff")) {
    userRole.value = "staff"
  }

  getOrderSellDetail()
})

const handleProductExcel = () => {
  products_excel.value = []
  if(trade.value.products.length > 0) {
    const productsExcel = JSON.parse(JSON.stringify(trade.value.products))

    for(let i in productsExcel) {
      const item = {
        'index': productsExcel[i].index,
        'product_code': productsExcel[i].product_code ? productsExcel[i].product_code : productsExcel[i].product_code_input,
        'product_name' : productsExcel[i].product_name ? productsExcel[i].product_name : productsExcel[i].product_name_input,
        'brand_name' : productsExcel[i].brand_name ? productsExcel[i].brand_name : productsExcel[i].brand_name_input,
        'unit_name' : productsExcel[i].unit_name ? productsExcel[i].unit_name : productsExcel[i].unit_name_input,
        'quantity' : productsExcel[i].quantity,
        'price' : productsExcel[i].price,
        'amount' : productsExcel[i].amount,
        'note' : productsExcel[i].note
      }
      products_excel.value.push(item)
    }
  }
}

const getParentIndexByName = (list_projects_products, project_name) => {
  let pro_ind = 0
  for(let item of list_projects_products) {
    if(item.product_name == project_name) {
      return pro_ind
    }
    pro_ind += 1
  }
  return 0
}

const handleListProduct = () => {
  if(trade.value.products.length > 0) {
    // Tạo danh sách dự án
    const list_projects = []
    const list_name_project_checked = []
    for(let p of trade.value.products) {
      if(!list_name_project_checked.includes(p.project_name)) {
        list_name_project_checked.push(p.project_name)
        const project = JSON.parse(JSON.stringify(currentProduct.value))
        project.product_name = p.project_name
        project.project_brand_name = p.project_brand_name
        project.project_quantity = parseFloat(p.project_quantity)
        project.project_amount = 0
        list_projects.push(project)
      }
    }

    // Gom sản phẩm theo dự án
    const list_projects_products = []
    let project_index = 1
    for(let project of list_projects) {
      project.project_index = project_index
      project.product_type = 0 // Dự án
      list_projects_products.push(project)

      let product_index = 1
      for(let product of trade.value.products) {
        const project_item = JSON.parse(JSON.stringify(product))
        if(product.project_name == project.product_name) {
          project_item.project_index = project.project_index + "." + product_index
          project_item.product_type = 1 // Sản phẩm
          list_projects_products.push(project_item)

          const parent_index = getParentIndexByName(list_projects_products, product.project_name)
          const amount_sell = (product.amount_sell + '').replaceAll(",", "")
          list_projects_products[parent_index].project_amount += parseInt(amount_sell)
          product_index += 1
        }
      }

      project_index += 1
    }

    // Tính đơn giá dự án
    for(let project of list_projects_products) {
      if(project.product_type == 0) {
        project.project_price = Math.round(project.project_amount / project.project_quantity)
      }
    }

    projectProducts.value = list_projects_products
  }
}

/**
 *  Get detail
 */
const getOrderSellDetail = () => {
  const orderSellId = route.params.id
  if(orderSellId){
    loading.value = true

    orderSellApi.getOrderSellDetail(orderSellId, userRole.value).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        trade.value = res.data.data

        // Kiểm tra là loại báo giá nào, nếu là báo giá dự án thì handle lại ds sp:
        if(trade.value.type == 1) {
          handleListProduct()
        }

        handleProductExcel()
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

const convertNumberToText = (number) => {
  const input = (number + '').replaceAll("," ,"")
  return commonFunc.convert_number_to_text(input)
}

/**
 * Back to list
 */
const back = () => {
  // Go to list
  if(userRole.value == "admin") {
    router.push("/order-sell-all")
  } else {
    router.push("/order-sell-staff")
  }
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
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const convertCustomerStatusIdToName = (id) => {
  if(id == 1) {
    return "Khách mới"
  }
  if(id == 2) {
    return "Khách cũ"
  }
  return ""
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

.project_name {
  color: #0C5395 !important;
  font-weight: bold;
}

.project_bg {
  background-color: #6A9AB0 !important;
}
</style>
