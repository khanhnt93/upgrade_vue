<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <button class="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded" @click="back">
            Quay lại
          </button>
        </div>
        <div class="text-right">
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" @click="save" :disabled="saving">
            Lưu
          </button>
        </div>
      </div>

      <div class="mb-4">
        <h4 class="text-center text-xl font-semibold">Thương Hiệu</h4>
      </div>
      <hr class="mb-4"/>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-3 flex items-center">
          <label>Tên<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-9">
          <input
            type="text"
            class="form-control border rounded px-3 py-2 w-full"
            autocomplete="new-password"
            v-model="brand.name"
            maxlength="100">
          <div v-if="errorName" class="text-red-500 text-sm mt-1">
            Vui lòng nhập tên
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3 flex items-center">
          <label>Mô tả</label>
        </div>
        <div class="col-span-9">
          <textarea
            rows="5"
            class="form-control border rounded px-3 py-2 w-full"
            v-model="brand.description"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

const brand = ref({
  name: null,
  description: null
})
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

const errorName = computed(() => click.value && (!brand.value.name || brand.value.name.length <= 0))

const checkValidate = () => {
  return !errorName.value
}

/**
 * Get detail
 */
const getBrandDetail = () => {
  const brandId = route.params.id
  if(brandId){
    loading.value = true
    adminAPI.getBrandDetail(brandId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
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

/**
 * Save
 */
const save = () => {
  click.value = true

  if(!checkValidate()) {
    return
  }

  saving.value = true
  const brandId = route.params.id

  if(brandId){
    // Edit
    brand.value.id = brandId
    adminAPI.updateBrand(brand.value).then(res => {
      saving.value = false
      if(res != null && res.data != null){
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
      if(res != null && res.data != null){
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

/**
 * Back to list
 */
const back = () => {
  router.push("/brand/list")
}

onMounted(() => {
  getBrandDetail()
})
</script>
