<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
                <button class="btn float-right px-4 default-btn-bg" @click="gotoAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center">Store</h4>
            </div>
          </div>
          <hr>

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3">
                <label>Tên</label>
                <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model="inputs.name"
                  maxlength="100">
              </div>
              <div class="col-span-3">
                <label>Thương hiệu</label>
                <select class="form-control form-control"
                  :options="optionsBrand"
                  id="brand_id"
                  type="text"
                  
                  v-model="inputs.brand_id"></select>
              </div>
              <div class="col-span-3">
                  <label>Tỉnh/ Thành Phố</label>
                  <select class="form-control form-control"
                    :options="optionsCity"
                    id="city_id"
                    type="text"
                    
                    v-model="inputs.city_id"
                    v-on:change="changeCity($event.target)"></select>
                </div>
            <div class="col-span-3">
                <label>Quận</label>
                <select class="form-control form-control" 
                  v-bind="{ disabled: inputs.city_id=='' }"
                  :options="optionsDistrict"
                  id="district"
                  type="text" 
                  
                  v-model="inputs.district_id"></select>
              </div>
          </div>
           <div class="grid grid-cols-12 gap-4 mt-2 mb-2">
            <div class="col-span-12">
              <button class="btn mb-3 float-right px-4 default-btn-bg" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
            </div>

          <table class="table table-bordered table-hover table-responsive-stack">
            <thead>
              <tr>
                <th v-for="field in fields" :key="field.key" :class="field.class">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td v-for="field in fields" :key="field.key" :data-label="field.label">
                  <div v-if="field.key === 'actions'">
                    <div class="flex gap-2">
                       <button class="list-group-item" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="list-group-item" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                        <i class="fa fa-trash" />
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    {{ item[field.key] }}
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
  </div>
</template>


<script>
import superAdminAPI from '@/api/superAdmin'
import Mapper from '@/mapper/store'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'


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
          key: 'brand_name',
          label: 'Thương hiệu'
        },
        {
          key: 'city_name',
          label: 'Tỉnh/ Thành Phố'
        },
        {
          key: 'district_name',
          label: 'Quận'
        },
        {
          key: 'address',
          label: 'Địa Chỉ'
        },
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
        name: '',
        brand_id: null,
        city_id: '',
        district_id: ''
      },
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      listIdDeleted: [],
      optionsCity: [],
      optionsDistrict: [],
      optionsBrand: [],
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

    window.addEventListener('scroll', this.onScroll)
    this.getOptionCity()
    this.search()
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
      if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        const res = true
        if(res){
          superAdminAPI.deleteStore(id).then(res => {
            // Remove item in list
            let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
            this.items.splice(indexTemp, 1)
            this.listIdDeleted.push(rowIndex - 1)
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
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
      
      this.inputs.city_id = this.inputs.city_id.toString()
      this.inputs.district_id = this.inputs.district_id.toString()
      superAdminAPI.getStoreList(this.inputs, this.offset).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.stores

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
     * Get city options
     */
    getOptionCity() {
      MasterApi.getCityOptions().then(res => {
        this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get district by city
     */
    changeCity() {
      let cityId = this.inputs.city_id
      if(cityId != "" && cityId != undefined) {
        MasterApi.getDistrictOptions(cityId).then(res => {
          this.optionsDistrict = MasterMapper.mapCityModelToDto(res.data.data)
        })
      } else {
        this.inputs.district_id = ""
      }
    }
  }
}
</script>
