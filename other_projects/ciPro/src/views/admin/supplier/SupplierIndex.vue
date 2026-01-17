<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-between mb-4">
          <button
            class="border border-gray-500 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded w-32"
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

        <div class="mb-4">
          <h4 class="text-center text-xl font-semibold text-gray-700">{{prefix_title}} Nhà Cung Cấp</h4>
        </div>
        <hr class="mb-6">

        <!-- Loading -->
        <div v-show="loading" class="text-center py-4">
          <icon name="loading" width="60" />
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Name -->
          <div class="grid grid-cols-12 gap-4 items-start">
            <label class="col-span-3 pt-2">
              Tên<span class="text-red-500">*</span>
            </label>
            <div class="col-span-9">
              <input
                id="name"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control border rounded px-3 py-2 w-full"
                :class="{'border-red-500': errorName}"
                v-model="supplier.name">
              <div v-if="errorName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên
              </div>
            </div>
          </div>

          <!-- Phone Number -->
          <div class="grid grid-cols-12 gap-4 items-start">
            <label class="col-span-3 pt-2">Số điện thoại</label>
            <div class="col-span-9">
              <input
                id="phone_number"
                type="text"
                maxlength="30"
                autocomplete="new-password"
                class="form-control border rounded px-3 py-2 w-full"
                v-model="supplier.phone_number">
            </div>
          </div>

          <!-- Address -->
          <div class="grid grid-cols-12 gap-4 items-start">
            <label class="col-span-3 pt-2">Địa chỉ</label>
            <div class="col-span-9">
              <input
                id="address"
                type="text"
                maxlength="255"
                autocomplete="new-password"
                class="form-control border rounded px-3 py-2 w-full"
                v-model="supplier.address">
            </div>
          </div>

          <!-- Tax Code -->
          <div class="grid grid-cols-12 gap-4 items-start">
            <label class="col-span-3 pt-2">Mã số thuế</label>
            <div class="col-span-9">
              <input
                id="tax_code"
                type="text"
                maxlength="20"
                autocomplete="new-password"
                class="form-control border rounded px-3 py-2 w-full"
                v-model="supplier.tax_code">
            </div>
          </div>

          <!-- Contact Person Name -->
          <div class="grid grid-cols-12 gap-4 items-start">
            <label class="col-span-3 pt-2">Tên người liên hệ</label>
            <div class="col-span-9">
              <input
                id="contact_person"
                type="text"
                maxlength="100"
                autocomplete="new-password"
                class="form-control border rounded px-3 py-2 w-full"
                v-model="supplier.contact_person_name">
            </div>
          </div>

          <!-- Contact Person Phone -->
          <div class="grid grid-cols-12 gap-4 items-start">
            <label class="col-span-3 pt-2">Sđt người liên hệ</label>
            <div class="col-span-9">
              <input
                id="contact_person_phone"
                type="text"
                maxlength="14"
                autocomplete="new-password"
                class="form-control border rounded px-3 py-2 w-full"
                v-model="supplier.contact_person_phone"
                @keyup="integerOnly($event.target)">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import supplierAPI from '@/api/supplier'
import commonFunc from '@/common/commonFunc'

const route = useRoute()
const router = useRouter()
const { popToast } = useToast()

const prefix_title = ref("Thêm Mới")
const supplier = ref({
  "name": null,
  "phone_number": null,
  "address": null,
  "tax_code": null,
  "contact_person_name": null,
  "contact_person_phone": null,
})
const click = ref(false)
const saving = ref(false)
const loading = ref(false)

const errorName = computed(() => {
  return checkInfo(supplier.value.name)
})

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorName.value)
}

/**
 * Get detail
 */
const getSupplierDetail = () => {
  let supplierId = route.params.id
  if(supplierId){
    loading.value = true

    supplierAPI.getSupplierDetail(supplierId).then(res => {
      if(res != null && res.data != null && res.data.data != null) {
        supplier.value = res.data.data
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

/**
 * Back to list
 */
const back = () => {
  router.push('/supplier')
}

/**
 * Save
 */
const save = () => {
  click.value = true
  saving.value = true
  let result = checkValidate()
  if(result) {
    let supplierId = route.params.id
    if(supplierId){
      // Edit
      let supplierData = supplier.value
      supplierData.id = supplierId
      supplierAPI.editSupplier(supplierData).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            // show popup success
            popToast('success', 'Cập nhật đơn vị thành công!!! ')
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
      supplierAPI.addSupplier(supplier.value).then(res => {
        saving.value = false
        if(res != null && res.data != null){
          if (res.data.status == 200) {
            router.push("/supplier")
          }
        }
      }).catch(err => {
        saving.value = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  } else {
    saving.value = false
  }
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

onMounted(() => {
  // Check prefix
  if(route.params.id) {
    prefix_title.value = "Cập Nhật"
  } else {
    prefix_title.value = "Thêm Mới"
  }

  getSupplierDetail()
})
</script>

<style scoped>
.form-control {
  display: block;
  width: 100%;
}
.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
