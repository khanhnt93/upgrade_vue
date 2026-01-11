<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="flex justify-end">
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              @click="gotoAdd()">
              Thêm
            </button>
          </div>

          <div class="col-span-1">
            <h4 class="mt-2 text-center">Danh Sách Khách Sạn</h4>
          </div>
        </div>
        <hr />

        <!-- Search filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
          <div>
            <label>Tên</label>
            <input
              id="name"
              type="text"
              class="form-control"
              v-model="inputs.name"
              maxlength="100" />
          </div>

          <div>
            <label>Thương hiệu</label>
            <select
              id="brand_id"
              class="form-control"
              v-model="inputs.brand_id">
              <option v-for="brand in optionsBrand" :key="brand.value" :value="brand.value">
                {{ brand.text }}
              </option>
            </select>
          </div>

          <div>
            <label>Tỉnh / Thành Phố</label>
            <select
              id="city_id"
              class="form-control"
              v-model="inputs.city_id"
              @change="changeCity()">
              <option v-for="city in optionsCity" :key="city.value" :value="city.value">
                {{ city.text }}
              </option>
            </select>
          </div>

          <div>
            <label>Quận / Huyện</label>
            <select
              id="district_id"
              class="form-control"
              v-model="inputs.district_id">
              <option v-for="district in optionsDistrict" :key="district.value" :value="district.value">
                {{ district.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-end mt-4 mb-4">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            :disabled="onSearch"
            @click.prevent="prepareToSearch">
            Tìm Kiếm
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 border">STT</th>
                <th class="px-4 py-2 border">Tên</th>
                <th class="px-4 py-2 border">Thương hiệu</th>
                <th class="px-4 py-2 border">Tỉnh / Thành Phố</th>
                <th class="px-4 py-2 border">Quận / Huyện</th>
                <th class="px-4 py-2 border">Địa Chỉ</th>
                <th class="px-4 py-2 border">Số Điện Thoại</th>
                <th class="px-4 py-2 border">Email</th>
                <th class="px-4 py-2 border">Ảnh</th>
                <th class="px-4 py-2 border">Loại</th>
                <th class="px-4 py-2 border">Mô tả</th>
                <th class="px-4 py-2 border">Ngày Tạo</th>
                <th class="px-4 py-2 border">Ngày Hết Hạn</th>
                <th class="px-4 py-2 border">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-2 border text-center">{{ item.stt }}</td>
                <td class="px-4 py-2 border">{{ item.name }}</td>
                <td class="px-4 py-2 border">{{ item.brand_name }}</td>
                <td class="px-4 py-2 border">{{ item.city_name }}</td>
                <td class="px-4 py-2 border">{{ item.district_name }}</td>
                <td class="px-4 py-2 border">{{ item.address }}</td>
                <td class="px-4 py-2 border text-center">{{ item.phone_number }}</td>
                <td class="px-4 py-2 border">{{ item.email }}</td>
                <td class="px-4 py-2 border text-center">
                  <img v-if="item.image" :src="item.image" alt="Hotel Image" class="w-16 h-16 object-cover mx-auto" />
                </td>
                <td class="px-4 py-2 border">{{ item.hotel_type_name }}</td>
                <td class="px-4 py-2 border">{{ item.description }}</td>
                <td class="px-4 py-2 border text-center">{{ item.created_at }}</td>
                <td class="px-4 py-2 border text-center">{{ item.expired_at }}</td>
                <td class="px-4 py-2 border text-center">
                  <div class="flex justify-center space-x-2">
                    <button
                      class="text-blue-600 hover:text-blue-800"
                      @click="edit(item.id)"
                      title="Edit">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800"
                      @click="deleted(item.id, item.name, item.stt)"
                      title="Delete">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-show="loading" class="text-center mt-4">
          <i class="fa fa-spinner fa-spin fa-3x"></i>
        </div>
        <div v-if="hasNext === false" class="text-center mt-4">Hết</div>
      </div>
    </div>
  </div>
</template>

<script>
import superAdminAPI from '@/api/superAdmin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const toast = useToast()
    const router = useRouter()

    return {
      toast,
      router
    }
  },
  data() {
    return {
      items: [],
      optionsBrand: [],
      optionsCity: [],
      optionsDistrict: [],
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
      listIdDeleted: []
    }
  },
  mounted() {
    this.getOptionBrand()
    this.getOptionCity()
    window.addEventListener('scroll', this.onScroll)
    this.search()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll(event) {
      if (this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if (this.hasNext) {
          this.offset = this.offset + 10
          this.loadByScroll = true
          this.search()
        }
      }
    },

    getOptionBrand() {
      superAdminAPI.getBrandOption().then(res => {
        this.optionsBrand = [{ value: null, text: "" }]
        if (res && res.data && res.data.data) {
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
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true
      this.search()
    },

    deleted(id, name, rowIndex) {
      if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        superAdminAPI.deleteHotel(id).then(res => {
          let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
          this.items.splice(indexTemp, 1)
          this.listIdDeleted.push(rowIndex - 1)
        }).catch(err => {
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    edit(id) {
      this.router.push('/hotel/index/' + id)
    },

    gotoAdd() {
      this.router.push('/hotel/index/')
    },

    search() {
      if (this.loading) {
        return
      }

      this.onSearch = true
      this.loading = true

      this.inputs.city_id = this.inputs.city_id.toString()
      this.inputs.district_id = this.inputs.district_id.toString()

      superAdminAPI.getHotelList(this.inputs, this.offset).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.hotels

          if (this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          if (this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }
        } else {
          this.items = []
        }
        this.onSearch = false
        this.loading = false
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
        this.onSearch = false
        this.loading = false
      })
    },

    getOptionCity() {
      MasterApi.getCityOptions().then(res => {
        this.optionsCity = MasterMapper.mapCityModelToDto(res.data.data)
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    changeCity() {
      let cityId = this.inputs.city_id
      if (cityId != "" && cityId != undefined) {
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
