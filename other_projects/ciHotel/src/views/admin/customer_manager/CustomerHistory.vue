<template>
  <div class="container-fluid mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 border border-blue-600 min-w-[120px]"
          @click="resetConditionSearch()">
          Reset
        </button>
      </div>

      <div class="text-center mb-4">
        <h4 class="text-xl font-semibold mt-1">LỊCH SỬ KHÁCH</h4>
      </div>
      <hr class="mb-4" />

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3">
          <label class="block mb-2">Đoàn</label>
          <select
            id="customerGroupId"
            v-model="inputs.customerGroupId"
            class="form-control w-full">
            <option :value="null">-- Tất cả --</option>
            <option v-for="option in customerGroups" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block mb-2">Tên khách</label>
          <input
            id="customerName"
            type="text"
            autocomplete="new-password"
            class="form-control w-full"
            v-model="inputs.customerName"
            maxlength="75"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block mb-2">Số điện thoại</label>
          <input
            id="phoneNumber"
            type="text"
            autocomplete="new-password"
            class="form-control w-full"
            v-model="inputs.phoneNumber"
            maxlength="75"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block mb-2">Số CMND</label>
          <input
            id="identityCardNumber"
            type="text"
            autocomplete="new-password"
            class="form-control w-full"
            v-model="inputs.identityCardNumber"
            maxlength="75"
          />
        </div>
        <div class="md:col-span-3">
          <label class="block mb-2">Trạng thái</label>
          <select
            id="state"
            v-model="inputs.state"
            class="form-control w-full">
            <option :value="null">-- Tất cả --</option>
            <option value="STAYING">Đang ở</option>
            <option value="COMMING">Đang đến</option>
            <option value="STAYED">Đã ở</option>
          </select>
        </div>
      </div>

      <div class="flex justify-center mb-4">
        <button
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 border border-green-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          :disabled="onSearch"
          @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="mb-4">
        Số kết quả: {{ totalRow }}
      </div>

      <div class="overflow-x-auto" @scroll="onScroll">
        <table class="min-w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 px-4 py-2">STT</th>
              <th class="border border-gray-300 px-4 py-2">Đoàn</th>
              <th class="border border-gray-300 px-4 py-2">Tên khách</th>
              <th class="border border-gray-300 px-4 py-2">Số điện thoại</th>
              <th class="border border-gray-300 px-4 py-2">Số CMND</th>
              <th class="border border-gray-300 px-4 py-2">Phòng</th>
              <th class="border border-gray-300 px-4 py-2">Check in</th>
              <th class="border border-gray-300 px-4 py-2">Check out</th>
              <th class="border border-gray-300 px-4 py-2">Trạng thái</th>
              <th class="border border-gray-300 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2 text-center">{{ item.stt }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.group_name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.customer_name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.phone_number }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.identity_card_number }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.room_name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ formatDate(item.check_in) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ formatDate(item.check_out) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ formatState(item.state) }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <div class="flex justify-center">
                  <button
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    @click="edit(item.id)"
                    title="Edit">
                    <i class="fa fa-edit" />
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
import { useFormatters } from '@/composables/useFormatters';

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();
    const { formatDate } = useFormatters();

    return {
      router,
      toast,
      formatDate
    };
  },
  data() {
    return {
      customerGroups: [],
      inputs: {
        customerGroupId: null,
        customerName: null,
        phoneNumber: null,
        identityCardNumber: null,
        state: null
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
    this.getListCustomerGroup();
    this.prepareToSearch();

    // Add scroll listener
    const scrollElement = document.querySelector('.overflow-x-auto');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', this.onScroll);
    }
  },
  beforeUnmount() {
    // Remove scroll listener
    const scrollElement = document.querySelector('.overflow-x-auto');
    if (scrollElement) {
      scrollElement.removeEventListener('scroll', this.onScroll);
    }
  },
  methods: {
    getListCustomerGroup() {
      customerManagerApi
        .getListCustomerGroup({})
        .then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.customerGroups = res.data.data;
          }
        })
        .catch(err => {
          let errorMess = commonFunc.handleStaffError(err);
          this.toast.error(errorMess);
        });
    },
    prepareToSearch() {
      this.offset = 0;
      this.loadByScroll = false;
      this.search();
    },
    search() {
      let params = {
        "customer_group_id": this.inputs.customerGroupId,
        "customer_name": this.inputs.customerName,
        "phone_number": this.inputs.phoneNumber,
        "identity_card_number": this.inputs.identityCardNumber,
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
        .getListCustomer(params)
        .then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            let it = res.data.data.customers;
            this.totalRow = res.data.data.total_row;

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
            } else {
              this.hasNext = true;
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
    onScroll(event) {
      let element = event.target;
      if (
        element.scrollHeight - element.scrollTop <= element.clientHeight + 100 &&
        !this.loading &&
        this.hasNext
      ) {
        this.offset += this.pageLimit;
        this.loadByScroll = true;
        this.search();
      }
    },
    edit(id) {
      this.router.push('/customer-history/edit/' + id);
    },
    resetConditionSearch() {
      this.inputs = {
        customerGroupId: null,
        customerName: null,
        phoneNumber: null,
        identityCardNumber: null,
        state: null
      };
      this.prepareToSearch();
    },
    formatState(state) {
      if (state == "STAYING") {
        return "Đang ở";
      }
      if (state == "COMMING") {
        return "Đang đến";
      }
      if (state == "STAYED") {
        return "Đã ở";
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped></style>
