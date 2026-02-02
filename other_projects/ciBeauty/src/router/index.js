import { createRouter, createWebHistory } from 'vue-router'

// Bán hàng
import BillCreate from '@/views/admin/bill/BillCreate.vue'
import BillHistory from '@/views/admin/bill/BillHistory.vue'

// Bank account
import BankAccount from '@/views/admin/bank_account/BankAccountList.vue'
import BankAccountIndex from '@/views/admin/bank_account/BankAccountIndex.vue'

// Customer group
import CustomerHome from '@/views/customer/Home.vue'
import MakeAppointment from '@/views/customer/MakeAppointment.vue'

// Staff group
import StaffLogin from '@/views/staff/StaffLogin.vue'
import StaffChangePass from '@/views/staff/StaffChangePass.vue'
import StaffActivePass from '@/views/staff/StaffActivePass.vue'
import StaffForgetPass from '@/views/staff/StaffForgetPass.vue'
import SpaInfo from '@/views/staff/SpaInfo.vue'

// Admin group
import OverView from '@/views/admin/over_view/OverView.vue'
import Topping from '@/views/admin/topping/List.vue'
import ToppingAdd from '@/views/admin/topping/Index.vue'
import GroupMenu from '@/views/admin/group_menu/List.vue'
import GroupMenuAdd from '@/views/admin/group_menu/Index.vue'
import Menu from '@/views/admin/menu/List.vue'
import MenuAdd from '@/views/admin/menu/MenuIndex.vue'
import Role from '@/views/admin/role/RoleList.vue'
import RoleAdd from '@/views/admin/role/RoleIndex.vue'
import Staff from '@/views/admin/staff/List.vue'
import StaffAdd from '@/views/admin/staff/Index.vue'
import Promo from '@/views/admin/promo/List.vue'
import PromoAdd from '@/views/admin/promo/Index.vue'
import GroupTable from '@/views/admin/group_table/GroupTableList.vue'
import GroupTableAdd from '@/views/admin/group_table/GroupTableIndex.vue'
import Table from '@/views/admin/table/List.vue'
import TableAdd from '@/views/admin/table/Index.vue'
import Printer from '@/views/admin/printer/Printer.vue'
import Unit from '@/views/admin/unit/UnitList.vue'
import UnitAdd from '@/views/admin/unit/UnitIndex.vue'
import Resource from '@/views/admin/resource/ResourceList.vue'
import ResourceAdd from '@/views/admin/resource/ResourceIndex.vue'
import RepoHistory from '@/views/admin/resource/ResourceLog.vue'
import Setting from '@/views/admin/setting/List.vue'
import SaleReport from '@/views/admin/report/BillReport.vue'
import Statistic from '@/views/admin/report/Statistic.vue'
import ChartProfitRevenue from '@/views/admin/report/ChartProfitRevenue.vue'
import TodayReport from '@/views/admin/report/TodayReport.vue'
import Profit from '@/views/admin/report/Profit.vue'
import PromotionReport from '@/views/admin/report/PromotionReport.vue'
import StaffReport from '@/views/admin/report/StaffReport.vue'
import DeleteBill from '@/views/admin/report/DeleteBillReport.vue'
import EditPriceReport from '@/views/admin/report/EditPriceReport.vue'
import EditOldBillReport from '@/views/admin/report/EditOldBillReport.vue'
import MoneyBox from '@/views/admin/money_box/MoneyBox.vue'
import MoneyBoxHistory from '@/views/admin/money_box/MoneyBoxHistory.vue'
import Schedule from "@/views/admin/schedule/Schedule.vue"
import ManageSchedule from "@/views/admin/schedule/ManageSchedule.vue"
import ScheduleAppointment from "@/views/admin/schedule/ScheduleAppointment.vue"
import CustomerList from '@/views/admin/customer/CustomerList.vue'
import CustomerHistory from '@/views/admin/customer/CustomerHistory.vue'
import CustomerHistoryDetail from '@/views/admin/customer/CustomerHistoryDetail.vue'
import CustomerIndex from '@/views/admin/customer/CustomerIndex.vue'
import MemberConfig from '@/views/admin/customer/MemberConfig.vue'
import DebtList from '@/views/admin/debt/DebtList.vue'
import DebtIndex from '@/views/admin/debt/DebtIndex.vue'
import PublicDebtList from '@/views/admin/debt/PublicDebtList.vue'
import PublicDebtIndex from '@/views/admin/debt/PublicDebtIndex.vue'
import DebtReport from '@/views/admin/debt/DebtReport.vue'

// E-Invoice
import InvoiceCreate from '@/views/admin/e-invoice/E-InvoiceCreate.vue'
import InvoiceHis from '@/views/admin/e-invoice/E-InvoiceHis.vue'
import InvoiceDetail from '@/views/admin/e-invoice/E-InvoiceDetail.vue'

// Super admin group
import HomeSPAdmin from '@/views/supperAdmin/HomeSPAdmin.vue'
import Brand from '@/views/supperAdmin/brand/BrandList.vue'
import BrandAdd from '@/views/supperAdmin/brand/BrandIndex.vue'
import Store from '@/views/supperAdmin/store/List.vue'
import StoreAdd from '@/views/supperAdmin/store/Index.vue'
import StoreAdmin from '@/views/supperAdmin/storeAdmin/List.vue'
import StoreAdminAdd from '@/views/supperAdmin/storeAdmin/Index.vue'

// Brand manager
import TotalStoreReport from '@/views/brand_manager/total/TotalStoreReport.vue'
import StoreTodayReport from '@/views/brand_manager/report/StoreTodayReport.vue'
import StoreCommissionReport from '@/views/brand_manager/report/StoreCommissionReport.vue'
import StoreStaffReport from '@/views/brand_manager/report/StoreStaffReport.vue'
import StorePromotionReport from '@/views/brand_manager/report/StorePromotionReport.vue'
import StoreDeleteBillReport from '@/views/brand_manager/report/StoreDeleteBillReport.vue'
import StoreEditOldBillReport from '@/views/brand_manager/report/StoreEditOldBillReport.vue'
import StoreEditPriceReport from '@/views/brand_manager/report/StoreEditPriceReport.vue'
import StoreProfit from '@/views/brand_manager/report/StoreProfit.vue'
import StoreReport from '@/views/brand_manager/report/StoreReport.vue'
import StoreRevenue from '@/views/brand_manager/report/StoreRevenue.vue'
import StoreStatistic from '@/views/brand_manager/report/StoreStatistic.vue'

// Common
import Page404 from '@/views/common/Page404.vue'
import Page500 from '@/views/common/Page500.vue'
import Contact from '@/views/common/contact.vue'
import AboutUs from '@/views/common/aboutUs.vue'
import PriceList from '@/views/common/PriceList.vue'
import Tutorial from '@/views/common/tutorial.vue'
import CommissionReport from "@/views/admin/report/CommissionReport.vue";



const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
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
    {
      path: '/spa-info',
      name: 'SpaInfo',
      component: SpaInfo
    },

    {
      path: '/bank-account',
      name: 'QL tài khoản ngân hàng',
      component: BankAccount
    },
    {
      path: '/bank-account/index',
      name: 'Thêm mới tài khoản ngân hàng',
      component: BankAccountIndex
    },
    {
      path: '/bank-account/index/:id',
      name: 'Cập nhật tài khoản ngân hàng',
      component: BankAccountIndex
    },

    // Bán hàng
    {
      path: '/bill/create',
      name: 'BillCreate',
      component: BillCreate
    },
    {
      path: '/bill/edit/:id',
      name: 'BillEdit',
      component: BillCreate
    },
    {
      path: '/bill/history',
      name: 'BillHistory',
      component: BillHistory
    },

    // Customer group
    {
      path: '/',
      redirect: '/overview'
    },
    {
      path: '/make-appointment',
      name: 'MakeAppointMent',
      component: MakeAppointment
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
      path: '/commission-report',
      name: 'CommissionReport',
      component: CommissionReport
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
      path: '/customer/history-detail/:id',
      name: 'CustomerHistoryDetail',
      component: CustomerHistoryDetail
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
      path: '/schedule',
      name: 'Schedule',
      component: Schedule
    },
    {
      path: '/schedule/manage',
      name: 'Manage Schedule',
      component: ManageSchedule
    },
    {
      path: '/schedule/appointment',
      name: 'ScheduleAppointment',
      component: ScheduleAppointment
    },

    // E-invoice
    {
      path: '/e-invoice/create',
      name: 'InvoiceCreate',
      component: InvoiceCreate
    },
    {
      path: '/e-invoice/history',
      name: 'InvoiceHis',
      component: InvoiceHis
    },
    {
      path: '/e-invoice/detail/:id',
      name: 'InvoiceDetail',
      component: InvoiceDetail
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
      path: '/brand/today-report',
      name: 'StoreTodayReport',
      component: StoreTodayReport
    },
    {
      path: '/brand/commission-report',
      name: 'StoreCommissionReport',
      component: StoreCommissionReport
    },
    {
      path: '/brand/staff-report',
      name: 'StoreStaffReport',
      component: StoreStaffReport
    },
    {
      path: '/brand/promotion-report',
      name: 'StorePromotionReport',
      component: StorePromotionReport
    },
    {
      path: '/brand/delete-bill-report',
      name: 'StoreDeleteBillReport',
      component: StoreDeleteBillReport
    },
    {
      path: '/brand/edit-old-bill-report',
      name: 'StoreEditOldBillReport',
      component: StoreEditOldBillReport
    },
    {
      path: '/brand/edit-price-report',
      name: 'StoreEditPriceReport',
      component: StoreEditPriceReport
    },
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
    { path: '/about-us', name: 'AboutUs', component: AboutUs },
    { path: '/price-list', name: 'PriceList', component: PriceList },
  ]
})

export default router
