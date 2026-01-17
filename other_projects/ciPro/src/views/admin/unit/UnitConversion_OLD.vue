<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="openModalCreateUnitConvert()">
                Thêm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Chuyển Đổi Đơn Vị</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="mt-3">
            <b-col md="12">
              Số kết quả: <b>{{items.length}}</b>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <b-table
                hover
                bordered
                stacked="md"
                :fields="fields"
                :items="items">
                <template v-slot:cell(price)="data"><p class="text-right">{{ currencyFormat(data.item.price) }}</p></template>
                <template v-slot:cell(action)="dataId">
                  <b-list-group horizontal>
                    <b-list-group-item v-b-tooltip.hover title="Cập nhật"
                                       @click="openModalCreateUnitConvert(dataId.item)">
                      <i class="fa fa-edit" />
                    </b-list-group-item>
                    <b-list-group-item v-b-tooltip.hover title="Xóa"
                                       @click="deleted(dataId.item)">
                      <i class="fa fa-trash" />
                    </b-list-group-item>
                  </b-list-group>
                </template>
              </b-table>
            </b-col>
          </b-row>


          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </b-card>

      </b-col>
    </b-row>

    <!-- Modal add/update -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-change-invoice-status">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">{{modalTitle}} Chuyển Đổi Đơn Vị</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Sản phẩm<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="9" class="mt-2">
              <multiselect
                v-model="productSelect"
                :options="productOptions"
                :loading="loadingProductOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn sản phẩm--"
                label="name_full"
                track-by="name_full">
              </multiselect>
              <b-form-invalid-feedback  class="invalid-feedback" :state="!errorProduct">
                Vui lòng chọn sản phẩm
              </b-form-invalid-feedback>
              <b-row v-show="productSelect.id"  class="mt-2">
                <b-col>
                  <p>Đơn vị gốc: {{productSelect.unit_name}}</p>
                  <p>Giá bán: {{productSelect.price}}</p>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Đơn vị chuyển đổi<span class="error-sybol"></span></label>
            </b-col>
            <b-col md="9" class="mt-2">
              <b-form-select
                :options="unitOptions"
                id="unit"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="unitConvert.target_unit_id"
                v-on:change="changeTargetUnit()">
              </b-form-select>
              <b-form-invalid-feedback  class="invalid-feedback" :state="!errorUnit">
                Vui lòng chọn đơn vị chuyển đổi
              </b-form-invalid-feedback>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Tỷ giá chuyển đổi</label><span class="error-sybol"></span>
            </b-col>
            <b-col md="9" class="mt-2">
              <input
                id="name"
                type="text"
                class="form-control"
                v-model="unitConvert.conversion_value"
                autocomplete="new-password"
                maxlength="14">
              <b-form-invalid-feedback class="invalid-feedback" :state="!errorConversionValue">
                Vui lòng nhập tên
              </b-form-invalid-feedback>
              <p v-show="productSelect.unit_name && unitConvert.target_unit_id && unitConvert.conversion_value">
                1 {{productSelect.unit_name}} = {{unitConvert.conversion_value + ' ' + target_unit_name}}
              </p>
            </b-col>
          </b-row>

          <b-row class="form-row">
            <b-col md="3" class="mt-2">
              <label>Giá bán theo đơn vị mới</label>
            </b-col>
            <b-col md="9" class="mt-2">
              <input
                id="name"
                type="text"
                class="form-control"
                v-model="unitConvert.price"
                autocomplete="new-password"
                maxlength="14"
                @change="changePrice">
            </b-col>
          </b-row>

      <b-row class="mt-2">
        <b-col cols="12">
          <b-button variant="outline-secondary" class="pull-left btn-width-120"
                    @click.prevent="hideModalCreateUnitConvert">
            Bỏ qua
          </b-button>

          <b-button v-show="!saving" variant="outline-primary" class="pull-right btn-width-120"
                    :disabled="saving" @click.prevent="addUpdateUnitConvert">
            Xác nhận
          </b-button>

          <span class="loading-more" v-show="saving"><icon name="loading" width="60" /></span>
        </b-col>
      </b-row>

    </b-modal>

  </div>
</template>


<script>
import unitApi from '@/api/unit'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Multiselect
  },
  data () {
    return {
      unitConvert: {
        product_id: null,
        root_unit_id: null,
        target_unit_id: null,
        conversion_value: null,
        price: null
      },
      target_unit_name: "",
      loadingProductOptions: false,
      productSelect: {},
      productOptions: [],
      unitOptions:[],
      modalTitle: "Thêm Mới",
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'product_name',
          label: 'Tên SP'
        },
        {
          key: 'root_unit_name',
          label: 'Đơn vị gốc'
        },
        {
          key: 'root_price',
          label: 'Giá bán gốc'
        },
        {
          key: 'target_unit_name',
          label: 'Đơn vị chuyển đổi'
        },
        {
          key: 'conversion_value',
          label: 'Tỷ giá'
        },
        {
          key: 'price',
          label: 'Giá bán mới'
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
      onSearch: false,
      loading: false,
      click: false,
      saving: false,
    }
  },
  mounted() {
    // Get group option
    this.getProductOptions()
    this.getUnitOption()

    // Load list when load page
    this.search()
  },
  computed: {
    errorProduct () {
      return this.checkInfo(this.productSelect.id)
    },
    errorUnit () {
      return this.checkInfo(this.unitConvert.target_unit_id)
    },
    errorConversionValue () {
      return this.checkInfo(this.unitConvert.conversion_value)
    },
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorProduct || this.errorUnit || this.errorConversionValue)
    },

    /**
     *  Get product options
     */
     getProductOptions() {
      this.loadingProductOptions = true

      unitApi.getListProductOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          // Products
          this.productOptions = res.data.data
          let itemEmpty = {"id": null, "name_full": '-- Chọn sản phẩm --'}
          this.productOptions.unshift(itemEmpty)
        }

        this.loadingProductOptions = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingProductOptions = false
      })
    },

    /**
     *  Get unit options
     */
     getUnitOption() {
      unitApi.getListUnitOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.unitOptions = [{value: null, text: ''}]

          var units = res.data.data
          if(units) {
            for (let i in units) {
              this.unitOptions.push(units[i])
            }
          }
        }
      })
    },

    /**
     *  Get unit options
     */
     getProductSelectById(product_id) {
      if(!product_id) {
        return {"id": null, "name_full": '-- Chọn sản phẩm --'}
      }
      for(let product of this.productOptions) {
        if(product.id == product_id) {
          this.productSelect = product
          return
        }
      }
      return {"id": null, "name_full": '-- Chọn sản phẩm --'}
    },

    openModalCreateUnitConvert(item=null) {
      if(!item) {
        this.click = false
        this.resetValueSeting()
      } else {
        this.unitConvert = item
      }

      if(item && item.product_id) {
        this.getProductSelectById(item.product_id)
      }
      this.$bvModal.show('modal-change-invoice-status')
    },

    hideModalCreateUnitConvert() {
      this.productSelect = {"id": null, "name_full": '-- Chọn sản phẩm --'}
      this.resetValueSeting()
      this.$bvModal.hide('modal-change-invoice-status')
    },

    /**
     * Get unit target name
     */
    changeTargetUnit() {
      if(!this.unitConvert.target_unit_id) {
        this.target_unit_name = ''
        return
      }
      if(this.unitConvert.target_unit_id == this.productSelect.unit_id) {
        this.unitConvert.target_unit_id = null
        this.popToast('danger', "Vui lòng chọn khác đơn vị gốc!")
        return
      }
      for(let unit of this.unitOptions) {
        if(unit.value == this.unitConvert.target_unit_id) {
          this.target_unit_name = unit.text
          return
        }
      }
      this.target_unit_name = ''
      return
    },

    changePrice() {
      try {
        let price = parseInt((this.unitConvert.price + "").replaceAll(",", ""))
        this.unitConvert.price = this.currencyFormat(price)
      } catch (error) {
        this.unitConvert.price = 0
      }
    },

    /**
     *  Search
     */
    search() {
      if (this.loading) { return }
      this.loading = true

      // Search
      unitApi.getUnitConversion().then(res => {
        if(res != null && res.data != null && res.data.data != null){
          this.items = res.data.data
        }else{
          this.items = []
        }
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loading = false
      })
    },

    edit(index) {

      this.fundSetting = this.items[index]
      this.changeType(this.fundSetting.type)
      this.btn_text = "Cập nhật"

      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      if(num === 0) {
          return "0"
      }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },

    deleted (item) {
      if(item.id) {
        this.$bvModal.msgBoxConfirm('Xóa chuyển đổi từ đơn vị [' + item.root_unit_name + '] qua đơn vị [' + item.target_unit_name + '] của sản phẩm [' + item.product_name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            unitApi.deleteUnitConversion(item.id).then(res => {
              if(res != null && res.data != null){
                this.search()
                this.popToast('success', 'Xoá thành công!')
              }
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
      }
    },

    resetValueSeting() {
      this.unitConvert = {
        product: null,
        root_unit_id: null,
        target_unit_id: null,
        conversion_value: null,
        price: 0
      }
    },

    addUpdateUnitConvert () {
      this.click = true
      if(this.saving) {
        return
      }

      let checkValidate = this.checkValidate()
      if(!checkValidate) {
        return
      }

      this.saving = true
      this.unitConvert.product_id = this.productSelect.id
      this.unitConvert.root_unit_id = this.productSelect.unit_id
      this.unitConvert.price = (this.unitConvert.price + "").replaceAll(",", "")

      let id = this.unitConvert.id
      if(id){
        // Edit
        unitApi.updateUnitConversion(this.unitConvert).then(res => {
          this.saving = false
          if(res != null && res.data != null && res.data.status == 200){
            this.search()
            this.popToast('success', 'Cập nhật thành công!')
            this.hideModalCreateUnitConvert()

            this.resetValueSeting()
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      } else {
        // Add
        unitApi.addUnitConversion(this.unitConvert).then(res => {
          this.saving = false
          if(res != null && res.data != null && res.data.status == 200){
            this.search()
            this.popToast('success', 'Thêm mới thành công!')
            this.hideModalCreateUnitConvert()

            this.resetValueSeting()
          }
        }).catch(err => {
          this.saving = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })
      }

    },
  }
}
</script>
