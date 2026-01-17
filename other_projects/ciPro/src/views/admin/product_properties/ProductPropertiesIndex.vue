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

        <h4 class="text-2xl font-semibold text-center mb-4">{{prefix_text}}Thuộc Tính Sản Phẩm</h4>
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
                v-model="productProperties.product_group_id"
                @change="changeProductGroup"
                :disabled="isUpdate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                v-model="productProperties.product_type_id"
                :disabled="isUpdate || !productProperties.product_group_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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

          <div v-show="productProperties.properties.length > 0" class="border-t pt-4">
            <div class="mb-4">
              <p v-for="(item, index) in productProperties.properties" :key="index" class="mb-2">
                <span class="font-medium">+ {{item.name}}:</span>
                <span v-for="(value, vIndex) in item.value" :key="vIndex" class="ml-2 inline-flex items-center">
                  <span>- {{value}}</span>
                  <button
                    @click="deleteItem(item.name, vIndex)"
                    class="ml-1 text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <i class="fa fa-trash text-xs" />
                  </button>
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Tên thuộc tính (ví dụ: Size) <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <input
                id="code"
                type="text"
                maxlength="30"
                autocomplete="new-password"
                v-model="productPropertiesItem.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }"
              >
              <div v-if="errorName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên thuộc tính
              </div>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Giá trị thuộc tính (ví dụ: S) <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <input
                id="name"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                v-model="productPropertiesItem.value"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorValue }"
              >
              <div v-if="errorValue" class="text-red-500 text-sm mt-1">
                Vui lòng nhập giá trị thuộc tính
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <button
              @click="addPropertiesItem()"
              class="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors min-w-[220px]"
            >
              Thêm
            </button>
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
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

// Data
const prefix_text = ref('')
const productTypeOptions = ref([])
const productGroupOptions = ref([])
const productTypeOptionStore = ref([])
const productProperties = reactive({
  product_group_id: null,
  product_type_id: null,
  properties: []
})
const productPropertiesItem = reactive({
  name: null,
  value: null
})
const click = ref(false)
const saving = ref(false)
const loading = ref(false)
const isUpdate = ref(false)

// Computed
const errorProductGroup = computed(() => {
  return checkInfo(productProperties.product_group_id)
})

const errorProductType = computed(() => {
  return checkInfo(productProperties.product_type_id)
})

const errorName = computed(() => {
  return checkInfo(productPropertiesItem.name)
})

const errorValue = computed(() => {
  return checkInfo(productPropertiesItem.value)
})

// Methods
const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorProductGroup.value || errorProductType.value)
}

const checkValidateAddItem = () => {
  return !(errorName.value || errorValue.value)
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

const getProductTypeOption = () => {
  productApi.getProductTypeOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      productTypeOptionStore.value = res.data.data
    }
  })
}

const changeProductGroup = () => {
  productTypeOptions.value = [{value: null, text: ''}]

  for (let i in productTypeOptionStore.value) {
    if(productProperties.product_group_id == productTypeOptionStore.value[i].product_group_id) {
      let item = {value: productTypeOptionStore.value[i].value, text: productTypeOptionStore.value[i].text}
      productTypeOptions.value.push(item)
    }
  }
}

const getProductPropertiesDetail = () => {
  let productPropertiesId = route.params.id
  if(productPropertiesId){
    loading.value = true

    productApi.getProductPropertiesDetail(productPropertiesId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        Object.assign(productProperties, res.data.data)
        changeProductGroup()
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

const getIndexPropertiesItemByName = (name) => {
  for(let i in productProperties.properties) {
    if(productProperties.properties[i].name == name) {
      return i
    }
  }
  return -1
}

const addPropertiesItem = () => {
  click.value = true

  let result = checkValidateAddItem()
  if(result) {
    let index = getIndexPropertiesItemByName(productPropertiesItem.name)
    if (index != -1) {
      productProperties.properties[index].value.push(productPropertiesItem.value)
    } else {
      let newItem = {
        "name": productPropertiesItem.name,
        "value": [productPropertiesItem.value + ""]
      }
      productProperties.properties.push(newItem)
    }

    // Reset item
    productPropertiesItem.name = null
    productPropertiesItem.value = null
    click.value = false
  }
}

const deleteItem = (itemName, indexValue) => {
  let index = getIndexPropertiesItemByName(itemName)
  if (index != -1) {
    productProperties.properties[index].value.splice(indexValue, 1)
  }
}

const back = () => {
  router.push('/product-properties')
}

const save = () => {
  click.value = true

  let result = checkValidate()
  if(result) {
    // Check properties length
    if(productProperties.properties.length == 0) {
      popToast('danger', "Chưa có thuộc tính nào được thêm vào")
      return
    }
    click.value = false
    saving.value = true

    let propertiesId = route.params.id
    if(propertiesId){
      // Edit
      let propsData = { ...productProperties, id: propertiesId }
      productApi.updateProductProperties(propsData).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            popToast('success', 'Cập nhật thuộc tính sản phẩm thành công!!! ')
          }
        }
      }).catch(err => {
        saving.value = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    } else {
      // Add
      productApi.addProductProperties(productProperties).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            router.push("/product-properties")
          }
        }
      }).catch(err => {
        saving.value = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

// Lifecycle
onMounted(() => {
  // Check prefix
  if(route.params.id) {
    prefix_text.value = "Cập Nhật "
    isUpdate.value = true
  } else {
    prefix_text.value = "Thêm Mới "
  }

  // Get product group option
  getProductGroupOption()
  getProductTypeOption()

  getProductPropertiesDetail()
})
</script>
