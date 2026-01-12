<template>
  <div class="container-fluid mx-auto px-4">
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
        <h4 class="text-xl font-semibold mt-1">DỊCH VỤ PHÒNG</h4>
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
            Giá <span class="text-red-600">*</span>
          </label>
        </div>
        <div class="md:col-span-9">
          <input
            id="price"
            type="text"
            autocomplete="new-password"
            :class="['form-control w-full', errorPrice ? 'border-red-500' : '']"
            v-model="inputs.price"
            maxlength="11"
            @keyup="integerOnly($event.target)"
          />
          <div v-if="errorPrice" class="text-red-600 text-sm mt-1">Vui lòng nhập value</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-3 flex items-center">
          <label class="font-medium">Nguyên liệu</label>
        </div>
        <div class="md:col-span-9">
          <button
            class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="showResourceModal = true">
            <i class="fa fa-plus" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal choose resource -->
    <div v-if="showResourceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center mb-4">
          <h5 class="text-xl font-semibold">Chọn nguyên liệu</h5>
        </div>

        <div v-show="inputs.resources.length > 0" class="mb-4">
          <p v-for="item in inputs.resources" :key="item.id" class="mb-2">
            <label v-if="item.unit">- {{ item.quantity + ' ' + item.unit + ': ' + item.name }}</label>
            <label v-if="!item.unit">- {{ item.quantity + ': ' + item.name }}</label>
            <i class="fa fa-trash ml-2 cursor-pointer text-red-600" @click="deleteResource(item.id)" />
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="font-medium">Nguyên liệu:<span class="text-red-600">*</span></label>
            <select
              class="form-control w-full mt-1"
              v-model="resource.id"
              @change="changeResource">
              <option v-for="opt in resources" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>
          <div>
            <label class="font-medium">Số lượng<span class="text-red-600">*</span></label>
            <div class="flex items-center gap-2 mt-1">
              <input
                type="text"
                autocomplete="new-password"
                class="form-control flex-1"
                v-model="resource.quantity"
                @keyup="integerOnly($event.target)"
                maxlength="11"
              />
              <label class="text-sm">{{ unitResource }}</label>
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="addGroupResource">
            Thêm
          </button>
        </div>

        <div class="text-right mt-4">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="confirmResource">
            Xác nhận
          </button>
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
        price: null,
        resources: []
      },
      resources: [{value: null, text: ''}],
      resource: {id: '', quantity: ''},
      unitResource: null,
      click: false,
      saving: false,
      loading: false,
      showResourceModal: false
    };
  },
  mounted() {
    this.getRoomServiceDetail();
    this.getResourceOptions();
  },
  computed: {
    errorName() {
      return this.checkInfo(this.inputs.name);
    },
    errorPrice() {
      return this.checkInfo(this.inputs.price);
    }
  },
  methods: {
    checkInfo(info) {
      return this.click && (info == null || info.length <= 0);
    },

    checkValidate() {
      return !(this.errorName || this.errorPrice);
    },

    getResourceOptions() {
      adminAPI.getListResourceOption().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          let items = res.data.data;
          if (items) {
            for (let i in items) {
              this.resources.push(items[i]);
            }
          }
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err);
        this.toast.error(errorMess);
      });
    },

    getRoomServiceDetail() {
      let id = this.route.params.id;
      if (id) {
        this.loading = true;

        adminAPI.getRoomServiceDetail(id).then(res => {
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

    getUnitByResourceId(id) {
      for (let index in this.resources) {
        if (this.resources[index].value == id) {
          return this.resources[index];
        }
      }
      return "";
    },

    changeResource() {
      if (this.resource.id) {
        let item = this.getUnitByResourceId(this.resource.id);
        if (item) {
          this.unitResource = item.unit;
        }
      }
    },

    checkExistResourceId(id) {
      for (let index in this.inputs.resources) {
        if (this.inputs.resources[index].id == id) {
          return true;
        }
      }
      return false;
    },

    addGroupResource() {
      if (this.resource.id && this.resource.quantity) {
        if (!this.checkExistResourceId(this.resource.id)) {
          let item = this.getUnitByResourceId(this.resource.id);
          let itemTemp = {
            id: item.value,
            name: item.text,
            quantity: this.resource.quantity,
            unit: item.unit
          };
          this.inputs.resources.push(itemTemp);

          this.resource.id = '';
          this.resource.quantity = '';
          this.unitResource = '';
        } else {
          this.toast.error('Nhập trùng nguyên liệu');
        }
      } else {
        this.toast.error('Vui lòng nhập đủ các mục yêu cầu');
      }
    },

    confirmResource() {
      this.showResourceModal = false;
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
        adminAPI.editRoomService(this.inputs).then(res => {
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
        adminAPI.addRoomService(this.inputs).then(res => {
          this.saving = false;
          if (res != null && res.data != null) {
            if (res.data.status == 200) {
              this.router.push('/room-service/list');
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

    getIndexById(id) {
      let index = 0;
      for (var i in this.inputs.resources) {
        if (this.inputs.resources[i].id == id) {
          return index;
        }
        index += 1;
      }
      return false;
    },

    deleteResource(id) {
      let indexTemp = this.getIndexById(id);

      if (indexTemp !== false) {
        this.inputs.resources.splice(indexTemp, 1);
      }
    },

    integerOnly(item) {
      let valueInput = item.value;
      let result = commonFunc.intergerOnly(valueInput);
      item.value = result;
    },

    back() {
      this.router.push('/room-service/list');
    }
  }
};
</script>

<style lang="scss" scoped></style>
