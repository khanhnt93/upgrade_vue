<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="bg-white shadow-sm rounded p-4">
          <div class="row mb-3">
            <div class="col-6">
              <button
                @click="back"
                class="btn btn-secondary px-4">
                Quay lại
              </button>
            </div>
            <div class="col-6 text-right">
              <button
                @click="save"
                :disabled="saving"
                class="btn btn-primary px-4">
                Lưu
              </button>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <h4 class="mt-2 text-center">Thương Hiệu</h4>
            </div>
          </div>
          <hr/>

          <!-- Loading -->
          <div v-show="loading" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>

          <div class="row form-row mb-3">
            <div class="col-md-3 mt-2">
              <label>Tên <span class="text-red-500">*</span></label>
            </div>
            <div class="col-md-9">
              <input
                type="text"
                v-model="brand.name"
                maxlength="100"
                :class="['form-control', {'border-red-500': errorName}]" />
              <div v-if="errorName" class="text-red-500 text-sm mt-1">
                Vui lòng nhập tên
              </div>
            </div>
          </div>

          <div class="row form-row mb-3">
            <div class="col-md-3 mt-2">
              <label>Mô tả</label>
            </div>
            <div class="col-md-9">
              <textarea
                v-model="brand.description"
                rows="5"
                class="form-control"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'

export default {
  name: 'BrandIndex',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { showToast } = useToast()

    const brand = reactive({
      name: null,
      description: null
    })

    const click = ref(false)
    const saving = ref(false)
    const loading = ref(false)

    const errorName = computed(() => {
      return click.value && (brand.name == null || brand.name.length <= 0)
    })

    const checkValidate = () => {
      return !errorName.value
    }

    const getBrandDetail = async () => {
      let brandId = route.params.id
      if (brandId) {
        loading.value = true

        try {
          const res = await adminAPI.getBrandDetail(brandId)
          if (res != null && res.data != null && res.data.data != null) {
            Object.assign(brand, res.data.data)
          }
          loading.value = false
        } catch (err) {
          loading.value = false
          const errorMess = commonFunc.handleStaffError(err)
          showToast('danger', errorMess)
        }
      }
    }

    const save = async () => {
      click.value = true

      if (!checkValidate()) {
        return
      }

      saving.value = true

      let brandId = route.params.id
      try {
        if (brandId) {
          // Edit
          brand.id = brandId
          const res = await adminAPI.updateBrand(brand)
          saving.value = false
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              showToast('success', 'Cập nhật thương hiệu thành công!!! ')
            }
          }
        } else {
          // Add
          const res = await adminAPI.addBrand(brand)
          saving.value = false
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              router.push("/brand/list")
            }
          }
        }
      } catch (err) {
        saving.value = false
        const errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
      }
    }

    const back = () => {
      router.push("/brand/list")
    }

    onMounted(() => {
      getBrandDetail()
    })

    return {
      brand,
      click,
      saving,
      loading,
      errorName,
      save,
      back
    }
  }
}
</script>
