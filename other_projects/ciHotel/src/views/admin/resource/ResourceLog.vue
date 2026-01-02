<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center">Lịch sử kho hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md="3" v-if="resourceOptions.length > 0">
              <label> Nguyên liệu </label>
              <b-form-select
              :options="resourceOptions"
              id="status"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="inputs.resource"></b-form-select>
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
              <label> Từ ngày </label>
              <input
                id="fromDate"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.fromDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)">
              <b-form-invalid-feedback  class="invalid-feedback" :state="!errorFromDate">
                Mục từ ngày không đúng
              </b-form-invalid-feedback>
            </b-col>
            <b-col md="3">
              <label> Đến ngày </label>
              <input
                id="toDate"
                type="text"
                autocomplete="new-password"
                class="form-control"
                v-model="inputs.toDate"
                maxlength="10"
                @keyup="inputDateOnly($event.target)">
              <b-form-invalid-feedback  class="invalid-feedback" :state="!errorToDate">
                Mục đến ngày không đúng
              </b-form-invalid-feedback>
            </b-col>
          </b-row>

          <b-row class="mt-2 mb-2">
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
            <template v-slot:cell(quantity)="data" >
              <b v-if="data.item.type == 'plus'">+</b><b v-if="data.item.type == 'minus'">-</b>{{ currencyFormat(data.item.quantity) }}
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
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      resourceOptions: [{value: null, text: ''}],
      typeOptions: [
        {value: null, text: ''},
        {value: 'plus', text: 'Thêm vào'},
        {value: 'minus', text: 'Giảm đi'},
      ],
      inputs: {
        resource: null,
        type: null,
        fromDate: null,
        toDate: null
      },
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'resource_name',
          label: 'Nguyên Liệu - Mặt hàng'
        },
        {
          key: 'quantity',
          label: 'Nội dung'
        },
        {
          key: 'reason',
          label: 'Ghi chú'
        },
        {
          key: 'created_at',
          label: 'Thời gian'
        },
        {
          key: 'staff_name',
          label: 'Tạo bởi',
        }
      ],
      items: [],
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      hasNext: true,
      onSearch: false,
      loadByScroll: false,
      loading: false,
      totalRow: 0,
      click: false,
    }
  },
  computed: {
    errorFromDate: function () {
      return this.checkDate(this.inputs.fromDate)
    },
    errorToDate: function () {
      return this.checkDate(this.inputs.toDate)
    },
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

    window.addEventListener('resize', this.delete)

    // Load option resource
    this.getResourceOptions()

    // Get default date
    this.getDefaultDate()

    // Load list when load page
    this.search()
  },
  methods: {
    checkDate (dateInput) {
      return (this.click && (dateInput == "" || dateInput == null || commonFunc.dateFormatCheck(dateInput) == false))
    },
    checkValidate () {
      return !(this.errorFromDate || this.errorToDate || !this.checkFromDateAndToDate())
    },

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
     * Get default date
     */
    getDefaultDate() {
      // Get default date
      let dateNow = new Date()
      this.inputs.toDate = commonFunc.formatDate(dateNow.toJSON().slice(0,10))
      let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
      this.inputs.fromDate = commonFunc.formatDate(fromDate.toJSON().slice(0,10))
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
     * Check valid from date and to date
     */
    checkFromDateAndToDate() {

        let fromDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate))
        let toDate = new Date(commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate))

        if(fromDate > toDate) {
          this.popToast('danger', "Từ ngày không thể lớn hớn đến ngày")
          return false
        }

        fromDate.setFullYear(fromDate.getFullYear() + 1)

        if(fromDate < toDate) {
          this.popToast('danger', "Thời gian không quá 1 năm")
          return false
        }

      return true
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
      let param = {
        "resource_id": this.inputs.resource,
        "type": this.inputs.type,
        "fromDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.fromDate),
        "toDate": commonFunc.convertDDMMYYYYToYYYYMMDD(this.inputs.toDate),
        "limit": this.pageLimit,
        "offset": this.offset
      }

      // Search
      adminAPI.searchResourceHistory(param).then(res => {
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
     * Load list option resource
     */
    getResourceOptions () {
      adminAPI.getListResourceOption().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let resources = res.data.data
          for (let index in resources) {
            this.resourceOptions.push(resources[index])
          }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
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
     * Only input date
     */
     inputDateOnly(item) {
      let valueInput = item.value
      let result = commonFunc.inputDateOnly(valueInput)
      item.value = result
    },
  }
}
</script>
