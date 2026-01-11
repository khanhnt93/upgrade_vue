<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 border border-green-600 min-w-[120px]"
          @click="goToAdd()">
          Thêm mới
        </button>
      </div>

      <div class="text-center mb-4">
        <h4 class="text-xl font-semibold mt-1">TẦNG</h4>
      </div>
      <hr class="mb-4" />

      <div class="mb-4">
        Số kết quả: {{ items.length }}
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-4 py-2">STT</th>
              <th class="border border-gray-300 px-4 py-2">Tên</th>
              <th class="border border-gray-300 px-4 py-2">Thứ tự</th>
              <th class="border border-gray-300 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2 text-center">{{ item.stt }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">{{ item.index }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <div class="flex justify-center space-x-2">
                  <button
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    @click="edit(item.id)"
                    title="Edit">
                    <i class="fa fa-edit" />
                  </button>
                  <button
                    class="p-2 text-red-600 hover:bg-red-50 rounded"
                    @click="deleted(item.id, item.name)"
                    title="Delete">
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <div v-show="loading" class="text-center py-4">
        <icon name="loading" width="60" />
      </div>
      <div class="text-center py-4">--Hết--</div>
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
    this.getFloor();
  },
  methods: {
    deleted(id, name) {
      if (id && name) {
        if (confirm('Xóa ' + name + ". Bạn có chắc không?")) {
          adminAPI.deleteFloor(id).then(res => {
            if (res != null && res.data != null && res.data.data != null) {
              this.items = res.data.data;
            }
            this.toast.success('Xóa thành công!!!');
          }).catch(err => {
            let errorMess = commonFunc.handleStaffError(err);
            this.toast.error('Xóa thất bại: ' + errorMess);
          });
        }
      }
    },

    edit(id) {
      this.router.push('/floor/edit/' + id);
    },

    goToAdd() {
      this.router.push('/floor/add');
    },

    getFloor() {
      if (this.loading) { return; }

      this.onSearch = true;
      this.loading = true;

      adminAPI.getFloor().then(res => {
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
