<template>
  <div class="container-fluid">

    <div class="grid grid-cols-1">
      <div class="bg-white rounded-lg shadow-md p-6">

        <div class="flex justify-end mb-4">
          <button 
            @click="save()" 
            :disabled="saving == true"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            style="min-width: 120px"
          >
            Lưu
          </button>
        </div>

        <div class="mb-4">
          <h4 class="mt-2 text-center text-xl font-semibold">Thông Tin Nhà Hàng</h4>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            Giờ mở cửa:
          </div>
          <div class="col-span-12 md:col-span-9">
            <div class="flex items-center gap-2">
              <input
                id="start_time"
                v-model="inputs.start_time"
                type="text"
                autocomplete="new-password"
                class="form-control border border-gray-300 rounded px-3 py-2"
                style="width: 100px"
                @keyup="integerTimeOnly($event.target)"
                maxlength="5"
              > :
              <input
                id="end_time"
                v-model="inputs.end_time"
                type="text"
                autocomplete="new-password"
                class="form-control border border-gray-300 rounded px-3 py-2"
                style="width: 100px"
                @keyup="integerTimeOnly($event.target)"
                maxlength="5"
              >
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            Hình ảnh nhà hàng:
          </div>
          <div class="col-span-12 md:col-span-9">
            <div class="flex">
              <input 
                v-model="inputs.image"
                type="text"
                readonly
                class="flex-1 border border-gray-300 rounded-l px-3 py-2 bg-white"
              >
              <button 
                @click="$refs.file.click()"
                class="px-4 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r hover:bg-gray-300"
              >
                Browse
              </button>
            </div>
            <input class="hidden" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
          </div>
        </div>

        <div class="mb-4" v-if="inputs.image_preview">
          <div class="preview-box text-center" :style="{height: computedWidth, width: '100%'}">
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
        </div>

      </div>
    </div>

  </div>
</template>


<script>
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'


export default {
  components: {
    VueCropper
  },
  setup() {
    const toast = useToast()

    return {
      toast
    }
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
        this.toast.error(errorMess)
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
            this.toast.error("Giờ mở cửa không quá 24")
            return false
          }
          if(parseInt(timeItems[1]) >= 60) {
            this.toast.error("Phút mở cửa không quá 60")
            return false
          }
        } else {
          this.toast.error("Giờ mở cửa không hợp lệ! Định dạng HH:MM")
          return false
        }
      }

      if(this.inputs.end_time) {
        if(this.inputs.end_time.indexOf(':') > -1) {
          let timeItems = this.inputs.end_time.split(":")
          if(parseInt(timeItems[0]) >= 24) {
            this.toast.error("Giờ đóng cửa không quá 24")
            return false
          }
          if(parseInt(timeItems[1]) >= 60) {
            this.toast.error("Phút đóng cửa không quá 60")
            return false
          }
        } else {
          this.toast.error("Giờ đóng cửa không hợp lệ! Định dạng HH:MM")
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
          this.toast.success('Lưu thông tin nhà hàng thành công!!! ')
        }else{
          // Show notify edit fail
          this.toast.error('Lưu thông tin nhà hàng thất bại!!! ')
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
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
</style>
