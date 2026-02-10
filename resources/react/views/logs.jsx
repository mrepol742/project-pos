import React, { useEffect, useState } from 'react'
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CListGroup,
    CListGroupItem,
    CSpinner,
    CAlert,
} from '@coreui/react'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import axiosInstance from '../services/axios'

const Logs = () => {
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [content, setContent] = useState([])
    const [loadingFiles, setLoadingFiles] = useState(true)
    const [loadingContent, setLoadingContent] = useState(false)

    useEffect(() => {
        fetchFiles()
    }, [])

    const fetchFiles = async () => {
        try {
            const res = await axiosInstance.get('/logs')
            setFiles(res.data)
        } catch (e) {
            console.error('Error fetching log files:', e)
            toast.error('Failed to load log files')
        } finally {
            setLoadingFiles(false)
        }
    }

    const fetchLogContent = async (filename) => {
        setSelectedFile(filename)
        setLoadingContent(true)

        try {
            const res = await axiosInstance.get(`/logs/${filename}`)
            setContent(res.data.content)
        } catch (e) {
            console.error('Error fetching log content:', e)
            toast.error('Failed to load log file')
        } finally {
            setLoadingContent(false)
        }
    }

    return (
        <>
            <Helmet>
                <title>Logs - Project POS</title>
            </Helmet>

            <CRow className="mb-3">
                <CCol>
                    <h1>Logs</h1>
                    <span>{files.length.toLocaleString()} Logs</span>
                </CCol>
            </CRow>

            <CRow>
                <CCol md={3} className="mb-3">
                    <CCard>
                        <CCardBody style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            {loadingFiles && <CSpinner size="sm" />}
                            {!loadingFiles && files.length === 0 && (
                                <CAlert color="info">No log files found</CAlert>
                            )}

                            <CListGroup>
                                {files.map((file) => (
                                    <CListGroupItem
                                        className="border-0 rounded"
                                        key={file.name}
                                        active={file.name === selectedFile}
                                        onClick={() => fetchLogContent(file.name)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {file.name}
                                    </CListGroupItem>
                                ))}
                            </CListGroup>
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol md={9}>
                    <CCard>
                        <CCardBody
                            className="bg-body-secondary"
                            style={{
                                maxHeight: '80vh',
                                overflow: 'auto',
                                fontFamily: 'monospace',
                                fontSize: '13px',
                            }}
                        >
                            {!selectedFile && (
                                <CAlert color="secondary">
                                    Select a log file to view its content
                                </CAlert>
                            )}

                            {loadingContent && <CSpinner />}

                            {!loadingContent && content.length === 0 && selectedFile && (
                                <CAlert color="warning">Log file is empty</CAlert>
                            )}

                            <pre className="mb-0">
                                {content.map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </pre>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Logs
