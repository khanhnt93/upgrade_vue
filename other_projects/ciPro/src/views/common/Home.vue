<template>
  <div class="bg-white" ref="scrollParent">
    <!-- Header Banner -->
    <header class="header-area" id="bodyHome">
      <div id="home">
        <img src="/static/img/project/home/banner-bg.jpg" class="w-full" alt="Banner"/>
      </div>
    </header>

    <!-- Features Section -->
    <section id="features" class="services-area pt-32">
      <div class="container mx-auto px-4">
        <div class="flex justify-center">
          <div class="w-full lg:w-10/12">
            <div class="text-center pb-10">
              <h3 class="text-4xl md:text-5xl font-bold text-gray-800">
                ciPro
                <span class="block text-3xl md:text-4xl font-normal mt-2"> Giải Pháp Trọn Vẹn Cho quản lý bán hàng và tài chính</span>
              </h3>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-center -mx-4">
          <!-- Feature Card 1 -->
          <div class="w-full md:w-1/2 lg:w-4/12 px-4 mt-6">
            <div class="single-services text-center bg-white shadow-xl rounded-lg p-12 hover:border-2 hover:border-red-400 transition-all duration-300">
              <div class="services-icon relative inline-block mb-8">
                <img
                  class="shape absolute"
                  src="/static/img/project/home/services-shape.svg"
                  alt="shape"
                />
                <img
                  class="shape-1 absolute"
                  src="/static/img/project/home/services-shape-2.svg"
                  alt="shape"
                />
                <i class="lni-cog text-white text-4xl relative z-10"></i>
              </div>
              <div class="services-content mt-8">
                <h4 class="text-2xl font-bold mb-4">
                  <a href="#" class="text-gray-800 hover:text-purple-600 transition-colors">Quản lý từ xa</a>
                </h4>
                <p class="text-gray-600 leading-7">
                  Mọi chức năng đều có thể làm việc từ xa, mọi lúc, mọi nơi.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature Card 2 -->
          <div class="w-full md:w-1/2 lg:w-4/12 px-4 mt-6">
            <div class="single-services text-center bg-white shadow-xl rounded-lg p-12 hover:border-2 hover:border-red-400 transition-all duration-300">
              <div class="services-icon relative inline-block mb-8">
                <img
                  class="shape absolute"
                  src="/static/img/project/home/services-shape.svg"
                  alt="shape"
                />
                <img
                  class="shape-1 absolute"
                  src="/static/img/project/home/services-shape-1.svg"
                  alt="shape"
                />
                <i class="lni-baloon text-white text-4xl relative z-10"></i>
              </div>
              <div class="services-content mt-8">
                <h4 class="text-2xl font-bold mb-4">
                  <a href="#" class="text-gray-800 hover:text-purple-600 transition-colors">Hiệu quả quản lý</a>
                </h4>
                <p class="text-gray-600 leading-7">
                  Bán hàng và tài chính được kết nối chặt chẽ, giúp bạn quản lý quỹ, công nợ, nợ công, kho hàng, bán hàng một
                  cách tuyệt vời.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature Card 3 -->
          <div class="w-full md:w-1/2 lg:w-4/12 px-4 mt-6">
            <div class="single-services text-center bg-white shadow-xl rounded-lg p-12 hover:border-2 hover:border-red-400 transition-all duration-300">
              <div class="services-icon relative inline-block mb-8">
                <img
                  class="shape absolute"
                  src="/static/img/project/home/services-shape.svg"
                  alt="shape"
                />
                <img
                  class="shape-1 absolute"
                  src="/static/img/project/home/services-shape-3.svg"
                  alt="shape"
                />
                <i class="lni-bolt-alt text-white text-4xl relative z-10"></i>
              </div>
              <div class="services-content mt-8">
                <h4 class="text-2xl font-bold mb-4">
                  <a href="#" class="text-gray-800 hover:text-purple-600 transition-colors">Tiết kiệm chi phí</a>
                </h4>
                <p class="text-gray-600 leading-7">
                  Bạn không cần mua thêm bất cứ thiết bị nào, mọi công việc đều có thể làm việc trên các thiết bị di động.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 1 -->
    <section id="about" class="about-area pt-20">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center -mx-4">
          <div class="w-full lg:w-1/2 px-4 mt-6">
            <div class="about-content mt-12 fadeInLeftBig">
              <div class="section-title">
                <h3 class="text-4xl font-bold text-gray-800">
                  Cấu trúc <span class="font-normal"> phù hợp với mọi loại hình kinh doanh </span>
                </h3>
              </div>
              <p class="text-gray-600 leading-7 mt-4">
                ciPro được thiết kế phù hợp với mọi loại hình kinh doanh: từ công ty đến các cá nhân nhỏ lẻ.
              </p>
              <button
                class="main-btn mt-10 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300"
                @click="scrollBottom()"
              >
                Liên hệ ngay
              </button>
            </div>
          </div>
          <div class="w-full lg:w-1/2 px-4 mt-6">
            <div class="about-image text-center mt-12 fadeInRightBig">
              <img src="/static/img/project/home/loai_kinh_doanh.jpg" alt="Loại hình nhà hàng, quán ăn" class="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 2 -->
    <section class="about-area pt-20">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center -mx-4">
          <div class="w-full lg:w-1/2 px-4 mt-6 lg:order-last">
            <div class="about-content mt-12 fadeInLeftBig">
              <div class="section-title">
                <h3 class="text-4xl font-bold text-gray-800">
                  Hệ thống<span class="font-normal"> hoạt động trên mọi thiết bị</span>
                </h3>
              </div>
              <p class="text-gray-600 leading-7 mt-4">
                Hệ thống hoạt động tốt trên mọi thiết bị như laptop, máy tính bàn hoặc
                chỉ cần các thiết bị di động như máy tính bảng, tablet, điện thoại cá nhân.
              </p>
              <button
                class="main-btn mt-10 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300"
                @click="scrollBottom()"
              >
                Liên hệ ngay
              </button>
            </div>
          </div>
          <div class="w-full lg:w-1/2 px-4 mt-6 lg:order-first">
            <div class="about-image text-center mt-12 fadeInRightBig">
              <img src="/static/img/project/home/header-hero.jpg" alt="about" class="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 3 -->
    <section class="about-area pt-20">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center -mx-4">
          <div class="w-full lg:w-1/2 px-4 mt-6">
            <div class="about-content mt-12 fadeInLeftBig">
              <div class="section-title">
                <h3 class="text-4xl font-bold text-gray-800">
                  Giao diện<span class="font-normal"> đơn giản, dễ sử dụng</span>
                </h3>
              </div>
              <p class="text-gray-600 leading-7 mt-4">
                Giao diện đơn giản, các chức năng được phân bổ theo tần suất thực hiện để tiện cho việc thao tác của nhân viên.
              </p>
              <button
                class="main-btn mt-10 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300"
                @click="scrollBottom()"
              >
                Liên hệ ngay
              </button>
            </div>
          </div>
          <div class="w-full lg:w-1/2 px-4 mt-6">
            <div class="about-image text-center mt-12 fadeInRightBig">
              <img src="/static/img/project/home/giao_dien_don_gian.jpg" alt="about" class="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 4 -->
    <section class="about-area pt-20">
      <div class="about-shape-2 absolute top-0 left-0 w-1/3 h-full -z-10 hidden md:block">
        <img src="/static/img/project/home/about-shape-2.svg" alt="shape" class="w-full" />
      </div>
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center -mx-4">
          <div class="w-full lg:w-1/2 px-4 mt-6 lg:order-last">
            <div class="about-content mt-12 fadeInLeftBig">
              <div class="section-title">
                <h3 class="text-4xl font-bold text-gray-800">
                  Tại sao <span class="font-normal">ciPro là lựa chọn của bạn?</span>
                </h3>
              </div>
              <p class="text-gray-600 leading-7 mt-4">
                Áp dụng công nghệ tiên tiến trong phát triển hệ thống, ciPro sẽ đem lại cho bạn những trải nghiệm
                cực kỳ nhanh chóng và tiện lợi.
              </p>
              <button
                class="main-btn mt-10 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300"
                @click="scrollBottom()"
              >
                Liên hệ ngay
              </button>
            </div>
          </div>
          <div class="w-full lg:w-1/2 px-4 mt-6 lg:order-first">
            <div class="about-image text-center mt-12 fadeInRightBig">
              <img src="/static/img/project/home/best_choose.jpg" alt="Best choose" class="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="footer" class="footer-area pt-32 mt-48">
      <div class="container mx-auto px-4">
        <div class="footer-widget pb-24">
          <div class="flex flex-wrap -mx-4">
            <!-- Footer About -->
            <div class="w-full lg:w-4/12 md:w-6/12 px-4">
              <div class="footer-about mt-12 fadeIn">
                <a class="logo inline-block" href="#">
                  <img src="/static/img/project/home/logo_login.png" alt="logo" class="w-40" />
                </a>
                <p class="text-gray-600 mt-8 leading-7">
                  ciPro - Giải pháp chọn vẹn cho quản lý bán hàng và tài chính
                </p>
                <ul class="social flex mt-10 space-x-6">
                  <li>
                    <a href="#" class="text-2xl text-gray-600 hover:text-orange-500 transition-colors">
                      <i class="lni-facebook-filled"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="text-2xl text-gray-600 hover:text-orange-500 transition-colors">
                      <i class="lni-twitter-filled"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="text-2xl text-gray-600 hover:text-orange-500 transition-colors">
                      <i class="lni-instagram-filled"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="text-2xl text-gray-600 hover:text-orange-500 transition-colors">
                      <i class="lni-linkedin-original"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Footer Links -->
            <div class="w-full lg:w-4/12 md:w-7/12 px-4">
              <div class="footer-link mt-12 fadeIn">
                <div class="footer-title mb-6">
                  <h4 class="text-2xl font-bold text-orange-600">ciPro</h4>
                </div>
                <ul class="link space-y-4">
                  <li>
                    <a
                      @click="scrollToTop"
                      class="text-gray-600 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                      Trang chủ
                    </a>
                  </li>
                  <li>
                    <a
                      @click="scrollToFunction()"
                      class="text-gray-600 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                      Tính năng
                    </a>
                  </li>
                  <li>
                    <a
                      @click="scrollToAbout()"
                      class="text-gray-600 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                      Giới thiệu
                    </a>
                  </li>
                  <li>
                    <a class="text-gray-600 hover:text-orange-500 transition-colors cursor-pointer">Liên hệ</a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Footer Contact -->
            <div class="w-full lg:w-4/12 md:w-5/12 px-4">
              <div class="footer-contact mt-12 fadeIn">
                <div class="footer-title mb-6">
                  <h4 class="text-2xl font-bold text-orange-600">Thông tin liên hệ</h4>
                </div>
                <ul class="contact space-y-2 text-gray-600">
                  <li>Cty CiInTech</li>
                  <li>Mã số thuế: 0316431771</li>
                  <li>Địa chỉ: 23/36 Mai Lão Bạng p.13 Q.Tân Bình HCM</li>
                  <li>Số điện thoại: 0865.827.248</li>
                  <li>Email: info@ciintech.com</li>
                  <li>
                    Website:
                    <a href="https://ciintech.com" target="_blank" class="text-blue-500 hover:text-blue-700 hover:underline">
                      ciintech.com
                    </a>
                  </li>
                  <li class="mt-4">Thông tin giao dịch:</li>
                  <li class="pl-6">Ngân hàng MB Bank</li>
                  <li class="pl-6">STK: 9391135440021</li>
                  <li class="pl-6 pb-12">Chi nhánh TP HCM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Back to Top Button -->
    <button
      id="back-to-top"
      class="fixed right-5 bottom-5 w-10 h-10 leading-10 rounded bg-white text-orange-600 text-center z-50 transition-all duration-300 shadow-lg hover:shadow-xl"
      :class="showBackToTop ? 'inline-block' : 'hidden'"
      @click="scrollToTop()"
    >
      <i class="fa fa-arrow-up"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollParent = ref(null)
const showBackToTop = ref(false)

const onScroll = () => {
  // Show or hide the sticky footer button
  if (document.documentElement.scrollTop > 600) {
    showBackToTop.value = true
  } else {
    showBackToTop.value = false
  }
}

/**
 * Scroll to top
 */
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Scroll to about section
 */
const scrollToAbout = () => {
  const el = document.getElementById('about')
  if (el) {
    let disFromTop = window.pageYOffset + el.getBoundingClientRect().top
    disFromTop = disFromTop - 50
    window.scrollTo({ top: disFromTop, behavior: 'smooth' })
  }
}

/**
 * Scroll to function section
 */
const scrollToFunction = () => {
  const el = document.getElementById('features')
  if (el) {
    let disFromTop = window.pageYOffset + el.getBoundingClientRect().top
    disFromTop = disFromTop - 50
    window.scrollTo({ top: disFromTop, behavior: 'smooth' })
  }
}

/**
 * Scroll to bottom
 */
const scrollBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins:400,700|Lato:300,400,700&display=swap");

/* Service Card Styles */
.single-services {
  position: relative;
}

.single-services .services-icon {
  position: relative;
}

.single-services .services-icon .shape {
  width: 100px;
  height: 100px;
  transition: all 0.4s ease-out;
}

.single-services .services-icon .shape-1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
}

.single-services .services-icon i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.single-services:hover .services-icon .shape {
  transform: rotate(25deg);
}

/* Footer Styles */
.footer-area {
  background-position: top center;
  position: relative;
  z-index: 5;
}

.footer-area::before {
  position: absolute;
  content: "";
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url("/static/img/project/home/footer-bg.jpg");
  background-position: top center;
  z-index: -1;
  background-size: cover;
}

/* Animation Classes */
.fadeIn {
  animation: fadeIn 1s ease-in;
}

.fadeInLeftBig {
  animation: fadeInLeft 1s ease-in;
}

.fadeInRightBig {
  animation: fadeInRight 1s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Section Spacing */
.pt-32 {
  padding-top: 8rem;
}

.pt-20 {
  padding-top: 5rem;
}

.mt-48 {
  margin-top: 12rem;
}

/* Button Styles */
.main-btn {
  display: inline-block;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  font-size: 16px;
  line-height: 48px;
  border-radius: 8px;
  border: 0;
  color: #fff;
  cursor: pointer;
  z-index: 5;
  transition: all 0.4s ease-out 0s;
  background: linear-gradient(to right, #33c8c1 0%, #119bd2 50%, #33c8c1 100%);
  background-size: 200%;
}

.main-btn:hover {
  color: #fff;
  background-position: right center;
}

/* About Shape */
.about-shape-2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 35%;
  height: 100%;
  z-index: -1;
}

.about-shape-2 img {
  width: 100%;
}

@media (max-width: 767px) {
  .about-shape-2 {
    display: none;
  }
}
</style>
