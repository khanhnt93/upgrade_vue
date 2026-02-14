<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
                <button class="btn btn-primary pull-right px-4 default-btn-bg" @click="gotoAdd()">
                  Thêm
                </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div md='12'>
              <h4 class="mt-2 text-center">Admin Store</h4>
            </div>
          </div>
          <hr>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-3 px-2">
                <label>Tên</label>
                <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="inputs.name"
                  maxlength="100">
              </div>
            <div class="w-full md:w-3 px-2">
                <label>Số Điện Thoại</label>
                <input
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="inputs.phone_number"
                  @keyup="integerOnly($event.target)"
                  maxlength="20">
              </div>
            <div class="w-full md:w-2 px-2">
                <label>Quyền</label>
                <select
                  :options="options"
                  id="phone"
                  type="text"
                  class="form-control"
                  v-model="inputs.role_id"></select>
              </div>
              <div class="w-full md:w-2 px-2">
                <label>Tên Cửa Hàng</label>
                <input
                  id="nameStore"
                  type="text"
                  class="form-control"
                  maxlength="100"
                  v-model="inputs.store_name">
              </div>

              <div class="w-full md:w-2 px-2">
                <label>Thương hiệu</label>
                <select
                  :options="optionsBrand"
                  id="brand_id"
                  type="text"
                  class="form-control"
                  v-model="inputs.brand_id"></select>
              </div>
          </div>

          <div class="mt-2 mb-2">
            <div class="w-full md:w-12 px-2">
              <button class="btn btn-primary mb-3 pull-right px-4 default-btn-bg" :disabled="onSearch" @click.prevent="prepareToSearch">
              Tìm Kiếm
            </button>
            </div>
            </div>

          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th v-for="field in fields" :key="field.key" :class="field.class">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.stt }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.phone_number }}</td>
                <td>{{ item.role_name }}</td>
                <td>{{ item.store_name }}</td>
                <td>{{ item.brand_name }}</td>
                <td>{{ item.created_at }}</td>
                <td class="actions-cell">
                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-sm btn-link" title="Edit" @click="edit(item.id)">
                      <i class="fa fa-edit" />
                    </button>
                    <button type="button" class="btn btn-sm btn-link" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                      <i class="fa fa-trash" />
                    </button>
                    <button type="button" class="btn btn-sm btn-link" title="Reset password" @click="showModalConfirmResetPass(item)">
                      <i class="fa fa-refresh" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more" v-if="hasNext === false">Hết</span>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận reset pass -->
    <div v-if="showResetPassModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div class="flex flex-wrap -mx-2">
          <div class="w-full px-2">
            <h5 class="text-center font-semibold text-lg mb-4">Reset password</h5>
            <hr>
          </div>
        </div>
        <div class="flex flex-wrap -mx-2">
          <div class="w-full px-2">
            <p>Nhân viên: <b>{{currentStaff.name}}</b></p>
            <p>Số điện thoại: <b>{{currentStaff.phone_number}}</b></p>
          </div>
        </div>

        <div class="flex flex-wrap -mx-2">
          <div class="text-center mt-3" v-show="!resetting">
            <button class="btn btn-width-120 btn-outline-secondary" @click="hideModalConfirmResetPass()">
              Đóng
            </button>
            <button class="ml-2 btn btn-width-120 btn-outline-success" @click="resetPass()">
              Xác nhận
            </button>
          </div>
          <div v-show="resetting">
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
import { useToast } from 'vue-toastification'


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
          key: 'brand_name',
          label: 'Thương hiệu'
        },
        {
          key: 'store_name',
          label: 'Cửa Hàng'
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
      optionsBrand: [],
      inputs: {
        name: '',
        phone_number: '',
        role_id: '',
        store_name: '',
        brand_id: null
      },
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      listIdDeleted: [],
      currentStaff: {},
      resetting: false,
      showResetPassModal: false
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    // Get brand options
    this.getOptionBrand()

    this.toast = useToast()

    window.addEventListener('scroll', this.onScroll)
    this.search()
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
     * Event scroll
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
     * Get brand options
     */
    getOptionBrand() {
      superAdminAPI.getBrandOption().then(res => {
        this.optionsBrand = [{"value": null, "text": ""}]
        if(res && res.data && res.data.data) {
          let brands = res.data.data
          for (var index in brands) {
            let brand = {
              value: brands[index].value,
              text: brands[index].text
            }
            this.optionsBrand.push(brand)
          }
        }

      }).catch(err => {
        // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
      })
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
    deleted (id, name, rowIndex) {
      if (confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
        superAdminAPI.deleteAdminStore(id).then(res => {
          // Remove item in list
          let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
          this.items.splice(indexTemp, 1)
          this.listIdDeleted.push(rowIndex - 1)
          this.popToast('success', 'Xóa thành công')
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
      this.router.push('/admin-store/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.router.push('/admin-store/index/')
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
        "role_id": this.inputs.role_id,
        "store_name": this.inputs.store_name,
        "brand_id": this.inputs.brand_id,
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
      let result = commonFunc.intergerOnly(valueInput)
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

          let message = "Mật khẩu mới: " + this.currentStaff.phone_number
          this.popToast('success', 'Reset Mật Khẩu Thành Công - ' + message)
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
