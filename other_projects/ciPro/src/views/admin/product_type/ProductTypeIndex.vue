<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">

              <b-row>
              <b-col cols="6">
                <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="back">
                  Quay lại
                </b-button>
              </b-col>
              <b-col cols="6">
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="save" :disabled="saving">
                    Lưu
                </b-button>
              </b-col>
            </b-row>

              <b-row>
                <b-col md='12'>
                  <h4 class="mt-2 text-center text-header">{{prefix_text}}Loại Sản Phẩm</h4>
                </b-col>
              </b-row>
              <hr/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Nhóm sản phẩm </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <b-form-select
                  :options="productGroupOptions"
                  id="productGroup"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productType.product_group_id"></b-form-select>
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorProductGroup">
                    Vui lòng nhập nhóm sản phẩm
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Mã loại sản phẩm </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="code"
                  type="text"
                  maxlength="30"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productType.code">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCode">
                    Vui lòng nhập mã loại sản phẩm
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>

              <b-row class="form-row">
                <b-col md="3" class="mt-2">
                  <label> Tên loại sản phẩm </label><span class="error-sybol"></span>
                </b-col>
                <b-col md="9">
                  <input
                  id="name"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="productType.name">
                  <b-form-invalid-feedback  class="invalid-feedback" :state="!errorName">
                    Vui lòng nhập tên loại sản phẩm
                  </b-form-invalid-feedback>
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
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
  },
  data () {
    return {
      prefix_text: '',
      productGroupOptions:[],
      productType: {
        "product_group_id": null,
        "code": null,
        "name": null,
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

    // Get product group option
    this.getProductGroupOption()

    this.getProductTypeDetail()
  },
  computed: {
    errorProductGroup: function () {
      return this.checkInfo(this.productType.product_group_id)
    },
    errorCode: function () {
      return this.checkInfo(this.productType.code)
    },
    errorName: function () {
      return this.checkInfo(this.productType.name)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorProductGroup || this.errorCode || this.errorName)
    },

    /**
     *  Get product group options
     */
    getProductGroupOption() {

      productApi.getProductGroupOption().then(res => {
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
     * Get detail
     */
    getProductTypeDetail() {
      let productTypeId = this.$route.params.id
      if(productTypeId){
        this.loading = true

        productApi.getProductTypeDetail(productTypeId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.productType = res.data.data
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
      this.$router.push('/product-type')
    },

    /**
     * Save
     */
    save () {
      this.click = true

      let result = this.checkValidate()
      if(result) {
        this.saving = true

        let productTypeId = this.$route.params.id
        if(productTypeId){
          // Edit
          this.productType.id = productTypeId
          productApi.updateProductType(this.productType).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.popToast('success', 'Cập nhật loại sản phẩm thành công!!! ')
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
          productApi.addProductType(this.productType).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.$router.push("/product-type")
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
    }
  }
}
</script>
