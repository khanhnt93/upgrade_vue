<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
                <button class="btn float-right px-4 default-btn-bg" @click="gotoAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <h4 class="mt-2 text-center">Thương Hiệu</h4>
            </div>
          </div>
          <hr>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-full">
              <label>Tên</label>
              <input
                id="name"
                type="text"
                class="form-control"
                v-model="inputs.name"
                maxlength="100">
            </div>

          </div>
           <div class="grid grid-cols-12 gap-4 mt-2 mb-2">
            <div class="col-span-12">
              <button class="btn mb-3 float-right px-4 default-btn-bg" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
            </div>

          <table class="table table-bordered table-hover table-responsive-stack">
            <thead>
              <tr>
                <th v-for="field in fields" :key="field.key" :class="field.class">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td v-for="field in fields" :key="field.key" :data-label="field.label">
                  <div v-if="field.key === 'actions'">
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
          <span class="loading-more" v-if="hasNext === false">Hết</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import superAdminAPI from '@/api/superAdmin'
import Mapper from '@/mapper/store'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'


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
          key: 'description',
          label: 'Mô tả'
        },
        {
          key: 'created_at',
          label: 'Ngày Tạo'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-cell'
        }
      ],
      items: [],
      inputs: {
        name: ''
      },
      loadByScroll: false,
      onSearch: false,
      hasNext: true,
      loading: false,
      pageLimit: Constant.PAGE_LIMIT,
      offset: 0,
      listIdDeleted: [],
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)

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
     * Scroll event
     */
    onScroll (event) {
      if(this.onSearch) {
        return
      }
      event.preventDefault()
      var body = document.body
      var html = document.documentElement
      if (window.pageYOffset + window.innerHeight + 5 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
        if(this.hasNext) {
          this.offset = this.offset + 10
          this.loadByScroll = true
          this.search ()
        }
      }
    },

    /**
     * Prepare to search
     */
    prepareToSearch() {
      this.offset = 0
      this.items = []
      this.hasNext = true

      this.search()
    },

    /**
     * Delete
     */
    deleted (id, name, rowIndex) {
      this.$bvModal.msgBoxConfirm('Xóa ' + name + ". Bạn có chắc không?", {
        title: false,
        buttonSize: 'sm',
        centered: true, size: 'sm',
        footerClass: 'p-2'
      }).then(res => {
        if(res){
          superAdminAPI.deleteBrand(id).then(res => {
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
     *  Go to edit
     */
    edit (id) {
      this.$router.push('/brand/index/' + id)
    },

    /**
     *  Go to add
     */
    gotoAdd () {
      this.$router.push('/brand/index/')
    },

    /**
     * Search
     */
    search () {
      if (this.loading) { return }

      this.onSearch = true
      this.loading = true

      let dataPost = {
        "name": this.inputs.name,
        "limit": this.pageLimit,
        "offset": this.offset
      }

      superAdminAPI.getBrandList(dataPost).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let it = res.data.data.data

          // Update items
          if(this.loadByScroll) {
            let temp = this.items
            var newArray = temp.concat(it)
            this.items = newArray
          } else {
            this.items = it
          }
          this.loadByScroll = false

          // Check has next
          if(this.offset + this.pageLimit >= res.data.data.total_row) {
            this.hasNext = false
          }
        } else {
          this.items = []
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
