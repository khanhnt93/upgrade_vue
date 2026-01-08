<template>
  <div class="container-fluid px-4 py-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header Row -->
        <div class="flex justify-end mb-4">
          <button
            @click="save"
            :disabled="saving"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Lưu
          </button>
        </div>

        <!-- Title -->
        <h4 class="text-xl font-semibold text-center mb-4">Đặt Giá Cho Món Theo Kênh Bán Hàng</h4>
        <hr class="mb-4">

        <!-- Sale Channel Select -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Chọn kênh bán hàng</label>
          <select
            v-model="inputs.sale_channel"
            @change="loadFoodBySaleChannel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
          </select>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        </div>

        <!-- Food Table -->
        <div class="overflow-x-auto mt-4">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">STT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Tên món</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Giá bán gốc</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán theo kênh bán hàng</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(food, index) in inputs.foods" :key="food.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{{ index + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{{ food.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right border-r">{{ currencyFormat(food.root_price) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    v-model="inputs.foods[index].price_by_channel"
                    type="text"
                    autocomplete="new-password"
                    maxlength="10"
                    @keyup="intergerOnly($event.target)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const { popToast } = useToast()

// Data
const options = ref([])
const inputs = ref({
  sale_channel: null,
  foods: []
})
const saving = ref(false)
const loading = ref(false)

// Methods
const getSaleChannelOptions = () => {
  adminAPI.getListSaleChannelOption().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      options.value = res.data.data

      if (options.value.length > 0) {
        inputs.value.sale_channel = options.value[0].value
        getFoodBySaleChannel()
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const getFoodBySaleChannel = () => {
  const sale_channel_id = inputs.value.sale_channel
  if (sale_channel_id) {
    loading.value = true

    adminAPI.getFoodBySaleChannel(sale_channel_id).then(res => {
      if (res != null && res.data != null && res.data.data != null) {
        inputs.value.foods = res.data.data
      }
      loading.value = false
    }).catch(err => {
      loading.value = false
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const loadFoodBySaleChannel = () => {
  getFoodBySaleChannel()
}

const save = () => {
  saving.value = true
  adminAPI.savePriceFoodBySaleChannel(inputs.value).then(res => {
    saving.value = false
    if (res != null && res.data != null) {
      popToast('success', 'Lưu thành công!!!')
    }
  }).catch(err => {
    saving.value = false
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const currencyFormat = (num) => {
  if (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } else {
    return num == 0 ? 0 : null
  }
}

const intergerOnly = (item) => {
  const result = commonFunc.intergerOnly(item.value)
  item.value = result
}

// Lifecycle
onMounted(() => {
  getSaleChannelOptions()
})
</script>
