<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white rounded-lg shadow">
          <div class="p-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="text-center text-header font-bold">Tổng chuỗi</h4>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="content-circle">
                  <p><b>Doanh thu</b></p>
                </div>
                <div class="content-circle">
                  <p><b>Chi phí</b></p>
                </div>
                <div class="content-circle">
                  <p><b>Lợi nhuận</b></p>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{ currencyFormat(totalProfit) }}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{ currencyFormat(totalFee) }}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{ currencyFormat(totalRevenue) }}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-for="item in data" :key="item.store_id" class="bg-white rounded-lg shadow mt-4">
          <div class="p-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="text-center font-bold">{{ item.store_name }}</h4>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="content-circle">
                  <p><b>Doanh thu</b></p>
                </div>
                <div class="content-circle">
                  <p><b>Chi phí</b></p>
                </div>
                <div class="content-circle">
                  <p><b>Lợi nhuận</b></p>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{ currencyFormat(item.revenue) }}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{ currencyFormat(item.fee) }}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{ currencyFormat(item.profit) }}</b>
                    </div>
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

<script setup>
import { ref, onMounted } from 'vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const { popToast } = useToast()

const data = ref([])
const totalProfit = ref(0)
const totalFee = ref(0)
const totalRevenue = ref(0)

/**
 * Calculated total
 */
const calculatedTotal = () => {
  if (data.value) {
    for (let i in data.value) {
      totalProfit.value += parseInt(data.value[i].profit)
      totalFee.value += parseInt(data.value[i].fee)
      totalRevenue.value += parseInt(data.value[i].revenue)
    }
  }
}

/**
 * Get data
 */
const getData = () => {
  adminAPI.getOverViewByBrand().then(res => {
    if (res && res.data && res.data.data) {
      data.value = res.data.data
      // Calculated total
      calculatedTotal()
    }
  }).catch(err => {
    console.log(err)
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Currency format
 */
const currencyFormat = (num) => {
  let result = null
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  } else {
    if (num === 0) {
      return 0
    }
  }
  return result
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.content-circle {
  width: 32%;
  float: left;
  text-align: center;
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
}
</style>
