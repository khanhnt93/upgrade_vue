<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right px-4 btn-width-120" @click="goToAdd()">
                Thêm
              </b-button>
            </b-col>
          </b-row>

           <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Khuyến Mãi</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="3">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name">
            </b-col>

            <b-col md="3">
              <label> Giá </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.price"
              maxlength="11"
              @keyup="integerOnly($event.target)">
            </b-col>

            <b-col md="3">
              <label> Loại </label>
              <b-form-select
              :options="typeOptions"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.type"></b-form-select>
            </b-col>

            <b-col md="3">
              <label> Hiệu lực </label>
              <b-form-select
              :options="expireOptions"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.expire"></b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right px-4 btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              Số kết quả: {{totalRow}}
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
                <template v-slot:cell(method)="data">{{ formatMethod(data.item.method) }}</template>
                <template v-slot:cell(actions)="dataId">
                  <b-list-group horizontal>
                    <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                      <i class="fa fa-edit" />
                    </b-list-group-item>
                    <b-list-group-item v-b-tooltip.hover title="Delete"
                                      @click="deleted(dataId.item.id, dataId.item.name, dataId.item.stt, dataId.item.method)">
                      <i class="fa fa-trash" />
                    </b-list-group-item>
                  </b-list-group>
                </template>
                </b-table>
            </b-col>
          </b-row>


          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import promotionApi from '@/api/promotion'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'


export default {
  data () {
    return {
      inputs: {
        name: null,
        price: null,
        method: null,
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
          key: 'type_name',
          label: 'Loại'
        },

        {
          key: 'discount_percent',
          label: 'Phần trăm giảm giá (%)'
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
      methodOptions: [
        {value: null, text: ''},
        {value: 'trade_point', text: 'Đổi điểm'},
        {value: 'other', text: 'Khác'}
      ],
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

    window.addEventListener('resize', this.delete)

    // Load list option promotion type
    this.getPromotionTypeList()

    // Get list promotion
    this.getPromoList()

  },
  methods: {
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
     * Make toast with title
     */
    makeToast(variant = null, title="Success!!!", content="Thao tác thành công!!!") {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
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
          this.getPromoList ()
        }
      }
    },

    /**
     * Delete
     */
    deleted (id, name, rowIndex, method) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if (res) {
            let dataPost = {
              "id": id,
              "method": method
            }
            promotionApi.deletePromo(dataPost).then(res => {
              // Remove item in list
              let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
              this.items.splice(indexTemp, 1)
              this.listIdDeleted.push(rowIndex - 1)

              this.totalRow = this.totalRow - 1
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.makeToast('danger', "Xóa thất bại!!!", errorMess)
            })
          }
        })
      }
    },

    /**
     * Load list option promotion type
     */
    getPromotionTypeList () {
      promotionApi.getListPromotionType().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.typeOptions = this.typeOptions.concat(res.data.data)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/promotion/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.$router.push('/promotion/index')
    },

    /**
     * Format method
     */
    formatMethod(method) {
      let result = "Khác"
      if(method == 'trade_point') {
        result = "Đổi điểm"
      }
      return result
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
        "method": this.inputs.method,
        "type": this.inputs.type,
        "expire": this.inputs.expire,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      promotionApi.getPromoList(param).then(res => {
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

  }
}
</script>
