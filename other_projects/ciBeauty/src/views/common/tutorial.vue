<template>
  <div class="container-fluid">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="card-body p-4"  >
            <form>

              <div class="grid grid-cols-12 gap-4 form-row border-bottom border-warning">
                <div class="col-span-12">
                  <h2 class="text-center">Hướng dẫn sử dụng</h2>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 form-row border-bottom border-warning pt-2">
                <div class="col-span-12">
                  <h4 class="text-header">
                    Giới thiệu hệ thống
                    <i v-show="!isShowIntroduction" class="fa fa-plus pl-3" @click="isShowIntroduction = !isShowIntroduction"></i>
                    <i v-show="isShowIntroduction" class="fa fa-minus pl-3" @click="isShowIntroduction = !isShowIntroduction"></i>
                  </h4>
                  <div class="grid grid-cols-12 gap-4" v-show="isShowIntroduction">
                    <div class="col-span-full">
                      <h5>ciBeauty là hệ thống phần mềm quản lý online cho spa, thẩm mỹ viện.</h5>
                      <h5>Hệ thống bao gồm:</h5>
                      <p class="lv2">- Web quản lý: <a target="_blank" href="https://cibeauty.vn">https://cibeauty.vn</a></p>
                      <p class="lv2">- App máy tính tại quầy (app thu ngân)</p>
                      <p class="lv2">- App điện thoại(android và IOS) giúp nhân viên chăm sóc khách hàng ngay tại
                        giường spa, chủ spa quản lý điều hành từ xa</p>
                      <p class="lv1">Tùy vào nhu cầu của mỗi spa, thẩm mỹ viện, có thể chỉ sử dụng mỗi app điện thoại hoặc tất cả các app trên.</p>
                    </div>
                  </div>
                  <br>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 form-row border-bottom border-warning pt-2">
                <div class="col-span-12">
                  <h4 class="text-header">
                    Hướng dẫn tải app
                    <i v-show="!isShowDownApp" class="fa fa-plus pl-3" @click="isShowDownApp = !isShowDownApp"></i>
                    <i v-show="isShowDownApp" class="fa fa-minus pl-3" @click="isShowDownApp = !isShowDownApp"></i>
                  </h4>
                  <div class="grid grid-cols-12 gap-4" v-show="isShowDownApp">
                    <div class="col-span-full">
                      <p>Tùy vào nhu cầu sử dụng, nhà hàng bạn có thể tải app điện thoại, app máy tính hoặc cả hai.</p>
                      <p>Để tải app điện thoại:</p>
                      <p class="lv2">- Đối với điện thoại android: Bạn lên CH play hoặc google play, tìm và tải app "ciBeauty"</p>
                      <p class="lv2">- Đối với điện thoại iOS: Bạn lên app store, tìm và tải app "ciBeauty"</p>
                      <p>Để tài app máy tính (app thu ngân):</p>
                      <p class="lv2">- Đối với máy tính windows <a target="_blank" href="https://api.cibeauty.vn/files/setup/ciBeauty-Setup-1.0.1.exe">Tải xuống</a></p>
                    </div>
                  </div>
                  <br>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 form-row border-bottom border-warning pt-2">
                <div class="col-span-12">
                  <h4 class="text-header">
                    Thiết lập căn bản
                    <i v-show="!isShowBaseSetting" class="fa fa-plus pl-3" @click="isShowBaseSetting = !isShowBaseSetting"></i>
                    <i v-show="isShowBaseSetting" class="fa fa-minus pl-3" @click="isShowBaseSetting = !isShowBaseSetting"></i>
                  </h4>
                  <div class="grid grid-cols-12 gap-4" v-show="isShowBaseSetting">
                    <div class="col-span-full">
                      <p>Bạn truy cập web quản lý <a target="_blank" href="https://cibeauty.vn">https://cibeauty.vn</a> đăng nhập và thực hiện các bước sau đây</p>
                      <p class="text-primary">** Nếu bạn chưa rõ cách làm, bạn có thể đăng nhập bằng tài khoản demo của chúng tôi (Số điện thoại: 0999888999, mật khẩu: 12345678), xem mẫu và làm tương tự </p>
                      <p class="lv2">1. Thêm khu vực giường (nếu dùng)</p>
                      <p class="lv2">2. Thêm giường</p>
                      <p class="lv2">3. Thêm danh mục (nếu dùng)</p>
                      <p class="lv2">4. Thêm dịch vụ</p>
                      <p class="lv2">5. Thêm nhóm quyền (đã có sẵn các nhóm quyền căn bản)</p>
                      <p class="lv2">6. Thêm nhân viên</p>
                      <p class="lv1 mb-2"><b>Tham khảo thêm tại mục "Video hướng dẫn"</b></p>
                      <p>
                        <img src="/img/project/guide/base_setting.PNG" class="image-logo"/>
                      </p>
                    </div>
                  </div>
                  <br>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 form-row border-bottom border-warning pt-2">
                <div class="col-span-12">
                  <h4 class="text-header">
                    Thiết lập nâng cao
                    <i v-show="!isShowSetting" class="fa fa-plus pl-3" @click="isShowSetting = !isShowSetting"></i>
                    <i v-show="isShowSetting" class="fa fa-minus pl-3" @click="isShowSetting = !isShowSetting"></i>
                  </h4>
                  <div class="grid grid-cols-12 gap-4" v-show="isShowSetting">
                    <div class="col-span-full">
                      <p>Bạn truy cập web quản lý <a target="_blank" href="https://cibeauty.vn">https://cibeauty.vn</a> đăng nhập và thực hiện các bước sau đây</p>
                      <p class="text-primary">** Nếu bạn chưa rõ cách làm, bạn có thể đăng nhập bằng tài khoản demo của chúng tôi (Số điện thoại: 0999888999, mật khẩu: 12345678), xem mẫu và làm tương tự </p>

                      <h5 class="lv2 pt-3">
                        Thêm khuyến mãi
                        <i v-show="!isShowPromotion" class="fa fa-plus pl-3" @click="isShowPromotion = !isShowPromotion"></i>
                        <i v-show="isShowPromotion" class="fa fa-minus pl-3" @click="isShowPromotion = !isShowPromotion"></i>
                      </h5>
                      <div v-show="isShowPromotion" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
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

                          <p>
                            <img src="/img/project/guide/promotion.PNG" class="image-guide"/>
                          </p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Thêm quản lý kho
                        <i v-show="!isShowRepository" class="fa fa-plus pl-3" @click="isShowRepository = !isShowRepository"></i>
                        <i v-show="isShowRepository" class="fa fa-minus pl-3" @click="isShowRepository = !isShowRepository"></i>
                      </h5>
                      <div v-show="isShowRepository" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Để tự động quản lý kho, bạn làm các bước sau:</p>

                          <p class="lv3">- Bước 1: Thêm đơn vị</p>
                          <p class="lv4">- Để thêm đơn vị, bạn vào menu “Quản lý kho hàng”, chọn “Đơn vị”</p>
                          <p class="lv4">- Thêm mới các đơn vị cần thiết trong nhà hàng. Ví dụ: gram, ml, lit, cái, chai, lon,...</p>
                          <p>
                            <img src="/img/project/guide/unit.PNG" class="image-guide"/>
                          </p>
                          <p class="lv3">- Bước 2: Thêm nguyên liệu, mặt hàng</p>
                          <p class="lv4">- Để thêm nguyên liệu, mặt hàng, bạn vào menu “Quản lý kho hàng”, chọn “Nguyên liệu, mặt hàng”</p>
                          <p class="lv4">- Thêm mới các nguyên liệu, mặt hàng trong kho. Ví dụ: cafe bột, sữa tươi, coca, ...
                          </p>
                          <p>
                            <img src="/img/project/guide/resource.PNG" class="image-guide"/>
                          </p>
                          <p class="lv3">- Bước 3: Set nguyên liệu cho dv</p>
                          <p class="lv4">- Để set nguyên liệu cho dv, bạn vào menu “Thiết lập”, chọn "Dịch vụ"</p>
                          <p class="lv4">
                            - Trong màn hình khai báo mới hoặc cập nhập "Dịch vụ", tại mục “Nguyên liệu”, bạn click dấu "+".
                            Trên popup "Chọn nguyên liệu", bạn chọn nguyên liệu, nhập số lượng, sau đó nhấn "Thêm". Sau khi thêm đủ, nhấn "Xác nhận"
                          </p>
                          <p>
                            <img src="/img/project/guide/chose_resource.PNG" class="image-guide"/>
                          </p>

                          <p>Sau khi hoàn thành các bước trên, khi thanh toán, nguyên liệu sẽ tự động trừ trong kho.</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Thêm cài đặt cho spa
                        <i v-show="!isShowStoreSetting" class="fa fa-plus pl-3" @click="isShowStoreSetting = !isShowStoreSetting"></i>
                        <i v-show="isShowStoreSetting" class="fa fa-minus pl-3" @click="isShowStoreSetting = !isShowStoreSetting"></i>
                      </h5>
                      <div v-show="isShowStoreSetting" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>- Mỗi spa có thể có cài đặt riêng biệt phù hợp với hoạt động của mình như có bao
                          gồm thuế VAT khi thanh toán, có sử dụng kho hàng, ....</p>
                          <p>- Để vào cài đặt, bạn vào menu "Thiết lập", chọn "Cài đặt"</p>
                          <p>- Trong màn hình "Cài đặt", bạn chọn cho phù hợp rồi nhấn "Lưu" nhé</p>
                          <p>
                            <img src="/img/project/guide/store_setting.PNG" class="image-guide"/>
                          </p>
                        </div>
                      </div>
                      <p class="lv1 mb-2"><b>Tham khảo thêm tại mục "Video hướng dẫn"</b></p>
                    </div>
                  </div>
                  <br>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 form-row border-bottom border-warning pt-2">
                <div class="col-span-12">
                  <h4 class="text-header">
                    Hướng dẫn sử dụng chức năng
                    <i v-show="!isShowFunctionGuide" class="fa fa-plus pl-3" @click="isShowFunctionGuide = !isShowFunctionGuide"></i>
                    <i v-show="isShowFunctionGuide" class="fa fa-minus pl-3" @click="isShowFunctionGuide = !isShowFunctionGuide"></i>
                  </h4>
                  <div class="grid grid-cols-12 gap-4" v-show="isShowFunctionGuide">
                    <div class="col-span-full">

                      <h5 class="lv2 pt-3">
                        Gọi dv
                        <i v-show="!isShowGuideOrder" class="fa fa-plus pl-3" @click="isShowGuideOrder = !isShowGuideOrder"></i>
                        <i v-show="isShowGuideOrder" class="fa fa-minus pl-3" @click="isShowGuideOrder = !isShowGuideOrder"></i>
                      </h5>
                      <div v-show="isShowGuideOrder" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Thanh toán
                        <i v-show="!isShowGuidePayment" class="fa fa-plus pl-3" @click="isShowGuidePayment = !isShowGuidePayment"></i>
                        <i v-show="isShowGuidePayment" class="fa fa-minus pl-3" @click="isShowGuidePayment = !isShowGuidePayment"></i>
                      </h5>
                      <div v-show="isShowGuidePayment" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Đổi giường
                        <i v-show="!isShowGuideChangeTable" class="fa fa-plus pl-3" @click="isShowGuideChangeTable = !isShowGuideChangeTable"></i>
                        <i v-show="isShowGuideChangeTable" class="fa fa-minus pl-3" @click="isShowGuideChangeTable = !isShowGuideChangeTable"></i>
                      </h5>
                      <div v-show="isShowGuideChangeTable" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <!--<h5 class="lv2 pt-3">-->
                        <!--Gộp bàn-->
                        <!--<i v-show="!isShowGuideMergeTable" class="fa fa-plus pl-3" @click="isShowGuideMergeTable = !isShowGuideMergeTable"></i>-->
                        <!--<i v-show="isShowGuideMergeTable" class="fa fa-minus pl-3" @click="isShowGuideMergeTable = !isShowGuideMergeTable"></i>-->
                      <!--</h5>-->
                      <!--<div v-show="isShowGuideMergeTable" class="grid grid-cols-12 gap-4 lv3">-->
                        <!--<div class="col-span-full">-->
                          <!--<p>Xem video hướng dẫn tại mục bên dưới</p>-->
                        <!--</div>-->
                      <!--</div>-->

                      <h5 class="lv2 pt-3">
                        Dọn giường
                        <i v-show="!isShowGuideCleanTable" class="fa fa-plus pl-3" @click="isShowGuideCleanTable = !isShowGuideCleanTable"></i>
                        <i v-show="isShowGuideCleanTable" class="fa fa-minus pl-3" @click="isShowGuideCleanTable = !isShowGuideCleanTable"></i>
                      </h5>
                      <div v-show="isShowGuideCleanTable" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Hủy dv
                        <i v-show="!isShowGuideCancelService" class="fa fa-plus pl-3" @click="isShowGuideCancelService = !isShowGuideCancelService"></i>
                        <i v-show="isShowGuideCancelService" class="fa fa-minus pl-3" @click="isShowGuideCancelService = !isShowGuideCancelService"></i>
                      </h5>
                      <div v-show="isShowGuideCancelService" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Hủy order
                        <i v-show="!isShowGuideCancelOrder" class="fa fa-plus pl-3" @click="isShowGuideCancelOrder = !isShowGuideCancelOrder"></i>
                        <i v-show="isShowGuideCancelOrder" class="fa fa-minus pl-3" @click="isShowGuideCancelOrder = !isShowGuideCancelOrder"></i>
                      </h5>
                      <div v-show="isShowGuideCancelOrder" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Quản lý gọi dv
                        <i v-show="!isShowGuideManOrder" class="fa fa-plus pl-3" @click="isShowGuideManOrder = !isShowGuideManOrder"></i>
                        <i v-show="isShowGuideManOrder" class="fa fa-minus pl-3" @click="isShowGuideManOrder = !isShowGuideManOrder"></i>
                      </h5>
                      <div v-show="isShowGuideManOrder" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Xem lịch sử gọi dv
                        <i v-show="!isShowGuideOrderHistory" class="fa fa-plus pl-3" @click="isShowGuideOrderHistory = !isShowGuideOrderHistory"></i>
                        <i v-show="isShowGuideOrderHistory" class="fa fa-minus pl-3" @click="isShowGuideOrderHistory = !isShowGuideOrderHistory"></i>
                      </h5>
                      <div v-show="isShowGuideOrderHistory" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Xem lịch sử bill
                        <i v-show="!isShowGuideBillHistory" class="fa fa-plus pl-3" @click="isShowGuideBillHistory = !isShowGuideBillHistory"></i>
                        <i v-show="isShowGuideBillHistory" class="fa fa-minus pl-3" @click="isShowGuideBillHistory = !isShowGuideBillHistory"></i>
                      </h5>
                      <div v-show="isShowGuideBillHistory" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        In lại bill cũ
                        <i v-show="!isShowGuidePrintOldBill" class="fa fa-plus pl-3" @click="isShowGuidePrintOldBill = !isShowGuidePrintOldBill"></i>
                        <i v-show="isShowGuidePrintOldBill" class="fa fa-minus pl-3" @click="isShowGuidePrintOldBill = !isShowGuidePrintOldBill"></i>
                      </h5>
                      <div v-show="isShowGuidePrintOldBill" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Xóa bill
                        <i v-show="!isShowGuideDeleteBill" class="fa fa-plus pl-3" @click="isShowGuideDeleteBill = !isShowGuideDeleteBill"></i>
                        <i v-show="isShowGuideDeleteBill" class="fa fa-minus pl-3" @click="isShowGuideDeleteBill = !isShowGuideDeleteBill"></i>
                      </h5>
                      <div v-show="isShowGuideDeleteBill" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Quản lý kho hàng
                        <i v-show="!isShowGuideManRepository" class="fa fa-plus pl-3" @click="isShowGuideManRepository = !isShowGuideManRepository"></i>
                        <i v-show="isShowGuideManRepository" class="fa fa-minus pl-3" @click="isShowGuideManRepository = !isShowGuideManRepository"></i>
                      </h5>
                      <div v-show="isShowGuideManRepository" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Quản lý két tiền, thu chi
                        <i v-show="!isShowGuideManMoneyBox" class="fa fa-plus pl-3" @click="isShowGuideManMoneyBox = !isShowGuideManMoneyBox"></i>
                        <i v-show="isShowGuideManMoneyBox" class="fa fa-minus pl-3" @click="isShowGuideManMoneyBox = !isShowGuideManMoneyBox"></i>
                      </h5>
                      <div v-show="isShowGuideManMoneyBox" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Giao ca
                        <i v-show="!isShowGuideChangeShift" class="fa fa-plus pl-3" @click="isShowGuideChangeShift = !isShowGuideChangeShift"></i>
                        <i v-show="isShowGuideChangeShift" class="fa fa-minus pl-3" @click="isShowGuideChangeShift = !isShowGuideChangeShift"></i>
                      </h5>
                      <div v-show="isShowGuideChangeShift" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Xem báo cáo bán hàng
                        <i v-show="!isShowGuideReport" class="fa fa-plus pl-3" @click="isShowGuideReport = !isShowGuideReport"></i>
                        <i v-show="isShowGuideReport" class="fa fa-minus pl-3" @click="isShowGuideReport = !isShowGuideReport"></i>
                      </h5>
                      <div v-show="isShowGuideReport" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                      <h5 class="lv2 pt-3">
                        Quản lý và chăm sóc khách hàng
                        <i v-show="!isShowGuideManCustomer" class="fa fa-plus pl-3" @click="isShowGuideManCustomer = !isShowGuideManCustomer"></i>
                        <i v-show="isShowGuideManCustomer" class="fa fa-minus pl-3" @click="isShowGuideManCustomer = !isShowGuideManCustomer"></i>
                      </h5>
                      <div v-show="isShowGuideManCustomer" class="grid grid-cols-12 gap-4 lv3">
                        <div class="col-span-full">
                          <p>Xem video hướng dẫn tại mục bên dưới</p>
                        </div>
                      </div>

                    </div>
                  </div>
                  <br>
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 form-row border-bottom border-warning pt-2">
                <div class="col-span-12">
                  <h4 class="text-header">
                    Video hướng dẫn
                    <i v-show="!isShowVideoGuide" class="fa fa-plus pl-3" @click="isShowVideoGuide = !isShowVideoGuide"></i>
                    <i v-show="isShowVideoGuide" class="fa fa-minus pl-3" @click="isShowVideoGuide = !isShowVideoGuide"></i>
                  </h4>
                  <div class="grid grid-cols-12 gap-4" v-show="isShowVideoGuide">
                    <div class="col-span-full">
                      <p>- Video hướng dẫn truy cập web quản lý và thiết lập spa: <a href="https://youtu.be/m5F9sgMMGC4" target="_blank">Xem</a></p>
                      <p>- Video hướng dẫn tải và sử dụng app điện thoại: <a href="https://youtu.be/PDnjth17IZw" target="_blank" >Xem</a></p>
                      <p>- Video hướng dẫn tải và sử dụng app thu ngân (app máy tính): <a href="https://youtu.be/oOtzBC5e72s" target="_blank" >Xem</a></p>
                    </div>
                  </div>
                  <br>
                </div>
              </div>

              </form>
          </div>
        </div>
      </div>
    </div>
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
      isShowGuideOrder: false,
      isShowGuidePayment: false,
      isShowGuideChangeTable: false,
      isShowGuideMergeTable: false,
      isShowGuideCancelService: false,
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
