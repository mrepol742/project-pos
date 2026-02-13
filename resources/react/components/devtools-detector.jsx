import { useEffect } from 'react'
import { addListener, launch } from 'devtools-detector'

function DevToolsDetector() {
    useEffect(() => {
        const isProduction = import.meta.env.VITE_APP_ENV === 'production'
        if (!isProduction) return

        addListener((isOpen) => {
            if (isOpen) window.location.href = '/logout'
        })

        launch()
    }, [])

    return null
}

export default DevToolsDetector
