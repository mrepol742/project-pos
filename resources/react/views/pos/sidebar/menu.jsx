import React, { useEffect } from 'react'
import { CButton, CImage, CNavbarNav, CNavItem, CNavLink } from '@coreui/react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Menu = ({ data }) => {
    const { showMenu, setShowMenu, popupMenu, setPopupMenu, showPopupMenu, setShowPopupMenu } = data
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const route = [
        {
            name: 'Sales History',
            path: '/history',
            icon: faAdd,
        },
        {
            name: 'Open Sales',
            path: '/open-sales',
            icon: faAdd,
        },
        {
            name: 'Cash In/Out',
            path: '/cash-in-out',
            icon: faAdd,
        },
        {
            name: 'End of Day',
            path: '/eod',
            icon: faAdd,
        },
        {
            name: 'User Info',
            path: '/user-info',
            icon: faAdd,
        },
    ]

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : ''
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            console.log(event.key)
            if (event.key === 'Escape') {
                setShowMenu(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <div className="m-2" data-aos="fade-in">
            <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowMenu(false)}
            >
                <div className="text-center py-3" onClick={() => setShowMenu(false)}>
                    <FontAwesomeIcon icon={faChevronLeft} className="my-auto me-3" />
                    <span className="text-uppercase">Back</span>
                </div>
                <span onClick={(e) => navigate('/logout')}>Logout</span>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center mb-3 text-center">
                <div
                    className="rounded-pill bg-primary d-flex align-items-center justify-content-center fs-2"
                    style={{ width: '80px', height: '80px', color: 'white' }}
                >
                    {getInitials(user.name)}
                </div>
                <h2 className="mt-2 mb-0">{user.name}</h2>
                <p className="mb-0">{user.username}</p>
            </div>
            <CNavbarNav>
                {route.map((item, index) => (
                    <CNavItem key={index}>
                        <CNavLink>
                            <span
                                className="border p-3 rounded"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                onClick={() => {
                                    setPopupMenu(item.path)
                                    setShowMenu(false)
                                    setShowPopupMenu(true)
                                }}
                            >
                                <FontAwesomeIcon icon={item.icon} className="my-auto" />
                                <span>{item.name}</span>
                            </span>
                        </CNavLink>
                    </CNavItem>
                ))}
            </CNavbarNav>
        </div>
    )
}

export default Menu

Menu.propTypes = {
    data: PropTypes.shape({
        showMenu: PropTypes.bool.isRequired,
        setShowMenu: PropTypes.func.isRequired,
        popupMenu: PropTypes.string.isRequired,
        setPopupMenu: PropTypes.func.isRequired,
        showPopupMenu: PropTypes.bool.isRequired,
        setShowPopupMenu: PropTypes.func.isRequired,
    }).isRequired,
}
