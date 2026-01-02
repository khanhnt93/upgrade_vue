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

      // Customer login check
      let clc = {
            "id": null,
            "code": Constant.IS_CUS_LOGIN,
            "value": false,
          }
      setting.cusLogin = clc

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

        // Setting is require customer login
        if(settings[index].fields.code == Constant.IS_CUS_LOGIN) {
          let clc = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.cusLogin = clc
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
      }

      return setting

    },
    mapSysCfgModelToDtoHotel (settings) {
      let setting = {}
      let sd = {
        "id": null,
        "code": Constant.TIME_IN,
        "value": "12:00",
      }
      setting.startDate = sd
      let ed = {
        "id": null,
        "code": Constant.TIME_OUT,
        "value": "14:00",
      }
      setting.endDate = ed

      let hund = {
        "id": null,
        "code": Constant.HOURS_UNTIL_NEW_DATE,
        "value": "2"
      }
      setting.hoursUntilNewDate = hund

      let munh = {
        "id": null,
        "code": Constant.MINUTES_UNTIL_NEW_HOUR,
        "value": "15"
      }
      setting.minutesUntilNewHour = munh

      // Auto close store
      let auto_update_room = {
        "id": null,
        "code": Constant.AUTO_UPDATE_ROOM,
        "value": false,
      }
      setting.auto_update_room = auto_update_room

      for (var index in settings) {
        if (settings[index].fields.code == Constant.TIME_IN) {
          let qfi = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.startDate = qfi
        }
        if (settings[index].fields.code == Constant.TIME_OUT) {
          let qfi = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.endDate = qfi
        }

        if (settings[index].fields.code == Constant.HOURS_UNTIL_NEW_DATE) {
          let qfi = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.hoursUntilNewDate = qfi
        }

        if (settings[index].fields.code == Constant.MINUTES_UNTIL_NEW_HOUR) {
            let qfi = {
                "id": settings[index].pk.toString(),
                "code": settings[index].fields.code,
                "value": settings[index].fields.value,
            }
            setting.minutesUntilNewHour = qfi
        }

        // Setting is auto close
        if(settings[index].fields.code == Constant.AUTO_UPDATE_ROOM) {
          let at = {
            "id": settings[index].pk.toString(),
            "code": settings[index].fields.code,
            "value": settings[index].fields.value,
          }
          setting.auto_update_room = at
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
