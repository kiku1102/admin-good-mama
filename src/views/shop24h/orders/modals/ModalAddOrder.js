import {
    CButton, CCol, CFormInput, CFormSelect, CFormTextarea, CModal, CModalBody,
    CModalFooter, CModalHeader, CModalTitle, CRow, CToast, CToastBody, CToastClose, CToaster,
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { useEffect, useState } from 'react';
import { cilDelete } from '@coreui/icons'
import React from 'react';



function ModalAddOrder({ openModal, closeModal }) {
    const [products, setProducts] = useState([])
    const [toastSuccess, setToastSuccess] = useState(false)
    const [toastError, setToastError] = useState(false)
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [note, setNote] = useState("")
    const [cost, setCost] = useState(0)
    const [orderDetail, setOrderDetail] = useState([])
    const [count, setCount] = useState(0)
    const [validContent, setValidContent] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [toastErrorText, setToastErrorText] = useState("Lỗi")

    const fetchAPI = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    };

    const onBtnAddClick = () => {
        const isCheck = validateData();
        if (isCheck) {
            fetchAPI("http://localhost:8000/customers?phoneNumber=" + phone)
                .then((data) => {
                    if (data.data.length === 0) {
                        createOrderForNewCustomer();
                    } else {
                        callApiCreateOrder(data.data[0]);
                    }
                })
                .catch((error) => {
                    setToastError(true)
                    console.error(error.message)
                })
        }
    }

    const callApiCreateOrder = (customer) => {
        const customerId = customer._id;
        let body = {
            method: "POST",
            body: JSON.stringify({
                orderDetail: getBuyList(),
                cost: cost,
                note: note,
                customerInfo: customer
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        fetchAPI(`http://localhost:8000/customers/${customerId}/orders`, body)
            .then((data) => {
                console.log(data.data)
                setToastSuccess(true);
                closeModal();
            })
            .catch((error) => {
                setToastError(true)
                console.error(error.message)
            })
    }

    const createOrderForNewCustomer = () => {
        let body = {
            method: "POST",
            body: JSON.stringify({
                fullName: fullName,
                phone: phone,
                email: email,
                address: address,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        fetchAPI('http://localhost:8000/customers', body)
            .then((data) => {
                if (data.data) {
                    callApiCreateOrder(data.data)
                }
                else {
                    setToastError(true)
                    setToastErrorText(data.message)
                    closeModal();
                }
            })
            .catch((error) => {
                setToastError(true)
                setToastErrorText(error.message)
                closeModal();
            })
    }


    const validateData = () => {
        if (!fullName) {
            setValidContent("Chưa nhập họ và tên")
            setIsValid(false);
            return false
        }
        if (isNaN(phone) || phone === "") {
            setValidContent("Số điện thoại không hợp lệ");
            setIsValid(false);
            return false
        }
        if (email.indexOf("@") === -1) {
            setValidContent("Email không hợp lệ");
            setIsValid(false);
            return false
        }
        if (!address) {
            setValidContent("Chưa nhập địa chỉ");
            setIsValid(false);
            return false
        }
        if (orderDetail.length === 0) {
            setValidContent("Chưa có sản phẩm")
            setIsValid(false);
            return false
        }
        if (orderDetail.length === 0) {
            setValidContent("Chưa có sản phẩm")
            setIsValid(false);
            return false
        }
        for (let i = 0; i < orderDetail.length; i++) {
            if (orderDetail[i].id === "") {
                setValidContent("Chưa chọn tên sản phẩm")
                setIsValid(false);
                return false
            }
        }
        setValidContent("");
        setIsValid(true);
        return true;

    }

    const getBuyList = () => {
        let newBuyList = [];
        orderDetail.forEach((item, index) => {
            let itemId = item.id;
            let productSelected = products.filter((product, index) => {
                return product._id === itemId
            })
            productSelected[0] = { ...productSelected[0], quantity: item.quantity }
            newBuyList = [...newBuyList, productSelected[0]];
        });
        return newBuyList;
    }
    const onBtnAddNewProduct = () => {
        let newOrderDetail = {
            id: "",
            quantity: 1,
            price: 0
        }
        setOrderDetail([...orderDetail, newOrderDetail])
        setCount(count + 1)
    }

    function priceFormat(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
    function sumTotal(orderDetail) {
        const sum = orderDetail.reduce((preValue, product) => {
            return preValue + product.price;
        }, 0);
        return sum
    }
    function getPrice(paramId) {
        let productSelected = [];
        if (paramId) {
            productSelected = products.filter((product, index) => {
                return product._id === paramId
            })
        }
        return productSelected[0].buyPrice
    }

    const changeSelectProduct = (event, index) => {
        const productId = event.target.value;
        orderDetail[index].id = productId
        orderDetail[index].price = getPrice(orderDetail[index].id) * parseInt(orderDetail[index].quantity)
        setOrderDetail([...orderDetail])
    }

    const changeQuantity = (event, index) => {
        if (event.target.value > 0 && orderDetail[index].id !== "") {
            orderDetail[index].quantity = event.target.value;
            orderDetail[index].price = getPrice(orderDetail[index].id) * parseInt(orderDetail[index].quantity)
            setOrderDetail([...orderDetail])
        }
    }

    const onBtnDeleteClick = (index) => {
        orderDetail.splice(index, 1);
        setCount(count - 1);
        setOrderDetail([...orderDetail]);
    }
    useEffect(() => {
        fetchAPI('http://localhost:8000/products')
            .then((data) => {
                setProducts(data.data)
            })
            .catch((error) => {
                console.error(error.message)
            })
    }, [])

    useEffect(() => {
        setCost(sumTotal(orderDetail))
    }, [orderDetail])


    useEffect(() => {
        setFullName("");
        setPhone("");
        setEmail("");
        setAddress("");
        setNote("");
        setCost(0)
        setOrderDetail([])
        setCount(0)
        setValidContent("");
        setIsValid(true);

    }, [closeModal])
    return (
        <>
            <CModal visible={openModal} onClose={closeModal} backdrop="static" size='lg'>
                <CModalHeader onClose={closeModal}>
                    <CModalTitle>Thêm đơn hàng</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs={4}>
                            <CFormInput className='mb-3'
                                label="Họ và tên"
                                placeholder="Họ và tên"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <CFormInput className='mb-3'
                                label="Số điện thoại"
                                placeholder="Số điện thoại"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <CFormInput className='mb-3'
                                label="Email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <CFormInput className='mb-3'
                                label="Địa chỉ"
                                placeholder="Địa chỉ"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </CCol>
                        <CCol xs={8} className="text-center">
                            <CButton className='mt-3' onClick={onBtnAddNewProduct}>Thêm sản phẩm</CButton>
                            {
                                Array.from({ length: count }, (v, i) => {
                                    return (
                                        <CRow xs={12} key={i} className='mt-2'>
                                            <CCol xs={5}>
                                                <CFormSelect
                                                    value={orderDetail[i].id}
                                                    onChange={(e) => { changeSelectProduct(e, i) }}>
                                                    <option value={"1"}>Chọn sản phẩm</option>
                                                    {
                                                        products.map((product, index) => {
                                                            return <option key={index} value={product._id}>{product.name}</option>
                                                        })
                                                    }
                                                </CFormSelect>
                                            </CCol>
                                            <CCol xs={2}>
                                                <CFormInput

                                                    placeholder="Số lượng"
                                                    value={orderDetail[i].quantity}

                                                    onChange={(e) => { changeQuantity(e, i) }}
                                                />
                                            </CCol>
                                            <CCol xs={3}>
                                                <CFormInput
                                                    disabled
                                                    placeholder="Giá"
                                                    value={priceFormat(orderDetail[i].price)}
                                                />
                                            </CCol>
                                            <CCol xs={1}>
                                                <button className="btn btn-danger " type="button">
                                                    <CIcon icon={cilDelete} onClick={() => onBtnDeleteClick(i)} />
                                                </button>
                                            </CCol>
                                        </CRow>

                                    )
                                })
                            }
                        </CCol>
                    </CRow>

                    <CRow>
                        <CCol xs={12}>
                            <CFormTextarea
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                                label="Note"
                                rows="3"
                                className='mb-2'
                            ></CFormTextarea>
                        </CCol>
                        <CCol xs={2}>
                            <h3 className='text-danger'>Tổng:</h3>
                        </CCol>
                        <CCol xs={10}>
                            <CFormInput className='mb-3'
                                disabled
                                value={priceFormat(cost) + " VNĐ"}
                            />
                        </CCol>

                    </CRow>

                </CModalBody>
                <CModalFooter>
                    {isValid ? null : <p style={{ color: 'red', paddingBottom: '2' }}>{validContent}</p>}
                    <CButton color="secondary" onClick={closeModal}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={onBtnAddClick}>Thêm</CButton>
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
                        <CToastBody>{toastErrorText}</CToastBody>
                        <CToastClose className="me-2 m-auto" />
                    </div>
                </CToast>
            </CToaster>
        </>
    )

}
export default ModalAddOrder;
