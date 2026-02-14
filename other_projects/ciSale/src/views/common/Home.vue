<template>
  <div class="min-h-screen bg-gray-50" ref="scrollParent">
    <!-- Hero Section -->
    <header class="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden" id="bodyHome">
      <div id="home" class="relative">
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        <img src="/static/img/project/home/banner-bg.jpg" class="w-full h-[60vh] md:h-[70vh] object-cover" alt="Banner"/>

        <!-- Hero Content Overlay -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center text-white px-4 max-w-4xl">
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span class="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">ciSale</span>
            </h1>
            <p class="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-100 leading-relaxed">
              Giải Pháp Trọn Vẹn Cho Quản Lý Bán Hàng & Tài Chính
            </p>
            <button class="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    @click="scrollToFunction()">
              Khám Phá Ngay
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section id="features" class="py-20 lg:py-32 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16 lg:mb-20">
          <div class="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            Tính Năng Nổi Bật
          </div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span class="text-blue-600">ciSale</span> - Giải Pháp Hoàn Hảo
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hệ thống quản lý bán hàng và tài chính toàn diện, giúp doanh nghiệp vận hành hiệu quả
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <!-- Feature 1 -->
          <div class="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200">
            <div class="relative mb-8">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <i class="lni-cog text-white text-3xl"></i>
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-75 group-hover:scale-125 transition-transform duration-300"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
              Quản Lý Từ Xa
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Làm việc hiệu quả mọi lúc, mọi nơi với khả năng truy cập dữ liệu real-time và quản lý toàn bộ hoạt động kinh doanh từ xa.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-purple-200">
            <div class="relative mb-8">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <i class="lni-baloon text-white text-3xl"></i>
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full opacity-75 group-hover:scale-125 transition-transform duration-300"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
              Hiệu Quả Quản Lý
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Tích hợp hoàn hảo giữa bán hàng và tài chính. Quản lý quỹ, công nợ, kho hàng một cách thông minh và hiệu quả.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-orange-200 md:col-span-2 lg:col-span-1">
            <div class="relative mb-8">
              <div class="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <i class="lni-bolt-alt text-white text-3xl"></i>
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-75 group-hover:scale-125 transition-transform duration-300"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
              Tiết Kiệm Chi Phí
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Không cần đầu tư thiết bị đắt đỏ. Hoạt động mượt mà trên mọi thiết bị từ máy tính đến smartphone.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 1 -->
    <section id="about" class="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <!-- Content -->
          <div class="order-2 lg:order-1">
            <div class="inline-block px-4 py-2 bg-blue-200 text-blue-700 rounded-full text-sm font-medium mb-6">
              Đa Dạng Ứng Dụng
            </div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Cấu Trúc
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Phù Hợp Mọi Loại Hình
              </span>
              Kinh Doanh
            </h2>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              ciSale được thiết kế linh hoạt, phù hợp với mọi quy mô từ doanh nghiệp lớn đến các cửa hàng nhỏ lẻ.
              Tùy chỉnh theo nhu cầu riêng của bạn.
            </p>
            <button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    @click="scrollBottom()">
              Liên Hệ Ngay
            </button>
          </div>

          <!-- Image -->
          <div class="order-1 lg:order-2">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl transform rotate-3 opacity-20"></div>
              <img src="/static/img/project/home/loai_nha_hang.jpg"
                   alt="Loại hình nhà hàng, quán ăn"
                   class="relative rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 2 -->
    <section class="py-20 lg:py-32 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <!-- Image -->
          <div class="order-1">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl transform -rotate-3 opacity-20"></div>
              <img src="/static/img/project/home/header-hero.jpg"
                   alt="Thiết bị đa dạng"
                   class="relative rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105"/>
            </div>
          </div>

          <!-- Content -->
          <div class="order-2">
            <div class="inline-block px-4 py-2 bg-green-200 text-green-700 rounded-full text-sm font-medium mb-6">
              Đa Nền Tảng
            </div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Hệ Thống
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Hoạt Động Mọi Thiết Bị
              </span>
            </h2>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              Trải nghiệm mượt mà trên laptop, máy tính bàn, tablet và smartphone.
              Giao diện responsive thích ứng hoàn hảo với mọi kích thước màn hình.
            </p>
            <button class="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    @click="scrollBottom()">
              Liên Hệ Ngay
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 3 -->
    <section class="py-20 lg:py-32 bg-gradient-to-br from-purple-50 to-pink-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <!-- Content -->
          <div class="order-2 lg:order-1">
            <div class="inline-block px-4 py-2 bg-purple-200 text-purple-700 rounded-full text-sm font-medium mb-6">
              Giao Diện Thân Thiện
            </div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Giao Diện
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Đơn Giản & Dễ Sử Dụng
              </span>
            </h2>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              Thiết kế tối ưu theo tần suất sử dụng, giảm thiểu thời gian đào tạo.
              Nhân viên có thể thành thạo ngay từ lần đầu sử dụng.
            </p>
            <button class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    @click="scrollBottom()">
              Liên Hệ Ngay
            </button>
          </div>

          <!-- Image -->
          <div class="order-1 lg:order-2">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl transform rotate-3 opacity-20"></div>
              <img src="/static/img/project/home/giao_dien_don_gian.jpg"
                   alt="Giao diện đơn giản"
                   class="relative rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 4 -->
    <section class="py-20 lg:py-32 bg-white relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 w-1/3 h-full opacity-5">
        <img src="/static/img/project/home/about-shape-2.svg" alt="shape" class="w-full h-full object-cover"/>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <!-- Image -->
          <div class="order-1">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl transform -rotate-3 opacity-20"></div>
              <img src="/static/img/project/home/best_choose.jpg"
                   alt="Lựa chọn tốt nhất"
                   class="relative rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105"/>
            </div>
          </div>

          <!-- Content -->
          <div class="order-2">
            <div class="inline-block px-4 py-2 bg-orange-200 text-orange-700 rounded-full text-sm font-medium mb-6">
              Công Nghệ Tiên Tiến
            </div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Tại Sao
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                ciSale Là Lựa Chọn
              </span>
              Của Bạn?
            </h2>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              Ứng dụng công nghệ cloud computing và AI, ciSale mang đến trải nghiệm
              cực kỳ nhanh chóng, bảo mật cao và khả năng mở rộng linh hoạt.
            </p>
            <button class="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    @click="scrollBottom()">
              Liên Hệ Ngay
            </button>
          </div>
        </div>
      </div>
    </section>
    <!-- Footer -->
    <footer id="footer" class="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <img src="/static/img/project/home/footer-bg.jpg" alt="" class="w-full h-full object-cover"/>
      </div>

      <!-- Main Footer Content -->
      <div class="relative pt-20 pb-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            <!-- Company Info -->
            <div class="lg:col-span-1">
              <div class="mb-8">
                <img src="/static/img/project/home/logo_login.png"
                     alt="ciSale Logo"
                     class="h-12 w-auto mb-6"/>
                <p class="text-gray-300 text-lg leading-relaxed mb-6">
                  ciSale - Giải pháp trọn vẹn cho quản lý bán hàng và tài chính,
                  giúp doanh nghiệp của bạn phát triển bền vững.
                </p>

                <!-- Social Media -->
                <div class="flex space-x-4">
                  <a href="#" class="w-12 h-12 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                    <i class="lni-facebook-filled text-xl"></i>
                  </a>
                  <a href="#" class="w-12 h-12 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                    <i class="lni-twitter-filled text-xl"></i>
                  </a>
                  <a href="#" class="w-12 h-12 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                    <i class="lni-instagram-filled text-xl"></i>
                  </a>
                  <a href="#" class="w-12 h-12 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                    <i class="lni-linkedin-original text-xl"></i>
                  </a>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="lg:col-span-1">
              <h4 class="text-2xl font-bold mb-8 text-white">
                Điều Hướng
              </h4>
              <ul class="space-y-4">
                <li>
                  <a @click="scrollToTop"
                     class="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer text-lg hover:translate-x-1 transform transition-transform">
                    → Trang Chủ
                  </a>
                </li>
                <li>
                  <a @click="scrollToFunction()"
                     class="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer text-lg hover:translate-x-1 transform transition-transform">
                    → Tính Năng
                  </a>
                </li>
                <li>
                  <a @click="scrollToAbout()"
                     class="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer text-lg hover:translate-x-1 transform transition-transform">
                    → Giới Thiệu
                  </a>
                </li>
                <li>
                  <a @click="scrollBottom()"
                     class="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer text-lg hover:translate-x-1 transform transition-transform">
                    → Liên Hệ
                  </a>
                </li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div class="lg:col-span-1">
              <h4 class="text-2xl font-bold mb-8 text-white">
                Thông Tin Liên Hệ
              </h4>
              <div class="space-y-4 text-gray-300">
                <div class="flex items-start space-x-3">
                  <i class="lni-home text-orange-400 mt-1 flex-shrink-0"></i>
                  <div>
                    <p class="font-medium text-white mb-1">Cty CiInTech</p>
                    <p class="text-sm">Mã số thuế: 0316431771</p>
                    <p class="text-sm">23/36 Mai Lão Bạng, P.13, Q.Tân Bình, TP.HCM</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <i class="lni-phone text-green-400 flex-shrink-0"></i>
                  <span class="font-medium">0865.827.248</span>
                </div>

                <div class="flex items-center space-x-3">
                  <i class="lni-envelope text-red-400 flex-shrink-0"></i>
                  <span>info@ciintech.com</span>
                </div>

                <div class="flex items-center space-x-3">
                  <i class="lni-world text-blue-400 flex-shrink-0"></i>
                  <a href="https://ciintech.com" target="_blank" class="hover:text-blue-300 transition-colors">
                    https://ciintech.com
                  </a>
                </div>

                <!-- Banking Info -->
                <div class="mt-6 p-4 bg-white bg-opacity-5 rounded-xl">
                  <h5 class="font-semibold text-white mb-3">Thông Tin Giao Dịch</h5>
                  <div class="space-y-2 text-sm">
                    <p><span class="font-medium">Ngân Hàng:</span> MB Bank</p>
                    <p><span class="font-medium">STK:</span> 9391135440021</p>
                    <p><span class="font-medium">Chi Nhánh:</span> TP HCM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Border -->
      <div class="border-t border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="text-center">
            <p class="text-gray-400">
              © {{ new Date().getFullYear() }} CiInTech. Bản quyền thuộc về ciSale. Made with ❤️ in Vietnam.
            </p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Back to Top Button -->
    <button
      id="back-to-top"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 hidden"
      @click="scrollToTop()"
      type="button"
    >
      <i class="fa fa-arrow-up"></i>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      // Show or hide the back to top button
      const backToTop = document.getElementById("back-to-top");
      if (backToTop) {
        if (document.documentElement.scrollTop > 600) {
          backToTop.style.display = "block";
        } else {
          backToTop.style.display = "none";
        }
      }
    },

    /**
     * Scroll to top
     */
    scrollToTop() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    },

    /**
     * Scroll to about section
     */
    scrollToAbout() {
      let el = document.getElementById("about");
      if (el) {
        let disFromTop = window.pageYOffset + el.getBoundingClientRect().top
        disFromTop = disFromTop - 80
        window.scrollTo({top: disFromTop, behavior: 'smooth'});
      }
    },

    /**
     * Scroll to features section
     */
    scrollToFunction() {
      let el = document.getElementById("features");
      if (el) {
        let disFromTop = window.pageYOffset + el.getBoundingClientRect().top
        disFromTop = disFromTop - 80
        window.scrollTo({top: disFromTop, behavior: 'smooth'});
      }
    },

    /**
     * Scroll to bottom
     */
    scrollBottom() {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");

/* Apply Inter font family */
* {
  font-family: "Inter", sans-serif;
}

/* Smooth scrolling for better UX */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Apply animations with intersection observer or on scroll */
.animate-fade-in {
  animation: fadeInUp 0.6s ease-out;
}

.animate-slide-left {
  animation: slideInLeft 0.6s ease-out;
}

.animate-slide-right {
  animation: slideInRight 0.6s ease-out;
}

/* Custom gradient text animation */
.gradient-text {
  background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Enhanced hover effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Better focus styles for accessibility */
button:focus,
a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* Ensure back to top button is properly styled */
#back-to-top {
  display: none;
}
</style>
