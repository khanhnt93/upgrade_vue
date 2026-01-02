<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="gotoAdd">
                Thêm
              </b-button>

              <b-button variant="outline-primary" class="pull-right btn-width-120 mr-2" @click="openModalImportFile">
                Upload
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Danh Sách Sản Phẩm</h4>
            </b-col>
          </b-row>
          <hr>

            <b-row class="form-row">
              <b-col md="3">
                <label> Nhóm SP </label>
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

              <b-col md="3">
                <label> Loại SP </label>
                <multiselect
                  v-model="productTypeSelect"
                  :options="productTypeOptions"
                  :loading="loadingGetOptions"
                  placeholder="--Chọn loại sản phẩm--"
                  label="name"
                  track-by="name">
                </multiselect>
              </b-col>

              <b-col md="3">
                <label> Hãng SP </label>
                <b-form-select
                  id="productBrand"
                  :options="productBrandOptions"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.product_brand_id"></b-form-select>
              </b-col>

              <b-col md="3">
                <label> Tên SP</label>
                <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name">
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12">
                  <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                            @click.prevent="prepareToSearch">
                    Tìm Kiếm
                  </b-button>
              </b-col>
            </b-row>

          <b-row>
            <b-col>
              Số kết quả: {{totalRow}}
            </b-col>
          </b-row>

          <b-table
          hover
          bordered
          stacked="md"
          :fields="fields"
          :items="items">
          <template v-slot:cell(actions)="dataId">
            <b-list-group horizontal>
              <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                <i class="fa fa-edit" />
              </b-list-group-item>
              <b-list-group-item v-b-tooltip.hover title="Delete" @click="deleted(dataId.item.id, dataId.item.name, dataId.item.stt)">
                <i class="fa fa-trash" />
              </b-list-group-item>
            </b-list-group>
          </template>
          </b-table>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </b-card>
      </b-col>
    </b-row>

    <b-modal centered hide-footer hide-header id="modal-import-product">
      <b-row>
        <b-col class="text-center">
          <form method="post" id="formImport" enctype="multipart/form-data">

              <b-row>
                <b-col>
                  <h4 class="modal-title">Upload sản phẩm từ file excel</h4>
                </b-col>
              </b-row>
              <b-row class="text-left">
                <b-col>
                  <p>
                    Tải xuống file mẫu:
                    <a target="_blank" href="https://api.cisale.vn/files/upload_excel_template/ciSale_upload_product_template.xlsx">Tải xuống</a>
                  </p>
                </b-col>
              </b-row>
              <hr>
              <div class="modal-body">
                  <div class="custom-file">
                    <label>Chọn file excel bạn muốn upload
                      <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept=".xlsx"/>
                    </label>
                  </div>
              </div>

          </form>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-right mt-3">
          <!-- Loading -->
          <span class="loading-more" v-show="uploading"><icon name="loading" width="60" /></span>
          <button class="btn btn-primary px-4 default-btn-bg" v-show="!uploading" @click="importProductFromExcelFile()" :disabled="!fileUpload || uploading">
            Upload
          </button>
        </b-col>
      </b-row>

      <b-row v-show="uploadErrorList.length > 0" class="mt-2">
        <b-col>
          <b-table
          hover
          bordered
          stacked="md"
          :fields="uploadErrorField"
          :items="uploadErrorList">
          </b-table>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>
<script>
import productApi from '@/api/product'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import tradeApi from '@/api/trade'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Multiselect
  },
  data () {
    return {
      productGroupSelect: {},
      productGroupOptions:[],
      productTypeSelect:{},
      productTypeOptions:[],
      productTypeOptionStore: [],
      loadingGetOptions: false,
      productBrandOptions:[],
      perPage: '10',
      currentPage: '1',
      fields: [
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
          key: 'product_brand_name',
          label: 'Hãng SP'
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
      items: [],
      inputs: {
        name: '',
        product_type_id: null,
        product_group_id: null,
        product_brand_id: null
      },
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      listIdDeleted: [],
      totalRow: 0,
      fileUpload: null,
      fileName: "Chọn file excel bạn muốn upload",
      uploading: false,
      uploadErrorList: [],
      uploadErrorField: [
          {
          key: 'row',
          label: 'Dòng'
        },
        {
          key: 'mess',
          label: 'Mô tả lỗi'
        },
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // Search
    this.search()
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
     * Scroll event
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + this.pageLimit
          this.loadByScroll = true
          this.search()
        }
      }
    },

      /**
     *  Get product brand options
     */
    getProductBrandOption(brands) {
      this.productBrandOptions = [{value: null, text: ''}]
      if(brands) {
        for (let i in brands) {
          this.productBrandOptions.push(brands[i])
        }
      }
    },

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated() {
      this.loadingGetOptions = true
      let params = {
        "product_groups": true,
        "product_types": true,
        "product_brands": true
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // product_groups
          if (params.product_groups) {
            this.productGroupOptions = options.product_groups
            let itemEmpty = {"id": null, "name": ""}
            this.productGroupOptions.unshift(itemEmpty)
          }

          // product_types
          if (params.product_types) {
            this.productTypeOptionStore = options.product_types
            this.resetListProductType()
          }

          // product_brands
          if (params.product_brands) {
            this.getProductBrandOption(options.product_brands)
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
     *  Event change product group
     */
    changeProductGroup() {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        // Reload list type by group
        this.productTypeOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.productGroupSelect.id == this.productTypeOptionStore[i].product_group_id) {
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
        this.resetListProductType()
      }
    },

    /**
     * Delete
     * @param id
     * @param name
     * @param rowIndex
     */
    deleted (id, name, rowIndex) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            productApi.deleteProduct(id).then(res => {
              // Reload data
              this.search()
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
        }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/product/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/product/index/')
    },

      /**
     * Show modal import from file
     */
    openModalImportFile () {
      this.$bvModal.show('modal-import-product')
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true

      this.search()
    },

    /**
     * Search
     */
    search () {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true

      let params = {
        "name": this.inputs.name,
        "product_brand_id": this.inputs.product_brand_id,
        "product_group_id": this.productGroupSelect && this.productGroupSelect.id ? this.productGroupSelect.id : null,
        "product_type_id": this.productTypeSelect && this.productTypeSelect.id ? this.productTypeSelect.id : null,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      productApi.searchProductByStaff(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.products
          this.totalRow = res.data.data.total_row

          // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          // Check has next
          if(this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }
        } else {
          this.items = []
        }
          this.onSearch = false
          this.loading = false
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)

          this.onSearch = false
          this.loading = false
      })
    },

      /**
     * Import file
     */
    importProductFromExcelFile() {
      this.uploading = true
      const form_data = new FormData();
      form_data.append("importFile", this.fileUpload)
      productApi.importProductFromExcelFile(form_data).then(res => {
        if(res != null && res.data != null && res.data.data != null){
            if(res.data.data.length == 0) {
              // Load list when load page
              this.$bvModal.hide('modal-import-product')
            } else {
              this.uploadErrorList = res.data.data
            }
        }
        this.prepareToSearch()
        this.uploading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.uploading = false
      })

    },

    /**
     *
     */
    handleFileUpload() {
      this.fileUpload = this.$refs.file.files[0];
      console.log(this.fileUpload)
      // document.getElementById("custom-file-label").innerHTML = this.fileUpload.name
    }
  }
}
</script>
