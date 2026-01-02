import session from './session'
import { RootAPI } from './index'

export default {
  /**
  * ----------
  * PRODUCT
  * ----------
  */

  /**
   * Search product by staff
   */
   searchProductByStaff (params) {
    return session.post(RootAPI + 'product/search-by-staff', params)
   },

  /**
   * Get product options
   */
  getProductOption() {
    return session.get(RootAPI + 'product/get-list-product-option')
  },

  //   /**
  //  * Get product options
  //  */
  // getProductOptionWhenSale() {
  //   return session.get(RootAPI + 'product/get-product-option-when-sale')
  // },

  //  /**
  //  * Get product options in repo
  //  */
  // getProductOptionInRepo() {
  //   return session.get(RootAPI + 'product/get-list-product-option-in-repo')
  // },

   /**
   * Get product type options
   */
   getProductTypeOption() {
    return session.get(RootAPI + 'product-type/get-list-option')
   },

  // /**
  //  * Get product type options when sale
  //  */
  // getProductTypeOptionWhenSale() {
  //   return session.get(RootAPI + 'product-type/get-list-option-when-sale')
  // },

   /**
   * Get product group options
   */
   getProductGroupOption() {
    return session.get(RootAPI + 'product-group/get-list-option')
   },

  /**
   * Get product brand options
   */
  getProductBrandOption() {
    return session.get(RootAPI + 'product-brand/get-list-option')
  },

   /**
   * Delete product
   */
   deleteProduct(product_id) {
    return session.get(RootAPI + 'product/delete/' + product_id)
   },

   /**
   * Get product detail
   */
   getProductDetail(product_id) {
    return session.get(RootAPI + 'product/detail/' + product_id)
   },

  /**
   * Add new product
   */
   addProduct(params) {
    return session.post(RootAPI + 'product/add', params)
   },

   /**
   * Update product
   */
   updateProduct(params) {
    return session.post(RootAPI + 'product/update', params)
   },

   /**
  * ----------
  * PRODUCT TYPE
  * ----------
  */

  /**
   * Get all product type
   */
   getAllProductType() {
    return session.get(RootAPI + 'product-type/list')
   },

  /**
   * Get all product properties
   */
  getAllProductProperties() {
    return session.get(RootAPI + 'product-properties/list')
  },

  /**
   * Get product type detail
   */
   getProductTypeDetail(product_type_id) {
    return session.get(RootAPI + 'product-type/detail/' + product_type_id)
   },

  /**
   * Get product properties detail
   */
  getProductPropertiesDetail(product_properties_id) {
    return session.get(RootAPI + 'product-properties/detail/' + product_properties_id)
  },

  /**
   * Add new product type
   */
   addProductType(params) {
    return session.post(RootAPI + 'product-type/add', params)
   },

  /**
   * Add new product properties
   */
  addProductProperties(params) {
    return session.post(RootAPI + 'product-properties/add', params)
  },

   /**
   * Update product type
   */
   updateProductType(params) {
    return session.post(RootAPI + 'product-type/update', params)
   },

  /**
   * Update product properties
   */
  updateProductProperties(params) {
    return session.post(RootAPI + 'product-properties/update', params)
  },

   /**
   * Delete product type
   */
   deleteProductType(product_type_id) {
    return session.get(RootAPI + 'product-type/delete/' + product_type_id)
   },

  /**
   * Delete product properties
   */
  deleteProductProperties(product_type_id) {
    return session.get(RootAPI + 'product-properties/delete/' + product_type_id)
  },


   /**
  * ----------
  * PRODUCT GROUP
  * ----------
  */

  /**
   * Get all product group
   */
   getAllProductGroup() {
    return session.get(RootAPI + 'product-group/list')
   },

  /**
   * Get product group detail
   */
   getProductGroupDetail(product_group_id) {
    return session.get(RootAPI + 'product-group/detail/' + product_group_id)
   },

  /**
   * Add new product group
   */
   addProductGroup(params) {
    return session.post(RootAPI + 'product-group/add', params)
   },

   /**
   * Update product group
   */
   updateProductGroup(params) {
    return session.post(RootAPI + 'product-group/update', params)
   },

   /**
   * Delete product group
   */
   deleteProductGroup(product_group_id) {
    return session.get(RootAPI + 'product-group/delete/' + product_group_id)
   },

  /**
   * Get product image
   */
  getProductImage(productId) {
    return session.get(RootAPI + 'product/get-image-by-product-id/' + productId)
  },

  /**
   * Delete product image
   */
  deleteProductImage(param) {
    return session.post(RootAPI + 'product/delete-product-image', param)
  },

  /**
   * Upload product image
   */
  uploadProductImage(param) {
    return session.post(RootAPI + 'product/upload-product-image', param)
  },

    /**
   * Import from excel
   */
  importProductFromExcelFile(req) {
    return session.post(RootAPI + 'product/import-from-excel', req)
  },
}
