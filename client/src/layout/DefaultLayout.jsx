import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import { CSpinner } from '@coreui/react'
import { AppContent, AppSidebar, AppHeader } from '../components/index'

const POSLazy = lazy(() => import('../views/pos/'))
const ProductsLazy = lazy(() => import('../views/products'))

const DefaultLayout = () => {
    const user = useSelector((state) => state.user)
    const session_id = useSelector((state) => state.session_id)

    if (!user)
        return (
            <div className={`loading-overlay ${session_id ? '' : 'bg-dark'}`}>
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    if (['super_admin', 'admin'].includes(user.role))
        return (
            <div>
                <AppSidebar />
                <div className="wrapper d-flex flex-column min-vh-100">
                    <AppHeader />
                    <div className="body flex-grow-1">
                        <AppContent />
                    </div>
                </div>
            </div>
        )
    if (user.role === 'cashier') return <POSLazy />
    if (user.role === 'production')
        return (
            <div>
                <ProductsLazy />
            </div>
        )

    return <>Hello world</>
}

export default DefaultLayout
