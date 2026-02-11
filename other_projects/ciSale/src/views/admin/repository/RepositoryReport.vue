<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">

      <div class="bg-white shadow rounded-lg p-4">
        <div class="flex flex-wrap -mx-2">
          <div class="w-full px-2">
            <button class="btn btn-outline-success pull-right btn-width-120" @click.prevent="goToRepoHis">
              Lịch sử kho
            </button>

            <button class="btn btn-outline-primary pull-right btn-width-120 mr-2" @click="openModalImportFile">
              Upload
            </button>
          </div>
        </div>

        <div class="flex flex-wrap -mx-2">
          <div class="w-full px-2">
            <h3 class="text-header text-center">Sản Phẩm Trong Kho</h3>
          </div>
        </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/4 px-2">
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
            </div>

            <div class="w-full md:w-1/4 px-2">
              <label> Loại SP </label>
              <multiselect
                v-model="productTypeSelect"
                :options="productTypeOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn loại sản phẩm--"
                label="name"
                track-by="name">
              </multiselect>
            </div>

            <div class="w-full md:w-1/4 px-2">
                <label> Tên SP</label>
                <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.name">
              </div>

            <div class="w-full md:w-1/4 px-2">
              <label class="label-width text-white">
                Xem
              </label>
              <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch"
                        @click.prevent="getListProductInRepository">
                Tìm Kiếm
              </button>
            </div>

          </div>

        <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{items.length}}</b></span></div>

              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "items"
                :fields = "excel_fields"
                worksheet = "Lịch sử kho"
                name    = "Lịch sử kho">
                <b>Xuất Excel</b>
              </download-excel>
            </div>
          </div>

          <!-- Loading -->
          <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>

          <div class="p-4">
            <div class="table-responsive">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td v-for="field in fields" :key="field.key">
                      <template v-if="field.key === 'stt'">
                        {{ index + 1 }}
                      </template>
                      <template v-else-if="field.key === 'image_url'">
                        <img v-bind:src="item.image_url" style="width: 40px; height: 40px"
                             @click="showModalImage(item.product_name, item.image_url)"/>
                      </template>
                      <template v-else-if="field.key === 'price_buy'">
                        <p class="text-right">
                          <span v-show="!isShowPriceBuy">***</span>
                          <span v-show="isShowPriceBuy">{{currencyFormat(item.price_buy)}}</span>
                          <i v-show="!isShowPriceBuy" class="fa fa-eye" aria-hidden="true"
                             @click="isShowPriceBuy = ! isShowPriceBuy" title="Xem giá nhập"></i>
                          <i v-show="isShowPriceBuy" class="fa fa-eye-slash" aria-hidden="true"
                             @click="isShowPriceBuy = ! isShowPriceBuy" title="Đóng giá nhập"></i>
                        </p>
                      </template>
                      <template v-else-if="field.key === 'price_sell'">
                        <p class="text-right">{{currencyFormat(item.price_sell)}}</p>
                      </template>
                      <template v-else-if="field.key === 'quantity'">
                        {{currencyFormat(item.quantity)}}
                      </template>
                      <template v-else-if="field.key === 'properties'">
                        <p v-for="(group, gindex) in item.properties" :key="gindex">
                          <span v-for="(propItem, pindex) in group" :key="pindex">
                            - {{propItem.name + ": " + propItem.value}}
                          </span>
                        </p>
                      </template>
                      <template v-else>
                        {{ item[field.key] }}
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Modal thao tác sau khi xác nhận mua -->
    <Dialog :open="showModalImage" @close="closeModalImage" class="relative z-50">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <div class="p-6">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="modal-title text-center text-success">{{current_product.product_name}}</h4>
              </div>
            </div>
            <hr>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <img v-bind:src="current_product.image_url" style="width: 100%" />
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 mt-2 text-center">
                <button class="btn btn-outline-secondary text-center btn-width-120" @click="closeModalImage">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>

    <!--Modal upload nhập hàng hàng loạt-->
    <Dialog :open="showModalImport" @close="() => { showModalImport = false; uploadErrorList = [] }" class="relative z-50">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <div class="p-6">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-center">
                <form method="post" id="formImport" enctype="multipart/form-data">

                    <div class="flex flex-wrap -mx-2">
                      <div class="w-full px-2">
                        <h4 class="modal-title">Nhập sản phẩm từ file excel</h4>
                      </div>
                    </div>
                    <div class="flex flex-wrap -mx-2 text-left">
                      <div class="w-full px-2">
                        <p>
                          Tải xuống file mẫu:
                          <a target="_blank" href="https://api.cisale.vn/files/upload_excel_template/ciSale_upload_repository_product_template.xlsx">Tải xuống</a>
                        </p>
                      </div>
                    </div>
                    <hr>


                    <div class="modal-body">
                        <div class="custom-file">
                          <label>Chọn file excel bạn muốn upload
                            <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept=".xlsx"/>
                          </label>
                        </div>
                    </div>

                </form>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-right mt-3">
                <!-- Loading -->
                <span class="loading-more" v-show="uploading"><icon name="loading" width="60" /></span>
                <button class="btn btn-primary px-4 default-btn-bg" v-show="!uploading" @click="importProductFromExcelFile()" :disabled="!fileUpload || uploading">
                  Upload
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-2" v-show="uploadErrorList.length > 0">
              <div class="w-full px-2">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th v-for="field in uploadErrorField" :key="field.key">{{ field.label }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(error, index) in uploadErrorList" :key="index">
                        <td v-for="field in uploadErrorField" :key="field.key">{{ error[field.key] }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>

  </div>
</template>

<script>
import repositoryAPI from "@/api/repository";
import tradeApi from '@/api/trade'
import commonFunc from "@/common/commonFunc";
import Datepicker from 'vue3-datepicker'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

// import JsonExcel from 'vue-json-excel' // TODO: Replace with xlsx library

import Multiselect from 'vue-multiselect'


export default {
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    return { toast, router }
  },
  components: {
    Datepicker,
    Multiselect,
    Dialog,
    DialogPanel
  },
  data() {
    return {
      showModalImage: false,
      showModalImport: false,
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
      this.toast(content, variant === 'danger' ? 'error' : variant)
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
        this.router.push("/repo-history")
      },

    /**
     * Show modal import from file
     */
    openModalImportFile () {
      this.showModalImport = true
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
              this.showModalImport = false
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
        this.showModalImage = true
      },

      closeModalImage() {
        this.showModalImage = false
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
