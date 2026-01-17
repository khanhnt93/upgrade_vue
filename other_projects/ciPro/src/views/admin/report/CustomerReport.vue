<template>
  <div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <h4 class="text-center text-xl font-semibold text-gray-800 mb-4">Báo Cáo Khách Hàng</h4>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Thời gian</label>
          <select v-model="time_option" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in timeOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label v-show="time_option != 5" class="block text-sm font-medium mb-1">{{time_option == 1 ? 'Từ ngày' : 'Năm' }}</label>
          <Datepicker v-show="time_option == 1" v-model="inputs.from_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
          <select v-show="time_option != 1 && time_option != 5" v-model="year_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in yearOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label v-show="time_option == 1 || time_option == 2 || time_option == 3" class="block text-sm font-medium mb-1">
            {{time_option == 1 ? 'Đến ngày' : time_option == 2 ? 'Tháng' : 'Quý' }}
          </label>
          <Datepicker v-show="time_option == 1" v-model="inputs.to_date" format="yyyy-MM-dd"
                      placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
          <select v-show="time_option == 2" v-model="month_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in monthOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
          <select v-show="time_option == 3" v-model="quarter_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-6">
          <label class="block text-sm font-medium mb-1">Khách hàng</label>
          <multiselect
            v-model="inputs.customer"
            :options="customerOptions"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Tất cả--"
            label="name"
            track-by="name">
          </multiselect>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div class="md:col-span-4">
          <label class="block text-sm font-medium mb-1">Nhân viên</label>
          <multiselect
            v-model="inputs.staff_in_charge"
            :options="optionsStaff"
            :loading="loadingOptions"
            :select-label="''"
            :deselect-label="''"
            placeholder="--Tất cả--"
            label="text"
            track-by="text">
          </multiselect>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Tình trạng khách</label>
          <select
            id="status"
            v-model="inputs.status_id"
            class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Số lượng đơn đã bán</label>
          <select
            id="number"
            v-model="inputs.number_id"
            class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in numberOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Sắp xếp theo cột</label>
          <select
            id="orderBy"
            v-model="inputs.order_by"
            class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in orderByOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Thứ tự</label>
          <select
            id="index"
            v-model="inputs.index"
            class="form-select border border-gray-300 rounded px-3 py-2 w-full">
            <option v-for="option in indexOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-4 mb-4 text-right">
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
          @click.prevent="prepareToSearch">
          Tìm Kiếm
        </button>
      </div>

      <div class="mb-4">
        <p>Tổng số khách hàng đã bán hàng: {{currencyFormat(sum_ordered)}}</p>
        <p>Tổng số khách hàng chưa bán hàng: {{currencyFormat(sum_not_order)}}</p>
      </div>

      <div class="flex justify-between items-center mb-4">
        <div>
          Số kết quả: {{currencyFormat(totalRow)}}
        </div>
        <div v-if="excel_items.length > 0">
          <button
            @click="exportToExcel"
            class="btn btn-default text-header bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <b>Xuất Excel</b>
          </button>
        </div>
      </div>

      <div class="table-cus">
        <table class="table table-bordered table-striped fixed_header">
          <thead>
            <tr>
              <th style="width:3%">STT</th>
              <th style="width:20%">Tên khách hàng</th>
              <th style="width:6%">Ngày phát sinh ĐH cuối</th>
              <th style="width:11%">Số lượng ĐH bán</th>
              <th style="width:11%">Tổng doanh số đã bán</th>
              <th style="width:11%">Số lượng BG</th>
              <th style="width:11%">Tổng doanh số BG</th>
              <th style="width:11%">Tình trạng khách</th>
              <th style="width:5%">Lịch sử mua hàng</th>
              <th style="width:5%">Lịch sử BG</th>
              <th style="width:5%">Chi tiết công nợ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.name}}</td>
              <td>{{item.last_finished_date}}</td>
              <td>{{currencyFormat(item.count_order_sell)}}</td>
              <td>{{currencyFormat(item.sum_order_sell)}}</td>
              <td>{{currencyFormat(item.count_quotation)}}</td>
              <td>{{currencyFormat(item.sum_quotation)}}</td>
              <td>{{item.customer_status}}</td>
              <td>
                <button
                  v-show="item.count_order_sell > 0"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2 mt-1"
                  @click="openModalOrderSellHis(item)">
                  Xem
                </button>
              </td>
              <td>
                <button
                  v-show="item.count_quotation > 0"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2 mt-1"
                  @click="openModalQuotationHis(item)">
                  Xem
                </button>
              </td>
              <td>
                <button
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2 mt-1"
                  @click="openModalDebtHis(item)">
                  Xem
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading -->
      <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
      <span class="loading-more" v-if="hasNext === false">--Hết--</span>
      <span class="loading-more" v-if="hasNext === true && totalRow != 0"><i class="fa fa-angle-double-down has-next"></i></span>
    </div>

    <!-- Modal tìm kiếm lịch sử mua hàng -->
    <div v-if="showModalOrderSell" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalOrderSellHis">
      <div class="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-center text-xl font-semibold text-green-600 mb-4">Lịch Sử Mua Hàng</h4>
          <hr class="mb-4">

          <p class="mb-4">Khách hàng: {{currentCustomer.name}}</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Thời gian</label>
              <select v-model="search_time_option" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in timeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div>
              <label v-show="search_time_option != 5" class="block text-sm font-medium mb-1">{{search_time_option == 1 ? 'Từ ngày' : 'Năm' }}</label>
              <Datepicker v-show="search_time_option == 1" v-model="search_inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
              <select v-show="search_time_option != 1 && search_time_option != 5" v-model="search_year_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in yearOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div>
              <label v-show="search_time_option == 1 || search_time_option == 2 || search_time_option == 3" class="block text-sm font-medium mb-1">
                {{search_time_option == 1 ? 'Đến ngày' : search_time_option == 2 ? 'Tháng' : 'Quý' }}
              </label>
              <Datepicker v-show="search_time_option == 1" v-model="search_inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
              <select v-show="search_time_option == 2" v-model="search_month_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in monthOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <select v-show="search_time_option == 3" v-model="search_quarter_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex justify-between mb-4">
            <button
              class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              @click.prevent="hideModalOrderSellHis">
              Quay lại
            </button>
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              :disabled="onSearch"
              @click.prevent="searchOrderSell">
              Tìm Kiếm
            </button>
          </div>

          <div class="table-cus">
            <table class="table table-bordered table-striped fixed_header">
              <thead>
                <tr>
                  <th style="width:4%">STT</th>
                  <th style="width:12%">Số ĐH bán</th>
                  <th style="width:12%">Tình trạng đơn</th>
                  <th style="width:12%">Tổng giá trị ĐH</th>
                  <th style="width:12%">Số tiền còn phải TT</th>
                  <th style="width:12%">Trạng thái GH</th>
                  <th style="width:12%">Ngày tạo đơn</th>
                  <th style="width:12%">Ngày cập nhật lần cuối</th>
                  <th style="width:12%">NV phụ trách</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in order_sells" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{item.order_sell_number}}</td>
                  <td>{{item.status_str}}</td>
                  <td>{{currencyFormat(item.total)}}</td>
                  <td>{{currencyFormat(item.total_remaining)}}</td>
                  <td>{{item.shipping_status_str}}</td>
                  <td>{{item.created_at}}</td>
                  <td>{{item.updated_at}}</td>
                  <td>{{item.staff_name}}</td>
                </tr>
              </tbody>
            </table>
            <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>
            <p class="text-center">--Hết--</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal tìm kiếm lịch sử báo giá -->
    <div v-if="showModalQuotation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalQuotationHis">
      <div class="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-center text-xl font-semibold text-green-600 mb-4">Lịch Sử Báo Giá</h4>
          <hr class="mb-4">

          <p class="mb-4">Khách hàng: {{currentCustomer.name}}</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Thời gian</label>
              <select v-model="search_time_option" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in timeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div>
              <label v-show="search_time_option != 5" class="block text-sm font-medium mb-1">{{search_time_option == 1 ? 'Từ ngày' : 'Năm' }}</label>
              <Datepicker v-show="search_time_option == 1" v-model="search_inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
              <select v-show="search_time_option != 1 && search_time_option != 5" v-model="search_year_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in yearOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div>
              <label v-show="search_time_option == 1 || search_time_option == 2 || search_time_option == 3" class="block text-sm font-medium mb-1">
                {{search_time_option == 1 ? 'Đến ngày' : search_time_option == 2 ? 'Tháng' : 'Quý' }}
              </label>
              <Datepicker v-show="search_time_option == 1" v-model="search_inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
              <select v-show="search_time_option == 2" v-model="search_month_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in monthOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <select v-show="search_time_option == 3" v-model="search_quarter_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex justify-between mb-4">
            <button
              class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              @click.prevent="hideModalQuotationHis">
              Quay lại
            </button>
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              :disabled="onSearch"
              @click.prevent="searchQuotation">
              Tìm Kiếm
            </button>
          </div>

          <div class="table-cus">
            <table class="table table-bordered table-striped fixed_header">
              <thead>
                <tr>
                  <th style="width:4%">STT</th>
                  <th style="width:14%">Số báo giá</th>
                  <th style="width:12%">Tổng giá trị BG</th>
                  <th style="width:14%">Trạng thái BG</th>
                  <th style="width:14%">Lý do rớt</th>
                  <th style="width:14%">Ngày báo giá</th>
                  <th style="width:14%">Ngày cập nhật lần cuối</th>
                  <th style="width:14%">NV phụ trách</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in quotations" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{item.quotation_number}}</td>
                  <td>{{currencyFormat(item.total)}}</td>
                  <td>{{item.status_str}}</td>
                  <td>{{item.reason_falling_note}}</td>
                  <td>{{item.created_at}}</td>
                  <td>{{item.updated_at}}</td>
                  <td>{{item.staff_name}}</td>
                </tr>
              </tbody>
            </table>
            <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>
            <p class="text-center">--Hết--</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal tìm kiếm công nợ -->
    <div v-if="showModalDebt" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="hideModalDebtHis">
      <div class="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h4 class="text-center text-xl font-semibold text-green-600 mb-4">Chi Tiết Công Nợ</h4>
          <hr class="mb-4">

          <p class="mb-4">Khách hàng: {{currentCustomer.name}}</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Thời gian</label>
              <select v-model="search_time_option" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in timeOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div>
              <label v-show="search_time_option != 5" class="block text-sm font-medium mb-1">{{search_time_option == 1 ? 'Từ ngày' : 'Năm' }}</label>
              <Datepicker v-show="search_time_option == 1" v-model="search_inputs.from_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
              <select v-show="search_time_option != 1 && search_time_option != 5" v-model="search_year_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in yearOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div>
              <label v-show="search_time_option == 1 || search_time_option == 2 || search_time_option == 3" class="block text-sm font-medium mb-1">
                {{search_time_option == 1 ? 'Đến ngày' : search_time_option == 2 ? 'Tháng' : 'Quý' }}
              </label>
              <Datepicker v-show="search_time_option == 1" v-model="search_inputs.to_date" format="yyyy-MM-dd"
                          placeholder="yyyy-MM-dd" input-class="datepicker-cus"></Datepicker>
              <select v-show="search_time_option == 2" v-model="search_month_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in monthOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <select v-show="search_time_option == 3" v-model="search_quarter_input" class="form-select border border-gray-300 rounded px-3 py-2 w-full">
                <option v-for="option in quarterOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex justify-between mb-4">
            <button
              class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              @click.prevent="hideModalDebtHis">
              Quay lại
            </button>
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              :disabled="onSearch"
              @click.prevent="searchDebt">
              Tìm Kiếm
            </button>
          </div>

          <div class="table-cus">
            <table class="table table-bordered table-striped fixed_header">
              <thead>
                <tr>
                  <th style="width:5%">STT</th>
                  <th style="width:14%">Số ĐH bán</th>
                  <th style="width:14%">Tình trạng đơn</th>
                  <th style="width:13%">Tổng giá trị ĐH</th>
                  <th style="width:13%">Số tiền đã TT</th>
                  <th style="width:13%">Số tiền còn phải TT</th>
                  <th style="width:14%">Trạng thái GH</th>
                  <th style="width:14%">NV phụ trách</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in debts" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{item.order_sell_number}}</td>
                  <td>{{item.status_str}}</td>
                  <td>{{currencyFormat(item.total)}}</td>
                  <td>{{currencyFormat(item.total - item.total_remaining)}}</td>
                  <td>{{currencyFormat(item.total_remaining)}}</td>
                  <td>{{item.shipping_status_str}}</td>
                  <td>{{item.staff_name}}</td>
                </tr>
              </tbody>
            </table>
            <span class="loading-more" v-show="onSearch"><icon name="loading" width="60" /></span>
            <p class="text-center">--Hết--</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import reportApi from '@/api/report'
import commonFunc from '@/common/commonFunc'
import {Constant} from '@/common/constant'
import Datepicker from 'vue3-datepicker'
import Multiselect from 'vue-multiselect'
import { useToast } from '@/composables/useToast'
import * as XLSX from 'xlsx'

const { popToast } = useToast()

const timeOptions = ref([
  {"value": 1, "text": 'Ngày'},
  {"value": 2, "text": 'Tháng'},
  {"value": 3, "text": 'Quý'},
  {"value": 4, "text": 'Năm'},
  {"value": 5, "text": 'Tất cả'}
])
const yearOptions = ref([])
const quarterOptions = ref([
  {"value": 1, "text": 'Quý 1'},
  {"value": 2, "text": 'Quý 2'},
  {"value": 3, "text": 'Quý 3'},
  {"value": 4, "text": 'Quý 4'}
])
const monthOptions = ref([
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
])
const time_option = ref(2)
const year_input = ref(2024)
const quarter_input = ref(1)
const month_input = ref(1)
const inputs = ref({
  customer: null,
  staff_in_charge: null,
  status_id: null,
  number_id: null,
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02'),
  order_by: ' count_order_sell ',
  index: ' desc '
})
const loadingOptions = ref(false)
const customerOptions = ref([])
const optionsStaff = ref([])
const statusOptions = [
  {value: null, text: '-- Tất cả --'},
  {value: 1, text: 'Cũ'},
  {value: 2, text: 'Mới'},
]
const numberOptions = [
  {value: null, text: '-- Tất cả --'},
  {value: 1, text: 'Khách hàng đã bán trên 3 đơn'},
  {value: 2, text: 'Khách hàng đã bán từ 1-3 đơn'},
  {value: 3, text: 'Khách hàng chưa bán hàng'}
]
const orderByOptions = [
  {value: ' count_order_sell ', text: 'Số lượng đơn hàng bán'},
  {value: ' sum_order_sell ', text: 'Tổng doanh số đã bán'},
  {value: ' count_quotation ', text: 'Số lượng báo giá'},
  {value: ' sum_quotation ', text: 'Tổng doanh số báo giá'},
  {value: ' last_finished_date ', text: 'Ngày phát sinh đơn hàng cuối'}
]
const indexOptions = [
  {value: ' desc ', text: 'Cao -> thấp'},
  {value: ' asc ', text: 'Thấp -> Cao'},
]
const items = ref([])
const sum_ordered = ref(0)
const sum_not_order = ref(0)
const hasNext = ref(true)
const loading = ref(false)
const totalRow = ref(0)
const loadByScroll = ref(false)
const pageLimit = Constant.PAGE_LIMIT
const offset = ref(0)
const excel_items = ref([])
const excel_fields = {
  'Tên K.H': 'name',
  'Ngày phát sinh ĐH cuối': 'last_finished_date',
  'Số lượng ĐH bán' : 'count_order_sell',
  'Tổng doanh số đã bán' : 'sum_order_sell',
  'Số lượng BG' : 'count_quotation',
  'Tổng doanh số BG' : 'sum_quotation',
  'Tình trạng khách' : 'customer_status'
}
const isGetExcelItems = ref(false)

// Modal states
const showModalOrderSell = ref(false)
const showModalQuotation = ref(false)
const showModalDebt = ref(false)
const onSearch = ref(false)
const currentCustomer = ref({})
const search_time_option = ref(5)
const search_year_input = ref(2024)
const search_quarter_input = ref(1)
const search_month_input = ref(1)
const search_inputs = ref({
  customer_id: null,
  from_date: new Date('2000-01-01'),
  to_date: new Date('2000-01-02')
})
const order_sells = ref([])
const quotations = ref([])
const debts = ref([])

const onScroll = (event) => {
  if(loading.value) {
    return
  }
  event.preventDefault()
  var body = document.body
  var html = document.documentElement
  if (window.pageYOffset + window.innerHeight + 25 > Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)) {
    if(hasNext.value) {
      offset.value = offset.value + 10
      loadByScroll.value = true
      search()
    }
  }
}

const prepareDateInput = () => {
  let dateNow = new Date()
  let to_date = dateNow.toJSON().slice(0,10)
  let from_date = new Date(dateNow.setDate(dateNow.getDate() - 7))
  inputs.value.to_date = new Date(to_date)
  inputs.value.from_date = from_date
  let currentYear = new Date().getFullYear()
  year_input.value = currentYear

  search_year_input.value = currentYear
  search_inputs.value.to_date = new Date(to_date)
  search_inputs.value.from_date = from_date

  yearOptions.value = []
  for (let i = currentYear; i > currentYear - 10; i--) {
    yearOptions.value.push({value: i, text: i})
  }

  month_input.value = dateNow.getMonth() + 1
  search_month_input.value = dateNow.getMonth() + 1
}

const getOptionRelated = () => {
  loadingOptions.value = true

  let params = {
    'staffs': true,
    'customers': true
  }

  reportApi.getOptionsRelatedReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let options = res.data.data

      optionsStaff.value = options.staffs
      optionsStaff.value.unshift({value: null, text: "-- Tất cả --"})

      customerOptions.value = options.customers
      customerOptions.value.unshift({value: null, text: "-- Tất cả --"})
    }
    loadingOptions.value = false
  }).catch(err => {
    loadingOptions.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const openModalOrderSellHis = (customer) => {
  currentCustomer.value = customer
  search_time_option.value = JSON.parse(JSON.stringify(time_option.value))
  search_year_input.value = JSON.parse(JSON.stringify(year_input.value))
  search_month_input.value = JSON.parse(JSON.stringify(month_input.value))
  search_quarter_input.value = JSON.parse(JSON.stringify(quarter_input.value))
  search_inputs.value.from_date = JSON.parse(JSON.stringify(inputs.value.from_date))
  search_inputs.value.to_date = JSON.parse(JSON.stringify(inputs.value.to_date))

  showModalOrderSell.value = true
  searchOrderSell()
}

const hideModalOrderSellHis = () => {
  showModalOrderSell.value = false
  order_sells.value = []
}

const openModalQuotationHis = (customer) => {
  currentCustomer.value = customer
  search_time_option.value = JSON.parse(JSON.stringify(search_time_option.value))
  search_year_input.value = JSON.parse(JSON.stringify(year_input.value))
  search_month_input.value = JSON.parse(JSON.stringify(month_input.value))
  search_quarter_input.value = JSON.parse(JSON.stringify(quarter_input.value))
  search_inputs.value.from_date = JSON.parse(JSON.stringify(inputs.value.from_date))
  search_inputs.value.to_date = JSON.parse(JSON.stringify(inputs.value.to_date))

  showModalQuotation.value = true
  searchQuotation()
}

const hideModalQuotationHis = () => {
  showModalQuotation.value = false
  quotations.value = []
}

const openModalDebtHis = (customer) => {
  currentCustomer.value = customer
  showModalDebt.value = true
  searchDebt()
}

const hideModalDebtHis = () => {
  showModalDebt.value = false
  debts.value = []
}

const getExcelItem = (params) => {
  if(isGetExcelItems.value) {
    return
  }

  excel_items.value = []

  params.limit = 999999

  reportApi.getCustomerReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null){
      excel_items.value = res.data.data.reports
      isGetExcelItems.value = true
    }
  }).catch(err => {})
}

const prepareToSearch = () => {
  offset.value = 0
  items.value = []
  hasNext.value = true
  isGetExcelItems.value = false
  sum_ordered.value = 0
  sum_not_order.value = 0
  totalRow.value = 0

  search()
}

const search = () => {
  if(loading.value) {
    return
  }

  loading.value = true

  let fromDate = inputs.value.from_date
  let toDate = inputs.value.to_date

  if(time_option.value == 2) {
    fromDate = year_input.value + '-' + month_input.value + '-01'
    toDate = year_input.value + '-' + month_input.value + '-' + new Date(year_input.value, month_input.value, 0).getDate()
  }
  if(time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(quarter_input.value)
    fromDate = year_input.value + '-' + quarter + '-01'
    toDate = year_input.value + '-' + (quarter + 2) + '-' + new Date(year_input.value, (quarter + 2), 0).getDate()
  }
  if(time_option.value == 4) {
    fromDate = year_input.value + '-01-01'
    toDate = year_input.value + '-12-' + new Date(year_input.value, 12, 0).getDate()
  }
  if(time_option.value == 5) {
    toDate = new Date().toJSON().slice(0,10)
    fromDate = '2000-01-01'
  }

  let params = {
    staff_in_charge: inputs.value.staff_in_charge && inputs.value.staff_in_charge.value ? inputs.value.staff_in_charge.value : null,
    customer_id: inputs.value.customer && inputs.value.customer.id ? inputs.value.customer.id : null,
    status_id: inputs.value.status_id,
    number_id: inputs.value.number_id,
    from_date: fromDate,
    to_date: toDate,
    order_by: inputs.value.order_by,
    index: inputs.value.index,
    limit: pageLimit,
    offset: offset.value
  }

  reportApi.getCustomerReport(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      let it = res.data.data.reports
      totalRow.value = res.data.data.total_row
      sum_not_order.value = res.data.data.sum_not_order
      sum_ordered.value = res.data.data.sum_ordered

      if(loadByScroll.value) {
        let temp = items.value
        var newArray = temp.concat(it)
        items.value = newArray
      } else {
        items.value = it
      }
      loadByScroll.value = false

      if(offset.value + pageLimit >= res.data.data.total_row) {
        hasNext.value = false
      }

      if(!isGetExcelItems.value) {
        getExcelItem(params)
      }
    } else {
      items.value = []
      excel_items.value = []
    }
    loading.value = false
  }).catch(err => {
    loading.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const searchOrderSell = () => {
  if(onSearch.value) {
    return
  }

  onSearch.value = true

  let fromDate = search_inputs.value.from_date
  let toDate = search_inputs.value.to_date

  if(search_time_option.value == 2) {
    fromDate = search_year_input.value + '-' + search_month_input.value + '-01'
    toDate = search_year_input.value + '-' + search_month_input.value + '-' + new Date(search_year_input.value, search_month_input.value, 0).getDate()
  }
  if(search_time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(search_quarter_input.value)
    fromDate = search_year_input.value + '-' + quarter + '-01'
    toDate = search_year_input.value + '-' + (quarter + 2) + '-' + new Date(search_year_input.value, (quarter + 2), 0).getDate()
  }
  if(search_time_option.value == 4) {
    fromDate = search_year_input.value + '-01-01'
    toDate = search_year_input.value + '-12-' + new Date(search_year_input.value, 12, 0).getDate()
  }
  if(search_time_option.value == 5) {
    toDate = new Date().toJSON().slice(0,10)
    fromDate = '2000-01-01'
  }

  let params = {
    customer_id: currentCustomer.value.id,
    from_date: fromDate,
    to_date: toDate
  }

  reportApi.getOrderSellByCustomer(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      order_sells.value = res.data.data
    }

    onSearch.value = false
  }).catch(err => {
    onSearch.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const searchQuotation = () => {
  if(onSearch.value) {
    return
  }

  onSearch.value = true

  let fromDate = search_inputs.value.from_date
  let toDate = search_inputs.value.to_date

  if(search_time_option.value == 2) {
    fromDate = search_year_input.value + '-' + search_month_input.value + '-01'
    toDate = search_year_input.value + '-' + search_month_input.value + '-' + new Date(search_year_input.value, search_month_input.value, 0).getDate()
  }
  if(search_time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(search_quarter_input.value)
    fromDate = search_year_input.value + '-' + quarter + '-01'
    toDate = search_year_input.value + '-' + (quarter + 2) + '-' + new Date(search_year_input.value, (quarter + 2), 0).getDate()
  }
  if(search_time_option.value == 4) {
    fromDate = search_year_input.value + '-01-01'
    toDate = search_year_input.value + '-12-' + new Date(search_year_input.value, 12, 0).getDate()
  }
  if(search_time_option.value == 5) {
    toDate = new Date().toJSON().slice(0,10)
    fromDate = '2000-01-01'
  }

  let params = {
    customer_id: currentCustomer.value.id,
    from_date: fromDate,
    to_date: toDate
  }

  reportApi.getQuotationByCustomer(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      quotations.value = res.data.data
    }

    onSearch.value = false
  }).catch(err => {
    onSearch.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const searchDebt = () => {
  if(onSearch.value) {
    return
  }

  onSearch.value = true

  let fromDate = search_inputs.value.from_date
  let toDate = search_inputs.value.to_date

  if(search_time_option.value == 2) {
    fromDate = search_year_input.value + '-' + search_month_input.value + '-01'
    toDate = search_year_input.value + '-' + search_month_input.value + '-' + new Date(search_year_input.value, search_month_input.value, 0).getDate()
  }
  if(search_time_option.value == 3) {
    let quarter = commonFunc.getMonthByQuarter(search_quarter_input.value)
    fromDate = search_year_input.value + '-' + quarter + '-01'
    toDate = search_year_input.value + '-' + (quarter + 2) + '-' + new Date(search_year_input.value, (quarter + 2), 0).getDate()
  }
  if(search_time_option.value == 4) {
    fromDate = search_year_input.value + '-01-01'
    toDate = search_year_input.value + '-12-' + new Date(search_year_input.value, 12, 0).getDate()
  }
  if(search_time_option.value == 5) {
    toDate = new Date().toJSON().slice(0,10)
    fromDate = '2000-01-01'
  }

  let params = {
    customer_id: currentCustomer.value.id,
    from_date: fromDate,
    to_date: toDate
  }

  reportApi.getDebtByCustomer(params).then(res => {
    if(res != null && res.data != null && res.data.data != null) {
      debts.value = res.data.data
    }

    onSearch.value = false
  }).catch(err => {
    onSearch.value = false

    let errorMess = commonFunc.handleStaffError(err)
    popToast('danger', errorMess)
  })
}

const currencyFormat = (num) => {
  let result = ""
  if(num == 0) return "0"
  if(num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return result
}

const exportToExcel = () => {
  const exportData = excel_items.value.map((item, index) => ({
    'STT': index + 1,
    'Tên khách hàng': item.name,
    'Ngày phát sinh ĐH cuối': item.last_finished_date,
    'Số lượng ĐH bán': item.count_order_sell,
    'Tổng doanh số đã bán': item.sum_order_sell,
    'Số lượng BG': item.count_quotation,
    'Tổng doanh số BG': item.sum_quotation,
    'Tình trạng khách': item.customer_status
  }))
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo khách hàng')
  XLSX.writeFile(workbook, 'bao_cao_khach_hang.xlsx')
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  prepareDateInput()
  getOptionRelated()
  prepareToSearch()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
