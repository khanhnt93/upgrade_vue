<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg p-4">

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-1 text-center text-header">Lịch Sử Kho Hàng</h4>
            </div>
          </div>
          <hr>

          <div class="flex flex-wrap -mx-2 form-row">

            <div class="w-full md:w-1/6 px-2">
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
            </div>

            <div class="w-full md:w-1/6 px-2">
              <label> Loại SP </label>
              <multiselect
                v-model="productTypeSelect"
                :options="productTypeOptions"
                :loading="loadingGetOptions"
                placeholder="--Chọn loại sản phẩm--"
                label="name"
                track-by="name">
              </multiselect>
            </div>

            <div class="w-full md:w-1/6 px-2">
              <label> Loại hoạt động </label>
              <select
                id="type"
                class="form-select form-control"
                v-model="inputs.type_id">
                <option v-for="(item, index) in typeOptions" :key="index" :value="item.value">
                  {{ item.text }}
                </option>
              </select>
            </div>

            <div class="w-full md:w-1/4 px-2">
              <label> Từ ngày </label>
              <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" :typeable="true"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
            </div>

            <div class="w-full md:w-1/4 px-2">
              <label> Đến ngày </label>
              <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" :typeable="true"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
            </div>

          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <label class="label-width text-white">
                Xem
              </label>
              <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <div class="btn-width-120 pull-left">Số kết quả: <span class="text-header"><b>{{totalRow}}</b></span></div>
              <download-excel
                class   = "btn btn-default text-header btn-width-120 pull-right"
                :data   = "items"
                :fields = "excel_fields"
                worksheet = "Sản phẩm trong kho"
                name    = "Sản phẩm trong kho">
                <b>Xuất Excel</b>
              </download-excel>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover table-bordered table-striped">
              <thead>
                <tr>
                  <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td v-for="field in fields" :key="field.key">
                    <template v-if="field.key === 'price'">
                      {{currencyFormat(item.price)}}
                    </template>
                    <template v-else-if="field.key === 'amount'">
                      {{currencyFormat(item.amount)}}
                    </template>
                    <template v-else-if="field.key === 'quantity'">
                      {{currencyFormat(item.quantity)}}
                    </template>
                    <template v-else-if="field.key === 'properties'">
                      <p v-for="(pro) in item.properties" :key="pro.name">
                        + {{pro.name}}: {{pro.value}}
                      </p>
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
  </div>
</template>
<script>
import tradeApi from '@/api/trade'
import repositoryApi from '@/api/repository'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'

// import JsonExcel from 'vue-json-excel' // TODO: Replace with xlsx library
import Multiselect from 'vue-multiselect'



export default {
  setup() {
    const { toast } = useToast()
    return { toast }
  },
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
    this.inputs.to_date = new Date()
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6))
    this.inputs.from_date = fromDate

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
      this.toast(content, variant === 'danger' ? 'error' : variant)
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
        "from_date": this.inputs.from_date ? new Date(this.inputs.from_date).toISOString().slice(0, 10) : null,
        "to_date": this.inputs.to_date ? new Date(this.inputs.to_date).toISOString().slice(0, 10) : null,
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
<style lang="scss" scoped>
  table {
    margin: 0 auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content !important;
    min-width: 0 !important;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
  }
  td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  th {
    text-align: left;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  td {
    white-space: nowrap;
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  td:first-of-type, th:first-of-type {
    border-left: none;
  }

  td:last-of-type, th:last-of-type {
    border-right: none;
  }
</style>