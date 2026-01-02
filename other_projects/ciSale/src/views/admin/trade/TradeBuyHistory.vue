<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Lịch Sử Mua Hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">

            <b-col md="3">
              <label> Nhóm SP </label>
              <multiselect
                v-model="productGroupSelect"
                :options="productGroupOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn nhóm sản phẩm--"
                label="name"
                track-by="name"
                @input="changeProductGroup">
              </multiselect>
            </b-col>

            <b-col md="3">
              <label> Loại SP </label>
              <multiselect
                v-model="productTypeSelect"
                :options="productTypeOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn loại sản phẩm--"
                label="name"
                track-by="name">
              </multiselect>
            </b-col>

            <b-col md="3">
              <label> Từ ngày </label>
              <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" :typeable="true"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
            </b-col>

            <b-col md="3">
              <label> Đến ngày </label>
              <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" :typeable="true"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
            </b-col>

          </b-row>

          <b-row>
            <b-col md="12">
              <b-button variant="outline-primary" class="pull-right btn-width-120"
                        :disabled="onSearch" @click.prevent="prepareToSearch">
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
            <template v-slot:cell(sub_total)="data">
              {{currencyFormat(data.item.sub_total)}}
            </template>
            <template v-slot:cell(total)="data">
              {{currencyFormat(data.item.total)}}
            </template>

            <template v-slot:cell(actions)="data">
              <b-button v-show="data.item.trade_status != 1" variant="outline-danger" class="pull-right btn-width-120 mr-2"
                        @click="goToUpdateTrade(data.item.id, data.item.trade_type_int)">
                Sửa
              </b-button>
              <b-button v-show="data.item.trade_status == 1" variant="outline-success" class="pull-right btn-width-120 mr-2"
                        @click="goToDetail(data.item.id)">
                Chi tiết
              </b-button>
            </template>

          </b-table>

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
import tradeApi from '@/api/trade'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      typeOptions: [
        {"value": null, "text": ''},
        {"value": 0, "text": 'Nhập vào'},
        {"value": 1, "text": 'Bán ra'}
      ],
      productGroupSelect: {},
      productGroupOptions:[],
      productTypeSelect:{},
      productTypeOptions:[],
      productTypeOptionStore: [],
      loadingGetOptions: false,
      inputs: {
        product_group_id: null,
        product_type_id: null,
        product_id: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      fields: [
        {
          key: 'stt',
          label: 'STT',
          class: 'text-center'
        },
        {
          key: 'created_at',
          label: 'Ngày',
          class: 'text-center'
        },
        {
          key: 'bill_number',
          label: 'Số hóa đơn',
          class: 'text-center'
        },
        {
          key: 'trade_type',
          label: 'Loại',
          class: 'text-center'
        },
        {
          key: 'partner_name',
          label: 'Tên đối tác'
        },
        {
          key: 'sub_total',
          label: 'Tổng tiền SP',
          class: 'text-right'
        },
        {
          key: 'total',
          label: 'Thành tiền',
          class: 'text-right'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      totalRow: 0,
    }
  },
  mounted() {
    // Get default from date and to date
    let dateNow = new Date()
    this.inputs.to_date = dateNow.toJSON().slice(0,10)
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
    this.inputs.from_date = fromDate.toJSON().slice(0,10)

    window.addEventListener('scroll', this.onScroll)

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    // Search
    this.search()
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
     * Scroll event
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
          this.search()
        }
      }
    },

    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

    resetListProductType() {
      this.productTypeSelect = {}
      this.productTypeOptions = JSON.parse(JSON.stringify(this.productTypeOptionStore))

      if(this.productTypeOptions.length > 0) {
        let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
        itemEmpty.id = null
        itemEmpty.name = ""
        this.productTypeOptions.unshift(itemEmpty)
      }
    },

    /**
     *  Get tất cả các options liên quan
     */
    getOptionsRelated() {
      this.loadingGetOptions = true
      let params = {
        "product_groups": true,
        "product_types": true
      }
      tradeApi.getAllOptionsRelated(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let options = res.data.data

          // product_groups
          if (params.product_groups) {
            this.productGroupOptions = options.product_groups
            let itemEmpty = {"id": null, "name": ""}
            this.productGroupOptions.unshift(itemEmpty)
          }

          // product_types
          if (params.product_types) {
            this.productTypeOptionStore = options.product_types
            this.resetListProductType()
          }
        }
        this.loadingGetOptions = false
      }).catch(err => {
        this.loadingGetOptions = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     *  Event change product group
     */
    changeProductGroup() {
      if(this.productGroupSelect && this.productGroupSelect.id) {
        // Reload list type by group
        this.productTypeOptions = []
        for (let i in this.productTypeOptionStore) {
          if(this.productGroupSelect.id == this.productTypeOptionStore[i].product_group_id) {
            this.productTypeOptions.push(this.productTypeOptionStore[i])
          }
        }
        if(this.productTypeOptions.length > 0) {
          let itemEmpty = JSON.parse(JSON.stringify(this.productTypeOptions[0]))
          itemEmpty.id = null
          itemEmpty.name = ""
          this.productTypeOptions.unshift(itemEmpty)
        }

        this.productTypeSelect = {"id": null, "name": null}
      } else {
        this.resetListProductType()
      }
    },

      /**
       * Go to detail
       */
      goToDetail(id) {
        this.$router.push('/trade-detail/' + id)
      },

        /**
       * Go to update
       */
      goToUpdateTrade(id, type) {
          console.log(type)
        if(type == 0) {
          this.$router.push('/trade-buy/' + id)
        } else {
          this.$router.push('/trade-sell/' + id)
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
     * Search
     */
    search () {
      // this.click = true
      if (this.onSearch) { return }

      this.onSearch = true
      this.loading = true

      let params = {
        "product_group_id": this.productGroupSelect && this.productGroupSelect.id ? this.productGroupSelect.id : null,
        "product_type_id": this.productTypeSelect && this.productTypeSelect.id ? this.productTypeSelect.id : null,
        "product_id": this.inputs.product_id,
        "from_date": this.inputs.from_date,
        "to_date": this.inputs.to_date,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      tradeApi.getTradeBuyHis(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.trade_historys
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
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
