import React, { useEffect, useState } from 'react'
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
import timeAgo from '../../../utils/time-ago'
import axiosInstance from '../../../services/axios'

export const LatestTransaction = () => {
    const [latestTransactions, setLatestTransactions] = useState([])

    const fetchLatestTransactions = async () => {
        try {
            axiosInstance.get('/dashboard/latest-transactions').then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                setLatestTransactions(response.data)
            })
        } catch (error) {
            console.error('Error fetching Latest transactions:', error)
            toast.error('Failed to fetch latest transactions')
        }
    }

    useEffect(() => {
        fetchLatestTransactions()

        const interval = setInterval(() => {
            fetchLatestTransactions()
        }, 60000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Latest Transactions</h6>
                <div>
                    <CButton className="me-1" size="sm" onClick={() => fetchLatestTransactions()}>
                        Refresh
                    </CButton>
                    <CButton size="sm" onClick={() => navigate('/sales')}>
                        View All
                    </CButton>
                </div>
            </div>
            <CTable small hover responsive>
                <CTableHead>
                    <CTableRow>
                        {/* <CTableHeaderCell>Store</CTableHeaderCell> */}
                        <CTableHeaderCell>Cashier</CTableHeaderCell>
                        <CTableHeaderCell>Amount</CTableHeaderCell>
                        <CTableHeaderCell>Items</CTableHeaderCell>
                        <CTableHeaderCell></CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {latestTransactions.map((transaction, index) => (
                        <CTableRow key={transaction.id}>
                            {/* <CTableDataCell></CTableDataCell> */}
                            <CTableDataCell>{transaction.cashier.name}</CTableDataCell>
                            <CTableDataCell>{transaction.total.toLocaleString()} ₱</CTableDataCell>
                            <CTableDataCell>
                                {transaction.total_items.toLocaleString()}
                            </CTableDataCell>
                            <CTableDataCell>{timeAgo(transaction.created_at)}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </>
    )
}
