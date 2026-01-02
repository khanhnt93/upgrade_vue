<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd">
                Thêm
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Kênh Bán Hàng</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col md='12'>
              <b-table
              hover
              bordered
              stacked="md"
              :fields="fields"
              :items="items">
                <template v-slot:cell(actions)="data">
                  <b-list-group horizontal>
                    <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(data.item.id)">
                      <i class="fa fa-edit" />
                    </b-list-group-item>
                    <b-list-group-item v-b-tooltip.hover title="Delete" @click="deleted(data.item.id, data.item.name)">
                      <i class="fa fa-trash" />
                    </b-list-group-item>
                  </b-list-group>
                </template>
              </b-table>
            </b-col>
          </b-row>

          <!-- Loading -->
          <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
          <span class="loading-more">--Hết--</span>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import Mapper from '@/mapper/topping'
import commonFunc from '@/common/commonFunc'

export default {
  data () {
    return {
      perPage: '10',
      currentPage: '1',
      fields: [
        {
          key: 'stt',
          label: 'STT'
        },
        {
          key: 'code',
          label: 'Mã'
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
      loading: false,
    }
  },
  computed: {
  },
  mounted() {
    // Load list when load page
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
   * Make toast with title
   */
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: 3000
      })
    },

    /**
     *  Delete
     */
    deleted (id, name) {

      this.$bvModal.msgBoxConfirm('Xóa [' + name + "]. Bạn có chắc không?", {
        title: false,
        buttonSize: 'sm',
        centered: true, size: 'sm',
        footerClass: 'p-2'
      }).then(res => {
        if(res){
          adminAPI.deleteSaleChannel(id).then(res => {
            if(res != null && res.data != null && res.data.data != null) {
              this.items = res.data.data
            }

            this.popToast('success', 'Xóa topping thành công!!!')
          }).catch(err => {
            // Handle error
              let errorMess = commonFunc.handleStaffError(err)
              this.popToast('danger', errorMess)
          })
        }
      })
    },

    /**
     *  Go to edit
     */
    edit (id) {
      this.$router.push('/sale-channel/edit/' + id)
    },

    /**
     *  Go to add
     */
    goToAdd () {
      this.$router.push('/sale-channel/add')
    },

    /**
     *  Search
     */
    search() {
      this.loading = true

      // Search
      adminAPI.getListSaleChannel().then(res => {
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

  }
}
</script>
