<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h4 class="text-xl font-semibold text-center mt-2 mb-4">Lịch sử kho hàng</h4>
      <hr class="mb-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div v-if="resourceOptions.length > 0">
          <label class="block mb-2">Nguyên liệu</label>
          <select
            id="resource"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.resource">
            <option v-for="resource in resourceOptions" :key="resource.value" :value="resource.value">{{ resource.text }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">Loại</label>
          <select
            id="type"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.type">
            <option v-for="type in typeOptions" :key="type.value" :value="type.value">{{ type.text }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">Từ ngày</label>
          <input
            id="fromDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errorFromDate }"
            v-model="inputs.fromDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)">
          <div v-if="errorFromDate" class="text-red-500 text-sm mt-1">
            Mục từ ngày không đúng
          </div>
        </div>
        <div>
          <label class="block mb-2">Đến ngày</label>
          <input
            id="toDate"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errorToDate }"
            v-model="inputs.toDate"
            maxlength="10"
            @keyup="inputDateOnly($event.target)">
          <div v-if="errorToDate" class="text-red-500 text-sm mt-1">
            Mục đến ngày không đúng
          </div>
        </div>
      </div>

      <div class="flex justify-end mb-4">
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-[120px] disabled:opacity-50" 
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
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2">STT</th>
              <th class="border border-gray-300 px-4 py-2">Nguyên Liệu - Mặt hàng</th>
              <th class="border border-gray-300 px-4 py-2">Nội dung</th>
              <th class="border border-gray-300 px-4 py-2">Ghi chú</th>
              <th class="border border-gray-300 px-4 py-2">Thời gian</th>
              <th class="border border-gray-300 px-4 py-2">Tạo bởi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td class="border border-gray-300 px-4 py-2 text-center">{{ item.stt }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.resource_name }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">
                <b v-if="item.type == 'plus'">+</b><b v-if="item.type == 'minus'">-</b>{{ formatCurrency(item.quantity) }}
              </td>
              <td class="border border-gray-300 px-4 py-2">{{ item.reason }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">{{ item.created_at }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.staff_name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
      <span class="loading-more" v-if="hasNext === false">--Hết--</span>
      <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

export default {
  setup() {
    const toast = useToast()
    const { formatCurrency } = useFormatters()

    return {
      toast,
      formatCurrency
    }
  },
  data () {
    return {
      resourceOptions: [{value: null, text: ''}],
      typeOptions: [
        {value: null, text: ''},
        {value: 'plus', text: 'Thêm vào'},
        {value: 'minus', text: 'Giảm đi'},
      ],
      inputs: {
        resource: null,
        type: null,
        fromDate: null,
        toDate: null
      },
      items: [],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0,
      click: false,
    }
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
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.delete)

    // Load option resource
    this.getResourceOptions()

    // Get default date
    this.getDefaultDate()

    // Load list when load page
    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.delete)
  },
  methods: {
    checkDate (dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkValidate () {
      return !(this.errorFromDate || this.errorToDate || !this.checkFromDateAndToDate())
    },

    /**
     * Get default date
     */
    getDefaultDate() {
      // Get default date
      let dateNow = new Date()
      this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
      let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
      this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
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
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {

        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

        if(fromDate > toDate) {
          this.toast.error("Từ ngày không thể lớn hớn đến ngày")
          return false
        }

        fromDate.setFullYear(fromDate.getFullYear() + 1)

        if(fromDate < toDate) {
          this.toast.error("Thời gian không quá 1 năm")
          return false
        }

      return true
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
        "resource_id": this.inputs.resource,
        "type": this.inputs.type,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      adminAPI.searchResourceHistory(param).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let it = res.data.data.data
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
        this.toast.error(errorMess)

        this.onSearch = false
        this.loading = false
      })
    },

    /**
     * Load list option resource
     */
    getResourceOptions () {
      adminAPI.getListResourceOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let resources = res.data.data
          for (let index in resources) {
            this.resourceOptions.push(resources[index])
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Only input date
     */
     inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },
  }
}
</script>
