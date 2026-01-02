<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd()">
                Thêm mới
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-1 text-center text-header">LOẠI PHÒNG</h4>
            </b-col>
          </b-row>
          <hr>

          <b-row>
            <b-col>
              Số kết quả: {{items.length}}
            </b-col>
          </b-row>

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
                <b-list-group-item v-b-tooltip.hover title="Delete"
                                   @click="deleted(dataId.item.id, dataId.item.name)">
                  <i class="fa fa-trash" />
                </b-list-group-item>
              </b-list-group>
            </template>
          </b-table>

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
        offset: 0,
        hasNext: true,
        onSearch: false,
        loading: false,
        totalRow: 0
      }
    },
    mounted() {
      // Get list
      this.getRoomType()

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
      makeToast(variant = null, title="Success!!!", content="Thao tác thành công!!!") {
        this.$bvToast.toast(content, {
          title: title,
          variant: variant,
          solid: true,
          autoHideDelay: 3000
        })
      },

      /**
       * Delete
       */
      deleted (id, name) {
        if(id && name) {
          this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
            title: false,
            buttonSize: 'sm',
            centered: true, size: 'sm',
            footerClass: 'p-2'
          }).then(res => {
            if (res) {
              adminAPI.deleteRoomType(id).then(res => {
                if(res != null && res.data != null && res.data.data != null) {
                  this.items = res.data.data
                }
              }).catch(err => {
                // Handle error
                let errorMess = commonFunc.handleStaffError(err)
                this.makeToast('danger', "Xóa thất bại!!!", errorMess)
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
        this.$router.push('/room-type/edit/' + id)
      },

      /**
       * Go to add
       */
      goToAdd () {
        this.$router.push('/room-type/add')
      },

      /**
       * Get list
       */
      getRoomType () {
        if (this.loading) { return }

        this.onSearch = true
        this.loading = true

        adminAPI.getRoomType().then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            this.items = res.data.data
          }
          this.onSearch = false
          this.loading = false
        }).catch(err => {
          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)

          this.onSearch = false
          this.loading = false
        })
      },

    }
  }
</script>
