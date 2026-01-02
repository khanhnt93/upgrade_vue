<template>
  <div class="container-fluid">

    <b-row>
      <b-col>
        <b-card>
          <b-card-body>

            <b-row>
              <b-col>
                <b-button variant="primary" class="pull-right px-4 default-btn-bg btn-width-120" @click="save()" :disabled="saving == true">
                  Lưu
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md='12'>
                <h4 class="mt-2 text-center">Thông Tin Nhà Hàng</h4>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="3">
                Giờ mở cửa:
              </b-col>
              <b-col md="9">
                <div class="form-inline">
                  <input
                    id="start_time"
                    v-model="inputs.start_time"
                    type="text"
                    autocomplete="new-password"
                    class="form-control input-width-100"
                    @keyup="integerTimeOnly($event.target)"
                    maxlength="5"
                    > :
                  <input
                    id="end_time"
                    v-model="inputs.end_time"
                    type="text"
                    autocomplete="new-password"
                    class="form-control input-width-100"
                    @keyup="integerTimeOnly($event.target)"
                    maxlength="5"
                    >
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="3">
                Hình ảnh nhà hàng:
              </b-col>
              <b-col md="9">
                <b-input-group @click="$refs.file.click()" append="Browse" class="pointer">
                  <b-input v-model="inputs.image"></b-input>
                </b-input-group>
                <input class="d-none" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
              </b-col>
            </b-row>

            <b-row class="form-row">
                <div v-if="inputs.image_preview" class="preview-box text-center"  :style="{height: computedWidth, width: '100%'}">
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
                      alt="Hình ảnh nhà hàng"
                      :style="computedImg"
                      :crop="cropImage"
                    >
                    </vue-cropper>
                </div>
              </b-row>


          </b-card-body>
        </b-card>

      </b-col>
    </b-row>

  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'


export default {
  components: {
    VueCropper
  },
  data () {
    return {
      inputs: {
        start_time: '00:00',
        end_time: '23:59',
        image: null,
        image_preview: null
      },
      file: null,
      height: '100px',
      styleImg: {},
      saving: false,
    }
  },
  mounted() {
    // Get store info
    this.getStoreInfo()
  },
  computed: {
    computedWidth() {
      return this.height
    },
    computedImg() {
      return this.styleImg
    },
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
     * Get store info
     */
    getStoreInfo() {
      // Call api get store info
      adminAPI.getStoreInfo().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.inputs = res.data.data
          this.inputs.image_preview = res.data.data.image
        }
      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
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
     * Check validate
     */
    checkValidate() {
      if(this.inputs.start_time) {
        if(this.inputs.start_time.indexOf(':') > -1) {
          let timeItems = this.inputs.start_time.split(":")
          if(parseInt(timeItems[0]) >= 24) {
            this.popToast('danger', "Giờ mở cửa không quá 24")
            return false
          }
          if(parseInt(timeItems[1]) >= 60) {
            this.popToast('danger', "Phút mở cửa không quá 60")
            return false
          }
        } else {
          this.popToast('danger', "Giờ mở cửa không hợp lệ! Định dạng HH:MM")
          return false
        }
      }

      if(this.inputs.end_time) {
        if(this.inputs.end_time.indexOf(':') > -1) {
          let timeItems = this.inputs.end_time.split(":")
          if(parseInt(timeItems[0]) >= 24) {
            this.popToast('danger', "Giờ đóng cửa không quá 24")
            return false
          }
          if(parseInt(timeItems[1]) >= 60) {
            this.popToast('danger', "Phút đóng cửa không quá 60")
            return false
          }
        } else {
          this.popToast('danger', "Giờ đóng cửa không hợp lệ! Định dạng HH:MM")
          return false
        }
      }

       return true
    },

    /**
     * Prepare info to save
     */
    save() {
      // Check validate
      if(!this.checkValidate()) {
        return
      }

      if(this.inputs.image_preview) {
        this.$refs.cropper
          .getCroppedCanvas({
            width: 300,
            height: 300
          })
          .toBlob(blob => {
            const formData = new FormData();
            formData.append("image", blob, this.inputs.image)
            formData.append("start_time", this.inputs.start_time)
            formData.append("end_time", this.inputs.end_time)

            this.doSave(formData);
          });
      } else {
        const formData = new FormData();
        formData.append("image", null)
        formData.append("start_time", this.inputs.start_time)
        formData.append("end_time", this.inputs.end_time)

        this.doSave(formData);
      }

    },

    /**
     * Call api, save data
     * @param formData
     */
    doSave(formData) {
      this.saving = true

      adminAPI.updateStoreInfo(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null){
          // Show notify edit success
          this.popToast('success', 'Lưu thông tin nhà hàng thành công!!! ')
        }else{
          // Show notify edit fail
          this.popToast('danger', 'Lưu thông tin nhà hàng thất bại!!! ')
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })

    },

    /**
     * Only input integer and :
     */
     integerTimeOnly(item) {
      let valueInput = item.value
      if (valueInput != '') {
        valueInput = valueInput.replace(/[^0-9:]+/g,'');
      }
      item.value = valueInput
    },
  }
}
</script>


<style lang="css" scoped>
  .input-width-100 {
    width: 100px;
  }
</style>
