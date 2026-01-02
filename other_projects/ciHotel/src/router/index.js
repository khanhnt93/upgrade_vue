import Vue from 'vue'
import Router from 'vue-router'

// Customer group
import CustomerHome from '@/views/customer/Home'
import CustomerGroup from '@/views/admin/customer_manager/CustomerGroup'
import CustomerGroupDetail from '@/views/admin/customer_manager/CustomerGroupDetail'
import CustomerHistory from '@/views/admin/customer_manager/CustomerHistory'
import CustomerHistoryDetail from '@/views/admin/customer_manager/CustomerHistoryDetail'

// Staff group
import StaffLogin from '@/views/staff/StaffLogin'
import StaffChangePass from '@/views/staff/StaffChangePass'
import StaffActivePass from '@/views/staff/StaffActivePass'
import StaffForgetPass from '@/views/staff/StaffForgetPass'

// Admin group
import GeneralInformation from '@/views/admin/general_information/GeneralInformation'
import OverView from '@/views/admin/over_view/OverView'
import PrintBill from '@/views/admin/booking/PrintBill'
import Role from '@/views/admin/role/RoleList'
import RoleAdd from '@/views/admin/role/RoleIndex'
import Staff from '@/views/admin/staff/List'
import StaffAdd from '@/views/admin/staff/Index'
import Promo from '@/views/admin/promo/List'
import PromoAdd from '@/views/admin/promo/Index'
import Table from '@/views/admin/table/List'
import TableAdd from '@/views/admin/table/Index'
import Unit from '@/views/admin/unit/UnitList'
import UnitAdd from '@/views/admin/unit/UnitIndex'
import Resource from '@/views/admin/resource/ResourceList'
import ResourceAdd from '@/views/admin/resource/ResourceIndex'
import RepoHistory from '@/views/admin/resource/ResourceLog'
import Setting from '@/views/admin/setting/List'
import Bill from '@/views/admin/bill/List'
import EditBill from '@/views/admin/bill/EditBill'
import PrintOldBill from '@/views/admin/bill/PrintOldBill'
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
import CustomerIndex from '@/views/admin/customer/CustomerIndex'
import MemberConfig from '@/views/admin/customer/MemberConfig'
import StoreInfo from '@/views/admin/store_info/StoreInfo'
import Floor from '@/views/admin/floor/List'
import FloorAdd from '@/views/admin/floor/Index'
import RoomType from '@/views/admin/room_type/List'
import RoomTypeAdd from '@/views/admin/room_type/Index'
import RoomTypeInfo from '@/views/admin/room_type_info/List'
import RoomTypeInfoAdd from '@/views/admin/room_type_info/Index'
import RoomStatus from '@/views/admin/room_status/List'
import RoomStatusAdd from '@/views/admin/room_status/Index'
import RoomDevice from '@/views/admin/room_device/List'
import RoomDeviceAdd from '@/views/admin/room_device/Index'
import RoomService from '@/views/admin/room_service/List'
import RoomServiceAdd from '@/views/admin/room_service/Index'
import Room from '@/views/admin/room/List'
import RoomAdd from '@/views/admin/room/Index'
import ListRoom from '@/views/admin/booking/ListRoom'
import AddBooking from '@/views/admin/booking/AddBooking'
import EditBooking from '@/views/admin/booking/EditBooking'
import CheckIn from '@/views/admin/booking/CheckIn'
import CheckInFromBooking from '@/views/admin/booking/CheckInFromBooking'
import UpdateCheckInInfo from '@/views/admin/booking/UpdateCheckInInfo'
import BookingPayment from '@/views/admin/booking/Payment'
import SearchRoom from '@/views/admin/booking/SearchRoom'
import SearchBooking from '@/views/admin/booking/SearchBooking'
import SearchCheckInInfo from '@/views/admin/booking/SearchCheckInInfo'
// Super admin group
import HomeSPAdmin from '@/views/supperAdmin/HomeSPAdmin'
import Brand from '@/views/supperAdmin/brand/BrandList'
import BrandAdd from '@/views/supperAdmin/brand/BrandIndex'
import Store from '@/views/supperAdmin/store/List'
import StoreAdd from '@/views/supperAdmin/store/Index'
import StoreAdmin from '@/views/supperAdmin/storeAdmin/List'
import StoreAdminAdd from '@/views/supperAdmin/storeAdmin/Index'
import StoreHotel from '@/views/supperAdmin/hotel/List'
import StoreHotelAdd from '@/views/supperAdmin/hotel/Index'
// Brand manager
import TotalStoreReport from '@/views/brand_manager/total/TotalStoreReport'
import StoreProfit from '@/views/brand_manager/report/StoreProfit'
import StoreReport from '@/views/brand_manager/report/StoreReport'
import StoreRevenue from '@/views/brand_manager/report/StoreRevenue'
import StoreStatistic from '@/views/brand_manager/report/StoreStatistic'

// Common
import Page404 from '@/views/common/Page404'
import Page500 from '@/views/common/Page500'
import Contact from '@/views/common/contact'
import AboutUs from '@/views/common/aboutUs'
import PriceList from '@/views/common/PriceList'
import Tutorial from '@/views/common/tutorial'

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
    {
      path: '/floor/list',
      name: 'Floor',
      component: Floor
    },
    {
      path: '/floor/add',
      name: 'FloorAdd',
      component: FloorAdd
    },
    {
      path: '/floor/edit/:id',
      name: 'FloorEdit',
      component: FloorAdd
    },
    {
      path: '/room-type/list',
      name: 'RoomType',
      component: RoomType
    },
    {
      path: '/room-type/add',
      name: 'RoomTypeAdd',
      component: RoomTypeAdd
    },
    {
      path: '/room-type/edit/:id',
      name: 'RoomTypeEdit',
      component: RoomTypeAdd
    },
    {
      path: '/room-status/list',
      name: 'RoomStatus',
      component: RoomStatus
    },
    {
      path: '/room-status/add',
      name: 'RoomStatusAdd',
      component: RoomStatusAdd
    },
    {
      path: '/room-status/edit/:id',
      name: 'RoomStatusEdit',
      component: RoomStatusAdd
    },
    {
      path: '/room-type-info/list',
      name: 'RoomTypeInfo',
      component: RoomTypeInfo
    },
    {
      path: '/room-type-info/add',
      name: 'RoomTypeInfoAdd',
      component: RoomTypeInfoAdd
    },
    {
      path: '/room-type-info/edit/:id',
      name: 'RoomTypeInfoEdit',
      component: RoomTypeInfoAdd
    },
    {
      path: '/room-device/list',
      name: 'RoomDevice',
      component: RoomDevice
    },
    {
      path: '/room-device/add',
      name: 'RoomDeviceAdd',
      component: RoomDeviceAdd
    },
    {
      path: '/room-device/edit/:id',
      name: 'RoomDeviceEdit',
      component: RoomDeviceAdd
    },
    {
      path: '/room-service/list',
      name: 'RoomService',
      component: RoomService
    },
    {
      path: '/room-service/add',
      name: 'RoomServiceAdd',
      component: RoomServiceAdd
    },
    {
      path: '/room-service/edit/:id',
      name: 'RoomServiceEdit',
      component: RoomServiceAdd
    },
    {
      path: '/room/list',
      name: 'Room',
      component: Room
    },
    {
      path: '/room/add',
      name: 'RoomAdd',
      component: RoomAdd
    },
    {
      path: '/room/edit/:id',
      name: 'RoomEdit',
      component: RoomAdd
    },
    {
      path: '/booking/list-room',
      name: 'ListRoom',
      component: ListRoom
    },
    {
      path: '/booking/add/:id',
      name: 'AddBooking',
      component: AddBooking
    },
    {
      path: '/booking/edit/:id',
      name: 'EditBooking',
      component: EditBooking
    },
    {
      path: '/check-in/:id',
      name: 'CheckIn',
      component: CheckIn
    },
    {
      path: '/check-in-from-booking/:id',
      name: 'CheckInFromBooking',
      component: CheckInFromBooking
    },
    {
      path: '/update-check-in-info/:id',
      name: 'UpdateCheckInInfo',
      component: UpdateCheckInInfo
    },
    {
      path: '/booking/payment/:id',
      name: 'BookingPayment',
      component: BookingPayment
    },
    {
      path: '/booking/search-room',
      name: 'SearchRoom',
      component: SearchRoom
    },
    {
      path: '/booking/search-booking',
      name: 'SearchBooking',
      component: SearchBooking
    },
    {
      path: '/booking/search-check-in-info',
      name: 'SearchCheckInInfo',
      component: SearchCheckInInfo
    },
    {
      path: '/notification',
      name: 'Notification',
      component: Notification
    },

    // Admin group
    {
      path: '/overview',
      name: 'OverView',
      component: OverView
    },
    {
      path: '/general-info',
      name: 'GeneralInformation',
      component: GeneralInformation
    },
    {
      path: '/print-bill/:id',
      name: 'PrintBill',
      component: PrintBill
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
      path: '/bill',
      name: 'Bill',
      component: Bill
    },
    {
      path: '/bill/edit/:id',
      name: 'EditBill',
      component: EditBill
    },
    {
      path: '/bill/print/:id',
      name: 'PrintOldBill',
      component: PrintOldBill
    },
    {
      path: '/customer/list',
      name: 'CustomerList',
      component: CustomerList
    },
    {
      path: '/customer-old/add',
      name: 'CustomerAdd',
      component: CustomerIndex
    },
    {
      path: '/customer-old/edit/:id',
      name: 'CustomerEdit',
      component: CustomerIndex
    },
    {
      path: '/member/config',
      name: 'MemberConfig',
      component: MemberConfig
    },
    {
      path: '/store/info',
      name: 'StoreInfo',
      component: StoreInfo
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
      path: '/hotel/list',
      name: 'StoreHotel',
      component: StoreHotel
    },
    {
      path: '/hotel/index',
      name: 'StoreHotelAdd',
      component: StoreHotelAdd
    },
    {
      path: '/hotel/index/:id',
      name: 'StoreHotelEdit',
      component: StoreHotelAdd
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
      path: '/customer-group',
      name: 'CustomerGroup',
      component: CustomerGroup
    },
    {
      path: '/customer-group/add',
      name: 'CustomerGroupDetail',
      component: CustomerGroupDetail
    },
    {
      path: '/customer-group/edit/:id',
      name: 'CustomerGroupDetail',
      component: CustomerGroupDetail
    },
    {
      path: '/customer-history',
      name: 'Customer',
      component: CustomerHistory
    },
    {
      path: '/customer-history/edit/:id',
      name: 'CustomerDetail',
      component: CustomerHistoryDetail
    },
    // {
    //   path: '/customer/add',
    //   name: 'CustomerDetail',
    //   component: CustomerDetail
    // },

    // Common
    { path: '/404', name: 'Page404', component: Page404 },
    { path: '/500', name: 'Page500', component: Page500 },
    { path: '/contact', name: 'Contact', component: Contact },
    { path: '/tutorial', name: 'Tutorial', component: Tutorial },
    { path: '/about-us', name: 'AboutUs', component: AboutUs },
    { path: '/price-list', name: 'PriceList', component: PriceList },
  ]
})

