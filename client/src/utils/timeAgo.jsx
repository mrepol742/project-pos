import React from 'react'

const timeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`
    const years = Math.floor(months / 12)
    return `${years} year${years !== 1 ? 's' : ''} ago`
}

export default timeAgo
