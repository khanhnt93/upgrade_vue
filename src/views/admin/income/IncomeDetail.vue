<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div class="w-full md:col-span-12">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="p-4">

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div class="w-full md:col-span-12 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2">
                <button class="btn btn-outline-secondary w-[120px] px-4 py-2" @click="back">
                  Quay lại
                </button>
                
                <button v-if="this.income.status == 0" class="btn btn-outline-success w-[120px] px-4 py-2" @click="showModalApprove">
                  Duyệt
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-12">
                <h4 class="mt-2 text-center text-header">Chi Tiết Thu Nhập</h4>
              </div>
            </div>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
            
            <div class="grid grid-cols-1 gap-4 form-row" v-show="income.income_group_name">
              <div class="w-full mt-2">
                <label>Nhóm thu nhập: {{income.income_group_name}}</label>
              </div>
            </div>
            
            <div class="grid grid-cols-1 gap-4 form-row">
              <div class="w-full mt-2">
                <label>Ngày thu: {{income.date_input}}</label>
              </div>
            </div>
            
            <div class="grid grid-cols-1 gap-4 form-row">
              <div class="w-full mt-2">
                <label>Số tiền thu: {{currencyFormat(income.amount)}}</label>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 form-row" v-show="income.note">
              <div class="w-full mt-2">
                <label>Ghi chú: {{income.note}}</label>
              </div>
            </div>
            
            <div class="grid grid-cols-1 gap-4 form-row" v-show="income.staff_name">
              <div class="w-full mt-2">
                <label>Nguồn thu: {{income.staff_name}}</label>
              </div>
            </div>
            
            <div class="grid grid-cols-1 gap-4 form-row" v-show="income.image_url">
              <div class="w-full mt-2">
                <img :src="income.image_url" alt="Hình ảnh" width="100%" height="auto">
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showApproveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <h4 class="modal-title text-center text-success">Duyệt khoản thu</h4>
          </div>
        </div>
        <hr>
        
        <p>Số tiền chi: {{currencyFormat(income.amount)}}đ</p>
        <p>Người chi: {{income.staff_name}}</p>
        <p>Ngày chi: {{income.date_input}}</p>

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <button class="btn btn-outline-secondary pull-left btn-width-120 px-4 py-2" @click="hideModalApprove">
              Quay lại
            </button>

            <button class="btn btn-outline-success pull-right btn-width-120 px-4 py-2" @click="approve" :disabled="approving">
              Xác nhận
            </button>
            
            <span class="loading-more" v-show="approving"><icon name="loading" width="60" /></span>
          </div>
        </div>

      </div>
    </div>
    
  </div>
</template>
<script>
import incomeApi from '@/api/income'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      income: {
        "id": null,
        "income_group_id": null,
        "income_group_name": null,
        "date_input": "2024-06-10",
        "amount": null,
        "note": null,
        "staff_id": null,
        "staff_name": null,
        "image_url": null,
        "status": 0
      },
      loading: false,
      approving: false,
      showApproveModal: false,
    }
  },
  mounted() {
    this.getIncomeDetail()
  },
  
  methods: {
   /**
   * Make toast without title
   */
    popToast(variant, content) {
      console.log(`Toast: [${variant}] ${content}`)
    },

    /**
     * Get detail
     */
    getIncomeDetail() {
      let incomeId = this.$route.params.id
      if(incomeId){
        this.loading = true

        incomeApi.getIncomeDetailFull(incomeId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.income = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/income")
    },
    
    currencyFormat(num) {
      if(num == null || num == undefined) {
        return ""
      }
      let result = ""
      if(num == 0) {
        return "0"
      }
      num = (num + "").replaceAll(",", "")
      if(num) {
        result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
    
    showModalApprove() {
      this.showApproveModal = true
    },

    hideModalApprove() {
      this.showApproveModal = false
    },
    
    approve() {
      if(this.approving) {return}
      this.approving = true
      
      incomeApi.approveIncome(this.income.id).then(res => {
        if(res != null && res.data != null && res.data.status == 200) {
          this.popToast('success', 'Duyệt khoản thu thành công!')
          this.hideModalApprove()

          this.income.status = 1
        }
        
        this.approving = false
      }).catch(err => {
        this.approving = false
        
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },
    
  }
}
</script>
