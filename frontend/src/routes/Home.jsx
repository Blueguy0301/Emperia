import '../styles/home.scss'
import Cards from '../components/swiper/Event_Swiper'
// import Slideshow from '../components/swiper/Slideshow'
import { useState, useEffect, useRef } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { logout, accept } from '../helper'
import PrivacyPolicy from '../components/PrivacyPolicy'
import useQuery from '../components/logic/useQuery'
import Contact from './Contact'
import useCookies from '../components/logic/useCookies'
const Home = () => {
  const query = useQuery()
  const MySwal = withReactContent(Swal)
  const [RURL, setRURL] = useState()
  const [Greeting, setGreeting] = useState('')
  const [Username, setUsername] = useState('')
  const { Level, isFaculty, userName } = useCookies()
  const admin = Level?.toLowerCase() === 'admin'
  const isGuest = Level?.toLowerCase() === 'guest'
  const url = admin ? '/api/admin/all' : '/api/events/invited'
  const isMountedRef = useRef()
  const showModal =
    Cookies.get('first', { domain: 'emperia.online' }) === 'false'
  let error = query.get('error')?.toString()
  //* modal for first time user
  const show = async () => {
    //showModal && console.log('modal ran')
    const result =
      showModal &&
      (await MySwal.fire({
        title: 'Welcome',
        text: 'This website uses cookies to run. We recommend you to not use incognito or disabling cookies to use this website.',
        confirmButtonText: `Okay`,
        icon: 'info',
        allowOutsideClick: false,
      }))
    if (result.isConfirmed) {
      const privacy = await MySwal.fire({
        title: 'Privacy Policy',
        html: <PrivacyPolicy></PrivacyPolicy>,
        showCancelButton: true,
        confirmButtonText: `I accept`,
        cancelButtonText: `I decline`,
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
      if (!privacy.isConfirmed) {
        logout()
      }
      accept()

      Cookies.remove('first', { domain: 'emperia.online' })
    }
  }
  error = error && JSON.parse(error)
  useEffect(() => {
    //convert error to json
    isMountedRef.current = true
    isMountedRef.current && showModal && show()
    document.title = isMountedRef.current && 'Home - Emperia'
    const data = async () => {
      if (isGuest) {
        const result = await MySwal.fire({
          title: 'You are not logged in',
          text: 'Please login to continue',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1e519e',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Login',
          cancelButtonText: 'Exit to login page',
        })
        //check if user clicks on confirm button
        if (result.value) {
          login()
        } else {
          logout()
        }
      }
      //check if it's morning afternoon or evening
      const time = new Date().getHours()
      const greeting =
        time < 12 ? 'Morning' : time < 18 ? 'Afternoon' : 'Evening'
      isMountedRef.current && setGreeting(greeting)
      isMountedRef.current &&
        setUsername(
          //remove the parentheses and the contents insidefrom the username
          userName?.split(',')[1]
        )
    }
    data()
    if (error) {
      window.history.replaceState({}, '', '/home')
      isMountedRef.current &&
        MySwal.fire({ icon: 'error', title: error.title, text: error.message })
    }
    return () => {
      isMountedRef.current = false
    }
  }, [])
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
        const result = await axiosInstance.post('/api/events/join', {
          code: MySwal.getInput().value,
          guest: false,
        })
        if (!result.data.success) {
          return MySwal.fire({
            title: 'Error',
            text: 'No events found',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
          })
        }
        return MySwal.fire({
          title: 'Success',
          text: result.data.message,
          icon: 'success',
        })
      },
    })
  }
  const Report = async () => {
    const result = await MySwal.fire({
      title: 'Contact',
      html: <Contact />,
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#1e519e',
      //check values
      preConfirm: async () => {
        const textField = document.getElementById('reportDetails').value
        const reportType = document.getElementById('reportType').checked
        //check if textfield is empty
        if (textField === '') {
          return MySwal.fire({
            title: 'Error',
            text: 'Please fill in the text field',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            willClose: () => {
              Report()
            },
          })
        }
        //send report and load
        const { data } = await axiosInstance.post('/api/contact', {
          reportType: reportType ? 'bug' : 'contact',
          body: textField,
        })
        if (data.saved) {
          return MySwal.fire({
            title: 'Success',
            text: `The report has been sent to the admins.`,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
          })
        }
      },
    })
    if (result.isConfirmed) {
    }
  }
  return (
    <>
      <h1 className="welcome">{Greeting && `Good ${Greeting}, ${Username}`}</h1>
      <div className="cards">
        <div
          className="flex Create-Event"
          style={!isFaculty ? { justifyContent: 'left' } : {}}
        >
          <h2
            className="title-headers"
            style={!isFaculty ? { width: '100%' } : {}}
          >
            Invited Events:
          </h2>
          <div className="btn-group">
            {isFaculty && (
              <Link to="/createevent" className="Btn-Primary">
                Create Event
              </Link>
            )}
            {!admin && (
              <button className="Btn-Primary" onClick={Modal}>
                Join Event
              </button>
            )}
            {admin && (
              <Link to="/admin" className="Btn-Primary">
                Admin Center
              </Link>
            )}
          </div>
        </div>
        <Cards url={url} clickable={true} BottomText="Starts on" />
        <div className="home">
          <div className="events">
            <h2 className="title-headers">Current Events</h2>
            <Cards
              url={`/api/events/current`}
              clickable={true}
              BottomText="Ends on"
              ending={true}
            />
          </div>
          <div className="events">
            <h2 className="title-headers">Ended events</h2>
            <Cards
              url={`/api/events/ended`}
              clickable={true}
              BottomText="Ended on"
              ending={true}
            />
          </div>
        </div>
      </div>
      <h2 className="title-headers">Random events:</h2>
      <Cards url="/api/events/upcoming" clickable={false} />
      <div className="help flex">
        <h2>Need assistance? </h2>
        <button onClick={Report} className="Btn-Primary">
          Contact us!
        </button>
      </div>
    </>
  )
}
export default Home
