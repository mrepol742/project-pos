import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
    CButton,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CCol,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Category from './modals/category'
import AppPagination from '../components/pagination'
import { toast } from 'react-toastify'
import AppModal from '../components/modal'
import axiosInstance from '../services/axios'

const Categories = () => {
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState({
        id: 0,
        name: '',
        description: '',
        type: 'add',
    })
    const [showAppModal, setShowAppModal] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories')
            if (response.data.error) return toast.error(response.data.error)
            setCategories(response.data.data)
        } catch (error) {
            console.error('Error fetching Categories:', error)
            toast.error('Failed to fetch categories list')
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setCategory({
            id: 0,
            name: '',
            description: '',
            type: 'add',
        })
        setShowAppModal(true)
    }

    const handleEdit = (category) => {
        setCategory({
            ...category,
            type: 'edit',
        })
        setShowAppModal(true)
    }

    return (
        <div>
            <Helmet>
                <title>Categories - Point of Sale</title>
            </Helmet>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Categories</h1>
                <div>
                    <CButton color="primary" onClick={() => handleAdd()}>
                        <FontAwesomeIcon icon={faAdd} /> Add Category
                    </CButton>
                </div>
            </div>
            <AppModal
                data={{
                    showAppModal,
                    setShowAppModal,
                }}
            >
                {({ onClose }) => (
                    <Category
                        category={category}
                        setCategory={setCategory}
                        onCancel={onClose}
                        fetchCategories={fetchCategories}
                        setShowAppModal={setShowAppModal}
                    />
                )}
            </AppModal>
            {loading && (
                <div className="d-flex justify-content-center align-items-center">
                    <h3>Loading categories...</h3>
                </div>
            )}

            {categories.length == 0 && !loading && (
                <div className="d-flex justify-content-center align-items-center">
                    <h3>No categories yet</h3>
                </div>
            )}

            {categories.length > 0 && (
                <>
                    <CTable striped bordered hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                                <CTableHeaderCell scope="col"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {categories.map((category, index) => (
                                <CTableRow key={category.id}>
                                    <CTableDataCell>{category.name}</CTableDataCell>
                                    <CTableDataCell>{category.description}</CTableDataCell>
                                    <CTableDataCell>
                                        <div className="d-flex">
                                            <CButton
                                                size="sm"
                                                color="primary"
                                                onClick={() => handleEdit(category)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                color="danger"
                                                onClick={() => alert(`Delete ${category.name}`)}
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
                </>
            )}
        </div>
    )
}

export default Categories
