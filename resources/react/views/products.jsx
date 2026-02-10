import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
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
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Product from './modals/product'
import AppPagination from '../components/pagination'
import { toast } from 'react-toastify'
import AppModal from '../components/modal'
import axiosInstance from '../services/axios'

const Products = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [itemCount, setItemCount] = useState(0)
    const [showAppModal, setShowAppModal] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)
    const [showExportModal, setShowExportModal] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts(currentPage)
    }, [currentPage])

    const fetchProducts = async (currentPage) => {
        try {
            const response = await axiosInstance.get('/products/all', {
                params: {
                    page: currentPage,
                },
            })
            if (response.data.error) return toast.error(response.data.error)
            setProducts(response.data.data)
            setTotalPages(response.data.totalPages)
            setCurrentPage(response.data.currentPage)
            setItemCount(response.data.itemCount)
        } catch (error) {
            console.error('Error fetching Products:', error)
            toast.error('Failed to fetch products list')
        } finally {
            setLoading(false)
        }
    }

    const exportProducts = async () => {
        window.open('/api/export/products', '_blank')
    }

    return (
        <div>
            <Helmet>
                <title>Products - Project POS</title>
            </Helmet>
            <AppModal
                data={{
                    showAppModal,
                    setShowAppModal,
                }}
            >
                <Product />
            </AppModal>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1>Products</h1>
                    <span>{itemCount.toLocaleString()} Products</span>
                </div>
                <div>
                    <CButton
                        size="sm"
                        className="me-1"
                        color="primary"
                        onClick={() => alert('Import Products')}
                    >
                        Import
                    </CButton>
                    <CButton
                        size="sm"
                        className="me-1"
                        color="primary"
                        onClick={() => exportProducts()}
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
                    <h3>Loading products...</h3>
                </div>
            )}

            {products.length == 0 && !loading && (
                <div className="d-flex justify-content-center align-items-center">
                    <h3>No products yet</h3>
                </div>
            )}

            {products.length > 0 && (
                <>
                    <CTable striped bordered hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Barcode</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Cost Price</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Sale Price</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Stock</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                                <CTableHeaderCell scope="col"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {products.map((product, index) => (
                                <CTableRow key={product.id}>
                                    <CTableDataCell>{product.name}</CTableDataCell>
                                    <CTableDataCell>{product.code}</CTableDataCell>
                                    <CTableDataCell>{product.barcode}</CTableDataCell>
                                    <CTableDataCell>{product.quantity}</CTableDataCell>
                                    <CTableDataCell>{product.cost_price}</CTableDataCell>
                                    <CTableDataCell>{product.sale_price}</CTableDataCell>
                                    <CTableDataCell>
                                        {product.is_active ? 'Yes' : 'No'}
                                    </CTableDataCell>
                                    <CTableDataCell>{product.category?.name ?? ""}</CTableDataCell>
                                    <CTableDataCell>
                                        <div className="d-flex">
                                            <CButton
                                                size="sm"
                                                color="primary"
                                                onClick={() => alert(`Edit ${product.name}`)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                color="danger"
                                                onClick={() => alert(`Delete ${product.name}`)}
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

export default Products
