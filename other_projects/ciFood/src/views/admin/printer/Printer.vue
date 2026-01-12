<template>
  <div class="container">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button
            class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving"
            @click="save">
            Lưu
          </button>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <h4 class="mt-2 text-center text-2xl font-semibold">Máy In</h4>
          </div>
        </div>

        <!-- Custom Tabs -->
        <div class="mt-6">
          <!-- Tab Headers -->
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px space-x-8">
              <button
                @click="activeTab = 'settings'"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
                Cài đặt
              </button>
              <button
                @click="activeTab = 'template'"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'template'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
                Mẫu in
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="mt-6">
            <!-- Settings Tab -->
            <div v-show="activeTab === 'settings'">
              <h4 class="text-lg font-semibold mb-4">Máy in bill</h4>

              <div class="grid grid-cols-12 gap-4 mb-4">
                <div class="col-span-12 md:col-span-3">
                  <label class="block mb-2 font-medium">Kích thước máy in:</label>
                </div>
                <div class="col-span-12 md:col-span-9">
                  <select
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="printer.bill_size">
                    <option v-for="option in printerSize" :key="option.value" :value="option.value">{{ option.text }}</option>
                  </select>
                </div>

                <div class="col-span-12 md:col-span-3">
                  <label class="block mb-2 font-medium">Cỡ chữ:</label>
                </div>
                <div class="col-span-12 md:col-span-9">
                  <select
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="printer.bill_font_size">
                    <option v-for="option in fontSize" :key="option.value" :value="option.value">{{ option.text }}</option>
                  </select>
                </div>

                <div class="col-span-12 md:col-span-3">
                  <label class="block mb-2 font-medium">Font chữ:</label>
                </div>
                <div class="col-span-12 md:col-span-9">
                  <select
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="printer.bill_font">
                    <option v-for="option in font" :key="option.value" :value="option.value">{{ option.text }}</option>
                  </select>
                </div>
              </div>

              <hr class="my-6"/>
              <h4 class="text-lg font-semibold mb-4">Máy in bếp</h4>

              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-3">
                  <label class="block mb-2 font-medium">Kích thước máy in:</label>
                </div>
                <div class="col-span-12 md:col-span-9">
                  <select
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="printer.kitchen_size">
                    <option v-for="option in printerSize" :key="option.value" :value="option.value">{{ option.text }}</option>
                  </select>
                </div>

                <div class="col-span-12 md:col-span-3">
                  <label class="block mb-2 font-medium">Cỡ chữ:</label>
                </div>
                <div class="col-span-12 md:col-span-9">
                  <select
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="printer.kitchen_font_size">
                    <option v-for="option in fontSize" :key="option.value" :value="option.value">{{ option.text }}</option>
                  </select>
                </div>

                <div class="col-span-12 md:col-span-3">
                  <label class="block mb-2 font-medium">Font chữ:</label>
                </div>
                <div class="col-span-12 md:col-span-9">
                  <select
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="printer.kitchen_font">
                    <option v-for="option in font" :key="option.value" :value="option.value">{{ option.text }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Template Tab -->
            <div v-show="activeTab === 'template'">
              <div class="overflow-x-auto">
                <div class="ticket-printer bg-white p-4 border">
                  <h3 class="text-center font-bold">{{store.name}}</h3>
                  <p class="text-center">{{store.address}}</p>
                  <p class="text-center">{{store.phone_number}}</p>
                  <br>
                  <p class="text-center">
                    <input
                      class="text-center font-h4 border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
                      type="text"
                      v-model="printer.template.title"/>
                  </p>
                  <p class="text-center">Số hóa đơn: 001:00000001</p>

                  <div class="clearfix">
                    <div class="width-50">Bàn: 01</div>
                    <div class="width-50 text-right">Ngày: {{store.bill_date}}</div>
                  </div>

                  <div class="clearfix">
                    <div class="width-50">Nhân viên: {{store.staff_name}}</div>
                    <div class="width-50 text-right">Giờ: {{store.bill_time}}</div>
                  </div>

                  <div class="clearfix border-t border-b">
                    <div class="width-40 border-r">Tên hàng</div>
                    <div class="width-10 text-center border-r">SL</div>
                    <div class="width-25 text-center border-r">Đơn giá</div>
                    <div class="width-25 text-center">Thành tiền</div>
                  </div>

                  <div class="clearfix py-1">
                    <div class="width-40">Cafe sữa đá</div>
                    <div class="width-10 text-center">2</div>
                    <div class="width-25 text-right">15,000</div>
                    <div class="width-25 text-right">30,000</div>
                  </div>

                  <div class="clearfix py-1">
                    <div class="width-40">Yaourt trái cây</div>
                    <div class="width-10 text-center">1</div>
                    <div class="width-25 text-right">32,000</div>
                    <div class="width-25 text-right">32,000</div>
                  </div>

                  <div class="clearfix py-1">
                    <div class="width-40">Soda chanh muối + xí muội</div>
                    <div class="width-10 text-center">1</div>
                    <div class="width-25 text-right">25,000</div>
                    <div class="width-25 text-right">25,000</div>
                  </div>

                  <div class="clearfix border-t pt-2">
                    <div class="width-50 text-right">Tổng cộng:</div>
                    <div class="width-50 text-right">87,000</div>
                  </div>

                  <div class="clearfix">
                    <div class="width-100">1 x Giảm giá 50% cho hóa đơn từ 50k, tối đa 15k</div>
                  </div>

                  <div class="clearfix border-t pt-2">
                    <div class="width-50 text-right">Tổng giảm giá:</div>
                    <div class="width-50 text-right">-15,000</div>
                  </div>

                  <div class="clearfix">
                    <div class="width-100">Tổ chức sinh nhật</div>
                  </div>

                  <div class="clearfix border-t pt-2">
                    <div class="width-50 text-right">Tổng phí:</div>
                    <div class="width-50 text-right">120,000</div>
                  </div>

                  <div class="clearfix">
                    <div class="width-50 text-right">Thuế VAT:</div>
                    <div class="width-50 text-right">+7,200</div>
                  </div>

                  <div class="clearfix">
                    <div class="width-50 text-right">Thành tiền:</div>
                    <div class="width-50 text-right">199,200</div>
                  </div>

                  <p>Vào: {{store.time_in}}</p>
                  <p>Ra:&nbsp;&nbsp;&nbsp;{{store.time_out}}</p>
                  <p>Tiền khách đưa: 200,000đ</p>
                  <p>Tiền trả khách: 800đ</p>
                  <p class="text-center mb-5">
                    <input
                      class="text-center width-100 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      type="text"
                      v-model="printer.template.footer"/>
                  </p>

                  <div v-for="(item, index) in bonusItem" :key="index" class="clearfix">
                    <p v-if="item.type === 'text'" :class="'text-' + item.align">{{item.textValue}}</p>
                    <img v-if="item.type === 'image'" :src="item.image_preview" class="w-full h-auto">
                  </div>

                  <div v-show="bonusItem.length > 0" class="text-center mt-4">
                    <button
                      @click="deleteBonusTemplate"
                      class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                      Xóa mục thêm trên mẫu in
                    </button>
                  </div>

                  <div class="border rounded-lg p-4 mt-5">
                    <div class="text-center font-semibold mb-4">
                      Thêm mục vào mẫu in
                    </div>

                    <div class="mb-4">
                      <label class="block mb-2 font-medium">Loại</label>
                      <div class="flex items-center space-x-4">
                        <label class="inline-flex items-center">
                          <input
                            type="radio"
                            class="form-radio h-4 w-4 text-blue-600"
                            value="text"
                            v-model="bonusTemplate.type"
                            @click="choseTemplateType">
                          <span class="ml-2">Chữ</span>
                        </label>
                        <label class="inline-flex items-center">
                          <input
                            type="radio"
                            class="form-radio h-4 w-4 text-blue-600"
                            value="image"
                            v-model="bonusTemplate.type"
                            @click="choseTemplateType">
                          <span class="ml-2">Hình ảnh</span>
                        </label>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="block mb-2 font-medium">Căn</label>
                      <div class="flex items-center space-x-4">
                        <label class="inline-flex items-center">
                          <input
                            type="radio"
                            class="form-radio h-4 w-4 text-blue-600"
                            value="left"
                            v-model="bonusTemplate.align">
                          <span class="ml-2">Trái</span>
                        </label>
                        <label class="inline-flex items-center">
                          <input
                            type="radio"
                            class="form-radio h-4 w-4 text-blue-600"
                            value="center"
                            v-model="bonusTemplate.align">
                          <span class="ml-2">Giữa</span>
                        </label>
                        <label class="inline-flex items-center">
                          <input
                            type="radio"
                            class="form-radio h-4 w-4 text-blue-600"
                            value="right"
                            v-model="bonusTemplate.align">
                          <span class="ml-2">Phải</span>
                        </label>
                      </div>
                    </div>

                    <div v-show="bonusTemplate.type === 'text'" class="mb-4">
                      <input
                        :class="'text-' + bonusTemplate.align + ' width-100 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'"
                        type="text"
                        v-model="bonusTemplate.textValue"/>
                    </div>

                    <div v-show="bonusTemplate.type === 'image'" class="mb-4">
                      <div class="flex items-center space-x-2">
                        <input
                          type="text"
                          readonly
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          v-model="bonusTemplate.imageValue">
                        <button
                          type="button"
                          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                          @click="$refs.file.click()">
                          Browse
                        </button>
                      </div>
                      <input
                        class="hidden"
                        type="file"
                        ref="file"
                        accept="image/*"
                        @change="handleFileUpload"/>
                    </div>

                    <div v-show="bonusTemplate.image_preview" class="mb-4">
                      <img :src="bonusTemplate.image_preview" class="w-full h-auto">
                    </div>

                    <div class="text-center">
                      <button
                        @click="addBonusTemplate"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Thêm vào mẫu in
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const activeTab = ref('settings')
const id = ref(null)
const printer = ref({
  bill_size: 80,
  bill_font_size: 16,
  bill_font: "Times New Roman",
  kitchen_size: 80,
  kitchen_font_size: 16,
  kitchen_font: "Times New Roman",
  template: {
    title: "Hóa đơn thanh toán",
    footer: "Cảm ơn quý khách và hẹn gặp lại!"
  }
})

const printerSize = ref([
  {value: 57, text: '5.7'},
  {value: 58, text: '5.8'},
  {value: 75, text: '7.5'},
  {value: 80, text: '8.0'},
])

const fontSize = ref([
  {value: 0.75, text: '12'},
  {value: 0.8125, text: '13'},
  {value: 0.875, text: '14'},
  {value: 0.9375, text: '15'},
  {value: 1, text: '16'},
  {value: 1.0625, text: '17'},
  {value: 1.125, text: '18'},
  {value: 1.1875, text: '19'},
  {value: 1.25, text: '20'},
  {value: 1.3125, text: '21'},
  {value: 1.375, text: '22'},
  {value: 1.4375, text: '23'},
  {value: 1.5, text: '24'},
])

const font = ref([
  {value: 'Times New Roman', text: 'Times New Roman'},
  {value: 'Arial', text: 'Arial'}
])

const store = ref({
  name: "Tên Cửa Hàng",
  address: "99 Cộng Hòa, p.13, q.Tân Bình, HCM ",
  phone_number: "(028) 345 345 345",
  bill_date: "05-09-2020",
  staff_name: "Thu Ngân",
  bill_time: "09:30",
  time_in: "07:15 05-09-2020",
  time_out: "09:30 05-09-2020"
})

const saving = ref(false)
const bonusTemplate = ref({
  type: "text",
  align: "center",
  textValue: "",
  imageValue: "",
  image_preview: null
})
const bonusItem = ref([])
const file = ref(null)

const getPrinterInfo = async () => {
  try {
    const res = await adminAPI.getPrinterInfo()
    if (res != null && res.data != null && res.data.data != null) {
      id.value = res.data.data.id
      printer.value = res.data.data.printer
      bonusItem.value = printer.value.template.bonusItem || []
    }
  } catch (err) {
    console.log(err)
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

const save = async () => {
  saving.value = true
  printer.value.template.bonusItem = bonusItem.value

  try {
    const res = await adminAPI.savePrinterInfo({"id": id.value, "params": printer.value})
    if (res != null && res.data != null) {
      showToast('Lưu thông tin máy in thành công!!!', 'success')
    }
    saving.value = false
  } catch (err) {
    saving.value = false
    const errorMess = commonFunc.handleStaffError(err)
    showToast(errorMess, 'danger')
  }
}

const addBonusTemplate = async () => {
  const itemTemp = JSON.parse(JSON.stringify(bonusTemplate.value))
  bonusItem.value.push(itemTemp)

  // Call api upload image
  if (bonusTemplate.value.imageValue) {
    const formData = new FormData()
    formData.append("image", file.value)

    try {
      const res = await adminAPI.uploadImagePrinter(formData)
      if (res != null && res.data != null) {
        if (res.data.status === 200) {
          bonusItem.value[bonusItem.value.length-1].image_preview = res.data.data
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  bonusTemplate.value.type = 'text'
  bonusTemplate.value.textValue = ""
  bonusTemplate.value.imageValue = ""
  bonusTemplate.value.image_preview = null
}

const deleteBonusTemplate = async () => {
  const items = JSON.parse(JSON.stringify(bonusItem.value))
  bonusItem.value = []

  // Call api to delete images
  for (let index in items) {
    if (items[index].image_preview) {
      try {
        const res = await adminAPI.deleteImagePrinter(items)
        if (res != null && res.data != null) {
          showToast('Xóa phần thêm của mẫu in thành công', 'success')
        }
      } catch (err) {
        console.log(err)
      }
      break
    }
  }
}

const handleFileUpload = () => {
  bonusTemplate.value.image_preview = null
  const fileInput = document.querySelector('input[type="file"]')
  file.value = fileInput.files[0]
  bonusTemplate.value.imageValue = file.value.name

  // Render image in preview
  const reader = new FileReader()
  reader.addEventListener("load", function () {
    bonusTemplate.value.image_preview = reader.result
  })
  if (file.value) {
    reader.readAsDataURL(file.value)
  }
}

const choseTemplateType = () => {
  if (bonusTemplate.value.type === 'text') {
    bonusTemplate.value.textValue = ""
  } else {
    bonusTemplate.value.imageValue = ""
    bonusTemplate.value.image_preview = null
  }
}

onMounted(() => {
  getPrinterInfo()
})
</script>

<style scoped>
.ticket-printer {
  width: 302px;
  max-width: 302px;
  font-size: 14px;
  font-family: 'Times New Roman';
}
.width-100 {
  width: 100%;
}
.width-50 {
  width: 50%;
  float: left;
}
.width-40 {
  width: 40%;
  float: left;
}
.width-25 {
  width: 25%;
  float: left;
}
.width-10 {
  width: 10%;
  float: left;
}
.font-h4 {
  font-size: 1.5rem;
  width: 100%;
}
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
</style>
