<template>
  <div class="container-fluid">
    <b-row>
      <b-col>

      <b-card>
        <b-row>
          <b-col>
            <b-button variant="outline-success" class="pull-right btn-width-120" @click.prevent="goToRepoHis">
              Lịch sử kho
            </b-button>

            <b-button variant="outline-primary" class="pull-right btn-width-120 mr-2" @click="openModalImportFile">
              Upload
            </b-button>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <h3 class="text-header text-center">Sản Phẩm Trong Kho</h3>
          </b-col>
        </b-row>

          <b-row>
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
                <label> Tên SP</label>
                <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name">
              </b-col>

            <b-col md="3">
              <label class="label-width text-white">
                Xem
              </label>
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                        @click.prevent="getListProductInRepository">
                Tìm Kiếm
              </b-button>
            </b-col>

          </b-row>

        <b-row>
            <b-col md="12">
              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{items.length}}</b></span></div>

              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "items"
                :fields = "excel_fields"
                worksheet = "Lịch sử kho"
                name    = "Lịch sử kho">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>

          <b-card-body class="p-4">
            <b-table
              hover
              bordered
              stacked="md"
              :fields="fields"
              :items="items">
              <template v-slot:cell(image_url)="data">
                <img v-bind:src="data.item.image_url" style="width: 40px; height: 40px"
                     @click="showModalImage(data.item.product_name, data.item.image_url)"/>
              </template>
              <template v-slot:cell(price_buy)="data">
                <p class="text-right">
                  <span v-show="!isShowPriceBuy">***</span>
                  <span v-show="isShowPriceBuy">{{currencyFormat(data.item.price_buy)}}</span>
                  <i v-show="!isShowPriceBuy" class="fa fa-eye" aria-hidden="true"
                     @click="isShowPriceBuy = ! isShowPriceBuy" title="Xem giá nhập"></i>
                  <i v-show="isShowPriceBuy" class="fa fa-eye-slash" aria-hidden="true"
                     @click="isShowPriceBuy = ! isShowPriceBuy" title="Đóng giá nhập"></i>
                </p>
              </template>
              <template v-slot:cell(price_sell)="data">
                <p class="text-right">{{currencyFormat(data.item.price_sell)}}</p>
              </template>
              <template v-slot:cell(quantity)="data">
                {{currencyFormat(data.item.quantity)}}
              </template>
              <template v-slot:cell(properties)="data">
                <p v-for="(group, index) in data.item.properties" :key="group">
                  <span v-for="(item, index) in group" :key="item">
                    - {{item.name + ": " + item.value}}
                  </span>
                </p>
              </template>

            </b-table>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <!--Modal thao tác sau khi xác nhận mua -->
      <b-modal centered hide-footer hide-header size="lg" id="modal-image-product">
        <b-row>
          <b-col md="12">
            <h4 class="modal-title text-center text-success">{{current_product.product_name}}</h4>
          </b-col>
        </b-row>
        <hr>

        <b-row>
          <b-col>
            <img v-bind:src="current_product.image_url" style="width: 100%" />
          </b-col>
        </b-row>

        <b-row>
          <b-col md="12" class="mt-2 text-center">
            <b-button variant="outline-secondary" class="text-center btn-width-120" @click="closeModalImage">
              Đóng
            </b-button>
          </b-col>
        </b-row>

      </b-modal>

    <!--Modal upload nhập hàng hàng loạt-->
    <b-modal centered hide-footer hide-header id="modal-import-repository" @hide="uploadErrorList = []">
      <b-row>
        <b-col class="text-center">
          <form method="post" id="formImport" enctype="multipart/form-data">

              <b-row>
                <b-col>
                  <h4 class="modal-title">Nhập sản phẩm từ file excel</h4>
                </b-col>
              </b-row>
              <b-row class="text-left">
                <b-col>
                  <p>
                    Tải xuống file mẫu:
                    <a target="_blank" href="https://api.cisale.vn/files/upload_excel_template/ciSale_upload_repository_product_template.xlsx">Tải xuống</a>
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
import repositoryAPI from "@/api/repository";
import tradeApi from '@/api/trade'
import commonFunc from "@/common/commonFunc";
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data() {
    return {
      group_product_reports: [],
      loading: false,
      inputs: {
        product_group_id: null,
        product_type_id: null,
        name: null,
      },
      productGroupSelect: {},
      productGroupOptions:[],
      productTypeSelect:{},
      productTypeOptions:[],
      productTypeOptionStore: [],
      loadingGetOptions: false,
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'image_url',
          label: 'Hình ảnh'
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
          key: 'product_code',
          label: 'Mã sản phẩm'
        },
        {
          key: 'product_name',
          label: 'Sản phẩm'
        },
        {
          key: 'quantity',
          label: 'Số lượng'
        },
        {
          key: 'price_buy',
          label: 'Đơn giá nhập'
        },
        {
          key: 'price_sell',
          label: 'Đơn giá bán'
        },
        {
          key: 'properties',
          label: 'Thuộc tính'
        },
      ],
      items: [],
      excel_fields: {
        'STT': 'stt',
        'Nhóm SP' : 'product_group_name',
        'Loại SP': 'product_type_name',
        'Mã sản phẩm' : 'product_code',
        'Sản phẩm' : 'product_name',
        'Số lượng': 'quantity',
        'Đơn giá nhập': 'price_buy',
        'Đơn giá bán': 'price_sell'
      },
      onSearch: false,
      isShowInfo: true,
      current_product: {
        product_name: null,
        image_url: null
      },
      isShowPriceBuy: false,
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
    };
  },
  computed: {
    errorFromDate: function () {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate: function () {
      return this.checkDate(this.inputs.toDate)
    },
  },
  mounted() {

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    this.getListProductInRepository();
  },
  methods: {
    checkDate(dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkValidate() {
      return !(this.errorFromDate || this.errorToDate)
    },
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: "my-toast",
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      });
    },

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated() {
      this.loadingGetOptions = true
      let params = {
        "product_groups": true,
        "product_types": true
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

        this.productTypeSelect = {"id": null, "name": null}
      } else {
        this.resetListProductType()
      }
    },

      /**
     * Get list product in repository
     */
    getListProductInRepository() {
        this.onSearch = true
        let params = {
          product_group_id: this.productGroupSelect && this.productGroupSelect.id ? this.productGroupSelect.id : null,
          product_type_id: this.productTypeSelect && this.productTypeSelect.id ? this.productTypeSelect.id : null,
          name: this.inputs.name,
          code: null
        }
        repositoryAPI.getListProductInRepository(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data

            // Handle data
            // this.calcTotal()
        }
        this.onSearch = false
      }).catch(err => {
          this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      goToRepoHis() {
        this.$router.push("/repo-history")
      },

    /**
     * Show modal import from file
     */
    openModalImportFile () {
      this.$bvModal.show('modal-import-repository')
    },

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
      repositoryAPI.importFromExcelFile(form_data).then(res => {
        if(res != null && res.data != null){
            if(res.data.status == 200) {
              // Load list when load page
              this.$bvModal.hide('modal-import-repository')
            } else {
              this.uploadErrorList = res.data.data
            }
        }
        this.getListProductInRepository()
        this.uploading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.uploading = false
      })

    },

      /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

      showModalImage(product_name, image_url) {
        this.current_product.product_name = product_name
          this.current_product.image_url = image_url
        this.$bvModal.show('modal-image-product')
      },

      closeModalImage() {
        this.$bvModal.hide('modal-image-product')
      },

  }
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }


  table {
   margin: auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
  }

  td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  th {
    text-align: left;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  td {
    white-space: nowrap;
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  td:first-of-type, th:first-of-type {
    border-left: none;
  }

  td:last-of-type, th:last-of-type {
    border-right: none;
  }
</style>
