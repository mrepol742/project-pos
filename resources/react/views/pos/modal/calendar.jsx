import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import PropTypes from 'prop-types'
import Calendar from 'react-calendar'

const CalendarModal = ({ data }) => {
    const { showCalendarModal, setShowCalendarModal } = data

    return (
        <>
            <CModal
                alignment="center"
                scrollable
                visible={showCalendarModal}
                onClose={() => setShowCalendarModal(false)}
                aria-labelledby="Calendar Modal"
            >
                <CModalBody>
                    <Calendar />
                </CModalBody>
            </CModal>
        </>
    )
}

export default CalendarModal

CalendarModal.propTypes = {
    data: PropTypes.shape({
        showCalendarModal: PropTypes.bool.isRequired,
        setShowCalendarModal: PropTypes.func.isRequired,
    }).isRequired,
}
