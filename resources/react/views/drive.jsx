import { CCol, CRow } from '@coreui/react'
import React, { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import axiosInstance from '../services/axios'
import { toast } from 'react-toastify'

const Drive = () => {
    const [files, setFiles] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)

    const [uploadQueue, setUploadQueue] = useState([])
    const [uploading, setUploading] = useState(false)
    const [currentUpload, setCurrentUpload] = useState(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        fetchFiles(currentPage)
    }, [currentPage])

    const fetchFiles = async (page) => {
        try {
            const response = await axiosInstance.get('/files', {
                params: { page },
            })
            if (response.data.error) return toast.error(response.data.error)
            setFiles(response.data.data)
            setTotalPages(response.data.totalPages)
            setCurrentPage(response.data.currentPage)
        } catch (error) {
            toast.error('Failed to fetch files list')
        } finally {
            setLoading(false)
        }
    }

    const uploadNext = useCallback(async () => {
        if (uploadQueue.length === 0) {
            setUploading(false)
            setCurrentUpload(null)
            setProgress(0)
            fetchFiles(currentPage)
            return
        }

        const file = uploadQueue[0]
        setCurrentUpload(file)
        setUploading(true)

        const formData = new FormData()
        formData.append('file', file)

        try {
            await axiosInstance.post(
                '/files',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
                {
                    onUploadProgress: (e) => {
                        const percent = Math.round((e.loaded * 100) / e.total)
                        setProgress(percent)
                    },
                },
            )

            toast.success(`${file.name} uploaded`)
        } catch {
            toast.error(`Failed to upload ${file.name}`)
        } finally {
            setUploadQueue((prev) => prev.slice(1))
            setProgress(0)
        }
    }, [uploadQueue, currentPage])

    useEffect(() => {
        if (!uploading && uploadQueue.length > 0) {
            uploadNext()
        }
    }, [uploadQueue, uploading, uploadNext])

    const handleDrop = (e) => {
        e.preventDefault()
        const droppedFiles = Array.from(e.dataTransfer.files)
        setUploadQueue((prev) => [...prev, ...droppedFiles])
    }

    const preventDefault = (e) => e.preventDefault()

    return (
        <>
            <Helmet>
                <title>Drive - Project POS</title>
            </Helmet>
            {/* Full drag area */}
            <div
                onDrop={handleDrop}
                onDragOver={preventDefault}
                onDragEnter={preventDefault}
                style={{
                    minHeight: '80vh',
                    position: 'relative',
                }}
            >
                <CRow className="mb-3">
                    <CCol>
                        <h1>Drive</h1>
                        <span>{files.length.toLocaleString()} Files</span>
                    </CCol>
                </CRow>

                {loading && (
                    <div className="text-center">
                        <h3>Loading files...</h3>
                    </div>
                )}

                {!loading && files.length === 0 && (
                    <div className="text-center">
                        <h3>No files yet</h3>
                        <p>Drag & drop files anywhere to upload</p>
                    </div>
                )}

                {files.length > 0 && (
                    <>
                        <CRow className="mb-3">
                            {files.map((file) => (
                                <CCol key={file.id} md={3} className="mb-3">
                                    <div
                                        style={{
                                            background: '#1f2937',
                                            color: '#fff',
                                            padding: '12px 16px',
                                            borderRadius: 8,
                                            boxShadow: '0 5px 15px rgba(0,0,0,.1)',
                                        }}
                                    >
                                        <strong
                                            className="text-wrap"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {file.file_name}
                                        </strong>
                                        <div style={{ fontSize: 12, marginTop: 4 }}>
                                            {(file.file_size / (1024 * 1024)).toFixed(2)} MB
                                        </div>
                                    </div>
                                </CCol>
                            ))}
                        </CRow>
                    </>
                )}
            </div>

            {currentUpload && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        background: '#1f2937',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: 8,
                        width: 260,
                        boxShadow: '0 10px 25px rgba(0,0,0,.2)',
                        zIndex: 9999,
                    }}
                >
                    <strong>Uploading</strong>
                    <div
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                        }}
                    >
                        {currentUpload.name}
                    </div>

                    <div
                        style={{
                            height: 6,
                            background: '#374151',
                            borderRadius: 4,
                            marginTop: 8,
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: '#22c55e',
                                borderRadius: 4,
                                transition: 'width .2s',
                            }}
                        />
                    </div>

                    <div style={{ fontSize: 12, marginTop: 6 }}>{progress}%</div>
                </div>
            )}
        </>
    )
}

export default Drive
