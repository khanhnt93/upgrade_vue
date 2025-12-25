<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow p-6">

          <div class="grid grid-cols-1 gap-4">
            <div class="w-full">
                <button class="btn btn-primary pull-right px-4 py-2 default-btn-bg" @click="gotoAdd()">
                  Thêm
                </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4">
            <div class="w-full">
              <h4 class="mt-2 text-center">Admin Tổ Chức</h4>
            </div>
          </div>
          <hr>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="w-full">
                <label>Tên</label>
                <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="inputs.name"
                  maxlength="100">
              </div>
            <div class="w-full">
                <label>Số Điện Thoại</label>
                <input 
                  id="phone"
                  type="text" 
                  class="form-control"
                  v-model="inputs.phone_number"
                  @keyup="integerOnly($event.target)"
                  maxlength="20">
              </div>
              <div class="w-full">
                <label>Tên Tổ Chức</label>
                <input 
                  id="nameStore"
                  type="text" 
                  class="form-control"
                  maxlength="100"
                  v-model="inputs.store_name">
              </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-2 mb-2">
            <div class="w-full">
              <button class="btn btn-primary mb-3 pull-right px-4 py-2 default-btn-bg" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
          </div>

          <div class="overflow-x-auto mt-4">
            <table class="min-w-full divide-y divide-gray-200 border">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="field in fields" :key="field.key" 
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.stt }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.phone_number }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.store_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.role_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.created_at }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm border">
                    <div class="flex gap-2">
                      <button 
                        @click="edit(item.id)" 
                        class="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit">
                        <i class="fa fa-edit" />
                      </button>
                      <button 
                        @click="deleted(item.id, item.name)" 
                        class="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete">
                        <i class="fa fa-trash" />
                      </button>
                      <button 
                        @click="showModalConfirmResetPass(item)" 
                        class="px-3 py-2 text-green-600 hover:bg-green-50 rounded"
                        title="Reset password">
                        <i class="fa fa-refresh" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">Hết</span>
        </div>
      </div>
    </div>
    
    <!-- Modal xác nhận reset pass -->
    <div v-if="showResetPassModal" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         @click.self="hideModalConfirmResetPass()">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <h5 class="text-center text-xl font-semibold">Reset password</h5>
            <hr class="my-4">
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="w-full">
            <p>Nhân viên: <b>{{currentStaff.name}}</b></p>
            <p>Số điện thoại: <b>{{currentStaff.phone_number}}</b></p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-4">
          <div class="w-full text-center" v-show="!resetting">
            <button class="btn btn-width-120 btn-outline-secondary" @click="hideModalConfirmResetPass()">
              Đóng
            </button>
            <button class="ml-2 btn btn-width-120 btn-outline-success" @click="resetPass()">
              Xác nhận
            </button>
          </div>
          <div class="w-full" v-show="resetting">
            <span class="loading-more" v-show="resetting"><icon name="loading" width="60" /></span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import superAdminAPI from '@/api/superAdmin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'phone_number',
          label: 'Số Điện Thoại'
        },
        {
          key: 'store_name',
          label: 'Tổ chức'
        },
        {
          key: 'role_name',
          label: 'Quyền'
        },
        {
          key: 'created_at',
          label: 'Ngày Tạo'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      options: [
        {value: '', text: 'Tất cả'},
        {value: '1', text: 'Staff'},
        {value: '2', text: 'Admin'},
      ],
      inputs: {
        name: '',
        phone_number: '',
        store_name: ''
      },
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      currentStaff: {},
      resetting: false,
      showResetPassModal: false,
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    this.search()
  },
  methods: {

    /*
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

    /*
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
          this.offset = this.offset + 10
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
     * Delete
     */
    deleted (id, name) {
      if(confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
          superAdminAPI.deleteAdminStore(id).then(res => {
            if (res != null && res.data != null && res.data.status == 200) {
              this.prepareToSearch()
            }
            // // Remove item in list
            // let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
            // this.items.splice(indexTemp, 1)
            // this.listIdDeleted.push(rowIndex - 1)
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/admin-store/index/' + id)
    },

    /*
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/admin-store/index/')
    },

    /**
     * Search
     */
    search () {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true

      let req = {
        "name": this.inputs.name,
        "phone_number": this.inputs.phone_number,
        "store_name": this.inputs.store_name,
        "limit": this.pageLimit,
        "offset": this.offset
      }
      
      superAdminAPI.searchAdminStore(req).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.staffs

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
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.integerOnly(valueInput)
      item.value = result
    },
    
    showModalConfirmResetPass(staff) {
      this.currentStaff = staff
      this.showResetPassModal = true
    },

    hideModalConfirmResetPass() {
      this.showResetPassModal = false
    },

    /**
     * Go to edit
     * @param id
     */
     resetPass() {
      if (this.resetting) { return }

      this.resetting = true

      let params = {
        "id": this.currentStaff.id,
        "phone": this.currentStaff.phone_number
      }

      superAdminAPI.resetPass(params).then(res => {
        if (res != null && res.data != null && res.data.status == 200) {
          this.hideModalConfirmResetPass()

          let message = "Reset Mật Khẩu Thành Công\n\nMật khẩu mới: " + this.currentStaff.phone_number
          alert(message)
        }

        this.resetting = false
        }).catch(err => {
          this.resetting = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
    },
    
  }
}
</script>
