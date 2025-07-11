import React, { useState, useEffect } from 'react'
import {
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

const Search = ({ data }) => {
    const { showSearchModal, setShowSearchModal, products, setProducts, searchQuery } = data
    const [search, setSearch] = useState(searchQuery || '')
    const [formData, setFormData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        handleSearch(searchQuery)
    }, [])

    const handleModalClose = () => {
        setSearch('')
        setFormData([])
        setCurrentPage(1)
        setTotalPages(0)
        setShowSearchModal(false)
    }

    const handleSearch = (query) => {
        if (query.trim() === '') return
        setLoading(true)
        axios
            .post('/products/search', { query })
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                if (response.data.data.length === 0) return toast.error('No products found')
                setFormData(response.data.data)
                setCurrentPage(response.data.currentPage)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => {
                console.error('Error fetching products:', error)
            })
            .finally(() => {
                setLoading(false)
            })
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
                    <CFormInput
                        type="text"
                        placeholder="Search..."
                        value={search || searchQuery}
                        onChange={(event) => {
                            setSearch(event.target.value)
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSearch(event.target.value)
                            }
                        }}
                    />
                    <div className="d-flex justify-content-end mt-3">
                        <CButton color="primary" onClick={() => handleSearch(search)}>
                            Search
                        </CButton>
                    </div>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center mt-3">
                            <h5>Loading...</h5>
                        </div>
                    ) : (
                        <>
                            <h5>Search results:</h5>
                            <ul>
                                {formData.map((product) => (
                                    <li key={product.id}>
                                        {product.name} - {product.cost_price}
                                    </li>
                                ))}
                            </ul>
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
    }).isRequired,
}
