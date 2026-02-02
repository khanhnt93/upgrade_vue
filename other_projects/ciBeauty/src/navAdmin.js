export default {
  items: [
    {
      title: 'Tổng quan',
      href: '/overview',
      icon: 'fa-solid fa-cubes'
    },
    {
      title: 'QL bán hàng',
      icon: 'fa-solid fa-cart-shopping',
      child: [  
        {
          title: 'Bán hàng',
          href: '/sale',
          icon: 'fa-solid fa-cart-plus'
        },
        {
          title: 'Lịch sử',
          href: '/sale/history',
          icon: 'fa-solid fa-clock-rotate-left'
        }
      ]
    },
    {
      title: 'Lịch hẹn',
      href: '/schedule',
      icon: 'fa-solid fa-calendar-check'
    },
    {
      title: 'Chăm sóc K.H',
      icon: 'fa-solid fa-address-card',
      child: [
        {
          title: 'Khách hàng',
          href: '/customer/list',
          icon: 'fa-solid fa-users'
        },
        {
          title: 'Lịch sử khách hàng',
          href: '/customer/history',
          icon: 'fa-solid fa-clock-rotate-left'
        },
        {
          title: 'Thiết lập ưu đãi',
          href: '/member/config',
          icon: 'fa-solid fa-gear'
        },
      ]
    },
    {
      title: 'Báo cáo',
      icon: 'fa-solid fa-chart-bar',
      child: [
        {
          title: 'Hoa hồng',
          href: '/commission-report',
          icon: 'fa-solid fa-percent'
        },
        {
          title: 'Doanh thu',
          href: '/chart-profit-revenue',
          icon: 'fa-solid fa-chart-line'
        },
        {
          title: 'Báo cáo theo ngày',
          href: '/today-report',
          icon: 'fa-solid fa-calendar-day'
        },
        {
          title: 'Báo cáo bán hàng',
          href: '/sale-report',
          icon: 'fa-solid fa-file-invoice-dollar'
        },
        {
          title: 'Thống kê',
          href: '/statistic',
          icon: 'fa-solid fa-chart-pie'
        },
        {
          title: 'Lợi nhuận',
          href: '/profit-report',
          icon: 'fa-solid fa-money-bill-trend-up'
        },
        {
          title: 'Báo cáo theo nhân viên',
          href: '/staff-report',
          icon: 'fa-solid fa-user-tie'
        },
        {
          title: 'Báo cáo khuyến mãi',
          href: '/promotion-report',
          icon: 'fa-solid fa-gift'
        },
        {
          title: 'Báo cáo xóa bill',
          href: '/delete-bill-report',
          icon: 'fa-solid fa-trash-can'
        },
        {
          title: 'Báo cáo sửa bill cũ',
          href: '/edit-old-bill-report',
          icon: 'fa-solid fa-file-pen'
        },
        {
          title: 'Báo cáo sửa giá',
          href: '/edit-price-report',
          icon: 'fa-solid fa-pen-to-square'
        },
      ]
    },
    {
      title: 'Quản lý kho hàng',
      icon: 'fa-solid fa-boxes-stacked',
      child: [
        {
          title: 'Đơn vị',
          href: '/unit/list',
          icon: 'fa-solid fa-scale-balanced'
        },
        {
          title: 'Nguyên liệu-Mặt hàng',
          href: '/resource/list',
          icon: 'fa-solid fa-box-open'
        },
        {
          title: 'Lịch sử kho',
          href: '/repo-history',
          icon: 'fa-solid fa-clock-rotate-left'
        },
      ]
    },
    {
      title: 'Hóa đơn điện tử',
      icon: 'fa-solid fa-file-invoice',
      child: [
        {
          title: 'Xuất hóa đơn',
          href: '/invoice/export',
          icon: 'fa-solid fa-file-export'
        },
        {
          title: 'Lịch sử hóa đơn',
          href: '/invoice/history',
          icon: 'fa-solid fa-clock-rotate-left'
        }
      ]
    },
    {
      title: 'Thiết lập',
      icon: 'fa-solid fa-gears',
      child: [
        {
          title: 'Khu vực giường',
          href: '/bed-area/list',
          icon: 'fa-solid fa-map-location-dot'
        },
        {
          title: 'Giường',
          href: '/bed/list',
          icon: 'fa-solid fa-bed'
        },
        {
          title: 'Nhóm DV/SP',
          href: '/group-menu/list',
          icon: 'fa-solid fa-layer-group'
        },
        {
          title: 'Dịch vụ/Sản phẩm',
          href: '/menu/list',
          icon: 'fa-solid fa-spa'
        },
        {
          title: 'Nhóm quyền',
          href: '/role/list',
          icon: 'fa-solid fa-user-shield'
        },
        {
          title: 'Nhân viên',
          href: '/staff/list',
          icon: 'fa-solid fa-users-gear'
        },
        {
          title: 'Khuyến mãi',
          href: '/promo/list',
          icon: 'fa-solid fa-gift'
        },
        {
          title: 'Máy in',
          href: '/printer',
          icon: 'fa-solid fa-print'
        },
        {
          title: 'Tài khoản NH',
          href: '/bank-account',
          icon: 'fa-solid fa-building-columns'
        },
        {
          title: 'Cài đặt',
          href: '/setting',
          icon: 'fa-solid fa-sliders'
        },
        {
          title: 'Đăng thông báo',
          href: '/man-notification',
          icon: 'fa-solid fa-bullhorn'
        },
        {
          title: 'In QR code',
          href: '/print-qr-code',
          icon: 'fa-solid fa-qrcode'
        },
        {
          title: 'Thông tin nhà hàng',
          href: '/store/info',
          icon: 'fa-solid fa-circle-info'
        },
      ]
    },
    {
      title: 'QL ghi nợ, nợ công',
      icon: 'fa-solid fa-book-open',
      child: [
        {
          title: 'Ghi nợ',
          href: '/debt/record',
          icon: 'fa-solid fa-pen-nib'
        },
        {
          title: 'Nợ công',
          href: '/debt/public',
          icon: 'fa-solid fa-users-viewfinder'
        },
        {
          title: 'Báo cáo',
          href: '/debt/report',
          icon: 'fa-solid fa-chart-line'
        }
      ]
    },
    {
      title: 'Hướng dẫn sử dụng',
      href: '/tutorial',
      icon: 'fa-solid fa-circle-question'
    },
    {
      title: 'Liên hệ',
      href: '/contact',
      icon: 'fa-solid fa-phone-volume'
    },
  ]
}
