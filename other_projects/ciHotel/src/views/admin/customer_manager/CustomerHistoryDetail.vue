<template>
  <div class="container-fluid mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="text-center mb-4">
        <h4 class="text-xl font-semibold mt-1">Sửa lịch sử khách</h4>
      </div>
      <hr class="mb-4" />

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">Đoàn</label>
        </div>
        <div class="md:col-span-9">
          <select
            id="customerGroupId"
            v-model="inputs.customer_group_id"
            class="form-control w-full">
            <option :value="null">-- Chọn đoàn --</option>
            <option v-for="option in customerGroups" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">
            Tên khách <span class="text-red-600">*</span>
          </label>
        </div>
        <div class="md:col-span-9">
          <input
            id="customerName"
            type="text"
            autocomplete="new-password"
            :class="['form-control w-full', errorName ? 'border-red-500' : '']"
            v-model="inputs.customer_name"
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
            id="phoneNumber"
            type="text"
            autocomplete="new-password"
            :class="['form-control w-full', errorPhoneNumber ? 'border-red-500' : '']"
            v-model="inputs.phone_number"
            maxlength="75"
          />
          <div v-if="errorPhoneNumber" class="text-red-600 text-sm mt-1">{{ errorPhoneNumber }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">Số CMND</label>
        </div>
        <div class="md:col-span-9">
          <input
            id="identityCardNumber"
            type="text"
            autocomplete="new-password"
            class="form-control w-full"
            v-model="inputs.identity_card_number"
            maxlength="75"
          />
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
      customerGroups: [],
      inputs: {
        id: null,
        customer_group_id: null,
        customer_name: null,
        phone_number: null,
        identity_card_number: null
      },
      onSave: false
    };
  },
  computed: {
    errorName() {
      if (this.inputs.customer_name) {
        return null;
      }
      return "Vui lòng nhập tên khách";
    },
    errorPhoneNumber() {
      if (this.inputs.phone_number) {
        return null;
      }
      return "Vui lòng nhập số điện thoại";
    }
  },
  mounted() {
    // Load customer groups dropdown
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

    // Load customer detail if editing
    let id = this.route.params.id;
    if (id) {
      customerManagerApi
        .getCustomerDetail(id)
        .then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.inputs = res.data.data;
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
      if (this.errorName || this.errorPhoneNumber) {
        this.toast.warning("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      this.onSave = true;

      if (this.inputs.id) {
        customerManagerApi
          .editCustomer(this.inputs)
          .then(res => {
            this.toast.success("Sửa thành công!!!");
            this.back();
          })
          .catch(err => {
            let errorMess = commonFunc.handleStaffError(err);
            this.toast.error("Sửa thất bại: " + errorMess);
            this.onSave = false;
          });
      }
    },
    back() {
      this.router.push("/customer-history");
    }
  }
};
</script>

<style lang="scss" scoped></style>
