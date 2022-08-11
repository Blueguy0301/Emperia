import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { check, login, addGuest } from '../../helper'
import Record from '../input-fields/Record'
export const joinModals = (isGuest, setUrl) => {
  const MySwal = withReactContent(Swal)
  //add guests
  const openField = async code => {
    const pressed = await MySwal.fire({
      title: 'For the record...',
      // text: `Please fill out the following information to join the event:`,
      html: <Record />,
      icon: 'info',
      showConfirmButton: true,
      preConfirm: async () => {
        const name = document.getElementById('Name').value
        const school = document.getElementById('School').value
        if (name === '' || school === '') {
          return await MySwal.fire({
            title: 'Error',
            text: 'Please fill out all fields',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false,
            didOpen: () => {
              openField(code)
            },
          })
        }
        const redirect = await addGuest({ Name: name, School: school }, code)
        return redirect
      },
    })
    return pressed
  }
  const Modal = () => {
    MySwal.fire({
      title: 'Join a syncronous event',
      text: 'Enter the invite code:',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Join',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        Swal.showLoading()
        //get input value
        const code = MySwal.getInput().value
        //check if it's not empty
        if (code === '') {
          return await MySwal.fire({
            title: 'Error',
            text: 'Please enter an invite code',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false,
            didClose: () => {
              Modal()
            },
          })
        }
        const iserror = await check(code)
        // console.log(iserror)
        if (!iserror) {
          return await MySwal.fire({
            title: 'Error',
            text: 'No events found',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            didClose: () => {
              Modal()
            },
          })
        }
        const data = await openField(code)
        setUrl(data.value)
        return data
      },
    })
  }
  return Modal
}

export const LoginModal = () => {
  const MySwal = withReactContent(Swal)
  const modal = async () => {
    await MySwal.fire({
      title: 'Login',
      text: 'we are redirecting you to office 365 to login...',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: async () => {
        MySwal.showLoading()
      },
      didClose: async () => {
        const result = await login()
      },
    })
  }
  return modal
}
