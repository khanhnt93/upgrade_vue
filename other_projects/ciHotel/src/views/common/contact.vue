<template>
  <div class="container-fluid">
    <div class="grid grid-cols-1">
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <form @submit.prevent>
            <div class="grid grid-cols-1">
              <div class="md:col-span-12">
                <h4 class="text-center text-xl font-semibold">Liên hệ</h4>
              </div>
            </div>
            <hr class="my-4"/>

            <div class="grid grid-cols-1 border-b border-yellow-500 pb-4">
              <div class="md:col-span-12">
                <h5 class="text-lg font-semibold mb-2">Tư vấn - CSKH</h5>
                <p><label class="font-medium">Nhân viên:</label> Ms.Anh</p>
                <p><label class="font-medium">Số điện thoại:</label> 0969.675.819</p>
                <p><label class="font-medium">Zalo:</label> 0969.675.819</p>
                <p>
                  <label class="font-medium">Facebook:</label>
                  <a href="https://www.facebook.com/CiinTech-Co-Ltd-110706387220364" target="_blank" class="text-blue-600 hover:underline">
                    https://www.facebook.com/CiinTech-Co-Ltd-110706387220364
                  </a>
                </p>
                <br>
              </div>
            </div>

            <br>
            <div class="grid grid-cols-1 border-b border-yellow-500 pb-4">
              <div class="md:col-span-12">
                <h5 class="text-lg font-semibold mb-2">Kỹ thuật</h5>
                <p><label class="font-medium">Nhân viên:</label> Ms.Anh</p>
                <p><label class="font-medium">Số điện thoại:</label> 0969.675.819</p>
                <p><label class="font-medium">Zalo:</label> 0969.675.819</p>
                <p>
                  <label class="font-medium">Facebook:</label>
                  <a href="https://www.facebook.com/CiinTech-Co-Ltd-110706387220364" target="_blank" class="text-blue-600 hover:underline">
                    https://www.facebook.com/CiinTech-Co-Ltd-110706387220364
                  </a>
                </p>
                <br>
              </div>
            </div>
            <br>
            <div class="grid grid-cols-1">
              <div class="md:col-span-12">
                <h5 class="text-lg font-semibold mb-2">ciHotel - Sản phẩm của cty CiInTech</h5>
                <p><label class="font-medium">Số điện thoại:</label> 0865.827.248</p>
                <p><label class="font-medium">Mã số thuế:</label> 0316431771</p>
                <p><label class="font-medium">Địa chỉ:</label> 23/36 Mai Lão Bạng p.13 Q.Tân Bình HCM</p>
                <p><label class="font-medium">Thông tin giao dịch:</label></p>
                <p class="pl-4">- Ngân hàng MB Bank</p>
                <p class="pl-4">- STK: 9391135440021</p>
                <p class="pl-4">- Chi nhánh TP HCM</p>
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
  .imageLogo {
    width: 100%;
    height: 100%;
  }
  .lv2 {
    padding-left: 10px;
  }
</style>
