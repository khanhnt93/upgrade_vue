<template>
  <div class="container-fluid px-4 py-4">
    <div class="card">
      <div class="card-body p-4">
        <div class="row mb-3">
          <div class="col-12">
            <button
              class="btn btn-outline-secondary btn-width-120"
              @click="goBack">
              Quay lại
            </button>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <h4 class="text-center font-semibold text-lg">Lịch Sử Két Tiền</h4>
          </div>
        </div>

        <hr class="mb-4">

        <!-- Filter Section -->
        <div class="row mb-4">
          <div class="col-md-4 mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Loại giao dịch</label>
            <select
              id="status"
              class="form-control"
              v-model="inputs.type"
            >
              <option :value="null"></option>
              <option value="plus">Thu</option>
              <option value="minus">Chi</option>
              <option value="fund">Vốn đầu ngày</option>
            </select>
          </div>
          <div class="col-md-4 mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Loại tiền</label>
            <select
              id="moneyType"
              class="form-control"
              v-model="inputs.moneyType"
            >
              <option :value="null"></option>
              <option value="cash">Tiền mặt</option>
              <option value="credit">Chuyển khoản</option>
              <option value="e_money">Tiền điện tử</option>
            </select>
          </div>
          <div class="col-md-4 mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nhân viên</label>
            <select
              id="staff"
              class="form-control"
              v-model="inputs.staff"
            >
              <option :value="null"></option>
              <option
                v-for="staff in staffOption"
                :key="staff.value"
                :value="staff.value"
              >
                {{ staff.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12 flex justify-end">
            <button
              class="btn btn-outline-primary btn-width-120"
              :disabled="onSearch"
              @click="prepareToSearch">
              Tìm Kiếm
            </button>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-12">
            Số kết quả: {{ totalRow }}
          </div>
        </div>

        <!-- Table -->
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th>STT</th>
                <th>Loại</th>
                <th>Số tiền</th>
                <th>Nội dung</th>
                <th>Tiền mặt</th>
                <th>Chuyển khoản</th>
                <th>Tiền điện tử</th>
                <th>Thời gian</th>
                <th>Nhân viên</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.stt">
                <td>{{ item.stt }}</td>
                <td>{{ convertTypeCodeToName(item.type) }}</td>
                <td>{{ formatCurrency(item.total) }}</td>
                <td>{{ item.content }}</td>
                <td>{{ formatCurrency(item.cash) }}</td>
                <td>{{ formatCurrency(item.credit) }}</td>
                <td>{{ formatCurrency(item.e_money) }}</td>
                <td>{{ item.created_at }}</td>
                <td>{{ item.created_by }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading / Pagination -->
        <div class="text-center mt-4">
          <span v-show="loading" class="loading-more">
            <font-awesome-icon icon="spinner" spin size="2x" />
          </span>
          <span v-if="hasNext === false" class="loading-more">--Hết--</span>
          <span v-if="hasNext === true && totalRow != 0" class="loading-more">
            <font-awesome-icon icon="angle-double-down" class="has-next" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { Constant } from '@/common/constant'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

const router = useRouter()
const { popToast } = useToast()
const { formatCurrency } = useFormatters()

// Data
const inputs = reactive({
  type: null,
  moneyType: null,
  staff: null
})

const items = ref([])
const staffOption = ref([])
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const hasNext = ref(true)
const onSearch = ref(false)
const loadByScroll = ref(false)
const loading = ref(false)
const totalRow = ref(0)

/**
 * Get staff option
 */
const getStaffOption = () => {
  adminAPI.getStaffOption().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      staffOption.value = res.data.data
    }
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

/**
 * Processing on scroll: use for paging
 */
const onScroll = (event) => {
  if(onSearch.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + pageLimit.value
      loadByScroll.value = true
      search()
    }
  }
}

/**
 * Prepare to search
 */
const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true

  search()
}

/**
 * Search
 */
const search = () => {
  if (loading.value) { return }

  onSearch.value = true
  loading.value = true

  // Define params
  let params = {
    type: inputs.type,
    moneyType: inputs.moneyType,
    staff: inputs.staff,
    limit: pageLimit.value,
    offset: offset.value
  }

  // Search
  adminAPI.searchMoneyBoxHistory(params).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      let it = res.data.data.data
      totalRow.value = res.data.data.total_row

      // Update items
      if(loadByScroll.value) {
        items.value = items.value.concat(it)
      } else {
        items.value = it
      }
      loadByScroll.value = false

      // Check has next
      if(offset.value + pageLimit.value >= res.data.data.total_row) {
        hasNext.value = false
      }
    } else {
      items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    // Handle error
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)

    onSearch.value = false
    loading.value = false
  })
}

/**
 * Go back
 */
const goBack = () => {
  router.push('/money-box')
}

/**
 * Convert type code to name
 */
const convertTypeCodeToName = (code) => {
  if(code == "plus") {
    return "Thu"
  }
  if(code == "minus") {
    return "Chi"
  }
  if(code == "fund") {
    return "Vốn đầu ngày"
  }
  return ""
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)

  // Load option staff
  getStaffOption()

  // Load list when load page
  search()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.loading-more {
  display: block;
  padding: 1rem;
}

.has-next {
  cursor: pointer;
  font-size: 2rem;
  color: #007bff;
}
</style>
