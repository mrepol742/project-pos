import React, { useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CSpinner,
} from '@coreui/react'
import { toast } from 'react-toastify'
import timeAgo from '../../../utils/time-ago'
import axiosInstance from '../../../services/axios'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faSync } from '@fortawesome/free-solid-svg-icons'

export const LatestTransaction = () => {
    const [latestTransactions, setLatestTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchLatestTransactions = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/dashboard/latest-transactions')
            if (response.data.error) return toast.error(response.data.error)
            setLatestTransactions(response.data.data)
        } catch (error) {
            console.error('Error fetching latest transactions:', error)
            toast.error('Failed to fetch latest transactions')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLatestTransactions()
        const interval = setInterval(fetchLatestTransactions, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <CCard className="border-0" style={{ minHeight: '320px' }}>
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Latest Transactions</h6>
                <div className="d-flex">
                    <CButton size="sm" onClick={fetchLatestTransactions}>
                        <FontAwesomeIcon icon={faSync} className={loading ? 'fa-spin' : ''} />
                    </CButton>
                    <CButton size="sm" onClick={() => navigate('/sales')}>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </CButton>
                </div>
            </CCardHeader>

            <CCardBody>
                {loading && latestTransactions.length === 0 ? (
                    <div className="text-center py-5">
                        <CSpinner size="sm" /> Loading transactions...
                    </div>
                ) : latestTransactions.length === 0 ? (
                    <div className="text-center py-5 text-muted">No recent transactions found</div>
                ) : (
                    <CTable small hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Cashier</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Items</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {latestTransactions.map((transaction) => (
                                <CTableRow key={transaction.id} className="align-middle">
                                    <CTableDataCell>{transaction.id}</CTableDataCell>
                                    <CTableDataCell>{transaction.cashier.name}</CTableDataCell>
                                    <CTableDataCell>
                                        {transaction.total.toLocaleString()} ₱
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {transaction.total_items.toLocaleString()}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {timeAgo(transaction.created_at)}
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                )}
            </CCardBody>
        </CCard>
    )
}
