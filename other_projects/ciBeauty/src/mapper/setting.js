import {Constant} from '@/common/constant'

export default {
    mapSysCfgModelToDto (settings) {
      let setting = {}
      // Set default value
      // Expire point
      // let ep = {
      //       "id": null,
      //       "code": Constant.EXPIRE_POINT,
      //       "value": "30",
      // }
      // setting.pmtExpire = ep

      // QR code
      let qr_code = {
        "id": null,
        "code": 'is_print_qr_code',
        "value": true,
      }
      setting.qr_code = qr_code

      // VAT
      let iiv = {
            "id": null,
            "code": Constant.IS_INCLUDE_VAT,
            "value": false,
          }
      setting.vat = iiv

      // Waiter payment
      let iwp = {
            "id": null,
            "code": Constant.IS_WAITER_PAY,
            "value": false,
          }
      setting.is_waiter_pay = iwp

      // Kitchen printer
      let use_reponsetory = {
            "id": null,
            "code": Constant.USE_REPONSETORY,
            "value": false,
          }
      setting.use_reponsetory = use_reponsetory

      // Auto close store
      let auto_close = {
        "id": null,
        "code": Constant.AUTO_CLOSE,
        "value": false,
      }
      setting.auto_close = auto_close

      // Customer login check
      let clc = {
            "id": null,
            "code": Constant.IS_CUS_LOGIN,
            "value": false,
          }
      setting.cusLogin = clc

      // Edit price
      let editPrice = {
            "id": null,
            "code": Constant.IS_SHOW_EDIT_PRICE,
            "value": true,
          }
      setting.editPrice = editPrice

      // Quantity pmt
      let qp = {
            "id": null,
            "code": Constant.QUANTITY_PMT,
            "value": 1,
          }
      setting.quantityPmt = qp

      // Quantity discount
      let qd = {
            "id": null,
            "code": Constant.QUANTITY_DISCOUNT,
            "value": 1,
          }
      setting.quantityDiscount = qd

      // Quantity voucher
      let qv = {
            "id": null,
            "code": Constant.QUANTITY_VOUCHER,
            "value": 1,
          }
      setting.quantityVoucher = qv

      // Quantity free item
      let qfi = {
            "id": null,
            "code": Constant.QUANTITY_FREE_ITEM,
            "value": 1,
          }
      setting.quantityFreeItem = qfi

      let wsh = {
        "id": null,
        "code": Constant.WORK_START_HOUR,
        "value": "",
      }
      setting.workStartHour = wsh

      let weh = {
        "id": null,
        "code": Constant.WORK_END_HOUR,
        "value": "",
      }
      setting.workEndHour = weh


      for (var index in settings) {
        // Setting expire point
        // if(settings[index].fields.code == Constant.EXPIRE_POINT) {
        //   let ep = {
        //     "id": settings[index].pk.toString(),
        //     "code": settings[index].fields.code,
        //     "value": settings[index].fields.value,
        //   }
        //   setting.pmtExpire = ep
        // }

        // Setting is include vat
        if(settings[index].fields.code == 'is_print_qr_code') {
          let qr_code_db = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.qr_code = qr_code_db
        }

        // Setting is include vat
        if(settings[index].fields.code == Constant.IS_INCLUDE_VAT) {
          let iiv = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.vat = iiv
        }

        // Setting is waiter payment
        if(settings[index].fields.code == Constant.IS_WAITER_PAY) {
          let iwp = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.is_waiter_pay = iwp
        }

        // Setting is kitchen printer
        if(settings[index].fields.code == Constant.USE_REPONSETORY) {
          let kp = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.use_reponsetory = kp
        }

        // Setting is auto close
        if(settings[index].fields.code == Constant.AUTO_CLOSE) {
          let at = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.auto_close = at
        }

        // Setting is require customer login
        if(settings[index].fields.code == Constant.IS_CUS_LOGIN) {
          let clc = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.cusLogin = clc
        }

        // Setting is require customer login
        if(settings[index].fields.code == Constant.IS_SHOW_EDIT_PRICE) {
          let editPrice = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.editPrice = editPrice
        }

        // Setting is quantity pmt
        if(settings[index].fields.code == Constant.QUANTITY_PMT) {
          let qp = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.quantityPmt = qp
        }

        // Setting is quantity discount
        if(settings[index].fields.code == Constant.QUANTITY_DISCOUNT) {
          let qd = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.quantityDiscount = qd
        }

        // Setting is quantity voucher
        if(settings[index].fields.code == Constant.QUANTITY_VOUCHER) {
          let qv = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.quantityVoucher = qv
        }

        // Setting is quantity free item
        if(settings[index].fields.code == Constant.QUANTITY_FREE_ITEM) {
          let qfi = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.quantityFreeItem = qfi
        }

        // work start hour & work end hour
        if(settings[index].fields.code == Constant.WORK_START_HOUR) {
          let wsh = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.workStartHour = wsh
        }

        if(settings[index].fields.code == Constant.WORK_END_HOUR) {
          let weh = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.workEndHour = weh
        }

      }

      return setting

    },

    mapMemberConfigModelToDto (settings) {
      let setting = {}
      // Set default value
      // Expire point
      let ep = {
            "id": null,
            "code": Constant.EXPIRE_POINT,
            "value": "30",
      }
      setting.pmtExpire = ep

      // Discount by money
      let discountByMoney = {
            "id": null,
            "code": "discount_by_money",
            "value": false,
          }
      setting.discountByMoney = discountByMoney

      let listDiscount = []

      for (var index in settings) {
        // Setting expire point
        if(settings[index].code == Constant.EXPIRE_POINT) {
          let ep = {
            "id": settings[index].id.toString(),
            "code": settings[index].code,
            "value": settings[index].value,
          }
          setting.pmtExpire = ep
        }

        // Setting is discount by money
        if(settings[index].code == "discount_by_money") {
          let discountByMoney = {
            "id": settings[index].id.toString(),
            "code": settings[index].code,
            "value": settings[index].value,
          }
          setting.discountByMoney = discountByMoney
        }

        // Setting is list discount
        if(settings[index].group == "list_discount") {
          let discount = {
            "id": settings[index].id.toString(),
            "code": parseInt(settings[index].code),
            "value": parseFloat(settings[index].value),
            "group": "list_discount",
          }
          listDiscount.push(discount)
        }

      }
      setting.listDiscount = listDiscount

      return setting

    }
}
