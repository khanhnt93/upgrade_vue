<template>
  <div class="container-fluid mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-end mb-4 space-x-4">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 min-w-[120px]"
          @click="openModalImportFile()">
          <span class="oi mr-1" data-glyph="data-transfer-upload"></span> Upload
        </button>
        <button
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 border border-green-600 min-w-[120px]"
          @click="goToAdd()">
          Thêm
        </button>
      </div>

      <div class="text-center mb-4">
        <h4 class="text-xl font-semibold mt-2">Khách hàng</h4>
      </div>
      <hr class="mb-4">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block mb-2">Tên</label>
          <input
            id="name"
            type="text"
            autocomplete="new-password"
            class="form-control w-full"
            v-model="inputs.name"
            maxlength="75">
        </div>
        <div>
          <label class="block mb-2">Số điện thoại</label>
          <input
            id="price"
            type="text"
            autocomplete="new-password"
            class="form-control w-full"
            v-model="inputs.phone"
            maxlength="11"
            @keyup="integerOnly($event.target)">
        </div>
      </div>

      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          :disabled="onSearch"
          @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="mb-4">
        Số kết quả: {{totalRow}}
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-4 py-2">STT</th>
              <th class="border border-gray-300 px-4 py-2">Loại</th>
              <th class="border border-gray-300 px-4 py-2">Tên</th>
              <th class="border border-gray-300 px-4 py-2">Số điện thoại</th>
              <th class="border border-gray-300 px-4 py-2">Giới tính</th>
              <th class="border border-gray-300 px-4 py-2">Ngày sinh</th>
              <th class="border border-gray-300 px-4 py-2">Tỉnh/Thành phố</th>
              <th class="border border-gray-300 px-4 py-2">Quận/Huyện</th>
              <th class="border border-gray-300 px-4 py-2">Địa chỉ</th>
              <th class="border border-gray-300 px-4 py-2">Mã số thuế</th>
              <th class="border border-gray-300 px-4 py-2">Điểm tích lũy</th>
              <th class="border border-gray-300 px-4 py-2">Điểm khả dụng</th>
              <th class="border border-gray-300 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2 text-center">{{ item.stt }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.cus_type }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.phone_number }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.gender }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.birthday }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.city }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.district }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.address }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.mst }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(item.point) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(item.remaining) }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <div class="flex justify-center space-x-2">
                  <button
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    @click="edit(item.id)"
                    title="Edit">
                    <i class="fa fa-edit" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="text-center py-4">
        <icon name="loading" width="60" />
      </div>
      <div v-if="hasNext === false" class="text-center py-4">--Hết--</div>
      <div v-if="hasNext === true && totalRow != 0" class="text-center py-4">
        <i class="fa fa-angle-double-down text-2xl"></i>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-show="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="mb-4">
          <h4 class="text-xl font-semibold">Upload khách hàng từ file excel</h4>
        </div>
        <div class="mb-4">
          <form method="post" id="formImport" enctype="multipart/form-data">
            <div class="mb-4">
              <label class="block mb-2">Chọn file excel bạn muốn upload</label>
              <input
                type="file"
                id="file"
                ref="file"
                @change="handleFileUpload()"
                accept=".xlsx"
                class="w-full px-3 py-2 border border-gray-300 rounded">
            </div>
          </form>
        </div>

        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            @click="showImportModal = false"
            v-show="!uploading">
            Đóng
          </button>
          <div v-show="uploading" class="inline-block">
            <icon name="loading" width="30" />
          </div>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            v-show="!uploading"
            @click="importCustomerFromExcelFile()"
            :disabled="!fileUpload || uploading">
            Upload
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import customerApi from '@/api/customer'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

export default {
  setup() {
    const router = useRouter()
    const toast = useToast()
    const { formatCurrency } = useFormatters()

    return {
      router,
      toast,
      formatCurrency
    }
  },
  data () {
    return {
      inputs: {
        name: null,
        phone: null
      },
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
      uploading: false,
      showImportModal: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
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

      let params = {
        "name": this.inputs.name,
        "phone": this.inputs.phone,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      customerApi.getCustomerByStore(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let it = res.data.data.customers
          this.totalRow = res.data.data.total_row

          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          if(this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }
        }else{
            this.items = []
        }
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)

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
      this.showImportModal = true
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
          this.search()
        }
        this.showImportModal = false
        this.uploading = false
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)

        this.uploading = false
      })
    },

    /**
     * Handle file upload
     */
    handleFileUpload() {
      this.fileUpload = this.$refs.file.files[0];
      console.log(this.fileUpload)
    }
  }
}
</script>
