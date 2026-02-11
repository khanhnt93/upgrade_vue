<template>
  <div class="container-fluid">
    <div class="flex flex-wrap -mx-2">
      <div class="w-full px-2">
        <div class="card">
          <div class="p-4">

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2">
                <h4 class="mt-1 text-center text-header">Thiết Lập Mẫu In Hoá Đơn</h4>
              </div>
            </div>
            <hr>
            <!-- Loading -->
            <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-center">
                <button v-bind:class="[invoiceTemplate == 'template_1' ? 'btn-outline-danger' : 'btn-outline-primary', 'btn', 'btn-width-200']"
                           @click="invoiceTemplate = 'template_1'" >
                  Mẫu A
                </button>
                <button v-bind:class="[invoiceTemplate == 'template_2' ? 'btn-outline-danger' : 'btn-outline-primary', 'btn', 'btn-width-200', 'ml-2']"
                           @click="invoiceTemplate = 'template_2'" >
                  Mẫu B
                </button>
              </div>
            </div>

            <div class="flex flex-wrap -mx-2">
              <div class="w-full px-2 text-center mt-2">
                <button class="btn btn-outline-success btn-width-120" @click="updateStoreSetting()" >
                  Chọn
                </button>
              </div>
            </div>

            <hr>

          <!-- Mẫu template 1 -->
            <div v-show="invoiceTemplate == 'template_1'" class="vh-100 text-center flex items-center">
              <div class="w-full md:w-1/4 px-2">    </div>
              <div class="w-full md:w-1/2 px-2">
              <div>
                <div class="text-left print-width-50-left">
                  <h4>TÊN CỤC THUẾ................</h4>
                </div>
                <div class="text-right print-width-50-right">
                  <h4>Mẫu số: 02GTTT3/001</h4>
                </div>
              </div>

              <div style="width: 100%">
                <h2 class="text-center">HOÁ ĐƠN BÁN HÀNG</h2>
                <p class="text-center">Ngày 01 tháng 01 năm 2024</p>
                <p class="text-center">Số hoá đơn: DH099:240101:0026</p>
              </div>
              <br>
              <div class="print-border print-pl-2">
                <table style="width:100%">

                  <tbody>
                  <tr style="width:100%"><td class="print-no-border text-left">Đơn vị bán hàng: <b>CTY A</b></td></tr>
                  <tr style="width:100%"><td class="print-no-border text-left">Mã số thuế: 123456789</td></tr>
                  <tr style="width:100%"><td class="print-no-border text-left">Địa chỉ: 364 Cộng Hoà, P13, Tân Bình, HCM</td></tr>
                  <tr style="width:100%"><td class="print-no-border text-left">Điện thoại: 0968.668.668</td></tr>

                  </tbody>
                </table>
                <hr>
                <table style="width:100%">

                  <tbody>
                  <tr><td class="print-no-border text-left">Họ tên người mua hàng: <b>
                    <span>Nguyễn Văn B</span>
                  </b></td></tr>
                  <tr><td class="print-no-border text-left">Mã số thuế: </td></tr>
                  <tr><td class="print-no-border text-left">Địa chỉ:
                    <span>01 Cộng Hoà, P1, Tân Bình, HCM</span>
                  </td></tr>
                  <tr><td class="print-no-border text-left">Điện thoại:
                    <span>0969.669.669</span>
                  </td></tr>

                  </tbody>
                </table>
              </div>
              <br>
              <div id="print-table-border">
                <table style="width:100%">

                  <tbody>
                  <tr class="text-center">
                    <th>STT</th>
                    <th>Tên hàng hóa, dv</th>
                    <th>Đơn vị tính</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                  <tr>
                    <td class="text-center">1</td>
                    <td>Sản phẩm 01</td>
                    <td>Cái</td>
                    <td class="text-right">150.000đ</td>
                    <td class="text-right">2</td>
                    <td class="text-right">300.000đ</td>
                  </tr>
                  <tr>
                    <td class="text-center">2</td>
                    <td>Sản phẩm 02</td>
                    <td>Cái</td>
                    <td class="text-right">180.000đ</td>
                    <td class="text-right">1</td>
                    <td class="text-right">180.000đ</td>
                  </tr>
                  <tr>
                    <td colspan="5">Tổng tiền sản phẩm</td>
                    <td class="text-right">480.000đ</td>
                  </tr>
                  <tr>
                    <td colspan="5">Khuyến mãi</td>
                    <td class="text-right">-240.000đ</td>
                  </tr>
                  <tr>
                    <td colspan="5">VAT (10%)</td>
                    <td class="text-right">+24.000đ</td>
                  </tr>
                  <tr>
                    <td colspan="5">Thành tiền</td>
                    <td class="text-right"><b>264.000đ</b></td>
                  </tr>
                  <tr>
                    <td colspan="6">Số tiền viết bằng chữ: Hai trăm sáu mươi bốn ngàn đồng</td>
                  </tr>

                  </tbody>

                </table>
                <br>
                <div class="flex flex-wrap">
                  <div class="w-full md:w-1/2">
                    <p class="text-center">Người mua hàng</p>
                    <p class="text-center">(Ký, ghi rõ họ tên)</p>
                  </div>
                  <div class="w-full md:w-1/2">
                    <p class="text-center">Người bán hàng</p>
                    <p class="text-center">(Ký, đóng dấu, ghi rõ họ tên)</p>
                  </div>
                </div>

              </div>
              </div>
              <div class="w-full md:w-1/4 px-2">    </div>
            </div>

          <!-- Mẫu template 2 -->
          <div v-show="invoiceTemplate == 'template_2'">

            <div style="max-width: 303px !important; margin: auto;">
              <div>
                <h2 class="text-center">CTY TNHH A</h2>
                <p class="text-center">364 Cộng Hoà, P13, Tân Bình, HCM</p>
                <p class="text-center">0968.668.668</p>
              </div>
              <br>
              <h5 class="text-center">HOÁ ĐƠN BÁN HÀNG</h5>
              <p class="text-center">Số HĐ: DH099:240101:0026</p>

              <p class="mt-2">Ngày: 01-01-2024</p>
              <p>Khách hàng: Nguyễn Văn A</p>

              <div>
                <div style="margin-top:10px;display:flex;width:100%;border-top:1px solid #555555;border-bottom:1px solid #555555">
                  <div style="width:33%;text-align:center;font-size:13;">
                      Số lượng
                    </div>
                    <div style="width:33%;text-align:center;font-size:13;">
                      Đơn giá
                    </div>
                    <div style="width:33%;text-align:center;font-size:13;">
                      Thành tiền
                    </div>
                </div>
                <div style="border-top:1px dotted #555555;width:100%;display:flex;flex-direction:row;flex-wrap:wrap">
                   <div style="font-size:13;">
                      1. Sản phẩm, hàng hoá, dịch vụ 01
                     </div>
                      <div style="display:flex;width:100%">
                       <div style="width:33.3%;text-align:center;font-size:13;" >
                          2
                      </div>
                       <div style="width:33.3%;text-align:end;font-size:13;" >
                          150.000đ
                       </div>
                       <div style="width:33.3%;text-align:end;font-size:13;" >
                          300.000đ
                       </div>
                     </div>
                </div>
                <div style="border-top:1px dotted #555555;width:100%;display:flex;flex-direction:row;flex-wrap:wrap">
                   <div style="font-size:13;">
                      2. Sản phẩm, hàng hoá, dịch vụ 02
                     </div>
                      <div style="display:flex;width:100%">
                       <div style="width:33.3%;text-align:center;font-size:13;" >
                          1
                      </div>
                       <div style="width:33.3%;text-align:end;font-size:13;" >
                          180.000đ
                       </div>
                       <div style="width:33.3%;text-align:end;font-size:13;" >
                          180.000đ
                       </div>
                     </div>
                </div>
                <div style="display:flex;width:100%;border-top:1px solid #555555">
                    <div style="width:66%;font-size:13;">
                      Tổng tiền sản phẩm
                    </div>
                    <div style="width:33%;text-align:right;font-size:13;">
                      480.000đ
                    </div>
                </div>
                <div style="display:flex;width:100%;border-top:1px solid #555555">
                    <div style="width:66%;font-size:13;">
                      Khuyến mãi
                    </div>
                    <div style="width:33%;text-align:right;font-size:13;">
                      -240.000đ
                    </div>
                </div>
                <div style="display:flex;width:100%;border-top:1px solid #555555">
                    <div style="width:66%;font-size:13;">
                      VAT (10%)
                    </div>
                    <div style="width:33%;text-align:right;font-size:13;">
                      +24.000đ
                    </div>
                </div>
                <div style="display:flex;width:100%;border-top:1px solid #555555">
                    <div style="width:66%;font-size:13;">
                      Thành tiền
                    </div>
                    <div style="width:33%;text-align:right;font-size:13;">
                      <b>264.000đ</b>
                    </div>
                </div>
                <br>
                <div>
                  <p class="text-center">Cảm ơn quý khách và hẹn gặp lại!</p>
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
  import commonFunc from '@/common/commonFunc'
  import settingAPI from "@/api/setting"
  import { useToast } from '@/composables/useToast'


  export default {
    setup() {
      const { toast } = useToast()
      return {
        toast
      }
    },
    data () {
      return {
        invoiceTemplate: 'template_1',
        click: false,
        saving: false,
        loading: false,
      }
    },
    mounted () {
      this.getSettingByGroup()
    },
    methods: {
      /**
       * Make toast without title
       */
      popToast(variant, content) {
        this.toast(content, variant)
      },

      /**
     * Update store setting
     */
    updateStoreSetting() {
      let params = {
        "code": "invoice_template",
        "value": this.invoiceTemplate,
        "group": "invoice_template"
      }
      settingAPI.updateStoreSetting(params).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', "Lưu giá trị thành công!")
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('error', errorMess)
      })
    },

      getSettingByGroup() {
        this.loading = true

        let params = {"group": "invoice_template"}
        settingAPI.getSettingByGroup(params).then(res => {
          if(res != null && res.data != null && res.data.data != null) {
            let datas = res.data.data

            for (let i in datas) {
              if(datas[i].code == "invoice_template") {
                this.invoiceTemplate = datas[i].value
                break
              }
            }
          }

          this.loading = false
        }).catch(err => {
          this.loading = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('error', errorMess)
        })
      },
    }
  }
</script>


<style lang="scss" scoped>
  @media print {
    .print-center {
      text-align: center;
    }
  }

  .title-partner {
    border-radius: 5px 5px;
    padding: 5px;

  }

  table {
   margin: auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
  }

  td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  th {
    text-align: left;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  td {
    white-space: nowrap;
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  td:first-of-type, th:first-of-type {
    border-left: none;
  }

  td:last-of-type, th:last-of-type {
    border-right: none;
  }

  .print-width-50-left {width: 50%; float: left;}
  .print-width-50-right {width: 50%; float: right;}
  .print-border {border: black solid 1px;}
  .print-pl-2 {padding-left: 10px;}
  #print-table-border > table, th, td {border: black solid 1px; border-collapse: collapse;}
  .print-border {border: black solid 1px; border-collapse: collapse;}
  .print-no-border {border: none;}
  .border-bot-solid {border-bottom: black solid 1px; border-collapse: collapse;}
  .border-bot-dotted {border-bottom: black dotted 1px; border-collapse: collapse;}
</style>
