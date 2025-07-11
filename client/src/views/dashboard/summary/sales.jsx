import React, { useEffect, useRef, useState } from 'react'
import { getStyle } from '@coreui/utils'
import { CChart } from '@coreui/react-chartjs'

export const Sales = () => {
    const chartRef = useRef(null)
    const [data, setData] = useState({
        labels: ['This week', 'Last week'],
        datasets: [
            {
                backgroundColor: ['#41B883', '#E46651'],
                data: [1, 1],
            },
        ],
    })

    const fetchSummarySales = async () => {
        axios.get('/dashboard/summary-sales').then((response) => {
            if (response.data.error) return toast.error(response.data.error)
            setData({
                ...data,
                datasets: [
                    {
                        ...data.datasets[0],
                        data: [response.data.recent, response.data.previous],
                    },
                ],
            })
        })
    }

    useEffect(() => {
        fetchSummarySales()

        const handleColorSchemeChange = () => {
            const chartInstance = chartRef.current
            if (chartInstance) {
                const { options } = chartInstance

                if (options.plugins?.legend?.labels) {
                    options.plugins.legend.labels.color = getStyle('--cui-body-color')
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

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: getStyle('--cui-body-color'),
                },
            },
        },
    }

    return <CChart type="doughnut" data={data} options={options} ref={chartRef} />
}
