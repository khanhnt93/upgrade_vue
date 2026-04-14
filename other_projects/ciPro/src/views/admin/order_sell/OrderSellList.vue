<template>
  <div class="w-full mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- Header Actions -->
        <div class="flex justify-end mb-4">
          <button
            @click="goToAdd"
            class="btn btn-success w-32"
          >
            Thêm
          </button>
        </div>

        <!-- Title -->
        <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Danh Sách Đơn Hàng Bán</h4>
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
            class="btn btn-primary w-32 disabled:opacity-50"
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
              class="btn btn-success"
            >
              <i class="fa fa-file-excel-o"></i> Xuất Excel
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
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
                  <button v-if="userRole == 'admin'" @click="showModalChangeInvoiceStatus(item)" class="btn btn-sm btn-primary">Sửa</button>
                  {{item.invoice_note}}
                </td>
                <td class="px-2 py-2 border">{{item.product_back_status_str}}</td>
                <td class="px-2 py-2 border">
                  <button v-if="userRole == 'admin'" @click="showModalChangeAccountingNote(item)" class="btn btn-sm btn-primary">Sửa</button>
                  {{item.accounting_note}}
                </td>
                <td class="px-2 py-2 border">
                  <div class="flex flex-col gap-1">
                    <button v-if="item.status == 0 && userRole == 'admin'"
                            @click="showModalConfirmOrderSell(item)"
                            :disabled="confirmingOrderSell"
                            class="btn btn-sm btn-success text-xs disabled:opacity-50"
                            title="Xác nhận đơn hàng">
                      Xác nhận đơn
                    </button>
                    <button v-if="item.status > -1 && item.status < 4 && userRole == 'admin'"
                            @click="showModalCancelOrderSell(item)"
                            class="btn btn-sm btn-danger text-xs"
                            title="Huỷ đơn hàng">
                      Huỷ
                    </button>
                    <button v-if="(userRole == 'staff' && item.status == -1) || (userRole == 'admin' && item.status < 3)"
                            @click="goToUpdate(item.id)"
                            class="btn btn-sm btn-primary text-xs">
                      Sửa
                    </button>
                    <button v-if="item.status == -1 && userRole == 'admin'"
                            @click="deleteOrderSell(item.id, item.customer_name)"
                            class="btn btn-sm btn-danger text-xs">
                      Xóa
                    </button>
                    <button v-if="userRole == 'admin' && item.can_delete"
                            @click="deleteOrderSellAfterCancel(item.id, item.customer_name)"
                            class="btn btn-sm btn-danger text-xs">
                      Xoá (ĐHH)
                    </button>
                    <button v-if="item.status > 0"
                            @click="openModalCreateBallot(item)"
                            class="btn btn-sm btn-primary text-xs">
                      Tạo phiếu
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
          <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Cập Nhật Trạng Thái Hoá Đơn</h4>
          <hr class="mb-4">

          <div class="mb-3 space-y-1">
            <p class="text-sm">Số đơn hàng: <span class="font-semibold">{{currentOrderSell.order_sell_number}}</span></p>
            <p class="text-sm">Tên khách hàng: <span class="font-semibold">{{currentOrderSell.customer_name}}</span></p>
            <p class="text-sm">Trạng thái hiện tại: <span class="font-semibold">{{currentOrderSell.invoice_note}}</span></p>
          </div>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Cập nhật thành<span class="text-red-500">*</span></label>
            <select v-model="statusInvoiceChange" class="w-full px-3 py-2 border border-gray-300 rounded">
              <option v-for="opt in statusInvoiceOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
            </select>
          </div>

          <div v-show="statusInvoiceChange == 2" class="mb-4">
            <label class="block text-sm font-medium mb-1">Ghi chú<span class="text-red-500">*</span></label>
            <textarea
              v-model="invoice_note"
              rows="3"
              maxlength="50"
              placeholder="Số: 00000001 Ngày: 01/01/2000"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="hideModalChangeInvoiceStatus"
                    class="btn btn-danger">
              Đóng
            </button>
            <button @click="confirmChangeInvoiceStatus"
                    class="btn btn-success">
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
          <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Cập Nhật Ghi Chú Kế Toán</h4>
          <hr class="mb-4">

          <div class="mb-3 space-y-1">
            <p class="text-sm">Số đơn hàng: <span class="font-semibold">{{currentOrderSell.order_sell_number}}</span></p>
            <p class="text-sm">Tên khách hàng: <span class="font-semibold">{{currentOrderSell.customer_name}}</span></p>
          </div>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Ghi chú kế toán</label>
            <textarea
              v-model="currentOrderSell.accounting_note"
              rows="3"
              maxlength="500"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="hideModalChangeAccountingNote"
                    class="btn btn-danger">
              Đóng
            </button>
            <button @click="confirmChangeAccountingNote"
                    class="btn btn-success">
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
          <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Tạo Phiếu Nhập Kho - Xuất Hàng</h4>
          <hr class="mb-4">

          <div class="mb-4">
            <p class="text-sm">Số đơn hàng: <span class="font-semibold">{{currentOrderSell.order_sell_number}}</span></p>
            <p class="text-sm">Tên khách hàng: <span class="font-semibold">{{currentOrderSell.customer_name}}</span></p>
          </div>
          <hr class="mb-4">

          <div v-if="userRole == 'admin'" class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <button v-if="currentOrderSell.status > 0 && currentOrderSell.status < 6"
                    @click="goToOrderBuy(currentOrderSell.id)"
                    class="btn btn-primary">
              Đơn hàng nhập
            </button>
            <button v-if="currentOrderSell.status > 0 && currentOrderSell.status < 6"
                    @click="goToRepoOutput(currentOrderSell.id)"
                    class="btn btn-primary">
              Phiếu xuất kho
            </button>
            <button v-if="currentOrderSell.status > 0 && currentOrderSell.status < 6 && currentOrderSell.type == 1"
                    @click="goToRepoOutputResource(currentOrderSell.id)"
                    class="btn btn-primary">
              Phiếu xuất kho nguyên liệu
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            <button v-if="currentOrderSell.status > 0 && currentOrderSell.status < 7"
                    @click="preparePrintPHG()"
                    :disabled="creatingPHG"
                    class="btn btn-primary disabled:opacity-50">
              <i class="fa fa-spinner fa-spin" v-if="creatingPHG"></i>
              Phiếu giao hàng
            </button>
            <button v-if="currentOrderSell.status > 0 && currentOrderSell.status < 6 && userRole == 'admin'"
                    @click="goToIncome(currentOrderSell.id)"
                    class="btn btn-primary">
              Phiếu Thu
            </button>
            <button v-if="currentOrderSell.status > 0 && currentOrderSell.status < 7 && userRole == 'admin'"
                    @click="goToOrderSellBack(currentOrderSell.id)"
                    class="btn btn-primary">
              Phiếu trả hàng bán
            </button>
            <button v-if="currentOrderSell.status > 0 && userRole == 'admin'"
                    @click="goToExpendBack(currentOrderSell.id)"
                    class="btn btn-primary">
              Phiếu chi trả lại tiền
            </button>
            <button v-if="currentOrderSell.status > 0 && userRole == 'admin'"
                    @click="goToExpendOrderSell(currentOrderSell.id)"
                    class="btn btn-primary">
              Phiếu chi các phí của đơn hàng
            </button>
          </div>

          <div class="mt-4 flex justify-end">
            <button @click="hideModalCreateBallot"
                    class="btn btn-danger">
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
          <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Xác Nhận Đơn Hàng</h4>
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

            <!-- Product assignment form for current manual product -->
            <div v-if="currentProductManualInput.id" class="border border-orange-300 rounded p-4 mb-4 bg-orange-50">
              <p class="text-center text-red-600 font-semibold mb-3">
                Có [{{product_manual_inputs.length}}] Sản phẩm chưa được khai báo trong hệ thống
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label class="block text-sm font-medium mb-1">Nhóm sản phẩm<span class="text-red-500">*</span></label>
                  <Multiselect v-model="productGroupSelect" :options="productGroupOptions"
                    :select-label="''" :deselect-label="''" placeholder="--Chọn nhóm sản phẩm--"
                    label="name" track-by="name" @select="changeProductGroup" @remove="changeProductGroup">
                  </Multiselect>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Loại sản phẩm<span class="text-red-500">*</span></label>
                  <Multiselect v-model="productTypeSelect" :options="productTypeOptions"
                    :select-label="''" :deselect-label="''" placeholder="--Chọn loại sản phẩm--"
                    label="name" track-by="name" @select="changeProductType" @remove="changeProductType">
                  </Multiselect>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Sản phẩm</label>
                  <Multiselect v-model="productSelect" :options="productOptions"
                    :select-label="''" :deselect-label="''" placeholder="-- Chọn sản phẩm --"
                    label="name_full" track-by="name_full" @select="changeProduct" @remove="changeProduct">
                  </Multiselect>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Mã sản phẩm</label>
                  <input v-model="currentProductManualInput.product_code" type="text" maxlength="255"
                    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <p class="text-xs text-gray-500 mt-1">{{currentProductManualInput.product_code_input}} (Mã SP đã nhập khi báo giá)</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Tên sản phẩm<span class="text-red-500">*</span></label>
                  <input v-model="currentProductManualInput.product_name" type="text" maxlength="255"
                    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <p class="text-xs text-gray-500 mt-1">{{currentProductManualInput.product_name_input}} (Tên SP đã nhập khi báo giá)</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Hãng sản phẩm</label>
                  <select v-model="currentProductManualInput.brand_id" @change="changeBrandInput"
                    class="w-full px-3 py-2 border border-gray-300 rounded">
                    <option v-for="opt in productBrandOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">{{currentProductManualInput.brand_name_input}} (Hãng SP đã nhập khi báo giá)</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Đơn vị<span class="text-red-500">*</span></label>
                  <select v-model="currentProductManualInput.unit_id" @change="changeUnitInput"
                    class="w-full px-3 py-2 border border-gray-300 rounded">
                    <option v-for="opt in unitOptions" :key="opt.value" :value="opt.value">{{opt.text}}</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">{{currentProductManualInput.unit_name_input}} (Đơn vị đã nhập khi báo giá)</p>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Giá list</label>
                  <input v-model="currentProductManualInput.price_list" type="text" maxlength="14"
                    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Chiết khấu</label>
                  <input v-model="currentProductManualInput.discount" type="text" maxlength="14"
                    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Giá bán</label>
                  <input v-model="currentProductManualInput.price_sell" type="text" maxlength="14"
                    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
              <div class="text-center">
                <button @click="insertProduct" :disabled="insertingProduct"
                        class="btn btn-primary disabled:opacity-50">
                  Thêm sản phẩm
                </button>
              </div>
            </div>
            <hr class="mb-3">

            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse border border-gray-300">
                <thead class="bg-gray-100">
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
                    class="btn btn-danger">
              Đóng
            </button>
            <button @click="confirmOrderSell"
                    :disabled="confirmingOrderSell || product_manual_inputs.length > 0"
                    class="btn btn-success disabled:opacity-50">
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
          <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">Huỷ Đơn Hàng</h4>
          <hr class="mb-4">

          <div class="mb-3 space-y-1">
            <p class="text-sm">Số đơn hàng: <span class="font-semibold">{{currentOrderSell.order_sell_number}}</span></p>
            <p class="text-sm">Tên khách hàng: <span class="font-semibold">{{currentOrderSell.customer_name}}</span></p>
          </div>
          <hr class="mb-4">

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Lý do huỷ<span class="text-red-500">*</span></label>
            <textarea v-if="currentOrderSell.shipping_status == 0"
              v-model="currentOrderSell.accounting_note"
              rows="3"
              maxlength="500"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </textarea>
            <p v-if="currentOrderSell.shipping_status != 0" class="text-red-600 font-semibold">
              Chỉ có thể hủy khi đơn hàng chưa giao!
            </p>
          </div>

          <div class="flex justify-end gap-2">
            <button @click="hideModalCancelOrderSell"
                    class="btn btn-danger">
              Đóng
            </button>
            <button v-if="currentOrderSell.shipping_status == 0"
                    @click="cancelOrderSell"
                    :disabled="cancelingOrderSell"
                    class="btn btn-success disabled:opacity-50">
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
          <h4 class="text-xl font-semibold text-center text-orange-600 mb-4">{{title_modal_income_expend_list}}</h4>
          <hr class="mb-4">

          <div v-if="loadingIncome" class="text-center py-4">
            <i class="fa fa-spinner fa-spin text-2xl"></i>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead class="bg-gray-100">
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
                    class="btn btn-danger">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Hidden print section for PHG -->
  <div hidden id="contentPrintPHG">
    <div style="width:100%; height:35px;" class="tr-bg">
      <div style="color: #006699; font-size: 20px; float: left; width: 70%; text-align: center; margin-top: 10px;">
        <b>PHIẾU GIAO HÀNG</b>
      </div>
      <div style="float: right; font-size: 13px; width: 30%; margin-top: 10px; text-align: center">
        <i>TP.HCM, Ngày {{today_day}} tháng {{today_month}} năm {{today_year}}</i>
      </div>
    </div>
    <div style="width:100%; font-size: 18px; text-align: right; margin-top: 5px; margin-bottom: 5px;">
      <div style="color: #006699; font-size: 18px; float: left; width: 70%; text-align: center;"></div>
      <div style="float: right; width: 30%; margin-top: 5px; margin-bottom: 5px; text-align: center">
        <span>Số: {{currentOrderSell.order_sell_number}}</span>
      </div>
    </div>
    <div class="custom-line-height">
      <table style="width:100%; font-size: 16px">
        <tbody>
          <tr>
            <td style="width:25%; border:none; padding-left:10px; text-align:right;"><u><b>Tên khách hàng:</b></u></td>
            <td colspan="3" style="border:none; text-align:left;"><b>{{currentOrderSell.customer_name}}</b></td>
          </tr>
          <tr>
            <td style="width:25%; border:none; padding-left:10px; text-align:right;">Địa chỉ giao hàng:</td>
            <td colspan="3" style="border:none; text-align:left;">{{currentOrderSell.receiver_address}}</td>
          </tr>
          <tr>
            <td style="width:25%; border:none; padding-left:10px; text-align:right;">Người nhận hàng:</td>
            <td style="width:25%; border:none; text-align:left;">{{currentOrderSell.receiver_name}}</td>
            <td style="width:25%; border:none; padding-left:10px; text-align:right;">Điện thoại:</td>
            <td style="border:none; text-align:left;">{{currentOrderSell.receiver_phone}}</td>
          </tr>
          <tr>
            <td style="width:25%; border:none; padding-left:10px; text-align:right;">Ghi chú về giao hàng:</td>
            <td colspan="3" style="border:none; text-align:left;">{{currentOrderSell.shipping_note}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br>
    <div class="print-table-border">
      <table style="width:100%; font-size: 16px" class="custom-line-height">
        <thead>
          <tr style="background-color: #eeece1; text-align: center;">
            <th>STT</th><th>MÃ SẢN PHẨM</th><th>MÔ TẢ SẢN PHẨM</th>
            <th>HÃNG SX</th><th>ĐVT</th><th style="width:50px">SL</th><th>GHI CHÚ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(prod, index) in currentOrderSell.products" :key="prod.product_id">
            <td style="text-align:center;">{{index + 1}}</td>
            <td>{{prod.product_code ? prod.product_code : prod.product_code_input}}</td>
            <td>{{prod.product_name ? prod.product_name : prod.product_name_input}}</td>
            <td style="text-align:center;">{{prod.brand_name ? prod.brand_name : prod.brand_name_input}}</td>
            <td style="text-align:center;">{{prod.target_unit_name ? prod.target_unit_name : prod.unit_name ? prod.unit_name : prod.unit_name_input}}</td>
            <td style="width:50px; text-align:center;">{{currencyFormat(prod.quantity)}}</td>
            <td>{{prod.note}}</td>
          </tr>
          <tr>
            <td colspan="5" style="text-align:center;"><b>TỔNG CỘNG</b></td>
            <td style="text-align:right;"><b>{{currentOrderSell.total_quantity}}</b></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div>
        <p style="font-size:16px;"><b>Chứng từ kèm theo:</b></p>
        <p style="font-size:16px; padding-left:10px;">{{currentOrderSell.issue_invoice ? '⊃ Hóa đơn GTGT' : ''}}</p>
      </div>
      <div>
        <p style="font-size:16px;"><b>Liên hệ với Nhân viên kinh doanh khi cần:</b></p>
        <p style="font-size:16px; padding-left:10px;">⊃ Tên: {{currentOrderSell.staff_in_charge_name}}</p>
        <p style="font-size:16px; padding-left:10px;">⊃ Điện thoại: {{currentOrderSell.staff_in_charge_phone}}</p>
        <p style="font-size:16px; padding-left:10px;">⊃ Email: {{currentOrderSell.staff_in_charge_email}}</p>
      </div>
      <br><br>
      <table style="width:100%; font-size:16px;">
        <tbody>
          <tr>
            <td style="border:none; text-align:center;"><b>NGƯỜI NHẬN HÀNG</b></td>
            <td style="border:none; text-align:center;"><b>NGƯỜI GIAO HÀNG</b></td>
            <td style="border:none; text-align:center;"><b>NGƯỜI LẬP PHIẾU</b></td>
          </tr>
          <tr>
            <td style="border:none; text-align:center; color:#C0C0C0;">(Ký, họ tên)</td>
            <td style="border:none; text-align:center; color:#C0C0C0;">(Ký, họ tên)</td>
            <td style="border:none; text-align:center; color:#C0C0C0;">(Ký, họ tên)</td>
          </tr>
        </tbody>
      </table>
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
import { useConfirm } from '@/composables/useConfirm'
import * as XLSX from 'xlsx'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { popToast } = useToast()
const { confirmDialog } = useConfirm()

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

// Product management for confirm modal
const productGroupSelect = ref({})
const productTypeSelect = ref({})
const productSelect = ref({})
const productGroupOptions = ref([])
const productTypeOptions = ref([])
const productTypeOptionStore = ref([])
const productOptionStore = ref([])
const productOptions = ref([])
const unitOptions = ref([])
const productBrandOptions = ref([])
const insertingProduct = ref(false)

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
  let params = {}
  if (userRole.value == 'staff') {
    params.customer_by_staff = true
  } else {
    params.customer_by_admin = true
    params.staffs = true
  }

  orderSellApi.getOptionForOrderSellList(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      customerOptions.value = res.data.data.customers
      customerOptions.value.unshift({"id": null, "name": '-- Tất cả --'})

      staffOptions.value = res.data.data.staffs ?? []
      staffOptions.value.unshift({"id": null, "name": '-- Tất cả --'})
    }
    loadingOptions.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
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

const deleteOrderSellAfterCancel = async (id, name) => {
  if (userRole.value == 'staff') {
    popToast('danger', "Bạn không được quyền thực hiện chức năng này!")
    return
  }
  if (id) {
    if (await confirmDialog('Xóa đơn hàng của K.H [' + name + "]. Bạn có chắc không?")) {
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

const goToOrderBuy = (id) => {
  hideModalCreateBallot()
  window.open('/order-buy-from-order-sell/' + id, '_blank')
}

const goToRepoOutput = (id) => {
  hideModalCreateBallot()
  window.open('/repository-from-order-sell/' + id, '_blank')
}

const goToRepoOutputResource = (id) => {
  hideModalCreateBallot()
  window.open('/repository-from-order-sell/' + id + '?code=only_resource', '_blank')
}

const goToIncome = (id) => {
  hideModalCreateBallot()
  window.open('/income-from-order-sell/' + id, '_blank')
}

const goToOrderSellBack = (id) => {
  hideModalCreateBallot()
  window.open('/order-sell-back/' + id, '_blank')
}

const goToExpendBack = (id) => {
  hideModalCreateBallot()
  window.open('/expend-from-money-back/' + id, '_blank')
}

const goToExpendOrderSell = (id) => {
  hideModalCreateBallot()
  window.open('/expend-from-order-sell/' + id, '_blank')
}

const getOrderSellDetail = async (id) => {
  await orderSellApi.getOrderSellDetail(id, userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      currentOrderSell.value = res.data.data
    } else {
      currentOrderSell.value = {}
    }
  }).catch(err => {
    currentOrderSell.value = {}
  })
}

const preparePrintPHG = async () => {
  if (currentOrderSell.value && currentOrderSell.value.id) {
    hideModalCreateBallot()
    creatingPHG.value = true
    await getOrderSellDetail(currentOrderSell.value.id)
    creatingPHG.value = false
    printPHG()
  }
}

const printPHG = () => {
  const mywindow = window.open('', 'PRINT', 'height=900,width=1200')
  mywindow.document.write('<html><head><title> </title><style>')
  mywindow.document.write(' body {font-size: 14px;} ')
  mywindow.document.write(' .print-text-center {text-align: center;} ')
  mywindow.document.write(' .print-text-left {text-align: left;} ')
  mywindow.document.write(' .print-text-right {text-align: right;} ')
  mywindow.document.write(' .print-pl-2 {padding-left: 10px;} ')
  mywindow.document.write(' .print-table-border > table, th, td {border: gray solid 0.1px; border-collapse: collapse;} ')
  mywindow.document.write(' .print-no-border {border: none;} ')
  mywindow.document.write(' .tr-bg {background-color: #eeece1 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact;} ')
  mywindow.document.write(' .custom-line-height tr { line-height: 25px; } ')
  mywindow.document.write('</style></head><body>')
  mywindow.document.write(document.getElementById('contentPrintPHG').innerHTML)
  mywindow.document.write('</body></html>')
  mywindow.document.close()
  mywindow.focus()
  setTimeout(() => {
    mywindow.print()
    mywindow.close()
  }, 1000)
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

const deleteOrderSell = async (id, name) => {
  if (userRole.value == 'staff') {
    popToast('danger', "Bạn không được quyền thực hiện chức năng này!")
    return
  }
  if (id) {
    if (await confirmDialog('Xóa đơn hàng của K.H [' + name + "]. Bạn có chắc không?")) {
      orderSellApi.deleteOrderSell(id, userRole.value).then(res => {
        if (res != null && res.data != null) {
          prepareToSearch()
        }
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        popToast('danger', errorMess)
      })
    }
  }
}

const getOptionRelatedProduct = () => {
  orderSellApi.getOptionRelatedProduct().then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      const options = res.data.data

      productGroupOptions.value = options.product_groups || []
      productGroupOptions.value.unshift({ id: null, name: '-- Chọn nhóm SP --' })

      productTypeOptionStore.value = JSON.parse(JSON.stringify(options.product_types || []))
      productTypeOptions.value = JSON.parse(JSON.stringify(options.product_types || []))
      productTypeOptions.value.unshift({ id: null, name: '-- Chọn loại SP --', product_group_id: null })

      productOptionStore.value = JSON.parse(JSON.stringify(options.products || []))
      productOptions.value = JSON.parse(JSON.stringify(options.products || []))
      productOptions.value.unshift({ id: null, name: '', name_full: '-- Chọn SP --' })

      unitOptions.value = [{ value: null, text: '-- Đơn vị --' }]
      for (let unit of (options.units || [])) {
        unitOptions.value.push({ value: unit.id, text: unit.name })
      }

      productBrandOptions.value = [{ value: null, text: '-- Hãng sản phẩm --' }]
      for (let brand of (options.brands || [])) {
        productBrandOptions.value.push({ value: brand.id, text: brand.name })
      }
    }
  }).catch(err => {})
}

const resetListProduct = () => {
  productOptions.value = JSON.parse(JSON.stringify(productOptionStore.value))
  if (productOptions.value.length > 0) {
    productOptions.value.unshift({ id: null, name: '', name_full: '-- Chọn sản phẩm --' })
  }
  productSelect.value = productOptions.value[0] || {}
}

const resetListProductType = () => {
  productTypeOptions.value = JSON.parse(JSON.stringify(productTypeOptionStore.value))
  if (productTypeOptions.value.length > 0) {
    productTypeOptions.value.unshift({ id: null, name: '-- Chọn loại SP --', product_group_id: null })
  }
  productTypeSelect.value = productTypeOptions.value[0] || {}
  resetListProduct()
}

const getProductGroupSelectById = (id) => {
  for (let pg of productGroupOptions.value) {
    if (pg.id == id) { productGroupSelect.value = pg; return }
  }
}

const getProductTypeSelectById = (id) => {
  for (let pt of productTypeOptionStore.value) {
    if (pt.id == id) { productTypeSelect.value = pt; return }
  }
}

const changeProductGroup = () => {
  if (productGroupSelect.value && productGroupSelect.value.id) {
    currentProductManualInput.value.product_group_id = productGroupSelect.value.id
    currentProductManualInput.value.product_group_name = productGroupSelect.value.name

    productTypeOptions.value = productTypeOptionStore.value.filter(
      pt => pt.product_group_id == productGroupSelect.value.id
    )
    if (productTypeOptions.value.length > 0) {
      const empty = { ...productTypeOptions.value[0], id: null, name: '' }
      productTypeOptions.value.unshift(empty)
    }
  } else {
    currentProductManualInput.value.product_group_id = null
    currentProductManualInput.value.product_group_name = null
    resetListProductType()
  }

  productTypeSelect.value = {}
  currentProductManualInput.value.product_type_id = null
  currentProductManualInput.value.product_type_name = null
  productSelect.value = {}
  currentProductManualInput.value.product_id = null
  currentProductManualInput.value.product_code = currentProductManualInput.value.product_code_input
  currentProductManualInput.value.product_name = currentProductManualInput.value.product_name_input
  currentProductManualInput.value.price_list = null
  currentProductManualInput.value.discount = null
  currentProductManualInput.value.price_sell = null
}

const changeProductType = () => {
  if (productTypeSelect.value && productTypeSelect.value.id) {
    currentProductManualInput.value.product_type_id = productTypeSelect.value.id
    if (productTypeSelect.value.product_group_id != productGroupSelect.value.id) {
      getProductGroupSelectById(productTypeSelect.value.product_group_id)
    }

    productOptions.value = productOptionStore.value.filter(
      p => p.product_type_id == productTypeSelect.value.id
    )
    if (productOptions.value.length > 0) {
      const empty = { ...productOptions.value[0], id: null, name: '', code: '', name_full: '-- Chọn sản phẩm --' }
      productOptions.value.unshift(empty)
    }
  } else {
    currentProductManualInput.value.product_type_id = null
    resetListProduct()
  }

  productSelect.value = {}
  currentProductManualInput.value.product_id = null
  currentProductManualInput.value.product_code = currentProductManualInput.value.product_code_input
  currentProductManualInput.value.product_name = currentProductManualInput.value.product_name_input
  currentProductManualInput.value.price_list = null
  currentProductManualInput.value.discount = null
  currentProductManualInput.value.price_sell = null
}

const changeProduct = () => {
  currentProductManualInput.value.price_list = null
  currentProductManualInput.value.discount = null

  if (productSelect.value && productSelect.value.id) {
    currentProductManualInput.value.product_id = productSelect.value.id
    currentProductManualInput.value.product_name = productSelect.value.name
    currentProductManualInput.value.product_code = productSelect.value.code
    currentProductManualInput.value.price_list = currencyFormat(productSelect.value.price_list)
    currentProductManualInput.value.discount = productSelect.value.discount
    currentProductManualInput.value.price_sell = currencyFormat(productSelect.value.price_sell)
    currentProductManualInput.value.brand_name = productSelect.value.brand_name
    currentProductManualInput.value.unit_name = productSelect.value.unit_name

    if (productSelect.value.product_group_id != productGroupSelect.value.id) {
      getProductGroupSelectById(productSelect.value.product_group_id)
    }
    if (productSelect.value.product_type_id != productTypeSelect.value.id) {
      getProductTypeSelectById(productSelect.value.product_type_id)
    }
  }
}

const changeBrandInput = () => {
  if (currentProductManualInput.value.brand_id) {
    for (let brand of productBrandOptions.value) {
      if (brand.value == currentProductManualInput.value.brand_id) {
        currentProductManualInput.value.brand_name = brand.text
        return
      }
    }
  } else {
    currentProductManualInput.value.brand_name = null
  }
}

const changeUnitInput = () => {
  if (currentProductManualInput.value.unit_id) {
    for (let unit of unitOptions.value) {
      if (unit.value == currentProductManualInput.value.unit_id) {
        currentProductManualInput.value.unit_name = unit.text
        return
      }
    }
  } else {
    currentProductManualInput.value.unit_name = null
  }
}

const insertProduct = () => {
  if (insertingProduct.value) { return }

  if (!productGroupSelect.value.id) {
    popToast('danger', "Vui lòng chọn [Nhóm sản phẩm]")
    return
  }
  if (!productTypeSelect.value.id) {
    popToast('danger', "Vui lòng chọn [Loại sản phẩm]")
    return
  }
  if (!currentProductManualInput.value.product_name) {
    popToast('danger', "Vui lòng nhập [Tên sản phẩm]")
    return
  }
  if (!currentProductManualInput.value.unit_id) {
    popToast('danger', "Vui lòng chọn [Đơn vị]")
    return
  }

  insertingProduct.value = true
  const params = {
    id: currentProductManualInput.value.id,
    product_group_id: productGroupSelect.value.id,
    product_group_name: productGroupSelect.value.name,
    product_type_id: productTypeSelect.value.id,
    product_type_name: productTypeSelect.value.name,
    product_id: productSelect.value && productSelect.value.id ? productSelect.value.id : null,
    product_code: currentProductManualInput.value.product_code,
    product_name: currentProductManualInput.value.product_name,
    brand_id: currentProductManualInput.value.brand_id,
    brand_name: currentProductManualInput.value.brand_name,
    unit_id: currentProductManualInput.value.unit_id,
    unit_name: currentProductManualInput.value.unit_name,
    price_list: currentProductManualInput.value.price_list,
    discount: currentProductManualInput.value.discount,
    price_sell: currentProductManualInput.value.price_sell
  }

  orderSellApi.insertProductFromOrderSell(params).then(res => {
    if (res != null && res.data != null) {
      product_manual_inputs.value.splice(0, 1)
      if (product_manual_inputs.value.length > 0) {
        currentProductManualInput.value = product_manual_inputs.value[0]
      } else {
        currentProductManualInput.value = {}
      }
      productGroupSelect.value = {}
      changeProductGroup()
      popToast('success', "Thêm sản phẩm thành công!")
    }
    insertingProduct.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    insertingProduct.value = false
  })
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
  getOptionRelatedProduct()
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

:deep(.multiselect__placeholder) {
  margin-bottom: 0;
  padding-top: 0;
  line-height: inherit;
}

:deep(.multiselect__single),
:deep(.multiselect__input) {
  margin-bottom: 0;
  padding-top: 0;
  line-height: inherit;
}
</style>
