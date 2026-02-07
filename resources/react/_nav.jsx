import React from 'react'
import { CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartSimple,
    faCartShopping,
    faUser,
    faBox,
    faGear,
    faFileAlt,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/',
        icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Products',
        to: '/products',
        icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Categories',
        to: '/categories',
        icon: <FontAwesomeIcon icon={faBox} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Sales',
        to: '/sales',
        icon: <FontAwesomeIcon icon={faCartShopping} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Users',
        to: '/users',
        icon: <FontAwesomeIcon icon={faUser} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Settings',
        to: '/settings',
        icon: <FontAwesomeIcon icon={faGear} className="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Logs',
        to: '/logs',
        icon: <FontAwesomeIcon icon={faFileAlt} className="nav-icon" />,
    },
]

export default _nav
