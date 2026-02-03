<template>
  <div class="container-fluid mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="text-center mb-4">
        <h4 class="text-xl font-semibold mt-1 text-orange-500">{{ title }}</h4>
      </div>
      <hr class="mb-4" />

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">
            Tên đoàn <span class="text-red-600">*</span>
          </label>
        </div>
        <div class="md:col-span-9">
          <input
            id="name"
            type="text"
            autocomplete="new-password"
            :class="['form-control w-full', errorName ? 'border-red-500' : '']"
            v-model="inputs.name"
            maxlength="75"
          />
          <div v-if="errorName" class="text-red-600 text-sm mt-1">{{ errorName }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">
            Số điện thoại <span class="text-red-600">*</span>
          </label>
        </div>
        <div class="md:col-span-9">
          <input
            id="phone"
            type="text"
            autocomplete="new-password"
            :class="['form-control w-full', errorPhone ? 'border-red-500' : '']"
            v-model="inputs.phone_number"
            maxlength="75"
          />
          <div v-if="errorPhone" class="text-red-600 text-sm mt-1">{{ errorPhone }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">Mô tả</label>
        </div>
        <div class="md:col-span-9">
          <textarea
            id="note"
            v-model="inputs.note"
            class="form-control w-full"
            rows="3"
            maxlength="500"
          ></textarea>
        </div>
      </div>

      <div v-if="inputs.id" class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">Trạng thái</label>
        </div>
        <div class="md:col-span-9">
          <div class="py-2">{{ formatState(inputs.state) }}</div>
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 border border-gray-600 min-w-[120px]"
          @click="back()">
          Quay lại
        </button>
        <button
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 border border-green-600 min-w-[120px]"
          :disabled="onSave"
          @click="save()">
          Lưu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import customerManagerApi from "@/api/customerManager";
import commonFunc from "@/common/commonFunc";
import { useRouter, useRoute } from 'vue-router';
import { useToast } from '@/composables/useToast';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

    return {
      router,
      route,
      toast
    };
  },
  data() {
    return {
      title: "Thêm khách đoàn",
      inputs: {
        id: null,
        name: null,
        phone_number: null,
        note: null,
        state: 0
      },
      onSave: false
    };
  },
  computed: {
    errorName() {
      if (this.inputs.name) {
        return null;
      }
      return "Vui lòng nhập tên đoàn";
    },
    errorPhone() {
      if (this.inputs.phone_number) {
        return null;
      }
      return "Vui lòng nhập số điện thoại";
    }
  },
  mounted() {
    let id = this.route.params.id;
    if (id) {
      customerManagerApi
        .getCustomerGroupDetail(id)
        .then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.inputs = res.data.data;
            this.title = "Sửa khách đoàn";
          }
        })
        .catch(err => {
          let errorMess = commonFunc.handleStaffError(err);
          this.toast.error(errorMess);
        });
    }
  },
  methods: {
    save() {
      if (this.errorName || this.errorPhone) {
        this.toast.warning("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      this.onSave = true;

      if (this.inputs.id) {
        customerManagerApi
          .editCustomerGroup(this.inputs)
          .then(res => {
            this.toast.success("Sửa thành công!!!");
            this.back();
          })
          .catch(err => {
            let errorMess = commonFunc.handleStaffError(err);
            this.toast.error("Sửa thất bại: " + errorMess);
            this.onSave = false;
          });
      } else {
        customerManagerApi
          .addCustomerGroup(this.inputs)
          .then(res => {
            this.toast.success("Thêm thành công!!!");
            this.back();
          })
          .catch(err => {
            let errorMess = commonFunc.handleStaffError(err);
            this.toast.error("Thêm thất bại: " + errorMess);
            this.onSave = false;
          });
      }
    },
    back() {
      this.router.push("/customer-group");
    },
    formatState(state) {
      if (state == 0) {
        return "Đang đến";
      }
      if (state == 1) {
        return "Đang ở";
      }
      if (state == 2) {
        return "Đã ở";
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped></style>
