import { CButton, CModal, CModalHeader,CToaster, CModalFooter, CModalTitle, CToast, CToastClose, CToastBody } from '@coreui/react';
import { useState } from 'react';
import React from 'react';

function ModalDeleteProduct({ openModal, closeModal, productDelete }) {
    const [toastSuccess, setToastSuccess] = useState(false)
    const [toastError, setToastError] = useState(false)


    const onBtnDeleteClick = () => {
        deleteByAPI()
    }

    const deleteByAPI = () => {
        let body = {
            method: 'DELETE',
        };
        let idDelete = productDelete._id
        fetch("https://goodmamabackend.herokuapp.com/products/" + idDelete, body)
            .then((data) => {
                setToastSuccess(true)
                closeModal();
            })
            .catch((err) => {
                setToastError(true);
            })
    }

    return (
        <>
            <CModal visible={openModal} onClose={closeModal} backdrop="static">
                <CModalHeader onClose={closeModal}>
                    <CModalTitle>Xóa sản phẩm: {productDelete.name}</CModalTitle>
                </CModalHeader>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal}>
                        Close
                    </CButton>
                    <CButton color="danger" onClick={onBtnDeleteClick}>Xóa</CButton>
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
                        <CToastBody>Xóa thành công</CToastBody>
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
                        <CToastBody>Xóa thất bại</CToastBody>
                        <CToastClose className="me-2 m-auto" />
                    </div>
                </CToast>
            </CToaster>
        </>
    )

}
export default ModalDeleteProduct;