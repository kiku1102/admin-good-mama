import React, { useEffect, useState } from 'react'
import {
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CFormInput,
  CButtonGroup
} from '@coreui/react'


import { Grid, Pagination } from '@mui/material'
import ModalDeleteOrder from './modals/ModalDeleteOrder'
import ModalAddOrder from './modals/ModalAddOrder'
import ModalEditOrder from './modals/ModalEditOrder'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1);
  const [noPage, setNoPage] = useState(0);
  const [filter, setFilter] = useState("")

  const changeHandler = (event, value) => {
    setPage(value)
  }
  const fetchAPI = async (url, body) => {
    let response = await fetch(url, body)
    let data = await response.json()
    return data
  }
  function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  //Insert
  const [openModalAdd, setOpenModalAdd] = React.useState(false);

  //Sửa
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [rowEdit, setRowEdit] = useState({})

  //Xóa
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [rowDelete, setRowDelete] = useState({})


  //Insert
  const addButton = () => {
    setOpenModalAdd(true);
  }
  //Edit
  const editButtonHandler = (row) => {
    setRowEdit(row);
    setOpenModalEdit(true);
  }

  //Delete
  const deleteButtonHandler = (row) => {
    setOpenModalDelete(true)
    setRowDelete(row);
  }

  const filterButton = () => {
    if (filter === "") {
      fetchAPI('https://goodmamabackend.herokuapp.com/orders')
        .then((data) => {
          setOrders(data.data)
        })
        .catch((error) => {
          console.error(error.message)
        })
    }
    else {
      var arr = orders.filter((order, index) => {
        return order._id.toLowerCase().includes(filter.toLowerCase())
      })
      setOrders(arr)
    }
  }

  useEffect(() => {
    fetchAPI('https://goodmamabackend.herokuapp.com/orders')
      .then((data) => {
        console.log(data);
        setNoPage(Math.ceil(data.data.length / 10));
        setOrders(data.data.slice((page - 1) * 10, page * 10));
      })
      .catch((error) => {
        console.error(error.message)
      })
  }, [page, openModalAdd, openModalEdit, openModalDelete])

  return (
    <CRow>
      {/* Modal add */}
      <ModalAddOrder openModal={openModalAdd} closeModal={() => setOpenModalAdd(false)} fetchAPI={fetchAPI}></ModalAddOrder>
      {/* Modal edit */}
      <ModalEditOrder openModal={openModalEdit} closeModal={() => setOpenModalEdit(false)} orderEdit={rowEdit}></ModalEditOrder>
      {/* Modal delete */}
      <ModalDeleteOrder openModal={openModalDelete} closeModal={() => setOpenModalDelete(false)} orderDelete={rowDelete}></ModalDeleteOrder>
      <CCol xs={12}>
            <CRow xs={12} className="p-4">
              <CCol xs={6}>
                <CButton onClick={addButton}>Thêm</CButton>
              </CCol>
              <CCol xs={6}>
                <CRow xs={12}>
                  <CCol xs={6}>
                    <CFormInput placeholder='Nhập id đơn hàng' value={filter} onChange={(e) => setFilter(e.target.value)}></CFormInput>
                  </CCol>
                  <CCol xs={6}>
                    <CButton onClick={filterButton}>Tìm</CButton>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <CTable  hover  striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">STT</CTableHeaderCell>
                  <CTableHeaderCell scope="col">ID Đơn hàng</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tên khách hàng</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Số điện thoại</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Đơn hàng</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Giá tiền</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Ngày đặt hàng</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Ghi chú</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orders.map((order, index) => {
                  return (
                    <CTableRow key={index}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{order._id}</CTableDataCell>
                      <CTableDataCell>{order.customerInfo.fullName}</CTableDataCell>
                      <CTableDataCell>{order.customerInfo.phone}</CTableDataCell>                
                      <CTableDataCell>

                        {order.orderDetail.map((product, index) => {
                          return (
                          <div key={index}>
                            <p>{product.name+ " : x"+  product.quantity}</p>
                          </div>
                          )

                        })
                        }
                      </CTableDataCell>
                      <CTableDataCell>{formatNumber(order.cost)}.000VNĐ</CTableDataCell>
                      <CTableDataCell>{order.orderDate}</CTableDataCell>
                      <CTableDataCell>{order.note}</CTableDataCell>
                      <CTableDataCell>
                        <CButtonGroup variant="contained">
                          <CButton color='primary' onClick={() => { editButtonHandler(order) }}>Sửa</CButton>
                          <CButton color="danger" onClick={() => { deleteButtonHandler(order) }}>Xóa</CButton>
                        </CButtonGroup>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
      </CCol>
      <Grid container mt={3} mb={3} justifyContent="flex-end">
          <Grid item>
            <Pagination count={noPage} defaultPage={page} onChange={changeHandler}></Pagination>
          </Grid>
        </Grid>
    </CRow>
  )
}

export default Orders

