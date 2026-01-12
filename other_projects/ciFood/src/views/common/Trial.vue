<template>
  <div class="container-fluid mx-auto px-4 py-6">
    <div class="flex justify-center">
      <div class="w-full md:w-2/3">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Ký Dùng Thử</h1>

          <form @submit.prevent="update">
            <!-- Tên nhà hàng -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                Tên nhà hàng:
                <span class="text-red-500">*</span>
              </label>
              <input
                id="store_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                v-model="store.store_name"
                maxlength="100"
                :class="{ 'border-red-500': errorStoreName }"
              />
              <p v-if="errorStoreName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên nhà hàng
              </p>
            </div>

            <!-- Tên chủ quán -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                Tên chủ quán:
                <span class="text-red-500">*</span>
              </label>
              <input
                id="user_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                v-model="store.user_name"
                maxlength="100"
                :class="{ 'border-red-500': errorUserName }"
              />
              <p v-if="errorUserName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên chủ quán
              </p>
            </div>

            <!-- Số điện thoại -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                Số điện thoại:
                <span class="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                v-model="store.phone_number"
                maxlength="12"
                @keyup="integerOnly($event.target)"
                @change="checkPhoneNumberFormat($event.target)"
                :class="{ 'border-red-500': errorPhoneNumber || !phoneNumberCheckFlag }"
              />
              <p v-if="errorPhoneNumber" class="text-red-500 text-sm mt-1">
                Vui lòng nhập số điện thoại
              </p>
              <p v-if="!phoneNumberCheckFlag" class="text-red-500 text-sm mt-1">
                Số điện thoại không đúng
              </p>
            </div>

            <!-- Tỉnh/Thành phố -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                Tỉnh/Thành phố:
                <span class="text-red-500">*</span>
              </label>
              <select
                id="city_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                v-model="store.city_id"
                @change="changeCity"
                :class="{ 'border-red-500': errorCiti }"
              >
                <option v-for="option in optionsCity" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <p v-if="errorCiti" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tỉnh/thành phố
              </p>
            </div>

            <!-- Quận/Huyện -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                Quận/Huyện:
                <span class="text-red-500">*</span>
              </label>
              <select
                id="district"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                v-model="store.district_id"
                :disabled="!store.city_id"
                :class="{ 'border-red-500': errorDistrict, 'bg-gray-100': !store.city_id }"
              >
                <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <p v-if="errorDistrict" class="text-red-500 text-sm mt-1">
                Vui lòng nhập quận/huyện
              </p>
            </div>

            <!-- Địa chỉ -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                Địa chỉ:
                <span class="text-red-500">*</span>
              </label>
              <input
                id="address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                v-model="store.address"
                :class="{ 'border-red-500': errorAddress }"
              />
              <p v-if="errorAddress" class="text-red-500 text-sm mt-1">
                Vui lòng nhập địa chỉ
              </p>
            </div>

            <!-- Loại hình kinh doanh -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                Loại hình kinh doanh:
              </label>
              <input
                id="type"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                v-model="store.type"
                placeholder="Cafe, trà sữa, quán ăn, ...."
              />
            </div>

            <!-- Mã voucher -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                Mã voucher:
              </label>
              <input
                id="voucherCode"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                v-model="store.voucher_code"
                maxlength="10"
              />
            </div>

            <p class="text-sm text-gray-600 mb-4">
              **Cảm ơn bạn đã quan tâm sản phẩm của chúng tôi. Thời hạn dùng thử là 15 ngày
              (Nếu không có mã voucher). Chúng tôi sẽ liên hệ với bạn ngay để hướng dẫn chi tiết hơn.
              Xin chân thành cảm ơn!
            </p>

            <!-- Submit button -->
            <div class="text-center">
              <button
                type="submit"
                :disabled="onUpdate"
                class="px-8 py-2 rounded-md text-white font-semibold transition-colors"
                :class="onUpdate ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600'"
              >
                {{ onUpdate ? "Đăng ký..." : "Đăng ký" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận đăng ký thành công -->
    <TransitionRoot :show="showConfirmModal" as="template">
      <Dialog as="div" class="relative z-50" @close="showConfirmModal = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <DialogTitle class="text-xl font-bold text-center text-gray-800 mb-4">
                  Đăng Ký thành công!!!
                </DialogTitle>

                <div class="mb-4">
                  <p class="mb-2">Thông tin đăng nhập:</p>
                  <p class="pl-5 mb-1">Số điện thoại: {{ phone_number_signup }}</p>
                  <p class="pl-5">Mật khẩu: {{ phone_number_signup }}</p>
                </div>

                <p class="text-red-600 text-sm mb-4">
                  **Phía trên là thông tin đăng nhập của bạn, bạn hãy ghi nhớ trước khi xác nhận.
                </p>

                <div class="text-right">
                  <button
                    class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md"
                    @click="confirmInfoSignup"
                  >
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { useToast } from 'vue-toastification'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import AuthenticationAPI from '@/api/authentication'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const store = ref({
  store_name: null,
  user_name: null,
  phone_number: null,
  city_id: null,
  district_id: null,
  address: null,
  type: null,
  voucher_code: null
})

const optionsCity = ref([])
const optionsDistrict = ref([])
const phoneNumberCheckFlag = ref(true)
const click = ref(false)
const onUpdate = ref(false)
const phone_number_signup = ref(null)
const showConfirmModal = ref(false)

// Computed properties for validation
const errorStoreName = computed(() => {
  return checkInfo(store.value.store_name)
})

const errorUserName = computed(() => {
  return checkInfo(store.value.user_name)
})

const errorPhoneNumber = computed(() => {
  return checkInfo(store.value.phone_number)
})

const errorCiti = computed(() => {
  return checkInfo(store.value.city_id)
})

const errorDistrict = computed(() => {
  return checkInfo(store.value.district_id)
})

const errorAddress = computed(() => {
  return checkInfo(store.value.address)
})

// Methods
const checkInfo = (info) => {
  return click.value && (info == null || info.length <= 0)
}

const checkValidate = () => {
  return !(errorStoreName.value || errorUserName.value || errorPhoneNumber.value ||
           errorCiti.value || errorDistrict.value || errorAddress.value)
}

const getOptionCity = () => {
  MasterApi.getCityOptions().then(res => {
    optionsCity.value = MasterMapper.mapCityModelToDto(res.data.data)
    changeCity()
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    toast.error(errorMess)
  })
}

const changeCity = () => {
  let cityId = store.value.city_id
  if (cityId != "" && cityId != undefined) {
    MasterApi.getDistrictOptions(cityId).then(res => {
      optionsDistrict.value = MasterMapper.mapCityModelToDto(res.data.data)
    })
  } else {
    store.value.district_id = ""
  }
}

const update = () => {
  if (onUpdate.value == true) {
    return
  }

  click.value = true
  let result = checkValidate()
  if (result) {
    onUpdate.value = true

    AuthenticationAPI.signUpTrial(store.value).then(res => {
      if (res && res.data && res.data.status == 200) {
        phone_number_signup.value = res.data.data.phone_number
        showConfirmModal.value = true
      }
      onUpdate.value = false
    }).catch(err => {
      onUpdate.value = false

      let message = ""
      if (err.response.data.status == 422) {
        message = err.response.data.mess
      } else {
        message = "Lỗi hệ thống"
      }
      toast.error(message)
    })
  }
}

const confirmInfoSignup = () => {
  authStore.removeToken()
  showConfirmModal.value = false
  router.push('/staff-login')
}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result

  if (valueInput.length == 10) {
    if (commonFunc.phoneNumberCheck(valueInput)) {
      phoneNumberCheckFlag.value = true
    } else {
      phoneNumberCheckFlag.value = false
    }
  }
}

const checkPhoneNumberFormat = (item) => {
  let valueInput = item.value
  if (valueInput != null && valueInput != "") {
    if (commonFunc.phoneNumberCheck(valueInput)) {
      phoneNumberCheckFlag.value = true
    } else {
      phoneNumberCheckFlag.value = false
    }
  } else {
    phoneNumberCheckFlag.value = true
  }
}

onMounted(() => {
  getOptionCity()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
