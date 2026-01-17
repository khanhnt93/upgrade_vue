<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
          <b-card-body class="p-4">
            <b-form>

              <b-row class="form-row border-bottom border-warning">
                <b-col md='12'>
                  <h2 class="text-center">Hướng dẫn sử dụng</h2>
                </b-col>
              </b-row>

              <b-row class="form-row border-bottom border-warning pt-2">
                <b-col md='12'>
                  <h4 class="text-header">
                    Giới thiệu hệ thống
                    <i v-show="!isShowIntroduction" class="fa fa-plus pl-3" @click="isShowIntroduction = !isShowIntroduction"></i>
                    <i v-show="isShowIntroduction" class="fa fa-minus pl-3" @click="isShowIntroduction = !isShowIntroduction"></i>
                  </h4>
                  <b-row v-show="isShowIntroduction">
                    <b-col>
                      <h5><strong>ciPro:</strong></h5>
                      <p class="lv2">
                        - Là phần mềm quản lý bán hàng chuyên biệt cho mảng bán hàng thương mại và dịch vụ. 
                        Ngoài những quản lý căn bản như đơn hàng bán, đơn hàng nhập, xuất nhập kho, quỹ, khách hàng, nhà cung cấp, nợ phải thu, nợ phải trả, các loại báo cáo, ... 
                        ciPro đặc biệt giúp bạn tạo nhanh một file báo giá (excel hoặc PDF) chỉ trong 30s, mẫu báo giá theo đúng thương hiệu của bạn, giúp bạn có ưu thế hơn có được đơn hàng.
                      </p>
                      <p class="mt-3">
                        <strong>
                          Để sử dụng, bạn thực hiện "Thiết lập" trước. Hướng dẫn chi tiết phía dưới.
                        </strong>
                      </p>
                    </b-col>
                  </b-row>
                  <br>
                </b-col>
              </b-row>

              <b-row class="form-row border-bottom border-warning pt-2">
                <b-col md='12'>
                  <h4 class="text-header">
                    Thiết lập
                    <i v-show="!isShowBaseSetting" class="fa fa-plus pl-3" @click="isShowBaseSetting = !isShowBaseSetting"></i>
                    <i v-show="isShowBaseSetting" class="fa fa-minus pl-3" @click="isShowBaseSetting = !isShowBaseSetting"></i>
                  </h4>
                  <b-row v-show="isShowBaseSetting">
                    <b-col>
                      <p>
                        <img src="/static/img/project/guide/base_setting.PNG" class="image-logo"/>
                      </p>
                      <p class="lv2">
                        <b>1. Thêm nhóm sản phẩm (bắt buộc):</b>
                        <br>
                        Đây là bước khai báo các nhóm sản phẩm có sử dụng trong đơn vị kinh doanh của bạn.
                        Tuỳ vào loại hình kinh doanh, các nhóm sản phẩm này có thề khác nhau.
                        <br>
                        Ví dụ: Quần áo, giày dép, mỹ phẩm, cà phê, phân bón, ...
                        <br>
                        Nếu bạn chưa biết rõ mình có những nhóm sản phẩm nào, bạn có thể khai báo tạm một nhóm nào đó, sau này có thể sửa lại sau hoặc liên hệ bộ phận CSKH của ciPro để được hướng dẫn.
                      </p>
                      <p class="lv2">
                        <b>2. Thêm loại sản phẩm (bắt buộc):</b>
                        <br>
                        Đây là bước khai báo các loại sản phẩm có sử dụng trong đơn vị kinh doanh của bạn.
                        Tuỳ vào loại hình kinh doanh, các loại sản phẩm này có thề khác nhau.
                        <br>
                        Ví dụ: Đối với nhóm sản phẩm quần áo, có thể có các loại sản phẩm: quần áo nam, quần áo nữ, quần áo
                        trẻ em, .... Đối với nhóm sản phẩm phân bón, có thể có các loại sản phẩm: Phân bón hữu cơ, phân NPK,
                        phân lân, ...
                        <br>
                        Nếu bạn chưa biết rõ mình có những loại sản phẩm nào, bạn có thể khai báo tạm một loại nào đó, sau này có thể sửa lại sau hoặc liên hệ bộ phận CSKH của ciPro để được hướng dẫn.
                      </p>
                      <p class="lv2">
                        <b>3. Thêm hãng sản phẩm (bắt buộc):</b>
                        <br>
                        Đây là bước khai báo các hãng có sử dụng trong đơn vị kinh doanh của bạn. 
                        <br>
                        Ví dụ: Adidas, Bitis, ...
                        <br>
                        Nếu bạn chưa biết rõ mình có những hãng sản phẩm nào, bạn có thể khai báo tạm một loại nào đó, sau này có thể sửa lại sau hoặc liên hệ bộ phận CSKH của ciPro để được hướng dẫn.
                      </p>
                      <p class="lv2">
                        <b>4. Thêm đơn vị (bắt buộc):</b>
                        <br>
                        Đây là bước khai báo các đơn vị có sử dụng trong đơn vị kinh doanh của bạn. Tuỳ vào loại hình kinh doanh,
                        các đơn vị này có thề khác nhau.
                        <br>
                        Ví dụ: kg, cái, chai, bao, ....
                        <br>
                        Nếu bạn chưa biết rõ mình sử dụng những đơn vị nào, bạn có thể khai báo tạm một đơn vị nào đó, sau này có thể sửa lại sau hoặc liên hệ bộ phận CSKH của ciPro để được hướng dẫn.
                      </p>
                      <p class="lv2">
                        <b>5. Thêm sản phẩm - Hàng hoá - DV (bắt buộc):</b>
                        <br>
                        Đây là bước khai báo các sản phẩm có sử dụng trong đơn vị kinh doanh của bạn.
                        Tuỳ vào loại hình kinh doanh, các sản phẩm này có thể khác nhau.
                        <br>
                        Ví dụ: Đối với loại sản phẩm là quần áo nam, có thể có các sản phẩm như: áo thun tay ngắn,
                        áo thun tay dài, áo sơ mi, quần tây .... Đối với loại sản phẩm như phân NPK, có thể có các sản
                        phẩm như: phân NPK đầu trâu 16-16-8, phân NPK đầu trâu 16-8-16, ...
                      </p>
                      <p class="lv2">
                        <b>6. Thêm dự án mẫu (không bắt buộc):</b>
                        <br>
                        Giành riêng cho các cơ sở kinh doanh có khâu sản xuất. Dự án mẫu là phần thiết lập cho việc sản xuất sản phẩm từ các sản phẩm khác.  
                      </p>
                      <p class="lv2">
                        <b>7. Thêm phân quyền (không bắt buộc):</b>
                        <br>
                        Việc khai báo phân quyền cho phép đơn vị kinh doanh của bạn phân quyền làm 1 việc vụ thể nào
                        đó cho từng nhân viên hoặc từng nhóm nhân viên.
                        <br>
                        Ví dụ:
                        Nhân viên thủ kho chỉ được quyền quản lý kho hàng, nhân viên kế toán chỉ được xem thông
                        tin báo cáo doanh thu, ...
                        <br>
                        Hệ thống đã thêm các nhóm quyền mặc định, bạn có thể thêm mới hoặc chỉnh sửa các nhóm quyền đã
                        có cho phù hợp.
                      </p>
                      <p class="lv2">
                        <b>8. Thêm nhân viên (không bắt buộc):</b>
                        <br>
                        Bạn hãy thêm các nhân viên của bạn và phân cho họ nhóm quyền phù
                        hợp.
                      </p>
                      <p class="lv2">
                        <b>9. Thêm tài khoản ngân hàng (không bắt buộc):</b>
                        <br>
                        Thông tin tài khoản ngân hàng sẽ thể hiện trên báo giá.
                      </p>
                      <p class="lv2">
                        <b>10. Thêm chuyển đổi đơn vị (không bắt buộc):</b>
                        <br>
                        Giành riêng cho các cơ sở kinh doanh, nhập theo một đơn vị nhưng bán theo nhiều đơn vị khác nhau.
                        <br>
                        Ví dụ: Nhập sản phẩm ống công nghiệp theo cuộn nhưng bán theo mét hoặc KG.
                      </p>
                    </b-col>
                  </b-row>
                  <br>
                </b-col>
              </b-row>

              <b-row class="form-row border-bottom border-warning pt-2">
                <b-col md='12'>
                  <h4 class="text-header">
                    Sử dụng
                    <i v-show="!isShowUseGuide" class="fa fa-plus pl-3" @click="isShowUseGuide = !isShowUseGuide"></i>
                    <i v-show="isShowUseGuide" class="fa fa-minus pl-3" @click="isShowUseGuide = !isShowUseGuide"></i>
                  </h4>
                  <b-row v-show="isShowUseGuide">
                    <b-col>
                      <p class="lv2">
                        <b>Quy trình sử dụng ciPro thông thường qua các bước sau:</b>
                        <br>
                        <span>1. Tạo báo giá</span>
                        <br>
                        <span>2. Chăm sóc báo giá</span>
                        <br>
                        <span>3. Tạo đơn hàng bán từ báo giá</span>
                        <br>
                        <span>4. Tạo đơn hàng nhập từ đơn hàng bán</span>
                        <br>
                        <span>5. Tạo phiếu nhập kho từ đơn hàng nhập</span>
                        <br>
                        <span>6. Tạo phiếu chi từ đơn hàng nhập</span>
                        <br>
                        <span>7. Tạo phiếu xuất kho từ đơn hàng bán</span>
                        <br>
                        <span>8. Tạo phiếu thu từ đơn hàng bán</span>
                        <br>
                        <br>
                        <b>Tùy vào nhu cầu sử dụng, tùy vào nghiệp vụ kinh doanh, không nhất thiết phải tuân thủ các bước phía trên, bạn có thể tạo mới đơn hàng bán mà không cần tạo báo giá, bạn cũng có thể tạo đơn hàng nhập kho không phải từ đơn hàng bán... Chi tiết sử dụng, bạn xem video bên dưới để hiểu rõ hơn.</b>
                      </p>
                    </b-col>
                  </b-row>
                  <br>
                </b-col>
              </b-row>

              <b-row class="form-row border-bottom border-warning pt-2">
                <b-col md='12'>
                  <h4 class="text-header">
                    Video hướng dẫn
                    <i v-show="!isShowVideoGuide" class="fa fa-plus pl-3" @click="isShowVideoGuide = !isShowVideoGuide"></i>
                    <i v-show="isShowVideoGuide" class="fa fa-minus pl-3" @click="isShowVideoGuide = !isShowVideoGuide"></i>
                  </h4>
                  <b-row v-show="isShowVideoGuide">
                    <b-col>
                      <p>Video hướng dẫn: <a href="https://www.youtube.com/watch?v=xf3eWO7IlMg" target="_blank">Xem</a></p>
                    </b-col>
                  </b-row>
                  <br>
                </b-col>
              </b-row>

              </b-form>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
export default {
  components: {
  },
  data () {
    return {
      isShowIntroduction: false,
      isShowDownApp: false,
      isShowBaseSetting: false,
      isShowSetting: false,
      isShowOptionTopping: false,
      isShowPromotion: false,
      isShowPrinterArea: false,
      isShowStoreSetting: false,
      isShowRepository: false,
      isShowFunctionGuide: false,
      isShowUseGuide: false,
      isShowGuideOrder: false,
      isShowGuidePayment: false,
      isShowGuideChangeTable: false,
      isShowGuideMergeTable: false,
      isShowGuideCancelFood: false,
      isShowGuideCancelOrder: false,
      isShowGuideCleanTable: false,
      isShowGuideManOrder: false,
      isShowGuideOrderHistory: false,
      isShowGuideBillHistory: false,
      isShowGuidePrintOldBill: false,
      isShowGuideDeleteBill: false,
      isShowGuideManRepository: false,
      isShowGuideManMoneyBox: false,
      isShowGuideChangeShift: false,
      isShowGuideReport: false,
      isShowGuideManCustomer: false,
      isShowVideoGuide: false,
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss">
  .lv2 {
    padding-left: 10px;
  }
  .lv3 {
    padding-left: 20px;
  }
  .lv4 {
    padding-left: 30px;
  }
  .image-logo {
    width: 100%;
    height: 100%;
  }
  .image-guide {
    width: 50%;
    height: 50%;
  }
  @media(max-width:900px) {
    .image-guide {
      width: 100%;
      height: 100%;
    }
  }
</style>
