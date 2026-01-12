<template>
  <div class="container">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving"
            @click="save">
            Lưu
          </button>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Khuyến Mãi</h4>
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
            <div class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Phương thức <span class="text-red-600">*</span></label>
              <select
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorMethod ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.method">
                <option value="other" @click="setMethodIsOther">Khác</option>
                <option value="trade_point" @click="setMethodIsTradePoint">Đổi điểm</option>
              </select>
              <p v-if="errorMethod" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <div class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Mã</label>
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="promo.code">
            </div>

            <div class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Tên <span class="text-red-600">*</span></label>
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorName ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.name">
              <p v-if="errorName" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <div class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Loại <span class="text-red-600">*</span></label>
              <select
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorType ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.type">
                <option v-for="option in typeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
              <p v-if="errorType" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <!-- Discount percent (for discount types) -->
            <div v-if="promo.type === 'discount' || promo.type === 'discount_with_max_value' || promo.type === 'discount_on_item'" class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">% giảm giá <span class="text-red-600">*</span></label>
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorPercentDiscount ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.discount_percent"
                maxlength="3"
                @keyup="integerOnly($event.target)">
              <p v-if="errorPercentDiscount" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <!-- Max discount (for discount_with_max_value) -->
            <div v-if="promo.type === 'discount_with_max_value'" class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Giảm giá tối đa <span class="text-red-600">*</span></label>
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorMaxDiscount ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.max_discount"
                maxlength="11"
                @keyup="integerOnly($event.target)">
              <p v-if="errorMaxDiscount" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <!-- Discount on amount (for discount_with_max_value) -->
            <div v-if="promo.type === 'discount_with_max_value'" class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Trên tổng giá <span class="text-red-600">*</span></label>
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorDiscountOnAmount ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.discount_on_amount"
                maxlength="11"
                @keyup="integerOnly($event.target)">
              <p v-if="errorDiscountOnAmount" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <!-- Value of voucher (for voucher type) -->
            <div v-if="promo.type === 'voucher'" class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Giá trị voucher <span class="text-red-600">*</span></label>
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorValueOfVoucher ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.value_of_voucher"
                maxlength="11"
                @keyup="integerOnly($event.target)">
              <p v-if="errorValueOfVoucher" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <!-- Free item (for free_item type) -->
            <div v-if="promo.type === 'free_item'" class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Item free <span class="text-red-600">*</span></label>
              <select
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorFreeItem ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.item_free">
                <option v-for="option in itemFreeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
              </select>
              <p v-if="errorFreeItem" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <!-- Cost (for trade_point method) -->
            <div v-if="promo.method === 'trade_point'" class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Giá(điểm) <span class="text-red-600">*</span></label>
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorCost ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.cost"
                maxlength="11"
                @keyup="integerOnly($event.target)">
              <p v-if="errorCost" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <!-- Date range -->
            <div class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Ngày bắt đầu hiệu lực <span class="text-red-600">*</span></label>
              <input
                type="text"
                placeholder="DD-MM-YYYY"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorExpiredDateFrom ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.expired_date_from"
                maxlength="10"
                @keyup="inputDateOnly($event.target)">
              <p v-if="errorExpiredDateFrom" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin (DD-MM-YYYY)</p>
            </div>

            <div class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Ngày hết hiệu lực <span class="text-red-600">*</span></label>
              <input
                type="text"
                placeholder="DD-MM-YYYY"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorExpiredDateTo ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.expired_date_to"
                maxlength="10"
                @keyup="inputDateOnly($event.target)">
              <p v-if="errorExpiredDateTo" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin (DD-MM-YYYY)</p>
            </div>

            <!-- Quantity -->
            <div class="col-span-12 md:col-span-6">
              <label class="block mb-2 font-medium">Số lượng <span class="text-red-600">*</span></label>
              <input
                type="text"
                autocomplete="new-password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errorQuantity ? 'border-red-500' : 'border-gray-300'"
                v-model="promo.quantity"
                maxlength="11"
                @keyup="integerOnly($event.target)">
              <p v-if="errorQuantity" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
            </div>

            <!-- Auto apply section (only for method='other') -->
            <template v-if="promo.method === 'other'">
              <div class="col-span-12">
                <hr class="my-4"/>
                <h5 class="text-lg font-semibold mb-4">Tự động áp dụng</h5>
              </div>

              <div class="col-span-12 md:col-span-6">
                <label class="block mb-2 font-medium">Tự động áp dụng</label>
                <div class="flex items-center space-x-4">
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      class="form-radio h-4 w-4 text-blue-600"
                      :value="true"
                      v-model="promo.auto_apply">
                    <span class="ml-2">Có</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      class="form-radio h-4 w-4 text-blue-600"
                      :value="false"
                      v-model="promo.auto_apply">
                    <span class="ml-2">Không</span>
                  </label>
                </div>
              </div>

              <!-- Day of week checkboxes (only if auto_apply is true) -->
              <div v-if="promo.auto_apply" class="col-span-12">
                <label class="block mb-2 font-medium">Ngày trong tuần</label>
                <div class="flex flex-wrap gap-4">
                  <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" value="1" v-model="promo.day_of_week">
                    <span class="ml-2">Thứ 2</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" value="2" v-model="promo.day_of_week">
                    <span class="ml-2">Thứ 3</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" value="3" v-model="promo.day_of_week">
                    <span class="ml-2">Thứ 4</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" value="4" v-model="promo.day_of_week">
                    <span class="ml-2">Thứ 5</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" value="5" v-model="promo.day_of_week">
                    <span class="ml-2">Thứ 6</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" value="6" v-model="promo.day_of_week">
                    <span class="ml-2">Thứ 7</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" value="7" v-model="promo.day_of_week">
                    <span class="ml-2">Chủ nhật</span>
                  </label>
                </div>
              </div>

              <!-- Time range (only if auto_apply is true) -->
              <div v-if="promo.auto_apply" class="col-span-12 md:col-span-6">
                <label class="block mb-2 font-medium">Giờ bắt đầu (HH:MM)</label>
                <input
                  type="text"
                  placeholder="HH:MM"
                  autocomplete="new-password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="promo.start_time"
                  maxlength="5"
                  @keyup="integerTimeOnly($event.target)">
              </div>

              <div v-if="promo.auto_apply" class="col-span-12 md:col-span-6">
                <label class="block mb-2 font-medium">Giờ kết thúc (HH:MM)</label>
                <input
                  type="text"
                  placeholder="HH:MM"
                  autocomplete="new-password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="promo.end_time"
                  maxlength="5"
                  @keyup="integerTimeOnly($event.target)">
              </div>
            </template>

            <!-- Discount on items checkboxes (for discount_on_item type) -->
            <div v-if="promo.type === 'discount_on_item'" class="col-span-12">
              <hr class="my-4"/>
              <label class="block mb-2 font-medium">Chọn món ăn áp dụng giảm giá</label>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <label v-for="item in itemFood" :key="item.value" class="inline-flex items-center">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" :value="item.value" v-model="promo.on_items">
                  <span class="ml-2">{{ item.text }}</span>
                </label>
              </div>
            </div>

            <!-- Description -->
            <div class="col-span-12">
              <label class="block mb-2 font-medium">Mô tả</label>
              <textarea
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="promo.description">
              </textarea>
            </div>

            <!-- Image upload with cropper -->
            <div class="col-span-12">
              <label class="block mb-2 font-medium">Hình ảnh</label>
              <div class="flex items-center space-x-4 mb-2">
                <input
                  type="text"
                  readonly
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  v-model="promo.image"
                  placeholder="Chọn hình ảnh">
                <button
                  type="button"
                  class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  @click="$refs.file.click()">
                  Browse
                </button>
              </div>
              <input
                class="hidden"
                type="file"
                ref="file"
                accept="image/*"
                @change="handleFileUpload">

              <!-- Image preview with cropper -->
              <div v-if="promo.image_preview" class="mt-4">
                <vue-cropper
                  ref="cropper"
                  :src="promo.image_preview"
                  :aspect-ratio="1"
                  :view-mode="1"
                  :auto-crop-area="1"
                  :background="false"
                  :rotatable="false"
                  :scalable="false"
                  :zoomable="false"
                  @crop="cropImage"
                  class="max-w-md mx-auto"
                  :style="{maxWidth: '100%', maxHeight: '300px'}">
                </vue-cropper>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-2">
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
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const promo = ref({
  id: null,
  code: null,
  method: "other",
  name: null,
  type: null,
  discount_percent: null,
  max_discount: null,
  discount_on_amount: null,
  value_of_voucher: null,
  item_free: null,
  on_items: [],
  cost: null,
  expired_date_from: null,
  expired_date_to: null,
  quantity: null,
  auto_apply: false,
  day_of_week: [],
  start_time: "00:00",
  end_time: "23:59",
  description: null,
  image: null,
  image_preview: null
})

const typeOptions = ref([{value: null, text: ''}])
const itemFreeOptions = ref([{value: null, text: ''}])
const itemFood = ref([])
const file = ref(null)
const click = ref(false)
const saving = ref(false)
const loading = ref(false)
const cropper = ref(null)

const errorMethod = computed(() => click.value && (promo.value.method == null || promo.value.method.length <= 0))
const errorName = computed(() => click.value && (promo.value.name == null || promo.value.name.length <= 0))
const errorType = computed(() => click.value && (promo.value.type == null || promo.value.type.length <= 0))
const errorPercentDiscount = computed(() => {
  return click.value &&
    (promo.value.type === 'discount' || promo.value.type === 'discount_with_max_value' || promo.value.type === 'discount_on_item') &&
    (promo.value.discount_percent == null || promo.value.discount_percent.length <= 0)
})
const errorMaxDiscount = computed(() => {
  return click.value && promo.value.type === 'discount_with_max_value' &&
    (promo.value.max_discount == null || promo.value.max_discount.length <= 0)
})
const errorDiscountOnAmount = computed(() => {
  return click.value && promo.value.type === 'discount_with_max_value' &&
    (promo.value.discount_on_amount == null || promo.value.discount_on_amount.length <= 0)
})
const errorValueOfVoucher = computed(() => {
  return click.value && promo.value.type === 'voucher' &&
    (promo.value.value_of_voucher == null || promo.value.value_of_voucher.length <= 0)
})
const errorFreeItem = computed(() => {
  return click.value && promo.value.type === 'free_item' &&
    (promo.value.item_free == null || promo.value.item_free.length <= 0)
})
const errorCost = computed(() => {
  return click.value && promo.value.method === 'trade_point' &&
    (promo.value.cost == null || promo.value.cost.length <= 0)
})
const errorExpiredDateFrom = computed(() => {
  return click.value && (promo.value.expired_date_from === "" || promo.value.expired_date_from == null ||
    commonFunc.dateFormatCheck(promo.value.expired_date_from) === false)
})
const errorExpiredDateTo = computed(() => {
  return click.value && (promo.value.expired_date_to === "" || promo.value.expired_date_to == null ||
    commonFunc.dateFormatCheck(promo.value.expired_date_to) === false)
})
const errorQuantity = computed(() => click.value && (promo.value.quantity == null || promo.value.quantity.length <= 0))

const checkValidate = () => {
  return !(errorMethod.value || errorName.value || errorType.value || errorCost.value ||
    errorExpiredDateFrom.value || errorExpiredDateTo.value || errorQuantity.value ||
    errorPercentDiscount.value || errorMaxDiscount.value || errorDiscountOnAmount.value ||
    errorValueOfVoucher.value || errorFreeItem.value)
}

const getDefaultDate = () => {
  const dateNow = new Date()
  promo.value.expired_date_from = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
  const todate = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
  promo.value.expired_date_to = commonFunc.formatDate(todate.toJSON().slice(0,10))
}

const getPromotionTypeList = async () => {
  try {
    const res = await adminAPI.getListPromotionType()
    if (res != null && res.data != null && res.data.data != null) {
      typeOptions.value = typeOptions.value.concat(res.data.data)
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

const getListItemFree = async () => {
  try {
    const res = await adminAPI.getListFreeItem()
    if (res != null && res.data != null && res.data.data != null) {
      itemFreeOptions.value = itemFreeOptions.value.concat(res.data.data)
      itemFood.value = res.data.data
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

const getPromoDetail = async () => {
  const promoId = route.params.id
  if (promoId) {
    loading.value = true

    try {
      const res = await adminAPI.getPromoDetail(promoId)
      if (res != null && res.data != null && res.data.data != null) {
        promo.value = res.data.data

        if (promo.value.day_of_week) {
          // Convert string to array
          let itemString = JSON.parse(JSON.stringify(promo.value.day_of_week))
          itemString = itemString.replace("[", "").replace("]", "").replaceAll(" ", "").replaceAll("'", "").replaceAll("\"", "")
          const items = itemString.split(",")
          promo.value.day_of_week = items
        } else {
          promo.value.day_of_week = []
        }
      }

      loading.value = false
    } catch (err) {
      loading.value = false
      const errorMess = commonFunc.handleStaffError(err)
      showToast(errorMess, 'danger')
    }
  }
}

const handleFileUpload = () => {
  promo.value.image_preview = null
  file.value = document.querySelector('input[type="file"]').files[0]
  promo.value.image = file.value.name

  // Render image in preview
  const reader = new FileReader()
  reader.addEventListener("load", function () {
    promo.value.image_preview = reader.result
  })
  if (file.value) {
    reader.readAsDataURL(file.value)
  }
}

const checkFromDateAndToDate = () => {
  const fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(promo.value.expired_date_from))
  const toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(promo.value.expired_date_to))

  if (fromDate > toDate) {
    showToast("Ngày bắt đầu hiệu lực không thể lớn hơn ngày hết hiệu lực", 'danger')
    return false
  }

  return true
}

const editPromotion = (dataPost) => {
  if (dataPost.image_preview) {
    cropper.value.getCroppedCanvas({
      width: 300,
      height: 300
    }).toBlob(blob => {
      const formData = new FormData()
      formData.append("id", dataPost.id)
      formData.append("code", dataPost.code)
      formData.append("method", dataPost.method)
      formData.append("name", dataPost.name)
      formData.append("type", dataPost.type)
      formData.append("discount_percent", dataPost.discount_percent)
      formData.append("max_discount", dataPost.max_discount)
      formData.append("discount_on_amount", dataPost.discount_on_amount)
      formData.append("value_of_voucher", dataPost.value_of_voucher)
      formData.append("item_free", dataPost.item_free)
      formData.append("on_items", dataPost.on_items)
      formData.append("cost", dataPost.cost)
      formData.append("expired_date_from", dataPost.expired_date_from)
      formData.append("expired_date_to", dataPost.expired_date_to)
      formData.append("quantity", dataPost.quantity)
      formData.append("auto_apply", dataPost.auto_apply)
      formData.append("start_time", dataPost.start_time)
      formData.append("end_time", dataPost.end_time)
      formData.append("day_of_week", dataPost.day_of_week)
      formData.append("description", dataPost.description)
      formData.append("image", blob, dataPost.image)

      doEdit(formData)
    })
  } else {
    const formData = new FormData()
    formData.append("id", dataPost.id)
    formData.append("code", dataPost.code)
    formData.append("method", dataPost.method)
    formData.append("name", dataPost.name)
    formData.append("type", dataPost.type)
    formData.append("discount_percent", dataPost.discount_percent)
    formData.append("max_discount", dataPost.max_discount)
    formData.append("discount_on_amount", dataPost.discount_on_amount)
    formData.append("value_of_voucher", dataPost.value_of_voucher)
    formData.append("item_free", dataPost.item_free)
    formData.append("on_items", dataPost.on_items)
    formData.append("cost", dataPost.cost)
    formData.append("expired_date_from", dataPost.expired_date_from)
    formData.append("expired_date_to", dataPost.expired_date_to)
    formData.append("quantity", dataPost.quantity)
    formData.append("auto_apply", dataPost.auto_apply)
    formData.append("start_time", dataPost.start_time)
    formData.append("end_time", dataPost.end_time)
    formData.append("day_of_week", dataPost.day_of_week)
    formData.append("description", dataPost.description)
    formData.append("image", null)

    doEdit(formData)
  }
}

const doEdit = async (formData) => {
  try {
    const res = await adminAPI.editPromo(formData)
    saving.value = false
    if (res != null && res.data != null) {
      if (res.data.status === 200) {
        showToast('Cập nhật khuyến mãi thành công!!!', 'success')
      }
    }
  } catch (err) {
    saving.value = false
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

const addPromotion = (dataPost) => {
  if (dataPost.image_preview) {
    cropper.value.getCroppedCanvas({
      width: 300,
      height: 300
    }).toBlob(blob => {
      const formData = new FormData()
      formData.append("id", dataPost.id)
      formData.append("code", dataPost.code)
      formData.append("method", dataPost.method)
      formData.append("name", dataPost.name)
      formData.append("type", dataPost.type)
      formData.append("discount_percent", dataPost.discount_percent)
      formData.append("max_discount", dataPost.max_discount)
      formData.append("discount_on_amount", dataPost.discount_on_amount)
      formData.append("value_of_voucher", dataPost.value_of_voucher)
      formData.append("item_free", dataPost.item_free)
      formData.append("on_items", dataPost.on_items)
      formData.append("cost", dataPost.cost)
      formData.append("expired_date_from", dataPost.expired_date_from)
      formData.append("expired_date_to", dataPost.expired_date_to)
      formData.append("quantity", dataPost.quantity)
      formData.append("auto_apply", dataPost.auto_apply)
      formData.append("start_time", dataPost.start_time)
      formData.append("end_time", dataPost.end_time)
      formData.append("day_of_week", dataPost.day_of_week)
      formData.append("description", dataPost.description)
      formData.append("image", blob, dataPost.image)

      doAddPmt(formData)
    })
  } else {
    const formData = new FormData()
    formData.append("id", dataPost.id)
    formData.append("code", dataPost.code)
    formData.append("method", dataPost.method)
    formData.append("name", dataPost.name)
    formData.append("type", dataPost.type)
    formData.append("discount_percent", dataPost.discount_percent)
    formData.append("max_discount", dataPost.max_discount)
    formData.append("discount_on_amount", dataPost.discount_on_amount)
    formData.append("value_of_voucher", dataPost.value_of_voucher)
    formData.append("item_free", dataPost.item_free)
    formData.append("on_items", dataPost.on_items)
    formData.append("cost", dataPost.cost)
    formData.append("expired_date_from", dataPost.expired_date_from)
    formData.append("expired_date_to", dataPost.expired_date_to)
    formData.append("quantity", dataPost.quantity)
    formData.append("auto_apply", dataPost.auto_apply)
    formData.append("start_time", dataPost.start_time)
    formData.append("end_time", dataPost.end_time)
    formData.append("day_of_week", dataPost.day_of_week)
    formData.append("description", dataPost.description)
    formData.append("image", null)

    doAddPmt(formData)
  }
}

const doAddPmt = async (formData) => {
  try {
    const res = await adminAPI.addPromo(formData)
    saving.value = false
    if (res != null && res.data != null) {
      if (res.data.status === 200) {
        router.push("/promo/list")
      }
    }
  } catch (err) {
    saving.value = false
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

const save = () => {
  click.value = true
  saving.value = true

  // Check validate
  if (!checkValidate()) {
    saving.value = false
    return
  }
  if (!checkFromDateAndToDate()) {
    saving.value = false
    return
  }

  const dataPost = JSON.parse(JSON.stringify(promo.value))

  // Reformat date
  dataPost.expired_date_from = commonFunc.convertDDMMYYYYToYYYYMMDD(promo.value.expired_date_from)
  dataPost.expired_date_to = commonFunc.convertDDMMYYYYToYYYYMMDD(promo.value.expired_date_to)

  const promoId = route.params.id
  if (promoId) {
    // Edit
    dataPost.id = promoId
    editPromotion(dataPost)
  } else {
    // Add
    addPromotion(dataPost)
  }
}

const cropImage = () => {
  // Use to check reupload image when edit
}

const integerOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const inputDateOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

const integerTimeOnly = (item) => {
  let valueInput = item.value
  if (valueInput !== '') {
    valueInput = valueInput.replace(/[^0-9:]+/g,'')
  }
  item.value = valueInput
}

const back = () => {
  router.push("/promo/list")
}

const setMethodIsOther = () => {
  promo.value.cost = null
}

const setMethodIsTradePoint = () => {
  promo.value.auto_apply = false
  promo.value.start_time = "00:00"
  promo.value.end_time = "23:59"
  promo.value.day_of_week = []
}

onMounted(() => {
  getDefaultDate()
  getPromotionTypeList()
  getListItemFree()
  getPromoDetail()
})
</script>
