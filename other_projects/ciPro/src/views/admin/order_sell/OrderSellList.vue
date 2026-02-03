<template>
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header Actions -->
        <div class="flex justify-end mb-4">
          <button
            @click="goToAdd"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors w-32"
          >
            Thêm
          </button>
        </div>

        <!-- Title -->
        <h4 class="text-2xl font-semibold text-center text-orange-600 mb-4">Danh Sách Đơn Hàng Bán</h4>
        <hr class="mb-6">

        <!-- Filters Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">Thời gian</label>
            <select v-model="time_option" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="opt in timeOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
            </select>
          </div>

          <div>
            <label v-show="time_option != 5" class="block text-sm font-medium mb-1">
              {{time_option == 1 ? 'Từ ngày' : 'Năm' }}
            </label>
            <Datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                        placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
            <select v-show="time_option != 1 && time_option != 5" v-model="year_input" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option v-for="opt in yearOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
            </select>
          </div>

          <div>
            <label v-show="time_option == 1 || time_option == 2 || time_option == 3" class="block text-sm font-medium mb-1">
              {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
            </label>
            <Datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                        placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
            <select v-show="time_option == 2" v-model="month_input" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option v-for="opt in monthOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
            </select>
            <select v-show="time_option == 3" v-model="quarter_input" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option v-for="opt in quarterOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
            </select>
          </div>

          <div v-if="userRole == 'admin'">
            <label class="block text-sm font-medium mb-1">Nhân viên phụ trách</label>
            <Multiselect
              v-model="inputs.staff_in_charge"
              :options="staffOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Tất cả--"
              label="name"
              track-by="name">
            </Multiselect>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Tình trạng đơn</label>
            <select v-model="inputs.status" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Tình trạng công nợ - GH</label>
            <select v-model="inputs.payment_status" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option v-for="opt in paymentStatusOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
            </select>
          </div>
        </div>

        <!-- Filters Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">Số ĐH bán</label>
            <input
              v-model="inputs.order_sell_number"
              type="text"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Các phiếu liên quan</label>
            <input
              v-model="inputs.related_number"
              type="text"
              maxlength="100"
              placeholder="BG..,DHN..,PT..,PC..,XK.."
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Trạng thái HĐ</label>
            <select v-model="inputs.invoice_status" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option v-for="opt in invoiceStatusOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Số HĐ bán ra</label>
            <input
              v-model="inputs.invoice_note"
              type="text"
              maxlength="20"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Khách hàng</label>
            <Multiselect
              v-model="inputs.customer"
              :options="customerOptions"
              :loading="loadingOptions"
              :select-label="''"
              :deselect-label="''"
              placeholder="--Tất cả--"
              label="name"
              track-by="name">
            </Multiselect>
          </div>
        </div>

        <!-- Search Button -->
        <div class="flex justify-end mb-4">
          <button
            @click="prepareToSearch"
            :disabled="onSearch"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors w-32 disabled:opacity-50"
          >
            Tìm Kiếm
          </button>
        </div>

        <!-- Results and Export -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-sm">
            Số kết quả: <span class="font-semibold">{{totalRow}}</span>
          </div>
          <div v-if="excel_items.length > 0">
            <button
              @click="exportToExcel"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded"
            >
              <b>Xuất Excel</b>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">STT</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Số ĐH bán</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Các phiếu liên quan</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">NV phụ trách</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Tình trạng đơn</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Tên K.H</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Tổng giá trị ĐH (gồm VAT)</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Xuất VAT</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Hình thức thanh toán</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Số tiền còn phải TT</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Chi phí bán hàng</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Tình trạng kho</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Ghi chú KD</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Trạng thái giao hàng</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Trạng thái HĐ</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Trạng thái trả hàng</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border">Ghi chú kế toán</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase border"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in items" :key="item.id" :class="item.row_class">
                <td class="px-2 py-2 border">{{item.stt}}</td>
                <td class="px-2 py-2 border">
                  <a :href="'/order-sell-' + scope + '/detail/' + item.id" target="_blank" title="Chi tiết đơn hàng"
                     class="text-blue-600 hover:underline">
                    {{item.order_sell_number}}
                  </a>
                </td>
                <td class="px-2 py-2 border">
                  <div v-for="(ballot, idx) in item.ballots" :key="idx" v-html="ballot" class="block"></div>
                </td>
                <td class="px-2 py-2 border">{{item.staff_on_charge_name}}</td>
                <td class="px-2 py-2 border">{{item.status_str}}</td>
                <td class="px-2 py-2 border">{{item.customer_name}}</td>
                <td class="px-2 py-2 border">{{currencyFormat(item.total)}}</td>
                <td class="px-2 py-2 border">{{item.issue_invoice ? 'Có' : 'Không'}}</td>
                <td class="px-2 py-2 border">{{item.payment_method}}</td>
                <td class="px-2 py-2 border">
                  {{currencyFormat(item.total_remaining)}}
                  <span v-show="item.have_list_income" class="ml-2 cursor-pointer">
                    <i class="fa fa-info-circle" title="Danh sách thu tiền"
                       @click="showModalDetailPayment(item.id, 'total_remaining')"/>
                  </span>
                </td>
                <td class="px-2 py-2 border">
                  {{currencyFormat(item.expend_order_sell)}}
                  <span v-show="item.expend_order_sell" class="ml-2 cursor-pointer">
                    <i class="fa fa-info-circle" title="Danh sách chi tiền" @click="showModalDetailPayment(item.id, 'expend_order_sell')"/>
                  </span>
                </td>
                <td class="px-2 py-2 border">{{item.repo_status_str}}</td>
                <td class="px-2 py-2 border">
                  <p>{{item.description ? ' - ' + item.description : ''}}</p>
                  <p>{{item.shipping_note ? ' - ' + item.shipping_note : ''}}</p>
                </td>
                <td class="px-2 py-2 border">{{item.shipping_status_str}}</td>
                <td class="px-2 py-2 border">
                  <i v-if="userRole == 'admin'" class="fa fa-edit cursor-pointer" @click="showModalChangeInvoiceStatus(item)"
                     title="Cập nhật trạng thái hoá đơn"/>
                  {{item.invoice_note}}
                </td>
                <td class="px-2 py-2 border">{{item.product_back_status_str}}</td>
                <td class="px-2 py-2 border">
                  <i v-if="userRole == 'admin'" class="fa fa-edit cursor-pointer" @click="showModalChangeAccountingNote(item)"
                     title="Cập nhật ghi chú kế toán"/>
                  {{item.accounting_note}}
                </td>
                <td class="px-2 py-2 border">
                  <div class="flex flex-col gap-1">
                    <button v-if="item.status == 0"
                            @click="showModalConfirmOrderSell(item)"
                            class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
                            title="Xác nhận đơn hàng">
                      XN ĐH
                    </button>
                    <button v-if="item.status == 1"
                            @click="showModalCancelOrderSell(item)"
                            class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                            title="Huỷ đơn hàng">
                      Huỷ ĐH
                    </button>
                    <button v-if="item.status < 6"
                            @click="goToUpdate(item.id)"
                            class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
                            title="Chỉnh sửa đơn hàng">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button v-if="item.status == 6"
                            @click="openModalCreateBallot(item)"
                            class="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded"
                            title="Tạo phiếu nhập kho">
                      <i class="fa fa-plus"></i> PHG
                    </button>
                    <button v-if="item.can_delete"
                            @click="deleteOrderSellAfterCancel(item.id, item.customer_name)"
                            class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                            title="Xóa đơn hàng">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading More -->
        <div v-if="hasNext && totalRow != 0" class="text-center py-4">
          <i class="fa fa-angle-double-down text-2xl text-gray-500"></i>
        </div>
      </div>
    </div>

    <!-- Modal Change Invoice Status -->
    <div v-if="showChangeInvoiceStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalChangeInvoiceStatus">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-center text-xl font-semibold text-orange-600 mb-4">Cập Nhật Trạng Thái Hoá Đơn</h4>
          <hr class="mb-4">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Trạng thái<span class="text-red-500">*</span></label>
              <select v-model="statusInvoiceChange" class="w-full px-3 py-2 border border-gray-300 rounded">
                <option v-for="opt in statusInvoiceOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Ghi chú<span v-if="statusInvoiceChange == 2" class="text-red-500">*</span></label>
              <input
                v-model="invoice_note"
                type="text"
                maxlength="50"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="hideModalChangeInvoiceStatus"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
              Đóng
            </button>
            <button @click="confirmChangeInvoiceStatus"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Change Accounting Note -->
    <div v-if="showChangeAccountingNoteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalChangeAccountingNote">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-center text-xl font-semibold text-orange-600 mb-4">Cập Nhật Ghi Chú Kế Toán</h4>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea
              v-model="currentOrderSell.accounting_note"
              rows="3"
              maxlength="500"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="hideModalChangeAccountingNote"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
              Đóng
            </button>
            <button @click="confirmChangeAccountingNote"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create Ballot -->
    <div v-if="showCreateBallotModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalCreateBallot">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-center text-xl font-semibold text-orange-600 mb-4">Tạo Phiếu Nhập Kho - Xuất Hàng</h4>
          <hr class="mb-4">

          <div class="text-center mb-4">
            <p class="text-lg">Khách hàng: <span class="font-semibold">{{currentOrderSell.customer_name}}</span></p>
            <p class="text-lg">Số ĐH: <span class="font-semibold">{{currentOrderSell.order_sell_number}}</span></p>
          </div>

          <div class="flex justify-center gap-4">
            <button @click="goToCreateBallotInput"
                    class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded">
              Phiếu nhập kho
            </button>
            <button @click="goToCreateBallotOutput"
                    class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded">
              Phiếu xuất hàng giao
            </button>
          </div>

          <div class="mt-4 flex justify-end">
            <button @click="hideModalCreateBallot"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirm Order -->
    <div v-if="showConfirmOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalConfirmOrderSell">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-center text-xl font-semibold text-orange-600 mb-4">Xác Nhận Đơn Hàng</h4>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea
              v-model="currentOrderSell.accounting_note"
              rows="3"
              maxlength="500"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </textarea>
          </div>

          <div v-if="product_manual_inputs.length > 0" class="mb-4">
            <h5 class="text-lg font-semibold mb-2">Các sản phẩm nhập tay cần kiểm tra:</h5>
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-2 py-2 border text-left">Mã SP</th>
                    <th class="px-2 py-2 border text-left">Tên SP</th>
                    <th class="px-2 py-2 border text-left">Nhóm SP</th>
                    <th class="px-2 py-2 border text-left">Loại SP</th>
                    <th class="px-2 py-2 border text-left">Hãng</th>
                    <th class="px-2 py-2 border text-left">ĐVT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, idx) in product_manual_inputs" :key="idx">
                    <td class="px-2 py-2 border">{{product.product_code_input}}</td>
                    <td class="px-2 py-2 border">{{product.product_name_input}}</td>
                    <td class="px-2 py-2 border">{{product.product_group_name}}</td>
                    <td class="px-2 py-2 border">{{product.product_type_name}}</td>
                    <td class="px-2 py-2 border">{{product.brand_name_input}}</td>
                    <td class="px-2 py-2 border">{{product.unit_name_input}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="hideModalConfirmOrderSell"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
              Đóng
            </button>
            <button @click="confirmOrderSell"
                    :disabled="confirmingOrderSell"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Cancel Order -->
    <div v-if="showCancelOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalCancelOrderSell">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-center text-xl font-semibold text-orange-600 mb-4">Huỷ Đơn Hàng</h4>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Lý do huỷ<span class="text-red-500">*</span></label>
            <textarea
              v-model="currentOrderSell.accounting_note"
              rows="3"
              maxlength="500"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="hideModalCancelOrderSell"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
              Đóng
            </button>
            <button @click="cancelOrderSell"
                    :disabled="cancelingOrderSell"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal List Income -->
    <div v-if="showListIncomeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalDetailPayment">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-center text-xl font-semibold text-orange-600 mb-4">{{title_modal_income_expend_list}}</h4>
          <hr class="mb-4">

          <div v-if="loadingIncome" class="text-center py-4">
            <i class="fa fa-spinner fa-spin text-2xl"></i>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-2 py-2 border text-left">STT</th>
                  <th class="px-2 py-2 border text-left">Ngày</th>
                  <th class="px-2 py-2 border text-left">Số phiếu</th>
                  <th class="px-2 py-2 border text-left">Số tiền</th>
                  <th class="px-2 py-2 border text-left">Sổ thu chi</th>
                  <th class="px-2 py-2 border text-left">Nội dung</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in incomeItems" :key="idx">
                  <td class="px-2 py-2 border">{{idx + 1}}</td>
                  <td class="px-2 py-2 border">{{item.created_at}}</td>
                  <td class="px-2 py-2 border">{{item.fund_number}}</td>
                  <td class="px-2 py-2 border">{{currencyFormat(item.amount)}}</td>
                  <td class="px-2 py-2 border">{{item.bank_account_info}}</td>
                  <td class="px-2 py-2 border">{{item.description}}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex justify-end">
            <button @click="hideModalDetailPayment"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import orderSellApi from '@/api/orderSell'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { popToast } = useToast()

// Time options
const timeOptions = [
  {"value": 1, "text": 'Ngày'},
  {"value": 2, "text": 'Tháng'},
  {"value": 3, "text": 'Quý'},
  {"value": 4, "text": 'Năm'},
  {"value": 5, "text": 'Tất cả'}
]
const yearOptions = ref([])
const quarterOptions = [
  {"value": 1, "text": 'Quý 1'},
  {"value": 2, "text": 'Quý 2'},
  {"value": 3, "text": 'Quý 3'},
  {"value": 4, "text": 'Quý 4'}
]
const monthOptions = [
  {"value": 1, "text": 'Tháng 1'},
  {"value": 2, "text": 'Tháng 2'},
  {"value": 3, "text": 'Tháng 3'},
  {"value": 4, "text": 'Tháng 4'},
  {"value": 5, "text": 'Tháng 5'},
  {"value": 6, "text": 'Tháng 6'},
  {"value": 7, "text": 'Tháng 7'},
  {"value": 8, "text": 'Tháng 8'},
  {"value": 9, "text": 'Tháng 9'},
  {"value": 10, "text": 'Tháng 10'},
  {"value": 11, "text": 'Tháng 11'},
  {"value": 12, "text": 'Tháng 12'}
]

const time_option = ref(1)
const year_input = ref(2023)
const quarter_input = ref(1)
const month_input = ref(1)

// Status options
const statusOptions = [
  {"value": null, "text": 'Tất cả'},
  {"value": -1, "text": 'Đơn lưu nháp'},
  {"value": 0, "text": 'Đơn chờ xác nhận'},
  {"value": 1, "text": 'Đơn đang thực hiện'},
  {"value": 6, "text": 'Đơn hoàn thành'},
  {"value": 7, "text": 'Đơn đã hủy'}
]
const paymentStatusOptions = [
  {"value": null, "text": 'Tất cả'},
  {"value": 1, "text": 'Đã giao hàng - chưa thanh toán'},
  {"value": 2, "text": 'Chưa giao hàng - đã thanh toán'},
  {"value": 3, "text": 'Chưa giao hàng - chưa thanh toán'}
]
const invoiceStatusOptions = [
  {"value": null, "text": 'Tất cả'},
  {"value": 0, "text": 'Không xuất HD'},
  {"value": 1, "text": 'Chưa xuất HD'},
  {"value": 2, "text": 'Đã xuất HD'}
]
const statusInvoiceOptions = [
  {"value": 0, "text": 'Không xuất HD'},
  {"value": 1, "text": 'Chưa xuất HD'},
  {"value": 2, "text": 'Đã xuất HD'}
]

const staffOptions = ref([])
const customerOptions = ref([])
const loadingOptions = ref(false)

const inputs = reactive({
  status: null,
  payment_status: null,
  staff_in_charge: null,
  related_number: null,
  order_sell_number: null,
  invoice_status: null,
  invoice_note: null,
  customer: null,
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02')
})

const items = ref([])
const currentOrderSell = ref({})
const statusInvoiceChange = ref(null)
const invoice_note = ref(null)
const onChangeStatus = ref(false)
const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const totalRow = ref(0)
const userRole = ref("admin")
const scope = ref("all")
const excel_items = ref([])
const isGetExcelItems = ref(false)
const creatingPHG = ref(false)
const today_day = ref("")
const today_month = ref("")
const today_year = ref("")
const confirmingOrderSell = ref(false)
const cancelingOrderSell = ref(false)
const product_manual_inputs = ref([])
const currentProductManualInput = ref({})
const title_modal_income_expend_list = ref("Danh Sách Thu Tiền")
const incomeItems = ref([])
const loadingIncome = ref(false)

// Modal states
const showChangeInvoiceStatusModal = ref(false)
const showChangeAccountingNoteModal = ref(false)
const showCreateBallotModal = ref(false)
const showConfirmOrderModal = ref(false)
const showCancelOrderModal = ref(false)
const showListIncomeModal = ref(false)

// Helper function to format date to yyyy-MM-dd
function formatDateLocal(date) {
  if (!(date instanceof Date)) return date
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const onScroll = (event) => {
  if (onSearch.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if (hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const prepareDateInput = () => {
  let dateNow = new Date()
  inputs.to_date = dateNow
  let currentDate = dateNow.getDate()
  if (currentDate <= 10) {
    let lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    inputs.from_date = lastMonth
  } else {
    inputs.from_date = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1)
  }
}

const getOptionsRelated = () => {
  loadingOptions.value = true
  orderSellApi.getOptionRelated(userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let optionRelated = res.data.data

      // Staff options
      staffOptions.value = optionRelated.staffs

      // Customer options
      customerOptions.value = optionRelated.customers

      // Year options
      for (let i = 2020; i <= today_year.value + 1; i++) {
        yearOptions.value.push({"value": i, "text": i.toString()})
      }
      year_input.value = today_year.value
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false
  })
}

const prepareToSearch = () => {
  offset.value = 0
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

const handleBallot = (items, is_for_excel) => {
  if (!is_for_excel) {
    for (let item of items) {
      if (item.order_buy_invoice_notes) {
        let invoice_notes = Array.from(new Set(item.order_buy_invoice_notes.split(','))).toString()
        if (invoice_notes) {
          item.repo_status_str = item.repo_status_str + ' | ' + invoice_notes
        }
      }

      let ballots = []
      let have_ballot = false

      if (item.quotation_numbers) {
        let list_quotation = item.quotation_numbers.split(",")
        let item_quotation_checkeds = []
        for (let quotation of list_quotation) {
          let strs = quotation.split("::")
          let quotation_id = strs.length == 2 ? strs[0] : -1
          if (quotation_id && !item_quotation_checkeds.includes(quotation_id)) {
            item_quotation_checkeds.push(quotation_id)
            let quotation_number = strs.length == 2 ? strs[1] : ''
            let quotation_item = "<a href='/quotation-" + scope.value + "/detail/" + quotation_id + "' target='_blank' title='Chi tiết báo giá'>" + quotation_number + "</a>"
            ballots.push(quotation_item)
            have_ballot = true
          }
        }
      }

      if (item.order_buy_numbers) {
        let list_order_buy = item.order_buy_numbers.split(",")
        let item_order_buy_checkeds = []
        for (let order_buy of list_order_buy) {
          let strs = order_buy.split("::")
          let order_buy_id = strs.length == 2 ? strs[0] : -1
          if (order_buy_id && !item_order_buy_checkeds.includes(order_buy_id)) {
            item_order_buy_checkeds.push(order_buy_id)
            let order_buy_number = strs.length == 2 ? strs[1] : ''
            let order_buy_item = "<a href='/order-buy/detail/" + order_buy_id + "' target='_blank' title='Chi tiết đơn hàng nhập'>" + order_buy_number + "</a>"
            ballots.push(order_buy_item)
            have_ballot = true
          }
        }
      }

      if (item.repo_numbers) {
        let list_repo = item.repo_numbers.split(",")
        let item_repo_checkeds = []
        for (let repo of list_repo) {
          let strs = repo.split("::")
          let repo_id = strs.length == 2 ? strs[0] : -1
          if (repo_id && !item_repo_checkeds.includes(repo_id)) {
            item_repo_checkeds.push(repo_id)
            let repo_number = strs.length == 2 ? strs[1] : ''
            let repo_item = "<label title='Xuất/nhập kho'>" + repo_number + "</label>"
            ballots.push(repo_item)
            have_ballot = true
          }
        }
      }

      if (item.fund_numbers) {
        let list_fund = item.fund_numbers.split(",")
        let item_fund_checkeds = []
        for (let fund of list_fund) {
          let strs = fund.split("::")
          let fund_id = strs.length == 2 ? strs[0] : -1
          if (fund_id && !item_fund_checkeds.includes(fund_id)) {
            item_fund_checkeds.push(fund_id)
            let fund_number = strs.length == 2 ? strs[1] : ''
            let fund_item = "<a href='/fund-history-detail/" + fund_id + "' target='_blank' title='Chi tiết phiếu thu-chi'>" + fund_number + "</a>"
            ballots.push(fund_item)
            have_ballot = true
          }
        }
      }

      item.ballots = ballots

      let can_delete = false
      if (item.status == 7) {
        if (ballots.length == 0 || !have_ballot) {
          can_delete = true
        }
      }
      item.can_delete = can_delete
    }
  } else {
    for (let item of items) {
      if (item.order_buy_invoice_notes) {
        let invoice_notes = Array.from(new Set(item.order_buy_invoice_notes.split(','))).toString()
        if (invoice_notes) {
          item.repo_status_str = item.repo_status_str + ' | ' + invoice_notes
        }
      }

      let ballots = ""

      if (item.quotation_numbers) {
        let list_quotation = item.quotation_numbers.split(",")
        let item_quotation_checkeds = []
        for (let quotation of list_quotation) {
          let strs = quotation.split("::")
          let quotation_number = strs.length == 2 ? strs[1] : ''
          if (quotation_number && !item_quotation_checkeds.includes(quotation_number)) {
            item_quotation_checkeds.push(quotation_number)
            ballots += quotation_number + " | "
          }
        }
      }

      if (item.order_buy_numbers) {
        let list_order_buy = item.order_buy_numbers.split(",")
        let item_order_buy_checkeds = []
        for (let order_buy of list_order_buy) {
          let strs = order_buy.split("::")
          let order_buy_number = strs.length == 2 ? strs[1] : ''
          if (order_buy_number && !item_order_buy_checkeds.includes(order_buy_number)) {
            item_order_buy_checkeds.push(order_buy_number)
            ballots += order_buy_number + " | "
          }
        }
      }

      if (item.repo_numbers) {
        let list_repo = item.repo_numbers.split(",")
        let item_repo_checkeds = []
        for (let repo of list_repo) {
          let strs = repo.split("::")
          let repo_number = strs.length == 2 ? strs[1] : ''
          if (repo_number && !item_repo_checkeds.includes(repo_number)) {
            item_repo_checkeds.push(repo_number)
            ballots += repo_number + " | "
          }
        }
      }

      if (item.fund_numbers) {
        let list_fund = item.fund_numbers.split(",")
        let item_fund_checkeds = []
        for (let fund of list_fund) {
          let strs = fund.split("::")
          let fund_number = strs.length == 2 ? strs[1] : ''
          if (fund_number && !item_fund_checkeds.includes(fund_number)) {
            item_fund_checkeds.push(fund_number)
            ballots += fund_number + " | "
          }
        }
      }

      item.ballots = ballots
    }
  }

  return items
}

const search = () => {
  if (onSearch.value) { return }

  onSearch.value = true
  loading.value = true

  let fromDate = formatDateLocal(inputs.from_date)
  let toDate = formatDateLocal(inputs.to_date)

  if (time_option.value == 2) {
    fromDate = year_input.value + '-' + String(month_input.value).padStart(2, '0') + '-01'
    toDate = year_input.value + '-' + String(month_input.value).padStart(2, '0') + '-' + new Date(year_input.value, month_input.value, 0).getDate()
  }
  if (time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(quarter_input.value)
    fromDate = year_input.value + '-' + String(quarter).padStart(2, '0') + '-01'
    toDate = year_input.value + '-' + String(quarter + 2).padStart(2, '0') + '-' + new Date(year_input.value, (quarter + 2), 0).getDate()
  }
  if (time_option.value == 4) {
    fromDate = year_input.value + '-01-01'
    toDate = year_input.value + '-12-' + new Date(year_input.value, 12, 0).getDate()
  }
  if (time_option.value == 5) {
    toDate = new Date().toJSON().slice(0, 10)
    fromDate = '2000-01-01'
  }

  let params = {
    "staff_in_charge": inputs.staff_in_charge ? inputs.staff_in_charge.id : null,
    "status": inputs.status,
    "payment_status": inputs.payment_status,
    "order_sell_number": inputs.order_sell_number,
    "related_number": inputs.related_number,
    "invoice_status": inputs.invoice_status,
    "invoice_note": inputs.invoice_note,
    "customer_id": inputs.customer ? inputs.customer.id : null,
    "from_date": fromDate,
    "to_date": toDate,
    "limit": pageLimit.value,
    "offset": offset.value
  }

  orderSellApi.searchOrderSell(params, userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.order_sells
      totalRow.value = res.data.data.total_row

      it = handleBallot(it, false)

      if (loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if (offset.value + pageLimit.value >= res.data.data.total_row) {
        hasNext.value = false
      }

      if (!isGetExcelItems.value) {
        getExcelItem(params)
      }
    } else {
      items.value = []
      excel_items.value = []
    }
    onSearch.value = false
    loading.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onSearch.value = false
    loading.value = false
  })
}

const getExcelItem = (params) => {
  if (isGetExcelItems.value) {
    return
  }

  excel_items.value = []
  params.limit = 999999

  orderSellApi.searchOrderSell(params, userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let order_sells = res.data.data.order_sells
      order_sells = handleBallot(order_sells, true)
      excel_items.value = order_sells
      isGetExcelItems.value = true
    }
  }).catch(err => {})
}

const exportToExcel = () => {
  const exportData = excel_items.value.map((item, index) => ({
    'STT': item.stt,
    'Số đơn hàng bán': item.order_sell_number,
    'Các phiếu liên quan': item.ballots,
    'Nhân viên phụ trách': item.staff_on_charge_name,
    'Tình trạng của đơn': item.status_str,
    'Tên khách hàng': item.customer_name,
    'Tổng giá trị của đơn đặt hàng (Gồm VAT)': item.total,
    'Xuất VAT': item.issue_invoice ? 'Có' : 'Không',
    'Hình thức thanh toán': item.payment_method,
    'Số tiền còn phải thanh toán': item.total_remaining,
    'Chi phí bán hàng': item.expend_order_sell,
    'Tình trạng kho': item.repo_status_str,
    'Ghi chú kinh doanh': item.shipping_note,
    'Trạng thái giao hàng': item.shipping_status_str,
    'Trạng thái hóa đơn': item.invoice_note,
    'Trạng thái trả hàng': item.product_back_status_str,
    'Ghi chú về kế toán': item.accounting_note
  }))
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách đơn hàng')
  XLSX.writeFile(workbook, 'danh_sach_don_hang.xlsx')
}

const currencyFormat = (num) => {
  let result = ""
  if (num == 0) {
    return "0"
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const deleteOrderSellAfterCancel = (id, name) => {
  if (userRole.value == 'staff') {
    popToast('danger', "Bạn không được quyền thực hiện chức năng này!")
    return
  }
  if (id) {
    if (confirm('Xóa đơn hàng của K.H [' + name + "]. Bạn có chắc không?")) {
      orderSellApi.deleteOrderSellAfterCancel(id, userRole.value).then(res => {
        if (res != null && res.data != null && res.data.status == 200) {
          prepareToSearch()
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const showModalChangeInvoiceStatus = (order_sell) => {
  currentOrderSell.value = order_sell
  statusInvoiceChange.value = order_sell.invoice_status
  invoice_note.value = order_sell.invoice_note
  showChangeInvoiceStatusModal.value = true
}

const hideModalChangeInvoiceStatus = () => {
  showChangeInvoiceStatusModal.value = false
}

const confirmChangeInvoiceStatus = () => {
  if (onChangeStatus.value) { return }

  if (statusInvoiceChange.value == currentOrderSell.value.invoice_status) {
    return
  }

  if (statusInvoiceChange.value == 2 && !invoice_note.value) {
    popToast('danger', "[Ghi chú*] Là mục bắt buộc nhập")
    return
  }

  onChangeStatus.value = true
  let params = {
    "order_sell_id": currentOrderSell.value.id,
    "status_old": currentOrderSell.value.invoice_status,
    "status_new": statusInvoiceChange.value,
    "invoice_note": invoice_note.value
  }

  orderSellApi.updateInvoiceStatus(params, userRole.value).then(res => {
    if (res != null && res.data != null) {
      hideModalChangeInvoiceStatus()

      for (let item of items.value) {
        if (item.id == currentOrderSell.value.id) {
          item.invoice_status = statusInvoiceChange.value
          if (statusInvoiceChange.value == 0) {
            item.invoice_note = "Không xuất HD"
          }
          if (statusInvoiceChange.value == 1) {
            item.invoice_note = "Chưa xuất HD"
          }
          if (statusInvoiceChange.value == 2) {
            item.invoice_note = "Đã xuất HD: " + invoice_note.value
          }
          break
        }
      }
    }
    onChangeStatus.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onChangeStatus.value = false
  })
}

const showModalChangeAccountingNote = (order_sell) => {
  currentOrderSell.value = JSON.parse(JSON.stringify(order_sell))
  showChangeAccountingNoteModal.value = true
}

const hideModalChangeAccountingNote = () => {
  showChangeAccountingNoteModal.value = false
}

const confirmChangeAccountingNote = () => {
  if (onChangeStatus.value) { return }

  onChangeStatus.value = true
  let params = {
    "order_sell_id": currentOrderSell.value.id,
    "accounting_note": currentOrderSell.value.accounting_note
  }

  orderSellApi.updateAccountingNote(params, userRole.value).then(res => {
    if (res != null && res.data != null) {
      hideModalChangeAccountingNote()

      for (let item of items.value) {
        if (item.id == currentOrderSell.value.id) {
          item.accounting_note = currentOrderSell.value.accounting_note
          break
        }
      }
    }
    onChangeStatus.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onChangeStatus.value = false
  })
}

const openModalCreateBallot = (order_sell) => {
  currentOrderSell.value = order_sell
  showCreateBallotModal.value = true
}

const hideModalCreateBallot = () => {
  showCreateBallotModal.value = false
}

const goToCreateBallotInput = () => {
  router.push('/repository/input?order_sell_id=' + currentOrderSell.value.id)
}

const goToCreateBallotOutput = () => {
  router.push('/repository/output?order_sell_id=' + currentOrderSell.value.id)
}

const showModalConfirmOrderSell = (order_sell) => {
  currentOrderSell.value = JSON.parse(JSON.stringify(order_sell))
  confirmingOrderSell.value = true

  orderSellApi.checkProductManualInput(order_sell.id).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      product_manual_inputs.value = res.data.data
      confirmingOrderSell.value = false
      showConfirmOrderModal.value = true
    }
  }).catch(err => {
    confirmingOrderSell.value = false
    showConfirmOrderModal.value = true
  })
}

const hideModalConfirmOrderSell = () => {
  showConfirmOrderModal.value = false
}

const confirmOrderSell = () => {
  if (confirmingOrderSell.value) { return }

  confirmingOrderSell.value = true
  let params = {
    "order_sell_id": currentOrderSell.value.id,
    "status_old": currentOrderSell.value.status,
    "status_new": 1,
    "accounting_note": currentOrderSell.value.accounting_note
  }

  orderSellApi.updateOrderSellStatus(params, userRole.value).then(res => {
    if (res != null && res.data != null) {
      hideModalConfirmOrderSell()
      search()
    }
    confirmingOrderSell.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    confirmingOrderSell.value = false
  })
}

const showModalCancelOrderSell = (order_sell) => {
  currentOrderSell.value = JSON.parse(JSON.stringify(order_sell))
  showCancelOrderModal.value = true
}

const hideModalCancelOrderSell = () => {
  showCancelOrderModal.value = false
}

const cancelOrderSell = () => {
  if (cancelingOrderSell.value) { return }

  if (!currentOrderSell.value.accounting_note) {
    popToast('danger', "[Lý do huỷ*] là mục bắt buộc nhập")
    return
  }

  cancelingOrderSell.value = true
  let params = {
    "order_sell_id": currentOrderSell.value.id,
    "status_old": currentOrderSell.value.status,
    "status_new": 7,
    "accounting_note": currentOrderSell.value.accounting_note
  }

  orderSellApi.updateOrderSellStatus(params, userRole.value).then(res => {
    if (res != null && res.data != null) {
      hideModalCancelOrderSell()
      search()
    }
    cancelingOrderSell.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    cancelingOrderSell.value = false
  })
}

const getListIncome = (id) => {
  loadingIncome.value = true

  orderSellApi.getListIncome(id).then(res => {
    if (res != null && res.data != null) {
      incomeItems.value = res.data.data
    }
    loadingIncome.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loadingIncome.value = false
  })
}

const getListExpend = (id) => {
  loadingIncome.value = true

  orderSellApi.getListExpend(id).then(res => {
    if (res != null && res.data != null) {
      incomeItems.value = res.data.data
    }
    loadingIncome.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loadingIncome.value = false
  })
}

const showModalDetailPayment = (id, type) => {
  if (type == 'expend_order_sell') {
    title_modal_income_expend_list.value = "Danh Sách Chi Tiền"
    getListExpend(id)
  } else {
    title_modal_income_expend_list.value = "Danh Sách Thu Tiền"
    getListIncome(id)
  }

  showListIncomeModal.value = true
}

const hideModalDetailPayment = () => {
  showListIncomeModal.value = false
}

const goToAdd = () => {
  if (userRole.value == "staff") {
    router.push('/order-sell-staff/index')
  } else {
    router.push('/order-sell-all/index')
  }
}

const goToUpdate = (id) => {
  if (userRole.value == "staff") {
    router.push('/order-sell-staff/index/' + id)
  } else {
    router.push('/order-sell-all/index/' + id)
  }
}

onMounted(() => {
  let url = location.href
  if (url.includes("order-sell-staff")) {
    userRole.value = "staff"
    scope.value = "staff"
  } else {
    userRole.value = "admin"
  }

  let dateNow = new Date()
  today_day.value = dateNow.getDate()
  today_month.value = dateNow.getMonth() + 1
  today_year.value = dateNow.getFullYear()

  prepareDateInput()
  window.addEventListener('scroll', onScroll)
  getOptionsRelated()
  prepareToSearch()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
.total {
  color: #ed592a;
}

.bg-danger-cus {
  background-color: #fee2e1;
}

.bg-warning-cus {
  background-color: #FAEBD7;
}

.bg-success-cus {
  background-color: #C1FFC1;
}

.datepicker-cus {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.datepicker-cus:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
}
</style>
