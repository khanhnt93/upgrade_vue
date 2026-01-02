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
                      <h5>ciHotel:</h5>
                      <p class="lv2">
                        Là hệ thống quản lý giành riêng cho lĩnh vực lưu trú: Khách sạn, nhà nghỉ, homestay.
                      </p>
                      <p class="lv2">
                        - Hệ thống bao gồm: website quản lý (<a target="_blank" href="https://cihotel.vn">cihotel.vn</a>)
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
                      <p>App điện thoại giúp bạn kiểm tra tình hình kinh doanh, tình hình buồng phòng, thao tác đặt phòng, nhận phòng, ... một cách dễ dàng.</p>
                      <p>Để tải app điện thoại:</p>
                      <p class="lv2">- Đối với điện thoại android: Bạn lên CH play hoặc google play, tìm và tải app "ciHotel"</p>
                      <p class="lv2">- Đối với điện thoại iOS: Bạn lên app store, tìm và tải app "ciHotel"</p>
                      <p class="lv1">Sau khi tải app, bạn có thể đăng nhập bằng tài khoản mà chúng tôi (ciinTech) đã cung cấp hoặc từ người quản lý của bạn.</p>
                    </b-col>
                  </b-row>
                  <br>
                </b-col>
              </b-row>

              <b-row class="form-row border-bottom border-warning pt-2">
                <b-col md='12'>
                  <h4 class="text-header">
                    Thiết lập ban đầu
                    <i v-show="!isShowBaseSetting" class="fa fa-plus pl-3" @click="isShowBaseSetting = !isShowBaseSetting"></i>
                    <i v-show="isShowBaseSetting" class="fa fa-minus pl-3" @click="isShowBaseSetting = !isShowBaseSetting"></i>
                  </h4>
                  <b-row v-show="isShowBaseSetting">
                    <b-col>
                      <p>
                        Bạn truy cập web quản lý <a target="_blank" href="https://cihotel.vn">https://cihotel.vn</a>
                        đăng nhập, vào menu "Thiết lập" và thực hiện các bước sau đây:
                      </p>
                      <p class="text-primary">
                        ** Nếu bạn chưa rõ cách làm, bạn có thể đăng nhập bằng tài khoản demo
                        của chúng tôi (Số điện thoại: 0968668668, mật khẩu: 123456), xem mẫu và làm tương tự
                      </p>
                      <p class="lv2">
                        <b>1. Thêm tầng(khu vực) (nếu sử dụng):</b>
                        <br>
                        Mỗi phòng cần được chia theo tầng(khu vực) để dễ quản lý.
                        Nếu bạn không muốn chia phòng theo tầng(khu vực), bạn có thể bỏ qua bước này.
                      </p>
                      <p class="lv2">
                        <b>2. Thêm loại phòng (nếu sử dụng):</b>
                        <br>
                        Hệ thống đã tự động thêm những loại căn bản, bạn hãy sửa lại hoặc thêm mới cho phù hợp với
                        nhu cầu sử dụng của bạn.
                        <br>
                        Ví dụ: Phòng đơn, phòng đôi, phòng nhóm
                      </p>
                      <p class="lv2">
                        <b>3. Thêm thông tin phòng (nếu sử dụng):</b>
                        <br>
                        Sẽ thật hữu ích cho nhân viên khi biết rõ thông tin của phòng để tư vấn khách hàng.
                        <br>
                        Ví dụ: Có bồn tắm không, có wifi miễn phí không, ....
                        <br>
                        Bạn có thể bỏ qua nếu thấy không cần thiết.
                      </p>
                      <p class="lv2">
                        <b>4. Thêm thiết bị trong phòng (nếu sử dụng):</b>
                        <br>
                        Việc khai báo này giúp nhân viên buồng phòng, kiểm kê thiết bị khi khách hàng trả phòng.
                        <br>
                        Bạn có thể bỏ qua nếu thấy không cần thiết.
                      </p>
                      <p class="lv2">
                        <b>5. Thêm phòng (bắt buộc):</b>
                        <br>
                        Đây là việc quan trọng mà bạn bắt buộc làm, bạn hãy thêm phòng phù hợp với khách sạn,
                        nhà nghỉ của bạn.
                      </p>
                      <p class="lv2">
                        <b>6. Thêm dịch vụ (nếu sử dụng):</b>
                        <br>
                        Nếu khách sạn, nhà nghỉ của bạn có kết hợp các dịch vụ khác, bạn hãy khai báo ở menu này.
                        <br>
                        Ví dụ: dịch vụ giặt đồ, dịch vụ massage, ...
                        <br>
                        Nếu khách sạn, nhà nghỉ của bạn có kết hợp dịch vụ ăn uống, bạn cũng có thể khai báo món ăn ở
                        đây hoặc có thể sử dụng 1 hệ thống quản lý chuyên mảng F&B khác của chúng tôi
                        <a href="https://cifood.vn" target="_blank">cifood.vn</a>
                      </p>
                      <p class="lv2">
                        <b>7. Khuyến mãi (nếu sử dụng):</b>
                        <br>
                        Các chính sách khuyến mãi sẽ giúp khách sạn, nhà nghỉ của bạn chăm sóc khách hàng 1 các tuyệt
                        vời.
                        <br>
                        Các loại khuyến mãi: Giảm giá, giảm giá tối đa số tiền khi đạt mức thanh toán nào đó, voucher, ...
                      </p>
                      <p class="lv2">
                        <b>8. Thêm nhóm quyền (bắt buộc):</b>
                        <br>
                        Việc khai báo nhóm quyền cho phép khách sạn, nhà nghỉ của bạn phân quyền làm 1 việc vụ thể nào
                        đó cho từng nhân viên hoặc từng nhóm nhân viên.
                        <br>
                        Ví dụ:
                        Nhân viên tạp vụ chỉ được quyền cập nhật tình trạng phòng, chỉ nhân viên kế toán được xem thông
                        tin báo cáo doanh thu, ...
                        <br>
                        Hệ thống đã thêm các nhóm quyền mặc định, bạn có thể thêm mới hoặc chỉnh sửa các nhóm quyền đã
                        cho phù hợp.
                      </p>
                      <p class="lv2">
                        <b>9. Thêm nhân viên (bắt buộc):</b>
                        <br>
                        Bạn hãy thêm các nhân viên có trong khách sạn, nhà nghỉ của bạn và phân cho họ nhóm quyền phù
                        hợp.
                      </p>
                      <p class="lv2">
                        <b>10. Cặt đặt (Hãy thay đổi để phù hợp với bạn):</b>
                        <br>
                        Trong menu này, bạn có thể cài đặt các yếu tố đặc trưng theo khách sạn, nhà nghỉ của bạn như:
                        giờ nhận phòng mặc định, giờ trả phòng mặc định, quá hạn bao lâu thì tính thêm ngày mới, giờ
                        mới, tự động cập nhật phòng dơ khi khách qua đêm, ...
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
                    Hướng dẫn sử dụng chức năng
                    <i v-show="!isShowFunctionGuide" class="fa fa-plus pl-3" @click="isShowFunctionGuide = !isShowFunctionGuide"></i>
                    <i v-show="isShowFunctionGuide" class="fa fa-minus pl-3" @click="isShowFunctionGuide = !isShowFunctionGuide"></i>
                  </h4>
                  <b-row v-show="isShowFunctionGuide">
                    <b-col>

                      <h5 class="lv2 pt-3">
                        Quản lý buồng phòng
                        <i v-show="!isShowGuideRoom" class="fa fa-plus pl-3" @click="isShowGuideRoom = !isShowGuideRoom"></i>
                        <i v-show="isShowGuideRoom" class="fa fa-minus pl-3" @click="isShowGuideRoom = !isShowGuideRoom"></i>
                      </h5>
                      <b-row v-show="isShowGuideRoom" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Nhận phòng nhanh
                        <i v-show="!isShowGuideCheckIn" class="fa fa-plus pl-3" @click="isShowGuideCheckIn = !isShowGuideCheckIn"></i>
                        <i v-show="isShowGuideCheckIn" class="fa fa-minus pl-3" @click="isShowGuideCheckIn = !isShowGuideCheckIn"></i>
                      </h5>
                      <b-row v-show="isShowGuideCheckIn" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Đặt phòng
                        <i v-show="!isShowGuideBooking" class="fa fa-plus pl-3" @click="isShowGuideBooking = !isShowGuideBooking"></i>
                        <i v-show="isShowGuideBooking" class="fa fa-minus pl-3" @click="isShowGuideBooking = !isShowGuideBooking"></i>
                      </h5>
                      <b-row v-show="isShowGuideBooking" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Thanh toán
                        <i v-show="!isShowGuidePayment" class="fa fa-plus pl-3" @click="isShowGuidePayment = !isShowGuidePayment"></i>
                        <i v-show="isShowGuidePayment" class="fa fa-minus pl-3" @click="isShowGuidePayment = !isShowGuidePayment"></i>
                      </h5>
                      <b-row v-show="isShowGuidePayment" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Xem thông tin chung
                        <i v-show="!isShowGuideInfo" class="fa fa-plus pl-3" @click="isShowGuideInfo = !isShowGuideInfo"></i>
                        <i v-show="isShowGuideInfo" class="fa fa-minus pl-3" @click="isShowGuideInfo = !isShowGuideInfo"></i>
                      </h5>
                      <b-row v-show="isShowGuideInfo" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Tìm phòng trống
                        <i v-show="!isShowGuideSearchRoom" class="fa fa-plus pl-3" @click="isShowGuideSearchRoom = !isShowGuideSearchRoom"></i>
                        <i v-show="isShowGuideSearchRoom" class="fa fa-minus pl-3" @click="isShowGuideSearchRoom = !isShowGuideSearchRoom"></i>
                      </h5>
                      <b-row v-show="isShowGuideSearchRoom" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Xem thông tin đặt phòng
                        <i v-show="!isShowGuideBookingInfo" class="fa fa-plus pl-3" @click="isShowGuideBookingInfo = !isShowGuideBookingInfo"></i>
                        <i v-show="isShowGuideBookingInfo" class="fa fa-minus pl-3" @click="isShowGuideBookingInfo = !isShowGuideBookingInfo"></i>
                      </h5>
                      <b-row v-show="isShowGuideBookingInfo" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Xem thông tin khách đang ở
                        <i v-show="!isShowGuideCheckInInfo" class="fa fa-plus pl-3" @click="isShowGuideCheckInInfo = !isShowGuideCheckInInfo"></i>
                        <i v-show="isShowGuideCheckInInfo" class="fa fa-minus pl-3" @click="isShowGuideCheckInInfo = !isShowGuideCheckInInfo"></i>
                      </h5>
                      <b-row v-show="isShowGuideCheckInInfo" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Quản lý hoá đơn
                        <i v-show="!isShowGuideBill" class="fa fa-plus pl-3" @click="isShowGuideBill = !isShowGuideBill"></i>
                        <i v-show="isShowGuideBill" class="fa fa-minus pl-3" @click="isShowGuideBill = !isShowGuideBill"></i>
                      </h5>
                      <b-row v-show="isShowGuideBill" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Quản lý két tiền, thu chi
                        <i v-show="!isShowGuideMoneyBox" class="fa fa-plus pl-3" @click="isShowGuideMoneyBox = !isShowGuideMoneyBox"></i>
                        <i v-show="isShowGuideMoneyBox" class="fa fa-minus pl-3" @click="isShowGuideMoneyBox = !isShowGuideMoneyBox"></i>
                      </h5>
                      <b-row v-show="isShowGuideMoneyBox" class="lv3">
                        <b-col>
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </b-col>
                      </b-row>

                      <h5 class="lv2 pt-3">
                        Quản lý kho hàng
                        <i v-show="!isShowGuideRepo" class="fa fa-plus pl-3" @click="isShowGuideRepo = !isShowGuideRepo"></i>
                        <i v-show="isShowGuideRepo" class="fa fa-minus pl-3" @click="isShowGuideRepo = !isShowGuideRepo"></i>
                      </h5>
                      <b-row v-show="isShowGuideRepo" class="lv3">
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
                      <p>1. Video hướng dẫn thiết lập căn bản: <a href="https://youtu.be/UZmZk7s7tAU" target="_blank">Xem</a></p>
                      <p>2. Video hướng dẫn thực hiện chức năng: <a href="https://www.youtube.com/watch?v=AhisfGARLKU" target="_blank">Xem</a></p>
                      <p>3. Video hướng dẫn tải app và thao tác công việc trên điện thoại: <a href="https://youtu.be/remkX5JySkY" target="_blank">Xem</a></p>
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
      isShowVideoGuide: false,
      isShowGuideRoom: false,
      isShowGuideCheckIn: false,
      isShowGuideBooking: false,
      isShowGuidePayment: false,
      isShowGuideInfo: false,
      isShowGuideSearchRoom: false,
      isShowGuideBookingInfo: false,
      isShowGuideCheckInInfo: false,
      isShowGuideBill: false,
      isShowGuideMoneyBox: false,
      isShowGuideRepo: false,
      isShowGuideCustomer: false,
      isShowGuideReport: false
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
