<template>
  <div class="container-fluid mx-auto px-4 py-6">
    <!-- Header Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-center text-xl font-bold text-blue-600 mb-6">Tổng chuỗi</h4>

      <div class="flex justify-around mb-4">
        <p class="font-bold">Doanh thu</p>
        <p class="font-bold">Chi phí</p>
        <p class="font-bold">Lợi nhuận</p>
      </div>

      <div class="flex justify-around">
        <div class="w-[100px] h-[100px] rounded-full bg-blue-900 flex items-center justify-center">
          <p class="text-white font-bold text-center">{{ formatCurrency(totalRevenue) }}</p>
        </div>
        <div class="w-[100px] h-[100px] rounded-full bg-blue-900 flex items-center justify-center">
          <p class="text-white font-bold text-center">{{ formatCurrency(totalFee) }}</p>
        </div>
        <div class="w-[100px] h-[100px] rounded-full bg-blue-900 flex items-center justify-center">
          <p class="text-white font-bold text-center">{{ formatCurrency(totalProfit) }}</p>
        </div>
      </div>
    </div>

    <!-- Store Cards -->
    <div v-for="item in data" :key="item.store_id" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h4 class="text-center text-xl font-bold mb-6">{{ item.store_name }}</h4>

      <div class="flex justify-around mb-4">
        <p class="font-bold">Doanh thu</p>
        <p class="font-bold">Chi phí</p>
        <p class="font-bold">Lợi nhuận</p>
      </div>

      <div class="flex justify-around">
        <div class="w-[100px] h-[100px] rounded-full bg-blue-900 flex items-center justify-center">
          <p class="text-white font-bold text-center">{{ formatCurrency(item.revenue) }}</p>
        </div>
        <div class="w-[100px] h-[100px] rounded-full bg-blue-900 flex items-center justify-center">
          <p class="text-white font-bold text-center">{{ formatCurrency(item.fee) }}</p>
        </div>
        <div class="w-[100px] h-[100px] rounded-full bg-blue-900 flex items-center justify-center">
          <p class="text-white font-bold text-center">{{ formatCurrency(item.profit) }}</p>
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
import { useFormatters } from '@/composables/useFormatters'

const { popToast } = useToast()
const { formatCurrency } = useFormatters()

const data = ref([])
const totalProfit = ref(0)
const totalFee = ref(0)
const totalRevenue = ref(0)

const calculatedTotal = () => {
  if (data.value) {
    for (let i in data.value) {
      totalProfit.value += parseInt(data.value[i].profit)
      totalFee.value += parseInt(data.value[i].fee)
      totalRevenue.value += parseInt(data.value[i].revenue)
    }
  }
}

const getData = () => {
  adminAPI.getOverViewByBrand().then(res => {
    if (res && res.data && res.data.data) {
      data.value = res.data.data
      calculatedTotal()
    }
  }).catch(err => {
    console.log(err)
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

onMounted(() => {
  getData()
})
</script>
