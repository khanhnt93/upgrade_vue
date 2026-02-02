<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-lg shadow-md p-4" no-body>
        <div class="card-body">
          <form>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-8">
                <h4>Thông Tin Spa</h4>
              </div>
              <div class="col-span-4">
                <button class="btn px-4 float-right" v-if="onEdit" variant="primary"
                  @click="save" :disabled="saving">
                  Save
                </button>
                <button class="btn px-4 float-right" v-else variant="primary" @click="edit">
                  Edit
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Tên Spa<span class="error-sybol"></span></label>
              <input
                id="name"
                v-model="inputs.name"
                type="text"
                autocomplete="new-password"
                class="form-control"
                maxlength="100"
                :disabled="!onEdit">
                <div class="invalid-feedback invalid-feedback"   :state="!errorName">
                  Vui lòng nhập tên spa
                </div>
            </div>

            <div class="form-group">
              <label>Số Điện Thoại<span class="error-sybol"></span></label>
              <input
                id="phone_number"
                v-model="inputs.phone_number"
                type="text"
                autocomplete="new-password"
                class="form-control"
                maxlength="15"
                @keyup="integerOnly($event.target)"
                :disabled="!onEdit"
                v-on:change="checkPhoneNumberFormat($event.target)">
                <div class="invalid-feedback invalid-feedback" :state="!phoneNumberCheckFlag || !errorPhone">
                  Vui lòng nhập số điện thoại
                </div>
                <div class="invalid-feedback invalid-feedback" :state="phoneNumberCheckFlag">
                  Số điện thoại không đúng
                </div>
            </div>

            <div class="form-group">
              <label>Địa chỉ<span class="error-sybol"></span></label>
              <input
                id="role"
                v-model="inputs.address"
                type="text"
                autocomplete="new-password"
                class="form-control"
                maxlength="255"
                :disabled="!onEdit"
                >
                <div class="invalid-feedback invalid-feedback"   :state="!errorAddress">
                  Vui lòng nhập địa chỉ
                </div>
            </div>

            <div class="form-group">
              <label>Logo</label>
              <div class="input-group cursor-pointer" @click="$refs.file.click()">
                <input class="form-control" v-model="inputs.image" :disabled="!onEdit">
                <div class="input-group-append">
                  <span class="input-group-text">Browse</span>
                </div>
              </div>
              <input class="d-none" type="file" id="file" ref="file" accept="image/*"
                v-on:change="handleFileUpload" :disabled="!onEdit"/>
            </div>

            <div class="grid grid-cols-12 gap-4 form-row">
              <div v-if="inputs.image_preview" class="preview-box text-center"
                :style="{height: computedWidth, width: '100%'}">
                  <vue-cropper
                    ref="cropper"
                    :guides="true"
                    :view-mode="2"
                    :center="true"
                    drag-mode="crop"
                    :auto-crop-area="1"
                    :background="true"
                    :rotatable="true"
                    :src="inputs.image_preview"
                    :initialAspectRatio="1/1"
                    :aspectRatio="1/1"
                    alt="Source Image"
                    :style="computedImg"
                    :crop="cropImage"
                  >
                  </vue-cropper>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storeAPI from '@/api/store'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'


export default {
  name: 'Register',
  components: {
    VueCropper
  },
  data () {
    return {
      inputs: {
        name: '',
        phone_number: '',
        address: '',
        image: null,
        image_preview: null,
      },
      file: null,
      height: '300px',
      styleImg: {},
      click: false,
      saving: false,
      onEdit: false,
      phoneNumberCheckFlag: true,
    }
  },
  computed: {
    computedWidth() {
      return this.height
    },
    computedImg() {
      return this.styleImg
    },
    errorName: function () {
      return this.checkInfo(this.inputs.name)
    },
    errorPhone: function () {
      return this.checkInfo(this.inputs.phone_number)
    },
    errorAddress: function () {
      return this.checkInfo(this.inputs.address)
    },
  },
  mounted () {
    this.getSpaInfo()
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorAddress || this.errorPhone || !this.phoneNumberCheckFlag)
    },

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
     * Handle upload file
     */
    handleFileUpload () { // event
      this.inputs.image_preview = null
      this.file = this.$refs.file.files[0]//event.target.files[0]
      this.inputs.image = this.file.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        // this.$refs.cropper.image = reader.result
        this.inputs.image_preview = reader.result
      }.bind(this), false)
      if( this.file ){
        reader.readAsDataURL( this.file )
        this.height = '300px'
        this.styleImg = {'max-width': '100%', 'max-height': '100%'}
      }
    },

    /**
     * Event crop image
     */
    cropImage() {
      // Use to check reupload image when edit
    },

    /**
     * Get spa information
     */
    getSpaInfo () {
      storeAPI.getStoreInfo().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.inputs = res.data.data
          this.file = this.inputs.image_preview
        }
      }).catch(err => {
        // Handle error
          let errorMess = commonFunc.handleCusError(err)
          this.popToast('danger', errorMess)
      })
    },

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Event edit
     */
    edit() {
      this.onEdit = true
    },


    /**
     * Prepare info to save
     */
    save() {
      this.click = true

      let result = this.checkValidate()

      if(result) {
        if(this.inputs.image_preview) {
          this.$refs.cropper
            .getCroppedCanvas({
              width: 300,
              height: 300
            })
            .toBlob(blob => {
              const formData = new FormData();
              formData.append("file", blob, this.inputs.image)
              formData.append("name", this.inputs.name)
              formData.append("phone_number", this.inputs.phone_number)
              formData.append("address", this.inputs.address)

              this.doSave(formData)
            });
        } else {
          const formData = new FormData();
          formData.append("file", null)
          formData.append("name", this.inputs.name)
          formData.append("phone_number", this.inputs.phone_number)
          formData.append("address", this.inputs.address)

          this.doSave(formData)
        }
      }
    },

    doSave(formData) {
      this.saving = true
      storeAPI.saveStoreInfo(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null){
          // Show notify edit success
          this.popToast('success', 'Lưu thông tin spa thành công!!! ')
        }else{
          // Show notify edit fail
          this.popToast('danger', 'Lưu thông tin spa thất bại!!! ')
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Check phone number
     */
    checkPhoneNumberFormat(item) {
      let valueInput = item.value
      if (valueInput != null && valueInput != "") {
        if (commonFunc.phoneNumberCheck(valueInput)) {
          this.phoneNumberCheckFlag = true
        } else {
          this.phoneNumberCheckFlag = false
        }
      } else if(this.errorPhone) {
          this.phoneNumberCheckFlag = false
      } else {
        this.phoneNumberCheckFlag = true
      }
    },
  }
}
</script>
