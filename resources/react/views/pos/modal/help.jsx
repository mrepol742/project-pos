import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import PropTypes from 'prop-types'

const Help = ({ data }) => {
    const { showHelpModal, setShowHelpModal } = data

    return (
        <>
            <CModal
                alignment="center"
                scrollable
                visible={showHelpModal}
                onClose={() => setShowHelpModal(false)}
                aria-labelledby="Help Modal"
            >
                <CModalBody>Hello World</CModalBody>
            </CModal>
        </>
    )
}

export default Help

Help.propTypes = {
    data: PropTypes.shape({
        showHelpModal: PropTypes.bool.isRequired,
        setShowHelpModal: PropTypes.func.isRequired,
    }).isRequired,
}
