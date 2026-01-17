<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h4 class="text-xl font-semibold text-center text-gray-700">Nhóm - Loại Thu Chi</h4>
      </div>
      <hr class="my-4">

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Loại<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center">
              <input type="radio" v-model="fundSetting.type" name="issue_invoice" :value="1"
                     class="mr-2" id="type_expend" @change="changeType('1')">
              <label class="cursor-pointer" for="type_expend">Khoản chi</label>
            </div>
            <div class="flex items-center">
              <input type="radio" v-model="fundSetting.type" name="issue_invoice" :value="0"
                     class="mr-2" id="type_income" @change="changeType('0')">
              <label class="cursor-pointer" for="type_income">Khoản thu</label>
            </div>
            <div class="flex items-center">
              <input type="radio" v-model="fundSetting.type" name="issue_invoice" :value="2"
                     class="mr-2" id="type_accounting_slip" @change="changeType('2')">
              <label class="cursor-pointer" for="type_accounting_slip">Phiếu kế toán</label>
            </div>
          </div>
          <div v-if="errorType" class="text-red-500 text-sm mt-1">Vui lòng chọn loại</div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Nhóm<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <select v-model="fundSetting.group_id"
                  :disabled="fundSetting.type != 1 && fundSetting.type != 0 && fundSetting.type != 2"
                  class="form-select w-full rounded-md border-gray-300">
            <option v-for="opt in optionsGroup" :key="opt.value" :value="opt.value">{{opt.text}}</option>
          </select>
          <div v-if="errorGroup" class="text-red-500 text-sm mt-1">Vui lòng chọn nhóm</div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Tên loại<span class="text-red-500">*</span></label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <input type="text" v-model="fundSetting.name"
                 class="form-input w-full rounded-md border-gray-300"
                 maxlength="255">
          <div v-if="errorName" class="text-red-500 text-sm mt-1">Vui lòng nhập tên</div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Mô tả</label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <textarea v-model="fundSetting.description"
                    rows="2"
                    class="form-textarea w-full rounded-md border-gray-300"></textarea>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-3">
          <label class="block mb-2 font-medium">Thứ tự xuất hiện</label>
        </div>
        <div class="col-span-12 md:col-span-9">
          <input type="text" v-model="fundSetting.index_sort"
                 @keyup="integerOnly($event.target)"
                 class="form-input w-full rounded-md border-gray-300"
                 maxlength="2">
        </div>
      </div>

      <div class="text-center mb-4">
        <button v-show="!saving"
                class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                :disabled="saving"
                @click.prevent="addUpdateFundSetting">
          {{btn_text}}
        </button>
        <div v-show="saving" class="inline-block">
          <icon name="loading" width="60" />
        </div>
      </div>

      <div class="mb-2">
        Số kết quả: <span class="font-bold">{{items.length}}</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-2 py-2">STT</th>
              <th class="border border-gray-300 px-2 py-2">Loại</th>
              <th class="border border-gray-300 px-2 py-2">Nhóm</th>
              <th class="border border-gray-300 px-2 py-2">Tên</th>
              <th class="border border-gray-300 px-2 py-2">Mô tả</th>
              <th class="border border-gray-300 px-2 py-2">Thứ tự hiển thị</th>
              <th class="border border-gray-300 px-2 py-2 w-32"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-2 py-2 text-center">{{item.stt}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.type_str}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.group_name}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.name}}</td>
              <td class="border border-gray-300 px-2 py-2">{{item.description}}</td>
              <td class="border border-gray-300 px-2 py-2 text-center">{{item.index_sort}}</td>
              <td class="border border-gray-300 px-2 py-2">
                <div v-if="item.is_type_can_edit" class="flex gap-2 justify-center">
                  <button @click="edit(index)"
                          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="Cập nhật">
                    <i class="fa fa-edit" />
                  </button>
                  <button @click="deleted(item.id, item.name)"
                          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          title="Xóa">
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="loading" class="flex justify-center my-4">
        <icon name="loading" width="60" />
      </div>
      <div class="text-center my-4">--Hết--</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import fundApi from '@/api/fund'
import commonFunc from '@/common/commonFunc'

const { popToast } = useToast()

const fundSetting = ref({
  type: null,
  group_id: null,
  name: null,
  description: null,
  index_sort: null
})
const optionsGroupStore = ref([])
const optionsGroup = ref([])
const btn_text = ref("Thêm mới")
const items = ref([])
const loading = ref(false)
const click = ref(false)
const saving = ref(false)

const errorType = computed(() => {
  return checkInfo(fundSetting.value.type)
})
const errorGroup = computed(() => {
  return checkInfo(fundSetting.value.group_id)
})
const errorName = computed(() => {
  return checkInfo(fundSetting.value.name)
})

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorType.value || errorGroup.value || errorName.value)
}

const getOptionGroup = () => {
  fundApi.getGroupOptions().then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      optionsGroupStore.value = res.data.data
    }
  })
}

const changeType = (type) => {
  optionsGroup.value = []
  for(let item of optionsGroupStore.value) {
    if(item.type == type) {
      let group = {"value": item.id, "text": item.name}
      optionsGroup.value.push(group)
    }
  }
}

const search = () => {
  if (loading.value) { return }
  loading.value = true

  fundApi.getFundSetting().then(res => {
    if(res != null && res.data != null && res.data.data != null){
      items.value = res.data.data
    }else{
      items.value = []
    }
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loading.value = false
  })
}

const edit = (index) => {
  fundSetting.value = items.value[index]
  changeType(fundSetting.value.type)
  btn_text.value = "Cập nhật"
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

const deleted = (id, name) => {
  if(id && name) {
    if(confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
      fundApi.deleteFundSetting(id).then(res => {
        if(res != null && res.data != null && res.data.data != null){
          items.value = res.data.data
          popToast('success', 'Xoá thành công!')
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const resetValueSeting = () => {
  click.value = false
  fundSetting.value = {
    type: null,
    group_id: null,
    name: null,
    description: null,
    index_sort: null
  }
}

const addUpdateFundSetting = () => {
  click.value = true

  let checkValidateResult = checkValidate()
  if(!checkValidateResult) {
    return
  }

  saving.value = true

  let fundSettingId = fundSetting.value.id
  if(fundSettingId){
    fundApi.updateFundSetting(fundSetting.value).then(res => {
      saving.value = false
      if(res != null && res.data != null && res.data.data != null){
        items.value = res.data.data
        popToast('success', 'Cập nhật thành công!')
        resetValueSeting()
      }
    }).catch(err => {
      saving.value = false
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  } else {
    fundApi.addFundSetting(fundSetting.value).then(res => {
      saving.value = false
      if(res != null && res.data != null && res.data.data != null){
        items.value = res.data.data
        popToast('success', 'Thêm mới thành công!')
        resetValueSeting()
      }
    }).catch(err => {
      saving.value = false
      let errorMess = commonFunc.handleStaffError(err)
      popToast('danger', errorMess)
    })
  }
}

onMounted(() => {
  getOptionGroup()
  search()
})
</script>
