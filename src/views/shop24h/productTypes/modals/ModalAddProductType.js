import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CFormInput,
  CFormTextarea,
  CToast,
  CToastClose,
  CToastBody,
  CToaster
} from '@coreui/react'
import React, { useState } from 'react'

function ModalAddProductType({openModal, closeModal}) {
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastError, setToastError] = useState(false)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validContent, setValidContent] = useState("");
  const [isValid, setIsValid] = useState(true);

  const fetchAPI = async (url, body) => {
    let response = await fetch(url, body)
    let data = await response.json()
    return data
  }
  const callApiAddProduct = () => {
    let body = {
      method: 'POST',
      body: JSON.stringify({
          name: name,
          description: description,
      }),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
      },
  };
  fetchAPI("http://localhost:8000/product_types", body)
      .then((data) => {
          setToastSuccess(true)
          closeModal();
      })
      .catch((err) => {
          setToastError(true);
      })
  };
  const validateData = () => {
    if (name === "") {
      setValidContent("Chưa nhập tên loại sản phẩm")
      setIsValid(false);
    }
    setIsValid(true);
  }

  const onBtnAddClick = () => {
    validateData();
    if(isValid){
      callApiAddProduct();
    }
  }

  const changeName = (event) => {
    setName(event.target.value);
  }
  const changeDescription = (event) => {
    setDescription(event.target.value)
  }


  return (
    <>
      <CModal visible={openModal} onClose={closeModal} backdrop="static">
        <CModalHeader onClose={closeModal}>
          <CModalTitle>Thêm loại sản phẩm</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-3"
            label="Loại sản phẩm"
            placeholder="Loại sản phẩm"
            value={name}
            onChange={changeName}
          />
          <CFormTextarea
            onChange={changeDescription}
            value={description}
            label="Mô tả"
            rows="3"
          ></CFormTextarea>
        </CModalBody>
        <CModalFooter>
          {isValid ? null : <p style={{ color: 'red', paddingBottom: '2' }}>{validContent}</p>}
          <CButton color="secondary" onClick={closeModal}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={onBtnAddClick}>
            Thêm
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster placement='top-end'>
        <CToast
          color="success"
          visible={toastSuccess}
          className="text-white "
          onClose={() => setToastSuccess(false)}
        >
          <div className="d-flex">
            <CToastBody>Thêm thành công</CToastBody>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToast>
      </CToaster>

      <CToaster placement='top-end'>
        <CToast
          color="danger"
          visible={toastError}
          className="text-white "
          onClose={() => setToastError(false)}
        >
          <div className="d-flex">
            <CToastBody>Thêm thất bại</CToastBody>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToast>
      </CToaster>
    </>
  )
}
export default ModalAddProductType
