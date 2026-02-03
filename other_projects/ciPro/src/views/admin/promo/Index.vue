<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-between mb-4">
          <button
            class="border border-gray-400 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded w-32"
            @click="back">
            Quay lại
          </button>
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-32"
            @click="save"
            :disabled="saving">
            Lưu
          </button>
        </div>

        <div class="text-center mb-4">
          <h4 class="text-xl font-semibold text-orange-600">Khuyến Mãi</h4>
        </div>
        <hr class="mb-4">

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <icon name="loading" width="60" />
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Tên<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="promo.name"
              maxlength="100">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập tên
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Code</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="promo.code"
              maxlength="50">
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Loại<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select
              v-model="promo.type"
              class="w-full border rounded px-3 py-2">
              <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
            <div v-if="errorType" class="text-red-500 text-sm mt-1">
              Vui lòng nhập loại
            </div>
          </div>
        </div>

        <div v-if="promo.type == 'discount' || promo.type == 'discount_with_max_value' || promo.type == 'discount_on_item'" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Phần trăm giảm giá (%)<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="promo.discount_percent"
              maxlength="3"
              @keyup="integerOnly($event.target)">
            <div v-if="errorPercentDiscount" class="text-red-500 text-sm mt-1">
              Vui lòng nhập phần trăm giảm giá
            </div>
          </div>
        </div>

        <div v-if="promo.type == 'discount_with_max_value'" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Giảm giá tối đa<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="promo.max_discount"
              maxlength="20"
              @keyup="integerOnly($event.target)">
            <div v-if="errorMaxDiscount" class="text-red-500 text-sm mt-1">
              Vui lòng nhập giảm giá tối đa
            </div>
          </div>
        </div>

        <div v-if="promo.type == 'discount_with_max_value'" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Trên tổng giá<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="promo.discount_on_amount"
              maxlength="20"
              @keyup="integerOnly($event.target)">
            <div v-if="errorDiscountOnAmount" class="text-red-500 text-sm mt-1">
              Vui lòng nhập trên tổng giá
            </div>
          </div>
        </div>

        <div v-if="promo.type == 'voucher'" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Giá trị voucher<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="promo.value_of_voucher"
              maxlength="20"
              @keyup="integerOnly($event.target)">
            <div v-if="errorValueOfVoucher" class="text-red-500 text-sm mt-1">
              Vui lòng nhập giá trị voucher
            </div>
          </div>
        </div>

        <div v-if="promo.type == 'free_item'" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Item free<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select
              v-model="promo.item_free"
              class="w-full border rounded px-3 py-2">
              <option v-for="opt in itemFreeOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
            <div v-if="errorFreeItem" class="text-red-500 text-sm mt-1">
              Vui lòng nhập item free
            </div>
          </div>
        </div>

        <div v-if="promo.type == 'discount_on_item'" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Giảm giá trên món<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <div class="grid grid-cols-2 gap-2">
              <div v-for="item in itemFood" :key="item.value">
                <label class="flex items-center">
                  <input :id="item.value" type="checkbox" v-model="promo.on_items" name="discountOnItem" :value="item.value" class="mr-2">
                  <span>{{ item.text }}</span>
                </label>
              </div>
            </div>
            <div v-if="errorFreeItem" class="text-red-500 text-sm mt-1">
              Vui lòng món muốn giảm giá
            </div>
          </div>
        </div>

        <div v-show="promo.method == 'trade_point'" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Giá mua(điểm)<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              maxlength="100"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="promo.cost"
              @keyup="integerOnly($event.target)">
            <div v-if="errorCost" class="text-red-500 text-sm mt-1">
              Vui lòng nhập giá
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Hiệu lực từ<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="promo.expired_date_from"
              maxlength="10"
              @keyup="inputDateOnly($event.target)">
            <div v-if="errorExpiredDateFrom" class="text-red-500 text-sm mt-1">
              Ngày bắt đầu hiệu lực không đúng
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Hiệu lực đến<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="promo.expired_date_to"
              maxlength="10"
              @keyup="inputDateOnly($event.target)">
            <div v-if="errorExpiredDateTo" class="text-red-500 text-sm mt-1">
              Ngày hết hiệu lực không đúng
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Số Lượng<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              maxlength="100"
              v-model="promo.quantity"
              @keyup="integerOnly($event.target)">
            <div v-if="errorQuantity" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng
            </div>
          </div>
        </div>

        <div v-show="promo.method == 'other'">
          <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-3 flex items-center">
              <label>Khung giờ tự động áp dụng</label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input type="radio" id="auto_apply_yes" value="true" v-model="promo.auto_apply" class="mr-2">
                  <span>Có</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" id="auto_apply_no" value="false" v-model="promo.auto_apply" class="mr-2">
                  <span>Không</span>
                </label>
              </div>
            </div>
          </div>

          <div v-show="promo.auto_apply == true || promo.auto_apply == 'true'" class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-3 flex items-center">
              <label>Các ngày trong tuần</label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <div class="flex flex-wrap gap-2">
                <label class="flex items-center">
                  <input type="checkbox" id="t2" value="1" v-model="promo.day_of_week" class="mr-2">
                  <span>Thứ 2</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" id="t3" value="2" v-model="promo.day_of_week" class="mr-2">
                  <span>Thứ 3</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" id="t4" value="3" v-model="promo.day_of_week" class="mr-2">
                  <span>Thứ 4</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" id="t5" value="4" v-model="promo.day_of_week" class="mr-2">
                  <span>Thứ 5</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" id="t6" value="5" v-model="promo.day_of_week" class="mr-2">
                  <span>Thứ 6</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" id="t7" value="6" v-model="promo.day_of_week" class="mr-2">
                  <span>Thứ 7</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" id="cn" value="7" v-model="promo.day_of_week" class="mr-2">
                  <span>Chủ nhật</span>
                </label>
              </div>
            </div>
          </div>

          <div v-show="promo.auto_apply == true || promo.auto_apply == 'true'" class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-3 flex items-center">
              <label>Khung giờ</label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <div class="flex items-center gap-2">
                <input
                  v-model="promo.start_time"
                  type="text"
                  autocomplete="new-password"
                  class="border rounded px-3 py-2 w-24"
                  @keyup="integerTimeOnly($event.target)"
                  maxlength="5">
                <span>:</span>
                <input
                  v-model="promo.end_time"
                  type="text"
                  autocomplete="new-password"
                  class="border rounded px-3 py-2 w-24"
                  @keyup="integerTimeOnly($event.target)"
                  maxlength="5">
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Mô tả</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <textarea
              rows="3"
              class="w-full border rounded px-3 py-2"
              v-model="promo.description">
            </textarea>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Hình ảnh</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <div @click="$refs.file.click()" class="flex cursor-pointer">
              <input
                v-model="promo.image"
                class="flex-1 border rounded-l px-3 py-2"
                readonly>
              <button class="bg-gray-200 border border-gray-300 px-4 py-2 rounded-r">Browse</button>
            </div>
            <input class="hidden" type="file" id="file" ref="file" accept="image/*" @change="handleFileUpload"/>
          </div>
        </div>

        <div v-if="promo.image_preview" class="mb-4">
          <div class="text-center" :style="{height: computedWidth}">
            <vue-cropper
              ref="cropper"
              :guides="true"
              :view-mode="2"
              :center="true"
              drag-mode="crop"
              :auto-crop-area="1"
              :background="true"
              :rotatable="true"
              :src="promo.image_preview"
              :initialAspectRatio="1/1"
              :aspectRatio="1/1"
              alt="Source Image"
              :style="computedImg"
              :crop="cropImage">
            </vue-cropper>
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
import promotionAPI from '@/api/promotion'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

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
const height = ref('100px')
const styleImg = ref({})
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

const computedWidth = computed(() => height.value)
const computedImg = computed(() => styleImg.value)

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const errorMethod = computed(() => checkInfo(promo.value.method))
const errorName = computed(() => checkInfo(promo.value.name))
const errorType = computed(() => checkInfo(promo.value.type))

const errorPercentDiscount = computed(() => {
  return (click.value && (promo.value.type == 'discount' || promo.value.type == 'discount_with_max_value' || promo.value.type == 'discount_on_item') && (promo.value.discount_percent == null || promo.value.discount_percent.length <= 0))
})

const errorMaxDiscount = computed(() => {
  return (click.value && promo.value.type == 'discount_with_max_value' && (promo.value.max_discount == null || promo.value.max_discount.length <= 0))
})

const errorDiscountOnAmount = computed(() => {
  return (click.value && promo.value.type == 'discount_with_max_value' && (promo.value.discount_on_amount == null || promo.value.discount_on_amount.length <= 0))
})

const errorValueOfVoucher = computed(() => {
  return (click.value && promo.value.type == 'voucher' && (promo.value.value_of_voucher == null || promo.value.value_of_voucher.length <= 0))
})

const errorFreeItem = computed(() => {
  return (click.value && promo.value.type == 'free_item' && (promo.value.item_free == null || promo.value.item_free.length <= 0))
})

const errorCost = computed(() => {
  return (click.value && promo.value.method == 'trade_point' && (promo.value.cost == null || promo.value.cost.length <= 0))
})

const checkDate = (dateInput) => {
  return (click.value && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
}

const errorExpiredDateFrom = computed(() => checkDate(promo.value.expired_date_from))
const errorExpiredDateTo = computed(() => checkDate(promo.value.expired_date_to))

const errorQuantity = computed(() => checkInfo(promo.value.quantity))

const checkValidate = () => {
  return !(errorMethod.value || errorName.value || errorType.value || errorCost.value || errorExpiredDateFrom.value
    || errorExpiredDateTo.value || errorQuantity.value || errorPercentDiscount.value || errorMaxDiscount.value
    || errorDiscountOnAmount.value || errorValueOfVoucher.value || errorFreeItem.value)
}

/**
 * Get default date
 */
const getDefaultDate = () => {
  let dateNow = new Date()
  promo.value.expired_date_from = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
  let todate = new Date(dateNow.setMonth(dateNow.getMonth() + 1))
  promo.value.expired_date_to = commonFunc.formatDate(todate.toJSON().slice(0,10))
}

/**
 * Load list option promotion type
 */
const getPromotionTypeList = () => {
  promotionAPI.getListPromotionType().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      typeOptions.value = typeOptions.value.concat(res.data.data)
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Load list option item free
 */
const getListItemFree = () => {
  promotionAPI.getListFreeItem().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      itemFreeOptions.value = itemFreeOptions.value.concat(res.data.data)
      itemFood.value = res.data.data
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Get detail
 */
const getPromoDetail = () => {
  let promoId = route.params.id
  if(promoId){
    loading.value = true

    promotionAPI.getPromoDetail(promoId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        promo.value = res.data.data

        if(promo.value.day_of_week) {
          let itemString = JSON.parse(JSON.stringify(promo.value.day_of_week))
          itemString = itemString.replace("[", "").replace("]", "").replaceAll(" ", "").replaceAll("'", "").replaceAll("\"", "")
          let items = itemString.split(",")
          promo.value.day_of_week = items
        } else {
          promo.value.day_of_week = []
        }
      }

      loading.value = false
    }).catch(err => {
      loading.value = false

      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

/**
 * Handle upload file
 */
const handleFileUpload = () => {
  promo.value.image_preview = null
  file.value = file.value || {}
  const fileInput = document.getElementById('file')
  file.value = fileInput.files[0]
  promo.value.image = file.value.name

  let reader  = new FileReader()
  reader.addEventListener("load", function () {
    promo.value.image_preview = reader.result
  }, false)
  if(file.value){
    reader.readAsDataURL(file.value)
    height.value = '300px'
    styleImg.value = {'max-width': '100%', 'max-height': '100%'}
  }
}

/**
 * Check valid from date and to date
 */
const checkFromDateAndToDate = () => {
  let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(promo.value.expired_date_from))
  let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(promo.value.expired_date_to))

  if(fromDate > toDate) {
    popToast('danger', "Ngày bắt đầu hiệu lực không thể lớn hớn ngày hết hiệu lực")
    return false
  }

  return true
}

/**
 * Edit promotion
 */
const editPromotion = (dataPost) => {
  if(dataPost.image_preview) {
    cropper.value.getCroppedCanvas({
      width: 300,
      height: 300
    }).toBlob(blob => {
      const formData = buildFormData(dataPost)
      formData.append("image", blob, dataPost.image)
      doEdit(formData)
    })
  } else {
    const formData = buildFormData(dataPost)
    formData.append("image", null)
    doEdit(formData)
  }
}

/**
 * Add promotion
 */
const addPromotion = (dataPost) => {
  if(dataPost.image_preview) {
    cropper.value.getCroppedCanvas({
      width: 300,
      height: 300
    }).toBlob(blob => {
      const formData = buildFormData(dataPost)
      formData.append("image", blob, dataPost.image)
      doAddPmt(formData)
    })
  } else {
    const formData = buildFormData(dataPost)
    formData.append("image", null)
    doAddPmt(formData)
  }
}

const buildFormData = (dataPost) => {
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
  return formData
}

/**
 * Do edit
 */
const doEdit = (formData) => {
  promotionAPI.editPromo(formData).then(res => {
    saving.value = false
    if(res != null && res.data != null){
      if (res.data.status == 200) {
        popToast('success', 'Cập nhật khuyến mãi thành công!!! ')
      }
    }
  }).catch(err => {
    saving.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Do add
 */
const doAddPmt = (formData) => {
  promotionAPI.addPromo(formData).then(res => {
    saving.value = false
    if(res != null && res.data != null){
      if (res.data.status == 200) {
        router.push("/promo/list")
      }
    }
  }).catch(err => {
    saving.value = false
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Save promotion
 */
const save = () => {
  click.value = true
  saving.value = true

  if(!checkValidate()) {
    saving.value = false
    return
  }
  if(!checkFromDateAndToDate()) {
    saving.value = false
    return
  }
  let dataPost = JSON.parse(JSON.stringify(promo.value))

  dataPost.expired_date_from = commonFunc.convertDDMMYYYYToYYYYMMDD(promo.value.expired_date_from)
  dataPost.expired_date_to = commonFunc.convertDDMMYYYYToYYYYMMDD(promo.value.expired_date_to)

  let promoId = route.params.id
  if(promoId){
    dataPost.id = promoId
    editPromotion(dataPost)
  } else {
    addPromotion(dataPost)
  }
}

const cropImage = () => {}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const inputDateOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.inputDateOnly(valueInput)
  item.value = result
}

const integerTimeOnly = (item) => {
  let valueInput = item.value
  if (valueInput != '') {
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

const cropper = ref(null)

onMounted(() => {
  getDefaultDate()
  getPromotionTypeList()
  getListItemFree()
  getPromoDetail()
})
</script>
