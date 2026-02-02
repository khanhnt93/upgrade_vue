export default {
    items: [
      {
        title: 'Tổng quan',
        href: '/brand-total',
        icon: 'fa-solid fa-cubes'
      },

      {
        title: 'Báo cáo',
        icon: 'fa-solid fa-chart-bar',
        child: [
            {
              title: 'Báo cáo theo ngày',
              href: '/today-report',
              icon: 'fa-solid fa-pen-to-square'
            },
            {
              title: 'Báo cáo bán hàng',
              href: '/brand/report',
              icon: 'fa-solid fa-pen-to-square'
            },
            {
              title: 'Thống kê',
              href: '/brand/statistic',
              icon: 'fa-solid fa-signal'
            },
            {
              title: 'Doanh thu',
              href: '/brand/revenue',
              icon: 'fa-solid fa-chart-bar'
            },
            {
              title: 'Lợi nhuận',
              href: '/brand/profit',
              icon: 'fa-solid fa-chart-line'
            },
        ]
      },
      {
        title: 'Liên hệ',
        href: '/contact',
        icon: 'fa-solid fa-phone'
      }
    ]
  }
