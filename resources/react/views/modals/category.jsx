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

const NewCategory = ({ category, setCategory, onCancel, fetchCategories, setShowAppModal }) => {
    const handleChange = (e) => {
        const { id, value } = e.target
        setCategory((prevProduct) => ({
            ...prevProduct,
            [id]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (category.type === 'add')
            return axiosInstance
                .post('/categories', category)
                .then((response) => {
                    toast.success(`${category.name} created successfully`)
                    setCategory({
                        name: '',
                        description: '',
                        type: 'add',
                    })
                    fetchCategories(1)
                    setShowAppModal(false)
                })
                .catch((error) => {
                    console.error('Error creating category:', error)
                    toast.error(error.response.data.message)
                })

        axiosInstance
            .patch(`/categories/${category.id}`, category)
            .then((response) => {
                toast.success(`${category.name} updated successfully`)
                setCategory({
                    name: '',
                    description: '',
                    type: 'add',
                })
                fetchCategories(1)
                setShowAppModal(false)
            })
            .catch((error) => {
                console.error('Error updating category:', error)
                toast.error(error.response.data.message)
            })
    }

    return (
        <CForm onSubmit={handleSubmit}>
            <div className="d-flex align-items-center mb-3 fs-5">
                <FontAwesomeIcon
                    icon={category.type === 'add' ? faPlus : faEdit}
                    className="me-2"
                />
                {category.type === 'add' ? 'New Category' : 'Edit Category'}
            </div>
            <CFormInput
                type="text"
                id="name"
                floatingClassName="mb-3"
                floatingLabel="Name"
                onChange={handleChange}
                value={category.name}
                placeholder=""
                required
            />
            <CFormInput
                type="text"
                id="description"
                floatingClassName="mb-3"
                floatingLabel="Description"
                onChange={handleChange}
                value={category.description}
                placeholder=""
            />
            <div className="d-flex justify-content-end mt-3">
                <CButton color="secondary" className="me-2" size="sm" onClick={onCancel}>
                    Cancel
                </CButton>
                <CButton color="primary" size="sm" type="submit">
                    {category.type === 'add' ? 'Create' : 'Update'}
                </CButton>
            </div>
        </CForm>
    )
}

export default NewCategory

NewCategory.propTypes = {
    category: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    setCategory: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    fetchCategories: PropTypes.func.isRequired,
    setShowAppModal: PropTypes.func.isRequired,
}
