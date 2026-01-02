<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd()">
                  Thêm
                </b-button>
                <b-button variant="primary" class="pull-right mr-4 default-btn-bg btn-width-120" @click="openModalImportFile()">
                  <span class="oi mr-1" data-glyph="data-transfer-upload"></span> Upload
                </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center">Khách hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="6">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name"
              maxlength="75">
            </b-col>
            <b-col md="6">
              <label> Số điện thoại </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.phone"
              maxlength="11"
              @keyup="integerOnly($event.target)">
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="primary" class="pull-right px-4 default-btn-bg btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
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
            <template v-slot:cell(point)="data">{{ currencyFormat(data.item.point) }}</template>
            <template v-slot:cell(remaining)="data">{{ currencyFormat(data.item.remaining) }}</template>
            <template v-slot:cell(action)="dataId">
              <b-list-group horizontal>
                <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                  <i class="fa fa-edit" />
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

    <b-modal centered hide-footer hide-header id="modal-import-customer">
      <b-row>
        <b-col class="text-center">
          <form method="post" id="formImport" enctype="multipart/form-data">
              <div class="modal-header">
                  <h4 class="modal-title">Upload khách hàng từ file excel</h4>
              </div>
              <div class="modal-body">
                  <div class="custom-file">
                    <label>Chọn file excel bạn muốn upload
                      <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept=".xlsx"/>
                    </label>
                    <!--<input type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept=".xlsx" :placeholder="[[ fileName ]]">-->
                    <!--<label id="custom-file-label" class="custom-file-label" for="file">Chọn file excel bạn muốn upload</label>-->

                  </div>
              </div>
          </form>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="text-right mt-3">
          <!-- Loading -->
          <span class="loading-more" v-show="uploading"><icon name="loading" width="60" /></span>
          <button class="btn btn-primary px-4 default-btn-bg" v-show="!uploading" @click="importCustomerFromExcelFile()" :disabled="!fileUpload || uploading">
            Upload
          </button>
        </b-col>
      </b-row>
    </b-modal>

  </div>
</template>


<script>
import customerApi from '@/api/customer'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      inputs: {
        name: null,
        phone: null
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'cus_type',
          label: 'Loại'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'phone_number',
          label: 'Số điện thoại'
        },
        {
          key: 'gender',
          label: 'Giới tính'
        },
        {
          key: 'birthday',
          label: 'Ngày sinh'
        },
        {
          key: 'city',
          label: 'Tỉnh/Thành phố'
        },
        {
          key: 'district',
          label: 'Quận/Huyện'
        },
        {
          key: 'address',
          label: 'Địa chỉ'
        },
        {
          key: 'mst',
          label: 'Mã số thuế'
        },
        {
          key: 'point',
          label: 'Điểm tích lũy'
        },
        {
          key: 'remaining',
          label: 'Điểm khả dụng'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0,
      fileUpload: null,
      fileName: "Chọn file excel bạn muốn upload",
      uploading: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Load list when load page
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
     *  Processing on scroll: use for paging
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
          this.search ()
        }
      }
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
     *  Search
     */
    search() {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true

      // Define params
      let params = {
        "name": this.inputs.name,
        "phone": this.inputs.phone,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      customerApi.getCustomerByStore(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let it = res.data.data.customers
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
        }else{
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
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
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

    /**
     * Go to page edit
     */
    edit (id) {
      this.$router.push('/customer/edit/' + id)
    },

    /**
     * Go to page add
     */
    goToAdd () {
      this.$router.push('/customer/add')
    },

    /**
     * Show modal import from file
     */
    openModalImportFile () {
      this.$bvModal.show('modal-import-customer')
    },

    /**
     * Import file
     */
    importCustomerFromExcelFile() {
      this.uploading = true
      const form_data = new FormData();
      form_data.append("importFile", this.fileUpload)
      customerApi.importCustomerFromExcelFile(form_data).then(res => {
        if(res != null && res.data != null){
          // Load list when load page
          this.search()
        }
        this.$bvModal.hide('modal-import-customer')
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
      document.getElementById("custom-file-label").innerHTML = this.fileUpload.name
    }
  }
}
</script>
