import commonFunc from '@/common/commonFunc'
export default {
  mapPointModelToDto (points) {
    let result = []

    var stt = 0
    for (var index in points) {
      stt = stt + 1

      let pointTemp = {
        stt: stt,
        name: points[index].fields.store_name,
        point: commonFunc.currencyFormat(points[index].fields.total_point),
        store_id: points[index].fields.store_id,
        id: points[index].pk
      }
      result.push(pointTemp)
    }
    return result
  },

  mapPointDetailModelToDto (points) {
    let result = []

    var stt = 0
    for (var index in points) {
      stt = stt + 1

      let pointTemp = {
        stt: stt,
        point: commonFunc.currencyFormat(points[index].fields.point),
        remaining: commonFunc.currencyFormat(points[index].fields.remaining),
        createdDate: commonFunc.formatDate(points[index].fields.created_at),
        expiredate: commonFunc.formatDate(points[index].fields.expire_date)
      }
      result.push(pointTemp)
    }
    return result
  },
}
