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
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import axiosInstance from '../../services/axios'

const NewUser = ({ user, setUser, onCancel, fetchUsers, setShowAppModal }) => {
    const [roles, setRoles] = useState([])

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
        if (user.type === 'add')
            return axiosInstance
                .post('/users', user)
                .then((response) => {
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
                        type: 'add',
                    })
                    fetchUsers(0)
                    setShowAppModal(false)
                })
                .catch((error) => {
                    console.error('Error creating user:', error)
                    toast.error(error.response.data.message)
                })

        axiosInstance
            .patch(`/users/${user.id}`, user)
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                toast.success(`${user.name} updated successfully`)
                setUser({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    username: '',
                    password: '',
                    status: '',
                    role: '',
                    type: 'add',
                })
                fetchUsers(0)
                setShowAppModal(false)
            })
            .catch((error) => {
                console.error('Error updating user:', error)
                toast.error(error.response.data.message)
            })
    }

    const fetchData = async () => {
        const [fetchRoles] = await Promise.all([axiosInstance.get('/roles')])
        setRoles(fetchRoles.data.data)
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
                <FontAwesomeIcon icon={user.type === 'add' ? faPlus : faEdit} className="me-2" />
                {user.type === 'add' ? 'New User' : 'Edit User'}
            </div>
            <CRow>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="text"
                        id="name"
                        floatingClassName="mb-3"
                        floatingLabel="Name"
                        onChange={handleChange}
                        value={user.name}
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
                        value={user.email}
                        placeholder=""
                        required
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="text"
                        id="phone"
                        floatingClassName="mb-3"
                        floatingLabel="Phone"
                        onChange={handleChange}
                        value={user.phone}
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
                        value={user.username}
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
                        value={user.role}
                        options={[
                            { label: 'Select a role', value: '' },
                            ...roles.map((d) => ({
                                label: toCapitalize(d.name.replace(/_/g, ' ')),
                                value: d.name,
                            })),
                        ]}
                        required
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
                        value={user.status}
                        options={[
                            { label: 'Select a status', value: '' },
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                        ]}
                        required
                    />
                </CCol>
                {user.type === 'add' && (
                    <CCol xs={12} md={6}>
                        <CFormInput
                            type="text"
                            id="password"
                            floatingClassName="mb-3"
                            floatingLabel="Password"
                            onChange={handleChange}
                            value={user.password}
                            placeholder=""
                            required
                        />
                    </CCol>
                )}
            </CRow>
            <div className="d-flex justify-content-end mt-3">
                <CButton color="secondary" className="me-2" size="sm" onClick={onCancel}>
                    Cancel
                </CButton>
                <CButton color="primary" size="sm" type="submit">
                    {user.type === 'add' ? 'Create' : 'Update'}
                </CButton>
            </div>
        </CForm>
    )
}

export default NewUser

NewUser.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        address: PropTypes.string,
        username: PropTypes.string,
        password: PropTypes.string,
        status: PropTypes.string,
        role: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    setUser: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    setShowAppModal: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}
