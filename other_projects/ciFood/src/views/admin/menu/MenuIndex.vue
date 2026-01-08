<template>
  <div class="container-fluid">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12">
            <button 
              class="px-4 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-50 transition-colors min-w-[120px]"
              @click="back">
              Quay lại
            </button>

            <button 
              class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px] float-right disabled:opacity-50 disabled:cursor-not-allowed"
              @click="save" 
              :disabled="saving">
              Lưu
            </button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Thực Đơn</h4>
          </div>
        </div>
        <hr class="my-4"/>

        <!-- Loading -->
        <div v-show="loading" class="flex justify-center items-center py-4">
          <svg class="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Danh mục</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="menu.group_id">
              <option v-for="option in groupMenus" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Tên <span class="text-red-500">*</span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="name"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorName }"
              v-model="menu.name">
            <div v-if="errorName" class="text-red-500 text-sm mt-1">
              Đây là mục bắt buộc nhập
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Giá <span class="text-red-500">*</span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="price"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errorPrice }"
              v-model="menu.price"
              @keyup="integerOnly($event.target)"
              maxlength="11">
            <div v-if="errorPrice" class="text-red-500 text-sm mt-1">
              Đây là mục bắt buộc nhập
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Lựa chọn</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <button 
              class="p-2 border border-gray-300 rounded hover:bg-gray-50"
              @click="showModalOption">
              <i class="fa fa-plus"/>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3"></div>
          <div class="col-span-12 md:col-span-9">
            <p class="text-sm mb-2" v-for="option in menu.options" :key="option.type + option.value">
              - Loại: {{option.type}},
              Giá trị: {{option.value}},
              <span v-show="option.price">Giá thêm: {{formatCurrency(option.price)}}vnđ,</span>
              Mặc định: {{option.default == "true"? 'Đúng': 'Không'}}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Topping</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <button 
              class="p-2 border border-gray-300 rounded hover:bg-gray-50"
              @click="showModalTopping">
              <i class="fa fa-plus"/>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3"></div>
          <div class="col-span-12 md:col-span-9">
            <p class="text-sm mb-2" v-for="(topping, index) in menu.toppings" :key="topping.name">
              <label>- {{ toppings[index]?.name }}   +{{formatCurrency(toppings[index]?.price)}}</label>
            </p>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Nguyên liệu</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <button 
              class="p-2 border border-gray-300 rounded hover:bg-gray-50"
              @click="showModalResource">
              <i class="fa fa-plus"/>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3"></div>
          <div class="col-span-12 md:col-span-9">
            <p class="text-sm mb-2" v-for="item in resourceChosen" :key="item.id">
              <label v-if="item.unit">- {{item.quantity + ' ' + item.unit + ': ' + item.name}}</label>
              <label v-if="!item.unit">- {{item.quantity + ': ' + item.name}}</label>
            </p>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Cho phép sửa giá</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="menu.can_edit_price" name="canEditPrice" :value="false" class="mr-2">
                Không
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="menu.can_edit_price" name="canEditPrice" :value="true" class="mr-2">
                Có
              </label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Cho phép sửa số lượng</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="menu.can_edit_quantity" name="canEditQuantity" :value="false" class="mr-2">
                Không
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="menu.can_edit_quantity" name="canEditQuantity" :value="true" class="mr-2">
                Có
              </label>
            </div>
          </div>
        </div>

        <div v-show="kitchenAreas.length > 0" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Khu vực in</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="menu.kitchen_area_id">
              <option v-for="option in kitchenAreas" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <div v-if="route.params.id" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Trạng thái <span class="text-red-500">*</span></label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <select
              id="status"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="menu.status">
              <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Thứ tự xuất hiện trên menu</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <input
              id="index"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="menu.index"
              @keyup="integerOnly($event.target)"
              maxlength="4">
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12 md:col-span-3 flex items-center">
            <label class="font-medium">Hình ảnh</label>
          </div>
          <div class="col-span-12 md:col-span-9">
            <div class="flex cursor-pointer" @click="$refs.fileInput.click()">
              <input 
                v-model="menu.image" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readonly
              >
              <button 
                type="button"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300">
                Browse
              </button>
            </div>
            <input 
              class="hidden" 
              type="file" 
              id="file" 
              ref="fileInput" 
              accept="image/*" 
              @change="handleFileUpload"
            />
          </div>
        </div>

        <div v-if="menu.image_preview" class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-12">
            <div class="preview-box text-center" :style="{height: computedWidth, width: '100%'}">
              <vue-cropper
                ref="cropper"
                :guides="true"
                :view-mode="2"
                :center="true"
                drag-mode="crop"
                :auto-crop-area="1"
                :background="true"
                :rotatable="true"
                :src="menu.image_preview"
                :initialAspectRatio="1/1"
                :aspectRatio="1/1"
                alt="Source Image"
                :style="computedImg"
                :crop="cropImage"
              >
              </vue-cropper>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal choose option -->
    <TransitionRoot appear :show="isOptionModalOpen" as="template">
      <Dialog as="div" @close="confirmOption" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
                  Thêm lựa chọn
                </DialogTitle>

                <div class="mb-4">
                  <p class="text-sm mb-2" v-for="option in menu.options" :key="option.type + option.value">
                    - Loại: {{option.type}},
                    Giá trị: {{option.value}},
                    <span v-show="option.price">Giá thêm: {{formatCurrency(option.price)}}vnđ,</span>
                    Mặc định: {{option.default == "true"? 'Đúng': 'Không'}}
                    <button class="ml-2 text-red-600 hover:text-red-800" @click="deleteOption(option.type, option.value, option.price)">
                      <i class="fa fa-trash" />
                    </button>
                  </p>
                </div>

                <div class="mb-4">
                  <label class="block mb-2 font-medium">Loại</label>
                  <input
                    id="optionType"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxlength="100">
                </div>

                <div class="mb-4">
                  <label class="block mb-2 font-medium">Giá trị</label>
                  <input
                    id="optionValue"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxlength="100">
                </div>

                <div class="mb-4">
                  <label class="block mb-2 font-medium">Giá thêm</label>
                  <input
                    id="optionPrice"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxlength="11"
                    @keyup="integerOnly($event.target)"
                  >
                </div>

                <div class="mb-4">
                  <label class="block mb-2 font-medium">Mặc định</label>
                  <div class="flex items-center space-x-4">
                    <label class="flex items-center">
                      <input type="radio" v-model="optionDefault" name="default" value="true" class="mr-2">
                      Đúng
                    </label>
                    <label class="flex items-center">
                      <input type="radio" v-model="optionDefault" name="default" value="false" class="mr-2">
                      Không
                    </label>
                  </div>
                </div>

                <div class="text-center mb-4">
                  <button 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                    @click="addNewRowChooseOption">
                    Thêm
                  </button>
                </div>

                <div class="flex justify-end">
                  <button 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                    @click="confirmOption">
                    Xác nhận
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal choose topping -->
    <TransitionRoot appear :show="isToppingModalOpen" as="template">
      <Dialog as="div" @close="confirmTopping" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
                  Chọn topping
                </DialogTitle>

                <div class="mb-4">
                  <div v-for="topping in toppings" :key="topping.name" class="mb-2">
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        v-model="menu.toppings" 
                        name="toppingName" 
                        :value="topping.id"
                        class="mr-2">
                      {{ topping.name }}   +{{formatCurrency(topping.price)}}
                    </label>
                  </div>
                </div>

                <div class="flex justify-end">
                  <button 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                    @click="confirmTopping">
                    Xác nhận
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal choose resource -->
    <TransitionRoot appear :show="isResourceModalOpen" as="template">
      <Dialog as="div" @close="confirmResource" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
                  Chọn nguyên liệu
                </DialogTitle>

                <div v-show="resourceChosen.length > 0" class="mb-4">
                  <p class="text-sm mb-2" v-for="item in resourceChosen" :key="item.id">
                    <label v-if="item.unit">- {{item.quantity + ' ' + item.unit + ': ' + item.name}}</label>
                    <label v-if="!item.unit">- {{item.quantity + ': ' + item.name}}</label>
                    <button class="ml-2 text-red-600 hover:text-red-800" @click="deleteResource(item.id)">
                      <i class="fa fa-trash"/>
                    </button>
                  </p>
                </div>

                <div class="mb-4">
                  <label class="block mb-2 font-medium">Nguyên liệu: <span class="text-red-500">*</span></label>
                  <select
                    type="text"
                    autocomplete="new-password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="resource.id"
                    @change="changeResource">
                    <option v-for="option in resources" :key="option.value" :value="option.value">{{ option.text }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="block mb-2 font-medium">Số lượng <span class="text-red-500">*</span></label>
                  <div class="flex items-center">
                    <input
                      type="text"
                      autocomplete="new-password"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      v-model="resource.quantity"
                      @keyup="integerOnly($event.target)"
                      maxlength="11">
                    <label class="ml-2">{{unitResource}}</label>
                  </div>
                </div>

                <div class="text-center mb-4">
                  <button 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                    @click="addGroupResource">
                    Thêm
                  </button>
                </div>

                <div class="flex justify-end">
                  <button 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                    @click="confirmResource">
                    Xác nhận
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import adminAPI from '@/api/admin'
import GMMapper from '@/mapper/group_menu'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const { formatCurrency } = useFormatters()

const options = ref([
  {value: 'true', text: 'Còn món'},
  {value: 'false', text: 'Hết món'}
])

const menu = ref({
  id: null,
  name: null,
  price: null,
  status: null,
  options: [],
  toppings: [],
  group_id: null,
  can_edit_price: false,
  can_edit_quantity: false,
  kitchen_area_id: null,
  index: null,
  image: null,
  image_preview: null,
})

const file = ref(null)
const fileInput = ref(null)
const cropper = ref(null)
const height = ref('100px')
const styleImg = ref({})
const saving = ref(false)
const click = ref(false)
const groupMenus = ref([])
const toppings = ref([])
const kitchenAreas = ref([])
const optionDefault = ref("false")
const loading = ref(false)
const resources = ref([{value: null, text: ''}])
const resource = ref({id: '', quantity: ''})
const unitResource = ref(null)
const resourceChosen = ref([])

const isOptionModalOpen = ref(false)
const isToppingModalOpen = ref(false)
const isResourceModalOpen = ref(false)

const computedWidth = computed(() => height.value)
const computedImg = computed(() => styleImg.value)

const errorName = computed(() => {
  return checkInfo(menu.value.name)
})

const errorPrice = computed(() => {
  return checkInfo(menu.value.price)
})

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorName.value || errorPrice.value)
}

/**
 * Load list option group menu
 */
const getGroupMenuOptions = async () => {
  try {
    const res = await adminAPI.getListGroupMenuOption()
    if (res != null && res.data != null && res.data.data != null) {
      groupMenus.value = GMMapper.mapGroupMenuOptionModelToDto(res.data.data)
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

/**
 * Load list option resource
 */
const getResourceOptions = async () => {
  try {
    const res = await adminAPI.getListResourceOption()
    if (res != null && res.data != null && res.data.data != null) {
      const items = res.data.data
      if (items) {
        for (let i in items) {
          resources.value.push(items[i])
        }
      }
    }
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

/**
 * Get list topping
 */
const getTopping = async () => {
  try {
    const res = await adminAPI.getTopping()
    toppings.value = res.data.data
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

/**
 * Get kitchen area
 */
const getKitchenArea = async () => {
  try {
    const res = await adminAPI.getKitchenArea()
    const items = res.data.data
    const opts = []
    for (let index in items) {
      const item = {
        value: items[index].id,
        text: items[index].name
      }
      opts.push(item)
    }
    kitchenAreas.value = opts
  } catch (err) {
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

/**
 * Get menu detail
 */
const getMenuDetail = async () => {
  const menuId = route.params.id
  if (menuId) {
    loading.value = true

    try {
      const res = await adminAPI.getMenuDetail(menuId)
      if (res != null && res.data != null && res.data.data != null) {
        menu.value = res.data.data
        file.value = menu.value.image_preview
        resourceChosen.value = menu.value.resource
      }
      loading.value = false
    } catch (err) {
      loading.value = false
      const errorMess = commonFunc.handleStaffError(err)
      showToast(errorMess, 'danger')
    }
  }
}

/**
 * Handle upload file
 */
const handleFileUpload = () => {
  menu.value.image_preview = null
  file.value = fileInput.value.files[0]
  menu.value.image = file.value.name

  // Render image in review
  const reader = new FileReader()
  reader.addEventListener("load", function () {
    menu.value.image_preview = reader.result
  }, false)
  
  if (file.value) {
    reader.readAsDataURL(file.value)
    height.value = '300px'
    styleImg.value = {'max-width': '100%', 'max-height': '100%'}
  }
}

/**
 * Prepare info to save
 */
const save = () => {
  click.value = true
  const result = checkValidate()
  if (result) {
    if (menu.value.image_preview) {
      cropper.value
        .getCroppedCanvas({
          width: 300,
          height: 300
        })
        .toBlob(blob => {
          const formData = new FormData()
          formData.append("file", blob, menu.value.image)
          formData.append("name", menu.value.name)
          formData.append("price", menu.value.price)
          formData.append("options", JSON.stringify(menu.value.options))
          formData.append("toppings", menu.value.toppings)
          formData.append("group", menu.value.group_id)
          formData.append("quantity", menu.value.quantity)
          formData.append("resource", JSON.stringify(resourceChosen.value))
          formData.append("can_edit_price", menu.value.can_edit_price)
          formData.append("can_edit_quantity", menu.value.can_edit_quantity)
          formData.append("index", menu.value.index)
          formData.append("kitchen_area_id", menu.value.kitchen_area_id)

          doSave(formData)
        })
    } else {
      const formData = new FormData()
      formData.append("file", null)
      formData.append("name", menu.value.name)
      formData.append("price", menu.value.price)
      formData.append("options", JSON.stringify(menu.value.options))
      formData.append("toppings", menu.value.toppings)
      formData.append("group", menu.value.group_id)
      formData.append("quantity", menu.value.quantity)
      formData.append("resource", JSON.stringify(resourceChosen.value))
      formData.append("can_edit_price", menu.value.can_edit_price)
      formData.append("can_edit_quantity", menu.value.can_edit_quantity)
      formData.append("index", menu.value.index)
      formData.append("kitchen_area_id", menu.value.kitchen_area_id)

      doSave(formData)
    }
  }
}

/**
 * Call api, save data
 */
const doSave = async (formData) => {
  saving.value = true
  const menuId = route.params.id
  
  try {
    if (menuId) {
      // Edit
      formData.append("status", menu.value.status)
      formData.append("id", menuId)

      const res = await adminAPI.editMenu(formData)
      saving.value = false
      if (res != null && res.data != null) {
        showToast('Lưu menu thành công!!! ', 'success')
      } else {
        showToast('Lưu menu thất bại!!! ', 'danger')
      }
    } else {
      // Add
      const res = await adminAPI.addMenu(formData)
      saving.value = false
      if (res != null && res.data != null) {
        router.push('/menu/list')
      } else {
        showToast('Lưu menu thất bại!!! ', 'danger')
      }
    }
  } catch (err) {
    saving.value = false
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

/**
 * Show modal choose option
 */
const showModalOption = () => {
  isOptionModalOpen.value = true
}

/**
 * Show modal choose topping
 */
const showModalTopping = () => {
  isToppingModalOpen.value = true
}

/**
 * Show modal choose resource
 */
const showModalResource = () => {
  isResourceModalOpen.value = true
}

/**
 * Add new row choose option
 */
const addNewRowChooseOption = () => {
  const optionType = document.getElementById("optionType").value.trim()
  const optionValue = document.getElementById("optionValue").value.trim()
  const optionPrice = document.getElementById("optionPrice").value.trim()
  const optionDef = JSON.parse(JSON.stringify(optionDefault.value))

  const option = {
    type: optionType,
    value: optionValue,
    price: optionPrice,
    default: optionDef
  }
  menu.value.options.push(option)

  document.getElementById("optionType").value = ""
  document.getElementById("optionValue").value = ""
  document.getElementById("optionPrice").value = ""
  optionDefault.value = "false"
}

/**
 * Delete option
 */
const deleteOption = (type, value, price) => {
  let index = 0
  for (const i in menu.value.options) {
    if (menu.value.options[i].type == type && menu.value.options[i].value == value && menu.value.options[i].price == price) {
      menu.value.options.splice(index, 1)
    }
    index += 1
  }
}

/**
 * Confirm option
 */
const confirmOption = () => {
  isOptionModalOpen.value = false
}

/**
 * Confirm topping
 */
const confirmTopping = () => {
  isToppingModalOpen.value = false
}

/**
 * Event crop image
 */
const cropImage = () => {
  // Use to check reupload image when edit
}

/**
 * Back to list
 */
const back = () => {
  router.push('/menu/list')
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  const valueInput = item.value
  const result = commonFunc.intergerOnly(valueInput)
  item.value = result
}

/**
 * Get unit by resource id
 */
const getUnitByResourceId = (id) => {
  for (const index in resources.value) {
    if (resources.value[index].value == id) {
      return resources.value[index]
    }
  }
  return ""
}

/**
 * Event change resource
 */
const changeResource = () => {
  if (resource.value.id) {
    const item = getUnitByResourceId(resource.value.id)
    if (item) {
      unitResource.value = item.unit
    }
  }
}

/**
 * Check exist resource id
 */
const checkExistResourceId = (id) => {
  for (const index in resourceChosen.value) {
    if (resourceChosen.value[index].id == id) {
      return true
    }
  }
  return false
}

/**
 * Add group resource
 */
const addGroupResource = () => {
  if (resource.value.id && resource.value.quantity) {
    // Check exist resource id
    if (!checkExistResourceId(resource.value.id)) {
      const item = getUnitByResourceId(resource.value.id)
      const itemTemp = {
        id: item.value,
        name: item.text,
        quantity: resource.value.quantity,
        unit: item.unit
      }
      resourceChosen.value.push(itemTemp)

      // Reset value
      resource.value.id = ''
      resource.value.quantity = ''
      unitResource.value = ''
    } else {
      showToast('Nhập trùng nguyên liệu', 'danger')
    }
  } else {
    showToast('Vui lòng nhập đủ các mục yêu cầu', 'danger')
  }
}

/**
 * Confirm resource
 */
const confirmResource = () => {
  isResourceModalOpen.value = false
}

/**
 * Get index by id
 */
const getIndexById = (id) => {
  let index = 0
  for (const i in resourceChosen.value) {
    if (resourceChosen.value[i].id == id) {
      return index
    }
    index += 1
  }
  return false
}

/**
 * Remove resource
 */
const deleteResource = (id) => {
  // Get index pmt by id
  const indexTemp = getIndexById(id)

  if (indexTemp !== false) {
    resourceChosen.value.splice(indexTemp, 1)
  }
}

onMounted(() => {
  getGroupMenuOptions()
  getTopping()
  getKitchenArea()
  getResourceOptions()
  getMenuDetail()
})
</script>

<style lang="scss" scoped>
.width-33 {
  width: 31%;
  float: left;
}
</style>
