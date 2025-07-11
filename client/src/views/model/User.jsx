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
                toast.success('User created successfully')
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
                console.error('Error adding product:', error)
            })
    }

    const fetchData = async () => {
        const [fetchRoles] = await Promise.all([axios.get('/roles')])
        setRoles(fetchRoles.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <CForm onSubmit={handleSubmit} className="p-2">
            <div className="d-flex justify-content-between">
                <h3 className="mb-3">New User</h3>
                <div>
                    <CButton color="secondary" className="me-2" size="sm">
                        Cancel
                    </CButton>
                    <CButton color="primary" size="sm" type="submit">
                        Save
                    </CButton>
                </div>
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
                                label: d.name,
                                value: d.id,
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
        </CForm>
    )
}

export default NewUser
