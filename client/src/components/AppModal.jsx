import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import PropTypes from 'prop-types'

const AppModal = ({ data, children }) => {
    const { showAppModal, setShowAppModal } = data

    return (
        <>
            <CModal
                alignment="center"
                scrollable
                visible={showAppModal}
                onClose={() => setShowAppModal(false)}
            >
                <CModalBody>{children}</CModalBody>
            </CModal>
        </>
    )
}

export default AppModal

AppModal.propTypes = {
    data: PropTypes.shape({
        showAppModal: PropTypes.bool.isRequired,
        setShowAppModal: PropTypes.func.isRequired,
    }).isRequired,
    children: PropTypes.node.isRequired,
}
