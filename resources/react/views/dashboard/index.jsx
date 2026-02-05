import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { Helmet } from 'react-helmet'
import { CChart } from '@coreui/react-chartjs'
import { Chart } from 'chart.js/auto'
import { number } from 'prop-types'
import timeAgo from '../../utils/timeAgo'
import { Earnings, Sales, AvgItems, Total } from './summary/index'
import { LatestTransaction } from './detail/latestTransaction'
import { PurchaseActivity } from './detail/purchaseActivity'
import { EarningsActivity } from './detail/earningsActivity'

const Dashboard = () => {
    return (
        <div>
            <Helmet>
                <title>Dashboard - Project POS</title>
            </Helmet>
            <CRow xs={12} md={2}>
                <CCol className="mb-3">
                    <CCard className="border-0">
                        <CCardBody>
                            <h6 className="text-center text-uppercase text-muted mb-4">Sales</h6>
                            <Earnings />
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol className="mb-3">
                    <CCard className="border-0">
                        <CCardBody>
                            <h6 className="text-center text-uppercase text-muted mb-4">
                                Transactions
                            </h6>
                            <Sales />
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol className="mb-3">
                    <CCard className="border-0">
                        <CCardBody>
                            <h6 className="text-center text-uppercase text-muted mb-4">
                                Avg Items
                            </h6>
                            <AvgItems />
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol className="mb-3">
                    <CCard className="border-0">
                        <CCardBody className="text-center">
                            <Total />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol xs={12} md={4} className="mb-3">
                    <CCard className="border-0" style={{ minHeight: '304px' }}>
                        <CCardBody>
                            <LatestTransaction />
                        </CCardBody>
                    </CCard>
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
