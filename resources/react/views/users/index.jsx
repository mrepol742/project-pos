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
import User from '../model/User'
import AppPagination from '../../components/AppPagination'
import AppModal from '../../components/AppModal'

const Users = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [itemCount, setItemCount] = useState(0)
    const [showAppModal, setShowAppModal] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers(currentPage)
    }, [currentPage])

    const fetchUsers = async (currentPage) => {
        try {
            const response = await axios.get('/users', {
                params: {
                    page: currentPage,
                },
            })
            if (response.data.error) return toast.error(response.data.error)
            setUsers(response.data.data)
            setTotalPages(response.data.totalPages)
            setCurrentPage(response.data.currentPage)
            setItemCount(response.data.itemCount)
        } catch (error) {
            console.error('Error fetching Users:', error)
            toast.error('Failed to fetch users list')
        } finally {
            setLoading(false)
        }
    }

    const exportUsers = async () => {
        window.open('http://localhost:8000/api/export/users', '_blank')
    }

    return (
        <div>
            <Helmet>
                <title>Users - Project POS</title>
            </Helmet>
            <AppModal
                data={{
                    showAppModal,
                    setShowAppModal,
                }}
            >
                <User />
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
                    <CButton size="sm" color="primary" onClick={() => setShowAppModal(true)}>
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
                                                onClick={() => alert(`Edit ${user.name}`)}
                                            >
                                                Edit
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                color="danger"
                                                onClick={() => alert(`Delete ${user.name}`)}
                                                className="ms-2"
                                            >
                                                Delete
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
