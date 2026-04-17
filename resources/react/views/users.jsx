import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import {
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CRow,
    CCol,
} from '@coreui/react'
import { toast } from 'react-toastify'
import User from './modals/user'
import AppPagination from '../components/pagination'
import AppModal from '../components/modal'
import axiosInstance from '../services/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

const Users = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({
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
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [itemCount, setItemCount] = useState(0)
    const [showAppModal, setShowAppModal] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers(currentPage)
    }, [currentPage])

    const fetchUsers = async (currentPage) => {
        await axiosInstance
            .get('/users', {
                params: {
                    page: currentPage,
                },
            })
            .then((response) => {
                setUsers(response.data.data.data)
                setCurrentPage(response.data.data.current_page)
                setTotalPages(response.data.data.last_page)
                setItemCount(response.data.data.total)
            })
            .catch((error) => {
                console.error('Error fetching Users:', error)
                toast.error('Failed to fetch users list')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const exportUsers = async () => {
        window.open('/api/export/users', '_blank')
    }

    const handleAdd = () => {
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
        setShowAppModal(true)
    }

    const handleEdit = (user) => {
        setUser({
            ...user,
            type: 'edit',
        })
        setShowAppModal(true)
    }

    return (
        <div>
            <Helmet>
                <title>Users - Point of Sale</title>
            </Helmet>
            <AppModal
                data={{
                    showAppModal,
                    setShowAppModal,
                }}
            >
                {({ onClose }) => (
                    <User
                        user={user}
                        setUser={setUser}
                        onCancel={onClose}
                        fetchUsers={fetchUsers}
                        setShowAppModal={setShowAppModal}
                    />
                )}
            </AppModal>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1>Users</h1>
                    <span>{itemCount.toLocaleString()} Users</span>
                </div>
                <div>
                    <CButton
                        size="sm"
                        className="me-1"
                        color="primary"
                        onClick={() => exportUsers()}
                    >
                        Export
                    </CButton>
                    <CButton size="sm" color="primary" onClick={() => handleAdd()}>
                        Add
                    </CButton>
                </div>
            </div>
            {loading && (
                <div className="d-flex justify-content-center align-items-center">
                    <h3>Loading users...</h3>
                </div>
            )}

            {users.length == 0 && !loading && (
                <div className="d-flex justify-content-center align-items-center">
                    <h3>No users yet</h3>
                </div>
            )}

            {users.length > 0 && (
                <>
                    <CTable striped bordered hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                <CTableHeaderCell scope="col"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {users.map((user, index) => (
                                <CTableRow key={user.id}>
                                    <CTableDataCell>{user.name}</CTableDataCell>
                                    <CTableDataCell>{user.username}</CTableDataCell>
                                    <CTableDataCell>{user.role}</CTableDataCell>
                                    <CTableDataCell>{user.email}</CTableDataCell>
                                    <CTableDataCell>{user.phone}</CTableDataCell>
                                    <CTableDataCell>{user.status}</CTableDataCell>
                                    <CTableDataCell>
                                        <div className="d-flex">
                                            <CButton
                                                size="sm"
                                                color="primary"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                color="danger"
                                                onClick={() => alert(`Delete ${user.name}`)}
                                                className="ms-2 text-white"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </CButton>
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                    <AppPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        setTotalPages={setTotalPages}
                    />
                </>
            )}
        </div>
    )
}

export default Users
