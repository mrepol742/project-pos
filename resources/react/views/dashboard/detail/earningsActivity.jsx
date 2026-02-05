import React, { useEffect, useState, useRef } from 'react'
import { getStyle } from '@coreui/utils'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'

export const EarningsActivity = () => {
    const chartRef = useRef(null)
    const [storeActivityDropdown, setStoreActivityDropdown] = useState('monthly')
    const [EarningsActivity, setEarningsActivity] = useState([])

    useEffect(() => {
        const handleColorSchemeChange = () => {
            const chartInstance = chartRef.current
            if (chartInstance) {
                const { options } = chartInstance

                if (options.plugins?.legend?.labels) {
                    options.plugins.legend.labels.color = getStyle('--cui-body-color')
                }

                if (options.scales?.x) {
                    if (options.scales.x.grid) {
                        options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
                    }
                    if (options.scales.x.ticks) {
                        options.scales.x.ticks.color = getStyle('--cui-body-color')
                    }
                }

                if (options.scales?.y) {
                    if (options.scales.y.grid) {
                        options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
                    }
                    if (options.scales.y.ticks) {
                        options.scales.y.ticks.color = getStyle('--cui-body-color')
                    }
                }

                chartInstance.update()
            }
        }

        document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)

        return () => {
            document.documentElement.removeEventListener(
                'ColorSchemeChange',
                handleColorSchemeChange,
            )
        }
    }, [])

    const data = {
        labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
        datasets: [
            {
                label: 'This year',
                backgroundColor: 'rgba(220, 220, 220, 0.2)',
                borderColor: 'rgba(220, 220, 220, 1)',
                pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                pointBorderColor: '#fff',
                data: [505, 508, 76, 336, 65, 235, 655, 6568, 346, 346, 346, 325],
                fill: true,
            },
            {
                label: 'Last year',
                backgroundColor: 'rgba(151, 187, 205, 0.2)',
                borderColor: 'rgba(151, 187, 205, 1)',
                pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                pointBorderColor: '#fff',
                data: [5, 51, 8, 357, 647, 235, 6595, 6679, 3463, 3463, 3464, 3252],
                fill: true,
            },
        ],
    }

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: getStyle('--cui-body-color'),
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                    color: getStyle('--cui-body-color'),
                },
                type: 'category',
            },
            y: {
                grid: {
                    color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                    color: getStyle('--cui-body-color'),
                },
                beginAtZero: true,
            },
        },
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <h6>Sales activity</h6>
                <CDropdown>
                    <CDropdownToggle color="secondary" className="text-capitalize">
                        {storeActivityDropdown}
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem onClick={(e) => setStoreActivityDropdown('daily')}>
                            Daily
                        </CDropdownItem>
                        <CDropdownItem onClick={(e) => setStoreActivityDropdown('weekly')}>
                            Weekly
                        </CDropdownItem>
                        <CDropdownItem onClick={(e) => setStoreActivityDropdown('monthly')}>
                            Monthly
                        </CDropdownItem>
                        <CDropdownItem onClick={(e) => setStoreActivityDropdown('yearly')}>
                            Yearly
                        </CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </div>
            <CChart type="line" data={data} options={options} ref={chartRef} />
        </>
    )
}
