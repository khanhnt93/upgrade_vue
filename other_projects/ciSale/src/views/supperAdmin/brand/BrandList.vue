<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
                <button class="btn btn-primary pull-right px-4 default-btn-bg" @click="gotoAdd()">
                Thêm
              </button>
            </div>
          </div>

          <div class="flex flex-wrap -mx-2">
            <div md='12'>
              <h4 class="mt-2 text-center">Thương Hiệu</h4>
            </div>
          </div>
          <hr>

          <div class="flex flex-wrap -mx-2">
            <div class="w-full px-2">
              <label>Tên</label>
              <input
                id="name"
                type="text"
                class="form-control"
                v-model="inputs.name"
                maxlength="100">
            </div>

          </div>
           <div class="mt-2 mb-2">
            <div class="w-full md:w-12 px-2">
              <button class="btn btn-primary mb-3 pull-right px-4 default-btn-bg" :disabled="onSearch" @click.prevent="prepareToSearch">
                Tìm Kiếm
              </button>
            </div>
            </div>

          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th v-for="field in fields" :key="field.key" :class="field.class">{{ field.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.stt }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.created_at }}</td>
                <td class="actions-cell">
                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-sm btn-link" title="Edit" @click="edit(item.id)">
                      <i class="fa fa-edit" />
                    </button>
                    <button type="button" class="btn btn-sm btn-link" title="Delete" @click="deleted(item.id, item.name, item.stt)">
                      <i class="fa fa-trash" />
                    </button>
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
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import superAdminAPI from '@/api/superAdmin'
import Mapper from '@/mapper/store'
import MasterApi from '@/api/master'
import MasterMapper from '@/mapper/master'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'


export default {
  setup() {
    const { toast } = useToast()
    const router = useRouter()
    return { toast, router }
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
      this.toast(content, variant === 'danger' ? 'error' : variant)
      this.toast(content,  variant === 'danger' ? 'error' : variant)
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
          this.offset = this.offset + this.pageLimit
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
      this.router.push('/brand/index/' + id)
    },

    /**
     *  Go to add
     */
    gotoAdd () {
      this.router.push('/brand/index/')
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
