<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 gap-4">
            <div class="w-full">
              <button class="btn btn-outline-success pull-right btn-width-200" @click="gotoAdd">
                Thêm Thu Nhập
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div class="w-full">
              <h4 class="mt-1 text-center text-header">Danh Sách Thu Nhập</h4>
            </div>
          </div>
          <hr>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-3">
                <label>Lọc thời gian theo</label>
                <select class="form-control" v-model="time_option">
                  <option v-for="option in timeOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
  
              <div class="w-full md:col-span-3">
                <!--Thời gian theo ngày-->
                <label v-show="time_option == 1">Từ ngày</label>
                <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              </div>
  
              <div class="w-full md:col-span-3">
                <!--Thời gian theo ngày-->
                <label v-show="time_option == 1">Đến ngày</label>
                <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
                
                <!--Thời gian tuần -->
                <label v-show="time_option == 6">Tuần</label>
                <select v-show="time_option == 6" class="form-control" v-model="week_input">
                  <option v-for="option in weekOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
  
                <!--Thời gian tháng -->
                <label v-show="time_option == 2">Tháng</label>
                <select v-show="time_option == 2" class="form-control" v-model="month_input">
                  <option v-for="option in monthOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
  
                <!--Thời gian quý -->
                <label v-show="time_option == 3">Quý</label>
                <select v-show="time_option == 3" class="form-control" v-model="quarter_input">
                  <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
                
                <!--Thời gian năm -->
                <label v-show="time_option == 4">Năm</label>
                <select v-show="time_option == 4" class="form-control" v-model="year_input">
                  <option v-for="option in yearOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
              
              <div class="w-full md:col-span-3">
                <label>Nhóm Thu Nhập</label>
                <select 
                  id="income_group_id"
                  type="text" 
                  class="form-control"
                  v-model="inputs.income_group_id">
                  <option v-for="option in optionsIncomeGroup" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div class="w-full mt-2">
                  <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch"
                            @click.prevent="prepareToSearch">
                    Tìm Kiếm
                  </button>
              </div>
            </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="w-full">
              Tổng tiền thu: <b class="text-header">{{currencyFormat(sum_amount)}}</b>
            </div>
            <div class="w-full text-right">
              Số kết quả: {{currencyFormat(total_row)}}
            </div>
          </div>

          <div class="overflow-x-auto mt-4">
            <table class="min-w-full divide-y divide-gray-200 border">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Ngày chi</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Số tiền</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Nhóm khoản chi</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Ghi chú</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Người chi</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Người tạo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.date_input }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">
                    <a :href="'/income/detail/' + item.id">{{ currencyFormat(item.amount) }}</a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.income_group_name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 border">{{ item.note }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.income_by }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.created_by }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border actions-cell">
                    <div class="flex gap-2" v-if="item.status == 0">
                      <button class="text-blue-600 hover:text-blue-900" title="Duyệt" @click="showModalApprove(item)">
                        <i class="fa fa-check-square-o" />
                      </button>
                      <button class="text-blue-600 hover:text-blue-900" title="Sửa" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="text-red-600 hover:text-red-900" title="Xoá" @click="deleted(item)">
                        <i class="fa fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">--Hết--</span>
          <span class="loading-more" v-if="hasNext === true && total_row != 0"><i class="fa fa-angle-double-down has-next"></i></span>
        </div>
      </div>
    </div>
    
    <!-- Modal tạo phiếu -->
    <div v-if="showApproveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <h4 class="modal-title text-center text-success">Duyệt khoản thu</h4>
          </div>
        </div>
        <hr>
        
        <p>Số tiền chi: {{currencyFormat(currentIncome.amount)}}đ</p>
        <p>Người chi: {{currentIncome.income_by}}</p>
        <p>Ngày chi: {{currentIncome.date_input}}</p>

        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <button class="btn btn-outline-secondary pull-left btn-width-120" @click="hideModalApprove">
              Quay lại
            </button>

            <button class="btn btn-outline-success pull-right btn-width-120" @click="approve" :disabled="approving">
              Xác nhận
            </button>
            
            <span class="loading-more" v-show="approving"><icon name="loading" width="60" /></span>
          </div>
        </div>
      </div>
    </div>
    
    
  </div>
</template>
<script>
import incomeApi from '@/api/income'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useToast } from 'vue-toastification'


export default {
  components: {
    Datepicker
  },
  data () {
    return {
      showApproveModal: false,
      timeOptions: [
        {"value": 1, "text": 'Ngày'},
        {"value": 6, "text": 'Tuần'},
        {"value": 2, "text": 'Tháng'},
        {"value": 3, "text": 'Quý'},
        {"value": 4, "text": 'Năm'},
        {"value": 5, "text": 'Tất cả'}
      ],
      yearOptions: [],
      quarterOptions: [
          {"value": 1, "text": 'Quý 1'},
          {"value": 2, "text": 'Quý 2'},
          {"value": 3, "text": 'Quý 3'},
          {"value": 4, "text": 'Quý 4'}
      ],
      weekOptions: [
          {"value": 1, "text": 'Tuần này'},
          {"value": 2, "text": 'Tuần trước'}
      ],
      monthOptions: [
          {"value": 1, "text": 'Tháng 1'},
          {"value": 2, "text": 'Tháng 2'},
          {"value": 3, "text": 'Tháng 3'},
          {"value": 4, "text": 'Tháng 4'},
          {"value": 5, "text": 'Tháng 5'},
          {"value": 6, "text": 'Tháng 6'},
          {"value": 7, "text": 'Tháng 7'},
          {"value": 8, "text": 'Tháng 8'},
          {"value": 9, "text": 'Tháng 9'},
          {"value": 10, "text": 'Tháng 10'},
          {"value": 11, "text": 'Tháng 11'},
          {"value": 12, "text": 'Tháng 12'}
      ],
      time_option: 6,
      year_input: 2024,
      quarter_input: 1,
      week_input: 1,
      month_input: 1,
      optionsIncomeGroup: [],
      optionsStaff: [],
      // optionsEIBook: [],
      items: [],
      inputs: {
        income_group_id: null,
        staff_id: null,
        // ei_book_id: null,
        from_date: '2000-01-01',
        to_date: '2000-01-02'
      },
      fields: [
        {
          key: 'date_input',
          label: 'Ngày chi'
        },
        {
          key: 'amount',
          label: 'Số tiền'
        },
        {
          key: 'income_group_name',
          label: 'Nhóm khoản chi'
        },
        // {
        //   key: 'ei_book_name',
        //   label: 'Sổ chi tiêu'
        // },
        {
          key: 'note',
          label: 'Ghi chú'
        },
          {
          key: 'income_by',
          label: 'Người chi'
        },
          {
          key: 'created_by',
          label: 'Người tạo'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      onSearch: false,
      hasNext: true,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      loading: false,
      sum_amount: 0,
      total_row: 0,
      currentIncome: {},
      approving: false,
    }
  },
  mounted() {
    this.toast = useToast()
    window.addEventListener('scroll', this.onScroll)
    
    // Get default from date and to date
    this.prepareDateInput()

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    if (this.$route.query.group_id) {
      this.inputs.income_group_id = this.$route.query.group_id
    }
    if (this.$route.query.from_date && this.$route.query.to_date) {
      this.time_option = 1
      this.inputs.from_date = this.$route.query.from_date
      this.inputs.to_date = this.$route.query.to_date
    }

    // Search
    this.prepareToSearch()
  },
  methods: {
     /**
   * Make toast without title
   */
    popToast(variant, content) {
      switch(variant) {
        case 'success': this.toast.success(content); break;
        case 'danger': this.toast.error(content); break;
        case 'warning': this.toast.warning(content); break;
        default: this.toast.info(content);
      }
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
    
    prepareDateInput() {
        let dateNow = new Date()
        this.inputs.to_date = dateNow.toJSON().slice(0,10)
        this.inputs.from_date = new Date(dateNow.setDate(dateNow.getDate() - dateNow.getDay())).toJSON().slice(0,10)
      
        this.year_input = dateNow.getFullYear()
        this.month_input = dateNow.getMonth() + 1

        let currentYear = dateNow.getFullYear()
        this.yearOptions = []
        for (let i = currentYear; i > currentYear - 10; i--) {
            this.yearOptions.push({value: i, text: i})
        }
    },

    getOptionsRelated() {
      let params = {
        income_groups: true,
        staffs: true,
        // ei_books: true 
      }

      incomeApi.getOptionRelatedIncome(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          
          this.optionsIncomeGroup = res.data.data.income_groups
          let itemGroupEmpty = {"value": null, "text": '-- Tất cả --'}
          this.optionsIncomeGroup.unshift(itemGroupEmpty)

          this.optionsStaff = res.data.data.staffs
          let itemStaffEmpty = {"value": null, "text": '-- Tất cả --'}
          this.optionsStaff.unshift(itemStaffEmpty)
          
          // this.optionsEIBook = res.data.data.ei_books
          // let itemEIBookEmpty = {"value": null, "text": '-- Tất cả --'}
          // this.optionsEIBook.unshift(itemEIBookEmpty)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Delete
     */
    deleted (income) {
      if(income && income.id && income.amount) {
        if(confirm('Xóa ' + income.amount + ". Bạn có chắc không?")) {
          incomeApi.deleteIncome(income.id).then(res => {
            // Reload data
            this.prepareToSearch()
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      }
    },
    
    /**
     * Duyệt khoản chi
     */
    approve() {
      if(this.approving) {return}
      this.approving = true
      
      incomeApi.approveIncome(this.currentIncome.id).then(res => {
        if(res != null && res.data != null && res.data.status == 200) {
          this.popToast('success', 'Duyệt khoản thu thành công!')
          this.hideModalApprove()

          // Reload data
          // Reload data
          for(let income of this.items) {
            if(income.id == this.currentIncome.id) {
              income.status = 1
              break
            }
          }
          // this.prepareToSearch()
        }
        
        this.approving = false
      }).catch(err => {
        this.approving = false
        
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },
    
    showModalApprove(income) {
      this.currentIncome = income
      this.showApproveModal = true
    },

    hideModalApprove() {
      this.showApproveModal = false
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/income/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/income/index/')
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
      this.loading = true
      
      let fromDate = this.inputs.from_date
      let toDate = this.inputs.to_date

      // Handle fromDate, toDate
      if(this.time_option == 2) {
        fromDate = this.year_input + '-' + this.month_input + '-01'
        toDate = this.year_input + '-' + this.month_input + '-' + new Date(this.year_input, this.month_input, 0).getDate()
      }
      if(this.time_option == 3) {
        let quarter = commonFunc.getMonthByQuarter(this.quarter_input)
        fromDate = this.year_input + '-' + quarter + '-01'
        toDate = this.year_input + '-' + (quarter + 2) + '-' + new Date(this.year_input, (quarter + 2), 0).getDate()
      }
      if(this.time_option == 4) {
        fromDate = this.year_input + '-01-01'
        toDate = this.year_input + '-12-' + new Date(this.year_input, 12, 0).getDate()
      }
      if(this.time_option == 5) {
        toDate = new Date().toJSON().slice(0,10)
        fromDate = '2000-01-01'
      }
      if(this.time_option == 6) {
        let dateNow = new Date()
        let dayNow = ((dateNow.getDay() + 6) % 7)
        if(this.week_input == 1) {
          toDate = dateNow.toJSON().slice(0,10)
          fromDate = new Date(dateNow.setDate(dateNow.getDate() - dayNow)).toJSON().slice(0,10)
        } else {
          toDate = new Date(dateNow.setDate(dateNow.getDate() - dayNow - 1)).toJSON().slice(0,10)
          fromDate = new Date(dateNow.setDate(dateNow.getDate() - 6)).toJSON().slice(0,10)
        }
      }

      let params = {
        "income_group_id": this.inputs.income_group_id,
        "staff_id": this.inputs.staff_id,
        // "ei_book_id": this.inputs.ei_book_id,
        "from_date": fromDate,
        "to_date": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      incomeApi.searchIncome(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.incomes
          let total_row = res.data.data.total_row
          this.total_row = total_row
          this.sum_amount = res.data.data.sum_amount

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
          if(this.offset + this.pageLimit >= total_row) {
            this.hasNext = false
          }
        } else {
          this.items = []
        }
        
        this.loading = false
      }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)

          this.loading = false
      })
    },

    currencyFormat(num) {
      if(num == null || num == undefined) {
        return ""
      }
      let result = ""
      if(num == 0) {
        return "0"
      }
      num = (num + "").replaceAll(",", "")
      if(num) {
        result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
    
  }
}
</script>
