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

        <h4 class="text-2xl font-semibold text-center mb-4">{{prefix_text}}Nhóm Sản Phẩm</h4>
        <hr class="mb-6">

        <!-- Loading -->
        <div v-show="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>

        <div class="space-y-4">
          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Mã nhóm sản phẩm <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <input
                id="code"
                type="text"
                maxlength="30"
                autocomplete="new-password"
                v-model="productGroup.code"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorCode }"
              >
              <div v-if="errorCode" class="text-red-500 text-sm mt-1">
                Vui lòng nhập mã nhóm sản phẩm
              </div>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Tên nhóm sản phẩm <span class="text-red-500">*</span>
            </label>
            <div class="w-3/4">
              <input
                id="name"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                v-model="productGroup.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }"
              >
              <div v-if="errorName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên nhóm sản phẩm
              </div>
            </div>
          </div>

          <div class="flex items-start">
            <label class="w-1/4 pt-2 text-sm font-medium text-gray-700">
              Loại nhóm sản phẩm
            </label>
            <div class="w-3/4">
              <select
                id="type"
                v-model="productGroup.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
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
const typeOptions = [
  {"value": 0, "text": 'Sản phẩm thường'},
  {"value": 1, "text": 'Sản phẩm dịch vụ'}
]
const productGroup = reactive({
  code: null,
  name: null,
  type: 0
})
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

// Computed
const errorCode = computed(() => {
  return checkInfo(productGroup.code)
})

const errorName = computed(() => {
  return checkInfo(productGroup.name)
})

// Methods
const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorCode.value || errorName.value)
}

const getProductGroupDetail = () => {
  let productGroupId = route.params.id
  if(productGroupId){
    loading.value = true

    productApi.getProductGroupDetail(productGroupId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        Object.assign(productGroup, res.data.data)
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
  router.push('/product-group')
}

const save = () => {
  click.value = true
  saving.value = true
  let result = checkValidate()
  if(result) {
    let productGroupId = route.params.id
    if(productGroupId){
      // Edit
      let groupData = { ...productGroup, id: productGroupId }
      productApi.updateProductGroup(groupData).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            popToast('success', 'Cập nhật nhóm sản phẩm thành công!!! ')
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
      productApi.addProductGroup(productGroup).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            router.push("/product-group")
          }
        }
      }).catch(err => {
        saving.value = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  } else {
    saving.value = false
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

  getProductGroupDetail()
})
</script>
