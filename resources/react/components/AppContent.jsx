import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import Categories from '../views/categories'

const Dashboard = lazy(() => import('../views/dashboard'))
const Products = lazy(() => import('../views/products'))
const Users = lazy(() => import('../views/users'))
const Sales = lazy(() => import('../views/sales'))

const AppContent = () => {
    return (
        <CContainer fluid className="px-4">
            <Suspense fallback={<CSpinner color="primary" />}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/sales" element={<Sales />} />
                </Routes>
            </Suspense>
        </CContainer>
    )
}

export default React.memo(AppContent)
