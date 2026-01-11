<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-end mb-4">
        <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-[120px]" @click="goToAdd()">
          Thêm
        </button>
      </div>

      <h4 class="text-xl font-semibold text-center mt-2 mb-4">Nguyên liệu - Mặt hàng</h4>
      <hr class="mb-4">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block mb-2">Tên</label>
          <input
            id="name"
            type="text"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.name">
        </div>
        <div v-if="units.length > 0">
          <label class="block mb-2">Đơn vị</label>
          <select
            id="unit"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.unit">
            <option v-for="unit in units" :key="unit.value" :value="unit.value">{{ unit.text }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">Trạng Thái</label>
          <select
            id="status"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="inputs.status">
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.text }}</option>
          </select>
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
              <th class="border border-gray-300 px-4 py-2">Tên</th>
              <th class="border border-gray-300 px-4 py-2">Số lượng</th>
              <th class="border border-gray-300 px-4 py-2">Số lượng tối thiểu</th>
              <th class="border border-gray-300 px-4 py-2">Đơn vị</th>
              <th class="border border-gray-300 px-4 py-2 actions-cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" :class="getRowClass(item)">
              <td class="border border-gray-300 px-4 py-2 text-center">{{ item.stt }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(item.quantity) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(item.min_quantity) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.unit_name }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <div class="flex gap-2 justify-center">
                  <button class="text-blue-600 hover:text-blue-800" title="Plus quantity" @click="addQuantity(item.id, item.quantity, item.unit_name)">
                    <i class="fa fa-plus" />
                  </button>
                  <button class="text-yellow-600 hover:text-yellow-800" title="Minus quantity" @click="minusQuantity(item.id, item.quantity, item.unit_name)">
                    <i class="fa fa-minus" />
                  </button>
                  <button class="text-green-600 hover:text-green-800" title="Update quantity" @click="updateQuantity(item.id, item.quantity, item.unit_name)">
                    <i class="fa fa-balance-scale" />
                  </button>
                  <button class="text-blue-600 hover:text-blue-800" title="Edit" @click="edit(item.id)">
                    <i class="fa fa-edit" />
                  </button>
                  <button class="text-red-600 hover:text-red-800" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
      <span class="loading-more" v-if="hasNext === false">--Hết--</span>
      <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
    </div>

    <!-- Modal add quantity resource -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeAddModal">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h5 class="text-center text-lg font-semibold mb-4">Thêm số lượng</h5>
        
        <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>

        <div class="space-y-4">
          <div>
            <label class="block mb-2">Số lượng hiện tại</label>
            <div class="flex items-center gap-2">
              <input
                v-model="quantityChange.currentQuantity"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-100"
                disabled>
              <label class="whitespace-nowrap">{{quantityChange.unit_name}}</label>
            </div>
          </div>

          <div>
            <label class="block mb-2">Số lượng thêm vào<span class="error-sybol"></span></label>
            <div class="flex items-center gap-2">
              <input
                v-model="quantityChange.quantityBonus"
                type="text"
                autocomplete="new-password"
                class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorQuantityBonus }"
                maxlength="11"
                @keyup="integerAndPointOnly($event.target)">
              <label class="whitespace-nowrap">{{quantityChange.unit_name}}</label>
            </div>
            <div v-if="errorQuantityBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng thêm vào
            </div>
          </div>

          <div>
            <label class="block mb-2">Nguyên nhân thêm<span class="error-sybol"></span></label>
            <textarea
              v-model="quantityChange.reasonBonus"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorReasonBonus }"
              placeholder="Nhập hàng"
              maxlength="255"
              rows="3">
            </textarea>
            <div v-if="errorReasonBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập nguyên nhân thêm
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-[120px]" @click="closeAddModal">
            Huỷ
          </button>
          <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-[120px]" @click="confirmBonusQuantity">
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Modal minus quantity resource -->
    <div v-if="showMinusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeMinusModal">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h5 class="text-center text-lg font-semibold mb-4">Giảm số lượng</h5>
        
        <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>

        <div class="space-y-4">
          <div>
            <label class="block mb-2">Số lượng hiện tại</label>
            <div class="flex items-center gap-2">
              <input
                v-model="quantityChange.currentQuantity"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-100"
                disabled>
              <label class="whitespace-nowrap">{{quantityChange.unit_name}}</label>
            </div>
          </div>

          <div>
            <label class="block mb-2">Số lượng giảm đi<span class="error-sybol"></span></label>
            <div class="flex items-center gap-2">
              <input
                v-model="quantityChange.quantityBonus"
                type="text"
                autocomplete="new-password"
                class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorQuantityBonus }"
                maxlength="11"
                @keyup="integerAndPointOnly($event.target)">
              <label class="whitespace-nowrap">{{quantityChange.unit_name}}</label>
            </div>
            <div v-if="errorQuantityBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng giảm đi
            </div>
          </div>

          <div>
            <label class="block mb-2">Nguyên nhân giảm<span class="error-sybol"></span></label>
            <textarea
              v-model="quantityChange.reasonBonus"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorReasonBonus }"
              placeholder="Hư hỏng"
              maxlength="255"
              rows="3">
            </textarea>
            <div v-if="errorReasonBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập nguyên nhân giảm
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-[120px]" @click="closeMinusModal">
            Huỷ
          </button>
          <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-[120px]" @click="confirmBonusQuantity">
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Modal update quantity resource -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeUpdateModal">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h5 class="text-center text-lg font-semibold mb-4">Cập nhật số lượng</h5>
        
        <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>

        <div class="space-y-4">
          <div>
            <label class="block mb-2">Số lượng cũ</label>
            <div class="flex items-center gap-2">
              <input
                v-model="quantityChange.currentQuantity"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-100"
                disabled>
              <label class="whitespace-nowrap">{{quantityChange.unit_name}}</label>
            </div>
          </div>

          <div>
            <label class="block mb-2">Số lượng mới<span class="error-sybol"></span></label>
            <div class="flex items-center gap-2">
              <input
                v-model="quantityChange.quantityBonus"
                type="text"
                autocomplete="new-password"
                class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errorQuantityBonus }"
                maxlength="11"
                @keyup="integerAndPointOnly($event.target)">
              <label class="whitespace-nowrap">{{quantityChange.unit_name}}</label>
            </div>
            <div v-if="errorQuantityBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập số lượng mới
            </div>
          </div>

          <div>
            <label class="block mb-2">Nguyên nhân thay đổi<span class="error-sybol"></span></label>
            <textarea
              v-model="quantityChange.reasonBonus"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorReasonBonus }"
              placeholder="Kiểm kê hàng ngày"
              maxlength="255"
              rows="3">
            </textarea>
            <div v-if="errorReasonBonus" class="text-red-500 text-sm mt-1">
              Vui lòng nhập nguyên nhân thay đổi
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-[120px]" @click="closeUpdateModal">
            Huỷ
          </button>
          <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-[120px]" @click="confirmUpdateQuantity">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin'
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
        unit: null,
        status: null
      },
      items: [],
      units: [{value: null, text: ''}],
      statusOptions: [
        {value: null, text: ''},
        {value: 'still', text: 'Còn hàng'},
        {value: 'runningOut', text: 'Sắp hết'},
        {value: 'over', text: 'Đã hết'}
      ],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      listIdDeleted: [],
      loading: false,
      totalRow: 0,
      click: false,
      quantityChange: {
        currentQuantity: null,
        quantityBonus: null,
        reasonBonus: null
      },
      saving:false,
      showAddModal: false,
      showMinusModal: false,
      showUpdateModal: false
    }
  },
  computed: {
    errorQuantityBonus: function () {
      return this.checkInfo(this.quantityChange.quantityBonus)
    },
    errorReasonBonus: function () {
      return this.checkInfo(this.quantityChange.reasonBonus)
    },
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.delete)

    // Load option unit
    this.getUnitOptions()

    // Load list when load page
    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.delete)
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorQuantityBonus || this.errorReasonBonus)
    },

    /**
     * Get row class based on quantity
     */
    getRowClass(item) {
      if(item.quantity > item.min_quantity) {
        return ''
      } else if(item.quantity <= item.min_quantity && item.quantity > 0) {
        return 'bg-yellow-100'
      } else if(item.quantity <= 0) {
        return 'bg-red-100'
      }
      return ''
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
        "unit": this.inputs.unit,
        "status": this.inputs.status,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      adminAPI.searchResource(param).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let it = res.data.data.resource
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
     * Load list option group menu
     */
    getUnitOptions () {
      adminAPI.getListUnitOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let units = res.data.data
          for (let index in units) {
            this.units.push(units[index])
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Delete
     */
    deleted (id, name, rowIndex) {
      if(id && name) {
        if(confirm('Xóa ' + name + ". Bạn có chắc không?")) {
          adminAPI.deleteResource(id).then(res => {

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
     * Add quantity to resource
     */
    addQuantity(id, quantity, unit_name) {
      this.quantityChange.id = id
      this.quantityChange.currentQuantity = quantity
      this.quantityChange.unit_name = unit_name
      this.quantityChange.type = "plus"
      this.quantityChange.reasonBonus = "Nhập hàng"
      this.quantityChange.quantityBonus = null

      this.showAddModal = true
    },

    /**
     * Close add modal
     */
    closeAddModal() {
      this.showAddModal = false
      this.click = false
    },

    /**
     * Minus quantity to resource
     */
    minusQuantity(id, quantity, unit_name) {
      this.quantityChange.id = id
      this.quantityChange.currentQuantity = quantity
      this.quantityChange.unit_name = unit_name
      this.quantityChange.type = "minus"
      this.quantityChange.reasonBonus = "Hư hỏng"
      this.quantityChange.quantityBonus = null

      this.showMinusModal = true
    },

    /**
     * Close minus modal
     */
    closeMinusModal() {
      this.showMinusModal = false
      this.click = false
    },

    /**
     * update quantity to resource
     */
    updateQuantity(id, quantity, unit_name) {
      this.quantityChange.id = id
      this.quantityChange.currentQuantity = quantity
      this.quantityChange.unit_name = unit_name
      this.quantityChange.reasonBonus = "Kiểm kê hàng"
      this.quantityChange.quantityBonus = null

      this.showUpdateModal = true
    },

    /**
     * Close update modal
     */
    closeUpdateModal() {
      this.showUpdateModal = false
      this.click = false
    },

    /**
     * Confirm bonus quantity
     */
    confirmBonusQuantity() {
      this.click = true

      let checkValidate = this.checkValidate()
      if(!checkValidate) {
        return
      }

      this.saving = true

      adminAPI.bonusQuantityResource(this.quantityChange).then(res => {

        if(res != null && res.data != null){
          if (res.data.status == 200) {
            // Update data font end
            for(let index in this.items) {
              if(this.items[index].id == this.quantityChange.id) {
                if(this.quantityChange.type == "plus") {
                  this.items[index].quantity = Math.round((parseFloat(this.items[index].quantity) + parseFloat(this.quantityChange.quantityBonus)) * 1000) / 1000
                } else {
                  this.items[index].quantity = Math.round((parseFloat(this.items[index].quantity) - parseFloat(this.quantityChange.quantityBonus)) * 1000) / 1000
                }
              }
            }

            // Show popup success
            this.toast.success('Cập nhật số lượng thành công ')

            // Reset data
            this.quantityChange.id = null
            this.quantityChange.currentQuantity = null
            this.quantityChange.quantityBonus = null
            this.quantityChange.reasonBonus = null
            this.quantityChange.type = null
            this.click = false

            // Hidden modal
            this.showAddModal = false
            this.showMinusModal = false
          }
        }
        this.saving = false
      }).catch(err => {
        console.log(err)
        this.saving = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })

    },

    /**
     * Confirm update quantity
     */
    confirmUpdateQuantity() {
      this.click = true

      let checkValidate = this.checkValidate()
      if(!checkValidate) {
        return
      }

      this.saving = true

      let quantityChange = parseFloat(this.quantityChange.currentQuantity) - parseFloat(this.quantityChange.quantityBonus)
      if(quantityChange > 0) {
        this.quantityChange.type = "minus"
      } else {
        this.quantityChange.type = "plus"
      }
      this.quantityChange.quantityBonus = quantityChange.toString().replace("-","")

      adminAPI.bonusQuantityResource(this.quantityChange).then(res => {

        if(res != null && res.data != null){
          if (res.data.status == 200) {
            // Update data font end
            for(let index in this.items) {
              if(this.items[index].id == this.quantityChange.id) {
                if(this.quantityChange.type == "plus") {
                  this.items[index].quantity = Math.round((parseFloat(this.items[index].quantity) + parseFloat(this.quantityChange.quantityBonus)) * 1000) / 1000
                } else {
                  this.items[index].quantity = Math.round((parseFloat(this.items[index].quantity) - parseFloat(this.quantityChange.quantityBonus)) * 1000) / 1000
                }
              }
            }

            // Show popup success
            this.toast.success('Cập nhật số lượng thành công ')

            // Reset data
            this.quantityChange.id = null
            this.quantityChange.currentQuantity = null
            this.quantityChange.quantityBonus = null
            this.quantityChange.reasonBonus = null
            this.quantityChange.type = null
            this.click = false

            // Hidden modal
            this.showUpdateModal = false
          }
        }
        this.saving = false
      }).catch(err => {
        console.log(err)
        this.saving = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })

    },

    /**
     * Only input integer and point
     */
     integerAndPointOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerAndPointOnly(valueInput)
      item.value = result
    },

    /**
     * Go to page edit
     */
    edit (id) {
      this.router.push('/resource/index/' + id)
    },

    /**
     * Go to page add
     */
    goToAdd () {
      this.router.push('/resource/index')
    }
  }
}
</script>
