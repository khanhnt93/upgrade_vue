<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between mb-4">
        <button 
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 border border-gray-600 min-w-[120px]"
          @click="back">
          Quay lại
        </button>
        <button 
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 border border-green-600 min-w-[120px]"
          @click="save" 
          :disabled="saving">
          Lưu
        </button>
      </div>

      <div class="text-center mb-4">
        <h4 class="text-xl font-semibold mt-1">THÔNG TIN PHÒNG</h4>
      </div>
      <hr class="mb-4" />

      <!-- Loading -->
      <div v-show="loading" class="text-center py-4">
        <icon name="loading" width="60" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">
            Tên <span class="text-red-600">*</span>
          </label>
        </div>
        <div class="md:col-span-9">
          <input
            id="name"
            type="text"
            autocomplete="new-password"
            :class="['form-control w-full', errorName ? 'border-red-500' : '']"
            v-model="inputs.name"
            maxlength="255"
          />
          <div v-if="errorName" class="text-red-600 text-sm mt-1">Vui lòng nhập tên</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">
            Loại <span class="text-red-600">*</span>
          </label>
        </div>
        <div class="md:col-span-9">
          <input
            id="value"
            type="text"
            autocomplete="new-password"
            :class="['form-control w-full', errorValue ? 'border-red-500' : '']"
            v-model="inputs.value"
            maxlength="255"
          />
          <div v-if="errorValue" class="text-red-600 text-sm mt-1">Vui lòng nhập value</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin';
import commonFunc from '@/common/commonFunc';
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
      inputs: {
        id: null,
        name: null,
        value: null
      },
      click: false,
      saving: false,
      loading: false
    };
  },
  mounted() {
    this.getRoomTypeInfoDetail();
  },
  computed: {
    errorName() {
      return this.checkInfo(this.inputs.name);
    },
    errorValue() {
      return this.checkInfo(this.inputs.value);
    }
  },
  methods: {
    checkInfo(info) {
      return this.click && (info == null || info.length <= 0);
    },
    
    checkValidate() {
      return !(this.errorName || this.errorValue);
    },

    getRoomTypeInfoDetail() {
      let id = this.route.params.id;
      if (id) {
        this.loading = true;

        adminAPI.getRoomTypeInfoDetail(id).then(res => {
          if (res != null && res.data != null && res.data.data != null) {
            this.inputs = res.data.data;
          }

          this.loading = false;
        }).catch(err => {
          this.loading = false;

          let errorMess = commonFunc.handleStaffError(err);
          this.toast.error(errorMess);
        });
      }
    },

    save() {
      this.click = true;
      this.saving = true;

      if (!this.checkValidate()) {
        this.saving = false;
        return;
      }

      let id = this.route.params.id;
      if (id) {
        // Edit
        this.inputs.id = id;
        adminAPI.editRoomTypeInfo(this.inputs).then(res => {
          this.saving = false;
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              this.toast.success('Cập nhật tầng thành công!!!');
            }
          }
        }).catch(err => {
          this.saving = false;
          let message = "";
          if (err.response.data.status == 422) {
            message = err.response.data.mess;
          } else {
            message = "Lỗi hệ thống";
          }
          this.toast.error('Cập nhật thất bại: ' + message);
        });
      } else {
        // Add
        adminAPI.addRoomTypeInfo(this.inputs).then(res => {
          this.saving = false;
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              this.router.push('/room-type-info/list');
            }
          }
        }).catch(err => {
          this.saving = false;
          let message = "";
          if (err.response.data.status == 422) {
            message = err.response.data.mess;
          } else {
            message = "Lỗi hệ thống";
          }
          this.toast.error('Tạo mới thất bại: ' + message);
        });
      }
    },

    back() {
      this.router.push('/room-type-info/list');
    }
  }
};
</script>

<style lang="scss" scoped></style>
