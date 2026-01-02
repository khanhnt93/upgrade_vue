import commonFunc from '@/common/commonFunc'
export default {

  /**
  * Mapping store detail to dto
  */
  mapStoreDetailModelToDto(store) {
    return {
      "name": store.fields.name,
      "brand_id": store.fields.brand_id,
      "address": store.fields.address,
      "city_id": store.fields.city_id,
      "district_id": store.fields.district_id,
      "phone_number": store.fields.phone_number,
      "expired_at": commonFunc.formatDate(store.fields.expired_at),
      "email": store.fields.email,
      "type_id": store.fields.type_id,
      "image": store.fields.image,
      "image_preview": store.fields.image,
      "description": store.fields.description,
    }
  },

  /**
  * Mapping store detail to dto
  */
  mapStoreModelListToDto(stores) {
    let result = []
    for (var index in stores) {

      let storeTemp = {
        value: stores[index].pk,
        text: stores[index].fields.name
      }
      result.push(storeTemp)
    }
    return result
  },

  mapHotelDetailModelToDto(hotel) {
    let options = hotel.options
    if(options) {
      options = JSON.parse(options)
    } else {
      options = []
    }
    let resources = []
    try {
      resources = JSON.parse(hotel.resource)
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
      "id": hotel.id,
      "name": hotel.name,
      "brand_id": hotel.brand_id,
      "address": hotel.address,
      "phone_number": hotel.phone_number,
      "city_id": hotel.city_id,
      "district_id": hotel.district_id,
      "expired_at":hotel.expired_at,
      "email" : hotel.email,
      "type_id" : hotel.type_id,
      "description": hotel.description,
      "image": hotel.image,
      "image_preview": hotel.image_preview
    }
  },
}
