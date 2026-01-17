<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <button
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 btn-width-120"
            @click="back">
            Quay lại
          </button>
        </div>
        <div class="text-right">
          <button
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 btn-width-120"
            @click="save"
            :disabled="saving">
            Lưu
          </button>
        </div>
      </div>

      <div class="mb-4">
        <h4 class="mt-1 text-center text-header font-bold">{{ prefix_text }}Nhóm Quyền</h4>
      </div>
      <hr class="my-4" />
      
      <!-- Loading -->
      <span v-show="loading" class="loading-more"><icon name="loading" width="60" /></span>

      <!-- Code -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label>Code<span class="error-sybol"></span></label>
        </div>
        <div class="md:col-span-9">
          <input
            id="code"
            v-model="role.code"
            type="text"
            class="form-control w-full"
            autocomplete="new-password"
            maxlength="50">
          <div v-if="errorCode" class="text-red-600 text-sm mt-1">
            Vui lòng nhập code
          </div>
        </div>
      </div>

      <!-- Name -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label>Name<span class="error-sybol"></span></label>
        </div>
        <div class="md:col-span-9">
          <input
            id="name"
            v-model="role.name"
            type="text"
            class="form-control w-full"
            autocomplete="new-password"
            maxlength="100">
          <div v-if="errorName" class="text-red-600 text-sm mt-1">
            Vui lòng nhập name
          </div>
        </div>
      </div>

      <!-- Permissions -->
      <div class="mb-4 mt-8">
        <label class="block mb-2">Phân quyền vào chức năng</label>
        <label class="block text-sm text-gray-600 mb-4">(Bạn hãy chọn những chức năng mà nhóm quyền này được quyền truy cập)</label>
      </div>

      <div>
        <div v-for="group in groupScreen" :key="group.group_name" class="mb-6">
          <p class="font-bold mb-3">{{ group.group_name }}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="screen in group.screen" :key="screen.screen_id" class="flex items-center">
              <input
                :id="screen.screen_id"
                v-model="role.screen"
                type="checkbox"
                name="screens"
                :value="screen.screen_id"
                class="mr-2">
              <label :for="screen.screen_id" class="cursor-pointer">{{ screen.screen_name }}</label>
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
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

// Router
const route = useRoute()
const router = useRouter()

// Toast
const { popToast } = useToast()

// Data
const prefix_text = ref('')
const role = ref({
  code: null,
  name: null,
  screen: []
})
const click = ref(false)
const saving = ref(false)
const loading = ref(false)
const groupScreen = ref([])

// Computed
const errorCode = computed(() => {
  return checkInfo(role.value.code)
})

const errorName = computed(() => {
  return checkInfo(role.value.name)
})

// Methods
const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorCode.value || errorName.value)
}

const getMasterScreen = () => {
  adminAPI.getMasterScreen().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      groupScreen.value = res.data.data
    }
  })
}

const getRoleDetail = () => {
  let roleId = route.params.id
  if (roleId) {
    loading.value = true

    adminAPI.getRoleDetail(roleId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        role.value = res.data.data
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

const save = () => {
  click.value = true

  let checkVal = checkValidate()
  if (!checkVal) {
    return
  }

  saving.value = true

  let roleId = route.params.id
  if (roleId) {
    // Edit
    role.value.id = roleId
    adminAPI.editRole(role.value).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          // show popup success
          popToast('success', 'Cập nhật nhóm quyền thành công!!! ')
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
    adminAPI.addRole(role.value).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          router.push("/role")
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

const back = () => {
  router.push("/role")
}

// Lifecycle
onMounted(() => {
  // Check prefix
  if (route.params.id) {
    prefix_text.value = "Cập Nhật "
  } else {
    prefix_text.value = "Thêm Mới "
  }

  // Get master screen
  getMasterScreen()

  // Get role detail
  getRoleDetail()
})
</script>
