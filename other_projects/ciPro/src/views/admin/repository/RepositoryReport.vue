<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- Action Buttons -->
      <div class="flex justify-end mb-4 space-x-2">
        <button
          @click="openModalImportFile"
          class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px]"
        >
          Upload
        </button>
        <button
          @click="isShowModalPrintTem = true"
          class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors min-w-[120px]"
        >
          In tem nhãn
        </button>
      </div>

      <!-- Title -->
      <h3 class="text-2xl font-semibold text-center text-blue-600 mb-6">Sản Phẩm Trong Kho</h3>

      <!-- Filter Section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nhóm SP</label>
          <multiselect
            v-model="productGroupSelect"
            :options="productGroupOptions"
            :loading="loadingOption"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn nhóm sản phẩm--"
            label="name"
            track-by="name"
            @input="changeProductGroup"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Loại SP</label>
          <multiselect
            v-model="productTypeSelect"
            :options="productTypeOptions"
            :loading="loadingOption"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn loại sản phẩm--"
            label="name"
            track-by="name"
            @input="changeProductType"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hãng SP</label>
          <multiselect
            v-model="productBrandSelect"
            :options="productBrandOptions"
            :loading="loadingOption"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn hãng SP--"
            label="text"
            track-by="text"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
          <multiselect
            v-model="productSelect"
            :options="productOptions"
            :loading="loadingProductOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Chọn sản phẩm--"
            label="name_full"
            track-by="name_full"
          />
        </div>
      </div>

      <!-- Total Amount and Search Button -->
      <div class="flex justify-between items-center mt-4 mb-4">
        <h5 class="text-lg">
          TỔNG GIÁ TRỊ TỒN KHO: <span class="text-blue-600 font-semibold">{{currencyFormat(total_amount)}}đ</span>
        </h5>
        <button
          @click="prepareToSearch"
          :disabled="onSearch"
          class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px] disabled:opacity-50"
        >
          Tìm Kiếm
        </button>
      </div>

      <!-- Result Count and Export -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-sm">
          Số kết quả: <span class="text-blue-600 font-semibold">{{totalRow}}</span>
        </div>
        <download-excel
          class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px] cursor-pointer"
          :data="excel_items"
          :fields="excel_fields"
          worksheet="Sản phẩm trong kho"
          name="Sản phẩm trong kho"
        >
          <b>Xuất Excel</b>
        </download-excel>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <colgroup>
            <col style="width:3%">
            <col style="width:8%">
            <col style="width:8%">
            <col style="width:8%">
            <col style="width:16%">
            <col style="width:20%">
            <col style="width:8%">
            <col style="width:9%">
            <col style="width:9%">
            <col style="width:9%">
          </colgroup>
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">STT</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Nhóm SP</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Loại SP</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Hãng SP</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Mã SP</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Tên SP</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Số lượng</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Đơn giá nhập</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Thành tiền</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">SL đang tạm giữ chờ xuất kho</th>
            </tr>
            <tr class="bg-blue-50">
              <td colspan="6" class="px-4 py-2 text-center text-blue-600 font-bold border">Tổng</td>
              <td class="px-4 py-2 text-right text-blue-600 font-bold border">{{ currencyFormat(total_quantity) }}</td>
              <td class="px-4 py-2 text-right text-blue-600 font-bold border">{{ currencyFormat(total_price_buy) }}</td>
              <td class="px-4 py-2 text-right text-blue-600 font-bold border">{{ currencyFormat(total_amount_buy) }}</td>
              <td class="px-4 py-2 text-right text-blue-600 font-bold border">{{ currencyFormat(total_quantity_keep) }}</td>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="item.stt" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm border">{{item.stt}}</td>
              <td class="px-4 py-2 text-sm border">{{item.product_group_name}}</td>
              <td class="px-4 py-2 text-sm border">{{item.product_type_name}}</td>
              <td class="px-4 py-2 text-sm border">{{item.brand_name}}</td>
              <td class="px-4 py-2 text-sm border">{{item.product_code}}</td>
              <td class="px-4 py-2 text-sm border">{{item.product_name}}</td>
              <td class="px-4 py-2 text-sm text-right border">{{currencyFormat(item.quantity)}}</td>
              <td class="px-4 py-2 text-sm text-right border">{{currencyFormat(item.price_buy)}}</td>
              <td class="px-4 py-2 text-sm text-right border">{{currencyFormat(item.amount_buy)}}</td>
              <td class="px-4 py-2 text-sm text-right border">
                {{currencyFormat(item.quantity_keep)}}
                <span v-show="item.quantity_keep" class="ml-2 cursor-pointer text-blue-600">
                  <i class="fa fa-info-circle" title="Danh sách đang giữ" @click="showModalDetailKeepProduct(item)"/>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading Indicator -->
      <div v-show="loading" class="text-center py-4">
        <icon name="loading" width="60" />
      </div>
      <div v-if="hasNext === false" class="text-center py-4 text-gray-500">--Hết--</div>
      <div v-if="hasNext === true && totalRow != 0" class="text-center py-4">
        <i class="fa fa-angle-double-down text-2xl text-blue-600 cursor-pointer"></i>
      </div>
    </div>

    <!-- Modal Import Repository -->
    <div v-if="showModalImport" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showModalImport = false; uploadErrorList = []">
      <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-xl font-semibold text-center mb-4">Upload sản phẩm từ file excel</h4>
          <p class="text-sm mb-4">
            Tải xuống file mẫu:
            <a target="_blank" href="https://api.cipro.vn/files/upload_excel_template/ciPro_upload_repository_product_template.xlsx" class="text-blue-600 hover:underline">Tải xuống</a>
          </p>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Chọn file excel bạn muốn upload</label>
            <input type="file" id="file" ref="file" @change="handleFileUpload()" accept=".xlsx" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>

          <div v-show="uploading" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>

          <div class="flex justify-end space-x-2 mt-4">
            <button
              v-show="!uploading"
              @click="importProductFromExcelFile()"
              :disabled="!fileUpload || uploading"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Upload
            </button>
          </div>

          <div v-show="uploadErrorList.length > 0" class="mt-4 overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Dòng</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Mô tả lỗi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(error, index) in uploadErrorList" :key="index">
                  <td class="px-4 py-2 text-sm border">{{error.row}}</td>
                  <td class="px-4 py-2 text-sm border">{{error.mess}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal List Keep Product -->
    <div v-if="showModalKeepProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalDetailKeepProduct">
      <div class="bg-white rounded-lg shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Danh Sách Giữ Hàng</h4>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>Mã SP: {{currentProduct.product_code}}</div>
            <div>Tên SP: {{currentProduct.product_name}}</div>
            <div>Hãng SP: {{currentProduct.brand_name}}</div>
            <div>Số lượng giữ bởi ĐH khác: {{currencyFormat(currentProduct.quantity_keep)}}</div>
          </div>
          <hr class="mb-4">

          <div v-show="loadingKeepProduct" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">STT</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Mã ĐH</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border">Số lượng giữ</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in keepProductItems" :key="item.id">
                  <td class="px-4 py-2 text-sm border">{{item.stt}}</td>
                  <td class="px-4 py-2 text-sm border">{{item.order_sell_number}}</td>
                  <td class="px-4 py-2 text-sm border">{{currencyFormat(item.quantity_keep)}}</td>
                  <td class="px-4 py-2 text-sm border">
                    <i class="fa fa-trash cursor-pointer text-red-600 hover:text-red-800" title="Delete" @click="deleteKeepProduct(item.id, item.product_id, item.quantity_keep)"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-end mt-4">
            <button
              @click="hideModalDetailKeepProduct"
              class="px-4 py-2 bg-white text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors min-w-[120px]"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Print Template -->
    <div v-if="isShowModalPrintTem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="isShowModalPrintTem = false">
      <div class="bg-white rounded-lg shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Chọn Sản Phẩm In Tem Nhãn</h4>

          <label class="flex items-center mb-4">
            <input type="checkbox" v-model="selectAll" @change="toggleAll" class="mr-2" />
            <strong>Chọn tất cả</strong>
          </label>

          <div v-for="product in products_print" :key="product.id" class="mb-2">
            <label class="flex items-center">
              <input type="checkbox" v-model="product.selected" class="mr-2" />
              {{ product.product_code }} - {{ product.product_name }}
            </label>
          </div>

          <div class="flex justify-between mt-6">
            <button
              @click="isShowModalPrintTem = false"
              class="px-4 py-2 bg-white text-gray-600 border border-gray-600 rounded hover:bg-gray-50 transition-colors min-w-[120px]"
            >
              Bỏ qua
            </button>
            <button
              @click="confirmPrint"
              class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors min-w-[120px]"
            >
              Xác nhận in
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Print Area (Hidden) -->
    <div id="printArea" ref="printArea" v-show="false">
      <div class="label" v-for="product in products_print.filter(p => p.selected)" :key="product.id">
        <div>Tên hàng: <strong>{{ product.product_name }}</strong></div>
        <div>Mã SP: {{ product.product_code }}</div>
        <div>Đơn vị: {{ product.brand_name }}</div>
        <div>Hãng: {{ product.brand_name }}</div>
        <div>Xuất xứ: {{ product.brand_name }}</div>
        <div style="margin-top: 1rem;"><strong>{{ company_info.name }}</strong></div>
        <div>{{ company_info.address }}</div>
        <div>Tel: {{ company_info.phone_number }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { Constant } from '@/common/constant'
import repositoryApi from '@/api/repository'
import quotationApi from '@/api/quotation'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'

const router = useRouter()
const { popToast } = useToast()

// Data
const loadingOption = ref(false)
const company_info = ref({})
const inputs = reactive({
  product_group_id: null,
  product_type_id: null,
  code: null,
  name: null
})

const productBrandOptions = ref([])
const productBrandSelect = ref({})
const productTypeSelect = ref({})
const productTypeOptions = ref([])
const productTypeOptionStore = ref([])
const productGroupSelect = ref({})
const productGroupOptions = ref([])
const productSelect = ref({})
const productOptions = ref([])
const loadingProductOptions = ref(false)
const items = ref([])
const selectAll = ref(true)
const products_print = ref([])
const excel_items = ref([])
const excel_fields = reactive({
  '#No': 'stt',
  'Nhóm SP': 'product_group_name',
  'Loại SP': 'product_type_name',
  'Hãng SP': 'brand_name',
  'Mã sản phẩm': 'product_code',
  'Sản phẩm': 'product_name',
  'Số lượng': 'quantity',
  'Đơn giá nhập': 'price_buy',
  'Thành tiền': 'amount_buy',
  'Số lượng đang tạm giữ chờ xuất kho': 'quantity_keep',
})

const total_amount = ref(0)
const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const totalRow = ref(0)
const isGetExcelItems = ref(false)
const fileUpload = ref(null)
const fileName = ref("Chọn file excel bạn muốn upload")
const uploading = ref(false)
const uploadErrorList = ref([])
const keepProductItems = ref([])
const loadingKeepProduct = ref(false)
const currentProduct = ref({})
const total_quantity = ref(0)
const total_price_buy = ref(0)
const total_amount_buy = ref(0)
const total_quantity_keep = ref(0)
const isShowModalPrintTem = ref(false)
const showModalImport = ref(false)
const showModalKeepProduct = ref(false)

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  getProductOptions()
  getOptions()
  prepareToSearch()
  getStoreDetail()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// Methods
function onScroll(event) {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

function getStoreDetail() {
  repositoryApi.getStoreDetail().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      company_info.value = res.data.data
      let address = ""
      if (company_info.value.address) {
        address += company_info.value.address
      }
      if (company_info.value.district_name) {
        address += company_info.value.district_name
      }
      if (company_info.value.city_name) {
        address += ", " + company_info.value.city_name
      }
      company_info.value.address = address
    }
  }).catch(err => {})
}

function getOptions() {
  loadingOption.value = true
  const params = {
    "product_brands": true,
    "product_groups": true,
    "product_types": true
  }

  repositoryApi.getOptionsRelatedRepository(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      productGroupOptions.value = res.data.data.product_groups
      const itemGroupEmpty = {"id": null, "name": ""}
      productGroupOptions.value.unshift(itemGroupEmpty)

      const product_types = res.data.data.product_types
      productTypeOptionStore.value = product_types
      productTypeOptions.value = product_types
      const itemTypeEmpty = {"id": null, "name": "", "product_group_id": null}
      productTypeOptions.value.unshift(itemTypeEmpty)

      const product_brands = res.data.data.product_brands
      productBrandOptions.value = product_brands
      const itemBrandEmpty = {"value": null, "text": ""}
      productBrandOptions.value.unshift(itemBrandEmpty)
    }
    loadingOption.value = false
  }).catch(err => {
    loadingOption.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

function getProductOptions() {
  loadingProductOptions.value = true
  quotationApi.getProductOptions().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      productOptions.value = res.data.data
      const itemEmpty = {"id": null, "name_full": ''}
      productOptions.value.unshift(itemEmpty)
    }
    loadingProductOptions.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loadingProductOptions.value = false
  })
}

function changeProductGroup() {
  if (productGroupSelect.value && productGroupSelect.value.id) {
    productTypeOptions.value = []
    for (let item of productTypeOptionStore.value) {
      if (productGroupSelect.value.id == item.product_group_id) {
        productTypeOptions.value.push(item)
      }
    }
  } else {
    productTypeOptions.value = productTypeOptionStore.value
  }
  const itemTypeEmpty = {"id": null, "name": "", "product_group_id": null}
  productTypeOptions.value.unshift(itemTypeEmpty)
  productTypeSelect.value = productTypeOptions.value[0]
  productSelect.value = productOptions.value[0]
}

function changeProductType() {
  productSelect.value = productOptions.value[0]
}

function prepareToSearch() {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

function search() {
  if (onSearch.value) { return }

  onSearch.value = true
  loading.value = true
  const product_group_id = productGroupSelect.value && productGroupSelect.value.id ? productGroupSelect.value.id : null
  const product_type_id = productTypeSelect.value && productTypeSelect.value.id ? productTypeSelect.value.id : null
  const params = {
    "product_group_id": product_group_id,
    "product_type_id": product_type_id,
    "product_brand_id": productBrandSelect.value && productBrandSelect.value.value ? productBrandSelect.value.value : null,
    "product_id": productSelect.value && productSelect.value.id ? productSelect.value.id : null,
    "limit": pageLimit.value,
    "offset": offset.value
  }
  repositoryApi.getListProductInRepository(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data.repositorys
      totalRow.value = res.data.data.total_row
      total_amount.value = res.data.data.total_amount

      if (loadByScroll.value) {
        const temp = items.value
        const newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if (offset.value + pageLimit.value >= res.data.data.total_row) {
        hasNext.value = false
      }

      if (!isGetExcelItems.value) {
        getExcelItem(params)
      }
    } else {
      items.value = []
      excel_items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    onSearch.value = false
    loading.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

function getExcelItem(params) {
  if (isGetExcelItems.value) {
    return
  }
  excel_items.value = []
  params.limit = 999999

  repositoryApi.getListProductInRepository(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      excel_items.value = res.data.data.repositorys
      products_print.value = JSON.parse(JSON.stringify(res.data.data.repositorys))
      isGetExcelItems.value = true

      total_quantity.value = 0
      total_price_buy.value = 0
      total_amount_buy.value = 0
      total_quantity_keep.value = 0
      for (let item of excel_items.value) {
        total_quantity.value += parseFloat(item.quantity)
        total_price_buy.value += parseInt(item.price_buy)
        total_amount_buy.value += parseInt(item.amount_buy)
        total_quantity_keep.value += parseFloat(item.quantity_keep)
      }
      total_quantity.value = Math.round(total_quantity.value * 100) / 100
      total_quantity_keep.value = Math.round(total_quantity_keep.value * 100) / 100

      for (let item of products_print.value) {
        item.selected = true
      }
    }
  }).catch(err => {})
}

function currencyFormat(num) {
  let result = ""
  if (num == 0) {
    return 0
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

function openModalImportFile() {
  showModalImport.value = true
}

function handleFileUpload() {
  fileUpload.value = document.getElementById('file').files[0]
}

function importProductFromExcelFile() {
  uploading.value = true
  const form_data = new FormData()
  form_data.append("importFile", fileUpload.value)
  repositoryApi.importFromExcelFile(form_data).then(res => {
    if (res != null && res.data != null) {
      if (res.data.data == null) {
        showModalImport.value = false
      } else {
        uploadErrorList.value = res.data.data
      }
    }
    prepareToSearch()
    uploading.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    uploading.value = false
  })
}

function getListKeepProduct(product_id) {
  loadingKeepProduct.value = true
  repositoryApi.getListKeepProduct(product_id).then(res => {
    if (res != null && res.data != null) {
      keepProductItems.value = res.data.data
    }
    loadingKeepProduct.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loadingKeepProduct.value = false
  })
}

function deleteKeepProduct(id, product_id, quantity_keep) {
  loadingKeepProduct.value = true
  repositoryApi.deleteKeepProduct({id: id, product_id: product_id}).then(res => {
    if (res != null && res.data != null && res.data.data) {
      keepProductItems.value = res.data.data
      currentProduct.value.quantity_keep -= quantity_keep
      prepareToSearch()
    }
    loadingKeepProduct.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loadingKeepProduct.value = false
  })
}

function showModalDetailKeepProduct(product) {
  currentProduct.value = product
  getListKeepProduct(product.product_id)
  showModalKeepProduct.value = true
}

function hideModalDetailKeepProduct() {
  showModalKeepProduct.value = false
}

function toggleAll() {
  products_print.value.forEach(p => {
    p.selected = selectAll.value
  })
}

function confirmPrint() {
  setTimeout(() => {
    printSelected()
  }, 1000)
}

function printSelected() {
  let page_width = '5cm'
  if (company_info.value && company_info.value.printer_width) {
    page_width = company_info.value.printer_width + 'cm'
  }
  let page_height = '3cm'
  if (company_info.value && company_info.value.printer_height) {
    page_height = company_info.value.printer_height + 'cm'
  }
  let font_size_header = '6px'
  let font_size = '5px'
  if (company_info.value && company_info.value.printer_font_size) {
    font_size = company_info.value.printer_font_size + 'px'
    font_size_header = (parseInt(company_info.value.printer_font_size) + 1) + 'px'
  }
  const printContent = document.createElement('div')
  const selectedItems = products_print.value.filter(p => p.selected)

  selectedItems.forEach(p => {
    const label = document.createElement('div')
    label.className = 'label'
    label.innerHTML = `
      <div class="label-box">
        <div style="padding-top: 2px; padding-left: 2px;">
          <p class="label-header">${p.product_name}</p>
          <p>Mã hàng: ${p.product_code}</p>
          <p>Đơn vị: ${p.unit_name}</p>
          <p>Xuất xứ: ${p.brand_name}</p>
          <p style="padding-top: 5px;"><strong>${company_info.value.name}</strong></p>
          <p>${company_info.value.address}</p>
          <p>Tel: ${company_info.value.phone_number}</p>
        </div>
      </div>
    `
    printContent.appendChild(label)
  })

  const mywindow = window.open('', 'PRINT', 'height=600,width=800')
  mywindow.document.write('<html><head><title> </title>')
  mywindow.document.write(`
    <style>
      @page {
        size: ${page_width} ${page_height} landscape;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .label {
        width: ${page_width};
        height: ${page_height};
        page-break-after: always;
        padding: 0;
        font-family: Arial, sans-serif;
        font-size: ${font_size};
      }
      .label-box {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .label-header {
        font-size: ${font_size_header};
        font-weight: bold;
        text-align: center;
      }
    </style>
  `)
  mywindow.document.write('</head><body>')
  mywindow.document.write(printContent.innerHTML)
  mywindow.document.write('</body></html>')
  mywindow.document.close()
  mywindow.focus()

  setTimeout(function() {
    mywindow.print()
    mywindow.close()
  }, 1000)

  return true
}
</script>

<style lang="scss" scoped>
.label-width {
  width: 100%;
}
</style>
