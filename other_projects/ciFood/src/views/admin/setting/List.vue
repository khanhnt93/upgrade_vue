<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Danh Sách Cài Đặt Hệ Thống</h4>
          </div>
        </div>
        <hr class="my-4"/>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-6">
            <label class="block mb-2 font-medium">Giá đã bao gồm VAT?</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="vat"
                  :value="true"
                  v-model="vat.value">
                <span class="ml-2">Có</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="vat"
                  :value="false"
                  v-model="vat.value">
                <span class="ml-2">Không</span>
              </label>
            </div>
            <p v-if="errorVat" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block mb-2 font-medium">Nhân viên order được phép thanh toán?</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="is_waiter_pay"
                  :value="true"
                  v-model="is_waiter_pay.value">
                <span class="ml-2">Có</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="is_waiter_pay"
                  :value="false"
                  v-model="is_waiter_pay.value">
                <span class="ml-2">Không</span>
              </label>
            </div>
            <p v-if="errorIsWaiterPay" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block mb-2 font-medium">Sử dụng kho?</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="use_reponsetory"
                  :value="true"
                  v-model="use_reponsetory.value">
                <span class="ml-2">Có</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="use_reponsetory"
                  :value="false"
                  v-model="use_reponsetory.value">
                <span class="ml-2">Không</span>
              </label>
            </div>
            <p v-if="errorUseReponsetory" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block mb-2 font-medium">Tự động kết ngày vào 00:00?</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="auto_close"
                  :value="true"
                  v-model="auto_close.value">
                <span class="ml-2">Có</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="auto_close"
                  :value="false"
                  v-model="auto_close.value">
                <span class="ml-2">Không</span>
              </label>
            </div>
            <p v-if="errorAutoClose" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block mb-2 font-medium">Khách hàng cần đăng nhập tại bàn?</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="cusLogin"
                  :value="true"
                  v-model="cusLogin.value">
                <span class="ml-2">Có</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="cusLogin"
                  :value="false"
                  v-model="cusLogin.value">
                <span class="ml-2">Không</span>
              </label>
            </div>
            <p v-if="errorCusLogin" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block mb-2 font-medium">Hiển thị chỉnh sửa giá trên bill?</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="editPrice"
                  :value="true"
                  v-model="editPrice.value">
                <span class="ml-2">Có</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="editPrice"
                  :value="false"
                  v-model="editPrice.value">
                <span class="ml-2">Không</span>
              </label>
            </div>
            <p v-if="errorEditPrice" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block mb-2 font-medium">Số lượng khuyến mại</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="quantityPmt"
                  :value="1"
                  v-model="quantityPmt.value"
                  @change="changeQuantityPmt">
                <span class="ml-2">1</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="quantityPmt"
                  :value="2"
                  v-model="quantityPmt.value">
                <span class="ml-2">Nhiều</span>
              </label>
            </div>
            <p v-if="errorQuantityPmt" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6" v-show="quantityPmt.value > 1">
            <label class="block mb-2 font-medium">Số lượng discount</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="quantityDiscount"
                  :value="1"
                  v-model="quantityDiscount.value">
                <span class="ml-2">1</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="quantityDiscount"
                  :value="2"
                  v-model="quantityDiscount.value">
                <span class="ml-2">Nhiều</span>
              </label>
            </div>
            <p v-if="errorQuantityDiscount" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6" v-show="quantityPmt.value > 1">
            <label class="block mb-2 font-medium">Số lượng voucher</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="quantityVoucher"
                  :value="1"
                  v-model="quantityVoucher.value">
                <span class="ml-2">1</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="quantityVoucher"
                  :value="2"
                  v-model="quantityVoucher.value">
                <span class="ml-2">Nhiều</span>
              </label>
            </div>
            <p v-if="errorQuantityVoucher" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6" v-show="quantityPmt.value > 1">
            <label class="block mb-2 font-medium">Số lượng free item</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="quantityFreeItem"
                  :value="1"
                  v-model="quantityFreeItem.value">
                <span class="ml-2">1</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="quantityFreeItem"
                  :value="2"
                  v-model="quantityFreeItem.value">
                <span class="ml-2">Nhiều</span>
              </label>
            </div>
            <p v-if="errorQuantityFreeItem" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block mb-2 font-medium">In nhãn/tem?</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="printLabel"
                  :value="true"
                  v-model="printLabel.value">
                <span class="ml-2">Có</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="form-radio h-4 w-4 text-blue-600"
                  name="printLabel"
                  :value="false"
                  v-model="printLabel.value">
                <span class="ml-2">Không</span>
              </label>
            </div>
            <p v-if="errorPrintLabel" class="mt-1 text-sm text-red-600">Vui lòng nhập thông tin</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import Mapper from '@/mapper/setting'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const vat = ref({id: null, code: 'is_include_vat', value: null})
const is_waiter_pay = ref({id: null, code: 'is_waiter_pay', value: null})
const use_reponsetory = ref({id: null, code: 'use_reponsetory', value: null})
const auto_close = ref({id: null, code: 'auto_close', value: null})
const cusLogin = ref({id: null, code: 'is_customer_login', value: null})
const editPrice = ref({id: null, code: 'is_show_edit_price', value: null})
const quantityPmt = ref({id: null, code: 'quantity_pmt', value: null})
const quantityDiscount = ref({id: null, code: 'quantity_discount', value: null})
const quantityVoucher = ref({id: null, code: 'quantity_voucher', value: null})
const quantityFreeItem = ref({id: null, code: 'quantity_free_item', value: null})
const printLabel = ref({id: null, code: 'print_label', value: null})

const click = ref(false)
const saving = ref(false)

const errorVat = computed(() => click.value && (vat.value.value === null || vat.value.value === ''))
const errorIsWaiterPay = computed(() => click.value && (is_waiter_pay.value.value === null || is_waiter_pay.value.value === ''))
const errorUseReponsetory = computed(() => click.value && (use_reponsetory.value.value === null || use_reponsetory.value.value === ''))
const errorAutoClose = computed(() => click.value && (auto_close.value.value === null || auto_close.value.value === ''))
const errorCusLogin = computed(() => click.value && (cusLogin.value.value === null || cusLogin.value.value === ''))
const errorEditPrice = computed(() => click.value && (editPrice.value.value === null || editPrice.value.value === ''))
const errorQuantityPmt = computed(() => click.value && (quantityPmt.value.value === null || quantityPmt.value.value === ''))
const errorQuantityDiscount = computed(() => click.value && quantityPmt.value.value > 1 && (quantityDiscount.value.value === null || quantityDiscount.value.value === ''))
const errorQuantityVoucher = computed(() => click.value && quantityPmt.value.value > 1 && (quantityVoucher.value.value === null || quantityVoucher.value.value === ''))
const errorQuantityFreeItem = computed(() => click.value && quantityPmt.value.value > 1 && (quantityFreeItem.value.value === null || quantityFreeItem.value.value === ''))
const errorPrintLabel = computed(() => click.value && (printLabel.value.value === null || printLabel.value.value === ''))

const checkValidate = () => {
  return !(errorVat.value || errorIsWaiterPay.value || errorUseReponsetory.value || errorAutoClose.value
    || errorCusLogin.value || errorEditPrice.value || errorQuantityPmt.value || errorQuantityDiscount.value
    || errorQuantityVoucher.value || errorQuantityFreeItem.value || errorPrintLabel.value)
}

const changeQuantityPmt = () => {
  if (quantityPmt.value.value === 1) {
    quantityDiscount.value.value = 1
    quantityVoucher.value.value = 1
    quantityFreeItem.value.value = 1
  }
}

const getSystemConfig = async () => {
  try {
    const res = await adminAPI.getSystemConfig()
    if (res != null && res.data != null && res.data.data != null) {
      // Map data
      const setting = Mapper.mapSysCfgModelToDto(res.data.data)
      vat.value = setting.vat
      is_waiter_pay.value = setting.is_waiter_pay
      use_reponsetory.value = setting.use_reponsetory
      auto_close.value = setting.auto_close
      cusLogin.value = setting.cusLogin
      editPrice.value = setting.editPrice
      quantityPmt.value = setting.quantityPmt
      quantityDiscount.value = setting.quantityDiscount
      quantityVoucher.value = setting.quantityVoucher
      quantityFreeItem.value = setting.quantityFreeItem
      printLabel.value = setting.printLabel
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

const save = async () => {
  click.value = true
  saving.value = true

  // Check validate
  if (!checkValidate()) {
    saving.value = false
    return
  }

  const setting = {
    vat: vat.value,
    is_waiter_pay: is_waiter_pay.value,
    use_reponsetory: use_reponsetory.value,
    auto_close: auto_close.value,
    cusLogin: cusLogin.value,
    editPrice: editPrice.value,
    quantityPmt: quantityPmt.value,
    quantityDiscount: quantityDiscount.value,
    quantityVoucher: quantityVoucher.value,
    quantityFreeItem: quantityFreeItem.value,
    printLabel: printLabel.value
  }

  try {
    const res = await adminAPI.saveSystemConfig(setting)
    saving.value = false
    if (res != null && res.data != null) {
      if (res.data.status === 200) {
        showToast('Cập nhật cài đặt thành công!!!', 'success')
      }
    }
  } catch (err) {
    saving.value = false
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

onMounted(() => {
  getSystemConfig()
})
</script>
