import moment from 'moment'
export function useFormatters() {
    function formatCurrency(value) {
        if (!value && value !== 0) return '0'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }
    function formatDate(value, format = 'DD/MM/YYYY') {
        if (!value) return ''
        return moment(value).format(format)
    }
    function formatNumber(value) {
        if (!value && value !== 0) return '0'
        return new Intl.NumberFormat('vi-VN').format(value)
    }
    function formatDateTime(value, format = 'DD/MM/YYYY HH:mm') {
        if (!value) return ''
        return moment(value).format(format)
    }
    return {
        formatCurrency,
        formatDate,
        formatNumber,
        formatDateTime
    }
}
