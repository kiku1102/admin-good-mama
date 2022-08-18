import { CButton, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CTable, CTableHead, CTableHeaderCell, CTableRow, CTableBody, CTableDataCell } from '@coreui/react';

import React from 'react';

function ModalDetail({ openModal, closeModal, orderDetails }) {

    return (
        <>
            <CModal visible={openModal} onClose={closeModal} backdrop="static">
                <CModalHeader onClose={closeModal}>
                    <CModalTitle>Chi tiết đơn hàng của số điện thoại: {orderDetails ? orderDetails.phone : null} </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CTable>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">Id đơn hàng</CTableHeaderCell>

                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {
                                orderDetails ?
                                    orderDetails.orders.map((order, index) => {
                                        return (
                                            <CTableRow key={index}>
                                                <CTableDataCell>{order}</CTableDataCell>

                                            </CTableRow>
                                        )
                                    }) : null
                            }
                        </CTableBody>
                    </CTable>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )

}
export default ModalDetail;