<template>
  <div id="topping-index">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md">
        <div class="border-b border-gray-200 px-6 py-4">
          <div class="flex justify-between items-center">
            <button
              @click="back"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Quay lại
            </button>
            <h2 class="text-xl font-semibold text-gray-800">Topping</h2>
            <button
              @click="save"
              :disabled="saving"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400">
              Lưu
            </button>
          </div>
        </div>
        <div class="p-6">

          <!-- Loading -->
          <div v-if="loading" class="text-center mt-3">
            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
          </div>

          <div v-else class="space-y-4">
            <!-- Name -->
            <div class="grid grid-cols-12 gap-4 items-start">
              <label class="col-span-2 text-sm font-medium text-gray-700 mt-2">Tên<span class="text-red-600">*</span></label>
              <div class="col-span-10">
                <input
                  type="text"
                  maxlength="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="topping.name">
                <div v-if="errorName" class="text-red-600 text-xs mt-1">Đây là mục bắt buộc nhập</div>
              </div>
            </div>

            <!-- Price -->
            <div class="grid grid-cols-12 gap-4 items-start">
              <label class="col-span-2 text-sm font-medium text-gray-700 mt-2">Giá<span class="text-red-600">*</span></label>
              <div class="col-span-10">
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="topping.price"
                  @keyup="intergerOnly($event.target)">
                <div v-if="errorPrice" class="text-red-600 text-xs mt-1">Đây là mục bắt buộc nhập</div>
              </div>
            </div>

            <!-- Status (only show when editing) -->
            <div v-if="$route.params.id" class="grid grid-cols-12 gap-4 items-start">
              <label class="col-span-2 text-sm font-medium text-gray-700 mt-2">Trạng Thái<span class="text-red-600">*</span></label>
              <div class="col-span-10">
                <select
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="topping.status">
                  <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
                </select>
              </div>
            </div>

            <!-- Resources -->
            <div class="grid grid-cols-12 gap-4 items-start">
              <label class="col-span-2 text-sm font-medium text-gray-700 mt-2">Nguyên liệu</label>
              <div class="col-span-10">
                <button
                  @click="showModalResource"
                  class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>

    <!-- Modal choose resource -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center">
                  Chọn nguyên liệu
                </DialogTitle>

                <!-- Resource chosen list -->
                <div v-if="resourceChosen.length > 0" class="mt-4">
                  <div v-for="item in resourceChosen" :key="item.id" class="flex justify-between items-center py-2 border-b">
                    <span v-if="item.unit" class="text-sm text-gray-700">- {{ item.quantity + ' ' + item.unit + ': ' + item.name }}</span>
                    <span v-else class="text-sm text-gray-700">- {{ item.quantity + ': ' + item.name }}</span>
                    <button @click="deleteResource(item.id)" class="text-red-600 hover:text-red-800">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- Add resource form -->
                <div class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Nguyên liệu:<span class="text-red-600">*</span></label>
                    <select
                      v-model="resource.id"
                      @change="changeResource"
                      class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option v-for="option in resources" :key="option.value" :value="option.value">{{ option.text }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Số lượng<span class="text-red-600">*</span></label>
                    <div class="flex items-center gap-2">
                      <input
                        type="text"
                        maxlength="11"
                        v-model="resource.quantity"
                        @keyup="integerOnly($event.target)"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <span class="text-sm text-gray-600">{{ unitResource }}</span>
                    </div>
                  </div>

                  <div class="text-center">
                    <button
                      @click="addGroupResource"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Thêm
                    </button>
                  </div>
                </div>

                <div class="mt-6 text-right">
                  <button
                    @click="confirmResource"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Xác nhận
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/topping'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const options = ref([
  { value: 'false', text: 'Hết món' },
  { value: 'true', text: 'Còn món' }
])

const topping = ref({
  id: null,
  name: null,
  price: null,
  status: null,
  resource: null
})

const click = ref(false)
const saving = ref(false)
const loading = ref(false)
const resources = ref([{ value: null, text: '' }])
const resourceChosen = ref([])
const unitResource = ref(null)
const resource = ref({ id: '', quantity: '' })
const isModalOpen = ref(false)

const errorName = computed(() => {
  return checkInfo(topping.value.name)
})

const errorPrice = computed(() => {
  return checkInfo(topping.value.price)
})

onMounted(() => {
  getToppingDetail()
  // Load option resource
  getResourceOptions()
})

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorName.value || errorPrice.value)
}

/**
 * Load list option resource
 */
const getResourceOptions = () => {
  adminAPI.getListResourceOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      resources.value = res.data.data
    }
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'error')
  })
}

/**
 * Get topping detail
 */
const getToppingDetail = () => {
  let toppingId = route.params.id
  if (toppingId) {
    loading.value = true

    adminAPI.getToppingDetail(toppingId).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        topping.value = res.data.data

        try {
          resourceChosen.value = JSON.parse(topping.value.resource)
        } catch (e) {
          resourceChosen.value = []
        }
      }

      loading.value = false
    }).catch(err => {
      loading.value = false

      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      showToast(errorMess, 'error')
    })
  }
}

/**
 * Save
 */
const save = () => {
  saving.value = true
  click.value = true
  let result = checkValidate()
  if (result) {
    let toppingId = route.params.id
    topping.value.resource = JSON.stringify(resourceChosen.value)
    if (toppingId) {
      // Edit
      adminAPI.updateTopping(topping.value).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          showToast('Cập nhật topping thành công!!!', 'success')
        } else {
          showToast('Có lỗi xảy ra, bạn thử lại sau nhé', 'error')
        }
      }).catch(err => {
        saving.value = false
        let message = ''
        if (err.response.data.status == 500) {
          message = 'Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé'
        } else {
          message = err.response.data.mess
        }
        showToast(message, 'error')
      })
    } else {
      // Add
      adminAPI.addTopping(topping.value).then(res => {
        saving.value = false
        if (res != null && res.data != null) {
          // Go to list
          router.push('/topping/list')
        } else {
          showToast('Có lỗi xảy ra, bạn thử lại nhé', 'error')
        }
      }).catch(err => {
        saving.value = false
        let message = ''
        if (err.response.data.status == 500) {
          message = 'Lỗi hệ thống, chúng tôi rất tiếc về sự cố này, bạn thử lại sau vài phút nhé'
        } else {
          message = err.response.data.mess
        }
        showToast(message, 'error')
      })
    }
  } else {
    saving.value = false
  }
}

/**
 * Event change resource
 */
const changeResource = () => {
  if (resource.value.id) {
    let item = getUnitByResourceId(resource.value.id)
    if (item) {
      unitResource.value = item.unit
    }
  }
}

/**
 * Show modal choose resource
 */
const showModalResource = () => {
  isModalOpen.value = true
}

/**
 * Close modal
 */
const closeModal = () => {
  isModalOpen.value = false
}

/**
 * Check exist resource id
 */
const checkExistResourceId = (id) => {
  for (let index in resourceChosen.value) {
    if (resourceChosen.value[index].id == id) {
      return true
    }
  }
  return false
}

/**
 * Get unit by resource id
 */
const getUnitByResourceId = (id) => {
  for (let index in resources.value) {
    if (resources.value[index].value == id) {
      return resources.value[index]
    }
  }
  return ''
}

/**
 * Add group resource
 */
const addGroupResource = () => {
  if (resource.value.id && resource.value.quantity) {
    // Check exist resource id
    if (!checkExistResourceId(resource.value.id)) {
      let item = getUnitByResourceId(resource.value.id)
      let itemTemp = {
        id: item.value,
        name: item.text,
        quantity: resource.value.quantity,
        unit: item.unit
      }
      resourceChosen.value.push(itemTemp)

      // Reset value
      resource.value.id = ''
      resource.value.quantity = ''
      unitResource.value = ''
    } else {
      showToast('Nhập trùng nguyên liệu', 'error')
    }
  } else {
    showToast('Vui lòng nhập đủ các mục yêu cầu', 'error')
  }
}

/**
 * Confirm resource
 */
const confirmResource = () => {
  closeModal()
}

/**
 * Get index by id
 */
const getIndexById = (id) => {
  let index = 0
  for (var i in resourceChosen.value) {
    if (resourceChosen.value[i].id == id) {
      return index
    }
    index += 1
  }
  return false
}

/**
 * Remove resource
 */
const deleteResource = (id) => {
  // Get index pmt by id
  let indexTemp = getIndexById(id)

  if (indexTemp !== false) {
    resourceChosen.value.splice(indexTemp, 1)
  }
}

/**
 * Only input integer
 */
const intergerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

/**
 * Back to list
 */
const back = () => {
  // Go to list
  router.push('/topping/list')
}
</script>

<style lang="css" scoped>
</style>
