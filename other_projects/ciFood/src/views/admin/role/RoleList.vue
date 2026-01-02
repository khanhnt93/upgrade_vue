<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="gotoAdd">
                Thêm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Nhóm Quyền</h4>
            </b-col>
          </b-row>
          <hr>

          <b-table
          hover
          bordered
          stacked="md"
          :fields="fields"
          :items="items">
          <template v-slot:cell(actions)="dataId">
            <b-list-group horizontal>
              <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                <i class="fa fa-edit" />
              </b-list-group-item>
              <b-list-group-item v-b-tooltip.hover title="Delete" @click="deleted(dataId.item.id, dataId.item.name)">
                <i class="fa fa-trash" />
              </b-list-group-item>
            </b-list-group>
          </template>
          </b-table>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
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
          key: 'code',
          label: 'Mã nhóm quyền'
        },
        {
          key: 'name',
          label: 'Tên nhóm quyền'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      loading: false,
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    this.search()
  },
  methods: {
     /**
   * Make toast without title
   */
  popToast(variant, content) {
    this.$bvToast.toast(content, {
      toastClass: 'my-toast',
      noCloseButton: true,
      variant: variant,
      autoHideDelay: 3000
    })
  },

    /**
     * Delete
     */
    deleted (id, name) {
      if(id && name) {
        this.$bvModal.msgBoxConfirm('Xóa [' + name + "]. Bạn có chắc không?", {
          title: false,
          buttonSize: 'sm',
          centered: true, size: 'sm',
          footerClass: 'p-2'
        }).then(res => {
          if(res){
            adminAPI.deleteRole(id).then(res => {
              this.items = res.data.data
            }).catch(err => {
              // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
            })
          }
        })
        }
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/role/index/' + id)
    },

    /**
     * Go to add
     */
    gotoAdd () {
      this.$router.push('/role/index/')
    },

    /**
     * Search
     */
    search () {
      if (this.loading) { return }

      this.loading = true

      adminAPI.getListRole().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data
        } else {
          this.items = []
        }
        this.loading = false
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)

        this.loading = false
      })
    },
  }
}
</script>

