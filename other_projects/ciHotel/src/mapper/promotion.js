import commonFunc from '@/common/commonFunc'
export default {
    // mapPromoModelToDto (promotions, offset) {
    //   let result = []
    //
    //  var stt = offset
    //   for (var index in promotions) {
    //     stt = stt + 1
    //
    //     let cost = promotions[index].fields.cost
    //     if(cost) {
    //       cost = commonFunc.currencyFormat(cost)
    //     }
    //
    //     // let method = promotions[index].fields.method
    //     // if(method == 'trade_point') {
    //     //   method = "Đổi điểm"
    //     // }
    //     // if(method == 'other') {
    //     //   method = "Khác"
    //     // }
    //
    //     let promoTemp = {
    //       stt: stt
    //       , code: promotions[index].fields.code
    //       , name: promotions[index].fields.name
    //       , price: cost
    //       , method: promotions[index].fields.method
    //       , type: promotions[index].fields.type
    //       , discount_percent: promotions[index].fields.discount_percent
    //       , max_discount: promotions[index].fields.max_discount
    //       , discount_on_amount: promotions[index].fields.discount_on_amount
    //       , value_of_voucher: promotions[index].fields.value_of_voucher
    //       , item_free: promotions[index].fields.item_free
    //       , quantity: promotions[index].fields.quantity
    //       , remaining: promotions[index].fields.remaining
    //       , expiredFrom: promotions[index].fields.expired_date_from
    //       , expiredTo: promotions[index].fields.expired_date_to
    //       , id: promotions[index].pk
    //     }
    //     result.push(promoTemp)
    //   }
    //   return result
    // },
    mapPromoCustomerModelToOwnerDto (promotions) {
      let result = []

      var stt = 0
      for (var index in promotions) {
        stt = stt + 1

        let promoTemp = {
          stt: stt,
          storeName: promotions[index].fields.store_name,
          name: promotions[index].fields.name,
          expiredFrom: promotions[index].fields.expired_date_from,
          expiredTo: promotions[index].fields.expired_date_to,
          id: promotions[index].pk,
          idString: commonFunc.formatId(promotions[index].pk, 8),
          action: promotions[index].pk
        }
        result.push(promoTemp)
      }
      return result
    },
    mapPromoCustomerModelToDto (promotions) {
      let result = []
  
      var stt = 0
      for (var index in promotions) {
        stt = stt + 1
  
        let promoTemp = {
          stt: stt,
          storeName: promotions[index].fields.store_name,
          name: promotions[index].fields.name,
          expiredate: promotions[index].fields.expired_at,
          id: promotions[index].pk,
          idString: commonFunc.formatId(promotions[index].pk, 8)
        }
        result.push(promoTemp)
      }
      return result
    },
    mapPromoSearchModelToDto (promotions, offset) {
        let result = []

        var stt = offset
        for (var index in promotions) {
          stt = stt + 1

          let promoTemp = {
            stt: stt,
            name: promotions[index].fields.name,
            storeName: promotions[index].fields.store_name,
            cityName: promotions[index].fields.city_name,
            districtName: promotions[index].fields.district_name,
            price: commonFunc.currencyFormat(promotions[index].fields.price),
            quantity: promotions[index].fields.quantity,
            expiredFrom: promotions[index].fields.expired_date_from,
            expiredTo: promotions[index].fields.expired_date_to,
            id: promotions[index].pk,
            action: promotions[index].pk
          }
          result.push(promoTemp)
        }
        return result
    },
    mapPromoCusDetailModelToDto (promotion) {
        return {
          "id": promotion.pk,
          "name": promotion.fields.name,
          "storeId": promotion.fields.store_id,
          "storeName": promotion.fields.store_name,
          "expiredFrom": promotion.fields.expired_date_from,
          "expiredTo": promotion.fields.expired_date_to,
          "idString": commonFunc.formatId(promotion.pk, 8)
        }
    },
    mapPromoOptionModelToDto (promotions) {
      let result = []

      for (var index in promotions) {
        let promoTemp = {
          id: promotions[index].pk,
          name: promotions[index].fields.name,
        }
        result.push(promoTemp)
      }
      return result
    },
  }
