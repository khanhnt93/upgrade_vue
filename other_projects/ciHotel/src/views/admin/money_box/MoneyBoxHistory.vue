<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <b-row>
              <b-col>
                <b-button variant="secondary" class="pull-left px-4" @click="goBack">
                  Quay lại
                </b-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col md='12'>
                <h4 class="text-center text-header">LỊCH SỬ KÉT TIỀN</h4>
              </b-col>
            </b-row>
            <hr>

            <b-row>
              <b-col md="3">
                <label> Loại giao dịch </label>
                <b-form-select
                  :options="typeOption"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.type"></b-form-select>
              </b-col>
              <b-col md="3">
                <label> Loại tiền </label>
                <b-form-select
                  :options="moneyTypeOption"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.moneyType"></b-form-select>
              </b-col>
              <b-col md="3">
                <label> Nhân viên </label>
                <b-form-select
                  :options="staffOption"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="inputs.staff"></b-form-select>
              </b-col>
              <b-col md="3">
                <label class="label-width text-white">
                   Xem
                </label>
                <b-button variant="primary" class="pull-right px-4 default-btn-bg" :disabled="onSearch" @click.prevent="prepareToSearch">
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
              <template v-slot:cell(type)="data">{{ convertTypeCodeToName(data.item.type) }}</template>
              <template v-slot:cell(total)="data">{{ currencyFormat(data.item.total) }}</template>
              <template v-slot:cell(cash)="data">{{ currencyFormat(data.item.cash) }}</template>
              <template v-slot:cell(credit)="data">{{ currencyFormat(data.item.credit) }}</template>
              <template v-slot:cell(e_money)="data">{{ currencyFormat(data.item.e_money) }}</template>
            </b-table>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
            <span class="loading-more" v-if="hasNext === false">--Hết--</span>
            <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>

          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'


export default {
  data () {
    return {
      inputs: {
        type: null,
        moneyType: null,
        staff: null
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'type',
          label: 'Loại'
        },
        {
          key: 'total',
          label: 'Số tiền'
        },
        {
          key: 'content',
          label: 'Nội dung'
        },
        {
          key: 'cash',
          label: 'Tiền mặt'
        },
        {
          key: 'credit',
          label: 'Chuyển khoản'
        },
        {
          key: 'e_money',
          label: 'Tiền điện tử'
        },
        {
          key: 'created_at',
          label: 'Thời gian'
        },
        {
          key: 'created_by',
          label: 'Nhân viên'
        },
      ],
      items: [],
      typeOption: [
        {value: null, text: ''},
        {value: 'plus', text: 'Thu'},
        {value: 'minus', text: 'Chi'},
        {value: 'fund', text: 'Vốn đầu ngày'},
      ],
      moneyTypeOption: [
        {value: null, text: ''},
        {value: 'cash', text: 'Tiền mặt'},
        {value: 'credit', text: 'Chuyển khoản'},
        {value: 'e_money', text: 'Tiền điện tử'},
      ],
      staffOption: [
        {value: null, text: ''}
      ],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0

    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    // Load option staff
    this.getStaffOption()

    // Load list when load page
    this.search()
  },
  computed: {
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
     * Get staff option
     */
    getStaffOption() {
      adminAPI.getStaffOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let staffs = res.data.data
          for (let index in staffs) {
            this.staffOption.push(staffs[index])
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
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
     *  Search
     */
    search() {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true
      // Define params
      let params = {
        "type": this.inputs.type,
        "moneyType": this.inputs.moneyType,
        "staff": this.inputs.staff,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      adminAPI.searchMoneyBoxHistory(params).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          let it = res.data.data.data
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
      let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return result
    },

    /**
     * Go back
     */
    goBack () {
      this.$router.push('/money-box')
    },

    /**
     * Convert type code to name
     */
    convertTypeCodeToName(code) {
      if(code == "plus") {
        return "Thu"
      }
      if(code == "minus") {
        return "Chi"
      }
      if(code == "fund") {
        return "Vốn đầu ngày"
      }
      return ""
    }
  }
}
</script>
