export default {

  /**
   * Mapping city model to dto
   * @param citys
   * @returns {Array}
   */
  mapCityModelToDto(citys) {
    let result = [{value: "", text: "Chọn tỉnh/thành phố"}]
    for (var index in citys) {
      let cityTemp = {value: citys[index].pk, text: citys[index].fields.name}
      result.push(cityTemp)
    }
    return result
  },
}
