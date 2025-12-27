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
                  <h4 class="mt-2 text-center">{{prefix_text}}Ví Chi Tiêu</h4>
                </div>
              </div>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
                <div class="w-full md:col-span-3 mt-2">
                  <label>Tên ví chi tiêu</label><span class="error-sybol"></span>
                </div>
                <div class="w-full md:col-span-9">
                  <input
                  id="name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="eiBook.name">
                  <div v-if="errorName" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập tên ví chi tiêu
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
                  v-model="eiBook.index"
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
import eiBookApi from '@/api/eiBook'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      prefix_text: '',
      eiBook: {
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
    this.getEIBookDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.eiBook.name)
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
    getEIBookDetail() {
      let eiBookId = this.$route.params.id
      if(eiBookId){
        this.prefix_text = 'Cập Nhật '
        this.loading = true

        eiBookApi.getEIBookDetail(eiBookId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.eiBook = res.data.data
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
      this.$router.push('/ei-book')
    },

    /**
     * Save
     */
    save () {
      this.click = true

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        let eiBookId = this.$route.params.id
        if(eiBookId){
          // Edit
          this.eiBook.id = eiBookId
          eiBookApi.updateEIBook(this.eiBook).then(res => {
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
          eiBookApi.addEIBook(this.eiBook).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.$router.push("/ei-book")
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
