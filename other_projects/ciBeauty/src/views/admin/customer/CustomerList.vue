<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <button class="btn btn-outline-success float-right btn-width-120" @click="goToAdd">
                Thêm
              </button>

              <!-- <button class="btn btn-outline-primary float-right btn-width-120 mr-2" @click="openModalImportFile">
                Upload
              </button> -->
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Khách hàng</h4>
            </div>
          </div>
          <hr>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
              <label>ID</label>
              <input
              id="id"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.id"
              maxlength="11"
              @keyup="integerOnly($event.target)">
            </div>
            <div class="col-span-3">
              <label>Tên</label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name"
              maxlength="75">
            </div>
            <div class="col-span-3">
              <label>Số điện thoại</label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.phone"
              maxlength="11"
              @keyup="integerOnly($event.target)">
            </div>
            <div class="col-span-3">
              <label>Email</label>
              <input
              id="email"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.email"
              maxlength="255">
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
              Số kết quả: {{currencyFormat(totalRow)}}
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
                  <div v-if="field.key === 'name'">
                    <a :href="'/customer/history-detail/'+item.id" target="_blank">{{item.name}}</a>
                  </div>
                  <div v-else-if="field.key === 'point'">
                    {{ currencyFormat(item.point) }}
                  </div>
                  <div v-else-if="field.key === 'remaining'">
                    {{ currencyFormat(item.remaining) }}
                  </div>
                  <div v-else-if="field.key === 'action'">
                    <div class="flex gap-2">
                      <button class="list-group-item" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
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

    <div v-if="showImportModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="flex items-center justify-between p-4 border-b">
          <h4 class="modal-title">Upload khách hàng từ file excel</h4>
          <button @click="showImportModal = false" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full text-center">
              <form method="post" id="formImport" enctype="multipart/form-data">
                  <div class="grid grid-cols-12 gap-4 text-left">
                    <div class="col-span-full">
                      <p>
                        Tải xuống file mẫu:
                        <a target="_blank" href="https://api.cibeauty.vn/files/upload_excel_template/cibeauty_upload_customer_template.xlsx">Tải xuống</a>
                      </p>
                    </div>
                  </div>
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

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full text-right mt-3">
              <!-- Loading -->
              <span class="loading-more" v-show="uploading"><icon name="loading" width="60" /></span>
              <button class="px-4 default-btn-bg" v-show="!uploading" @click="importCustomerFromExcelFile()" :disabled="!fileUpload || uploading">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
        id: null,
        name: null,
        phone: null,
        email: null
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'id',
          label: 'ID'
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
          key: 'email',
          label: 'Email'
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
          key: 'address',
          label: 'Địa chỉ'
        },
        {
          key: 'national_code',
          label: 'Quốc tịch'
        },
        {
          key: 'industry',
          label: 'Ngành nghề'
        },
        {
          key: 'point',
          label: 'Điểm tích lũy'
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
      listIdDeleted: [],
      loading: false,
      totalRow: 0,
      fileUpload: null,
      fileName: "Chọn file excel bạn muốn upload",
      uploading: false,
      showImportModal: false,
    }
  },
  computed: {
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    window.addEventListener('resize', this.delete)

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
      let params = {
        "id": this.inputs.id,
        "name": this.inputs.name,
        "phone": this.inputs.phone,
        "email": this.inputs.email,
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
      // this.$bvModal.show('modal-import-customer')
      this.showImportModal = true;
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
        // this.$bvModal.hide('modal-import-customer')
        this.showImportModal = false
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
