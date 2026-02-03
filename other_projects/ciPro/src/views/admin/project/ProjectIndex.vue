<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-between mb-4">
          <button
            class="border border-gray-400 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded w-32"
            @click="back">
            Quay lại
          </button>
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-32"
            @click="save"
            :disabled="saving">
            Lưu
          </button>
        </div>

        <div class="text-center mb-4">
          <h4 class="text-xl font-semibold text-orange-600">{{ prefix_text }}Dự Án Mẫu</h4>
        </div>
        <hr class="mb-4">

        <!-- Loading -->
        <div v-show="loading" class="text-center mb-4">
          <icon name="loading" width="60" />
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Tên dự án<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              type="text"
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              v-model="project.name">
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Hãng sản phẩm</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select
              v-model="project.brand_id"
              class="w-full border rounded px-3 py-2">
              <option v-for="opt in productBrandOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Đơn vị</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select
              v-model="project.unit_id"
              class="w-full border rounded px-3 py-2">
              <option v-for="opt in unitOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label>Danh sách sản phẩm<span class="text-red-500"></span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <div v-for="(product, index) in project.products" :key="product.product_name" class="mb-2">
              <p>
                - <b class="mr-2">{{ product.product_name }}</b>
                <i class="fa fa-trash cursor-pointer text-red-500" @click="deleteProduct(index)"></i>
              </p>
              <p>{{ currencyFormat(product.product_quantity) }} x {{ currencyFormat(product.product_price) }} = {{ currencyFormat(product.product_amount) }}</p>
            </div>

            <div class="mt-3">
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
            </div>

            <div class="mt-2">
              <input
                type="text"
                maxlength="14"
                autocomplete="new-password"
                class="w-full border rounded px-3 py-2"
                v-model="product.product_price"
                placeholder="Giá bán"
                @keyup="integerPointAndCommaOnly($event.target)"
                @change="changePrice()">
            </div>

            <div class="mt-2">
              <input
                type="text"
                maxlength="14"
                autocomplete="new-password"
                class="w-full border rounded px-3 py-2"
                v-model="product.product_quantity"
                placeholder="Số lượng"
                @keyup="integerPointAndCommaOnly($event.target)"
                @change="changeQuantity()">
            </div>

            <div class="mt-2 text-center">
              <button
                class="border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded w-56"
                @click="addProduct"
                :disabled="!productSelect.id">
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import projectApi from '@/api/project'
import productApi from '@/api/product'
import unitApi from '@/api/unit'
import commonFunc from '@/common/commonFunc'
import Multiselect from 'vue-multiselect'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

const prefix_text = ref('')
const productBrandOptions = ref([])
const unitOptions = ref([])
const project = ref({
  name: null,
  brand_id: null,
  unit_id: null,
  products: [],
})
const product = ref({
  id: null,
  product_price: null,
  product_quantity: null,
  product_amount: null
})
const productSelect = ref({})
const productOptions = ref([])
const loadingProductOptions = ref(false)
const saving = ref(false)
const loading = ref(false)

/**
 *  Get customer options
 */
const getProductOptions = () => {
  loadingProductOptions.value = true

  projectApi.getProductOptions().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      // Products
      productOptions.value = res.data.data
      let itemEmpty = {"id": null, "name_full": '-- Chọn sản phẩm --', "price": 0}
      productOptions.value.unshift(itemEmpty)
      productSelect.value = productOptions.value[0]
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
 *  Get product brand options
 */
const getProductBrandOption = () => {
  productApi.getProductBrandOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      productBrandOptions.value = [{value: null, text: ''}]

      var productBrands = res.data.data
      if(productBrands) {
        for (let i in productBrands) {
          productBrandOptions.value.push(productBrands[i])
        }
      }
    }
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
 * Get detail
 */
const getProjectDetail = () => {
  let projectId = route.params.id
  if(projectId){
    loading.value = true

    projectApi.getProjectDetail(projectId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        project.value = res.data.data
      }

      loading.value = false
    }).catch(err => {
      loading.value = false

      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const addProduct = () => {
  if(!productSelect.value.id) {
    popToast('danger', 'Vui lòng chọn sản phẩm')
    return
  }
  if(!product.value.product_price) {
    popToast('danger', 'Vui lòng nhập giá sản phẩm')
    return
  }
  let product_price = (product.value.product_price + '').replaceAll(",", "")
  if(!product.value.product_quantity) {
    popToast('danger', 'Vui lòng nhập số lượng sản phẩm')
    return
  }
  let product_quantity = (product.value.product_quantity + '').replaceAll(",", "")

  let productItem = {
    product_id: productSelect.value.id,
    product_name: productSelect.value.name_full,
    product_price: product_price,
    product_quantity: product_quantity,
    product_amount: Math.round(parseInt(product_price) * parseFloat(product_quantity))
  }
  project.value.products.push(productItem)
  handleListProduct()

  resetProduct()
}

const handleListProduct = () => {
  let length = project.value.products.length
  if (length <= 1) {
      return
  }
  if (length == 2) {
      if(project.value.products[0].product_id == project.value.products[1].product_id) {
          let quantity = parseFloat(project.value.products[0].product_quantity) + parseFloat(project.value.products[1].product_quantity)
          project.value.products[0].product_price = Math.round((
              (parseFloat(project.value.products[0].product_quantity) * parseInt(project.value.products[0].product_price))
              +
              (parseFloat(project.value.products[1].product_quantity) * parseInt(project.value.products[1].product_price))
          ) / quantity)
          project.value.products[0].product_quantity = quantity
          project.value.products[0].product_amount = Math.round(project.value.products[0].product_price * project.value.products[0].product_quantity)

          project.value.products.splice(1, 1)

          return
      }
  }
  for (let i = 0; i < length - 1; i++) {
      if(project.value.products[i].product_id == project.value.products[length-1].product_id) {
        let quantity = parseFloat(project.value.products[i].product_quantity) + parseFloat(project.value.products[length-1].product_quantity)
          project.value.products[i].product_price = Math.round((
              (parseFloat(project.value.products[i].product_quantity) * parseInt(project.value.products[i].product_price))
              +
              (parseFloat(project.value.products[length-1].product_quantity) * parseInt(project.value.products[length-1].product_price))
          ) / quantity)
          project.value.products[i].product_quantity = quantity
          project.value.products[i].product_amount = Math.round(project.value.products[i].product_price * project.value.products[i].product_quantity)


          project.value.products.splice(length-1, 1)

          return
      }
  }
}

const resetProduct = () => {
  productSelect.value = JSON.parse(JSON.stringify(productOptions.value[0]))
  product.value = {
    product_id: null,
    product_name: null,
    product_price: null,
    product_quantity: null,
    product_amount: null
  }
}

/**
 * Back to list
 */
const back = () => {
  router.push('/project')
}

/**
 * Save
 */
const save = () => {
  // Validate
  if(!project.value.name) {
    popToast('danger', "Tên dự án mẫu không được để trống")
    return
  }
  if(project.value.products.length == 0) {
    popToast('danger', "Mỗi dự án phải có ít nhất một sản phẩm")
    return
  }

  saving.value = true

  let projectId = route.params.id
  if(projectId){
    // Edit
    project.value.id = projectId
    projectApi.updateProject(project.value).then(res => {
      saving.value = false
      if(res != null && res.data != null){
        if (res.data.status == 200) {
          // show popup success
          popToast('success', 'Cập nhật dự án mẫu thành công!!! ')
        }
      }
    }).catch(err => {
      saving.value = false

      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    // Add
    projectApi.addProject(project.value).then(res => {

      if(res != null && res.data != null){
        if (res.data.status == 200) {
          router.push("/project")
        }
      }

      saving.value = false
    }).catch(err => {
      saving.value = false

      // Handle error
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

const changePrice = () => {
  let product_price = (product.value.product_price + '').replaceAll(",", "")
  product.value.product_price = currencyFormat(product_price)
}

const changeQuantity = () => {
  let product_quantity = (product.value.product_quantity + '').replaceAll(",", "")
  product.value.product_quantity = currencyFormat(product_quantity)
}

const deleteProduct = (index) => {
  project.value.products.splice(index, 1)
}

/**
 * Only input integer and point
 */
const integerPointAndCommaOnly = (item) => {
  let valueInput = item.value
    valueInput = valueInput.replaceAll(",", "")
  let result = commonFunc.integerPointAndCommaOnly(valueInput)

    result = currencyFormat(result)
  item.value = result
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
        num = (num + "").replaceAll(",", "")
    }

  if(num) {
    result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

onMounted(() => {
  // Check prefix
  if(route.params.id) {
    prefix_text.value = "Cập Nhật "
  } else {
    prefix_text.value = "Thêm Mới "
  }

  // Lấy danh sách sản phẩm
  getProductOptions()

  // Get product brand options
  getProductBrandOption()

  // Get unit options
  getUnitOption()

  // Get product group detail
  getProjectDetail()
})
</script>
