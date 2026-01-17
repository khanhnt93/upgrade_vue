<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- Settings Button Row -->
      <div class="flex justify-end mb-4">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32"
          @click="showModalSettingQuotation()">
          Cài đặt
        </button>
      </div>

      <!-- Title -->
      <div class="mb-4">
        <h4 class="text-center text-2xl font-bold text-gray-800">Danh Sách Chăm Sóc Khách Hàng</h4>
      </div>
      <hr class="my-4">

      <!-- Search Filters -->
      <div class="grid grid-cols-12 gap-4 mb-4">
        <div class="col-span-12 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
          <select
            v-model="time_option"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in timeOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="col-span-12 md:col-span-2">
          <label v-show="time_option != 5" class="block text-sm font-medium text-gray-700 mb-1">
            {{ time_option == 1 ? 'Từ ngày' : 'Năm' }}
          </label>
          <!-- Date picker for date option -->
          <Datepicker
            v-show="time_option == 1"
            v-model="inputs.from_date"
            :format="'yyyy-MM-dd'"
            placeholder="yyyy-MM-dd"
            input-class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <!-- Year select -->
          <select
            v-show="time_option != 1 && time_option != 5"
            v-model="year_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in yearOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="col-span-12 md:col-span-2">
          <label v-show="time_option == 1 || time_option == 2 || time_option == 3" class="block text-sm font-medium text-gray-700 mb-1">
            {{ time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
          </label>
          <!-- To date picker -->
          <Datepicker
            v-show="time_option == 1"
            v-model="inputs.to_date"
            :format="'yyyy-MM-dd'"
            placeholder="yyyy-MM-dd"
            input-class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <!-- Month select -->
          <select
            v-show="time_option == 2"
            v-model="month_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in monthOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
          <!-- Quarter select -->
          <select
            v-show="time_option == 3"
            v-model="quarter_input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Hãng sản phẩm</label>
          <Multiselect
            v-model="inputs.brand"
            :options="brandOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Tất cả--"
            label="name"
            track-by="name" />
        </div>

        <div class="col-span-12 md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Hạn báo giá</label>
          <select
            v-model="inputs.expire_status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in expireStatusOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <!-- Second row of filters -->
      <div class="grid grid-cols-12 gap-4 mb-4">
        <div v-if="userRole == 'admin'" class="col-span-12 md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">NV phụ trách</label>
          <select
            v-model="inputs.staff_in_charge"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in optionsStaff" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div :class="userRole == 'admin' ? 'col-span-12 md:col-span-3' : 'col-span-12 md:col-span-4'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái BG</label>
          <select
            v-model="inputs.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div :class="userRole == 'admin' ? 'col-span-12 md:col-span-3' : 'col-span-12 md:col-span-4'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tình trạng chăm sóc</label>
          <select
            v-model="inputs.care_status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in careStatusOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div :class="userRole == 'admin' ? 'col-span-12 md:col-span-3' : 'col-span-12 md:col-span-4'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tình trạng khách</label>
          <select
            v-model="inputs.customer_status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="option in customerStatusOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-end mt-4">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32"
          :disabled="onSearch"
          @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <!-- Results and Export -->
      <div class="flex justify-between items-center mt-4 mb-2">
        <div>
          Số kết quả: {{ totalRow }}
        </div>
        <div v-if="userRole == 'admin' && excel_items.length > 0">
          <button
            @click="exportToExcel"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            <b>Xuất Excel</b>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:3%">STT</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:7%">Số BG</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:6%">Ngày BG</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:6%">NV phụ trách</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:11%">Tên K.H</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:6%">Tình trạng K.H</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:6%">Loại Cty</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:6%">Tổng tiền SP</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:7%">Người liên hệ</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:7%">SĐT liên hệ</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:7%">Trạng thái BG</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:10%">KQ chăm sóc lần 1</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:10%">KQ chăm sóc lần 2</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" style="width:8%">Nhóm sản phẩm</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item) in items" :key="item.id" :class="item.row_class">
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border">{{ item.stt }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border">
                <a :href="'/quotation-' + scope + '/detail/' + item.quotation_id" target="_blank" title="Chi tiết báo giá" class="text-blue-600 hover:text-blue-900 underline">
                  {{ item.quotation_number }}
                </a>
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border">{{ item.created_at }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border">{{ item.staff_in_charge_name }}</td>
              <td class="px-3 py-2 text-sm text-gray-900 border" style="width: 100px !important;">{{ item.customer_name }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border">{{ item.customer_status_str }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border">{{ item.customer_company_type_name }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right border">{{ currencyFormat(item.sub_total) }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border">{{ item.contact_person_name }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border">{{ item.contact_person_phone }}</td>
              <td class="px-3 py-2 text-sm text-gray-900 border" :class="item.item_class">
                {{ item.status_str }}
                <i v-if="item.status == 0" class="fa fa-edit cursor-pointer ml-1 text-blue-600" @click="showModalUpdateQuotationStatus(item)"
                   title="Cập nhật trạng thái BG"></i>
                <br v-if="item.status == 2">
                <span v-if="item.status == 2">{{ item.updated_reason_falling_note_at + ': ' + item.reason_falling_note }}</span>
              </td>
              <td class="px-3 py-2 text-sm text-gray-900 border">
                <i class="fa fa-edit cursor-pointer text-blue-600" @click="showModalUpdateNote(item, 1)" title="Cập nhật kết quả chăm sóc báo giá lần 1"></i>
                {{ item.note_1st ? item.updated_note_1st_at + ': ' + item.note_1st : item.note_1st }}
              </td>
              <td class="px-3 py-2 text-sm text-gray-900 border">
                <i class="fa fa-edit cursor-pointer text-blue-600" @click="showModalUpdateNote(item, 2)" title="Cập nhật kết quả chăm sóc báo giá lần 2"></i>
                {{ item.note_2st ? item.updated_note_2st_at + ': ' + item.note_2st : item.note_2st }}
              </td>
              <td class="px-3 py-2 text-sm text-gray-900 border">
                <i class="fa fa-edit cursor-pointer text-blue-600" @click="showModalUpdateProductGroupNote(item)" title="Cập nhật ghi chú nhóm SP"></i>
                {{ item.product_group_note }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading indicators -->
      <div class="text-center mt-4">
        <span v-show="loading" class="inline-block">
          <icon name="loading" width="60" />
        </span>
        <span v-if="hasNext === false" class="text-gray-600">--Hết--</span>
        <span v-if="hasNext === true && totalRow != 0" class="text-blue-600 cursor-pointer">
          <i class="fa fa-angle-double-down"></i>
        </span>
      </div>
    </div>

    <!-- Modal Update Note (Care Result) -->
    <div v-if="showModalChangeNote" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="hideModalChangeNote"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h4 class="text-center text-xl font-bold text-green-600 mb-4">Cập nhật kết quả chăm sóc báo giá lần {{ currentQuotation.note_number }}</h4>
            <hr class="mb-4">

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Mã báo giá: {{ currentQuotation.quotation_number }}</label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Tên khách hàng: {{ currentQuotation.customer_name }}</label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Trạng thái báo giá: {{ currentQuotation.status_str }}</label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Kết quả chăm sóc báo giá lần {{ currentQuotation.note_number }}:</label>
              <textarea
                v-model="note_input_change"
                rows="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </textarea>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              v-show="!onChangeNote"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="onChangeNote"
              @click.prevent="confirmChangeNote">
              Xác nhận
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click.prevent="hideModalChangeNote">
              Quay lại
            </button>
            <span v-show="onChangeNote" class="inline-block ml-3">
              <icon name="loading" width="60" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Update Product Group Note -->
    <div v-if="showModalChangeProductGroupNote" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="hideModalChangeProductGroupNote"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h4 class="text-center text-xl font-bold text-green-600 mb-4">Cập nhật ghi chú nhóm sản phẩm</h4>
            <hr class="mb-4">

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Mã báo giá: {{ currentQuotation.quotation_number }}</label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Tên khách hàng: {{ currentQuotation.customer_name }}</label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú nhóm sản phẩm:</label>
              <textarea
                v-model="product_group_note"
                rows="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </textarea>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              v-show="!onChangeProductGroupNote"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="onChangeProductGroupNote"
              @click.prevent="confirmChangeProductGroupNote">
              Xác nhận
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click.prevent="hideModalChangeProductGroupNote">
              Quay lại
            </button>
            <span v-show="onChangeProductGroupNote" class="inline-block ml-3">
              <icon name="loading" width="60" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Update Quotation Status -->
    <div v-if="showModalChangeQuotationStatus" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="hideModalUpdateQuotationStatus"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h4 class="text-center text-xl font-bold text-red-600 mb-4">Cập nhật trạng thái báo giá rớt</h4>
            <hr class="mb-4">

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Mã báo giá: {{ currentQuotation.quotation_number }}</label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Tên khách hàng: {{ currentQuotation.customer_name }}</label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Trạng thái hiện tại: {{ currentQuotation.status_str }}</label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Cập nhật thành: Báo giá rớt</label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Lý do rớt báo giá<span class="text-red-500">*</span>:
              </label>
              <textarea
                v-model="reason_falling_note"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </textarea>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              v-show="!onChangeStatus"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="onChangeStatus"
              @click.prevent="confirmChangeStatus">
              Xác nhận
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click.prevent="hideModalUpdateQuotationStatus">
              Quay lại
            </button>
            <span v-show="onChangeStatus" class="inline-block ml-3">
              <icon name="loading" width="60" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Setting Quotation -->
    <div v-if="showModalSettingQuotationModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="hideModalSettingQuotation"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h4 class="text-center text-xl font-bold text-green-600 mb-4">Cài Đặt Chăm Sóc Báo Giá</h4>
            <hr class="mb-4">

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số ngày sẽ xuất hiện cảnh báo nếu quá hạn báo giá lần 1<span class="text-red-500">*</span>
              </label>
              <input
                v-model="number_of_days_overdue_quote_care_1"
                type="text"
                maxlength="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số ngày sẽ xuất hiện cảnh báo nếu quá hạn từ báo giá lần 1 tới báo giá lần 2<span class="text-red-500">*</span>
              </label>
              <input
                v-model="number_of_days_overdue_quote_care_2"
                type="text"
                maxlength="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              v-show="!onChangeSetting"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="onChangeSetting"
              @click.prevent="confirmChangeSettingQuotation">
              Lưu
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click.prevent="hideModalSettingQuotation">
              Quay lại
            </button>
            <span v-show="onChangeSetting" class="inline-block ml-3">
              <icon name="loading" width="60" />
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'
import quotationApi from '@/api/quotation'
import settingApi from '@/api/setting'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'

// Store and composables
const authStore = useAuthStore()
const { popToast } = useToast()

// Time options
const timeOptions = ref([
  { value: 1, text: 'Ngày' },
  { value: 2, text: 'Tháng' },
  { value: 3, text: 'Quý' },
  { value: 4, text: 'Năm' },
  { value: 5, text: 'Tất cả' }
])

const yearOptions = ref([])
const quarterOptions = ref([
  { value: 1, text: 'Quý 1' },
  { value: 2, text: 'Quý 2' },
  { value: 3, text: 'Quý 3' },
  { value: 4, text: 'Quý 4' }
])
const monthOptions = ref([
  { value: 1, text: 'Tháng 1' },
  { value: 2, text: 'Tháng 2' },
  { value: 3, text: 'Tháng 3' },
  { value: 4, text: 'Tháng 4' },
  { value: 5, text: 'Tháng 5' },
  { value: 6, text: 'Tháng 6' },
  { value: 7, text: 'Tháng 7' },
  { value: 8, text: 'Tháng 8' },
  { value: 9, text: 'Tháng 9' },
  { value: 10, text: 'Tháng 10' },
  { value: 11, text: 'Tháng 11' },
  { value: 12, text: 'Tháng 12' }
])

const time_option = ref(1)
const year_input = ref(2023)
const quarter_input = ref(1)
const month_input = ref(1)

// Filter options
const statusOptions = ref([
  { value: null, text: '-- Tất cả --' },
  { value: 0, text: 'Báo giá mới lập' },
  { value: 1, text: 'Báo giá đã thành công' },
  { value: 2, text: 'Báo giá đã rớt' }
])

const optionsStaff = ref([])
const customerStatusOptions = ref([
  { value: null, text: '-- Tất cả --' },
  { value: 1, text: 'Khách mới' },
  { value: 2, text: 'Khách cũ' }
])

const careStatusOptions = ref([
  { value: null, text: '-- Tất cả --' },
  { value: 0, text: 'Chưa chăm sóc' },
  { value: 1, text: 'Đã chăm sóc lần 1' },
  { value: 2, text: 'Đã chăm sóc lần 2' }
])

const expireStatusOptions = ref([
  { value: null, text: '-- Tất cả --' },
  { value: 0, text: 'Chưa quá hạn' },
  { value: 1, text: 'Đã quá hạn' }
])

const brandOptions = ref([])
const loadingOptions = ref(false)

// Input filters
const inputs = reactive({
  staff_in_charge: null,
  status: null,
  brand: {},
  customer_status: null,
  care_status: null,
  expire_status: null,
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02')
})

// Data
const items = ref([])
const currentQuotation = ref({})
const statusChange = ref(2)
const reason_falling_note = ref(null)
const onChangeStatus = ref(false)
const note_input_change = ref(null)
const product_group_note = ref(null)
const onChangeNote = ref(false)
const onChangeProductGroupNote = ref(false)
const loadByScroll = ref(false)
const onSearch = ref(false)
const hasNext = ref(true)
const loading = ref(false)
const pageLimit = ref(Constant.PAGE_LIMIT)
const offset = ref(0)
const totalRow = ref(0)
const userRole = ref('admin')
const scope = ref('all')
const isUserRoot = ref(false)

// Excel export
const excel_items = ref([])
const excel_fields = ref({
  'STT': 'stt',
  'Số BG': 'quotation_number',
  'Ngày BG': 'created_at',
  'NV phụ trách': 'staff_in_charge_name',
  'Tên K.H': 'customer_name',
  'Tình trạng khách': 'customer_status_str',
  'Loại Cty': 'customer_company_type_name',
  'Tổng tiền SP': 'sub_total',
  'Người liên hệ': 'contact_person_name',
  'SĐT liên hệ': {
    field: 'contact_person_phone',
    callback: (value) => {
      if (value) {
        return "'" + value
      }
      return value
    }
  },
  'Trạng thái BG': 'status_str',
  'Kết quả chăm sóc lần 1': 'note_1st',
  'Kết quả chăm sóc lần 2': 'note_2st',
  'Nhóm sản phẩm': 'product_group_note'
})
const isGetExcelItems = ref(false)

// Settings
const number_of_days_overdue_quote_care_1 = ref(3)
const number_of_days_overdue_quote_care_2 = ref(6)
const onChangeSetting = ref(false)

// Modal states
const showModalChangeNote = ref(false)
const showModalChangeProductGroupNote = ref(false)
const showModalChangeQuotationStatus = ref(false)
const showModalSettingQuotationModal = ref(false)

// Methods
const prepareDateInput = () => {
  let dateNow = new Date()
  inputs.to_date = dateNow
  inputs.from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
  let currentYear = new Date().getFullYear()
  year_input.value = currentYear
  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({ value: i, text: i })
  }
  month_input.value = new Date().getMonth() + 1
}

const getOptionsRelated = () => {
  loadingOptions.value = true
  let params = {
    brands: true
  }
  if (userRole.value != 'staff') {
    params.staffs = true
  }

  quotationApi.getOptionRelatedQuotation(params).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      optionsStaff.value = [{ value: null, text: '' }]
      let staffs = res.data.data.staffs
      if (staffs) {
        for (let i in staffs) {
          optionsStaff.value.push({ value: staffs[i].id, text: staffs[i].name })
        }
      }

      brandOptions.value = res.data.data.brands
      let itemBrandEmpty = { id: null, name: '--Tất cả--' }
      brandOptions.value.unshift(itemBrandEmpty)
    }

    loadingOptions.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    loadingOptions.value = false
  })
}

const getQuotationSetting = () => {
  let params = {
    group: 'quotation'
  }
  settingApi.getSettingByGroup(params).then(res => {
    if (res != null && res.data != null) {
      let settings = res.data.data

      for (let setting of settings) {
        if (setting.code == 'number_of_days_overdue_quote_care_1') {
          number_of_days_overdue_quote_care_1.value = setting.value
        }
        if (setting.code == 'number_of_days_overdue_quote_care_2') {
          number_of_days_overdue_quote_care_2.value = setting.value
        }
      }
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const showModalUpdateProductGroupNote = (quotation) => {
  currentQuotation.value = quotation
  product_group_note.value = quotation.product_group_note
  showModalChangeProductGroupNote.value = true
}

const showModalUpdateNote = (quotation, note_number) => {
  currentQuotation.value = quotation
  currentQuotation.value.note_number = note_number
  if (note_number == 1) {
    note_input_change.value = currentQuotation.value.note_1st
  }
  if (note_number == 2) {
    if (!quotation.note_1st) {
      popToast('danger', 'Chỉ có thể nhập [Kết quả chăm sóc lần 2] khi đã nhập lần 1')
      return
    }
    note_input_change.value = currentQuotation.value.note_2st
  }
  showModalChangeNote.value = true
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  search()
}

const hideModalChangeNote = () => {
  showModalChangeNote.value = false
}

const hideModalChangeProductGroupNote = () => {
  showModalChangeProductGroupNote.value = false
}

const confirmChangeNote = () => {
  if (onChangeNote.value) return

  if (!note_input_change.value || !note_input_change.value.trim()) {
    popToast('danger', 'Vui lòng nhập [Kết quả chăm sóc báo giá]')
    return
  }

  onChangeNote.value = true
  let params = {
    id: currentQuotation.value.id,
    note_number: currentQuotation.value.note_number,
    note_input_change: note_input_change.value
  }

  quotationApi.updateQuotationCustomerCare(params, userRole.value).then(res => {
    if (res != null && res.data != null) {
      showModalChangeNote.value = false
      // Update note in items
      for (let item of items.value) {
        if (item.id == currentQuotation.value.id) {
          if (currentQuotation.value.note_number == 1) {
            item.note_1st = note_input_change.value
          } else {
            item.note_2st = note_input_change.value
          }
          break
        }
      }
    }
    onChangeNote.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onChangeNote.value = false
  })
}

const confirmChangeProductGroupNote = () => {
  if (onChangeProductGroupNote.value) return

  if (!product_group_note.value || !product_group_note.value.trim()) {
    popToast('danger', 'Vui lòng nhập [Ghi chú nhóm sản phẩm]')
    return
  }

  onChangeProductGroupNote.value = true
  let params = {
    id: currentQuotation.value.id,
    product_group_note: product_group_note.value
  }

  quotationApi.updateProductGroupNote(params, userRole.value).then(res => {
    if (res != null && res.data != null) {
      showModalChangeProductGroupNote.value = false
      // Update note in items
      for (let item of items.value) {
        if (item.id == currentQuotation.value.id) {
          item.product_group_note = product_group_note.value
          break
        }
      }
    }
    onChangeProductGroupNote.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onChangeProductGroupNote.value = false
  })
}

const formatDateLocal = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const search = () => {
  if (onSearch.value) return

  onSearch.value = true
  loading.value = true

  let fromDate = formatDateLocal(inputs.from_date)
  let toDate = formatDateLocal(inputs.to_date)

  // Handle fromDate, toDate
  if (time_option.value == 2) {
    fromDate = year_input.value + '-' + month_input.value + '-01'
    toDate = year_input.value + '-' + month_input.value + '-' + new Date(year_input.value, month_input.value, 0).getDate()
  }
  if (time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(quarter_input.value)
    fromDate = year_input.value + '-' + quarter + '-01'
    toDate = year_input.value + '-' + (quarter + 2) + '-' + new Date(year_input.value, (quarter + 2), 0).getDate()
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
    staff_in_charge: inputs.staff_in_charge,
    status: inputs.status,
    brand_id: inputs.brand && inputs.brand.id ? inputs.brand.id : null,
    customer_status: inputs.customer_status,
    care_status: inputs.care_status,
    expire_status: inputs.expire_status,
    from_date: fromDate,
    to_date: toDate,
    limit: pageLimit.value,
    offset: offset.value
  }

  quotationApi.searchQuotationCustomerCare(params, userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.quotations
      totalRow.value = res.data.data.total_row

      // Update items
      if (loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      // Check has next
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
  if (isGetExcelItems.value) return
  if (userRole.value != 'admin') return

  excel_items.value = []
  params.limit = 999999

  quotationApi.searchQuotationCustomerCare(params, userRole.value).then(res => {
    if (res != null && res.data != null && res.data.data != null) {
      excel_items.value = res.data.data.quotations
      isGetExcelItems.value = true
    } else {
      excel_items.value = []
    }
  }).catch(err => {
    // Silent error for excel export
  })
}

const currencyFormat = (num) => {
  let result = ''
  if (num === 0) {
    return 0
  }
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return result
}

const showModalUpdateQuotationStatus = (quotation) => {
  currentQuotation.value = quotation
  showModalChangeQuotationStatus.value = true
}

const hideModalUpdateQuotationStatus = () => {
  showModalChangeQuotationStatus.value = false
}

const confirmChangeStatus = () => {
  if (onChangeStatus.value) return

  if (statusChange.value == currentQuotation.value.status) {
    return
  }

  if (!reason_falling_note.value) {
    popToast('danger', 'Mục [Lý do rớt báo giá] là mục bắt buộc nhập')
    return
  }

  if (!currentQuotation.value.note_1st || !currentQuotation.value.note_2st) {
    popToast('danger', 'Mục lòng nhập đủ kết quả chăm sóc lần 1 và lần 2')
    return
  }

  onChangeStatus.value = true
  let params = {
    quotation_id: currentQuotation.value.quotation_id,
    status_old: currentQuotation.value.status,
    status_new: statusChange.value,
    reason_falling_note: reason_falling_note.value
  }

  quotationApi.updateQuotationStatus(params, userRole.value).then(res => {
    if (res != null && res.data != null) {
      showModalChangeQuotationStatus.value = false
      prepareToSearch()
    }
    onChangeStatus.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onChangeStatus.value = false
  })
}

const showModalSettingQuotation = () => {
  showModalSettingQuotationModal.value = true
}

const hideModalSettingQuotation = () => {
  showModalSettingQuotationModal.value = false
}

const confirmChangeSettingQuotation = () => {
  if (onChangeSetting.value) return

  if (!number_of_days_overdue_quote_care_1.value) {
    popToast('danger', 'Vui lòng nhập giá trị [Số ngày sẽ xuất hiện cảnh báo nếu quá hạn báo giá lần 1]')
    return
  }
  if (!number_of_days_overdue_quote_care_2.value) {
    popToast('danger', 'Vui lòng nhập giá trị [Số ngày sẽ xuất hiện cảnh báo nếu quá hạn từ báo giá lần 1 tới báo giá lần 2]')
    return
  }

  onChangeSetting.value = true
  let params = {
    is_multiple: true,
    items: [
      {
        code: 'number_of_days_overdue_quote_care_1',
        value: number_of_days_overdue_quote_care_1.value,
        group: 'quotation'
      },
      {
        code: 'number_of_days_overdue_quote_care_2',
        value: number_of_days_overdue_quote_care_2.value,
        group: 'quotation'
      }
    ]
  }

  settingApi.updateStoreSetting(params).then(res => {
    if (res != null && res.data != null) {
      hideModalSettingQuotation()
      prepareToSearch()
    }
    onChangeSetting.value = false
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
    onChangeSetting.value = false
  })
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

const exportToExcel = () => {
  const exportData = excel_items.value.map((item, index) => ({
    'STT': item.stt,
    'Số BG': item.quotation_number,
    'Ngày BG': item.created_at,
    'NV phụ trách': item.staff_in_charge_name,
    'Tên K.H': item.customer_name,
    'Tình trạng khách': item.customer_status_str,
    'Loại Cty': item.customer_company_type_name,
    'Tổng tiền SP': item.sub_total,
    'Người liên hệ': item.contact_person_name,
    'SĐT liên hệ': item.contact_person_phone ? "'" + item.contact_person_phone : item.contact_person_phone,
    'Trạng thái BG': item.status_str,
    'Kết quả chăm sóc lần 1': item.note_1st,
    'Kết quả chăm sóc lần 2': item.note_2st,
    'Kết quả chăm sóc lần 3': item.note_3st
  }))
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách chăm sóc báo giá')
  XLSX.writeFile(workbook, 'danh_sach_cham_soc_bao_gia.xlsx')
}

// Lifecycle hooks
onMounted(() => {
  // UI by staff
  let url = location.href
  if (url.includes('quotation-care-staff')) {
    userRole.value = 'staff'
    scope.value = 'staff'
  } else {
    userRole.value = 'admin'
    scope.value = 'all'
  }

  // Check download excel
  if (authStore.user && authStore.user.isRoot) {
    isUserRoot.value = true
  } else {
    isUserRoot.value = false
  }

  // Get default from date and to date
  prepareDateInput()

  window.addEventListener('scroll', onScroll)

  // Get list option
  getOptionsRelated()

  // Search
  prepareToSearch()

  // Get quotation setting
  getQuotationSetting()
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
</style>
