<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between mb-4">
        <button @click="back" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md min-w-[120px]">
          Quay lại
        </button>
        <button @click="save" :disabled="saving" class="text-white px-6 py-2 rounded-md min-w-[120px]"
          :class="saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-success-500 hover:bg-success-600'">
          Lưu
        </button>
      </div>
      <h4 class="text-2xl font-bold text-center text-gray-800 mb-4">Khu Vực Chế Biến</h4>
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
            <input id="name" type="text" maxlength="255" autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              v-model="inputs.name" :class="{ 'border-red-500': errorName }" />
            <p v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên</p>
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
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const inputs = ref({ id: null, name: null })
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

const errorName = computed(() => click.value && (inputs.value.name == null || inputs.value.name.length <= 0))
const checkValidate = () => !errorName.value

const getKitchenAreaDetail = () => {
  let id = route.params.id
  if (id) {
    loading.value = true
    adminAPI.getKitchenAreaDetail(id).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        inputs.value = res.data.data
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
  click.value = true
  saving.value = true
  if (!checkValidate()) {
    saving.value = false
    return
  }
  let id = route.params.id
  if (id) {
    adminAPI.editKitchenArea(inputs.value).then(res => {
      saving.value = false
      if (res != null && res.data != null && res.data.status == 200) {
        toast.success('Cập nhật khu bếp thành công!!!')
      }
    }).catch(err => {
      saving.value = false
      let errorMess = commonFunc.handleStaffError(err)
      toast.error(errorMess)
    })
  } else {
    adminAPI.addKitchenArea(inputs.value).then(res => {
      saving.value = false
      if (res != null && res.data != null && res.data.status == 200) {
        router.push('/kitchen-area/list')
      }
    }).catch(err => {
      saving.value = false
      let errorMess = commonFunc.handleStaffError(err)
      toast.error(errorMess)
    })
  }
}

const back = () => {
  router.push('/kitchen-area/list')
}

onMounted(() => {
  getKitchenAreaDetail()
})
</script>
