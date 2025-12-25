import { createRouter, createWebHistory } from 'vue-router'

// Staff group
import StaffLogin from '@/views/staff/StaffLogin.vue'
import StaffChangePass from '@/views/staff/StaffChangePass.vue'

// Expend group
import ExpendGroupList from '@/views/admin/expend_group/ExpendGroupList.vue'
import ExpendGroupIndex from '@/views/admin/expend_group/ExpendGroupIndex.vue'

// Expend
import ExpendList from '@/views/admin/expend/ExpendList.vue'
import ExpendIndex from '@/views/admin/expend/ExpendIndex.vue'

// Income group
import IncomeGroupList from '@/views/admin/income_group/IncomeGroupList.vue'
import IncomeGroupIndex from '@/views/admin/income_group/IncomeGroupIndex.vue'

// Income
import IncomeList from '@/views/admin/income/IncomeList.vue'
import IncomeIndex from '@/views/admin/income/IncomeIndex.vue'
import IncomeDetail from '@/views/admin/income/IncomeDetail.vue'

// Ie book
import IEBookList from '@/views/admin/ie_book/IEBookList.vue'
import IEBookIndex from '@/views/admin/ie_book/IEBookIndex.vue'

// Role
import Role from '@/views/admin/role/RoleList.vue'
import RoleAdd from '@/views/admin/role/RoleIndex.vue'

// Staff
import Staff from '@/views/admin/staff/List.vue'
import StaffAdd from '@/views/admin/staff/Index.vue'

// Fund
import FundReport from '@/views/admin/fund/FundReport.vue'

// Thống kê
import Statistic from '@/views/admin/statistic/Statistic.vue'

// Tổng quan
import OverView from '@/views/admin/over_view/OverView.vue'

// Super admin group
import HomeSPAdmin from '@/views/supperAdmin/HomeSPAdmin.vue'
import Store from '@/views/supperAdmin/store/List.vue'
import StoreAdd from '@/views/supperAdmin/store/Index.vue'
import StoreAdmin from '@/views/supperAdmin/storeAdmin/List.vue'
import StoreAdminAdd from '@/views/supperAdmin/storeAdmin/Index.vue'

import Contact from '@/views/common/contact.vue'

const routes = [
    {
      path: '/',
      name: 'Home',
      component: OverView
    },
      
    {
      path: '/over-view',
      name: 'OverView',
      component: OverView
    },

    // Authenticate group
    {
      path: '/login',
      name: 'StaffLogin',
      component: StaffLogin
    },
    {
      path: '/staff-change-password',
      name: 'StaffChangePass',
      component: StaffChangePass
    },

    // Admin group
    {
      path: '/role',
      name: 'Role',
      component: Role
    },
    {
      path: '/role/index',
      name: 'RoleAdd',
      component: RoleAdd
    },
    {
      path: '/role/index/:id',
      name: 'RoleEdit',
      component: RoleAdd
    },
    {
      path: '/member',
      name: 'Staff',
      component: Staff
    },
    {
      path: '/member/index',
      name: 'StaffAdd',
      component: StaffAdd
    },
    {
      path: '/member/index/:id',
      name: 'StaffEdit',
      component: StaffAdd
    },

    {
      path: '/fund',
      name: 'FundReport',
      component: FundReport
    },

    {
      path: '/statistic',
      name: 'Statistic',
      component: Statistic
    },
      
    {
      path: '/expend-group',
      name: 'ExpendGroupList',
      component: ExpendGroupList
    },
    {
      path: '/expend-group/index',
      name: 'ExpendGroupAdd',
      component: ExpendGroupIndex
    },
    {
      path: '/expend-group/index/:id',
      name: 'ExpendGroupEdit',
      component: ExpendGroupIndex
    },
      
    {
      path: '/expend',
      name: 'ExpendList',
      component: ExpendList
    },
    {
      path: '/expend/index',
      name: 'ExpendAdd',
      component: ExpendIndex
    },
    {
      path: '/expend/index/:id',
      name: 'ExpendEdit',
      component: ExpendIndex
    },
      
    {
      path: '/income-group',
      name: 'IncomeGroupList',
      component: IncomeGroupList
    },
    {
      path: '/income-group/index',
      name: 'IncomeGroupAdd',
      component: IncomeGroupIndex
    },
    {
      path: '/income-group/index/:id',
      name: 'IncomeGroupEdit',
      component: IncomeGroupIndex
    },
      
    {
      path: '/income',
      name: 'IncomeList',
      component: IncomeList
    },
    {
      path: '/income/index',
      name: 'IncomeAdd',
      component: IncomeIndex
    },
    {
      path: '/income/index/:id',
      name: 'IncomeEdit',
      component: IncomeIndex
    },
    {
      path: '/income/detail/:id',
      name: 'IncomeDetail',
      component: IncomeDetail
    },
      
    {
      path: '/ei-book',
      name: 'IEBookList',
      component: IEBookList
    },
    {
      path: '/ei-book/index',
      name: 'IEBookAdd',
      component: IEBookIndex
    },
    {
      path: '/ei-book/index/:id',
      name: 'IEBookEdit',
      component: IEBookIndex
    },

    {
      path: '/home-sp-admin',
      name: 'HomeSPAdmin',
      component: HomeSPAdmin
    },
    {
      path: '/store/list',
      name: 'Store',
      component: Store
    },
    {
      path: '/store/index',
      name: 'StoreAdd',
      component: StoreAdd
    },
    {
      path: '/store/index/:id',
      name: 'StoreEdit',
      component: StoreAdd
    },
    {
      path: '/admin-store/list',
      name: 'StoreAdmin',
      component: StoreAdmin
    },
    {
      path: '/admin-store/index',
      name: 'StoreAdminAdd',
      component: StoreAdminAdd
    },
    {
      path: '/admin-store/index/:id',
      name: 'StoreAdminEdit',
      component: StoreAdminAdd
    },
      
    { path: '/contact', name: 'Contact', component: Contact },
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes
})

export default router

