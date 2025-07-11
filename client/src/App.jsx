import React, { Suspense, useEffect, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import { Slide, ToastContainer } from 'react-toastify'
import AppErrorBoundary from './components/AppErrorBoundary'
import AOS from 'aos'
import './scss/style.scss'
import Auth from './components/AppAuth'

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'))
const Login = lazy(() => import('./views/auth/Login'))
const Logout = lazy(() => import('./views/auth/Logout'))

const App = () => {
    AOS.init()
    const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    const storedTheme = useSelector((state) => state.theme)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.href.split('?')[1])
        const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
        if (theme) setColorMode(theme)
        if (isColorModeSet()) return
        setColorMode(storedTheme)
    }, [])

    return (
        <div>
            <Router>
                <Suspense
                    fallback={
                        <div className="pt-3 text-center">
                            <CSpinner color="primary" variant="grow" />
                        </div>
                    }
                >
                    <AppErrorBoundary>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route element={<Auth />}>
                                <Route path="/logout" element={<Logout />} />
                                <Route path="*" element={<DefaultLayout />} />
                            </Route>
                        </Routes>
                    </AppErrorBoundary>
                </Suspense>
            </Router>
            <ToastContainer theme={storedTheme} transition={Slide} />
        </div>
    )
}

export default App
