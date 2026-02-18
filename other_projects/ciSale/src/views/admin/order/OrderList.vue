<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="bg-white shadow rounded-lg p-4">

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-success float-right btn-width-120" @click="gotoAdd">
                Thêm
              </button>

              <button class="btn btn-outline-primary float-right btn-width-200 mr-2" @click="openModalCheckProductNeedImport">
                Xem SP cần nhập hàng
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-1 text-center text-header">Danh sách Đặt Hàng</h4>
            </div>
          </div>
          <hr>

          <div class="flex flex-wrap -mx-2 form-row">

            <div class="w-full md:w-1/4 px-2">
              <label>Từ ngày</label>
              <datepicker v-model="inputs.from_date" format="yyyy-MM-dd" :typeable="true"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
            </div>

            <div class="w-full md:w-1/4 px-2">
              <label>Đến ngày</label>
              <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" :typeable="true"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus" ></datepicker>
            </div>

            <div class="w-full md:w-1/4 px-2">
              <label>Tên khách hàng</label>
              <input
                id="customer_name"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.customer_name"
                :disabled="onSearch">
            </div>

            <div class="w-full md:w-1/4 px-2">
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
            </div>

          </div>

          <div class="flex flex-wrap -mx-2 mt-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-primary float-right btn-width-120" :disabled="onSearch"
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

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <table class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th class="text-center">Mã ĐH</th>
                    <th class="text-center">Ngày hẹn lấy</th>
                    <th class="text-center">Khách hàng</th>
                    <th class="text-center">SĐT</th>
                    <th class="text-center">Tổng tiền đặt</th>
                    <th class="text-center">Số tiền đã trả</th>
                    <th class="text-center">Trạng thái</th>
                    <th class="text-center">Thao tác</th>
                    <th class="text-center">Bán hàng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in items" :key="item.id">
                    <td>
                      <a :href="'/order-detail/' + item.id">{{item.order_number}}</a>
                    </td>
                    <td>{{item.appointment_date}}</td>
                    <td>{{item.customer_name}}</td>
                    <td>{{item.customer_phone}}</td>
                    <td class="text-right">{{currencyFormat(item.total)}}</td>
                    <td class="text-right">{{currencyFormat(item.total_paid)}}</td>
                    <td>{{item.status_str}}</td>
                    <td class="text-center">
                      <div class="flex justify-center gap-2" v-show="item.status != 2">
                        <button class="btn btn-sm btn-outline-primary" title="Sửa"
                         @click="goToUpdate(item.id)">
                          <i class="fa fa-edit" />
                        </button>
                        <button class="btn btn-sm btn-outline-danger" title="Xoá"
                         @click="deleteOrder(item.id, item.order_number, item.customer_name)">
                          <i class="fa fa-trash" />
                        </button>
                      </div>
                    </td>
                    <td class="text-center">
                      <button v-show="item.status == 1" class="btn btn-outline-success mr-2"
                        @click="goToTrade(item.id)">
                        Bán
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Loading -->
          <div class="text-center" v-show="loading">
            <i class="fas fa-spinner fa-spin fa-3x text-primary"></i>
          </div>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </div>
      </div>
    </div>

    <!--Modal check product need import -->
    <TransitionRoot appear :show="modalCheckProductImport" as="template">
      <Dialog as="div" @close="hideModalCheckProductNeedImport" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div class="flex flex-wrap -mx-2">
                  <div class="w-full px-2">
                    <h4 class="modal-title text-center text-success">Danh sách sản phẩm cần nhập hàng</h4>
                  </div>
                </div>
                <hr>

                <div class="flex flex-wrap -mx-2 mt-2">
                  <div class="w-full px-2">
                  <div class="text-center" v-show="loadingCheckProductImport">
                    <i class="fas fa-spinner fa-spin fa-3x text-primary"></i>
                  </div>
                    <table class="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th class="text-center">Mã ĐH đặt</th>
                          <th class="text-center">Ngày hẹn lấy</th>
                          <th class="text-center">Sản phẩm</th>
                          <th class="text-center">Số lượng kho</th>
                          <th class="text-center">Số lượng đặt</th>
                          <th class="text-center">Đơn giá đặt</th>
                          <th class="text-center">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in productImportItems" :key="item.id">
                          <td>{{item.order_number}}</td>
                          <td>{{item.appointment_date}}</td>
                          <td>{{item.product_name}}</td>
                          <td class="text-right">{{currencyFormat(item.quantity_repo)}}</td>
                          <td class="text-right">{{currencyFormat(item.quantity)}}</td>
                          <td class="text-right">{{currencyFormat(item.price_sell)}}</td>
                          <td class="text-right">{{currencyFormat(item.amount_sell)}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2 mt-3">
                  <div class="w-full px-2 text-center">
                    <span>--Hết--</span>
                  </div>
                </div>

                <div class="flex flex-wrap -mx-2">
                  <div class="w-full md:w-1/2 px-2">
                    <button class="btn btn-outline-secondary float-left btn-width-120" @click="hideModalCheckProductNeedImport">
                      Quay lại
                    </button>
                  </div>
                  <div class="w-full md:w-1/2 px-2 text-right">
                      <download-excel
                        class   = "btn btn-default text-header"
                        :data   = "productImportItems"
                        :fields = "productImportExcelFields"
                        worksheet = "Sản phẩm cần nhập hàng"
                        name    = "san_pham_can_nhap_hang.xls">
                        <b>Xuất Excel</b>
                      </download-excel>
                  </div>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
<script>


import orderApi from '@/api/order'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'

// import JsonExcel from 'vue-json-excel' // TODO: Replace with xlsx library



export default {
  components: {
    Datepicker,
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild
  },
  setup() {
    const { toast } = useToast()
    const router = useRouter()

    return { toast, router }
  },
  data () {
    return {
      inputs: {
        customer_name: null,
        customer_phone: null,
        from_date: new Date(),
        to_date: new Date()
      },
      modalCheckProductImport: false,
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
    // let toDate = new Date(dateNow.setDate(dateNow.getDate() + 15))
    // this.inputs.to_date = toDate
    // let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 30))
    // this.inputs.from_date = fromDate
    
    // Set default dates correctly as Date objects
    this.inputs.to_date = new Date(dateNow.setDate(dateNow.getDate() + 15))
    // Reset dateNow for correct calculation if needed or use a new Date()
    let dateNow2 = new Date()
    this.inputs.from_date = new Date(dateNow2.setDate(dateNow2.getDate() - 30))

    window.addEventListener('scroll', this.onScroll)

    // Search
    this.search()
  },
  methods: {

    /**
     * Make toast without title
     */
    popToast(variant, content) {
      if (variant === 'success') {
        this.toast.success(content)
      } else if (variant === 'error' || variant === 'danger') {
        this.toast.error(content)
      } else if (variant === 'warning') {
        this.toast.warning(content)
      } else {
        this.toast.info(content)
      }
    },

    /**
     * Scroll event
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      // event.preventDefault() // Removed to allow normal scrolling behavior
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
        this.router.push('/order-detail/' + id)
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
        "from_date": this.inputs.from_date ? new Date(this.inputs.from_date).toISOString().slice(0, 10) : null,
        "to_date": this.inputs.to_date ? new Date(this.inputs.to_date).toISOString().slice(0, 10) : null,
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
        this.popToast('error', errorMess)

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
        if(confirm('Xóa đơn đặt hàng [' + order_number + "] của khách hàng [" + customer_name + "]. Bạn có chắc không?")) {
          orderApi.deleteOrder(id).then(res => {
            if(res != null && res.data != null) {
              this.search()
            }

          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('error', "Xóa thất bại!!!" + errorMess)
          })
        }
      }
    },

      /**
     * Go to add
     */
    gotoAdd() {
      this.router.push('/order-index')
    },

    /**
     * Go to update
     */
    goToUpdate(id) {
      this.router.push('/order-index/' + id)
    },

    /**
     * Go to trade
     */
    goToTrade(id) {
      this.router.push('/trade-sell-from-order/' + id)
    },

    openModalCheckProductNeedImport() {
      this.modalCheckProductImport = true

      this.getProductNeedImport()
    },

    hideModalCheckProductNeedImport() {
      this.productImportItems = []
      this.modalCheckProductImport = false
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
        this.popToast('error', errorMess)

        this.loadingCheckProductImport = false
      })
    },
  }
}
</script>
