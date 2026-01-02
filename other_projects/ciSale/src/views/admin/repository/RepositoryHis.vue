<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Lịch Sử Kho Hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">

            <b-col md="2">
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

            <b-col md="2">
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

            <b-col md="2">
              <label> Loại hoạt động </label>
              <b-form-select
                id="type"
                :options="typeOptions"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.type_id"></b-form-select>
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
              <label class="label-width text-white">
                Xem
              </label>
              <b-button variant="outline-primary" class="pull-right btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="12">
              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{totalRow}}</b></span></div>
              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "items"
                :fields = "excel_fields"
                worksheet = "Sản phẩm trong kho"
                name    = "Sản phẩm trong kho">
                <b>Xuất Excel</b>
              </download-excel>
            </b-col>
          </b-row>

          <b-table
            hover
            bordered
            stacked="md"
            :fields="fields"
            :items="items">
            <template v-slot:cell(price)="data">
                {{currencyFormat(data.item.price)}}
              </template>
              <template v-slot:cell(amount)="data">
                {{currencyFormat(data.item.amount)}}
              </template>
              <template v-slot:cell(quantity)="data">
                {{currencyFormat(data.item.quantity)}}
              </template>
            <template v-slot:cell(properties)="data">
              <p v-for="(pro) in data.item.properties" :key="pro.name">
                + {{pro.name}}: {{pro.value}}
              </p>
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
import repositoryApi from '@/api/repository'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import Multiselect from 'vue-multiselect'
Vue.component('downloadExcel', JsonExcel)


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
      productGroupSelect: {},
      productGroupOptions:[],
      productTypeSelect:{},
      productTypeOptions:[],
      productTypeOptionStore: [],
      loadingGetOptions: false,
      typeOptions: [
        {"value": null, "text": ''},
        {"value": 0, "text": 'Nhập vào'},
        {"value": 1, "text": 'Bán ra'}
      ],
      inputs: {
        product_type_id: null,
        product_group_id: null,
        type_id: null,
        from_date: '',
        to_date: ''
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'product_group_name',
          label: 'Nhóm SP'
        },
        {
          key: 'product_type_name',
          label: 'Loại SP'
        },
        {
          key: 'product_name',
          label: 'Sản phẩm'
        },
        {
          key: 'properties',
          label: 'Thuộc tính'
        },
        {
          key: 'type',
          label: 'Loại hoạt động'
        },
        {
          key: 'price',
          label: 'Đơn giá'
        },
        {
          key: 'quantity',
          label: 'Số lượng'
        },
        {
          key: 'amount',
          label: 'Thành tiền'
        },
        {
          key: 'created_by',
          label: 'Người tạo'
        },
        {
          key: 'created_at',
          label: 'Ngày tạo'
        },
      ],
      items: [],
      excel_fields: {
        'Ngày tạo': 'created_at',
        'Nhóm SP' : 'product_group_name',
        'Loại SP': 'product_type_name',
        'Sản phẩm' : 'product_name',
        'Loại hoạt động' : 'type',
        'Đơn giá': 'price',
        'Số lượng': 'quantity',
        'Thành tiền': 'amount',
        'Người tạo': 'created_by',
      },
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      totalRow: 0
    }
  },
  mounted() {
    // Get default from date and to date
    let dateNow = new Date()
    this.inputs.to_date = dateNow.toJSON().slice(0,10)
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
    this.inputs.from_date = fromDate.toJSON().slice(0,10)

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    window.addEventListener('scroll', this.onScroll)

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
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true

      let params = {
        "product_group_id": this.productGroupSelect && this.productGroupSelect.id ? this.productGroupSelect.id : null,
        "product_type_id": this.productTypeSelect && this.productTypeSelect.id ? this.productTypeSelect.id : null,
        "type_id": this.inputs.type_id,
        "from_date": this.inputs.from_date,
        "to_date": this.inputs.to_date,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      repositoryApi.getRepositoryHis(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.repository_historys
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
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
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
