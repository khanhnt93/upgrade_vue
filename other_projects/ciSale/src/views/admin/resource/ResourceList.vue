<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
                <button class="btn btn-outline-success pull-right btn-width-120" @click="goToAdd()">
                  Thêm
                </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-2 text-center">Nguyên liệu - Mặt hàng</h4>
            </div>
          </div>
          <hr>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/3 px-2">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name">
            </div>
            <div class="w-full md:w-1/3 px-2" v-if="units.length > 0">
              <label> Đơn vị </label>
              <select
              :options="units"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-select"
              v-model="inputs.unit"></select>
            </div>
            <div class="w-full md:w-1/3 px-2">
              <label> Trạng Thái </label>
              <select
              :options="statusOptions"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-select"
              v-model="inputs.status"></select>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2 mt-2 mb-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch"
                        @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              Số kết quả: {{totalRow}}
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td v-for="field in fields" :key="field.key">
                    <template v-if="field.key === 'quantity'">
                      {{ currencyFormat(item.quantity) }}
                    </template>
                    <template v-else-if="field.key === 'min_quantity'">
                      {{ currencyFormat(item.min_quantity) }}
                    </template>
                    <template v-else-if="field.key === 'action'">
                      <div class="flex gap-2 justify-center">
                        <button class="btn btn-sm btn-outline-primary px-2 py-1" @click="addQuantity(item.id, item.quantity, item.unit_name)" title="Plus quantity">
                          <i class="fa fa-plus" />
                        </button>
                        <button class="btn btn-sm btn-outline-warning px-2 py-1" @click="minusQuantity(item.id, item.quantity, item.unit_name)" title="Minus quantity">
                          <i class="fa fa-minus" />
                        </button>
                        <button class="btn btn-sm btn-outline-info px-2 py-1" @click="updateQuantity(item.id, item.quantity, item.unit_name)" title="Update quantity">
                          <i class="fa fa-balance-scale" />
                        </button>
                        <button class="btn btn-sm btn-outline-success px-2 py-1" @click="edit(item.id)" title="Edit">
                          <i class="fa fa-edit" />
                        </button>
                        <button class="btn btn-sm btn-outline-danger px-2 py-1" @click="deleted(item.id, item.name, item.stt)" title="Delete">
                          <i class="fa fa-trash" />
                        </button>
                      </div>
                    </template>
                    <template v-else>
                      {{ item[field.key] }}
                    </template>
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

      </div>
    </div>

    <!-- Modal add quantity resource -->
    <Dialog :open="showModalAddQuantity" @close="showModalAddQuantity = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div class="p-6">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-center text-header">
                <h5>Thêm số lượng </h5>
              </div>
            </div>
            <br>
            <!-- Loading -->
            <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="form-group">
                  <label>Số lượng hiện tại</label>
                  <div class="input-group">
                    <input
                    id="currentQuantity"
                    v-model="quantityChange.currentQuantity"
                    type="text"
                    class="form-control"
                    :disabled="1==1">
                    <label class="pl-2">{{quantityChange.unit_name}}</label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Số lượng thêm vào</label><span class="error-sybol"></span>
                  <div class="input-group">
                    <input
                      id="quantityBonus"
                      v-model="quantityChange.quantityBonus"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      maxlength="11"
                      @keyup="integerAndPointOnly($event.target)">
                    <label class="pl-2">{{quantityChange.unit_name}}</label>
                  </div>
                    <div :class="['invalid-feedback', {'d-block': errorQuantityBonus}]">
                    Vui lòng nhập số lượng thêm vào
                  </div>
                </div>

                <div class="form-group">
                  <label>Nguyên nhân thêm</label><span class="error-sybol"></span>
                  <textarea
                    id="reasonBonus"
                    v-model="quantityChange.reasonBonus"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    placeholder="Nhập hàng"
                    maxlength="255"
                    rows="3">
                  </textarea>
                    <div :class="['invalid-feedback', {'d-block': errorReasonBonus}]">
                      Vui lòng nhập nguyên nhân thêm
                    </div>
                </div>

             </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-center mt-3">
                <button class="btn btn-outline-success btn-width-120" @click="confirmBonusQuantity">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>

    <!-- Modal minus quantity resource -->
    <Dialog :open="showModalMinusQuantity" @close="showModalMinusQuantity = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div class="p-6">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-center text-header">
                <h5>Giảm số lượng </h5>
              </div>
            </div>
            <br>
            <!-- Loading -->
            <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="form-group">
                  <label>Số lượng hiện tại</label>
                  <div class="input-group">
                    <input
                    v-model="quantityChange.currentQuantity"
                    type="text"
                    class="form-control"
                    :disabled="1==1">
                    <label class="pl-2">{{quantityChange.unit_name}}</label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Số lượng giảm đi</label><span class="error-sybol"></span>
                  <div class="input-group">
                    <input
                      v-model="quantityChange.quantityBonus"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      maxlength="11"
                      @keyup="integerAndPointOnly($event.target)">
                    <label class="pl-2">{{quantityChange.unit_name}}</label>
                  </div>
                  <div :class="['invalid-feedback', {'d-block': errorQuantityBonus}]">
                    Vui lòng nhập số lượng giảm đi
                  </div>
                </div>

                <div class="form-group">
                  <label>Nguyên nhân giảm</label><span class="error-sybol"></span>
                  <textarea
                    id="reasonBonus"
                    v-model="quantityChange.reasonBonus"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    placeholder="Hư hỏng"
                    maxlength="255"
                    rows="3">
                  </textarea>
                    <div :class="['invalid-feedback', {'d-block': errorReasonBonus}]">
                      Vui lòng nhập nguyên nhân giảm
                    </div>
                </div>

             </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-center mt-3">
                <button class="btn btn-outline-success btn-width-120" @click="confirmBonusQuantity">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>

    <!-- Modal update quantity resource -->
    <Dialog :open="showModalUpdateQuantity" @close="showModalUpdateQuantity = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div class="p-6">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-center text-header">
                <h5>Cập nhật số lượng </h5>
              </div>
            </div>
            <br>
            <!-- Loading -->
            <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <div class="form-group">
                  <label>Số lượng cũ</label>
                  <div class="input-group">
                    <input
                    v-model="quantityChange.currentQuantity"
                    type="text"
                    class="form-control"
                    :disabled="1==1">
                    <label class="pl-2">{{quantityChange.unit_name}}</label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Số lượng mới</label><span class="error-sybol"></span>
                  <div class="input-group">
                    <input
                      v-model="quantityChange.quantityBonus"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      maxlength="11"
                      @keyup="integerAndPointOnly($event.target)">
                    <label class="pl-2">{{quantityChange.unit_name}}</label>
                  </div>
                  <div class="invalid-feedback">
                    Vui lòng nhập số lượng mới
                  </div>
                </div>

                <div class="form-group">
                  <label>Nguyên nhân thay đổi</label><span class="error-sybol"></span>
                  <textarea
                    id="reasonBonus"
                    v-model="quantityChange.reasonBonus"
                    type="text"
                    autocomplete="new-password"
                    class="form-control"
                    placeholder="Kiểm kê hàng ngày"
                    maxlength="255"
                    rows="3">
                  </textarea>
                    <div class="invalid-feedback">
                      Vui lòng nhập nguyên nhân thay đổi
                    </div>
                </div>

             </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-center mt-3">
                <button class="btn btn-outline-success btn-width-120" @click="confirmUpdateQuantity">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import unitAPI from '@/api/unit'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    return { toast, router }
  },
  components: {
    Dialog,
    DialogPanel
  },
  data () {
    return {
      showModalAddQuantity: false,
      showModalMinusQuantity: false,
      showModalUpdateQuantity: false,
      inputs: {
        name: null,
        unit: null,
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
          key: 'quantity',
          label: 'Số lượng'
        },
        {
          key: 'min_quantity',
          label: 'Số lượng tối thiểu'
        },
        {
          key: 'unit_name',
          label: 'Đơn vị'
        },
        {
          key: 'action',
          label: '',
          class: 'actions-cell'
        }
      ],
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
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorQuantityBonus || this.errorReasonBonus)
    },

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      this.toast(content, variant === 'danger' ? 'error' : variant)
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
     * Check row variant
     */
    checkRowVariant() {
      for( let index in this.items) {
        if(this.items[index].quantity > this.items[index].min_quantity) {
          delete this.items[index]._rowVariant
        } else {
          if(this.items[index].quantity <= this.items[index].min_quantity && this.items[index].quantity > 0) {
            this.items[index]._rowVariant = 'warning'
          } else {
            if(this.items[index].quantity <= 0) {
              this.items[index]._rowVariant = 'danger'
            }
          }
        }


      }
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
        this.checkRowVariant()
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
    getUnitOptions () {
      unitAPI.getListUnitOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let units = res.data.data
          for (let index in units) {
            this.units.push(units[index])
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
            this.popToast('error', errorMess)
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

      this.showModalAddQuantity = true
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

      this.showModalMinusQuantity = true
    },

    /**
     * update quantity to resource
     */
    updateQuantity(id, quantity, unit_name) {
      this.quantityChange.id = id
      this.quantityChange.currentQuantity = quantity
      this.quantityChange.unit_name = unit_name
      this.quantityChange.reasonBonus = "Kiểm kê hàng"

      this.showModalUpdateQuantity = true
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

      this.saving = false

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

                // Check variant
                this.checkRowVariant()
              }
            }

            // Show popup success
            this.popToast('success', 'Cập nhật số lượng thành công ')

            // Reset data
            this.quantityChange.id = null
            this.quantityChange.currentQuantity = null
            this.quantityChange.quantityBonus = null
            this.quantityChange.reasonBonus = null
            this.quantityChange.type = null
            this.click = false

            // Hidden modal
            this.showModalAddQuantity = false
            this.showModalMinusQuantity = false
          }
        }
        this.saving = false
      }).catch(err => {
        console.log(err)
        this.saving = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
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

      this.saving = false

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

                // Check variant
                this.checkRowVariant()
              }
            }

            // Show popup success
            this.popToast('success', 'Cập nhật số lượng thành công ')

            // Reset data
            this.quantityChange.id = null
            this.quantityChange.currentQuantity = null
            this.quantityChange.quantityBonus = null
            this.quantityChange.reasonBonus = null
            this.quantityChange.type = null
            this.click = false

            // Hidden modal
            this.showModalUpdateQuantity = false
          }
        }
        this.saving = false
      }).catch(err => {
        console.log(err)
        this.saving = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })

    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return result
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
