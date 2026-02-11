<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <button class="btn btn-outline-success float-right btn-width-120" @click="goToAdd">
                  Thêm
                </button>

                <button class="btn btn-outline-primary float-right btn-width-120 mr-2" @click="openModalImportFile">
                  Upload
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="mt-2 text-center text-header">Danh Sách Khách Hàng</h4>
              </div>
            </div>
            <hr>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/2 px-2 mb-3">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name"
              maxlength="75">
              </div>
              <div class="w-full md:w-1/2 px-2 mb-3">
              <label> Số điện thoại </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.phone"
              maxlength="11"
              @keyup="integerOnly($event.target)">
              </div>
            </div>

            <div class="flex flex-wrap -mx-2 mt-2 mb-2">
              <div class="w-full px-2">
                <button class="btn btn-outline-primary float-right btn-width-120" :disabled="onSearch"
                        @click.prevent="prepareToSearch">
                  Tìm Kiếm
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 mb-3">
                Số kết quả: {{totalRow}}
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <table class="min-w-full divide-y divide-gray-200 border">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã số thuế</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tỉnh/TP</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quận/Huyện</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.stt }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.type }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.name }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.phone_number }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ handleGender(item.gender) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.birthday }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.tax_code }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.city_name }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.district_name }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.address }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <div class="flex gap-2">
                          <button @click="edit(item.id)" class="text-blue-600 hover:text-blue-900" title="Edit">
                            <i class="fa fa-edit" />
                          </button>
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
        </div>

      </div>
    </div>

    <!-- Modal Import Customer -->
    <TransitionRoot appear :show="modalImportCustomer" as="template">
      <Dialog as="div" @close="modalImportCustomer = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div class="text-center">
                  <form method="post" id="formImport" enctype="multipart/form-data">
                    <div class="modal-header">
                      <h4 class="modal-title">Upload khách hàng từ file excel</h4>
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

                <div class="text-right mt-3">
                  <!-- Loading -->
                  <span class="loading-more" v-show="uploading"><icon name="loading" width="60" /></span>
                  <button class="btn btn-primary px-4 default-btn-bg" v-show="!uploading" @click="importCustomerFromExcelFile()" :disabled="!fileUpload || uploading">
                    Upload
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>


<script>
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import customerApi from '@/api/customer'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'


export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild
  },
  setup() {
    const { popToast } = useToast()
    const router = useRouter()
    return { popToast, router }
  },
  data () {
    return {
      inputs: {
        name: null,
        phone: null
      },
      modalImportCustomer: false,
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

    window.addEventListener('resize', this.delete)

    // Load list when load page
    this.search()
  },
  methods: {

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
        this.popToast('error', errorMess)

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
     * Handle gender
     */
    handleGender(num) {
      if(num == 1) {
        return 'Nam'
      }
      if(num == 2) {
        return 'Nữ'
      }
      return 'Khác'
    },

    /**
     * Go to page edit
     */
    edit (id) {
      this.router.push('/customer/edit/' + id)
    },

    /**
     * Go to page add
     */
    goToAdd () {
      this.router.push('/customer/add')
    },

    /**
     * Show modal import from file
     */
    openModalImportFile () {
      this.modalImportCustomer = true
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
        this.modalImportCustomer = false
        this.uploading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)

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
