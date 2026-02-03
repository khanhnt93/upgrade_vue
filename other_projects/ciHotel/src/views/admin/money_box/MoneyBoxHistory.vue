<template>
  <div class="container-fluid mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Back Button -->
      <div class="mb-4">
        <button
          @click="goBack"
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Quay lại
        </button>
      </div>

      <!-- Header -->
      <div class="mb-4">
        <h4 class="text-2xl font-bold text-center text-orange-500">LỊCH SỬ KÉT TIỀN</h4>
      </div>
      <hr class="mb-4">

      <!-- Search Filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block mb-2 font-medium">Loại giao dịch</label>
          <select
            v-model="inputs.type"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option :value="null"></option>
            <option value="plus">Thu</option>
            <option value="minus">Chi</option>
            <option value="fund">Vốn đầu ngày</option>
          </select>
        </div>
        <div>
          <label class="block mb-2 font-medium">Loại tiền</label>
          <select
            v-model="inputs.moneyType"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option :value="null"></option>
            <option value="cash">Tiền mặt</option>
            <option value="credit">Chuyển khoản</option>
            <option value="e_money">Tiền điện tử</option>
          </select>
        </div>
        <div>
          <label class="block mb-2 font-medium">Nhân viên</label>
          <select
            v-model="inputs.staff"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option :value="null"></option>
            <option v-for="staff in staffOption.slice(1)" :key="staff.value" :value="staff.value">
              {{ staff.text }}
            </option>
          </select>
        </div>
        <div>
          <label class="block mb-2 font-medium text-transparent">Xem</label>
          <button
            @click.prevent="prepareToSearch"
            :disabled="onSearch"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
            Tìm Kiếm
          </button>
        </div>
      </div>

      <!-- Total Row -->
      <div class="mb-4">
        Số kết quả: {{totalRow}}
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2">STT</th>
              <th class="border border-gray-300 px-4 py-2">Loại</th>
              <th class="border border-gray-300 px-4 py-2">Số tiền</th>
              <th class="border border-gray-300 px-4 py-2">Nội dung</th>
              <th class="border border-gray-300 px-4 py-2">Tiền mặt</th>
              <th class="border border-gray-300 px-4 py-2">Chuyển khoản</th>
              <th class="border border-gray-300 px-4 py-2">Tiền điện tử</th>
              <th class="border border-gray-300 px-4 py-2">Thời gian</th>
              <th class="border border-gray-300 px-4 py-2">Nhân viên</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ convertTypeCodeToName(item.type) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ formatCurrency(item.total) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.content }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ formatCurrency(item.cash) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ formatCurrency(item.credit) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ formatCurrency(item.e_money) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.created_at }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.created_by }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <div class="text-center mt-4">
        <span v-show="loading" class="text-blue-600">
          <icon name="loading" width="60" />
        </span>
        <span v-if="hasNext === false" class="text-gray-500">--Hết--</span>
        <span v-if="hasNext === true && totalRow != 0" class="text-blue-600">
          <i class="fa fa-angle-double-down"></i>
        </span>
      </div>
    </div>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'
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
        type: null,
        moneyType: null,
        staff: null
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'type',
          label: 'Loại'
        },
        {
          key: 'total',
          label: 'Số tiền'
        },
        {
          key: 'content',
          label: 'Nội dung'
        },
        {
          key: 'cash',
          label: 'Tiền mặt'
        },
        {
          key: 'credit',
          label: 'Chuyển khoản'
        },
        {
          key: 'e_money',
          label: 'Tiền điện tử'
        },
        {
          key: 'created_at',
          label: 'Thời gian'
        },
        {
          key: 'created_by',
          label: 'Nhân viên'
        },
      ],
      items: [],
      typeOption: [
        {value: null, text: ''},
        {value: 'plus', text: 'Thu'},
        {value: 'minus', text: 'Chi'},
        {value: 'fund', text: 'Vốn đầu ngày'},
      ],
      moneyTypeOption: [
        {value: null, text: ''},
        {value: 'cash', text: 'Tiền mặt'},
        {value: 'credit', text: 'Chuyển khoản'},
        {value: 'e_money', text: 'Tiền điện tử'},
      ],
      staffOption: [
        {value: null, text: ''}
      ],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0

    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Load option staff
    this.getStaffOption()

    // Load list when load page
    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  computed: {
  },
  methods: {

    /**
     * Get staff option
     */
    getStaffOption() {
      adminAPI.getStaffOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let staffs = res.data.data
          for (let index in staffs) {
            this.staffOption.push(staffs[index])
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
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
        "type": this.inputs.type,
        "moneyType": this.inputs.moneyType,
        "staff": this.inputs.staff,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      adminAPI.searchMoneyBoxHistory(params).then(res => {
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
     * Go back
     */
    goBack () {
      this.router.push('/money-box')
    },

    /**
     * Convert type code to name
     */
    convertTypeCodeToName(code) {
      if(code == "plus") {
        return "Thu"
      }
      if(code == "minus") {
        return "Chi"
      }
      if(code == "fund") {
        return "Vốn đầu ngày"
      }
      return ""
    }
  }
}
</script>
