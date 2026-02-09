import React, { useState, useEffect, useRef } from 'react'
import {
    CBadge,
    CButton,
    CFormInput,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import axiosInstance from '../../../services/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const Search = ({ data }) => {
    const {
        showSearchModal,
        setShowSearchModal,
        products,
        setProducts,
        searchQuery,
        handleSearch,
    } = data
    const [search, setSearch] = useState('')
    const [formData, setFormData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)
    const inputRef = useRef(null)

    useEffect(() => {
        if (showSearchModal) {
            searchProducts(searchQuery)
            setSearch(searchQuery)

            const handler = (e) => {
                const isMac = navigator.platform.toUpperCase().includes('MAC')
                const isShortcut =
                    (isMac && e.metaKey && e.key === 'k') || (!isMac && e.ctrlKey && e.key === 'k')

                if (isShortcut) {
                    e.preventDefault()
                    inputRef.current?.focus()
                }
            }

            window.addEventListener('keydown', handler)
            return () => window.removeEventListener('keydown', handler)
        }
    }, [showSearchModal])

    const handleModalClose = () => {
        setSearch('')
        setFormData([])
        setCurrentPage(1)
        setTotalPages(0)
        setShowSearchModal(false)
    }

    const searchProducts = (query) => {
        if (query.trim() === '') return
        setLoading(true)
        axiosInstance
            .post('/products/search', { query })
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                setFormData(response.data.data)
                setCurrentPage(response.data.currentPage)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                console.error('Error to search products:', error)
                toast.error('Failed to search products')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleProductSelection = (barcode) => () => {
        handleSearch({ target: { value: barcode } })
        handleModalClose()
    }

    return (
        <>
            <CModal
                alignment="center"
                scrollable
                visible={showSearchModal}
                onClose={handleModalClose}
                aria-labelledby="Search"
            >
                <CModalBody>
                    <CModalTitle className="mb-3">Search Products</CModalTitle>
                    <div className="d-flex gap-2 border rounded">
                        <CFormInput
                            ref={inputRef}
                            className="border-0"
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value)
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    searchProducts(event.target.value)
                                }
                            }}
                            autoFocus
                        />
                        <CButton className="text-primary" onClick={() => handleSearch(search)}>
                            <FontAwesomeIcon icon={faSearch} />
                        </CButton>
                    </div>
                    <CBadge color="secondary" className="mb-3">
                        Press Ctrl+K (or Cmd+K on Mac) to focus search
                    </CBadge>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center mt-3">
                            <h5>Loading...</h5>
                        </div>
                    ) : (
                        <>
                            {formData.length === 0 ? (
                                <div className="d-flex justify-content-center align-items-center mt-3">
                                    <h5>No products found</h5>
                                </div>
                            ) : (
                                <>
                                    <h6>Search results:</h6>
                                    <div
                                        className="grid gap-2"
                                        style={{ maxHeight: '300px', overflowY: 'auto' }}
                                    >
                                        {formData.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={handleProductSelection(product.barcode)}
                                            >
                                                <div className="d-flex justify-content-between align-items-center border rounded p-2 mb-1">
                                                    <div>
                                                        <strong>{product.name}</strong>
                                                        <div className="text-muted">
                                                            {product.barcode}
                                                        </div>
                                                    </div>
                                                    <div className="text-primary">
                                                        {product.sale_price}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </CModalBody>
            </CModal>
        </>
    )
}

export default Search

Search.propTypes = {
    data: PropTypes.shape({
        showSearchModal: PropTypes.bool.isRequired,
        setShowSearchModal: PropTypes.func.isRequired,
        products: PropTypes.array.isRequired,
        setProducts: PropTypes.func.isRequired,
        searchQuery: PropTypes.string.isRequired,
        handleSearch: PropTypes.func.isRequired,
    }).isRequired,
}
