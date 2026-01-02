export default {

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
