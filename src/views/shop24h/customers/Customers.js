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
  CButtonGroup,
  CFormInput
} from '@coreui/react'


import { Grid, Pagination } from '@mui/material'
import ModalDeleteCustomer from './modals/ModalDeleteCustomer'
import ModalAddCustomer from './modals/modalAddCustomer'
import ModalEditCustomer from './modals/modalEditCustomer'
import ModalDetail from './modals/modalDetail'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1);
  const [noPage, setNoPage] = useState(0);

  const changeHandler = (event, value) => {
    setPage(value)
  }

  const fetchAPI = async (url, body) => {
    let response = await fetch(url, body)
    let data = await response.json()
    return data
  }
  //Insert
  const [openModalAdd, setOpenModalAdd] = React.useState(false);

  //Sửa
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [rowEdit, setRowEdit] = useState({})

  //Xóa
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [rowDelete, setRowDelete] = useState({})

  //Chi tiết
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [rowDetail, setRowDetail] = useState()

  //Chi tiết
  const detailButton = (detail) => {
    setRowDetail(detail)
    setOpenModalDetail(true)
  }

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
      fetchAPI('http://localhost:8000/customers')
        .then((data) => {          
          setCustomers(data.data)
        })
        .catch((error) => {
          console.error(error.message)
        })
    }
    else {
      var arr = customers.filter((customer, index) => {
        return customer.phone.includes(filter)
      })
      setCustomers(arr)
    }
  }

  useEffect(() => {
    fetchAPI('http://localhost:8000/customers')
      .then((data) => {
        setNoPage(Math.ceil(data.data.length / 10));
        setCustomers(data.data.slice((page - 1) * 10, page * 10));
      })
      .catch((error) => {
        console.error(error.message)
      })
  }, [page, openModalAdd, openModalEdit, openModalDelete])

  return (
    <CRow>
      {/* Modal add */}
      <ModalAddCustomer openModal={openModalAdd} closeModal={() => setOpenModalAdd(false)} fetchAPI={fetchAPI}></ModalAddCustomer>
      {/* Modal edit */}
      <ModalEditCustomer openModal={openModalEdit} closeModal={() => setOpenModalEdit(false)} customerEdit={rowEdit} fetchAPI={fetchAPI}></ModalEditCustomer>
      {/* Modal Delete */}
      <ModalDeleteCustomer openModal={openModalDelete} closeModal={() => setOpenModalDelete(false)} customerDelete={rowDelete} fetchAPI={fetchAPI}></ModalDeleteCustomer>
      {/* Modal Detail */}
      <ModalDetail openModal={openModalDetail} closeModal={() => setOpenModalDetail(false)} orderDetails={rowDetail}></ModalDetail>
      <CCol xs={12}>
        <CRow xs={12} className="p-4">
          <CCol xs={6}>
            <CButton onClick={addButton}>Thêm</CButton>
          </CCol>
          <CCol xs={6}>
            <CRow xs={12}>
              <CCol xs={6}>
                <CFormInput placeholder='Nhập số điện thoại' value={filter} onChange={(e) => setFilter(e.target.value)}></CFormInput>
              </CCol>
              <CCol xs={6}>
                <CButton onClick={filterButton}>Tìm</CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        <CTable hover  striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Họ và Tên</CTableHeaderCell>
              <CTableHeaderCell scope="col">số điện thoại</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Địa chỉ</CTableHeaderCell>
              <CTableHeaderCell scope="col">Đơn hàng</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {customers.map((customer, index) => {
              return (
                <CTableRow key={index}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{customer.fullName}</CTableDataCell>
                  <CTableDataCell>{customer.phone}</CTableDataCell>
                  <CTableDataCell>{customer.email}</CTableDataCell>
                  <CTableDataCell>{customer.address}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color='info' onClick={() => detailButton(customer)}>Chi tiết</CButton>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButtonGroup variant="contained" aria-label="outlined primary button group">
                      <CButton color='primary' onClick={() => { editButtonHandler(customer) }}>Sửa</CButton>
                      <CButton color="danger" onClick={() => { deleteButtonHandler(customer) }}>Xóa</CButton>
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

export default Customers
