import commonFunc from "../common/commonFunc";

export default {
  mapGroupMenuModelToDto (groupMenus) {
      let result = []

    let stt = 1
      for (var index in groupMenus) {

        let groupMenuTemp = {

          name: groupMenus[index].fields.name
          , index: groupMenus[index].fields.index
          , actions: groupMenus[index].pk
          , stt: stt
        }
        result.push(groupMenuTemp)

        stt = stt + 1
      }
      return result
  },

  mapGroupMenuDetailModelToDto (groupMenu) {
        return {
          "id": groupMenu.pk
          , "name": groupMenu.fields.name
          , "index": groupMenu.fields.index
        }
    },


  mapGroupMenuOptionModelToDto (groupMenus) {
      let result = [{value:null, text: ""}]

      for (var index in groupMenus) {
        let optionTemp = {
          value: groupMenus[index].pk,
          text: groupMenus[index].fields.name
        }
        result.push(optionTemp)
      }
      return result
    },
}
