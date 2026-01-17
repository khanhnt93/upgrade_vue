<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/2 px-2">
          <button
            @click="back"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-32">
            Quay lại
          </button>
        </div>
        <div class="w-full md:w-1/2 px-2 text-right">
          <button
            @click="save"
            :disabled="saving"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-32 disabled:opacity-50 disabled:cursor-not-allowed">
            Lưu
          </button>
        </div>
      </div>

      <div class="mb-4">
        <h4 class="text-center text-2xl font-semibold">Nguyên liệu - Mặt hàng</h4>
      </div>
      <hr class="mb-6">

      <!-- Loading -->
      <div v-show="loading" class="text-center my-8">
        <icon name="loading" width="60" />
      </div>

      <div class="space-y-4">
        <!-- Name field -->
        <div class="flex flex-wrap -mx-2">
          <div class="w-full md:w-1/4 px-2 flex items-center">
            <label class="font-medium">Tên<span class="text-red-500">*</span></label>
          </div>
          <div class="w-full md:w-3/4 px-2">
            <input
              id="name"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="resource.name">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập tên
            </div>
          </div>
        </div>

        <!-- Unit field -->
        <div class="flex flex-wrap -mx-2">
          <div class="w-full md:w-1/4 px-2 flex items-center">
            <label class="font-medium">Đơn vị</label>
          </div>
          <div class="w-full md:w-3/4 px-2">
            <select
              id="status"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="resource.unit">
              <option v-for="unit in units" :key="unit.value" :value="unit.value">
                {{ unit.text }}
              </option>
            </select>
          </div>
        </div>

        <!-- Quantity field -->
        <div class="flex flex-wrap -mx-2">
          <div class="w-full md:w-1/4 px-2 flex items-center">
            <label class="font-medium">Số lượng<span class="text-red-500">*</span></label>
          </div>
          <div class="w-full md:w-3/4 px-2">
            <input
              id="quantity"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="resource.quantity"
              :disabled="!!route.params.id"
              @keyup="integerAndPointOnly($event.target)">
            <div v-if="errorQuantity" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng
            </div>
          </div>
        </div>

        <!-- Min quantity field -->
        <div class="flex flex-wrap -mx-2">
          <div class="w-full md:w-1/4 px-2 flex items-center">
            <label class="font-medium">Số lượng tối thiểu<span class="text-red-500">*</span></label>
          </div>
          <div class="w-full md:w-3/4 px-2">
            <input
              id="min_quantity"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="resource.min_quantity"
              @keyup="integerAndPointOnly($event.target)">
            <div v-if="errorMinQuantity" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng tối thiểu
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import unitAPI from '@/api/unit'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const resource = ref({
  name: null,
  unit: null,
  quantity: 0,
  min_quantity: 0,
})

const units = ref([{ value: null, text: '' }])
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

// Computed properties
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
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorName.value || errorQuantity.value || errorMinQuantity.value)
}

const getUnitOptions = () => {
  unitAPI.getListUnitOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let unitsData = res.data.data
      for (let index in unitsData) {
        units.value.push(unitsData[index])
      }
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    showToast('danger', errorMess)
  })
}

const getUnitDetail = () => {
  let Id = route.params.id
  if (Id) {
    loading.value = true

    adminAPI.getResourceDetail(Id).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        resource.value = res.data.data
      }

      loading.value = false
    }).catch(err => {
      loading.value = false

      let errorMess = commonFunc.handleStaffError(err)
      showToast('danger', errorMess)
    })
  }
}

const back = () => {
  router.push('/resource/list')
}

const save = () => {
  click.value = true
  saving.value = true
  let result = checkValidate()

  if (result) {
    let id = route.params.id
    if (id) {
      // Edit
      let resourceData = resource.value
      resourceData.id = id
      adminAPI.editResource(resourceData).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            showToast('success', 'Cập nhật nguyên liệu thành công!!! ')
          }
        }
      }).catch(err => {
        saving.value = false

        let errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
      })
    } else {
      // Add
      adminAPI.addResource(resource.value).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            router.push("/resource/list")
          }
        }
      }).catch(err => {
        saving.value = false
        let errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
      })
    }
  } else {
    saving.value = false
  }
}

const integerAndPointOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.integerAndPointOnly(valueInput)
  item.value = result
}

// Lifecycle hooks
onMounted(() => {
  getUnitOptions()
  getUnitDetail()
})
</script>

<style scoped>
.error-sybol {
  color: red;
}
</style>
