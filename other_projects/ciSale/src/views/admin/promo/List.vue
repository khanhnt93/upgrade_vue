<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-success pull-right px-4 btn-width-120" @click="goToAdd()">
                Thêm
              </button>
            </div>
          </div>

           <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <h4 class="mt-2 text-center text-header">Khuyến Mãi</h4>
            </div>
          </div>
          <hr>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/4 px-2">
              <label> Tên </label>
              <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.name">
            </div>

            <div class="w-full md:w-1/4 px-2">
              <label> Giá </label>
              <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.price"
              maxlength="11"
              @keyup="integerOnly($event.target)">
            </div>

            <div class="w-full md:w-1/4 px-2">
              <label> Loại </label>
              <select
              id="status"
              class="form-control"
              v-model="inputs.type">
                <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div class="w-full md:w-1/4 px-2">
              <label> Hiệu lực </label>
              <select
              id="status"
              class="form-control"
              v-model="inputs.expire">
                <option v-for="option in expireOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2 mt-2 mb-2">
            <div class="w-full px-2">
              <button class="btn btn-outline-primary pull-right px-4 btn-width-120" :disabled="onSearch" @click.prevent="prepareToSearch">
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
                      <th>STT</th>
                      <th>Mã</th>
                      <th>Tên</th>
                      <th>Loại</th>
                      <th>Phần trăm giảm giá (%)</th>
                      <th>Giảm giá tối đa</th>
                      <th>Trên tổng giá</th>
                      <th>Giá trị voucher</th>
                      <th>Item free</th>
                      <th>Số lượng</th>
                      <th>Còn lại</th>
                      <th>Ngày hiệu lực</th>
                      <th>Ngày Hết Hạn</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in items" :key="item.id">
                      <td>{{ item.stt }}</td>
                      <td>{{ item.code }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.type_name }}</td>
                      <td>{{ item.discount_percent }}</td>
                      <td>{{ item.max_discount }}</td>
                      <td>{{ item.discount_on_amount }}</td>
                      <td>{{ item.value_of_voucher }}</td>
                      <td>{{ item.item_free }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.remaining }}</td>
                      <td>{{ item.expired_date_from }}</td>
                      <td>{{ item.expired_date_to }}</td>
                      <td class="actions-cell">
                        <div class="flex justify-center gap-2">
                          <button class="btn btn-sm btn-primary" @click="edit(item.id)" title="Edit">
                            <i class="fa fa-edit" />
                          </button>
                          <button class="btn btn-sm btn-danger" @click="deleted(item.id, item.name, item.stt, item.method)" title="Delete">
                            <i class="fa fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </div>
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
import promotionApi from '@/api/promotion'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    return { toast, router }
  },
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
      const mappedVariant = variant === 'danger' ? 'error' : variant
      this.toast(content, mappedVariant)
    },

    /**
     * Make toast with title
     */
    makeToast(variant = null, title="Success!!!", content="Thao tác thành công!!!") {
      this.toast(content, variant)
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
        if(confirm('Xóa ' + name + ". Bạn có chắc không?")) {
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
              this.makeToast('error', "Xóa thất bại!!!", errorMess)
            })
          }
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
        this.toast(errorMess, 'error')
      })
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.router.push('/promotion/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.router.push('/promotion/index')
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
        this.toast(errorMess, 'error')

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
    }
  }
}
</script>
