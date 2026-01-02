<template>
  <div class="container-fluid">
    <b-row>
      <b-col>

      <b-card>
        <b-row>
          <b-col md='12'>
              <b-button variant="outline-primary" class="pull-right btn-width-120 mr-2" @click="openModalImportFile">
                Upload
              </b-button>
              <b-button variant="outline-success" class="pull-right btn-width-120 mr-2" @click="isShowModalPrintTem = true">
                In tem nhãn
              </b-button>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <h3 class="text-header text-center">Sản Phẩm Trong Kho</h3>
          </b-col>
        </b-row>

          <b-row>
            <b-col md="2">
              <label>Nhóm SP</label>
              <multiselect
                v-model="productGroupSelect"
                :options="productGroupOptions"
                :loading="loadingOption"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn nhóm sản phẩm--"
                label="name"
                track-by="name"
                @input="changeProductGroup">
              </multiselect>
            </b-col>

            <b-col md="3">
              <label>Loại SP </label>
              <multiselect
                v-model="productTypeSelect"
                :options="productTypeOptions"
                :loading="loadingOption"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn loại sản phẩm--"
                label="name"
                track-by="name"
                @input="changeProductType">
              </multiselect>
            </b-col>

            <b-col md="3">
              <label>Hãng SP</label>
              <multiselect
                v-model="productBrandSelect"
                :options="productBrandOptions"
                :loading="loadingOption"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn hãng SP--"
                label="text"
                track-by="text">
              </multiselect>
            </b-col>

            <b-col md="3">
              <label>Sản phẩm</label>
              <multiselect
                v-model="productSelect"
                :options="productOptions"
                :loading="loadingProductOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn sản phẩm--"
                label="name_full"
                track-by="name_full">
              </multiselect>
            </b-col>
          </b-row>

        <b-row class="mt-2">
          <b-col md="6">
            <h5>TỔNG GIÁ TRỊ TỒN KHO: <span class="text-header">{{currencyFormat(total_amount)}}đ</span></h5>
          </b-col>
            <b-col md="6">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                        @click.prevent="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>

          </b-row>

        <b-row>
            <b-col md="12">
              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{totalRow}}</b></span></div>

              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "excel_items"
                :fields = "excel_fields"
                worksheet = "Sản phẩm trong kho"
                name    = "Sản phẩm trong kho">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

        <b-row>
          <b-col md="12" class="table-cus">
            <table class="table table-bordered table-striped fixed_header">
              <colgroup>
                <col style="width:3%">
                <col style="width:8%">
                <col style="width:8%">
                <col style="width:8%">
                <col style="width:16%">
                <col style="width:20%">
                <col style="width:8%">
                <col style="width:9%">
                <col style="width:9%">
                <col style="width:9%">
              </colgroup>
              <tr>
                <th>STT</th>
                <th>Nhóm SP</th>
                <th>Loại SP</th>
                <th>Hãng SP</th>
                <th>Mã SP</th>
                <th>Tên SP</th>
                <th>Số lượng</th>
                <th>Đơn giá nhập</th>
                <th>Thành tiền</th>
                <th>SL đang tạm giữ chờ xuất kho</th>
              </tr>
              <tr>
                <td colspan="6" class="text-center text-header text-bold"><b>Tổng</b></td>
                <td class="text-header text-right"><b>{{ currencyFormat(total_quantity) }}</b></td>
                <td class="text-header text-right"><b>{{ currencyFormat(total_price_buy) }}</b></td>
                <td class="text-header text-right"><b>{{ currencyFormat(total_amount_buy) }}</b></td>
                <td class="text-header text-right"><b>{{ currencyFormat(total_quantity_keep) }}</b></td>
              </tr>
              <tr v-for="(item) in items">
                <td>{{item.stt}}</td>
                <td>{{item.product_group_name}}</td>
                <td>{{item.product_type_name}}</td>
                <td>{{item.brand_name}}</td>
                <td>{{item.product_code}}</td>
                <td>{{item.product_name}}</td>
                <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                <td class="text-right">{{currencyFormat(item.price_buy)}}</td>
                <td class="text-right">{{currencyFormat(item.amount_buy)}}</td>
                <td class="text-right">
                  {{currencyFormat(item.quantity_keep)}}
                  <span v-show="item.quantity_keep" class="ml-2">
                    <i class="fa fa-info-circle" title="Danh sách đang giữ" @click="showModalDetailKeepProduct(item)"/>
                  </span>
                </td>
              </tr>
            </table>
          </b-col>
        </b-row>

        <!-- Loading -->
        <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
        <span class="loading-more" v-if="hasNext === false">--Hết--</span>
        <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>

        </b-card>
      </b-col>
    </b-row>

    <b-modal centered hide-footer hide-header id="modal-import-repository" @hide="uploadErrorList = []">
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
                    <a target="_blank" href="https://api.cipro.vn/files/upload_excel_template/ciPro_upload_repository_product_template.xlsx">Tải xuống</a>
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

    <b-modal centered hide-footer hide-header size="xl" id="modal-list-keep-product">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Danh Sách Giữ Hàng</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          Mã SP: {{currentProduct.product_code}}
        </b-col>
        <b-col md="6">
          Tên SP: {{currentProduct.product_name}}
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          Hãng SP: {{currentProduct.brand_name}}
        </b-col>
        <b-col md="6">
          Số lượng giữ bởi ĐH khác: {{currencyFormat(currentProduct.quantity_keep)}}
        </b-col>
      </b-row>
      <hr>
      <span class="loading-more" v-show="loadingKeepProduct"><icon name="loading" width="60" /></span>

      <b-row class="mt-2">
        <b-col>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="keepProductFields"
            :items="keepProductItems">
            <template v-slot:cell(quantity_keep)="data">{{ currencyFormat(data.item.quantity_keep) }}</template>
            <template v-slot:cell(actions)="dataId">
              <b-list-group horizontal>
                <b-list-group-item v-b-tooltip.hover title="Delete" @click="deleteKeepProduct(dataId.item.id, dataId.item.product_id, dataId.item.quantity_keep)">
                  <i class="fa fa-trash" />
                </b-list-group-item>
              </b-list-group>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-danger" class="pull-right btn-width-120"
                    @click.prevent="hideModalDetailKeepProduct">
            Đóng
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

    <b-modal 
      v-model="isShowModalPrintTem"
      centered 
      hide-footer 
      hide-header 
      size="xl" 
      id="modal-print-temp">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Chọn Sản Phẩm In Tem Nhãn</h4>
        </b-col>
      </b-row>

      <label>
        <input type="checkbox" v-model="selectAll" @change="toggleAll" />
        <strong>Chọn tất cả</strong>
      </label>

      <div v-for="(product, index) in products_print" :key="product.id">
        <label>
          <input
            type="checkbox"
            v-model="product.selected"
          />
          {{ product.product_code }} - {{ product.product_name }}
        </label>
      </div>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="isShowModalPrintTem = false">
            Bỏ qua
          </b-button>
          <b-button variant="outline-success" class="pull-right btn-width-120"
                    @click.prevent="confirmPrint">
            Xác nhận in
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Khu vực nội dung in -->
    <div id="printArea" ref="printArea" v-show="isShowModalPrintTem">
      <div
        class="label"
        v-for="product in products_print.filter(p => p.selected)"
        :key="product.id"
      >
        <div>Tên hàng: <strong>{{ product.product_name }}</strong></div>
        <div>Mã SP: {{ product.product_code }}</div>
        <div>Đơn vị: {{ product.brand_name }}</div>
        <div>Hãng: {{ product.brand_name }}</div>
        <div>Xuất xứ: {{ product.brand_name }}</div>

        <div style="margin-top: 1rem;"><strong>{{ company_info.name }}</strong></div>
        <div>{{ company_info.address }}</div>
        <div>Tel: {{ company_info.phone_number }}</div>
      </div>
    </div>

  </div>
</template>

<script>

import {Constant} from '@/common/constant'
import repositoryApi from "@/api/repository";
import quotationApi from '@/api/quotation'
import commonFunc from "@/common/commonFunc";
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Multiselect
  },
  data() {
    return {
      loadingOption: false,
      company_info: {},
      inputs: {
        product_group_id: null,
        product_type_id: null,
        code: null,
        name: null
      },
      productBrandOptions: [],
      productBrandSelect: {},
      productTypeSelect: {},
      productTypeOptions:[],
      productTypeOptionStore: [],
      productGroupSelect: {},
      productGroupOptions:[],
      productSelect: {},
      productOptions: [],
      loadingProductOptions: false,
      items: [],
      selectAll: true,
      products_print: [],
      excel_items: [],
      excel_fields: {
        '#No' : 'stt',
        'Nhóm SP' : 'product_group_name',
        'Loại SP': 'product_type_name',
        'Hãng SP': 'brand_name',
        'Mã sản phẩm' : 'product_code',
        'Sản phẩm' : 'product_name',
        'Số lượng': 'quantity',
        'Đơn giá nhập': 'price_buy',
        'Thành tiền': 'amount_buy',
        'Số lượng đang tạm giữ chờ xuất kho': 'quantity_keep',
      },
      total_amount: 0,
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      totalRow: 0,
      isGetExcelItems: false,
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
      keepProductFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'order_sell_number',
          label: 'Mã ĐH'
        },
        {
          key: 'quantity_keep',
          label: 'Số lượng giữ'
        },
        {
          key: 'actions',
          label: ''
        },
      ],
      keepProductItems: [],
      loadingKeepProduct: false,
      currentProduct: {},
      total_quantity: 0,
      total_price_buy: 0,
      total_amount_buy: 0,
      total_quantity_keep: 0,
      isShowModalPrintTem: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    this.getProductOptions()
    this.getOptions()

    // Search
    this.prepareToSearch()

    // Get store info
    this.getStoreDetail()
  },
  methods: {
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: "my-toast",
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      });
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
     * Get detail
     */
    getStoreDetail() {
        repositoryApi.getStoreDetail().then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.company_info = res.data.data

            var address = ""
            if(this.company_info.address) {
                address += this.company_info.address
            }
            if(this.company_info.district_name) {
                address += this.company_info.district_name
            }
            if(this.company_info.city_name) {
                address += ", " + this.company_info.city_name
            }
            this.company_info.address = address
          }
        }).catch(err => {})
    },

    /**
     *  Get options
     */
    getOptions() {
      this.loadingOption = true

      let params = {
        "product_brands": true,
        "product_groups": true,
        "product_types": true
      }

      repositoryApi.getOptionsRelatedRepository(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.productGroupOptions = res.data.data.product_groups
          let itemGroupEmpty = {"id": null, "name": ""}
          this.productGroupOptions.unshift(itemGroupEmpty)

          let product_types = res.data.data.product_types
          this.productTypeOptionStore = product_types
          this.productTypeOptions = product_types
          let itemTypeEmpty = {"id": null, "name": "", "product_group_id": null}
          this.productTypeOptions.unshift(itemTypeEmpty)

          let product_brands = res.data.data.product_brands
          this.productBrandOptions = product_brands
          let itemBrandEmpty = {"value": null, "text": ""}
          this.productBrandOptions.unshift(itemBrandEmpty)
        }

        this.loadingOption = false
      }).catch(err => {
          this.loadingOption = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Get customer options
     */
     getProductOptions() {
      this.loadingProductOptions = true

      quotationApi.getProductOptions().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          // Products
          this.productOptions = res.data.data
          let itemEmpty = {"id": null, "name_full": ''}
          this.productOptions.unshift(itemEmpty)
          // this.resetListProduct()
          // this.changeProductType(true)
        }

        this.loadingProductOptions = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingProductOptions = false
      })
    },

    changeProductGroup() {
      if(this.productGroupSelect && this.productGroupSelect.id) {
          this.productTypeOptions = []
          for (let item of this.productTypeOptionStore) {
            if(this.productGroupSelect.id == item.product_group_id) {
              this.productTypeOptions.push(item)
            }
          }
      } else {
          this.productTypeOptions = this.productTypeOptionStore
      }
      let itemTypeEmpty = {"id": null, "name": "", "product_group_id": null}
      this.productTypeOptions.unshift(itemTypeEmpty)
      this.productTypeSelect = this.productTypeOptions[0]
      this.productSelect = this.productOptions[0]
    },

    changeProductType() {
      this.productSelect = this.productOptions[0]
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
     * Get list product in repository
     */
      search() {
        if (this.onSearch) { return }

        this.onSearch = true
        this.loading = true
        let product_group_id = null
        if(this.productGroupSelect && this.productGroupSelect.id) {
          product_group_id = this.productGroupSelect.id
        }
        let product_type_id = null
        if(this.productTypeSelect && this.productTypeSelect.id) {
          product_type_id = this.productTypeSelect.id
        }
        let params = {
          "product_group_id": product_group_id,
          "product_type_id": product_type_id,
          "product_brand_id": this.productBrandSelect && this.productBrandSelect.value ? this.productBrandSelect.value : null,
          "product_id": this.productSelect && this.productSelect.id ? this.productSelect.id : null,
          "limit": this.pageLimit,
          "offset": this.offset
        }
        repositoryApi.getListProductInRepository(params).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            let it = res.data.data.repositorys
            this.totalRow = res.data.data.total_row
            this.total_amount = res.data.data.total_amount

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

            if(!this.isGetExcelItems) {
              this.getExcelItem(params)
            }
          } else {
            this.items = []
            this.excel_items = []
          }
          this.onSearch = false
          this.loading = false
      }).catch(err => {
          this.onSearch = false
          this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    getExcelItem(params) {
        if(this.isGetExcelItems) {
          return;
        }

      this.excel_items = []

      // Define params
      params.limit = 999999

      // Search
      repositoryApi.getListProductInRepository(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.excel_items = res.data.data.repositorys
          this.products_print = JSON.parse(JSON.stringify(res.data.data.repositorys))
          this.isGetExcelItems = true

          this.total_quantity = 0
          this.total_price_buy = 0
          this.total_amount_buy = 0
          this.total_quantity_keep = 0
          for(let item of this.excel_items) {
            this.total_quantity += parseFloat(item.quantity)
            this.total_price_buy += parseInt(item.price_buy)
            this.total_amount_buy += parseInt(item.amount_buy)
            this.total_quantity_keep += parseFloat(item.quantity_keep)
          }
          this.total_quantity = Math.round(this.total_quantity  * 100) / 100
          this.total_quantity_keep = Math.round(this.total_quantity_keep  * 100) / 100

          for(let item of this.products_print) {
            item.selected = true
          }
        }
      }).catch(err => {})
    },

      /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
        if(num == 0) {
          return 0
        }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

    /**
     * Show modal import from file
     */
    openModalImportFile () {
      this.$bvModal.show('modal-import-repository')
    },

    // openModalPrintTemp () {
    //   this.$bvModal.show('modal-print-temp')
    // },

    handleFileUpload() {
      this.fileUpload = this.$refs.file.files[0]
      document.getElementById("custom-file-label").innerHTML = this.fileUpload.name
    },

    /**
     * Import file
     */
    importProductFromExcelFile() {
      this.uploading = true
      const form_data = new FormData();
      form_data.append("importFile", this.fileUpload)
      repositoryApi.importFromExcelFile(form_data).then(res => {
        if(res != null && res.data != null){
            if(res.data.data == null) {
              // Load list when load page
              this.$bvModal.hide('modal-import-repository')
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

    getListKeepProduct(product_id) {
      this.loadingKeepProduct = true

      repositoryApi.getListKeepProduct(product_id).then(res => {
        if (res != null && res.data != null) {
          this.keepProductItems = res.data.data
        }
        this.loadingKeepProduct = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingKeepProduct = false
      })
    },

    deleteKeepProduct(id, product_id, quantity_keep) {
      this.loadingKeepProduct = true
      repositoryApi.deleteKeepProduct({id: id, product_id: product_id}).then(res => {
        if (res != null && res.data != null && res.data.data) {
          this.keepProductItems = res.data.data
          this.currentProduct.quantity_keep -= quantity_keep
          this.prepareToSearch()
        }
        this.loadingKeepProduct = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingKeepProduct = false
      })
    },

    showModalDetailKeepProduct(product) {
        this.currentProduct = product
      this.getListKeepProduct(product.product_id)

      this.$bvModal.show('modal-list-keep-product')
    },

    hideModalDetailKeepProduct() {
      this.$bvModal.hide('modal-list-keep-product')
    },

    // hideModalPrintTemp() {
    //   this.$bvModal.hide('modal-print-temp')
    // },

    toggleAll() {
      this.products_print.forEach(p => {
        p.selected = this.selectAll;
      });
    },

    confirmPrint() {
      setTimeout(() => {
        this.printSelected();
      }, 1000);
    },

    printSelected() {
      let page_width = '5cm'
      if (this.company_info && this.company_info.printer_width) {
        page_width = this.company_info.printer_width + 'cm'
      }
      let page_height = '3cm'
      if (this.company_info && this.company_info.printer_height) {
        page_height = this.company_info.printer_height + 'cm'
      }
      let font_size_header = '6px'
      let font_size = '5px'
      if (this.company_info && this.company_info.printer_font_size) {
        font_size = this.company_info.printer_font_size + 'px'
        font_size_header = (parseInt(this.company_info.printer_font_size) + 1) + 'px'
      }
      let printContent = document.createElement('div');

      const selectedItems = this.products_print.filter(p => p.selected);

      selectedItems.forEach(p => {
        const label = document.createElement('div');
        label.className = 'label';
        label.innerHTML = `
          <div class="label-box">
            <div style="padding-top: 2px; padding-left: 2px;">
              <p class="label-header">${p.product_name}</p>
              <p>Mã hàng: ${p.product_code}</p>
              <p>Đơn vị: ${p.unit_name}</p>
              <p>Xuất xứ: ${p.brand_name}</p>
              <p style="padding-top: 5px;"><strong>${this.company_info.name}</strong></p>
              <p>${this.company_info.address}</p>
              <p>Tel: ${this.company_info.phone_number}</p>
            </div>
          </div>
        `;
        printContent.appendChild(label);
      }); 
      // const printContent = this.$refs.printArea;
      // printContent.style.visibility = 'visible';
      var mywindow = window.open('', 'PRINT', 'height=600,width=800');

      mywindow.document.write('<html><head><title> </title>');
      mywindow.document.write(`
        <style>
          @page {
            size: ${page_width} ${page_height} landscape;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .label {
            width: ${page_width};
            height: ${page_height};
            page-break-after: always;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: ${font_size};
          }

          .label-box {
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .label-header {
            font-size: ${font_size_header};
            font-weight: bold;
            text-align: center;
          }
        </style>
      `);
      mywindow.document.write('</head><body>');
      mywindow.document.write(printContent.innerHTML);
      mywindow.document.write('</body></html>');

      console.log("==========================");
      console.log(mywindow.document.head.innerHTML);
      console.log(mywindow.document.body.innerHTML);
      console.log("==========================");

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      setTimeout(function() {
        mywindow.print();
        mywindow.close();
      }, 1000);

      return true;
    }

  }
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }
</style>
