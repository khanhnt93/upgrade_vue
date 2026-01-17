<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-between mb-4">
          <button
            @click="back"
            class="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors min-w-[120px]"
          >
            Quay lại
          </button>
          <button
            @click="save"
            :disabled="saving"
            class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors min-w-[120px] disabled:opacity-50"
          >
            Lưu
          </button>
        </div>

        <h4 class="text-2xl font-semibold text-center mb-4">{{prefix_text}} Sản Phẩm</h4>
        <hr class="mb-6">

        <!-- Loading -->
        <div v-show="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>

        <div class="space-y-4">
          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Nhóm sản phẩm <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <select
                id="productGroup"
                v-model="product.product_group_id"
                @change="changeProductGroup"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorProductGroup }"
              >
                <option v-for="option in productGroupOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <div v-if="errorProductGroup" class="text-red-500 text-sm mt-1">
                Vui lòng nhập nhóm sản phẩm
              </div>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Loại sản phẩm <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <select
                id="productType"
                v-model="product.product_type_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorProductType }"
              >
                <option v-for="option in productTypeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <div v-if="errorProductType" class="text-red-500 text-sm mt-1">
                Vui lòng nhập loại sản phẩm
              </div>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Hãng sản phẩm
            </label>
            <div class="w-3/4">
              <select
                id="product_brand"
                v-model="product.product_brand_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="option in productBrandOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Mã sản phẩm
            </label>
            <div class="w-3/4">
              <input
                id="code"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                v-model="product.code"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Tên sản phẩm <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <input
                id="name"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                v-model="product.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }"
              >
              <div v-if="errorName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên sản phẩm
              </div>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Đơn vị <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <select
                id="unit"
                v-model="product.unit_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorUnit }"
              >
                <option v-for="option in unitOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <div v-if="errorUnit" class="text-red-500 text-sm mt-1">
                Vui lòng nhập đơn vị
              </div>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Giá list
            </label>
            <div class="w-3/4">
              <input
                id="price_list"
                type="text"
                maxlength="14"
                autocomplete="new-password"
                v-model="product.price_list"
                @keyup="integerAndPointOnly($event.target)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Chiết khấu
            </label>
            <div class="w-3/4">
              <input
                id="discount"
                type="text"
                maxlength="14"
                autocomplete="new-password"
                v-model="product.discount"
                @keyup="integerAndPointOnly($event.target)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Giá bán
            </label>
            <div class="w-3/4">
              <input
                id="price_sell"
                type="text"
                maxlength="14"
                autocomplete="new-password"
                v-model="product.price_sell"
                @keyup="integerAndPointOnly($event.target)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <div class="w-3/4">
              <textarea
                id="description"
                rows="3"
                v-model="product.description"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Nguyên liệu
            </label>
            <div class="w-3/4 space-y-4">
              <div v-if="product.resources.length > 0" class="mb-4">
                <div v-for="(resource, index) in product.resources" :key="index" class="mb-3 pb-3 border-b">
                  <p class="flex items-center">
                    <span class="font-medium mr-2">- {{resource.product_name}}</span>
                    <button
                      @click="deleteResource(index)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <i class="fa fa-trash" />
                    </button>
                  </p>
                  <p class="text-sm text-gray-600">Số lượng: {{currencyFormat(resource.quantity)}}</p>
                </div>
              </div>

              <div class="space-y-3">
                <div>
                  <multiselect
                    v-model="resource.product"
                    :options="productOptions"
                    :loading="loadingProductOptions"
                    :select-label="''"
                    :deselect-label="''"
                    placeholder="-- Chọn nguyên liệu --"
                    label="name_full"
                    track-by="name_full"
                  >
                  </multiselect>
                </div>
                <div>
                  <input
                    id="quantity"
                    type="text"
                    maxlength="11"
                    autocomplete="new-password"
                    v-model="resource.quantity"
                    placeholder="Nhập số lượng"
                    @keyup="integerAndPointOnly($event.target)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
              </div>

              <div class="text-center">
                <button
                  @click="addResources"
                  class="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[220px]"
                >
                  Thêm nguyên liệu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import productApi from '@/api/product'
import quotationApi from '@/api/quotation'
import unitApi from '@/api/unit'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

// Data
const prefix_text = ref('Thêm Mới')
const productTypeOptions = ref([])
const productGroupOptions = ref([])
const productBrandOptions = ref([])
const productTypeOptionStore = ref([])
const unitOptions = ref([])
const productOptions = ref([])
const loadingProductOptions = ref(false)
const product = reactive({
  code: null,
  name: null,
  product_type_id: null,
  product_group_id: null,
  product_brand_id: null,
  unit_id: null,
  price_list: null,
  discount: null,
  price_sell: null,
  description: null,
  resources: []
})
const resource = reactive({
  product: {},
  quantity: null
})
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

// Computed
const errorName = computed(() => {
  return checkInfo(product.name)
})

const errorProductType = computed(() => {
  return checkInfo(product.product_type_id)
})

const errorProductGroup = computed(() => {
  return checkInfo(product.product_group_id)
})

const errorUnit = computed(() => {
  return checkInfo(product.unit_id)
})

// Methods
const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorName.value || errorProductType.value || errorProductGroup.value || errorUnit.value)
}

const getProductOptions = () => {
  loadingProductOptions.value = true

  quotationApi.getProductOptions().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      productOptions.value = res.data.data
      let itemEmpty = {"id": null, "name_full": '-- Chọn sản phẩm --'}
      productOptions.value.unshift(itemEmpty)
    }

    loadingProductOptions.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loadingProductOptions.value = false
  })
}

const getProductTypeOption = () => {
  productApi.getProductTypeOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      productTypeOptionStore.value = res.data.data
      getProductDetail()
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
    if(product.product_group_id == productTypeOptionStore.value[i].product_group_id) {
      let item = {value: productTypeOptionStore.value[i].value, text: productTypeOptionStore.value[i].text}
      productTypeOptions.value.push(item)
    }
  }
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

      getProductTypeOption()
    }
  })
}

const getUnitOption = () => {
  unitApi.getListUnitOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      unitOptions.value = [{value: null, text: ''}]

      var units = res.data.data
      if(units) {
        for (let i in units) {
          unitOptions.value.push(units[i])
        }
      }
    }
  })
}

const getProductDetail = () => {
  let productId = route.params.id
  if(productId){
    loading.value = true

    productApi.getProductDetail(productId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        Object.assign(product, res.data.data)
        changeProductGroup()
      }

      loading.value = false
    }).catch(err => {
      loading.value = false

      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const save = () => {
  click.value = true

  let result = checkValidate()
  if(result) {
    saving.value = true

    let productId = route.params.id
    if(productId){
      // Edit
      let prodData = { ...product, id: productId }
      productApi.updateProduct(prodData).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            popToast('success', 'Cập nhật sản phẩm thành công!!! ')
          }
        }
      }).catch(err => {
        saving.value = false

        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    } else {
      // Add
      productApi.addProduct(product).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            router.push("/product")
          }
        }
      }).catch(err => {
        saving.value = false

        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const deleteResource = (index) => {
  product.resources.splice(index, 1)
}

const addResources = () => {
  if(!resource.product || !resource.product.id) {
    popToast('danger', 'Vui lòng chọn sản phẩm')
    return
  }
  if(!resource.quantity) {
    popToast('danger', 'Vui lòng nhập số lượng')
    return
  }
  resource.quantity = resource.quantity.replace(",", "")

  // Kiểm tra có trùng sản phẩm ko
  let is_exist = false
  for(let res in product.resources) {
    if (resource.product.id == product.resources[res].product_id) {
      product.resources[res].quantity = parseFloat(resource.quantity)
      is_exist = true
      break
    }
  }

  if(is_exist == false) {
    let resource_new = {
      product_id: resource.product.id,
      product_name: resource.product.name_full,
      quantity: resource.quantity
    }
    product.resources.push(resource_new)
  }

  resource.product = {}
  resource.quantity = null
}

const back = () => {
  router.push("/product")
}

const integerAndPointOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.integerAndPointOnly(valueInput)
  item.value = result
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

// Lifecycle
onMounted(() => {
  // Check prefix
  if(route.params.id) {
    prefix_text.value = "Cập Nhật"
  } else {
    prefix_text.value = "Thêm Mới"
  }

  getProductOptions()
  getProductGroupOption()
  getProductBrandOption()
  getUnitOption()
})
</script>
