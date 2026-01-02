<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

              <b-row class="form-row">
                <b-col md='12'>
                  <h4 class="mt-1 text-center text-header">Hình Ảnh Sản Phẩm</h4>
                </b-col>
              </b-row>
              <hr/>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Nhóm sản phẩm </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9" class="mt-2">
                <multiselect
                  v-model="productGroupSelect"
                  :options="productGroupOptions"
                  :loading="loadingGetOptions"
                  placeholder="--Chọn nhóm sản phẩm--"
                  label="name"
                  track-by="name"
                  @input="changeProductGroup">
                </multiselect>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Loại sản phẩm </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9" class="mt-2">
                <multiselect
                  v-model="productTypeSelect"
                  :options="productTypeOptions"
                  :loading="loadingGetOptions"
                  placeholder="--Chọn loại sản phẩm--"
                  label="name"
                  track-by="name"
                  @input="changeProductType">
                </multiselect>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Sản phẩm </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <multiselect
                    v-model="productSelect"
                    :options="productOptions"
                    :loading="loadingGetOptions"
                    placeholder="--Chọn sản phẩm--"
                    label="name"
                    track-by="name"
                    @input="changeProduct">
                  </multiselect>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="product.product_id">
              <b-col md="3" class="mt-2">
                <label> Thêm hình ảnh </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <b-input-group @click="$refs.file.click()" append="Browse" class="pointer">
                  <b-input v-model="image"></b-input>
                </b-input-group>
                <input class="d-none" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="product.product_id">
              <b-col md="3" class="mt-2">
                <label> Hình mặc định của sản phẩm </label>
              </b-col>
              <b-col md="9" class="mt-2">
                <div class="input-group">
                  <input type="radio" v-model="product.is_default" name="image_default" :value="true" class="mt-2"><label class="ml-4 mt-1">Có</label>
                  <input type="radio" v-model="product.is_default" name="image_default" :value="false" class="ml-5 mt-2"><label class="ml-4 mt-1">Không</label>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-2 text-center" v-show="this.image_preview">
              <b-col md="12">
                <b-button variant="outline-success" class="text-center btn-width-160" @click="prepareUpload" :disabled="saving">
                  Upload hình
                </b-button>
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="image">
              <div v-if="image_preview" class="preview-box text-center"  :style="{height: computedWidth, width: '100%'}">
                <vue-cropper
                  ref="cropper"
                  :guides="true"
                  :view-mode="2"
                  :center="true"
                  drag-mode="crop"
                  :auto-crop-area="1"
                  :background="true"
                  :rotatable="true"
                  :src="image_preview"
                  :initialAspectRatio="1/1"
                  :aspectRatio="1/1"
                  alt="Source Image"
                  :style="computedImg"
                  :crop="cropImage"
                >
                </vue-cropper>
              </div>
            </b-row>

            <!--            chỗ này cho phép upload image nếu đã chọn image-->

<!--            Chỗ này show list image review-->
            <!-- Loading -->
            <span class="loading-more" v-show="loadingImage"><icon name="loading" width="60" /></span>
            <b-row>
              <b-col md="3" v-for="(item, index) in images" :key="item.image_url">
                <img v-bind:src="item.image_url" style="width: 100%" />
                <label v-show="item.is_default" class="text-success mt-2">Hình mặc định của sản phẩm</label>
                <div class="text-center mt-2">
                  <b-button variant="outline-danger" class="btn-width-120"  v-show="!loadingDelete"
                            @click="deleteImage(item.id, item.image, index)" :disabled="loadingDelete">
                    Xoá hình
                  </b-button>
                  <span class="loading-more" v-show="loadingDelete"><icon name="loading" width="60" /></span>
                </div>
              </b-col>
            </b-row>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>


<script>
import productApi from '@/api/product'
import tradeApi from '@/api/trade'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    VueCropper,
    Multiselect
  },
  data () {
    return {
      loadingGetOptions: false,
      productGroupSelect: {},
      productGroupSearchSelect: {},
      productGroupOptions:[],
      productTypeSelect:{},
      productTypeSearchSelect: {},
      productTypeOptions:[],
      productTypeSearchOptions:[],
      productTypeOptionStore: [],
      productSelect: {},
      productOptions: [],
      productOptionStore: [],
      images: [],
      product: {
        "product_type_id": null,
        "product_group_id": null,
        "product_id": null,
        "is_default": false
      },
      click: false,
      saving: false,
      loadingImage: false,
      loadingDelete: false,
      loading: false,
      image: null,
      image_preview: null,
      file: null,
      height: '100px',
      styleImg: {},

    }
  },
  computed: {
    computedWidth() {
      return this.height
    },
    computedImg() {
      return this.styleImg
    },
  },
  mounted() {
    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()
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

    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },

    checkValidate () {
      return !(this.errorName || this.errorProductType || this.errorProductGroup || this.errorUnit)
    },

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated(data) {
      this.loadingGetOptions = true
      let params = {
        "product_groups": true,
        "product_types": true,
        "products": true
      }
      if(data) {
        params = data
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // product_groups
          if(params.product_groups) {
            this.productGroupOptions = options.product_groups
            let itemEmpty = {"id": null, "name": ""}
            this.productGroupOptions.unshift(itemEmpty)
          }

          // product_types
          if(params.product_types) {
            this.productTypeOptionStore = options.product_types
            this.resetListProductType()
          }

          // products
          if(params.products) {
            this.productOptionStore = options.products
            this.resetListProduct()
          }
        }
        this.loadingGetOptions = false
      }).catch(err => {
        this.loadingGetOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Event change product group
     */
    changeProductGroup() {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        this.product.product_group_id = this.productGroupSelect.id

        // Reload list type by group
        this.productTypeOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.product.product_group_id == this.productTypeOptionStore[i].product_group_id) {
            this.productTypeOptions.push(this.productTypeOptionStore[i])
          }
        }
        if(this.productTypeOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          this.productTypeOptions.unshift(itemEmpty)
        }
      } else {
        this.currentProduct.product_group_id = null

        this.resetListProductType()
      }

      // Reset other info
      this.productTypeSelect = {}
      this.currentProduct.product_type_id = null

      this.productSelect = {}
      this.currentProduct.product_id = null
    },

    resetListProductType() {
      this.productTypeSelect = {}
      this.productTypeOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))

      if(this.productTypeOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        this.productTypeOptions.unshift(itemEmpty)
      }
    },

    /**
     *  Event change product type
     */
    changeProductType() {
      if(this.productTypeSelect && this.productTypeSelect.id) {
        this.product.product_type_id = this.productTypeSelect.id

        // Reload list product by type
        this.productOptions = []
        for (let i in this.productOptionStore) {
          if(this.product.product_type_id == this.productOptionStore[i].product_type_id) {
            this.productOptions.push(this.productOptionStore[i])
          }
        }
        if(this.productOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          this.productOptions.unshift(itemEmpty)
        }

      } else {
        this.product.product_type_id = null

        this.resetListProduct()
      }

      // Reset other info
      this.productSelect = {}
      this.currentProduct.product_id = null
    },

    resetListProduct() {
      this.productSelect = {}
      this.productOptions = JSON.parse(JSON.stringify(this.productOptionStore))

      if(this.productOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        this.productOptions.unshift(itemEmpty)
      }
    },

    /**
     *  Event change product
     */
    changeProduct() {
      if(this.productSelect && this.productSelect.id) {
        this.product.product_id = this.productSelect.id
        this.loadingImage = true
        productApi.getProductImage(this.product.product_id).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.images = res.data.data
          }

          this.loadingImage = false
        }).catch(err => {
          this.loadingImage = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        this.images = []
      }
    },

    /**
     * Xoá hình
     */
    deleteImage(id, image, index) {
      this.loadingDelete = true
      let dataPost = {
        "id": id,
        "image": image
      }
      productApi.deleteProductImage(dataPost).then(res => {
        if(res != null && res.data != null) {
          // Xoá hình, cập nhật lại index
          this.images.splice(index, 1)
        }

        this.loadingDelete = false
      }).catch(err => {
        this.loadingDelete = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Event crop image
     */
    cropImage() {
      // Use to check reupload image when edit
    },

    /**
     * Handle upload file
     */
    handleFileUpload () { // event
      this.image_preview = null
      this.file = this.$refs.file.files[0]//event.target.files[0]
      this.image = this.file.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        // this.$refs.cropper.image = reader.result
        this.image_preview = reader.result
      }.bind(this), false)
      if( this.file ){
        reader.readAsDataURL( this.file )
        this.height = '300px'
        this.styleImg = {'max-width': '100%', 'max-height': '100%'}
      }
    },

    /**
     * Add promotion
     */
    prepareUpload() {
      if(this.image_preview) {
        this.$refs.cropper
          .getCroppedCanvas({
            width: 300,
            height: 300
          })
          .toBlob(blob => {
            const formData = new FormData();
            formData.append("product_id", this.product.product_id)
            formData.append("is_default", this.product.is_default)
            formData.append("image", blob, this.image)

            this.uploadImageFile(formData)
          });
      }
    },

    /**
     * Upload file
     */
    uploadImageFile(formData) {
      this.saving = true
      productApi.uploadProductImage(formData).then(res => {
        this.saving = false
        if(res != null && res.data != null && res.data.data != null){
          this.images = res.data.data

          // Reset data input
          this.image = null
          this.image_preview = null
          this.product.is_default = false

          this.popToast('success', "Upload hình thành công!!!")
        }
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.makeToast('danger', "Upload hình thất bại!!!", errorMess)
      })
    },

  }
}
</script>


