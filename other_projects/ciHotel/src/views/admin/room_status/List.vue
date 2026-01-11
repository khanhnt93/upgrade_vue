<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-end mb-4">
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 border border-blue-600 min-w-[120px]"
          @click="goToAdd">
          Thêm
        </button>
      </div>

      <div class="text-center mb-4">
        <h4 class="text-xl font-semibold mt-2">Trạng thái phòng</h4>
      </div>
      <hr class="mb-4" />

      <div class="mb-4">
        Số kết quả: {{ items.length }}
      </div>

      <!-- Table -->
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2">STT</th>
            <th class="border border-gray-300 px-4 py-2">Tên</th>
            <th class="border border-gray-300 px-4 py-2 actions-cell"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <div class="flex space-x-2 justify-center">
                <button 
                  class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  @click="edit(item.id)"
                  title="Edit">
                  <i class="fa fa-edit" />
                </button>
                <button 
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  @click="deleted(item.id, item.name)"
                  title="Delete">
                  <i class="fa fa-trash" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Loading -->
      <div v-show="loading" class="text-center py-4">
        <icon name="loading" width="60" />
      </div>
      <div class="text-center py-2">--Hết--</div>
    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin';
import commonFunc from '@/common/commonFunc';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();

    return {
      router,
      toast
    };
  },
  data() {
    return {
      items: [],
      offset: 0,
      hasNext: true,
      onSearch: false,
      loading: false,
      totalRow: 0
    };
  },
  mounted() {
    this.getRoomStatus();
  },
  methods: {
    deleted(id, name) {
      if (id && name) {
        if (confirm('Xóa ' + name + '. Bạn có chắc không?')) {
          adminAPI.deleteRoomStatus(id).then(res => {
            if (res != null && res.data != null && res.data.data != null) {
              this.items = res.data.data;
            }
          }).catch(err => {
            let errorMess = commonFunc.handleStaffError(err);
            this.toast.error(errorMess);
          });
        }
      }
    },

    edit(id) {
      this.router.push('/room-status/edit/' + id);
    },

    goToAdd() {
      this.router.push('/room-status/add');
    },

    getRoomStatus() {
      if (this.loading) { return; }

      this.onSearch = true;
      this.loading = true;

      adminAPI.getRoomStatus().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.items = res.data.data;
        }
        this.onSearch = false;
        this.loading = false;
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err);
        this.toast.error(errorMess);

        this.onSearch = false;
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
