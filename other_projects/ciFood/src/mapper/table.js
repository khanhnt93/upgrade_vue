export default {
    mapTableModelToDto (tables) {
      let result = []
  
      var stt = 0
      for (var index in tables) {
        stt = stt + 1

        let type = tables[index].fields.type
        if(type == 'take_away') {
          type = 'Take Away'
        } else {
          type = 'Thường'
        }
  
        let tableTemp = {
          stt: stt
          , name: tables[index].fields.name
          , type: type
          , id: tables[index].pk
        }
        result.push(tableTemp)
      }
      return result
    },
    // mapTableDetailModelToDto (table) {
    //   return {
    //       "name": table.fields.name,
    //       "type": table.fields.type
    //   }
    // },
    mapTableModelToOption (tables) {
      let result = [{value:null, text: ""}]

      for (var index in tables) {
        let tableTemp = {
          value: tables[index].pk,
          text: tables[index].fields.name
        }
        result.push(tableTemp)
      }
      return result
    }

  }
