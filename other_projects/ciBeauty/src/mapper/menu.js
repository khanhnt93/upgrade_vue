import commonFunc from "../common/commonFunc";

export default {

  /**
   * Mapping menu model to dto
   */
  mapMenuModelToDto(menus, offset) {
    let result = []

    var stt = offset
    for (var index in menus) {
      stt = stt + 1

      var active = "Còn dv"
      if(!menus[index].fields.status) {
        active = "Hết dv"
      }

      let menuTemp = {
        stt: stt
        , name: menus[index].fields.name
        , price: menus[index].fields.price
        , status: active
        , group: menus[index].fields.group
        , action: menus[index].pk
      }
      result.push(menuTemp)
    }
    return result
  },

  /**
   * Mapping menu detail to dto
   */
  mapMenuDetailModelToDto(menu) {
    let options = menu.options
    if(options) {
      options = JSON.parse(options)
    } else {
      options = []
    }

    let toppingTemp = new Array()
     try {
      let toppings = JSON.parse(menu.toppings)
      if(toppings) {
        for(var i in toppings) {
          toppingTemp.push(toppings[i])
        }
      }
    } catch (e) {}

    let resources = []
    try {
      resources = JSON.parse(menu.resource)
    } catch (e) {}

    let resourceTemp = new Array()
    if(resources) {
      for(var i in resources) {
        resourceTemp.push(resources[i])
      }
    } else {
      resourceTemp = []
    }

    return {
      "id": menu.pk,
      "name": menu.name,
      "price": menu.price,
      "status": menu.status,
      "options": options,
      "toppings": toppingTemp,
      "resource": resourceTemp,
      "group": menu.group_id,
      "type": menu.type,
      "can_edit_price": menu.can_edit_price,
      "can_edit_quantity": menu.can_edit_quantity,
      "kitchen_area_id": menu.kitchen_area_id,
      "index": menu.index,
      "description": menu.description,
      "image": menu.image,
      "imagePreview": menu.image_preview,
      "commission_percent": menu.commission_percent,
      "tour_amount": menu.tour_amount,
      "work_time_minute": menu.work_time_minute,
      "number_of_use": menu.number_of_use,
      "day_to_expiry": menu.day_to_expiry,
      "card_amount_limit": menu.card_amount_limit,
      "sub_service_id": menu.sub_service_id
    }
  },

  /**
   * Mapping menu for customer model to dto
   */
  mapCustomerMenuModelToDto(groupMenus) {
    let result = []

    var gm_stt = 0
    for (var zindex in groupMenus) {

      let listMenuTemp = []
      let db_menus = groupMenus[zindex].menus
      var stt = 0
      for (var index in db_menus) {
        stt = stt + 1

        let menuTemp = {
          id: db_menus[index].id
          , image: db_menus[index].image
          , name: db_menus[index].name
          , price: db_menus[index].price
          , status: db_menus[index].status
          , options: db_menus[index].options
          , toppings: db_menus[index].toppings
          , can_edit_price: db_menus[index].can_edit_price
          , can_edit_quantity: db_menus[index].can_edit_quantity
          , kitchen_area_id: db_menus[index].kitchen_area_id
          , action: stt
        }
        listMenuTemp.push(menuTemp)
      }
      let groupMenuTemp = {
        gm_stt: gm_stt,
        name: groupMenus[zindex].name,
        menus: listMenuTemp,
        index: groupMenus[zindex].index
      }

      gm_stt = gm_stt + 1

      result.push(groupMenuTemp)
    }
    return result
  },
}
