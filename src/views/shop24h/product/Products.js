import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButtonGroup,
  CFormInput
} from '@coreui/react'


import { Grid, Pagination } from '@mui/material'
import ModalDeleteProduct from './modals/ModalDeleteProduct';
import ModalEditProduct from './modals/ModalEditProduct';
import ModalAddProduct from './modals/ModalAddProduct';

const Products = () => {
  const [page, setPage] = useState(1);
  const [noPage, setNoPage] = useState(0);
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState("")
  const [productTypes, setProductTypes] = useState([])
  const changeHandler = (event, value) => {
    setPage(value)
  }
  const fetchAPI = async (url, body) => {
    let response = await fetch(url, body)
    let data = await response.json()
    return data
  }
  //Insert
  const [openAddModal, setOpenAddModal] = React.useState(false);

  //Sửa
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [rowEdit, setRowEdit] = useState({})

  //Xóa
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [rowDelete, setRowDelete] = useState({})


  //Insert
  const addButton = () => {
    setOpenAddModal(true);
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
      fetchAPI('http://localhost:8000/products')
        .then((data) => {
          setProducts(data.data)
        })
        .catch((error) => {
          console.error(error.message)
        })
    }
    else {
      var arr = products.filter((product, index) => {
        return product.name.toLowerCase().includes(filter.toLowerCase())
      })
      setProducts(arr)
    }
  }

  useEffect(() => {
    fetchAPI('http://localhost:8000/products')
      .then((data) => {
        setNoPage(Math.ceil(data.data.length / 10));
        setProducts(data.data.slice((page - 1) * 10, page * 10));
      })
      .catch((error) => {
        console.error(error.message)
      })

    fetchAPI('http://localhost:8000/product_types')
      .then((data) => {
        console.log(data);
        setProductTypes(data.data);
      })
      .catch((error) => {
        console.error(error.message)
      })
  }, [page, openAddModal, openModalEdit, openModalDelete])

  return (
    <>
      <CRow>
        {/* Modal add */}
        <ModalAddProduct openModal={openAddModal} closeModal={() => setOpenAddModal(false)}></ModalAddProduct>
        {/* Modal edit */}
        <ModalEditProduct openModal={openModalEdit} closeModal={() => setOpenModalEdit(false)} productEdit={rowEdit}></ModalEditProduct>
        {/* Modal delete */}
        <ModalDeleteProduct openModal={openModalDelete} closeModal={() => setOpenModalDelete(false)} productDelete={rowDelete}></ModalDeleteProduct>
        <CCol xs={12}>
          <CRow xs={12} className="p-4">
            <CCol xs={6}>
              <CButton onClick={addButton}>Thêm</CButton>
            </CCol>
            <CCol xs={6}>
              <CRow xs={12}>
                <CCol xs={6}>
                  <CFormInput placeholder='Nhập tên sản phẩm' value={filter} onChange={(e) => setFilter(e.target.value)}></CFormInput>
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
                <CTableHeaderCell scope="col">STT</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tên sản phẩm</CTableHeaderCell>
                <CTableHeaderCell scope="col">Loại sản phẩm</CTableHeaderCell>
                <CTableHeaderCell scope="col">Giá tiền</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
                <CTableHeaderCell scope="col">Số lượng</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {
                products.map((product, index) => {
                  return (
                    <CTableRow key={index}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{product.name}</CTableDataCell>
                      <CTableDataCell>{product.type}</CTableDataCell>
                      <CTableDataCell>{product.buyPrice}</CTableDataCell>
                      <CTableDataCell><img src={product.imageUrl} width={100} /></CTableDataCell>
                      <CTableDataCell>{product.amount}</CTableDataCell>
                      {/* <CTableDataCell width="30%">{product.description}</CTableDataCell> */}
                      <CTableDataCell>
                        <CButtonGroup variant="contained">
                          <CButton color='primary' onClick={() => { editButtonHandler(product) }}>Sửa</CButton>
                          <CButton color="danger" onClick={() => { deleteButtonHandler(product) }}>Xóa</CButton>
                        </CButtonGroup>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              }
            </CTableBody>
          </CTable>
        </CCol>
        <Grid container mt={3} mb={3} justifyContent="flex-end">
          <Grid item>
            <Pagination count={noPage} defaultPage={page} onChange={changeHandler}></Pagination>
          </Grid>
        </Grid>
      </CRow>
    </>
  )
}

export default Products
