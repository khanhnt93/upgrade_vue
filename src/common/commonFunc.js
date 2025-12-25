import Cookies from "js-cookie";
import {Constant} from "./constant";
export default {

  /**
   * Phone number check
   * @param usr
   */
  phoneNumberCheck(phoneNumber) {
    var vnf_regex = /((01|02|03|04|05|06|07|08|09)+([0-9]{8})\b)/g;
    return vnf_regex.test(phoneNumber)
  },

  /**
   * Integer only
   */
  integerOnly(valueInput) {
    if (valueInput != '') {
      valueInput = valueInput.replace(/[^0-9]+/g,'');
    }
    return valueInput
  },

  /**
   * Integer and point only
   */
  integerAndPointOnly(valueInput) {
    if (valueInput != '') {
      valueInput = valueInput.replace(/[^0-9.]+/g,'');
    }
    return valueInput
  },

    /**
   * Integer and comma only
   */
  integerAndCommaOnly(valueInput) {
    if (valueInput != '') {
      valueInput = valueInput.replace(/[^0-9,]+/g,'');
    }
    return valueInput
  },

  /**
   * Date only
   */
  inputDateOnly(valueInput) {
    if (valueInput != '') {
      valueInput = valueInput.replace(/[^0-9/-]+/g,'');
    }
    return valueInput
  },

  /**
   * Input number 0-9 only
   */
  isNumber (event) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    } else {
      return true;
    }
  },

  /**
   * Reindex list item
   */
  updateIndex(index, listIdDeleted) {
    let result = index
    for(var i in listIdDeleted) {
      if(index > listIdDeleted[i]) {
        result -= 1
      }
    }
    return result
  },

  /**
   * Calculate month
   */
  calculateMonth(date) {
    let result = date.substring(0, 10)
    result = new Date(result)
    let now = new Date()
    let day = new Date(result.getTime() - now.getTime())
    return Math.floor(day / (1000 * 60 * 60 * 24 * 30))
  },

  /**
   * Make toast with title
   */
  makeToast(variant = null, title="Success!!!", content="Thao tác thành công!!!") {
    this.$bvToast.toast(content, {
      title: title,
      variant: variant,
      solid: true,
      autoHideDelay: 3000
    })
  },

  /**
     * Handle staff error
     */
  handleStaffError(err) {
      let message = ""
      if(!err.response) {
          message = "Lỗi hệ thống"
      } else {
          if (err.response.data.status == 403) {
            const TOKEN_NAME = Constant.TOKEN_NAME;
            const APP_USR = Constant.APP_USR
            // Removes token
            Cookies.remove(TOKEN_NAME);
            // Removes user
            Cookies.remove(APP_USR);
            window.location.href = '/login'
          }
          if (err.response.data.status == 500) {
            message = "Lỗi hệ thống! Rất tiếc vì điều này, bạn liên hệ chúng tôi để được khắc phục cố nhé. Xin cảm ơn"
          } else {
            message = err.response.data.mess
          }
      }

      return message
  },

  /**
   * Currency format
   */
  currencyFormat(num) {
    let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return result
  },

  /**
   * Format id
   */
  formatId(idInput, lenInput) {
    let befor = ""
    let idLen = idInput.toString().length
    if(idLen < lenInput) {
      for(var i = 0; i< lenInput-idLen; i++) {
        befor = befor + "0"
      }
    }
    let result = befor + idInput.toString()
    return result
  },
  
  /**
   * Lấy tháng theo quý
   */
  getMonthByQuarter(quarter) {
    switch(quarter) {
      case 1:
        return 1
      case 2:
        return 4
      case 3:
        return 7
      case 4:
        return 10
      default:
        return 1
    }
  },
}
