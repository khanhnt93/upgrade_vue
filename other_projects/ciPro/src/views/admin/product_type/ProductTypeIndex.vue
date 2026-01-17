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

        <h4 class="text-2xl font-semibold text-center mb-4">{{prefix_text}}Loại Sản Phẩm</h4>
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
                v-model="productType.product_group_id"
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
              Mã loại sản phẩm <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <input
                id="code"
                type="text"
                maxlength="30"
                autocomplete="new-password"
                v-model="productType.code"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorCode }"
              >
              <div v-if="errorCode" class="text-red-500 text-sm mt-1">
                Vui lòng nhập mã loại sản phẩm
              </div>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Tên loại sản phẩm <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <input
                id="name"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                v-model="productType.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }"
              >
              <div v-if="errorName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên loại sản phẩm
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
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

// Data
const prefix_text = ref('')
const productGroupOptions = ref([])
const productType = reactive({
  product_group_id: null,
  code: null,
  name: null
})
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

// Computed
const errorProductGroup = computed(() => {
  return checkInfo(productType.product_group_id)
})

const errorCode = computed(() => {
  return checkInfo(productType.code)
})

const errorName = computed(() => {
  return checkInfo(productType.name)
})

// Methods
const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorProductGroup.value || errorCode.value || errorName.value)
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

const getProductTypeDetail = () => {
  let productTypeId = route.params.id
  if(productTypeId){
    loading.value = true

    productApi.getProductTypeDetail(productTypeId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        Object.assign(productType, res.data.data)
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

const back = () => {
  router.push('/product-type')
}

const save = () => {
  click.value = true

  let result = checkValidate()
  if(result) {
    saving.value = true

    let productTypeId = route.params.id
    if(productTypeId){
      // Edit
      let typeData = { ...productType, id: productTypeId }
      productApi.updateProductType(typeData).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            popToast('success', 'Cập nhật loại sản phẩm thành công!!! ')
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
      productApi.addProductType(productType).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            router.push("/product-type")
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
  } else {
    prefix_text.value = "Thêm Mới "
  }

  // Get product group option
  getProductGroupOption()

  getProductTypeDetail()
})
</script>
