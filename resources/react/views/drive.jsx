import { CCol, CRow } from '@coreui/react'
import React, { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import axiosInstance from '../services/axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import AppPagination from '../components/pagination'

const Drive = () => {
    const [files, setFiles] = useState([])
    const [totalSize, setTotalSize] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)

    const [uploadQueue, setUploadQueue] = useState([])
    const [uploading, setUploading] = useState(false)

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
            setTotalSize(response.data.totalSize)
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
            fetchFiles(currentPage)
            return
        }

        const file = uploadQueue[0]
        setUploading(true)

        const formData = new FormData()
        formData.append('file', file)

        const response = new Promise(async (resolve, reject) => {
            try {
                const res = await axiosInstance.post('/files', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                if (res.data.error) {
                    return reject(res.data.error)
                }
                resolve(res.data)
            } catch (error) {
                reject(error)
            } finally {
                setUploadQueue((prev) => prev.slice(1))
            }
        })

        toast.promise(response, {
            pending: `Uploading ${file.name}...`,
            success: `${file.name} uploaded successfully`,
            error: `Failed to upload ${file.name}`,
        })
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

    const getSize = (size) => {
        if (size < 1024) return `${size} B`
        else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
        else if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
        else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
    }

    const preventDefault = (e) => e.preventDefault()

    return (
        <>
            <Helmet>
                <title>Drive - Project POS</title>
            </Helmet>

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
                        <span>
                            {files.length.toLocaleString()} Files · {getSize(totalSize)}
                        </span>
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
                                <CCol key={file.id} md={3} className="mb-4">
                                    <div
                                        className="position-relative bg-body-secondary p-3 rounded"
                                        style={{
                                            boxShadow: '0 10px 25px rgba(0,0,0,.15)',
                                            height: '100%',
                                            transition: 'transform .15s ease, box-shadow .15s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)'
                                            e.currentTarget.style.boxShadow =
                                                '0 15px 35px rgba(0,0,0,.25)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.boxShadow =
                                                '0 10px 25px rgba(0,0,0,.15)'
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                window.open(`/api/files/${file.id}`, '_blank')
                                            }
                                            title="Download"
                                            className="position-absolute bg-primary text-white border-0 rounded"
                                            style={{
                                                top: 10,
                                                right: 10,
                                                padding: '6px 10px',
                                                fontSize: 12,
                                                fontWeight: 600,
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faDownload} />
                                        </button>

                                        <div style={{ fontSize: 34, marginBottom: 10 }}>📄</div>

                                        <strong
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                wordBreak: 'break-word',
                                                fontSize: 14,
                                            }}
                                        >
                                            {file.file_name}
                                        </strong>

                                        <div
                                            style={{ fontSize: 12, marginTop: 6, color: '#9ca3af' }}
                                        >
                                            {getSize(file.file_size)} ·{' '}
                                            {new Date(file.created_at).toLocaleDateString()}
                                        </div>

                                        <div
                                            style={{
                                                marginTop: 10,
                                                display: 'inline-block',
                                                background: '#1f2937',
                                                padding: '4px 8px',
                                                borderRadius: 999,
                                                fontSize: 11,
                                                color: '#d1d5db',
                                            }}
                                        >
                                            {file.user.name}
                                        </div>
                                    </div>
                                </CCol>
                            ))}
                        </CRow>
                        <AppPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            setTotalPages={setTotalPages}
                        />
                    </>
                )}
            </div>
        </>
    )
}

export default Drive
