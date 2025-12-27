<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div class="w-full md:col-span-12">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="p-4">

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div class="w-full md:col-span-12 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2">
                <button class="btn btn-outline-secondary w-[120px]" @click="back">
                  Quay lại
                </button>

                <button class="btn btn-outline-success w-[120px]" @click="save" :disabled="saving">
                  Lưu
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-12">
                <h4 class="mt-2 text-center text-header">{{prefix_text}}Chi Phí</h4>
              </div>
            </div>
            <hr/>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
            
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-3 mt-2">
                <label>Nhóm chi phí</label>
              </div>
              <div class="w-full md:col-span-9 mt-2">
                <select
                  id="expend_group_id"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="expend.expend_group_id">
                  <option v-for="option in expendGroupOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-3 mt-2">
                <label>Ngày chi<span class="error-sybol"></span></label>
              </div>
              <div class="w-full md:col-span-9 mt-2">
                <datepicker v-model="expend.date_input" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
                <div v-if="errorDateInput" class="invalid-feedback" style="display: block;">
                  Vui lòng chọn ngày chi
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-3 mt-2">
                <label>Số tiền chi<span class="error-sybol"></span></label>
              </div>
              <div class="w-full md:col-span-9 mt-2">
                <input
                id="amount"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="expend.amount"
                maxlength="11"
                @keyup="integerOnly($event.target)">
                <div v-if="errorAmount" class="invalid-feedback" style="display: block;">
                  Vui lòng nhập số tiền chi
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-3 mt-2">
                <label>Ghi chú</label>
              </div>
              <div class="w-full md:col-span-9 mt-2">
                <div class="form-inline">
                  <textarea
                    id="note"
                    style="width:100%;"
                    rows="2"
                    class="form-control"
                    v-model="expend.note"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-3 mt-2">
                <label>Người chi</label>
              </div>
              <div class="w-full md:col-span-9 mt-2">
                <select
                  id="staff_id"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="expend.staff_id">
                  <option v-for="option in staffOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
                <div v-if="errorStaff" class="invalid-feedback" style="display: block;">
                  Vui lòng chọn người chi
                </div>
              </div>
            </div> -->
            
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-3 mt-2">
                <label>Chi từ ví chi tiêu</label>
              </div>
              <div class="w-full md:col-span-9 mt-2">
                <select
                  id="ei_book_id"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="expend.ei_book_id">
                  <option v-for="option in optionsEIBook" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-3 mt-2">
                <label>Hình ảnh</label>
              </div>
              <div class="w-full md:col-span-9 mt-2">
                <div @click="$refs.file.click()" class="flex pointer">
                  <input v-model="expend.image" class="form-control" readonly />
                  <button type="button" class="btn btn-secondary ml-2">Browse</button>
                </div>
                <input class="d-none" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 form-row mt-2" v-if="expend.image_url">
              <div class="w-full">
                <img :src="expend.image_url" alt="Hình ảnh" width="100%" height="auto">
              </div>
              <!--<div v-if="expend.image_url" class="preview-box text-center"  :style="{height: '100px', width: '100%'}">-->
                  <!--<vue-cropper-->
                    <!--ref="cropper"-->
                    <!--:guides="true"-->
                    <!--:view-mode="2"-->
                    <!--:center="true"-->
                    <!--drag-mode="crop"-->
                    <!--:auto-crop-area="1"-->
                    <!--:background="true"-->
                    <!--:rotatable="true"-->
                    <!--:src="expend.image_url"-->
                    <!--:initialAspectRatio="1/2"-->
                    <!--:aspectRatio="1/2"-->
                    <!--alt="Source Image"-->
                    <!--:style="computedImg"-->
                    <!--:crop="cropImage"-->
                  <!--&gt;-->
                  <!--</vue-cropper>-->
              <!--</div>-->
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import expendApi from '@/api/expend'
import commonFunc from '@/common/commonFunc'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'


export default {
  components: {
    Datepicker
  },
  data () {
    return {
      prefix_text: "Thêm Mới ",
      expend: {
        "id": null,
        "expend_group_id": null,
        "ei_book_id": null,
        "date_input": "2024-06-10",
        "amount": null,
        "note": null,
        "staff_id": null,
        "image": null,
        "image_url": null
      },
      expendGroupOptions: [],
      staffOptions: [],
      optionsEIBook: [],
      file: null,
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    this.getDefaultDate()

    this.getOptionsRelated()

    this.getExpendDetail()
  },
  computed: {
    errorDateInput: function () {
      return this.checkInfo(this.expend.date_input)
    },
    errorAmount: function () {
      return this.checkInfo(this.expend.amount)
    },
    errorStaff: function () {
      return this.checkInfo(this.expend.staff_id)
    },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorDateInput || this.errorAmount || this.errorStaff)
    },

   /**
   * Make toast without title
   */
    popToast(variant, content) {
      console.log(`Toast: [${variant}] ${content}`)
    },

    /**
     * Get default date
     */
    getDefaultDate() {
      // Get default date
      let dateNow = new Date()
      this.expend.date_input = dateNow.toJSON().slice(0,10)
    },

    getOptionsRelated() {
      let params = {
        expend_groups: true,
        staffs: true,
        ei_books: true 
      }

      expendApi.getOptionRelatedExpend(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          
          this.expendGroupOptions = res.data.data.expend_groups
          let itemGroupEmpty = {"value": null, "text": ''}
          this.expendGroupOptions.unshift(itemGroupEmpty)

          this.staffOptions = res.data.data.staffs
          let itemStaffEmpty = {"value": null, "text": ''}
          this.staffOptions.unshift(itemStaffEmpty)
          
          this.optionsEIBook = res.data.data.ei_books
          let itemEIBookEmpty = {"value": null, "text": 'Khác'}
          this.optionsEIBook.unshift(itemEIBookEmpty)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get detail
     */
    getExpendDetail() {
      let expendId = this.$route.params.id
      if(expendId){
        this.prefix_text = 'Cập Nhật '
        this.loading = true

        expendApi.getExpendDetail(expendId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.expend = res.data.data
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        this.prefix_text = 'Thêm Mới '
        if (this.$store.state.user && this.$store.state.user.id) {
          this.expend.staff_id = this.$store.state.user.id
        }
      }
    },

    /**
     * Handle upload file
     */
    handleFileUpload () { // event
      this.expend.image_url = null
      this.file = this.$refs.file.files[0]//event.target.files[0]
      this.expend.image = this.file.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        // this.$refs.cropper.image = reader.result
        this.expend.image_url = reader.result
      }.bind(this), false)
      if( this.file ){
        reader.readAsDataURL( this.file )
      }
    },

    /**
     * Edit expend
     */
    editExpend(dataPost) {
      const formData = new FormData();
      formData.append("id", dataPost.id)
      formData.append("expend_group_id", dataPost.expend_group_id)
      formData.append("amount", dataPost.amount)
      formData.append("date_input", dataPost.date_input)
      formData.append("note", dataPost.note)
      formData.append("staff_id", dataPost.staff_id)
      formData.append("ei_book_id", dataPost.ei_book_id)

      if(dataPost.image_url) {
        formData.append("image", this.file)
      } else {
        formData.append("image", null)
      }
      this.doEdit(formData)
    },

    /**
     * Do edit
     */
    doEdit(formData) {
      expendApi.updateExpend(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            // show popup success
            this.popToast('success', 'Cập nhật chi phí thành công!!! ')
          }
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Add promotion
     */
    addExpend(dataPost) {
      const formData = new FormData();
      formData.append("id", dataPost.id)
      formData.append("expend_group_id", dataPost.expend_group_id)
      formData.append("amount", dataPost.amount)
      formData.append("date_input", dataPost.date_input)
      formData.append("note", dataPost.note)
      formData.append("staff_id", dataPost.staff_id)
      formData.append("ei_book_id", dataPost.ei_book_id)

      if(dataPost.image_url) {
        formData.append("image", this.file)
      } else {
        formData.append("image", null)
      }
      this.doAddExpend(formData)
    },

    /**
     * Do add
     */
    doAddExpend(formData) {
      expendApi.addExpend(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            this.$router.push("/expend")
          }
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.makeToast('danger', "Thêm mới thất bại!!!", errorMess)
      })
    },

    /**
     * Save promotion
     */
    save () {
      this.click = true

      // Check validate
      if(!this.checkValidate()) {
        return
      }
      this.saving = true
      let dataPost = JSON.parse(JSON.stringify(this.expend))
      
      let expendId = this.$route.params.id
      if(expendId){
        // Edit
        dataPost.id = expendId
        this.editExpend(dataPost)
      } else { // Add
        this.addExpend(dataPost)
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

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.$router.push("/expend")
    },
  }
}
</script>
