import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Toast from './components/Toast'

export default function App() {
    const [toast, setToast] = useState({ msg: '', visible: false, error: false })

    const showToast = (msg, error = false) => {
        setToast({ msg, visible: true, error })
        setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500)
    }

    return (
        <>
            {/* All children  */}
            <Outlet context={{ showToast }} />

            <Toast msg={toast.msg} visible={toast.visible} error={toast.error} />
        </>
    )
}