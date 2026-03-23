import React, { useRef, useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CRow, CWidgetStatsA } from '@coreui/react'
import { Helmet } from 'react-helmet'
import { CChartLine } from '@coreui/react-chartjs'
import { LatestTransaction } from './detail/latest-transaction'
import { PurchaseActivity } from './detail/purchase-activity'
import { EarningsActivity } from './detail/earnings-activity'
import axiosInstance from '../../services/axios'
import { getStyle } from '@coreui/utils'

const Dashboard = () => {
    const [widgets, setWidgets] = useState({})
    const scales = {
        x: {
            border: {
                display: false,
            },
            grid: {
                display: false,
            },
            ticks: {
                display: false,
            },
        },
        y: {
            display: false,
            grid: {
                display: false,
            },
            ticks: {
                display: false,
            },
        },
    }
    const elements = {
        line: {
            borderWidth: 1,
            tension: 0.4,
        },
        point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
        },
    }

    const calculateAverage = (data) => {
        console.log('Calculating average for data:', data)
        if (!data || data.length === 0) return 0
        const sum = data.reduce((acc, value) => acc + value, 0)
        return (sum / data.length).toFixed(2)
    }

    const widgetData = [
        {
            color: 'primary',
            value: <>{calculateAverage(widgets.summaryEarnings?.data)}</>,
            title: 'Earnings',
            pointColor: getStyle('--cui-primary'),
            labels: widgets.summaryEarnings?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: widgets.summaryEarnings?.data || [0, 0, 0, 0, 0, 0],
        },
        {
            color: 'info',
            value: <>{calculateAverage(widgets.ordersOverTime?.data)}</>,
            title: 'Orders',
            pointColor: getStyle('--cui-info'),
            labels: widgets.ordersOverTime?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: widgets.ordersOverTime?.data || [0, 0, 0, 0, 0, 0],
        },
        {
            color: 'warning',
            value: <>{calculateAverage(widgets.averageOrderValue?.data)}</>,
            title: 'Avg. Order Value',
            pointColor: getStyle('--cui-warning'),
            labels: widgets.averageOrderValue?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: widgets.averageOrderValue?.data || [0, 0, 0, 0, 0, 0],
        },
        {
            color: 'danger',
            value: <>{calculateAverage(widgets.dailySales?.data)}</>,
            title: 'Daily Sales',
            pointColor: getStyle('--cui-danger'),
            labels: widgets.dailySales?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: widgets.dailySales?.data || [0, 0, 0, 0, 0, 0],
        },
    ]

    const fetch = async (url) => {
        return axiosInstance
            .get(url)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching dashboard data:', error)
                throw error
            })
    }

    const fetchDashboardWidgets = async () => {
        const fetchData = async () => {
            try {
                const shipmetOvertime = fetch('/dashboard/summary-earnings').then((data) =>
                    setWidgets((prev) => ({ ...prev, summaryEarnings: data })),
                )
                const costOvertime = fetch('/dashboard/orders-over-time').then((data) =>
                    setWidgets((prev) => ({ ...prev, ordersOverTime: data })),
                )
                const itemsOvertime = fetch('/dashboard/average-order-value').then((data) =>
                    setWidgets((prev) => ({ ...prev, averageOrderValue: data })),
                )
                const weightOvertime = fetch('/dashboard/daily-sales').then((data) =>
                    setWidgets((prev) => ({ ...prev, dailySales: data })),
                )

                await Promise.all([shipmetOvertime, costOvertime, itemsOvertime, weightOvertime])
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
        }

        fetchData()
    }

    useEffect(() => {
        fetchDashboardWidgets()

        const intervalId = setInterval(() => {
            fetchDashboardWidgets()
        }, 5000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div>
            <Helmet>
                <title>Dashboard - Project POS</title>
            </Helmet>
            <CRow className="mb-4" xs={{ gutter: 4 }}>
                {widgetData.map((widget, index) => (
                    <CCol key={index} sm={6} xl={3}>
                        <CWidgetStatsA
                            data-aos="fade-up"
                            color={widget.color}
                            value={widget.value}
                            title={widget.title}
                            chart={
                                <CChartLine
                                    className="mt-3 mx-3"
                                    style={{ height: '70px' }}
                                    data={{
                                        labels: widget.labels,
                                        datasets: [
                                            {
                                                label: widget.title,
                                                backgroundColor: 'transparent',
                                                borderColor: 'rgba(255,255,255,.55)',
                                                pointBackgroundColor: widget.pointColor,
                                                data: widget.data,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                        maintainAspectRatio: false,
                                        scales: scales,
                                        elements: elements,
                                    }}
                                />
                            }
                        />
                    </CCol>
                ))}
            </CRow>
            <CRow className="mb-3">
                <CCol xs={12} md={4} className="mb-3">
                    <LatestTransaction />
                </CCol>
                <CCol xs={12} md={7} className="mb-3">
                    <CCard className="border-0">
                        <CCardBody>
                            <PurchaseActivity />
                            <hr />
                            <EarningsActivity />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

export default Dashboard
