import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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
import AppHeaderDropdown from './header-dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faBell, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import AppModal from './modal'
import Product from '../views/modals/product'

const AppHeader = () => {
    const headerRef = useRef()
    const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    const [showAppModal, setShowAppModal] = useState(false)
    const dispatch = useDispatch()
    const sidebarShow = useSelector((state) => state.sidebarShow)
    const location = useLocation()
    const [product, setProduct] = useState({
        name: '',
        code: '',
        barcode: '',
        unit_measurement: '',
        category_id: 0,
        is_active: true,
        default_quantity: true,
        age_restriction: 0,
        description: '',
        taxes: 0,
        cost_price: 0,
        markup: 0,
        sale_price: 0,
        color: '',
        image: null,
        type: 'add',
    })

    const isProductsPage = /^\/products(\/.*)?$/.test(location.pathname)

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
                        {!isProductsPage && (
                            <CNavItem>
                                <CNavLink href="#" onClick={() => setShowAppModal(true)}>
                                    <FontAwesomeIcon icon={faAdd} size="lg" />
                                </CNavLink>
                            </CNavItem>
                        )}
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
                {({ onClose }) => (
                    <Product
                        product={product}
                        setProduct={setProduct}
                        onCancel={onClose}
                        setShowAppModal={setShowAppModal}
                    />
                )}
            </AppModal>
        </>
    )
}

export default AppHeader
