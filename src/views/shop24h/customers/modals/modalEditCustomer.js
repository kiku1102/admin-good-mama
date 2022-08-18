import { CButton, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CFormInput,
    CToast,
    CToastClose,
    CToastBody,
    CToaster
} from '@coreui/react';
import { useEffect, useState } from 'react';
import React from 'react';



function ModalEditCustomer({ openModal, closeModal, customerEdit, fetchAPI }) {
    const [toastSuccess, setToastSuccess] = useState(false)
    const [toastError, setToastError] = useState(false)
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [validContent, setValidContent] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [toastErrorText, setToastErrorText] = useState("Lỗi")


    const onBtnEditClick = () => {
        let isCheck = validateData();
        if (isCheck) {
          callApiEditCustomer();
        }
    }
    const callApiEditCustomer=()=>{
        let body = {
            method: 'PUT',
            body: JSON.stringify({
                fullName: fullName,
                phone: phone,
                email: email,
                address: address,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        };
        fetchAPI("http://localhost:8000/customers/" + customerEdit._id, body)
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
    const validateData = () => {
        if (!fullName) {
            setValidContent("Chưa nhập họ và tên")
            setIsValid(false);
            return false
        }
        if (isNaN(phone)||phone==="") {
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

        return true
    }

    useEffect(() => {
        setFullName(customerEdit.fullName)
        setPhone(customerEdit.phone)
        setEmail(customerEdit.email)
        setAddress(customerEdit.address)
    }, [openModal])
    return (
        <>
            <CModal visible={openModal} onClose={closeModal} backdrop="static">
                <CModalHeader onClose={closeModal}>
                    <CModalTitle>Sửa thông tin khách hàng</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput className='mb-3'
                        label="Họ và tên"
                        placeholder="Họ và tên"
                        value={fullName}
                        aria-describedby="exampleFormControlInputHelpInline"
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
                </CModalBody>
                <CModalFooter>
                {isValid ? null : <p style={{ color: 'red', paddingBottom: '2' }}>{validContent}</p>}
                    <CButton color="secondary" onClick={closeModal}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={onBtnEditClick}>Sửa</CButton>
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
export default ModalEditCustomer;