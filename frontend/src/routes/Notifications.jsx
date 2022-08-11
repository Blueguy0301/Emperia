import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axiosInstance from '../utils/axiosInstance'
import '../styles/notifications.scss'
import { Redirect } from 'react-router-dom'
const Notifications = () => {
  document.title = 'Notifications - Emperia'
  const [notifications, setNotifications] = useState([])
  const [url, setUrl] = useState()
  const MySwal = withReactContent(Swal)
  useEffect(() => {
    const data = async () => {
      const notifications = await axiosInstance
        .get('/api/users/notifications')
        .then(res => res.data)
      setNotifications(notifications)
      // console.log(notifications)
    }
    data()
  }, [])
  const runNotification = async notification => {
    console.log()
    const modal = await MySwal.fire({
      title: notification.body.title,
      text: notification.body.message,
      icon: 'info',
      showCancelButton: notification.code !== 'ADMIN ANNOUNCEMENT',
      confirmButtonText: 'Mark as read',
      cancelButtonText: 'Join Now',
      cancelButtonColor: '#269E86',
      confirmButtonColor: '#1E519E',
    })
    console.log(modal)
    if (modal.isConfirmed) {
      const { success } = await axiosInstance
        .post(`/api/users/read/`, {
          notification_id: notification._id,
        })
        .then(res => res.data)
      if (success) {
        const newNotifications = notifications.map(notif => {
          if (notif._id === notification._id) {
            notif.read = true
          }
          return notif
        })
        setNotifications(newNotifications)
      }
    }
    if (modal.dismiss === 'cancel') {
      let isAsync = notification.body.message.includes('Asynchronous Event')
       setUrl(`/${isAsync ? 'event' : 'live'}/${notification.code}`)
    }
  }
  return (
    <div className="notif">
      {url && <Redirect to={url} />}
      <h1>Notifications</h1>
      <div className="notif-container">
        <div type="button" className="notif-btn">
          <h3 className="time">Date sent</h3>
          <h3 className="sender">Sender</h3>
          <h3 className="title">Title</h3>
        </div>
        {notifications.length > 0 &&
          notifications.map(notification => (
            <button
              type="button"
              className={'notif-btn ' + (notification.read ? 'read' : 'unread')}
              onClick={() => {
                runNotification(notification)
              }}
              key={notification._id}
            >
              <h3 className="time">{notification.created_at}</h3>
              <p className="sender">{notification.sender}</p>
              <p className="title">{notification.body.title}</p>
            </button>
          ))}
        {notifications.length === 0 && <p>No notifications</p>}
      </div>
    </div>
  )
}

export default Notifications
