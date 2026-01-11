<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Add Button -->
      <div class="mb-4 flex justify-end">
        <button
          @click="goToAdd"
          class="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50">
          Thêm
        </button>
      </div>

      <!-- Header -->
      <div class="mb-4">
        <h4 class="text-2xl font-bold text-center">KHUYẾN MÃI</h4>
      </div>
      <hr class="mb-4">

      <!-- Search Filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block mb-2 font-medium">Tên</label>
          <input
            v-model="inputs.name"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block mb-2 font-medium">Giá</label>
          <input
            v-model="inputs.price"
            type="text"
            autocomplete="new-password"
            maxlength="11"
            @keyup="integerOnly($event.target)"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block mb-2 font-medium">Loại</label>
          <select
            v-model="inputs.type"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option :value="null"></option>
            <option v-for="option in typeOptions.slice(1)" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div>
          <label class="block mb-2 font-medium">Hiệu lực</label>
          <select
            v-model="inputs.expire"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option :value="null"></option>
            <option value="true">Còn</option>
            <option value="false">Hết</option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div class="mb-4 flex justify-end">
        <button
          @click.prevent="prepareToSearch"
          :disabled="onSearch"
          class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 disabled:bg-gray-200 disabled:text-gray-500">
          Tìm Kiếm
        </button>
      </div>

      <!-- Total Row -->
      <div class="mb-4">
        Số kết quả: {{ totalRow }}
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2">STT</th>
              <th class="border border-gray-300 px-4 py-2">Mã</th>
              <th class="border border-gray-300 px-4 py-2">Tên</th>
              <th class="border border-gray-300 px-4 py-2">Giá(điểm)</th>
              <th class="border border-gray-300 px-4 py-2">Loại</th>
              <th class="border border-gray-300 px-4 py-2">% giảm giá</th>
              <th class="border border-gray-300 px-4 py-2">Giảm giá tối đa</th>
              <th class="border border-gray-300 px-4 py-2">Trên tổng giá</th>
              <th class="border border-gray-300 px-4 py-2">Giá trị voucher</th>
              <th class="border border-gray-300 px-4 py-2">Item free</th>
              <th class="border border-gray-300 px-4 py-2">Số lượng</th>
              <th class="border border-gray-300 px-4 py-2">Còn lại</th>
              <th class="border border-gray-300 px-4 py-2">Ngày hiệu lực</th>
              <th class="border border-gray-300 px-4 py-2">Ngày Hết Hạn</th>
              <th class="border border-gray-300 px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.code }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.price }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.type_name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.discount_percent }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.max_discount }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.discount_on_amount }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.value_of_voucher }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.item_free }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.quantity }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.remaining }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.expired_date_from }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.expired_date_to }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <div class="flex gap-2">
                  <button
                    @click="edit(item.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Edit">
                    <i class="fa fa-edit"></i>
                  </button>
                  <button
                    @click="deleted(item.id, item.name, item.stt)"
                    class="text-red-600 hover:text-red-800"
                    title="Delete">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </td>
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
import Mapper from '@/mapper/promotion'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const router = useRouter()
    const toast = useToast()
    
    return {
      router,
      toast
    }
  },
  data () {
    return {
      inputs: {
        name: null,
        price: null,
        type: null,
        expire: null
      },
      pageLimit: Constant.PAGE_LIMIT,
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'code',
          label: 'Mã'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'price',
          label: 'Giá(điểm)'
        },
        {
          key: 'type_name',
          label: 'Loại'
        },

        {
          key: 'discount_percent',
          label: '% giảm giá'
        },
        {
          key: 'max_discount',
          label: 'Giảm giá tối đa'
        },
        {
          key: 'discount_on_amount',
          label: 'Trên tổng giá'
        },
        {
          key: 'value_of_voucher',
          label: 'Giá trị voucher'
        },
        {
          key: 'item_free',
          label: 'Item free'
        },
        {
          key: 'quantity',
          label: 'Số lượng'
        },
        {
          key: 'remaining',
          label: 'Còn lại'
        },
        {
          key: 'expired_date_from',
          label: 'Ngày hiệu lực'
        },
        {
          key: 'expired_date_to',
          label: 'Ngày Hết Hạn'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      listIdDeleted: [],
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      expireOptions: [
        {value: null, text: ''},
        {value: 'true', text: 'Còn'},
        {value: 'false', text: 'Hết'}
      ],
      typeOptions: [{value: null, text: ''}],
      totalRow: 0
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Load list option promotion type
    this.getPromotionTypeList()

    // Get list promotion
    this.getPromoList()

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
          this.getPromoList ()
        }
      }
    },

    /**
     * Delete
     */
    deleted (id, name, rowIndex) {
      if(id && name) {
        if(confirm('Xóa ' + name + ". Bạn có chắc không?")) {
          let dataPost = {
            "id": id,
            "method": "other"
          }
          adminAPI.deletePromo(dataPost).then(res => {
            // Remove item in list
            let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
            this.items.splice(indexTemp, 1)
            this.listIdDeleted.push(rowIndex - 1)

            this.totalRow = this.totalRow - 1
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.toast.error(errorMess)
          })
        }
      }
    },

    /**
     * Load list option promotion type
     */
    getPromotionTypeList () {
      adminAPI.getListPromotionType().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.typeOptions = this.typeOptions.concat(res.data.data)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.router.push('/promo/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.router.push('/promo/index/')
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true

      this.getPromoList()
    },

    /**
     * Get list
     */
    getPromoList () {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true
      // Define params
      let param = {
        "name": this.inputs.name,
        "price": this.inputs.price,
        "type": this.inputs.type,
        "expire": this.inputs.expire,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      adminAPI.getPromoList(param).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.promotions //Mapper.mapPromoModelToDto(res.data.data.promotions, this.offset)
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
        } else {
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
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

  }
}
</script>
