<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col md='12'>
              <b-button variant="outline-success" class="pull-right btn-width-120" @click="goToAdd()">
                Thêm
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md='12'>
              <h4 class="mt-2 text-center text-header">Danh Sách Dự Án Mẫu</h4>
            </b-col>
          </b-row>
          <hr>

          <b-table
            hover
            bordered
            :fields="fields"
            :items="items"
            >
            <template v-slot:cell(stt)="data">{{ data.index + 1 }}</template>
            <template v-slot:cell(products)="dataId">
              <b-row v-for="(product) in dataId.item.products" :key="product.product_name">
                <b-col>
                  <p>- {{product.product_name}}</p>
                  <p>{{currencyFormat(product.product_quantity)}} x {{currencyFormat(product.product_price)}} = {{currencyFormat(product.product_amount)}}</p>
                </b-col>
              </b-row>
            </template>
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
          <span class="loading-more">--Hết--</span>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import projectApi from '@/api/project'
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
          label: 'Tên dự án'
        },
        {
          key: 'brand_name',
          label: 'Hãng'
        },
        {
          key: 'unit_name',
          label: 'Đơn vị'
        },
        {
          key: 'products',
          label: 'Sản phẩm'
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
  mounted() {
    this.getProjectList()
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
     * Load list
     */
    getProjectList () {
      this.loading = true

      projectApi.getProjectList().then(res => {
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
     */
    deleted (id, name) {
      this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
        title: false,
        buttonSize: 'sm',
        centered: true, size: 'sm',
        footerClass: 'p-2'
      }).then(res => {
        if(res){
          projectApi.deleteProject(id).then(res => {
            // Reload data
            this.getProjectList()

          }).catch(err => {
            // Handle error
            let errorMess = commonFunc.handleStaffError(err)
            this.popToast('danger', errorMess)
          })
        }
      })
    },

    /**
     * Go to edit
     * @param id
     */
    edit (id) {
      this.$router.push('/project/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.$router.push('/project/index/')
    },

    /**
   * Currency format
   */
    currencyFormat(num) {
      let result = ""
        if(num === 0) {
            return "0"
        }
        if(num) {
            num = (num + "").replaceAll(",", "")
        }

      if(num) {
        result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      return result
    },
  }
}
</script>
