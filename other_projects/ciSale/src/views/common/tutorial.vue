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
                      <h5>ciSale:</h5>
                      <p class="lv2">
                        - Là hệ thống phần mềm cung cấp giải pháp quản lý bán hàng và tài chính.
                      </p>
                      <p class="lv2">
                        - Hệ thống bao gồm: website quản lý (<a target="_blank" href="https://cisale.vn">cisale.vn</a>)
                        và app điện thoại
                      </p>
                    </b-col>
                  </b-row>
                  <br>
                </b-col>
              </b-row>

              <b-row class="form-row border-bottom border-warning pt-2">
                <b-col md='12'>
                  <h4 class="text-header">
                    Hướng dẫn tải app
                    <i v-show="!isShowDownApp" class="fa fa-plus pl-3" @click="isShowDownApp = !isShowDownApp"></i>
                    <i v-show="isShowDownApp" class="fa fa-minus pl-3" @click="isShowDownApp = !isShowDownApp"></i>
                  </h4>
                  <b-row v-show="isShowDownApp">
                    <b-col>
                      <p>App điện thoại giúp bạn kiểm tra tình hình kinh doanh, công nợ, nợ công, kho hàng, ... một cách dễ dàng.</p>
                      <p>Để tải app điện thoại:</p>
                      <p class="lv2">- Đối với điện thoại android: Bạn lên CH play hoặc google play, tìm và tải app "ciSale"</p>
                      <p class="lv2">- Đối với điện thoại iOS: Bạn lên app store, tìm và tải app "ciSale"</p>
                      <p class="lv1">Sau khi tải app, bạn có thể đăng nhập bằng tài khoản mà chúng tôi (ciinTech) đã cung cấp hoặc từ người quản lý của bạn.</p>
                    </b-col>
                  </b-row>
                  <br>
                </b-col>
              </b-row>

              <b-row class="form-row border-bottom border-warning pt-2">
                <b-col md='12'>
                  <h4 class="text-header">
                    Thiết lập căn bản
                    <i v-show="!isShowBaseSetting" class="fa fa-plus pl-3" @click="isShowBaseSetting = !isShowBaseSetting"></i>
                    <i v-show="isShowBaseSetting" class="fa fa-minus pl-3" @click="isShowBaseSetting = !isShowBaseSetting"></i>
                  </h4>
                  <b-row v-show="isShowBaseSetting">
                    <b-col>
                      <p>
                        Bạn truy cập web quản lý <a target="_blank" href="https://cisale.vn">https://cisale.vn</a>
                        đăng nhập, vào menu "Thiết lập" và thực hiện các bước sau đây:
                      </p>
                      <p class="text-primary">
                        ** Nếu bạn chưa rõ cách làm, bạn có thể đăng nhập bằng tài khoản demo
                        của chúng tôi (Số điện thoại: 0999888999, mật khẩu: 12345678), xem mẫu và làm tương tự
                      </p>
                      <p class="lv2">
                        <b>1. Thêm đơn vị (bắt buộc):</b>
                        <br>
                        Đây là bước khai báo các đơn vị có sử dụng trong cửa hàng của bạn. Tuỳ vào loại hình kinh doanh,
                        các đơn vị này có thề khác nhau.
                        <br>
                        Ví dụ: kg, cái, chai, bao, ....
                      </p>
                      <p class="lv2">
                        <b>2. Thêm nhóm sản phẩm (bắt buộc):</b>
                        <br>
                        Đây là bước khai báo các nhóm sản phẩm có sử dụng trong cửa hàng của bạn.
                        Tuỳ vào loại hình kinh doanh, các nhóm sản phẩm này có thề khác nhau.
                        <br>
                        Ví dụ: Quần áo, giày dép, mỹ phẩm, cà phê, phân bón, ...
                      </p>
                      <p class="lv2">
                        <b>3. Thêm loại sản phẩm (bắt buộc):</b>
                        <br>
                        Đây là bước khai báo các loại sản phẩm có sử dụng trong cửa hàng của bạn.
                        Tuỳ vào loại hình kinh doanh, các loại sản phẩm này có thề khác nhau.
                        <br>
                        Ví dụ: Đối với nhóm sản phẩm quần áo, có thể có các loại sản phẩm: quần áo nam, quần áo nữ, quần áo
                        trẻ em, .... Đối với nhóm sản phẩm phân bón, có thể có các loại sản phẩm: Phân bón hữu cơ, phân NPK,
                        phân lân, ...
                      </p>
                      <p class="lv2">
                        <b>4. Thêm sản phẩm (bắt buộc):</b>
                        <br>
                        Đây là bước khai báo các sản phẩm có sử dụng trong cửa hàng của bạn.
                        Tuỳ vào loại hình kinh doanh, các sản phẩm này có thề khác nhau.
                        <br>
                        Ví dụ: Đối với loại sản phẩm là quần áo nam, có thể có các sản phẩm như: áo thun tay ngắn,
                        áo thun tay dài, áo sơ mi, quần tây .... Đối với loại sản phẩm như phân NPK, có thể có các sản
                        phẩm như: phân NPK đầu trâu 16-16-8, phân NPK đầu trâu 16-8-16, ...
                      </p>
                      <p class="lv2">
                        <b>5. Thêm nhóm quyền (không bắt buộc):</b>
                        <br>
                        Việc khai báo nhóm quyền cho phép cửa hàng của bạn phân quyền làm 1 việc vụ thể nào
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
                        <b>6. Thêm nhân viên (không bắt buộc):</b>
                        <br>
                        Bạn hãy thêm các nhân viên có trong cửa hàng của bạn và phân cho họ nhóm quyền phù
                        hợp.
                      </p>
                      <p class="pt-3">
                        <img src="/static/img/project/guide/menu_base_setting.PNG" class="image-logo"/>
                      </p>
                    </b-col>
                  </b-row>
                  <br>
                </b-col>
              </b-row>

              <b-row class="form-row border-bottom border-warning pt-2">
                <b-col md='12'>
                  <h4 class="text-header">
                    Thiết lập nâng cao
                    <i v-show="!isShowSetting" class="fa fa-plus pl-3" @click="isShowSetting = !isShowSetting"></i>
                    <i v-show="isShowSetting" class="fa fa-minus pl-3" @click="isShowSetting = !isShowSetting"></i>
                  </h4>
                  <b-row v-show="isShowSetting">
                    <b-col>
                      <p>Bạn truy cập web quản lý <a target="_blank" href="https://cisale.vn">https://cisale.vn</a> đăng nhập và thực hiện các bước sau đây</p>
                      <p class="text-primary">** Nếu bạn chưa rõ cách làm, bạn có thể đăng nhập bằng tài khoản demo của chúng tôi (Số điện thoại: 0999888999, mật khẩu: 12345678), xem mẫu và làm tương tự </p>

                      <h5 class="lv2 pt-3">
                        Thêm khuyến mãi
                        <i v-show="!isShowPromotion" class="fa fa-plus pl-3" @click="isShowPromotion = !isShowPromotion"></i>
                        <i v-show="isShowPromotion" class="fa fa-minus pl-3" @click="isShowPromotion = !isShowPromotion"></i>
                      </h5>
                      <b-row v-show="isShowPromotion" class="lv3">
                        <b-col>
                          <p>Để thêm khuyến mãi, bạn vào menu “Thiết lập”, chọn “Khuyến mãi”.</p>
                          <p>Bạn bấm nút “Thêm” ở góc trên bên phải. Màn hình tạo mới khuyến mãi sẽ xuất hiện.
                            Trong màn hình, những mục có dấu sao màu đỏ (<span class="text-danger">*</span>) là những mục bắt buộc nhập.
                          </p>
                          <p class="pt-2">Các loại khuyến mãi</p>
                          <p class="lv4">- Discount: Giảm giá theo %, ví dụ: Giảm giá 30% toàn hệ thống từ 30/4 đến 1/5</p>
                          <p class="lv4">- Discount With Max Value: Giảm giá theo % khi đạt mức tối thiểu và giới hạn số tiền giảm.
                            Ví dụ: Giảm giá 30% cho hóa đơn từ 100k, tối đa 30k
                          </p>
                          <p class="lv4">- Voucher: Số tiền tương ứng tiền mặt. Ví dụ: Voucher 200k</p>
                          <p class="lv4">- Free item: Miễn phí dv. Ví dụ: miễn phí massage mặt ...</p>

                          <p class="pt-2">Thiết lập để khuyến mãi tự động áp dụng theo khung giờ</p>
                          <p class="lv4">- Tại mục “Khung giờ tự động áp dụng”, bạn chọn “Có”.
                            Sau đó chọn những ngày và giờ bạn muốn khuyến mãi tự động được áp dụng
                          </p>

                          <p>Sau khi hoàn thành khai báo, bạn nhớ nhấn nút "lưu" ở góc trên bên phải nha</p>

                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Thêm hình ảnh cho sản phẩm
                        <i v-show="!isShowImageProduct" class="fa fa-plus pl-3" @click="isShowImageProduct = !isShowImageProduct"></i>
                        <i v-show="isShowImageProduct" class="fa fa-minus pl-3" @click="isShowImageProduct = !isShowImageProduct"></i>
                      </h5>
                      <b-row v-show="isShowImageProduct" class="lv3">
                        <b-col>
                          <p>Để thêm hình ảnh cho sản phẩm, bạn vào menu “Thiết lập”, chọn “Hình ảnh sản phẩm”.</p>
                          <p>Tại màn hình "Hình Ảnh Sản Phẩm", bạn chọn sản phẩm muốn thêm hình ảnh</p>
                          <p class="lv4">Tại mục "Thêm hình ảnh", bạn chọn hình ảnh muốn thêm</p>
                          <p class="lv4">Tại mục "Hình mặc định của sản phẩm", bạn chọn "Có" nếu muốn đây là hình đại diện cho sản phẩm</p>
                          <p class="lv4">Click nút "Upload hình" để thêm hình ảnh mới</p>
                          <p>Danh sách hình ảnh của sản phẩm sẽ show phía dưới cùng.</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Thêm thuộc tính cho sản phẩm
                        <i v-show="!isShowProductProperties" class="fa fa-plus pl-3" @click="isShowProductProperties = !isShowProductProperties"></i>
                        <i v-show="isShowProductProperties" class="fa fa-minus pl-3" @click="isShowProductProperties = !isShowProductProperties"></i>
                      </h5>
                      <b-row v-show="isShowProductProperties" class="lv3">
                        <b-col>
                          <p>Thường được sử dụng cho shop quần áo, mỹ phẩm với thuộc tính như: màu, size, ...</p>
                          <p>Để thêm thuộc tính cho sản phẩm, bạn vào menu “Thiết lập”, chọn “Thuộc tính sản phẩm”.</p>
                          <p>Bạn bấm nút “Thêm” ở góc trên bên phải. Màn hình "Thêm Mới Thuộc Tính Sản Phẩm" sẽ xuất hiện.
                            Trong màn hình, những mục có dấu sao màu đỏ (<span class="text-danger">*</span>) là những mục bắt buộc nhập.
                          </p>
                          <p>Sau khi nhập xong các mục *, bạn click nút "Thêm" để thêm thuộc tính mới</p>
                          <p>Sau khi hoàn tất, bạn click nút "Lưu" ở góc trên bên phải để lưu lại</p>

                        </b-col>
                      </b-row>
                      <p>
                        <img src="/static/img/project/guide/menu_adv_setting.png" class="image-guide"/>
                      </p>

                      <p class="lv1 mb-2"><b>Tham khảo thêm tại mục "Video hướng dẫn"</b></p>
                    </b-col>
                  </b-row>
                  <br>
                </b-col>
              </b-row>

              <b-row class="form-row border-bottom border-warning pt-2">
                <b-col md='12'>
                  <h4 class="text-header">
                    Hướng dẫn sử dụng chức năng
                    <i v-show="!isShowFunctionGuide" class="fa fa-plus pl-3" @click="isShowFunctionGuide = !isShowFunctionGuide"></i>
                    <i v-show="isShowFunctionGuide" class="fa fa-minus pl-3" @click="isShowFunctionGuide = !isShowFunctionGuide"></i>
                  </h4>
                  <b-row v-show="isShowFunctionGuide">
                    <b-col>

                      <h5 class="lv2 pt-3">
                        Bán hàng
                        <i v-show="!isShowGuideOrderSell" class="fa fa-plus pl-3" @click="isShowGuideOrderSell = !isShowGuideOrderSell"></i>
                        <i v-show="isShowGuideOrderSell" class="fa fa-minus pl-3" @click="isShowGuideOrderSell = !isShowGuideOrderSell"></i>
                      </h5>
                      <b-row v-show="isShowGuideOrderSell" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Nhập hàng
                        <i v-show="!isShowGuideOrderBuy" class="fa fa-plus pl-3" @click="isShowGuideOrderBuy = !isShowGuideOrderBuy"></i>
                        <i v-show="isShowGuideOrderBuy" class="fa fa-minus pl-3" @click="isShowGuideOrderBuy = !isShowGuideOrderBuy"></i>
                      </h5>
                      <b-row v-show="isShowGuideOrderBuy" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Kiểm tra sản phẩm đang có trong kho
                        <i v-show="!isShowGuideProInRepo" class="fa fa-plus pl-3" @click="isShowGuideProInRepo = !isShowGuideProInRepo"></i>
                        <i v-show="isShowGuideProInRepo" class="fa fa-minus pl-3" @click="isShowGuideProInRepo = !isShowGuideProInRepo"></i>
                      </h5>
                      <b-row v-show="isShowGuideProInRepo" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                      Quản lý quỹ
                      <i v-show="!isShowGuideFund" class="fa fa-plus pl-3" @click="isShowGuideFund = !isShowGuideFund"></i>
                      <i v-show="isShowGuideFund" class="fa fa-minus pl-3" @click="isShowGuideFund = !isShowGuideFund"></i>
                      </h5>
                      <b-row v-show="isShowGuideFund" class="lv3">
                      <b-col>
                      <p>Xem video hướng dẫn tại mục bên dưới</p>
                      </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Quản lý công nợ (Nợ cần thu hồi)
                        <i v-show="!isShowGuideDebt" class="fa fa-plus pl-3" @click="isShowGuideDebt = !isShowGuideDebt"></i>
                        <i v-show="isShowGuideDebt" class="fa fa-minus pl-3" @click="isShowGuideDebt = !isShowGuideDebt"></i>
                      </h5>
                      <b-row v-show="isShowGuideDebt" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Quản lý nợ công (Nợ cần phải trả)
                        <i v-show="!isShowGuidePublicDebt" class="fa fa-plus pl-3" @click="isShowGuidePublicDebt = !isShowGuidePublicDebt"></i>
                        <i v-show="isShowGuidePublicDebt" class="fa fa-minus pl-3" @click="isShowGuidePublicDebt = !isShowGuidePublicDebt"></i>
                      </h5>
                      <b-row v-show="isShowGuidePublicDebt" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Quản lý khách hàng
                        <i v-show="!isShowGuideCustomer" class="fa fa-plus pl-3" @click="isShowGuideCustomer = !isShowGuideCustomer"></i>
                        <i v-show="isShowGuideCustomer" class="fa fa-minus pl-3" @click="isShowGuideCustomer = !isShowGuideCustomer"></i>
                      </h5>
                      <b-row v-show="isShowGuideCustomer" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Quản lý nhà cung cấp
                        <i v-show="!isShowGuideSupplier" class="fa fa-plus pl-3" @click="isShowGuideSupplier = !isShowGuideSupplier"></i>
                        <i v-show="isShowGuideSupplier" class="fa fa-minus pl-3" @click="isShowGuideSupplier = !isShowGuideSupplier"></i>
                      </h5>
                      <b-row v-show="isShowGuideSupplier" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Xem báo cáo
                        <i v-show="!isShowGuideReport" class="fa fa-plus pl-3" @click="isShowGuideReport = !isShowGuideReport"></i>
                        <i v-show="isShowGuideReport" class="fa fa-minus pl-3" @click="isShowGuideReport = !isShowGuideReport"></i>
                      </h5>
                      <b-row v-show="isShowGuideReport" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

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
                      <p>1. Video hướng dẫn thiết lập căn bản và nâng cao trên web quản lý: <a href="https://www.youtube.com/watch?v=LuHb0-AAxkQ" target="_blank">Xem</a></p>
                      <p>2. Video hướng dẫn thực hiện chức năng trên web quản lý: <a href="https://www.youtube.com/watch?v=ngW-HFhtEC4" target="_blank">Xem</a></p>
                      <p>3. Video hướng dẫn tải app và quản lý công việc trên điện thoại: <a href="https://www.youtube.com/watch?v=w8w_wvmp-jE" target="_blank">Xem</a></p>
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
      isShowPromotion: false,
      isShowImageProduct: false,
      isShowProductProperties: false,
      isShowFunctionGuide: false,
      isShowGuideOrderSell: false,
      isShowGuideOrderBuy: false,
      isShowGuideProInRepo: false,
      isShowGuideFund: false,
      isShowGuideDebt: false,
      isShowGuidePublicDebt: false,
      isShowGuideCustomer: false,
      isShowGuideSupplier: false,
      isShowGuideReport: false,
      isShowVideoGuide: false
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
