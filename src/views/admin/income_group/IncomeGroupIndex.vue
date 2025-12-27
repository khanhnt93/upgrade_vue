<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div class="w-full md:col-span-12">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="p-4">

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div class="w-full md:col-span-6 flex justify-center md:justify-start">
                <button class="btn btn-outline-secondary w-[120px]" @click="back">
                  Quay lại
                </button>
              </div>
              <div class="w-full md:col-span-6 flex justify-center md:justify-end">
                <button class="btn btn-outline-success w-[120px]" @click="save" :disabled="saving">
                    Lưu
                </button>
              </div>
            </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div class="w-full md:col-span-12">
                  <h4 class="mt-2 text-center">{{prefix_text}}Nhóm Thu Nhập</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label>Tên nhóm thu nhập</label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="incomeGroup.name">
                  <div v-if="errorName" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập tên nhóm thu nhập
                  </div>
                </div>
              </div>
            
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label>Thứ tự xuất hiện</label>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="index"
                  type="text"
                  maxlength="3"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="incomeGroup.index"
                  @keyup="integerOnly($event.target)">
                </div>
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import incomeGroupApi from '@/api/incomeGroup'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      prefix_text: '',
      incomeGroup: {
        "name": null,
        "index": null,
      },
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    // Check prefix
    if(this.$route.params.id) {
      this.prefix_text = "Cập Nhật "
    } else {
      this.prefix_text = "Thêm Mới "
    }

    // Get product group detail
    this.getIncomeGroupDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.incomeGroup.name)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName)
    },

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      console.log(`Toast: [${variant}] ${content}`)
    },

    /**
     * Get detail
     */
    getIncomeGroupDetail() {
      let incomeGroupId = this.$route.params.id
      if(incomeGroupId){
        this.prefix_text = 'Cập Nhật '
        this.loading = true

        incomeGroupApi.getIncomeGroupDetail(incomeGroupId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.incomeGroup = res.data.data
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
      this.$router.push('/income-group')
    },

    /**
     * Save
     */
    save () {
      this.click = true

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        let incomeGroupId = this.$route.params.id
        if(incomeGroupId){
          // Edit
          this.incomeGroup.id = incomeGroupId
          incomeGroupApi.updateIncomeGroup(this.incomeGroup).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật nhóm thu nhập thành công!!! ')
              }
            }
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        } else {
          // Add
          incomeGroupApi.addIncomeGroup(this.incomeGroup).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.$router.push("/income-group")
              }
            }
          }).catch(err => {
            this.saving = false

            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      }
    },
    
    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerOnly(valueInput)
      item.value = result
    },
  }
}
</script>
