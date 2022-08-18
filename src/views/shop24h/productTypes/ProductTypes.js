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
import ModalDeleteProductType from './modals/ModalDeleteProductType'
import ModalEditProductType from './modals/ModalEditProductType'
import ModalAddProductType from './modals/ModalAddProductType'

const ProductTypes = () => {
  const [productTypes, setProductTypes] = useState([])
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1);
  const [noPage, setNoPage] = useState(0);

  const fetchAPI = async (url, body) => {
    let response = await fetch(url, body)
    let data = await response.json()
    return data
  }

  const changeHandler = (event, value) => {
    setPage(value)
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
      fetchAPI('https://goodmamabackend.herokuapp.com/product_types')
        .then((data) => {
        setProductTypes(data.data)
        })
        .catch((error) => {
          console.error(error.message)
        })
    }
    else {
      var arr = productTypes.filter((type, index) => {
        return type.name.toLowerCase().includes(filter.toLowerCase())
      })
      setProductTypes(arr)
    }
  }

  useEffect(() => {
    fetchAPI('https://goodmamabackend.herokuapp.com/product_types')
      .then((data) => {
        setNoPage(Math.ceil(data.data.length / 10));
        setProductTypes(data.data.slice((page - 1) * 10, page * 10));
      })
      .catch((error) => {
        console.error(error.message)
      })
  }, [openAddModal, openModalEdit, openModalDelete])

  return (
    <CRow>
      {/* Modal add */}
      <ModalAddProductType openModal={openAddModal} closeModal={() => setOpenAddModal(false)}></ModalAddProductType>
      {/* Modad Edit */}
      <ModalEditProductType openModal={openModalEdit} closeModal={() => setOpenModalEdit(false)} productTypeEdit={rowEdit}></ModalEditProductType>
      {/*Modal delete */}
      <ModalDeleteProductType openModal={openModalDelete} closeModal={() => setOpenModalDelete(false)} productTypeDelete={rowDelete}></ModalDeleteProductType>
     
      <CCol xs={12}>
          <CRow xs={12} className="p-4">
                <CCol xs={6}>
                  <CButton onClick={addButton}>Thêm</CButton>
                </CCol>
                <CCol xs={6}>
                  <CRow xs={12}>
                    <CCol xs={6}>
                      <CFormInput placeholder='Nhập tên loại sản phẩm' value={filter} onChange={(e) => setFilter(e.target.value)}></CFormInput>
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
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tên </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mô tả</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {productTypes.map((type, index) => {
                  return (
                    <CTableRow key={index}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{type.name}</CTableDataCell>
                      <CTableDataCell>{type.description}</CTableDataCell>
                      <CTableDataCell>
                      <CButtonGroup variant="contained" >
                        <CButton color='primary' onClick={() => { editButtonHandler(type) }}>Sửa</CButton>
                        <CButton color="danger" onClick={() => { deleteButtonHandler(type) }}>Xóa</CButton>
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

export default ProductTypes
