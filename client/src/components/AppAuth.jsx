import React, { useEffect, useState } from 'react'
import { CSpinner } from '@coreui/react'
import PropTypes from 'prop-types'
import { Navigate, useNavigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

const AppAuth = () => {
    const [status, setStatus] = useState('loading')
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const session_id = cookies.get('session_id')
    const [isAuth, setIsAuth] = useState(null)

    let loc = `/login`
    if (window.location.pathname != '/')
        loc = `/login?n=${window.location.pathname}${window.location.search}`

    const verify = async () => {
        if (!session_id) return setIsAuth(false)
        if (user && Object.keys(user).length > 0) return setIsAuth(true)

        try {
            const response = await axios.post('/auth/verify-session', { session_id })
            dispatch({ type: 'SET_USER', payload: response.data.user })
            setIsAuth(true)
        } catch (error) {
            cookies.remove('session_id')
            window.location.href = loc
        }
    }

    useEffect(() => {
        verify()
    }, [])

    if (isAuth === null)
        return (
            <div className={`${session_id ? '' : 'bg-dark'} text-center p-3`}>
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    if (!isAuth) return <Navigate to={loc} />
    return <Outlet />
}

export default AppAuth
