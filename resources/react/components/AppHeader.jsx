import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
    CContainer,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CHeader,
    CHeaderNav,
    CHeaderToggler,
    CNavLink,
    CNavItem,
    useColorModes,
    CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilBell,
    cilContrast,
    cilEnvelopeOpen,
    cilList,
    cilMenu,
    cilMoon,
    cilSun,
} from '@coreui/icons'
import AppHeaderDropdown from './AppHeaderDropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faBell, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import AppModal from './AppModal'
import Product from '../views/model/Product'

const AppHeader = () => {
    const headerRef = useRef()
    const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    const [showAppModal, setShowAppModal] = React.useState(false)
    const dispatch = useDispatch()
    const sidebarShow = useSelector((state) => state.sidebarShow)

    useEffect(() => {
        document.addEventListener('scroll', () => {
            headerRef.current &&
                headerRef.current.classList.toggle(
                    'shadow-sm',
                    document.documentElement.scrollTop > 0,
                )
        })
    }, [])

    return (
        <>
            <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
                <CContainer className="border-bottom px-4" fluid>
                    <CHeaderToggler
                        onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
                        style={{ marginInlineStart: '-14px' }}
                    >
                        <CIcon icon={cilMenu} size="lg" />
                    </CHeaderToggler>
                    <CHeaderNav className="me-auto">
                        <CNavItem>
                            <CNavLink href="#" onClick={() => setShowAppModal(true)}>
                                <FontAwesomeIcon icon={faAdd} size="lg" />
                            </CNavLink>
                        </CNavItem>
                    </CHeaderNav>
                    <CHeaderNav className="ms-auto">
                        <CNavItem>
                            <CNavLink href="#">
                                <FontAwesomeIcon icon={faBell} size="lg" />
                            </CNavLink>
                        </CNavItem>
                    </CHeaderNav>
                    <CHeaderNav>
                        {colorMode === 'dark' ? (
                            <CNavItem>
                                <CNavLink href="#" onClick={() => setColorMode('light')}>
                                    <FontAwesomeIcon icon={faMoon} size="lg" />
                                </CNavLink>
                            </CNavItem>
                        ) : (
                            <CNavItem>
                                <CNavLink href="#" onClick={() => setColorMode('dark')}>
                                    <FontAwesomeIcon icon={faSun} size="lg" />
                                </CNavLink>
                            </CNavItem>
                        )}
                        <AppHeaderDropdown className="app-header-dropdown" />
                    </CHeaderNav>
                </CContainer>
            </CHeader>
            <AppModal
                data={{
                    showAppModal,
                    setShowAppModal,
                }}
            >
                <Product />
            </AppModal>
        </>
    )
}

export default AppHeader
