<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col>
                <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd()">
                  Thêm
                </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center">Nguyên liệu - Mặt hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="4">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name">
            </b-col>
            <b-col md="4" v-if="units.length > 0">
              <label> Đơn vị </label>
              <b-form-select
              :options="units"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.unit"></b-form-select>
            </b-col>
            <b-col md="4">
              <label> Trạng Thái </label>
              <b-form-select
              :options="statusOptions"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.status"></b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch"
                        @click.prevent="prepareToSearch">
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
            <template v-slot:cell(quantity)="data">{{ currencyFormat(data.item.quantity) }}</template>
            <template v-slot:cell(min_quantity)="data">{{ currencyFormat(data.item.min_quantity) }}</template>
            <template v-slot:cell(action)="dataId">
              <b-list-group horizontal>
                <b-list-group-item v-b-tooltip.hover title="Plus quantity" @click="addQuantity(dataId.item.id, dataId.item.quantity, dataId.item.unit_name)">
                  <i class="fa fa-plus" />
                </b-list-group-item>
                <b-list-group-item v-b-tooltip.hover title="Minus quantity" @click="minusQuantity(dataId.item.id, dataId.item.quantity, dataId.item.unit_name)">
                  <i class="fa fa-minus" />
                </b-list-group-item>
                <b-list-group-item v-b-tooltip.hover title="Update quantity" @click="updateQuantity(dataId.item.id, dataId.item.quantity, dataId.item.unit_name)">
                  <i class="fa fa-balance-scale" />
                </b-list-group-item>
                <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                  <i class="fa fa-edit" />
                </b-list-group-item>
                <b-list-group-item v-b-tooltip.hover title="Delete" @click="deleted(dataId.item.id, dataId.item.name, dataId.item.stt)">
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

    <!-- Modal add quantity resource -->
    <b-modal centered hide-footer hide-header id="modal-add-quantity-resource">
      <b-row>
        <b-col class="text-center text-header">
          <h5>Thêm số lượng </h5>
        </b-col>
      </b-row>
      <br>
      <!-- Loading -->
      <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>

      <b-row>
        <b-col>
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
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorQuantityBonus">
              Vui lòng nhập số lượng thêm vào
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Nguyên nhân thêm</label><span class="error-sybol"></span>
            <b-form-textarea
              id="reasonBonus"
              v-model="quantityChange.reasonBonus"
              type="text"
              autocomplete="new-password"
              class="form-control"
              placeholder="Nhập hàng"
              maxlength="255">
            </b-form-textarea>
              <b-form-invalid-feedback class="invalid-feedback" :state="!errorReasonBonus">
                Vui lòng nhập nguyên nhân thêm
              </b-form-invalid-feedback>
          </div>

       </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="mt-3">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="$bvModal.hide('modal-add-quantity-resource')">
            Huỷ
          </b-button>

          <b-button variant="outline-success" class="pull-right btn-width-120" @click="confirmBonusQuantity">
            Xác nhận
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal minus quantity resource -->
    <b-modal centered hide-footer hide-header id="modal-minus-quantity-resource">
      <b-row>
        <b-col class="text-center text-header">
          <h5>Giảm số lượng </h5>
        </b-col>
      </b-row>
      <br>
      <!-- Loading -->
      <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>

      <b-row>
        <b-col>
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
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorQuantityBonus">
              Vui lòng nhập số lượng giảm đi
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Nguyên nhân giảm</label><span class="error-sybol"></span>
            <b-form-textarea
              id="reasonBonus"
              v-model="quantityChange.reasonBonus"
              type="text"
              autocomplete="new-password"
              class="form-control"
              placeholder="Hư hỏng"
              maxlength="255">
            </b-form-textarea>
              <b-form-invalid-feedback class="invalid-feedback" :state="!errorReasonBonus">
                Vui lòng nhập nguyên nhân giảm
              </b-form-invalid-feedback>
          </div>

       </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="mt-3">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="$bvModal.hide('modal-minus-quantity-resource')">
            Huỷ
          </b-button>

          <b-button variant="outline-success" class="pull-right btn-width-120" @click="confirmBonusQuantity">
            Xác nhận
          </b-button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal update quantity resource -->
    <b-modal centered hide-footer hide-header id="modal-update-quantity-resource">
      <b-row>
        <b-col class="text-center text-header">
          <h5>Cập nhật số lượng </h5>
        </b-col>
      </b-row>
      <br>
      <!-- Loading -->
      <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>

      <b-row>
        <b-col>
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
            <b-form-invalid-feedback class="invalid-feedback" :state="!errorQuantityBonus">
              Vui lòng nhập số lượng mới
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label>Nguyên nhân thay đổi</label><span class="error-sybol"></span>
            <b-form-textarea
              id="reasonBonus"
              v-model="quantityChange.reasonBonus"
              type="text"
              autocomplete="new-password"
              class="form-control"
              placeholder="Kiểm kê hàng ngày"
              maxlength="255">
            </b-form-textarea>
              <b-form-invalid-feedback class="invalid-feedback" :state="!errorReasonBonus">
                Vui lòng nhập nguyên nhân thay đổi
              </b-form-invalid-feedback>
          </div>

       </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" class="mt-3">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="$bvModal.hide('modal-update-quantity-resource')">
            Huỷ
          </b-button>

          <b-button variant="outline-success" class="pull-right btn-width-120" @click="confirmUpdateQuantity">
            Xác nhận
          </b-button>
        </b-col>
      </b-row>

    </b-modal>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
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
            adminAPI.deleteResource(id).then(res => {

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
     * Add quantity to resource
     */
    addQuantity(id, quantity, unit_name) {
      this.quantityChange.id = id
      this.quantityChange.currentQuantity = quantity
      this.quantityChange.unit_name = unit_name
      this.quantityChange.type = "plus"
      this.quantityChange.reasonBonus = "Nhập hàng"

      this.$bvModal.show('modal-add-quantity-resource')
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

      this.$bvModal.show('modal-minus-quantity-resource')
    },

    /**
     * update quantity to resource
     */
    updateQuantity(id, quantity, unit_name) {
      this.quantityChange.id = id
      this.quantityChange.currentQuantity = quantity
      this.quantityChange.unit_name = unit_name
      this.quantityChange.reasonBonus = "Kiểm kê hàng"

      this.$bvModal.show('modal-update-quantity-resource')
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
            this.$bvModal.hide('modal-add-quantity-resource')
            this.$bvModal.hide('modal-minus-quantity-resource')
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
            this.$bvModal.hide('modal-update-quantity-resource')
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
      this.$router.push('/resource/index/' + id)
    },

    /**
     * Go to page add
     */
    goToAdd () {
      this.$router.push('/resource/index')
    }
  }
}
</script>
