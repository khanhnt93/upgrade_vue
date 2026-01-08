<template>
  <div class="container-fluid px-4 py-4">
    <div class="card">
      <div class="card-body p-4">
        <div class="mb-4">
          <h4 class="text-center font-semibold text-lg">Két Tiền</h4>
        </div>

        <div class="mb-4 flex justify-end gap-2">
            <button
              class="btn btn-outline-primary btn-width-160"
              @click="goToHistory">
              Lịch sử két tiền
            </button>
            <button
              class="btn btn-outline-danger btn-width-160"
              @click="closeDay">
              Đóng ngày
            </button>
        </div>

        <!-- Revenue Section -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h5 class="text-center border-t pt-2">
              Tổng tiền món
            </h5>
            <h3 class="text-center">
              {{ formatCurrency(detail.reveneu) }}
            </h3>
          </div>
          <div>
            <h5 class="text-center border-t pt-2">
              Tổng thu khác
            </h5>
            <h3 class="text-center">
              {{ formatCurrency(detail.total_ear_order) }}
            </h3>
          </div>
          <div>
            <h5 class="text-center border-t pt-2">
              Tổng chi
            </h5>
            <h3 class="text-center">
              {{ formatCurrency(detail.fee) }}
            </h3>
          </div>
          <div>
            <h5 class="text-center border-t pt-2">
              Lợi nhuận
            </h5>
            <h3 class="text-center">
              {{ formatCurrency(detail.reveneu + detail.total_ear_order - detail.fee) }}
            </h3>
          </div>
        </div>

        <!-- Money Details Section -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h5 class="text-center border-t pt-2">
              Tiền vốn đầu ngày
            </h5>
            <h4 class="text-center">
              {{ formatCurrency(detail.fund) }}
            </h4>
          </div>
          <div>
            <h5 class="text-center border-t pt-2">
              Tiền mặt
            </h5>
            <h4 class="text-center">
              {{ formatCurrency(detail.cash) }}
            </h4>
          </div>
          <div>
            <h5 class="text-center border-t pt-2">
              Tài khoản thẻ
            </h5>
            <h4 class="text-center">
              {{ formatCurrency(detail.credit) }}
            </h4>
          </div>
          <div>
            <h5 class="text-center border-t pt-2">
              Tiền điện tử
            </h5>
            <h4 class="text-center">
              {{ formatCurrency(detail.e_money) }}
            </h4>
          </div>
        </div>

        <!-- Action Buttons Section -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h5 class="text-center border-t pt-2">
              Số hóa đơn:
            </h5>
            <h4 class="text-center">
              {{ detail.bill_number }}
            </h4>
          </div>
          <div class="border-t pt-2">
            <button
              class="btn btn-outline-primary w-full"
              @click="plusFundMoney">
              Thêm vốn đầu ngày
            </button>
          </div>
          <div class="border-t pt-2">
            <button
              class="btn btn-outline-primary w-full"
              @click="plusMoney">
              Thêm tiền thu
            </button>
          </div>
          <div class="border-t pt-2">
            <button
              class="btn btn-outline-primary w-full"
              @click="minusMoney">
              Thêm tiền chi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal plus/minus money-->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="cancelChangeMoney" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
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
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {{ modalTitle }}
                </DialogTitle>

                <div class="mt-4">
                  <!-- Money Number Input -->
                  <div class="form-group mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ moneyNumber }}<span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="inputs.moneyNumber"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      :class="{ 'is-invalid': errorMoneyNumber }"
                      maxlength="11"
                      @keyup="changeMoneyNumber($event.target)"
                    />
                    <div v-if="errorMoneyNumber" class="invalid-feedback d-block">
                      Vui lòng nhập số tiền
                    </div>
                  </div>

                  <!-- Money Content Input -->
                  <div class="form-group mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ moneyContent }}<span class="text-red-500">*</span>
                    </label>
                    <textarea
                      :placeholder="moneyContentExample"
                      rows="5"
                      v-model="inputs.moneyContent"
                      class="form-control"
                      :class="{ 'is-invalid': errorMoneyContent }"
                    ></textarea>
                    <div v-if="errorMoneyContent" class="invalid-feedback d-block">
                      Vui lòng nhập nội dung
                    </div>
                  </div>

                  <!-- Money Type Tabs -->
                  <div class="mb-4">
                    <TabGroup>
                      <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        <Tab v-slot="{ selected }" class="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2" :class="selected ? 'bg-white shadow' : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'">
                          Tiền mặt
                        </Tab>
                        <Tab v-slot="{ selected }" class="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2" :class="selected ? 'bg-white shadow' : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'">
                          Chuyển khoản
                        </Tab>
                        <Tab v-slot="{ selected }" class="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2" :class="selected ? 'bg-white shadow' : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'">
                          Tiền điện tử
                        </Tab>
                      </TabList>

                      <TabPanels class="mt-2">
                        <TabPanel class="rounded-xl bg-white p-3">
                          <input
                            type="text"
                            autocomplete="new-password"
                            class="form-control"
                            maxlength="11"
                            v-model="inputs.cash"
                            @keyup="intergerOnly($event.target)"
                          />
                        </TabPanel>

                        <TabPanel class="rounded-xl bg-white p-3">
                          <input
                            id="credit"
                            type="text"
                            autocomplete="new-password"
                            class="form-control"
                            maxlength="11"
                            v-model="inputs.credit"
                            @keyup="intergerOnly($event.target)"
                          />
                        </TabPanel>

                        <TabPanel class="rounded-xl bg-white p-3">
                          <input
                            id="e_money"
                            type="text"
                            autocomplete="new-password"
                            class="form-control"
                            maxlength="11"
                            v-model="inputs.e_money"
                            @keyup="intergerOnly($event.target)"
                          />
                        </TabPanel>
                      </TabPanels>
                    </TabGroup>
                    <div v-if="errorMoney" class="invalid-feedback d-block">
                      Vui lòng nhập đúng số tiền
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex justify-between mt-6">
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-width-120"
                      @click="cancelChangeMoney"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-success btn-width-120"
                      @click="confirmChangeMoney"
                      :disabled="saving"
                    >
                      Xác nhận
                    </button>
                  </div>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

const router = useRouter()
const { popToast } = useToast()
const { formatCurrency } = useFormatters()

// Data
const detail = reactive({
  cash: 0,
  credit: 0,
  e_money: 0,
  reveneu: 0,
  fee: 0,
  fund: 0,
  total_ear_order: 0,
  bill_number: 0
})

const modalTitle = ref("Thêm tiền thu")
const moneyNumber = ref("Số tiền")
const moneyContent = ref("Nội dung")
const moneyContentExample = ref("")

const inputs = reactive({
  type: null,
  moneyNumber: null,
  moneyContent: null,
  cash: 0,
  credit: 0,
  e_money: 0
})

const click = ref(false)
const saving = ref(false)
const loading = ref(false)
const isModalOpen = ref(false)

// Computed
const errorMoneyNumber = computed(() => {
  return checkInfo(inputs.moneyNumber)
})

const errorMoneyContent = computed(() => {
  return checkInfo(inputs.moneyContent)
})

const errorMoney = computed(() => {
  return checkMoney()
})

// Methods
const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkMoney = () => {
  return (click.value &&
    (parseInt(inputs.cash) + parseInt(inputs.credit) + parseInt(inputs.e_money) != inputs.moneyNumber)
  )
}

const checkValidate = () => {
  return !(errorMoneyNumber.value || errorMoneyContent.value || errorMoney.value)
}

/**
 * Get money box detail
 */
const getMoneyBoxDetail = () => {
  loading.value = true
  let dateNow = new Date()
  let dataPost = {
    toDay: dateNow.toJSON().slice(0,10)
  }

  adminAPI.getMoneyBoxDetail(dataPost).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      Object.assign(detail, res.data.data)
    }

    loading.value = false
  }).catch(err => {
    loading.value = false

    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Plus money
 */
const plusMoney = () => {
  click.value = false
  modalTitle.value = "Thêm tiền thu"
  moneyNumber.value = "Số tiền thêm"
  moneyContent.value = "Nội dung thêm"
  moneyContentExample.value = "Tiền tip"

  inputs.type = "plus"
  isModalOpen.value = true
}

/**
 * Plus fund money
 */
const plusFundMoney = () => {
  click.value = false
  modalTitle.value = "Thêm vốn đầu ngày"
  moneyNumber.value = "Số tiền vốn"
  moneyContent.value = "Nội dung thêm"
  moneyContentExample.value = "Tiền vốn đầu ngày"

  inputs.type = "fund"
  inputs.moneyContent = "Tiền vốn đầu ngày"
  isModalOpen.value = true
}

/**
 * Minus money
 */
const minusMoney = () => {
  click.value = false
  modalTitle.value = "Thêm tiền chi"
  moneyNumber.value = "Số tiền chi"
  moneyContent.value = "Nội dung chi"
  moneyContentExample.value = "Trả tiền điện"

  inputs.type = "minus"
  isModalOpen.value = true
}

/**
 * Cancel change money
 */
const cancelChangeMoney = () => {
  isModalOpen.value = false
}

/**
 * Reset modal
 */
const resetModal = () => {
  modalTitle.value = "Thêm tiền"
  moneyNumber.value = "Số tiền"
  moneyContent.value = "Nội dung"
  moneyContentExample.value = ""

  inputs.type = null
  inputs.moneyNumber = null
  inputs.moneyContent = null
  inputs.cash = 0
  inputs.credit = 0
  inputs.e_money = 0
  isModalOpen.value = false
}

/**
 * Close day
 */
const closeDay = () => {
  if (confirm("Bạn có chắc muốn đóng ca làm việc cuối ngày?")) {
    adminAPI.closeDay().then(res => {
      detail.cash = 0
      detail.credit = 0
      detail.e_money = 0
      detail.reveneu = 0
      detail.fee = 0
      detail.total_ear_order = 0
      detail.fund = 0
      detail.bill_number = 0

      popToast('success', "Đóng ngày thành công!")
    }).catch(err => {
      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

/**
 * Confirm change money
 */
const confirmChangeMoney = () => {
  // Check validate
  click.value = true
  let result = checkValidate()
  if(result) {
    saving.value = true

    // Call api, update data
    let dateNow = new Date()
    inputs.toDay = dateNow.toJSON().slice(0,10)
    adminAPI.saveMoneyBox(inputs).then(res => {
      if (res != null && res.data != null) {
        popToast('success', "Thao tác thành công!")

        if(res.data.data != null) {
          Object.assign(detail, res.data.data)
        }

        // Reset modal
        resetModal()
      }

      saving.value = false
    }).catch(err => {
      saving.value = false

      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

/**
 * Go to money box history
 */
const goToHistory = () => {
  router.push("/money-box-history")
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
 * Event key up money number
 */
const changeMoneyNumber = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result

  inputs.cash = result
}

onMounted(() => {
  getMoneyBoxDetail()
})
</script>

<style scoped>
.mb-6 {
  margin-bottom: 2rem;
}
</style>
