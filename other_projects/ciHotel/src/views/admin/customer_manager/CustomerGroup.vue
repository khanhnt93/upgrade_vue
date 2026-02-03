<template>
  <div class="container-fluid mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 border border-green-600 min-w-[120px]"
          @click="goToAdd()">
          Thêm
        </button>
      </div>

      <div class="text-center mb-4">
        <h4 class="text-xl font-semibold mt-1 text-orange-500">KHÁCH ĐOÀN</h4>
      </div>
      <hr class="mb-4" />

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3">
          <label class="block mb-2">Tên đoàn</label>
          <input
            id="name"
            type="text"
            autocomplete="new-password"
            class="form-control w-full"
            v-model="inputs.name"
            maxlength="75"
          />
        </div>
        <div class="md:col-span-3">
          <label class="block mb-2">Số điện thoại</label>
          <input
            id="phone"
            type="text"
            autocomplete="new-password"
            class="form-control w-full"
            v-model="inputs.phone_number"
            maxlength="75"
          />
        </div>
        <div class="md:col-span-3">
          <label class="block mb-2">Trạng thái</label>
          <select
            id="input-3"
            v-model="inputs.state"
            class="form-control w-full">
            <option v-for="option in states" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="md:col-span-3">
          <label class="block mb-2 text-white">Tìm kiếm</label>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            :disabled="onSearch"
            @click.prevent="prepareToSearch">
            Tìm Kiếm
          </button>
        </div>
      </div>

      <div class="mb-4">
        Số kết quả: {{ totalRow }}
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-4 py-2">STT</th>
              <th class="border border-gray-300 px-4 py-2">Tên đoàn</th>
              <th class="border border-gray-300 px-4 py-2">Số điện thoại</th>
              <th class="border border-gray-300 px-4 py-2">Mô tả</th>
              <th class="border border-gray-300 px-4 py-2">Trạng thái</th>
              <th class="border border-gray-300 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2 text-center">{{ item.stt }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.phone_number }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.note }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ formatState(item.state) }}</td>
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
      <div v-if="hasNext === false" class="text-center py-4">--Hết--</div>
      <div v-if="hasNext === true && totalRow != 0" class="text-center py-4">
        <i class="fa fa-angle-double-down text-2xl"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { Constant } from "@/common/constant";
import customerManagerApi from "@/api/customerManager";
import commonFunc from "@/common/commonFunc";
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
      states: [
        { text: "", value: null },
        { text: "Đang đến", value: 0 },
        { text: "Đang ở", value: 1 },
        { text: "Đã ở", value: 2 },
      ],
      inputs: {
        name: null,
        phone_number: null,
        state: ""
      },
      onSearch: false,
      totalRow: 0,
      offset: 0,
      loading: false,
      hasNext: false,
      items: [],
      pageLimit: Constant.PAGE_LIMIT,
      loadByScroll: false
    };
  },
  mounted() {
    this.filter({});
  },
  methods: {
    goToAdd() {
      this.router.push("/customer-group/add");
    },
    prepareToSearch() {
      this.search();
    },
    search() {
      let params = {
        "name": this.inputs.name,
        "phone_number": this.inputs.phone_number,
        "state": this.inputs.state,
        "limit": this.pageLimit,
        "offset": this.offset
      };
      this.filter(params);
    },
    filter(params) {
      if (this.loading) {
        return;
      }

      this.loading = true;
      this.onSearch = true;

      customerManagerApi
        .getListCustomerGroup(params)
        .then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            let it = res.data.data;
            this.totalRow = res.data.data.length;

            if (this.loadByScroll) {
              let temp = this.items;
              var newArray = temp.concat(it);
              this.items = newArray;
            } else {
              this.items = it;
            }
            this.loadByScroll = false;

            if (this.offset + this.pageLimit >= res.data.data.total_row) {
              this.hasNext = false;
            }
          } else {
            this.items = [];
          }
          this.onSearch = false;
          this.loading = false;
        })
        .catch(err => {
          let errorMess = commonFunc.handleStaffError(err);
          this.toast.error(errorMess);

          this.onSearch = false;
          this.loading = false;
        });
    },
    edit(id) {
      this.router.push('/customer-group/edit/' + id);
    },
    deleted(id, name) {
      if(id) {
        if(confirm('Xóa [' + name + "]. Bạn có chắc không?")) {
          customerManagerApi.deleteCustomerGroup(id).then(res => {
            this.filter();
            this.toast.success('Xóa thành công!!!');
          }).catch(err => {
            let errorMess = commonFunc.handleStaffError(err);
            this.toast.error('Xóa thất bại: ' + errorMess);
          });
        }
      }
    },
    formatState(state) {
      if(state == 0) {
        return "Đang đến";
      }
      if(state == 1) {
        return "Đang ở";
      }
      if(state == 2) {
        return "Đã ở";
      }
      return "";
    },
  }
};
</script>

<style lang="scss" scoped></style>
