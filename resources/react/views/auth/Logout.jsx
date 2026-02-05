import React, { useEffect } from 'react'

const Logout = () => {
    useEffect(() => {
        cookies.remove('session_id')
        window.location.href = '/'
    }, [])

    return null;
}

export default Logout
