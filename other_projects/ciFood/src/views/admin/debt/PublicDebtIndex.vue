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
        <h4 class="text-xl font-semibold text-center mb-4">Nợ Công</h4>
        <hr class="mb-4">

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Customer Name -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Tên khách hàng<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="debt.customer_name"
                type="text"
                autocomplete="new-password"
                maxlength="50"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorName }">
              <p v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên khách hàng</p>
            </div>
          </div>

          <!-- Phone Number -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Số điện thoại<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="debt.customer_phone_number"
                type="text"
                autocomplete="new-password"
                maxlength="100"
                @keyup="integerOnly($event.target)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorPhone }">
              <p v-if="errorPhone" class="text-red-500 text-sm mt-1">Vui lòng nhập số điện thoại</p>
            </div>
          </div>

          <!-- Address -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">Địa chỉ</label>
            <div class="md:col-span-9">
              <input
                v-model="debt.customer_address"
                type="text"
                autocomplete="new-password"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>

          <!-- Description -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">Mô tả</label>
            <div class="md:col-span-9">
              <input
                v-model="debt.description"
                type="text"
                autocomplete="new-password"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>

          <!-- Total Amount -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label class="md:col-span-3 pt-2 text-sm font-medium text-gray-700">
              Số tiền<span class="text-red-500">*</span>
            </label>
            <div class="md:col-span-9">
              <input
                v-model="debt.total"
                type="text"
                autocomplete="new-password"
                maxlength="100"
                @keyup="integerOnly($event.target)"
                :disabled="isEdit"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                :class="{ 'border-red-500': errorTotal }">
              <p v-if="errorTotal" class="text-red-500 text-sm mt-1">Vui lòng nhập số tiền</p>
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
const debt = ref({
  customer_name: null,
  customer_phone_number: null,
  customer_address: null,
  description: null,
  total: null,
  order_id: null,
  customer_id: null
})

const click = ref(false)
const saving = ref(false)
const loading = ref(false)
const isEdit = ref(false)

// Computed
const errorName = computed(() => {
  return checkInfo(debt.value.customer_name)
})

const errorPhone = computed(() => {
  return checkInfo(debt.value.customer_phone_number)
})

const errorTotal = computed(() => {
  return checkInfo(debt.value.total)
})

// Methods
const checkInfo = (info) => {
  return click.value && (info == null || info.length <= 0)
}

const checkValidate = () => {
  return !(errorName.value || errorPhone.value || errorTotal.value)
}

const getDeptDetail = () => {
  const id = route.params.id
  if (id) {
    loading.value = true
    isEdit.value = true
    adminAPI.getPublicDeptDetail(id).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        debt.value = res.data.data
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

  if (!checkValidate()) {
    return
  }

  saving.value = true

  const id = route.params.id
  if (id) {
    // Edit
    debt.value.id = id
    adminAPI.updatePublicDept(debt.value).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast('success', 'Cập nhật thành công!!! ')
        }
      }
    }).catch(err => {
      saving.value = false
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    // Add
    adminAPI.addPublicDept(debt.value).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          router.push('/public-debt/list')
        }
      }
    }).catch(err => {
      saving.value = false
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const integerOnly = (item) => {
  const result = commonFunc.intergerOnly(item.value)
  item.value = result
}

const back = () => {
  router.push('/public-debt/list')
}

// Lifecycle
onMounted(() => {
  getDeptDetail()
})
</script>
