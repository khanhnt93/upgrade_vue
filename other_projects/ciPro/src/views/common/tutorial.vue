<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <!-- Header -->
        <div class="text-center mb-6 pb-6 border-b-2 border-yellow-400">
          <h2 class="text-4xl font-bold text-gray-800">Hướng dẫn sử dụng</h2>
        </div>

        <!-- System Introduction Section -->
        <div class="mb-6 pb-6 border-b-2 border-yellow-400">
          <div
            class="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
            @click="isShowIntroduction = !isShowIntroduction"
          >
            <h4 class="text-2xl font-bold text-orange-600">Giới thiệu hệ thống</h4>
            <i
              :class="isShowIntroduction ? 'fa fa-minus' : 'fa fa-plus'"
              class="text-blue-600 text-xl"
            ></i>
          </div>

          <div v-show="isShowIntroduction" class="mt-4 space-y-4">
            <div>
              <h5 class="text-xl font-bold mb-2"><strong>ciPro:</strong></h5>
              <p class="pl-4 text-gray-700 leading-relaxed">
                - Là phần mềm quản lý bán hàng chuyên biệt cho mảng bán hàng thương mại và dịch vụ.
                Ngoài những quản lý căn bản như đơn hàng bán, đơn hàng nhập, xuất nhập kho, quỹ, khách hàng, nhà cung cấp, nợ phải thu, nợ phải trả, các loại báo cáo, ...
                ciPro đặc biệt giúp bạn tạo nhanh một file báo giá (excel hoặc PDF) chỉ trong 30s, mẫu báo giá theo đúng thương hiệu của bạn, giúp bạn có ưu thế hơn có được đơn hàng.
              </p>
              <p class="mt-4 font-bold text-lg">
                <strong>
                  Để sử dụng, bạn thực hiện "Thiết lập" trước. Hướng dẫn chi tiết phía dưới.
                </strong>
              </p>
            </div>
          </div>
        </div>

        <!-- Base Settings Section -->
        <div class="mb-6 pb-6 border-b-2 border-yellow-400">
          <div
            class="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
            @click="isShowBaseSetting = !isShowBaseSetting"
          >
            <h4 class="text-2xl font-bold text-orange-600">Thiết lập</h4>
            <i
              :class="isShowBaseSetting ? 'fa fa-minus' : 'fa fa-plus'"
              class="text-blue-600 text-xl"
            ></i>
          </div>

          <div v-show="isShowBaseSetting" class="mt-4 space-y-6">
            <div class="mb-6">
              <img src="/static/img/project/guide/base_setting.PNG" class="w-full rounded-lg shadow" alt="Base Setting"/>
            </div>

            <div class="space-y-4 text-gray-700">
              <div class="pl-4">
                <p class="font-bold text-lg mb-2">1. Thêm nhóm sản phẩm (bắt buộc):</p>
                <p class="leading-relaxed">
                  Đây là bước khai báo các nhóm sản phẩm có sử dụng trong đơn vị kinh doanh của bạn.
                  Tuỳ vào loại hình kinh doanh, các nhóm sản phẩm này có thề khác nhau.
                  <br>
                  Ví dụ: Quần áo, giày dép, mỹ phẩm, cà phê, phân bón, ...
                  <br>
                  Nếu bạn chưa biết rõ mình có những nhóm sản phẩm nào, bạn có thể khai báo tạm một nhóm nào đó, sau này có thể sửa lại sau hoặc liên hệ bộ phận CSKH của ciPro để được hướng dẫn.
                </p>
              </div>

              <div class="pl-4">
                <p class="font-bold text-lg mb-2">2. Thêm loại sản phẩm (bắt buộc):</p>
                <p class="leading-relaxed">
                  Đây là bước khai báo các loại sản phẩm có sử dụng trong đơn vị kinh doanh của bạn.
                  Tuỳ vào loại hình kinh doanh, các loại sản phẩm này có thề khác nhau.
                  <br>
                  Ví dụ: Đối với nhóm sản phẩm quần áo, có thể có các loại sản phẩm: quần áo nam, quần áo nữ, quần áo
                  trẻ em, .... Đối với nhóm sản phẩm phân bón, có thể có các loại sản phẩm: Phân bón hữu cơ, phân NPK,
                  phân lân, ...
                  <br>
                  Nếu bạn chưa biết rõ mình có những loại sản phẩm nào, bạn có thể khai báo tạm một loại nào đó, sau này có thể sửa lại sau hoặc liên hệ bộ phận CSKH của ciPro để được hướng dẫn.
                </p>
              </div>

              <div class="pl-4">
                <p class="font-bold text-lg mb-2">3. Thêm hãng sản phẩm (bắt buộc):</p>
                <p class="leading-relaxed">
                  Đây là bước khai báo các hãng có sử dụng trong đơn vị kinh doanh của bạn.
                  <br>
                  Ví dụ: Adidas, Bitis, ...
                  <br>
                  Nếu bạn chưa biết rõ mình có những hãng sản phẩm nào, bạn có thể khai báo tạm một loại nào đó, sau này có thể sửa lại sau hoặc liên hệ bộ phận CSKH của ciPro để được hướng dẫn.
                </p>
              </div>

              <div class="pl-4">
                <p class="font-bold text-lg mb-2">4. Thêm đơn vị (bắt buộc):</p>
                <p class="leading-relaxed">
                  Đây là bước khai báo các đơn vị có sử dụng trong đơn vị kinh doanh của bạn. Tuỳ vào loại hình kinh doanh,
                  các đơn vị này có thề khác nhau.
                  <br>
                  Ví dụ: kg, cái, chai, bao, ....
                  <br>
                  Nếu bạn chưa biết rõ mình sử dụng những đơn vị nào, bạn có thể khai báo tạm một đơn vị nào đó, sau này có thể sửa lại sau hoặc liên hệ bộ phận CSKH của ciPro để được hướng dẫn.
                </p>
              </div>

              <div class="pl-4">
                <p class="font-bold text-lg mb-2">5. Thêm sản phẩm - Hàng hoá - DV (bắt buộc):</p>
                <p class="leading-relaxed">
                  Đây là bước khai báo các sản phẩm có sử dụng trong đơn vị kinh doanh của bạn.
                  Tuỳ vào loại hình kinh doanh, các sản phẩm này có thể khác nhau.
                  <br>
                  Ví dụ: Đối với loại sản phẩm là quần áo nam, có thể có các sản phẩm như: áo thun tay ngắn,
                  áo thun tay dài, áo sơ mi, quần tây .... Đối với loại sản phẩm như phân NPK, có thể có các sản
                  phẩm như: phân NPK đầu trâu 16-16-8, phân NPK đầu trâu 16-8-16, ...
                </p>
              </div>

              <div class="pl-4">
                <p class="font-bold text-lg mb-2">6. Thêm dự án mẫu (không bắt buộc):</p>
                <p class="leading-relaxed">
                  Giành riêng cho các cơ sở kinh doanh có khâu sản xuất. Dự án mẫu là phần thiết lập cho việc sản xuất sản phẩm từ các sản phẩm khác.
                </p>
              </div>

              <div class="pl-4">
                <p class="font-bold text-lg mb-2">7. Thêm phân quyền (không bắt buộc):</p>
                <p class="leading-relaxed">
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
              </div>

              <div class="pl-4">
                <p class="font-bold text-lg mb-2">8. Thêm nhân viên (không bắt buộc):</p>
                <p class="leading-relaxed">
                  Bạn hãy thêm các nhân viên của bạn và phân cho họ nhóm quyền phù hợp.
                </p>
              </div>

              <div class="pl-4">
                <p class="font-bold text-lg mb-2">9. Thêm tài khoản ngân hàng (không bắt buộc):</p>
                <p class="leading-relaxed">
                  Thông tin tài khoản ngân hàng sẽ thể hiện trên báo giá.
                </p>
              </div>

              <div class="pl-4">
                <p class="font-bold text-lg mb-2">10. Thêm chuyển đổi đơn vị (không bắt buộc):</p>
                <p class="leading-relaxed">
                  Giành riêng cho các cơ sở kinh doanh, nhập theo một đơn vị nhưng bán theo nhiều đơn vị khác nhau.
                  <br>
                  Ví dụ: Nhập sản phẩm ống công nghiệp theo cuộn nhưng bán theo mét hoặc KG.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Usage Guide Section -->
        <div class="mb-6 pb-6 border-b-2 border-yellow-400">
          <div
            class="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
            @click="isShowUseGuide = !isShowUseGuide"
          >
            <h4 class="text-2xl font-bold text-orange-600">Sử dụng</h4>
            <i
              :class="isShowUseGuide ? 'fa fa-minus' : 'fa fa-plus'"
              class="text-blue-600 text-xl"
            ></i>
          </div>

          <div v-show="isShowUseGuide" class="mt-4">
            <div class="pl-4 space-y-4 text-gray-700">
              <p class="font-bold text-lg">Quy trình sử dụng ciPro thông thường qua các bước sau:</p>
              <ol class="list-decimal list-inside space-y-2 pl-4">
                <li>Tạo báo giá</li>
                <li>Chăm sóc báo giá</li>
                <li>Tạo đơn hàng bán từ báo giá</li>
                <li>Tạo đơn hàng nhập từ đơn hàng bán</li>
                <li>Tạo phiếu nhập kho từ đơn hàng nhập</li>
                <li>Tạo phiếu chi từ đơn hàng nhập</li>
                <li>Tạo phiếu xuất kho từ đơn hàng bán</li>
                <li>Tạo phiếu thu từ đơn hàng bán</li>
              </ol>
              <p class="font-bold mt-4 bg-yellow-50 p-4 rounded-lg">
                Tùy vào nhu cầu sử dụng, tùy vào nghiệp vụ kinh doanh, không nhất thiết phải tuân thủ các bước phía trên, bạn có thể tạo mới đơn hàng bán mà không cần tạo báo giá, bạn cũng có thể tạo đơn hàng nhập kho không phải từ đơn hàng bán... Chi tiết sử dụng, bạn xem video bên dưới để hiểu rõ hơn.
              </p>
            </div>
          </div>
        </div>

        <!-- Video Guide Section -->
        <div class="mb-6 pb-6">
          <div
            class="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
            @click="isShowVideoGuide = !isShowVideoGuide"
          >
            <h4 class="text-2xl font-bold text-orange-600">Video hướng dẫn</h4>
            <i
              :class="isShowVideoGuide ? 'fa fa-minus' : 'fa fa-plus'"
              class="text-blue-600 text-xl"
            ></i>
          </div>

          <div v-show="isShowVideoGuide" class="mt-4">
            <div class="pl-4">
              <p class="text-gray-700">
                Video hướng dẫn:
                <a
                  href="https://www.youtube.com/watch?v=xf3eWO7IlMg"
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700 hover:underline font-bold"
                >
                  Xem
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isShowIntroduction = ref(false)
const isShowBaseSetting = ref(false)
const isShowUseGuide = ref(false)
const isShowVideoGuide = ref(false)
</script>

<style lang="scss" scoped>
</style>
