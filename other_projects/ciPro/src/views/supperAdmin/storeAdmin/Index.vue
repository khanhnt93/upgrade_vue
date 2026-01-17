<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header -->
        <h4 class="text-2xl font-semibold text-center mb-4">Admin store</h4>
        <hr class="my-4 border-gray-200">

        <!-- Form Fields -->
        <div class="space-y-4">
          <!-- Name -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">
              Tên <span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="adminStore.name"
                type="text"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }"
              >
              <p v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên</p>
            </div>
          </div>

          <!-- Phone Number -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">
              Số Điện Thoại <span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="adminStore.phone_number"
                type="text"
                maxlength="20"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorPhone }"
              >
              <p v-if="errorPhone" class="text-red-500 text-sm mt-1">Vui lòng nhập số điện thoại</p>
            </div>
          </div>

          <!-- Brand -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">Thương hiệu</label>
            <div class="md:col-span-9">
              <select
                v-model="adminStore.brand_id"
                @change="changeBrand"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="option in optionsBrand" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <!-- Store -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">Cửa Hàng</label>
            <div class="md:col-span-9">
              <select
                v-model="adminStore.store_id"
                @change="changeStore"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="option in optionsStore" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <!-- Password -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 text-sm font-medium text-gray-700 pt-2">
              Mật Khẩu <span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="adminStore.password"
                type="password"
                maxlength="100"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorPassword || errorLengthPassword }"
              >
              <p v-if="errorPassword" class="text-red-500 text-sm mt-1">Vui lòng nhập mật khẩu</p>
              <p v-if="errorLengthPassword" class="text-red-500 text-sm mt-1">Mật khẩu phải ít nhất 6 kí tự</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <button
              @click="back"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Quay lại
            </button>
          </div>
          <div>
            <button
              @click="save"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import superAdminAPI from '@/api/superAdmin'
import MapperStore from '@/mapper/store'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { popToast } = useToast()

// Reactive state
const options = ref([
  { value: 1, text: 'Staff' },
  { value: 2, text: 'Admin' },
  { value: 6, text: 'Brand Manager' }
])
const optionsStore = ref([])
const optionsBrand = ref([])
const adminStore = reactive({
  name: '',
  phone_number: '',
  password: '',
  store_id: null,
  brand_id: null
})
const saving = ref(false)

// Computed properties
const errorName = computed(() => checkInfo(adminStore.name))
const errorPhone = computed(() => checkInfo(adminStore.phone_number))
const errorPassword = computed(() => {
  if (!route.params.id) {
    return checkInfo(adminStore.password)
  }
  return false
})
const errorLengthPassword = computed(() => {
  if (errorPassword.value || !adminStore.password) {
    return false
  }
  if (saving.value) {
    return adminStore.password.length < 6
  }
  return false
})

// Methods
const checkInfo = (info) => {
  return saving.value && (info == null || info.length <= 0)
}

const checkValidate = () => {
  return !(errorName.value || errorPhone.value || errorPassword.value || errorLengthPassword.value)
}

const getStoreListDB = () => {
  superAdminAPI.getStoreListDB().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      optionsStore.value = MapperStore.mapStoreModelListToDto(res.data.data)
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getAdminStoreDetail = () => {
  const AdminStoreId = route.params.id
  if (AdminStoreId) {
    superAdminAPI.getAdminStoreDetail(AdminStoreId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        Object.assign(adminStore, res.data.data)
      }
    }).catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const save = () => {
  saving.value = true
  const result = checkValidate()
  if (result) {
    const adminStoreId = route.params.id
    if (adminStoreId) {
      const adminStoreData = { ...adminStore }
      adminStoreData.id = adminStoreId
      superAdminAPI.editAdminStore(adminStoreData).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            alert('Cập nhật thành công')
            router.push('/admin-store/list')
          }
        }
      }).catch(err => {
        saving.value = false
        let message = ''
        if (err.response.data.status == 422) {
          message = err.response.data.mess
        } else {
          message = 'Lỗi hệ thống'
        }
        alert(message)
      })
    } else {
      superAdminAPI.addAdminStore(adminStore).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          if (res.data.status == 200) {
            alert('Thêm thành công')
            router.push('/admin-store/list')
          }
        }
      }).catch(err => {
        saving.value = false
        let message = ''
        if (err.response.data.status == 422) {
          message = err.response.data.mess
        } else {
          message = 'Lỗi hệ thống'
        }
        alert(message)
      })
    }
  } else {
    saving.value = false
  }
}

const getOptionBrand = () => {
  superAdminAPI.getBrandOption().then(res => {
    optionsBrand.value = [{ value: null, text: '' }]
    if (res && res.data && res.data.data) {
      const brands = res.data.data
      for (const index in brands) {
        const brand = {
          value: brands[index].value,
          text: brands[index].text
        }
        optionsBrand.value.push(brand)
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const changeBrand = () => {
  const brandId = adminStore.brand_id
  if (brandId) {
    adminStore.store_id = null
  }
}

const changeStore = () => {
  const storeId = adminStore.store_id
  if (storeId) {
    adminStore.brand_id = null
  }
}

const back = () => {
  router.push('/admin-store/list')
}

// Lifecycle hooks
onMounted(() => {
  getOptionBrand()
  getStoreListDB()
  getAdminStoreDetail()
})
</script>
