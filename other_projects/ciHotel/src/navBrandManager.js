export default {
    items: [
      {
        title: 'Tổng quan',
        href: '/brand-total',
        icon: 'fa fa-cubes'
      },

      {
        title: 'Báo cáo',
        icon: 'fa fa-bar-chart',
        child: [
            {
              title: 'Báo cáo bán hàng',
              href: '/brand/report',
              icon: 'fa fa-edit'
            },
            {
              title: 'Thống kê',
              href: '/brand/statistic',
              icon: 'fa fa-signal'
            },
            {
              title: 'Doanh thu',
              href: '/brand/revenue',
              icon: 'fa fa-bar-chart'
            },
            {
              title: 'Lợi nhuận',
              href: '/brand/profit',
              icon: 'fa fa-line-chart'
            },
        ]
      },
      {
        title: 'Liên hệ',
        href: '/contact',
        icon: 'fa fa-phone'
      }
    ]
  }
