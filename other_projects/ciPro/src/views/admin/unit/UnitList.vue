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
              <h4 class="mt-2 text-center text-header">Danh Sách Đơn Vị</h4>
            </b-col>
          </b-row>
          <hr>

          <b-table
          hover
          bordered
          :fields="fields"
          :items="items"
          >
          <template v-slot:cell(actions)="dataId">
            <b-list-group horizontal>
              <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(dataId.item.id)">
                <i class="fa fa-edit" />
              </b-list-group-item>
              <b-list-group-item v-b-tooltip.hover title="Delete" @click="deleted(dataId.item.id, dataId.item.name, dataId.item.stt)">
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
import unitAPI from '@/api/unit'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const { popToast } = useToast()
    return { popToast }
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
      this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
        title: false,
        buttonSize: 'sm',
        centered: true, size: 'sm',
        footerClass: 'p-2'
      }).then(res => {
        if(res){
          unitAPI.deleteUnit(id).then(res => {
            // Remove item in list
            let indexTemp = commonFunc.updateIndex(rowIndex - 1, this.listIdDeleted)
            this.items.splice(indexTemp, 1)
            this.listIdDeleted.push(rowIndex - 1)
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
      this.$router.push('/unit/index/' + id)
    },

    /**
     * Go to add
     */
    goToAdd () {
      this.$router.push('/unit/index/')
    }
  }
}
</script>
