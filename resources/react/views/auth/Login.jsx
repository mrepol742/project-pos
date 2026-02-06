import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { toast } from 'react-toastify'

const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const response = new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post('/auth/login', formData)
                if (res.data.error) {
                    return reject(res.data.error)
                }
                cookies.set('session_id', res.data.session_token, { expires: 1 })
                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
                resolve(res.data)
            } catch (error) {
                reject(error)
            }
        })

        toast.promise(response, {
            pending: 'Logging in...',
            success: 'Login successful',
            error: 'Invalid username or password',
        })
    }

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div
            className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center"
            style={{ position: 'relative' }}
        >
            <CContainer style={{ position: 'relative', zIndex: 3 }}>
                <CRow className="justify-content-center">
                    <CCol md={7} lg={5} xl={4}>
                        <CCard className="p-4 border-0 rounded-4 shadow">
                            <CCardBody>
                                <CForm onSubmit={handleLogin}>
                                    <h2>Project POS</h2>
                                    <p className="text-body-secondary">
                                        Sign in to continue to your account
                                    </p>
                                    <CInputGroup className="mb-3 border rounded">
                                        <CInputGroupText className="border-0">
                                            <CIcon icon={cilUser} />
                                        </CInputGroupText>
                                        <CFormInput
                                            className="border-0"
                                            onChange={handleChange}
                                            value={formData.login}
                                            type="text"
                                            name="login"
                                            placeholder="Username or Email"
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-4 border rounded">
                                        <CInputGroupText className="border-0">
                                            <CIcon icon={cilLockLocked} />
                                        </CInputGroupText>
                                        <CFormInput
                                            onChange={handleChange}
                                            className="border-0"
                                            value={formData.password}
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                        />
                                        <CInputGroupText
                                            className="border-0"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? (
                                                <span role="img" aria-label="Hide password">
                                                    🙈
                                                </span>
                                            ) : (
                                                <span role="img" aria-label="Show password">
                                                    👁️
                                                </span>
                                            )}
                                        </CInputGroupText>
                                    </CInputGroup>
                                    <CRow>
                                        <CCol xs={6}>
                                            <CButton color="primary" className="px-4" type="submit">
                                                Login
                                            </CButton>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Login
