import React, { use, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import AppPagination from '../../components/AppPagination'
import timeAgo from '../../utils/timeAgo'
import axiosInstance from '../../services/axios'

const Sales = () => {
    const [sales, setSales] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [itemCount, setItemCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSales(currentPage)
    }, [currentPage])

    const fetchSales = async (currentPage) => {
        try {
            const response = await axiosInstance.get('/sales', {
                params: {
                    page: currentPage,
                },
            })
            if (response.data.error) return toast.error(response.data.error)
            setSales(response.data.data)
            setTotalPages(response.data.totalPages)
            setCurrentPage(response.data.currentPage)
            setItemCount(response.data.itemCount)
        } catch (error) {
            console.error('Error fetching Products:', error)
            toast.error('Failed to fetch sales list')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Helmet>
                <title>Sales - Project POS</title>
            </Helmet>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1>Sales</h1>
                    <span>{itemCount.toLocaleString()} Transactions</span>
                </div>
                <div></div>
            </div>
            {loading && (
                <div className="d-flex justify-content-center align-items-center">
                    <h3>Loading sales...</h3>
                </div>
            )}

            {sales.length == 0 && !loading && (
                <div className="d-flex justify-content-center align-items-center">
                    <h3>No sales yet</h3>
                </div>
            )}

            {sales.length > 0 && (
                <>
                    <CTable striped bordered hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Cashier</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Payment</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Reference Number</CTableHeaderCell>
                                <CTableHeaderCell scope="col"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {sales.map((sale, index) => (
                                <CTableRow key={sale.id}>
                                    <CTableDataCell>{sale.id}</CTableDataCell>
                                    <CTableDataCell>{sale.cashier.name}</CTableDataCell>
                                    <CTableDataCell>{sale.total}</CTableDataCell>
                                    <CTableDataCell>
                                        {sale.total_discount.toLocaleString()}
                                    </CTableDataCell>
                                    <CTableDataCell>{sale.mode_of_payment}</CTableDataCell>
                                    <CTableDataCell>{sale.reference_number}</CTableDataCell>
                                    <CTableDataCell>{timeAgo(sale.created_at)}</CTableDataCell>
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
        </div>
    )
}

export default Sales
