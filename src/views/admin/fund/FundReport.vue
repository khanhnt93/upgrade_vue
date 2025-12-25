<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-center text-header">Báo Cáo Quỹ</h2>

          <div class="grid grid-cols-1 gap-4 mt-4">
            <div class="w-full">
              <h1 :class="fund_class" class="text-center">{{ formatCurrency(fund) }}đ</h1>
            </div>
          </div>
          
          <div class="grid grid-cols-1 gap-4 mt-4" v-show="ei_books.length > 1">
            <div class="w-full">
              <h5 class="text-header">Ví Chi Tiêu</h5>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4" v-show="ei_books.length > 1">
            <div class="w-full" v-for="(ei_book) in ei_books" :key="ei_book.name">
              <p> - {{ei_book.name}}: <b>{{ formatCurrency(ei_book.amount) }}đ</b>
                <span class="ml-2"><i class="fa fa-info-circle" title="Xem lịch sử sổ chi tiêu"
                                      @click="showModalEIBookHis(ei_book)"/></span>
              </p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 gap-4 mt-4" v-show="ei_books.length > 1">
            <div class="w-full text-center">
              <button class="btn btn-outline-primary btn-width-300 px-4 py-2"
                        :disabled="onSearch" @click="showModalTransferMoney">
                Chuyển tiền giữa các ví
              </button>
            </div>
          </div>
          
        </div>

      <div class="bg-white rounded-lg shadow p-6 mt-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <h3 class="text-header text-center">Lịch Sử Quỹ</h3>
          </div>
        </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
            <div class="w-full md:col-span-4">
              <label> Từ ngày </label>
              <datepicker v-model="inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-mm-dd" input-class="datepicker-cus" ></datepicker>
            </div>

            <div class="w-full md:col-span-4">
              <label> Đến ngày </label>
              <datepicker v-model="inputs.to_date" format="yyyy-MM-dd" placeholder="yyyy-mm-dd" input-class="datepicker-cus" ></datepicker>
            </div>
            <div class="w-full md:col-span-4">
              <label class="label-width text-white">
                 Xem
              </label>
              <button class="btn btn-outline-primary pull-right btn-width-120 px-4 py-2" :disabled="onSearch" @click="getFundHistory">
                Xem
              </button>
            </div>
          </div>
        
        <!-- Loading -->
          <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
          <div class="w-full md:col-span-4">
            <p>- Tổng thu: <span class="text-success">{{ formatCurrency(total_plus) }}đ</span></p>
          </div>
          <div class="w-full md:col-span-4">
            <p>- Tổng chi: <span class="text-danger">{{ formatCurrency(total_minus) }}đ</span></p>
          </div>
        </div>

          <div class="p-4">
            <div class="grid grid-cols-1 gap-4">
              <div class="w-full">
                <table class="table table-bordered table-striped fixed_header">
                  <thead>
                    <tr>
                      <th class="text-center">STT</th>
                      <th class="text-center">Ngày</th>
                      <th class="text-center">Loại</th>
                      <th class="text-center">Số tiền</th>
                      <th class="text-center">Ví thu chi</th>
                      <th class="text-center">Nội dung</th>
                      <th class="text-center">Số tiền quỹ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item) in items">
                      <td>{{item.stt}}</td>
                      <td>{{item.created_at}}</td>
                      <td>{{item.type_str}}</td>
                      <td class="text-right">{{ formatCurrency(item.amount) }}đ</td>
                      <td>{{item.ei_book_name}}</td>
                      <td>{{item.note}}</td>
                      <td class="text-right">{{ formatCurrency(item.fund_amount) }}đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    
    <!--Modal chuyển tiền giữa các ví-->
    <div v-if="showTransferModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <h4 class="modal-title text-center text-success">Chuyển Tiền Giữa Các Ví</h4>
          </div>
        </div>
        <hr>
        
        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full">
            <label>Từ ví<span class="error-sybol"></span></label>
            <select 
              class="form-control"
              v-model="transfer_money.ei_book_from_id">
              <option v-for="option in optionsEIBook" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full">
            <label>Đến ví<span class="error-sybol"></span></label>
            <select 
              class="form-control"
              v-model="transfer_money.ei_book_to_id">
              <option v-for="option in optionsEIBook" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full">
            <label>Số tiền<span class="error-sybol"></span></label>
            <input
              id="amount"
              type="text"
              autocomplete="new-password"
              class="form-control"
              v-model="transfer_money.amount"
              maxlength="11"
              @keyup="integerOnly($event.target)">
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-4">
          <div class="w-full">
            <button class="btn btn-outline-secondary pull-left btn-width-120 px-4 py-2" @click="hideModalTransferMoney">
              Quay lại
            </button>

            <button class="btn btn-outline-success pull-right btn-width-120 px-4 py-2" @click="transferMoney" :disabled="transfering">
              Xác nhận
            </button>
            
            <span class="loading-more" v-show="transfering"><icon name="loading" width="60" /></span>
          </div>
        </div>
      </div>
    </div>

    <!--Lịch sử ví chi tiêu-->
    <div v-if="showEIBookHisModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <h4 class="modal-title text-center text-success">Lịch sử ví chi tiêu</h4>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full">
            <p> - Sổ [<b>{{current_ei.name}}</b>]: <b class="text-header">{{ formatCurrency(current_ei.amount) }}đ</b></p>
          </div>
        </div>
        <hr>
        <!-- Loading -->
            <span class="loading-more" v-show="onGetEIBookHis"><icon name="loading" width="60" /></span>

        <div class="grid grid-cols-1 gap-4 mt-2">
          <div class="w-full overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="field in eiBookHisFields" :key="field.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in eiBookHisItems" :key="item.stt" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.stt }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.type_str }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatCurrency(item.amount) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.note }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatCurrency(item.ei_book_amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-4">
          <div class="w-full text-center">
            <button class="btn btn-outline-danger btn-width-120 px-4 py-2"
                      @click.prevent="hideModalEIBookHis">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import expendApi from '@/api/expend'
import fundAPI from "@/api/fund"
import commonFunc from "@/common/commonFunc"
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useFormatters } from '@/composables/useFormatters'


export default {
  components: {
    Datepicker
  },
  setup() {
    const { formatCurrency } = useFormatters()
    return {
      formatCurrency
    }
  },
  data() {
    return {
      fund: 0,
      ei_books: 0,
      loading: false,
      inputs: {
          from_date: null,
          to_date: null,
      },
      items: [],
      excel_fields: {
        'Ngày': 'created_at',
        'Loại' : 'type_str',
        'Số tiền' : 'amount',
        'Số tiền quỹ': 'fund',
        'Nội dung': 'note',
        'Ví tiền': 'ei_book_name',
        'Số tiền trong ví': 'ei_book_amount',
      },
      onSearch: false,
      fund_class: "text-success",
      total_plus: 0,
      total_minus: 0,
      transfer_money: {
        ei_book_from_id: null,
        ei_book_to_id: null,
        amount: null
      },
      optionsEIBook: [],
      transfering: false,
      onGetEIBookHis: false,
      showTransferModal: false,
      showEIBookHisModal: false,
      current_ei: {},
      eiBookHisItems: [],
      eiBookHisFields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'type_str',
          label: 'Loại'
        },
        {
          key: 'amount',
          label: 'Số tiền'
        },
        {
          key: 'note',
          label: 'Ghi chú'
        },
        {
          key: 'ei_book_amount',
          label: 'Tồn ví'
        }
      ],
    };
  },
  mounted() {
    // Get default from date and to date
    let dateNow = new Date()
    this.inputs.to_date = dateNow.toJSON().slice(0,10)
    let fromDate = new Date(dateNow.setDate(dateNow.getDate() - 7))
    this.inputs.from_date = fromDate.toJSON().slice(0,10)

    this.getFundInfo()

    this.getFundHistory()
    
    // Get tất cả các list options liên quan trong màn hình
    this.getOptionsRelated()
  },
  methods: {
    popToast(variant, content) {
      console.log(`[${variant}] ${content}`);
    },
    
    getOptionsRelated() {
        let params = {
          ei_books: true 
        }

      expendApi.getOptionRelatedExpend(params).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.optionsEIBook = res.data.data.ei_books
          let itemEIBookEmpty = {"value": null, "text": ''}
          this.optionsEIBook.unshift(itemEIBookEmpty)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get thông tin quỹ
     */
    getFundInfo() {
      fundAPI.getFundInfo().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          let data = res.data.data
            this.fund = data.fund
            this.ei_books = data.ei_books

            // Handle fund class
            if(this.fund >= 0) {
                this.fund_class = "text-success"
            } else {
                this.fund_class = "text-danger"
            }
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      /**
     * Get lịch sử quỹ
     */
    getFundHistory() {
        this.click = true
        if (this.onSearch) { return }

        this.onSearch = true
      fundAPI.getFundHistory(this.inputs).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data

            // Handle data
            this.calcTotal()
        }
        this.onSearch = false
      }).catch(err => {
          this.onSearch = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    calcTotal() {
      if (this.items.length > 0) {
          this.total_plus = 0
          this.total_minus = 0
          for(let i in this.items) {
              if(this.items[i].type == 0) {
                  this.total_plus += this.items[i].amount
              }
              if(this.items[i].type == 1) {
                  this.total_minus += this.items[i].amount
              }
          }
      }
    },

    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },
    
    showModalTransferMoney() {
      this.showTransferModal = true
    },

    hideModalTransferMoney() {
      this.showTransferModal = false
    },
    
    getEIBookNameById(id) {
      for(let item of this.optionsEIBook) {
        if(item.value == id) {
          return item.text
        }
      }
      return ''
    },
    
    transferMoney() {
      if(this.transfering) {return}
      
      // Validate
      if(!this.transfer_money.ei_book_from_id || !this.transfer_money.ei_book_to_id || !this.transfer_money.amount) {
        this.popToast('danger', 'Vui lòng nhập đủ thông tin bắt buộc')
        return
      }
      
      if(this.transfer_money.ei_book_from_id == this.transfer_money.ei_book_to_id) {
        this.popToast('danger', 'Vui lòng chọn 2 ví khác nhau')
        return
      }
      
      this.transfering = true
      let ei_book_from_name = this.getEIBookNameById(this.transfer_money.ei_book_from_id)
      let ei_book_to_name = this.getEIBookNameById(this.transfer_money.ei_book_to_id)
      this.transfer_money.ei_book_from_name = ei_book_from_name
      this.transfer_money.ei_book_to_name = ei_book_to_name
      
      fundAPI.transferMoney(this.transfer_money).then(res => {
        if(res != null && res.data != null && res.data.status == 200) {
          this.popToast('success', 'Chuyển tiền thành công!')
          this.hideModalTransferMoney()

          // Reload data
          this.ei_books = res.data.data
        }
        
        this.transfering = false
      }).catch(err => {
        this.transfering = false
        
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    showModalEIBookHis(ei_book) {
      this.current_ei = ei_book
      this.showEIBookHisModal = true
      this.onGetEIBookHis = true

      fundAPI.getEIBookHistory(ei_book.id).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.eiBookHisItems = res.data.data
        }
        this.onGetEIBookHis = false
      }).catch(err => {
        this.onGetEIBookHis = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    hideModalEIBookHis() {
      this.showEIBookHisModal = false
    },
  }
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 100%;
  }


  table {
   margin: auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content;
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
