<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-between mb-4">
          <button
            class="border border-gray-400 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded w-32"
            @click="back">
            Quay lại
          </button>
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-32"
            @click="save"
            :disabled="saving">
            Lưu
          </button>
        </div>

        <div class="text-center mb-4">
          <h4 class="text-xl font-semibold text-gray-700">{{ prefix_title }} Đơn Vị</h4>
        </div>
        <hr class="mb-4">

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <icon name="loading" width="60" />
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Tên<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="name"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="unit.name">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập tên
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
import { useToast } from '@/composables/useToast'
import unitAPI from '@/api/unit'
import commonFunc from '@/common/commonFunc'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

const prefix_title = ref("Thêm Mới")
const unit = ref({
  name: null,
})
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

const errorName = computed(() => {
  return click.value && (unit.value.name == null || unit.value.name.length <= 0)
})

const checkValidate = () => {
  return !errorName.value
}

/**
 * Get detail
 */
const getUnitDetail = () => {
  let unitId = route.params.id
  if(unitId){
    loading.value = true

    unitAPI.getUnitDetail(unitId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        unit.value = res.data.data
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

/**
 * Back to list
 */
const back = () => {
  router.push('/unit')
}

/**
 * Save
 */
const save = () => {
  click.value = true
  saving.value = true
  let result = checkValidate()
  if(result) {
    let unitId = route.params.id
    if(unitId){
      // Edit
      let unitData = unit.value
      unitData.id = unitId
      unitAPI.editUnit(unitData).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            // show popup success
            popToast('success', 'Cập nhật đơn vị thành công!!! ')
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
      unitAPI.addUnit(unit.value).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            router.push("/unit")
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

onMounted(() => {
  // Check prefix
  if(route.params.id) {
    prefix_title.value = "Cập Nhật"
  } else {
    prefix_title.value = "Thêm Mới"
  }

  getUnitDetail()
})
</script>
