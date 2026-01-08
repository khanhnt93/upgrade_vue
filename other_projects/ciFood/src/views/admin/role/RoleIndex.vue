<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-between mb-4">
          <button 
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors min-w-[120px]"
            @click="back">
            Quay lại
          </button>
          <button 
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving" 
            @click="save">
            Lưu
          </button>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Nhóm Quyền</h4>
          </div>
        </div>
        <hr class="my-4"/>

        <!-- Loading Overlay -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <svg class="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else>
          <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-3">
              <label class="block mb-2 font-medium">Code <span class="text-red-600"></span></label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorCode ? 'border-red-500' : 'border-gray-300'"
                v-model="role.code"
                maxlength="50">
              <p v-if="errorCode" class="mt-1 text-sm text-red-600">Vui lòng nhập code</p>
            </div>

            <div class="col-span-12 md:col-span-3">
              <label class="block mb-2 font-medium">Name <span class="text-red-600"></span></label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorName ? 'border-red-500' : 'border-gray-300'"
                v-model="role.name"
                maxlength="100">
              <p v-if="errorName" class="mt-1 text-sm text-red-600">Vui lòng nhập name</p>
            </div>
          </div>

          <div class="mt-6">
            <label class="block mb-2 font-semibold text-lg">Phân quyền vào chức năng</label>
            <label class="block mb-4 text-sm text-gray-600">(Bạn hãy chọn những chức năng mà nhóm quyền này được quyền truy cập)</label>

            <div v-for="group in groupScreen" :key="group.group_name" class="mb-6">
              <p class="font-bold mb-3">{{ group.group_name }}</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label 
                  v-for="screen in group.screen" 
                  :key="screen.screen_id"
                  class="inline-flex items-center">
                  <input 
                    :id="screen.screen_id" 
                    type="checkbox" 
                    class="form-checkbox h-4 w-4 text-blue-600 rounded"
                    v-model="role.screen" 
                    :value="screen.screen_id">
                  <span class="ml-2">{{ screen.screen_name }}</span>
                </label>
              </div>
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
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const role = ref({
  code: null,
  name: null,
  screen: []
})

const click = ref(false)
const saving = ref(false)
const loading = ref(false)
const groupScreen = ref([])

const errorCode = computed(() => click.value && (role.value.code == null || role.value.code.length <= 0))
const errorName = computed(() => click.value && (role.value.name == null || role.value.name.length <= 0))

const checkValidate = () => {
  return !(errorCode.value || errorName.value)
}

const getMasterScreen = async () => {
  try {
    const res = await adminAPI.getMasterScreen()
    if (res != null && res.data != null && res.data.data != null) {
      groupScreen.value = res.data.data
    }
  } catch (err) {
    console.log(err)
  }
}

const getRoleDetail = async () => {
  const roleId = route.params.id
  if (roleId) {
    loading.value = true

    try {
      const res = await adminAPI.getRoleDetail(roleId)
      if (res != null && res.data != null && res.data.data != null) {
        role.value = res.data.data
      }
      loading.value = false
    } catch (err) {
      loading.value = false
      const errorMess = commonFunc.handleStaffError(err)
      showToast(errorMess, 'danger')
    }
  }
}

const save = async () => {
  click.value = true

  const checkValid = checkValidate()
  if (!checkValid) {
    return
  }

  saving.value = true

  const roleId = route.params.id
  try {
    if (roleId) {
      // Edit
      role.value.id = roleId
      const res = await adminAPI.editRole(role.value)
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status === 200) {
          showToast('Cập nhật nhóm quyền thành công!!!', 'success')
        }
      }
    } else {
      // Add
      const res = await adminAPI.addRole(role.value)
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status === 200) {
          router.push("/role/list")
        }
      }
    }
  } catch (err) {
    saving.value = false
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

const back = () => {
  router.push("/role/list")
}

onMounted(() => {
  getMasterScreen()
  getRoleDetail()
})
</script>
