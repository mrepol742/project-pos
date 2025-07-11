import React, { useEffect, useState } from 'react'
import {
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import PropTypes from 'prop-types'
import AppPagination from '../../../components/AppPagination'
import timeAgo from '../../../utils/timeAgo'

const History = ({ data }) => {
    const { popupMenu, setPopupMenu, showPopupMenu, setShowPopupMenu } = data
    const [historyData, setHistoryData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const fetchTodaySalesHistory = async () => {
        try {
            axios
                .get('/sales-history')
                .then((response) => {
                    setHistoryData(response.data.data)
                    setTotalPages(response.data.totalPages)
                    setCurrentPage(response.data.currentPage)
                })
                .catch((error) => {
                    console.error('Error fetching sales history:', error)
                })
        } catch (error) {
            console.error('Error fetching sales history:', error)
        }
    }

    useEffect(() => {
        if (showPopupMenu) fetchTodaySalesHistory()
    }, [])

    return (
        <>
            <CModal
                fullscreen
                alignment="center"
                scrollable
                visible={showPopupMenu}
                onClose={() => setShowPopupMenu(false)}
                aria-labelledby="Help Modal"
            >
                <CModalHeader className="border-0" />
                <CModalBody>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Your Today&apos;s Sales History</h5>
                        <CButton color="primary">Export</CButton>
                    </div>
                    {historyData.length === 0 ? (
                        <div className="d-flex justify-content-center align-items-center">
                            <h3>Loading sales...</h3>
                        </div>
                    ) : (
                        <>
                            <CTable striped bordered hover responsive>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Payment</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">
                                            Reference Number
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {historyData.map((sale, index) => (
                                        <CTableRow key={sale.id}>
                                            <CTableDataCell>{sale.id}</CTableDataCell>
                                            <CTableDataCell>{sale.total}</CTableDataCell>
                                            <CTableDataCell>
                                                {sale.total_discount.toLocaleString()}
                                            </CTableDataCell>
                                            <CTableDataCell>{sale.mode_of_payment}</CTableDataCell>
                                            <CTableDataCell>{sale.reference_number}</CTableDataCell>
                                            <CTableDataCell>
                                                {timeAgo(sale.created_at)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButton color="primary" size="sm">
                                                    Print
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                            <AppPagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                setTotalPages={setTotalPages}
                            />
                        </>
                    )}
                </CModalBody>
            </CModal>
        </>
    )
}

export default History

History.propTypes = {
    data: PropTypes.shape({
        popupMenu: PropTypes.string.isRequired,
        setPopupMenu: PropTypes.func.isRequired,
        showPopupMenu: PropTypes.bool.isRequired,
        setShowPopupMenu: PropTypes.func.isRequired,
    }).isRequired,
}
