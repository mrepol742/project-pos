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

const Product = ({ product, setProduct, onCancel, fetchProducts, setShowAppModal }) => {
    const [categories, setCategories] = useState([])

    const handleChange = (e) => {
        const { id, value } = e.target
        setProduct((prevProduct) => ({
            ...prevProduct,
            [id]: value,
        }))
    }

    const handleSwitchChange = (e) => {
        const { id, checked } = e.target
        setProduct((prevProduct) => ({
            ...prevProduct,
            [id]: checked,
        }))
    }

    const handleSelectChange = (e) => {
        const { id, value } = e.target
        setProduct((prevProduct) => ({
            ...prevProduct,
            [id]: id === 'category_id' ? parseInt(value) : value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (product.type === 'add')
            return axiosInstance
                .put('/products', product)
                .then((response) => {
                    if (response.data.error) return toast.error(response.data.error)
                    toast.success(`${product.name} created successfully`)
                    setProduct({
                        name: '',
                        code: '',
                        barcode: '',
                        unit_measurement: '',
                        category_id: 0,
                        is_active: true,
                        default_quantity: true,
                        age_restriction: 0,
                        description: '',
                        taxes: 0,
                        cost_price: 0,
                        markup: 0,
                        sale_price: 0,
                        color: '',
                        image: null,
                        type: 'add',
                    })
                    if (typeof fetchProducts === 'function') fetchProducts(1)
                    if (typeof setShowAppModal === 'function') setShowAppModal(false)
                })
                .catch((error) => {
                    console.error('Error creating product:', error)
                    toast.error(`Failed to create product ${product.name}`)
                })

        axiosInstance
            .patch(`/products/${product.id}`, product)
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                toast.success(`${product.name} updated successfully`)
                setProduct({
                    name: '',
                    code: '',
                    barcode: '',
                    unit_measurement: '',
                    category_id: 0,
                    is_active: true,
                    default_quantity: true,
                    age_restriction: 0,
                    description: '',
                    taxes: 0,
                    cost_price: 0,
                    markup: 0,
                    sale_price: 0,
                    color: '',
                    image: null,
                    type: 'add',
                })
                if (typeof fetchProducts === 'function') fetchProducts(1)
                if (typeof setShowAppModal === 'function') setShowAppModal(false)
            })
            .catch((error) => {
                console.error('Error updating product:', error)
                toast.error(`Failed to update product ${product.name}`)
            })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    image: reader.result,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleClearImage = () => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            image: null,
        }))
    }

    const fetchData = async () => {
        const [fetchCategories] = await Promise.all([axiosInstance.get('/categories')])
        setCategories(fetchCategories.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <CForm onSubmit={handleSubmit} className="p-2">
            <div className="d-flex align-items-center mb-3 fs-5">
                <FontAwesomeIcon icon={product.type === 'add' ? faPlus : faEdit} className="me-2" />
                {product.type === 'add' ? 'New Product' : 'Edit Product'}
            </div>
            <h5>Details</h5>
            <CFormInput
                type="text"
                id="name"
                floatingClassName="mb-3"
                floatingLabel="Name"
                onChange={handleChange}
                value={product.name}
                placeholder=""
                required
            />
            <CRow>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="text"
                        id="code"
                        floatingClassName="mb-3"
                        floatingLabel="Code"
                        onChange={handleChange}
                        value={product.code}
                        placeholder=""
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="text"
                        id="barcode"
                        floatingClassName="mb-3"
                        floatingLabel="Barcode"
                        onChange={handleChange}
                        value={product.barcode}
                        placeholder=""
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="text"
                        id="unit_measurement"
                        floatingClassName="mb-3"
                        floatingLabel="Unit of Measurement"
                        onChange={handleChange}
                        value={product.unit_measurement}
                        placeholder=""
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormSelect
                        id="category_id"
                        floatingClassName="mb-3"
                        floatingLabel="Category"
                        onChange={handleSelectChange}
                        value={product.category_id}
                        options={[
                            ...categories.map((g) => ({
                                label: g.name,
                                value: g.id,
                            })),
                        ]}
                    />
                </CCol>
            </CRow>
            <CFormSwitch
                onChange={handleSwitchChange}
                label="Active"
                id="is_active"
                checked={product.is_active}
                defaultChecked
            />
            <CFormSwitch
                onChange={handleSwitchChange}
                label="Default Quantity"
                id="default_quantity"
                checked={product.default_quantity}
                defaultChecked
            />
            <CFormInput
                type="number"
                id="age_restriction"
                floatingClassName="mb-3"
                floatingLabel="Age Restriction"
                onChange={handleChange}
                value={product.age_restriction}
                placeholder=""
            />
            <CFormInput
                type="text"
                id="description"
                floatingClassName="mb-3"
                floatingLabel="Description"
                onChange={handleChange}
                value={product.description}
                placeholder=""
            />
            <h5>Price</h5>
            <CRow>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="number"
                        id="taxes"
                        floatingClassName="mb-3"
                        floatingLabel="Taxes %"
                        onChange={handleChange}
                        value={product.taxes}
                        placeholder=""
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="number"
                        id="cost_price"
                        floatingClassName="mb-3"
                        floatingLabel="Cost"
                        onChange={handleChange}
                        value={product.cost_price}
                        placeholder=""
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="number"
                        id="markup"
                        floatingClassName="mb-3"
                        floatingLabel="Markup"
                        onChange={handleChange}
                        value={product.markup}
                        placeholder=""
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="number"
                        id="sale_price"
                        floatingClassName="mb-3"
                        floatingLabel="Sale Price"
                        onChange={handleChange}
                        value={product.sale_price}
                        placeholder=""
                    />
                </CCol>
            </CRow>
            <h5>Image & Color</h5>
            <CFormInput
                type="text"
                id="color"
                floatingClassName="mb-3"
                floatingLabel="Color"
                onChange={handleChange}
                value={product.color}
                placeholder=""
            />
            <div className="mb-3">
                <CFormInput
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    value={product.image}
                    accept="image/*"
                    className="mb-2"
                />
                {product.image && (
                    <CButton color="danger" className="me-2" size="sm" onClick={handleClearImage}>
                        Clear Image
                    </CButton>
                )}
            </div>
            {product.image && (
                <CImage
                    src={product.image}
                    className="img-fluid mb-3"
                    alt="Selected image"
                    style={{ maxWidth: '150px', maxHeight: '150px' }}
                />
            )}
            <div className="d-flex justify-content-end mt-3">
                <CButton color="secondary" className="me-2" size="sm" onClick={onCancel}>
                    Cancel
                </CButton>
                <CButton color="primary" size="sm" type="submit">
                    {product.type === 'add' ? 'Create' : 'Update'}
                </CButton>
            </div>
        </CForm>
    )
}

export default Product

Product.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        code: PropTypes.string,
        barcode: PropTypes.string,
        unit_measurement: PropTypes.string,
        category_id: PropTypes.number,
        is_active: PropTypes.bool,
        default_quantity: PropTypes.bool,
        age_restriction: PropTypes.number,
        description: PropTypes.string,
        taxes: PropTypes.number,
        cost_price: PropTypes.number,
        markup: PropTypes.number,
        sale_price: PropTypes.number,
        color: PropTypes.string,
        image: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    setProduct: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func,
    setShowAppModal: PropTypes.func.isRequired,
}
