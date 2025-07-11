import React from 'react'
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

const EndOfDay = ({ data }) => {
    const { popupMenu, setPopupMenu, showPopupMenu, setShowPopupMenu } = data

    return (
        <>
            <CModal
                alignment="center"
                scrollable
                visible={showPopupMenu}
                onClose={() => setShowPopupMenu(false)}
                aria-labelledby="Help Modal"
            >
                <CModalHeader className="border-0">
                    <CModalTitle className="text-center">End of Day</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <span className="d-block">Are you sure you want to end the day?</span>
                        <span>
                            All sales will be finalized and no further transactions can be made.
                        </span>
                    </div>
                    <CFormInput
                        className="mt-3"
                        type="text"
                        placeholder="Enter the cash drawer amount"
                        aria-label="Cash drawer amount"
                    />
                    <CButton
                        className="mt-3"
                        color="primary"
                        onClick={() => {
                            // Handle end of day logic here
                            setShowPopupMenu(false)
                            setPopupMenu('')
                        }}
                    >
                        Confirm End of Day
                    </CButton>
                </CModalBody>
            </CModal>
        </>
    )
}

export default EndOfDay

EndOfDay.propTypes = {
    data: PropTypes.shape({
        popupMenu: PropTypes.string.isRequired,
        setPopupMenu: PropTypes.func.isRequired,
        showPopupMenu: PropTypes.bool.isRequired,
        setShowPopupMenu: PropTypes.func.isRequired,
    }).isRequired,
}
