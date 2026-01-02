export default {
    items: [
      {
        title: 'Tổng quan',
        href: '/overview',
        icon: 'fa fa-cubes'
      },
      {
        title: 'Quản lý két tiền, thu chi',
        href: '/money-box',
        icon: 'fa fa-usd'
      },
      {
        title: 'Chăm sóc K.H',
        icon: 'fa fa-address-card',
        child: [
            {
              title: 'Khách hàng',
              href: '/customer/list',
              icon: 'fa fa-users'
            },
            {
              title: 'Lịch sử khách hàng',
              href: '/customer/history',
              icon: 'fa fa-history'
            },
            {
              title: 'Thiết lập ưu đãi',
              href: '/member/config',
              icon: 'fa fa-cog'
            },
        ]
      },
      {
        title: 'Báo cáo',
        icon: 'fa fa-bar-chart',
        child: [
            {
              title: 'Báo cáo theo ngày',
              href: '/today-report',
              icon: 'fa fa-edit'
            },
            {
              title: 'Biểu đồ doanh thu',
              href: '/chart-profit-revenue',
              icon: 'fa fa-bar-chart'
            },
            {
              title: 'Báo cáo bán hàng',
              href: '/sale-report',
              icon: 'fa fa-edit'
            },
            {
              title: 'Thống kê',
              href: '/statistic',
              icon: 'fa fa-signal'
            },
            {
              title: 'Lợi nhuận',
              href: '/profit-report',
              icon: 'fa fa-line-chart'
            },
            {
              title: 'Báo cáo khuyến mãi',
              href: '/promotion-report',
              icon: 'fa fa-gift'
            },
            {
              title: 'Báo cáo theo nhân viên',
              href: '/staff-report',
              icon: 'fa fa-user'
            },
            {
              title: 'Báo cáo xóa bill',
              href: '/delete-bill-report',
              icon: 'fa fa-trash'
            },
            {
              title: 'Báo cáo sửa giá',
              href: '/edit-price-report',
              icon: 'fa fa-edit'
            },
        ]
      },
      {
        title: 'Quản lý kho hàng',
        icon: 'fa fa-archive',
        child: [
          {
            title: 'Đơn vị',
            href: '/unit/list',
            icon: 'fa fa-balance-scale'
          },
          {
            title: 'Nguyên liệu-Mặt hàng',
            href: '/resource/list',
            icon: 'fa fa-paw'
          },
          {
            title: 'Lịch sử kho',
            href: '/repo-history',
            icon: 'fa fa-history'
          },
        ]
      },
      {
        title: 'Thiết lập cửa hàng',
        icon: 'fa fa-cogs',
        child: [
            {
              title: 'Topping',
              href: '/topping/list',
              icon: 'fa fa-plus'
            },
            {
              title: 'Danh mục',
              href: '/group-menu/list',
              icon: 'fa fa-align-left'
            },
            {
              title: 'Thực đơn',
              href: '/menu/list',
              icon: 'fa fa-cutlery'
            },
            {
              title: 'Bàn ăn',
              href: '/table/list',
              icon: 'fa fa-table'
            },
            {
              title: 'Nhóm quyền',
              href: '/role/list',
              icon: 'fa fa-gavel'
            },
            {
              title: 'Nhân viên',
              href: '/staff/list',
              icon: 'fa fa-user'
            },
            {
              title: 'Máy in',
              href: '/printer',
              icon: 'fa fa-print'
            },
            {
              title: 'Khuyến mãi',
              href: '/promo/list',
              icon: 'fa fa-gift'
            },
            {
              title: 'Khu vực chế biến',
              href: '/kitchen-area',
              icon: 'fa fa-cutlery'
            },
            {
              title: 'Cài đặt',
              href: '/setting',
              icon: 'fa fa-cog'
            },
            {
              title: 'Đăng thông báo',
              href: '/man-notification',
              icon: 'fa fa-bullhorn'
            },
            {
              title: 'In QR code',
              href: '/print-qr-code',
              icon: 'fa fa-print'
            },
            {
              title: 'Thông tin nhà hàng',
              href: '/store/info',
              icon: 'fa fa-info'
            },
        ]
      },
      {
        title: 'Đa ngôn ngữ',
        icon: 'fa fa-language',
        child: [
          {
            title: 'Thiết lập ngôn ngữ',
            href: '/language/setting',
            icon: 'fa fa-cog'
          },
          {
            title: 'Tên nhà hàng',
            href: '/language/store',
            icon: 'fa fa-home'
          },
          {
            title: 'Danh mục',
            href: '/language/group-menu',
            icon: 'fa fa-align-left'
          },
          {
            title: 'Thực đơn',
            href: '/language/menu',
            icon: 'fa fa-cutlery'
          },
          {
            title: 'Topping',
            href: '/language/topping',
            icon: 'fa fa-plus'
          },
        ]
      },
      {
        title: 'Liên hệ',
        href: '/contact',
        icon: 'fa fa-phone'
      },
    ]
  }
