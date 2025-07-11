import React, { useEffect, useState, useRef, use } from 'react'
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
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons'
import { reference } from '@popperjs/core'

const PaymentInput = ({ data }) => {
    const {
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
    } = data
    const [amount, setAmount] = useState(products.amount || '')
    const total = getTotal()

    const handleClose = () => {
        setAmount('')
        setShowPaymentModal(false)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && showPaymentModal) handleCheckout()
    }

    const handleChange = () => {
        const amount1 = parseFloat(amount)
        const total1 = parseFloat(total)
        const value =
            amount1 >= total1 ? (
                <>
                    {(amount1 - total1).toLocaleString('en-PH', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </>
            ) : (
                '0.00'
            )
        return value
    }

    const handleCheckout = async () => {
        if (products.length === 0) return toast.error('Select a product')
        if (amount < 0) return toast.error('Amount cannot be negative')
        if (parseInt(amount) < parseInt(total)) return toast.error('Amount is less than total')
        if (parseInt(amount) > Number.MAX_SAFE_INTEGER)
            return toast.error('Amount is greater than max safe integer')

        axios
            .post('/sales/checkout', {
                products: products,
                total: total,
                discount: discount,
                total_items: products.reduce((sum, p) => sum + (p.quantity || 1), 0),
                total_discount: 0,
                total_taxes: 0,
                total_payment: amount,
                total_change: amount - total,
                mode_of_payment: paymentMethod,
                reference_number: '12',
            })
            .then((res) => {
                if (res.data.error) return toast.error(res.data.error)
                if (res.status === 200) {
                    setProducts([])
                    setSelectedProduct([])
                    setShowPaymentModal(false)
                    setDiscount(0)
                    setPaymentMethod('cash')
                    setAmount('')
                    toast.success('Checkout successful')

                    try {
                        /*
                         * Connect to the print server using WebSocket
                         * Send the receipt data to the server for printing
                         *
                         * This system assumes to be installed on a local server
                         * and the print server is running on localhost:8080 (Cashier PC)
                         * You can change the URL to match your print server configuration
                         *
                         * Note: Make sure the print server is running and accessible
                         * from the client machine where this code is executed.
                         *
                         * Note: The res.data should be a printer data (with instructions) but due to time
                         * constraints, i am sending the whole response data
                         * to the print server for printing.
                         *
                         * In the future, if the printer data get implemented,
                         * this POS can output a pdf print version of the receipt
                         * and send it to the print server for printing,
                         * incase the print server is not available.
                         */
                        const socket = new WebSocket('ws://localhost:8080')

                        socket.onopen = () => {
                            console.log('Connected to print server')
                            socket.send(JSON.stringify(res.data))
                        }

                        socket.onmessage = (event) => {
                            console.log('Server says:', event.data)
                            const data = JSON.parse(event.data)
                            // eslint-disable-next-line react/prop-types
                            if (data.status !== 'success') toast.error('Failed to print receipt')
                            // eslint-disable-next-line react/prop-types
                            if (data.error) console.error(data.error)
                            socket.close()
                        }

                        socket.onerror = (error) => {
                            toast.error('Error connecting to print server')
                            console.error('WebSocket error:', error)
                        }
                    } catch (error) {}
                }
            })
            .catch((err) => {
                console.error(err)
                toast.error('Checkout failed')
            })
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <>
            <CModal
                alignment="center"
                scrollable
                visible={showPaymentModal}
                onClose={handleClose}
                aria-labelledby="Payment"
            >
                <CModalBody>
                    <h5>Payment</h5>
                    <div className="d-flex flex-row justify-content-between gap-2 mb-3">
                        <div
                            className={`rounded py-3 m-1 d-flex flex-column align-items-center border border-2 flex-fill ${paymentMethod === 'cash' ? 'bg-primary border-primary' : 'border-secondary'}`}
                            onClick={() => setPaymentMethod('cash')}
                            style={{ cursor: 'pointer' }}
                        >
                            Cash
                        </div>
                        <div
                            className={`rounded py-3 m-1 d-flex flex-column align-items-center border border-2 flex-fill ${paymentMethod === 'credit' ? 'bg-primary border-primary' : 'border-secondary'}`}
                            onClick={() => setPaymentMethod('credit')}
                            style={{ cursor: 'pointer' }}
                        >
                            Credit
                        </div>
                        <div
                            className={`rounded py-3 m-1 d-flex flex-column align-items-center border border-2 flex-fill ${paymentMethod === 'debit' ? 'bg-primary border-primary' : 'border-secondary'}`}
                            onClick={() => setPaymentMethod('debit')}
                            style={{ cursor: 'pointer' }}
                        >
                            Debit
                        </div>
                        <div
                            className={`rounded py-3 m-1 d-flex flex-column align-items-center border border-2 flex-fill ${paymentMethod === 'check' ? 'bg-primary border-primary' : 'border-secondary'}`}
                            onClick={() => setPaymentMethod('check')}
                            style={{ cursor: 'pointer' }}
                        >
                            Check
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p>Total:</p>
                        <div className="text-wrap text-break overflow-y">
                            {total.toLocaleString('en-PH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="my-auto">Paid:</p>
                        <CFormInput
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                let val = e.target.value
                                if (val.length > 1 && val.startsWith('0')) {
                                    val = val.replace(/^0+/, '')
                                }
                                if (val === '' || Number(val) <= Number.MAX_SAFE_INTEGER) {
                                    setAmount(val)
                                }
                            }}
                            placeholder="Enter amount"
                            min={0}
                            max={Number.MAX_SAFE_INTEGER}
                            className="w-50"
                        />
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <p className="me-3">Change:</p>
                        <div className="text-wrap text-break overflow-y">{handleChange()}</div>
                    </div>
                    <div className="d-flex justify-content-end mt-3 gap-2">
                        <CButton
                            color="primary"
                            onClick={handleCheckout}
                            disabled={
                                !amount ||
                                parseInt(amount) < parseInt(total) ||
                                parseInt(amount) > Number.MAX_SAFE_INTEGER
                            }
                        >
                            Print Receipt
                        </CButton>
                    </div>
                </CModalBody>
            </CModal>
        </>
    )
}

export default PaymentInput

PaymentInput.propTypes = {
    data: PropTypes.shape({
        showPaymentModal: PropTypes.bool.isRequired,
        setShowPaymentModal: PropTypes.func.isRequired,
        products: PropTypes.array.isRequired,
        setProducts: PropTypes.func.isRequired,
        selectedProduct: PropTypes.array.isRequired,
        setSelectedProduct: PropTypes.func.isRequired,
        getTotal: PropTypes.func.isRequired,
        paymentMethod: PropTypes.string.isRequired,
        setPaymentMethod: PropTypes.func.isRequired,
        discount: PropTypes.any.isRequired,
        setDiscount: PropTypes.func.isRequired,
    }).isRequired,
}
