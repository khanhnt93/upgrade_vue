<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="px-2 w-full">
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex flex-wrap -mx-2">
            <div class="px-2 w-full">
              <button class="btn btn-outline-success pull-right btn-width-120" @click="goToAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div class="px-2 w-full">
              <h4 class="mt-2 text-center">Đơn vị</h4>
            </div>
          </div>
          <hr>

          <div class="table-responsive">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th class="actions-cell"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.stt }}</td>
                  <td>{{ item.name }}</td>
                  <td class="actions-cell">
                    <div class="flex">
                      <button class="btn btn-sm btn-outline-primary mr-1" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="btn btn-sm btn-outline-danger" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                        <i class="fa fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import unitAPI from '@/api/unit'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'


export default {
  setup() {
    const { toast } = useToast()
    const router = useRouter()

    return {
      toast,
      router
    }
  },
  data () {
    return {
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'name',
          label: 'Tên'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      listIdDeleted: [],
      loading: false,
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    this.getUnitList()
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      this.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    /**
     * Load list
     */
    getUnitList () {
      this.loading = true

      unitAPI.getListUnit().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data
        }

        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)
      })
    },

    /**
     * Delete
     * @param id
     * @param name
     * @param rowIndex
     */
    deleted (id, name, rowIndex) {
      if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
        unitAPI.deleteUnit(id).then(res => {
          // Remove item in list
          let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
          this.items.splice(indexTemp, 1)
          this.listIdDeleted.push(rowIndex - 1)
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.router.push('/unit/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.router.push('/unit/index/')
    }
  }
}
</script>
