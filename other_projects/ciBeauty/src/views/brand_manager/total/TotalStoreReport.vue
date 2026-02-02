<template>
  <div class="container-fluid">

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <h4 class="text-center text-header"><b>Tổng chuỗi</b></h4>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
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

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{currencyFormat(totalProfit)}}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{currencyFormat(totalFee)}}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{currencyFormat(totalRevenue)}}</b>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4" v-for="item in data" :key="item.store_id">
          <div class="card-body p-4"  >

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <h4 class="text-center"><b>{{item.store_name}}</b></h4>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
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

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{currencyFormat(item.revenue)}}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{currencyFormat(item.fee)}}</b>
                    </div>
                  </div>
                </div>

                <div class="content-circle">
                  <div class="circle-without-text">
                    <div class="text-inside-circle">
                      <b>{{currencyFormat(item.profit)}}</b>
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


export default {
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
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
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
        this.popToast('danger', errorMess)
      })
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = null
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      } else {
        if(num == 0) {
          return 0
        }
      }
      return result
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

