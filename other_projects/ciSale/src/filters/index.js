import moment from 'moment'
import Vue from 'vue'

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})


Vue.filter('format_currency', function (num) {
  if (!num) return '0'
  let result = '0';
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return result
})

Vue.filter("format_state", function(data) {
  if (!data) return ''
  if (data === "STAYING") return "Đang ở";
  if (data === "COMMING") return "Đang đến";
  if (data === "STAYED") return "Đã ở";
  return "";
})

Vue.filter("format_date", function(data) {
  if (!data) return ''
  return moment(data).format('DD/MM/YYYY HH:mm')
})