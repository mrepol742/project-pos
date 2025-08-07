import React, { useState, useEffect } from 'react'
import {
    CForm,
    CFormInput,
    CRow,
    CCol,
    CFormSwitch,
    CButtonGroup,
    CImage,
    CButton,
    CFormSelect,
} from '@coreui/react'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const NewUser = () => {
    const [roles, setRoles] = useState([])
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        username: '',
        password: '',
        status: '',
        role: '',
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setUser((prevUser) => ({
            ...prevUser,
            [id]: value,
        }))
    }

    const handleSelectChange = (e) => {
        const { id, value } = e.target
        setUser((prevUser) => ({
            ...prevUser,
            [id]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios
            .post('/users', user)
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                toast.success(`${user.name} created successfully`)
                setUser({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    username: '',
                    password: '',
                    status: '',
                    role: '',
                })
            })
            .catch((error) => {
                console.error('Error creating user:', error)
                toast.error(`Failed to create user ${user.name}`)
            })
    }

    const fetchData = async () => {
        const [fetchRoles] = await Promise.all([axios.get('/roles')])
        setRoles(fetchRoles.data)
    }

    const toCapitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <CForm onSubmit={handleSubmit} className="p-2">
            <div className="d-flex align-items-center mb-3 fs-5">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Create New User
            </div>
            <CRow>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="text"
                        id="name"
                        floatingClassName="mb-3"
                        floatingLabel="Name"
                        onChange={handleChange}
                        placeholder=""
                        required
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="email"
                        id="email"
                        floatingClassName="mb-3"
                        floatingLabel="Email"
                        onChange={handleChange}
                        placeholder=""
                        required
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="number"
                        id="phone"
                        floatingClassName="mb-3"
                        floatingLabel="Phone"
                        onChange={handleChange}
                        placeholder=""
                        required
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="text"
                        id="username"
                        floatingClassName="mb-3"
                        floatingLabel="Username"
                        onChange={handleChange}
                        placeholder=""
                        required
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormSelect
                        id="role"
                        floatingClassName="mb-3"
                        floatingLabel="Role"
                        onChange={handleSelectChange}
                        options={[
                            { label: 'Select a role', value: '' },
                            ...roles.map((d) => ({
                                label: toCapitalize(d.name.replace(/_/g, ' ')),
                                value: d.name,
                            })),
                        ]}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={12} md={6}>
                    <CFormSelect
                        id="status"
                        floatingClassName="mb-3"
                        floatingLabel="Status"
                        onChange={handleSelectChange}
                        options={[
                            { label: 'Select a status', value: '' },
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                        ]}
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="text"
                        id="password"
                        floatingClassName="mb-3"
                        floatingLabel="Password"
                        onChange={handleChange}
                        placeholder=""
                        required
                    />
                </CCol>
            </CRow>
            <div className="d-flex justify-content-end mt-3">
                <CButton color="secondary" className="me-2" size="sm">
                    Cancel
                </CButton>
                <CButton color="primary" size="sm" type="submit">
                    Create User
                </CButton>
            </div>
        </CForm>
    )
}

export default NewUser
