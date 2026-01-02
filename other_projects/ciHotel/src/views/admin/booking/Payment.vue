<template>
  <div class="container-fluid">
    <b-row>
      <b-col>
        <b-card>
              <b-row>
                <b-col cols="6" class="pt-2">
                  <b-button variant="secondary" class="pull-left px-4" @click="goBack()">
                    Quay lại
                  </b-button>
                </b-col>
                <b-col cols="6" v-show="loading == false" class="pt-2">
                  <b-button v-show="!isPayment" variant="outline-success" class="pull-right btn-width-140"
                          @click="showModalConfirmPayment()" :disabled="paymentInfo.length == 0">
                    Thanh toán
                  </b-button>
                  <h5 v-show="isPayment" class="text-header">Đã thanh toán</h5>
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="12" class="pt-2">
                  <b-button v-show="!isPayment"  variant="outline-primary" class="pull-left btn-width-160"
                          @click="printBill()" :disabled="paymentInfo.length == 0">
                    In HĐ tạm tính
                  </b-button>
                </b-col>
                <!--<b-col cols="6" class="pt-2">-->
                  <!--<button v-show="!isPayment" class="btn btn-primary pull-right px-4 default-btn-bg fix-width-btn-200"-->
                          <!--@click="getPaymentInfo()" :disabled="paymentInfo.length == 0">-->
                    <!--Làm mới thông tin-->
                  <!--</button>-->
                <!--</b-col>-->
              </b-row>

              <b-row>
                <b-col class="text-center">
                  <h5 class="text-header mt-2">THÔNG TIN THANH TOÁN</h5>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <!-- Loading -->
                  <span class="loading-more" v-show="loading"><icon name="loading" width="60" /></span>
                </b-col>
              </b-row>

              <b-row class="mt-3 pb-3">

                <b-col md="6">
                  <h4 class="col-12 mt-3"><b>Tên phòng:</b> {{this.paymentInfo.room_name}}</h4>
                  <p class="col-12 mt-3"><b>Loại phòng: </b>{{this.paymentInfo.room_type_name}}</p>
                  <p class="col-12 mt-3"><b>Khách hàng: </b>{{this.paymentInfo.customer_name}}</p>
                  <p class="col-12 mt-3">
                    <b>Số lượng khách: </b>
                    <span v-if="this.paymentInfo.adult && this.paymentInfo.adult > 0">{{this.paymentInfo.adult}} người lớn</span>
                    <span class="ml-2" v-if="this.paymentInfo.children && this.paymentInfo.children > 0">{{this.paymentInfo.children}} trẻ em</span>
                  </p>
                  <p class="col-12 mt-3"><b>Booking giờ đến:</b> {{this.paymentInfo.time_in}}</p>
                  <p class="col-12 mt-3"><b>Booking giờ đi:</b> {{this.paymentInfo.time_out}}</p>
                  <p class="col-12 mt-3"><b>Giờ khách đến thực tế:</b> {{this.formattedActualCheckIn}}</p>
                  <p class="col-12 mt-3"><b>Giờ khách đi thực tế:</b> {{this.formattedActualCheckOut}}<i class="fa fa-edit" style="margin-left:5px" @click="showModalEditActualCheckOut"></i></p>
                  <p class="col-12 mt-3"><b>Giờ khách ở:</b> {{this.paymentInfo.time_at}}</p>
                </b-col>

                <b-col md="6">
                  <h4 class="col-12 mt-3"><b>Thành tiền: </b>
                    <p class="pull-right">
                      <b-button class="width-icon ml-2 btn-sm" title="Tính tiền thừa" variant="secondary" type="button" @click="showModalCalMoneyRefund" :disabled="isPayment">
                        <i class="fa fa-calculator"></i>
                      </b-button>
                      <b>{{currencyFormat(this.paymentInfo.total)}}</b>
                    </p>
                  </h4>

                  <b-row v-show="paymentInfo.money_receive">
                    <b-col>
                      <p class="pull-right">Số tiền khách đưa: <b>{{currencyFormat(paymentInfo.money_receive)}}</b> | Số tiền trả khách: <b>{{currencyFormat(paymentInfo.money_receive - paymentInfo.total)}}</b></p>
                    </b-col>
                  </b-row>

                  <p class="col-12 mt-2">
                    <b>Tổng tiền phòng:</b>
                    <span class="pull-right">{{currencyFormat(this.paymentInfo.sub_total)}}</span>
                  </p>
                  <p class="col-12 mt-2" v-show="this.paymentInfo.service_amount">
                    <b>Phí dịch vụ/Phụ thu:</b>
                    <span class="pull-right">{{currencyFormat(this.paymentInfo.service_amount)}}</span>
                  </p>
                  <p class="col-12 mt-2" v-show="this.paymentInfo.discount_amount">
                    <b>Tổng giảm giá:</b>
                    <span class="pull-right">{{currencyFormat(this.paymentInfo.discount_amount)}}</span>
                  </p>
                  <p class="col-12 mt-2">
                    <b>Thành tiền trước thuế:</b>
                    <span class="pull-right">{{currencyFormat(this.paymentInfo.total - this.paymentInfo.vat_value)}}</span>
                  </p>
                  <p class="col-12 mt-2">
                    <b>Thuế VAT: </b>
                    <input class="largerCheckbox mr-2" type="checkbox" name="open"
                           v-model="paymentInfo.apply_vat" @change="applyVat" :disabled="isPayment"/>
                    <input
                        id="vat_percent"
                        type="text"
                        style="width: 40px; height: 25px"
                        v-model="paymentInfo.vat_percent"
                        autocomplete="new-password"
                        @keyup="integerOnly($event.target)"
                        maxlength="3"
                        @change="applyVat">%
                    <span class="pull-right">{{currencyFormat(this.paymentInfo.vat_value)}}</span>
                  </p>

                  <b-row class="col-12">
                    <b-col>

                      <b-row class="form-row">
                        <b-col md="12">
                          <label><b>Loại tiền: </b> </label>
                          <b-button class="width-icon ml-2 btn-sm" variant="secondary" type="button" @click="showModalExtendMoney" :disabled="isPayment">
                            <i class="fa fa-plus "/>
                          </b-button>
                        </b-col>
                      </b-row>

                      <b-row class="form-row ml-3">
                        <b-col>
                          <p>Tiền mặt: {{currencyFormat(this.paymentInfo.cash)}}</p>
                          <p>Chuyển khoản: {{currencyFormat(this.paymentInfo.credit)}}</p>
                          <p>Tiền điện tử: {{currencyFormat(this.paymentInfo.e_money)}}</p>
                        </b-col>
                      </b-row>

                      <b-row class="form-row">
                        <b-col md="12" class="mt-2">
                          <div class="input-group">
                            <label><b>Khuyến mãi: </b> </label>
                            <b-button class="width-icon ml-2 btn-sm" variant="secondary" type="button"
                                      @click="showModalApplyPmt" :disabled="isPayment">
                              <i class="fa fa-plus "/>
                            </b-button>
                          </div>
                        </b-col>
                      </b-row>

                      <b-row class="form-row ml-3" v-show="this.paymentInfo.pmts && this.paymentInfo.pmts.length > 0">
                        <b-col md="12" class="mt-2">
                          <label>Khuyến mãi đang áp dụng: </label>
                          <p v-for="(pmt, index) in this.paymentInfo.pmts" :key="pmt.name + index">
                            {{pmt.quantity_apply + " x " + pmt.name}}
                            <i v-show="pmt.method != 'auto'" class="fa fa-trash" @click="deletePromotion(pmt.id)"/>
                          </p>
                        </b-col>
                      </b-row>

                    </b-col>
                  </b-row>

                  <b-row class="col-12">
                    <b-col>

                      <b-row class="form-row">
                        <b-col md="12">
                          <div class="input-group">
                            <label><b>Phí dịch vụ, phụ thu: </b> </label>
                            <b-button class="width-icon ml-2 btn-sm" variant="secondary" type="button" @click="showModalServiceFee" :disabled="isPayment">
                              <i class="fa fa-plus "/>
                            </b-button>
                          </div>
                        </b-col>
                      </b-row>

                      <b-row class="form-row ml-3" v-show="this.paymentInfo.service && this.paymentInfo.service.length > 0">
                        <b-col md="12" class="mt-2">
                          <label>Dịch vụ, phụ thu đang áp dụng: </label>
                          <table class="table table-bordered table-striped fixed_header">
                            <thead>
                              <tr>
                                <th>STT</th>
                                <th>Ngày</th>
                                <th>DV/Phụ thu</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(service, index) in this.paymentInfo.service" :key="service.name + index">
                                <td>{{index + 1}}</td>
                                <td>{{service.created_at}}</td>
                                <td>{{service.name}}</td>
                                <td class="text-right">{{currencyFormat(service.price)}}</td>
                                <td class="text-right">{{currencyFormat(service.quantity)}}</td>
                                <td><i class="fa fa-trash" @click="deleteService(service.name, service.price)"/></td>
                              </tr>
                            </tbody>
                          </table>
                        </b-col>
                      </b-row>

                      </b-col>
                  </b-row>

                  <p class="col-12 mt-3"><b>Chi tiết thời gian: </b></p>
                  <ul v-if="paymentInfo && paymentInfo.payment_split_times && paymentInfo.payment_split_times.length>0">
                    <li v-for="(item,index) in paymentInfo.payment_split_times" :key ="index">
                      <p class="col-12 mt-3">
                        Từ {{item.start_time.substring(0, 16)}} đến {{item.end_time.substring(0, 16)}}{{item.unit_number>1?` (${item.unit_number})`:''}}: <b>{{currencyFormat(item.amount)}}</b>
                        <i class="fa fa-edit" style="margin-left:5px" @click="showModalSplitBill($event,index)"/>
                      </p>
                      <EditSplitBillModal
                        :title="'Thay đổi giá trị bill tách số '+ item.payment_split_time_id"
                        :handle-submit="confirmEditSplitBill"
                        :id="index"
                      />
                    </li>
                  </ul>

                  <p class="col-12 mt-3"><b>Ghi chú: </b></p>
                  <b-row>
                    <b-col md="12">
                      <b-form-textarea
                        placeholder="Ghi chú"
                        rows="3"
                        v-model="paymentInfo.note">
                      </b-form-textarea>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col md="12" class="text-center mt-2">
                      <b-button variant="outline-success" class="btn-width-180" @click="updateNote()">
                        Cập nhật ghi chú
                      </b-button>
                    </b-col>
                  </b-row>

                </b-col>


              </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal edit actual check out -->
    <b-modal centered hide-footer hide-header id="modal-edit-actual-checkout">
      <b-row>
        <b-col>
          <h5 class="text-center">Nhập thời gian khách đi thực tế:</h5>
        </b-col>
      </b-row>
      <hr>
        <b-row class="form-row" style="margin-bottom: 5px">
          <b-col md="12">
            <span> Thời gian cũ:</span>
            <input
              class="form-control"
              id="check_in_time"
              type="text"
              v-model="this.formattedActualCheckOut"
              :readonly="true"
            />
          </b-col>
        </b-row>
          <b-row class="form-row" style="margin-bottom: 5px">
            <b-col md="12">
            <span> Thời gian mới:</span>
            <Datepicker
              :value="this.newActualCheckOut"
              ref="editActualCheckOut"
              format="DD-MM-YYYY H:i:s"
            />
            </b-col>
          </b-row>
          <b-row class="d-flex justify-content-center">
            <button class="btn btn-primary px-4 default-btn-bg" style="margin-right: 5px" @click="confirmEditActualCheckOut">
              Xác nhận
            </button>
            <b-button @click="cancelEditActualCheckOut">
              Hủy bỏ
            </b-button>
          </b-row>

      </b-modal>

    <!-- Modal apply pmt -->
    <b-modal title="Áp dụng khuyến mãi" centered hide-header hide-footer no-close-on-backdrop id="modal-apply-pmt" size="xl">
      <b-row>
        <b-col>
          <h5 class="text-center">Áp dụng khuyến mãi</h5>
        </b-col>
      </b-row>
      <hr>

      <b-row>

        <b-col>
          <p class="col-12" v-for="pmt in this.pmtOfStore" :key="pmt.id">
            <b>- </b> {{pmt.name}}<span v-if="pmt.code">({{pmt.code}})</span>
            <b-list-group horizontal>
              <b-list-group-item @click="plusQuantityPmt(pmt.id, pmt.type, pmt.remaining, pmt)">
                <i class="fa fa-plus"/>
              </b-list-group-item>
              <b-list-group-item>
                <span :id="'pmtStore' + pmt.id">0</span>
              </b-list-group-item>
              <b-list-group-item @click="minusQuantityPmt(pmt.id, pmt)">
                <i class="fa fa-minus"/>
              </b-list-group-item>
            </b-list-group>
          </p>
        </b-col>

      </b-row>

      <!--<b-row v-show="this.pmtTemp.length > 0">-->
        <!--<b-col>-->
          <!--Khuyến mãi:-->
          <!--<p class="col-12" v-for="pmt in this.pmtTemp" :key="pmt.pk">-->
            <!--{{" - " + pmt.quantity_apply + " x " + pmt.name}}-->
            <!--<i v-show="pmt.method != 'auto'" class="fa fa-trash" @click="deletePromotionTemp(pmt.id)"/>-->
          <!--</p>-->
        <!--</b-col>-->
      <!--</b-row>-->

      <b-row class="mt-2">
        <b-col cols="6">
          <b-button variant="secondary" class="pull-left px-4" @click="cancelApplyPmt()">
            Hủy
          </b-button>
        </b-col>
        <b-col cols="6">
          <!-- Loading -->
          <span class="loading-more" v-show="loadingConfirmPmt"><icon name="loading" width="60" /></span>

          <button v-show="!isPayment && !loadingConfirmPmt" class="btn btn-primary pull-right px-4 default-btn-bg"
                  @click="confirmApplyPmt()">
            Xác nhận &nbsp;
          </button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal service fee -->
    <b-modal centered hide-footer hide-header no-close-on-backdrop id="modal-service-fee" @hide="hideModalServiceFee">

      <b-row>
        <b-col class="text-center text-header">
          <h5>Thêm phí dịch vụ, phụ thu</h5>
        </b-col>
      </b-row>
      <br>

      <b-row>
        <b-col>
          <b-tabs content-class="mt-3">
              <b-tab title="Phí dịch vụ" active>
                <div class="form-group">
                  <label>Tên dịch vụ</label><span class="error-sybol"></span>
                  <input
                    id="serviceName"
                    type="text"
                    class="form-control"
                    maxlength="100">
                </div>
                <div class="form-group">
                  <label>Giá dịch vụ</label><span class="error-sybol"></span>
                  <input
                    id="servicePrice"
                    type="text"
                    class="form-control"
                    maxlength="11"
                    @keyup="integerOnly($event.target)">
                </div>

                <b-row>
                  <b-col>
                    <label class="text-danger" v-show="serviceError">Hãy nhập đủ các trường bắt buộc</label>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col class="text-center">
                    <button class="btn btn-primary px-4 default-btn-bg" @click="addNewService()">
                      Thêm &nbsp;
                    </button>
                  </b-col>
                </b-row>
              </b-tab>

              <b-tab title="Phụ thu">
                <div class="form-group">
                  <label>Tên phụ thu</label>
                  <input
                    id="surchargeName"
                    type="text"
                    class="form-control"
                    maxlength="100">
                </div>
                <div class="form-group">
                  <label>Số tiền phụ thu</label>
                  <input
                    id="surchargePrice"
                    type="text"
                    class="form-control"
                    maxlength="11"
                    @keyup="integerOnly($event.target)">
                </div>

                <b-row>
                  <b-col>
                    <label class="text-danger" v-show="surchargeError">Hãy nhập đủ các trường bắt buộc</label>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col class="text-center">
                    <button class="btn btn-primary px-4 default-btn-bg" @click="addNewSurcharge()">
                      Thêm &nbsp;
                    </button>
                  </b-col>
                </b-row>
              </b-tab>

              <b-tab title="Dịch vụ có sẵn">
                <b-row style="margin-bottom:10px; padding-left:15px">
                  <b-form-input placeholder="Lọc" v-model="roomServiceFilter" style="width:50%"/>
                </b-row>
                <b-row>
                  <p class="col-12" v-for="service in filteredRoomService" :key="service.id">
                    <b>- </b> {{service.name + " (" + currencyFormat(service.price) + ")"}}
                    <b-list-group horizontal>
                      <b-list-group-item @click="plusQuantityRoomService(service.id)">
                        <i class="fa fa-plus"/>
                      </b-list-group-item>
                      <b-list-group-item>
                        <span :id="'RoomService' + service.id">{{service.quantity}}</span>
                      </b-list-group-item>
                      <b-list-group-item @click="minusQuantityRoomService(service.id)">
                        <i class="fa fa-minus"/>
                      </b-list-group-item>
                    </b-list-group>
                  </p>
                </b-row>

                <b-row>
                  <b-col class="text-center">
                    <button class="btn btn-primary px-4 default-btn-bg" @click="addNewRoomService()">
                      Thêm &nbsp;
                    </button>
                  </b-col>
                </b-row>
              </b-tab>
          </b-tabs>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
           <p class="col-12" v-for="service in this.paymentInfo.service" :key="service.name">
             - <b>Loại</b>: <span v-if="service.type == 'service'">Dịch vụ</span><span v-if="service.type == 'surcharge'">Phụ thu</span><span v-if="service.type == 'roomService'">Dịch vụ có sẵn</span>, <b>Tên</b>: {{service.name}}, <span v-show="service.price"><b>Số tiền</b>: {{currencyFormat(service.price)}}vnđ</span>
              <i class="fa fa-trash" @click="deleteServiceTemp(service.type, service.name, service.price)"/>
           </p>
           <b-form-invalid-feedback
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col cols="6">
          <b-button variant="secondary" class="pull-left px-4" @click="cancelServiceFee()">
            Quay lại
          </b-button>
        </b-col>
        <b-col cols="6">
          <!-- Loading -->
          <span class="loading-more" v-show="loadingConfirmService"><icon name="loading" width="60" /></span>

          <button v-show="!isPayment && !loadingConfirmService" class="btn btn-primary pull-right px-4 default-btn-bg" @click="confirmServiceFee()">
            Xác nhận &nbsp;
          </button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal extend money -->
    <b-modal title="Loại tiền thanh toán" centered hide-footer id="modal-extend-money">
        <b-row>
          <b-col>
            Tổng tiền: {{currencyFormat(this.paymentInfo.total)}}
          </b-col>
        </b-row>

      <b-row>
        <b-col>
          <b-tabs content-class="mt-3">
              <b-tab title="Tiền mặt" active>
                <input
                  id="cash"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="11"
                  v-model="paymentInfo.cash"
                  @keyup="intergerOnly($event.target)">
              </b-tab>

              <b-tab title="Chuyển khoản">
                <div>
                  <input
                  id="credit"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="11"
                  v-model="paymentInfo.credit"
                  @keyup="intergerOnly($event.target)">
                </div>
              </b-tab>

              <b-tab title="Tiền điện tử">
                <input
                  id="e_money"
                  type="text"
                  autocomplete="new-password"
                  class="form-control"
                  maxlength="11"
                  v-model="paymentInfo.e_money"
                  @keyup="intergerOnly($event.target)">
              </b-tab>
          </b-tabs>
          <b-form-invalid-feedback  class="invalid-feedback" :state="!errorTotalMoney">
            Tổng số tiền nhập khác tổng tiển
          </b-form-invalid-feedback>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <p> - Tiền mặt: {{currencyFormat(paymentInfo.cash)}}</p>
          <p> - Chuyển khoản: {{currencyFormat(paymentInfo.credit)}}</p>
          <p> - Tiền điện tử: {{currencyFormat(paymentInfo.e_money)}}</p>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12">
          <!-- Loading -->
          <span class="loading-more" v-show="loadingConfirmMoneyType"><icon name="loading" width="60" /></span>

          <button
                  v-show="!isPayment && !loadingConfirmMoneyType"
                  class="btn btn-primary pull-right px-4 default-btn-bg"
                  @click="confirmExtendMoney()"
                  :disabled="parseInt(paymentInfo.total) != parseInt(paymentInfo.cash) + parseInt(paymentInfo.credit) + parseInt(paymentInfo.e_money)">
            Xác nhận &nbsp;
          </button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal calculate money refund -->
    <b-modal title="Tính tiền trả khách" centered hide-header hide-footer no-close-on-backdrop id="modal-calculate-money-refund" size="sm">
      <b-row>
        <b-col>
          <h5 class="text-center">Tính tiền thừa</h5>
        </b-col>
      </b-row>
      <hr>

      <b-row>
        <b-col>
          <p class="ml-5">- Số tiền phải trả: <b>{{currencyFormat(paymentInfo.total)}}</b> vnđ</p>
          <p class="ml-5">- Số tiền khách đưa:
            <input
            id="moneyReceive"
            v-model="paymentInfo.money_receive"
            type="text"
            class="form-control"
            maxlength="11"
            @keyup="calculateMoneyRefund">
          </p>
          <p class="ml-5">- Số tiền trả khách: <b>{{currencyFormat(paymentInfo.money_refunds)}}</b> vnđ</p>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col cols="6">
          <b-button variant="secondary" class="pull-left px-4" @click="cancelMoneyRefund()">
            Hủy
          </b-button>
        </b-col>
        <b-col cols="6">
          <!-- Loading -->
          <span class="loading-more" v-show="loadingCalMoneyRefund"><icon name="loading" width="60" /></span>

          <button v-show="!isPayment && !loadingCalMoneyRefund" class="btn btn-primary pull-right px-4 default-btn-bg" @click="confirmMoneyRefund()">
            Xác nhận &nbsp;
          </button>
        </b-col>
      </b-row>

    </b-modal>

    <!-- Modal confirm payment -->
    <b-modal centered hide-footer hide-header no-close-on-backdrop id="modal-confirm-payment">

      <b-row class="boder-bottom mb-2">
        <b-col md="12" class="text-center text-header">
          <h5>Thanh toán phòng: [{{this.paymentInfo.room_name}}]</h5>
        </b-col>
      </b-row>

      <b-row class="boder-top mt-3">
        <b-col cols="6">
          <b-button v-show="!loadingConfirmPayment" variant="secondary" class="pull-left px-4 btn-width-120" block @click="hideModalConfirmPayment">
            Hủy
          </b-button>
        </b-col>
        <b-col cols="6">
          <!-- Loading -->
          <span class="loading-more" v-show="loadingConfirmPayment"><icon name="loading" width="60" /></span>
          <button v-show="!loadingConfirmPayment" class="btn btn-primary btn-width-120 px-4 default-btn-bg pull-right" @click="confirmPayment">
            Xác nhận
          </button>
        </b-col>
      </b-row>
    </b-modal>


  </div>
</template>
<script>
import adminAPI from '@/api/admin'
import {Constant} from '@/common/constant'
import commonFunc from '@/common/commonFunc'
import Cookies from 'js-cookie'
import moment from 'moment'
import Datepicker from "vuejs-datetimepicker"
import EditSplitBillModal from "../../../components/EditSplitBillModal";


export default {
  components: {
    EditSplitBillModal,
    Datepicker
  },
  data () {
    return {
      tableId: null,
      storeId: null,
      paymentInfo: {},
      newActualCheckOut: null,
      pmtTemp: [],
      pmtApplying: [],
      serviceApplying: [],
      roomService: [],
      roomServiceFilter:"",
      isPayment: false,
      loading: false,
      loadingConfirmPmt: false,
      loadingConfirmService: false,
      loadingConfirmMoneyType: false,
      loadingCalMoneyRefund: false,
      pmtOfStore: [],
      serviceError: false,
      surchargeError: false,
      loadingConfirmPayment: false,
    }
  },
  computed: {
    filteredRoomService(){
      if (this.roomServiceFilter.trim().length===0) return this.roomService
      else {
        return this.roomService.filter(e => e.name.toLowerCase().includes(this.roomServiceFilter.toLowerCase()))
      }
    },
    formattedActualCheckIn: function (){
      return moment(this.paymentInfo.actual_check_in).format("HH:mm DD-MM-YYYY")
    },
    formattedActualCheckOut: function (){
      return moment(this.paymentInfo.actual_check_out).format("HH:mm DD-MM-YYYY")
    },
    errorTotalMoney: function () {
      return this.checkTotalMoney()
    },
    errorPayingMoney: function () {
      console.log(this.checkPayingMoney())
      return this.checkPayingMoney()
    },
    errorName () {
      return this.checkInfo(this.inputs.name)
    },
    errorPhone () {
      return this.checkPhoneNumber(this.inputs.phone_number)
    },
    errorGender () {
      return this.checkInfo(this.inputs.gender)
    },
    errorCity () {
      return this.checkInfo(this.inputs.city_id)
    },
    errorDistrict () {
      return this.checkInfo(this.inputs.district_id)
    },
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

    // Get option city
    // this.getOptionCity()
  },
  methods: {

    /**
     * Make toast without title
     */
    popToast(variant, content) {
      this.$bvToast.toast(content, {
        toastClass: 'my-toast',
        noCloseButton: true,
        variant: variant,
        autoHideDelay: 3000
      })
    },

    /**
     * Check total money
     */
    checkTotalMoney() {

      this.paymentInfo.total == this.paymentInfo.cash + this.paymentInfo.credit + this.paymentInfo.e_money
      return (this.clickConfirmExtend && this.paymentInfo.total == null)
    },
    checkPayingMoney() {
      return (this.clickConfirmPayingMoney && (this.paymentInfo.paying == null ))
    },
    /**
     * Check validate total money
     */
    checkValidateTotalMoney () {
      return !(this.errorTotalMoney)
    },
    checkValidatePayingMoney () {
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
      let paymentId = this.$route.params.id

      // Call api get payment info
      adminAPI.getPaymentInfo(paymentId).then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.paymentInfo = res.data.data
          this.paymentInfo.refund = 0
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Get pmt of store
     */
    getPmtOfStore() {
      // Call api get payment info
      adminAPI.getPmtOfStore().then(res => {
        if(res != null && res.data != null) {
          this.pmtOfStore = res.data.data
          this.pmtStoreOld = JSON.parse(JSON.stringify(this.pmtOfStore))
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },


    /**
     * Get in by id
     */
    getIndexByValue(valueInput, arrayInput) {
      let index = 0
      for(var i in arrayInput) {
        if(arrayInput[i] == valueInput) {
          return index
        }
        index += 1
      }
      return false
    },

    /**
     * Remove pmt code from list pmt code apllied
     */
    removeCodeFromListCodeAppiled(index) {
      let indexList = 0
      for (let i in this.pmtCodeApply) {
        if(this.pmtCodeApply[i].index == index) {
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
      for(let i in this.pmtTemp) {
        if(this.pmtTemp[i].id == id) {
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

      if(indexTemp !== false) {
        this.paymentInfo.pmts.splice(indexTemp, 1)
      }

      // Call api confirm payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.popToast('success', 'Lưu thông tin thành công')

        // Update new info
        this.paymentInfo = res.data.data
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      }).finally(() => {
        this.getPaymentInfo()
      })
    },

    /**
     * Remove service
     */
    deleteService(name, price) {
      // Remove service
      for(let i in this.paymentInfo.service) {
        if(this.paymentInfo.service[i].name == name && this.paymentInfo.service[i].price == price) {
          this.paymentInfo.service.splice(i, 1)
          break
        }
      }

      // Call api confirm payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.popToast('success', 'Lưu thông tin thành công')
        this.getPaymentInfo()
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Show modal add customer
     */
    showModalEditActualCheckOut() {
      this.newActualCheckOut = moment().format("DD-MM-YYYY HH:mm:ss");
      this.$bvModal.show('modal-edit-actual-checkout')
    },

    /**
     * Show modal add customer
     */
    showModalAddCustomer() {
      this.$bvModal.show('modal-add-customer')
    },

    /**
     * Show modal apply pmt
     */
    showModalApplyPmt() {
      this.pmtTemp = JSON.parse(JSON.stringify(this.paymentInfo.pmts))

      this.$bvModal.show('modal-apply-pmt')


      setTimeout(this.updatePmtAllyToModal, 1000)
    },

      updatePmtAllyToModal() {
        if(this.pmtTemp.length > 0 && this.pmtOfStore.length > 0) {
            for(let itemTemp of this.pmtTemp) {
                for(let itemStore of this.pmtOfStore) {
                    if(itemTemp.id == itemStore.id) {
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
      this.$bvModal.show('modal-calculate-money-refund')
    },

    /**
     * Show modal service fee
     */
    showModalServiceFee() {
      this.getRoomService();
      this.$bvModal.show('modal-service-fee')
    },

    /**
     * Show modal extend money
     */
    showModalExtendMoney() {
      this.$bvModal.show('modal-extend-money')
    },
    showModalPayingMoney() {
      this.$bvModal.show('modal-paying-money')
    },

    /**
     * Go to table list
     */
    goBack() {
      this.$router.push('/booking/list-room')
    },

      /**
     * Show modal confirm payment
     */
    showModalConfirmPayment() {
      this.$bvModal.show('modal-confirm-payment')
    },

      /**
     * Hide modal confirm payment
     */
    hideModalConfirmPayment() {
      this.$bvModal.hide('modal-confirm-payment')
    },

    /**
     * Confirm payment
     */
    confirmPayment() {
        this.loadingConfirmPayment = true

      // Call api confirm payment
      adminAPI.confirmPaymentBooking(this.paymentInfo).then(res => {
        if(res != null && res.data != null) {
            this.loadingConfirmPayment = false
          this.$router.push('/booking/list-room')
        }
      }).catch(err => {
          this.loadingConfirmPayment = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Currency format
     */
    currencyFormat(num) {
      let result = num
      if(num) {
        result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }

      return result
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
     * Mapping system config
     */
    mappingSystemConfig(settings) {
      for (var index in settings) {

        // Setting is quantity pmt
        if(settings[index].fields.code == Constant.QUANTITY_PMT) {
          this.quantityPmt = settings[index].fields.value
        }

        // Setting is quantity discount
        if(settings[index].fields.code == Constant.QUANTITY_DISCOUNT) {
          this.quantityDiscount = settings[index].fields.value
        }

        // Setting is quantity voucher
        if(settings[index].fields.code == Constant.QUANTITY_VOUCHER) {
          this.quantityVoucher = settings[index].fields.value
        }

        // Setting is quantity free item
        if(settings[index].fields.code == Constant.QUANTITY_FREE_ITEM) {
          this.quantityFreeItem = settings[index].fields.value
        }

        // Setting is waiter payment
        // let user = Cookies.get(Constant.APP_USR)
        // if(user) {
        //   user = JSON.parse(user)
        //   if(user.role == Constant.ROLE_STAFF) {
        //     // If user is waiter, check store setting
        //     if(settings[index].fields.code == Constant.IS_WAITER_PAY) {
        //       this.isWaiterPay = settings[index].fields.value
        //     }
        //   }
        // }

      }
    },

    /**
     * Get system config
     */
    getSystemConfig () {
      adminAPI.getSystemConfig().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.mappingSystemConfig(res.data.data)
        }
      }).catch(err => {
        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },


    /**
     * Confirm apply promotion
     */
    confirmApplyPmt () {
      this.loadingConfirmPmt = true

      // Call api confirm update payment
      this.paymentInfo.pmts = JSON.parse(JSON.stringify(this.pmtTemp))
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        if(res != null && res.data != null) {
          this.popToast('success', 'Lưu thông tin thành công')
          this.$bvModal.hide('modal-apply-pmt')

          this.loadingConfirmPmt = false
          this.getPaymentInfo()
        }
      }).catch(err => {
        this.loadingConfirmPmt = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

    /**
     * Check add pmt
     */
    checkAddPromotion() {
      if(this.quantityPmt == 1) {
        this.popToast('danger', 'Chỉ có thể áp dụng một khuyến mãi trên một hóa đơn, chỉnh sửa cài đặt để áp dụng nhiều khuyến mãi hơn')
      } else {
        this.numberOfPmtRow += 1
      }
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
      if(parseInt(currentNumber) > 0) {
        document.getElementById(id).textContent = parseInt(currentNumber) - 1
      }
    },

    /**
     * Check system config pmt
     */
    // checkSystemConfigPmt(nextIndex, type) {
    //   if(this.quantityPmt == 1 && this.pmtApplying.length >= this.quantityPmt) {
    //     this.popToast('danger', 'Chỉ có thể áp dụng một khuyến mãi trên một hóa đơn, chỉnh sửa cài đặt để áp dụng nhiều khuyến mãi hơn')
    //     return false
    //   }
    //
    //   if((type == 'discount' || type == 'discount_with_max_value') && this.quantityDiscount == 1 && nextIndex > this.quantityDiscount) {
    //     this.popToast('danger', 'Chỉ có thể áp dụng một discount trên một hóa đơn, chỉnh sửa cài đặt để áp dụng nhiều discount hơn')
    //     return false
    //   }
    //
    //   if(type == 'voucher' && this.quantityVoucher == 1 && nextIndex > this.quantityVoucher) {
    //     this.popToast('danger', 'Chỉ có thể áp dụng một voucher trên một hóa đơn, chỉnh sửa cài đặt để áp dụng nhiều voucher hơn')
    //     return false
    //   }
    //
    //   if(type == 'free_item' && this.quantityFreeItem == 1 && nextIndex > this.quantityFreeItem) {
    //     this.popToast('danger', 'Chỉ có thể áp dụng một free item trên một hóa đơn, chỉnh sửa cài đặt để áp dụng nhiều free item hơn')
    //     return false
    //   }
    //
    //   return true
    //
    // },

    /**
     * Get index by id
     */
    getIndexById(pmtId) {
      let index = 0
      for(var i in this.paymentInfo.pmts) {
        if(this.paymentInfo.pmts[i].id == pmtId) {
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
      // // Add pmt to pmt list
      // let flagCheckExist = false
      // for (let i = 0; i < this.paymentInfo.pmts.length; i++) {
      //   if(parseInt(this.paymentInfo.pmts[i].id) === parseInt(pmtInfo.id)) {
      //     this.paymentInfo.pmts[index].quantity_apply = parseInt(this.paymentInfo.pmts[i].quantity_apply) + 1
      //     flagCheckExist = true
      //     break
      //   }
      // }
      //
      // if(!flagCheckExist) {
      //   // let pmtTemp = {
      //   //   "id": pmtInfo.id,
      //   //   "name": pmtInfo.name,
      //   //   "pmt_quantity": 1
      //   // }
      //   let pmtTemp = pmtInfo
      //   pmtTemp.quantity_apply = 1
      //   this.paymentInfo.pmts.push(pmtTemp)
      // }

      // Add pmt to temp list
      let flagCheckExistTemp = false
      for (let i = 0; i < this.pmtTemp.length; i++) {
        if(parseInt(this.pmtTemp[i].id) === parseInt(pmtInfo.id)) {
          this.pmtTemp[i].quantity_apply = parseInt(this.pmtTemp[i].quantity_apply) + 1
          flagCheckExistTemp = true
          break
        }
      }

      if(!flagCheckExistTemp) {
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
        if(parseInt(this.paymentInfo.pmts[index].id) === parseInt(pmtId)) {
          result = parseInt(this.paymentInfo.pmts[index].pmt_quantity)
        }
      }
      return result
    },

    /**
     * Plus quantity pmt of store
     */
    plusQuantityPmt(pmtId, type, remaining, pmtInfo) {

      // let nextIndex = parseInt(document.getElementById(elementId).textContent) + 1

      // Check system config
      let currentQuantity = this.getQuantityOfPmtApplyingById(pmtId)
      // if(!this.checkSystemConfigPmt(nextIndex, type)) {
      //   return
      // }

      // Check remaining of pmt
      if(currentQuantity == parseInt(remaining)) {
        this.popToast('danger', 'Vượt quá số lượng còn lại của khuyến mãi')
        return
      }

      // Plus quantity
      let elementId = 'pmtStore' + pmtId
      this.plusOne(elementId)

      // Add pmt to list
      this.addPmtToList(pmtInfo)
      //   for(let itemTemp of this.pmtTemp) {
      //       if(itemTemp.id == pmtId) {
      //           itemTemp.quantity_apply += 1
      //       }
      //   }

    },

    /**
     * Minus quantity pmt of store
     */
    minusQuantityPmt(pmtId, pmtInfo) {
      let elementId = 'pmtStore' + pmtId

      let currentNumber = parseInt(document.getElementById(elementId).textContent)
      if(currentNumber > 0) {
        let nextIndex = currentNumber - 1
        document.getElementById(elementId).textContent = nextIndex

        // Minus pmt in list
        // this.addPmtToList(pmtId, nextIndex, pmtInfo)

          if(nextIndex == 0) {
              this.deletePromotionTemp(pmtId)
          } else {
              for(let itemTemp of this.pmtTemp) {
                  if(itemTemp.id == pmtId) {
                      itemTemp.quantity_apply = nextIndex
                  }
              }
          }
      }
    },

    /**
     * Calculated free item
     */
    calculatedFreeItem() {
      let totalDiscount = 0
      for (let i in this.pmtApplying) {
        if(this.pmtApplying[i].type == 'free_item') {
          for (let j in this.paymentInfo.foods) {
            if(this.pmtApplying[i].item_free == this.paymentInfo.foods[j].foodId) {
              this.paymentInfo.total = this.paymentInfo.total - (this.paymentInfo.foods[j].price * this.pmtApplying[i].quantity_apply)
              totalDiscount += this.paymentInfo.foods[j].price * this.pmtApplying[i].quantity_apply
            }
          }
        }
      }

      return totalDiscount
    },

    /**
     * Calculated discount
     */
    calculatedDiscount() {
      let totalDiscount = 0
      let totalDiscountPercent = 0
      for (var i in this.pmtApplying) {
        if(this.pmtApplying[i].type == 'discount') {
          totalDiscountPercent += this.pmtApplying[i].discount_percent * this.pmtApplying[i].quantity_apply
        }
      }
      if(totalDiscountPercent > 0) {
        if(totalDiscountPercent > 100) {
          totalDiscountPercent = 100
        }
        // Discount
        totalDiscount = this.paymentInfo.total * totalDiscountPercent / 100
        this.paymentInfo.total = this.paymentInfo.total - totalDiscount
      }

      return totalDiscount
    },

    /**
     * Calculated discount with max value
     */
    calculatedDiscountWithMaxValue() {
      let totalDiscount = 0
      let totalDiscountPercent = 0
      let totalDiscountAmount = 0

      for (var i in this.pmtApplying) {
        // Discount with max value
        if(this.pmtApplying[i].type == 'discount_with_max_value') {
          if(this.paymentInfo.sub_total >= this.pmtApplying[i].discount_on_amount) {
            let discountAmount = this.paymentInfo.sub_total * this.pmtApplying[i].discount_percent / 100
            if(discountAmount >= this.pmtApplying[i].max_discount) {
              totalDiscountAmount += this.pmtApplying[i].max_discount * this.pmtApplying[i].quantity_apply
            } else {
              totalDiscountPercent += this.pmtApplying[i].discount_percent * this.pmtApplying[i].quantity_apply
            }

          }
        }
      }

      // Discount
      if(totalDiscountPercent > 0) {
        if(totalDiscountPercent > 100) {
          totalDiscountPercent = 100
        }
        this.paymentInfo.total = this.paymentInfo.total * totalDiscountPercent / 100
        totalDiscount += this.paymentInfo.total * totalDiscountPercent / 100
      }

      if(totalDiscountAmount > 0) {
        this.paymentInfo.total = this.paymentInfo.total - totalDiscountAmount
        totalDiscount += totalDiscountAmount
      }

      return totalDiscount
    },

    /**
     * Calculated voucher
     */
    calculatedVoucher() {
      let totalDiscount = 0

      for (var i in this.pmtApplying) {
        // Voucher
        if(this.pmtApplying[i].type == 'voucher') {
          this.paymentInfo.total = this.paymentInfo.total - ( this.pmtApplying[i].value_of_voucher * this.pmtApplying[i].quantity_apply)
          totalDiscount += this.pmtApplying[i].value_of_voucher * this.pmtApplying[i].quantity_apply
        }
      }

      return totalDiscount
    },

    /**
     * Calculated VAT value
     */
    calculatedVatValue(total, vatValue, vatPercent) {
      let result = 0
      if(vatPercent != 0) {
        result = parseInt(parseInt(total) * parseInt(vatPercent) / 100)
      }
      return result
    },

    /**
     * Calculated payment info
     */
    calculatedPaymentInfo() {
      this.paymentInfo.total = this.oldInfoStorate.sub_total

      let totalDiscount = 0
      // Check free Item
      totalDiscount += this.calculatedFreeItem()

      // Check discount
      totalDiscount += this.calculatedDiscount()

      // Check discount with max value
      totalDiscount += this.calculatedDiscountWithMaxValue()

      // Check voucher
      totalDiscount += this.calculatedVoucher()

      if(this.paymentInfo.total < 0) {
        this.paymentInfo.total = 0
      }

      // Calculator VAT
      this.paymentInfo.vat_value = this.calculatedVatValue(this.paymentInfo.total, this.paymentInfo.vat_value, this.paymentInfo.vat_percent)
      this.paymentInfo.total = this.paymentInfo.total + this.paymentInfo.vat_value

      // Calculated service fee
      this.calculatedServiceFee()

      // Calculated total discount amount
      if(totalDiscount > this.paymentInfo.sub_total + this.paymentInfo.vat_value) {
        totalDiscount = this.paymentInfo.sub_total + this.paymentInfo.vat_value
      }
      this.paymentInfo.discount_amount = totalDiscount

      // Set money type
      this.changeDefaultMoneyType()
    },

    /**
     * Calculated service fee
     */
    calculatedServiceFee() {
      for(let i in this.paymentInfo.service) {
        this.paymentInfo.total += parseInt(this.paymentInfo.service[i].price)
      }
    },

    /**
     * Confirm service fee
     */
    confirmServiceFee() {
      this.clickConfirmExtend = true
      this.loadingConfirmService = true

      // Call api confirm payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.popToast('success', 'Lưu thông tin thành công')
        this.$bvModal.hide('modal-service-fee')

        this.loadingConfirmService = false
        this.getPaymentInfo();
      }).catch(err => {
        this.loadingConfirmService = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })

    },

    /**
     * Apply VAT
     */
    applyVat() {
        if (!this.paymentInfo.apply_vat) {
            this.paymentInfo.vat_value = 0
            this.paymentInfo.vat_percent = 0
        } else {
            if(this.paymentInfo.vat_percent == 0) {
                this.paymentInfo.vat_percent = 10
            }
        }
      // Call api confirm payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.popToast('success', 'Lưu thông tin thành công')
        this.$bvModal.hide('modal-extend-money')

        this.loadingConfirmMoneyType = false
      }).catch(err => {
        this.loadingConfirmMoneyType = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      }).finally(()=>{
        this.getPaymentInfo();
      })

    },

    /**
     * Confirm extend money
     */
    confirmExtendMoney() {
      this.clickConfirmExtend = true
      this.loadingConfirmMoneyType = true

      let result = this.checkValidateTotalMoney()
      if (result) {

        // Call api confirm payment
        adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
          this.popToast('success', 'Lưu thông tin thành công')
          this.$bvModal.hide('modal-extend-money')

          this.loadingConfirmMoneyType = false
          this.getPaymentInfo();
        }).catch(err => {
          this.loadingConfirmMoneyType = false

          // Handle error
          let errorMess = commonFunc.handleStaffError(err)
          this.popToast('danger', errorMess)
        })

      }
    },

    /**
     * Print bill
     */
    printBill() {
      Cookies.set("printFrom", "payment")
      this.$router.push('/print-bill/' + this.paymentInfo.id)
    },

    /**
     * Get id of auto pmt
     */
    getIdAutoPmt() {
      for(let i in this.pmtApplying) {
        if(this.pmtApplying[i].method == "auto") {
          return this.pmtApplying[i].id
        }
      }
      return null
    },

    /**
     * Add new service fee
     */
    addNewService() {
      let type = "service"
      let name = document.getElementById("serviceName").value
      let price = document.getElementById("servicePrice").value

      if(!name || !price) {
        this.serviceError = true
        return
      } else {
        this.serviceError = false
      }

      let service = {
        "type": type,
        "quantity": 1,
        "name": name,
        "price": price
      }
      this.paymentInfo.service.push(service)

      document.getElementById("serviceName").value = ""
      document.getElementById("servicePrice").value = ""

      // Calculated service fee
      //this.calculatedTotalServiceFee()
    },

    /**
     * Calculate service fee
     */
    // calculatedTotalServiceFee() {
    //   this.serviceFee = 0
    //   for(let index in this.paymentInfo.service) {
    //     this.serviceFee += parseInt(this.paymentInfo.service[index].price)
    //   }
    // },

    /**
     * Add new surcharge
     */
    addNewSurcharge() {
      let type = "surcharge"
      let name = document.getElementById("surchargeName").value
      let price = document.getElementById("surchargePrice").value

      if(!name || !price) {
        this.surchargeError = true
        return
      } else {
        this.surchargeError = false
      }

      let service = {
        "type": type,
        "quantity": 1,
        "name": name,
        "price": price
      }
      this.paymentInfo.service.push(service)

      document.getElementById("surchargeName").value = ""
      document.getElementById("surchargePrice").value = ""

      // Calculated service fee
      // this.calculatedTotalServiceFee()
    },

    /**
     * Delete service
     */
    deleteServiceTemp(type, name, price) {
      let index = 0
      for (let i in this.paymentInfo.service) {
        if(this.paymentInfo.service[i].type == type && this.paymentInfo.service[i].name == name && this.paymentInfo.service[i].price == price) {
          this.paymentInfo.service.splice(index, 1)
        }
        index += 1
      }
    },

    /**
     * Hide modal service fee
     */
    hideModalServiceFee() {
      this.serviceError = false
      this.surchargeError = false

      // Calculated payment info
      this.calculatedPaymentInfo()
    },

    /**
     * Cancel service fee
     */
    cancelServiceFee() {
      this.$bvModal.hide('modal-service-fee')
    },

     /**
     * Get room services
     */
    getRoomService() {
      this.loading = true
      adminAPI.getRoomService().then(res => {
        if(res != null && res.data != null && res.data.data != null) {
          this.roomService = res.data.data.map(e => {return {...e,quantity:0}})
        }
        this.loading = false
      }).catch(err => {
        this.loading = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },
    plusQuantityRoomService(id){
      let index = this.roomService.findIndex(e => e.id == id)
      this.roomService[index].quantity++
    },
    minusQuantityRoomService(id){
      let index = this.roomService.findIndex(e => e.id == id)
      if (this.roomService[index].quantity === 0) return;
      this.roomService[index].quantity--
    },
    addNewRoomService(){
      const newRoomService = this.roomService.filter(e=>e.quantity!=0);
      for (const item of newRoomService){
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
      });
    },


    /**
     * Format date
     */
    formatDate(dateInput) {
      let result = dateInput
      if(dateInput) {
        let temp = dateInput.split("-")
        if(temp.length == 1) {
          temp = dateInput.split("/")
        }
        result = temp[2] + "-" + temp[1] + "-" + temp[0]
      }
      return result
    },

    /**
     * Cancel apply promotion
     */
    cancelApplyPmt () {
      // Remove pmt from list
      // for(let i in this.pmtTemp) {
      //   for(let j in this.paymentInfo.pmts) {
      //     if(this.pmtTemp[i].id == this.paymentInfo.pmts[j].id) {
      //       this.paymentInfo.pmts[j].pmt_quantity = parseInt(this.paymentInfo.pmts[j].pmt_quantity) - parseInt(this.pmtTemp[i].pmt_quantity)
      //       if(this.paymentInfo.pmts[j].pmt_quantity == 0) {
      //         this.paymentInfo.pmts.splice(j, 1)
      //       }
      //     }
      //   }
      // }
      this.pmtTemp = []

      this.$bvModal.hide('modal-apply-pmt')
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
      this.$bvModal.hide('modal-calculate-money-refund')
    },

    /**
     * Cancel modal edit actual check out
     */
    cancelEditActualCheckOut() {
        this.$bvModal.hide('modal-edit-actual-checkout')
    },
    /**
     * Confirm money refund
     */
    confirmEditActualCheckOut(){
      if (this.$refs.editActualCheckOut.date) {
        this.$bvModal.hide('modal-edit-actual-checkout');
        this.paymentInfo.actual_check_out = moment(this.$refs.editActualCheckOut.date, "DD-MM-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

        adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
          this.popToast('success', 'Lưu thông tin thành công');
          this.getPaymentInfo();
        }).catch(err => {
          let errorMess = commonFunc.handleStaffError(err);
          this.popToast('danger', errorMess);
        });
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

      if(dataPost.money_receive == "") {
        dataPost.money_receive = 0
      }
      if(dataPost.money_refunds == "") {
        dataPost.money_refunds = 0
      }

      // Call api confirm payment
      adminAPI.saveMoneyRefund(dataPost).then(res => {
        this.popToast('success', 'Lưu thông tin thành công')

        this.$bvModal.hide('modal-calculate-money-refund')

        this.loadingCalMoneyRefund = false
      }).catch(err => {
        this.loadingCalMoneyRefund = false

        // Handle error
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },
    showModalSplitBill(event,id){
      this.$bvModal.show("payment-split-bill"+id)
    },
    confirmEditSplitBill(index,newAmount) {
      this.paymentInfo.payment_split_times[index].amount = newAmount

      // Call api update payment
      adminAPI.updatePaymentInfo(this.paymentInfo).then(res => {
        this.popToast('success', 'Lưu thông tin thành công');
        this.$bvModal.hide('modal-service-fee');
        this.loadingConfirmService = false;
        this.getPaymentInfo();
      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })

    },

      /**
       * Cập nhật ghi chú
       */
    updateNote() {
        let params = {
            'payment_id': this.paymentInfo.id,
            'note': this.paymentInfo.note
        }

      // Call api update payment note
      adminAPI.updatePaymentNote(params).then(res => {
          if(res != null && res.data != null) {
              this.popToast('success', 'Cập nhật ghi chú thành công');
          }

      }).catch(err => {
        let errorMess = commonFunc.handleStaffError(err)
        this.popToast('danger', errorMess)
      })
    },

      integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },
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

  table {
   margin: auto;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    width: fit-content;
    max-width: 100%;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
  }

  td, th {
    border: solid rgb(200, 200, 200) 1px;
    padding: .5rem;
  }

  th {
    text-align: left;
    background-color: rgb(190, 220, 250);
    text-transform: uppercase;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: rgb(50, 50, 100) solid 2px;
    border-top: none;
  }

  td {
    white-space: nowrap;
    border-bottom: none;
    color: rgb(20, 20, 20);
  }

  td:first-of-type, th:first-of-type {
    border-left: none;
  }

  td:last-of-type, th:last-of-type {
    border-right: none;
  }
</style>
