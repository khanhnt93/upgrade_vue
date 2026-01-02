import Cookies from "js-cookie"
import {Constant} from "./constant"
import moment from 'moment'
export default {

  /**
   * Phone number check
   * @param usr
   */
  phoneNumberCheck(phoneNumber) {
    var vnf_regex = /((01|02|03|04|05|06|07|08|09)+([0-9]{8,10})\b)/g
    return vnf_regex.test(phoneNumber)
  },

  /**
   * Phone email
   */
  emailCheck(email) {
    var vnf_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return vnf_regex.test(email)
  },

  /**
   * Date format check
   * @param dateInput
   */
  dateFormatCheck(dateInput) {
    let result = false
    // var vnf_regex = /^\d{2}[./-]\d{2}[./-]\d{4}$/
    var vnf_regex = /^\s*(3[01]|[12][0-9]|0?[1-9])[/-](1[012]|0?[1-9])[/-]((?:19|20)\d{2})\s*$/
    let flag_check = vnf_regex.test(dateInput)
    if(flag_check) {
      var m = moment(dateInput, 'DD-MM-YYYY');
      if(m.isValid()) {
        result = true
      }
    }
    return result

  },

  /**
   * Interge only
   */
  intergerOnly(valueInput) {
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
   * Integer and comma only
   */
  integerPointAndCommaOnly(valueInput) {
    if (valueInput != '') {
      valueInput = valueInput.replace(/[^0-9,.]+/g,'');
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
   * Calculate date
   */
  calculateDate(date) {
    let result = date.substring(0, 10)
    result = new Date(result)
    let now = new Date()
    let day = new Date(result.getTime() - now.getTime())
    return Math.floor(day / (1000 * 60 * 60 * 24))
  },

  /**
   * Format date
   */
  formatDate(date) {
    date = date + ""
    let result = date.substring(0, 10)
    result = moment(result).format('DD-MM-YYYY')
    return result
  },

  /**
   * Convert format dd-mm-yyyy to yyyy-mm-dd
   */
  convertDDMMYYYYToYYYYMMDD(date) {
    let result = null
    if(date) {
      date = date + ""
      date = date.replace(/\//g, "-")
      let dates = date.split("-")
      result = dates[2] + "-" + dates[1] + "-" + dates[0]
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
    console.log(err)
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
            window.location.href = '/staff-login'
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
   * Handle customer error
   */
  handleCusError(err) {
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
            message = "system error"
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
   * Number format
   */
  numberFormat(num) {
    let result = num.toString().replace(/,/g, "")
    return parseInt(result)
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
     * Chuyển số tiền thành chữ
     */


    convert_block_three(number) {
      var defaultNumbers = ' hai ba bốn năm sáu bảy tám chín'

      let chuHangDonVi = ('1 một' + defaultNumbers).split(' ')
      let chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ')
      let chuHangTram = ('không một' + defaultNumbers).split(' ')

      if(number == '000') return '';
      var _a = number + ''; //Convert biến 'number' thành kiểu string

      //Kiểm tra độ dài của khối
      switch (_a.length) {
        case 0: return '';
        case 1: return chuHangDonVi[_a];
        case 2: return this.convert_block_two(_a);
        case 3:
          var chuc_dv = '';
          if (_a.slice(1,3) != '00') {
            chuc_dv = this.convert_block_two(_a.slice(1,3));
          }
          var tram = chuHangTram[_a[0]] + ' trăm';
          return tram + ' ' + chuc_dv;
      }
    },

    convert_block_two(number){
      var defaultNumbers = ' hai ba bốn năm sáu bảy tám chín'

      let chuHangDonVi = ('1 một' + defaultNumbers).split(' ')
      let chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ')
      let chuHangTram = ('không một' + defaultNumbers).split(' ')

      var dv = chuHangDonVi[number[1]];
      var chuc = chuHangChuc[number[0]];
      var append = '';

      // Nếu chữ số hàng đơn vị là 5
      if (number[0] > 0 && number[1] == 5) {
        dv = 'lăm'
      }

      // Nếu số hàng chục lớn hơn 1
      if (number[0] > 1) {
        append = ' mươi';

        if (number[1] == 1) {
          dv = ' mốt';
        }
      }

      return chuc + '' + append + ' ' + dv;
    },


  convert_number_to_text(number) {
      const dvBlock = '1 nghìn triệu tỷ'.split(' ');

    var str = parseInt(number) + '';
    var i = 0;
    var arr = [];
    var index = str.length;
    var result = [];
    var rsString = '';

    if (index == 0 || str == 'NaN') {
      return '';
    }

    // Chia chuỗi số thành một mảng từng khối có 3 chữ số
    while (index >= 0) {
      arr.push(str.substring(index, Math.max(index - 3, 0)));
      index -= 3;
    }

    // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
    for (i = arr.length - 1; i >= 0; i--) {
      if (arr[i] != '' && arr[i] != '000') {
        result.push(this.convert_block_three(arr[i]));

        // Thêm đuôi của mỗi khối
        if (dvBlock[i]) {
          result.push(dvBlock[i]);
        }
      }
    }

    // Join mảng kết quả lại thành chuỗi string
    rsString = result.join(' ');

    // Trả về kết quả kèm xóa những ký tự thừa
    return rsString.replace(/[0-9]/g, '').replace(/ /g,' ').replace(/ $/,'');
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

  /**
   * Get text by value of selected box
   */
  getTextByValueOfSelectedBox(items, valueSelected) {
    let result = ""
    let values = items.map(function(o) { return o.value })
    let index = values.indexOf(valueSelected)
    if(items[index].text) {
      result = items[index].text
    }
    return result
  },

  async downloadFile(fileUrl, fileName) {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('There was an error with the download:', error);
      }
  },

}
