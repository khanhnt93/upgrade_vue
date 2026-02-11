import { createRouter, createWebHistory } from 'vue-router'

// Bán hàng
import BillCreate from '@/views/admin/bill/BillCreate'
import BillHistory from '@/views/admin/bill/BillHistory'

// Staff group
import StaffLogin from '@/views/staff/StaffLogin'
import StaffChangePass from '@/views/staff/StaffChangePass'
import StaffActivePass from '@/views/staff/StaffActivePass'
import StaffForgetPass from '@/views/staff/StaffForgetPass'

/**
 * Admin group
  */
// Customer
import CustomerList from '@/views/admin/customer/CustomerList'
import CustomerIndex from '@/views/admin/customer/CustomerIndex'
import CustomerHistory from '@/views/admin/customer/CustomerHistory'
import MemberConfig from '@/views/admin/customer/MemberConfig'

// Promotion
import Promo from '@/views/admin/promo/List'
import PromoAdd from '@/views/admin/promo/Index'

// Over view
import OverView from '@/views/admin/over_view/OverView'

// Product
import ProductList from '@/views/admin/product/ProductList'
import ProductIndex from '@/views/admin/product/ProductIndex'

// Product group
import ProductGroupList from '@/views/admin/product_group/ProductGroupList'
import ProductGroupIndex from '@/views/admin/product_group/ProductGroupIndex'

// Product type
import ProductTypeList from '@/views/admin/product_type/ProductTypeList'
import ProductTypeIndex from '@/views/admin/product_type/ProductTypeIndex'

// Product image
import ProductImage from '@/views/admin/product_image/ProductImage'

// Product properties
import ProductProperties from '@/views/admin/product_properties/ProductPropertiesList'
import ProductPropertiesIndex from '@/views/admin/product_properties/ProductPropertiesIndex'

// Report
import BillReport from '@/views/admin/report/BillReport'
import Statistic from '@/views/admin/report/Statistic'
import ChartProfitRevenue from '@/views/admin/report/ChartProfitRevenue'
import TodayReport from '@/views/admin/report/TodayReport'
import Profit from '@/views/admin/report/Profit'
import PromotionReport from '@/views/admin/report/PromotionReport'
import StaffReport from '@/views/admin/report/StaffReport'
import DeleteBill from '@/views/admin/report/DeleteBillReport'
import EditPriceReport from '@/views/admin/report/EditPriceReport'
import EditOldBillReport from '@/views/admin/report/EditOldBillReport'

// Repository
import RepositoryReport from '@/views/admin/repository/RepositoryReport'
import RepositoryHis from '@/views/admin/repository/RepositoryHis'

// Resource
import Resource from '@/views/admin/resource/ResourceList'
import ResourceAdd from '@/views/admin/resource/ResourceIndex'

// Role
import Role from '@/views/admin/role/RoleList'
import RoleAdd from '@/views/admin/role/RoleIndex'

// InvoiceTemplate
import InvoiceTemplate from '@/views/admin/invoice_template/Index'

// Tools
import Tools from '@/views/admin/tool/tool'

// Staff
import Staff from '@/views/admin/staff/List'
import StaffAdd from '@/views/admin/staff/Index'

// Unit
import Unit from '@/views/admin/unit/UnitList'
import UnitAdd from '@/views/admin/unit/UnitIndex'

// Product brand
import ProductBrand from '@/views/admin/product_brand/ProductBrandList'
import ProductBrandAdd from '@/views/admin/product_brand/ProductBrandIndex'

// Supplier
import Supplier from '@/views/admin/supplier/SupplierList'
import SupplierAdd from '@/views/admin/supplier/SupplierIndex'
import SupplierHistory from '@/views/admin/supplier/SupplierHistory'

// Công nợ
import DebtList from '@/views/admin/debt/DebtList'
import DebtIndex from '@/views/admin/debt/DebtIndex'
import DebtPayFast from '@/views/admin/debt/DebtPayFast'
import DebtHistory from '@/views/admin/debt/DebtHistory'

// Nợ công
import PublicDebtList from '@/views/admin/public_debt/PublicDebtList'
import PublicDebtIndex from '@/views/admin/public_debt/PublicDebtIndex'
import PublicDebtPayFast from '@/views/admin/public_debt/PublicDebtPayFast'
import PublicDebtHistory from '@/views/admin/public_debt/PublicDebtHistory'

// Fund (Quỹ)
import FundReport from '@/views/admin/fund/FundReport'

// Trade (Mua bán)
import TradeBuyHistory from '@/views/admin/trade/TradeBuyHistory'
import TradeSellHistory from '@/views/admin/trade/TradeSellHistory'
import TradeBuy from '@/views/admin/trade/TradeBuy'
import TradeSell from '@/views/admin/trade/TradeSell'
import TradeDetail from '@/views/admin/trade/TradeDetail'

// Order (Đặt hàng)
import OrderList from '@/views/admin/order/OrderList'
import OrderIndex from '@/views/admin/order/OrderIndex'
import OrderDetail from '@/views/admin/order/OrderDetail'

// Super admin group
import HomeSPAdmin from '@/views/supperAdmin/HomeSPAdmin'
import Brand from '@/views/supperAdmin/brand/BrandList'
import BrandAdd from '@/views/supperAdmin/brand/BrandIndex'
import Store from '@/views/supperAdmin/store/List'
import StoreAdd from '@/views/supperAdmin/store/Index'
import StoreAdmin from '@/views/supperAdmin/storeAdmin/List'
import StoreAdminAdd from '@/views/supperAdmin/storeAdmin/Index'
import StoreHotel from '@/views/supperAdmin/store/List'
import StoreHotelAdd from '@/views/supperAdmin/store/Index'

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
import Home from '@/views/common/Home'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },

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

    // Admin group
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

    {
      path: '/overview',
      name: 'OverView',
      component: OverView
    },
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
      path: '/staff',
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
      path: '/unit',
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
      path: '/product-brand',
      name: 'ProductBrand',
      component: ProductBrand
    },
    {
      path: '/product-brand/index',
      name: 'ProductBrandAdd',
      component: ProductBrandAdd
    },
    {
      path: '/product-brand/index/:id',
      name: 'ProductBrandEdit',
      component: ProductBrandAdd
    },

    {
      path: '/product-group',
      name: 'ProductGroupList',
      component: ProductGroupList
    },
    {
      path: '/product-group/index',
      name: 'ProductGroupAdd',
      component: ProductGroupIndex
    },
    {
      path: '/product-group/index/:id',
      name: 'ProductGroupEdit',
      component: ProductGroupIndex
    },

    {
      path: '/product-type',
      name: 'ProductTypeList',
      component: ProductTypeList
    },
    {
      path: '/product-type/index',
      name: 'ProductTypeAdd',
      component: ProductTypeIndex
    },
    {
      path: '/product-type/index/:id',
      name: 'ProductTypeEdit',
      component: ProductTypeIndex
    },

    {
      path: '/product',
      name: 'ProductList',
      component: ProductList
    },
    {
      path: '/product/index',
      name: 'ProductAdd',
      component: ProductIndex
    },
    {
      path: '/product/index/:id',
      name: 'ProductEdit',
      component: ProductIndex
    },

    {
      path: '/product-image',
      name: 'ProductImage',
      component: ProductImage
    },

    {
      path: '/product-properties',
      name: 'ProductProperties',
      component: ProductProperties
    },
    {
      path: '/product-properties/index',
      name: 'ProductPropertiesAdd',
      component: ProductPropertiesIndex
    },
    {
      path: '/product-properties/index/:id',
      name: 'ProductPropertiesEdit',
      component: ProductPropertiesIndex
    },

    {
      path: '/supplier',
      name: 'Supplier',
      component: Supplier
    },
    {
      path: '/supplier/index',
      name: 'SupplierAdd',
      component: SupplierAdd
    },
    {
      path: '/supplier/index/:id',
      name: 'SupplierEdit',
      component: SupplierAdd
    },
    {
      path: '/supplier-his',
      name: 'SupplierHistory',
      component: SupplierHistory
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

    // Repository
    {
      path: '/repo-product',
      name: 'RepositoryReport',
      component: RepositoryReport
    },
    {
      path: '/repo-history',
      name: 'RepositoryHis',
      component: RepositoryHis
    },
    {
      path: '/trade-buy',
      name: 'TradeBuyAdd',
      component: TradeBuy
    },
    {
      path: '/trade-buy/:id',
      name: 'TradeBuyEdit',
      component: TradeBuy
    },

    {
      path: '/invoice-template',
      name: 'InvoiceTemplate',
      component: InvoiceTemplate
    },
    {
      path: '/tools',
      name: 'Tools',
      component: Tools
    },
    {
      path: '/bill-report',
      name: 'BillReport',
      component: BillReport
    },
    {
      path: '/statistic',
      name: 'Statistic',
      component: Statistic
    },
    {
      path: '/chart-revenue',
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
      path: '/customer',
      name: 'CustomerList',
      component: CustomerList
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
      path: '/customer-his',
      name: 'CustomerHistory',
      component: CustomerHistory
    },

    {
      path: '/promotion',
      name: 'Promo',
      component: Promo
    },
    {
      path: '/promotion/index',
      name: 'PromoAdd',
      component: PromoAdd
    },
    {
      path: '/promotion/index/:id',
      name: 'PromoEdit',
      component: PromoAdd
    },

    {
      path: '/member/config',
      name: 'MemberConfig',
      component: MemberConfig
    },

    // Debit
    {
      path: '/debt',
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
      path: '/debt/pay-fast',
      name: 'DebtPayFast',
      component: DebtPayFast
    },
    {
      path: '/debt-his',
      name: 'DebtHistory',
      component: DebtHistory
    },

    {
      path: '/public-debt',
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
      path: '/public-debt/pay-fast',
      name: 'PublicDebtPayFast',
      component: PublicDebtPayFast
    },
    {
      path: '/public-debt-his',
      name: 'PublicDebtHistory',
      component: PublicDebtHistory
    },

    // Fund
    {
      path: '/fund',
      name: 'FundReport',
      component: FundReport
    },

    // Trade
    {
      path: '/trade-buy-his',
      name: 'TradeBuyHistory',
      component: TradeBuyHistory
    },
    {
      path: '/trade-sell-his',
      name: 'TradeSellHistory',
      component: TradeSellHistory
    },
    {
      path: '/trade-sell',
      name: 'TradeSellAdd',
      component: TradeSell
    },
    {
      path: '/trade-sell-from-order/:orderId',
      name: 'TradeSellAddFromOrder',
      component: TradeSell
    },
    {
      path: '/trade-sell/:id',
      name: 'TradeSellEdit',
      component: TradeSell
    },
    {
      path: '/trade-detail/:id',
      name: 'TradeDetail',
      component: TradeDetail
    },

    // Order
    {
      path: '/order-list',
      name: 'OrderList',
      component: OrderList
    },
    {
      path: '/order-index',
      name: 'OrderAdd',
      component: OrderIndex
    },
    {
      path: '/order-index/:id',
      name: 'OrderUpdate',
      component: OrderIndex
    },
    {
      path: '/order-detail/:id',
      name: 'OrderDetail',
      component: OrderDetail
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
      path: '/store/list',
      name: 'StoreHotel',
      component: StoreHotel
    },
    {
      path: '/store/index',
      name: 'StoreHotelAdd',
      component: StoreHotelAdd
    },
    {
      path: '/store/index/:id',
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
