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
        <h4 class="text-xl font-semibold text-center mb-4">Nguyên Liệu - Mặt Hàng</h4>
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
                v-model="resource.name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }">
              <p v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên</p>
            </div>
          </div>

          <!-- Unit -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">Đơn vị</label>
            <div class="md:col-span-9">
              <select
                v-model="resource.unit"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="unit in units" :key="unit.value" :value="unit.value">{{ unit.text }}</option>
              </select>
            </div>
          </div>

          <!-- Quantity -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Số lượng<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="resource.quantity"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                :disabled="!!route.params.id"
                @keyup="integerAndPointOnly($event.target)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                :class="{ 'border-red-500': errorQuantity }">
              <p v-if="errorQuantity" class="text-red-500 text-sm mt-1">Vui lòng nhập số lượng</p>
            </div>
          </div>

          <!-- Min Quantity -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Số lượng tối thiểu<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="resource.min_quantity"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                @keyup="integerAndPointOnly($event.target)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorMinQuantity }">
              <p v-if="errorMinQuantity" class="text-red-500 text-sm mt-1">Vui lòng nhập số lượng tối thiểu</p>
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
const resource = ref({
  name: null,
  unit: null,
  quantity: 0,
  min_quantity: 0
})

const units = ref([{ value: null, text: '' }])
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

// Computed
const errorName = computed(() => {
  return checkInfo(resource.value.name)
})

const errorQuantity = computed(() => {
  return checkInfo(resource.value.quantity)
})

const errorMinQuantity = computed(() => {
  return checkInfo(resource.value.min_quantity)
})

// Methods
const checkInfo = (info) => {
  return click.value && (info == null || info.toString().length <= 0)
}

const checkValidate = () => {
  return !(errorName.value || errorQuantity.value || errorMinQuantity.value)
}

const getUnitOptions = () => {
  adminAPI.getListUnitOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const unitsList = res.data.data
      for (let index in unitsList) {
        units.value.push(unitsList[index])
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getUnitDetail = () => {
  const Id = route.params.id
  if (Id) {
    loading.value = true

    adminAPI.getResourceDetail(Id).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        resource.value = res.data.data
      }
      loading.value = false
    }).catch(err => {
      loading.value = false
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const back = () => {
  router.push('/resource/list')
}

const save = () => {
  click.value = true
  saving.value = true
  const result = checkValidate()
  if (result) {
    const id = route.params.id
    if (id) {
      // Edit
      const resourceData = { ...resource.value, id }
      adminAPI.editResource(resourceData).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            popToast('success', 'Cập nhật nguyên liệu thành công!!! ')
          }
        }
      }).catch(err => {
        saving.value = false
        const errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    } else {
      // Add
      adminAPI.addResource(resource.value).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            router.push('/resource/list')
          }
        }
      }).catch(err => {
        saving.value = false
        const errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  } else {
    saving.value = false
  }
}

const integerAndPointOnly = (item) => {
  const result = commonFunc.integerAndPointOnly(item.value)
  item.value = result
}

// Lifecycle
onMounted(() => {
  getUnitOptions()
  getUnitDetail()
})
</script>
