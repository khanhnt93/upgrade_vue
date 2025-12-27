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
                  <h4 class="mt-2 text-center">{{prefix_text}}Nhóm Chi Phí</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label>Tên nhóm chi phí</label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="expendGroup.name">
                  <div v-if="errorName" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập tên nhóm chi phí
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
                  v-model="expendGroup.index"
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
import expendGroupApi from '@/api/expendGroup'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      prefix_text: '',
      expendGroup: {
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
    this.getExpendGroupDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.expendGroup.name)
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
    getExpendGroupDetail() {
      let expendGroupId = this.$route.params.id
      if(expendGroupId){
        this.prefix_text = 'Cập Nhật '
        this.loading = true

        expendGroupApi.getExpendGroupDetail(expendGroupId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.expendGroup = res.data.data
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
      this.$router.push('/expend-group')
    },

    /**
     * Save
     */
    save () {
      this.click = true

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        let expendGroupId = this.$route.params.id
        if(expendGroupId){
          // Edit
          this.expendGroup.id = expendGroupId
          expendGroupApi.updateExpendGroup(this.expendGroup).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật nhóm chi phí thành công!!! ')
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
          expendGroupApi.addExpendGroup(this.expendGroup).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.$router.push("/expend-group")
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
