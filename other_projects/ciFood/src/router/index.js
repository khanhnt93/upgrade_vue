import Vue from 'vue'
import Router from 'vue-router'

// Customer group
import CustomerHome from '@/views/customer/Home'

// Staff group
import StaffLogin from '@/views/staff/StaffLogin'
import StaffChangePass from '@/views/staff/StaffChangePass'
import StaffActivePass from '@/views/staff/StaffActivePass'
import StaffForgetPass from '@/views/staff/StaffForgetPass'

// Admin group
import OverView from '@/views/admin/over_view/OverView'
import Topping from '@/views/admin/topping/List'
import ToppingAdd from '@/views/admin/topping/Index'
import GroupMenu from '@/views/admin/group_menu/List'
import GroupMenuAdd from '@/views/admin/group_menu/Index'
import Menu from '@/views/admin/menu/List'
import MenuAdd from '@/views/admin/menu/MenuIndex'
import Role from '@/views/admin/role/RoleList'
import RoleAdd from '@/views/admin/role/RoleIndex'
import Staff from '@/views/admin/staff/List'
import StaffAdd from '@/views/admin/staff/Index'
import Promo from '@/views/admin/promo/List'
import PromoAdd from '@/views/admin/promo/Index'
import Table from '@/views/admin/table/List'
import TableAdd from '@/views/admin/table/Index'
import GroupTable from '@/views/admin/group_table/GroupTableList'
import GroupTableAdd from '@/views/admin/group_table/GroupTableIndex'
import Printer from '@/views/admin/printer/Printer'
import Unit from '@/views/admin/unit/UnitList'
import UnitAdd from '@/views/admin/unit/UnitIndex'
import Resource from '@/views/admin/resource/ResourceList'
import ResourceAdd from '@/views/admin/resource/ResourceIndex'
import RepoHistory from '@/views/admin/resource/ResourceLog'
import Setting from '@/views/admin/setting/List'
import SaleReport from '@/views/admin/report/BillReport'
import Statistic from '@/views/admin/report/Statistic'
import ChartProfitRevenue from '@/views/admin/report/ChartProfitRevenue'
import TodayReport from '@/views/admin/report/TodayReport'
import Profit from '@/views/admin/report/Profit'
import PromotionReport from '@/views/admin/report/PromotionReport'
import StaffReport from '@/views/admin/report/StaffReport'
import DeleteBill from '@/views/admin/report/DeleteBillReport'
import EditPriceReport from '@/views/admin/report/EditPriceReport'
import EditOldBillReport from '@/views/admin/report/EditOldBillReport'
import MoneyBox from '@/views/admin/money_box/MoneyBox'
import MoneyBoxHistory from '@/views/admin/money_box/MoneyBoxHistory'
import CustomerList from '@/views/admin/customer/CustomerList'
import CustomerHistory from '@/views/admin/customer/CustomerHistory'
import CustomerIndex from '@/views/admin/customer/CustomerIndex'
import MemberConfig from '@/views/admin/customer/MemberConfig'
import KitchenAreaList from '@/views/admin/kitchen_area/KitchenAreaList'
import KitchenAreaAdd from '@/views/admin/kitchen_area/KitchenAreaIndex'
import KitchenAreaEdit from '@/views/admin/kitchen_area/KitchenAreaIndex'
import SaleChannelList from '@/views/admin/sale_channel/SaleChannelList'
import SaleChannelAdd from '@/views/admin/sale_channel/SaleChannelIndex'
import SaleChannelEdit from '@/views/admin/sale_channel/SaleChannelIndex'
import SetPriceByChannel from '@/views/admin/sale_channel/SetPriceByChannel'
import DebtList from '@/views/admin/debt/DebtList'
import DebtIndex from '@/views/admin/debt/DebtIndex'
import PublicDebtList from '@/views/admin/debt/PublicDebtList'
import PublicDebtIndex from '@/views/admin/debt/PublicDebtIndex'
import DebtReport from '@/views/admin/debt/DebtReport'

// Super admin group
import HomeSPAdmin from '@/views/supperAdmin/HomeSPAdmin'
import Brand from '@/views/supperAdmin/brand/BrandList'
import BrandAdd from '@/views/supperAdmin/brand/BrandIndex'
import Store from '@/views/supperAdmin/store/List'
import StoreAdd from '@/views/supperAdmin/store/Index'
import StoreAdmin from '@/views/supperAdmin/storeAdmin/List'
import StoreAdminAdd from '@/views/supperAdmin/storeAdmin/Index'

// Brand manager
import TotalStoreReport from '@/views/brand_manager/total/TotalStoreReport'
import StoreProfit from '@/views/brand_manager/report/StoreProfit'
import StoreReport from '@/views/brand_manager/report/StoreReport'
import StoreRevenue from '@/views/brand_manager/report/StoreRevenue'
import StoreStatistic from '@/views/brand_manager/report/StoreStatistic'
import StoreTodayReport from '@/views/brand_manager/report/StoreTodayReport'
import StorePromotionReport from '@/views/brand_manager/report/StorePromotionReport'
import StoreStaffReport from '@/views/brand_manager/report/StoreStaffReport'
import StoreDeleteBill from '@/views/brand_manager/report/StoreDeleteBillReport'
import StoreEditPriceReport from '@/views/brand_manager/report/StoreEditPriceReport'
import StoreEditOldBillReport from '@/views/brand_manager/report/StoreEditOldBillReport'

// Common
import Page404 from '@/views/common/Page404'
import Page500 from '@/views/common/Page500'
import Contact from '@/views/common/contact'
import AboutUs from '@/views/common/aboutUs'
import PriceList from '@/views/common/PriceList'
import Tutorial from '@/views/common/tutorial'
import Trial from '@/views/common/Trial'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [

    // Authenticate group
    {
      path: '/staff-login',
      name: 'StaffLogin',
      component: StaffLogin
    },
    {
      path: '/staff-change-password',
      name: 'StaffChangePass',
      component: StaffChangePass
    },
    {
      path: '/staff-forgetpass',
      name: 'StaffForgetPass',
      component: StaffForgetPass
    },
    {
      path: '/staff-activepass',
      name: 'StaffActivePass',
      component: StaffActivePass
    },

    // Customer group
    {
      path: '/',
      name: 'CustomerHome',
      component: CustomerHome
    },

    // Admin group
    {
      path: '/overview',
      name: 'OverView',
      component: OverView
    },
    {
      path: '/money-box',
      name: 'MoneyBox',
      component: MoneyBox
    },
    {
      path: '/money-box-history',
      name: 'MoneyBoxHistory',
      component: MoneyBoxHistory
    },
    {
      path: '/topping/list',
      name: 'Topping',
      component: Topping
    },
    {
      path: '/topping/add',
      name: 'ToppingAdd',
      component: ToppingAdd
    },
    {
      path: '/topping/edit/:id',
      name: 'ToppingEdit',
      component: ToppingAdd
    },

    {
      path: '/group-menu/list',
      name: 'GroupMenu',
      component: GroupMenu
    },
    {
      path: '/group-menu/add',
      name: 'GroupMenuAdd',
      component: GroupMenuAdd
    },
    {
      path: '/group-menu/edit/:id',
      name: 'GroupMenuEdit',
      component: GroupMenuAdd
    },

    {
      path: '/menu/list',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/menu/add',
      name: 'MenuAdd',
      component: MenuAdd
    },
    {
      path: '/menu/edit/:id',
      name: 'MenuEdit',
      component: MenuAdd
    },
    {
      path: '/role/list',
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
      path: '/staff/list',
      name: 'Staff',
      component: Staff
    },
    {
      path: '/staff/index',
      name: 'StaffAdd',
      component: StaffAdd
    },
    {
      path: '/staff/index/:id',
      name: 'StaffEdit',
      component: StaffAdd
    },
    {
      path: '/promo/list',
      name: 'Promo',
      component: Promo
    },
    {
      path: '/promo/index',
      name: 'PromoAdd',
      component: PromoAdd
    },
    {
      path: '/promo/index/:id',
      name: 'PromoEdit',
      component: PromoAdd
    },
    {
      path: '/group-table/list',
      name: 'GroupTable',
      component: GroupTable
    },
    {
      path: '/group-table/index',
      name: 'GroupTableAdd',
      component: GroupTableAdd
    },
    {
      path: '/group-table/index/:id',
      name: 'GroupTableEdit',
      component: GroupTableAdd
    },
    {
      path: '/table/list',
      name: 'Table',
      component: Table
    },
    {
      path: '/table/index',
      name: 'TableAdd',
      component: TableAdd
    },
    {
      path: '/table/index/:id',
      name: 'TableEdit',
      component: TableAdd
    },
    {
      path: '/printer',
      name: 'Printer',
      component: Printer
    },
    {
      path: '/unit/list',
      name: 'Unit',
      component: Unit
    },
    {
      path: '/unit/index',
      name: 'UnitAdd',
      component: UnitAdd
    },
    {
      path: '/unit/index/:id',
      name: 'UnitEdit',
      component: UnitAdd
    },
    {
      path: '/resource/list',
      name: 'Resource',
      component: Resource
    },
    {
      path: '/resource/index',
      name: 'ResourceAdd',
      component: ResourceAdd
    },
    {
      path: '/resource/index/:id',
      name: 'ResourceEdit',
      component: ResourceAdd
    },
    {
      path: '/repo-history',
      name: 'RepoHistory',
      component: RepoHistory
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/kitchen-area',
      name: 'KitchenArea',
      component: KitchenAreaList
    },
    {
      path: '/kitchen-area/index',
      name: 'KitchenAreaAdd',
      component: KitchenAreaAdd
    },
    {
      path: '/kitchen-area/index/:id',
      name: 'KitchenAreaEdit',
      component: KitchenAreaEdit
    },
    {
      path: '/sale-report',
      name: 'SaleReport',
      component: SaleReport
    },
    {
      path: '/statistic',
      name: 'Statistic',
      component: Statistic
    },
    {
      path: '/chart-profit-revenue',
      name: 'ChartProfitRevenue',
      component: ChartProfitRevenue
    },
    {
      path: '/today-report',
      name: 'TodayReport',
      component: TodayReport
    },
    {
      path: '/profit-report',
      name: 'Profit',
      component: Profit
    },
    {
      path: '/delete-bill-report',
      name: 'DeleteBill',
      component: DeleteBill
    },
    {
      path: '/promotion-report',
      name: 'PromotionReport',
      component: PromotionReport
    },
    {
      path: '/staff-report',
      name: 'StaffReport',
      component: StaffReport
    },
    {
      path: '/edit-price-report',
      name: 'EditPriceReport',
      component: EditPriceReport
    },
    {
      path: '/edit-old-bill-report',
      name: 'EditOldBillReport',
      component: EditOldBillReport
    },
    {
      path: '/customer/list',
      name: 'CustomerList',
      component: CustomerList
    },
    {
      path: '/customer/history',
      name: 'CustomerHistory',
      component: CustomerHistory
    },
    {
      path: '/customer/add',
      name: 'CustomerAdd',
      component: CustomerIndex
    },
    {
      path: '/customer/edit/:id',
      name: 'CustomerEdit',
      component: CustomerIndex
    },
    {
      path: '/member/config',
      name: 'MemberConfig',
      component: MemberConfig
    },
    {
      path: '/sale-channel/list',
      name: 'SaleChannelList',
      component: SaleChannelList
    },
    {
      path: '/sale-channel/add',
      name: 'SaleChannelAdd',
      component: SaleChannelAdd
    },
    {
      path: '/sale-channel/edit/:id',
      name: 'SaleChannelEdit',
      component: SaleChannelEdit
    },
    {
      path: '/set-price-by-channel',
      name: 'SetPriceByChannel',
      component: SetPriceByChannel
    },

    // Super admin group
    {
      path: '/home-sp-admin',
      name: 'HomeSPAdmin',
      component: HomeSPAdmin
    },
    {
      path: '/brand/list',
      name: 'Brand',
      component: Brand
    },
    {
      path: '/brand/index',
      name: 'BrandAdd',
      component: BrandAdd
    },
    {
      path: '/brand/index/:id',
      name: 'BrandEdit',
      component: BrandAdd
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

    // Brand manager group
    {
      path: '/brand-total',
      name: 'TotalStoreReport',
      component: TotalStoreReport
    },
    {
      path: '/brand/report',
      name: 'StoreReport',
      component: StoreReport
    },
    {
      path: '/brand/profit',
      name: 'StoreProfit',
      component: StoreProfit
    },
    {
      path: '/brand/revenue',
      name: 'StoreRevenue',
      component: StoreRevenue
    },
    {
      path: '/brand/statistic',
      name: 'StoreStatistic',
      component: StoreStatistic
    },
    {
      path: '/brand/today-report',
      name: 'StoreTodayReport',
      component: StoreTodayReport
    },
    {
      path: '/brand/delete-bill-report',
      name: 'StoreDeleteBill',
      component: StoreDeleteBill
    },
    {
      path: '/brand/promotion-report',
      name: 'StorePromotionReport',
      component: StorePromotionReport
    },
    {
      path: '/brand/staff-report',
      name: 'StoreStaffReport',
      component: StoreStaffReport
    },
    {
      path: '/brand/edit-price-report',
      name: 'StoreEditPriceReport',
      component: StoreEditPriceReport
    },
    {
      path: '/brand/edit-old-bill-report',
      name: 'StoreEditOldBillReport',
      component: StoreEditOldBillReport
    },
    {
      path: '/debt/list',
      name: 'DebtList',
      component: DebtList
    },
    {
      path: '/debt/add',
      name: 'DebtIndexAdd',
      component: DebtIndex
    },
    {
      path: '/debt/edit/:id',
      name: 'DebtIndexEdit',
      component: DebtIndex
    },
    {
      path: '/public-debt/list',
      name: 'PublicDebtList',
      component: PublicDebtList
    },
    {
      path: '/public-debt/add',
      name: 'PublicDebtAdd',
      component: PublicDebtIndex
    },
    {
      path: '/public-debt/edit/:id',
      name: 'PublicDebtEdit',
      component: PublicDebtIndex
    },
    {
      path: '/debt-report',
      name: 'DebtReport',
      component: DebtReport
    },

    // Common
    { path: '/404', name: 'Page404', component: Page404 },
    { path: '/500', name: 'Page500', component: Page500 },
    { path: '/contact', name: 'Contact', component: Contact },
    { path: '/tutorial', name: 'Tutorial', component: Tutorial },
    { path: '/sign-up-trial', name: 'Trial', component: Trial },
    { path: '/about-us', name: 'AboutUs', component: AboutUs },
    { path: '/price-list', name: 'PriceList', component: PriceList },
  ]
})

