<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between mb-4">
        <button
          @click="back"
          class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md min-w-[120px]"
        >
          Quay lại
        </button>
        <button
          @click="save"
          :disabled="saving"
          class="text-white px-6 py-2 rounded-md min-w-[120px]"
          :class="saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-success-500 hover:bg-success-600'"
        >
          Lưu
        </button>
      </div>

      <h4 class="text-2xl font-bold text-center text-gray-800 mb-4">Danh Mục</h4>
      <hr class="mb-6" />

      <div v-if="loading" class="text-center py-8">
        <font-awesome-icon icon="spinner" spin class="text-4xl text-primary-500" />
      </div>

      <div v-else class="max-w-2xl mx-auto">
        <div class="grid grid-cols-12 gap-4 mb-4">
          <label class="col-span-12 md:col-span-3 flex items-center text-gray-700">
            Tên <span class="text-red-500 ml-1">*</span>
          </label>
          <div class="col-span-12 md:col-span-9">
            <input
              id="name"
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              v-model="groupMenu.name"
              :class="{ 'border-red-500': errorName }"
            />
            <p v-if="errorName" class="text-red-500 text-sm mt-1">
              Đây là mục bắt buộc nhập
            </p>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <label class="col-span-12 md:col-span-3 flex items-center text-gray-700">
            Thứ tự xuất hiện <span class="text-red-500 ml-1">*</span>
          </label>
          <div class="col-span-12 md:col-span-9">
            <input
              id="index"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              v-model="groupMenu.index"
              @keyup="intergerOnly($event.target)"
              maxlength="3"
              placeholder="1"
              :class="{ 'border-red-500': errorIndex }"
            />
            <p v-if="errorIndex" class="text-red-500 text-sm mt-1">
              Đây là mục bắt buộc nhập
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/group_menu'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const groupMenu = ref({
  id: null,
  name: null,
  index: null
})

const click = ref(false)
const saving = ref(false)
const loading = ref(false)

const errorName = computed(() => {
  return click.value && (groupMenu.value.name == null || groupMenu.value.name.length <= 0)
})

const errorIndex = computed(() => {
  return click.value && (groupMenu.value.index == null || groupMenu.value.index.length <= 0)
})

const checkValidate = () => {
  return !(errorName.value || errorIndex.value)
}

const getGroupMenuDetail = () => {
  let groupMenuId = route.params.id
  if (groupMenuId) {
    loading.value = true

    adminAPI.getGroupMenuDetail(groupMenuId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        groupMenu.value = Mapper.mapGroupMenuDetailModelToDto(res.data.data)
      }
      loading.value = false
    }).catch(err => {
      loading.value = false
      let errorMess = commonFunc.handleStaffError(err)
      toast.error(errorMess)
    })
  }
}

const save = () => {
  saving.value = true
  click.value = true
  let result = checkValidate()
  
  if (result) {
    let groupMenuId = route.params.id
    if (groupMenuId) {
      // Edit
      adminAPI.updateGroupMenu(groupMenu.value).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          toast.success('Cập nhật nhóm menu thành công!!!')
        } else {
          toast.error('Có lỗi xảy ra, bạn thử lại sau nhé')
        }
      }).catch(err => {
        saving.value = false
        let message = ""
        if (err.response.data.status == 500) {
          message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
        } else {
          message = err.response.data.mess
        }
        toast.error(message)
      })
    } else {
      // Add
      adminAPI.addGroupMenu(groupMenu.value).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          router.push('/group-menu/list')
        } else {
          toast.error('Có lỗi xảy ra, bạn thử lại nhé')
        }
      }).catch(err => {
        saving.value = false
        let message = ""
        if (err.response.data.status == 500) {
          message = "Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé"
        } else {
          message = err.response.data.mess
        }
        toast.error(message)
      })
    }
  } else {
    saving.value = false
  }
}

const intergerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const back = () => {
  router.push('/group-menu/list')
}

onMounted(() => {
  getGroupMenuDetail()
})
</script>
