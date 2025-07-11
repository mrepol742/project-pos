import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
    CImage,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowRightFromBracket,
    faShield,
    faCircleUser,
    faAddressBook,
} from '@fortawesome/free-solid-svg-icons'

const AppHeaderDropdown = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : ''
    }

    return (
        <CDropdown variant="nav-item" className="app-header-dropdown">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <div
                    className="rounded-pill bg-primary d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', color: 'white' }}
                >
                    {getInitials(user.name)}
                </div>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
                    <div
                        className="rounded-pill bg-primary d-flex align-items-center justify-content-center mb-2 fs-4"
                        style={{ width: '70px', height: '70px', color: 'white' }}
                    >
                        {getInitials(user.name)}
                    </div>
                    <span className="d-block text-truncate" style={{ maxWidth: '250px' }}>
                        {user.name}
                    </span>
                    <span className="d-block text-truncate" style={{ maxWidth: '250px' }}>
                        {user.email}
                    </span>
                </CDropdownHeader>
                <CDropdownItem onClick={() => navigate('/account')}>
                    <FontAwesomeIcon icon={faCircleUser} className="me-2" />
                    My Account
                </CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem onClick={() => navigate('/logout')}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="me-2" />
                    Logout
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default AppHeaderDropdown
