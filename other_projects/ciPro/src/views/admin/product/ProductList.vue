<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4 space-x-2">
          <button
            @click="openModalImportFile"
            class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px]"
          >
            Upload
          </button>
          <button
            @click="gotoAdd"
            class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors min-w-[120px]"
          >
            Thêm
          </button>
        </div>

        <h4 class="text-2xl font-semibold text-center mb-4">Danh Sách Sản Phẩm</h4>
        <hr class="mb-6">

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nhóm SP</label>
            <select
              id="product_group_id"
              v-model="inputs.product_group_id"
              @change="changeProductGroup"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="option in productGroupOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loại SP</label>
            <select
              id="product_type_id"
              v-model="inputs.product_type_id"
              :disabled="!inputs.product_group_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option v-for="option in productTypeOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hãng SP</label>
            <select
              id="productBrand"
              v-model="inputs.product_brand_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="option in productBrandOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã SP</label>
            <input
              id="code"
              type="text"
              maxlength="255"
              autocomplete="new-password"
              v-model="inputs.code"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên SP</label>
            <input
              id="name"
              type="text"
              maxlength="255"
              autocomplete="new-password"
              v-model="inputs.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <div class="flex justify-end mb-4">
          <button
            @click="prepareToSearch"
            :disabled="onSearch"
            class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[120px] disabled:opacity-50"
          >
            Tìm Kiếm
          </button>
        </div>

        <div class="flex justify-between items-center mb-4">
          <div class="text-sm text-gray-600">
            Số kết quả: {{totalRow}}
          </div>
          <div v-if="excel_items.length > 0">
            <download-excel
              class="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors cursor-pointer inline-block"
              :data="excel_items"
              :fields="excel_fields"
              worksheet="data"
              name="danh_sach_san_pham.xls"
            >
              <b>Xuất Excel</b>
            </download-excel>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  STT
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  Nhóm SP
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  Loại SP
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  Hãng SP
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  Mã SP
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  Tên SP
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                  Giá bán
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">

                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.stt }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.product_group_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.product_type_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.product_brand_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right border">
                  {{ formatCurrency(item.price_sell) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium border">
                  <div class="flex space-x-2">
                    <button
                      @click="edit(item.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name, item.stt)"
                      class="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <i class="fa fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>
        <div v-if="hasNext === false" class="text-center py-4 text-gray-500">--Hết--</div>
        <div v-if="hasNext === true && totalRow != 0" class="text-center py-4">
          <i class="fa fa-angle-double-down text-2xl text-blue-600 cursor-pointer"></i>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-xl font-semibold mb-4">Upload sản phẩm từ file excel</h4>
          <p class="mb-4">
            Tải xuống file mẫu:
            <a target="_blank" href="https://api.cipro.vn/files/upload_excel_template/ciPro_upload_product_template.xlsx" class="text-blue-600 hover:underline">Tải xuống</a>
          </p>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block mb-2">Chọn file excel bạn muốn upload</label>
            <input
              type="file"
              id="file"
              ref="fileInput"
              @change="handleFileUpload()"
              accept=".xlsx"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div v-show="uploading" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>

          <div class="flex justify-end space-x-2 mt-4">
            <button
              @click="closeImportModal"
              class="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Đóng
            </button>
            <button
              v-show="!uploading"
              @click="importProductFromExcelFile()"
              :disabled="!fileUpload || uploading"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Upload
            </button>
          </div>

          <div v-show="uploadErrorList.length > 0" class="mt-4">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border-b">Dòng</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border-b">Mô tả lỗi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(error, index) in uploadErrorList" :key="index">
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{ error.row }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 border">{{ error.mess }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import productApi from '@/api/product'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

const router = useRouter()
const { popToast } = useToast()
const { formatCurrency } = useFormatters()

// Data
const productTypeOptionStore = ref([])
const productTypeOptions = ref([])
const productGroupOptions = ref([])
const productBrandOptions = ref([])
const items = ref([])
const inputs = reactive({
  code: '',
  name: '',
  product_type_id: null,
  product_group_id: null,
  product_brand_id: null
})
const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = Constant.PAGE_LIMIT
const offset = ref(0)
const totalRow = ref(0)
const fileUpload = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
const uploadErrorList = ref([])
const excel_items = ref([])
const excel_fields = {
  'ID': 'id',
  'Nhóm sản phẩm*': 'product_group_name',
  'Loại sản phẩm*': 'product_type_name',
  'Hãng sản phẩm': 'product_brand_name',
  'Mã sản phẩm': 'code',
  'Tên sản phẩm*' : 'name',
  'Đơn vị*' : 'unit_name',
  'Giá list' : 'price_list',
  'Chiết khấu %' : 'discount',
  'Giá bán' : 'price_sell',
  'Mô tả' : 'description'
}
const isGetExcelItems = ref(false)
const showImportModal = ref(false)

// Methods
const onScroll = (event) => {
  if(onSearch.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const getProductTypeOption = () => {
  productApi.getProductTypeOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      productTypeOptionStore.value = res.data.data
    }
  })
}

const getProductGroupOption = () => {
  productApi.getProductGroupOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      productGroupOptions.value = [{value: null, text: ''}]

      var productGroups = res.data.data
      if(productGroups) {
        for (let i in productGroups) {
          productGroupOptions.value.push(productGroups[i])
        }
      }
    }
  })
}

const getProductBrandOption = () => {
  productApi.getProductBrandOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      productBrandOptions.value = [{value: null, text: ''}]

      var productBrands = res.data.data
      if(productBrands) {
        for (let i in productBrands) {
          productBrandOptions.value.push(productBrands[i])
        }
      }
    }
  })
}

const changeProductGroup = () => {
  productTypeOptions.value = [{value: null, text: ''}]

  for (let i in productTypeOptionStore.value) {
    if(inputs.product_group_id == productTypeOptionStore.value[i].product_group_id) {
      let item = {value: productTypeOptionStore.value[i].value, text: productTypeOptionStore.value[i].text}
      productTypeOptions.value.push(item)
    }
  }
}

const deleted = (id, name, rowIndex) => {
  if(id && name) {
    if (confirm(`Xóa ${name}. Bạn có chắc không?`)) {
      productApi.deleteProduct(id).then(res => {
        popToast('success', "Xoá sản phẩm thành công!")
        prepareToSearch()
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const edit = (id) => {
  window.open('/product/index/' + id, '_blank')
}

const gotoAdd = () => {
  router.push('/product/index/')
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  let params = {
    "code": inputs.code.trim(),
    "name": inputs.name.trim(),
    "product_type_id": inputs.product_type_id,
    "product_group_id": inputs.product_group_id,
    "product_brand_id": inputs.product_brand_id,
    "limit": pageLimit,
    "offset": offset.value
  }

  productApi.searchProductByStaff(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data

      // Update items
      if(loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if(!isGetExcelItems.value) {
        getExcelItem(params)
      } else {
        if(parseInt(offset.value) + parseInt(pageLimit) >= parseInt(totalRow.value)) {
          hasNext.value = false
        }
      }
    } else {
      items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    onSearch.value = false
    loading.value = false
  })
}

const getExcelItem = (params) => {
  if(isGetExcelItems.value) {
    return
  }

  excel_items.value = []

  // Define params
  params.offset = 0
  params.limit = 999999

  // Search
  productApi.searchProductByStaff(params).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      excel_items.value = res.data.data
      totalRow.value = excel_items.value.length
      if(parseInt(offset.value) + parseInt(pageLimit) >= parseInt(totalRow.value)) {
        hasNext.value = false
      }
      isGetExcelItems.value = true
    }
  }).catch(err => {})
}

const openModalImportFile = () => {
  showImportModal.value = true
  uploadErrorList.value = []
}

const closeImportModal = () => {
  showImportModal.value = false
  uploadErrorList.value = []
  fileUpload.value = null
}

const importProductFromExcelFile = () => {
  uploading.value = true
  const form_data = new FormData()
  form_data.append("importFile", fileUpload.value)
  productApi.importProductFromExcelFile(form_data).then(res => {
    if(res != null && res.data != null){
      let errors = res.data.data
      if(errors.length == 0) {
        closeImportModal()
        popToast('success', "Upload sản phẩm hoàn tất!")
      } else {
        uploadErrorList.value = res.data.data
      }
    }
    prepareToSearch()
    uploading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    uploading.value = false
  })
}

const handleFileUpload = () => {
  fileUpload.value = fileInput.value.files[0]
}

// Lifecycle
onMounted(() => {
  getProductGroupOption()
  getProductBrandOption()
  getProductTypeOption()

  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', deleted)

  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', deleted)
})
</script>
