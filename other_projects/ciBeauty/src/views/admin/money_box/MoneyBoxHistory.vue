<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <button class="btn btn-outline-secondary pull-left btn-width-120" @click="goBack">
                  Quay lại
                </button>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <h4 class="mt-2 text-center text-header">Lịch sử két tiền</h4>
              </div>
            </div>
            <hr>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-4">
                <label> Loại giao dịch </label>
                <select class="form-control form-control"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  v-model="inputs.type">
                  <option v-for="option in typeOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
              <div class="col-span-4">
                <label> Loại tiền </label>
                <select class="form-control form-control"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  v-model="inputs.moneyType">
                  <option v-for="option in moneyTypeOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
              <div class="col-span-4">
                <label> Nhân viên </label>
                <select class="form-control form-control"
                  id="status"
                  type="text"
                  autocomplete="new-password"
                  v-model="inputs.staff">
                  <option v-for="option in staffOption" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-2 mb-2">
              <div class="col-span-12">
                <button class="btn btn-outline-primary float-right btn-width-120" :disabled="onSearch" @click="prepareToSearch">
                  Tìm Kiếm
                </button>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                Số kết quả: {{totalRow}}
              </div>
            </div>

            <table class="table table-bordered table-hover table-responsive-stack">
              <thead>
                <tr>
                  <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td v-for="field in fields" :key="field.key" :data-label="field.label">
                    <div v-if="field.key === 'type'">{{ convertTypeCodeToName(item.type) }}</div>
                    <div v-else-if="field.key === 'total'">{{ currencyFormat(item.total) }}</div>
                    <div v-else-if="field.key === 'cash'">{{ currencyFormat(item.cash) }}</div>
                    <div v-else-if="field.key === 'credit'">{{ currencyFormat(item.credit) }}</div>
                    <div v-else-if="field.key === 'e_money'">{{ currencyFormat(item.e_money) }}</div>
                    <div v-else>{{ item[field.key] }}</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
            <span class="loading-more" v-if="hasNext === false">--Hết--</span>
            <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>

          </div>
        </div>
      </div>
    </div>
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
