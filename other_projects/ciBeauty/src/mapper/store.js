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
      "expired_at": commonFunc.formatDate(store.fields.expired_at)
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
}
