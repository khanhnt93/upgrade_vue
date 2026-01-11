<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div>
        <div class="bg-white rounded-lg shadow-md">
          <div class="p-4">

              <div class="grid grid-cols-2 gap-4">
              <div>
                <button 
                  class="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 float-left"
                  @click="back">
                  Quay lại
                </button>
              </div>
              <div>
                <button 
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 float-right"
                  @click="save" 
                  :disabled="saving">
                  Lưu
                </button>
              </div>
            </div>

              <div class="grid grid-cols-1 mt-4">
                <div>
                  <h4 class="mt-2 text-center text-xl font-semibold">Bàn Ăn</h4>
                </div>
              </div>
              <hr class="my-4"/>
              <!-- Loading -->
              <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

              <div class="grid grid-cols-12 gap-4 mb-4">
                <div class="col-span-3 mt-2">
                  <label> Tên </label><span class="error-sybol"></span>
                </div>
                <div class="col-span-9">
                  <input
                  id="name"
                  type="text"
                  maxlength="100"
                  autocomplete="new-password"
                  :class="['form-control', {'border-red-500': errorName}]"
                  v-model="table.name">
                  <div class="text-red-500 text-sm mt-1" v-if="errorName">
                    Vui lòng nhập tên
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 mb-4">
                  <div class="col-span-3 mt-2">
                    <label> Loại </label><span class="error-sybol"></span>
                  </div>
                  <div class="col-span-9">
                    <select
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', {'border-red-500': errorType}]"
                    v-model="table.type">
                      <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                    <div class="text-red-500 text-sm mt-1" v-if="errorType">
                      Vui lòng chọn loại bàn
                    </div>
                  </div>
                </div>

              <div class="grid grid-cols-12 gap-4 mb-4">
                <div class="col-span-3 mt-2">
                  <label> Thứ tự xuất hiện </label>
                </div>
                <div class="col-span-9">
                  <input
                  id="index_sort"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  v-model="table.index_sort"
                  @keyup="intergerOnly($event.target)"
                  maxlength="3">
                </div>
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/table'
import commonFunc from '@/common/commonFunc'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'


export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()
    
    return {
      router,
      route,
      toast
    }
  },
  data () {
    return {
      table: {
        "name": null,
        "type": null,
        "index_sort": null,
      },
      typeOptions: [
        {value: null, text: ''},
        {value: 'take_away', text: 'Take Away'},
        {value: 'default', text: 'Thường'}
      ],
      click: false,
      saving: false,
      loading: false,
    }
  },
  mounted() {
    this.getTableDetail()
  },
  computed: {
    errorName: function () {
      return this.checkInfo(this.table.name)
    },
    errorType: function () {
      return this.checkInfo(this.table.type)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorName || this.errorType)
    },

    /**
     * Get detail
     */
    getTableDetail() {
      let tableId = this.route.params.id
      if(tableId){
        this.loading = true

        adminAPI.getTableDetail(tableId).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.table = Mapper.mapTableDetailModelToDto(res.data.data)
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    /**
     * Back to list
     */
    back() {
      // Go to list
      this.router.push('/table/list')
    },

    /**
     * Save
     */
    save () {
      this.click = true
      this.saving = true
      let result = this.checkValidate()
      if(result) {  
        let tableId = this.route.params.id
        if(tableId){
          // Edit
          let table = this.table
          table.id = tableId
          adminAPI.editTable(table).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                // show popup success
                this.toast.success('Cập nhật bàn ăn thành công!!! ')
              }
            }
          }).catch(err => {
            this.saving = false
            let message = ""
            if(err.response.data.status == 422) {
              message = err.response.data.mess
            } else {
              message = "Lỗi hệ thống"
            }
            alert(message)
          })
        } else {
          // Add
          adminAPI.addTable(this.table).then(res => {
            this.saving = false
            if(res != null && res.data != null){
              if (res.data.status == 200) {
                this.router.push("/table/list")
              }
            }
          }).catch(err => {
            this.saving = false
            let message = ""
              if(err.response.data.status == 422) {
                message = err.response.data.mess
              } else {
                message = "Lỗi hệ thống"
              }
              alert(message)
          })
        }
      } else {
        this.saving = false
      }
    },

    /**
     * Only input integer
     */
     intergerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

  }
}
</script>

