<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <form @submit.prevent>
            <div class="grid grid-cols-1 border-b border-yellow-500 pb-2">
              <div class="md:col-span-12">
                <h2 class="text-center text-2xl font-bold">Hướng dẫn sử dụng</h2>
              </div>
            </div>

            <div class="grid grid-cols-1 border-b border-yellow-500 pt-4 pb-2">
              <div class="md:col-span-12">
                <h4 class="font-semibold text-lg cursor-pointer text-orange-500" @click="isShowIntroduction = !isShowIntroduction">
                  Giới thiệu hệ thống
                  <i v-show="!isShowIntroduction" class="fa fa-plus pl-3"></i>
                  <i v-show="isShowIntroduction" class="fa fa-minus pl-3"></i>
                </h4>
                <div v-show="isShowIntroduction" class="mt-3">
                  <h5>ciHotel:</h5>
                  <p class="pl-4">
                    Là hệ thống quản lý giành riêng cho lĩnh vực lưu trú: Khách sạn, nhà nghỉ, homestay.
                  </p>
                  <p class="pl-4">
                    - Hệ thống bao gồm: website quản lý (<a target="_blank" href="https://cihotel.vn" class="text-blue-600 hover:underline">cihotel.vn</a>)
                    và app điện thoại
                  </p>
                </div>
                <br>
              </div>
            </div>

            <div class="grid grid-cols-1 border-b border-yellow-500 pt-4 pb-2">
              <div class="md:col-span-12">
                <h4 class="font-semibold text-lg cursor-pointer text-orange-500" @click="isShowDownApp = !isShowDownApp">
                  Hướng dẫn tải app
                  <i v-show="!isShowDownApp" class="fa fa-plus pl-3"></i>
                  <i v-show="isShowDownApp" class="fa fa-minus pl-3"></i>
                </h4>
                <div v-show="isShowDownApp" class="mt-3">
                  <p>App điện thoại giúp bạn kiểm tra tình hình kinh doanh, tình hình buồng phòng, thao tác đặt phòng, nhận phòng, ... một cách dễ dàng.</p>
                  <p>Để tải app điện thoại:</p>
                  <p class="pl-4">- Đối với điện thoại android: Bạn lên CH play hoặc google play, tìm và tải app "ciHotel"</p>
                  <p class="pl-4">- Đối với điện thoại iOS: Bạn lên app store, tìm và tải app "ciHotel"</p>
                  <p>Sau khi tải app, bạn có thể đăng nhập bằng tài khoản mà chúng tôi (ciinTech) đã cung cấp hoặc từ người quản lý của bạn.</p>
                </div>
                <br>
              </div>
            </div>

            <div class="grid grid-cols-1 border-b border-yellow-500 pt-4 pb-2">
              <div class="md:col-span-12">
                <h4 class="font-semibold text-lg cursor-pointer text-orange-500" @click="isShowBaseSetting = !isShowBaseSetting">
                  Thiết lập ban đầu
                  <i v-show="!isShowBaseSetting" class="fa fa-plus pl-3"></i>
                  <i v-show="isShowBaseSetting" class="fa fa-minus pl-3"></i>
                </h4>
                <div v-show="isShowBaseSetting" class="mt-3">
                  <p>
                    Bạn truy cập web quản lý <a target="_blank" href="https://cihotel.vn" class="text-blue-600 hover:underline">https://cihotel.vn</a>
                    đăng nhập, vào menu "Thiết lập" và thực hiện các bước sau đây:
                  </p>
                  <p class="text-blue-600">
                    ** Nếu bạn chưa rõ cách làm, bạn có thể đăng nhập bằng tài khoản demo
                    của chúng tôi (Số điện thoại: 0968668668, mật khẩu: 123456), xem mẫu và làm tương tự
                  </p>
                  <p class="pl-4 mt-2">
                    <b>1. Thêm tầng(khu vực) (nếu sử dụng):</b>
                    <br>
                    Mỗi phòng cần được chia theo tầng(khu vực) để dễ quản lý.
                    Nếu bạn không muốn chia phòng theo tầng(khu vực), bạn có thể bỏ qua bước này.
                  </p>
                  <p class="pl-4">
                    <b>2. Thêm loại phòng (nếu sử dụng):</b>
                    <br>
                    Hệ thống đã tự động thêm những loại căn bản, bạn hãy sửa lại hoặc thêm mới cho phù hợp với
                    nhu cầu sử dụng của bạn.
                    <br>
                    Ví dụ: Phòng đơn, phòng đôi, phòng nhóm
                  </p>
                  <p class="pl-4">
                    <b>3. Thêm thông tin phòng (nếu sử dụng):</b>
                    <br>
                    Sẽ thật hữu ích cho nhân viên khi biết rõ thông tin của phòng để tư vấn khách hàng.
                    <br>
                    Ví dụ: Có bồn tắm không, có wifi miễn phí không, ....
                    <br>
                    Bạn có thể bỏ qua nếu thấy không cần thiết.
                  </p>
                  <p class="pl-4">
                    <b>4. Thêm thiết bị trong phòng (nếu sử dụng):</b>
                    <br>
                    Việc khai báo này giúp nhân viên buồng phòng, kiểm kê thiết bị khi khách hàng trả phòng.
                    <br>
                    Bạn có thể bỏ qua nếu thấy không cần thiết.
                  </p>
                  <p class="pl-4">
                    <b>5. Thêm phòng (bắt buộc):</b>
                    <br>
                    Đây là việc quan trọng mà bạn bắt buộc làm, bạn hãy thêm phòng phù hợp với khách sạn,
                    nhà nghỉ của bạn.
                  </p>
                  <p class="pl-4">
                    <b>6. Thêm dịch vụ (nếu sử dụng):</b>
                    <br>
                    Nếu khách sạn, nhà nghỉ của bạn có kết hợp các dịch vụ khác, bạn hãy khai báo ở menu này.
                    <br>
                    Ví dụ: dịch vụ giặt đồ, dịch vụ massage, ...
                    <br>
                    Nếu khách sạn, nhà nghỉ của bạn có kết hợp dịch vụ ăn uống, bạn cũng có thể khai báo món ăn ở
                    đây hoặc có thể sử dụng 1 hệ thống quản lý chuyên mảng F&B khác của chúng tôi
                    <a href="https://cifood.vn" target="_blank" class="text-blue-600 hover:underline">cifood.vn</a>
                  </p>
                  <p class="pl-4">
                    <b>7. Khuyến mãi (nếu sử dụng):</b>
                    <br>
                    Các chính sách khuyến mãi sẽ giúp khách sạn, nhà nghỉ của bạn chăm sóc khách hàng 1 các tuyệt vời.
                    <br>
                    Các loại khuyến mãi: Giảm giá, giảm giá tối đa số tiền khi đạt mức thanh toán nào đó, voucher, ...
                  </p>
                  <p class="pl-4">
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
                  <p class="pl-4">
                    <b>9. Thêm nhân viên (bắt buộc):</b>
                    <br>
                    Bạn hãy thêm các nhân viên có trong khách sạn, nhà nghỉ của bạn và phân cho họ nhóm quyền phù hợp.
                  </p>
                  <p class="pl-4">
                    <b>10. Cặt đặt (Hãy thay đổi để phù hợp với bạn):</b>
                    <br>
                    Trong menu này, bạn có thể cài đặt các yếu tố đặc trưng theo khách sạn, nhà nghỉ của bạn như:
                    giờ nhận phòng mặc định, giờ trả phòng mặc định, quá hạn bao lâu thì tính thêm ngày mới, giờ
                    mới, tự động cập nhật phòng dơ khi khách qua đêm, ...
                  </p>
                  <p class="pt-3">
                    <img src="/img/project/guide/menu_base_setting.PNG" class="w-full h-auto"/>
                  </p>
                </div>
                <br>
              </div>
            </div>

            <div class="grid grid-cols-1 border-b border-yellow-500 pt-4 pb-2">
              <div class="md:col-span-12">
                <h4 class="font-semibold text-lg cursor-pointer text-orange-500" @click="isShowFunctionGuide = !isShowFunctionGuide">
                  Hướng dẫn sử dụng chức năng
                  <i v-show="!isShowFunctionGuide" class="fa fa-plus pl-3"></i>
                  <i v-show="isShowFunctionGuide" class="fa fa-minus pl-3"></i>
                </h4>
                <div v-show="isShowFunctionGuide" class="mt-3">
                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideRoom = !isShowGuideRoom">
                    Quản lý buồng phòng
                    <i v-show="!isShowGuideRoom" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideRoom" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideRoom" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideCheckIn = !isShowGuideCheckIn">
                    Nhận phòng nhanh
                    <i v-show="!isShowGuideCheckIn" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideCheckIn" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideCheckIn" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideBooking = !isShowGuideBooking">
                    Đặt phòng
                    <i v-show="!isShowGuideBooking" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideBooking" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideBooking" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuidePayment = !isShowGuidePayment">
                    Thanh toán
                    <i v-show="!isShowGuidePayment" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuidePayment" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuidePayment" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideInfo = !isShowGuideInfo">
                    Xem thông tin chung
                    <i v-show="!isShowGuideInfo" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideInfo" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideInfo" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideSearchRoom = !isShowGuideSearchRoom">
                    Tìm phòng trống
                    <i v-show="!isShowGuideSearchRoom" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideSearchRoom" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideSearchRoom" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideBookingInfo = !isShowGuideBookingInfo">
                    Xem thông tin đặt phòng
                    <i v-show="!isShowGuideBookingInfo" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideBookingInfo" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideBookingInfo" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideCheckInInfo = !isShowGuideCheckInInfo">
                    Xem thông tin khách đang ở
                    <i v-show="!isShowGuideCheckInInfo" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideCheckInInfo" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideCheckInInfo" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideBill = !isShowGuideBill">
                    Quản lý hoá đơn
                    <i v-show="!isShowGuideBill" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideBill" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideBill" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideMoneyBox = !isShowGuideMoneyBox">
                    Quản lý két tiền, thu chi
                    <i v-show="!isShowGuideMoneyBox" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideMoneyBox" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideMoneyBox" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideRepo = !isShowGuideRepo">
                    Quản lý kho hàng
                    <i v-show="!isShowGuideRepo" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideRepo" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideRepo" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideCustomer = !isShowGuideCustomer">
                    Quản lý khách hàng
                    <i v-show="!isShowGuideCustomer" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideCustomer" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideCustomer" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>

                  <h5 class="pl-4 pt-3 cursor-pointer" @click="isShowGuideReport = !isShowGuideReport">
                    Xem báo cáo
                    <i v-show="!isShowGuideReport" class="fa fa-plus pl-3"></i>
                    <i v-show="isShowGuideReport" class="fa fa-minus pl-3"></i>
                  </h5>
                  <div v-show="isShowGuideReport" class="pl-8">
                    <p>Xem video hướng dẫn tại mục bên dưới</p>
                  </div>
                </div>
                <br>
              </div>
            </div>

            <div class="grid grid-cols-1 border-b border-yellow-500 pt-4 pb-2">
              <div class="md:col-span-12">
                <h4 class="font-semibold text-lg cursor-pointer text-orange-500" @click="isShowVideoGuide = !isShowVideoGuide">
                  Video hướng dẫn
                  <i v-show="!isShowVideoGuide" class="fa fa-plus pl-3"></i>
                  <i v-show="isShowVideoGuide" class="fa fa-minus pl-3"></i>
                </h4>
                <div v-show="isShowVideoGuide" class="mt-3">
                  <p>1. Video hướng dẫn thiết lập căn bản: <a href="https://youtu.be/UZmZk7s7tAU" target="_blank" class="text-blue-600 hover:underline">Xem</a></p>
                  <p>2. Video hướng dẫn thực hiện chức năng: <a href="https://www.youtube.com/watch?v=AhisfGARLKU" target="_blank" class="text-blue-600 hover:underline">Xem</a></p>
                  <p>3. Video hướng dẫn tải app và thao tác công việc trên điện thoại: <a href="https://youtu.be/remkX5JySkY" target="_blank" class="text-blue-600 hover:underline">Xem</a></p>
                </div>
                <br>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
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

<style lang="scss" scoped>
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
