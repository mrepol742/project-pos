import React, { useEffect } from 'react'
import cookies from 'js-cookie'

const Logout = () => {
    useEffect(() => {
        cookies.remove('session_id')
        window.location.href = '/'
    }, [])

    return null
}

export default Logout
