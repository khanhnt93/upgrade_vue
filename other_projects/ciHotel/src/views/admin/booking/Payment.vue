<template>
  <div class="container-fluid mx-auto px-4">
    <!-- Header Buttons -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <button
            class="w-full md:w-auto px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            @click="goBack()"
          >
            Quay lại
          </button>
        </div>
        <div v-show="!loading" class="flex justify-end">
          <button
            class="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            @click="showModalConfirmPayment()"
            :disabled="paymentInfo.length == 0"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>

    <!-- Title -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-4">
      <h5 class="text-2xl font-bold text-center text-gray-800">Thông Tin Thanh Toán</h5>
    </div>

    <!-- Loading -->
    <div v-show="loading" class="flex justify-center py-8">
      <i class="fa fa-spinner fa-spin text-4xl text-blue-600"></i>
    </div>

    <!-- Main Content -->
    <div v-show="!loading" class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column - Room Info -->
        <div>
          <h4 class="text-xl font-bold mb-3">Tên phòng: {{paymentInfo.room_name}}</h4>
          <p class="mb-2"><b>Loại phòng:</b> {{paymentInfo.room_type_name}}</p>
          <p class="mb-2"><b>Khách hàng:</b> {{paymentInfo.customer_name}}</p>
          <p class="mb-2">
            <b>Số lượng khách:</b>
            <span v-if="paymentInfo.adult && paymentInfo.adult > 0">{{paymentInfo.adult}} người lớn</span>
            <span class="ml-2" v-if="paymentInfo.children && paymentInfo.children > 0">{{paymentInfo.children}} trẻ em</span>
          </p>
          <p class="mb-2"><b>Booking giờ đến:</b> {{paymentInfo.time_in}}</p>
          <p class="mb-2"><b>Booking giờ đi:</b> {{paymentInfo.time_out}}</p>
          <p class="mb-2"><b>Giờ khách đến thực tế:</b> {{formattedActualCheckIn}}</p>
          <p class="mb-2">
            <b>Giờ khách đi thực tế:</b> {{formattedActualCheckOut}}
            <i class="fa fa-edit ml-2 cursor-pointer text-blue-600 hover:text-blue-800" @click="showModalEditActualCheckOut"></i>
          </p>
          <p class="mb-2"><b>Giờ khách ở:</b> {{paymentInfo.time_at}}</p>
        </div>

        <!-- Right Column - Payment Info -->
        <div>
          <h4 class="text-xl font-bold mb-3 flex justify-between items-center">
            <span>Thành tiền:</span>
            <span>
              <button
                class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
                title="Tính tiền thừa"
                @click="showModalCalMoneyRefund"
                :disabled="isPayment"
              >
                <i class="fa fa-calculator"></i>
              </button>
              <span class="ml-2">{{formatCurrency(paymentInfo.total)}}</span>
            </span>
          </h4>

          <div v-show="paymentInfo.money_receive" class="mb-2 text-right">
            <p>Số tiền khách đưa: <b>{{formatCurrency(paymentInfo.money_receive)}}</b> | Số tiền trả khách: <b>{{formatCurrency(paymentInfo.money_receive - paymentInfo.total)}}</b></p>
          </div>

          <p class="mb-2 flex justify-between">
            <b>Tổng tiền phòng:</b>
            <span>{{formatCurrency(paymentInfo.sub_total)}}</span>
          </p>
          <p class="mb-2 flex justify-between" v-show="paymentInfo.service_amount">
            <b>Phí dịch vụ/Phụ thu:</b>
            <span>{{formatCurrency(paymentInfo.service_amount)}}</span>
          </p>
          <p class="mb-2 flex justify-between" v-show="paymentInfo.discount_amount">
            <b>Tổng giảm giá:</b>
            <span>{{formatCurrency(paymentInfo.discount_amount)}}</span>
          </p>
          <p class="mb-2 flex justify-between">
            <b>Thành tiền trước thuế:</b>
            <span>{{formatCurrency(paymentInfo.total - paymentInfo.vat_value)}}</span>
          </p>
          <p class="mb-2 flex justify-between items-center" v-if="paymentInfo.vat_percent">
            <span>
              <b>Thuế VAT:</b>
              <input
                type="checkbox"
                v-model="paymentInfo.apply_vat"
                @change="applyVat"
                :disabled="isPayment"
                class="ml-2 mr-2 w-5 h-5 align-middle"
              />
              <input
                id="vat_percent"
                type="text"
                v-model="paymentInfo.vat_percent"
                autocomplete="new-password"
                @keyup="integerOnly($event.target)"
                maxlength="3"
                @change="applyVat"
                class="w-12 px-2 py-1 border border-gray-300 rounded"
              />%
            </span>
            <span>{{formatCurrency(paymentInfo.vat_value)}}</span>
          </p>

          <!-- Money Types -->
          <div class="mt-4 p-4 bg-gray-50 rounded">
            <div class="flex justify-between items-center mb-2">
              <label class="font-bold">Loại tiền:</label>
              <button
                class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
                @click="showModalExtendMoney"
                :disabled="isPayment"
              >
                <i class="fa fa-plus"></i>
              </button>
            </div>
            <div class="ml-3">
              <p>Tiền mặt: {{formatCurrency(paymentInfo.cash)}}</p>
              <p>Chuyển khoản: {{formatCurrency(paymentInfo.credit)}}</p>
              <p>E_money: {{formatCurrency(paymentInfo.e_money)}}</p>
            </div>
          </div>

          <!-- Promotions -->
          <div class="mt-4 p-4 bg-gray-50 rounded">
            <div class="flex justify-between items-center mb-2">
              <label class="font-bold">Khuyến mãi:</label>
              <button
                class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
                @click="showModalApplyPmt"
                :disabled="isPayment"
              >
                <i class="fa fa-plus"></i>
              </button>
            </div>
            <div v-show="paymentInfo.pmts && paymentInfo.pmts.length > 0" class="ml-3">
              <label class="font-semibold">Khuyến mãi đang áp dụng:</label>
              <div v-for="(pmt, index) in paymentInfo.pmts" :key="pmt.name + index" class="flex justify-between items-center">
                <span>{{pmt.quantity_apply + " x " + pmt.name}}</span>
                <i v-show="pmt.method != 'auto'" class="fa fa-trash cursor-pointer text-red-600 hover:text-red-800" @click="deletePromotion(pmt.id)"></i>
              </div>
            </div>
          </div>

          <!-- Service Fees -->
          <div class="mt-4 p-4 bg-gray-50 rounded">
            <div class="flex justify-between items-center mb-2">
              <label class="font-bold">Phí dịch vụ, phụ thu:</label>
              <button
                class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
                @click="showModalServiceFee"
                :disabled="isPayment"
              >
                <i class="fa fa-plus"></i>
              </button>
            </div>
            <div v-show="paymentInfo.service && paymentInfo.service.length > 0" class="ml-3">
              <label class="font-semibold">Dịch vụ, phụ thu đang áp dụng:</label>
              <div v-for="(service, index) in paymentInfo.service" :key="service.name + index" class="flex justify-between items-center">
                <span>{{service.quantity + " x " + service.name + " (" + formatCurrency(service.price) + ") = " + formatCurrency(service.price * service.quantity)}}</span>
                <i class="fa fa-trash cursor-pointer text-red-600 hover:text-red-800" @click="deleteService(service.name, service.price)"></i>
              </div>
            </div>
          </div>

          <!-- Split Payment Times -->
          <p class="mt-4 mb-2 font-bold">Chi tiết thời gian:</p>
          <ul v-if="paymentInfo && paymentInfo.payment_split_times && paymentInfo.payment_split_times.length > 0">
            <li v-for="(item, index) in paymentInfo.payment_split_times" :key="index">
              <div class="mb-2 flex justify-between items-center">
                <span>Từ {{item.start_time.substring(0, 16)}} đến {{item.end_time.substring(0, 16)}}{{item.unit_number > 1 ? ` (${item.unit_number})` : ''}}: <b>{{formatCurrency(item.amount)}}</b></span>
                <i class="fa fa-edit cursor-pointer text-blue-600 hover:text-blue-800" @click="showModalSplitBill($event, index)"></i>
              </div>
              <EditSplitBillModal
                :title="'Thay đổi giá trị bill tách số ' + item.payment_split_time_id"
                :handle-submit="confirmEditSplitBill"
                :id="index"
              />
            </li>
          </ul>

          <!-- Note -->
          <p class="mt-4 mb-2 font-bold">Ghi chú:</p>
          <div>
            <textarea
              placeholder="Ghi chú"
              rows="3"
              v-model="paymentInfo.note"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div class="text-center mt-2">
            <button
              class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              @click="updateNote()"
            >
              Cập nhật ghi chú
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Edit Actual Check Out -->
    <div v-if="showActualCheckOutModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h5 class="text-center text-lg font-bold mb-3">Nhập thời gian khách đi thực tế:</h5>
        <hr class="mb-4"/>

        <div class="mb-4">
          <span class="block mb-2">Thời gian cũ:</span>
          <input
            class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
            type="text"
            v-model="formattedActualCheckOut"
            readonly
          />
        </div>

        <div class="mb-4">
          <span class="block mb-2">Thời gian mới:</span>
          <Datepicker
            :value="newActualCheckOut"
            ref="editActualCheckOut"
            format="DD-MM-YYYY H:i:s"
            class="w-full"
          />
        </div>

        <div class="flex justify-center gap-2">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            @click="confirmEditActualCheckOut"
          >
            Xác nhận
          </button>
          <button
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            @click="cancelEditActualCheckOut"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Apply Promotions -->
    <div v-if="showApplyPmtModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
        <h5 class="text-center text-lg font-bold mb-3">Áp dụng khuyến mãi</h5>
        <hr class="mb-4"/>

        <div class="max-h-96 overflow-y-auto mb-4">
          <div class="mb-3 flex justify-between items-center" v-for="pmt in pmtOfStore" :key="pmt.id">
            <span><b>-</b> {{pmt.name}}<span v-if="pmt.code">({{pmt.code}})</span></span>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                @click="plusQuantityPmt(pmt.id, pmt.type, pmt.remaining, pmt)"
              >
                <i class="fa fa-plus"></i>
              </button>
              <span class="w-12 text-center" :id="'pmtStore' + pmt.id">0</span>
              <button
                class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                @click="minusQuantityPmt(pmt.id, pmt)"
              >
                <i class="fa fa-minus"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center gap-2 mt-4">
          <button
            class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            @click="cancelApplyPmt()"
          >
            Hủy
          </button>

          <div class="flex items-center gap-2">
            <span v-show="loadingConfirmPmt"><i class="fa fa-spinner fa-spin text-xl"></i></span>
            <button
              v-show="!isPayment && !loadingConfirmPmt"
              class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              @click="confirmApplyPmt()"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Service Fee -->
    <div v-if="showServiceFeeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
        <h5 class="text-center text-lg font-bold mb-3">Thêm phí dịch vụ, phụ thu</h5>
        <hr class="mb-4"/>

        <!-- Custom Tabs -->
        <div class="mb-4">
          <div class="flex border-b">
            <button
              :class="['px-4 py-2 font-semibold', activeServiceTab === 'service' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600']"
              @click="activeServiceTab = 'service'"
            >
              Phí dịch vụ
            </button>
            <button
              :class="['px-4 py-2 font-semibold', activeServiceTab === 'surcharge' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600']"
              @click="activeServiceTab = 'surcharge'"
            >
              Phụ thu
            </button>
            <button
              :class="['px-4 py-2 font-semibold', activeServiceTab === 'roomService' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600']"
              @click="activeServiceTab = 'roomService'"
            >
              Dịch vụ có sẵn
            </button>
          </div>

          <!-- Service Tab Content -->
          <div v-if="activeServiceTab === 'service'" class="mt-4">
            <div class="mb-3">
              <label class="block mb-1">Tên dịch vụ <span class="text-red-600">*</span></label>
              <input
                id="serviceName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded"
                maxlength="100"
              />
            </div>
            <div class="mb-3">
              <label class="block mb-1">Giá dịch vụ <span class="text-red-600">*</span></label>
              <input
                id="servicePrice"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded"
                maxlength="11"
                @keyup="integerOnly($event.target)"
              />
            </div>
            <label v-show="serviceError" class="text-red-600">Hãy nhập đủ các trường bắt buộc</label>
            <div class="text-center mt-3">
              <button
                class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                @click="addNewService()"
              >
                Thêm
              </button>
            </div>
          </div>

          <!-- Surcharge Tab Content -->
          <div v-if="activeServiceTab === 'surcharge'" class="mt-4">
            <div class="mb-3">
              <label class="block mb-1">Tên phụ thu</label>
              <input
                id="surchargeName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded"
                maxlength="100"
              />
            </div>
            <div class="mb-3">
              <label class="block mb-1">Số tiền phụ thu</label>
              <input
                id="surchargePrice"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded"
                maxlength="11"
                @keyup="integerOnly($event.target)"
              />
            </div>
            <label v-show="surchargeError" class="text-red-600">Hãy nhập đủ các trường bắt buộc</label>
            <div class="text-center mt-3">
              <button
                class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                @click="addNewSurcharge()"
              >
                Thêm
              </button>
            </div>
          </div>

          <!-- Room Service Tab Content -->
          <div v-if="activeServiceTab === 'roomService'" class="mt-4">
            <div class="mb-3">
              <input
                placeholder="Lọc"
                v-model="roomServiceFilter"
                class="w-1/2 px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div class="mb-3 flex justify-between items-center" v-for="service in filteredRoomService" :key="service.id">
                <span><b>-</b> {{service.name + " (" + formatCurrency(service.price) + ")"}}</span>
                <div class="flex items-center gap-2">
                  <button
                    class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    @click="plusQuantityRoomService(service.id)"
                  >
                    <i class="fa fa-plus"></i>
                  </button>
                  <span class="w-12 text-center" :id="'RoomService' + service.id">{{service.quantity}}</span>
                  <button
                    class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    @click="minusQuantityRoomService(service.id)"
                  >
                    <i class="fa fa-minus"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="text-center mt-3">
              <button
                class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                @click="addNewRoomService()"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>

        <!-- Current Services List -->
        <div class="mt-4 p-3 bg-gray-50 rounded">
          <div class="mb-2" v-for="service in paymentInfo.service" :key="service.name">
            - <b>Loại</b>: <span v-if="service.type == 'service'">Dịch vụ</span><span v-if="service.type == 'surcharge'">Phụ thu</span><span v-if="service.type == 'roomService'">Dịch vụ có sẵn</span>, <b>Tên</b>: {{service.name}}, <span v-show="service.price"><b>Số tiền</b>: {{formatCurrency(service.price)}}vnđ</span>
            <i class="fa fa-trash cursor-pointer text-red-600 hover:text-red-800 ml-2" @click="deleteServiceTemp(service.type, service.name, service.price)"></i>
          </div>
        </div>

        <div class="flex justify-between items-center gap-2 mt-4">
          <button
            class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            @click="cancelServiceFee()"
          >
            Quay lại
          </button>

          <div class="flex items-center gap-2">
            <span v-show="loadingConfirmService"><i class="fa fa-spinner fa-spin text-xl"></i></span>
            <button
              v-show="!isPayment && !loadingConfirmService"
              class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              @click="confirmServiceFee()"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Extend Money (Payment Types) -->
    <div v-if="showExtendMoneyModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h5 class="text-center text-lg font-bold mb-3">Loại tiền thanh toán</h5>

        <div class="mb-4">
          <p class="mb-3">Tổng tiền: {{formatCurrency(paymentInfo.total)}}</p>
        </div>

        <!-- Custom Tabs for Money Types -->
        <div class="mb-4">
          <div class="flex border-b">
            <button
              :class="['flex-1 py-2 font-semibold', activeMoneyTab === 'cash' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600']"
              @click="activeMoneyTab = 'cash'"
            >
              Tiền mặt
            </button>
            <button
              :class="['flex-1 py-2 font-semibold', activeMoneyTab === 'credit' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600']"
              @click="activeMoneyTab = 'credit'"
            >
              Chuyển khoản
            </button>
            <button
              :class="['flex-1 py-2 font-semibold', activeMoneyTab === 'e_money' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600']"
              @click="activeMoneyTab = 'e_money'"
            >
              Tiền điện tử
            </button>
          </div>

          <div class="mt-4">
            <input
              v-if="activeMoneyTab === 'cash'"
              id="cash"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded"
              maxlength="11"
              v-model="paymentInfo.cash"
              @keyup="intergerOnly($event.target)"
            />
            <input
              v-if="activeMoneyTab === 'credit'"
              id="credit"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded"
              maxlength="11"
              v-model="paymentInfo.credit"
              @keyup="intergerOnly($event.target)"
            />
            <input
              v-if="activeMoneyTab === 'e_money'"
              id="e_money"
              type="text"
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded"
              maxlength="11"
              v-model="paymentInfo.e_money"
              @keyup="intergerOnly($event.target)"
            />
          </div>
        </div>

        <div v-if="errorTotalMoney" class="mb-3 text-red-600">
          Tổng số tiền nhập khác tổng tiền
        </div>

        <div class="mb-4 p-3 bg-gray-50 rounded">
          <p>- Tiền mặt: {{formatCurrency(paymentInfo.cash)}}</p>
          <p>- Chuyển khoản: {{formatCurrency(paymentInfo.credit)}}</p>
          <p>- Tiền điện tử: {{formatCurrency(paymentInfo.e_money)}}</p>
        </div>

        <div class="flex justify-end gap-2">
          <span v-show="loadingConfirmMoneyType"><i class="fa fa-spinner fa-spin text-xl"></i></span>
          <button
            v-show="!isPayment && !loadingConfirmMoneyType"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            @click="confirmExtendMoney()"
            :disabled="parseInt(paymentInfo.total) != parseInt(paymentInfo.cash) + parseInt(paymentInfo.credit) + parseInt(paymentInfo.e_money)"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Calculate Money Refund -->
    <div v-if="showCalMoneyRefundModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h5 class="text-center text-lg font-bold mb-3">Tính tiền thừa</h5>
        <hr class="mb-4"/>

        <div class="ml-5 space-y-2">
          <p>- Số tiền phải trả: <b>{{formatCurrency(paymentInfo.total)}}</b> vnđ</p>
          <div>
            <p class="mb-1">- Số tiền khách đưa:</p>
            <input
              id="moneyReceive"
              v-model="paymentInfo.money_receive"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded"
              maxlength="11"
              @keyup="calculateMoneyRefund"
            />
          </div>
          <p>- Số tiền trả khách: <b>{{formatCurrency(paymentInfo.money_refunds)}}</b> vnđ</p>
        </div>

        <div class="flex justify-between items-center gap-2 mt-4">
          <button
            class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            @click="cancelMoneyRefund()"
          >
            Hủy
          </button>

          <div class="flex items-center gap-2">
            <span v-show="loadingCalMoneyRefund"><i class="fa fa-spinner fa-spin text-xl"></i></span>
            <button
              v-show="!isPayment && !loadingCalMoneyRefund"
              class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              @click="confirmMoneyRefund()"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Confirm Payment -->
    <div v-if="showConfirmPaymentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="border-b pb-3 mb-3">
          <h5 class="text-center text-lg font-bold">Thanh toán phòng: [{{paymentInfo.room_name}}]</h5>
        </div>

        <div class="flex justify-between gap-2 mt-4">
          <button
            v-show="!loadingConfirmPayment"
            class="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            @click="hideModalConfirmPayment"
          >
            Hủy
          </button>

          <div class="flex items-center gap-2">
            <span v-show="loadingConfirmPayment"><i class="fa fa-spinner fa-spin text-xl"></i></span>
            <button
              v-show="!loadingConfirmPayment"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              @click="confirmPayment"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminAPI from '@/api/admin'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Cookies from 'js-cookie'
import moment from 'moment'
import Datepicker from 'vue3-datepicker'
import EditSplitBillModal from "../../../components/EditSplitBillModal"
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useFormatters } from '@/composables/useFormatters'

export default {
  components: {
    EditSplitBillModal,
    Datepicker
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()
    const { formatCurrency } = useFormatters()

    return {
      router,
      route,
      toast,
      formatCurrency
    }
  },
  data() {
    return {
      tableId: null,
      storeId: null,
      paymentInfo: {},
      newActualCheckOut: null,
      pmtTemp: [],
      pmtApplying: [],
      serviceApplying: [],
      roomService: [],
      roomServiceFilter: "",
      isPayment: false,
      loading: false,
      loadingConfirmPmt: false,
      loadingConfirmService: false,
      loadingConfirmMoneyType: false,
      loadingCalMoneyRefund: false,
      loadingConfirmPayment: false,
      pmtOfStore: [],
      serviceError: false,
      surchargeError: false,
      // Modal states
      showActualCheckOutModal: false,
      showApplyPmtModal: false,
      showServiceFeeModal: false,
      showExtendMoneyModal: false,
      showCalMoneyRefundModal: false,
      showConfirmPaymentModal: false,
      // Tab states
      activeServiceTab: 'service',
      activeMoneyTab: 'cash'
    }
  },
  computed: {
    filteredRoomService() {
      if (this.roomServiceFilter.trim().length === 0) return this.roomService
      else {
        return this.roomService.filter(e => e.name.toLowerCase().includes(this.roomServiceFilter.toLowerCase()))
      }
    },
    formattedActualCheckIn() {
      return moment(this.paymentInfo.actual_check_in).format("HH:mm DD-MM-YYYY")
    },
    formattedActualCheckOut() {
      return moment(this.paymentInfo.actual_check_out).format("HH:mm DD-MM-YYYY")
    },
    errorTotalMoney() {
      return this.checkTotalMoney()
    },
    errorPayingMoney() {
      return this.checkPayingMoney()
    }
  },
  mounted() {
    this.storeId = Cookies.get(Constant.STORE_ID)
    this.tableId = Cookies.get(Constant.TABLE_ID)

    // Get payment info with current time as checkout time
    this.getPaymentInfo()

    // Get system config
    this.getSystemConfig()

    // Get pmt of store
    this.getPmtOfStore()
  },
  methods: {
    /**
     * Check total money
     */
    checkTotalMoney() {
      this.paymentInfo.total == this.paymentInfo.cash + this.paymentInfo.credit + this.paymentInfo.e_money
      return (this.clickConfirmExtend && this.paymentInfo.total == null)
    },

    checkPayingMoney() {
      return (this.clickConfirmPayingMoney && (this.paymentInfo.paying == null))
    },

    /**
     * Check validate total money
     */
    checkValidateTotalMoney() {
      return !(this.errorTotalMoney)
    },

    checkValidatePayingMoney() {
      return !(this.errorPayingMoney)
    },

    /**
     * Change default money type
     */
    changeDefaultMoneyType() {
      this.paymentInfo.cash = JSON.parse(JSON.stringify(this.paymentInfo.total))
      this.paymentInfo.credit = 0
      this.paymentInfo.e_money = 0
    },

    /**
     * Get payment info
     */
    getPaymentInfo() {
      this.loading = true
      let paymentId = this.route.params.id

      // Call api get payment info
      adminAPI.getPaymentInfo(paymentId).then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.paymentInfo = res.data.data
          this.paymentInfo.refund = 0
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Get pmt of store
     */
    getPmtOfStore() {
      // Call api get payment info
      adminAPI.getPmtOfStore().then(res => {
        if (res != null && res.data != null) {
          this.pmtOfStore = res.data.data
          this.pmtStoreOld = JSON.parse(JSON.stringify(this.pmtOfStore))
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Get room service
     */
    getRoomService() {
      adminAPI.getRoomService().then(res => {
        if (res != null && res.data != null) {
          this.roomService = res.data.data
          this.roomService.forEach(element => {
            element.quantity = 0
          })
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Get in by id
     */
    getIndexByValue(valueInput, arrayInput) {
      let index = 0
      for (var i in arrayInput) {
        if (arrayInput[i] == valueInput) {
          return index
        }
        index += 1
      }
      return false
    },

    /**
     * Remove pmt code from list pmt code applied
     */
    removeCodeFromListCodeAppiled(index) {
      let indexList = 0
      for (let i in this.pmtCodeApply) {
        if (this.pmtCodeApply[i].index == index) {
          this.pmtCodeApply.splice(indexList, 1)
          break
        }
        indexList += 1
      }
    },

    /**
     * Remove promotion temp
     */
    deletePromotionTemp(id) {
      // Get index pmt by id
      for (let i in this.pmtTemp) {
        if (this.pmtTemp[i].id == id) {
          this.pmtTemp.splice(i, 1)
          break
        }
      }
    },

    /**
     * Remove promotion
     */
    deletePromotion(id) {
      // Get index pmt by id
      let indexTemp = this.getIndexById(id)

      if (indexTemp !== false) {
        this.paymentInfo.pmts.splice(indexTemp, 1)
      }

      // Call api confirm payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.toast.success('Lưu thông tin thành công')

        // Update new info
        this.paymentInfo = res.data.data
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      }).finally(() => {
        this.getPaymentInfo()
      })
    },

    /**
     * Remove service
     */
    deleteService(name, price) {
      // Remove service
      for (let i in this.paymentInfo.service) {
        if (this.paymentInfo.service[i].name == name && this.paymentInfo.service[i].price == price) {
          this.paymentInfo.service.splice(i, 1)
          break
        }
      }

      // Call api confirm payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.toast.success('Lưu thông tin thành công')
        this.getPaymentInfo()
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Delete service temp (in modal)
     */
    deleteServiceTemp(type, name, price) {
      for (let i in this.paymentInfo.service) {
        if (this.paymentInfo.service[i].type == type &&
            this.paymentInfo.service[i].name == name &&
            this.paymentInfo.service[i].price == price) {
          this.paymentInfo.service.splice(i, 1)
          break
        }
      }
    },

    /**
     * Show modal edit actual check out
     */
    showModalEditActualCheckOut() {
      this.newActualCheckOut = moment().format("DD-MM-YYYY HH:mm:ss")
      this.showActualCheckOutModal = true
    },

    /**
     * Show modal apply pmt
     */
    showModalApplyPmt() {
      this.pmtTemp = JSON.parse(JSON.stringify(this.paymentInfo.pmts))
      this.showApplyPmtModal = true

      setTimeout(this.updatePmtAllyToModal, 1000)
    },

    updatePmtAllyToModal() {
      if (this.pmtTemp.length > 0 && this.pmtOfStore.length > 0) {
        for (let itemTemp of this.pmtTemp) {
          for (let itemStore of this.pmtOfStore) {
            if (itemTemp.id == itemStore.id) {
              document.getElementById("pmtStore" + itemTemp.id).innerHTML = itemTemp.quantity_apply
            }
          }
        }
      }
    },

    /**
     * Show modal calculate
     */
    showModalCalMoneyRefund() {
      this.showCalMoneyRefundModal = true
    },

    /**
     * Show modal service fee
     */
    showModalServiceFee() {
      this.getRoomService()
      this.showServiceFeeModal = true
    },

    /**
     * Hide modal service fee
     */
    hideModalServiceFee() {
      this.roomService.forEach(element => {
        element.quantity = 0
      })
    },

    /**
     * Show modal extend money
     */
    showModalExtendMoney() {
      this.showExtendMoneyModal = true
    },

    /**
     * Go to table list
     */
    goBack() {
      this.router.push('/booking/list-room')
    },

    /**
     * Show modal confirm payment
     */
    showModalConfirmPayment() {
      this.showConfirmPaymentModal = true
    },

    /**
     * Hide modal confirm payment
     */
    hideModalConfirmPayment() {
      this.showConfirmPaymentModal = false
    },

    /**
     * Confirm payment
     */
    confirmPayment() {
      this.loadingConfirmPayment = true

      // Call api confirm payment
      adminAPI.confirmPaymentBooking(this.paymentInfo).then(res => {
        if (res != null && res.data != null) {
          this.loadingConfirmPayment = false
          this.router.push('/booking/list-room')
        }
      }).catch(err => {
        this.loadingConfirmPayment = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Only input integer
     */
    integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },

    /**
     * Only input integer (different method name)
     */
    intergerOnly(item) {
      this.integerOnly(item)
    },

    /**
     * Mapping system config
     */
    mappingSystemConfig(settings) {
      for (var index in settings) {
        // Setting is quantity pmt
        if (settings[index].fields.code == Constant.QUANTITY_PMT) {
          this.quantityPmt = settings[index].fields.value
        }

        // Setting is quantity discount
        if (settings[index].fields.code == Constant.QUANTITY_DISCOUNT) {
          this.quantityDiscount = settings[index].fields.value
        }

        // Setting is quantity voucher
        if (settings[index].fields.code == Constant.QUANTITY_VOUCHER) {
          this.quantityVoucher = settings[index].fields.value
        }

        // Setting is quantity free item
        if (settings[index].fields.code == Constant.QUANTITY_FREE_ITEM) {
          this.quantityFreeItem = settings[index].fields.value
        }
      }
    },

    /**
     * Get system config
     */
    getSystemConfig() {
      adminAPI.getSystemConfig().then(res => {
        if (res != null && res.data != null && res.data.data != null) {
          this.mappingSystemConfig(res.data.data)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Confirm apply promotion
     */
    confirmApplyPmt() {
      this.loadingConfirmPmt = true

      // Call api confirm update payment
      this.paymentInfo.pmts = JSON.parse(JSON.stringify(this.pmtTemp))
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        if (res != null && res.data != null) {
          this.toast.success('Lưu thông tin thành công')
          this.showApplyPmtModal = false

          this.loadingConfirmPmt = false
          this.getPaymentInfo()
        }
      }).catch(err => {
        this.loadingConfirmPmt = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Plus 1 result
     */
    plusOne(id) {
      let currentNumber = document.getElementById(id).textContent
      document.getElementById(id).textContent = parseInt(currentNumber) + 1
    },

    /**
     * Minus 1 result
     */
    minusOne(id) {
      let currentNumber = document.getElementById(id).textContent
      if (parseInt(currentNumber) > 0) {
        document.getElementById(id).textContent = parseInt(currentNumber) - 1
      }
    },

    /**
     * Get index by id
     */
    getIndexById(pmtId) {
      let index = 0
      for (var i in this.paymentInfo.pmts) {
        if (this.paymentInfo.pmts[i].id == pmtId) {
          return index
        }
        index += 1
      }
      return false
    },

    /**
     * Add pmt to list
     */
    addPmtToList(pmtInfo) {
      // Add pmt to temp list
      let flagCheckExistTemp = false
      for (let i = 0; i < this.pmtTemp.length; i++) {
        if (parseInt(this.pmtTemp[i].id) === parseInt(pmtInfo.id)) {
          this.pmtTemp[i].quantity_apply = parseInt(this.pmtTemp[i].quantity_apply) + 1
          flagCheckExistTemp = true
          break
        }
      }

      if (!flagCheckExistTemp) {
        let pmtTemp = pmtInfo
        pmtTemp.quantity_apply = 1
        this.pmtTemp.push(pmtTemp)
      }
    },

    /**
     * Get quantity of pmt applying by id
     */
    getQuantityOfPmtApplyingById(pmtId) {
      let result = 0
      for (let index in this.paymentInfo.pmts) {
        if (parseInt(this.paymentInfo.pmts[index].id) === parseInt(pmtId)) {
          result = parseInt(this.paymentInfo.pmts[index].pmt_quantity)
        }
      }
      return result
    },

    /**
     * Plus quantity pmt of store
     */
    plusQuantityPmt(pmtId, type, remaining, pmtInfo) {
      // Check remaining of pmt
      let currentQuantity = this.getQuantityOfPmtApplyingById(pmtId)
      if (currentQuantity == parseInt(remaining)) {
        this.toast.error('Vượt quá số lượng còn lại của khuyến mãi')
        return
      }

      // Plus quantity
      let elementId = 'pmtStore' + pmtId
      this.plusOne(elementId)

      // Add pmt to list
      this.addPmtToList(pmtInfo)
    },

    /**
     * Minus quantity pmt of store
     */
    minusQuantityPmt(pmtId, pmtInfo) {
      let elementId = 'pmtStore' + pmtId

      let currentNumber = parseInt(document.getElementById(elementId).textContent)
      if (currentNumber > 0) {
        let nextIndex = currentNumber - 1
        document.getElementById(elementId).textContent = nextIndex

        if (nextIndex == 0) {
          this.deletePromotionTemp(pmtId)
        } else {
          for (let itemTemp of this.pmtTemp) {
            if (itemTemp.id == pmtId) {
              itemTemp.quantity_apply = nextIndex
            }
          }
        }
      }
    },

    /**
     * Plus quantity room service
     */
    plusQuantityRoomService(serviceId) {
      for (let service of this.roomService) {
        if (service.id == serviceId) {
          service.quantity += 1
          break
        }
      }
    },

    /**
     * Minus quantity room service
     */
    minusQuantityRoomService(serviceId) {
      for (let service of this.roomService) {
        if (service.id == serviceId && service.quantity > 0) {
          service.quantity -= 1
          break
        }
      }
    },

    /**
     * Add new service
     */
    addNewService() {
      let serviceName = document.getElementById('serviceName').value
      let servicePrice = document.getElementById('servicePrice').value

      if (!serviceName || !servicePrice) {
        this.serviceError = true
        return
      }

      this.serviceError = false

      let service = {
        "type": "service",
        "name": serviceName,
        "price": servicePrice,
        "quantity": 1
      }

      this.paymentInfo.service.push(service)

      // Clear inputs
      document.getElementById('serviceName').value = ''
      document.getElementById('servicePrice').value = ''
    },

    /**
     * Add new surcharge
     */
    addNewSurcharge() {
      let surchargeName = document.getElementById('surchargeName').value
      let surchargePrice = document.getElementById('surchargePrice').value

      if (!surchargeName || !surchargePrice) {
        this.surchargeError = true
        return
      }

      this.surchargeError = false

      let surcharge = {
        "type": "surcharge",
        "name": surchargeName,
        "price": surchargePrice,
        "quantity": 1
      }

      this.paymentInfo.service.push(surcharge)

      // Clear inputs
      document.getElementById('surchargeName').value = ''
      document.getElementById('surchargePrice').value = ''
    },

    /**
     * Add new room service
     */
    addNewRoomService() {
      const newRoomService = this.roomService.filter(e => e.quantity != 0)
      for (const item of newRoomService) {
        let roomService = {
          "type": "roomService",
          "id": item.id,
          "quantity": item.quantity,
          "name": item.name,
          "price": item.price
        }
        this.paymentInfo.service.push(roomService)
      }
      this.roomService.forEach(element => {
        element.quantity = 0
      })
    },

    /**
     * Confirm service fee
     */
    confirmServiceFee() {
      this.loadingConfirmService = true

      // Call api update payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.toast.success('Lưu thông tin thành công')
        this.showServiceFeeModal = false
        this.loadingConfirmService = false
        this.getPaymentInfo()
      }).catch(err => {
        this.loadingConfirmService = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Cancel service fee
     */
    cancelServiceFee() {
      this.showServiceFeeModal = false
      this.hideModalServiceFee()
    },

    /**
     * Confirm extend money
     */
    confirmExtendMoney() {
      this.loadingConfirmMoneyType = true

      // Call api update payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.toast.success('Lưu thông tin thành công')
        this.showExtendMoneyModal = false
        this.loadingConfirmMoneyType = false
        this.getPaymentInfo()
      }).catch(err => {
        this.loadingConfirmMoneyType = false
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Apply VAT
     */
    applyVat() {
      // Call api update payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.toast.success('Lưu thông tin thành công')
        this.getPaymentInfo()
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Cancel apply promotion
     */
    cancelApplyPmt() {
      this.pmtTemp = []
      this.showApplyPmtModal = false
    },

    /**
     * Calculate money refund
     */
    calculateMoneyRefund() {
      this.paymentInfo.money_refunds = this.paymentInfo.money_receive - this.paymentInfo.total
    },

    /**
     * Cancel modal money refund
     */
    cancelMoneyRefund() {
      this.showCalMoneyRefundModal = false
    },

    /**
     * Cancel modal edit actual check out
     */
    cancelEditActualCheckOut() {
      this.showActualCheckOutModal = false
    },

    /**
     * Confirm edit actual check out
     */
    confirmEditActualCheckOut() {
      if (this.$refs.editActualCheckOut.date) {
        this.showActualCheckOutModal = false
        this.paymentInfo.actual_check_out = moment(this.$refs.editActualCheckOut.date, "DD-MM-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")

        adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
          this.toast.success('Lưu thông tin thành công')
          this.getPaymentInfo()
        }).catch(err => {
          let errorMess = commonFunc.handleStaffError(err)
          this.toast.error(errorMess)
        })
      }
    },

    /**
     * Confirm money refund
     */
    confirmMoneyRefund() {
      this.loadingCalMoneyRefund = true

      let dataPost = {
        "id": this.paymentInfo.id,
        "money_receive": this.paymentInfo.money_receive,
        "money_refunds": this.paymentInfo.money_refunds
      }

      if (dataPost.money_receive == "") {
        dataPost.money_receive = 0
      }
      if (dataPost.money_refunds == "") {
        dataPost.money_refunds = 0
      }

      // Call api confirm payment
      adminAPI.saveMoneyRefund(dataPost).then(res => {
        this.toast.success('Lưu thông tin thành công')
        this.showCalMoneyRefundModal = false
        this.loadingCalMoneyRefund = false
      }).catch(err => {
        this.loadingCalMoneyRefund = false
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Show modal split bill
     */
    showModalSplitBill(event, id) {
      // This will trigger the EditSplitBillModal component
      // Implementation depends on how EditSplitBillModal works
    },

    /**
     * Confirm edit split bill
     */
    confirmEditSplitBill(index, newAmount) {
      this.paymentInfo.payment_split_times[index].amount = newAmount

      // Call api update payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.toast.success('Lưu thông tin thành công')
        this.showServiceFeeModal = false
        this.loadingConfirmService = false
        this.getPaymentInfo()
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    },

    /**
     * Update note
     */
    updateNote() {
      let params = {
        'payment_id': this.paymentInfo.id,
        'note': this.paymentInfo.note
      }

      // Call api update payment note
      adminAPI.updatePaymentNote(params).then(res => {
        if (res != null && res.data != null) {
          this.toast.success('Cập nhật ghi chú thành công')
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.toast.error(errorMess)
      })
    }
  }
}
</script>

<style lang="css" scoped>
.width-icon {
  width: 40px;
}
.largerCheckbox {
  width: 20px;
  height: 20px;
}
</style>
