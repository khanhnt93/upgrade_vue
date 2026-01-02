import Vue from 'vue'
import Router from 'vue-router'

// Staff group
import StaffLogin from '@/views/staff/StaffLogin'
import StaffChangePass from '@/views/staff/StaffChangePass'

/**
 * Admin group
  */
// Customer
import CustomerList from '@/views/admin/customer/CustomerList'
import CustomerIndex from '@/views/admin/customer/CustomerIndex'
import CustomerHistory from '@/views/admin/customer/CustomerHistory'

// Khoản vay
import LoanInList from '@/views/admin/loan/LoanInList'
import LoanInIndex from '@/views/admin/loan/LoanInIndex'
import LoanOutList from '@/views/admin/loan/LoanOutList'
import LoanOutIndex from '@/views/admin/loan/LoanOutIndex'
import AdvanceList from '@/views/admin/loan/AdvanceList'
import AdvanceIndex from '@/views/admin/loan/AdvanceIndex'
import LoanOutPayment from '@/views/admin/loan/LoanOutPayment'
import LoanInPayment from '@/views/admin/loan/LoanInPayment'
import AdvancePayment from '@/views/admin/loan/AdvancePayment'

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

// Project
import ProjectList from '@/views/admin/project/ProjectList'
import ProjectIndex from '@/views/admin/project/ProjectIndex'

// Report
import DetailReport from '@/views/admin/report/DetailReport'
import SummaryReport from '@/views/admin/report/SummaryReport'
import PerformanceReport from '@/views/admin/report/PerformanceReport'
import CustomerReport from '@/views/admin/report/CustomerReport'
import ExpendReport from '@/views/admin/report/ExpendReport'

// Repository
import RepositoryReport from '@/views/admin/repository/RepositoryReport'
import RepositoryHis from '@/views/admin/repository/RepositoryHis'
import RepositoryCorrectionHis from '@/views/admin/repository/RepositoryCorrectionHis'
import RepositoryInput from '@/views/admin/repository/RepositoryInput'
import RepositoryOutput from '@/views/admin/repository/RepositoryOutput'

// Resource
import Resource from '@/views/admin/resource/ResourceList'
import ResourceAdd from '@/views/admin/resource/ResourceIndex'

// Role
import Role from '@/views/admin/role/RoleList'
import RoleAdd from '@/views/admin/role/RoleIndex'

// Staff
import Staff from '@/views/admin/staff/List'
import StaffAdd from '@/views/admin/staff/Index'

// Unit
import Unit from '@/views/admin/unit/UnitList'
import UnitAdd from '@/views/admin/unit/UnitIndex'
import UnitConversion from '@/views/admin/unit/UnitConversion'

// Bank account
import BankAccount from '@/views/admin/bank_account/BankAccountList'
import BankAccountIndex from '@/views/admin/bank_account/BankAccountIndex'

// Product brand
import ProductBrand from '@/views/admin/product_brand/ProductBrandList'
import ProductBrandAdd from '@/views/admin/product_brand/ProductBrandIndex'

// Supplier
import Supplier from '@/views/admin/supplier/SupplierList'
import SupplierAdd from '@/views/admin/supplier/SupplierIndex'
import SupplierHistory from '@/views/admin/supplier/SupplierHistory'

// Công nợ
import DebtList from '@/views/admin/debt/DebtList'
import DebtPay from '@/views/admin/debt/DebtPay'

// Nợ công
import PublicDebtList from '@/views/admin/public_debt/PublicDebtList'
import PublicDebtPay from '@/views/admin/public_debt/PublicDebtPay'

// Fund (Quỹ)
import FundReport from '@/views/admin/fund/FundReport'
import Income from '@/views/admin/fund/Income'
import Expend from '@/views/admin/fund/Expend'
import AccountingSlip from '@/views/admin/fund/AccountingSlip'
import FundSetting from '@/views/admin/fund/FundSetting'
import EditFundHis from '@/views/admin/fund/EditFundHis'
import FundHistoryDetail from '@/views/admin/fund/FundHisDetail'
import DebtReliefHis from '@/views/admin/fund/DebtReliefHis'

// Quotation
import QuotationListAll from '@/views/admin/quotation/QuotationListAll'
import QuotationIndexAll from '@/views/admin/quotation/QuotationIndexAll'
import QuotationAllDetail from '@/views/admin/quotation/QuotationAllDetail'

// Quotation customer care
import QuotationCustomerCareList from '@/views/admin/quotation_customer_care/QuotationCustomerCareList'

// Order sell
import OrderSellList from '@/views/admin/order_sell/OrderSellList'
import OrderSellIndex from '@/views/admin/order_sell/OrderSellIndex'
import OrderSellDetail from '@/views/admin/order_sell/OrderSellDetail'
import OrderSellBack from '@/views/admin/order_sell/OrderSellBack'

// Order buy
import OrderBuyList from '@/views/admin/order_buy/OrderBuyList'
import OrderBuyIndex from '@/views/admin/order_buy/OrderBuyIndex'
import OrderBuyIndexRepo from '@/views/admin/order_buy/OrderBuyIndexRepo'
import OrderBuyDetail from '@/views/admin/order_buy/OrderBuyDetail'
import OrderBuyBack from '@/views/admin/order_buy/OrderBuyBack'

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
import Contact from '@/views/common/contact'
import AboutUs from '@/views/common/aboutUs'
import Tutorial from '@/views/common/tutorial'
import Home from '@/views/common/Home'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'ciPro',
      component: Home
    },

    // Authenticate group
    {
      path: '/staff-login',
      name: 'Đăng nhập',
      component: StaffLogin
    },
    {
      path: '/staff-change-password',
      name: 'Thay đổi mật khẩu',
      component: StaffChangePass
    },

    // Admin group
    {
      path: '/overview',
      name: 'Tổng quan',
      component: OverView
    },
    {
      path: '/role',
      name: 'QL Phân quyền',
      component: Role
    },
    {
      path: '/role/index',
      name: 'Thêm mới phân quyền',
      component: RoleAdd
    },
    {
      path: '/role/index/:id',
      name: 'Cập nhật phân quyền',
      component: RoleAdd
    },
    {
      path: '/staff',
      name: 'QL nhân viên',
      component: Staff
    },
    {
      path: '/staff/index',
      name: 'Thêm mới nhân viên',
      component: StaffAdd
    },
    {
      path: '/staff/index/:id',
      name: 'Cập nhật nhân viên',
      component: StaffAdd
    },
    // {
    //   path: '/promo/list',
    //   name: 'Promo',
    //   component: Promo
    // },
    // {
    //   path: '/promo/index',
    //   name: 'PromoAdd',
    //   component: PromoAdd
    // },
    // {
    //   path: '/promo/index/:id',
    //   name: 'PromoEdit',
    //   component: PromoAdd
    // },
    {
      path: '/unit',
      name: 'QL đơn vị',
      component: Unit
    },
    {
      path: '/unit/index',
      name: 'Thêm mới đơn vị',
      component: UnitAdd
    },
    {
      path: '/unit/index/:id',
      name: 'Cập nhật đơn vị',
      component: UnitAdd
    },
    {
      path: '/unit-conversion',
      name: 'Chuyển đổi đơn vị',
      component: UnitConversion
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

    {
      path: '/product-brand',
      name: 'QL hãng sản phẩm',
      component: ProductBrand
    },
    {
      path: '/product-brand/index',
      name: 'Thêm mới hãng sản phẩm',
      component: ProductBrandAdd
    },
    {
      path: '/product-brand/index/:id',
      name: 'Cập nhật hãng sản phẩm',
      component: ProductBrandAdd
    },

    {
      path: '/product-group',
      name: 'QL nhóm sản phẩm',
      component: ProductGroupList
    },
    {
      path: '/product-group/index',
      name: 'Thêm mới nhóm sản phẩm',
      component: ProductGroupIndex
    },
    {
      path: '/product-group/index/:id',
      name: 'Cập nhật nhóm sản phẩm',
      component: ProductGroupIndex
    },

    {
      path: '/product-type',
      name: 'QL loại sản phẩm',
      component: ProductTypeList
    },
    {
      path: '/product-type/index',
      name: 'Thêm mới loại sản phẩm',
      component: ProductTypeIndex
    },
    {
      path: '/product-type/index/:id',
      name: 'Cập nhật loại sản phẩm',
      component: ProductTypeIndex
    },

    {
      path: '/product',
      name: 'QL sản phẩm',
      component: ProductList
    },
    {
      path: '/product/index',
      name: 'Thêm mới sản phẩm',
      component: ProductIndex
    },
    {
      path: '/product/index/:id',
      name: 'Cập nhật sản phẩm',
      component: ProductIndex
    },

    {
      path: '/product-image',
      name: 'QL hình ảnh sản phẩm',
      component: ProductImage
    },

    {
      path: '/product-properties',
      name: 'QL thuộc tính sản phẩm',
      component: ProductProperties
    },
    {
      path: '/product-properties/index',
      name: 'Thêm mới thuộc tính sản phẩm',
      component: ProductPropertiesIndex
    },
    {
      path: '/product-properties/index/:id',
      name: 'Cập nhật thuộc tính sản phẩm',
      component: ProductPropertiesIndex
    },

    {
      path: '/project',
      name: 'QL dự án mẫu',
      component: ProjectList
    },
    {
      path: '/project/index',
      name: 'Thêm mới dự án mẫu',
      component: ProjectIndex
    },
    {
      path: '/project/index/:id',
      name: 'Cập nhật dự án mẫu',
      component: ProjectIndex
    },

    {
      path: '/supplier',
      name: 'Ql nhà cung cấp',
      component: Supplier
    },
    {
      path: '/supplier/index',
      name: 'Thêm mới nhà cung cấp',
      component: SupplierAdd
    },
    {
      path: '/supplier/index/:id',
      name: 'Cập nhật nhà cung cấp',
      component: SupplierAdd
    },
    {
      path: '/supplier-his',
      name: 'Lịch sử nhà cung cấp',
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
      name: 'Sản phẩm trong kho',
      component: RepositoryReport
    },
    {
      path: '/repo-history',
      name: 'Lịch sử kho hàng',
      component: RepositoryHis
    },
    {
      path: '/repo-correction-history',
      name: 'Lịch sử hiệu chỉnh kho',
      component: RepositoryCorrectionHis
    },
    {
      path: '/repo-input',
      name: 'Nhập kho',
      component: RepositoryInput
    },
    {
      path: '/repo-correction-input',
      name: 'Nhập kho do hiệu chỉnh',
      component: RepositoryInput
    },
    {
      path: '/repository-from-order-buy/:id',
      name: 'Nhập kho tù đơn hàng mua',
      component: RepositoryInput
    },
    {
      path: '/repo-output',
      name: 'Xuất kho',
      component: RepositoryOutput
    },
    {
      path: '/repo-correction-output',
      name: 'Xuất kho do hiệu chỉnh',
      component: RepositoryOutput
    },
    {
      path: '/repository-from-order-sell/:id',
      name: 'Xuất kho từ đơn hàng bán',
      component: RepositoryOutput
    },

    {
      path: '/detail-report',
      name: 'Báo cáo chi tiết',
      component: DetailReport
    },
    {
      path: '/summary-report',
      name: 'Báo cáo tổng quát',
      component: SummaryReport
    },
    {
      path: '/performance-report',
      name: 'Báo cáo hiệu quả KD',
      component: PerformanceReport
    },
    {
      path: '/customer-report',
      name: 'Báo cáo khách hàng',
      component: CustomerReport
    },
    {
      path: '/expend-report',
      name: 'Báo cáo chi phí',
      component: ExpendReport
    },

    {
      path: '/loan-out',
      name: 'QL cho vay ',
      component: LoanOutList
    },
    {
      path: '/loan-out/add',
      name: 'Thêm mới cho vay',
      component: LoanOutIndex
    },
    {
      path: '/loan-out/edit/:id',
      name: 'Cập nhật cho vay',
      component: LoanOutIndex
    },

    {
      path: '/loan-in',
      name: 'QL đi vay ',
      component: LoanInList
    },
    {
      path: '/loan-in/add',
      name: 'Thêm mới đi vay',
      component: LoanInIndex
    },
    {
      path: '/loan-in/edit/:id',
      name: 'Cập nhật đi vay',
      component: LoanInIndex
    },

    {
      path: '/advance',
      name: 'QL tạm ứng ',
      component: AdvanceList
    },
    {
      path: '/advance/add',
      name: 'Thêm mới tạm ứng',
      component: AdvanceIndex
    },
    {
      path: '/advance/edit/:id',
      name: 'Cập nhật tạm ứng',
      component: AdvanceIndex
    },

    {
      path: '/loan-out-payment/:id',
      name: 'Tất toán khoản cho vay',
      component: LoanOutPayment
    },
    {
      path: '/loan-in-payment/:id',
      name: 'Tất toán khoản đi vay',
      component: LoanInPayment
    },
    {
      path: '/advance-payment/:id',
      name: 'Tất toán khoản tạm ứng',
      component: AdvancePayment
    },

    {
      path: '/customer',
      name: 'QL khách hàng',
      component: CustomerList
    },
    {
      path: '/customer/add',
      name: 'Thêm mới khách hàng',
      component: CustomerIndex
    },
    {
      path: '/customer/edit/:id',
      name: 'Cập nhật khách hàng',
      component: CustomerIndex
    },
    {
      path: '/customer-his',
      name: 'QL lịch sử khách hàng',
      component: CustomerHistory
    },

    {
      path: '/customer-sale',
      name: 'DS khách hàng',
      component: CustomerList
    },
    {
      path: '/customer-sale/add',
      name: 'Thêm KH',
      component: CustomerIndex
    },
    {
      path: '/customer-sale/edit/:id',
      name: 'Cập nhật KH',
      component: CustomerIndex
    },
    {
      path: '/customer-sale-his',
      name: 'DS lịch sử khách hàng',
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

    // Debit
    {
      path: '/debt',
      name: 'QL nợ phải thu',
      component: DebtList
    },
    {
      path: '/debt/pay',
      name: 'Thanh toán nợ phải thu',
      component: DebtPay
    },
    {
      path: '/debt-sale',
      name: 'DS nợ phải thu',
      component: DebtList
    },

    {
      path: '/public-debt',
      name: 'QL nợ phải trả',
      component: PublicDebtList
    },
    {
      path: '/public-debt/pay',
      name: 'Thanh toán nợ phải trả',
      component: PublicDebtPay
    },

    // Fund
    {
      path: '/fund',
      name: 'QL quỹ',
      component: FundReport
    },
    {
      path: '/income',
      name: 'Thêm khoản thu',
      component: Income
    },
    {
      path: '/income/:fundHisId',
      name: 'Sửa khoản thu',
      component: Income
    },
    {
      path: '/income-from-order-sell/:id',
      name: 'Thêm khoản thu từ ĐH bán',
      component: Income
    },
    {
      path: '/income-from-product-back/:id',
      name: 'Thêm khoản thu từ trả hàng nhập',
      component: Income
    },
    {
      path: '/income-from-order-buy/:id',
      name: 'Thêm khoản thu do xoá nợ',
      component: Income
    },
    {
      path: '/expend',
      name: 'Thêm khoản chi',
      component: Expend
    },
    {
      path: '/expend/:fundHisId',
      name: 'Sửa khoản chi',
      component: Expend
    },
    {
      path: '/expend-from-money-back/:id',
      name: 'Thêm khoản chi trả lại tiền cho khách',
      component: Expend
    },
    {
      path: '/expend-from-order-sell/:id',
      name: 'Thêm khoản chi phí bán hàng',
      component: Expend
    },
    {
      path: '/expend-from-order-buy/:id',
      name: 'Thêm khoản chi từ ĐH nhập',
      component: Expend
    },
    {
      path: '/accounting-slip',
      name: 'AccountingSlip',
      component: AccountingSlip
    },
    {
      path: '/edit-fund-his',
      name: 'Lịch sử sửa phiếu thu/chi',
      component: EditFundHis
    },
    {
      path: '/relief-fund-his',
      name: 'Lịch sử xoá nợ',
      component: DebtReliefHis
    },
    {
      path: '/fund-setting',
      name: 'Thiết lập quỹ',
      component: FundSetting
    },
    {
      path: '/fund-history-detail/:id',
      name: 'Chi tiết phiếu thu-chi',
      component: FundHistoryDetail
    },

    // Quotation (Báo giá)
    {
      path: '/quotation-all',
      name: 'QL báo giá',
      component: QuotationListAll
    },
    {
      path: '/quotation-all/index',
      name: 'Thêm mới báo giá',
      component: QuotationIndexAll
    },
    {
      path: '/quotation-all/index/:id',
      name: 'Cập nhật báo giá',
      component: QuotationIndexAll
    },
    {
      path: '/quotation-all/detail/:id',
      name: 'Chi tiết báo giá',
      component: QuotationAllDetail
    },
    {
      path: '/quotation-staff',
      name: 'DS báo giá',
      component: QuotationListAll
    },
    {
      path: '/quotation-staff/index',
      name: 'Thêm mới BG',
      component: QuotationIndexAll
    },
    {
      path: '/quotation-staff/index/:id',
      name: 'Cập nhật BG',
      component: QuotationIndexAll
    },
    {
      path: '/quotation-staff/detail/:id',
      name: 'Chi tiết BG',
      component: QuotationAllDetail
    },

    // Báo giá dự án
    {
      path: '/quotation-project-all/index',
      name: 'Thêm mới báo giá dự án',
      component: QuotationIndexAll
    },
    {
      path: '/quotation-project-all/index/:id',
      name: 'Cập nhật báo giá dự án',
      component: QuotationIndexAll
    },
    {
      path: '/quotation-project-all/detail/:id',
      name: 'Chi tiết báo giá dự án',
      component: QuotationAllDetail
    },
    {
      path: '/quotation-project-staff/index',
      name: 'Thêm mới BG dự án',
      component: QuotationIndexAll
    },
    {
      path: '/quotation-project-staff/index/:id',
      name: 'Cập nhật BG dự án',
      component: QuotationIndexAll
    },
    {
      path: '/quotation-project-staff/detail/:id',
      name: 'Chi tiết BG dự án',
      component: QuotationAllDetail
    },

    {
      path: '/quotation-care-all',
      name: 'QL chăm sóc báo giá',
      component: QuotationCustomerCareList
    },
    {
      path: '/quotation-care-staff',
      name: 'DS chăm sóc báo giá',
      component: QuotationCustomerCareList
    },

    // Order sell (Đơn hàng bán)
    {
      path: '/order-sell-all',
      name: 'QL đơn hàng bán',
      component: OrderSellList
    },
    {
      path: '/order-sell-all/index',
      name: 'Thêm mới ĐH bán',
      component: OrderSellIndex
    },
    {
      path: '/order-sell-all/index/:id',
      name: 'Cập nhật ĐH bán',
      component: OrderSellIndex
    },
    {
      path: '/order-sell-all/detail/:id',
      name: 'Chi tiết ĐH bán',
      component: OrderSellDetail
    },
    {
      path: '/order-sell-staff',
      name: 'DS đơn hàng bán',
      component: OrderSellList
    },
    {
      path: '/order-sell-staff/index',
      name: 'Thêm mới đơn hàng bán',
      component: OrderSellIndex
    },
    {
      path: '/order-sell-staff/index/:id',
      name: 'Cập nhật đơn hàng bán',
      component: OrderSellIndex
    },
    {
      path: '/order-sell-by-quotation-staff/:quotationId',
      name: 'Thêm mới đơn hàng bán từ BG',
      component: OrderSellIndex
    },
    {
      path: '/order-sell-by-quotation/:quotationId',
      name: 'Thêm mới ĐH bán từ BG',
      component: OrderSellIndex
    },
    {
      path: '/order-sell-staff/detail/:id',
      name: 'Chi tiết đơn hàng bán',
      component: OrderSellDetail
    },
    {
      path: '/order-sell-back/:id',
      name: 'Trả hàng bán',
      component: OrderSellBack
    },

    // Order buy (Đơn hàng nhập)
    {
      path: '/order-buy',
      name: 'Danh sách ĐH nhập',
      component: OrderBuyList
    },
    {
      path: '/order-buy/index',
      name: 'Thêm mới ĐH nhập',
      component: OrderBuyIndex
    },
    {
      path: '/order-buy/index/:id',
      name: 'Cập nhật ĐH nhập',
      component: OrderBuyIndex
    },
    {
      path: '/order-buy/index-repo',
      name: 'Thêm mới nhập kho',
      component: OrderBuyIndexRepo
    },
    {
      path: '/order-buy/index-repo/:id',
      name: 'Cập nhật nhập kho',
      component: OrderBuyIndexRepo
    },
    {
      path: '/order-buy/detail/:id',
      name: 'Chi tiết ĐH nhập',
      component: OrderBuyDetail
    },
    {
      path: '/order-buy-from-order-sell/:orderSellId',
      name: 'Thêm mới ĐH nhập từ ĐH bán',
      component: OrderBuyIndex
    },
    {
      path: '/order-buy-back/:id',
      name: 'Trả hàng nhập',
      component: OrderBuyBack
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
    { path: '/contact', name: 'Contact', component: Contact },
    { path: '/tutorial', name: 'Tutorial', component: Tutorial },
    { path: '/about-us', name: 'AboutUs', component: AboutUs },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.name;
  next();
})

export default router

