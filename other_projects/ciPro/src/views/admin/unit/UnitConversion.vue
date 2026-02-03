<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-32"
            @click="openModalCreateUnitConvert()">
            Thêm
          </button>
        </div>

        <div class="text-center mb-4">
          <h4 class="text-xl font-semibold text-orange-600">Chuyển Đổi Đơn Vị</h4>
        </div>
        <hr class="mb-4">

        <div class="mb-3">
          Số kết quả: <b>{{ items.length }}</b>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="border border-gray-300 px-4 py-2">STT</th>
                <th class="border border-gray-300 px-4 py-2">Tên SP</th>
                <th class="border border-gray-300 px-4 py-2">Đơn vị gốc</th>
                <th class="border border-gray-300 px-4 py-2">Giá bán gốc</th>
                <th class="border border-gray-300 px-4 py-2">Đơn vị chuyển đổi</th>
                <th class="border border-gray-300 px-4 py-2">Tỷ giá</th>
                <th class="border border-gray-300 px-4 py-2">Giá bán mới</th>
                <th class="border border-gray-300 px-4 py-2 w-24"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">{{ item.stt }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.product_name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.root_unit_name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.root_price }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.target_unit_name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.conversion_value }}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">{{ currencyFormat(item.price) }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="flex gap-2 justify-center">
                    <button
                      @click="openModalCreateUnitConvert(item)"
                      class="text-blue-500 hover:text-blue-700"
                      title="Cập nhật">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item)"
                      class="text-red-500 hover:text-red-700"
                      title="Xóa">
                      <i class="fa fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading -->
        <div class="text-center mt-4">
          <span v-show="loading" class="inline-block"><icon name="loading" width="60" /></span>
          <span class="text-gray-500">--Hết--</span>
        </div>
      </div>
    </div>

    <!-- Modal add/update -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-xl font-semibold text-orange-600 text-center mb-4">{{ modalTitle }} Chuyển Đổi Đơn Vị</h4>
          <hr class="mb-4">

          <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-3 flex items-center">
              <label>Sản phẩm<span class="text-red-500"></span></label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <multiselect
                v-model="productSelect"
                :options="productOptions"
                :loading="loadingProductOptions"
                :select-label="''"
                :deselect-label="''"
                placeholder="--Chọn sản phẩm--"
                label="name_full"
                track-by="name_full">
              </multiselect>
              <div v-if="errorProduct" class="text-red-500 text-sm mt-1">
                Vui lòng chọn sản phẩm
              </div>
              <div v-show="productSelect.id" class="mt-2">
                <p>Đơn vị gốc: {{ productSelect.unit_name }}</p>
                <p>Giá bán: {{ productSelect.price }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-3 flex items-center">
              <label>Đơn vị chuyển đổi<span class="text-red-500"></span></label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <select
                v-model="unitConvert.target_unit_id"
                @change="changeTargetUnit()"
                class="w-full border rounded px-3 py-2">
                <option v-for="opt in unitOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
              </select>
              <div v-if="errorUnit" class="text-red-500 text-sm mt-1">
                Vui lòng chọn đơn vị chuyển đổi
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-3 flex items-center">
              <label>Tỷ giá chuyển đổi<span class="text-red-500"></span></label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <input
                type="text"
                class="w-full border rounded px-3 py-2"
                v-model="unitConvert.conversion_value"
                autocomplete="new-password"
                maxlength="14">
              <div v-if="errorConversionValue" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên
              </div>
              <p v-show="productSelect.unit_name && unitConvert.target_unit_id && unitConvert.conversion_value" class="mt-2">
                1 {{ productSelect.unit_name }} = {{ unitConvert.conversion_value + ' ' + target_unit_name }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="col-span-12 md:col-span-3 flex items-center">
              <label>Giá bán theo đơn vị mới</label>
            </div>
            <div class="col-span-12 md:col-span-9">
              <input
                type="text"
                class="w-full border rounded px-3 py-2"
                v-model="unitConvert.price"
                autocomplete="new-password"
                maxlength="14"
                @change="changePrice">
            </div>
          </div>

          <div class="flex justify-between mt-4">
            <button
              class="border border-gray-400 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded w-32"
              @click="hideModalCreateUnitConvert">
              Bỏ qua
            </button>

            <button
              v-show="!saving"
              class="border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded w-32"
              :disabled="saving"
              @click="addUpdateUnitConvert">
              Xác nhận
            </button>

            <span v-show="saving" class="inline-block"><icon name="loading" width="60" /></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import unitApi from '@/api/unit'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'

const { popToast } = useToast()

const unitConvert = ref({
  product_id: null,
  root_unit_id: null,
  target_unit_id: null,
  conversion_value: null,
  price: null
})

const target_unit_name = ref("")
const loadingProductOptions = ref(false)
const productSelect = ref({})
const productOptions = ref([])
const unitOptions = ref([])
const modalTitle = ref("Thêm Mới")
const showModal = ref(false)
const items = ref([])
const loading = ref(false)
const click = ref(false)
const saving = ref(false)

const errorProduct = computed(() => {
  return click.value && (productSelect.value.id == null || productSelect.value.id.length <= 0)
})

const errorUnit = computed(() => {
  return click.value && (unitConvert.value.target_unit_id == null || unitConvert.value.target_unit_id.length <= 0)
})

const errorConversionValue = computed(() => {
  return click.value && (unitConvert.value.conversion_value == null || unitConvert.value.conversion_value.length <= 0)
})

const checkValidate = () => {
  return !(errorProduct.value || errorUnit.value || errorConversionValue.value)
}

/**
 *  Get product options
 */
const getProductOptions = () => {
  loadingProductOptions.value = true

  unitApi.getListProductOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      // Products
      productOptions.value = res.data.data
      let itemEmpty = {"id": null, "name_full": '-- Chọn sản phẩm --'}
      productOptions.value.unshift(itemEmpty)
    }

    loadingProductOptions.value = false
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    loadingProductOptions.value = false
  })
}

/**
 *  Get unit options
 */
const getUnitOption = () => {
  unitApi.getListUnitOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      unitOptions.value = [{value: null, text: ''}]

      var units = res.data.data
      if(units) {
        for (let i in units) {
          unitOptions.value.push(units[i])
        }
      }
    }
  })
}

/**
 *  Get unit options
 */
const getProductSelectById = (product_id) => {
  if(!product_id) {
    return {"id": null, "name_full": '-- Chọn sản phẩm --'}
  }
  for(let product of productOptions.value) {
    if(product.id == product_id) {
      productSelect.value = product
      return
    }
  }
  return {"id": null, "name_full": '-- Chọn sản phẩm --'}
}

const openModalCreateUnitConvert = (item=null) => {
  if(!item) {
    click.value = false
    resetValueSeting()
  } else {
    unitConvert.value = item
  }

  if(item && item.product_id) {
    getProductSelectById(item.product_id)
  }
  showModal.value = true
}

const hideModalCreateUnitConvert = () => {
  productSelect.value = {"id": null, "name_full": '-- Chọn sản phẩm --'}
  resetValueSeting()
  showModal.value = false
}

/**
 * Get unit target name
 */
const changeTargetUnit = () => {
  if(!unitConvert.value.target_unit_id) {
    target_unit_name.value = ''
    return
  }
  if(unitConvert.value.target_unit_id == productSelect.value.unit_id) {
    unitConvert.value.target_unit_id = null
    popToast('danger', "Vui lòng chọn khác đơn vị gốc!")
    return
  }
  for(let unit of unitOptions.value) {
    if(unit.value == unitConvert.value.target_unit_id) {
      target_unit_name.value = unit.text
      return
    }
  }
  target_unit_name.value = ''
  return
}

const changePrice = () => {
  try {
    let price = parseInt((unitConvert.value.price + "").replaceAll(",", ""))
    unitConvert.value.price = currencyFormat(price)
  } catch (error) {
    unitConvert.value.price = 0
  }
}

/**
 *  Search
 */
const search = () => {
  if (loading.value) { return }
  loading.value = true

  // Search
  unitApi.getUnitConversion().then(res => {
    if(res != null && res.data != null && res.data.data != null){
      items.value = res.data.data
    }else{
      items.value = []
    }
    loading.value = false
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    loading.value = false
  })
}

/**
 * Currency format
 */
const currencyFormat = (num) => {
  let result = ""
  if(num === 0) {
      return "0"
  }
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const deleted = (item) => {
  if(item.id) {
    if (confirm('Xóa chuyển đổi từ đơn vị [' + item.root_unit_name + '] qua đơn vị [' + item.target_unit_name + '] của sản phẩm [' + item.product_name + "]. Bạn có chắc không?")) {
      unitApi.deleteUnitConversion(item.id).then(res => {
        if(res != null && res.data != null){
          search()
          popToast('success', 'Xoá thành công!')
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const resetValueSeting = () => {
  unitConvert.value = {
    product: null,
    root_unit_id: null,
    target_unit_id: null,
    conversion_value: null,
    price: 0
  }
}

const addUpdateUnitConvert = () => {
  click.value = true
  if(saving.value) {
    return
  }

  let checkValidateResult = checkValidate()
  if(!checkValidateResult) {
    return
  }

  saving.value = true
  unitConvert.value.product_id = productSelect.value.id
  unitConvert.value.root_unit_id = productSelect.value.unit_id
  unitConvert.value.price = (unitConvert.value.price + "").replaceAll(",", "")

  let id = unitConvert.value.id
  if(id){
    // Edit
    unitApi.updateUnitConversion(unitConvert.value).then(res => {
      saving.value = false
      if(res != null && res.data != null && res.data.status == 200){
        search()
        popToast('success', 'Cập nhật thành công!')
        hideModalCreateUnitConvert()

        resetValueSeting()
      }
    }).catch(err => {
      saving.value = false

      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    // Add
    unitApi.addUnitConversion(unitConvert.value).then(res => {
      saving.value = false
      if(res != null && res.data != null && res.data.status == 200){
        search()
        popToast('success', 'Thêm mới thành công!')
        hideModalCreateUnitConvert()

        resetValueSeting()
      }
    }).catch(err => {
      saving.value = false

      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

onMounted(() => {
  // Get group option
  getProductOptions()
  getUnitOption()

  // Load list when load page
  search()
})
</script>
