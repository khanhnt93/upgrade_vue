<template>
  <div ref="scrollParent">
    <!-- Header Banner -->
    <header id="bodyHome">
      <div id="home">
        <img src="/static/img/project/home/banner-bg.jpg" style="width:100%" alt="Banner"/>
      </div>
    </header>

    <!-- Features Section -->
    <section id="features" class="pt-30">
      <div class="page-container">
        <div class="text-center pb-10">
          <h3 class="section-title">
            ciPro
            <span class="section-title-sub"> Giải Pháp Trọn Vẹn Cho quản lý bán hàng và tài chính</span>
          </h3>
        </div>

        <div class="cards-row">
          <!-- Feature Card 1 -->
          <div class="card-col">
            <div class="single-services text-center fadeIn">
              <div class="services-icon">
                <img class="shape" src="/static/img/project/home/services-shape.svg" alt="shape"/>
                <img class="shape-1" src="/static/img/project/home/services-shape-2.svg" alt="shape"/>
                <i class="lni-cog"></i>
              </div>
              <div class="services-content">
                <h4 class="services-title">
                  <a href="#">Quản lý từ xa</a>
                </h4>
                <p class="text">
                  Mọi chức năng đều có thể làm việc từ xa, mọi lúc, mọi nơi.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature Card 2 -->
          <div class="card-col">
            <div class="single-services text-center fadeIn">
              <div class="services-icon">
                <img class="shape" src="/static/img/project/home/services-shape.svg" alt="shape"/>
                <img class="shape-1" src="/static/img/project/home/services-shape-1.svg" alt="shape"/>
                <i class="lni-baloon"></i>
              </div>
              <div class="services-content">
                <h4 class="services-title">
                  <a href="#">Hiệu quả quản lý</a>
                </h4>
                <p class="text">
                  Bán hàng và tài chính được kết nối chặt chẽ, giúp bạn quản lý quỹ, công nợ, nợ công, kho hàng, bán hàng một
                  cách tuyệt vời.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature Card 3 -->
          <div class="card-col">
            <div class="single-services text-center fadeIn">
              <div class="services-icon">
                <img class="shape" src="/static/img/project/home/services-shape.svg" alt="shape"/>
                <img class="shape-1" src="/static/img/project/home/services-shape-3.svg" alt="shape"/>
                <i class="lni-bolt-alt"></i>
              </div>
              <div class="services-content">
                <h4 class="services-title">
                  <a href="#">Tiết kiệm chi phí</a>
                </h4>
                <p class="text">
                  Bạn không cần mua thêm bất cứ thiết bị nào, mọi công việc đều có thể làm việc trên các thiết bị di động.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 1 -->
    <section id="about" class="about-area pt-70">
      <div class="page-container">
        <div class="two-col-row">
          <div class="col-half">
            <div class="about-content mt-50 fadeInLeftBig">
              <h3 class="section-title">Cấu trúc <span class="section-title-sub"> phù hợp với mọi loại hình kinh doanh </span></h3>
              <p class="text">
                ciPro được thiết kế phù hợp với mọi loại hình kinh doanh: từ công ty đến các cá nhân nhỏ lẻ.
              </p>
              <button class="main-btn" @click="scrollBottom()">Liên hệ ngay</button>
            </div>
          </div>
          <div class="col-half">
            <div class="about-image text-center mt-50 fadeInRightBig">
              <img src="/static/img/project/home/loai_kinh_doanh.jpg" alt="Loại hình nhà hàng, quán ăn"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 2 -->
    <section class="about-area pt-70">
      <div class="page-container">
        <div class="two-col-row">
          <div class="col-half order-last">
            <div class="about-content mt-50 fadeInLeftBig">
              <h3 class="section-title">Hệ thống<span class="section-title-sub"> hoạt động trên mọi thiết bị</span></h3>
              <p class="text">
                Hệ thống hoạt động tốt trên mọi thiết bị như laptop, máy tính bàn hoặc
                chỉ cần các thiết bị di động như máy tính bảng, tablet, điện thoại cá nhân.
              </p>
              <button class="main-btn" @click="scrollBottom()">Liên hệ ngay</button>
            </div>
          </div>
          <div class="col-half order-first">
            <div class="about-image text-center mt-50 fadeInRightBig">
              <img src="/static/img/project/home/header-hero.jpg" alt="about"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 3 -->
    <section class="about-area pt-70">
      <div class="page-container">
        <div class="two-col-row">
          <div class="col-half">
            <div class="about-content mt-50 fadeInLeftBig">
              <h3 class="section-title">Giao diện<span class="section-title-sub"> đơn giản, dễ sử dụng</span></h3>
              <p class="text">
                Giao diện đơn giản, các chức năng được phân bổ theo tần suất thực hiện để tiện cho việc thao tác của nhân viên.
              </p>
              <button class="main-btn" @click="scrollBottom()">Liên hệ ngay</button>
            </div>
          </div>
          <div class="col-half">
            <div class="about-image text-center mt-50 fadeInRightBig">
              <img src="/static/img/project/home/giao_dien_don_gian.jpg" alt="about"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section 4 -->
    <section class="about-area pt-70" style="position:relative">
      <div class="about-shape-2">
        <img src="/static/img/project/home/about-shape-2.svg" alt="shape"/>
      </div>
      <div class="page-container">
        <div class="two-col-row">
          <div class="col-half order-last">
            <div class="about-content mt-50 fadeInLeftBig">
              <h3 class="section-title">Tại sao <span class="section-title-sub">ciPro là lựa chọn của bạn?</span></h3>
              <p class="text">
                Áp dụng công nghệ tiên tiến trong phát triển hệ thống, ciPro sẽ đem lại cho bạn những trải nghiệm
                cực kỳ nhanh chóng và tiện lợi.
              </p>
              <button class="main-btn" @click="scrollBottom()">Liên hệ ngay</button>
            </div>
          </div>
          <div class="col-half order-first">
            <div class="about-image text-center mt-50 fadeInRightBig">
              <img src="/static/img/project/home/best_choose.jpg" alt="Best choose"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="footer" class="footer-area pt-120">
      <div class="page-container">
        <div class="footer-widget">
          <div class="three-col-row">
            <!-- Footer About -->
            <div class="col-third">
              <div class="footer-about mt-50 fadeIn">
                <a class="logo" href="#">
                  <img src="/static/img/project/home/logo_login.png" alt="logo"/>
                </a>
                <p class="text">
                  ciPro - Giải pháp chọn vẹn cho quản lý bán hàng và tài chính
                </p>
                <ul class="social">
                  <li><a href="#"><i class="lni-facebook-filled"></i></a></li>
                  <li><a href="#"><i class="lni-twitter-filled"></i></a></li>
                  <li><a href="#"><i class="lni-instagram-filled"></i></a></li>
                  <li><a href="#"><i class="lni-linkedin-original"></i></a></li>
                </ul>
              </div>
            </div>

            <!-- Footer Links -->
            <div class="col-third">
              <div class="link-wrapper mt-50 fadeIn">
                <div class="footer-title">
                  <h4 class="title">ciPro</h4>
                </div>
                <ul class="link">
                  <li><a @click="scrollToTop" style="cursor:pointer">Trang chủ</a></li>
                  <li><a @click="scrollToFunction()" style="cursor:pointer">Tính năng</a></li>
                  <li><a @click="scrollToAbout()" style="cursor:pointer">Giới thiệu</a></li>
                  <li><a style="cursor:pointer">Liên hệ</a></li>
                </ul>
              </div>
            </div>

            <!-- Footer Contact -->
            <div class="col-third">
              <div class="footer-contact mt-50 fadeIn">
                <div class="footer-title">
                  <h4 class="title">Thông tin liên hệ</h4>
                </div>
                <ul class="contact">
                  <li>Cty CiInTech</li>
                  <li>Mã số thuế: 0316431771</li>
                  <li>Địa chỉ: 23/36 Mai Lão Bạng p.13 Q.Tân Bình HCM</li>
                  <li>Số điện thoại: 0865.827.248</li>
                  <li>Email: info@ciintech.com</li>
                  <li>Website: <a href="https://ciintech.com" target="_blank">ciintech.com</a></li>
                  <li>Thông tin giao dịch:</li>
                  <li style="padding-left:1rem">Ngân hàng MB Bank</li>
                  <li style="padding-left:1rem">STK: 9391135440021</li>
                  <li style="padding-left:1rem;padding-bottom:3rem">Chi nhánh TP HCM</li>
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
      style="background:#fff !important; color:#ed592a"
      @click="scrollToTop()"
    >
      <i class="fa fa-arrow-up"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollParent = ref(null)

const onScroll = () => {
  const btn = document.getElementById('back-to-top')
  if (!btn) return
  btn.style.display = document.documentElement.scrollTop > 600 ? 'inline-block' : 'none'
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToAbout = () => {
  const el = document.getElementById('about')
  if (el) {
    window.scrollTo({ top: window.pageYOffset + el.getBoundingClientRect().top - 50, behavior: 'smooth' })
  }
}

const scrollToFunction = () => {
  const el = document.getElementById('features')
  if (el) {
    window.scrollTo({ top: window.pageYOffset + el.getBoundingClientRect().top - 50, behavior: 'smooth' })
  }
}

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

/* Layout */
.page-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
}

.cards-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.card-col {
  flex: 0 0 calc(33.333% - 16px);
  min-width: 260px;
}

@media (max-width: 900px) {
  .card-col { flex: 0 0 100%; }
}

.two-col-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
}

.col-half {
  flex: 1 1 45%;
  min-width: 280px;
}

.col-half.order-last { order: 2; }
.col-half.order-first { order: 1; }

@media (max-width: 768px) {
  .col-half.order-last,
  .col-half.order-first { order: unset; }
}

.three-col-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.col-third {
  flex: 1 1 28%;
  min-width: 220px;
}

/* Spacing utilities */
.pt-120 { padding-top: 120px; }
.pt-70 { padding-top: 70px; }
.pt-30 { padding-top: 30px; }
.pb-10 { padding-bottom: 40px; }
.mt-50 { margin-top: 50px; }

/* Section Title */
.section-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 42px;
  color: #2e2e2e;
}
.section-title-sub {
  font-weight: 400;
}
@media (max-width: 767px) {
  .section-title { font-size: 24px; }
}

/* Service Cards */
.single-services {
  background-color: #fff;
  box-shadow: 0px 5px 30px 0px rgba(167, 167, 167, 0.16);
  transition: all 0.3s ease-out 0s;
  padding: 50px 30px;
  border: 2px solid transparent;
  border-radius: 8px;
  height: 100%;
}
@media (max-width: 767px) {
  .single-services { padding: 20px 20px 30px; }
}

.single-services .services-icon {
  display: inline-block;
  position: relative;
}

.single-services .services-icon img {
  transition: all 0.4s ease-out 0s;
}

.single-services .services-icon .shape-1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.single-services .services-icon i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 34px;
  color: #fff;
}

.single-services .services-content {
  margin-top: 30px;
}

.single-services .services-content .services-title a {
  font-size: 26px;
  font-weight: 700;
  color: #2e2e2e;
  transition: all 0.3s ease-out 0s;
  text-decoration: none;
}
@media (max-width: 767px) {
  .single-services .services-content .services-title a { font-size: 20px; }
}

.single-services .services-content .services-title a:hover { color: #361cc1; }

.single-services .services-content .text { margin-top: 20px; }

.single-services:hover { border-color: #fe7a7b; }

.single-services:hover .services-icon .shape { transform: rotate(25deg); }

/* About */
.about-area {
  position: relative;
  z-index: 5;
}

.about-shape-2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 35%;
  height: 100%;
  z-index: -1;
}
.about-shape-2 img { width: 100%; }
@media (max-width: 767px) {
  .about-shape-2 { display: none; }
}

.about-content { max-width: 480px; }
.about-content .text { margin-top: 15px; }

.about-image img { max-width: 100%; }

/* Main Button */
.main-btn {
  display: inline-block;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  padding: 0 35px;
  font-size: 16px;
  height: 50px;
  line-height: 50px;
  border-radius: 8px;
  border: 0;
  color: #fff;
  cursor: pointer;
  margin-top: 40px;
  transition: all 0.4s ease-out 0s;
  background: #ed592a;
}
.main-btn:hover { background: #e6947b; }

/* Footer */
.footer-area {
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

.footer-widget { padding-bottom: 80px; }

.footer-about .logo img { width: 160px; }
.footer-about .text { color: #646565; line-height: 30px; margin-top: 30px; }
.footer-about .social { margin-top: 40px; list-style: none; padding: 0; }
.footer-about .social li { display: inline-block; margin-right: 30px; }
.footer-about .social li a { font-size: 22px; color: #646565; text-decoration: none; transition: all 0.3s ease-out 0s; }
.footer-about .social li a:hover { color: #fe8464; }

.footer-title .title { font-size: 24px; font-weight: 700; color: #646565; margin: 0 0 20px; }

.link-wrapper .link { list-style: none; padding: 0; }
.link-wrapper .link li { margin-top: 16px; }
.link-wrapper .link li a { font-size: 16px; color: #646565; text-decoration: none; transition: all 0.3s ease-out 0s; }
.link-wrapper .link li a:hover { color: #fe8464; }

.footer-contact .contact { list-style: none; padding: 0; }
.footer-contact .contact li { margin-top: 10px; font-size: 16px; color: #646565; }
.footer-contact .contact a { color: inherit; }

/* Back to top */
#back-to-top {
  font-size: 20px;
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
  text-align: center;
  z-index: 99;
  transition: all 0.3s ease-out 0s;
  display: none;
  border: none;
  cursor: pointer;
}

/* Animations */
.fadeIn { animation: fadeIn 1s ease-in; }
.fadeInLeftBig { animation: fadeInLeft 1s ease-in; }
.fadeInRightBig { animation: fadeInRight 1s ease-in; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
