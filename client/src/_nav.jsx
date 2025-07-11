import React from 'react'
import { CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartSimple,
    faCartShopping,
    faUser,
    faBox,
    faGear,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/',
        icon: <FontAwesomeIcon icon={faChartSimple} className="me-2" />,
    },
    {
        component: CNavTitle,
        name: 'Store',
    },
    {
        component: CNavItem,
        name: 'Products',
        to: '/products',
        icon: <FontAwesomeIcon icon={faBox} className="me-2" />,
    },
    {
        component: CNavItem,
        name: 'Categories',
        to: '/categories',
        icon: <FontAwesomeIcon icon={faBox} className="me-2" />,
    },
    {
        component: CNavItem,
        name: 'Sales',
        to: '/sales',
        icon: <FontAwesomeIcon icon={faCartShopping} className="me-2" />,
    },
    {
        component: CNavItem,
        name: 'Users',
        to: '/users',
        icon: <FontAwesomeIcon icon={faUser} className="me-2" />,
    },
    {
        component: CNavItem,
        name: 'Settings',
        to: '/settings',
        icon: <FontAwesomeIcon icon={faGear} className="me-2" />,
    },
]

export default _nav
