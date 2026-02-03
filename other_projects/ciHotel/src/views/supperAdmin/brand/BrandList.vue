<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="bg-white shadow-sm rounded p-4">
          <div class="row mb-3">
            <div class="col text-right">
              <button
                @click="gotoAdd"
                class="btn btn-primary px-4">
                Thêm
              </button>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-12">
              <h4 class="mt-2 text-center text-orange-500">Thương Hiệu</h4>
            </div>
          </div>
          <hr>

          <div class="row mb-3">
            <div class="col">
              <label>Tên</label>
              <input
                type="text"
                v-model="inputs.name"
                maxlength="100"
                class="form-control" />
            </div>
          </div>

          <div class="row mt-2 mb-3">
            <div class="col-md-12 text-right">
              <button
                @click.prevent="prepareToSearch"
                :disabled="onSearch"
                class="btn btn-primary px-4">
                Tìm Kiếm
              </button>
            </div>
          </div>

          <table class="table table-bordered table-striped table-hover">
            <thead class="bg-blue-100">
              <tr>
                <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.stt }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.created_at }}</td>
                <td class="actions-cell">
                  <div class="d-flex gap-2">
                    <button
                      @click="edit(item.id)"
                      class="btn btn-sm btn-outline-primary"
                      title="Edit">
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      @click="deleted(item.id, item.name, item.stt)"
                      class="btn btn-sm btn-outline-danger"
                      title="Delete">
                      <i class="fa fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Loading -->
          <div v-show="loading" class="text-center py-4">
            <icon name="loading" width="60" />
          </div>
          <div v-if="hasNext === false" class="text-center py-2">Hết</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import superAdminAPI from '@/api/superAdmin'
import commonFunc from '@/common/commonFunc'
import { Constant } from '@/common/constant'

export default {
  name: 'BrandList',
  setup() {
    const router = useRouter()
    const { showToast, confirmDelete } = useToast()

    const fields = ref([
      { key: 'stt', label: 'STT' },
      { key: 'name', label: 'Tên' },
      { key: 'description', label: 'Mô tả' },
      { key: 'created_at', label: 'Ngày Tạo' },
      { key: 'actions', label: '', class: 'actions-cell' }
    ])

    const items = ref([])
    const inputs = reactive({
      name: ''
    })

    const loadByScroll = ref(false)
    const onSearch = ref(false)
    const hasNext = ref(true)
    const loading = ref(false)
    const pageLimit = ref(Constant.PAGE_LIMIT)
    const offset = ref(0)
    const listIdDeleted = ref([])

    const rows = computed(() => items.value.length)

    const onScroll = (event) => {
      if (onSearch.value) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if (hasNext.value) {
          offset.value = offset.value + 10
          loadByScroll.value = true
          search()
        }
      }
    }

    const prepareToSearch = () => {
      offset.value = 0
      items.value = []
      hasNext.value = true
      search()
    }

    const deleted = async (id, name, rowIndex) => {
      const confirmed = await confirmDelete(`Xóa ${name}. Bạn có chắc không?`)
      if (confirmed) {
        try {
          await superAdminAPI.deleteBrand(id)
          let indexTemp = commonFunc.updateIndex(rowIndex - 1, listIdDeleted.value)
          items.value.splice(indexTemp, 1)
          listIdDeleted.value.push(rowIndex - 1)
        } catch (err) {
          const errorMess = commonFunc.handleStaffError(err)
          showToast('danger', errorMess)
        }
      }
    }

    const edit = (id) => {
      router.push('/brand/index/' + id)
    }

    const gotoAdd = () => {
      router.push('/brand/index/')
    }

    const search = async () => {
      if (loading.value) { return }

      onSearch.value = true
      loading.value = true

      let dataPost = {
        "name": inputs.name,
        "limit": pageLimit.value,
        "offset": offset.value
      }

      try {
        const res = await superAdminAPI.getBrandList(dataPost)
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.data

          if (loadByScroll.value) {
            let temp = items.value
            var newArray = temp.concat(it)
            items.value = newArray
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
      } catch (err) {
        const errorMess = commonFunc.handleStaffError(err)
        showToast('danger', errorMess)
        onSearch.value = false
        loading.value = false
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', onScroll)
      search()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })

    return {
      fields,
      items,
      inputs,
      onSearch,
      hasNext,
      loading,
      rows,
      prepareToSearch,
      deleted,
      edit,
      gotoAdd
    }
  }
}
</script>

<style scoped>
.actions-cell {
  width: 120px;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
