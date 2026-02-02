<template>
  <div class="container-fluid">

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body">

            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-full">
                <button class="btn btn-outline-success float-right px-4 btn-width-120" @click="save()" :disabled="saving == true">
                  Lưu
                </button>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 row form-row">
              <div class="col-span-12">
                <h4 class="mt-2 text-center text-header">Máy in</h4>
              </div>
            </div>

            <div>
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a class="nav-link cursor-pointer" :class="{ active: activeTab === 'setting' }" @click="activeTab = 'setting'">Cài đặt</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link cursor-pointer" :class="{ active: activeTab === 'template' }" @click="activeTab = 'template'">Mẫu in</a>
                </li>
              </ul>

              <div v-show="activeTab === 'setting'">
                <h4>Máy in bill</h4>

                <div class="grid grid-cols-12 gap-4 row form-row">
                  <div class="col-span-3 mt-2">
                    <label> Kích thước máy in: </label>
                  </div>
                  <div class="col-span-9">
                    <select class="form-control form-control"
                    type="text"
                    autocomplete="new-password"
                    v-model="printer.bill_size">
                      <option v-for="option in printerSize" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 row form-row">
                  <div class="col-span-3 mt-2">
                    <label> Cỡ chữ: </label>
                  </div>
                  <div class="col-span-9">
                    <select class="form-control form-control"
                    type="text"
                    autocomplete="new-password"
                    v-model="printer.bill_font_size">
                      <option v-for="option in fontSize" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 row form-row">
                  <div class="col-span-3 mt-2">
                    <label> Font chữ: </label>
                  </div>
                  <div class="col-span-9">
                    <select class="form-control form-control"
                    type="text"
                    autocomplete="new-password"
                    v-model="printer.bill_font">
                      <option v-for="option in font" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <hr>
                <h4>Máy in bếp</h4>

                <div class="grid grid-cols-12 gap-4 row form-row">
                  <div class="col-span-3 mt-2">
                    <label> Kích thước máy in: </label>
                  </div>
                  <div class="col-span-9">
                    <select class="form-control form-control"
                    type="text"
                    autocomplete="new-password"
                    v-model="printer.kitchen_size">
                      <option v-for="option in printerSize" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 row form-row">
                  <div class="col-span-3 mt-2">
                    <label> Cỡ chữ: </label>
                  </div>
                  <div class="col-span-9">
                    <select class="form-control form-control"
                    type="text"
                    autocomplete="new-password"
                    v-model="printer.kitchen_font_size">
                      <option v-for="option in fontSize" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-12 gap-4 row form-row">
                  <div class="col-span-3 mt-2">
                    <label> Font chữ: </label>
                  </div>
                  <div class="col-span-9">
                    <select class="form-control form-control"
                    type="text"
                    autocomplete="new-password"
                    v-model="printer.kitchen_font">
                      <option v-for="option in font" :key="option.value" :value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div v-show="activeTab === 'template'">
                <div :style="{overflowX: 'scroll'}">
                  <div class="ticket-printer">
                    <h3 class="text-center">{{store.name}}</h3>
                    <p class="text-center">{{store.address}}</p>
                    <p class="text-center">{{store.phone_number}}</p>
                    <br>
                    <p class="text-center">
                      <input class="text-center font-h4" type="text" v-model="printer.template.title"/>
                    </p>
                    <p class="text-center">Số hóa đơn: 001:00000001</p>
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-50">Bàn: 01</div>
                        <div class="width-50 text-right">Ngày: {{store.bill_date}}</div>
                      </div>
                    </div>
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-50">Nhân viên: {{store.staff_name}}</div>
                        <div class="width-50 text-right">Giờ: {{store.bill_time}}</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-40 border-top border-bottom">Tên hàng</div>
                        <div class="width-10 text-center border-top border-bottom">SL</div>
                        <div class="width-25 text-center border-top border-bottom">Đơn giá</div>
                        <div class="width-25 text-center border-top border-bottom">Thành tiền</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-40">Cafe sữa đá</div>
                        <div class="width-10 text-center">2</div>
                        <div class="width-25 text-right">15,000</div>
                        <div class="width-25 text-right">30,000</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-40">Yaourt trái cây</div>
                        <div class="width-10 text-center">1</div>
                        <div class="width-25 text-right">32,000</div>
                        <div class="width-25 text-right">32,000</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-40">Soda chanh muối + xí muội</div>
                        <div class="width-10 text-center">1</div>
                        <div class="width-25 text-right">25,000</div>
                        <div class="width-25 text-right">25,000</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-50 text-right border-top">Tổng cộng:</div>
                        <div class="width-50 text-right border-top">87,000</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-100">1 x Giảm giá 50% cho hóa đơn từ 50k, tối đa 15k</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-50 text-right border-top">Tổng giảm giá:</div>
                        <div class="width-50 text-right border-top">-15,000</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-100">Tổ chức sinh nhật</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-50 text-right border-top">Tổng phí:</div>
                        <div class="width-50 text-right border-top">120,000</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-50 text-right">Thuế VAT:</div>
                        <div class="width-50 text-right">+7,200</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-full">
                        <div class="width-50 text-right">Thành tiền:</div>
                        <div class="width-50 text-right">199,200</div>
                      </div>
                    </div>

                    <p>Vào: {{store.time_in}}</p>
                    <p>Ra:&nbsp;&nbsp;&nbsp;{{store.time_out}}</p>
                    <p>Tiền khách đưa: 200,000đ</p>
                    <p>Tiền trả khách: 800đ</p>
                    <p class="text-center mb-5">
                      <input class="text-center width-100" type="text" v-model="printer.template.footer"/>
                    </p>

                    <div class="grid grid-cols-12 gap-4" v-for="(item, index) in this.bonusItem" :key="index">
                      <div class="col-span-full">
                        <p v-if="item.type == 'text'" v-bind:class="'text-' + item.align">{{item.textValue}}</p>
                        <img v-if="item.type == 'image'" :src="item.image_preview" width="100%" height="auto">
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4" v-show="this.bonusItem.length> 0">
                      <div class="col-span-full text-center">
                        <button class="btn show-qr-code-button text-center mt-2" id="btnBonusTemplate" @click="deleteBonusTemplate">
                          Xóa mục thêm trên mẫu in
                        </button>
                      </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4 border mt-5">
                      <div class="col-span-full">

                        <div class="grid grid-cols-12 gap-4">
                          <div class="col-span-full text-center">
                            Thêm mục vào mẫu in
                          </div>
                        </div>

                        <div class="grid grid-cols-12 gap-4">
                          <div class="col-span-full">
                            <div class="form-group">
                              <label>Loại </label>
                              <input type="radio" id="text" value="text" v-model="bonusTemplate.type" @click="choseTemplateType">
                              <label for="text">Chữ</label>
                              <input type="radio" id="image" value="image" v-model="bonusTemplate.type" @click="choseTemplateType">
                              <label for="image">Hình ảnh</label>
                            </div>
                          </div>
                        </div>

                        <div class="grid grid-cols-12 gap-4">
                          <div class="col-span-full">
                            <div class="form-group">
                              <label>Căn </label>
                              <input type="radio" id="left" value="left" v-model="bonusTemplate.align">
                              <label for="left">Trái</label>
                              <input type="radio" id="mid" value="center" v-model="bonusTemplate.align">
                              <label for="mid">Giữa</label>
                              <input type="radio" id="right" value="right" v-model="bonusTemplate.align">
                              <label for="right">Phải</label>
                            </div>
                          </div>
                        </div>

                        <div class="grid grid-cols-12 gap-4" v-show="bonusTemplate.type == 'text'">
                          <div class="col-span-full">
                            <input :class="'text-' + bonusTemplate.align + ' width-100'"  type="text" v-model="bonusTemplate.textValue"/>
                          </div>
                        </div>

                        <div class="grid grid-cols-12 gap-4" v-show="bonusTemplate.type == 'image'">
                          <div class="col-span-full">
                            <div class="input-group cursor-pointer" @click="$refs.file.click()">
                              <input class="form-control" v-model="bonusTemplate.imageValue">
                              <div class="input-group-append">
                                <span class="input-group-text">Browse</span>
                              </div>
                            </div>
                            <input class="d-none" type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload"/>
                          </div>
                        </div>

                        <div class="grid grid-cols-12 gap-4">
                          <div class="col-span-full">
                            <img :src="bonusTemplate.image_preview" width="100%" height="auto" v-show="bonusTemplate.image_preview">
                          </div>
                        </div>

                        <div class="grid grid-cols-12 gap-4">
                          <div class="col-span-full text-center">
                            <button class="btn show-qr-code-button text-center mt-2" id="btnBonusTemplate" @click="addBonusTemplate">
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

      </div>
    </div>

  </div>
</template>


<script>
import adminAPI from '@/api/admin'
import commonFunc from '@/common/commonFunc'


export default {
  data () {
    return {
      id: null,
      activeTab: 'setting',
      printer : {
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
      },
      printerSize: [
        {value: 57, text: '5.7'},
        {value: 58, text: '5.8'},
        {value: 75, text: '7.5'},
        {value: 80, text: '8.0'},
      ],
      fontSize: [
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
      ],
      font: [
        {value: 'Times New Roman', text: 'Times New Roman'},
        {value: 'Arial', text: 'Arial'}
      ],
      store: {
        name: "Tên Cửa Hàng",
        address: "99 Cộng Hòa, p.13, q.Tân Bình, HCM ",
        phone_number: "(028) 345 345 345",
        bill_date: "05-09-2020",
        staff_name: "Thu Ngân",
        bill_time: "09:30",
        time_in: "07:15 05-09-2020",
        time_out: "09:30 05-09-2020"
      },
      saving: false,
      bonusTemplate: {
        type: "text",
        align: "center",
        textValue: "",
        imageValue: "",
        image_preview: null
      },
      bonusItem: []
    }
  },
  mounted() {
    // Get printer info
    this.getPrinterInfo()
  },
  computed: {
  },
  methods: {

    /**
   * Make toast without title
   */
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    /**
     * Get printer info
     */
    getPrinterInfo() {
      // Call api get printer info
      adminAPI.getPrinterInfo().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.id = res.data.data.id
          this.printer = res.data.data.printer
          this.bonusItem = this.printer.template.bonusItem
        }
      }).catch(err => {
        console.log(err)
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Save
     */
    save() {
      this.saving = true
      this.printer.template.bonusItem = this.bonusItem

      // Call api save printer info
      adminAPI.savePrinterInfo({"id": this.id, "params": this.printer}).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', 'Lưu thông tin máy in thành công!!! ')
        }

        this.saving = false
      }).catch(err => {
        this.saving = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Add bonus print template
     */
    addBonusTemplate() {
      let itemTemp = JSON.parse(JSON.stringify(this.bonusTemplate))
      this.bonusItem.push(itemTemp)

      // Call api upload image
      if(this.bonusTemplate.imageValue) {
        const formData = new FormData();
        formData.append("image", this.file)

        adminAPI.uploadImagePrinter(formData).then(res => {
          if(res != null && res.data != null){
            if (res.data.status == 200) {
              this.bonusItem[this.bonusItem.length-1].image_preview = res.data.data
            }
          }
        })
      }

      this.bonusTemplate.type = 'text'
      this.bonusTemplate.textValue = ""
      this.bonusTemplate.imageValue = ""
      this.bonusTemplate.image_preview = null
    },

    /**
     * Delete bonus print template
     */
    deleteBonusTemplate() {
      let items = JSON.parse(JSON.stringify(this.bonusItem))
      this.bonusItem = []

      // Call api upload image
      console.log(items)
      for (let index in items) {
        if(items[index].image_preview) {
          console.log("vao day ko")
          adminAPI.deleteImagePrinter(items).then(res => {
            if(res != null && res.data != null){
              this.popToast('success', 'Xóa phần thêm của mẫu in thành công')
            }
          })
          break
        }
      }
    },

    /**
     * Handle upload file
     */
    handleFileUpload () { // event
      this.bonusTemplate.image_preview = null
      this.file = this.$refs.file.files[0]//event.target.files[0]
      this.bonusTemplate.imageValue = this.file.name

      // Render image in review
      let reader  = new FileReader ()
      reader.addEventListener("load", function () {
        this.bonusTemplate.image_preview = reader.result
      }.bind(this), false)
      if( this.file ){
        reader.readAsDataURL( this.file )
        this.height = '300px'
        this.styleImg = {'max-width': '100%', 'max-height': '100%'}
      }
    },

    /**
     * Handle when chose template
     */
    choseTemplateType() {
      if(this.bonusTemplate.type == 'text') {
        this.bonusTemplate.textValue = ""
      } else {
        this.bonusTemplate.imageValue = ""
        this.bonusTemplate.image_preview = null
      }
    },
  }
}
</script>


<style lang="css" scoped>
  .ticket-printer {
    width: 302px;
    max-width: 302px;
    font-size: 14px;
    font-family: 'Times New Roman';
  }
  .width-100 {
    width: 100%;
  }
  .width-70 {
    width: 70%;
    float: left;
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
</style>
