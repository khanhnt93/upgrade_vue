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
              <h4 class="mt-2 text-center">Danh Sách Tổ Chức</h4>
            </div>
          </div>
          <hr>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                <label class="text-white">Tìm kiếm</label>
                <button class="btn btn-primary mb-3 pull-right px-4 py-2 default-btn-bg" :disabled="onSearch"
                          @click.prevent="prepareToSearch">
                  Tìm Kiếm
                </button>
              </div>
          </div>
          
          <div class="grid grid-cols-1 gap-4 mt-4">
            <div class="w-full">
              Số kết quả: {{total_row}}
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.created_at }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border">{{ item.expired_at }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm border">
                    <div class="flex gap-2">
                      <button 
                        @click="edit(item.id)" 
                        class="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit">
                        <i class="fa fa-edit" />
                      </button>
                      <button 
                        @click="deleted(item.id, item.name, item.stt)" 
                        class="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete">
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
          <span class="loading-more" v-if="hasNext === false">Hết</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import superAdminAPI from '@/api/superAdmin'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'
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
        // {
        //   key: 'city_name',
        //   label: 'Tỉnh/ Thành Phố'
        // },
        // {
        //   key: 'district_name',
        //   label: 'Quận'
        // },
        // {
        //   key: 'address',
        //   label: 'Địa Chỉ'
        // },
        {
          key: 'created_at',
          label: 'Ngày Tạo'
        },
        {
          key: 'expired_at',
          label: 'Ngày Hết Hạn'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      inputs: {
        name: ''
      },
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      total_row: 0
      // listIdDeleted: [],
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    this.toast = useToast()
    window.addEventListener('scroll', this.onScroll)
    // this.getOptionCity()
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
      if(confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        superAdminAPI.deleteStore(id).then(res => {
          this.search()

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
     *  Go to edit
     */
    edit (id) {
      this.$router.push('/store/index/' + id)
    },

    /**
     *  Go to add
     */
    gotoAdd () {
      this.$router.push('/store/index/')
    },

    /**
     * Search
     */
    search () {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true
      
      // this.inputs.city_id = this.inputs.city_id.toString()
      // this.inputs.district_id = this.inputs.district_id.toString()
        this.inputs.limit = this.pageLimit
        this.inputs.offset = this.offset
      superAdminAPI.getStoreList(this.inputs).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let data = res.data.data
          let it = data.stores
          this.total_row = data.total_row 

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

    // /**
    //  * Get city options
    //  */
    // getOptionCity() {
    //   MasterApi.getCityOptions().then(res => {
    //     this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
    //   }).catch(err => {
    //     // Handle error
    //     let errorMess = commonFunc.handleStaffError(err)
    //     this.popToast('danger', errorMess)
    //   })
    // },
    //
    // /**
    //  * Get district by city
    //  */
    // changeCity() {
    //   let cityId = this.inputs.city_id
    //   if(cityId != "" && cityId != undefined) {
    //     MasterApi.getDistrictOptions(cityId).then(res => {
    //       this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
    //     })
    //   } else {
    //     this.inputs.district_id = ""
    //   }
    // }
  }
}
</script>
