import '../styles/admin.scss'
import Button from '../components/Button'
import Collapsible from '../components/collapsible'
import { useState, useEffect } from 'react'
// import sweet alert and sweetalertreact
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import NotifModal from '../components/input-fields/Create-notif-modal'
import { sendNotif } from '../helper'
const Settings = () => {
  const modal = withReactContent(Swal)
  useEffect(() => {
    document.title = 'Admin center - Emperia'
  }, [])
  return (
    <div id="admin">
      <h1>Admin control panel</h1>
      <div className="button-top">
        <Button normal={false} content="Show sections" to="/section" />
        <Button
          normal={true}
          btn={true}
          content="Send a notification"
          onClick={async () => {
            //* fire a modal with 2 input fields
            const data = await modal.fire({
              title: 'Send a notification',
              html: <NotifModal />,
              focusConfirm: false,
              showCancelButton: true,
              confirmButtonText: 'Send',
              cancelButtonText: 'Cancel',
              preConfirm: () => {
                console.log('confirm button pressed')
                //* get value from input fields
                const title = document.getElementById('title').value
                const message = document.getElementById('message').value
                const to = document.getElementById('to').value
                // console.log(to)
                if (title === '' || message === '' || to === '') {
                  Swal.showValidationMessage('Please fill all fields')
                }
                // console.log(section, members)
                return { title, message, to }
              },
            })
            data.isConfirmed &&
              sendNotif(data.value.to, {
                title: data.value.title,
                message: data.value.message,
              })
            data.isConfirmed &&
              (await Swal.fire({
                title: 'Sent',
                html: 'Your notification has been sent',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
              }))
          }}
        />
      </div>
      <Collapsible
        label="Contact Support"
        open={true}
        url="/api/admin/contact"
        col1="Name"
        col2="Time sent"
        col3="Message"
      />
      <Collapsible
        label="Bug reports"
        open={false}
        url="/api/admin/bugs"
        col1="Name"
        col2="Time sent"
        col3="Message"
      />
    </div>
  )
}

export default Settings
