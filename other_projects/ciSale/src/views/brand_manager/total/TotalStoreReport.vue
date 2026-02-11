<template>
  <div class="container-fluid">

    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg p-4 mb-4">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="text-center text-header"><b>Tổng chuỗi</b></h4>
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
                      <b>{{formatCurrency(totalProfit)}}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{formatCurrency(totalFee)}}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{formatCurrency(totalRevenue)}}</b>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="bg-white shadow rounded-lg p-4 mb-4" v-for="item in data" :key="item.store_id">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="text-center"><b>{{item.store_name}}</b></h4>
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
                      <b>{{formatCurrency(item.revenue)}}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{formatCurrency(item.fee)}}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{formatCurrency(item.profit)}}</b>
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


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

export default {
  setup() {
    const { toast } = useToast()
    const { formatCurrency } = useFormatters()
    return { toast, formatCurrency }
  },
  data () {
    return {
      data: [],
      totalProfit: 0,
      totalFee: 0,
      totalRevenue: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(content, variant) {
      this.toast(content, variant)
    },

    /**
     * Calculated total
     */
    calculatedTotal() {
      if(this.data) {
        for (let i in this.data) {
          this.totalProfit += parseInt(this.data[i].profit)
          this.totalFee += parseInt(this.data[i].fee)
          this.totalRevenue += parseInt(this.data[i].revenue)
        }
      }
    },

    /**
     * Search
     */
    getData() {
      // Search
      adminAPI.getOverViewByBrand().then(res => {
        if(res && res.data && res.data.data) {
          this.data = res.data.data

          // Calculated total
          this.calculatedTotal()
        }

      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast(errorMess, 'error')
      })
    },

  }
}
</script>

<style lang="scss">
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

