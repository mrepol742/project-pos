import React, { useState, useEffect } from 'react'
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CFormInput,
    CTableDataCell,
    CSpinner,
    CInputGroup,
    CInputGroupText,
    CImage,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownLong, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import DeleteModal from './modal/delete'
import QuantityModal from './modal/quantity'
import DiscountModal from './modal/discount'
import PaymentModal from './modal/payment'
import SearchModal from './modal/search'
import CalendarModal from './modal/calendar'
import HelpModal from './modal/help'
import Controls from './sidebar/controls'
import Menu from './sidebar/menu'
import History from './popup/history'
import EndOfDay from './popup/eod'

const PointOfSale = () => {
    const [products, setProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState([])
    const [salesLock, setSalesLock] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showQuantityModal, setShowQuantityModal] = useState(false)
    const [showDiscountModal, setShowDiscountModal] = useState(false)
    const [showNewSaleModal, setShowNewSaleModal] = useState(false)
    const [showSearchModal, setShowSearchModal] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showCalendarModal, setShowCalendarModal] = useState(false)
    const [showHelpModal, setShowHelpModal] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [showMenu, setShowMenu] = useState(false)
    const [discount, setDiscount] = useState(0)
    const [isDirty, setIsDirty] = useState(false)
    const [deleteMode, setDeleteMode] = useState(null)
    const [showBanner, setShowBanner] = useState(false)
    const [popupMenu, setPopupMenu] = useState('')
    const [showPopupMenu, setShowPopupMenu] = useState(false)

    const addProduct = (product) => {
        setProducts((prevProducts) => {
            const existingProduct = prevProducts.find((p) => p.id === product.id)
            if (existingProduct) {
                return prevProducts.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1, discount: 0 } : p,
                )
            } else {
                return [...prevProducts, { ...product, quantity: 1, discount: 0 }]
            }
        })
    }

    const getSubTotal = () => {
        return products
            .filter((product) => product.id !== 'discount' && !product.deleted)
            .reduce((acc, product) => {
                const discountedPrice = product.sale_price * (1 - product.discount / 100)
                return acc + discountedPrice * product.quantity
            }, 0)
    }

    const getTotalTaxes = () => {
        return products
            .filter((product) => !product.deleted)
            .reduce((acc, product) => {
                const discountedPrice = product.sale_price * (1 - product.discount / 100)
                return (
                    acc +
                    (product.taxes ? (discountedPrice * product.taxes) / 100 : 0) * product.quantity
                )
            }, 0)
            .toFixed(2)
    }

    const getDiscount = () => {
        return products.reduce((acc, product) => acc + (product.discount || 0), 0)
    }

    const getTotal = () => {
        return (
            (parseFloat(getSubTotal()) + parseFloat(getTotalTaxes())) *
            (1 - parseFloat(discount) / 100)
        )
    }

    const calculateTotal = (itemPrice, itemQuantity, itemDiscount = 0) => {
        const discountedPrice = itemPrice * (1 - itemDiscount / 100)
        return discountedPrice * itemQuantity
    }

    const calculatePrice = (itemPrice, itemDiscount = 0) => {
        const discountedPrice = itemPrice * (1 - itemDiscount / 100)
        return discountedPrice
    }

    const closeAllModals = () => {
        setShowDeleteModal(false)
        setShowQuantityModal(false)
        setShowDiscountModal(false)
        setShowNewSaleModal(false)
        setShowSearchModal(false)
        setShowPaymentModal(false)
        setShowCalendarModal(false)
        setShowHelpModal(false)
    }

    const handleKeyDown = (event) => {
        const keyActions = [
            {
                condition: event.key === 'F1',
                action: () => setShowCalendarModal(true),
            },
            {
                condition: event.key === 'F2',
                action: handleDiscount,
            },
            {
                condition: event.key === 'F4',
                action: handleQuantity,
            },
            {
                condition: event.key === 'F10',
                action: handlePayment,
            },
            {
                condition: event.key === 'Delete',
                action: handleDelete,
            },
            {
                condition: event.key === 'F5',
                action: handleNewSale,
            },
            {
                condition: event.ctrlKey && event.key.toLowerCase() === 'h',
                action: () => setShowHelpModal(true),
            },
        ]

        for (const { condition, action } of keyActions) {
            if (condition) {
                event.preventDefault()
                closeAllModals()
                action()
                break
            }
        }
    }

    const fetchSalesLock = async () => {
        axios
            .get(`/sales-lock`)
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                if (response.data.length > 0) {
                    setSalesLock(true)
                    setProducts(JSON.parse(response.data))
                } else {
                    setSalesLock(false)
                }
            })
            .catch((error) => {
                console.error('Error fetching sales lock:', error)
            })
    }

    const handleSalesLock = async () => {
        if (products.length === 0) return toast.error('No products in cart')
        axios
            .post(`/sales-lock`, {
                products: !salesLock ? JSON.stringify(products) : '[]',
                mode: !salesLock,
            })
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                toast.success(
                    salesLock ? 'Sales unlocked successfully' : 'Sales locked successfully',
                )
                setSalesLock(!salesLock)
            })
            .catch((error) => {
                console.error('Error fetching sales lock:', error)
            })
    }

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isDirty) {
                event.preventDefault()
                event.returnValue = ''
                return ''
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [isDirty])

    useEffect(() => {
        fetchSalesLock()

        let inactivityTimeout

        const handleUserActivity = () => {
            setShowBanner(false)
            clearTimeout(inactivityTimeout)
            inactivityTimeout = setTimeout(() => {
                setShowBanner(true)
            }, 60000) // 1 minute of inactivity
        }

        inactivityTimeout = setTimeout(() => {
            setShowBanner(true)
        }, 60000)

        window.addEventListener('mousemove', handleUserActivity)
        window.addEventListener('keydown', handleUserActivity)

        return () => {
            window.removeEventListener('mousemove', handleUserActivity)
            window.removeEventListener('keydown', handleUserActivity)
            clearTimeout(inactivityTimeout)
        }
    }, [])

    const handleSearch = (event) => {
        if (salesLock) return toast.error('Sales locked')
        const query = event.target.value
        if (query.includes(' ')) {
            setSearchQuery(query)
            return setShowSearchModal(true)
        }

        const existingProduct = products.find(
            (p) => p.barcode && p.barcode.toLowerCase() === query && p.discount === 0,
        )
        if (existingProduct) {
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p.barcode && p.barcode.toLowerCase() === query
                        ? { ...p, quantity: p.quantity + 1 }
                        : p,
                ),
            )
            setIsDirty(true)
            return
        }

        axios
            .get(`/products/${query}`)
            .then((response) => {
                if (response.data.error) return toast.error(response.data.error)
                if (!response.data.id) return toast.error('Product not found')
                const foundProduct = response.data
                setProducts((prevProducts) => {
                    const existingProduct = prevProducts.find(
                        (p) => p.id === foundProduct.id && p.discount === 0,
                    )
                    if (existingProduct) {
                        return prevProducts.map((p) =>
                            p.id === foundProduct.id
                                ? { ...p, quantity: p.quantity + 1, discount: 0 }
                                : p,
                        )
                    } else {
                        return [
                            ...prevProducts,
                            { ...foundProduct, quantity: 1, discount: 0, date: Date.now() },
                        ]
                    }
                })
                setIsDirty(true)
            })
            .catch((error) => {
                console.error('Error searching products:', error)
            })
    }

    const handleFocusClick = (product_id) => {
        if (selectedProduct.includes(product_id))
            return setSelectedProduct(selectedProduct.filter((id) => id !== product_id))
        setSelectedProduct([...selectedProduct, product_id])
    }

    const handleQuantity = () => {
        if (salesLock) return toast.error('Sales locked')
        if (selectedProduct.length === 0) return toast.error('Select a product')
        setShowQuantityModal(true)
    }

    const handleDiscount = () => {
        if (salesLock) return toast.error('Sales locked')
        if (products.length === 0) return toast.error('No products in cart')
        setShowDiscountModal(true)
    }

    const handleDelete = (mode) => {
        if (salesLock) return toast.error('Sales locked')
        if (selectedProduct.length === 0) return toast.error('Select a product')
        setShowDeleteModal(true)
        setDeleteMode(mode)
    }

    const handleNewSale = () => {
        if (salesLock) return toast.error('Sales locked')
        if (products.length === 0) return toast.error('No products in cart')
        setProducts([])
        setSelectedProduct([])
    }

    const handlePayment = () => {
        if (salesLock) return toast.error('Sales locked')
        if (products.length === 0) return toast.error('No products in cart')
        setShowPaymentModal(true)
    }

    const handleSearchInput = (event) => {
        setSearchQuery(event.target.value)

        // if (event.target.value.length > 0) {
        //     const currentTime = new Date().getTime()
        //     if (!event.target.lastInputTime) {
        //         event.target.lastInputTime = currentTime
        //     } else {
        //         const timeDifference = currentTime - event.target.lastInputTime
        //         event.target.lastInputTime = currentTime
        //         console.log(timeDifference + 'ms')
        //         if (timeDifference > 1000) {
        //             handleSearch(event)
        //             event.target.value = ''
        //             setSearchQuery('')
        //         }
        //     }
        // }
    }

    if (salesLock === null)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <CSpinner color="primary" />
            </div>
        )

    return (
        <div
            className="d-flex flex-column"
            style={{ height: '100vh', width: '99.3%', position: 'relative' }}
        >
            {showBanner && (
                <div
                    style={{
                        zIndex: 9000,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100vh',
                        width: '100vw',
                        background: '#fff',
                    }}
                >
                    <CImage
                        src="/images/banner.jpg"
                        className="img-fluid"
                        alt="Banner"
                        style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
                    />
                </div>
            )}
            {popupMenu === '/history' && <History data={{ showPopupMenu, setShowPopupMenu }} />}
            {popupMenu === '/eod' && <EndOfDay data={{ showPopupMenu, setShowPopupMenu }} />}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                    color: '#000',
                    letterSpacing: '0.1em',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                }}
            >
                <span style={{ fontSize: '4vw', fontWeight: 700, opacity: 0.08 }}>Project POS</span>
                <span className="d-block" style={{ opacity: 0.2 }}>
                    www.melvinjonesrepol.com
                </span>
            </div>
            <DeleteModal
                data={{
                    showDeleteModal,
                    setShowDeleteModal,
                    products,
                    setProducts,
                    selectedProduct,
                    setSelectedProduct,
                    deleteMode,
                }}
            />
            <QuantityModal
                data={{
                    showQuantityModal,
                    setShowQuantityModal,
                    products,
                    setProducts,
                    selectedProduct,
                    setSelectedProduct,
                }}
            />
            <DiscountModal
                data={{
                    showDiscountModal,
                    setShowDiscountModal,
                    products,
                    setProducts,
                    selectedProduct,
                    setSelectedProduct,
                    discount,
                    setDiscount,
                }}
            />
            <PaymentModal
                data={{
                    showPaymentModal,
                    setShowPaymentModal,
                    products,
                    setProducts,
                    selectedProduct,
                    setSelectedProduct,
                    getTotal,
                    paymentMethod,
                    setPaymentMethod,
                    discount,
                    setDiscount,
                }}
            />
            <SearchModal
                data={{
                    showSearchModal,
                    setShowSearchModal,
                    products,
                    setProducts,
                    searchQuery,
                }}
            />
            <CalendarModal
                data={{
                    showCalendarModal,
                    setShowCalendarModal,
                }}
            />
            <HelpModal
                data={{
                    showHelpModal,
                    setShowHelpModal,
                }}
            />
            <CRow className="flex-grow-1 overflow-hidden">
                <CCol className="d-flex flex-column h-100 pe-0">
                    <CFormInput
                        className="rounded-0 py-3 border-0 border-bottom"
                        type="search"
                        placeholder="Search product by name or barcode"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={handleSearchInput}
                        autoFocus
                        onFocus={(event) => {
                            event.target.select()
                            event.target.setSelectionRange(0, event.target.value.length)
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSearch(event)
                                if (!event.target.value.includes(' ')) {
                                    event.target.value = ''
                                    setSearchQuery('')
                                }
                            }
                        }}
                    />
                    <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell
                                        scope="col"
                                        className="text-uppercase"
                                        style={{ minWidth: 180 }}
                                    >
                                        Item
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                        scope="col"
                                        className="text-uppercase text-end"
                                        style={{ width: 100, maxWidth: 120 }}
                                    >
                                        Price
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                        scope="col"
                                        className="text-uppercase text-end"
                                        style={{ width: 50, maxWidth: 120 }}
                                    >
                                        QTY
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                        scope="col"
                                        className="text-uppercase text-end"
                                        style={{ width: 50, maxWidth: 120 }}
                                    >
                                        Total
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            {products.length !== 0 && (
                                <CTableBody>
                                    {products.map((product, index) => {
                                        const priceWithTax = product.taxes
                                            ? product.sale_price +
                                              (product.sale_price * product.taxes) / 100
                                            : product.sale_price

                                        return (
                                            <CTableRow
                                                key={index}
                                                active={selectedProduct.includes(product.date)}
                                                onClick={() => handleFocusClick(product.date)}
                                            >
                                                <CTableDataCell>
                                                    <span
                                                        className={`${product.deleted && 'text-danger'}`}
                                                    >
                                                        {product.name}
                                                    </span>
                                                    <span
                                                        className={`${product.deleted ? 'text-danger' : 'text-muted'} d-block`}
                                                        style={{ fontSize: '0.7em' }}
                                                    >
                                                        {product.barcode}
                                                    </span>
                                                </CTableDataCell>
                                                <CTableDataCell
                                                    className={`${product.deleted && 'text-danger'} text-end`}
                                                >
                                                    {calculatePrice(
                                                        priceWithTax,
                                                        product.discount,
                                                    ).toLocaleString('en-PH', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                    {product.discount > 0 && (
                                                        <div
                                                            className="d-block text-muted text-decoration-line-through"
                                                            style={{ fontSize: '0.7em' }}
                                                        >
                                                            {calculatePrice(
                                                                priceWithTax,
                                                                0,
                                                            ).toLocaleString('en-PH', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })}
                                                        </div>
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell
                                                    className={`${product.deleted && 'text-danger'} text-end`}
                                                >
                                                    {product.quantity}
                                                </CTableDataCell>
                                                <CTableDataCell
                                                    className={`${product.deleted && 'text-danger'} text-end`}
                                                >
                                                    {calculateTotal(
                                                        priceWithTax,
                                                        product.quantity,
                                                        product.discount,
                                                    ).toLocaleString('en-PH', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </CTableDataCell>
                                            </CTableRow>
                                        )
                                    })}
                                </CTableBody>
                            )}
                        </CTable>
                    </div>
                </CCol>
                <CCol
                    lg={5}
                    xl={3}
                    className="d-flex flex-column border-start border-2 border-secondary h-100"
                >
                    {!showMenu ? (
                        <Controls
                            data={{
                                handleDelete,
                                handleQuantity,
                                handleNewSale,
                                handleDiscount,
                                handleSalesLock,
                                handlePayment,
                                salesLock,
                                selectedProduct,
                                showMenu,
                                setShowMenu,
                                discount,
                                getDiscount,
                                paymentMethod,
                                setPaymentMethod,
                                setShowCalendarModal,
                                getSubTotal,
                                getTotalTaxes,
                                getTotal,
                            }}
                        />
                    ) : (
                        <Menu
                            data={{
                                showMenu,
                                setShowMenu,
                                popupMenu,
                                setPopupMenu,
                                showPopupMenu,
                                setShowPopupMenu,
                            }}
                        />
                    )}
                </CCol>
            </CRow>
        </div>
    )
}

export default PointOfSale
