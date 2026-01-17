<template>
  <div class="container-fluid px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header with Add Button -->
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-2xl font-semibold text-center flex-1">Store</h4>
          <button
            @click="gotoAdd"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm
          </button>
        </div>

        <hr class="my-4 border-gray-200">

        <!-- Search Form -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
            <input
              v-model="inputs.name"
              type="text"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
            <select
              v-model="inputs.brand_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="option in optionsBrand" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tỉnh/ Thành Phố</label>
            <select
              v-model="inputs.city_id"
              @change="changeCity"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="option in optionsCity" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quận</label>
            <select
              v-model="inputs.district_id"
              :disabled="inputs.city_id === ''"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option v-for="option in optionsDistrict" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <!-- Search Button -->
        <div class="flex justify-end mb-4">
          <button
            @click="prepareToSearch"
            :disabled="onSearch"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Tìm Kiếm
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">STT</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Tên</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Thương hiệu</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Tỉnh/ Thành Phố</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Quận</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Địa Chỉ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Ngày Tạo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r">Ngày Hết Hạn</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.stt }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.brand_name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.city_name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.district_name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.address }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.created_at }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm border-r">{{ item.expired_at }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <button
                      @click="edit(item.id)"
                      title="Edit"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <i class="fa fa-edit"></i>
                    </button>
                    <button
                      @click="deleted(item.id, item.name, item.stt)"
                      title="Delete"
                      class="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>
        <div v-if="hasNext === false" class="text-center py-4 text-gray-500">Hết</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import superAdminAPI from '@/api/superAdmin'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'
import { Constant } from '@/common/constant'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { popToast } = useToast()

// Reactive state
const items = ref([])
const inputs = reactive({
  name: '',
  brand_id: null,
  city_id: '',
  district_id: ''
})

const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const listIdDeleted = ref([])
const optionsCity = ref([])
const optionsDistrict = ref([])
const optionsBrand = ref([])

// Methods
const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  const body = document.body
  const html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const getOptionBrand = () => {
  superAdminAPI.getBrandOption().then(res => {
    optionsBrand.value = [{ value: null, text: '' }]
    if (res && res.data && res.data.data) {
      const brands = res.data.data
      for (const index in brands) {
        const brand = {
          value: brands[index].value,
          text: brands[index].text
        }
        optionsBrand.value.push(brand)
      }
    }
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  search()
}

const deleted = (id, name, rowIndex) => {
  if (confirm(`Xóa ${name}. Bạn có chắc không?`)) {
    superAdminAPI.deleteStore(id).then(() => {
      const indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
      items.value.splice(indexTemp, 1)
      listIdDeleted.value.push(rowIndex - 1)
    }).catch(err => {
      const errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const edit = (id) => {
  router.push('/store/index/' + id)
}

const gotoAdd = () => {
  router.push('/store/index/')
}

const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  inputs.city_id = inputs.city_id.toString()
  inputs.district_id = inputs.district_id.toString()
  inputs.limit = pageLimit.value
  inputs.offset = offset.value

  superAdminAPI.getStoreList(inputs).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const it = res.data.data.stores

      if (loadByScroll.value) {
        const temp = items.value
        items.value = temp.concat(it)
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if (offset.value + pageLimit.value >= res.data.data.total_row) {
        hasNext.value = false
      }
    } else {
      items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const getOptionCity = () => {
  MasterApi.getCityOptions().then(res => {
    optionsCity.value = MasterMapper.mapCityModelToDto(res.data.data)
  }).catch(err => {
    const errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const changeCity = () => {
  const cityId = inputs.city_id
  if (cityId !== '' && cityId !== undefined) {
    MasterApi.getDistrictOptions(cityId).then(res => {
      optionsDistrict.value = MasterMapper.mapCityModelToDto(res.data.data)
    })
  } else {
    inputs.district_id = ''
  }
}

// Lifecycle hooks
onMounted(() => {
  getOptionBrand()
  window.addEventListener('scroll', onScroll)
  getOptionCity()
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.loading-more {
  display: block;
  text-align: center;
  padding: 1rem;
}
</style>
