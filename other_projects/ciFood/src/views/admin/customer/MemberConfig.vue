<template>
  <div class="container-fluid mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Save Button -->
      <div class="flex justify-end mb-4">
        <button
          @click="save"
          :disabled="saving"
          class="px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lưu
        </button>
      </div>

      <!-- Title -->
      <h4 class="text-2xl font-semibold text-center mb-4">Thiết Lập Ưu Đãi</h4>
      <hr class="mb-6">

      <!-- Loading -->
      <div v-show="loading" class="text-center mb-4">
        <i class="fa fa-spinner fa-spin text-2xl text-blue-600"></i>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Point Expiration -->
        <div>
          <label class="block text-sm font-medium mb-2">
            Số điểm của khách hàng sẽ hết hạn sau<span class="text-red-500">*</span>
          </label>
          <div class="flex items-center gap-2">
            <input
              id="point_expire"
              type="text"
              autocomplete="new-password"
              class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errorExpireDay, 'border-gray-300': !errorExpireDay}"
              v-model="setting.pmtExpire.value"
              @keyup="integerOnly($event.target)"
              maxlength="11"
            >
            <span class="text-gray-600">Ngày</span>
          </div>
          <p v-if="errorExpireDay" class="text-red-500 text-sm mt-1">Vui lòng nhập số ngày</p>
        </div>

        <!-- Discount by Money -->
        <div>
          <label class="block text-sm font-medium mb-2">
            Áp dụng khuyến mãi theo số tiền tích lũy<span class="text-red-500">*</span>
          </label>
          <div class="flex items-center gap-8">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="setting.discountByMoney.value"
                name="discountByMoney"
                value="true"
                @change="changeDiscountByMoney"
                class="mr-2"
              >
              <span>Có</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="setting.discountByMoney.value"
                name="discountByMoney"
                value="false"
                @change="changeDiscountByMoney"
                class="mr-2"
              >
              <span>Không</span>
            </label>
          </div>
          <p v-if="errorDiscountByMoney" class="text-red-500 text-sm mt-1">Vui lòng chọn một tùy chọn</p>
        </div>

        <!-- Discount List (conditionally shown) -->
        <div v-show="setting.discountByMoney.value == 'true'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Input Section -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                Số tiền tích lũy<span class="text-red-500">*</span>
              </label>
              <input
                id="money"
                v-model="inputs.money"
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxlength="11"
                @keyup="integerOnly($event.target)"
              >
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Phần trăm giảm giá<span class="text-red-500">*</span>
              </label>
              <input
                id="discount_percent"
                v-model="inputs.discountPercent"
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxlength="3"
                @keyup="integerOnly($event.target)"
              >
            </div>

            <div class="flex justify-center">
              <button
                @click="addListDiscount"
                :disabled="saving"
                class="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm
              </button>
            </div>
          </div>

          <!-- Display Section -->
          <div class="space-y-2">
            <p v-for="(item, index) in setting.listDiscount" :key="index" class="text-sm">
              Tích lũy: <span class="font-semibold">{{ formatters.formatCurrency(item.code) }}</span> vnđ,
              Giảm giá: <span class="font-semibold">{{ item.value }}</span> %
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/setting'
import commonFunc from '@/common/commonFunc'

const { popToast } = useToast()
const formatters = useFormatters()

const setting = ref({
  pmtExpire: {
    "id": null,
    "code": "expired_point",
    "value": 30
  },
  discountByMoney: {
    "id": null,
    "code": "discount_by_money",
    "value": "false"
  },
  listDiscount: []
})

const inputs = ref({
  money: null,
  discountPercent: null
})

const click = ref(false)
const saving = ref(false)
const loading = ref(false)

const errorExpireDay = computed(() => checkInfo(setting.value.pmtExpire.value))
const errorDiscountByMoney = computed(() => checkInfo(setting.value.discountByMoney.value))

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorExpireDay.value || errorDiscountByMoney.value)
}

/**
 * Event change discount by money
 */
const changeDiscountByMoney = () => {
  if (setting.value.discountByMoney.value == 'false') {
    setting.value.listDiscount = []
  }
}

/**
 * Save
 */
const save = () => {
  click.value = true
  saving.value = true
  let result = checkValidate()
  if (result) {
    adminAPI.saveMemberConfig(setting.value).then(res => {
      saving.value = false
      if (res != null && res.data != null) {
        if (res.data.status == 200) {
          popToast('success', 'Cập nhật cài đặt thành công!!!')
        }
      }
    }).catch(err => {
      saving.value = false
      popToast('danger', 'Lỗi hệ thống')
    })
  } else {
    saving.value = false
  }
}

/**
 * Get member config
 */
const getMemberConfig = () => {
  loading.value = true

  adminAPI.getMemberConfig().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      setting.value = Mapper.mapMemberConfigModelToDto(res.data.data)
    }
    loading.value = false
  }).catch(err => {
    console.log(err)
    loading.value = false

    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Add list discount
 */
const addListDiscount = () => {
  if (inputs.value.money && inputs.value.discountPercent) {
    let item = {
      code: inputs.value.money,
      value: inputs.value.discountPercent,
      group: 'list_discount'
    }
    setting.value.listDiscount.push(item)

    inputs.value.money = null
    inputs.value.discountPercent = null
  } else {
    popToast('danger', "Vui lòng nhập đủ thông tin")
  }
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

onMounted(() => {
  getMemberConfig()
})
</script>
