import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../services/axios'

export const Total = () => {
    const [total, setTotal] = useState({
        earnings: 0,
        sales: 0,
        items: 0,
    })

    const fetchSummaryTotal = async () => {
        axiosInstance.get('/dashboard/summary-total').then((response) => {
            if (response.data.error) return toast.error(response.data.error)
            setTotal(response.data)
        })
    }

    useEffect(() => {
        fetchSummaryTotal()
    }, [])

    return (
        <>
            <span className="text-uppercase text-muted">Total Sales</span>
            <h3 className="fw-bold mt-3">{total.earnings.toLocaleString()} ₱</h3>
            <span className="text-uppercase text-muted">Total Transactions</span>
            <h4 className="fw-bold mt-2">{total.sales.toLocaleString()}</h4>
            <span className="text-uppercase text-muted">Total Items Sold</span>
            <h5 className="fw-bold mt-2">{total.items.toLocaleString()}</h5>
        </>
    )
}
