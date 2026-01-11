<template>
  <div class="bg-white" ref="scrollParent">
    <header class="header-area" id="bodyHome">
      <div id="home" >
        <img src="/img/project/home/banner-bg.jpg" style="width: 100%"/>
      </div>
    </header>
    <section id="features" class="services-area pt-120">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="section-title text-center pb-40">
              <!--<div class="line m-auto"></div>-->
              <h3 class="title">
                ciHotel
                <span> Giải Pháp Trọn Vẹn Cho Ngành Lưu Trú</span>
              </h3>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">

          <div class="col-lg-4 col-md-7 col-sm-8  mt-3">
            <div
              class="single-services text-center mt-30 fadeIn"
            >
              <div class="services-icon">
                <img
                  class="shape"
                  src="/img/project/home/services-shape.svg"
                  alt="shape"
                />
                <img
                  class="shape-1"
                  src="/img/project/home/services-shape-2.svg"
                  alt="shape"
                />
                <i class="lni-cog"></i>
              </div>
              <div class="services-content mt-30">
                <h4 class="services-title">
                  <a href="#">Quản lý từ xa</a>
                </h4>
                <p class="text">
                  Chủ khách sạn vi vu đi du lịch nhưng vẫn nắm hoàn toàn hoạt động của khách sạn, hoạt động của từng nhân
                  viên.
                </p>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-7 col-sm-8 mt-3">
            <div
              class="single-services text-center mt-30 fadeIn"
            >
              <div class="services-icon">
                <img
                  class="shape"
                  src="/img/project/home/services-shape.svg"
                  alt="shape"
                />
                <img
                  class="shape-1"
                  src="/img/project/home/services-shape-1.svg"
                  alt="shape"
                />
                <i class="lni-baloon"></i>
              </div>
              <div class="services-content mt-30">
                <h4 class="services-title">
                  <a href="#">Hiệu quả nhân viên</a>
                </h4>
                <p class="text">
                  Mọi nhân viên được kết nối trực tuyến với nhau, giảm thời gian làm các công việc thừa, tăng hiệu quả
                  công việc.
                </p>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-7 col-sm-8  mt-3">
            <div
              class="single-services text-center mt-30 fadeIn"
            >
              <div class="services-icon">
                <img
                  class="shape"
                  src="/img/project/home/services-shape.svg"
                  alt="shape"
                />
                <img
                  class="shape-1"
                  src="/img/project/home/services-shape-3.svg"
                  alt="shape"
                />
                <i class="lni-bolt-alt"></i>
              </div>
              <div class="services-content mt-30">
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

    <section id="about" class="about-area pt-70">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 mt-3">
            <div
              class="about-content mt-50 fadeInLeftBig"
            >
              <div class="section-title">
                <h3 class="title">Cấu trúc <span> phù hợp với mọi loại hình khách sạn, nhà nghỉ, nhà trọ cao cấp</span></h3>
              </div>
              <p class="text">
                cihotel được thiết kế phù hợp với mọi loại hình khách sạn, nhà nghỉ, nhà trọ cao cấp.
              </p>
              <button class="main-btn" @click="scrollBottom()">Liên hệ ngay</button>
            </div>
          </div>
          <div class="col-lg-6 mt-3">
            <div
              class="about-image text-center mt-50 fadeInRightBig"
            >
              <img src="/img/project/home/loai_nha_hang.jpg" alt="Loại hình nhà hàng, quán ăn" />
            </div>
          </div>
        </div>
      </div>
      <!--<div class="about-shape-1">-->
        <!--<img src="/img/project/home/about-shape-1.svg" alt="shape" />-->
      <!--</div>-->
    </section>

    <section class="about-area pt-70">
      <!--<div class="about-shape-2">-->
        <!--<img src="/img/project/home/about-shape-2.svg" alt="shape" />-->
      <!--</div>-->
      <div class="container">
        <div class="row">
          <div class="col-lg-6 order-lg-last  mt-3">
            <div
              class="about-content mt-50 fadeInLeftBig"
            >
              <div class="section-title">
                <h3 class="title">
                  Hệ thống<span> hoạt động trên mọi thiết bị</span>
                </h3>
              </div>
              <p class="text">
                Hệ thống hoạt động tốt trên mọi thiết bị như laptop, máy tính bàn hoặc
                chỉ cần các thiết bị di động như máy tính bảng, tablet, điện thoại cá nhân nhưng vẫn
                đáp ứng hoàn toàn nhu cầu của ngành lưu trú.
              </p>
              <button class="main-btn" @click="scrollBottom()">Liên hệ ngay</button>
            </div>
          </div>
          <div class="col-lg-6 order-lg-first mt-3">
            <div
              class="about-image text-center mt-50 fadeInRightBig"
            >
              <img src="/img/project/home/header-hero.jpg" alt="about" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about-area pt-70">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 mt-3">
            <div class="about-content mt-50 fadeInLeftBig">
              <div class="section-title">
                <h3 class="title">Giao diện<span> đơn giản, dễ sử dụng</span></h3>
              </div>
              <p class="text">
                Giao diện đơn giản, các chức năng được phân bổ theo tần suất thực hiện để tiện cho việc thao tác của nhân viên.
              </p>
              <button class="main-btn" @click="scrollBottom()">Liên hệ ngay</button>
            </div>
          </div>
          <div class="col-lg-6 mt-3">
            <div
              class="about-image text-center mt-50 fadeInRightBig"
            >
              <img src="/img/project/home/giao_dien_don_gian.PNG" alt="about" />
            </div>
          </div>
        </div>
      </div>
      <!--<div class="about-shape-1">-->
        <!--<img src="/img/project/home/about-shape-1.svg" alt="shape" />-->
      <!--</div>-->
    </section>

    <section class="about-area pt-70">
      <div class="about-shape-2">
        <img src="/img/project/home/about-shape-2.svg" alt="shape" />
      </div>
      <div class="container">
        <div class="row">
          <div class="col-lg-6 order-lg-last mt-3">
            <div class="about-content mt-50 fadeInLeftBig">
              <div class="section-title">
                <h3 class="title">
                    Tại sao <span>ciHotel là lựa chọn của bạn?</span>
                  </h3>
              </div>
              <p class="text">
                Áp dụng công nghệ tiên tiến trong phát triển hệ thống, ciHotel sẽ đem lại cho bạn những trải nghiệm
                  cực kỳ nhanh chóng và tiện lợi.
              </p>
              <button class="main-btn" @click="scrollBottom()">Liên hệ ngay</button>
            </div>
          </div>
          <div class="col-lg-6 order-lg-first mt-3">
            <div
              class="about-image text-center mt-50 fadeInRightBig"
            >
              <img src="/img/project/home/best_choose.jpg" alt="Best choose" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer id="footer" class="footer-area pt-120">
      <div class="container">
        <div class="footer-widget pb-100 mt-200">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-8">
              <div
                class="footer-about mt-50 fadeIn"
              >
                <a class="logo" href="#">
                  <img src="/img/project/logo.png" alt="logo" />
                </a>
                <p class="text">
                  ciHotel - Giải pháp chọn vẹn cho khách sạn, nhà nghỉ, nhà trọ cao cấp.
                </p>
                <ul class="social">
                  <li>
                    <a href="#"><i class="lni-facebook-filled"></i></a>
                  </li>
                  <li>
                    <a href="#"><i class="lni-twitter-filled"></i></a>
                  </li>
                  <li>
                    <a href="#"><i class="lni-instagram-filled"></i></a>
                  </li>
                  <li>
                    <a href="#"><i class="lni-linkedin-original"></i></a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-lg-4 col-md-7 col-sm-7">
              <div class="footer-link d-flex mt-50 justify-content-md-between">
                <div
                  class="link-wrapper fadeIn"
                >
                  <div class="footer-title">
                    <h4 class="title">ciHotel</h4>
                  </div>
                  <ul class="link">
                    <li><a @click="scrollToTop">Trang chủ</a></li>
                    <li><a @click="scrollToFunction()">Tính năng</a></li>
                    <li><a @click="scrollToAbout()">Giới thiệu</a></li>
                    <li><a>Liên hệ</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-5">
              <div
                class="footer-contact mt-50 fadeIn"
              >
                <div class="footer-title">
                  <h4 class="title">Thông tin liên hệ</h4>
                </div>
                <ul class="contact">
                  <li>Cty CiInTech</li>
                  <li>Mã số thuế: 0316431771</li>
                  <li>Địa chỉ: 23/36 Mai Lão Bạng p.13 Q.Tân Bình HCM</li>
                  <li>Số điện thoại: 0865.827.248</li>
                  <li>Email: info@ciintech.com</li>
                  <li>Website: <a href="https://ciintech.com" target="_blank">https://ciintech.com</a></li>
                  <li>Thông tin giao dịch:</li>
                  <li class="pl-4">Ngân hàng MB Bank</li>
                  <li class="pl-4">STK: 9391135440021</li>
                  <li class="pl-4 pb-5">Chi nhánh TP HCM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--<Particles id="particles-2" :options="particlesOptions" ></Particles>-->
    </footer>
    <button
      id="back-to-top"
      style="background: #fff !important;color:#ed592a"
      @click="scrollToTop()"
    >
      <i class="fa fa-arrow-up"></i>
    </button>
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      // Show or hide the sticky footer button
      if (document.documentElement.scrollTop > 600) {
        document.getElementById("back-to-top").style.display = "inline-block";
      } else {
          if (document.getElementById("back-to-top")) {
              document.getElementById("back-to-top").style.display = "none";
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
     * Scroll to function
     */
    scrollToAbout() {
      let el = document.getElementById("about");
      let disFromTop = window.pageYOffset + el.getBoundingClientRect().top
      disFromTop = disFromTop - 50
      window.scrollTo({top: disFromTop, behavior: 'smooth'});

    },

    /**
     * Scroll to function
     */
    scrollToFunction() {
      let el = document.getElementById("features");
      let disFromTop = window.pageYOffset + el.getBoundingClientRect().top
      disFromTop = disFromTop - 50
      window.scrollTo({top: disFromTop, behavior: 'smooth'});
    },

    /**
     * Scroll bot
     */
    scrollBottom() {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }
}
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Poppins:400,700|Lato:300,400,700&display=swap");

  body {
    font-family: "Lato", sans-serif;
    font-weight: normal;
    font-style: normal;
    color: #6a6972;
    overflow-x: hidden;
  }

  * {
    margin: 0;
    padding: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
  }

  a:focus,
  input:focus,
  textarea:focus,
  button:focus {
    text-decoration: none;
    outline: none;
  }

  a:focus,
  a:hover {
    text-decoration: none;
  }

  i,
  span,
  a {
    display: inline-block;
  }

  audio,
  canvas,
  iframe,
  img,
  svg,
  video {
    vertical-align: middle;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Poppins", sans-serif;
    font-weight: 700;
    color: #2e2e2e;
    margin: 0px;
  }

  h1 {
    font-size: 48px;
  }

  h2 {
    font-size: 36px;
  }

  h3 {
    font-size: 28px;
  }

  h4 {
    font-size: 22px;
  }

  h5 {
    font-size: 18px;
  }

  h6 {
    font-size: 16px;
  }

  ul,
  ol {
    margin: 0px;
    padding: 0px;
    list-style-type: none;
  }

  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
    color: #6a6972;
    margin: 0px;
  }

  .bg_cover {
    background-position: center center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }

  /*===== All Button Style =====*/

  .main-btn {
    display: inline-block;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 0 25px;
    font-size: 16px;
    line-height: 48px;
    border-radius: 8px;
    border: 0;
    color: #fff;
    cursor: pointer;
    z-index: 5;
    -webkit-transition: all 0.4s ease-out 0s;
    -moz-transition: all 0.4s ease-out 0s;
    -ms-transition: all 0.4s ease-out 0s;
    -o-transition: all 0.4s ease-out 0s;
    transition: all 0.4s ease-out 0s;
    background: -webkit-linear-gradient(
      left,
      #33c8c1 0%,
      #119bd2 50%,
      #33c8c1 100%
    );
    background: -o-linear-gradient(left, #33c8c1 0%, #119bd2 50%, #33c8c1 100%);
    background: linear-gradient(to right, #33c8c1 0%, #119bd2 50%, #33c8c1 100%);
    background-size: 200%;
  }

  .main-btn:hover {
    color: #fff;
    background-position: right center;
  }

  /*===== All SECTION TITLE Style =====*/

  /*.section-title .line {*/
    /*background: -webkit-linear-gradient(#fe8464 0%, #fe6e9a 100%);*/
    /*background: -o-linear-gradient(#fe8464 0%, #fe6e9a 100%);*/
    /*background: linear-gradient(#fe8464 0%, #fe6e9a 100%);*/
    /*width: 150px;*/
    /*height: 5px;*/
    /*margin-bottom: 10px !important;*/
  /*}*/

  .section-title .title {
    font-size: 38px;
    font-weight: 700;
    line-height: 42px;
  }

  @media (max-width: 767px) {
    .section-title .title {
      font-size: 20px;
    }
  }

  @media only screen and (min-width: 576px) and (max-width: 767px) {
    .section-title .title {
      font-size: 30px;
    }
  }

  .section-title .title span {
    font-weight: 400;
    display: contents;
  }

  /*===== All Section Title Style =====*/

  .section-title .sub-title {
    font-size: 18px;
    font-weight: 400;
    color: #361cc1;
    text-transform: uppercase;
  }

  @media (max-width: 767px) {
    .section-title .sub-title {
      font-size: 16px;
    }
  }

  .section-title .title {
    font-size: 32px;
    padding-top: 10px;
  }

  @media only screen and (min-width: 992px) and (max-width: 1199px) {
    .section-title .title {
      font-size: 30px;
    }
  }

  @media (max-width: 767px) {
    .section-title .title {
      font-size: 24px;
    }
  }

  .section-title .title span {
    font-weight: 400;
    display: contents;
  }

  /* Preloader Animations */

  @-webkit-keyframes ytp-spinner-linspin {
    to {
      -webkit-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes ytp-spinner-linspin {
    to {
      -webkit-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes ytp-spinner-easespin {
    12.5% {
      -webkit-transform: rotate(135deg);
      -moz-transform: rotate(135deg);
      -ms-transform: rotate(135deg);
      -o-transform: rotate(135deg);
      transform: rotate(135deg);
    }
    25% {
      -webkit-transform: rotate(270deg);
      -moz-transform: rotate(270deg);
      -ms-transform: rotate(270deg);
      -o-transform: rotate(270deg);
      transform: rotate(270deg);
    }
    37.5% {
      -webkit-transform: rotate(405deg);
      -moz-transform: rotate(405deg);
      -ms-transform: rotate(405deg);
      -o-transform: rotate(405deg);
      transform: rotate(405deg);
    }
    50% {
      -webkit-transform: rotate(540deg);
      -moz-transform: rotate(540deg);
      -ms-transform: rotate(540deg);
      -o-transform: rotate(540deg);
      transform: rotate(540deg);
    }
    62.5% {
      -webkit-transform: rotate(675deg);
      -moz-transform: rotate(675deg);
      -ms-transform: rotate(675deg);
      -o-transform: rotate(675deg);
      transform: rotate(675deg);
    }
    75% {
      -webkit-transform: rotate(810deg);
      -moz-transform: rotate(810deg);
      -ms-transform: rotate(810deg);
      -o-transform: rotate(810deg);
      transform: rotate(810deg);
    }
    87.5% {
      -webkit-transform: rotate(945deg);
      -moz-transform: rotate(945deg);
      -ms-transform: rotate(945deg);
      -o-transform: rotate(945deg);
      transform: rotate(945deg);
    }
    to {
      -webkit-transform: rotate(1080deg);
      -moz-transform: rotate(1080deg);
      -ms-transform: rotate(1080deg);
      -o-transform: rotate(1080deg);
      transform: rotate(1080deg);
    }
  }

  @keyframes ytp-spinner-easespin {
    12.5% {
      -webkit-transform: rotate(135deg);
      -moz-transform: rotate(135deg);
      -ms-transform: rotate(135deg);
      -o-transform: rotate(135deg);
      transform: rotate(135deg);
    }
    25% {
      -webkit-transform: rotate(270deg);
      -moz-transform: rotate(270deg);
      -ms-transform: rotate(270deg);
      -o-transform: rotate(270deg);
      transform: rotate(270deg);
    }
    37.5% {
      -webkit-transform: rotate(405deg);
      -moz-transform: rotate(405deg);
      -ms-transform: rotate(405deg);
      -o-transform: rotate(405deg);
      transform: rotate(405deg);
    }
    50% {
      -webkit-transform: rotate(540deg);
      -moz-transform: rotate(540deg);
      -ms-transform: rotate(540deg);
      -o-transform: rotate(540deg);
      transform: rotate(540deg);
    }
    62.5% {
      -webkit-transform: rotate(675deg);
      -moz-transform: rotate(675deg);
      -ms-transform: rotate(675deg);
      -o-transform: rotate(675deg);
      transform: rotate(675deg);
    }
    75% {
      -webkit-transform: rotate(810deg);
      -moz-transform: rotate(810deg);
      -ms-transform: rotate(810deg);
      -o-transform: rotate(810deg);
      transform: rotate(810deg);
    }
    87.5% {
      -webkit-transform: rotate(945deg);
      -moz-transform: rotate(945deg);
      -ms-transform: rotate(945deg);
      -o-transform: rotate(945deg);
      transform: rotate(945deg);
    }
    to {
      -webkit-transform: rotate(1080deg);
      -moz-transform: rotate(1080deg);
      -ms-transform: rotate(1080deg);
      -o-transform: rotate(1080deg);
      transform: rotate(1080deg);
    }
  }

  @-webkit-keyframes ytp-spinner-left-spin {
    0% {
      -webkit-transform: rotate(130deg);
      -moz-transform: rotate(130deg);
      -ms-transform: rotate(130deg);
      -o-transform: rotate(130deg);
      transform: rotate(130deg);
    }
    50% {
      -webkit-transform: rotate(-5deg);
      -moz-transform: rotate(-5deg);
      -ms-transform: rotate(-5deg);
      -o-transform: rotate(-5deg);
      transform: rotate(-5deg);
    }
    to {
      -webkit-transform: rotate(130deg);
      -moz-transform: rotate(130deg);
      -ms-transform: rotate(130deg);
      -o-transform: rotate(130deg);
      transform: rotate(130deg);
    }
  }

  @keyframes ytp-spinner-left-spin {
    0% {
      -webkit-transform: rotate(130deg);
      -moz-transform: rotate(130deg);
      -ms-transform: rotate(130deg);
      -o-transform: rotate(130deg);
      transform: rotate(130deg);
    }
    50% {
      -webkit-transform: rotate(-5deg);
      -moz-transform: rotate(-5deg);
      -ms-transform: rotate(-5deg);
      -o-transform: rotate(-5deg);
      transform: rotate(-5deg);
    }
    to {
      -webkit-transform: rotate(130deg);
      -moz-transform: rotate(130deg);
      -ms-transform: rotate(130deg);
      -o-transform: rotate(130deg);
      transform: rotate(130deg);
    }
  }

  @-webkit-keyframes ytp-right-spin {
    0% {
      -webkit-transform: rotate(-130deg);
      -moz-transform: rotate(-130deg);
      -ms-transform: rotate(-130deg);
      -o-transform: rotate(-130deg);
      transform: rotate(-130deg);
    }
    50% {
      -webkit-transform: rotate(5deg);
      -moz-transform: rotate(5deg);
      -ms-transform: rotate(5deg);
      -o-transform: rotate(5deg);
      transform: rotate(5deg);
    }
    to {
      -webkit-transform: rotate(-130deg);
      -moz-transform: rotate(-130deg);
      -ms-transform: rotate(-130deg);
      -o-transform: rotate(-130deg);
      transform: rotate(-130deg);
    }
  }

  @keyframes ytp-right-spin {
    0% {
      -webkit-transform: rotate(-130deg);
      -moz-transform: rotate(-130deg);
      -ms-transform: rotate(-130deg);
      -o-transform: rotate(-130deg);
      transform: rotate(-130deg);
    }
    50% {
      -webkit-transform: rotate(5deg);
      -moz-transform: rotate(5deg);
      -ms-transform: rotate(5deg);
      -o-transform: rotate(5deg);
      transform: rotate(5deg);
    }
    to {
      -webkit-transform: rotate(-130deg);
      -moz-transform: rotate(-130deg);
      -ms-transform: rotate(-130deg);
      -o-transform: rotate(-130deg);
      transform: rotate(-130deg);
    }
  }

  /*===== HEADER HERO =====*/

  .header-hero {
    position: relative;
    z-index: 5;
    background-position: top center;
  }

  /*#particles-1 {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*z-index: -1;*/
  /*}*/

  .header-hero-content {
    padding-top: 180px;
  }

  @media (max-width: 767px) {
    .header-hero-content {
      padding-top: 100px;
    }
  }

  .header-hero-content .header-sub-title {
    font-size: 38px;
    font-weight: 300;
    color: #fff;
  }

  @media (max-width: 767px) {
    .header-hero-content .header-sub-title {
      font-size: 24px;
    }
  }

  @media only screen and (min-width: 576px) and (max-width: 767px) {
    .header-hero-content .header-sub-title {
      font-size: 30px;
    }
  }

  .header-hero-content .header-title {
    font-size: 38px;
    font-weight: 700;
    color: #fff;
  }

  @media (max-width: 767px) {
    .header-hero-content .header-title {
      font-size: 24px;
    }
  }

  @media only screen and (min-width: 576px) and (max-width: 767px) {
    .header-hero-content .header-title {
      font-size: 30px;
    }
  }

  .header-hero-content .text {
    color: #fff;
    margin-top: 30px;
  }

  .header-hero-content .main-btn {
    margin-top: 40px;
  }

  .header-hero-image {
    padding-top: 45px;
  }

  .header-hero-image img {
    max-width: 650px;
  }

  @media (max-width: 767px) {
    .header-hero-image img {
      max-width: 100%;
    }
  }

  @media (max-width: 767px) {
    .header-hero-image {
      padding-top: 30px;
    }
  }

  .single-logo img {
    width: 100%;
    opacity: 0.5;
    -webkit-transition: all 0.3s ease-out 0s;
    -moz-transition: all 0.3s ease-out 0s;
    -ms-transition: all 0.3s ease-out 0s;
    -o-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
  }

  .single-logo:hover img {
    opacity: 1;
  }

  /*===========================
        04.SERVICES css
  ===========================*/

  .single-services {
    background-color: #fff;
    -webkit-box-shadow: 0px 5px 30px 0px rgba(167, 167, 167, 0.16);
    -moz-box-shadow: 0px 5px 30px 0px rgba(167, 167, 167, 0.16);
    box-shadow: 0px 5px 30px 0px rgba(167, 167, 167, 0.16);
    -webkit-transition: all 0.3s ease-out 0s;
    -moz-transition: all 0.3s ease-out 0s;
    -ms-transition: all 0.3s ease-out 0s;
    -o-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
    padding: 50px 30px;
    border: 2px solid transparent;
    border-radius: 8px;
  }

  @media (max-width: 767px) {
    .single-services {
      padding: 20px 20px 30px;
    }
  }

  .single-services .services-icon {
    display: inline-block;
    position: relative;
  }

  .single-services .services-icon img {
    -webkit-transition: all 0.4s ease-out 0s;
    -moz-transition: all 0.4s ease-out 0s;
    -ms-transition: all 0.4s ease-out 0s;
    -o-transition: all 0.4s ease-out 0s;
    transition: all 0.4s ease-out 0s;
  }

  .single-services .services-icon .shape-1 {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .single-services .services-icon i {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 34px;
    color: #fff;
  }

  .single-services .services-content .services-title a {
    font-size: 26px;
    font-weight: 700;
    color: #2e2e2e;
    -webkit-transition: all 0.3s ease-out 0s;
    -moz-transition: all 0.3s ease-out 0s;
    -ms-transition: all 0.3s ease-out 0s;
    -o-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
  }

  @media only screen and (min-width: 992px) and (max-width: 1199px) {
    .single-services .services-content .services-title a {
      font-size: 24px;
    }
  }

  @media (max-width: 767px) {
    .single-services .services-content .services-title a {
      font-size: 20px;
    }
  }

  .single-services .services-content .services-title a:hover {
    color: #361cc1;
  }

  .single-services .services-content .text {
    margin-top: 30px;
  }

  @media (max-width: 767px) {
    .single-services .services-content .text {
      margin-top: 20px;
    }
  }

  .single-services .services-content .more {
    margin-top: 30px;
    font-size: 16px;
    font-weight: 400;
    color: #2e2e2e;
    -webkit-transition: all 0.3s ease-out 0s;
    -moz-transition: all 0.3s ease-out 0s;
    -ms-transition: all 0.3s ease-out 0s;
    -o-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
  }

  .single-services .services-content .more i {
    margin-left: 10px;
  }

  .single-services .services-content .more:hover {
    color: #444444;
  }

  .single-services:hover {
    border-color: #fe7a7b;
  }

  .single-services:hover .services-icon .shape {
    -webkit-transform: rotate(25deg);
    -moz-transform: rotate(25deg);
    -ms-transform: rotate(25deg);
    -o-transform: rotate(25deg);
    transform: rotate(25deg);
  }

  /*===========================
        05.ABOUT css
  ===========================*/

  .about-area {
    position: relative;
    z-index: 5;
  }

  .about-shape-1 {
    position: absolute;
    top: 0;
    right: 0;
    width: 35%;
    height: 100%;
    z-index: -1;
  }

  .about-shape-1 img {
    width: 100%;
  }

  @media (max-width: 767px) {
    .about-shape-1 {
      display: none;
    }
  }

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

  .about-content {
    max-width: 480px;
  }

  .about-content .text {
    margin-top: 15px;
  }

  .about-content .main-btn {
    background: #ed592a;
    background-size: 200%;
    height: 50px;
    line-height: 50px;
    padding: 0 35px;
    margin-top: 40px;
  }

  .about-content .main-btn:hover {
    background: #e6947b;
  }

  /*===========================
         11.FOOTER  css
  ===========================*/

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
    background-image: url("/img/project/home/footer-bg.jpg");
    background-position: top center;
    z-index: -1;
    background-size: cover;
  }

  @media only screen and (min-width: 1921px) {
    .footer-area::before {
      height: 1120px;
    }
  }

  /*#particles-2 {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*z-index: -1;*/
  /*}*/

  .footer-widget {
    padding-top: 50px;
  }

  .footer-about .logo img {
    width: 160px;
  }

  .footer-about .text {
    color: #646565;
    line-height: 30px;
    margin-top: 30px;
  }

  .footer-about .social {
    margin-top: 40px;
  }

  .footer-about .social li {
    display: inline-block;
    margin-right: 30px;
  }

  .footer-about .social li a {
    font-size: 22px;
    color: #646565;
    -webkit-transition: all 0.3s ease-out 0s;
    -moz-transition: all 0.3s ease-out 0s;
    -ms-transition: all 0.3s ease-out 0s;
    -o-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
  }

  .footer-about .social li a:hover {
    color: #fe8464;
  }

  .footer-title .title {
    font-size: 24px;
    font-weight: 700;
    color: #646565;
  }

  .link-wrapper {
    padding: 0 35px;
  }

  @media (max-width: 767px) {
    .link-wrapper {
      padding: 0;
      padding-right: 50px;
    }
  }

  .link-wrapper .link {
    padding-top: 20px;
  }

  .link-wrapper .link li {
    margin-top: 20px;
  }

  .link-wrapper .link li a {
    font-size: 16px;
    color: #646565;
    -webkit-transition: all 0.3s ease-out 0s;
    -moz-transition: all 0.3s ease-out 0s;
    -ms-transition: all 0.3s ease-out 0s;
    -o-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
  }

  .link-wrapper .link li a:hover {
    color: #fe8464;
  }

  .footer-contact .contact {
    padding-top: 20px;
  }

  .footer-contact .contact li {
    margin-top: 10px;
    font-size: 16px;
    color: #646565;
  }

  .copyright-content p {
    color: #646565;
  }

  .copyright-content a {
    font-size: 16px;
    color: #646565;
    -webkit-transition: all 0.3s ease-out 0s;
    -moz-transition: all 0.3s ease-out 0s;
    -ms-transition: all 0.3s ease-out 0s;
    -o-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
  }

  .copyright-content a:hover {
    color: #fe8464;
  }

  /*===== BACK TO TOP =====*/

  #back-to-top {
    font-size: 20px;
    color: #fff;
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    background: -webkit-linear-gradient(left, #361cc1 0%, #2e82ef 100%);
    background: -o-linear-gradient(left, #361cc1 0%, #2e82ef 100%);
    background: linear-gradient(to right, #361cc1 0%, #2e82ef 100%);
    text-align: center;
    z-index: 99;
    -webkit-transition: all 0.3s ease-out 0s;
    -moz-transition: all 0.3s ease-out 0s;
    -ms-transition: all 0.3s ease-out 0s;
    -o-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
    display: none;
  }

  #back-to-top:hover {
    color: #fff;
  }

  .height-300 {
    height: 400px;
  }
</style>
