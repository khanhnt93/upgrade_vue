<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <!-- Total Summary Card -->
        <div class="bg-white shadow-sm rounded p-4 mb-4">
          <h4 class="text-center mb-4 font-weight-bold">Tổng chuỗi</h4>

          <div class="row mb-3">
            <div class="col text-center">
              <p class="font-weight-bold mb-2">Doanh thu</p>
            </div>
            <div class="col text-center">
              <p class="font-weight-bold mb-2">Chi phí</p>
            </div>
            <div class="col text-center">
              <p class="font-weight-bold mb-2">Lợi nhuận</p>
            </div>
          </div>

          <div class="row">
            <div class="col text-center">
              <div class="circle-container">
                <div class="circle-without-text">
                  <div class="text-inside-circle">
                    <b>{{ formatCurrency(totalProfit) }}</b>
                  </div>
                </div>
              </div>
            </div>
            <div class="col text-center">
              <div class="circle-container">
                <div class="circle-without-text">
                  <div class="text-inside-circle">
                    <b>{{ formatCurrency(totalFee) }}</b>
                  </div>
                </div>
              </div>
            </div>
            <div class="col text-center">
              <div class="circle-container">
                <div class="circle-without-text">
                  <div class="text-inside-circle">
                    <b>{{ formatCurrency(totalRevenue) }}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Individual Store Cards -->
        <div v-for="item in data" :key="item.store_id" class="bg-white shadow-sm rounded p-4 mb-4">
          <h4 class="text-center mb-4 font-weight-bold">{{ item.store_name }}</h4>

          <div class="row mb-3">
            <div class="col text-center">
              <p class="font-weight-bold mb-2">Doanh thu</p>
            </div>
            <div class="col text-center">
              <p class="font-weight-bold mb-2">Chi phí</p>
            </div>
            <div class="col text-center">
              <p class="font-weight-bold mb-2">Lợi nhuận</p>
            </div>
          </div>

          <div class="row">
            <div class="col text-center">
              <div class="circle-container">
                <div class="circle-without-text">
                  <div class="text-inside-circle">
                    <b>{{ formatCurrency(item.revenue) }}</b>
                  </div>
                </div>
              </div>
            </div>
            <div class="col text-center">
              <div class="circle-container">
                <div class="circle-without-text">
                  <div class="text-inside-circle">
                    <b>{{ formatCurrency(item.fee) }}</b>
                  </div>
                </div>
              </div>
            </div>
            <div class="col text-center">
              <div class="circle-container">
                <div class="circle-without-text">
                  <div class="text-inside-circle">
                    <b>{{ formatCurrency(item.profit) }}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

export default {
  name: 'TotalStoreReport',
  setup() {
    const { showToast } = useToast()
    const { formatCurrency } = useFormatters()

    const data = ref([])
    const totalProfit = ref(0)
    const totalFee = ref(0)
    const totalRevenue = ref(0)

    const calculatedTotal = () => {
      if (data.value) {
        totalProfit.value = 0
        totalFee.value = 0
        totalRevenue.value = 0

        for (let i in data.value) {
          totalProfit.value += parseInt(data.value[i].profit)
          totalFee.value += parseInt(data.value[i].fee)
          totalRevenue.value += parseInt(data.value[i].revenue)
        }
      }
    }

    const getData = async () => {
      try {
        const res = await adminAPI.getOverViewByBrand()
        if (res && res.data && res.data.data) {
          data.value = res.data.data
          calculatedTotal()
        }
      } catch (err) {
        console.log(err)
        const errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
      }
    }

    onMounted(() => {
      getData()
    })

    return {
      data,
      totalProfit,
      totalFee,
      totalRevenue,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.circle-container {
  display: inline-block;
}

.circle-without-text {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  background-color: #003399;
  position: relative;
  margin: auto;
}

.text-inside-circle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 0.5rem;
  word-break: break-word;
}
</style>
