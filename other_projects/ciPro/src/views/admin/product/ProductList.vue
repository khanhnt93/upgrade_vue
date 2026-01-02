<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
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
              <b-col md="2">
                <label>Nhóm SP</label>
                <b-form-select
                id="product_group_id"
                :options="productGroupOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.product_group_id"
                @change="changeProductGroup"></b-form-select>
              </b-col>

              <b-col md="2">
                <label>Loại SP</label>
                <b-form-select
                id="product_type_id"
                :options="productTypeOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.product_type_id"
                :disabled="!inputs.product_group_id"></b-form-select>
              </b-col>

              <b-col md="2">
                <label>Hãng SP</label>
                <b-form-select
                  id="productBrand"
                  :options="productBrandOptions"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.product_brand_id"></b-form-select>
              </b-col>

              <b-col md="3">
                <label>Mã SP</label>
                <input
                  id="code"
                  type="text"
                  maxlength="255"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.code">
              </b-col>

              <b-col md="3">
                <label>Tên SP</label>
                <input
                id="name"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name">
              </b-col>
            </b-row>

            <b-row>
              <b-col md="12" class="mt-2">
                  <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                            @click.prevent="prepareToSearch">
                    Tìm Kiếm
                  </b-button>
              </b-col>
            </b-row>

          <b-row>
            <b-col md="4">
              Số kết quả: {{totalRow}}
            </b-col>
            <b-col md="8" class="text-right" v-if="excel_items.length > 0">
              <download-excel
                class   = "btn btn-default text-header"
                :data   = "excel_items"
                :fields = "excel_fields"
                worksheet = "data"
                name    = "danh_sach_san_pham.xls">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-table
                hover
                bordered
                stacked="md"
                :fields="fields"
                :items="items">
                <template v-slot:cell(price_sell)="data">{{ data.item.price_sell | format_currency}}</template>
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
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </b-card>
      </b-col>
    </b-row>

    <b-modal centered hide-footer hide-header id="modal-import-product" @hide="uploadErrorList = []">
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
                    <a target="_blank" href="https://api.cipro.vn/files/upload_excel_template/ciPro_upload_product_template.xlsx">Tải xuống</a>
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


export default {
  data () {
    return {
      productTypeOptionStore: [],
      productTypeOptions:[],
      productGroupOptions:[],
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
          key: 'price_sell',
          label: 'Giá bán',
          tdClass: 'text-right'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      inputs: {
        code: '',
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
      ],
      excel_items: [],
      excel_fields: {
        'ID': 'id',
        'Nhóm sản phẩm*': 'product_group_name',
        'Loại sản phẩm*': 'product_type_name',
        'Hãng sản phẩm': 'product_brand_name',
        'Mã sản phẩm': 'code',
        'Tên sản phẩm*' : 'name',
        'Đơn vị*' : 'unit_name',
        'Giá list' : 'price_list',
        'Chiết khấu %' : 'discount',
        'Giá bán' : 'price_sell',
        'Mô tả' : 'description'
      },
      isGetExcelItems: false,
    }
  },
  mounted() {
    // Get product group options
    this.getProductGroupOption()

    // Get product brand options
    this.getProductBrandOption()

    // Get product type options
    this.getProductTypeOption()

    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.deleted)

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
      if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + 10
          this.loadByScroll = true
          this.search()
        }
      }
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
     *  Get product brand options
     */
    getProductBrandOption() {
      productApi.getProductBrandOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.productBrandOptions = [{value: null, text: ''}]

          var productBrands = res.data.data
          if(productBrands) {
            for (let i in productBrands) {
              this.productBrandOptions.push(productBrands[i])
            }
          }
        }
      })
    },

    changeProductGroup() {
        this.productTypeOptions = [{value: null, text: ''}]

        for (let i in this.productTypeOptionStore) {
            if(this.inputs.product_group_id == this.productTypeOptionStore[i].product_group_id) {
                let item = {value: this.productTypeOptionStore[i].value, text: this.productTypeOptionStore[i].text}
                this.productTypeOptions.push(item)
            }
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
              this.prepareToSearch()
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
      // this.$router.push('/product/index/' + id)
        window.open('/product/index/' + id, '_blank');
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/product/index/')
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true
      this.isGetExcelItems = false

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
        "code": this.inputs.code.trim(),
        "name": this.inputs.name.trim(),
        "product_type_id": this.inputs.product_type_id,
        "product_group_id": this.inputs.product_group_id,
        "product_brand_id": this.inputs.product_brand_id,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      productApi.searchProductByStaff(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data
          // this.totalRow = res.data.data.total_row

          // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          // if(parseInt(this.offset) + parseInt(this.pageLimit) >= parseInt(this.totalRow)) {
          //   this.hasNext = false
          // }

          if(!this.isGetExcelItems) {
            this.getExcelItem(params)
          } else {
              if(parseInt(this.offset) + parseInt(this.pageLimit) >= parseInt(this.totalRow)) {
                this.hasNext = false
              }
          }

          // if(!this.isGetExcelItems) {
          //   this.getExcelItem(params)
          // }
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

    getExcelItem(params) {
      if(this.isGetExcelItems) {
        return;
      }

      this.excel_items = []

      // Define params
      params.offset = 0
      params.limit = 999999

      // Search
      productApi.searchProductByStaff(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data
          this.totalRow = this.excel_items.length
          if(parseInt(this.offset) + parseInt(this.pageLimit) >= parseInt(this.totalRow)) {
                this.hasNext = false
              }
          this.isGetExcelItems = true
        }
      }).catch(err => {})
    },

      /**
     * Show modal import from file
     */
    openModalImportFile () {
      this.$bvModal.show('modal-import-product')
    },

    /**
     * Import file
     */
    importProductFromExcelFile() {
      this.uploading = true
      const form_data = new FormData();
      form_data.append("importFile", this.fileUpload)
      productApi.importProductFromExcelFile(form_data).then(res => {
        if(res != null && res.data != null){
          let errors = res.data.data
            if(errors.length == 0) {
              // Load list when load page
              this.$bvModal.hide('modal-import-product')
              this.popToast('success', "Upload sản phẩm hoàn tất!")
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
      this.fileUpload = this.$refs.file.files[0]
      document.getElementById("custom-file-label").innerHTML = this.fileUpload.name
    }
  }
}
</script>
