<template>
  <div class="container-fluid px-4 py-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header Row -->
        <div class="flex justify-between mb-4">
          <button
            @click="back"
            class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200">
            Quay lại
          </button>
          <button
            @click="save"
            :disabled="saving"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Lưu
          </button>
        </div>

        <!-- Title -->
        <h4 class="text-xl font-semibold text-center mb-4">Thương Hiệu</h4>
        <hr class="mb-4">

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Name -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Tên<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="brand.name"
                type="text"
                autocomplete="new-password"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }">
              <p v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên</p>
            </div>
          </div>

          <!-- Description -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">Mô tả</label>
            <div class="md:col-span-9">
              <textarea
                v-model="brand.description"
                rows="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

// Data
const brand = ref({
  name: null,
  description: null
})

const click = ref(false)
const saving = ref(false)
const loading = ref(false)

// Computed
const errorName = computed(() => {
  return checkInfo(brand.value.name)
})

// Methods
const checkInfo = (info) => {
  return click.value && (info == null || info.length <= 0)
}

const checkValidate = () => {
  return !errorName.value
}

const getBrandDetail = () => {
  const brandId = route.params.id
  if (brandId) {
    loading.value = true

    adminAPI.getBrandDetail(brandId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        brand.value = res.data.data
      }
      loading.value = false
    }).catch(err => {
      loading.value = false
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const save = () => {
  click.value = true

  const checkResult = checkValidate()
  if (!checkResult) {
    return
  }

  saving.value = true

  const brandId = route.params.id
  if (brandId) {
    // Edit
    brand.value.id = brandId
    adminAPI.updateBrand(brand.value).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast('success', 'Cập nhật thương hiệu thành công!!!')
        }
      }
    }).catch(err => {
      saving.value = false
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    // Add
    adminAPI.addBrand(brand.value).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          router.push("/brand/list")
        }
      }
    }).catch(err => {
      saving.value = false
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const back = () => {
  router.push("/brand/list")
}

// Lifecycle
onMounted(() => {
  getBrandDetail()
})
</script>
