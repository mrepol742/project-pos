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

const NewCategory = () => {
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
        axios
            .post('/groups', category)
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                toast.success('Category created successfully')
                setCategory({
                    name: '',
                    description: '',
                })
            })
            .catch((error) => {
                console.error('Error adding category:', error)
            })
    }

    return (
        <CForm onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between">
                <h3 className="mb-3">New Category</h3>
                <div>
                    <CButton color="secondary" className="me-2" size="sm">
                        Cancel
                    </CButton>
                    <CButton color="primary" size="sm" type="submit">
                        Save
                    </CButton>
                </div>
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
        </CForm>
    )
}

export default NewCategory
