import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilList, cilNotes, cibProductHunt, cilPeople } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Sản phẩm',
    to: '/shop24h/product',
    icon: <CIcon icon={cibProductHunt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Loại sản phẩm',
    to: '/shop24h/productTypes',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Đơn hàng',
    to: '/shop24h/orders',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Khách hàng',
    to: '/shop24h/customers',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
]
export default _nav
