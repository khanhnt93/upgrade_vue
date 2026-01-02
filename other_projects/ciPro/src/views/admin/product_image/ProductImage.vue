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
              <b-col md="9">
                <b-form-select
                  :options="productGroupOptions"
                  id="productGroup"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.product_group_id"
                  @change="changeProductGroup"></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Loại sản phẩm </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <b-form-select
                  :options="productTypeOptions"
                  id="productType"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="product.product_type_id"
                  @change="changeProductType"
                  :disabled="!product.product_group_id"></b-form-select>
              </b-col>
            </b-row>

            <b-row class="form-row">
              <b-col md="3" class="mt-2">
                <label>Sản phẩm </label><span class="error-sybol"></span>
              </b-col>
              <b-col md="9">
                <div class="input-group">
                  <b-form-select
                    :options="productOptions"
                    id="productType"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    v-model="product.product_id"
                    :disabled="!product.product_type_id"
                    @change="changeProduct"></b-form-select>

                  <b-button variant="outline-primary" class="pull-right ml-2" @click="showModalSearchProduct" >
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>
              </b-col>
            </b-row>

            <b-row class="form-row" v-show="product.product_id">
              <b-col md="3" class="mt-2">
                <label> Thêm hình ảnh </label>
              </b-col>
              <b-col md="9">
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
              <b-col md="9">
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
              <b-col md="3" v-for="(item, index) in images">
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

    <!--Modal tìm kiếm sản phẩm -->
    <b-modal centered hide-footer hide-header no-close-on-backdrop size="xl" id="modal-search-product">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Tìm kiếm sản phẩm</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="form-row">
        <b-col md="3" class="mt-2">
          <label> Nhóm sản phẩm </label>
          <b-form-select
            :options="productGroupOptions"
            id="productGroupCus"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="product.product_group_id"
            @change="changeProductGroup"></b-form-select>
        </b-col>

        <b-col md="3" class="mt-2">
          <label> Loại sản phẩm </label>
          <b-form-select
            :options="productTypeOptions"
            id="productTypeCus"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="product.product_type_id"></b-form-select>
        </b-col>

        <b-col md="3" class="mt-2">
          <label> Mã sản phẩm </label>
          <input
            id="codeProductCus"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="productSearch.code"
            maxlength="30">
        </b-col>

        <b-col md="3" class="mt-2">
          <label> Tên sản phẩm </label>
          <input
            id="nameProductCus"
            type="text"
            autocomplete="new-password"
            class="form-control"
            v-model="productSearch.name"
            maxlength="255">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click.prevent="hideModalSearchProduct">
            Quay lại
          </b-button>

          <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearchProduct"
                    @click.prevent="searchProduct">
            Tìm Kiếm
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="productSearchFields"
            :items="productSearchItems">
            <template v-slot:cell(actions)="data">
              <b-button variant="outline-success" class="pull-right btn-width-120"
                        @click.prevent="chooseProduct(data.item.product_group_id, data.item.product_type_id, data.item.id)">
                Chọn
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>


<script>
import productApi from '@/api/product'
import commonFunc from '@/common/commonFunc'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'


export default {
  components: {
    VueCropper
  },
  data () {
    return {
      productTypeOptionStore: [],
      productOptionStore: [],
      productTypeOptions:[],
      productGroupOptions:[],
      productOptions: [],
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
      productSearch: {
        "code": null,
        "name": null
      },
      onSearchProduct: false,
      productSearchFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'product_group_name',
          label: 'Nhóm SP'
        },
        {
          key: 'product_type_name',
          label: 'Loại SP'
        },
        {
          key: 'code',
          label: 'Mã SP'
        },
        {
          key: 'name',
          label: 'Tên SP'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      productSearchItems: [],
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
    // Get product group options
    this.getProductGroupOption()

    // Get product type options
    this.getProductTypeOption()

    // Get product options
    this.getProductOption()
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

    showModalSearchProduct() {
      this.$bvModal.show('modal-search-product')
    },

    hideModalSearchProduct() {
      this.$bvModal.hide('modal-search-product')
    },

    /**
     *  Get product type options
     */
    getProductTypeOption() {
      productApi.getProductTypeOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.productTypeOptionStore = res.data.data
        }
      })
    },

    changeProductGroup(flagNew) {
        if(!flagNew) {
            this.product.product_id = null
        }

        this.images = []

        this.productTypeOptions = [{value: null, text: ''}]

        for (let i in this.productTypeOptionStore) {
            if(this.product.product_group_id == this.productTypeOptionStore[i].product_group_id) {
                let item = {value: this.productTypeOptionStore[i].value, text: this.productTypeOptionStore[i].text}
                this.productTypeOptions.push(item)
            }
        }
    },

    /**
     *  Event change product type
     */
    changeProductType(flagNew) {
        if(!flagNew) {
            this.product.product_id = null
        }

        this.images = []
      this.productOptions = [{value: null, text: ''}]

      for (let i in this.productOptionStore) {
        if(this.product.product_type_id == this.productOptionStore[i].product_type_id) {
          let item = {value: this.productOptionStore[i].id, text: this.productOptionStore[i].name}
          this.productOptions.push(item)
        }
      }
    },

    /**
     *  Get product group options
     */
    getProductGroupOption() {

      productApi.getProductGroupOption().then(res => {
          console.log("xx")
        if(res != null && res.data != null && res.data.data != null) {
          this.productGroupOptions = [{value: null, text: ''}]

          var productGroups = res.data.data
          if(productGroups) {
            for (let i in productGroups) {
              this.productGroupOptions.push(productGroups[i])
            }
          }
        }
      })
    },

    /**
     *  Get product options
     */
    getProductOption() {
      productApi.getProductOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.productOptionStore = res.data.data
        }
      })
    },

    /**
     *  Event change product
     */
    changeProduct() {
      if(this.product.product_id) {
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
     * Search
     */
    searchProduct() {
      this.productSearchItems = []

      if (this.onSearchProduct) { return }

      this.onSearchProduct = true

      let params = {
        "name": this.productSearch.name,
        "code": this.productSearch.code,
        "product_type_id": this.product.product_type_id,
        "product_group_id": this.product.product_group_id,
        "limit": 50,
        "offset": 0
      }

      productApi.searchProductByStaff(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.productSearchItems = res.data.data.products
        } else {
          this.productSearchItems = []
        }
        this.onSearchProduct = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.onSearchProduct = false
      })
    },

    chooseProduct(product_group_id, product_type_id, product_id) {
      this.product.product_group_id = product_group_id
      this.product.product_type_id = product_type_id
      this.product.product_id = product_id

        this.changeProductGroup(true)
        this.changeProductType(true)
      this.changeProduct()

      this.$bvModal.hide('modal-search-product')
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

          // Cập nhật lại index của mảng TODO
          // let index = 0
          // for (let i in this.images) {
          //   this.images[i].index = index
          //   index += 1
          // }
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


