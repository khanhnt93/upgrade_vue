<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd">
                Thêm
              </b-button>
              <b-button variant="outline-primary" class="pull-right btn-width-120 mr-2" @click="openModalImportFile">
                Upload
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Thực Đơn</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="3">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name">
            </b-col>
            <b-col md="3">
              <label> Giá </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.price"
              maxlength="11"
              @keyup="integerOnly($event.target)">
            </b-col>
            <b-col md="3" v-if="groupMenus.length > 0">
              <label> Nhóm </label>
              <b-form-select
              :options="groupMenus"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.group"></b-form-select>
            </b-col>
            <b-col md="3">
              <label> Trạng Thái </label>
              <b-form-select
              :options="options"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.status"></b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click="prepareToSearch">
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
            <template v-slot:cell(price)="data">{{ currencyFormat(data.item.price) }}</template>
            <template v-slot:cell(action)="dataId">
              <b-list-group horizontal>
                <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.value)">
                  <i class="fa fa-edit" />
                </b-list-group-item>
                <b-list-group-item v-b-tooltip.hover title="Delete" @click="deleted(dataId.value, dataId.item.name, dataId.item.stt)">
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

    <!--Modal upload menu-->
    <b-modal centered hide-footer hide-header id="modal-import-menu" @hide="uploadErrorList = []">
      <b-row>
        <b-col class="text-center">
          <form method="post" id="formImport" enctype="multipart/form-data">

              <b-row>
                <b-col>
                  <h4 class="modal-title">Upload menu từ file excel</h4>
                </b-col>
              </b-row>
              <b-row class="text-left">
                <b-col>
                  <p>
                    Tải xuống file mẫu:
                    <a target="_blank" href="https://api.cifood.vn/files/upload_excel_template/cifood_upload_menu_template.xlsx">Tải xuống</a>
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
          <button class="btn btn-primary px-4 default-btn-bg" v-show="!uploading" @click="importMenuFromExcelFile()" :disabled="!fileUpload || uploading">
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
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/menu'
import GMMapper from '@/mapper/group_menu'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      inputs: {
        name: null,
        price: null,
        group: null,
        status: null
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'price',
          label: 'Giá'
        },
        {
          key: 'group',
          label: 'Nhóm'
        },
        {
          key: 'status',
          label: 'Trạng Thái'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      options: [
        {value: null, text: ''},
        {value: 'true', text: 'Còn món'},
        {value: 'false', text: 'Hết món'}
      ],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      listIdDeleted: [],
      loading: false,
      groupMenus: [],
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
    }
  },
  computed: {
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    window.addEventListener('resize', this.delete)

    // Load option group menu
    this.getGroupMenuOptions()

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
      let param = {
        "name": this.inputs.name,
        "price": this.inputs.price,
        "group": this.inputs.group,
        "status": this.inputs.status,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      adminAPI.searchMenu(param).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let it = Mapper.mapMenuModelToDto(res.data.data.menus, this.offset)
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
     * Load list option group menu
     */
    getGroupMenuOptions () {
      adminAPI.getListGroupMenuOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.groupMenus = GMMapper.mapGroupMenuOptionModelToDto(res.data.data)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Delete
     */
    deleted (id, name, rowIndex) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if (res) {
            adminAPI.deleteMenu(id).then(res => {

              // Remove item in list
              let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
              this.items.splice(indexTemp, 1)
              this.listIdDeleted.push(rowIndex - 1)

              this.totalRow = this.totalRow - 1
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
   * Currency format
   */
    currencyFormat(num) {
      let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return result
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
     * Go to page edit
     */
    edit (id) {
      this.$router.push('/menu/edit/' + id)
    },

    /**
     * Go to page add
     */
    goToAdd () {
      this.$router.push('/menu/add')
    },

    /**
     * Show modal import from file
     */
    openModalImportFile () {
      this.$bvModal.show('modal-import-menu')
    },

    /**
     *
     */
    handleFileUpload() {
      this.fileUpload = this.$refs.file.files[0];
      console.log(this.fileUpload)
      document.getElementById("custom-file-label").innerHTML = this.fileUpload.name
    },

    /**
     * Import file
     */
    importMenuFromExcelFile() {
      this.uploading = true
      const form_data = new FormData();
      form_data.append("importFile", this.fileUpload)
      adminAPI.importMenuFromExcelFile(form_data).then(res => {
        if(res != null && res.data != null){
            if(res.data.data && res.data.data.length == 0) {
              // Load list when load page
              this.popToast('success', 'Upload menu thành công!')
              this.$bvModal.hide('modal-import-menu')
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
  }
}
</script>
