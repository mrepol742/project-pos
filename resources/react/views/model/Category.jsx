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
import PropTypes from 'prop-types'
import axiosInstance from '../../services/axios'

const NewCategory = ({ onCancel }) => {
    const [category, setCategory] = useState({
        name: '',
        description: '',
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setCategory((prevProduct) => ({
            ...prevProduct,
            [id]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axiosInstance
            .post('/categories', category)
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                toast.success(`${category.name} created successfully`)
                setCategory({
                    name: '',
                    description: '',
                })
            })
            .catch((error) => {
                console.error('Error creating category:', error)
                toast.error(`Failed to create category ${category.name}`)
            })
    }

    return (
        <CForm onSubmit={handleSubmit}>
            <div className="d-flex align-items-center mb-3 fs-5">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                New Category
            </div>
            <CFormInput
                type="text"
                id="name"
                floatingClassName="mb-3"
                floatingLabel="Name"
                onChange={handleChange}
                placeholder=""
                required
            />
            <CFormInput
                type="text"
                id="description"
                floatingClassName="mb-3"
                floatingLabel="Description"
                onChange={handleChange}
                placeholder=""
                required
            />
            <div className="d-flex justify-content-end mt-3">
                <CButton color="secondary" className="me-2" size="sm" onClick={onCancel}>
                    Cancel
                </CButton>
                <CButton color="primary" size="sm" type="submit">
                    Add Category
                </CButton>
            </div>
        </CForm>
    )
}

export default NewCategory

NewCategory.propTypes = {
    onCancel: PropTypes.func.isRequired,
}
