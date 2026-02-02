<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <button class="btn btn-outline-success float-right px-4 btn-width-120" @click="goToAdd()">
                Thêm
              </button>
              <button class="btn btn-outline-primary float-right btn-width-120 mr-2" @click="openModalImportFile">
                Upload
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Dịch vụ</h4>
            </div>
          </div>
          <hr>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name">
            </div>
            <div class="col-span-3">
              <label> Giá </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.price"
              maxlength="11"
              @keyup="integerOnly($event.target)">
            </div>
            <div class="col-span-3" v-if="groupMenus.length> 0">
              <label> Nhóm </label>
              <select class="form-control form-control"
              id="status"
              type="text"
              autocomplete="new-password"
              v-model="inputs.group">
                <option v-for="option in groupMenus" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
            <div class="col-span-3">
              <label> Trạng Thái </label>
              <select class="form-control form-control"
              id="status"
              type="text"
              autocomplete="new-password"
              v-model="inputs.status">
                <option v-for="option in options" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mt-2 mb-2">
            <div class="col-span-12">
              <button class="btn btn-outline-primary float-right px-4 btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              Số kết quả: {{totalRow}}
            </div>
          </div>

          <table class="table table-bordered table-hover table-responsive-stack">
            <thead>
              <tr>
                <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td v-for="field in fields" :key="field.key" :data-label="field.label">
                  <div v-if="field.key === 'price'">
                    {{ currencyFormat(item.price) }}
                  </div>
                  <div v-else-if="field.key === 'action'">
                    <div class="flex gap-2">
                      <button class="list-group-item" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="list-group-item" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                        <i class="fa fa-trash" />
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    {{ item[field.key] }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </div>

      </div>
    </div>

    <!--Modal upload menu-->
    <!--Modal upload menu-->
    <div v-if="showImportModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-6">
        <div class="flex items-center justify-between p-4 border-b">
          <h4 class="text-xl font-bold">Upload dịch vụ từ file excel</h4>
          <button @click="showImportModal = false; uploadErrorList = []" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <form method="post" id="formImport" enctype="multipart/form-data">
              <div class="grid grid-cols-12 gap-4 text-left">
                <div class="col-span-full">
                  <p>
                    Tải xuống file mẫu:
                    <a target="_blank" href="https://api.cibeauty.vn/files/upload_excel_template/cibeauty_upload_service_template.xlsx">Tải xuống</a>
                  </p>
                </div>
              </div>
              <hr class="my-3">

              <div class="modal-body p-0">
                  <div class="custom-file">
                    <label>Chọn file excel bạn muốn upload
                      <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept=".xlsx"/>
                    </label>
                  </div>
              </div>
          </form>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full text-right mt-3">
              <!-- Loading -->
              <span class="loading-more" v-show="uploading"><icon name="loading" width="60" /></span>
              <button class="btn px-4 default-btn-bg" v-show="!uploading" @click="importMenuFromExcelFile()" :disabled="!fileUpload || uploading">
                Upload
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mt-2" v-show="uploadErrorList.length> 0">
            <div class="col-span-full">
              <table class="table table-bordered table-hover table-responsive-stack">
                <thead>
                  <tr>
                    <th v-for="field in uploadErrorField" :key="field.key">{{ field.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in uploadErrorList" :key="index">
                    <td v-for="field in uploadErrorField" :key="field.key" :data-label="field.label">
                      {{ item[field.key] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

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
        {value: 'true', text: 'Còn dv'},
        {value: 'false', text: 'Hết dv'}
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
      showImportModal: false,
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
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
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
          const groups = res.data.data
          this.groupMenus = [{value:null, text: "-- Tất cả --"}]

          for (let group of  groups) {
            let optionTemp = { value: group.id, text: group.name }
            this.groupMenus.push(optionTemp)
          }
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
      if(id && name) {
        if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
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
      }
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
      // this.$bvModal.show('modal-import-menu')
      this.showImportModal = true;
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
              this.popToast('success', 'Upload dịch vụ thành công!')
              // this.$bvModal.hide('modal-import-menu')
              this.showImportModal = false
              this.uploadErrorList = []
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
