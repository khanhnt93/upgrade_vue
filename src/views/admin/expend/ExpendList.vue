<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div class="w-full md:col-span-12">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="w-full md:col-span-12">
              <button class="btn btn-outline-success pull-right btn-width-200" @click="gotoAdd">
                Thêm Chi Phí
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="w-full md:col-span-12">
              <h4 class="mt-1 text-center text-header">Danh Sách Chi Phí</h4>
            </div>
          </div>
          <hr>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
              <div class="w-full md:col-span-2">
                <label>Lọc thời gian theo</label>
                <select v-model="time_option" class="form-control">
                  <option v-for="option in timeOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
  
              <div class="w-full md:col-span-2">
                <!--Thời gian theo ngày-->
                <label v-show="time_option == 1">Từ ngày</label>
                <datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
              </div>
  
              <div class="w-full md:col-span-2">
                <!--Thời gian theo ngày-->
                <label v-show="time_option == 1">Đến ngày</label>
                <datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                            placeholder="yyyy-MM-dd"  input-class="datepicker-cus"></datepicker>
                
                <!--Thời gian tuần -->
                <label v-show="time_option == 6">Tuần</label>
                <select v-show="time_option == 6" v-model="week_input" class="form-control">
                  <option v-for="option in weekOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
  
                <!--Thời gian tháng -->
                <label v-show="time_option == 2">Tháng</label>
                <select v-show="time_option == 2" v-model="month_input" class="form-control">
                  <option v-for="option in monthOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
  
                <!--Thời gian quý -->
                <label v-show="time_option == 3">Quý</label>
                <select v-show="time_option == 3" v-model="quarter_input" class="form-control">
                  <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
                
                <!--Thời gian năm -->
                <label v-show="time_option == 4">Năm</label>
                <select v-show="time_option == 4" v-model="year_input" class="form-control">
                  <option v-for="option in yearOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
              
              <div class="w-full md:col-span-3">
                <label>Ví chi tiêu</label>
                <select
                  id="ei_book_id"
                  type="text" 
                  class="form-control"
                  v-model="inputs.ei_book_id">
                  <option v-for="option in optionsEIBook" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div>
              
              <div class="w-full md:col-span-3">
                <label>Nhóm chi phí</label>
                <multiselect
                    v-model="inputs.expend_group_ids"
                    :options="optionsExpendGroup"
                    :multiple="true"
                    placeholder="-- Tất cả --"
                    label="text"
                    track-by="text">
                </multiselect>
              </div>

              <!-- <div class="w-full md:col-span-2">
                <label>Người chi</label>
                <select
                  id="staff_id"
                  type="text" 
                  class="form-control"
                  v-model="inputs.staff_id">
                  <option v-for="option in optionsStaff" :key="option.value" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </div> -->
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div class="w-full md:col-span-12 mt-2">
                  <button class="btn btn-outline-primary pull-right btn-width-120" :disabled="onSearch"
                            @click.prevent="prepareToSearch">
                    Tìm Kiếm
                  </button>
              </div>
            </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="w-full md:col-span-6">
              Tổng tiền chi: <b class="text-header">{{currencyFormat(sum_amount)}}</b>
            </div>
            <div class="w-full md:col-span-6 text-right">
              Số kết quả: {{currencyFormat(total_row)}}
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-4 py-2" v-for="field in fields" :key="field.key">{{ field.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2">{{ item.date_input }}</td>
                  <td class="border border-gray-300 px-4 py-2 text-right">
                    <p class="link-style" @click="showModalDetail(item)">{{ currencyFormat(item.amount) }}</p>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.expend_group_name }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.ei_book_name }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.note }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.created_by }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="flex space-x-2" v-if="item.status == 0">
                      <button class="btn btn-sm btn-success" @click="showModalApprove(item)" title="Duyệt">
                        <i class="fa fa-check-square-o" />
                      </button>
                      <button class="btn btn-sm btn-primary" @click="edit(item.id)" title="Sửa">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="btn btn-sm btn-danger" @click="deleted(item)" title="Xoá">
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

    <!-- Modal chi tiet -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="w-full md:col-span-12">
            <button class="btn btn-outline-secondary pull-left btn-width-120" @click="hideModalDetail">
              Quay lại
            </button>

            <button v-if="this.expend.status == 0" class="btn btn-outline-success pull-right btn-width-120" @click="showModalApprove(null)">
              Duyệt
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 form-row">
          <div class="w-full md:col-span-12">
            <h4 class="mt-2 text-center text-header">Chi Tiết Chi Phí</h4>
          </div>
        </div>
        <hr/>

        <!-- Loading -->
        <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
        
        <div class="grid grid-cols-1 gap-4 form-row" v-show="expend.expend_group_name">
          <div class="w-full mt-2">
            <label>Nhóm chi phí: {{expend.expend_group_name}}</label>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full mt-2">
            <label>Ngày chi: {{expend.date_input}}</label>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 form-row">
          <div class="w-full mt-2">
            <label>Số tiền chi: {{currencyFormat(expend.amount)}}</label>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 form-row" v-show="expend.note">
          <div class="w-full mt-2">
            <label>Ghi chú: {{expend.note}}</label>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 form-row" v-show="expend.staff_name">
          <div class="w-full mt-2">
            <label>Người chi: {{expend.staff_name}}</label>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 form-row" v-show="expend.ei_book_name">
          <div class="w-full mt-2">
            <label>Chi từ ví chi tiêu: {{expend.ei_book_name}}</label>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 form-row" v-show="expend.image_url">
          <div class="w-full mt-2">
            <img :src="expend.image_url" alt="Hình ảnh" width="100%" height="auto">
          </div>
        </div>

      </div>
    </div>
    
    <!-- Modal tạo phiếu -->
    <div v-if="showApproveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="w-full md:col-span-12">
            <h4 class="modal-title text-center text-success">Duyệt khoản chi</h4>
          </div>
        </div>
        <hr>
        
        <p>Số tiền chi: {{currencyFormat(currentExpend.amount)}}đ</p>
        <p>Người chi: {{currentExpend.expend_by}}</p>
        <p>Ngày chi: {{currentExpend.date_input}}</p>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="w-full md:col-span-12">
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
import expendApi from '@/api/expend'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'


export default {
  components: {
    Datepicker,
    Multiselect
  },
  data () {
    return {
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
      optionsExpendGroup: [],
      optionsStaff: [],
      optionsEIBook: [],
      items: [],
      inputs: {
        expend_group_ids: [],
        staff_id: null,
        ei_book_id: null,
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
          key: 'expend_group_name',
          label: 'Nhóm khoản chi'
        },
        {
          key: 'ei_book_name',
          label: 'Ví chi tiêu'
        },
        {
          key: 'note',
          label: 'Ghi chú'
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
      currentExpend: {},
      approving: false,
      expend: {
        "id": null,
        "expend_group_id": null,
        "expend_group_name": null,
        "ei_book_id": null,
        "ei_book_name": null,
        "date_input": "2024-06-10",
        "amount": null,
        "note": null,
        "staff_id": null,
        "staff_name": null,
        "image_url": null,
        "status": 0
      },
      showDetailModal: false,
      showApproveModal: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    
    // Get default from date and to date
    this.prepareDateInput()

    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()

    if (this.$route.query.group_id) {
      this.inputs.expend_group_ids = [{value: this.$route.query.group_id, text: ""}]
      this.handleSelectGroup()
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
      console.log(`Toast: [${variant}] ${content}`)
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

      handleSelectGroup() {
        if(this.inputs.expend_group_ids.length > 0 && this.optionsExpendGroup) {
          const expend_group_id = this.inputs.expend_group_ids[0].value
          for(const option of this.optionsExpendGroup) {
            if (option.value == expend_group_id) {
              this.inputs.expend_group_ids = [option]
              break
            }
          }
        }
      },

    getOptionsRelated() {
        let params = {
          expend_groups: true,
          staffs: true,
          ei_books: true 
        }

      expendApi.getOptionRelatedExpend(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          
          this.optionsExpendGroup = res.data.data.expend_groups
          let itemGroupEmpty = {"value": null, "text": '-- Tất cả --'}
          this.optionsExpendGroup.unshift(itemGroupEmpty)
          this.handleSelectGroup()

          this.optionsStaff = res.data.data.staffs
          let itemStaffEmpty = {"value": null, "text": '-- Tất cả --'}
          this.optionsStaff.unshift(itemStaffEmpty)
          
          this.optionsEIBook = res.data.data.ei_books
          let itemEIBookEmpty = {"value": null, "text": '-- Tất cả --'}
          this.optionsEIBook.unshift(itemEIBookEmpty)
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
    deleted (expend) {
      if(expend && expend.id && expend.amount) {
        if(confirm('Xóa ' + expend.amount + ". Bạn có chắc không?")) {
          expendApi.deleteExpend(expend.id).then(res => {
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
      
      expendApi.approveExpend(this.currentExpend.id).then(res => {
        if(res != null && res.data != null && res.data.status == 200) {
          this.popToast('success', 'Duyệt khoản chi thành công!')
          this.hideModalApprove()
          this.hideModalDetail()

          // Reload data
          for(let expend of this.items) {
            if(expend.id == this.currentExpend.id) {
              expend.status = 1
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
    
    showModalApprove(expend) {
      if(expend) {
        this.currentExpend = expend
      }
      this.showApproveModal = true
    },

    hideModalApprove() {
      this.showApproveModal = false
    },

    /**
     * Get detail
     */
     getExpendDetail(expendId) {
      this.loading = true

      expendApi.getExpendDetailFull(expendId).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.expend = res.data.data
        }

        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    showModalDetail(expend) {
      this.currentExpend = expend
      this.getExpendDetail(expend.id)
      this.showDetailModal = true
    },

    hideModalDetail() {
      this.showDetailModal = false
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/expend/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/expend/index/')
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
      
      let expend_group_ids = []
      if(this.inputs.expend_group_ids && this.inputs.expend_group_ids.length > 0) {
        for(let item of this.inputs.expend_group_ids) {
          if(item.value) {
            expend_group_ids.push(item.value)
          }
        }
      }

      let params = {
        "expend_group_ids": expend_group_ids,
        "staff_id": this.inputs.staff_id,
        "ei_book_id": this.inputs.ei_book_id,
        "from_date": fromDate,
        "to_date": toDate,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      expendApi.searchExpend(params).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.expends
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

<style lang="scss">
  .link-style {
      color: blue; /* Màu chữ giống link */
      text-decoration: underline; /* Gạch chân */
      cursor: pointer; /* Con trỏ chuột dạng tay */
  }

  .link-style:hover {
      color: darkblue; /* Màu khi hover */
      text-decoration: none; /* Bỏ gạch chân khi hover (tuỳ chọn) */
  }

</style>
