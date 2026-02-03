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
          <h4 class="text-xl font-semibold text-orange-600">{{ prefix_title }} Tài Khoản Ngân Hàng</h4>
        </div>
        <hr class="mb-4">

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <icon name="loading" width="60" />
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Loại tài khoản<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select v-model="bankAccount.type" class="w-full border rounded px-3 py-2">
              <option v-for="opt in optionsType" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
            <div v-if="errorType" class="text-red-500 text-sm mt-1">
              Vui lòng chọn loại tài khoản
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Tên tài khoản<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              maxlength="255"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="bankAccount.account_name">
            <div v-if="errorAccountName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập tên tài khoản
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Số tài khoản<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              maxlength="255"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="bankAccount.account_number">
            <div v-if="errorAccountNumber" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số tài khoản
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Ngân hàng<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              maxlength="255"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="bankAccount.bank_name">
            <div v-if="errorBankName" class="text-red-500 text-sm mt-1">
              Vui lòng nhập ngân hàng
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Là tài khoản mặc định</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <div class="flex items-center gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="bankAccount.is_default" name="is_default" :value="true" class="mr-2">
                <span>Có</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="bankAccount.is_default" name="is_default" :value="false" class="mr-2">
                <span>Không</span>
              </label>
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
import bankAccountAPI from '@/api/bankAccount'
import commonFunc from '@/common/commonFunc'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

const prefix_title = ref("Thêm Mới")
const bankAccount = ref({
  type: 1,
  account_name: null,
  account_number: null,
  bank_name: null,
  is_default: false
})
const optionsType = ref([
  {value: 0, text: 'Cá nhân'},
  {value: 1, text: 'Cty'}
])
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const errorType = computed(() => checkInfo(bankAccount.value.type))
const errorAccountName = computed(() => checkInfo(bankAccount.value.account_name))
const errorAccountNumber = computed(() => checkInfo(bankAccount.value.account_number))
const errorBankName = computed(() => checkInfo(bankAccount.value.bank_name))

const checkValidate = () => {
  return !(errorType.value || errorAccountName.value || errorAccountNumber.value || errorBankName.value)
}

/**
 * Get detail
 */
const getBankAccountDetail = () => {
  let bankAccountId = route.params.id
  if(bankAccountId){
    loading.value = true

    bankAccountAPI.getBankAccountDetail(bankAccountId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        bankAccount.value = res.data.data
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

/**
 * Back to list
 */
const back = () => {
  router.push('/bank-account')
}

/**
 * Save
 */
const save = () => {
  click.value = true
  saving.value = true
  let result = checkValidate()
  if(result) {
    let bankAccountId = route.params.id
    if(bankAccountId){
      // Edit
      let bankAccountData = bankAccount.value
      bankAccountData.id = bankAccountId
      bankAccountAPI.editBankAccount(bankAccountData).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            // show popup success
            popToast('success', 'Cập nhật tài khoản ngân hàng thành công!!! ')
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
      bankAccountAPI.addBankAccount(bankAccount.value).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            router.push("/bank-account")
          }
        }
      }).catch(err => {
        saving.value = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  } else {
    saving.value = false
  }
}

onMounted(() => {
  // Check prefix
  if(route.params.id) {
    prefix_title.value = "Cập Nhật"
  } else {
    prefix_title.value = "Thêm Mới"
  }

  getBankAccountDetail()
})
</script>
