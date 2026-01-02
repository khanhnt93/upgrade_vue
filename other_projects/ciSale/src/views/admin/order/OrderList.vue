<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="gotoAdd">
                Thêm
              </b-button>

              <b-button variant="outline-primary" class="pull-right btn-width-200 mr-2" @click="openModalCheckProductNeedImport">
                Xem SP cần nhập hàng
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">Danh sách Đặt Hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row class="form-row">

            <b-col md="3">
              <label>Từ ngày</label>
              <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" :typeable="true"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
            </b-col>

            <b-col md="3">
              <label>Đến ngày</label>
              <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" :typeable="true"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
            </b-col>

            <b-col md="3">
              <label>Tên khách hàng</label>
              <input
                id="customer_name"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_name"
                :disabled="onSearch">
            </b-col>

            <b-col md="3">
              <label>SĐT khách hàng</label>
              <input
                id="customer_phone"
                type="text"
                maxlength="14"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_phone"
                :disabled="onSearch"
                @keyup="integerOnly($event.target)">
            </b-col>

          </b-row>

          <b-row class="mt-2">
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
            <template v-slot:cell(order_number)="data">
              <a :href="'/order-detail/' + data.item.id">{{data.item.order_number}}</a>
            </template>
            <template v-slot:cell(total)="data">
              {{currencyFormat(data.item.total)}}
            </template>
            <template v-slot:cell(total_paid)="data">
              {{currencyFormat(data.item.total_paid)}}
            </template>
            <!--<template v-slot:cell(profit)="data">-->
              <!--{{currencyFormat(data.item.profit)}}-->
            <!--</template>-->

            <template v-slot:cell(actions)="dataId">
              <b-list-group horizontal v-show="dataId.item.status != 2">
                <b-list-group-item v-b-tooltip.hover title="Sửa"
                         @click="goToUpdate(dataId.item.id)">
                  <i class="fa fa-edit" />
                </b-list-group-item>
                <b-list-group-item v-b-tooltip.hover title="Xoá"
                         @click="deleteOrder(dataId.item.id, dataId.item.order_number, dataId.item.customer_name)">
                  <i class="fa fa-trash" />
                </b-list-group-item>
              </b-list-group>
            </template>

            <template v-slot:cell(go_to_sell)="dataId">
              <b-button v-show="dataId.item.status == 1" variant="outline-success" class="mr-2"
                        @click="goToTrade(dataId.item.id)">
                Bán
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

    <!--Modal tìm kiếm khách hàng -->
    <b-modal centered hide-footer hide-header size="xl" id="modal-check-product-need-import">
      <b-row>
        <b-col md="12">
          <h4 class="modal-title text-center text-success">Danh sách sản phẩm cần nhập hàng</h4>
        </b-col>
      </b-row>
      <hr>

      <b-row class="mt-2">
        <b-col>
          <span class="loading-more" v-show="loadingCheckProductImport"><icon name="loading" width="60" /></span>
          <b-table
            hover
            bordered
            stacked="md"
            :fields="productImportFields"
            :items="productImportItems">
              <template v-slot:cell(quantity_repo)="data">
                {{currencyFormat(data.item.quantity_repo)}}
              </template>
              <template v-slot:cell(quantity)="data">
                {{currencyFormat(data.item.quantity)}}
              </template>
              <template v-slot:cell(price_sell)="data">
                {{currencyFormat(data.item.price_sell)}}
              </template>
              <template v-slot:cell(amount_sell)="data">
                {{currencyFormat(data.item.amount_sell)}}
              </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col class="text-center">
          <span>--Hết--</span>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <b-button variant="outline-secondary" class="pull-left btn-width-120" @click="hideModalCheckProductNeedImport">
            Quay lại
          </b-button>
        </b-col>
        <b-col md="6" class="text-right pull-right">
            <download-excel
              class   = "btn btn-default text-header"
              :data   = "productImportItems"
              :fields = "productImportExcelFields"
              worksheet = "Sản phẩm cần nhập hàng"
              name    = "san_pham_can_nhap_hang.xls">
              <b>Xuất Excel</b>
            </download-excel>
        </b-col>
      </b-row>

    </b-modal>
  </div>
</template>
<script>


import orderApi from '@/api/order'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)


export default {
  components: {
    Datepicker,
  },
  data () {
    return {
      inputs: {
        customer_name: null,
        customer_phone: null,
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
          key: 'appointment_date',
          label: 'Ngày hẹn lấy hàng'
        },
        {
          key: 'order_number',
          label: 'Số đặt hàng'
        },
        {
          key: 'customer_name',
          label: 'Tên KH'
        },
        {
          key: 'customer_phone',
          label: 'Sđt KH'
        },
        {
          key: 'total',
          label: 'Thành tiền',
          class: 'text-right'
        },
        {
          key: 'total_paid',
          label: 'Đã thanh toán',
          class: 'text-right'
        },
        {
          key: 'status_str',
          label: 'Trạng thái'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        },
        {
          key: 'go_to_sell',
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
      productImportFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'order_number',
          label: 'Mã ĐH đặt'
        },
        {
          key: 'appointment_date',
          label: 'Ngày hẹn lấy'
        },
        {
          key: 'product_name',
          label: 'Sản phẩm'
        },
        {
          key: 'quantity_repo',
          label: 'Số lượng kho'
        },
        {
          key: 'quantity',
          label: 'Số lượng đặt'
        },
        {
          key: 'price_sell',
          label: 'Đơn giá đặt'
        },
        {
          key: 'amount_sell',
          label: 'Thành tiền'
        }
      ],
      productImportItems: [],
      loadingCheckProductImport: false,
      productImportExcelFields: {
        'Mã ĐH đặt': 'order_number',
        'Ngày hẹn lấy': 'appointment_date',
        'Sản phẩm' : 'product_name',
        'Số lượng kho' : 'quantity_repo',
        'Số lượng đặt' : 'quantity',
        'Đơn giá đặt' : 'price_sell',
        'Thành tiền' : 'amount_sell'
      },
    }
  },
  mounted() {
    // Get default from date and to date
    let dateNow = new Date()
    let toDate = new Date(dateNow.setDate(dateNow.getDate() + 15))
    this.inputs.to_date = toDate.toJSON().slice(0,10)
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 30))
    this.inputs.from_date = fromDate.toJSON().slice(0,10)

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

    /**
     * Only input date
     */
    inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },

      /**
       * Go to detail
       */
      goToDetail(id) {
        this.$router.push('/order-detail/' + id)
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
        "customer_name": this.inputs.customer_name,
        "customer_phone": this.inputs.customer_phone,
        "from_date": this.inputs.from_date,
        "to_date": this.inputs.to_date,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      orderApi.searchOrder(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.orders
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
      if(num === 0) {
          return "0"
      }
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
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
     * Delete
     */
    deleteOrder(id, order_number, customer_name) {
      if(id) {
        this.$bvModal.msgBoxConfirm('Xóa đơn đặt hàng [' + order_number + "] của khách hàng [" + customer_name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if (res) {
            orderApi.deleteOrder(id).then(res => {
              if(res != null && res.data != null) {
                this.search()
              }

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
     * Go to add
     */
    gotoAdd() {
      this.$router.push('/order-index')
    },

    /**
     * Go to update
     */
    goToUpdate(id) {
      this.$router.push('/order-index/' + id)
    },

    /**
     * Go to trade
     */
    goToTrade(id) {
      this.$router.push('/trade-sell-from-order/' + id)
    },

    openModalCheckProductNeedImport() {
      this.$bvModal.show('modal-check-product-need-import')

      this.getProductNeedImport()
    },

    hideModalCheckProductNeedImport() {
      this.productImportItems = []
      this.$bvModal.hide('modal-check-product-need-import')
    },

    getProductNeedImport () {
      // this.click = true
      if (this.loadingCheckProductImport) { return }

      this.loadingCheckProductImport = true

      orderApi.getProductNeedImport().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.productImportItems = res.data.data
        }
        this.loadingCheckProductImport = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loadingCheckProductImport = false
      })
    },
  }
}
</script>
