<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <button class="btn btn-outline-success float-right btn-width-120" @click="goToAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center text-header">Danh Sách Tài Khoản Ngân Hàng</h4>
            </div>
          </div>
          <hr>

          <table class="table table-bordered table-hover table-responsive-stack">
            <thead>
              <tr>
                <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td v-for="field in fields" :key="field.key" :data-label="field.label">
                  <div v-if="field.key === 'stt'">
                    {{ index + 1 }}
                  </div>
                  <div v-else-if="field.key === 'actions'">
                    <div class="flex gap-2">
                      <button class="list-group-item" title="Edit" @click="edit(item.id)">
                        <i class="fa fa-edit" />
                      </button>
                      <button class="list-group-item" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                        <i class="fa fa-trash" />
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    {{ item[field.key] }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import bankAccountAPI from '@/api/bankAccount'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'type_str',
          label: 'Loại TK'
        },
        {
          key: 'account_name',
          label: 'Tên TK'
        },
        {
          key: 'account_number',
          label: 'Số TK'
        },
        {
          key: 'bank_name',
          label: 'Ngân hàng'
        },
        {
          key: 'is_default_str',
          label: 'Mặc định'
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
    this.getBankAccountList()
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      if (variant === 'danger') {
        this.$toast.error(content);
      } else if (variant === 'success') {
        this.$toast.success(content);
      } else if (variant === 'warning') {
        this.$toast.warning(content);
      } else {
        this.$toast.info(content);
      }
    },

    /**
     * Load list
     */
    getBankAccountList () {
      this.loading = true

      bankAccountAPI.getListBankAccount().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data
        }

        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Delete
     * @param id
     * @param name
     * @param rowIndex
     */
    deleted (id, name, rowIndex) {
      if (confirm('Xóa số TK [' + name + "]. Bạn có chắc không?")) {
          bankAccountAPI.deleteBankAccount(id).then(res => {
            // Remove item in list
            this.getBankAccountList()
          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
      }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/bank-account/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.$router.push('/bank-account/index/')
    }
  }
}
</script>
