import { CButton, CModal, CModalHeader, CModalFooter, CModalTitle, CToast, CToastClose, CToastBody, CToaster } from '@coreui/react';
import { useState } from 'react';
import React from 'react';

function ModalDeleteCustomer({ openModal, closeModal, customerDelete, fetchAPI }) {
    const [toastSuccess, setToastSuccess] = useState(false)
    const [toastError, setToastError] = useState(false)


    const onBtnDeleteClick = () => {
        deleteByAPI();
        closeModal();
    }

    const deleteByAPI = () => {
        let body = {
            method: 'DELETE',
        };
        let idDelete = customerDelete._id;
        fetchAPI(`http://localhost:8000/customers/${idDelete}`, body)
            .then(() => {
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
                    <CModalTitle>Xóa khách hàng tên: {customerDelete.fullName}</CModalTitle>
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
export default ModalDeleteCustomer;