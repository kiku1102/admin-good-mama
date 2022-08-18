import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CToast,
  CToastClose,
  CToastBody,
  CToaster
} from '@coreui/react'
import React, { useEffect, useState } from 'react'

function ModalEditProduct({ openModal, closeModal, productEdit }) {
  const [productTypes, setProductTypes] = useState([])
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastError, setToastError] = useState(false)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [typeProduct, setTypeProduct] = useState("1")
  const [imageUrl, setImageUrl] = useState("")
  const [buyPrice, setBuyPrice] = useState("")
  const [amount, setAmount] = useState("")
  const [validContent, setValidContent] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [toastErrorText, setToastErrorText] = useState("Lỗi")

  const callApi = async (paramUrl, paramOptions = {}) => {
    const response = await fetch(paramUrl, paramOptions)
    const responseData = await response.json()
    return responseData
  }

  useEffect(() => {
    callApi('https://goodmamabackend.herokuapp.com/product_types/')
      .then((data) => {
        setProductTypes(data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const validateData = () => {
    if (name === "") {
      setValidContent("Chưa nhập tên loại sản phẩm")
      setIsValid(false);
      return false;
    }
    if (typeProduct === "1") {
      setValidContent("Chưa chọn loại sản phẩm")
      setIsValid(false);
      return false;
    }
    if (imageUrl === "") {
      setValidContent("Chưa có hình ảnh mô tả")
      setIsValid(false);
      return false;
    }
    if (isNaN(buyPrice)||buyPrice==="") {
      setValidContent("Chưa nhập giá gốc")
      setIsValid(false);
      return false;
    }
    if (isNaN(amount)||amount==="") {
      setValidContent("Chưa nhập số lượng")
      setIsValid(false);
      return false;
    }
    setIsValid(true);
    return true;
  }
  const callApiPutProduct = () => {
    let body = {
      method: 'PUT',
      body: JSON.stringify({
        name: name,
        type: typeProduct,
        imageUrl: imageUrl,
        buyPrice: buyPrice,
        amount: amount,
        description: description,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
    let productId = productEdit._id;
    callApi(`https://goodmamabackend.herokuapp.com/products/${productId}`, body)
      .then((data) => {
        if(data.data){
          setToastSuccess(true)
          closeModal();
        }
        else{
          setToastError(true);
          setToastErrorText(data.message)
          closeModal();
        }
      })
      .catch((err) => {
        setToastError(true);
        setToastErrorText("Sửa thất bại")
      })
  }
  const onBtnEditClick = () => {
    let isCheck = validateData();
    if (isCheck) {
      callApiPutProduct();
    }
  }

  const changeName = (event) => {
    setName(event.target.value);
  }
  const changeDescription = (event) => {
    setDescription(event.target.value)
  }
  const changeUrlImage = (event) => {
    setImageUrl(event.target.value);
  }
  const changeBuyPrice = (event) => {
    setBuyPrice(event.target.value);
  }
  const changeAmout = (event) => {
    setAmount(event.target.value);
  }
  const changeTypeProduct = (event) => {
    setTypeProduct(event.target.value);
  }
  useEffect(() => {
    setName(productEdit.name)
    setImageUrl(productEdit.imageUrl)
    setBuyPrice(productEdit.buyPrice)
    setAmount(productEdit.amount)
    setDescription(productEdit.description)
    setTypeProduct(productEdit.type)
  }, [openModal])
  return (
    <>
      <CModal visible={openModal} onClose={closeModal} backdrop="static">
        <CModalHeader onClose={closeModal}>
          <CModalTitle>Sửa thông tin sản phẩm</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-3"
            label="Tên sản phẩm"
            placeholder="Tên sản phẩm"
            value={name}
            onChange={changeName}
          />
          <CFormInput
            className="mb-3"
            label="Link ảnh"
            placeholder="Url"
            value={imageUrl}
            onChange={changeUrlImage}
          />
          <CFormInput
            className="mb-3"
            type='number'
            label="Giá niêm yết"
            placeholder="Giá niêm yết"
            value={buyPrice}
            onChange={changeBuyPrice}
          />
          <CFormInput
            className="mb-3"
            type='number'
            label="Số lượng"
            placeholder="Số lượng"
            value={amount}
            onChange={changeAmout}
          />
          <CFormSelect
            label="Loại sản phẩm"
            className="mb-3"
            value={typeProduct}
            onChange={changeTypeProduct}
          >
            <option value={'1'}>Chọn loại sản phẩm</option>
            {productTypes.map((type, index) => {
              return (
                <option key={index} value={type._id}>
                  {type.name}
                </option>
              )
            })}
          </CFormSelect>
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
            Close
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
            <CToastBody>{toastErrorText}</CToastBody>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToast>
      </CToaster>
    </>
  )
}
export default ModalEditProduct
