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
import React, { useEffect, useState } from 'react'

function ModalEditProductType({ openModal, closeModal, productTypeEdit }) {
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
  const callApiEditProduct = () => {
    let body = {
      method: 'PUT',
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };
    let idEdit = productTypeEdit._id;
    fetchAPI("http://localhost:8000/product_types/" + idEdit, body)
      .then((data) => {
        setToastSuccess(true)
        closeModal();
      })
      .catch((err) => {
        setToastError(true);
      })
  };
  const onBtnEditClick = () => {
    validateData();
    if (isValid === true) {
      callApiEditProduct();
    }
  }
  const validateData = () => {
    if (name === "") {
      setValidContent("Chưa nhập tên loại sản phẩm")
      setIsValid(false);
    }
    setIsValid(true);
  }
  useEffect(() => {
    setName(productTypeEdit.name)
    setDescription(productTypeEdit.description)
  }, [openModal])

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
          <CModalTitle>Sửa thông tin loại sản phẩm</CModalTitle>
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
          <CButton color="primary" onClick={onBtnEditClick}>
            Sửa
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
            <CToastBody>Sửa thành công</CToastBody>
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
            <CToastBody>Sửa thất bại</CToastBody>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToast>
      </CToaster>
    </>
  )
}
export default ModalEditProductType
