import React from 'react'

const ProductType = React.lazy(() => import('./views/shop24h/productTypes/ProductTypes'))
const Products = React.lazy(() => import('./views/shop24h/product/Products'))
const Customers = React.lazy(() => import('./views/shop24h/customers/Customers'))
const Orders = React.lazy(() => import('./views/shop24h/orders/Orders'))
const routes = [
  { path: '/', exact: true, name: 'Trang chủ' },
  { path: '/shop24h/productTypes', name: 'Loại sản phẩm', element: ProductType },
  { path: '/shop24h/product', name: 'Sản phẩm', element: Products },
  { path: '/shop24h/customers', name: 'Khách hàng', element: Customers },
  { path: '/shop24h/orders', name: 'Đơn hàng', element: Orders },
]
export default routes
